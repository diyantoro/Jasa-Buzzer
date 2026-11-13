-- =====================================================================
-- Migration: 20261113010000_customer_tier_downgrade_consent.sql
-- Description: Turun kelas TIDAK boleh terjadi tanpa persetujuan customer.
--
--   - `campaigns.allow_tier_downgrade` (default false)
--   - `campaign_jobs.allow_tier_downgrade` (disalin dari campaign)
--   - `claim_campaign_job`:
--       naik kelas   → otomatis (6 jam per tingkat), tidak perlu izin
--       turun kelas  → hanya bila customer mencentang izin, setelah 12 jam,
--                      maksimal satu tingkat
--   - `create_customer_custom_scheduled_payment_campaign` menerima
--     `p_allow_tier_downgrade` (default false)
--
--   Dengan begitu customer Premium tidak akan pernah diturunkan ke Pro
--   tanpa sepengetahuannya.
-- =====================================================================

-- 1. Izin turun kelas pada campaign & job ------------------------------
ALTER TABLE public.campaigns
  ADD COLUMN IF NOT EXISTS allow_tier_downgrade boolean NOT NULL DEFAULT false;

ALTER TABLE public.campaign_jobs
  ADD COLUMN IF NOT EXISTS allow_tier_downgrade boolean NOT NULL DEFAULT false;

-- Trigger yang sama sekarang juga menyalin izin turun kelas.
CREATE OR REPLACE FUNCTION public.set_campaign_job_required_tier()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  source_campaign public.campaigns%ROWTYPE;
BEGIN
  SELECT * INTO source_campaign FROM public.campaigns WHERE id = NEW.campaign_id;

  NEW.required_tier := COALESCE(source_campaign.buzzer_tier, NEW.required_tier, 'Biasa');
  NEW.allow_tier_downgrade := COALESCE(source_campaign.allow_tier_downgrade, NEW.allow_tier_downgrade, false);
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS set_campaign_job_required_tier ON public.campaign_jobs;
CREATE TRIGGER set_campaign_job_required_tier
  BEFORE INSERT ON public.campaign_jobs
  FOR EACH ROW EXECUTE FUNCTION public.set_campaign_job_required_tier();

UPDATE public.campaign_jobs AS job
SET allow_tier_downgrade = COALESCE(campaign.allow_tier_downgrade, false)
FROM public.campaigns AS campaign
WHERE campaign.id = job.campaign_id
  AND job.allow_tier_downgrade IS DISTINCT FROM COALESCE(campaign.allow_tier_downgrade, false);

-- 2. Klaim job dengan izin turun kelas --------------------------------
CREATE OR REPLACE FUNCTION public.claim_campaign_job(p_job_id uuid, p_buzzer_email text, p_buzzer_name text)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  target_job public.campaign_jobs%ROWTYPE;
  target_campaign public.campaigns%ROWTYPE;
  assigned_count integer;
  snapshot_level text;
  gross_amount numeric;
  buzzer_share_percentage numeric;
  buzzer_share_amount numeric;
  user_category text;
  app_status text;
  acc_role text;

  required_tier_value text;
  buzzer_tier_value text;
  required_rank integer;
  buzzer_rank integer;
  buzzer_followers integer;
  publish_at timestamptz;
  elapsed_hours numeric;

  c_rise_hours constant integer := 6;   -- naik satu tingkat
  c_fall_hours constant integer := 12;  -- turun satu tingkat
BEGIN
  -- 1. Check account verification
  SELECT status, buzzer_category INTO app_status, user_category
  FROM public.buzzer_applications
  WHERE lower(trim(email)) = lower(trim(p_buzzer_email))
  ORDER BY submitted_at DESC
  LIMIT 1;

  SELECT role, company INTO acc_role, user_category
  FROM public.app_accounts
  WHERE lower(trim(email)) = lower(trim(p_buzzer_email))
  LIMIT 1;

  IF (app_status IS DISTINCT FROM 'approved') AND (acc_role IS DISTINCT FROM 'buzzer') THEN
    RAISE EXCEPTION 'Akun buzzer belum diverifikasi admin';
  END IF;

  -- 2. Lock job
  SELECT * INTO target_job FROM public.campaign_jobs WHERE id = p_job_id FOR UPDATE;
  IF NOT FOUND OR target_job.status <> 'Tersedia' OR target_job.buzzer_email IS NOT NULL THEN
    RAISE EXCEPTION 'Job sudah tidak tersedia';
  END IF;

  -- 3. Lock campaign
  SELECT * INTO target_campaign FROM public.campaigns WHERE id = target_job.campaign_id FOR UPDATE;
  IF NOT FOUND OR target_campaign.payment_status <> 'Pembayaran Disetujui' OR target_campaign.status NOT IN ('Aktif', 'Review') THEN
    RAISE EXCEPTION 'Campaign belum aktif atau pembayaran belum disetujui';
  END IF;

  -- 4. Check deadline
  IF target_campaign.deadline ~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}$' AND target_campaign.deadline::date < CURRENT_DATE THEN
    RAISE EXCEPTION 'Masa campaign telah berakhir';
  END IF;

  -- 5. Strict category & platform validation
  IF target_job.platform = 'Offline' THEN
    IF user_category IS NOT NULL AND NOT (
      lower(user_category) LIKE '%offline%' OR lower(user_category) LIKE '%hybrid%'
    ) THEN
      RAISE EXCEPTION 'Job Offline hanya dapat diambil oleh akun kategori Offline Buzzer';
    END IF;
  ELSE
    IF user_category IS NOT NULL AND lower(user_category) = 'buzzer offline' THEN
      RAISE EXCEPTION 'Job Online tidak dapat diambil oleh akun kategori Offline Buzzer';
    END IF;

    IF target_campaign.start_date ~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}$' AND target_campaign.start_date::date > CURRENT_DATE THEN
      RAISE EXCEPTION 'Campaign belum memasuki tanggal mulai';
    END IF;

    IF NOT EXISTS (
      SELECT 1 FROM public.social_accounts
      WHERE lower(trim(buzzer_email)) = lower(trim(p_buzzer_email))
        AND lower(trim(platform)) = lower(trim(target_job.platform))
        AND lower(trim(verification)) = 'terverifikasi'
        AND (is_active = true OR is_active IS NULL)
    ) AND NOT EXISTS (
      SELECT 1 FROM public.buzzer_applications
      WHERE lower(trim(email)) = lower(trim(p_buzzer_email))
        AND status = 'approved'
        AND lower(trim(platform)) = lower(trim(target_job.platform))
    ) AND NOT EXISTS (
      SELECT 1 FROM public.app_accounts
      WHERE lower(trim(email)) = lower(trim(p_buzzer_email))
        AND role = 'buzzer'
        AND lower(trim(coalesce(platform, ''))) = lower(trim(target_job.platform))
    ) THEN
      RAISE EXCEPTION 'Akun sosial media kamu belum terverifikasi atau tidak sesuai platform job';
    END IF;
  END IF;

  -- 6. Check slot availability
  SELECT count(*)::integer INTO assigned_count
  FROM public.campaign_jobs WHERE campaign_id = target_campaign.id AND buzzer_email IS NOT NULL;

  IF assigned_count >= GREATEST(target_campaign.slots, 1) THEN
    UPDATE public.campaigns SET target_reached_at = COALESCE(target_reached_at, now()), updated_at = now() WHERE id = target_campaign.id;
    RAISE EXCEPTION 'Target campaign telah tercapai';
  END IF;

  -- 7. Prevent duplicate claiming
  IF EXISTS (
    SELECT 1 FROM public.campaign_jobs
    WHERE campaign_id = target_campaign.id AND lower(trim(buzzer_email)) = lower(trim(p_buzzer_email))
  ) THEN
    RAISE EXCEPTION 'Kamu sudah pernah mengambil campaign ini';
  END IF;

  -- 8. Followers & kelas buzzer
  IF target_job.platform = 'Offline' THEN
    SELECT COALESCE(SUM(followers), 0)::integer INTO buzzer_followers
    FROM public.social_accounts
    WHERE lower(trim(buzzer_email)) = lower(trim(p_buzzer_email))
      AND verification = 'Terverifikasi'
      AND COALESCE(is_active, true);
  ELSE
    SELECT COALESCE(SUM(followers), 0)::integer INTO buzzer_followers
    FROM public.social_accounts
    WHERE lower(trim(buzzer_email)) = lower(trim(p_buzzer_email))
      AND lower(trim(platform)) = lower(trim(target_job.platform))
      AND lower(trim(verification)) = 'terverifikasi'
      AND COALESCE(is_active, true);
  END IF;

  buzzer_tier_value := public.buzzer_tier_for_followers(COALESCE(buzzer_followers, 0));
  buzzer_rank := public.buzzer_tier_rank(buzzer_tier_value);

  -- 9. Validasi kelas job (job offline tidak memakai kelas)
  IF target_job.platform <> 'Offline' THEN
    required_tier_value := COALESCE(
      NULLIF(trim(target_job.required_tier), ''),
      NULLIF(trim(target_campaign.buzzer_tier), ''),
      'Biasa'
    );
    required_rank := public.buzzer_tier_rank(required_tier_value);

    publish_at := target_job.created_at;
    IF target_campaign.start_date ~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}$' THEN
      publish_at := GREATEST(publish_at, target_campaign.start_date::date::timestamptz);
    END IF;
    elapsed_hours := GREATEST(EXTRACT(EPOCH FROM (now() - publish_at)) / 3600.0, 0);

    IF buzzer_rank >= required_rank THEN
      -- Naik kelas: butuh 6 jam per tingkat di atas kelas job.
      IF elapsed_hours < c_rise_hours * (buzzer_rank - required_rank) THEN
        RAISE EXCEPTION 'Job kelas % baru dibuka untuk kelas % setelah % jam',
          required_tier_value, buzzer_tier_value,
          (c_rise_hours * (buzzer_rank - required_rank))::integer;
      END IF;
    ELSIF buzzer_rank = required_rank - 1 THEN
      -- Turun satu tingkat: hanya bila customer mengizinkan, setelah 12 jam.
      IF NOT COALESCE(target_job.allow_tier_downgrade, target_campaign.allow_tier_downgrade, false) THEN
        RAISE EXCEPTION 'Job ini hanya untuk buzzer kelas %', required_tier_value;
      END IF;
      IF elapsed_hours < c_fall_hours THEN
        RAISE EXCEPTION 'Job kelas % masih diprioritaskan untuk kelas % sampai % jam pertama',
          required_tier_value, required_tier_value, c_fall_hours;
      END IF;
    ELSE
      RAISE EXCEPTION 'Job ini membutuhkan buzzer kelas minimal %', required_tier_value;
    END IF;
  END IF;

  -- 10. Payout calculation & Snapshot
  gross_amount := GREATEST(COALESCE(target_job.gross_price, target_campaign.budget / GREATEST(target_campaign.slots, 1), 0), 0);
  IF gross_amount <= 0 THEN
    RAISE EXCEPTION 'Harga job tidak valid';
  END IF;

  IF target_job.platform = 'Offline' THEN
    buzzer_share_amount := GREATEST(COALESCE(target_job.payout, target_campaign.payout_per_buzzer, 0), 0);

    IF buzzer_share_amount <= 0 THEN
      RAISE EXCEPTION 'Nominal buzzer belum ditetapkan admin untuk job ini';
    END IF;

    IF buzzer_share_amount > gross_amount THEN
      RAISE EXCEPTION 'Total bayaran buzzer tidak boleh melebihi harga pesanan.';
    END IF;

    SELECT bl.name INTO snapshot_level
    FROM public.buzzer_levels AS bl
    WHERE bl.min_followers <= COALESCE(buzzer_followers, 0)
    ORDER BY bl.min_followers DESC, bl.sort_order DESC
    LIMIT 1;

    UPDATE public.campaign_jobs
    SET status = 'Diambil',
        buzzer_email = lower(trim(p_buzzer_email)),
        buzzer_name = p_buzzer_name,
        buzzer_level = snapshot_level,
        buzzer_percentage = NULL,
        buzzer_amount = buzzer_share_amount,
        admin_percentage = NULL,
        admin_amount = gross_amount - buzzer_share_amount,
        payout = buzzer_share_amount,
        updated_at = now()
    WHERE id = target_job.id;
  ELSE
    SELECT bl.name, bl.payout_percentage
      INTO snapshot_level, buzzer_share_percentage
    FROM public.buzzer_levels AS bl
    WHERE bl.min_followers <= COALESCE(buzzer_followers, 0)
    ORDER BY bl.min_followers DESC, bl.sort_order DESC
    LIMIT 1;

    IF snapshot_level IS NULL THEN
      snapshot_level := 'Bronze';
      SELECT payout_percentage INTO buzzer_share_percentage
      FROM public.buzzer_levels
      WHERE lower(trim(name)) = 'bronze';
    END IF;

    IF buzzer_share_percentage IS NULL OR buzzer_share_percentage <= 0 THEN
      buzzer_share_percentage := 40;
    END IF;

    buzzer_share_amount := ROUND(gross_amount * buzzer_share_percentage / 100);
    IF buzzer_share_amount > gross_amount THEN
      buzzer_share_amount := gross_amount;
    END IF;
    IF buzzer_share_amount < 0 THEN
      buzzer_share_amount := 0;
    END IF;

    UPDATE public.campaign_jobs
    SET status = 'Diambil',
        buzzer_email = lower(trim(p_buzzer_email)),
        buzzer_name = p_buzzer_name,
        buzzer_level = snapshot_level,
        buzzer_percentage = buzzer_share_percentage,
        buzzer_amount = buzzer_share_amount,
        admin_percentage = 100 - buzzer_share_percentage,
        admin_amount = gross_amount - buzzer_share_amount,
        payout = buzzer_share_amount,
        updated_at = now()
    WHERE id = target_job.id;
  END IF;

  -- 11. If this filled the last slot, mark campaign target reached
  IF assigned_count + 1 >= GREATEST(target_campaign.slots, 1) THEN
    UPDATE public.campaigns SET target_reached_at = now() WHERE id = target_campaign.id;
  END IF;

  RETURN target_job.id;
END;
$$;

REVOKE ALL ON FUNCTION public.claim_campaign_job(uuid, text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.claim_campaign_job(uuid, text, text) TO anon, authenticated;

-- 3. Pesanan sendiri: simpan izin turun kelas -------------------------
DROP FUNCTION IF EXISTS public.create_customer_custom_scheduled_payment_campaign(
  text, text, text, text, text, text, text, text, text, integer, text, text, text
);

CREATE OR REPLACE FUNCTION public.create_customer_custom_scheduled_payment_campaign(
  p_invoice_no text,
  p_customer_name text,
  p_customer_email text,
  p_campaign_name text,
  p_platform text,
  p_service_type text,
  p_method text,
  p_note text,
  p_brief text,
  p_slots integer,
  p_start_date text,
  p_deadline text,
  p_buzzer_tier text DEFAULT 'Biasa',
  p_allow_tier_downgrade boolean DEFAULT false
)
RETURNS TABLE(payment_id uuid, campaign_id uuid)
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  pricing public.service_pricing%ROWTYPE;
  created_payment_id uuid;
  created_campaign_id uuid;
  normalized_email text := lower(trim(p_customer_email));
  snapshot_total numeric;
  resolved_tier text := CASE lower(trim(COALESCE(p_buzzer_tier, 'Biasa')))
    WHEN 'premium' THEN 'Premium'
    WHEN 'pro'     THEN 'Pro'
    ELSE 'Biasa'
  END;
  allow_downgrade boolean := false;
BEGIN
  IF p_slots IS NULL OR p_slots < 1 THEN
    RAISE EXCEPTION 'Jumlah buzzer minimal 1';
  END IF;
  IF p_start_date !~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}$'
     OR p_deadline !~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}$'
     OR p_deadline::date < p_start_date::date THEN
    RAISE EXCEPTION 'Rentang tanggal campaign tidak valid';
  END IF;

  -- Kelas Biasa tidak punya kelas di bawahnya, jadi izin tidak berlaku.
  allow_downgrade := COALESCE(p_allow_tier_downgrade, false) AND resolved_tier <> 'Biasa';

  SELECT * INTO pricing
  FROM public.service_pricing
  WHERE status = 'Aktif'
    AND lower(trim(platform)) = lower(trim(p_platform))
    AND lower(trim(service_type)) = lower(trim(p_service_type))
    AND lower(trim(buzzer_tier)) = lower(trim(resolved_tier));
  IF pricing.id IS NULL THEN
    RAISE EXCEPTION 'Harga layanan kelas % belum dikonfigurasi admin', resolved_tier;
  END IF;

  snapshot_total := pricing.price_per_buzzer * p_slots;

  INSERT INTO public.payments (
    invoice_no, customer_name, customer_email, campaign_name, campaign_type,
    method, note, amount, buzzer_cost, fee, status, paid_at,
    price_per_buzzer, buzzer_count, total_amount
  ) VALUES (
    p_invoice_no, p_customer_name, normalized_email, p_campaign_name, p_platform,
    p_method, p_note, snapshot_total, 0, snapshot_total, 'Menunggu Verifikasi', now(),
    pricing.price_per_buzzer, p_slots, snapshot_total
  ) RETURNING id INTO created_payment_id;

  INSERT INTO public.campaigns (
    title, customer_email, customer_name, platform, service_type, brief, budget,
    payout_per_buzzer, slots, start_date, deadline, payment_id, payment_status, status,
    price_per_buzzer, buzzer_count, total_amount, buzzer_tier, allow_tier_downgrade
  ) VALUES (
    p_campaign_name, normalized_email, p_customer_name, p_platform, p_service_type,
    p_brief, snapshot_total, 0, p_slots, p_start_date, p_deadline, created_payment_id,
    'Menunggu Verifikasi', 'Draft', pricing.price_per_buzzer, p_slots, snapshot_total,
    resolved_tier, allow_downgrade
  ) RETURNING id INTO created_campaign_id;

  UPDATE public.payments
  SET campaign_id = created_campaign_id, updated_at = now()
  WHERE id = created_payment_id;

  RETURN QUERY SELECT created_payment_id, created_campaign_id;
END;
$$;

REVOKE ALL ON FUNCTION public.create_customer_custom_scheduled_payment_campaign(
  text, text, text, text, text, text, text, text, text, integer, text, text, text, boolean
) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.create_customer_custom_scheduled_payment_campaign(
  text, text, text, text, text, text, text, text, text, integer, text, text, text, boolean
) TO anon, authenticated;
