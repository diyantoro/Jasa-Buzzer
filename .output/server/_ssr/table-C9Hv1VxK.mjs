import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { L as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { n as supabase } from "./client-DwoA1QoZ.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { h as notifyRatingReceived } from "./router-BuTnQWI2.mjs";
import { n as AvatarFallback$1, r as AvatarImage$1, t as Avatar$1 } from "../_libs/radix-ui__react-avatar.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/table-C9Hv1VxK.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Avatar = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar$1, {
	ref,
	className: cn("relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full", className),
	...props
}));
Avatar.displayName = Avatar$1.displayName;
var AvatarImage = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarImage$1, {
	ref,
	className: cn("aspect-square h-full w-full", className),
	...props
}));
AvatarImage.displayName = AvatarImage$1.displayName;
var AvatarFallback = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarFallback$1, {
	ref,
	className: cn("flex h-full w-full items-center justify-center rounded-full bg-muted", className),
	...props
}));
AvatarFallback.displayName = AvatarFallback$1.displayName;
/**
* Logika weighted average rating buzzer dengan nilai peredam/prior:
* 1. Rating awal buzzer adalah 5.0.
* 2. Nilai awal default buzzer baru: current_rating = 5.0 dan total_reviews = 9.
* 3. Ketika ada rating baru dari customer (skor 1 - 5), hitung dengan rumus:
*    rating_baru = ((rating_lama * total_reviews) + skor_baru) / (total_reviews + 1)
*    Contoh: Rating 5.0 dengan ulasan baru 4 -> ((5.0 * 9) + 4) / 10 = 4.9
* 4. Pembulatan: 1 desimal (Math.round(val * 10) / 10).
*/
function calculateWeightedRating(currentRating = 0, totalReviews = 0, newScore) {
	const ratingLama = typeof currentRating === "number" && !isNaN(currentRating) && currentRating > 0 ? currentRating : 0;
	const reviewsLama = typeof totalReviews === "number" && !isNaN(totalReviews) && totalReviews > 0 ? totalReviews : 0;
	const skorBaru = Math.min(5, Math.max(1, Math.round(newScore)));
	if (reviewsLama === 0) return {
		newRating: skorBaru,
		newTotalReviews: 1
	};
	const calculatedRating = (ratingLama * reviewsLama + skorBaru) / (reviewsLama + 1);
	return {
		newRating: Math.round(calculatedRating * 10) / 10,
		newTotalReviews: reviewsLama + 1
	};
}
/**
* Update kolom rating dan total_reviews di database (buzzer_wallets dan app_accounts)
*/
async function updateBuzzerRatingAndReviews(buzzerEmail, newScore) {
	const email = buzzerEmail.trim().toLowerCase();
	if (!email) return {
		newRating: 0,
		newTotalReviews: 0
	};
	const [{ data: wallet }, { data: account }] = await Promise.all([supabase.from("buzzer_wallets").select("rating, total_reviews").eq("buzzer_email", email).maybeSingle(), supabase.from("app_accounts").select("rating, total_reviews").eq("email", email).eq("role", "buzzer").maybeSingle()]);
	const currentReviews = Number(wallet?.total_reviews != null && Number(wallet.total_reviews) >= 0 ? wallet.total_reviews : account?.total_reviews != null && Number(account.total_reviews) >= 0 ? account.total_reviews : 0);
	const { newRating, newTotalReviews } = calculateWeightedRating(currentReviews > 0 ? Number(wallet?.rating != null && Number(wallet.rating) >= 0 ? wallet.rating : account?.rating != null && Number(account.rating) >= 0 ? account.rating : 0) : 0, currentReviews, newScore);
	await Promise.allSettled([supabase.from("buzzer_wallets").update({
		rating: newRating,
		total_reviews: newTotalReviews,
		updated_at: (/* @__PURE__ */ new Date()).toISOString()
	}).eq("buzzer_email", email), supabase.from("app_accounts").update({
		rating: newRating,
		total_reviews: newTotalReviews,
		updated_at: (/* @__PURE__ */ new Date()).toISOString()
	}).eq("email", email).eq("role", "buzzer")]);
	return {
		newRating,
		newTotalReviews
	};
}
/**
* Sinkronisasi menyeluruh rating buzzer dari tabel buzzer_ratings (0 jika belum ada ulasan)
*/
async function syncBuzzerRatingFull(buzzerEmail) {
	const email = buzzerEmail.trim().toLowerCase();
	if (!email) return 0;
	const { data: rows } = await supabase.from("buzzer_ratings").select("stars").eq("buzzer_email", email);
	const ratings = rows ?? [];
	const totalReviews = ratings.length;
	if (totalReviews === 0) {
		await Promise.allSettled([supabase.from("buzzer_wallets").update({
			rating: 0,
			total_reviews: 0,
			updated_at: (/* @__PURE__ */ new Date()).toISOString()
		}).eq("buzzer_email", email), supabase.from("app_accounts").update({
			rating: 0,
			total_reviews: 0,
			updated_at: (/* @__PURE__ */ new Date()).toISOString()
		}).eq("email", email).eq("role", "buzzer")]);
		return 0;
	}
	const starSum = ratings.reduce((sum, r) => sum + Number(r.stars || 0), 0);
	const calculatedRating = Math.round(starSum / totalReviews * 10) / 10;
	await Promise.allSettled([supabase.from("buzzer_wallets").update({
		rating: calculatedRating,
		total_reviews: totalReviews,
		updated_at: (/* @__PURE__ */ new Date()).toISOString()
	}).eq("buzzer_email", email), supabase.from("app_accounts").update({
		rating: calculatedRating,
		total_reviews: totalReviews,
		updated_at: (/* @__PURE__ */ new Date()).toISOString()
	}).eq("email", email).eq("role", "buzzer")]);
	return calculatedRating;
}
function useBuzzerRatings() {
	const [data, setData] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const fetchAll = (0, import_react.useCallback)(async () => {
		const { data: rows, error } = await supabase.from("buzzer_ratings").select("*").order("created_at", { ascending: false }).limit(500);
		if (error) console.error("Gagal memuat rating buzzer:", error);
		setData(rows ?? []);
		setLoading(false);
	}, []);
	(0, import_react.useEffect)(() => {
		fetchAll();
		const ch = supabase.channel("rt-buzzer_ratings").on("postgres_changes", {
			event: "*",
			schema: "public",
			table: "buzzer_ratings"
		}, () => fetchAll()).subscribe();
		return () => {
			supabase.removeChannel(ch);
		};
	}, [fetchAll]);
	return {
		data,
		loading,
		refetch: fetchAll
	};
}
async function rateCampaignForAllBuzzers(input) {
	const stars = Math.min(5, Math.max(1, Math.round(input.stars)));
	const { error } = await supabase.rpc("rate_campaign_for_all_buzzers", {
		p_customer_id: input.customer_id,
		p_campaign_id: input.campaign_id,
		p_stars: stars,
		p_comment: input.comment?.trim() || null
	});
	if (error) {
		if (error.code === "23505") throw new Error("Campaign ini sudah diulas.");
		throw error;
	}
	try {
		const { data: jobs } = await supabase.from("campaign_jobs").select("buzzer_email").eq("campaign_id", input.campaign_id).not("buzzer_email", "is", null);
		const buzzerEmails = Array.from(new Set((jobs ?? []).map((j) => (j.buzzer_email ?? "").trim().toLowerCase()).filter(Boolean)));
		const { data: campaignData } = await supabase.from("campaigns").select("title").eq("id", input.campaign_id).maybeSingle();
		const campaignTitle = campaignData?.title || "Kampanye";
		await Promise.allSettled(buzzerEmails.map(async (email) => {
			await updateBuzzerRatingAndReviews(email, stars);
			await notifyRatingReceived({
				buzzerEmail: email,
				campaignTitle,
				stars,
				comment: input.comment
			});
		}));
	} catch (err) {
		console.error("Gagal sinkronisasi rating buzzer:", err);
	}
}
async function updateAdminBuzzerRating(input) {
	const stars = Math.min(5, Math.max(1, Math.round(input.stars)));
	const { error } = await supabase.rpc("update_admin_buzzer_rating", {
		p_rating_id: input.id,
		p_admin_email: input.admin_email,
		p_stars: stars,
		p_comment: input.comment?.trim() || null
	});
	if (error) throw error;
	try {
		const { data: ratingRow } = await supabase.from("buzzer_ratings").select("buzzer_email").eq("id", input.id).maybeSingle();
		if (ratingRow?.buzzer_email) await syncBuzzerRatingFull(ratingRow.buzzer_email);
	} catch (err) {
		console.error("Gagal sinkronisasi rating buzzer:", err);
	}
}
async function updateCustomerBuzzerRating(input) {
	const stars = Math.min(5, Math.max(1, Math.round(input.stars)));
	const normalizedEmail = input.customer_email.trim().toLowerCase();
	const { error: rpcError } = await supabase.rpc("update_customer_buzzer_rating", {
		p_rating_id: input.id,
		p_customer_email: normalizedEmail,
		p_stars: stars,
		p_comment: input.comment?.trim() || null
	});
	if (rpcError) {
		const msg = rpcError.message || "";
		if (msg.includes("Kesempatan edit") || msg.includes("Batas waktu") || msg.includes("bukan milik")) throw new Error(msg);
		const { data: ratingRowRaw, error: fetchErr } = await supabase.from("buzzer_ratings").select("*").eq("id", input.id).maybeSingle();
		const ratingRow = ratingRowRaw;
		if (fetchErr || !ratingRow) throw new Error("Ulasan tidak ditemukan.");
		if ((ratingRow.customer_id || ratingRow.customer_email || "").trim().toLowerCase() !== normalizedEmail) throw new Error("Ulasan bukan milik customer ini.");
		if ((ratingRow.customer_edit_count ?? 0) >= 1) throw new Error("Kesempatan edit ulasan sudah digunakan (maksimal 1x).");
		let completedTime = ratingRow.order_completed_at ? new Date(ratingRow.order_completed_at).getTime() : 0;
		if (!completedTime && ratingRow.campaign_id) {
			const { data: camp } = await supabase.from("campaigns").select("target_reached_at, updated_at").eq("id", ratingRow.campaign_id).maybeSingle();
			if (camp?.target_reached_at) completedTime = new Date(camp.target_reached_at).getTime();
			else if (camp?.updated_at) completedTime = new Date(camp.updated_at).getTime();
		}
		if (!completedTime) completedTime = new Date(ratingRow.created_at).getTime();
		if (Date.now() > completedTime + 864e5) throw new Error("Batas waktu edit ulasan sudah berakhir (melebihi 1x24 jam sejak pesanan selesai).");
		const newEditCount = (ratingRow.customer_edit_count ?? 0) + 1;
		const updatePayload = {
			stars,
			comment: input.comment?.trim() || null,
			customer_edit_count: newEditCount,
			updated_at: (/* @__PURE__ */ new Date()).toISOString()
		};
		if (!ratingRow.order_completed_at && completedTime) updatePayload.order_completed_at = new Date(completedTime).toISOString();
		let updateErr = null;
		if (ratingRow.campaign_id) updateErr = (await supabase.from("buzzer_ratings").update(updatePayload).eq("campaign_id", ratingRow.campaign_id).eq("customer_id", normalizedEmail)).error;
		else updateErr = (await supabase.from("buzzer_ratings").update(updatePayload).eq("id", input.id)).error;
		if (updateErr) throw new Error(updateErr.message || "Gagal memperbarui ulasan.");
	}
	try {
		const { data: ratingRow } = await supabase.from("buzzer_ratings").select("buzzer_email, campaign_id").eq("id", input.id).maybeSingle();
		if (ratingRow?.campaign_id) {
			const { data: allBuzzerRows } = await supabase.from("buzzer_ratings").select("buzzer_email").eq("campaign_id", ratingRow.campaign_id);
			const emails = Array.from(new Set((allBuzzerRows ?? []).map((r) => r.buzzer_email).filter(Boolean)));
			await Promise.allSettled(emails.map((em) => syncBuzzerRatingFull(em)));
		} else if (ratingRow?.buzzer_email) await syncBuzzerRatingFull(ratingRow.buzzer_email);
	} catch (err) {
		console.error("Gagal sinkronisasi rating buzzer:", err);
	}
}
async function deleteAdminBuzzerRating(id, adminEmail) {
	const { data: ratingRow } = await supabase.from("buzzer_ratings").select("buzzer_email").eq("id", id).maybeSingle();
	const { error } = await supabase.rpc("delete_admin_buzzer_rating", {
		p_rating_id: id,
		p_admin_email: adminEmail
	});
	if (error) throw error;
	if (ratingRow?.buzzer_email) await syncBuzzerRatingFull(ratingRow.buzzer_email);
}
function averageStars(ratings) {
	if (!ratings || !ratings.length) return 0;
	const sum = ratings.reduce((a, r) => a + Number(r.stars || 0), 0);
	return Math.round(sum / ratings.length * 10) / 10;
}
function Skeleton({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("animate-pulse rounded-md bg-primary/10", className),
		...props
	});
}
var Table = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: "relative w-full overflow-auto",
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("table", {
		ref,
		className: cn("w-full caption-bottom text-sm", className),
		...props
	})
}));
Table.displayName = "Table";
var TableHeader = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
	ref,
	className: cn("[&_tr]:border-b", className),
	...props
}));
TableHeader.displayName = "TableHeader";
var TableBody = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
	ref,
	className: cn("[&_tr:last-child]:border-0", className),
	...props
}));
TableBody.displayName = "TableBody";
var TableFooter = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tfoot", {
	ref,
	className: cn("border-t bg-muted/50 font-medium [&>tr]:last:border-b-0", className),
	...props
}));
TableFooter.displayName = "TableFooter";
var TableRow = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", {
	ref,
	className: cn("border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted", className),
	...props
}));
TableRow.displayName = "TableRow";
var TableHead = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
	ref,
	className: cn("h-10 px-2 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]", className),
	...props
}));
TableHead.displayName = "TableHead";
var TableCell = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
	ref,
	className: cn("p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]", className),
	...props
}));
TableCell.displayName = "TableCell";
var TableCaption = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("caption", {
	ref,
	className: cn("mt-4 text-sm text-muted-foreground", className),
	...props
}));
TableCaption.displayName = "TableCaption";
//#endregion
export { Table as a, TableHead as c, averageStars as d, deleteAdminBuzzerRating as f, useBuzzerRatings as g, updateCustomerBuzzerRating as h, Skeleton as i, TableHeader as l, updateAdminBuzzerRating as m, AvatarFallback as n, TableBody as o, rateCampaignForAllBuzzers as p, AvatarImage as r, TableCell as s, Avatar as t, TableRow as u };
