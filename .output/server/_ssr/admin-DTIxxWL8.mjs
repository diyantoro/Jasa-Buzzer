import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { L as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { n as supabase } from "./client-DwoA1QoZ.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { t as Button } from "./button-BkEeRci-.mjs";
import { n as Label, t as Input } from "./label-B7oQAA24.mjs";
import { $ as LayoutDashboard, At as ChevronRight, B as Music2, C as Send, Ct as Clock, Dt as CircleCheck, Et as CircleX, F as PenLine, G as Megaphone, H as Minus, Ht as AtSign, J as LogOut, Kt as ArrowDownRight, Lt as CalendarDays, M as Plus, Nt as Check, O as RefreshCw, Ot as CircleAlert, P as Pencil, Q as Link2, R as Palette, Rt as Building2, S as Settings, T as Save, Tt as Circle, Ut as ArrowUpRight, W as Menu, X as LoaderCircle, Z as Linkedin, _ as Smartphone, _t as Earth, b as ShieldCheck, bt as CreditCard, c as Twitter, d as Trash2, dt as FileDown, et as Layers, ft as Facebook, gt as EllipsisVertical, h as Star, ht as ExternalLink, i as Users, it as Image, j as Power, jt as ChevronLeft, k as QrCode, mt as EyeOff, n as X, nt as Instagram, o as UserPlus, p as Tag, pt as Eye, q as Mail, qt as Activity, r as Wallet, rt as Inbox, s as Upload, st as Funnel, t as Youtube, tt as KeyRound, u as TrendingUp, ut as FileSpreadsheet, w as Search, xt as Copy, y as Shield, yt as DollarSign, zt as Briefcase } from "../_libs/lucide-react.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, s as Textarea, t as Dialog } from "./dialog-BQPGZ99x.mjs";
import { a as Label2, c as Root2, d as SubTrigger2, f as Trigger, i as ItemIndicator2, l as Separator2, n as Content2, o as Portal2, r as Item2, s as RadioItem2, t as CheckboxItem2, u as SubContent2 } from "../_libs/@radix-ui/react-dropdown-menu+[...].mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-Dg1urBTx.mjs";
import { l as useBuzzerLevels, r as getBuzzerPercentageForLevel, s as useAssignedLevels } from "./buzzer-level-B8egucK7.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { i as formatIDR$1, m as notifyPayoutUpdate, r as campaigns } from "./router-BuTnQWI2.mjs";
import { a as Table, c as TableHead, f as deleteAdminBuzzerRating, g as useBuzzerRatings, l as TableHeader, m as updateAdminBuzzerRating, n as AvatarFallback, o as TableBody, r as AvatarImage, s as TableCell, t as Avatar, u as TableRow } from "./table-C9Hv1VxK.mjs";
import { A as rejectCampaign, C as createServicePricing, D as deleteServicePricing, E as deleteServiceCatalog, F as updateCampaignDetails, G as useServiceCatalogs, H as useCampaignJobs, I as updateCampaignJob, K as useServicePricings, L as updateServiceCatalog, M as reviewCampaignJob, O as exportToExcel, R as updateServiceCatalogStatus, S as createServiceCatalog, T as deleteCampaignJob, U as useCampaigns, V as useCampaignJobSubmissions, W as useCompletedCampaignJobs, _ as StatusBadge, a as AlertDialogDescription, b as calculateCampaignJobSplit, c as AlertDialogTitle, d as Sheet, f as SheetContent, g as StatCard, h as SidebarNav, i as AlertDialogContent, j as rejectCampaignJob, k as exportToPDF, l as MobileBottomNav, m as SidebarCollapseButton, n as AlertDialogAction, o as AlertDialogFooter, p as SheetTrigger, q as useSidebarCollapsed, r as AlertDialogCancel, s as AlertDialogHeader, t as AlertDialog, v as Switch, w as deleteCampaign, y as approveCampaign, z as updateServicePricing } from "./export-utils-Bse6Ov51.mjs";
import { a as setSession, c as useSession, o as updateAccountFn, s as useRequireRole, t as clearSession } from "./auth-CNL2N2Mo.mjs";
import { n as useTheme, t as ThemeToggle } from "./theme-toggle-B6xwIFaA.mjs";
import { a as adminRejectSocialAccount, b as useAllSocialAccounts, c as adminUpdateAccount, f as deleteApplication, g as rejectApplication, h as getSocialProfileUrl, i as adminRejectDeactivationRequest, l as approveApplication, n as adminApproveDeactivationRequest, o as adminRemoveAccount, r as adminApproveSocialAccount, s as adminToggleActive, t as SOCIAL_PLATFORMS, x as useBuzzerApplications, y as updateApplication } from "./buzzer-verification-COVCzkVL.mjs";
import { a as TablePagination$1, c as TabsList, d as deleteWithdrawal, f as editWithdrawal, g as updateWithdrawalStatus$1, l as TabsTrigger, m as listAllWithdrawals, n as LevelBadge, o as Tabs, r as ProofLink, s as TabsContent, t as AccountFormDialog, u as VerifBadge } from "./tabs-Bqo-fbNA.mjs";
import { a as SectionErrorBoundary, c as notifyCustomerPaymentRejected, d as useQrisSettings, l as useAdminBankAccounts, n as CAMPAIGN_TYPES, r as POPULAR_BANKS, s as notifyCustomerPaymentApproved, t as BuzzerNameLink } from "./section-error-boundary-j1MGs4m-.mjs";
import { a as XAxis, c as Bar, d as ResponsiveContainer, f as Tooltip, i as YAxis, l as Pie, n as PieChart, o as Area, r as BarChart, s as CartesianGrid, t as AreaChart, u as Cell } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-DTIxxWL8.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var DropdownMenu = Root2;
var DropdownMenuTrigger = Trigger;
var DropdownMenuSubTrigger = import_react.forwardRef(({ className, inset, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SubTrigger2, {
	ref,
	className: cn("flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent data-[state=open]:bg-accent [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0", inset && "pl-8", className),
	...props,
	children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "ml-auto" })]
}));
DropdownMenuSubTrigger.displayName = SubTrigger2.displayName;
var DropdownMenuSubContent = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SubContent2, {
	ref,
	className: cn("z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-dropdown-menu-content-transform-origin)", className),
	...props
}));
DropdownMenuSubContent.displayName = SubContent2.displayName;
var DropdownMenuContent = import_react.forwardRef(({ className, sideOffset = 4, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Portal2, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content2, {
	ref,
	sideOffset,
	className: cn("z-50 max-h-[var(--radix-dropdown-menu-content-available-height)] min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md", "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-dropdown-menu-content-transform-origin)", className),
	...props
}) }));
DropdownMenuContent.displayName = Content2.displayName;
var DropdownMenuItem = import_react.forwardRef(({ className, inset, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item2, {
	ref,
	className: cn("relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&>svg]:size-4 [&>svg]:shrink-0", inset && "pl-8", className),
	...props
}));
DropdownMenuItem.displayName = Item2.displayName;
var DropdownMenuCheckboxItem = import_react.forwardRef(({ className, children, checked, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CheckboxItem2, {
	ref,
	className: cn("relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50", className),
	checked,
	...props,
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ItemIndicator2, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4" }) })
	}), children]
}));
DropdownMenuCheckboxItem.displayName = CheckboxItem2.displayName;
var DropdownMenuRadioItem = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(RadioItem2, {
	ref,
	className: cn("relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50", className),
	...props,
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ItemIndicator2, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Circle, { className: "h-2 w-2 fill-current" }) })
	}), children]
}));
DropdownMenuRadioItem.displayName = RadioItem2.displayName;
var DropdownMenuLabel = import_react.forwardRef(({ className, inset, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label2, {
	ref,
	className: cn("px-2 py-1.5 text-sm font-semibold", inset && "pl-8", className),
	...props
}));
DropdownMenuLabel.displayName = Label2.displayName;
var DropdownMenuSeparator = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Separator2, {
	ref,
	className: cn("-mx-1 my-1 h-px bg-muted", className),
	...props
}));
DropdownMenuSeparator.displayName = Separator2.displayName;
var DropdownMenuShortcut = ({ className, ...props }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("ml-auto text-xs tracking-widest opacity-60", className),
		...props
	});
};
DropdownMenuShortcut.displayName = "DropdownMenuShortcut";
var SOCIAL_PLATFORM_ICON = {
	Instagram: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Instagram, { className: "h-4 w-4" }),
	TikTok: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Music2, { className: "h-4 w-4" }),
	Facebook: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Facebook, { className: "h-4 w-4" }),
	"X (Twitter)": /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Twitter, { className: "h-4 w-4" }),
	YouTube: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Youtube, { className: "h-4 w-4" }),
	LinkedIn: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Linkedin, { className: "h-4 w-4" }),
	Threads: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AtSign, { className: "h-4 w-4" }),
	Telegram: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "h-4 w-4" })
};
function AdminSocialSection() {
	const all = useAllSocialAccounts();
	const [q, setQ] = (0, import_react.useState)("");
	const [status, setStatus] = (0, import_react.useState)("Semua");
	const [platform, setPlatform] = (0, import_react.useState)("Semua");
	const [detail, setDetail] = (0, import_react.useState)(null);
	const [editing, setEditing] = (0, import_react.useState)(null);
	const [rejecting, setRejecting] = (0, import_react.useState)(null);
	const [rejectReason, setRejectReason] = (0, import_react.useState)("");
	const [approvingAccount, setApprovingAccount] = (0, import_react.useState)(null);
	const [rejectingDeactivation, setRejectingDeactivation] = (0, import_react.useState)(null);
	const [deactivateRejectReason, setDeactivateRejectReason] = (0, import_react.useState)("");
	const [approvingDeactivation, setApprovingDeactivation] = (0, import_react.useState)(null);
	const [confirmAction, setConfirmAction] = (0, import_react.useState)(null);
	const [confirmBusy, setConfirmBusy] = (0, import_react.useState)(false);
	const runConfirmAction = async () => {
		if (!confirmAction) return;
		const { type, account } = confirmAction;
		setConfirmBusy(true);
		try {
			if (type === "toggle") {
				await adminToggleActive(account.buzzerEmail, account.id);
				toast.success(account.isActive !== false ? `Akun ${account.username} dinonaktifkan` : `Akun ${account.username} diaktifkan`);
			} else {
				await adminRemoveAccount(account.buzzerEmail, account.id);
				toast.success(`Akun ${account.username} dihapus`);
			}
			setConfirmAction(null);
		} catch (err) {
			console.error(err);
			toast.error(type === "toggle" ? "Gagal mengubah status akun" : "Gagal menghapus akun");
		} finally {
			setConfirmBusy(false);
		}
	};
	const verifiedFollowersByBuzzer = (0, import_react.useMemo)(() => {
		const followersByEmail = /* @__PURE__ */ new Map();
		for (const account of all) {
			if (account.verification !== "Terverifikasi") continue;
			const email = account.buzzerEmail.trim().toLowerCase();
			followersByEmail.set(email, (followersByEmail.get(email) ?? 0) + account.followers);
		}
		return followersByEmail;
	}, [all]);
	const levelFollowers = (email) => verifiedFollowersByBuzzer.get(email.trim().toLowerCase()) ?? 0;
	const isInactiveAccount = (a) => {
		if (a.rejectionNote?.startsWith("[Permintaan Nonaktif/Hapus]:")) return true;
		if (a.isActive === false && a.verification !== "Menunggu" && a.pendingVerification !== "Menunggu") return true;
		return false;
	};
	const isWaitingAction = (a) => {
		if (a.rejectionNote?.startsWith("[Permintaan Nonaktif/Hapus]:")) return false;
		return a.verification === "Menunggu" || a.pendingVerification === "Menunggu";
	};
	const isCleanVerified = (a) => a.verification === "Terverifikasi" && a.pendingVerification !== "Menunggu" && !isInactiveAccount(a);
	const isRejectedAccount = (a) => (a.verification === "Ditolak" || a.pendingVerification === "Ditolak") && !isInactiveAccount(a);
	const waiting = all.filter(isWaitingAction).length;
	const verified = all.filter(isCleanVerified).length;
	const rejected = all.filter(isRejectedAccount).length;
	const inactive = all.filter(isInactiveAccount).length;
	const total = all.filter((a) => !isInactiveAccount(a)).length;
	const filtered = (0, import_react.useMemo)(() => {
		return all.filter((a) => {
			if (status !== "Nonaktif" && isInactiveAccount(a)) return false;
			if (status === "Menunggu") {
				if (!isWaitingAction(a)) return false;
			} else if (status === "Terverifikasi") {
				if (!isCleanVerified(a)) return false;
			} else if (status === "Ditolak") {
				if (!isRejectedAccount(a)) return false;
			} else if (status === "Nonaktif") {
				if (!isInactiveAccount(a)) return false;
			}
			if (platform !== "Semua" && a.platform !== platform) return false;
			if (q.trim()) {
				const s = q.trim().toLowerCase();
				if (!a.username.toLowerCase().includes(s) && !a.accountName.toLowerCase().includes(s) && !a.buzzerName.toLowerCase().includes(s) && !a.buzzerEmail.toLowerCase().includes(s)) return false;
			}
			return true;
		}).sort((a, b) => {
			const aPending = isWaitingAction(a) || (a.rejectionNote?.startsWith("[Permintaan Nonaktif/Hapus]:") ?? false);
			const bPending = isWaitingAction(b) || (b.rejectionNote?.startsWith("[Permintaan Nonaktif/Hapus]:") ?? false);
			if (aPending && !bPending) return -1;
			if (!aPending && bPending) return 1;
			return (b.createdAt || "").localeCompare(a.createdAt || "");
		});
	}, [
		all,
		q,
		status,
		platform
	]);
	const [page, setPage] = (0, import_react.useState)(1);
	const PAGE_SIZE = 8;
	(0, import_react.useEffect)(() => {
		setPage(1);
	}, [
		q,
		status,
		platform
	]);
	const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
	const safePage = Math.min(Math.max(1, page), totalPages);
	const paginatedFiltered = (0, import_react.useMemo)(() => {
		const start = (safePage - 1) * PAGE_SIZE;
		return filtered.slice(start, start + PAGE_SIZE);
	}, [filtered, safePage]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setStatus("Semua"),
						className: "text-left transition-transform hover:-translate-y-0.5 focus:outline-none",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
							label: "Total Akun",
							value: total.toString(),
							hint: "Semua akun buzzer aktif",
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link2, { className: "h-5 w-5" })
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setStatus("Menunggu"),
						className: "text-left transition-transform hover:-translate-y-0.5 focus:outline-none",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
							label: "Belum Diverifikasi",
							value: waiting.toString(),
							hint: waiting > 0 ? "Perlu ditinjau admin" : "Tidak ada antrean",
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-5 w-5 text-amber-500" })
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setStatus("Terverifikasi"),
						className: "text-left transition-transform hover:-translate-y-0.5 focus:outline-none",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
							label: "Sudah Terverifikasi",
							value: verified.toString(),
							hint: "Aktif & siap campaign",
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-5 w-5 text-emerald-500" })
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setStatus("Ditolak"),
						className: "text-left transition-transform hover:-translate-y-0.5 focus:outline-none",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
							label: "Ditolak",
							value: rejected.toString(),
							hint: "Total penolakan",
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, { className: "h-5 w-5 text-rose-500" })
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-border bg-card p-4 space-y-4 shadow-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Funnel, { className: "mr-1 h-4 w-4 text-muted-foreground" }), [
							{
								id: "Semua",
								label: "Semua Akun",
								count: total
							},
							{
								id: "Menunggu",
								label: "Belum Diverifikasi",
								count: waiting,
								highlight: waiting > 0
							},
							{
								id: "Terverifikasi",
								label: "Sudah Terverifikasi",
								count: verified
							},
							{
								id: "Ditolak",
								label: "Ditolak",
								count: rejected
							},
							{
								id: "Nonaktif",
								label: "Dinonaktifkan",
								count: inactive
							}
						].map((tab) => {
							const isActive = status === tab.id;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => setStatus(tab.id),
								className: cn("inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all", isActive ? "border-transparent gradient-brand text-brand-foreground shadow-sm font-semibold" : tab.highlight ? "border-amber-500/50 bg-amber-500/10 text-amber-700 hover:bg-amber-500/20 dark:text-amber-300 font-semibold" : "border-border text-muted-foreground hover:bg-muted hover:text-foreground"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: tab.label }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: cn("rounded-full px-1.5 py-0.5 text-[10px] font-bold leading-none", isActive ? "bg-black/25 text-white" : tab.highlight ? "bg-amber-500 text-white" : "bg-muted text-muted-foreground"),
									children: tab.count
								})]
							}, tab.id);
						})]
					}), status !== "Semua" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						variant: "ghost",
						className: "h-7 text-xs text-muted-foreground hover:text-foreground",
						onClick: () => setStatus("Semua"),
						children: "Reset Filter"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: q,
							onChange: (e) => setQ(e.target.value),
							placeholder: "Cari username, nama akun, nama buzzer, atau email...",
							className: "pl-9"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: platform,
						onValueChange: (v) => setPlatform(v),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
							className: "w-full sm:w-[190px]",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: "Semua",
							children: "Semua Platform"
						}), SOCIAL_PLATFORMS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: p,
							children: p
						}, p))] })]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-border bg-card shadow-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "overflow-x-auto",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Akun" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Buzzer" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Platform" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
							className: "text-right",
							children: "Followers"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Level" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Status" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
							className: "text-right",
							children: "Aksi"
						})
					] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, {
						colSpan: 7,
						className: "py-12 text-center text-sm text-muted-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-medium text-foreground",
							children: status === "Menunggu" ? "Tidak ada akun yang belum diverifikasi." : status === "Terverifikasi" ? "Belum ada akun yang sudah terverifikasi." : "Tidak ada akun yang sesuai dengan filter."
						}), status !== "Semua" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: "link",
							className: "mt-2 text-xs",
							onClick: () => {
								setStatus("Semua");
								setPlatform("Semua");
								setQ("");
							},
							children: "Tampilkan semua akun"
						})]
					}) }) : paginatedFiltered.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, {
						className: cn("transition-colors", a.rejectionNote?.startsWith("[Permintaan Nonaktif/Hapus]:") ? "bg-rose-500/[0.06] hover:bg-rose-500/[0.12]" : a.verification === "Menunggu" || a.pendingVerification === "Menunggu" ? "bg-amber-500/[0.08] hover:bg-amber-500/[0.14]" : "hover:bg-muted/40"),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Avatar, {
									className: "h-8 w-8",
									children: [a.photoUrl && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarImage, { src: a.photoUrl }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarFallback, {
										className: "gradient-brand text-[10px] text-brand-foreground",
										children: a.accountName.split(" ").map((n) => n[0]).join("").slice(0, 2)
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-1.5",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "truncate text-sm font-medium",
													children: a.accountName
												}),
												a.verification === "Menunggu" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "shrink-0 rounded bg-amber-500/20 px-1.5 py-0.5 text-[10px] font-semibold text-amber-700 dark:text-amber-300",
													children: "Baru"
												}),
												a.pendingVerification === "Menunggu" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "shrink-0 rounded bg-amber-500/20 px-1.5 py-0.5 text-[10px] font-semibold text-amber-700 dark:text-amber-300",
													children: "Pembaruan"
												})
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "truncate text-xs text-muted-foreground",
											children: a.username
										}),
										getSocialProfileUrl(a) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
											href: getSocialProfileUrl(a),
											target: "_blank",
											rel: "noreferrer",
											className: "mt-0.5 inline-flex max-w-[200px] items-center gap-1 truncate text-[11px] text-primary hover:underline",
											title: getSocialProfileUrl(a),
											onClick: (e) => e.stopPropagation(),
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link2, { className: "h-3 w-3 shrink-0" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "truncate",
													children: a.profileUrl
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "h-2.5 w-2.5 shrink-0" })
											]
										}),
										a.pendingProofUrl && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
											href: a.pendingProofUrl,
											target: "_blank",
											rel: "noreferrer",
											className: "mt-0.5 inline-flex items-center gap-1 text-[11px] text-amber-600 dark:text-amber-400 underline font-medium",
											onClick: (e) => e.stopPropagation(),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Bukti Followers" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "h-2.5 w-2.5" })]
										})
									]
								})]
							}) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-medium",
								children: a.buzzerName
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground",
								children: a.buzzerEmail
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "inline-flex items-center gap-1 text-sm",
								children: [
									SOCIAL_PLATFORM_ICON[a.platform],
									" ",
									a.platform
								]
							}) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
								className: "text-right font-semibold",
								children: a.pendingFollowers != null ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs text-muted-foreground line-through mr-1.5",
										children: a.followers.toLocaleString("id-ID")
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-bold text-amber-600 dark:text-amber-400",
										children: a.pendingFollowers.toLocaleString("id-ID")
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "block text-[10px] text-amber-600 dark:text-amber-400 font-semibold",
										children: "Diajukan"
									})
								] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "mr-1 inline h-3 w-3 text-muted-foreground" }), a.followers.toLocaleString("id-ID")] })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LevelBadge, { followers: levelFollowers(a.buzzerEmail) }) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex flex-col gap-1 items-start",
								children: a.rejectionNote?.startsWith("[Permintaan Nonaktif/Hapus]:") ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "inline-flex items-center gap-1 rounded-full bg-rose-100 dark:bg-rose-500/15 px-2.5 py-0.5 text-[10px] font-semibold text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Power, { className: "h-3 w-3" }), "Menunggu Persetujuan Nonaktif"]
								}) : a.pendingVerification === "Menunggu" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "inline-flex items-center gap-1 rounded-full bg-amber-100 dark:bg-amber-500/15 text-amber-700 dark:text-amber-300 px-2.5 py-0.5 text-[10px] font-semibold border border-amber-200 dark:border-amber-800",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-3 w-3" }), "Menunggu Pembaruan"]
								}) : a.verification === "Menunggu" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "inline-flex items-center gap-1 rounded-full bg-amber-100 dark:bg-amber-500/15 text-amber-700 dark:text-amber-300 px-2.5 py-0.5 text-[10px] font-semibold border border-amber-200 dark:border-amber-800",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-3 w-3" }), "Belum Diverifikasi"]
								}) : a.isActive === false ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "inline-flex items-center gap-1 rounded-full bg-zinc-100 dark:bg-zinc-800 px-2.5 py-0.5 text-[10px] font-semibold text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Power, { className: "h-3 w-3" }), "Dinonaktifkan"]
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VerifBadge, { s: a.verification })
							}) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
								className: "whitespace-nowrap",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-end gap-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											size: "sm",
											variant: "outline",
											className: "h-9 w-9 p-0",
											title: "Detail",
											"aria-label": "Detail",
											onClick: () => setDetail(a),
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-4 w-4" })
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenu, {
											modal: false,
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuTrigger, {
												asChild: true,
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
													size: "sm",
													variant: "outline",
													className: "h-9 w-9 p-0",
													"aria-label": "Aksi lainnya",
													id: `social-actions-${a.id}`,
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EllipsisVertical, { className: "h-4 w-4" })
												})
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuContent, {
												align: "end",
												className: "w-48",
												children: [a.verification === "Terverifikasi" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
													onSelect: () => setConfirmAction({
														type: "toggle",
														account: a
													}),
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Power, { className: "mr-2 h-4 w-4" }), a.isActive !== false ? "Nonaktifkan Akun" : "Aktifkan Akun"]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuSeparator, {})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
													className: "text-rose-600 focus:bg-rose-500/10 focus:text-rose-600 dark:text-rose-400",
													onSelect: () => setConfirmAction({
														type: "delete",
														account: a
													}),
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "mr-2 h-4 w-4" }), "Hapus Akun"]
												})]
											})]
										}),
										a.verification === "Menunggu" || a.pendingVerification === "Menunggu" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											size: "sm",
											className: "h-9 w-9 p-0 gradient-brand text-brand-foreground",
											title: "Terima / Setujui",
											"aria-label": "Terima",
											onClick: () => setApprovingAccount(a),
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-4 w-4" })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											size: "sm",
											variant: "destructive",
											className: "h-9 w-9 p-0",
											title: "Tolak",
											"aria-label": "Tolak",
											onClick: () => {
												setRejecting(a);
												setRejectReason("");
											},
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, { className: "h-4 w-4" })
										})] }) : a.rejectionNote?.startsWith("[Permintaan Nonaktif/Hapus]:") ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											size: "sm",
											className: "h-9 w-9 p-0 gradient-brand text-brand-foreground",
											title: "Setujui Nonaktif",
											"aria-label": "Setujui",
											onClick: () => setApprovingDeactivation(a),
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-4 w-4" })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											size: "sm",
											variant: "destructive",
											className: "h-9 w-9 p-0",
											title: "Tolak Nonaktif",
											"aria-label": "Tolak",
											onClick: () => {
												setRejectingDeactivation(a);
												setDeactivateRejectReason("");
											},
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, { className: "h-4 w-4" })
										})] }) : null
									]
								})
							})
						]
					}, a.buzzerEmail + a.id)) })] })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TablePagination$1, {
					currentPage: safePage,
					totalItems: filtered.length,
					pageSize: PAGE_SIZE,
					onPageChange: setPage
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: !!detail,
				onOpenChange: (o) => !o && setDetail(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogContent, {
					className: "sm:max-w-md",
					children: detail && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
							className: "flex items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Avatar, {
								className: "h-10 w-10",
								children: [detail.photoUrl && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarImage, { src: detail.photoUrl }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarFallback, {
									className: "gradient-brand text-brand-foreground",
									children: detail.accountName.split(" ").map((n) => n[0]).join("").slice(0, 2)
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "truncate",
									children: detail.accountName
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "truncate text-xs font-normal text-muted-foreground",
									children: [
										detail.username,
										" · ",
										detail.platform
									]
								})]
							})]
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-3 gap-2 rounded-xl border border-border p-3 text-center text-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-bold",
									children: detail.followers.toLocaleString("id-ID")
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[10px] uppercase text-muted-foreground",
									children: "Followers"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-bold",
									children: detail.following.toLocaleString("id-ID")
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[10px] uppercase text-muted-foreground",
									children: "Following"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-bold",
									children: detail.posts.toLocaleString("id-ID")
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[10px] uppercase text-muted-foreground",
									children: "Post"
								})] })
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2 text-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground",
										children: "Buzzer: "
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: detail.buzzerName }),
									" (",
									detail.buzzerEmail,
									")"
								] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted-foreground",
									children: "Kategori: "
								}), detail.category] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "flex items-start gap-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground shrink-0",
										children: "Link Profil: "
									}), getSocialProfileUrl(detail) ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
										href: getSocialProfileUrl(detail),
										target: "_blank",
										rel: "noreferrer",
										className: "inline-flex items-center gap-1 font-mono text-xs text-primary hover:underline break-all",
										title: getSocialProfileUrl(detail),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: detail.profileUrl }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "h-3 w-3 shrink-0" })]
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs text-muted-foreground italic",
										children: "Belum diisi"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "flex items-center gap-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground",
											children: "Level: "
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LevelBadge, { followers: levelFollowers(detail.buzzerEmail) }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-xs text-muted-foreground",
											children: [
												"dari ",
												levelFollowers(detail.buzzerEmail).toLocaleString("id-ID"),
												" followers terverifikasi"
											]
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground",
										children: "Status: "
									}), detail.rejectionNote?.startsWith("[Permintaan Nonaktif/Hapus]:") ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "inline-flex items-center gap-1 rounded-full bg-rose-100 dark:bg-rose-500/15 px-2.5 py-0.5 text-[10px] font-semibold text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Power, { className: "h-3 w-3" }), "Menunggu Persetujuan Nonaktif"]
									}) : detail.pendingVerification === "Menunggu" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "inline-flex items-center gap-1 rounded-full bg-amber-100 dark:bg-amber-500/15 text-amber-700 dark:text-amber-300 px-2.5 py-0.5 text-[10px] font-semibold border border-amber-200 dark:border-amber-800",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-3 w-3" }), "Menunggu Pembaruan"]
									}) : detail.verification === "Menunggu" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "inline-flex items-center gap-1 rounded-full bg-amber-100 dark:bg-amber-500/15 text-amber-700 dark:text-amber-300 px-2.5 py-0.5 text-[10px] font-semibold border border-amber-200 dark:border-amber-800",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-3 w-3" }), "Belum Diverifikasi"]
									}) : detail.isActive === false ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "inline-flex items-center gap-1 rounded-full bg-zinc-100 dark:bg-zinc-800 px-2.5 py-0.5 text-[10px] font-semibold text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Power, { className: "h-3 w-3" }), "Dinonaktifkan"]
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VerifBadge, { s: detail.verification })]
								}),
								detail.pendingFollowers != null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground",
										children: "Followers lama: "
									}), detail.followers.toLocaleString("id-ID")] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground",
										children: "Followers baru: "
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: detail.pendingFollowers.toLocaleString("id-ID") })] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground",
										children: "Status pengajuan: "
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VerifBadge, { s: detail.pendingVerification ?? "Menunggu" })] }),
									detail.pendingSubmittedAt && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground",
										children: "Tanggal pengajuan: "
									}), new Date(detail.pendingSubmittedAt).toLocaleString("id-ID")] }),
									detail.pendingProofUrl && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
										className: "text-primary underline",
										href: detail.pendingProofUrl,
										target: "_blank",
										rel: "noreferrer",
										children: "Lihat bukti followers terbaru"
									}),
									detail.pendingRejectionNote && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "rounded-md bg-rose-500/10 p-2 text-rose-600",
										children: ["Alasan: ", detail.pendingRejectionNote]
									})
								] }),
								detail.bio && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-muted-foreground italic",
									children: [
										"\"",
										detail.bio,
										"\""
									]
								}),
								detail.rejectionNote && !detail.rejectionNote.startsWith("[Permintaan Nonaktif/Hapus]:") && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "rounded-md bg-rose-500/10 p-2 text-rose-600 dark:text-rose-300",
									children: ["Catatan: ", detail.rejectionNote.replace(/^\[Nonaktif\]:\s*/, "")]
								}),
								detail.rejectionNote?.startsWith("[Permintaan Nonaktif/Hapus]:") && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "rounded-md bg-amber-500/10 p-2 text-amber-700 dark:text-amber-300",
									children: ["Alasan Penonaktifan: ", detail.rejectionNote.replace("[Permintaan Nonaktif/Hapus]: ", "")]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
							className: "gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "outline",
								onClick: () => {
									const profileUrl = getSocialProfileUrl(detail);
									if (!profileUrl) {
										toast.error(detail.profileUrl.trim() ? "URL profil media sosial tidak valid." : "Link profil media sosial belum tersedia.");
										return;
									}
									window.open(profileUrl, "_blank", "noopener,noreferrer");
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "mr-1 h-4 w-4" }), " Buka Profil"]
							}), detail.verification === "Terverifikasi" && !detail.pendingVerification && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								className: "h-9 w-9 p-0",
								title: "Edit",
								"aria-label": "Edit",
								onClick: () => {
									setEditing(detail);
									setDetail(null);
								},
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PenLine, { className: "h-4 w-4" })
							})]
						})
					] })
				})
			}),
			editing && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccountFormDialog, {
				initial: editing,
				existing: all.filter((x) => x.buzzerEmail === editing.buzzerEmail),
				onClose: () => setEditing(null),
				onDelete: () => {
					const target = editing;
					setEditing(null);
					setConfirmAction({
						type: "delete",
						account: target
					});
				},
				onSubmit: (data) => {
					adminUpdateAccount(editing.buzzerEmail, editing.id, data);
					toast.success(`Akun ${data.username} diperbarui`);
					setEditing(null);
					return true;
				}
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: !!rejecting,
				onOpenChange: (open) => !open && setRejecting(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: rejecting?.pendingVerification === "Menunggu" ? "Tolak Pembaruan Akun" : "Tolak Verifikasi Akun" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Alasan ini akan ditampilkan kepada buzzer." })] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: rejecting?.pendingVerification === "Menunggu" ? "Berikan alasan penolakan pembaruan data/followers agar buzzer mengetahuinya." : "Berikan alasan agar buzzer dapat memperbaiki pengajuannya."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						value: rejectReason,
						onChange: (event) => setRejectReason(event.target.value),
						placeholder: "Alasan penolakan..."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						onClick: () => setRejecting(null),
						children: "Batal"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "destructive",
						onClick: async () => {
							if (!rejecting) return;
							const ok = await adminRejectSocialAccount(rejecting.id, rejectReason);
							toast[ok ? "success" : "error"](ok ? "Penolakan berhasil disimpan" : "Gagal menolak verifikasi");
							if (ok) setRejecting(null);
						},
						children: "Tolak"
					})] })
				] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: !!approvingAccount,
				onOpenChange: (open) => !open && setApprovingAccount(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "sm:max-w-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-5 w-5 text-emerald-500" }), approvingAccount?.pendingVerification === "Menunggu" ? "Setujui Pembaruan Akun?" : "Setujui Akun Media Sosial?"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: approvingAccount?.pendingVerification === "Menunggu" ? "Konfirmasi persetujuan perubahan data atau followers akun buzzer." : "Konfirmasi persetujuan verifikasi akun media sosial ini." })] }),
						approvingAccount && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-3 rounded-xl border border-border bg-muted/40 p-3 text-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Avatar, {
										className: "h-10 w-10",
										children: [approvingAccount.photoUrl && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarImage, { src: approvingAccount.photoUrl }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarFallback, {
											className: "gradient-brand text-brand-foreground",
											children: approvingAccount.accountName.split(" ").map((n) => n[0]).join("").slice(0, 2)
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0 flex-1",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "truncate font-semibold",
												children: approvingAccount.accountName
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "truncate text-xs text-muted-foreground",
												children: [
													approvingAccount.username,
													" · ",
													approvingAccount.platform
												]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "truncate text-xs text-muted-foreground",
												children: approvingAccount.buzzerEmail
											})
										]
									})]
								}),
								approvingAccount.pendingFollowers != null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-lg border border-amber-500/30 bg-amber-500/10 p-2.5 text-xs space-y-1",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "font-semibold text-amber-700 dark:text-amber-300",
											children: "Pembaruan Followers Diajukan:"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-between text-foreground",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-muted-foreground",
												children: "Followers Sekarang:"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "line-through",
												children: approvingAccount.followers.toLocaleString("id-ID")
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-between font-bold text-amber-600 dark:text-amber-400",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Followers Baru:" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: approvingAccount.pendingFollowers.toLocaleString("id-ID") })]
										}),
										approvingAccount.pendingProofUrl && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "pt-1 border-t border-amber-500/20",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
												href: approvingAccount.pendingProofUrl,
												target: "_blank",
												rel: "noreferrer",
												className: "inline-flex items-center gap-1 text-primary hover:underline font-medium",
												children: ["Lihat Bukti Followers ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "h-3 w-3" })]
											})
										})
									]
								}),
								getSocialProfileUrl(approvingAccount) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-xs",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground",
										children: "Link Profil: "
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
										href: getSocialProfileUrl(approvingAccount),
										target: "_blank",
										rel: "noreferrer",
										className: "text-primary underline font-mono inline-flex items-center gap-1 max-w-full truncate",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "truncate",
											children: approvingAccount.profileUrl
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "h-3 w-3 shrink-0" })]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-2 text-xs text-emerald-700 dark:text-emerald-300",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "h-4 w-4 shrink-0" }), approvingAccount.pendingVerification === "Menunggu" ? "Followers dan status akun akan disinkronkan sesuai pengajuan." : "Akun ini akan langsung berstatus Terverifikasi dan aktif untuk campaign."]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
							className: "gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								onClick: () => setApprovingAccount(null),
								children: "Batal"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								className: "gradient-brand text-brand-foreground",
								onClick: async () => {
									if (!approvingAccount) return;
									const ok = await adminApproveSocialAccount(approvingAccount.id);
									toast[ok ? "success" : "error"](ok ? "Persetujuan akun berhasil ✓" : "Gagal menyetujui verifikasi");
									if (ok) setApprovingAccount(null);
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "mr-1 h-4 w-4" }), approvingAccount?.pendingVerification === "Menunggu" ? "Ya, Setujui Pembaruan" : "Ya, Setujui Akun"]
							})]
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: !!approvingDeactivation,
				onOpenChange: (open) => !open && setApprovingDeactivation(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "sm:max-w-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Power, { className: "h-5 w-5 text-rose-500" }), "Setujui Penonaktifan?"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Konfirmasi persetujuan penonaktifan akun media sosial ini." })] }),
						approvingDeactivation && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-3 rounded-xl border border-border bg-muted/40 p-3 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Avatar, {
									className: "h-10 w-10",
									children: [approvingDeactivation.photoUrl && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarImage, { src: approvingDeactivation.photoUrl }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarFallback, {
										className: "gradient-brand text-brand-foreground",
										children: approvingDeactivation.accountName.split(" ").map((n) => n[0]).join("").slice(0, 2)
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0 flex-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "truncate font-semibold",
										children: approvingDeactivation.accountName
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "truncate text-xs text-muted-foreground",
										children: [
											approvingDeactivation.username,
											" · ",
											approvingDeactivation.platform
										]
									})]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start gap-2 rounded-lg border border-rose-500/30 bg-rose-500/10 p-2 text-xs text-rose-700 dark:text-rose-300",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "h-4 w-4 shrink-0 mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
									"Akun ini akan langsung ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Dinonaktifkan" }),
									" dan tidak bisa digunakan untuk mengambil job. Data tetap tersimpan sebagai riwayat."
								] })]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
							className: "gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								onClick: () => setApprovingDeactivation(null),
								children: "Batal"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "destructive",
								onClick: async () => {
									if (!approvingDeactivation) return;
									const ok = await adminApproveDeactivationRequest(approvingDeactivation.id);
									toast[ok ? "success" : "error"](ok ? "Permintaan disetujui, akun dinonaktifkan." : "Gagal menyetujui permintaan");
									if (ok) setApprovingDeactivation(null);
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Power, { className: "mr-1 h-4 w-4" }), " Setujui"]
							})]
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: !!rejectingDeactivation,
				onOpenChange: (open) => !open && setRejectingDeactivation(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Tolak Penonaktifan Akun" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Alasan ini akan ditampilkan kepada buzzer." })] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: "Berikan alasan kenapa akun tidak boleh dinonaktifkan."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						value: deactivateRejectReason,
						onChange: (event) => setDeactivateRejectReason(event.target.value),
						placeholder: "Alasan penolakan..."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						onClick: () => setRejectingDeactivation(null),
						children: "Batal"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "destructive",
						onClick: async () => {
							if (!rejectingDeactivation) return;
							if (!deactivateRejectReason.trim()) {
								toast.error("Alasan penolakan wajib diisi.");
								return;
							}
							const ok = await adminRejectDeactivationRequest(rejectingDeactivation.id, deactivateRejectReason);
							toast[ok ? "success" : "error"](ok ? "Permintaan penonaktifan ditolak" : "Gagal menolak permintaan");
							if (ok) setRejectingDeactivation(null);
						},
						children: "Tolak Permintaan"
					})] })
				] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: !!confirmAction,
				onOpenChange: (open) => !open && !confirmBusy && setConfirmAction(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogContent, {
					className: "sm:max-w-md",
					children: confirmAction && (() => {
						const { type, account } = confirmAction;
						const isDelete = type === "delete";
						const willDeactivate = account.isActive !== false;
						const title = isDelete ? "Hapus Akun?" : willDeactivate ? "Nonaktifkan Akun?" : "Aktifkan Akun?";
						const desc = isDelete ? "Akun media sosial ini akan dihapus permanen dan tidak bisa dikembalikan." : willDeactivate ? "Akun ini tidak akan bisa digunakan untuk mengambil job sampai diaktifkan kembali." : "Akun ini akan kembali aktif dan bisa digunakan untuk mengambil job.";
						const danger = isDelete || willDeactivate;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
								className: "flex items-center gap-2",
								children: [isDelete ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-5 w-5 text-rose-500" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Power, { className: cn("h-5 w-5", willDeactivate ? "text-rose-500" : "text-emerald-500") }), title]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: desc })] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-3 rounded-xl border border-border bg-muted/40 p-3 text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Avatar, {
										className: "h-10 w-10",
										children: [account.photoUrl && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarImage, { src: account.photoUrl }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarFallback, {
											className: "gradient-brand text-brand-foreground",
											children: account.accountName.split(" ").map((n) => n[0]).join("").slice(0, 2)
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0 flex-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "truncate font-semibold",
											children: account.accountName
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "truncate text-xs text-muted-foreground",
											children: [
												account.username,
												" · ",
												account.platform,
												" · ",
												account.buzzerEmail
											]
										})]
									})]
								}), danger && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-start gap-2 rounded-lg border border-rose-500/30 bg-rose-500/10 p-2 text-xs text-rose-700 dark:text-rose-300",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "mt-0.5 h-4 w-4 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: isDelete ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
										"Tindakan ini ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "tidak dapat dibatalkan" }),
										"."
									] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
										"Akun akan langsung ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "dinonaktifkan" }),
										". Data tetap tersimpan sebagai riwayat."
									] }) })]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
								className: "gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "outline",
									disabled: confirmBusy,
									onClick: () => setConfirmAction(null),
									children: "Batal"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									id: "confirm-social-action",
									variant: danger ? "destructive" : "default",
									className: danger ? void 0 : "gradient-brand text-brand-foreground",
									disabled: confirmBusy,
									onClick: runConfirmAction,
									children: [confirmBusy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-1 h-4 w-4 animate-spin" }) : isDelete ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "mr-1 h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Power, { className: "mr-1 h-4 w-4" }), isDelete ? "Ya, Hapus Akun" : willDeactivate ? "Ya, Nonaktifkan" : "Ya, Aktifkan"]
								})]
							})
						] });
					})()
				})
			})
		]
	});
}
var THEMES = {
	light: "",
	dark: ".dark"
};
var ChartContext = import_react.createContext(null);
function useChart() {
	const context = import_react.useContext(ChartContext);
	if (!context) throw new Error("useChart must be used within a <ChartContainer />");
	return context;
}
var ChartContainer = import_react.forwardRef(({ id, className, children, config, ...props }, ref) => {
	const uniqueId = import_react.useId();
	const chartId = `chart-${id || uniqueId.replace(/:/g, "")}`;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartContext.Provider, {
		value: { config },
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			"data-chart": chartId,
			ref,
			className: cn("flex aspect-video justify-center text-xs [&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/50 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-border [&_.recharts-dot[stroke='#fff']]:stroke-transparent [&_.recharts-layer]:outline-none [&_.recharts-polar-grid_[stroke='#ccc']]:stroke-border [&_.recharts-radial-bar-background-sector]:fill-muted [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted [&_.recharts-reference-line_[stroke='#ccc']]:stroke-border [&_.recharts-sector[stroke='#fff']]:stroke-transparent [&_.recharts-sector]:outline-none [&_.recharts-surface]:outline-none", className),
			...props,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartStyle, {
				id: chartId,
				config
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, { children })]
		})
	});
});
ChartContainer.displayName = "Chart";
var ChartStyle = ({ id, config }) => {
	const colorConfig = Object.entries(config).filter(([, config]) => config.theme || config.color);
	if (!colorConfig.length) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", { dangerouslySetInnerHTML: { __html: Object.entries(THEMES).map(([theme, prefix]) => `
${prefix} [data-chart=${id}] {
${colorConfig.map(([key, itemConfig]) => {
		const color = itemConfig.theme?.[theme] || itemConfig.color;
		return color ? `  --color-${key}: ${color};` : null;
	}).join("\n")}
}
`).join("\n") } });
};
var ChartTooltip = Tooltip;
var ChartTooltipContent = import_react.forwardRef(({ active, payload, className, indicator = "dot", hideLabel = false, hideIndicator = false, label, labelFormatter, labelClassName, formatter, color, nameKey, labelKey }, ref) => {
	const { config } = useChart();
	const tooltipLabel = import_react.useMemo(() => {
		if (hideLabel || !payload?.length) return null;
		const [item] = payload;
		const key = `${labelKey || item?.dataKey || item?.name || "value"}`;
		const itemConfig = getPayloadConfigFromPayload(config, item, key);
		const value = !labelKey && typeof label === "string" ? config[label]?.label || label : itemConfig?.label;
		if (labelFormatter) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: cn("font-medium", labelClassName),
			children: labelFormatter(value, payload)
		});
		if (!value) return null;
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: cn("font-medium", labelClassName),
			children: value
		});
	}, [
		label,
		labelFormatter,
		payload,
		hideLabel,
		labelClassName,
		config,
		labelKey
	]);
	if (!active || !payload?.length) return null;
	const nestLabel = payload.length === 1 && indicator !== "dot";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		ref,
		className: cn("grid min-w-[8rem] items-start gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl", className),
		children: [!nestLabel ? tooltipLabel : null, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-1.5",
			children: payload.filter((item) => item.type !== "none").map((item, index) => {
				const key = `${nameKey || item.name || item.dataKey || "value"}`;
				const itemConfig = getPayloadConfigFromPayload(config, item, key);
				const indicatorColor = color || item.payload.fill || item.color;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: cn("flex w-full flex-wrap items-stretch gap-2 [&>svg]:h-2.5 [&>svg]:w-2.5 [&>svg]:text-muted-foreground", indicator === "dot" && "items-center"),
					children: formatter && item?.value !== void 0 && item.name ? formatter(item.value, item.name, item, index, item.payload) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [itemConfig?.icon ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(itemConfig.icon, {}) : !hideIndicator && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: cn("shrink-0 rounded-[2px] border-(--color-border) bg-(--color-bg)", {
							"h-2.5 w-2.5": indicator === "dot",
							"w-1": indicator === "line",
							"w-0 border-[1.5px] border-dashed bg-transparent": indicator === "dashed",
							"my-0.5": nestLabel && indicator === "dashed"
						}),
						style: {
							"--color-bg": indicatorColor,
							"--color-border": indicatorColor
						}
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: cn("flex flex-1 justify-between leading-none", nestLabel ? "items-end" : "items-center"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-1.5",
							children: [nestLabel ? tooltipLabel : null, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted-foreground",
								children: itemConfig?.label || item.name
							})]
						}), item.value && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono font-medium tabular-nums text-foreground",
							children: item.value.toLocaleString()
						})]
					})] })
				}, item.dataKey);
			})
		})]
	});
});
ChartTooltipContent.displayName = "ChartTooltip";
var ChartLegendContent = import_react.forwardRef(({ className, hideIcon = false, payload, verticalAlign = "bottom", nameKey }, ref) => {
	const { config } = useChart();
	if (!payload?.length) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		ref,
		className: cn("flex items-center justify-center gap-4", verticalAlign === "top" ? "pb-3" : "pt-3", className),
		children: payload.filter((item) => item.type !== "none").map((item) => {
			const key = `${nameKey || item.dataKey || "value"}`;
			const itemConfig = getPayloadConfigFromPayload(config, item, key);
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cn("flex items-center gap-1.5 [&>svg]:h-3 [&>svg]:w-3 [&>svg]:text-muted-foreground"),
				children: [itemConfig?.icon && !hideIcon ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(itemConfig.icon, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-2 w-2 shrink-0 rounded-[2px]",
					style: { backgroundColor: item.color }
				}), itemConfig?.label]
			}, item.value);
		})
	});
});
ChartLegendContent.displayName = "ChartLegend";
function getPayloadConfigFromPayload(config, payload, key) {
	if (typeof payload !== "object" || payload === null) return;
	const payloadPayload = "payload" in payload && typeof payload.payload === "object" && payload.payload !== null ? payload.payload : void 0;
	let configLabelKey = key;
	if (key in payload && typeof payload[key] === "string") configLabelKey = payload[key];
	else if (payloadPayload && key in payloadPayload && typeof payloadPayload[key] === "string") configLabelKey = payloadPayload[key];
	return configLabelKey in config ? config[configLabelKey] : config[key];
}
var realtimeListSeq = 0;
function useRealtimeList(table, order, rpcName) {
	const instanceId = (0, import_react.useId)().replace(/[^a-zA-Z0-9_-]/g, "");
	const [channelKey] = (0, import_react.useState)(() => `${table}-${instanceId}-${++realtimeListSeq}`);
	const [data, setData] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [, setError] = (0, import_react.useState)(null);
	const fetchAll = (0, import_react.useCallback)(async () => {
		setError(null);
		const client = supabase;
		const { data: rows, error: queryError } = rpcName ? await client.rpc(rpcName) : await client.from(table).select("*").order(order.column, { ascending: order.ascending }).limit(500);
		if (queryError) {
			console.error(`[Supabase] Failed to load ${table}:`, queryError);
			setError(queryError);
			setData([]);
			setLoading(false);
			return;
		}
		setData(rows ?? []);
		setLoading(false);
	}, [
		table,
		order.column,
		order.ascending,
		rpcName
	]);
	(0, import_react.useEffect)(() => {
		fetchAll();
		const ch = supabase.channel(`rt-${channelKey}`).on("postgres_changes", {
			event: "*",
			schema: "public",
			table
		}, () => {
			fetchAll();
		}).subscribe();
		return () => {
			supabase.removeChannel(ch);
		};
	}, [
		table,
		fetchAll,
		channelKey
	]);
	return {
		data,
		loading,
		refetch: fetchAll
	};
}
var usePayments = () => useRealtimeList("payments", {
	column: "created_at",
	ascending: false
}, "list_admin_payments");
var useWithdrawals = () => useRealtimeList("withdrawals", {
	column: "requested_at",
	ascending: false
});
async function updateWithdrawalStatus(id, status, adminNote, proofUrl) {
	const now = (/* @__PURE__ */ new Date()).toISOString();
	const patch = {
		status,
		updated_at: now
	};
	if (adminNote !== void 0) patch.admin_note = adminNote;
	if (proofUrl !== void 0) patch.proof_url = proofUrl;
	if (status === "Berhasil" || status === "Disetujui") {
		patch.approved_at = now;
		patch.completed_at = now;
	}
	const { error } = await supabase.from("withdrawals").update(patch).eq("id", id);
	if (error) console.error("Gagal update status withdrawal di Supabase:", error);
	try {
		const { data: w } = await supabase.from("withdrawals").select("buzzer_email, amount").eq("id", id).maybeSingle();
		const emailNorm = w?.buzzer_email ? w.buzzer_email.trim().toLowerCase() : "";
		const amount = Number(w?.amount || 0);
		if ((status === "Berhasil" || status === "Disetujui") && emailNorm && amount > 0) {
			const { data: wallet } = await supabase.from("buzzer_wallets").select("balance").eq("buzzer_email", emailNorm).maybeSingle();
			if (wallet) {
				const newBalance = Math.max(0, Number(wallet.balance || 0) - amount);
				await supabase.from("buzzer_wallets").update({
					balance: newBalance,
					updated_at: now
				}).eq("buzzer_email", emailNorm);
			}
		}
		if (emailNorm) {
			try {
				updateWithdrawalStatus$1(emailNorm, id, status, adminNote, proofUrl);
			} catch (errLocal) {
				console.warn("Gagal update local withdrawal status:", errLocal);
			}
			notifyPayoutUpdate({
				buzzerEmail: emailNorm,
				amount,
				status,
				withdrawalId: id,
				adminNote
			});
		}
	} catch (err) {
		console.warn("Gagal memproses notifikasi atau refund payout:", err);
	}
}
async function deleteWithdrawalRecord(id, buzzerEmail) {
	const { data: w } = await supabase.from("withdrawals").select("buzzer_email, amount, status").eq("id", id).maybeSingle();
	const emailNorm = (w?.buzzer_email || buzzerEmail || "").trim().toLowerCase();
	const wasApproved = w?.status === "Berhasil" || w?.status === "Disetujui";
	const amount = Number(w?.amount || 0);
	if (wasApproved && emailNorm && amount > 0) {
		const { data: wallet } = await supabase.from("buzzer_wallets").select("balance").eq("buzzer_email", emailNorm).maybeSingle();
		if (wallet) await supabase.from("buzzer_wallets").update({
			balance: Number(wallet.balance || 0) + amount,
			updated_at: (/* @__PURE__ */ new Date()).toISOString()
		}).eq("buzzer_email", emailNorm);
	}
	await supabase.from("withdrawals").delete().eq("id", id);
	if (emailNorm) try {
		deleteWithdrawal(emailNorm, id);
	} catch (e) {
		console.warn("deleteLocalWithdrawal error:", e);
	}
}
async function editWithdrawalRecord(id, patch, buzzerEmail) {
	const { data: current } = await supabase.from("withdrawals").select("buzzer_email, amount, status").eq("id", id).maybeSingle();
	const emailNorm = (current?.buzzer_email || buzzerEmail || "").trim().toLowerCase();
	const prevStatus = current?.status;
	const newStatus = patch.status ?? prevStatus;
	const prevAmount = Number(current?.amount || 0);
	const newAmount = patch.amount !== void 0 ? Number(patch.amount) : prevAmount;
	const now = (/* @__PURE__ */ new Date()).toISOString();
	const updatePayload = { updated_at: now };
	if (patch.status !== void 0) updatePayload.status = patch.status;
	if (patch.amount !== void 0) updatePayload.amount = patch.amount;
	if (patch.method !== void 0) updatePayload.method = patch.method;
	if (patch.account_no !== void 0) updatePayload.account_no = patch.account_no;
	if (patch.admin_note !== void 0) updatePayload.admin_note = patch.admin_note;
	if (patch.status === "Berhasil" || patch.status === "Disetujui") {
		updatePayload.approved_at = now;
		updatePayload.completed_at = now;
	}
	await supabase.from("withdrawals").update(updatePayload).eq("id", id);
	const wasApproved = prevStatus === "Berhasil" || prevStatus === "Disetujui";
	const isApproved = newStatus === "Berhasil" || newStatus === "Disetujui";
	if (emailNorm) {
		if (!wasApproved && isApproved && newAmount > 0) {
			const { data: wallet } = await supabase.from("buzzer_wallets").select("balance").eq("buzzer_email", emailNorm).maybeSingle();
			if (wallet) await supabase.from("buzzer_wallets").update({
				balance: Math.max(0, Number(wallet.balance || 0) - newAmount),
				updated_at: now
			}).eq("buzzer_email", emailNorm);
		} else if (wasApproved && !isApproved && prevAmount > 0) {
			const { data: wallet } = await supabase.from("buzzer_wallets").select("balance").eq("buzzer_email", emailNorm).maybeSingle();
			if (wallet) await supabase.from("buzzer_wallets").update({
				balance: Number(wallet.balance || 0) + prevAmount,
				updated_at: now
			}).eq("buzzer_email", emailNorm);
		}
		try {
			editWithdrawal(emailNorm, id, {
				status: patch.status,
				amount: patch.amount,
				method: patch.method,
				accountNo: patch.account_no,
				adminNote: patch.admin_note
			});
		} catch (e) {
			console.warn("editLocalWithdrawal error:", e);
		}
	}
}
async function updatePayment(id, updates) {
	const { error } = await supabase.from("payments").update(updates).eq("id", id);
	if (error) throw error;
}
async function deletePayment(id) {
	const { error } = await supabase.from("payments").delete().eq("id", id);
	if (error) throw error;
}
async function approvePayment(id, adminEmail = "admin") {
	const { error } = await supabase.rpc("approve_campaign_payment", {
		p_payment_id: id,
		p_admin_email: adminEmail
	});
	if (error) throw error;
}
async function rejectPayment(id, reason, adminEmail = "admin") {
	const cleanReason = reason.trim();
	if (!cleanReason) throw new Error("Alasan penolakan wajib diisi.");
	const { error } = await supabase.rpc("reject_campaign_payment", {
		p_payment_id: id,
		p_reason: cleanReason,
		p_admin_email: adminEmail
	});
	if (error) throw error;
}
var formatIDR = (n) => new Intl.NumberFormat("id-ID", {
	style: "currency",
	currency: "IDR",
	maximumFractionDigits: 0
}).format(n);
var formatDate = (iso) => new Date(iso).toLocaleString("id-ID", {
	day: "2-digit",
	month: "short",
	year: "numeric",
	hour: "2-digit",
	minute: "2-digit"
});
var num = (value) => value.toLocaleString("id-ID");
var CHART_COLORS = {
	blue: "#60A5FA",
	violet: "#8B5CF6",
	purple: "#A855F7",
	pink: "#D946EF",
	cyan: "#22D3EE"
};
function useMeasuredSize() {
	const ref = (0, import_react.useRef)(null);
	const [size, setSize] = (0, import_react.useState)({
		width: 0,
		height: 0
	});
	(0, import_react.useEffect)(() => {
		const element = ref.current;
		if (!element) return;
		const update = () => {
			const rect = element.getBoundingClientRect();
			setSize((prev) => Math.abs(prev.width - rect.width) < 1 && Math.abs(prev.height - rect.height) < 1 ? prev : {
				width: Math.round(rect.width),
				height: Math.round(rect.height)
			});
		};
		update();
		const observer = new ResizeObserver(update);
		observer.observe(element);
		return () => observer.disconnect();
	}, []);
	return {
		ref,
		size
	};
}
var ACCENTS = {
	blue: {
		chip: "bg-blue-500/12 text-blue-600 dark:bg-blue-400/15 dark:text-blue-300",
		glow: "from-blue-500/60",
		dot: "bg-blue-500"
	},
	violet: {
		chip: "bg-violet-500/12 text-violet-600 dark:bg-violet-400/15 dark:text-violet-300",
		glow: "from-violet-500/60",
		dot: "bg-violet-500"
	},
	cyan: {
		chip: "bg-cyan-500/12 text-cyan-600 dark:bg-cyan-400/15 dark:text-cyan-300",
		glow: "from-cyan-500/60",
		dot: "bg-cyan-500"
	},
	pink: {
		chip: "bg-pink-500/12 text-pink-600 dark:bg-pink-400/15 dark:text-pink-300",
		glow: "from-pink-500/60",
		dot: "bg-pink-500"
	},
	indigo: {
		chip: "bg-indigo-500/12 text-indigo-600 dark:bg-indigo-400/15 dark:text-indigo-300",
		glow: "from-indigo-500/60",
		dot: "bg-indigo-500"
	}
};
function ActivityMetricCard({ label, value, hint, icon, accent, deltaText, deltaDirection }) {
	const accentStyle = ACCENTS[accent];
	const DeltaIcon = deltaDirection === "up" ? ArrowUpRight : deltaDirection === "down" ? ArrowDownRight : Minus;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "group relative overflow-hidden rounded-2xl border border-border bg-card p-4 shadow-sm transition-shadow hover:shadow-md",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				"aria-hidden": "true",
				className: cn("pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r to-transparent opacity-70", accentStyle.glow)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start justify-between gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground",
					children: label
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: cn("grid h-8 w-8 shrink-0 place-items-center rounded-lg", accentStyle.chip),
					children: icon
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2.5 font-display text-2xl font-bold leading-none tracking-tight tabular-nums",
				children: value
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-2 flex flex-wrap items-center gap-x-2 gap-y-1",
				children: [deltaText && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: cn("inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[11px] font-semibold", deltaDirection === "up" && "bg-emerald-500/12 text-emerald-600 dark:text-emerald-400", deltaDirection === "down" && "bg-rose-500/12 text-rose-600 dark:text-rose-400", (!deltaDirection || deltaDirection === "flat") && "bg-muted text-muted-foreground"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DeltaIcon, {
						className: "h-3 w-3",
						"aria-hidden": "true"
					}), deltaText]
				}), hint && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-[11px] text-muted-foreground",
					children: hint
				})]
			})
		]
	});
}
function ChartCard({ title, description, action, children, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: cn("@container flex flex-col rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-5", className),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "mb-4 flex flex-wrap items-start justify-between gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-base font-semibold tracking-tight",
					children: title
				}), description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-0.5 text-xs text-muted-foreground",
					children: description
				})]
			}), action]
		}), children]
	});
}
function ChartEmptyState({ message }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-full min-h-[220px] flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border/70 bg-muted/20 px-6 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "grid h-10 w-10 place-items-center rounded-full bg-muted text-muted-foreground",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Inbox, {
					className: "h-5 w-5",
					"aria-hidden": "true"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm font-medium text-foreground",
				children: "Belum ada data"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "max-w-xs text-xs text-muted-foreground",
				children: message
			})
		]
	});
}
function ChartSkeleton({ className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("animate-pulse rounded-xl bg-muted/60", className),
		"aria-hidden": "true"
	});
}
function ChartErrorState({ message, onRetry, compact }) {
	if (compact) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-full min-h-[220px] flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed border-border/70 bg-muted/20 px-6 text-center",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm font-medium text-foreground",
			children: "Grafik tidak dapat ditampilkan"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "max-w-xs text-xs text-muted-foreground",
			children: message
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		role: "alert",
		className: "flex h-full min-h-[220px] flex-col items-center justify-center gap-2 rounded-xl border border-rose-200 bg-rose-50/70 px-6 text-center dark:border-rose-500/30 dark:bg-rose-500/10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm font-semibold text-rose-700 dark:text-rose-300",
				children: "Gagal memuat data aktivitas"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "max-w-sm text-xs text-rose-600/80 dark:text-rose-300/80",
				children: message
			}),
			onRetry && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: onRetry,
				className: "mt-1 rounded-lg border border-rose-300 bg-card px-3 py-1.5 text-xs font-semibold text-rose-700 transition-colors hover:bg-rose-100 dark:border-rose-500/40 dark:text-rose-200 dark:hover:bg-rose-500/20",
				children: "Coba lagi"
			})
		]
	});
}
var TREND_MARGIN = {
	top: 16,
	right: 18,
	left: 0,
	bottom: 0
};
var X_AXIS_HEIGHT = 26;
function TrendTooltip({ active, payload }) {
	const point = payload?.[0]?.payload;
	if (!active || !point) return null;
	const rows = [
		{
			label: "Pembayaran masuk",
			value: point.pembayaran,
			color: CHART_COLORS.blue
		},
		{
			label: "Pekerjaan",
			value: point.pekerjaan,
			color: CHART_COLORS.violet
		},
		{
			label: "Payout buzzer",
			value: point.payout,
			color: CHART_COLORS.purple
		},
		{
			label: "Komisi admin",
			value: point.komisi,
			color: CHART_COLORS.pink
		}
	].filter((row) => row.value > 0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-w-[168px] rounded-xl border border-border bg-popover/95 px-3 py-2.5 shadow-lg backdrop-blur",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[10px] font-semibold uppercase tracking-[0.08em] text-muted-foreground",
				children: point.fullLabel
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-1 flex items-baseline gap-1.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-display text-xl font-bold leading-none tabular-nums",
					children: num(point.total)
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-[11px] text-muted-foreground",
					children: "aktivitas"
				})]
			}),
			rows.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-2 space-y-1 border-t border-border/70 pt-2",
				children: rows.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex items-center justify-between gap-3 text-[11px]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "flex items-center gap-1.5 text-muted-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "h-1.5 w-1.5 rounded-full",
							style: { backgroundColor: row.color },
							"aria-hidden": "true"
						}), row.label]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-semibold tabular-nums text-foreground",
						children: num(row.value)
					})]
				}, row.label))
			})
		]
	});
}
function ActivityTrendChart({ data, loading, height = 330 }) {
	const { ref, size } = useMeasuredSize();
	const uid = `trend-${(0, import_react.useId)().replace(/[^a-zA-Z0-9_-]/g, "")}`;
	const showDots = data.length > 0 && data.length <= 14;
	const plotBottom = Math.max(size.height - X_AXIS_HEIGHT, 1);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		ref,
		className: "relative w-full",
		style: { height },
		children: [loading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartSkeleton, { className: "absolute inset-0 h-full w-full" }), !loading && size.width > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
			width: "100%",
			height: "100%",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AreaChart, {
				data,
				margin: TREND_MARGIN,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("defs", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
							id: `${uid}-area`,
							gradientUnits: "userSpaceOnUse",
							x1: 0,
							y1: TREND_MARGIN.top,
							x2: 0,
							y2: plotBottom,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
									offset: "0%",
									stopColor: "#8B5CF6",
									stopOpacity: .42
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
									offset: "45%",
									stopColor: "#A855F7",
									stopOpacity: .2
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
									offset: "100%",
									stopColor: "#8B5CF6",
									stopOpacity: 0
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
							id: `${uid}-line`,
							gradientUnits: "userSpaceOnUse",
							x1: 0,
							y1: 0,
							x2: Math.max(size.width, 1),
							y2: 0,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
									offset: "0%",
									stopColor: "#60A5FA"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
									offset: "50%",
									stopColor: "#8B5CF6"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
									offset: "100%",
									stopColor: "#D946EF"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
							id: `${uid}-dot`,
							x1: "0",
							y1: "0",
							x2: "1",
							y2: "1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
								offset: "0%",
								stopColor: "#8B5CF6"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
								offset: "100%",
								stopColor: "#D946EF"
							})]
						})
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
						vertical: false,
						stroke: "rgba(148, 163, 184, 0.22)",
						strokeDasharray: "3 6"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
						dataKey: "label",
						tickLine: false,
						axisLine: false,
						tickMargin: 10,
						minTickGap: 26,
						interval: "preserveStartEnd",
						tick: {
							fontSize: 11,
							fill: "currentColor"
						},
						className: "text-muted-foreground"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
						tickLine: false,
						axisLine: false,
						tickMargin: 8,
						width: 38,
						allowDecimals: false,
						domain: [0, (max) => Math.max(4, Math.ceil(max * 1.2))],
						tick: {
							fontSize: 11,
							fill: "currentColor"
						},
						className: "text-muted-foreground"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
						content: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendTooltip, {}),
						cursor: {
							stroke: "rgba(139, 92, 246, 0.35)",
							strokeWidth: 1,
							strokeDasharray: "4 4"
						},
						wrapperStyle: {
							outline: "none",
							zIndex: 20
						}
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
						type: "monotone",
						dataKey: "total",
						name: "Aktivitas",
						stroke: `url(#${uid}-line)`,
						strokeWidth: 2.6,
						strokeLinecap: "round",
						strokeLinejoin: "round",
						fill: `url(#${uid}-area)`,
						fillOpacity: 1,
						dot: showDots ? {
							r: 2.6,
							fill: `url(#${uid}-dot)`,
							stroke: "transparent",
							strokeWidth: 0
						} : false,
						activeDot: {
							r: 5.5,
							fill: "#8B5CF6",
							stroke: "#fff",
							strokeWidth: 2
						},
						isAnimationActive: true,
						animationDuration: 550
					})
				]
			})
		})]
	});
}
function DonutTooltip({ active, payload, total }) {
	const slice = payload?.[0]?.payload;
	if (!active || !slice) return null;
	const percent = total > 0 ? slice.value / total * 100 : 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-xl border border-border bg-popover/95 px-3 py-2 shadow-lg backdrop-blur",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "h-2 w-2 rounded-full",
				style: { backgroundColor: slice.color },
				"aria-hidden": "true"
			}), slice.name]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "mt-1 text-sm font-semibold tabular-nums text-foreground",
			children: [
				num(slice.value),
				" ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "text-[11px] font-normal text-muted-foreground",
					children: [
						"(",
						percent.toFixed(1).replace(".", ","),
						"%)"
					]
				})
			]
		})]
	});
}
function ActivityDistributionChart({ data, total, loading, height = 236 }) {
	const visible = data.filter((slice) => slice.value > 0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-4 @md:flex-row @md:items-center",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "relative mx-auto w-full max-w-[240px] shrink-0",
			style: { height },
			children: loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartSkeleton, { className: "h-full w-full rounded-full" }) : visible.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex h-full items-center justify-center",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-28 w-28 rounded-full border-[14px] border-dashed border-border/70" })
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
				width: "100%",
				height: "100%",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PieChart, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pie, {
					data: visible,
					dataKey: "value",
					nameKey: "name",
					innerRadius: "63%",
					outerRadius: "92%",
					paddingAngle: 3,
					cornerRadius: 7,
					stroke: "none",
					isAnimationActive: true,
					animationDuration: 550,
					children: visible.map((slice) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, { fill: slice.color }, slice.name))
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
					content: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DonutTooltip, { total }),
					wrapperStyle: { zIndex: 20 }
				})] })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "pointer-events-none absolute inset-0 flex flex-col items-center justify-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-display text-2xl font-bold leading-none tabular-nums",
					children: num(total)
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "mt-1 text-[10px] uppercase tracking-[0.08em] text-muted-foreground",
					children: "Total aktivitas"
				})]
			})] })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
			className: "min-w-0 flex-1 space-y-2",
			children: [loading && Array.from({ length: 4 }).map((_, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { className: "animate-pulse rounded-lg bg-muted/60 p-2.5" }, index)), !loading && data.map((slice) => {
				const percent = total > 0 ? slice.value / total * 100 : 0;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex items-center justify-between gap-3 rounded-lg px-2 py-1.5 transition-colors hover:bg-muted/50",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "flex min-w-0 items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "h-2.5 w-2.5 shrink-0 rounded-full",
							style: { backgroundColor: slice.color },
							"aria-hidden": "true"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "truncate text-xs font-medium text-foreground",
							children: slice.name
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "shrink-0 text-right",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs font-semibold tabular-nums text-foreground",
							children: num(slice.value)
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "ml-1.5 text-[11px] text-muted-foreground",
							children: [percent.toFixed(1).replace(".", ","), "%"]
						})]
					})]
				}, slice.name);
			})]
		})]
	});
}
function BarTooltip({ active, payload }) {
	const point = payload?.[0]?.payload;
	if (!active || !point) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-xl border border-border bg-popover/95 px-3 py-2 shadow-lg backdrop-blur",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-[10px] font-semibold uppercase tracking-[0.08em] text-muted-foreground",
			children: point.fullLabel
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "mt-1 text-sm font-semibold tabular-nums text-foreground",
			children: [
				num(point.total),
				" ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-[11px] font-normal text-muted-foreground",
					children: "aktivitas"
				})
			]
		})]
	});
}
function ActivityComparisonChart({ data, loading, height = 236 }) {
	const uid = `bar-${(0, import_react.useId)().replace(/[^a-zA-Z0-9_-]/g, "")}`;
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartSkeleton, { className: "w-full" });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "w-full",
		style: { height },
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
			width: "100%",
			height: "100%",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
				data,
				margin: {
					top: 8,
					right: 8,
					left: 0,
					bottom: 0
				},
				barCategoryGap: "26%",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("defs", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
						id: `${uid}-fill`,
						x1: "0",
						y1: "0",
						x2: "0",
						y2: "1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
								offset: "0%",
								stopColor: "#8B5CF6",
								stopOpacity: .95
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
								offset: "60%",
								stopColor: "#7C8CF8",
								stopOpacity: .9
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
								offset: "100%",
								stopColor: "#60A5FA",
								stopOpacity: .85
							})
						]
					}) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
						vertical: false,
						stroke: "rgba(148, 163, 184, 0.2)",
						strokeDasharray: "3 6"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
						dataKey: "label",
						tickLine: false,
						axisLine: false,
						tickMargin: 10,
						minTickGap: 16,
						interval: "preserveStartEnd",
						tick: {
							fontSize: 11,
							fill: "currentColor"
						},
						className: "text-muted-foreground"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
						tickLine: false,
						axisLine: false,
						tickMargin: 8,
						width: 34,
						allowDecimals: false,
						domain: [0, (max) => Math.max(4, Math.ceil(max * 1.2))],
						tick: {
							fontSize: 11,
							fill: "currentColor"
						},
						className: "text-muted-foreground"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
						content: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BarTooltip, {}),
						cursor: { fill: "rgba(139, 92, 246, 0.08)" },
						wrapperStyle: {
							outline: "none",
							zIndex: 20
						}
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
						dataKey: "total",
						fill: `url(#${uid}-fill)`,
						radius: [
							7,
							7,
							0,
							0
						],
						maxBarSize: 38,
						isAnimationActive: true,
						animationDuration: 550
					})
				]
			})
		})
	});
}
var categories = [
	"Pekerjaan",
	"Pembayaran Masuk",
	"Payout Buzzer",
	"Komisi Admin"
];
var PERIOD_OPTIONS = [
	{
		key: "7d",
		label: "7 hari"
	},
	{
		key: "30d",
		label: "30 hari"
	},
	{
		key: "90d",
		label: "90 hari"
	},
	{
		key: "custom",
		label: "Kustom"
	}
];
var DAY_MS = 864e5;
var MAX_RANGE_DAYS = 366;
function startOfDay(date) {
	const next = new Date(date);
	next.setHours(0, 0, 0, 0);
	return next;
}
function endOfDay(date) {
	const next = new Date(date);
	next.setHours(23, 59, 59, 999);
	return next;
}
function dayKey(value) {
	const date = value instanceof Date ? value : new Date(value);
	if (Number.isNaN(date.getTime())) return "";
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");
	return `${date.getFullYear()}-${month}-${day}`;
}
function shortLabel(date) {
	return date.toLocaleDateString("id-ID", {
		day: "2-digit",
		month: "short"
	});
}
function fullLabel(date) {
	return date.toLocaleDateString("id-ID", {
		weekday: "long",
		day: "numeric",
		month: "long",
		year: "numeric"
	});
}
function rangeLabel(from, to) {
	const sameYear = from.getFullYear() === to.getFullYear();
	return `${from.toLocaleDateString("id-ID", {
		day: "numeric",
		month: "short",
		...sameYear ? {} : { year: "numeric" }
	})} – ${to.toLocaleDateString("id-ID", {
		day: "numeric",
		month: "short",
		year: "numeric"
	})}`;
}
function statusClass$1(status) {
	if ([
		"Berhasil",
		"Lunas",
		"Selesai"
	].includes(status)) return "bg-emerald-100 text-emerald-700";
	if ([
		"Refund",
		"Ditolak",
		"Gagal"
	].includes(status)) return "bg-rose-100 text-rose-700";
	return "bg-amber-100 text-amber-700";
}
function statusLabel$1(status) {
	return status === "Menunggu Verifikasi" ? "Menunggu" : status;
}
function jobSplit(job) {
	const split = calculateCampaignJobSplit(job);
	return {
		level: job.buzzer_level ?? "Legacy",
		gross: split.total,
		buzzerPercentage: split.buzzerPercent,
		buzzerAmount: split.buzzerShare,
		adminPercentage: split.adminPercent,
		adminAmount: split.adminShare
	};
}
function buildDelta(current, previous) {
	if (previous <= 0) {
		if (current <= 0) return {
			text: void 0,
			direction: "flat"
		};
		return {
			text: "Baru periode ini",
			direction: "flat"
		};
	}
	const percent = (current - previous) / previous * 100;
	return {
		text: `${percent > 0 ? "+" : ""}${percent.toFixed(1).replace(".", ",")}%`,
		direction: percent > 0 ? "up" : percent < 0 ? "down" : "flat"
	};
}
function PencairanSection() {
	const { data: payments, loading: paymentsLoading, refetch: refetchPayments } = usePayments();
	const { data: jobs, loading: jobsLoading, error: jobsError, refetch: refetchJobs } = useCompletedCampaignJobs();
	const { data: campaigns, loading: campaignsLoading, error: campaignsError, refetch: refetchCampaigns } = useCampaigns();
	const [accounts, setAccounts] = (0, import_react.useState)([]);
	const [accountsLoading, setAccountsLoading] = (0, import_react.useState)(true);
	const [accountsError, setAccountsError] = (0, import_react.useState)(null);
	const [period, setPeriod] = (0, import_react.useState)("30d");
	const [customFrom, setCustomFrom] = (0, import_react.useState)("");
	const [customTo, setCustomTo] = (0, import_react.useState)("");
	const [category, setCategory] = (0, import_react.useState)("");
	const [status, setStatus] = (0, import_react.useState)("");
	const [query, setQuery] = (0, import_react.useState)("");
	const [date, setDate] = (0, import_react.useState)("");
	const [page, setPage] = (0, import_react.useState)(1);
	const PAGE_SIZE = 8;
	const [isRefreshing, setIsRefreshing] = (0, import_react.useState)(false);
	const [selected, setSelected] = (0, import_react.useState)(null);
	const [deleteConfirm, setDeleteConfirm] = (0, import_react.useState)(null);
	const [deletedIds, setDeletedIds] = (0, import_react.useState)(() => {
		try {
			const raw = localStorage.getItem("buzzhub.deleted_activities");
			return raw ? JSON.parse(raw) : [];
		} catch {
			return [];
		}
	});
	const loadAccounts = (0, import_react.useCallback)(async () => {
		setAccountsLoading(true);
		setAccountsError(null);
		const { data, error } = await supabase.from("app_accounts").select("email, role, created_at");
		if (error) {
			console.error("[Supabase] Failed to load app_accounts:", error);
			setAccountsError(error.message);
			setAccounts([]);
		} else setAccounts(data ?? []);
		setAccountsLoading(false);
	}, []);
	(0, import_react.useEffect)(() => {
		loadAccounts();
		const channel = supabase.channel("admin-activity-accounts").on("postgres_changes", {
			event: "*",
			schema: "public",
			table: "app_accounts"
		}, () => void loadAccounts()).subscribe();
		return () => {
			supabase.removeChannel(channel);
		};
	}, [loadAccounts]);
	const activities = (0, import_react.useMemo)(() => {
		const rows = [];
		payments.forEach((payment) => rows.push({
			id: `payment-${payment.id}`,
			category: "Pembayaran Masuk",
			actor: payment.customer_name,
			title: `${payment.customer_name} telah membayar invoice ${payment.invoice_no}`,
			reference: `${payment.invoice_no} · ${payment.campaign_name}`,
			amount: Number(payment.amount),
			status: payment.status,
			time: payment.paid_at ?? payment.created_at,
			detail: payment
		}));
		jobs.filter((job) => (job.status === "Selesai" || Boolean(job.admin_verified_at)) && job.buzzer_email).forEach((job) => {
			const split = jobSplit(job);
			rows.push({
				id: `job-${job.id}`,
				category: "Pekerjaan",
				actor: job.buzzer_name || job.buzzer_email || "Buzzer",
				title: `${job.buzzer_name || "Buzzer"} menyelesaikan campaign ${job.campaign_title} · Level ${split.level}`,
				reference: job.campaign_title,
				amount: split.gross,
				status: job.status,
				time: job.updated_at,
				detail: job,
				split
			});
			rows.push({
				id: `payout-${job.id}`,
				category: "Payout Buzzer",
				actor: job.buzzer_name || job.buzzer_email || "Buzzer",
				title: `Payout ${split.buzzerPercentage}% kepada ${job.buzzer_name || "Buzzer"} untuk ${job.campaign_title}`,
				reference: job.campaign_title,
				amount: split.buzzerAmount,
				status: "Berhasil",
				time: job.updated_at,
				detail: job,
				split
			});
			rows.push({
				id: `commission-${job.id}`,
				category: "Komisi Admin",
				actor: "Admin",
				title: `Komisi Admin ${split.adminPercentage}% dari campaign ${job.campaign_title}`,
				reference: job.campaign_title,
				amount: split.adminAmount,
				status: "Berhasil",
				time: job.updated_at,
				detail: job,
				split
			});
		});
		return rows.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
	}, [payments, jobs]);
	const visibleActivities = (0, import_react.useMemo)(() => activities.filter((item) => !deletedIds.includes(item.id)), [activities, deletedIds]);
	const range = (0, import_react.useMemo)(() => {
		const today = endOfDay(/* @__PURE__ */ new Date());
		if (period === "custom" && customFrom && customTo) {
			const from = startOfDay(new Date(customFrom));
			const to = endOfDay(new Date(customTo));
			if (!Number.isNaN(from.getTime()) && !Number.isNaN(to.getTime()) && from <= to) {
				const maxFrom = startOfDay(/* @__PURE__ */ new Date(to.getTime() - 365 * DAY_MS));
				return {
					from: from < maxFrom ? maxFrom : from,
					to,
					key: "custom"
				};
			}
		}
		const days = period === "90d" ? 90 : period === "7d" ? 7 : 30;
		return {
			from: startOfDay(/* @__PURE__ */ new Date(today.getTime() - (days - 1) * DAY_MS)),
			to: today,
			key: period
		};
	}, [
		period,
		customFrom,
		customTo
	]);
	const previousRange = (0, import_react.useMemo)(() => {
		const span = range.to.getTime() - range.from.getTime() + 1;
		const to = /* @__PURE__ */ new Date(range.from.getTime() - 1);
		return {
			from: new Date(to.getTime() - span + 1),
			to
		};
	}, [range]);
	const inRange = (0, import_react.useCallback)((value, bounds) => {
		const time = new Date(value).getTime();
		if (Number.isNaN(time)) return false;
		return time >= bounds.from.getTime() && time <= bounds.to.getTime();
	}, []);
	const periodActivities = (0, import_react.useMemo)(() => visibleActivities.filter((item) => inRange(item.time, range)), [
		visibleActivities,
		range,
		inRange
	]);
	const previousActivities = (0, import_react.useMemo)(() => visibleActivities.filter((item) => inRange(item.time, previousRange)), [
		visibleActivities,
		previousRange,
		inRange
	]);
	const trendSeries = (0, import_react.useMemo)(() => {
		const buckets = /* @__PURE__ */ new Map();
		const cursor = startOfDay(range.from);
		let guard = 0;
		while (cursor.getTime() <= range.to.getTime() && guard < MAX_RANGE_DAYS) {
			buckets.set(dayKey(cursor), {
				key: dayKey(cursor),
				label: shortLabel(cursor),
				fullLabel: fullLabel(cursor),
				total: 0,
				pembayaran: 0,
				pekerjaan: 0,
				payout: 0,
				komisi: 0
			});
			cursor.setDate(cursor.getDate() + 1);
			guard += 1;
		}
		for (const row of periodActivities) {
			const bucket = buckets.get(dayKey(row.time));
			if (!bucket) continue;
			bucket.total += 1;
			if (row.category === "Pembayaran Masuk") bucket.pembayaran += 1;
			else if (row.category === "Pekerjaan") bucket.pekerjaan += 1;
			else if (row.category === "Payout Buzzer") bucket.payout += 1;
			else bucket.komisi += 1;
		}
		return Array.from(buckets.values());
	}, [periodActivities, range]);
	const barSeries = (0, import_react.useMemo)(() => {
		if (trendSeries.length <= 31) return trendSeries.map((point) => ({
			label: point.label,
			fullLabel: point.fullLabel,
			total: point.total
		}));
		const weekly = [];
		for (let index = 0; index < trendSeries.length; index += 7) {
			const chunk = trendSeries.slice(index, index + 7);
			weekly.push({
				label: chunk[0].label,
				fullLabel: `${chunk[0].label} – ${chunk[chunk.length - 1].label}`,
				total: chunk.reduce((sum, item) => sum + item.total, 0)
			});
		}
		return weekly;
	}, [trendSeries]);
	const distribution = (0, import_react.useMemo)(() => {
		const totals = {
			pembayaran: 0,
			pekerjaan: 0,
			payout: 0,
			komisi: 0
		};
		periodActivities.forEach((item) => {
			if (item.category === "Pembayaran Masuk") totals.pembayaran += 1;
			else if (item.category === "Pekerjaan") totals.pekerjaan += 1;
			else if (item.category === "Payout Buzzer") totals.payout += 1;
			else totals.komisi += 1;
		});
		return [
			{
				name: "Pembayaran Masuk",
				value: totals.pembayaran,
				color: CHART_COLORS.blue
			},
			{
				name: "Pekerjaan",
				value: totals.pekerjaan,
				color: CHART_COLORS.violet
			},
			{
				name: "Payout Buzzer",
				value: totals.payout,
				color: CHART_COLORS.cyan
			},
			{
				name: "Komisi Admin",
				value: totals.komisi,
				color: CHART_COLORS.pink
			}
		];
	}, [periodActivities]);
	const totalInRange = periodActivities.length;
	const financials = (0, import_react.useMemo)(() => {
		const result = {
			incoming: 0,
			payout: 0,
			commission: 0
		};
		periodActivities.forEach((item) => {
			if (item.category === "Pembayaran Masuk" && (item.status === "Lunas" || item.status === "Berhasil")) result.incoming += item.amount || 0;
			else if (item.category === "Payout Buzzer") result.payout += item.amount || 0;
			else if (item.category === "Komisi Admin") result.commission += item.amount || 0;
		});
		return result;
	}, [periodActivities]);
	const metrics = (0, import_react.useMemo)(() => {
		const paymentsInRange = payments.filter((payment) => inRange(payment.paid_at ?? payment.created_at, range));
		const paymentsPrev = payments.filter((payment) => inRange(payment.paid_at ?? payment.created_at, previousRange));
		const buzzersInRange = /* @__PURE__ */ new Set();
		const buzzersPrev = /* @__PURE__ */ new Set();
		jobs.forEach((job) => {
			if (!job.buzzer_email) return;
			const email = job.buzzer_email.trim().toLowerCase();
			if (inRange(job.updated_at, range)) buzzersInRange.add(email);
			if (inRange(job.updated_at, previousRange)) buzzersPrev.add(email);
		});
		const usersInRange = accounts.filter((account) => account.role !== "admin" && account.created_at && inRange(account.created_at, range));
		const usersPrev = accounts.filter((account) => account.role !== "admin" && account.created_at && inRange(account.created_at, previousRange));
		const transactionAmount = paymentsInRange.reduce((sum, payment) => sum + Number(payment.amount ?? 0), 0);
		const activeCampaigns = campaigns.filter((campaign) => campaign.status === "Aktif").length;
		return {
			total: buildDelta(totalInRange, previousActivities.length),
			transactions: buildDelta(paymentsInRange.length, paymentsPrev.length),
			buzzers: buildDelta(buzzersInRange.size, buzzersPrev.size),
			users: buildDelta(usersInRange.length, usersPrev.length),
			transactionAmount,
			activeCampaigns,
			buzzerCount: buzzersInRange.size,
			userCount: usersInRange.length
		};
	}, [
		payments,
		jobs,
		accounts,
		campaigns,
		range,
		previousRange,
		totalInRange,
		previousActivities,
		inRange
	]);
	const statusOptions = (0, import_react.useMemo)(() => {
		const set = /* @__PURE__ */ new Set();
		periodActivities.forEach((item) => {
			if (item.status && item.status !== "Semua" && item.status !== "Filter Status") set.add(item.status);
		});
		[
			"Berhasil",
			"Lunas",
			"Selesai",
			"Menunggu Verifikasi",
			"Ditolak",
			"Refund",
			"Gagal"
		].forEach((item) => set.add(item));
		return Array.from(set);
	}, [periodActivities]);
	const filtered = (0, import_react.useMemo)(() => periodActivities.filter((item) => {
		const haystack = `${item.actor} ${item.title} ${item.reference}`.toLowerCase();
		return (!category || category === "Semua" || item.category === category) && (!status || status === "Semua" || item.status === status) && (!query || haystack.includes(query.toLowerCase())) && (!date || item.time.slice(0, 10) === date);
	}), [
		periodActivities,
		category,
		status,
		query,
		date
	]);
	(0, import_react.useEffect)(() => {
		setPage(1);
	}, [
		category,
		status,
		query,
		date,
		period,
		customFrom,
		customTo
	]);
	const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
	const safePage = Math.min(Math.max(1, page), totalPages);
	const paginatedActivities = (0, import_react.useMemo)(() => {
		const start = (safePage - 1) * PAGE_SIZE;
		return filtered.slice(start, start + PAGE_SIZE);
	}, [filtered, safePage]);
	const loading = paymentsLoading || jobsLoading || campaignsLoading || accountsLoading;
	const loadError = jobsError || campaignsError || accountsError;
	const handleRefresh = async () => {
		setIsRefreshing(true);
		try {
			await Promise.all([
				refetchPayments(),
				refetchJobs(),
				refetchCampaigns(),
				loadAccounts()
			]);
			toast.success("Data aktivitas berhasil diperbarui");
		} catch {
			toast.error("Gagal memperbarui data aktivitas");
		} finally {
			setIsRefreshing(false);
		}
	};
	const handleDeleteActivity = async (item) => {
		const nextDeleted = [...deletedIds, item.id];
		setDeletedIds(nextDeleted);
		try {
			localStorage.setItem("buzzhub.deleted_activities", JSON.stringify(nextDeleted));
		} catch (error) {
			console.warn("Gagal menyimpan deleted_activities ke localStorage:", error);
		}
		try {
			const rawId = item.id.replace(/^(payment|job|payout|commission)-/, "");
			await supabase.from("finance_activity").delete().eq("ref_id", rawId);
		} catch (error) {
			console.warn("Gagal menghapus dari finance_activity:", error);
		}
		toast.success(`Aktivitas "${item.title}" berhasil dihapus.`);
		setDeleteConfirm(null);
		setSelected(null);
	};
	const trendEmpty = !loading && totalInRange === 0;
	const chartError = loadError ? typeof loadError === "string" ? loadError : "Sebagian data gagal dimuat dari server." : null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-3 rounded-2xl border border-border bg-card p-3 shadow-sm sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex min-w-0 flex-col gap-2 sm:flex-row sm:items-center sm:gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "inline-flex w-full shrink-0 rounded-xl border border-border bg-muted/50 p-1 sm:w-auto",
							children: PERIOD_OPTIONS.map((option) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setPeriod(option.key),
								className: cn("flex-1 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors sm:flex-none", period === option.key ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"),
								"aria-pressed": period === option.key,
								children: option.label
							}, option.key))
						}),
						period === "custom" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "date",
									"aria-label": "Tanggal mulai",
									value: customFrom,
									max: customTo || void 0,
									onChange: (event) => setCustomFrom(event.target.value),
									className: "h-9 w-full text-xs sm:w-[142px]"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs text-muted-foreground",
									children: "–"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "date",
									"aria-label": "Tanggal akhir",
									value: customTo,
									min: customFrom || void 0,
									onChange: (event) => setCustomTo(event.target.value),
									className: "h-9 w-full text-xs sm:w-[142px]"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "flex items-center gap-1.5 text-xs text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarDays, {
								className: "h-3.5 w-3.5",
								"aria-hidden": "true"
							}), rangeLabel(range.from, range.to)]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "outline",
					size: "sm",
					onClick: handleRefresh,
					disabled: isRefreshing,
					className: "h-9 shrink-0 gap-1.5",
					title: "Muat ulang data aktivitas",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, {
						className: cn("h-4 w-4", isRefreshing && "animate-spin"),
						"aria-hidden": "true"
					}), "Refresh"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5",
				children: loading ? Array.from({ length: 5 }).map((_, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartSkeleton, { className: "h-[118px] rounded-2xl" }, index)) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActivityMetricCard, {
						label: "Total Aktivitas",
						value: totalInRange.toLocaleString("id-ID"),
						hint: "event pada periode",
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Activity, { className: "h-4 w-4" }),
						accent: "blue",
						deltaText: metrics.total.text,
						deltaDirection: metrics.total.direction
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActivityMetricCard, {
						label: "Transaksi Masuk",
						value: metrics.transactionAmount > 0 ? formatIDR(metrics.transactionAmount) : "Rp 0",
						hint: `${payments.filter((p) => inRange(p.paid_at ?? p.created_at, range)).length.toLocaleString("id-ID")} pembayaran`,
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "h-4 w-4" }),
						accent: "violet",
						deltaText: metrics.transactions.text,
						deltaDirection: metrics.transactions.direction
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActivityMetricCard, {
						label: "Buzzer Aktif",
						value: metrics.buzzerCount.toLocaleString("id-ID"),
						hint: "buzzer dengan aktivitas",
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "h-4 w-4" }),
						accent: "cyan",
						deltaText: metrics.buzzers.text,
						deltaDirection: metrics.buzzers.direction
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActivityMetricCard, {
						label: "Pengguna Baru",
						value: metrics.userCount.toLocaleString("id-ID"),
						hint: "akun terdaftar",
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserPlus, { className: "h-4 w-4" }),
						accent: "pink",
						deltaText: metrics.users.text,
						deltaDirection: metrics.users.direction
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActivityMetricCard, {
						label: "Kampanye Aktif",
						value: metrics.activeCampaigns.toLocaleString("id-ID"),
						hint: "status saat ini",
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Megaphone, { className: "h-4 w-4" }),
						accent: "indigo"
					})
				] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "-mt-3 text-[11px] text-muted-foreground",
				children: [
					"Persentase perubahan dihitung terhadap periode sebelumnya (",
					rangeLabel(previousRange.from, previousRange.to),
					")."
				]
			}),
			chartError && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				role: "alert",
				className: "flex flex-col gap-2 rounded-2xl border border-rose-200 bg-rose-50/70 p-4 text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-200 sm:flex-row sm:items-center sm:justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-semibold",
						children: "Sebagian data aktivitas gagal dimuat"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-0.5 text-xs opacity-90",
						children: [chartError, " — angka pada kartu di atas bisa jadi belum lengkap."]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "outline",
					size: "sm",
					onClick: handleRefresh,
					disabled: isRefreshing,
					className: "h-9 shrink-0 gap-1.5 border-rose-300 text-rose-700 hover:bg-rose-100 dark:border-rose-500/40 dark:text-rose-200 dark:hover:bg-rose-500/20",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, {
						className: cn("h-4 w-4", isRefreshing && "animate-spin"),
						"aria-hidden": "true"
					}), "Coba lagi"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartCard, {
				title: "Tren Aktivitas",
				description: "Jumlah aktivitas harian pada periode terpilih",
				action: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "h-2 w-2 rounded-full bg-violet-500",
							"aria-hidden": "true"
						}), "Aktivitas"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "rounded-full border border-border bg-muted/40 px-2.5 py-1 text-[11px] font-semibold tabular-nums text-foreground",
						children: [totalInRange.toLocaleString("id-ID"), " total"]
					})]
				}),
				children: chartError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartErrorState, {
					compact: true,
					message: chartError
				}) : trendEmpty ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartEmptyState, { message: "Belum ada aktivitas pada periode ini. Coba pilih rentang tanggal lain." }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActivityTrendChart, {
					data: trendSeries,
					loading,
					height: 330
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 lg:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartCard, {
					title: "Distribusi Aktivitas",
					description: "Komposisi jenis aktivitas pada periode terpilih",
					children: chartError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartErrorState, {
						compact: true,
						message: chartError
					}) : trendEmpty ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartEmptyState, { message: "Belum ada aktivitas untuk dihitung distribusinya." }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActivityDistributionChart, {
						data: distribution,
						total: totalInRange,
						loading
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 grid grid-cols-2 gap-2 border-t border-border/70 pt-3 text-[11px]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-muted-foreground",
							children: "Payout buzzer"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-semibold tabular-nums text-foreground",
							children: formatIDR(financials.payout)
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-muted-foreground",
							children: "Komisi admin"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-semibold tabular-nums text-foreground",
							children: formatIDR(financials.commission)
						})] })]
					})] })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartCard, {
					title: "Perbandingan Aktivitas",
					description: trendSeries.length > 31 ? "Total aktivitas per minggu pada periode terpilih" : "Total aktivitas per hari pada periode terpilih",
					children: chartError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartErrorState, {
						compact: true,
						message: chartError
					}) : trendEmpty ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartEmptyState, { message: "Belum ada aktivitas untuk dibandingkan." }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActivityComparisonChart, {
						data: barSeries,
						loading
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "overflow-hidden rounded-2xl border border-border bg-card shadow-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-3 border-b border-border/70 p-4 lg:flex-row lg:items-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative min-w-0 flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								placeholder: "Cari customer, buzzer, invoice, campaign...",
								className: "pl-9",
								value: query,
								onChange: (event) => setQuery(event.target.value)
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: category,
									onValueChange: (value) => setCategory(value),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
										className: "h-10 w-auto min-w-[150px] bg-background text-foreground data-[placeholder]:text-foreground",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Filter Aktivitas" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: categories.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: item,
										children: item
									}, item)) })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: status,
									onValueChange: (value) => setStatus(value),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
										className: "h-10 w-auto min-w-[140px] bg-background text-foreground data-[placeholder]:text-foreground",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Filter Status" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: statusOptions.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: item,
										children: item
									}, item)) })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "date",
									className: "h-10 w-auto",
									"aria-label": "Filter tanggal",
									value: date,
									onChange: (event) => setDate(event.target.value)
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "overflow-x-auto",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Jenis" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Aktor" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Aktivitas" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Campaign/Invoice" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Nominal" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Status" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Waktu" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Aksi/Detail" })
						] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableBody, { children: [
							loading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
								colSpan: 8,
								className: "py-10 text-center text-sm text-muted-foreground",
								children: "Memuat aktivitas dari Supabase..."
							}) }),
							!loading && filtered.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
								colSpan: 8,
								className: "py-10 text-center text-sm text-muted-foreground",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "inline-flex flex-col items-center gap-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Inbox, {
										className: "h-5 w-5",
										"aria-hidden": "true"
									}), chartError ? "Data aktivitas gagal dimuat. Gunakan tombol Coba lagi untuk mengulang." : "Belum ada data aktivitas pada periode ini."]
								})
							}) }),
							!loading && paginatedActivities.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, {
								className: "hover:bg-muted/40",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "inline-flex items-center rounded-full bg-muted px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground",
										children: item.category
									}) }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "font-medium",
										children: item.actor
									}) }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "font-medium",
										children: item.title
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xs text-muted-foreground",
										children: item.reference
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
										className: "text-xs",
										children: item.reference
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
										className: "font-semibold",
										children: formatIDR(item.amount)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: cn("inline-flex min-w-[5.5rem] justify-center whitespace-nowrap rounded-full px-2 py-1 text-[10px] font-semibold", statusClass$1(item.status)),
										children: statusLabel$1(item.status)
									}) }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
										className: "text-xs text-muted-foreground",
										children: formatDate(item.time)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											size: "icon",
											variant: "ghost",
											title: "Detail",
											onClick: () => setSelected(item),
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-4 w-4" })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											size: "icon",
											variant: "ghost",
											className: "text-muted-foreground hover:text-destructive",
											title: "Hapus Aktivitas",
											onClick: () => setDeleteConfirm(item),
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
										})]
									}) })
								]
							}, item.id))
						] })] })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TablePagination$1, {
						currentPage: safePage,
						totalItems: filtered.length,
						pageSize: PAGE_SIZE,
						onPageChange: setPage
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: !!selected,
				onOpenChange: (open) => !open && setSelected(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "sm:max-w-lg",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Detail Aktivitas" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: selected?.category })] }),
						selected && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2 rounded-xl border border-border p-4 text-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground",
										children: "Aktor"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: selected.actor })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground",
										children: "Aktivitas"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-right",
										children: selected.title
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground",
										children: "Campaign/Invoice"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: selected.reference })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground",
										children: "Nominal"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: formatIDR(selected.amount) })]
								}),
								selected.split && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground",
											children: "Level Buzzer"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: selected.split.level })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground",
											children: "Bagian Buzzer"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("b", { children: [
											formatIDR(selected.split.buzzerAmount),
											" (",
											selected.split.buzzerPercentage,
											"%)"
										] })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground",
											children: "Bagian Admin"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("b", { children: [
											formatIDR(selected.split.adminAmount),
											" (",
											selected.split.adminPercentage,
											"%)"
										] })]
									})
								] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground",
										children: "Status"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: selected.status })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground",
										children: "Waktu"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: formatDate(selected.time) })]
								}),
								selected.category === "Pembayaran Masuk" && selected.detail && "invoice_no" in selected.detail && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground",
										children: "Metode"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: selected.detail.method })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground",
										children: "ID transaksi"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: selected.detail.id })]
								})] })
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
							className: "flex flex-row items-center justify-between gap-2 sm:justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								type: "button",
								variant: "destructive",
								onClick: () => setDeleteConfirm(selected),
								className: "gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" }), "Hapus"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								variant: "outline",
								onClick: () => setSelected(null),
								children: "Tutup"
							})]
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialog, {
				open: !!deleteConfirm,
				onOpenChange: (open) => !open && setDeleteConfirm(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogTitle, { children: "Hapus Aktivitas?" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogDescription, { children: [
					"Apakah Anda yakin ingin menghapus aktivitas ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: deleteConfirm?.title }),
					" dari riwayat aktivitas?"
				] })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogCancel, { children: "Batal" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogAction, {
					onClick: () => deleteConfirm && handleDeleteActivity(deleteConfirm),
					className: "bg-destructive text-destructive-foreground hover:bg-destructive/90 gap-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" }), "Ya, Hapus"]
				})] })] })
			})
		]
	});
}
var WALLET_STORAGE_KEY = "buzzconnect_admin_wallet_cache";
var WITHDRAWALS_STORAGE_KEY = "buzzhub_admin_withdrawals";
var UPDATE_EVENT = "buzzhub:admin_wallet_updated";
function getCachedWallet() {
	try {
		const raw = localStorage.getItem(WALLET_STORAGE_KEY);
		if (raw) {
			const parsed = JSON.parse(raw);
			if (typeof parsed === "object" && parsed !== null && typeof parsed.total_revenue === "number") return parsed;
		}
	} catch {}
	return {
		id: "primary",
		balance: 0,
		total_revenue: 0,
		total_buzzer_payout: 0,
		total_incoming: 0,
		completed_jobs_count: 0,
		updated_at: (/* @__PURE__ */ new Date()).toISOString()
	};
}
function setCachedWallet(wallet) {
	try {
		localStorage.setItem(WALLET_STORAGE_KEY, JSON.stringify(wallet));
	} catch {}
}
function getCachedWithdrawals() {
	try {
		const raw = localStorage.getItem(WITHDRAWALS_STORAGE_KEY);
		if (raw) {
			const parsed = JSON.parse(raw);
			if (Array.isArray(parsed)) return parsed;
		}
	} catch {}
	return [];
}
function setCachedWithdrawals(list) {
	try {
		localStorage.setItem(WITHDRAWALS_STORAGE_KEY, JSON.stringify(list));
	} catch {}
}
var adminWalletSeq = 0;
function useAdminWallet() {
	const instanceId = (0, import_react.useId)().replace(/[^a-zA-Z0-9_-]/g, "");
	const [channelId] = (0, import_react.useState)(() => `${instanceId}-${++adminWalletSeq}`);
	const [wallet, setWallet] = (0, import_react.useState)(getCachedWallet);
	const [withdrawals, setWithdrawals] = (0, import_react.useState)(getCachedWithdrawals);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const { data: completedJobs, loading: jobsLoading } = useCompletedCampaignJobs();
	const { data: payments, loading: paymentsLoading } = usePayments();
	const computedWallet = (0, import_react.useMemo)(() => {
		let grossTotal = 0;
		let adminProfit = 0;
		let buzzerPayout = 0;
		for (const job of completedJobs) {
			const split = calculateCampaignJobSplit(job);
			grossTotal += split.total;
			adminProfit += split.adminShare;
			buzzerPayout += split.buzzerShare;
		}
		const incoming = payments.filter((p) => ["Berhasil", "Lunas"].includes(p.status)).reduce((sum, p) => sum + Number(p.amount || 0), 0);
		return {
			id: "primary",
			balance: adminProfit,
			total_revenue: grossTotal,
			total_buzzer_payout: buzzerPayout,
			total_incoming: incoming,
			completed_jobs_count: completedJobs.length,
			updated_at: (/* @__PURE__ */ new Date()).toISOString()
		};
	}, [completedJobs, payments]);
	const fetchWithdrawals = (0, import_react.useCallback)(async () => {
		try {
			const { data, error } = await supabase.from("admin_withdrawals").select("*").order("created_at", { ascending: false });
			if (!error && Array.isArray(data)) {
				const mapped = data.map((item) => ({
					id: item.id,
					date: item.created_at ? item.created_at.slice(0, 10) : (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
					amount: Number(item.amount || 0),
					method: item.method || "Transfer Bank",
					provider: item.provider || "Bank",
					account_no: item.account_no || "",
					status: "Berhasil",
					created_at: item.created_at || (/* @__PURE__ */ new Date()).toISOString()
				}));
				setWithdrawals((prev) => {
					const map = /* @__PURE__ */ new Map();
					prev.forEach((w) => map.set(w.id, w));
					mapped.forEach((w) => map.set(w.id, w));
					const merged = Array.from(map.values()).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
					setCachedWithdrawals(merged);
					return merged;
				});
				return;
			}
		} catch {}
		setWithdrawals(getCachedWithdrawals());
	}, []);
	const fetchWallet = (0, import_react.useCallback)(async () => {
		try {
			const { data, error } = await supabase.from("admin_wallet").select("*").eq("id", "primary").maybeSingle();
			if (!error && data && Number(data.total_revenue || 0) > 0) {
				const remoteWallet = {
					id: data.id || "primary",
					balance: Number(data.balance || 0),
					total_revenue: Number(data.total_revenue || 0),
					total_buzzer_payout: Number(data.total_buzzer_payout || 0),
					total_incoming: Number(data.total_incoming || 0),
					completed_jobs_count: Number(data.completed_jobs_count || 0),
					updated_at: data.updated_at || (/* @__PURE__ */ new Date()).toISOString()
				};
				setWallet(remoteWallet);
				setCachedWallet(remoteWallet);
				return;
			}
		} catch {}
		if (!jobsLoading && !paymentsLoading) {
			setWallet(computedWallet);
			setCachedWallet(computedWallet);
			(async () => {
				try {
					await supabase.from("admin_wallet").upsert({
						id: "primary",
						balance: computedWallet.balance,
						total_revenue: computedWallet.total_revenue,
						total_buzzer_payout: computedWallet.total_buzzer_payout,
						total_incoming: computedWallet.total_incoming,
						completed_jobs_count: computedWallet.completed_jobs_count,
						updated_at: (/* @__PURE__ */ new Date()).toISOString()
					});
				} catch {}
			})();
		}
	}, [
		computedWallet,
		jobsLoading,
		paymentsLoading
	]);
	(0, import_react.useEffect)(() => {
		fetchWallet();
		fetchWithdrawals();
		const handleLocalUpdate = () => {
			setWithdrawals(getCachedWithdrawals());
			fetchWallet();
		};
		window.addEventListener(UPDATE_EVENT, handleLocalUpdate);
		const ch = supabase.channel(`rt-admin-wallet-${channelId}`).on("postgres_changes", {
			event: "*",
			schema: "public",
			table: "admin_wallet"
		}, () => {
			fetchWallet();
		}).on("postgres_changes", {
			event: "*",
			schema: "public",
			table: "admin_withdrawals"
		}, () => {
			fetchWithdrawals();
		}).on("postgres_changes", {
			event: "*",
			schema: "public",
			table: "campaign_jobs"
		}, () => {
			fetchWallet();
		}).on("postgres_changes", {
			event: "*",
			schema: "public",
			table: "payments"
		}, () => {
			fetchWallet();
		}).subscribe();
		return () => {
			window.removeEventListener(UPDATE_EVENT, handleLocalUpdate);
			supabase.removeChannel(ch);
		};
	}, [
		fetchWallet,
		fetchWithdrawals,
		channelId
	]);
	(0, import_react.useEffect)(() => {
		if (!jobsLoading && !paymentsLoading && computedWallet.total_revenue > 0) {
			setWallet((prev) => {
				if (prev.total_revenue < computedWallet.total_revenue) {
					setCachedWallet(computedWallet);
					return computedWallet;
				}
				return prev;
			});
			setLoading(false);
		}
	}, [
		computedWallet,
		jobsLoading,
		paymentsLoading
	]);
	const effectiveWallet = (0, import_react.useMemo)(() => {
		if (computedWallet.total_revenue > wallet.total_revenue) return computedWallet;
		return wallet;
	}, [computedWallet, wallet]);
	const totalWithdrawn = (0, import_react.useMemo)(() => {
		return withdrawals.reduce((sum, w) => sum + (Number(w.amount) || 0), 0);
	}, [withdrawals]);
	const totalProfit = effectiveWallet.balance;
	const availableBalance = Math.max(0, totalProfit - totalWithdrawn);
	const requestWithdrawal = (0, import_react.useCallback)(async (amount, method, provider, accountNo) => {
		const todayStr = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
		const newRecord = {
			id: `aw-${Date.now()}`,
			date: todayStr,
			amount,
			method,
			provider,
			account_no: accountNo,
			status: "Berhasil",
			created_at: (/* @__PURE__ */ new Date()).toISOString()
		};
		setWithdrawals((prev) => {
			const next = [newRecord, ...prev];
			setCachedWithdrawals(next);
			return next;
		});
		window.dispatchEvent(new CustomEvent(UPDATE_EVENT));
		try {
			await supabase.from("admin_withdrawals").insert({
				id: newRecord.id,
				amount: newRecord.amount,
				method: newRecord.method,
				provider: newRecord.provider,
				account_no: newRecord.account_no,
				status: newRecord.status,
				created_at: newRecord.created_at
			});
		} catch {}
		return newRecord;
	}, []);
	return {
		wallet: effectiveWallet,
		totalRevenue: effectiveWallet.total_revenue,
		totalProfit,
		availableBalance,
		totalWithdrawn,
		totalBuzzerPayout: effectiveWallet.total_buzzer_payout,
		totalIncoming: effectiveWallet.total_incoming,
		completedJobsCount: effectiveWallet.completed_jobs_count,
		withdrawals,
		requestWithdrawal,
		loading: loading && jobsLoading,
		refetch: fetchWallet
	};
}
var isPendingPayment = (status) => [
	"menunggu verifikasi",
	"verifikasi",
	"pending",
	"menunggu pembayaran",
	"belum dibayar"
].includes((status || "").toLowerCase().trim());
var isApprovedPayment = (status) => [
	"berhasil",
	"lunas",
	"sukses"
].includes((status || "").toLowerCase().trim());
var isRejectedPayment = (status) => [
	"gagal",
	"refund",
	"ditolak",
	"batal",
	"dibatalkan"
].includes((status || "").toLowerCase().trim());
function statusClass(status) {
	if (status === "Menunggu Verifikasi" || status === "Verifikasi") return "bg-amber-500/10 text-amber-600 border border-amber-500/30 font-semibold";
	if (["Berhasil", "Lunas"].includes(status)) return "bg-emerald-500/10 text-emerald-600 border border-emerald-500/30 font-semibold";
	if (["Gagal", "Refund"].includes(status)) return "bg-rose-500/10 text-rose-600 border border-rose-500/30 font-semibold";
	return "bg-muted text-muted-foreground";
}
function statusLabel(status) {
	return status === "Menunggu Verifikasi" ? "Verifikasi" : status;
}
function AdminPaymentVerificationSection() {
	const { data: payments, loading, refetch } = usePayments();
	const { data: jobs, loading: jobsLoading } = useCampaignJobs();
	const { data: campaigns } = useCampaigns();
	const adminWallet = useAdminWallet();
	const loadingData = loading || jobsLoading;
	const [query, setQuery] = (0, import_react.useState)("");
	const [selected, setSelected] = (0, import_react.useState)(null);
	const [rejecting, setRejecting] = (0, import_react.useState)(null);
	const [reason, setReason] = (0, import_react.useState)("");
	const [busyId, setBusyId] = (0, import_react.useState)(null);
	const [approving, setApproving] = (0, import_react.useState)(null);
	const selectedJobSplits = (0, import_react.useMemo)(() => {
		if (!selected?.campaign_id) return [];
		return jobs.filter((job) => job.campaign_id === selected.campaign_id && job.buzzer_email).map((job) => ({
			job,
			split: calculateCampaignJobSplit(job)
		}));
	}, [jobs, selected]);
	const [paymentFilter, setPaymentFilter] = (0, import_react.useState)("semua");
	const pendingPayments = (0, import_react.useMemo)(() => payments.filter((payment) => isPendingPayment(payment.status)), [payments]);
	const approvedPayments = (0, import_react.useMemo)(() => payments.filter((payment) => isApprovedPayment(payment.status)), [payments]);
	const rejectedPayments = (0, import_react.useMemo)(() => payments.filter((payment) => isRejectedPayment(payment.status)), [payments]);
	const pendingTotalAmount = (0, import_react.useMemo)(() => pendingPayments.reduce((sum, p) => sum + Number(p.amount || 0), 0), [pendingPayments]);
	(0, import_react.useMemo)(() => approvedPayments.reduce((sum, p) => sum + Number(p.amount || 0), 0), [approvedPayments]);
	const filteredPayments = (0, import_react.useMemo)(() => {
		return payments.filter((payment) => {
			if (paymentFilter === "pending" && !isPendingPayment(payment.status)) return false;
			if (paymentFilter === "approved" && !isApprovedPayment(payment.status)) return false;
			if (paymentFilter === "rejected" && !isRejectedPayment(payment.status)) return false;
			if (query.trim()) {
				if (!`${payment.invoice_no} ${payment.customer_name} ${payment.customer_email || ""} ${payment.campaign_name} ${payment.method}`.toLowerCase().includes(query.toLowerCase())) return false;
			}
			return true;
		});
	}, [
		payments,
		paymentFilter,
		query
	]);
	const [paymentPage, setPaymentPage] = (0, import_react.useState)(1);
	const PAYMENT_PAGE_SIZE = 8;
	(0, import_react.useEffect)(() => {
		setPaymentPage(1);
	}, [paymentFilter, query]);
	const totalPaymentPages = Math.max(1, Math.ceil(filteredPayments.length / PAYMENT_PAGE_SIZE));
	const safePaymentPage = Math.min(Math.max(1, paymentPage), totalPaymentPages);
	const paginatedPayments = (0, import_react.useMemo)(() => {
		const start = (safePaymentPage - 1) * PAYMENT_PAGE_SIZE;
		return filteredPayments.slice(start, start + PAYMENT_PAGE_SIZE);
	}, [filteredPayments, safePaymentPage]);
	const approve = async (payment) => {
		setBusyId(payment.id);
		try {
			await approvePayment(payment.id);
			await notifyCustomerPaymentApproved(payment.customer_email, payment.campaign_name, payment.invoice_no);
			await refetch();
			toast.success(`Pembayaran ${payment.invoice_no} berhasil diverifikasi.`);
			setApproving(null);
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "Pembayaran gagal disetujui.");
		} finally {
			setBusyId(null);
		}
	};
	const reject = async () => {
		if (!rejecting || !reason.trim()) return;
		setBusyId(rejecting.id);
		try {
			await rejectPayment(rejecting.id, reason);
			await notifyCustomerPaymentRejected(rejecting.customer_email, rejecting.campaign_name, reason, rejecting.invoice_no);
			await refetch();
			toast.success(`Pembayaran ${rejecting.invoice_no} ditolak.`);
			setRejecting(null);
			setReason("");
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "Pembayaran gagal ditolak.");
		} finally {
			setBusyId(null);
		}
	};
	const [editPayment, setEditPayment] = (0, import_react.useState)(null);
	const [editPaymentForm, setEditPaymentForm] = (0, import_react.useState)({
		amount: 0,
		method: "BCA Transfer",
		note: "",
		status: "Lunas"
	});
	const [isSavingPayment, setIsSavingPayment] = (0, import_react.useState)(false);
	const [deletingPayment, setDeletingPayment] = (0, import_react.useState)(null);
	const [isDeletingPayment, setIsDeletingPayment] = (0, import_react.useState)(false);
	const handleOpenEditPayment = (p) => {
		setEditPaymentForm({
			amount: Number(p.amount || 0),
			method: p.method || "BCA Transfer",
			note: p.note || "",
			status: p.status || "Lunas"
		});
		setEditPayment(p);
	};
	const handleSaveEditPayment = async () => {
		if (!editPayment) return;
		if (!editPaymentForm.amount || editPaymentForm.amount <= 0) {
			toast.error("Nominal pembayaran harus lebih besar dari 0.");
			return;
		}
		setIsSavingPayment(true);
		try {
			await updatePayment(editPayment.id, {
				amount: Number(editPaymentForm.amount),
				method: editPaymentForm.method,
				note: editPaymentForm.note.trim() || null,
				status: editPaymentForm.status
			});
			await refetch();
			toast.success("Data pembayaran berhasil diperbarui.");
			setEditPayment(null);
			if (selected?.id === editPayment.id) setSelected((prev) => prev ? {
				...prev,
				amount: Number(editPaymentForm.amount),
				method: editPaymentForm.method,
				note: editPaymentForm.note.trim() || null,
				status: editPaymentForm.status
			} : null);
		} catch (err) {
			toast.error("Gagal memperbarui pembayaran: " + (err?.message || "Terjadi kesalahan"));
		} finally {
			setIsSavingPayment(false);
		}
	};
	const handleConfirmDeletePayment = async () => {
		if (!deletingPayment) return;
		setIsDeletingPayment(true);
		try {
			await deletePayment(deletingPayment.id);
			await refetch();
			toast.success(`Data pembayaran ${deletingPayment.invoice_no} berhasil dihapus.`);
			setDeletingPayment(null);
			if (selected?.id === deletingPayment.id) setSelected(null);
		} catch (err) {
			toast.error("Gagal menghapus pembayaran: " + (err?.message || "Terjadi kesalahan"));
		} finally {
			setIsDeletingPayment(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Total Pembayaran Masuk",
						value: formatIDR(adminWallet.totalIncoming),
						hint: `${approvedPayments.length} transaksi disetujui`,
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CreditCard, { className: "h-5 w-5" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-amber-500/30 bg-card p-5 shadow-sm transition-shadow hover:shadow-md",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs font-medium uppercase tracking-wide text-amber-600 dark:text-amber-400",
									children: "Menunggu Verifikasi"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "grid h-9 w-9 place-items-center rounded-lg bg-amber-500/15 text-amber-600 dark:text-amber-400",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-5 w-5" })
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-3 font-display text-2xl font-bold text-foreground",
								children: [pendingPayments.length, " Transaksi"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 text-xs text-muted-foreground",
								children: ["Total ", formatIDR(pendingTotalAmount)]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Total Komisi Platform",
						value: formatIDR(adminWallet.totalProfit),
						hint: "Omset bersih platform dari campaign",
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DollarSign, { className: "h-5 w-5" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Pembayaran Ditolak / Gagal",
						value: `${rejectedPayments.length} Transaksi`,
						hint: "Transaksi dibatalkan atau bukti tidak valid",
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-5 w-5" })
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-display text-xl font-bold",
								children: "Daftar Verifikasi Pembayaran"
							}), pendingPayments.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "rounded-full bg-amber-500/15 text-amber-600 border border-amber-500/30 px-2.5 py-0.5 text-xs font-bold",
								children: [pendingPayments.length, " Verifikasi"]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-muted-foreground",
							children: "Verifikasi transfer pembayaran dari customer sebelum campaign dibuka untuk buzzer."
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							size: "sm",
							onClick: () => void refetch(),
							disabled: loadingData,
							className: "gap-2 shrink-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: `h-4 w-4 ${loadingData ? "animate-spin" : ""}` }), "Refresh"]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border pb-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Funnel, { className: "h-4 w-4 text-muted-foreground" }), [
								[
									"semua",
									"Semua",
									payments.length
								],
								[
									"pending",
									"Menunggu",
									pendingPayments.length
								],
								[
									"approved",
									"Disetujui",
									approvedPayments.length
								],
								[
									"rejected",
									"Ditolak",
									rejectedPayments.length
								]
							].map(([value, label, count]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => setPaymentFilter(value),
								className: cn("rounded-full border px-3 py-1 text-xs font-medium transition-colors", paymentFilter === value ? "border-transparent gradient-brand text-brand-foreground shadow-sm" : "border-border text-muted-foreground hover:bg-muted hover:text-foreground"),
								children: [
									label,
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "ml-1 opacity-70",
										children: [
											"(",
											count,
											")"
										]
									})
								]
							}, value))]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative w-full sm:w-72",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								placeholder: "Cari invoice, customer, atau campaign...",
								value: query,
								onChange: (event) => setQuery(event.target.value),
								className: "pl-9 h-9 text-xs"
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "rounded-xl border border-border overflow-x-auto",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, {
							className: "w-full text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, {
								className: "bg-muted/40",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
										className: "w-[125px] py-2.5 px-3 whitespace-nowrap",
										children: "Invoice"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
										className: "py-2.5 px-3 min-w-[120px] max-w-[150px]",
										children: "Customer"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
										className: "py-2.5 px-3 min-w-[100px] max-w-[130px]",
										children: "Campaign"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
										className: "py-2.5 px-3 min-w-[110px] max-w-[140px]",
										children: "Metode"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
										className: "py-2.5 px-3 whitespace-nowrap",
										children: "Nominal"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
										className: "py-2.5 px-3 text-center w-[90px]",
										children: "Status"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
										className: "py-2.5 px-3 text-right w-[160px] whitespace-nowrap",
										children: "Aksi"
									})
								]
							}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableBody, { children: [paginatedPayments.map((payment) => {
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, {
									className: "hover:bg-muted/30",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
											className: "font-mono text-xs font-semibold py-2.5 px-3 whitespace-nowrap",
											children: payment.invoice_no
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
											className: "py-2.5 px-3",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "min-w-0 max-w-[150px]",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "font-medium text-foreground truncate",
													children: payment.customer_name
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-[11px] text-muted-foreground truncate",
													children: payment.customer_email || "-"
												})]
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
											className: "py-2.5 px-3 max-w-[130px]",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "truncate font-medium text-foreground",
												title: payment.campaign_name,
												children: payment.campaign_name
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
											className: "py-2.5 px-3 max-w-[140px]",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-medium truncate block text-foreground",
												title: payment.method,
												children: payment.method
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
											className: "font-semibold text-foreground py-2.5 px-3 whitespace-nowrap",
											children: formatIDR(Number(payment.amount))
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
											className: "py-2.5 px-3 text-center whitespace-nowrap",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: `inline-block rounded-full px-2 py-0.5 text-[11px] ${statusClass(payment.status)}`,
												children: statusLabel(payment.status)
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
											className: "text-right py-2.5 px-3 whitespace-nowrap",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center justify-end gap-1",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
														size: "sm",
														variant: "ghost",
														className: "h-7 w-7 p-0",
														title: "Detail",
														"aria-label": "Detail",
														onClick: () => setSelected(payment),
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-3.5 w-3.5" })
													}),
													isPendingPayment(payment.status) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
														size: "sm",
														className: "h-7 w-7 p-0 bg-emerald-600 hover:bg-emerald-700 text-white transition-all",
														disabled: busyId === payment.id,
														onClick: () => setApproving(payment),
														title: "Setujui Pembayaran",
														"aria-label": "Setujui Pembayaran",
														children: busyId === payment.id ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-3.5 w-3.5 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3.5 w-3.5" })
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
														size: "sm",
														variant: "outline",
														className: "h-7 w-7 p-0 text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition-all",
														disabled: busyId === payment.id,
														onClick: () => setRejecting(payment),
														title: "Tolak Pembayaran",
														"aria-label": "Tolak Pembayaran",
														children: busyId === payment.id ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-3.5 w-3.5 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-3.5 w-3.5" })
													})] }),
													isApprovedPayment(payment.status) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
														size: "sm",
														variant: "outline",
														className: "h-7 w-7 p-0 text-primary hover:bg-primary/10",
														onClick: () => handleOpenEditPayment(payment),
														title: "Edit",
														"aria-label": "Edit",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "h-3 w-3" })
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
														size: "sm",
														variant: "outline",
														className: "h-7 w-7 p-0 text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/20",
														onClick: () => setDeletingPayment(payment),
														title: "Hapus",
														"aria-label": "Hapus",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3 w-3" })
													})] }),
													isRejectedPayment(payment.status) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
														size: "sm",
														variant: "outline",
														className: "h-7 w-7 p-0 text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/20",
														onClick: () => setDeletingPayment(payment),
														title: "Hapus",
														"aria-label": "Hapus",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3 w-3" })
													})
												]
											})
										})
									]
								}, payment.id);
							}), filteredPayments.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
								colSpan: 7,
								className: "py-10 text-center text-sm text-muted-foreground",
								children: query.trim() ? `Tidak ditemukan pembayaran yang sesuai dengan pencarian "${query}".` : paymentFilter === "pending" ? "Belum ada pembayaran yang menunggu verifikasi." : paymentFilter === "approved" ? "Belum ada riwayat pembayaran yang disetujui." : paymentFilter === "rejected" ? "Belum ada pembayaran yang ditolak." : "Tidak ada data pembayaran."
							}) })] })]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TablePagination$1, {
						currentPage: safePaymentPage,
						totalItems: filteredPayments.length,
						pageSize: PAYMENT_PAGE_SIZE,
						onPageChange: setPaymentPage
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: !!selected,
				onOpenChange: (open) => !open && setSelected(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "max-w-md",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Detail Pembayaran" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Detail transaksi pembayaran customer untuk campaign." })] }),
						selected && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-4 text-xs",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-2 gap-2 rounded-lg bg-muted/40 p-3 border border-border",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground block text-[11px]",
											children: "Invoice"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-mono font-semibold",
											children: selected.invoice_no
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground block text-[11px]",
											children: "Status"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: `inline-block rounded-full px-2 py-0.5 text-[11px] mt-0.5 ${statusClass(selected.status)}`,
											children: selected.status
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground block text-[11px]",
											children: "Customer"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-medium text-foreground",
											children: selected.customer_name
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground block text-[11px]",
											children: "Email Customer"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-medium text-foreground truncate block",
											children: selected.customer_email || "-"
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground block text-[11px]",
											children: "Metode Pembayaran"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-medium text-foreground",
											children: selected.method
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground block text-[11px]",
											children: "Nominal Transaksi"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-bold text-foreground text-sm",
											children: formatIDR(Number(selected.amount))
										})] })
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted-foreground block text-[11px]",
									children: "Campaign"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-semibold text-foreground text-sm block mt-0.5",
									children: selected.campaign_name
								})] }),
								selected.note && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-lg bg-muted/30 p-2.5 border border-border",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground block text-[11px]",
										children: "Catatan / Instruksi"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-0.5 text-foreground",
										children: selected.note
									})]
								}),
								selected.rejection_reason && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-lg bg-rose-500/10 p-2.5 border border-rose-500/30 text-rose-700 dark:text-rose-300",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-semibold block text-[11px]",
										children: "Alasan Penolakan"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-0.5",
										children: selected.rejection_reason
									})]
								}),
								selectedJobSplits.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5 pt-2 border-t border-border",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h4", {
										className: "font-semibold text-foreground",
										children: [
											"Buzzer Terkait (",
											selectedJobSplits.length,
											")"
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "max-h-36 overflow-y-auto space-y-1 pr-1",
										children: selectedJobSplits.map(({ job, split }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-between p-2 rounded border border-border bg-card",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "font-medium text-foreground",
												children: job.buzzer_name || job.buzzer_email
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "text-[10px] text-muted-foreground",
												children: [
													"Level ",
													job.buzzer_level || split.levelName || "Bronze",
													" · Status: ",
													job.status
												]
											})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "text-right",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "font-semibold text-emerald-600",
													children: formatIDR(split.buzzerShare)
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
													className: "text-[10px] text-muted-foreground",
													children: ["Admin: ", formatIDR(split.adminShare)]
												})]
											})]
										}, job.id))
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							onClick: () => setSelected(null),
							children: "Tutup"
						}), selected && isPendingPayment(selected.status) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							className: "bg-emerald-600 hover:bg-emerald-700 text-white gap-1",
							disabled: busyId === selected.id,
							onClick: () => {
								const p = selected;
								setSelected(null);
								approve(p);
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4" }), " Setujui Pembayaran"]
						})] })
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialog, {
				open: !!approving,
				onOpenChange: (open) => !open && setApproving(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogTitle, {
					className: "flex items-center gap-2 text-emerald-600",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-5 w-5" }), " Setujui Pembayaran?"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogDescription, { children: [
					"Apakah Anda yakin ingin menyetujui pembayaran invoice ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: approving?.invoice_no }),
					" sebesar ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: formatIDR(Number(approving?.amount || 0)) }),
					" dari ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: approving?.customer_name }),
					"?",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
					"Setelah disetujui, campaign ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: approving?.campaign_name }),
					" akan otomatis aktif dan terbuka untuk diambil oleh buzzer."
				] })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogCancel, { children: "Batal" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogAction, {
					className: "bg-emerald-600 hover:bg-emerald-700 text-white",
					onClick: () => approving && void approve(approving),
					children: "Ya, Setujui Pembayaran"
				})] })] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: !!rejecting,
				onOpenChange: (open) => {
					if (!open) {
						setRejecting(null);
						setReason("");
					}
				},
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "max-w-md",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
							className: "flex items-center gap-2 text-rose-600",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-5 w-5" }), " Tolak Pembayaran"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogDescription, { children: [
							"Berikan alasan penolakan pembayaran untuk invoice ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: rejecting?.invoice_no }),
							". Customer akan menerima notifikasi alasan ini."
						] })] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "space-y-3 pt-1",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "reject-reason",
								children: "Alasan Penolakan"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								id: "reject-reason",
								rows: 3,
								placeholder: "Contoh: Bukti transfer tidak terbaca / nominal tidak sesuai / mutasi belum masuk...",
								value: reason,
								onChange: (e) => setReason(e.target.value)
							})] })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							onClick: () => {
								setRejecting(null);
								setReason("");
							},
							children: "Batal"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "destructive",
							disabled: !reason.trim() || busyId === rejecting?.id,
							onClick: () => void reject(),
							children: busyId === rejecting?.id ? "Memproses..." : "Tolak Pembayaran"
						})] })
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: !!editPayment,
				onOpenChange: (open) => !open && setEditPayment(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "max-w-md",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "h-4 w-4 text-primary" }), " Edit Data Pembayaran"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogDescription, { children: [
							"Perbarui rincian transaksi invoice ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: editPayment?.invoice_no }),
							"."
						] })] }),
						editPayment && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-3 text-xs",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "edit-nominal",
										children: "Nominal Pembayaran (Rp)"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "edit-nominal",
										type: "number",
										min: 1,
										value: editPaymentForm.amount || "",
										onChange: (e) => setEditPaymentForm({
											...editPaymentForm,
											amount: Number(e.target.value)
										})
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "edit-method",
										children: "Metode Pembayaran"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "edit-method",
										value: editPaymentForm.method,
										onChange: (e) => setEditPaymentForm({
											...editPaymentForm,
											method: e.target.value
										}),
										placeholder: "Contoh: Transfer Bank BCA / QRIS"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "edit-status",
										children: "Status Pembayaran"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
										value: editPaymentForm.status,
										onValueChange: (val) => setEditPaymentForm({
											...editPaymentForm,
											status: val
										}),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
											id: "edit-status",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "Lunas",
												children: "Lunas / Berhasil"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "Menunggu Verifikasi",
												children: "Menunggu Verifikasi"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "Gagal",
												children: "Gagal / Ditolak"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "Refund",
												children: "Refund"
											})
										] })]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "edit-note",
										children: "Catatan Transaksi"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
										id: "edit-note",
										rows: 2,
										value: editPaymentForm.note,
										onChange: (e) => setEditPaymentForm({
											...editPaymentForm,
											note: e.target.value
										}),
										placeholder: "Catatan admin opsional..."
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							onClick: () => setEditPayment(null),
							disabled: isSavingPayment,
							children: "Batal"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							onClick: handleSaveEditPayment,
							disabled: isSavingPayment,
							className: "gap-1.5 gradient-brand text-brand-foreground",
							children: [isSavingPayment ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-3.5 w-3.5 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "h-3.5 w-3.5" }), isSavingPayment ? "Menyimpan..." : "Simpan Perubahan"]
						})] })
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialog, {
				open: !!deletingPayment,
				onOpenChange: (open) => {
					if (!open && !isDeletingPayment) setDeletingPayment(null);
				},
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogTitle, {
					className: "flex items-center gap-2 text-rose-600",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-5 w-5" }), " Hapus Data Pembayaran?"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogDescription, { children: [
					"Apakah Anda yakin ingin menghapus data pembayaran invoice ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: deletingPayment?.invoice_no }),
					" (",
					formatIDR(Number(deletingPayment?.amount || 0)),
					") untuk campaign ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: deletingPayment?.campaign_name }),
					"?",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
					"Data yang sudah dihapus tidak dapat dipulihkan kembali dari sistem transaksi."
				] })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogCancel, {
					disabled: isDeletingPayment,
					children: "Batal"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "destructive",
					className: "gap-1.5",
					disabled: isDeletingPayment,
					onClick: handleConfirmDeletePayment,
					children: isDeletingPayment ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }), "Menghapus..."] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" }), "Ya, Hapus Pembayaran"] })
				})] })] })
			})
		]
	});
}
function AdminPayoutVerificationSection() {
	const { data: dbWithdrawals, loading: dbLoading, refetch } = useWithdrawals();
	const [localWithdrawals, setLocalWithdrawals] = (0, import_react.useState)(() => {
		try {
			return listAllWithdrawals();
		} catch {
			return [];
		}
	});
	(0, import_react.useEffect)(() => {
		const handleStorage = () => {
			try {
				setLocalWithdrawals(listAllWithdrawals());
			} catch {
				setLocalWithdrawals([]);
			}
		};
		window.addEventListener("buzzhub:buzzer_updated", handleStorage);
		window.addEventListener("storage", handleStorage);
		return () => {
			window.removeEventListener("buzzhub:buzzer_updated", handleStorage);
			window.removeEventListener("storage", handleStorage);
		};
	}, []);
	const allWithdrawals = (0, import_react.useMemo)(() => {
		const map = /* @__PURE__ */ new Map();
		if (Array.isArray(dbWithdrawals)) {
			for (const w of dbWithdrawals) if (w && w.id) map.set(w.id, w);
		}
		if (Array.isArray(localWithdrawals)) {
			for (const lw of localWithdrawals) if (lw && lw.id && !map.has(lw.id)) map.set(lw.id, {
				id: lw.id,
				buzzer_name: lw.buzzerName || "Buzzer",
				buzzer_email: lw.buzzerEmail || "",
				amount: lw.amount,
				method: lw.method,
				account_no: lw.accountNo || lw.method,
				status: lw.status === "Pending" ? "Menunggu" : lw.status,
				proof_url: lw.proofUrl || null,
				admin_note: lw.adminNote || null,
				requested_at: lw.requestedAt || lw.date,
				approved_at: lw.status === "Berhasil" ? lw.completedAt || lw.date : null,
				completed_at: lw.status === "Berhasil" ? lw.completedAt || lw.date : null,
				created_at: lw.requestedAt || lw.date,
				updated_at: lw.completedAt || lw.date
			});
		}
		return Array.from(map.values()).sort((a, b) => {
			const timeA = new Date(a.requested_at || a.created_at).getTime();
			return new Date(b.requested_at || b.created_at).getTime() - timeA;
		});
	}, [dbWithdrawals, localWithdrawals]);
	const [query, setQuery] = (0, import_react.useState)("");
	const [statusFilter, setStatusFilter] = (0, import_react.useState)("all");
	const [dateFrom, setDateFrom] = (0, import_react.useState)("");
	const [dateTo, setDateTo] = (0, import_react.useState)("");
	const [page, setPage] = (0, import_react.useState)(1);
	const PAGE_SIZE = 8;
	const [verifyingItem, setVerifyingItem] = (0, import_react.useState)(null);
	const [rejectingItem, setRejectingItem] = (0, import_react.useState)(null);
	const [editingItem, setEditingItem] = (0, import_react.useState)(null);
	const [deletingItem, setDeletingItem] = (0, import_react.useState)(null);
	const [adminNote, setAdminNote] = (0, import_react.useState)("");
	const [isTransferChecked, setIsTransferChecked] = (0, import_react.useState)(false);
	const [actionLoading, setActionLoading] = (0, import_react.useState)(false);
	const [rejectionReason, setRejectionReason] = (0, import_react.useState)("");
	const [editStatus, setEditStatus] = (0, import_react.useState)("Menunggu");
	const [editAmount, setEditAmount] = (0, import_react.useState)("");
	const [editMethod, setEditMethod] = (0, import_react.useState)("");
	const [editAccountNo, setEditAccountNo] = (0, import_react.useState)("");
	const [editAdminNote, setEditAdminNote] = (0, import_react.useState)("");
	const pendingList = (0, import_react.useMemo)(() => {
		return allWithdrawals.filter((w) => [
			"menunggu",
			"pending",
			"diproses"
		].includes((w.status || "").toLowerCase()));
	}, [allWithdrawals]);
	const approvedList = (0, import_react.useMemo)(() => {
		return allWithdrawals.filter((w) => ["berhasil", "disetujui"].includes((w.status || "").toLowerCase()));
	}, [allWithdrawals]);
	const rejectedList = (0, import_react.useMemo)(() => {
		return allWithdrawals.filter((w) => (w.status || "").toLowerCase() === "ditolak");
	}, [allWithdrawals]);
	const totalPendingAmount = (0, import_react.useMemo)(() => pendingList.reduce((sum, w) => sum + Number(w.amount || 0), 0), [pendingList]);
	const totalApprovedAmount = (0, import_react.useMemo)(() => approvedList.reduce((sum, w) => sum + Number(w.amount || 0), 0), [approvedList]);
	const totalRejectedAmount = (0, import_react.useMemo)(() => rejectedList.reduce((sum, w) => sum + Number(w.amount || 0), 0), [rejectedList]);
	const filteredList = (0, import_react.useMemo)(() => {
		return allWithdrawals.filter((w) => {
			const st = (w.status || "").toLowerCase();
			if (statusFilter === "pending" && ![
				"menunggu",
				"pending",
				"diproses"
			].includes(st)) return false;
			if (statusFilter === "approved" && !["berhasil", "disetujui"].includes(st)) return false;
			if (statusFilter === "rejected" && st !== "ditolak") return false;
			if (dateFrom) {
				if ((w.requested_at || w.created_at || "").slice(0, 10) < dateFrom) return false;
			}
			if (dateTo) {
				if ((w.requested_at || w.created_at || "").slice(0, 10) > dateTo) return false;
			}
			if (query.trim()) {
				const q = query.toLowerCase();
				if (!((w.buzzer_name || "").toLowerCase().includes(q) || (w.buzzer_email || "").toLowerCase().includes(q) || (w.method || "").toLowerCase().includes(q) || (w.account_no || "").toLowerCase().includes(q) || (w.admin_note || "").toLowerCase().includes(q))) return false;
			}
			return true;
		});
	}, [
		allWithdrawals,
		statusFilter,
		dateFrom,
		dateTo,
		query
	]);
	(0, import_react.useEffect)(() => {
		setPage(1);
	}, [
		statusFilter,
		dateFrom,
		dateTo,
		query
	]);
	const totalPages = Math.max(1, Math.ceil(filteredList.length / PAGE_SIZE));
	const safePage = Math.min(Math.max(1, page), totalPages);
	const paginatedList = (0, import_react.useMemo)(() => {
		const start = (safePage - 1) * PAGE_SIZE;
		return filteredList.slice(start, start + PAGE_SIZE);
	}, [filteredList, safePage]);
	const copyToClipboard = (text, label) => {
		if (!text) return;
		navigator.clipboard.writeText(text);
		toast.success(`${label} berhasil disalin ke clipboard`);
	};
	const openApproveModal = (w) => {
		setVerifyingItem(w);
		setAdminNote(w.admin_note || "");
		setIsTransferChecked(false);
	};
	const handleApprove = async () => {
		if (!verifyingItem) return;
		if (!isTransferChecked) return toast.error("Silakan centang konfirmasi bahwa transfer telah selesai dilakukan.");
		setActionLoading(true);
		try {
			await updateWithdrawalStatus(verifyingItem.id, "Berhasil", adminNote.trim() || void 0);
			toast.success(`Pencairan dana sebesar ${formatIDR(Number(verifyingItem.amount))} berhasil diverifikasi & disetujui!`);
			setVerifyingItem(null);
			refetch();
			setLocalWithdrawals(listAllWithdrawals());
		} catch (err) {
			console.error(err);
			toast.error("Gagal menyetujui pencairan: " + (err?.message || "Terjadi kesalahan"));
		} finally {
			setActionLoading(false);
		}
	};
	const openRejectModal = (w) => {
		setRejectingItem(w);
		setRejectionReason("");
	};
	const handleReject = async () => {
		if (!rejectingItem) return;
		if (!rejectionReason.trim()) return toast.error("Alasan penolakan pencairan wajib diisi agar buzzer dapat memperbaiki informasinya.");
		setActionLoading(true);
		try {
			await updateWithdrawalStatus(rejectingItem.id, "Ditolak", rejectionReason.trim());
			toast.success(`Pengajuan pencairan sebesar ${formatIDR(Number(rejectingItem.amount))} telah ditolak. Saldo tetap aman di akun buzzer.`);
			setRejectingItem(null);
			refetch();
			setLocalWithdrawals(listAllWithdrawals());
		} catch (err) {
			console.error(err);
			toast.error("Gagal menolak pencairan: " + (err?.message || "Terjadi kesalahan"));
		} finally {
			setActionLoading(false);
		}
	};
	const openEditModal = (w) => {
		setEditingItem(w);
		setEditStatus((w.status === "Pending" ? "Menunggu" : w.status) || "Menunggu");
		setEditAmount(String(w.amount || 0));
		setEditMethod(w.method || "");
		setEditAccountNo(w.account_no || "");
		setEditAdminNote(w.admin_note || "");
	};
	const handleSaveEdit = async () => {
		if (!editingItem) return;
		const num = Number(editAmount);
		if (isNaN(num) || num < 0) return toast.error("Nominal pencairan tidak valid");
		setActionLoading(true);
		try {
			await editWithdrawalRecord(editingItem.id, {
				status: editStatus,
				amount: num,
				method: editMethod.trim() || editingItem.method,
				account_no: editAccountNo.trim() || editingItem.account_no,
				admin_note: editAdminNote.trim() || void 0
			}, editingItem.buzzer_email);
			toast.success("Data pencairan berhasil diperbarui.");
			setEditingItem(null);
			refetch();
			setLocalWithdrawals(listAllWithdrawals());
		} catch (err) {
			console.error(err);
			toast.error("Gagal memperbarui data: " + (err?.message || "Terjadi kesalahan"));
		} finally {
			setActionLoading(false);
		}
	};
	const openDeleteModal = (w) => {
		setDeletingItem(w);
	};
	const handleConfirmDelete = async () => {
		if (!deletingItem) return;
		setActionLoading(true);
		try {
			await deleteWithdrawalRecord(deletingItem.id, deletingItem.buzzer_email);
			toast.success("Riwayat pencairan berhasil dihapus.");
			setDeletingItem(null);
			refetch();
			setLocalWithdrawals(listAllWithdrawals());
		} catch (err) {
			console.error(err);
			toast.error("Gagal menghapus riwayat: " + (err?.message || "Terjadi kesalahan"));
		} finally {
			setActionLoading(false);
		}
	};
	const parseAccountDetails = (method, accountNo) => {
		return {
			isEwallet: [
				"dana",
				"gopay",
				"shopeepay",
				"ovo"
			].some((ew) => method.toLowerCase().includes(ew)),
			provider: method.split("•")[0]?.trim() || method,
			accountDetails: accountNo || method
		};
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-amber-500/30 bg-card p-5 shadow-sm transition-shadow hover:shadow-md relative overflow-hidden",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "relative flex h-2.5 w-2.5",
										children: [pendingList.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500" })]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs font-semibold uppercase tracking-wide text-amber-600 dark:text-amber-400",
										children: "Menunggu Verifikasi"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "grid h-9 w-9 place-items-center rounded-lg bg-amber-500/15 text-amber-600 dark:text-amber-400",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-5 w-5" })
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-3 font-display text-2xl font-bold text-foreground",
								children: [pendingList.length, " Permintaan"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 text-xs text-muted-foreground font-medium",
								children: ["Total ", formatIDR(totalPendingAmount)]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-emerald-500/30 bg-card p-5 shadow-sm transition-shadow hover:shadow-md",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs font-semibold uppercase tracking-wide text-emerald-600 dark:text-emerald-400",
									children: "Pencairan Selesai"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "grid h-9 w-9 place-items-center rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-5 w-5" })
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-3 font-display text-2xl font-bold text-foreground",
								children: [approvedList.length, " Selesai"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 text-xs text-muted-foreground font-medium",
								children: ["Total ", formatIDR(totalApprovedAmount)]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-rose-500/30 bg-card p-5 shadow-sm transition-shadow hover:shadow-md",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs font-semibold uppercase tracking-wide text-rose-600 dark:text-rose-400",
									children: "Pengajuan Ditolak"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "grid h-9 w-9 place-items-center rounded-lg bg-rose-500/15 text-rose-600 dark:text-rose-400",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-5 w-5" })
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-3 font-display text-2xl font-bold text-foreground",
								children: [rejectedList.length, " Ditolak"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 text-xs text-muted-foreground font-medium",
								children: [
									"Saldo ",
									formatIDR(totalRejectedAmount),
									" dikembalikan"
								]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Total Dana Dicairkan",
						value: formatIDR(totalApprovedAmount),
						hint: `${allWithdrawals.length} total pengajuan riwayat`,
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wallet, { className: "h-5 w-5" })
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-display text-xl font-bold",
								children: "Verifikasi Pencairan Dana Buzzer"
							}), pendingList.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "rounded-full bg-amber-500/15 text-amber-600 border border-amber-500/30 px-2.5 py-0.5 text-xs font-bold",
								children: [pendingList.length, " Menunggu Verifikasi"]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-muted-foreground",
							children: "Verifikasi rekening buzzer dan lakukan transfer dana pencairan."
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: "outline",
									size: "sm",
									onClick: () => {
										refetch();
										setLocalWithdrawals(listAllWithdrawals());
										toast.success("Data pencairan diperbarui");
									},
									disabled: dbLoading,
									className: "gap-2 shrink-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: `h-4 w-4 ${dbLoading ? "animate-spin" : ""}` }), "Refresh"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: "outline",
									size: "sm",
									className: "gap-1.5",
									onClick: () => {
										exportToExcel("verifikasi-pencairan-buzzer", "Pencairan Buzzer", filteredList, [
											{
												header: "Tanggal",
												accessor: (w) => (w.requested_at || w.created_at || "").slice(0, 16)
											},
											{
												header: "Nama Buzzer",
												accessor: (w) => w.buzzer_name
											},
											{
												header: "Email Buzzer",
												accessor: (w) => w.buzzer_email
											},
											{
												header: "Metode / Bank",
												accessor: (w) => w.method
											},
											{
												header: "No. Rekening / E-Wallet",
												accessor: (w) => w.account_no
											},
											{
												header: "Nominal (Rp)",
												accessor: (w) => w.amount
											},
											{
												header: "Status",
												accessor: (w) => w.status
											},
											{
												header: "Catatan Admin",
												accessor: (w) => w.admin_note || "-"
											}
										]);
										toast.success("Data pencairan berhasil diekspor ke Excel");
									},
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileSpreadsheet, { className: "h-4 w-4" }), " Excel"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: "outline",
									size: "sm",
									className: "gap-1.5",
									onClick: () => {
										const totalW = filteredList.reduce((a, w) => a + Number(w.amount || 0), 0);
										exportToPDF("verifikasi-pencairan-buzzer", "Laporan Verifikasi Pencairan Dana Buzzer", filteredList, [
											{
												header: "Tanggal",
												accessor: (w) => (w.requested_at || w.created_at || "").slice(0, 10)
											},
											{
												header: "Buzzer",
												accessor: (w) => `${w.buzzer_name} (${w.buzzer_email})`
											},
											{
												header: "Rekening Tujuan",
												accessor: (w) => `${w.method} - ${w.account_no}`
											},
											{
												header: "Nominal (Rp)",
												accessor: (w) => formatIDR(Number(w.amount))
											},
											{
												header: "Status",
												accessor: (w) => w.status
											}
										], [{
											label: "Total Transaksi Ditampilkan",
											value: `${filteredList.length} transaksi`
										}, {
											label: "Total Nominal",
											value: formatIDR(totalW)
										}]);
										toast.success("Laporan pencairan berhasil diekspor ke PDF");
									},
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileDown, { className: "h-4 w-4" }), " PDF"]
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border pb-4 pt-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Funnel, { className: "h-4 w-4 text-muted-foreground mr-1" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => setStatusFilter("all"),
									className: cn("rounded-lg px-3 py-1.5 text-xs font-semibold transition-all", statusFilter === "all" ? "gradient-brand text-brand-foreground shadow-sm" : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"),
									children: [
										"Semua (",
										allWithdrawals.length,
										")"
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => setStatusFilter("pending"),
									className: cn("rounded-lg px-3 py-1.5 text-xs font-semibold transition-all flex items-center gap-1.5", statusFilter === "pending" ? "bg-amber-500 text-white shadow-sm" : "bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20"),
									children: ["Menunggu Verifikasi", pendingList.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "rounded-full bg-white/20 px-1.5 py-0.2 text-[10px] font-bold",
										children: pendingList.length
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => setStatusFilter("approved"),
									className: cn("rounded-lg px-3 py-1.5 text-xs font-semibold transition-all", statusFilter === "approved" ? "bg-emerald-600 text-white shadow-sm" : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20"),
									children: [
										"Selesai / Berhasil (",
										approvedList.length,
										")"
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => setStatusFilter("rejected"),
									className: cn("rounded-lg px-3 py-1.5 text-xs font-semibold transition-all", statusFilter === "rejected" ? "bg-rose-600 text-white shadow-sm" : "bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-500/20"),
									children: [
										"Ditolak (",
										rejectedList.length,
										")"
									]
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative w-full sm:w-72",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								placeholder: "Cari buzzer, rekening, bank...",
								value: query,
								onChange: (e) => setQuery(e.target.value),
								className: "pl-9 h-9 text-xs"
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-end gap-3 rounded-xl border border-border/70 bg-muted/20 p-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									className: "text-xs text-muted-foreground",
									children: "Dari Tanggal"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "date",
									value: dateFrom,
									onChange: (e) => setDateFrom(e.target.value),
									className: "h-8 text-xs w-36"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									className: "text-xs text-muted-foreground",
									children: "Sampai Tanggal"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "date",
									value: dateTo,
									onChange: (e) => setDateTo(e.target.value),
									className: "h-8 text-xs w-36"
								})]
							}),
							(dateFrom || dateTo || query) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "ghost",
								size: "sm",
								className: "h-8 text-xs text-muted-foreground hover:text-foreground",
								onClick: () => {
									setDateFrom("");
									setDateTo("");
									setQuery("");
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "mr-1 h-3 w-3" }), " Reset Filter"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "ml-auto text-xs text-muted-foreground self-center",
								children: [
									"Menampilkan ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: paginatedList.length }),
									" dari ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: filteredList.length }),
									" pengajuan"
								]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "overflow-hidden rounded-2xl border border-border bg-card",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, {
							className: "bg-muted/40",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Tanggal Pengajuan" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Buzzer" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Tujuan Transfer (Rekening/E-Wallet)" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
									className: "text-right",
									children: "Nominal"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
									className: "text-center",
									children: "Status"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Catatan Admin" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
									className: "text-right",
									children: "Aksi"
								})
							]
						}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableBody, { children: [paginatedList.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
							colSpan: 7,
							className: "py-12 text-center text-muted-foreground",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col items-center justify-center gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wallet, { className: "h-8 w-8 text-muted-foreground/40" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-semibold text-sm",
										children: "Tidak ada permintaan pencairan dana"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted-foreground",
										children: statusFilter !== "all" ? `Tidak ditemukan pencairan dengan filter status "${statusFilter}".` : "Belum ada riwayat permohonan pencairan dari buzzer."
									})
								]
							})
						}) }), paginatedList.map((w) => {
							const { isEwallet, provider, accountDetails } = parseAccountDetails(w.method, w.account_no);
							const isPending = [
								"menunggu",
								"pending",
								"diproses"
							].includes((w.status || "").toLowerCase());
							["berhasil", "disetujui"].includes((w.status || "").toLowerCase());
							const isRejected = (w.status || "").toLowerCase() === "ditolak";
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, {
								className: "hover:bg-muted/30 transition-colors",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, {
										className: "align-top py-3 text-xs whitespace-nowrap",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "font-semibold text-foreground",
											children: (w.requested_at || w.created_at || "").slice(0, 10)
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-3 w-3" }),
												(w.requested_at || w.created_at || "").slice(11, 16) || "12:00",
												" WIB"
											]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
										className: "align-top py-3",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar, {
												className: "h-8 w-8 rounded-lg border border-border",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarFallback, {
													className: "text-[11px] font-bold gradient-brand text-brand-foreground",
													children: (w.buzzer_name || "BZ").slice(0, 2).toUpperCase()
												})
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "min-w-0",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-xs font-bold text-foreground truncate",
													children: w.buzzer_name || "Buzzer"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-[11px] text-muted-foreground truncate",
													children: w.buzzer_email
												})]
											})]
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
										className: "align-top py-3",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "flex items-center gap-1.5",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: cn("inline-flex items-center gap-1 rounded px-2 py-0.5 text-[10px] font-bold uppercase", isEwallet ? "bg-cyan-500/10 text-cyan-600 border border-cyan-500/20" : "bg-indigo-500/10 text-indigo-600 border border-indigo-500/20"),
													children: [isEwallet ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Smartphone, { className: "h-3 w-3" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { className: "h-3 w-3" }), provider]
												})
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-1.5 font-mono text-xs font-semibold text-foreground",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: accountDetails }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													type: "button",
													onClick: () => copyToClipboard(accountDetails.split(" ")[0], "Nomor rekening"),
													title: "Salin nomor",
													className: "text-muted-foreground hover:text-foreground transition-colors p-0.5 rounded hover:bg-muted",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "h-3 w-3" })
												})]
											})]
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
										className: "align-top py-3 text-right",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-display text-sm font-bold text-emerald-600 dark:text-emerald-400",
											children: formatIDR(Number(w.amount))
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
										className: "align-top py-3 text-center",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: w.status === "Menunggu" ? "Menunggu Verifikasi" : w.status })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
										className: "align-top py-3 text-xs max-w-[200px]",
										children: w.admin_note ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: cn("rounded p-1.5 text-[11px] line-clamp-2", isRejected ? "bg-rose-500/10 text-rose-700 dark:text-rose-300 border border-rose-500/20" : "bg-muted/60 text-muted-foreground"),
											title: w.admin_note,
											children: isRejected ? `Alasan: ${w.admin_note}` : w.admin_note
										}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[11px] text-muted-foreground italic",
											children: "-"
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
										className: "align-top py-3 text-right",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-end gap-1.5",
											children: [
												isPending && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
													size: "sm",
													variant: "outline",
													className: "h-8 w-8 p-0 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800",
													onClick: () => openApproveModal(w),
													title: "Verifikasi & Setujui",
													"aria-label": "Verifikasi & Setujui",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4" })
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
													size: "sm",
													variant: "outline",
													className: "h-8 w-8 p-0 text-amber-600 hover:text-amber-700 hover:bg-amber-50 dark:hover:bg-amber-950/20 border-amber-300 dark:border-amber-800",
													onClick: () => openRejectModal(w),
													title: "Tolak Pengajuan",
													"aria-label": "Tolak Pengajuan",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
												})] }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
													size: "sm",
													variant: "outline",
													className: "h-8 w-8 p-0 text-primary hover:bg-primary/10",
													onClick: () => openEditModal(w),
													title: "Edit Data Pencairan",
													"aria-label": "Edit Data Pencairan",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "h-3.5 w-3.5" })
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
													size: "sm",
													variant: "outline",
													className: "h-8 w-8 p-0 text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/20",
													onClick: () => openDeleteModal(w),
													title: "Hapus Riwayat Pencairan",
													"aria-label": "Hapus Riwayat Pencairan",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3.5 w-3.5" })
												})
											]
										})
									})
								]
							}, w.id);
						})] })] })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TablePagination$1, {
						currentPage: safePage,
						totalItems: filteredList.length,
						pageSize: PAGE_SIZE,
						onPageChange: setPage
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: !!verifyingItem,
				onOpenChange: (open) => !open && setVerifyingItem(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "max-w-md",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-5 w-5 text-emerald-600" }), "Verifikasi & Selesaikan Pencairan"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Pastikan dana telah ditransfer ke rekening buzzer sebelum menyelesaikan verifikasi." })] }),
						verifyingItem && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-4 text-xs",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-xl border border-border bg-muted/40 p-3.5 space-y-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex justify-between items-start",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-[10px] uppercase font-bold text-muted-foreground tracking-wide",
													children: "Penerima"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-sm font-bold text-foreground",
													children: verifyingItem.buzzer_name
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-[11px] text-muted-foreground",
													children: verifyingItem.buzzer_email
												})
											] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "rounded-md bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold px-2 py-0.5 text-xs",
												children: verifyingItem.method
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "pt-2 border-t border-border flex items-center justify-between",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[10px] text-muted-foreground block",
												children: "Nomor Rekening / Akun Tujuan"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-mono text-sm font-bold text-foreground",
												children: verifyingItem.account_no || verifyingItem.method
											})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
												type: "button",
												variant: "outline",
												size: "sm",
												className: "h-7 text-xs gap-1",
												onClick: () => copyToClipboard(verifyingItem.account_no || verifyingItem.method, "Nomor rekening"),
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "h-3 w-3" }), " Salin"]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "pt-2 border-t border-border flex items-center justify-between bg-card p-2 rounded-lg",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-xs font-semibold text-muted-foreground",
												children: "Nominal Transfer:"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-display text-base font-bold text-emerald-600 dark:text-emerald-400",
												children: formatIDR(Number(verifyingItem.amount))
											})]
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "flex items-start gap-2.5 rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-3 cursor-pointer",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "checkbox",
										checked: isTransferChecked,
										onChange: (e) => setIsTransferChecked(e.target.checked),
										className: "mt-0.5 h-4 w-4 rounded border-emerald-500 text-emerald-600 focus:ring-emerald-500"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-xs text-foreground font-medium leading-tight",
										children: [
											"Saya telah mentransfer dana sebesar ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: formatIDR(Number(verifyingItem.amount)) }),
											" ke rekening buzzer di atas."
										]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										className: "text-xs",
										children: "Nomor Referensi / Catatan Transfer (Opsional)"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										placeholder: "Contoh: TRX-BCA-9827361 atau Transfer Berhasil",
										value: adminNote,
										onChange: (e) => setAdminNote(e.target.value),
										className: "text-xs h-9"
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
							className: "gap-2 sm:gap-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								onClick: () => setVerifyingItem(null),
								disabled: actionLoading,
								children: "Batal"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								className: "bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5",
								disabled: actionLoading || !isTransferChecked,
								onClick: handleApprove,
								children: actionLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }), "Menyimpan..."] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4" }), "Setujui & Selesaikan Pencairan"] })
							})]
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: !!rejectingItem,
				onOpenChange: (open) => !open && setRejectingItem(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "max-w-md",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
							className: "flex items-center gap-2 text-rose-600",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "h-5 w-5" }), "Tolak Pengajuan Pencairan"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Permintaan pencairan akan dibatalkan dan status diubah menjadi Ditolak." })] }),
						rejectingItem && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-3 text-xs",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-xl border border-rose-500/20 bg-rose-500/5 p-3 space-y-1 text-foreground",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "font-semibold text-xs",
											children: [
												"Buzzer: ",
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-bold",
													children: rejectingItem.buzzer_name
												}),
												" (",
												rejectingItem.buzzer_email,
												")"
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-xs text-muted-foreground",
											children: [
												"Nominal: ",
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", {
													className: "text-rose-600",
													children: formatIDR(Number(rejectingItem.amount))
												}),
												" ke",
												" ",
												rejectingItem.method
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[11px] text-muted-foreground font-medium pt-1 border-t border-rose-500/20",
											children: "ℹ️ Saldo buzzer belum terpotong pada saat pengajuan, sehingga saldo tetap aman di akun buzzer."
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										className: "text-xs font-semibold",
										children: "Pilih Alasan Penolakan Cepat"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex flex-wrap gap-1.5",
										children: [
											"Nomor rekening tidak valid / salah digit",
											"Nama pemilik rekening tidak sesuai akun",
											"Rekening / e-wallet tujuan tidak aktif",
											"Nomor e-wallet belum terdaftar / belum upgrade"
										].map((preset) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: () => setRejectionReason(preset),
											className: cn("rounded-md border px-2 py-1 text-[11px] transition-all text-left", rejectionReason === preset ? "border-rose-500 bg-rose-500/10 text-rose-600 font-semibold" : "border-border bg-muted/40 text-muted-foreground hover:bg-muted"),
											children: preset
										}, preset))
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										className: "text-xs font-semibold",
										children: "Detail Alasan Penolakan (Wajib)"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
										placeholder: "Jelaskan alasan penolakan secara jelas agar buzzer dapat memahami kendala...",
										value: rejectionReason,
										onChange: (e) => setRejectionReason(e.target.value),
										rows: 3,
										className: "text-xs resize-none"
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
							className: "gap-2 sm:gap-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								onClick: () => setRejectingItem(null),
								disabled: actionLoading,
								children: "Batal"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "destructive",
								disabled: actionLoading || !rejectionReason.trim(),
								onClick: handleReject,
								className: "gap-1.5",
								children: actionLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }), "Memproses..."] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" }), "Tolak Pengajuan"] })
							})]
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: !!editingItem,
				onOpenChange: (open) => !open && setEditingItem(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "max-w-md",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "h-5 w-5 text-primary" }), "Edit Data Pencairan Buzzer"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Perbarui status, nominal, atau informasi rekening permohonan pencairan buzzer." })] }),
						editingItem && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-3 text-xs",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-xl border border-border bg-muted/40 p-3 space-y-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "font-semibold text-foreground text-xs",
										children: [
											"Buzzer: ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-bold",
												children: editingItem.buzzer_name
											}),
											" (",
											editingItem.buzzer_email,
											")"
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-[11px] text-muted-foreground",
										children: ["ID Transaksi: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-mono",
											children: editingItem.id
										})]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										className: "text-xs font-semibold",
										children: "Status Pencairan"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
										value: editStatus,
										onValueChange: (v) => setEditStatus(v),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
											className: "h-9 text-xs",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "Menunggu",
												children: "Menunggu Verifikasi"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "Berhasil",
												children: "Berhasil / Selesai"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "Ditolak",
												children: "Ditolak"
											})
										] })]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										className: "text-xs font-semibold",
										children: "Nominal Pencairan (Rp)"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "number",
										value: editAmount,
										onChange: (e) => setEditAmount(e.target.value),
										className: "text-xs h-9 font-semibold"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-2 gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											className: "text-xs",
											children: "Metode / Bank"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											value: editMethod,
											onChange: (e) => setEditMethod(e.target.value),
											placeholder: "Contoh: BCA / GoPay",
											className: "text-xs h-9"
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											className: "text-xs",
											children: "Nomor Rekening / Akun"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											value: editAccountNo,
											onChange: (e) => setEditAccountNo(e.target.value),
											placeholder: "No Rekening / HP",
											className: "text-xs h-9"
										})]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										className: "text-xs",
										children: "Catatan Admin"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
										value: editAdminNote,
										onChange: (e) => setEditAdminNote(e.target.value),
										placeholder: "Catatan verifikasi atau alasan penolakan...",
										rows: 2,
										className: "text-xs resize-none"
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
							className: "gap-2 sm:gap-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								onClick: () => setEditingItem(null),
								disabled: actionLoading,
								children: "Batal"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								onClick: handleSaveEdit,
								disabled: actionLoading,
								className: "gradient-brand text-brand-foreground gap-1.5",
								children: actionLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }), " Menyimpan..."] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4" }), " Simpan Perubahan"] })
							})]
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: !!deletingItem,
				onOpenChange: (open) => !open && setDeletingItem(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "max-w-md",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
							className: "flex items-center gap-2 text-rose-600",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-5 w-5" }), "Hapus Riwayat Pencairan"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Apakah Anda yakin ingin menghapus data permohonan pencairan ini?" })] }),
						deletingItem && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-3 text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-xl border border-rose-500/20 bg-rose-500/5 p-3.5 space-y-1.5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "font-semibold text-xs text-foreground",
										children: [
											"Buzzer: ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-bold",
												children: deletingItem.buzzer_name
											}),
											" (",
											deletingItem.buzzer_email,
											")"
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-xs text-muted-foreground",
										children: [
											"Nominal: ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", {
												className: "text-foreground",
												children: formatIDR(Number(deletingItem.amount))
											}),
											" ke ",
											deletingItem.method
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-xs text-muted-foreground",
										children: ["Status saat ini: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: deletingItem.status === "Menunggu" ? "Menunggu Verifikasi" : deletingItem.status })]
									}),
									(deletingItem.status === "Berhasil" || deletingItem.status === "Disetujui") && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-[11px] text-amber-700 dark:text-amber-400 font-medium pt-1.5 border-t border-rose-500/20",
										children: [
											"⚠️ Karena status sebelumnya ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Berhasil" }),
											", saldo sebesar ",
											formatIDR(Number(deletingItem.amount)),
											" akan otomatis dikembalikan ke akun buzzer."
										]
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground",
								children: "Tindakan ini akan menghapus riwayat dari tabel dan tidak dapat dibatalkan."
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
							className: "gap-2 sm:gap-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								onClick: () => setDeletingItem(null),
								disabled: actionLoading,
								children: "Batal"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "destructive",
								onClick: handleConfirmDelete,
								disabled: actionLoading,
								className: "gap-1.5",
								children: actionLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }), " Menghapus..."] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" }), " Ya, Hapus Riwayat"] })
							})]
						})
					]
				})
			})
		]
	});
}
function AdminPaymentMethodsSection() {
	const { accounts: bankAccounts, activeAccounts, loading: bankLoading, addAccount, updateAccount, deleteAccount, toggleActive } = useAdminBankAccounts();
	const qris = useQrisSettings();
	const fileInputRef = (0, import_react.useRef)(null);
	const [query, setQuery] = (0, import_react.useState)("");
	const [bankDialogOpen, setBankDialogOpen] = (0, import_react.useState)(false);
	const [editingBank, setEditingBank] = (0, import_react.useState)(null);
	const [deletingBank, setDeletingBank] = (0, import_react.useState)(null);
	const [savingBank, setSavingBank] = (0, import_react.useState)(false);
	const [qrisMerchantInput, setQrisMerchantInput] = (0, import_react.useState)(qris.merchantName);
	const [isDeletingQris, setIsDeletingQris] = (0, import_react.useState)(false);
	const [uploadingQris, setUploadingQris] = (0, import_react.useState)(false);
	const [bankForm, setBankForm] = (0, import_react.useState)({
		bankName: "BCA",
		customBankName: "",
		accountNumber: "",
		accountHolder: "",
		isActive: true
	});
	const filteredBanks = (0, import_react.useMemo)(() => {
		if (!query.trim()) return bankAccounts;
		const q = query.toLowerCase();
		return bankAccounts.filter((b) => b.bankName.toLowerCase().includes(q) || b.accountNumber.toLowerCase().includes(q) || b.accountHolder.toLowerCase().includes(q));
	}, [bankAccounts, query]);
	const handleOpenAddDialog = () => {
		setEditingBank(null);
		setBankForm({
			bankName: "BCA",
			customBankName: "",
			accountNumber: "",
			accountHolder: "",
			isActive: true
		});
		setBankDialogOpen(true);
	};
	const handleOpenEditDialog = (bank) => {
		setEditingBank(bank);
		const isPopular = POPULAR_BANKS.includes(bank.bankName);
		setBankForm({
			bankName: isPopular ? bank.bankName : "Lainnya",
			customBankName: isPopular ? "" : bank.bankName,
			accountNumber: bank.accountNumber,
			accountHolder: bank.accountHolder,
			isActive: bank.isActive
		});
		setBankDialogOpen(true);
	};
	const handleSaveBank = async () => {
		const finalBankName = bankForm.bankName === "Lainnya" ? bankForm.customBankName.trim() : bankForm.bankName;
		if (!finalBankName) {
			toast.error("Nama bank wajib diisi");
			return;
		}
		if (!bankForm.accountNumber.trim()) {
			toast.error("Nomor rekening wajib diisi");
			return;
		}
		if (!bankForm.accountHolder.trim()) {
			toast.error("Nama pemilik rekening (atas nama) wajib diisi");
			return;
		}
		setSavingBank(true);
		try {
			if (editingBank) {
				await updateAccount(editingBank.id, {
					bankName: finalBankName,
					accountNumber: bankForm.accountNumber.trim(),
					accountHolder: bankForm.accountHolder.trim(),
					isActive: bankForm.isActive
				});
				toast.success(`Rekening ${finalBankName} berhasil diperbarui`);
			} else {
				await addAccount({
					bankName: finalBankName,
					accountNumber: bankForm.accountNumber.trim(),
					accountHolder: bankForm.accountHolder.trim(),
					isActive: bankForm.isActive
				});
				toast.success(`Rekening ${finalBankName} berhasil ditambahkan`);
			}
			setBankDialogOpen(false);
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Gagal menyimpan rekening");
		} finally {
			setSavingBank(false);
		}
	};
	const handleDeleteBank = async () => {
		if (!deletingBank) return;
		try {
			await deleteAccount(deletingBank.id);
			toast.success(`Rekening ${deletingBank.bankName} berhasil dihapus`);
			setDeletingBank(null);
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Gagal menghapus rekening");
		}
	};
	const handleToggle = async (bank) => {
		try {
			await toggleActive(bank.id, !bank.isActive);
			toast.success(`Rekening ${bank.bankName} ${!bank.isActive ? "diaktifkan" : "dinonaktifkan"}`);
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Gagal mengubah status");
		}
	};
	const copyToClipboard = (text, label) => {
		try {
			navigator.clipboard.writeText(text);
			toast.success(`${label} berhasil disalin!`);
		} catch {
			toast.error("Gagal menyalin");
		}
	};
	const handleFileUpload = async (event) => {
		const file = event.target.files?.[0];
		if (!file) return;
		setUploadingQris(true);
		try {
			await qris.uploadQrisImage(file);
			toast.success("Barcode QRIS baru berhasil diunggah!");
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Gagal mengunggah QRIS");
		} finally {
			setUploadingQris(false);
			if (fileInputRef.current) fileInputRef.current.value = "";
		}
	};
	const handleSaveMerchantName = async () => {
		if (!qrisMerchantInput.trim()) {
			toast.error("Nama merchant QRIS tidak boleh kosong");
			return;
		}
		try {
			await qris.updateSettings({ merchantName: qrisMerchantInput.trim() });
			toast.success("Nama merchant QRIS diperbarui");
		} catch (err) {
			toast.error("Gagal memperbarui nama merchant");
		}
	};
	const handleDeleteQris = async () => {
		try {
			await qris.removeQrisImage();
			toast.success("Barcode QRIS berhasil dihapus");
			setIsDeletingQris(false);
		} catch (err) {
			toast.error("Gagal menghapus barcode QRIS");
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { className: "h-5 w-5 text-primary" }),
						label: "Rekening Bank Aktif",
						value: bankLoading ? "..." : `${activeAccounts.length} dari ${bankAccounts.length}`,
						hint: "Metode Transfer Bank"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QrCode, { className: "h-5 w-5 text-emerald-500" }),
						label: "Status QRIS Merchant",
						value: qris.isEnabled ? "Aktif" : "Nonaktif / Belum Ada",
						hint: qris.imageUrl ? "Barcode Siap Digunakan" : "Barcode Belum Diunggah"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wallet, { className: "h-5 w-5 text-amber-500" }),
						label: "Saluran Pembayaran",
						value: `${activeAccounts.length + (qris.isEnabled ? 1 : 0)} Saluran Aktif`,
						hint: "Bank & QRIS Merchant"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-5 w-5 text-indigo-500" }),
						label: "Sistem Verifikasi",
						value: "Manual Admin",
						hint: "Semua transaksi diverifikasi Admin"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-border bg-card p-6 shadow-sm space-y-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid h-10 w-10 place-items-center rounded-xl bg-emerald-500/10 text-emerald-600",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QrCode, { className: "h-5 w-5" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-lg font-bold",
							children: "Metode Pembayaran QRIS"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: "Kelola barcode QRIS merchant yang dapat di-scan langsung oleh customer."
						})] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3 self-start sm:self-auto",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs font-semibold text-muted-foreground",
							children: qris.settings.isEnabled ? "Status: Aktif" : "Status: Nonaktif"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
							checked: qris.settings.isEnabled,
							onCheckedChange: (checked) => {
								qris.toggleQris(checked);
								toast.success(`QRIS ${checked ? "diaktifkan" : "dinonaktifkan"}`);
							}
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-1 md:grid-cols-[240px_1fr] gap-6 items-start",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-col items-center justify-center rounded-2xl border border-border bg-muted/20 p-4 text-center",
						children: qris.imageUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "rounded-xl border border-border bg-white p-3 shadow-xs",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: qris.imageUrl,
									alt: "QRIS Merchant Barcode",
									className: "mx-auto block h-48 w-48 object-contain"
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-semibold text-foreground truncate max-w-[200px]",
								children: qris.merchantName
							})]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col items-center justify-center py-10 text-muted-foreground space-y-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Image, { className: "h-10 w-10 stroke-1" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs font-medium",
									children: "Belum ada barcode QRIS"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] text-muted-foreground text-center",
									children: "Unggah barcode QRIS merchant Anda di sini."
								})
							]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										className: "text-sm font-semibold",
										children: "Nama Merchant QRIS"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex gap-2 max-w-md",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											value: qrisMerchantInput,
											onChange: (e) => setQrisMerchantInput(e.target.value),
											placeholder: "Contoh: BUZZPRO / BuzzHub"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											variant: "secondary",
											onClick: handleSaveMerchantName,
											children: "Simpan"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted-foreground",
										children: "Nama ini akan ditampilkan di bawah gambar QRIS pada modal checkout customer."
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2 pt-2 border-t border-border/80",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										className: "text-sm font-semibold",
										children: "Kelola Gambar Barcode"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-wrap items-center gap-3",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												ref: fileInputRef,
												type: "file",
												accept: "image/png, image/jpeg, image/jpg, image/webp",
												className: "hidden",
												onChange: handleFileUpload
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
												className: "gradient-brand text-brand-foreground gap-2",
												onClick: () => fileInputRef.current?.click(),
												disabled: uploadingQris,
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "h-4 w-4" }), uploadingQris ? "Mengunggah..." : qris.imageUrl ? "Ganti Barcode QRIS" : "Unggah Barcode QRIS"]
											}),
											qris.imageUrl && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
												variant: "outline",
												className: "text-rose-600 hover:bg-rose-50 hover:text-rose-700 dark:hover:bg-rose-950/40 gap-2",
												onClick: () => setIsDeletingQris(true),
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" }), " Hapus Barcode"]
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted-foreground",
										children: "Format yang didukung: PNG, JPG, WEBP. Maksimal 5 MB."
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-xl border border-primary/20 bg-primary/5 p-3 text-xs text-muted-foreground",
								children: [
									"💡 ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Catatan" }),
									": Metode pembayaran QRIS hanya akan muncul di akun customer jika QRIS berstatus ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Aktif" }),
									" dan gambar barcode sudah diunggah."
								]
							})
						]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { className: "h-5 w-5" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-display text-lg font-bold",
								children: "Metode Pembayaran Transfer Bank"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground",
								children: "Kelola daftar rekening bank tujuan transfer customer."
							})] })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							onClick: handleOpenAddDialog,
							className: "gradient-brand text-brand-foreground gap-2 shrink-0 self-start sm:self-auto",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), " Tambah Rekening"]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex items-center gap-3",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								placeholder: "Cari bank, nomor rekening, atau atas nama...",
								value: query,
								onChange: (e) => setQuery(e.target.value),
								className: "pl-9"
							})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "rounded-xl border border-border overflow-hidden",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
								className: "w-[180px]",
								children: "Nama Bank"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Nomor Rekening" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Atas Nama (A/N)" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
								className: "w-[120px] text-center",
								children: "Status"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
								className: "w-[140px] text-right",
								children: "Aksi"
							})
						] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: filteredBanks.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
							colSpan: 5,
							className: "py-8 text-center text-muted-foreground",
							children: query ? "Tidak ada rekening yang sesuai dengan pencarian." : "Belum ada rekening bank yang ditambahkan."
						}) }) : filteredBanks.map((bank) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
								className: "font-semibold",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary font-bold text-xs uppercase",
										children: bank.bankName.slice(0, 3)
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Bank ", bank.bankName] })]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono text-sm font-semibold tracking-wider",
									children: bank.accountNumber
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "ghost",
									size: "icon",
									className: "h-7 w-7 text-muted-foreground hover:text-foreground",
									title: "Salin nomor rekening",
									onClick: () => copyToClipboard(bank.accountNumber, "Nomor rekening"),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "h-3.5 w-3.5" })
								})]
							}) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
								className: "font-medium text-foreground",
								children: bank.accountHolder
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
								className: "text-center",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
										checked: bank.isActive,
										onCheckedChange: () => handleToggle(bank)
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: cn("text-xs font-semibold", bank.isActive ? "text-emerald-600" : "text-muted-foreground"),
										children: bank.isActive ? "Aktif" : "Nonaktif"
									})]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
								className: "text-right",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-end gap-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "ghost",
										size: "icon",
										className: "h-8 w-8 text-muted-foreground hover:text-foreground",
										title: "Edit rekening",
										onClick: () => handleOpenEditDialog(bank),
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PenLine, { className: "h-4 w-4" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "ghost",
										size: "icon",
										className: "h-8 w-8 text-rose-500 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40",
										title: "Hapus rekening",
										onClick: () => setDeletingBank(bank),
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
									})]
								})
							})
						] }, bank.id)) })] })
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: bankDialogOpen,
				onOpenChange: setBankDialogOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "max-w-md",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: editingBank ? "Edit Rekening Bank Admin" : "Tambah Rekening Bank Admin" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Rekening ini digunakan sebagai tujuan pembayaran transfer oleh customer." })] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-4 py-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Pilih Bank" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
										value: bankForm.bankName,
										onValueChange: (val) => setBankForm({
											...bankForm,
											bankName: val
										}),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Pilih bank" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [POPULAR_BANKS.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem, {
											value: b,
											children: ["Bank ", b]
										}, b)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "Lainnya",
											children: "Bank Lainnya"
										})] })]
									})]
								}),
								bankForm.bankName === "Lainnya" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Nama Bank" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										placeholder: "Contoh: CIMB Niaga, Permata, Danamon",
										value: bankForm.customBankName,
										onChange: (e) => setBankForm({
											...bankForm,
											customBankName: e.target.value
										})
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Nomor Rekening" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										placeholder: "Contoh: 1234567890",
										value: bankForm.accountNumber,
										onChange: (e) => setBankForm({
											...bankForm,
											accountNumber: e.target.value.replace(/[^0-9]/g, "")
										})
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Atas Nama (Pemilik Rekening)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										placeholder: "Contoh: Admin BuzzHub",
										value: bankForm.accountHolder,
										onChange: (e) => setBankForm({
											...bankForm,
											accountHolder: e.target.value
										})
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between rounded-xl border border-border p-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										className: "cursor-pointer",
										children: "Status Aktif"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted-foreground",
										children: "Hanya rekening aktif yang muncul sebagai opsi bagi customer."
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
										checked: bankForm.isActive,
										onCheckedChange: (checked) => setBankForm({
											...bankForm,
											isActive: checked
										})
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							onClick: () => setBankDialogOpen(false),
							disabled: savingBank,
							children: "Batal"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							className: "gradient-brand text-brand-foreground",
							onClick: handleSaveBank,
							disabled: savingBank,
							children: savingBank ? "Menyimpan..." : editingBank ? "Simpan Perubahan" : "Tambah Rekening"
						})] })
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialog, {
				open: isDeletingQris,
				onOpenChange: setIsDeletingQris,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogTitle, { children: "Hapus Barcode QRIS?" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogDescription, { children: "Apakah Anda yakin ingin menghapus barcode QRIS ini? Setelah dihapus, metode pembayaran QRIS tidak akan muncul di halaman checkout customer sampai Anda mengunggah barcode baru." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogCancel, { children: "Batal" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogAction, {
					className: "bg-rose-600 hover:bg-rose-700 text-white",
					onClick: handleDeleteQris,
					children: "Ya, Hapus Barcode QRIS"
				})] })] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialog, {
				open: !!deletingBank,
				onOpenChange: (open) => !open && setDeletingBank(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogTitle, { children: "Hapus Rekening Bank?" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogDescription, { children: [
					"Apakah Anda yakin ingin menghapus rekening ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("b", { children: [
						"Bank ",
						deletingBank?.bankName,
						" (",
						deletingBank?.accountNumber,
						")"
					] }),
					"? Tindakan ini tidak dapat dibatalkan."
				] })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogCancel, { children: "Batal" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogAction, {
					className: "bg-rose-600 hover:bg-rose-700 text-white",
					onClick: handleDeleteBank,
					children: "Ya, Hapus Rekening"
				})] })] })
			})
		]
	});
}
var BUCKET = "campaign-thumbnails";
var ALLOWED_TYPES = /* @__PURE__ */ new Set([
	"image/jpeg",
	"image/png",
	"image/webp",
	"image/gif"
]);
var MAX_BYTES = 5242880;
/** Upload thumbnail katalog ke Supabase Storage dan kembalikan URL publiknya. */
async function uploadCatalogThumbnail(file) {
	if (!ALLOWED_TYPES.has(file.type)) throw new Error("Gambar harus berupa JPG, PNG, WEBP, atau GIF.");
	if (file.size <= 0 || file.size > MAX_BYTES) throw new Error("Ukuran gambar harus antara 1 byte dan 5 MB.");
	const extension = file.type === "image/jpeg" ? "jpg" : file.type.split("/")[1];
	const path = `catalogs/${crypto.randomUUID()}.${extension}`;
	const { data, error } = await supabase.storage.from(BUCKET).upload(path, file, {
		cacheControl: "3600",
		upsert: false,
		contentType: file.type
	});
	if (error || !data?.path) throw error ?? /* @__PURE__ */ new Error("Upload gambar katalog gagal.");
	return supabase.storage.from(BUCKET).getPublicUrl(data.path).data.publicUrl;
}
var navItems = [
	{
		key: "ringkasan",
		label: "Dashboard",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LayoutDashboard, { className: "h-4 w-4" })
	},
	{
		key: "kampanye",
		label: "Kampanye",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Megaphone, { className: "h-4 w-4" })
	},
	{
		key: "manajemen",
		label: "Manajemen User",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "h-4 w-4" })
	},
	{
		key: "verifikasi",
		label: "Verifikasi Buzzer",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shield, { className: "h-4 w-4" })
	},
	{
		key: "verifikasi-pengerjaan",
		label: "Verifikasi Pengerjaan",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4" })
	},
	{
		key: "pembayaran",
		label: "Verifikasi Pembayaran",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4" })
	},
	{
		key: "verifikasi-pencairan",
		label: "Verifikasi Pencairan",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wallet, { className: "h-4 w-4" })
	},
	{
		key: "metode-pembayaran",
		label: "Metode Pembayaran",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { className: "h-4 w-4" })
	},
	{
		key: "pencairan",
		label: "Aktivitas",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Activity, { className: "h-4 w-4" })
	},
	{
		key: "sosmed",
		label: "Akun Sosial Media",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link2, { className: "h-4 w-4" })
	},
	{
		key: "ulasan",
		label: "Ulasan & Rating",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "h-4 w-4" })
	},
	{
		key: "pengaturan",
		label: "Pengaturan",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settings, { className: "h-4 w-4" })
	}
];
var sectionMeta = {
	ringkasan: {
		title: "Dashboard Admin",
		subtitle: "Pantau performa dan aktivitas BuzzHub"
	},
	kampanye: {
		title: "Manajemen Kampanye",
		subtitle: "Kelola seluruh kampanye buzzer marketing"
	},
	manajemen: {
		title: "Manajemen User",
		subtitle: "Kelola akun customer & buzzer secara terpusat"
	},
	verifikasi: {
		title: "Verifikasi Buzzer",
		subtitle: "Setujui atau tolak pendaftaran buzzer baru"
	},
	"verifikasi-pengerjaan": {
		title: "Verifikasi Pengerjaan",
		subtitle: "Periksa pekerjaan buzzer yang sudah mengupload bukti sebelum payout diproses"
	},
	pembayaran: {
		title: "Verifikasi Pembayaran",
		subtitle: "Periksa pembayaran customer sebelum campaign diaktifkan"
	},
	"verifikasi-pencairan": {
		title: "Verifikasi Pencairan Dana",
		subtitle: "Periksa dan verifikasi permohonan pencairan dana (payout) buzzer sebelum transfer diproses"
	},
	"metode-pembayaran": {
		title: "Metode Pembayaran",
		subtitle: "Kelola daftar rekening bank admin untuk penerimaan transfer customer"
	},
	pencairan: {
		title: "Aktivitas",
		subtitle: "Pantau tren aktivitas dan performa platform BuzzHub."
	},
	sosmed: {
		title: "Kelola Akun Sosial Media",
		subtitle: "Verifikasi akun sosmed milik buzzer"
	},
	ulasan: {
		title: "Ulasan & Rating",
		subtitle: "Pantau seluruh ulasan customer terhadap buzzer"
	},
	pengaturan: {
		title: "Pengaturan",
		subtitle: "Konfigurasi akun & preferensi aplikasi"
	}
};
var ADMIN_SECTIONS = [
	"ringkasan",
	"kampanye",
	"manajemen",
	"verifikasi",
	"verifikasi-pengerjaan",
	"pembayaran",
	"verifikasi-pencairan",
	"metode-pembayaran",
	"pencairan",
	"sosmed",
	"ulasan",
	"pengaturan"
];
function getInitialAdminSection() {
	if (typeof window !== "undefined") {
		const sp = new URLSearchParams(window.location.search).get("section");
		if (sp && ADMIN_SECTIONS.includes(sp)) return sp;
		try {
			const stored = localStorage.getItem("buzzhub.active_section.admin");
			if (stored && ADMIN_SECTIONS.includes(stored)) return stored;
		} catch {}
	}
	return "ringkasan";
}
function AdminPage() {
	useRequireRole("admin");
	const [section, setSection] = (0, import_react.useState)(getInitialAdminSection);
	const [mobileOpen, setMobileOpen] = (0, import_react.useState)(false);
	const [logoutOpen, setLogoutOpen] = (0, import_react.useState)(false);
	const session = useSession();
	const { collapsed, toggle } = useSidebarCollapsed("admin");
	const roleLabel = (() => {
		switch (session?.role) {
			case "admin": return "admin";
			case "buzzer": return "buzzer";
			case "customer": return "customer";
			default: return "akun";
		}
	})();
	const doLogout = () => {
		setLogoutOpen(false);
		clearSession();
		try {
			localStorage.removeItem("buzzhub.active_section.admin");
		} catch {}
		toast.success("Berhasil keluar");
		window.location.replace("/login");
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
	(0, import_react.useEffect)(() => {
		if (typeof window !== "undefined") {
			try {
				localStorage.setItem("buzzhub.active_section.admin", section);
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
			if (sp && ADMIN_SECTIONS.includes(sp)) setSection(sp);
		};
		window.addEventListener("popstate", handlePopState);
		return () => window.removeEventListener("popstate", handlePopState);
	}, []);
	const sidebarUser = {
		name: "Admin BuzzHub",
		email: "admin@buzzhub.id",
		roleLabel: "admin"
	};
	const renderSidebar = (isCollapsed = false) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SidebarNav, {
		nav: navItems,
		activeKey: section,
		onNavigate: go,
		user: sidebarUser,
		onLogout: () => setLogoutOpen(true),
		collapsed: isCollapsed
	});
	const meta = sectionMeta[section];
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
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
						className: "mb-6 flex min-h-[56px] sm:min-h-[60px] items-center justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 sm:gap-3 min-w-0",
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
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThemeToggle, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								size: "icon",
								className: "h-9 w-9 md:hidden",
								onClick: () => setLogoutOpen(true),
								"aria-label": "Keluar",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "h-4 w-4" })
							})]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SectionErrorBoundary, {
						title: `${meta.title} gagal dimuat`,
						children: [
							section === "ringkasan" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RingkasanSection, {}),
							section === "kampanye" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KampanyeSection, {}),
							section === "manajemen" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ManajemenUserSection, {}),
							section === "verifikasi" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VerifikasiSection, {}),
							section === "verifikasi-pengerjaan" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VerifikasiSection, { mode: "jobs" }),
							section === "pembayaran" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminPaymentVerificationSection, {}),
							section === "verifikasi-pencairan" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminPayoutVerificationSection, {}),
							section === "metode-pembayaran" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminPaymentMethodsSection, {}),
							section === "pencairan" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PencairanSection, {}),
							section === "sosmed" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminSocialSection, {}),
							section === "ulasan" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminReviewsSection, {}),
							section === "pengaturan" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PengaturanSection, {})
						]
					}, section)]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MobileBottomNav, {
				nav: navItems,
				activeKey: section,
				onNavigate: go
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialog, {
				open: logoutOpen,
				onOpenChange: setLogoutOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogTitle, { children: [
					"Keluar akun ",
					roleLabel,
					"?"
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogDescription, { children: "Anda akan keluar dari sesi saat ini. Pastikan pekerjaan telah disimpan." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogCancel, { children: "Batal" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogAction, {
					onClick: doLogout,
					className: "gradient-brand text-brand-foreground",
					children: "Keluar"
				})] })] })
			})
		]
	});
}
function RingkasanSection() {
	const { data: campaigns, loading: campaignsLoading } = useCampaigns();
	const { data: jobs, loading: jobsLoading } = useCampaignJobs();
	const { data: completedJobs, loading: completedJobsLoading } = useCompletedCampaignJobs();
	const adminWallet = useAdminWallet();
	const [buzzerProfiles, setBuzzerProfiles] = (0, import_react.useState)([]);
	(0, import_react.useEffect)(() => {
		let active = true;
		const loadBuzzerProfiles = async () => {
			const [{ data }, { data: socialAccounts }] = await Promise.all([supabase.from("app_accounts").select("email, name, platform, followers, avatar_url").eq("role", "buzzer"), supabase.from("social_accounts").select("buzzer_email, followers, verification, platform").eq("verification", "Terverifikasi")]);
			const verifiedFollowers = /* @__PURE__ */ new Map();
			for (const account of socialAccounts ?? []) {
				const email = String(account.buzzer_email).trim().toLowerCase();
				verifiedFollowers.set(email, (verifiedFollowers.get(email) ?? 0) + Number(account.followers ?? 0));
			}
			if (active) setBuzzerProfiles((data ?? []).map((profile) => ({
				email: String(profile.email).trim().toLowerCase(),
				name: String(profile.name ?? ""),
				platform: profile.platform ?? null,
				followers: verifiedFollowers.get(String(profile.email).trim().toLowerCase()) ?? 0,
				avatar_url: profile.avatar_url ?? null
			})));
		};
		loadBuzzerProfiles();
		const channel = supabase.channel("dashboard-buzzer-profiles").on("postgres_changes", {
			event: "*",
			schema: "public",
			table: "app_accounts"
		}, loadBuzzerProfiles).on("postgres_changes", {
			event: "*",
			schema: "public",
			table: "social_accounts"
		}, loadBuzzerProfiles).subscribe();
		return () => {
			active = false;
			supabase.removeChannel(channel);
		};
	}, []);
	const campaignJobStats = (0, import_react.useMemo)(() => {
		const result = /* @__PURE__ */ new Map();
		for (const job of jobs) {
			if (!job.campaign_id) continue;
			const current = result.get(job.campaign_id) ?? {
				taken: 0,
				done: 0,
				total: 0
			};
			current.total += 1;
			if (job.status !== "Tersedia") current.taken += 1;
			if (job.status === "Selesai") current.done += 1;
			result.set(job.campaign_id, current);
		}
		return result;
	}, [jobs]);
	const monthlyRevenue = (0, import_react.useMemo)(() => {
		const now = /* @__PURE__ */ new Date();
		return Array.from({ length: 12 }, (_, index) => new Date(now.getFullYear(), now.getMonth() - 11 + index, 1)).map((month) => {
			const revenue = completedJobs.filter((job) => {
				const date = new Date(job.updated_at);
				return date.getFullYear() === month.getFullYear() && date.getMonth() === month.getMonth();
			}).reduce((sum, job) => {
				return sum + calculateCampaignJobSplit(job).total;
			}, 0);
			return {
				month: month.toLocaleDateString("id-ID", {
					month: "short",
					year: "2-digit"
				}),
				revenue,
				profit: completedJobs.filter((job) => {
					const date = new Date(job.updated_at);
					return date.getFullYear() === month.getFullYear() && date.getMonth() === month.getMonth();
				}).reduce((sum, job) => sum + calculateCampaignJobSplit(job).adminShare, 0)
			};
		});
	}, [completedJobs]);
	const totalRevenue = adminWallet.totalRevenue;
	const totalProfit = adminWallet.totalProfit;
	const approvedCampaigns = campaigns.filter((campaign) => campaign.payment_status === "Pembayaran Disetujui");
	const activeCampaigns = approvedCampaigns.filter((campaign) => campaign.status === "Aktif").length;
	const topBuzzers = (0, import_react.useMemo)(() => {
		const profileMap = new Map(buzzerProfiles.map((profile) => [profile.email, profile]));
		const earnings = /* @__PURE__ */ new Map();
		const combinedJobs = [...completedJobs];
		const seenJobIds = new Set(completedJobs.map((j) => j.id));
		for (const j of jobs) if (!seenJobIds.has(j.id) && (j.status === "Selesai" || Boolean(j.admin_verified_at) || j.status === "Review" || Boolean(j.proof_url))) {
			combinedJobs.push(j);
			seenJobIds.add(j.id);
		}
		for (const job of combinedJobs) {
			const email = job.buzzer_email?.trim().toLowerCase();
			if (!email) continue;
			const profile = profileMap.get(email);
			const current = earnings.get(email) ?? {
				name: profile?.name || job.buzzer_name || email,
				email,
				platform: profile?.platform || job.platform,
				followers: profile?.followers ?? 0,
				earnings: 0,
				avatar_url: profile?.avatar_url ?? null,
				jobs: 0
			};
			current.earnings += Number(job.buzzer_amount ?? job.payout ?? 0);
			current.jobs += 1;
			earnings.set(email, current);
		}
		return [...earnings.values()].sort((a, b) => b.earnings - a.earnings).slice(0, 5);
	}, [
		buzzerProfiles,
		completedJobs,
		jobs
	]);
	const dashboardLoading = campaignsLoading || jobsLoading || completedJobsLoading || adminWallet.loading;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Total Pendapatan",
					value: formatIDR$1(totalRevenue),
					hint: "Dari job buzzer yang selesai",
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DollarSign, { className: "h-5 w-5" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Keuntungan",
					value: formatIDR$1(totalProfit),
					hint: "Bagian admin dari job selesai",
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "h-5 w-5" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Buzzer Aktif",
					value: buzzerProfiles.length.toLocaleString("id-ID"),
					hint: "Profil buzzer terdaftar",
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "h-5 w-5" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Kampanye Berjalan",
					value: activeCampaigns.toString(),
					hint: `${approvedCampaigns.length} total kampanye`,
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "h-5 w-5" })
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-6 rounded-2xl border border-border bg-card shadow-sm",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center justify-between gap-3 border-b border-border p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "font-display text-lg font-bold",
					children: "Grafik Pendapatan Bulanan"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "Perbandingan pendapatan dan keuntungan dari 12 bulan terakhir"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-full border border-border bg-muted/40 px-3 py-1 text-xs text-muted-foreground",
					children: [
						monthlyRevenue[0]?.month,
						" — ",
						monthlyRevenue[monthlyRevenue.length - 1]?.month
					]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "h-[320px] p-5",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartContainer, {
					config: {
						revenue: {
							label: "Pendapatan",
							color: "#8b5cf6"
						},
						profit: {
							label: "Keuntungan",
							color: "#22c55e"
						}
					},
					className: "h-full w-full",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AreaChart, {
						data: monthlyRevenue,
						margin: {
							left: 12,
							right: 12,
							top: 16,
							bottom: 0
						},
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("defs", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
								id: "revenueFill",
								x1: "0",
								y1: "0",
								x2: "0",
								y2: "1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
									offset: "5%",
									stopColor: "#8b5cf6",
									stopOpacity: .35
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
									offset: "95%",
									stopColor: "#8b5cf6",
									stopOpacity: .04
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
								id: "profitFill",
								x1: "0",
								y1: "0",
								x2: "0",
								y2: "1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
									offset: "5%",
									stopColor: "#22c55e",
									stopOpacity: .25
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
									offset: "95%",
									stopColor: "#22c55e",
									stopOpacity: .04
								})]
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
								strokeDasharray: "3 3",
								vertical: false,
								stroke: "rgba(148,163,184,0.15)"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
								dataKey: "month",
								tickLine: false,
								axisLine: false,
								tickMargin: 8,
								padding: {
									left: 8,
									right: 8
								}
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
								tickLine: false,
								axisLine: false,
								tickMargin: 8,
								tickFormatter: (value) => `Rp${(Number(value) / 1e6).toFixed(0)}J`,
								domain: [0, "dataMax + 3000000"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartTooltip, {
								cursor: {
									stroke: "rgba(148,163,184,0.35)",
									strokeWidth: 1
								},
								labelFormatter: (label) => `Bulan ${label}`,
								content: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartTooltipContent, { formatter: (value) => formatIDR$1(Number(Array.isArray(value) ? value[0] : value ?? 0)) })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
								type: "natural",
								dataKey: "revenue",
								stroke: "#8b5cf6",
								strokeWidth: 3,
								fill: "url(#revenueFill)",
								name: "Pendapatan",
								dot: {
									r: 3,
									fill: "#8b5cf6",
									strokeWidth: 0
								},
								activeDot: {
									r: 5,
									strokeWidth: 2,
									stroke: "#fff"
								}
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
								type: "natural",
								dataKey: "profit",
								stroke: "#22c55e",
								strokeWidth: 2.5,
								fill: "url(#profitFill)",
								name: "Keuntungan",
								dot: {
									r: 3,
									fill: "#22c55e",
									strokeWidth: 0
								},
								activeDot: {
									r: 5,
									strokeWidth: 2,
									stroke: "#fff"
								}
							})
						]
					})
				})
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-6 grid gap-6 lg:grid-cols-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-border bg-card shadow-sm lg:col-span-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center justify-between gap-3 border-b border-border p-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-display text-lg font-bold",
						children: "Kampanye Terbaru"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: "Pantau progress semua kampanye aktif"
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							className: "w-56 pl-9",
							placeholder: "Cari kampanye..."
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "overflow-x-auto",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Kampanye" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Customer" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Progress" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Status" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
							className: "text-right",
							children: "Budget"
						})
					] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableBody, { children: [
						dashboardLoading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
							colSpan: 5,
							className: "py-8 text-center text-sm text-muted-foreground",
							children: "Memuat data kampanye…"
						}) }),
						!dashboardLoading && approvedCampaigns.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
							colSpan: 5,
							className: "py-8 text-center text-sm text-muted-foreground",
							children: "Belum ada data kampanye."
						}) }),
						!dashboardLoading && approvedCampaigns.slice(0, 5).map((c) => {
							const jobStats = campaignJobStats.get(c.id) ?? {
								taken: 0,
								done: 0,
								total: 0
							};
							const progress = c.slots > 0 ? Math.round(jobStats.taken / c.slots * 100) : 0;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-medium",
									children: c.title
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs text-muted-foreground",
									children: [
										c.platform,
										" · ",
										c.slots,
										" slot"
									]
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
									className: "text-sm",
									children: c.customer_name
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "h-1.5 w-20 overflow-hidden rounded-full bg-muted",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "h-full gradient-brand",
											style: { width: `${Math.min(100, progress)}%` }
										})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-xs text-muted-foreground",
										children: [
											jobStats.taken,
											"/",
											c.slots
										]
									})]
								}) }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: c.status }) }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
									className: "text-right font-medium",
									children: formatIDR$1(Number(c.budget))
								})
							] }, c.id);
						})
					] })] })
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-border bg-card p-5 shadow-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-display text-lg font-bold",
						children: "Top Buzzer"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: "Pendapatan dari job selesai"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
						className: "mt-4 space-y-3",
						children: [topBuzzers.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
							className: "py-6 text-center text-sm text-muted-foreground",
							children: "Belum ada data pendapatan buzzer."
						}), topBuzzers.map((b, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex items-center gap-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "w-5 text-sm font-bold text-muted-foreground",
									children: i + 1
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Avatar, {
									className: "h-9 w-9 border border-border",
									children: [b.avatar_url && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarImage, {
										src: b.avatar_url,
										alt: b.name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarFallback, {
										className: "gradient-brand text-xs text-brand-foreground",
										children: b.name.split(" ").map((n) => n[0]).join("").slice(0, 2)
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0 flex-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BuzzerNameLink, {
										name: b.name,
										email: b.email,
										className: "truncate text-sm"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "truncate text-xs text-muted-foreground",
										children: [
											b.platform,
											" · ",
											b.followers.toLocaleString("id-ID"),
											" fol. · ",
											b.jobs,
											" job selesai"
										]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "shrink-0 text-sm font-semibold",
									children: formatIDR$1(b.earnings)
								})
							]
						}, b.email))]
					})
				]
			})]
		})
	] });
}
function AdminReviewsSection() {
	const session = useSession();
	const { data: ratings, loading, refetch: refetchRatings } = useBuzzerRatings();
	const [query, setQuery] = (0, import_react.useState)("");
	const [buzzer, setBuzzer] = (0, import_react.useState)("all");
	const [stars, setStars] = (0, import_react.useState)("all");
	const [date, setDate] = (0, import_react.useState)("");
	const [editingRating, setEditingRating] = (0, import_react.useState)(null);
	const [editStars, setEditStars] = (0, import_react.useState)(0);
	const [editComment, setEditComment] = (0, import_react.useState)("");
	const [saving, setSaving] = (0, import_react.useState)(false);
	const [deletingRating, setDeletingRating] = (0, import_react.useState)(null);
	const startEdit = (rating) => {
		setEditingRating(rating);
		setEditStars(rating.stars);
		setEditComment(rating.comment ?? "");
	};
	const saveEdit = async () => {
		if (!editingRating || !session?.email || !editStars) return;
		setSaving(true);
		try {
			await updateAdminBuzzerRating({
				id: editingRating.id,
				admin_email: session.email,
				stars: editStars,
				comment: editComment
			});
			await refetchRatings();
			setEditingRating(null);
			toast.success("Ulasan berhasil diperbarui");
		} catch (error) {
			console.error("Gagal memperbarui ulasan dari admin:", error);
			toast.error(error instanceof Error ? error.message : "Ulasan gagal diperbarui. Coba lagi.");
		} finally {
			setSaving(false);
		}
	};
	const deleteRating = async () => {
		if (!deletingRating || !session?.email) return;
		setSaving(true);
		try {
			await deleteAdminBuzzerRating(deletingRating.id, session.email);
			await refetchRatings();
			setDeletingRating(null);
			toast.success("Ulasan berhasil dihapus");
		} catch (error) {
			console.error("Gagal menghapus ulasan dari admin:", error);
			toast.error(error instanceof Error ? error.message : "Ulasan gagal dihapus. Coba lagi.");
		} finally {
			setSaving(false);
		}
	};
	const buzzerOptions = (0, import_react.useMemo)(() => Array.from(new Set(ratings.map((rating) => rating.buzzer_email))).sort(), [ratings]);
	const filtered = (0, import_react.useMemo)(() => {
		const normalizedQuery = query.trim().toLowerCase();
		return ratings.filter((rating) => {
			const matchesQuery = !normalizedQuery || [
				rating.customer_name,
				rating.customer_email,
				rating.buzzer_name,
				rating.buzzer_email,
				rating.campaign_title,
				rating.comment ?? ""
			].some((value) => value.toLowerCase().includes(normalizedQuery));
			const matchesBuzzer = buzzer === "all" || rating.buzzer_email === buzzer;
			const matchesStars = stars === "all" || rating.stars === Number(stars);
			const matchesDate = !date || rating.created_at.slice(0, 10) === date;
			return matchesQuery && matchesBuzzer && matchesStars && matchesDate;
		});
	}, [
		buzzer,
		date,
		query,
		ratings,
		stars
	]);
	const [page, setPage] = (0, import_react.useState)(1);
	const PAGE_SIZE = 8;
	(0, import_react.useEffect)(() => {
		setPage(1);
	}, [
		buzzer,
		date,
		query,
		stars
	]);
	const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
	const safePage = Math.min(Math.max(1, page), totalPages);
	const paginatedRatings = (0, import_react.useMemo)(() => {
		const start = (safePage - 1) * PAGE_SIZE;
		return filtered.slice(start, start + PAGE_SIZE);
	}, [filtered, safePage]);
	const reviewStats = (0, import_react.useMemo)(() => {
		const total = ratings.length;
		if (total === 0) return {
			total: 0,
			avg: "5.0",
			fiveStars: 0,
			buzzersRated: 0
		};
		return {
			total,
			avg: (ratings.reduce((acc, r) => acc + (r.stars || 0), 0) / total).toFixed(1),
			fiveStars: ratings.filter((r) => r.stars === 5).length,
			buzzersRated: new Set(ratings.map((r) => r.buzzer_email)).size
		};
	}, [ratings]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Total Ulasan",
						value: reviewStats.total.toString(),
						hint: "Semua feedback customer",
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "h-5 w-5" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Rata-rata Rating",
						value: `${reviewStats.avg} ★`,
						hint: "Kepuasan pelanggan",
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "h-5 w-5" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Bintang 5 Sempurna",
						value: `${reviewStats.fiveStars} Ulasan`,
						hint: "Ulasan performa terbaik",
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-5 w-5" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Buzzer Dinilai",
						value: `${reviewStats.buzzersRated} Buzzer`,
						hint: "Memiliki rating aktif",
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "h-5 w-5" })
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-5",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-3 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto_auto]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								className: "pl-9",
								placeholder: "Cari customer, buzzer, campaign...",
								value: query,
								onChange: (event) => setQuery(event.target.value)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: buzzer,
							onValueChange: setBuzzer,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectTrigger, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Funnel, { className: "mr-2 h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Semua Buzzer" })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "all",
								children: "Semua Buzzer"
							}), buzzerOptions.map((email) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: email,
								children: ratings.find((rating) => rating.buzzer_email === email)?.buzzer_name || email
							}, email))] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: stars,
							onValueChange: setStars,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectTrigger, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "mr-2 h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Semua Rating" })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "all",
								children: "Semua Rating"
							}), [
								5,
								4,
								3,
								2,
								1
							].map((value) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem, {
								value: value.toString(),
								children: [value, " bintang"]
							}, value))] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "date",
							"aria-label": "Filter tanggal ulasan",
							value: date,
							onChange: (event) => setDate(event.target.value)
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-border bg-card shadow-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-center justify-between border-b border-border p-5",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-lg font-bold",
						children: "History Ulasan Customer"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm text-muted-foreground",
						children: [filtered.length, " ulasan dari Supabase"]
					})] })
				}), loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-2 p-5",
					children: [
						1,
						2,
						3
					].map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-14 animate-pulse rounded-lg bg-muted" }, item))
				}) : filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "p-8 text-center text-sm text-muted-foreground",
					children: "Belum ada ulasan yang sesuai filter."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "overflow-x-auto",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Customer" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Buzzer" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Campaign / Pesanan" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Rating" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Komentar" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Tanggal" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Aksi" })
					] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: paginatedRatings.map((rating) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-medium",
							children: rating.customer_name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: rating.customer_email
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-medium",
							children: rating.buzzer_name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: rating.buzzer_email
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-medium",
							children: rating.campaign_title
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-muted-foreground",
							children: ["Pesanan #", rating.job_id.slice(0, 8)]
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "inline-flex items-center gap-1 font-semibold text-amber-500",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "h-4 w-4 fill-current" }),
								rating.stars,
								"/5"
							]
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
							className: "max-w-xs whitespace-normal text-sm",
							children: rating.comment || /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted-foreground",
								children: "Tanpa komentar"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
							className: "whitespace-nowrap text-sm text-muted-foreground",
							children: new Date(rating.created_at).toLocaleDateString("id-ID", {
								day: "numeric",
								month: "short",
								year: "numeric"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								variant: "outline",
								size: "sm",
								className: "h-8 w-8 p-0",
								title: "Edit",
								"aria-label": "Edit",
								onClick: () => startEdit(rating),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "h-3.5 w-3.5" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								variant: "destructive",
								size: "sm",
								className: "h-8 w-8 p-0",
								title: "Hapus",
								"aria-label": "Hapus",
								onClick: () => setDeletingRating(rating),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3.5 w-3.5" })
							})]
						}) })
					] }, rating.id)) })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TablePagination, {
						currentPage: safePage,
						totalItems: filtered.length,
						pageSize: PAGE_SIZE,
						onPageChange: setPage
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: !!editingRating,
				onOpenChange: (value) => !value && setEditingRating(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Edit Ulasan & Rating" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogDescription, { children: [
						"Perbarui rating dan komentar customer untuk ",
						editingRating?.campaign_title,
						"."
					] })] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Rating" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-2 flex gap-2",
							role: "radiogroup",
							"aria-label": "Rating 1 sampai 5",
							children: [
								1,
								2,
								3,
								4,
								5
							].map((value) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								role: "radio",
								"aria-checked": editStars === value,
								"aria-label": `${value} bintang`,
								onClick: () => setEditStars(value),
								className: "rounded-md p-1 transition-colors hover:bg-muted",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: cn("h-7 w-7", value <= editStars ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30") })
							}, value))
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "admin-review-comment",
							children: "Komentar (opsional)"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							id: "admin-review-comment",
							rows: 4,
							value: editComment,
							onChange: (event) => setEditComment(event.target.value)
						})] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						onClick: () => setEditingRating(null),
						disabled: saving,
						children: "Batal"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						className: "gradient-brand text-brand-foreground",
						onClick: saveEdit,
						disabled: saving || !editStars,
						children: saving ? "Menyimpan..." : "Simpan Perubahan"
					})] })
				] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialog, {
				open: !!deletingRating,
				onOpenChange: (value) => !value && !saving && setDeletingRating(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogTitle, { children: "Hapus ulasan ini?" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogDescription, { children: [
					"Ulasan dari ",
					deletingRating?.customer_name || deletingRating?.customer_email,
					" akan dihapus permanen dan rating buzzer akan dihitung ulang."
				] })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogCancel, {
					disabled: saving,
					children: "Batal"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogAction, {
					onClick: deleteRating,
					disabled: saving,
					className: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
					children: saving ? "Menghapus..." : "Hapus Ulasan"
				})] })] })
			})
		]
	});
}
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
function TablePagination({ currentPage, totalItems, pageSize = 8, onPageChange }) {
	const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
	const safePage = Math.min(Math.max(1, currentPage), totalPages);
	const from = totalItems === 0 ? 0 : (safePage - 1) * pageSize + 1;
	const to = Math.min(safePage * pageSize, totalItems);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-wrap items-center justify-between gap-3 border-t border-border px-5 py-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "text-xs text-muted-foreground",
			children: [
				"Menampilkan ",
				from,
				"–",
				to,
				" dari ",
				totalItems
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-1.5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "button",
					size: "sm",
					variant: "outline",
					className: "h-8 w-8 p-0",
					disabled: safePage <= 1,
					onClick: () => onPageChange(Math.max(1, safePage - 1)),
					"aria-label": "Halaman sebelumnya",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "h-4 w-4" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "grid min-w-[3rem] place-items-center px-2 text-xs font-medium",
					children: [
						safePage,
						" / ",
						totalPages
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "button",
					size: "sm",
					variant: "outline",
					className: "h-8 w-8 p-0",
					disabled: safePage >= totalPages,
					onClick: () => onPageChange(Math.min(totalPages, safePage + 1)),
					"aria-label": "Halaman berikutnya",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-4 w-4" })
				})
			]
		})]
	});
}
function CustomerOrdersSection() {
	const [filter, setFilter] = (0, import_react.useState)("Semua");
	const [page, setPage] = (0, import_react.useState)(1);
	const PAGE_SIZE = 8;
	const [busy, setBusy] = (0, import_react.useState)(null);
	const [rejecting, setRejecting] = (0, import_react.useState)(null);
	const [rejectNote, setRejectNote] = (0, import_react.useState)("");
	const [deletingCampaign, setDeletingCampaign] = (0, import_react.useState)(null);
	const [editingCampaign, setEditingCampaign] = (0, import_react.useState)(null);
	const [campaignForm, setCampaignForm] = (0, import_react.useState)({
		title: "",
		brief: "",
		deadline: ""
	});
	const [savingCampaign, setSavingCampaign] = (0, import_react.useState)(false);
	const [detail, setDetail] = (0, import_react.useState)(null);
	const { data: campaigns, loading, refetch } = useCampaigns();
	const { data: jobs } = useCampaignJobs();
	(0, import_react.useEffect)(() => {
		setPage(1);
	}, [filter]);
	const jobStats = (0, import_react.useMemo)(() => {
		const m = /* @__PURE__ */ new Map();
		for (const j of jobs) {
			if (!j.campaign_id) continue;
			const cur = m.get(j.campaign_id) ?? {
				taken: 0,
				done: 0,
				total: 0
			};
			cur.total += 1;
			if (j.status !== "Tersedia") cur.taken += 1;
			if (j.status === "Selesai") cur.done += 1;
			m.set(j.campaign_id, cur);
		}
		return m;
	}, [jobs]);
	const filtered = (0, import_react.useMemo)(() => {
		const approvedCampaigns = campaigns.filter((campaign) => campaign.payment_status === "Pembayaran Disetujui");
		return filter === "Semua" ? approvedCampaigns : approvedCampaigns.filter((c) => c.status === filter);
	}, [campaigns, filter]);
	const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
	const safePage = Math.min(Math.max(1, page), totalPages);
	const paginated = (0, import_react.useMemo)(() => {
		const start = (safePage - 1) * PAGE_SIZE;
		return filtered.slice(start, start + PAGE_SIZE);
	}, [filtered, safePage]);
	const totalBudget = (0, import_react.useMemo)(() => filtered.reduce((a, c) => a + Number(c.budget || 0), 0), [filtered]);
	const handleApprove = async (c) => {
		setBusy(c.id);
		try {
			await approveCampaign(c);
			await notifyCustomerPaymentApproved(c.customer_email, c.title);
			toast.success(`Kampanye "${c.title}" dikonfirmasi. ${c.slots} slot job dibuka untuk buzzer.`);
		} catch (e) {
			toast.error("Gagal mengonfirmasi kampanye");
			console.error(e);
		} finally {
			setBusy(null);
		}
	};
	const handleReject = async () => {
		if (!rejecting) return;
		setBusy(rejecting.id);
		try {
			await rejectCampaign(rejecting.id, rejectNote || void 0);
			await notifyCustomerPaymentRejected(rejecting.customer_email, rejecting.title, rejectNote);
			toast.success("Kampanye ditolak.");
			setRejecting(null);
			setRejectNote("");
		} catch (e) {
			toast.error("Gagal menolak kampanye");
			console.error(e);
		} finally {
			setBusy(null);
		}
	};
	const handleDeleteCampaign = async () => {
		if (!deletingCampaign) return;
		setBusy(deletingCampaign.id);
		try {
			await deleteCampaign(deletingCampaign.id);
			toast.success(`Kampanye "${deletingCampaign.title}" berhasil dihapus.`);
			if (detail?.id === deletingCampaign.id) setDetail(null);
			if (editingCampaign?.id === deletingCampaign.id) setEditingCampaign(null);
			setDeletingCampaign(null);
			refetch?.();
		} catch (e) {
			toast.error("Gagal menghapus kampanye");
			console.error(e);
		} finally {
			setBusy(null);
		}
	};
	const openEditCampaign = (c) => {
		setCampaignForm({
			title: c.title ?? "",
			brief: c.brief ?? "",
			deadline: c.deadline ?? ""
		});
		setEditingCampaign(c);
	};
	const handleSaveCampaign = async () => {
		if (!editingCampaign) return;
		if (!campaignForm.title.trim()) {
			toast.error("Judul kampanye wajib diisi.");
			return;
		}
		if (!campaignForm.deadline) {
			toast.error("Deadline wajib diisi.");
			return;
		}
		setSavingCampaign(true);
		try {
			await updateCampaignDetails(editingCampaign.id, campaignForm);
			toast.success("Kampanye berhasil diperbarui.");
			setEditingCampaign(null);
			refetch?.();
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Gagal memperbarui kampanye");
			console.error(e);
		} finally {
			setSavingCampaign(false);
		}
	};
	const detailLive = detail ? campaigns.find((c) => c.id === detail.id) ?? detail : null;
	const detailJobs = (0, import_react.useMemo)(() => {
		if (!detailLive) return [];
		return jobs.filter((j) => j.campaign_id === detailLive.id).sort((a, b) => Number(a.status === "Tersedia") - Number(b.status === "Tersedia"));
	}, [detailLive, jobs]);
	const columns = [
		{
			header: "Kampanye",
			accessor: (c) => c.title
		},
		{
			header: "Customer",
			accessor: (c) => `${c.customer_name} (${c.customer_email})`
		},
		{
			header: "Platform",
			accessor: (c) => c.platform
		},
		{
			header: "Slot",
			accessor: (c) => c.slots
		},
		{
			header: "Deadline",
			accessor: (c) => c.deadline
		},
		{
			header: "Status",
			accessor: (c) => c.status
		},
		{
			header: "Budget (Rp)",
			accessor: (c) => Number(c.budget)
		}
	];
	const exportExcel = () => {
		exportToExcel("kampanye", "Kampanye", filtered, columns);
		toast.success("Data kampanye diekspor ke Excel");
	};
	const exportPdf = () => {
		exportToPDF("kampanye", "Laporan Kampanye", filtered, columns, [{
			label: "Jumlah Kampanye",
			value: filtered.length.toString()
		}, {
			label: "Total Budget",
			value: formatIDR$1(totalBudget)
		}]);
		toast.success("Data kampanye diekspor ke PDF");
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-lg font-bold",
				children: "Pesanan Customer"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "Campaign yang dibuat customer setelah melakukan pemesanan dan pembayaran."
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-border bg-card shadow-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center justify-between gap-3 border-b border-border p-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Funnel, { className: "h-4 w-4 text-muted-foreground" }), [
								"Semua",
								"Aktif",
								"Review",
								"Selesai",
								"Dibatalkan"
							].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setFilter(s),
								className: cn("rounded-full border px-3 py-1 text-xs font-medium", filter === s ? "border-transparent gradient-brand text-brand-foreground" : "border-border text-muted-foreground hover:bg-muted"),
								children: s
							}, s))]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								size: "sm",
								variant: "outline",
								onClick: exportExcel,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileSpreadsheet, { className: "mr-1 h-4 w-4" }), " Excel"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								size: "sm",
								variant: "outline",
								onClick: exportPdf,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileDown, { className: "mr-1 h-4 w-4" }), " PDF"]
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "overflow-x-auto",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Kampanye" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Customer" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Buzzer" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Deadline" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Status" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
								className: "text-right",
								children: "Budget"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
								className: "text-right",
								children: "Aksi"
							})
						] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableBody, { children: [
							loading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
								colSpan: 7,
								className: "py-8 text-center text-sm text-muted-foreground",
								children: "Memuat data kampanye…"
							}) }),
							!loading && filtered.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
								colSpan: 7,
								className: "py-8 text-center text-sm text-muted-foreground",
								children: "Belum ada kampanye pada filter ini."
							}) }),
							paginated.map((c) => {
								const st = jobStats.get(c.id) ?? {
									taken: 0,
									done: 0,
									total: 0
								};
								const progress = st.total ? Math.round(st.done / st.total * 100) : 0;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, {
									className: "hover:bg-muted/50",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "font-medium",
											children: c.title
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: c.platform }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
													"· ",
													c.slots,
													" slot"
												] }),
												c.service_type && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["· ", c.service_type] })
											]
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, {
											className: "text-sm",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: c.customer_name }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-xs text-muted-foreground",
												children: c.customer_email
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "h-1.5 w-20 overflow-hidden rounded-full bg-muted",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "h-full gradient-brand",
													style: { width: `${progress}%` }
												})
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-xs text-muted-foreground",
												children: [
													st.taken,
													"/",
													c.slots
												]
											})]
										}) }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
											className: "text-sm",
											children: c.deadline || "-"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: c.status === "Draft" ? "Menunggu" : c.status }) }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
											className: "text-right font-medium",
											children: formatIDR$1(Number(c.budget))
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
											className: "text-right",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex justify-end gap-2",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
														size: "sm",
														variant: "outline",
														className: "h-8 w-8 p-0",
														title: "Detail",
														"aria-label": "Detail",
														onClick: () => setDetail(c),
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-4 w-4" })
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
														size: "sm",
														variant: "outline",
														className: "h-8 w-8 p-0",
														title: "Edit",
														"aria-label": "Edit",
														disabled: busy === c.id,
														onClick: () => openEditCampaign(c),
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "h-4 w-4" })
													}),
													c.status === "Draft" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
														size: "sm",
														className: "h-8 w-8 p-0 gradient-brand text-brand-foreground",
														disabled: busy === c.id,
														onClick: () => handleApprove(c),
														title: "Setujui / Konfirmasi",
														"aria-label": "Setujui",
														children: busy === c.id ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4" })
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
														size: "sm",
														variant: "outline",
														className: "h-8 w-8 p-0 text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/20",
														disabled: busy === c.id,
														onClick: () => {
															setRejecting(c);
															setRejectNote("");
														},
														title: "Tolak",
														"aria-label": "Tolak",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, { className: "h-4 w-4" })
													})] })
												]
											})
										})
									]
								}, c.id);
							})
						] })] })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TablePagination, {
						currentPage: safePage,
						totalItems: filtered.length,
						pageSize: PAGE_SIZE,
						onPageChange: setPage
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: !!detail,
				onOpenChange: (v) => !v && setDetail(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "max-h-[85vh] max-w-2xl overflow-y-auto",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Detail Pesanan Kampanye" }) }),
						detailLive && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap items-center justify-between gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-display text-lg font-bold",
										children: detailLive.title
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-xs text-muted-foreground",
										children: ["Dipesan ", new Date(detailLive.created_at).toLocaleString("id-ID")]
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: detailLive.status === "Draft" ? "Menunggu" : detailLive.status })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-xl border border-border p-4",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mb-2 text-xs font-semibold uppercase text-muted-foreground",
											children: "Customer"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-sm font-medium",
											children: detailLive.customer_name
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-muted-foreground",
											children: detailLive.customer_email
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid gap-3 sm:grid-cols-2",
									children: [
										{
											l: "Platform",
											v: detailLive.platform
										},
										{
											l: "Jenis Kegiatan",
											v: detailLive.service_type || "-"
										},
										{
											l: "Jumlah Slot Buzzer",
											v: `${detailLive.slots} buzzer`
										},
										{
											l: "Budget",
											v: formatIDR$1(Number(detailLive.budget))
										},
										{
											l: "Pembagian / Buzzer",
											v: "Mengikuti level buzzer saat job diambil"
										},
										{
											l: "Deadline",
											v: detailLive.deadline || "-"
										},
										{
											l: "Job Terisi",
											v: `${detailJobs.filter((j) => j.status !== "Tersedia").length}/${detailLive.slots}`
										}
									].map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-xl border border-border p-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-muted-foreground",
											children: f.l
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-sm font-medium",
											children: f.v
										})]
									}, f.l))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-xl border border-border p-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mb-2 text-xs font-semibold uppercase text-muted-foreground",
										children: "Brief / Detail Acara Lengkap"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "whitespace-pre-wrap text-sm font-sans",
										children: detailLive.brief || "Tidak ada brief."
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-xl border border-border",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "border-b border-border p-3 text-xs font-semibold uppercase text-muted-foreground",
										children: [
											"Job Buzzer (",
											detailJobs.length,
											")"
										]
									}), detailJobs.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "p-4 text-sm text-muted-foreground",
										children: "Belum ada job. Job otomatis dibuka setelah kampanye dikonfirmasi."
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
										className: "divide-y divide-border",
										children: detailJobs.map((j) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
											className: "flex items-center justify-between gap-3 p-3 text-sm",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "min-w-0",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "truncate font-medium",
													children: j.buzzer_name ?? "Belum diambil"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "truncate text-xs text-muted-foreground",
													children: j.buzzer_email ?? "—"
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex shrink-0 items-center gap-3",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-xs text-muted-foreground",
													children: formatIDR$1(Number(j.payout))
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: j.status })]
											})]
										}, j.id))
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
							className: "flex flex-row items-center justify-between gap-2 sm:justify-between",
							children: [detailLive && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								className: "h-9 w-9 p-0",
								title: "Edit Kampanye",
								"aria-label": "Edit Kampanye",
								disabled: busy === detailLive.id,
								onClick: () => {
									openEditCampaign(detailLive);
									setDetail(null);
								},
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "h-4 w-4" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [detailLive?.status === "Draft" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: "outline",
									onClick: () => {
										setRejecting(detailLive);
										setRejectNote("");
										setDetail(null);
									},
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, { className: "mr-1 h-4 w-4" }), " Tolak"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									className: "gradient-brand text-brand-foreground",
									disabled: busy === detailLive.id,
									onClick: async () => {
										await handleApprove(detailLive);
										setDetail(null);
									},
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "mr-1 h-4 w-4" }), " Konfirmasi"]
								})] }), detailLive?.status !== "Draft" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "outline",
									onClick: () => setDetail(null),
									children: "Tutup"
								})]
							})]
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: !!rejecting,
				onOpenChange: (v) => !v && setRejecting(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Tolak kampanye" }) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted-foreground",
								children: rejecting?.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Alasan penolakan (opsional)" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								value: rejectNote,
								onChange: (e) => setRejectNote(e.target.value),
								placeholder: "Brief kurang lengkap, budget di bawah minimum, ..."
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						onClick: () => setRejecting(null),
						children: "Batal"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "destructive",
						onClick: handleReject,
						children: "Tolak Kampanye"
					})] })
				] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: !!editingCampaign,
				onOpenChange: (v) => !v && !savingCampaign && setEditingCampaign(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "max-h-[85vh] max-w-lg overflow-y-auto",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Edit Kampanye" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogDescription, { children: [
							editingCampaign?.customer_name,
							" · ",
							editingCampaign?.platform
						] })] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "edit-campaign-title",
										children: "Judul Kampanye"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "edit-campaign-title",
										value: campaignForm.title,
										onChange: (e) => setCampaignForm((f) => ({
											...f,
											title: e.target.value
										}))
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "edit-campaign-deadline",
										children: "Deadline / Tanggal Acara"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "edit-campaign-deadline",
										type: "date",
										value: campaignForm.deadline,
										onChange: (e) => setCampaignForm((f) => ({
											...f,
											deadline: e.target.value
										}))
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "edit-campaign-brief",
										children: "Brief / Detail"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
										id: "edit-campaign-brief",
										rows: 6,
										value: campaignForm.brief,
										onChange: (e) => setCampaignForm((f) => ({
											...f,
											brief: e.target.value
										}))
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] text-muted-foreground",
									children: "Platform, slot, dan budget tidak dapat diubah karena terikat dengan pembayaran dan job buzzer."
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
							className: "flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								variant: "destructive",
								className: "h-9 w-9 p-0 sm:mr-auto",
								title: "Hapus",
								"aria-label": "Hapus",
								disabled: savingCampaign || busy === editingCampaign?.id,
								onClick: () => editingCampaign && setDeletingCampaign(editingCampaign),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-end gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "outline",
									disabled: savingCampaign,
									onClick: () => setEditingCampaign(null),
									children: "Batal"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									className: "gradient-brand text-brand-foreground",
									disabled: savingCampaign,
									onClick: handleSaveCampaign,
									children: [savingCampaign ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-1 h-4 w-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "mr-1 h-4 w-4" }), savingCampaign ? "Menyimpan..." : "Simpan"]
								})]
							})]
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialog, {
				open: !!deletingCampaign,
				onOpenChange: (open) => {
					if (!open && busy !== deletingCampaign?.id) setDeletingCampaign(null);
				},
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogTitle, { children: "Hapus Kampanye?" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogDescription, { children: [
					"Apakah Anda yakin ingin menghapus kampanye ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: [
						"\"",
						deletingCampaign?.title,
						"\""
					] }),
					"? Seluruh data kampanye, pekerjaan buzzer terkait, dan riwayat pesanan akan dihapus secara permanen. Tindakan ini tidak dapat dibatalkan."
				] })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogCancel, {
					disabled: busy === deletingCampaign?.id,
					children: "Batal"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogAction, {
					className: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
					disabled: busy === deletingCampaign?.id,
					onClick: (e) => {
						e.preventDefault();
						handleDeleteCampaign();
					},
					children: busy === deletingCampaign?.id ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-1 h-4 w-4 animate-spin" }), " Menghapus..."] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "mr-1 h-4 w-4" }), " Hapus Kampanye"] })
				})] })] })
			})
		]
	});
}
function KampanyeSection() {
	const { data: campaigns } = useCampaigns();
	const { data: jobs } = useCampaignJobs();
	const totalSlots = (0, import_react.useMemo)(() => campaigns.reduce((acc, c) => acc + (c.slots || 0), 0), [campaigns]);
	const activeCount = (0, import_react.useMemo)(() => campaigns.filter((c) => c.status === "Aktif" || c.status === "Berjalan" || c.status === "Review").length, [campaigns]);
	const completedJobsCount = (0, import_react.useMemo)(() => jobs.filter((j) => j.status === "Selesai" || Boolean(j.admin_verified_at)).length, [jobs]);
	const [tab, setTab] = (0, import_react.useState)(() => {
		if (typeof window !== "undefined") {
			const sp = new URLSearchParams(window.location.search).get("tab");
			if (sp && [
				"pesanan",
				"katalog",
				"harga-sendiri"
			].includes(sp)) return sp;
			try {
				const stored = localStorage.getItem("buzzhub.active_tab.kampanye");
				if (stored && [
					"pesanan",
					"katalog",
					"harga-sendiri"
				].includes(stored)) return stored;
			} catch {}
		}
		return "pesanan";
	});
	const onTabChange = (val) => {
		setTab(val);
		if (typeof window !== "undefined") {
			try {
				localStorage.setItem("buzzhub.active_tab.kampanye", val);
			} catch {}
			const url = new URL(window.location.href);
			if (url.searchParams.get("tab") !== val) {
				url.searchParams.set("tab", val);
				window.history.replaceState(null, "", url.toString());
			}
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Total Kampanye",
					value: campaigns.length.toString(),
					hint: "Semua pesanan & kampanye",
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Megaphone, { className: "h-5 w-5" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Kampanye Aktif",
					value: activeCount.toString(),
					hint: "Sedang berjalan",
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "h-5 w-5" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Target Slot Buzzer",
					value: `${totalSlots.toLocaleString("id-ID")} Slot`,
					hint: "Kapasitas pengerjaan",
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "h-5 w-5" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Pekerjaan Selesai",
					value: completedJobsCount.toLocaleString("id-ID"),
					hint: "Job buzzer terverifikasi",
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-5 w-5" })
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
			value: tab,
			onValueChange: onTabChange,
			className: "space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, {
					className: "grid w-full grid-cols-3 sm:w-auto",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
							value: "pesanan",
							className: "gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Megaphone, { className: "h-4 w-4" }), " Pesanan Customer"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
							value: "katalog",
							className: "gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layers, { className: "h-4 w-4" }), " Katalog Layanan"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
							value: "harga-sendiri",
							className: "gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, { className: "h-4 w-4" }), " Harga Pesanan Sendiri"]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
					value: "pesanan",
					className: "mt-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CustomerOrdersSection, {})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
					value: "katalog",
					className: "mt-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CatalogManagementSection, {})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
					value: "harga-sendiri",
					className: "mt-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ServicePricingManagementSection, {})
				})
			]
		})]
	});
}
function CatalogManagementSection({ createSignal = 0 }) {
	const { data: catalogs, loading } = useServiceCatalogs();
	const { data: orders } = useCampaigns();
	const { data: jobs } = useCampaignJobs();
	const [editor, setEditor] = (0, import_react.useState)(null);
	const [saving, setSaving] = (0, import_react.useState)(false);
	const [deletingCatalog, setDeletingCatalog] = (0, import_react.useState)(null);
	const [deleting, setDeleting] = (0, import_react.useState)(false);
	const [thumbnailFile, setThumbnailFile] = (0, import_react.useState)(null);
	const [thumbnailPreview, setThumbnailPreview] = (0, import_react.useState)(null);
	const PAGE_SIZE = 8;
	const [page, setPage] = (0, import_react.useState)(1);
	const totalPages = Math.max(1, Math.ceil(catalogs.length / PAGE_SIZE));
	const safePage = Math.min(Math.max(1, page), totalPages);
	const paginatedCatalogs = (0, import_react.useMemo)(() => {
		const start = (safePage - 1) * PAGE_SIZE;
		return catalogs.slice(start, start + PAGE_SIZE);
	}, [catalogs, safePage]);
	const openCreate = () => {
		setThumbnailFile(null);
		setThumbnailPreview(null);
		setEditor({
			title: "",
			platform: "Instagram",
			service_type: "",
			price: "",
			slots: "",
			payout_per_buzzer: "",
			thumbnail_url: "",
			description: "",
			status: "Aktif"
		});
	};
	(0, import_react.useEffect)(() => {
		if (createSignal > 0) openCreate();
	}, [createSignal]);
	const selectThumbnail = (file) => {
		if (!file) {
			setThumbnailFile(null);
			setThumbnailPreview(null);
			return;
		}
		if (![
			"image/jpeg",
			"image/png",
			"image/webp",
			"image/gif"
		].includes(file.type)) {
			toast.error("Gambar harus berupa JPG, PNG, WEBP, atau GIF.");
			return;
		}
		if (file.size > 5242880) {
			toast.error("Ukuran gambar maksimal 5 MB.");
			return;
		}
		setThumbnailFile(file);
		setThumbnailPreview(URL.createObjectURL(file));
	};
	const save = async () => {
		if (!editor?.title?.trim() || !editor.platform || !editor.service_type?.trim() || !editor.description?.trim() || Number(editor.price) <= 0 || !Number.isInteger(Number(editor.slots)) || Number(editor.slots) < 1 || !editor.status) {
			toast.error("Lengkapi nama, platform, kategori, deskripsi, harga, slot, dan status katalog.");
			return;
		}
		setSaving(true);
		try {
			const thumbnail_url = thumbnailFile ? await uploadCatalogThumbnail(thumbnailFile) : editor.thumbnail_url.trim() || null;
			const data = {
				title: editor.title.trim(),
				platform: editor.platform,
				service_type: editor.service_type.trim(),
				price: Number(editor.price),
				slots: Number(editor.slots),
				thumbnail_url,
				description: editor.description.trim(),
				status: editor.status
			};
			if (editor.id) {
				await updateServiceCatalog(editor.id, data);
				toast.success("Katalog layanan diperbarui.");
			} else {
				await createServiceCatalog(data);
				toast.success("Katalog berhasil ditambahkan.");
			}
			setThumbnailFile(null);
			setThumbnailPreview(null);
			setEditor(null);
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "Gagal menyimpan katalog layanan.");
		} finally {
			setSaving(false);
		}
	};
	const handleDeleteCatalog = async () => {
		if (!deletingCatalog?.id) return;
		setDeleting(true);
		try {
			await deleteServiceCatalog(deletingCatalog.id);
			toast.success(`Katalog "${deletingCatalog.title}" berhasil dihapus.`);
			if (editor?.id === deletingCatalog.id) {
				setEditor(null);
				setThumbnailFile(null);
				setThumbnailPreview(null);
			}
			setDeletingCatalog(null);
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "Gagal menghapus katalog layanan.");
		} finally {
			setDeleting(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "space-y-6",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "rounded-2xl border border-border bg-card shadow-sm",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center justify-between gap-3 border-b border-border p-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-lg font-bold",
						children: "Katalog Layanan"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: "Produk yang dibuat admin dan dapat dipesan customer."
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						size: "sm",
						className: "gradient-brand text-brand-foreground",
						onClick: openCreate,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "mr-1 h-4 w-4" }), " Tambah Katalog"]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "overflow-x-auto",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Nama Katalog" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Platform" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Kategori" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Harga Pesanan" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Buzzer Tetap" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Bayaran / Buzzer" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Terpakai" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Tersedia" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Status" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
							className: "text-right",
							children: "Aksi"
						})
					] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableBody, { children: [
						loading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
							colSpan: 10,
							className: "py-8 text-center text-muted-foreground",
							children: "Memuat katalog…"
						}) }),
						!loading && catalogs.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
							colSpan: 10,
							className: "py-8 text-center text-muted-foreground",
							children: "Belum ada katalog layanan."
						}) }),
						paginatedCatalogs.map((catalog) => {
							const catalogSlots = Number(catalog.slots) || 0;
							const matchingCampaigns = orders.filter((order) => {
								if (order.catalog_id) return order.catalog_id === catalog.id;
								if (order.platform !== catalog.platform) return false;
								if (order.service_type && catalog.service_type && order.service_type === catalog.service_type) {
									if (catalog.title === "ndr2") return false;
									return true;
								}
								if (!order.service_type && order.slots === catalogSlots) return true;
								return false;
							});
							const matchingCampIds = new Set(matchingCampaigns.map((c) => c.id));
							const used = jobs.filter((j) => j.campaign_id && matchingCampIds.has(j.campaign_id)).filter((j) => j.status !== "Tersedia").length;
							const available = Math.max(0, catalogSlots - used);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-medium",
									children: catalog.title
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "max-w-xs truncate text-xs text-muted-foreground",
									children: catalog.description || "-"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: catalog.platform }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: catalog.service_type }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: formatIDR$1(Number(catalog.price)) }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: catalogSlots }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs text-muted-foreground",
									children: "Sesuai Level"
								}) }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: used }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: available }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: catalog.status }) }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
									className: "text-right",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-end gap-2",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												size: "sm",
												variant: "outline",
												className: "h-8 w-8 p-0",
												title: "Edit",
												"aria-label": "Edit",
												onClick: () => setEditor({
													...catalog,
													price: String(catalog.price),
													slots: String(catalog.slots),
													thumbnail_url: catalog.thumbnail_url ?? "",
													description: catalog.description ?? ""
												}),
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "h-4 w-4" })
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												size: "sm",
												variant: "outline",
												onClick: async () => {
													try {
														await updateServiceCatalogStatus(catalog.id, catalog.status === "Aktif" ? "Nonaktif" : "Aktif");
														toast.success("Status katalog diperbarui.");
													} catch {
														toast.error("Gagal memperbarui status.");
													}
												},
												children: catalog.status === "Aktif" ? "Nonaktifkan" : "Aktifkan"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												size: "sm",
												variant: "destructive",
												className: "h-8 w-8 p-0",
												title: "Hapus",
												"aria-label": "Hapus",
												onClick: () => setDeletingCatalog(catalog),
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3.5 w-3.5" })
											})
										]
									})
								})
							] }, catalog.id);
						})
					] })] })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TablePagination, {
					currentPage: safePage,
					totalItems: catalogs.length,
					pageSize: PAGE_SIZE,
					onPageChange: setPage
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
					open: !!editor,
					onOpenChange: (open) => {
						if (!open) {
							setEditor(null);
							setThumbnailFile(null);
							setThumbnailPreview(null);
						}
					},
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
						className: "max-h-[90vh] overflow-y-auto sm:max-w-2xl",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: editor?.id ? "Edit Katalog Layanan" : "Tambah Katalog Layanan" }) }),
							editor && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-3 sm:grid-cols-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "sm:col-span-2 text-sm text-muted-foreground",
										children: "Tambahkan layanan baru yang dapat dipesan oleh customer."
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "sm:col-span-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Nama Layanan" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											value: editor.title,
											onChange: (e) => setEditor({
												...editor,
												title: e.target.value
											})
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Platform" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
										value: editor.platform,
										onValueChange: (platform) => {
											setEditor({
												...editor,
												platform
											});
										},
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: [
											"Instagram",
											"TikTok",
											"X (Twitter)",
											"Facebook",
											"YouTube",
											"Telegram",
											"LinkedIn"
										].map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: item,
											children: item
										}, item)) })]
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Kategori / Jenis Layanan" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
										value: editor.service_type,
										onValueChange: (service_type) => setEditor({
											...editor,
											service_type
										}),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Pilih jenis layanan" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: CAMPAIGN_TYPES.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: item.name,
											children: item.name
										}, item.key)) })]
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Harga Pesanan" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "number",
										min: "1",
										value: editor.price,
										onChange: (e) => setEditor({
											...editor,
											price: e.target.value
										})
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Jumlah Slot Buzzer" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "number",
										min: "1",
										step: "1",
										value: editor.slots,
										onChange: (e) => setEditor({
											...editor,
											slots: e.target.value
										})
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "sm:col-span-2",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Gambar / Thumbnail" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												type: "file",
												accept: "image/jpeg,image/png,image/webp,image/gif",
												className: "mt-1",
												onChange: (event) => selectThumbnail(event.target.files?.[0] ?? null)
											}),
											(thumbnailPreview || editor.thumbnail_url) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
												src: thumbnailPreview || editor.thumbnail_url,
												alt: "Preview thumbnail katalog",
												className: "mt-3 h-20 w-32 rounded-lg border object-cover"
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "sm:col-span-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Deskripsi" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
											value: editor.description,
											onChange: (e) => setEditor({
												...editor,
												description: e.target.value
											})
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Status Katalog" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
										value: editor.status,
										onValueChange: (status) => setEditor({
											...editor,
											status
										}),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: ["Aktif", "Nonaktif"].map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: item,
											children: item
										}, item)) })]
									})] })
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
								className: "flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-between",
								children: [editor?.id ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "button",
									variant: "destructive",
									onClick: () => setDeletingCatalog(editor),
									className: "h-9 w-9 p-0 sm:mr-auto",
									title: "Hapus Katalog",
									"aria-label": "Hapus Katalog",
									disabled: saving,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-end gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "outline",
										onClick: () => {
											setEditor(null);
											setThumbnailFile(null);
											setThumbnailPreview(null);
										},
										disabled: saving,
										children: "Batal"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										className: "gradient-brand text-brand-foreground",
										disabled: saving,
										onClick: save,
										children: saving ? "Menyimpan…" : "Simpan"
									})]
								})]
							})
						]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialog, {
					open: !!deletingCatalog,
					onOpenChange: (open) => {
						if (!open && !deleting) setDeletingCatalog(null);
					},
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogTitle, { children: "Hapus Katalog Layanan?" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogDescription, { children: [
						"Apakah Anda yakin ingin menghapus katalog ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: [
							"\"",
							deletingCatalog?.title,
							"\""
						] }),
						"? Seluruh paket katalog terkait juga akan dihapus. Tindakan ini tidak dapat dibatalkan."
					] })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogCancel, {
						disabled: deleting,
						children: "Batal"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogAction, {
						className: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
						disabled: deleting,
						onClick: (e) => {
							e.preventDefault();
							handleDeleteCatalog();
						},
						children: deleting ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-1 h-4 w-4 animate-spin" }), " Menghapus..."] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "mr-1 h-4 w-4" }), " Hapus Katalog"] })
					})] })] })
				})
			]
		})
	});
}
function ServicePricingManagementSection() {
	const { data: pricings, loading } = useServicePricings();
	const [editor, setEditor] = (0, import_react.useState)(null);
	const [saving, setSaving] = (0, import_react.useState)(false);
	const [deletingPricing, setDeletingPricing] = (0, import_react.useState)(null);
	const [deletingPricingLoading, setDeletingPricingLoading] = (0, import_react.useState)(false);
	const platforms = [
		"Instagram",
		"TikTok",
		"X (Twitter)",
		"Facebook",
		"YouTube",
		"Telegram"
	];
	const PAGE_SIZE = 8;
	const [page, setPage] = (0, import_react.useState)(1);
	const totalPages = Math.max(1, Math.ceil(pricings.length / PAGE_SIZE));
	const safePage = Math.min(Math.max(1, page), totalPages);
	const paginatedPricings = (0, import_react.useMemo)(() => {
		const start = (safePage - 1) * PAGE_SIZE;
		return pricings.slice(start, start + PAGE_SIZE);
	}, [pricings, safePage]);
	const openCreate = () => setEditor({
		platform: "Instagram",
		service_type: CAMPAIGN_TYPES[0]?.name ?? "Like",
		price_per_buzzer: "",
		status: "Aktif"
	});
	const save = async () => {
		if (!editor?.platform || !editor.service_type?.trim() || Number(editor.price_per_buzzer) <= 0) {
			toast.error("Platform, jenis layanan, dan harga per buzzer wajib diisi.");
			return;
		}
		setSaving(true);
		try {
			const payload = {
				platform: editor.platform,
				service_type: editor.service_type.trim(),
				price_per_buzzer: Number(editor.price_per_buzzer),
				status: editor.status
			};
			if (editor.id) await updateServicePricing(editor.id, payload);
			else await createServicePricing(payload);
			toast.success(editor.id ? "Harga per buzzer diperbarui." : "Harga per buzzer ditambahkan.");
			setEditor(null);
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "Gagal menyimpan harga per buzzer.");
		} finally {
			setSaving(false);
		}
	};
	const handleDeletePricing = async () => {
		if (!deletingPricing?.id) return;
		setDeletingPricingLoading(true);
		try {
			await deleteServicePricing(deletingPricing.id);
			toast.success("Harga per buzzer berhasil dihapus.");
			if (editor?.id === deletingPricing.id) setEditor(null);
			setDeletingPricing(null);
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "Gagal menghapus harga per buzzer.");
		} finally {
			setDeletingPricingLoading(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "rounded-2xl border border-border bg-card shadow-sm",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center justify-between gap-3 border-b border-border p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-lg font-bold",
					children: "Harga Pesanan Sendiri"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "Tetapkan harga per buzzer untuk setiap platform dan jenis layanan."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					size: "sm",
					className: "gradient-brand text-brand-foreground",
					onClick: openCreate,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "mr-1 h-4 w-4" }), " Tambah Harga"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "overflow-x-auto",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Platform" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Jenis Layanan" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Harga / Buzzer" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Status" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
						className: "text-right",
						children: "Aksi"
					})
				] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableBody, { children: [
					loading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
						colSpan: 5,
						className: "py-8 text-center text-muted-foreground",
						children: "Memuat harga…"
					}) }),
					!loading && pricings.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
						colSpan: 5,
						className: "py-8 text-center text-muted-foreground",
						children: "Belum ada konfigurasi harga."
					}) }),
					paginatedPricings.map((pricing) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: pricing.platform }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: pricing.service_type }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
							className: "font-semibold",
							children: formatIDR$1(Number(pricing.price_per_buzzer))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: pricing.status === "Aktif" ? "Aktif" : "Dibatalkan" }) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
							className: "text-right",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex justify-end gap-2",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "sm",
									variant: "outline",
									className: "h-8 w-8 p-0",
									title: "Edit",
									"aria-label": "Edit",
									onClick: () => setEditor({
										...pricing,
										price_per_buzzer: String(pricing.price_per_buzzer)
									}),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "h-4 w-4" })
								})
							})
						})
					] }, pricing.id))
				] })] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TablePagination, {
				currentPage: safePage,
				totalItems: pricings.length,
				pageSize: PAGE_SIZE,
				onPageChange: setPage
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: !!editor,
				onOpenChange: (open) => !open && setEditor(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: editor?.id ? "Edit Harga Per Buzzer" : "Tambah Harga Per Buzzer" }) }),
					editor && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-3 sm:grid-cols-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Platform" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: editor.platform,
								onValueChange: (platform) => setEditor({
									...editor,
									platform
								}),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: platforms.map((platform) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: platform,
									children: platform
								}, platform)) })]
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Jenis Layanan" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: editor.service_type,
								onValueChange: (service_type) => setEditor({
									...editor,
									service_type
								}),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: CAMPAIGN_TYPES.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: item.name,
									children: item.name
								}, item.name)) })]
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Harga Per Buzzer" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "number",
								min: "1",
								value: editor.price_per_buzzer,
								onChange: (event) => setEditor({
									...editor,
									price_per_buzzer: event.target.value
								})
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Status" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: editor.status,
								onValueChange: (status) => setEditor({
									...editor,
									status
								}),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "Aktif",
									children: "Aktif"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "Nonaktif",
									children: "Nonaktif"
								})] })]
							})] })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
						className: "flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-between",
						children: [editor?.id ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							variant: "destructive",
							onClick: () => setDeletingPricing(editor),
							className: "h-9 w-9 p-0 sm:mr-auto",
							title: "Hapus",
							"aria-label": "Hapus",
							disabled: saving,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-end gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								onClick: () => setEditor(null),
								disabled: saving,
								children: "Batal"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								className: "gradient-brand text-brand-foreground",
								disabled: saving,
								onClick: save,
								children: saving ? "Menyimpan..." : "Simpan"
							})]
						})]
					})
				] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialog, {
				open: !!deletingPricing,
				onOpenChange: (open) => {
					if (!open && !deletingPricingLoading) setDeletingPricing(null);
				},
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogTitle, { children: "Hapus Konfigurasi Harga?" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogDescription, { children: [
					"Apakah Anda yakin ingin menghapus konfigurasi harga ",
					deletingPricing?.platform,
					" - ",
					deletingPricing?.service_type,
					"? Tindakan ini tidak dapat dibatalkan."
				] })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogCancel, {
					disabled: deletingPricingLoading,
					children: "Batal"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogAction, {
					className: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
					disabled: deletingPricingLoading,
					onClick: (e) => {
						e.preventDefault();
						handleDeletePricing();
					},
					children: deletingPricingLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-1 h-4 w-4 animate-spin" }), " Menghapus..."] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "mr-1 h-4 w-4" }), " Hapus Harga"] })
				})] })] })
			})
		]
	});
}
function ManajemenUserSection() {
	const [stats, setStats] = (0, import_react.useState)({
		totalCustomer: 0,
		activeCustomer: 0,
		totalBuzzer: 0,
		activeBuzzer: 0
	});
	(0, import_react.useEffect)(() => {
		let active = true;
		Promise.all([
			supabase.from("app_accounts").select("role, active"),
			supabase.from("customer_accounts").select("active"),
			supabase.from("buzzer_profiles").select("email")
		]).then(([appRes, custRes, buzRes]) => {
			if (!active) return;
			const apps = appRes.data || [];
			const customers = apps.filter((a) => a.role === "customer");
			const buzzers = apps.filter((a) => a.role === "buzzer");
			const totalCust = Math.max(customers.length, custRes.data?.length || 0);
			const activeCust = Math.max(customers.filter((a) => a.active !== false).length, custRes.data?.filter((c) => c.active !== false).length || 0);
			const totalBuz = Math.max(buzzers.length, buzRes.data?.length || 0);
			const activeBuz = Math.max(buzzers.filter((a) => a.active !== false).length, buzRes.data?.length || 0);
			setStats({
				totalCustomer: totalCust,
				activeCustomer: activeCust,
				totalBuzzer: totalBuz,
				activeBuzzer: activeBuz
			});
		});
		return () => {
			active = false;
		};
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Total Customer",
					value: stats.totalCustomer.toString(),
					hint: "Akun brand & klien",
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-5 w-5" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Customer Aktif",
					value: stats.activeCustomer.toString(),
					hint: "Dapat memesan kampanye",
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-5 w-5" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Total Buzzer",
					value: stats.totalBuzzer.toString(),
					hint: "Akun buzzer terdaftar",
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "h-5 w-5" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Buzzer Siap Kerja",
					value: stats.activeBuzzer.toString(),
					hint: "Status aktif & terverifikasi",
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Activity, { className: "h-5 w-5" })
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
			defaultValue: "customer",
			className: "space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, {
					className: "grid w-full grid-cols-2 sm:w-auto",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
						value: "customer",
						className: "gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-4 w-4" }), " Customer"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
						value: "buzzer",
						className: "gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "h-4 w-4" }), " Buzzer"]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
					value: "customer",
					className: "mt-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CustomerSection, {})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
					value: "buzzer",
					className: "mt-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BuzzerSection, {})
				})
			]
		})]
	});
}
var platformIcon = (p) => {
	if (p === "Instagram") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Instagram, { className: "h-4 w-4" });
	if (p === "TikTok") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Music2, { className: "h-4 w-4" });
	if (p === "X (Twitter)") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Twitter, { className: "h-4 w-4" });
	if (p === "YouTube") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Youtube, { className: "h-4 w-4" });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Facebook, { className: "h-4 w-4" });
};
var normalizePlatform = (value) => {
	if (!value) return "-";
	if (value === "X" || value === "X (Twitter)" || value === "Twitter") return "X (Twitter)";
	return value;
};
var toBuzzerRowFromAccount = (row) => ({
	id: row.email,
	name: row.name || "-",
	username: row.username || "-",
	platform: normalizePlatform(row.platform),
	followers: row.followers ?? 0,
	rating: 4.8,
	jobs: 0,
	status: "Aktif",
	earnings: 0,
	avatar_url: row.avatar_url || null
});
var buildDefaultBuzzerExtra = (row) => ({
	email: row.id,
	phone: "-",
	city: "-",
	joinDate: "-",
	bio: "-",
	bank: "-",
	completionRate: 0,
	responseTime: "-",
	completedJobsCount: row.jobs || 0,
	recentJobs: [],
	earnings: [],
	withdrawals: [],
	socialAccounts: [],
	level: "-",
	verifiedAt: "-",
	rating: null
});
var mergeCustomerRows = (_prev, incoming) => {
	return incoming;
};
function BuzzerSection() {
	const [q, setQ] = (0, import_react.useState)("");
	const [plat, setPlat] = (0, import_react.useState)("Semua");
	const [rows, setRows] = (0, import_react.useState)([]);
	const [details, setDetails] = (0, import_react.useState)({});
	const [openId, setOpenId] = (0, import_react.useState)(null);
	const [editOpen, setEditOpen] = (0, import_react.useState)(false);
	const [editDraft, setEditDraft] = (0, import_react.useState)(null);
	const [deleteId, setDeleteId] = (0, import_react.useState)(null);
	const loadRows = (0, import_react.useCallback)(async () => {
		const [applicationsResult, accountsResult, socialResult, walletsResult, jobsResult, withdrawalsResult, submissionsResult] = await Promise.all([
			supabase.from("buzzer_applications").select("*").eq("status", "approved"),
			supabase.from("app_accounts").select("*").order("created_at", { ascending: false }),
			supabase.from("social_accounts").select("*"),
			supabase.from("buzzer_wallets").select("*"),
			supabase.from("campaign_jobs").select("*").not("buzzer_email", "is", null),
			supabase.from("withdrawals").select("*"),
			supabase.from("campaign_job_submissions").select("*")
		]);
		const { data: applications, error: applicationsError } = applicationsResult;
		const { data, error } = accountsResult;
		if (applicationsError || error || !data) return;
		const accountsByEmail = new Map(data.filter((account) => account.role.trim().toLowerCase() === "buzzer").map((account) => [account.email.trim().toLowerCase(), account]));
		const approved = new Map((applications ?? []).map((application) => [application.email.trim().toLowerCase(), application]));
		const accounts = Array.from(/* @__PURE__ */ new Set([...data.filter((account) => account.role.trim().toLowerCase() === "buzzer").map((a) => a.email.trim().toLowerCase()), ...(applications ?? []).map((a) => a.email.trim().toLowerCase())])).map((email) => {
			const app = approved.get(email);
			return accountsByEmail.get(email) ?? {
				email,
				name: app?.name || "Buzzer",
				role: "buzzer",
				phone: app?.phone || null,
				city: app?.city || null,
				bio: app?.bio || null,
				industry: app?.category || null,
				username: app?.username || `@${app?.name?.toLowerCase().replace(/[^a-z0-9]/g, "") || "buzzer"}`,
				platform: app?.platform || "Instagram",
				followers: app?.followers || 0,
				created_at: app?.submitted_at || (/* @__PURE__ */ new Date()).toISOString()
			};
		});
		const socialAccounts = socialResult.data ?? [];
		const wallets = walletsResult.data ?? [];
		const jobs = jobsResult.data ?? [];
		const withdrawals = withdrawalsResult.data ?? [];
		const submissions = submissionsResult?.data ?? [];
		const mapped = accounts.map((row) => {
			const email = row.email.trim().toLowerCase();
			const wallet = wallets.find((item) => (item.buzzer_email ?? "").trim().toLowerCase() === email);
			const buzzerJobs = jobs.filter((item) => (item.buzzer_email ?? "").trim().toLowerCase() === email || row.name && (item.buzzer_name ?? "").trim().toLowerCase() === row.name.trim().toLowerCase());
			const subCount = submissions.filter((s) => (s.buzzer_email ?? "").trim().toLowerCase() === email).filter((s) => s.status === "Selesai" || s.status === "Review").length;
			let localJobsCount = 0;
			try {
				const raw = typeof window !== "undefined" ? localStorage.getItem(`buzzhub.buzzer.${email}`) : null;
				if (raw) {
					const parsed = JSON.parse(raw);
					const rawJobs = Array.isArray(parsed?.jobs) ? parsed.jobs : [];
					const localCompleted = rawJobs.filter((j) => j.status === "Selesai" || Boolean(j.admin_verified_at) || j.status === "Review" || Boolean(j.proofUrl)).length;
					localJobsCount = Math.max(Number(parsed?.profile?.jobsCompleted ?? 0), localCompleted, rawJobs.length);
				}
			} catch {}
			const finishedJobs = buzzerJobs.filter((item) => item.status === "Selesai" || Boolean(item.admin_verified_at));
			const reviewJobs = buzzerJobs.filter((item) => (item.status === "Review" || Boolean(item.proof_url)) && item.status !== "Selesai" && !item.admin_verified_at);
			const calculatedJobsCount = Math.max(finishedJobs.length + reviewJobs.length > 0 ? finishedJobs.length + reviewJobs.length : buzzerJobs.length, subCount, localJobsCount, Number(wallet?.campaigns_completed ?? 0));
			return {
				...toBuzzerRowFromAccount(row),
				id: row.email,
				status: "Aktif",
				rating: Number(wallet?.rating ?? 0),
				jobs: calculatedJobsCount,
				earnings: buzzerJobs.filter((item) => item.status === "Selesai" || Boolean(item.admin_verified_at)).reduce((total, item) => total + Number(item.buzzer_amount ?? item.payout ?? 0), 0)
			};
		});
		const nextDetails = {};
		for (const row of accounts) {
			const email = row.email.trim().toLowerCase();
			const application = approved.get(email);
			const wallet = wallets.find((item) => (item.buzzer_email ?? "").trim().toLowerCase() === email);
			const buzzerJobs = jobs.filter((item) => (item.buzzer_email ?? "").trim().toLowerCase() === email || row.name && (item.buzzer_name ?? "").trim().toLowerCase() === row.name.trim().toLowerCase());
			const subCount = submissions.filter((s) => (s.buzzer_email ?? "").trim().toLowerCase() === email).filter((s) => s.status === "Selesai" || s.status === "Review").length;
			let localJobsCount = 0;
			let localJobs = [];
			try {
				const raw = typeof window !== "undefined" ? localStorage.getItem(`buzzhub.buzzer.${email}`) : null;
				if (raw) {
					const parsed = JSON.parse(raw);
					const rawJobs = Array.isArray(parsed?.jobs) ? parsed.jobs : [];
					const localCompleted = rawJobs.filter((j) => j.status === "Selesai" || Boolean(j.admin_verified_at) || j.status === "Review" || Boolean(j.proofUrl)).length;
					localJobsCount = Math.max(Number(parsed?.profile?.jobsCompleted ?? 0), localCompleted, rawJobs.length);
					localJobs = rawJobs.map((j) => ({
						id: j.id,
						title: j.title || "Job Kampanye",
						brand: "-",
						date: j.updatedAt || j.deadline || (/* @__PURE__ */ new Date()).toISOString(),
						status: j.status || "Selesai",
						admin_verified_at: j.admin_verified_at,
						payout: Number(j.payout || 0)
					}));
				}
			} catch {}
			const finishedJobs = buzzerJobs.filter((item) => item.status === "Selesai" || Boolean(item.admin_verified_at));
			const reviewJobs = buzzerJobs.filter((item) => (item.status === "Review" || Boolean(item.proof_url)) && item.status !== "Selesai" && !item.admin_verified_at);
			const calculatedJobsCount = Math.max(finishedJobs.length + reviewJobs.length > 0 ? finishedJobs.length + reviewJobs.length : buzzerJobs.length, subCount, localJobsCount, Number(wallet?.campaigns_completed ?? 0));
			const mergedJobsMap = /* @__PURE__ */ new Map();
			buzzerJobs.forEach((job) => {
				mergedJobsMap.set(job.id, {
					id: job.id,
					title: job.campaign_title,
					brand: "-",
					date: job.created_at,
					status: job.status,
					admin_verified_at: job.admin_verified_at,
					payout: Number(job.buzzer_amount ?? job.payout ?? 0)
				});
			});
			localJobs.forEach((lj) => {
				if (!mergedJobsMap.has(lj.id)) mergedJobsMap.set(lj.id, lj);
			});
			const buzzerWithdrawals = withdrawals.filter((item) => (item.buzzer_email ?? "").trim().toLowerCase() === email);
			const detailItem = {
				email: row.email,
				phone: row.phone || application?.phone || "-",
				city: row.city || application?.city || "-",
				joinDate: application?.submitted_at || row.created_at || "-",
				bio: row.bio || application?.bio || "-",
				bank: "-",
				completionRate: buzzerJobs.length > 0 ? Math.round(finishedJobs.length / buzzerJobs.length * 100) : 0,
				responseTime: "-",
				completedJobsCount: calculatedJobsCount,
				recentJobs: Array.from(mergedJobsMap.values()),
				earnings: finishedJobs.map((job) => ({
					id: job.id,
					date: job.updated_at || job.created_at,
					source: job.campaign_title,
					amount: Number(job.buzzer_amount ?? job.payout ?? 0),
					status: "Berhasil"
				})),
				withdrawals: buzzerWithdrawals.map((withdrawal) => ({
					id: withdrawal.id,
					date: withdrawal.requested_at,
					amount: Number(withdrawal.amount || 0),
					method: withdrawal.method,
					status: withdrawal.status
				})),
				socialAccounts: socialAccounts.filter((account) => (account.buzzer_email ?? "").trim().toLowerCase() === email).map((account) => ({
					id: account.id,
					platform: account.platform,
					username: account.username,
					profileUrl: account.profile_url,
					followers: account.followers,
					verification: account.verification
				})),
				level: wallet?.level || "-",
				verifiedAt: wallet?.level_assigned_at || "-",
				rating: wallet?.rating == null ? null : Number(wallet.rating)
			};
			nextDetails[row.email] = detailItem;
			nextDetails[email] = detailItem;
		}
		setRows(mapped);
		setDetails(nextDetails);
	}, []);
	(0, import_react.useEffect)(() => {
		loadRows();
		const channel = supabase.channel("admin-buzzer-accounts").on("postgres_changes", {
			event: "*",
			schema: "public",
			table: "app_accounts"
		}, () => {
			loadRows();
		}).on("postgres_changes", {
			event: "*",
			schema: "public",
			table: "buzzer_applications"
		}, () => {
			loadRows();
		}).on("postgres_changes", {
			event: "*",
			schema: "public",
			table: "social_accounts"
		}, () => {
			loadRows();
		}).on("postgres_changes", {
			event: "*",
			schema: "public",
			table: "buzzer_wallets"
		}, () => {
			loadRows();
		}).on("postgres_changes", {
			event: "*",
			schema: "public",
			table: "campaign_jobs"
		}, () => {
			loadRows();
		}).on("postgres_changes", {
			event: "*",
			schema: "public",
			table: "withdrawals"
		}, () => {
			loadRows();
		}).subscribe();
		return () => {
			supabase.removeChannel(channel);
		};
	}, [loadRows]);
	const filtered = rows.filter((b) => b.name.toLowerCase().includes(q.toLowerCase()) && (plat === "Semua" || b.platform === plat));
	const [page, setPage] = (0, import_react.useState)(1);
	const PAGE_SIZE = 8;
	(0, import_react.useEffect)(() => {
		setPage(1);
	}, [q, plat]);
	const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
	const safePage = Math.min(Math.max(1, page), totalPages);
	const paginatedBuzzers = (0, import_react.useMemo)(() => {
		const start = (safePage - 1) * PAGE_SIZE;
		return filtered.slice(start, start + PAGE_SIZE);
	}, [filtered, safePage]);
	const current = openId ? rows.find((b) => b.id === openId || b.id.trim().toLowerCase() === openId.trim().toLowerCase()) : null;
	const extra = current ? details[current.id] ?? details[current.id.trim().toLowerCase()] ?? buildDefaultBuzzerExtra(current) : null;
	const openEdit = () => {
		if (!current) return;
		setEditDraft({ ...current });
		setEditOpen(true);
	};
	const saveEdit = async () => {
		if (!editDraft) return;
		const emailLc = editDraft.id.trim().toLowerCase();
		await Promise.all([supabase.from("app_accounts").update({
			name: editDraft.name,
			username: editDraft.username,
			platform: editDraft.platform,
			followers: editDraft.followers
		}).eq("email", emailLc), supabase.from("buzzer_applications").update({
			name: editDraft.name,
			username: editDraft.username,
			platform: editDraft.platform,
			followers: editDraft.followers
		}).eq("email", emailLc)]);
		if (editDraft.platform) {
			const { data: existingSoc } = await supabase.from("social_accounts").select("id").eq("buzzer_email", emailLc).ilike("platform", editDraft.platform).maybeSingle();
			if (existingSoc) await supabase.from("social_accounts").update({
				verification: "Terverifikasi",
				is_active: true,
				followers: editDraft.followers,
				username: editDraft.username
			}).eq("id", existingSoc.id);
			else await supabase.from("social_accounts").insert({
				buzzer_email: emailLc,
				buzzer_name: editDraft.name,
				platform: editDraft.platform,
				username: editDraft.username,
				account_name: editDraft.name,
				profile_url: "",
				followers: editDraft.followers,
				following_count: 0,
				posts: 0,
				category: "Umum",
				bio: "",
				verification: "Terverifikasi",
				is_active: true
			});
		}
		setRows((prev) => prev.map((b) => b.id === editDraft.id ? editDraft : b));
		toast.success("Data buzzer berhasil diperbarui.");
		setEditOpen(false);
		loadRows();
	};
	const confirmDelete = async (event) => {
		event?.preventDefault();
		if (!deleteId) return;
		const name = rows.find((b) => b.id === deleteId)?.name ?? "Buzzer";
		try {
			const { error } = await supabase.rpc("delete_management_account", {
				p_email: deleteId,
				p_role: "buzzer"
			});
			if (error) throw error;
		} catch (error) {
			console.error("Gagal menghapus akun buzzer:", error);
			toast.error(error instanceof Error ? error.message : "Akun buzzer gagal dihapus.");
			return;
		}
		setRows((prev) => prev.filter((b) => b.id !== deleteId));
		setDeleteId(null);
		setOpenId(null);
		toast.success(`Akun ${name} dihapus permanen.`);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative min-w-0 flex-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: q,
						onChange: (e) => setQ(e.target.value),
						className: "pl-9",
						placeholder: "Cari nama buzzer..."
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
					value: plat,
					onValueChange: setPlat,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
						className: "w-44",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: [
						"Semua",
						"Instagram",
						"TikTok",
						"X (Twitter)",
						"YouTube",
						"Facebook"
					].map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
						value: p,
						children: p
					}, p)) })]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 sm:grid-cols-2 xl:grid-cols-3",
				children: [paginatedBuzzers.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => setOpenId(b.id),
					className: "group rounded-2xl border border-border bg-card p-5 text-left shadow-sm transition hover:border-primary/50 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-primary",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Avatar, {
									className: "h-12 w-12 border border-border",
									children: [b.avatar_url && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarImage, {
										src: b.avatar_url,
										alt: b.name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarFallback, {
										className: "gradient-brand text-brand-foreground",
										children: b.name.split(" ").map((n) => n[0]).join("").slice(0, 2)
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0 flex-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BuzzerNameLink, {
										name: b.name,
										email: b.id,
										variant: "hover-primary",
										className: "truncate block text-sm font-semibold"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "truncate text-xs text-muted-foreground",
										children: b.username
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: b.status })
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 grid grid-cols-3 gap-2 text-center",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-lg bg-muted/40 p-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mx-auto mb-1 grid h-7 w-7 place-items-center rounded-md gradient-brand text-brand-foreground",
										children: platformIcon(b.platform)
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[10px] text-muted-foreground",
										children: b.platform
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-lg bg-muted/40 p-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-sm font-bold",
										children: [(b.followers / 1e3).toFixed(1), "K"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[10px] text-muted-foreground",
										children: "Followers"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-lg bg-muted/40 p-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-sm font-bold",
										children: ["⭐ ", b.rating]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-[10px] text-muted-foreground",
										children: [b.jobs, " job selesai"]
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 flex items-center justify-between border-t border-border pt-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs text-muted-foreground",
								children: "Total pendapatan"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-bold text-gradient-brand",
								children: formatIDR$1(b.earnings)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 flex items-center justify-end gap-1 text-xs text-primary opacity-0 transition group-hover:opacity-100",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-3.5 w-3.5" }), " Lihat detail"]
						})
					]
				}, b.id)), filtered.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "col-span-full rounded-xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground",
					children: "Tidak ada buzzer ditemukan."
				})]
			}),
			filtered.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "overflow-hidden rounded-2xl border border-border bg-card shadow-sm",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TablePagination, {
					currentPage: safePage,
					totalItems: filtered.length,
					pageSize: PAGE_SIZE,
					onPageChange: setPage
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: !!openId,
				onOpenChange: (v) => !v && setOpenId(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogContent, {
					className: "max-h-[90vh] max-w-3xl overflow-y-auto",
					children: current && extra && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
							className: "flex items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Avatar, {
								className: "h-11 w-11 border border-border",
								children: [current.avatar_url && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarImage, {
									src: current.avatar_url,
									alt: current.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarFallback, {
									className: "gradient-brand text-brand-foreground",
									children: current.name.split(" ").map((n) => n[0]).join("").slice(0, 2)
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BuzzerNameLink, {
										name: current.name,
										email: current.id
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: current.status })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs font-normal text-muted-foreground",
									children: [
										current.username,
										" · ",
										extra.email
									]
								})]
							})]
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-4 sm:grid-cols-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-xl border border-border bg-muted/30 p-4 text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mb-2 font-semibold",
									children: "Informasi Kontak"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1 text-muted-foreground",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: ["📞 ", extra.phone] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: ["📍 ", extra.city] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
											"📅 Bergabung",
											" ",
											extra.joinDate === "-" ? "-" : new Date(extra.joinDate).toLocaleDateString("id-ID", {
												day: "numeric",
												month: "long",
												year: "numeric"
											})
										] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
											"✅ Verifikasi",
											" ",
											extra.verifiedAt === "-" ? "-" : new Date(extra.verifiedAt).toLocaleDateString("id-ID", {
												day: "numeric",
												month: "long",
												year: "numeric"
											})
										] })
									]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-xl border border-border bg-muted/30 p-4 text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mb-2 font-semibold",
									children: "Performa"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-2 gap-2 text-center",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "rounded-lg bg-background p-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-lg font-bold text-emerald-600 dark:text-emerald-400",
												children: extra.completedJobsCount ?? (extra.recentJobs.filter((j) => j.status === "Selesai" || Boolean(j.admin_verified_at) || j.status === "Review").length || extra.recentJobs.length)
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-[10px] text-muted-foreground",
												children: "Job Selesai"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "rounded-lg bg-background p-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-lg font-bold",
												children: extra.rating == null ? "-" : `⭐ ${extra.rating}`
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-[10px] text-muted-foreground",
												children: "Rating"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "rounded-lg bg-background p-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-lg font-bold",
												children: current.followers.toLocaleString("id-ID")
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-[10px] text-muted-foreground",
												children: "Followers"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "rounded-lg bg-background p-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-sm font-bold",
												children: extra.level
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-[10px] text-muted-foreground",
												children: "Level"
											})]
										})
									]
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl border border-border bg-muted/20 p-4 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mb-1 font-semibold",
								children: "Bio"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-muted-foreground",
								children: extra.bio
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl border border-border bg-muted/20 p-4 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mb-2 font-semibold",
								children: "Akun Media Sosial"
							}), extra.socialAccounts.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-muted-foreground",
								children: "-"
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "space-y-2",
								children: extra.socialAccounts.map((account) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between gap-3 rounded-lg bg-background p-2.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "font-medium text-sm",
											children: [
												account.platform,
												" · ",
												account.username
											]
										}),
										account.profileUrl && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
											href: account.profileUrl.startsWith("http") ? account.profileUrl : "https://" + account.profileUrl,
											target: "_blank",
											rel: "noreferrer",
											className: "mt-0.5 inline-flex items-center gap-1 font-mono text-xs text-primary hover:underline max-w-[200px] truncate",
											title: account.profileUrl,
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link2, { className: "h-3 w-3 shrink-0" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "truncate",
													children: account.profileUrl
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "h-2.5 w-2.5 shrink-0" })
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "flex items-center gap-1.5 mt-0.5",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: cn("rounded px-1.5 py-0.5 text-[10px] font-semibold", account.verification === "Terverifikasi" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300" : account.verification === "Ditolak" ? "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300" : "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300"),
												children: account.verification
											})
										})
									] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "font-semibold text-sm",
											children: [account.followers.toLocaleString("id-ID"), " followers"]
										}), account.verification === "Menunggu" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											size: "sm",
											className: "h-7 w-7 p-0 gradient-brand text-brand-foreground",
											title: "Setujui Akun",
											"aria-label": "Setujui Akun",
											onClick: async (e) => {
												e.stopPropagation();
												if (await adminApproveSocialAccount(account.id)) {
													toast.success(`Akun ${account.platform} ${account.username} berhasil disetujui!`);
													loadRows();
												} else toast.error("Gagal menyetujui akun media sosial.");
											},
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-3.5 w-3.5" })
										})]
									})]
								}, account.id))
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
							defaultValue: "jobs",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
										value: "jobs",
										children: [
											"Riwayat Job (",
											extra.recentJobs.length,
											")"
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
										value: "earnings",
										children: [
											"Penghasilan (",
											extra.earnings.length,
											")"
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
										value: "withdrawals",
										children: [
											"Penarikan (",
											extra.withdrawals.length,
											")"
										]
									})
								] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
									value: "jobs",
									className: "mt-3",
									children: extra.recentJobs.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "rounded-lg border border-dashed border-border p-6 text-center text-xs text-muted-foreground",
										children: "Belum ada job."
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Job" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Brand" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Tanggal" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Status" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
											className: "text-right",
											children: "Payout"
										})
									] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: extra.recentJobs.map((j) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
											className: "font-medium",
											children: j.title
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: j.brand }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
											className: "text-xs text-muted-foreground",
											children: j.date
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: j.status }) }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
											className: "text-right font-semibold",
											children: formatIDR$1(j.payout)
										})
									] }, j.id)) })] })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
									value: "earnings",
									className: "mt-3",
									children: extra.earnings.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "rounded-lg border border-dashed border-border p-6 text-center text-xs text-muted-foreground",
										children: "Belum ada penghasilan."
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Tanggal" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Sumber" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Status" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
											className: "text-right",
											children: "Jumlah"
										})
									] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: extra.earnings.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
											className: "text-xs text-muted-foreground",
											children: e.date
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: e.source }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: e.status }) }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
											className: "text-right font-semibold",
											children: formatIDR$1(e.amount)
										})
									] }, e.id)) })] })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
									value: "withdrawals",
									className: "mt-3",
									children: extra.withdrawals.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "rounded-lg border border-dashed border-border p-6 text-center text-xs text-muted-foreground",
										children: "Belum ada penarikan."
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Tanggal" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Metode" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Status" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
											className: "text-right",
											children: "Jumlah"
										})
									] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: extra.withdrawals.map((w) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
											className: "text-xs text-muted-foreground",
											children: w.date
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: w.method }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: w.status }) }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
											className: "text-right font-semibold",
											children: formatIDR$1(w.amount)
										})
									] }, w.id)) })] })
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
							className: "flex-col gap-2 sm:flex-row sm:justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "sm",
									variant: "outline",
									className: "h-8 w-8 p-0",
									title: "Edit Data",
									"aria-label": "Edit Data",
									onClick: openEdit,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "h-4 w-4" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "sm",
									variant: "destructive",
									className: "h-8 w-8 p-0",
									title: "Hapus Akun",
									"aria-label": "Hapus Akun",
									onClick: () => setDeleteId(current.id),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: "ghost",
								onClick: () => setOpenId(null),
								children: "Tutup"
							})]
						})
					] })
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: editOpen,
				onOpenChange: setEditOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "sm:max-w-lg",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Edit Data Buzzer" }) }),
						editDraft && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-3 sm:grid-cols-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "sm:col-span-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Nama Lengkap" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: editDraft.name,
										onChange: (e) => setEditDraft({
											...editDraft,
											name: e.target.value
										})
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Username" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: editDraft.username,
									onChange: (e) => setEditDraft({
										...editDraft,
										username: e.target.value
									})
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Platform" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: editDraft.platform,
									onValueChange: (v) => setEditDraft({
										...editDraft,
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
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Followers" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "number",
									placeholder: "0",
									value: editDraft.followers === 0 ? "" : editDraft.followers,
									onChange: (e) => setEditDraft({
										...editDraft,
										followers: e.target.value === "" ? 0 : Math.max(0, Number(e.target.value) || 0)
									})
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Rating" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "number",
									step: "0.1",
									min: "0",
									max: "5",
									placeholder: "0",
									value: editDraft.rating === 0 ? "" : editDraft.rating,
									onChange: (e) => setEditDraft({
										...editDraft,
										rating: e.target.value === "" ? 0 : Math.max(0, Number(e.target.value) || 0)
									})
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Status" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: editDraft.status,
									onValueChange: (v) => setEditDraft({
										...editDraft,
										status: v
									}),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: [
										"Aktif",
										"Verifikasi",
										"Suspend",
										"Nonaktif"
									].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: s,
										children: s
									}, s)) })]
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Total Pendapatan (Rp)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "number",
									placeholder: "0",
									value: editDraft.earnings === 0 ? "" : editDraft.earnings,
									onChange: (e) => setEditDraft({
										...editDraft,
										earnings: e.target.value === "" ? 0 : Math.max(0, Number(e.target.value) || 0)
									})
								})] })
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
							className: "flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								variant: "destructive",
								className: "h-9 w-9 p-0 sm:mr-auto",
								title: "Hapus Akun",
								"aria-label": "Hapus Akun",
								onClick: () => {
									if (!editDraft) return;
									const targetId = editDraft.id;
									setEditOpen(false);
									setDeleteId(targetId);
								},
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-end gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "outline",
									onClick: () => setEditOpen(false),
									children: "Batal"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									className: "gradient-brand text-brand-foreground",
									onClick: saveEdit,
									children: "Simpan Perubahan"
								})]
							})]
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialog, {
				open: !!deleteId,
				onOpenChange: (o) => !o && setDeleteId(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogTitle, { children: "Hapus akun buzzer ini?" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogDescription, { children: "Akun dan data profil buzzer akan dihapus. Riwayat job, pembayaran, rating, dan aktivitas keuangan tetap disimpan." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogCancel, { children: "Batal" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogAction, {
					onClick: confirmDelete,
					className: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
					children: "Hapus Permanen"
				})] })] })
			})
		]
	});
}
var toCustomerRowFromAccount = (row) => ({
	id: row.email,
	name: row.company || row.name,
	contact: row.email,
	campaigns: 0,
	spent: 0,
	since: (row.created_at ?? (/* @__PURE__ */ new Date()).toISOString()).slice(0, 10),
	phone: row.phone || "-",
	industry: row.industry || "-",
	city: row.city || "-",
	address: "-",
	website: "-",
	status: "-",
	notes: row.bio || "-"
});
function CustomerSection() {
	const [q, setQ] = (0, import_react.useState)("");
	const [selected, setSelected] = (0, import_react.useState)(null);
	const [rows, setRows] = (0, import_react.useState)([]);
	const [editDraft, setEditDraft] = (0, import_react.useState)(null);
	const [deleteId, setDeleteId] = (0, import_react.useState)(null);
	const { data: campaignRows } = useCampaigns();
	(0, import_react.useEffect)(() => {
		let active = true;
		const loadRows = async () => {
			const [{ data, error }, { data: customerAccounts }] = await Promise.all([supabase.from("app_accounts").select("*").order("created_at", { ascending: false }), supabase.from("customer_accounts").select("email, active")]);
			if (!active) return;
			if (!error && data) {
				const accountRows = data.filter((row) => row.role.trim().toLowerCase() === "customer");
				const accountsByEmail = new Map(accountRows.map((row) => [row.email.trim().toLowerCase(), row]));
				const customerProfiles = new Map((customerAccounts ?? []).map((row) => [row.email.trim().toLowerCase(), row]));
				const mapped = [.../* @__PURE__ */ new Set([...accountsByEmail.keys(), ...customerProfiles.keys()])].map((email) => {
					const account = accountsByEmail.get(email);
					const customerAccount = customerProfiles.get(email);
					const customer = account ? toCustomerRowFromAccount(account) : {
						id: email,
						name: customerAccount?.name || email,
						contact: email,
						campaigns: 0,
						spent: 0,
						since: "-",
						phone: "-",
						industry: "-",
						city: "-",
						address: "-",
						website: "-",
						status: "-",
						notes: "-"
					};
					const campaigns = campaignRows.filter((campaign) => campaign.customer_email.trim().toLowerCase() === email);
					return {
						...customer,
						status: customerAccount ? customerAccount.active ? "Aktif" : "Ditangguhkan" : customer.status,
						campaigns: campaigns.length,
						spent: campaigns.reduce((total, campaign) => total + Number(campaign.budget || 0), 0)
					};
				});
				setRows((prev) => mergeCustomerRows(prev, mapped));
			}
		};
		loadRows();
		const channel = supabase.channel("admin-customer-accounts").on("postgres_changes", {
			event: "*",
			schema: "public",
			table: "app_accounts"
		}, () => {
			loadRows();
		}).on("postgres_changes", {
			event: "*",
			schema: "public",
			table: "customer_accounts"
		}, () => {
			loadRows();
		}).on("postgres_changes", {
			event: "*",
			schema: "public",
			table: "campaigns"
		}, () => {
			loadRows();
		}).subscribe();
		return () => {
			active = false;
			supabase.removeChannel(channel);
		};
	}, [campaignRows]);
	const saveEdit = async () => {
		if (!editDraft) return;
		const phone = editDraft.phone.replace(/\D/g, "");
		await supabase.from("app_accounts").update({
			name: editDraft.name,
			company: editDraft.name,
			phone,
			industry: editDraft.industry,
			city: editDraft.city,
			bio: editDraft.notes
		}).eq("email", editDraft.id);
		const savedDraft = {
			...editDraft,
			phone
		};
		setRows((prev) => prev.map((r) => r.id === editDraft.id ? savedDraft : r));
		setSelected(savedDraft);
		setEditDraft(null);
		toast.success("Data customer diperbarui.");
	};
	const confirmDelete = async (event) => {
		event?.preventDefault();
		if (!deleteId) return;
		const targetEmail = deleteId.trim().toLowerCase();
		const name = rows.find((r) => r.id.toLowerCase() === targetEmail || r.contact.toLowerCase() === targetEmail)?.name ?? "Customer";
		try {
			const { error } = await supabase.rpc("delete_management_account", {
				p_email: targetEmail,
				p_role: "customer"
			});
			if (error) {
				console.warn("RPC delete_management_account failed, attempting direct table deletion:", error);
				const [del1, del2] = await Promise.all([supabase.from("customer_accounts").delete().ilike("email", targetEmail), supabase.from("app_accounts").delete().ilike("email", targetEmail)]);
				if (del1.error && del2.error) throw error;
			}
		} catch (error) {
			console.error("Gagal menghapus akun customer:", error);
			toast.error(error instanceof Error ? error.message : "Akun customer gagal dihapus.");
			return;
		}
		setRows((prev) => prev.filter((r) => r.id.toLowerCase() !== targetEmail && r.contact.toLowerCase() !== targetEmail));
		setDeleteId(null);
		setSelected(null);
		toast.success(`Akun ${name} berhasil dihapus permanen.`);
	};
	const filtered = (0, import_react.useMemo)(() => rows.filter((r) => q === "" || r.name.toLowerCase().includes(q.toLowerCase()) || r.contact.toLowerCase().includes(q.toLowerCase())), [rows, q]);
	const [page, setPage] = (0, import_react.useState)(1);
	const PAGE_SIZE = 8;
	(0, import_react.useEffect)(() => {
		setPage(1);
	}, [q]);
	const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
	const safePage = Math.min(Math.max(1, page), totalPages);
	const paginatedCustomers = (0, import_react.useMemo)(() => {
		const start = (safePage - 1) * PAGE_SIZE;
		return filtered.slice(start, start + PAGE_SIZE);
	}, [filtered, safePage]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-2xl border border-border bg-card shadow-sm",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center justify-between gap-3 border-b border-border p-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-display text-lg font-bold",
						children: "Klien Korporat"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm text-muted-foreground",
						children: [rows.length, " brand aktif menggunakan BuzzHub"]
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-wrap items-center gap-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: q,
								onChange: (e) => setQ(e.target.value),
								className: "w-48 pl-9 sm:w-56",
								placeholder: "Cari klien..."
							})]
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "overflow-x-auto",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Perusahaan" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Email" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Industri" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Kampanye" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Bergabung" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
							className: "text-right",
							children: "Total Spend"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
							className: "text-right",
							children: "Aksi"
						})
					] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableBody, { children: [paginatedCustomers.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, {
						className: "hover:bg-muted/40",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-medium",
								children: c.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs text-muted-foreground",
								children: [
									c.industry,
									" · ",
									c.city
								]
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
								className: "text-sm text-muted-foreground",
								children: c.contact
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
								className: "text-sm",
								children: c.industry || "-"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: c.campaigns }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
								className: "text-sm",
								children: c.since
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
								className: "text-right font-semibold",
								children: formatIDR$1(c.spent)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
								className: "text-right",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex justify-end gap-2",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "sm",
										variant: "outline",
										className: "h-8 w-8 p-0",
										title: "Detail",
										"aria-label": "Detail",
										onClick: () => setSelected(c),
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-4 w-4" })
									})
								})
							})
						]
					}, c.id)), filtered.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
						colSpan: 7,
						className: "py-10 text-center text-sm text-muted-foreground",
						children: "Tidak ada klien yang cocok."
					}) })] })] })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TablePagination, {
					currentPage: safePage,
					totalItems: filtered.length,
					pageSize: PAGE_SIZE,
					onPageChange: setPage
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open: !!selected,
			onOpenChange: (o) => !o && setSelected(null),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogContent, {
				className: "max-h-[85vh] overflow-y-auto sm:max-w-2xl",
				children: selected && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar, {
							className: "h-11 w-11",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarFallback, {
								className: "gradient-brand text-brand-foreground",
								children: selected.name.split(" ").map((n) => n[0]).join("").slice(0, 2)
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "truncate font-display text-lg font-bold",
								children: selected.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "truncate text-xs font-normal text-muted-foreground",
								children: selected.industry
							})]
						})]
					}) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-4 sm:grid-cols-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-xl border border-border bg-muted/40 p-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground",
									children: "Total Spend"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-display text-lg font-bold",
									children: formatIDR$1(selected.spent)
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-xl border border-border bg-muted/40 p-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground",
									children: "Kampanye"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-display text-lg font-bold",
									children: selected.campaigns
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-xl border border-border bg-muted/40 p-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground",
									children: "Status"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-display text-lg font-bold",
									children: selected.status
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-2 grid gap-3 rounded-xl border border-border p-4 text-sm sm:grid-cols-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, {
								label: "Email",
								value: selected.contact
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, {
								label: "Telepon",
								value: selected.phone
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, {
								label: "Kota",
								value: selected.city
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, {
								label: "Bergabung",
								value: selected.since
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-border p-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mb-2 text-sm font-semibold",
							children: "Riwayat Kampanye"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
							className: "space-y-2",
							children: [campaignRows.filter((k) => k.customer_email.toLowerCase() === selected.contact.toLowerCase()).map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex items-center justify-between gap-2 rounded-lg bg-muted/40 p-2 text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "truncate font-medium",
										children: k.title
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "truncate text-xs text-muted-foreground",
										children: [
											k.platform,
											" · ",
											k.deadline
										]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex shrink-0 items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: k.status }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs font-semibold",
										children: formatIDR$1(k.budget)
									})]
								})]
							}, k.id)), campaignRows.filter((k) => k.customer_email.toLowerCase() === selected.contact.toLowerCase()).length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
								className: "rounded-lg border border-dashed p-4 text-center text-xs text-muted-foreground",
								children: "Belum ada kampanye."
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-border p-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mb-1 text-sm font-semibold",
							children: "Deskripsi"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground",
							children: selected.notes
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
						className: "flex-col gap-2 sm:flex-row sm:justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								className: "h-9 w-9 p-0",
								title: "Edit",
								"aria-label": "Edit",
								onClick: () => {
									setEditDraft({ ...selected });
									setSelected(null);
								},
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "h-4 w-4" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "destructive",
								className: "h-9 w-9 p-0",
								title: "Hapus Akun",
								"aria-label": "Hapus Akun",
								onClick: () => setDeleteId(selected.id),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							onClick: () => setSelected(null),
							children: "Tutup"
						})]
					})
				] })
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open: !!editDraft,
			onOpenChange: (o) => !o && setEditDraft(null),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
				className: "max-h-[85vh] overflow-y-auto sm:max-w-lg",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Edit Customer" }) }),
					editDraft && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-3 sm:grid-cols-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "sm:col-span-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Nama Perusahaan" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: editDraft.name,
									onChange: (e) => setEditDraft({
										...editDraft,
										name: e.target.value
									})
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Email" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: editDraft.contact,
								onChange: (e) => setEditDraft({
									...editDraft,
									contact: e.target.value
								})
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Telepon" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								inputMode: "numeric",
								pattern: "[0-9]*",
								value: editDraft.phone,
								onChange: (e) => setEditDraft({
									...editDraft,
									phone: e.target.value.replace(/\D/g, "")
								})
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Industri" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: editDraft.industry,
								onChange: (e) => setEditDraft({
									...editDraft,
									industry: e.target.value
								})
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Kota" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: editDraft.city,
								onChange: (e) => setEditDraft({
									...editDraft,
									city: e.target.value
								})
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Status" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: editDraft.status,
								onValueChange: (v) => setEditDraft({
									...editDraft,
									status: v
								}),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: [
									"Aktif",
									"Prospek",
									"Ditangguhkan"
								].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: s,
									children: s
								}, s)) })]
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "sm:col-span-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Catatan" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
									value: editDraft.notes,
									onChange: (e) => setEditDraft({
										...editDraft,
										notes: e.target.value
									})
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
						className: "flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							variant: "destructive",
							className: "h-9 w-9 p-0 sm:mr-auto",
							title: "Hapus Akun",
							"aria-label": "Hapus Akun",
							onClick: () => {
								if (!editDraft) return;
								const targetId = editDraft.id;
								setEditDraft(null);
								setDeleteId(targetId);
							},
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-end gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								onClick: () => setEditDraft(null),
								children: "Batal"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								className: "gradient-brand text-brand-foreground",
								onClick: saveEdit,
								children: "Simpan Perubahan"
							})]
						})]
					})
				]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialog, {
			open: !!deleteId,
			onOpenChange: (o) => !o && setDeleteId(null),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogTitle, { children: [
				"Hapus akun customer ",
				rows.find((r) => r.id === deleteId)?.name ? `"${rows.find((r) => r.id === deleteId)?.name}"` : "ini",
				"?"
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogDescription, { children: [
				"Akun dan data profil customer (",
				deleteId,
				") akan dihapus. Riwayat campaign, pembayaran, dan aktivitas keuangan tetap disimpan."
			] })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogCancel, { children: "Batal" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogAction, {
				onClick: confirmDelete,
				className: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
				children: "Hapus Permanen"
			})] })] })
		})
	] });
}
function Info({ label, value, full }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: full ? "sm:col-span-2" : void 0,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-xs text-muted-foreground",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "font-medium",
			children: value
		})]
	});
}
function AdminPasswordField({ field, label, value, visible, onChange, onToggleVisibility }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: label }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative mt-1",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
			type: visible ? "text" : "password",
			value,
			onChange: (event) => onChange(event.target.value),
			autoComplete: field === "current" ? "current-password" : "new-password",
			className: "pr-10"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			"aria-label": visible ? `Sembunyikan ${label}` : `Tampilkan ${label}`,
			onClick: onToggleVisibility,
			className: "absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground",
			children: visible ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-4 w-4" })
		})]
	})] });
}
function PengaturanSection() {
	const session = useSession();
	const { theme, setTheme } = useTheme();
	const [tab, setTab] = (0, import_react.useState)("profil");
	const [name, setName] = (0, import_react.useState)(session?.name ?? "");
	const [phone, setPhone] = (0, import_react.useState)(session?.phone ?? "");
	const [timezone, setTimezone] = (0, import_react.useState)(() => typeof window !== "undefined" ? localStorage.getItem("buzzhub.admin.timezone") ?? "Asia/Jakarta" : "Asia/Jakarta");
	const [saving, setSaving] = (0, import_react.useState)(false);
	const [passwordSaving, setPasswordSaving] = (0, import_react.useState)(false);
	const [passwords, setPasswords] = (0, import_react.useState)({
		current: "",
		next: "",
		confirm: ""
	});
	const [visible, setVisible] = (0, import_react.useState)({
		current: false,
		next: false,
		confirm: false
	});
	(0, import_react.useEffect)(() => {
		if (session) {
			setName(session.name);
			setPhone(session.phone?.replace(/\D/g, "") ?? "");
		}
	}, [session]);
	const initials = (session?.name ?? "A").split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase();
	const saveProfile = async (event) => {
		event.preventDefault();
		if (!session || !name.trim()) return toast.error("Nama lengkap wajib diisi.");
		setSaving(true);
		try {
			const result = await updateAccountFn({ data: {
				email: session.email,
				name,
				phone,
				timezone
			} });
			if (!result.ok) return toast.error(result.message);
			setSession({
				...session,
				name: name.trim(),
				phone: phone.trim()
			});
			localStorage.setItem("buzzhub.admin.timezone", timezone);
			toast.success("Perubahan berhasil disimpan");
		} catch {
			toast.error("Gagal menyimpan perubahan");
		} finally {
			setSaving(false);
		}
	};
	const savePassword = async (event) => {
		event.preventDefault();
		if (!session) return;
		if (passwords.next.length < 8) return toast.error("Password baru minimal 8 karakter.");
		if (passwords.next !== passwords.confirm) return toast.error("Konfirmasi password belum sesuai.");
		setPasswordSaving(true);
		try {
			const result = await updateAccountFn({ data: {
				email: session.email,
				name: session.name,
				currentPassword: passwords.current,
				newPassword: passwords.next
			} });
			if (!result.ok) return toast.error(result.message);
			setPasswords({
				current: "",
				next: "",
				confirm: ""
			});
			toast.success("Password berhasil diperbarui");
		} catch {
			toast.error("Gagal menyimpan password");
		} finally {
			setPasswordSaving(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Peran Akun",
					value: "Super Admin",
					hint: "Hak akses penuh sistem",
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-5 w-5" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Email Terdaftar",
					value: session?.email || "admin@buzzhub.id",
					hint: "Akun terautentikasi",
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "h-5 w-5" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Zona Waktu",
					value: timezone,
					hint: "Operasional aplikasi",
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Earth, { className: "h-5 w-5" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Tema Tampilan",
					value: theme === "dark" ? "Dark Mode" : "Light Mode",
					hint: "Preferensi antarmuka",
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Palette, { className: "h-5 w-5" })
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
			value: tab,
			onValueChange: setTab,
			className: "space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, {
					className: "flex w-full justify-start gap-1 overflow-x-auto rounded-xl p-1 sm:grid sm:grid-cols-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
							value: "profil",
							children: "Profil"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
							value: "keamanan",
							children: "Keamanan"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
							value: "preferensi",
							children: "Preferensi Sistem"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
					value: "profil",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: saveProfile,
						className: "rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-4 border-b border-border pb-5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar, {
									className: "h-16 w-16",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarFallback, {
										className: "gradient-brand text-brand-foreground",
										children: initials
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-display text-lg font-bold",
									children: session?.name || "Memuat profil"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-muted-foreground",
									children: "Super Administrator"
								})] })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-5 grid gap-4 sm:grid-cols-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Nama Lengkap" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: name,
										onChange: (event) => setName(event.target.value)
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Email" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: session?.email ?? "",
										readOnly: true,
										className: "bg-muted/40"
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "No. WhatsApp" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										inputMode: "numeric",
										pattern: "[0-9]*",
										value: phone,
										onChange: (event) => setPhone(event.target.value.replace(/\D/g, ""))
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Zona Waktu" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
										value: timezone,
										onValueChange: setTimezone,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "Asia/Jakarta",
												children: "WIB (UTC+7)"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "Asia/Makassar",
												children: "WITA (UTC+8)"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "Asia/Jayapura",
												children: "WIT (UTC+9)"
											})
										] })]
									})] })
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-6 flex justify-end",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									type: "submit",
									disabled: saving,
									className: "gradient-brand text-brand-foreground",
									children: [
										saving && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "mr-2 h-4 w-4" }),
										" Simpan Perubahan"
									]
								})
							})
						]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
					value: "keamanan",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-4 sm:grid-cols-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-2xl border border-border bg-card p-5 shadow-sm",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-5 w-5 text-emerald-500" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-3 text-sm text-muted-foreground",
										children: "Status keamanan akun"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-semibold",
										children: "Password aktif"
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-2xl border border-border bg-card p-5 shadow-sm",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "h-5 w-5 text-primary" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-3 text-sm text-muted-foreground",
										children: "Verifikasi email"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-semibold",
										children: "Belum tersedia"
									})
								]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
							onSubmit: savePassword,
							className: "rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2 font-semibold",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KeyRound, { className: "h-4 w-4" }), " Ganti Password"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-sm text-muted-foreground",
									children: "Password disimpan sebagai hash dan tidak pernah ditampilkan."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-5 grid gap-4 sm:grid-cols-3",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminPasswordField, {
											field: "current",
											label: "Password Lama",
											value: passwords.current,
											visible: visible.current,
											onChange: (value) => setPasswords((current) => ({
												...current,
												current: value
											})),
											onToggleVisibility: () => setVisible((current) => ({
												...current,
												current: !current.current
											}))
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminPasswordField, {
											field: "next",
											label: "Password Baru",
											value: passwords.next,
											visible: visible.next,
											onChange: (value) => setPasswords((current) => ({
												...current,
												next: value
											})),
											onToggleVisibility: () => setVisible((current) => ({
												...current,
												next: !current.next
											}))
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminPasswordField, {
											field: "confirm",
											label: "Konfirmasi Password Baru",
											value: passwords.confirm,
											visible: visible.confirm,
											onChange: (value) => setPasswords((current) => ({
												...current,
												confirm: value
											})),
											onToggleVisibility: () => setVisible((current) => ({
												...current,
												confirm: !current.confirm
											}))
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-5 flex justify-end",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										disabled: passwordSaving,
										className: "gradient-brand text-brand-foreground",
										children: [passwordSaving && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }), " Simpan Password"]
									})
								})
							]
						})]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
					value: "preferensi",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: (event) => {
							event.preventDefault();
							localStorage.setItem("buzzhub.admin.timezone", timezone);
							toast.success("Perubahan berhasil disimpan");
						},
						className: "rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3 border-b border-border pb-5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Palette, { className: "h-5 w-5 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-semibold",
									children: "Preferensi BuzzHub"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-muted-foreground",
									children: "Konfigurasi tampilan dan format yang digunakan dashboard."
								})] })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-5 grid gap-4 sm:grid-cols-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Nama aplikasi" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: "BuzzHub",
										readOnly: true
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Mata uang" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
										value: "IDR",
										disabled: true,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "IDR",
											children: "IDR (Rupiah)"
										}) })]
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Zona waktu" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
										value: timezone,
										onValueChange: setTimezone,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "Asia/Jakarta",
												children: "WIB (UTC+7)"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "Asia/Makassar",
												children: "WITA (UTC+8)"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "Asia/Jayapura",
												children: "WIT (UTC+9)"
											})
										] })]
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Bahasa" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
										value: "id",
										disabled: true,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "id",
											children: "Indonesia"
										}) })]
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Tema tampilan" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
										value: theme,
										onValueChange: (value) => setTheme(value),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "dark",
											children: "Dark mode"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "light",
											children: "Light mode"
										})] })]
									})] })
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-6 flex justify-end",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									className: "gradient-brand text-brand-foreground",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "mr-2 h-4 w-4" }), " Simpan Preferensi"]
								})
							})
						]
					})
				})
			]
		})]
	});
}
function VerifikasiSection({ mode = "accounts" }) {
	const apps = useBuzzerApplications();
	const { data: rawJobs, refetch: refetchJobs } = useCampaignJobs();
	const { data: rawCompletedJobs, refetch: refetchCompletedJobs } = useCompletedCampaignJobs();
	const assignedLevels = useAssignedLevels();
	useBuzzerLevels();
	const { data: submissions, loading: submissionsLoading, error: submissionsError, refetch: refetchSubmissions } = useCampaignJobSubmissions();
	const session = useSession();
	const [filter, setFilter] = (0, import_react.useState)("semua");
	const [detail, setDetail] = (0, import_react.useState)(null);
	const [rejectFor, setRejectFor] = (0, import_react.useState)(null);
	const [note, setNote] = (0, import_react.useState)("");
	const [jobDetail, setJobDetail] = (0, import_react.useState)(null);
	const [jobNote, setJobNote] = (0, import_react.useState)("");
	const [rejectJobFor, setRejectJobFor] = (0, import_react.useState)(null);
	const [jobRejectReason, setJobRejectReason] = (0, import_react.useState)("");
	const [jobFilter, setJobFilter] = (0, import_react.useState)("semua");
	const [approveBuzzerFor, setApproveBuzzerFor] = (0, import_react.useState)(null);
	const [approveJobFor, setApproveJobFor] = (0, import_react.useState)(null);
	const [busyJobId, setBusyJobId] = (0, import_react.useState)(null);
	const [busyAppId, setBusyAppId] = (0, import_react.useState)(null);
	const [buzzerAvatars, setBuzzerAvatars] = (0, import_react.useState)(/* @__PURE__ */ new Map());
	const [optimisticJobUpdates, setOptimisticJobUpdates] = (0, import_react.useState)(/* @__PURE__ */ new Map());
	(0, import_react.useEffect)(() => {
		if (optimisticJobUpdates.size === 0) return;
		setOptimisticJobUpdates((prev) => {
			let changed = false;
			const next = new Map(prev);
			for (const [id, opt] of prev.entries()) {
				const found = rawJobs.find((j) => j.id === id);
				if (opt.deleted) {
					if (!found) {
						next.delete(id);
						changed = true;
					}
				} else if (found) {
					const statusMatch = !opt.status || found.status === opt.status;
					const verifiedMatch = opt.admin_verified_at === void 0 || Boolean(found.admin_verified_at) === Boolean(opt.admin_verified_at);
					if (statusMatch && verifiedMatch) {
						next.delete(id);
						changed = true;
					}
				}
			}
			return changed ? next : prev;
		});
	}, [rawJobs, rawCompletedJobs]);
	const effectiveJobs = (0, import_react.useMemo)(() => {
		return rawJobs.filter((j) => {
			return !optimisticJobUpdates.get(j.id)?.deleted;
		}).map((j) => {
			const opt = optimisticJobUpdates.get(j.id);
			if (!opt) return j;
			return {
				...j,
				status: opt.status ?? j.status,
				admin_verified_at: opt.admin_verified_at !== void 0 ? opt.admin_verified_at : j.admin_verified_at,
				note: opt.note !== void 0 ? opt.note : j.note,
				rejection_reason: opt.rejection_reason !== void 0 ? opt.rejection_reason : j.rejection_reason
			};
		});
	}, [rawJobs, optimisticJobUpdates]);
	const effectiveCompletedJobs = (0, import_react.useMemo)(() => {
		const list = [];
		const addedIds = /* @__PURE__ */ new Set();
		for (const j of rawCompletedJobs) {
			const opt = optimisticJobUpdates.get(j.id);
			if (opt?.deleted) continue;
			if (opt && opt.status && opt.status !== "Selesai" && !opt.admin_verified_at) continue;
			const merged = opt ? {
				...j,
				status: opt.status ?? j.status,
				admin_verified_at: opt.admin_verified_at !== void 0 ? opt.admin_verified_at : j.admin_verified_at,
				note: opt.note !== void 0 ? opt.note : j.note,
				rejection_reason: opt.rejection_reason !== void 0 ? opt.rejection_reason : j.rejection_reason
			} : j;
			list.push(merged);
			addedIds.add(j.id);
		}
		for (const j of effectiveJobs) if ((j.status === "Selesai" || Boolean(j.admin_verified_at)) && !addedIds.has(j.id)) {
			list.unshift(j);
			addedIds.add(j.id);
		}
		return list;
	}, [
		rawCompletedJobs,
		effectiveJobs,
		optimisticJobUpdates
	]);
	const jobs = effectiveJobs;
	const completedJobs = effectiveCompletedJobs;
	const [editBuzzer, setEditBuzzer] = (0, import_react.useState)(null);
	const [editBuzzerForm, setEditBuzzerForm] = (0, import_react.useState)({
		name: "",
		username: "",
		platform: "Instagram",
		category: "",
		followers: 0,
		phone: "",
		city: "",
		bio: "",
		reviewNote: ""
	});
	const [deleteBuzzer, setDeleteBuzzer] = (0, import_react.useState)(null);
	const [isSavingBuzzer, setIsSavingBuzzer] = (0, import_react.useState)(false);
	const [isDeletingBuzzer, setIsDeletingBuzzer] = (0, import_react.useState)(false);
	const [editJob, setEditJob] = (0, import_react.useState)(null);
	const [editJobForm, setEditJobForm] = (0, import_react.useState)({
		status: "Selesai",
		note: "",
		rejectionReason: ""
	});
	const [deleteJob, setDeleteJob] = (0, import_react.useState)(null);
	const [isSavingJob, setIsSavingJob] = (0, import_react.useState)(false);
	const [isDeletingJob, setIsDeletingJob] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		let active = true;
		supabase.from("app_accounts").select("email, avatar_url").eq("role", "buzzer").then(({ data }) => {
			if (active && data) {
				const map = /* @__PURE__ */ new Map();
				for (const item of data) if (item.avatar_url) map.set(item.email.trim().toLowerCase(), item.avatar_url);
				setBuzzerAvatars(map);
			}
		});
		return () => {
			active = false;
		};
	}, []);
	const counts = (0, import_react.useMemo)(() => ({
		pending: apps.filter((a) => a.status === "pending").length,
		approved: apps.filter((a) => a.status === "approved").length,
		rejected: apps.filter((a) => a.status === "rejected").length,
		semua: apps.length
	}), [apps]);
	const list = (0, import_react.useMemo)(() => filter === "semua" ? apps : apps.filter((a) => a.status === filter), [apps, filter]);
	const [accountPage, setAccountPage] = (0, import_react.useState)(1);
	const ACCOUNT_PAGE_SIZE = 8;
	(0, import_react.useEffect)(() => {
		setAccountPage(1);
	}, [filter]);
	const totalAccountPages = Math.max(1, Math.ceil(list.length / ACCOUNT_PAGE_SIZE));
	const safeAccountPage = Math.min(Math.max(1, accountPage), totalAccountPages);
	const paginatedList = (0, import_react.useMemo)(() => {
		const start = (safeAccountPage - 1) * ACCOUNT_PAGE_SIZE;
		return list.slice(start, start + ACCOUNT_PAGE_SIZE);
	}, [list, safeAccountPage]);
	const pendingJobs = (0, import_react.useMemo)(() => jobs.filter((j) => j.status === "Review" && !j.admin_verified_at), [jobs]);
	const rejectedJobs = (0, import_react.useMemo)(() => jobs.filter((j) => j.status === "Ditolak" || j.status === "Revisi"), [jobs]);
	const jobHistory = (0, import_react.useMemo)(() => {
		if (jobFilter === "pending") return pendingJobs;
		if (jobFilter === "approved") return completedJobs;
		if (jobFilter === "rejected") return rejectedJobs;
		return [
			...pendingJobs,
			...completedJobs,
			...rejectedJobs
		];
	}, [
		jobFilter,
		pendingJobs,
		completedJobs,
		rejectedJobs
	]);
	const [jobPage, setJobPage] = (0, import_react.useState)(1);
	const JOB_PAGE_SIZE = 8;
	(0, import_react.useEffect)(() => {
		setJobPage(1);
	}, [jobFilter]);
	const totalJobPages = Math.max(1, Math.ceil(jobHistory.length / JOB_PAGE_SIZE));
	const safeJobPage = Math.min(Math.max(1, jobPage), totalJobPages);
	const paginatedJobs = (0, import_react.useMemo)(() => {
		const start = (safeJobPage - 1) * JOB_PAGE_SIZE;
		return jobHistory.slice(start, start + JOB_PAGE_SIZE);
	}, [jobHistory, safeJobPage]);
	const levelBasedSplit = (job) => {
		const total = Math.max(0, Number(job.gross_price) || 0);
		const assigned = job.buzzer_email ? assignedLevels[job.buzzer_email.trim().toLowerCase()] : void 0;
		const levelName = job.buzzer_level || assigned?.level || null;
		const buzzerPct = getBuzzerPercentageForLevel(levelName);
		const buzzerShare = Math.round(total * buzzerPct / 100);
		const adminShare = Math.max(0, total - buzzerShare);
		return {
			total,
			buzzerPercent: buzzerPct,
			adminPercent: 100 - buzzerPct,
			buzzerShare,
			adminShare,
			levelName
		};
	};
	const approve = async (a) => {
		setBusyAppId(a.id);
		try {
			await approveApplication(a.id, "Disetujui admin");
			toast.success(`${a.name} berhasil diverifikasi. Buzzer sudah bisa login.`);
			setDetail(null);
			setApproveBuzzerFor(null);
		} catch {
			toast.error("Gagal menyetujui pendaftaran buzzer");
		} finally {
			setBusyAppId(null);
		}
	};
	const approveJob = async (job, note) => {
		if (!job.buzzer_email) {
			toast.error("Pekerjaan ini belum ditugaskan ke buzzer tertentu.");
			return;
		}
		setBusyJobId(job.id);
		const prevUpdate = optimisticJobUpdates.get(job.id);
		const now = (/* @__PURE__ */ new Date()).toISOString();
		const resolvedNote = note?.trim() || "Diverifikasi admin, menunggu ulasan customer";
		setOptimisticJobUpdates((prev) => {
			const next = new Map(prev);
			next.set(job.id, {
				status: "Review",
				admin_verified_at: now,
				note: resolvedNote
			});
			return next;
		});
		try {
			const split = levelBasedSplit(job);
			await reviewCampaignJob(job.id, "Review", resolvedNote);
			toast.success(`${job.campaign_title} disetujui. Buzzer menerima ${formatIDR$1(split.buzzerShare)} (${split.buzzerPercent}%) dan admin mendapat ${formatIDR$1(split.adminShare)}`);
			setApproveJobFor(null);
			setJobDetail(null);
			setJobNote("");
			await Promise.all([
				refetchJobs(),
				refetchCompletedJobs(),
				refetchSubmissions()
			]);
		} catch {
			setOptimisticJobUpdates((prev) => {
				const next = new Map(prev);
				if (prevUpdate) next.set(job.id, prevUpdate);
				else next.delete(job.id);
				return next;
			});
			toast.error("Gagal memverifikasi pekerjaan buzzer");
		} finally {
			setBusyJobId(null);
		}
	};
	const rejectJob = async (job, reason) => {
		setBusyJobId(job.id);
		const prevUpdate = optimisticJobUpdates.get(job.id);
		const cleanReason = reason.trim();
		setOptimisticJobUpdates((prev) => {
			const next = new Map(prev);
			next.set(job.id, {
				status: "Revisi",
				admin_verified_at: null,
				rejection_reason: cleanReason,
				note: cleanReason
			});
			return next;
		});
		try {
			await rejectCampaignJob(job.id, cleanReason, session?.email ?? "admin");
			toast.success(`Pekerjaan ${job.campaign_title} ditolak.`);
			setRejectJobFor(null);
			setJobRejectReason("");
			setJobDetail(null);
			await Promise.all([
				refetchJobs(),
				refetchCompletedJobs(),
				refetchSubmissions()
			]);
		} catch {
			setOptimisticJobUpdates((prev) => {
				const next = new Map(prev);
				if (prevUpdate) next.set(job.id, prevUpdate);
				else next.delete(job.id);
				return next;
			});
			toast.error("Gagal menolak pekerjaan buzzer");
		} finally {
			setBusyJobId(null);
		}
	};
	const confirmRejectJob = async () => {
		if (!rejectJobFor) return;
		const reason = jobRejectReason.trim();
		if (!reason) {
			toast.error("Alasan penolakan wajib diisi.");
			return;
		}
		await rejectJob(rejectJobFor, reason);
	};
	const doReject = async () => {
		if (!rejectFor) return;
		setBusyAppId(rejectFor.id);
		try {
			await rejectApplication(rejectFor.id, note.trim() || "Tidak memenuhi kriteria");
			toast.success(`Pendaftaran ${rejectFor.name} ditolak.`);
			setRejectFor(null);
			setNote("");
			setDetail(null);
		} catch {
			toast.error("Gagal menolak pendaftaran buzzer");
		} finally {
			setBusyAppId(null);
		}
	};
	const handleOpenEditBuzzer = (a) => {
		setEditBuzzerForm({
			name: a.name || "",
			username: a.username || "",
			platform: a.platform || "Instagram",
			category: a.category || "",
			followers: a.followers || 0,
			phone: a.phone || "",
			city: a.city || "",
			bio: a.bio || "",
			reviewNote: a.reviewNote || ""
		});
		setEditBuzzer(a);
	};
	const handleSaveEditBuzzer = async () => {
		if (!editBuzzer) return;
		if (!editBuzzerForm.name.trim()) {
			toast.error("Nama buzzer wajib diisi.");
			return;
		}
		setIsSavingBuzzer(true);
		try {
			await updateApplication(editBuzzer.id, {
				name: editBuzzerForm.name.trim(),
				username: editBuzzerForm.username.trim(),
				platform: editBuzzerForm.platform,
				category: editBuzzerForm.category.trim() || void 0,
				followers: Number(editBuzzerForm.followers) || 0,
				phone: editBuzzerForm.phone.trim() || void 0,
				city: editBuzzerForm.city.trim() || void 0,
				bio: editBuzzerForm.bio.trim() || void 0,
				reviewNote: editBuzzerForm.reviewNote.trim() || void 0
			});
			toast.success("Data buzzer berhasil diperbarui.");
			setEditBuzzer(null);
			if (detail?.id === editBuzzer.id) setDetail((prev) => prev ? {
				...prev,
				name: editBuzzerForm.name.trim(),
				username: editBuzzerForm.username.trim(),
				platform: editBuzzerForm.platform,
				category: editBuzzerForm.category.trim() || void 0,
				followers: Number(editBuzzerForm.followers) || 0,
				phone: editBuzzerForm.phone.trim() || void 0,
				city: editBuzzerForm.city.trim() || void 0,
				bio: editBuzzerForm.bio.trim() || void 0,
				reviewNote: editBuzzerForm.reviewNote.trim() || void 0
			} : null);
		} catch (err) {
			toast.error("Gagal memperbarui data buzzer: " + (err?.message || "Terjadi kesalahan"));
		} finally {
			setIsSavingBuzzer(false);
		}
	};
	const handleConfirmDeleteBuzzer = async () => {
		if (!deleteBuzzer) return;
		setIsDeletingBuzzer(true);
		try {
			await deleteApplication(deleteBuzzer.id);
			toast.success(`Data pendaftaran buzzer ${deleteBuzzer.name} berhasil dihapus.`);
			setDeleteBuzzer(null);
			if (detail?.id === deleteBuzzer.id) setDetail(null);
		} catch (err) {
			toast.error("Gagal menghapus pendaftaran buzzer: " + (err?.message || "Terjadi kesalahan"));
		} finally {
			setIsDeletingBuzzer(false);
		}
	};
	const handleOpenEditJob = (job) => {
		setEditJobForm({
			status: job.status || "Selesai",
			note: job.note || "",
			rejectionReason: job.rejection_reason || ""
		});
		setEditJob(job);
	};
	const handleSaveEditJob = async () => {
		if (!editJob) return;
		setIsSavingJob(true);
		const targetStatus = editJobForm.status;
		const targetNote = editJobForm.note.trim() || null;
		const targetReason = editJobForm.rejectionReason.trim() || null;
		const prevUpdate = optimisticJobUpdates.get(editJob.id);
		setOptimisticJobUpdates((prev) => {
			const next = new Map(prev);
			next.set(editJob.id, {
				status: targetStatus,
				admin_verified_at: targetStatus === "Selesai" ? editJob.admin_verified_at || (/* @__PURE__ */ new Date()).toISOString() : targetStatus === "Review" ? editJob.admin_verified_at : null,
				note: targetNote,
				rejection_reason: targetReason
			});
			return next;
		});
		try {
			await updateCampaignJob(editJob.id, {
				status: targetStatus,
				note: targetNote,
				rejection_reason: targetReason,
				...targetStatus === "Selesai" && !editJob.admin_verified_at ? { admin_verified_at: (/* @__PURE__ */ new Date()).toISOString() } : {}
			});
			toast.success("Verifikasi pengerjaan berhasil diperbarui.");
			const updatedJob = editJob;
			setEditJob(null);
			if (jobDetail?.id === updatedJob.id) setJobDetail((prev) => prev ? {
				...prev,
				status: targetStatus,
				note: targetNote,
				rejection_reason: targetReason
			} : null);
			await Promise.all([
				refetchJobs(),
				refetchCompletedJobs(),
				refetchSubmissions()
			]);
		} catch (err) {
			setOptimisticJobUpdates((prev) => {
				const next = new Map(prev);
				if (prevUpdate) next.set(editJob.id, prevUpdate);
				else next.delete(editJob.id);
				return next;
			});
			toast.error("Gagal memperbarui pengerjaan: " + (err?.message || "Terjadi kesalahan"));
		} finally {
			setIsSavingJob(false);
		}
	};
	const handleConfirmDeleteJob = async () => {
		if (!deleteJob) return;
		setIsDeletingJob(true);
		const prevUpdate = optimisticJobUpdates.get(deleteJob.id);
		setOptimisticJobUpdates((prev) => {
			const next = new Map(prev);
			next.set(deleteJob.id, { deleted: true });
			return next;
		});
		try {
			await deleteCampaignJob(deleteJob.id);
			toast.success(`Riwayat pengerjaan ${deleteJob.campaign_title} berhasil dihapus.`);
			const deletedId = deleteJob.id;
			setDeleteJob(null);
			if (jobDetail?.id === deletedId) setJobDetail(null);
			await Promise.all([
				refetchJobs(),
				refetchCompletedJobs(),
				refetchSubmissions()
			]);
		} catch (err) {
			setOptimisticJobUpdates((prev) => {
				const next = new Map(prev);
				if (prevUpdate) next.set(deleteJob.id, prevUpdate);
				else next.delete(deleteJob.id);
				return next;
			});
			toast.error("Gagal menghapus riwayat pengerjaan: " + (err?.message || "Terjadi kesalahan"));
		} finally {
			setIsDeletingJob(false);
		}
	};
	const statusPill = (s) => {
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: cn("rounded-full px-2 py-0.5 text-xs font-semibold", {
				pending: "bg-amber-100 text-amber-700",
				approved: "bg-emerald-100 text-emerald-700",
				rejected: "bg-red-100 text-red-700"
			}[s]),
			children: {
				pending: "Menunggu",
				approved: "Disetujui",
				rejected: "Ditolak"
			}[s]
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			mode === "accounts" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Menunggu",
						value: counts.pending.toString(),
						hint: "Perlu tindakan admin",
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shield, { className: "h-5 w-5" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Disetujui",
						value: counts.approved.toString(),
						hint: "Total buzzer terverifikasi",
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-5 w-5" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Ditolak",
						value: counts.rejected.toString(),
						hint: "Tidak lolos verifikasi",
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, { className: "h-5 w-5" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Total Pendaftar",
						value: counts.semua.toString(),
						hint: "Sepanjang waktu",
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "h-5 w-5" })
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-border bg-card shadow-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-2 border-b border-border p-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Funnel, { className: "h-4 w-4 text-muted-foreground" }), [
							"semua",
							"pending",
							"approved",
							"rejected"
						].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setFilter(s),
							className: cn("rounded-full border px-3 py-1 text-xs font-medium capitalize", filter === s ? "border-transparent gradient-brand text-brand-foreground" : "border-border text-muted-foreground hover:bg-muted"),
							children: [s === "semua" ? "Semua" : s === "pending" ? "Menunggu" : s === "approved" ? "Disetujui" : "Ditolak", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "ml-1 opacity-70",
								children: [
									"(",
									counts[s],
									")"
								]
							})]
						}, s))]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "overflow-x-auto",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Nama & Email" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Platform" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Followers" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Dikirim" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Status" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
								className: "text-right",
								children: "Aksi"
							})
						] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableBody, { children: [paginatedList.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, {
							className: "cursor-pointer hover:bg-muted/40",
							onClick: () => setDetail(a),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-medium",
									children: a.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs text-muted-foreground",
									children: [
										a.email,
										" · ",
										a.username
									]
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
									className: "text-sm",
									children: a.platform
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
									className: "text-sm",
									children: a.followers.toLocaleString("id-ID")
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
									className: "text-xs text-muted-foreground",
									children: new Date(a.submittedAt).toLocaleDateString("id-ID", {
										day: "numeric",
										month: "short",
										year: "numeric"
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: statusPill(a.status) }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
									className: "text-right",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex justify-end gap-2",
										onClick: (e) => e.stopPropagation(),
										children: a.status === "pending" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											size: "sm",
											variant: "outline",
											className: "h-8 w-8 p-0 text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/20",
											disabled: busyAppId === a.id,
											onClick: () => setRejectFor(a),
											title: "Tolak Pendaftaran",
											"aria-label": "Tolak",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, { className: "h-4 w-4" })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											size: "sm",
											className: "h-8 w-8 p-0 gradient-brand text-brand-foreground",
											disabled: busyAppId === a.id,
											onClick: () => setApproveBuzzerFor(a),
											title: "Setujui Pendaftaran",
											"aria-label": "Setujui",
											children: busyAppId === a.id ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4" })
										})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											size: "sm",
											variant: "outline",
											className: "h-8 w-8 p-0",
											title: "Detail",
											"aria-label": "Detail",
											onClick: () => setDetail(a),
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-3.5 w-3.5" })
										}), a.status === "approved" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											size: "sm",
											variant: "outline",
											className: "h-8 w-8 p-0 text-primary hover:bg-primary/10",
											onClick: () => handleOpenEditBuzzer(a),
											title: "Edit",
											"aria-label": "Edit",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "h-3.5 w-3.5" })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											size: "sm",
											variant: "outline",
											className: "h-8 w-8 p-0 text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/20",
											onClick: () => setDeleteBuzzer(a),
											title: "Hapus",
											"aria-label": "Hapus",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3.5 w-3.5" })
										})] })] })
									})
								})
							]
						}, a.id)), list.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
							colSpan: 6,
							className: "py-10 text-center text-sm text-muted-foreground",
							children: "Tidak ada pendaftaran pada kategori ini."
						}) })] })] })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TablePagination, {
						currentPage: safeAccountPage,
						totalItems: list.length,
						pageSize: ACCOUNT_PAGE_SIZE,
						onPageChange: setAccountPage
					})
				]
			})] }),
			mode === "jobs" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
							label: "Menunggu Review",
							value: pendingJobs.length.toString(),
							hint: "Perlu verifikasi admin",
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shield, { className: "h-5 w-5" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
							label: "Pekerjaan Disetujui",
							value: completedJobs.length.toString(),
							hint: "Verifikasi selesai & payout",
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-5 w-5" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
							label: "Pekerjaan Ditolak",
							value: rejectedJobs.length.toString(),
							hint: "Tidak memenuhi syarat",
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, { className: "h-5 w-5" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
							label: "Total Pengerjaan",
							value: (pendingJobs.length + completedJobs.length + rejectedJobs.length).toString(),
							hint: "Semua riwayat pekerjaan",
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Briefcase, { className: "h-5 w-5" })
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl border border-border bg-card shadow-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center gap-2 border-b border-border p-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Funnel, { className: "h-4 w-4 text-muted-foreground" }), [
								[
									"semua",
									"Semua",
									pendingJobs.length + completedJobs.length + rejectedJobs.length
								],
								[
									"pending",
									"Menunggu",
									pendingJobs.length
								],
								[
									"approved",
									"Disetujui",
									completedJobs.length
								],
								[
									"rejected",
									"Ditolak",
									rejectedJobs.length
								]
							].map(([value, label, count]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => setJobFilter(value),
								className: cn("rounded-full border px-3 py-1 text-xs font-medium", jobFilter === value ? "border-transparent gradient-brand text-brand-foreground" : "border-border text-muted-foreground hover:bg-muted"),
								children: [
									label,
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "ml-1 opacity-70",
										children: [
											"(",
											count,
											")"
										]
									})
								]
							}, value))]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "overflow-x-auto",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Campaign" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Buzzer" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Payout" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Split" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Status" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
									className: "text-right",
									children: "Aksi"
								})
							] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableBody, { children: [jobHistory.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
								colSpan: 6,
								className: "py-8 text-center text-sm text-muted-foreground",
								children: jobFilter === "pending" ? "Belum ada pekerjaan yang menunggu verifikasi." : "Belum ada riwayat pengerjaan pada kategori ini."
							}) }), paginatedJobs.map((job) => {
								const split = levelBasedSplit(job);
								const isPending = job.status === "Review" && !job.admin_verified_at;
								const displayStatus = job.status === "Review" && job.admin_verified_at || job.status === "Selesai" ? "Selesai" : job.status === "Ditolak" ? "Ditolak" : job.status === "Revisi" ? "Revisi" : job.status;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-medium",
										children: job.campaign_title
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted-foreground",
										children: job.platform
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-medium",
										children: job.buzzer_name || "—"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted-foreground",
										children: job.buzzer_email || "Belum ditugaskan"
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
										className: "font-semibold",
										children: formatIDR$1(split.total)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, {
										className: "text-xs text-muted-foreground",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
												"Level: ",
												split.levelName || "-",
												" (",
												split.buzzerPercent,
												"%)"
											] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: ["Buzzer: ", formatIDR$1(split.buzzerShare)] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: ["Admin: ", formatIDR$1(split.adminShare)] })
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: displayStatus }) }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
										className: "text-right",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex justify-end gap-2",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
													size: "sm",
													variant: "outline",
													className: "h-8 w-8 p-0",
													title: "Detail",
													"aria-label": "Detail",
													onClick: () => setJobDetail(job),
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-3.5 w-3.5" })
												}),
												isPending && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
													size: "sm",
													variant: "outline",
													className: "h-8 w-8 p-0 text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/20",
													disabled: busyJobId === job.id,
													onClick: () => {
														setRejectJobFor(job);
														setJobRejectReason("");
													},
													title: "Tolak Pekerjaan",
													"aria-label": "Tolak",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, { className: "h-4 w-4" })
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
													size: "sm",
													className: "h-8 w-8 p-0 gradient-brand text-brand-foreground",
													disabled: busyJobId === job.id,
													onClick: () => setApproveJobFor(job),
													title: "Setujui Pekerjaan",
													"aria-label": "Setujui",
													children: busyJobId === job.id ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4" })
												})] }),
												!isPending && (job.status === "Selesai" || Boolean(job.admin_verified_at) || job.status === "Ditolak" || job.status === "Revisi") && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
													size: "sm",
													variant: "outline",
													className: "h-8 w-8 p-0 text-primary hover:bg-primary/10",
													onClick: () => handleOpenEditJob(job),
													title: "Edit",
													"aria-label": "Edit",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "h-3.5 w-3.5" })
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
													size: "sm",
													variant: "outline",
													className: "h-8 w-8 p-0 text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/20",
													onClick: () => setDeleteJob(job),
													title: "Hapus",
													"aria-label": "Hapus",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3.5 w-3.5" })
												})] })
											]
										})
									})
								] }, job.id);
							})] })] })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TablePagination, {
							currentPage: safeJobPage,
							totalItems: jobHistory.length,
							pageSize: JOB_PAGE_SIZE,
							onPageChange: setJobPage
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
					open: !!jobDetail,
					onOpenChange: (o) => {
						if (!o) {
							setJobDetail(null);
							setJobNote("");
						}
					},
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogContent, {
						className: "sm:max-w-2xl max-h-[90vh] flex flex-col p-0 gap-0 overflow-hidden sm:rounded-2xl shadow-2xl",
						children: jobDetail && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, {
								className: "p-5 pb-4 pr-12 border-b border-border shrink-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
									className: "text-lg font-bold",
									children: "Hasil Pengerjaan & Bukti Buzzer"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
									className: "text-xs text-muted-foreground mt-0.5",
									children: "Periksa ringkasan pengerjaan, bukti tugas, dan ulasan sebelum diverifikasi."
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex-1 overflow-y-auto p-5 sm:p-6 space-y-4 text-sm",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid gap-3 sm:grid-cols-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "rounded-xl border border-border p-3.5 bg-muted/20",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-[11px] font-medium uppercase tracking-wider text-muted-foreground",
													children: "Campaign"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "font-semibold text-foreground text-sm mt-0.5",
													children: jobDetail.campaign_title
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-xs text-muted-foreground",
													children: jobDetail.platform
												})
											]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "rounded-xl border border-border p-3.5 bg-muted/20",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-[11px] font-medium uppercase tracking-wider text-muted-foreground",
													children: "Buzzer"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "font-semibold text-foreground text-sm mt-0.5",
													children: jobDetail.buzzer_name || "—"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-xs text-muted-foreground",
													children: jobDetail.buzzer_email || "—"
												})
											]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-xl border border-border p-3.5 bg-muted/10 space-y-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs font-semibold text-muted-foreground",
											children: "Deskripsi hasil pekerjaan"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "whitespace-pre-wrap leading-relaxed text-sm text-foreground",
											children: jobDetail.brief || "Tidak ada deskripsi hasil pekerjaan."
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-xl border border-border p-3.5 space-y-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
											children: "Riwayat Pengerjaan"
										}), submissionsLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-muted-foreground",
											children: "Memuat riwayat pengerjaan..."
										}) : submissionsError ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-between gap-3 rounded-lg bg-rose-50 p-3 text-xs text-rose-700",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Gagal memuat riwayat: ", submissionsError] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												size: "sm",
												variant: "outline",
												onClick: () => void refetchSubmissions(),
												children: "Coba lagi"
											})]
										}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-2",
											children: [submissions.filter((submission) => submission.job_id === jobDetail.id).sort((a, b) => b.submission_number - a.submission_number).map((submission) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "rounded-lg bg-muted/40 p-3 text-xs",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "flex items-center justify-between gap-2",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
															className: "font-semibold",
															children: ["Submission #", submission.submission_number]
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: submission.status === "Ditolak" ? "Ditolak" : submission.status === "Selesai" ? "Selesai" : "Review" })]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
														className: "mt-1 text-muted-foreground",
														children: ["Tanggal: ", new Date(submission.submitted_at).toLocaleString("id-ID")]
													}),
													submission.rejection_reason && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
														className: "mt-1 text-rose-700",
														children: ["Alasan: ", submission.rejection_reason]
													})
												]
											}, submission.id)), submissions.filter((submission) => submission.job_id === jobDetail.id).length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-xs text-muted-foreground",
												children: "Belum ada riwayat submission."
											})]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-xl border border-border p-3.5 space-y-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs font-semibold text-muted-foreground",
											children: "Bukti pengerjaan"
										}), jobDetail.proof_url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProofLink, { value: jobDetail.proof_url }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-muted-foreground",
											children: "Belum ada bukti upload dari buzzer."
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-xl border border-border p-3.5 space-y-2",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-xs font-semibold text-muted-foreground",
												children: "Catatan admin / review"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
												value: jobNote,
												onChange: (e) => setJobNote(e.target.value),
												placeholder: jobDetail.note || "Tulis catatan review untuk buzzer...",
												className: "min-h-[85px] resize-none text-sm"
											}),
											jobDetail.note && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "text-xs text-muted-foreground",
												children: ["Catatan sebelumnya: ", jobDetail.note]
											})
										]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogFooter, {
								className: "p-4 sm:p-5 border-t border-border bg-card/95 backdrop-blur shrink-0 flex items-center justify-end gap-2",
								children: jobDetail.status === "Selesai" || Boolean(jobDetail.admin_verified_at) || jobDetail.status === "Ditolak" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "outline",
										className: "h-9 w-9 p-0 text-primary hover:bg-primary/10",
										title: "Edit",
										"aria-label": "Edit",
										onClick: () => {
											const tgt = jobDetail;
											setJobDetail(null);
											handleOpenEditJob(tgt);
										},
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "h-4 w-4" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "outline",
										className: "h-9 w-9 p-0 text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/20",
										title: "Hapus",
										"aria-label": "Hapus",
										onClick: () => {
											const tgt = jobDetail;
											setJobDetail(null);
											setDeleteJob(tgt);
										},
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "outline",
										disabled: busyJobId === jobDetail.id,
										onClick: () => {
											setJobDetail(null);
											setJobNote("");
										},
										children: "Tutup"
									})
								] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "outline",
										disabled: busyJobId === jobDetail.id,
										onClick: () => {
											setJobDetail(null);
											setJobNote("");
										},
										children: "Tutup"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "outline",
										className: "text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/20",
										disabled: busyJobId === jobDetail.id,
										onClick: () => {
											setRejectJobFor(jobDetail);
											setJobRejectReason("");
										},
										children: "Tolak"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										className: "gradient-brand text-brand-foreground gap-1.5",
										disabled: busyJobId === jobDetail.id,
										onClick: () => setApproveJobFor(jobDetail),
										children: [busyJobId === jobDetail.id ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : null, "Setujui"]
									})
								] })
							})
						] })
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
					open: !!rejectJobFor,
					onOpenChange: (open) => {
						if (!open && !busyJobId) {
							setRejectJobFor(null);
							setJobRejectReason("");
						}
					},
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
						className: "sm:max-w-md",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Tolak Pengerjaan" }) }), rejectJobFor && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-3 text-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-2 gap-2 rounded-xl border border-border p-3",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, {
											label: "Campaign",
											value: rejectJobFor.campaign_title
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, {
											label: "Buzzer",
											value: rejectJobFor.buzzer_name || "—"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, {
											label: "Platform",
											value: rejectJobFor.platform
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, {
											label: "Payout",
											value: formatIDR$1(Number(rejectJobFor.payout))
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Alasan Penolakan" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
									value: jobRejectReason,
									onChange: (event) => setJobRejectReason(event.target.value),
									placeholder: "Jelaskan kesalahan buzzer dan apa yang harus diperbaiki...",
									className: "mt-2 min-h-[110px]"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "outline",
									disabled: busyJobId === rejectJobFor.id,
									onClick: () => setRejectJobFor(null),
									children: "Batal"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "destructive",
									disabled: busyJobId === rejectJobFor.id || !jobRejectReason.trim(),
									onClick: () => void confirmRejectJob(),
									className: "gap-1.5",
									children: busyJobId === rejectJobFor.id ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }), "Menolak..."] }) : "Tolak & Minta Perbaikan"
								})] })
							]
						})]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialog, {
					open: !!approveJobFor,
					onOpenChange: (open) => {
						if (!open && !busyJobId) setApproveJobFor(null);
					},
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogTitle, { children: "Verifikasi pengerjaan disetujui?" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogDescription, { children: [
						"Pengerjaan ",
						approveJobFor?.campaign_title,
						" akan ditandai selesai dan payout akan diproses."
					] })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogCancel, {
						disabled: busyJobId === approveJobFor?.id,
						children: "Tidak"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						className: "gradient-brand text-brand-foreground gap-1.5",
						disabled: busyJobId === approveJobFor?.id,
						onClick: () => approveJobFor && void approveJob(approveJobFor, jobNote),
						children: busyJobId === approveJobFor?.id ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }), "Memproses..."] }) : "Ya, Setujui"
					})] })] })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
					open: !!editJob,
					onOpenChange: (o) => {
						if (!o && !isSavingJob) setEditJob(null);
					},
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogContent, {
						className: "sm:max-w-md max-h-[90vh] flex flex-col p-0 gap-0 overflow-hidden sm:rounded-2xl",
						children: editJob && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, {
								className: "p-5 pb-4 border-b border-border shrink-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
									className: "text-base font-bold flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "h-4 w-4 text-primary" }), " Edit Verifikasi Pengerjaan"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
									className: "text-xs text-muted-foreground mt-0.5",
									children: "Sesuaikan status verifikasi atau catatan review admin untuk pengerjaan buzzer ini."
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex-1 overflow-y-auto p-5 space-y-4 text-xs sm:text-sm",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-xl border border-border p-3.5 bg-muted/20 space-y-1 text-xs",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "font-semibold text-foreground",
											children: editJob.campaign_title
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-muted-foreground",
											children: [
												"Buzzer: ",
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-foreground font-medium",
													children: editJob.buzzer_name || editJob.buzzer_email || "—"
												}),
												" (",
												editJob.platform,
												")"
											]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											className: "text-xs font-semibold",
											children: "Status Pengerjaan"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
											value: editJobForm.status,
											onValueChange: (val) => setEditJobForm((prev) => ({
												...prev,
												status: val
											})),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
												className: "w-full",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Pilih status" })
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: "Selesai",
													children: "Selesai (Disetujui)"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: "Review",
													children: "Review (Perlu Ditinjau)"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: "Revisi",
													children: "Revisi (Minta Perbaikan)"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: "Ditolak",
													children: "Ditolak"
												})
											] })]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											className: "text-xs font-semibold",
											children: "Catatan Admin / Review"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
											value: editJobForm.note,
											onChange: (e) => setEditJobForm((prev) => ({
												...prev,
												note: e.target.value
											})),
											placeholder: "Tulis catatan atau arahan review...",
											className: "min-h-[90px] resize-none text-xs"
										})]
									}),
									(editJobForm.status === "Revisi" || editJobForm.status === "Ditolak") && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											className: "text-xs font-semibold text-rose-600",
											children: "Alasan Revisi / Penolakan"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
											value: editJobForm.rejectionReason,
											onChange: (e) => setEditJobForm((prev) => ({
												...prev,
												rejectionReason: e.target.value
											})),
											placeholder: "Tulis alasan mengapa pengerjaan diminta revisi atau ditolak...",
											className: "min-h-[80px] resize-none text-xs border-rose-300 dark:border-rose-900"
										})]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
								className: "p-4 border-t border-border bg-card/95 backdrop-blur shrink-0 flex items-center justify-end gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "outline",
									disabled: isSavingJob,
									onClick: () => setEditJob(null),
									children: "Batal"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									className: "gradient-brand text-brand-foreground gap-1.5",
									disabled: isSavingJob,
									onClick: handleSaveEditJob,
									children: [isSavingJob ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "h-4 w-4" }), "Simpan Perubahan"]
								})]
							})
						] })
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialog, {
					open: !!deleteJob,
					onOpenChange: (open) => {
						if (!open && !isDeletingJob) setDeleteJob(null);
					},
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogTitle, {
						className: "flex items-center gap-2 text-rose-600",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-5 w-5" }), " Hapus Riwayat Pengerjaan?"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogDescription, { children: [
						"Apakah Anda yakin ingin menghapus data pengerjaan ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: deleteJob?.campaign_title }),
						" oleh buzzer ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: deleteJob?.buzzer_name || deleteJob?.buzzer_email }),
						"?",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
						"Tindakan ini akan menghapus riwayat pengerjaan dan bukti terkait secara permanen dari sistem."
					] })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogCancel, {
						disabled: isDeletingJob,
						children: "Batal"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "destructive",
						className: "gap-1.5",
						disabled: isDeletingJob,
						onClick: handleConfirmDeleteJob,
						children: isDeletingJob ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }), "Menghapus..."] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" }), "Ya, Hapus Pengerjaan"] })
					})] })] })
				})
			] }),
			mode === "accounts" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
					open: !!detail,
					onOpenChange: (o) => !o && setDetail(null),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogContent, {
						className: "sm:max-w-lg max-h-[90vh] overflow-y-auto",
						children: detail && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
								className: "flex items-center gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Avatar, {
									className: "h-11 w-11 border border-border",
									children: [detail && buzzerAvatars.get(detail.email.trim().toLowerCase()) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarImage, {
										src: buzzerAvatars.get(detail.email.trim().toLowerCase()),
										alt: detail.name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarFallback, {
										className: "gradient-brand text-brand-foreground",
										children: detail.name.split(" ").map((n) => n[0]).join("").slice(0, 2)
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0 flex-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: detail.name }), statusPill(detail.status)]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs font-normal text-muted-foreground",
										children: detail.email
									})]
								})]
							}) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-3 rounded-xl border border-border p-4 text-sm sm:grid-cols-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, {
										label: "Username",
										value: detail.username
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, {
										label: "Platform",
										value: detail.platform
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, {
										label: "Kategori Konten",
										value: detail.category || "—"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, {
										label: "Followers",
										value: detail.followers.toLocaleString("id-ID")
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, {
										label: "Telepon",
										value: detail.phone || "—"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, {
										label: "Kota",
										value: detail.city || "—"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, {
										label: "Dikirim",
										value: new Date(detail.submittedAt).toLocaleString("id-ID")
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, {
										label: "Bio",
										value: detail.bio || "—",
										full: true
									}),
									detail.reviewNote && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, {
										label: "Catatan Admin",
										value: detail.reviewNote,
										full: true
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogFooter, {
								className: "gap-2",
								children: detail.status === "pending" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: "outline",
									disabled: busyAppId === detail.id,
									onClick: () => setRejectFor(detail),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, { className: "mr-1 h-4 w-4" }), " Tolak"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									className: "gradient-brand text-brand-foreground gap-1.5",
									disabled: busyAppId === detail.id,
									onClick: () => setApproveBuzzerFor(detail),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "mr-1 h-4 w-4" }), " Setujui & Aktifkan"]
								})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [detail.status === "approved" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "outline",
									className: "h-9 w-9 p-0 text-primary hover:bg-primary/10",
									title: "Edit",
									"aria-label": "Edit",
									onClick: () => {
										const tgt = detail;
										setDetail(null);
										handleOpenEditBuzzer(tgt);
									},
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "h-4 w-4" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "outline",
									className: "h-9 w-9 p-0 text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/20",
									title: "Hapus",
									"aria-label": "Hapus",
									onClick: () => {
										const tgt = detail;
										setDetail(null);
										setDeleteBuzzer(tgt);
									},
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "outline",
									onClick: () => setDetail(null),
									children: "Tutup"
								})] })
							})
						] })
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialog, {
					open: !!approveBuzzerFor,
					onOpenChange: (open) => {
						if (!open && !busyAppId) setApproveBuzzerFor(null);
					},
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogTitle, { children: "Verifikasi buzzer disetujui?" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogDescription, { children: [approveBuzzerFor?.name, " akan ditandai sebagai buzzer terverifikasi dan dapat login."] })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogCancel, {
						disabled: busyAppId === approveBuzzerFor?.id,
						children: "Tidak"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						className: "gradient-brand text-brand-foreground gap-1.5",
						disabled: busyAppId === approveBuzzerFor?.id,
						onClick: () => approveBuzzerFor && void approve(approveBuzzerFor),
						children: busyAppId === approveBuzzerFor?.id ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-1 h-4 w-4 animate-spin" }), "Memverifikasi..."] }) : "Ya, Setujui"
					})] })] })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
					open: !!rejectFor,
					onOpenChange: (o) => {
						if (!o && !busyAppId) {
							setRejectFor(null);
							setNote("");
						}
					},
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
						className: "sm:max-w-md",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Tolak Pendaftaran" }) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-sm text-muted-foreground",
								children: [
									"Berikan alasan penolakan agar buzzer",
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", {
										className: "text-foreground",
										children: rejectFor?.name
									}),
									" mengerti."
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								value: note,
								onChange: (e) => setNote(e.target.value),
								placeholder: "Contoh: Data followers tidak konsisten dengan profil publik.",
								className: "min-h-[100px]"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								disabled: busyAppId === rejectFor?.id,
								onClick: () => {
									setRejectFor(null);
									setNote("");
								},
								children: "Batal"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "destructive",
								disabled: busyAppId === rejectFor?.id,
								onClick: doReject,
								className: "gap-1.5",
								children: busyAppId === rejectFor?.id ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-1 h-4 w-4 animate-spin" }), "Menolak..."] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, { className: "mr-1 h-4 w-4" }), "Konfirmasi Tolak"] })
							})] })
						]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
					open: !!editBuzzer,
					onOpenChange: (o) => {
						if (!o && !isSavingBuzzer) setEditBuzzer(null);
					},
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogContent, {
						className: "sm:max-w-lg max-h-[90vh] flex flex-col p-0 gap-0 overflow-hidden sm:rounded-2xl",
						children: editBuzzer && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, {
								className: "p-5 pb-4 border-b border-border shrink-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
									className: "text-base font-bold flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "h-4 w-4 text-primary" }), " Edit Data Akun Buzzer"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
									className: "text-xs text-muted-foreground mt-0.5",
									children: "Perbarui identitas, platform, followers, dan profil verifikasi buzzer."
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex-1 overflow-y-auto p-5 space-y-3.5 text-xs sm:text-sm",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-xl border border-border p-3 bg-muted/20 text-xs",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground",
											children: "Email Buzzer: "
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-semibold text-foreground",
											children: editBuzzer.email
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid gap-3 sm:grid-cols-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
												className: "text-xs font-semibold",
												children: "Nama Lengkap"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												value: editBuzzerForm.name,
												onChange: (e) => setEditBuzzerForm((prev) => ({
													...prev,
													name: e.target.value
												})),
												placeholder: "Nama buzzer"
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
												className: "text-xs font-semibold",
												children: "Username Akun"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												value: editBuzzerForm.username,
												onChange: (e) => setEditBuzzerForm((prev) => ({
													...prev,
													username: e.target.value
												})),
												placeholder: "@username"
											})]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid gap-3 sm:grid-cols-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
												className: "text-xs font-semibold",
												children: "Platform Utama"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
												value: editBuzzerForm.platform,
												onValueChange: (val) => setEditBuzzerForm((prev) => ({
													...prev,
													platform: val
												})),
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
													className: "w-full",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Pilih platform" })
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
														value: "Instagram",
														children: "Instagram"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
														value: "TikTok",
														children: "TikTok"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
														value: "Twitter",
														children: "Twitter / X"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
														value: "YouTube",
														children: "YouTube"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
														value: "Facebook",
														children: "Facebook"
													})
												] })]
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
												className: "text-xs font-semibold",
												children: "Followers"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												type: "number",
												value: editBuzzerForm.followers,
												onChange: (e) => setEditBuzzerForm((prev) => ({
													...prev,
													followers: Number(e.target.value) || 0
												})),
												placeholder: "Jumlah followers"
											})]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid gap-3 sm:grid-cols-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
												className: "text-xs font-semibold",
												children: "Kategori Konten"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												value: editBuzzerForm.category,
												onChange: (e) => setEditBuzzerForm((prev) => ({
													...prev,
													category: e.target.value
												})),
												placeholder: "Contoh: Lifestyle, Kuliner"
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
												className: "text-xs font-semibold",
												children: "No. WhatsApp / Telepon"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												value: editBuzzerForm.phone,
												onChange: (e) => setEditBuzzerForm((prev) => ({
													...prev,
													phone: e.target.value
												})),
												placeholder: "08xxxxxxxxxx"
											})]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											className: "text-xs font-semibold",
											children: "Kota Asal / Domisili"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											value: editBuzzerForm.city,
											onChange: (e) => setEditBuzzerForm((prev) => ({
												...prev,
												city: e.target.value
											})),
											placeholder: "Contoh: Jakarta Selatan"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											className: "text-xs font-semibold",
											children: "Bio / Deskripsi Profil"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
											value: editBuzzerForm.bio,
											onChange: (e) => setEditBuzzerForm((prev) => ({
												...prev,
												bio: e.target.value
											})),
											placeholder: "Tulis ringkasan profil buzzer...",
											className: "min-h-[75px] resize-none text-xs"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											className: "text-xs font-semibold",
											children: "Catatan Admin"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
											value: editBuzzerForm.reviewNote,
											onChange: (e) => setEditBuzzerForm((prev) => ({
												...prev,
												reviewNote: e.target.value
											})),
											placeholder: "Catatan internal review admin...",
											className: "min-h-[60px] resize-none text-xs"
										})]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
								className: "p-4 border-t border-border bg-card/95 backdrop-blur shrink-0 flex items-center justify-end gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "outline",
									disabled: isSavingBuzzer,
									onClick: () => setEditBuzzer(null),
									children: "Batal"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									className: "gradient-brand text-brand-foreground gap-1.5",
									disabled: isSavingBuzzer,
									onClick: handleSaveEditBuzzer,
									children: [isSavingBuzzer ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "h-4 w-4" }), "Simpan Perubahan"]
								})]
							})
						] })
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialog, {
					open: !!deleteBuzzer,
					onOpenChange: (open) => {
						if (!open && !isDeletingBuzzer) setDeleteBuzzer(null);
					},
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogTitle, {
						className: "flex items-center gap-2 text-rose-600",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-5 w-5" }), " Hapus Pendaftaran Buzzer?"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogDescription, { children: [
						"Apakah Anda yakin ingin menghapus verifikasi buzzer ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: deleteBuzzer?.name }),
						" (",
						deleteBuzzer?.email,
						")?",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
						"Data pendaftaran dan verifikasi akun buzzer ini akan dihapus dari sistem."
					] })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogCancel, {
						disabled: isDeletingBuzzer,
						children: "Batal"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "destructive",
						className: "gap-1.5",
						disabled: isDeletingBuzzer,
						onClick: handleConfirmDeleteBuzzer,
						children: isDeletingBuzzer ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }), "Menghapus..."] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" }), "Ya, Hapus Buzzer"] })
					})] })] })
				})
			] })
		]
	});
}
//#endregion
export { AdminPage as component };
