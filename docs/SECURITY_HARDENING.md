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

## Cek konfigurasi

```bash
npm run check:env
npm run check:db
```

`check:env` memeriksa kelengkapan variabel. `check:db` memanggil Supabase untuk
memastikan publishable/secret key diterima dan RPC/tabel hasil migration sudah
ada. Keduanya tidak mencetak nilai rahasia. Exit code non-zero berarti masih ada
yang harus diperbaiki.

## Urutan migration

Terapkan berurutan. Jangan mengedit migration yang sudah dijalankan; buat file
baru untuk perubahan berikutnya.

| Urutan | File | Isi |
| ------ | ---- | --- |
| 1 | `20261116000000_harden_rls_phase1.sql` | Tutup tulis langsung ke tabel uang (`payments`, `withdrawals`, `buzzer_wallets`, `campaign_jobs`, `finance_activity`, dll.). |
| 2 | `20261116000001_phase1_bridge_rpcs.sql` | RPC jembatan (`request_withdrawal`, `submit_job_proof`, `update_profile`) hanya untuk `service_role`. |
| 3 | `20261116000002_harden_rls_phase2_accounts.sql` | Tutup tulis langsung ke `social_accounts`, `buzzer_ratings`, `campaign_job_submissions`. |
| 4 | `20261116000003_harden_rls_phase2b.sql` | Tutup tulis langsung ke `buzzer_applications`, `notifications`, `campaign_messages`. |
| 5 | `20261116000004_harden_storage_writes.sql` | Hapus policy tulis client pada bucket `bukti-pengerjaan` dan `campaign-thumbnails`. |
| 6 | `20261116000005_audit_logs.sql` | Tabel `audit_logs` (khusus `service_role`). |
| 7 | `20261116000006_harden_bridge_rpc_grants.sql` | Cabut `EXECUTE` eksplisit milik `anon`/`authenticated` pada 15 RPC istimewa; hanya `service_role`. |
| 8 | `20261116000007_fix_relations_and_constraints.sql` | Validasi 4 FK tertunda, CHECK domain (`role`, `stars`, singleton wallet, format tanggal), FK dua arah `campaigns`↔`payments`, `catalog_id` → `uuid` + FK, FK akun untuk `buzzer_wallets`/`social_accounts`, index yang hilang, dan seed akun demo customer. |

> Jangan mengedit migration yang sudah dijalankan. Buat file baru untuk
> perubahan berikutnya.

### Menerapkan otomatis

```bash
npm run db:plan    # dry run, tidak menyentuh database
npm run db:apply   # menerapkan berurutan, berhenti pada error pertama
```

`db:apply` memilih jalur koneksi secara otomatis:

1. **psql** — jika `psql` tersedia dan ada `DATABASE_URL`, `SUPABASE_DB_URL`,
   atau `SUPABASE_DB_PASSWORD` (script menyusun connection string dari project
   ref / pooler URL).
2. **Supabase Management API** — jika `psql` tidak ada tetapi
   `SUPABASE_ACCESS_TOKEN` (`sbp_...`) dan project ref tersedia.

> **Penting — scope token.** Token yang dibuat di Dashboard Supabase sekarang
> *scoped* secara default. Token dengan permission **Database: Read** dapat
> membaca database tetapi setiap DDL ditolak dengan
> `25006: cannot execute ... in a read-only transaction`. Untuk `db:apply`,
> buat token yang di-scope ke project ini dengan permission
> **Database: Read-write**.

Tanpa salah satu kredensial di atas, script berhenti dengan instruksi. Jalur
manual terakhir: jalankan `npm run db:bundle`, lalu tempel seluruh isi
`supabase/hardening_bundle.sql` ke Supabase SQL Editor dan Run. File bundle
dibuat dari seluruh migration, jadi jangan diedit manual — regenerate dengan
`npm run db:bundle` setiap kali migration berubah.

`supabase db push` sengaja belum dipakai: project ini belum memiliki tabel
`supabase_migrations.schema_migrations`, sehingga CLI akan menganggap seluruh
migration lama belum diterapkan dan memutar ulang semuanya.

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
| Buzzer (pencairan, bukti, profil, ambil job) | `src/lib/buzzer.functions.ts` |
| Pendaftaran buzzer | `src/lib/applications.functions.ts` |
| Social account | `src/lib/social.functions.ts` |
| Rating | `src/lib/rating.functions.ts` |
| Notifikasi (termasuk notifikasi finance admin) | `src/lib/notifications.functions.ts` |
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
- campaign: reject, complete, update, delete;
- akun: update role/profil, patch, delete;
- level: update konfigurasi, assign level buzzer;
- rating: update, delete;
- pendaftaran buzzer: approve, reject.

Kegagalan menulis audit tidak membatalkan operasi bisnis (best-effort), tetapi
selalu dicatat di log server.

## Yang belum selesai

- **RPC checkout customer masih bisa dipanggil `anon`.** Empat fungsi
  `create_customer_catalog_scheduled_payment_campaign` (dua overload),
  `create_customer_catalog_package_scheduled_payment_campaign`, dan
  `create_customer_custom_scheduled_payment_campaign` sengaja dibiarkan
  terbuka karena alur tamu (guest checkout) memanggilnya langsung dari
  browser. Nominalnya dihitung di server, jadi bukan jalur pencurian uang,
  tetapi anon bisa membanjiri antrean pesanan. Penutupnya: pindahkan checkout
  ke server function (butuh identitas customer, atau pembatasan rate limit
  per IP) lalu jalankan `REVOKE` seperti pada migration 7.
- **`SUPABASE_SERVICE_ROLE_KEY`** kini terisi JWT `service_role` legacy
  (key `sb_secret_...` project ini ditolak PostgREST dengan `401`).
- **`SUPABASE_ACCESS_TOKEN` harus punya permission Database: Read-write.**
  Token dengan akses baca saja gagal dengan `25006`.
- **Docker build belum diuji langsung** karena Docker belum terpasang. Yang
  sudah diverifikasi: build dengan `NITRO_PRESET=node-server` menghasilkan server
  Node yang merespons HTTP 200, dan Dockerfile memakai preset tersebut.
- **Normalisasi lanjutan:** `customer_accounts` dan `buzzer_applications` tetap
  boleh berdiri tanpa pasangan `app_accounts` karena guest checkout dan
  pendaftaran buzzer publik memang terjadi sebelum akun dibuat. Riwayat
  transaksi juga tetap memakai email/snapshot agar penghapusan akun tidak
  menghapus histori keuangan.
- **Ledger uang:** saldo wallet masih merupakan kolom materialized yang
  dipelihara trigger/RPC. Untuk audit keuangan produksi, tahap berikutnya
  adalah ledger append-only sehingga saldo dapat dihitung ulang dari jurnal.
- **Fase 3** (Supabase Auth penuh) menunggu akses project Supabase: pengaturan
  auth, migrasi user, custom access token hook, dan rate limit terpusat.
