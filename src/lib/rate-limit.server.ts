/**
 * Rate limiter untuk operasi sensitif (login, ganti password, upload bukti,
 * pengajuan pencairan, checkout).
 *
 * Sumber kebenaran ada di Postgres (tabel `rate_limit_buckets` + RPC
 * `check_rate_limit`) sehingga batas berlaku lintas instance/isolate, bukan
 * hanya per proses. Bila penyimpanan bersama tidak tersedia (migration belum
 * diterapkan, jaringan putus, service role tidak dikonfigurasi), modul ini
 * turun ke hitungan in-memory per instance agar aplikasi tetap berjalan —
 * lapisan itu best-effort, bukan pengganti kontrol akses.
 *
 * Setiap aturan diperiksa pada dua dimensi:
 *   1. identitas (email akun) — menahan brute-force terhadap satu akun;
 *   2. alamat IP klien — menahan percobaan menyebar ke banyak email.
 *
 * Modul ini HANYA boleh diimpor dari handler server function.
 */
import { getRequest } from "@tanstack/react-start/server";

type MemoryBucket = {
  count: number;
  resetAt: number;
};

const memoryBuckets = new Map<string, MemoryBucket>();
const MAX_TRACKED_KEYS = 5000;

/** Batas atas panjang key agar aman terhadap kolom `text` + indeks. */
const MAX_KEY_LENGTH = 200;

export type RateLimitResult = {
  allowed: boolean;
  retryAfterSeconds: number;
  remaining: number;
};

export type RateLimitRule = {
  /** Jumlah maksimum percobaan per identitas dalam satu jendela waktu. */
  limit: number;
  /** Jumlah maksimum percobaan per alamat IP dalam satu jendela waktu. */
  ipLimit: number;
  /** Panjang jendela waktu dalam milidetik. */
  windowMs: number;
};

export type RateLimitOptions = {
  /** Nama operasi, mis. `login` atau `upload-proof`. */
  scope: string;
  /** Identitas pemanggil: email akun, atau nama berkas untuk tamu. */
  identity: string;
  rule: RateLimitRule;
};

export const RATE_LIMITS = {
  login: { limit: 8, ipLimit: 40, windowMs: 10 * 60 * 1000 },
  changePassword: { limit: 5, ipLimit: 20, windowMs: 10 * 60 * 1000 },
  uploadProof: { limit: 30, ipLimit: 150, windowMs: 60 * 60 * 1000 },
  requestWithdrawal: { limit: 5, ipLimit: 20, windowMs: 60 * 60 * 1000 },
  checkout: { limit: 5, ipLimit: 20, windowMs: 10 * 60 * 1000 },
} as const satisfies Record<string, RateLimitRule>;

// ---------------------------------------------------------------------------
// Alamat IP klien
// ---------------------------------------------------------------------------

function readHeader(name: string): string | undefined {
  try {
    const request = getRequest();
    const value = request?.headers?.get(name);
    return value ?? undefined;
  } catch {
    // Dipanggil di luar request scope (cron, script, build) — tidak ada IP.
    return undefined;
  }
}

/**
 * Alamat IP klien dari header proxy. Cloudflare mengisi `cf-connecting-ip`;
 * reverse proxy lain memakai `x-real-ip` atau `x-forwarded-for`.
 *
 * Header ini bisa dipalsukan bila aplikasi tidak berada di belakang proxy
 * tepercaya, jadi dimensi IP hanya lapisan tambahan — bukan pengganti
 * pembatasan per akun.
 */
export function getClientIp(): string {
  const candidates = [
    readHeader("cf-connecting-ip"),
    readHeader("x-real-ip"),
    readHeader("x-forwarded-for"),
    readHeader("x-vercel-forwarded-for"),
  ];

  for (const raw of candidates) {
    if (!raw) continue;
    const first = raw.split(",")[0]?.trim();
    if (first) return first.slice(0, 64);
  }
  return "";
}

// ---------------------------------------------------------------------------
// Fallback in-memory (hanya dipakai bila Postgres tidak bisa dihubungi)
// ---------------------------------------------------------------------------

function pruneMemory(now: number) {
  if (memoryBuckets.size < MAX_TRACKED_KEYS) return;
  for (const [key, bucket] of memoryBuckets) {
    if (bucket.resetAt <= now) memoryBuckets.delete(key);
  }
  while (memoryBuckets.size >= MAX_TRACKED_KEYS) {
    const oldest = memoryBuckets.keys().next().value;
    if (oldest === undefined) break;
    memoryBuckets.delete(oldest);
  }
}

function consumeMemory(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now();
  pruneMemory(now);

  const bucket = memoryBuckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    memoryBuckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfterSeconds: 0, remaining: Math.max(0, limit - 1) };
  }

  if (bucket.count >= limit) {
    return {
      allowed: false,
      retryAfterSeconds: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)),
      remaining: 0,
    };
  }

  bucket.count += 1;
  return { allowed: true, retryAfterSeconds: 0, remaining: Math.max(0, limit - bucket.count) };
}

// ---------------------------------------------------------------------------
// Postgres
// ---------------------------------------------------------------------------

let dbFailureLogged = false;
let lastPruneAt = 0;
const PRUNE_INTERVAL_MS = 60 * 60 * 1000;

function warnDbFailure(error: unknown) {
  if (dbFailureLogged) return;
  dbFailureLogged = true;
  console.warn(
    "[RateLimit] Penyimpanan bersama tidak tersedia, memakai fallback in-memory:",
    error instanceof Error ? error.message : error,
  );
}

function schedulePrune(adminClient: any) {
  const now = Date.now();
  if (now - lastPruneAt < PRUNE_INTERVAL_MS) return;
  lastPruneAt = now;
  // Best-effort: kegagalan prune tidak boleh memengaruhi request.
  Promise.resolve(adminClient.rpc("prune_rate_limit_buckets"))
    .then((result: { error?: unknown }) => {
      if (result?.error) warnDbFailure(result.error);
    })
    .catch(warnDbFailure);
}

async function consumeDb(
  key: string,
  limit: number,
  windowMs: number,
): Promise<RateLimitResult | null> {
  try {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const client = supabaseAdmin as any;
    const { data, error } = await client.rpc("check_rate_limit", {
      p_key: key,
      p_limit: limit,
      p_window_ms: windowMs,
    });
    if (error) throw error;

    const row = Array.isArray(data) ? data[0] : data;
    if (!row || typeof row.allowed !== "boolean") {
      throw new Error("Bentuk respons check_rate_limit tidak dikenal.");
    }

    schedulePrune(client);
    return {
      allowed: row.allowed,
      retryAfterSeconds: Math.max(0, Number(row.retry_after_seconds ?? 0)),
      remaining: Math.max(0, Number(row.remaining ?? 0)),
    };
  } catch (error) {
    warnDbFailure(error);
    return null;
  }
}

async function consume(key: string, limit: number, windowMs: number): Promise<RateLimitResult> {
  const fromDb = await consumeDb(key, limit, windowMs);
  if (fromDb) return fromDb;
  return consumeMemory(key, limit, windowMs);
}

// ---------------------------------------------------------------------------
// Key
// ---------------------------------------------------------------------------

/**
 * Key bucket tidak menyimpan email/IP mentah: nilainya di-hash SHA-256 agar
 * tabel rate limit tidak menjadi salinan data pribadi. Prefix tetap terbaca
 * supaya jenis operasi mudah ditelusuri.
 */
async function buildKey(scope: string, dimension: "id" | "ip", value: string): Promise<string> {
  const normalized = value.trim().toLowerCase() || "unknown";
  let digest: string;
  try {
    const bytes = new TextEncoder().encode(normalized);
    const hash = await crypto.subtle.digest("SHA-256", bytes);
    digest = Array.from(new Uint8Array(hash))
      .map((byte) => byte.toString(16).padStart(2, "0"))
      .join("");
  } catch {
    // Runtime tanpa SubtleCrypto: pakai nilai apa adanya (masih benar,
    // hanya tidak dianonimkan).
    digest = normalized;
  }
  return `rl:${scope}:${dimension}:${digest}`.slice(0, MAX_KEY_LENGTH);
}

// ---------------------------------------------------------------------------
// API publik
// ---------------------------------------------------------------------------

function formatRetryAfter(retryAfterSeconds: number): string {
  const seconds = Math.max(1, Math.ceil(retryAfterSeconds));
  if (seconds <= 90) return `${seconds} detik`;
  return `${Math.ceil(seconds / 60)} menit`;
}

export function rateLimitErrorMessage(retryAfterSeconds: number): string {
  return `Terlalu banyak percobaan. Coba lagi dalam ${formatRetryAfter(retryAfterSeconds)}.`;
}

/**
 * Periksa dan tambah hitungan untuk satu operasi pada dimensi identitas dan
 * (bila tersedia) IP. Hasil `allowed: false` berarti permintaan harus
 * ditolak.
 */
export async function checkRateLimit({
  scope,
  identity,
  rule,
}: RateLimitOptions): Promise<RateLimitResult> {
  const identityKey = await buildKey(scope, "id", identity);
  const identityResult = await consume(identityKey, rule.limit, rule.windowMs);
  if (!identityResult.allowed) return identityResult;

  const ip = getClientIp();
  if (!ip) return identityResult;

  const ipKey = await buildKey(scope, "ip", ip);
  const ipResult = await consume(ipKey, rule.ipLimit, rule.windowMs);
  if (!ipResult.allowed) return ipResult;

  return identityResult;
}

/** Lempar error bila batas terlampaui. */
export async function enforceRateLimit(options: RateLimitOptions): Promise<void> {
  const result = await checkRateLimit(options);
  if (result.allowed) return;
  throw new Error(rateLimitErrorMessage(result.retryAfterSeconds));
}

/** Pesan ramah untuk handler yang mengembalikan `{ ok, message }`. */
export async function rateLimitMessage(options: RateLimitOptions): Promise<string | null> {
  const result = await checkRateLimit(options);
  if (result.allowed) return null;
  return rateLimitErrorMessage(result.retryAfterSeconds);
}

/**
 * Hapus hitungan identitas (mis. setelah login berhasil) di Postgres dan
 * fallback in-memory. Hitungan IP sengaja tidak dihapus agar login yang sah
 * tidak me-reset perlindungan terhadap penyebaran percobaan dari satu IP.
 */
export async function resetRateLimit({
  scope,
  identity,
}: Pick<RateLimitOptions, "scope" | "identity">): Promise<void> {
  const key = await buildKey(scope, "id", identity);
  memoryBuckets.delete(key);
  try {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await (supabaseAdmin as any)
      .from("rate_limit_buckets")
      .delete()
      .eq("key", key);
    if (error) throw error;
  } catch (error) {
    warnDbFailure(error);
  }
}
