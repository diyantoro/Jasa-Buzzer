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

