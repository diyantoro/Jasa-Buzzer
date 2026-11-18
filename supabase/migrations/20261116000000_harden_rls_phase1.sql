-- =====================================================================
-- Migration: 20261116000000_harden_rls_phase1.sql
-- Fase 1 - tutup lubang uang. File baru; migrasi lama tidak disentuh.
--
-- PRASYARAT RILIS
--   Migrasi ini mencabut seluruh kemampuan tulis langsung dari role
--   `anon`. Jalankan BERSAMAAN dengan rilis kode yang memindahkan
--   operasi istimewa ke RPC / server function (service_role).
--
--   Wajib: SUPABASE_SERVICE_ROLE_KEY harus berisi secret key asli
--   (sb_secret_... atau JWT service_role). Tanpa itu server function
--   berjalan sebagai anon dan akan ditolak oleh policy di bawah.
--
-- Setelah migrasi ini, satu-satunya jalur tulis ke tabel uang adalah:
--   * RPC SECURITY DEFINER, atau
--   * server function TanStack dengan service_role key.
-- =====================================================================

BEGIN;

-- ---------------------------------------------------------------------
-- 1. RATE CARD & KATALOG  ->  read-only untuk anon
--    Sebelumnya: FOR ALL USING(true) sehingga harga bisa diubah client.
-- ---------------------------------------------------------------------
REVOKE INSERT, UPDATE, DELETE, TRUNCATE
  ON public.service_pricing, public.service_catalogs, public.catalog_packages
  FROM anon, authenticated;

GRANT SELECT
  ON public.service_pricing, public.service_catalogs, public.catalog_packages
  TO anon, authenticated;

DROP POLICY IF EXISTS "service pricing access"  ON public.service_pricing;
DROP POLICY IF EXISTS "service catalogs access" ON public.service_catalogs;
DROP POLICY IF EXISTS "catalog packages access" ON public.catalog_packages;

DROP POLICY IF EXISTS "service pricing read"  ON public.service_pricing;
DROP POLICY IF EXISTS "service catalogs read" ON public.service_catalogs;
DROP POLICY IF EXISTS "catalog packages read" ON public.catalog_packages;

CREATE POLICY "service pricing read" ON public.service_pricing
  FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "service catalogs read" ON public.service_catalogs
  FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "catalog packages read" ON public.catalog_packages
  FOR SELECT TO anon, authenticated USING (true);

-- ---------------------------------------------------------------------
-- 2. LEVEL & PERSENTASE PAYOUT  ->  read-only
--    Sebelumnya: payout_percentage bisa diset 100% oleh anon.
-- ---------------------------------------------------------------------
REVOKE INSERT, UPDATE, DELETE ON public.buzzer_levels FROM anon, authenticated;
GRANT SELECT ON public.buzzer_levels TO anon, authenticated;
DROP POLICY IF EXISTS "buzzer_levels_write" ON public.buzzer_levels;

-- ---------------------------------------------------------------------
-- 3. APP_ACCOUNTS  ->  nol akses langsung
--    password_hash dan kolom role tidak boleh terbaca client.
-- ---------------------------------------------------------------------
REVOKE ALL ON public.app_accounts FROM anon, authenticated;
DROP POLICY IF EXISTS "app accounts registration and login" ON public.app_accounts;
DROP POLICY IF EXISTS "management app accounts read"        ON public.app_accounts;

-- Profil publik: hanya kolom aman. password_hash / phone / address /
-- bio tidak pernah diekspos. View dimiliki postgres sehingga membaca
-- tabel dasar tanpa RLS (security_invoker = false).
CREATE OR REPLACE VIEW public.app_accounts_public
WITH (security_invoker = false) AS
SELECT email,
       name,
       role,
       username,
       platform,
       followers,
       avatar_url,
       buzzer_category,
       rating,
       total_reviews,
       created_at
FROM public.app_accounts;

REVOKE ALL ON public.app_accounts_public FROM PUBLIC;
GRANT SELECT ON public.app_accounts_public TO anon, authenticated;

COMMENT ON VIEW public.app_accounts_public IS
  'Profil publik. password_hash, phone, address, bio tidak diekspos.';

-- ---------------------------------------------------------------------
-- 4. PAYMENTS  ->  read-only
--    Sebelumnya: status = 'Lunas' bisa diset sendiri tanpa membayar.
-- ---------------------------------------------------------------------
DROP POLICY IF EXISTS "demo_all" ON public.payments;
REVOKE INSERT, UPDATE, DELETE ON public.payments FROM anon, authenticated;
GRANT SELECT ON public.payments TO anon, authenticated;
DROP POLICY IF EXISTS "payments read" ON public.payments;
CREATE POLICY "payments read" ON public.payments
  FOR SELECT TO anon, authenticated USING (true);

-- ---------------------------------------------------------------------
-- 5. CAMPAIGNS  ->  read-only
--    Sebelumnya: payment_status bisa diset 'Pembayaran Disetujui'.
-- ---------------------------------------------------------------------
DROP POLICY IF EXISTS "demo_all" ON public.campaigns;
REVOKE INSERT, UPDATE, DELETE ON public.campaigns FROM anon, authenticated;
GRANT SELECT ON public.campaigns TO anon, authenticated;
DROP POLICY IF EXISTS "campaigns read" ON public.campaigns;
CREATE POLICY "campaigns read" ON public.campaigns
  FOR SELECT TO anon, authenticated USING (true);

-- ---------------------------------------------------------------------
-- 6. CAMPAIGN_JOBS  ->  read-only (jalur cetak saldo)
--    Policy SELECT "campaign jobs approved read" tetap dipakai.
-- ---------------------------------------------------------------------
DROP POLICY IF EXISTS "campaign jobs management insert" ON public.campaign_jobs;
DROP POLICY IF EXISTS "campaign jobs management update" ON public.campaign_jobs;
DROP POLICY IF EXISTS "campaign jobs management delete" ON public.campaign_jobs;
REVOKE INSERT, UPDATE, DELETE ON public.campaign_jobs FROM anon, authenticated;
GRANT SELECT ON public.campaign_jobs TO anon, authenticated;

-- ---------------------------------------------------------------------
-- 7. BUZZER_WALLETS  ->  read-only
-- ---------------------------------------------------------------------
DROP POLICY IF EXISTS "demo_all" ON public.buzzer_wallets;
DROP POLICY IF EXISTS "management buzzer wallets read" ON public.buzzer_wallets;
REVOKE INSERT, UPDATE, DELETE ON public.buzzer_wallets FROM anon, authenticated;
GRANT SELECT ON public.buzzer_wallets TO anon, authenticated;
DROP POLICY IF EXISTS "buzzer wallets read" ON public.buzzer_wallets;
CREATE POLICY "buzzer wallets read" ON public.buzzer_wallets
  FOR SELECT TO anon, authenticated USING (true);

-- ---------------------------------------------------------------------
-- 8. WITHDRAWALS  ->  read-only (pengajuan lewat RPC request_withdrawal)
-- ---------------------------------------------------------------------
DROP POLICY IF EXISTS "demo_all" ON public.withdrawals;
DROP POLICY IF EXISTS "management withdrawals read" ON public.withdrawals;
REVOKE INSERT, UPDATE, DELETE ON public.withdrawals FROM anon, authenticated;
GRANT SELECT ON public.withdrawals TO anon, authenticated;
DROP POLICY IF EXISTS "withdrawals read" ON public.withdrawals;
CREATE POLICY "withdrawals read" ON public.withdrawals
  FOR SELECT TO anon, authenticated USING (true);

-- ---------------------------------------------------------------------
-- 9. FINANCE LEDGER  ->  read-only
-- ---------------------------------------------------------------------
DROP POLICY IF EXISTS "demo_all" ON public.finance_activity;
DROP POLICY IF EXISTS "demo_all" ON public.finance_notifications;
REVOKE INSERT, UPDATE, DELETE
  ON public.finance_activity, public.finance_notifications
  FROM anon, authenticated;
GRANT SELECT ON public.finance_activity, public.finance_notifications
  TO anon, authenticated;
DROP POLICY IF EXISTS "finance activity read" ON public.finance_activity;
DROP POLICY IF EXISTS "finance notifications read" ON public.finance_notifications;
CREATE POLICY "finance activity read" ON public.finance_activity
  FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "finance notifications read" ON public.finance_notifications
  FOR SELECT TO anon, authenticated USING (true);

-- ---------------------------------------------------------------------
-- 10. PEMBUKUAN ADMIN  ->  tulis dicabut
--     SELECT dipertahankan sementara karena panel admin masih membaca
--     langsung. Fase 2 memindahkannya ke server function.
-- ---------------------------------------------------------------------
REVOKE INSERT, UPDATE, DELETE
  ON public.admin_wallet, public.admin_bank_accounts, public.admin_withdrawals
  FROM anon, authenticated;
GRANT SELECT
  ON public.admin_wallet, public.admin_bank_accounts, public.admin_withdrawals
  TO anon, authenticated;

DROP POLICY IF EXISTS "allow_all_admin_wallet"        ON public.admin_wallet;
DROP POLICY IF EXISTS "allow_all_admin_bank_accounts" ON public.admin_bank_accounts;
DROP POLICY IF EXISTS "allow_all_admin_withdrawals"   ON public.admin_withdrawals;

DROP POLICY IF EXISTS "admin wallet read" ON public.admin_wallet;
DROP POLICY IF EXISTS "admin bank accounts read" ON public.admin_bank_accounts;
DROP POLICY IF EXISTS "admin withdrawals read" ON public.admin_withdrawals;
CREATE POLICY "admin wallet read" ON public.admin_wallet
  FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "admin bank accounts read" ON public.admin_bank_accounts
  FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "admin withdrawals read" ON public.admin_withdrawals
  FOR SELECT TO anon, authenticated USING (true);

-- ---------------------------------------------------------------------
-- 11. RPC ADMIN  ->  service_role saja
--     Sebelumnya bisa dipanggil siapa pun tanpa login.
--
--     Beberapa RPC offline sudah dihapus oleh migration
--     20261006093000_remove_offline_buzzer.sql. REVOKE/GRANT pada fungsi
--     yang tidak ada akan menggagalkan seluruh transaksi, jadi jalankan
--     lewat helper yang mengabaikan undefined_function.
-- ---------------------------------------------------------------------
CREATE OR REPLACE FUNCTION pg_temp.harden_rpc(signature text)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  EXECUTE format(
    'REVOKE EXECUTE ON FUNCTION %s FROM PUBLIC, anon, authenticated',
    signature
  );
  EXECUTE format(
    'GRANT EXECUTE ON FUNCTION %s TO service_role',
    signature
  );
EXCEPTION
  WHEN undefined_function OR undefined_object THEN
    NULL;
END;
$$;

SELECT pg_temp.harden_rpc('public.approve_campaign_payment(uuid, text)');
SELECT pg_temp.harden_rpc('public.reject_campaign_payment(uuid, text, text)');
SELECT pg_temp.harden_rpc('public.delete_management_account(text, text)');
SELECT pg_temp.harden_rpc(
  'public.create_admin_campaign(text, text, text, numeric, integer, text, text, text, text, text)'
);
SELECT pg_temp.harden_rpc('public.list_admin_payments()');
SELECT pg_temp.harden_rpc('public.approve_withdrawal(uuid, text, text)');
SELECT pg_temp.harden_rpc('public.reject_withdrawal(uuid, text)');
SELECT pg_temp.harden_rpc(
  'public.edit_withdrawal(uuid, text, numeric, text, text, text)'
);
SELECT pg_temp.harden_rpc('public.delete_withdrawal(uuid)');
SELECT pg_temp.harden_rpc(
  'public.update_admin_buzzer_rating(uuid, text, integer, text)'
);
SELECT pg_temp.harden_rpc('public.delete_admin_buzzer_rating(uuid, text)');
SELECT pg_temp.harden_rpc('public.update_offline_campaign_payout(uuid, numeric)');
SELECT pg_temp.harden_rpc('public.confirm_offline_attendance(uuid, text, text)');
SELECT pg_temp.harden_rpc('public.recalculate_buzzer_level(text)');

COMMIT;
