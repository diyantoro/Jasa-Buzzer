CREATE TABLE public.buzzer_ratings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id uuid NOT NULL UNIQUE,
  campaign_id uuid,
  campaign_title text NOT NULL DEFAULT '',
  buzzer_email text NOT NULL,
  buzzer_name text NOT NULL DEFAULT '',
  customer_email text NOT NULL,
  customer_name text NOT NULL DEFAULT '',
  stars integer NOT NULL DEFAULT 5,
  comment text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.buzzer_ratings TO anon, authenticated;
GRANT ALL ON public.buzzer_ratings TO service_role;

ALTER TABLE public.buzzer_ratings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "demo_all" ON public.buzzer_ratings FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

CREATE TRIGGER update_buzzer_ratings_updated_at
BEFORE UPDATE ON public.buzzer_ratings
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_buzzer_ratings_buzzer_email ON public.buzzer_ratings (buzzer_email);
CREATE INDEX idx_buzzer_ratings_campaign_id ON public.buzzer_ratings (campaign_id);

CREATE OR REPLACE FUNCTION public.sync_buzzer_rating()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  target_email text;
  avg_stars numeric;
BEGIN
  target_email := COALESCE(NEW.buzzer_email, OLD.buzzer_email);
  SELECT ROUND(AVG(stars)::numeric, 2) INTO avg_stars FROM public.buzzer_ratings WHERE buzzer_email = target_email;
  UPDATE public.buzzer_wallets SET rating = COALESCE(avg_stars, 5), updated_at = now() WHERE buzzer_email = target_email;
  RETURN NULL;
END;
$$;

CREATE TRIGGER sync_buzzer_rating_after_change
AFTER INSERT OR UPDATE OR DELETE ON public.buzzer_ratings
FOR EACH ROW EXECUTE FUNCTION public.sync_buzzer_rating();