import { useEffect, useState, useSyncExternalStore } from "react";
import { isSupabaseConfigured, supabase } from "@/integrations/supabase/client";

export type AdminBankAccount = {
  id: string;
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export const POPULAR_BANKS = [
  "BCA",
  "BRI",
  "Mandiri",
  "BNI",
  "BSI",
  "CIMB Niaga",
  "Permata",
  "Danamon",
  "Seabank",
  "Bank Jago",
  "BTPN / Jenius",
];

export const DEFAULT_ADMIN_BANKS: AdminBankAccount[] = [
  {
    id: "bank-bca-default",
    bankName: "BCA",
    accountNumber: "8830192831",
    accountHolder: "PT BuzzConnect Indonesia",
    isActive: true,
    createdAt: "2026-09-01T00:00:00Z",
    updatedAt: "2026-09-01T00:00:00Z",
  },
  {
    id: "bank-bri-default",
    bankName: "BRI",
    accountNumber: "020601002345501",
    accountHolder: "PT BuzzConnect Indonesia",
    isActive: true,
    createdAt: "2026-09-01T00:00:00Z",
    updatedAt: "2026-09-01T00:00:00Z",
  },
  {
    id: "bank-mandiri-default",
    bankName: "Mandiri",
    accountNumber: "1370019283741",
    accountHolder: "PT BuzzConnect Indonesia",
    isActive: true,
    createdAt: "2026-09-01T00:00:00Z",
    updatedAt: "2026-09-01T00:00:00Z",
  },
  {
    id: "bank-bni-default",
    bankName: "BNI",
    accountNumber: "0928374615",
    accountHolder: "PT BuzzConnect Indonesia",
    isActive: true,
    createdAt: "2026-09-01T00:00:00Z",
    updatedAt: "2026-09-01T00:00:00Z",
  },
];

const STORAGE_KEY = "buzz_admin_bank_accounts";
const EVENT_KEY = "buzz_admin_bank_accounts_change";

let CACHE: AdminBankAccount[] = [];
let VERSION = 0;
const listeners = new Set<() => void>();

function notify() {
  VERSION += 1;
  listeners.forEach((l) => l());
}

function emit() {
  notify();
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(EVENT_KEY));
  }
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => { listeners.delete(cb); };
}

function loadFromLocal(): AdminBankAccount[] {
  if (typeof window === "undefined") return DEFAULT_ADMIN_BANKS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    /* noop */
  }
  return DEFAULT_ADMIN_BANKS;
}

function saveToLocal(banks: AdminBankAccount[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(banks));
  } catch {
    /* noop */
  }
}

// Initialize cache
if (typeof window !== "undefined") {
  CACHE = loadFromLocal();
} else {
  CACHE = DEFAULT_ADMIN_BANKS;
}

/**
 * Fetch bank accounts from Supabase (or fallback storage in app_accounts/local).
 */
export async function fetchAdminBankAccounts(): Promise<AdminBankAccount[]> {
  if (!isSupabaseConfigured() || !supabase) {
    return CACHE;
  }

  try {
    // 1. Try querying dedicated table admin_bank_accounts
    const { data, error } = await supabase
      .from("admin_bank_accounts" as any)
      .select("*")
      .order("created_at", { ascending: true });

    if (!error && Array.isArray(data) && data.length > 0) {
      const mapped: AdminBankAccount[] = data.map((row: any) => ({
        id: String(row.id),
        bankName: String(row.bank_name || row.bankName),
        accountNumber: String(row.account_number || row.accountNumber),
        accountHolder: String(row.account_holder || row.accountHolder),
        isActive: Boolean(row.is_active ?? row.isActive ?? true),
        createdAt: row.created_at || new Date().toISOString(),
        updatedAt: row.updated_at || new Date().toISOString(),
      }));
      CACHE = mapped;
      saveToLocal(mapped);
      emit();
      return mapped;
    }

    // 2. If table not found or empty, check app_accounts admin row (resilient fallback)
    const { data: adminRow } = await supabase
      .from("app_accounts")
      .select("bio")
      .eq("role", "admin")
      .maybeSingle();

    if (adminRow?.bio && adminRow.bio.startsWith("[{") && adminRow.bio.includes("bankName")) {
      const parsed = JSON.parse(adminRow.bio);
      if (Array.isArray(parsed) && parsed.length > 0) {
        CACHE = parsed;
        saveToLocal(parsed);
        emit();
        return parsed;
      }
    }

    // If still empty, seed default accounts to adminRow if possible
    if (!adminRow?.bio || !adminRow.bio.includes("bankName")) {
      const defaults = DEFAULT_ADMIN_BANKS;
      void supabase
        .from("app_accounts")
        .update({ bio: JSON.stringify(defaults) })
        .eq("role", "admin");
      CACHE = defaults;
      saveToLocal(defaults);
      emit();
      return defaults;
    }
  } catch (err) {
    console.warn("fetchAdminBankAccounts fallback:", err);
  }

  return CACHE;
}

/**
 * Persist bank accounts list to Supabase and cache.
 */
async function syncAccountsToDatabase(accounts: AdminBankAccount[]) {
  CACHE = accounts;
  saveToLocal(accounts);
  emit();

  if (!isSupabaseConfigured() || !supabase) return;

  try {
    // 1. Try upserting to admin_bank_accounts table
    const dbRows = accounts.map((a) => ({
      id: a.id,
      bank_name: a.bankName,
      account_number: a.accountNumber,
      account_holder: a.accountHolder,
      is_active: a.isActive,
      updated_at: new Date().toISOString(),
    }));

    const { error } = await supabase
      .from("admin_bank_accounts" as any)
      .upsert(dbRows as any, { onConflict: "id" });

    // 2. Also keep resilient fallback in app_accounts admin row
    await supabase
      .from("app_accounts")
      .update({ bio: JSON.stringify(accounts) })
      .eq("role", "admin");

    if (error) {
      console.warn("admin_bank_accounts table sync warning (using app_accounts fallback):", error.message);
    }
  } catch (err) {
    console.warn("syncAccountsToDatabase error:", err);
  }
}

export async function createAdminBankAccount(input: {
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  isActive?: boolean;
}): Promise<AdminBankAccount> {
  const newAccount: AdminBankAccount = {
    id: `bank-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    bankName: input.bankName.trim(),
    accountNumber: input.accountNumber.trim(),
    accountHolder: input.accountHolder.trim(),
    isActive: input.isActive ?? true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const next = [...CACHE, newAccount];
  await syncAccountsToDatabase(next);
  return newAccount;
}

export async function updateAdminBankAccount(
  id: string,
  patch: Partial<Omit<AdminBankAccount, "id" | "createdAt">>
): Promise<boolean> {
  const target = CACHE.find((a) => a.id === id);
  if (!target) return false;

  const next = CACHE.map((a) =>
    a.id === id
      ? {
          ...a,
          ...patch,
          updatedAt: new Date().toISOString(),
        }
      : a
  );

  await syncAccountsToDatabase(next);
  return true;
}

export async function deleteAdminBankAccount(id: string): Promise<boolean> {
  const next = CACHE.filter((a) => a.id !== id);
  await syncAccountsToDatabase(next);

  if (isSupabaseConfigured() && supabase) {
    try {
      await supabase.from("admin_bank_accounts" as any).delete().eq("id", id);
    } catch {
      /* noop */
    }
  }

  return true;
}

export async function toggleAdminBankAccount(id: string, isActive: boolean): Promise<boolean> {
  return updateAdminBankAccount(id, { isActive });
}

export function useAdminBankAccounts() {
  useSyncExternalStore(subscribe, () => VERSION, () => 0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    void fetchAdminBankAccounts().finally(() => {
      if (active) setLoading(false);
    });

    const handler = () => {
      CACHE = loadFromLocal();
      // Jangan dispatch event lagi: event ini sendiri yang memicu handler,
      // sehingga memanggil emit() di sini menyebabkan rekursi tanpa henti.
      notify();
    };
    window.addEventListener(EVENT_KEY, handler);
    window.addEventListener("storage", handler);

    return () => {
      active = false;
      window.removeEventListener(EVENT_KEY, handler);
      window.removeEventListener("storage", handler);
    };
  }, []);

  const activeAccounts = CACHE.filter((a) => a.isActive);

  return {
    accounts: CACHE,
    activeAccounts,
    loading,
    addAccount: createAdminBankAccount,
    updateAccount: updateAdminBankAccount,
    deleteAccount: deleteAdminBankAccount,
    toggleActive: toggleAdminBankAccount,
    refetch: fetchAdminBankAccounts,
  };
}
