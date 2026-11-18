#!/usr/bin/env node
/**
 * Gabungkan enam migration hardening menjadi satu file SQL yang bisa
 * ditempel sekali ke Supabase SQL Editor.
 *
 * Pemakaian:
 *   npm run db:bundle
 *
 * File hasil: supabase/hardening_bundle.sql (di luar folder migrations agar
 * tidak dianggap migration oleh Supabase CLI).
 */
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(process.cwd());

const migrations = [
  "20261116000000_harden_rls_phase1.sql",
  "20261116000001_phase1_bridge_rpcs.sql",
  "20261116000002_harden_rls_phase2_accounts.sql",
  "20261116000003_harden_rls_phase2b.sql",
  "20261116000004_harden_storage_writes.sql",
  "20261116000005_audit_logs.sql",
  "20261116000006_harden_bridge_rpc_grants.sql",
  "20261116000007_fix_relations_and_constraints.sql",
  "20261116000008_lock_guest_checkout_rpcs.sql",
  "20261116000009_financial_ledger.sql",
];

const header = `-- =====================================================================
-- FILE HASIL GENERATE - jangan diedit manual.
-- Regenerate dengan: npm run db:bundle
--
-- Tempel seluruh isi file ini ke Supabase SQL Editor, lalu Run.
-- Terapkan setelah SUPABASE_SERVICE_ROLE_KEY valid terisi, karena policy
-- di bawah mencabut tulis langsung dari role anon.
-- =====================================================================

`;

const parts = migrations.map((file) => {
  const path = resolve(root, "supabase", "migrations", file);
  const sql = readFileSync(path, "utf8").trimEnd();
  return `-- >>> ${file}\n\n${sql}\n`;
});

const output = header + parts.join("\n") + "\n";
const target = resolve(root, "supabase", "hardening_bundle.sql");
writeFileSync(target, output, "utf8");

console.log(`Bundle dibuat: ${target}`);
console.log(`Ukuran: ${output.length} karakter, ${migrations.length} migration.`);
