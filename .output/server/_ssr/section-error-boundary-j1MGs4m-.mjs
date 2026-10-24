import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { L as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { n as supabase, t as isSupabaseConfigured } from "./client-DwoA1QoZ.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { t as Button } from "./button-BkEeRci-.mjs";
import { O as RefreshCw, h as Star, l as TriangleAlert } from "../_libs/lucide-react.mjs";
import { a as DialogHeader, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-BQPGZ99x.mjs";
import { c as reportLovableError } from "./router-BuTnQWI2.mjs";
import { d as averageStars, g as useBuzzerRatings, i as Skeleton, n as AvatarFallback, r as AvatarImage, t as Avatar } from "./table-C9Hv1VxK.mjs";
import { u as Progress, x as createCustomerPaymentCampaign } from "./export-utils-Bse6Ov51.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/section-error-boundary-j1MGs4m-.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ProfileRow({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-start justify-between gap-4 border-b border-border pb-3 last:border-0 last:pb-0",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "shrink-0 text-sm font-medium text-muted-foreground",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-right text-sm font-semibold",
			children: value
		})]
	});
}
function BuzzerProfileDialog({ email, open, onOpenChange }) {
	const { data: allRatings } = useBuzzerRatings();
	const [data, setData] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(true);
	(0, import_react.useEffect)(() => {
		if (!open) return;
		let active = true;
		setLoading(true);
		async function load() {
			const decodedEmail = email.toLowerCase().trim();
			const [{ data: accountData }, { data: walletData }, { data: socialAccounts }, { data: jobsData }, { data: submissionsData }] = await Promise.all([
				supabase.from("app_accounts").select("*").ilike("email", decodedEmail).maybeSingle(),
				supabase.from("buzzer_wallets").select("*").ilike("buzzer_email", decodedEmail).maybeSingle(),
				supabase.from("social_accounts").select("*").ilike("buzzer_email", decodedEmail),
				supabase.from("campaign_jobs").select("id, status, admin_verified_at, proof_url, buzzer_email, buzzer_name").ilike("buzzer_email", decodedEmail),
				supabase.from("campaign_job_submissions").select("id, status, buzzer_email").ilike("buzzer_email", decodedEmail)
			]);
			if (!active) return;
			const verifiedFollowers = (socialAccounts ?? []).filter((account) => account.verification === "Terverifikasi").reduce((sum, account) => sum + Number(account.followers ?? 0), 0);
			const d = accountData || {};
			let allJobs = jobsData ?? [];
			if (allJobs.length === 0 && d.name) {
				const { data: nameJobs } = await supabase.from("campaign_jobs").select("id, status, admin_verified_at, proof_url, buzzer_email, buzzer_name").ilike("buzzer_name", d.name);
				if (nameJobs && nameJobs.length > 0) allJobs = nameJobs;
			}
			const finishedJobs = allJobs.filter((j) => j.status === "Selesai" || Boolean(j.admin_verified_at));
			const reviewJobs = allJobs.filter((j) => (j.status === "Review" || Boolean(j.proof_url)) && j.status !== "Selesai" && !j.admin_verified_at);
			const subCount = (submissionsData ?? []).filter((s) => s.status === "Selesai" || s.status === "Review").length;
			let localJobsCount = 0;
			try {
				const raw = typeof window !== "undefined" ? localStorage.getItem(`buzzhub.buzzer.${decodedEmail}`) : null;
				if (raw) {
					const parsed = JSON.parse(raw);
					const rawJobs = Array.isArray(parsed?.jobs) ? parsed.jobs : [];
					const localCompleted = rawJobs.filter((j) => j.status === "Selesai" || Boolean(j.admin_verified_at) || j.status === "Review" || Boolean(j.proofUrl)).length;
					localJobsCount = Math.max(Number(parsed?.profile?.jobsCompleted ?? 0), localCompleted, rawJobs.length);
				}
			} catch {}
			const resolvedJobsCount = Math.max(finishedJobs.length + reviewJobs.length > 0 ? finishedJobs.length + reviewJobs.length : allJobs.length, subCount, localJobsCount, Number(walletData?.campaigns_completed ?? 0), Number(d.job_completed ?? 0));
			setData({
				name: d.name || "Buzzer",
				email: decodedEmail,
				username: d.username || `@${d.name?.toLowerCase().replace(/[^a-z0-9]/g, "") || "buzzer"}`,
				phone: d.phone || "-",
				platform: d.platform || socialAccounts?.[0]?.platform || "-",
				followers: verifiedFollowers > 0 ? verifiedFollowers : Number(d.followers || 0),
				bio: d.bio || "-",
				avatarUrl: d.avatar_url,
				jobCompleted: resolvedJobsCount
			});
			setLoading(false);
		}
		load();
		return () => {
			active = false;
		};
	}, [email, open]);
	const myRatings = allRatings.filter((r) => r.buzzer_email.toLowerCase() === email.toLowerCase());
	const avg = averageStars(myRatings);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "max-w-4xl max-h-[90vh] overflow-y-auto",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Profil Buzzer" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Detail informasi akun buzzer" })] }), loading || !data ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-64 w-full rounded-2xl" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-96 w-full rounded-2xl" })]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl border border-border bg-card p-6 text-center shadow-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Avatar, {
							className: "mx-auto h-24 w-24 border-2 border-background shadow-md",
							children: [data.avatarUrl && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarImage, {
								src: data.avatarUrl,
								alt: data.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarFallback, {
								className: "gradient-brand text-2xl font-bold text-brand-foreground",
								children: data.name.split(" ").map((n) => n[0]).join("").slice(0, 2)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "mt-3 font-display text-xl font-bold",
							children: data.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground",
							children: data.username
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-4 flex flex-col items-center justify-center gap-1 text-sm",
							children: myRatings.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "h-4 w-4 fill-amber-400 text-amber-400" }),
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: avg.toFixed(1) })
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-muted-foreground",
								children: [
									myRatings.length,
									" ulasan · ",
									data.jobCompleted,
									" job selesai"
								]
							})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "h-4 w-4 text-muted-foreground/50" }),
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "0.0" })
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-muted-foreground",
								children: [
									"Belum ada ulasan · ",
									data.jobCompleted,
									" job selesai"
								]
							})] })
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-4 rounded-2xl border border-border bg-card p-6 shadow-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProfileRow, {
							label: "Email",
							value: data.email
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProfileRow, {
							label: "Nomor HP",
							value: data.phone
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProfileRow, {
							label: "Platform Utama",
							value: data.platform
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProfileRow, {
							label: "Followers",
							value: data.followers.toLocaleString("id-ID")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProfileRow, {
							label: "Bio",
							value: data.bio
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-medium uppercase tracking-wide text-muted-foreground",
								children: "Rating"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-sm font-semibold",
								children: myRatings.length > 0 ? `${avg.toFixed(1)} / 5` : "0.0 / 5"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Progress, {
							value: myRatings.length > 0 ? avg * 20 : 0,
							className: "mt-2"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-medium uppercase tracking-wide text-muted-foreground mb-2",
							children: "Ulasan Customer"
						}), myRatings.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "rounded-lg border border-dashed border-border p-4 text-center text-sm text-muted-foreground",
							children: "Belum ada ulasan."
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "space-y-2 max-h-64 overflow-y-auto pr-2",
							children: myRatings.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "rounded-lg border border-border p-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "truncate text-sm font-semibold",
											children: r.campaign_title
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "flex shrink-0 items-center gap-1 text-sm font-bold",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "h-3.5 w-3.5 fill-amber-400 text-amber-400" }), r.stars]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted-foreground",
										children: r.customer_name || r.customer_email
									}),
									r.comment && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "mt-1 text-sm",
										children: [
											"\"",
											r.comment,
											"\""
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-2 text-xs text-muted-foreground",
										children: new Date(r.created_at).toLocaleDateString("id-ID", {
											year: "numeric",
											month: "long",
											day: "numeric"
										})
									})
								]
							}, r.id))
						})] })
					]
				})]
			})]
		})
	});
}
function BuzzerNameLink({ name, email, className, variant = "default" }) {
	const [open, setOpen] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		onClick: () => setOpen(true),
		className: cn({
			default: "text-foreground hover:text-primary transition-colors",
			"hover-primary": "group-hover:text-primary transition-colors",
			muted: "text-muted-foreground hover:text-foreground transition-colors"
		}[variant], "font-medium underline-offset-2 hover:underline text-left", className),
		title: `Lihat profil ${name}`,
		children: name
	}), open && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BuzzerProfileDialog, {
		email,
		open,
		onOpenChange: setOpen
	})] });
}
var proof_instagram_default = "/assets/proof-instagram-B7rCWS6s.jpg";
var proof_tiktok_default = "/assets/proof-tiktok-s6Yg1nxQ.jpg";
var proof_x_default = "/assets/proof-x-F3ytyLON.jpg";
var EVT = "buzzhub:customer-store";
var keyFor = (email) => `buzzhub.customer.${email.toLowerCase()}`;
var pendingPayments = /* @__PURE__ */ new Map();
function daysAgo(n) {
	const d = /* @__PURE__ */ new Date();
	d.setDate(d.getDate() - n);
	return d.toISOString().slice(0, 10);
}
var PLATFORMS = [
	"Instagram",
	"TikTok",
	"X (Twitter)",
	"Facebook",
	"YouTube",
	"Telegram"
];
var IMG_GRADIENTS = [
	"from-fuchsia-500 to-pink-500",
	"from-purple-500 to-indigo-500",
	"from-cyan-500 to-blue-500",
	"from-amber-500 to-orange-500",
	"from-emerald-500 to-teal-500",
	"from-rose-500 to-red-500",
	"from-violet-500 to-purple-600",
	"from-sky-500 to-indigo-500"
];
var ONLINE_SERVICES = [
	{
		name: "Trending Topic Booster",
		desc: "Naikkan hashtag ke trending nasional dalam hitungan jam."
	},
	{
		name: "Viral Marketing Campaign",
		desc: "Distribusi konten viral lintas platform."
	},
	{
		name: "Brand Awareness Push",
		desc: "Perkenalkan brand ke jutaan audiens tertarget."
	},
	{
		name: "Social Engagement Booster",
		desc: "Like, comment, share organik dari akun real."
	},
	{
		name: "Product Review Campaign",
		desc: "Review jujur dari micro-influencer sesuai niche."
	},
	{
		name: "Influencer Support Program",
		desc: "Dukungan penuh dari 100+ influencer terverifikasi."
	},
	{
		name: "Counter Narrative Response",
		desc: "Manajemen krisis & narasi tandingan real-time."
	},
	{
		name: "Livestream Amplifier",
		desc: "Boost penonton & interaksi saat live."
	},
	{
		name: "Video Reels Distribution",
		desc: "Sebar video pendek ke jaringan buzzer TikTok/Reels."
	},
	{
		name: "Community Seeding",
		desc: "Konten disemai ke grup & komunitas relevan."
	}
];
function makeServices() {
	const build = (category, list, baseIdx) => list.map((s, i) => {
		const idx = baseIdx + i;
		const basePrice = 5e5 + i * 25e4;
		return {
			id: `svc-${idx + 1}`,
			category,
			name: s.name,
			platforms: [PLATFORMS[i % 6], PLATFORMS[(i + 2) % 6]],
			desc: s.desc,
			longDesc: `${s.desc} Kami menggabungkan jaringan buzzer terverifikasi dengan strategi konten yang teruji. Cocok untuk brand yang ingin dampak nyata & terukur.`,
			rating: +(4.5 + Math.random() * .5).toFixed(1),
			reviews: 40 + Math.floor(Math.random() * 260),
			image: IMG_GRADIENTS[idx % IMG_GRADIENTS.length],
			benefits: [
				"Buzzer terverifikasi & real people",
				"Laporan realtime & transparan",
				"Konten sesuai brand guideline",
				"Garansi target reach tercapai"
			],
			faqs: [
				{
					q: "Berapa lama campaign berjalan?",
					a: "Rata-rata 5–14 hari tergantung paket."
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
					buzzers: 25,
					reach: "50K – 100K",
					benefits: [
						"25 buzzer aktif",
						"Reach 50–100K",
						"Laporan mingguan"
					]
				},
				{
					tier: "Professional",
					price: Math.round(basePrice * 2.2),
					buzzers: 60,
					reach: "150K – 300K",
					benefits: [
						"60 buzzer premium",
						"Reach 150–300K",
						"Laporan harian",
						"Content assist"
					]
				},
				{
					tier: "Enterprise",
					price: Math.round(basePrice * 4.5),
					buzzers: 150,
					reach: "500K – 1M+",
					benefits: [
						"150 buzzer + KOL",
						"Reach 500K–1M+",
						"Dedicated manager",
						"Priority support"
					]
				}
			]
		};
	});
	return build("Online Buzzer", ONLINE_SERVICES, 0);
}
var CAMPAIGN_TYPES = [
	{
		key: "like",
		name: "Like",
		desc: "Meningkatkan jumlah like pada konten.",
		from: 4e3
	},
	{
		key: "komentar",
		name: "Komentar",
		desc: "Komentar natural pada konten Anda.",
		from: 6e3
	},
	{
		key: "like-komentar",
		name: "Like + Komentar",
		desc: "Kombinasi like dan komentar.",
		from: 8e3
	},
	{
		key: "share",
		name: "Share",
		desc: "Membantu meningkatkan share konten.",
		from: 6e3
	},
	{
		key: "follow",
		name: "Follow",
		desc: "Meningkatkan jumlah followers akun.",
		from: 6e3
	},
	{
		key: "review",
		name: "Review",
		desc: "Meningkatkan jumlah review/ulasan.",
		from: 8e3
	}
];
function makeCampaignTypeServices() {
	return CAMPAIGN_TYPES.map((c, i) => ({
		id: `svc-ct-${c.key}`,
		category: "Online Buzzer",
		name: `Campaign ${c.name}`,
		platforms: PLATFORMS,
		desc: c.desc,
		longDesc: `${c.desc} Dikerjakan oleh buzzer terverifikasi dengan akun aktif dan aktivitas natural.`,
		rating: 4.8,
		reviews: 120 + i * 17,
		image: IMG_GRADIENTS[i % IMG_GRADIENTS.length],
		benefits: [
			"Buzzer terverifikasi & real people",
			"Aktivitas natural, bukan bot",
			"Bukti pengerjaan berupa screenshot",
			"Laporan realtime & transparan"
		],
		faqs: [
			{
				q: "Berapa lama pengerjaan?",
				a: "Umumnya 1–3 hari tergantung volume."
			},
			{
				q: "Apakah akun buzzer real?",
				a: "Ya, seluruh buzzer terverifikasi oleh admin."
			},
			{
				q: "Bagaimana buktinya?",
				a: "Setiap buzzer mengunggah screenshot pengerjaan."
			}
		],
		campaignType: c.key,
		packages: [
			{
				tier: "Basic",
				price: c.from,
				buzzers: 25,
				reach: "5K – 15K",
				benefits: [
					"25 buzzer aktif",
					"Pengerjaan 1–2 hari",
					"Bukti screenshot"
				]
			},
			{
				tier: "Professional",
				price: Math.round(c.from * 2.2),
				buzzers: 60,
				reach: "20K – 50K",
				benefits: [
					"60 buzzer premium",
					"Pengerjaan prioritas",
					"Laporan harian"
				]
			},
			{
				tier: "Enterprise",
				price: Math.round(c.from * 4.5),
				buzzers: 150,
				reach: "80K – 200K",
				benefits: [
					"150 buzzer + KOL",
					"Dedicated manager",
					"Priority support"
				]
			}
		]
	}));
}
var SERVICES = [...makeServices(), ...makeCampaignTypeServices()];
function makeReport(buzzers, progress, days) {
	const reach = 45e3 + Math.floor(Math.random() * 4e5);
	const impression = Math.round(reach * (2 + Math.random()));
	const like = Math.round(reach * (.06 + Math.random() * .05));
	const comment = Math.round(like * .15);
	const share = Math.round(like * .08);
	const engagement = +((like + comment + share) / Math.max(1, reach) * 100).toFixed(2);
	const pos = 60 + Math.floor(Math.random() * 30);
	const neu = Math.floor((100 - pos) * .7);
	const neg = 100 - pos - neu;
	const daily = Array.from({ length: Math.max(3, Math.min(14, days)) }).map((_, i) => ({
		date: daysAgo(days - i),
		reach: Math.round(reach / days * (.6 + Math.random() * .8)),
		impression: Math.round(impression / days * (.6 + Math.random() * .8)),
		engagement: +(.5 + Math.random() * 4).toFixed(2)
	}));
	const buzzerNames = [
		"Rizky P.",
		"Anisa W.",
		"Budi S.",
		"Dewi L.",
		"Fajar N.",
		"Sinta M.",
		"Yoga P.",
		"Maya K.",
		"Rian A.",
		"Nadia F."
	];
	const buzzerList = Array.from({ length: Math.min(8, buzzers) }).map((_, i) => ({
		name: buzzerNames[i % buzzerNames.length],
		platform: PLATFORMS[i % PLATFORMS.length],
		rating: +(4.4 + Math.random() * .6).toFixed(1),
		status: progress >= 100 ? "Selesai" : i < 6 ? "Aktif" : "Selesai"
	}));
	return {
		reach,
		impression,
		like,
		comment,
		share,
		engagementRate: engagement,
		sentiment: {
			positive: pos,
			neutral: neu,
			negative: neg
		},
		daily,
		buzzers: buzzerList
	};
}
var PROOF_IMAGES = {
	"Instagram": proof_instagram_default,
	"TikTok": proof_tiktok_default,
	"X (Twitter)": proof_x_default
};
var PROOF_FALLBACK = [
	proof_instagram_default,
	proof_tiktok_default,
	proof_x_default
];
function proofImageFor(platform, i = 0) {
	return PROOF_IMAGES[platform] ?? PROOF_FALLBACK[i % PROOF_FALLBACK.length];
}
/** Bukti screenshot demo dari buzzer yang sudah menyelesaikan pekerjaan. */
function makeProofs(report, progress, days) {
	return report.buzzers.filter((b) => b.status === "Selesai" || progress >= 50).slice(0, 6).map((b, i) => ({
		id: `prf-${Math.random().toString(36).slice(2, 9)}`,
		buzzerName: b.name,
		platform: b.platform,
		imageUrl: proofImageFor(b.platform, i),
		caption: `Postingan sudah tayang di ${b.platform} sesuai brief.`,
		postLink: `https://buzzhub.id/post/${1e3 + i}`,
		uploadedAt: daysAgo(Math.max(0, days - i - 1)),
		verified: progress >= 100
	}));
}
function getNotifRank(n) {
	const title = (n.title || "").toLowerCase();
	const body = (n.body || "").toLowerCase();
	if (n.id === "ntf-welcome" || n.type === "system" || title.includes("selamat datang")) return 0;
	if (title.includes("selesai") || body.includes("selesai")) return 4;
	if (title.includes("disetujui") || title.includes("ditolak") || body.includes("disetujui") || body.includes("ditolak")) return 3;
	if (title.includes("menunggu") || title.includes("diverifikasi") || body.includes("menunggu persetujuan") || body.includes("akan memeriksa") || body.includes("sedang diverifikasi")) return 2;
	if (title.includes("dibuat") || title.includes("pesanan") || n.type === "order") return 1;
	return 1;
}
function getNotificationTime(n) {
	if (n.createdAt) {
		const t = new Date(n.createdAt).getTime();
		if (!isNaN(t) && t > 0) return t;
	}
	if (n.id) {
		const match = n.id.match(/\d{10,}/);
		if (match) {
			const t = Number(match[0]);
			if (!isNaN(t) && t > 0) return t;
		}
	}
	if (n.date) {
		const t = new Date(n.date).getTime();
		if (!isNaN(t) && t > 0) return t;
	}
	return 0;
}
function extractCampaignNameFromBody(body) {
	if (!body) return "";
	const quoted = body.match(/campaign\s+"([^"]+)"/i);
	if (quoted && quoted[1]) return quoted[1].trim();
	const unquoted = body.match(/campaign\s+([^\s,;]+)/i);
	if (unquoted && unquoted[1]) return unquoted[1].trim();
	return "";
}
function extractCampaignKey(n) {
	return extractCampaignNameFromBody(`${n.title || ""} ${n.body || ""}`).toLowerCase();
}
function sortNotifications(notifications) {
	return [...notifications].sort((a, b) => {
		const isWelcomeA = a.id === "ntf-welcome" || a.type === "system" || (a.title || "").toLowerCase().includes("selamat datang");
		const isWelcomeB = b.id === "ntf-welcome" || b.type === "system" || (b.title || "").toLowerCase().includes("selamat datang");
		if (isWelcomeA && !isWelcomeB) return 1;
		if (!isWelcomeA && isWelcomeB) return -1;
		if (isWelcomeA && isWelcomeB) return 0;
		const cmpA = extractCampaignKey(a);
		const cmpB = extractCampaignKey(b);
		if (cmpA && cmpB && cmpA === cmpB) {
			const rankA = getNotifRank(a);
			const rankB = getNotifRank(b);
			if (rankB !== rankA) return rankB - rankA;
		}
		const timeA = getNotificationTime(a);
		const timeB = getNotificationTime(b);
		if (timeA && timeB && timeB !== timeA) return timeB - timeA;
		const dayA = (a.createdAt || a.date || "").slice(0, 10);
		const dayB = (b.createdAt || b.date || "").slice(0, 10);
		if (dayA && dayB && dayA !== dayB) return dayB.localeCompare(dayA);
		if (a.read !== b.read) return a.read ? 1 : -1;
		const rankA = getNotifRank(a);
		const rankB = getNotifRank(b);
		if (rankB !== rankA) return rankB - rankA;
		return 0;
	});
}
function seed(email, name, profile = {}) {
	const orders = [];
	const payments = [];
	const notifications = [{
		id: "ntf-welcome",
		title: "Selamat datang di BuzzHub",
		body: "Akun Anda berhasil dibuat. Mulai buat campaign pertama Anda sekarang.",
		type: "system",
		date: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
		createdAt: (/* @__PURE__ */ new Date(Date.now() - 2592e6)).toISOString(),
		read: false
	}];
	return {
		profile: {
			name,
			email,
			phone: profile.phone ?? "",
			city: profile.city ?? "",
			company: profile.company ?? "",
			balance: 0
		},
		orders,
		payments,
		notifications
	};
}
function read(email, name, profile = {}) {
	if (typeof window === "undefined") return seed(email, name, profile);
	try {
		const raw = localStorage.getItem(keyFor(email));
		if (raw) {
			const parsed = JSON.parse(raw);
			const hydrated = {
				...parsed,
				profile: {
					...seed(email, name, profile).profile,
					...parsed.profile,
					...profile,
					name: parsed.profile?.name || name,
					email: parsed.profile?.email || email
				}
			};
			hydrated.orders = (hydrated.orders ?? []).map((o) => o.proofs ? o : {
				...o,
				proofs: o.status === "Dibatalkan" || o.status === "Menunggu" ? [] : makeProofs(o.report, o.progress, 7)
			});
			const normalizedNotifs = (hydrated.notifications ?? []).map((n) => {
				let title = n.title;
				let body = n.body;
				let type = n.type;
				if (title.toLowerCase().includes("diverifikasi") || body.toLowerCase().includes("akan memeriksa pembayaran") || body.toLowerCase().includes("sedang diverifikasi")) {
					title = "Menunggu Persetujuan Admin";
					body = `Pesanan campaign "${extractCampaignNameFromBody(body) || "Anda"}" sedang menunggu persetujuan dari admin.`;
					type = "order";
				} else if (title.toLowerCase().includes("pembayaran disetujui") || title.toLowerCase().includes("disetujui") && body.toLowerCase().includes("pembayaran")) {
					title = "Pesanan Disetujui";
					body = `Pesanan campaign "${extractCampaignNameFromBody(body) || "Anda"}" telah disetujui oleh admin. Campaign Anda sekarang aktif.`;
					type = "order";
				} else if (title.toLowerCase().includes("pembayaran ditolak")) {
					title = "Pesanan Ditolak";
					type = "order";
				}
				return {
					...n,
					title,
					body,
					type
				};
			});
			const approvedCampaignNames = /* @__PURE__ */ new Set();
			for (const ord of hydrated.orders ?? []) if (ord.status === "Berjalan" || ord.status === "Selesai") {
				const cleanCamp = (ord.campaignName || "").trim().toLowerCase();
				if (cleanCamp) approvedCampaignNames.add(cleanCamp);
			}
			for (const p of hydrated.payments ?? []) if (p.status === "Lunas" || p.status === "Berhasil") {
				const cleanCamp = (p.campaignName || "").trim().toLowerCase();
				if (cleanCamp) approvedCampaignNames.add(cleanCamp);
			}
			let filteredNotifs = normalizedNotifs.filter((n) => {
				const titleLower = (n.title || "").toLowerCase();
				const bodyLower = (n.body || "").toLowerCase();
				if (titleLower.includes("menunggu") || titleLower.includes("diverifikasi") || bodyLower.includes("menunggu persetujuan") || bodyLower.includes("sedang diverifikasi")) {
					const camp = (extractCampaignNameFromBody(bodyLower) || extractCampaignNameFromBody(titleLower)).toLowerCase();
					if (camp && approvedCampaignNames.has(camp)) return false;
				}
				return true;
			});
			for (const ord of hydrated.orders ?? []) if (ord.status === "Berjalan" || ord.status === "Selesai") {
				const cleanCamp = (ord.campaignName || "").trim();
				if (cleanCamp) {
					const approvedBody = `Pesanan campaign "${cleanCamp}" telah disetujui oleh admin. Campaign Anda sekarang aktif.`;
					if (!filteredNotifs.some((n) => n.title.toLowerCase().includes("disetujui") && (n.body === approvedBody || n.body.includes(`"${cleanCamp}"`)))) filteredNotifs.unshift({
						id: `ntf-ord-approved-${ord.id || Date.now()}`,
						title: "Pesanan Disetujui",
						body: approvedBody,
						type: "order",
						date: ord.createdAt ? ord.createdAt.slice(0, 10) : (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
						createdAt: (/* @__PURE__ */ new Date()).toISOString(),
						read: false
					});
				}
			}
			for (const p of hydrated.payments ?? []) if (p.status === "Lunas" || p.status === "Berhasil") {
				const cleanCamp = (p.campaignName || "").trim();
				if (cleanCamp) {
					const approvedBody = `Pesanan campaign "${cleanCamp}" telah disetujui oleh admin. Campaign Anda sekarang aktif.`;
					if (!filteredNotifs.some((n) => n.title.toLowerCase().includes("disetujui") && (n.body === approvedBody || n.body.includes(`"${cleanCamp}"`)))) filteredNotifs.unshift({
						id: `ntf-pay-approved-${p.id || Date.now()}`,
						title: "Pesanan Disetujui",
						body: approvedBody,
						type: "order",
						date: p.date || (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
						createdAt: (/* @__PURE__ */ new Date()).toISOString(),
						read: false
					});
				}
			}
			const workingNotifs = filteredNotifs;
			if (!workingNotifs.some((n) => n.id === "ntf-welcome" || n.title.toLowerCase().includes("selamat datang"))) workingNotifs.push({
				id: "ntf-welcome",
				title: "Selamat datang di BuzzHub",
				body: "Akun Anda berhasil dibuat. Mulai buat campaign pertama Anda sekarang.",
				type: "system",
				date: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
				createdAt: (/* @__PURE__ */ new Date(Date.now() - 2592e6)).toISOString(),
				read: false
			});
			const deduped = [];
			const seen = /* @__PURE__ */ new Map();
			for (const n of workingNotifs) {
				const key = `${n.title.trim().toLowerCase()}|${n.body.trim().toLowerCase()}`;
				if (!seen.has(key)) {
					seen.set(key, n);
					deduped.push(n);
				} else {
					const existing = seen.get(key);
					if (!n.read && existing.read) existing.read = false;
				}
			}
			hydrated.notifications = sortNotifications(deduped);
			return hydrated;
		}
	} catch {}
	const s = seed(email, name, profile);
	localStorage.setItem(keyFor(email), JSON.stringify(s));
	return s;
}
function write(email, state) {
	localStorage.setItem(keyFor(email), JSON.stringify(state));
	window.dispatchEvent(new Event(EVT));
}
function useCustomerStore(email, name, profile = {}) {
	const nm = name ?? "Customer";
	(0, import_react.useEffect)(() => {
		if (email) {
			const hydrated = read(email, nm, profile);
			localStorage.setItem(keyFor(email), JSON.stringify(hydrated));
		}
	}, [
		email,
		nm,
		profile.company,
		profile.phone,
		profile.city
	]);
	(0, import_react.useEffect)(() => {
		if (!email) return;
		let active = true;
		const loadProfile = async () => {
			const { data, error } = await supabase.from("app_accounts").select("name, email, phone, city, company").eq("email", email.trim().toLowerCase()).eq("role", "customer").maybeSingle();
			if (!active || error || !data) return;
			const current = read(email, nm, profile);
			write(email, {
				...current,
				profile: {
					...current.profile,
					name: data.name,
					email: data.email,
					phone: data.phone ?? "",
					city: data.city ?? "",
					company: data.company ?? current.profile.company
				}
			});
		};
		loadProfile();
		return () => {
			active = false;
		};
	}, [
		email,
		nm,
		profile.company,
		profile.phone,
		profile.city
	]);
	(0, import_react.useEffect)(() => {
		if (!email) return;
		const normalizedEmail = email.trim().toLowerCase();
		let isMounted = true;
		const syncServerData = async () => {
			try {
				const { data: dbNotifs } = await supabase.from("notifications").select("*").eq("user_id", normalizedEmail).order("created_at", { ascending: false }).limit(50);
				if (!isMounted) return;
				const [payRes, cmpRes] = await Promise.all([supabase.from("payments").select("id, invoice_no, campaign_name, status, rejection_reason, amount, method, created_at, customer_email").ilike("customer_email", normalizedEmail), supabase.from("campaigns").select("id, title, status, payment_status, payment_rejection_reason, budget, platform, slots, deadline, created_at, brief").ilike("customer_email", normalizedEmail)]);
				if (!isMounted) return;
				const dbPayments = payRes.data ?? [];
				const dbCampaigns = cmpRes.data ?? [];
				const currentState = read(normalizedEmail, nm);
				let stateChanged = false;
				const currentPayments = [...currentState.payments ?? []];
				for (const p of dbPayments) {
					let pStatus = "Menunggu Verifikasi";
					const rawStatus = (p.status || "").toLowerCase();
					if (rawStatus === "lunas" || rawStatus === "berhasil" || rawStatus === "disetujui") pStatus = "Lunas";
					else if (rawStatus === "gagal" || rawStatus === "ditolak") pStatus = "Gagal";
					else if (rawStatus === "refund") pStatus = "Refund";
					else if (rawStatus === "pending" || rawStatus === "menunggu pembayaran") pStatus = "Belum Dibayar";
					else pStatus = "Menunggu Verifikasi";
					const existingIdx = currentPayments.findIndex((cp) => cp.id === p.id || p.invoice_no && cp.invoice === p.invoice_no || p.campaign_name && cp.campaignName.trim().toLowerCase() === p.campaign_name.trim().toLowerCase());
					const dbAmount = Number(p.amount || 0);
					if (existingIdx >= 0) {
						if (currentPayments[existingIdx].status !== pStatus) {
							currentPayments[existingIdx] = {
								...currentPayments[existingIdx],
								status: pStatus
							};
							stateChanged = true;
						}
						if ((!currentPayments[existingIdx].amount || currentPayments[existingIdx].amount === 0) && dbAmount > 0) {
							currentPayments[existingIdx] = {
								...currentPayments[existingIdx],
								amount: dbAmount
							};
							stateChanged = true;
						}
					} else {
						currentPayments.unshift({
							id: p.id,
							invoice: p.invoice_no || `INV-${p.id.slice(0, 8).toUpperCase()}`,
							orderId: p.id,
							campaignName: p.campaign_name || "Campaign",
							amount: dbAmount,
							date: p.created_at ? p.created_at.slice(0, 10) : (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
							method: p.method || "Transfer Bank",
							channel: "Manual Verification",
							status: pStatus
						});
						stateChanged = true;
					}
				}
				const currentOrders = [...currentState.orders ?? []];
				for (const c of dbCampaigns) {
					const isApproved = c.payment_status === "Pembayaran Disetujui" || c.payment_status === "Disetujui" || c.status === "Aktif" && c.payment_status !== "Pembayaran Ditolak";
					const existingOrdIdx = currentOrders.findIndex((co) => co.id === c.id || co.campaignId === c.id || co.campaignName.trim().toLowerCase() === (c.title || "").trim().toLowerCase());
					if (existingOrdIdx >= 0) {
						if (isApproved && currentOrders[existingOrdIdx].status === "Menunggu") {
							currentOrders[existingOrdIdx] = {
								...currentOrders[existingOrdIdx],
								status: "Berjalan"
							};
							stateChanged = true;
						} else if (c.status === "Selesai" && currentOrders[existingOrdIdx].status !== "Selesai") {
							currentOrders[existingOrdIdx] = {
								...currentOrders[existingOrdIdx],
								status: "Selesai"
							};
							stateChanged = true;
						}
					} else {
						currentOrders.unshift({
							id: c.id,
							serviceId: c.catalog_id || "srv-pro",
							campaignId: c.id,
							invoice: `INV-${c.id.slice(0, 8).toUpperCase()}`,
							serviceName: "Kampanye BuzzPro",
							packageTier: "Professional",
							platform: c.platform || "Instagram",
							campaignName: c.title || "Campaign",
							description: c.brief || "",
							startDate: c.created_at ? c.created_at.slice(0, 10) : (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
							endDate: c.deadline || "",
							buzzers: Number(c.slots || 10),
							buzzersJoined: 0,
							progress: 0,
							status: c.status === "Selesai" ? "Selesai" : c.status === "Dibatalkan" ? "Dibatalkan" : isApproved ? "Berjalan" : "Menunggu",
							total: Number(c.budget || 0),
							createdAt: c.created_at ? c.created_at.slice(0, 10) : (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
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
						});
						stateChanged = true;
					}
				}
				const approvedTitles = /* @__PURE__ */ new Set();
				for (const c of dbCampaigns) if ((c.payment_status === "Pembayaran Disetujui" || c.payment_status === "Disetujui" || c.status === "Aktif" && c.payment_status !== "Pembayaran Ditolak") && c.title?.trim()) approvedTitles.add(c.title.trim().toLowerCase());
				for (const p of dbPayments) {
					const rawStatus = (p.status || "").toLowerCase();
					if ((rawStatus === "lunas" || rawStatus === "berhasil" || rawStatus === "disetujui") && p.campaign_name?.trim()) approvedTitles.add(p.campaign_name.trim().toLowerCase());
				}
				let mergedNotifs = [...currentState.notifications ?? []];
				if (dbNotifs && dbNotifs.length > 0) for (const dn of dbNotifs) {
					let title = dn.title;
					let body = dn.message;
					let type = dn.type || "order";
					if (title.toLowerCase().includes("diverifikasi") || body.toLowerCase().includes("akan memeriksa pembayaran")) {
						title = "Menunggu Persetujuan Admin";
						body = `Pesanan campaign "${extractCampaignNameFromBody(body) || "Anda"}" sedang menunggu persetujuan dari admin.`;
						type = "order";
					} else if (title.toLowerCase().includes("pembayaran disetujui") || title.toLowerCase().includes("disetujui") && body.toLowerCase().includes("pembayaran")) {
						title = "Pesanan Disetujui";
						body = `Pesanan campaign "${extractCampaignNameFromBody(body) || "Anda"}" telah disetujui oleh admin. Campaign Anda sekarang aktif.`;
						type = "order";
					} else if (title.toLowerCase().includes("pembayaran ditolak")) {
						title = "Pesanan Ditolak";
						type = "order";
					}
					const isPending = title.toLowerCase().includes("menunggu") || title.toLowerCase().includes("diverifikasi") || body.toLowerCase().includes("menunggu persetujuan");
					const campKey = (extractCampaignNameFromBody(body) || extractCampaignNameFromBody(title)).toLowerCase();
					if (isPending && campKey && approvedTitles.has(campKey)) {
						stateChanged = true;
						supabase.from("notifications").delete().eq("id", dn.id);
						continue;
					}
					if (!mergedNotifs.some((m) => m.id === dn.id || m.title.toLowerCase() === title.toLowerCase() && m.body.toLowerCase() === body.toLowerCase())) {
						mergedNotifs.push({
							id: dn.id,
							title,
							body,
							type,
							date: dn.created_at ? dn.created_at.slice(0, 10) : (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
							createdAt: dn.created_at ?? (/* @__PURE__ */ new Date()).toISOString(),
							read: dn.is_read ?? false
						});
						stateChanged = true;
					}
				}
				mergedNotifs = mergedNotifs.filter((n) => {
					const t = (n.title || "").toLowerCase();
					const b = (n.body || "").toLowerCase();
					if (t.includes("menunggu") || t.includes("diverifikasi") || b.includes("menunggu persetujuan") || b.includes("sedang diverifikasi")) {
						const camp = (extractCampaignNameFromBody(b) || extractCampaignNameFromBody(t)).toLowerCase();
						if (camp && approvedTitles.has(camp)) {
							stateChanged = true;
							return false;
						}
					}
					return true;
				});
				for (const c of dbCampaigns) {
					const isApproved = c.payment_status === "Pembayaran Disetujui" || c.payment_status === "Disetujui" || c.status === "Aktif" && c.payment_status !== "Pembayaran Ditolak";
					const cleanTitle = (c.title || "").trim();
					if (isApproved && cleanTitle) {
						const approvedBody = `Pesanan campaign "${cleanTitle}" telah disetujui oleh admin. Campaign Anda sekarang aktif.`;
						if (!mergedNotifs.some((n) => n.title.toLowerCase().includes("disetujui") && (n.body === approvedBody || n.body.includes(`"${cleanTitle}"`)))) {
							mergedNotifs.unshift({
								id: `ntf-approved-cmp-${c.id}`,
								title: "Pesanan Disetujui",
								body: approvedBody,
								type: "order",
								date: c.created_at ? c.created_at.slice(0, 10) : (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
								createdAt: c.created_at || (/* @__PURE__ */ new Date()).toISOString(),
								read: false
							});
							stateChanged = true;
							supabase.from("notifications").insert({
								user_id: normalizedEmail,
								title: "Pesanan Disetujui",
								message: approvedBody,
								type: "order",
								is_read: false
							});
						}
					}
				}
				for (const p of dbPayments) {
					const rawStatus = (p.status || "").toLowerCase();
					const isLunas = rawStatus === "lunas" || rawStatus === "berhasil" || rawStatus === "disetujui";
					const cleanCamp = (p.campaign_name || "").trim();
					if (isLunas && cleanCamp) {
						const approvedBody = `Pesanan campaign "${cleanCamp}" telah disetujui oleh admin. Campaign Anda sekarang aktif.`;
						if (!mergedNotifs.some((n) => n.title.toLowerCase().includes("disetujui") && (n.body === approvedBody || n.body.includes(`"${cleanCamp}"`)))) {
							mergedNotifs.unshift({
								id: `ntf-approved-pay-${p.id}`,
								title: "Pesanan Disetujui",
								body: approvedBody,
								type: "order",
								date: p.created_at ? p.created_at.slice(0, 10) : (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
								createdAt: p.created_at || (/* @__PURE__ */ new Date()).toISOString(),
								read: false
							});
							stateChanged = true;
							supabase.from("notifications").insert({
								user_id: normalizedEmail,
								title: "Pesanan Disetujui",
								message: approvedBody,
								type: "order",
								is_read: false
							});
						}
					}
				}
				if (stateChanged) {
					const deduped = [];
					const seen = /* @__PURE__ */ new Map();
					for (const n of mergedNotifs) {
						const key = `${n.title.trim().toLowerCase()}|${n.body.trim().toLowerCase()}`;
						if (!seen.has(key)) {
							seen.set(key, n);
							deduped.push(n);
						} else {
							const existing = seen.get(key);
							if (!n.read && existing.read) existing.read = false;
						}
					}
					const sorted = sortNotifications(deduped);
					write(normalizedEmail, {
						...currentState,
						payments: currentPayments,
						orders: currentOrders,
						notifications: sorted
					});
				}
			} catch (err) {
				console.warn("Gagal sinkronisasi notifikasi customer:", err);
			}
		};
		syncServerData();
		const interval = setInterval(() => {
			syncServerData();
		}, 3e3);
		const channelName = `rt-cust-notif-${normalizedEmail}-${Math.random().toString(36).slice(2, 7)}`;
		const channel = supabase.channel(channelName).on("postgres_changes", {
			event: "*",
			schema: "public",
			table: "notifications"
		}, (payload) => {
			const rec = payload.new || payload.old;
			if (!rec || !rec.user_id || rec.user_id.toLowerCase() === normalizedEmail) syncServerData();
		}).on("postgres_changes", {
			event: "*",
			schema: "public",
			table: "payments"
		}, (payload) => {
			const rec = payload.new || payload.old;
			if (!rec || !rec.customer_email || rec.customer_email.toLowerCase() === normalizedEmail) syncServerData();
		}).on("postgres_changes", {
			event: "*",
			schema: "public",
			table: "campaigns"
		}, (payload) => {
			const rec = payload.new || payload.old;
			if (!rec || !rec.customer_email || rec.customer_email.toLowerCase() === normalizedEmail) syncServerData();
		}).subscribe((status) => {
			if (status === "SUBSCRIBED") syncServerData();
		});
		return () => {
			isMounted = false;
			clearInterval(interval);
			supabase.removeChannel(channel);
		};
	}, [email, nm]);
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
		if (!email) return null;
		try {
			return localStorage.getItem(keyFor(email)) ?? "";
		} catch {
			return "";
		}
	};
	(0, import_react.useSyncExternalStore)(subscribe, getSnapshot, () => null);
	const state = email ? read(email, nm, profile) : seed("guest@buzzhub.id", nm);
	const mutate = (fn) => {
		if (!email) return;
		write(email, fn(read(email, nm)));
	};
	const pushNotif = (n) => {
		const tNow = Date.now();
		const notifItem = {
			id: n.id || "ntf-" + tNow + Math.random().toString(36).slice(2, 6),
			date: n.date || (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
			createdAt: n.createdAt || (/* @__PURE__ */ new Date()).toISOString(),
			read: false,
			...n
		};
		mutate((s) => {
			const filtered = (s.notifications ?? []).filter((existing) => existing.id !== notifItem.id);
			return {
				...s,
				notifications: sortNotifications([notifItem, ...filtered])
			};
		});
		if (email) supabase.from("notifications").insert({
			user_id: email.trim().toLowerCase(),
			title: n.title,
			message: n.body,
			type: n.type,
			is_read: false
		});
	};
	return {
		state,
		ready: !!email,
		services: SERVICES,
		pushNotif,
		createOrder: (input) => {
			const svc = input.service ?? SERVICES.find((s) => s.id === input.serviceId);
			if (!svc) throw new Error("Layanan tidak ditemukan.");
			const fallbackPackage = svc.packages.find((p) => p.tier === input.packageTier) ?? svc.packages[0];
			const selectedPackage = input.catalogPackageName && svc.catalogId ? {
				...fallbackPackage,
				tier: input.catalogPackageName,
				price: input.catalogPackagePrice ?? fallbackPackage.price,
				buzzers: input.catalogPackageBuzzerCount ?? input.buzzers ?? fallbackPackage.buzzers
			} : {
				...fallbackPackage,
				tier: input.serviceType ?? fallbackPackage.tier,
				price: input.pricePerBuzzer ?? fallbackPackage.price
			};
			const buzzers = input.buzzers ?? selectedPackage.buzzers;
			const isCatalog = !!svc.catalogId;
			const unitPrice = isCatalog && input.catalogPackagePrice !== void 0 ? Number(input.catalogPackagePrice) : Number(selectedPackage.price ?? 0);
			const totalPrice = isCatalog && input.catalogPackagePrice !== void 0 ? unitPrice : unitPrice * buzzers;
			const pkg = {
				...selectedPackage,
				buzzers,
				price: unitPrice
			};
			const id = "ord-" + Date.now();
			const order = {
				id,
				invoice: "INV-2026-" + Math.floor(1e3 + Math.random() * 9e3),
				serviceId: svc.id,
				serviceName: svc.name,
				serviceType: input.serviceType,
				packageTier: pkg.tier,
				catalogPackageId: input.catalogPackageId,
				packageSnapshotName: input.catalogPackageName ?? pkg.tier,
				packageSnapshotPrice: Number(input.catalogPackagePrice ?? pkg.price ?? 0),
				packageSnapshotBuzzerCount: Number(input.catalogPackageBuzzerCount ?? pkg.buzzers ?? 0),
				platform: input.platform,
				campaignName: input.campaignName,
				description: input.description,
				link: input.link,
				location: input.location,
				startDate: input.startDate,
				endDate: input.endDate,
				buzzers: pkg.buzzers,
				buzzersJoined: 0,
				progress: 0,
				status: "Menunggu",
				total: totalPrice,
				createdAt: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
				catalogId: input.catalogId ?? svc.catalogId,
				thumbnailUrl: input.thumbnailUrl ?? svc.thumbnailUrl ?? void 0,
				report: makeReport(pkg.buzzers, 0, 7),
				proofs: []
			};
			const payment = {
				id: "pay-" + Date.now(),
				invoice: "INV-2026-" + Math.floor(2e3 + Math.random() * 9e3),
				orderId: id,
				campaignName: input.campaignName,
				method: "Transfer Bank",
				channel: "BCA",
				amount: totalPrice,
				status: "Belum Dibayar",
				date: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
				pendingOrder: order
			};
			pendingPayments.set(payment.id, payment);
			return {
				order,
				payment
			};
		},
		cancelOrder: (id) => {
			mutate((s) => ({
				...s,
				orders: s.orders.map((o) => o.id === id ? {
					...o,
					status: "Dibatalkan",
					progress: 0
				} : o)
			}));
			pushNotif({
				type: "order",
				title: `Pesanan dibatalkan`,
				body: `Pesanan telah dibatalkan sesuai permintaan.`
			});
		},
		duplicateOrder: (id) => {
			mutate((s) => {
				const src = s.orders.find((o) => o.id === id);
				if (!src) return s;
				const clone = {
					...src,
					id: "ord-" + Date.now(),
					invoice: "INV-2026-" + Math.floor(1e3 + Math.random() * 9e3),
					status: "Menunggu",
					progress: 0,
					buzzersJoined: 0,
					proofs: [],
					createdAt: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
					campaignName: src.campaignName + " (Salinan)"
				};
				return {
					...s,
					orders: [clone, ...s.orders]
				};
			});
			pushNotif({
				type: "order",
				title: `Pesanan diduplikasi`,
				body: `Salinan pesanan berhasil dibuat.`
			});
		},
		/** Tambah bukti upload (screenshot) buzzer ke sebuah pesanan. */
		addOrderProof: (orderId, proof) => {
			mutate((s) => ({
				...s,
				orders: s.orders.map((o) => o.id === orderId ? {
					...o,
					proofs: [{
						id: "prf-" + Date.now(),
						uploadedAt: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
						verified: proof.verified ?? false,
						...proof
					}, ...o.proofs ?? []]
				} : o)
			}));
			pushNotif({
				type: "campaign",
				title: "Bukti pengerjaan masuk",
				body: "Buzzer mengunggah screenshot bukti pesanan selesai."
			});
		},
		editOrder: (id, patch) => {
			mutate((s) => ({
				...s,
				orders: s.orders.map((o) => o.id === id ? {
					...o,
					...patch
				} : o)
			}));
		},
		payInvoice: async (paymentId, method, channel, bankAccountNumber = "") => {
			if (read(email || "", nm).payments.some((payment) => payment.id === paymentId)) return;
			const pending = pendingPayments.get(paymentId);
			if (!pending?.pendingOrder) return;
			const order = pending.pendingOrder;
			const payment = {
				...pending,
				pendingOrder: void 0,
				method,
				channel,
				status: "Menunggu Verifikasi",
				date: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10)
			};
			const tNow = Date.now();
			let campaignId;
			pushNotif({
				id: "ntf-ord-" + tNow,
				type: "order",
				title: `Pesanan ${order.invoice} dibuat`,
				body: `Campaign "${order.campaignName}" berhasil dibuat.`,
				date: (/* @__PURE__ */ new Date(tNow - 2e3)).toISOString().slice(0, 10),
				createdAt: (/* @__PURE__ */ new Date(tNow - 2e3)).toISOString()
			});
			const rawLink = order.link ? order.link.trim() : "";
			const normalizedLink = rawLink ? rawLink.startsWith("http://") || rawLink.startsWith("https://") ? rawLink : `https://${rawLink}` : "";
			const taskActionName = order.serviceType || order.packageTier || order.serviceName || "Pengerjaan";
			const briefLines = [];
			briefLines.push(`📌 Jenis Tugas: ${taskActionName}`);
			if (normalizedLink) briefLines.push(`🔗 Link Target: ${normalizedLink}`);
			else if (order.location) briefLines.push(`📍 Lokasi: ${order.location}`);
			if (order.description && order.description.trim()) briefLines.push(`📝 Instruksi Customer:\n${order.description.trim()}`);
			const fullStructuredBrief = briefLines.join("\n\n");
			try {
				const result = await createCustomerPaymentCampaign({
					invoice_no: payment.invoice,
					customer_name: nm,
					customer_email: (email ?? "guest@buzzhub.id").toLowerCase(),
					campaign_name: order.campaignName,
					campaign_type: order.platform,
					service_type: order.serviceType,
					method: `${method} (${channel})`,
					note: method === "Bank" ? bankAccountNumber.includes(":") ? bankAccountNumber : `Nomor bank / referensi transfer: ${bankAccountNumber}` : null,
					amount: order.total,
					buzzer_cost: 0,
					fee: order.total,
					brief: fullStructuredBrief,
					budget: order.total,
					payout_per_buzzer: 0,
					slots: order.buzzers,
					start_date: order.startDate,
					deadline: order.endDate,
					catalog_id: order.catalogId || (order.serviceId.startsWith("catalog-") ? order.serviceId.slice(8) : void 0),
					package_id: order.catalogPackageId,
					package_name: order.packageSnapshotName ?? order.packageTier,
					package_price: order.packageSnapshotPrice ?? order.total,
					package_buzzer_count: order.packageSnapshotBuzzerCount ?? order.buzzers,
					thumbnail_url: order.thumbnailUrl
				});
				campaignId = result.campaignId;
				payment.id = result.paymentId;
			} catch (error) {
				console.error("[payment] gagal menyimpan payment dan campaign ke Supabase", error);
				const detail = error instanceof Error ? error.message : String(error);
				throw new Error(`Pesanan gagal disimpan ke dashboard admin: ${detail}`);
			}
			pendingPayments.delete(paymentId);
			mutate((s) => ({
				...s,
				orders: [{
					...order,
					campaignId
				}, ...s.orders],
				payments: [payment, ...s.payments]
			}));
			if (email) {
				const { error: customerError } = await supabase.from("customer_accounts").upsert({
					email: email.trim().toLowerCase(),
					name: nm,
					active: true
				}, { onConflict: "email" });
				if (customerError) console.error("[customer] gagal memperbarui ringkasan akun", customerError);
			}
			pushNotif({
				id: "ntf-wait-" + (tNow + 500),
				type: "order",
				title: "Menunggu Persetujuan Admin",
				body: `Pesanan campaign "${order.campaignName}" sedang menunggu persetujuan dari admin.`,
				date: new Date(tNow).toISOString().slice(0, 10),
				createdAt: new Date(tNow).toISOString()
			});
		},
		markNotificationRead: (id) => {
			mutate((s) => ({
				...s,
				notifications: s.notifications.map((n) => n.id === id ? {
					...n,
					read: true
				} : n)
			}));
			if (email) supabase.from("notifications").update({
				is_read: true,
				updated_at: (/* @__PURE__ */ new Date()).toISOString()
			}).eq("id", id);
		},
		markAllRead: () => {
			mutate((s) => ({
				...s,
				notifications: s.notifications.map((n) => ({
					...n,
					read: true
				}))
			}));
			if (email) supabase.from("notifications").update({
				is_read: true,
				updated_at: (/* @__PURE__ */ new Date()).toISOString()
			}).eq("user_id", email.trim().toLowerCase());
		},
		markPaymentApproved: (campaignName, invoice) => {
			const cleanCampaign = campaignName.trim();
			const bodyText = `Pesanan campaign "${cleanCampaign}" telah disetujui oleh admin. Campaign Anda sekarang aktif.`;
			const tNow = Date.now();
			mutate((s) => {
				const remainingNotifs = (s.notifications ?? []).filter((n) => {
					const t = (n.title || "").toLowerCase();
					const b = (n.body || "").toLowerCase();
					const isPending = t.includes("menunggu") || t.includes("diverifikasi") || b.includes("menunggu persetujuan") || b.includes("sedang diverifikasi");
					const matches = b.includes(`"${cleanCampaign.toLowerCase()}"`) || b.includes(cleanCampaign.toLowerCase());
					return !(isPending && matches);
				});
				const nextNotifs = sortNotifications([{
					id: "ntf-approved-" + tNow,
					title: "Pesanan Disetujui",
					body: bodyText,
					type: "order",
					date: new Date(tNow).toISOString().slice(0, 10),
					createdAt: new Date(tNow).toISOString(),
					read: false
				}, ...remainingNotifs.filter((n) => !(n.title.toLowerCase().includes("disetujui") && n.body === bodyText))]);
				return {
					...s,
					notifications: nextNotifs,
					payments: s.payments.map((p) => (p.campaignName.trim().toLowerCase() === campaignName.trim().toLowerCase() || invoice && p.invoice === invoice) && p.status !== "Lunas" ? {
						...p,
						status: "Lunas"
					} : p),
					orders: s.orders.map((o) => (o.campaignName.trim().toLowerCase() === campaignName.trim().toLowerCase() || invoice && o.invoice === invoice) && o.status === "Menunggu" ? {
						...o,
						status: "Berjalan"
					} : o)
				};
			});
			if (email) {
				supabase.from("notifications").delete().eq("user_id", email.trim().toLowerCase()).or("title.ilike.%menunggu%,title.ilike.%diverifikasi%").ilike("message", `%${cleanCampaign}%`);
				supabase.from("notifications").insert({
					user_id: email.trim().toLowerCase(),
					title: "Pesanan Disetujui",
					message: bodyText,
					type: "order",
					is_read: false
				});
			}
		},
		markPaymentRejected: (campaignName, invoice) => mutate((s) => ({
			...s,
			notifications: (s.notifications ?? []).filter((n) => {
				const t = (n.title || "").toLowerCase();
				const b = (n.body || "").toLowerCase();
				const isPending = t.includes("menunggu") || t.includes("diverifikasi") || b.includes("menunggu persetujuan");
				const matches = b.includes(`"${campaignName.trim().toLowerCase()}"`) || b.includes(campaignName.trim().toLowerCase());
				return !(isPending && matches);
			}),
			payments: s.payments.map((p) => (p.campaignName.trim().toLowerCase() === campaignName.trim().toLowerCase() || invoice && p.invoice === invoice) && p.status !== "Gagal" ? {
				...p,
				status: "Gagal"
			} : p),
			orders: s.orders.map((o) => (o.campaignName.trim().toLowerCase() === campaignName.trim().toLowerCase() || invoice && o.invoice === invoice) && o.status === "Menunggu" ? {
				...o,
				status: "Dibatalkan"
			} : o)
		}))
	};
}
async function notifyCustomerPaymentApproved(customerEmail, campaignName, invoice) {
	let email = customerEmail?.trim().toLowerCase();
	let cleanCampaign = campaignName?.trim();
	if (!email && invoice) try {
		const { data: p } = await supabase.from("payments").select("customer_email, campaign_name").eq("invoice_no", invoice).maybeSingle();
		if (p?.customer_email) email = p.customer_email.trim().toLowerCase();
		if (!cleanCampaign && p?.campaign_name) cleanCampaign = p.campaign_name.trim();
	} catch {}
	if (!email && cleanCampaign) try {
		const { data: c } = await supabase.from("campaigns").select("customer_email").eq("title", cleanCampaign).maybeSingle();
		if (c?.customer_email) email = c.customer_email.trim().toLowerCase();
	} catch {}
	if (!cleanCampaign && invoice) try {
		const { data: p } = await supabase.from("payments").select("campaign_name").eq("invoice_no", invoice).maybeSingle();
		if (p?.campaign_name) cleanCampaign = p.campaign_name.trim();
	} catch {}
	if (!email || !cleanCampaign) return;
	const bodyText = `Pesanan campaign "${cleanCampaign}" telah disetujui oleh admin. Campaign Anda sekarang aktif.`;
	try {
		await supabase.from("notifications").delete().eq("user_id", email).or("title.ilike.%menunggu%,title.ilike.%diverifikasi%").ilike("message", `%${cleanCampaign}%`);
		await supabase.from("notifications").insert({
			user_id: email,
			title: "Pesanan Disetujui",
			message: bodyText,
			type: "order",
			is_read: false
		});
	} catch (error) {
		console.error("Gagal sinkronisasi notifikasi pesanan disetujui ke database:", error);
	}
	if (typeof window !== "undefined") {
		const key = `buzzhub.customer.${email}`;
		try {
			const raw = localStorage.getItem(key);
			const state = raw ? JSON.parse(raw) : seed(email, "Customer");
			const updatedPayments = [...state.payments ?? []];
			const matchPayIdx = updatedPayments.findIndex((p) => p.campaignName.trim().toLowerCase() === cleanCampaign.toLowerCase() || invoice && p.invoice === invoice);
			if (matchPayIdx >= 0) updatedPayments[matchPayIdx] = {
				...updatedPayments[matchPayIdx],
				status: "Lunas"
			};
			else updatedPayments.unshift({
				id: `pay-${Date.now()}`,
				invoice: invoice || `INV-${Date.now().toString().slice(-6)}`,
				orderId: `ord-${Date.now()}`,
				campaignName: cleanCampaign,
				amount: 0,
				date: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
				method: "Transfer Bank",
				channel: "Manual Verification",
				status: "Lunas"
			});
			const updatedOrders = (state.orders ?? []).map((o) => {
				if (o.campaignName.trim().toLowerCase() === cleanCampaign.toLowerCase() || invoice && o.invoice === invoice) return {
					...o,
					status: o.status === "Menunggu" ? "Berjalan" : o.status
				};
				return o;
			});
			const remainingNotifs = (state.notifications ?? []).filter((n) => {
				const t = (n.title || "").toLowerCase();
				const b = (n.body || "").toLowerCase();
				const isPending = t.includes("menunggu") || t.includes("diverifikasi") || b.includes("menunggu persetujuan") || b.includes("sedang diverifikasi");
				const matches = b.includes(`"${cleanCampaign.toLowerCase()}"`) || b.includes(cleanCampaign.toLowerCase());
				return !(isPending && matches);
			});
			let notifications = [{
				id: "ntf-ord-approved-" + Date.now(),
				title: "Pesanan Disetujui",
				body: bodyText,
				type: "order",
				date: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
				createdAt: (/* @__PURE__ */ new Date()).toISOString(),
				read: false
			}, ...remainingNotifs.filter((n) => !(n.title.toLowerCase().includes("disetujui") && n.body === bodyText))];
			const dedupedNotifs = [];
			const seenNotifs = /* @__PURE__ */ new Map();
			for (const n of notifications) {
				const k = `${n.title.trim().toLowerCase()}|${n.body.trim().toLowerCase()}`;
				if (!seenNotifs.has(k)) {
					seenNotifs.set(k, n);
					dedupedNotifs.push(n);
				}
			}
			notifications = sortNotifications(dedupedNotifs);
			const nextState = {
				...state,
				payments: updatedPayments,
				orders: updatedOrders,
				notifications
			};
			localStorage.setItem(key, JSON.stringify(nextState));
			window.dispatchEvent(new Event("buzzhub:customer-store"));
			window.dispatchEvent(new Event("storage"));
		} catch (error) {
			console.error("Gagal memperbarui notifikasi pesanan disetujui customer di localStorage:", error);
		}
	}
}
async function notifyCustomerPaymentRejected(customerEmail, campaignName, reason, invoice) {
	let email = customerEmail?.trim().toLowerCase();
	let cleanCampaign = campaignName?.trim();
	if (!email && invoice) try {
		const { data: p } = await supabase.from("payments").select("customer_email, campaign_name").eq("invoice_no", invoice).maybeSingle();
		if (p?.customer_email) email = p.customer_email.trim().toLowerCase();
		if (!cleanCampaign && p?.campaign_name) cleanCampaign = p.campaign_name.trim();
	} catch {}
	if (!email && cleanCampaign) try {
		const { data: c } = await supabase.from("campaigns").select("customer_email").eq("title", cleanCampaign).maybeSingle();
		if (c?.customer_email) email = c.customer_email.trim().toLowerCase();
	} catch {}
	if (!cleanCampaign && invoice) try {
		const { data: p } = await supabase.from("payments").select("campaign_name").eq("invoice_no", invoice).maybeSingle();
		if (p?.campaign_name) cleanCampaign = p.campaign_name.trim();
	} catch {}
	if (!email || !cleanCampaign) return;
	const bodyText = `Pesanan campaign "${cleanCampaign}" ditolak oleh admin.${reason ? ` Alasan: ${reason}` : ""}`;
	try {
		await supabase.from("notifications").delete().eq("user_id", email).or("title.ilike.%menunggu%,title.ilike.%diverifikasi%").ilike("message", `%${cleanCampaign}%`);
		await supabase.from("notifications").insert({
			user_id: email,
			title: "Pesanan Ditolak",
			message: bodyText,
			type: "order",
			is_read: false
		});
	} catch (error) {
		console.error("Gagal menyimpan notifikasi penolakan pesanan ke database:", error);
	}
	if (typeof window !== "undefined") {
		const key = `buzzhub.customer.${email}`;
		try {
			const raw = localStorage.getItem(key);
			const state = raw ? JSON.parse(raw) : seed(email, "Customer");
			const updatedPayments = [...state.payments ?? []];
			const matchPayIdx = updatedPayments.findIndex((p) => p.campaignName.trim().toLowerCase() === cleanCampaign.toLowerCase() || invoice && p.invoice === invoice);
			if (matchPayIdx >= 0) updatedPayments[matchPayIdx] = {
				...updatedPayments[matchPayIdx],
				status: "Gagal"
			};
			else updatedPayments.unshift({
				id: `pay-${Date.now()}`,
				invoice: invoice || `INV-${Date.now().toString().slice(-6)}`,
				orderId: `ord-${Date.now()}`,
				campaignName: cleanCampaign,
				amount: 0,
				date: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
				method: "Transfer Bank",
				channel: "Manual Verification",
				status: "Gagal"
			});
			const updatedOrders = (state.orders ?? []).map((o) => {
				if (o.campaignName.trim().toLowerCase() === cleanCampaign.toLowerCase() || invoice && o.invoice === invoice) return {
					...o,
					status: o.status === "Menunggu" ? "Dibatalkan" : o.status
				};
				return o;
			});
			const remainingNotifs = (state.notifications ?? []).filter((n) => {
				const t = (n.title || "").toLowerCase();
				const b = (n.body || "").toLowerCase();
				const isPending = t.includes("menunggu") || t.includes("diverifikasi") || b.includes("menunggu persetujuan") || b.includes("sedang diverifikasi");
				const matches = b.includes(`"${cleanCampaign.toLowerCase()}"`) || b.includes(cleanCampaign.toLowerCase());
				return !(isPending && matches);
			});
			let notifications = [{
				id: "ntf-ord-rejected-" + Date.now(),
				title: "Pesanan Ditolak",
				body: bodyText,
				type: "order",
				date: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
				createdAt: (/* @__PURE__ */ new Date()).toISOString(),
				read: false
			}, ...remainingNotifs.filter((n) => !(n.title.toLowerCase().includes("ditolak") && n.body === bodyText))];
			const dedupedNotifs = [];
			const seenNotifs = /* @__PURE__ */ new Map();
			for (const n of notifications) {
				const k = `${n.title.trim().toLowerCase()}|${n.body.trim().toLowerCase()}`;
				if (!seenNotifs.has(k)) {
					seenNotifs.set(k, n);
					dedupedNotifs.push(n);
				}
			}
			notifications = sortNotifications(dedupedNotifs);
			const nextState = {
				...state,
				payments: updatedPayments,
				orders: updatedOrders,
				notifications
			};
			localStorage.setItem(key, JSON.stringify(nextState));
			window.dispatchEvent(new Event("buzzhub:customer-store"));
			window.dispatchEvent(new Event("storage"));
		} catch (error) {
			console.error("Gagal memperbarui notifikasi penolakan pesanan customer di localStorage:", error);
		}
	}
}
var formatIDR = (n) => new Intl.NumberFormat("id-ID", {
	style: "currency",
	currency: "IDR",
	maximumFractionDigits: 0
}).format(n);
var POPULAR_BANKS = [
	"BCA",
	"BRI",
	"Mandiri",
	"BNI",
	"BSI",
	"CIMB Niaga",
	"Permata",
	"Danamon",
	"Seabank",
	"Bank Jago",
	"BTPN / Jenius"
];
var DEFAULT_ADMIN_BANKS = [
	{
		id: "bank-bca-default",
		bankName: "BCA",
		accountNumber: "8830192831",
		accountHolder: "PT BuzzConnect Indonesia",
		isActive: true,
		createdAt: "2026-09-01T00:00:00Z",
		updatedAt: "2026-09-01T00:00:00Z"
	},
	{
		id: "bank-bri-default",
		bankName: "BRI",
		accountNumber: "020601002345501",
		accountHolder: "PT BuzzConnect Indonesia",
		isActive: true,
		createdAt: "2026-09-01T00:00:00Z",
		updatedAt: "2026-09-01T00:00:00Z"
	},
	{
		id: "bank-mandiri-default",
		bankName: "Mandiri",
		accountNumber: "1370019283741",
		accountHolder: "PT BuzzConnect Indonesia",
		isActive: true,
		createdAt: "2026-09-01T00:00:00Z",
		updatedAt: "2026-09-01T00:00:00Z"
	},
	{
		id: "bank-bni-default",
		bankName: "BNI",
		accountNumber: "0928374615",
		accountHolder: "PT BuzzConnect Indonesia",
		isActive: true,
		createdAt: "2026-09-01T00:00:00Z",
		updatedAt: "2026-09-01T00:00:00Z"
	}
];
var STORAGE_KEY$1 = "buzz_admin_bank_accounts";
var EVENT_KEY$1 = "buzz_admin_bank_accounts_change";
var CACHE$1 = [];
var VERSION$1 = 0;
var listeners$1 = /* @__PURE__ */ new Set();
function notify() {
	VERSION$1 += 1;
	listeners$1.forEach((l) => l());
}
function emit$1() {
	notify();
	if (typeof window !== "undefined") window.dispatchEvent(new Event(EVENT_KEY$1));
}
function subscribe$1(cb) {
	listeners$1.add(cb);
	return () => {
		listeners$1.delete(cb);
	};
}
function loadFromLocal$1() {
	if (typeof window === "undefined") return DEFAULT_ADMIN_BANKS;
	try {
		const raw = localStorage.getItem(STORAGE_KEY$1);
		if (raw) {
			const parsed = JSON.parse(raw);
			if (Array.isArray(parsed) && parsed.length > 0) return parsed;
		}
	} catch {}
	return DEFAULT_ADMIN_BANKS;
}
function saveToLocal$1(banks) {
	if (typeof window === "undefined") return;
	try {
		localStorage.setItem(STORAGE_KEY$1, JSON.stringify(banks));
	} catch {}
}
if (typeof window !== "undefined") CACHE$1 = loadFromLocal$1();
else CACHE$1 = DEFAULT_ADMIN_BANKS;
/**
* Fetch bank accounts from Supabase (or fallback storage in app_accounts/local).
*/
async function fetchAdminBankAccounts() {
	if (!isSupabaseConfigured() || !supabase) return CACHE$1;
	try {
		const { data, error } = await supabase.from("admin_bank_accounts").select("*").order("created_at", { ascending: true });
		if (!error && Array.isArray(data) && data.length > 0) {
			const mapped = data.map((row) => ({
				id: String(row.id),
				bankName: String(row.bank_name || row.bankName),
				accountNumber: String(row.account_number || row.accountNumber),
				accountHolder: String(row.account_holder || row.accountHolder),
				isActive: Boolean(row.is_active ?? row.isActive ?? true),
				createdAt: row.created_at || (/* @__PURE__ */ new Date()).toISOString(),
				updatedAt: row.updated_at || (/* @__PURE__ */ new Date()).toISOString()
			}));
			CACHE$1 = mapped;
			saveToLocal$1(mapped);
			emit$1();
			return mapped;
		}
		const { data: adminRow } = await supabase.from("app_accounts").select("bio").eq("role", "admin").maybeSingle();
		if (adminRow?.bio && adminRow.bio.startsWith("[{") && adminRow.bio.includes("bankName")) {
			const parsed = JSON.parse(adminRow.bio);
			if (Array.isArray(parsed) && parsed.length > 0) {
				CACHE$1 = parsed;
				saveToLocal$1(parsed);
				emit$1();
				return parsed;
			}
		}
		if (!adminRow?.bio || !adminRow.bio.includes("bankName")) {
			const defaults = DEFAULT_ADMIN_BANKS;
			supabase.from("app_accounts").update({ bio: JSON.stringify(defaults) }).eq("role", "admin");
			CACHE$1 = defaults;
			saveToLocal$1(defaults);
			emit$1();
			return defaults;
		}
	} catch (err) {
		console.warn("fetchAdminBankAccounts fallback:", err);
	}
	return CACHE$1;
}
/**
* Persist bank accounts list to Supabase and cache.
*/
async function syncAccountsToDatabase(accounts) {
	CACHE$1 = accounts;
	saveToLocal$1(accounts);
	emit$1();
	if (!isSupabaseConfigured() || !supabase) return;
	try {
		const dbRows = accounts.map((a) => ({
			id: a.id,
			bank_name: a.bankName,
			account_number: a.accountNumber,
			account_holder: a.accountHolder,
			is_active: a.isActive,
			updated_at: (/* @__PURE__ */ new Date()).toISOString()
		}));
		const { error } = await supabase.from("admin_bank_accounts").upsert(dbRows, { onConflict: "id" });
		await supabase.from("app_accounts").update({ bio: JSON.stringify(accounts) }).eq("role", "admin");
		if (error) console.warn("admin_bank_accounts table sync warning (using app_accounts fallback):", error.message);
	} catch (err) {
		console.warn("syncAccountsToDatabase error:", err);
	}
}
async function createAdminBankAccount(input) {
	const newAccount = {
		id: `bank-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
		bankName: input.bankName.trim(),
		accountNumber: input.accountNumber.trim(),
		accountHolder: input.accountHolder.trim(),
		isActive: input.isActive ?? true,
		createdAt: (/* @__PURE__ */ new Date()).toISOString(),
		updatedAt: (/* @__PURE__ */ new Date()).toISOString()
	};
	await syncAccountsToDatabase([...CACHE$1, newAccount]);
	return newAccount;
}
async function updateAdminBankAccount(id, patch) {
	if (!CACHE$1.find((a) => a.id === id)) return false;
	await syncAccountsToDatabase(CACHE$1.map((a) => a.id === id ? {
		...a,
		...patch,
		updatedAt: (/* @__PURE__ */ new Date()).toISOString()
	} : a));
	return true;
}
async function deleteAdminBankAccount(id) {
	await syncAccountsToDatabase(CACHE$1.filter((a) => a.id !== id));
	if (isSupabaseConfigured() && supabase) try {
		await supabase.from("admin_bank_accounts").delete().eq("id", id);
	} catch {}
	return true;
}
async function toggleAdminBankAccount(id, isActive) {
	return updateAdminBankAccount(id, { isActive });
}
function useAdminBankAccounts() {
	(0, import_react.useSyncExternalStore)(subscribe$1, () => VERSION$1, () => 0);
	const [loading, setLoading] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		let active = true;
		setLoading(true);
		fetchAdminBankAccounts().finally(() => {
			if (active) setLoading(false);
		});
		const handler = () => {
			CACHE$1 = loadFromLocal$1();
			notify();
		};
		window.addEventListener(EVENT_KEY$1, handler);
		window.addEventListener("storage", handler);
		return () => {
			active = false;
			window.removeEventListener(EVENT_KEY$1, handler);
			window.removeEventListener("storage", handler);
		};
	}, []);
	const activeAccounts = CACHE$1.filter((a) => a.isActive);
	return {
		accounts: CACHE$1,
		activeAccounts,
		loading,
		addAccount: createAdminBankAccount,
		updateAccount: updateAdminBankAccount,
		deleteAccount: deleteAdminBankAccount,
		toggleActive: toggleAdminBankAccount,
		refetch: fetchAdminBankAccounts
	};
}
var DEFAULT_QRIS_SETTINGS = {
	isEnabled: true,
	imageUrl: "/qris-merchant-buzzpro.png",
	merchantName: "BUZZPRO / BuzzHub",
	updatedAt: "2026-09-01T00:00:00Z"
};
var STORAGE_KEY = "buzz_admin_qris_settings";
var EVENT_KEY = "buzz_admin_qris_settings_change";
var CACHE = DEFAULT_QRIS_SETTINGS;
var VERSION = 0;
var listeners = /* @__PURE__ */ new Set();
function emit() {
	VERSION += 1;
	listeners.forEach((l) => l());
	if (typeof window !== "undefined") window.dispatchEvent(new Event(EVENT_KEY));
}
function subscribe(cb) {
	listeners.add(cb);
	return () => {
		listeners.delete(cb);
	};
}
function loadFromLocal() {
	if (typeof window === "undefined") return DEFAULT_QRIS_SETTINGS;
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (raw) {
			const parsed = JSON.parse(raw);
			if (typeof parsed === "object" && parsed !== null) return {
				isEnabled: parsed.isEnabled ?? true,
				imageUrl: parsed.imageUrl === void 0 ? DEFAULT_QRIS_SETTINGS.imageUrl : parsed.imageUrl,
				merchantName: parsed.merchantName || DEFAULT_QRIS_SETTINGS.merchantName,
				updatedAt: parsed.updatedAt || (/* @__PURE__ */ new Date()).toISOString()
			};
		}
	} catch {}
	return DEFAULT_QRIS_SETTINGS;
}
function saveToLocal(settings) {
	if (typeof window === "undefined") return;
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
	} catch {}
}
if (typeof window !== "undefined") CACHE = loadFromLocal();
/** Hook to manage QRIS settings for customer checkout and admin control */
function useQrisSettings() {
	const [loading, setLoading] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (typeof window === "undefined") return;
		const handleStorage = (e) => {
			if (e.key === STORAGE_KEY) {
				CACHE = loadFromLocal();
				emit();
			}
		};
		const handleCustom = () => {
			CACHE = loadFromLocal();
		};
		window.addEventListener("storage", handleStorage);
		window.addEventListener(EVENT_KEY, handleCustom);
		CACHE = loadFromLocal();
		emit();
		return () => {
			window.removeEventListener("storage", handleStorage);
			window.removeEventListener(EVENT_KEY, handleCustom);
		};
	}, []);
	const settings = (0, import_react.useSyncExternalStore)(subscribe, () => CACHE, () => DEFAULT_QRIS_SETTINGS);
	const updateSettings = async (patch) => {
		setLoading(true);
		try {
			const updated = {
				...CACHE,
				...patch,
				updatedAt: (/* @__PURE__ */ new Date()).toISOString()
			};
			CACHE = updated;
			saveToLocal(updated);
			emit();
			if (isSupabaseConfigured()) try {
				const { data: adminUser } = await supabase.from("app_accounts").select("email, bio").eq("role", "admin").limit(1).maybeSingle();
				if (adminUser?.email) {
					let bioObj = {};
					try {
						if (adminUser.bio && adminUser.bio.startsWith("{")) bioObj = JSON.parse(adminUser.bio);
					} catch {}
					bioObj._qrisSettings = updated;
					await supabase.from("app_accounts").update({ bio: JSON.stringify(bioObj) }).eq("email", adminUser.email);
				}
			} catch {}
		} finally {
			setLoading(false);
		}
	};
	const uploadQrisImage = async (file) => {
		if (!file.type.startsWith("image/")) throw new Error("File harus berupa gambar (PNG, JPG, JPEG, WEBP)");
		if (file.size > 5242880) throw new Error("Ukuran gambar maksimal 5 MB");
		const dataUrl = await new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.onload = () => resolve(reader.result);
			reader.onerror = () => reject(/* @__PURE__ */ new Error("Gagal membaca file gambar"));
			reader.readAsDataURL(file);
		});
		await updateSettings({
			imageUrl: dataUrl,
			isEnabled: true
		});
		return dataUrl;
	};
	const removeQrisImage = async () => {
		await updateSettings({ imageUrl: null });
	};
	const toggleQris = async (isEnabled) => {
		await updateSettings({ isEnabled });
	};
	return {
		settings,
		isEnabled: settings.isEnabled && !!settings.imageUrl,
		imageUrl: settings.imageUrl,
		merchantName: settings.merchantName,
		loading,
		updateSettings,
		uploadQrisImage,
		removeQrisImage,
		toggleQris
	};
}
/**
* Menahan error render pada satu section dashboard supaya tidak
* membuat seluruh halaman menampilkan "This page didn't load".
*/
var SectionErrorBoundary = class extends import_react.Component {
	state = { error: null };
	static getDerivedStateFromError(error) {
		return { error };
	}
	componentDidCatch(error) {
		console.error("[SectionErrorBoundary]", error);
		reportLovableError(error, { boundary: "admin_section" });
	}
	render() {
		const { error } = this.state;
		if (!error) return this.props.children;
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-2xl border border-border bg-card p-8 text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-amber-500/10 text-amber-600",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-5 w-5" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "font-display text-lg font-bold",
					children: this.props.title ?? "Bagian ini gagal dimuat"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mx-auto mt-1 max-w-md text-sm text-muted-foreground",
					children: "Terjadi kesalahan saat menampilkan data. Coba muat ulang bagian ini."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mx-auto mt-2 max-w-md break-words text-xs text-muted-foreground/70",
					children: error.message
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					className: "mt-4",
					variant: "outline",
					onClick: () => this.setState({ error: null }),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "mr-1 h-4 w-4" }), " Coba lagi"]
				})
			]
		});
	}
};
//#endregion
export { SectionErrorBoundary as a, notifyCustomerPaymentRejected as c, useQrisSettings as d, SERVICES as i, useAdminBankAccounts as l, CAMPAIGN_TYPES as n, formatIDR as o, POPULAR_BANKS as r, notifyCustomerPaymentApproved as s, BuzzerNameLink as t, useCustomerStore as u };
