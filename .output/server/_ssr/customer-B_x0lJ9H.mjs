import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as Link, y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { L as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { n as supabase } from "./client-DwoA1QoZ.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { t as Button } from "./button-BkEeRci-.mjs";
import { n as Label, t as Input } from "./label-B7oQAA24.mjs";
import { $ as LayoutDashboard, A as Printer, At as ChevronRight, B as Music2, Bt as Bell, C as Send, Ct as Clock, Dt as CircleCheck, E as RotateCcw, Et as CircleX, F as PenLine, G as Megaphone, J as LogOut, K as MapPin, M as Plus, Nt as Check, Ot as CircleAlert, S as Settings, U as MessageCircle, V as Moon, Wt as ArrowRight, X as LoaderCircle, _ as Smartphone, at as Heart, bt as CreditCard, c as Twitter, ct as Flame, dt as FileDown, f as Target, ft as Facebook, g as Sparkles, h as Star, ht as ExternalLink, i as Users, it as Image, jt as ChevronLeft, lt as FileText, m as Sun, nt as Instagram, pt as Eye, rt as Inbox, st as Funnel, t as Youtube, u as TrendingUp, ut as FileSpreadsheet, v as ShoppingBag, vt as Download, w as Search, wt as ClipboardCheck, x as Share2, z as Package } from "../_libs/lucide-react.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, s as Textarea, t as Dialog } from "./dialog-BQPGZ99x.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-Dg1urBTx.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as format, t as id } from "../_libs/date-fns.mjs";
import { a as Table, c as TableHead, g as useBuzzerRatings, h as updateCustomerBuzzerRating, i as Skeleton, l as TableHeader, n as AvatarFallback, o as TableBody, p as rateCampaignForAllBuzzers, s as TableCell, t as Avatar, u as TableRow } from "./table-C9Hv1VxK.mjs";
import { t as E } from "../_libs/jspdf.mjs";
import { G as useServiceCatalogs, H as useCampaignJobs, K as useServicePricings, O as exportToExcel, U as useCampaigns, _ as StatusBadge$1, a as AlertDialogDescription, c as AlertDialogTitle, d as Sheet, f as SheetContent, g as StatCard, h as SidebarNav, i as AlertDialogContent, k as exportToPDF, l as MobileBottomNav, m as SidebarCollapseButton, n as AlertDialogAction, o as AlertDialogFooter, q as useSidebarCollapsed, r as AlertDialogCancel, s as AlertDialogHeader, t as AlertDialog, u as Progress, v as Switch } from "./export-utils-Bse6Ov51.mjs";
import { s as useRequireRole, t as clearSession } from "./auth-CNL2N2Mo.mjs";
import { n as useTheme, t as ThemeToggle } from "./theme-toggle-B6xwIFaA.mjs";
import { a as SectionErrorBoundary, d as useQrisSettings, i as SERVICES, l as useAdminBankAccounts, n as CAMPAIGN_TYPES, o as formatIDR, t as BuzzerNameLink, u as useCustomerStore } from "./section-error-boundary-j1MGs4m-.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/customer-B_x0lJ9H.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var svc_trending_default = "/assets/svc-trending-CyrNyK1n.jpg";
var svc_brand_default = "/assets/svc-brand-BBEeD6sI.jpg";
var svc_engagement_default = "/assets/svc-engagement-DmB-_K4F.jpg";
var svc_influencer_default = "/assets/svc-influencer-Duco8HxT.jpg";
var svc_video_default = "/assets/svc-video-Zpdz057k.jpg";
var svc_crowd_default = "/assets/svc-crowd-CkLIlmA_.jpg";
var svc_seminar_default = "/assets/svc-seminar-CjP85bsO.jpg";
var svc_launch_default = "/assets/svc-launch-BCIrDOnO.jpg";
var BY_NAME = {
	"Trending Topic Booster": svc_trending_default,
	"Viral Marketing Campaign": svc_trending_default,
	"Brand Awareness Push": svc_brand_default,
	"Counter Narrative Response": svc_brand_default,
	"Social Engagement Booster": svc_engagement_default,
	"Community Seeding": svc_engagement_default,
	"Product Review Campaign": svc_influencer_default,
	"Influencer Support Program": svc_influencer_default,
	"Livestream Amplifier": svc_video_default,
	"Video Reels Distribution": svc_video_default,
	"Event Crowd Booster": svc_crowd_default,
	"Flash Mob Activation": svc_crowd_default,
	"Community Activation": svc_crowd_default,
	"Concert Cheerleader": svc_crowd_default,
	"Political Rally Crowd": svc_crowd_default,
	"Seminar Audience": svc_seminar_default,
	"Gathering Participants": svc_seminar_default,
	"Grand Opening Crowd": svc_launch_default,
	"Product Launch Crowd": svc_launch_default,
	"Roadshow Support": svc_launch_default
};
function serviceImage(service) {
	return BY_NAME[service.name] ?? svc_trending_default;
}
var PLATFORM_ICON$1 = {
	Instagram: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Instagram, { className: "h-4 w-4" }),
	TikTok: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Music2, { className: "h-4 w-4" }),
	"X (Twitter)": /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Twitter, { className: "h-4 w-4" }),
	Facebook: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Facebook, { className: "h-4 w-4" }),
	YouTube: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Youtube, { className: "h-4 w-4" }),
	Telegram: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "h-4 w-4" }),
	LinkedIn: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Megaphone, { className: "h-4 w-4" })
};
var SERVICE_PLATFORM_ICON = {
	Instagram: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Instagram, { className: "h-5 w-5" }),
	TikTok: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Music2, { className: "h-5 w-5" }),
	"X (Twitter)": /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Twitter, { className: "h-5 w-5" }),
	Facebook: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Facebook, { className: "h-5 w-5" }),
	YouTube: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Youtube, { className: "h-5 w-5" }),
	Telegram: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "h-5 w-5" })
};
function deriveStatus(campaign, jobs) {
	if (campaign.payment_status === "Menunggu Pembayaran") return "Menunggu Pembayaran";
	if (campaign.payment_status === "Menunggu Verifikasi" || campaign.payment_status === "Menunggu Verifikasi Admin") return "Menunggu Verifikasi Admin";
	if (campaign.payment_status === "Pembayaran Ditolak") return "Pembayaran Ditolak";
	if (campaign.status === "Draft") return "Menunggu Konfirmasi";
	if (campaign.status === "Dibatalkan") return "Dibatalkan";
	if (campaign.status === "Selesai") return "Selesai";
	if (jobs.length && jobs.every((j) => j.status === "Selesai")) return "Selesai";
	if (jobs.some((j) => j.status === "Review")) return "Menunggu Verifikasi";
	if (jobs.some((j) => j.status === "Diambil" || j.status === "Revisi")) return "Sedang Dikerjakan";
	return "Menunggu Buzzer";
}
var STATUS_STYLES = {
	"Menunggu Pembayaran": "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
	"Menunggu Verifikasi Admin": "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
	"Pembayaran Ditolak": "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300",
	"Menunggu Konfirmasi": "bg-purple-100 text-purple-700 dark:bg-purple-500/15 dark:text-purple-300",
	Dibatalkan: "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300",
	"Menunggu Buzzer": "bg-slate-100 text-slate-700 dark:bg-slate-500/15 dark:text-slate-200",
	"Sedang Dikerjakan": "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300",
	"Menunggu Verifikasi": "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
	Selesai: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300"
};
function StatusBadge({ status }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: cn("inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold", STATUS_STYLES[status]),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-1.5 w-1.5 rounded-full bg-current" }), status]
	});
}
function startingPrice(svc) {
	return Math.min(...svc.packages.map((p) => p.price));
}
function CustomerHomepageSection({ email, name, onOrder, onGoPesanan }) {
	const campaignsQuery = useCampaigns();
	const jobsQuery = useCampaignJobs();
	const catalogsQuery = useServiceCatalogs();
	const [detail, setDetail] = (0, import_react.useState)(null);
	const [error, setError] = (0, import_react.useState)(null);
	const loading = campaignsQuery.loading || jobsQuery.loading;
	const myCampaigns = (0, import_react.useMemo)(() => campaignsQuery.data.filter((c) => (c.customer_email || "").toLowerCase() === (email || "").toLowerCase()), [campaignsQuery.data, email]);
	const jobsByCampaign = (0, import_react.useMemo)(() => {
		const map = /* @__PURE__ */ new Map();
		for (const c of myCampaigns) map.set(c.id, []);
		for (const j of jobsQuery.data) if (map.has(j.campaign_id)) map.get(j.campaign_id).push(j);
		return map;
	}, [jobsQuery.data, myCampaigns]);
	const myJobs = (0, import_react.useMemo)(() => jobsQuery.data.filter((j) => jobsByCampaign.has(j.campaign_id)), [jobsQuery.data, jobsByCampaign]);
	const seenJobs = (0, import_react.useRef)(/* @__PURE__ */ new Map());
	const seenDone = (0, import_react.useRef)(/* @__PURE__ */ new Set());
	const primed = (0, import_react.useRef)(false);
	(0, import_react.useEffect)(() => {
		if (loading) return;
		if (!primed.current) {
			for (const j of myJobs) seenJobs.current.set(j.id, j.status);
			for (const c of myCampaigns) if (c.status === "Selesai") seenDone.current.add(c.id);
			primed.current = true;
			return;
		}
		for (const j of myJobs) {
			const prev = seenJobs.current.get(j.id);
			if (prev === void 0) {
				if (j.status === "Diambil" && j.buzzer_name) toast.success(`${j.buzzer_name} menerima pekerjaan`, { description: j.campaign_title });
			} else if (prev !== j.status) {
				if (j.status === "Review") toast.info("Bukti pengerjaan baru", { description: `${j.buzzer_name ?? "Buzzer"} — ${j.campaign_title}` });
				else if (j.status === "Diambil" && prev === "Tersedia") toast.success(`${j.buzzer_name ?? "Buzzer"} menerima pekerjaan`, { description: j.campaign_title });
			}
			seenJobs.current.set(j.id, j.status);
		}
		for (const c of myCampaigns) if (c.status === "Selesai" && !seenDone.current.has(c.id)) {
			seenDone.current.add(c.id);
			toast.success("Campaign selesai", { description: c.title });
		}
	}, [
		myJobs,
		myCampaigns,
		loading
	]);
	const stats = (0, import_react.useMemo)(() => {
		let aktif = 0;
		let dikerjakan = 0;
		let verifikasi = 0;
		let selesai = 0;
		for (const c of myCampaigns) {
			const jobs = jobsByCampaign.get(c.id) ?? [];
			if (deriveStatus(c, jobs) === "Selesai") selesai++;
			else aktif++;
			dikerjakan += jobs.filter((j) => j.status === "Diambil" || j.status === "Revisi").length;
			verifikasi += jobs.filter((j) => j.status === "Review").length;
		}
		return {
			aktif,
			dikerjakan,
			verifikasi,
			selesai
		};
	}, [myCampaigns, jobsByCampaign]);
	const dynamicServices = (0, import_react.useMemo)(() => {
		if (!catalogsQuery.data || catalogsQuery.data.length === 0) return SERVICES;
		const catMap = /* @__PURE__ */ new Map();
		for (const c of catalogsQuery.data) if (c.status === "Aktif") catMap.set(c.title.trim().toLowerCase(), c);
		return SERVICES.map((s) => {
			const match = catMap.get(s.name.trim().toLowerCase());
			if (!match) return s;
			const basePrice = Number(match.price);
			const baseSlots = Number(match.slots);
			return {
				...s,
				catalogId: match.id,
				catalogPricePerBuzzer: basePrice,
				catalogSlotsAvailable: baseSlots,
				thumbnailUrl: match.thumbnail_url || s.thumbnailUrl,
				packages: [
					{
						tier: "Basic",
						price: basePrice,
						buzzers: baseSlots,
						reach: `${baseSlots} peserta`,
						benefits: s.packages[0]?.benefits || []
					},
					{
						tier: "Professional",
						price: Math.round(basePrice * 2.2),
						buzzers: Math.round(baseSlots * 2.4),
						reach: `${Math.round(baseSlots * 2.4)} peserta`,
						benefits: s.packages[1]?.benefits || []
					},
					{
						tier: "Enterprise",
						price: Math.round(basePrice * 4.5),
						buzzers: Math.round(baseSlots * 6),
						reach: `${Math.round(baseSlots * 6)} peserta`,
						benefits: s.packages[2]?.benefits || []
					}
				]
			};
		});
	}, [catalogsQuery.data]);
	const popularServices = (0, import_react.useMemo)(() => {
		const count = /* @__PURE__ */ new Map();
		for (const c of campaignsQuery.data) count.set(c.platform, (count.get(c.platform) ?? 0) + 1);
		const score = (s) => s.platforms.reduce((acc, p) => acc + (count.get(p) ?? 0), 0);
		return [...dynamicServices].sort((a, b) => score(b) - score(a) || b.rating - a.rating).slice(0, 4);
	}, [campaignsQuery.data, dynamicServices]);
	const recommendedServices = (0, import_react.useMemo)(() => {
		const count = /* @__PURE__ */ new Map();
		for (const c of myCampaigns) count.set(c.platform, (count.get(c.platform) ?? 0) + 1);
		if (count.size === 0) return [...dynamicServices].sort((a, b) => b.rating - a.rating).slice(4, 8);
		const score = (s) => s.platforms.reduce((acc, p) => acc + (count.get(p) ?? 0), 0);
		return [...dynamicServices].filter((s) => score(s) > 0).sort((a, b) => score(b) - score(a) || b.rating - a.rating).slice(0, 4);
	}, [myCampaigns, dynamicServices]);
	const quickServices = (0, import_react.useMemo)(() => popularServices.slice(0, 3), [popularServices]);
	const ongoing = (0, import_react.useMemo)(() => myCampaigns.filter((c) => deriveStatus(c, jobsByCampaign.get(c.id) ?? []) !== "Selesai"), [myCampaigns, jobsByCampaign]);
	const recentOrders = (0, import_react.useMemo)(() => myCampaigns.slice(0, 5), [myCampaigns]);
	(0, import_react.useEffect)(() => {
		setError(null);
	}, [campaignsQuery.data, jobsQuery.data]);
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-44 rounded-3xl" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
				children: Array.from({ length: 4 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-28 rounded-2xl" }, i))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-4 md:grid-cols-2 xl:grid-cols-3",
				children: Array.from({ length: 3 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-56 rounded-2xl" }, i))
			})
		]
	});
	if (error) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col items-center justify-center rounded-2xl border border-destructive/30 bg-destructive/5 p-10 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "mb-3 h-10 w-10 text-destructive" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-semibold text-destructive",
				children: "Gagal memuat data"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: error
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "outline",
				size: "sm",
				className: "mt-4",
				onClick: () => {
					campaignsQuery.refetch();
					jobsQuery.refetch();
				},
				children: "Coba lagi"
			})
		]
	});
	const firstName = (name || (email || "").split("@")[0] || "Customer").split(" ")[0];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "relative overflow-hidden rounded-3xl border border-border bg-card p-4 sm:p-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-x-0 top-0 h-1.5 gradient-brand" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full gradient-brand opacity-15 blur-2xl" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-medium text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "relative flex h-1.5 w-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" })]
									}), "Data realtime"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
									className: "mt-3 font-display text-2xl font-bold sm:text-3xl",
									children: [
										"Halo, ",
										firstName,
										" 👋"
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 max-w-xl text-sm text-muted-foreground",
									children: ongoing.length > 0 ? `Ada ${ongoing.length} pesanan sedang berjalan dan ${stats.selesai} pesanan selesai.` : "Belum ada pesanan berjalan. Yuk mulai campaign pertama Anda hari ini."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										className: "w-full sm:w-auto gradient-brand text-brand-foreground",
										onClick: () => onOrder?.(),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "mr-1.5 h-4 w-4" }), " Buat Pesanan Baru"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										variant: "outline",
										className: "w-full sm:w-auto",
										onClick: () => onGoPesanan?.(),
										children: ["Lihat semua pesanan ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "ml-1.5 h-4 w-4" })]
									})]
								})
							]
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Total Pesanan Aktif",
						value: stats.aktif.toString(),
						hint: "Sedang berjalan",
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "h-5 w-5" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Sedang Dikerjakan",
						value: stats.dikerjakan.toString(),
						hint: "Buzzer aktif mengerjakan",
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-5 w-5" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Menunggu Verifikasi",
						value: stats.verifikasi.toString(),
						hint: "Bukti perlu direview",
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClipboardCheck, { className: "h-5 w-5" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Selesai",
						value: stats.selesai.toString(),
						hint: "Kampanye tuntas",
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-5 w-5" })
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeader, {
				title: "Mau pesan apa hari ini?",
				subtitle: "Rekomendasi cepat untuk langsung membuat pesanan"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-4 sm:grid-cols-2 xl:grid-cols-3",
				children: quickServices.map((svc) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ServiceCard, {
					service: svc,
					onOrder,
					highlight: true
				}, svc.id))
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeader, {
				title: "Layanan Populer",
				subtitle: "Paling banyak dipesan di platform BuzzHub",
				icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flame, { className: "h-4 w-4 text-orange-500" })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-4 sm:grid-cols-2 xl:grid-cols-4",
				children: popularServices.map((svc) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ServiceCard, {
					service: svc,
					onOrder,
					compact: true
				}, svc.id))
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeader, {
				title: "Rekomendasi Untuk Anda",
				subtitle: myCampaigns.length > 0 ? "Berdasarkan platform yang sering Anda gunakan" : "Pilihan terbaik untuk memulai campaign pertama",
				icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-4 w-4 text-violet-500" })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-4 sm:grid-cols-2 xl:grid-cols-4",
				children: recommendedServices.map((svc) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ServiceCard, {
					service: svc,
					onOrder,
					compact: true
				}, svc.id))
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeader, {
				title: "Riwayat Pesanan Terakhir",
				subtitle: "5 pesanan terbaru dari akun Anda"
			}), recentOrders.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState$1, {
				title: "Riwayat masih kosong",
				desc: "Setiap pesanan yang Anda buat akan tercatat di sini."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card",
				children: recentOrders.map((c) => {
					const status = deriveStatus(c, jobsByCampaign.get(c.id) ?? []);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex cursor-pointer items-center gap-3 p-3.5 sm:p-4 transition-colors hover:bg-muted/40",
						onClick: () => setDetail(c),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-accent text-accent-foreground",
								children: PLATFORM_ICON$1[c.platform] ?? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-4 w-4" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "truncate text-sm font-semibold",
									children: c.title
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "truncate text-xs text-muted-foreground",
									children: [
										c.platform,
										" • ",
										format(new Date(c.created_at), "d MMM yyyy", { locale: id })
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "shrink-0",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								size: "sm",
								className: "hidden sm:inline-flex h-8 w-8 p-0",
								title: "Detail",
								"aria-label": "Detail",
								onClick: () => setDetail(c),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-4 w-4" })
							})
						]
					}, c.id);
				})
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CampaignDetailDialog, {
				campaign: detail,
				jobs: detail ? jobsByCampaign.get(detail.id) ?? [] : [],
				customerEmail: email,
				customerName: name ?? email,
				onOpenChange: (v) => !v && setDetail(null)
			})
		]
	});
}
function SectionHeader({ title, subtitle, icon }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mb-4 flex items-center gap-2",
		children: [icon, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "font-display text-lg font-bold",
			children: title
		}), subtitle && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-xs text-muted-foreground",
			children: subtitle
		})] })]
	});
}
function EmptyState$1({ title, desc, action }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/50 p-12 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-3 grid h-14 w-14 place-items-center rounded-2xl bg-accent text-accent-foreground",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Inbox, { className: "h-7 w-7" })
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
function ServiceCard({ service, onOrder, compact, highlight }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: cn("group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg"),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: cn("relative overflow-hidden", highlight ? "h-36" : "h-28"),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: serviceImage(service),
					alt: `Ilustrasi layanan ${service.name} kategori ${service.category}`,
					loading: "lazy",
					width: 820,
					height: 512,
					className: "h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: cn("absolute inset-0 bg-gradient-to-br opacity-50 mix-blend-multiply", service.image) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-t from-card/90 via-card/10 to-transparent" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "absolute inset-x-0 top-0 flex items-center justify-between px-4 py-3 text-white",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "grid h-10 w-10 place-items-center rounded-xl bg-white/20 backdrop-blur",
						children: SERVICE_PLATFORM_ICON[service.platforms[0]] ?? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-5 w-5" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "inline-flex items-center gap-1 rounded-full bg-black/40 px-2 py-0.5 text-[11px] font-semibold backdrop-blur",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "h-3 w-3 fill-current" }),
							" ",
							service.rating
						]
					})]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-1 flex-col p-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
					variant: "secondary",
					className: "mb-2 w-fit text-[10px]",
					children: service.category
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "font-display text-sm font-bold leading-tight",
					children: service.name
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: cn("mt-1 text-xs text-muted-foreground", compact ? "line-clamp-2" : "line-clamp-3"),
					children: service.desc
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mt-3 flex-1" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[11px] text-muted-foreground",
					children: "Harga Pesanan"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-display text-base font-bold",
					children: formatIDR(startingPrice(service))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "sm",
					className: "mt-3 w-full gradient-brand text-brand-foreground",
					onClick: () => onOrder?.(service),
					children: "Pesan Sekarang"
				})
			]
		})]
	});
}
function MiniStat$1({ icon, label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-lg bg-muted/50 p-2 text-center",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-0.5 flex items-center justify-center gap-1 text-[10px] font-medium uppercase tracking-wide text-muted-foreground",
			children: [icon, label]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "font-display text-base font-bold leading-none",
			children: value
		})]
	});
}
function CampaignDetailDialog({ campaign, jobs, customerEmail, customerName, onOpenChange }) {
	if (!campaign) return null;
	const status = deriveStatus(campaign, jobs);
	const done = jobs.filter((j) => j.status === "Selesai").length;
	const slots = Math.max(campaign.slots, 1);
	const progress = Math.min(100, Math.round(done / slots * 100));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open: true,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "max-h-[90vh] overflow-y-auto sm:max-w-2xl",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
							variant: "secondary",
							className: "gap-1",
							children: [PLATFORM_ICON$1[campaign.platform] ?? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-3.5 w-3.5" }), campaign.platform]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
						className: "mt-2 font-display text-xl",
						children: campaign.title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
						className: "whitespace-pre-line",
						children: campaign.brief
					}),
					campaign.payment_status === "Pembayaran Ditolak" && campaign.payment_rejection_reason && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700",
						children: ["Alasan penolakan pembayaran: ", campaign.payment_rejection_reason]
					})
				] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-3 sm:grid-cols-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiniStat$1, {
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Target, { className: "h-3.5 w-3.5" }),
							label: "Target Buzzer",
							value: campaign.slots.toString()
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiniStat$1, {
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "h-3.5 w-3.5" }),
							label: "Diambil",
							value: jobs.filter((j) => j.status !== "Tersedia").length.toString()
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiniStat$1, {
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClipboardCheck, { className: "h-3.5 w-3.5" }),
							label: "Selesai",
							value: done.toString()
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-1.5 flex items-center justify-between text-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-medium text-muted-foreground",
						children: "Progress Campaign"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "font-semibold",
						children: [progress, "%"]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Progress, {
					value: progress,
					className: "h-2"
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
					className: "mb-2 text-sm font-semibold",
					children: "Daftar Pekerjaan"
				}), jobs.filter((j) => j.buzzer_email).length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "rounded-lg border border-dashed border-border p-4 text-center text-sm text-muted-foreground",
					children: "Belum ada buzzer yang mengambil job ini."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "space-y-2",
					children: jobs.filter((j) => j.buzzer_email).map((j) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
						className: "rounded-lg border border-border bg-card p-3",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "truncate text-sm font-semibold",
									children: j.buzzer_name ?? "Menunggu buzzer"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "truncate text-xs text-muted-foreground",
									children: j.buzzer_email ?? "—"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: cn("shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold", j.status === "Selesai" && "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300", j.status === "Review" && "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300", j.status === "Diambil" && "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300", j.status === "Revisi" && "bg-orange-100 text-orange-700 dark:bg-orange-500/15 dark:text-orange-300", j.status === "Ditolak" && "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300", j.status === "Tersedia" && "bg-slate-100 text-slate-700 dark:bg-slate-500/15 dark:text-slate-200"),
								children: j.status
							})]
						})
					}, j.id))
				})] })
			]
		})
	});
}
var DEFAULT_PREFERENCES$1 = {
	orderStatus: true,
	payment: true,
	buzzerProof: true,
	reviewReminder: true,
	systemPromo: true,
	inApp: true,
	emailWhatsapp: true
};
function getStorageKey$1(email) {
	const clean = (email || "").trim().toLowerCase();
	return clean ? `buzzhub.customer.notifications.${clean}` : "buzzhub.customer.notifications.default";
}
function getCustomerNotifPreferences(email) {
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
function isCustomerNotifEnabled(n, prefs) {
	if (!prefs.inApp) return false;
	const text = `${(n.title || "").toLowerCase()} ${(n.body || "").toLowerCase()}`;
	if (text.includes("rating") || text.includes("ulasan") || text.includes("review") || text.includes("menilai")) return Boolean(prefs.reviewReminder);
	if (text.includes("bukti pengerjaan") || text.includes("bukti") || text.includes("screenshot") || text.includes("tangkapan layar") || text.includes("unggah")) return Boolean(prefs.buzzerProof);
	if (n.type === "payment" || text.includes("pembayaran") || text.includes("tagihan") || text.includes("invoice") || text.includes("transfer") || text.includes("lunas")) return Boolean(prefs.payment);
	if (text.includes("promo") || text.includes("diskon") || text.includes("fitur baru") || text.includes("voucher")) return Boolean(prefs.systemPromo);
	if (n.type === "order" || n.type === "campaign" || text.includes("pesanan") || text.includes("campaign") || text.includes("selesai") || text.includes("dibatalkan") || text.includes("diduplikasi") || text.includes("disetujui") || text.includes("menunggu")) return Boolean(prefs.orderStatus);
	return Boolean(prefs.inApp);
}
function useCustomerNotifPreferences(email) {
	const [prefs, setPrefs] = (0, import_react.useState)(() => getCustomerNotifPreferences(email));
	(0, import_react.useEffect)(() => {
		setPrefs(getCustomerNotifPreferences(email));
		const onStorage = () => {
			setPrefs(getCustomerNotifPreferences(email));
		};
		window.addEventListener("storage", onStorage);
		window.addEventListener("buzzhub_customer_notif_prefs_changed", onStorage);
		return () => {
			window.removeEventListener("storage", onStorage);
			window.removeEventListener("buzzhub_customer_notif_prefs_changed", onStorage);
		};
	}, [email]);
	return prefs;
}
function getStorageKey(email) {
	const clean = (email || "").trim().toLowerCase();
	return clean ? `buzzhub.customer.notifications.${clean}` : "buzzhub.customer.notifications.default";
}
var DEFAULT_PREFERENCES = {
	orderStatus: true,
	payment: true,
	buzzerProof: true,
	reviewReminder: true,
	systemPromo: true,
	inApp: true,
	emailWhatsapp: true
};
function CustomerSettingsSection({ customerEmail }) {
	const { theme, setTheme } = useTheme();
	const [prefs, setPrefs] = (0, import_react.useState)(() => getCustomerNotifPreferences(customerEmail));
	const [saving, setSaving] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		setPrefs(getCustomerNotifPreferences(customerEmail));
	}, [customerEmail]);
	const toggle = (key) => {
		setPrefs((prev) => {
			const next = {
				...prev,
				[key]: !prev[key]
			};
			try {
				localStorage.setItem(getStorageKey(customerEmail), JSON.stringify(next));
				if (typeof window !== "undefined") {
					window.dispatchEvent(new Event("storage"));
					window.dispatchEvent(new CustomEvent("buzzhub_customer_notif_prefs_changed", { detail: next }));
				}
			} catch {}
			return next;
		});
	};
	const handleSave = () => {
		setSaving(true);
		try {
			localStorage.setItem(getStorageKey(customerEmail), JSON.stringify(prefs));
			if (typeof window !== "undefined") {
				window.dispatchEvent(new Event("storage"));
				window.dispatchEvent(new CustomEvent("buzzhub_customer_notif_prefs_changed", { detail: prefs }));
			}
			toast.success("Pengaturan notifikasi customer berhasil disimpan ✓");
		} catch {
			toast.error("Gagal menyimpan pengaturan.");
		} finally {
			setTimeout(() => setSaving(false), 300);
		}
	};
	const handleReset = () => {
		setPrefs({ ...DEFAULT_PREFERENCES });
		try {
			localStorage.setItem(getStorageKey(customerEmail), JSON.stringify(DEFAULT_PREFERENCES));
			if (typeof window !== "undefined") {
				window.dispatchEvent(new Event("storage"));
				window.dispatchEvent(new CustomEvent("buzzhub_customer_notif_prefs_changed", { detail: DEFAULT_PREFERENCES }));
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
							children: "Pengaturan Notifikasi Customer"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground sm:text-sm",
							children: "Atur notifikasi pembaruan pesanan kampanye, tagihan, dan bukti pengerjaan buzzer."
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
								children: "Saluran Notifikasi"
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
										children: "Tampilkan badge dan daftar notifikasi di dashboard aplikasi."
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
										children: "Email & Pesan Tagihan"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted-foreground",
										children: "Kirim bukti tagihan, invoice pembayaran, dan ringkasan ke email customer."
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
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingBag, { className: "h-4 w-4 text-emerald-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-semibold text-sm",
								children: "Pesanan & Pembayaran"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-start justify-between gap-3 rounded-xl border border-border/60 bg-muted/30 p-3.5 transition-colors hover:bg-muted/50",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-start gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "mt-0.5 h-4 w-4 text-emerald-500 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-sm font-semibold",
											children: "Update Status Pesanan"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-muted-foreground",
											children: "Info saat pesanan kampanye mulai dikerjakan buzzer atau telah selesai."
										})] })]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
										checked: prefs.orderStatus,
										onCheckedChange: () => toggle("orderStatus")
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-start justify-between gap-3 rounded-xl border border-border/60 bg-muted/30 p-3.5 transition-colors hover:bg-muted/50",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-start gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CreditCard, { className: "mt-0.5 h-4 w-4 text-sky-500 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-sm font-semibold",
											children: "Status Pembayaran & Tagihan"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-muted-foreground",
											children: "Pemberitahuan saat transfer berhasil diverifikasi lunas oleh admin."
										})] })]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
										checked: prefs.payment,
										onCheckedChange: () => toggle("payment")
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-start justify-between gap-3 rounded-xl border border-border/60 bg-muted/30 p-3.5 transition-colors hover:bg-muted/50",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-start gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Megaphone, { className: "mt-0.5 h-4 w-4 text-primary shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-sm font-semibold",
											children: "Bukti Pekerjaan Buzzer"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-muted-foreground",
											children: "Info ketika buzzer selesai mengunggah link atau tangkapan layar pengerjaan."
										})] })]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
										checked: prefs.buzzerProof,
										onCheckedChange: () => toggle("buzzerProof")
									})]
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-border bg-card p-5 shadow-sm space-y-4 md:col-span-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 border-b border-border pb-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "h-4 w-4 text-amber-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-semibold text-sm",
								children: "Ulasan & Informasi Sistem"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-3 sm:grid-cols-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start justify-between gap-3 rounded-xl border border-border/60 bg-muted/30 p-3.5 transition-colors hover:bg-muted/50",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-start gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "mt-0.5 h-4 w-4 text-amber-500 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm font-semibold",
										children: "Pengingat Beri Rating & Ulasan"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted-foreground",
										children: "Pengingat untuk menilai performa buzzer setelah kampanye berhasil selesai."
									})] })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
									checked: prefs.reviewReminder,
									onCheckedChange: () => toggle("reviewReminder")
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start justify-between gap-3 rounded-xl border border-border/60 bg-muted/30 p-3.5 transition-colors hover:bg-muted/50",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-start gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Megaphone, { className: "mt-0.5 h-4 w-4 text-purple-500 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm font-semibold",
										children: "Promo & Fitur Baru BuzzHub"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted-foreground",
										children: "Informasi paket promosi buzzer, diskon layanan, dan rilis fitur terbaru."
									})] })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
									checked: prefs.systemPromo,
									onCheckedChange: () => toggle("systemPromo")
								})]
							})]
						})]
					})
				]
			})
		]
	});
}
var CAMPAIGN_TYPE_ICON = {
	like: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, { className: "h-4 w-4 text-rose-500" }),
	komentar: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, { className: "h-4 w-4 text-indigo-500" }),
	"like-komentar": /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-4 w-4 text-fuchsia-500" }),
	share: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Share2, { className: "h-4 w-4 text-emerald-500" }),
	follow: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "h-4 w-4 text-sky-500" }),
	review: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "h-4 w-4 text-amber-500" })
};
var CUSTOMER_SECTIONS = [
	"homepage",
	"pesanan",
	"katalog",
	"pembayaran",
	"ulasan",
	"pengaturan"
];
function getInitialCustomerSection() {
	if (typeof window !== "undefined") {
		const sp = new URLSearchParams(window.location.search).get("section");
		if (sp && CUSTOMER_SECTIONS.includes(sp)) return sp;
		try {
			const stored = localStorage.getItem("buzzhub.active_section.customer");
			if (stored && CUSTOMER_SECTIONS.includes(stored)) return stored;
		} catch {}
	}
	return "homepage";
}
var navItems = [
	{
		key: "homepage",
		label: "Homepage",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LayoutDashboard, { className: "h-4 w-4" })
	},
	{
		key: "pesanan",
		label: "Pesanan",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingBag, { className: "h-4 w-4" })
	},
	{
		key: "katalog",
		label: "Katalog",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Package, { className: "h-4 w-4" })
	},
	{
		key: "pembayaran",
		label: "Pembayaran",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CreditCard, { className: "h-4 w-4" })
	},
	{
		key: "ulasan",
		label: "Ulasan",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "h-4 w-4" })
	},
	{
		key: "pengaturan",
		label: "Pengaturan",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settings, { className: "h-4 w-4" })
	}
];
var sectionMeta = {
	homepage: {
		title: "Homepage",
		subtitle: "Pantau pesanan Anda yang sedang dikerjakan buzzer secara realtime"
	},
	pesanan: {
		title: "Pesanan",
		subtitle: "Kelola semua campaign yang telah dipesan"
	},
	katalog: {
		title: "Katalog",
		subtitle: "Pilih layanan buzzer yang tersedia"
	},
	pembayaran: {
		title: "Pembayaran",
		subtitle: "Kelola tagihan dan riwayat transaksi pembayaran"
	},
	ulasan: {
		title: "Ulasan",
		subtitle: "Kelola rating dan komentar Anda untuk buzzer"
	},
	pengaturan: {
		title: "Pengaturan",
		subtitle: "Kelola preferensi notifikasi dan akun customer Anda"
	}
};
var PLATFORM_ICON = {
	"Instagram": /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Instagram, { className: "h-3.5 w-3.5" }),
	"TikTok": /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Music2, { className: "h-3.5 w-3.5" }),
	"X (Twitter)": /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Twitter, { className: "h-3.5 w-3.5" }),
	"Facebook": /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Facebook, { className: "h-3.5 w-3.5" }),
	"YouTube": /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Youtube, { className: "h-3.5 w-3.5" }),
	"Telegram": /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "h-3.5 w-3.5" })
};
function getTodayInputValue() {
	const today = /* @__PURE__ */ new Date();
	const month = String(today.getMonth() + 1).padStart(2, "0");
	const day = String(today.getDate()).padStart(2, "0");
	return `${today.getFullYear()}-${month}-${day}`;
}
function normalizeServiceType(value) {
	return String(value ?? "").trim().toLowerCase();
}
function normalizeCatalogPlatform(platform) {
	if (platform && [
		"Instagram",
		"TikTok",
		"X (Twitter)",
		"Facebook",
		"YouTube",
		"Telegram"
	].includes(platform)) return platform;
	return "Instagram";
}
function normalizeCatalogService(catalog) {
	const platform = normalizeCatalogPlatform(catalog.platform);
	const title = String(catalog.title ?? "Layanan Katalog").trim() || "Layanan Katalog";
	const serviceType = String(catalog.service_type ?? "Layanan buzzer").trim() || "Layanan buzzer";
	const description = String(catalog.description ?? serviceType).trim() || serviceType;
	const type = inferCatalogCampaignType(catalog.service_type) ?? inferCatalogCampaignType(catalog.title) ?? "like";
	const basePrice = Number(catalog.price ?? 0);
	const baseSlots = Number(catalog.slots ?? 25);
	return {
		id: `catalog-${catalog.id}`,
		catalogId: catalog.id,
		category: "Online Buzzer",
		name: title,
		platforms: [platform],
		desc: serviceType,
		longDesc: description,
		rating: 4.9,
		reviews: 45,
		campaignType: type,
		catalogPricePerBuzzer: basePrice,
		catalogSlotsAvailable: baseSlots,
		thumbnailUrl: catalog.thumbnail_url ?? null,
		image: "from-fuchsia-500 to-pink-500",
		benefits: [
			"Buzzer terverifikasi & real people",
			"Laporan realtime & transparan",
			"Konten sesuai brand guideline",
			"Garansi target reach tercapai"
		],
		faqs: [
			{
				q: "Berapa lama campaign berjalan?",
				a: "Rata-rata 5–14 hari tergantung kebutuhan campaign."
			},
			{
				q: "Apakah bisa custom brief?",
				a: "Bisa, brief bisa didiskusikan sebelum eksekusi."
			},
			{
				q: "Bagaimana laporan disampaikan?",
				a: "Dashboard realtime + PDF final report."
			}
		],
		packages: [
			{
				tier: "Basic",
				price: basePrice,
				buzzers: baseSlots,
				reach: `${baseSlots} target buzzer`,
				benefits: ["Buzzer aktif", "Laporan progres"]
			},
			{
				tier: "Professional",
				price: Math.round(basePrice * 2.2),
				buzzers: Math.round(baseSlots * 2.4),
				reach: `${Math.round(baseSlots * 2.4)} target buzzer`,
				benefits: ["Buzzer premium", "Briefing khusus"]
			},
			{
				tier: "Enterprise",
				price: Math.round(basePrice * 4.5),
				buzzers: Math.round(baseSlots * 6),
				reach: `${Math.round(baseSlots * 6)} target buzzer`,
				benefits: ["Target besar", "Priority support"]
			}
		]
	};
}
function inferCatalogCampaignType(value) {
	const source = (value ?? "").toLowerCase();
	if (!source) return void 0;
	if (source.includes("like") && source.includes("komentar")) return "like-komentar";
	if (source.includes("like") && source.includes("comment")) return "like-komentar";
	if (source.includes("like") && !source.includes("komentar")) return "like";
	if (source.includes("komentar") || source.includes("comment")) return "komentar";
	if (source.includes("share")) return "share";
	if (source.includes("follow")) return "follow";
	if (source.includes("review") || source.includes("ulasan")) return "review";
}
function CustomerPage() {
	const session = useRequireRole("customer");
	const navigate = useNavigate();
	const store = useCustomerStore(session?.email, session?.name, session ? {
		name: session.name,
		email: session.email,
		phone: session.phone ?? "",
		city: session.city ?? "",
		company: session.company ?? ""
	} : {});
	const [section, setSection] = (0, import_react.useState)(getInitialCustomerSection);
	const [logoutOpen, setLogoutOpen] = (0, import_react.useState)(false);
	const [notifOpen, setNotifOpen] = (0, import_react.useState)(false);
	const { collapsed, toggle } = useSidebarCollapsed("customer");
	const [proofOrder, setProofOrder] = (0, import_react.useState)(null);
	const [detailOrder, setDetailOrder] = (0, import_react.useState)(null);
	const [editOrder, setEditOrder] = (0, import_react.useState)(null);
	const [cancelOrder, setCancelOrder] = (0, import_react.useState)(null);
	const [wizardOpen, setWizardOpen] = (0, import_react.useState)(false);
	const [wizardService, setWizardService] = (0, import_react.useState)(null);
	const [detailService, setDetailService] = (0, import_react.useState)(null);
	const [payDialog, setPayDialog] = (0, import_react.useState)(null);
	const [invoiceDialog, setInvoiceDialog] = (0, import_react.useState)(null);
	const { data: remoteCampaigns } = useCampaigns();
	const { data: remoteJobs } = useCampaignJobs();
	(0, import_react.useEffect)(() => {
		if (!session?.email) return;
		const userEmail = session.email.toLowerCase();
		const jobsByCampaign = /* @__PURE__ */ new Map();
		for (const job of remoteJobs) {
			const list = jobsByCampaign.get(job.campaign_id) ?? [];
			list.push(job);
			jobsByCampaign.set(job.campaign_id, list);
		}
		remoteCampaigns.filter((c) => (c.customer_email || "").toLowerCase() === userEmail).forEach((campaign) => {
			const jobs = jobsByCampaign.get(campaign.id) ?? [];
			let isCompleted = false;
			if (campaign.status === "Selesai") isCompleted = true;
			else if (jobs.length > 0) {
				if (jobs.filter((j) => j.status === "Selesai" || j.admin_verified_at).length === jobs.length) isCompleted = true;
			}
			if (isCompleted) {
				const title = `Pesanan Selesai`;
				const bodyText = `Pesanan ${campaign.title} sudah selesai, tinggal memberikan rating.`;
				if (!store.state.notifications.some((n) => n.body === bodyText)) store.pushNotif({
					id: `ntf-done-${campaign.id}`,
					type: "campaign",
					title,
					body: bodyText
				});
			}
		});
	}, [
		remoteCampaigns,
		remoteJobs,
		session?.email
	]);
	const notifPrefs = useCustomerNotifPreferences(session?.email);
	const visibleNotifications = (0, import_react.useMemo)(() => store.state.notifications.filter((n) => isCustomerNotifEnabled(n, notifPrefs)), [store.state.notifications, notifPrefs]);
	const unread = notifPrefs.inApp ? visibleNotifications.filter((n) => !n.read).length : 0;
	(0, import_react.useEffect)(() => {
		if (typeof window !== "undefined") {
			try {
				localStorage.setItem("buzzhub.active_section.customer", section);
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
			if (sp && CUSTOMER_SECTIONS.includes(sp)) setSection(sp);
		};
		window.addEventListener("popstate", handlePopState);
		return () => window.removeEventListener("popstate", handlePopState);
	}, []);
	if (!session) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
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
			localStorage.removeItem("buzzhub.active_section.customer");
		} catch {}
		toast.success("Berhasil keluar");
		navigate({ to: "/" });
	};
	const go = (k) => {
		setSection(k);
		window.scrollTo({
			top: 0,
			left: 0,
			behavior: "instant"
		});
	};
	const sidebarUser = {
		name: store.state.profile.name || session.name,
		email: store.state.profile.email || session.email,
		roleLabel: "customer"
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
	const openNewOrder = (svc) => {
		const normalized = svc && svc.catalogId ? {
			...svc,
			platforms: svc.platforms?.length ? svc.platforms.map((p) => normalizeCatalogPlatform(p)) : ["Instagram"],
			campaignType: svc.campaignType ?? deriveCatalogCampaignType(svc)
		} : svc ?? null;
		setWizardService(normalized);
		setWizardOpen(true);
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
								className: "flex min-w-0 items-center gap-2 sm:gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SidebarCollapseButton, {
									collapsed,
									onToggle: toggle
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0 flex flex-col justify-center",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
										className: "truncate font-display text-xl sm:text-2xl font-bold leading-7 tracking-tight",
										children: meta.title
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "truncate text-xs sm:text-sm text-muted-foreground leading-5",
										children: meta.subtitle
									})]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex shrink-0 items-center gap-1.5 sm:gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThemeToggle, {}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										variant: "outline",
										size: "icon",
										className: "relative h-9 w-9 sm:h-10 sm:w-10",
										onClick: () => setNotifOpen(true),
										"aria-label": "Buka Notifikasi",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "h-4 w-4" }), notifPrefs.inApp && unread > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white",
											children: unread > 9 ? "9+" : unread
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "outline",
										size: "icon",
										className: "h-9 w-9 sm:h-10 sm:w-10 md:hidden",
										"aria-label": "Keluar",
										onClick: () => setLogoutOpen(true),
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "h-4 w-4" })
									})
								]
							})]
						}),
						section === "homepage" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionErrorBoundary, {
							title: "Homepage gagal dimuat",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CustomerHomepageSection, {
								email: session.email,
								name: store.state.profile.name || session.name,
								onOrder: (svc) => openNewOrder(svc),
								onGoPesanan: () => go("pesanan")
							})
						}),
						section === "pesanan" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionErrorBoundary, {
							title: "Pesanan gagal dimuat",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PesananSection, {
								store,
								customerEmail: session.email,
								onNew: () => openNewOrder(),
								onDetail: setDetailOrder,
								onProof: (o) => setProofOrder(o)
							})
						}),
						section === "katalog" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionErrorBoundary, {
							title: "Katalog layanan gagal dimuat",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KatalogSection, {
								store,
								onDetail: setDetailService,
								onOrder: (svc) => openNewOrder(svc)
							})
						}),
						section === "pembayaran" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionErrorBoundary, {
							title: "Pembayaran gagal dimuat",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PembayaranSection, {
								store,
								customerEmail: session.email,
								onPay: setPayDialog,
								onInvoice: setInvoiceDialog
							})
						}),
						section === "ulasan" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionErrorBoundary, {
							title: "Ulasan gagal dimuat",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UlasanSection, {
								customerEmail: session.email,
								customerName: session.name
							})
						}),
						section === "pengaturan" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionErrorBoundary, {
							title: "Pengaturan gagal dimuat",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CustomerSettingsSection, { customerEmail: session.email })
						})
					]
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
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogTitle, { children: "Keluar akun customer?" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogDescription, { children: "Anda akan keluar dari sesi saat ini. Data lokal tetap aman." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogCancel, { children: "Batal" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogAction, {
					onClick: doLogout,
					className: "gradient-brand text-brand-foreground",
					children: "Keluar"
				})] })] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NotifSheet, {
				open: notifOpen,
				onOpenChange: setNotifOpen,
				store,
				customerEmail: session.email,
				onSelectSection: go
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProofGalleryDialog, {
				order: proofOrder,
				onOpenChange: (v) => !v && setProofOrder(null)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(OrderDetailDialog, {
				order: detailOrder,
				onOpenChange: (v) => !v && setDetailOrder(null),
				onProof: (o) => {
					setDetailOrder(null);
					setProofOrder(o);
				}
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EditOrderDialog, {
				order: editOrder,
				onOpenChange: (v) => !v && setEditOrder(null),
				store
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialog, {
				open: !!cancelOrder,
				onOpenChange: (v) => !v && setCancelOrder(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogTitle, { children: "Batalkan pesanan?" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogDescription, { children: [
					"Pesanan ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: cancelOrder?.invoice }),
					" — ",
					cancelOrder?.campaignName,
					" akan dibatalkan. Aksi ini tidak dapat diurungkan."
				] })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogCancel, { children: "Batal" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogAction, {
					onClick: () => {
						if (cancelOrder) {
							store.cancelOrder(cancelOrder.id);
							toast.success("Pesanan dibatalkan");
							setCancelOrder(null);
						}
					},
					className: "bg-rose-600 hover:bg-rose-700",
					children: "Ya, Batalkan"
				})] })] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WizardDialog, {
				open: wizardOpen,
				onOpenChange: setWizardOpen,
				initialService: wizardService,
				store,
				onCheckout: (payment) => {
					go("pembayaran");
					setPayDialog(payment);
				}
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ServiceDetailDialog, {
				service: detailService,
				onOpenChange: (v) => !v && setDetailService(null),
				onOrder: (svc) => {
					setDetailService(null);
					openNewOrder(svc);
				}
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PayDialog, {
				payment: payDialog,
				onOpenChange: (v) => !v && setPayDialog(null),
				store
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(InvoiceDialog, {
				payment: invoiceDialog,
				onOpenChange: (v) => !v && setInvoiceDialog(null),
				store
			})
		]
	});
}
var ORDER_STATUSES = [
	"Semua",
	"Menunggu Verifikasi Admin",
	"Menunggu",
	"Diproses",
	"Berjalan",
	"Selesai",
	"Dibatalkan"
];
var PAGE = 8;
function PesananSection({ store, customerEmail, onNew, onDetail, onProof }) {
	const { data: remoteCampaigns } = useCampaigns();
	const { data: remoteJobs } = useCampaignJobs();
	const [status, setStatus] = (0, import_react.useState)("Semua");
	const [q, setQ] = (0, import_react.useState)("");
	const [page, setPage] = (0, import_react.useState)(1);
	const jobsByCampaign = (0, import_react.useMemo)(() => {
		const result = /* @__PURE__ */ new Map();
		for (const job of remoteJobs) {
			const list = result.get(job.campaign_id) ?? [];
			list.push(job);
			result.set(job.campaign_id, list);
		}
		return result;
	}, [remoteJobs]);
	const remoteOrders = (0, import_react.useMemo)(() => store.state.orders.map((order) => {
		const campaign = remoteCampaigns.find((item) => (item.customer_email || "").toLowerCase() === (customerEmail || "").toLowerCase() && item.title.trim().toLowerCase() === order.campaignName.trim().toLowerCase());
		const campaignId = order.campaignId ?? campaign?.id;
		const jobs = campaignId ? jobsByCampaign.get(campaignId) ?? [] : [];
		const isApproved = campaign?.payment_status === "Pembayaran Disetujui" || campaign?.status === "Aktif";
		if (!jobs.length) return campaign?.status === "Selesai" ? {
			...order,
			campaignId,
			status: "Selesai"
		} : isApproved ? {
			...order,
			campaignId,
			status: "Berjalan"
		} : campaign?.payment_status === "Menunggu Verifikasi" || campaign?.payment_status === "Menunggu Verifikasi Admin" ? {
			...order,
			campaignId,
			status: "Menunggu Verifikasi Admin"
		} : order;
		const completed = jobs.filter((job) => job.status === "Selesai" || job.admin_verified_at).length;
		const taken = jobs.filter((job) => job.buzzer_email).length;
		const hasReview = jobs.some((job) => job.status === "Review");
		const hasActive = jobs.some((job) => job.status === "Diambil" || job.status === "Revisi");
		return {
			...order,
			campaignId,
			buzzers: jobs.length,
			buzzersJoined: taken,
			buzzerAccounts: jobs.filter((job) => job.buzzer_email).map((job) => job.buzzer_name || job.buzzer_email),
			progress: Math.round(completed / jobs.length * 100),
			status: campaign?.status === "Selesai" || completed === jobs.length ? "Selesai" : hasReview || hasActive || isApproved ? "Berjalan" : campaign?.payment_status === "Menunggu Verifikasi" || campaign?.payment_status === "Menunggu Verifikasi Admin" ? "Menunggu Verifikasi Admin" : "Menunggu",
			proofs: jobs.filter((job) => job.proof_url).map((job) => ({
				id: job.id,
				buzzerName: job.buzzer_name ?? job.buzzer_email ?? "Buzzer",
				buzzerEmail: job.buzzer_email,
				platform: job.platform,
				imageUrl: job.proof_url.split(" | ")[0],
				caption: job.note ?? "Bukti pengerjaan",
				uploadedAt: job.updated_at,
				verified: job.status === "Selesai" || !!job.admin_verified_at
			}))
		};
	}), [
		store.state.orders,
		jobsByCampaign,
		remoteCampaigns,
		customerEmail
	]);
	const adminOrders = (0, import_react.useMemo)(() => remoteCampaigns.filter((campaign) => (campaign.customer_email || "").toLowerCase() === (customerEmail || "").toLowerCase()).filter((campaign) => campaign.payment_status === "Pembayaran Disetujui").filter((campaign) => !store.state.orders.some((order) => order.campaignId === campaign.id || order.campaignName.trim().toLowerCase() === campaign.title.trim().toLowerCase())).map((campaign) => {
		const jobs = jobsByCampaign.get(campaign.id) ?? [];
		const completed = jobs.filter((job) => job.status === "Selesai").length;
		const taken = jobs.filter((job) => job.buzzer_email).length;
		return {
			id: `remote-${campaign.id}`,
			campaignId: campaign.id,
			buzzerAccounts: jobs.filter((job) => job.buzzer_email).map((job) => job.buzzer_name || job.buzzer_email),
			invoice: `CAM-${campaign.id.slice(0, 8).toUpperCase()}`,
			serviceId: "admin-campaign",
			serviceName: "Kampanye BuzzPro",
			packageTier: "Professional",
			platform: campaign.platform,
			campaignName: campaign.title,
			description: campaign.brief,
			startDate: campaign.created_at.slice(0, 10),
			endDate: campaign.deadline,
			buzzers: campaign.slots,
			buzzersJoined: taken,
			progress: jobs.length ? Math.round(completed / jobs.length * 100) : 0,
			status: campaign.status === "Selesai" ? "Selesai" : campaign.status === "Dibatalkan" ? "Dibatalkan" : "Berjalan",
			total: Number(campaign.budget),
			createdAt: campaign.created_at.slice(0, 10),
			report: {
				reach: 0,
				impression: 0,
				like: 0,
				comment: 0,
				share: 0,
				engagementRate: 0,
				sentiment: {
					positive: 0,
					neutral: 0,
					negative: 0
				},
				daily: [],
				buzzers: []
			},
			proofs: []
		};
	}), [
		remoteCampaigns,
		customerEmail,
		store.state.orders,
		jobsByCampaign
	]);
	const allOrders = (0, import_react.useMemo)(() => [...remoteOrders, ...adminOrders], [remoteOrders, adminOrders]);
	const filtered = (0, import_react.useMemo)(() => allOrders.filter((o) => {
		if (status !== "Semua" && o.status !== status) return false;
		if (q && !o.campaignName.toLowerCase().includes(q.toLowerCase()) && !o.invoice.toLowerCase().includes(q.toLowerCase())) return false;
		return true;
	}), [
		allOrders,
		status,
		q
	]);
	const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE));
	const cp = Math.min(page, totalPages);
	const paged = filtered.slice((cp - 1) * PAGE, cp * PAGE);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 sm:flex-row sm:items-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative flex-1 min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						className: "pl-9 w-full",
						placeholder: "Cari campaign / invoice...",
						value: q,
						onChange: (e) => {
							setQ(e.target.value);
							setPage(1);
						}
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: status,
						onValueChange: (v) => {
							setStatus(v);
							setPage(1);
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectTrigger, {
							className: "w-full sm:w-[180px]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Funnel, { className: "mr-2 h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: ORDER_STATUSES.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: s,
							children: s
						}, s)) })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						className: "w-full sm:w-auto gradient-brand text-brand-foreground",
						onClick: onNew,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "mr-1 h-4 w-4" }), " Pesan Baru"]
					})]
				})]
			}),
			paged.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "rounded-2xl border border-border bg-card p-4 shadow-sm",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Inbox, { className: "h-8 w-8" }),
					title: "Belum ada pesanan",
					desc: "Coba ubah filter atau buat pesanan baru."
				})
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-3 sm:hidden",
				children: paged.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "cursor-pointer rounded-2xl border border-border bg-card p-4 shadow-sm space-y-3 transition-colors hover:bg-muted/40",
					onClick: () => onDetail(o),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono text-xs font-semibold text-muted-foreground",
								children: o.invoice
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge$1, { status: o.status })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
							className: "font-display font-bold text-sm text-foreground line-clamp-2",
							children: o.campaignName
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "inline-flex items-center gap-1",
									children: [
										PLATFORM_ICON[o.platform],
										" ",
										o.platform
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "•" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
									o.buzzersJoined,
									" / ",
									o.buzzers,
									" buzzer"
								] })
							]
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-1 flex items-center justify-between text-xs text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Progress" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "font-semibold text-foreground",
								children: [o.progress, "%"]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Progress, {
							value: o.progress,
							className: "h-1.5"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between border-t border-border/60 pt-2.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10px] uppercase tracking-wider text-muted-foreground",
								children: "Total Biaya"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-bold text-foreground",
								children: formatIDR(o.total)
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-1.5",
								onClick: (e) => e.stopPropagation(),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "sm",
									variant: "outline",
									className: "h-8 w-8 p-0",
									title: "Detail",
									"aria-label": "Detail",
									onClick: () => onDetail(o),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-3.5 w-3.5" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									size: "sm",
									variant: "outline",
									className: "h-8 px-2.5 text-xs text-primary",
									onClick: () => onProof(o),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Image, { className: "mr-1 h-3.5 w-3.5" }), " Bukti"]
								})]
							})]
						})
					]
				}, o.id))
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "hidden sm:block overflow-x-auto rounded-2xl border border-border bg-card shadow-sm",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Invoice" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Campaign" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
						className: "hidden sm:table-cell",
						children: "Platform"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Buzzer" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
						className: "hidden sm:table-cell",
						children: "Total"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Status" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
						className: "hidden sm:table-cell",
						children: "Progress"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
						className: "text-right",
						children: "Aksi"
					})
				] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: paged.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, {
					className: "cursor-pointer",
					onClick: () => onDetail(o),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
							className: "font-mono text-xs",
							children: o.invoice
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
							className: "max-w-[200px] truncate font-medium",
							children: o.campaignName
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
							className: "hidden sm:table-cell",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "inline-flex items-center gap-1",
								children: [
									PLATFORM_ICON[o.platform],
									" ",
									o.platform
								]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							o.buzzersJoined,
							" / ",
							o.buzzers
						] }), o.buzzerAccounts?.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "max-w-[180px] truncate text-xs text-muted-foreground",
							title: o.buzzerAccounts.join(", "),
							children: o.buzzerAccounts.join(", ")
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs text-muted-foreground",
							children: "Menunggu buzzer"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
							className: "hidden sm:table-cell",
							children: formatIDR(o.total)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge$1, { status: o.status }) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
							className: "hidden w-[140px] sm:table-cell",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Progress, {
									value: o.progress,
									className: "h-1.5 flex-1"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-[11px] text-muted-foreground",
									children: [o.progress, "%"]
								})]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
							className: "text-right",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "flex items-center justify-end gap-0.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "icon",
									variant: "ghost",
									className: "h-8 w-8",
									onClick: (e) => {
										e.stopPropagation();
										onDetail(o);
									},
									title: "Detail",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-4 w-4" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "icon",
									variant: "ghost",
									className: "hidden h-8 w-8 text-primary sm:inline-flex",
									onClick: (e) => {
										e.stopPropagation();
										onProof(o);
									},
									title: "Bukti Upload",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Image, { className: "h-4 w-4" })
								})]
							})
						})
					]
				}, o.id)) })] })
			})] }),
			filtered.length > PAGE && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-xs text-muted-foreground",
					children: [
						"Menampilkan ",
						(cp - 1) * PAGE + 1,
						"–",
						Math.min(cp * PAGE, filtered.length),
						" dari ",
						filtered.length
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: "outline",
							disabled: cp <= 1,
							onClick: () => setPage(cp - 1),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "h-4 w-4" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "grid place-items-center px-3 text-sm",
							children: [
								cp,
								" / ",
								totalPages
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: "outline",
							disabled: cp >= totalPages,
							onClick: () => setPage(cp + 1),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-4 w-4" })
						})
					]
				})]
			})
		]
	});
}
var UNSPLASH = (id) => `https://images.unsplash.com/photo-${id}?w=800&h=450&fit=crop&auto=format&q=80`;
var SERVICE_IMAGE_MAP = {
	"Trending Topic Booster": UNSPLASH("1611926653458-09294b3142bf"),
	"Viral Marketing Campaign": UNSPLASH("1611162617213-7d7a39e9b1d7"),
	"Brand Awareness Push": UNSPLASH("1552664730-d307ca884978"),
	"Social Engagement Booster": UNSPLASH("1611605698335-8b1569810432"),
	"Product Review Campaign": UNSPLASH("1556742044-3c52d6e88c62"),
	"Influencer Support Program": UNSPLASH("1524504388940-b1c1722653e1"),
	"Counter Narrative Response": UNSPLASH("1495020689067-958852a7765e"),
	"Livestream Amplifier": UNSPLASH("1598550476439-6847785fcea6"),
	"Video Reels Distribution": UNSPLASH("1596558450268-9c27524ba856"),
	"Community Seeding": UNSPLASH("1529156069898-49953e39b3ac"),
	"Event Crowd Booster": UNSPLASH("1492684223066-81342ee5ff30"),
	"Seminar Audience": UNSPLASH("1540575467063-178a50c2df87"),
	"Grand Opening Crowd": UNSPLASH("1519671482749-fd09be7ccebf"),
	"Product Launch Crowd": UNSPLASH("1505373877841-8d25f7d46678"),
	"Gathering Participants": UNSPLASH("1511578314322-379afb476865"),
	"Flash Mob Activation": UNSPLASH("1533174072545-7a4b6ad7a6c3"),
	"Community Activation": UNSPLASH("1517457373958-b7bdd4587205"),
	"Roadshow Support": UNSPLASH("1517649763962-0c623066013b"),
	"Concert Cheerleader": UNSPLASH("1470229722913-7c0e2dbbafd3"),
	"Political Rally Crowd": UNSPLASH("1591189863430-ab87e120f312")
};
var DEFAULT_ONLINE_IMG = UNSPLASH("1611605698335-8b1569810432");
function serviceImageUrl(s) {
	return s.thumbnailUrl ?? SERVICE_IMAGE_MAP[s.name] ?? DEFAULT_ONLINE_IMG;
}
function KatalogSection({ onDetail, onOrder }) {
	const [q, setQ] = (0, import_react.useState)("");
	const { data: catalogs, loading: catalogsLoading } = useServiceCatalogs();
	const adminCatalogs = catalogs.filter((catalog) => {
		const searchable = `${catalog.title ?? ""} ${catalog.service_type ?? ""} ${catalog.description ?? ""}`.toLowerCase();
		return catalog.status === "Aktif" && (!q || searchable.includes(q.toLowerCase()));
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex flex-wrap items-center gap-3 rounded-2xl border border-border bg-card p-4",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative flex-1 min-w-[180px]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					className: "pl-9",
					placeholder: "Cari layanan...",
					value: q,
					onChange: (e) => setQ(e.target.value)
				})]
			})
		}), catalogsLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-4 sm:grid-cols-2 xl:grid-cols-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-72 rounded-2xl" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-72 rounded-2xl" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-72 rounded-2xl" })
			]
		}) : adminCatalogs.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "rounded-2xl border border-border bg-card p-8 shadow-sm",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
				icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Package, { className: "h-8 w-8 text-muted-foreground" }),
				title: "Belum ada katalog layanan",
				desc: q ? "Tidak ada katalog layanan yang cocok dengan pencarian." : "Belum ada katalog layanan aktif yang dibuat oleh admin."
			})
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-4 sm:grid-cols-2 xl:grid-cols-3",
			children: adminCatalogs.map((catalog) => {
				const catalogService = normalizeCatalogService(catalog);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative h-48 overflow-hidden bg-muted",
						children: [catalog.thumbnail_url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: catalog.thumbnail_url,
							alt: catalog.title ?? "Layanan katalog",
							loading: "lazy",
							className: "absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex h-full items-center justify-center gradient-brand text-brand-foreground",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Megaphone, { className: "h-10 w-10" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "absolute left-3 top-3 rounded-full bg-background/85 px-2.5 py-0.5 text-xs font-semibold text-foreground backdrop-blur",
							children: catalog.platform
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-1 flex-col space-y-3 p-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-display font-bold",
								children: catalog.title ?? "Layanan katalog"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm text-muted-foreground line-clamp-2",
								children: catalog.service_type ?? "Layanan buzzer"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex flex-wrap gap-1.5 text-xs text-muted-foreground",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5",
									children: [
										PLATFORM_ICON[catalogService.platforms[0]],
										" ",
										catalogService.platforms[0]
									]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "rounded-xl border border-border/70 bg-muted/20 p-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[11px] font-medium text-muted-foreground",
										children: "Harga Layanan"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-0.5 text-base font-bold text-gradient-brand",
										children: formatIDR(Number(catalog.price ?? 0))
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-right",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[11px] font-medium text-muted-foreground",
											children: "Target Buzzer"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "mt-0.5 text-sm font-semibold text-foreground",
											children: [Number(catalog.slots ?? 0), " buzzer"]
										})]
									})]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-auto flex items-center gap-2 pt-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "sm",
									variant: "outline",
									className: "h-9 w-9 p-0 shrink-0",
									title: "Detail",
									"aria-label": "Detail",
									onClick: () => onDetail(catalogService),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-4 w-4" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "sm",
									className: "flex-1 gradient-brand text-brand-foreground",
									onClick: () => onOrder(catalogService),
									children: "Pesan"
								})]
							})
						]
					})]
				}, catalog.id);
			})
		})]
	});
}
function PembayaranSection({ store, customerEmail, onPay, onInvoice }) {
	const [status, setStatus] = (0, import_react.useState)("Semua");
	const [q, setQ] = (0, import_react.useState)("");
	const [page, setPage] = (0, import_react.useState)(1);
	const [remotePayments, setRemotePayments] = (0, import_react.useState)([]);
	(0, import_react.useEffect)(() => {
		if (!customerEmail) return;
		const normalized = customerEmail.trim().toLowerCase();
		let isMounted = true;
		const fetchRemote = async () => {
			try {
				const { data, error } = await supabase.from("payments").select("id, invoice_no, campaign_name, status, rejection_reason, amount, method, created_at, customer_email").ilike("customer_email", normalized).order("created_at", { ascending: false });
				if (!isMounted || error || !data) return;
				const mapped = data.map((p) => {
					let pStatus = "Menunggu Verifikasi";
					const rawStatus = (p.status || "").toLowerCase();
					if (rawStatus === "lunas" || rawStatus === "berhasil" || rawStatus === "disetujui") pStatus = "Lunas";
					else if (rawStatus === "gagal" || rawStatus === "ditolak") pStatus = "Gagal";
					else if (rawStatus === "refund") pStatus = "Refund";
					else if (rawStatus === "pending" || rawStatus === "menunggu pembayaran") pStatus = "Belum Dibayar";
					else pStatus = "Menunggu Verifikasi";
					return {
						id: p.id,
						invoice: p.invoice_no || `INV-${p.id.slice(0, 8).toUpperCase()}`,
						orderId: p.id,
						campaignName: p.campaign_name || "Campaign",
						amount: Number(p.amount || 0),
						date: p.created_at ? p.created_at.slice(0, 10) : (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
						method: p.method || "Transfer Bank",
						channel: "Manual Verification",
						status: pStatus
					};
				});
				setRemotePayments(mapped);
			} catch (err) {
				console.warn("Gagal memuat remote payments customer:", err);
			}
		};
		fetchRemote();
		const interval = setInterval(fetchRemote, 3e3);
		const channelId = Math.random().toString(36).slice(2, 7);
		const channel = supabase.channel(`cust-pay-sync-${channelId}`).on("postgres_changes", {
			event: "*",
			schema: "public",
			table: "payments"
		}, () => {
			fetchRemote();
		}).subscribe();
		return () => {
			isMounted = false;
			clearInterval(interval);
			supabase.removeChannel(channel);
		};
	}, [customerEmail]);
	const combinedPayments = (0, import_react.useMemo)(() => {
		const list = [...store.state.payments];
		for (const rp of remotePayments) {
			const idx = list.findIndex((p) => p.id === rp.id || p.invoice === rp.invoice || p.campaignName.trim().toLowerCase() === rp.campaignName.trim().toLowerCase());
			if (idx >= 0) list[idx] = {
				...list[idx],
				status: rp.status,
				amount: rp.amount > 0 ? rp.amount : list[idx].amount,
				date: rp.date || list[idx].date,
				method: rp.method || list[idx].method
			};
			else list.unshift(rp);
		}
		return list;
	}, [store.state.payments, remotePayments]);
	const totalPaid = combinedPayments.filter((p) => p.status === "Lunas").reduce((a, p) => a + p.amount, 0);
	const unpaidBills = combinedPayments.filter((p) => p.status === "Belum Dibayar");
	const unpaidTotal = unpaidBills.reduce((a, p) => a + p.amount, 0);
	const waitingAdminBills = combinedPayments.filter((p) => p.status === "Menunggu Verifikasi");
	const waitingAdminTotal = waitingAdminBills.reduce((a, p) => a + p.amount, 0);
	const filtered = combinedPayments.filter((p) => {
		if (status !== "Semua" && p.status !== status) return false;
		if (q && !p.invoice.toLowerCase().includes(q.toLowerCase()) && !p.campaignName.toLowerCase().includes(q.toLowerCase())) return false;
		return true;
	});
	const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE));
	const cp = Math.min(page, totalPages);
	const paged = filtered.slice((cp - 1) * PAGE, cp * PAGE);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Total Pembayaran",
						value: formatIDR(totalPaid),
						hint: "Sepanjang masa",
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-5 w-5" })
					}),
					unpaidBills.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Tagihan Belum Dibayar",
						value: unpaidBills.length.toString(),
						hint: formatIDR(unpaidTotal),
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CreditCard, { className: "h-5 w-5" })
					}) : waitingAdminBills.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Menunggu Verifikasi Admin",
						value: waitingAdminBills.length.toString(),
						hint: formatIDR(waitingAdminTotal),
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-5 w-5 text-amber-500" })
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Tagihan Aktif",
						value: "0",
						hint: "Semua lunas",
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CreditCard, { className: "h-5 w-5" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Total Transaksi",
						value: combinedPayments.length.toString(),
						hint: "All time",
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-5 w-5" })
					})
				]
			}),
			unpaidBills.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900/40 dark:bg-amber-950/30",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "font-display font-bold text-amber-900 dark:text-amber-200",
					children: "Tagihan Menunggu Pembayaran"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-3 space-y-2",
					children: unpaidBills.slice(0, 3).map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between rounded-lg bg-white p-3 shadow-sm dark:bg-background",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "truncate text-sm font-semibold",
								children: p.campaignName
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs text-muted-foreground",
								children: [
									p.invoice,
									" · ",
									formatIDR(p.amount)
								]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							className: "gradient-brand text-brand-foreground",
							onClick: () => onPay(p),
							children: "Bayar"
						})]
					}, p.id))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 sm:flex-row sm:items-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative flex-1 min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						className: "pl-9 w-full",
						placeholder: "Cari invoice / campaign...",
						value: q,
						onChange: (e) => {
							setQ(e.target.value);
							setPage(1);
						}
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: status,
							onValueChange: (v) => {
								setStatus(v);
								setPage(1);
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectTrigger, {
								className: "w-full sm:w-[220px]",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Funnel, { className: "mr-2 h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: [
								"Semua",
								"Belum Dibayar",
								"Menunggu Verifikasi",
								"Lunas",
								"Refund",
								"Gagal"
							].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: s,
								children: s === "Menunggu Verifikasi" ? "Menunggu Verifikasi Admin" : s
							}, s)) })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							size: "sm",
							className: "flex-1 sm:flex-initial",
							onClick: () => {
								exportToExcel("pembayaran-customer", "Pembayaran", filtered, [
									{
										header: "Invoice",
										accessor: (p) => p.invoice
									},
									{
										header: "Campaign",
										accessor: (p) => p.campaignName
									},
									{
										header: "Tanggal",
										accessor: (p) => p.date
									},
									{
										header: "Metode",
										accessor: (p) => `${p.method} - ${p.channel}`
									},
									{
										header: "Status",
										accessor: (p) => p.status === "Menunggu Verifikasi" ? "Menunggu Verifikasi Admin" : p.status
									},
									{
										header: "Nominal (Rp)",
										accessor: (p) => p.amount
									}
								]);
								toast.success("Data pembayaran diekspor ke Excel");
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileSpreadsheet, { className: "mr-1 h-4 w-4" }), " Excel"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							size: "sm",
							className: "flex-1 sm:flex-initial",
							onClick: () => {
								const total = filtered.reduce((a, p) => a + p.amount, 0);
								const paid = filtered.filter((p) => p.status === "Lunas").reduce((a, p) => a + p.amount, 0);
								exportToPDF("pembayaran-customer", "Laporan Pembayaran Customer", filtered, [
									{
										header: "Invoice",
										accessor: (p) => p.invoice
									},
									{
										header: "Campaign",
										accessor: (p) => p.campaignName
									},
									{
										header: "Tanggal",
										accessor: (p) => p.date
									},
									{
										header: "Metode",
										accessor: (p) => `${p.method} - ${p.channel}`
									},
									{
										header: "Status",
										accessor: (p) => p.status === "Menunggu Verifikasi" ? "Menunggu Verifikasi Admin" : p.status
									},
									{
										header: "Nominal (Rp)",
										accessor: (p) => p.amount
									}
								], [{
									label: "Total Nominal",
									value: formatIDR(total)
								}, {
									label: "Total Lunas",
									value: formatIDR(paid)
								}]);
								toast.success("Laporan pembayaran diekspor ke PDF");
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileDown, { className: "mr-1 h-4 w-4" }), " PDF"]
						})
					]
				})]
			}),
			paged.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "rounded-2xl border border-border bg-card p-6 text-center text-sm text-muted-foreground shadow-sm",
				children: "Belum ada riwayat pembayaran yang cocok."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-3 sm:hidden",
				children: paged.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl border border-border bg-card p-4 shadow-sm space-y-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono text-xs font-semibold text-muted-foreground truncate",
								children: p.invoice
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PaymentBadge, { status: p.status })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
							className: "font-display font-bold text-sm text-foreground line-clamp-2",
							children: p.campaignName
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-muted-foreground mt-0.5",
							children: [
								p.date,
								" · ",
								p.method,
								p.channel ? ` (${p.channel})` : ""
							]
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between border-t border-border/60 pt-2.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10px] uppercase tracking-wider text-muted-foreground",
								children: "Nominal"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-base font-bold text-foreground",
								children: formatIDR(p.amount)
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "sm",
									variant: "outline",
									className: "h-8 w-8 p-0",
									title: "Detail",
									"aria-label": "Detail",
									onClick: () => onInvoice(p),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-3.5 w-3.5" })
								}), (p.status === "Belum Dibayar" || p.status === "Gagal") && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "sm",
									className: "h-8 px-3 text-xs gradient-brand text-brand-foreground",
									onClick: () => onPay(p),
									children: "Bayar"
								})]
							})]
						})
					]
				}, p.id))
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "hidden sm:block rounded-2xl border border-border bg-card shadow-sm overflow-x-auto",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Invoice" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Campaign" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Tanggal" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Metode" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
						className: "text-right",
						children: "Nominal"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Status" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
						className: "text-right",
						children: "Aksi"
					})
				] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: paged.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
						className: "font-mono text-xs",
						children: p.invoice
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
						className: "font-medium",
						children: p.campaignName
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
						className: "text-sm text-muted-foreground",
						children: p.date
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, {
						className: "text-sm",
						children: [p.method, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block text-xs text-muted-foreground",
							children: p.channel
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
						className: "text-right font-semibold whitespace-nowrap",
						children: formatIDR(p.amount)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PaymentBadge, { status: p.status }) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, {
						className: "text-right whitespace-nowrap",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "icon",
								variant: "ghost",
								title: "Detail invoice",
								onClick: () => onInvoice(p),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-4 w-4" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "icon",
								variant: "ghost",
								title: "Download PDF",
								onClick: () => downloadInvoice(p, store),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-4 w-4" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "icon",
								variant: "ghost",
								title: "Cetak",
								onClick: () => printInvoice(p, store),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Printer, { className: "h-4 w-4" })
							}),
							(p.status === "Belum Dibayar" || p.status === "Gagal") && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								className: "ml-1 gradient-brand text-brand-foreground",
								onClick: () => onPay(p),
								children: "Bayar"
							})
						]
					})
				] }, p.id)) })] })
			})] }),
			filtered.length > PAGE && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-xs text-muted-foreground",
					children: [
						"Menampilkan ",
						(cp - 1) * PAGE + 1,
						"–",
						Math.min(cp * PAGE, filtered.length),
						" dari ",
						filtered.length
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: "outline",
							disabled: cp <= 1,
							onClick: () => setPage(cp - 1),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "h-4 w-4" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "grid place-items-center px-3 text-sm",
							children: [
								cp,
								" / ",
								totalPages
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: "outline",
							disabled: cp >= totalPages,
							onClick: () => setPage(cp + 1),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-4 w-4" })
						})
					]
				})]
			})
		]
	});
}
function PaymentBadge({ status }) {
	const map = {
		"Lunas": "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
		"Belum Dibayar": "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300",
		"Menunggu Verifikasi": "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
		"Refund": "bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300",
		"Gagal": "bg-zinc-200 text-zinc-700 dark:bg-zinc-500/20 dark:text-zinc-200"
	};
	const label = status === "Menunggu Verifikasi" ? "Menunggu Verifikasi Admin" : status;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("inline-flex items-center justify-center whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-semibold", map[status]),
		children: label
	});
}
/** Galeri bukti upload: screenshot dari buzzer bahwa pesanan sudah dikerjakan. */
function ProofGalleryDialog({ order, onOpenChange }) {
	const [preview, setPreview] = (0, import_react.useState)(null);
	if (!order) return null;
	const proofs = order.proofs ?? [];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open: !!order,
		onOpenChange: (v) => {
			if (!v) setPreview(null);
			onOpenChange(v);
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "max-w-3xl max-h-[90vh] overflow-y-auto",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
					className: "flex items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Image, { className: "h-5 w-5 text-primary" }),
						" Bukti Upload — ",
						order.campaignName
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogDescription, { children: ["Screenshot yang diunggah buzzer sebagai bukti pesanan sudah selesai · Invoice ", order.invoice] })] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-3 sm:grid-cols-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiniStat, {
							label: "Bukti Masuk",
							value: `${proofs.length}`
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiniStat, {
							label: "Terverifikasi",
							value: `${proofs.filter((p) => p.verified).length}`
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiniStat, {
							label: "Buzzer",
							value: `${order.buzzersJoined}/${order.buzzers}`
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiniStat, {
							label: "Progress",
							value: `${order.progress}%`
						})
					]
				}),
				proofs.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-dashed border-border p-10 text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Image, { className: "mx-auto h-8 w-8 text-muted-foreground" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-sm font-medium",
							children: "Belum ada bukti upload"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: "Bukti akan muncul otomatis setelah buzzer mengunggah screenshot pengerjaan."
						})
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-3",
					children: proofs.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figure", {
						className: "overflow-hidden rounded-xl border border-border bg-card",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setPreview(p),
							className: "block w-full",
							children: p.imageUrl.toLowerCase().includes(".pdf") ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "h-52 w-full flex flex-col items-center justify-center gap-2 bg-rose-500/10 text-rose-600 dark:text-rose-400 p-4 transition-transform hover:scale-[1.03]",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-12 w-12 text-rose-500" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs font-bold uppercase tracking-wider",
										children: "Dokumen Bukti (PDF)"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[11px] text-muted-foreground",
										children: "Klik untuk membuka"
									})
								]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: p.imageUrl,
								alt: `Bukti upload ${p.platform} oleh ${p.buzzerName}`,
								loading: "lazy",
								width: 720,
								height: 1280,
								className: "h-52 w-full object-cover object-top transition-transform hover:scale-[1.03]"
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figcaption", {
							className: "space-y-1 p-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between gap-2",
									children: [p.buzzerEmail ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BuzzerNameLink, {
										name: p.buzzerName,
										email: p.buzzerEmail,
										className: "truncate text-sm"
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "truncate text-sm font-medium",
										children: p.buzzerName
									}), p.verified ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "flex shrink-0 items-center gap-1 text-[10px] font-semibold text-emerald-600",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-3 w-3" }), " Terverifikasi"]
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "shrink-0 text-[10px] font-semibold text-amber-600",
										children: "Menunggu review"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "flex items-center gap-1 text-xs text-muted-foreground",
									children: [
										PLATFORM_ICON[p.platform],
										" ",
										p.platform,
										" · ",
										p.uploadedAt
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "line-clamp-2 text-xs text-muted-foreground",
									children: p.caption
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex gap-2 pt-1",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										size: "sm",
										variant: "outline",
										className: "h-7 flex-1 text-xs",
										onClick: () => setPreview(p),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "mr-1 h-3 w-3" }), " Lihat"]
									})
								})
							]
						})]
					}, p.id))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
					open: !!preview,
					onOpenChange: (v) => !v && setPreview(null),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
						className: "max-w-md",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, { children: ["Bukti dari ", preview?.buzzerName] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogDescription, { children: [
								preview?.platform,
								" · diunggah ",
								preview?.uploadedAt
							] })] }),
							preview && (preview.imageUrl.toLowerCase().includes(".pdf") ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col items-center justify-center gap-3 p-6 rounded-xl border border-rose-500/20 bg-rose-500/10 text-center",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-14 w-14 text-rose-500" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm font-semibold",
										children: "Dokumen Bukti Pengerjaan (PDF)"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted-foreground mt-0.5",
										children: "Format dokumen PDF"
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
										href: preview.imageUrl,
										target: "_blank",
										rel: "noreferrer",
										className: "inline-flex items-center gap-1.5 rounded-lg gradient-brand text-brand-foreground px-4 py-2 text-xs font-semibold shadow-sm",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "h-4 w-4" }), " Buka / Unduh Dokumen PDF"]
									})
								]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: preview.imageUrl,
								alt: `Bukti upload ${preview.platform} oleh ${preview.buzzerName}`,
								loading: "lazy",
								width: 720,
								height: 1280,
								className: "max-h-[65vh] w-full rounded-lg object-contain"
							})),
							preview?.postLink && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: preview.postLink,
								target: "_blank",
								rel: "noreferrer",
								className: "text-xs text-primary underline break-all",
								children: preview.postLink
							})
						]
					})
				})
			]
		})
	});
}
function MiniStat({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-lg bg-muted/50 p-2 text-center",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-[10px] uppercase tracking-wide text-muted-foreground",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm font-semibold",
			children: value
		})]
	});
}
function OrderDetailDialog({ order, onOpenChange, onProof }) {
	if (!order) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open: !!order,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "max-w-2xl max-h-[90vh] overflow-y-auto",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: order.campaignName }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogDescription, { children: [
					"Invoice ",
					order.invoice,
					" · ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge$1, { status: order.status })
				] })] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
								className: "mb-2 text-sm font-semibold",
								children: "Informasi Campaign"
							}),
							order.thumbnailUrl && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mb-3 overflow-hidden rounded-lg border border-border",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: order.thumbnailUrl,
									alt: "Poster / Gambar Acara",
									className: "max-h-48 w-full object-cover"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
								className: "grid gap-2 text-sm sm:grid-cols-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
										className: "text-xs text-muted-foreground",
										children: "Deskripsi"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: order.description })] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
										className: "text-xs text-muted-foreground",
										children: "Platform"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dd", {
										className: "flex items-center gap-1",
										children: [
											PLATFORM_ICON[order.platform],
											" ",
											order.platform
										]
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
										className: "text-xs text-muted-foreground",
										children: "Jumlah Buzzer"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dd", { children: [order.buzzers, " buzzer"] })] }),
									order.link && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
										className: "text-xs text-muted-foreground",
										children: "Link"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
										className: "break-all",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
											href: order.link,
											target: "_blank",
											rel: "noreferrer",
											className: "text-primary underline",
											children: order.link
										})
									})] }),
									order.location && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
										className: "text-xs text-muted-foreground",
										children: "Lokasi"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dd", {
										className: "flex items-center gap-1",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "h-3 w-3 text-muted-foreground" }),
											" ",
											order.location
										]
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
										className: "text-xs text-muted-foreground",
										children: "Periode"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dd", { children: [
										order.startDate,
										" → ",
										order.endDate
									] })] })
								]
							})
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
								className: "mb-2 text-sm font-semibold",
								children: "Status Progress"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex items-center gap-1",
								children: [
									0,
									25,
									50,
									75,
									100
								].map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-1 flex-col items-center",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: cn("grid h-8 w-8 place-items-center rounded-full text-xs font-bold", order.progress >= s ? "gradient-brand text-brand-foreground" : "bg-muted text-muted-foreground"),
										children: order.progress >= s ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4" }) : i + 1
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "mt-1 text-[10px] text-muted-foreground",
										children: [s, "%"]
									})]
								}, s))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Progress, {
								value: order.progress,
								className: "mt-3"
							})
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
							className: "mb-2 text-sm font-semibold",
							children: "Daftar Buzzer Bertugas"
						}), order.buzzerAccounts?.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid gap-2 sm:grid-cols-2",
							children: order.buzzerAccounts.map((name) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex items-center rounded-lg border border-border p-2",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "grid h-8 w-8 place-items-center rounded-full gradient-brand text-xs font-bold text-brand-foreground",
										children: name.split(" ").map((x) => x[0]).join("").slice(0, 2)
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm font-medium",
										children: name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted-foreground",
										children: "Sudah mengambil job"
									})] })]
								})
							}, name))
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "rounded-lg border border-dashed border-border p-4 text-center text-sm text-muted-foreground",
							children: "Menunggu buzzer mengambil job campaign ini."
						})] })
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					onClick: () => onOpenChange(false),
					children: "Tutup"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					className: "gradient-brand text-brand-foreground",
					onClick: () => onProof(order),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Image, { className: "mr-1 h-4 w-4" }), " Bukti Upload"]
				})] })
			]
		})
	});
}
function isValidWorkLink(url) {
	const trimmed = (url ?? "").trim();
	if (!trimmed) return false;
	const candidate = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
	try {
		const parsed = new URL(candidate);
		return Boolean(parsed.hostname && parsed.hostname.includes(".") && parsed.hostname.split(".")[0].length > 0);
	} catch {
		return false;
	}
}
function normalizeWorkLink(url) {
	const trimmed = (url ?? "").trim();
	if (!trimmed) return "";
	return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}
function EditOrderDialog({ order, onOpenChange, store }) {
	const [form, setForm] = (0, import_react.useState)({
		campaignName: "",
		description: "",
		linkOrLocation: "",
		startDate: "",
		endDate: ""
	});
	const [loaded, setLoaded] = (0, import_react.useState)(null);
	const today = getTodayInputValue();
	order && store.services.find((s) => s.id === order.serviceId);
	if (order && loaded !== order.id) {
		setForm({
			campaignName: order.campaignName,
			description: order.description,
			linkOrLocation: order.link ?? "",
			startDate: order.startDate,
			endDate: order.endDate
		});
		setLoaded(order.id);
	}
	if (!order) return null;
	const save = () => {
		if (!form.campaignName.trim() || !form.description.trim() || !form.linkOrLocation.trim()) {
			toast.error("Lengkapi semua data campaign, termasuk link pengerjaan target");
			return;
		}
		if (!isValidWorkLink(form.linkOrLocation)) {
			toast.error("Link pengerjaan harus berupa tautan/URL yang valid (contoh: https://www.instagram.com/p/... atau https://vt.tiktok.com/...)");
			return;
		}
		if (form.startDate < today || form.endDate < today || form.endDate < form.startDate) {
			toast.error("Tanggal mulai dan selesai harus hari ini atau setelahnya, dan tanggal selesai tidak boleh sebelum tanggal mulai.");
			return;
		}
		const normalizedLink = normalizeWorkLink(form.linkOrLocation);
		store.editOrder(order.id, {
			campaignName: form.campaignName.trim(),
			description: form.description.trim(),
			startDate: form.startDate,
			endDate: form.endDate,
			link: normalizedLink || void 0
		});
		toast.success("Pesanan diperbarui");
		onOpenChange(false);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open: !!order,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "max-w-lg",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Edit Pesanan" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: order.invoice })] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Nama Campaign",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: form.campaignName,
								onChange: (e) => setForm({
									...form,
									campaignName: e.target.value
								})
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Deskripsi / Catatan",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								rows: 3,
								value: form.description,
								onChange: (e) => setForm({
									...form,
									description: e.target.value
								})
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Field, {
							label: "Link Video / Postingan Target (Wajib)",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: form.linkOrLocation,
								onChange: (e) => setForm({
									...form,
									linkOrLocation: e.target.value
								}),
								placeholder: "https://instagram.com/p/..."
							}), form.linkOrLocation.trim() && !isValidWorkLink(form.linkOrLocation) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xs text-rose-500 font-medium",
								children: "⚠️ Harap masukkan URL link target yang valid (misal: https://instagram.com/p/...)"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Mulai",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "date",
									min: today,
									value: form.startDate,
									onChange: (e) => setForm({
										...form,
										startDate: e.target.value
									})
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Selesai",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "date",
									min: form.startDate > today ? form.startDate : today,
									value: form.endDate,
									onChange: (e) => setForm({
										...form,
										endDate: e.target.value
									})
								})
							})]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					onClick: () => onOpenChange(false),
					children: "Batal"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					onClick: save,
					className: "gradient-brand text-brand-foreground",
					children: "Simpan"
				})] })
			]
		})
	});
}
function Field({ label, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-1",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
			className: "text-xs",
			children: label
		}), children]
	});
}
function ServiceDetailDialog({ service, onOpenChange, onOrder }) {
	if (!service) return null;
	const isCatalog = !!service.catalogId;
	const { data: servicePricings } = useServicePricings();
	const serviceType = service.campaignType ? CAMPAIGN_TYPES.find((item) => item.key === service.campaignType)?.name : "";
	const servicePrice = servicePricings.find((item) => item.status === "Aktif" && item.platform === service.platforms[0] && normalizeServiceType(item.service_type) === normalizeServiceType(serviceType));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open: !!service,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "max-w-3xl max-h-[90vh] overflow-y-auto",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: cn("-m-6 mb-4 h-40 rounded-t-lg bg-gradient-to-br relative overflow-hidden", service.image),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: serviceImageUrl(service),
							alt: service.name,
							loading: "lazy",
							className: "absolute inset-0 h-full w-full object-cover opacity-90",
							onError: (e) => {
								e.currentTarget.style.display = "none";
							}
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "absolute inset-0 flex items-end p-6",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "rounded-full bg-background/80 px-2.5 py-0.5 text-xs font-semibold text-foreground backdrop-blur",
								children: service.category
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "mt-2 font-display text-2xl font-bold text-white drop-shadow",
								children: service.name
							})] })
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
					className: "sr-only",
					children: service.name
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: service.longDesc })] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
							className: "mb-2 text-sm font-semibold",
							children: "Benefit"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "grid gap-1 text-sm sm:grid-cols-2",
							children: service.benefits.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex items-center gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4 text-emerald-500 shrink-0" }),
									" ",
									b
								]
							}, b))
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
							className: "mb-2 text-sm font-semibold",
							children: "Platform Support"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex flex-wrap gap-1.5 text-xs",
							children: service.platforms.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "inline-flex items-center gap-1 rounded-full bg-muted px-2 py-1",
								children: [
									PLATFORM_ICON[p],
									" ",
									p
								]
							}, p))
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", { children: isCatalog ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
							className: "mb-2 text-sm font-semibold",
							children: "Harga & Slot Layanan"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl border border-primary p-4 shadow-glow",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs font-semibold uppercase text-muted-foreground",
									children: "Tarif Layanan"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 font-display text-xl font-bold text-gradient-brand",
									children: formatIDR(Number(service.catalogPricePerBuzzer ?? 0))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs text-muted-foreground",
									children: [
										"Total tarif · ",
										service.catalogSlotsAvailable ?? 0,
										" target buzzer"
									]
								})
							]
						})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
							className: "mb-2 text-sm font-semibold",
							children: "Harga Pesanan Sendiri"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl border border-primary p-4 shadow-glow",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs font-semibold uppercase text-muted-foreground",
									children: "Harga per buzzer"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 font-display text-xl font-bold text-gradient-brand",
									children: servicePrice ? formatIDR(Number(servicePrice.price_per_buzzer)) : "Belum dikonfigurasi"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground",
									children: "Jumlah buzzer ditentukan customer saat memesan."
								})
							]
						})] }) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
							className: "mb-2 text-sm font-semibold",
							children: "Testimoni"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl bg-muted/50 p-4 text-sm italic",
							children: [
								"\"",
								service.name,
								" membantu brand kami mencapai target 3x lebih cepat. Highly recommended!\" — ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Rina, Marketing Lead" }),
								" (",
								service.reviews,
								" ulasan · ",
								service.rating,
								"★)"
							]
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
							className: "mb-2 text-sm font-semibold",
							children: "FAQ"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "space-y-2",
							children: service.faqs.map((f, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", {
								className: "rounded-lg border border-border p-3 text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("summary", {
									className: "cursor-pointer font-medium",
									children: f.q
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 text-muted-foreground",
									children: f.a
								})]
							}, i))
						})] })
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					onClick: () => onOpenChange(false),
					children: "Kembali"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					className: "gradient-brand text-brand-foreground",
					onClick: () => onOrder(service),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingBag, { className: "mr-1 h-4 w-4" }), " Pesan Sekarang"]
				})] })
			]
		})
	});
}
var WIZ_PLATFORMS = [
	"Instagram",
	"TikTok",
	"X (Twitter)",
	"Facebook",
	"YouTube",
	"Telegram"
];
function deriveCatalogCampaignType(service) {
	const raw = String(service?.campaignType ?? service?.desc ?? service?.name ?? "").toLowerCase();
	if (!raw) return void 0;
	if (raw.includes("like") && !raw.includes("komentar")) return "like";
	if (raw.includes("komentar") || raw.includes("comment")) return "komentar";
	if (raw.includes("like") && raw.includes("komentar")) return "like-komentar";
	if (raw.includes("share")) return "share";
	if (raw.includes("follow")) return "follow";
	if (raw.includes("review") || raw.includes("ulasan")) return "review";
}
function WizardDialog({ open, onOpenChange, initialService, store, onCheckout }) {
	const normalizedInitialService = initialService && initialService.catalogId && !initialService.campaignType ? {
		...initialService,
		campaignType: deriveCatalogCampaignType(initialService)
	} : initialService;
	const [step, setStep] = (0, import_react.useState)(1);
	const [platform, setPlatform] = (0, import_react.useState)(normalizedInitialService?.platforms[0] ?? "Instagram");
	const [service, setService] = (0, import_react.useState)(normalizedInitialService);
	const [buzzerCount, setBuzzerCount] = (0, import_react.useState)(1);
	const [form, setForm] = (0, import_react.useState)({
		campaignName: "",
		description: "",
		linkOrLocation: "",
		startDate: "",
		endDate: ""
	});
	const { data: servicePricings, loading: pricingLoading } = useServicePricings();
	const [openedFor, setOpenedFor] = (0, import_react.useState)(null);
	const key = (open ? "1" : "0") + (normalizedInitialService?.id ?? "");
	(0, import_react.useEffect)(() => {
		if (!open || openedFor === key) return;
		setStep(normalizedInitialService?.catalogId ? 5 : 1);
		setService(normalizedInitialService);
		setBuzzerCount(1);
		setPlatform(normalizedInitialService?.platforms[0] ?? "Instagram");
		setForm({
			campaignName: "",
			description: "",
			linkOrLocation: "",
			startDate: "",
			endDate: ""
		});
		setOpenedFor(key);
	}, [
		key,
		normalizedInitialService,
		open,
		openedFor
	]);
	const isCatalog = !!service?.catalogId;
	const selectedServiceType = service?.campaignType ? CAMPAIGN_TYPES.find((item) => item.key === service.campaignType)?.name ?? "" : "";
	const customPricing = !isCatalog ? servicePricings.find((item) => item.status === "Aktif" && item.platform === platform && normalizeServiceType(item.service_type) === normalizeServiceType(selectedServiceType)) : null;
	const selectedPkg = isCatalog && service ? {
		tier: service.desc || "Layanan Langsung",
		price: Number(service.catalogPricePerBuzzer ?? 0),
		buzzers: Number(service.catalogSlotsAvailable ?? 1),
		reach: `${Number(service.catalogSlotsAvailable ?? 1)} buzzer`,
		benefits: [
			"Buzzer terverifikasi & real people",
			"Laporan realtime & transparan",
			"Garansi target reach tercapai"
		]
	} : customPricing ? {
		tier: selectedServiceType,
		price: Number(customPricing.price_per_buzzer) * buzzerCount,
		buzzers: buzzerCount,
		reach: `${buzzerCount} buzzer`,
		benefits: [
			"Harga per buzzer dari konfigurasi admin",
			"Jumlah buzzer dapat ditentukan customer",
			"Pembayaran menunggu verifikasi admin"
		]
	} : null;
	const submit = () => {
		if (!service) return;
		if (!form.campaignName.trim() || !form.description.trim() || !form.linkOrLocation.trim() || !form.startDate || !form.endDate) {
			toast.error("Lengkapi semua data campaign, termasuk link pengerjaan target");
			return;
		}
		if (!isValidWorkLink(form.linkOrLocation)) {
			toast.error("Link pengerjaan harus berupa tautan/URL valid (contoh: https://www.instagram.com/p/... atau https://vt.tiktok.com/...)");
			return;
		}
		const today = getTodayInputValue();
		if (form.startDate < today || form.endDate < today || form.endDate < form.startDate) {
			toast.error("Tanggal mulai dan selesai harus hari ini atau setelahnya, dan tanggal selesai tidak boleh sebelum tanggal mulai.");
			return;
		}
		if (!isCatalog && (!customPricing || buzzerCount < 1)) {
			toast.error(pricingLoading ? "Harga layanan sedang dimuat." : "Harga per buzzer untuk layanan ini belum dikonfigurasi admin.");
			return;
		}
		if (isCatalog && (!selectedPkg || selectedPkg.price <= 0)) {
			toast.error("Tarif katalog belum valid.");
			return;
		}
		const selectedBuzzerCount = isCatalog ? selectedPkg?.buzzers ?? 0 : buzzerCount;
		const selectedPackagePrice = isCatalog ? selectedPkg?.price ?? 0 : Number(customPricing?.price_per_buzzer ?? 0) * buzzerCount;
		const normalizedLink = normalizeWorkLink(form.linkOrLocation);
		const taskType = service?.campaignType || deriveCatalogCampaignType(service) || "like";
		const taskName = CAMPAIGN_TYPES.find((item) => item.key === taskType)?.name || (isCatalog ? service.desc : selectedServiceType) || "Pengerjaan";
		const { payment } = store.createOrder({
			serviceId: service.id,
			packageTier: isCatalog ? service.desc || "Layanan Langsung" : selectedServiceType || taskName,
			platform,
			campaignName: form.campaignName.trim(),
			description: form.description.trim(),
			link: normalizedLink,
			startDate: form.startDate,
			endDate: form.endDate,
			service: {
				...service,
				campaignType: taskType
			},
			buzzers: selectedBuzzerCount,
			pricePerBuzzer: isCatalog ? Math.round(selectedPackagePrice / Math.max(1, selectedBuzzerCount)) : customPricing?.price_per_buzzer,
			serviceType: isCatalog ? service.desc || taskName : selectedServiceType || taskName,
			catalogPackagePrice: isCatalog ? selectedPackagePrice : void 0,
			catalogPackageBuzzerCount: isCatalog ? selectedBuzzerCount : void 0
		});
		toast.success("Detail pesanan siap dibayar.");
		onOpenChange(false);
		onCheckout(payment);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "w-[calc(100vw-1.5rem)] max-w-2xl max-h-[88vh] overflow-y-auto overflow-x-hidden p-4 sm:p-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, {
					className: "min-w-0 pr-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
						className: "text-base leading-snug break-words sm:text-lg",
						children: isCatalog ? "Konfirmasi Pesanan" : `Buat Pesanan Baru — Langkah ${step} / 5`
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
						className: "break-words",
						children: isCatalog ? "Periksa detail paket sebelum melanjutkan pembayaran." : "Ikuti wizard untuk menyelesaikan pemesanan campaign Anda."
					})]
				}),
				!isCatalog && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex w-full min-w-0 gap-1",
					children: [
						1,
						2,
						3,
						4,
						5
					].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: cn("h-1.5 flex-1 rounded-full", step >= s ? "gradient-brand" : "bg-muted") }, s))
				}),
				step === 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
						className: "mb-3 font-semibold",
						children: "Pilih Platform"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-2 gap-2 sm:grid-cols-3",
						children: WIZ_PLATFORMS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setPlatform(p),
							className: cn("flex min-w-0 items-center gap-2 rounded-xl border p-3 text-sm font-medium transition-colors", platform === p ? "border-primary bg-primary/5" : "border-border hover:bg-muted/50"),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "shrink-0",
									children: PLATFORM_ICON[p]
								}),
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "truncate",
									children: p
								})
							]
						}, p))
					})]
				}),
				step === 2 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
							className: "font-semibold",
							children: "Pilih Jenis Campaign"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mb-3 text-sm text-muted-foreground",
							children: "Pilih jenis aktivitas yang ingin dilakukan buzzer."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid w-full min-w-0 gap-2 max-h-80 overflow-y-auto overflow-x-hidden pr-1",
							children: CAMPAIGN_TYPES.map((c) => {
								const svc = store.services.find((s) => s.campaignType === c.key);
								if (!svc) return null;
								const active = service?.id === svc.id;
								const pricing = servicePricings.find((item) => item.status === "Aktif" && item.platform === platform && normalizeServiceType(item.service_type) === normalizeServiceType(c.name));
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => {
										if (service?.catalogId) {
											setService({
												...service,
												campaignType: c.key
											});
											return;
										}
										setService(svc);
									},
									className: cn("flex w-full min-w-0 items-center gap-3 rounded-xl border p-3 text-left transition-colors", active ? "border-primary bg-primary/5" : "border-border hover:bg-muted/50"),
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-muted",
											children: CAMPAIGN_TYPE_ICON[c.key]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "min-w-0 flex-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex flex-wrap items-center gap-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-sm font-semibold break-words",
													children: c.name
												}), active && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-semibold text-primary",
													children: "Dipilih"
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-xs text-muted-foreground break-words",
												children: c.desc
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "shrink-0 rounded-md bg-muted px-2 py-1 text-[11px] font-medium text-muted-foreground",
											children: pricing ? `${formatIDR(Number(pricing.price_per_buzzer))} / buzzer` : pricingLoading ? "Memuat harga..." : "Harga belum tersedia"
										})
									]
								}, c.key);
							})
						})
					]
				}),
				step === 3 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0 space-y-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
							className: "font-semibold",
							children: "Isi Detail Campaign"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Nama Campaign",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: form.campaignName,
								onChange: (e) => setForm({
									...form,
									campaignName: e.target.value
								}),
								placeholder: "Contoh: Launch Skincare Glowin"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Deskripsi / Brief Khusus",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								rows: 3,
								value: form.description,
								onChange: (e) => setForm({
									...form,
									description: e.target.value
								}),
								placeholder: "Jelaskan instruksi atau tujuan khusus campaign untuk buzzer..."
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Field, {
							label: "Link Video / Postingan / Akun Target (Wajib)",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: form.linkOrLocation,
								onChange: (e) => setForm({
									...form,
									linkOrLocation: e.target.value
								}),
								placeholder: `https://${platform.toLowerCase().replace(/[^a-z]/g, "") || "instagram"}.com/...`
							}), form.linkOrLocation.trim() && !isValidWorkLink(form.linkOrLocation) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xs text-rose-500 font-medium",
								children: "⚠️ Harap masukkan URL link target yang valid (misal: https://instagram.com/p/...)"
							}) : form.linkOrLocation.trim() ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 text-[11px] text-emerald-600 font-medium",
								children: [
									"✓ Link valid. Buzzer akan membuka tautan ini langsung untuk tugas ",
									selectedServiceType || "pengerjaan",
									"."
								]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 text-[11px] text-muted-foreground",
								children: [
									"🔗 Link ini wajib diisi link video/postingan yang akan dikerjakan buzzer (",
									selectedServiceType || "like/komen/share/follow",
									")."
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-1 gap-3 sm:grid-cols-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Tanggal Mulai",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "date",
									min: getTodayInputValue(),
									value: form.startDate,
									onChange: (e) => setForm({
										...form,
										startDate: e.target.value
									})
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Tanggal Selesai",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "date",
									min: form.startDate > getTodayInputValue() ? form.startDate : getTodayInputValue(),
									value: form.endDate,
									onChange: (e) => setForm({
										...form,
										endDate: e.target.value
									})
								})
							})]
						})
					]
				}),
				step === 4 && service && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0 space-y-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
						className: "font-semibold",
						children: isCatalog ? "Ringkasan Layanan" : "Harga dan Jumlah Buzzer"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "rounded-xl border border-border p-4 text-sm space-y-3",
						children: isCatalog ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground",
							children: "Layanan ini memiliki harga dan jumlah buzzer yang sudah ditetapkan."
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl border border-primary/40 bg-primary/5 p-4 space-y-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[11px] font-medium text-muted-foreground",
									children: "Harga Layanan"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-0.5 text-xl font-bold text-gradient-brand",
									children: formatIDR(Number(service.catalogPricePerBuzzer ?? 0))
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-right",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[11px] font-medium text-muted-foreground",
										children: "Target Buzzer"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "mt-0.5 text-sm font-semibold text-foreground",
										children: [Number(service.catalogSlotsAvailable ?? 0), " buzzer"]
									})]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1 pt-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "flex items-center gap-2 text-xs text-muted-foreground",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3.5 w-3.5 text-emerald-500" }), " Buzzer terverifikasi & real people"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "flex items-center gap-2 text-xs text-muted-foreground",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3.5 w-3.5 text-emerald-500" }), " Laporan realtime & transparan"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "flex items-center gap-2 text-xs text-muted-foreground",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3.5 w-3.5 text-emerald-500" }), " Garansi target reach tercapai"]
									})
								]
							})]
						})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
								label: "Jenis layanan",
								value: selectedServiceType || "-"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
								label: "Harga per buzzer",
								value: customPricing ? formatIDR(Number(customPricing.price_per_buzzer)) : pricingLoading ? "Memuat..." : "Belum tersedia"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted-foreground",
									children: "Jumlah buzzer"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											type: "button",
											size: "icon",
											variant: "outline",
											disabled: buzzerCount <= 1,
											onClick: () => setBuzzerCount((value) => Math.max(1, value - 1)),
											children: "-"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "min-w-12 text-center font-semibold",
											children: buzzerCount
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											type: "button",
											size: "icon",
											variant: "outline",
											onClick: () => setBuzzerCount((value) => value + 1),
											children: "+"
										})
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
								label: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Total harga" }),
								value: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", {
									className: "text-lg text-gradient-brand",
									children: formatIDR(Number(customPricing?.price_per_buzzer ?? 0) * buzzerCount)
								})
							})
						] })
					})]
				}),
				step === 5 && service && selectedPkg && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0 space-y-3",
					children: [
						!isCatalog && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
							className: "font-semibold",
							children: "Checkout"
						}),
						isCatalog && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-3 rounded-xl border border-border p-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-muted-foreground",
									children: "Periksa paket dari katalog admin dan lengkapi detail campaign sebelum pembayaran."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Nama Campaign",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: form.campaignName,
										onChange: (e) => setForm({
											...form,
											campaignName: e.target.value
										}),
										placeholder: "Nama campaign"
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Instruksi / Catatan Pengerjaan",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
										rows: 3,
										value: form.description,
										onChange: (e) => setForm({
											...form,
											description: e.target.value
										}),
										placeholder: "Contoh: Beri komentar positif tentang produk..."
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Field, {
									label: "Link Video / Postingan Target (Wajib)",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: form.linkOrLocation,
										onChange: (e) => setForm({
											...form,
											linkOrLocation: e.target.value
										}),
										placeholder: `https://${platform.toLowerCase().replace(/[^a-z]/g, "") || "instagram"}.com/...`
									}), form.linkOrLocation.trim() && !isValidWorkLink(form.linkOrLocation) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 text-xs text-rose-500 font-medium",
										children: "⚠️ Harap masukkan URL link target yang valid (contoh: https://...)"
									}) : form.linkOrLocation.trim() ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 text-[11px] text-emerald-600 font-medium",
										children: "✓ Link valid. Buzzer akan langsung membuka tautan ini."
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 text-[11px] text-muted-foreground",
										children: "🔗 Link ini wajib diisi tautan video/postingan yang akan dikerjakan oleh buzzer."
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-1 gap-3 sm:grid-cols-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "Tanggal Mulai",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											type: "date",
											min: getTodayInputValue(),
											value: form.startDate,
											onChange: (e) => setForm({
												...form,
												startDate: e.target.value
											})
										})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "Tanggal Selesai",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											type: "date",
											min: form.startDate > getTodayInputValue() ? form.startDate : getTodayInputValue(),
											value: form.endDate,
											onChange: (e) => setForm({
												...form,
												endDate: e.target.value
											})
										})
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl border border-border p-4 text-sm space-y-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
									label: "Layanan",
									value: service.name
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
									label: "Kategori",
									value: service.category
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
									label: "Platform",
									value: platform
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
									label: "Detail layanan",
									value: service.desc || service.longDesc
								}),
								isCatalog ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
									label: "Harga layanan",
									value: formatIDR(selectedPkg.price)
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
									label: "Jumlah buzzer",
									value: `${selectedPkg.buzzers} buzzer`
								})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
									label: "Harga per buzzer",
									value: formatIDR(Number(customPricing?.price_per_buzzer ?? 0))
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
									label: "Jumlah buzzer",
									value: `${selectedPkg.buzzers} buzzer`
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
									label: "Campaign",
									value: form.campaignName || "-"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
									label: "Periode",
									value: `${form.startDate || "-"} → ${form.endDate || "-"}`
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "my-2 h-px bg-border" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
									label: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Total" }),
									value: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", {
										className: "text-lg text-gradient-brand",
										children: formatIDR(selectedPkg?.price ?? 0)
									})
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: "Pesanan dibuat setelah Anda menekan Bayar. Pembayaran menunggu verifikasi Admin sebelum job dibuka untuk buzzer."
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
					className: "flex-col-reverse gap-2 sm:flex-row sm:!justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						className: "w-full sm:w-auto",
						variant: "outline",
						disabled: !isCatalog && step <= 1,
						onClick: () => isCatalog ? onOpenChange(false) : setStep(step - 1),
						children: isCatalog ? "Kembali" : "Sebelumnya"
					}), step < 5 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						className: "w-full gradient-brand text-brand-foreground sm:w-auto",
						disabled: step === 2 && !service || step === 3 && (!form.campaignName.trim() || !form.description.trim() || !form.linkOrLocation.trim() || !isValidWorkLink(form.linkOrLocation) || !form.startDate || !form.endDate),
						onClick: () => setStep(step + 1),
						children: "Lanjut"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						className: "w-full gradient-brand text-brand-foreground sm:w-auto",
						disabled: isCatalog && (!selectedPkg || !form.campaignName.trim() || !form.description.trim() || !form.linkOrLocation.trim() || !isValidWorkLink(form.linkOrLocation) || !form.startDate || !form.endDate),
						onClick: submit,
						children: "Lanjutkan Pembayaran"
					})]
				})
			]
		})
	});
}
function Row({ label, value, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("flex items-center justify-between gap-3 min-w-0 w-full", className),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "shrink-0 text-muted-foreground",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "min-w-0 text-right",
			children: value
		})]
	});
}
function PayDialog({ payment, onOpenChange, store }) {
	const { activeAccounts: adminBanks } = useAdminBankAccounts();
	const qris = useQrisSettings();
	const [method, setMethod] = (0, import_react.useState)("Transfer Bank");
	const [channel, setChannel] = (0, import_react.useState)("BCA");
	const [processing, setProcessing] = (0, import_react.useState)(false);
	const availableMethods = (0, import_react.useMemo)(() => {
		const list = [{
			method: "Transfer Bank",
			channels: adminBanks.length > 0 ? adminBanks.map((b) => b.bankName) : [
				"BCA",
				"Mandiri",
				"BRI",
				"BNI"
			]
		}];
		if (qris.isEnabled && qris.imageUrl) list.push({
			method: "QRIS",
			channels: ["QRIS"]
		});
		return list;
	}, [
		adminBanks,
		qris.isEnabled,
		qris.imageUrl
	]);
	const opt = availableMethods.find((m) => m.method === method) || availableMethods[0];
	(0, import_react.useEffect)(() => {
		if (!availableMethods.some((m) => m.method === method)) setMethod(availableMethods[0]?.method || "Transfer Bank");
	}, [availableMethods, method]);
	(0, import_react.useEffect)(() => {
		if (!opt.channels.includes(channel)) setChannel(opt.channels[0] || "");
	}, [
		method,
		opt,
		channel
	]);
	if (!payment) return null;
	const submit = async () => {
		setProcessing(true);
		try {
			let bankDetailsNote = `${method} (${channel})`;
			if (method === "Transfer Bank") {
				const selectedAdminBank = adminBanks.find((b) => b.bankName.toLowerCase() === channel.toLowerCase());
				bankDetailsNote = selectedAdminBank ? `Rekening Admin: Bank ${selectedAdminBank.bankName} - ${selectedAdminBank.accountNumber} a.n ${selectedAdminBank.accountHolder}` : `Transfer Bank ${channel}`;
			} else if (method === "QRIS") bankDetailsNote = `Pembayaran QRIS (${qris.merchantName || "QRIS Merchant"})`;
			await store.payInvoice(payment.id, method, channel, bankDetailsNote);
			toast.success("Pembayaran berhasil dikirim dan menunggu verifikasi Admin.");
			onOpenChange(false);
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "Pembayaran gagal dikirim.");
		} finally {
			setProcessing(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open: !!payment,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "max-w-md",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, { children: ["Bayar Invoice ", payment.invoice] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogDescription, { children: [
					payment.campaignName,
					" — ",
					formatIDR(payment.amount)
				] })] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Metode Pembayaran",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: method,
								onValueChange: (v) => {
									setMethod(v);
									const found = availableMethods.find((m) => m.method === v);
									if (found) setChannel(found.channels[0]);
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: availableMethods.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: m.method,
									children: m.method
								}, m.method)) })]
							})
						}),
						method === "Transfer Bank" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Pilih Channel Bank",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid grid-cols-2 gap-2",
								children: opt.channels.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setChannel(c),
									className: cn("rounded-lg border p-2 text-sm font-medium transition-colors", channel === c ? "border-primary bg-primary/5 text-primary font-semibold" : "border-border hover:bg-muted/50"),
									children: c
								}, c))
							})
						}),
						method === "QRIS" && qris.imageUrl && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl border border-border bg-card p-4 text-center space-y-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: qris.imageUrl,
									alt: qris.merchantName || "QRIS Merchant",
									className: "mx-auto block h-auto max-h-[220px] w-full max-w-[220px] rounded-lg object-contain border border-border/60 bg-white p-2 shadow-xs"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs font-semibold text-foreground",
									children: qris.merchantName
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] text-muted-foreground",
									children: "Scan QRIS di atas untuk melakukan pembayaran"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-lg bg-muted/50 p-3 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted-foreground",
									children: "Total Tagihan"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: formatIDR(payment.amount) })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between text-xs mt-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted-foreground",
									children: "Metode"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
									method,
									" · ",
									channel
								] })]
							})]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
					className: "mt-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						onClick: () => onOpenChange(false),
						children: "Batal"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						className: "gradient-brand text-brand-foreground",
						disabled: processing,
						onClick: submit,
						children: processing ? "Memproses..." : "Bayar Sekarang"
					})]
				})
			]
		})
	});
}
function InvoiceDialog({ payment, onOpenChange, store }) {
	if (!payment) return null;
	const order = store.state.orders.find((o) => o.id === payment.orderId);
	const proofs = order?.proofs ?? [];
	const done = order ? Math.round(order.progress / 100 * order.buzzers) : 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open: !!payment,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "w-full max-w-md max-h-[85vh] overflow-y-auto overflow-x-hidden",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Detail Pembayaran" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogDescription, { children: ["Rincian invoice ", payment.invoice] })] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "w-full min-w-0 rounded-xl border border-border p-4 space-y-2 text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "Nomor Invoice",
							value: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono",
								children: payment.invoice
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "Campaign",
							value: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "inline-block max-w-[200px] truncate align-bottom",
								children: payment.campaignName
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "Metode",
							value: `${payment.method} · ${payment.channel}`
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "Tanggal",
							value: payment.date
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "Status",
							value: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PaymentBadge, { status: payment.status })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "my-2 h-px bg-border" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-bold text-foreground",
								children: "Total Tagihan"
							}),
							value: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-lg font-bold text-sky-400",
								children: formatIDR(payment.amount)
							})
						})
					]
				}),
				order && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "w-full min-w-0 rounded-xl border border-border p-4 space-y-2 text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-sm font-bold text-foreground",
							children: "Detail Pesanan"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "Layanan",
							value: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "inline-block max-w-[200px] truncate align-bottom",
								children: order.serviceName
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "Jenis Layanan",
							value: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "inline-block max-w-[200px] truncate align-bottom",
								children: order.serviceType ?? order.packageTier
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "Platform",
							value: order.platform
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "Periode",
							value: `${order.startDate} — ${order.endDate}`
						}),
						order.location && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "Lokasi",
							value: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "inline-block max-w-[200px] truncate align-bottom",
								children: order.location
							})
						}),
						order.link && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "Link Target",
							value: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: order.link,
								target: "_blank",
								rel: "noreferrer",
								className: "inline-block max-w-[190px] sm:max-w-[230px] truncate text-sky-400 underline align-bottom hover:text-sky-300",
								title: order.link,
								children: order.link
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "Status Pesanan",
							value: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge$1, { status: order.status })
						}),
						order.description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "pt-1 text-xs text-muted-foreground break-words",
							children: order.description
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "w-full min-w-0 rounded-xl border border-border p-4 space-y-3 text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-display text-sm font-bold text-foreground",
								children: "Progres Pengerjaan Buzzer"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-xs font-semibold text-sky-400",
								children: [order.progress, "%"]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Progress, {
							value: order.progress,
							className: "h-2"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-3 gap-2 text-center text-xs",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-lg bg-muted/50 p-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", {
										className: "block text-base text-foreground",
										children: order.buzzers
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground",
										children: "Total buzzer"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-lg bg-muted/50 p-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", {
										className: "block text-base text-foreground",
										children: order.buzzersJoined
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground",
										children: "Bergabung"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-lg bg-muted/50 p-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", {
										className: "block text-base text-foreground",
										children: done
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground",
										children: "Selesai"
									})]
								})
							]
						}),
						proofs.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-semibold text-muted-foreground",
								children: "Bukti pengerjaan terbaru"
							}), proofs.slice(0, 4).map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3 rounded-lg border border-border p-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: p.imageUrl,
										alt: `Bukti pengerjaan ${p.buzzerName}`,
										loading: "lazy",
										className: "h-10 w-10 rounded object-cover"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0 flex-1",
										children: [p.buzzerEmail ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BuzzerNameLink, {
												name: p.buzzerName,
												email: p.buzzerEmail,
												className: "truncate text-xs"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-xs text-muted-foreground",
												children: ["· ", p.platform]
											})]
										}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "truncate text-xs font-semibold",
											children: [
												p.buzzerName,
												" · ",
												p.platform
											]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "truncate text-[11px] text-muted-foreground",
											children: p.caption
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "shrink-0 text-[10px] text-muted-foreground",
										children: p.uploadedAt
									})
								]
							}, p.id))]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: "Belum ada bukti pengerjaan yang diunggah buzzer."
						})
					]
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
					className: "flex items-center justify-end gap-2 pt-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						onClick: () => printInvoice(payment, store),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Printer, { className: "mr-1 h-4 w-4" }), " Cetak"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						className: "gradient-brand text-brand-foreground",
						onClick: () => downloadInvoice(payment, store),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "mr-1 h-4 w-4" }), " Download PDF"]
					})]
				})
			]
		})
	});
}
function NotifSheet({ open, onOpenChange, store, customerEmail, onSelectSection }) {
	const prefs = useCustomerNotifPreferences(customerEmail);
	const visibleNotifications = (0, import_react.useMemo)(() => store.state.notifications.filter((n) => isCustomerNotifEnabled(n, prefs)), [store.state.notifications, prefs]);
	const unreadCount = prefs.inApp ? visibleNotifications.filter((n) => !n.read).length : 0;
	const handleNotificationClick = (n) => {
		store.markNotificationRead(n.id);
		if (onSelectSection) {
			if (n.type === "order" || n.type === "campaign" || n.title.toLowerCase().includes("pesanan") || n.title.toLowerCase().includes("menunggu")) {
				onSelectSection("pesanan");
				onOpenChange(false);
			} else if (n.type === "payment" || n.title.toLowerCase().includes("pembayaran")) {
				onSelectSection("pembayaran");
				onOpenChange(false);
			}
		}
	};
	const handleMarkAll = () => {
		for (const n of visibleNotifications) if (!n.read) store.markNotificationRead(n.id);
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
					children: "Notifikasi"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted-foreground",
					children: !prefs.inApp ? "Fitur lonceng dinonaktifkan di pengaturan" : unreadCount > 0 ? `${unreadCount} belum dibaca` : "Semua sudah dibaca"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-center gap-1.5 mr-2",
					children: prefs.inApp && unreadCount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						size: "sm",
						variant: "outline",
						className: "h-8 gap-1.5 px-3 text-xs font-medium",
						onClick: handleMarkAll,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3.5 w-3.5 text-muted-foreground" }), "Tandai semua"]
					})
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "max-h-[calc(100vh-80px)] overflow-y-auto",
				children: !prefs.inApp ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-8 text-center text-sm text-muted-foreground",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "mx-auto mb-2 h-8 w-8 text-muted-foreground/40 opacity-40 line-through" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-semibold text-foreground",
							children: "Notifikasi In-App Dinonaktifkan"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs",
							children: "Anda menonaktifkan fitur notifikasi dalam aplikasi di menu Pengaturan. Aktifkan kembali di halaman Pengaturan untuk melihat notifikasi di sini."
						})
					]
				}) : visibleNotifications.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-8 text-center text-sm text-muted-foreground",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "mx-auto mb-2 h-8 w-8 text-muted-foreground/40" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-semibold text-foreground",
							children: store.state.notifications.length > 0 ? "Notifikasi Disembunyikan" : "Belum ada notifikasi"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs",
							children: store.state.notifications.length > 0 ? "Beberapa notifikasi disembunyikan berdasarkan preferensi kategori yang Anda nonaktifkan di Pengaturan." : "Belum ada notifikasi baru untuk akun Anda."
						})
					]
				}) : visibleNotifications.slice(0, 30).map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => handleNotificationClick(n),
					className: cn("flex w-full items-start gap-3 border-b border-border p-4 text-left transition-colors hover:bg-muted/50", !n.read && "bg-primary/5"),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: cn("mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-full", n.type === "system" || n.id === "ntf-welcome" || n.title.toLowerCase().includes("selamat datang") ? "bg-slate-500/15 text-slate-300" : n.title.toLowerCase().includes("disetujui") ? "bg-emerald-500/15 text-emerald-400" : n.title.toLowerCase().includes("ditolak") ? "bg-rose-500/15 text-rose-400" : n.title.toLowerCase().includes("menunggu") || n.title.toLowerCase().includes("diverifikasi") ? "bg-amber-500/15 text-amber-400" : n.type === "campaign" || n.title.toLowerCase().includes("selesai") ? "bg-fuchsia-500/15 text-fuchsia-400" : "bg-blue-500/15 text-blue-400"),
							children: n.type === "system" || n.id === "ntf-welcome" || n.title.toLowerCase().includes("selamat datang") ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "h-4 w-4" }) : n.title.toLowerCase().includes("disetujui") ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4" }) : n.title.toLowerCase().includes("ditolak") ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, { className: "h-4 w-4" }) : n.title.toLowerCase().includes("menunggu") || n.title.toLowerCase().includes("diverifikasi") ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-4 w-4" }) : n.type === "campaign" || n.title.toLowerCase().includes("selesai") ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Megaphone, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingBag, { className: "h-4 w-4" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "truncate text-sm font-semibold",
									children: n.title
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground",
									children: n.body
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-[10px] text-muted-foreground",
									children: n.date
								})
							]
						}),
						!n.read && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "mt-2 h-2 w-2 shrink-0 rounded-full bg-primary" })
					]
				}, n.id))
			})]
		})
	});
}
function EmptyState({ icon, title, desc }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid place-items-center rounded-xl border border-dashed border-border py-10 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "grid h-14 w-14 place-items-center rounded-full bg-muted text-muted-foreground",
				children: icon
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 font-semibold",
				children: title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: desc
			})
		]
	});
}
function statusColor(status) {
	switch (status) {
		case "Lunas": return [
			34,
			197,
			94
		];
		case "Menunggu Verifikasi": return [
			234,
			179,
			8
		];
		case "Belum Dibayar": return [
			148,
			163,
			184
		];
		case "Refund": return [
			168,
			85,
			247
		];
		case "Gagal": return [
			239,
			68,
			68
		];
		default: return [
			100,
			116,
			139
		];
	}
}
function buildInvoicePdf(p, store) {
	const order = store.state.orders.find((o) => o.id === p.orderId);
	const profile = store.state.profile;
	const doc = new E({
		unit: "mm",
		format: "a4"
	});
	const W = 210;
	const M = 15;
	let y = 18;
	doc.setFillColor(37, 99, 235);
	doc.rect(0, 0, W, 32, "F");
	doc.setTextColor(255, 255, 255);
	doc.setFont("helvetica", "bold");
	doc.setFontSize(22);
	doc.text("BuzzHub", M, 18);
	doc.setFont("helvetica", "normal");
	doc.setFontSize(9);
	doc.text("Platform Jasa Buzzer #1 di Indonesia", M, 24);
	doc.text("hello@buzzhub.id  ·  www.buzzhub.id", M, 28.5);
	doc.setFont("helvetica", "bold");
	doc.setFontSize(16);
	doc.text("INVOICE PEMBAYARAN", 195, 18, { align: "right" });
	doc.setFont("helvetica", "normal");
	doc.setFontSize(10);
	doc.text(p.invoice, 195, 24, { align: "right" });
	const [r, g, b] = statusColor(p.status);
	const badgeText = p.status;
	doc.setFontSize(9);
	const bw = doc.getTextWidth(badgeText) + 8;
	doc.setFillColor(r, g, b);
	doc.roundedRect(195 - bw, 27, bw, 6, 1.5, 1.5, "F");
	doc.setTextColor(255, 255, 255);
	doc.text(badgeText, 195 - bw / 2, 31, { align: "center" });
	y = 44;
	doc.setTextColor(30, 41, 59);
	const section = (title) => {
		doc.setFont("helvetica", "bold");
		doc.setFontSize(11);
		doc.setTextColor(37, 99, 235);
		doc.text(title, M, y);
		y += 2;
		doc.setDrawColor(37, 99, 235);
		doc.setLineWidth(.4);
		doc.line(M, y, 195, y);
		y += 5;
		doc.setTextColor(30, 41, 59);
		doc.setFont("helvetica", "normal");
		doc.setFontSize(10);
	};
	const kv = (label, value) => {
		doc.setTextColor(100, 116, 139);
		doc.text(label, M, y);
		doc.setTextColor(30, 41, 59);
		doc.setFont("helvetica", "bold");
		const lines = doc.splitTextToSize(value || "-", 110);
		doc.text(lines, 70, y);
		doc.setFont("helvetica", "normal");
		y += 5 * Math.max(1, lines.length);
	};
	section("Informasi Customer");
	kv("Nama", profile.name);
	kv("Email", profile.email);
	kv("No. Telepon", profile.phone);
	kv("Kota", profile.city);
	if (profile.company) kv("Perusahaan", profile.company);
	y += 3;
	section("Informasi Campaign");
	kv("Nama Campaign", order?.campaignName ?? p.campaignName);
	kv("Platform", order?.platform ?? "-");
	kv("Kategori Layanan", order?.serviceName ?? "-");
	kv("Deadline", order?.endDate ?? "-");
	y += 3;
	section("Detail Pembayaran");
	kv("Nomor Invoice", p.invoice);
	kv("Tanggal Invoice", p.date);
	kv("Metode Pembayaran", `${p.method} · ${p.channel}`);
	kv("Status", p.status === "Menunggu Verifikasi" ? "Menunggu Verifikasi Admin" : p.status);
	y += 3;
	section("Ringkasan Tagihan");
	const admin = Math.round(p.amount * .005);
	const taxable = p.amount + admin;
	const tax = Math.round(taxable * .11);
	const total = taxable + tax;
	const rowH = 8;
	doc.setFillColor(241, 245, 249);
	doc.rect(M, y, 180, rowH, "F");
	doc.setFont("helvetica", "bold");
	doc.text("Deskripsi", 18, y + 5.5);
	doc.text("Jumlah", 192, y + 5.5, { align: "right" });
	y += rowH;
	doc.setFont("helvetica", "normal");
	const row = (label, val, bold = false) => {
		doc.setDrawColor(226, 232, 240);
		doc.line(M, y, 195, y);
		if (bold) doc.setFont("helvetica", "bold");
		doc.text(label, 18, y + 5.5);
		doc.text(val, 192, y + 5.5, { align: "right" });
		if (bold) doc.setFont("helvetica", "normal");
		y += rowH;
	};
	row("Subtotal Campaign", formatIDR(p.amount));
	row("Biaya Admin (0.5%)", formatIDR(admin));
	row("PPN 11%", formatIDR(tax));
	doc.setFillColor(37, 99, 235);
	doc.rect(M, y, 180, 10, "F");
	doc.setTextColor(255, 255, 255);
	doc.setFont("helvetica", "bold");
	doc.setFontSize(11);
	doc.text("TOTAL PEMBAYARAN", 18, y + 6.5);
	doc.text(formatIDR(total), 192, y + 6.5, { align: "right" });
	y += 16;
	doc.setTextColor(100, 116, 139);
	doc.setFont("helvetica", "normal");
	doc.setFontSize(9);
	const footerY = 275;
	doc.setDrawColor(226, 232, 240);
	doc.line(M, 269, 195, 269);
	doc.text("Terima kasih telah menggunakan BuzzHub.", W / 2, footerY, { align: "center" });
	doc.text("Invoice ini dibuat secara otomatis oleh sistem sehingga tidak memerlukan tanda tangan.", W / 2, 279.5, { align: "center" });
	return doc;
}
function downloadInvoice(p, store) {
	buildInvoicePdf(p, store).save(`Invoice_${p.invoice}.pdf`);
	toast.success("Invoice PDF diunduh");
}
function printInvoice(p, store) {
	const url = buildInvoicePdf(p, store).output("bloburl");
	const w = window.open(url, "_blank");
	if (!w) return toast.error("Popup diblokir browser");
	w.addEventListener("load", () => {
		w.focus();
		w.print();
	});
}
function UlasanSection({ customerEmail, customerName }) {
	const { data: campaigns } = useCampaigns();
	const { data: jobs } = useCampaignJobs();
	const { data: allRatings, loading, refetch } = useBuzzerRatings();
	const myRatings = allRatings.filter((r) => (r.customer_id ?? r.customer_email)?.toLowerCase() === customerEmail.toLowerCase());
	const customerCampaigns = campaigns.filter((campaign) => campaign.customer_email?.toLowerCase() === customerEmail.toLowerCase());
	const jobsByCampaign = /* @__PURE__ */ new Map();
	for (const job of jobs) {
		if (!job.campaign_id) continue;
		const current = jobsByCampaign.get(job.campaign_id) ?? [];
		current.push(job);
		jobsByCampaign.set(job.campaign_id, current);
	}
	const completedCampaigns = customerCampaigns.filter((campaign) => {
		const campaignJobs = jobsByCampaign.get(campaign.id) ?? [];
		return campaign.status === "Selesai" && campaignJobs.length >= Math.max(1, campaign.slots) && campaignJobs.every((job) => job.buzzer_email && (job.status === "Selesai" || job.status === "Review" && job.admin_verified_at));
	});
	const ratingsByCampaignId = /* @__PURE__ */ new Map();
	const ratingCountByCampaign = /* @__PURE__ */ new Map();
	for (const rating of myRatings) {
		if (!rating.campaign_id) continue;
		ratingsByCampaignId.set(rating.campaign_id, rating);
		ratingCountByCampaign.set(rating.campaign_id, (ratingCountByCampaign.get(rating.campaign_id) ?? 0) + 1);
	}
	const pendingReviews = completedCampaigns.filter((campaign) => (ratingCountByCampaign.get(campaign.id) ?? 0) < (jobsByCampaign.get(campaign.id)?.length ?? 0));
	const [selectedCampaign, setSelectedCampaign] = (0, import_react.useState)(null);
	const [stars, setStars] = (0, import_react.useState)(0);
	const [comment, setComment] = (0, import_react.useState)("");
	const [saving, setSaving] = (0, import_react.useState)(false);
	const [editingRating, setEditingRating] = (0, import_react.useState)(null);
	const [editStars, setEditStars] = (0, import_react.useState)(0);
	const [editComment, setEditComment] = (0, import_react.useState)("");
	const [savingEdit, setSavingEdit] = (0, import_react.useState)(false);
	const openReview = (campaign) => {
		setSelectedCampaign(campaign);
		setStars(0);
		setComment("");
	};
	const campaignsMap = (0, import_react.useMemo)(() => {
		const map = /* @__PURE__ */ new Map();
		for (const c of campaigns) map.set(c.id, c);
		return map;
	}, [campaigns]);
	const jobsMap = (0, import_react.useMemo)(() => {
		const map = /* @__PURE__ */ new Map();
		for (const j of jobs) map.set(j.id, j);
		return map;
	}, [jobs]);
	(0, import_react.useCallback)((rating) => {
		if (rating.order_completed_at) {
			const t = new Date(rating.order_completed_at).getTime();
			if (!isNaN(t) && t > 0) return t;
		}
		if (rating.campaign_id) {
			const camp = campaignsMap.get(rating.campaign_id);
			if (camp?.target_reached_at) {
				const t = new Date(camp.target_reached_at).getTime();
				if (!isNaN(t) && t > 0) return t;
			}
			if (camp?.updated_at && camp.status === "Selesai") {
				const t = new Date(camp.updated_at).getTime();
				if (!isNaN(t) && t > 0) return t;
			}
		}
		if (rating.job_id) {
			const j = jobsMap.get(rating.job_id);
			if (j?.admin_verified_at) {
				const t = new Date(j.admin_verified_at).getTime();
				if (!isNaN(t) && t > 0) return t;
			}
			if (j?.updated_at && j.status === "Selesai") {
				const t = new Date(j.updated_at).getTime();
				if (!isNaN(t) && t > 0) return t;
			}
		}
		return new Date(rating.created_at).getTime();
	}, [campaignsMap, jobsMap]);
	const getRatingEditInfo = (0, import_react.useCallback)((rating) => {
		const editCount = rating.customer_edit_count ?? 0;
		const ratedMs = new Date(rating.created_at).getTime();
		const deadlineMs = ratedMs + 864e5;
		const remainingMs = deadlineMs - Date.now();
		const isExpired = remainingMs <= 0;
		const hasEdited = editCount >= 1;
		const canEdit = !hasEdited && !isExpired;
		let remainingLabel = "";
		if (!isExpired) {
			const hours = Math.floor(remainingMs / 36e5);
			const minutes = Math.floor(remainingMs % 36e5 / 6e4);
			if (hours > 0) remainingLabel = `Sisa waktu ${hours} jam ${minutes} menit`;
			else remainingLabel = `Sisa waktu ${Math.max(1, minutes)} menit`;
		}
		return {
			canEdit,
			hasEdited,
			isExpired,
			ratedMs,
			deadlineMs,
			remainingLabel
		};
	}, []);
	const openRatingEdit = (rating) => {
		const info = getRatingEditInfo(rating);
		if (info.hasEdited) {
			toast.error("Kesempatan edit ulasan sudah digunakan (maksimal 1x).");
			return;
		}
		if (info.isExpired) {
			toast.error("Batas waktu edit ulasan sudah berakhir (melebihi 1x24 jam setelah ulasan diberikan).");
			return;
		}
		setEditingRating(rating);
		setEditStars(rating.stars);
		setEditComment(rating.comment ?? "");
	};
	const saveRatingEdit = async () => {
		if (!editingRating || !editStars) return;
		setSavingEdit(true);
		try {
			await updateCustomerBuzzerRating({
				id: editingRating.id,
				customer_email: customerEmail,
				stars: editStars,
				comment: editComment
			});
			await refetch();
			setEditingRating(null);
			toast.success("Ulasan berhasil diperbarui. Kesempatan edit 1x telah digunakan.");
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "Ulasan gagal diperbarui.");
		} finally {
			setSavingEdit(false);
		}
	};
	const submitReview = async () => {
		if (!selectedCampaign || !stars) {
			toast.error("Pilih rating 1–5 terlebih dahulu");
			return;
		}
		setSaving(true);
		try {
			await rateCampaignForAllBuzzers({
				customer_id: customerEmail,
				campaign_id: selectedCampaign.id,
				stars,
				comment
			});
			await refetch();
			setSelectedCampaign(null);
			toast.success("Ulasan berhasil dikirim");
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "Ulasan gagal disimpan");
		} finally {
			setSaving(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [
			pendingReviews.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-primary/30 bg-primary/5 p-6 shadow-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-xl font-bold",
						children: "Beri Ulasan"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: "Pekerjaan selesai dan siap Anda nilai."
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-3",
					children: pendingReviews.map((campaign) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-card p-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "truncate font-semibold",
								children: campaign.title
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-sm text-muted-foreground",
								children: [campaign.slots, " buzzer · Semua pekerjaan selesai"]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							className: "gradient-brand text-brand-foreground",
							onClick: () => openReview(campaign),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "mr-1 h-4 w-4" }), " Beri Ulasan Campaign"]
						})]
					}, campaign.id))
				})]
			}),
			completedCampaigns.filter((campaign) => ratingsByCampaignId.has(campaign.id)).length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-border bg-card p-6 shadow-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mb-4 font-display text-xl font-bold",
					children: "Status Ulasan"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-3",
					children: completedCampaigns.filter((campaign) => ratingsByCampaignId.has(campaign.id)).map((campaign) => {
						const rating = ratingsByCampaignId.get(campaign.id);
						const editInfo = rating ? getRatingEditInfo(rating) : null;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-muted/30 p-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "truncate font-semibold",
									children: campaign.title
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-sm text-muted-foreground",
									children: [campaign.slots, " buzzer · Semua pekerjaan selesai"]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3 text-right",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "block text-sm font-semibold text-emerald-600",
										children: "Sudah Diulas"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-sm text-amber-500",
										children: "★".repeat(rating?.stars ?? 0)
									})] }),
									rating && editInfo?.canEdit && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										type: "button",
										variant: "outline",
										size: "sm",
										className: "h-8 w-8 p-0 text-primary border-primary/30 hover:bg-primary/5",
										title: "Edit Ulasan (1x)",
										"aria-label": "Edit Ulasan",
										onClick: () => openRatingEdit(rating),
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PenLine, { className: "h-3.5 w-3.5" })
									}),
									rating && editInfo?.hasEdited && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-600 dark:text-emerald-400",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-3 w-3" }), " Diedit (1/1)"]
									})
								]
							})]
						}, campaign.id);
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-border bg-card p-6 shadow-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-6 flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-xl font-bold",
						children: "Rating & Komentar Saya"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: [myRatings.length, " rating telah Anda berikan untuk buzzer"]
					})] }), myRatings.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-right",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs uppercase text-muted-foreground",
							children: "Total Rating"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-2xl font-bold text-amber-500",
							children: myRatings.length
						})]
					})]
				}), loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-3",
					children: [
						1,
						2,
						3
					].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-24 w-full rounded-lg" }, i))
				}) : myRatings.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-lg border border-dashed border-border bg-muted/30 p-8 text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "mx-auto mb-3 h-8 w-8 text-muted-foreground/50" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-medium text-foreground",
							children: "Belum ada rating"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-muted-foreground",
							children: "Klik nama buzzer untuk memberikan rating dan komentar"
						})
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-3",
					children: myRatings.map((rating) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-4 rounded-lg border border-border bg-muted/30 p-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar, {
							className: "h-10 w-10 shrink-0",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarFallback, {
								className: "text-xs",
								children: rating.buzzer_name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex-1 min-w-0",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/buzzer-profile/$buzzerEmail",
										params: { buzzerEmail: encodeURIComponent(rating.buzzer_email) },
										className: "font-semibold text-sm text-primary hover:underline",
										children: rating.buzzer_name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted-foreground",
										children: rating.campaign_title
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex items-center gap-1 shrink-0",
										children: Array(5).fill(null).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: cn("h-3.5 w-3.5", i < rating.stars ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30") }, i))
									})]
								}),
								rating.comment && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-2 text-sm text-foreground",
									children: [
										"\"",
										rating.comment,
										"\""
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-2 flex flex-wrap items-center justify-between gap-2 border-t border-border/50 pt-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-xs text-muted-foreground",
										children: ["Diulas: ", new Date(rating.created_at).toLocaleDateString("id-ID", {
											year: "numeric",
											month: "long",
											day: "numeric"
										})]
									}), (() => {
										const editInfo = getRatingEditInfo(rating);
										if (editInfo.canEdit) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-[11px] font-medium text-amber-600 dark:text-amber-400",
												children: [
													"1x edit • ",
													editInfo.remainingLabel,
													" (24 jam setelah ulasan diberikan)"
												]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												type: "button",
												variant: "outline",
												size: "sm",
												className: "h-7 w-7 p-0 font-semibold text-primary border-primary/30 hover:bg-primary/10",
												title: "Edit (1x)",
												"aria-label": "Edit",
												onClick: () => openRatingEdit(rating),
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PenLine, { className: "h-3.5 w-3.5" })
											})]
										});
										if (editInfo.hasEdited) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-600 dark:text-emerald-400",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-3 w-3" }), " Ulasan telah diedit (1/1)"]
										});
										return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-3 w-3" }), " Batas waktu edit berakhir (>24 jam setelah ulasan diberikan)"]
										});
									})()]
								})
							]
						})]
					}, rating.id))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: !!selectedCampaign,
				onOpenChange: (open) => !open && setSelectedCampaign(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "w-[calc(100vw-1.5rem)] max-w-md",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Beri Ulasan" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogDescription, { children: [
							"Nilai seluruh buzzer pada campaign ",
							selectedCampaign?.title,
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
									"aria-checked": stars === value,
									"aria-label": `${value} bintang`,
									onClick: () => setStars(value),
									className: "rounded-md p-1 transition-colors hover:bg-muted",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: cn("h-7 w-7", value <= stars ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30") })
								}, value))
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "review-comment",
								children: "Komentar (opsional)"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								id: "review-comment",
								rows: 4,
								value: comment,
								onChange: (event) => setComment(event.target.value),
								placeholder: "Bagikan pengalaman Anda..."
							})] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							onClick: () => setSelectedCampaign(null),
							disabled: saving,
							children: "Batal"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							className: "gradient-brand text-brand-foreground",
							onClick: submitReview,
							disabled: saving || !stars,
							children: saving ? "Mengirim..." : "Kirim Ulasan"
						})] })
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: !!editingRating,
				onOpenChange: (open) => !open && !savingEdit && setEditingRating(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "w-[calc(100vw-1.5rem)] max-w-md",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Edit Ulasan & Rating (1x Kesempatan)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Beri ulasan pembaruan untuk buzzer. Anda memiliki 1x kesempatan edit dalam batas waktu 1x24 jam setelah ulasan diberikan. Setelah disimpan, ulasan tidak dapat diedit lagi." })] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-4",
							children: [
								editingRating && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-lg border border-amber-500/20 bg-amber-500/10 p-3 text-xs text-amber-700 dark:text-amber-300 space-y-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "font-semibold",
											children: ["Buzzer: ", editingRating.buzzer_name]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-medium",
											children: getRatingEditInfo(editingRating).remainingLabel
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-[11px] text-muted-foreground",
										children: ["Diulas pada: ", new Date(editingRating.created_at).toLocaleString("id-ID", {
											dateStyle: "medium",
											timeStyle: "short"
										})]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Rating" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
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
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "customer-edit-review-comment",
									children: "Komentar (opsional)"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
									id: "customer-edit-review-comment",
									rows: 4,
									value: editComment,
									onChange: (event) => setEditComment(event.target.value),
									placeholder: "Tuliskan ulasan yang diperbarui..."
								})] })
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							onClick: () => setEditingRating(null),
							disabled: savingEdit,
							children: "Batal"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							className: "gradient-brand text-brand-foreground",
							onClick: saveRatingEdit,
							disabled: savingEdit || !editStars,
							children: savingEdit ? "Menyimpan..." : "Simpan Perubahan (1x)"
						})] })
					]
				})
			})
		]
	});
}
//#endregion
export { CustomerPage as component };
