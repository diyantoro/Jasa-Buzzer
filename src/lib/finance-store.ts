import { useEffect, useState, useCallback, useId } from "react";
import { supabase } from "@/integrations/supabase/client";
import { notifyPayoutUpdate } from "@/lib/buzzer-notification-store";

export type PaymentStatus = "Pending" | "Menunggu Pembayaran" | "Menunggu Verifikasi" | "Berhasil" | "Lunas" | "Gagal" | "Refund";
export type WithdrawalStatus = "Menunggu" | "Disetujui" | "Diproses" | "Berhasil" | "Ditolak";
export type CampaignType = "TikTok" | "Instagram" | "X (Twitter)" | "Facebook" | "YouTube";

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
): { data: T[]; loading: boolean; refetch: () => void } {
  const instanceId = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const [channelKey] = useState(() => `${table}-${instanceId}-${++realtimeListSeq}`);
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [, setError] = useState<unknown>(null);

  const fetchAll = useCallback(async () => {
    setError(null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const client = supabase as any;
    const result = rpcName
      ? await client.rpc(rpcName)
      : await client.from(table).select("*").order(order.column, { ascending: order.ascending }).limit(500);
    const { data: rows, error: queryError } = result;
    if (queryError) {
      console.error(`[Supabase] Failed to load ${table}:`, queryError);
      setError(queryError);
      setData([]);
      setLoading(false);
      return;
    }
    setData((rows as T[]) ?? []);
    setLoading(false);
  }, [table, order.column, order.ascending, rpcName]);

  useEffect(() => {
    void fetchAll();
    const ch = supabase
      .channel(`rt-${channelKey}`)
      .on("postgres_changes", { event: "*", schema: "public", table }, () => {
        void fetchAll();
      })
      .subscribe();
    return () => {
      void supabase.removeChannel(ch);
    };
  }, [table, fetchAll, channelKey]);

  return { data, loading, refetch: fetchAll };
}

export const usePayments = () =>
  useRealtimeList<Payment>("payments", { column: "created_at", ascending: false }, "list_admin_payments");
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

export async function updateWithdrawalStatus(
  id: string,
  status: WithdrawalStatus,
  adminNote?: string,
  proofUrl?: string,
) {
  const now = new Date().toISOString();
  const patch: {
    status: WithdrawalStatus;
    admin_note?: string;
    proof_url?: string;
    approved_at?: string;
    completed_at?: string;
    updated_at: string;
  } = {
    status,
    updated_at: now,
  };
  if (adminNote !== undefined) patch.admin_note = adminNote;
  if (proofUrl !== undefined) patch.proof_url = proofUrl;
  if (status === "Berhasil" || status === "Disetujui") {
    patch.approved_at = now;
    patch.completed_at = now;
  }

  const { error } = await supabase.from("withdrawals").update(patch).eq("id", id);
  if (error) {
    console.error("Gagal update status withdrawal di Supabase:", error);
  }

  try {
    const { data: w } = await supabase
      .from("withdrawals")
      .select("buzzer_email, amount")
      .eq("id", id)
      .maybeSingle();

    const emailNorm = w?.buzzer_email ? w.buzzer_email.trim().toLowerCase() : "";
    const amount = Number(w?.amount || 0);

    // Jika disetujui / berhasil oleh admin, baru potong saldo dompet buzzer di Supabase
    if ((status === "Berhasil" || status === "Disetujui") && emailNorm && amount > 0) {
      const { data: wallet } = await supabase
        .from("buzzer_wallets")
        .select("balance")
        .eq("buzzer_email", emailNorm)
        .maybeSingle();

      if (wallet) {
        const newBalance = Math.max(0, Number(wallet.balance || 0) - amount);
        await supabase
          .from("buzzer_wallets")
          .update({ balance: newBalance, updated_at: now })
          .eq("buzzer_email", emailNorm);
      }
    }

    if (emailNorm) {
      // Sync ke local store buzzer
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
    console.warn("Gagal memproses notifikasi atau refund payout:", err);
  }
}

export async function deleteWithdrawalRecord(id: string, buzzerEmail?: string) {
  const { data: w } = await supabase
    .from("withdrawals")
    .select("buzzer_email, amount, status")
    .eq("id", id)
    .maybeSingle();

  const emailNorm = (w?.buzzer_email || buzzerEmail || "").trim().toLowerCase();
  const wasApproved = w?.status === "Berhasil" || w?.status === "Disetujui";
  const amount = Number(w?.amount || 0);

  // Jika sebelumnya disetujui (saldo sudah dipotong), kembalikan saldo ke dompet buzzer di Supabase
  if (wasApproved && emailNorm && amount > 0) {
    const { data: wallet } = await supabase
      .from("buzzer_wallets")
      .select("balance")
      .eq("buzzer_email", emailNorm)
      .maybeSingle();
    if (wallet) {
      await supabase
        .from("buzzer_wallets")
        .update({ balance: Number(wallet.balance || 0) + amount, updated_at: new Date().toISOString() })
        .eq("buzzer_email", emailNorm);
    }
  }

  await supabase.from("withdrawals").delete().eq("id", id);

  if (emailNorm) {
    try {
      deleteLocalWithdrawal(emailNorm, id);
    } catch (e) {
      console.warn("deleteLocalWithdrawal error:", e);
    }
  }
}

export async function editWithdrawalRecord(
  id: string,
  patch: {
    status?: WithdrawalStatus;
    amount?: number;
    method?: string;
    account_no?: string;
    admin_note?: string;
  },
  buzzerEmail?: string
) {
  const { data: current } = await supabase
    .from("withdrawals")
    .select("buzzer_email, amount, status")
    .eq("id", id)
    .maybeSingle();

  const emailNorm = (current?.buzzer_email || buzzerEmail || "").trim().toLowerCase();
  const prevStatus = current?.status;
  const newStatus = patch.status ?? prevStatus;
  const prevAmount = Number(current?.amount || 0);
  const newAmount = patch.amount !== undefined ? Number(patch.amount) : prevAmount;

  const now = new Date().toISOString();
  const updatePayload: Record<string, any> = { updated_at: now };
  if (patch.status !== undefined) updatePayload.status = patch.status;
  if (patch.amount !== undefined) updatePayload.amount = patch.amount;
  if (patch.method !== undefined) updatePayload.method = patch.method;
  if (patch.account_no !== undefined) updatePayload.account_no = patch.account_no;
  if (patch.admin_note !== undefined) updatePayload.admin_note = patch.admin_note;
  if (patch.status === "Berhasil" || patch.status === "Disetujui") {
    updatePayload.approved_at = now;
    updatePayload.completed_at = now;
  }

  await supabase.from("withdrawals").update(updatePayload as any).eq("id", id);

  const wasApproved = prevStatus === "Berhasil" || prevStatus === "Disetujui";
  const isApproved = newStatus === "Berhasil" || newStatus === "Disetujui";

  if (emailNorm) {
    if (!wasApproved && isApproved && newAmount > 0) {
      const { data: wallet } = await supabase.from("buzzer_wallets").select("balance").eq("buzzer_email", emailNorm).maybeSingle();
      if (wallet) {
        await supabase.from("buzzer_wallets").update({ balance: Math.max(0, Number(wallet.balance || 0) - newAmount), updated_at: now }).eq("buzzer_email", emailNorm);
      }
    } else if (wasApproved && !isApproved && prevAmount > 0) {
      const { data: wallet } = await supabase.from("buzzer_wallets").select("balance").eq("buzzer_email", emailNorm).maybeSingle();
      if (wallet) {
        await supabase.from("buzzer_wallets").update({ balance: Number(wallet.balance || 0) + prevAmount, updated_at: now }).eq("buzzer_email", emailNorm);
      }
    }

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
  const { error } = await supabase.from("payments").update({ status }).eq("id", id);
  if (error) throw error;
}

export async function updatePayment(id: string, updates: Partial<Payment>) {
  const { error } = await supabase.from("payments").update(updates as any).eq("id", id);
  if (error) throw error;
}

export async function deletePayment(id: string) {
  const { error } = await supabase.from("payments").delete().eq("id", id);
  if (error) throw error;
}

export async function approvePayment(id: string, adminEmail = "admin") {
  const { error } = await (supabase as any).rpc("approve_campaign_payment", {
    p_payment_id: id,
    p_admin_email: adminEmail,
  });
  if (error) throw error;
}

export async function rejectPayment(id: string, reason: string, adminEmail = "admin") {
  const cleanReason = reason.trim();
  if (!cleanReason) throw new Error("Alasan penolakan wajib diisi.");
  const { error } = await (supabase as any).rpc("reject_campaign_payment", {
    p_payment_id: id,
    p_reason: cleanReason,
    p_admin_email: adminEmail,
  });
  if (error) throw error;
}

export async function markNotificationRead(id: string) {
  await supabase.from("finance_notifications").update({ read_at: new Date().toISOString() }).eq("id", id);
}

export async function markAllNotificationsRead() {
  await supabase
    .from("finance_notifications")
    .update({ read_at: new Date().toISOString() })
    .is("read_at", null);
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
