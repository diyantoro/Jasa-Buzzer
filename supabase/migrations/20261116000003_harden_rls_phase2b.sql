-- =====================================================================
-- Migration: 20261116000003_harden_rls_phase2b.sql
-- Fase 2b: tutup direct writes ke pendaftaran buzzer, notifikasi, dan
-- pesan campaign/support dari anon.
--
-- Semua mutasi sekarang lewat server function:
--   * applications.functions.ts  -> buzzer_applications
--   * notifications.functions.ts -> notifications
--   * messages.functions.ts      -> campaign_messages
-- =====================================================================
BEGIN;

-- ---------------------------------------------------------------------
-- 1. Pendaftaran buzzer
--    Risiko sebelumnya: pendaftar bisa mengubah `status` menjadi approved.
-- ---------------------------------------------------------------------
REVOKE INSERT, UPDATE, DELETE, TRUNCATE
  ON public.buzzer_applications FROM anon, authenticated;
GRANT SELECT ON public.buzzer_applications TO anon, authenticated;

DROP POLICY IF EXISTS "demo_all" ON public.buzzer_applications;
DROP POLICY IF EXISTS "management buzzer applications read" ON public.buzzer_applications;
DROP POLICY IF EXISTS "buzzer applications read" ON public.buzzer_applications;
CREATE POLICY "buzzer applications read"
  ON public.buzzer_applications FOR SELECT TO anon, authenticated
  USING (true);

-- ---------------------------------------------------------------------
-- 2. Notifikasi
--    Risiko sebelumnya: siapa pun bisa membuat/menghapus notifikasi akun
--    lain, atau menandai notifikasi orang lain sebagai sudah dibaca.
-- ---------------------------------------------------------------------
REVOKE INSERT, UPDATE, DELETE, TRUNCATE
  ON public.notifications FROM anon, authenticated;
GRANT SELECT ON public.notifications TO anon, authenticated;

DROP POLICY IF EXISTS "notifications_all_access" ON public.notifications;
DROP POLICY IF EXISTS "notifications read" ON public.notifications;
DROP POLICY IF EXISTS "notifications read" ON public.notifications;
CREATE POLICY "notifications read"
  ON public.notifications FOR SELECT TO anon, authenticated
  USING (true);

-- ---------------------------------------------------------------------
-- 3. Pesan campaign & support
--    Risiko sebelumnya: pengirim bisa memalsukan `from_email`/`from_role`.
-- ---------------------------------------------------------------------
REVOKE INSERT, UPDATE, DELETE, TRUNCATE
  ON public.campaign_messages FROM anon, authenticated;
GRANT SELECT ON public.campaign_messages TO anon, authenticated;

DROP POLICY IF EXISTS "demo_all" ON public.campaign_messages;
DROP POLICY IF EXISTS "campaign messages read" ON public.campaign_messages;
DROP POLICY IF EXISTS "campaign messages read" ON public.campaign_messages;
CREATE POLICY "campaign messages read"
  ON public.campaign_messages FOR SELECT TO anon, authenticated
  USING (true);

COMMIT;
