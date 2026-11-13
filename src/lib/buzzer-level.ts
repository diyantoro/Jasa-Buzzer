// Level buzzer — ditetapkan admin saat verifikasi akun media sosial.
// Sumber data: tabel `buzzer_levels` (ambang & payout, dapat diatur admin)
// dan kolom level/verified_followers pada `buzzer_wallets`.
import { useEffect, useSyncExternalStore } from "react";
import { isSupabaseConfigured, supabase } from "@/integrations/supabase/client";
import type { SocialAccount } from "@/lib/social-store";

export type BuzzerLevelName = "Bronze" | "Silver" | "Gold" | "Platinum" | "Diamond";

/**
 * Kelas buzzer yang dipilih customer saat memesan.
 * - Biasa   → Bronze
 * - Pro     → Silver, Gold
 * - Premium → Platinum, Diamond
 */
export type BuzzerTier = "Biasa" | "Pro" | "Premium";

export type BuzzerLevel = {
  name: BuzzerLevelName;
  minFollowers: number;
  maxFollowers: number | null;
  /** Payout per job untuk level ini (rupiah) — arsip, tidak dipakai lagi */
  payout: number;
  /** Persentase bagian buzzer dari harga job (diatur admin di database) */
  percentage: number;
  /** Kelas buzzer untuk level ini (diatur admin di database) */
  tier: BuzzerTier;
  badgeClass: string;
  emoji: string;
};

const BADGE: Record<BuzzerLevelName, string> = {
  Bronze: "bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300",
  Silver: "bg-slate-200 text-slate-700 dark:bg-slate-400/15 dark:text-slate-200",
  Gold: "bg-yellow-100 text-yellow-800 dark:bg-yellow-500/15 dark:text-yellow-300",
  Platinum: "bg-cyan-100 text-cyan-800 dark:bg-cyan-500/15 dark:text-cyan-300",
  Diamond: "bg-violet-100 text-violet-800 dark:bg-violet-500/15 dark:text-violet-300",
};

export const BUZZER_LEVEL_PERCENTAGES: Record<BuzzerLevelName, number> = {
  Bronze: 40,
  Silver: 45,
  Gold: 50,
  Platinum: 55,
  Diamond: 60,
};

export function getBuzzerPercentageForLevel(levelName?: string | null): number {
  if (!levelName) return 40;
  return (BUZZER_LEVEL_PERCENTAGES as Record<string, number>)[levelName] ?? 40;
}

/* ---------------- Kelas buzzer (Biasa / Pro / Premium) ---------------- */

export const BUZZER_TIERS: BuzzerTier[] = ["Biasa", "Pro", "Premium"];

/** Peringkat kelas: Biasa 1, Pro 2, Premium 3. */
export const BUZZER_TIER_RANK: Record<BuzzerTier, number> = {
  Biasa: 1,
  Pro: 2,
  Premium: 3,
};

/** Rentang followers per kelas (mengikuti ambang level default). */
export const BUZZER_TIER_INFO: Record<
  BuzzerTier,
  { min: number; max: number | null; label: string; description: string; accent: string }
> = {
  Biasa: {
    min: 0,
    max: 10_000,
    label: "Biasa",
    description: "Akun kecil & baru, cocok untuk volume besar",
    accent: "border-amber-300 bg-amber-50 dark:border-amber-500/40 dark:bg-amber-500/10",
  },
  Pro: {
    min: 10_001,
    max: 100_000,
    label: "Pro",
    description: "Akun aktif dengan jangkauan menengah",
    accent: "border-sky-300 bg-sky-50 dark:border-sky-500/40 dark:bg-sky-500/10",
  },
  Premium: {
    min: 100_001,
    max: null,
    label: "Premium",
    description: "Akun besar dengan jangkauan luas",
    accent: "border-violet-300 bg-violet-50 dark:border-violet-500/40 dark:bg-violet-500/10",
  },
};

/** Naik satu tingkat: 6 jam per tingkat. */
export const TIER_RISE_HOURS = 6;
/** Turun satu tingkat: 12 jam, dan hanya satu tingkat. */
export const TIER_FALL_HOURS = 12;

export function normalizeBuzzerTier(value?: string | null): BuzzerTier | null {
  const raw = (value ?? "").toString().trim().toLowerCase();
  if (raw === "biasa" || raw === "basic" || raw === "bronze") return "Biasa";
  if (raw === "pro" || raw === "professional" || raw === "silver" || raw === "gold") return "Pro";
  if (raw === "premium" || raw === "platinum" || raw === "diamond") return "Premium";
  return null;
}

/** Kelas dari nama level (Bronze → Biasa, Silver/Gold → Pro, ...). */
export function tierForLevelName(name?: string | null): BuzzerTier {
  return normalizeBuzzerTier(name) ?? "Biasa";
}

export function tierRank(tier: BuzzerTier): number {
  return BUZZER_TIER_RANK[tier] ?? 1;
}

/** Kelas untuk sebuah jumlah followers. */
export function tierForFollowers(followers: number, levels: BuzzerLevel[] = LEVELS): BuzzerTier {
  const lv = levelFromFollowers(Math.max(0, Number(followers) || 0), levels);
  return lv.tier ?? tierForLevelName(lv.name);
}

/** Label rentang followers, mis. "10.001–100.000" atau "> 500.000". */
export function tierFollowerLabel(tier: BuzzerTier, levels: BuzzerLevel[] = LEVELS): string {
  const inTier = levels.filter((l) => (l.tier ?? tierForLevelName(l.name)) === tier);
  if (inTier.length === 0) {
    const info = BUZZER_TIER_INFO[tier];
    return info.max === null
      ? `> ${info.min.toLocaleString("id-ID")}`
      : `${info.min.toLocaleString("id-ID")}–${info.max.toLocaleString("id-ID")}`;
  }
  const min = Math.min(...inTier.map((l) => l.minFollowers));
  const max = inTier.some((l) => l.maxFollowers === null)
    ? null
    : Math.max(...inTier.map((l) => l.maxFollowers ?? 0));
  return max === null
    ? `> ${min.toLocaleString("id-ID")}`
    : `${min.toLocaleString("id-ID")}–${max.toLocaleString("id-ID")}`;
}

/**
 * Kelas buzzer pada sebuah platform: dihitung dari followers akun yang
 * platformnya cocok, terverifikasi, dan masih aktif.
 */
export function tierForPlatform(
  accounts: SocialAccount[],
  platform: string,
  levels: BuzzerLevel[] = LEVELS,
): BuzzerTier | null {
  const key = normalizePlatform(platform);
  if (!key) return null;
  const matched = accounts.filter(
    (a) => normalizePlatform(a.platform) === key && a.verification === "Terverifikasi" && a.isActive !== false,
  );
  if (matched.length === 0) return null;
  const followers = matched.reduce((s, a) => s + (Number(a.followers) || 0), 0);
  return tierForFollowers(followers, levels);
}

/**
 * Apakah buzzer boleh mengambil job kelas tertentu sekarang?
 *
 * - Buzzer sekelas   → boleh langsung.
 * - Buzzer lebih tinggi → boleh setelah 6 jam per tingkat.
 * - Buzzer satu tingkat di bawah → boleh setelah 12 jam (fallback).
 * - Dua tingkat di bawah → tidak pernah.
 */
export function jobTierAccess(params: {
  requiredTier: BuzzerTier;
  buzzerTier: BuzzerTier | null;
  /** Saat job mulai terlihat buzzer (tanggal mulai campaign / dibuatnya job). */
  publishedAt?: string | Date | null;
  now?: Date;
}): {
  eligible: boolean;
  /** Kapan tombol Ambil terbuka, null bila sudah terbuka atau tidak akan pernah. */
  opensAt: Date | null;
  reason: string;
} {
  const { requiredTier, buzzerTier, publishedAt, now = new Date() } = params;
  if (!buzzerTier) {
    return { eligible: false, opensAt: null, reason: "Akun platform ini belum terverifikasi" };
  }

  const requiredRank = tierRank(requiredTier);
  const buzzerRank = tierRank(buzzerTier);
  const start = publishedAt ? new Date(publishedAt) : now;
  const startedAt = Number.isNaN(start.getTime()) ? now : start;
  const hours = Math.max(0, (now.getTime() - startedAt.getTime()) / 3_600_000);

  if (buzzerRank >= requiredRank) {
    const needed = TIER_RISE_HOURS * (buzzerRank - requiredRank);
    if (hours >= needed) {
      return { eligible: true, opensAt: null, reason: "Kelas kamu memenuhi syarat" };
    }
    const opensAt = new Date(startedAt.getTime() + needed * 3_600_000);
    return {
      eligible: false,
      opensAt,
      reason: `Terbuka untuk kelas ${buzzerTier} dalam ${remainingHours(hours, needed)}`,
    };
  }

  if (buzzerRank === requiredRank - 1) {
    if (hours >= TIER_FALL_HOURS) {
      return { eligible: true, opensAt: null, reason: "Job dibuka untuk kelas di bawahnya" };
    }
    const opensAt = new Date(startedAt.getTime() + TIER_FALL_HOURS * 3_600_000);
    return {
      eligible: false,
      opensAt,
      reason: `Job masih diprioritaskan kelas ${requiredTier} — terbuka untuk kamu dalam ${remainingHours(hours, TIER_FALL_HOURS)}`,
    };
  }

  return { eligible: false, opensAt: null, reason: `Butuh buzzer kelas ${requiredTier}` };
}

function remainingHours(elapsed: number, needed: number): string {
  const left = Math.max(0, needed - elapsed);
  const hours = Math.floor(left);
  const minutes = Math.round((left - hours) * 60);
  if (hours <= 0) return `${minutes} menit`;
  return minutes > 0 ? `${hours} jam ${minutes} menit` : `${hours} jam`;
}

/** Ambang default (dipakai sebelum data database termuat). */
const DEFAULT_LEVELS: BuzzerLevel[] = [
  { name: "Bronze", minFollowers: 0, maxFollowers: 10_000, payout: 0, percentage: 40, tier: "Biasa", badgeClass: BADGE.Bronze, emoji: "🥉" },
  { name: "Silver", minFollowers: 10_001, maxFollowers: 50_000, payout: 0, percentage: 45, tier: "Pro", badgeClass: BADGE.Silver, emoji: "🥈" },
  { name: "Gold", minFollowers: 50_001, maxFollowers: 100_000, payout: 0, percentage: 50, tier: "Pro", badgeClass: BADGE.Gold, emoji: "🥇" },
  { name: "Platinum", minFollowers: 100_001, maxFollowers: 500_000, payout: 0, percentage: 55, tier: "Premium", badgeClass: BADGE.Platinum, emoji: "💎" },
  { name: "Diamond", minFollowers: 500_001, maxFollowers: null, payout: 0, percentage: 60, tier: "Premium", badgeClass: BADGE.Diamond, emoji: "👑" },
];

let LEVELS: BuzzerLevel[] = DEFAULT_LEVELS;
let VERSION = 0;
const listeners = new Set<() => void>();
const emit = () => { VERSION += 1; listeners.forEach((l) => l()); };
const subscribe = (cb: () => void) => { listeners.add(cb); return () => { listeners.delete(cb); }; };

type LevelRow = {
  name: string; sort_order: number; min_followers: number;
  max_followers: number | null; payout_per_job: number; emoji: string;
  payout_percentage?: number | null;
  tier?: string | null;
};

export async function refreshLevels() {
  if (!isSupabaseConfigured()) {
    LEVELS = DEFAULT_LEVELS;
    emit();
    return;
  }
  const { data } = await supabase.from("buzzer_levels").select("*").order("sort_order");
  if (!data) return;
  LEVELS = (data as unknown as LevelRow[]).map((r) => ({
    name: r.name as BuzzerLevelName,
    minFollowers: Number(r.min_followers),
    maxFollowers: r.max_followers === null ? null : Number(r.max_followers),
    payout: Number(r.payout_per_job),
    percentage:
      r.payout_percentage === null || r.payout_percentage === undefined
        ? getBuzzerPercentageForLevel(r.name)
        : Number(r.payout_percentage),
    tier: normalizeBuzzerTier(r.tier) ?? tierForLevelName(r.name),
    badgeClass: BADGE[r.name as BuzzerLevelName] ?? BADGE.Bronze,
    emoji: r.emoji || "⭐",
  }));
  emit();
}

export async function updateLevelPayout(name: string, payout: number) {
  const { error } = await supabase.from("buzzer_levels").update({ payout_per_job: payout }).eq("name", name);
  await refreshLevels();
  return !error;
}

/** Ubah persentase bagian buzzer untuk sebuah level (diatur admin). */
export async function updateLevelPercentage(name: string, percentage: number) {
  const { error } = await supabase
    .from("buzzer_levels")
    .update({ payout_percentage: percentage } as any)
    .eq("name", name);
  await refreshLevels();
  return !error;
}

/* ---------------- Sinkronisasi realtime (tanpa reload) ---------------- */

let levelChannel: ReturnType<typeof supabase.channel> | null = null;
let levelSubscribers = 0;
let syncBound = false;

const syncLevelData = () => {
  void refreshAssignedLevels();
  void refreshLevels();
};

const handleVisibility = () => {
  if (typeof document !== "undefined" && document.visibilityState === "visible") syncLevelData();
};

function bindLevelSyncListeners() {
  if (typeof window === "undefined" || syncBound) return;
  syncBound = true;
  window.addEventListener("focus", syncLevelData);
  window.addEventListener("online", syncLevelData);
  window.addEventListener("storage", syncLevelData);
  window.addEventListener("buzzhub:social-accounts-updated", syncLevelData);
  window.addEventListener("buzzhub:buzzer-store", syncLevelData);
  document.addEventListener("visibilitychange", handleVisibility);
}

function unbindLevelSyncListeners() {
  if (typeof window === "undefined" || !syncBound) return;
  syncBound = false;
  window.removeEventListener("focus", syncLevelData);
  window.removeEventListener("online", syncLevelData);
  window.removeEventListener("storage", syncLevelData);
  window.removeEventListener("buzzhub:social-accounts-updated", syncLevelData);
  window.removeEventListener("buzzhub:buzzer-store", syncLevelData);
  document.removeEventListener("visibilitychange", handleVisibility);
}

function ensureLevelRealtime() {
  if (!isSupabaseConfigured() || levelChannel) return;
  levelChannel = supabase
    .channel("buzzer_level_stream")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "buzzer_wallets" },
      () => { void refreshAssignedLevels(); },
    )
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "buzzer_levels" },
      () => { void refreshLevels(); },
    )
    .subscribe();
}

/**
 * Menjaga level tetap sinkron tanpa reload: mendengarkan perubahan tabel
 * `buzzer_wallets`/`buzzer_levels` via Supabase Realtime, plus refresh saat tab
 * kembali fokus (fallback bila websocket terputus).
 */
function useLevelSync() {
  useEffect(() => {
    levelSubscribers += 1;
    // Muat data terbaru saat komponen pertama kali dipasang.
    void refreshLevels();
    void refreshAssignedLevels();
    bindLevelSyncListeners();
    ensureLevelRealtime();

    return () => {
      levelSubscribers = Math.max(0, levelSubscribers - 1);
      if (levelSubscribers > 0) return;
      unbindLevelSyncListeners();
      if (levelChannel) {
        try { void supabase.removeChannel(levelChannel); } catch {}
        levelChannel = null;
      }
    };
  }, []);
}

/** Daftar level (ambang + payout) yang reaktif terhadap perubahan admin. */
export function useBuzzerLevels(): BuzzerLevel[] {
  useSyncExternalStore(subscribe, () => VERSION, () => 0);
  useLevelSync();
  return LEVELS;
}

export function currentLevels(): BuzzerLevel[] {
  return LEVELS;
}

export function levelFromFollowers(followers: number, levels: BuzzerLevel[] = LEVELS): BuzzerLevel {
  let lv = levels[0];
  for (const l of levels) if (followers >= l.minFollowers) lv = l;
  return lv;
}

export function levelByName(name: string | null | undefined, levels: BuzzerLevel[] = LEVELS): BuzzerLevel | null {
  if (!name) return null;
  return levels.find((l) => l.name === name) ?? null;
}

export function nextLevel(followers: number, levels: BuzzerLevel[] = LEVELS): BuzzerLevel | null {
  return levels.find((l) => l.minFollowers > followers) ?? null;
}

export function levelProgress(followers: number, levels: BuzzerLevel[] = LEVELS): number {
  const cur = levelFromFollowers(followers, levels);
  const nxt = nextLevel(followers, levels);
  if (!nxt) return 100;
  const span = nxt.minFollowers - cur.minFollowers;
  if (span <= 0) return 100;
  return Math.min(100, Math.round(((followers - cur.minFollowers) / span) * 100));
}

/**
 * Followers yang dihitung untuk level: hanya akun media sosial yang sudah
 * terverifikasi admin DAN masih aktif. Akun nonaktif tidak lagi menambah level.
 */
export function countedFollowers(accounts: SocialAccount[]): number {
  return accounts
    .filter((a) => a.verification === "Terverifikasi" && a.isActive !== false)
    .reduce((s, a) => s + a.followers, 0);
}

export const verifiedFollowersOf = countedFollowers;

/**
 * Buzzer punya level jika kategorinya memiliki komponen online:
 * - `Buzzer Online`           → punya level
 * - `Buzzer Offline-Online`   → punya level (hybrid, ada bagian online)
 * - `Buzzer Offline` (murni)  → TIDAK punya level
 */
export function isOnlineBuzzerCategory(category?: string | null): boolean {
  const raw = (category ?? "").toString().trim().toLowerCase();
  if (!raw) return true; // Belum ada data kategori → anggap Buzzer Online
  // Nilai di database berbentuk "Buzzer Online", "Buzzer Offline",
  // "Buzzer Offline-Online". Buang prefix "buzzer" sebelum dibandingkan.
  const base = raw.replace(/^buzzer\s+/, "").trim();
  return base !== "offline";
}

/**
 * Semua kategori buzzer sekarang punya level, termasuk `Buzzer Offline`.
 * Level offline hanya badge; nominal bayarannya tetap nominal admin.
 */
export function hasBuzzerLevel(_category?: string | null): boolean {
  return true;
}

/* ---------------- Level per platform & nominal job ---------------- */

/** Samakan penulisan platform ("X (Twitter) " vs "x (twitter)"). */
export function normalizePlatform(platform?: string | null): string {
  return (platform ?? "").toString().trim().toLowerCase();
}

/** Level sebuah angka followers (tanpa melihat akun). */
export function levelForFollowers(followers: number, levels: BuzzerLevel[] = LEVELS): BuzzerLevel {
  return levelFromFollowers(Math.max(0, Number(followers) || 0), levels);
}

/**
 * Level untuk sebuah platform: dihitung dari followers akun milik buzzer
 * yang platformnya cocok, terverifikasi, dan masih aktif.
 * Return `null` bila buzzer tidak punya akun di platform tersebut.
 */
export function levelForPlatform(
  accounts: SocialAccount[],
  platform: string,
  levels: BuzzerLevel[] = LEVELS,
): BuzzerLevel | null {
  const key = normalizePlatform(platform);
  if (!key) return null;
  const matched = accounts.filter(
    (a) => normalizePlatform(a.platform) === key && a.verification === "Terverifikasi" && a.isActive !== false,
  );
  if (matched.length === 0) return null;
  const followers = matched.reduce((s, a) => s + (Number(a.followers) || 0), 0);
  return levelFromFollowers(followers, levels);
}

/** Persentase bagian buzzer untuk sebuah level (nilai diatur admin). */
export function percentageForLevel(
  level?: BuzzerLevel | string | null,
  levels: BuzzerLevel[] = LEVELS,
): number {
  const name = typeof level === "string" ? level : level?.name;
  if (!name) return 40;
  const found = levels.find((l) => l.name.toLowerCase() === name.toLowerCase());
  if (found && Number.isFinite(found.percentage)) return found.percentage;
  return getBuzzerPercentageForLevel(name);
}

/**
 * Nominal yang diterima buzzer untuk sebuah job online:
 * harga job × persentase level akun yang platformnya cocok.
 */
export function payoutForJob(
  grossPrice: number,
  accounts: SocialAccount[],
  platform: string,
  levels: BuzzerLevel[] = LEVELS,
): { level: BuzzerLevel | null; percentage: number; amount: number } {
  const level = levelForPlatform(accounts, platform, levels);
  const percentage = percentageForLevel(level, levels);
  const gross = Math.max(0, Math.round(Number(grossPrice) || 0));
  const amount = Math.min(gross, Math.max(0, Math.round((gross * percentage) / 100)));
  return { level, percentage, amount };
}

/* ---------------- Level yang sudah ditetapkan admin ---------------- */

export type AssignedLevel = {
  email: string;
  level: BuzzerLevelName | null;
  verifiedFollowers: number;
  assignedAt: string | null;
};

let ASSIGNED: Record<string, AssignedLevel> = {};
let AVERSION = 0;
const aListeners = new Set<() => void>();
const aEmit = () => { AVERSION += 1; aListeners.forEach((l) => l()); };
const aSubscribe = (cb: () => void) => { aListeners.add(cb); return () => { aListeners.delete(cb); }; };

type WalletRow = {
  buzzer_email: string; level: string | null;
  verified_followers: number | null; level_assigned_at: string | null;
};

export async function refreshAssignedLevels() {
  if (!isSupabaseConfigured()) {
    ASSIGNED = {};
    aEmit();
    return;
  }
  const { data } = await supabase
    .from("buzzer_wallets")
    .select("buzzer_email, level, verified_followers, level_assigned_at");
  if (!data) return;
  const next: Record<string, AssignedLevel> = {};
  for (const r of data as unknown as WalletRow[]) {
    next[r.buzzer_email.toLowerCase()] = {
      email: r.buzzer_email,
      level: (r.level as BuzzerLevelName | null) ?? null,
      verifiedFollowers: r.verified_followers ?? 0,
      assignedAt: r.level_assigned_at,
    };
  }
  ASSIGNED = next;
  aEmit();
}

/**
 * Admin menetapkan level buzzer berdasarkan total followers terverifikasi
 * saat proses verifikasi. Level TIDAK naik otomatis di luar proses ini.
 *
 * Semua kategori buzzer punya level. Untuk buzzer offline level hanya
 * badge — nominal bayaran tetap `payout_per_buzzer` dari admin.
 */
export async function assignLevelFromVerification(
  email: string,
  name: string,
  verifiedFollowers: number,
  _category?: string | null,
) {
  const lc = email.trim().toLowerCase();
  if (LEVELS === DEFAULT_LEVELS) await refreshLevels();
  const lv = levelFromFollowers(verifiedFollowers);
  const oldRec = ASSIGNED[lc];
  const oldLevel = oldRec?.level;

  const { error } = await supabase.from("buzzer_wallets").upsert({
    buzzer_email: lc,
    buzzer_name: name || lc.split("@")[0],
    level: lv.name,
    verified_followers: verifiedFollowers,
    level_assigned_at: new Date().toISOString(),
  }, { onConflict: "buzzer_email" });

  // Hanya kirim notifikasi jika BENAR-BENAR NAIK LEVEL dari tier sebelumnya yang lebih rendah
  if (!error && oldLevel && oldLevel !== lv.name) {
    const ORDER: Record<string, number> = { Bronze: 1, Silver: 2, Gold: 3, Platinum: 4, Diamond: 5 };
    const oldOrder = ORDER[oldLevel] ?? 0;
    const newOrder = ORDER[lv.name] ?? 0;
    if (newOrder > oldOrder) {
      void import("@/lib/buzzer-notification-store")
        .then(({ notifyLevelUp }) => {
          void notifyLevelUp({ buzzerEmail: lc, newLevel: lv.name });
        })
        .catch(() => {});
    }
  }
  await refreshAssignedLevels();
  return error ? null : lv;
}

export function useAssignedLevels(): Record<string, AssignedLevel> {
  useSyncExternalStore(aSubscribe, () => AVERSION, () => 0);
  useLevelSync();
  return ASSIGNED;
}

/**
 * Level buzzer aktif: status resmi yang ditetapkan admin.
 * Level ini hanya badge/peringkat — bayaran job dihitung dari level akun
 * pada platform job tersebut (`levelForPlatform` + `payoutForJob`).
 */
export function useBuzzerLevel(email: string | undefined) {
  const levels = useBuzzerLevels();
  const assigned = useAssignedLevels();
  const rec = email ? assigned[email.trim().toLowerCase()] : undefined;
  const level = levelByName(rec?.level, levels);
  const followers = rec?.verifiedFollowers ?? 0;

  return {
    levels,
    level,
    assigned: !!level,
    followers,
    assignedAt: rec?.assignedAt ?? null,
    next: nextLevel(followers, levels),
    progress: levelProgress(followers, levels),
    /** Bagian buzzer dari harga job berdasarkan persentase status ini. */
    payout: (base: number) => {
      const gross = Math.max(0, Math.round(Number(base) || 0));
      const pct = percentageForLevel(level, levels);
      return Math.min(gross, Math.max(0, Math.round((gross * pct) / 100)));
    },
  };
}

/* ---------------- Ringkasan ketersediaan buzzer per platform ---------------- */

export type TierAvailability = {
  /** Jumlah akun terverifikasi pada kelas ini. */
  accounts: number;
  /** Jumlah buzzer unik (email berbeda) pada kelas ini. */
  buzzers: number;
  minFollowers: number;
  maxFollowers: number;
};

export type PlatformAvailability = {
  platform: string;
  /** Jumlah buzzer unik yang punya akun terverifikasi di platform ini. */
  buzzers: number;
  accounts: number;
  minFollowers: number;
  maxFollowers: number;
  byTier: Record<BuzzerTier, TierAvailability>;
};

type AvailabilityAccount = {
  platform: string;
  followers: number;
  verification: string;
  isActive?: boolean;
  buzzerEmail?: string;
};

/**
 * Ringkasan agregat buzzer per platform & kelas. Dipakai wizard customer
 * supaya customer tahu followers dan jumlah buzzer yang tersedia tanpa
 * melihat identitas akun.
 */
export function platformAvailability(
  accounts: AvailabilityAccount[],
  levels: BuzzerLevel[] = LEVELS,
): PlatformAvailability[] {
  const groups = new Map<
    string,
    { platform: string; emails: Set<string>; accounts: number; min: number; max: number; tiers: Record<BuzzerTier, { emails: Set<string>; accounts: number; min: number; max: number }> }
  >();

  for (const account of accounts) {
    if (account.verification !== "Terverifikasi" || account.isActive === false) continue;
    const key = normalizePlatform(account.platform);
    if (!key) continue;
    const followers = Math.max(0, Number(account.followers) || 0);
    const tier = tierForFollowers(followers, levels);
    const email = (account.buzzerEmail ?? "").trim().toLowerCase();

    let group = groups.get(key);
    if (!group) {
      group = {
        platform: account.platform,
        emails: new Set<string>(),
        accounts: 0,
        min: followers,
        max: followers,
        tiers: {
          Biasa: { emails: new Set<string>(), accounts: 0, min: followers, max: followers },
          Pro: { emails: new Set<string>(), accounts: 0, min: followers, max: followers },
          Premium: { emails: new Set<string>(), accounts: 0, min: followers, max: followers },
        },
      };
      groups.set(key, group);
    }

    group.accounts += 1;
    group.min = Math.min(group.min, followers);
    group.max = Math.max(group.max, followers);
    if (email) group.emails.add(email);

    const bucket = group.tiers[tier];
    bucket.accounts += 1;
    bucket.min = Math.min(bucket.min, followers);
    bucket.max = Math.max(bucket.max, followers);
    if (email) bucket.emails.add(email);
  }

  return Array.from(groups.values())
    .map((group) => ({
      platform: group.platform,
      buzzers: group.emails.size,
      accounts: group.accounts,
      minFollowers: group.min,
      maxFollowers: group.max,
      byTier: {
        Biasa: {
          accounts: group.tiers.Biasa.accounts,
          buzzers: group.tiers.Biasa.emails.size,
          minFollowers: group.tiers.Biasa.min,
          maxFollowers: group.tiers.Biasa.max,
        },
        Pro: {
          accounts: group.tiers.Pro.accounts,
          buzzers: group.tiers.Pro.emails.size,
          minFollowers: group.tiers.Pro.min,
          maxFollowers: group.tiers.Pro.max,
        },
        Premium: {
          accounts: group.tiers.Premium.accounts,
          buzzers: group.tiers.Premium.emails.size,
          minFollowers: group.tiers.Premium.min,
          maxFollowers: group.tiers.Premium.max,
        },
      },
    }))
    .sort((a, b) => b.buzzers - a.buzzers);
}

/** Format angka followers singkat: 1.200 → "1,2 rb", 150000 → "150 rb". */
export function compactFollowers(value: number): string {
  const n = Math.max(0, Number(value) || 0);
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(n % 1_000_000 === 0 ? 0 : 1).replace(".", ",")} jt`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(n % 1_000 === 0 ? 0 : 1).replace(".", ",")} rb`;
  return n.toLocaleString("id-ID");
}
