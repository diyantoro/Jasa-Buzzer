-- =====================================================================
-- Migration: 20261116000002_harden_rls_phase2_accounts.sql
-- Fase 2: tutup direct writes ke data akun/social/rating dari anon.
-- =====================================================================
BEGIN;

REVOKE INSERT, UPDATE, DELETE, TRUNCATE
  ON public.social_accounts, public.buzzer_ratings, public.campaign_job_submissions
  FROM anon, authenticated;
GRANT SELECT
  ON public.social_accounts, public.buzzer_ratings, public.campaign_job_submissions
  TO anon, authenticated;

DROP POLICY IF EXISTS "demo_all" ON public.social_accounts;
DROP POLICY IF EXISTS "demo_all" ON public.buzzer_ratings;
DROP POLICY IF EXISTS "demo_all" ON public.campaign_job_submissions;

DROP POLICY IF EXISTS "social accounts read" ON public.social_accounts;
DROP POLICY IF EXISTS "buzzer ratings read" ON public.buzzer_ratings;
DROP POLICY IF EXISTS "job submissions read" ON public.campaign_job_submissions;

CREATE POLICY "social accounts read" ON public.social_accounts
  FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "buzzer ratings read" ON public.buzzer_ratings
  FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "job submissions read" ON public.campaign_job_submissions
  FOR SELECT TO anon, authenticated USING (true);

REVOKE INSERT, UPDATE, DELETE, TRUNCATE
  ON public.customer_accounts FROM anon, authenticated;
GRANT SELECT ON public.customer_accounts TO anon, authenticated;
DROP POLICY IF EXISTS "demo_all" ON public.customer_accounts;
DROP POLICY IF EXISTS "customer accounts read" ON public.customer_accounts;
CREATE POLICY "customer accounts read" ON public.customer_accounts
  FOR SELECT TO anon, authenticated USING (true);

COMMIT;
