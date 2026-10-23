-- One customer review action creates one rating row for every completed buzzer job.
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

  SELECT * INTO campaign_row
  FROM public.campaigns
  WHERE id = p_campaign_id
  FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Campaign tidak ditemukan'; END IF;
  IF lower(trim(campaign_row.customer_email)) <> normalized_customer THEN
    RAISE EXCEPTION 'Campaign bukan milik customer ini';
  END IF;
  IF campaign_row.status <> 'Selesai' THEN
    RAISE EXCEPTION 'Campaign belum selesai';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.app_accounts WHERE lower(trim(email)) = normalized_customer AND role = 'customer') THEN
    RAISE EXCEPTION 'Customer tidak valid';
  END IF;
  IF EXISTS (SELECT 1 FROM public.buzzer_ratings WHERE customer_id = normalized_customer AND campaign_id = p_campaign_id) THEN
    RAISE EXCEPTION 'Campaign ini sudah diulas';
  END IF;
  IF EXISTS (
    SELECT 1 FROM public.campaign_jobs
    WHERE campaign_id = p_campaign_id
      AND (buzzer_email IS NULL OR status <> 'Selesai')
  ) OR NOT EXISTS (SELECT 1 FROM public.campaign_jobs WHERE campaign_id = p_campaign_id) THEN
    RAISE EXCEPTION 'Semua job buzzer harus selesai dan diverifikasi terlebih dahulu';
  END IF;

  FOR job_row IN
    SELECT * FROM public.campaign_jobs
    WHERE campaign_id = p_campaign_id AND buzzer_email IS NOT NULL AND status = 'Selesai'
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
  END LOOP;
  RETURN inserted_count;
END;
$$;

REVOKE ALL ON FUNCTION public.rate_campaign_for_all_buzzers(text, uuid, integer, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.rate_campaign_for_all_buzzers(text, uuid, integer, text) TO anon, authenticated;
