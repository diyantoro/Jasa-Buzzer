-- Admin verification reads payments.amount through list_admin_payments().
-- Reconcile only pending self-orders so Admin shows the same transaction total
-- calculated for the customer. Catalog campaigns are excluded.
UPDATE public.campaigns AS campaign
SET price_per_buzzer = pricing.price_per_buzzer,
    buzzer_count = campaign.slots,
    total_amount = pricing.price_per_buzzer * campaign.slots,
    budget = pricing.price_per_buzzer * campaign.slots,
    updated_at = now()
FROM public.service_pricing AS pricing
WHERE campaign.catalog_id IS NULL
  AND campaign.status = 'Draft'
  AND campaign.payment_status IN ('Menunggu Pembayaran', 'Menunggu Verifikasi')
  AND campaign.slots > 0
  AND pricing.status = 'Aktif'
  AND lower(trim(pricing.platform)) = lower(trim(campaign.platform))
  AND lower(trim(pricing.service_type)) = lower(trim(campaign.service_type));

UPDATE public.payments AS payment
SET price_per_buzzer = campaign.price_per_buzzer,
    buzzer_count = campaign.buzzer_count,
    total_amount = campaign.total_amount,
    amount = campaign.total_amount,
    fee = campaign.total_amount,
    buzzer_cost = 0,
    updated_at = now()
FROM public.campaigns AS campaign
WHERE campaign.payment_id = payment.id
  AND campaign.catalog_id IS NULL
  AND campaign.status = 'Draft'
  AND campaign.payment_status IN ('Menunggu Pembayaran', 'Menunggu Verifikasi')
  AND payment.status IN ('Pending', 'Menunggu Pembayaran', 'Menunggu Verifikasi')
  AND campaign.total_amount > 0;

-- Keep the existing controlled Admin payment RPC. The nominal shown by the
-- Admin page is always payments.amount, which is now the transaction snapshot.
CREATE OR REPLACE FUNCTION public.list_admin_payments()
RETURNS SETOF public.payments
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT payments.*
  FROM public.payments
  ORDER BY created_at DESC
  LIMIT 500;
$$;

REVOKE ALL ON FUNCTION public.list_admin_payments() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.list_admin_payments() TO anon, authenticated;
