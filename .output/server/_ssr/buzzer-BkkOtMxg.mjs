import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { L as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { t as Button } from "./button-BkEeRci-.mjs";
import { n as Label, t as Input } from "./label-B7oQAA24.mjs";
import { At as ChevronRight, B as Music2, Bt as Bell, C as Send, Ct as Clock, Dt as CircleCheck, E as RotateCcw, Et as CircleX, F as PenLine, It as Camera, J as LogOut, M as Plus, Nt as Check, O as RefreshCw, Ot as CircleAlert, Pt as CheckCheck, Q as Link2, S as Settings, U as MessageCircle, V as Moon, W as Menu, X as LoaderCircle, _ as Smartphone, a as User, b as ShieldCheck, c as Twitter, dt as FileDown, ft as Facebook, g as Sparkles, h as Star, ht as ExternalLink, jt as ChevronLeft, lt as FileText, m as Sun, nt as Instagram, pt as Eye, r as Wallet, rt as Inbox, s as Upload, st as Funnel, t as Youtube, ut as FileSpreadsheet, w as Search, yt as DollarSign, zt as Briefcase } from "../_libs/lucide-react.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, s as Textarea, t as Dialog } from "./dialog-BQPGZ99x.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-Dg1urBTx.mjs";
import { c as useBuzzerLevel, r as getBuzzerPercentageForLevel } from "./buzzer-level-B8egucK7.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { b as notifyTaskSubmitted, d as formatTimeAgo, x as useBuzzerNotifications } from "./router-BuTnQWI2.mjs";
import { a as Table, c as TableHead, d as averageStars, g as useBuzzerRatings, i as Skeleton, l as TableHeader, n as AvatarFallback, o as TableBody, r as AvatarImage, s as TableCell, t as Avatar, u as TableRow } from "./table-C9Hv1VxK.mjs";
import { B as useBuzzerCampaignJobs, N as submitCampaignJobProof, O as exportToExcel, P as takeCampaignJob, _ as StatusBadge, a as AlertDialogDescription, c as AlertDialogTitle, d as Sheet, f as SheetContent, g as StatCard, h as SidebarNav, i as AlertDialogContent, k as exportToPDF, l as MobileBottomNav, m as SidebarCollapseButton, n as AlertDialogAction, o as AlertDialogFooter, p as SheetTrigger, q as useSidebarCollapsed, r as AlertDialogCancel, s as AlertDialogHeader, t as AlertDialog, u as Progress, v as Switch } from "./export-utils-Bse6Ov51.mjs";
import { c as useSession, s as useRequireRole, t as clearSession } from "./auth-CNL2N2Mo.mjs";
import { n as useTheme, t as ThemeToggle } from "./theme-toggle-B6xwIFaA.mjs";
import { S as useSocialAccounts, m as getBuzzerVerificationStatus, p as getApplicationByEmail } from "./buzzer-verification-COVCzkVL.mjs";
import { _ as uploadProofScreenshot, a as TablePagination, c as TabsList, h as terbilangRupiah, i as SosmedSection, l as TabsTrigger, o as Tabs, p as formatIDR, r as ProofLink, s as TabsContent, v as useBuzzerStore } from "./tabs-Bqo-fbNA.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/buzzer-BkkOtMxg.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var DEFAULT_PREFERENCES$1 = {
	newTask: true,
	taskApproved: true,
	taskRejected: true,
	verification: true,
	payout: true,
	rating: true,
	levelUp: true,
	inApp: true,
	emailWhatsapp: true
};
function getStorageKey$1(email) {
	const clean = (email || "").trim().toLowerCase();
	return clean ? `buzzhub.buzzer.notifications.${clean}` : "buzzhub.buzzer.notifications.default";
}
function getBuzzerNotifPreferences(email) {
	if (typeof window === "undefined") return { ...DEFAULT_PREFERENCES$1 };
	try {
		const raw = localStorage.getItem(getStorageKey$1(email));
		if (!raw) return { ...DEFAULT_PREFERENCES$1 };
		return {
			...DEFAULT_PREFERENCES$1,
			...JSON.parse(raw)
		};
	} catch {
		return { ...DEFAULT_PREFERENCES$1 };
	}
}
function isBuzzerNotifEnabled(n, prefs) {
	if (!prefs.inApp) return false;
	const type = n.type;
	const text = `${(n.title || "").toLowerCase()} ${(n.message || "").toLowerCase()}`;
	if (type === "payout" || text.includes("pencairan saldo") || text.includes("pencairan") || text.includes("penarikan saldo") || text.includes("payout")) {
		if (type !== "task_approved") return Boolean(prefs.payout);
	}
	if (type === "new_task" || text.includes("tugas baru") || text.includes("job baru")) return Boolean(prefs.newTask);
	if (type === "task_approved" || text.includes("tugas selesai") || text.includes("tugas disetujui")) return Boolean(prefs.taskApproved);
	if (type === "task_rejected" || text.includes("perlu revisi") || text.includes("tugas ditolak") || text.includes("bukti ditolak")) return Boolean(prefs.taskRejected);
	if (type === "verification_pending" || type === "verification_approved" || type === "verification_rejected" || text.includes("verifikasi media sosial") || text.includes("verifikasi admin") || text.includes("pendaftaran akun") || text.includes("akun buzzer terverifikasi")) return Boolean(prefs.verification);
	if (type === "rating" || text.includes("ulasan & rating") || text.includes("rating customer") || text.includes("rating baru")) return Boolean(prefs.rating);
	if (type === "level_up" || text.includes("level kamu naik") || text.includes("level up") || text.includes("naik ke level")) return Boolean(prefs.levelUp);
	return Boolean(prefs.inApp);
}
function useBuzzerNotifPreferences(email) {
	const [prefs, setPrefs] = (0, import_react.useState)(() => getBuzzerNotifPreferences(email));
	(0, import_react.useEffect)(() => {
		setPrefs(getBuzzerNotifPreferences(email));
		const onStorage = () => {
			setPrefs(getBuzzerNotifPreferences(email));
		};
		window.addEventListener("storage", onStorage);
		window.addEventListener("buzzhub_buzzer_notif_prefs_changed", onStorage);
		return () => {
			window.removeEventListener("storage", onStorage);
			window.removeEventListener("buzzhub_buzzer_notif_prefs_changed", onStorage);
		};
	}, [email]);
	return prefs;
}
var NOTIF_CONFIG = {
	task_approved: {
		label: "Tugas Selesai",
		badgeClass: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
		iconClass: "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-300",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4" })
	},
	task_rejected: {
		label: "Revisi / Ditolak",
		badgeClass: "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-400 border-rose-200 dark:border-rose-800",
		iconClass: "bg-rose-100 text-rose-600 dark:bg-rose-500/20 dark:text-rose-300",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, { className: "h-4 w-4" })
	},
	verification_pending: {
		label: "Verifikasi Admin",
		badgeClass: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400 border-amber-200 dark:border-amber-800",
		iconClass: "bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-300",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-4 w-4" })
	},
	verification_approved: {
		label: "Terverifikasi",
		badgeClass: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
		iconClass: "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-300",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4" })
	},
	verification_rejected: {
		label: "Ditolak",
		badgeClass: "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-400 border-rose-200 dark:border-rose-800",
		iconClass: "bg-rose-100 text-rose-600 dark:bg-rose-500/20 dark:text-rose-300",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, { className: "h-4 w-4" })
	},
	new_task: {
		label: "Tugas Baru",
		badgeClass: "bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-400 border-sky-200 dark:border-sky-800",
		iconClass: "bg-sky-100 text-sky-600 dark:bg-sky-500/20 dark:text-sky-300",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Inbox, { className: "h-4 w-4" })
	},
	payout: {
		label: "Saldo & Payout",
		badgeClass: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400 border-amber-200 dark:border-amber-800",
		iconClass: "bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-300",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wallet, { className: "h-4 w-4" })
	},
	rating: {
		label: "Rating Customer",
		badgeClass: "bg-yellow-100 text-yellow-800 dark:bg-yellow-500/15 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800",
		iconClass: "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-300",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "h-4 w-4 fill-current" })
	},
	level_up: {
		label: "Level Up",
		badgeClass: "bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-500/15 dark:text-fuchsia-400 border-fuchsia-200 dark:border-fuchsia-800",
		iconClass: "bg-fuchsia-100 text-fuchsia-600 dark:bg-fuchsia-500/20 dark:text-fuchsia-300",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-4 w-4" })
	},
	general: {
		label: "Informasi",
		badgeClass: "bg-muted text-muted-foreground border-border",
		iconClass: "bg-muted text-muted-foreground",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "h-4 w-4" })
	}
};
function BuzzerNotifBell({ email, onClick, notifState }) {
	const prefs = useBuzzerNotifPreferences(email);
	const internal = useBuzzerNotifications(notifState ? null : email);
	const { notifications } = notifState ?? internal;
	const visibleNotifications = (0, import_react.useMemo)(() => notifications.filter((n) => isBuzzerNotifEnabled(n, prefs)), [notifications, prefs]);
	const unreadCount = prefs.inApp ? visibleNotifications.filter((n) => !n.is_read).length : 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
		variant: "outline",
		size: "icon",
		className: "relative shrink-0",
		"aria-label": "Buka Notifikasi Buzzer",
		onClick,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "h-4 w-4" }), prefs.inApp && unreadCount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white shadow-sm animate-in fade-in zoom-in-75",
			children: unreadCount > 9 ? "9+" : unreadCount
		})]
	});
}
function BuzzerNotifSheet({ open, onOpenChange, buzzerEmail, notifState, onNavigate }) {
	const prefs = useBuzzerNotifPreferences(buzzerEmail);
	const internal = useBuzzerNotifications(notifState ? null : buzzerEmail);
	const { notifications, loading, markAsRead } = notifState ?? internal;
	const visibleNotifications = (0, import_react.useMemo)(() => notifications.filter((n) => isBuzzerNotifEnabled(n, prefs)), [notifications, prefs]);
	const unreadCount = prefs.inApp ? visibleNotifications.filter((n) => !n.is_read).length : 0;
	const handleMarkAll = async () => {
		for (const n of visibleNotifications) if (!n.is_read) await markAsRead(n.id);
		toast.success("Semua notifikasi aktif ditandai dibaca");
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sheet, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetContent, {
			side: "right",
			className: "w-full sm:max-w-md p-0 flex flex-col",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between border-b border-border pl-5 pr-14 py-3.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "font-display font-bold text-base",
					children: "Notifikasi Buzzer"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted-foreground",
					children: !prefs.inApp ? "Fitur lonceng dinonaktifkan di pengaturan" : unreadCount > 0 ? `${unreadCount} belum dibaca` : "Semua sudah dibaca"
				})] }), prefs.inApp && unreadCount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-center mr-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						size: "sm",
						variant: "outline",
						className: "h-8 gap-1.5 px-3 text-xs font-medium",
						onClick: handleMarkAll,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CheckCheck, { className: "h-3.5 w-3.5 text-muted-foreground" }), "Tandai semua"]
					})
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex-1 overflow-y-auto max-h-[calc(100vh-70px)]",
				children: loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "p-6 text-center text-sm text-muted-foreground",
					children: "Memuat notifikasi..."
				}) : !prefs.inApp ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid place-items-center py-16 px-6 text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "grid h-12 w-12 place-items-center rounded-full bg-muted text-muted-foreground",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "h-6 w-6 opacity-40 line-through" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 font-semibold text-foreground",
							children: "Notifikasi In-App Dinonaktifkan"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs text-muted-foreground max-w-xs leading-relaxed",
							children: "Anda menonaktifkan fitur notifikasi dalam aplikasi di menu Pengaturan. Aktifkan kembali di halaman Pengaturan untuk melihat notifikasi di sini."
						})
					]
				}) : visibleNotifications.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid place-items-center py-16 px-6 text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "grid h-12 w-12 place-items-center rounded-full bg-muted text-muted-foreground",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "h-6 w-6 opacity-60" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 font-semibold text-foreground",
							children: notifications.length > 0 ? "Notifikasi Disembunyikan" : "Belum ada notifikasi"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs text-muted-foreground max-w-xs leading-relaxed",
							children: notifications.length > 0 ? "Beberapa notifikasi disembunyikan berdasarkan preferensi kategori yang Anda nonaktifkan di Pengaturan." : "Pembaruan mengenai tugas disetujui, revisi, pencairan saldo, dan ulasan rating akan tampil di sini."
						})
					]
				}) : visibleNotifications.map((n) => {
					const cfg = NOTIF_CONFIG[n.type] ?? NOTIF_CONFIG.general;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => {
							if (!n.is_read) markAsRead(n.id);
							if (onNavigate) {
								if (n.type === "payout") onNavigate("penghasilan");
								else if (n.type === "new_task") onNavigate("tersedia");
								else if (n.type === "task_approved" || n.type === "task_rejected") onNavigate("riwayat");
								else if (n.type === "verification_approved" || n.type === "verification_rejected") onNavigate("sosial");
							}
						},
						className: cn("flex w-full items-start gap-3 border-b border-border p-4 text-left transition-colors hover:bg-muted/50 focus:outline-none focus:bg-muted/60", !n.is_read ? "bg-primary/5" : "bg-card"),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: cn("mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full", cfg.iconClass),
								children: cfg.icon
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 flex-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between gap-2 mb-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "truncate text-xs font-semibold text-foreground",
											children: n.title
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											variant: "outline",
											className: cn("text-[10px] px-1.5 py-0 font-medium shrink-0", cfg.badgeClass),
											children: cfg.label
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted-foreground leading-snug line-clamp-3",
										children: n.message
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-1.5 flex items-center gap-1 text-[10px] text-muted-foreground",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-3 w-3 opacity-70" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: formatTimeAgo(n.created_at) })]
									})
								]
							}),
							!n.is_read && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "mt-2 h-2 w-2 shrink-0 rounded-full bg-primary",
								title: "Belum dibaca"
							})
						]
					}, n.id);
				})
			})]
		})
	});
}
function getStorageKey(email) {
	const clean = (email || "").trim().toLowerCase();
	return clean ? `buzzhub.buzzer.notifications.${clean}` : "buzzhub.buzzer.notifications.default";
}
var DEFAULT_PREFERENCES = {
	newTask: true,
	taskApproved: true,
	taskRejected: true,
	verification: true,
	payout: true,
	rating: true,
	levelUp: true,
	inApp: true,
	emailWhatsapp: true
};
function BuzzerSettingsSection({ buzzerEmail }) {
	const { theme, setTheme } = useTheme();
	const [prefs, setPrefs] = (0, import_react.useState)(() => getBuzzerNotifPreferences(buzzerEmail));
	const [saving, setSaving] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		setPrefs(getBuzzerNotifPreferences(buzzerEmail));
	}, [buzzerEmail]);
	const toggle = (key) => {
		setPrefs((prev) => {
			const next = {
				...prev,
				[key]: !prev[key]
			};
			try {
				localStorage.setItem(getStorageKey(buzzerEmail), JSON.stringify(next));
				if (typeof window !== "undefined") {
					window.dispatchEvent(new Event("storage"));
					window.dispatchEvent(new CustomEvent("buzzhub_buzzer_notif_prefs_changed", { detail: next }));
				}
			} catch {}
			return next;
		});
	};
	const handleSave = () => {
		setSaving(true);
		try {
			localStorage.setItem(getStorageKey(buzzerEmail), JSON.stringify(prefs));
			if (typeof window !== "undefined") {
				window.dispatchEvent(new Event("storage"));
				window.dispatchEvent(new CustomEvent("buzzhub_buzzer_notif_prefs_changed", { detail: prefs }));
			}
			toast.success("Pengaturan notifikasi buzzer berhasil disimpan ✓");
		} catch {
			toast.error("Gagal menyimpan pengaturan.");
		} finally {
			setTimeout(() => setSaving(false), 300);
		}
	};
	const handleReset = () => {
		setPrefs({ ...DEFAULT_PREFERENCES });
		try {
			localStorage.setItem(getStorageKey(buzzerEmail), JSON.stringify(DEFAULT_PREFERENCES));
			if (typeof window !== "undefined") {
				window.dispatchEvent(new Event("storage"));
				window.dispatchEvent(new CustomEvent("buzzhub_buzzer_notif_prefs_changed", { detail: DEFAULT_PREFERENCES }));
			}
			toast.info("Pengaturan notifikasi dikembalikan ke default");
		} catch {}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "rounded-2xl border border-border bg-card p-5 shadow-sm",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid h-10 w-10 place-items-center rounded-xl gradient-brand text-brand-foreground shadow-sm",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "h-5 w-5" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-lg font-bold",
							children: "Pengaturan Notifikasi Buzzer"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground sm:text-sm",
							children: "Atur pemberitahuan apa saja yang ingin kamu terima agar tetap update tanpa terganggu."
						})] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 pt-2 sm:pt-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "sm",
							variant: "outline",
							onClick: handleReset,
							className: "h-9 text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "mr-1.5 h-3.5 w-3.5" }), "Reset Default"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "sm",
							onClick: handleSave,
							disabled: saving,
							className: "h-9 gradient-brand text-brand-foreground text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "mr-1.5 h-3.5 w-3.5" }), saving ? "Menyimpan..." : "Simpan Perubahan"]
						})]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-border bg-card p-5 shadow-sm space-y-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 border-b border-border pb-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sun, { className: "h-4 w-4 text-amber-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-semibold text-sm",
						children: "Tema & Tampilan Antarmuka"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-border/60 bg-muted/30 p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-semibold",
						children: "Mode Gelap / Terang"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground mt-0.5",
						children: "Ubah gaya tampilan aplikasi sesuai kenyamanan Anda (Tema Terang atau Tema Gelap)."
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 shrink-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							type: "button",
							size: "sm",
							variant: theme === "light" ? "default" : "outline",
							className: cn("h-8 text-xs gap-1.5", theme === "light" && "gradient-brand text-brand-foreground font-semibold"),
							onClick: () => setTheme("light"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sun, { className: "h-3.5 w-3.5" }), " Mode Terang"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							type: "button",
							size: "sm",
							variant: theme === "dark" ? "default" : "outline",
							className: cn("h-8 text-xs gap-1.5", theme === "dark" && "gradient-brand text-brand-foreground font-semibold"),
							onClick: () => setTheme("dark"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Moon, { className: "h-3.5 w-3.5" }), " Mode Gelap"]
						})]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-6 md:grid-cols-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-border bg-card p-5 shadow-sm space-y-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 border-b border-border pb-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Smartphone, { className: "h-4 w-4 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-semibold text-sm",
								children: "Saluran Pemberitahuan"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start justify-between gap-3 rounded-xl border border-border/60 bg-muted/30 p-3.5 transition-colors hover:bg-muted/50",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-start gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "mt-0.5 h-4 w-4 text-primary shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm font-semibold",
										children: "Notifikasi Dalam Aplikasi (In-App)"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted-foreground",
										children: "Tampilkan badge dan pesan pada ikon lonceng saat aplikasi dibuka."
									})] })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
									checked: prefs.inApp,
									onCheckedChange: () => toggle("inApp")
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start justify-between gap-3 rounded-xl border border-border/60 bg-muted/30 p-3.5 transition-colors hover:bg-muted/50",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-start gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Inbox, { className: "mt-0.5 h-4 w-4 text-primary shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm font-semibold",
										children: "Email & Pesan Langsung"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted-foreground",
										children: "Kirim ringkasan informasi penting ke alamat email terdaftar buzzer."
									})] })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
									checked: prefs.emailWhatsapp,
									onCheckedChange: () => toggle("emailWhatsapp")
								})]
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-border bg-card p-5 shadow-sm space-y-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 border-b border-border pb-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4 text-emerald-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-semibold text-sm",
								children: "Aktivitas Pekerjaan & Job"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-start justify-between gap-3 rounded-xl border border-border/60 bg-muted/30 p-3.5 transition-colors hover:bg-muted/50",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-start gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "mt-0.5 h-4 w-4 text-amber-500 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-sm font-semibold",
											children: "Job Baru Tersedia"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-muted-foreground",
											children: "Dapatkan info saat kampanye baru tersedia untuk platform & level Anda."
										})] })]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
										checked: prefs.newTask,
										onCheckedChange: () => toggle("newTask")
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-start justify-between gap-3 rounded-xl border border-border/60 bg-muted/30 p-3.5 transition-colors hover:bg-muted/50",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-start gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "mt-0.5 h-4 w-4 text-emerald-500 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-sm font-semibold",
											children: "Bukti Pengerjaan Disetujui"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-muted-foreground",
											children: "Pemberitahuan saat bukti submit job berhasil diverifikasi admin."
										})] })]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
										checked: prefs.taskApproved,
										onCheckedChange: () => toggle("taskApproved")
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-start justify-between gap-3 rounded-xl border border-border/60 bg-muted/30 p-3.5 transition-colors hover:bg-muted/50",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-start gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, { className: "mt-0.5 h-4 w-4 text-rose-500 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-sm font-semibold",
											children: "Job Ditolak / Perlu Revisi"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-muted-foreground",
											children: "Pemberitahuan saat bukti pengerjaan ditolak lengkap dengan alasannya."
										})] })]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
										checked: prefs.taskRejected,
										onCheckedChange: () => toggle("taskRejected")
									})]
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-border bg-card p-5 shadow-sm space-y-4 md:col-span-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 border-b border-border pb-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wallet, { className: "h-4 w-4 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-semibold text-sm",
								children: "Akun, Keuangan & Peringkat Level"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-3 sm:grid-cols-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-start justify-between gap-3 rounded-xl border border-border/60 bg-muted/30 p-3.5 transition-colors hover:bg-muted/50",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-start gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "mt-0.5 h-4 w-4 text-sky-500 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-sm font-semibold",
											children: "Verifikasi Akun Media Sosial"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-muted-foreground",
											children: "Pemberitahuan ketika akun Instagram/TikTok/X disetujui atau ditolak admin."
										})] })]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
										checked: prefs.verification,
										onCheckedChange: () => toggle("verification")
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-start justify-between gap-3 rounded-xl border border-border/60 bg-muted/30 p-3.5 transition-colors hover:bg-muted/50",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-start gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wallet, { className: "mt-0.5 h-4 w-4 text-emerald-500 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-sm font-semibold",
											children: "Pencairan Saldo (Payout)"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-muted-foreground",
											children: "Konfirmasi transfer dan pencairan saldo masuk ke rekening atau e-wallet."
										})] })]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
										checked: prefs.payout,
										onCheckedChange: () => toggle("payout")
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-start justify-between gap-3 rounded-xl border border-border/60 bg-muted/30 p-3.5 transition-colors hover:bg-muted/50",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-start gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "mt-0.5 h-4 w-4 text-amber-500 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-sm font-semibold",
											children: "Ulasan & Rating Customer"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-muted-foreground",
											children: "Dapatkan info saat customer memberikan bintang ulasan atas job yang kamu selesaikan."
										})] })]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
										checked: prefs.rating,
										onCheckedChange: () => toggle("rating")
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-start justify-between gap-3 rounded-xl border border-border/60 bg-muted/30 p-3.5 transition-colors hover:bg-muted/50",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-start gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "mt-0.5 h-4 w-4 text-purple-500 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-sm font-semibold",
											children: "Kenaikan Level Buzzer"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-muted-foreground",
											children: "Pemberitahuan ketika level akun buzzer kamu naik ke tingkat berikutnya."
										})] })]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
										checked: prefs.levelUp,
										onCheckedChange: () => toggle("levelUp")
									})]
								})
							]
						})]
					})
				]
			})
		]
	});
}
var DB_PREFIX = "db:";
/** Gabungkan job lokal dengan job kampanye. Slot kosong dari 1 kampanye digabung jadi 1 kartu. */
function useMergedJobs(store, canAccessJobs) {
	const { data: rows, refetch } = useBuzzerCampaignJobs(canAccessJobs ? store.state.profile.email : "");
	const email = store.state.profile.email.toLowerCase();
	return {
		jobs: (0, import_react.useMemo)(() => {
			const mine = [];
			const openByCampaign = /* @__PURE__ */ new Map();
			const claimedCampaigns = /* @__PURE__ */ new Set();
			for (const r of rows) {
				const isMine = (r.buzzer_email ?? "").toLowerCase() === email && !!r.buzzer_email;
				const campaignKey = r.campaign_id ?? r.id;
				if (isMine) {
					claimedCampaigns.add(campaignKey);
					openByCampaign.delete(campaignKey);
				}
				const isOpen = r.status === "Tersedia" && !r.buzzer_email;
				if (!isMine && !isOpen) continue;
				const job = {
					id: DB_PREFIX + r.id,
					title: r.campaign_title,
					platform: r.platform,
					brief: r.brief,
					deadline: r.deadline,
					payout: Number(r.buzzer_amount ?? r.payout ?? 0),
					grossPrice: Number(r.gross_price),
					buzzerAmount: Number(r.buzzer_amount ?? 0),
					adminAmount: Number(r.admin_amount ?? 0),
					buzzerLevel: r.buzzer_level ?? void 0,
					buzzerPercentage: r.buzzer_percentage === null || r.buzzer_percentage === void 0 ? void 0 : Number(r.buzzer_percentage),
					adminPercentage: r.admin_percentage === null || r.admin_percentage === void 0 ? void 0 : Number(r.admin_percentage),
					status: r.status,
					proofUrl: r.proof_url ?? void 0,
					note: r.note ?? void 0,
					rejection_reason: r.rejection_reason ?? void 0,
					rejected_at: r.rejected_at ?? void 0,
					admin_verified_at: r.admin_verified_at ?? null,
					customer_rated_at: r.customer_rated_at ?? null,
					updatedAt: r.updated_at,
					campaignId: r.campaign_id ?? void 0,
					attendance_status: r.attendance_status ?? null,
					attendance_confirmed_at: r.attendance_confirmed_at ?? null,
					checkin_at: r.checkin_at ?? null,
					checkout_at: r.checkout_at ?? null,
					activity_note: r.activity_note ?? null,
					location_name: r.location_name ?? null,
					event_date: r.event_date ?? null,
					event_time: r.event_time ?? null
				};
				if (isMine) {
					mine.push(job);
					continue;
				}
				const key = campaignKey;
				if (claimedCampaigns.has(key)) continue;
				const existing = openByCampaign.get(key);
				if (existing) {
					existing.count += 1;
					if (r.created_at > (existing.job.updatedAt ?? "")) existing.job = { ...job };
				} else openByCampaign.set(key, {
					job,
					count: 1
				});
			}
			for (const lj of store.state.jobs || []) if (!mine.some((m) => m.id === lj.id || m.id === DB_PREFIX + lj.id || m.title === lj.title && m.platform === lj.platform) && lj.status !== "Tersedia") mine.push({
				id: lj.id,
				title: lj.title,
				platform: lj.platform,
				brief: lj.brief,
				deadline: lj.deadline,
				payout: lj.payout,
				status: lj.status,
				proofUrl: lj.proofUrl,
				note: lj.note,
				rejection_reason: lj.rejection_reason,
				rejected_at: lj.rejected_at,
				admin_verified_at: lj.admin_verified_at ?? null,
				customer_rated_at: lj.customer_rated_at ?? null,
				updatedAt: lj.updatedAt || (/* @__PURE__ */ new Date()).toISOString(),
				attendance_status: lj.attendance_status ?? null,
				attendance_confirmed_at: lj.attendance_confirmed_at ?? null,
				checkin_at: lj.checkin_at ?? null,
				checkout_at: lj.checkout_at ?? null,
				activity_note: lj.activity_note ?? null,
				location_name: lj.location_name ?? null,
				event_date: lj.event_date ?? null,
				event_time: lj.event_time ?? null
			});
			const open = [...openByCampaign.values()].map(({ job, count }) => ({
				...job,
				slotsLeft: count
			}));
			const byNewest = (a, b) => a.updatedAt < b.updatedAt ? 1 : -1;
			return [...mine.sort(byNewest), ...open.sort(byNewest)];
		}, [
			rows,
			email,
			store.state.jobs
		]),
		refetch
	};
}
var BUZZER_SECTIONS = [
	"jobs",
	"sosmed",
	"penghasilan",
	"ulasan",
	"profil",
	"pengaturan"
];
function getInitialBuzzerSection() {
	if (typeof window !== "undefined") {
		const sp = new URLSearchParams(window.location.search).get("section");
		if (sp && BUZZER_SECTIONS.includes(sp)) return sp;
		try {
			const stored = localStorage.getItem("buzzhub.active_section.buzzer");
			if (stored && BUZZER_SECTIONS.includes(stored)) return stored;
		} catch {}
	}
	return "jobs";
}
var navItems = [
	{
		key: "jobs",
		label: "Job Tersedia",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Briefcase, { className: "h-4 w-4" })
	},
	{
		key: "sosmed",
		label: "Akun Sosial Media",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link2, { className: "h-4 w-4" })
	},
	{
		key: "penghasilan",
		label: "Penghasilan",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wallet, { className: "h-4 w-4" })
	},
	{
		key: "ulasan",
		label: "Rating & Ulasan",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "h-4 w-4" })
	},
	{
		key: "profil",
		label: "Profil",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "h-4 w-4" })
	},
	{
		key: "pengaturan",
		label: "Pengaturan",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settings, { className: "h-4 w-4" })
	}
];
var sectionMeta = {
	jobs: {
		title: "Job Tersedia",
		subtitle: "Ambil job baru & kelola progress kamu"
	},
	sosmed: {
		title: "Akun Sosial Media",
		subtitle: "Kelola akun sosmed yang dipakai untuk campaign"
	},
	penghasilan: {
		title: "Penghasilan",
		subtitle: "Riwayat saldo, pembayaran & pencairan"
	},
	ulasan: {
		title: "Rating & Ulasan",
		subtitle: "Penilaian performa & feedback dari customer"
	},
	profil: {
		title: "Profil Buzzer",
		subtitle: "Kelola data & preferensi akun kamu"
	},
	pengaturan: {
		title: "Pengaturan",
		subtitle: "Kelola preferensi notifikasi dan akun buzzer kamu"
	}
};
var PLATFORM_ICON = {
	"TikTok": /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Music2, { className: "h-3.5 w-3.5" }),
	"Instagram": /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Instagram, { className: "h-3.5 w-3.5" }),
	"X (Twitter)": /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Twitter, { className: "h-3.5 w-3.5" }),
	"Facebook": /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Facebook, { className: "h-3.5 w-3.5" }),
	"YouTube": /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Youtube, { className: "h-3.5 w-3.5" }),
	"Telegram": /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "h-3.5 w-3.5" }),
	"LinkedIn": /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link2, { className: "h-3.5 w-3.5" })
};
function BuzzerPage() {
	const session = useRequireRole("buzzer");
	const navigate = useNavigate();
	const store = useBuzzerStore(session?.email, session?.name, session ? {
		name: session.name,
		email: session.email,
		phone: session.phone ?? "",
		platform: session.platform ?? "Instagram",
		followers: session.followers ?? 0,
		bio: session.bio ?? "",
		username: session.username ?? "",
		avatarUrl: session.avatarUrl,
		buzzerCategory: session.company || "Buzzer Online"
	} : {});
	const [applicationData, setApplicationData] = (0, import_react.useState)(null);
	const [section, setSection] = (0, import_react.useState)(getInitialBuzzerSection);
	const [mobileOpen, setMobileOpen] = (0, import_react.useState)(false);
	const [logoutOpen, setLogoutOpen] = (0, import_react.useState)(false);
	const [notifOpen, setNotifOpen] = (0, import_react.useState)(false);
	const { collapsed, toggle } = useSidebarCollapsed("buzzer");
	const notifState = useBuzzerNotifications(session?.email);
	const [verificationStatus, setVerificationStatus] = (0, import_react.useState)(null);
	const [verificationLoading, setVerificationLoading] = (0, import_react.useState)(true);
	(0, import_react.useEffect)(() => {
		let active = true;
		setVerificationLoading(true);
		if (!session?.email) return;
		Promise.all([getBuzzerVerificationStatus(session.email), getApplicationByEmail(session.email)]).then(([status, app]) => {
			if (!active) return;
			setVerificationStatus(status);
			setVerificationLoading(false);
			if (app) {
				setApplicationData(app);
				const curProf = store.state.profile;
				if (app.city && app.city !== curProf.city || app.address && app.address !== curProf.address || app.buzzerCategory && app.buzzerCategory !== curProf.buzzerCategory) store.updateProfile({
					city: app.city || curProf.city,
					address: app.address || curProf.address,
					buzzerCategory: app.buzzerCategory || curProf.buzzerCategory
				});
			}
		});
		return () => {
			active = false;
		};
	}, [session?.email]);
	const { jobs: allMergedJobs, refetch: refetchJobs } = useMergedJobs(store, true);
	(0, import_react.useEffect)(() => {
		if (typeof window !== "undefined") {
			try {
				localStorage.setItem("buzzhub.active_section.buzzer", section);
			} catch {}
			const url = new URL(window.location.href);
			if (url.searchParams.get("section") !== section) {
				url.searchParams.set("section", section);
				window.history.replaceState(null, "", url.toString());
			}
		}
		window.scrollTo({
			top: 0,
			left: 0,
			behavior: "instant"
		});
	}, [section]);
	(0, import_react.useEffect)(() => {
		const handlePopState = () => {
			const sp = new URLSearchParams(window.location.search).get("section");
			if (sp && BUZZER_SECTIONS.includes(sp)) setSection(sp);
		};
		window.addEventListener("popstate", handlePopState);
		return () => window.removeEventListener("popstate", handlePopState);
	}, []);
	if (!session || verificationLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-screen bg-gradient-to-br from-background to-accent/30 p-6",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-md space-y-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-8 w-40" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-32 w-full" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-64 w-full" })
			]
		})
	});
	const doLogout = () => {
		clearSession();
		try {
			localStorage.removeItem("buzzhub.active_section.buzzer");
		} catch {}
		toast.success("Berhasil keluar");
		navigate({ to: "/" });
	};
	const go = (k) => {
		setSection(k);
		setMobileOpen(false);
		window.scrollTo({
			top: 0,
			left: 0,
			behavior: "instant"
		});
	};
	const sidebarUser = {
		name: store.state.profile.name || session.name,
		email: store.state.profile.email || session.email,
		avatarUrl: store.state.profile.avatarUrl || session.avatarUrl,
		roleLabel: "buzzer"
	};
	const renderSidebar = (isCollapsed = false) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SidebarNav, {
		nav: navItems,
		activeKey: section,
		onNavigate: go,
		user: sidebarUser,
		onLogout: () => setLogoutOpen(true),
		collapsed: isCollapsed
	});
	const meta = sectionMeta[section] || {
		title: "Buzzer Dashboard",
		subtitle: "Kelola akun dan aktivitas Anda"
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-gradient-to-br from-background via-background to-accent/30",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto flex max-w-[1400px] gap-6 px-3 py-4 sm:px-6 lg:px-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
					className: cn("hidden shrink-0 transition-[width] duration-200 md:block", collapsed ? "w-[76px]" : "w-64"),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: cn("sticky top-6 rounded-2xl border border-border bg-card shadow-sm", collapsed ? "p-2" : "p-4"),
						children: renderSidebar(collapsed)
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
					className: "min-w-0 flex-1 pb-24 md:pb-0",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
							className: "mb-6 flex min-h-[56px] sm:min-h-[60px] items-center justify-between gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2.5 sm:gap-3 min-w-0",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SidebarCollapseButton, {
										collapsed,
										onToggle: toggle
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Sheet, {
										open: mobileOpen,
										onOpenChange: setMobileOpen,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetTrigger, {
											asChild: true,
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												variant: "outline",
												size: "icon",
												className: "md:hidden h-9 w-9 shrink-0",
												"aria-label": "Buka menu",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "h-4 w-4" })
											})
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetContent, {
											side: "left",
											className: "w-72 p-0",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "flex h-full flex-col overflow-y-auto p-4",
												children: renderSidebar()
											})
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0 flex flex-col justify-center",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
											className: "truncate font-display text-xl sm:text-2xl font-bold leading-7 tracking-tight",
											children: meta.title
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "truncate text-xs sm:text-sm text-muted-foreground leading-5",
											children: meta.subtitle
										})]
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex shrink-0 items-center gap-1.5 sm:gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThemeToggle, {}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BuzzerNotifBell, {
										notifState,
										email: session.email,
										onClick: () => setNotifOpen(true)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "outline",
										size: "icon",
										className: "md:hidden h-9 w-9",
										"aria-label": "Keluar",
										onClick: () => setLogoutOpen(true),
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "h-4 w-4" })
									})
								]
							})]
						}),
						section === "jobs" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(JobsSection, {
							store,
							verificationStatus,
							onGoProfil: () => go("profil"),
							onGoSosmed: () => go("sosmed"),
							sessionAvatar: session.avatarUrl
						}),
						section === "sosmed" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SosmedSection, {
							email: session.email,
							name: session.name
						}),
						section === "penghasilan" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PenghasilanSection, { store }),
						section === "ulasan" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RatingUlasanSection, { store }),
						section === "profil" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProfilSection, {
							store,
							onGoRatings: () => go("ulasan")
						}),
						section === "pengaturan" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BuzzerSettingsSection, { buzzerEmail: session.email })
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MobileBottomNav, {
				nav: navItems,
				activeKey: section,
				onNavigate: go
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BuzzerNotifSheet, {
				notifState,
				open: notifOpen,
				onOpenChange: setNotifOpen,
				buzzerEmail: session.email,
				onNavigate: (sec) => {
					setSection(sec);
					setNotifOpen(false);
				}
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialog, {
				open: logoutOpen,
				onOpenChange: setLogoutOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogTitle, { children: "Keluar akun buzzer?" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogDescription, { children: "Anda akan keluar dari sesi saat ini. Data lokal tetap tersimpan aman." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogCancel, { children: "Batal" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogAction, {
					onClick: doLogout,
					className: "gradient-brand text-brand-foreground",
					children: "Keluar"
				})] })] })
			})
		]
	});
}
var PLATFORM_FILTERS = [
	"Semua",
	"TikTok",
	"Instagram",
	"X (Twitter)",
	"Facebook",
	"YouTube",
	"Telegram",
	"LinkedIn"
];
var PAGE_SIZE = 5;
function hasUnreachedDeadline(deadline) {
	if (!deadline) return true;
	if (!/^\d{4}-\d{2}-\d{2}$/.test(deadline)) return true;
	const today = /* @__PURE__ */ new Date();
	return deadline >= [
		today.getFullYear(),
		String(today.getMonth() + 1).padStart(2, "0"),
		String(today.getDate()).padStart(2, "0")
	].join("-");
}
function JobsSection({ store, verificationStatus, onGoProfil, onGoSosmed, sessionAvatar }) {
	const { jobs, refetch } = useMergedJobs(store, true);
	const { accounts: socialAccounts } = useSocialAccounts(store.state.profile.email, store.state.profile.name);
	const [platform, setPlatform] = (0, import_react.useState)("Semua");
	const [q, setQ] = (0, import_react.useState)("");
	const [page, setPage] = (0, import_react.useState)(1);
	const [tab, setTab] = (0, import_react.useState)(() => {
		if (typeof window !== "undefined") {
			const sp = new URLSearchParams(window.location.search).get("tab");
			if (sp && [
				"tersedia",
				"saya",
				"riwayat"
			].includes(sp)) return sp;
			try {
				const stored = localStorage.getItem("buzzhub.active_tab.buzzer_jobs");
				if (stored && [
					"tersedia",
					"saya",
					"riwayat"
				].includes(stored)) return stored;
			} catch {}
		}
		return "tersedia";
	});
	(0, import_react.useEffect)(() => {
		if (typeof window !== "undefined") {
			try {
				localStorage.setItem("buzzhub.active_tab.buzzer_jobs", tab);
			} catch {}
			const url = new URL(window.location.href);
			if (url.searchParams.get("tab") !== tab) {
				url.searchParams.set("tab", tab);
				window.history.replaceState(null, "", url.toString());
			}
		}
	}, [tab]);
	const verifiedPlatforms = (0, import_react.useMemo)(() => {
		const set = /* @__PURE__ */ new Set();
		for (const a of socialAccounts) if (a.verification?.toLowerCase() === "terverifikasi" && a.isActive !== false) set.add(a.platform.trim().toLowerCase());
		if (socialAccounts.length === 0 && store.state.profile.platform) set.add(store.state.profile.platform.trim().toLowerCase());
		return set;
	}, [socialAccounts, store.state.profile.platform]);
	const availableJobs = (0, import_react.useMemo)(() => jobs.filter((j) => {
		if (j.status !== "Tersedia") return false;
		if (!hasUnreachedDeadline(j.deadline)) return false;
		return true;
	}), [jobs]);
	const myJobs = (0, import_react.useMemo)(() => jobs.filter((j) => {
		return [
			"Diambil",
			"Upload",
			"Review",
			"Revisi",
			"Selesai",
			"Ditolak"
		].includes(j.status);
	}), [jobs]);
	const activeJobs = (0, import_react.useMemo)(() => tab === "tersedia" ? availableJobs : tab === "saya" ? myJobs : jobs.filter((j) => ["Selesai", "Ditolak"].includes(j.status)), [
		availableJobs,
		myJobs,
		jobs,
		tab
	]);
	const filtered = (0, import_react.useMemo)(() => {
		return activeJobs.filter((j) => {
			if (platform !== "Semua" && j.platform !== platform) return false;
			if (q && !j.title.toLowerCase().includes(q.toLowerCase()) && !j.brief.toLowerCase().includes(q.toLowerCase())) return false;
			return true;
		});
	}, [
		activeJobs,
		platform,
		q
	]);
	const showMyJobs = async () => {
		await refetch();
		setTab("saya");
		setPage(1);
	};
	const avatarUrl = store.state.profile.avatarUrl || sessionAvatar;
	if (verificationStatus === "rejected") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "rounded-2xl border border-border bg-card p-6 shadow-sm",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-xl border border-rose-200 bg-rose-50 p-5 text-rose-900",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-lg font-bold",
				children: "Verifikasi Ditolak"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm",
				children: "Pendaftaran Anda telah ditolak oleh Admin. Anda tidak dapat mengambil job melalui akun ini."
			})]
		})
	});
	const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
	const currentPage = Math.min(page, totalPages);
	const paged = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
	const platformSummary = (0, import_react.useMemo)(() => {
		const list = [];
		for (const a of socialAccounts) if (a.verification === "Terverifikasi" && a.isActive !== false && !list.includes(a.platform)) list.push(a.platform);
		if (list.length === 0 && store.state.profile.platform) list.push(store.state.profile.platform);
		return list.join(", ");
	}, [socialAccounts, store.state.profile.platform]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-card p-4 shadow-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Avatar, {
						className: "h-12 w-12 border-2 border-background shadow-sm",
						children: [avatarUrl && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarImage, {
							src: avatarUrl,
							alt: store.state.profile.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarFallback, {
							className: "gradient-brand font-bold text-sm text-brand-foreground",
							children: store.state.profile.name.split(" ").map((n) => n[0]).join("").slice(0, 2)
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-display font-bold",
								children: store.state.profile.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: "Aktif" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-muted-foreground",
							children: [
								store.state.profile.username,
								" · ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-medium text-foreground",
									children: platformSummary
								}),
								" · ",
								store.state.profile.followers.toLocaleString("id-ID"),
								" followers"
							]
						})]
					})]
				}), onGoProfil && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					size: "sm",
					variant: "outline",
					onClick: onGoProfil,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "mr-1.5 h-3.5 w-3.5" }), " Kelola Profil"]
				})]
			}),
			verificationStatus === "pending" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-3.5 text-xs text-amber-900 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-200",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "h-4 w-4 shrink-0 text-amber-600" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Akun buzzer Anda sedang menunggu verifikasi admin. Anda tetap dapat melihat seluruh job yang tersedia di bawah ini." })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center gap-3 rounded-2xl border border-border bg-card p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative flex-1 min-w-[180px]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						className: "pl-9",
						placeholder: "Cari job...",
						value: q,
						onChange: (e) => {
							setQ(e.target.value);
							setPage(1);
						}
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
					value: platform,
					onValueChange: (v) => {
						setPlatform(v);
						setPage(1);
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectTrigger, {
						className: "w-[180px]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Funnel, { className: "mr-2 h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: PLATFORM_FILTERS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
						value: p,
						children: p
					}, p)) })]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
				value: tab,
				onValueChange: (v) => {
					setTab(v);
					setPage(1);
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
						value: "tersedia",
						children: [
							"Job Tersedia (",
							availableJobs.length,
							")"
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
						value: "saya",
						children: [
							"Job Saya (",
							myJobs.length,
							")"
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
						value: "riwayat",
						children: [
							"Riwayat (",
							jobs.filter((j) => ["Selesai", "Ditolak"].includes(j.status)).length,
							")"
						]
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
					value: tab,
					className: "mt-4 space-y-3",
					children: [paged.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Inbox, { className: "h-8 w-8" }),
						title: tab === "tersedia" ? "Belum ada job tersedia" : tab === "saya" ? "Belum ada job yang sedang Anda kerjakan" : "Belum ada riwayat job",
						desc: tab === "tersedia" ? "Cek kembali nanti untuk job kampanye baru." : tab === "saya" ? "Ambil job dari daftar Job Tersedia untuk mulai mengerjakan." : "Semua pekerjaan yang sudah selesai atau ditolak akan muncul di sini."
					}) : paged.map((j) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(JobCard, {
						job: j,
						store,
						hasPlatformAccount: verifiedPlatforms.has(j.platform.trim().toLowerCase()),
						onGoSosmed,
						onTaken: showMyJobs,
						onUpdated: refetch
					}, j.id)), filtered.length > PAGE_SIZE && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between pt-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-muted-foreground",
							children: [
								"Menampilkan ",
								(currentPage - 1) * PAGE_SIZE + 1,
								"–",
								Math.min(currentPage * PAGE_SIZE, filtered.length),
								" dari ",
								filtered.length
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "sm",
									variant: "outline",
									disabled: currentPage <= 1,
									onClick: () => setPage(currentPage - 1),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "h-4 w-4" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "grid place-items-center px-3 text-sm",
									children: [
										currentPage,
										" / ",
										totalPages
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "sm",
									variant: "outline",
									disabled: currentPage >= totalPages,
									onClick: () => setPage(currentPage + 1),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-4 w-4" })
								})
							]
						})]
					})]
				})]
			})
		]
	});
}
function statusVisual(s) {
	return {
		Tersedia: "bg-blue-100 text-blue-700",
		Diambil: "bg-indigo-100 text-indigo-700",
		Upload: "bg-cyan-100 text-cyan-700",
		Review: "bg-amber-100 text-amber-700",
		Revisi: "bg-orange-100 text-orange-700",
		Selesai: "bg-emerald-100 text-emerald-700",
		Ditolak: "bg-rose-100 text-rose-700"
	}[s];
}
function jobStatusLabel(job) {
	if (job.status === "Review" && !job.admin_verified_at) return "Verifikasi Admin";
	if (job.status === "Review" && job.admin_verified_at) return "Review Customer";
	return job.status;
}
function parseBuzzerJobBrief(briefText, jobTitle = "", platform = "") {
	let targetUrl = null;
	let taskAction = null;
	let customerInstructions = "";
	const urlMatch = briefText.match(/https?:\/\/[^\s"'<>\)]+/i) || briefText.match(/(?:(?:www\.)?(?:instagram\.com|tiktok\.com|youtube\.com|youtu\.be|twitter\.com|x\.com|facebook\.com|fb\.watch|t\.me)[^\s"'<>\)]*)/i);
	if (urlMatch) {
		let raw = urlMatch[0];
		if (!raw.startsWith("http://") && !raw.startsWith("https://")) raw = `https://${raw}`;
		targetUrl = raw;
	}
	const taskMatch = briefText.match(/(?:Jenis Tugas|Perintah|Tugas|Layanan|Action):\s*([^\n\r]+)/i);
	if (taskMatch) taskAction = taskMatch[1].trim();
	if (!taskAction) {
		const lowerTitle = jobTitle.toLowerCase();
		if (lowerTitle.includes("like") && (lowerTitle.includes("komentar") || lowerTitle.includes("comment"))) taskAction = "Like + Komentar";
		else if (lowerTitle.includes("like") || lowerTitle.includes("suka")) taskAction = "Like Postingan / Video";
		else if (lowerTitle.includes("komentar") || lowerTitle.includes("comment")) taskAction = "Tulis Komentar";
		else if (lowerTitle.includes("follow") || lowerTitle.includes("ikuti")) taskAction = "Follow Akun Target";
		else if (lowerTitle.includes("share") || lowerTitle.includes("bagikan")) taskAction = "Share / Bagikan Konten";
		else if (lowerTitle.includes("review") || lowerTitle.includes("ulasan")) taskAction = "Beri Ulasan / Review";
		else taskAction = `Engagement ${platform || "Sosial Media"}`;
	}
	const instructMatch = briefText.match(/(?:Catatan Customer|Instruksi Customer|Detail Instruksi|Instruksi):\s*([\s\S]+)/i);
	if (instructMatch) customerInstructions = instructMatch[1].trim();
	else customerInstructions = briefText.replace(/📌?\s*Jenis Tugas:\s*[^\n\r]+/gi, "").replace(/🔗?\s*Link Target(?:\s*Pengerjaan)?:\s*[^\n\r]+/gi, "").replace(/📍?\s*Lokasi:\s*[^\n\r]+/gi, "").trim() || briefText;
	const trimmed = customerInstructions.trim();
	if (trimmed === "." || trimmed === "-" || trimmed.toLowerCase() === "snckjeh" || trimmed.toLowerCase() === "null") customerInstructions = "";
	else customerInstructions = trimmed;
	return {
		targetUrl,
		taskAction,
		customerInstructions
	};
}
async function mergeImagesToPdf(files) {
	const { jsPDF } = await import("../_libs/jspdf.mjs").then((n) => n.n);
	const doc = new jsPDF({
		unit: "pt",
		format: "a4"
	});
	const pageWidth = doc.internal.pageSize.getWidth();
	const pageHeight = doc.internal.pageSize.getHeight();
	const maxWidth = pageWidth - 40;
	const maxHeight = pageHeight - 40;
	for (let i = 0; i < files.length; i++) {
		const file = files[i];
		const dataUrl = await new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.onload = () => resolve(reader.result);
			reader.onerror = reject;
			reader.readAsDataURL(file);
		});
		const img = await new Promise((resolve, reject) => {
			const image = new Image();
			image.onload = () => resolve(image);
			image.onerror = reject;
			image.src = dataUrl;
		});
		const naturalWidth = img.naturalWidth || img.width || 800;
		const naturalHeight = img.naturalHeight || img.height || 600;
		const scale = Math.min(maxWidth / naturalWidth, maxHeight / naturalHeight, 1);
		const renderWidth = naturalWidth * scale;
		const renderHeight = naturalHeight * scale;
		const x = (pageWidth - renderWidth) / 2;
		const y = (pageHeight - renderHeight) / 2;
		if (i > 0) doc.addPage("a4", "portrait");
		const format = file.type === "image/png" ? "PNG" : "JPEG";
		doc.addImage(dataUrl, format, x, y, renderWidth, renderHeight, void 0, "FAST");
	}
	const pdfBlob = doc.output("blob");
	return new File([pdfBlob], `bukti-pengerjaan-${files.length}-halaman.pdf`, {
		type: "application/pdf",
		lastModified: Date.now()
	});
}
function JobCard({ job, store, hasPlatformAccount = true, onGoSosmed, onTaken, onUpdated }) {
	const [open, setOpen] = (0, import_react.useState)(null);
	const [noAccountWarningOpen, setNoAccountWarningOpen] = (0, import_react.useState)(false);
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [proof, setProof] = (0, import_react.useState)("");
	const [shot, setShot] = (0, import_react.useState)(null);
	const [shotPreview, setShotPreview] = (0, import_react.useState)(null);
	const [converting, setConverting] = (0, import_react.useState)(false);
	const [convertedCount, setConvertedCount] = (0, import_react.useState)(null);
	const [optimisticStatus, setOptimisticStatus] = (0, import_react.useState)(null);
	const [optimisticProofUrl, setOptimisticProofUrl] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		setOptimisticStatus(null);
		setOptimisticProofUrl(null);
	}, [job.status, job.proofUrl]);
	const currentStatus = optimisticStatus || job.status;
	const currentProofUrl = optimisticProofUrl || job.proofUrl;
	const currentJob = (0, import_react.useMemo)(() => ({
		...job,
		status: currentStatus,
		proofUrl: currentProofUrl
	}), [
		job,
		currentStatus,
		currentProofUrl
	]);
	const handleTakeJob = async () => {
		if (!hasPlatformAccount && currentStatus === "Tersedia") {
			setNoAccountWarningOpen(true);
			return;
		}
		await doTake();
	};
	const pickFiles = async (fileList) => {
		if (!fileList || fileList.length === 0) {
			setShot(null);
			setShotPreview(null);
			setConvertedCount(null);
			return;
		}
		const files = Array.from(fileList);
		if (files.length === 1) {
			const file = files[0];
			if (file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")) {
				setShot(file);
				setShotPreview(null);
				setConvertedCount(null);
			} else {
				setShot(file);
				setShotPreview(URL.createObjectURL(file));
				setConvertedCount(null);
			}
			return;
		}
		if (files.some((f) => f.type === "application/pdf" || f.name.toLowerCase().endsWith(".pdf"))) {
			toast.error("Jika ingin mengunggah file PDF, silakan pilih 1 file PDF saja.");
			return;
		}
		setConverting(true);
		try {
			toast.info(`Menggabungkan ${files.length} gambar menjadi 1 file PDF...`);
			const pdf = await mergeImagesToPdf(files);
			setShot(pdf);
			setShotPreview(null);
			setConvertedCount(files.length);
			toast.success(`${files.length} gambar berhasil dijadikan 1 file PDF!`);
		} catch (err) {
			console.error("[Proof Upload] Gagal membuat PDF:", err);
			toast.error("Gagal menggabungkan gambar menjadi PDF.");
		} finally {
			setConverting(false);
		}
	};
	const resetProofForm = () => {
		setProof("");
		setShot(null);
		setShotPreview(null);
		setConvertedCount(null);
	};
	const lv = useBuzzerLevel(store.state.profile.email);
	const jobLevel = job.buzzerLevel ?? lv.level?.name ?? "Belum ditetapkan";
	const buzzerPct = getBuzzerPercentageForLevel(job.buzzerLevel ?? lv.level?.name);
	const grossPrice = Math.max(0, job.grossPrice ?? 0);
	const payout = (() => {
		if (grossPrice <= 0) return 0;
		return Math.round(grossPrice * buzzerPct / 100);
	})();
	const parsed = (0, import_react.useMemo)(() => parseBuzzerJobBrief(job.brief, job.title, job.platform), [
		job.brief,
		job.title,
		job.platform
	]);
	const displayBrief = (0, import_react.useMemo)(() => {
		if (!job.brief) return "";
		if (job.brief.includes("📌") || job.brief.includes("Jenis Tugas:") || job.brief.includes("Link Target:")) {
			const parts = [];
			if (parsed.taskAction) parts.push(parsed.taskAction);
			if (parsed.customerInstructions) parts.push(parsed.customerInstructions);
			return parts.join(" — ");
		}
		return job.brief;
	}, [
		job.brief,
		parsed.taskAction,
		parsed.customerInstructions
	]);
	const remoteId = job.id.startsWith(DB_PREFIX) ? job.id.slice(3) : null;
	const doTake = async () => {
		setLoading(true);
		try {
			if (remoteId) await takeCampaignJob(remoteId, store.state.profile.email, store.state.profile.name);
			else {
				await new Promise((r) => setTimeout(r, 400));
				store.takeJob(job.id);
			}
			await onTaken?.();
			toast.success(`Job "${job.title}" berhasil diambil`);
		} catch {
			toast.error("Gagal mengambil job, coba lagi");
		} finally {
			setLoading(false);
		}
	};
	const doUpload = async () => {
		if (!shot) return toast.error("File bukti pengerjaan wajib diunggah (gambar atau PDF)");
		if (!proof.trim()) return toast.error("Link postingan wajib diisi agar admin dapat memverifikasi pengerjaan.");
		if (!remoteId) {
			console.error("[Proof Upload] Job tidak memiliki ID campaign_jobs Supabase:", job.id);
			return toast.error("Job ini belum tersambung ke database Supabase.");
		}
		setLoading(true);
		try {
			const value = `${await uploadProofScreenshot(shot)} | ${proof.trim()}`;
			await submitCampaignJobProof(remoteId, value, store.state.profile.email);
			store.uploadProof(job.id, value);
			setOptimisticStatus("Review");
			setOptimisticProofUrl(value);
			setOpen(null);
			resetProofForm();
			toast.success("Bukti pengerjaan berhasil diunggah, menunggu verifikasi admin");
			notifyTaskSubmitted({
				buzzerEmail: store.state.profile.email,
				campaignTitle: job.title,
				jobId: job.id,
				isResubmit: false
			});
			await onUpdated?.();
		} catch (error) {
			console.error("[Proof Upload] Gagal mengunggah bukti pekerjaan:", error);
			const detail = error instanceof Error ? error.message : String(error);
			toast.error(`Gagal mengunggah bukti: ${detail}`);
		} finally {
			setLoading(false);
		}
	};
	const doResubmit = async () => {
		if (!shot) return toast.error("File bukti pengerjaan baru wajib diunggah (gambar atau PDF)");
		if (!proof.trim()) return toast.error("Link postingan wajib diisi agar admin dapat memverifikasi pengerjaan.");
		if (!remoteId) {
			console.error("[Proof Upload] Job revisi tidak memiliki ID campaign_jobs Supabase:", job.id);
			return toast.error("Job ini belum tersambung ke database Supabase.");
		}
		setLoading(true);
		try {
			const value = `${await uploadProofScreenshot(shot)} | ${proof.trim()}`;
			await submitCampaignJobProof(remoteId, value, store.state.profile.email);
			store.resubmitProof(job.id, value);
			setOptimisticStatus("Review");
			setOptimisticProofUrl(value);
			setOpen(null);
			resetProofForm();
			toast.success("Perbaikan bukti berhasil dikirim ulang");
			notifyTaskSubmitted({
				buzzerEmail: store.state.profile.email,
				campaignTitle: job.title,
				jobId: job.id,
				isResubmit: true
			});
			await onUpdated?.();
		} catch (error) {
			console.error("[Proof Upload] Gagal mengirim ulang bukti pekerjaan:", error);
			const detail = error instanceof Error ? error.message : String(error);
			toast.error(`Gagal mengirim perbaikan: ${detail}`);
		} finally {
			setLoading(false);
		}
	};
	const primaryAction = (() => {
		switch (currentStatus) {
			case "Tersedia": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				size: "sm",
				disabled: loading,
				onClick: handleTakeJob,
				className: "gradient-brand text-brand-foreground shadow-glow",
				children: loading ? "Memproses..." : "Ambil Job"
			});
			case "Diambil": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				size: "sm",
				onClick: () => setOpen("upload"),
				className: "gradient-brand text-brand-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "mr-1 h-3.5 w-3.5" }), " Upload Bukti"]
			});
			case "Review": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				size: "sm",
				variant: "outline",
				onClick: () => setOpen("status"),
				children: "Cek Status"
			});
			case "Revisi": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				size: "sm",
				onClick: () => setOpen("revisi"),
				className: "bg-amber-500 text-white hover:bg-amber-600",
				children: "Perbaiki Tugas"
			});
			case "Selesai": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				size: "sm",
				variant: "outline",
				onClick: () => setOpen("hasil"),
				children: "Lihat Hasil"
			});
			case "Ditolak": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				size: "sm",
				variant: "outline",
				onClick: () => setOpen("status"),
				children: "Lihat Alasan"
			});
			case "Upload": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				size: "sm",
				variant: "outline",
				onClick: () => setOpen("status"),
				children: "Cek Status"
			});
		}
	})();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("article", {
			className: "rounded-2xl border border-border bg-card p-5 transition-shadow hover:shadow-md",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "inline-flex items-center gap-1 rounded-md bg-accent px-2 py-0.5 text-xs font-semibold text-accent-foreground",
									children: [
										PLATFORM_ICON[job.platform],
										" ",
										job.platform
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: cn("inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold", statusVisual(currentStatus)),
									children: jobStatusLabel(currentJob)
								}),
								currentStatus === "Tersedia" && (job.slotsLeft ?? 1) > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "inline-flex rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-700",
									children: [job.slotsLeft, " slot tersisa"]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
							className: "mt-2 truncate font-display text-base font-bold",
							children: job.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 line-clamp-2 text-sm text-muted-foreground",
							children: displayBrief
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 flex flex-wrap items-center gap-4 text-xs text-muted-foreground",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "inline-flex items-center gap-1",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-3.5 w-3.5" }),
										" Deadline ",
										job.deadline
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "inline-flex items-center gap-1",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DollarSign, { className: "h-3.5 w-3.5" }),
										" Payout ",
										formatIDR(payout)
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "inline-flex items-center gap-1 rounded-full bg-accent px-2 py-0.5 font-semibold text-accent-foreground",
									children: lv.level ? `${lv.level.emoji} ${lv.level.name}` : "Level belum ditetapkan"
								})
							]
						}),
						currentStatus === "Revisi" && job.note && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-3 flex items-start gap-2 rounded-lg bg-amber-50 p-2 text-xs text-amber-800",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "h-3.5 w-3.5 shrink-0" }),
								" ",
								job.note
							]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex shrink-0 flex-col gap-2",
					children: [
						primaryAction,
						currentStatus === "Ditolak" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "sm",
							className: "gradient-brand text-brand-foreground",
							onClick: () => setOpen("revisi"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "mr-1 h-3.5 w-3.5" }), " Upload Ulang"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: "ghost",
							className: "h-8 w-8 p-0",
							title: "Detail",
							"aria-label": "Detail",
							onClick: () => setOpen("detail"),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-4 w-4" })
						})
					]
				})]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open: open === "detail",
			onOpenChange: (v) => !v && setOpen(null),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
				className: "max-h-[90vh] overflow-y-auto sm:max-w-lg",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
						className: "pr-6 leading-snug",
						children: job.title
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogDescription, {
						className: "flex flex-wrap items-center gap-2 pt-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "inline-flex items-center gap-1 rounded-md bg-accent px-2 py-0.5 text-xs font-semibold text-accent-foreground",
							children: [
								PLATFORM_ICON[job.platform],
								" ",
								job.platform
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: cn("inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold", statusVisual(currentStatus)),
							children: jobStatusLabel(currentJob)
						})]
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-4 text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-xl border border-border bg-muted/40 p-3",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-muted-foreground",
											children: "Fee yang kamu terima"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "font-display text-lg font-bold",
											children: formatIDR(payout)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-xs text-muted-foreground",
											children: ["Sudah termasuk potongan admin · Level ", lv.level?.name ?? jobLevel]
										})
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-xl border border-border bg-muted/40 p-3",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-muted-foreground",
											children: "Deadline"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "font-display text-lg font-bold",
											children: job.deadline
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-muted-foreground",
											children: "Kirim bukti sebelum tanggal ini"
										})
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
								className: "rounded-xl border border-border bg-muted/30 p-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
									className: "mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground",
									children: "Rincian Pendapatan"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid gap-2 text-sm sm:grid-cols-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground",
											children: "Level:"
										}),
										" ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: jobLevel })
									] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground",
											children: "Yang kamu dapatkan:"
										}),
										" ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: formatIDR(payout) })
									] })]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
								className: "mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground",
								children: "Tugas"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-xl border border-border p-3.5 space-y-2.5 bg-muted/20",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-xs uppercase tracking-wider text-muted-foreground font-semibold",
												children: "Perintah:"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-bold text-foreground text-sm",
												children: parsed.taskAction
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "inline-flex items-center gap-1 rounded-md bg-accent px-2 py-0.5 text-xs font-semibold text-accent-foreground",
											children: [
												PLATFORM_ICON[job.platform],
												" ",
												job.platform
											]
										})]
									}),
									parsed.targetUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "border-t border-border pt-2.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-muted-foreground mb-1.5",
											children: "Link Target (klik untuk langsung membuka):"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
											href: parsed.targetUrl,
											target: "_blank",
											rel: "noreferrer",
											className: "group flex items-center justify-between gap-2.5 rounded-lg border border-primary/30 bg-primary/5 p-2.5 transition-colors hover:border-primary hover:bg-primary/10 cursor-pointer",
											title: "Klik untuk langsung membuka video/postingan target",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-mono text-xs text-primary underline underline-offset-2 break-all line-clamp-2 font-medium",
												children: parsed.targetUrl
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "h-4 w-4 shrink-0 text-primary group-hover:scale-110 transition-transform" })]
										})]
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "border-t border-border pt-2.5",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-xs text-amber-600 flex items-center gap-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "h-3.5 w-3.5 shrink-0" }), " Link belum dicantumkan oleh customer"]
										})
									}),
									parsed.customerInstructions ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "border-t border-border pt-2.5 text-xs leading-relaxed",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground font-semibold",
											children: "Catatan Customer: "
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-foreground",
											children: parsed.customerInstructions
										})]
									}) : null
								]
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
								className: "mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground",
								children: "Syarat"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
								className: "list-inside list-disc space-y-1 rounded-xl border border-border p-3 text-muted-foreground",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
										"Akun ",
										job.platform,
										" kamu aktif & sudah terverifikasi admin."
									] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Konten orisinal, tidak mengandung SARA atau unsur negatif." }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Postingan tidak dihapus minimal 7 hari setelah tayang." })
								]
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
								className: "mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground",
								children: "Instruksi Pengerjaan"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ol", {
								className: "list-inside list-decimal space-y-1.5 rounded-xl border border-border p-3 text-muted-foreground text-xs leading-relaxed",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
										"Ambil job ini dengan menekan tombol ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Ambil Job" }),
										" agar slot terkunci untukmu."
									] }),
									parsed.targetUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
										"Buka ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Link Video/Postingan Target" }),
										" di atas pada aplikasi ",
										job.platform,
										"."
									] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
										"Buka aplikasi ",
										job.platform,
										" sesuai instruksi customer."
									] }),
									parsed.taskAction.toLowerCase().includes("like") && parsed.taskAction.toLowerCase().includes("komentar") ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
											"Berikan ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Like (Suka)" }),
											" pada postingan/video target tersebut menggunakan akun ",
											job.platform,
											" terverifikasi."
										] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
											"Tulis ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "komentar positif" }),
											" yang relevan dan sesuai catatan instruksi customer."
										] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
											"Ambil ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Screenshot (tangkapan layar)" }),
											" bukti bahwa kamu sudah Like dan komentar kamu sudah muncul."
										] })
									] }) : parsed.taskAction.toLowerCase().includes("like") ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
										"Berikan ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Like (Suka)" }),
										" pada postingan/video target tersebut."
									] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
										"Ambil ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Screenshot (tangkapan layar)" }),
										" bukti bahwa kamu sudah menekan tombol Like."
									] })] }) : parsed.taskAction.toLowerCase().includes("komentar") || parsed.taskAction.toLowerCase().includes("comment") ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
										"Tulis ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "komentar positif dan relevan" }),
										" pada postingan/video target."
									] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
										"Ambil ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Screenshot (tangkapan layar)" }),
										" bukti komentar kamu yang sudah terpublikasi."
									] })] }) : parsed.taskAction.toLowerCase().includes("follow") || parsed.taskAction.toLowerCase().includes("ikuti") ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
										"Klik tombol ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Ikuti (Follow)" }),
										" pada akun target menggunakan akun ",
										job.platform,
										" kamu."
									] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
										"Ambil ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Screenshot (tangkapan layar)" }),
										" bukti bahwa status akun tersebut sudah Mengikuti (Following)."
									] })] }) : parsed.taskAction.toLowerCase().includes("share") || parsed.taskAction.toLowerCase().includes("bagikan") ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Bagikan (Share)" }),
										" konten target ke timeline / story akun ",
										job.platform,
										" kamu."
									] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
										"Ambil ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Screenshot (tangkapan layar)" }),
										" bukti bahwa konten telah berhasil kamu bagikan."
									] })] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
										"Lakukan aksi ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: parsed.taskAction }),
										" sesuai instruksi customer di atas."
									] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
										"Ambil ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Screenshot (tangkapan layar)" }),
										" bukti pengerjaan kamu."
									] })] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
										"Kembali ke BuzzHub, klik ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Upload Bukti" }),
										", lalu unggah file screenshot tersebut."
									] })
								]
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
									className: "mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground",
									children: "Bukti yang Dikirim"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "rounded-xl border border-border p-3 text-muted-foreground",
									children: [
										"Link publik postingan/video di ",
										job.platform,
										" (contoh: https://...). Pastikan bisa dibuka tanpa login."
									]
								}),
								currentProofUrl && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-3 flex flex-col gap-1.5 text-xs",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-semibold text-foreground",
										children: "Bukti terkirim:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProofLink, { proofUrl: currentProofUrl })]
								})
							] }),
							job.note && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "flex items-start gap-2 rounded-xl bg-amber-50 p-3 text-xs text-amber-800",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "h-4 w-4 shrink-0" }),
									" ",
									job.note
								]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
						className: "gap-2 sm:justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							onClick: () => setOpen(null),
							children: "Tutup"
						}), currentStatus === "Tersedia" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "lg",
							disabled: loading,
							onClick: async () => {
								if (!hasPlatformAccount) {
									setOpen(null);
									setNoAccountWarningOpen(true);
									return;
								}
								await doTake();
								setOpen(null);
							},
							className: "w-full gradient-brand text-brand-foreground shadow-glow sm:w-auto",
							children: loading ? "Memproses..." : `Ambil Job · ${formatIDR(payout)}`
						}) : currentStatus === "Diambil" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "lg",
							onClick: () => setOpen("upload"),
							className: "w-full gradient-brand text-brand-foreground sm:w-auto",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "mr-1 h-4 w-4" }), " Upload Bukti"]
						}) : null]
					})
				]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open: open === "upload",
			onOpenChange: (v) => !v && setOpen(null),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, { children: ["Upload Bukti — ", job.title] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Unggah screenshot sebagai bukti pesanan sudah dikerjakan." })] }),
				parsed.targetUrl && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-primary/20 bg-primary/5 p-3 flex flex-wrap items-center justify-between gap-2 text-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-muted-foreground truncate max-w-[220px]",
						children: ["Tugas: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", {
							className: "text-foreground",
							children: parsed.taskAction
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
						href: parsed.targetUrl,
						target: "_blank",
						rel: "noreferrer",
						className: "inline-flex items-center gap-1 font-semibold text-primary underline underline-offset-2 hover:text-primary/80",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "h-3.5 w-3.5" }), " Buka Kembali Link Target"]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "shot",
							children: "File Bukti Pengerjaan (wajib)"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "shot",
							type: "file",
							multiple: true,
							accept: "image/png,image/jpeg,image/webp,application/pdf,.png,.jpg,.jpeg,.webp,.pdf",
							onChange: (e) => void pickFiles(e.target.files)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[11px] text-muted-foreground leading-normal",
							children: "* Format: PNG, JPG, JPEG, atau PDF. Jika bukti pengerjaan lebih dari 1 gambar, silakan jadikan 1 file PDF (atau pilih beberapa gambar sekaligus untuk digabung otomatis menjadi PDF)."
						}),
						converting && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 rounded-xl border border-primary/20 bg-primary/5 p-3 text-xs text-primary animate-pulse",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Sedang menggabungkan gambar menjadi 1 file PDF..." })]
						}),
						!converting && shot && (shot.type === "application/pdf" || shot.name.toLowerCase().endsWith(".pdf")) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between rounded-xl border border-rose-500/20 bg-rose-500/10 p-3 text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2.5 min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-6 w-6 text-rose-600 dark:text-rose-400 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-semibold text-foreground truncate",
										children: shot.name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-[11px] text-muted-foreground",
										children: [
											(shot.size / 1024).toFixed(1),
											" KB · Dokumen PDF ",
											convertedCount ? `(${convertedCount} gambar digabung)` : ""
										]
									})]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "shrink-0 rounded-md bg-rose-500/20 px-2 py-0.5 text-[11px] font-semibold text-rose-700 dark:text-rose-300",
								children: "PDF Siap Kirim"
							})]
						}),
						!converting && shotPreview && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "relative mt-2 overflow-hidden rounded-lg border border-border",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: shotPreview,
								alt: "Pratinjau screenshot bukti",
								className: "max-h-56 w-full object-contain bg-black/5"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "proof",
							children: "Link postingan (wajib)"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "proof",
							placeholder: "https://instagram.com/p/... atau https://tiktok.com/@...",
							value: proof,
							onChange: (e) => setProof(e.target.value)
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					onClick: () => setOpen(null),
					children: "Batal"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					onClick: doUpload,
					disabled: loading || converting,
					className: "gradient-brand text-brand-foreground",
					children: loading ? "Mengunggah..." : converting ? "Memproses PDF..." : "Kirim"
				})] })
			] })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open: open === "revisi",
			onOpenChange: (v) => !v && setOpen(null),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, { children: ["Perbaiki Pengerjaan — ", job.title] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Silakan perbaiki pengerjaan sesuai alasan Admin, kemudian upload bukti terbaru." })] }),
				(job.rejection_reason || job.note) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "rounded-lg bg-amber-50 p-3 text-sm text-amber-800",
					children: ["Alasan Admin: ", job.rejection_reason || job.note]
				}),
				parsed.targetUrl && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-primary/20 bg-primary/5 p-3 flex flex-wrap items-center justify-between gap-2 text-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-muted-foreground truncate max-w-[220px]",
						children: ["Tugas: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", {
							className: "text-foreground",
							children: parsed.taskAction
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
						href: parsed.targetUrl,
						target: "_blank",
						rel: "noreferrer",
						className: "inline-flex items-center gap-1 font-semibold text-primary underline underline-offset-2 hover:text-primary/80",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "h-3.5 w-3.5" }), " Buka Kembali Link Target"]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "shot2",
							children: "File Bukti Baru (wajib)"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "shot2",
							type: "file",
							multiple: true,
							accept: "image/png,image/jpeg,image/webp,application/pdf,.png,.jpg,.jpeg,.webp,.pdf",
							onChange: (e) => void pickFiles(e.target.files)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[11px] text-muted-foreground leading-normal",
							children: "* Format: PNG, JPG, JPEG, atau PDF. Jika bukti pengerjaan lebih dari 1 gambar, silakan jadikan 1 file PDF (atau pilih beberapa gambar sekaligus untuk digabung otomatis menjadi PDF)."
						}),
						converting && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 rounded-xl border border-primary/20 bg-primary/5 p-3 text-xs text-primary animate-pulse",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Sedang menggabungkan gambar menjadi 1 file PDF..." })]
						}),
						!converting && shot && (shot.type === "application/pdf" || shot.name.toLowerCase().endsWith(".pdf")) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between rounded-xl border border-rose-500/20 bg-rose-500/10 p-3 text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2.5 min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-6 w-6 text-rose-600 dark:text-rose-400 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-semibold text-foreground truncate",
										children: shot.name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-[11px] text-muted-foreground",
										children: [
											(shot.size / 1024).toFixed(1),
											" KB · Dokumen PDF ",
											convertedCount ? `(${convertedCount} gambar digabung)` : ""
										]
									})]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "shrink-0 rounded-md bg-rose-500/20 px-2 py-0.5 text-[11px] font-semibold text-rose-700 dark:text-rose-300",
								children: "PDF Siap Kirim"
							})]
						}),
						!converting && shotPreview && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "relative mt-2 overflow-hidden rounded-lg border border-border",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: shotPreview,
								alt: "Pratinjau screenshot bukti baru",
								className: "max-h-56 w-full object-contain bg-black/5"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "proof2",
							children: "Link postingan (wajib)"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "proof2",
							placeholder: "https://instagram.com/p/... atau https://tiktok.com/@...",
							value: proof,
							onChange: (e) => setProof(e.target.value)
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					onClick: () => setOpen(null),
					children: "Batal"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					onClick: doResubmit,
					disabled: loading || converting,
					className: "gradient-brand text-brand-foreground",
					children: loading ? "Mengirim..." : converting ? "Memproses PDF..." : "Kirim Ulang"
				})] })
			] })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open: open === "status",
			onOpenChange: (v) => !v && setOpen(null),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: currentStatus === "Revisi" || currentStatus === "Ditolak" ? "Pengerjaan Perlu Revisi" : `Status: ${jobStatusLabel(currentJob)}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogDescription, { children: [
				currentStatus === "Review" && (currentJob.admin_verified_at ? "Pengerjaan sudah diverifikasi admin dan sedang menunggu ulasan customer." : "Bukti kamu sedang menunggu verifikasi admin. Rata-rata 1×24 jam."),
				(currentStatus === "Revisi" || currentStatus === "Ditolak") && "Alasan Admin:",
				currentStatus === "Upload" && "Menunggu unggahan bukti."
			] })] }), currentStatus === "Revisi" || currentStatus === "Ditolak" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-3 text-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "rounded-lg bg-rose-50 p-3 text-rose-800",
						children: currentJob.rejection_reason || currentJob.note || "Pekerjaan ditolak. Silakan perbaiki dan upload ulang."
					}),
					currentJob.rejected_at && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-muted-foreground",
						children: ["Tanggal penolakan: ", new Date(currentJob.rejected_at).toLocaleString("id-ID")]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-semibold text-amber-700",
						children: "Status: Perlu Diperbaiki"
					}),
					currentProofUrl && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-1.5 text-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-muted-foreground font-medium",
							children: "Bukti sebelumnya:"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProofLink, { proofUrl: currentProofUrl })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						className: "gradient-brand text-brand-foreground",
						onClick: () => setOpen("revisi"),
						children: "Upload Ulang"
					})
				]
			}) : currentProofUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-1.5 text-sm pt-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-muted-foreground font-medium",
					children: "Bukti pengerjaan:"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProofLink, { proofUrl: currentProofUrl })]
			}) : null] })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open: open === "hasil",
			onOpenChange: (v) => !v && setOpen(null),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Hasil Pekerjaan" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Job selesai & payout sudah dikreditkan ke saldo." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-2 text-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-muted-foreground",
							children: "Level:"
						}),
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-bold",
							children: jobLevel
						})
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-muted-foreground",
							children: "Payout yang kamu terima:"
						}),
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-bold text-emerald-700",
							children: formatIDR(payout)
						})
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-muted-foreground",
							children: "Status pendapatan:"
						}),
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-bold text-emerald-700",
							children: "Sudah dikreditkan"
						})
					] }),
					currentProofUrl && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-1.5 pt-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-muted-foreground text-xs font-medium",
							children: "Bukti pengerjaan:"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProofLink, { proofUrl: currentProofUrl })]
					})
				]
			})] })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open: noAccountWarningOpen,
			onOpenChange: setNoAccountWarningOpen,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
				className: "sm:max-w-md",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "h-6 w-6" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
							className: "text-center text-lg",
							children: "Akun media sosial belum ada, ayo daftar"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogDescription, {
							className: "text-center text-xs",
							children: [
								"Kamu belum memiliki akun ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-semibold text-foreground",
									children: job.platform
								}),
								" yang terverifikasi untuk mengambil job ini."
							]
						})
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-2 text-xs leading-relaxed text-foreground",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 font-semibold text-primary",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Rekomendasi untuk Buzzer:" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-muted-foreground",
								children: "Ayo daftarkan akun media sosialmu sebanyak-banyaknya! Semakin banyak akun media sosial yang kamu miliki (Instagram, TikTok, Twitter/X, dll), semakin banyak pilihan job yang bisa kamu kerjakan dan semakin besar penghasilanmu."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-muted-foreground",
								children: [
									"💡 ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Bisa tambah akun lagi:" }),
									" Jika kamu sudah punya akun ",
									job.platform,
									", kamu juga tetap bisa menambahkan akun ",
									job.platform,
									" lainnya. Bayaran job tetap disesuaikan dengan followers media sosialmu!"
								]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
						className: "gap-2 sm:justify-between sm:gap-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							onClick: () => setNoAccountWarningOpen(false),
							children: "Nanti Saja"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							className: "gradient-brand text-brand-foreground shadow-glow gap-1.5",
							onClick: () => {
								setNoAccountWarningOpen(false);
								onGoSosmed?.();
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), " Ayo Daftar Akun Sekarang"]
						})]
					})
				]
			})
		})
	] });
}
function PenghasilanSection({ store }) {
	const { state } = store;
	const [from, setFrom] = (0, import_react.useState)("");
	const [to, setTo] = (0, import_react.useState)("");
	const [wOpen, setWOpen] = (0, import_react.useState)(false);
	const [amount, setAmount] = (0, import_react.useState)("");
	const [methodType, setMethodType] = (0, import_react.useState)("Bank");
	const [provider, setProvider] = (0, import_react.useState)("BCA");
	const [accountNo, setAccountNo] = (0, import_react.useState)("");
	const [accountName, setAccountName] = (0, import_react.useState)("");
	const [viewingProofUrl, setViewingProofUrl] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(false);
	const BANKS = [
		"BCA",
		"Mandiri",
		"BRI",
		"BNI"
	];
	const EWALLETS = [
		"DANA",
		"ShopeePay",
		"GoPay",
		"OVO"
	];
	const resetWithdrawForm = () => {
		setAmount("");
		setMethodType("Bank");
		setProvider(BANKS[0]);
		setAccountNo("");
		setAccountName("");
	};
	const handleOpenWithdraw = () => {
		resetWithdrawForm();
		setWOpen(true);
	};
	const now = /* @__PURE__ */ new Date();
	const monthTotal = state.earnings.filter((e) => e.status === "Berhasil" && new Date(e.date).getMonth() === now.getMonth()).reduce((a, e) => a + e.amount, 0);
	const weekAgo = /* @__PURE__ */ new Date();
	weekAgo.setDate(weekAgo.getDate() - 7);
	const weekTotal = state.earnings.filter((e) => e.status === "Berhasil" && new Date(e.date) >= weekAgo).reduce((a, e) => a + e.amount, 0);
	state.earnings.filter((e) => e.status === "Pending" || e.status === "Diproses").reduce((a, e) => a + e.amount, 0);
	const inRange = (d) => (!from || d >= from) && (!to || d <= to);
	const earningsF = (Array.isArray(state.earnings) ? state.earnings : []).filter((e) => inRange(e.date));
	const withdrawsF = (Array.isArray(state.withdrawals) ? state.withdrawals : []).filter((w) => inRange(w.date));
	const PAGE_SIZE = 8;
	const [earningsPage, setEarningsPage] = (0, import_react.useState)(1);
	const [withdrawalsPage, setWithdrawalsPage] = (0, import_react.useState)(1);
	(0, import_react.useEffect)(() => {
		setEarningsPage(1);
		setWithdrawalsPage(1);
	}, [from, to]);
	const totalEarningsPages = Math.max(1, Math.ceil(earningsF.length / PAGE_SIZE));
	const safeEarningsPage = Math.min(Math.max(1, earningsPage), totalEarningsPages);
	const paginatedEarnings = (0, import_react.useMemo)(() => {
		const start = (safeEarningsPage - 1) * PAGE_SIZE;
		return earningsF.slice(start, start + PAGE_SIZE);
	}, [earningsF, safeEarningsPage]);
	const totalWithdrawalsPages = Math.max(1, Math.ceil(withdrawsF.length / PAGE_SIZE));
	const safeWithdrawalsPage = Math.min(Math.max(1, withdrawalsPage), totalWithdrawalsPages);
	const paginatedWithdrawals = (0, import_react.useMemo)(() => {
		const start = (safeWithdrawalsPage - 1) * PAGE_SIZE;
		return withdrawsF.slice(start, start + PAGE_SIZE);
	}, [withdrawsF, safeWithdrawalsPage]);
	const pendingWithdrawalTotal = (Array.isArray(state.withdrawals) ? state.withdrawals : []).filter((w) => w.status === "Menunggu").reduce((sum, w) => sum + Number(w.amount || 0), 0);
	const availableToWithdraw = Math.max(0, state.balance - pendingWithdrawalTotal);
	const submitWithdraw = async () => {
		const numAmount = Number(amount);
		const digitsOnlyAccountNo = accountNo.replace(/\D/g, "");
		if (!amount.trim() || isNaN(numAmount) || numAmount <= 0) return toast.error("Nominal pencairan wajib diisi");
		if (numAmount < 1e3) return toast.error("Minimal pencairan saldo adalah Rp 1.000");
		if (numAmount > availableToWithdraw) {
			if (pendingWithdrawalTotal > 0) return toast.error(`Saldo yang siap ditarik adalah ${formatIDR(availableToWithdraw)} (${formatIDR(pendingWithdrawalTotal)} sedang menunggu verifikasi admin).`);
			return toast.error(`Nominal melebihi saldo tersedia (${formatIDR(state.balance)})`);
		}
		if (!digitsOnlyAccountNo) return toast.error(`Nomor ${methodType === "Bank" ? "rekening" : "e-wallet"} wajib diisi`);
		if (!accountName.trim()) return toast.error("Nama pemilik rekening / akun (atas nama) wajib diisi");
		const methodLabel = `${provider} • ${digitsOnlyAccountNo}`;
		setLoading(true);
		const ok = await store.requestWithdrawal(numAmount, methodLabel, digitsOnlyAccountNo, accountName.trim());
		setLoading(false);
		if (ok) {
			setWOpen(false);
			resetWithdrawForm();
			toast.success(`Pengajuan pencairan sebesar ${formatIDR(numAmount)} berhasil dikirim! Saldo akan dipotong setelah diverifikasi & disetujui admin.`);
		} else toast.error("Gagal memproses pengajuan pencairan saldo. Silakan coba lagi.");
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 sm:grid-cols-2 xl:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-border gradient-brand p-5 text-brand-foreground shadow-glow",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs uppercase tracking-wide opacity-90",
								children: "Saldo Tersedia"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 font-display text-2xl font-bold",
								children: formatIDR(state.balance)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xs opacity-90",
								children: "Bisa dicairkan sekarang"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								size: "sm",
								variant: "secondary",
								className: "mt-3",
								onClick: handleOpenWithdraw,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wallet, { className: "mr-1 h-4 w-4" }), " Cairkan Saldo"]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Pendapatan Bulan Ini",
						value: formatIDR(monthTotal),
						hint: "Pembayaran berhasil bulan berjalan",
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DollarSign, { className: "h-5 w-5" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Pendapatan Minggu Ini",
						value: formatIDR(weekTotal),
						hint: "7 hari terakhir",
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DollarSign, { className: "h-5 w-5" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Saldo Siap Cair",
						value: formatIDR(state.balance),
						hint: "Bisa langsung dicairkan ke rekening Anda",
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-5 w-5" })
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-end gap-3 rounded-2xl border border-border bg-card p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						className: "text-xs",
						children: "Dari"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						type: "date",
						value: from,
						onChange: (e) => setFrom(e.target.value)
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						className: "text-xs",
						children: "Sampai"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						type: "date",
						value: to,
						onChange: (e) => setTo(e.target.value)
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						onClick: () => {
							setFrom("");
							setTo("");
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "mr-1 h-4 w-4" }), " Reset"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "ml-auto flex flex-wrap items-center gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "outline",
								onClick: () => {
									exportToExcel("penghasilan-buzzer", "Penghasilan", earningsF, [
										{
											header: "Tanggal",
											accessor: (e) => e.date
										},
										{
											header: "Job",
											accessor: (e) => e.jobTitle
										},
										{
											header: "Status",
											accessor: (e) => e.status
										},
										{
											header: "Nominal (Rp)",
											accessor: (e) => e.amount
										}
									]);
									toast.success("Riwayat pembayaran diekspor ke Excel");
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileSpreadsheet, { className: "mr-1 h-4 w-4" }), " Excel"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "outline",
								onClick: () => {
									const totalE = earningsF.reduce((a, e) => a + e.amount, 0);
									const totalW = withdrawsF.reduce((a, w) => a + w.amount, 0);
									exportToPDF("penghasilan-buzzer", "Laporan Keuangan Buzzer", earningsF, [
										{
											header: "Tanggal",
											accessor: (e) => e.date
										},
										{
											header: "Job",
											accessor: (e) => e.jobTitle
										},
										{
											header: "Status",
											accessor: (e) => e.status
										},
										{
											header: "Nominal (Rp)",
											accessor: (e) => e.amount
										}
									], [{
										label: "Total Pembayaran",
										value: formatIDR(totalE)
									}, {
										label: "Total Pencairan",
										value: formatIDR(totalW)
									}]);
									toast.success("Laporan keuangan diekspor ke PDF");
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileDown, { className: "mr-1 h-4 w-4" }), " PDF"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								onClick: handleOpenWithdraw,
								className: "gradient-brand text-brand-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wallet, { className: "mr-1 h-4 w-4" }), " Cairkan Saldo"]
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
				defaultValue: "earnings",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
						value: "earnings",
						children: [
							"Riwayat Pembayaran (",
							earningsF.length,
							")"
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
						value: "withdrawals",
						children: [
							"Riwayat Pencairan (",
							withdrawsF.length,
							")"
						]
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "earnings",
						className: "mt-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "overflow-hidden rounded-2xl border border-border bg-card",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Tanggal" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Job" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Status" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
									className: "text-right",
									children: "Nominal"
								})
							] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableBody, { children: [earningsF.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
								colSpan: 4,
								className: "text-center text-muted-foreground py-8",
								children: "Tidak ada data."
							}) }), paginatedEarnings.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
									className: "text-xs",
									children: e.date
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: e.jobTitle }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: e.status }) }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
									className: "text-right font-semibold",
									children: formatIDR(e.amount)
								})
							] }, e.id))] })] }), earningsF.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TablePagination, {
								currentPage: safeEarningsPage,
								totalItems: earningsF.length,
								pageSize: PAGE_SIZE,
								onPageChange: setEarningsPage
							})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "withdrawals",
						className: "mt-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "overflow-hidden rounded-2xl border border-border bg-card",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Tanggal" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Metode & Rekening" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Status" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Keterangan / Bukti" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
									className: "text-right",
									children: "Nominal"
								})
							] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableBody, { children: [withdrawsF.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
								colSpan: 5,
								className: "text-center text-muted-foreground py-8",
								children: "Tidak ada pencairan."
							}) }), paginatedWithdrawals.map((w) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
									className: "text-xs",
									children: w.date
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "font-medium text-xs",
									children: w.method
								}), w.accountNo && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-[11px] text-muted-foreground",
									children: w.accountNo
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: w.status === "Menunggu" ? "Menunggu Verifikasi" : w.status }) }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, { children: [
									w.status === "Menunggu" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-0.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[11px] text-amber-600 dark:text-amber-400 font-medium",
											children: "Menunggu verifikasi admin"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[10px] text-muted-foreground",
											children: "(Saldo belum dipotong)"
										})]
									}),
									w.status === "Berhasil" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex items-center gap-1.5",
										children: w.proofUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											variant: "outline",
											size: "sm",
											className: "h-7 text-xs text-primary gap-1 px-2 border-primary/30 hover:bg-primary/10",
											onClick: () => setViewingProofUrl(w.proofUrl || null),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-3.5 w-3.5" }), " Bukti Transfer"]
										}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[11px] text-emerald-600 dark:text-emerald-400 font-medium",
											children: "Transfer Sukses"
										})
									}),
									w.status === "Ditolak" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-[11px] text-rose-600 dark:text-rose-400 space-y-0.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "font-medium",
											children: ["Ditolak admin ", w.adminNote ? `: "${w.adminNote}"` : ""]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-[10px] text-muted-foreground",
											children: "(Saldo tetap aman)"
										})]
									})
								] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
									className: "text-right font-semibold",
									children: formatIDR(w.amount)
								})
							] }, w.id))] })] }), withdrawsF.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TablePagination, {
								currentPage: safeWithdrawalsPage,
								totalItems: withdrawsF.length,
								pageSize: PAGE_SIZE,
								onPageChange: setWithdrawalsPage
							})]
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: wOpen,
				onOpenChange: setWOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "sm:max-w-md",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wallet, { className: "h-5 w-5 text-primary" }), "Cairkan Saldo Buzzer"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogDescription, { children: [
							"Saldo tersedia: ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", {
								className: "text-foreground",
								children: formatIDR(state.balance)
							}),
							pendingWithdrawalTotal > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "block mt-1 text-xs",
								children: [
									"Sedang dalam verifikasi admin: ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", {
										className: "text-amber-600 dark:text-amber-400",
										children: formatIDR(pendingWithdrawalTotal)
									}),
									" (Sisa yang siap dicairkan: ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", {
										className: "text-emerald-600 dark:text-emerald-400",
										children: formatIDR(availableToWithdraw)
									}),
									")"
								]
							})
						] })] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Nominal Pencairan" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "relative",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-muted-foreground",
												children: "Rp"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												type: "text",
												inputMode: "numeric",
												placeholder: "Contoh: 5.000",
												value: amount ? Number(amount).toLocaleString("id-ID") : "",
												onChange: (e) => {
													const digits = e.target.value.replace(/\D/g, "");
													setAmount(digits);
												},
												className: "pl-10 text-base font-semibold"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex flex-wrap gap-1.5 pt-1",
											children: [[
												5e3,
												1e4,
												2e4,
												5e4
											].filter((val) => val <= availableToWithdraw).map((val) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												type: "button",
												variant: "outline",
												size: "sm",
												className: cn("h-7 px-2.5 text-xs transition-colors", amount === String(val) && "border-primary bg-primary/10 text-primary font-bold shadow-xs"),
												onClick: () => setAmount(String(val)),
												children: formatIDR(val)
											}, val)), availableToWithdraw > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
												type: "button",
												variant: "outline",
												size: "sm",
												className: cn("h-7 px-2.5 text-xs font-semibold transition-colors", amount === String(availableToWithdraw) && "border-primary bg-primary/10 text-primary font-bold shadow-xs"),
												onClick: () => setAmount(String(availableToWithdraw)),
												children: [
													"Tarik Semua (",
													formatIDR(availableToWithdraw),
													")"
												]
											})]
										})
									]
								}),
								Number(amount) > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: cn("rounded-xl border p-3 text-xs space-y-1.5 transition-all", Number(amount) > availableToWithdraw ? "border-rose-500/30 bg-rose-500/10 text-rose-700 dark:text-rose-300" : "border-border bg-muted/40 text-foreground"),
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex justify-between items-center font-medium",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-muted-foreground",
												children: "Nominal yang ditarik:"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-sm font-bold",
												children: formatIDR(Number(amount))
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-[11px] text-muted-foreground italic",
											children: [
												"Terbilang: ",
												terbilangRupiah(Number(amount)),
												" rupiah"
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex justify-between items-center pt-1.5 border-t border-border/50",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-muted-foreground",
												children: "Sisa Saldo Setelah Tarik:"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: cn("font-semibold", Number(amount) > availableToWithdraw ? "text-rose-600 font-bold" : "text-emerald-600 dark:text-emerald-400 font-bold"),
												children: Number(amount) > availableToWithdraw ? "Saldo tidak mencukupi" : formatIDR(Math.max(0, state.balance - Number(amount)))
											})]
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid gap-3 sm:grid-cols-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Metode Pencairan" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
										value: methodType,
										onValueChange: (v) => {
											const t = v;
											setMethodType(t);
											setProvider(t === "Bank" ? BANKS[0] : EWALLETS[0]);
										},
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
											className: "mt-1",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "Bank",
											children: "Transfer Bank"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "E-Wallet",
											children: "E-Wallet"
										})] })]
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: methodType === "Bank" ? "Nama Bank" : "Jenis E-Wallet" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
										value: provider,
										onValueChange: setProvider,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
											className: "mt-1",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: (methodType === "Bank" ? BANKS : EWALLETS).map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: p,
											children: p
										}, p)) })]
									})] })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: methodType === "Bank" ? "Nomor Rekening" : "Nomor HP / Akun E-Wallet" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									inputMode: "numeric",
									pattern: "[0-9]*",
									placeholder: methodType === "Bank" ? "Contoh: 1234567890" : "Contoh: 081234567890",
									value: accountNo,
									onChange: (e) => setAccountNo(e.target.value.replace(/\D/g, "")),
									className: "mt-1 font-mono"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: methodType === "Bank" ? "Nama Pemilik Rekening (a.n.)" : "Nama Akun E-Wallet (a.n.)" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "text",
										placeholder: "Contoh: Budi Santoso",
										value: accountName,
										onChange: (e) => setAccountName(e.target.value),
										className: "mt-1"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 text-[11px] text-muted-foreground",
										children: "Pastikan nama sesuai dengan yang terdaftar di bank/e-wallet untuk mempercepat proses verifikasi admin."
									})
								] })
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
							className: "gap-2 sm:gap-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								onClick: () => setWOpen(false),
								children: "Batal"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								onClick: submitWithdraw,
								disabled: loading || !amount || Number(amount) <= 0 || Number(amount) > availableToWithdraw || !accountNo || !accountName.trim(),
								className: "gradient-brand text-brand-foreground",
								children: loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }), "Mengajukan..."] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "mr-1 h-4 w-4" }), "Kirim Pengajuan Pencairan"] })
							})]
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: !!viewingProofUrl,
				onOpenChange: (open) => !open && setViewingProofUrl(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "sm:max-w-md",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-5 w-5 text-emerald-500" }), "Bukti Transfer dari Admin"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Tangkapan layar bukti transfer resmi yang diunggah oleh admin." })] }),
						viewingProofUrl && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "overflow-hidden rounded-xl border border-border bg-black/5 dark:bg-black/40 flex items-center justify-center p-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: viewingProofUrl,
								alt: "Bukti Transfer Admin",
								className: "max-h-[60vh] w-auto rounded-lg object-contain"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [viewingProofUrl && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
							href: viewingProofUrl,
							target: "_blank",
							rel: "noreferrer",
							className: "inline-flex items-center justify-center rounded-lg border border-input bg-background px-3 py-2 text-xs font-medium hover:bg-accent hover:text-accent-foreground mr-auto gap-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "h-3.5 w-3.5" }), " Buka Tab Baru"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							onClick: () => setViewingProofUrl(null),
							children: "Tutup"
						})] })
					]
				})
			})
		]
	});
}
function RatingUlasanSection({ store }) {
	const { state } = store;
	const { data: allRatings, loading } = useBuzzerRatings();
	const myRatings = (0, import_react.useMemo)(() => {
		return allRatings.filter((r) => r.buzzer_email.toLowerCase() === state.profile.email.toLowerCase());
	}, [allRatings, state.profile.email]);
	const avg = averageStars(myRatings);
	const [starFilter, setStarFilter] = (0, import_react.useState)("all");
	const [hasCommentOnly, setHasCommentOnly] = (0, import_react.useState)(false);
	const [searchQuery, setSearchQuery] = (0, import_react.useState)("");
	const [sortBy, setSortBy] = (0, import_react.useState)("newest");
	const [ratingPage, setRatingPage] = (0, import_react.useState)(1);
	const RATING_PAGE_SIZE = 8;
	(0, import_react.useEffect)(() => {
		setRatingPage(1);
	}, [
		starFilter,
		hasCommentOnly,
		searchQuery,
		sortBy
	]);
	const starCounts = (0, import_react.useMemo)(() => {
		const counts = {
			5: 0,
			4: 0,
			3: 0,
			2: 0,
			1: 0
		};
		for (const r of myRatings) {
			const s = Math.round(r.stars);
			if (counts[s] !== void 0) counts[s]++;
		}
		return counts;
	}, [myRatings]);
	const satisfactionPercent = (0, import_react.useMemo)(() => {
		if (!myRatings.length) return 100;
		const positive = myRatings.filter((r) => r.stars >= 4).length;
		return Math.round(positive / myRatings.length * 100);
	}, [myRatings]);
	const isFiltered = starFilter !== "all" || hasCommentOnly || searchQuery.trim() !== "" || sortBy !== "newest";
	const resetFilters = () => {
		setStarFilter("all");
		setHasCommentOnly(false);
		setSearchQuery("");
		setSortBy("newest");
		setRatingPage(1);
	};
	const filteredRatings = (0, import_react.useMemo)(() => {
		return myRatings.filter((r) => {
			if (starFilter !== "all" && Math.round(r.stars) !== starFilter) return false;
			if (hasCommentOnly && (!r.comment || !r.comment.trim())) return false;
			if (searchQuery.trim()) {
				const q = searchQuery.toLowerCase().trim();
				const matchTitle = (r.campaign_title || "").toLowerCase().includes(q);
				const matchCustomer = (r.customer_name || r.customer_email || "").toLowerCase().includes(q);
				const matchComment = (r.comment || "").toLowerCase().includes(q);
				if (!matchTitle && !matchCustomer && !matchComment) return false;
			}
			return true;
		}).sort((a, b) => {
			if (sortBy === "newest") return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
			if (sortBy === "oldest") return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
			if (sortBy === "highest") return b.stars - a.stars;
			if (sortBy === "lowest") return a.stars - b.stars;
			return 0;
		});
	}, [
		myRatings,
		starFilter,
		hasCommentOnly,
		searchQuery,
		sortBy
	]);
	const totalRatingPages = Math.max(1, Math.ceil(filteredRatings.length / RATING_PAGE_SIZE));
	const safeRatingPage = Math.min(Math.max(1, ratingPage), totalRatingPages);
	const paginatedRatings = (0, import_react.useMemo)(() => {
		const start = (safeRatingPage - 1) * RATING_PAGE_SIZE;
		return filteredRatings.slice(start, start + RATING_PAGE_SIZE);
	}, [filteredRatings, safeRatingPage]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 sm:grid-cols-2 xl:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-border gradient-brand p-5 text-brand-foreground shadow-glow flex flex-col justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs uppercase tracking-wide opacity-90 font-medium",
								children: "Rata-rata Rating"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-1 flex items-baseline gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-display text-3xl font-bold",
									children: myRatings.length > 0 ? avg.toFixed(1) : "0.0"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-sm opacity-80",
									children: "/ 5.0"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-2 flex items-center gap-1",
								children: [
									1,
									2,
									3,
									4,
									5
								].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: cn("h-4 w-4", s <= Math.round(avg) ? "fill-amber-300 text-amber-300" : "fill-white/20 text-white/20") }, s))
							})
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-3 text-xs opacity-90 border-t border-white/15 pt-2",
							children: [
								"Berdasarkan akumulasi ",
								myRatings.length,
								" ulasan customer"
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Total Ulasan Masuk",
						value: String(myRatings.length),
						hint: "Feedback customer atas performa kamu",
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "h-5 w-5" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Tingkat Kepuasan",
						value: myRatings.length > 0 ? `${satisfactionPercent}%` : "100%",
						hint: "Persentase ulasan positif (⭐ 4 & 5)",
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-5 w-5" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Job Selesai",
						value: String(state.profile.jobsCompleted),
						hint: "Total pengerjaan job berhasil",
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Briefcase, { className: "h-5 w-5" })
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col sm:flex-row sm:items-center justify-between gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-display text-base font-bold sm:text-lg",
						children: "Distribusi Penilaian Bintang"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground mt-0.5",
						children: "Klik baris bintang untuk memfilter daftar ulasan secara cepat"
					})] }), starFilter !== "all" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						size: "sm",
						onClick: () => setStarFilter("all"),
						className: "h-8 text-xs self-start sm:self-auto gap-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-3 w-3" }), " Tampilkan Semua Bintang"]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4 space-y-2.5",
					children: [
						5,
						4,
						3,
						2,
						1
					].map((stars) => {
						const count = starCounts[stars] || 0;
						const pct = myRatings.length > 0 ? Math.round(count / myRatings.length * 100) : 0;
						const isSelected = starFilter === stars;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setStarFilter(isSelected ? "all" : stars),
							className: cn("flex w-full items-center gap-3 rounded-xl p-2.5 transition-all text-left", isSelected ? "bg-primary/10 border border-primary/30 shadow-xs" : "hover:bg-muted/60 border border-transparent"),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex w-20 items-center gap-1.5 shrink-0 font-medium text-xs",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "h-3.5 w-3.5 fill-amber-400 text-amber-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [stars, " Bintang"] })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex-1",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Progress, {
										value: pct,
										className: "h-2.5"
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex w-24 justify-end items-center gap-1.5 shrink-0 text-xs text-muted-foreground",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-semibold text-foreground",
										children: count
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
										"(",
										pct,
										"%)"
									] })]
								})
							]
						}, stars);
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-3 rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col md:flex-row md:items-center justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "text",
							placeholder: "Cari ulasan berdasarkan campaign, customer, atau isi teks ulasan...",
							value: searchQuery,
							onChange: (e) => setSearchQuery(e.target.value),
							className: "pl-9 h-9 text-xs sm:text-sm"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: sortBy,
								onValueChange: (v) => setSortBy(v),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
									className: "h-9 w-40 text-xs",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Urutkan" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "newest",
										children: "Terbaru"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "oldest",
										children: "Terlama"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "highest",
										children: "Rating Tertinggi"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "lowest",
										children: "Rating Terendah"
									})
								] })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								type: "button",
								variant: hasCommentOnly ? "default" : "outline",
								size: "sm",
								onClick: () => setHasCommentOnly(!hasCommentOnly),
								className: cn("h-9 text-xs gap-1.5", hasCommentOnly && "gradient-brand text-brand-foreground"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, { className: "h-3.5 w-3.5" }), " Ada Catatan Teks"]
							}),
							isFiltered && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								type: "button",
								variant: "ghost",
								size: "sm",
								onClick: resetFilters,
								className: "h-9 text-xs text-muted-foreground hover:text-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "mr-1 h-3 w-3" }), " Reset Filter"]
							})
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-1.5 pt-2 border-t border-border/50",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-xs text-muted-foreground mr-1 flex items-center gap-1 font-medium",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Funnel, { className: "h-3 w-3" }), " Filter Bintang:"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							type: "button",
							variant: "outline",
							size: "sm",
							className: cn("h-7 px-2.5 text-xs transition-colors", starFilter === "all" && "border-primary bg-primary/10 text-primary font-bold shadow-xs"),
							onClick: () => setStarFilter("all"),
							children: [
								"Semua (",
								myRatings.length,
								")"
							]
						}),
						[
							5,
							4,
							3,
							2,
							1
						].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							type: "button",
							variant: "outline",
							size: "sm",
							className: cn("h-7 px-2.5 text-xs transition-colors", starFilter === s && "border-primary bg-primary/10 text-primary font-bold shadow-xs"),
							onClick: () => setStarFilter(starFilter === s ? "all" : s),
							children: [
								"⭐ ",
								s,
								" (",
								starCounts[s] || 0,
								")"
							]
						}, s))
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-center justify-between px-1",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
						className: "font-display text-base font-bold",
						children: ["Daftar Ulasan Customer", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "ml-2 text-xs font-normal text-muted-foreground",
							children: [
								"(",
								filteredRatings.length,
								" dari ",
								myRatings.length,
								" ulasan)"
							]
						})]
					})
				}), filteredRatings.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl border border-dashed border-border bg-card p-8 sm:p-12 text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "mx-auto h-10 w-10 text-muted-foreground/30 mb-3" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
							className: "font-display text-base font-semibold text-foreground",
							children: myRatings.length === 0 ? "Belum Ada Ulasan Customer" : "Tidak Ada Ulasan yang Sesuai Filter"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs sm:text-sm text-muted-foreground max-w-md mx-auto",
							children: myRatings.length === 0 ? "Selesaikan campaign yang tersedia sesuai brief. Ulasan dan bintang dari customer akan tampil otomatis di sini setelah customer memberikan penilaian." : "Coba ubah filter bintang, kata kunci pencarian, atau reset filter untuk menampilkan semua ulasan."
						}),
						isFiltered && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							size: "sm",
							onClick: resetFilters,
							className: "mt-4 text-xs gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-3.5 w-3.5" }), " Reset Filter"]
						})
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid gap-3 sm:gap-4",
						children: paginatedRatings.map((r) => {
							const dateStr = new Date(r.created_at).toLocaleDateString("id-ID", {
								day: "numeric",
								month: "long",
								year: "numeric"
							});
							const customerInitial = (r.customer_name || r.customer_email || "C").trim().charAt(0).toUpperCase();
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-xs transition-shadow hover:shadow-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-col sm:flex-row sm:items-start justify-between gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0 flex-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex flex-wrap items-center gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-bold text-amber-600 dark:text-amber-400 border border-amber-500/20",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "h-3.5 w-3.5 fill-amber-400 text-amber-400" }),
													r.stars,
													".0"
												]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
												className: "font-display text-sm sm:text-base font-bold text-foreground truncate",
												children: r.campaign_title || "Pekerjaan Campaign"
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mt-2.5 flex items-center gap-2.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar, {
												className: "h-7 w-7 border border-border",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarFallback, {
													className: "bg-primary/10 text-primary text-xs font-bold",
													children: customerInitial
												})
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "text-xs",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-semibold text-foreground",
													children: r.customer_name || r.customer_email
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "text-muted-foreground ml-2",
													children: ["· ", dateStr]
												})]
											})]
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md self-start",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-3 w-3" }), " Job Terverifikasi"]
									})]
								}), r.comment && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-3 rounded-xl bg-muted/40 p-3 text-xs sm:text-sm text-foreground border border-border/60",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "italic",
										children: [
											"\"",
											r.comment,
											"\""
										]
									})
								})]
							}, r.id);
						})
					}), filteredRatings.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "overflow-hidden rounded-2xl border border-border bg-card",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TablePagination, {
							currentPage: safeRatingPage,
							totalItems: filteredRatings.length,
							pageSize: RATING_PAGE_SIZE,
							onPageChange: setRatingPage
						})
					})]
				})]
			})
		]
	});
}
function ProfilSection({ store, onGoRatings }) {
	const session = useSession();
	const { state } = store;
	const { accounts: socialAccounts } = useSocialAccounts(state.profile.email, state.profile.name);
	const { data: allRatings } = useBuzzerRatings();
	const myRatings = allRatings.filter((r) => r.buzzer_email.toLowerCase() === state.profile.email.toLowerCase());
	const avg = averageStars(myRatings);
	const verifiedFollowers = socialAccounts.filter((account) => account.verification === "Terverifikasi").reduce((sum, account) => sum + account.followers, 0);
	const displayFollowers = verifiedFollowers > 0 ? verifiedFollowers : state.profile.followers || 0;
	const [open, setOpen] = (0, import_react.useState)(false);
	const [form, setForm] = (0, import_react.useState)(state.profile);
	const [loading, setLoading] = (0, import_react.useState)(false);
	const startEdit = () => {
		setForm({
			...state.profile,
			followers: displayFollowers
		});
		setOpen(true);
	};
	const save = async () => {
		if (!form.name.trim() || !form.email.trim()) return toast.error("Nama & email wajib diisi");
		if (!/^\S+@\S+\.\S+$/.test(form.email)) return toast.error("Format email tidak valid");
		setLoading(true);
		const saved = await store.updateProfile({
			...form,
			followers: displayFollowers
		});
		setLoading(false);
		if (!saved) return toast.error("Profil gagal disimpan ke database. Coba lagi.");
		setOpen(false);
		toast.success("Profil berhasil diperbarui");
	};
	const onAvatar = (e) => {
		const file = e.target.files?.[0];
		if (!file) return;
		if (file.size > 2097152) return toast.error("Ukuran foto maks 2MB");
		const reader = new FileReader();
		reader.onload = () => setForm((f) => ({
			...f,
			avatarUrl: reader.result
		}));
		reader.readAsDataURL(file);
	};
	const currentAvatar = state.profile.avatarUrl || session?.avatarUrl;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-border bg-card p-6 text-center shadow-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Avatar, {
						className: "mx-auto h-24 w-24 border-2 border-background shadow-md",
						children: [currentAvatar && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarImage, {
							src: currentAvatar,
							alt: state.profile.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarFallback, {
							className: "gradient-brand text-2xl font-bold text-brand-foreground",
							children: state.profile.name.split(" ").map((n) => n[0]).join("").slice(0, 2)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "mt-3 font-display text-xl font-bold",
						children: state.profile.name
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: state.profile.username
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-4 flex items-center justify-center gap-1 text-sm",
						children: myRatings.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "h-4 w-4 fill-amber-400 text-amber-400" }),
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: avg.toFixed(1) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-muted-foreground",
								children: [
									"· ",
									myRatings.length,
									" ulasan · ",
									state.profile.jobsCompleted,
									" job"
								]
							})
						] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-muted-foreground",
							children: [
								"⭐ 0.0 (Belum ada ulasan) · ",
								state.profile.jobsCompleted,
								" job"
							]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						className: "mt-5 w-full gradient-brand text-brand-foreground",
						onClick: startEdit,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PenLine, { className: "mr-2 h-4 w-4" }), " Edit Profil"]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-4 rounded-2xl border border-border bg-card p-6 shadow-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProfileRow, {
						label: "Email",
						value: state.profile.email
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProfileRow, {
						label: "Nomor HP",
						value: state.profile.phone
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProfileRow, {
						label: "Platform Utama",
						value: state.profile.platform
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProfileRow, {
						label: "Followers",
						value: displayFollowers.toLocaleString("id-ID")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProfileRow, {
						label: "Bio",
						value: state.profile.bio || "-"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "rounded-xl border border-border/80 bg-muted/30 p-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col sm:flex-row sm:items-center justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-semibold uppercase tracking-wide text-muted-foreground",
								children: "Rating & Ulasan Customer"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-1 flex items-center gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "h-4 w-4 fill-amber-400 text-amber-400" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-display text-base font-bold",
										children: myRatings.length > 0 ? `${avg.toFixed(1)} / 5.0` : "0.0 / 5.0"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-xs text-muted-foreground",
										children: [
											"(",
											myRatings.length,
											" ulasan customer)"
										]
									})
								]
							})] }), onGoRatings && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								size: "sm",
								variant: "outline",
								className: "gap-1.5 text-xs self-start sm:self-auto",
								onClick: onGoRatings,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "h-3.5 w-3.5 text-amber-500 fill-amber-500" }), " Buka Fitur Rating & Ulasan"]
							})]
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open,
				onOpenChange: setOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "max-h-[90vh] overflow-y-auto",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Edit Profil" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Perubahan disimpan ke akun kamu." })] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Avatar, {
										className: "h-16 w-16 border border-border",
										children: [(form.avatarUrl || currentAvatar) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarImage, { src: form.avatarUrl || currentAvatar }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarFallback, {
											className: "gradient-brand text-brand-foreground",
											children: form.name.split(" ").map((n) => n[0]).join("").slice(0, 2)
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "inline-flex cursor-pointer items-center gap-2 rounded-md border border-input px-3 py-2 text-sm hover:bg-accent",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Camera, { className: "h-4 w-4" }),
											" Ganti foto",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "file",
												accept: "image/*",
												className: "hidden",
												onChange: onAvatar
											})
										]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid gap-3 sm:grid-cols-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Nama" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											value: form.name,
											onChange: (e) => setForm({
												...form,
												name: e.target.value
											})
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Username" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											value: form.username,
											onChange: (e) => setForm({
												...form,
												username: e.target.value
											})
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Email" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											type: "email",
											value: form.email,
											readOnly: true
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Nomor HP" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											inputMode: "numeric",
											pattern: "[0-9]*",
											value: form.phone,
											onChange: (e) => setForm({
												...form,
												phone: e.target.value.replace(/\D/g, "")
											})
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Platform Utama" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
											value: form.platform,
											onValueChange: (v) => setForm({
												...form,
												platform: v
											}),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: [
												"Instagram",
												"TikTok",
												"X (Twitter)",
												"YouTube",
												"Facebook"
											].map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: p,
												children: p
											}, p)) })]
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Followers" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												type: "number",
												min: 0,
												value: form.followers,
												readOnly: true,
												disabled: true,
												className: "bg-muted cursor-not-allowed text-muted-foreground"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "mt-1 text-[11px] text-muted-foreground",
												children: "Followers disinkronkan otomatis dari akun media sosial yang disetujui Admin."
											})
										] })
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Bio" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
									rows: 3,
									value: form.bio,
									onChange: (e) => setForm({
										...form,
										bio: e.target.value
									})
								})] })
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							onClick: () => setOpen(false),
							children: "Batal"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							onClick: save,
							disabled: loading,
							className: "gradient-brand text-brand-foreground",
							children: loading ? "Menyimpan..." : "Simpan"
						})] })
					]
				})
			})
		]
	});
}
function ProfileRow({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid grid-cols-[140px_minmax(0,1fr)] items-start gap-3 border-b border-border pb-3 last:border-none last:pb-0",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-xs font-medium uppercase tracking-wide text-muted-foreground",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm",
			children: value
		})]
	});
}
function EmptyState({ icon, title, desc, action }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid place-items-center rounded-2xl border border-dashed border-border bg-card/50 p-10 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-3 grid h-14 w-14 place-items-center rounded-full bg-muted text-muted-foreground",
				children: icon
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-semibold",
				children: title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 max-w-sm text-sm text-muted-foreground",
				children: desc
			}),
			action && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4",
				children: action
			})
		]
	});
}
//#endregion
export { BuzzerPage as component };
