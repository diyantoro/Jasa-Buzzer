-- Repair legacy job snapshots where the admin share was reset to zero because the
-- UI or a previous migration treated the level payout as the final job total.
-- The admin commission must always be the remaining amount after the buzzer amount,
-- unless the configured level payout itself consumes the whole gross value.
UPDATE public.campaign_jobs AS job
SET
  buzzer_amount = GREATEST(COALESCE(job.buzzer_amount, job.payout, 0), 0),
  payout = GREATEST(COALESCE(job.buzzer_amount, job.payout, 0), 0),
  admin_amount = CASE
    WHEN GREATEST(COALESCE(job.gross_price, 0), 0) > 0 THEN
      GREATEST(GREATEST(COALESCE(job.gross_price, 0), 0) - GREATEST(COALESCE(job.buzzer_amount, job.payout, 0), 0), 0)
    ELSE 0
  END,
  admin_percentage = CASE
    WHEN GREATEST(COALESCE(job.gross_price, 0), 0) > 0 THEN
      ROUND(
        100 - (GREATEST(COALESCE(job.buzzer_amount, job.payout, 0), 0) * 100 / GREATEST(COALESCE(job.gross_price, 0), 0)),
        2
      )
    ELSE 100
  END,
  updated_at = now()
WHERE job.gross_price > 0
  AND (
    admin_amount IS NULL
    OR admin_amount <> GREATEST(job.gross_price - GREATEST(COALESCE(job.buzzer_amount, job.payout, 0), 0), 0)
    OR (
      COALESCE(job.buzzer_amount, job.payout, 0) > 0
      AND job.gross_price > COALESCE(job.buzzer_amount, job.payout, 0)
      AND COALESCE(job.admin_amount, 0) = 0
    )
  );

-- Keep the job-level split consistent even for rows that were only partially updated.
UPDATE public.campaign_jobs AS job
SET
  buzzer_percentage = CASE
    WHEN GREATEST(COALESCE(job.gross_price, 0), 0) > 0 THEN
      ROUND(GREATEST(COALESCE(job.buzzer_amount, job.payout, 0), 0) * 100 / GREATEST(COALESCE(job.gross_price, 0), 0), 2)
    ELSE 0
  END,
  admin_percentage = CASE
    WHEN GREATEST(COALESCE(job.gross_price, 0), 0) > 0 THEN
      ROUND(100 - (GREATEST(COALESCE(job.buzzer_amount, job.payout, 0), 0) * 100 / GREATEST(COALESCE(job.gross_price, 0), 0)), 2)
    ELSE 100
  END,
  updated_at = now()
WHERE job.gross_price > 0
  AND (
    buzzer_percentage IS NULL
    OR admin_percentage IS NULL
    OR buzzer_percentage <> ROUND(GREATEST(COALESCE(job.buzzer_amount, job.payout, 0), 0) * 100 / job.gross_price, 2)
    OR admin_percentage <> ROUND(100 - (GREATEST(COALESCE(job.buzzer_amount, job.payout, 0), 0) * 100 / job.gross_price), 2)
  );
