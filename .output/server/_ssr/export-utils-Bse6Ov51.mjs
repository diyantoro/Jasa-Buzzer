import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { L as require_jsx_runtime, a as Overlay2, c as Title2, d as DialogContent, f as DialogDescription, g as DialogTrigger, h as DialogTitle, i as Description2, l as Dialog, m as DialogPortal, n as Cancel, o as Portal2, p as DialogOverlay, r as Content2, s as Root2, t as Action, u as DialogClose } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { n as supabase } from "./client-DwoA1QoZ.mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { n as buttonVariants, t as Button } from "./button-BkEeRci-.mjs";
import { G as Megaphone, I as PanelLeftOpen, J as LogOut, L as PanelLeftClose, n as X } from "../_libs/lucide-react.mjs";
import { r as getBuzzerPercentageForLevel } from "./buzzer-level-B8egucK7.mjs";
import { v as notifyTaskApproved, y as notifyTaskRejected } from "./router-BuTnQWI2.mjs";
import { n as AvatarFallback, r as AvatarImage, t as Avatar } from "./table-C9Hv1VxK.mjs";
import { n as SwitchThumb, t as Switch$1 } from "../_libs/radix-ui__react-switch.mjs";
import { n as Root, t as Indicator } from "../_libs/radix-ui__react-progress.mjs";
import { a as Trigger, i as Root3, n as Portal, r as Provider, t as Content2$1 } from "../_libs/radix-ui__react-tooltip.mjs";
import { n as writeFileSync, t as utils } from "../_libs/xlsx.mjs";
import { t as E } from "../_libs/jspdf.mjs";
import { t as autoTable } from "../_libs/jspdf-autotable.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/export-utils-Bse6Ov51.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function useRealtime(table, order) {
	const channelId = (0, import_react.useId)().replace(/[^a-zA-Z0-9_-]/g, "");
	const [data, setData] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [error, setError] = (0, import_react.useState)(null);
	const fetchAll = (0, import_react.useCallback)(async () => {
		setLoading(true);
		setError(null);
		const client = supabase;
		try {
			const { data: rows, error: queryError } = await client.from(table).select("*").order(order.column, { ascending: order.ascending }).limit(500);
			if (queryError) throw queryError;
			setData(rows ?? []);
		} catch (queryError) {
			const message = queryError instanceof Error ? queryError.message : typeof queryError === "object" && queryError !== null && "message" in queryError && typeof queryError.message === "string" ? queryError.message : String(queryError);
			console.error(`[Supabase] Failed to load ${table}:`, queryError);
			setData([]);
			setError(message);
		} finally {
			setLoading(false);
		}
	}, [
		table,
		order.column,
		order.ascending
	]);
	(0, import_react.useEffect)(() => {
		fetchAll();
		const ch = supabase.channel(`rt-${table}-${channelId}`).on("postgres_changes", {
			event: "*",
			schema: "public",
			table
		}, () => fetchAll()).subscribe();
		return () => {
			supabase.removeChannel(ch);
		};
	}, [
		table,
		fetchAll,
		channelId
	]);
	return {
		data,
		loading,
		error,
		refetch: fetchAll
	};
}
var useCampaigns = () => useRealtime("campaigns", {
	column: "created_at",
	ascending: false
});
var useServiceCatalogs = () => useRealtime("service_catalogs", {
	column: "created_at",
	ascending: false
});
var useServicePricings = () => useRealtime("service_pricing", {
	column: "platform",
	ascending: true
});
async function createServicePricing(input) {
	const { error } = await supabase.from("service_pricing").insert(input);
	if (error) throw error;
}
async function updateServicePricing(id, input) {
	const { error } = await supabase.from("service_pricing").update(input).eq("id", id);
	if (error) throw error;
}
async function deleteServicePricing(id) {
	const { error } = await supabase.from("service_pricing").delete().eq("id", id);
	if (error) throw error;
}
var useCampaignJobs = () => useRealtime("campaign_jobs", {
	column: "created_at",
	ascending: false
});
var useCampaignJobSubmissions = () => useRealtime("campaign_job_submissions", {
	column: "created_at",
	ascending: false
});
function useCompletedCampaignJobs() {
	const channelId = (0, import_react.useId)().replace(/[^a-zA-Z0-9_-]/g, "");
	const [data, setData] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [error, setError] = (0, import_react.useState)(null);
	const fetchCompleted = (0, import_react.useCallback)(async () => {
		setLoading(true);
		setError(null);
		try {
			const { data: rows, error: queryError } = await supabase.from("campaign_jobs").select("*").or("status.eq.Selesai,admin_verified_at.not.is.null").order("updated_at", { ascending: false });
			if (queryError) throw queryError;
			setData(rows ?? []);
		} catch (err) {
			console.error("[Supabase] Failed to load completed campaign_jobs:", err);
			setError(err?.message || String(err));
		} finally {
			setLoading(false);
		}
	}, []);
	(0, import_react.useEffect)(() => {
		fetchCompleted();
		const ch = supabase.channel(`rt-completed-jobs-${channelId}`).on("postgres_changes", {
			event: "*",
			schema: "public",
			table: "campaign_jobs"
		}, () => {
			fetchCompleted();
		}).subscribe();
		return () => {
			supabase.removeChannel(ch);
		};
	}, [fetchCompleted, channelId]);
	return {
		data,
		loading,
		error,
		refetch: fetchCompleted
	};
}
function useBuzzerCampaignJobs(buzzerEmail) {
	const channelId = (0, import_react.useId)().replace(/[^a-zA-Z0-9_-]/g, "");
	const [data, setData] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const email = buzzerEmail.trim().toLowerCase();
	const fetchAvailable = (0, import_react.useCallback)(async () => {
		if (!email) {
			setData([]);
			setLoading(false);
			return;
		}
		setLoading(true);
		try {
			const { data: myAssignedJobs, error: myError } = await supabase.from("campaign_jobs").select("*").ilike("buzzer_email", email).order("updated_at", { ascending: false });
			if (myError) console.warn("[Supabase] Failed to load assigned buzzer jobs:", myError);
			const { data: openRows, error: openError } = await supabase.from("campaign_jobs").select("*").eq("status", "Tersedia").is("buzzer_email", null).order("created_at", { ascending: false }).limit(2e3);
			if (openError) console.warn("[Supabase] Failed to load open campaign jobs:", openError);
			const jobMap = /* @__PURE__ */ new Map();
			for (const j of openRows ?? []) jobMap.set(j.id, j);
			for (const j of myAssignedJobs ?? []) jobMap.set(j.id, j);
			setData(Array.from(jobMap.values()));
		} catch (err) {
			console.error("[Supabase] Exception in useBuzzerCampaignJobs:", err);
		} finally {
			setLoading(false);
		}
	}, [email]);
	(0, import_react.useEffect)(() => {
		if (!email) return;
		fetchAvailable();
		const channelName = `rt-buzzer-campaign-jobs-${email.replace(/[^a-zA-Z0-9_-]/g, "_")}-${channelId}-${Math.random().toString(36).slice(2, 7)}`;
		const channel = supabase.channel(channelName).on("postgres_changes", {
			event: "*",
			schema: "public",
			table: "campaign_jobs"
		}, () => {
			fetchAvailable();
		}).on("postgres_changes", {
			event: "*",
			schema: "public",
			table: "campaigns"
		}, () => {
			fetchAvailable();
		}).on("postgres_changes", {
			event: "*",
			schema: "public",
			table: "social_accounts"
		}, () => {
			fetchAvailable();
		}).on("postgres_changes", {
			event: "*",
			schema: "public",
			table: "buzzer_applications",
			filter: `email=eq.${email}`
		}, () => {
			fetchAvailable();
		}).subscribe((status) => {
			if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") console.warn(`[Supabase] Realtime unavailable for ${email}:`, status);
		});
		return () => {
			supabase.removeChannel(channel);
		};
	}, [
		email,
		fetchAvailable,
		channelId
	]);
	return {
		data,
		loading,
		refetch: fetchAvailable
	};
}
async function takeCampaignJob(id, buzzerEmail, buzzerName) {
	const email = buzzerEmail.trim().toLowerCase();
	const { data: job, error: jobError } = await supabase.from("campaign_jobs").select("platform").eq("id", id).maybeSingle();
	if (jobError) throw jobError;
	if (!job) throw new Error("Job sudah tidak tersedia.");
	const { data: matchingAccount, error: accountError } = await supabase.from("social_accounts").select("id").eq("buzzer_email", email).ilike("platform", job.platform).ilike("verification", "Terverifikasi").limit(1).maybeSingle();
	if (accountError) throw accountError;
	if (!matchingAccount) {
		const { data: acc } = await supabase.from("app_accounts").select("platform").eq("email", email).ilike("platform", job.platform).maybeSingle();
		if (!acc) throw new Error("Akun media sosial belum ada, ayo daftar");
	}
	const { error } = await supabase.rpc("claim_campaign_job", {
		p_job_id: id,
		p_buzzer_email: email,
		p_buzzer_name: buzzerName
	});
	if (error) throw new Error(error.message || "Job sudah tidak tersedia.");
}
async function submitCampaignJobProof(id, url, buzzerEmail = "") {
	const { data: previous, error: previousError } = await supabase.from("campaign_job_submissions").select("submission_number").eq("job_id", id).order("submission_number", { ascending: false }).limit(1).maybeSingle();
	if (previousError) throw previousError;
	const submissionNumber = (previous?.submission_number ?? 0) + 1;
	const { error: submissionError } = await supabase.from("campaign_job_submissions").insert({
		job_id: id,
		buzzer_email: buzzerEmail.trim().toLowerCase(),
		proof_url: url,
		submission_number: submissionNumber,
		status: "Review"
	});
	if (submissionError) throw submissionError;
	const { data, error } = await supabase.from("campaign_jobs").update({
		status: "Review",
		proof_url: url,
		note: null,
		rejection_reason: null,
		rejected_at: null,
		rejected_by: null,
		admin_verified_at: null,
		customer_rated_at: null,
		resubmission_count: Math.max(0, submissionNumber - 1),
		submitted_at: (/* @__PURE__ */ new Date()).toISOString(),
		updated_at: (/* @__PURE__ */ new Date()).toISOString()
	}).eq("id", id).select("id, proof_url, status").maybeSingle();
	if (error) {
		console.error("[Proof Upload] Supabase campaign_jobs update error:", error);
		throw error;
	}
	if (!data?.proof_url) {
		const updateError = /* @__PURE__ */ new Error("Bukti berhasil diunggah tetapi belum tersimpan ke job.");
		console.error("[Proof Upload] Invalid campaign_jobs update response:", data);
		throw updateError;
	}
}
async function reviewCampaignJob(id, status, note) {
	const { error } = await supabase.from("campaign_jobs").update({
		status,
		note: note ?? null,
		...status === "Review" || status === "Selesai" ? { admin_verified_at: (/* @__PURE__ */ new Date()).toISOString() } : {}
	}).eq("id", id);
	if (error) throw error;
	const { error: submissionError } = await supabase.from("campaign_job_submissions").update({
		status,
		reviewed_at: (/* @__PURE__ */ new Date()).toISOString()
	}).eq("job_id", id).eq("status", "Review");
	if (submissionError) throw submissionError;
	if (status === "Review" || status === "Selesai") {
		const { data: job } = await supabase.from("campaign_jobs").select("*").eq("id", id).maybeSingle();
		if (job?.buzzer_email) {
			const fee = Number(job.buzzer_amount || job.payout || 0);
			if (fee > 0) {
				const buzzerEmail = job.buzzer_email.trim().toLowerCase();
				const { data: existingAct } = await supabase.from("finance_activity").select("id").eq("ref_table", "campaign_jobs").eq("ref_id", String(id)).eq("type", "buzzer").maybeSingle();
				if (!existingAct) {
					const { data: curWallet } = await supabase.from("buzzer_wallets").select("balance").eq("buzzer_email", buzzerEmail).maybeSingle();
					const prevBal = Number(curWallet?.balance ?? 0);
					await supabase.from("buzzer_wallets").upsert({
						buzzer_email: buzzerEmail,
						buzzer_name: job.buzzer_name || buzzerEmail,
						balance: prevBal + fee,
						updated_at: (/* @__PURE__ */ new Date()).toISOString()
					});
					await supabase.from("finance_activity").insert({
						type: "buzzer",
						title: "Payout Buzzer",
						description: `${job.campaign_title} - payout buzzer disetujui admin`,
						amount: fee,
						ref_table: "campaign_jobs",
						ref_id: String(id)
					});
					const adminFee = Math.max(0, Number(job.gross_price || 0) - fee);
					if (adminFee > 0) await supabase.from("finance_activity").insert({
						type: "admin",
						title: "Komisi Admin",
						description: `${job.campaign_title} - komisi admin dari pengerjaan yang diverifikasi`,
						amount: adminFee,
						ref_table: "campaign_jobs",
						ref_id: String(id)
					});
				}
			}
			if (status === "Review" || status === "Selesai") notifyTaskApproved({
				buzzerEmail: job.buzzer_email,
				campaignTitle: job.campaign_title || "Kampanye",
				fee,
				jobId: id
			});
		}
		if (job?.campaign_id) {
			const { data: campaignJobs } = await supabase.from("campaign_jobs").select("buzzer_email, admin_verified_at").eq("campaign_id", job.campaign_id);
			if (campaignJobs?.length && campaignJobs.every((item) => item.buzzer_email && item.admin_verified_at)) await supabase.from("campaigns").update({ status: "Selesai" }).eq("id", job.campaign_id);
		}
	}
}
async function rejectCampaignJob(id, reason, rejectedBy = "admin") {
	const cleanReason = reason.trim();
	if (!cleanReason) throw new Error("Alasan penolakan wajib diisi.");
	const rejectedAt = (/* @__PURE__ */ new Date()).toISOString();
	const { data: latest, error: latestError } = await supabase.from("campaign_job_submissions").select("id").eq("job_id", id).order("submission_number", { ascending: false }).limit(1).maybeSingle();
	if (latestError) throw latestError;
	if (latest?.id) {
		const { error } = await supabase.from("campaign_job_submissions").update({
			status: "Ditolak",
			rejection_reason: cleanReason,
			rejected_at: rejectedAt,
			rejected_by: rejectedBy,
			reviewed_at: rejectedAt
		}).eq("id", latest.id);
		if (error) throw error;
	} else {
		const { data: job, error: jobError } = await supabase.from("campaign_jobs").select("proof_url, buzzer_email").eq("id", id).maybeSingle();
		if (jobError) throw jobError;
		if (job?.proof_url) {
			const { error } = await supabase.from("campaign_job_submissions").insert({
				job_id: id,
				buzzer_email: job.buzzer_email ?? "",
				proof_url: job.proof_url,
				submission_number: 1,
				status: "Ditolak",
				rejection_reason: cleanReason,
				rejected_at: rejectedAt,
				rejected_by: rejectedBy,
				reviewed_at: rejectedAt
			});
			if (error) throw error;
		}
	}
	const { error } = await supabase.from("campaign_jobs").update({
		status: "Revisi",
		note: cleanReason,
		rejection_reason: cleanReason,
		rejected_at: rejectedAt,
		rejected_by: rejectedBy,
		admin_verified_at: null,
		customer_rated_at: null
	}).eq("id", id);
	if (error) throw error;
	try {
		const { data: job } = await supabase.from("campaign_jobs").select("buzzer_email, campaign_title").eq("id", id).maybeSingle();
		if (job?.buzzer_email) notifyTaskRejected({
			buzzerEmail: job.buzzer_email,
			campaignTitle: job.campaign_title || "Kampanye",
			reason: cleanReason,
			jobId: id
		});
	} catch (e) {
		console.warn("Gagal mengirim notifikasi penolakan tugas:", e);
	}
}
async function updateCampaignJob(id, updates) {
	const { error } = await supabase.from("campaign_jobs").update(updates).eq("id", id);
	if (error) throw error;
}
async function deleteCampaignJob(id) {
	try {
		await supabase.from("campaign_job_submissions").delete().eq("job_id", id);
	} catch (e) {
		console.warn("Gagal menghapus submissions terkait:", e);
	}
	try {
		await supabase.from("buzzer_ratings").delete().eq("job_id", id);
	} catch (e) {
		console.warn("Gagal menghapus rating terkait:", e);
	}
	const { error } = await supabase.from("campaign_jobs").delete().eq("id", id);
	if (error) throw error;
}
/** Menghitung split pendapatan buzzer dan komisi admin berdasarkan level buzzer (Bronze 40%, Silver 45%, Gold 50%, Platinum 55%, Diamond 60%). */
function calculateCampaignJobSplit(job) {
	const total = Math.max(0, Number(job?.grossPrice ?? job?.gross_price ?? job?.gross_amount ?? job?.budget) || 0);
	const level = job?.buzzer_level ?? job?.buzzerLevel;
	const targetPct = getBuzzerPercentageForLevel(level);
	let buzzerShare;
	let adminShare;
	if (total > 0) {
		buzzerShare = Math.round(total * targetPct / 100);
		adminShare = Math.max(0, total - buzzerShare);
	} else {
		buzzerShare = 0;
		adminShare = 0;
	}
	return {
		total,
		buzzerPercent: targetPct,
		adminPercent: 100 - targetPct,
		buzzerShare,
		adminShare,
		levelName: level ?? "Bronze"
	};
}
/** Admin creates a product listing only; this never creates a campaign, job, or payment. */
async function createServiceCatalog(input) {
	const payload = {
		...input,
		status: input.status ?? "Aktif"
	};
	const { error } = await supabase.from("service_catalogs").insert(payload);
	if (error) {
		if (error.message?.includes("payout_per_buzzer")) {
			const { payout_per_buzzer, ...safePayload } = payload;
			const { error: retryErr } = await supabase.from("service_catalogs").insert(safePayload);
			if (retryErr) throw retryErr;
			return;
		}
		throw error;
	}
}
async function updateServiceCatalogStatus(id, status) {
	const { error } = await supabase.from("service_catalogs").update({ status }).eq("id", id);
	if (error) throw error;
}
async function updateServiceCatalog(id, input) {
	const { error } = await supabase.from("service_catalogs").update(input).eq("id", id);
	if (error) {
		if (error.message?.includes("payout_per_buzzer")) {
			const { payout_per_buzzer, ...safeInput } = input;
			const { error: retryErr } = await supabase.from("service_catalogs").update(safeInput).eq("id", id);
			if (retryErr) throw retryErr;
			return;
		}
		throw error;
	}
}
async function deleteServiceCatalog(id) {
	try {
		await supabase.from("catalog_packages").delete().eq("catalog_id", id);
		await supabase.from("campaigns").update({ catalog_id: null }).eq("catalog_id", id);
	} catch (err) {
		console.warn("Error cleaning up catalog references:", err);
	}
	const { error } = await supabase.from("service_catalogs").delete().eq("id", id);
	if (error) throw error;
}
async function createCustomerPaymentCampaign(input) {
	const formatDatabaseError = (value) => {
		if (value instanceof Error) return value.message;
		if (typeof value === "object" && value !== null) {
			const candidate = value;
			return [
				candidate.message,
				candidate.code ? `code ${candidate.code}` : null,
				candidate.details,
				candidate.hint
			].filter((part) => typeof part === "string" && part.length > 0).join(" | ") || JSON.stringify(value);
		}
		return String(value);
	};
	if (input.catalog_id) {
		if (input.package_id) {
			const { data, error } = await supabase.rpc("create_customer_catalog_package_scheduled_payment_campaign", {
				p_catalog_id: input.catalog_id,
				p_package_id: input.package_id,
				p_invoice_no: input.invoice_no,
				p_customer_name: input.customer_name,
				p_customer_email: input.customer_email,
				p_campaign_name: input.campaign_name,
				p_method: input.method,
				p_note: input.note,
				p_brief: input.brief,
				p_start_date: input.start_date,
				p_deadline: input.deadline,
				p_package_name: input.package_name ?? null,
				p_package_price: input.package_price ?? input.amount,
				p_package_buzzer_count: input.package_buzzer_count ?? input.slots
			});
			if (error) throw new Error(formatDatabaseError(error));
			const row = Array.isArray(data) ? data[0] : data;
			if (!row?.payment_id || !row?.campaign_id) throw new Error("Database tidak mengembalikan ID pembayaran dan campaign.");
			return {
				paymentId: row.payment_id,
				campaignId: row.campaign_id
			};
		}
		const { data, error } = await supabase.rpc("create_customer_catalog_scheduled_payment_campaign", {
			p_catalog_id: input.catalog_id,
			p_invoice_no: input.invoice_no,
			p_customer_name: input.customer_name,
			p_customer_email: input.customer_email,
			p_campaign_name: input.campaign_name,
			p_method: input.method,
			p_note: input.note,
			p_brief: input.brief,
			p_start_date: input.start_date,
			p_deadline: input.deadline,
			p_slots: input.slots
		});
		if (error) throw new Error(formatDatabaseError(error));
		const row = Array.isArray(data) ? data[0] : data;
		if (!row?.payment_id || !row?.campaign_id) throw new Error("Database tidak mengembalikan ID pembayaran dan campaign.");
		return {
			paymentId: row.payment_id,
			campaignId: row.campaign_id
		};
	}
	const { data: customData, error: customError } = await supabase.rpc("create_customer_custom_scheduled_payment_campaign", {
		p_invoice_no: input.invoice_no,
		p_customer_name: input.customer_name,
		p_customer_email: input.customer_email,
		p_campaign_name: input.campaign_name,
		p_platform: input.campaign_type,
		p_service_type: input.service_type ?? "",
		p_method: input.method,
		p_note: input.note,
		p_brief: input.brief,
		p_slots: input.slots,
		p_start_date: input.start_date,
		p_deadline: input.deadline
	});
	if (customError) throw new Error(formatDatabaseError(customError));
	const customRow = Array.isArray(customData) ? customData[0] : customData;
	if (!customRow?.payment_id || !customRow?.campaign_id) throw new Error("Database tidak mengembalikan ID pembayaran dan campaign.");
	return {
		paymentId: customRow.payment_id,
		campaignId: customRow.campaign_id
	};
}
/** Admin menyetujui kampanye: status jadi Aktif + job dibuka untuk buzzer sesuai jumlah slot. */
async function approveCampaign(c) {
	const paymentId = c.payment_id;
	if (!paymentId) throw new Error("Campaign belum memiliki pembayaran untuk diverifikasi.");
	const { error } = await supabase.rpc("approve_campaign_payment", {
		p_payment_id: paymentId,
		p_admin_email: "admin"
	});
	if (error) throw error;
}
/** Admin menolak kampanye. */
async function rejectCampaign(id, note) {
	const { error } = await supabase.from("campaigns").update({
		status: "Dibatalkan",
		brief: note ? `[Ditolak] ${note}` : void 0
	}).eq("id", id);
	if (error) throw error;
}
/**
* Admin memperbarui detail kampanye (judul, brief, deadline).
* Snapshot pada campaign_jobs ikut disinkronkan: judul & deadline untuk semua job,
* brief hanya untuk job yang brief-nya masih sama dengan brief kampanye lama.
*/
async function updateCampaignDetails(id, patch) {
	const title = patch.title.trim();
	if (!title) throw new Error("Judul kampanye wajib diisi.");
	const { data: current, error: fetchError } = await supabase.from("campaigns").select("brief").eq("id", id).single();
	if (fetchError || !current) throw new Error("Kampanye tidak ditemukan.");
	const { error } = await supabase.from("campaigns").update({
		title,
		brief: patch.brief,
		deadline: patch.deadline,
		updated_at: (/* @__PURE__ */ new Date()).toISOString()
	}).eq("id", id);
	if (error) throw error;
	const { error: jobsError } = await supabase.from("campaign_jobs").update({
		campaign_title: title,
		deadline: patch.deadline
	}).eq("campaign_id", id);
	if (jobsError) console.error("Gagal sinkron judul/deadline job:", jobsError);
	const oldBrief = current.brief ?? "";
	if (oldBrief !== patch.brief) {
		const { error: briefError } = await supabase.from("campaign_jobs").update({ brief: patch.brief }).eq("campaign_id", id).eq("brief", oldBrief);
		if (briefError) console.error("Gagal sinkron brief job:", briefError);
	}
}
/** Admin menghapus kampanye secara permanen beserta data relasinya. */
async function deleteCampaign(id) {
	const { data: jobs } = await supabase.from("campaign_jobs").select("id").eq("campaign_id", id);
	const jobIds = (jobs || []).map((j) => j.id);
	if (jobIds.length > 0) {
		await supabase.from("campaign_job_submissions").delete().in("job_id", jobIds);
		await supabase.from("buzzer_ratings").delete().in("job_id", jobIds);
	}
	await supabase.from("buzzer_ratings").delete().eq("campaign_id", id);
	await supabase.from("campaign_messages").delete().eq("campaign_id", id);
	await supabase.from("campaign_jobs").delete().eq("campaign_id", id);
	await supabase.from("payments").update({ campaign_id: null }).eq("campaign_id", id);
	const { error } = await supabase.from("campaigns").delete().eq("id", id);
	if (error) throw error;
}
var Switch = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch$1, {
	className: cn("peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input", className),
	...props,
	ref,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SwitchThumb, { className: cn("pointer-events-none block h-4 w-4 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0") })
}));
Switch.displayName = Switch$1.displayName;
var AlertDialog = Root2;
var AlertDialogPortal = Portal2;
var AlertDialogOverlay = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Overlay2, {
	className: cn("fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className),
	...props,
	ref
}));
AlertDialogOverlay.displayName = Overlay2.displayName;
var AlertDialogContent = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogOverlay, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content2, {
	ref,
	className: cn("fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-lg", className),
	...props
})] }));
AlertDialogContent.displayName = Content2.displayName;
var AlertDialogHeader = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col space-y-2 text-center sm:text-left", className),
	...props
});
AlertDialogHeader.displayName = "AlertDialogHeader";
var AlertDialogFooter = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
	...props
});
AlertDialogFooter.displayName = "AlertDialogFooter";
var AlertDialogTitle = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Title2, {
	ref,
	className: cn("text-lg font-semibold", className),
	...props
}));
AlertDialogTitle.displayName = Title2.displayName;
var AlertDialogDescription = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Description2, {
	ref,
	className: cn("text-sm text-muted-foreground", className),
	...props
}));
AlertDialogDescription.displayName = Description2.displayName;
var AlertDialogAction = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Action, {
	ref,
	className: cn(buttonVariants(), className),
	...props
}));
AlertDialogAction.displayName = Action.displayName;
var AlertDialogCancel = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cancel, {
	ref,
	className: cn(buttonVariants({ variant: "outline" }), "mt-2 sm:mt-0", className),
	...props
}));
AlertDialogCancel.displayName = Cancel.displayName;
var Sheet = Dialog;
var SheetTrigger = DialogTrigger;
var SheetPortal = DialogPortal;
var SheetOverlay = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, {
	className: cn("fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className),
	...props,
	ref
}));
SheetOverlay.displayName = DialogOverlay.displayName;
var sheetVariants = cva("fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500 data-[state=open]:animate-in data-[state=closed]:animate-out", {
	variants: { side: {
		top: "inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
		bottom: "inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
		left: "inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm",
		right: "inset-y-0 right-0 h-full w-3/4 border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm"
	} },
	defaultVariants: { side: "right" }
});
var SheetContent = import_react.forwardRef(({ side = "right", className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetOverlay, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
	ref,
	className: cn(sheetVariants({ side }), className),
	...props,
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogClose, {
		className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background cursor-pointer transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "sr-only",
			children: "Close"
		})]
	}), children]
})] }));
SheetContent.displayName = DialogContent.displayName;
var SheetHeader = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col space-y-2 text-center sm:text-left", className),
	...props
});
SheetHeader.displayName = "SheetHeader";
var SheetFooter = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
	...props
});
SheetFooter.displayName = "SheetFooter";
var SheetTitle = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
	ref,
	className: cn("text-lg font-semibold text-foreground", className),
	...props
}));
SheetTitle.displayName = DialogTitle.displayName;
var SheetDescription = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
	ref,
	className: cn("text-sm text-muted-foreground", className),
	...props
}));
SheetDescription.displayName = DialogDescription.displayName;
function StatCard({ label, value, hint, icon }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl border border-border bg-card p-5 shadow-sm transition-shadow hover:shadow-md",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-medium uppercase tracking-wide text-muted-foreground",
					children: label
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "grid h-9 w-9 place-items-center rounded-lg bg-accent text-accent-foreground",
					children: icon
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 font-display text-2xl font-bold",
				children: value
			}),
			hint && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-xs text-muted-foreground",
				children: hint
			})
		]
	});
}
function StatusBadge({ status }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold", {
			Aktif: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
			Berjalan: "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300",
			Selesai: "bg-zinc-200 text-zinc-700 dark:bg-zinc-500/20 dark:text-zinc-200",
			Review: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
			Verifikasi: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
			"Menunggu Verifikasi Admin": "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
			"Menunggu Verifikasi": "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
			Menunggu: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
			Pending: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
			Diproses: "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300",
			Disetujui: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
			Berhasil: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
			Lunas: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
			Ditolak: "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300",
			Gagal: "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300",
			Refund: "bg-purple-100 text-purple-700 dark:bg-purple-500/15 dark:text-purple-300",
			Nonaktif: "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300"
		}[status] ?? "bg-muted text-muted-foreground"),
		children: status
	});
}
var Progress = import_react.forwardRef(({ className, value, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Root, {
	ref,
	className: cn("relative h-2 w-full overflow-hidden rounded-full bg-primary/20", className),
	...props,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Indicator, {
		className: "h-full w-full flex-1 bg-primary transition-all",
		style: { transform: `translateX(-${100 - (value || 0)}%)` }
	})
}));
Progress.displayName = Root.displayName;
var TooltipProvider = Provider;
var Tooltip = Root3;
var TooltipTrigger = Trigger;
var TooltipContent = import_react.forwardRef(({ className, sideOffset = 4, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Portal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content2$1, {
	ref,
	sideOffset,
	className: cn("z-50 overflow-hidden rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-tooltip-content-transform-origin)", className),
	...props
}) }));
TooltipContent.displayName = Content2$1.displayName;
var STORAGE_PREFIX = "buzzhub.sidebar_collapsed.";
/** Status ciut/buka sidebar untuk desktop, diingat di browser. */
function useSidebarCollapsed(storageKey) {
	const [collapsed, setCollapsed] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		try {
			setCollapsed(localStorage.getItem(STORAGE_PREFIX + storageKey) === "1");
		} catch {}
	}, [storageKey]);
	return {
		collapsed,
		toggle: (0, import_react.useCallback)(() => {
			setCollapsed((current) => {
				const next = !current;
				try {
					localStorage.setItem(STORAGE_PREFIX + storageKey, next ? "1" : "0");
				} catch {}
				return next;
			});
		}, [storageKey])
	};
}
function initials(name) {
	const parts = name.trim().split(/\s+/).filter(Boolean);
	if (parts.length === 0) return "?";
	return parts.slice(0, 2).map((p) => p[0]?.toUpperCase() ?? "").join("");
}
function NavButton({ item, active, collapsed, onNavigate }) {
	const button = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		"data-section": item.key,
		onClick: () => onNavigate(item.key),
		"aria-current": active ? "page" : void 0,
		"aria-label": collapsed ? item.label : void 0,
		className: cn("relative flex w-full items-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", collapsed ? "justify-center px-0 py-2.5" : "gap-3 px-3 py-2", active ? "bg-muted font-semibold text-foreground" : "font-medium text-muted-foreground hover:bg-muted/60 hover:text-foreground"),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				"aria-hidden": "true",
				className: cn("absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-brand transition-opacity", active ? "opacity-100" : "opacity-0")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: cn("shrink-0 [&>svg]:h-[18px] [&>svg]:w-[18px]", active && "text-brand"),
				children: item.icon
			}),
			!collapsed ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "truncate",
				children: item.label
			}) : null
		]
	});
	if (!collapsed) return button;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tooltip, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TooltipTrigger, {
		asChild: true,
		children: button
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TooltipContent, {
		side: "right",
		children: item.label
	})] });
}
function SidebarNav({ nav, activeKey, onNavigate, user, onLogout, collapsed = false }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-full flex-col",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: cn("mb-6 flex items-center gap-2", collapsed ? "justify-center" : "px-1"),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/",
					className: cn("flex min-w-0 items-center gap-2", collapsed && "justify-center"),
					title: "BuzzHub",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-brand text-brand-foreground",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Megaphone, { className: "h-[18px] w-[18px]" })
					}), !collapsed ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "truncate font-display text-lg font-bold tracking-tight",
						children: "BuzzHub"
					}) : null]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
				className: "flex flex-col gap-1",
				"aria-label": "Navigasi utama",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TooltipProvider, {
					delayDuration: 200,
					children: nav.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavButton, {
						item,
						active: activeKey === item.key,
						collapsed,
						onNavigate
					}, item.key))
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-6 border-t border-border pt-4",
				children: collapsed ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Avatar, {
						className: "h-9 w-9 border border-border",
						children: [user?.avatarUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarImage, {
							src: user.avatarUrl,
							alt: user?.name ?? "Pengguna"
						}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarFallback, {
							className: "bg-muted text-[11px] font-bold text-foreground",
							children: initials(user?.name ?? "")
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						variant: "ghost",
						size: "icon",
						onClick: onLogout,
						className: "h-8 w-8 text-muted-foreground",
						"aria-label": "Keluar",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "h-4 w-4" })
					})]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3 px-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Avatar, {
						className: "h-10 w-10 shrink-0 border border-border",
						children: [user?.avatarUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarImage, {
							src: user.avatarUrl,
							alt: user?.name ?? "Pengguna"
						}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarFallback, {
							className: "bg-brand text-xs font-bold text-brand-foreground",
							children: initials(user?.name ?? "")
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0 flex-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] uppercase tracking-wide text-muted-foreground",
								children: user?.roleLabel ? `Masuk sebagai ${user.roleLabel}` : "Masuk sebagai"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "truncate text-sm font-semibold",
								children: user?.name ?? "Tamu"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "truncate text-xs text-muted-foreground",
								children: user?.email ?? ""
							})
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					size: "sm",
					variant: "outline",
					className: "mt-3 w-full",
					onClick: onLogout,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "mr-2 h-4 w-4" }), " Keluar"]
				})] })
			})
		]
	});
}
function SidebarCollapseButton({ collapsed, onToggle }) {
	const label = collapsed ? "Buka sidebar" : "Ciutkan sidebar";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TooltipProvider, {
		delayDuration: 200,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tooltip, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TooltipTrigger, {
			asChild: true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				type: "button",
				variant: "outline",
				size: "icon",
				onClick: onToggle,
				className: "hidden h-9 w-9 shrink-0 md:inline-flex",
				"aria-label": label,
				"aria-expanded": !collapsed,
				title: label,
				children: collapsed ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PanelLeftOpen, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PanelLeftClose, { className: "h-4 w-4" })
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TooltipContent, {
			side: "bottom",
			children: label
		})] })
	});
}
function MobileBottomNav({ nav, activeKey, onNavigate }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
		className: "fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 backdrop-blur-xl md:hidden",
		"aria-label": "Navigasi bawah",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex items-stretch gap-1 overflow-x-auto px-2 py-1.5 pb-[calc(0.5rem+env(safe-area-inset-bottom))] scrollbar-none",
			children: nav.map((item) => {
				const active = activeKey === item.key;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					"data-section": item.key,
					onClick: () => onNavigate(item.key),
					"aria-current": active ? "page" : void 0,
					className: cn("relative flex min-w-[56px] flex-1 flex-col items-center justify-center gap-0.5 rounded-lg px-1.5 py-1.5 text-[10px] font-medium transition-colors", active ? "text-brand" : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							"aria-hidden": "true",
							className: cn("absolute top-0 h-[2px] w-6 rounded-full bg-brand transition-opacity", active ? "opacity-100" : "opacity-0")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "[&>svg]:h-[18px] [&>svg]:w-[18px]",
							children: item.icon
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "max-w-full truncate leading-tight",
							children: item.label
						})
					]
				}, item.key);
			})
		})
	});
}
function stamp() {
	const d = /* @__PURE__ */ new Date();
	const p = (n) => String(n).padStart(2, "0");
	return `${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}-${p(d.getHours())}${p(d.getMinutes())}`;
}
function exportToExcel(filename, sheetName, rows, columns) {
	const data = rows.map((r) => {
		const o = {};
		columns.forEach((c) => o[c.header] = c.accessor(r));
		return o;
	});
	const ws = utils.json_to_sheet(data);
	const wb = utils.book_new();
	utils.book_append_sheet(wb, ws, sheetName.slice(0, 31));
	writeFileSync(wb, `${filename}-${stamp()}.xlsx`);
}
function exportToPDF(filename, title, rows, columns, summary) {
	const doc = new E({ orientation: "landscape" });
	doc.setFontSize(14);
	doc.text(title, 14, 15);
	doc.setFontSize(9);
	doc.setTextColor(120);
	doc.text(`Dicetak: ${(/* @__PURE__ */ new Date()).toLocaleString("id-ID")}`, 14, 21);
	doc.setTextColor(0);
	let startY = 26;
	if (summary && summary.length) {
		doc.setFontSize(10);
		summary.forEach((s, i) => {
			doc.text(`${s.label}: ${s.value}`, 14 + i * 80, startY);
		});
		startY += 6;
	}
	autoTable(doc, {
		head: [columns.map((c) => c.header)],
		body: rows.map((r) => columns.map((c) => String(c.accessor(r)))),
		startY,
		styles: { fontSize: 9 },
		headStyles: { fillColor: [
			124,
			58,
			237
		] }
	});
	doc.save(`${filename}-${stamp()}.pdf`);
}
//#endregion
export { rejectCampaign as A, useBuzzerCampaignJobs as B, createServicePricing as C, deleteServicePricing as D, deleteServiceCatalog as E, updateCampaignDetails as F, useServiceCatalogs as G, useCampaignJobs as H, updateCampaignJob as I, useServicePricings as K, updateServiceCatalog as L, reviewCampaignJob as M, submitCampaignJobProof as N, exportToExcel as O, takeCampaignJob as P, updateServiceCatalogStatus as R, createServiceCatalog as S, deleteCampaignJob as T, useCampaigns as U, useCampaignJobSubmissions as V, useCompletedCampaignJobs as W, StatusBadge as _, AlertDialogDescription as a, calculateCampaignJobSplit as b, AlertDialogTitle as c, Sheet as d, SheetContent as f, StatCard as g, SidebarNav as h, AlertDialogContent as i, rejectCampaignJob as j, exportToPDF as k, MobileBottomNav as l, SidebarCollapseButton as m, AlertDialogAction as n, AlertDialogFooter as o, SheetTrigger as p, useSidebarCollapsed as q, AlertDialogCancel as r, AlertDialogHeader as s, AlertDialog as t, Progress as u, Switch as v, deleteCampaign as w, createCustomerPaymentCampaign as x, approveCampaign as y, updateServicePricing as z };
