CREATE OR REPLACE FUNCTION public.recalculate_buzzer_level(target_email text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  normalized_email text := lower(trim(target_email));
  total_followers integer;
  resolved_level text;
  buzzer_name_value text;
BEGIN
  IF normalized_email IS NULL OR normalized_email = '' THEN RETURN; END IF;
  SELECT COALESCE(SUM(followers), 0)::integer INTO total_followers
  FROM public.social_accounts
  WHERE lower(trim(buzzer_email)) = normalized_email AND verification = 'Terverifikasi';

  SELECT bl.name INTO resolved_level FROM public.buzzer_levels bl
  WHERE bl.min_followers <= total_followers
  ORDER BY bl.min_followers DESC, bl.sort_order DESC LIMIT 1;

  SELECT COALESCE((SELECT buzzer_name FROM public.buzzer_wallets WHERE lower(trim(buzzer_email)) = normalized_email LIMIT 1),
                  (SELECT name FROM public.app_accounts WHERE lower(trim(email)) = normalized_email LIMIT 1),
                  split_part(normalized_email, '@', 1)) INTO buzzer_name_value;

  INSERT INTO public.buzzer_wallets (buzzer_email, buzzer_name, followers, verified_followers, level, level_assigned_at)
  VALUES (normalized_email, buzzer_name_value, total_followers, total_followers, resolved_level,
          CASE WHEN resolved_level IS NULL THEN NULL ELSE now() END)
  ON CONFLICT (buzzer_email) DO UPDATE SET followers = EXCLUDED.followers,
    verified_followers = EXCLUDED.verified_followers, level = EXCLUDED.level,
    level_assigned_at = CASE WHEN EXCLUDED.level IS NULL THEN NULL
      WHEN public.buzzer_wallets.level IS DISTINCT FROM EXCLUDED.level THEN now()
      ELSE public.buzzer_wallets.level_assigned_at END, updated_at = now();

  IF total_followers > 0 THEN
    UPDATE public.app_accounts
    SET followers = total_followers, updated_at = now()
    WHERE lower(trim(email)) = normalized_email AND role = 'buzzer';

    UPDATE public.buzzer_applications
    SET followers = total_followers, updated_at = now()
    WHERE lower(trim(email)) = normalized_email;
  END IF;
END;
$$;

DROP TRIGGER IF EXISTS sync_buzzer_level_after_social_account_change ON public.social_accounts;
CREATE TRIGGER sync_buzzer_level_after_social_account_change
AFTER INSERT OR UPDATE OF buzzer_email, followers, verification OR DELETE ON public.social_accounts
FOR EACH ROW EXECUTE FUNCTION public.sync_buzzer_level_from_social_account();

NOTIFY pgrst, 'reload schema';
