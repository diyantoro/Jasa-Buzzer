#!/usr/bin/env node
/**
 * Diagnosa kesiapan database BuzzHub tanpa kredensial DDL.
 *
 * Memeriksa:
 *   1. Apakah publishable key dan service role key diterima Supabase.
 *   2. Apakah RPC/tabel hasil migration hardening sudah ada dan bisa dipakai
 *      oleh service_role.
 *   3. Apakah RPC istimewa dan tabel audit benar-benar tertutup untuk anon.
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

// Tabel publik yang boleh dibaca anon. Dipakai sebagai kanari: kalau key
// ditolak di sini, berarti key-nya memang bermasalah. Jangan memakai
// app_accounts — tabel itu sengaja dikunci oleh migration hardening.
const CANARY = "/rest/v1/service_catalogs?select=id&limit=1";
const zero = "00000000-0000-0000-0000-000000000000";

const results = [];
function record(name, ok, detail) {
  results.push({ name, ok, detail });
}

/**
 * `authorize` menambahkan header Authorization. Diperlukan untuk JWT legacy
 * (service_role), karena apikey saja membuat PostgREST memakai role anon.
 */
function headers(key, authorize = false) {
  const value = { apikey: key, "Content-Type": "application/json" };
  if (authorize) value.Authorization = `Bearer ${key}`;
  return value;
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

function errorCode(result) {
  return result.body && typeof result.body.code === "string" ? result.body.code : "";
}

function errorDetail(result) {
  const message = result.body && typeof result.body.message === "string" ? result.body.message : "";
  if (message) return message.slice(0, 120);
  return result.text ? result.text.slice(0, 120) : "";
}

function isPermissionDenied(result) {
  return result.status === 401 || result.status === 403 || errorCode(result) === "42501";
}

async function checkKey(label, key, authorize) {
  if (!key) {
    record(label, false, "tidak diisi");
    return false;
  }

  const response = await request(CANARY, { headers: headers(key, authorize) });

  if (response.status === 200) {
    record(label, true, "diterima Supabase (HTTP 200)");
    return true;
  }
  if (errorCode(response) === "42501") {
    record(
      label,
      false,
      `key dikenali, tetapi aksesnya ditolak policy/grant (42501) pada ${CANARY.split("?")[0]}`,
    );
    return false;
  }
  if (isPermissionDenied(response)) {
    record(
      label,
      false,
      `DITOLAK Supabase (HTTP ${response.status}) — key salah, sudah di-revoke, atau milik project lain`,
    );
    return false;
  }

  record(label, false, `HTTP ${response.status} — ${errorDetail(response)}`);
  return false;
}

async function callRpc(name, body, key, authorize) {
  return request(`/rest/v1/rpc/${name}`, {
    method: "POST",
    headers: headers(key, authorize),
    body: JSON.stringify(body ?? {}),
  });
}

async function checkPrivilegedRpc(name, body) {
  const label = `RPC ${name}`;

  if (!secret) {
    record(label, false, "tidak bisa diverifikasi — SUPABASE_SERVICE_ROLE_KEY kosong");
    return;
  }

  const asService = await callRpc(name, body, secret, true);
  const code = errorCode(asService);

  if (asService.status === 404 || code === "PGRST202") {
    record(label, false, "belum ada di database (migration belum diterapkan)");
    return;
  }
  if (asService.status === 401 || asService.status === 403 || code === "42501") {
    record(
      label,
      false,
      `ada, tetapi service_role tidak boleh mengeksekusinya (HTTP ${asService.status}${
        code ? ` ${code}` : ""
      }) — periksa GRANT EXECUTE`,
    );
    return;
  }

  // Fase 3: pastikan anon tidak bisa memanggil RPC istimewa ini.
  const asAnon = await callRpc(name, body, publishable, false);
  const anonCode = errorCode(asAnon);

  if (anonCode === "PGRST202" || asAnon.status === 404) {
    record(label, true, "ada dan hanya untuk service_role (tidak terlihat anon)");
    return;
  }
  if (isPermissionDenied(asAnon)) {
    record(label, true, "ada, dan tertutup untuk publishable key");
    return;
  }

  record(
    label,
    false,
    `bisa dipanggil publishable key (HTTP ${asAnon.status}) — hardening bocor`,
  );
}

async function checkProtectedTable(name) {
  const label = `Tabel ${name}`;

  if (!secret) {
    record(label, false, "tidak bisa diverifikasi — SUPABASE_SERVICE_ROLE_KEY kosong");
    return;
  }

  const asService = await request(`/rest/v1/${name}?select=*&limit=1`, {
    headers: headers(secret, true),
  });
  const code = errorCode(asService);

  if (asService.status === 404 || code === "PGRST205") {
    record(label, false, "belum ada di database (migration belum diterapkan)");
    return;
  }
  if (asService.status !== 200) {
    record(
      label,
      false,
      `service_role tidak bisa membacanya (HTTP ${asService.status}${code ? ` ${code}` : ""})`,
    );
    return;
  }

  const asAnon = await request(`/rest/v1/${name}?select=*&limit=1`, {
    headers: headers(publishable),
  });
  const anonCode = errorCode(asAnon);

  if (anonCode === "PGRST205") {
    record(label, true, "ada, dan tidak terlihat oleh publishable key");
    return;
  }
  if (isPermissionDenied(asAnon)) {
    record(label, true, "ada, hanya service_role yang bisa membaca");
    return;
  }

  record(label, false, `bisa dibaca publishable key (HTTP ${asAnon.status}) — hardening bocor`);
}

const PRIVILEGED_RPCS = [
  [
    "request_withdrawal",
    {
      p_buzzer_email: "",
      p_buzzer_name: "",
      p_amount: 0,
      p_method: "",
      p_account_no: "",
    },
  ],
  ["submit_job_proof", { p_job_id: zero, p_buzzer_email: "", p_proof_url: "" }],
  ["update_profile", { p_email: "" }],
  ["admin_update_account", { p_email: "" }],
  ["mark_finance_notification_read", { p_id: zero }],
  ["claim_campaign_job", { p_job_id: zero, p_buzzer_email: "", p_buzzer_name: "" }],
  [
    "create_customer_custom_scheduled_payment_campaign",
    {
      p_invoice_no: "",
      p_customer_name: "",
      p_customer_email: "",
      p_campaign_name: "",
      p_platform: "",
      p_service_type: "",
      p_method: "",
      p_note: "",
      p_brief: "",
      p_slots: 1,
      p_start_date: "2026-11-18",
      p_deadline: "2026-11-30",
    },
  ],
];

console.log("\nBuzzHub database check\n");

const publishableOk = await checkKey("Publishable key", publishable, false);
let secretOk = null;
if (secret) {
  secretOk = await checkKey("SUPABASE_SERVICE_ROLE_KEY", secret, true);
} else {
  record("SUPABASE_SERVICE_ROLE_KEY", false, "tidak diisi — operasi istimewa akan berjalan sebagai anon");
}

if (publishableOk) {
  for (const [name, body] of PRIVILEGED_RPCS) {
    await checkPrivilegedRpc(name, body);
  }
  await checkProtectedTable("audit_logs");
  await checkProtectedTable("financial_ledger");
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
  if (secret && secretOk === false) {
    const canaryBlocked = failures.some(
      (item) => item.name === "SUPABASE_SERVICE_ROLE_KEY" && item.detail.includes("DITOLAK"),
    );
    if (canaryBlocked) {
      console.log("→ Ganti SUPABASE_SERVICE_ROLE_KEY dengan secret key dari project yang benar.");
    }
  }
  if (failures.some((item) => item.detail.includes("migration belum diterapkan"))) {
    console.log(
      "→ Terapkan migration hardening: `npm run db:apply` (butuh SUPABASE_ACCESS_TOKEN dengan permission Database: Read-write, atau DATABASE_URL/SUPABASE_DB_PASSWORD).",
    );
  }
  if (failures.some((item) => item.detail.includes("hardening bocor"))) {
    console.log("→ Ada jalur tulis/baca yang masih terbuka untuk anon. Periksa REVOKE/GRANT dan policy.");
  }
  process.exitCode = 1;
} else {
  console.log("Semua pemeriksaan lulus.");
}
