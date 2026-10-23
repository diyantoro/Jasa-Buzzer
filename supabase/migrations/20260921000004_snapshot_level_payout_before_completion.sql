-- Ensure approval credits the same level-based nominal shown in verification.
-- The existing level assignment and payout configuration are unchanged.
CREATE OR REPLACE FUNCTION public.snapshot_level_payout_before_completion()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  active_level text;
  configured_payout numeric;
  gross_amount numeric;
BEGIN
  IF NEW.status = 'Selesai'
     AND OLD.status IS DISTINCT FROM 'Selesai'
     AND NEW.buzzer_email IS NOT NULL THEN
    SELECT wallet.level INTO active_level
    FROM public.buzzer_wallets AS wallet
    WHERE lower(trim(wallet.buzzer_email)) = lower(trim(NEW.buzzer_email));

    SELECT GREATEST(COALESCE(level.payout_per_job, 0), 0) INTO configured_payout
    FROM public.buzzer_levels AS level
    WHERE level.name = active_level;

    gross_amount := GREATEST(COALESCE(NEW.gross_price, 0), 0);
    IF active_level IS NOT NULL AND configured_payout > 0 AND gross_amount > 0 THEN
      NEW.buzzer_level := active_level;
      NEW.buzzer_amount := LEAST(gross_amount, configured_payout);
      NEW.payout := NEW.buzzer_amount;
      NEW.admin_amount := gross_amount - NEW.buzzer_amount;
      NEW.buzzer_percentage := ROUND(NEW.buzzer_amount * 100 / gross_amount, 2);
      NEW.admin_percentage := 100 - NEW.buzzer_percentage;
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS snapshot_level_payout_before_completion ON public.campaign_jobs;
CREATE TRIGGER snapshot_level_payout_before_completion
BEFORE UPDATE OF status ON public.campaign_jobs
FOR EACH ROW
EXECUTE FUNCTION public.snapshot_level_payout_before_completion();
