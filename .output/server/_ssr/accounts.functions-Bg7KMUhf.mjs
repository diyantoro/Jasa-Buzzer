import { a as TSS_SERVER_FUNCTION, i as createServerFn } from "./server-DCVbxAm0.mjs";
import { i as stringType, n as numberType, r as objectType, t as enumType } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/accounts.functions-Bg7KMUhf.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var SALT = "buzzhub::v1::";
async function hashPassword(email, password) {
	const data = new TextEncoder().encode(`${SALT}${email.toLowerCase()}::${password}`);
	const digest = await crypto.subtle.digest("SHA-256", data);
	return Array.from(new Uint8Array(digest)).map((b) => b.toString(16).padStart(2, "0")).join("");
}
var registerSchema = objectType({
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
var loginSchema = objectType({
	email: stringType().email(),
	password: stringType().min(1)
});
var updateAccountSchema = objectType({
	email: stringType().email(),
	name: stringType().min(1),
	phone: stringType().regex(/^\d*$/, "Nomor WhatsApp hanya boleh berisi angka.").optional(),
	timezone: stringType().optional(),
	currentPassword: stringType().optional(),
	newPassword: stringType().min(8).optional()
});
var updateAdminRatingSchema = objectType({
	id: stringType().uuid(),
	adminEmail: stringType().email(),
	stars: numberType().int().min(1).max(5),
	comment: stringType().optional()
});
var deleteAdminRatingSchema = objectType({
	id: stringType().uuid(),
	adminEmail: stringType().email()
});
var submitFollowerUpdateSchema = objectType({
	id: stringType().uuid(),
	buzzerEmail: stringType().email(),
	followers: numberType().int().positive(),
	proofUrl: stringType().url()
});
var registerAccountFn_createServerFn_handler = createServerRpc({
	id: "020330dc4a26c0368ffc0a176d51894bde986c6311b0fa9665d5a8ca1ef457e3",
	name: "registerAccountFn",
	filename: "src/lib/accounts.functions.ts"
}, (opts) => registerAccountFn.__executeServer(opts));
var registerAccountFn = createServerFn({ method: "POST" }).validator((data) => data).handler(registerAccountFn_createServerFn_handler, async ({ data: raw }) => {
	try {
		const parsed = registerSchema.safeParse(raw);
		if (!parsed.success) return {
			ok: false,
			message: "Data tidak valid. Periksa email dan kata sandi Anda."
		};
		const data = parsed.data;
		const { supabaseAdmin } = await import("./client.server-ByS0LJkl.mjs");
		const email = data.email.trim().toLowerCase();
		const { data: existing } = await supabaseAdmin.from("app_accounts").select("email").eq("email", email).maybeSingle();
		if (existing) return {
			ok: false,
			message: "Email sudah terdaftar. Silakan masuk."
		};
		const accountRow = {
			email,
			name: data.name.trim(),
			role: data.role,
			password_hash: await hashPassword(email, data.password)
		};
		const fullProfileRow = {
			...accountRow,
			...data.phone !== void 0 && data.phone !== null ? { phone: data.phone } : {},
			...data.city !== void 0 && data.city !== null ? { city: data.city } : {},
			...data.bio !== void 0 && data.bio !== null ? { bio: data.bio } : {},
			...data.company !== void 0 && data.company !== null ? { company: data.company } : {},
			...data.industry !== void 0 && data.industry !== null ? { industry: data.industry } : {},
			...data.username !== void 0 && data.username !== null ? { username: data.username } : {},
			...data.platform !== void 0 && data.platform !== null ? { platform: data.platform } : {},
			...data.followers !== void 0 && data.followers !== null ? { followers: data.followers } : {},
			...data.avatar_url ? { avatar_url: data.avatar_url } : {}
		};
		let insertError = null;
		try {
			const { error } = await supabaseAdmin.from("app_accounts").insert(fullProfileRow);
			insertError = error;
		} catch (error) {
			insertError = error;
		}
		if (insertError) {
			const msg = insertError instanceof Error ? insertError.message : typeof insertError === "object" && insertError && "message" in insertError && typeof insertError.message === "string" ? insertError.message : String(insertError);
			console.error("[Register] Database error:", insertError);
			if (msg.includes("Invalid API key") || msg.includes("JWT")) return {
				ok: false,
				message: "API key Supabase tidak valid. Gunakan secret key server dari Supabase, bukan publishable key."
			};
			if (/column .* does not exist|undefined column/i.test(msg)) {
				const { error: fallbackError } = await supabaseAdmin.from("app_accounts").insert(accountRow);
				if (fallbackError) {
					console.error("[Register] Fallback database error:", fallbackError);
					return {
						ok: false,
						message: "Gagal menyimpan akun. Periksa struktur tabel app_accounts di Supabase."
					};
				}
				if (data.role === "customer") await supabaseAdmin.from("customer_accounts").upsert({
					email,
					name: data.company?.trim() || data.name.trim(),
					active: true
				}, { onConflict: "email" });
				return {
					ok: true,
					account: {
						email,
						name: data.name.trim(),
						role: data.role
					}
				};
			}
			if (/duplicate key|already exists|unique constraint/i.test(msg)) return {
				ok: false,
				message: "Email ini sudah terdaftar. Silakan masuk."
			};
			return {
				ok: false,
				message: `Gagal menyimpan akun: ${msg}`
			};
		}
		if (data.role === "customer") {
			const { error: customerError } = await supabaseAdmin.from("customer_accounts").upsert({
				email,
				name: data.company?.trim() || data.name.trim(),
				active: true
			}, { onConflict: "email" });
			if (customerError) console.error("[Register] Customer profile database error:", customerError);
		}
		return {
			ok: true,
			account: {
				email,
				name: data.name.trim(),
				role: data.role
			}
		};
	} catch (err) {
		console.error("[Register] Server error:", err);
		if (err instanceof Error && err.message.includes("SUPABASE_SERVICE_ROLE_KEY")) return {
			ok: false,
			message: "Server belum dikonfigurasi. Tambahkan SUPABASE_SERVICE_ROLE_KEY di environment server."
		};
		if (err instanceof Error && err.message.includes("Invalid API key")) return {
			ok: false,
			message: "API key Supabase tidak valid. Periksa SUPABASE_SERVICE_ROLE_KEY di environment server."
		};
		return {
			ok: false,
			message: "Gagal terhubung ke server. Coba lagi."
		};
	}
});
var loginAccountFn_createServerFn_handler = createServerRpc({
	id: "96499aedaf88f4f87d79e46ab04d2858a99d06cb0c2879e856c7ef4318a2d8bc",
	name: "loginAccountFn",
	filename: "src/lib/accounts.functions.ts"
}, (opts) => loginAccountFn.__executeServer(opts));
var loginAccountFn = createServerFn({ method: "POST" }).validator((data) => data).handler(loginAccountFn_createServerFn_handler, async ({ data: raw }) => {
	const parsed = loginSchema.safeParse(raw);
	if (!parsed.success) return {
		ok: false,
		message: "Email atau kata sandi tidak valid."
	};
	const data = parsed.data;
	const { supabaseAdmin } = await import("./client.server-ByS0LJkl.mjs");
	const email = data.email.trim().toLowerCase();
	const selectColumns = "email, name, role, password_hash, phone, city, bio, company, industry, username, platform, followers, avatar_url";
	let row = null;
	try {
		const { data, error } = await supabaseAdmin.from("app_accounts").select(selectColumns).eq("email", email).maybeSingle();
		if (error) throw error;
		row = data;
	} catch (error) {
		const message = error instanceof Error ? error.message : String(error);
		if (/column .* does not exist|undefined column/i.test(message)) {
			const { data, error: fallbackError } = await supabaseAdmin.from("app_accounts").select("email, name, role, password_hash").eq("email", email).maybeSingle();
			if (fallbackError) throw fallbackError;
			row = data;
		} else throw error;
	}
	if (!row) return {
		ok: false,
		message: "Akun tidak ditemukan."
	};
	if (row.password_hash !== await hashPassword(email, data.password)) return {
		ok: false,
		message: "Kata sandi salah."
	};
	return {
		ok: true,
		account: {
			email: row.email,
			name: row.name,
			role: row.role,
			profile: {
				phone: row.phone ?? void 0,
				city: row.city ?? void 0,
				bio: row.bio ?? void 0,
				company: row.company ?? void 0,
				industry: row.industry ?? void 0,
				username: row.username ?? void 0,
				platform: row.platform ?? void 0,
				followers: typeof row.followers === "number" ? row.followers : void 0,
				avatarUrl: row.avatar_url ?? void 0
			}
		}
	};
});
var updateAccountFn_createServerFn_handler = createServerRpc({
	id: "5f4f7867e97540434c750e0bab32ef51109cd8f5317350ce18e2b3a3a1e434d8",
	name: "updateAccountFn",
	filename: "src/lib/accounts.functions.ts"
}, (opts) => updateAccountFn.__executeServer(opts));
var updateAccountFn = createServerFn({ method: "POST" }).validator((data) => data).handler(updateAccountFn_createServerFn_handler, async ({ data: raw }) => {
	const parsed = updateAccountSchema.safeParse(raw);
	if (!parsed.success) return {
		ok: false,
		message: "Data akun tidak valid."
	};
	const data = parsed.data;
	const { supabaseAdmin } = await import("./client.server-ByS0LJkl.mjs");
	const email = data.email.trim().toLowerCase();
	const { data: account, error: accountError } = await supabaseAdmin.from("app_accounts").select("email, role, password_hash").eq("email", email).maybeSingle();
	if (accountError) throw accountError;
	if (!account || account.role !== "admin") return {
		ok: false,
		message: "Akun admin tidak ditemukan."
	};
	if (data.newPassword) {
		if (!data.currentPassword || account.password_hash !== await hashPassword(email, data.currentPassword)) return {
			ok: false,
			message: "Password lama tidak sesuai."
		};
	}
	const update = {
		name: data.name.trim(),
		phone: data.phone?.trim() ?? "",
		...data.newPassword ? { password_hash: await hashPassword(email, data.newPassword) } : {}
	};
	const { error } = await supabaseAdmin.from("app_accounts").update(update).eq("email", email);
	if (error) throw error;
	return { ok: true };
});
var updateAdminRatingFn_createServerFn_handler = createServerRpc({
	id: "a1639a3c3aeacfd7fd51b84eb2136e1a76e47d16d21645883ea6d1ed780f6968",
	name: "updateAdminRatingFn",
	filename: "src/lib/accounts.functions.ts"
}, (opts) => updateAdminRatingFn.__executeServer(opts));
var updateAdminRatingFn = createServerFn({ method: "POST" }).validator((data) => data).handler(updateAdminRatingFn_createServerFn_handler, async ({ data: raw }) => {
	const parsed = updateAdminRatingSchema.safeParse(raw);
	if (!parsed.success) return {
		ok: false,
		message: "Data ulasan tidak valid."
	};
	const data = parsed.data;
	const { supabaseAdmin } = await import("./client.server-ByS0LJkl.mjs");
	const adminEmail = data.adminEmail.trim().toLowerCase();
	const { data: account, error: accountError } = await supabaseAdmin.from("app_accounts").select("email, role").eq("email", adminEmail).maybeSingle();
	if (accountError) throw accountError;
	if (!account || account.role !== "admin") return {
		ok: false,
		message: "Akun admin tidak ditemukan."
	};
	const { error } = await supabaseAdmin.from("buzzer_ratings").update({
		stars: data.stars,
		comment: data.comment?.trim() || null
	}).eq("id", data.id);
	if (error) throw error;
	return { ok: true };
});
var deleteAdminRatingFn_createServerFn_handler = createServerRpc({
	id: "e4a505c93475ea239473ae461403dc7734b329443df2bc8dbe2ee1163dadb10b",
	name: "deleteAdminRatingFn",
	filename: "src/lib/accounts.functions.ts"
}, (opts) => deleteAdminRatingFn.__executeServer(opts));
var deleteAdminRatingFn = createServerFn({ method: "POST" }).validator((data) => data).handler(deleteAdminRatingFn_createServerFn_handler, async ({ data: raw }) => {
	const parsed = deleteAdminRatingSchema.safeParse(raw);
	if (!parsed.success) return {
		ok: false,
		message: "Data ulasan tidak valid."
	};
	const data = parsed.data;
	const { supabaseAdmin } = await import("./client.server-ByS0LJkl.mjs");
	const adminEmail = data.adminEmail.trim().toLowerCase();
	const { data: account, error: accountError } = await supabaseAdmin.from("app_accounts").select("email, role").eq("email", adminEmail).maybeSingle();
	if (accountError) throw accountError;
	if (!account || account.role !== "admin") return {
		ok: false,
		message: "Akun admin tidak ditemukan."
	};
	const { error } = await supabaseAdmin.from("buzzer_ratings").delete().eq("id", data.id);
	if (error) throw error;
	return { ok: true };
});
var submitFollowerUpdateFn_createServerFn_handler = createServerRpc({
	id: "2cec35e7329da95f9f3a086e71594d158db50cec8870b775dcd30e5d055f5f44",
	name: "submitFollowerUpdateFn",
	filename: "src/lib/accounts.functions.ts"
}, (opts) => submitFollowerUpdateFn.__executeServer(opts));
var submitFollowerUpdateFn = createServerFn({ method: "POST" }).validator((data) => data).handler(submitFollowerUpdateFn_createServerFn_handler, async ({ data: raw }) => {
	const parsed = submitFollowerUpdateSchema.safeParse(raw);
	if (!parsed.success) return {
		ok: false,
		message: "Data followers atau bukti tidak valid."
	};
	const data = parsed.data;
	const { supabaseAdmin } = await import("./client.server-ByS0LJkl.mjs");
	const email = data.buzzerEmail.trim().toLowerCase();
	const { data: account, error: accountError } = await supabaseAdmin.from("app_accounts").select("email, role").eq("email", email).maybeSingle();
	if (accountError) throw accountError;
	if (!account || account.role !== "buzzer") return {
		ok: false,
		message: "Akun buzzer tidak ditemukan."
	};
	const { error } = await supabaseAdmin.from("social_accounts").update({
		pending_followers: data.followers,
		pending_proof_url: data.proofUrl,
		pending_submitted_at: (/* @__PURE__ */ new Date()).toISOString(),
		pending_verification: "Menunggu",
		pending_rejection_note: null
	}).eq("id", data.id).eq("buzzer_email", email);
	if (error) throw error;
	return { ok: true };
});
//#endregion
export { deleteAdminRatingFn_createServerFn_handler, loginAccountFn_createServerFn_handler, registerAccountFn_createServerFn_handler, submitFollowerUpdateFn_createServerFn_handler, updateAccountFn_createServerFn_handler, updateAdminRatingFn_createServerFn_handler };
