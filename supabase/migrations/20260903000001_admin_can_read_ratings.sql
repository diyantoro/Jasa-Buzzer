-- Admin dashboard may read the complete review history; reviews remain immutable.
DROP POLICY IF EXISTS "admins can read all ratings" ON public.buzzer_ratings;
CREATE POLICY "admins can read all ratings"
  ON public.buzzer_ratings
  FOR SELECT
  TO authenticated
  USING ((auth.jwt() ->> 'role') = 'admin');

REVOKE UPDATE, DELETE ON public.buzzer_ratings FROM anon, authenticated;