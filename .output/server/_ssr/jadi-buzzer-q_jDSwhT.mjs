import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { L as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as Button } from "./button-BkEeRci-.mjs";
import { D as Rocket, Gt as ArrowLeft, St as Coins, Vt as BadgeCheck, Wt as ArrowRight, b as ShieldCheck, i as Users, u as TrendingUp } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/jadi-buzzer-q_jDSwhT.js
var import_jsx_runtime = require_jsx_runtime();
var buzzer_hero_default = "/assets/buzzer-hero-CoFDFzLA.jpg";
var BENEFITS = [
	{
		i: Coins,
		t: "Penghasilan transparan",
		d: "Payout per job ditentukan level Anda dan terlihat sebelum job diambil."
	},
	{
		i: ShieldCheck,
		t: "Pembayaran aman",
		d: "Dana masuk ke dompet dan bisa dicairkan setelah pekerjaan disetujui."
	},
	{
		i: TrendingUp,
		t: "Level naik, payout naik",
		d: "Semakin besar followers terverifikasi, semakin tinggi nilai job Anda."
	},
	{
		i: Users,
		t: "Brand berkualitas",
		d: "Job datang dari kampanye brand yang sudah terverifikasi admin."
	}
];
var STEPS = [
	{
		n: "01",
		t: "Daftar & isi akun sosial",
		d: "Lengkapi data diri dan tambahkan akun media sosial beserta jumlah followers."
	},
	{
		n: "02",
		t: "Verifikasi admin",
		d: "Admin mengecek keaslian akun lalu menetapkan level buzzer Anda."
	},
	{
		n: "03",
		t: "Ambil job",
		d: "Pilih job kampanye yang tersedia sesuai platform dan brief brand."
	},
	{
		n: "04",
		t: "Kirim bukti & cairkan",
		d: "Unggah bukti pengerjaan, disetujui, lalu ajukan pencairan dana."
	}
];
var LEVELS = [
	{
		emoji: "🥉",
		name: "Bronze",
		range: "0 – 10.000 followers"
	},
	{
		emoji: "🥈",
		name: "Silver",
		range: "10.001 – 50.000 followers"
	},
	{
		emoji: "🥇",
		name: "Gold",
		range: "50.001 – 100.000 followers"
	},
	{
		emoji: "💎",
		name: "Platinum",
		range: "100.001 – 500.000 followers"
	},
	{
		emoji: "👑",
		name: "Diamond",
		range: "500.000+ followers"
	}
];
function JadiBuzzerPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "relative overflow-hidden border-b border-border",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: buzzer_hero_default,
					alt: "Kreator konten sedang membuat konten kampanye brand",
					className: "absolute inset-0 h-full w-full object-cover opacity-20",
					loading: "lazy"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							variant: "ghost",
							size: "sm",
							className: "-ml-2 mb-6 text-muted-foreground hover:text-foreground",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "mr-1 h-4 w-4" }), " Kembali ke Beranda"]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Rocket, { className: "h-3.5 w-3.5 text-brand" }), " Program Buzzer BuzzHub"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
							className: "mt-5 max-w-3xl font-display text-4xl font-bold leading-tight sm:text-6xl",
							children: ["Ubah pengaruh Anda jadi ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-gradient-brand",
								children: "penghasilan"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 max-w-xl text-lg text-muted-foreground",
							children: "Bergabunglah dengan jaringan buzzer terverifikasi. Ambil job dari brand, kerjakan sesuai brief, dan dapatkan bayaran sesuai level Anda."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-8 flex flex-wrap gap-3",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								asChild: true,
								size: "lg",
								className: "gradient-brand text-brand-foreground hover:opacity-90",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/register/buzzer",
									children: ["Daftar jadi Buzzer ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "ml-1 h-4 w-4" })]
								})
							})
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mx-auto max-w-6xl px-4 py-16 sm:px-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-3xl font-bold",
					children: "Kenapa jadi buzzer di BuzzHub?"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4",
					children: BENEFITS.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-border bg-card p-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "inline-flex h-10 w-10 items-center justify-center rounded-lg gradient-brand text-brand-foreground",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(b.i, { className: "h-5 w-5" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "mt-3 font-display text-lg font-bold",
								children: b.t
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm text-muted-foreground",
								children: b.d
							})
						]
					}, b.t))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "border-y border-border bg-accent/30",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto max-w-6xl px-4 py-16 sm:px-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-3xl font-bold",
						children: "Cara kerjanya"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4",
						children: STEPS.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-2xl border border-border bg-card p-5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-display text-2xl font-bold text-gradient-brand",
									children: s.n
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "mt-2 font-display text-lg font-bold",
									children: s.t
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-sm text-muted-foreground",
									children: s.d
								})
							]
						}, s.n))
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mx-auto max-w-6xl px-4 py-16 sm:px-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-3xl font-bold",
						children: "Sistem level buzzer"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 max-w-2xl text-muted-foreground",
						children: "Level ditentukan dari total followers akun media sosial yang telah diverifikasi admin. Nominal payout tiap level diatur oleh admin."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5",
						children: LEVELS.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-2xl border border-border bg-card p-5 text-center",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-3xl",
									children: l.emoji
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "mt-2 font-display text-lg font-bold",
									children: l.name
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-sm text-muted-foreground",
									children: l.range
								})
							]
						}, l.name))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-6 flex items-center gap-2 text-sm text-muted-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BadgeCheck, { className: "h-4 w-4 text-brand" }), " Level ditetapkan admin saat verifikasi dan tidak berubah otomatis."]
					})
				]
			})
		]
	});
}
//#endregion
export { JadiBuzzerPage as component };
