-- =====================================================================
-- Migration: 20261112010000_atomic_withdrawal_rpc.sql
-- Description: Pencairan saldo buzzer diproses secara ATOMIK di database.
--
-- Masalah sebelumnya: pemotongan saldo dilakukan di kode klien
-- (finance-store.ts) dengan pola `baca saldo -> hitung -> update`. Akibatnya:
--   1. Dua tab admin yang menyetujui bersamaan bisa memotong saldo 2x
--      atau justru tidak memotong sama sekali.
--   2. Saldo bisa menjadi 0 karena `Math.max(0, saldo - nominal)`
--      walau saldo tidak cukup (uang hilang tanpa error).
--   3. Jika update `withdrawals` berhasil tetapi update saldo gagal,
--      status sudah "Berhasil" padahal saldo belum dipotong.
--
-- Solusi: semua mutasi saldo lewat RPC dengan row lock (`FOR UPDATE`)
-- dalam satu transaksi. Jika ada langkah gagal, seluruh transaksi batal.
--
-- RPC:
--   approve_withdrawal(p_withdrawal_id, p_admin_note, p_proof_url)
--   reject_withdrawal (p_withdrawal_id, p_reason)
--   edit_withdrawal   (p_withdrawal_id, p_status, p_amount, ...)
--   delete_withdrawal (p_withdrawal_id)
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1. Setujui pencairan: potong saldo + ubah status + catat aktivitas
-- ---------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.approve_withdrawal(
  p_withdrawal_id uuid,
  p_admin_note text DEFAULT NULL,
  p_proof_url text DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  w public.withdrawals%ROWTYPE;
  v_email text;
  v_balance numeric;
  v_amount numeric;
BEGIN
  -- Kunci baris pencairan agar tidak diproses ganda (dua tab / dobel klik).
  SELECT * INTO w FROM public.withdrawals WHERE id = p_withdrawal_id FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Pengajuan pencairan tidak ditemukan';
  END IF;

  -- Idempoten: kalau sudah disetujui, jangan potong saldo lagi.
  IF w.status IN ('Berhasil', 'Disetujui') THEN
    RETURN;
  END IF;

  v_email := lower(trim(w.buzzer_email));
  v_amount := GREATEST(COALESCE(w.amount, 0), 0);

  IF v_amount <= 0 THEN
    RAISE EXCEPTION 'Nominal pencairan tidak valid';
  END IF;

  -- Kunci dompet buzzer.
  SELECT balance INTO v_balance
  FROM public.buzzer_wallets
  WHERE lower(trim(buzzer_email)) = v_email
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Dompet buzzer % tidak ditemukan', w.buzzer_email;
  END IF;

  v_balance := COALESCE(v_balance, 0);

  IF v_balance < v_amount THEN
    RAISE EXCEPTION 'Saldo buzzer tidak mencukupi. Saldo: Rp %, diminta: Rp %', v_balance, v_amount;
  END IF;

  UPDATE public.buzzer_wallets
  SET balance = v_balance - v_amount,
      updated_at = now()
  WHERE lower(trim(buzzer_email)) = v_email;

  UPDATE public.withdrawals
  SET status = 'Berhasil',
      admin_note = COALESCE(p_admin_note, admin_note),
      proof_url = COALESCE(p_proof_url, proof_url),
      approved_at = COALESCE(approved_at, now()),
      completed_at = now(),
      updated_at = now()
  WHERE id = p_withdrawal_id;

  INSERT INTO public.finance_activity (type, title, description, amount, ref_table, ref_id)
  VALUES (
    'buzzer',
    'Pencairan Saldo Buzzer',
    'Pencairan Rp ' || to_char(v_amount, 'FM999G999G999G999') || ' ke ' || COALESCE(w.account_no, w.method) || ' disetujui admin',
    v_amount,
    'withdrawals',
    p_withdrawal_id::text
  );
END;
$$;

-- ---------------------------------------------------------------------
-- 2. Tolak pencairan: saldo TIDAK berubah
-- ---------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.reject_withdrawal(
  p_withdrawal_id uuid,
  p_reason text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  w public.withdrawals%ROWTYPE;
  v_reason text := trim(COALESCE(p_reason, ''));
BEGIN
  IF v_reason = '' THEN
    RAISE EXCEPTION 'Alasan penolakan pencairan wajib diisi';
  END IF;

  SELECT * INTO w FROM public.withdrawals WHERE id = p_withdrawal_id FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Pengajuan pencairan tidak ditemukan';
  END IF;

  IF w.status IN ('Berhasil', 'Disetujui') THEN
    RAISE EXCEPTION 'Pencairan sudah disetujui. Gunakan edit/ubah status untuk membatalkan.';
  END IF;

  UPDATE public.withdrawals
  SET status = 'Ditolak',
      admin_note = v_reason,
      completed_at = NULL,
      updated_at = now()
  WHERE id = p_withdrawal_id;

  INSERT INTO public.finance_activity (type, title, description, amount, ref_table, ref_id)
  VALUES (
    'buzzer',
    'Pencairan Saldo Ditolak',
    'Pengajuan pencairan Rp ' || to_char(GREATEST(COALESCE(w.amount, 0), 0), 'FM999G999G999G999') || ' ditolak: ' || v_reason,
    GREATEST(COALESCE(w.amount, 0), 0),
    'withdrawals',
    p_withdrawal_id::text
  );
END;
$$;

-- ---------------------------------------------------------------------
-- 3. Edit pencairan: status & nominal dengan koreksi saldo (delta)
-- ---------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.edit_withdrawal(
  p_withdrawal_id uuid,
  p_status text DEFAULT NULL,
  p_amount numeric DEFAULT NULL,
  p_method text DEFAULT NULL,
  p_account_no text DEFAULT NULL,
  p_admin_note text DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  w public.withdrawals%ROWTYPE;
  v_email text;
  v_prev_status text;
  v_new_status text;
  v_prev_amount numeric;
  v_new_amount numeric;
  v_was_approved boolean;
  v_is_approved boolean;
  v_delta numeric := 0;
  v_balance numeric;
  v_description text;
BEGIN
  SELECT * INTO w FROM public.withdrawals WHERE id = p_withdrawal_id FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Pengajuan pencairan tidak ditemukan';
  END IF;

  v_prev_status := w.status;
  v_new_status := COALESCE(p_status, w.status);
  v_prev_amount := GREATEST(COALESCE(w.amount, 0), 0);
  v_new_amount := GREATEST(COALESCE(p_amount, w.amount), 0);

  IF v_new_status NOT IN ('Menunggu', 'Diproses', 'Disetujui', 'Berhasil', 'Ditolak') THEN
    RAISE EXCEPTION 'Status pencairan tidak dikenal: %', v_new_status;
  END IF;

  v_was_approved := v_prev_status IN ('Berhasil', 'Disetujui');
  v_is_approved := v_new_status IN ('Berhasil', 'Disetujui');

  IF v_is_approved AND v_new_amount <= 0 THEN
    RAISE EXCEPTION 'Nominal pencairan yang disetujui harus lebih dari 0';
  END IF;

  -- Hitung perubahan saldo:
  --  - baru disetujui      -> potong nominal baru
  --  - batal disetujui     -> kembalikan nominal lama
  --  - sudah disetujui     -> sesuaikan dengan selisih nominal (bisa + / -)
  IF v_was_approved AND v_is_approved THEN
    v_delta := v_prev_amount - v_new_amount;
  ELSIF (NOT v_was_approved) AND v_is_approved THEN
    v_delta := -v_new_amount;
  ELSIF v_was_approved AND (NOT v_is_approved) THEN
    v_delta := v_prev_amount;
  ELSE
    v_delta := 0;
  END IF;

  IF v_delta <> 0 THEN
    v_email := lower(trim(w.buzzer_email));

    SELECT balance INTO v_balance
    FROM public.buzzer_wallets
    WHERE lower(trim(buzzer_email)) = v_email
    FOR UPDATE;

    IF NOT FOUND THEN
      RAISE EXCEPTION 'Dompet buzzer % tidak ditemukan', w.buzzer_email;
    END IF;

    v_balance := COALESCE(v_balance, 0);

    IF v_balance + v_delta < 0 THEN
      RAISE EXCEPTION 'Saldo buzzer tidak mencukupi untuk perubahan ini. Saldo: Rp %, perubahan: Rp %', v_balance, v_delta;
    END IF;

    UPDATE public.buzzer_wallets
    SET balance = v_balance + v_delta,
        updated_at = now()
    WHERE lower(trim(buzzer_email)) = v_email;
  END IF;

  UPDATE public.withdrawals
  SET status = v_new_status,
      amount = v_new_amount,
      method = COALESCE(p_method, method),
      account_no = COALESCE(p_account_no, account_no),
      admin_note = COALESCE(p_admin_note, admin_note),
      approved_at = CASE
        WHEN v_is_approved AND NOT v_was_approved THEN now()
        WHEN NOT v_is_approved THEN NULL
        ELSE approved_at
      END,
      completed_at = CASE
        WHEN v_is_approved AND v_was_approved THEN completed_at
        WHEN v_is_approved THEN now()
        ELSE NULL
      END,
      updated_at = now()
  WHERE id = p_withdrawal_id;

  IF v_delta <> 0 THEN
    IF v_delta < 0 THEN
      v_description := 'Saldo dipotong Rp ' || to_char(-v_delta, 'FM999G999G999G999') || ' untuk pencairan';
    ELSE
      v_description := 'Saldo dikembalikan Rp ' || to_char(v_delta, 'FM999G999G999G999') || ' dari perubahan pencairan';
    END IF;

    INSERT INTO public.finance_activity (type, title, description, amount, ref_table, ref_id)
    VALUES (
      'buzzer',
      'Penyesuaian Pencairan Saldo',
      v_description,
      ABS(v_delta),
      'withdrawals',
      p_withdrawal_id::text
    );
  END IF;
END;
$$;

-- ---------------------------------------------------------------------
-- 4. Hapus riwayat pencairan: refund hanya jika sebelumnya disetujui
-- ---------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.delete_withdrawal(p_withdrawal_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  w public.withdrawals%ROWTYPE;
  v_email text;
  v_balance numeric;
  v_amount numeric;
  v_was_approved boolean;
BEGIN
  SELECT * INTO w FROM public.withdrawals WHERE id = p_withdrawal_id FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Pengajuan pencairan tidak ditemukan';
  END IF;

  v_was_approved := w.status IN ('Berhasil', 'Disetujui');
  v_amount := GREATEST(COALESCE(w.amount, 0), 0);

  IF v_was_approved AND v_amount > 0 THEN
    v_email := lower(trim(w.buzzer_email));

    SELECT balance INTO v_balance
    FROM public.buzzer_wallets
    WHERE lower(trim(buzzer_email)) = v_email
    FOR UPDATE;

    IF FOUND THEN
      UPDATE public.buzzer_wallets
      SET balance = COALESCE(v_balance, 0) + v_amount,
          updated_at = now()
      WHERE lower(trim(buzzer_email)) = v_email;

      INSERT INTO public.finance_activity (type, title, description, amount, ref_table, ref_id)
      VALUES (
        'buzzer',
        'Pembatalan Pencairan Saldo',
        'Riwayat pencairan dihapus, saldo Rp ' || to_char(v_amount, 'FM999G999G999G999') || ' dikembalikan',
        v_amount,
        'withdrawals',
        p_withdrawal_id::text
      );
    END IF;
  END IF;

  DELETE FROM public.withdrawals WHERE id = p_withdrawal_id;
END;
$$;

-- ---------------------------------------------------------------------
-- 5. Hak akses (mengikuti pola RPC lain di proyek ini)
-- ---------------------------------------------------------------------REVOKE ALL ON FUNCTION public.approve_withdrawal(uuid, text, text) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.reject_withdrawal(uuid, text) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.edit_withdrawal(uuid, text, numeric, text, text, text) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.delete_withdrawal(uuid) FROM PUBLIC;

GRANT EXECUTE ON FUNCTION public.approve_withdrawal(uuid, text, text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.reject_withdrawal(uuid, text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.edit_withdrawal(uuid, text, numeric, text, text, text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.delete_withdrawal(uuid) TO anon, authenticated;

-- ---------------------------------------------------------------------
-- 6. Audit sekali jalan: pastikan tidak ada saldo minus
-- ---------------------------------------------------------------------
DO $$
DECLARE
  bad record;
BEGIN
  FOR bad IN
    SELECT buzzer_email, balance FROM public.buzzer_wallets WHERE balance < 0
  LOOP
    RAISE WARNING 'Saldo minus terdeteksi: % = %', bad.buzzer_email, bad.balance;
  END LOOP;
END;
$$;

-- Pastikan PostgREST memuat ulang daftar fungsi agar RPC langsung dikenali.
NOTIFY pgrst, 'reload schema';
