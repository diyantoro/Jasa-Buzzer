-- Store a customer payment and its pending campaign atomically.
ALTER TABLE public.campaigns
  ADD COLUMN IF NOT EXISTS payment_id uuid,
  ADD COLUMN IF NOT EXISTS payment_status text NOT NULL DEFAULT 'Menunggu Pembayaran',
  ADD COLUMN IF NOT EXISTS payment_rejection_reason text,
  ADD COLUMN IF NOT EXISTS target_reached_at timestamptz;

ALTER TABLE public.payments
  ADD COLUMN IF NOT EXISTS campaign_id uuid,
  ADD COLUMN IF NOT EXISTS proof_url text,
  ADD COLUMN IF NOT EXISTS rejection_reason text,
  ADD COLUMN IF NOT EXISTS verified_at timestamptz,
  ADD COLUMN IF NOT EXISTS verified_by text;

CREATE INDEX IF NOT EXISTS payments_customer_invoice_idx
  ON public.payments (lower(trim(coalesce(customer_email, ''))), invoice_no);

CREATE OR REPLACE FUNCTION public.create_customer_payment_campaign(
  p_invoice_no text,
  p_customer_name text,
  p_customer_email text,
  p_campaign_name text,
  p_campaign_type text,
  p_method text,
  p_note text,
  p_amount numeric,
  p_buzzer_cost numeric,
  p_fee numeric,
  p_brief text,
  p_budget numeric,
  p_payout_per_buzzer numeric,
  p_slots integer,
  p_deadline text
)
RETURNS TABLE(payment_id uuid, campaign_id uuid)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  existing_payment public.payments%ROWTYPE;
  created_payment_id uuid;
  created_campaign_id uuid;
  normalized_email text := lower(trim(p_customer_email));
BEGIN
  IF nullif(trim(p_invoice_no), '') IS NULL OR nullif(trim(p_campaign_name), '') IS NULL THEN
    RAISE EXCEPTION 'Invoice dan nama campaign wajib diisi';
  END IF;

  -- Prevent double-clicks or concurrent requests from creating duplicate rows.
  PERFORM pg_advisory_xact_lock(hashtextextended(normalized_email || ':' || p_invoice_no, 0));
  SELECT * INTO existing_payment
  FROM public.payments
  WHERE invoice_no = p_invoice_no
    AND lower(trim(coalesce(customer_email, ''))) = normalized_email
  ORDER BY created_at DESC
  LIMIT 1
  FOR UPDATE;

  IF existing_payment.id IS NOT NULL AND existing_payment.campaign_id IS NOT NULL
     AND existing_payment.status = 'Menunggu Verifikasi' THEN
    RETURN QUERY SELECT existing_payment.id, existing_payment.campaign_id;
    RETURN;
  END IF;

  IF existing_payment.id IS NOT NULL AND existing_payment.status IN ('Berhasil', 'Lunas') THEN
    RAISE EXCEPTION 'Invoice sudah diproses dan tidak dapat dibayar ulang';
  END IF;

  IF existing_payment.id IS NULL THEN
    INSERT INTO public.payments (
      invoice_no, customer_name, customer_email, campaign_name, campaign_type,
      method, note, amount, buzzer_cost, fee, status, paid_at
    ) VALUES (
      p_invoice_no, p_customer_name, normalized_email, p_campaign_name, p_campaign_type,
      p_method, p_note, p_amount, p_buzzer_cost, p_fee, 'Menunggu Verifikasi', now()
    )
    RETURNING id INTO created_payment_id;
  ELSE
    created_payment_id := existing_payment.id;
    UPDATE public.payments
    SET customer_name = p_customer_name,
        campaign_name = p_campaign_name,
        campaign_type = p_campaign_type,
        method = p_method,
        note = p_note,
        amount = p_amount,
        buzzer_cost = p_buzzer_cost,
        fee = p_fee,
        status = 'Menunggu Verifikasi',
        paid_at = COALESCE(paid_at, now()),
        updated_at = now()
    WHERE id = created_payment_id;
  END IF;

  INSERT INTO public.campaigns (
    title, customer_email, customer_name, platform, brief, budget,
    payout_per_buzzer, slots, deadline, payment_id, payment_status, status
  ) VALUES (
    p_campaign_name, normalized_email, p_customer_name, p_campaign_type, p_brief,
    p_budget, p_payout_per_buzzer, GREATEST(p_slots, 1), p_deadline,
    created_payment_id, 'Menunggu Verifikasi', 'Draft'
  )
  RETURNING id INTO created_campaign_id;

  UPDATE public.payments
  SET campaign_id = created_campaign_id, updated_at = now()
  WHERE id = created_payment_id;

  RETURN QUERY SELECT created_payment_id, created_campaign_id;
END;
$$;

REVOKE ALL ON FUNCTION public.create_customer_payment_campaign(
  text, text, text, text, text, text, text, numeric, numeric, numeric,
  text, numeric, numeric, integer, text
) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.create_customer_payment_campaign(
  text, text, text, text, text, text, text, numeric, numeric, numeric,
  text, numeric, numeric, integer, text
) TO anon, authenticated;

-- The admin screen uses the application's role session rather than Supabase Auth.
-- Read payments through a controlled function so an RLS read policy cannot hide
-- payments that were successfully stored by the customer RPC.
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