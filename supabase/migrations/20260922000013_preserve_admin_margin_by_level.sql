-- Preserve an admin margin when a level payout is higher than a small custom order.
-- The buzzer level still determines the nominal payout, but the buzzer cannot
-- receive more than 40% of a job's gross price. The remainder belongs to admin.

UPDATE public.campaign_jobs AS job
SET buzzer_amount = LEAST(
      GREATEST(COALESCE(job.gross_price, 0), 0),
      GREATEST(COALESCE(level.payout_per_job, 0), 0),
      ROUND(GREATEST(COALESCE(job.gross_price, 0), 0) * 40 / 100)
    ),
    payout = LEAST(
      GREATEST(COALESCE(job.gross_price, 0), 0),
      GREATEST(COALESCE(level.payout_per_job, 0), 0),
      ROUND(GREATEST(COALESCE(job.gross_price, 0), 0) * 40 / 100)
    ),
    buzzer_percentage = CASE
      WHEN job.gross_price > 0 THEN ROUND(LEAST(
        GREATEST(COALESCE(job.gross_price, 0), 0),
        GREATEST(COALESCE(level.payout_per_job, 0), 0),
        ROUND(GREATEST(COALESCE(job.gross_price, 0), 0) * 40 / 100)
      ) * 100 / job.gross_price, 2)
      ELSE 0
    END,
    admin_amount = GREATEST(
      GREATEST(COALESCE(job.gross_price, 0), 0) - LEAST(
        GREATEST(COALESCE(job.gross_price, 0), 0),
        GREATEST(COALESCE(level.payout_per_job, 0), 0),
        ROUND(GREATEST(COALESCE(job.gross_price, 0), 0) * 40 / 100)
      ), 0
    ),
    admin_percentage = CASE
      WHEN job.gross_price > 0 THEN ROUND(100 - LEAST(
        GREATEST(COALESCE(job.gross_price, 0), 0),
        GREATEST(COALESCE(level.payout_per_job, 0), 0),
        ROUND(GREATEST(COALESCE(job.gross_price, 0), 0) * 40 / 100)
      ) * 100 / job.gross_price, 2)
      ELSE 100
    END,
    updated_at = now()
FROM public.buzzer_levels AS level,
     public.campaigns AS campaign
WHERE job.buzzer_level = level.name
  AND campaign.id = job.campaign_id
  AND campaign.catalog_id IS NULL
  AND job.gross_price > 0
  AND job.status IN ('Diambil', 'Review', 'Revisi');

-- Apply the same level-aware split whenever a job is claimed or its gross
-- snapshot changes. Existing claim/approval flow remains untouched.
CREATE OR REPLACE FUNCTION public.preserve_admin_margin_by_level()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
  configured_payout numeric;
  capped_buzzer_amount numeric;
  is_catalog boolean;
BEGIN
  IF NEW.gross_price IS NULL OR NEW.gross_price <= 0 OR NEW.buzzer_level IS NULL THEN
    RETURN NEW;
  END IF;

  SELECT campaign.catalog_id IS NOT NULL INTO is_catalog
  FROM public.campaigns AS campaign
  WHERE campaign.id = NEW.campaign_id;
  IF COALESCE(is_catalog, false) THEN
    RETURN NEW;
  END IF;

  SELECT COALESCE(payout_per_job, 0) INTO configured_payout
  FROM public.buzzer_levels
  WHERE name = NEW.buzzer_level;

  capped_buzzer_amount := LEAST(
    GREATEST(NEW.gross_price, 0),
    GREATEST(configured_payout, 0),
    ROUND(GREATEST(NEW.gross_price, 0) * 40 / 100)
  );

  NEW.buzzer_amount := capped_buzzer_amount;
  NEW.payout := capped_buzzer_amount;
  NEW.buzzer_percentage := CASE WHEN NEW.gross_price > 0 THEN ROUND(capped_buzzer_amount * 100 / NEW.gross_price, 2) ELSE 0 END;
  NEW.admin_amount := GREATEST(NEW.gross_price - capped_buzzer_amount, 0);
  NEW.admin_percentage := CASE WHEN NEW.gross_price > 0 THEN ROUND(100 - capped_buzzer_amount * 100 / NEW.gross_price, 2) ELSE 100 END;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS preserve_admin_margin_by_level ON public.campaign_jobs;
CREATE TRIGGER preserve_admin_margin_by_level
  BEFORE INSERT OR UPDATE OF gross_price, buzzer_level, payout, buzzer_amount
  ON public.campaign_jobs
  FOR EACH ROW EXECUTE FUNCTION public.preserve_admin_margin_by_level();
