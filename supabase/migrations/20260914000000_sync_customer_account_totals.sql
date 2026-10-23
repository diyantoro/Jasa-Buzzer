CREATE OR REPLACE FUNCTION public.sync_customer_account_totals()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  target_email text := lower(trim(COALESCE(NEW.customer_email, '')));
BEGIN
  IF target_email = '' THEN
    RETURN NEW;
  END IF;

  INSERT INTO public.customer_accounts (
    email,
    name,
    campaigns_count,
    active_campaigns,
    total_spent,
    updated_at
  )
  SELECT
    target_email,
    COALESCE(NULLIF(MAX(c.customer_name), ''), target_email),
    COUNT(c.id)::integer,
    COUNT(c.id) FILTER (WHERE c.status NOT IN ('Selesai', 'Dibatalkan'))::integer,
    COALESCE((
      SELECT SUM(p.amount)
      FROM public.payments p
      WHERE lower(trim(COALESCE(p.customer_email, ''))) = target_email
        AND p.status IN ('Berhasil', 'Lunas')
    ), 0),
    now()
  FROM public.campaigns c
  WHERE lower(trim(c.customer_email)) = target_email
  ON CONFLICT (email) DO UPDATE SET
    name = EXCLUDED.name,
    campaigns_count = EXCLUDED.campaigns_count,
    active_campaigns = EXCLUDED.active_campaigns,
    total_spent = EXCLUDED.total_spent,
    updated_at = now();

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS sync_customer_account_after_campaign ON public.campaigns;
CREATE TRIGGER sync_customer_account_after_campaign
AFTER INSERT OR UPDATE OF status, customer_email ON public.campaigns
FOR EACH ROW EXECUTE FUNCTION public.sync_customer_account_totals();

DROP TRIGGER IF EXISTS sync_customer_account_after_payment ON public.payments;
CREATE TRIGGER sync_customer_account_after_payment
AFTER INSERT OR UPDATE OF status, customer_email ON public.payments
FOR EACH ROW EXECUTE FUNCTION public.sync_customer_account_totals();