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
  // Fase 2: social_accounts tidak bisa ditulis client; sesi diverifikasi server.
  try {
    const { submitFollowerUpdateFn } = await import("./social.functions");
    await submitFollowerUpdateFn({ data: { id, followers, proofUrl } });
  } catch (error) {
    return {
      ok: false as const,
      message: error instanceof Error ? error.message : String(error),
    };
  }
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
      // Fase 2: penambahan akun lewat server (status dipaksa "Menunggu").
      try {
        const { addSocialAccountFn } = await import("./social.functions");
        await addSocialAccountFn({
          data: {
            platform: a.platform,
            username: a.username,
            accountName: a.accountName,
            profileUrl: a.profileUrl,
            followers: a.followers,
            following: a.following,
            posts: a.posts,
            category: a.category,
            bio: a.bio,
            photoUrl: a.photoUrl ?? null,
          },
        });
      } catch (error) {
        console.error("[Social] Gagal menambah akun:", error);
        return false;
      }
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

  // Fase 1: perhitungan followers + level dilakukan di server. Client tidak
  // lagi menulis ke app_accounts / buzzer_wallets / buzzer_levels.
  let totalFollowers = 0;
  try {
    const { syncBuzzerLevelFn } = await import("./buzzer-level.functions");
    const result = await syncBuzzerLevelFn({ data: { buzzerEmail: em } });
    totalFollowers = result.followers;
  } catch (error) {
    console.warn("[Followers] Gagal sinkronisasi level di server:", error);
    return;
  }

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

export async function adminUpdateAccount(email: string, id: string, patch: Partial<SocialAccount>) {
  // Fase 2: mutasi social account lewat server function admin.
  try {
    const { adminUpdateSocialAccountFn } = await import("./social.functions");
    await adminUpdateSocialAccountFn({ data: { id, patch: toRowPatch(patch) } });
  } catch (error) {
    console.warn("[Social] Gagal memperbarui akun:", error);
  }
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

  // Fase 2: approval social account lewat server function admin.
  let ok = false;
  try {
    const { adminApproveSocialAccountFn } = await import("./social.functions");
    await adminApproveSocialAccountFn({ data: { id } });
    ok = true;
  } catch (error) {
    console.warn("[Social] Gagal menyetujui akun:", error);
  }

  await refreshSocialAccounts();
  if (ok) {
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
  return ok;
}

export async function adminRejectSocialAccount(id: string, reason: string) {
  const account = CACHE.find((item) => item.id === id);
  if (!account) return false;
  const cleanReason = reason.trim() || "Pembaruan akun ditolak admin";

  // Fase 2: penolakan lewat server function admin.
  let ok = false;
  try {
    const { adminRejectSocialAccountFn } = await import("./social.functions");
    await adminRejectSocialAccountFn({ data: { id, reason: cleanReason } });
    ok = true;
  } catch (error) {
    console.warn("[Social] Gagal menolak akun:", error);
  }

  await refreshSocialAccounts();
  if (ok) {
    void notifySocialAccountVerified({
      buzzerEmail: account.buzzerEmail,
      platform: account.platform,
      username: account.username,
      status: "rejected",
      reason: cleanReason,
    });
  }
  return ok;
}

export async function adminRemoveAccount(_email: string, id: string) {
  const account = CACHE.find((item) => item.id === id);
  // Fase 2: penghapusan lewat server function admin.
  try {
    const { adminDeleteSocialAccountFn } = await import("./social.functions");
    await adminDeleteSocialAccountFn({ data: { id } });
  } catch (error) {
    console.warn("[Social] Gagal menghapus akun:", error);
  }
  await refreshSocialAccounts();
  if (account?.buzzerEmail) {
    await syncBuzzerFollowersToProfile(account.buzzerEmail);
  }
}

export async function adminToggleActive(_email: string, id: string) {
  const cur = CACHE.find((a) => a.id === id);
  if (!cur) return;
  // Fase 2: toggle aktif lewat server function admin.
  try {
    const { adminToggleSocialAccountFn } = await import("./social.functions");
    await adminToggleSocialAccountFn({ data: { id, isActive: !cur.isActive } });
  } catch (error) {
    console.warn("[Social] Gagal mengubah status aktif:", error);
  }
  await refreshSocialAccounts();
  await syncBuzzerFollowersToProfile(cur.buzzerEmail);
}

export async function buzzerDeactivateAccount(email: string, id: string, reason?: string) {
  if (!isSupabaseConfigured() || !supabase) return false;
  const em = email.trim().toLowerCase();

  // Fase 2: permintaan nonaktif lewat server function (sesi diverifikasi).
  try {
    const { requestSocialDeactivateFn } = await import("./social.functions");
    await requestSocialDeactivateFn({ data: { id, reason } });
  } catch (error) {
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
  // Fase 2: approval nonaktif lewat server function admin.
  let ok = false;
  try {
    const { adminApproveDeactivationFn } = await import("./social.functions");
    await adminApproveDeactivationFn({ data: { id } });
    ok = true;
  } catch (error) {
    console.warn("[Social] Gagal menyetujui nonaktif:", error);
  }
  await refreshSocialAccounts();
  if (ok && account.buzzerEmail) {
    await syncBuzzerFollowersToProfile(account.buzzerEmail);
  }
  return ok;
}

export async function adminRejectDeactivationRequest(id: string, reason: string) {
  const account = CACHE.find((item) => item.id === id);
  if (!account) return false;
  // Fase 2: penolakan nonaktif lewat server function admin.
  let ok = false;
  try {
    const { adminRejectDeactivationFn } = await import("./social.functions");
    await adminRejectDeactivationFn({ data: { id, reason } });
    ok = true;
  } catch (error) {
    console.warn("[Social] Gagal menolak nonaktif:", error);
  }
  await refreshSocialAccounts();
  return ok;
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

  // Fase 2: pembaruan akun buzzer lewat server function. Server memverifikasi
  // kepemilikan baris dan memaksa status verifikasi kembali ke "Menunggu".
  try {
    const { updateSocialAccountFn } = await import("./social.functions");
    await updateSocialAccountFn({
      data: {
        id,
        platform: data.platform,
        username: data.username,
        accountName: data.accountName,
        profileUrl: data.profileUrl,
        following: data.following,
        posts: data.posts,
        category: data.category,
        bio: data.bio,
        photoUrl: data.photoUrl ?? null,
        pendingFollowers: data.pendingFollowers,
        pendingProofUrl: data.pendingProofUrl,
      },
    });
  } catch (error) {
    console.error("Gagal memperbarui akun buzzer:", error);
    return {
      ok: false,
      message: error instanceof Error ? error.message : String(error),
    };
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
  // Fase 2: pendaftaran (belum login) lewat server function yang memaksa
  // status "Menunggu" + is_active false.
  try {
    const { submitSocialAccountsFn } = await import("./social.functions");
    await submitSocialAccountsFn({
      data: {
        buzzerEmail: email,
        buzzerName,
        accounts: accounts.map((a) => ({
          platform: a.platform,
          username: a.username,
          profileUrl: a.profileUrl,
          followers: a.followers,
          category: a.category,
        })),
      },
    });
    return true;
  } catch (error) {
    console.error("[Social] Gagal menyimpan akun media sosial:", error);
    return false;
  }
}
