-- Use the configured nominal payout for the buzzer's verified level.
-- The existing follower-to-level assignment remains unchanged.
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
  level_payout numeric;
  buzzer_share_amount numeric;
  buzzer_share_percentage numeric;
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM public.buzzer_applications
    WHERE lower(trim(email)) = lower(trim(p_buzzer_email)) AND status = 'approved'
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
  IF NOT EXISTS (
    SELECT 1 FROM public.social_accounts
    WHERE lower(trim(buzzer_email)) = lower(trim(p_buzzer_email))
      AND platform = target_job.platform
      AND verification = 'Terverifikasi'
      AND is_active = true
  ) THEN
    RAISE EXCEPTION 'Akun sosial media kamu belum terverifikasi atau tidak sesuai platform job';
  END IF;

  SELECT wallet.level INTO snapshot_level
  FROM public.buzzer_wallets AS wallet
  WHERE lower(trim(wallet.buzzer_email)) = lower(trim(p_buzzer_email));
  IF snapshot_level NOT IN ('Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond') THEN
    RAISE EXCEPTION 'Level buzzer belum ditetapkan';
  END IF;

  SELECT GREATEST(COALESCE(level.payout_per_job, 0), 0) INTO level_payout
  FROM public.buzzer_levels AS level
  WHERE level.name = snapshot_level;
  IF COALESCE(level_payout, 0) <= 0 THEN
    RAISE EXCEPTION 'Bayaran untuk level buzzer belum dikonfigurasi';
  END IF;

  gross_amount := GREATEST(COALESCE(target_job.gross_price, target_campaign.budget / GREATEST(target_campaign.slots, 1), 0), 0);
  IF gross_amount <= 0 THEN
    RAISE EXCEPTION 'Harga job tidak valid';
  END IF;
  buzzer_share_amount := LEAST(gross_amount, level_payout);
  buzzer_share_percentage := ROUND(buzzer_share_amount * 100 / gross_amount, 2);

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

-- Existing incomplete claimed jobs receive the configured nominal too. Completed
-- jobs are intentionally immutable because their wallet credit is an audit record.
UPDATE public.campaign_jobs AS job
SET buzzer_amount = LEAST(GREATEST(COALESCE(job.gross_price, 0), 0), level.payout_per_job),
    payout = LEAST(GREATEST(COALESCE(job.gross_price, 0), 0), level.payout_per_job),
    buzzer_percentage = CASE WHEN job.gross_price > 0 THEN ROUND(LEAST(job.gross_price, level.payout_per_job) * 100 / job.gross_price, 2) ELSE 0 END,
    admin_amount = GREATEST(COALESCE(job.gross_price, 0) - LEAST(GREATEST(COALESCE(job.gross_price, 0), 0), level.payout_per_job), 0),
    admin_percentage = CASE WHEN job.gross_price > 0 THEN ROUND(100 - LEAST(job.gross_price, level.payout_per_job) * 100 / job.gross_price, 2) ELSE 100 END,
    updated_at = now()
FROM public.buzzer_levels AS level
WHERE job.buzzer_level = level.name
  AND job.buzzer_email IS NOT NULL
  AND job.status IN ('Diambil', 'Review', 'Revisi')
  AND job.gross_price > 0;

REVOKE ALL ON FUNCTION public.claim_campaign_job(uuid, text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.claim_campaign_job(uuid, text, text) TO anon, authenticated;
