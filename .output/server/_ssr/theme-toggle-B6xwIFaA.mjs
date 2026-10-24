import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { L as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { t as Button } from "./button-BkEeRci-.mjs";
import { V as Moon, m as Sun } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/theme-toggle-B6xwIFaA.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var KEY = "buzzhub.theme";
function getInitial() {
	if (typeof window === "undefined") return "light";
	const saved = localStorage.getItem(KEY);
	if (saved === "light" || saved === "dark") return saved;
	return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}
function apply(theme) {
	const root = document.documentElement;
	root.classList.toggle("dark", theme === "dark");
	root.style.colorScheme = theme;
}
if (typeof window !== "undefined") try {
	apply(getInitial());
} catch {}
function useTheme() {
	const [theme, setThemeState] = (0, import_react.useState)("light");
	(0, import_react.useEffect)(() => {
		const t = getInitial();
		setThemeState(t);
		apply(t);
		const mq = window.matchMedia("(prefers-color-scheme: dark)");
		const onChange = () => {
			if (!localStorage.getItem(KEY)) {
				const sys = mq.matches ? "dark" : "light";
				setThemeState(sys);
				apply(sys);
			}
		};
		mq.addEventListener("change", onChange);
		return () => mq.removeEventListener("change", onChange);
	}, []);
	const setTheme = (t) => {
		localStorage.setItem(KEY, t);
		setThemeState(t);
		apply(t);
	};
	return {
		theme,
		setTheme,
		toggle: () => setTheme(theme === "dark" ? "light" : "dark")
	};
}
function ThemeToggle({ className }) {
	const { theme, toggle } = useTheme();
	const isDark = theme === "dark";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
		type: "button",
		variant: "outline",
		size: "icon",
		onClick: toggle,
		"aria-label": isDark ? "Aktifkan mode terang" : "Aktifkan mode gelap",
		title: isDark ? "Mode terang" : "Mode gelap",
		className: cn("relative h-9 w-9 overflow-hidden rounded-full border-border bg-card", className),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sun, { className: cn("absolute h-4 w-4 transition-all duration-300", isDark ? "-translate-y-6 rotate-90 opacity-0" : "translate-y-0 rotate-0 opacity-100") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Moon, { className: cn("absolute h-4 w-4 transition-all duration-300", isDark ? "translate-y-0 rotate-0 opacity-100" : "translate-y-6 -rotate-90 opacity-0") })]
	});
}
//#endregion
export { useTheme as n, ThemeToggle as t };
