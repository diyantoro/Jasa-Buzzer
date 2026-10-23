ALTER TABLE public.campaign_jobs
  ADD COLUMN IF NOT EXISTS admin_verified_at timestamptz,
  ADD COLUMN IF NOT EXISTS customer_rated_at timestamptz;

CREATE OR REPLACE FUNCTION public.validate_buzzer_rating()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.customer_id := lower(trim(NEW.customer_id));
  NEW.customer_email := NEW.customer_id;
  IF NOT EXISTS (SELECT 1 FROM public.app_accounts account WHERE lower(account.email) = NEW.customer_id AND account.role = 'customer') THEN
    RAISE EXCEPTION 'Customer tidak valid';
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM public.campaign_jobs job
    JOIN public.campaigns campaign ON campaign.id = job.campaign_id
    WHERE job.id = NEW.job_id
      AND (job.status = 'Selesai' OR job.admin_verified_at IS NOT NULL)
      AND lower(campaign.customer_email) = NEW.customer_id
      AND lower(coalesce(job.buzzer_email, '')) = lower(NEW.buzzer_email)
  ) THEN
    RAISE EXCEPTION 'Pekerjaan belum diverifikasi admin atau bukan milik customer ini';
  END IF;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.rate_campaign_for_all_buzzers(
  p_customer_id text,
  p_campaign_id uuid,
  p_stars integer,
  p_comment text DEFAULT NULL
)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  normalized_customer text := lower(trim(p_customer_id));
  campaign_row public.campaigns%ROWTYPE;
  job_row public.campaign_jobs%ROWTYPE;
  inserted_count integer := 0;
  clean_comment text := nullif(trim(p_comment), '');
BEGIN
  IF p_stars < 1 OR p_stars > 5 THEN
    RAISE EXCEPTION 'Rating harus antara 1 sampai 5';
  END IF;

  SELECT * INTO campaign_row FROM public.campaigns WHERE id = p_campaign_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Campaign tidak ditemukan'; END IF;
  IF lower(trim(campaign_row.customer_email)) <> normalized_customer THEN RAISE EXCEPTION 'Campaign bukan milik customer ini'; END IF;
  IF campaign_row.status <> 'Selesai' THEN RAISE EXCEPTION 'Campaign belum selesai'; END IF;
  IF EXISTS (SELECT 1 FROM public.buzzer_ratings WHERE customer_id = normalized_customer AND campaign_id = p_campaign_id) THEN
    RAISE EXCEPTION 'Campaign ini sudah diulas';
  END IF;
  IF EXISTS (
    SELECT 1 FROM public.campaign_jobs
    WHERE campaign_id = p_campaign_id
      AND (buzzer_email IS NULL OR (status <> 'Selesai' AND admin_verified_at IS NULL))
  ) OR NOT EXISTS (SELECT 1 FROM public.campaign_jobs WHERE campaign_id = p_campaign_id) THEN
    RAISE EXCEPTION 'Semua job buzzer harus diverifikasi admin terlebih dahulu';
  END IF;

  FOR job_row IN
    SELECT * FROM public.campaign_jobs
    WHERE campaign_id = p_campaign_id
      AND buzzer_email IS NOT NULL
      AND (status = 'Selesai' OR admin_verified_at IS NOT NULL)
  LOOP
    INSERT INTO public.buzzer_ratings (
      customer_id, job_id, campaign_id, campaign_title, buzzer_email, buzzer_name,
      customer_email, customer_name, stars, comment
    ) VALUES (
      normalized_customer, job_row.id, p_campaign_id, campaign_row.title,
      lower(trim(job_row.buzzer_email)), coalesce(job_row.buzzer_name, job_row.buzzer_email),
      normalized_customer, campaign_row.customer_name, p_stars, clean_comment
    );
    inserted_count := inserted_count + 1;
    UPDATE public.campaign_jobs
    SET status = 'Selesai', customer_rated_at = now()
    WHERE id = job_row.id;
  END LOOP;

  RETURN inserted_count;
END;
$$;

NOTIFY pgrst, 'reload schema';
