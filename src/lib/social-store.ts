// Store akun media sosial buzzer — sumber data: tabel `social_accounts` di database.
// Tidak ada localStorage sebagai database; cache di memori hanya untuk render.
import { useEffect, useSyncExternalStore } from "react";
import { isSupabaseConfigured, supabase } from "@/integrations/supabase/client";
import { assignLevelFromVerification } from "@/lib/buzzer-level";
import { notifySocialAccountVerified } from "@/lib/buzzer-notification-store";

export type SocialPlatform =
  | "Instagram"
  | "TikTok"
  | "Facebook"
  | "X (Twitter)"
  | "YouTube"
  | "LinkedIn"
  | "Threads"
  | "Telegram";

export type VerificationStatus = "Terverifikasi" | "Menunggu" | "Ditolak";

export type SocialAccount = {
  id: string;
  platform: SocialPlatform;
  username: string;
  accountName: string;
  profileUrl: string;
  followers: number;
  following: number;
  posts: number;
  category: string;
  bio: string;
  photoUrl?: string;
  verification: VerificationStatus;
  rejectionNote?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  pendingFollowers?: number;
  pendingProofUrl?: string;
  pendingSubmittedAt?: string;
  pendingVerification?: VerificationStatus;
  pendingRejectionNote?: string;
};

export type AdminSocialAccount = SocialAccount & {
  buzzerEmail: string;
  buzzerName: string;
};

export const SOCIAL_PLATFORMS: SocialPlatform[] = [
  "Instagram", "TikTok", "Facebook", "X (Twitter)", "YouTube", "LinkedIn", "Threads", "Telegram",
];

export function getSocialProfileUrl(account: Pick<SocialAccount, "platform" | "username" | "profileUrl">) {
  const storedUrl = (account.profileUrl || "").trim();
  if (!storedUrl) return null;
  const withProtocol = /^https?:\/\//i.test(storedUrl) ? storedUrl : "https://" + storedUrl;
  try {
    const parsed = new URL(withProtocol);
    if (!parsed.hostname || !parsed.hostname.includes(".")) {
      return null;
    }
    return withProtocol;
  } catch {
    return null;
  }
}

/* ---------------- store kecil di memori ---------------- */

type Row = {
  id: string; buzzer_email: string; buzzer_name: string; platform: string; username: string;
  account_name: string; profile_url: string; followers: number; following_count: number;
  posts: number; category: string; bio: string; photo_url: string | null;
  verification: string; rejection_note: string | null; is_active: boolean;
  created_at: string; updated_at: string;
  pending_followers: number | null; pending_proof_url: string | null; pending_submitted_at: string | null;
  pending_verification: string | null; pending_rejection_note: string | null;
};

function fromRow(r: Row): AdminSocialAccount {
  return {
    id: r.id,
    buzzerEmail: r.buzzer_email,
    buzzerName: r.buzzer_name,
    platform: r.platform as SocialPlatform,
    username: r.username,
    accountName: r.account_name,
    profileUrl: r.profile_url,
    followers: r.followers,
    following: r.following_count,
    posts: r.posts,
    category: r.category,
    bio: r.bio,
    photoUrl: r.photo_url ?? undefined,
    verification: r.verification as VerificationStatus,
    rejectionNote: r.rejection_note ?? undefined,
    isActive: r.is_active,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
    pendingFollowers: r.pending_followers ?? undefined,
    pendingProofUrl: r.pending_proof_url ?? undefined,
    pendingSubmittedAt: r.pending_submitted_at ?? undefined,
    pendingVerification: r.pending_verification as VerificationStatus | undefined,
    pendingRejectionNote: r.pending_rejection_note ?? undefined,
  };
}

let CACHE: AdminSocialAccount[] = [];
let VERSION = 0;
let loading = false;
const listeners = new Set<() => void>();
let socialRealtimeChannel: ReturnType<typeof supabase.channel> | null = null;
let socialRealtimeReady = false;

function emit() {
  VERSION += 1;
  listeners.forEach((l) => l());
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => { listeners.delete(cb); };
}

let activeSubscribers = 0;

function ensureSocialRealtime() {
  if (!isSupabaseConfigured() || !supabase || socialRealtimeReady) return;

  try {
    socialRealtimeChannel = supabase.channel("social_accounts_stream");
    socialRealtimeChannel
      .on("postgres_changes", { event: "*", schema: "public", table: "social_accounts" }, () => {
        void refreshSocialAccounts();
      })
      .subscribe();
    socialRealtimeReady = true;
  } catch {
    socialRealtimeReady = false;
  }
}

export async function refreshSocialAccounts() {
  if (typeof window === "undefined" || !isSupabaseConfigured()) return;
  loading = true;
  const { data, error } = await supabase.from("social_accounts").select("*").order("followers", { ascending: false });
  loading = false;
  if (error || !data) return;
  CACHE = (data as unknown as Row[]).map(fromRow);
  emit();
}

function useSocialData() {
  useSyncExternalStore(subscribe, () => VERSION, () => 0);
  useEffect(() => {
    if (!isSupabaseConfigured()) {
      CACHE = [];
      socialRealtimeReady = false;
      if (socialRealtimeChannel) {
        try { void supabase.removeChannel(socialRealtimeChannel); } catch {}
        socialRealtimeChannel = null;
      }
      emit();
      return;
    }

    activeSubscribers += 1;
    void refreshSocialAccounts();
    ensureSocialRealtime();

    const onUpdate = () => { void refreshSocialAccounts(); };
    window.addEventListener("buzzhub:social-accounts-updated", onUpdate);
    window.addEventListener("buzzhub:buzzer-store", onUpdate);

    return () => {
      activeSubscribers = Math.max(0, activeSubscribers - 1);
      window.removeEventListener("buzzhub:social-accounts-updated", onUpdate);
      window.removeEventListener("buzzhub:buzzer-store", onUpdate);
      if (activeSubscribers === 0 && socialRealtimeChannel) {
        try { void supabase.removeChannel(socialRealtimeChannel); } catch {}
        socialRealtimeChannel = null;
        socialRealtimeReady = false;
      }
    };
  }, []);
  return CACHE;
}

export function socialAccountsOf(email: string): AdminSocialAccount[] {
  const lc = email.trim().toLowerCase();
  return CACHE.filter((a) => a.buzzerEmail.trim().toLowerCase() === lc);
}

export async function submitFollowerUpdateDirect(
  id: string,
  buzzerEmail: string,
  followers: number,
  proofUrl: string,
) {
  const { error } = await (supabase as any).from("social_accounts").update({
    pending_followers: followers,
    pending_proof_url: proofUrl.trim(),
    pending_submitted_at: new Date().toISOString(),
    pending_verification: "Menunggu",
    pending_rejection_note: null,
  }).eq("id", id).eq("buzzer_email", buzzerEmail.trim().toLowerCase());
  if (error) return { ok: false as const, message: error.message };
  await refreshSocialAccounts();
  return { ok: true as const };
}

/* ---------------- Buzzer (read-only + pengajuan) ---------------- */

export function useSocialAccounts(email: string | undefined, name: string | undefined) {
  const all = useSocialData();
  const em = (email ?? "").trim().toLowerCase();
  const nm = name ?? "Buzzer";
  const accounts = em ? all.filter((a) => a.buzzerEmail.trim().toLowerCase() === em) : [];

  return {
    accounts: accounts as SocialAccount[],
    ready: !!em,
    loading,
    add: async (
      a: Omit<SocialAccount, "id" | "createdAt" | "updatedAt" | "verification"> & { verification?: VerificationStatus },
    ) => {
      if (!em || !isSupabaseConfigured()) return false;
      const { error } = await supabase.from("social_accounts").insert({
        buzzer_email: em,
        buzzer_name: nm,
        platform: a.platform,
        username: a.username.trim(),
        account_name: a.accountName,
        profile_url: a.profileUrl,
        followers: a.followers,
        following_count: a.following,
        posts: a.posts,
        category: a.category,
        bio: a.bio,
        photo_url: a.photoUrl ?? null,
        verification: "Menunggu",
        is_active: false,
      });
      if (error) return false;
      await refreshSocialAccounts();
      return true;
    },
    update: async (id: string, patch: Partial<SocialAccount>) => {
      if (!isSupabaseConfigured()) return;
      await adminUpdateAccount(em, id, patch);
    },
    remove: async (id: string) => {
      if (!isSupabaseConfigured()) return;
      await adminRemoveAccount(em, id);
    },
    toggleActive: async (id: string) => {
      if (!isSupabaseConfigured()) return;
      await adminToggleActive(em, id);
    },
  };
}

/* ---------------- Admin ---------------- */

export function useAllSocialAccounts(): AdminSocialAccount[] {
  return useSocialData();
}

type RowPatch = Partial<{
  platform: string; username: string; account_name: string; profile_url: string;
  followers: number; following_count: number; posts: number; category: string;
  bio: string; photo_url: string | null; verification: string;
  rejection_note: string | null; is_active: boolean;
}>;

function toRowPatch(patch: Partial<SocialAccount>) {
  const p: RowPatch = {};
  if (patch.platform !== undefined) p.platform = patch.platform;
  if (patch.username !== undefined) p.username = patch.username;
  if (patch.accountName !== undefined) p.account_name = patch.accountName;
  if (patch.profileUrl !== undefined) p.profile_url = patch.profileUrl;
  if (patch.followers !== undefined) p.followers = patch.followers;
  if (patch.following !== undefined) p.following_count = patch.following;
  if (patch.posts !== undefined) p.posts = patch.posts;
  if (patch.category !== undefined) p.category = patch.category;
  if (patch.bio !== undefined) p.bio = patch.bio;
  if (patch.photoUrl !== undefined) p.photo_url = patch.photoUrl ?? null;
  if (patch.verification !== undefined) p.verification = patch.verification;
  if (patch.rejectionNote !== undefined) p.rejection_note = patch.rejectionNote ?? null;
  if (patch.isActive !== undefined) p.is_active = patch.isActive;
  return p;
}

export async function syncBuzzerFollowersToProfile(buzzerEmail: string) {
  if (!buzzerEmail || !isSupabaseConfigured() || !supabase) return;
  const em = buzzerEmail.trim().toLowerCase();
  const { data: accounts } = await supabase
    .from("social_accounts")
    .select("followers, platform, verification")
    .eq("buzzer_email", em)
    .ilike("verification", "Terverifikasi");

  const totalFollowers = (accounts ?? []).reduce((sum, a) => sum + (Number(a.followers) || 0), 0);
  if (totalFollowers >= 0) {
    await Promise.all([
      supabase.from("app_accounts").update({ followers: totalFollowers }).eq("email", em).eq("role", "buzzer"),
      supabase.from("buzzer_applications").update({ followers: totalFollowers }).eq("email", em),
      supabase.from("buzzer_wallets").update({ followers: totalFollowers, verified_followers: totalFollowers }).eq("buzzer_email", em),
      assignLevelFromVerification(em, "", totalFollowers),
    ]);

    if (typeof window !== "undefined") {
      try {
        const sessionRaw = localStorage.getItem("buzzhub.session");
        if (sessionRaw) {
          const session = JSON.parse(sessionRaw);
          if (session?.email?.trim().toLowerCase() === em) {
            session.followers = totalFollowers;
            localStorage.setItem("buzzhub.session", JSON.stringify(session));
          }
        }
        const storeKey = `buzzhub.buzzer.${em}`;
        const storeRaw = localStorage.getItem(storeKey);
        if (storeRaw) {
          const storeData = JSON.parse(storeRaw);
          if (storeData?.profile) {
            storeData.profile.followers = totalFollowers;
            localStorage.setItem(storeKey, JSON.stringify(storeData));
          }
        }
        window.dispatchEvent(new Event("buzzhub:buzzer-store"));
        window.dispatchEvent(new CustomEvent("buzzhub:social-accounts-updated", { detail: { email: em } }));
        window.dispatchEvent(new Event("storage"));
      } catch {
        /* noop */
      }
    }
  }
}

export async function adminUpdateAccount(email: string, id: string, patch: Partial<SocialAccount>) {
  await supabase.from("social_accounts").update(toRowPatch(patch)).eq("id", id);
  await refreshSocialAccounts();
  await syncBuzzerFollowersToProfile(email);
}

export async function adminApproveSocialAccount(id: string) {
  let account = CACHE.find((item) => item.id === id);
  if (!account) {
    const { data: directData } = await supabase.from("social_accounts").select("*").eq("id", id).maybeSingle();
    if (directData) {
      account = fromRow(directData as unknown as Row);
    }
  }
  if (!account) return false;
  const update: Record<string, any> = {
    verification: "Terverifikasi",
    is_active: true,
    pending_verification: null,
    pending_rejection_note: null,
    rejection_note: null,
    updated_at: new Date().toISOString(),
  };
  if (account.pendingFollowers != null) {
    update.followers = account.pendingFollowers;
    update.pending_followers = null;
    update.pending_proof_url = null;
    update.pending_submitted_at = null;
  }
  const { error } = await (supabase as any).from("social_accounts").update(update).eq("id", id);
  await refreshSocialAccounts();
  if (!error) {
    await syncBuzzerFollowersToProfile(account.buzzerEmail);
    void notifySocialAccountVerified({
      buzzerEmail: account.buzzerEmail,
      platform: account.platform,
      username: account.username,
      status: "approved",
    });
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("buzzhub:social-accounts-updated", { detail: { email: account.buzzerEmail } }));
      window.dispatchEvent(new Event("storage"));
    }
  }
  return !error;
}

export async function adminRejectSocialAccount(id: string, reason: string) {
  const account = CACHE.find((item) => item.id === id);
  if (!account) return false;
  const cleanReason = reason.trim() || "Pembaruan akun ditolak admin";
  const update: Record<string, any> = {
    pending_verification: "Ditolak",
    pending_rejection_note: cleanReason,
    updated_at: new Date().toISOString(),
  };
  if (account.verification === "Menunggu") {
    update.verification = "Ditolak";
    update.is_active = false;
    update.rejection_note = cleanReason;
  }
  const { error } = await (supabase as any).from("social_accounts").update(update).eq("id", id);
  await refreshSocialAccounts();
  if (!error) {
    void notifySocialAccountVerified({
      buzzerEmail: account.buzzerEmail,
      platform: account.platform,
      username: account.username,
      status: "rejected",
      reason: cleanReason,
    });
  }
  return !error;
}

export async function adminRemoveAccount(_email: string, id: string) {
  const account = CACHE.find((item) => item.id === id);
  await supabase.from("social_accounts").delete().eq("id", id);
  await refreshSocialAccounts();
  if (account?.buzzerEmail) {
    await syncBuzzerFollowersToProfile(account.buzzerEmail);
  }
}

export async function adminToggleActive(_email: string, id: string) {
  const cur = CACHE.find((a) => a.id === id);
  if (!cur) return;
  await supabase.from("social_accounts").update({ is_active: !cur.isActive }).eq("id", id);
  await refreshSocialAccounts();
  await syncBuzzerFollowersToProfile(cur.buzzerEmail);
}

export async function buzzerDeactivateAccount(email: string, id: string, reason?: string) {
  if (!isSupabaseConfigured() || !supabase) return false;
  const em = email.trim().toLowerCase();
  const updateData: Record<string, any> = {
    updated_at: new Date().toISOString(),
  };
  if (reason && reason.trim()) {
    updateData.rejection_note = `[Permintaan Nonaktif/Hapus]: ${reason.trim()}`;
  }
  const { error } = await (supabase as any)
    .from("social_accounts")
    .update(updateData)
    .eq("id", id)
    .eq("buzzer_email", em);

  if (error) {
    console.error("Gagal menonaktifkan akun:", error);
    return false;
  }

  await refreshSocialAccounts();
  await syncBuzzerFollowersToProfile(em);
  return true;
}

export async function adminApproveDeactivationRequest(id: string) {
  const account = CACHE.find((item) => item.id === id);
  if (!account) return false;
  const update = {
    is_active: false,
    rejection_note: `[Nonaktif]: ${account.rejectionNote?.replace("[Permintaan Nonaktif/Hapus]: ", "") || ""}`,
    updated_at: new Date().toISOString(),
  };
  const { error } = await supabase.from("social_accounts").update(update).eq("id", id);
  await refreshSocialAccounts();
  if (!error && account.buzzerEmail) {
    await syncBuzzerFollowersToProfile(account.buzzerEmail);
  }
  return !error;
}

export async function adminRejectDeactivationRequest(id: string, reason: string) {
  const account = CACHE.find((item) => item.id === id);
  if (!account) return false;
  const update = {
    rejection_note: `[Penolakan Nonaktif/Hapus]: ${reason.trim()}`,
    updated_at: new Date().toISOString(),
  };
  const { error } = await supabase.from("social_accounts").update(update).eq("id", id);
  await refreshSocialAccounts();
  return !error;
}

export async function buzzerUpdateAccount(
  email: string,
  id: string,
  data: {
    platform: SocialPlatform;
    username: string;
    accountName: string;
    profileUrl: string;
    following: number;
    posts: number;
    category: string;
    bio: string;
    photoUrl?: string;
    pendingFollowers?: number;
    pendingProofUrl?: string;
  },
) {
  if (!isSupabaseConfigured() || !supabase) return { ok: false, message: "Supabase tidak terhubung" };
  const em = email.trim().toLowerCase();

  const existingAccount = CACHE.find((item) => item.id === id);
  const updatePayload: Record<string, any> = {
    platform: data.platform,
    username: data.username.trim(),
    account_name: data.accountName.trim(),
    profile_url: data.profileUrl.trim(),
    following_count: data.following,
    posts: data.posts,
    category: data.category,
    bio: data.bio,
    photo_url: data.photoUrl ?? null,
    pending_verification: "Menunggu",
    pending_submitted_at: new Date().toISOString(),
    pending_rejection_note: null,
    updated_at: new Date().toISOString(),
  };

  // Jika akun sebelumnya berstatus ditolak, kembalikan status verifikasi utama ke Menunggu
  if (existingAccount && existingAccount.verification === "Ditolak") {
    updatePayload.verification = "Menunggu";
    updatePayload.rejection_note = null;
  }

  if (data.pendingFollowers !== undefined && data.pendingProofUrl) {
    updatePayload.pending_followers = data.pendingFollowers;
    updatePayload.pending_proof_url = data.pendingProofUrl;
  }

  const { error } = await (supabase as any)
    .from("social_accounts")
    .update(updatePayload)
    .eq("id", id)
    .eq("buzzer_email", em);

  if (error) {
    console.error("Gagal memperbarui akun buzzer:", error);
    return { ok: false, message: error.message };
  }

  await refreshSocialAccounts();
  await syncBuzzerFollowersToProfile(em);
  return { ok: true };
}


/** Dipakai halaman pendaftaran buzzer (belum ada sesi login). */
export async function submitSocialAccounts(
  buzzerEmail: string,
  buzzerName: string,
  accounts: Array<{ platform: SocialPlatform; username: string; profileUrl?: string; followers: number; category?: string }>,
) {
  const email = buzzerEmail.trim().toLowerCase();
  const rows = accounts.map((a) => ({
    buzzer_email: email,
    buzzer_name: buzzerName,
    platform: a.platform,
    username: a.username.trim(),
    account_name: buzzerName,
    profile_url: a.profileUrl ?? "",
    followers: a.followers,
    category: a.category ?? "",
    verification: "Menunggu",
    is_active: false,
  }));
  const { error } = await supabase
    .from("social_accounts")
    .upsert(rows, { onConflict: "buzzer_email,platform,username" });
  return !error;
}
