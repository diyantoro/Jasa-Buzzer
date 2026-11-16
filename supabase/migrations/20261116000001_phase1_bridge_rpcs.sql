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
