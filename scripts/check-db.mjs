#!/usr/bin/env node
/**
 * Diagnosa kesiapan database BuzzHub tanpa kredensial DDL.
 *
 * Memeriksa:
 *   1. Apakah publishable key dan service role key diterima Supabase.
 *   2. Apakah RPC/tabel hasil migration hardening sudah ada.
 *
 * Pemakaian:
 *   npm run check:db
 *
 * Script ini hanya melakukan operasi baca dan pemanggilan RPC dengan argumen
 * kosong/tidak valid, sehingga tidak mengubah data.
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

function env(...names) {
  for (const name of names) {
    const value = process.env[name];
    if (value && value.trim()) return value.trim();
  }
  return null;
}

const url = env("SUPABASE_URL", "VITE_SUPABASE_URL");
const publishable = env("VITE_SUPABASE_PUBLISHABLE_KEY", "SUPABASE_PUBLISHABLE_KEY");
const secret = env("SUPABASE_SERVICE_ROLE_KEY", "SUPABASE_SECRET_KEY");

if (!url) {
  console.error("SUPABASE_URL tidak ditemukan. Jalankan `npm run check:env` lebih dulu.");
  process.exit(1);
}
if (!publishable) {
  console.error("Publishable key tidak ditemukan. Jalankan `npm run check:env` lebih dulu.");
  process.exit(1);
}

const results = [];
function record(name, ok, detail) {
  results.push({ name, ok, detail });
}

function headers(key) {
  return { apikey: key, "Content-Type": "application/json" };
}

async function request(path, init) {
  try {
    const response = await fetch(`${url}${path}`, init);
    const text = await response.text();
    let body = null;
    try {
      body = text ? JSON.parse(text) : null;
    } catch {
      body = null;
    }
    return { status: response.status, body, text };
  } catch (error) {
    return { status: 0, body: null, text: String(error?.message ?? error) };
  }
}

async function checkKey(label, key) {
  if (!key) {
    record(label, false, "tidak diisi");
    return false;
  }
  const response = await request("/rest/v1/app_accounts?select=email&limit=1", {
    headers: headers(key),
  });
  if (response.status === 200) {
    record(label, true, "diterima Supabase (HTTP 200)");
    return true;
  }
  if (response.status === 401) {
    record(label, false, "DITOLAK Supabase (HTTP 401) — key salah, sudah di-revoke, atau milik project lain");
    return false;
  }
  record(label, false, `HTTP ${response.status}${response.text ? ` — ${response.text.slice(0, 120)}` : ""}`);
  return false;
}

async function checkRpc(name, body) {
  const response = await request(`/rest/v1/rpc/${name}`, {
    method: "POST",
    headers: headers(publishable),
    body: JSON.stringify(body ?? {}),
  });
  const code = response.body && typeof response.body.code === "string" ? response.body.code : "";
  if (response.status === 404 || code === "PGRST202") {
    record(`RPC ${name}`, false, "belum ada di database (migration belum diterapkan)");
    return;
  }
  record(`RPC ${name}`, true, `ada (HTTP ${response.status})`);
}

async function checkTable(name) {
  const response = await request(`/rest/v1/${name}?select=*&limit=1`, {
    headers: headers(publishable),
  });
  const code = response.body && typeof response.body.code === "string" ? response.body.code : "";
  if (response.status === 404 || code === "PGRST205") {
    record(`Tabel ${name}`, false, "belum ada di database (migration belum diterapkan)");
    return;
  }
  if (response.status === 200) {
    record(`Tabel ${name}`, true, `ada, TAPI bisa dibaca publishable key — periksa RLS`);
    return;
  }
  record(`Tabel ${name}`, true, `ada dan terlindungi (HTTP ${response.status})`);
}

const zero = "00000000-0000-0000-0000-000000000000";

console.log("\nBuzzHub database check\n");

const publishableOk = await checkKey("Publishable key", publishable);
let secretOk = null;
if (secret) {
  secretOk = await checkKey("SUPABASE_SERVICE_ROLE_KEY", secret);
} else {
  record("SUPABASE_SERVICE_ROLE_KEY", false, "tidak diisi — operasi istimewa akan berjalan sebagai anon");
}

if (publishableOk) {
  await checkRpc("request_withdrawal", {
    p_buzzer_email: "",
    p_buzzer_name: "",
    p_amount: 0,
    p_method: "",
    p_account_no: "",
  });
  await checkRpc("submit_job_proof", {
    p_job_id: zero,
    p_buzzer_email: "",
    p_proof_url: "",
  });
  await checkRpc("update_profile", { p_email: "" });
  await checkRpc("admin_update_account", { p_email: "" });
  await checkRpc("mark_finance_notification_read", { p_id: zero });
  await checkTable("audit_logs");
}

console.log("Status:");
for (const item of results) {
  const label = item.ok ? "OK  " : "FAIL";
  console.log(`[${label}] ${item.name}: ${item.detail}`);
}

const failures = results.filter((item) => !item.ok);
console.log("");
if (failures.length > 0) {
  console.log(`${failures.length} pemeriksaan gagal.`);
  if (!secretOk && secret) {
    console.log("→ Ganti SUPABASE_SERVICE_ROLE_KEY dengan secret key dari project yang benar.");
  }
  if (failures.some((item) => item.name.startsWith("RPC ") || item.name.startsWith("Tabel "))) {
    console.log("→ Terapkan migration hardening: `npm run db:apply` (butuh DATABASE_URL/SUPABASE_DB_PASSWORD atau SUPABASE_ACCESS_TOKEN).");
  }
  process.exitCode = 1;
} else {
  console.log("Semua pemeriksaan lulus.");
}
