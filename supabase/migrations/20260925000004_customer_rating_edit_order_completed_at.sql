-- Batas waktu edit ulasan customer 1x kesempatan dalam 1x24 jam dihitung dari waktu selesainya pesanan

ALTER TABLE public.buzzer_ratings
  ADD COLUMN IF NOT EXISTS customer_edit_count integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS order_completed_at timestamptz;

-- Isi order_completed_at untuk data yang sudah ada
UPDATE public.buzzer_ratings r
SET order_completed_at = COALESCE(
  (SELECT COALESCE(c.target_reached_at::timestamptz, c.updated_at) FROM public.campaigns c WHERE c.id = r.campaign_id),
  (SELECT COALESCE(j.admin_verified_at, j.updated_at) FROM public.campaign_jobs j WHERE j.id = r.job_id),
  r.created_at
)
WHERE r.order_completed_at IS NULL;

-- Perbarui rate_campaign_for_all_buzzers untuk menyimpan order_completed_at dan reset customer_edit_count
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
  completed_timestamp timestamptz;
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

  completed_timestamp := coalesce(campaign_row.target_reached_at::timestamptz, campaign_row.updated_at, now());

  FOR job_row IN
    SELECT * FROM public.campaign_jobs
    WHERE campaign_id = p_campaign_id
      AND buzzer_email IS NOT NULL
      AND (status = 'Selesai' OR admin_verified_at IS NOT NULL)
  LOOP
    INSERT INTO public.buzzer_ratings (
      customer_id, job_id, campaign_id, campaign_title, buzzer_email, buzzer_name,
      customer_email, customer_name, stars, comment, customer_edit_count, order_completed_at
    ) VALUES (
      normalized_customer, job_row.id, p_campaign_id, campaign_row.title,
      lower(trim(job_row.buzzer_email)), coalesce(job_row.buzzer_name, job_row.buzzer_email),
      normalized_customer, campaign_row.customer_name, p_stars, clean_comment,
      0, completed_timestamp
    );
    inserted_count := inserted_count + 1;
    UPDATE public.campaign_jobs
    SET status = 'Selesai', customer_rated_at = now()
    WHERE id = job_row.id;
  END LOOP;

  RETURN inserted_count;
END;
$$;

GRANT EXECUTE ON FUNCTION public.rate_campaign_for_all_buzzers(text, uuid, integer, text)
  TO anon, authenticated;

-- Fungsi update rating oleh customer: 1x kesempatan dalam 1x24 jam sejak selesainya pesanan
CREATE OR REPLACE FUNCTION public.update_customer_buzzer_rating(
  p_rating_id uuid,
  p_customer_email text,
  p_stars integer,
  p_comment text DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  rating_row public.buzzer_ratings%ROWTYPE;
  normalized_email text := lower(trim(p_customer_email));
  completion_time timestamptz;
BEGIN
  IF p_stars < 1 OR p_stars > 5 THEN
    RAISE EXCEPTION 'Rating harus antara 1 sampai 5';
  END IF;

  SELECT * INTO rating_row FROM public.buzzer_ratings WHERE id = p_rating_id FOR UPDATE;
  IF NOT FOUND OR lower(trim(coalesce(rating_row.customer_id, rating_row.customer_email))) <> normalized_email THEN
    RAISE EXCEPTION 'Ulasan bukan milik customer ini';
  END IF;

  IF coalesce(rating_row.customer_edit_count, 0) >= 1 THEN
    RAISE EXCEPTION 'Kesempatan edit ulasan sudah digunakan (maksimal 1x)';
  END IF;

  -- Waktu penyelesaian pesanan: dihitung dari sesudah selesainya pesanan
  completion_time := coalesce(
    rating_row.order_completed_at,
    (SELECT coalesce(c.target_reached_at::timestamptz, c.updated_at) FROM public.campaigns c WHERE c.id = rating_row.campaign_id),
    (SELECT coalesce(j.admin_verified_at, j.updated_at) FROM public.campaign_jobs j WHERE j.id = rating_row.job_id),
    rating_row.created_at
  );

  -- Batas waktu 1x24 jam dari selesainya pesanan
  IF now() > completion_time + interval '24 hours' THEN
    RAISE EXCEPTION 'Batas waktu edit ulasan sudah berakhir (melebihi 1x24 jam sejak pesanan selesai)';
  END IF;

  -- Update rating dan tandai kesempatan edit (1x) telah digunakan
  IF rating_row.campaign_id IS NOT NULL THEN
    UPDATE public.buzzer_ratings
    SET stars = p_stars,
        comment = NULLIF(trim(p_comment), ''),
        customer_edit_count = coalesce(customer_edit_count, 0) + 1,
        order_completed_at = coalesce(order_completed_at, completion_time),
        updated_at = now()
    WHERE customer_id = normalized_email AND campaign_id = rating_row.campaign_id;
  ELSE
    UPDATE public.buzzer_ratings
    SET stars = p_stars,
        comment = NULLIF(trim(p_comment), ''),
        customer_edit_count = coalesce(customer_edit_count, 0) + 1,
        order_completed_at = coalesce(order_completed_at, completion_time),
        updated_at = now()
    WHERE id = p_rating_id;
  END IF;
END;
$$;

GRANT EXECUTE ON FUNCTION public.update_customer_buzzer_rating(uuid, text, integer, text)
  TO anon, authenticated;

NOTIFY pgrst, 'reload schema';
