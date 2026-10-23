CREATE OR REPLACE FUNCTION public.update_admin_buzzer_rating(
  p_rating_id uuid,
  p_admin_email text,
  p_stars integer,
  p_comment text DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM public.app_accounts
    WHERE lower(email) = lower(trim(p_admin_email))
      AND role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Akses admin diperlukan';
  END IF;

  IF p_stars < 1 OR p_stars > 5 THEN
    RAISE EXCEPTION 'Rating harus antara 1 dan 5';
  END IF;

  UPDATE public.buzzer_ratings
  SET stars = p_stars,
      comment = NULLIF(trim(p_comment), '')
  WHERE id = p_rating_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Ulasan tidak ditemukan';
  END IF;
END;
$$;

GRANT EXECUTE ON FUNCTION public.update_admin_buzzer_rating(uuid, text, integer, text)
  TO anon, authenticated;