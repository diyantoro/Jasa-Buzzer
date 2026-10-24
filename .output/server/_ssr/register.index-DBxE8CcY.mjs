import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as Link, y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { L as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as Button } from "./button-BkEeRci-.mjs";
import { n as Label, t as Input } from "./label-B7oQAA24.mjs";
import { Ft as ChartColumn, Gt as ArrowLeft, b as ShieldCheck, i as Users } from "../_libs/lucide-react.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-Dg1urBTx.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { i as registerAccount } from "./auth-CNL2N2Mo.mjs";
import { t as PasswordInput } from "./password-input-DzpCA7kV.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/register.index-DBxE8CcY.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var INDUSTRI = [
	"Retail",
	"F&B",
	"Fintech",
	"Politik",
	"Edukasi",
	"Teknologi",
	"Kesehatan",
	"Otomotif",
	"Lainnya"
];
function RegisterPage() {
	const navigate = useNavigate();
	const [industri, setIndustri] = (0, import_react.useState)("");
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [confirm, setConfirm] = (0, import_react.useState)("");
	const [loading, setLoading] = (0, import_react.useState)(false);
	const confirmMismatch = confirm.length > 0 && confirm !== password;
	const handleCustomer = async (e) => {
		e.preventDefault();
		const fd = new FormData(e.currentTarget);
		const name = String(fd.get("name") || "").trim();
		const customerEmail = email.trim();
		if (!name || !customerEmail) return toast.error("Nama dan email wajib diisi.");
		if (!industri) return toast.error("Pilih industri terlebih dulu.");
		if (password.length < 8) return toast.error("Kata sandi minimal 8 karakter.");
		if (confirm !== password) return toast.error("Ulangi kata sandi belum cocok.");
		setLoading(true);
		const phone = String(fd.get("phone") || "").replace(/\D/g, "");
		const city = String(fd.get("city") || "").trim();
		const res = await registerAccount({
			role: "customer",
			name,
			email: customerEmail,
			password,
			phone,
			city,
			company: name,
			industry: industri
		});
		setLoading(false);
		if (!res.ok) return toast.error(res.message);
		toast.success("Akun customer berhasil dibuat! Silakan masuk.");
		navigate({ to: "/login" });
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-screen bg-gradient-to-br from-background via-background to-accent/30",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto grid min-h-screen max-w-6xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-2 lg:items-center",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "hidden lg:block",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/",
						className: "inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-4 w-4" }), " Kembali ke beranda"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
						className: "mt-6 font-display text-4xl font-bold leading-tight",
						children: [
							"Mulai perjalanan ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-gradient-brand",
								children: "viral"
							}),
							" brand Anda"
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-muted-foreground",
						children: "Daftar gratis dalam 30 detik dan langsung susun kampanye pertama Anda."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-10 grid gap-4",
						children: [
							{
								i: Users,
								t: "Jangkau audiens lebih luas",
								d: "Hubungkan campaign Anda dengan buzzer yang sesuai kebutuhan brand."
							},
							{
								i: ChartColumn,
								t: "Pantau campaign real-time",
								d: "Lihat progres campaign, bukti pengerjaan, dan hasilnya dalam satu dashboard."
							},
							{
								i: ShieldCheck,
								t: "Pembayaran transparan",
								d: "Kelola biaya campaign dengan proses pembayaran yang jelas dan aman."
							}
						].map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-2xl border border-border bg-card p-5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "inline-flex h-10 w-10 items-center justify-center rounded-lg gradient-brand text-brand-foreground",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(f.i, { className: "h-5 w-5" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "mt-3 font-display text-lg font-bold",
									children: f.t
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-sm text-muted-foreground",
									children: f.d
								})
							]
						}, f.t))
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-3xl border border-border bg-card p-6 shadow-glow sm:p-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/",
						className: "mb-4 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground lg:hidden",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-4 w-4" }), " Kembali"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-2xl font-bold",
						children: "Buat akun customer"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: "Gratis, tanpa kartu kredit."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: handleCustomer,
						className: "mt-6 space-y-4",
						autoComplete: "new-password",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "c-name",
								children: "Nama brand / perusahaan"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "c-name",
								name: "name",
								placeholder: "Contoh: PT Kreatif Digital",
								required: true
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "c-email",
								children: "Email"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "c-email",
								name: "customer-email",
								type: "email",
								autoComplete: "new-email",
								value: email,
								onChange: (e) => setEmail(e.target.value),
								placeholder: "nama@buzzhub.id",
								required: true
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "c-phone",
										children: "No. WhatsApp"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "c-phone",
										name: "phone",
										inputMode: "numeric",
										pattern: "[0-9]*",
										placeholder: "081234567890",
										onChange: (e) => {
											e.currentTarget.value = e.currentTarget.value.replace(/\D/g, "");
										}
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "c-city",
										children: "Kota"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "c-city",
										name: "city",
										placeholder: "Contoh: Jakarta"
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Industri" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
										value: industri,
										onValueChange: setIndustri,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Pilih industri" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: INDUSTRI.map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: i,
											children: i
										}, i)) })]
									})] })
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PasswordInput, {
								id: "c-pass",
								name: "customer-password",
								label: "Kata sandi",
								autoComplete: "new-password",
								value: password,
								onChange: (e) => setPassword(e.target.value),
								placeholder: "Minimal 8 karakter",
								showStrength: true,
								required: true
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PasswordInput, {
								id: "c-pass-confirm",
								name: "customer-password-confirm",
								label: "Ulangi kata sandi",
								autoComplete: "new-password",
								value: confirm,
								onChange: (e) => setConfirm(e.target.value),
								placeholder: "Ketik ulang kata sandi",
								hint: confirm.length === 0 ? void 0 : confirmMismatch ? "Kata sandi belum cocok." : "Kata sandi cocok.",
								hintTone: confirmMismatch ? "error" : "success",
								required: true
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "submit",
								disabled: loading || confirmMismatch,
								className: "w-full gradient-brand text-brand-foreground hover:opacity-90",
								children: loading ? "Memproses..." : "Daftar sebagai Customer"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-6 text-center text-sm text-muted-foreground",
						children: [
							"Sudah punya akun?",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/login",
								className: "font-semibold text-brand hover:underline",
								children: "Masuk"
							})
						]
					})
				]
			})]
		})
	});
}
//#endregion
export { RegisterPage as component };
