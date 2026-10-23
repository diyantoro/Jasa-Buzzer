-- Migration: 20261001130000_fix_level_based_buzzer_payouts.sql
-- Fix level-based buzzer payout split so that buzzer income scales with their verified level:
-- Bronze: 40% (Admin 60%)
-- Silver: 45% (Admin 55%)
-- Gold: 50% (Admin 50%)
-- Platinum: 55% (Admin 45%)
-- Diamond: 60% (Admin 40%)

-- 1. Standardize buzzer_share_percentage_for_level
CREATE OR REPLACE FUNCTION public.buzzer_share_percentage_for_level(p_level text)
RETURNS numeric
LANGUAGE sql
IMMUTABLE
PARALLEL SAFE
AS $$
  SELECT CASE p_level
    WHEN 'Bronze' THEN 40
    WHEN 'Silver' THEN 45
    WHEN 'Gold' THEN 50
    WHEN 'Platinum' THEN 55
    WHEN 'Diamond' THEN 60
    ELSE 40
  END;
$$;

REVOKE ALL ON FUNCTION public.buzzer_share_percentage_for_level(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.buzzer_share_percentage_for_level(text) TO anon, authenticated;

-- 2. Update claim_campaign_job to use buzzer level percentage
CREATE OR REPLACE FUNCTION public.claim_campaign_job(p_job_id uuid, p_buzzer_email text, p_buzzer_name text)
RETURNS uuid
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  target_job public.campaign_jobs%ROWTYPE;
  target_campaign public.campaigns%ROWTYPE;
  assigned_count integer;
  snapshot_level text;
  gross_amount numeric;
  buzzer_share_percentage numeric;
  buzzer_share_amount numeric;
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM public.buzzer_applications
    WHERE lower(trim(email)) = lower(trim(p_buzzer_email)) AND status = 'approved'
  ) AND NOT EXISTS (
    SELECT 1 FROM public.app_accounts
    WHERE lower(trim(email)) = lower(trim(p_buzzer_email)) AND role = 'buzzer'
  ) THEN
    RAISE EXCEPTION 'Akun buzzer belum diverifikasi admin';
  END IF;

  SELECT * INTO target_job FROM public.campaign_jobs WHERE id = p_job_id FOR UPDATE;
  IF NOT FOUND OR target_job.status <> 'Tersedia' OR target_job.buzzer_email IS NOT NULL THEN
    RAISE EXCEPTION 'Job sudah tidak tersedia';
  END IF;

  SELECT * INTO target_campaign FROM public.campaigns WHERE id = target_job.campaign_id FOR UPDATE;
  IF NOT FOUND OR target_campaign.payment_status <> 'Pembayaran Disetujui' OR target_campaign.status NOT IN ('Aktif', 'Review') THEN
    RAISE EXCEPTION 'Campaign belum aktif atau pembayaran belum disetujui';
  END IF;

  IF target_campaign.start_date !~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}$' OR target_campaign.start_date::date > CURRENT_DATE THEN
    RAISE EXCEPTION 'Campaign belum memasuki tanggal mulai';
  END IF;
  IF target_campaign.deadline !~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}$' OR target_campaign.deadline::date < CURRENT_DATE THEN
    RAISE EXCEPTION 'Masa campaign telah berakhir';
  END IF;

  IF target_job.platform <> 'Offline' THEN
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

  SELECT count(*)::integer INTO assigned_count
  FROM public.campaign_jobs WHERE campaign_id = target_campaign.id AND buzzer_email IS NOT NULL;
  IF assigned_count >= GREATEST(target_campaign.slots, 1) THEN
    UPDATE public.campaigns SET target_reached_at = COALESCE(target_reached_at, now()), updated_at = now() WHERE id = target_campaign.id;
    RAISE EXCEPTION 'Target campaign telah tercapai';
  END IF;
  IF EXISTS (
    SELECT 1 FROM public.campaign_jobs
    WHERE campaign_id = target_campaign.id AND lower(trim(buzzer_email)) = lower(trim(p_buzzer_email))
  ) THEN
    RAISE EXCEPTION 'Kamu sudah pernah mengambil campaign ini';
  END IF;

  UPDATE public.campaign_jobs
  SET status = 'Diambil', buzzer_email = lower(trim(p_buzzer_email)), buzzer_name = p_buzzer_name,
      gross_price = gross_amount, payout = buzzer_share_amount,
      buzzer_level = snapshot_level, buzzer_percentage = buzzer_share_percentage,
      buzzer_amount = buzzer_share_amount, admin_percentage = 100 - buzzer_share_percentage,
      admin_amount = gross_amount - buzzer_share_amount, updated_at = now()
  WHERE id = target_job.id;

  IF assigned_count + 1 >= GREATEST(target_campaign.slots, 1) THEN
    UPDATE public.campaigns SET target_reached_at = now(), updated_at = now() WHERE id = target_campaign.id;
  END IF;
  RETURN target_job.id;
END;
$$;

-- 3. Update snapshot_level_payout_before_completion trigger function
CREATE OR REPLACE FUNCTION public.snapshot_level_payout_before_completion()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  active_level text;
  gross_amount numeric;
  buzzer_pct numeric;
  buzzer_share numeric;
BEGIN
  IF NEW.status = 'Selesai'
     AND OLD.status IS DISTINCT FROM 'Selesai'
     AND NEW.buzzer_email IS NOT NULL THEN
    
    gross_amount := GREATEST(COALESCE(NEW.gross_price, 0), 0);
    
    IF gross_amount > 0 THEN
      SELECT wallet.level INTO active_level
      FROM public.buzzer_wallets AS wallet
      WHERE lower(trim(wallet.buzzer_email)) = lower(trim(NEW.buzzer_email));

      active_level := COALESCE(active_level, NEW.buzzer_level, 'Bronze');
      buzzer_pct := public.buzzer_share_percentage_for_level(active_level);
      buzzer_share := ROUND(gross_amount * buzzer_pct / 100);

      NEW.buzzer_level := active_level;
      NEW.buzzer_amount := buzzer_share;
      NEW.payout := buzzer_share;
      NEW.admin_amount := GREATEST(gross_amount - buzzer_share, 0);
      NEW.buzzer_percentage := buzzer_pct;
      NEW.admin_percentage := 100 - buzzer_pct;
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

-- 4. Update preserve_admin_margin_by_level trigger function
CREATE OR REPLACE FUNCTION public.preserve_admin_margin_by_level()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
  buzzer_pct numeric;
  buzzer_share numeric;
  is_catalog boolean;
BEGIN
  IF NEW.gross_price IS NULL OR NEW.gross_price <= 0 THEN
    RETURN NEW;
  END IF;

  SELECT campaign.catalog_id IS NOT NULL INTO is_catalog
  FROM public.campaigns AS campaign
  WHERE campaign.id = NEW.campaign_id;
  IF COALESCE(is_catalog, false) THEN
    RETURN NEW;
  END IF;

  buzzer_pct := public.buzzer_share_percentage_for_level(COALESCE(NEW.buzzer_level, 'Bronze'));
  buzzer_share := ROUND(GREATEST(NEW.gross_price, 0) * buzzer_pct / 100);

  NEW.buzzer_amount := buzzer_share;
  NEW.payout := buzzer_share;
  NEW.buzzer_percentage := buzzer_pct;
  NEW.admin_amount := GREATEST(NEW.gross_price - buzzer_share, 0);
  NEW.admin_percentage := 100 - buzzer_pct;
  RETURN NEW;
END;
$$;
