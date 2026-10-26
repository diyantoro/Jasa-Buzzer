// Client-side reactive "database" untuk dashboard buzzer.
// Persistent per-akun via localStorage, dengan event bus agar UI real-time.
import { useEffect, useSyncExternalStore } from "react";
import { supabase } from "@/integrations/supabase/client";
import { getSession, setSession } from "@/lib/auth";

export type JobStatus =
  | "Tersedia"
  | "Diambil"
  | "Upload"
  | "Review"
  | "Revisi"
  | "Selesai"
  | "Ditolak";

export type Platform = "TikTok" | "Instagram" | "X (Twitter)" | "Facebook" | "YouTube" | "Telegram" | "LinkedIn";

export type BuzzerJob = {
  id: string;
  title: string;
  platform: Platform;
  brief: string;
  deadline: string; // YYYY-MM-DD
  payout: number;
  status: JobStatus;
  proofUrl?: string;
  note?: string;
  rejection_reason?: string;
  rejected_at?: string;
  admin_verified_at?: string | null;
  customer_rated_at?: string | null;
  updatedAt: string;
};

export type Earning = {
  id: string;
  date: string;
  jobId: string;
  jobTitle: string;
  amount: number;
  status: "Pending" | "Diproses" | "Berhasil" | "Ditolak";
  platform?: Platform;
  transactionType?: string;
};

export type Withdrawal = {
  id: string;
  date: string;
  amount: number;
  method: string;
  status: "Pending" | "Menunggu" | "Disetujui" | "Diproses" | "Berhasil" | "Ditolak";
  accountNo?: string;
  accountName?: string;
  proofUrl?: string;
  adminNote?: string;
  requestedAt?: string;
  completedAt?: string;
};

export type BuzzerProfile = {
  name: string;
  username: string;
  email: string;
  phone: string;
  platform: Platform;
  followers: number;
  rating: number;
  jobsCompleted: number;
  bio: string;
  avatarUrl?: string;
  buzzerCategory?: string;
  address?: string;
  city?: string;
};

export type BuzzerState = {
  profile: BuzzerProfile;
  jobs: BuzzerJob[];
  earnings: Earning[];
  withdrawals: Withdrawal[];
  balance: number;
};

const EVT = "buzzhub:buzzer-store";
const keyFor = (email: string) => `buzzhub.buzzer.${email.toLowerCase()}`;

function today(offset = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d.toISOString().slice(0, 10);
}

const DEMO_BUZZER_EMAIL = "buzzer@buzzhub.id";

const isDemoBuzzer = (email: string) => email.trim().toLowerCase() === DEMO_BUZZER_EMAIL;

/** Data dummy untuk akun demo `buzzer@buzzhub.id` agar dashboard buzzer terisi. */
function demoBuzzerState(email: string, name: string): BuzzerState {
  const jobs: BuzzerJob[] = [
    { id: "demo-job-1", title: "Launch Produk Skincare Glowin", platform: "Instagram", brief: "Posting story + feed unboxing produk Glowin tag @glowin.id.", deadline: today(-2), payout: 75000, status: "Selesai", proofUrl: "https://buzzhub.id/demo/proof-1.jpg", admin_verified_at: today(-2), updatedAt: today(-2) },
    { id: "demo-job-2", title: "Hashtag #KopiSenjaPulang", platform: "X (Twitter)", brief: "Tweet pengalaman ngopi sore dengan hashtag, minimum 3 tweet.", deadline: today(-5), payout: 25000, status: "Selesai", proofUrl: "https://buzzhub.id/demo/proof-2.jpg", admin_verified_at: today(-5), updatedAt: today(-5) },
    { id: "demo-job-3", title: "FinPay Cashback Challenge", platform: "TikTok", brief: "Buat video 15 detik review fitur cashback FinPay dengan hashtag #FinPayCuan.", deadline: today(-8), payout: 90000, status: "Selesai", proofUrl: "https://buzzhub.id/demo/proof-3.jpg", admin_verified_at: today(-8), updatedAt: today(-8) },
    { id: "demo-job-4", title: "Promo Ramadhan Bunda", platform: "Facebook", brief: "Share post promo ke 5 grup ibu rumah tangga.", deadline: today(-12), payout: 30000, status: "Selesai", proofUrl: "https://buzzhub.id/demo/proof-4.jpg", admin_verified_at: today(-12), updatedAt: today(-12) },
    { id: "demo-job-5", title: "Review Earphone Sonik", platform: "YouTube", brief: "Ulasan 3 menit kelebihan dan kekurangan Earphone Sonik.", deadline: today(-20), payout: 120000, status: "Selesai", proofUrl: "https://buzzhub.id/demo/proof-5.jpg", admin_verified_at: today(-20), updatedAt: today(-20) },
    { id: "demo-job-6", title: "Viral TikTok Dance Brand", platform: "TikTok", brief: "Ikuti choreography resmi brand dan upload video duet.", deadline: today(3), payout: 65000, status: "Review", proofUrl: "https://buzzhub.id/demo/proof-6.jpg", updatedAt: today(-1) },
    { id: "demo-job-7", title: "Boost Reels Skincare", platform: "Instagram", brief: "Upload reels dengan audio trending, minimal 500 views organik.", deadline: today(5), payout: 55000, status: "Diambil", updatedAt: today(0) },
    { id: "demo-job-8", title: "Community Meetup Devs", platform: "X (Twitter)", brief: "Live tweet thread selama acara komunitas berlangsung.", deadline: today(7), payout: 40000, status: "Revisi", proofUrl: "https://buzzhub.id/demo/proof-8.jpg", rejection_reason: "Thread belum menyebut akun sponsor utama.", rejected_at: today(-1), updatedAt: today(-1) },
  ];

  const earnings: Earning[] = jobs
    .filter((job) => job.status === "Selesai")
    .map((job, index) => ({
      id: `demo-earning-${index + 1}`,
      date: job.updatedAt.slice(0, 10),
      jobId: job.id,
      jobTitle: job.title,
      amount: job.payout,
      status: "Berhasil",
      platform: job.platform,
      transactionType: "Payout Job",
    }));

  earnings.push({
    id: "demo-earning-6",
    date: today(-1),
    jobId: "demo-job-6",
    jobTitle: "Viral TikTok Dance Brand",
    amount: 65000,
    status: "Pending",
    platform: "TikTok",
    transactionType: "Payout Job",
  });

  const withdrawals: Withdrawal[] = [
    { id: "demo-withdraw-1", date: today(-15), amount: 1500000, method: "BCA •• 8821", status: "Berhasil", accountNo: "8821", accountName: name, completedAt: today(-14) },
    { id: "demo-withdraw-2", date: today(-2), amount: 500000, method: "BCA •• 8821", status: "Diproses", accountNo: "8821", accountName: name, requestedAt: today(-2) },
  ];

  return {
    profile: {
      name,
      username: "@buzzerpremium",
      email,
      phone: "+62 812-3456-7890",
      platform: "Instagram",
      followers: 45200,
      rating: 4.9,
      jobsCompleted: 187,
      bio: "Micro-influencer lifestyle & kuliner. Open collab brand lokal.",
      buzzerCategory: "Buzzer Online",
      city: "Jakarta Selatan",
    },
    balance: 3250000,
    jobs,
    earnings,
    withdrawals,
  };
}

function seed(email: string, name: string, profile: Partial<BuzzerProfile> = {}): BuzzerState {
  if (isDemoBuzzer(email)) return demoBuzzerState(email, name);

  const firstName = name.split(" ")[0] || "Buzzer";
  const uname = (profile.username && profile.username.trim()) || "@" + firstName.toLowerCase().replace(/[^a-z0-9]/g, "");
  // Akun buzzer baru dimulai kosong: tanpa pekerjaan, penghasilan, atau saldo.
  return {
    profile: {
      name,
      username: uname,
      email,
      phone: profile.phone ?? "",
      platform: (profile.platform as Platform) ?? "Instagram",
      followers: profile.followers ?? 0,
      rating: 0,
      jobsCompleted: 0,
      bio: profile.bio ?? "",
      avatarUrl: profile.avatarUrl,
      buzzerCategory: profile.buzzerCategory ?? (profile as any)?.company ?? "Buzzer Online",
    },
    balance: 0,
    jobs: [],
    earnings: [],
    withdrawals: [],
    };
}

function cleanDefined<T extends Record<string, any>>(obj: T): Partial<T> {
  const result: Partial<T> = {};
  for (const key of Object.keys(obj) as (keyof T)[]) {
    if (obj[key] !== undefined && obj[key] !== null) {
      result[key] = obj[key];
    }
  }
  return result;
}

function read(email: string, name: string, profile: Partial<BuzzerProfile> = {}): BuzzerState {
  if (typeof window === "undefined") return seed(email, name, profile);
  try {
    const raw = localStorage.getItem(keyFor(email));
    if (raw) {
      const parsed = JSON.parse(raw) as BuzzerState;
      const initialSeed = seed(email, name, profile).profile;
      const cleanInput = cleanDefined(profile);
      const demo = isDemoBuzzer(email) && (!Array.isArray(parsed.jobs) || parsed.jobs.length === 0);
      const demoState = demo ? demoBuzzerState(email, name) : null;
      return {
        ...parsed,
        balance: demoState ? demoState.balance : Number(parsed.balance || 0),
        withdrawals: demoState
          ? demoState.withdrawals
          : Array.isArray(parsed.withdrawals)
            ? parsed.withdrawals
            : [],
        earnings: demoState
          ? demoState.earnings
          : Array.isArray(parsed.earnings)
            ? parsed.earnings
            : [],
        jobs: demoState ? demoState.jobs : Array.isArray(parsed.jobs) ? parsed.jobs : [],
        profile: {
          ...initialSeed,
          ...(demoState ? demoState.profile : {}),
          ...parsed.profile,
          ...cleanInput,
          name: cleanInput.name || parsed.profile?.name || initialSeed.name || name,
          email: cleanInput.email || parsed.profile?.email || email,
          avatarUrl: cleanInput.avatarUrl || parsed.profile?.avatarUrl || initialSeed.avatarUrl,
        },
      };
    }
  } catch { /* noop */ }
  const s = seed(email, name, profile);
  localStorage.setItem(keyFor(email), JSON.stringify(s));
  return s;
}

function write(email: string, state: BuzzerState) {
  localStorage.setItem(keyFor(email), JSON.stringify(state));
  window.dispatchEvent(new Event(EVT));
}

export function useBuzzerStore(
  email: string | undefined,
  name: string | undefined,
  profile: Partial<BuzzerProfile> = {},
) {
  const key = email ?? "";
  const nm = name ?? "Buzzer";

  useEffect(() => {
    if (email) {
      const hydrated = read(email, nm, profile);
      if (typeof window !== "undefined") {
        localStorage.setItem(keyFor(email), JSON.stringify(hydrated));
      }
    }
  }, [email, nm, profile]);

  useEffect(() => {
    if (!email) return;
    let active = true;
    const normalizedEmail = email.trim().toLowerCase();

    const loadProfile = async () => {
      const [{ data, error }, { data: verifiedSocials }, { data: wallet }] = await Promise.all([
        supabase
          .from("app_accounts")
          .select("email, name, phone, bio, username, platform, followers, avatar_url, rating, total_reviews")
          .eq("email", normalizedEmail)
          .eq("role", "buzzer")
          .maybeSingle(),
        supabase
          .from("social_accounts")
          .select("followers, platform, username")
          .eq("buzzer_email", normalizedEmail)
          .eq("verification", "Terverifikasi"),
        supabase
          .from("buzzer_wallets")
          .select("followers, verified_followers, rating, total_reviews")
          .eq("buzzer_email", normalizedEmail)
          .maybeSingle(),
      ]);

      if (!active || error) return;
      const fallback = !data
        ? await supabase
          .from("buzzer_applications")
          .select("email, name, phone, bio, username, platform, followers")
          .eq("email", normalizedEmail)
          .eq("status", "approved")
          .maybeSingle()
        : null;
      const source = data ?? fallback?.data;
      if (!active || !source) return;

      const socialFollowersTotal = (verifiedSocials ?? []).reduce(
        (sum, a) => sum + (Number(a.followers) || 0),
        0,
      );
      const walletFollowers = Number(wallet?.verified_followers ?? wallet?.followers ?? 0);
      const verifiedFollowers = socialFollowersTotal > 0
        ? socialFollowersTotal
        : walletFollowers > 0
        ? walletFollowers
        : (source.followers ?? 0);

      // Keep DB synchronized if app_accounts had outdated followers
      if (data && verifiedFollowers > 0 && data.followers !== verifiedFollowers) {
        void supabase.from("app_accounts").update({ followers: verifiedFollowers }).eq("email", normalizedEmail).eq("role", "buzzer");
        void supabase.from("buzzer_applications").update({ followers: verifiedFollowers }).eq("email", normalizedEmail);
      }

      const totalReviews = Number(wallet?.total_reviews ?? (data as any)?.total_reviews ?? 0);
      const rawRating = Number(wallet?.rating ?? (data as any)?.rating ?? 0);
      const buzzerRating = totalReviews > 0 ? (rawRating > 0 ? rawRating : 0) : 0;

      const current = read(email, nm, profile);
      const resolvedAvatar = ("avatar_url" in source && source.avatar_url) ? source.avatar_url : current.profile.avatarUrl;

      const resolvedBuzzerCategory = (source as any).company || current.profile.buzzerCategory || "Buzzer Online";

      write(email, {
        ...current,
        profile: {
          ...current.profile,
          name: source.name,
          email: source.email,
          phone: source.phone ?? "",
          bio: source.bio ?? "",
          username: source.username ?? "",
          platform: (source.platform as Platform) ?? current.profile.platform,
          followers: verifiedFollowers,
          rating: buzzerRating,
          avatarUrl: resolvedAvatar,
          buzzerCategory: resolvedBuzzerCategory,
        },
      });
      const session = getSession();
      if (session?.email.toLowerCase() === normalizedEmail) {
        setSession({
          ...session,
          name: source.name,
          phone: source.phone ?? undefined,
          bio: source.bio ?? undefined,
          username: source.username ?? undefined,
          platform: source.platform ?? undefined,
          company: resolvedBuzzerCategory,
          followers: verifiedFollowers,
          avatarUrl: resolvedAvatar ?? session.avatarUrl,
        });
      }
    };

    void loadProfile();

    const channel = supabase
      .channel(`buzzer-profile-${normalizedEmail}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "social_accounts", filter: `buzzer_email=eq.${normalizedEmail}` },
        () => { void loadProfile(); },
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "app_accounts", filter: `email=eq.${normalizedEmail}` },
        () => { void loadProfile(); },
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "buzzer_wallets", filter: `buzzer_email=eq.${normalizedEmail}` },
        () => { void loadProfile(); },
      )
      .subscribe();

    return () => {
      active = false;
      void supabase.removeChannel(channel);
    };
  }, [email, nm]);

  useEffect(() => {
    if (!email) return;
    let active = true;
    const normalizedEmail = email.trim().toLowerCase();

    const loadFinance = async () => {
      const [{ data: wallet, error: walletError }, { data: buzzerJobs, error: jobsError }, { data: dbWithdrawals }] = await Promise.all([
        supabase
          .from("buzzer_wallets")
          .select("balance")
          .eq("buzzer_email", normalizedEmail)
          .maybeSingle(),
        (supabase as any)
          .from("campaign_jobs")
          .select("id, campaign_title, platform, payout, buzzer_amount, status, admin_verified_at, updated_at")
          .eq("buzzer_email", normalizedEmail)
          .or("status.eq.Selesai,admin_verified_at.not.is.null")
          .order("updated_at", { ascending: false }),
        supabase
          .from("withdrawals")
          .select("id, amount, method, account_no, status, proof_url, admin_note, requested_at, created_at, completed_at")
          .eq("buzzer_email", normalizedEmail)
          .order("requested_at", { ascending: false }),
      ]);

      if (!active || walletError || jobsError) return;

      const earnings = (buzzerJobs ?? []).filter((job: any) => Number(job.buzzer_amount ?? job.payout ?? 0) > 0).map((job: any) => ({
        id: job.id,
        date: job.updated_at.slice(0, 10),
        jobId: job.id,
        jobTitle: job.campaign_title,
        amount: Number(job.buzzer_amount ?? job.payout ?? 0),
        status: "Berhasil" as const,
        platform: (job.platform ?? "Instagram") as Platform,
        transactionType: "Payout Buzzer",
      }));

      const current = read(email, nm, profile);
      const mergedWithdrawals: Withdrawal[] = (dbWithdrawals && dbWithdrawals.length > 0)
        ? dbWithdrawals.map((w: any) => ({
            id: String(w.id),
            date: (w.requested_at || w.created_at || today()).slice(0, 10),
            amount: Number(w.amount || 0),
            method: w.method || "Transfer",
            status: (w.status || "Menunggu") as any,
            accountNo: w.account_no || "",
            proofUrl: w.proof_url || undefined,
            adminNote: w.admin_note || undefined,
            requestedAt: w.requested_at || w.created_at,
            completedAt: w.completed_at || undefined,
          }))
        : current.withdrawals;

      write(email, {
        ...current,
        balance: Number(wallet?.balance ?? current.balance),
        earnings,
        withdrawals: mergedWithdrawals,
        profile: { ...current.profile, jobsCompleted: Math.max(current.profile.jobsCompleted, earnings.length) },
      });
    };

    void loadFinance();

    const channel = supabase
      .channel(`buzzer-finance-${normalizedEmail}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "buzzer_wallets", filter: `buzzer_email=eq.${normalizedEmail}` },
        () => { void loadFinance(); },
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "withdrawals", filter: `buzzer_email=eq.${normalizedEmail}` },
        () => { void loadFinance(); },
      )
      .subscribe();

    return () => {
      active = false;
      void supabase.removeChannel(channel);
    };
  }, [email, nm]);

  const subscribe = (cb: () => void) => {
    const h = () => cb();
    window.addEventListener(EVT, h);
    window.addEventListener("storage", h);
    return () => {
      window.removeEventListener(EVT, h);
      window.removeEventListener("storage", h);
    };
  };
  const getSnapshot = () => {
    if (!email) return null;
    try {
      const raw = localStorage.getItem(keyFor(email));
      return raw ?? "";
    } catch {
      return "";
    }
  };
  const serverSnapshot = () => null;
  useSyncExternalStore(subscribe, getSnapshot, serverSnapshot);

  const state = email ? read(email, nm, profile) : seed("guest@buzzhub.id", nm);

  const mutate = (fn: (s: BuzzerState) => BuzzerState) => {
    if (!email) return;
    const next = fn(read(email, nm));
    write(email, next);
  };

  return {
    state,
    ready: !!email,
    // JOBS
    takeJob: (id: string) =>
      mutate((s) => ({ ...s, jobs: s.jobs.map((j) => j.id === id ? { ...j, status: "Diambil", updatedAt: new Date().toISOString() } : j) })),
    uploadProof: (id: string, url: string) =>
      mutate((s) => ({ ...s, jobs: s.jobs.map((j) => (j.id === id || ("db:" + j.id) === id || j.id === id.replace(/^db:/, "")) ? { ...j, status: "Review", proofUrl: url, updatedAt: new Date().toISOString() } : j) })),
    resubmitProof: (id: string, url: string) =>
      mutate((s) => ({ ...s, jobs: s.jobs.map((j) => (j.id === id || ("db:" + j.id) === id || j.id === id.replace(/^db:/, "")) ? { ...j, status: "Review", proofUrl: url, note: undefined, updatedAt: new Date().toISOString() } : j) })),
    // PROFILE
    updateProfile: async (patch: Partial<BuzzerProfile>) => {
      if (!email) return false;
      const updatePayload: Record<string, any> = {
        name: patch.name,
        phone: patch.phone,
        bio: patch.bio,
        username: patch.username,
        platform: patch.platform,
        followers: patch.followers,
        avatar_url: patch.avatarUrl ?? null,
      };
      if (patch.buzzerCategory) {
        updatePayload.company = patch.buzzerCategory;
      }
      const { data: updatedAccount, error } = await (supabase as any)
        .from("app_accounts")
        .update(updatePayload)
        .eq("email", email.trim().toLowerCase())
        .eq("role", "buzzer")
        .select("email")
        .maybeSingle();
      if (error) return false;
      if (!updatedAccount) {
        const { error: applicationError } = await supabase
          .from("buzzer_applications")
          .update({
            name: patch.name,
            phone: patch.phone,
            bio: patch.bio,
            username: patch.username,
            platform: patch.platform,
            followers: patch.followers,
          })
          .eq("email", email.trim().toLowerCase())
          .eq("status", "approved");
        if (applicationError) return false;
      }
      mutate((s) => ({ ...s, profile: { ...s.profile, ...patch, email: s.profile.email } }));
      const session = getSession();
      if (session?.email.toLowerCase() === email.trim().toLowerCase()) {
        setSession({
          ...session,
          name: patch.name ?? session.name,
          phone: patch.phone ?? session.phone,
          bio: patch.bio ?? session.bio,
          username: patch.username ?? session.username,
          platform: patch.platform ?? session.platform,
          followers: patch.followers ?? session.followers,
          avatarUrl: patch.avatarUrl ?? session.avatarUrl,
          company: patch.buzzerCategory ?? session.company,
        });
      }
      return true;
    },
    // WITHDRAW
    requestWithdrawal: async (
      amount: number,
      method: string,
      accountNo?: string,
      accountName?: string,
    ): Promise<boolean> => {
      if (!email || amount <= 0) return false;
      const current = read(email, nm, profile);
      if (amount > current.balance) return false;

      const currentWithdrawals = Array.isArray(current.withdrawals) ? current.withdrawals : [];
      const pendingTotal = currentWithdrawals
        .filter((w) => w.status === "Menunggu")
        .reduce((sum, w) => sum + Number(w.amount || 0), 0);
      const availableToWithdraw = Math.max(0, current.balance - pendingTotal);
      if (amount > availableToWithdraw) return false;

      const nowIso = new Date().toISOString();
      const fullAccountNo = accountName?.trim()
        ? `${accountNo} a.n. ${accountName.trim()}`
        : (accountNo || method);

      const w: Withdrawal = {
        id: "w" + Date.now(),
        date: today(),
        amount,
        method,
        status: "Menunggu",
        accountNo: fullAccountNo,
        accountName: accountName?.trim(),
        requestedAt: nowIso,
      };

      // 1. Simpan permohonan secara lokal — Saldo buzzer TETAP UTUH (tidak berkurang) sampai disetujui admin
      write(email, {
        ...current,
        withdrawals: [w, ...currentWithdrawals],
      });

      // 2. Persist to Supabase: catat withdrawal baru (saldo dompet tidak dipotong sebelum approval admin)
      const normalizedEmail = email.trim().toLowerCase();
      try {
        await supabase.from("withdrawals").insert({
          buzzer_name: current.profile.name || nm,
          buzzer_email: normalizedEmail,
          amount,
          method,
          account_no: fullAccountNo,
          status: "Menunggu",
          requested_at: nowIso,
        });

        await supabase.from("finance_activity").insert({
          type: "buzzer",
          title: "Pengajuan Pencairan Saldo",
          description: `Pengajuan pencairan saldo sebesar Rp ${amount.toLocaleString("id-ID")} ke ${method} (${fullAccountNo}) menunggu verifikasi admin`,
          amount,
          ref_table: "withdrawals",
        });
      } catch (err) {
        console.error("Gagal sinkronisasi pencairan saldo ke Supabase:", err);
      }

      return true;
    },
    resetData: () => {
      if (!email) return;
      localStorage.removeItem(keyFor(email));
      window.dispatchEvent(new Event(EVT));
    },
  };
}

export const formatIDR = (n: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);

export function terbilangRupiah(n: number): string {
  if (isNaN(n) || n <= 0) return "";
  const satuan = ["", "satu", "dua", "tiga", "empat", "lima", "enam", "tujuh", "delapan", "sembilan", "sepuluh", "sebelas"];
  function konversi(val: number): string {
    if (val < 12) return satuan[val];
    if (val < 20) return konversi(val - 10) + " belas";
    if (val < 100) return konversi(Math.floor(val / 10)) + " puluh" + (val % 10 ? " " + konversi(val % 10) : "");
    if (val < 200) return "seratus" + (val - 100 ? " " + konversi(val - 100) : "");
    if (val < 1000) return konversi(Math.floor(val / 100)) + " ratus" + (val % 100 ? " " + konversi(val % 100) : "");
    if (val < 2000) return "seribu" + (val - 1000 ? " " + konversi(val - 1000) : "");
    if (val < 1000000) return konversi(Math.floor(val / 1000)) + " ribu" + (val % 1000 ? " " + konversi(val % 1000) : "");
    if (val < 1000000000) return konversi(Math.floor(val / 1000000)) + " juta" + (val % 1000000 ? " " + konversi(val % 1000000) : "");
    return konversi(Math.floor(val / 1000000000)) + " milyar" + (val % 1000000000 ? " " + konversi(val % 1000000000) : "");
  }
  const hasil = konversi(Math.floor(n)).trim();
  return hasil ? hasil.charAt(0).toUpperCase() + hasil.slice(1) : "";
}

/* ---------- Admin helpers: aggregate withdrawals across buzzers ---------- */

export type AdminWithdrawal = Withdrawal & {
  buzzerEmail: string;
  buzzerName: string;
};

const PREFIX = "buzzhub.buzzer.";

function readByEmail(email: string): BuzzerState | null {
  try {
    const raw = localStorage.getItem(PREFIX + email.toLowerCase());
    if (!raw) return null;
    const parsed = JSON.parse(raw) as BuzzerState;
    if (!parsed || typeof parsed !== "object") return null;
    if (!Array.isArray(parsed.withdrawals)) parsed.withdrawals = [];
    if (!Array.isArray(parsed.earnings)) parsed.earnings = [];
    if (!Array.isArray(parsed.jobs)) parsed.jobs = [];
    parsed.balance = Number(parsed.balance || 0);
    return parsed;
  } catch { return null; }
}

export function listAllWithdrawals(): AdminWithdrawal[] {
  if (typeof window === "undefined") return [];
  const out: AdminWithdrawal[] = [];
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (!k || !k.startsWith(PREFIX)) continue;
      const email = k.slice(PREFIX.length);
      const st = readByEmail(email);
      if (!st || !Array.isArray(st.withdrawals)) continue;
      for (const w of st.withdrawals) {
        if (!w) continue;
        out.push({
          ...w,
          buzzerEmail: st.profile?.email || email,
          buzzerName: st.profile?.name || "Buzzer",
        });
      }
    }
  } catch (err) {
    console.warn("[listAllWithdrawals] Error reading withdrawals:", err);
  }
  return out.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function updateWithdrawalStatus(
  email: string,
  id: string,
  status: Withdrawal["status"],
  adminNote?: string,
  proofUrl?: string,
) {
  const st = readByEmail(email);
  if (!st) return;
  if (!Array.isArray(st.withdrawals)) st.withdrawals = [];
  const w = st.withdrawals.find((x) => x.id === id);
  if (!w) return;
  const prev = w.status;
  w.status = status;
  if (adminNote !== undefined) w.adminNote = adminNote;
  if (proofUrl !== undefined) w.proofUrl = proofUrl;

  const isApproved = status === "Berhasil" || status === "Disetujui";
  const wasApproved = prev === "Berhasil" || prev === "Disetujui";

  if (isApproved) {
    w.completedAt = new Date().toISOString();
    // Potong saldo HANYA ketika disetujui oleh admin
    if (!wasApproved) {
      st.balance = Math.max(0, st.balance - w.amount);
    }
  } else if (wasApproved && !isApproved) {
    // Jika sebelumnya sudah disetujui lalu status dibatalkan/diubah, kembalikan saldo
    st.balance += w.amount;
  }
  localStorage.setItem(PREFIX + email.toLowerCase(), JSON.stringify(st));
  window.dispatchEvent(new Event(EVT));
}

export function deleteWithdrawal(email: string, id: string) {
  const st = readByEmail(email);
  if (!st) return;
  if (!Array.isArray(st.withdrawals)) st.withdrawals = [];
  const target = st.withdrawals.find((x) => x.id === id);
  if (!target) return;

  // Jika target sebelumnya sudah berstatus Berhasil (saldo telah dipotong), kembalikan saldo
  if (target.status === "Berhasil" || target.status === "Disetujui") {
    st.balance += target.amount;
  }
  st.withdrawals = st.withdrawals.filter((x) => x.id !== id);
  localStorage.setItem(PREFIX + email.toLowerCase(), JSON.stringify(st));
  window.dispatchEvent(new Event(EVT));
}

export function editWithdrawal(
  email: string,
  id: string,
  patch: Partial<Withdrawal>
) {
  const st = readByEmail(email);
  if (!st) return;
  if (!Array.isArray(st.withdrawals)) st.withdrawals = [];
  const w = st.withdrawals.find((x) => x.id === id);
  if (!w) return;

  const prevStatus = w.status;
  const newStatus = patch.status ?? prevStatus;
  const prevAmount = w.amount;
  const newAmount = patch.amount !== undefined ? patch.amount : prevAmount;

  const wasApproved = prevStatus === "Berhasil" || prevStatus === "Disetujui";
  const isApproved = newStatus === "Berhasil" || newStatus === "Disetujui";

  if (!wasApproved && isApproved) {
    st.balance = Math.max(0, st.balance - newAmount);
  } else if (wasApproved && !isApproved) {
    st.balance += prevAmount;
  } else if (wasApproved && isApproved && prevAmount !== newAmount) {
    st.balance = Math.max(0, st.balance + prevAmount - newAmount);
  }

  Object.assign(w, patch);
  if (isApproved && !w.completedAt) {
    w.completedAt = new Date().toISOString();
  }

  localStorage.setItem(PREFIX + email.toLowerCase(), JSON.stringify(st));
  window.dispatchEvent(new Event(EVT));
}

export function useAllWithdrawals(): AdminWithdrawal[] {
  const subscribe = (cb: () => void) => {
    const h = () => cb();
    window.addEventListener(EVT, h);
    window.addEventListener("storage", h);
    return () => {
      window.removeEventListener(EVT, h);
      window.removeEventListener("storage", h);
    };
  };
  const getSnapshot = () => {
    if (typeof window === "undefined") return "";
    let s = "";
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith(PREFIX)) s += k + ":" + (localStorage.getItem(k)?.length ?? 0) + "|";
    }
    return s;
  };
  useSyncExternalStore(subscribe, getSnapshot, () => "");
  return listAllWithdrawals();
}

export type AdminActivity = {
  id: string;
  type: "buzzer" | "customer" | "system";
  actor: string;
  title: string;
  description: string;
  amount: number | null;
  createdAt: string;
};

const ADMIN_ACTIVITY_KEY = "buzzhub.admin.activities";

export function recordAdminActivity(input: Omit<AdminActivity, "id" | "createdAt">) {
  const current = readAdminActivity();
  const item: AdminActivity = {
    ...input,
    id: `act-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: new Date().toISOString(),
  };
  localStorage.setItem(ADMIN_ACTIVITY_KEY, JSON.stringify([item, ...current]));
  window.dispatchEvent(new Event(EVT));
}

export function readAdminActivity(): AdminActivity[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(ADMIN_ACTIVITY_KEY);
    return raw ? (JSON.parse(raw) as AdminActivity[]) : [];
  } catch {
    return [];
  }
}

export function listAdminActivity(): AdminActivity[] {
  return readAdminActivity().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function addCompletedJobPayout(
  email: string,
  jobId: string,
  jobTitle: string,
  amount: number,
  adminShare = 0,
) {
  const st = readByEmail(email);
  if (!st) return;

  const payout = Number(amount || 0);
  if (payout <= 0) return;
  const existingEarning = st.earnings.find((earning) => earning.jobId === jobId && earning.status === "Berhasil");
  if (existingEarning) return;

  st.balance += payout;
  st.earnings = [
    {
      id: `e-${Date.now()}`,
      date: today(),
      jobId,
      jobTitle,
      amount: payout,
      status: "Berhasil",
    },
    ...st.earnings.filter((e) => e.jobId !== jobId),
  ];
  st.profile.jobsCompleted = Math.max(st.profile.jobsCompleted, st.earnings.filter((e) => e.status === "Berhasil").length);
  localStorage.setItem(PREFIX + email.toLowerCase(), JSON.stringify(st));

  if (Number(adminShare || 0) > 0) {
    recordAdminActivity({
      type: "buzzer",
      actor: st.profile.name,
      title: "Pekerjaan selesai",
      description: `${jobTitle} selesai dan admin mendapat bagian komisi ${Number(adminShare).toLocaleString("id-ID")}`,
      amount: Number(adminShare),
    });
  }

  window.dispatchEvent(new Event(EVT));
}
