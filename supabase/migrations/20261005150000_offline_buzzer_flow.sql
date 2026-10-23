-- Migration for Offline Buzzer comprehensive flow
-- 1. Ensure columns on app_accounts and buzzer_applications
ALTER TABLE public.app_accounts
  ADD COLUMN IF NOT EXISTS buzzer_category text DEFAULT 'Buzzer Online',
  ADD COLUMN IF NOT EXISTS address text;

ALTER TABLE public.buzzer_applications
  ADD COLUMN IF NOT EXISTS buzzer_category text DEFAULT 'Buzzer Online',
  ADD COLUMN IF NOT EXISTS address text;

-- 2. Add offline event and presence tracking columns to campaign_jobs
ALTER TABLE public.campaign_jobs
  ADD COLUMN IF NOT EXISTS attendance_status text,
  ADD COLUMN IF NOT EXISTS attendance_confirmed_at timestamptz,
  ADD COLUMN IF NOT EXISTS checkin_at timestamptz,
  ADD COLUMN IF NOT EXISTS checkout_at timestamptz,
  ADD COLUMN IF NOT EXISTS activity_note text,
  ADD COLUMN IF NOT EXISTS location_name text,
  ADD COLUMN IF NOT EXISTS event_date text,
  ADD COLUMN IF NOT EXISTS event_time text;

-- 3. Atomic claim_campaign_job supporting Offline Buzzer
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

  -- 4. Check deadline (do not allow expired campaign)
  IF target_campaign.deadline ~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}$' AND target_campaign.deadline::date < CURRENT_DATE THEN
    RAISE EXCEPTION 'Masa campaign telah berakhir';
  END IF;

  -- 5. Strict category & platform validation
  IF target_job.platform = 'Offline' THEN
    -- Offline job: Buzzer must be Offline Buzzer or Offline-Online
    IF user_category IS NOT NULL AND NOT (
      lower(user_category) LIKE '%offline%' OR lower(user_category) LIKE '%hybrid%'
    ) THEN
      RAISE EXCEPTION 'Job Offline hanya dapat diambil oleh akun kategori Offline Buzzer';
    END IF;
  ELSE
    -- Online job: Offline-only buzzers cannot take online jobs
    IF user_category IS NOT NULL AND lower(user_category) = 'buzzer offline' THEN
      RAISE EXCEPTION 'Job Online tidak dapat diambil oleh akun kategori Offline Buzzer';
    END IF;

    -- Online job start date check
    IF target_campaign.start_date ~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}$' AND target_campaign.start_date::date > CURRENT_DATE THEN
      RAISE EXCEPTION 'Campaign belum memasuki tanggal mulai';
    END IF;

    -- Online job requires matching verified social account
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

  -- 8. Payout calculation
  SELECT level INTO snapshot_level FROM public.buzzer_wallets WHERE lower(trim(buzzer_email)) = lower(trim(p_buzzer_email));
  IF snapshot_level IS NULL THEN
    snapshot_level := 'Bronze';
  END IF;

  buzzer_share_percentage := public.buzzer_share_percentage_for_level(snapshot_level);
  gross_amount := GREATEST(COALESCE(target_job.gross_price, target_campaign.budget / GREATEST(target_campaign.slots, 1), 0), 0);
  IF gross_amount <= 0 THEN
    RAISE EXCEPTION 'Harga job tidak valid';
  END IF;

  buzzer_share_amount := ROUND(gross_amount * buzzer_share_percentage / 100);

  -- 9. Claim job atomically
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

  -- 10. If this filled the last slot, mark campaign target reached
  IF assigned_count + 1 >= GREATEST(target_campaign.slots, 1) THEN
    UPDATE public.campaigns SET target_reached_at = now(), updated_at = now() WHERE id = target_campaign.id;
  END IF;

  RETURN target_job.id;
END;
$$;

-- 4. get_buzzer_campaign_jobs with clean Offline vs Online separation
CREATE OR REPLACE FUNCTION public.get_buzzer_campaign_jobs(p_buzzer_email text)
RETURNS SETOF public.campaign_jobs
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT job.*
  FROM public.campaign_jobs AS job
  JOIN public.campaigns AS campaign ON campaign.id = job.campaign_id
  WHERE (
      -- Buzzer has approved status or active app account
      EXISTS (
        SELECT 1
        FROM public.buzzer_applications AS application
        WHERE lower(trim(application.email)) = lower(trim(p_buzzer_email))
          AND application.status = 'approved'
      )
      OR EXISTS (
        SELECT 1
        FROM public.app_accounts AS account
        WHERE lower(trim(account.email)) = lower(trim(p_buzzer_email))
          AND account.role = 'buzzer'
      )
    )
    AND campaign.payment_status = 'Pembayaran Disetujui'
    AND campaign.status IN ('Aktif', 'Review', 'Selesai')
    AND (
      -- Buzzer's own claimed jobs (always visible to them)
      lower(trim(job.buzzer_email)) = lower(trim(p_buzzer_email))
      OR (
        -- Open jobs
        job.status = 'Tersedia'
        AND job.buzzer_email IS NULL
        AND (
          -- OFFLINE JOBS: visible to Offline Buzzer or Offline-Online
          (
            job.platform = 'Offline'
            AND (
              EXISTS (
                SELECT 1 FROM public.buzzer_applications
                WHERE lower(trim(email)) = lower(trim(p_buzzer_email))
                  AND (lower(buzzer_category) LIKE '%offline%' OR lower(buzzer_category) LIKE '%hybrid%')
              )
              OR EXISTS (
                SELECT 1 FROM public.app_accounts
                WHERE lower(trim(email)) = lower(trim(p_buzzer_email))
                  AND (lower(coalesce(company, '')) LIKE '%offline%' OR lower(coalesce(company, '')) LIKE '%hybrid%')
              )
            )
          )
          -- ONLINE JOBS: visible to Online Buzzer or Offline-Online with verified social account
          OR (
            job.platform <> 'Offline'
            AND NOT (
              EXISTS (
                SELECT 1 FROM public.buzzer_applications
                WHERE lower(trim(email)) = lower(trim(p_buzzer_email))
                  AND lower(buzzer_category) = 'buzzer offline'
              )
              OR EXISTS (
                SELECT 1 FROM public.app_accounts
                WHERE lower(trim(email)) = lower(trim(p_buzzer_email))
                  AND lower(coalesce(company, '')) = 'buzzer offline'
              )
            )
            AND EXISTS (
              SELECT 1
              FROM public.social_accounts AS account
              WHERE lower(trim(account.buzzer_email)) = lower(trim(p_buzzer_email))
                AND account.platform = job.platform
                AND lower(trim(account.verification)) = 'terverifikasi'
                AND (account.is_active = true OR account.is_active IS NULL)
            )
          )
        )
      )
    )
  ORDER BY job.created_at DESC;
$$;

-- 5. RPC Helper for Presence & Check-in / Check-out
CREATE OR REPLACE FUNCTION public.confirm_offline_attendance(
  p_job_id uuid,
  p_buzzer_email text,
  p_status text
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.campaign_jobs
  SET attendance_status = p_status,
      attendance_confirmed_at = now(),
      updated_at = now()
  WHERE id = p_job_id
    AND lower(trim(buzzer_email)) = lower(trim(p_buzzer_email));
  RETURN FOUND;
END;
$$;

CREATE OR REPLACE FUNCTION public.checkin_offline_job(
  p_job_id uuid,
  p_buzzer_email text
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.campaign_jobs
  SET checkin_at = now(),
      updated_at = now()
  WHERE id = p_job_id
    AND lower(trim(buzzer_email)) = lower(trim(p_buzzer_email));
  RETURN FOUND;
END;
$$;

CREATE OR REPLACE FUNCTION public.checkout_offline_job(
  p_job_id uuid,
  p_buzzer_email text
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.campaign_jobs
  SET checkout_at = now(),
      updated_at = now()
  WHERE id = p_job_id
    AND lower(trim(buzzer_email)) = lower(trim(p_buzzer_email))
    AND checkin_at IS NOT NULL;
  RETURN FOUND;
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION public.claim_campaign_job(uuid, text, text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_buzzer_campaign_jobs(text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.confirm_offline_attendance(uuid, text, text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.checkin_offline_job(uuid, text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.checkout_offline_job(uuid, text) TO anon, authenticated;
