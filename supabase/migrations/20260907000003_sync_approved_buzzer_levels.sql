CREATE OR REPLACE FUNCTION public.sync_approved_buzzer_level()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  resolved_level text;
BEGIN
  IF NEW.status <> 'approved' THEN
    RETURN NEW;
  END IF;

  SELECT name INTO resolved_level
    FROM public.buzzer_levels
   WHERE min_followers <= COALESCE(NEW.followers, 0)
   ORDER BY min_followers DESC, sort_order DESC
   LIMIT 1;

  INSERT INTO public.buzzer_wallets (
    buzzer_email,
    buzzer_name,
    followers,
    verified_followers,
    level,
    level_assigned_at
  ) VALUES (
    lower(trim(NEW.email)),
    NEW.name,
    COALESCE(NEW.followers, 0),
    COALESCE(NEW.followers, 0),
    resolved_level,
    CASE WHEN resolved_level IS NULL THEN NULL ELSE now() END
  )
  ON CONFLICT (buzzer_email) DO UPDATE SET
    buzzer_name = EXCLUDED.buzzer_name,
    followers = EXCLUDED.followers,
    verified_followers = EXCLUDED.verified_followers,
    level = EXCLUDED.level,
    level_assigned_at = COALESCE(public.buzzer_wallets.level_assigned_at, EXCLUDED.level_assigned_at),
    updated_at = now();

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS sync_approved_buzzer_level_after_application ON public.buzzer_applications;
CREATE TRIGGER sync_approved_buzzer_level_after_application
AFTER INSERT OR UPDATE OF status, followers, name, email
ON public.buzzer_applications
FOR EACH ROW EXECUTE FUNCTION public.sync_approved_buzzer_level();

INSERT INTO public.buzzer_wallets (
  buzzer_email,
  buzzer_name,
  followers,
  verified_followers,
  level,
  level_assigned_at
)
SELECT
  lower(trim(a.email)),
  a.name,
  COALESCE(a.followers, 0),
  COALESCE(a.followers, 0),
  level.name,
  now()
FROM public.buzzer_applications a
LEFT JOIN LATERAL (
  SELECT bl.name
  FROM public.buzzer_levels bl
  WHERE bl.min_followers <= COALESCE(a.followers, 0)
  ORDER BY bl.min_followers DESC, bl.sort_order DESC
  LIMIT 1
) level ON true
WHERE a.status = 'approved'
ON CONFLICT (buzzer_email) DO UPDATE SET
  buzzer_name = EXCLUDED.buzzer_name,
  followers = EXCLUDED.followers,
  verified_followers = EXCLUDED.verified_followers,
  level = EXCLUDED.level,
  level_assigned_at = COALESCE(public.buzzer_wallets.level_assigned_at, EXCLUDED.level_assigned_at),
  updated_at = now();
