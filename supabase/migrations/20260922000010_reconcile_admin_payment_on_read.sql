-- Final guard for Admin Verification nominal.
-- Reconcile pending self-order payments immediately before Admin reads them.
-- Admin catalogs and completed/paid history are excluded.

CREATE OR REPLACE FUNCTION public.list_admin_payments()
RETURNS SETOF public.payments
LANGUAGE plpgsql
VOLATILE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.payments AS payment
  SET amount = pricing.price_per_buzzer * GREATEST(campaign.slots, 1),
      fee = pricing.price_per_buzzer * GREATEST(campaign.slots, 1),
      buzzer_cost = 0,
      price_per_buzzer = pricing.price_per_buzzer,
      buzzer_count = GREATEST(campaign.slots, 1),
      total_amount = pricing.price_per_buzzer * GREATEST(campaign.slots, 1),
      updated_at = now()
  FROM public.campaigns AS campaign
  JOIN public.service_pricing AS pricing
    ON lower(trim(pricing.platform)) = lower(trim(campaign.platform))
   AND lower(trim(pricing.service_type)) = lower(trim(campaign.service_type))
   AND pricing.status = 'Aktif'
  WHERE campaign.payment_id = payment.id
    AND campaign.catalog_id IS NULL
    AND campaign.status = 'Draft'
    AND campaign.payment_status IN ('Menunggu Pembayaran', 'Menunggu Verifikasi')
    AND payment.status IN ('Pending', 'Menunggu Pembayaran', 'Menunggu Verifikasi');

  RETURN QUERY
  SELECT payment.*
  FROM public.payments AS payment
  ORDER BY payment.created_at DESC
  LIMIT 500;
END;
$$;

REVOKE ALL ON FUNCTION public.list_admin_payments() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.list_admin_payments() TO anon, authenticated;
