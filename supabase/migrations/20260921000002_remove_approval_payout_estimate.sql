-- Jobs do not have a buzzer payout until a verified buzzer claims them.
-- The claim function snapshots the configured level payout.
CREATE OR REPLACE FUNCTION public.approve_campaign_payment(p_payment_id uuid, p_admin_email text DEFAULT 'admin')
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  target_payment public.payments%ROWTYPE;
  target_campaign public.campaigns%ROWTYPE;
  slot_index integer;
  slot_count integer;
  gross_amount numeric;
  base_amount numeric;
  remainder numeric;
BEGIN
  SELECT * INTO target_payment FROM public.payments WHERE id = p_payment_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Pembayaran tidak ditemukan'; END IF;
  IF target_payment.status IN ('Berhasil', 'Lunas') AND target_payment.campaign_id IS NOT NULL THEN
    RETURN target_payment.campaign_id;
  END IF;
  IF target_payment.status NOT IN ('Menunggu Verifikasi', 'Pending', 'Gagal') THEN
    RAISE EXCEPTION 'Status pembayaran tidak dapat disetujui: %', target_payment.status;
  END IF;

  SELECT * INTO target_campaign
  FROM public.campaigns
  WHERE id = target_payment.campaign_id
     OR (payment_id = target_payment.id)
     OR (lower(customer_email) = lower(coalesce(target_payment.customer_email, '')) AND title = target_payment.campaign_name)
  ORDER BY (payment_id = target_payment.id) DESC, created_at DESC
  LIMIT 1
  FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Campaign untuk pembayaran tidak ditemukan'; END IF;

  UPDATE public.payments
  SET status = 'Berhasil', paid_at = COALESCE(paid_at, now()), verified_at = now(), verified_by = p_admin_email,
      rejection_reason = NULL, campaign_id = target_campaign.id, updated_at = now()
  WHERE id = target_payment.id;

  UPDATE public.campaigns
  SET payment_id = target_payment.id, payment_status = 'Pembayaran Disetujui',
      payment_rejection_reason = NULL, status = 'Aktif', updated_at = now()
  WHERE id = target_campaign.id;

  SELECT count(*)::integer INTO slot_count FROM public.campaign_jobs WHERE campaign_id = target_campaign.id;
  IF slot_count = 0 THEN
    slot_count := GREATEST(target_campaign.slots, 1);
    gross_amount := GREATEST(target_campaign.budget, 0);
    base_amount := floor(gross_amount / slot_count);
    remainder := gross_amount - base_amount * slot_count;
    FOR slot_index IN 1..slot_count LOOP
      INSERT INTO public.campaign_jobs (
        campaign_id, campaign_title, platform, gross_price, payout, deadline, brief, status
      ) VALUES (
        target_campaign.id, target_campaign.title, target_campaign.platform,
        base_amount + CASE WHEN slot_index <= remainder THEN 1 ELSE 0 END,
        0,
        target_campaign.deadline, target_campaign.brief, 'Tersedia'
      );
    END LOOP;
  END IF;

  INSERT INTO public.finance_notifications (category, title, body, link)
  VALUES ('payment', 'Pembayaran disetujui', 'Campaign ' || target_campaign.title || ' sekarang aktif.', '/customer');
  RETURN target_campaign.id;
END;
$$;

REVOKE ALL ON FUNCTION public.approve_campaign_payment(uuid, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.approve_campaign_payment(uuid, text) TO anon, authenticated;
