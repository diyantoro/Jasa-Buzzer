#!/usr/bin/env node
/**
 * Validasi environment BuzzHub tanpa membocorkan nilai rahasia.
 *
 * Pemakaian:
 *   node scripts/check-env.mjs
 *   npm run check:env
 *
 * Script ini hanya mencetak status, panjang, dan prefix singkat — tidak pernah
 * mencetak isi key.
 */
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(process.cwd());
const envPath = resolve(root, ".env");

function loadEnvFile(file) {
  if (!existsSync(file)) return;
  const raw = readFileSync(file, "utf8");
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq <= 0) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (process.env[key] === undefined) process.env[key] = value;
  }
}

loadEnvFile(envPath);

const checks = [];

function value(...names) {
  for (const name of names) {
    const candidate = process.env[name];
    if (candidate && candidate.trim()) return { name, value: candidate.trim() };
  }
  return null;
}

function jwtRole(token) {
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  try {
    const payload = JSON.parse(
      Buffer.from(parts[1].replace(/-/g, "+").replace(/_/g, "/"), "base64").toString("utf8"),
    );
    return typeof payload.role === "string" ? payload.role : null;
  } catch {
    return null;
  }
}

function describe(secret) {
  const prefix = secret.slice(0, 12);
  return `${prefix}… (${secret.length} chars)`;
}

function record(name, ok, detail, hint) {
  checks.push({ name, ok, detail, hint });
}

/* ------------------------------------------------------------------ */
/* Supabase URL                                                        */
/* ------------------------------------------------------------------ */
const url = value("SUPABASE_URL", "VITE_SUPABASE_URL");
if (!url) {
  record("SUPABASE_URL", false, "tidak ditemukan", "Isi SUPABASE_URL / VITE_SUPABASE_URL di .env.");
} else {
  let ok = false;
  try {
    const parsed = new URL(url.value);
    ok = parsed.protocol === "https:" || parsed.hostname === "localhost" || parsed.hostname === "127.0.0.1";
  } catch {
    ok = false;
  }
  record("SUPABASE_URL", ok, ok ? url.value : "bukan URL valid", "Gunakan https://<project-ref>.supabase.co");
}

/* ------------------------------------------------------------------ */
/* Publishable key                                                     */
/* ------------------------------------------------------------------ */
const publishable = value("VITE_SUPABASE_PUBLISHABLE_KEY", "SUPABASE_PUBLISHABLE_KEY");
if (!publishable) {
  record(
    "VITE_SUPABASE_PUBLISHABLE_KEY",
    false,
    "tidak ditemukan",
    "Isi publishable/anon key (aman untuk client).",
  );
} else {
  const ok = publishable.value.startsWith("sb_publishable_") || jwtRole(publishable.value) === "anon";
  record(
    "VITE_SUPABASE_PUBLISHABLE_KEY",
    ok,
    describe(publishable.value),
    ok ? undefined : "Nilai ini bukan publishable key (sb_publishable_...) atau JWT anon.",
  );
}

/* ------------------------------------------------------------------ */
/* Service role key                                                    */
/* ------------------------------------------------------------------ */
const service = value("SUPABASE_SERVICE_ROLE_KEY", "SUPABASE_SECRET_KEY");
if (!service) {
  record(
    "SUPABASE_SERVICE_ROLE_KEY",
    false,
    "kosong",
    "Isi secret key dari Supabase Dashboard → Project Settings → API. Tanpa ini semua operasi istimewa ditolak RLS.",
  );
} else if (service.value.startsWith("sb_publishable_")) {
  record(
    "SUPABASE_SERVICE_ROLE_KEY",
    false,
    "berisi publishable key, bukan secret",
    "Ganti dengan sb_secret_... (server-only). Jangan pakai publishable key.",
  );
} else if (service.value.startsWith("sb_secret_")) {
  record("SUPABASE_SERVICE_ROLE_KEY", true, describe(service.value));
} else {
  const role = jwtRole(service.value);
  const ok = role === "service_role";
  record(
    "SUPABASE_SERVICE_ROLE_KEY",
    ok,
    ok ? describe(service.value) : "JWT tanpa role service_role",
    ok ? undefined : "Gunakan secret key sb_secret_... atau JWT service_role.",
  );
}

/* ------------------------------------------------------------------ */
/* Session secret                                                      */
/* ------------------------------------------------------------------ */
const session = value("SESSION_SECRET");
if (!session) {
  record(
    "SESSION_SECRET",
    false,
    "tidak ditemukan",
    "Buat string acak minimal 32 karakter, mis. `openssl rand -hex 32`.",
  );
} else {
  const ok = session.value.length >= 32;
  record(
    "SESSION_SECRET",
    ok,
    `${session.value.length} chars`,
    ok ? undefined : "Minimal 32 karakter agar HMAC cookie sesi kuat.",
  );
}

/* ------------------------------------------------------------------ */
/* Optional: koneksi database untuk migration                          */
/* ------------------------------------------------------------------ */
const dbUrl = value("DATABASE_URL", "SUPABASE_DB_URL");
const dbPassword = value("SUPABASE_DB_PASSWORD");
record(
  "DATABASE_URL / SUPABASE_DB_PASSWORD",
  Boolean(dbUrl || dbPassword),
  dbUrl ? "DATABASE_URL tersedia" : dbPassword ? "SUPABASE_DB_PASSWORD tersedia" : "tidak ada (opsional)",
  "Dibutuhkan hanya untuk `npm run db:apply` (menerapkan migration hardening).",
);

/* ------------------------------------------------------------------ */
/* Report                                                              */
/* ------------------------------------------------------------------ */
const label = (ok) => (ok ? "OK  " : "FAIL");
console.log("\nBuzzHub environment check\n");
for (const check of checks) {
  console.log(`[${label(check.ok)}] ${check.name}: ${check.detail}`);
  if (!check.ok && check.hint) console.log(`       → ${check.hint}`);
}

const required = checks.filter((c) => !c.name.startsWith("DATABASE_URL"));
const failedRequired = required.filter((c) => !c.ok);
console.log("");
if (failedRequired.length > 0) {
  console.log(`${failedRequired.length} variabel wajib belum valid. Aplikasi belum aman dijalankan.`);
  process.exitCode = 1;
} else {
  console.log("Semua variabel wajib valid.");
}

const dbReady = Boolean(dbUrl || dbPassword);
if (!dbReady) {
  console.log("Catatan: migration hardening belum bisa diterapkan otomatis tanpa DATABASE_URL/SUPABASE_DB_PASSWORD.");
}
