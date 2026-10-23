-- Migration: 20260928000001_fix_admin_profit_and_job_snapshots.sql
-- Fix admin profit calculation by ensuring buzzer payout never exceeds 40% of job gross price,
-- preventing triggers from wiping out admin commission to 0 on completion.

-- 1. Perbaiki snapshot_level_payout_before_completion agar tidak menghapus komisi admin
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
  capped_buzzer_amount numeric;
BEGIN
  IF NEW.status = 'Selesai'
     AND OLD.status IS DISTINCT FROM 'Selesai'
     AND NEW.buzzer_email IS NOT NULL THEN
    
    gross_amount := GREATEST(COALESCE(NEW.gross_price, 0), 0);
    
    IF gross_amount > 0 THEN
      -- Jika sudah memiliki admin_amount yang valid (> 0) dan buzzer_amount <= 40%, pertahankan
      IF COALESCE(NEW.admin_amount, 0) > 0 AND COALESCE(NEW.buzzer_amount, 0) > 0 AND NEW.buzzer_amount <= ROUND(gross_amount * 40 / 100) THEN
        RETURN NEW;
      END IF;

      SELECT wallet.level INTO active_level
      FROM public.buzzer_wallets AS wallet
      WHERE lower(trim(wallet.buzzer_email)) = lower(trim(NEW.buzzer_email));

      SELECT GREATEST(COALESCE(level.payout_per_job, 0), 0) INTO configured_payout
      FROM public.buzzer_levels AS level
      WHERE level.name = COALESCE(active_level, NEW.buzzer_level);

      capped_buzzer_amount := LEAST(
        gross_amount,
        COALESCE(NULLIF(configured_payout, 0), ROUND(gross_amount * 40 / 100)),
        ROUND(gross_amount * 40 / 100)
      );

      NEW.buzzer_level := COALESCE(active_level, NEW.buzzer_level);
      NEW.buzzer_amount := capped_buzzer_amount;
      NEW.payout := capped_buzzer_amount;
      NEW.admin_amount := GREATEST(gross_amount - capped_buzzer_amount, 0);
      NEW.buzzer_percentage := CASE WHEN gross_amount > 0 THEN ROUND(capped_buzzer_amount * 100 / gross_amount, 2) ELSE 0 END;
      NEW.admin_percentage := CASE WHEN gross_amount > 0 THEN ROUND(100 - capped_buzzer_amount * 100 / gross_amount, 2) ELSE 100 END;
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

-- 2. Perbaiki preserve_admin_margin_by_level
CREATE OR REPLACE FUNCTION public.preserve_admin_margin_by_level()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
  configured_payout numeric;
  capped_buzzer_amount numeric;
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

  SELECT COALESCE(payout_per_job, 0) INTO configured_payout
  FROM public.buzzer_levels
  WHERE name = NEW.buzzer_level;

  capped_buzzer_amount := LEAST(
    GREATEST(NEW.gross_price, 0),
    COALESCE(NULLIF(configured_payout, 0), ROUND(GREATEST(NEW.gross_price, 0) * 40 / 100)),
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

-- 3. Perbaiki data campaign_jobs yang rusak (di mana admin_amount = 0 atau buzzer_amount >= gross_price)
UPDATE public.campaign_jobs
SET
  buzzer_amount = LEAST(gross_price, ROUND(gross_price * 40 / 100)),
  payout = LEAST(gross_price, ROUND(gross_price * 40 / 100)),
  admin_amount = GREATEST(gross_price - LEAST(gross_price, ROUND(gross_price * 40 / 100)), 0),
  buzzer_percentage = ROUND(LEAST(gross_price, ROUND(gross_price * 40 / 100)) * 100 / gross_price, 2),
  admin_percentage = 100 - ROUND(LEAST(gross_price, ROUND(gross_price * 40 / 100)) * 100 / gross_price, 2),
  updated_at = now()
WHERE gross_price > 0
  AND (COALESCE(admin_amount, 0) = 0 OR buzzer_amount >= gross_price);

-- 4. Perbaiki data finance_activity untuk Komisi Admin yang bernilai 0
UPDATE public.finance_activity AS fa
SET amount = job.admin_amount
FROM public.campaign_jobs AS job
WHERE fa.ref_table = 'campaign_jobs'
  AND fa.ref_id = job.id::text
  AND fa.title ILIKE '%Komisi Admin%'
  AND (fa.amount IS NULL OR fa.amount = 0)
  AND job.admin_amount > 0;

-- 5. Tambahkan record finance_activity untuk job yang telah selesai / terverifikasi tapi belum ada Komisi Admin
INSERT INTO public.finance_activity (type, title, description, amount, ref_table, ref_id)
SELECT
  'admin',
  'Komisi Admin',
  job.campaign_title || ' - komisi admin dari pengerjaan yang diverifikasi',
  job.admin_amount,
  'campaign_jobs',
  job.id::text
FROM public.campaign_jobs job
WHERE (job.status = 'Selesai' OR job.admin_verified_at IS NOT NULL)
  AND job.admin_amount > 0
  AND NOT EXISTS (
    SELECT 1 FROM public.finance_activity fa
    WHERE fa.ref_table = 'campaign_jobs'
      AND fa.ref_id = job.id::text
      AND fa.type = 'admin'
  );
