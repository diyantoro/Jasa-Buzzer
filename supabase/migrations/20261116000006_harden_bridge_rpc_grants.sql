-- =====================================================================
-- Migration: 20261116000006_harden_bridge_rpc_grants.sql
-- Fase 3a - tutup EXECUTE yang bocor pada RPC istimewa.
--
-- Temuan: Supabase memasang ALTER DEFAULT PRIVILEGES untuk schema public,
-- sehingga setiap fungsi baru otomatis mendapat GRANT EXECUTE eksplisit
-- untuk anon dan authenticated. Akibatnya walau migration
-- 20261116000001 sudah menjalankan `REVOKE ALL ... FROM PUBLIC`, role anon
-- tetap bisa memanggil request_withdrawal, submit_job_proof, update_profile,
-- admin_update_account, dan mark_finance_notification_read.
--
-- Migration ini mencabut grant eksplisit tersebut (PUBLIC, anon,
-- authenticated) lalu hanya memberi service_role.
--
-- Catatan: fungsi yang dibuat ulang (DROP + CREATE) akan kembali mendapat
-- grant default. Setiap migration baru yang membuat fungsi istimewa wajib
-- memanggil pola yang sama.
-- =====================================================================
BEGIN;

-- Helper lokal: aman dipakai walau fungsi sudah dihapus di migration lain.
CREATE OR REPLACE FUNCTION pg_temp.lock_rpc(signature text)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  EXECUTE format(
    'REVOKE ALL PRIVILEGES ON FUNCTION %s FROM PUBLIC, anon, authenticated',
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

-- ---------------------------------------------------------------------
-- 1. RPC jembatan Fase 1 (dipanggil server function, bukan browser)
-- ---------------------------------------------------------------------
SELECT pg_temp.lock_rpc('public.request_withdrawal(text, text, numeric, text, text)');
SELECT pg_temp.lock_rpc('public.submit_job_proof(uuid, text, text)');
SELECT pg_temp.lock_rpc(
  'public.update_profile(text, text, text, text, text, text, text, text, text, text, text)'
);
SELECT pg_temp.lock_rpc('public.admin_update_account(text, text, text, text)');

-- ---------------------------------------------------------------------
-- 2. Notifikasi finance (hanya admin lewat server function)
-- ---------------------------------------------------------------------
SELECT pg_temp.lock_rpc('public.mark_finance_notification_read(uuid)');
SELECT pg_temp.lock_rpc('public.mark_all_finance_notifications_read()');

-- ---------------------------------------------------------------------
-- 3. Operasi buzzer yang kini lewat server function
-- ---------------------------------------------------------------------
SELECT pg_temp.lock_rpc('public.claim_campaign_job(uuid, text, text)');
SELECT pg_temp.lock_rpc('public.get_buzzer_campaign_jobs(text)');

-- ---------------------------------------------------------------------
-- 4. Rating & wallet: selalu dipanggil server (service_role)
-- ---------------------------------------------------------------------
SELECT pg_temp.lock_rpc('public.update_buzzer_rating(uuid, text, integer, text)');
SELECT pg_temp.lock_rpc('public.update_customer_buzzer_rating(uuid, text, integer, text)');
SELECT pg_temp.lock_rpc('public.rate_campaign_for_all_buzzers(text, uuid, integer, text)');
SELECT pg_temp.lock_rpc('public.recalculate_admin_wallet()');

-- ---------------------------------------------------------------------
-- 5. RPC checkout lama yang tidak dipakai aplikasi lagi.
--    Nominalnya berasal dari client, jadi tidak boleh bisa dipanggil anon.
--    RPC checkout yang masih dipakai (create_customer_catalog_* dan
--    create_customer_custom_scheduled_*) sengaja dibiarkan karena
--    menghitung harga di server dan dipakai alur tamu.
-- ---------------------------------------------------------------------
SELECT pg_temp.lock_rpc(
  'public.create_customer_payment_campaign(text, text, text, text, text, text, text, numeric, numeric, numeric, text, numeric, numeric, integer, text)'
);
SELECT pg_temp.lock_rpc(
  'public.create_customer_scheduled_payment_campaign(text, text, text, text, text, text, text, numeric, numeric, numeric, text, numeric, numeric, integer, text, text)'
);
SELECT pg_temp.lock_rpc(
  'public.create_customer_catalog_payment_campaign(uuid, text, text, text, text, text, text, text, text)'
);

COMMIT;
