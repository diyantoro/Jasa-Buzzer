-- Izinkan upload dokumen PDF untuk bukti pengerjaan buzzer
UPDATE storage.buckets
SET allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'application/pdf']::text[],
    file_size_limit = 20971520
WHERE id = 'bukti-pengerjaan';
