-- The customer price is the gross value of the job.  A verified buzzer's
-- follower-derived level decides only how that value is split.
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
    ELSE NULL
  END;
$$;

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
  IF NOT EXISTS (SELECT 1 FROM public.buzzer_applications WHERE lower(trim(email)) = lower(trim(p_buzzer_email)) AND status = 'approved') THEN
    RAISE EXCEPTION 'Akun buzzer belum diverifikasi admin';
  END IF;
  SELECT * INTO target_job FROM public.campaign_jobs WHERE id = p_job_id FOR UPDATE;
  IF NOT FOUND OR target_job.status <> 'Tersedia' OR target_job.buzzer_email IS NOT NULL THEN RAISE EXCEPTION 'Job sudah tidak tersedia'; END IF;
  SELECT * INTO target_campaign FROM public.campaigns WHERE id = target_job.campaign_id FOR UPDATE;
  IF NOT FOUND OR target_campaign.payment_status <> 'Pembayaran Disetujui' OR target_campaign.status NOT IN ('Aktif', 'Review') THEN RAISE EXCEPTION 'Campaign belum aktif atau pembayaran belum disetujui'; END IF;
  IF target_campaign.start_date !~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}$' OR target_campaign.start_date::date > CURRENT_DATE THEN RAISE EXCEPTION 'Campaign belum memasuki tanggal mulai'; END IF;
  IF target_campaign.deadline !~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}$' OR target_campaign.deadline::date < CURRENT_DATE THEN RAISE EXCEPTION 'Masa campaign telah berakhir'; END IF;
  IF NOT EXISTS (SELECT 1 FROM public.social_accounts WHERE lower(trim(buzzer_email)) = lower(trim(p_buzzer_email)) AND platform = target_job.platform AND verification = 'Terverifikasi' AND is_active = true) THEN RAISE EXCEPTION 'Akun sosial media kamu belum terverifikasi atau tidak sesuai platform job'; END IF;

  SELECT level INTO snapshot_level FROM public.buzzer_wallets WHERE lower(trim(buzzer_email)) = lower(trim(p_buzzer_email));
  buzzer_share_percentage := public.buzzer_share_percentage_for_level(snapshot_level);
  IF buzzer_share_percentage IS NULL THEN RAISE EXCEPTION 'Level buzzer belum ditetapkan'; END IF;

  -- Do not use buzzer_levels.payout_per_job here: it is the level display
  -- tariff, not this customer's job price.  The job price is allocated when
  -- the campaign is opened and must remain the total of both shares.
  gross_amount := GREATEST(COALESCE(target_job.gross_price, target_campaign.budget / GREATEST(target_campaign.slots, 1), 0), 0);
  IF gross_amount <= 0 THEN RAISE EXCEPTION 'Harga job tidak valid'; END IF;
  buzzer_share_amount := ROUND(gross_amount * buzzer_share_percentage / 100);

  SELECT count(*)::integer INTO assigned_count FROM public.campaign_jobs WHERE campaign_id = target_campaign.id AND buzzer_email IS NOT NULL;
  IF assigned_count >= GREATEST(target_campaign.slots, 1) THEN RAISE EXCEPTION 'Target campaign telah tercapai'; END IF;
  IF EXISTS (SELECT 1 FROM public.campaign_jobs WHERE campaign_id = target_campaign.id AND lower(trim(buzzer_email)) = lower(trim(p_buzzer_email))) THEN RAISE EXCEPTION 'Kamu sudah pernah mengambil campaign ini'; END IF;

  UPDATE public.campaign_jobs
  SET status = 'Diambil', buzzer_email = lower(trim(p_buzzer_email)), buzzer_name = p_buzzer_name,
      gross_price = gross_amount, payout = buzzer_share_amount,
      buzzer_level = snapshot_level, buzzer_percentage = buzzer_share_percentage,
      buzzer_amount = buzzer_share_amount, admin_percentage = 100 - buzzer_share_percentage,
      admin_amount = gross_amount - buzzer_share_amount, updated_at = now()
  WHERE id = target_job.id;
  IF assigned_count + 1 >= GREATEST(target_campaign.slots, 1) THEN UPDATE public.campaigns SET target_reached_at = now(), updated_at = now() WHERE id = target_campaign.id; END IF;
  RETURN target_job.id;
END;
$$;

-- Correct jobs awaiting approval. Completed jobs stay immutable because their
-- recorded wallet credit and finance activity are already an audit record.
UPDATE public.campaign_jobs AS job
SET buzzer_percentage = public.buzzer_share_percentage_for_level(job.buzzer_level),
    admin_percentage = 100 - public.buzzer_share_percentage_for_level(job.buzzer_level),
    buzzer_amount = ROUND(job.gross_price * public.buzzer_share_percentage_for_level(job.buzzer_level) / 100),
    payout = ROUND(job.gross_price * public.buzzer_share_percentage_for_level(job.buzzer_level) / 100),
    admin_amount = job.gross_price - ROUND(job.gross_price * public.buzzer_share_percentage_for_level(job.buzzer_level) / 100),
    updated_at = now()
WHERE job.status IN ('Diambil', 'Review', 'Revisi')
  AND public.buzzer_share_percentage_for_level(job.buzzer_level) IS NOT NULL
  AND job.gross_price > 0;

REVOKE ALL ON FUNCTION public.buzzer_share_percentage_for_level(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.buzzer_share_percentage_for_level(text) TO anon, authenticated;
REVOKE ALL ON FUNCTION public.claim_campaign_job(uuid, text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.claim_campaign_job(uuid, text, text) TO anon, authenticated;

