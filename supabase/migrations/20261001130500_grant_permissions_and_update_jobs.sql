-- Migration: 20261001130500_grant_permissions_and_update_jobs.sql
-- Grant full execution permissions on buzzer_share_percentage_for_level to all roles
-- and make preserve_admin_margin_by_level SECURITY DEFINER.

GRANT EXECUTE ON FUNCTION public.buzzer_share_percentage_for_level(text) TO PUBLIC, anon, authenticated, service_role;

CREATE OR REPLACE FUNCTION public.preserve_admin_margin_by_level()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  buzzer_pct numeric;
  buzzer_share numeric;
  is_catalog boolean;
BEGIN
  IF NEW.gross_price IS NULL OR NEW.gross_price <= 0 THEN
    RETURN NEW;
  END IF;

  SELECT campaign.catalog_id IS NOT NULL INTO is_catalog
  FROM public.campaigns AS campaign
  WHERE campaign.id = NEW.campaign_id;
  IF COALESCE(is_catalog, false) THEN
    RETURN NEW;
  END IF;

  buzzer_pct := public.buzzer_share_percentage_for_level(COALESCE(NEW.buzzer_level, 'Bronze'));
  buzzer_share := ROUND(GREATEST(NEW.gross_price, 0) * buzzer_pct / 100);

  NEW.buzzer_amount := buzzer_share;
  NEW.payout := buzzer_share;
  NEW.buzzer_percentage := buzzer_pct;
  NEW.admin_amount := GREATEST(NEW.gross_price - buzzer_share, 0);
  NEW.admin_percentage := 100 - buzzer_pct;
  RETURN NEW;
END;
$$;

-- Recalculate all campaign_jobs according to their buzzer level
DO $$
DECLARE
  r RECORD;
  v_pct numeric;
  v_buzzer_amt numeric;
  v_admin_amt numeric;
  v_level text;
BEGIN
  FOR r IN
    SELECT j.id, j.gross_price, j.buzzer_level, j.buzzer_email, w.level AS wallet_level
    FROM public.campaign_jobs j
    LEFT JOIN public.buzzer_wallets w ON lower(trim(w.buzzer_email)) = lower(trim(j.buzzer_email))
    WHERE j.buzzer_email IS NOT NULL AND j.gross_price > 0
  LOOP
    v_level := COALESCE(r.buzzer_level, r.wallet_level, 'Bronze');
    v_pct := public.buzzer_share_percentage_for_level(v_level);
    v_buzzer_amt := ROUND(r.gross_price * v_pct / 100);
    v_admin_amt := r.gross_price - v_buzzer_amt;

    UPDATE public.campaign_jobs
    SET buzzer_level = v_level,
        buzzer_percentage = v_pct,
        buzzer_amount = v_buzzer_amt,
        payout = v_buzzer_amt,
        admin_percentage = 100 - v_pct,
        admin_amount = v_admin_amt
    WHERE id = r.id;
  END LOOP;
END;
$$;
