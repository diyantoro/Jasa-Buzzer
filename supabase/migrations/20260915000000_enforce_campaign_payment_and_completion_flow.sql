-- Enforce payment approval, atomic campaign claims, completion, ratings, and payouts.
ALTER TABLE public.campaigns
  ADD COLUMN IF NOT EXISTS payment_id uuid,
  ADD COLUMN IF NOT EXISTS payment_status text NOT NULL DEFAULT 'Menunggu Pembayaran',
  ADD COLUMN IF NOT EXISTS payment_rejection_reason text,
  ADD COLUMN IF NOT EXISTS target_reached_at timestamptz;

ALTER TABLE public.payments
  ADD COLUMN IF NOT EXISTS campaign_id uuid,
  ADD COLUMN IF NOT EXISTS proof_url text,
  ADD COLUMN IF NOT EXISTS rejection_reason text,
  ADD COLUMN IF NOT EXISTS verified_at timestamptz,
  ADD COLUMN IF NOT EXISTS verified_by text;

UPDATE public.campaigns
SET payment_status = CASE
  WHEN status IN ('Aktif', 'Review', 'Selesai') THEN 'Pembayaran Disetujui'
  ELSE 'Menunggu Verifikasi'
END
WHERE payment_status = 'Menunggu Pembayaran';

CREATE INDEX IF NOT EXISTS campaigns_payment_id_idx ON public.campaigns (payment_id);
CREATE INDEX IF NOT EXISTS payments_campaign_id_idx ON public.payments (campaign_id);

CREATE OR REPLACE FUNCTION public.approve_campaign_payment(p_payment_id uuid, p_admin_email text DEFAULT 'admin')
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  target_payment public.payments%ROWTYPE;
  target_campaign public.campaigns%ROWTYPE;
  slot_index integer;
  slot_count integer;
  gross_amount numeric;
  base_amount numeric;
  remainder numeric;
BEGIN
  SELECT * INTO target_payment FROM public.payments WHERE id = p_payment_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Pembayaran tidak ditemukan'; END IF;
  IF target_payment.status IN ('Berhasil', 'Lunas') AND target_payment.campaign_id IS NOT NULL THEN
    RETURN target_payment.campaign_id;
  END IF;
  IF target_payment.status NOT IN ('Menunggu Verifikasi', 'Pending', 'Gagal') THEN
    RAISE EXCEPTION 'Status pembayaran tidak dapat disetujui: %', target_payment.status;
  END IF;

  SELECT * INTO target_campaign
  FROM public.campaigns
  WHERE id = target_payment.campaign_id
     OR (payment_id = target_payment.id)
     OR (lower(customer_email) = lower(coalesce(target_payment.customer_email, '')) AND title = target_payment.campaign_name)
  ORDER BY (payment_id = target_payment.id) DESC, created_at DESC
  LIMIT 1
  FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Campaign untuk pembayaran tidak ditemukan'; END IF;

  UPDATE public.payments
  SET status = 'Berhasil', paid_at = COALESCE(paid_at, now()), verified_at = now(), verified_by = p_admin_email,
      rejection_reason = NULL, campaign_id = target_campaign.id, updated_at = now()
  WHERE id = target_payment.id;

  UPDATE public.campaigns
  SET payment_id = target_payment.id, payment_status = 'Pembayaran Disetujui',
      payment_rejection_reason = NULL, status = 'Aktif', updated_at = now()
  WHERE id = target_campaign.id;

  SELECT count(*)::integer INTO slot_count FROM public.campaign_jobs WHERE campaign_id = target_campaign.id;
  IF slot_count = 0 THEN
    slot_count := GREATEST(target_campaign.slots, 1);
    gross_amount := GREATEST(target_campaign.budget, 0);
    base_amount := floor(gross_amount / slot_count);
    remainder := gross_amount - base_amount * slot_count;
    FOR slot_index IN 1..slot_count LOOP
      INSERT INTO public.campaign_jobs (
        campaign_id, campaign_title, platform, gross_price, payout, deadline, brief, status
      ) VALUES (
        target_campaign.id, target_campaign.title, target_campaign.platform,
        base_amount + CASE WHEN slot_index <= remainder THEN 1 ELSE 0 END,
        round((base_amount + CASE WHEN slot_index <= remainder THEN 1 ELSE 0 END) * 40 / 100),
        target_campaign.deadline, target_campaign.brief, 'Tersedia'
      );
    END LOOP;
  END IF;

  INSERT INTO public.finance_notifications (category, title, body, link)
  VALUES ('payment', 'Pembayaran disetujui', 'Campaign ' || target_campaign.title || ' sekarang aktif.', '/customer');
  RETURN target_campaign.id;
END;
$$;

CREATE OR REPLACE FUNCTION public.reject_campaign_payment(p_payment_id uuid, p_reason text, p_admin_email text DEFAULT 'admin')
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  target_campaign_id uuid;
  clean_reason text := nullif(trim(p_reason), '');
BEGIN
  IF clean_reason IS NULL THEN RAISE EXCEPTION 'Alasan penolakan wajib diisi'; END IF;
  SELECT campaign_id INTO target_campaign_id FROM public.payments WHERE id = p_payment_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Pembayaran tidak ditemukan'; END IF;
  UPDATE public.payments
  SET status = 'Gagal', rejection_reason = clean_reason, verified_at = now(), verified_by = p_admin_email, updated_at = now()
  WHERE id = p_payment_id;
  UPDATE public.campaigns
  SET payment_status = 'Pembayaran Ditolak', payment_rejection_reason = clean_reason, status = 'Draft', updated_at = now()
  WHERE id = target_campaign_id;
  INSERT INTO public.finance_notifications (category, title, body, link)
  VALUES ('payment', 'Pembayaran ditolak', clean_reason, '/customer');
  RETURN target_campaign_id;
END;
$$;

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
BEGIN
  SELECT * INTO target_job FROM public.campaign_jobs WHERE id = p_job_id FOR UPDATE;
  IF NOT FOUND OR target_job.status <> 'Tersedia' OR target_job.buzzer_email IS NOT NULL THEN
    RAISE EXCEPTION 'Job sudah tidak tersedia';
  END IF;
  SELECT * INTO target_campaign FROM public.campaigns WHERE id = target_job.campaign_id FOR UPDATE;
  IF NOT FOUND OR target_campaign.payment_status <> 'Pembayaran Disetujui' OR target_campaign.status NOT IN ('Aktif', 'Review') THEN
    RAISE EXCEPTION 'Campaign belum aktif atau pembayaran belum disetujui';
  END IF;
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
  SET status = 'Diambil', buzzer_email = lower(trim(p_buzzer_email)), buzzer_name = p_buzzer_name, updated_at = now()
  WHERE id = target_job.id;
  IF assigned_count + 1 >= GREATEST(target_campaign.slots, 1) THEN
    UPDATE public.campaigns SET target_reached_at = now(), updated_at = now() WHERE id = target_campaign.id;
  END IF;
  RETURN target_job.id;
END;
$$;

CREATE OR REPLACE FUNCTION public.sync_campaign_status_from_jobs()
RETURNS TRIGGER AS $$
DECLARE
  assigned_count integer;
  completed_count integer;
  total_count integer;
  target_count integer;
BEGIN
  SELECT count(*) FILTER (WHERE buzzer_email IS NOT NULL),
         count(*) FILTER (WHERE status = 'Selesai'),
         count(*)
  INTO assigned_count, completed_count, total_count
  FROM public.campaign_jobs WHERE campaign_id = NEW.campaign_id;
  SELECT GREATEST(slots, 1) INTO target_count FROM public.campaigns WHERE id = NEW.campaign_id;

  IF assigned_count >= target_count THEN
    UPDATE public.campaigns SET target_reached_at = COALESCE(target_reached_at, now()), updated_at = now()
    WHERE id = NEW.campaign_id AND target_reached_at IS NULL;
  END IF;
  IF completed_count = total_count AND total_count >= target_count THEN
    UPDATE public.campaigns SET status = 'Selesai', updated_at = now()
    WHERE id = NEW.campaign_id AND status <> 'Dibatalkan' AND payment_status = 'Pembayaran Disetujui';
  ELSIF EXISTS (SELECT 1 FROM public.campaign_jobs WHERE campaign_id = NEW.campaign_id AND status = 'Review') THEN
    UPDATE public.campaigns SET status = 'Review', updated_at = now()
    WHERE id = NEW.campaign_id AND status <> 'Dibatalkan' AND payment_status = 'Pembayaran Disetujui';
  ELSIF assigned_count > 0 THEN
    UPDATE public.campaigns SET status = 'Aktif', updated_at = now()
    WHERE id = NEW.campaign_id AND status <> 'Dibatalkan' AND payment_status = 'Pembayaran Disetujui';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE OR REPLACE FUNCTION public.validate_buzzer_rating()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.customer_id := lower(trim(NEW.customer_id));
  NEW.customer_email := NEW.customer_id;
  IF NOT EXISTS (SELECT 1 FROM public.app_accounts WHERE lower(email) = NEW.customer_id AND role = 'customer') THEN
    RAISE EXCEPTION 'Customer tidak valid';
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM public.campaign_jobs job JOIN public.campaigns campaign ON campaign.id = job.campaign_id
    WHERE job.id = NEW.job_id AND job.status = 'Selesai' AND campaign.status = 'Selesai'
      AND lower(campaign.customer_email) = NEW.customer_id
      AND lower(coalesce(job.buzzer_email, '')) = lower(NEW.buzzer_email)
  ) THEN RAISE EXCEPTION 'Campaign belum selesai atau bukan milik customer ini'; END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS sync_campaign_status_after_job_update ON public.campaign_jobs;
CREATE TRIGGER sync_campaign_status_after_job_update
AFTER INSERT OR UPDATE OF status, buzzer_email ON public.campaign_jobs
FOR EACH ROW EXECUTE FUNCTION public.sync_campaign_status_from_jobs();

CREATE OR REPLACE FUNCTION public.credit_buzzer_after_job_approval()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NEW.status = 'Selesai' AND OLD.status IS DISTINCT FROM 'Selesai' AND NEW.buzzer_email IS NOT NULL THEN
    INSERT INTO public.buzzer_wallets (buzzer_email, buzzer_name, balance, pending_balance, updated_at)
    VALUES (lower(trim(NEW.buzzer_email)), COALESCE(NEW.buzzer_name, NEW.buzzer_email), NEW.payout, 0, now())
    ON CONFLICT (buzzer_email) DO UPDATE SET balance = public.buzzer_wallets.balance + EXCLUDED.balance,
      buzzer_name = EXCLUDED.buzzer_name, updated_at = now();
    INSERT INTO public.finance_activity (type, title, description, amount, ref_table, ref_id)
    VALUES ('Payout Buzzer', 'Payout buzzer disetujui', NEW.campaign_title, NEW.payout, 'campaign_jobs', NEW.id::text);
  END IF;
  RETURN NEW;
END;
$$;
DROP TRIGGER IF EXISTS credit_buzzer_after_job_approval ON public.campaign_jobs;
CREATE TRIGGER credit_buzzer_after_job_approval
AFTER UPDATE OF status ON public.campaign_jobs
FOR EACH ROW EXECUTE FUNCTION public.credit_buzzer_after_job_approval();

REVOKE ALL ON FUNCTION public.approve_campaign_payment(uuid, text) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.reject_campaign_payment(uuid, text, text) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.claim_campaign_job(uuid, text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.approve_campaign_payment(uuid, text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.reject_campaign_payment(uuid, text, text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.claim_campaign_job(uuid, text, text) TO anon, authenticated;
