-- Fix the source used by Admin Detail Pembayaran.
-- Admin reads payments.amount through list_admin_payments().
-- Only pending self-orders are reconciled; catalog and completed history remain unchanged.

UPDATE public.payments AS payment
SET amount = COALESCE(NULLIF(payment.total_amount, 0), campaign.total_amount),
    fee = COALESCE(NULLIF(payment.total_amount, 0), campaign.total_amount),
    updated_at = now()
FROM public.campaigns AS campaign
WHERE campaign.payment_id = payment.id
  AND campaign.catalog_id IS NULL
  AND campaign.status = 'Draft'
  AND campaign.payment_status IN ('Menunggu Pembayaran', 'Menunggu Verifikasi')
  AND payment.status IN ('Pending', 'Menunggu Pembayaran', 'Menunggu Verifikasi')
  AND COALESCE(NULLIF(payment.total_amount, 0), campaign.total_amount) > 0
  AND payment.amount <> COALESCE(NULLIF(payment.total_amount, 0), campaign.total_amount);

-- Keep the Admin query on the actual payment transaction. It intentionally
-- does not join or recalculate campaign/catalog prices.
CREATE OR REPLACE FUNCTION public.list_admin_payments()
RETURNS SETOF public.payments
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT payment.*
  FROM public.payments AS payment
  ORDER BY payment.created_at DESC
  LIMIT 500;
$$;

REVOKE ALL ON FUNCTION public.list_admin_payments() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.list_admin_payments() TO anon, authenticated;
