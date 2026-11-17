-- =====================================================================
-- Migration: 20261116000005_audit_logs.sql
-- Audit log untuk operasi istimewa (pembayaran, pencairan, job, role).
--
-- Tabel ini hanya untuk service_role: tidak ada grant/policy untuk anon
-- atau authenticated, sehingga browser tidak bisa membaca maupun menulis.
-- =====================================================================
BEGIN;

CREATE TABLE IF NOT EXISTS public.audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_email text NOT NULL,
  actor_role text NOT NULL,
  action text NOT NULL,
  target_type text,
  target_id text,
  details jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at
  ON public.audit_logs (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_actor
  ON public.audit_logs (actor_email);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action
  ON public.audit_logs (action);

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public.audit_logs FROM anon, authenticated;
GRANT ALL ON public.audit_logs TO service_role;

COMMIT;
