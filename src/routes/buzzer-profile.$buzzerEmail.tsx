import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Star, ArrowLeft, Mail, Phone, Globe, CheckCircle2, Briefcase } from "lucide-react";
import { useBuzzerRatings, averageStars } from "@/lib/rating-store";
import { formatIDR } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/buzzer-profile/$buzzerEmail")({
  head: () => ({ meta: [{ title: "Profil Buzzer — BuzzHub" }] }),
  component: BuzzerProfilePage,
});

type BuzzerProfile = {
  id: string;
  name: string;
  email: string;
  username: string;
  phone: string | null;
  platform: string;
  followers: number;
  rating: number;
  level: string;
  job_completed: number;
  bio: string | null;
  avatar_url: string | null;
  status: string;
  created_at: string;
  city?: string | null;
  address?: string | null;
};

type BuzzerJobItem = {
  id: string;
  title: string;
  platform: string;
  status: string;
  payout: number;
  date: string;
  proof_url?: string | null;
  admin_verified_at?: string | null;
};

function goBackFromProfile() {
  if (window.history.length > 1) {
    window.history.back();
    return;
  }
  window.location.assign("/admin");
}

function BuzzerProfilePage() {
  const { buzzerEmail } = Route.useParams();
  const [buzzer, setBuzzer] = useState<BuzzerProfile | null>(null);
  const [jobs, setJobs] = useState<BuzzerJobItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { data: allRatings } = useBuzzerRatings();

  const fetchBuzzer = useCallback(async () => {
    setLoading(true);
    const decodedEmail = decodeURIComponent(buzzerEmail).trim().toLowerCase();

    try {
      const [
        { data: accountData },
        { data: applicationData },
        { data: socialAccounts },
        { data: campaignJobs },
        { data: walletData },
        { data: submissionData },
      ] = await Promise.all([
        supabase
          .from("app_accounts")
          .select("*")
          .ilike("email", decodedEmail)
          .maybeSingle(),
        supabase
          .from("buzzer_applications")
          .select("*")
          .ilike("email", decodedEmail)
          .maybeSingle(),
        supabase
          .from("social_accounts")
          .select("id, platform, username, followers, verification")
          .ilike("buzzer_email", decodedEmail),
        (supabase as any)
          .from("campaign_jobs")
          .select("*")
          .ilike("buzzer_email", decodedEmail)
          .order("updated_at", { ascending: false }),
        supabase
          .from("buzzer_wallets")
          .select("rating, level, campaigns_completed")
          .ilike("buzzer_email", decodedEmail)
          .maybeSingle(),
        supabase
          .from("campaign_job_submissions")
          .select("id, job_id, buzzer_email, status, submitted_at")
          .ilike("buzzer_email", decodedEmail),
      ]);

      const verifiedFollowers = (socialAccounts ?? [])
        .filter((account) => account.verification === "Terverifikasi")
        .reduce((sum, account) => sum + Number(account.followers ?? 0), 0);

      let allJobs: any[] = ((campaignJobs ?? []) as any[]);
      const d = (accountData || applicationData) as any;

      // If email match returned 0 jobs, also check by buzzer_name fallback
      if (allJobs.length === 0 && d?.name) {
        const { data: nameJobs } = await (supabase as any)
          .from("campaign_jobs")
          .select("*")
          .ilike("buzzer_name", d.name)
          .order("updated_at", { ascending: false });
        if (nameJobs && nameJobs.length > 0) {
          allJobs = nameJobs;
        }
      }

      const finishedJobs = allJobs.filter(
        (job) => job.status === "Selesai" || Boolean(job.admin_verified_at),
      );
      const reviewJobs = allJobs.filter(
        (job) =>
          (job.status === "Review" || Boolean(job.proof_url)) &&
          job.status !== "Selesai" &&
          !job.admin_verified_at,
      );
      const takenJobs = allJobs.filter(
        (job) => job.status === "Diambil" || job.status === "Revisi",
      );

      const submissionCompleted = (submissionData ?? []).filter(
        (s) => s.status === "Selesai" || s.status === "Review",
      ).length;

      let localJobsCount = 0;
      let localJobs: BuzzerJobItem[] = [];
      try {
        const raw = localStorage.getItem(`buzzhub.buzzer.${decodedEmail}`);
        if (raw) {
          const parsed = JSON.parse(raw);
          const rawJobs = Array.isArray(parsed?.jobs) ? parsed.jobs : [];
          const localCompleted = rawJobs.filter(
            (j: any) =>
              j.status === "Selesai" ||
              Boolean(j.admin_verified_at) ||
              j.status === "Review" ||
              Boolean(j.proofUrl),
          ).length;
          localJobsCount = Math.max(
            Number(parsed?.profile?.jobsCompleted ?? 0),
            localCompleted,
            rawJobs.length,
          );
          localJobs = rawJobs.map((j: any) => ({
            id: j.id,
            title: j.title || "Job Kampanye",
            platform: j.platform || "Instagram",
            status: j.status || "Selesai",
            payout: Number(j.payout || 0),
            date: j.updatedAt || j.deadline || new Date().toISOString(),
            proof_url: j.proofUrl,
            admin_verified_at: j.admin_verified_at,
          }));
        }
      } catch (e) {
        // ignore
      }

      // Count completed / worked-on jobs
      const dbWorkedJobs =
        finishedJobs.length + reviewJobs.length > 0
          ? finishedJobs.length + reviewJobs.length
          : allJobs.length;

      const totalCompleted = Math.max(
        dbWorkedJobs,
        submissionCompleted,
        localJobsCount,
        Number((walletData as any)?.campaigns_completed ?? 0),
        Number((accountData as any)?.job_completed ?? 0),
      );

      const mergedJobsMap = new Map<string, BuzzerJobItem>();
      allJobs.forEach((job) => {
        mergedJobsMap.set(job.id, {
          id: job.id,
          title: job.campaign_title || "Job Kampanye",
          platform: job.platform || "Instagram",
          status: job.status,
          payout: Number(job.buzzer_amount ?? job.payout ?? 0),
          date: job.updated_at || job.created_at,
          proof_url: job.proof_url,
          admin_verified_at: job.admin_verified_at,
        });
      });
      localJobs.forEach((lj) => {
        if (!mergedJobsMap.has(lj.id)) {
          mergedJobsMap.set(lj.id, lj);
        }
      });

      setJobs(Array.from(mergedJobsMap.values()));

      if (d) {
        setBuzzer({
          id: d.id || d.email,
          name: d.name || "Buzzer",
          email: d.email,
          username: d.username || `@${d.name?.toLowerCase().replace(/[^a-z0-9]/g, "") || "buzzer"}`,
          phone: d.phone || null,
          platform: d.platform || socialAccounts?.[0]?.platform || "Instagram",
          followers: verifiedFollowers > 0 ? verifiedFollowers : Number(d.followers || 0),
          rating: Number(walletData?.rating ?? d.rating ?? 5.0),
          level: walletData?.level || "Beginner",
          job_completed: totalCompleted,
          bio: d.bio || null,
          avatar_url: d.avatar_url || null,
          status: d.status || "Aktif",
          created_at: d.created_at || d.submitted_at || new Date().toISOString(),
          city: d.city || (applicationData as any)?.city || null,
          address: (d as any)?.address || (applicationData as any)?.address || null,
        });
      }
    } catch (err) {
      console.error("Gagal memuat profil buzzer:", err);
    } finally {
      setLoading(false);
    }
  }, [buzzerEmail]);

  useEffect(() => {
    void fetchBuzzer();

    const decodedEmail = decodeURIComponent(buzzerEmail).trim().toLowerCase();
    const channel = supabase
      .channel(`buzzer-profile-rt-${decodedEmail}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "campaign_jobs" }, () => {
        void fetchBuzzer();
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "social_accounts" }, () => {
        void fetchBuzzer();
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "buzzer_wallets" }, () => {
        void fetchBuzzer();
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "app_accounts" }, () => {
        void fetchBuzzer();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [buzzerEmail, fetchBuzzer]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-accent/30 px-4 py-12">
        <div className="mx-auto max-w-3xl">
          <Skeleton className="h-8 w-24 mb-6" />
          <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
            <Skeleton className="h-24 w-24 rounded-full mx-auto" />
            <Skeleton className="h-6 w-32 mt-6 mx-auto" />
            <Skeleton className="h-4 w-24 mt-2 mx-auto" />
            <Skeleton className="h-32 w-full mt-6" />
          </div>
        </div>
      </div>
    );
  }

  if (!buzzer) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-accent/30 px-4 py-12">
        <div className="mx-auto max-w-3xl">
          <button
            type="button"
            onClick={goBackFromProfile}
            className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali
          </button>
          <div className="rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
            <p className="text-lg font-semibold text-foreground">Buzzer tidak ditemukan</p>
            <p className="mt-2 text-sm text-muted-foreground">Akun buzzer yang Anda cari tidak tersedia.</p>
          </div>
        </div>
      </div>
    );
  }

  const buzzerRatings = allRatings.filter(
    (r) => r.buzzer_email.toLowerCase() === buzzer.email.toLowerCase(),
  );

  const avgRating =
    buzzerRatings.length > 0
      ? averageStars(buzzerRatings)
      : buzzer.rating && buzzer.rating > 0
      ? buzzer.rating
      : 0;

  const getPlatformColor = (platform: string) => {
    switch (platform.toLowerCase()) {
      case "instagram":
        return "bg-pink-500/10 text-pink-600 border-pink-200 dark:text-pink-400";
      case "tiktok":
        return "bg-black/10 text-black dark:text-white border-black/20";
      case "x (twitter)":
      case "twitter":
        return "bg-blue-400/10 text-blue-600 border-blue-200 dark:text-blue-400";
      case "youtube":
        return "bg-red-500/10 text-red-600 border-red-200 dark:text-red-400";
      case "facebook":
        return "bg-blue-600/10 text-blue-700 border-blue-200 dark:text-blue-400";
      default:
        return "bg-gray-500/10 text-gray-600 border-gray-200 dark:text-gray-400";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-accent/30 px-4 py-12">
      <div className="mx-auto max-w-3xl">
        {/* Header dengan tombol kembali */}
        <button
          type="button"
          onClick={goBackFromProfile}
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali
        </button>

        {/* Kartu profil */}
        <div className="rounded-3xl border border-border bg-card shadow-sm overflow-hidden">
          {/* Header dengan gradient */}
          <div className="h-32 bg-gradient-to-r from-brand/40 to-brand-glow/40" />

          {/* Content */}
          <div className="px-6 pb-8 sm:px-8">
            {/* Avatar */}
            <div className="flex flex-col items-center -mt-16">
              <Avatar className="h-32 w-32 border-4 border-background shadow-lg">
                {buzzer.avatar_url && <AvatarImage src={buzzer.avatar_url} alt={buzzer.name} />}
                <AvatarFallback className="gradient-brand text-2xl font-bold text-brand-foreground">
                  {buzzer.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)}
                </AvatarFallback>
              </Avatar>

              {/* Status Badge */}
              <div className="mt-4 flex items-center gap-2">
                <Badge
                  className={cn(
                    "capitalize",
                    buzzer.status === "Aktif"
                      ? "bg-emerald-500/20 text-emerald-700 dark:text-emerald-400"
                      : buzzer.status === "Verifikasi"
                      ? "bg-blue-500/20 text-blue-700 dark:text-blue-400"
                      : buzzer.status === "Suspend"
                      ? "bg-red-500/20 text-red-700 dark:text-red-400"
                      : "bg-gray-500/20 text-gray-700 dark:text-gray-400",
                  )}
                >
                  {buzzer.status}
                </Badge>
                <Badge variant="outline" className="text-xs font-semibold">
                  Level: {buzzer.level}
                </Badge>
              </div>
            </div>

            {/* Nama dan username */}
            <div className="mt-6 text-center">
              <h1 className="font-display text-3xl font-bold">{buzzer.name}</h1>
              <p className="text-muted-foreground">{buzzer.username}</p>
            </div>

            {/* Rating dan stats */}
            <div className="mt-6 flex justify-center gap-1">
              <div className="flex items-center gap-1">
                <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                <span className="font-display text-lg font-bold">{avgRating.toFixed(1)}</span>
                <span className="text-xs text-muted-foreground">({buzzerRatings.length} ulasan)</span>
              </div>
            </div>

            {/* Stats grid */}
            <div className="mt-8 grid grid-cols-3 gap-4">
              <div className="rounded-xl border border-border bg-muted/50 p-4 text-center">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">
                  Platform
                </p>
                <p className="mt-2 font-semibold text-xs sm:text-sm">
                  {buzzer.platform}
                </p>
              </div>
              <div className="rounded-xl border border-border bg-muted/50 p-4 text-center">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">
                  Followers
                </p>
                <p className="mt-2 font-semibold text-xs sm:text-sm">
                  {(buzzer.followers / 1000).toFixed(1)}K
                </p>
              </div>
              <div className="rounded-xl border border-border bg-muted/50 p-4 text-center">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">
                  Job Selesai
                </p>
                <p className="mt-2 font-semibold text-lg text-emerald-600 dark:text-emerald-400">
                  {buzzer.job_completed}
                </p>
              </div>
            </div>

            {/* Bio */}
            {buzzer.bio && (
              <div className="mt-8 rounded-xl border border-border bg-muted/20 p-4">
                <p className="text-sm text-foreground">{buzzer.bio}</p>
              </div>
            )}

            {/* Contact info */}
            <div className="mt-8 space-y-3 border-t border-border pt-6">
              {buzzer.phone && (
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{buzzer.phone}</span>
                </div>
              )}
              <div className="flex items-center gap-3 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{buzzer.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <Badge variant="outline" className={getPlatformColor(buzzer.platform)}>
                  {buzzer.platform}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Riwayat Pekerjaan */}
        <div className="mt-8 rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-sm">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-display text-2xl font-bold">Riwayat Pekerjaan</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Total {jobs.length} pekerjaan yang diambil ({buzzer.job_completed} selesai / dikerjakan)
              </p>
            </div>
            <Badge variant="outline" className="px-3 py-1 font-semibold text-xs text-emerald-600 dark:text-emerald-400 border-emerald-300">
              {buzzer.job_completed} Job Selesai
            </Badge>
          </div>

          {jobs.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border bg-muted/30 p-8 text-center">
              <p className="text-sm text-muted-foreground">Belum ada riwayat pekerjaan yang dikerjakan buzzer ini.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Kampanye</TableHead>
                    <TableHead>Platform</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Payout</TableHead>
                    <TableHead className="text-right">Tanggal</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {jobs.map((j) => (
                    <TableRow key={j.id}>
                      <TableCell className="font-medium max-w-[200px] truncate">{j.title}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getPlatformColor(j.platform)}>
                          {j.platform}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span
                          className={cn(
                            "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
                            j.status === "Selesai" || Boolean(j.admin_verified_at)
                              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300"
                              : j.status === "Review"
                              ? "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300"
                              : j.status === "Diambil"
                              ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300"
                              : j.status === "Revisi"
                              ? "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300"
                              : "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300",
                          )}
                        >
                          {j.status === "Review" && j.admin_verified_at
                            ? "Selesai (Diverifikasi)"
                            : j.status === "Review"
                            ? "Review Bukti"
                            : j.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-right font-semibold text-emerald-600 dark:text-emerald-400">
                        {formatIDR(j.payout)}
                      </TableCell>
                      <TableCell className="text-right text-xs text-muted-foreground whitespace-nowrap">
                        {new Date(j.date).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>

        {/* Ratings Section */}
        <div className="mt-8 rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-sm">
          <div className="mb-6">
            <h2 className="font-display text-2xl font-bold">Ulasan Customer</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {buzzerRatings.length} ulasan dari customer
            </p>
          </div>

          {/* Ratings List */}
          <div className="mt-8 border-t border-border pt-8">
            {buzzerRatings.length === 0 ? (
              <div className="rounded-lg border border-dashed border-border bg-muted/30 p-8 text-center">
                <p className="text-sm text-muted-foreground">
                  Belum ada ulasan. Selesaikan campaign sesuai brief untuk mendapat rating.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {buzzerRatings.map((rating) => (
                  <div
                    key={rating.id}
                    className="flex gap-4 rounded-lg border border-border bg-muted/30 p-4 transition hover:bg-muted/50"
                  >
                    <Avatar className="h-10 w-10 shrink-0">
                      <AvatarFallback className="text-xs">
                        {rating.customer_name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <div>
                          <p className="font-semibold text-sm">
                            {rating.customer_name || rating.customer_email}
                          </p>
                          <p className="text-xs text-muted-foreground">{rating.campaign_title}</p>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          {Array(5)
                            .fill(null)
                            .map((_, i) => (
                              <Star
                                key={i}
                                className={cn(
                                  "h-4 w-4",
                                  i < rating.stars
                                    ? "fill-amber-400 text-amber-400"
                                    : "text-muted-foreground/30",
                                )}
                              />
                            ))}
                        </div>
                      </div>

                      {rating.comment && (
                        <p className="mt-2 text-sm text-foreground">"{rating.comment}"</p>
                      )}

                      <p className="mt-2 text-xs text-muted-foreground">
                        {new Date(rating.created_at).toLocaleDateString("id-ID", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
