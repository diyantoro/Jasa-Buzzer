-- Campaigns are only visible to buzzers during the date range chosen by the
-- customer. `deadline` remains the customer-selected end date.
ALTER TABLE public.campaigns
  ADD COLUMN IF NOT EXISTS start_date text NOT NULL DEFAULT '';

-- Preserve visibility for campaigns created before scheduling existed.
UPDATE public.campaigns
SET start_date = created_at::date::text
WHERE trim(start_date) = '';

CREATE OR REPLACE FUNCTION public.create_customer_scheduled_payment_campaign(
  p_invoice_no text, p_customer_name text, p_customer_email text,
  p_campaign_name text, p_campaign_type text, p_method text, p_note text,
  p_amount numeric, p_buzzer_cost numeric, p_fee numeric, p_brief text,
  p_budget numeric, p_payout_per_buzzer numeric, p_slots integer,
  p_start_date text, p_deadline text
)
RETURNS TABLE(payment_id uuid, campaign_id uuid)
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE created_payment_id uuid; created_campaign_id uuid;
BEGIN
  IF p_start_date !~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}$'
     OR p_deadline !~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}$'
     OR p_deadline::date < p_start_date::date THEN
    RAISE EXCEPTION 'Rentang tanggal campaign tidak valid';
  END IF;
  SELECT result.payment_id, result.campaign_id INTO created_payment_id, created_campaign_id
  FROM public.create_customer_payment_campaign(
    p_invoice_no, p_customer_name, p_customer_email, p_campaign_name, p_campaign_type,
    p_method, p_note, p_amount, p_buzzer_cost, p_fee, p_brief, p_budget,
    p_payout_per_buzzer, p_slots, p_deadline
  ) AS result;
  UPDATE public.campaigns SET start_date = p_start_date, updated_at = now() WHERE id = created_campaign_id;
  RETURN QUERY SELECT created_payment_id, created_campaign_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.create_customer_catalog_scheduled_payment_campaign(
  p_catalog_id uuid, p_invoice_no text, p_customer_name text, p_customer_email text,
  p_campaign_name text, p_method text, p_note text, p_brief text,
  p_start_date text, p_deadline text
)
RETURNS TABLE(payment_id uuid, campaign_id uuid)
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE created_payment_id uuid; created_campaign_id uuid;
BEGIN
  IF p_start_date !~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}$'
     OR p_deadline !~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}$'
     OR p_deadline::date < p_start_date::date THEN
    RAISE EXCEPTION 'Rentang tanggal campaign tidak valid';
  END IF;
  SELECT result.payment_id, result.campaign_id INTO created_payment_id, created_campaign_id
  FROM public.create_customer_catalog_payment_campaign(
    p_catalog_id, p_invoice_no, p_customer_name, p_customer_email, p_campaign_name,
    p_method, p_note, p_brief, p_deadline
  ) AS result;
  UPDATE public.campaigns SET start_date = p_start_date, updated_at = now() WHERE id = created_campaign_id;
  RETURN QUERY SELECT created_payment_id, created_campaign_id;
END;
$$;

REVOKE ALL ON FUNCTION public.create_customer_scheduled_payment_campaign(text, text, text, text, text, text, text, numeric, numeric, numeric, text, numeric, numeric, integer, text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.create_customer_scheduled_payment_campaign(text, text, text, text, text, text, text, numeric, numeric, numeric, text, numeric, numeric, integer, text, text) TO anon, authenticated;
REVOKE ALL ON FUNCTION public.create_customer_catalog_scheduled_payment_campaign(uuid, text, text, text, text, text, text, text, text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.create_customer_catalog_scheduled_payment_campaign(uuid, text, text, text, text, text, text, text, text, text) TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.get_buzzer_campaign_jobs(p_buzzer_email text)
RETURNS SETOF public.campaign_jobs
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT job.*
  FROM public.campaign_jobs AS job
  JOIN public.campaigns AS campaign ON campaign.id = job.campaign_id
  WHERE EXISTS (SELECT 1 FROM public.buzzer_applications application WHERE lower(trim(application.email)) = lower(trim(p_buzzer_email)) AND application.status = 'approved')
    AND campaign.payment_status = 'Pembayaran Disetujui'
    AND campaign.start_date ~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}$'
    AND campaign.start_date::date <= CURRENT_DATE
    AND campaign.deadline ~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}$'
    AND campaign.deadline::date >= CURRENT_DATE
    AND (lower(trim(coalesce(job.buzzer_email, ''))) = lower(trim(p_buzzer_email)) OR (
      job.status = 'Tersedia' AND job.buzzer_email IS NULL AND campaign.status IN ('Aktif', 'Review')
      AND (SELECT count(*) FROM public.campaign_jobs assigned_job WHERE assigned_job.campaign_id = campaign.id AND assigned_job.buzzer_email IS NOT NULL) < GREATEST(campaign.slots, 1)
      AND EXISTS (SELECT 1 FROM public.social_accounts account WHERE lower(trim(account.buzzer_email)) = lower(trim(p_buzzer_email)) AND account.platform = job.platform AND account.verification = 'Terverifikasi' AND account.is_active = true)
    ))
  ORDER BY job.created_at DESC;
$$;

-- Re-apply the claim guard at the database layer so a client cannot claim a
-- future or expired job by bypassing the listing UI.
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
  IF NOT EXISTS (SELECT 1 FROM public.buzzer_applications WHERE lower(trim(email)) = lower(trim(p_buzzer_email)) AND status = 'approved') THEN RAISE EXCEPTION 'Akun buzzer belum diverifikasi admin'; END IF;
  SELECT * INTO target_job FROM public.campaign_jobs WHERE id = p_job_id FOR UPDATE;
  IF NOT FOUND OR target_job.status <> 'Tersedia' OR target_job.buzzer_email IS NOT NULL THEN RAISE EXCEPTION 'Job sudah tidak tersedia'; END IF;
  SELECT * INTO target_campaign FROM public.campaigns WHERE id = target_job.campaign_id FOR UPDATE;
  IF NOT FOUND OR target_campaign.payment_status <> 'Pembayaran Disetujui' OR target_campaign.status NOT IN ('Aktif', 'Review') THEN RAISE EXCEPTION 'Campaign belum aktif atau pembayaran belum disetujui'; END IF;
  IF target_campaign.start_date !~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}$' OR target_campaign.start_date::date > CURRENT_DATE THEN RAISE EXCEPTION 'Campaign belum memasuki tanggal mulai'; END IF;
  IF target_campaign.deadline !~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}$' OR target_campaign.deadline::date < CURRENT_DATE THEN RAISE EXCEPTION 'Masa campaign telah berakhir'; END IF;
  IF NOT EXISTS (SELECT 1 FROM public.social_accounts WHERE lower(trim(buzzer_email)) = lower(trim(p_buzzer_email)) AND platform = target_job.platform AND verification = 'Terverifikasi' AND is_active = true) THEN RAISE EXCEPTION 'Akun sosial media kamu belum terverifikasi atau tidak sesuai platform job'; END IF;
  SELECT wallet.level INTO snapshot_level FROM public.buzzer_wallets wallet WHERE lower(trim(wallet.buzzer_email)) = lower(trim(p_buzzer_email));
  IF snapshot_level NOT IN ('Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond') THEN RAISE EXCEPTION 'Level buzzer belum ditetapkan'; END IF;
  SELECT GREATEST(COALESCE(level.payout_per_job, 0), 0) INTO gross_amount FROM public.buzzer_levels level WHERE level.name = snapshot_level;
  IF COALESCE(gross_amount, 0) <= 0 THEN RAISE EXCEPTION 'Bayaran untuk level buzzer belum dikonfigurasi'; END IF;
  buzzer_share_percentage := CASE snapshot_level WHEN 'Bronze' THEN 20 WHEN 'Silver' THEN 35 WHEN 'Gold' THEN 50 WHEN 'Platinum' THEN 60 WHEN 'Diamond' THEN 70 END;
  buzzer_share_amount := ROUND(gross_amount * buzzer_share_percentage / 100);
  SELECT count(*)::integer INTO assigned_count FROM public.campaign_jobs WHERE campaign_id = target_campaign.id AND buzzer_email IS NOT NULL;
  IF assigned_count >= GREATEST(target_campaign.slots, 1) THEN UPDATE public.campaigns SET target_reached_at = COALESCE(target_reached_at, now()), updated_at = now() WHERE id = target_campaign.id; RAISE EXCEPTION 'Target campaign telah tercapai'; END IF;
  IF EXISTS (SELECT 1 FROM public.campaign_jobs WHERE campaign_id = target_campaign.id AND lower(trim(buzzer_email)) = lower(trim(p_buzzer_email))) THEN RAISE EXCEPTION 'Kamu sudah pernah mengambil campaign ini'; END IF;
  UPDATE public.campaign_jobs SET status = 'Diambil', buzzer_email = lower(trim(p_buzzer_email)), buzzer_name = p_buzzer_name, gross_price = gross_amount, payout = buzzer_share_amount, buzzer_level = snapshot_level, buzzer_percentage = buzzer_share_percentage, buzzer_amount = buzzer_share_amount, admin_percentage = 100 - buzzer_share_percentage, admin_amount = gross_amount - buzzer_share_amount, updated_at = now() WHERE id = target_job.id;
  IF assigned_count + 1 >= GREATEST(target_campaign.slots, 1) THEN UPDATE public.campaigns SET target_reached_at = now(), updated_at = now() WHERE id = target_campaign.id; END IF;
  RETURN target_job.id;
END;
$$;
