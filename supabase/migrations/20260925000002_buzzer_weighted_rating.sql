-- Weighted average buzzer rating calculation with initial damping/prior:
-- Initial default: current_rating = 5.0, total_reviews = 9
-- Formula on new rating: rating_baru = ROUND(((5.0 * 9 + sum_stars) / (9 + review_count)), 1)

ALTER TABLE public.buzzer_wallets
  ADD COLUMN IF NOT EXISTS total_reviews integer NOT NULL DEFAULT 9;

ALTER TABLE public.app_accounts
  ADD COLUMN IF NOT EXISTS total_reviews integer DEFAULT 9;

ALTER TABLE public.app_accounts
  ADD COLUMN IF NOT EXISTS rating numeric DEFAULT 5.0;

-- Backfill default values for existing rows
UPDATE public.buzzer_wallets
SET rating = 5.0
WHERE rating IS NULL OR rating = 0;

UPDATE public.buzzer_wallets
SET total_reviews = 9
WHERE total_reviews IS NULL OR total_reviews = 0;

UPDATE public.app_accounts
SET rating = 5.0
WHERE role = 'buzzer' AND (rating IS NULL OR rating = 0);

UPDATE public.app_accounts
SET total_reviews = 9
WHERE role = 'buzzer' AND (total_reviews IS NULL OR total_reviews = 0);

CREATE OR REPLACE FUNCTION public.sync_buzzer_rating()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  target_email text;
  review_count integer;
  star_sum numeric;
  calculated_rating numeric;
  new_total_reviews integer;
BEGIN
  target_email := lower(trim(COALESCE(NEW.buzzer_email, OLD.buzzer_email)));
  IF target_email IS NULL OR target_email = '' THEN
    RETURN NULL;
  END IF;

  SELECT COUNT(*), COALESCE(SUM(stars), 0)
  INTO review_count, star_sum
  FROM public.buzzer_ratings
  WHERE lower(trim(buzzer_email)) = target_email;

  -- Default prior: rating 5.0 with 9 reviews damper
  new_total_reviews := 9 + review_count;
  calculated_rating := ROUND(((5.0 * 9 + star_sum)::numeric / new_total_reviews::numeric), 1);

  UPDATE public.buzzer_wallets
  SET rating = calculated_rating,
      total_reviews = new_total_reviews,
      updated_at = now()
  WHERE lower(trim(buzzer_email)) = target_email;

  UPDATE public.app_accounts
  SET rating = calculated_rating,
      total_reviews = new_total_reviews,
      updated_at = now()
  WHERE lower(trim(email)) = target_email AND role = 'buzzer';

  RETURN NULL;
END;
$$;

DROP TRIGGER IF EXISTS sync_buzzer_rating_after_change ON public.buzzer_ratings;
CREATE TRIGGER sync_buzzer_rating_after_change
AFTER INSERT OR UPDATE OR DELETE ON public.buzzer_ratings
FOR EACH ROW EXECUTE FUNCTION public.sync_buzzer_rating();

NOTIFY pgrst, 'reload schema';
