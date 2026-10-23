CREATE OR REPLACE FUNCTION public.update_buzzer_rating(
  p_rating_id uuid,
  p_buzzer_email text,
  p_stars integer,
  p_comment text DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF p_stars < 1 OR p_stars > 5 THEN
    RAISE EXCEPTION 'Rating harus antara 1 dan 5';
  END IF;

  UPDATE public.buzzer_ratings
  SET stars = p_stars,
      comment = NULLIF(trim(p_comment), '')
  WHERE id = p_rating_id
    AND lower(trim(buzzer_email)) = lower(trim(p_buzzer_email));

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Ulasan tidak ditemukan atau bukan milik buzzer ini';
  END IF;
END;
$$;

GRANT EXECUTE ON FUNCTION public.update_buzzer_rating(uuid, text, integer, text)
  TO anon, authenticated;