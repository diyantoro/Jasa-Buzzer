import { useCallback, useEffect, useId, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { calculateCampaignJobSplit, useCompletedCampaignJobs } from "@/lib/campaign-store";
import { usePayments } from "@/lib/finance-store";

export type AdminWallet = {
  id: string;
  balance: number; // Keuntungan admin dari job selesai
  total_revenue: number; // Total omset kotor dari job yang selesai dikerjakan buzzer
  total_buzzer_payout: number; // Total bayaran buzzer dari job selesai
  total_incoming: number; // Total pembayaran customer yang disetujui (Lunas/Berhasil)
  completed_jobs_count: number;
  updated_at: string;
};

export type AdminWithdrawal = {
  id: string;
  date: string;
  amount: number;
  method: string;
  provider: string;
  account_no: string;
  status: "Berhasil";
  created_at: string;
};

const WALLET_STORAGE_KEY = "buzzconnect_admin_wallet_cache";
const WITHDRAWALS_STORAGE_KEY = "buzzhub_admin_withdrawals";
const UPDATE_EVENT = "buzzhub:admin_wallet_updated";

function getCachedWallet(): AdminWallet {
  try {
    const raw = localStorage.getItem(WALLET_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (typeof parsed === "object" && parsed !== null && typeof parsed.total_revenue === "number") {
        return parsed as AdminWallet;
      }
    }
  } catch {
    // Ignore localStorage errors
  }
  return {
    id: "primary",
    balance: 0,
    total_revenue: 0,
    total_buzzer_payout: 0,
    total_incoming: 0,
    completed_jobs_count: 0,
    updated_at: new Date().toISOString(),
  };
}

function setCachedWallet(wallet: AdminWallet) {
  try {
    localStorage.setItem(WALLET_STORAGE_KEY, JSON.stringify(wallet));
  } catch {
    // Ignore localStorage errors
  }
}

function getCachedWithdrawals(): AdminWithdrawal[] {
  try {
    const raw = localStorage.getItem(WITHDRAWALS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed as AdminWithdrawal[];
      }
    }
  } catch {
    // Ignore localStorage errors
  }
  return [];
}

function setCachedWithdrawals(list: AdminWithdrawal[]) {
  try {
    localStorage.setItem(WITHDRAWALS_STORAGE_KEY, JSON.stringify(list));
  } catch {
    // Ignore localStorage errors
  }
}

let adminWalletSeq = 0;

export function useAdminWallet() {
  const instanceId = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const [channelId] = useState(() => `${instanceId}-${++adminWalletSeq}`);
  const [wallet, setWallet] = useState<AdminWallet>(getCachedWallet);
  const [withdrawals, setWithdrawals] = useState<AdminWithdrawal[]>(getCachedWithdrawals);
  const [loading, setLoading] = useState(true);

  // Fallback direct calculations from all completed jobs & payments without truncation
  const { data: completedJobs, loading: jobsLoading } = useCompletedCampaignJobs();
  const { data: payments, loading: paymentsLoading } = usePayments();

  const computedWallet = useMemo<AdminWallet>(() => {
    let grossTotal = 0;
    let adminProfit = 0;
    let buzzerPayout = 0;

    for (const job of completedJobs) {
      const split = calculateCampaignJobSplit(job);
      grossTotal += split.total;
      adminProfit += split.adminShare;
      buzzerPayout += split.buzzerShare;
    }

    const settledPayments = payments.filter((p) => ["Berhasil", "Lunas"].includes(p.status));
    const incoming = settledPayments.reduce((sum, p) => sum + Number(p.amount || 0), 0);

    return {
      id: "primary",
      balance: adminProfit,
      total_revenue: grossTotal,
      total_buzzer_payout: buzzerPayout,
      total_incoming: incoming,
      completed_jobs_count: completedJobs.length,
      updated_at: new Date().toISOString(),
    };
  }, [completedJobs, payments]);

  const fetchWithdrawals = useCallback(async () => {
    try {
      const { data, error } = await (supabase as any)
        .from("admin_withdrawals")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && Array.isArray(data)) {
        const mapped: AdminWithdrawal[] = data.map((item: any) => ({
          id: item.id,
          date: item.created_at ? item.created_at.slice(0, 10) : new Date().toISOString().slice(0, 10),
          amount: Number(item.amount || 0),
          method: item.method || "Transfer Bank",
          provider: item.provider || "Bank",
          account_no: item.account_no || "",
          status: "Berhasil",
          created_at: item.created_at || new Date().toISOString(),
        }));

        setWithdrawals((prev) => {
          // Merge remote with any un-synced local
          const map = new Map<string, AdminWithdrawal>();
          prev.forEach((w) => map.set(w.id, w));
          mapped.forEach((w) => map.set(w.id, w));
          const merged = Array.from(map.values()).sort(
            (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
          );
          setCachedWithdrawals(merged);
          return merged;
        });
        return;
      }
    } catch {
      // Table may not exist yet or network error, fallback to cache
    }
    setWithdrawals(getCachedWithdrawals());
  }, []);

  const fetchWallet = useCallback(async () => {
    try {
      const { data, error } = await (supabase as any)
        .from("admin_wallet")
        .select("*")
        .eq("id", "primary")
        .maybeSingle();

      if (!error && data && Number(data.total_revenue || 0) > 0) {
        const remoteWallet: AdminWallet = {
          id: data.id || "primary",
          balance: Number(data.balance || 0),
          total_revenue: Number(data.total_revenue || 0),
          total_buzzer_payout: Number(data.total_buzzer_payout || 0),
          total_incoming: Number(data.total_incoming || 0),
          completed_jobs_count: Number(data.completed_jobs_count || 0),
          updated_at: data.updated_at || new Date().toISOString(),
        };
        setWallet(remoteWallet);
        setCachedWallet(remoteWallet);
        return;
      }
    } catch {
      // Table may not exist yet or offline, continue with computed
    }

    // If remote table not available or empty, use computed wallet from completed jobs
    if (!jobsLoading && !paymentsLoading) {
      setWallet(computedWallet);
      setCachedWallet(computedWallet);

      // Best-effort attempt to persist to admin_wallet table if it exists
      void (async () => {
        try {
          await (supabase as any).from("admin_wallet").upsert({
            id: "primary",
            balance: computedWallet.balance,
            total_revenue: computedWallet.total_revenue,
            total_buzzer_payout: computedWallet.total_buzzer_payout,
            total_incoming: computedWallet.total_incoming,
            completed_jobs_count: computedWallet.completed_jobs_count,
            updated_at: new Date().toISOString(),
          });
        } catch {
          // Ignore if table not created yet
        }
      })();
    }
  }, [computedWallet, jobsLoading, paymentsLoading]);

  useEffect(() => {
    void fetchWallet();
    void fetchWithdrawals();

    const handleLocalUpdate = () => {
      setWithdrawals(getCachedWithdrawals());
      void fetchWallet();
    };
    window.addEventListener(UPDATE_EVENT, handleLocalUpdate);

    const ch = supabase
      .channel(`rt-admin-wallet-${channelId}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "admin_wallet" }, () => {
        void fetchWallet();
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "admin_withdrawals" }, () => {
        void fetchWithdrawals();
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "campaign_jobs" }, () => {
        void fetchWallet();
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "payments" }, () => {
        void fetchWallet();
      })
      .subscribe();

    return () => {
      window.removeEventListener(UPDATE_EVENT, handleLocalUpdate);
      void supabase.removeChannel(ch);
    };
  }, [fetchWallet, fetchWithdrawals, channelId]);

  useEffect(() => {
    if (jobsLoading || paymentsLoading) return;
    if (computedWallet.total_revenue > 0) {
      setWallet((prev) => {
        if (prev.total_revenue < computedWallet.total_revenue) {
          setCachedWallet(computedWallet);
          return computedWallet;
        }
        return prev;
      });
    }
    // Pastikan loading selesai walau database masih kosong, supaya dashboard
    // tidak berhenti di skeleton dan fallback data dummy bisa tampil.
    setLoading(false);
  }, [computedWallet, jobsLoading, paymentsLoading]);

  // Use the larger/most complete value between state, cache, and computed
  const effectiveWallet = useMemo<AdminWallet>(() => {
    if (computedWallet.total_revenue > wallet.total_revenue) {
      return computedWallet;
    }
    return wallet;
  }, [computedWallet, wallet]);

  const totalWithdrawn = useMemo(() => {
    return withdrawals.reduce((sum, w) => sum + (Number(w.amount) || 0), 0);
  }, [withdrawals]);

  const totalProfit = effectiveWallet.balance;
  const availableBalance = Math.max(0, totalProfit - totalWithdrawn);

  const requestWithdrawal = useCallback(async (
    amount: number,
    method: string,
    provider: string,
    accountNo: string
  ): Promise<AdminWithdrawal> => {
    const todayStr = new Date().toISOString().slice(0, 10);
    const id = `aw-${Date.now()}`;
    const newRecord: AdminWithdrawal = {
      id,
      date: todayStr,
      amount,
      method,
      provider,
      account_no: accountNo,
      status: "Berhasil",
      created_at: new Date().toISOString(),
    };

    setWithdrawals((prev) => {
      const next = [newRecord, ...prev];
      setCachedWithdrawals(next);
      return next;
    });

    window.dispatchEvent(new CustomEvent(UPDATE_EVENT));

    try {
      await (supabase as any).from("admin_withdrawals").insert({
        id: newRecord.id,
        amount: newRecord.amount,
        method: newRecord.method,
        provider: newRecord.provider,
        account_no: newRecord.account_no,
        status: newRecord.status,
        created_at: newRecord.created_at,
      });
    } catch {
      // Best-effort remote write; cached locally
    }

    return newRecord;
  }, []);

  return {
    wallet: effectiveWallet,
    totalRevenue: effectiveWallet.total_revenue,
    totalProfit,
    availableBalance,
    totalWithdrawn,
    totalBuzzerPayout: effectiveWallet.total_buzzer_payout,
    totalIncoming: effectiveWallet.total_incoming,
    completedJobsCount: effectiveWallet.completed_jobs_count,
    withdrawals,
    requestWithdrawal,
    loading: loading && jobsLoading,
    refetch: fetchWallet,
  };
}
