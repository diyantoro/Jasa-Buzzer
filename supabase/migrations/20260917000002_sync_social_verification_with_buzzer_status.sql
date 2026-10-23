-- A social account inherits verification from its buzzer application. There is
-- intentionally no separate social-account approval workflow.
CREATE OR REPLACE FUNCTION public.apply_buzzer_verification_to_social_account()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  buzzer_status text;
BEGIN
  SELECT status INTO buzzer_status
  FROM public.buzzer_applications
  WHERE lower(trim(email)) = lower(trim(NEW.buzzer_email))
  LIMIT 1;

  NEW.verification := CASE buzzer_status
    WHEN 'approved' THEN 'Terverifikasi'
    WHEN 'rejected' THEN 'Ditolak'
    ELSE 'Menunggu'
  END;
  NEW.rejection_note := CASE WHEN buzzer_status = 'rejected' THEN NEW.rejection_note ELSE NULL END;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS apply_buzzer_verification_before_social_account_write ON public.social_accounts;
CREATE TRIGGER apply_buzzer_verification_before_social_account_write
BEFORE INSERT OR UPDATE OF buzzer_email, verification ON public.social_accounts
FOR EACH ROW EXECUTE FUNCTION public.apply_buzzer_verification_to_social_account();

CREATE OR REPLACE FUNCTION public.sync_social_verification_from_buzzer_application()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  social_verification text;
BEGIN
  social_verification := CASE NEW.status
    WHEN 'approved' THEN 'Terverifikasi'
    WHEN 'rejected' THEN 'Ditolak'
    ELSE 'Menunggu'
  END;

  UPDATE public.social_accounts
  SET verification = social_verification,
      rejection_note = CASE WHEN NEW.status = 'rejected' THEN rejection_note ELSE NULL END,
      updated_at = now()
  WHERE lower(trim(buzzer_email)) = lower(trim(NEW.email));
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS sync_social_verification_after_buzzer_application ON public.buzzer_applications;
CREATE TRIGGER sync_social_verification_after_buzzer_application
AFTER INSERT OR UPDATE OF status, email ON public.buzzer_applications
FOR EACH ROW EXECUTE FUNCTION public.sync_social_verification_from_buzzer_application();

-- Bring existing rows under the same source of truth without creating data.
UPDATE public.social_accounts AS account
SET verification = CASE application.status
    WHEN 'approved' THEN 'Terverifikasi'
    WHEN 'rejected' THEN 'Ditolak'
    ELSE 'Menunggu'
  END,
  rejection_note = CASE WHEN application.status = 'rejected' THEN account.rejection_note ELSE NULL END,
  updated_at = now()
FROM public.buzzer_applications AS application
WHERE lower(trim(account.buzzer_email)) = lower(trim(application.email));
