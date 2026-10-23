-- Payments are created only after the customer confirms payment in the app.
-- Older rows remained Pending because the simulated confirmation ran later.
UPDATE public.payments
SET
  status = 'Berhasil',
  paid_at = COALESCE(paid_at, created_at),
  updated_at = now()
WHERE status = 'Pending'
  AND amount > 0;