ALTER TABLE public.buzzer_ratings
  ADD COLUMN IF NOT EXISTS customer_edit_count integer NOT NULL DEFAULT 0;

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
BEGIN
  IF p_stars < 1 OR p_stars > 5 THEN
    RAISE EXCEPTION 'Rating harus antara 1 sampai 5';
  END IF;

  SELECT * INTO rating_row FROM public.buzzer_ratings WHERE id = p_rating_id FOR UPDATE;
  IF NOT FOUND OR lower(trim(rating_row.customer_id)) <> normalized_email THEN
    RAISE EXCEPTION 'Ulasan bukan milik customer ini';
  END IF;
  IF rating_row.customer_edit_count >= 1 THEN
    RAISE EXCEPTION 'Kesempatan edit ulasan sudah digunakan';
  END IF;
  IF now() > rating_row.created_at + interval '24 hours' THEN
    RAISE EXCEPTION 'Batas waktu edit ulasan sudah lewat 24 jam';
  END IF;

  UPDATE public.buzzer_ratings
  SET stars = p_stars,
      comment = NULLIF(trim(p_comment), ''),
      customer_edit_count = customer_edit_count + 1
  WHERE id = p_rating_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.update_customer_buzzer_rating(uuid, text, integer, text)
  TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.delete_admin_buzzer_rating(
  p_rating_id uuid,
  p_admin_email text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.app_accounts WHERE lower(email) = lower(trim(p_admin_email)) AND role = 'admin') THEN
    RAISE EXCEPTION 'Akses admin diperlukan';
  END IF;
  DELETE FROM public.buzzer_ratings WHERE id = p_rating_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.delete_admin_buzzer_rating(uuid, text)
  TO anon, authenticated;

NOTIFY pgrst, 'reload schema';
