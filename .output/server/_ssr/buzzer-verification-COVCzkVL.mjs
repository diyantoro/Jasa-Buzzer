import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { n as supabase, t as isSupabaseConfigured } from "./client-DwoA1QoZ.mjs";
import { t as assignLevelFromVerification } from "./buzzer-level-B8egucK7.mjs";
import { _ as notifySocialAccountVerified, f as notifyBuzzerApplicationStatus } from "./router-BuTnQWI2.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/buzzer-verification-COVCzkVL.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var SOCIAL_PLATFORMS = [
	"Instagram",
	"TikTok",
	"Facebook",
	"X (Twitter)",
	"YouTube",
	"LinkedIn",
	"Threads",
	"Telegram"
];
function getSocialProfileUrl(account) {
	const storedUrl = (account.profileUrl || "").trim();
	if (!storedUrl) return null;
	const withProtocol = /^https?:\/\//i.test(storedUrl) ? storedUrl : "https://" + storedUrl;
	try {
		const parsed = new URL(withProtocol);
		if (!parsed.hostname || !parsed.hostname.includes(".")) return null;
		return withProtocol;
	} catch {
		return null;
	}
}
function fromRow$1(r) {
	return {
		id: r.id,
		buzzerEmail: r.buzzer_email,
		buzzerName: r.buzzer_name,
		platform: r.platform,
		username: r.username,
		accountName: r.account_name,
		profileUrl: r.profile_url,
		followers: r.followers,
		following: r.following_count,
		posts: r.posts,
		category: r.category,
		bio: r.bio,
		photoUrl: r.photo_url ?? void 0,
		verification: r.verification,
		rejectionNote: r.rejection_note ?? void 0,
		isActive: r.is_active,
		createdAt: r.created_at,
		updatedAt: r.updated_at,
		pendingFollowers: r.pending_followers ?? void 0,
		pendingProofUrl: r.pending_proof_url ?? void 0,
		pendingSubmittedAt: r.pending_submitted_at ?? void 0,
		pendingVerification: r.pending_verification,
		pendingRejectionNote: r.pending_rejection_note ?? void 0
	};
}
var CACHE = [];
var VERSION = 0;
var loading = false;
var listeners = /* @__PURE__ */ new Set();
var socialRealtimeChannel = null;
var socialRealtimeReady = false;
function emit() {
	VERSION += 1;
	listeners.forEach((l) => l());
}
function subscribe(cb) {
	listeners.add(cb);
	return () => {
		listeners.delete(cb);
	};
}
var activeSubscribers = 0;
function ensureSocialRealtime() {
	if (!isSupabaseConfigured() || !supabase || socialRealtimeReady) return;
	try {
		socialRealtimeChannel = supabase.channel("social_accounts_stream");
		socialRealtimeChannel.on("postgres_changes", {
			event: "*",
			schema: "public",
			table: "social_accounts"
		}, () => {
			refreshSocialAccounts();
		}).subscribe();
		socialRealtimeReady = true;
	} catch {
		socialRealtimeReady = false;
	}
}
async function refreshSocialAccounts() {
	if (typeof window === "undefined" || !isSupabaseConfigured()) return;
	loading = true;
	const { data, error } = await supabase.from("social_accounts").select("*").order("followers", { ascending: false });
	loading = false;
	if (error || !data) return;
	CACHE = data.map(fromRow$1);
	emit();
}
function useSocialData() {
	(0, import_react.useSyncExternalStore)(subscribe, () => VERSION, () => 0);
	(0, import_react.useEffect)(() => {
		if (!isSupabaseConfigured()) {
			CACHE = [];
			socialRealtimeReady = false;
			if (socialRealtimeChannel) {
				try {
					supabase.removeChannel(socialRealtimeChannel);
				} catch {}
				socialRealtimeChannel = null;
			}
			emit();
			return;
		}
		activeSubscribers += 1;
		refreshSocialAccounts();
		ensureSocialRealtime();
		const onUpdate = () => {
			refreshSocialAccounts();
		};
		window.addEventListener("buzzhub:social-accounts-updated", onUpdate);
		window.addEventListener("buzzhub:buzzer-store", onUpdate);
		return () => {
			activeSubscribers = Math.max(0, activeSubscribers - 1);
			window.removeEventListener("buzzhub:social-accounts-updated", onUpdate);
			window.removeEventListener("buzzhub:buzzer-store", onUpdate);
			if (activeSubscribers === 0 && socialRealtimeChannel) {
				try {
					supabase.removeChannel(socialRealtimeChannel);
				} catch {}
				socialRealtimeChannel = null;
				socialRealtimeReady = false;
			}
		};
	}, []);
	return CACHE;
}
function useSocialAccounts(email, name) {
	const all = useSocialData();
	const em = (email ?? "").trim().toLowerCase();
	const nm = name ?? "Buzzer";
	return {
		accounts: em ? all.filter((a) => a.buzzerEmail.trim().toLowerCase() === em) : [],
		ready: !!em,
		loading,
		add: async (a) => {
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
				is_active: false
			});
			if (error) return false;
			await refreshSocialAccounts();
			return true;
		},
		update: async (id, patch) => {
			if (!isSupabaseConfigured()) return;
			await adminUpdateAccount(em, id, patch);
		},
		remove: async (id) => {
			if (!isSupabaseConfigured()) return;
			await adminRemoveAccount(em, id);
		},
		toggleActive: async (id) => {
			if (!isSupabaseConfigured()) return;
			await adminToggleActive(em, id);
		}
	};
}
function useAllSocialAccounts() {
	return useSocialData();
}
function toRowPatch(patch) {
	const p = {};
	if (patch.platform !== void 0) p.platform = patch.platform;
	if (patch.username !== void 0) p.username = patch.username;
	if (patch.accountName !== void 0) p.account_name = patch.accountName;
	if (patch.profileUrl !== void 0) p.profile_url = patch.profileUrl;
	if (patch.followers !== void 0) p.followers = patch.followers;
	if (patch.following !== void 0) p.following_count = patch.following;
	if (patch.posts !== void 0) p.posts = patch.posts;
	if (patch.category !== void 0) p.category = patch.category;
	if (patch.bio !== void 0) p.bio = patch.bio;
	if (patch.photoUrl !== void 0) p.photo_url = patch.photoUrl ?? null;
	if (patch.verification !== void 0) p.verification = patch.verification;
	if (patch.rejectionNote !== void 0) p.rejection_note = patch.rejectionNote ?? null;
	if (patch.isActive !== void 0) p.is_active = patch.isActive;
	return p;
}
async function syncBuzzerFollowersToProfile(buzzerEmail) {
	if (!buzzerEmail || !isSupabaseConfigured() || !supabase) return;
	const em = buzzerEmail.trim().toLowerCase();
	const { data: accounts } = await supabase.from("social_accounts").select("followers, platform, verification").eq("buzzer_email", em).ilike("verification", "Terverifikasi");
	const totalFollowers = (accounts ?? []).reduce((sum, a) => sum + (Number(a.followers) || 0), 0);
	if (totalFollowers >= 0) {
		await Promise.all([
			supabase.from("app_accounts").update({ followers: totalFollowers }).eq("email", em).eq("role", "buzzer"),
			supabase.from("buzzer_applications").update({ followers: totalFollowers }).eq("email", em),
			supabase.from("buzzer_wallets").update({
				followers: totalFollowers,
				verified_followers: totalFollowers
			}).eq("buzzer_email", em),
			assignLevelFromVerification(em, "", totalFollowers)
		]);
		if (typeof window !== "undefined") try {
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
		} catch {}
	}
}
async function adminUpdateAccount(email, id, patch) {
	await supabase.from("social_accounts").update(toRowPatch(patch)).eq("id", id);
	await refreshSocialAccounts();
	await syncBuzzerFollowersToProfile(email);
}
async function adminApproveSocialAccount(id) {
	let account = CACHE.find((item) => item.id === id);
	if (!account) {
		const { data: directData } = await supabase.from("social_accounts").select("*").eq("id", id).maybeSingle();
		if (directData) account = fromRow$1(directData);
	}
	if (!account) return false;
	const update = {
		verification: "Terverifikasi",
		is_active: true,
		pending_verification: null,
		pending_rejection_note: null,
		rejection_note: null,
		updated_at: (/* @__PURE__ */ new Date()).toISOString()
	};
	if (account.pendingFollowers != null) {
		update.followers = account.pendingFollowers;
		update.pending_followers = null;
		update.pending_proof_url = null;
		update.pending_submitted_at = null;
	}
	const { error } = await supabase.from("social_accounts").update(update).eq("id", id);
	await refreshSocialAccounts();
	if (!error) {
		await syncBuzzerFollowersToProfile(account.buzzerEmail);
		notifySocialAccountVerified({
			buzzerEmail: account.buzzerEmail,
			platform: account.platform,
			username: account.username,
			status: "approved"
		});
		if (typeof window !== "undefined") {
			window.dispatchEvent(new CustomEvent("buzzhub:social-accounts-updated", { detail: { email: account.buzzerEmail } }));
			window.dispatchEvent(new Event("storage"));
		}
	}
	return !error;
}
async function adminRejectSocialAccount(id, reason) {
	const account = CACHE.find((item) => item.id === id);
	if (!account) return false;
	const cleanReason = reason.trim() || "Pembaruan akun ditolak admin";
	const update = {
		pending_verification: "Ditolak",
		pending_rejection_note: cleanReason,
		updated_at: (/* @__PURE__ */ new Date()).toISOString()
	};
	if (account.verification === "Menunggu") {
		update.verification = "Ditolak";
		update.is_active = false;
		update.rejection_note = cleanReason;
	}
	const { error } = await supabase.from("social_accounts").update(update).eq("id", id);
	await refreshSocialAccounts();
	if (!error) notifySocialAccountVerified({
		buzzerEmail: account.buzzerEmail,
		platform: account.platform,
		username: account.username,
		status: "rejected",
		reason: cleanReason
	});
	return !error;
}
async function adminRemoveAccount(_email, id) {
	const account = CACHE.find((item) => item.id === id);
	await supabase.from("social_accounts").delete().eq("id", id);
	await refreshSocialAccounts();
	if (account?.buzzerEmail) await syncBuzzerFollowersToProfile(account.buzzerEmail);
}
async function adminToggleActive(_email, id) {
	const cur = CACHE.find((a) => a.id === id);
	if (!cur) return;
	await supabase.from("social_accounts").update({ is_active: !cur.isActive }).eq("id", id);
	await refreshSocialAccounts();
	await syncBuzzerFollowersToProfile(cur.buzzerEmail);
}
async function buzzerDeactivateAccount(email, id, reason) {
	if (!isSupabaseConfigured() || !supabase) return false;
	const em = email.trim().toLowerCase();
	const updateData = { updated_at: (/* @__PURE__ */ new Date()).toISOString() };
	if (reason && reason.trim()) updateData.rejection_note = `[Permintaan Nonaktif/Hapus]: ${reason.trim()}`;
	const { error } = await supabase.from("social_accounts").update(updateData).eq("id", id).eq("buzzer_email", em);
	if (error) {
		console.error("Gagal menonaktifkan akun:", error);
		return false;
	}
	await refreshSocialAccounts();
	await syncBuzzerFollowersToProfile(em);
	return true;
}
async function adminApproveDeactivationRequest(id) {
	const account = CACHE.find((item) => item.id === id);
	if (!account) return false;
	const update = {
		is_active: false,
		rejection_note: `[Nonaktif]: ${account.rejectionNote?.replace("[Permintaan Nonaktif/Hapus]: ", "") || ""}`,
		updated_at: (/* @__PURE__ */ new Date()).toISOString()
	};
	const { error } = await supabase.from("social_accounts").update(update).eq("id", id);
	await refreshSocialAccounts();
	if (!error && account.buzzerEmail) await syncBuzzerFollowersToProfile(account.buzzerEmail);
	return !error;
}
async function adminRejectDeactivationRequest(id, reason) {
	if (!CACHE.find((item) => item.id === id)) return false;
	const update = {
		rejection_note: `[Penolakan Nonaktif/Hapus]: ${reason.trim()}`,
		updated_at: (/* @__PURE__ */ new Date()).toISOString()
	};
	const { error } = await supabase.from("social_accounts").update(update).eq("id", id);
	await refreshSocialAccounts();
	return !error;
}
async function buzzerUpdateAccount(email, id, data) {
	if (!isSupabaseConfigured() || !supabase) return {
		ok: false,
		message: "Supabase tidak terhubung"
	};
	const em = email.trim().toLowerCase();
	const existingAccount = CACHE.find((item) => item.id === id);
	const updatePayload = {
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
		pending_submitted_at: (/* @__PURE__ */ new Date()).toISOString(),
		pending_rejection_note: null,
		updated_at: (/* @__PURE__ */ new Date()).toISOString()
	};
	if (existingAccount && existingAccount.verification === "Ditolak") {
		updatePayload.verification = "Menunggu";
		updatePayload.rejection_note = null;
	}
	if (data.pendingFollowers !== void 0 && data.pendingProofUrl) {
		updatePayload.pending_followers = data.pendingFollowers;
		updatePayload.pending_proof_url = data.pendingProofUrl;
	}
	const { error } = await supabase.from("social_accounts").update(updatePayload).eq("id", id).eq("buzzer_email", em);
	if (error) {
		console.error("Gagal memperbarui akun buzzer:", error);
		return {
			ok: false,
			message: error.message
		};
	}
	await refreshSocialAccounts();
	await syncBuzzerFollowersToProfile(em);
	return { ok: true };
}
/** Dipakai halaman pendaftaran buzzer (belum ada sesi login). */
async function submitSocialAccounts(buzzerEmail, buzzerName, accounts) {
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
		is_active: false
	}));
	const { error } = await supabase.from("social_accounts").upsert(rows, { onConflict: "buzzer_email,platform,username" });
	return !error;
}
var KEY = "buzzhub.buzzer-applications";
var EVT = "buzzhub:buzzer-applications";
function seed() {
	return [];
}
function read() {
	if (typeof window === "undefined") return [];
	try {
		const raw = localStorage.getItem(KEY);
		if (raw) return JSON.parse(raw);
	} catch {}
	const s = seed();
	localStorage.setItem(KEY, JSON.stringify(s));
	return s;
}
function write(list) {
	localStorage.setItem(KEY, JSON.stringify(list));
	window.dispatchEvent(new Event(EVT));
}
function extractBuzzerCategory(r) {
	if (r.buzzer_category) return r.buzzer_category;
	const match = r.bio?.match(/\[Kategori Buzzer:\s*(.*?)\]/i);
	if (match?.[1]) return match[1].trim();
	return "Buzzer Online";
}
function cleanBio(bio) {
	if (!bio) return void 0;
	return bio.replace(/\[Kategori Buzzer:\s*.*?\]/gi, "").trim() || void 0;
}
function fromRow(r) {
	return {
		id: r.id,
		name: r.name,
		email: r.email,
		username: r.username,
		platform: r.platform,
		platforms: r.platforms ?? void 0,
		followers: r.followers,
		phone: r.phone ?? void 0,
		city: r.city ?? void 0,
		address: r.address ?? void 0,
		category: r.category ?? void 0,
		buzzerCategory: extractBuzzerCategory(r),
		bio: cleanBio(r.bio),
		submittedAt: r.submitted_at,
		status: r.status,
		reviewedAt: r.reviewed_at ?? void 0,
		reviewNote: r.review_note ?? void 0
	};
}
function toRow(a) {
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
		review_note: a.reviewNote ?? null
	};
}
async function upsertRemote(a) {
	try {
		const row = toRow(a);
		const { error } = await supabase.from("buzzer_applications").upsert(row, { onConflict: "email" });
		if (error && error.message?.includes("buzzer_category")) {
			delete row.buzzer_category;
			await supabase.from("buzzer_applications").upsert(row, { onConflict: "email" });
		}
	} catch {}
}
async function syncApplications() {
	if (typeof window === "undefined") return [];
	try {
		const { data, error } = await supabase.from("buzzer_applications").select("*").order("submitted_at", { ascending: false });
		if (error || !data) return read();
		const remote = data.map(fromRow);
		const emails = new Set(remote.map((a) => a.email.toLowerCase()));
		const localOnly = read().filter((a) => !emails.has(a.email.toLowerCase()));
		const merged = [...remote, ...localOnly];
		write(merged);
		return merged;
	} catch {
		return read();
	}
}
async function getApplicationByEmail(email) {
	const lc = email.trim().toLowerCase();
	try {
		const { data } = await supabase.from("buzzer_applications").select("*").eq("email", lc).maybeSingle();
		if (data) return fromRow(data);
	} catch {}
	return read().find((a) => a.email.toLowerCase() === lc);
}
async function getBuzzerVerificationStatus(email) {
	const lc = email.trim().toLowerCase();
	if (!lc) return null;
	try {
		const { data, error } = await supabase.from("buzzer_applications").select("status").eq("email", lc).maybeSingle();
		if (!error && data?.status) return data.status;
	} catch {}
	try {
		const { data: acc } = await supabase.from("app_accounts").select("role").eq("email", lc).maybeSingle();
		if (acc?.role === "buzzer") return "approved";
	} catch {}
	return null;
}
async function submitApplication(input) {
	const exists = await getApplicationByEmail(input.email);
	if (exists) {
		if (exists.status === "pending") return {
			ok: false,
			message: "Pendaftaran dengan email ini sedang menunggu verifikasi admin."
		};
		if (exists.status === "approved") return {
			ok: false,
			message: "Email ini sudah terverifikasi. Silakan login."
		};
	}
	const app = {
		...input,
		email: input.email.trim().toLowerCase(),
		id: exists?.id ?? "app-" + Date.now(),
		submittedAt: (/* @__PURE__ */ new Date()).toISOString(),
		status: "pending"
	};
	await upsertRemote(app);
	write([app, ...read().filter((a) => a.email.toLowerCase() !== app.email)]);
	notifyBuzzerApplicationStatus({
		buzzerEmail: app.email,
		buzzerName: app.name,
		status: "submitted"
	});
	return {
		ok: true,
		message: exists ? "Pendaftaran ulang terkirim. Menunggu verifikasi admin." : "Pendaftaran terkirim. Menunggu verifikasi admin.",
		application: app
	};
}
async function syncApprovedBuzzerToAccount(app) {
	const email = app.email.trim().toLowerCase();
	try {
		const { data: existing, error: selectError } = await supabase.from("app_accounts").select("email").eq("email", email).maybeSingle();
		if (selectError) return;
		if (existing) {
			await supabase.from("app_accounts").update({
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
				address: app.address ?? null
			}).eq("email", email);
			return;
		}
	} catch {}
}
function reviewLocal(id, status, note) {
	let updated;
	write(read().map((a) => {
		if (a.id !== id) return a;
		updated = {
			...a,
			status,
			reviewedAt: (/* @__PURE__ */ new Date()).toISOString(),
			reviewNote: note
		};
		return updated;
	}));
	if (updated) upsertRemote(updated);
}
async function approveApplication(id, note) {
	const item = read().find((a) => a.id === id);
	reviewLocal(id, "approved", note);
	if (item) {
		await syncApprovedBuzzerToAccount({
			...item,
			status: "approved",
			reviewedAt: (/* @__PURE__ */ new Date()).toISOString(),
			reviewNote: note
		});
		await assignLevelFromVerification(item.email, item.name, item.followers);
		notifyBuzzerApplicationStatus({
			buzzerEmail: item.email,
			buzzerName: item.name,
			status: "approved",
			note
		});
		const email = item.email.trim().toLowerCase();
		try {
			await supabase.from("social_accounts").update({
				verification: "Terverifikasi",
				is_active: true
			}).eq("buzzer_email", email).eq("verification", "Menunggu");
			await syncBuzzerFollowersToProfile(email);
		} catch {}
	}
}
async function rejectApplication(id, note) {
	reviewLocal(id, "rejected", note);
	const item = read().find((a) => a.id === id);
	if (item) {
		await upsertRemote({
			...item,
			status: "rejected",
			reviewNote: note
		});
		notifyBuzzerApplicationStatus({
			buzzerEmail: item.email,
			buzzerName: item.name,
			status: "rejected",
			note
		});
	}
}
async function updateApplication(id, updates) {
	const current = read().find((a) => a.id === id);
	if (!current) return;
	const merged = {
		...current,
		...updates
	};
	write(read().map((a) => a.id === id ? merged : a));
	await upsertRemote(merged);
	if (merged.status === "approved") {
		await syncApprovedBuzzerToAccount(merged);
		await assignLevelFromVerification(merged.email, merged.name, merged.followers);
	}
}
async function deleteApplication(id) {
	const current = read().find((a) => a.id === id);
	write(read().filter((a) => a.id !== id));
	if (current?.email) await supabase.from("buzzer_applications").delete().eq("email", current.email.toLowerCase());
	else await supabase.from("buzzer_applications").delete().eq("id", id);
}
function useBuzzerApplications() {
	const subscribe = (cb) => {
		const h = () => cb();
		window.addEventListener(EVT, h);
		window.addEventListener("storage", h);
		return () => {
			window.removeEventListener(EVT, h);
			window.removeEventListener("storage", h);
		};
	};
	const getSnapshot = () => {
		try {
			return localStorage.getItem(KEY) ?? "";
		} catch {
			return "";
		}
	};
	(0, import_react.useSyncExternalStore)(subscribe, getSnapshot, () => "");
	(0, import_react.useEffect)(() => {
		syncApplications();
	}, []);
	return read();
}
//#endregion
export { useSocialAccounts as S, submitApplication as _, adminRejectSocialAccount as a, useAllSocialAccounts as b, adminUpdateAccount as c, buzzerUpdateAccount as d, deleteApplication as f, rejectApplication as g, getSocialProfileUrl as h, adminRejectDeactivationRequest as i, approveApplication as l, getBuzzerVerificationStatus as m, adminApproveDeactivationRequest as n, adminRemoveAccount as o, getApplicationByEmail as p, adminApproveSocialAccount as r, adminToggleActive as s, SOCIAL_PLATFORMS as t, buzzerDeactivateAccount as u, submitSocialAccounts as v, useBuzzerApplications as x, updateApplication as y };
