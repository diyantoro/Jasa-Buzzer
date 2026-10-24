import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as Link, y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { L as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as Button } from "./button-BkEeRci-.mjs";
import { n as Label, t as Input } from "./label-B7oQAA24.mjs";
import { Gt as ArrowLeft, X as LoaderCircle, Y as Lock, g as Sparkles, q as Mail } from "../_libs/lucide-react.mjs";
import { t as assignLevelFromVerification } from "./buzzer-level-B8egucK7.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as setSession, i as registerAccount, n as findAccount } from "./auth-CNL2N2Mo.mjs";
import { p as getApplicationByEmail } from "./buzzer-verification-COVCzkVL.mjs";
import { t as PasswordInput } from "./password-input-DzpCA7kV.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/login-uwY-AeTl.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var USERS = [
	{
		name: "Super Admin",
		email: "admin@buzzhub.id",
		password: "Admin123!",
		role: "admin"
	},
	{
		name: "Buzzer Premium",
		email: "buzzer@buzzhub.id",
		password: "Buzzer123!",
		role: "buzzer"
	},
	{
		name: "Customer Utama",
		email: "customer@buzzhub.id",
		password: "Customer123!",
		role: "customer"
	}
];
function LoginPage() {
	const navigate = useNavigate();
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [remember, setRemember] = (0, import_react.useState)(true);
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	const [warning, setWarning] = (0, import_react.useState)(null);
	const handleSubmit = async (e) => {
		e.preventDefault();
		setError(null);
		setWarning(null);
		if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
			setError("Format email tidak valid.");
			return;
		}
		if (password.length < 6) {
			setError("Kata sandi minimal 6 karakter.");
			return;
		}
		setLoading(true);
		await new Promise((r) => setTimeout(r, 700));
		const emailLc = email.trim().toLowerCase();
		const demo = USERS.find((u) => u.email.toLowerCase() === emailLc && u.password === password);
		let user = await findAccount(emailLc, password);
		if (demo?.role === "admin" && !user) {
			if ((await registerAccount({
				role: "admin",
				name: demo.name,
				email: demo.email,
				password: demo.password
			})).ok) user = {
				role: demo.role,
				name: demo.name,
				email: demo.email
			};
			else user = await findAccount(emailLc, password);
		} else if (demo && !user) user = {
			role: demo.role,
			name: demo.name,
			email: demo.email
		};
		const app = await getApplicationByEmail(emailLc);
		if (app && (!user || user.role === "buzzer")) {
			if (app.status === "approved" && !user) {
				await registerAccount({
					role: "buzzer",
					name: app.name,
					email: app.email,
					password,
					phone: app.phone,
					city: app.city,
					bio: app.bio,
					username: app.username,
					platform: app.platform,
					followers: app.followers,
					industry: app.category
				});
				await assignLevelFromVerification(app.email, app.name, app.followers);
				const restoredUser = await findAccount(app.email, password);
				setSession(restoredUser ?? {
					role: "buzzer",
					name: app.name,
					email: app.email,
					phone: app.phone,
					city: app.city,
					bio: app.bio,
					username: app.username,
					platform: app.platform,
					followers: app.followers
				});
				if (remember) localStorage.setItem("buzzhub.remember", app.email);
				toast.success(`Selamat datang, ${app.name}!`);
				navigate({ to: `/buzzer` });
				return;
			}
		}
		if (!user) {
			setLoading(false);
			setError("Email atau kata sandi salah. Coba akun demo di bawah.");
			return;
		}
		setSession(user);
		if (remember) localStorage.setItem("buzzhub.remember", user.email);
		if (user.role === "buzzer" && app?.status === "pending") toast.warning("Menunggu Verifikasi Admin", { description: "Data pendaftaran Anda sedang diperiksa. Job akan tersedia setelah akun diverifikasi." });
		else if (user.role === "buzzer" && app?.status === "rejected") toast.error("Verifikasi Ditolak", { description: "Pendaftaran Anda telah ditolak oleh Admin. Anda tidak dapat mengambil job melalui akun ini." });
		else if (user.role === "buzzer" && app?.status === "approved") toast.success("Verifikasi Berhasil", { description: "Selamat! Job yang sesuai dengan kategori Anda sekarang tersedia." });
		else toast.success(`Selamat datang, ${user.name}!`);
		navigate({ to: `/${user.role}` });
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-screen bg-gradient-to-br from-sky-50 via-background to-blue-50",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto grid min-h-screen max-w-6xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:py-12",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/",
					className: "inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-4 w-4" }), " Kembali ke beranda"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-3.5 w-3.5 text-brand" }), " Platform Buzzer #1 di Indonesia"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
						className: "mt-4 font-display text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl",
						children: ["Masuk ke ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-gradient-brand",
							children: "BuzzHub"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 max-w-md text-muted-foreground",
						children: "Satu login untuk semua peran. Sistem akan mengarahkan Anda otomatis ke dashboard sesuai role akun."
					})
				] })]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-3xl border border-border bg-card p-6 shadow-glow sm:p-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "grid h-11 w-11 place-items-center rounded-xl gradient-brand text-brand-foreground",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-5 w-5" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-2xl font-bold",
							children: "Masuk ke akun"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground",
							children: "Gunakan email & kata sandi Anda."
						})] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: handleSubmit,
						className: "mt-6 space-y-4",
						noValidate: true,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "email",
								children: "Email"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative mt-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "email",
									type: "email",
									autoComplete: "email",
									placeholder: "nama@perusahaan.id",
									value: email,
									onChange: (e) => setEmail(e.target.value),
									className: "pl-9",
									required: true
								})]
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PasswordInput, {
								id: "password",
								label: "Kata sandi",
								autoComplete: "current-password",
								placeholder: "Minimal 6 karakter",
								value: password,
								onChange: (e) => setPassword(e.target.value),
								leftIcon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "h-4 w-4" }),
								required: true
							}),
							warning && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								role: "status",
								className: "rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-800 dark:border-amber-700/60 dark:bg-amber-500/10 dark:text-amber-200",
								children: warning
							}),
							error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								role: "alert",
								className: "rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive",
								children: error
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "flex items-center gap-2 text-muted-foreground",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "checkbox",
										checked: remember,
										onChange: (e) => setRemember(e.target.checked),
										className: "h-4 w-4 rounded border-border accent-[color:var(--brand)]"
									}), "Ingat saya"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => toast.info("Tautan reset sandi telah dikirim ke email Anda."),
									className: "font-medium text-brand hover:underline",
									children: "Lupa sandi?"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "submit",
								disabled: loading,
								className: "w-full gradient-brand text-brand-foreground hover:opacity-90",
								children: loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }), " Memproses…"] }) : "Masuk"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-6 text-center text-sm text-muted-foreground",
						children: [
							"Belum punya akun?",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/register",
								className: "font-semibold text-brand hover:underline",
								children: "Daftar gratis"
							})
						]
					})
				]
			})]
		})
	});
}
//#endregion
export { LoginPage as component };
