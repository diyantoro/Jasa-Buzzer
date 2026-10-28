import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  Bell, Briefcase, CheckCircle2, Clock, DollarSign, Edit3, Eye, LayoutDashboard,
  LogOut, Megaphone, Menu, Search, Star, Trophy, Upload, User, Wallet,
  Instagram, Music2, Twitter, Facebook, Youtube, RefreshCw, AlertCircle,
  Camera, Filter, Inbox, ChevronLeft, ChevronRight, Link2, FileSpreadsheet, FileDown, Send,
  Copy, ExternalLink, Heart, MessageCircle, Sparkles, Share2, Users, FileText, Loader2, CalendarDays,
  Settings, Plus, LifeBuoy,
} from "lucide-react";

import { SosmedSection, LevelCard } from "@/components/social-accounts-section";
import { useSocialAccounts } from "@/lib/social-store";
import { useBuzzerLevel, getBuzzerPercentageForLevel } from "@/lib/buzzer-level";
import { BuzzerNotifBell, BuzzerNotifSheet } from "@/components/buzzer-notif-sheet";
import { BuzzerSettingsSection } from "@/components/buzzer-settings-section";
import { HelpSection } from "@/components/help-section";
import { SupportMessageSection } from "@/components/support-message-section";
import { useBuzzerNotifications } from "@/lib/buzzer-notification-store";
import { toast } from "sonner";
import { getApplicationByEmail, getBuzzerVerificationStatus, type BuzzerAppStatus, type BuzzerApplication } from "@/lib/buzzer-verification";
import { uploadProofScreenshot } from "@/lib/proof-upload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { StatCard, StatusBadge } from "@/components/dashboard-shell";
import { MobileBottomNav, SidebarNav, useSidebarCollapsed } from "@/components/dashboard-sidebar";
import { BuzzerNameLink } from "@/components/buzzer-name-link";
import { ProofLink } from "@/components/proof-link";
import { TablePagination } from "@/components/table-pagination";
import { ThemeToggle } from "@/components/theme-toggle";

import { clearSession, useRequireRole, useSession } from "@/lib/auth";
import { useBuzzerStore, formatIDR, terbilangRupiah, type BuzzerJob, type JobStatus, type Platform } from "@/lib/buzzer-store";
import {
  useBuzzerCampaignJobs,
  takeCampaignJob,
  submitCampaignJobProof,
  ensureCampaignJobInSupabase,
} from "@/lib/campaign-store";
import { notifyTaskSubmitted } from "@/lib/buzzer-notification-store";
import { useBuzzerRatings, averageStars } from "@/lib/rating-store";
import { demoBuzzers as leaderboardSeed } from "@/lib/demo-data";
import { exportToExcel, exportToPDF } from "@/lib/export-utils";
import { cn } from "@/lib/utils";
import buzzerHero from "@/assets/buzzer-hero.jpg";

type Store = ReturnType<typeof useBuzzerStore>;

const DB_PREFIX = "db:";

export type MergedJob = BuzzerJob & {
  slotsLeft?: number;
  campaignId?: string;
  grossPrice?: number;
  buzzerLevel?: string;
  buzzerPercentage?: number;
  adminPercentage?: number;
  buzzerAmount?: number;
  adminAmount?: number;
  attendance_status?: "Akan Hadir" | "Tidak Dapat Hadir" | null;
  attendance_confirmed_at?: string | null;
  checkin_at?: string | null;
  checkout_at?: string | null;
  activity_note?: string | null;
  location_name?: string | null;
  event_date?: string | null;
  event_time?: string | null;
};

/** Gabungkan job lokal dengan job kampanye. Slot kosong dari 1 kampanye digabung jadi 1 kartu. */
function useMergedJobs(store: Store, canAccessJobs: boolean) {
  const { data: rows, refetch } = useBuzzerCampaignJobs(canAccessJobs ? store.state.profile.email : "");
  const email = store.state.profile.email.toLowerCase();
  const jobs = useMemo(() => {
    const mine: MergedJob[] = [];
    const openByCampaign = new Map<string, { job: MergedJob; count: number }>();
    const claimedCampaigns = new Set<string>();

    for (const r of rows) {
      const isMine = (r.buzzer_email ?? "").toLowerCase() === email && !!r.buzzer_email;
      const campaignKey = r.campaign_id ?? r.id;
      if (isMine) {
        claimedCampaigns.add(campaignKey);
        openByCampaign.delete(campaignKey);
      }
      const isOpen = r.status === "Tersedia" && !r.buzzer_email;
      if (!isMine && !isOpen) continue;

      const job: MergedJob = {
        id: DB_PREFIX + r.id,
        title: r.campaign_title,
        platform: r.platform as Platform,
        brief: r.brief,
        deadline: r.deadline,
        // Claimed jobs use the immutable split calculated by the database.
        // Legacy jobs continue using their stored payout.
        payout: Number(r.buzzer_amount ?? r.payout ?? 0),
        grossPrice: Number(r.gross_price),
        buzzerAmount: Number(r.buzzer_amount ?? 0),
        adminAmount: Number(r.admin_amount ?? 0),
        buzzerLevel: r.buzzer_level ?? undefined,
        buzzerPercentage: r.buzzer_percentage === null || r.buzzer_percentage === undefined ? undefined : Number(r.buzzer_percentage),
        adminPercentage: r.admin_percentage === null || r.admin_percentage === undefined ? undefined : Number(r.admin_percentage),
        status: r.status as JobStatus,
        proofUrl: r.proof_url ?? undefined,
        note: r.note ?? undefined,
        rejection_reason: r.rejection_reason ?? undefined,
        rejected_at: r.rejected_at ?? undefined,
        admin_verified_at: r.admin_verified_at ?? null,
        customer_rated_at: r.customer_rated_at ?? null,
        updatedAt: r.updated_at,
        campaignId: r.campaign_id ?? undefined,
        attendance_status: (r.attendance_status as any) ?? null,
        attendance_confirmed_at: r.attendance_confirmed_at ?? null,
        checkin_at: r.checkin_at ?? null,
        checkout_at: r.checkout_at ?? null,
        activity_note: r.activity_note ?? null,
        location_name: r.location_name ?? null,
        event_date: r.event_date ?? null,
        event_time: r.event_time ?? null,
      };

      if (isMine) {
        mine.push(job);
        continue;
      }
      // Job terbuka: satu kartu per kampanye, hitung slot tersisa.
      const key = campaignKey;
      if (claimedCampaigns.has(key)) continue;
      const existing = openByCampaign.get(key);
      if (existing) {
        existing.count += 1;
        if (r.created_at > (existing.job.updatedAt ?? "")) existing.job = { ...job };
      } else {
        openByCampaign.set(key, { job, count: 1 });
      }
    }

    // Gabungkan job lokal jika ada agar data riwayat tidak pernah hilang
    for (const lj of store.state.jobs || []) {
      const alreadyInMine = mine.some((m) => m.id === lj.id || m.id === DB_PREFIX + lj.id || (m.title === lj.title && m.platform === lj.platform));
      if (!alreadyInMine && lj.status !== "Tersedia") {
        mine.push({
          id: lj.id,
          title: lj.title,
          platform: lj.platform,
          brief: lj.brief,
          deadline: lj.deadline,
          payout: lj.payout,
          status: lj.status,
          proofUrl: lj.proofUrl,
          note: lj.note,
          rejection_reason: lj.rejection_reason,
          rejected_at: lj.rejected_at,
          admin_verified_at: lj.admin_verified_at ?? null,
          customer_rated_at: lj.customer_rated_at ?? null,
          updatedAt: lj.updatedAt || new Date().toISOString(),
          attendance_status: (lj as any).attendance_status ?? null,
          attendance_confirmed_at: (lj as any).attendance_confirmed_at ?? null,
          checkin_at: (lj as any).checkin_at ?? null,
          checkout_at: (lj as any).checkout_at ?? null,
          activity_note: (lj as any).activity_note ?? null,
          location_name: (lj as any).location_name ?? null,
          event_date: (lj as any).event_date ?? null,
          event_time: (lj as any).event_time ?? null,
        });
      }
    }

    const open = [...openByCampaign.values()].map(({ job, count }) => ({ ...job, slotsLeft: count }));
    const byNewest = (a: MergedJob, b: MergedJob) => (a.updatedAt < b.updatedAt ? 1 : -1);
    return [...mine.sort(byNewest), ...open.sort(byNewest)];
  }, [rows, email, store.state.jobs]);
  return { jobs, refetch };
}

export const Route = createFileRoute("/buzzer")({
  head: () => ({ meta: [{ title: "Buzzer Dashboard — BuzzHub" }] }),
  component: BuzzerPage,
});

type SectionKey = "jobs" | "sosmed" | "penghasilan" | "ulasan" | "profil" | "pesan" | "bantuan" | "pengaturan";

const BUZZER_SECTIONS: SectionKey[] = [
  "jobs",
  "sosmed",
  "penghasilan",
  "ulasan",
  "profil",
  "pesan",
  "bantuan",
  "pengaturan",
];

function getInitialBuzzerSection(): SectionKey {
  if (typeof window !== "undefined") {
    const sp = new URLSearchParams(window.location.search).get("section") as SectionKey | null;
    if (sp && BUZZER_SECTIONS.includes(sp)) return sp;
    try {
      const stored = localStorage.getItem("buzzhub.active_section.buzzer") as SectionKey | null;
      if (stored && BUZZER_SECTIONS.includes(stored)) return stored;
    } catch {}
  }
  return "jobs";
}

const navItems: { key: SectionKey; label: string; shortLabel?: string; icon: ReactNode }[] = [
  { key: "jobs", label: "Job Tersedia", shortLabel: "Jobs", icon: <Briefcase className="h-4 w-4" /> },
  { key: "sosmed", label: "Akun Sosial Media", shortLabel: "Sosmed", icon: <Link2 className="h-4 w-4" /> },
  { key: "penghasilan", label: "Penghasilan", icon: <Wallet className="h-4 w-4" /> },
  { key: "ulasan", label: "Rating & Ulasan", icon: <Star className="h-4 w-4" /> },
  { key: "profil", label: "Profil", icon: <User className="h-4 w-4" /> },
  { key: "pesan", label: "Pesan", icon: <MessageCircle className="h-4 w-4" /> },
  { key: "bantuan", label: "Bantuan", icon: <LifeBuoy className="h-4 w-4" /> },
  { key: "pengaturan", label: "Pengaturan", icon: <Settings className="h-4 w-4" /> },
];

const sectionMeta: Record<SectionKey, { title: string; subtitle: string }> = {
  jobs: { title: "Job Tersedia", subtitle: "Ambil job baru & kelola progress kamu" },
  sosmed: { title: "Akun Sosial Media", subtitle: "Kelola akun sosmed yang dipakai untuk campaign" },
  penghasilan: { title: "Penghasilan", subtitle: "Riwayat saldo, pembayaran & pencairan" },
  ulasan: { title: "Rating & Ulasan", subtitle: "Penilaian performa & feedback dari customer" },
  profil: { title: "Profil Buzzer", subtitle: "Kelola data & preferensi akun kamu" },
  pesan: { title: "Pesan", subtitle: "Chat langsung dengan tim support BuzzHub" },
  bantuan: { title: "Bantuan", subtitle: "Panduan, FAQ, dan kontak support BuzzHub" },
  pengaturan: { title: "Pengaturan", subtitle: "Kelola preferensi notifikasi dan akun buzzer kamu" },
};

const PLATFORM_ICON: Record<Platform, ReactNode> = {
  "TikTok": <Music2 className="h-3.5 w-3.5" />,
  "Instagram": <Instagram className="h-3.5 w-3.5" />,
  "X (Twitter)": <Twitter className="h-3.5 w-3.5" />,
  "Facebook": <Facebook className="h-3.5 w-3.5" />,
  "YouTube": <Youtube className="h-3.5 w-3.5" />,
  "Telegram": <Send className="h-3.5 w-3.5" />,
  "LinkedIn": <Link2 className="h-3.5 w-3.5" />,
};

function BuzzerPage() {
  const session = useRequireRole("buzzer");
  const navigate = useNavigate();
  const store = useBuzzerStore(session?.email, session?.name, session ? {
    name: session.name,
    email: session.email,
    phone: session.phone ?? "",
    platform: (session.platform as Platform) ?? "Instagram",
    followers: session.followers ?? 0,
    bio: session.bio ?? "",
    username: session.username ?? "",
    avatarUrl: session.avatarUrl,
    buzzerCategory: session.company || "Buzzer Online",
  } : {});
  const [applicationData, setApplicationData] = useState<BuzzerApplication | null>(null);
  // Render awal harus sama antara server dan client. Section dari URL/localStorage
  // baru diterapkan setelah mount agar tidak memicu hydration mismatch.
  const [section, setSection] = useState<SectionKey>("jobs");
  const [initialSectionReady, setInitialSectionReady] = useState(false);
  // Section yang pernah dibuka tetap ter-mount (disembunyikan) supaya
  // perpindahan menu berikutnya tidak memuat ulang data dari awal.
  const [visitedSections, setVisitedSections] = useState<SectionKey[]>(() => [section]);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const { collapsed, toggle } = useSidebarCollapsed("buzzer");

  const markVisited = useCallback((key: SectionKey) => {
    setVisitedSections((prev) => (prev.includes(key) ? prev : [...prev, key]));
  }, []);
  const notifState = useBuzzerNotifications(session?.email);
  const [verificationStatus, setVerificationStatus] = useState<BuzzerAppStatus | null>(null);
  const [verificationLoading, setVerificationLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setVerificationLoading(true);
    if (!session?.email) return;

    Promise.all([
      getBuzzerVerificationStatus(session.email),
      getApplicationByEmail(session.email),
    ]).then(([status, app]) => {
      if (!active) return;
      setVerificationStatus(status);
      setVerificationLoading(false);
      if (app) {
        setApplicationData(app);
        const curProf = store.state.profile;
        if (
          (app.city && app.city !== curProf.city) ||
          (app.address && app.address !== curProf.address) ||
          (app.buzzerCategory && app.buzzerCategory !== curProf.buzzerCategory)
        ) {
          store.updateProfile({
            city: app.city || curProf.city,
            address: app.address || curProf.address,
            buzzerCategory: app.buzzerCategory || curProf.buzzerCategory,
          });
        }
      }
    });
    return () => { active = false; };
  }, [session?.email]);

  const { jobs: allMergedJobs, refetch: refetchJobs } = useMergedJobs(store, true);

  useEffect(() => {
    const initial = getInitialBuzzerSection();
    if (initial !== "jobs") {
      setSection(initial);
      setVisitedSections((prev) => (prev.includes(initial) ? prev : [...prev, initial]));
    }
    setInitialSectionReady(true);
  }, []);

  useEffect(() => {
    if (!initialSectionReady) return;
    markVisited(section);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("buzzhub.active_section.buzzer", section);
      } catch {}
      const url = new URL(window.location.href);
      if (url.searchParams.get("section") !== section) {
        url.searchParams.set("section", section);
        window.history.replaceState(null, "", url.toString());
      }
    }
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [section, initialSectionReady, markVisited]);

  useEffect(() => {
    const handlePopState = () => {
      const sp = new URLSearchParams(window.location.search).get("section") as SectionKey | null;
      if (sp && BUZZER_SECTIONS.includes(sp)) {
        markVisited(sp);
        setSection(sp);
      }
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [markVisited]);

  if (!session || verificationLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-accent/30 p-6">
        <div className="mx-auto max-w-md space-y-3">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  const doLogout = () => {
    clearSession();
    try {
      localStorage.removeItem("buzzhub.active_section.buzzer");
    } catch {}
    toast.success("Berhasil keluar");
    navigate({ to: "/" });
  };

  const go = (k: SectionKey) => {
    markVisited(k);
    setSection(k);
    setMobileOpen(false);
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  };

  const sidebarUser = {
    name: store.state.profile.name || session.name,
    email: store.state.profile.email || session.email,
    avatarUrl: store.state.profile.avatarUrl || session.avatarUrl,
    roleLabel: "buzzer",
  };
  const renderSidebar = (isCollapsed = false, withToggle = false) => (
    <SidebarNav
      nav={navItems}
      activeKey={section}
      onNavigate={go}
      onPrefetch={markVisited}
      user={sidebarUser}
      onLogout={() => setLogoutOpen(true)}
      collapsed={isCollapsed}
      onToggleCollapse={withToggle ? toggle : undefined}
    />
  );

  const meta = sectionMeta[section] || { title: "Buzzer Dashboard", subtitle: "Kelola akun dan aktivitas Anda" };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/30">
      <div className="flex w-full items-start">
        <aside
          className={cn(
            "sticky top-0 hidden h-screen shrink-0 transition-[width] duration-300 ease-in-out motion-reduce:transition-none md:block",
            collapsed ? "w-[100px]" : "w-64",
          )}
        >
          <div
            className={cn(
              "sidebar-surface h-full overflow-y-auto overscroll-contain scrollbar-slim border-r border-white/15 shadow-md transition-[padding] duration-300 ease-in-out motion-reduce:transition-none",
              collapsed ? "p-2" : "p-4",
            )}
          >
            {renderSidebar(collapsed, true)}
          </div>
        </aside>

        <main className="min-w-0 flex-1 pb-24 md:pb-0">
          <div className="mx-auto w-full max-w-[1200px] px-3 py-4 sm:px-6 lg:px-8">
          <header className="mb-6 flex min-h-[56px] sm:min-h-[60px] items-center justify-between gap-4">
            <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
              {/* Mobile hamburger */}
              <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="md:hidden h-9 w-9 shrink-0" aria-label="Buka menu">
                    <Menu className="h-4 w-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-72 border-r-white/10 p-0 text-white">
                  <div className="sidebar-surface h-full overflow-y-auto overscroll-contain scrollbar-slim p-4">
                    {renderSidebar()}
                  </div>
                </SheetContent>
              </Sheet>

              <div className="flex min-w-0 flex-col justify-center">
                <h1 className="truncate font-display text-lg font-bold leading-6 tracking-tight sm:text-2xl sm:leading-7">
                  {meta.title}
                </h1>
                <p className="line-clamp-2 text-[11px] leading-4 text-muted-foreground sm:truncate sm:text-sm sm:leading-5">
                  {meta.subtitle}
                </p>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
              <ThemeToggle />
              <BuzzerNotifBell notifState={notifState} email={session.email} onClick={() => setNotifOpen(true)} />
              <Button variant="outline" size="icon" className="md:hidden h-9 w-9" aria-label="Keluar" onClick={() => setLogoutOpen(true)}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </header>

          {visitedSections.map((key) => (
            <div key={key} hidden={section !== key}>
              {key === "jobs" && (
                <JobsSection
                  store={store}
                  verificationStatus={verificationStatus}
                  onGoProfil={() => go("profil")}
                  onGoSosmed={() => go("sosmed")}
                  sessionAvatar={session.avatarUrl}
                />
              )}
              {key === "sosmed" && <SosmedSection email={session.email} name={session.name} />}
              {key === "penghasilan" && <PenghasilanSection store={store} />}
              {key === "ulasan" && <RatingUlasanSection store={store} />}
              {key === "profil" && <ProfilSection store={store} onGoRatings={() => go("ulasan")} />}
              {key === "pesan" && (
                <SupportMessageSection
                  role="buzzer"
                  user={{ name: store.state.profile.name || session.name, email: session.email }}
                  active={section === "pesan"}
                  onNavigate={(target) => go(target as SectionKey)}
                />
              )}
              {key === "bantuan" && (
                <HelpSection
                  role="buzzer"
                  user={{ name: store.state.profile.name || session.name, email: session.email }}
                  onNavigate={(target) => go(target as SectionKey)}
                />
              )}
              {key === "pengaturan" && <BuzzerSettingsSection buzzerEmail={session.email} />}
            </div>
          ))}
          </div>
        </main>
      </div>

      {/* Mobile bottom nav */}
      <MobileBottomNav
        nav={navItems}
        activeKey={section}
        onNavigate={go}
        onPrefetch={markVisited}
        primaryKeys={["jobs", "sosmed", "penghasilan", "profil"]}
      />

      <BuzzerNotifSheet
        notifState={notifState}
        open={notifOpen}
        onOpenChange={setNotifOpen}
        buzzerEmail={session.email}
        onNavigate={(sec) => {
          setSection(sec as SectionKey);
          setNotifOpen(false);
        }}
      />

      <AlertDialog open={logoutOpen} onOpenChange={setLogoutOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Keluar akun buzzer?</AlertDialogTitle>
            <AlertDialogDescription>
              Anda akan keluar dari sesi saat ini. Data lokal tetap tersimpan aman.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={doLogout} className="gradient-brand text-brand-foreground">Keluar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}


/* ==================== RINGKASAN ==================== */
function RingkasanSection({ store, onGoJobs }: { store: Store; onGoJobs: () => void }) {
  const { state } = store;
  const { jobs, refetch } = useMergedJobs(store, true);
  const now = new Date();
  const monthEarnings = state.earnings
    .filter((e) => e.status === "Berhasil" && new Date(e.date).getMonth() === now.getMonth())
    .reduce((a, e) => a + e.amount, 0);
  const jobsDone = jobs.filter((j) => j.status === "Selesai").length + state.profile.jobsCompleted;
  const activeJobs = jobs.filter((j) => ["Tersedia", "Diambil", "Upload", "Review", "Revisi"].includes(j.status));

  return (
    <>
      <div className="relative mb-4 overflow-hidden rounded-2xl border border-border">
        <img
          src={buzzerHero}
          alt="Komunitas buzzer BuzzHub sedang menjalankan campaign media sosial"
          width={1600}
          height={560}
          className="h-40 w-full object-cover sm:h-52"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-center gap-1 p-5 sm:p-7">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Dashboard Buzzer</p>
          <h2 className="font-display text-xl font-bold sm:text-2xl">Ambil job, naikkan level, cairkan saldo</h2>
          <p className="max-w-md text-sm text-muted-foreground">Semua campaign aktif dan penghasilan kamu dalam satu tempat.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Saldo Tersedia" value={formatIDR(state.balance)} hint="Cair tiap Senin" icon={<Wallet className="h-5 w-5" />} />
        <StatCard label="Job Aktif" value={activeJobs.length.toString()} hint="Sedang berjalan" icon={<Inbox className="h-5 w-5" />} />
        <StatCard label="Job Selesai" value={jobsDone.toString()} hint="Total karier" icon={<CheckCircle2 className="h-5 w-5" />} />
        <StatCard label="Rating" value={state.profile.rating.toFixed(1)} hint="dari 5.0" icon={<Star className="h-5 w-5" />} />
      </div>


      <div className="mt-4">
        <LevelCard email={state.profile.email} name={state.profile.name} simple />
      </div>


      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-display text-lg font-bold">Job Tersedia & Aktif</h3>
            <span className="text-sm text-muted-foreground">{activeJobs.length} job</span>
          </div>
          {activeJobs.length === 0 ? (
            <EmptyState icon={<Inbox className="h-8 w-8" />} title="Belum ada job aktif" desc="Cek menu Job Tersedia untuk ambil job baru." action={<Button onClick={onGoJobs} className="gradient-brand text-brand-foreground">Lihat Job</Button>} />
          ) : (
            <div className="space-y-3">
              {activeJobs.slice(0, 4).map((j) => (
                <JobCard key={j.id} job={j} store={store} onUpdated={refetch} />
              ))}
              {activeJobs.length > 4 && (
                <Button variant="outline" className="w-full" onClick={onGoJobs}>Lihat semua {activeJobs.length} job</Button>
              )}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <Avatar className="h-14 w-14">
                {(state.profile.avatarUrl || store.state.profile.avatarUrl) && (
                  <AvatarImage src={state.profile.avatarUrl || store.state.profile.avatarUrl} alt={state.profile.name} />
                )}
                <AvatarFallback className="gradient-brand font-bold text-brand-foreground">
                  {state.profile.name.split(" ").map(n=>n[0]).join("").slice(0,2)}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="truncate font-bold">{state.profile.name}</p>
                <p className="truncate text-xs text-muted-foreground">{state.profile.username} · {state.profile.platform}</p>
              </div>
            </div>
            <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-lg bg-muted/50 p-3"><dt className="text-xs text-muted-foreground">Followers</dt><dd className="font-bold">{state.profile.followers.toLocaleString("id-ID")}</dd></div>
              <div className="rounded-lg bg-muted/50 p-3"><dt className="text-xs text-muted-foreground">Status</dt><dd><StatusBadge status="Aktif" /></dd></div>
            </dl>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <h3 className="flex items-center gap-2 font-display text-lg font-bold"><Trophy className="h-4 w-4 text-amber-500" /> Leaderboard</h3>
            <ul className="mt-3 space-y-2 text-sm">
              {[...leaderboardSeed].sort((a,b)=>b.earnings-a.earnings).slice(0,5).map((b, i) => (
                <li key={b.id} className="flex items-center justify-between rounded-lg p-2 hover:bg-muted/50">
                  <span className="flex items-center gap-2 min-w-0">
                    <span className="w-4 text-xs font-bold text-muted-foreground">{i+1}</span>
                    <BuzzerNameLink name={b.name} email={b.id} className="truncate text-sm" variant="muted" />
                  </span>
                  <span className="whitespace-nowrap font-semibold">{formatIDR(b.earnings)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}

/* ==================== JOBS ==================== */
const PLATFORM_FILTERS: ("Semua" | Platform)[] = ["Semua", "TikTok", "Instagram", "X (Twitter)", "Facebook", "YouTube", "Telegram", "LinkedIn"];
const PAGE_SIZE = 5;

function hasUnreachedDeadline(deadline: string) {
  if (!deadline) return true;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(deadline)) return true;
  const today = new Date();
  const localToday = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0"),
  ].join("-");
  return deadline >= localToday;
}

function JobsSection({
  store,
  verificationStatus,
  onGoProfil,
  onGoSosmed,
  sessionAvatar,
}: {
  store: Store;
  verificationStatus: BuzzerAppStatus | null;
  onGoProfil?: () => void;
  onGoSosmed?: () => void;
  sessionAvatar?: string;
}) {
  const { jobs, refetch } = useMergedJobs(store, true);
  const { accounts: socialAccounts } = useSocialAccounts(store.state.profile.email, store.state.profile.name);
  const [platform, setPlatform] = useState<"Semua" | Platform>("Semua");
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [tab, setTab] = useState<"tersedia" | "saya" | "riwayat">(() => {
    if (typeof window !== "undefined") {
      const sp = new URLSearchParams(window.location.search).get("tab") as any;
      if (sp && ["tersedia", "saya", "riwayat"].includes(sp)) return sp;
      try {
        const stored = localStorage.getItem("buzzhub.active_tab.buzzer_jobs") as any;
        if (stored && ["tersedia", "saya", "riwayat"].includes(stored)) return stored;
      } catch {}
    }
    return "tersedia";
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("buzzhub.active_tab.buzzer_jobs", tab);
      } catch {}
      const url = new URL(window.location.href);
      if (url.searchParams.get("tab") !== tab) {
        url.searchParams.set("tab", tab);
        window.history.replaceState(null, "", url.toString());
      }
    }
  }, [tab]);

  const verifiedPlatforms = useMemo(() => {
    const set = new Set<string>();
    for (const a of socialAccounts) {
      if (a.verification?.toLowerCase() === "terverifikasi" && a.isActive !== false) {
        set.add(a.platform.trim().toLowerCase());
      }
    }
    if (socialAccounts.length === 0 && store.state.profile.platform) {
      set.add(store.state.profile.platform.trim().toLowerCase());
    }
    return set;
  }, [socialAccounts, store.state.profile.platform]);

  // Tampilkan SEMUA job yang tersedia tanpa membatasi platform akun buzzer
  const availableJobs = useMemo(
    () =>
      jobs.filter((j) => {
        if (j.status !== "Tersedia") return false;
        if (!hasUnreachedDeadline(j.deadline)) return false;
        return true;
      }),
    [jobs],
  );
  const myJobs = useMemo(
    () => jobs.filter((j) => {
      return ["Diambil", "Upload", "Review", "Revisi", "Selesai", "Ditolak"].includes(j.status);
    }),
    [jobs],
  );

  // These hooks must run for every verification state. Previously they ran only
  // after approval, which changed the hook order from a pending/rejected render
  // and crashed React as soon as the status became approved.
  const activeJobs = useMemo(
    () => (tab === "tersedia" ? availableJobs : tab === "saya" ? myJobs : jobs.filter((j) => ["Selesai", "Ditolak"].includes(j.status))),
    [availableJobs, myJobs, jobs, tab],
  );

  const filtered = useMemo(() => {
    return activeJobs.filter((j) => {
      if (platform !== "Semua" && j.platform !== platform) return false;
      if (q && !j.title.toLowerCase().includes(q.toLowerCase()) && !j.brief.toLowerCase().includes(q.toLowerCase())) return false;
      return true;
    });
  }, [activeJobs, platform, q]);

  const showMyJobs = async () => {
    // Read the claimed job immediately after the RPC succeeds. This avoids
    // waiting for the realtime event (or a browser refresh) before changing
    // the user to the Job Saya tab.
    await refetch();
    setTab("saya");
    setPage(1);
  };

  const avatarUrl = store.state.profile.avatarUrl || sessionAvatar;


  if (verificationStatus === "rejected") {
    return (
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-5 text-rose-900">
          <h2 className="font-display text-lg font-bold">Verifikasi Ditolak</h2>
          <p className="mt-2 text-sm">
            Pendaftaran Anda telah ditolak oleh Admin. Anda tidak dapat mengambil job melalui akun ini.
          </p>
        </div>
      </div>
    );
  }

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paged = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const platformSummary = useMemo(() => {
    const list: string[] = [];
    for (const a of socialAccounts) {
      if (a.verification === "Terverifikasi" && a.isActive !== false && !list.includes(a.platform)) {
        list.push(a.platform);
      }
    }
    if (list.length === 0 && store.state.profile.platform) {
      list.push(store.state.profile.platform);
    }
    return list.join(", ");
  }, [socialAccounts, store.state.profile.platform]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-card p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12 border-2 border-background shadow-sm">
            {avatarUrl && <AvatarImage src={avatarUrl} alt={store.state.profile.name} />}
            <AvatarFallback className="gradient-brand font-bold text-sm text-brand-foreground">
              {store.state.profile.name.split(" ").map(n=>n[0]).join("").slice(0,2)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="font-display font-bold">{store.state.profile.name}</h2>
              <StatusBadge status="Aktif" />
            </div>
            <p className="text-xs text-muted-foreground">
              {store.state.profile.username} · <span className="font-medium text-foreground">{platformSummary}</span> · {store.state.profile.followers.toLocaleString("id-ID")} followers
            </p>
          </div>
        </div>
        {onGoProfil && (
          <Button size="sm" variant="outline" onClick={onGoProfil}>
            <User className="mr-1.5 h-3.5 w-3.5" /> Kelola Profil
          </Button>
        )}
      </div>

      {verificationStatus === "pending" && (
        <div className="flex items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-3.5 text-xs text-amber-900 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-200">
          <AlertCircle className="h-4 w-4 shrink-0 text-amber-600" />
          <p>
            Akun buzzer Anda sedang menunggu verifikasi admin. Anda tetap dapat melihat seluruh job yang tersedia di bawah ini.
          </p>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-border bg-card p-4">
        <div className="relative flex-1 min-w-[180px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input className="pl-9" placeholder="Cari job..." value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} />
        </div>
        <Select value={platform} onValueChange={(v) => { setPlatform(v as typeof platform); setPage(1); }}>
          <SelectTrigger className="w-[180px]"><Filter className="mr-2 h-4 w-4" /><SelectValue /></SelectTrigger>
          <SelectContent>
            {PLATFORM_FILTERS.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <Tabs value={tab} onValueChange={(v) => { setTab(v as typeof tab); setPage(1); }}>
        <TabsList>
          <TabsTrigger value="tersedia">Job Tersedia ({availableJobs.length})</TabsTrigger>
          <TabsTrigger value="saya">Job Saya ({myJobs.length})</TabsTrigger>
          <TabsTrigger value="riwayat">Riwayat ({jobs.filter((j) => ["Selesai", "Ditolak"].includes(j.status)).length})</TabsTrigger>
        </TabsList>
        <TabsContent value={tab} className="mt-4 space-y-3">
          {paged.length === 0 ? (
            <EmptyState
              icon={<Inbox className="h-8 w-8" />}
              title={tab === "tersedia" ? "Belum ada job tersedia" : tab === "saya" ? "Belum ada job yang sedang Anda kerjakan" : "Belum ada riwayat job"}
              desc={tab === "tersedia" ? "Cek kembali nanti untuk job kampanye baru." : tab === "saya" ? "Ambil job dari daftar Job Tersedia untuk mulai mengerjakan." : "Semua pekerjaan yang sudah selesai atau ditolak akan muncul di sini."}
            />
          ) : (
            paged.map((j) => (
              <JobCard
                key={j.id}
                job={j}
                store={store}
                hasPlatformAccount={verifiedPlatforms.has(j.platform.trim().toLowerCase())}
                onGoSosmed={onGoSosmed}
                onTaken={showMyJobs}
                onUpdated={refetch}
              />
            ))
          )}

          {filtered.length > PAGE_SIZE && (
            <div className="flex items-center justify-between pt-3">
              <p className="text-xs text-muted-foreground">
                Menampilkan {(currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, filtered.length)} dari {filtered.length}
              </p>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" disabled={currentPage <= 1} onClick={() => setPage(currentPage - 1)}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="grid place-items-center px-3 text-sm">{currentPage} / {totalPages}</span>
                <Button size="sm" variant="outline" disabled={currentPage >= totalPages} onClick={() => setPage(currentPage + 1)}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function statusVisual(s: JobStatus) {
  const map: Record<JobStatus, string> = {
    Tersedia: "bg-blue-100 text-blue-700",
    Diambil: "bg-indigo-100 text-indigo-700",
    Upload: "bg-cyan-100 text-cyan-700",
    Review: "bg-amber-100 text-amber-700",
    Revisi: "bg-orange-100 text-orange-700",
    Selesai: "bg-emerald-100 text-emerald-700",
    Ditolak: "bg-rose-100 text-rose-700",
  };
  return map[s];
}

function jobStatusLabel(job: Pick<MergedJob, "status" | "admin_verified_at">) {
  if (job.status === "Review" && !job.admin_verified_at) return "Verifikasi Admin";
  if (job.status === "Review" && job.admin_verified_at) return "Review Customer";
  return job.status;
}



function parseBuzzerJobBrief(briefText: string, jobTitle: string = "", platform: string = "") {
  let targetUrl: string | null = null;
  let taskAction: string | null = null;
  let customerInstructions: string = "";

  // 1. Extract URL (http://, https://, or common social media domains)
  const urlMatch = briefText.match(/https?:\/\/[^\s"'<>\)]+/i) ||
    briefText.match(/(?:(?:www\.)?(?:instagram\.com|tiktok\.com|youtube\.com|youtu\.be|twitter\.com|x\.com|facebook\.com|fb\.watch|t\.me)[^\s"'<>\)]*)/i);
  if (urlMatch) {
    let raw = urlMatch[0];
    if (!raw.startsWith("http://") && !raw.startsWith("https://")) {
      raw = `https://${raw}`;
    }
    targetUrl = raw;
  }

  // 2. Extract Task Action (Jenis Tugas)
  const taskMatch = briefText.match(/(?:Jenis Tugas|Perintah|Tugas|Layanan|Action):\s*([^\n\r]+)/i);
  if (taskMatch) {
    taskAction = taskMatch[1].trim();
  }

  // Fallback taskAction from jobTitle or platform
  if (!taskAction) {
    const lowerTitle = jobTitle.toLowerCase();
    if (lowerTitle.includes("like") && (lowerTitle.includes("komentar") || lowerTitle.includes("comment"))) {
      taskAction = "Like + Komentar";
    } else if (lowerTitle.includes("like") || lowerTitle.includes("suka")) {
      taskAction = "Like Postingan / Video";
    } else if (lowerTitle.includes("komentar") || lowerTitle.includes("comment")) {
      taskAction = "Tulis Komentar";
    } else if (lowerTitle.includes("follow") || lowerTitle.includes("ikuti")) {
      taskAction = "Follow Akun Target";
    } else if (lowerTitle.includes("share") || lowerTitle.includes("bagikan")) {
      taskAction = "Share / Bagikan Konten";
    } else if (lowerTitle.includes("review") || lowerTitle.includes("ulasan")) {
      taskAction = "Beri Ulasan / Review";
    } else {
      taskAction = `Engagement ${platform || "Sosial Media"}`;
    }
  }

  // 3. Extract Customer Instructions
  const instructMatch = briefText.match(/(?:Catatan Customer|Instruksi Customer|Detail Instruksi|Instruksi):\s*([\s\S]+)/i);
  if (instructMatch) {
    customerInstructions = instructMatch[1].trim();
  } else {
    const cleaned = briefText
      .replace(/📌?\s*Jenis Tugas:\s*[^\n\r]+/gi, "")
      .replace(/🔗?\s*Link Target(?:\s*Pengerjaan)?:\s*[^\n\r]+/gi, "")
      .replace(/📍?\s*Lokasi:\s*[^\n\r]+/gi, "")
      .trim();
    customerInstructions = cleaned || briefText;
  }

  // Filter out empty placeholder dots or filler text
  const trimmed = customerInstructions.trim();
  if (trimmed === "." || trimmed === "-" || trimmed.toLowerCase() === "snckjeh" || trimmed.toLowerCase() === "null") {
    customerInstructions = "";
  } else {
    customerInstructions = trimmed;
  }

  return { targetUrl, taskAction, customerInstructions };
}

async function mergeImagesToPdf(files: File[]): Promise<File> {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const maxWidth = pageWidth - margin * 2;
  const maxHeight = pageHeight - margin * 2;

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = reject;
      image.src = dataUrl;
    });

    const naturalWidth = img.naturalWidth || img.width || 800;
    const naturalHeight = img.naturalHeight || img.height || 600;

    const scale = Math.min(maxWidth / naturalWidth, maxHeight / naturalHeight, 1);
    const renderWidth = naturalWidth * scale;
    const renderHeight = naturalHeight * scale;
    const x = (pageWidth - renderWidth) / 2;
    const y = (pageHeight - renderHeight) / 2;

    if (i > 0) {
      doc.addPage("a4", "portrait");
    }
    const format = file.type === "image/png" ? "PNG" : "JPEG";
    doc.addImage(dataUrl, format, x, y, renderWidth, renderHeight, undefined, "FAST");
  }

  const pdfBlob = doc.output("blob");
  return new File([pdfBlob], `bukti-pengerjaan-${files.length}-halaman.pdf`, {
    type: "application/pdf",
    lastModified: Date.now(),
  });
}

function JobCard({
  job,
  store,
  hasPlatformAccount = true,
  onGoSosmed,
  onTaken,
  onUpdated,
}: {
  job: MergedJob;
  store: Store;
  hasPlatformAccount?: boolean;
  onGoSosmed?: () => void;
  onTaken?: () => Promise<void>;
  onUpdated?: () => Promise<void> | void;
}) {
  const [open, setOpen] = useState<null | "detail" | "upload" | "revisi" | "status" | "hasil">(null);
  const [noAccountWarningOpen, setNoAccountWarningOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [proof, setProof] = useState("");
  const [shot, setShot] = useState<File | null>(null);
  const [shotPreview, setShotPreview] = useState<string | null>(null);
  const [converting, setConverting] = useState(false);
  const [convertedCount, setConvertedCount] = useState<number | null>(null);
  const [optimisticStatus, setOptimisticStatus] = useState<JobStatus | null>(null);
  const [optimisticProofUrl, setOptimisticProofUrl] = useState<string | null>(null);

  useEffect(() => {
    setOptimisticStatus(null);
    setOptimisticProofUrl(null);
  }, [job.status, job.proofUrl]);

  const currentStatus = optimisticStatus || job.status;
  const currentProofUrl = optimisticProofUrl || job.proofUrl;
  const currentJob = useMemo(
    () => ({
      ...job,
      status: currentStatus,
      proofUrl: currentProofUrl,
    }),
    [job, currentStatus, currentProofUrl]
  );

  const handleTakeJob = async () => {
    if (!hasPlatformAccount && currentStatus === "Tersedia") {
      setNoAccountWarningOpen(true);
      return;
    }
    await doTake();
  };

  const pickFiles = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) {
      setShot(null);
      setShotPreview(null);
      setConvertedCount(null);
      return;
    }

    const files = Array.from(fileList);
    if (files.length === 1) {
      const file = files[0];
      const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
      if (isPdf) {
        setShot(file);
        setShotPreview(null);
        setConvertedCount(null);
      } else {
        setShot(file);
        setShotPreview(URL.createObjectURL(file));
        setConvertedCount(null);
      }
      return;
    }

    const hasPdf = files.some((f) => f.type === "application/pdf" || f.name.toLowerCase().endsWith(".pdf"));
    if (hasPdf) {
      toast.error("Jika ingin mengunggah file PDF, silakan pilih 1 file PDF saja.");
      return;
    }

    setConverting(true);
    try {
      toast.info(`Menggabungkan ${files.length} gambar menjadi 1 file PDF...`);
      const pdf = await mergeImagesToPdf(files);
      setShot(pdf);
      setShotPreview(null);
      setConvertedCount(files.length);
      toast.success(`${files.length} gambar berhasil dijadikan 1 file PDF!`);
    } catch (err) {
      console.error("[Proof Upload] Gagal membuat PDF:", err);
      toast.error("Gagal menggabungkan gambar menjadi PDF.");
    } finally {
      setConverting(false);
    }
  };

  const resetProofForm = () => {
    setProof("");
    setShot(null);
    setShotPreview(null);
    setConvertedCount(null);
  };
  const lv = useBuzzerLevel(store.state.profile.email);
  const jobLevel = job.buzzerLevel ?? lv.level?.name ?? "Belum ditetapkan";
  const buzzerPct = getBuzzerPercentageForLevel(job.buzzerLevel ?? lv.level?.name);
  const grossPrice = Math.max(0, job.grossPrice ?? 0);
  const payout = (() => {
    // Job yang sudah diambil memakai snapshot payout dari database. Ini
    // mencegah nominal berubah ketika level buzzer naik setelah job diambil.
    if (currentStatus !== "Tersedia") {
      const snapshot = Number(job.buzzerAmount ?? job.payout ?? 0);
      if (snapshot > 0) return Math.round(snapshot);
    }
    if (grossPrice <= 0) return 0;
    return Math.round((grossPrice * buzzerPct) / 100);
  })();
  const buzzerPercentage = buzzerPct;

  const parsed = useMemo(
    () => parseBuzzerJobBrief(job.brief, job.title, job.platform),
    [job.brief, job.title, job.platform]
  );

  const displayBrief = useMemo(() => {
    if (!job.brief) return "";
    if (job.brief.includes("📌") || job.brief.includes("Jenis Tugas:") || job.brief.includes("Link Target:")) {
      const parts: string[] = [];
      if (parsed.taskAction) parts.push(parsed.taskAction);
      if (parsed.customerInstructions) parts.push(parsed.customerInstructions);
      return parts.join(" — ");
    }
    return job.brief;
  }, [job.brief, parsed.taskAction, parsed.customerInstructions]);

  const copyToClipboard = (text: string, label: string) => {
    try {
      void navigator.clipboard.writeText(text);
      toast.success(`${label} berhasil disalin!`);
    } catch {
      toast.error("Gagal menyalin link.");
    }
  };

  const isRemote = job.id.startsWith(DB_PREFIX);
  const remoteId = isRemote ? job.id.slice(DB_PREFIX.length) : null;

  const doTake = async () => {
    setLoading(true);
    try {
      if (remoteId) {
        await takeCampaignJob(remoteId, store.state.profile.email, store.state.profile.name);
      } else {
        await new Promise((r) => setTimeout(r, 400));
        store.takeJob(job.id);
      }
      await onTaken?.();
      toast.success(`Job "${job.title}" berhasil diambil`);
    } catch {
      toast.error("Gagal mengambil job, coba lagi");
    } finally {
      setLoading(false);
    }
  };

  const doUpload = async () => {
    if (!shot) return toast.error("File bukti pengerjaan wajib diunggah (gambar atau PDF)");
    if (!proof.trim()) return toast.error("Link postingan wajib diisi agar admin dapat memverifikasi pengerjaan.");
    setLoading(true);
    try {
      // Job demo yang masih tersimpan di localStorage disambungkan dulu ke
      // Supabase supaya bukti dan statusnya tidak hanya tersimpan di browser.
      const targetJobId = remoteId ?? await ensureCampaignJobInSupabase(
        job,
        store.state.profile.email,
        store.state.profile.name,
      );
      const shotUrl = await uploadProofScreenshot(shot);
      const value = `${shotUrl} | ${proof.trim()}`;
      await submitCampaignJobProof(targetJobId, value, store.state.profile.email);
      store.uploadProof(job.id, value);
      setOptimisticStatus("Review");
      setOptimisticProofUrl(value);
      setOpen(null);
      resetProofForm();
      toast.success("Bukti pengerjaan berhasil diunggah, menunggu verifikasi admin");
      void notifyTaskSubmitted({
        buzzerEmail: store.state.profile.email,
        campaignTitle: job.title,
        jobId: targetJobId,
        isResubmit: false,
      });
      await onUpdated?.();
    } catch (error) {
      console.error("[Proof Upload] Gagal mengunggah bukti pekerjaan:", error);
      const detail = error instanceof Error ? error.message : String(error);
      toast.error(`Gagal mengunggah bukti: ${detail}`);
    } finally {
      setLoading(false);
    }
  };

  const doResubmit = async () => {
    if (!shot) return toast.error("File bukti pengerjaan baru wajib diunggah (gambar atau PDF)");
    if (!proof.trim()) return toast.error("Link postingan wajib diisi agar admin dapat memverifikasi pengerjaan.");
    setLoading(true);
    try {
      const targetJobId = remoteId ?? await ensureCampaignJobInSupabase(
        job,
        store.state.profile.email,
        store.state.profile.name,
      );
      const shotUrl = await uploadProofScreenshot(shot);
      const value = `${shotUrl} | ${proof.trim()}`;
      await submitCampaignJobProof(targetJobId, value, store.state.profile.email);
      store.resubmitProof(job.id, value);
      setOptimisticStatus("Review");
      setOptimisticProofUrl(value);
      setOpen(null);
      resetProofForm();
      toast.success("Perbaikan bukti berhasil dikirim ulang");
      void notifyTaskSubmitted({
        buzzerEmail: store.state.profile.email,
        campaignTitle: job.title,
        jobId: targetJobId,
        isResubmit: true,
      });
      await onUpdated?.();
    } catch (error) {
      console.error("[Proof Upload] Gagal mengirim ulang bukti pekerjaan:", error);
      const detail = error instanceof Error ? error.message : String(error);
      toast.error(`Gagal mengirim perbaikan: ${detail}`);
    } finally {
      setLoading(false);
    }
  };

  const primaryAction = (() => {
    switch (currentStatus) {
      case "Tersedia":
        return <Button size="sm" disabled={loading} onClick={handleTakeJob} className="gradient-brand text-brand-foreground shadow-glow">{loading ? "Memproses..." : "Ambil Job"}</Button>;
      case "Diambil":
        return <Button size="sm" onClick={() => setOpen("upload")} className="gradient-brand text-brand-foreground"><Upload className="mr-1 h-3.5 w-3.5" /> Upload Bukti</Button>;
      case "Review":
        return <Button size="sm" variant="outline" onClick={() => setOpen("status")}>Cek Status</Button>;
      case "Revisi":
        return <Button size="sm" onClick={() => setOpen("revisi")} className="bg-amber-500 text-white hover:bg-amber-600">Perbaiki Tugas</Button>;
      case "Selesai":
        return <Button size="sm" variant="outline" onClick={() => setOpen("hasil")}>Lihat Hasil</Button>;
      case "Ditolak":
        return <Button size="sm" variant="outline" onClick={() => setOpen("status")}>Lihat Alasan</Button>;
      case "Upload":
        return <Button size="sm" variant="outline" onClick={() => setOpen("status")}>Cek Status</Button>;
    }
  })();

  return (
    <>
      <article className="rounded-2xl border border-border bg-card p-5 transition-shadow hover:shadow-md">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-md bg-accent px-2 py-0.5 text-xs font-semibold text-accent-foreground">
                {PLATFORM_ICON[job.platform]} {job.platform}
              </span>
              <span className={cn("inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold", statusVisual(currentStatus))}>{jobStatusLabel(currentJob)}</span>
              {currentStatus === "Tersedia" && (job.slotsLeft ?? 1) > 1 && (
                <span className="inline-flex rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                  {job.slotsLeft} slot tersisa
                </span>
              )}
            </div>

            <h4 className="mt-2 truncate font-display text-base font-bold">{job.title}</h4>
            <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{displayBrief}</p>

            <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> Deadline {job.deadline}</span>
              <span className="inline-flex items-center gap-1"><DollarSign className="h-3.5 w-3.5" /> Payout {formatIDR(payout)}</span>
              <span className="inline-flex items-center gap-1 rounded-full bg-accent px-2 py-0.5 font-semibold text-accent-foreground">
                {lv.level ? `${lv.level.emoji} ${lv.level.name}` : "Level belum ditetapkan"}
              </span>
            </div>
            {currentStatus === "Revisi" && job.note && (
              <p className="mt-3 flex items-start gap-2 rounded-lg bg-amber-50 p-2 text-xs text-amber-800"><AlertCircle className="h-3.5 w-3.5 shrink-0" /> {job.note}</p>
            )}
          </div>
          <div className="flex shrink-0 flex-col gap-2">
            {primaryAction}
            {currentStatus === "Ditolak" && (
              <Button size="sm" className="gradient-brand text-brand-foreground" onClick={() => setOpen("revisi")}>
                <Upload className="mr-1 h-3.5 w-3.5" /> Upload Ulang
              </Button>
            )}
            <Button
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0"
              title="Detail"
              aria-label="Detail"
              onClick={() => setOpen("detail")}
            >
              <Eye className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </article>

      {/* Detail */}
      <Dialog open={open === "detail"} onOpenChange={(v) => !v && setOpen(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="pr-6 leading-snug">{job.title}</DialogTitle>
            <DialogDescription className="flex flex-wrap items-center gap-2 pt-1">
              <span className="inline-flex items-center gap-1 rounded-md bg-accent px-2 py-0.5 text-xs font-semibold text-accent-foreground">
                {PLATFORM_ICON[job.platform]} {job.platform}
              </span>
              <span className={cn("inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold", statusVisual(currentStatus))}>{jobStatusLabel(currentJob)}</span>
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 text-sm">
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-border bg-muted/40 p-3">
                <p className="text-xs text-muted-foreground">Fee yang kamu terima</p>
                <p className="font-display text-lg font-bold">{formatIDR(payout)}</p>
                <p className="text-xs text-muted-foreground">Sudah termasuk potongan admin · Level {lv.level?.name ?? jobLevel}</p>
              </div>
              <div className="rounded-xl border border-border bg-muted/40 p-3">
                <p className="text-xs text-muted-foreground">Deadline</p>
                <p className="font-display text-lg font-bold">{job.deadline}</p>
                <p className="text-xs text-muted-foreground">Kirim bukti sebelum tanggal ini</p>
              </div>
            </div>

            <section className="rounded-xl border border-border bg-muted/30 p-3">
              <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Rincian Pendapatan</h4>
              <div className="grid gap-2 text-sm sm:grid-cols-2">
                <p><span className="text-muted-foreground">Level:</span> <b>{jobLevel}</b></p>
                <p><span className="text-muted-foreground">Yang kamu dapatkan:</span> <b>{formatIDR(payout)}</b></p>
              </div>
            </section>

            {/* Tugas */}
            <section>
              <h4 className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Tugas</h4>
              <div className="rounded-xl border border-border p-3.5 space-y-2.5 bg-muted/20">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Perintah:</span>
                    <span className="font-bold text-foreground text-sm">{parsed.taskAction}</span>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-md bg-accent px-2 py-0.5 text-xs font-semibold text-accent-foreground">
                    {PLATFORM_ICON[job.platform]} {job.platform}
                  </span>
                </div>

                {parsed.targetUrl ? (
                  <div className="border-t border-border pt-2.5">
                    <p className="text-xs text-muted-foreground mb-1.5">Link Target (klik untuk langsung membuka):</p>
                    <a
                      href={parsed.targetUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="group flex items-center justify-between gap-2.5 rounded-lg border border-primary/30 bg-primary/5 p-2.5 transition-colors hover:border-primary hover:bg-primary/10 cursor-pointer"
                      title="Klik untuk langsung membuka video/postingan target"
                    >
                      <span className="font-mono text-xs text-primary underline underline-offset-2 break-all line-clamp-2 font-medium">
                        {parsed.targetUrl}
                      </span>
                      <ExternalLink className="h-4 w-4 shrink-0 text-primary group-hover:scale-110 transition-transform" />
                    </a>
                  </div>
                ) : (
                  <div className="border-t border-border pt-2.5">
                    <p className="text-xs text-amber-600 flex items-center gap-1">
                      <AlertCircle className="h-3.5 w-3.5 shrink-0" /> Link belum dicantumkan oleh customer
                    </p>
                  </div>
                )}

                {parsed.customerInstructions ? (
                  <div className="border-t border-border pt-2.5 text-xs leading-relaxed">
                    <span className="text-muted-foreground font-semibold">Catatan Customer: </span>
                    <span className="text-foreground">{parsed.customerInstructions}</span>
                  </div>
                ) : null}
              </div>
            </section>

            <section>
              <h4 className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Syarat</h4>
              <ul className="list-inside list-disc space-y-1 rounded-xl border border-border p-3 text-muted-foreground">
                <li>Akun {job.platform} kamu aktif & sudah terverifikasi admin.</li>
                <li>Konten orisinal, tidak mengandung SARA atau unsur negatif.</li>
                <li>Postingan tidak dihapus minimal 7 hari setelah tayang.</li>
              </ul>
            </section>

            <section>
              <h4 className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Instruksi Pengerjaan</h4>
              <ol className="list-inside list-decimal space-y-1.5 rounded-xl border border-border p-3 text-muted-foreground text-xs leading-relaxed">
                <li>Ambil job ini dengan menekan tombol <b>Ambil Job</b> agar slot terkunci untukmu.</li>
                {parsed.targetUrl ? (
                  <li>Buka <b>Link Video/Postingan Target</b> di atas pada aplikasi {job.platform}.</li>
                ) : (
                  <li>Buka aplikasi {job.platform} sesuai instruksi customer.</li>
                )}
                {parsed.taskAction.toLowerCase().includes("like") && parsed.taskAction.toLowerCase().includes("komentar") ? (
                  <>
                    <li>Berikan <b>Like (Suka)</b> pada postingan/video target tersebut menggunakan akun {job.platform} terverifikasi.</li>
                    <li>Tulis <b>komentar positif</b> yang relevan dan sesuai catatan instruksi customer.</li>
                    <li>Ambil <b>Screenshot (tangkapan layar)</b> bukti bahwa kamu sudah Like dan komentar kamu sudah muncul.</li>
                  </>
                ) : parsed.taskAction.toLowerCase().includes("like") ? (
                  <>
                    <li>Berikan <b>Like (Suka)</b> pada postingan/video target tersebut.</li>
                    <li>Ambil <b>Screenshot (tangkapan layar)</b> bukti bahwa kamu sudah menekan tombol Like.</li>
                  </>
                ) : parsed.taskAction.toLowerCase().includes("komentar") || parsed.taskAction.toLowerCase().includes("comment") ? (
                  <>
                    <li>Tulis <b>komentar positif dan relevan</b> pada postingan/video target.</li>
                    <li>Ambil <b>Screenshot (tangkapan layar)</b> bukti komentar kamu yang sudah terpublikasi.</li>
                  </>
                ) : parsed.taskAction.toLowerCase().includes("follow") || parsed.taskAction.toLowerCase().includes("ikuti") ? (
                  <>
                    <li>Klik tombol <b>Ikuti (Follow)</b> pada akun target menggunakan akun {job.platform} kamu.</li>
                    <li>Ambil <b>Screenshot (tangkapan layar)</b> bukti bahwa status akun tersebut sudah Mengikuti (Following).</li>
                  </>
                ) : parsed.taskAction.toLowerCase().includes("share") || parsed.taskAction.toLowerCase().includes("bagikan") ? (
                  <>
                    <li><b>Bagikan (Share)</b> konten target ke timeline / story akun {job.platform} kamu.</li>
                    <li>Ambil <b>Screenshot (tangkapan layar)</b> bukti bahwa konten telah berhasil kamu bagikan.</li>
                  </>
                ) : (
                  <>
                    <li>Lakukan aksi <b>{parsed.taskAction}</b> sesuai instruksi customer di atas.</li>
                    <li>Ambil <b>Screenshot (tangkapan layar)</b> bukti pengerjaan kamu.</li>
                  </>
                )}
                <li>Kembali ke BuzzHub, klik <b>Upload Bukti</b>, lalu unggah file screenshot tersebut.</li>
              </ol>
            </section>

            <section>
              <h4 className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Bukti yang Dikirim</h4>
              <p className="rounded-xl border border-border p-3 text-muted-foreground">
                Link publik postingan/video di {job.platform} (contoh: https://...). Pastikan bisa dibuka tanpa login.
              </p>
              {currentProofUrl && (
                <div className="mt-3 flex flex-col gap-1.5 text-xs">
                  <span className="font-semibold text-foreground">Bukti terkirim:</span>
                  <ProofLink proofUrl={currentProofUrl} />
                </div>
              )}
            </section>

            {job.note && (
              <p className="flex items-start gap-2 rounded-xl bg-amber-50 p-3 text-xs text-amber-800">
                <AlertCircle className="h-4 w-4 shrink-0" /> {job.note}
              </p>
            )}
          </div>

          <DialogFooter className="gap-2 sm:justify-between">
            <Button variant="outline" onClick={() => setOpen(null)}>Tutup</Button>
            {currentStatus === "Tersedia" ? (
              <Button
                size="lg"
                disabled={loading}
                onClick={async () => {
                  if (!hasPlatformAccount) {
                    setOpen(null);
                    setNoAccountWarningOpen(true);
                    return;
                  }
                  await doTake();
                  setOpen(null);
                }}
                className="w-full gradient-brand text-brand-foreground shadow-glow sm:w-auto"
              >
                {loading ? "Memproses..." : `Ambil Job · ${formatIDR(payout)}`}
              </Button>
            ) : currentStatus === "Diambil" ? (
              <Button size="lg" onClick={() => setOpen("upload")} className="w-full gradient-brand text-brand-foreground sm:w-auto">
                <Upload className="mr-1 h-4 w-4" /> Upload Bukti
              </Button>
            ) : null}
          </DialogFooter>
        </DialogContent>
      </Dialog>


      {/* Upload Bukti */}
      <Dialog open={open === "upload"} onOpenChange={(v) => !v && setOpen(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Bukti — {job.title}</DialogTitle>
            <DialogDescription>Unggah screenshot sebagai bukti pesanan sudah dikerjakan.</DialogDescription>
          </DialogHeader>

          {parsed.targetUrl && (
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-3 flex flex-wrap items-center justify-between gap-2 text-xs">
              <span className="text-muted-foreground truncate max-w-[220px]">
                Tugas: <b className="text-foreground">{parsed.taskAction}</b>
              </span>
              <a
                href={parsed.targetUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 font-semibold text-primary underline underline-offset-2 hover:text-primary/80"
              >
                <ExternalLink className="h-3.5 w-3.5" /> Buka Kembali Link Target
              </a>
            </div>
          )}

          <div className="space-y-3">
            <Label htmlFor="shot">File Bukti Pengerjaan (wajib)</Label>
            <Input
              id="shot"
              type="file"
              multiple
              accept="image/png,image/jpeg,image/webp,application/pdf,.png,.jpg,.jpeg,.webp,.pdf"
              onChange={(e) => void pickFiles(e.target.files)}
            />
            <p className="text-[11px] text-muted-foreground leading-normal">
              * Format: PNG, JPG, JPEG, atau PDF. Jika bukti pengerjaan lebih dari 1 gambar, silakan jadikan 1 file PDF (atau pilih beberapa gambar sekaligus untuk digabung otomatis menjadi PDF).
            </p>

            {converting && (
              <div className="flex items-center gap-2 rounded-xl border border-primary/20 bg-primary/5 p-3 text-xs text-primary animate-pulse">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Sedang menggabungkan gambar menjadi 1 file PDF...</span>
              </div>
            )}

            {!converting && shot && (shot.type === "application/pdf" || shot.name.toLowerCase().endsWith(".pdf")) && (
              <div className="flex items-center justify-between rounded-xl border border-rose-500/20 bg-rose-500/10 p-3 text-xs">
                <div className="flex items-center gap-2.5 min-w-0">
                  <FileText className="h-6 w-6 text-rose-600 dark:text-rose-400 shrink-0" />
                  <div className="min-w-0">
                    <p className="font-semibold text-foreground truncate">{shot.name}</p>
                    <p className="text-[11px] text-muted-foreground">
                      {(shot.size / 1024).toFixed(1)} KB · Dokumen PDF {convertedCount ? `(${convertedCount} gambar digabung)` : ""}
                    </p>
                  </div>
                </div>
                <span className="shrink-0 rounded-md bg-rose-500/20 px-2 py-0.5 text-[11px] font-semibold text-rose-700 dark:text-rose-300">
                  PDF Siap Kirim
                </span>
              </div>
            )}

            {!converting && shotPreview && (
              <div className="relative mt-2 overflow-hidden rounded-lg border border-border">
                <img src={shotPreview} alt="Pratinjau screenshot bukti" className="max-h-56 w-full object-contain bg-black/5" />
              </div>
            )}

            <Label htmlFor="proof">Link postingan (wajib)</Label>
            <Input id="proof" placeholder="https://instagram.com/p/... atau https://tiktok.com/@..." value={proof} onChange={(e) => setProof(e.target.value)} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(null)}>Batal</Button>
            <Button onClick={doUpload} disabled={loading || converting} className="gradient-brand text-brand-foreground">
              {loading ? "Mengunggah..." : converting ? "Memproses PDF..." : "Kirim"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Revisi */}
      <Dialog open={open === "revisi"} onOpenChange={(v) => !v && setOpen(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Perbaiki Pengerjaan — {job.title}</DialogTitle>
            <DialogDescription>Silakan perbaiki pengerjaan sesuai alasan Admin, kemudian upload bukti terbaru.</DialogDescription>
          </DialogHeader>
          {(job.rejection_reason || job.note) && <p className="rounded-lg bg-amber-50 p-3 text-sm text-amber-800">Alasan Admin: {job.rejection_reason || job.note}</p>}

          {parsed.targetUrl && (
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-3 flex flex-wrap items-center justify-between gap-2 text-xs">
              <span className="text-muted-foreground truncate max-w-[220px]">
                Tugas: <b className="text-foreground">{parsed.taskAction}</b>
              </span>
              <a
                href={parsed.targetUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 font-semibold text-primary underline underline-offset-2 hover:text-primary/80"
              >
                <ExternalLink className="h-3.5 w-3.5" /> Buka Kembali Link Target
              </a>
            </div>
          )}

          <div className="space-y-3">
            <Label htmlFor="shot2">File Bukti Baru (wajib)</Label>
            <Input
              id="shot2"
              type="file"
              multiple
              accept="image/png,image/jpeg,image/webp,application/pdf,.png,.jpg,.jpeg,.webp,.pdf"
              onChange={(e) => void pickFiles(e.target.files)}
            />
            <p className="text-[11px] text-muted-foreground leading-normal">
              * Format: PNG, JPG, JPEG, atau PDF. Jika bukti pengerjaan lebih dari 1 gambar, silakan jadikan 1 file PDF (atau pilih beberapa gambar sekaligus untuk digabung otomatis menjadi PDF).
            </p>

            {converting && (
              <div className="flex items-center gap-2 rounded-xl border border-primary/20 bg-primary/5 p-3 text-xs text-primary animate-pulse">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Sedang menggabungkan gambar menjadi 1 file PDF...</span>
              </div>
            )}

            {!converting && shot && (shot.type === "application/pdf" || shot.name.toLowerCase().endsWith(".pdf")) && (
              <div className="flex items-center justify-between rounded-xl border border-rose-500/20 bg-rose-500/10 p-3 text-xs">
                <div className="flex items-center gap-2.5 min-w-0">
                  <FileText className="h-6 w-6 text-rose-600 dark:text-rose-400 shrink-0" />
                  <div className="min-w-0">
                    <p className="font-semibold text-foreground truncate">{shot.name}</p>
                    <p className="text-[11px] text-muted-foreground">
                      {(shot.size / 1024).toFixed(1)} KB · Dokumen PDF {convertedCount ? `(${convertedCount} gambar digabung)` : ""}
                    </p>
                  </div>
                </div>
                <span className="shrink-0 rounded-md bg-rose-500/20 px-2 py-0.5 text-[11px] font-semibold text-rose-700 dark:text-rose-300">
                  PDF Siap Kirim
                </span>
              </div>
            )}

            {!converting && shotPreview && (
              <div className="relative mt-2 overflow-hidden rounded-lg border border-border">
                <img src={shotPreview} alt="Pratinjau screenshot bukti baru" className="max-h-56 w-full object-contain bg-black/5" />
              </div>
            )}

            <Label htmlFor="proof2">Link postingan (wajib)</Label>
            <Input id="proof2" placeholder="https://instagram.com/p/... atau https://tiktok.com/@..." value={proof} onChange={(e) => setProof(e.target.value)} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(null)}>Batal</Button>
            <Button onClick={doResubmit} disabled={loading || converting} className="gradient-brand text-brand-foreground">
              {loading ? "Mengirim..." : converting ? "Memproses PDF..." : "Kirim Ulang"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Status */}
      <Dialog open={open === "status"} onOpenChange={(v) => !v && setOpen(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{currentStatus === "Revisi" || currentStatus === "Ditolak" ? "Pengerjaan Perlu Revisi" : `Status: ${jobStatusLabel(currentJob)}`}</DialogTitle>
            <DialogDescription>
              {currentStatus === "Review" && (currentJob.admin_verified_at ? "Pengerjaan sudah diverifikasi admin dan sedang menunggu ulasan customer." : "Bukti kamu sedang menunggu verifikasi admin. Rata-rata 1×24 jam.")}
              {(currentStatus === "Revisi" || currentStatus === "Ditolak") && "Alasan Admin:"}
              {currentStatus === "Upload" && "Menunggu unggahan bukti."}
            </DialogDescription>
          </DialogHeader>
          {currentStatus === "Revisi" || currentStatus === "Ditolak" ? (
            <div className="space-y-3 text-sm">
              <p className="rounded-lg bg-rose-50 p-3 text-rose-800">{currentJob.rejection_reason || currentJob.note || "Pekerjaan ditolak. Silakan perbaiki dan upload ulang."}</p>
              {currentJob.rejected_at && <p className="text-muted-foreground">Tanggal penolakan: {new Date(currentJob.rejected_at).toLocaleString("id-ID")}</p>}
              <p className="font-semibold text-amber-700">Status: Perlu Diperbaiki</p>
              {currentProofUrl && (
                <div className="flex flex-col gap-1.5 text-xs">
                  <span className="text-muted-foreground font-medium">Bukti sebelumnya:</span>
                  <ProofLink proofUrl={currentProofUrl} />
                </div>
              )}
              <Button className="gradient-brand text-brand-foreground" onClick={() => setOpen("revisi")}>Upload Ulang</Button>
            </div>
          ) : currentProofUrl ? (
            <div className="flex flex-col gap-1.5 text-sm pt-2">
              <span className="text-muted-foreground font-medium">Bukti pengerjaan:</span>
              <ProofLink proofUrl={currentProofUrl} />
            </div>
          ) : null}
        </DialogContent>
      </Dialog>

      {/* Hasil */}
      <Dialog open={open === "hasil"} onOpenChange={(v) => !v && setOpen(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hasil Pekerjaan</DialogTitle>
            <DialogDescription>Job selesai & payout sudah dikreditkan ke saldo.</DialogDescription>
          </DialogHeader>
          <div className="space-y-2 text-sm">
            <p><span className="text-muted-foreground">Level:</span> <span className="font-bold">{jobLevel}</span></p>
            <p><span className="text-muted-foreground">Payout yang kamu terima:</span> <span className="font-bold text-emerald-700">{formatIDR(payout)}</span></p>
            <p><span className="text-muted-foreground">Status pendapatan:</span> <span className="font-bold text-emerald-700">Sudah dikreditkan</span></p>
            {currentProofUrl && (
              <div className="flex flex-col gap-1.5 pt-2">
                <span className="text-muted-foreground text-xs font-medium">Bukti pengerjaan:</span>
                <ProofLink proofUrl={currentProofUrl} />
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Peringatan Belum Ada Akun Sosmed */}
      <Dialog open={noAccountWarningOpen} onOpenChange={setNoAccountWarningOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400">
              <AlertCircle className="h-6 w-6" />
            </div>
            <DialogTitle className="text-center text-lg">
              Akun media sosial belum ada, ayo daftar
            </DialogTitle>
            <DialogDescription className="text-center text-xs">
              Kamu belum memiliki akun <span className="font-semibold text-foreground">{job.platform}</span> yang terverifikasi untuk mengambil job ini.
            </DialogDescription>
          </DialogHeader>

          <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-2 text-xs leading-relaxed text-foreground">
            <div className="flex items-center gap-2 font-semibold text-primary">
              <Sparkles className="h-4 w-4" />
              <span>Rekomendasi untuk Buzzer:</span>
            </div>
            <p className="text-muted-foreground">
              Ayo daftarkan akun media sosialmu sebanyak-banyaknya! Semakin banyak akun media sosial yang kamu miliki (Instagram, TikTok, Twitter/X, dll), semakin banyak pilihan job yang bisa kamu kerjakan dan semakin besar penghasilanmu.
            </p>
            <p className="text-muted-foreground">
              💡 <b>Bisa tambah akun lagi:</b> Jika kamu sudah punya akun {job.platform}, kamu juga tetap bisa menambahkan akun {job.platform} lainnya. Bayaran job tetap disesuaikan dengan followers media sosialmu!
            </p>
          </div>

          <DialogFooter className="gap-2 sm:justify-between sm:gap-0">
            <Button variant="outline" onClick={() => setNoAccountWarningOpen(false)}>
              Nanti Saja
            </Button>
            <Button
              className="gradient-brand text-brand-foreground shadow-glow gap-1.5"
              onClick={() => {
                setNoAccountWarningOpen(false);
                onGoSosmed?.();
              }}
            >
              <Plus className="h-4 w-4" /> Ayo Daftar Akun Sekarang
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

/* ==================== PENGHASILAN ==================== */
function PenghasilanSection({ store }: { store: Store }) {
  const { state } = store;
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [wOpen, setWOpen] = useState(false);
  const [amount, setAmount] = useState<string>("");
  const [methodType, setMethodType] = useState<"Bank" | "E-Wallet">("Bank");
  const [provider, setProvider] = useState("BCA");
  const [accountNo, setAccountNo] = useState("");
  const [accountName, setAccountName] = useState("");
  const [viewingProofUrl, setViewingProofUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const BANKS = ["BCA", "Mandiri", "BRI", "BNI"];
  const EWALLETS = ["DANA", "ShopeePay", "GoPay", "OVO"];

  const resetWithdrawForm = () => {
    setAmount("");
    setMethodType("Bank");
    setProvider(BANKS[0]);
    setAccountNo("");
    setAccountName("");
  };

  const handleOpenWithdraw = () => {
    resetWithdrawForm();
    setWOpen(true);
  };

  const now = new Date();
  const monthTotal = state.earnings.filter(e => e.status === "Berhasil" && new Date(e.date).getMonth() === now.getMonth()).reduce((a,e)=>a+e.amount, 0);
  const weekAgo = new Date(); weekAgo.setDate(weekAgo.getDate() - 7);
  const weekTotal = state.earnings.filter(e => e.status === "Berhasil" && new Date(e.date) >= weekAgo).reduce((a,e)=>a+e.amount, 0);
  const pendingTotal = state.earnings.filter(e => e.status === "Pending" || e.status === "Diproses").reduce((a,e)=>a+e.amount, 0);

  const inRange = (d: string) => (!from || d >= from) && (!to || d <= to);
  const earningsF = (Array.isArray(state.earnings) ? state.earnings : []).filter(e => inRange(e.date));
  const withdrawsF = (Array.isArray(state.withdrawals) ? state.withdrawals : []).filter(w => inRange(w.date));

  const PAGE_SIZE = 8;
  const [earningsPage, setEarningsPage] = useState(1);
  const [withdrawalsPage, setWithdrawalsPage] = useState(1);

  useEffect(() => {
    setEarningsPage(1);
    setWithdrawalsPage(1);
  }, [from, to]);

  const totalEarningsPages = Math.max(1, Math.ceil(earningsF.length / PAGE_SIZE));
  const safeEarningsPage = Math.min(Math.max(1, earningsPage), totalEarningsPages);
  const paginatedEarnings = useMemo(() => {
    const start = (safeEarningsPage - 1) * PAGE_SIZE;
    return earningsF.slice(start, start + PAGE_SIZE);
  }, [earningsF, safeEarningsPage]);

  const totalWithdrawalsPages = Math.max(1, Math.ceil(withdrawsF.length / PAGE_SIZE));
  const safeWithdrawalsPage = Math.min(Math.max(1, withdrawalsPage), totalWithdrawalsPages);
  const paginatedWithdrawals = useMemo(() => {
    const start = (safeWithdrawalsPage - 1) * PAGE_SIZE;
    return withdrawsF.slice(start, start + PAGE_SIZE);
  }, [withdrawsF, safeWithdrawalsPage]);

  const pendingWithdrawalTotal = (Array.isArray(state.withdrawals) ? state.withdrawals : [])
    .filter((w) => w.status === "Menunggu")
    .reduce((sum, w) => sum + Number(w.amount || 0), 0);
  const availableToWithdraw = Math.max(0, state.balance - pendingWithdrawalTotal);

  const submitWithdraw = async () => {
    const numAmount = Number(amount);
    const digitsOnlyAccountNo = accountNo.replace(/\D/g, "");
    if (!amount.trim() || isNaN(numAmount) || numAmount <= 0) {
      return toast.error("Nominal pencairan wajib diisi");
    }
    if (numAmount < 1000) {
      return toast.error("Minimal pencairan saldo adalah Rp 1.000");
    }
    if (numAmount > availableToWithdraw) {
      if (pendingWithdrawalTotal > 0) {
        return toast.error(`Saldo yang siap ditarik adalah ${formatIDR(availableToWithdraw)} (${formatIDR(pendingWithdrawalTotal)} sedang menunggu verifikasi admin).`);
      }
      return toast.error(`Nominal melebihi saldo tersedia (${formatIDR(state.balance)})`);
    }
    if (!digitsOnlyAccountNo) {
      return toast.error(`Nomor ${methodType === "Bank" ? "rekening" : "e-wallet"} wajib diisi`);
    }
    if (!accountName.trim()) {
      return toast.error("Nama pemilik rekening / akun (atas nama) wajib diisi");
    }
    const methodLabel = `${provider} • ${digitsOnlyAccountNo}`;
    setLoading(true);
    const ok = await store.requestWithdrawal(numAmount, methodLabel, digitsOnlyAccountNo, accountName.trim());
    setLoading(false);
    if (ok) {
      setWOpen(false);
      resetWithdrawForm();
      toast.success(`Pengajuan pencairan sebesar ${formatIDR(numAmount)} berhasil dikirim! Saldo akan dipotong setelah diverifikasi & disetujui admin.`);
    } else {
      toast.error("Gagal memproses pengajuan pencairan saldo. Silakan coba lagi.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-border gradient-brand p-5 text-brand-foreground shadow-glow">
          <p className="text-xs uppercase tracking-wide opacity-90">Saldo Tersedia</p>
          <p className="mt-1 font-display text-2xl font-bold">{formatIDR(state.balance)}</p>
          <p className="mt-1 text-xs opacity-90">Bisa dicairkan sekarang</p>
          <Button size="sm" variant="secondary" className="mt-3" onClick={handleOpenWithdraw}>
            <Wallet className="mr-1 h-4 w-4" /> Cairkan Saldo
          </Button>
        </div>
        <StatCard label="Pendapatan Bulan Ini" value={formatIDR(monthTotal)} hint="Pembayaran berhasil bulan berjalan" icon={<DollarSign className="h-5 w-5" />} />
        <StatCard label="Pendapatan Minggu Ini" value={formatIDR(weekTotal)} hint="7 hari terakhir" icon={<DollarSign className="h-5 w-5" />} />
        <StatCard label="Saldo Siap Cair" value={formatIDR(state.balance)} hint="Bisa langsung dicairkan ke rekening Anda" icon={<Clock className="h-5 w-5" />} />
      </div>


      <div className="flex flex-wrap items-end gap-3 rounded-2xl border border-border bg-card p-4">
        <div><Label className="text-xs">Dari</Label><Input type="date" value={from} onChange={(e)=>setFrom(e.target.value)} /></div>
        <div><Label className="text-xs">Sampai</Label><Input type="date" value={to} onChange={(e)=>setTo(e.target.value)} /></div>
        <Button variant="outline" onClick={() => { setFrom(""); setTo(""); }}><RefreshCw className="mr-1 h-4 w-4" /> Reset</Button>
        <div className="ml-auto flex flex-wrap items-center gap-2">
          <Button variant="outline" onClick={() => {
            exportToExcel("penghasilan-buzzer", "Penghasilan", earningsF, [
              { header: "Tanggal", accessor: (e) => e.date },
              { header: "Job", accessor: (e) => e.jobTitle },
              { header: "Status", accessor: (e) => e.status },
              { header: "Nominal (Rp)", accessor: (e) => e.amount },
            ]);
            toast.success("Riwayat pembayaran diekspor ke Excel");
          }}><FileSpreadsheet className="mr-1 h-4 w-4" /> Excel</Button>
          <Button variant="outline" onClick={() => {
            const totalE = earningsF.reduce((a,e)=>a+e.amount,0);
            const totalW = withdrawsF.reduce((a,w)=>a+w.amount,0);
            exportToPDF("penghasilan-buzzer", "Laporan Keuangan Buzzer", earningsF, [
              { header: "Tanggal", accessor: (e) => e.date },
              { header: "Job", accessor: (e) => e.jobTitle },
              { header: "Status", accessor: (e) => e.status },
              { header: "Nominal (Rp)", accessor: (e) => e.amount },
            ], [
              { label: "Total Pembayaran", value: formatIDR(totalE) },
              { label: "Total Pencairan", value: formatIDR(totalW) },
            ]);
            toast.success("Laporan keuangan diekspor ke PDF");
          }}><FileDown className="mr-1 h-4 w-4" /> PDF</Button>
          <Button onClick={handleOpenWithdraw} className="gradient-brand text-brand-foreground"><Wallet className="mr-1 h-4 w-4" /> Cairkan Saldo</Button>
        </div>
      </div>

      <Tabs defaultValue="earnings">
        <TabsList>
          <TabsTrigger value="earnings">Riwayat Pembayaran ({earningsF.length})</TabsTrigger>
          <TabsTrigger value="withdrawals">Riwayat Pencairan ({withdrawsF.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="earnings" className="mt-4">
          <div className="overflow-hidden rounded-2xl border border-border bg-card">
            <Table>
              <TableHeader><TableRow><TableHead>Tanggal</TableHead><TableHead>Job</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Nominal</TableHead></TableRow></TableHeader>
              <TableBody>
                {earningsF.length === 0 && <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground py-8">Tidak ada data.</TableCell></TableRow>}
                {paginatedEarnings.map(e => (
                  <TableRow key={e.id}>
                    <TableCell className="text-xs">{e.date}</TableCell>
                    <TableCell>{e.jobTitle}</TableCell>
                    <TableCell><StatusBadge status={e.status} /></TableCell>
                    <TableCell className="text-right font-semibold">{formatIDR(e.amount)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {earningsF.length > 0 && (
              <TablePagination
                currentPage={safeEarningsPage}
                totalItems={earningsF.length}
                pageSize={PAGE_SIZE}
                onPageChange={setEarningsPage}
              />
            )}
          </div>
        </TabsContent>
        <TabsContent value="withdrawals" className="mt-4">
          <div className="overflow-hidden rounded-2xl border border-border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Metode & Rekening</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Keterangan / Bukti</TableHead>
                  <TableHead className="text-right">Nominal</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {withdrawsF.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                      Tidak ada pencairan.
                    </TableCell>
                  </TableRow>
                )}
                {paginatedWithdrawals.map((w) => (
                  <TableRow key={w.id}>
                    <TableCell className="text-xs">{w.date}</TableCell>
                    <TableCell>
                      <div className="font-medium text-xs">{w.method}</div>
                      {w.accountNo && <div className="text-[11px] text-muted-foreground">{w.accountNo}</div>}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={w.status === "Menunggu" ? "Menunggu Verifikasi" : w.status} />
                    </TableCell>
                    <TableCell>
                      {w.status === "Menunggu" && (
                        <div className="space-y-0.5">
                          <span className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">
                            Menunggu verifikasi admin
                          </span>
                          <p className="text-[10px] text-muted-foreground">
                            (Saldo belum dipotong)
                          </p>
                        </div>
                      )}
                      {w.status === "Berhasil" && (
                        <div className="flex items-center gap-1.5">
                          {w.proofUrl ? (
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-7 text-xs text-primary gap-1 px-2 border-primary/30 hover:bg-primary/10"
                              onClick={() => setViewingProofUrl(w.proofUrl || null)}
                            >
                              <Eye className="h-3.5 w-3.5" /> Bukti Transfer
                            </Button>
                          ) : (
                            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                              Transfer Sukses
                            </span>
                          )}
                        </div>
                      )}
                      {w.status === "Ditolak" && (
                        <div className="text-[11px] text-rose-600 dark:text-rose-400 space-y-0.5">
                          <div className="font-medium">Ditolak admin {w.adminNote ? `: "${w.adminNote}"` : ""}</div>
                          <div className="text-[10px] text-muted-foreground">(Saldo tetap aman)</div>
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-right font-semibold">{formatIDR(w.amount)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {withdrawsF.length > 0 && (
              <TablePagination
                currentPage={safeWithdrawalsPage}
                totalItems={withdrawsF.length}
                pageSize={PAGE_SIZE}
                onPageChange={setWithdrawalsPage}
              />
            )}
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={wOpen} onOpenChange={setWOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Wallet className="h-5 w-5 text-primary" />
              Cairkan Saldo Buzzer
            </DialogTitle>
            <DialogDescription>
              Saldo tersedia: <b className="text-foreground">{formatIDR(state.balance)}</b>
              {pendingWithdrawalTotal > 0 && (
                <span className="block mt-1 text-xs">
                  Sedang dalam verifikasi admin: <b className="text-amber-600 dark:text-amber-400">{formatIDR(pendingWithdrawalTotal)}</b> (Sisa yang siap dicairkan: <b className="text-emerald-600 dark:text-emerald-400">{formatIDR(availableToWithdraw)}</b>)
                </span>
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label>Nominal Pencairan</Label>
              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-muted-foreground">
                  Rp
                </span>
                <Input
                  type="text"
                  inputMode="numeric"
                  placeholder="Contoh: 5.000"
                  value={amount ? Number(amount).toLocaleString("id-ID") : ""}
                  onChange={(e) => {
                    const digits = e.target.value.replace(/\D/g, "");
                    setAmount(digits);
                  }}
                  className="pl-10 text-base font-semibold"
                />
              </div>

              {/* Pilihan cepat nominal */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {[5000, 10000, 20000, 50000]
                  .filter((val) => val <= availableToWithdraw)
                  .map((val) => (
                    <Button
                      key={val}
                      type="button"
                      variant="outline"
                      size="sm"
                      className={cn(
                        "h-7 px-2.5 text-xs transition-colors",
                        amount === String(val) && "border-primary bg-primary/10 text-primary font-bold shadow-xs"
                      )}
                      onClick={() => setAmount(String(val))}
                    >
                      {formatIDR(val)}
                    </Button>
                  ))}
                {availableToWithdraw > 0 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className={cn(
                      "h-7 px-2.5 text-xs font-semibold transition-colors",
                      amount === String(availableToWithdraw) && "border-primary bg-primary/10 text-primary font-bold shadow-xs"
                    )}
                    onClick={() => setAmount(String(availableToWithdraw))}
                  >
                    Tarik Semua ({formatIDR(availableToWithdraw)})
                  </Button>
                )}
              </div>
            </div>

            {/* Kotak rincian nominal dan sisa saldo */}
            {Number(amount) > 0 && (
              <div
                className={cn(
                  "rounded-xl border p-3 text-xs space-y-1.5 transition-all",
                  Number(amount) > availableToWithdraw
                    ? "border-rose-500/30 bg-rose-500/10 text-rose-700 dark:text-rose-300"
                    : "border-border bg-muted/40 text-foreground"
                )}
              >
                <div className="flex justify-between items-center font-medium">
                  <span className="text-muted-foreground">Nominal yang ditarik:</span>
                  <span className="text-sm font-bold">{formatIDR(Number(amount))}</span>
                </div>
                <div className="text-[11px] text-muted-foreground italic">
                  Terbilang: {terbilangRupiah(Number(amount))} rupiah
                </div>
                <div className="flex justify-between items-center pt-1.5 border-t border-border/50">
                  <span className="text-muted-foreground">Sisa Saldo Setelah Tarik:</span>
                  <span
                    className={cn(
                      "font-semibold",
                      Number(amount) > availableToWithdraw
                        ? "text-rose-600 font-bold"
                        : "text-emerald-600 dark:text-emerald-400 font-bold"
                    )}
                  >
                    {Number(amount) > availableToWithdraw
                      ? "Saldo tidak mencukupi"
                      : formatIDR(Math.max(0, state.balance - Number(amount)))}
                  </span>
                </div>
              </div>
            )}

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <Label>Metode Pencairan</Label>
                <Select
                  value={methodType}
                  onValueChange={(v) => {
                    const t = v as "Bank" | "E-Wallet";
                    setMethodType(t);
                    setProvider(t === "Bank" ? BANKS[0] : EWALLETS[0]);
                  }}
                >
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Bank">Transfer Bank</SelectItem>
                    <SelectItem value="E-Wallet">E-Wallet</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>{methodType === "Bank" ? "Nama Bank" : "Jenis E-Wallet"}</Label>
                <Select value={provider} onValueChange={setProvider}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {(methodType === "Bank" ? BANKS : EWALLETS).map((p) => (
                      <SelectItem key={p} value={p}>{p}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label>{methodType === "Bank" ? "Nomor Rekening" : "Nomor HP / Akun E-Wallet"}</Label>
              <Input
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder={methodType === "Bank" ? "Contoh: 1234567890" : "Contoh: 081234567890"}
                value={accountNo}
                onChange={(e) => setAccountNo(e.target.value.replace(/\D/g, ""))}
                className="mt-1 font-mono"
              />
            </div>

            <div>
              <Label>{methodType === "Bank" ? "Nama Pemilik Rekening (a.n.)" : "Nama Akun E-Wallet (a.n.)"}</Label>
              <Input
                type="text"
                placeholder="Contoh: Budi Santoso"
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
                className="mt-1"
              />
              <p className="mt-1 text-[11px] text-muted-foreground">
                Pastikan nama sesuai dengan yang terdaftar di bank/e-wallet untuk mempercepat proses verifikasi admin.
              </p>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setWOpen(false)}>
              Batal
            </Button>
            <Button
              onClick={submitWithdraw}
              disabled={loading || !amount || Number(amount) <= 0 || Number(amount) > availableToWithdraw || !accountNo || !accountName.trim()}
              className="gradient-brand text-brand-foreground"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Mengajukan...
                </>
              ) : (
                <>
                  <Send className="mr-1 h-4 w-4" />
                  Kirim Pengajuan Pencairan
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal Lihat Bukti Transfer Admin */}
      <Dialog open={!!viewingProofUrl} onOpenChange={(open) => !open && setViewingProofUrl(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-500" />
              Bukti Transfer dari Admin
            </DialogTitle>
            <DialogDescription>
              Tangkapan layar bukti transfer resmi yang diunggah oleh admin.
            </DialogDescription>
          </DialogHeader>
          {viewingProofUrl && (
            <div className="overflow-hidden rounded-xl border border-border bg-black/5 dark:bg-black/40 flex items-center justify-center p-2">
              <img
                src={viewingProofUrl}
                alt="Bukti Transfer Admin"
                className="max-h-[60vh] w-auto rounded-lg object-contain"
              />
            </div>
          )}
          <DialogFooter>
            {viewingProofUrl && (
              <a
                href={viewingProofUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-lg border border-input bg-background px-3 py-2 text-xs font-medium hover:bg-accent hover:text-accent-foreground mr-auto gap-1"
              >
                <ExternalLink className="h-3.5 w-3.5" /> Buka Tab Baru
              </a>
            )}
            <Button variant="outline" onClick={() => setViewingProofUrl(null)}>
              Tutup
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* ==================== RATING & ULASAN (FITUR MANDIRI DENGAN FILTER) ==================== */
function RatingUlasanSection({ store }: { store: Store }) {
  const { state } = store;
  const { data: allRatings, loading } = useBuzzerRatings();
  const myRatings = useMemo(() => {
    return allRatings.filter(
      (r) => r.buzzer_email.toLowerCase() === state.profile.email.toLowerCase()
    );
  }, [allRatings, state.profile.email]);

  const avg = averageStars(myRatings);

  // Filter state
  const [starFilter, setStarFilter] = useState<number | "all">("all");
  const [hasCommentOnly, setHasCommentOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "highest" | "lowest">("newest");
  const [ratingPage, setRatingPage] = useState(1);
  const RATING_PAGE_SIZE = 8;

  useEffect(() => {
    setRatingPage(1);
  }, [starFilter, hasCommentOnly, searchQuery, sortBy]);

  // Hitung jumlah tiap bintang 1 - 5
  const starCounts = useMemo(() => {
    const counts: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    for (const r of myRatings) {
      const s = Math.round(r.stars);
      if (counts[s] !== undefined) counts[s]++;
    }
    return counts;
  }, [myRatings]);

  const satisfactionPercent = useMemo(() => {
    if (!myRatings.length) return 100;
    const positive = myRatings.filter((r) => r.stars >= 4).length;
    return Math.round((positive / myRatings.length) * 100);
  }, [myRatings]);

  const isFiltered = starFilter !== "all" || hasCommentOnly || searchQuery.trim() !== "" || sortBy !== "newest";

  const resetFilters = () => {
    setStarFilter("all");
    setHasCommentOnly(false);
    setSearchQuery("");
    setSortBy("newest");
    setRatingPage(1);
  };

  // Filter & Urutkan
  const filteredRatings = useMemo(() => {
    return myRatings
      .filter((r) => {
        if (starFilter !== "all" && Math.round(r.stars) !== starFilter) return false;
        if (hasCommentOnly && (!r.comment || !r.comment.trim())) return false;
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchTitle = (r.campaign_title || "").toLowerCase().includes(q);
          const matchCustomer = (r.customer_name || r.customer_email || "").toLowerCase().includes(q);
          const matchComment = (r.comment || "").toLowerCase().includes(q);
          if (!matchTitle && !matchCustomer && !matchComment) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === "newest") return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        if (sortBy === "oldest") return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        if (sortBy === "highest") return b.stars - a.stars;
        if (sortBy === "lowest") return a.stars - b.stars;
        return 0;
      });
  }, [myRatings, starFilter, hasCommentOnly, searchQuery, sortBy]);

  const totalRatingPages = Math.max(1, Math.ceil(filteredRatings.length / RATING_PAGE_SIZE));
  const safeRatingPage = Math.min(Math.max(1, ratingPage), totalRatingPages);
  const paginatedRatings = useMemo(() => {
    const start = (safeRatingPage - 1) * RATING_PAGE_SIZE;
    return filteredRatings.slice(start, start + RATING_PAGE_SIZE);
  }, [filteredRatings, safeRatingPage]);

  return (
    <div className="space-y-6">
      {/* Overview Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-border gradient-brand p-5 text-brand-foreground shadow-glow flex flex-col justify-between">
          <div>
            <p className="text-xs uppercase tracking-wide opacity-90 font-medium">Rata-rata Rating</p>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="font-display text-3xl font-bold">{myRatings.length > 0 ? avg.toFixed(1) : "0.0"}</span>
              <span className="text-sm opacity-80">/ 5.0</span>
            </div>
            <div className="mt-2 flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  className={cn(
                    "h-4 w-4",
                    s <= Math.round(avg)
                      ? "fill-amber-300 text-amber-300"
                      : "fill-white/20 text-white/20"
                  )}
                />
              ))}
            </div>
          </div>
          <p className="mt-3 text-xs opacity-90 border-t border-white/15 pt-2">
            Berdasarkan akumulasi {myRatings.length} ulasan customer
          </p>
        </div>

        <StatCard
          label="Total Ulasan Masuk"
          value={String(myRatings.length)}
          hint="Feedback customer atas performa kamu"
          icon={<Star className="h-5 w-5" />}
        />
        <StatCard
          label="Tingkat Kepuasan"
          value={myRatings.length > 0 ? `${satisfactionPercent}%` : "100%"}
          hint="Persentase ulasan positif (⭐ 4 & 5)"
          icon={<CheckCircle2 className="h-5 w-5" />}
        />
        <StatCard
          label="Job Selesai"
          value={String(state.profile.jobsCompleted)}
          hint="Total pengerjaan job berhasil"
          icon={<Briefcase className="h-5 w-5" />}
        />
      </div>

      {/* Distribusi Rating Bintang */}
      <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="font-display text-base font-bold sm:text-lg">Distribusi Penilaian Bintang</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Klik baris bintang untuk memfilter daftar ulasan secara cepat
            </p>
          </div>
          {starFilter !== "all" && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setStarFilter("all")}
              className="h-8 text-xs self-start sm:self-auto gap-1"
            >
              <RefreshCw className="h-3 w-3" /> Tampilkan Semua Bintang
            </Button>
          )}
        </div>

        <div className="mt-4 space-y-2.5">
          {[5, 4, 3, 2, 1].map((stars) => {
            const count = starCounts[stars] || 0;
            const pct = myRatings.length > 0 ? Math.round((count / myRatings.length) * 100) : 0;
            const isSelected = starFilter === stars;
            return (
              <button
                key={stars}
                type="button"
                onClick={() => setStarFilter(isSelected ? "all" : stars)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-xl p-2.5 transition-all text-left",
                  isSelected
                    ? "bg-primary/10 border border-primary/30 shadow-xs"
                    : "hover:bg-muted/60 border border-transparent"
                )}
              >
                <div className="flex w-20 items-center gap-1.5 shrink-0 font-medium text-xs">
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  <span>{stars} Bintang</span>
                </div>
                <div className="flex-1">
                  <Progress value={pct} className="h-2.5" />
                </div>
                <div className="flex w-24 justify-end items-center gap-1.5 shrink-0 text-xs text-muted-foreground">
                  <span className="font-semibold text-foreground">{count}</span>
                  <span>({pct}%)</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="space-y-3 rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Cari ulasan berdasarkan campaign, customer, atau isi teks ulasan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 text-xs sm:text-sm"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Select value={sortBy} onValueChange={(v: any) => setSortBy(v)}>
              <SelectTrigger className="h-9 w-40 text-xs">
                <SelectValue placeholder="Urutkan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Terbaru</SelectItem>
                <SelectItem value="oldest">Terlama</SelectItem>
                <SelectItem value="highest">Rating Tertinggi</SelectItem>
                <SelectItem value="lowest">Rating Terendah</SelectItem>
              </SelectContent>
            </Select>

            <Button
              type="button"
              variant={hasCommentOnly ? "default" : "outline"}
              size="sm"
              onClick={() => setHasCommentOnly(!hasCommentOnly)}
              className={cn("h-9 text-xs gap-1.5", hasCommentOnly && "gradient-brand text-brand-foreground")}
            >
              <MessageCircle className="h-3.5 w-3.5" /> Ada Catatan Teks
            </Button>

            {isFiltered && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={resetFilters}
                className="h-9 text-xs text-muted-foreground hover:text-foreground"
              >
                <RefreshCw className="mr-1 h-3 w-3" /> Reset Filter
              </Button>
            )}
          </div>
        </div>

        {/* Quick Star Filter Chips */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-border/50">
          <span className="text-xs text-muted-foreground mr-1 flex items-center gap-1 font-medium">
            <Filter className="h-3 w-3" /> Filter Bintang:
          </span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className={cn(
              "h-7 px-2.5 text-xs transition-colors",
              starFilter === "all" && "border-primary bg-primary/10 text-primary font-bold shadow-xs"
            )}
            onClick={() => setStarFilter("all")}
          >
            Semua ({myRatings.length})
          </Button>
          {[5, 4, 3, 2, 1].map((s) => (
            <Button
              key={s}
              type="button"
              variant="outline"
              size="sm"
              className={cn(
                "h-7 px-2.5 text-xs transition-colors",
                starFilter === s && "border-primary bg-primary/10 text-primary font-bold shadow-xs"
              )}
              onClick={() => setStarFilter(starFilter === s ? "all" : s)}
            >
              ⭐ {s} ({starCounts[s] || 0})
            </Button>
          ))}
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="font-display text-base font-bold">
            Daftar Ulasan Customer
            <span className="ml-2 text-xs font-normal text-muted-foreground">
              ({filteredRatings.length} dari {myRatings.length} ulasan)
            </span>
          </h3>
        </div>

        {filteredRatings.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card p-8 sm:p-12 text-center">
            <Star className="mx-auto h-10 w-10 text-muted-foreground/30 mb-3" />
            <h4 className="font-display text-base font-semibold text-foreground">
              {myRatings.length === 0
                ? "Belum Ada Ulasan Customer"
                : "Tidak Ada Ulasan yang Sesuai Filter"}
            </h4>
            <p className="mt-1 text-xs sm:text-sm text-muted-foreground max-w-md mx-auto">
              {myRatings.length === 0
                ? "Selesaikan campaign yang tersedia sesuai brief. Ulasan dan bintang dari customer akan tampil otomatis di sini setelah customer memberikan penilaian."
                : "Coba ubah filter bintang, kata kunci pencarian, atau reset filter untuk menampilkan semua ulasan."}
            </p>
            {isFiltered && (
              <Button
                variant="outline"
                size="sm"
                onClick={resetFilters}
                className="mt-4 text-xs gap-1.5"
              >
                <RefreshCw className="h-3.5 w-3.5" /> Reset Filter
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid gap-3 sm:gap-4">
              {paginatedRatings.map((r) => {
                const dateStr = new Date(r.created_at).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                });
                const customerInitial = (r.customer_name || r.customer_email || "C")
                  .trim()
                  .charAt(0)
                  .toUpperCase();

                return (
                  <div
                    key={r.id}
                    className="rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-xs transition-shadow hover:shadow-sm"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-bold text-amber-600 dark:text-amber-400 border border-amber-500/20">
                            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                            {r.stars}.0
                          </span>
                          <h4 className="font-display text-sm sm:text-base font-bold text-foreground truncate">
                            {r.campaign_title || "Pekerjaan Campaign"}
                          </h4>
                        </div>

                        <div className="mt-2.5 flex items-center gap-2.5">
                          <Avatar className="h-7 w-7 border border-border">
                            <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                              {customerInitial}
                            </AvatarFallback>
                          </Avatar>
                          <div className="text-xs">
                            <span className="font-semibold text-foreground">
                              {r.customer_name || r.customer_email}
                            </span>
                            <span className="text-muted-foreground ml-2">· {dateStr}</span>
                          </div>
                        </div>
                      </div>

                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md self-start">
                        <CheckCircle2 className="h-3 w-3" /> Job Terverifikasi
                      </span>
                    </div>

                    {r.comment && (
                      <div className="mt-3 rounded-xl bg-muted/40 p-3 text-xs sm:text-sm text-foreground border border-border/60">
                        <p className="italic">"{r.comment}"</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {filteredRatings.length > 0 && (
              <div className="overflow-hidden rounded-2xl border border-border bg-card">
                <TablePagination
                  currentPage={safeRatingPage}
                  totalItems={filteredRatings.length}
                  pageSize={RATING_PAGE_SIZE}
                  onPageChange={setRatingPage}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* ==================== PROFIL ==================== */
function ProfilSection({ store, onGoRatings }: { store: Store; onGoRatings?: () => void }) {
  const session = useSession();
  const { state } = store;
  const { accounts: socialAccounts } = useSocialAccounts(state.profile.email, state.profile.name);
  const { data: allRatings } = useBuzzerRatings();
  const myRatings = allRatings.filter(
    (r) => r.buzzer_email.toLowerCase() === state.profile.email.toLowerCase(),
  );
  const avg = averageStars(myRatings);
  const verifiedFollowers = socialAccounts
    .filter((account) => account.verification === "Terverifikasi")
    .reduce((sum, account) => sum + account.followers, 0);
  const displayFollowers = verifiedFollowers > 0 ? verifiedFollowers : (state.profile.followers || 0);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(state.profile);
  const [loading, setLoading] = useState(false);

  const startEdit = () => {
    setForm({
      ...state.profile,
      followers: displayFollowers,
    });
    setOpen(true);
  };

  const save = async () => {
    if (!form.name.trim() || !form.email.trim()) return toast.error("Nama & email wajib diisi");
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return toast.error("Format email tidak valid");
    setLoading(true);
    const saved = await store.updateProfile({
      ...form,
      followers: displayFollowers,
    });
    setLoading(false);
    if (!saved) return toast.error("Profil gagal disimpan ke database. Coba lagi.");
    setOpen(false);
    toast.success("Profil berhasil diperbarui");
  };

  const onAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) return toast.error("Ukuran foto maks 2MB");
    const reader = new FileReader();
    reader.onload = () => setForm((f) => ({ ...f, avatarUrl: reader.result as string }));
    reader.readAsDataURL(file);
  };

  const currentAvatar = state.profile.avatarUrl || session?.avatarUrl;

  return (
    <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
      <div className="rounded-2xl border border-border bg-card p-6 text-center shadow-sm">
        <Avatar className="mx-auto h-24 w-24 border-2 border-background shadow-md">
          {currentAvatar && <AvatarImage src={currentAvatar} alt={state.profile.name} />}
          <AvatarFallback className="gradient-brand text-2xl font-bold text-brand-foreground">
            {state.profile.name.split(" ").map(n=>n[0]).join("").slice(0,2)}
          </AvatarFallback>
        </Avatar>
        <h3 className="mt-3 font-display text-xl font-bold">{state.profile.name}</h3>
        <p className="text-sm text-muted-foreground">{state.profile.username}</p>
        <div className="mt-4 flex items-center justify-center gap-1 text-sm">
          {myRatings.length > 0 ? (
            <>
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" /> <b>{avg.toFixed(1)}</b>
              <span className="text-muted-foreground">· {myRatings.length} ulasan · {state.profile.jobsCompleted} job</span>
            </>
          ) : (
            <span className="text-muted-foreground">⭐ 0.0 (Belum ada ulasan) · {state.profile.jobsCompleted} job</span>
          )}
        </div>
        <Button className="mt-5 w-full gradient-brand text-brand-foreground" onClick={startEdit}>
          <Edit3 className="mr-2 h-4 w-4" /> Edit Profil
        </Button>
      </div>

      <div className="space-y-4 rounded-2xl border border-border bg-card p-6 shadow-sm">
        <ProfileRow label="Email" value={state.profile.email} />
        <ProfileRow label="Nomor HP" value={state.profile.phone} />
        <ProfileRow label="Platform Utama" value={state.profile.platform} />
        <ProfileRow label="Followers" value={displayFollowers.toLocaleString("id-ID")} />
        <ProfileRow label="Bio" value={state.profile.bio || "-"} />

        {/* Ringkasan Rating & Ulasan yang mengarahkan ke menu mandiri Rating & Ulasan */}
        <div className="rounded-xl border border-border/80 bg-muted/30 p-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Rating & Ulasan Customer</p>
              <div className="mt-1 flex items-center gap-2">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                <span className="font-display text-base font-bold">
                  {myRatings.length > 0 ? `${avg.toFixed(1)} / 5.0` : "0.0 / 5.0"}
                </span>
                <span className="text-xs text-muted-foreground">
                  ({myRatings.length} ulasan customer)
                </span>
              </div>
            </div>
            {onGoRatings && (
              <Button size="sm" variant="outline" className="gap-1.5 text-xs self-start sm:self-auto" onClick={onGoRatings}>
                <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" /> Buka Fitur Rating & Ulasan
              </Button>
            )}
          </div>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Edit Profil</DialogTitle><DialogDescription>Perubahan disimpan ke akun kamu.</DialogDescription></DialogHeader>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Avatar className="h-16 w-16 border border-border">
                {(form.avatarUrl || currentAvatar) && <AvatarImage src={form.avatarUrl || currentAvatar} />}
                <AvatarFallback className="gradient-brand text-brand-foreground">{form.name.split(" ").map(n=>n[0]).join("").slice(0,2)}</AvatarFallback>
              </Avatar>
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-input px-3 py-2 text-sm hover:bg-accent">
                <Camera className="h-4 w-4" /> Ganti foto
                <input type="file" accept="image/*" className="hidden" onChange={onAvatar} />
              </label>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div><Label>Nama</Label><Input value={form.name} onChange={(e)=>setForm({...form, name: e.target.value})} /></div>
              <div><Label>Username</Label><Input value={form.username} onChange={(e)=>setForm({...form, username: e.target.value})} /></div>
              <div><Label>Email</Label><Input type="email" value={form.email} readOnly /></div>
              <div><Label>Nomor HP</Label><Input inputMode="numeric" pattern="[0-9]*" value={form.phone} onChange={(e)=>setForm({...form, phone: e.target.value.replace(/\D/g, "")})} /></div>

              <div><Label>Platform Utama</Label>
                <Select value={form.platform} onValueChange={(v)=>setForm({...form, platform: v as Platform})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {(["Instagram","TikTok","X (Twitter)","YouTube","Facebook"] as Platform[]).map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Followers</Label>
                <Input
                  type="number"
                  min={0}
                  value={form.followers}
                  readOnly
                  disabled
                  className="bg-muted cursor-not-allowed text-muted-foreground"
                />
                <p className="mt-1 text-[11px] text-muted-foreground">
                  Followers disinkronkan otomatis dari akun media sosial yang disetujui Admin.
                </p>
              </div>
            </div>
            <div><Label>Bio</Label><Textarea rows={3} value={form.bio} onChange={(e)=>setForm({...form, bio: e.target.value})} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={()=>setOpen(false)}>Batal</Button>
            <Button onClick={save} disabled={loading} className="gradient-brand text-brand-foreground">{loading ? "Menyimpan..." : "Simpan"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ProfileRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[140px_minmax(0,1fr)] items-start gap-3 border-b border-border pb-3 last:border-none last:pb-0">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="text-sm">{value}</p>
    </div>
  );
}

function EmptyState({ icon, title, desc, action }: { icon: ReactNode; title: string; desc: string; action?: ReactNode }) {
  return (
    <div className="grid place-items-center rounded-2xl border border-dashed border-border bg-card/50 p-10 text-center">
      <div className="mb-3 grid h-14 w-14 place-items-center rounded-full bg-muted text-muted-foreground">{icon}</div>
      <p className="font-semibold">{title}</p>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">{desc}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
