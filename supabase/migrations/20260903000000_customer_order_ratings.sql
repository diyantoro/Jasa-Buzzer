ALTER TABLE public.buzzer_ratings
  ADD COLUMN IF NOT EXISTS customer_id text;

UPDATE public.buzzer_ratings
SET customer_id = lower(trim(customer_email))
WHERE customer_id IS NULL;

ALTER TABLE public.buzzer_ratings
  ALTER COLUMN customer_id SET NOT NULL;

ALTER TABLE public.campaign_jobs
  ADD COLUMN IF NOT EXISTS customer_rated_at timestamptz;

ALTER TABLE public.buzzer_ratings
  DROP CONSTRAINT IF EXISTS buzzer_ratings_job_id_key;

ALTER TABLE public.buzzer_ratings
  DROP CONSTRAINT IF EXISTS buzzer_ratings_customer_job_key;

ALTER TABLE public.buzzer_ratings
  ADD CONSTRAINT buzzer_ratings_customer_job_key UNIQUE (customer_id, job_id);

CREATE OR REPLACE FUNCTION public.validate_buzzer_rating()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.customer_id := lower(trim(NEW.customer_id));
  NEW.customer_email := NEW.customer_id;

  IF NOT EXISTS (
    SELECT 1
    FROM public.app_accounts account
    WHERE lower(account.email) = NEW.customer_id
      AND account.role = 'customer'
  ) THEN
    RAISE EXCEPTION 'Customer tidak valid';
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM public.campaign_jobs job
    JOIN public.campaigns campaign ON campaign.id = job.campaign_id
    WHERE job.id = NEW.job_id
      AND job.status = 'Selesai'
      AND lower(campaign.customer_email) = NEW.customer_id
      AND lower(coalesce(job.buzzer_email, '')) = lower(NEW.buzzer_email)
  ) THEN
    RAISE EXCEPTION 'Pesanan belum selesai atau bukan milik customer ini';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS validate_buzzer_rating_before_insert ON public.buzzer_ratings;
CREATE TRIGGER validate_buzzer_rating_before_insert
BEFORE INSERT ON public.buzzer_ratings
FOR EACH ROW EXECUTE FUNCTION public.validate_buzzer_rating();

CREATE OR REPLACE FUNCTION public.mark_campaign_job_rated()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.campaign_jobs
  SET customer_rated_at = COALESCE(customer_rated_at, now()),
      note = 'Sudah direview customer'
  WHERE id = NEW.job_id;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS mark_campaign_job_rated_after_insert ON public.buzzer_ratings;
CREATE TRIGGER mark_campaign_job_rated_after_insert
AFTER INSERT ON public.buzzer_ratings
FOR EACH ROW EXECUTE FUNCTION public.mark_campaign_job_rated();

DROP POLICY IF EXISTS "customers can create ratings" ON public.buzzer_ratings;
CREATE POLICY "customers can create ratings"
  ON public.buzzer_ratings
  FOR INSERT TO anon, authenticated
  WITH CHECK (
    customer_id = lower(trim(customer_email))
    AND EXISTS (
      SELECT 1
      FROM public.campaign_jobs job
      JOIN public.campaigns campaign ON campaign.id = job.campaign_id
      WHERE job.id = buzzer_ratings.job_id
        AND job.status = 'Selesai'
        AND lower(campaign.customer_email) = lower(trim(buzzer_ratings.customer_id))
        AND lower(coalesce(job.buzzer_email, '')) = lower(buzzer_ratings.buzzer_email)
    )
  );