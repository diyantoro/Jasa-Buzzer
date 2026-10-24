import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { d as useRouterState, y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as TSS_SERVER_FUNCTION, i as createServerFn, o as getServerFnById } from "./server-DCVbxAm0.mjs";
import { i as stringType, n as numberType, r as objectType, t as enumType } from "../_libs/zod.mjs";
import { n as supabase } from "./client-DwoA1QoZ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auth-CNL2N2Mo.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
objectType({
	name: stringType().min(1),
	email: stringType().email(),
	password: stringType().min(6),
	role: enumType([
		"admin",
		"buzzer",
		"customer"
	]),
	phone: stringType().regex(/^\d*$/, "Nomor WhatsApp hanya boleh berisi angka.").optional().nullable(),
	city: stringType().optional().nullable(),
	bio: stringType().optional().nullable(),
	company: stringType().optional().nullable(),
	industry: stringType().optional().nullable(),
	username: stringType().optional().nullable(),
	platform: stringType().optional().nullable(),
	followers: numberType().int().nonnegative().optional().nullable(),
	avatar_url: stringType().optional().nullable()
});
objectType({
	email: stringType().email(),
	password: stringType().min(1)
});
objectType({
	email: stringType().email(),
	name: stringType().min(1),
	phone: stringType().regex(/^\d*$/, "Nomor WhatsApp hanya boleh berisi angka.").optional(),
	timezone: stringType().optional(),
	currentPassword: stringType().optional(),
	newPassword: stringType().min(8).optional()
});
objectType({
	id: stringType().uuid(),
	adminEmail: stringType().email(),
	stars: numberType().int().min(1).max(5),
	comment: stringType().optional()
});
objectType({
	id: stringType().uuid(),
	adminEmail: stringType().email()
});
objectType({
	id: stringType().uuid(),
	buzzerEmail: stringType().email(),
	followers: numberType().int().positive(),
	proofUrl: stringType().url()
});
var registerAccountFn = createServerFn({ method: "POST" }).validator((data) => data).handler(createSsrRpc("020330dc4a26c0368ffc0a176d51894bde986c6311b0fa9665d5a8ca1ef457e3"));
var loginAccountFn = createServerFn({ method: "POST" }).validator((data) => data).handler(createSsrRpc("96499aedaf88f4f87d79e46ab04d2858a99d06cb0c2879e856c7ef4318a2d8bc"));
var updateAccountFn = createServerFn({ method: "POST" }).validator((data) => data).handler(createSsrRpc("5f4f7867e97540434c750e0bab32ef51109cd8f5317350ce18e2b3a3a1e434d8"));
createServerFn({ method: "POST" }).validator((data) => data).handler(createSsrRpc("a1639a3c3aeacfd7fd51b84eb2136e1a76e47d16d21645883ea6d1ed780f6968"));
createServerFn({ method: "POST" }).validator((data) => data).handler(createSsrRpc("e4a505c93475ea239473ae461403dc7734b329443df2bc8dbe2ee1163dadb10b"));
createServerFn({ method: "POST" }).validator((data) => data).handler(createSsrRpc("2cec35e7329da95f9f3a086e71594d158db50cec8870b775dcd30e5d055f5f44"));
var KEY = "buzzhub.session";
function getSession() {
	if (typeof window === "undefined") return null;
	try {
		const raw = localStorage.getItem(KEY);
		return raw ? JSON.parse(raw) : null;
	} catch {
		return null;
	}
}
function setSession(s) {
	localStorage.setItem(KEY, JSON.stringify({
		...s,
		email: s.email.trim().toLowerCase()
	}));
	window.dispatchEvent(new Event("buzzhub:session"));
}
function clearSession() {
	localStorage.removeItem(KEY);
	window.dispatchEvent(new Event("buzzhub:session"));
}
async function registerAccount(acc) {
	try {
		const res = await registerAccountFn({ data: {
			name: acc.name,
			email: acc.email,
			password: acc.password,
			role: acc.role,
			phone: acc.phone,
			city: acc.city,
			bio: acc.bio,
			company: acc.company,
			industry: acc.industry,
			username: acc.username,
			platform: acc.platform,
			followers: acc.followers,
			avatar_url: acc.avatarUrl
		} });
		return res.ok ? { ok: true } : {
			ok: false,
			message: res.message
		};
	} catch {
		return {
			ok: false,
			message: "Gagal terhubung ke server. Coba lagi."
		};
	}
}
async function findAccount(email, password) {
	try {
		const res = await loginAccountFn({ data: {
			email: email.trim().toLowerCase(),
			password
		} });
		if (!res.ok) return null;
		return {
			role: res.account.role,
			name: res.account.name,
			email: res.account.email,
			phone: res.account.profile?.phone,
			city: res.account.profile?.city,
			bio: res.account.profile?.bio,
			company: res.account.profile?.company,
			industry: res.account.profile?.industry,
			username: res.account.profile?.username,
			platform: res.account.profile?.platform,
			followers: res.account.profile?.followers,
			avatarUrl: res.account.profile?.avatarUrl
		};
	} catch {
		return null;
	}
}
function useSession() {
	const [session, setS] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		const s = getSession();
		setS(s);
		if (s?.email && !s.avatarUrl) supabase.from("app_accounts").select("avatar_url").eq("email", s.email.trim().toLowerCase()).maybeSingle().then(({ data }) => {
			if (data?.avatar_url) {
				const current = getSession();
				if (current && current.email.toLowerCase() === s.email.toLowerCase() && !current.avatarUrl) setSession({
					...current,
					avatarUrl: data.avatar_url
				});
			}
		});
		const handler = () => setS(getSession());
		window.addEventListener("buzzhub:session", handler);
		window.addEventListener("storage", handler);
		return () => {
			window.removeEventListener("buzzhub:session", handler);
			window.removeEventListener("storage", handler);
		};
	}, []);
	return session;
}
function useRequireRole(role) {
	const navigate = useNavigate();
	const session = useSession();
	const path = useRouterState({ select: (s) => s.location.pathname });
	(0, import_react.useEffect)(() => {
		if (typeof window === "undefined") return;
		const s = getSession();
		if (!s) navigate({ to: "/login" });
		else if (s.role !== role) navigate({ to: `/${s.role}` });
	}, [
		navigate,
		path,
		role
	]);
	return session;
}
//#endregion
export { setSession as a, useSession as c, registerAccount as i, findAccount as n, updateAccountFn as o, getSession as r, useRequireRole as s, clearSession as t };
