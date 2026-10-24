import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { L as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { n as supabase } from "./client-DwoA1QoZ.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { Gt as ArrowLeft, N as Phone, h as Star, ot as Globe, q as Mail } from "../_libs/lucide-react.mjs";
import { i as formatIDR, n as Route$2 } from "./router-BuTnQWI2.mjs";
import { a as Table, c as TableHead, d as averageStars, g as useBuzzerRatings, i as Skeleton, l as TableHeader, n as AvatarFallback, o as TableBody, r as AvatarImage, s as TableCell, t as Avatar, u as TableRow } from "./table-C9Hv1VxK.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/buzzer-profile._buzzerEmail-BW1smeIy.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function goBackFromProfile() {
	if (window.history.length > 1) {
		window.history.back();
		return;
	}
	window.location.assign("/admin");
}
function BuzzerProfilePage() {
	const { buzzerEmail } = Route$2.useParams();
	const [buzzer, setBuzzer] = (0, import_react.useState)(null);
	const [jobs, setJobs] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const { data: allRatings } = useBuzzerRatings();
	const fetchBuzzer = (0, import_react.useCallback)(async () => {
		setLoading(true);
		const decodedEmail = decodeURIComponent(buzzerEmail).trim().toLowerCase();
		try {
			const [{ data: accountData }, { data: applicationData }, { data: socialAccounts }, { data: campaignJobs }, { data: walletData }, { data: submissionData }] = await Promise.all([
				supabase.from("app_accounts").select("*").ilike("email", decodedEmail).maybeSingle(),
				supabase.from("buzzer_applications").select("*").ilike("email", decodedEmail).maybeSingle(),
				supabase.from("social_accounts").select("id, platform, username, followers, verification").ilike("buzzer_email", decodedEmail),
				supabase.from("campaign_jobs").select("*").ilike("buzzer_email", decodedEmail).order("updated_at", { ascending: false }),
				supabase.from("buzzer_wallets").select("rating, level, campaigns_completed").ilike("buzzer_email", decodedEmail).maybeSingle(),
				supabase.from("campaign_job_submissions").select("id, job_id, buzzer_email, status, submitted_at").ilike("buzzer_email", decodedEmail)
			]);
			const verifiedFollowers = (socialAccounts ?? []).filter((account) => account.verification === "Terverifikasi").reduce((sum, account) => sum + Number(account.followers ?? 0), 0);
			let allJobs = campaignJobs ?? [];
			const d = accountData || applicationData;
			if (allJobs.length === 0 && d?.name) {
				const { data: nameJobs } = await supabase.from("campaign_jobs").select("*").ilike("buzzer_name", d.name).order("updated_at", { ascending: false });
				if (nameJobs && nameJobs.length > 0) allJobs = nameJobs;
			}
			const finishedJobs = allJobs.filter((job) => job.status === "Selesai" || Boolean(job.admin_verified_at));
			const reviewJobs = allJobs.filter((job) => (job.status === "Review" || Boolean(job.proof_url)) && job.status !== "Selesai" && !job.admin_verified_at);
			allJobs.filter((job) => job.status === "Diambil" || job.status === "Revisi");
			const submissionCompleted = (submissionData ?? []).filter((s) => s.status === "Selesai" || s.status === "Review").length;
			let localJobsCount = 0;
			let localJobs = [];
			try {
				const raw = localStorage.getItem(`buzzhub.buzzer.${decodedEmail}`);
				if (raw) {
					const parsed = JSON.parse(raw);
					const rawJobs = Array.isArray(parsed?.jobs) ? parsed.jobs : [];
					const localCompleted = rawJobs.filter((j) => j.status === "Selesai" || Boolean(j.admin_verified_at) || j.status === "Review" || Boolean(j.proofUrl)).length;
					localJobsCount = Math.max(Number(parsed?.profile?.jobsCompleted ?? 0), localCompleted, rawJobs.length);
					localJobs = rawJobs.map((j) => ({
						id: j.id,
						title: j.title || "Job Kampanye",
						platform: j.platform || "Instagram",
						status: j.status || "Selesai",
						payout: Number(j.payout || 0),
						date: j.updatedAt || j.deadline || (/* @__PURE__ */ new Date()).toISOString(),
						proof_url: j.proofUrl,
						admin_verified_at: j.admin_verified_at
					}));
				}
			} catch (e) {}
			const dbWorkedJobs = finishedJobs.length + reviewJobs.length > 0 ? finishedJobs.length + reviewJobs.length : allJobs.length;
			const totalCompleted = Math.max(dbWorkedJobs, submissionCompleted, localJobsCount, Number(walletData?.campaigns_completed ?? 0), Number(accountData?.job_completed ?? 0));
			const mergedJobsMap = /* @__PURE__ */ new Map();
			allJobs.forEach((job) => {
				mergedJobsMap.set(job.id, {
					id: job.id,
					title: job.campaign_title || "Job Kampanye",
					platform: job.platform || "Instagram",
					status: job.status,
					payout: Number(job.buzzer_amount ?? job.payout ?? 0),
					date: job.updated_at || job.created_at,
					proof_url: job.proof_url,
					admin_verified_at: job.admin_verified_at
				});
			});
			localJobs.forEach((lj) => {
				if (!mergedJobsMap.has(lj.id)) mergedJobsMap.set(lj.id, lj);
			});
			setJobs(Array.from(mergedJobsMap.values()));
			if (d) setBuzzer({
				id: d.id || d.email,
				name: d.name || "Buzzer",
				email: d.email,
				username: d.username || `@${d.name?.toLowerCase().replace(/[^a-z0-9]/g, "") || "buzzer"}`,
				phone: d.phone || null,
				platform: d.platform || socialAccounts?.[0]?.platform || "Instagram",
				followers: verifiedFollowers > 0 ? verifiedFollowers : Number(d.followers || 0),
				rating: Number(walletData?.rating ?? d.rating ?? 5),
				level: walletData?.level || "Beginner",
				job_completed: totalCompleted,
				bio: d.bio || null,
				avatar_url: d.avatar_url || null,
				status: d.status || "Aktif",
				created_at: d.created_at || d.submitted_at || (/* @__PURE__ */ new Date()).toISOString(),
				city: d.city || applicationData?.city || null,
				address: d?.address || applicationData?.address || null
			});
		} catch (err) {
			console.error("Gagal memuat profil buzzer:", err);
		} finally {
			setLoading(false);
		}
	}, [buzzerEmail]);
	(0, import_react.useEffect)(() => {
		fetchBuzzer();
		const decodedEmail = decodeURIComponent(buzzerEmail).trim().toLowerCase();
		const channel = supabase.channel(`buzzer-profile-rt-${decodedEmail}`).on("postgres_changes", {
			event: "*",
			schema: "public",
			table: "campaign_jobs"
		}, () => {
			fetchBuzzer();
		}).on("postgres_changes", {
			event: "*",
			schema: "public",
			table: "social_accounts"
		}, () => {
			fetchBuzzer();
		}).on("postgres_changes", {
			event: "*",
			schema: "public",
			table: "buzzer_wallets"
		}, () => {
			fetchBuzzer();
		}).on("postgres_changes", {
			event: "*",
			schema: "public",
			table: "app_accounts"
		}, () => {
			fetchBuzzer();
		}).subscribe();
		return () => {
			supabase.removeChannel(channel);
		};
	}, [buzzerEmail, fetchBuzzer]);
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-screen bg-gradient-to-br from-background to-accent/30 px-4 py-12",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-3xl",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-8 w-24 mb-6" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-border bg-card p-8 shadow-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-24 w-24 rounded-full mx-auto" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-6 w-32 mt-6 mx-auto" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-4 w-24 mt-2 mx-auto" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-32 w-full mt-6" })
				]
			})]
		})
	});
	if (!buzzer) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-screen bg-gradient-to-br from-background to-accent/30 px-4 py-12",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-3xl",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: goBackFromProfile,
				className: "mb-6 inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-4 w-4" }), "Kembali"]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-border bg-card p-8 text-center shadow-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-lg font-semibold text-foreground",
					children: "Buzzer tidak ditemukan"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Akun buzzer yang Anda cari tidak tersedia."
				})]
			})]
		})
	});
	const buzzerRatings = allRatings.filter((r) => r.buzzer_email.toLowerCase() === buzzer.email.toLowerCase());
	const avgRating = buzzerRatings.length > 0 ? averageStars(buzzerRatings) : buzzer.rating && buzzer.rating > 0 ? buzzer.rating : 0;
	const getPlatformColor = (platform) => {
		switch (platform.toLowerCase()) {
			case "instagram": return "bg-pink-500/10 text-pink-600 border-pink-200 dark:text-pink-400";
			case "tiktok": return "bg-black/10 text-black dark:text-white border-black/20";
			case "x (twitter)":
			case "twitter": return "bg-blue-400/10 text-blue-600 border-blue-200 dark:text-blue-400";
			case "youtube": return "bg-red-500/10 text-red-600 border-red-200 dark:text-red-400";
			case "facebook": return "bg-blue-600/10 text-blue-700 border-blue-200 dark:text-blue-400";
			default: return "bg-gray-500/10 text-gray-600 border-gray-200 dark:text-gray-400";
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-screen bg-gradient-to-br from-background to-accent/30 px-4 py-12",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-3xl",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: goBackFromProfile,
					className: "mb-6 inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-4 w-4" }), "Kembali"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-3xl border border-border bg-card shadow-sm overflow-hidden",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-32 bg-gradient-to-r from-brand/40 to-brand-glow/40" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "px-6 pb-8 sm:px-8",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col items-center -mt-16",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Avatar, {
									className: "h-32 w-32 border-4 border-background shadow-lg",
									children: [buzzer.avatar_url && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarImage, {
										src: buzzer.avatar_url,
										alt: buzzer.name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarFallback, {
										className: "gradient-brand text-2xl font-bold text-brand-foreground",
										children: buzzer.name.split(" ").map((n) => n[0]).join("").slice(0, 2)
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-4 flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										className: cn("capitalize", buzzer.status === "Aktif" ? "bg-emerald-500/20 text-emerald-700 dark:text-emerald-400" : buzzer.status === "Verifikasi" ? "bg-blue-500/20 text-blue-700 dark:text-blue-400" : buzzer.status === "Suspend" ? "bg-red-500/20 text-red-700 dark:text-red-400" : "bg-gray-500/20 text-gray-700 dark:text-gray-400"),
										children: buzzer.status
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
										variant: "outline",
										className: "text-xs font-semibold",
										children: ["Level: ", buzzer.level]
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-6 text-center",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
									className: "font-display text-3xl font-bold",
									children: buzzer.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-muted-foreground",
									children: buzzer.username
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-6 flex justify-center gap-1",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-1",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "h-5 w-5 fill-amber-400 text-amber-400" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-display text-lg font-bold",
											children: avgRating.toFixed(1)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-xs text-muted-foreground",
											children: [
												"(",
												buzzerRatings.length,
												" ulasan)"
											]
										})
									]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-8 grid grid-cols-3 gap-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-xl border border-border bg-muted/50 p-4 text-center",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-muted-foreground uppercase tracking-wide",
											children: "Platform"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-2 font-semibold text-xs sm:text-sm",
											children: buzzer.platform
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-xl border border-border bg-muted/50 p-4 text-center",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-muted-foreground uppercase tracking-wide",
											children: "Followers"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "mt-2 font-semibold text-xs sm:text-sm",
											children: [(buzzer.followers / 1e3).toFixed(1), "K"]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-xl border border-border bg-muted/50 p-4 text-center",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-muted-foreground uppercase tracking-wide",
											children: "Job Selesai"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-2 font-semibold text-lg text-emerald-600 dark:text-emerald-400",
											children: buzzer.job_completed
										})]
									})
								]
							}),
							buzzer.bio && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-8 rounded-xl border border-border bg-muted/20 p-4",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-foreground",
									children: buzzer.bio
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-8 space-y-3 border-t border-border pt-6",
								children: [
									buzzer.phone && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-3 text-sm",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "h-4 w-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: buzzer.phone })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-3 text-sm",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "h-4 w-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: buzzer.email })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-3 text-sm",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Globe, { className: "h-4 w-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											variant: "outline",
											className: getPlatformColor(buzzer.platform),
											children: buzzer.platform
										})]
									})
								]
							})
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-8 rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-6 flex flex-wrap items-center justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-2xl font-bold",
							children: "Riwayat Pekerjaan"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 text-sm text-muted-foreground",
							children: [
								"Total ",
								jobs.length,
								" pekerjaan yang diambil (",
								buzzer.job_completed,
								" selesai / dikerjakan)"
							]
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
							variant: "outline",
							className: "px-3 py-1 font-semibold text-xs text-emerald-600 dark:text-emerald-400 border-emerald-300",
							children: [buzzer.job_completed, " Job Selesai"]
						})]
					}), jobs.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "rounded-xl border border-dashed border-border bg-muted/30 p-8 text-center",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground",
							children: "Belum ada riwayat pekerjaan yang dikerjakan buzzer ini."
						})
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "overflow-x-auto",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Kampanye" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Platform" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Status" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
								className: "text-right",
								children: "Payout"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
								className: "text-right",
								children: "Tanggal"
							})
						] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: jobs.map((j) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
								className: "font-medium max-w-[200px] truncate",
								children: j.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: "outline",
								className: getPlatformColor(j.platform),
								children: j.platform
							}) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold", j.status === "Selesai" || Boolean(j.admin_verified_at) ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300" : j.status === "Review" ? "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300" : j.status === "Diambil" ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300" : j.status === "Revisi" ? "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300" : "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300"),
								children: j.status === "Review" && j.admin_verified_at ? "Selesai (Diverifikasi)" : j.status === "Review" ? "Review Bukti" : j.status
							}) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
								className: "text-right font-semibold text-emerald-600 dark:text-emerald-400",
								children: formatIDR(j.payout)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
								className: "text-right text-xs text-muted-foreground whitespace-nowrap",
								children: new Date(j.date).toLocaleDateString("id-ID", {
									day: "numeric",
									month: "short",
									year: "numeric"
								})
							})
						] }, j.id)) })] })
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-8 rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-2xl font-bold",
							children: "Ulasan Customer"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 text-sm text-muted-foreground",
							children: [buzzerRatings.length, " ulasan dari customer"]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-8 border-t border-border pt-8",
						children: buzzerRatings.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "rounded-lg border border-dashed border-border bg-muted/30 p-8 text-center",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted-foreground",
								children: "Belum ada ulasan. Selesaikan campaign sesuai brief untuk mendapat rating."
							})
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "space-y-4",
							children: buzzerRatings.map((rating) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex gap-4 rounded-lg border border-border bg-muted/30 p-4 transition hover:bg-muted/50",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar, {
									className: "h-10 w-10 shrink-0",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarFallback, {
										className: "text-xs",
										children: rating.customer_name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex-1 min-w-0",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-between gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "font-semibold text-sm",
												children: rating.customer_name || rating.customer_email
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-xs text-muted-foreground",
												children: rating.campaign_title
											})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "flex items-center gap-1 shrink-0",
												children: Array(5).fill(null).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: cn("h-4 w-4", i < rating.stars ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30") }, i))
											})]
										}),
										rating.comment && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "mt-2 text-sm text-foreground",
											children: [
												"\"",
												rating.comment,
												"\""
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-2 text-xs text-muted-foreground",
											children: new Date(rating.created_at).toLocaleDateString("id-ID", {
												year: "numeric",
												month: "long",
												day: "numeric"
											})
										})
									]
								})]
							}, rating.id))
						})
					})]
				})
			]
		})
	});
}
//#endregion
export { BuzzerProfilePage as component };
