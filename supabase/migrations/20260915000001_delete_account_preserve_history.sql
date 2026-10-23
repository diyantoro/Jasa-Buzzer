-- Delete only account/profile records. Business and financial history is intentionally preserved.
CREATE OR REPLACE FUNCTION public.delete_management_account(p_email text, p_role text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  normalized_email text := lower(trim(p_email));
  normalized_role text := lower(trim(p_role));
  account_role text;
BEGIN
  IF normalized_email = '' OR normalized_role NOT IN ('customer', 'buzzer') THEN
    RAISE EXCEPTION 'Akun atau role tidak valid';
  END IF;

  SELECT lower(trim(role)) INTO account_role
  FROM public.app_accounts
  WHERE lower(trim(email)) = normalized_email
  FOR UPDATE;

  IF account_role IS NULL AND normalized_role = 'customer' AND EXISTS (
    SELECT 1 FROM public.customer_accounts WHERE lower(trim(email)) = normalized_email
  ) THEN
    account_role := 'customer';
  ELSIF account_role IS NULL AND normalized_role = 'buzzer' AND EXISTS (
    SELECT 1 FROM public.buzzer_applications WHERE lower(trim(email)) = normalized_email
  ) THEN
    account_role := 'buzzer';
  ELSIF account_role IS NULL THEN
    RAISE EXCEPTION 'Akun tidak ditemukan';
  END IF;
  IF account_role <> normalized_role THEN
    RAISE EXCEPTION 'Role akun tidak sesuai';
  END IF;

  IF normalized_role = 'buzzer' THEN
    DELETE FROM public.social_accounts WHERE lower(trim(buzzer_email)) = normalized_email;
    DELETE FROM public.buzzer_applications WHERE lower(trim(email)) = normalized_email;
    DELETE FROM public.buzzer_wallets WHERE lower(trim(buzzer_email)) = normalized_email;
  ELSE
    DELETE FROM public.customer_accounts WHERE lower(trim(email)) = normalized_email;
  END IF;

  -- Do not delete payments, campaigns, campaign_jobs, submissions, ratings,
  -- withdrawals, finance_activity, or finance_notifications.
  DELETE FROM public.app_accounts WHERE lower(trim(email)) = normalized_email;
  RETURN true;
END;
$$;

REVOKE ALL ON FUNCTION public.delete_management_account(text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.delete_management_account(text, text) TO anon, authenticated;
