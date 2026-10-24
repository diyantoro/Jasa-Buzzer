import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { L as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { n as supabase } from "./client-DwoA1QoZ.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { t as Button } from "./button-BkEeRci-.mjs";
import { n as Label, t as Input } from "./label-B7oQAA24.mjs";
import { At as ChevronRight, B as Music2, C as Send, Ct as Clock, Dt as CircleCheck, Et as CircleX, Ht as AtSign, It as Camera, M as Plus, Ot as CircleAlert, Q as Link2, X as LoaderCircle, Y as Lock, Z as Linkedin, c as Twitter, d as Trash2, ft as Facebook, ht as ExternalLink, i as Users, it as Image, j as Power, jt as ChevronLeft, lt as FileText, nt as Instagram, pt as Eye, s as Upload, t as Youtube, w as Search } from "../_libs/lucide-react.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, s as Textarea, t as Dialog } from "./dialog-BQPGZ99x.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-Dg1urBTx.mjs";
import { a as levelProgress, c as useBuzzerLevel, i as levelFromFollowers, l as useBuzzerLevels, n as countedFollowers, o as nextLevel } from "./buzzer-level-B8egucK7.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { g as notifySocialAccountSubmitted, i as formatIDR$1 } from "./router-BuTnQWI2.mjs";
import { n as AvatarFallback, r as AvatarImage, t as Avatar } from "./table-C9Hv1VxK.mjs";
import { g as StatCard, v as Switch } from "./export-utils-Bse6Ov51.mjs";
import { a as setSession, r as getSession } from "./auth-CNL2N2Mo.mjs";
import { S as useSocialAccounts, d as buzzerUpdateAccount, h as getSocialProfileUrl, t as SOCIAL_PLATFORMS, u as buzzerDeactivateAccount } from "./buzzer-verification-COVCzkVL.mjs";
import { i as Trigger, n as List, r as Root2, t as Content } from "../_libs/radix-ui__react-tabs.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tabs-Bqo-fbNA.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var BUCKET$1 = "bukti-pengerjaan";
var ONE_YEAR = 31536e3;
var ALLOWED_TYPES = /* @__PURE__ */ new Set([
	"image/jpeg",
	"image/png",
	"image/webp",
	"application/pdf"
]);
/**
* Unggah screenshot atau file PDF bukti pengerjaan buzzer ke penyimpanan dan
* kembalikan signed URL yang bisa langsung dipakai customer.
*/
async function uploadProofScreenshot(file) {
	if (!(file instanceof File)) throw new Error("File bukti tidak terbaca.");
	const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
	if (!ALLOWED_TYPES.has(file.type) && !isPdf) throw new Error("Format bukti harus JPG, PNG, WEBP, atau PDF.");
	if (file.size <= 0) throw new Error("File bukti kosong.");
	const ext = isPdf ? "pdf" : {
		"image/jpeg": "jpg",
		"image/png": "png",
		"image/webp": "webp",
		"application/pdf": "pdf"
	}[file.type] || "jpg";
	const contentType = isPdf ? "application/pdf" : file.type || "image/jpeg";
	const path = `proofs/${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}/${crypto.randomUUID()}.${ext}`;
	const { data: uploaded, error } = await supabase.storage.from(BUCKET$1).upload(path, file, {
		cacheControl: "3600",
		upsert: false,
		contentType
	});
	if (error) {
		console.error("[Proof Upload] Supabase Storage upload error:", error);
		throw error;
	}
	if (!uploaded?.path) {
		const uploadError = /* @__PURE__ */ new Error("Supabase tidak mengembalikan path file bukti.");
		console.error("[Proof Upload] Invalid upload response:", uploaded);
		throw uploadError;
	}
	const { data, error: signErr } = await supabase.storage.from(BUCKET$1).createSignedUrl(uploaded.path, ONE_YEAR);
	if (signErr || !data?.signedUrl) {
		console.error("[Proof Upload] Supabase Storage signed URL error:", signErr);
		throw signErr ?? /* @__PURE__ */ new Error("Gagal membuat URL bukti");
	}
	return data.signedUrl;
}
var PLATFORM_ICON = {
	"Instagram": /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Instagram, { className: "h-4 w-4" }),
	"TikTok": /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Music2, { className: "h-4 w-4" }),
	"Facebook": /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Facebook, { className: "h-4 w-4" }),
	"X (Twitter)": /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Twitter, { className: "h-4 w-4" }),
	"YouTube": /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Youtube, { className: "h-4 w-4" }),
	"LinkedIn": /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Linkedin, { className: "h-4 w-4" }),
	"Threads": /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AtSign, { className: "h-4 w-4" }),
	"Telegram": /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "h-4 w-4" })
};
var PLATFORM_COLOR = {
	"Instagram": "from-pink-500 to-orange-500",
	"TikTok": "from-zinc-800 to-zinc-600",
	"Facebook": "from-blue-600 to-blue-400",
	"X (Twitter)": "from-zinc-900 to-zinc-700",
	"YouTube": "from-red-600 to-red-400",
	"LinkedIn": "from-blue-700 to-blue-500",
	"Threads": "from-neutral-800 to-neutral-600",
	"Telegram": "from-sky-500 to-cyan-400"
};
var CATEGORIES = [
	"Lifestyle",
	"Kuliner",
	"Fashion",
	"Hiburan",
	"Edukasi",
	"Teknologi",
	"Review",
	"Opini",
	"Gaming",
	"Bisnis",
	"Kesehatan"
];
function SosmedSection({ email, name }) {
	const store = useSocialAccounts(email, name);
	const lv = useBuzzerLevel(email);
	const [q, setQ] = (0, import_react.useState)("");
	const [sortDesc, setSortDesc] = (0, import_react.useState)(true);
	const [viewing, setViewing] = (0, import_react.useState)(null);
	const [adding, setAdding] = (0, import_react.useState)(false);
	const [pembaruanAccount, setPembaruanAccount] = (0, import_react.useState)(null);
	const [deactivateAccount, setDeactivateAccount] = (0, import_react.useState)(null);
	const filtered = (0, import_react.useMemo)(() => {
		let arr = store.accounts.slice();
		if (q.trim()) {
			const s = q.trim().toLowerCase();
			arr = arr.filter((a) => a.username.toLowerCase().includes(s) || a.accountName.toLowerCase().includes(s) || a.platform.toLowerCase().includes(s) || a.category.toLowerCase().includes(s));
		}
		arr.sort((a, b) => sortDesc ? b.followers - a.followers : a.followers - b.followers);
		return arr;
	}, [
		store.accounts,
		q,
		sortDesc
	]);
	const total = store.accounts.length;
	const totalFollowers = store.accounts.reduce((s, a) => s + a.followers, 0);
	const activeCount = store.accounts.filter((a) => a.isActive && a.verification === "Terverifikasi").length;
	const pendingCount = store.accounts.filter((a) => a.verification === "Menunggu" || a.pendingVerification === "Menunggu").length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LevelCard, {
				email,
				name
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3 sm:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Akun Saya",
						value: total.toString(),
						hint: "Total akun terhubung",
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link2, { className: "h-5 w-5" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Total Followers",
						value: totalFollowers.toLocaleString("id-ID"),
						hint: `${lv.followers.toLocaleString("id-ID")} dihitung untuk level`,
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "h-5 w-5" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Akun Aktif",
						value: activeCount.toString(),
						hint: pendingCount > 0 ? `${pendingCount} menunggu verifikasi` : `${total - activeCount} nonaktif`,
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Power, { className: "h-5 w-5" })
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-muted/40 p-3 text-sm text-muted-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "mr-2 inline h-4 w-4" }), "Akun yang ditambahkan perlu diverifikasi admin sebelum aktif untuk campaign."] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					size: "sm",
					className: "gradient-brand text-brand-foreground",
					onClick: () => setAdding(true),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "mr-1 h-4 w-4" }), " Tambah Akun"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "rounded-2xl border border-border bg-card p-3 sm:p-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto_auto] sm:items-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: q,
							onChange: (e) => setQ(e.target.value),
							placeholder: "Cari akun saya...",
							className: "pl-9"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						onClick: () => setSortDesc((v) => !v),
						className: "whitespace-nowrap",
						children: ["Followers ", sortDesc ? "↓" : "↑"]
					})]
				})
			}),
			filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid place-items-center rounded-2xl border border-dashed border-border bg-card/50 p-10 text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mb-3 grid h-14 w-14 place-items-center rounded-full bg-muted text-muted-foreground",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link2, { className: "h-6 w-6" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-semibold",
						children: "Belum ada akun sosial media"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 max-w-sm text-sm text-muted-foreground",
						children: "Tambahkan akun media sosialmu. Akun yang ditambahkan akan diverifikasi admin sebelum bisa digunakan untuk mengambil job."
					})
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-4 sm:grid-cols-2 xl:grid-cols-3",
				children: filtered.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccountCard, {
					acc: a,
					onView: () => setViewing(a),
					onPembaruan: () => setPembaruanAccount(a),
					onDeactivate: () => setDeactivateAccount(a)
				}, a.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: !!viewing,
				onOpenChange: (o) => !o && setViewing(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogContent, {
					className: "sm:max-w-md",
					children: viewing && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: cn("-mx-6 -mt-6 mb-2 h-24 rounded-t-lg bg-gradient-to-br", PLATFORM_COLOR[viewing.platform]) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
							className: "flex items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Avatar, {
								className: "h-12 w-12",
								children: [viewing.photoUrl && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarImage, { src: viewing.photoUrl }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarFallback, {
									className: "gradient-brand text-brand-foreground",
									children: viewing.accountName.split(" ").map((n) => n[0]).join("").slice(0, 2)
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "truncate",
									children: viewing.accountName
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "truncate text-xs font-normal text-muted-foreground",
									children: [
										viewing.username,
										" · ",
										viewing.platform
									]
								})]
							})]
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-3 gap-2 rounded-xl border border-border p-3 text-center",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
									label: "Followers",
									value: viewing.followers.toLocaleString("id-ID")
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
									label: "Following",
									value: viewing.following.toLocaleString("id-ID")
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
									label: "Postingan",
									value: viewing.posts.toLocaleString("id-ID")
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2 text-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
									label: "Kategori",
									value: viewing.category
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
									label: "Link Profil",
									value: getSocialProfileUrl(viewing) ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
										href: getSocialProfileUrl(viewing),
										target: "_blank",
										rel: "noreferrer",
										className: "inline-flex max-w-[240px] items-center gap-1 truncate font-mono text-xs text-primary hover:underline",
										title: getSocialProfileUrl(viewing),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "truncate",
											children: viewing.profileUrl
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "h-3 w-3 shrink-0" })]
									}) : "-"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
									label: "Status",
									value: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VerifBadge, { s: viewing.pendingVerification ?? viewing.verification })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
									label: "Aktif",
									value: viewing.rejectionNote?.includes("[Permintaan Nonaktif/Hapus]") ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-semibold text-amber-600 dark:text-amber-400",
										children: "Menunggu Persetujuan Admin (Tetap Aktif)"
									}) : viewing.isActive ? "Ya" : "Tidak"
								}),
								viewing.bio && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
									label: "Bio",
									value: viewing.bio
								}),
								viewing.rejectionNote && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
									label: viewing.rejectionNote.includes("[Permintaan Nonaktif/Hapus]") ? "Permintaan" : "Catatan",
									value: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: viewing.rejectionNote.includes("[Permintaan Nonaktif/Hapus]") ? "text-amber-600 dark:text-amber-400 font-medium" : "text-rose-500",
										children: viewing.rejectionNote
									})
								}),
								viewing.pendingRejectionNote && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
									label: "Catatan Penolakan Pembaruan",
									value: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-rose-500 font-medium",
										children: viewing.pendingRejectionNote
									})
								}),
								viewing.pendingVerification && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
									label: "Pengajuan",
									value: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VerifBadge, { s: viewing.pendingVerification })
								}),
								viewing.pendingFollowers != null && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
									label: "Followers diajukan",
									value: viewing.pendingFollowers.toLocaleString("id-ID")
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
							className: "flex-wrap gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "outline",
								onClick: () => {
									const target = viewing;
									setViewing(null);
									setPembaruanAccount(target);
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "mr-1 h-4 w-4" }), " Pembaruan"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "outline",
								onClick: () => {
									const profileUrl = getSocialProfileUrl(viewing);
									if (!profileUrl) {
										toast.error(viewing.profileUrl.trim() ? "URL profil media sosial tidak valid." : "Link profil media sosial belum tersedia.");
										return;
									}
									window.open(profileUrl, "_blank", "noopener,noreferrer");
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "mr-1 h-4 w-4" }), " Buka Profil"]
							})]
						})
					] })
				})
			}),
			adding && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BuzzerAddAccountDialog, {
				existing: store.accounts,
				onClose: () => setAdding(false),
				onSubmit: async (data) => {
					if (!await store.add({
						...data,
						isActive: false
					})) {
						toast.error("Akun gagal diajukan. Periksa data atau akun yang sama.");
						return false;
					}
					toast.success("Akun diajukan dan menunggu verifikasi admin.");
					notifySocialAccountSubmitted({
						buzzerEmail: email,
						platform: data.platform,
						username: data.username,
						action: "tambah"
					});
					setAdding(false);
					return true;
				}
			}),
			pembaruanAccount && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BuzzerPembaruanDialog, {
				account: pembaruanAccount,
				existing: store.accounts,
				email,
				onClose: () => setPembaruanAccount(null)
			}),
			deactivateAccount && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BuzzerDeactivateDialog, {
				account: deactivateAccount,
				email,
				onClose: () => setDeactivateAccount(null)
			})
		]
	});
}
function LevelCard({ email, name, simple = false }) {
	const lv = useBuzzerLevel(email);
	const levels = useBuzzerLevels();
	const { accounts } = useSocialAccounts(email, name);
	const verifiedFollowers = countedFollowers(accounts);
	const derived = levelFromFollowers(verifiedFollowers, levels);
	const level = lv.level ?? (verifiedFollowers > 0 ? derived : null);
	const followers = lv.level ? lv.followers : verifiedFollowers;
	const next = nextLevel(followers, levels);
	const progress = levelProgress(followers, levels);
	const [openLevels, setOpenLevels] = (0, import_react.useState)(false);
	const grid = /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid grid-cols-2 gap-2 sm:grid-cols-5",
		children: levels.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: cn("rounded-lg border p-2 text-center text-xs", l.name === level?.name ? "border-transparent gradient-brand text-brand-foreground" : "border-border text-muted-foreground"),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "font-semibold",
				children: [
					l.emoji,
					" ",
					l.name
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-[10px]",
				children: [
					compact(l.minFollowers),
					"+ · ",
					l.payout > 0 ? formatIDR$1(l.payout) : "—"
				]
			})]
		}, l.name))
	});
	const openDetail = () => setOpenLevels(true);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "group cursor-pointer rounded-2xl border border-border bg-card p-3 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md sm:p-4",
		role: "button",
		tabIndex: 0,
		onClick: openDetail,
		onKeyDown: (event) => {
			if (event.key === "Enter" || event.key === " ") {
				event.preventDefault();
				openDetail();
			}
		},
		"aria-label": "Lihat detail Level Buzzer",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex min-w-0 items-center gap-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-muted text-xl",
					children: level?.emoji ?? "⏳"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0 flex-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs uppercase tracking-wide text-muted-foreground",
						children: "Level Buzzer"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "truncate font-display text-lg font-bold",
						children: level?.name ?? "Belum ditetapkan"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "hidden shrink-0 text-right sm:block",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: "Bayaran per Job"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display font-bold text-gradient-brand",
						children: level && level.payout > 0 ? formatIDR$1(level.payout) : "—"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-5 w-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" })
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-2 flex min-w-0 items-center justify-between gap-3 text-xs",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "truncate text-muted-foreground",
					children: [followers.toLocaleString("id-ID"), " Followers terverifikasi"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "shrink-0 text-muted-foreground sm:hidden",
					children: [level && level.payout > 0 ? formatIDR$1(level.payout) : "—", " / Job"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "link",
					size: "sm",
					className: "h-auto shrink-0 p-0 text-xs",
					onClick: (event) => {
						event.stopPropagation();
						openDetail();
					},
					children: "Lihat Detail"
				})
			]
		})]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open: openLevels,
		onOpenChange: setOpenLevels,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "max-h-[90vh] overflow-y-auto sm:max-w-lg",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Detail Level Buzzer" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Level ditentukan dari followers akun media sosial yang sudah diverifikasi admin." })] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3 rounded-xl border border-border bg-muted/40 p-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-background text-2xl",
							children: level?.emoji ?? "⏳"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground",
								children: "Level saat ini"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-display text-xl font-bold",
								children: level?.name ?? "Belum ditetapkan"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-right",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground",
								children: "Bayaran per Job"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-semibold text-gradient-brand",
								children: level && level.payout > 0 ? formatIDR$1(level.payout) : "—"
							})]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between gap-3 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted-foreground",
								children: "Followers terverifikasi"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-semibold",
								children: followers.toLocaleString("id-ID")
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between gap-3 text-xs text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Progress menuju level berikutnya" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: next ? `${(next.minFollowers - followers).toLocaleString("id-ID")} lagi ke ${next.name}` : "Level tertinggi tercapai" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-2 w-full overflow-hidden rounded-full bg-muted",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "h-full gradient-brand transition-all",
								style: { width: `${progress}%` }
							})
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-semibold",
						children: "Daftar Level Buzzer"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid gap-2",
						children: grid
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogFooter, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					onClick: () => setOpenLevels(false),
					children: "Tutup"
				}) })
			]
		})
	})] });
}
function LevelBadge({ followers, className }) {
	const levels = useBuzzerLevels();
	const l = levelFromFollowers(followers, levels);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold", l.badgeClass, className),
		children: [
			l.emoji,
			" ",
			l.name
		]
	});
}
function AccountCard({ acc, onView, onPembaruan, onDeactivate }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "group overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: cn("relative h-20 bg-gradient-to-br", PLATFORM_COLOR[acc.platform]),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-background/90 px-2 py-1 text-xs font-semibold text-foreground backdrop-blur",
				children: [
					PLATFORM_ICON[acc.platform],
					" ",
					acc.platform
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "absolute right-3 top-3",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VerifBadge, { s: acc.verification })
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "px-4 pb-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Avatar, {
						className: "-mt-8 h-16 w-16 shrink-0 border-4 border-card shadow-sm",
						children: [acc.photoUrl && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarImage, { src: acc.photoUrl }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarFallback, {
							className: "gradient-brand text-brand-foreground font-bold",
							children: acc.accountName.split(" ").map((n) => n[0]).join("").slice(0, 2)
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: cn("mt-2 shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold", acc.rejectionNote?.includes("[Permintaan Nonaktif/Hapus]") ? "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300" : acc.pendingVerification === "Menunggu" ? "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300" : acc.verification === "Menunggu" ? "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300" : acc.isActive ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300" : "bg-muted text-muted-foreground"),
						children: acc.rejectionNote?.includes("[Permintaan Nonaktif/Hapus]") ? "Menunggu Persetujuan Nonaktif" : acc.pendingVerification === "Menunggu" ? "Menunggu Pembaruan" : acc.verification === "Menunggu" ? "Belum Diverifikasi" : acc.isActive ? "Aktif" : "Nonaktif"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-2 min-w-0",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "truncate font-semibold text-base leading-tight text-foreground",
							children: acc.accountName
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "truncate text-xs text-muted-foreground mt-0.5",
							children: acc.username
						}),
						getSocialProfileUrl(acc) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
							href: getSocialProfileUrl(acc),
							target: "_blank",
							rel: "noreferrer",
							className: "mt-1.5 inline-flex max-w-full items-center gap-1.5 truncate text-[11px] text-primary hover:underline font-mono",
							title: getSocialProfileUrl(acc),
							onClick: (e) => e.stopPropagation(),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link2, { className: "h-3.5 w-3.5 shrink-0" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "truncate",
									children: acc.profileUrl
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "h-2.5 w-2.5 shrink-0" })
							]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-3 grid grid-cols-3 gap-2 rounded-xl bg-muted/40 p-2 text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
							label: "Followers",
							value: compact(acc.followers)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
							label: "Following",
							value: compact(acc.following)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
							label: "Post",
							value: compact(acc.posts)
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
					className: "mt-3 space-y-1.5 text-xs",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "text-muted-foreground",
								children: "Followers"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
								className: "font-semibold",
								children: acc.followers.toLocaleString("id-ID")
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "text-muted-foreground",
								children: "Status verifikasi"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VerifBadge, { s: acc.pendingVerification ?? acc.verification }) })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "text-muted-foreground",
								children: "Kategori"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
								className: "font-medium",
								children: acc.category
							})]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-3 flex flex-wrap items-center gap-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LevelBadge, { followers: acc.followers })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-3 flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						variant: "outline",
						className: "h-8 w-8 p-0",
						title: "Detail",
						"aria-label": "Detail",
						onClick: onView,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-3.5 w-3.5" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						size: "sm",
						variant: "outline",
						className: "flex-1",
						onClick: onPembaruan,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "mr-1 h-3.5 w-3.5" }), " Pembaruan"]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						size: "sm",
						variant: "outline",
						className: cn("w-full", acc.rejectionNote?.includes("[Permintaan Nonaktif/Hapus]") ? "text-amber-600 border-amber-200 dark:border-amber-900 opacity-80 cursor-not-allowed" : acc.verification === "Menunggu" ? "text-amber-600 border-amber-200 dark:border-amber-900 opacity-80 cursor-not-allowed" : !acc.isActive ? "text-muted-foreground border-border opacity-70 cursor-not-allowed" : "text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/30 border-rose-200 dark:border-rose-900"),
						onClick: acc.isActive && acc.verification === "Terverifikasi" ? onDeactivate : void 0,
						disabled: !acc.isActive || acc.verification === "Menunggu" || (acc.rejectionNote?.includes("[Permintaan Nonaktif/Hapus]") ?? false),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Power, { className: "mr-1 h-3.5 w-3.5" }), acc.rejectionNote?.includes("[Permintaan Nonaktif/Hapus]") ? "Menunggu Persetujuan Nonaktif" : acc.verification === "Menunggu" ? "Menunggu Verifikasi Admin" : !acc.isActive ? "Akun Dinonaktifkan" : "Nonaktifkan Akun"]
					})
				})
			]
		})]
	});
}
function BuzzerDeactivateDialog({ account, email, onClose }) {
	const [saving, setSaving] = (0, import_react.useState)(false);
	const [deactivateReason, setDeactivateReason] = (0, import_react.useState)(() => {
		if (account.rejectionNote?.includes("[Permintaan Nonaktif/Hapus]")) return account.rejectionNote.replace("[Permintaan Nonaktif/Hapus]: ", "").trim();
		return "";
	});
	const handleConfirmDeactivate = async () => {
		if (!deactivateReason.trim()) {
			toast.error("Alasan penonaktifan/penghapusan akun wajib diisi.");
			return;
		}
		setSaving(true);
		try {
			if (!await buzzerDeactivateAccount(email, account.id, deactivateReason.trim())) throw new Error("Gagal mengirim permintaan ke admin.");
			toast.success("Permintaan penonaktifan akun berhasil dikirim ke Admin dan sedang menunggu persetujuan.");
			notifySocialAccountSubmitted({
				buzzerEmail: email,
				platform: account.platform,
				username: account.username,
				action: "nonaktif"
			});
			onClose();
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Gagal mengirim permintaan.");
		} finally {
			setSaving(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open: true,
		onOpenChange: (o) => !o && !saving && onClose(),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "max-h-[90vh] overflow-y-auto sm:max-w-md",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Power, { className: "h-5 w-5 text-rose-500" }), "Minta Penonaktifan / Hapus Akun ke Admin"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Ajukan permintaan penonaktifan atau penghapusan akun media sosial ini kepada Admin." })] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-4 py-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3 rounded-xl border border-border bg-muted/40 p-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Avatar, {
								className: "h-11 w-11",
								children: [account.photoUrl && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarImage, { src: account.photoUrl }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarFallback, {
									className: "gradient-brand text-brand-foreground",
									children: (account.accountName || "AK").split(" ").map((n) => n[0]).join("").slice(0, 2)
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-semibold text-sm truncate",
									children: account.accountName
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs text-muted-foreground truncate",
									children: [
										account.username,
										" · ",
										account.platform
									]
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								className: "text-sm font-medium",
								children: "Alasan Penonaktifan / Penghapusan Akun *"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								rows: 3,
								value: deactivateReason,
								onChange: (e) => setDeactivateReason(e.target.value),
								placeholder: "Tuliskan alasan pengajuan (misal: ingin mengganti akun baru, akun sudah tidak aktif, dll)..."
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "h-4 w-4 shrink-0 mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Permintaan ini akan dikirim ke Admin untuk ditinjau. Akun ini akan tetap berstatus aktif sampai Admin menyetujui permintaan penonaktifan ini." })]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
					className: "gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						variant: "outline",
						onClick: onClose,
						disabled: saving,
						children: "Batal"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						type: "button",
						variant: "destructive",
						disabled: saving || !deactivateReason.trim(),
						onClick: handleConfirmDeactivate,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "mr-1.5 h-4 w-4" }),
							" ",
							saving ? "Mengirim..." : "Kirim Permintaan ke Admin"
						]
					})]
				})
			]
		})
	});
}
function BuzzerPembaruanDialog({ account, existing, email, onClose }) {
	const [form, setForm] = (0, import_react.useState)({
		platform: account.platform,
		username: account.username,
		accountName: account.accountName,
		profileUrl: account.profileUrl,
		followers: account.followers,
		following: account.following,
		posts: account.posts,
		category: account.category,
		bio: account.bio,
		photoUrl: account.photoUrl
	});
	const [proofFile, setProofFile] = (0, import_react.useState)(null);
	const [saving, setSaving] = (0, import_react.useState)(false);
	const [confirmOpen, setConfirmOpen] = (0, import_react.useState)(false);
	const onPhoto = (e) => {
		const f = e.target.files?.[0];
		if (!f) return;
		const reader = new FileReader();
		reader.onload = () => setForm((s) => ({
			...s,
			photoUrl: reader.result
		}));
		reader.readAsDataURL(f);
	};
	const followersChanged = Number(form.followers) !== Number(account.followers);
	const handlePreSubmit = () => {
		if (!form.username.trim()) {
			toast.error("Username wajib diisi");
			return;
		}
		if (!form.accountName.trim()) {
			toast.error("Nama akun wajib diisi");
			return;
		}
		try {
			const url = form.profileUrl.trim();
			if (!url) {
				toast.error("Link profil wajib diisi");
				return;
			}
			const test = new URL(url.startsWith("http") ? url : "https://" + url);
			if (!test.hostname || !test.hostname.includes(".")) throw new Error();
		} catch {
			toast.error("Link profil tidak valid (masukkan tautan URL profil lengkap)");
			return;
		}
		if (form.followers < 0 || form.following < 0 || form.posts < 0) {
			toast.error("Nilai angka tidak boleh negatif");
			return;
		}
		if (existing.some((x) => x.id !== account.id && x.platform === form.platform && x.username.trim().toLowerCase() === form.username.trim().toLowerCase())) {
			toast.error("Akun dengan username ini sudah terdaftar pada platform yang sama.");
			return;
		}
		if (followersChanged && !proofFile) {
			toast.error("Wajib mengunggah bukti screenshot followers jika jumlah followers diubah.");
			return;
		}
		setConfirmOpen(true);
	};
	const handleExecuteUpdate = async () => {
		setSaving(true);
		try {
			let pendingProofUrl = void 0;
			if (proofFile) pendingProofUrl = await uploadProofScreenshot(proofFile);
			const res = await buzzerUpdateAccount(email, account.id, {
				platform: form.platform,
				username: form.username,
				accountName: form.accountName,
				profileUrl: form.profileUrl.startsWith("http") ? form.profileUrl : "https://" + form.profileUrl,
				following: form.following,
				posts: form.posts,
				category: form.category,
				bio: form.bio,
				photoUrl: form.photoUrl,
				...followersChanged && pendingProofUrl ? {
					pendingFollowers: form.followers,
					pendingProofUrl
				} : {}
			});
			if (!res.ok) throw new Error(res.message || "Gagal memperbarui akun");
			toast.success("Pembaruan data akun berhasil dikirim dan menunggu verifikasi Admin.");
			notifySocialAccountSubmitted({
				buzzerEmail: email,
				platform: form.platform,
				username: form.username,
				action: "pembaruan"
			});
			setConfirmOpen(false);
			onClose();
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Gagal memperbarui akun");
		} finally {
			setSaving(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open: true,
		onOpenChange: (o) => !o && !saving && onClose(),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "max-h-[90vh] overflow-y-auto sm:max-w-lg",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "h-5 w-5 text-primary" }), "Pembaruan Akun Sosial Media"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Perbarui data akun media sosial Anda atau ajukan pembaruan followers." })] }),
				account.rejectionNote?.includes("[Permintaan Nonaktif/Hapus]") && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "h-4 w-4 shrink-0 mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-semibold",
						children: "Menunggu Persetujuan Admin (Permintaan Nonaktif / Hapus)"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-0.5 text-muted-foreground",
						children: ["Alasan: ", account.rejectionNote.replace("[Permintaan Nonaktif/Hapus]: ", "")]
					})] })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Avatar, {
								className: "h-16 w-16",
								children: [form.photoUrl && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarImage, { src: form.photoUrl }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarFallback, {
									className: "gradient-brand text-brand-foreground",
									children: (form.accountName || "AK").split(" ").map((n) => n[0]).join("").slice(0, 2)
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "inline-flex cursor-pointer items-center gap-2 rounded-md border border-input px-3 py-2 text-sm hover:bg-accent",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Camera, { className: "h-4 w-4" }),
									" Upload Foto",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "file",
										accept: "image/*",
										className: "hidden",
										onChange: onPhoto
									})
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-3 sm:grid-cols-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Platform" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: form.platform,
									onValueChange: (v) => setForm({
										...form,
										platform: v
									}),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: SOCIAL_PLATFORMS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: p,
										children: p
									}, p)) })]
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Kategori" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: form.category,
									onValueChange: (v) => setForm({
										...form,
										category: v
									}),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: CATEGORIES.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: c,
										children: c
									}, c)) })]
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Username *" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: form.username,
									onChange: (e) => setForm({
										...form,
										username: e.target.value
									}),
									placeholder: "@username"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Nama Akun *" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: form.accountName,
									onChange: (e) => setForm({
										...form,
										accountName: e.target.value
									}),
									placeholder: "Nama tampilan"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "sm:col-span-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Link Profil *" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: form.profileUrl,
										onChange: (e) => setForm({
											...form,
											profileUrl: e.target.value
										}),
										placeholder: "https://instagram.com/username"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Followers" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "number",
									min: 0,
									placeholder: "0",
									value: form.followers === 0 ? "" : form.followers,
									onFocus: (e) => {
										if (form.followers === 0) e.target.select();
									},
									onChange: (e) => {
										const val = e.target.value;
										setForm({
											...form,
											followers: val === "" ? 0 : Math.max(0, Number(val) || 0)
										});
									}
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Following" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "number",
									min: 0,
									placeholder: "0",
									value: form.following === 0 ? "" : form.following,
									onFocus: (e) => {
										if (form.following === 0) e.target.select();
									},
									onChange: (e) => {
										const val = e.target.value;
										setForm({
											...form,
											following: val === "" ? 0 : Math.max(0, Number(val) || 0)
										});
									}
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "sm:col-span-2 sm:w-1/2 sm:pr-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Postingan" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "number",
										min: 0,
										placeholder: "0",
										value: form.posts === 0 ? "" : form.posts,
										onFocus: (e) => {
											if (form.posts === 0) e.target.select();
										},
										onChange: (e) => {
											const val = e.target.value;
											setForm({
												...form,
												posts: val === "" ? 0 : Math.max(0, Number(val) || 0)
											});
										}
									})]
								}),
								followersChanged && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "sm:col-span-2 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-start gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-xs text-amber-800 dark:text-amber-300",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "font-semibold",
												children: [
													"Jumlah followers diubah (",
													account.followers.toLocaleString("id-ID"),
													" → ",
													form.followers.toLocaleString("id-ID"),
													")"
												]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "mt-0.5 text-muted-foreground",
												children: "Followers aktif di sistem tetap menggunakan nilai lama sampai admin menyetujui pengajuan pembaruan followers ini."
											})]
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										className: "text-xs",
										children: "Bukti Screenshot Followers *"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "mt-1 flex cursor-pointer items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm hover:bg-accent",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Camera, { className: "h-4 w-4 text-muted-foreground" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "truncate",
												children: proofFile ? proofFile.name : "Pilih screenshot bukti followers"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "file",
												accept: "image/jpeg,image/png,image/webp",
												className: "hidden",
												onChange: (e) => setProofFile(e.target.files?.[0] ?? null)
											})
										]
									})] })]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Bio" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							rows: 3,
							value: form.bio,
							onChange: (e) => setForm({
								...form,
								bio: e.target.value
							}),
							placeholder: "Ceritakan singkat tentang akun ini..."
						})] })
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
					className: "flex items-center justify-end gap-2 pt-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						variant: "outline",
						onClick: onClose,
						disabled: saving,
						children: "Batal"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						className: "gradient-brand text-brand-foreground",
						disabled: saving,
						onClick: handlePreSubmit,
						children: saving ? "Memproses..." : "Kirim Pembaruan"
					})]
				})
			]
		})
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open: confirmOpen,
		onOpenChange: (o) => !o && !saving && setConfirmOpen(false),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "sm:max-w-md",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "h-5 w-5 text-amber-500" }), "Pembaruan Memerlukan Verifikasi Admin"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Konfirmasi pengajuan pembaruan data akun media sosial Anda." })] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-3 py-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5 text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "h-4 w-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-semibold text-sm",
								children: "Pembaruan Memerlukan Verifikasi Admin"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs text-muted-foreground leading-relaxed",
								children: [
									"Sama seperti permintaan nonaktifkan akun, setiap perubahan data akun media sosial yang Anda kirim akan berstatus ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Menunggu Verifikasi" }),
									" sampai disetujui oleh Admin."
								]
							})]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-lg border border-border bg-muted/40 p-3 text-xs space-y-1.5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted-foreground",
									children: "Platform:"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-semibold",
									children: form.platform
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted-foreground",
									children: "Username:"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-semibold",
									children: form.username
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted-foreground",
									children: "Nama Akun:"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-semibold",
									children: form.accountName
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted-foreground shrink-0",
									children: "Link Profil:"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono truncate max-w-[200px] text-right text-primary",
									children: form.profileUrl
								})]
							}),
							followersChanged && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted-foreground",
									children: "Followers Diajukan:"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-semibold text-amber-600",
									children: form.followers.toLocaleString("id-ID")
								})]
							})
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
					className: "gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						variant: "outline",
						onClick: () => setConfirmOpen(false),
						disabled: saving,
						children: "Batal"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						type: "button",
						className: "gradient-brand text-brand-foreground",
						disabled: saving,
						onClick: handleExecuteUpdate,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "mr-1.5 h-4 w-4" }), saving ? "Mengirim..." : "Ya, Kirim Pembaruan"]
					})]
				})
			]
		})
	})] });
}
function BuzzerAddAccountDialog({ existing, onClose, onSubmit }) {
	const [form, setForm] = (0, import_react.useState)(() => ({
		platform: "Instagram",
		username: "",
		accountName: "",
		profileUrl: "",
		followers: 0,
		following: 0,
		posts: 0,
		category: "Lifestyle",
		bio: "",
		photoUrl: void 0,
		isActive: false
	}));
	const onPhoto = (e) => {
		const f = e.target.files?.[0];
		if (!f) return;
		const reader = new FileReader();
		reader.onload = () => setForm((s) => ({
			...s,
			photoUrl: reader.result
		}));
		reader.readAsDataURL(f);
	};
	const submit = async () => {
		if (!form.username.trim()) {
			toast.error("Username wajib diisi");
			return;
		}
		if (!form.accountName.trim()) {
			toast.error("Nama akun wajib diisi");
			return;
		}
		try {
			const url = form.profileUrl.trim();
			if (!url) {
				toast.error("Link profil wajib diisi");
				return;
			}
			new URL(url.startsWith("http") ? url : "https://" + url);
		} catch {
			toast.error("Link profil tidak valid");
			return;
		}
		if (form.followers < 0 || form.following < 0 || form.posts < 0) {
			toast.error("Nilai angka tidak boleh negatif");
			return;
		}
		if (existing.some((x) => x.platform === form.platform && x.username.trim().toLowerCase() === form.username.trim().toLowerCase())) {
			toast.error("Akun dengan username ini sudah terdaftar pada platform yang sama");
			return;
		}
		await onSubmit({
			...form,
			profileUrl: form.profileUrl.startsWith("http") ? form.profileUrl : "https://" + form.profileUrl
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open: true,
		onOpenChange: (o) => !o && onClose(),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "max-h-[90vh] overflow-y-auto sm:max-w-lg",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Tambah Akun Sosial Media" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Akun baru akan menunggu verifikasi admin sebelum aktif untuk campaign. Anda dapat menambahkan lebih dari satu akun pada platform yang sama." })] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Avatar, {
								className: "h-16 w-16",
								children: [form.photoUrl && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarImage, { src: form.photoUrl }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarFallback, {
									className: "gradient-brand text-brand-foreground",
									children: (form.accountName || "AK").split(" ").map((n) => n[0]).join("").slice(0, 2)
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "inline-flex cursor-pointer items-center gap-2 rounded-md border border-input px-3 py-2 text-sm hover:bg-accent",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Camera, { className: "h-4 w-4" }),
									" Upload Foto",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "file",
										accept: "image/*",
										className: "hidden",
										onChange: onPhoto
									})
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-3 sm:grid-cols-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Platform" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: form.platform,
									onValueChange: (v) => setForm({
										...form,
										platform: v
									}),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: SOCIAL_PLATFORMS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: p,
										children: p
									}, p)) })]
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Kategori" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: form.category,
									onValueChange: (v) => setForm({
										...form,
										category: v
									}),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: CATEGORIES.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: c,
										children: c
									}, c)) })]
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Username *" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: form.username,
									onChange: (e) => setForm({
										...form,
										username: e.target.value
									}),
									placeholder: "@username"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Nama Akun *" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: form.accountName,
									onChange: (e) => setForm({
										...form,
										accountName: e.target.value
									}),
									placeholder: "Nama tampilan"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "sm:col-span-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Link Profil *" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: form.profileUrl,
										onChange: (e) => setForm({
											...form,
											profileUrl: e.target.value
										}),
										placeholder: "https://instagram.com/username"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Followers" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "number",
									min: 0,
									placeholder: "0",
									value: form.followers === 0 ? "" : form.followers,
									onFocus: (e) => {
										if (form.followers === 0) e.target.select();
									},
									onChange: (e) => {
										const val = e.target.value;
										setForm({
											...form,
											followers: val === "" ? 0 : Math.max(0, Number(val) || 0)
										});
									}
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Following" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "number",
									min: 0,
									placeholder: "0",
									value: form.following === 0 ? "" : form.following,
									onFocus: (e) => {
										if (form.following === 0) e.target.select();
									},
									onChange: (e) => {
										const val = e.target.value;
										setForm({
											...form,
											following: val === "" ? 0 : Math.max(0, Number(val) || 0)
										});
									}
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "sm:col-span-2 sm:w-1/2 sm:pr-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Postingan" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "number",
										min: 0,
										placeholder: "0",
										value: form.posts === 0 ? "" : form.posts,
										onFocus: (e) => {
											if (form.posts === 0) e.target.select();
										},
										onChange: (e) => {
											const val = e.target.value;
											setForm({
												...form,
												posts: val === "" ? 0 : Math.max(0, Number(val) || 0)
											});
										}
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Bio" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							rows: 3,
							value: form.bio,
							onChange: (e) => setForm({
								...form,
								bio: e.target.value
							}),
							placeholder: "Ceritakan singkat tentang akun ini..."
						})] })
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					onClick: onClose,
					children: "Batal"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					className: "gradient-brand text-brand-foreground",
					onClick: submit,
					children: "Tambah Akun"
				})] })
			]
		})
	});
}
function emptyForm() {
	return {
		platform: "Instagram",
		username: "",
		accountName: "",
		profileUrl: "",
		followers: 0,
		following: 0,
		posts: 0,
		category: "Lifestyle",
		bio: "",
		photoUrl: void 0,
		isActive: true
	};
}
function AccountFormDialog({ initial, existing, onClose, onSubmit, onDelete }) {
	const [form, setForm] = (0, import_react.useState)(() => initial ? {
		platform: initial.platform,
		username: initial.username,
		accountName: initial.accountName,
		profileUrl: initial.profileUrl,
		followers: initial.followers,
		following: initial.following,
		posts: initial.posts,
		category: initial.category,
		bio: initial.bio,
		photoUrl: initial.photoUrl,
		isActive: initial.isActive
	} : emptyForm());
	const onPhoto = (e) => {
		const f = e.target.files?.[0];
		if (!f) return;
		const reader = new FileReader();
		reader.onload = () => setForm((s) => ({
			...s,
			photoUrl: reader.result
		}));
		reader.readAsDataURL(f);
	};
	const submit = async () => {
		if (!form.username.trim()) {
			toast.error("Username wajib diisi");
			return;
		}
		if (!form.accountName.trim()) {
			toast.error("Nama akun wajib diisi");
			return;
		}
		try {
			const url = form.profileUrl.trim();
			if (!url) {
				toast.error("Link profil wajib diisi");
				return;
			}
			new URL(url.startsWith("http") ? url : "https://" + url);
		} catch {
			toast.error("Link profil tidak valid");
			return;
		}
		if (form.followers < 0 || form.following < 0 || form.posts < 0) {
			toast.error("Nilai tidak boleh negatif");
			return;
		}
		if (!initial) {
			if (existing.some((x) => x.platform === form.platform && x.username.trim().toLowerCase() === form.username.trim().toLowerCase())) {
				toast.error("Akun ini sudah terdaftar pada platform yang sama");
				return;
			}
		}
		await onSubmit({
			...form,
			profileUrl: form.profileUrl.startsWith("http") ? form.profileUrl : "https://" + form.profileUrl
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open: true,
		onOpenChange: (o) => !o && onClose(),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "max-h-[90vh] overflow-y-auto sm:max-w-lg",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: initial ? "Edit Akun" : "Tambah Akun Sosial Media" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Akun baru akan menunggu verifikasi admin sebelum aktif untuk campaign." })] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Avatar, {
								className: "h-16 w-16",
								children: [form.photoUrl && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarImage, { src: form.photoUrl }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarFallback, {
									className: "gradient-brand text-brand-foreground",
									children: (form.accountName || "AK").split(" ").map((n) => n[0]).join("").slice(0, 2)
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "inline-flex cursor-pointer items-center gap-2 rounded-md border border-input px-3 py-2 text-sm hover:bg-accent",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Camera, { className: "h-4 w-4" }),
									" Upload Foto",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "file",
										accept: "image/*",
										className: "hidden",
										onChange: onPhoto
									})
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-3 sm:grid-cols-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Platform" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: form.platform,
									onValueChange: (v) => setForm({
										...form,
										platform: v
									}),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: SOCIAL_PLATFORMS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: p,
										children: p
									}, p)) })]
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Kategori" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: form.category,
									onValueChange: (v) => setForm({
										...form,
										category: v
									}),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: CATEGORIES.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: c,
										children: c
									}, c)) })]
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Username *" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: form.username,
									onChange: (e) => setForm({
										...form,
										username: e.target.value
									}),
									placeholder: "@username"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Nama Akun *" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: form.accountName,
									onChange: (e) => setForm({
										...form,
										accountName: e.target.value
									}),
									placeholder: "Nama tampilan"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "sm:col-span-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Link Profil *" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: form.profileUrl,
										onChange: (e) => setForm({
											...form,
											profileUrl: e.target.value
										}),
										placeholder: "https://instagram.com/username"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Followers" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "number",
									min: 0,
									placeholder: "0",
									value: form.followers === 0 ? "" : form.followers,
									onFocus: (e) => {
										if (form.followers === 0) e.target.select();
									},
									onChange: (e) => {
										const val = e.target.value;
										setForm({
											...form,
											followers: val === "" ? 0 : Math.max(0, Number(val) || 0)
										});
									}
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Following" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "number",
									min: 0,
									placeholder: "0",
									value: form.following === 0 ? "" : form.following,
									onFocus: (e) => {
										if (form.following === 0) e.target.select();
									},
									onChange: (e) => {
										const val = e.target.value;
										setForm({
											...form,
											following: val === "" ? 0 : Math.max(0, Number(val) || 0)
										});
									}
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Postingan" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "number",
									min: 0,
									placeholder: "0",
									value: form.posts === 0 ? "" : form.posts,
									onFocus: (e) => {
										if (form.posts === 0) e.target.select();
									},
									onChange: (e) => {
										const val = e.target.value;
										setForm({
											...form,
											posts: val === "" ? 0 : Math.max(0, Number(val) || 0)
										});
									}
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-end gap-3 rounded-md border border-input px-3 py-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											className: "text-xs",
											children: "Status Aktif"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-muted-foreground",
											children: "Ikut serta di campaign?"
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
										checked: form.isActive,
										onCheckedChange: (v) => setForm({
											...form,
											isActive: v
										})
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Bio" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							rows: 3,
							value: form.bio,
							onChange: (e) => setForm({
								...form,
								bio: e.target.value
							}),
							placeholder: "Ceritakan singkat tentang akun ini..."
						})] })
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
					className: "flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-between",
					children: [initial && onDelete ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						variant: "destructive",
						className: "h-9 w-9 p-0 sm:mr-auto",
						title: "Hapus Akun",
						"aria-label": "Hapus Akun",
						onClick: onDelete,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-end gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							onClick: onClose,
							children: "Batal"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							className: "gradient-brand text-brand-foreground",
							onClick: submit,
							children: initial ? "Simpan Perubahan" : "Tambah Akun"
						})]
					})]
				})
			]
		})
	});
}
function Metric({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-sm font-bold leading-tight",
		children: value
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-[10px] uppercase tracking-wide text-muted-foreground",
		children: label
	})] });
}
function Row({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid grid-cols-[110px_minmax(0,1fr)] items-start gap-2 border-b border-border pb-2 last:border-none",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-xs uppercase tracking-wide text-muted-foreground",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-sm",
			children: value
		})]
	});
}
function VerifBadge({ s }) {
	const cfg = {
		"Terverifikasi": {
			c: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
			i: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-3 w-3" })
		},
		"Menunggu": {
			c: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
			i: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-3 w-3" })
		},
		"Ditolak": {
			c: "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300",
			i: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, { className: "h-3 w-3" })
		}
	}[s];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold", cfg.c),
		children: [
			cfg.i,
			" ",
			s
		]
	});
}
function compact(n) {
	if (n >= 1e6) return (n / 1e6).toFixed(1).replace(/\.0$/, "") + "M";
	if (n >= 1e3) return (n / 1e3).toFixed(1).replace(/\.0$/, "") + "K";
	return n.toString();
}
var BUCKET = "bukti-pengerjaan";
var SIGNED_PATH_MARKER = `/storage/v1/object/sign/${BUCKET}/`;
var PUBLIC_PATH_MARKER = `/storage/v1/object/public/${BUCKET}/`;
/** Parse compound proof string (e.g. "<screenshot_url> | <post_link>") into separate parts */
function parseProofValue(value) {
	if (!value || typeof value !== "string" || !value.trim()) return {
		screenshotUrl: null,
		postUrl: null
	};
	const parts = value.trim().split(" | ").map((p) => p.trim()).filter(Boolean);
	let screenshotUrl = null;
	let postUrl = null;
	for (const part of parts) if (part.includes(SIGNED_PATH_MARKER) || part.includes(PUBLIC_PATH_MARKER) || part.includes("/storage/v1/object/sign/") || part.includes("/storage/v1/object/public/") || part.startsWith("proofs/") || part.includes(`/${BUCKET}/`)) {
		if (!screenshotUrl) screenshotUrl = part;
	} else if (/^https?:\/\//i.test(part)) {
		if (!postUrl) postUrl = part;
	} else if (/\.(png|jpe?g|webp|gif)(\?.*)?$/i.test(part)) {
		if (!screenshotUrl) screenshotUrl = part;
	} else if (!postUrl && !screenshotUrl) {
		if (part.startsWith("proofs/")) screenshotUrl = part;
		else postUrl = part.startsWith("www.") ? `https://${part}` : part;
	}
	if (!screenshotUrl && !postUrl && parts.length > 0) {
		if (parts[0].startsWith("proofs/") || /\.(png|jpe?g|webp)(\?.*)?$/i.test(parts[0])) {
			screenshotUrl = parts[0];
			if (parts[1]) postUrl = parts[1];
		} else postUrl = parts[0];
	}
	return {
		screenshotUrl,
		postUrl,
		rawText: parts.length > 1 ? parts.slice(1).join(" | ") : null
	};
}
/** Convert a stored storage path or old signed URL into a fresh signed URL. */
async function resolveProofUrl(value) {
	const parsed = parseProofValue(value);
	const target = parsed.screenshotUrl || parsed.postUrl || (value || "").trim();
	if (!target) throw new Error("URL bukti kosong.");
	let path = target;
	const signedIndex = target.indexOf(SIGNED_PATH_MARKER);
	const publicIndex = target.indexOf(PUBLIC_PATH_MARKER);
	if (signedIndex >= 0) path = target.slice(signedIndex + SIGNED_PATH_MARKER.length).split("?")[0];
	else if (publicIndex >= 0) path = target.slice(publicIndex + PUBLIC_PATH_MARKER.length).split("?")[0];
	else if (target.includes(`/${BUCKET}/`)) {
		const idx = target.indexOf(`/${BUCKET}/`);
		path = target.slice(idx + `/${BUCKET}/`.length).split("?")[0];
	}
	if (/^https?:\/\//i.test(path)) return target;
	const cleanPath = decodeURIComponent(path.replace(/^\/+/, "").split("?")[0]);
	const { data, error } = await supabase.storage.from(BUCKET).createSignedUrl(cleanPath, 3600);
	if (error || !data?.signedUrl) {
		console.error("[resolveProofUrl] Error creating signed url:", error);
		if (/^https?:\/\//i.test(target)) return target;
		throw error ?? /* @__PURE__ */ new Error("Gagal membuat URL bukti baru.");
	}
	return data.signedUrl;
}
/** Resolve both screenshot and post link from a stored proof string */
async function resolveProofItems(value) {
	if (!value) return {
		screenshotUrl: null,
		postUrl: null
	};
	const parsed = parseProofValue(value);
	let resolvedScreenshot = null;
	if (parsed.screenshotUrl) try {
		resolvedScreenshot = await resolveProofUrl(parsed.screenshotUrl);
	} catch (e) {
		console.warn("[resolveProofItems] Failed to resolve screenshot URL:", e);
		resolvedScreenshot = parsed.screenshotUrl.split(" | ")[0].trim();
	}
	let validPostUrl = parsed.postUrl;
	if (validPostUrl && !validPostUrl.startsWith("http://") && !validPostUrl.startsWith("https://")) validPostUrl = `https://${validPostUrl}`;
	return {
		screenshotUrl: resolvedScreenshot,
		postUrl: validPostUrl
	};
}
function ProofLink({ proofUrl, value, className = "", showPostLink = true, showDirectLink = false }) {
	const rawInput = proofUrl || value || "";
	const [resolved, setResolved] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(false);
	const [modalOpen, setModalOpen] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		let active = true;
		if (!rawInput.trim()) {
			setResolved(null);
			setLoading(false);
			return;
		}
		setLoading(true);
		setError(false);
		resolveProofItems(rawInput).then((res) => {
			if (active) {
				setResolved(res);
				setLoading(false);
			}
		}).catch((err) => {
			console.error("[ProofLink] Error resolving proof items:", err);
			if (active) {
				setError(true);
				setLoading(false);
			}
		});
		return () => {
			active = false;
		};
	}, [rawInput]);
	if (!rawInput.trim()) return null;
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: `inline-flex items-center gap-1.5 rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground animate-pulse ${className}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-3 w-3 animate-spin" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Memuat bukti..." })]
	});
	if (error || !resolved?.screenshotUrl && !resolved?.postUrl) {
		const fallbackUrl = rawInput.split(" | ")[0].trim();
		if (fallbackUrl) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
			href: fallbackUrl,
			target: "_blank",
			rel: "noreferrer",
			className: `inline-flex items-center gap-1 rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary hover:bg-primary/20 ${className}`,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "h-3 w-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Buka bukti" })]
		});
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: `inline-flex items-center gap-1 text-xs text-rose-500 ${className}`,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "h-3 w-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Bukti tidak dapat dibuka" })]
		});
	}
	const { screenshotUrl, postUrl } = resolved;
	const isPdf = !!screenshotUrl && (screenshotUrl.toLowerCase().includes(".pdf") || screenshotUrl.toLowerCase().includes("application%2fpdf"));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `inline-flex flex-wrap items-center gap-1.5 ${className}`,
		children: [
			screenshotUrl && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				type: "button",
				variant: "outline",
				size: "sm",
				onClick: () => setModalOpen(true),
				className: "h-7 gap-1.5 rounded-md border-primary/20 bg-primary/10 px-2.5 text-xs font-semibold text-primary hover:bg-primary/20 hover:text-primary transition-all cursor-pointer",
				children: [isPdf ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-3.5 w-3.5 text-rose-500" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Image, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isPdf ? "Lihat Bukti (PDF)" : "Lihat Screenshot" })]
			}),
			showDirectLink && screenshotUrl && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
				href: screenshotUrl,
				target: "_blank",
				rel: "noreferrer",
				className: "inline-flex h-7 items-center justify-center rounded-md border border-input bg-background px-2 text-xs text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors",
				title: isPdf ? "Buka file PDF di tab baru" : "Buka screenshot di tab baru",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "h-3.5 w-3.5" })
			}),
			showPostLink && postUrl && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
				href: postUrl,
				target: "_blank",
				rel: "noreferrer",
				className: "inline-flex h-7 items-center gap-1 rounded-md border border-blue-200 bg-blue-50 px-2.5 text-xs font-medium text-blue-700 hover:bg-blue-100 dark:border-blue-900/50 dark:bg-blue-950/40 dark:text-blue-300 dark:hover:bg-blue-900/60 transition-colors",
				title: postUrl,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "h-3 w-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Link Postingan" })]
			})
		]
	}), screenshotUrl && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open: modalOpen,
		onOpenChange: setModalOpen,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "max-w-3xl max-h-[90vh] flex flex-col p-4 sm:p-6 overflow-hidden",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, {
					className: "flex flex-row items-center justify-between pb-2 border-b",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
						className: "text-base font-bold flex items-center gap-2",
						children: [isPdf ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-4 w-4 text-rose-500" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Image, { className: "h-4 w-4 text-primary" }), isPdf ? "Dokumen Bukti Pengerjaan (PDF)" : "Bukti Screenshot Pekerjaan"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex items-center gap-2 pr-6",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
							href: screenshotUrl,
							target: "_blank",
							rel: "noreferrer",
							className: "inline-flex items-center gap-1 rounded-md bg-muted px-2.5 py-1 text-xs font-medium text-foreground hover:bg-muted/80 transition-colors",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "h-3 w-3" }), isPdf ? "Buka / Unduh PDF" : "Buka Tab Baru"]
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-3 flex-1 overflow-auto rounded-xl border border-border bg-muted/20 p-2 flex items-center justify-center min-h-[250px] max-h-[65vh]",
					children: isPdf ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("iframe", {
						src: screenshotUrl,
						title: "Dokumen Bukti Pengerjaan PDF",
						className: "h-full w-full min-h-[450px] rounded-lg border-0"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: screenshotUrl,
						alt: "Screenshot Bukti Pengerjaan",
						className: "max-h-full max-w-full rounded-lg object-contain shadow-sm"
					})
				}),
				postUrl && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-3 flex items-center justify-between rounded-lg border border-border bg-card p-2.5 text-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-muted-foreground",
						children: "Link Postingan:"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
						href: postUrl,
						target: "_blank",
						rel: "noreferrer",
						className: "flex items-center gap-1 font-medium text-primary hover:underline max-w-[280px] sm:max-w-md truncate",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "h-3 w-3 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "truncate",
							children: postUrl
						})]
					})]
				})
			]
		})
	})] });
}
var EVT = "buzzhub:buzzer-store";
var keyFor = (email) => `buzzhub.buzzer.${email.toLowerCase()}`;
function today(offset = 0) {
	const d = /* @__PURE__ */ new Date();
	d.setDate(d.getDate() + offset);
	return d.toISOString().slice(0, 10);
}
function seed(email, name, profile = {}) {
	const firstName = name.split(" ")[0] || "Buzzer";
	return {
		profile: {
			name,
			username: profile.username && profile.username.trim() || "@" + firstName.toLowerCase().replace(/[^a-z0-9]/g, ""),
			email,
			phone: profile.phone ?? "",
			platform: profile.platform ?? "Instagram",
			followers: profile.followers ?? 0,
			rating: 0,
			jobsCompleted: 0,
			bio: profile.bio ?? "",
			avatarUrl: profile.avatarUrl,
			buzzerCategory: profile.buzzerCategory ?? profile?.company ?? "Buzzer Online"
		},
		balance: 0,
		jobs: [],
		earnings: [],
		withdrawals: []
	};
}
function cleanDefined(obj) {
	const result = {};
	for (const key of Object.keys(obj)) if (obj[key] !== void 0 && obj[key] !== null) result[key] = obj[key];
	return result;
}
function read(email, name, profile = {}) {
	if (typeof window === "undefined") return seed(email, name, profile);
	try {
		const raw = localStorage.getItem(keyFor(email));
		if (raw) {
			const parsed = JSON.parse(raw);
			const initialSeed = seed(email, name, profile).profile;
			const cleanInput = cleanDefined(profile);
			return {
				...parsed,
				balance: Number(parsed.balance || 0),
				withdrawals: Array.isArray(parsed.withdrawals) ? parsed.withdrawals : [],
				earnings: Array.isArray(parsed.earnings) ? parsed.earnings : [],
				jobs: Array.isArray(parsed.jobs) ? parsed.jobs : [],
				profile: {
					...initialSeed,
					...parsed.profile,
					...cleanInput,
					name: cleanInput.name || parsed.profile?.name || name,
					email: cleanInput.email || parsed.profile?.email || email,
					avatarUrl: cleanInput.avatarUrl || parsed.profile?.avatarUrl || initialSeed.avatarUrl
				}
			};
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
function useBuzzerStore(email, name, profile = {}) {
	const nm = name ?? "Buzzer";
	(0, import_react.useEffect)(() => {
		if (email) {
			const hydrated = read(email, nm, profile);
			if (typeof window !== "undefined") localStorage.setItem(keyFor(email), JSON.stringify(hydrated));
		}
	}, [
		email,
		nm,
		profile
	]);
	(0, import_react.useEffect)(() => {
		if (!email) return;
		let active = true;
		const normalizedEmail = email.trim().toLowerCase();
		const loadProfile = async () => {
			const [{ data, error }, { data: verifiedSocials }, { data: wallet }] = await Promise.all([
				supabase.from("app_accounts").select("email, name, phone, bio, username, platform, followers, avatar_url, rating, total_reviews").eq("email", normalizedEmail).eq("role", "buzzer").maybeSingle(),
				supabase.from("social_accounts").select("followers, platform, username").eq("buzzer_email", normalizedEmail).eq("verification", "Terverifikasi"),
				supabase.from("buzzer_wallets").select("followers, verified_followers, rating, total_reviews").eq("buzzer_email", normalizedEmail).maybeSingle()
			]);
			if (!active || error) return;
			const fallback = !data ? await supabase.from("buzzer_applications").select("email, name, phone, bio, username, platform, followers").eq("email", normalizedEmail).eq("status", "approved").maybeSingle() : null;
			const source = data ?? fallback?.data;
			if (!active || !source) return;
			const socialFollowersTotal = (verifiedSocials ?? []).reduce((sum, a) => sum + (Number(a.followers) || 0), 0);
			const walletFollowers = Number(wallet?.verified_followers ?? wallet?.followers ?? 0);
			const verifiedFollowers = socialFollowersTotal > 0 ? socialFollowersTotal : walletFollowers > 0 ? walletFollowers : source.followers ?? 0;
			if (data && verifiedFollowers > 0 && data.followers !== verifiedFollowers) {
				supabase.from("app_accounts").update({ followers: verifiedFollowers }).eq("email", normalizedEmail).eq("role", "buzzer");
				supabase.from("buzzer_applications").update({ followers: verifiedFollowers }).eq("email", normalizedEmail);
			}
			const totalReviews = Number(wallet?.total_reviews ?? data?.total_reviews ?? 0);
			const rawRating = Number(wallet?.rating ?? data?.rating ?? 0);
			const buzzerRating = totalReviews > 0 ? rawRating > 0 ? rawRating : 0 : 0;
			const current = read(email, nm, profile);
			const resolvedAvatar = "avatar_url" in source && source.avatar_url ? source.avatar_url : current.profile.avatarUrl;
			const resolvedBuzzerCategory = source.company || current.profile.buzzerCategory || "Buzzer Online";
			write(email, {
				...current,
				profile: {
					...current.profile,
					name: source.name,
					email: source.email,
					phone: source.phone ?? "",
					bio: source.bio ?? "",
					username: source.username ?? "",
					platform: source.platform ?? current.profile.platform,
					followers: verifiedFollowers,
					rating: buzzerRating,
					avatarUrl: resolvedAvatar,
					buzzerCategory: resolvedBuzzerCategory
				}
			});
			const session = getSession();
			if (session?.email.toLowerCase() === normalizedEmail) setSession({
				...session,
				name: source.name,
				phone: source.phone ?? void 0,
				bio: source.bio ?? void 0,
				username: source.username ?? void 0,
				platform: source.platform ?? void 0,
				company: resolvedBuzzerCategory,
				followers: verifiedFollowers,
				avatarUrl: resolvedAvatar ?? session.avatarUrl
			});
		};
		loadProfile();
		const channel = supabase.channel(`buzzer-profile-${normalizedEmail}`).on("postgres_changes", {
			event: "*",
			schema: "public",
			table: "social_accounts",
			filter: `buzzer_email=eq.${normalizedEmail}`
		}, () => {
			loadProfile();
		}).on("postgres_changes", {
			event: "*",
			schema: "public",
			table: "app_accounts",
			filter: `email=eq.${normalizedEmail}`
		}, () => {
			loadProfile();
		}).on("postgres_changes", {
			event: "*",
			schema: "public",
			table: "buzzer_wallets",
			filter: `buzzer_email=eq.${normalizedEmail}`
		}, () => {
			loadProfile();
		}).subscribe();
		return () => {
			active = false;
			supabase.removeChannel(channel);
		};
	}, [email, nm]);
	(0, import_react.useEffect)(() => {
		if (!email) return;
		let active = true;
		const normalizedEmail = email.trim().toLowerCase();
		const loadFinance = async () => {
			const [{ data: wallet, error: walletError }, { data: buzzerJobs, error: jobsError }, { data: dbWithdrawals }] = await Promise.all([
				supabase.from("buzzer_wallets").select("balance").eq("buzzer_email", normalizedEmail).maybeSingle(),
				supabase.from("campaign_jobs").select("id, campaign_title, platform, payout, buzzer_amount, status, admin_verified_at, updated_at").eq("buzzer_email", normalizedEmail).or("status.eq.Selesai,admin_verified_at.not.is.null").order("updated_at", { ascending: false }),
				supabase.from("withdrawals").select("id, amount, method, account_no, status, proof_url, admin_note, requested_at, created_at, completed_at").eq("buzzer_email", normalizedEmail).order("requested_at", { ascending: false })
			]);
			if (!active || walletError || jobsError) return;
			const earnings = (buzzerJobs ?? []).filter((job) => Number(job.buzzer_amount ?? job.payout ?? 0) > 0).map((job) => ({
				id: job.id,
				date: job.updated_at.slice(0, 10),
				jobId: job.id,
				jobTitle: job.campaign_title,
				amount: Number(job.buzzer_amount ?? job.payout ?? 0),
				status: "Berhasil",
				platform: job.platform ?? "Instagram",
				transactionType: "Payout Buzzer"
			}));
			const current = read(email, nm, profile);
			const mergedWithdrawals = dbWithdrawals && dbWithdrawals.length > 0 ? dbWithdrawals.map((w) => ({
				id: String(w.id),
				date: (w.requested_at || w.created_at || today()).slice(0, 10),
				amount: Number(w.amount || 0),
				method: w.method || "Transfer",
				status: w.status || "Menunggu",
				accountNo: w.account_no || "",
				proofUrl: w.proof_url || void 0,
				adminNote: w.admin_note || void 0,
				requestedAt: w.requested_at || w.created_at,
				completedAt: w.completed_at || void 0
			})) : current.withdrawals;
			write(email, {
				...current,
				balance: Number(wallet?.balance ?? current.balance),
				earnings,
				withdrawals: mergedWithdrawals,
				profile: {
					...current.profile,
					jobsCompleted: Math.max(current.profile.jobsCompleted, earnings.length)
				}
			});
		};
		loadFinance();
		const channel = supabase.channel(`buzzer-finance-${normalizedEmail}`).on("postgres_changes", {
			event: "*",
			schema: "public",
			table: "buzzer_wallets",
			filter: `buzzer_email=eq.${normalizedEmail}`
		}, () => {
			loadFinance();
		}).on("postgres_changes", {
			event: "*",
			schema: "public",
			table: "withdrawals",
			filter: `buzzer_email=eq.${normalizedEmail}`
		}, () => {
			loadFinance();
		}).subscribe();
		return () => {
			active = false;
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
	const serverSnapshot = () => null;
	(0, import_react.useSyncExternalStore)(subscribe, getSnapshot, serverSnapshot);
	const state = email ? read(email, nm, profile) : seed("guest@buzzhub.id", nm);
	const mutate = (fn) => {
		if (!email) return;
		write(email, fn(read(email, nm)));
	};
	return {
		state,
		ready: !!email,
		takeJob: (id) => mutate((s) => ({
			...s,
			jobs: s.jobs.map((j) => j.id === id ? {
				...j,
				status: "Diambil",
				updatedAt: (/* @__PURE__ */ new Date()).toISOString()
			} : j)
		})),
		uploadProof: (id, url) => mutate((s) => ({
			...s,
			jobs: s.jobs.map((j) => j.id === id || "db:" + j.id === id || j.id === id.replace(/^db:/, "") ? {
				...j,
				status: "Review",
				proofUrl: url,
				updatedAt: (/* @__PURE__ */ new Date()).toISOString()
			} : j)
		})),
		resubmitProof: (id, url) => mutate((s) => ({
			...s,
			jobs: s.jobs.map((j) => j.id === id || "db:" + j.id === id || j.id === id.replace(/^db:/, "") ? {
				...j,
				status: "Review",
				proofUrl: url,
				note: void 0,
				updatedAt: (/* @__PURE__ */ new Date()).toISOString()
			} : j)
		})),
		updateProfile: async (patch) => {
			if (!email) return false;
			const updatePayload = {
				name: patch.name,
				phone: patch.phone,
				bio: patch.bio,
				username: patch.username,
				platform: patch.platform,
				followers: patch.followers,
				avatar_url: patch.avatarUrl ?? null
			};
			if (patch.buzzerCategory) updatePayload.company = patch.buzzerCategory;
			const { data: updatedAccount, error } = await supabase.from("app_accounts").update(updatePayload).eq("email", email.trim().toLowerCase()).eq("role", "buzzer").select("email").maybeSingle();
			if (error) return false;
			if (!updatedAccount) {
				const { error: applicationError } = await supabase.from("buzzer_applications").update({
					name: patch.name,
					phone: patch.phone,
					bio: patch.bio,
					username: patch.username,
					platform: patch.platform,
					followers: patch.followers
				}).eq("email", email.trim().toLowerCase()).eq("status", "approved");
				if (applicationError) return false;
			}
			mutate((s) => ({
				...s,
				profile: {
					...s.profile,
					...patch,
					email: s.profile.email
				}
			}));
			const session = getSession();
			if (session?.email.toLowerCase() === email.trim().toLowerCase()) setSession({
				...session,
				name: patch.name ?? session.name,
				phone: patch.phone ?? session.phone,
				bio: patch.bio ?? session.bio,
				username: patch.username ?? session.username,
				platform: patch.platform ?? session.platform,
				followers: patch.followers ?? session.followers,
				avatarUrl: patch.avatarUrl ?? session.avatarUrl,
				company: patch.buzzerCategory ?? session.company
			});
			return true;
		},
		requestWithdrawal: async (amount, method, accountNo, accountName) => {
			if (!email || amount <= 0) return false;
			const current = read(email, nm, profile);
			if (amount > current.balance) return false;
			const currentWithdrawals = Array.isArray(current.withdrawals) ? current.withdrawals : [];
			const pendingTotal = currentWithdrawals.filter((w) => w.status === "Menunggu").reduce((sum, w) => sum + Number(w.amount || 0), 0);
			if (amount > Math.max(0, current.balance - pendingTotal)) return false;
			const nowIso = (/* @__PURE__ */ new Date()).toISOString();
			const fullAccountNo = accountName?.trim() ? `${accountNo} a.n. ${accountName.trim()}` : accountNo || method;
			const w = {
				id: "w" + Date.now(),
				date: today(),
				amount,
				method,
				status: "Menunggu",
				accountNo: fullAccountNo,
				accountName: accountName?.trim(),
				requestedAt: nowIso
			};
			write(email, {
				...current,
				withdrawals: [w, ...currentWithdrawals]
			});
			const normalizedEmail = email.trim().toLowerCase();
			try {
				await supabase.from("withdrawals").insert({
					buzzer_name: current.profile.name || nm,
					buzzer_email: normalizedEmail,
					amount,
					method,
					account_no: fullAccountNo,
					status: "Menunggu",
					requested_at: nowIso
				});
				await supabase.from("finance_activity").insert({
					type: "buzzer",
					title: "Pengajuan Pencairan Saldo",
					description: `Pengajuan pencairan saldo sebesar Rp ${amount.toLocaleString("id-ID")} ke ${method} (${fullAccountNo}) menunggu verifikasi admin`,
					amount,
					ref_table: "withdrawals"
				});
			} catch (err) {
				console.error("Gagal sinkronisasi pencairan saldo ke Supabase:", err);
			}
			return true;
		},
		resetData: () => {
			if (!email) return;
			localStorage.removeItem(keyFor(email));
			window.dispatchEvent(new Event(EVT));
		}
	};
}
var formatIDR = (n) => new Intl.NumberFormat("id-ID", {
	style: "currency",
	currency: "IDR",
	maximumFractionDigits: 0
}).format(n);
function terbilangRupiah(n) {
	if (isNaN(n) || n <= 0) return "";
	const satuan = [
		"",
		"satu",
		"dua",
		"tiga",
		"empat",
		"lima",
		"enam",
		"tujuh",
		"delapan",
		"sembilan",
		"sepuluh",
		"sebelas"
	];
	function konversi(val) {
		if (val < 12) return satuan[val];
		if (val < 20) return konversi(val - 10) + " belas";
		if (val < 100) return konversi(Math.floor(val / 10)) + " puluh" + (val % 10 ? " " + konversi(val % 10) : "");
		if (val < 200) return "seratus" + (val - 100 ? " " + konversi(val - 100) : "");
		if (val < 1e3) return konversi(Math.floor(val / 100)) + " ratus" + (val % 100 ? " " + konversi(val % 100) : "");
		if (val < 2e3) return "seribu" + (val - 1e3 ? " " + konversi(val - 1e3) : "");
		if (val < 1e6) return konversi(Math.floor(val / 1e3)) + " ribu" + (val % 1e3 ? " " + konversi(val % 1e3) : "");
		if (val < 1e9) return konversi(Math.floor(val / 1e6)) + " juta" + (val % 1e6 ? " " + konversi(val % 1e6) : "");
		return konversi(Math.floor(val / 1e9)) + " milyar" + (val % 1e9 ? " " + konversi(val % 1e9) : "");
	}
	const hasil = konversi(Math.floor(n)).trim();
	return hasil ? hasil.charAt(0).toUpperCase() + hasil.slice(1) : "";
}
var PREFIX = "buzzhub.buzzer.";
function readByEmail(email) {
	try {
		const raw = localStorage.getItem(PREFIX + email.toLowerCase());
		if (!raw) return null;
		const parsed = JSON.parse(raw);
		if (!parsed || typeof parsed !== "object") return null;
		if (!Array.isArray(parsed.withdrawals)) parsed.withdrawals = [];
		if (!Array.isArray(parsed.earnings)) parsed.earnings = [];
		if (!Array.isArray(parsed.jobs)) parsed.jobs = [];
		parsed.balance = Number(parsed.balance || 0);
		return parsed;
	} catch {
		return null;
	}
}
function listAllWithdrawals() {
	if (typeof window === "undefined") return [];
	const out = [];
	try {
		for (let i = 0; i < localStorage.length; i++) {
			const k = localStorage.key(i);
			if (!k || !k.startsWith(PREFIX)) continue;
			const email = k.slice(15);
			const st = readByEmail(email);
			if (!st || !Array.isArray(st.withdrawals)) continue;
			for (const w of st.withdrawals) {
				if (!w) continue;
				out.push({
					...w,
					buzzerEmail: st.profile?.email || email,
					buzzerName: st.profile?.name || "Buzzer"
				});
			}
		}
	} catch (err) {
		console.warn("[listAllWithdrawals] Error reading withdrawals:", err);
	}
	return out.sort((a, b) => a.date < b.date ? 1 : -1);
}
function updateWithdrawalStatus(email, id, status, adminNote, proofUrl) {
	const st = readByEmail(email);
	if (!st) return;
	if (!Array.isArray(st.withdrawals)) st.withdrawals = [];
	const w = st.withdrawals.find((x) => x.id === id);
	if (!w) return;
	const prev = w.status;
	w.status = status;
	if (adminNote !== void 0) w.adminNote = adminNote;
	if (proofUrl !== void 0) w.proofUrl = proofUrl;
	const isApproved = status === "Berhasil" || status === "Disetujui";
	const wasApproved = prev === "Berhasil" || prev === "Disetujui";
	if (isApproved) {
		w.completedAt = (/* @__PURE__ */ new Date()).toISOString();
		if (!wasApproved) st.balance = Math.max(0, st.balance - w.amount);
	} else if (wasApproved && !isApproved) st.balance += w.amount;
	localStorage.setItem(PREFIX + email.toLowerCase(), JSON.stringify(st));
	window.dispatchEvent(new Event(EVT));
}
function deleteWithdrawal(email, id) {
	const st = readByEmail(email);
	if (!st) return;
	if (!Array.isArray(st.withdrawals)) st.withdrawals = [];
	const target = st.withdrawals.find((x) => x.id === id);
	if (!target) return;
	if (target.status === "Berhasil" || target.status === "Disetujui") st.balance += target.amount;
	st.withdrawals = st.withdrawals.filter((x) => x.id !== id);
	localStorage.setItem(PREFIX + email.toLowerCase(), JSON.stringify(st));
	window.dispatchEvent(new Event(EVT));
}
function editWithdrawal(email, id, patch) {
	const st = readByEmail(email);
	if (!st) return;
	if (!Array.isArray(st.withdrawals)) st.withdrawals = [];
	const w = st.withdrawals.find((x) => x.id === id);
	if (!w) return;
	const prevStatus = w.status;
	const newStatus = patch.status ?? prevStatus;
	const prevAmount = w.amount;
	const newAmount = patch.amount !== void 0 ? patch.amount : prevAmount;
	const wasApproved = prevStatus === "Berhasil" || prevStatus === "Disetujui";
	const isApproved = newStatus === "Berhasil" || newStatus === "Disetujui";
	if (!wasApproved && isApproved) st.balance = Math.max(0, st.balance - newAmount);
	else if (wasApproved && !isApproved) st.balance += prevAmount;
	else if (wasApproved && isApproved && prevAmount !== newAmount) st.balance = Math.max(0, st.balance + prevAmount - newAmount);
	Object.assign(w, patch);
	if (isApproved && !w.completedAt) w.completedAt = (/* @__PURE__ */ new Date()).toISOString();
	localStorage.setItem(PREFIX + email.toLowerCase(), JSON.stringify(st));
	window.dispatchEvent(new Event(EVT));
}
function TablePagination({ currentPage, totalItems, pageSize = 8, onPageChange, className }) {
	const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
	const safePage = Math.min(Math.max(1, currentPage), totalPages);
	const from = totalItems === 0 ? 0 : (safePage - 1) * pageSize + 1;
	const to = Math.min(safePage * pageSize, totalItems);
	const pageNumbers = (0, import_react.useMemo)(() => {
		if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
		const pages = [];
		if (safePage <= 3) pages.push(1, 2, 3, 4, "...", totalPages);
		else if (safePage >= totalPages - 2) pages.push(1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
		else pages.push(1, "...", safePage - 1, safePage, safePage + 1, "...", totalPages);
		return pages;
	}, [totalPages, safePage]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `flex flex-wrap items-center justify-between gap-3 border-t border-border px-4 py-3 sm:px-5 ${className || ""}`,
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
			className: "flex items-center gap-1 sm:gap-1.5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "button",
					size: "sm",
					variant: "outline",
					className: "h-8 w-8 p-0",
					disabled: safePage <= 1,
					onClick: () => onPageChange(Math.max(1, safePage - 1)),
					"aria-label": "Halaman sebelumnya",
					title: "Halaman sebelumnya",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "h-4 w-4" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "hidden sm:flex items-center gap-1",
					children: pageNumbers.map((p, idx) => typeof p === "number" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						size: "sm",
						variant: p === safePage ? "default" : "outline",
						className: `h-8 min-w-[2rem] px-2 text-xs transition-colors ${p === safePage ? "gradient-brand text-brand-foreground font-bold shadow-xs border-transparent" : ""}`,
						onClick: () => onPageChange(p),
						"aria-label": `Ke halaman ${p}`,
						children: p
					}, idx) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "px-1 text-xs text-muted-foreground select-none",
						children: "…"
					}, idx))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "grid min-w-[3rem] place-items-center px-1 text-xs font-medium sm:hidden",
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
					title: "Halaman berikutnya",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-4 w-4" })
				})
			]
		})]
	});
}
var Tabs = Root2;
var TabsList = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(List, {
	ref,
	className: cn("inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground", className),
	...props
}));
TabsList.displayName = List.displayName;
var TabsTrigger = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trigger, {
	ref,
	className: cn("inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background cursor-pointer transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow", className),
	...props
}));
TabsTrigger.displayName = Trigger.displayName;
var TabsContent = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content, {
	ref,
	className: cn("mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2", className),
	...props
}));
TabsContent.displayName = Content.displayName;
//#endregion
export { uploadProofScreenshot as _, TablePagination as a, TabsList as c, deleteWithdrawal as d, editWithdrawal as f, updateWithdrawalStatus as g, terbilangRupiah as h, SosmedSection as i, TabsTrigger as l, listAllWithdrawals as m, LevelBadge as n, Tabs as o, formatIDR as p, ProofLink as r, TabsContent as s, AccountFormDialog as t, VerifBadge as u, useBuzzerStore as v };
