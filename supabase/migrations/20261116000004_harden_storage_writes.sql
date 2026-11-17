-- =====================================================================
-- Migration: 20261116000004_harden_storage_writes.sql
-- Fase 2c: tutup tulis langsung ke bucket bukti & thumbnail.
--
-- Upload sekarang lewat server function (uploads.functions.ts) memakai
-- service_role. Policy SELECT tetap ada supaya signed URL / gambar publik
-- masih bisa dibaca.
-- =====================================================================
BEGIN;

-- Bukti pengerjaan: hanya service_role yang boleh insert/update/delete.
DROP POLICY IF EXISTS "bukti_insert" ON storage.objects;
DROP POLICY IF EXISTS "bukti_update" ON storage.objects;
DROP POLICY IF EXISTS "bukti_delete" ON storage.objects;

-- Thumbnail katalog campaign: hanya admin (via server) yang boleh menulis.
DROP POLICY IF EXISTS "campaign thumbnails upload" ON storage.objects;
DROP POLICY IF EXISTS "campaign thumbnails update" ON storage.objects;
DROP POLICY IF EXISTS "campaign thumbnails delete" ON storage.objects;

COMMIT;
