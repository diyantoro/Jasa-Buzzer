import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as Link, y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { L as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as Button } from "./button-BkEeRci-.mjs";
import { n as Label, t as Input } from "./label-B7oQAA24.mjs";
import { D as Rocket, Gt as ArrowLeft, M as Plus, St as Coins, Vt as BadgeCheck, b as ShieldCheck, d as Trash2, i as Users, u as TrendingUp } from "../_libs/lucide-react.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, s as Textarea, t as Dialog } from "./dialog-BQPGZ99x.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-Dg1urBTx.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { i as registerAccount } from "./auth-CNL2N2Mo.mjs";
import { _ as submitApplication, t as SOCIAL_PLATFORMS, v as submitSocialAccounts } from "./buzzer-verification-COVCzkVL.mjs";
import { t as PasswordInput } from "./password-input-DzpCA7kV.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/register.buzzer-BsYWFE2l.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var KATEGORI = [
	"Lifestyle",
	"Kuliner",
	"Beauty & Skincare",
	"Fashion",
	"Gaming",
	"Teknologi",
	"Finansial",
	"Edukasi",
	"Parenting",
	"Otomotif",
	"Travel",
	"Olahraga",
	"Musik & Hiburan",
	"Politik & Sosial"
];
var emptyRow = () => ({
	platform: "Instagram",
	username: "",
	profileUrl: "",
	followers: 0
});
var PROGRAM_STEPS = [
	{
		icon: Rocket,
		title: "Daftar akun sosial",
		text: "Lengkapi profil dan akun media sosial Anda."
	},
	{
		icon: ShieldCheck,
		title: "Verifikasi admin",
		text: "Admin memeriksa keaslian akun dan data Anda."
	},
	{
		icon: Users,
		title: "Ambil job sesuai akun",
		text: "Job yang cocok dengan platform Anda akan tersedia."
	},
	{
		icon: Coins,
		title: "Kirim bukti & cairkan",
		text: "Selesaikan job, lalu cairkan pendapatan Anda."
	}
];
var LEVELS = [
	[
		"🥉",
		"Bronze",
		"0–10 rb"
	],
	[
		"🥈",
		"Silver",
		"10–50 rb"
	],
	[
		"🥇",
		"Gold",
		"50–100 rb"
	],
	[
		"💎",
		"Platinum",
		"100–500 rb"
	],
	[
		"👑",
		"Diamond",
		"500 rb+"
	]
];
function RegisterBuzzerPage() {
	const navigate = useNavigate();
	const [kategori, setKategori] = (0, import_react.useState)("");
	const [rows, setRows] = (0, import_react.useState)([emptyRow()]);
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [doneOpen, setDoneOpen] = (0, import_react.useState)(false);
	const [doneName, setDoneName] = (0, import_react.useState)("");
	const [pass, setPass] = (0, import_react.useState)("");
	const [passConfirm, setPassConfirm] = (0, import_react.useState)("");
	const passMismatch = passConfirm.length > 0 && passConfirm !== pass;
	const patchRow = (i, patch) => setRows((cur) => cur.map((r, idx) => idx === i ? {
		...r,
		...patch
	} : r));
	const handleSubmit = async (e) => {
		e.preventDefault();
		const fd = new FormData(e.currentTarget);
		const name = String(fd.get("name") || "").trim();
		const email = String(fd.get("email") || "").trim();
		const phone = String(fd.get("phone") || "").replace(/\D/g, "");
		const city = String(fd.get("city") || "").trim();
		const bio = String(fd.get("bio") || "").trim();
		const password = String(fd.get("password") || "");
		const address = String(fd.get("address") || "").trim();
		if (!name || !email) return toast.error("Nama dan email wajib diisi.");
		if (!kategori) return toast.error("Pilih kategori konten / bidang keahlian Anda.");
		if (password.length < 8) return toast.error("Kata sandi minimal 8 karakter.");
		if (password !== passConfirm) return toast.error("Ulangi kata sandi belum cocok.");
		const valid = rows.filter((r) => r.username.trim().length > 0);
		if (valid.length === 0) return toast.error("Tambahkan minimal satu akun media sosial.");
		if (valid.some((r) => r.followers < 0)) return toast.error("Jumlah followers tidak valid.");
		for (const r of valid) {
			const u = r.profileUrl.trim();
			if (!u) return toast.error(`Link profil untuk akun ${r.platform} (@${r.username}) wajib diisi.`);
			try {
				const testUrl = new URL(u.startsWith("http") ? u : "https://" + u);
				if (!testUrl.hostname || !testUrl.hostname.includes(".")) throw new Error();
			} catch {
				return toast.error(`Link profil untuk akun ${r.platform} (@${r.username}) tidak valid.`);
			}
		}
		for (const r of valid) {
			const u = r.profileUrl.trim();
			if (!u) return toast.error(`Link profil untuk akun ${r.platform} (@${r.username}) wajib diisi.`);
			try {
				const testUrl = new URL(u.startsWith("http") ? u : "https://" + u);
				if (!testUrl.hostname || !testUrl.hostname.includes(".")) throw new Error();
			} catch {
				return toast.error(`Link profil untuk akun ${r.platform} (@${r.username}) tidak valid.`);
			}
		}
		const primaryUsername = valid[0].username.trim();
		const primaryPlatform = valid[0].platform;
		const totalFollowers = valid.reduce((s, r) => s + (r.followers || 0), 0);
		setLoading(true);
		const acc = await registerAccount({
			role: "buzzer",
			name,
			email,
			password,
			phone,
			city,
			bio,
			company: "Buzzer",
			username: primaryUsername,
			platform: primaryPlatform,
			followers: totalFollowers,
			industry: kategori
		});
		if (!acc.ok) {
			setLoading(false);
			return toast.error(acc.message || "Akun belum bisa daftar. Coba lagi.");
		}
		const res = await submitApplication({
			name,
			email,
			username: primaryUsername,
			platform: primaryPlatform,
			platforms: Array.from(new Set(valid.map((r) => r.platform))),
			followers: totalFollowers,
			phone,
			city,
			address,
			category: kategori,
			bio
		});
		if (!res.ok) {
			setLoading(false);
			if (res.message.toLowerCase().includes("menunggu verifikasi") || res.message.toLowerCase().includes("terkirim") || res.message.toLowerCase().includes("sedang menunggu")) return toast.warning(res.message);
			return toast.error(res.message);
		}
		if (valid.length > 0) await submitSocialAccounts(email, name, valid.map((r) => ({
			platform: r.platform,
			username: r.username,
			profileUrl: r.profileUrl.trim().startsWith("http") ? r.profileUrl.trim() : "https://" + r.profileUrl.trim(),
			followers: r.followers || 0,
			category: kategori
		})));
		setLoading(false);
		setDoneName(name);
		setDoneOpen(true);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-gradient-to-br from-background via-background to-accent/30",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/",
				className: "inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-4 w-4" }), " Kembali"]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 grid items-start gap-6 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
					className: "rounded-3xl border border-border bg-card p-6 shadow-sm lg:sticky lg:top-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "inline-flex items-center gap-2 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Rocket, { className: "h-3.5 w-3.5" }), " Program Buzzer BuzzHub"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
							className: "mt-4 font-display text-3xl font-bold leading-tight",
							children: ["Ubah pengaruh Anda jadi ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-gradient-brand",
								children: "penghasilan"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-sm leading-relaxed text-muted-foreground",
							children: "Gabung sebagai buzzer terverifikasi, ambil job sesuai akun sosial, dan dapatkan bayaran setelah pekerjaan disetujui."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-6 space-y-3",
							children: PROGRAM_STEPS.map(({ icon: Icon, title, text }, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex gap-3 rounded-xl bg-muted/50 p-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "grid h-8 w-8 shrink-0 place-items-center rounded-lg gradient-brand text-sm font-bold text-brand-foreground",
										children: index + 1
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm font-semibold",
										children: title
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-0.5 text-xs leading-relaxed text-muted-foreground",
										children: text
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "ml-auto h-4 w-4 shrink-0 text-brand" })
								]
							}, title))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-6 border-t border-border pt-5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "h-4 w-4 text-brand" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
										className: "font-display text-lg font-bold",
										children: "Level buzzer"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-xs leading-relaxed text-muted-foreground",
									children: "Ditentukan dari total followers akun yang berhasil diverifikasi admin."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-3 grid grid-cols-5 gap-1.5",
									children: LEVELS.map(([emoji, name, range]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-lg border border-border p-1.5 text-center",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-base",
												children: emoji
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "truncate text-[10px] font-semibold",
												children: name
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-[9px] text-muted-foreground",
												children: range
											})
										]
									}, name))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-4 flex gap-2 text-xs text-muted-foreground",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BadgeCheck, { className: "h-4 w-4 shrink-0 text-brand" }), " Level dan akun sosial diverifikasi oleh admin."]
								})
							]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-3xl border border-border bg-card p-6 shadow-glow sm:p-8",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "font-display text-2xl font-bold sm:text-3xl",
							children: "Pendaftaran Buzzer"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-muted-foreground",
							children: "Lengkapi data diri dan akun media sosial Anda. Tim admin akan memverifikasi sebelum akun aktif."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
							onSubmit: handleSubmit,
							className: "mt-8 space-y-8",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
									className: "space-y-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
										className: "font-display text-lg font-bold",
										children: "1. Data diri"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid gap-4 sm:grid-cols-2",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
												htmlFor: "b-name",
												children: "Nama lengkap"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												id: "b-name",
												name: "name",
												placeholder: "Nama sesuai identitas",
												required: true
											})] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
												htmlFor: "b-phone",
												children: "No. WhatsApp"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												id: "b-phone",
												name: "phone",
												inputMode: "numeric",
												pattern: "[0-9]*",
												placeholder: "081234567890",
												onChange: (e) => {
													e.currentTarget.value = e.currentTarget.value.replace(/\D/g, "");
												}
											})] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
												htmlFor: "b-city",
												children: "Kota domisili"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												id: "b-city",
												name: "city",
												placeholder: "Contoh: Bandung"
											})] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
												htmlFor: "b-address",
												children: "Alamat lengkap"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												id: "b-address",
												name: "address",
												placeholder: "Contoh: Jl. Sudirman No. 45, RT 02/04, Kelurahan..."
											})] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "sm:col-span-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Kategori konten" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
													value: kategori,
													onValueChange: setKategori,
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Pilih kategori" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: KATEGORI.map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
														value: k,
														children: k
													}, k)) })]
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "sm:col-span-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
													htmlFor: "b-bio",
													children: "Deskripsi singkat"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
													id: "b-bio",
													name: "bio",
													rows: 3,
													placeholder: "Ceritakan gaya konten dan audiens Anda."
												})]
											})
										]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
									className: "space-y-4",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-between",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
												className: "font-display text-lg font-bold",
												children: "2. Akun media sosial"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
												type: "button",
												variant: "outline",
												size: "sm",
												onClick: () => setRows((c) => [...c, emptyRow()]),
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "mr-1 h-4 w-4" }), " Tambah akun"]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-sm text-muted-foreground",
											children: "Data followers akan dicek admin. Akun yang tidak dapat diverifikasi tidak akan dihitung."
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "space-y-4",
											children: rows.map((r, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "rounded-2xl border border-border p-4",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "mb-3 flex items-center justify-between",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "text-xs font-semibold uppercase tracking-wide text-muted-foreground",
														children: ["Akun ", i + 1]
													}), rows.length > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
														type: "button",
														variant: "ghost",
														size: "sm",
														onClick: () => setRows((c) => c.filter((_, idx) => idx !== i)),
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
													})]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "grid gap-3 sm:grid-cols-2",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Platform" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
															value: r.platform,
															onValueChange: (v) => patchRow(i, { platform: v }),
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: SOCIAL_PLATFORMS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
																value: p,
																children: p
															}, p)) })]
														})] }),
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Username" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
															value: r.username,
															onChange: (e) => patchRow(i, { username: e.target.value }),
															placeholder: "@username"
														})] }),
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Link profil *" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
															value: r.profileUrl,
															onChange: (e) => patchRow(i, { profileUrl: e.target.value }),
															placeholder: "https://..."
														})] }),
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Jumlah followers" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
															type: "number",
															min: 0,
															value: r.followers || "",
															onChange: (e) => patchRow(i, { followers: Number(e.target.value) || 0 }),
															placeholder: "0"
														})] })
													]
												})]
											}, i))
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
									className: "space-y-4",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
											className: "font-display text-lg font-bold",
											children: "3. Akun login website"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-sm text-muted-foreground",
											children: "Email utama dan kata sandi ini digunakan untuk masuk ke website jasa buzzer."
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "b-email",
											children: "Email utama"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											id: "b-email",
											name: "email",
											type: "email",
											autoComplete: "email",
											placeholder: "buzzer@buzzhub.id",
											required: true
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PasswordInput, {
											id: "b-pass",
											name: "password",
											label: "Password",
											autoComplete: "new-password",
											value: pass,
											onChange: (e) => setPass(e.target.value),
											placeholder: "Minimal 8 karakter",
											showStrength: true,
											required: true
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PasswordInput, {
											id: "b-pass-confirm",
											name: "password-confirm",
											label: "Ulangi password",
											autoComplete: "new-password",
											value: passConfirm,
											onChange: (e) => setPassConfirm(e.target.value),
											placeholder: "Ketik ulang password",
											hint: passConfirm.length === 0 ? void 0 : passMismatch ? "Password belum cocok." : "Password cocok.",
											hintTone: passMismatch ? "error" : "success",
											required: true
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "submit",
									disabled: loading || passMismatch,
									size: "lg",
									className: "w-full gradient-brand text-brand-foreground hover:opacity-90",
									children: loading ? "Mengirim..." : "Kirim untuk Verifikasi Admin"
								})
							]
						})
					]
				})]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open: doneOpen,
			onOpenChange: setDoneOpen,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-5 w-5 text-brand" }), " Pendaftaran Berhasil"]
				}) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "Data Anda telah dikirim dan sedang menunggu verifikasi Admin. Anda sudah dapat masuk ke halaman Login, tetapi job baru tersedia setelah akun berhasil diverifikasi."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogFooter, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					onClick: () => navigate({ to: "/login" }),
					className: "gradient-brand text-brand-foreground",
					children: "Ke Halaman Masuk"
				}) })
			] })
		})]
	});
}
//#endregion
export { RegisterBuzzerPage as component };
