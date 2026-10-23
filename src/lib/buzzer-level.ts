// Level buzzer — ditetapkan admin saat verifikasi akun media sosial.
// Sumber data: tabel `buzzer_levels` (ambang & payout, dapat diatur admin)
// dan kolom level/verified_followers pada `buzzer_wallets`.
import { useEffect, useSyncExternalStore } from "react";
import { isSupabaseConfigured, supabase } from "@/integrations/supabase/client";
import type { SocialAccount } from "@/lib/social-store";

export type BuzzerLevelName = "Bronze" | "Silver" | "Gold" | "Platinum" | "Diamond";

export type BuzzerLevel = {
  name: BuzzerLevelName;
  minFollowers: number;
  maxFollowers: number | null;
  /** Payout per job untuk level ini (rupiah), diatur admin di database */
  payout: number;
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

/** Ambang default (dipakai sebelum data database termuat). */
const DEFAULT_LEVELS: BuzzerLevel[] = [
  { name: "Bronze", minFollowers: 0, maxFollowers: 10_000, payout: 0, badgeClass: BADGE.Bronze, emoji: "🥉" },
  { name: "Silver", minFollowers: 10_001, maxFollowers: 50_000, payout: 0, badgeClass: BADGE.Silver, emoji: "🥈" },
  { name: "Gold", minFollowers: 50_001, maxFollowers: 100_000, payout: 0, badgeClass: BADGE.Gold, emoji: "🥇" },
  { name: "Platinum", minFollowers: 100_001, maxFollowers: 500_000, payout: 0, badgeClass: BADGE.Platinum, emoji: "💎" },
  { name: "Diamond", minFollowers: 500_001, maxFollowers: null, payout: 0, badgeClass: BADGE.Diamond, emoji: "👑" },
];

let LEVELS: BuzzerLevel[] = DEFAULT_LEVELS;
let VERSION = 0;
const listeners = new Set<() => void>();
const emit = () => { VERSION += 1; listeners.forEach((l) => l()); };
const subscribe = (cb: () => void) => { listeners.add(cb); return () => { listeners.delete(cb); }; };

type LevelRow = {
  name: string; sort_order: number; min_followers: number;
  max_followers: number | null; payout_per_job: number; emoji: string;
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

/** Daftar level (ambang + payout) yang reaktif terhadap perubahan admin. */
export function useBuzzerLevels(): BuzzerLevel[] {
  useSyncExternalStore(subscribe, () => VERSION, () => 0);
  useEffect(() => { void refreshLevels(); }, []);
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

/** Followers yang dihitung: hanya akun media sosial terverifikasi admin. */
export function countedFollowers(accounts: SocialAccount[]): number {
  return accounts
    .filter((a) => a.verification === "Terverifikasi")
    .reduce((s, a) => s + a.followers, 0);
}

export const verifiedFollowersOf = countedFollowers;

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
 */
export async function assignLevelFromVerification(
  email: string,
  name: string,
  verifiedFollowers: number,
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
  useEffect(() => { void refreshAssignedLevels(); }, []);
  return ASSIGNED;
}

/**
 * Level buzzer aktif: yang sudah ditetapkan admin. Jika belum ada penetapan,
 * buzzer belum memiliki level (null) dan payout mengikuti payout campaign.
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
    /** Payout final untuk sebuah job: pakai payout level bila sudah ditetapkan. */
    payout: (base: number) => (level && level.payout > 0 ? level.payout : base),
  };
}
