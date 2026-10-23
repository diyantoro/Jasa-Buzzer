-- Reconcile pending Pesanan Sendiri payments from the actual campaign order.
-- This migration intentionally excludes Admin Catalog campaigns.
-- Paid/completed history is never changed.

-- Ensure every pending self-order has the current transaction snapshot.
UPDATE public.campaigns AS campaign
SET price_per_buzzer = COALESCE(
      NULLIF(campaign.price_per_buzzer, 0),
      pricing.price_per_buzzer
    ),
    buzzer_count = GREATEST(COALESCE(campaign.buzzer_count, campaign.slots), 1),
    total_amount = COALESCE(
      NULLIF(campaign.total_amount, 0),
      COALESCE(NULLIF(campaign.price_per_buzzer, 0), pricing.price_per_buzzer)
        * GREATEST(COALESCE(campaign.buzzer_count, campaign.slots), 1)
    ),
    budget = COALESCE(
      NULLIF(campaign.total_amount, 0),
      COALESCE(NULLIF(campaign.price_per_buzzer, 0), pricing.price_per_buzzer)
        * GREATEST(COALESCE(campaign.buzzer_count, campaign.slots), 1)
    ),
    updated_at = now()
FROM public.service_pricing AS pricing
WHERE campaign.catalog_id IS NULL
  AND campaign.status = 'Draft'
  AND campaign.payment_status IN ('Menunggu Pembayaran', 'Menunggu Verifikasi')
  AND campaign.slots > 0
  AND pricing.status = 'Aktif'
  AND lower(trim(pricing.platform)) = lower(trim(campaign.platform))
  AND lower(trim(pricing.service_type)) = lower(trim(campaign.service_type));

-- The Admin Verification page displays payments.amount. Make that field the
-- exact same transaction total shown to the customer.
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

-- Recreate the Admin payment list function so it continues to return the
-- corrected payments.amount column, without changing the payment flow.
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
