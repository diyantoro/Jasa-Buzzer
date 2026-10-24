import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { L as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { n as Label, t as Input } from "./label-B7oQAA24.mjs";
import { mt as EyeOff, pt as Eye } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/password-input-DzpCA7kV.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var STRENGTH_LEVELS = {
	1: {
		label: "Lemah",
		bar: "bg-rose-500",
		text: "text-rose-600 dark:text-rose-400"
	},
	2: {
		label: "Sedang",
		bar: "bg-amber-500",
		text: "text-amber-600 dark:text-amber-400"
	},
	3: {
		label: "Kuat",
		bar: "bg-emerald-500",
		text: "text-emerald-600 dark:text-emerald-400"
	},
	4: {
		label: "Sangat kuat",
		bar: "bg-emerald-500",
		text: "text-emerald-600 dark:text-emerald-400"
	}
};
function getPasswordStrength(value, minLength = 8) {
	const checks = {
		length: value.length >= minLength,
		mixedCase: /[a-z]/.test(value) && /[A-Z]/.test(value),
		number: /\d/.test(value),
		symbol: /[^A-Za-z0-9]/.test(value)
	};
	const score = Object.values(checks).filter(Boolean).length;
	const level = STRENGTH_LEVELS[score] ?? STRENGTH_LEVELS[1];
	const unmet = [
		!checks.length && `minimal ${minLength} karakter`,
		!checks.mixedCase && "huruf besar & kecil",
		!checks.number && "angka",
		!checks.symbol && "simbol"
	].filter(Boolean);
	return {
		score,
		label: level.label,
		barClass: level.bar,
		textClass: level.text,
		unmet
	};
}
var HINT_TONE = {
	muted: "text-muted-foreground",
	success: "text-emerald-600 dark:text-emerald-400",
	error: "text-destructive"
};
function PasswordInput({ label, leftIcon, showStrength = false, minLength = 8, hint, hintTone = "muted", id, className, disabled, ...props }) {
	const generatedId = (0, import_react.useId)();
	const inputId = id ?? generatedId;
	const [show, setShow] = (0, import_react.useState)(false);
	const rawValue = props.value ?? props.defaultValue;
	const value = typeof rawValue === "string" ? rawValue : "";
	const strength = getPasswordStrength(value, minLength);
	const showStrengthBar = showStrength && value.length > 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		label ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
			htmlFor: inputId,
			children: label
		}) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative mt-1.5",
			children: [
				leftIcon ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground",
					"aria-hidden": "true",
					children: leftIcon
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					id: inputId,
					type: show ? "text" : "password",
					disabled,
					className: cn(leftIcon && "pl-9", "pr-10", className),
					...props
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					disabled,
					onClick: () => setShow((s) => !s),
					onMouseDown: (e) => e.preventDefault(),
					className: "absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
					"aria-label": show ? "Sembunyikan kata sandi" : "Tampilkan kata sandi",
					"aria-pressed": show,
					children: show ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-4 w-4" })
				})
			]
		}),
		showStrengthBar ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-2 space-y-1",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex gap-1",
				children: [
					1,
					2,
					3,
					4
				].map((step) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("h-1 flex-1 rounded-full transition-colors", step <= strength.score ? strength.barClass : "bg-muted") }, step))
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: cn("text-xs font-medium", strength.textClass),
				children: [
					"Kekuatan: ",
					strength.label,
					strength.unmet.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "font-normal text-muted-foreground",
						children: [
							" ",
							"· Perlu ",
							strength.unmet.join(", ")
						]
					}) : null
				]
			})]
		}) : null,
		hint ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: cn("mt-1.5 text-xs", HINT_TONE[hintTone]),
			children: hint
		}) : null
	] });
}
//#endregion
export { PasswordInput as t };
