-- Detail Pembayaran already reads selected.amount, which is payments.amount.
-- Make that existing payment field follow the stored transaction snapshot.
-- Catalog campaigns and paid/completed history are excluded.

CREATE OR REPLACE FUNCTION public.list_admin_payments()
RETURNS SETOF public.payments
LANGUAGE plpgsql
VOLATILE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.payments AS payment
  SET amount = COALESCE(
        NULLIF(payment.total_amount, 0),
        NULLIF(campaign.total_amount, 0),
        pricing.price_per_buzzer * GREATEST(campaign.slots, 1)
      ),
      fee = COALESCE(
        NULLIF(payment.total_amount, 0),
        NULLIF(campaign.total_amount, 0),
        pricing.price_per_buzzer * GREATEST(campaign.slots, 1)
      ),
      price_per_buzzer = COALESCE(payment.price_per_buzzer, pricing.price_per_buzzer),
      buzzer_count = COALESCE(payment.buzzer_count, campaign.buzzer_count, campaign.slots),
      total_amount = COALESCE(
        NULLIF(payment.total_amount, 0),
        NULLIF(campaign.total_amount, 0),
        pricing.price_per_buzzer * GREATEST(campaign.slots, 1)
      ),
      updated_at = now()
  FROM public.campaigns AS campaign
  LEFT JOIN public.service_pricing AS pricing
    ON lower(trim(pricing.platform)) = lower(trim(campaign.platform))
   AND lower(trim(pricing.service_type)) = lower(trim(campaign.service_type))
   AND pricing.status = 'Aktif'
  WHERE campaign.payment_id = payment.id
    AND campaign.catalog_id IS NULL
    AND campaign.status = 'Draft'
    AND campaign.payment_status IN ('Menunggu Pembayaran', 'Menunggu Verifikasi')
    AND payment.status IN ('Pending', 'Menunggu Pembayaran', 'Menunggu Verifikasi')
    AND COALESCE(
      NULLIF(payment.total_amount, 0),
      NULLIF(campaign.total_amount, 0),
      pricing.price_per_buzzer * GREATEST(campaign.slots, 1)
    ) IS NOT NULL;

  RETURN QUERY
  SELECT payment.*
  FROM public.payments AS payment
  ORDER BY payment.created_at DESC
  LIMIT 500;
END;
$$;

REVOKE ALL ON FUNCTION public.list_admin_payments() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.list_admin_payments() TO anon, authenticated;
