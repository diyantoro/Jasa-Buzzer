-- Snapshot the buzzer's verified level and its payout split when a job is claimed.
-- Existing jobs are intentionally left unchanged; their legacy payout stays valid.
ALTER TABLE public.campaign_jobs
  ADD COLUMN IF NOT EXISTS buzzer_level text,
  ADD COLUMN IF NOT EXISTS buzzer_percentage numeric,
  ADD COLUMN IF NOT EXISTS buzzer_amount numeric,
  ADD COLUMN IF NOT EXISTS admin_percentage numeric,
  ADD COLUMN IF NOT EXISTS admin_amount numeric;

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
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM public.buzzer_applications
    WHERE lower(trim(email)) = lower(trim(p_buzzer_email))
      AND status = 'approved'
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

  SELECT GREATEST(COALESCE(level.payout_per_job, 0), 0)
    INTO gross_amount
  FROM public.buzzer_levels AS level
  WHERE level.name = snapshot_level;
  IF COALESCE(gross_amount, 0) <= 0 THEN
    RAISE EXCEPTION 'Bayaran untuk level buzzer belum dikonfigurasi';
  END IF;

  buzzer_share_percentage := CASE snapshot_level
    WHEN 'Bronze' THEN 20
    WHEN 'Silver' THEN 35
    WHEN 'Gold' THEN 50
    WHEN 'Platinum' THEN 60
    WHEN 'Diamond' THEN 70
  END;
  buzzer_share_amount := ROUND(gross_amount * buzzer_share_percentage / 100);

  SELECT count(*)::integer INTO assigned_count
  FROM public.campaign_jobs
  WHERE campaign_id = target_campaign.id AND buzzer_email IS NOT NULL;
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
  SET status = 'Diambil',
      buzzer_email = lower(trim(p_buzzer_email)),
      buzzer_name = p_buzzer_name,
      gross_price = gross_amount,
      payout = buzzer_share_amount,
      buzzer_level = snapshot_level,
      buzzer_percentage = buzzer_share_percentage,
      buzzer_amount = buzzer_share_amount,
      admin_percentage = 100 - buzzer_share_percentage,
      admin_amount = gross_amount - buzzer_share_amount,
      updated_at = now()
  WHERE id = target_job.id;
  IF assigned_count + 1 >= GREATEST(target_campaign.slots, 1) THEN
    UPDATE public.campaigns SET target_reached_at = now(), updated_at = now() WHERE id = target_campaign.id;
  END IF;
  RETURN target_job.id;
END;
$$;

CREATE OR REPLACE FUNCTION public.credit_buzzer_after_job_approval()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  snapshot_buzzer_amount numeric := GREATEST(COALESCE(NEW.buzzer_amount, NEW.payout, 0), 0);
  snapshot_admin_amount numeric;
BEGIN
  snapshot_admin_amount := GREATEST(COALESCE(NEW.admin_amount, COALESCE(NEW.gross_price, 0) - snapshot_buzzer_amount, 0), 0);
  IF NEW.status = 'Selesai' AND OLD.status IS DISTINCT FROM 'Selesai' AND NEW.buzzer_email IS NOT NULL THEN
    INSERT INTO public.buzzer_wallets (buzzer_email, buzzer_name, balance, pending_balance, updated_at)
    VALUES (lower(trim(NEW.buzzer_email)), COALESCE(NEW.buzzer_name, NEW.buzzer_email), snapshot_buzzer_amount, 0, now())
    ON CONFLICT (buzzer_email) DO UPDATE SET balance = public.buzzer_wallets.balance + EXCLUDED.balance,
      buzzer_name = EXCLUDED.buzzer_name, updated_at = now();

    INSERT INTO public.finance_activity (type, title, description, amount, ref_table, ref_id)
    VALUES
      ('Payout Buzzer', 'Payout buzzer disetujui', NEW.campaign_title, snapshot_buzzer_amount, 'campaign_jobs', NEW.id::text),
      ('Komisi Admin', 'Komisi admin dari job selesai', NEW.campaign_title, snapshot_admin_amount, 'campaign_jobs', NEW.id::text);
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS credit_buzzer_after_job_approval ON public.campaign_jobs;
CREATE TRIGGER credit_buzzer_after_job_approval
AFTER UPDATE OF status ON public.campaign_jobs
FOR EACH ROW EXECUTE FUNCTION public.credit_buzzer_after_job_approval();

REVOKE ALL ON FUNCTION public.claim_campaign_job(uuid, text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.claim_campaign_job(uuid, text, text) TO anon, authenticated;
