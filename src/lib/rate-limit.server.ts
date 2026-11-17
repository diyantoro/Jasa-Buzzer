/**
 * Rate limiter sederhana untuk operasi sensitif (login, ganti password,
 * upload bukti, pengajuan pencairan).
 *
 * Implementasi ini in-memory per instance server. Pada deployment
 * multi-instance / serverless (Cloudflare Workers), batasnya berlaku per
 * isolate sehingga hanya bersifat best-effort. Fase 3 harus menggantinya
 * dengan penyimpanan bersama (mis. tabel Postgres atau Redis/Upstash) agar
 * batas berlaku global.
 *
 * Catatan keamanan: limiter ini menambah lapisan pertahanan terhadap
 * brute-force dan spam, bukan pengganti kontrol akses.
 */

type Bucket = {
  count: number;
  resetAt: number;
};

const buckets = new Map<string, Bucket>();
const MAX_TRACKED_KEYS = 5000;

function pruneExpired(now: number) {
  if (buckets.size < MAX_TRACKED_KEYS) return;
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key);
  }
  // Kalau masih penuh, buang entri paling lama (Map menjaga urutan insert).
  while (buckets.size >= MAX_TRACKED_KEYS) {
    const oldest = buckets.keys().next().value;
    if (oldest === undefined) break;
    buckets.delete(oldest);
  }
}

export type RateLimitResult = {
  allowed: boolean;
  retryAfterSeconds: number;
  remaining: number;
};

/**
 * Cek dan tambah hitungan untuk `key`.
 *
 * @param key Pengenal unik, mis. `login:user@example.com`.
 * @param limit Jumlah maksimum percobaan dalam satu jendela waktu.
 * @param windowMs Panjang jendela waktu dalam milidetik.
 */
export function checkRateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now();
  pruneExpired(now);

  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
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

/** Hapus hitungan (mis. setelah login berhasil). */
export function resetRateLimit(key: string) {
  buckets.delete(key);
}

/** Lempar error bila batas terlampaui. */
export function enforceRateLimit(key: string, limit: number, windowMs: number): void {
  const result = checkRateLimit(key, limit, windowMs);
  if (result.allowed) return;
  throw new Error(
    `Terlalu banyak percobaan. Coba lagi dalam ${result.retryAfterSeconds} detik.`,
  );
}

/** Pesan ramah untuk handler yang mengembalikan { ok, message }. */
export function rateLimitMessage(key: string, limit: number, windowMs: number): string | null {
  const result = checkRateLimit(key, limit, windowMs);
  if (result.allowed) return null;
  return `Terlalu banyak percobaan. Coba lagi dalam ${result.retryAfterSeconds} detik.`;
}

export const RATE_LIMITS = {
  login: { limit: 8, windowMs: 10 * 60 * 1000 },
  changePassword: { limit: 5, windowMs: 10 * 60 * 1000 },
  uploadProof: { limit: 30, windowMs: 60 * 60 * 1000 },
  requestWithdrawal: { limit: 5, windowMs: 60 * 60 * 1000 },
} as const;
