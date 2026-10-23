// Store verifikasi pendaftaran buzzer (persist di localStorage + event bus).
import { useEffect, useSyncExternalStore } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Platform } from "./buzzer-store";
import { assignLevelFromVerification } from "./buzzer-level";
import { syncBuzzerFollowersToProfile } from "./social-store";
import { notifyBuzzerApplicationStatus } from "./buzzer-notification-store";

export type BuzzerAppStatus = "pending" | "approved" | "rejected";

export type BuzzerCategoryType = "Buzzer Offline" | "Buzzer Online" | "Buzzer Offline-Online";

export type BuzzerApplication = {
  id: string;
  name: string;
  email: string;
  username: string;
  platform: Platform; // platform utama (kompat lama)
  platforms?: Platform[]; // multi-platform
  followers: number;
  phone?: string;
  city?: string;
  category?: string; // kategori konten (Lifestyle, Kuliner, dll.)
  buzzerCategory?: BuzzerCategoryType | string; // kategori buzzer (Offline, Online, Offline-Online)
  address?: string; // alamat domisili lengkap
  bio?: string;
  submittedAt: string; // ISO
  status: BuzzerAppStatus;
  reviewedAt?: string;
  reviewNote?: string;
};

/* ---------- Tier followers ---------- */
export type BuzzerTier = {
  key: "nano" | "micro" | "menengah" | "makro" | "mega";
  label: string;
  range: string;
  payoutRange: string;
  marketNote: string;
  colorClass: string; // untuk badge
};

export function getBuzzerTier(followers: number): BuzzerTier {
  if (followers >= 1_000_000) return {
    key: "mega", label: "Mega Influencer", range: "1jt+ followers",
    payoutRange: "Rp 2.000.000 – 15.000.000 / job",
    marketNote: "Jangkauan nasional & brand besar. Bayaran per job jauh lebih tinggi dari tier lain.",
    colorClass: "border-pink-500/40 bg-pink-500/10 text-pink-600 dark:text-pink-300",
  };
  if (followers >= 200_000) return {
    key: "makro", label: "Macro Influencer", range: "200rb – 1jt followers",
    payoutRange: "Rp 500.000 – 2.000.000 / job",
    marketNote: "Cocok untuk brand menengah–besar. Rate premium karena audiens luas.",
    colorClass: "border-purple-500/40 bg-purple-500/10 text-purple-600 dark:text-purple-300",
  };
  if (followers >= 50_000) return {
    key: "menengah", label: "Mid-Tier Influencer", range: "50rb – 200rb followers",
    payoutRange: "Rp 150.000 – 500.000 / job",
    marketNote: "Pasar luas dengan engagement stabil. Bayaran lebih tinggi dari micro.",
    colorClass: "border-blue-500/40 bg-blue-500/10 text-blue-600 dark:text-blue-300",
  };
  if (followers >= 10_000) return {
    key: "micro", label: "Micro Influencer", range: "10rb – 50rb followers",
    payoutRange: "Rp 50.000 – 150.000 / job",
    marketNote: "Sweet spot brand lokal. Job rutin, bayaran sedang.",
    colorClass: "border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-300",
  };
  return {
    key: "nano", label: "Nano Buzzer", range: "< 10rb followers",
    payoutRange: "Rp 15.000 – 50.000 / job",
    marketNote: "Pasaran lebih kecil, ideal untuk seeding & campaign volume tinggi.",
    colorClass: "border-amber-500/40 bg-amber-500/10 text-amber-600 dark:text-amber-300",
  };
}

const KEY = "buzzhub.buzzer-applications";
const EVT = "buzzhub:buzzer-applications";

function seed(): BuzzerApplication[] {
  // Tidak ada pengajuan buzzer contoh.
  return [];
}

function read(): BuzzerApplication[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw) as BuzzerApplication[];
  } catch { /* noop */ }
  const s = seed();
  localStorage.setItem(KEY, JSON.stringify(s));
  return s;
}

function write(list: BuzzerApplication[]) {
  localStorage.setItem(KEY, JSON.stringify(list));
  window.dispatchEvent(new Event(EVT));
}

/* ---------- Sinkronisasi database (permanen lintas perangkat) ---------- */

type Row = {
  id: string; name: string; email: string; username: string; platform: string;
  platforms: string[] | null; followers: number; phone: string | null; city: string | null;
  category: string | null; buzzer_category?: string | null; address?: string | null; bio: string | null; submitted_at: string; status: string;
  reviewed_at: string | null; review_note: string | null;
};

function extractBuzzerCategory(r: Row): string {
  if (r.buzzer_category) return r.buzzer_category;
  const match = r.bio?.match(/\[Kategori Buzzer:\s*(.*?)\]/i);
  if (match?.[1]) return match[1].trim();
  return "Buzzer Online";
}

function cleanBio(bio: string | null | undefined): string | undefined {
  if (!bio) return undefined;
  return bio.replace(/\[Kategori Buzzer:\s*.*?\]/gi, "").trim() || undefined;
}

function fromRow(r: Row): BuzzerApplication {
  return {
    id: r.id,
    name: r.name,
    email: r.email,
    username: r.username,
    platform: r.platform as Platform,
    platforms: (r.platforms ?? undefined) as Platform[] | undefined,
    followers: r.followers,
    phone: r.phone ?? undefined,
    city: r.city ?? undefined,
    address: r.address ?? undefined,
    category: r.category ?? undefined,
    buzzerCategory: extractBuzzerCategory(r),
    bio: cleanBio(r.bio),
    submittedAt: r.submitted_at,
    status: r.status as BuzzerAppStatus,
    reviewedAt: r.reviewed_at ?? undefined,
    reviewNote: r.review_note ?? undefined,
  };
}

function toRow(a: BuzzerApplication) {
  const bCat = a.buzzerCategory || "Buzzer Online";
  const rawBio = a.bio?.trim() || "";
  const bioWithCat = rawBio ? `${rawBio}\n\n[Kategori Buzzer: ${bCat}]` : `[Kategori Buzzer: ${bCat}]`;
  return {
    id: a.id,
    name: a.name,
    email: a.email.toLowerCase(),
    username: a.username,
    platform: a.platform,
    platforms: a.platforms ?? [],
    followers: a.followers,
    phone: a.phone ?? null,
    city: a.city ?? null,
    address: a.address ?? null,
    category: a.category ?? null,
    buzzer_category: bCat,
    bio: bioWithCat,
    submitted_at: a.submittedAt,
    status: a.status,
    reviewed_at: a.reviewedAt ?? null,
    review_note: a.reviewNote ?? null,
  };
}

async function upsertRemote(a: BuzzerApplication) {
  try {
    const row = toRow(a);
    const { error } = await supabase.from("buzzer_applications").upsert(row as any, { onConflict: "email" });
    if (error && error.message?.includes("buzzer_category")) {
      delete (row as any).buzzer_category;
      await supabase.from("buzzer_applications").upsert(row as any, { onConflict: "email" });
    }
  } catch { /* offline: cache lokal tetap dipakai */ }
}

export async function syncApplications(): Promise<BuzzerApplication[]> {
  if (typeof window === "undefined") return [];
  try {
    const { data, error } = await supabase
      .from("buzzer_applications")
      .select("*")
      .order("submitted_at", { ascending: false });
    if (error || !data) return read();
    const remote = (data as unknown as Row[]).map(fromRow);
    const emails = new Set(remote.map((a) => a.email.toLowerCase()));
    const localOnly = read().filter((a) => !emails.has(a.email.toLowerCase()));
    const merged = [...remote, ...localOnly];
    write(merged);
    return merged;
  } catch {
    return read();
  }
}

export function listApplications(): BuzzerApplication[] {
  return read();
}

export async function getApplicationByEmail(email: string): Promise<BuzzerApplication | undefined> {
  const lc = email.trim().toLowerCase();
  try {
    const { data } = await supabase
      .from("buzzer_applications")
      .select("*")
      .eq("email", lc)
      .maybeSingle();
    if (data) return fromRow(data as unknown as Row);
  } catch { /* fallback ke cache */ }
  return read().find((a) => a.email.toLowerCase() === lc);
}

export async function getBuzzerVerificationStatus(email: string): Promise<BuzzerAppStatus | null> {
  const lc = email.trim().toLowerCase();
  if (!lc) return null;
  try {
    const { data, error } = await supabase
      .from("buzzer_applications")
      .select("status")
      .eq("email", lc)
      .maybeSingle();
    if (!error && data?.status) {
      return data.status as BuzzerAppStatus;
    }
  } catch {
    // fallback below
  }

  // Fallback: akun buzzer yang sudah terdaftar aktif di app_accounts otomatis diakui approved
  try {
    const { data: acc } = await supabase
      .from("app_accounts")
      .select("role")
      .eq("email", lc)
      .maybeSingle();
    if (acc?.role === "buzzer") {
      return "approved";
    }
  } catch {
    // ignore
  }

  return null;
}

export async function submitApplication(
  input: Omit<BuzzerApplication, "id" | "submittedAt" | "status">,
): Promise<{ ok: boolean; message: string; application?: BuzzerApplication }> {
  const exists = await getApplicationByEmail(input.email);
  if (exists) {
    if (exists.status === "pending") return { ok: false, message: "Pendaftaran dengan email ini sedang menunggu verifikasi admin." };
    if (exists.status === "approved") return { ok: false, message: "Email ini sudah terverifikasi. Silakan login." };
  }
  const app: BuzzerApplication = {
    ...input,
    email: input.email.trim().toLowerCase(),
    id: exists?.id ?? "app-" + Date.now(),
    submittedAt: new Date().toISOString(),
    status: "pending",
  };
  await upsertRemote(app);
  write([app, ...read().filter((a) => a.email.toLowerCase() !== app.email)]);
  void notifyBuzzerApplicationStatus({
    buzzerEmail: app.email,
    buzzerName: app.name,
    status: "submitted",
  });
  return {
    ok: true,
    message: exists ? "Pendaftaran ulang terkirim. Menunggu verifikasi admin." : "Pendaftaran terkirim. Menunggu verifikasi admin.",
    application: app,
  };
}

async function syncApprovedBuzzerToAccount(app: BuzzerApplication) {
  const email = app.email.trim().toLowerCase();

  try {
    const { data: existing, error: selectError } = await supabase
      .from("app_accounts")
      .select("email")
      .eq("email", email)
      .maybeSingle();

    if (selectError) return;

    if (existing) {
      await supabase
        .from("app_accounts")
        .update({
          name: app.name,
          role: "buzzer",
          phone: app.phone ?? null,
          city: app.city ?? null,
          bio: app.bio ?? null,
          industry: app.category ?? null,
          username: app.username ?? null,
          platform: app.platform ?? null,
          followers: app.followers ?? 0,
          company: app.buzzerCategory ?? "Buzzer Online",
          buzzer_category: app.buzzerCategory ?? "Buzzer Online",
          address: app.address ?? null,
        } as any)
        .eq("email", email);
      return;
    }

    // Fallback: no-op if the account was not created earlier by the register flow.
    // The actual registration flow already inserts app_accounts during sign-up,
    // so approval only needs to synchronize and surface the account in admin management.
  } catch {
    // ignore sync failures; admin queue remains functional
  }
}

function reviewLocal(id: string, status: BuzzerAppStatus, note?: string) {
  let updated: BuzzerApplication | undefined;
  const list = read().map((a) => {
    if (a.id !== id) return a;
    updated = { ...a, status, reviewedAt: new Date().toISOString(), reviewNote: note };
    return updated;
  });
  write(list);
  if (updated) void upsertRemote(updated);
}

export async function approveApplication(id: string, note?: string) {
  const item = read().find((a) => a.id === id);
  reviewLocal(id, "approved", note);
  if (item) {
    await syncApprovedBuzzerToAccount({ ...item, status: "approved", reviewedAt: new Date().toISOString(), reviewNote: note });
    await assignLevelFromVerification(item.email, item.name, item.followers);
    void notifyBuzzerApplicationStatus({
      buzzerEmail: item.email,
      buzzerName: item.name,
      status: "approved",
      note,
    });

    // Otomatis verifikasi semua akun media sosial yang didaftarkan saat registrasi.
    // Hanya akun dengan status "Menunggu" yang disetujui — akun yang ditambahkan
    // setelah registrasi (oleh buzzer yang sudah aktif) tetap butuh persetujuan admin terpisah.
    const email = item.email.trim().toLowerCase();
    try {
      await supabase
        .from("social_accounts")
        .update({ verification: "Terverifikasi", is_active: true })
        .eq("buzzer_email", email)
        .eq("verification", "Menunggu");
      await syncBuzzerFollowersToProfile(email);
    } catch {
      // Jangan gagalkan approval akun buzzer hanya karena social media sync gagal
    }
  }
}

export async function rejectApplication(id: string, note?: string) {
  reviewLocal(id, "rejected", note);
  const item = read().find((a) => a.id === id);
  if (item) {
    await upsertRemote({ ...item, status: "rejected", reviewNote: note });
    void notifyBuzzerApplicationStatus({
      buzzerEmail: item.email,
      buzzerName: item.name,
      status: "rejected",
      note,
    });
  }
}

export async function updateApplication(id: string, updates: Partial<BuzzerApplication>) {
  const current = read().find((a) => a.id === id);
  if (!current) return;
  const merged: BuzzerApplication = { ...current, ...updates };
  const list = read().map((a) => (a.id === id ? merged : a));
  write(list);
  await upsertRemote(merged);
  if (merged.status === "approved") {
    await syncApprovedBuzzerToAccount(merged);
    await assignLevelFromVerification(merged.email, merged.name, merged.followers);
  }
}

export async function deleteApplication(id: string) {
  const current = read().find((a) => a.id === id);
  const list = read().filter((a) => a.id !== id);
  write(list);
  if (current?.email) {
    await supabase.from("buzzer_applications").delete().eq("email", current.email.toLowerCase());
  } else {
    await supabase.from("buzzer_applications").delete().eq("id", id);
  }
}

export function useBuzzerApplications(): BuzzerApplication[] {
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
    try { return localStorage.getItem(KEY) ?? ""; } catch { return ""; }
  };
  useSyncExternalStore(subscribe, getSnapshot, () => "");
  useEffect(() => { void syncApplications(); }, []);
  return read();
}
