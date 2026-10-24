import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { n as supabase, t as isSupabaseConfigured } from "./client-DwoA1QoZ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/buzzer-level-B8egucK7.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var BADGE = {
	Bronze: "bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300",
	Silver: "bg-slate-200 text-slate-700 dark:bg-slate-400/15 dark:text-slate-200",
	Gold: "bg-yellow-100 text-yellow-800 dark:bg-yellow-500/15 dark:text-yellow-300",
	Platinum: "bg-cyan-100 text-cyan-800 dark:bg-cyan-500/15 dark:text-cyan-300",
	Diamond: "bg-violet-100 text-violet-800 dark:bg-violet-500/15 dark:text-violet-300"
};
var BUZZER_LEVEL_PERCENTAGES = {
	Bronze: 40,
	Silver: 45,
	Gold: 50,
	Platinum: 55,
	Diamond: 60
};
function getBuzzerPercentageForLevel(levelName) {
	if (!levelName) return 40;
	return BUZZER_LEVEL_PERCENTAGES[levelName] ?? 40;
}
/** Ambang default (dipakai sebelum data database termuat). */
var DEFAULT_LEVELS = [
	{
		name: "Bronze",
		minFollowers: 0,
		maxFollowers: 1e4,
		payout: 0,
		badgeClass: BADGE.Bronze,
		emoji: "🥉"
	},
	{
		name: "Silver",
		minFollowers: 10001,
		maxFollowers: 5e4,
		payout: 0,
		badgeClass: BADGE.Silver,
		emoji: "🥈"
	},
	{
		name: "Gold",
		minFollowers: 50001,
		maxFollowers: 1e5,
		payout: 0,
		badgeClass: BADGE.Gold,
		emoji: "🥇"
	},
	{
		name: "Platinum",
		minFollowers: 100001,
		maxFollowers: 5e5,
		payout: 0,
		badgeClass: BADGE.Platinum,
		emoji: "💎"
	},
	{
		name: "Diamond",
		minFollowers: 500001,
		maxFollowers: null,
		payout: 0,
		badgeClass: BADGE.Diamond,
		emoji: "👑"
	}
];
var LEVELS = DEFAULT_LEVELS;
var VERSION = 0;
var listeners = /* @__PURE__ */ new Set();
var emit = () => {
	VERSION += 1;
	listeners.forEach((l) => l());
};
var subscribe = (cb) => {
	listeners.add(cb);
	return () => {
		listeners.delete(cb);
	};
};
async function refreshLevels() {
	if (!isSupabaseConfigured()) {
		LEVELS = DEFAULT_LEVELS;
		emit();
		return;
	}
	const { data } = await supabase.from("buzzer_levels").select("*").order("sort_order");
	if (!data) return;
	LEVELS = data.map((r) => ({
		name: r.name,
		minFollowers: Number(r.min_followers),
		maxFollowers: r.max_followers === null ? null : Number(r.max_followers),
		payout: Number(r.payout_per_job),
		badgeClass: BADGE[r.name] ?? BADGE.Bronze,
		emoji: r.emoji || "⭐"
	}));
	emit();
}
/** Daftar level (ambang + payout) yang reaktif terhadap perubahan admin. */
function useBuzzerLevels() {
	(0, import_react.useSyncExternalStore)(subscribe, () => VERSION, () => 0);
	(0, import_react.useEffect)(() => {
		refreshLevels();
	}, []);
	return LEVELS;
}
function levelFromFollowers(followers, levels = LEVELS) {
	let lv = levels[0];
	for (const l of levels) if (followers >= l.minFollowers) lv = l;
	return lv;
}
function levelByName(name, levels = LEVELS) {
	if (!name) return null;
	return levels.find((l) => l.name === name) ?? null;
}
function nextLevel(followers, levels = LEVELS) {
	return levels.find((l) => l.minFollowers > followers) ?? null;
}
function levelProgress(followers, levels = LEVELS) {
	const cur = levelFromFollowers(followers, levels);
	const nxt = nextLevel(followers, levels);
	if (!nxt) return 100;
	const span = nxt.minFollowers - cur.minFollowers;
	if (span <= 0) return 100;
	return Math.min(100, Math.round((followers - cur.minFollowers) / span * 100));
}
/** Followers yang dihitung: hanya akun media sosial terverifikasi admin. */
function countedFollowers(accounts) {
	return accounts.filter((a) => a.verification === "Terverifikasi").reduce((s, a) => s + a.followers, 0);
}
var ASSIGNED = {};
var AVERSION = 0;
var aListeners = /* @__PURE__ */ new Set();
var aEmit = () => {
	AVERSION += 1;
	aListeners.forEach((l) => l());
};
var aSubscribe = (cb) => {
	aListeners.add(cb);
	return () => {
		aListeners.delete(cb);
	};
};
async function refreshAssignedLevels() {
	if (!isSupabaseConfigured()) {
		ASSIGNED = {};
		aEmit();
		return;
	}
	const { data } = await supabase.from("buzzer_wallets").select("buzzer_email, level, verified_followers, level_assigned_at");
	if (!data) return;
	const next = {};
	for (const r of data) next[r.buzzer_email.toLowerCase()] = {
		email: r.buzzer_email,
		level: r.level ?? null,
		verifiedFollowers: r.verified_followers ?? 0,
		assignedAt: r.level_assigned_at
	};
	ASSIGNED = next;
	aEmit();
}
/**
* Admin menetapkan level buzzer berdasarkan total followers terverifikasi
* saat proses verifikasi. Level TIDAK naik otomatis di luar proses ini.
*/
async function assignLevelFromVerification(email, name, verifiedFollowers) {
	const lc = email.trim().toLowerCase();
	if (LEVELS === DEFAULT_LEVELS) await refreshLevels();
	const lv = levelFromFollowers(verifiedFollowers);
	const oldLevel = ASSIGNED[lc]?.level;
	const { error } = await supabase.from("buzzer_wallets").upsert({
		buzzer_email: lc,
		buzzer_name: name || lc.split("@")[0],
		level: lv.name,
		verified_followers: verifiedFollowers,
		level_assigned_at: (/* @__PURE__ */ new Date()).toISOString()
	}, { onConflict: "buzzer_email" });
	if (!error && oldLevel && oldLevel !== lv.name) {
		const ORDER = {
			Bronze: 1,
			Silver: 2,
			Gold: 3,
			Platinum: 4,
			Diamond: 5
		};
		const oldOrder = ORDER[oldLevel] ?? 0;
		if ((ORDER[lv.name] ?? 0) > oldOrder) import("./buzzer-notification-store-FTM4e37g.mjs").then(({ notifyLevelUp }) => {
			notifyLevelUp({
				buzzerEmail: lc,
				newLevel: lv.name
			});
		}).catch(() => {});
	}
	await refreshAssignedLevels();
	return error ? null : lv;
}
function useAssignedLevels() {
	(0, import_react.useSyncExternalStore)(aSubscribe, () => AVERSION, () => 0);
	(0, import_react.useEffect)(() => {
		refreshAssignedLevels();
	}, []);
	return ASSIGNED;
}
/**
* Level buzzer aktif: yang sudah ditetapkan admin. Jika belum ada penetapan,
* buzzer belum memiliki level (null) dan payout mengikuti payout campaign.
*/
function useBuzzerLevel(email) {
	const levels = useBuzzerLevels();
	const assigned = useAssignedLevels();
	const rec = email ? assigned[email.trim().toLowerCase()] : void 0;
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
		payout: (base) => level && level.payout > 0 ? level.payout : base
	};
}
//#endregion
export { levelProgress as a, useBuzzerLevel as c, levelFromFollowers as i, useBuzzerLevels as l, countedFollowers as n, nextLevel as o, getBuzzerPercentageForLevel as r, useAssignedLevels as s, assignLevelFromVerification as t };
