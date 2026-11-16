# BuzzHub — Desain Migrasi Auth Fase 3

## Tujuan
Mengganti sesi HMAC sementara (`buzzhub_sid`) dengan Supabase Auth sehingga identitas tidak lagi berasal dari parameter email yang dikirim aplikasi.

## Model data
- `auth.users` menjadi sumber identitas utama.
- `public.profiles` memakai `id uuid primary key references auth.users(id)`, `role`, `name`, `phone`, `city`, `bio`, `company`, `industry`, `avatar_url`, `buzzer_category`, `created_at`, `updated_at`.
- `public.buzzer_profiles` memakai `user_id uuid primary key references profiles(id)`, `username`, `platform`, `followers`, `rating`, `total_reviews`, dan metadata buzzer.
- Tabel bisnis menyimpan `user_id` selain email legacy: `campaigns.customer_id`, `campaign_jobs.buzzer_id`, `payments.customer_id`, `withdrawals.buzzer_id`, `buzzer_ratings.customer_id`.
- Email tetap dipertahankan sebagai snapshot/audit, bukan sebagai authorization key.

## Claims dan role
- Role disimpan di `profiles.role`.
- Custom Access Token Hook mengeluarkan claim `app_role` setelah membaca `profiles`.
- Jangan memberi role dari metadata yang dapat diubah user.
- Server helper wajib memvalidasi `auth.uid()` dan membaca role dari claim/database.

## RLS target
```sql
-- contoh pola
create policy "owner read" on public.profiles
for select to authenticated using (id = auth.uid());

create policy "owner update" on public.profiles
for update to authenticated using (id = auth.uid()) with check (id = auth.uid());

create policy "admin all" on public.profiles
for all to authenticated using ((auth.jwt() ->> 'app_role') = 'admin')
with check ((auth.jwt() ->> 'app_role') = 'admin');
```

Untuk uang: client tidak boleh update saldo, status pembayaran, approval job, atau withdrawal. Semua mutasi memakai RPC `security definer` yang memvalidasi `auth.uid()`/admin claim dan melakukan transaksi atomik.

## Urutan migrasi tanpa downtime
1. Tambahkan `user_id` nullable ke tabel bisnis dan backfill berdasarkan email.
2. Buat `profiles` dari `app_accounts` tanpa memindahkan password hash ke client.
3. Aktifkan email/password Supabase Auth dan buat akun user melalui server/admin API.
4. Simpan mapping `legacy_email -> auth.users.id`.
5. Ubah login untuk memakai `signInWithPassword`; session cookie dikelola Supabase.
6. Ubah server functions agar mengambil `getUser()`/`auth.uid()`, bukan menerima email identitas.
7. Tambahkan RLS owner/admin dan uji setiap role.
8. Jadikan `user_id NOT NULL` setelah seluruh akun ter-migrasi.
9. Hapus HMAC session setelah masa rollback selesai.

## Keamanan wajib
- `SUPABASE_SERVICE_ROLE_KEY` hanya di server, tidak pernah `VITE_*`.
- Password lama tidak dikirim ke browser dan tidak dipindah manual tanpa strategi reset yang aman.
- Audit log untuk perubahan role, approval pembayaran, approval job, dan withdrawal.
- Rate limit login, reset password, upload proof, dan request withdrawal.
- Logout harus invalidate session client dan membersihkan cache lokal.

## Kriteria penerimaan
- Customer tidak dapat membaca profil privat buzzer lain.
- Buzzer hanya dapat mengubah profil, social account, proof, dan withdrawal miliknya.
- Admin dapat mengelola operasi admin setelah role claim diverifikasi.
- Manipulasi email/role di request tidak mengubah identitas authorization.
- Semua operasi uang tetap atomik dan dapat diaudit.
