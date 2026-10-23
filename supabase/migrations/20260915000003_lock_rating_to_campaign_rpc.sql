-- Ratings may only be created by the campaign-level SECURITY DEFINER RPC.
DROP POLICY IF EXISTS "customers can create ratings" ON public.buzzer_ratings;
CREATE POLICY "ratings only through campaign rpc"
  ON public.buzzer_ratings
  FOR INSERT TO anon, authenticated
  WITH CHECK (false);

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
    SELECT 1 FROM public.campaign_jobs job
    JOIN public.campaigns campaign ON campaign.id = job.campaign_id
    WHERE job.id = NEW.job_id
      AND job.status = 'Selesai'
      AND campaign.status = 'Selesai'
      AND lower(trim(campaign.customer_email)) = NEW.customer_id
      AND lower(trim(coalesce(job.buzzer_email, ''))) = lower(trim(NEW.buzzer_email))
  ) THEN
    RAISE EXCEPTION 'Campaign belum selesai atau buzzer tidak sesuai';
  END IF;
  RETURN NEW;
END;
$$;
