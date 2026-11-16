import { useEffect, useState, useCallback, useId } from "react";
import { supabase } from "@/integrations/supabase/client";
import { notifyPayoutUpdate } from "@/lib/buzzer-notification-store";
import { getCachedRows, isCacheFresh, loadCachedRows } from "@/lib/query-cache";

export type PaymentStatus = "Pending" | "Menunggu Pembayaran" | "Menunggu Verifikasi" | "Berhasil" | "Lunas" | "Gagal" | "Refund";
export type WithdrawalStatus = "Menunggu" | "Disetujui" | "Diproses" | "Berhasil" | "Ditolak";
export type CampaignType =
  | "TikTok" | "Instagram" | "X (Twitter)" | "Facebook" | "YouTube"
  | "LinkedIn" | "Threads" | "Telegram";

export type Payment = {
  id: string;
  campaign_id: string | null;
  invoice_no: string;
  customer_name: string;
  customer_email: string | null;
  campaign_name: string;
  campaign_type: CampaignType;
  method: string;
  amount: number;
  price_per_buzzer?: number | null;
  buzzer_count?: number | null;
  total_amount?: number | null;
  buzzer_cost: number;
  fee: number;
  status: PaymentStatus;
  note: string | null;
  proof_url: string | null;
  rejection_reason: string | null;
  verified_at: string | null;
  verified_by: string | null;
  paid_at: string | null;
  created_at: string;
  updated_at: string;
};

export type Withdrawal = {
  id: string;
  buzzer_name: string;
  buzzer_email: string;
  amount: number;
  method: string;
  account_no: string;
  status: WithdrawalStatus;
  proof_url: string | null;
  admin_note: string | null;
  requested_at: string;
  approved_at: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
};

export type BuzzerWallet = {
  buzzer_email: string;
  buzzer_name: string;
  balance: number;
  pending_balance: number;
  platform: CampaignType | null;
  followers: number;
  rating: number;
  campaigns_completed: number;
  online: boolean;
  avatar_url: string | null;
  updated_at: string;
};

export type CustomerAccount = {
  email: string;
  name: string;
  avatar_url: string | null;
  active: boolean;
  campaigns_count: number;
  active_campaigns: number;
  total_spent: number;
  updated_at: string;
};

export type FinanceActivity = {
  id: string;
  type: string;
  title: string;
  description: string | null;
  amount: number | null;
  ref_table: string | null;
  ref_id: string | null;
  link: string | null;
  created_at: string;
};

export type FinanceNotification = {
  id: string;
  category: string;
  title: string;
  body: string | null;
  link: string | null;
  read_at: string | null;
  created_at: string;
};

let realtimeListSeq = 0;

function useRealtimeList<T>(
  table: string,
  order: { column: string; ascending: boolean },
  rpcName?: string,
): { data: T[]; loading: boolean; refetch: () => Promise<void> } {
  const instanceId = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const [channelKey] = useState(() => `${table}-${instanceId}-${++realtimeListSeq}`);
  const cacheKey = rpcName ? `rpc:${rpcName}` : `${table}:${order.column}:${order.ascending}`;
  const [data, setData] = useState<T[]>(() => getCachedRows<T>(cacheKey) ?? []);
  const [loading, setLoading] = useState(() => !getCachedRows<T>(cacheKey));
  const [, setError] = useState<unknown>(null);

  const fetchAll = useCallback(async (options?: { silent?: boolean }) => {
    if (!options?.silent) setLoading(true);
    setError(null);
    try {
      const rows = await loadCachedRows<T>(cacheKey, async () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const client = supabase as any;
        const result = rpcName
          ? await client.rpc(rpcName)
          : await client.from(table).select("*").order(order.column, { ascending: order.ascending }).limit(500);
        const { data: rows, error: queryError } = result;
        if (queryError) throw queryError;
        return (rows as T[]) ?? [];
      });
      setData(rows);
    } catch (queryError) {
      console.error(`[Supabase] Failed to load ${table}:`, queryError);
      setError(queryError);
      if (!getCachedRows<T>(cacheKey)) setData([]);
    } finally {
      setLoading(false);
    }
  }, [table, order.column, order.ascending, rpcName, cacheKey]);

  useEffect(() => {
    const hasCache = Boolean(getCachedRows<T>(cacheKey));
    if (!hasCache) {
      void fetchAll();
    } else if (!isCacheFresh(cacheKey)) {
      void fetchAll({ silent: true });
    }
    const ch = supabase
      .channel(`rt-${channelKey}`)
      .on("postgres_changes", { event: "*", schema: "public", table }, () => {
        void fetchAll({ silent: true });
      })
      .subscribe();
    return () => {
      void supabase.removeChannel(ch);
    };
  }, [table, fetchAll, channelKey, cacheKey]);

  const refetch = useCallback(() => fetchAll(), [fetchAll]);
  return { data, loading, refetch };
}

export const usePayments = () =>
  useRealtimeList<Payment>("payments", { column: "created_at", ascending: false });
export const useWithdrawals = () =>
  useRealtimeList<Withdrawal>("withdrawals", { column: "requested_at", ascending: false });
export const useBuzzerWallets = () =>
  useRealtimeList<BuzzerWallet>("buzzer_wallets", { column: "balance", ascending: false });
export const useCustomerAccounts = () =>
  useRealtimeList<CustomerAccount>("customer_accounts", { column: "total_spent", ascending: false });
export const useFinanceActivity = () =>
  useRealtimeList<FinanceActivity>("finance_activity", { column: "created_at", ascending: false });
export const useFinanceNotifications = () =>
  useRealtimeList<FinanceNotification>("finance_notifications", { column: "created_at", ascending: false });

import {
  updateWithdrawalStatus as updateLocalWithdrawalStatus,
  deleteWithdrawal as deleteLocalWithdrawal,
  editWithdrawal as editLocalWithdrawal,
} from "@/lib/buzzer-store";

/**
 * Deteksi RPC yang belum ada di database (migration belum dijalankan).
 * Dipakai agar aplikasi tetap jalan dengan jalur lama saat deploy
 * mendahului migration.
 */
function isMissingRpc(error: any): boolean {
  const code = String(error?.code ?? "");
  const message = String(error?.message ?? "").toLowerCase();
  return (
    code === "42883" ||
    code === "PGRST202" ||
    message.includes("could not find the function")
  );
}

const LEGACY_RPC_WARNING =
  "[pencairan] RPC atomik belum tersedia di database — memakai jalur lama. " +
  "Jalankan migration 20261112010000_atomic_withdrawal_rpc.sql.";

/**
 * Ubah status pencairan. Persetujuan & penolakan diproses lewat RPC atomik
 * (`approve_withdrawal` / `reject_withdrawal`) agar saldo tidak pernah
 * terpotong ganda maupun menjadi negatif.
 *
 * Sejak Fase 1, seluruh jalur ini melewati server function admin — client
 * tidak lagi menulis langsung ke tabel `withdrawals` / `buzzer_wallets`.
 */
export async function updateWithdrawalStatus(
  id: string,
  status: WithdrawalStatus,
  adminNote?: string,
  proofUrl?: string,
) {
  const approved = status === "Berhasil" || status === "Disetujui";

  if (approved) {
    const { adminApproveWithdrawalFn } = await import("./admin.functions");
    await adminApproveWithdrawalFn({
      data: { withdrawalId: id, note: adminNote, proofUrl },
    });
  } else if (status === "Ditolak") {
    const { adminRejectWithdrawalFn } = await import("./admin.functions");
    await adminRejectWithdrawalFn({
      data: { withdrawalId: id, reason: adminNote ?? "" },
    });
  } else {
    const { adminEditWithdrawalFn } = await import("./admin.functions");
    await adminEditWithdrawalFn({
      data: { withdrawalId: id, status },
    });
  }

  try {
    const { data: w } = await supabase
      .from("withdrawals")
      .select("buzzer_email, amount")
      .eq("id", id)
      .maybeSingle();

    const emailNorm = w?.buzzer_email ? w.buzzer_email.trim().toLowerCase() : "";
    const amount = Number(w?.amount || 0);

    if (emailNorm) {
      // Sync ke local store buzzer (sumber kebenaran saldo tetap database).
      try {
        updateLocalWithdrawalStatus(emailNorm, id, status, adminNote, proofUrl);
      } catch (errLocal) {
        console.warn("Gagal update local withdrawal status:", errLocal);
      }

      // Notifikasi ke buzzer
      void notifyPayoutUpdate({
        buzzerEmail: emailNorm,
        amount,
        status,
        withdrawalId: id,
        adminNote,
      });
    }
  } catch (err) {
    console.warn("Gagal memproses notifikasi payout:", err);
  }
}

export async function deleteWithdrawalRecord(id: string, buzzerEmail?: string) {
  // Baca data sebelum dihapus: dibutuhkan untuk refund (jalur lama) & mirror lokal.
  const { data: w } = await supabase
    .from("withdrawals")
    .select("buzzer_email, amount, status")
    .eq("id", id)
    .maybeSingle();

  const emailNorm = (w?.buzzer_email || buzzerEmail || "").trim().toLowerCase();

  const { adminDeleteWithdrawalFn } = await import("./admin.functions");
  await adminDeleteWithdrawalFn({ data: { withdrawalId: id } });

  if (emailNorm) {
    try {
      deleteLocalWithdrawal(emailNorm, id);
    } catch (e) {
      console.warn("deleteLocalWithdrawal error:", e);
    }
  }
}

type WithdrawalEditPatch = {
  status?: WithdrawalStatus;
  amount?: number;
  method?: string;
  account_no?: string;
  admin_note?: string;
};

/** Jalur lama edit pencairan sudah dihapus pada Fase 1. */
export async function editWithdrawalRecord(
  id: string,
  patch: WithdrawalEditPatch,
  buzzerEmail?: string
) {
  const { data: current } = await supabase
    .from("withdrawals")
    .select("buzzer_email, amount, status")
    .eq("id", id)
    .maybeSingle();

  const emailNorm = (current?.buzzer_email || buzzerEmail || "").trim().toLowerCase();

  const { adminEditWithdrawalFn } = await import("./admin.functions");
  await adminEditWithdrawalFn({
    data: {
      withdrawalId: id,
      status: patch.status,
      amount: patch.amount,
      method: patch.method,
      accountNo: patch.account_no,
      adminNote: patch.admin_note,
    },
  });


  if (emailNorm) {
    try {
      editLocalWithdrawal(emailNorm, id, {
        status: patch.status as any,
        amount: patch.amount,
        method: patch.method,
        accountNo: patch.account_no,
        adminNote: patch.admin_note,
      });
    } catch (e) {
      console.warn("editLocalWithdrawal error:", e);
    }
  }
}

export async function uploadWithdrawalProof(id: string, url: string, adminNote?: string) {
  return updateWithdrawalStatus(id, "Berhasil", adminNote, url);
}

export async function updatePaymentStatus(id: string, status: PaymentStatus) {
  if (status === "Berhasil" || status === "Lunas") {
    await approvePayment(id);
    return;
  }
  if (status === "Gagal") {
    throw new Error("Gunakan rejectPayment(id, alasan) untuk menolak pembayaran.");
  }
  const { adminUpdatePaymentFn } = await import("./admin.functions");
  await adminUpdatePaymentFn({ data: { paymentId: id, status } });
}

export async function updatePayment(id: string, updates: Partial<Payment>) {
  const { adminUpdatePaymentFn } = await import("./admin.functions");
  await adminUpdatePaymentFn({
    data: {
      paymentId: id,
      amount: updates.amount,
      method: updates.method,
      note: updates.note,
      status: updates.status,
    },
  });
}

export async function deletePayment(id: string) {
  const { adminDeletePaymentFn } = await import("./admin.functions");
  await adminDeletePaymentFn({ data: { paymentId: id } });
}

export async function approvePayment(id: string, _adminEmail = "admin") {
  const { adminApprovePaymentFn } = await import("./admin.functions");
  await adminApprovePaymentFn({ data: { paymentId: id } });
}

export async function rejectPayment(id: string, reason: string, _adminEmail = "admin") {
  const cleanReason = reason.trim();
  if (!cleanReason) throw new Error("Alasan penolakan wajib diisi.");
  const { adminRejectPaymentFn } = await import("./admin.functions");
  await adminRejectPaymentFn({ data: { paymentId: id, reason: cleanReason } });
}

export async function markNotificationRead(id: string) {
  await (supabase as any).rpc("mark_finance_notification_read", { p_id: id });
}

export async function markAllNotificationsRead() {
  await (supabase as any).rpc("mark_all_finance_notifications_read");
}

export const formatIDR = (n: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);

export const formatDate = (iso: string) =>
  new Date(iso).toLocaleString("id-ID", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });

/* ---------- Aggregation helpers ---------- */

export type FinanceRange = "today" | "week" | "month" | "year" | "custom";

export function filterByRange<T extends { created_at: string; paid_at?: string | null }>(
  items: T[],
  range: FinanceRange,
  custom?: { from: Date; to: Date },
  useField: "created_at" | "paid_at" = "created_at",
): T[] {
  const now = new Date();
  let from: Date;
  let to: Date = now;
  switch (range) {
    case "today":
      from = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      break;
    case "week": {
      const d = new Date(now);
      d.setDate(d.getDate() - 7);
      from = d;
      break;
    }
    case "month":
      from = new Date(now.getFullYear(), now.getMonth(), 1);
      break;
    case "year":
      from = new Date(now.getFullYear(), 0, 1);
      break;
    case "custom":
      from = custom?.from ?? new Date(0);
      to = custom?.to ?? now;
      break;
  }
  return items.filter((it) => {
    const raw = (useField === "paid_at" ? it.paid_at : it.created_at) ?? it.created_at;
    const t = new Date(raw).getTime();
    return t >= from.getTime() && t <= to.getTime();
  });
}

export function groupByDay<T extends { created_at: string; paid_at?: string | null }>(
  items: T[],
  valueFn: (t: T) => number,
  days = 14,
  useField: "created_at" | "paid_at" = "created_at",
): { date: string; value: number }[] {
  const now = new Date();
  const map = new Map<string, number>();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    map.set(d.toISOString().slice(0, 10), 0);
  }
  for (const it of items) {
    const raw = (useField === "paid_at" ? it.paid_at : it.created_at) ?? it.created_at;
    const key = new Date(raw).toISOString().slice(0, 10);
    if (map.has(key)) map.set(key, (map.get(key) ?? 0) + valueFn(it));
  }
  return Array.from(map.entries()).map(([date, value]) => ({
    date: date.slice(5),
    value,
  }));
}
