-- Reconcile older Pesanan Sendiri rows that were created with the legacy
-- package amount. Admin catalogs are excluded because their price is fixed.
UPDATE public.campaigns AS campaign
SET budget = pricing.price_per_buzzer * campaign.slots,
    updated_at = now()
FROM public.service_pricing AS pricing
WHERE campaign.catalog_id IS NULL
  AND campaign.slots > 0
  AND pricing.status = 'Aktif'
  AND lower(pricing.platform) = lower(campaign.platform)
  AND lower(pricing.service_type) = lower(campaign.service_type);

UPDATE public.payments AS payment
SET amount = campaign.budget,
    fee = campaign.budget,
    buzzer_cost = 0,
    updated_at = now()
FROM public.campaigns AS campaign
WHERE campaign.payment_id = payment.id
  AND campaign.catalog_id IS NULL
  AND campaign.budget > 0;

-- Keep the custom-order RPC authoritative for all future orders. The client
-- only supplies service identity and quantity; price and total come from the
-- active service_pricing row.
CREATE OR REPLACE FUNCTION public.create_customer_custom_scheduled_payment_campaign(
  p_invoice_no text,
  p_customer_name text,
  p_customer_email text,
  p_campaign_name text,
  p_platform text,
  p_service_type text,
  p_method text,
  p_note text,
  p_brief text,
  p_slots integer,
  p_start_date text,
  p_deadline text
)
RETURNS TABLE(payment_id uuid, campaign_id uuid)
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  pricing public.service_pricing%ROWTYPE;
  created_payment_id uuid;
  created_campaign_id uuid;
  normalized_email text := lower(trim(p_customer_email));
  total_amount numeric;
BEGIN
  IF p_slots IS NULL OR p_slots < 1 THEN
    RAISE EXCEPTION 'Jumlah buzzer minimal 1';
  END IF;
  IF p_start_date !~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}$'
     OR p_deadline !~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}$'
     OR p_deadline::date < p_start_date::date THEN
    RAISE EXCEPTION 'Rentang tanggal campaign tidak valid';
  END IF;

  SELECT * INTO pricing
  FROM public.service_pricing
  WHERE lower(platform) = lower(trim(p_platform))
    AND lower(service_type) = lower(trim(p_service_type))
    AND status = 'Aktif';
  IF pricing.id IS NULL THEN
    RAISE EXCEPTION 'Harga layanan per buzzer belum dikonfigurasi admin';
  END IF;

  total_amount := pricing.price_per_buzzer * p_slots;
  INSERT INTO public.payments (
    invoice_no, customer_name, customer_email, campaign_name, campaign_type,
    method, note, amount, buzzer_cost, fee, status, paid_at
  ) VALUES (
    p_invoice_no, p_customer_name, normalized_email, p_campaign_name, p_platform,
    p_method, p_note, total_amount, 0, total_amount, 'Menunggu Verifikasi', now()
  ) RETURNING id INTO created_payment_id;

  INSERT INTO public.campaigns (
    title, customer_email, customer_name, platform, service_type, brief, budget,
    payout_per_buzzer, slots, start_date, deadline, payment_id, payment_status, status
  ) VALUES (
    p_campaign_name, normalized_email, p_customer_name, p_platform, p_service_type,
    p_brief, total_amount, 0, p_slots, p_start_date, p_deadline, created_payment_id,
    'Menunggu Verifikasi', 'Draft'
  ) RETURNING id INTO created_campaign_id;

  UPDATE public.payments SET campaign_id = created_campaign_id, updated_at = now()
  WHERE id = created_payment_id;
  RETURN QUERY SELECT created_payment_id, created_campaign_id;
END;
$$;

REVOKE ALL ON FUNCTION public.create_customer_custom_scheduled_payment_campaign(
  text, text, text, text, text, text, text, text, text, integer, text, text
) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.create_customer_custom_scheduled_payment_campaign(
  text, text, text, text, text, text, text, text, text, integer, text, text
) TO anon, authenticated;