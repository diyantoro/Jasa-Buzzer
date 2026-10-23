-- Reviews are immutable: one review per completed job.

DROP POLICY IF EXISTS "demo_all" ON public.buzzer_ratings;

DROP POLICY IF EXISTS "customers can read ratings" ON public.buzzer_ratings;

DROP POLICY IF EXISTS "customers can create ratings" ON public.buzzer_ratings;

CREATE POLICY "customers can read ratings"
  ON public.buzzer_ratings
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "customers can create ratings"
  ON public.buzzer_ratings
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);