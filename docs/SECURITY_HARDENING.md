# BuzzHub — Security Hardening (Fase 1–2c)

Dokumen ini merangkum pengerasan keamanan yang sudah diterapkan dan langkah
penerapannya. Fase 3 (Supabase Auth penuh) dibahas terpisah di
`docs/AUTH_PHASE3_DESIGN.md`.

## Prasyarat

Isi `.env` (atau environment runtime) dengan:

- `SUPABASE_SERVICE_ROLE_KEY` — kunci rahasia, **hanya server**.
- `SESSION_SECRET` — string acak minimal 32 karakter untuk HMAC cookie sesi.

Tanpa service role key yang valid, server function berjalan sebagai `anon` dan
ditolak policy hasil hardening (fail closed).

## Urutan migration

Terapkan berurutan di Supabase SQL editor (atau `supabase db push` setelah
riwayat migration tersedia):

| Urutan | File | Isi |
| ------ | ---- | --- |
| 1 | `20261116000000_harden_rls_phase1.sql` | Tutup tulis langsung ke tabel uang (`payments`, `withdrawals`, `buzzer_wallets`, `campaign_jobs`, `finance_activity`, dll.). |
| 2 | `20261116000001_phase1_bridge_rpcs.sql` | RPC jembatan (`request_withdrawal`, `submit_job_proof`, `update_profile`) hanya untuk `service_role`. |
| 3 | `20261116000002_harden_rls_phase2_accounts.sql` | Tutup tulis langsung ke `social_accounts`, `buzzer_ratings`, `campaign_job_submissions`. |
| 4 | `20261116000003_harden_rls_phase2b.sql` | Tutup tulis langsung ke `buzzer_applications`, `notifications`, `campaign_messages`. |
| 5 | `20261116000004_harden_storage_writes.sql` | Hapus policy tulis client pada bucket `bukti-pengerjaan` dan `campaign-thumbnails`. |
| 6 | `20261116000005_audit_logs.sql` | Tabel `audit_logs` (khusus `service_role`). |

> Jangan mengedit migration yang sudah dijalankan. Buat file baru untuk
> perubahan berikutnya.

## Batas kepercayaan

- Cookie sesi `buzzhub_sid` ditandatangani HMAC-SHA256 dan berisi
  `{ email, role, exp }`. Server memverifikasi tanda tangan **dan** mengecek
  ulang role di database (`requireAdmin`).
- Server function mengambil identitas dari sesi, bukan dari parameter client.
- Client tidak memiliki grant tulis ke tabel sensitif; semua mutasi lewat
  server function dengan `service_role`.

## Daftar server function

| Domain | Modul |
| ------ | ----- |
| Admin (uang, job, campaign, akun, level, rating) | `src/lib/admin.functions.ts` |
| Akun & login | `src/lib/accounts.functions.ts` |
| Buzzer (pencairan, bukti, profil) | `src/lib/buzzer.functions.ts` |
| Pendaftaran buzzer | `src/lib/applications.functions.ts` |
| Social account | `src/lib/social.functions.ts` |
| Rating | `src/lib/rating.functions.ts` |
| Notifikasi | `src/lib/notifications.functions.ts` |
| Pesan campaign/support | `src/lib/messages.functions.ts` |
| Upload storage | `src/lib/uploads.functions.ts` |
| Audit | `src/lib/audit.server.ts` |
| Rate limit | `src/lib/rate-limit.server.ts` |

## Password

- Format baru: `pbkdf2$210000$<saltHex>$<hashHex>` (PBKDF2-SHA256, salt acak).
- Hash lama SHA-256 (`buzzhub::v1::<email>::<password>`) diverifikasi sekali
  lalu otomatis di-rehash saat login berhasil.

## Rate limit

Best-effort in-memory per instance untuk:

- login (8 percobaan / 10 menit per email),
- ganti password (5 / 10 menit),
- upload bukti (30 / jam),
- pengajuan pencairan (5 / jam).

Untuk deployment multi-instance, ganti dengan penyimpanan bersama (tabel
Postgres atau Redis/Upstash) pada Fase 3.

## Audit log

`writeAuditLog` dipanggil untuk:

- pembayaran: approve, reject, update, delete;
- pencairan: approve, reject, update, delete;
- job: review, approve, reject proof, delete;
- campaign: reject, complete, update, delete, update payout;
- akun: update role/profil, patch, delete;
- level: update konfigurasi, assign level buzzer;
- rating: update, delete;
- pendaftaran buzzer: approve, reject.

Kegagalan menulis audit tidak membatalkan operasi bisnis (best-effort), tetapi
selalu dicatat di log server.

## Yang belum selesai

- Menerapkan migration di atas ke project Supabase (butuh akses project /
  `SUPABASE_SERVICE_ROLE_KEY` valid dan riwayat migration).
- Fase 3: migrasi ke Supabase Auth (`auth.users`, `profiles`, custom claims,
  RLS berbasis `auth.uid()`), termasuk rate limit terpusat dan verifikasi email.
- Uji Docker build/deploy (Docker belum tersedia di lingkungan pengembangan).
