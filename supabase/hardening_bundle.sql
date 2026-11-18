-- =====================================================================
-- FILE HASIL GENERATE - jangan diedit manual.
-- Regenerate dengan: npm run db:bundle
--
-- Tempel seluruh isi file ini ke Supabase SQL Editor, lalu Run.
-- Terapkan setelah SUPABASE_SERVICE_ROLE_KEY valid terisi, karena policy
-- di bawah mencabut tulis langsung dari role anon.
-- =====================================================================

-- >>> 20261116000000_harden_rls_phase1.sql

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

-- >>> 20261116000001_phase1_bridge_rpcs.sql

-- =====================================================================
-- Migration: 20261116000001_phase1_bridge_rpcs.sql
-- RPC jembatan untuk Fase 1.
--
-- Setelah 20261116000000_harden_rls_phase1.sql mencabut tulis langsung
-- dari anon, alur berikut masih harus berjalan:
--   * buzzer mengajukan pencairan        -> request_withdrawal
--   * buzzer mengunggah bukti pengerjaan -> submit_job_proof
--   * pengguna menyunting profil sendiri -> update_profile
--   * menandai notifikasi keuangan dibaca-> mark_finance_notification_read
--   * admin menyunting akun              -> admin_update_account
--
-- Catatan: parameter identitas (p_buzzer_email / p_email) masih dikirim
-- server function, BUKAN client. Ketiga RPC di bawah hanya di-grant ke
-- service_role supaya client tidak bisa mengaku sebagai buzzer lain.
-- Fase 3 menggantinya dengan auth.uid() setelah Supabase Auth dipasang.
-- =====================================================================

BEGIN;

-- ---------------------------------------------------------------------
-- 1. Pengajuan pencairan (validasi saldo di server)
-- ---------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.request_withdrawal(
  p_buzzer_email text,
  p_buzzer_name text,
  p_amount numeric,
  p_method text,
  p_account_no text
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_email text := lower(trim(COALESCE(p_buzzer_email, '')));
  v_amount numeric := round(GREATEST(COALESCE(p_amount, 0), 0));
  v_balance numeric;
  v_pending numeric;
  v_id uuid;
BEGIN
  IF v_email = '' THEN
    RAISE EXCEPTION 'Email buzzer wajib diisi';
  END IF;
  IF v_amount <= 0 THEN
    RAISE EXCEPTION 'Nominal pencairan harus lebih dari 0';
  END IF;

  SELECT balance INTO v_balance
  FROM public.buzzer_wallets
  WHERE lower(trim(buzzer_email)) = v_email
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Dompet buzzer tidak ditemukan';
  END IF;

  SELECT COALESCE(SUM(amount), 0) INTO v_pending
  FROM public.withdrawals
  WHERE lower(trim(buzzer_email)) = v_email
    AND status = 'Menunggu';

  IF v_amount > GREATEST(COALESCE(v_balance, 0) - v_pending, 0) THEN
    RAISE EXCEPTION 'Saldo yang bisa dicairkan tidak mencukupi';
  END IF;

  INSERT INTO public.withdrawals (
    buzzer_name, buzzer_email, amount, method, account_no,
    status, requested_at, updated_at
  ) VALUES (
    COALESCE(NULLIF(trim(p_buzzer_name), ''), split_part(v_email, '@', 1)),
    v_email,
    v_amount,
    COALESCE(NULLIF(trim(p_method), ''), 'Transfer'),
    COALESCE(p_account_no, ''),
    'Menunggu',
    now(),
    now()
  )
  RETURNING id INTO v_id;

  INSERT INTO public.finance_activity (type, title, description, amount, ref_table, ref_id)
  VALUES (
    'buzzer',
    'Pengajuan Pencairan Saldo',
    'Pengajuan pencairan saldo sebesar Rp '
      || to_char(v_amount, 'FM999G999G999G999')
      || ' menunggu verifikasi admin',
    v_amount,
    'withdrawals',
    v_id::text
  );

  RETURN v_id;
END;
$$;

REVOKE ALL ON FUNCTION public.request_withdrawal(text, text, numeric, text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.request_withdrawal(text, text, numeric, text, text)
  TO service_role;

-- ---------------------------------------------------------------------
-- 2. Unggah bukti pengerjaan
-- ---------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.submit_job_proof(
  p_job_id uuid,
  p_buzzer_email text,
  p_proof_url text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_email text := lower(trim(COALESCE(p_buzzer_email, '')));
  v_job public.campaign_jobs%ROWTYPE;
  v_number integer;
BEGIN
  SELECT * INTO v_job
  FROM public.campaign_jobs
  WHERE id = p_job_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Job tidak ditemukan';
  END IF;

  IF v_job.buzzer_email IS NULL
     OR lower(trim(v_job.buzzer_email)) <> v_email THEN
    RAISE EXCEPTION 'Job ini bukan milik buzzer tersebut';
  END IF;

  IF v_job.status NOT IN ('Diambil', 'Upload', 'Revisi') THEN
    RAISE EXCEPTION 'Job tidak berada pada status yang bisa diunggah';
  END IF;

  IF COALESCE(trim(p_proof_url), '') = '' THEN
    RAISE EXCEPTION 'URL bukti wajib diisi';
  END IF;

  SELECT COALESCE(MAX(submission_number), 0) + 1 INTO v_number
  FROM public.campaign_job_submissions
  WHERE job_id = p_job_id;

  INSERT INTO public.campaign_job_submissions (
    job_id, buzzer_email, proof_url, submission_number, status, submitted_at
  ) VALUES (
    p_job_id, v_email, p_proof_url, v_number, 'Review', now()
  );

  UPDATE public.campaign_jobs
  SET status = 'Review',
      proof_url = p_proof_url,
      note = NULL,
      rejection_reason = NULL,
      rejected_at = NULL,
      rejected_by = NULL,
      admin_verified_at = NULL,
      customer_rated_at = NULL,
      resubmission_count = GREATEST(v_number - 1, 0),
      submitted_at = now(),
      updated_at = now()
  WHERE id = p_job_id;
END;
$$;

REVOKE ALL ON FUNCTION public.submit_job_proof(uuid, text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.submit_job_proof(uuid, text, text)
  TO service_role;

-- ---------------------------------------------------------------------
-- 3. Sunting profil sendiri
--    followers sengaja TIDAK bisa ditulis di sini karena nilainya
--    diturunkan dari social_accounts lewat trigger.
-- ---------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.update_profile(
  p_email text,
  p_name text DEFAULT NULL,
  p_phone text DEFAULT NULL,
  p_city text DEFAULT NULL,
  p_bio text DEFAULT NULL,
  p_company text DEFAULT NULL,
  p_industry text DEFAULT NULL,
  p_username text DEFAULT NULL,
  p_platform text DEFAULT NULL,
  p_avatar_url text DEFAULT NULL,
  p_buzzer_category text DEFAULT NULL
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_email text := lower(trim(COALESCE(p_email, '')));
BEGIN
  IF v_email = '' THEN
    RAISE EXCEPTION 'Email wajib diisi';
  END IF;

  UPDATE public.app_accounts
  SET name = COALESCE(NULLIF(trim(p_name), ''), name),
      phone = COALESCE(p_phone, phone),
      city = COALESCE(p_city, city),
      bio = COALESCE(p_bio, bio),
      company = COALESCE(p_company, company),
      industry = COALESCE(p_industry, industry),
      username = COALESCE(p_username, username),
      platform = COALESCE(p_platform, platform),
      avatar_url = COALESCE(p_avatar_url, avatar_url),
      buzzer_category = COALESCE(p_buzzer_category, buzzer_category),
      updated_at = now()
  WHERE lower(trim(email)) = v_email;

  RETURN FOUND;
END;
$$;

REVOKE ALL ON FUNCTION public.update_profile(
  text, text, text, text, text, text, text, text, text, text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.update_profile(
  text, text, text, text, text, text, text, text, text, text, text)
  TO service_role;

-- ---------------------------------------------------------------------
-- 4. Admin menyunting akun (role / nama / telepon)
--    Hanya service_role. Dipanggil dari server function.
-- ---------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.admin_update_account(
  p_email text,
  p_role text DEFAULT NULL,
  p_name text DEFAULT NULL,
  p_phone text DEFAULT NULL
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_email text := lower(trim(COALESCE(p_email, '')));
  v_role text := NULLIF(lower(trim(COALESCE(p_role, ''))), '');
BEGIN
  IF v_email = '' THEN
    RAISE EXCEPTION 'Email wajib diisi';
  END IF;
  IF v_role IS NOT NULL AND v_role NOT IN ('admin', 'buzzer', 'customer') THEN
    RAISE EXCEPTION 'Role tidak valid';
  END IF;

  UPDATE public.app_accounts
  SET role = COALESCE(v_role, role),
      name = COALESCE(NULLIF(trim(p_name), ''), name),
      phone = COALESCE(p_phone, phone),
      updated_at = now()
  WHERE lower(trim(email)) = v_email;

  RETURN FOUND;
END;
$$;

REVOKE ALL ON FUNCTION public.admin_update_account(text, text, text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.admin_update_account(text, text, text, text)
  TO service_role;

-- ---------------------------------------------------------------------
-- 5. Notifikasi keuangan
-- ---------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.mark_finance_notification_read(p_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.finance_notifications
  SET read_at = COALESCE(read_at, now())
  WHERE id = p_id;
END;
$$;

REVOKE ALL ON FUNCTION public.mark_finance_notification_read(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.mark_finance_notification_read(uuid)
  TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.mark_all_finance_notifications_read()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.finance_notifications
  SET read_at = now()
  WHERE read_at IS NULL;
END;
$$;

REVOKE ALL ON FUNCTION public.mark_all_finance_notifications_read() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.mark_all_finance_notifications_read()
  TO anon, authenticated;

COMMIT;

-- >>> 20261116000002_harden_rls_phase2_accounts.sql

-- =====================================================================
-- Migration: 20261116000002_harden_rls_phase2_accounts.sql
-- Fase 2: tutup direct writes ke data akun/social/rating dari anon.
-- =====================================================================
BEGIN;

REVOKE INSERT, UPDATE, DELETE, TRUNCATE
  ON public.social_accounts, public.buzzer_ratings, public.campaign_job_submissions
  FROM anon, authenticated;
GRANT SELECT
  ON public.social_accounts, public.buzzer_ratings, public.campaign_job_submissions
  TO anon, authenticated;

DROP POLICY IF EXISTS "demo_all" ON public.social_accounts;
DROP POLICY IF EXISTS "demo_all" ON public.buzzer_ratings;
DROP POLICY IF EXISTS "demo_all" ON public.campaign_job_submissions;

DROP POLICY IF EXISTS "social accounts read" ON public.social_accounts;
DROP POLICY IF EXISTS "buzzer ratings read" ON public.buzzer_ratings;
DROP POLICY IF EXISTS "job submissions read" ON public.campaign_job_submissions;

CREATE POLICY "social accounts read" ON public.social_accounts
  FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "buzzer ratings read" ON public.buzzer_ratings
  FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "job submissions read" ON public.campaign_job_submissions
  FOR SELECT TO anon, authenticated USING (true);

REVOKE INSERT, UPDATE, DELETE, TRUNCATE
  ON public.customer_accounts FROM anon, authenticated;
GRANT SELECT ON public.customer_accounts TO anon, authenticated;
DROP POLICY IF EXISTS "demo_all" ON public.customer_accounts;
DROP POLICY IF EXISTS "customer accounts read" ON public.customer_accounts;
CREATE POLICY "customer accounts read" ON public.customer_accounts
  FOR SELECT TO anon, authenticated USING (true);

COMMIT;

-- >>> 20261116000003_harden_rls_phase2b.sql

-- =====================================================================
-- Migration: 20261116000003_harden_rls_phase2b.sql
-- Fase 2b: tutup direct writes ke pendaftaran buzzer, notifikasi, dan
-- pesan campaign/support dari anon.
--
-- Semua mutasi sekarang lewat server function:
--   * applications.functions.ts  -> buzzer_applications
--   * notifications.functions.ts -> notifications
--   * messages.functions.ts      -> campaign_messages
-- =====================================================================
BEGIN;

-- ---------------------------------------------------------------------
-- 1. Pendaftaran buzzer
--    Risiko sebelumnya: pendaftar bisa mengubah `status` menjadi approved.
-- ---------------------------------------------------------------------
REVOKE INSERT, UPDATE, DELETE, TRUNCATE
  ON public.buzzer_applications FROM anon, authenticated;
GRANT SELECT ON public.buzzer_applications TO anon, authenticated;

DROP POLICY IF EXISTS "demo_all" ON public.buzzer_applications;
DROP POLICY IF EXISTS "management buzzer applications read" ON public.buzzer_applications;
DROP POLICY IF EXISTS "buzzer applications read" ON public.buzzer_applications;
CREATE POLICY "buzzer applications read"
  ON public.buzzer_applications FOR SELECT TO anon, authenticated
  USING (true);

-- ---------------------------------------------------------------------
-- 2. Notifikasi
--    Risiko sebelumnya: siapa pun bisa membuat/menghapus notifikasi akun
--    lain, atau menandai notifikasi orang lain sebagai sudah dibaca.
-- ---------------------------------------------------------------------
REVOKE INSERT, UPDATE, DELETE, TRUNCATE
  ON public.notifications FROM anon, authenticated;
GRANT SELECT ON public.notifications TO anon, authenticated;

DROP POLICY IF EXISTS "notifications_all_access" ON public.notifications;
DROP POLICY IF EXISTS "notifications read" ON public.notifications;
DROP POLICY IF EXISTS "notifications read" ON public.notifications;
CREATE POLICY "notifications read"
  ON public.notifications FOR SELECT TO anon, authenticated
  USING (true);

-- ---------------------------------------------------------------------
-- 3. Pesan campaign & support
--    Risiko sebelumnya: pengirim bisa memalsukan `from_email`/`from_role`.
-- ---------------------------------------------------------------------
REVOKE INSERT, UPDATE, DELETE, TRUNCATE
  ON public.campaign_messages FROM anon, authenticated;
GRANT SELECT ON public.campaign_messages TO anon, authenticated;

DROP POLICY IF EXISTS "demo_all" ON public.campaign_messages;
DROP POLICY IF EXISTS "campaign messages read" ON public.campaign_messages;
DROP POLICY IF EXISTS "campaign messages read" ON public.campaign_messages;
CREATE POLICY "campaign messages read"
  ON public.campaign_messages FOR SELECT TO anon, authenticated
  USING (true);

COMMIT;

-- >>> 20261116000004_harden_storage_writes.sql

-- =====================================================================
-- Migration: 20261116000004_harden_storage_writes.sql
-- Fase 2c: tutup tulis langsung ke bucket bukti & thumbnail.
--
-- Upload sekarang lewat server function (uploads.functions.ts) memakai
-- service_role. Policy SELECT tetap ada supaya signed URL / gambar publik
-- masih bisa dibaca.
-- =====================================================================
BEGIN;

-- Bukti pengerjaan: hanya service_role yang boleh insert/update/delete.
DROP POLICY IF EXISTS "bukti_insert" ON storage.objects;
DROP POLICY IF EXISTS "bukti_update" ON storage.objects;
DROP POLICY IF EXISTS "bukti_delete" ON storage.objects;

-- Thumbnail katalog campaign: hanya admin (via server) yang boleh menulis.
DROP POLICY IF EXISTS "campaign thumbnails upload" ON storage.objects;
DROP POLICY IF EXISTS "campaign thumbnails update" ON storage.objects;
DROP POLICY IF EXISTS "campaign thumbnails delete" ON storage.objects;

COMMIT;

-- >>> 20261116000005_audit_logs.sql

-- =====================================================================
-- Migration: 20261116000005_audit_logs.sql
-- Audit log untuk operasi istimewa (pembayaran, pencairan, job, role).
--
-- Tabel ini hanya untuk service_role: tidak ada grant/policy untuk anon
-- atau authenticated, sehingga browser tidak bisa membaca maupun menulis.
-- =====================================================================
BEGIN;

CREATE TABLE IF NOT EXISTS public.audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_email text NOT NULL,
  actor_role text NOT NULL,
  action text NOT NULL,
  target_type text,
  target_id text,
  details jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at
  ON public.audit_logs (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_actor
  ON public.audit_logs (actor_email);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action
  ON public.audit_logs (action);

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public.audit_logs FROM anon, authenticated;
GRANT ALL ON public.audit_logs TO service_role;

COMMIT;

-- >>> 20261116000006_harden_bridge_rpc_grants.sql

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

-- >>> 20261116000007_fix_relations_and_constraints.sql

-- =====================================================================
-- Migration: 20261116000007_fix_relations_and_constraints.sql
-- Perbaikan relasi & normalisasi setelah audit skema.
--
-- Semua statement dibuat idempoten karena runner menerapkan ulang seluruh
-- migration setiap kali `npm run db:apply` dijalankan.
--
-- Isi:
--   1. Validasi 4 foreign key yang masih berstatus NOT VALID.
--   2. CHECK domain nilai yang dipakai sebagai batas kepercayaan.
--   3. Relasi dua arah campaigns.payment_id <-> payments.campaign_id.
--   4. service_catalog_recommendations.catalog_id: text -> uuid + FK.
--   5. FK akun untuk tabel yang memang dihapus bersama akun.
--   6. CHECK format tanggal (kolom masih text, tapi isinya dijaga).
--   7. Index yang hilang untuk query yang dipakai aplikasi.
--   8. Perbaikan data: akun demo customer yang hilang dari app_accounts.
--   Plus: penjaga di recalculate_buzzer_level() agar trigger hapus
--   social_accounts tidak membuat ulang wallet milik akun yang sudah hilang.
--
-- Yang SENGAJA tidak diubah (lihat docs/SECURITY_HARDENING.md):
--   * total_reviews = 9 dan rating = 5.0 adalah prior Bayesian untuk
--     rating tertimbang, bukan data palsu.
--   * customer_accounts.email tidak diberi FK: alur tamu membuat baris
--     customer_accounts tanpa app_accounts.
--   * bazzer_applications.email tidak diberi FK: pendaftaran publik
--     membuat baris aplikasi sebelum akun ada.
--   * withdrawals/buzzer_ratings/campaign_jobs tidak diberi FK ke
--     app_accounts karena riwayatnya sengaja dipertahankan saat akun
--     dihapus (delete_management_account).
-- =====================================================================
BEGIN;

-- ---------------------------------------------------------------------
-- 1. Validasi foreign key yang tertunda
--    Datanya sudah bersih (0 referensi yatim), jadi aman divalidasi.
-- ---------------------------------------------------------------------
ALTER TABLE public.buzzer_ratings
  VALIDATE CONSTRAINT buzzer_ratings_campaign_id_fkey;
ALTER TABLE public.buzzer_ratings
  VALIDATE CONSTRAINT buzzer_ratings_job_id_fkey;
ALTER TABLE public.campaign_jobs
  VALIDATE CONSTRAINT campaign_jobs_campaign_id_fkey;
ALTER TABLE public.campaign_messages
  VALIDATE CONSTRAINT campaign_messages_campaign_id_fkey;

-- ---------------------------------------------------------------------
-- 2. CHECK domain
-- ---------------------------------------------------------------------

-- role adalah batas kepercayaan: requireAdmin() percaya pada nilai ini.
ALTER TABLE public.app_accounts
  DROP CONSTRAINT IF EXISTS app_accounts_role_check;
ALTER TABLE public.app_accounts
  ADD CONSTRAINT app_accounts_role_check
  CHECK (role IN ('admin', 'buzzer', 'customer'));

ALTER TABLE public.buzzer_ratings
  DROP CONSTRAINT IF EXISTS buzzer_ratings_stars_check;
ALTER TABLE public.buzzer_ratings
  ADD CONSTRAINT buzzer_ratings_stars_check
  CHECK (stars BETWEEN 1 AND 5);

-- admin_wallet adalah tabel singleton: hanya boleh ada baris 'primary'.
ALTER TABLE public.admin_wallet
  DROP CONSTRAINT IF EXISTS admin_wallet_singleton_check;
ALTER TABLE public.admin_wallet
  ADD CONSTRAINT admin_wallet_singleton_check
  CHECK (id = 'primary');

-- ---------------------------------------------------------------------
-- 3. Relasi pembayaran <-> campaign
--    Keduanya sekarang dijaga, dan satu pembayaran hanya boleh menunjuk
--    ke satu campaign. RPC checkout selalu INSERT payments lebih dulu,
--    lalu INSERT campaigns dengan payment_id, baru UPDATE
--    payments.campaign_id — jadi urutan ini aman terhadap FK.
-- ---------------------------------------------------------------------
ALTER TABLE public.campaigns
  DROP CONSTRAINT IF EXISTS campaigns_payment_id_fkey;
ALTER TABLE public.campaigns
  ADD CONSTRAINT campaigns_payment_id_fkey
  FOREIGN KEY (payment_id) REFERENCES public.payments(id)
  ON UPDATE CASCADE ON DELETE SET NULL;

CREATE UNIQUE INDEX IF NOT EXISTS campaigns_payment_id_unique_idx
  ON public.campaigns (payment_id)
  WHERE payment_id IS NOT NULL;

ALTER TABLE public.payments
  DROP CONSTRAINT IF EXISTS payments_campaign_id_fkey;
ALTER TABLE public.payments
  ADD CONSTRAINT payments_campaign_id_fkey
  FOREIGN KEY (campaign_id) REFERENCES public.campaigns(id)
  ON UPDATE CASCADE ON DELETE SET NULL;

-- Satu invoice hanya boleh dipakai satu pembayaran.
ALTER TABLE public.payments
  DROP CONSTRAINT IF EXISTS payments_invoice_no_key;
ALTER TABLE public.payments
  ADD CONSTRAINT payments_invoice_no_key UNIQUE (invoice_no);

-- ---------------------------------------------------------------------
-- 4. service_catalog_recommendations.catalog_id: text -> uuid
--    Sebelumnya harus di-cast manual untuk join dan tidak bisa diberi FK.
-- ---------------------------------------------------------------------
DO $$
DECLARE
  current_type text;
BEGIN
  SELECT data_type INTO current_type
    FROM information_schema.columns
   WHERE table_schema = 'public'
     AND table_name = 'service_catalog_recommendations'
     AND column_name = 'catalog_id';

  IF current_type = 'text' THEN
    ALTER TABLE public.service_catalog_recommendations
      DROP CONSTRAINT IF EXISTS service_catalog_recommendations_pkey;
    ALTER TABLE public.service_catalog_recommendations
      DROP CONSTRAINT IF EXISTS service_catalog_recommendations_catalog_id_fkey;
    ALTER TABLE public.service_catalog_recommendations
      ALTER COLUMN catalog_id TYPE uuid USING catalog_id::uuid;
  END IF;
END
$$;

ALTER TABLE public.service_catalog_recommendations
  DROP CONSTRAINT IF EXISTS service_catalog_recommendations_pkey;
ALTER TABLE public.service_catalog_recommendations
  ADD CONSTRAINT service_catalog_recommendations_pkey
  PRIMARY KEY (catalog_id, campaign_type);

ALTER TABLE public.service_catalog_recommendations
  DROP CONSTRAINT IF EXISTS service_catalog_recommendations_catalog_id_fkey;
ALTER TABLE public.service_catalog_recommendations
  ADD CONSTRAINT service_catalog_recommendations_catalog_id_fkey
  FOREIGN KEY (catalog_id) REFERENCES public.service_catalogs(id)
  ON UPDATE CASCADE ON DELETE CASCADE;

-- ---------------------------------------------------------------------
-- 5. FK akun untuk tabel yang dihapus bersama akun
--    delete_management_account() menghapus social_accounts dan
--    buzzer_wallets lebih dulu, jadi CASCADE konsisten dengan alur itu.
-- ---------------------------------------------------------------------
ALTER TABLE public.buzzer_wallets
  DROP CONSTRAINT IF EXISTS buzzer_wallets_buzzer_email_fkey;
ALTER TABLE public.buzzer_wallets
  ADD CONSTRAINT buzzer_wallets_buzzer_email_fkey
  FOREIGN KEY (buzzer_email) REFERENCES public.app_accounts(email)
  ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE public.social_accounts
  DROP CONSTRAINT IF EXISTS social_accounts_buzzer_email_fkey;
ALTER TABLE public.social_accounts
  ADD CONSTRAINT social_accounts_buzzer_email_fkey
  FOREIGN KEY (buzzer_email) REFERENCES public.app_accounts(email)
  ON UPDATE CASCADE ON DELETE CASCADE;

-- Level wallet harus merujuk level yang benar-benar ada, supaya payout
-- tidak dihitung dari level karangan.
ALTER TABLE public.buzzer_wallets
  DROP CONSTRAINT IF EXISTS buzzer_wallets_level_fkey;
ALTER TABLE public.buzzer_wallets
  ADD CONSTRAINT buzzer_wallets_level_fkey
  FOREIGN KEY (level) REFERENCES public.buzzer_levels(name)
  ON UPDATE CASCADE ON DELETE SET NULL;

-- recalculate_buzzer_level() dipanggil trigger AFTER DELETE pada
-- social_accounts. Tanpa penjaga, menghapus akun akan memicu trigger yang
-- membuat ulang baris buzzer_wallets untuk email yang akunnya sudah/akan
-- hilang — bertabrakan dengan FK di atas. Sekarang fungsi berhenti jika
-- akunnya tidak ada.
CREATE OR REPLACE FUNCTION public.recalculate_buzzer_level(target_email text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  normalized_email text := lower(trim(target_email));
  total_followers integer;
  resolved_level text;
  buzzer_name_value text;
BEGIN
  IF normalized_email IS NULL OR normalized_email = '' THEN
    RETURN;
  END IF;

  -- Jangan membuat wallet untuk akun yang sudah tidak ada.
  IF NOT EXISTS (
    SELECT 1 FROM public.app_accounts
    WHERE lower(trim(email)) = normalized_email
  ) THEN
    RETURN;
  END IF;

  -- Total followers dari akun terverifikasi yang masih aktif.
  SELECT COALESCE(SUM(followers), 0)::integer
    INTO total_followers
  FROM public.social_accounts
  WHERE lower(trim(buzzer_email)) = normalized_email
    AND verification = 'Terverifikasi'
    AND COALESCE(is_active, true);

  -- Semua kategori buzzer (Online, Offline, Offline-Online) punya level.
  -- Level offline hanya badge: nominal bayaran tetap payout_per_buzzer.
  SELECT bl.name
    INTO resolved_level
  FROM public.buzzer_levels AS bl
  WHERE bl.min_followers <= total_followers
  ORDER BY bl.min_followers DESC, bl.sort_order DESC
  LIMIT 1;

  SELECT COALESCE(
    (
      SELECT buzzer_name
      FROM public.buzzer_wallets
      WHERE lower(trim(buzzer_email)) = normalized_email
      LIMIT 1
    ),
    (
      SELECT name
      FROM public.app_accounts
      WHERE lower(trim(email)) = normalized_email
      LIMIT 1
    ),
    split_part(normalized_email, '@', 1)
  ) INTO buzzer_name_value;

  INSERT INTO public.buzzer_wallets (
    buzzer_email,
    buzzer_name,
    followers,
    verified_followers,
    level,
    level_assigned_at
  ) VALUES (
    normalized_email,
    buzzer_name_value,
    total_followers,
    total_followers,
    resolved_level,
    CASE WHEN resolved_level IS NULL THEN NULL ELSE now() END
  )
  ON CONFLICT (buzzer_email) DO UPDATE SET
    followers = EXCLUDED.followers,
    verified_followers = EXCLUDED.verified_followers,
    level = EXCLUDED.level,
    level_assigned_at = CASE
      WHEN EXCLUDED.level IS NULL THEN NULL
      WHEN public.buzzer_wallets.level IS DISTINCT FROM EXCLUDED.level THEN now()
      ELSE public.buzzer_wallets.level_assigned_at
    END,
    updated_at = now();
END;
$function$;

-- ---------------------------------------------------------------------
-- 6. CHECK format tanggal
--    Kolom masih text (banyak RPC menerima text), tetapi isinya dijaga
--    agar selalu YYYY-MM-DD atau string kosong.
-- ---------------------------------------------------------------------
ALTER TABLE public.campaigns
  DROP CONSTRAINT IF EXISTS campaigns_start_date_format_check;
ALTER TABLE public.campaigns
  ADD CONSTRAINT campaigns_start_date_format_check
  CHECK (start_date = '' OR start_date ~ '^\d{4}-\d{2}-\d{2}$');

ALTER TABLE public.campaigns
  DROP CONSTRAINT IF EXISTS campaigns_deadline_format_check;
ALTER TABLE public.campaigns
  ADD CONSTRAINT campaigns_deadline_format_check
  CHECK (deadline = '' OR deadline ~ '^\d{4}-\d{2}-\d{2}$');

ALTER TABLE public.campaign_jobs
  DROP CONSTRAINT IF EXISTS campaign_jobs_deadline_format_check;
ALTER TABLE public.campaign_jobs
  ADD CONSTRAINT campaign_jobs_deadline_format_check
  CHECK (deadline = '' OR deadline ~ '^\d{4}-\d{2}-\d{2}$');

-- ---------------------------------------------------------------------
-- 7. Index untuk query yang dipakai aplikasi
-- ---------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS withdrawals_buzzer_status_idx
  ON public.withdrawals (buzzer_email, status);
CREATE INDEX IF NOT EXISTS campaign_jobs_status_tier_idx
  ON public.campaign_jobs (status, required_tier);
CREATE INDEX IF NOT EXISTS campaigns_status_idx
  ON public.campaigns (status);
CREATE INDEX IF NOT EXISTS campaigns_customer_email_idx
  ON public.campaigns (customer_email);
CREATE INDEX IF NOT EXISTS payments_status_idx
  ON public.payments (status);
CREATE INDEX IF NOT EXISTS payments_customer_status_idx
  ON public.payments (customer_email, status);
CREATE INDEX IF NOT EXISTS social_accounts_buzzer_verification_idx
  ON public.social_accounts (buzzer_email, verification);

-- ---------------------------------------------------------------------
-- 8. Perbaikan data
--    customer@buzzhub.id diiklankan di README dan tombol login cepat,
--    tetapi barisnya tidak ada di app_accounts sehingga login demo
--    customer selalu gagal. Hash memakai skema lama (SHA-256 + salt
--    global) dan otomatis di-upgrade ke PBKDF2 saat login berhasil.
--    DO NOTHING: jangan menimpa password yang mungkin sudah diganti.
-- ---------------------------------------------------------------------
INSERT INTO public.app_accounts (email, name, role, password_hash)
VALUES (
  'customer@buzzhub.id',
  'Customer Utama',
  'customer',
  'f349ad37943bf70832d3f414f866aea9e6738b6ddf7fdfde973f6976b2b86282'
)
ON CONFLICT (email) DO NOTHING;

COMMIT;

-- >>> 20261116000008_lock_guest_checkout_rpcs.sql

-- =====================================================================
-- Migration: 20261116000008_lock_guest_checkout_rpcs.sql
-- 1. Guest checkout tetap didukung untuk customer, tetapi pemanggilannya
--    kini melalui server function createCheckoutCampaignFn.
--    Empat RPC checkout ditutup dari browser (anon/authenticated) dan
--    hanya boleh dipanggil oleh service_role.
-- 2. Constraint integritas tanggal: start_date <= deadline pada campaigns.
-- =====================================================================
BEGIN;

-- Helper pengunci RPC
CREATE OR REPLACE FUNCTION pg_temp.lock_checkout_rpc(signature text)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  EXECUTE format(
    'REVOKE ALL PRIVILEGES ON FUNCTION %s FROM PUBLIC, anon, authenticated',
    signature
  );
  EXECUTE format('GRANT EXECUTE ON FUNCTION %s TO service_role', signature);
EXCEPTION
  WHEN undefined_function OR undefined_object THEN
    NULL;
END;
$$;

-- Tutup seluruh overload RPC checkout customer
SELECT pg_temp.lock_checkout_rpc(
  'public.create_customer_catalog_package_scheduled_payment_campaign(uuid, uuid, text, text, text, text, text, text, text, text, text, text, numeric, integer)'
);
SELECT pg_temp.lock_checkout_rpc(
  'public.create_customer_catalog_scheduled_payment_campaign(uuid, text, text, text, text, text, text, text, text, text)'
);
SELECT pg_temp.lock_checkout_rpc(
  'public.create_customer_catalog_scheduled_payment_campaign(uuid, text, text, text, text, text, text, text, text, text, integer)'
);
SELECT pg_temp.lock_checkout_rpc(
  'public.create_customer_custom_scheduled_payment_campaign(text, text, text, text, text, text, text, text, text, integer, text, text, text, boolean)'
);

-- Constraint rentang tanggal: deadline tidak boleh mendahului start_date jika keduanya terisi
ALTER TABLE public.campaigns
  DROP CONSTRAINT IF EXISTS campaigns_date_range_check;
ALTER TABLE public.campaigns
  ADD CONSTRAINT campaigns_date_range_check
  CHECK (start_date = '' OR deadline = '' OR deadline::date >= start_date::date);

COMMIT;

-- >>> 20261116000009_financial_ledger.sql

-- =====================================================================
-- Migration: 20261116000009_financial_ledger.sql
-- Buku besar keuangan (append-only financial ledger).
--
-- Menyediakan jejak audit finansial immutable:
--   * Setiap arus uang tercatat sebagai transaksi terpisah.
--   * Saldo buzzer dan admin dapat direkonstruksi dari ledger.
--   * Akses dibatasi ketat: hanya service_role, tertutup total untuk
--     anon dan authenticated.
--   * Pencegahan pencatatan ganda melalui partial unique index pada
--     (entry_type, ref_table, ref_id).
-- =====================================================================
BEGIN;

-- ---------------------------------------------------------------------
-- 1. Tabel Buku Besar
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.financial_ledger (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entry_type text NOT NULL CHECK (
    entry_type IN (
      'customer_payment',
      'buzzer_payout',
      'admin_commission',
      'buzzer_withdrawal',
      'admin_withdrawal',
      'manual_adjustment'
    )
  ),
  account_type text NOT NULL CHECK (account_type IN ('platform', 'admin', 'buzzer')),
  account_identifier text NOT NULL,
  amount numeric NOT NULL CHECK (amount >= 0),
  direction text NOT NULL CHECK (direction IN ('credit', 'debit')),
  ref_table text NOT NULL DEFAULT '',
  ref_id text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT uq_financial_ledger_ref UNIQUE (entry_type, ref_table, ref_id)
);

-- Indeks performa & audit
CREATE INDEX IF NOT EXISTS idx_financial_ledger_account
  ON public.financial_ledger (account_identifier, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_financial_ledger_ref
  ON public.financial_ledger (ref_table, ref_id);
CREATE INDEX IF NOT EXISTS idx_financial_ledger_entry_type
  ON public.financial_ledger (entry_type, created_at DESC);

-- ---------------------------------------------------------------------
-- 2. Keamanan: RLS & Privileges (Hanya service_role)
-- ---------------------------------------------------------------------
ALTER TABLE public.financial_ledger ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public.financial_ledger FROM PUBLIC, anon, authenticated;
GRANT ALL ON public.financial_ledger TO service_role;

DROP POLICY IF EXISTS "service_role_all_financial_ledger" ON public.financial_ledger;
CREATE POLICY "service_role_all_financial_ledger"
  ON public.financial_ledger
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ---------------------------------------------------------------------
-- 3. Triggers Otomatis Buku Besar
-- ---------------------------------------------------------------------

-- A. Pembayaran customer yang berhasil
CREATE OR REPLACE FUNCTION public.ledger_record_customer_payment()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.status IN ('Berhasil', 'Lunas')
     AND (TG_OP = 'INSERT' OR OLD.status NOT IN ('Berhasil', 'Lunas')) THEN
    INSERT INTO public.financial_ledger (
      entry_type, account_type, account_identifier, amount, direction,
      ref_table, ref_id, description
    ) VALUES (
      'customer_payment',
      'platform',
      'platform',
      COALESCE(NEW.amount, 0),
      'credit',
      'payments',
      NEW.id::text,
      'Pemasukan pembayaran customer (' || COALESCE(NEW.invoice_no, '') || ')'
    ) ON CONFLICT (entry_type, ref_table, ref_id) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_ledger_customer_payment ON public.payments;
CREATE TRIGGER trg_ledger_customer_payment
AFTER INSERT OR UPDATE OF status ON public.payments
FOR EACH ROW EXECUTE FUNCTION public.ledger_record_customer_payment();

-- B. Payout buzzer & komisi admin dari job selesai
CREATE OR REPLACE FUNCTION public.ledger_record_job_completion()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_buzzer_amount numeric;
  v_admin_amount numeric;
BEGIN
  IF (NEW.status = 'Selesai' OR NEW.admin_verified_at IS NOT NULL)
     AND (TG_OP = 'INSERT' OR (OLD.status IS DISTINCT FROM 'Selesai' AND OLD.admin_verified_at IS NULL)) THEN
    
    v_buzzer_amount := GREATEST(COALESCE(NEW.buzzer_amount, NEW.payout, 0), 0);
    v_admin_amount := GREATEST(COALESCE(NEW.admin_amount, GREATEST(COALESCE(NEW.gross_price, 0) - v_buzzer_amount, 0)), 0);

    IF v_buzzer_amount > 0 AND NEW.buzzer_email IS NOT NULL AND trim(NEW.buzzer_email) <> '' THEN
      INSERT INTO public.financial_ledger (
        entry_type, account_type, account_identifier, amount, direction,
        ref_table, ref_id, description
      ) VALUES (
        'buzzer_payout',
        'buzzer',
        lower(trim(NEW.buzzer_email)),
        v_buzzer_amount,
        'credit',
        'campaign_jobs',
        NEW.id::text,
        'Pendapatan job buzzer (' || COALESCE(NEW.campaign_title, '') || ')'
      ) ON CONFLICT (entry_type, ref_table, ref_id) DO NOTHING;
    END IF;

    IF v_admin_amount > 0 THEN
      INSERT INTO public.financial_ledger (
        entry_type, account_type, account_identifier, amount, direction,
        ref_table, ref_id, description
      ) VALUES (
        'admin_commission',
        'admin',
        'admin',
        v_admin_amount,
        'credit',
        'campaign_jobs',
        NEW.id::text,
        'Komisi admin dari job (' || COALESCE(NEW.campaign_title, '') || ')'
      ) ON CONFLICT (entry_type, ref_table, ref_id) DO NOTHING;
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_ledger_job_completion ON public.campaign_jobs;
CREATE TRIGGER trg_ledger_job_completion
AFTER INSERT OR UPDATE OF status, admin_verified_at ON public.campaign_jobs
FOR EACH ROW EXECUTE FUNCTION public.ledger_record_job_completion();

-- C. Pencairan buzzer (withdrawal) yang disetujui/berhasil
CREATE OR REPLACE FUNCTION public.ledger_record_buzzer_withdrawal()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.status = 'Berhasil'
     AND (TG_OP = 'INSERT' OR OLD.status IS DISTINCT FROM 'Berhasil') THEN
    INSERT INTO public.financial_ledger (
      entry_type, account_type, account_identifier, amount, direction,
      ref_table, ref_id, description
    ) VALUES (
      'buzzer_withdrawal',
      'buzzer',
      lower(trim(NEW.buzzer_email)),
      COALESCE(NEW.amount, 0),
      'debit',
      'withdrawals',
      NEW.id::text,
      'Pencairan dana buzzer (' || COALESCE(NEW.method, '') || ' ke ' || COALESCE(NEW.account_no, '') || ')'
    ) ON CONFLICT (entry_type, ref_table, ref_id) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_ledger_buzzer_withdrawal ON public.withdrawals;
CREATE TRIGGER trg_ledger_buzzer_withdrawal
AFTER INSERT OR UPDATE OF status ON public.withdrawals
FOR EACH ROW EXECUTE FUNCTION public.ledger_record_buzzer_withdrawal();

-- D. Penarikan admin (admin_withdrawals)
CREATE OR REPLACE FUNCTION public.ledger_record_admin_withdrawal()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.status = 'Berhasil'
     AND (TG_OP = 'INSERT' OR OLD.status IS DISTINCT FROM 'Berhasil') THEN
    INSERT INTO public.financial_ledger (
      entry_type, account_type, account_identifier, amount, direction,
      ref_table, ref_id, description
    ) VALUES (
      'admin_withdrawal',
      'admin',
      'admin',
      COALESCE(NEW.amount, 0),
      'debit',
      'admin_withdrawals',
      NEW.id::text,
      'Penarikan profit admin (' || COALESCE(NEW.method, '') || ')'
    ) ON CONFLICT (entry_type, ref_table, ref_id) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_ledger_admin_withdrawal ON public.admin_withdrawals;
CREATE TRIGGER trg_ledger_admin_withdrawal
AFTER INSERT OR UPDATE OF status ON public.admin_withdrawals
FOR EACH ROW EXECUTE FUNCTION public.ledger_record_admin_withdrawal();

-- ---------------------------------------------------------------------
-- 4. Backfill Transaksi Masa Lalu (Idempoten)
-- ---------------------------------------------------------------------
-- Pembayaran settled
INSERT INTO public.financial_ledger (
  entry_type, account_type, account_identifier, amount, direction,
  ref_table, ref_id, description, created_at
)
SELECT
  'customer_payment',
  'platform',
  'platform',
  amount,
  'credit',
  'payments',
  id::text,
  'Pemasukan pembayaran customer (' || invoice_no || ')',
  COALESCE(paid_at, created_at)
FROM public.payments
WHERE status IN ('Berhasil', 'Lunas')
ON CONFLICT (entry_type, ref_table, ref_id) DO NOTHING;

-- Job selesai (buzzer)
INSERT INTO public.financial_ledger (
  entry_type, account_type, account_identifier, amount, direction,
  ref_table, ref_id, description, created_at
)
SELECT
  'buzzer_payout',
  'buzzer',
  lower(trim(buzzer_email)),
  GREATEST(COALESCE(buzzer_amount, payout, 0), 0),
  'credit',
  'campaign_jobs',
  id::text,
  'Pendapatan job buzzer (' || campaign_title || ')',
  COALESCE(admin_verified_at, updated_at, created_at)
FROM public.campaign_jobs
WHERE (status = 'Selesai' OR admin_verified_at IS NOT NULL)
  AND buzzer_email IS NOT NULL AND trim(buzzer_email) <> ''
  AND GREATEST(COALESCE(buzzer_amount, payout, 0), 0) > 0
ON CONFLICT (entry_type, ref_table, ref_id) DO NOTHING;

-- Job selesai (komisi admin)
INSERT INTO public.financial_ledger (
  entry_type, account_type, account_identifier, amount, direction,
  ref_table, ref_id, description, created_at
)
SELECT
  'admin_commission',
  'admin',
  'admin',
  GREATEST(COALESCE(admin_amount, GREATEST(COALESCE(gross_price, 0) - GREATEST(COALESCE(buzzer_amount, payout, 0), 0), 0)), 0),
  'credit',
  'campaign_jobs',
  id::text,
  'Komisi admin dari job (' || campaign_title || ')',
  COALESCE(admin_verified_at, updated_at, created_at)
FROM public.campaign_jobs
WHERE (status = 'Selesai' OR admin_verified_at IS NOT NULL)
  AND GREATEST(COALESCE(admin_amount, GREATEST(COALESCE(gross_price, 0) - GREATEST(COALESCE(buzzer_amount, payout, 0), 0), 0)), 0) > 0
ON CONFLICT (entry_type, ref_table, ref_id) DO NOTHING;

-- Pencairan buzzer
INSERT INTO public.financial_ledger (
  entry_type, account_type, account_identifier, amount, direction,
  ref_table, ref_id, description, created_at
)
SELECT
  'buzzer_withdrawal',
  'buzzer',
  lower(trim(buzzer_email)),
  amount,
  'debit',
  'withdrawals',
  id::text,
  'Pencairan dana buzzer (' || method || ' ke ' || account_no || ')',
  COALESCE(completed_at, approved_at, created_at)
FROM public.withdrawals
WHERE status = 'Berhasil'
ON CONFLICT (entry_type, ref_table, ref_id) DO NOTHING;

-- Penarikan admin
INSERT INTO public.financial_ledger (
  entry_type, account_type, account_identifier, amount, direction,
  ref_table, ref_id, description, created_at
)
SELECT
  'admin_withdrawal',
  'admin',
  'admin',
  amount,
  'debit',
  'admin_withdrawals',
  id::text,
  'Penarikan profit admin (' || method || ')',
  created_at
FROM public.admin_withdrawals
WHERE status = 'Berhasil'
ON CONFLICT (entry_type, ref_table, ref_id) DO NOTHING;

COMMIT;

