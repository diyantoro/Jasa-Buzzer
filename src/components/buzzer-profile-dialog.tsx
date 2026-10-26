import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star } from "lucide-react";
import { useBuzzerRatings, averageStars } from "@/lib/rating-store";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { demoBuzzerEmails, demoBuzzers } from "@/lib/demo-data";

function ProfileRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-border pb-3 last:border-0 last:pb-0">
      <span className="shrink-0 text-sm font-medium text-muted-foreground">{label}</span>
      <span className="text-right text-sm font-semibold">{value}</span>
    </div>
  );
}

export function BuzzerProfileDialog({ email, open, onOpenChange }: { email: string; open: boolean; onOpenChange: (open: boolean) => void }) {
  const { data: allRatings } = useBuzzerRatings();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!open) return;
    let active = true;
    setLoading(true);

    async function load() {
      const decodedEmail = email.toLowerCase().trim();

      // Fallback data demo: profil buzzer dummy dari dataset Manajemen.
      const demoIndex = demoBuzzerEmails.findIndex(
        (item) => item.toLowerCase() === decodedEmail,
      );
      if (demoIndex >= 0) {
        const demo = demoBuzzers[demoIndex];
        if (active) {
          setData({
            name: demo.name,
            email: decodedEmail,
            username: demo.username,
            phone: "-",
            platform: demo.platform,
            followers: demo.followers,
            bio: `Kreator ${demo.platform} dengan ${demo.followers.toLocaleString("id-ID")} followers.`,
            avatarUrl: null,
            jobCompleted: demo.jobs,
          });
          setLoading(false);
        }
        return;
      }

      const [
        { data: accountData },
        { data: walletData },
        { data: socialAccounts },
        { data: jobsData },
        { data: submissionsData },
      ] = await Promise.all([
        supabase.from("app_accounts").select("*").ilike("email", decodedEmail).maybeSingle(),
        supabase.from("buzzer_wallets").select("*").ilike("buzzer_email", decodedEmail).maybeSingle(),
        supabase.from("social_accounts").select("*").ilike("buzzer_email", decodedEmail),
        (supabase as any).from("campaign_jobs").select("id, status, admin_verified_at, proof_url, buzzer_email, buzzer_name").ilike("buzzer_email", decodedEmail),
        (supabase as any).from("campaign_job_submissions").select("id, status, buzzer_email").ilike("buzzer_email", decodedEmail),
      ]);

      if (!active) return;

      const verifiedFollowers = (socialAccounts ?? [])
        .filter((account) => account.verification === "Terverifikasi")
        .reduce((sum, account) => sum + Number(account.followers ?? 0), 0);

      const d: any = accountData || {};

      let allJobs = jobsData ?? [];
      if (allJobs.length === 0 && d.name) {
        const { data: nameJobs } = await (supabase as any)
          .from("campaign_jobs")
          .select("id, status, admin_verified_at, proof_url, buzzer_email, buzzer_name")
          .ilike("buzzer_name", d.name);
        if (nameJobs && nameJobs.length > 0) {
          allJobs = nameJobs;
        }
      }

      const finishedJobs = allJobs.filter(
        (j: any) => j.status === "Selesai" || Boolean(j.admin_verified_at)
      );
      const reviewJobs = allJobs.filter(
        (j: any) => (j.status === "Review" || Boolean(j.proof_url)) && j.status !== "Selesai" && !j.admin_verified_at
      );
      const subCount = (submissionsData ?? []).filter(
        (s: any) => s.status === "Selesai" || s.status === "Review"
      ).length;

      let localJobsCount = 0;
      try {
        const raw = typeof window !== "undefined" ? localStorage.getItem(`buzzhub.buzzer.${decodedEmail}`) : null;
        if (raw) {
          const parsed = JSON.parse(raw);
          const rawJobs = Array.isArray(parsed?.jobs) ? parsed.jobs : [];
          const localCompleted = rawJobs.filter(
            (j: any) =>
              j.status === "Selesai" ||
              Boolean(j.admin_verified_at) ||
              j.status === "Review" ||
              Boolean(j.proofUrl)
          ).length;
          localJobsCount = Math.max(
            Number(parsed?.profile?.jobsCompleted ?? 0),
            localCompleted,
            rawJobs.length
          );
        }
      } catch {}

      const resolvedJobsCount = Math.max(
        finishedJobs.length + reviewJobs.length > 0 ? finishedJobs.length + reviewJobs.length : allJobs.length,
        subCount,
        localJobsCount,
        Number(walletData?.campaigns_completed ?? 0),
        Number(d.job_completed ?? 0)
      );

      setData({
        name: d.name || "Buzzer",
        email: decodedEmail,
        username: d.username || `@${d.name?.toLowerCase().replace(/[^a-z0-9]/g, "") || "buzzer"}`,
        phone: d.phone || "-",
        platform: d.platform || socialAccounts?.[0]?.platform || "-",
        followers: verifiedFollowers > 0 ? verifiedFollowers : Number(d.followers || 0),
        bio: d.bio || "-",
        avatarUrl: d.avatar_url,
        jobCompleted: resolvedJobsCount,
      });
      setLoading(false);
    }
    load();
    return () => { active = false; };
  }, [email, open]);

  const myRatings = allRatings.filter((r) => r.buzzer_email.toLowerCase() === email.toLowerCase());
  const avg = averageStars(myRatings);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Profil Buzzer</DialogTitle>
          <DialogDescription>Detail informasi akun buzzer</DialogDescription>
        </DialogHeader>

        {loading || !data ? (
          <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
             <Skeleton className="h-64 w-full rounded-2xl" />
             <Skeleton className="h-96 w-full rounded-2xl" />
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
            <div className="rounded-2xl border border-border bg-card p-6 text-center shadow-sm">
              <Avatar className="mx-auto h-24 w-24 border-2 border-background shadow-md">
                {data.avatarUrl && <AvatarImage src={data.avatarUrl} alt={data.name} />}
                <AvatarFallback className="gradient-brand text-2xl font-bold text-brand-foreground">
                  {data.name.split(" ").map((n: string) => n[0]).join("").slice(0,2)}
                </AvatarFallback>
              </Avatar>
              <h3 className="mt-3 font-display text-xl font-bold">{data.name}</h3>
              <p className="text-sm text-muted-foreground">{data.username}</p>
              <div className="mt-4 flex flex-col items-center justify-center gap-1 text-sm">
                {myRatings.length > 0 ? (
                  <>
                    <div className="flex items-center gap-1"><Star className="h-4 w-4 fill-amber-400 text-amber-400" /> <b>{avg.toFixed(1)}</b></div>
                    <span className="text-muted-foreground">{myRatings.length} ulasan · {data.jobCompleted} job selesai</span>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-1"><Star className="h-4 w-4 text-muted-foreground/50" /> <b>0.0</b></div>
                    <span className="text-muted-foreground">Belum ada ulasan · {data.jobCompleted} job selesai</span>
                  </>
                )}
              </div>
            </div>

            <div className="space-y-4 rounded-2xl border border-border bg-card p-6 shadow-sm">
              <ProfileRow label="Email" value={data.email} />
              <ProfileRow label="Nomor HP" value={data.phone} />
              <ProfileRow label="Platform Utama" value={data.platform} />
              <ProfileRow label="Followers" value={data.followers.toLocaleString("id-ID")} />
              <ProfileRow label="Bio" value={data.bio} />

              <div>
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Rating</p>
                  <span className="text-sm font-semibold">{myRatings.length > 0 ? `${avg.toFixed(1)} / 5` : "0.0 / 5"}</span>
                </div>
                <Progress value={myRatings.length > 0 ? avg * 20 : 0} className="mt-2" />
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-2">Ulasan Customer</p>
                {myRatings.length === 0 ? (
                  <p className="rounded-lg border border-dashed border-border p-4 text-center text-sm text-muted-foreground">
                    Belum ada ulasan.
                  </p>
                ) : (
                  <ul className="space-y-2 max-h-64 overflow-y-auto pr-2">
                    {myRatings.map((r) => (
                      <li key={r.id} className="rounded-lg border border-border p-3">
                        <div className="flex items-center justify-between gap-2">
                          <p className="truncate text-sm font-semibold">{r.campaign_title}</p>
                          <span className="flex shrink-0 items-center gap-1 text-sm font-bold">
                            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                            {r.stars}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">{r.customer_name || r.customer_email}</p>
                        {r.comment && <p className="mt-1 text-sm">"{r.comment}"</p>}
                        <p className="mt-2 text-xs text-muted-foreground">
                            {new Date(r.created_at).toLocaleDateString("id-ID", { year: "numeric", month: "long", day: "numeric" })}
                        </p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
