ALTER TABLE public.campaign_jobs
  ADD COLUMN IF NOT EXISTS gross_price numeric NOT NULL DEFAULT 0;

-- Rebuild the gross price for existing jobs from the campaign budget. The first
-- slots receive the remainder so every campaign keeps its exact total budget.
WITH ranked_jobs AS (
  SELECT
    job.id,
    campaign.budget,
    GREATEST(campaign.slots, 1) AS slot_count,
    ROW_NUMBER() OVER (PARTITION BY job.campaign_id ORDER BY job.created_at, job.id) AS slot_number
  FROM public.campaign_jobs job
  JOIN public.campaigns campaign ON campaign.id = job.campaign_id
), allocated AS (
  SELECT
    id,
    FLOOR(budget / slot_count) + CASE
      WHEN slot_number <= (budget - FLOOR(budget / slot_count) * slot_count) THEN 1
      ELSE 0
    END AS gross_price
  FROM ranked_jobs
)
UPDATE public.campaign_jobs job
SET
  gross_price = allocated.gross_price,
  payout = ROUND(allocated.gross_price * 40 / 100),
  updated_at = now()
FROM allocated
WHERE job.id = allocated.id;

UPDATE public.campaign_jobs
SET gross_price = ROUND(payout * 100 / 40),
    updated_at = now()
WHERE gross_price = 0 AND payout > 0;

UPDATE public.campaigns
SET payout_per_buzzer = ROUND((budget / GREATEST(slots, 1)) * 40 / 100),
    updated_at = now();