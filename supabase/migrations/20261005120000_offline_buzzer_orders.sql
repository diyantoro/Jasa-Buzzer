-- Migration for Offline Buzzer alur pemesanan khusus & catalog integration
CREATE OR REPLACE FUNCTION public.create_customer_offline_payment_campaign(
  p_invoice_no text,
  p_customer_name text,
  p_customer_email text,
  p_campaign_name text,
  p_service_type text,
  p_method text,
  p_note text,
  p_brief text,
  p_amount numeric,
  p_slots integer,
  p_start_date text,
  p_deadline text,
  p_catalog_id uuid DEFAULT NULL,
  p_package_name text DEFAULT NULL,
  p_package_price numeric DEFAULT NULL,
  p_thumbnail_url text DEFAULT NULL
)
RETURNS TABLE(payment_id uuid, campaign_id uuid)
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  created_payment_id uuid;
  created_campaign_id uuid;
  normalized_email text := lower(trim(p_customer_email));
  price_per_buzzer_val numeric;
BEGIN
  IF p_slots IS NULL OR p_slots < 1 THEN
    RAISE EXCEPTION 'Jumlah buzzer minimal 1';
  END IF;
  IF p_amount IS NULL OR p_amount <= 0 THEN
    RAISE EXCEPTION 'Nominal pembayaran tidak valid';
  END IF;
  IF nullif(trim(p_invoice_no), '') IS NULL OR nullif(trim(p_campaign_name), '') IS NULL THEN
    RAISE EXCEPTION 'Invoice dan nama campaign wajib diisi';
  END IF;

  price_per_buzzer_val := round(p_amount / GREATEST(p_slots, 1));

  INSERT INTO public.payments (
    invoice_no, customer_name, customer_email, campaign_name, campaign_type,
    method, note, amount, buzzer_cost, fee, status, paid_at,
    price_per_buzzer, buzzer_count, total_amount
  ) VALUES (
    p_invoice_no, p_customer_name, normalized_email, p_campaign_name, 'Offline',
    p_method, p_note, p_amount, 0, p_amount, 'Menunggu Verifikasi', now(),
    price_per_buzzer_val, p_slots, p_amount
  ) RETURNING id INTO created_payment_id;

  INSERT INTO public.campaigns (
    title, customer_email, customer_name, platform, service_type, brief, budget,
    payout_per_buzzer, slots, start_date, deadline, payment_id, payment_status, status,
    catalog_id, package_name, package_price, package_buzzer_count,
    price_per_buzzer, buzzer_count, total_amount, thumbnail_url
  ) VALUES (
    p_campaign_name, normalized_email, p_customer_name, 'Offline', p_service_type,
    p_brief, p_amount, 0, p_slots, p_start_date, p_deadline, created_payment_id,
    'Menunggu Verifikasi', 'Draft',
    p_catalog_id, p_package_name, p_package_price, p_slots,
    price_per_buzzer_val, p_slots, p_amount, p_thumbnail_url
  ) RETURNING id INTO created_campaign_id;

  UPDATE public.payments
  SET campaign_id = created_campaign_id, updated_at = now()
  WHERE id = created_payment_id;

  RETURN QUERY SELECT created_payment_id, created_campaign_id;
END;
$$;

REVOKE ALL ON FUNCTION public.create_customer_offline_payment_campaign(
  text, text, text, text, text, text, text, text, numeric, integer, text, text, uuid, text, numeric, text
) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.create_customer_offline_payment_campaign(
  text, text, text, text, text, text, text, text, numeric, integer, text, text, uuid, text, numeric, text
) TO anon, authenticated;
