import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { _ as createRootRouteWithContext, b as useRouter, g as createFileRoute, h as lazyRouteComponent, l as Scripts, m as Outlet, p as createRouter, u as HeadContent, v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { L as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { s as __exportAll } from "./server-DCVbxAm0.mjs";
import { n as supabase } from "./client-DwoA1QoZ.mjs";
import { t as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { t as Toaster } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-BuTnQWI2.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var formatCurrency = (n) => "Rp " + Math.round(Number(n || 0)).toLocaleString("id-ID");
var LOCAL_STORAGE_KEY_PREFIX = "buzzhub_buzzer_notifs_";
/**
* Deduplikasi notifikasi agar tidak menampilkan duplikat ID atau spam level up berulang
*/
function deduplicateNotifications(list) {
	const seenIds = /* @__PURE__ */ new Set();
	const seenLevelUps = /* @__PURE__ */ new Set();
	const result = [];
	for (const n of list) {
		if (seenIds.has(n.id)) continue;
		seenIds.add(n.id);
		if (n.type === "level_up") {
			const key = `${n.user_id}_${n.metadata?.newLevel || n.message}`;
			if (seenLevelUps.has(key)) continue;
			seenLevelUps.add(key);
		}
		result.push(n);
	}
	return result;
}
function getLocalNotifs(email) {
	if (typeof window === "undefined") return [];
	try {
		const raw = localStorage.getItem(`${LOCAL_STORAGE_KEY_PREFIX}${email}`);
		return deduplicateNotifications(raw ? JSON.parse(raw) : []);
	} catch {
		return [];
	}
}
function saveLocalNotifs(email, list) {
	if (typeof window === "undefined") return;
	try {
		const deduped = deduplicateNotifications(list);
		localStorage.setItem(`${LOCAL_STORAGE_KEY_PREFIX}${email}`, JSON.stringify(deduped));
	} catch {}
}
/**
* Format timestamp menjadi "time ago" dalam Bahasa Indonesia
*/
function formatTimeAgo(isoString) {
	try {
		const date = new Date(isoString);
		const now = /* @__PURE__ */ new Date();
		const diffSec = Math.floor((now.getTime() - date.getTime()) / 1e3);
		if (diffSec < 60) return "Baru saja";
		const diffMin = Math.floor(diffSec / 60);
		if (diffMin < 60) return `${diffMin} menit lalu`;
		const diffHours = Math.floor(diffMin / 60);
		if (diffHours < 24) return `${diffHours} jam lalu`;
		const diffDays = Math.floor(diffHours / 24);
		if (diffDays < 7) return `${diffDays} hari lalu`;
		return date.toLocaleDateString("id-ID", {
			day: "numeric",
			month: "short",
			year: date.getFullYear() !== now.getFullYear() ? "numeric" : void 0
		});
	} catch {
		return isoString;
	}
}
/**
* Hook untuk memuat dan berlangganan notifikasi akun buzzer secara realtime
*/
function useBuzzerNotifications(buzzerEmail) {
	const hookId = (0, import_react.useId)();
	const normalizedEmail = (buzzerEmail ?? "").trim().toLowerCase();
	const [notifications, setNotifications] = (0, import_react.useState)(() => normalizedEmail ? getLocalNotifs(normalizedEmail) : []);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const fetchNotifications = (0, import_react.useCallback)(async () => {
		if (!normalizedEmail) {
			setNotifications([]);
			setLoading(false);
			return;
		}
		try {
			const { data, error } = await supabase.from("notifications").select("*").or(`user_id.eq.${normalizedEmail},buzzer_id.eq.${normalizedEmail}`).order("created_at", { ascending: false }).limit(50);
			if (error) {
				const local = getLocalNotifs(normalizedEmail);
				setNotifications(local);
			} else if (data) {
				const rows = data;
				const local = getLocalNotifs(normalizedEmail);
				const serverIds = new Set(rows.map((r) => r.id));
				const cleaned = deduplicateNotifications([...rows, ...local.filter((l) => !serverIds.has(l.id))].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()));
				setNotifications(cleaned);
				saveLocalNotifs(normalizedEmail, cleaned);
			}
		} catch {
			const local = getLocalNotifs(normalizedEmail);
			setNotifications(local);
		} finally {
			setLoading(false);
		}
	}, [normalizedEmail]);
	(0, import_react.useEffect)(() => {
		if (!normalizedEmail) return;
		(async () => {
			await syncBuzzerActivities(normalizedEmail);
			await fetchNotifications();
		})();
		const interval = setInterval(() => {
			(async () => {
				await syncBuzzerActivities(normalizedEmail);
				await fetchNotifications();
			})();
		}, 4e3);
		const cleanId = (hookId || "").replace(/[^a-zA-Z0-9]/g, "_");
		const channelName = `rt-buzzer-notifs-${normalizedEmail}-${cleanId}`;
		const onLocalNotif = (e) => {
			const customEvent = e;
			if (customEvent.detail?.email === normalizedEmail) {
				const notif = customEvent.detail?.notif;
				if (notif) setNotifications((prev) => {
					return deduplicateNotifications([notif, ...prev.filter((n) => n.id !== notif.id)]);
				});
				else fetchNotifications();
			}
		};
		if (typeof window !== "undefined") window.addEventListener("buzzhub_buzzer_notif_created", onLocalNotif);
		try {
			const existing = supabase.getChannels().find((c) => c.topic === `realtime:${channelName}`);
			if (existing) supabase.removeChannel(existing);
		} catch {}
		let channel = null;
		try {
			channel = supabase.channel(channelName).on("postgres_changes", {
				event: "*",
				schema: "public",
				table: "notifications"
			}, (payload) => {
				const rec = payload.new || payload.old;
				if (!rec || !rec.user_id || rec.user_id.toLowerCase() === normalizedEmail || rec.buzzer_id?.toLowerCase() === normalizedEmail) fetchNotifications();
			}).on("postgres_changes", {
				event: "*",
				schema: "public",
				table: "campaign_jobs"
			}, (payload) => {
				const rec = payload.new || payload.old;
				if (!rec || !rec.buzzer_email || rec.buzzer_email.toLowerCase() === normalizedEmail) (async () => {
					await syncBuzzerActivities(normalizedEmail);
					await fetchNotifications();
				})();
			}).on("postgres_changes", {
				event: "*",
				schema: "public",
				table: "social_accounts"
			}, (payload) => {
				const rec = payload.new || payload.old;
				if (!rec || !rec.buzzer_email || rec.buzzer_email.toLowerCase() === normalizedEmail) (async () => {
					await syncBuzzerActivities(normalizedEmail);
					await fetchNotifications();
				})();
			}).on("postgres_changes", {
				event: "*",
				schema: "public",
				table: "withdrawals"
			}, (payload) => {
				const rec = payload.new || payload.old;
				if (!rec || !rec.buzzer_email || rec.buzzer_email.toLowerCase() === normalizedEmail) (async () => {
					await syncBuzzerActivities(normalizedEmail);
					await fetchNotifications();
				})();
			}).subscribe((status) => {
				if (status === "SUBSCRIBED") (async () => {
					await syncBuzzerActivities(normalizedEmail);
					await fetchNotifications();
				})();
			});
		} catch (err) {
			console.warn("Realtime subscription warning:", err);
		}
		return () => {
			clearInterval(interval);
			if (typeof window !== "undefined") window.removeEventListener("buzzhub_buzzer_notif_created", onLocalNotif);
			if (channel) try {
				supabase.removeChannel(channel);
			} catch {}
		};
	}, [
		normalizedEmail,
		fetchNotifications,
		hookId
	]);
	const markAsRead = async (id) => {
		setNotifications((prev) => {
			const next = prev.map((n) => n.id === id ? {
				...n,
				is_read: true
			} : n);
			if (normalizedEmail) saveLocalNotifs(normalizedEmail, next);
			return next;
		});
		try {
			await supabase.from("notifications").update({
				is_read: true,
				updated_at: (/* @__PURE__ */ new Date()).toISOString()
			}).eq("id", id);
		} catch {}
	};
	const markAllAsRead = async () => {
		if (!normalizedEmail) return;
		setNotifications((prev) => {
			const next = prev.map((n) => ({
				...n,
				is_read: true
			}));
			saveLocalNotifs(normalizedEmail, next);
			return next;
		});
		try {
			await supabase.from("notifications").update({
				is_read: true,
				updated_at: (/* @__PURE__ */ new Date()).toISOString()
			}).or(`user_id.eq.${normalizedEmail},buzzer_id.eq.${normalizedEmail}`).eq("is_read", false);
		} catch {}
	};
	return {
		notifications,
		unreadCount: notifications.filter((n) => !n.is_read).length,
		loading,
		markAsRead,
		markAllAsRead,
		refetch: fetchNotifications
	};
}
/**
* Buat notifikasi baru ke database Supabase dan localStorage
*/
async function createBuzzerNotification(input) {
	const email = input.user_id.trim().toLowerCase();
	const newNotif = {
		id: typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `notif_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
		user_id: email,
		buzzer_id: input.buzzer_id?.trim().toLowerCase() || email,
		title: input.title,
		message: input.message,
		type: input.type,
		is_read: false,
		metadata: input.metadata ?? {},
		created_at: (/* @__PURE__ */ new Date()).toISOString(),
		updated_at: (/* @__PURE__ */ new Date()).toISOString()
	};
	saveLocalNotifs(email, deduplicateNotifications([newNotif, ...getLocalNotifs(email).filter((item) => item.id !== newNotif.id)]).slice(0, 50));
	if (typeof window !== "undefined") try {
		window.dispatchEvent(new CustomEvent("buzzhub_buzzer_notif_created", { detail: {
			email,
			notif: newNotif
		} }));
	} catch {}
	try {
		await supabase.from("notifications").insert({
			id: newNotif.id,
			user_id: email,
			buzzer_id: newNotif.buzzer_id,
			title: newNotif.title,
			message: newNotif.message,
			type: newNotif.type,
			is_read: false,
			metadata: newNotif.metadata ?? {},
			created_at: newNotif.created_at,
			updated_at: newNotif.updated_at
		});
	} catch {}
}
/**
* 1. Notifikasi Bukti Tugas Berhasil Diupload & Menunggu Verifikasi Admin
*/
async function notifyTaskSubmitted(input) {
	const isResubmit = Boolean(input.isResubmit);
	const message = isResubmit ? `Perbaikan bukti tugas "${input.campaignTitle}" berhasil dikirim. Menunggu verifikasi oleh admin.` : `Bukti pengerjaan tugas "${input.campaignTitle}" berhasil diunggah. Menunggu verifikasi oleh admin.`;
	await createBuzzerNotification({
		user_id: input.buzzerEmail,
		title: "Menunggu Verifikasi Admin",
		message,
		type: "verification_pending",
		metadata: {
			jobId: input.jobId,
			campaignTitle: input.campaignTitle,
			action: "task_submitted",
			isResubmit
		}
	});
}
/**
* 2. Notifikasi Tugas Selesai & Disetujui oleh Admin
*/
async function notifyTaskApproved(input) {
	const feeText = formatCurrency(input.fee);
	await createBuzzerNotification({
		user_id: input.buzzerEmail,
		title: "Tugas Selesai & Terverifikasi",
		message: `Tugas "${input.campaignTitle}" sudah selesai dan sudah diverifikasi oleh admin. Fee ${feeText} telah masuk ke saldo.`,
		type: "task_approved",
		metadata: {
			jobId: input.jobId,
			fee: input.fee,
			campaignTitle: input.campaignTitle
		}
	});
}
/**
* 3. Notifikasi Tugas Ditolak/Revisi (Rejected)
*/
async function notifyTaskRejected(input) {
	const reasonText = input.reason?.trim() || "Bukti belum sesuai dengan instruksi.";
	await createBuzzerNotification({
		user_id: input.buzzerEmail,
		title: "Tugas Perlu Revisi / Ditolak",
		message: `Tugas "${input.campaignTitle}" ditolak: ${reasonText}`,
		type: "task_rejected",
		metadata: {
			jobId: input.jobId,
			reason: reasonText,
			campaignTitle: input.campaignTitle
		}
	});
}
/**
* 4. Notifikasi Pengajuan / Pembaruan / Nonaktif Akun Media Sosial
*/
async function notifySocialAccountSubmitted(input) {
	const isTambah = input.action === "tambah";
	const isPembaruan = input.action === "pembaruan";
	const title = isTambah ? "Menunggu Verifikasi Media Sosial" : isPembaruan ? "Menunggu Verifikasi Pembaruan Media Sosial" : "Menunggu Persetujuan Admin";
	const message = isTambah ? `Pengajuan akun media sosial ${input.platform} (@${input.username}) berhasil dikirim. Menunggu verifikasi oleh admin.` : isPembaruan ? `Permintaan pembaruan data media sosial ${input.platform} (@${input.username}) berhasil diajukan. Menunggu verifikasi oleh admin.` : `Permintaan penonaktifan akun media sosial ${input.platform} (@${input.username}) berhasil diajukan ke admin.`;
	await createBuzzerNotification({
		user_id: input.buzzerEmail,
		title,
		message,
		type: "verification_pending",
		metadata: {
			platform: input.platform,
			username: input.username,
			action: input.action
		}
	});
}
/**
* 5. Notifikasi Hasil Verifikasi Media Sosial oleh Admin
*/
async function notifySocialAccountVerified(input) {
	const isApproved = input.status === "approved";
	const title = isApproved ? "Media Sosial Terverifikasi" : "Verifikasi Media Sosial Ditolak";
	const message = isApproved ? `Akun media sosial ${input.platform} (@${input.username}) telah disetujui dan diverifikasi oleh admin.` : `Pengajuan media sosial ${input.platform} (@${input.username}) ditolak admin: ${input.reason?.trim() || "Tidak memenuhi ketentuan."}`;
	await createBuzzerNotification({
		user_id: input.buzzerEmail,
		title,
		message,
		type: isApproved ? "verification_approved" : "verification_rejected",
		metadata: {
			platform: input.platform,
			username: input.username,
			status: input.status
		}
	});
}
/**
* 6. Notifikasi Status Pendaftaran Akun Buzzer
*/
async function notifyBuzzerApplicationStatus(input) {
	const title = input.status === "submitted" ? "Pendaftaran Akun Buzzer Terkirim" : input.status === "approved" ? "Akun Buzzer Terverifikasi" : "Verifikasi Akun Ditolak";
	const message = input.status === "submitted" ? `Pendaftaran akun buzzer Anda berhasil diajukan dan sedang menunggu verifikasi oleh admin.` : input.status === "approved" ? `Selamat ${input.buzzerName}! Akun buzzer Anda telah disetujui dan diverifikasi oleh admin. Anda kini dapat mengambil pekerjaan.` : `Pengajuan akun buzzer Anda ditolak oleh admin${input.note ? `: ${input.note}` : "."}`;
	await createBuzzerNotification({
		user_id: input.buzzerEmail,
		title,
		message,
		type: input.status === "submitted" ? "verification_pending" : input.status === "approved" ? "verification_approved" : "verification_rejected",
		metadata: {
			status: input.status,
			note: input.note
		}
	});
}
/**
* 8. Notifikasi Saldo & Pencairan (Payout)
*/
async function notifyPayoutUpdate(input) {
	const amountText = formatCurrency(input.amount);
	let title = `Pencairan Saldo ${input.status}`;
	let message = `Update status pencairan saldo ${amountText}: ${input.status}.`;
	if (input.status === "Berhasil" || input.status === "Disetujui") {
		title = "Pencairan Saldo Disetujui";
		message = `Selamat! Permohonan pencairan saldo sebesar ${amountText} telah disetujui & berhasil ditransfer oleh Admin. Silakan periksa mutasi rekening / e-wallet Anda.`;
	} else if (input.status === "Diproses") {
		title = "Pencairan Saldo Diproses";
		message = `Permohonan pencairan saldo sebesar ${amountText} sedang diproses oleh admin.`;
	} else if (input.status === "Ditolak") {
		title = "Pencairan Saldo Ditolak";
		message = `Permohonan pencairan saldo sebesar ${amountText} ditolak oleh admin${input.adminNote ? ` (Alasan: ${input.adminNote})` : ""}. Saldo Anda tetap berada di akun.`;
	}
	await createBuzzerNotification({
		user_id: input.buzzerEmail,
		buzzer_id: input.buzzerEmail,
		title,
		message,
		type: "payout",
		metadata: {
			withdrawalId: input.withdrawalId,
			amount: input.amount,
			status: input.status,
			adminNote: input.adminNote
		}
	});
}
/**
* 9. Notifikasi Performa & Rating
*/
async function notifyRatingReceived(input) {
	const commentText = input.comment?.trim() ? ` — "${input.comment.trim()}"` : "";
	await createBuzzerNotification({
		user_id: input.buzzerEmail,
		title: "Ulasan & Rating Baru",
		message: `Customer memberikan rating ⭐ ${input.stars} untuk tugas "${input.campaignTitle}"${commentText}`,
		type: "rating",
		metadata: {
			campaignTitle: input.campaignTitle,
			stars: input.stars
		}
	});
}
/**
* 10. Notifikasi Kenaikan Level Tier (Level Up)
* Dilindungi deduplikasi agar tidak spam berkali-kali untuk tier yang sama.
*/
async function notifyLevelUp(input) {
	const email = input.buzzerEmail.trim().toLowerCase();
	if (getLocalNotifs(email).some((n) => n.type === "level_up" && (n.metadata?.newLevel === input.newLevel || n.message.includes(`tier ${input.newLevel}`)))) return;
	await createBuzzerNotification({
		user_id: email,
		title: "Selamat! Level Kamu Naik 🎉",
		message: `Akun buzzer kamu berhasil naik ke level tier ${input.newLevel}! Fee per pekerjaan kamu kini lebih tinggi.`,
		type: "level_up",
		metadata: { newLevel: input.newLevel }
	});
}
/**
* Helper untuk menyinkronkan event yang sudah ada ke daftar notifikasi buzzer
*/
async function syncBuzzerActivities(buzzerEmail) {
	try {
		const email = buzzerEmail.trim().toLowerCase();
		const localNotifs = getLocalNotifs(email);
		const existingJobKeys = new Set(localNotifs.map((n) => {
			const jId = n.metadata?.jobId;
			if (!jId) return "";
			return `${jId}_${n.type || (n.title.toLowerCase().includes("disetujui") ? "task_approved" : "task_rejected")}`;
		}).filter(Boolean));
		const existingWithdrawalKeys = new Set(localNotifs.map((n) => {
			const wId = n.metadata?.withdrawalId;
			const st = n.metadata?.status;
			return wId && st ? `${wId}_${st}` : wId ? `${wId}` : "";
		}).filter(Boolean));
		const { data: jobs } = await supabase.from("campaign_jobs").select("id, campaign_title, status, admin_verified_at, payout, buzzer_amount, note, rejection_reason").eq("buzzer_email", email).limit(30);
		for (const job of jobs ?? []) if (job.status === "Review" && !job.admin_verified_at) {
			const key = `${job.id}_verification_pending`;
			if (existingJobKeys.has(key)) continue;
			await notifyTaskSubmitted({
				buzzerEmail: email,
				campaignTitle: job.campaign_title || "Kampanye",
				jobId: job.id
			});
			existingJobKeys.add(key);
		} else if (job.status === "Selesai" || job.status === "Review" && job.admin_verified_at) {
			const key = `${job.id}_task_approved`;
			if (existingJobKeys.has(key)) continue;
			const fee = Number(job.buzzer_amount || job.payout || 0);
			await notifyTaskApproved({
				buzzerEmail: email,
				campaignTitle: job.campaign_title || "Kampanye",
				fee,
				jobId: job.id
			});
			existingJobKeys.add(key);
		} else if (job.status === "Revisi" || job.status === "Ditolak") {
			const key = `${job.id}_task_rejected`;
			if (existingJobKeys.has(key)) continue;
			await notifyTaskRejected({
				buzzerEmail: email,
				campaignTitle: job.campaign_title || "Kampanye",
				reason: job.rejection_reason || job.note || "Perlu perbaikan bukti.",
				jobId: job.id
			});
			existingJobKeys.add(key);
		}
		const { data: withdrawals } = await supabase.from("withdrawals").select("id, amount, status").eq("buzzer_email", email).limit(10);
		for (const w of withdrawals ?? []) {
			const wKey = `${w.id}_${w.status}`;
			if (existingWithdrawalKeys.has(wKey)) continue;
			if (w.status === "Berhasil" || w.status === "Disetujui" || w.status === "Diproses" || w.status === "Ditolak") {
				await notifyPayoutUpdate({
					buzzerEmail: email,
					amount: Number(w.amount || 0),
					status: w.status,
					withdrawalId: w.id
				});
				existingWithdrawalKeys.add(wKey);
			}
		}
	} catch {}
}
var styles_default = "/assets/styles-DQcA8EOE.css";
function reportLovableError(error, context = {}) {
	if (typeof window === "undefined") return;
	window.__lovableEvents?.captureException?.(error, {
		source: "react_error_boundary",
		route: window.location.pathname,
		...context
	}, {
		mechanism: "react_error_boundary",
		handled: false,
		severity: "error"
	});
}
var Toaster$1 = ({ ...props }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
		className: "toaster group",
		toastOptions: { classNames: {
			toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
			description: "group-[.toast]:text-muted-foreground",
			actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
			cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
		} },
		...props
	});
};
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-7xl font-bold text-foreground",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 text-xl font-semibold text-foreground",
					children: "Page not found"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "The page you're looking for doesn't exist or has been moved."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Go home"
					})
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		reportLovableError(error, { boundary: "tanstack_root_error_component" });
	}, [error]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-semibold tracking-tight text-foreground",
					children: "This page didn't load"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Something went wrong on our end. You can try refreshing or head back home."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Try again"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
						children: "Go home"
					})]
				})
			]
		})
	});
}
var Route$9 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "BuzzHub — Platform Jasa Buzzer & Viral Marketing #1 Indonesia" },
			{
				name: "description",
				content: "Naikkan brand Anda ke trending topic dengan ribuan buzzer terverifikasi. Layanan Instagram, TikTok, X, YouTube, Facebook."
			},
			{
				name: "author",
				content: "Lovable"
			},
			{
				property: "og:title",
				content: "BuzzHub — Platform Jasa Buzzer & Viral Marketing #1 Indonesia"
			},
			{
				property: "og:description",
				content: "Naikkan brand Anda ke trending topic dengan ribuan buzzer terverifikasi. Layanan Instagram, TikTok, X, YouTube, Facebook."
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary"
			},
			{
				name: "twitter:site",
				content: "@Lovable"
			},
			{
				name: "twitter:title",
				content: "BuzzHub — Platform Jasa Buzzer & Viral Marketing #1 Indonesia"
			},
			{
				name: "twitter:description",
				content: "Naikkan brand Anda ke trending topic dengan ribuan buzzer terverifikasi. Layanan Instagram, TikTok, X, YouTube, Facebook."
			},
			{
				property: "og:image",
				content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/f7b773a7-8108-47ef-a673-3144683b73fb/id-preview-54e14e6a--e64ee015-80a8-46ac-ad5f-c96bd4e36a93.lovable.app-1782804627308.png"
			},
			{
				name: "twitter:image",
				content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/f7b773a7-8108-47ef-a673-3144683b73fb/id-preview-54e14e6a--e64ee015-80a8-46ac-ad5f-c96bd4e36a93.lovable.app-1782804627308.png"
			}
		],
		links: [
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Space+Grotesk:wght@500;600;700&display=swap"
			},
			{
				rel: "icon",
				type: "image/x-icon",
				href: "/favicon.ico"
			}
		]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "id",
		suppressHydrationWarning: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("head", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("script", { dangerouslySetInnerHTML: { __html: `(function(){try{var k='buzzhub.theme';var s=localStorage.getItem(k);var d=s?s==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;var r=document.documentElement;if(d){r.classList.add('dark');r.style.colorScheme='dark';}else{r.style.colorScheme='light';}}catch(e){}})();` } })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
function RootComponent() {
	const { queryClient } = Route$9.useRouteContext();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(QueryClientProvider, {
		client: queryClient,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster$1, {
			richColors: true,
			position: "top-right"
		})]
	});
}
var $$splitComponentImporter$8 = () => import("./routes-dHgfXGkc.mjs");
var Route$8 = createFileRoute("/")({
	head: () => ({ meta: [
		{ title: "BuzzHub — Platform Jasa Buzzer & Viral Marketing #1 Indonesia" },
		{
			name: "description",
			content: "Naikkan brand Anda ke trending topic dengan ribuan buzzer terverifikasi. Layanan Instagram, TikTok, X, YouTube, Facebook."
		},
		{
			property: "og:title",
			content: "BuzzHub — Platform Jasa Buzzer & Viral Marketing #1 Indonesia"
		},
		{
			property: "og:description",
			content: "Naikkan brand Anda ke trending topic dengan ribuan buzzer terverifikasi. Layanan Instagram, TikTok, X, YouTube, Facebook."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
var services = [
	{
		id: "s1",
		name: "Paket Trending Topic X",
		platform: "X (Twitter)",
		price: 15e5,
		buzzers: 50,
		desc: "Naikkan hashtag ke trending topic Indonesia dalam 6 jam."
	},
	{
		id: "s2",
		name: "Boost Engagement Instagram",
		platform: "Instagram",
		price: 85e4,
		buzzers: 30,
		desc: "Like, comment & share organik dari akun real."
	},
	{
		id: "s3",
		name: "Viral TikTok Challenge",
		platform: "TikTok",
		price: 22e5,
		buzzers: 80,
		desc: "Buzzer membuat video respon untuk challenge brand Anda."
	},
	{
		id: "s4",
		name: "YouTube Comment Push",
		platform: "YouTube",
		price: 6e5,
		buzzers: 25,
		desc: "Komentar positif terstruktur pada video launch."
	},
	{
		id: "s5",
		name: "Facebook Group Seeding",
		platform: "Facebook",
		price: 75e4,
		buzzers: 40,
		desc: "Distribusi konten ke grup target audiens."
	},
	{
		id: "s6",
		name: "Counter Narrative Campaign",
		platform: "X (Twitter)",
		price: 35e5,
		buzzers: 120,
		desc: "Manajemen krisis dan narasi tandingan."
	}
];
var campaigns = [
	{
		id: "k1",
		title: "Launch Produk Skincare Glowin",
		customer: "PT Kreatif Digital",
		service: "Boost Engagement Instagram",
		buzzersJoined: 28,
		target: 30,
		status: "Berjalan",
		progress: 72,
		deadline: "2026-07-05",
		budget: 85e4
	},
	{
		id: "k2",
		title: "Hashtag #KopiSenjaPulang",
		customer: "Brand Kopi Senja",
		service: "Paket Trending Topic X",
		buzzersJoined: 50,
		target: 50,
		status: "Selesai",
		progress: 100,
		deadline: "2026-06-20",
		budget: 15e5
	},
	{
		id: "k3",
		title: "FinPay Cashback Challenge",
		customer: "Startup FinPay",
		service: "Viral TikTok Challenge",
		buzzersJoined: 64,
		target: 80,
		status: "Berjalan",
		progress: 80,
		deadline: "2026-07-12",
		budget: 22e5
	},
	{
		id: "k4",
		title: "Kampanye Visi Misi",
		customer: "Caleg Bagus Wijaya",
		service: "Counter Narrative Campaign",
		buzzersJoined: 95,
		target: 120,
		status: "Review",
		progress: 65,
		deadline: "2026-07-18",
		budget: 35e5
	},
	{
		id: "k5",
		title: "Promo Lebaran Bunda",
		customer: "Toko Online Bunda",
		service: "Facebook Group Seeding",
		buzzersJoined: 40,
		target: 40,
		status: "Selesai",
		progress: 100,
		deadline: "2026-04-12",
		budget: 75e4
	},
	{
		id: "k6",
		title: "Launch Video Brand",
		customer: "PT Kreatif Digital",
		service: "YouTube Comment Push",
		buzzersJoined: 18,
		target: 25,
		status: "Berjalan",
		progress: 55,
		deadline: "2026-07-09",
		budget: 6e5
	}
];
var testimonials = [
	{
		name: "Rina, Marketing Lead",
		company: "Kopi Senja",
		quote: "Hashtag kami trending #1 Indonesia dalam 4 jam. Worth every rupiah."
	},
	{
		name: "Ardi, Founder",
		company: "FinPay",
		quote: "Buzzer-nya real people, engagement-nya juga organik. Recommended."
	},
	{
		name: "Mega, Growth",
		company: "Toko Bunda",
		quote: "Penjualan naik 3x lipat selama campaign berjalan. Tim responsif."
	}
];
var stats = {
	totalCampaigns: 1284,
	activeBuzzers: 8420,
	satisfiedClients: 312,
	trendingHits: 96
};
var formatIDR = (n) => new Intl.NumberFormat("id-ID", {
	style: "currency",
	currency: "IDR",
	maximumFractionDigits: 0
}).format(n);
var $$splitComponentImporter$7 = () => import("./admin-DTIxxWL8.mjs");
var Route$7 = createFileRoute("/admin")({
	head: () => ({ meta: [{ title: "Admin Dashboard — BuzzHub" }] }),
	component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
var extraCampaigns = [{
	id: "k7",
	title: "Webinar Bisnis Online",
	customer: "Startup FinPay",
	service: "Boost Engagement Instagram",
	buzzersJoined: 0,
	target: 20,
	status: "Draft",
	progress: 0,
	deadline: "2026-08-01",
	budget: 95e4
}, {
	id: "k8",
	title: "Promo 7.7 Toko Bunda",
	customer: "Toko Online Bunda",
	service: "Viral TikTok Challenge",
	buzzersJoined: 12,
	target: 60,
	status: "Berjalan",
	progress: 20,
	deadline: "2026-07-07",
	budget: 175e4
}];
[...campaigns, ...extraCampaigns];
var $$splitComponentImporter$6 = () => import("./buzzer-BkkOtMxg.mjs");
var Route$6 = createFileRoute("/buzzer")({
	head: () => ({ meta: [{ title: "Buzzer Dashboard — BuzzHub" }] }),
	component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
var $$splitComponentImporter$5 = () => import("./customer-B_x0lJ9H.mjs");
var Route$5 = createFileRoute("/customer")({
	head: () => ({ meta: [{ title: "Customer Dashboard — BuzzHub" }] }),
	component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
var $$splitComponentImporter$4 = () => import("./jadi-buzzer-q_jDSwhT.mjs");
var Route$4 = createFileRoute("/jadi-buzzer")({
	head: () => ({ meta: [
		{ title: "Jadi Buzzer — BuzzHub" },
		{
			name: "description",
			content: "Gabung sebagai buzzer BuzzHub: ambil job brand, bangun level dari followers terverifikasi, dan cairkan penghasilan dengan aman."
		},
		{
			property: "og:title",
			content: "Jadi Buzzer — BuzzHub"
		},
		{
			property: "og:description",
			content: "Gabung sebagai buzzer BuzzHub: ambil job brand, bangun level dari followers terverifikasi, dan cairkan penghasilan dengan aman."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
var $$splitComponentImporter$3 = () => import("./login-uwY-AeTl.mjs");
var Route$3 = createFileRoute("/login")({
	head: () => ({ meta: [{ title: "Masuk — BuzzHub" }] }),
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
var $$splitComponentImporter$2 = () => import("./buzzer-profile._buzzerEmail-BW1smeIy.mjs");
var Route$2 = createFileRoute("/buzzer-profile/$buzzerEmail")({
	head: () => ({ meta: [{ title: "Profil Buzzer — BuzzHub" }] }),
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
var $$splitComponentImporter$1 = () => import("./register.index-DBxE8CcY.mjs");
var Route$1 = createFileRoute("/register/")({
	head: () => ({ meta: [
		{ title: "Daftar Customer — BuzzHub" },
		{
			name: "description",
			content: "Buat akun customer BuzzHub dan mulai kampanye buzzer terverifikasi dalam hitungan menit."
		},
		{
			property: "og:title",
			content: "Daftar Customer — BuzzHub"
		},
		{
			property: "og:description",
			content: "Buat akun customer BuzzHub dan mulai kampanye buzzer terverifikasi dalam hitungan menit."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
var $$splitComponentImporter = () => import("./register.buzzer-BsYWFE2l.mjs");
var Route = createFileRoute("/register/buzzer")({
	head: () => ({ meta: [
		{ title: "Daftar Buzzer — BuzzHub" },
		{
			name: "description",
			content: "Daftarkan diri dan akun media sosial Anda sebagai buzzer BuzzHub. Verifikasi dilakukan oleh admin."
		},
		{
			property: "og:title",
			content: "Daftar Buzzer — BuzzHub"
		},
		{
			property: "og:description",
			content: "Daftarkan diri dan akun media sosial Anda sebagai buzzer BuzzHub. Verifikasi dilakukan oleh admin."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
var IndexRoute = Route$8.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$9
});
var AdminRoute = Route$7.update({
	id: "/admin",
	path: "/admin",
	getParentRoute: () => Route$9
});
var BuzzerRoute = Route$6.update({
	id: "/buzzer",
	path: "/buzzer",
	getParentRoute: () => Route$9
});
var CustomerRoute = Route$5.update({
	id: "/customer",
	path: "/customer",
	getParentRoute: () => Route$9
});
var JadiBuzzerRoute = Route$4.update({
	id: "/jadi-buzzer",
	path: "/jadi-buzzer",
	getParentRoute: () => Route$9
});
var LoginRoute = Route$3.update({
	id: "/login",
	path: "/login",
	getParentRoute: () => Route$9
});
var BuzzerProfileBuzzerEmailRoute = Route$2.update({
	id: "/buzzer-profile/$buzzerEmail",
	path: "/buzzer-profile/$buzzerEmail",
	getParentRoute: () => Route$9
});
var RegisterIndexRoute = Route$1.update({
	id: "/register/",
	path: "/register/",
	getParentRoute: () => Route$9
});
var rootRouteChildren = {
	IndexRoute,
	AdminRoute,
	BuzzerRoute,
	CustomerRoute,
	JadiBuzzerRoute,
	LoginRoute,
	BuzzerProfileBuzzerEmailRoute,
	RegisterBuzzerRoute: Route.update({
		id: "/register/buzzer",
		path: "/register/buzzer",
		getParentRoute: () => Route$9
	}),
	RegisterIndexRoute
};
var routeTree = Route$9._addFileChildren(rootRouteChildren)._addFileTypes();
var router_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
var getRouter = () => {
	const queryClient = new QueryClient();
	return createRouter({
		routeTree,
		context: { queryClient },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { notifySocialAccountVerified as _, services as a, notifyTaskSubmitted as b, reportLovableError as c, formatTimeAgo as d, notifyBuzzerApplicationStatus as f, notifySocialAccountSubmitted as g, notifyRatingReceived as h, formatIDR as i, notifyPayoutUpdate as m, Route$2 as n, stats as o, notifyLevelUp as p, campaigns as r, testimonials as s, router_exports as t, notifyTaskApproved as v, useBuzzerNotifications as x, notifyTaskRejected as y };
