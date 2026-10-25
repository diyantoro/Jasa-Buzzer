import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState, useCallback, type MouseEvent, type ReactNode } from "react";
import {
  DollarSign,
  KeyRound,
  LayoutDashboard,
  LogOut,
  Megaphone,
  Menu,
  Search,
  Settings,
  Shield,
  ShieldCheck,
  TrendingUp,
  Users,
  Eye,
  EyeOff,
  Instagram,
  Youtube,
  Facebook,
  Twitter,
  Music2,
  CheckCircle2,
  XCircle,
  Filter,
  Link2,
  Pencil,
  Trash2,
  Ban,
  UserCheck,
  Star,
  FileSpreadsheet,
  FileDown,
  Activity,
  Database,
  Mail,
  Smartphone,
  Palette,
  CreditCard,
  Building2,
  Wallet,
  Globe2,
  Loader2,
  Save,
  Plus,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Layers,
  Tag,
  Briefcase,
  Clock,
  QrCode,
} from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { AdminSocialSection } from "@/components/admin-social-section";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StatCard, StatusBadge } from "@/components/dashboard-shell";
import { MobileBottomNav, SidebarCollapseButton, SidebarNav, useSidebarCollapsed } from "@/components/dashboard-sidebar";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BuzzerNameLink } from "@/components/buzzer-name-link";

import { useRequireRole, clearSession, useSession, setSession } from "@/lib/auth";
import { updateAccountFn } from "@/lib/accounts.functions";
import { ThemeToggle, useTheme } from "@/components/theme-toggle";
import { isSupabaseConfigured } from "@/integrations/supabase/client";
import { buzzers as buzzersSeed, campaigns as campaignsSeed, formatIDR } from "@/lib/mock-data";
import {
  approveApplication,
  rejectApplication,
  updateApplication,
  deleteApplication,
  useBuzzerApplications,
  type BuzzerApplication,
  type BuzzerAppStatus,
} from "@/lib/buzzer-verification";
import { cn } from "@/lib/utils";
import { exportToExcel, exportToPDF } from "@/lib/export-utils";
import { PencairanSection } from "@/components/admin-pencairan-section";
import { AdminPaymentVerificationSection } from "@/components/admin-payment-verification-section";
import { AdminPayoutVerificationSection } from "@/components/admin-payout-verification-section";
import { AdminPaymentMethodsSection } from "@/components/admin-payment-methods-section";

import { supabase } from "@/integrations/supabase/client";
import { SectionErrorBoundary } from "@/components/section-error-boundary";
import {
  useCampaigns,
  useCampaignJobs,
  useCompletedCampaignJobs,
  useServiceCatalogs,
  useServicePricings,
  useCatalogPackages,
  createServiceCatalog,
  createServicePricing,
  createCatalogPackage,
  updateServiceCatalog,
  updateServiceCatalogStatus,
  updateServicePricing,
  updateCatalogPackage,
  updateCatalogPackageStatus,
  deleteServiceCatalog,
  deleteCatalogPackage,
  deleteServicePricing,
  approveCampaign,
  rejectCampaign,
  completeCampaign,
  deleteCampaign,
  updateCampaignDetails,
  reviewCampaignJob,
  rejectCampaignJob,
  updateCampaignJob,
  deleteCampaignJob,
  useCampaignJobSubmissions,
  calculateCampaignJobSplit,

  type Campaign,
  type CampaignJob,
  type CatalogPackage,
} from "@/lib/campaign-store";
import { deleteAdminBuzzerRating, updateAdminBuzzerRating, useBuzzerRatings, type BuzzerRating } from "@/lib/rating-store";
import { uploadCatalogThumbnail } from "@/lib/catalog-thumbnail-upload";
import { CAMPAIGN_TYPES, notifyCustomerPaymentApproved, notifyCustomerPaymentRejected } from "@/lib/customer-store";
import { useAssignedLevels, useBuzzerLevels, getBuzzerPercentageForLevel } from "@/lib/buzzer-level";
import { ProofLink } from "@/components/proof-link";
import { adminApproveSocialAccount } from "@/lib/social-store";
import { useAdminWallet } from "@/lib/admin-wallet-store";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin Dashboard — BuzzHub" }] }),
  component: AdminPage,
});



type SectionKey =
  | "ringkasan"
  | "kampanye"
  | "manajemen"
  | "verifikasi"
  | "verifikasi-pengerjaan"
  | "pembayaran"
  | "verifikasi-pencairan"
  | "metode-pembayaran"
  | "pencairan"
  | "sosmed"
  | "ulasan"
  | "pengaturan";

const navItems: { key: SectionKey; label: string; shortLabel?: string; icon: ReactNode }[] = [
  { key: "ringkasan", label: "Dashboard", icon: <LayoutDashboard className="h-4 w-4" /> },
  { key: "kampanye", label: "Kampanye", icon: <Megaphone className="h-4 w-4" /> },
  { key: "manajemen", label: "Manajemen User", shortLabel: "Manajemen", icon: <Users className="h-4 w-4" /> },
  { key: "verifikasi", label: "Verifikasi Buzzer", icon: <Shield className="h-4 w-4" /> },
  { key: "verifikasi-pengerjaan", label: "Verifikasi Pengerjaan", icon: <CheckCircle2 className="h-4 w-4" /> },
  { key: "pembayaran", label: "Verifikasi Pembayaran", icon: <CheckCircle2 className="h-4 w-4" /> },
  { key: "verifikasi-pencairan", label: "Verifikasi Pencairan", icon: <Wallet className="h-4 w-4" /> },
  { key: "metode-pembayaran", label: "Metode Pembayaran", icon: <Building2 className="h-4 w-4" /> },
  { key: "pencairan", label: "Aktivitas", icon: <Activity className="h-4 w-4" /> },
  { key: "sosmed", label: "Akun Sosial Media", icon: <Link2 className="h-4 w-4" /> },
  { key: "ulasan", label: "Ulasan & Rating", icon: <Star className="h-4 w-4" /> },
  { key: "pengaturan", label: "Pengaturan", icon: <Settings className="h-4 w-4" /> },
];

const sectionMeta: Record<SectionKey, { title: string; subtitle: string }> = {
  ringkasan: { title: "Dashboard Admin", subtitle: "Pantau performa dan aktivitas BuzzHub" },
  kampanye: { title: "Manajemen Kampanye", subtitle: "Kelola seluruh kampanye buzzer marketing" },
  manajemen: { title: "Manajemen User", subtitle: "Kelola akun customer & buzzer secara terpusat" },
  verifikasi: {
    title: "Verifikasi Buzzer",
    subtitle: "Setujui atau tolak pendaftaran buzzer baru",
  },
  "verifikasi-pengerjaan": {
    title: "Verifikasi Pengerjaan",
    subtitle: "Periksa pekerjaan buzzer yang sudah mengupload bukti sebelum payout diproses",
  },
  pembayaran: {
    title: "Verifikasi Pembayaran",
    subtitle: "Periksa pembayaran customer sebelum campaign diaktifkan",
  },
  "verifikasi-pencairan": {
    title: "Verifikasi Pencairan Dana",
    subtitle: "Periksa dan verifikasi permohonan pencairan dana (payout) buzzer sebelum transfer diproses",
  },
  "metode-pembayaran": {
    title: "Metode Pembayaran",
    subtitle: "Kelola daftar rekening bank admin untuk penerimaan transfer customer",
  },
  pencairan: {
    title: "Aktivitas",
    subtitle: "Pantau tren aktivitas dan performa platform BuzzHub.",
  },
  sosmed: { title: "Kelola Akun Sosial Media", subtitle: "Verifikasi akun sosmed milik buzzer" },
  ulasan: { title: "Ulasan & Rating", subtitle: "Pantau seluruh ulasan customer terhadap buzzer" },
  pengaturan: { title: "Pengaturan", subtitle: "Konfigurasi akun & preferensi aplikasi" },
};

const ADMIN_SECTIONS: SectionKey[] = [
  "ringkasan",
  "kampanye",
  "manajemen",
  "verifikasi",
  "verifikasi-pengerjaan",
  "pembayaran",
  "verifikasi-pencairan",
  "metode-pembayaran",
  "pencairan",
  "sosmed",
  "ulasan",
  "pengaturan",
];

function getInitialAdminSection(): SectionKey {
  if (typeof window !== "undefined") {
    const sp = new URLSearchParams(window.location.search).get("section") as SectionKey | null;
    if (sp && ADMIN_SECTIONS.includes(sp)) return sp;
    try {
      const stored = localStorage.getItem("buzzhub.active_section.admin") as SectionKey | null;
      if (stored && ADMIN_SECTIONS.includes(stored)) return stored;
    } catch {}
  }
  return "ringkasan";
}

function AdminPage() {
  useRequireRole("admin");
  const [section, setSection] = useState<SectionKey>(getInitialAdminSection);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const session = useSession();
  const { collapsed, toggle } = useSidebarCollapsed("admin");

  const roleLabel = (() => {
    switch (session?.role) {
      case "admin":
        return "admin";
      case "buzzer":
        return "buzzer";
      case "customer":
        return "customer";
      default:
        return "akun";
    }
  })();

  const doLogout = () => {
    setLogoutOpen(false);
    clearSession();
    try {
      localStorage.removeItem("buzzhub.active_section.admin");
    } catch {}
    toast.success("Berhasil keluar");
    window.location.replace("/login");
  };

  const go = (k: SectionKey) => {
    setSection(k);
    setMobileOpen(false);
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("buzzhub.active_section.admin", section);
      } catch {}
      const url = new URL(window.location.href);
      if (url.searchParams.get("section") !== section) {
        url.searchParams.set("section", section);
        window.history.replaceState(null, "", url.toString());
      }
    }
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [section]);

  useEffect(() => {
    const handlePopState = () => {
      const sp = new URLSearchParams(window.location.search).get("section") as SectionKey | null;
      if (sp && ADMIN_SECTIONS.includes(sp)) {
        setSection(sp);
      }
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const sidebarUser = { name: "Admin BuzzHub", email: "admin@buzzhub.id", roleLabel: "admin" };
  const renderSidebar = (isCollapsed = false) => (
    <SidebarNav
      nav={navItems}
      activeKey={section}
      onNavigate={go}
      user={sidebarUser}
      onLogout={() => setLogoutOpen(true)}
      collapsed={isCollapsed}
    />
  );

  const meta = sectionMeta[section];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/30">
      <div className="mx-auto flex max-w-[1400px] gap-6 px-3 py-4 sm:px-6 lg:px-8">
        {/* Desktop sidebar */}
        <aside
          className={cn(
            "hidden shrink-0 transition-[width] duration-300 ease-in-out motion-reduce:transition-none md:block",
            collapsed ? "w-[76px]" : "w-64",
          )}
        >
          <div
            className={cn(
              "sticky top-6 rounded-2xl border border-border bg-card shadow-sm transition-[padding] duration-300 ease-in-out motion-reduce:transition-none",
              collapsed ? "p-2" : "p-4",
            )}
          >
            {renderSidebar(collapsed)}
          </div>
        </aside>

        {/* Main */}
        <main className="min-w-0 flex-1 pb-24 md:pb-0">
          <header className="mb-6 flex min-h-[56px] sm:min-h-[60px] items-center justify-between gap-3">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <SidebarCollapseButton collapsed={collapsed} onToggle={toggle} />
              {/* Mobile hamburger */}
              <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="md:hidden h-9 w-9 shrink-0" aria-label="Buka menu">
                    <Menu className="h-4 w-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-72 p-0">
                  <div className="flex h-full flex-col overflow-y-auto p-4">
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
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9 md:hidden"
                onClick={() => setLogoutOpen(true)}
                aria-label="Keluar"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </header>

          <SectionErrorBoundary key={section} title={`${meta.title} gagal dimuat`}>
            {section === "ringkasan" && <RingkasanSection />}
            {section === "kampanye" && <KampanyeSection />}
            {section === "manajemen" && <ManajemenUserSection />}
            {section === "verifikasi" && <VerifikasiSection />}
            {section === "verifikasi-pengerjaan" && <VerifikasiSection mode="jobs" />}
            {section === "pembayaran" && <AdminPaymentVerificationSection />}
            {section === "verifikasi-pencairan" && <AdminPayoutVerificationSection />}
            {section === "metode-pembayaran" && <AdminPaymentMethodsSection />}
            {section === "pencairan" && <PencairanSection />}
            {section === "sosmed" && <AdminSocialSection />}
            {section === "ulasan" && <AdminReviewsSection />}
            {section === "pengaturan" && <PengaturanSection />}
          </SectionErrorBoundary>
        </main>
      </div>

      {/* Mobile bottom nav */}
      <MobileBottomNav
        nav={navItems}
        activeKey={section}
        onNavigate={go}
        primaryKeys={["ringkasan", "kampanye", "manajemen", "pencairan"]}
      />

      <AlertDialog open={logoutOpen} onOpenChange={setLogoutOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Keluar akun {roleLabel}?</AlertDialogTitle>
            <AlertDialogDescription>
              Anda akan keluar dari sesi saat ini. Pastikan pekerjaan telah disimpan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={doLogout} className="gradient-brand text-brand-foreground">
              Keluar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

/* ----------------- DASHBOARD ----------------- */
function RingkasanSection() {
  const { data: campaigns, loading: campaignsLoading } = useCampaigns();
  const { data: jobs, loading: jobsLoading } = useCampaignJobs();
  const { data: completedJobs, loading: completedJobsLoading } = useCompletedCampaignJobs();
  const adminWallet = useAdminWallet();
  const [buzzerProfiles, setBuzzerProfiles] = useState<
    Array<{ email: string; name: string; platform: string | null; followers: number; avatar_url: string | null }>
  >([]);

  useEffect(() => {
    let active = true;
    const loadBuzzerProfiles = async () => {
      const [{ data }, { data: socialAccounts }] = await Promise.all([
        supabase
          .from("app_accounts")
          .select("email, name, platform, followers, avatar_url")
          .eq("role", "buzzer"),
        supabase
          .from("social_accounts")
          .select("buzzer_email, followers, verification, platform")
          .eq("verification", "Terverifikasi"),
      ]);
      const verifiedFollowers = new Map<string, number>();
      for (const account of socialAccounts ?? []) {
        const email = String(account.buzzer_email).trim().toLowerCase();
        verifiedFollowers.set(email, (verifiedFollowers.get(email) ?? 0) + Number(account.followers ?? 0));
      }
      if (active) {
        setBuzzerProfiles(
          (data ?? []).map((profile) => ({
            email: String(profile.email).trim().toLowerCase(),
            name: String(profile.name ?? ""),
            platform: profile.platform ?? null,
            followers: verifiedFollowers.get(String(profile.email).trim().toLowerCase()) ?? 0,
            avatar_url: profile.avatar_url ?? null,
          })),
        );
      }
    };
    void loadBuzzerProfiles();
    const channel = supabase
      .channel("dashboard-buzzer-profiles")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "app_accounts" },
        loadBuzzerProfiles,
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "social_accounts" },
        loadBuzzerProfiles,
      )
      .subscribe();
    return () => {
      active = false;
      void supabase.removeChannel(channel);
    };
  }, []);

  const campaignJobStats = useMemo(() => {
    const result = new Map<string, { taken: number; done: number; total: number }>();
    for (const job of jobs) {
      if (!job.campaign_id) continue;
      const current = result.get(job.campaign_id) ?? { taken: 0, done: 0, total: 0 };
      current.total += 1;
      if (job.status !== "Tersedia") current.taken += 1;
      if (job.status === "Selesai") current.done += 1;
      result.set(job.campaign_id, current);
    }
    return result;
  }, [jobs]);

  const monthlyRevenue = useMemo(() => {
    const now = new Date();
    const months = Array.from(
      { length: 12 },
      (_, index) => new Date(now.getFullYear(), now.getMonth() - 11 + index, 1),
    );
    return months.map((month) => {
      const revenue = completedJobs
        .filter((job) => {
          const date = new Date(job.updated_at);
          return date.getFullYear() === month.getFullYear() && date.getMonth() === month.getMonth();
        })
        .reduce((sum, job) => {
          return sum + calculateCampaignJobSplit(job).total;
        }, 0);
      return {
        month: month.toLocaleDateString("id-ID", { month: "short", year: "2-digit" }),
        revenue,
        profit: completedJobs
          .filter((job) => { const date = new Date(job.updated_at); return date.getFullYear() === month.getFullYear() && date.getMonth() === month.getMonth(); })
          .reduce((sum, job) => sum + calculateCampaignJobSplit(job).adminShare, 0),
      };
    });
  }, [completedJobs]);

  const totalRevenue = adminWallet.totalRevenue;
  const totalProfit = adminWallet.totalProfit;
  const approvedCampaigns = campaigns.filter((campaign) => campaign.payment_status === "Pembayaran Disetujui");
  const activeCampaigns = approvedCampaigns.filter((campaign) => campaign.status === "Aktif").length;

  const topBuzzers = useMemo(() => {
    const profileMap = new Map(buzzerProfiles.map((profile) => [profile.email, profile]));
    const earnings = new Map<
      string,
      {
        name: string;
        email: string;
        platform: string;
        followers: number;
        earnings: number;
        avatar_url: string | null;
        jobs: number;
      }
    >();

    const combinedJobs = [...completedJobs];
    const seenJobIds = new Set(completedJobs.map((j) => j.id));
    for (const j of jobs) {
      if (!seenJobIds.has(j.id) && (j.status === "Selesai" || Boolean((j as any).admin_verified_at) || j.status === "Review" || Boolean(j.proof_url))) {
        combinedJobs.push(j);
        seenJobIds.add(j.id);
      }
    }

    for (const job of combinedJobs) {
      const email = job.buzzer_email?.trim().toLowerCase();
      if (!email) continue;
      const profile = profileMap.get(email);
      const current = earnings.get(email) ?? {
        name: profile?.name || job.buzzer_name || email,
        email,
        platform: profile?.platform || job.platform,
        followers: profile?.followers ?? 0,
        earnings: 0,
        avatar_url: profile?.avatar_url ?? null,
        jobs: 0,
      };
      current.earnings += Number(job.buzzer_amount ?? job.payout ?? 0);
      current.jobs += 1;
      earnings.set(email, current);
    }
    return [...earnings.values()].sort((a, b) => b.earnings - a.earnings).slice(0, 5);
  }, [buzzerProfiles, completedJobs, jobs]);

  const dashboardLoading = campaignsLoading || jobsLoading || completedJobsLoading || adminWallet.loading;

  return (
    <>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Total Pendapatan"
          value={formatIDR(totalRevenue)}
          hint="Dari job buzzer yang selesai"
          icon={<DollarSign className="h-5 w-5" />}
        />
        <StatCard
          label="Keuntungan"
          value={formatIDR(totalProfit)}
          hint="Bagian admin dari job selesai"
          icon={<TrendingUp className="h-5 w-5" />}
        />
        <StatCard
          label="Buzzer Aktif"
          value={buzzerProfiles.length.toLocaleString("id-ID")}
          hint="Profil buzzer terdaftar"
          icon={<Users className="h-5 w-5" />}
        />
        <StatCard
          label="Kampanye Berjalan"
          value={activeCampaigns.toString()}
          hint={`${approvedCampaigns.length} total kampanye`}
          icon={<TrendingUp className="h-5 w-5" />}
        />
      </div>

      <div className="mt-6 rounded-2xl border border-border bg-card shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-5">
          <div>
            <h3 className="font-display text-lg font-bold">Grafik Pendapatan Bulanan</h3>
            <p className="text-sm text-muted-foreground">
              Perbandingan pendapatan dan keuntungan dari 12 bulan terakhir
            </p>
          </div>
          <div className="rounded-full border border-border bg-muted/40 px-3 py-1 text-xs text-muted-foreground">
            {monthlyRevenue[0]?.month} — {monthlyRevenue[monthlyRevenue.length - 1]?.month}
          </div>
        </div>
        <div className="h-[320px] p-5">
          <ChartContainer
            config={{
              revenue: { label: "Pendapatan", color: "#8b5cf6" },
              profit: { label: "Keuntungan", color: "#22c55e" },
            }}
            className="h-full w-full"
          >
            <AreaChart data={monthlyRevenue} margin={{ left: 12, right: 12, top: 16, bottom: 0 }}>
              <defs>
                <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.04} />
                </linearGradient>
                <linearGradient id="profitFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0.04} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="rgba(148,163,184,0.15)"
              />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                padding={{ left: 8, right: 8 }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                width={52}
                tickCount={4}
                tick={{ fontSize: 11 }}
                tickFormatter={(value) => {
                  const juta = Number(value) / 1000000;
                  const label = Number.isInteger(juta)
                    ? String(juta)
                    : juta.toFixed(1).replace(".", ",");
                  return `Rp${label} jt`;
                }}
                domain={[0, "dataMax + 3000000"]}
              />
              <ChartTooltip
                cursor={{ stroke: "rgba(148,163,184,0.35)", strokeWidth: 1 }}
                labelFormatter={(label) => `Bulan ${label}`}
                content={
                  <ChartTooltipContent
                    formatter={(value) =>
                      formatIDR(Number(Array.isArray(value) ? value[0] : (value ?? 0)))
                    }
                  />
                }
              />
              <Area
                type="natural"
                dataKey="revenue"
                stroke="#8b5cf6"
                strokeWidth={3}
                fill="url(#revenueFill)"
                name="Pendapatan"
                dot={{ r: 3, fill: "#8b5cf6", strokeWidth: 0 }}
                activeDot={{ r: 5, strokeWidth: 2, stroke: "#fff" }}
              />
              <Area
                type="natural"
                dataKey="profit"
                stroke="#22c55e"
                strokeWidth={2.5}
                fill="url(#profitFill)"
                name="Keuntungan"
                dot={{ r: 3, fill: "#22c55e", strokeWidth: 0 }}
                activeDot={{ r: 5, strokeWidth: 2, stroke: "#fff" }}
              />
            </AreaChart>
          </ChartContainer>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card shadow-sm lg:col-span-2">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-5">
            <div>
              <h3 className="font-display text-lg font-bold">Kampanye Terbaru</h3>
              <p className="text-sm text-muted-foreground">Pantau progress semua kampanye aktif</p>
            </div>
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input className="w-full pl-9 sm:w-56" placeholder="Cari kampanye..." />
            </div>
          </div>
          <div className="hidden overflow-x-auto md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Kampanye</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Budget</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dashboardLoading && (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="py-8 text-center text-sm text-muted-foreground"
                    >
                      Memuat data kampanye…
                    </TableCell>
                  </TableRow>
                )}
                {!dashboardLoading && approvedCampaigns.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="py-8 text-center text-sm text-muted-foreground"
                    >
                      Belum ada data kampanye.
                    </TableCell>
                  </TableRow>
                )}
                {!dashboardLoading &&
                  approvedCampaigns.slice(0, 5).map((c) => {
                    const jobStats = campaignJobStats.get(c.id) ?? { taken: 0, done: 0, total: 0 };
                    const progress = c.slots > 0 ? Math.round((jobStats.taken / c.slots) * 100) : 0;
                    return (
                      <TableRow key={c.id}>
                        <TableCell>
                          <p className="font-medium">{c.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {c.platform} · {c.slots} slot
                          </p>
                        </TableCell>
                        <TableCell className="text-sm">{c.customer_name}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="h-1.5 w-20 overflow-hidden rounded-full bg-muted">
                              <div
                                className="h-full gradient-brand"
                                style={{ width: `${Math.min(100, progress)}%` }}
                              />
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {jobStats.taken}/{c.slots}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={c.status} />
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {formatIDR(Number(c.budget))}
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </div>

          {/* Tampilan kartu untuk layar kecil */}
          <div className="space-y-2 p-3 md:hidden">
            {dashboardLoading && (
              <p className="py-6 text-center text-sm text-muted-foreground">
                Memuat data kampanye…
              </p>
            )}
            {!dashboardLoading && approvedCampaigns.length === 0 && (
              <p className="py-6 text-center text-sm text-muted-foreground">
                Belum ada data kampanye.
              </p>
            )}
            {!dashboardLoading &&
              approvedCampaigns.slice(0, 5).map((c) => {
                const jobStats = campaignJobStats.get(c.id) ?? { taken: 0, done: 0, total: 0 };
                const progress = c.slots > 0 ? Math.round((jobStats.taken / c.slots) * 100) : 0;
                return (
                  <div key={c.id} className="rounded-xl border border-border p-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">{c.title}</p>
                        <p className="truncate text-[11px] text-muted-foreground">
                          {c.customer_name}
                        </p>
                      </div>
                      <StatusBadge status={c.status} />
                    </div>
                    <div className="mt-2 flex items-center justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-2">
                        <div className="h-1.5 w-16 shrink-0 overflow-hidden rounded-full bg-muted">
                          <div
                            className="h-full gradient-brand"
                            style={{ width: `${Math.min(100, progress)}%` }}
                          />
                        </div>
                        <span className="text-[11px] text-muted-foreground">
                          {jobStats.taken}/{c.slots} slot
                        </span>
                      </div>
                      <span className="shrink-0 text-sm font-semibold tabular-nums">
                        {formatIDR(Number(c.budget))}
                      </span>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <h3 className="font-display text-lg font-bold">Top Buzzer</h3>
          <p className="text-sm text-muted-foreground">Pendapatan dari job selesai</p>
          <ul className="mt-4 space-y-3">
            {topBuzzers.length === 0 && (
              <li className="py-6 text-center text-sm text-muted-foreground">
                Belum ada data pendapatan buzzer.
              </li>
            )}
            {topBuzzers.map((b, i) => (
              <li key={b.email} className="flex items-center gap-3">
                <span className="w-5 text-sm font-bold text-muted-foreground">{i + 1}</span>
                <Avatar className="h-9 w-9 border border-border">
                  {b.avatar_url && <AvatarImage src={b.avatar_url} alt={b.name} />}
                  <AvatarFallback className="gradient-brand text-xs text-brand-foreground">
                    {b.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <BuzzerNameLink name={b.name} email={b.email} className="truncate text-sm" />
                  <p className="truncate text-xs text-muted-foreground">
                    {b.platform} · {b.followers.toLocaleString("id-ID")} fol. · {b.jobs} job selesai
                  </p>
                </div>
                <p className="shrink-0 text-sm font-semibold">{formatIDR(b.earnings)}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}

function AdminReviewsSection() {
  const session = useSession();
  const { data: ratings, loading, refetch: refetchRatings } = useBuzzerRatings();
  const [query, setQuery] = useState("");
  const [buzzer, setBuzzer] = useState("all");
  const [stars, setStars] = useState("all");
  const [date, setDate] = useState("");
  const [editingRating, setEditingRating] = useState<BuzzerRating | null>(null);
  const [editStars, setEditStars] = useState(0);
  const [editComment, setEditComment] = useState("");
  const [saving, setSaving] = useState(false);
  const [deletingRating, setDeletingRating] = useState<BuzzerRating | null>(null);

  const startEdit = (rating: BuzzerRating) => {
    setEditingRating(rating);
    setEditStars(rating.stars);
    setEditComment(rating.comment ?? "");
  };

  const saveEdit = async () => {
    if (!editingRating || !session?.email || !editStars) return;
    setSaving(true);
    try {
      await updateAdminBuzzerRating({ id: editingRating.id, admin_email: session.email, stars: editStars, comment: editComment });
      await refetchRatings();
      setEditingRating(null);
      toast.success("Ulasan berhasil diperbarui");
    } catch (error) {
      console.error("Gagal memperbarui ulasan dari admin:", error);
      toast.error(error instanceof Error ? error.message : "Ulasan gagal diperbarui. Coba lagi.");
    } finally {
      setSaving(false);
    }
  };

  const deleteRating = async () => {
    if (!deletingRating || !session?.email) return;
    setSaving(true);
    try {
      await deleteAdminBuzzerRating(deletingRating.id, session.email);
      await refetchRatings();
      setDeletingRating(null);
      toast.success("Ulasan berhasil dihapus");
    } catch (error) {
      console.error("Gagal menghapus ulasan dari admin:", error);
      toast.error(error instanceof Error ? error.message : "Ulasan gagal dihapus. Coba lagi.");
    } finally {
      setSaving(false);
    }
  };

  const buzzerOptions = useMemo(
    () => Array.from(new Set(ratings.map((rating) => rating.buzzer_email))).sort(),
    [ratings],
  );
  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return ratings.filter((rating) => {
      const matchesQuery =
        !normalizedQuery ||
        [
          rating.customer_name,
          rating.customer_email,
          rating.buzzer_name,
          rating.buzzer_email,
          rating.campaign_title,
          rating.comment ?? "",
        ].some((value) => value.toLowerCase().includes(normalizedQuery));
      const matchesBuzzer = buzzer === "all" || rating.buzzer_email === buzzer;
      const matchesStars = stars === "all" || rating.stars === Number(stars);
      const matchesDate = !date || rating.created_at.slice(0, 10) === date;
      return matchesQuery && matchesBuzzer && matchesStars && matchesDate;
    });
  }, [buzzer, date, query, ratings, stars]);

  const [page, setPage] = useState(1);
  const PAGE_SIZE = 8;

  useEffect(() => {
    setPage(1);
  }, [buzzer, date, query, stars]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const paginatedRatings = useMemo(() => {
    const start = (safePage - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, safePage]);

  const reviewStats = useMemo(() => {
    const total = ratings.length;
    if (total === 0) return { total: 0, avg: "5.0", fiveStars: 0, buzzersRated: 0 };
    const sum = ratings.reduce((acc, r) => acc + (r.stars || 0), 0);
    const avg = (sum / total).toFixed(1);
    const fiveStars = ratings.filter((r) => r.stars === 5).length;
    const buzzersRated = new Set(ratings.map((r) => r.buzzer_email)).size;
    return { total, avg, fiveStars, buzzersRated };
  }, [ratings]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Total Ulasan"
          value={reviewStats.total.toString()}
          hint="Semua feedback customer"
          icon={<Star className="h-5 w-5" />}
        />
        <StatCard
          label="Rata-rata Rating"
          value={`${reviewStats.avg} ★`}
          hint="Kepuasan pelanggan"
          icon={<TrendingUp className="h-5 w-5" />}
        />
        <StatCard
          label="Bintang 5 Sempurna"
          value={`${reviewStats.fiveStars} Ulasan`}
          hint="Ulasan performa terbaik"
          icon={<CheckCircle2 className="h-5 w-5" />}
        />
        <StatCard
          label="Buzzer Dinilai"
          value={`${reviewStats.buzzersRated} Buzzer`}
          hint="Memiliki rating aktif"
          icon={<Users className="h-5 w-5" />}
        />
      </div>

      <div className="rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-5">
        <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto_auto]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="pl-9"
              placeholder="Cari customer, buzzer, campaign..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>
          <Select value={buzzer} onValueChange={setBuzzer}>
            <SelectTrigger>
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Semua Buzzer" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Buzzer</SelectItem>
              {buzzerOptions.map((email) => (
                <SelectItem key={email} value={email}>
                  {ratings.find((rating) => rating.buzzer_email === email)?.buzzer_name || email}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={stars} onValueChange={setStars}>
            <SelectTrigger>
              <Star className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Semua Rating" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Rating</SelectItem>
              {[5, 4, 3, 2, 1].map((value) => (
                <SelectItem key={value} value={value.toString()}>
                  {value} bintang
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            type="date"
            aria-label="Filter tanggal ulasan"
            value={date}
            onChange={(event) => setDate(event.target.value)}
          />
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card shadow-sm">
        <div className="flex items-center justify-between border-b border-border p-5">
          <div>
            <h2 className="font-display text-lg font-bold">History Ulasan Customer</h2>
            <p className="text-sm text-muted-foreground">{filtered.length} ulasan dari Supabase</p>
          </div>
        </div>
        {loading ? (
          <div className="space-y-2 p-5">
            {[1, 2, 3].map((item) => (
              <div key={item} className="h-14 animate-pulse rounded-lg bg-muted" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <p className="p-8 text-center text-sm text-muted-foreground">
            Belum ada ulasan yang sesuai filter.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Buzzer</TableHead>
                  <TableHead>Campaign / Pesanan</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Komentar</TableHead>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedRatings.map((rating) => (
                  <TableRow key={rating.id}>
                    <TableCell>
                      <p className="font-medium">{rating.customer_name}</p>
                      <p className="text-xs text-muted-foreground">{rating.customer_email}</p>
                    </TableCell>
                    <TableCell>
                      <p className="font-medium">{rating.buzzer_name}</p>
                      <p className="text-xs text-muted-foreground">{rating.buzzer_email}</p>
                    </TableCell>
                    <TableCell>
                      <p className="font-medium">{rating.campaign_title}</p>
                      <p className="text-xs text-muted-foreground">
                        Pesanan #{rating.job_id.slice(0, 8)}
                      </p>
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center gap-1 font-semibold text-amber-500">
                        <Star className="h-4 w-4 fill-current" />
                        {rating.stars}/5
                      </span>
                    </TableCell>
                    <TableCell className="max-w-xs whitespace-normal text-sm">
                      {rating.comment || (
                        <span className="text-muted-foreground">Tanpa komentar</span>
                      )}
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                      {new Date(rating.created_at).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0"
                        title="Edit"
                        aria-label="Edit"
                        onClick={() => startEdit(rating)}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="h-8 w-8 p-0"
                        title="Hapus"
                        aria-label="Hapus"
                        onClick={() => setDeletingRating(rating)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <TablePagination
              currentPage={safePage}
              totalItems={filtered.length}
              pageSize={PAGE_SIZE}
              onPageChange={setPage}
            />
          </div>
        )}
      </div>

      <Dialog open={!!editingRating} onOpenChange={(value) => !value && setEditingRating(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Ulasan & Rating</DialogTitle>
            <DialogDescription>
              Perbarui rating dan komentar customer untuk {editingRating?.campaign_title}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Rating</Label>
              <div className="mt-2 flex gap-2" role="radiogroup" aria-label="Rating 1 sampai 5">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    type="button"
                    role="radio"
                    aria-checked={editStars === value}
                    aria-label={`${value} bintang`}
                    onClick={() => setEditStars(value)}
                    className="rounded-md p-1 transition-colors hover:bg-muted"
                  >
                    <Star className={cn("h-7 w-7", value <= editStars ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30")} />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <Label htmlFor="admin-review-comment">Komentar (opsional)</Label>
              <Textarea id="admin-review-comment" rows={4} value={editComment} onChange={(event) => setEditComment(event.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingRating(null)} disabled={saving}>Batal</Button>
            <Button className="gradient-brand text-brand-foreground" onClick={saveEdit} disabled={saving || !editStars}>
              {saving ? "Menyimpan..." : "Simpan Perubahan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deletingRating} onOpenChange={(value) => !value && !saving && setDeletingRating(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus ulasan ini?</AlertDialogTitle>
            <AlertDialogDescription>
              Ulasan dari {deletingRating?.customer_name || deletingRating?.customer_email} akan dihapus permanen dan rating buzzer akan dihitung ulang.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={saving}>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={deleteRating} disabled={saving} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              {saving ? "Menghapus..." : "Hapus Ulasan"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

/* ----------------- KAMPANYE ----------------- */
const extraCampaigns = [
  {
    id: "k7",
    title: "Webinar Bisnis Online",
    customer: "Startup FinPay",
    service: "Boost Engagement Instagram",
    buzzersJoined: 0,
    target: 20,
    status: "Draft",
    progress: 0,
    deadline: "2026-08-01",
    budget: 950000,
  },
  {
    id: "k8",
    title: "Promo 7.7 Toko Bunda",
    customer: "Toko Online Bunda",
    service: "Viral TikTok Challenge",
    buzzersJoined: 12,
    target: 60,
    status: "Berjalan",
    progress: 20,
    deadline: "2026-07-07",
    budget: 1750000,
  },
];
const allCampaigns = [...campaignsSeed, ...extraCampaigns];

function TablePagination({
  currentPage,
  totalItems,
  pageSize = 8,
  onPageChange,
}: {
  currentPage: number;
  totalItems: number;
  pageSize?: number;
  onPageChange: (page: number) => void;
}) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.min(Math.max(1, currentPage), totalPages);
  const from = totalItems === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const to = Math.min(safePage * pageSize, totalItems);

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-5 py-3">
      <p className="text-xs text-muted-foreground">
        Menampilkan {from}–{to} dari {totalItems}
      </p>
      <div className="flex items-center gap-1.5">
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="h-8 w-8 p-0"
          disabled={safePage <= 1}
          onClick={() => onPageChange(Math.max(1, safePage - 1))}
          aria-label="Halaman sebelumnya"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="grid min-w-[3rem] place-items-center px-2 text-xs font-medium">
          {safePage} / {totalPages}
        </span>
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="h-8 w-8 p-0"
          disabled={safePage >= totalPages}
          onClick={() => onPageChange(Math.min(totalPages, safePage + 1))}
          aria-label="Halaman berikutnya"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

function CustomerOrdersSection() {
  const [filter, setFilter] = useState<string>("Semua");
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 8;
  const [busy, setBusy] = useState<string | null>(null);
  const [rejecting, setRejecting] = useState<Campaign | null>(null);
  const [rejectNote, setRejectNote] = useState("");
  const [deletingCampaign, setDeletingCampaign] = useState<Campaign | null>(null);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [campaignForm, setCampaignForm] = useState({ title: "", brief: "", deadline: "" });
  const [savingCampaign, setSavingCampaign] = useState(false);
  const [detail, setDetail] = useState<Campaign | null>(null);
  const { data: campaigns, loading, refetch } = useCampaigns();
  const { data: jobs } = useCampaignJobs();

  useEffect(() => {
    setPage(1);
  }, [filter]);

  const jobStats = useMemo(() => {
    const m = new Map<string, { taken: number; done: number; total: number }>();
    for (const j of jobs) {
      if (!j.campaign_id) continue;
      const cur = m.get(j.campaign_id) ?? { taken: 0, done: 0, total: 0 };
      cur.total += 1;
      if (j.status !== "Tersedia") cur.taken += 1;
      if (j.status === "Selesai") cur.done += 1;
      m.set(j.campaign_id, cur);
    }
    return m;
  }, [jobs]);

  const filtered = useMemo(
    () => {
      const approvedCampaigns = campaigns.filter((campaign) => campaign.payment_status === "Pembayaran Disetujui");
      return filter === "Semua" ? approvedCampaigns : approvedCampaigns.filter((c) => c.status === filter);
    },
    [campaigns, filter],
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const paginated = useMemo(() => {
    const start = (safePage - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, safePage]);
  const totalBudget = useMemo(
    () => filtered.reduce((a, c) => a + Number(c.budget || 0), 0),
    [filtered],
  );
  const handleApprove = async (c: Campaign) => {
    setBusy(c.id);
    try {
      await approveCampaign(c);
      await notifyCustomerPaymentApproved(c.customer_email, c.title);
      toast.success(`Kampanye "${c.title}" dikonfirmasi. ${c.slots} slot job dibuka untuk buzzer.`);
    } catch (e) {
      toast.error("Gagal mengonfirmasi kampanye");
      console.error(e);
    } finally {
      setBusy(null);
    }
  };
  const handleReject = async () => {
    if (!rejecting) return;
    setBusy(rejecting.id);
    try {
      await rejectCampaign(rejecting.id, rejectNote || undefined);
      await notifyCustomerPaymentRejected(rejecting.customer_email, rejecting.title, rejectNote);
      toast.success("Kampanye ditolak.");
      setRejecting(null);
      setRejectNote("");
    } catch (e) {
      toast.error("Gagal menolak kampanye");
      console.error(e);
    } finally {
      setBusy(null);
    }
  };
  const handleDeleteCampaign = async () => {
    if (!deletingCampaign) return;
    setBusy(deletingCampaign.id);
    try {
      await deleteCampaign(deletingCampaign.id);
      toast.success(`Kampanye "${deletingCampaign.title}" berhasil dihapus.`);
      if (detail?.id === deletingCampaign.id) {
        setDetail(null);
      }
      if (editingCampaign?.id === deletingCampaign.id) {
        setEditingCampaign(null);
      }
      setDeletingCampaign(null);
      refetch?.();
    } catch (e) {
      toast.error("Gagal menghapus kampanye");
      console.error(e);
    } finally {
      setBusy(null);
    }
  };

  const openEditCampaign = (c: Campaign) => {
    setCampaignForm({ title: c.title ?? "", brief: c.brief ?? "", deadline: c.deadline ?? "" });
    setEditingCampaign(c);
  };

  const handleSaveCampaign = async () => {
    if (!editingCampaign) return;
    if (!campaignForm.title.trim()) {
      toast.error("Judul kampanye wajib diisi.");
      return;
    }
    if (!campaignForm.deadline) {
      toast.error("Deadline wajib diisi.");
      return;
    }
    setSavingCampaign(true);
    try {
      await updateCampaignDetails(editingCampaign.id, campaignForm);
      toast.success("Kampanye berhasil diperbarui.");
      setEditingCampaign(null);
      refetch?.();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Gagal memperbarui kampanye");
      console.error(e);
    } finally {
      setSavingCampaign(false);
    }
  };

  const detailLive = detail ? (campaigns.find((c) => c.id === detail.id) ?? detail) : null;
  const detailJobs = useMemo(() => {
    if (!detailLive) return [];
    return jobs
      .filter((j) => j.campaign_id === detailLive.id)
      .sort((a, b) => Number(a.status === "Tersedia") - Number(b.status === "Tersedia"));
  }, [detailLive, jobs]);

  const columns = [
    { header: "Kampanye", accessor: (c: Campaign) => c.title },
    { header: "Customer", accessor: (c: Campaign) => `${c.customer_name} (${c.customer_email})` },
    { header: "Platform", accessor: (c: Campaign) => c.platform },
    { header: "Slot", accessor: (c: Campaign) => c.slots },
    { header: "Deadline", accessor: (c: Campaign) => c.deadline },
    { header: "Status", accessor: (c: Campaign) => c.status },
    { header: "Budget (Rp)", accessor: (c: Campaign) => Number(c.budget) },
  ];
  const exportExcel = () => {
    exportToExcel("kampanye", "Kampanye", filtered, columns);
    toast.success("Data kampanye diekspor ke Excel");
  };
  const exportPdf = () => {
    exportToPDF("kampanye", "Laporan Kampanye", filtered, columns, [
      { label: "Jumlah Kampanye", value: filtered.length.toString() },
      { label: "Total Budget", value: formatIDR(totalBudget) },
    ]);
    toast.success("Data kampanye diekspor ke PDF");
  };

  const renderCampaignActions = (c: Campaign) => (
    <>
      <Button
        size="sm"
        variant="outline"
        className="h-8 w-8 p-0"
        title="Detail"
        aria-label="Detail"
        onClick={() => setDetail(c)}
      >
        <Eye className="h-4 w-4" />
      </Button>
      <Button
        size="sm"
        variant="outline"
        className="h-8 w-8 p-0"
        title="Edit"
        aria-label="Edit"
        disabled={busy === c.id}
        onClick={() => openEditCampaign(c)}
      >
        <Pencil className="h-4 w-4" />
      </Button>
      {c.status === "Draft" && (
        <>
          <Button
            size="sm"
            className="h-8 w-8 p-0 gradient-brand text-brand-foreground"
            disabled={busy === c.id}
            onClick={() => handleApprove(c)}
            title="Setujui / Konfirmasi"
            aria-label="Setujui"
          >
            {busy === c.id ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <CheckCircle2 className="h-4 w-4" />
            )}
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="h-8 w-8 p-0 text-rose-600 hover:bg-rose-50 hover:text-rose-700 dark:hover:bg-rose-950/20"
            disabled={busy === c.id}
            onClick={() => {
              setRejecting(c);
              setRejectNote("");
            }}
            title="Tolak"
            aria-label="Tolak"
          >
            <XCircle className="h-4 w-4" />
          </Button>
        </>
      )}
    </>
  );

  return (
    <div className="space-y-4">
      <div>
        <h2 className="font-display text-lg font-bold">Pesanan Customer</h2>
        <p className="text-sm text-muted-foreground">Campaign yang dibuat customer setelah melakukan pemesanan dan pembayaran.</p>
      </div>
      <div className="rounded-2xl border border-border bg-card shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-5">
          <div className="flex flex-wrap items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            {["Semua", "Aktif", "Review", "Selesai", "Dibatalkan"].map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs font-medium",
                  filter === s
                    ? "border-transparent gradient-brand text-brand-foreground"
                    : "border-border text-muted-foreground hover:bg-muted",
                )}
              >
                {s}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button size="sm" variant="outline" onClick={exportExcel}>
              <FileSpreadsheet className="mr-1 h-4 w-4" /> Excel
            </Button>
            <Button size="sm" variant="outline" onClick={exportPdf}>
              <FileDown className="mr-1 h-4 w-4" /> PDF
            </Button>
          </div>
        </div>

        <div className="hidden overflow-x-auto md:block">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Kampanye</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Buzzer</TableHead>
                <TableHead>Deadline</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Budget</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading && (
                <TableRow>
                  <TableCell colSpan={7} className="py-8 text-center text-sm text-muted-foreground">
                    Memuat data kampanye…
                  </TableCell>
                </TableRow>
              )}
              {!loading && filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="py-8 text-center text-sm text-muted-foreground">
                    Belum ada kampanye pada filter ini.
                  </TableCell>
                </TableRow>
              )}
              {paginated.map((c) => {
                const st = jobStats.get(c.id) ?? { taken: 0, done: 0, total: 0 };
                const progress = st.total ? Math.round((st.done / st.total) * 100) : 0;
                return (
                  <TableRow key={c.id} className="hover:bg-muted/50">
                    <TableCell>
                      <p className="font-medium">{c.title}</p>
                      <div className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
                        <span>{c.platform}</span>
                        <span>· {c.slots} slot</span>
                        {c.service_type && <span>· {c.service_type}</span>}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">
                      <p>{c.customer_name}</p>
                      <p className="text-xs text-muted-foreground">{c.customer_email}</p>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-20 overflow-hidden rounded-full bg-muted">
                          <div
                            className="h-full gradient-brand"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {st.taken}/{c.slots}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{c.deadline || "-"}</TableCell>
                    <TableCell>
                      <StatusBadge status={c.status === "Draft" ? "Menunggu" : c.status} />
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatIDR(Number(c.budget))}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">{renderCampaignActions(c)}</div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        {/* Tampilan kartu untuk layar kecil */}
        <div className="space-y-2 p-3 md:hidden">
          {loading && (
            <p className="py-6 text-center text-sm text-muted-foreground">Memuat data kampanye…</p>
          )}
          {!loading && filtered.length === 0 && (
            <p className="py-6 text-center text-sm text-muted-foreground">
              Belum ada kampanye pada filter ini.
            </p>
          )}
          {!loading &&
            paginated.map((c) => {
              const st = jobStats.get(c.id) ?? { taken: 0, done: 0, total: 0 };
              const progress = st.total ? Math.round((st.done / st.total) * 100) : 0;
              return (
                <div key={c.id} className="rounded-xl border border-border p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-sm font-medium leading-snug">{c.title}</p>
                      <p className="mt-0.5 truncate text-[11px] text-muted-foreground">
                        {c.platform} · {c.slots} slot
                        {c.service_type ? ` · ${c.service_type}` : ""}
                      </p>
                    </div>
                    <StatusBadge status={c.status === "Draft" ? "Menunggu" : c.status} />
                  </div>
                  <div className="mt-2 flex items-center justify-between gap-2 text-[11px] text-muted-foreground">
                    <span className="truncate">{c.customer_name}</span>
                    <span className="shrink-0">{c.deadline || "-"}</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between gap-2">
                    <div className="flex min-w-0 items-center gap-2">
                      <div className="h-1.5 w-16 shrink-0 overflow-hidden rounded-full bg-muted">
                        <div className="h-full gradient-brand" style={{ width: `${progress}%` }} />
                      </div>
                      <span className="text-[11px] text-muted-foreground">
                        {st.taken}/{c.slots}
                      </span>
                    </div>
                    <span className="shrink-0 text-sm font-semibold tabular-nums">
                      {formatIDR(Number(c.budget))}
                    </span>
                  </div>
                  <div className="mt-2.5 flex justify-end gap-2 border-t border-border/70 pt-2.5">
                    {renderCampaignActions(c)}
                  </div>
                </div>
              );
            })}
        </div>
        <TablePagination
          currentPage={safePage}
          totalItems={filtered.length}
          pageSize={PAGE_SIZE}
          onPageChange={setPage}
        />
      </div>

      <Dialog open={!!detail} onOpenChange={(v) => !v && setDetail(null)}>
        <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detail Pesanan Kampanye</DialogTitle>
          </DialogHeader>
          {detailLive && (
            <div className="space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="font-display text-lg font-bold">{detailLive.title}</p>
                  <p className="text-xs text-muted-foreground">
                    Dipesan {new Date(detailLive.created_at).toLocaleString("id-ID")}
                  </p>
                </div>
                <StatusBadge
                  status={detailLive.status === "Draft" ? "Menunggu" : detailLive.status}
                />
              </div>



              <div className="rounded-xl border border-border p-4">
                <p className="mb-2 text-xs font-semibold uppercase text-muted-foreground">
                  Customer
                </p>
                <p className="text-sm font-medium">{detailLive.customer_name}</p>
                <p className="text-xs text-muted-foreground">{detailLive.customer_email}</p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  { l: "Platform", v: detailLive.platform },
                  { l: "Jenis Kegiatan", v: detailLive.service_type || "-" },
                  { l: "Jumlah Slot Buzzer", v: `${detailLive.slots} buzzer` },
                  { l: "Budget", v: formatIDR(Number(detailLive.budget)) },
                  {
                    l: "Pembagian / Buzzer",
                    v: "Mengikuti level buzzer saat job diambil",
                  },
                  { l: "Deadline", v: detailLive.deadline || "-" },
                  {
                    l: "Job Terisi",
                    v: `${detailJobs.filter((j) => j.status !== "Tersedia").length}/${detailLive.slots}`,
                  },
                ].map((f) => (
                  <div key={f.l} className="rounded-xl border border-border p-3">
                    <p className="text-xs text-muted-foreground">{f.l}</p>
                    <p className="text-sm font-medium">{f.v}</p>
                  </div>
                ))}
              </div>

              <div className="rounded-xl border border-border p-4">
                <p className="mb-2 text-xs font-semibold uppercase text-muted-foreground">
                  Brief / Detail Acara Lengkap
                </p>
                <p className="whitespace-pre-wrap text-sm font-sans">
                  {detailLive.brief || "Tidak ada brief."}
                </p>
              </div>

              <div className="rounded-xl border border-border">
                <p className="border-b border-border p-3 text-xs font-semibold uppercase text-muted-foreground">
                  Job Buzzer ({detailJobs.length})
                </p>
                {detailJobs.length === 0 ? (
                  <p className="p-4 text-sm text-muted-foreground">
                    Belum ada job. Job otomatis dibuka setelah kampanye dikonfirmasi.
                  </p>
                ) : (
                  <ul className="divide-y divide-border">
                    {detailJobs.map((j) => (
                      <li
                        key={j.id}
                        className="flex items-center justify-between gap-3 p-3 text-sm"
                      >
                        <div className="min-w-0">
                          <p className="truncate font-medium">{j.buzzer_name ?? "Belum diambil"}</p>
                          <p className="truncate text-xs text-muted-foreground">
                            {j.buzzer_email ?? "—"}
                          </p>
                        </div>
                        <div className="flex shrink-0 items-center gap-3">
                          <span className="text-xs text-muted-foreground">
                            {formatIDR(Number(j.payout))}
                          </span>
                          <StatusBadge status={j.status} />
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}
          <DialogFooter className="flex flex-row items-center justify-between gap-2 sm:justify-between">
            {detailLive && (
              <Button
                variant="outline"
                className="h-9 w-9 p-0"
                title="Edit Kampanye"
                aria-label="Edit Kampanye"
                disabled={busy === detailLive.id}
                onClick={() => {
                  openEditCampaign(detailLive);
                  setDetail(null);
                }}
              >
                <Pencil className="h-4 w-4" />
              </Button>
            )}
            <div className="flex items-center gap-2">
              {detailLive?.status === "Draft" && (
                <>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setRejecting(detailLive);
                      setRejectNote("");
                      setDetail(null);
                    }}
                  >
                    <XCircle className="mr-1 h-4 w-4" /> Tolak
                  </Button>
                  <Button
                    className="gradient-brand text-brand-foreground"
                    disabled={busy === detailLive.id}
                    onClick={async () => {
                      await handleApprove(detailLive);
                      setDetail(null);
                    }}
                  >
                    <CheckCircle2 className="mr-1 h-4 w-4" /> Konfirmasi
                  </Button>
                </>
              )}
              {detailLive?.status !== "Draft" && (
                <Button variant="outline" onClick={() => setDetail(null)}>
                  Tutup
                </Button>
              )}
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!rejecting} onOpenChange={(v) => !v && setRejecting(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tolak kampanye</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">{rejecting?.title}</p>
            <Label>Alasan penolakan (opsional)</Label>
            <Textarea
              value={rejectNote}
              onChange={(e) => setRejectNote(e.target.value)}
              placeholder="Brief kurang lengkap, budget di bawah minimum, ..."
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejecting(null)}>
              Batal
            </Button>
            <Button variant="destructive" onClick={handleReject}>
              Tolak Kampanye
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!editingCampaign} onOpenChange={(v) => !v && !savingCampaign && setEditingCampaign(null)}>
        <DialogContent className="max-h-[85vh] max-w-lg overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Kampanye</DialogTitle>
            <DialogDescription>
              {editingCampaign?.customer_name} · {editingCampaign?.platform}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="edit-campaign-title">Judul Kampanye</Label>
              <Input
                id="edit-campaign-title"
                value={campaignForm.title}
                onChange={(e) => setCampaignForm((f) => ({ ...f, title: e.target.value }))}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="edit-campaign-deadline">Deadline / Tanggal Acara</Label>
              <Input
                id="edit-campaign-deadline"
                type="date"
                value={campaignForm.deadline}
                onChange={(e) => setCampaignForm((f) => ({ ...f, deadline: e.target.value }))}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="edit-campaign-brief">Brief / Detail</Label>
              <Textarea
                id="edit-campaign-brief"
                rows={6}
                value={campaignForm.brief}
                onChange={(e) => setCampaignForm((f) => ({ ...f, brief: e.target.value }))}
              />
            </div>
            <p className="text-[11px] text-muted-foreground">
              Platform, slot, dan budget tidak dapat diubah karena terikat dengan pembayaran dan job buzzer.
            </p>
          </div>
          <DialogFooter className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-between">
            <Button
              type="button"
              variant="destructive"
              className="h-9 w-9 p-0 sm:mr-auto"
              title="Hapus"
              aria-label="Hapus"
              disabled={savingCampaign || busy === editingCampaign?.id}
              onClick={() => editingCampaign && setDeletingCampaign(editingCampaign)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
            <div className="flex items-center justify-end gap-2">
              <Button variant="outline" disabled={savingCampaign} onClick={() => setEditingCampaign(null)}>
                Batal
              </Button>
              <Button className="gradient-brand text-brand-foreground" disabled={savingCampaign} onClick={handleSaveCampaign}>
                {savingCampaign ? <Loader2 className="mr-1 h-4 w-4 animate-spin" /> : <Save className="mr-1 h-4 w-4" />}
                {savingCampaign ? "Menyimpan..." : "Simpan"}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={!!deletingCampaign}
        onOpenChange={(open) => {
          if (!open && busy !== deletingCampaign?.id) setDeletingCampaign(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Kampanye?</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus kampanye <strong>"{deletingCampaign?.title}"</strong>? Seluruh data kampanye, pekerjaan buzzer terkait, dan riwayat pesanan akan dihapus secara permanen. Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={busy === deletingCampaign?.id}>Batal</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={busy === deletingCampaign?.id}
              onClick={(e) => {
                e.preventDefault();
                void handleDeleteCampaign();
              }}
            >
              {busy === deletingCampaign?.id ? (
                <>
                  <Loader2 className="mr-1 h-4 w-4 animate-spin" /> Menghapus...
                </>
              ) : (
                <>
                  <Trash2 className="mr-1 h-4 w-4" /> Hapus Kampanye
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
}

function KampanyeSection() {
  const { data: campaigns } = useCampaigns();
  const { data: jobs } = useCampaignJobs();
  const totalSlots = useMemo(() => campaigns.reduce((acc, c) => acc + (c.slots || 0), 0), [campaigns]);
  const activeCount = useMemo(() => campaigns.filter((c) => (c.status as string) === "Aktif" || (c.status as string) === "Berjalan" || (c.status as string) === "Review").length, [campaigns]);
  const completedJobsCount = useMemo(() => jobs.filter((j) => j.status === "Selesai" || Boolean(j.admin_verified_at)).length, [jobs]);

  const [tab, setTab] = useState<string>(() => {
    if (typeof window !== "undefined") {
      const sp = new URLSearchParams(window.location.search).get("tab");
      if (sp && ["pesanan", "katalog", "harga-sendiri"].includes(sp)) return sp;
      try {
        const stored = localStorage.getItem("buzzhub.active_tab.kampanye");
        if (stored && ["pesanan", "katalog", "harga-sendiri"].includes(stored)) return stored;
      } catch {}
    }
    return "pesanan";
  });

  const onTabChange = (val: string) => {
    setTab(val);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("buzzhub.active_tab.kampanye", val);
      } catch {}
      const url = new URL(window.location.href);
      if (url.searchParams.get("tab") !== val) {
        url.searchParams.set("tab", val);
        window.history.replaceState(null, "", url.toString());
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Total Kampanye"
          value={campaigns.length.toString()}
          hint="Semua pesanan & kampanye"
          icon={<Megaphone className="h-5 w-5" />}
        />
        <StatCard
          label="Kampanye Aktif"
          value={activeCount.toString()}
          hint="Sedang berjalan"
          icon={<TrendingUp className="h-5 w-5" />}
        />
        <StatCard
          label="Target Slot Buzzer"
          value={`${totalSlots.toLocaleString("id-ID")} Slot`}
          hint="Kapasitas pengerjaan"
          icon={<Users className="h-5 w-5" />}
        />
        <StatCard
          label="Pekerjaan Selesai"
          value={completedJobsCount.toLocaleString("id-ID")}
          hint="Job buzzer terverifikasi"
          icon={<CheckCircle2 className="h-5 w-5" />}
        />
      </div>

      <Tabs value={tab} onValueChange={onTabChange} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3 sm:w-auto">
          <TabsTrigger value="pesanan" className="gap-1.5 px-2 text-xs sm:gap-2 sm:px-3 sm:text-sm">
            <Megaphone className="hidden h-4 w-4 sm:block" />
            <span className="sm:hidden">Pesanan</span>
            <span className="hidden sm:inline">Pesanan Customer</span>
          </TabsTrigger>
          <TabsTrigger value="katalog" className="gap-1.5 px-2 text-xs sm:gap-2 sm:px-3 sm:text-sm">
            <Layers className="hidden h-4 w-4 sm:block" />
            <span className="sm:hidden">Katalog</span>
            <span className="hidden sm:inline">Katalog Layanan</span>
          </TabsTrigger>
          <TabsTrigger
            value="harga-sendiri"
            className="gap-1.5 px-2 text-xs sm:gap-2 sm:px-3 sm:text-sm"
          >
            <Tag className="hidden h-4 w-4 sm:block" />
            <span className="sm:hidden">Harga Sendiri</span>
            <span className="hidden sm:inline">Harga Pesanan Sendiri</span>
          </TabsTrigger>
        </TabsList>

      <TabsContent value="pesanan" className="mt-2">
        <CustomerOrdersSection />
      </TabsContent>

      <TabsContent value="katalog" className="mt-2">
        <CatalogManagementSection />
      </TabsContent>

      <TabsContent value="harga-sendiri" className="mt-2">
        <ServicePricingManagementSection />
      </TabsContent>
    </Tabs>
    </div>
  );
}

function CatalogManagementSection({ createSignal = 0 }: { createSignal?: number }) {
  const { data: catalogs, loading } = useServiceCatalogs();
  const { data: orders } = useCampaigns();
  const { data: jobs } = useCampaignJobs();
  const [editor, setEditor] = useState<any | null>(null);
  const [saving, setSaving] = useState(false);
  const [deletingCatalog, setDeletingCatalog] = useState<any | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);

  const PAGE_SIZE = 8;
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(catalogs.length / PAGE_SIZE));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const paginatedCatalogs = useMemo(() => {
    const start = (safePage - 1) * PAGE_SIZE;
    return catalogs.slice(start, start + PAGE_SIZE);
  }, [catalogs, safePage]);

  const openCreate = () => {
    setThumbnailFile(null);
    setThumbnailPreview(null);
    setEditor({
      title: "",
      platform: "Instagram",
      service_type: "",
      price: "",
      slots: "",
      payout_per_buzzer: "",
      thumbnail_url: "",
      description: "",
      status: "Aktif",
    });
  };

  useEffect(() => {
    if (createSignal > 0) openCreate();
  }, [createSignal]);

  const selectThumbnail = (file: File | null) => {
    if (!file) {
      setThumbnailFile(null);
      setThumbnailPreview(null);
      return;
    }
    if (!["image/jpeg", "image/png", "image/webp", "image/gif"].includes(file.type)) {
      toast.error("Gambar harus berupa JPG, PNG, WEBP, atau GIF.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Ukuran gambar maksimal 5 MB.");
      return;
    }
    setThumbnailFile(file);
    setThumbnailPreview(URL.createObjectURL(file));
  };

  const save = async () => {
    if (
      !editor?.title?.trim() ||
      !editor.platform ||
      !editor.service_type?.trim() ||
      !editor.description?.trim() ||
      Number(editor.price) <= 0 ||
      !Number.isInteger(Number(editor.slots)) ||
      Number(editor.slots) < 1 ||
      !editor.status
    ) {
      toast.error("Lengkapi nama, platform, kategori, deskripsi, harga, slot, dan status katalog.");
      return;
    }

    setSaving(true);
    try {
      const thumbnail_url = thumbnailFile
        ? await uploadCatalogThumbnail(thumbnailFile)
        : editor.thumbnail_url.trim() || null;
      const data: any = {
        title: editor.title.trim(),
        platform: editor.platform,
        service_type: editor.service_type.trim(),
        price: Number(editor.price),
        slots: Number(editor.slots),
        thumbnail_url,
        description: editor.description.trim(),
        status: editor.status,
      };
      if (editor.id) {
        await updateServiceCatalog(editor.id, data);
        toast.success("Katalog layanan diperbarui.");
      } else {
        await createServiceCatalog(data);
        toast.success("Katalog berhasil ditambahkan.");
      }
      setThumbnailFile(null);
      setThumbnailPreview(null);
      setEditor(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Gagal menyimpan katalog layanan.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCatalog = async () => {
    if (!deletingCatalog?.id) return;
    setDeleting(true);
    try {
      await deleteServiceCatalog(deletingCatalog.id);
      toast.success(`Katalog "${deletingCatalog.title}" berhasil dihapus.`);
      if (editor?.id === deletingCatalog.id) {
        setEditor(null);
        setThumbnailFile(null);
        setThumbnailPreview(null);
      }
      setDeletingCatalog(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Gagal menghapus katalog layanan.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-border bg-card shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-5">
          <div>
            <h2 className="font-display text-lg font-bold">Katalog Layanan</h2>
            <p className="text-sm text-muted-foreground">
              Produk yang dibuat admin dan dapat dipesan customer.
            </p>
          </div>
          <Button size="sm" className="gradient-brand text-brand-foreground" onClick={openCreate}>
            <Plus className="mr-1 h-4 w-4" /> Tambah Katalog
          </Button>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama Katalog</TableHead>
                <TableHead>Platform</TableHead>
                <TableHead>Kategori</TableHead>
                <TableHead>Harga Pesanan</TableHead>
                <TableHead>Buzzer Tetap</TableHead>
                <TableHead>Bayaran / Buzzer</TableHead>
                <TableHead>Terpakai</TableHead>
                <TableHead>Tersedia</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading && (
                <TableRow>
                  <TableCell colSpan={10} className="py-8 text-center text-muted-foreground">
                    Memuat katalog…
                  </TableCell>
                </TableRow>
              )}
              {!loading && catalogs.length === 0 && (
                <TableRow>
                  <TableCell colSpan={10} className="py-8 text-center text-muted-foreground">
                    Belum ada katalog layanan.
                  </TableCell>
                </TableRow>
              )}
              {paginatedCatalogs.map((catalog) => {
                const catalogSlots = Number(catalog.slots) || 0;

                // Mencocokkan kampanye yang terkait dengan katalog ini:
                // 1. Terikat langsung lewat catalog_id
                // 2. Atau memiliki platform dan kategori layanan yang sesuai
                const matchingCampaigns = orders.filter((order) => {
                  if (order.catalog_id) return order.catalog_id === catalog.id;
                  if (order.platform !== catalog.platform) return false;
                  if (order.service_type && catalog.service_type && order.service_type === catalog.service_type) {
                    if (catalog.title === "ndr2") return false;
                    return true;
                  }
                  if (!order.service_type && order.slots === catalogSlots) {
                    return true;
                  }
                  return false;
                });

                const matchingCampIds = new Set(matchingCampaigns.map((c) => c.id));
                const catalogJobs = jobs.filter((j) => j.campaign_id && matchingCampIds.has(j.campaign_id));

                // Hitung jumlah job yang sudah diambil oleh buzzer (status bukan "Tersedia")
                const taken = catalogJobs.filter((j) => j.status !== "Tersedia").length;

                const used = taken;
                const available = Math.max(0, catalogSlots - used);

                return (
                  <TableRow key={catalog.id}>
                    <TableCell>
                      <p className="font-medium">{catalog.title}</p>
                      <p className="max-w-xs truncate text-xs text-muted-foreground">
                        {catalog.description || "-"}
                      </p>
                    </TableCell>
                    <TableCell>{catalog.platform}</TableCell>
                    <TableCell>{catalog.service_type}</TableCell>
                    <TableCell>{formatIDR(Number(catalog.price))}</TableCell>
                    <TableCell>{catalogSlots}</TableCell>
                    <TableCell>
                      <span className="text-xs text-muted-foreground">Sesuai Level</span>
                    </TableCell>
                    <TableCell>{used}</TableCell>
                    <TableCell>{available}</TableCell>
                    <TableCell>
                      <StatusBadge status={catalog.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 w-8 p-0"
                          title="Edit"
                          aria-label="Edit"
                          onClick={() =>
                            setEditor({
                              ...catalog,
                              price: String(catalog.price),
                              slots: String(catalog.slots),
                              thumbnail_url: catalog.thumbnail_url ?? "",
                              description: catalog.description ?? "",
                            })
                          }
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={async () => {
                            try {
                              await updateServiceCatalogStatus(
                                catalog.id,
                                catalog.status === "Aktif" ? "Nonaktif" : "Aktif"
                              );
                              toast.success("Status katalog diperbarui.");
                            } catch {
                              toast.error("Gagal memperbarui status.");
                            }
                          }}
                        >
                          {catalog.status === "Aktif" ? "Nonaktifkan" : "Aktifkan"}
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          className="h-8 w-8 p-0"
                          title="Hapus"
                          aria-label="Hapus"
                          onClick={() => setDeletingCatalog(catalog)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
        <TablePagination
          currentPage={safePage}
          totalItems={catalogs.length}
          pageSize={PAGE_SIZE}
          onPageChange={setPage}
        />

        <Dialog
          open={!!editor}
          onOpenChange={(open) => {
            if (!open) {
              setEditor(null);
              setThumbnailFile(null);
              setThumbnailPreview(null);
            }
          }}
        >
          <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editor?.id ? "Edit Katalog Layanan" : "Tambah Katalog Layanan"}
              </DialogTitle>
            </DialogHeader>
            {editor && (
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="sm:col-span-2 text-sm text-muted-foreground">
                  Tambahkan layanan baru yang dapat dipesan oleh customer.
                </div>
                <div className="sm:col-span-2">
                  <Label>Nama Layanan</Label>
                  <Input
                    value={editor.title}
                    onChange={(e) => setEditor({ ...editor, title: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Platform</Label>
                  <Select
                    value={editor.platform}
                    onValueChange={(platform: any) => {
                      setEditor({ ...editor, platform });
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[
                        "Instagram",
                        "TikTok",
                        "X (Twitter)",
                        "Facebook",
                        "YouTube",
                        "Telegram",
                        "LinkedIn",
                      ].map((item) => (
                        <SelectItem key={item} value={item}>
                          {item}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Kategori / Jenis Layanan</Label>
                  <Select
                    value={editor.service_type}
                    onValueChange={(service_type) => setEditor({ ...editor, service_type })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih jenis layanan" />
                    </SelectTrigger>
                    <SelectContent>
                      {CAMPAIGN_TYPES.map((item) => (
                        <SelectItem key={item.key} value={item.name}>
                          {item.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Harga Pesanan</Label>
                  <Input
                    type="number"
                    min="1"
                    value={editor.price}
                    onChange={(e) => setEditor({ ...editor, price: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Jumlah Slot Buzzer</Label>
                  <Input
                    type="number"
                    min="1"
                    step="1"
                    value={editor.slots}
                    onChange={(e) => setEditor({ ...editor, slots: e.target.value })}
                  />
                </div>
                <div className="sm:col-span-2">
                  <Label>Gambar / Thumbnail</Label>
                  <Input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    className="mt-1"
                    onChange={(event) => selectThumbnail(event.target.files?.[0] ?? null)}
                  />
                  {(thumbnailPreview || editor.thumbnail_url) && (
                    <img
                      src={thumbnailPreview || editor.thumbnail_url}
                      alt="Preview thumbnail katalog"
                      className="mt-3 h-20 w-32 rounded-lg border object-cover"
                    />
                  )}
                </div>
                <div className="sm:col-span-2">
                  <Label>Deskripsi</Label>
                  <Textarea
                    value={editor.description}
                    onChange={(e) => setEditor({ ...editor, description: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Status Katalog</Label>
                  <Select
                    value={editor.status}
                    onValueChange={(status) => setEditor({ ...editor, status })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {["Aktif", "Nonaktif"].map((item) => (
                        <SelectItem key={item} value={item}>
                          {item}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
            <DialogFooter className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-between">
              {editor?.id ? (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => setDeletingCatalog(editor)}
                  className="h-9 w-9 p-0 sm:mr-auto"
                  title="Hapus Katalog"
                  aria-label="Hapus Katalog"
                  disabled={saving}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              ) : <div />}
              <div className="flex items-center justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setEditor(null);
                    setThumbnailFile(null);
                    setThumbnailPreview(null);
                  }}
                  disabled={saving}
                >
                  Batal
                </Button>
                <Button
                  className="gradient-brand text-brand-foreground"
                  disabled={saving}
                  onClick={save}
                >
                  {saving ? "Menyimpan…" : "Simpan"}
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <AlertDialog
          open={!!deletingCatalog}
          onOpenChange={(open) => {
            if (!open && !deleting) setDeletingCatalog(null);
          }}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Hapus Katalog Layanan?</AlertDialogTitle>
              <AlertDialogDescription>
                Apakah Anda yakin ingin menghapus katalog <strong>"{deletingCatalog?.title}"</strong>? Seluruh paket katalog terkait juga akan dihapus. Tindakan ini tidak dapat dibatalkan.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={deleting}>Batal</AlertDialogCancel>
              <AlertDialogAction
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                disabled={deleting}
                onClick={(e) => {
                  e.preventDefault();
                  void handleDeleteCatalog();
                }}
              >
                {deleting ? (
                  <>
                    <Loader2 className="mr-1 h-4 w-4 animate-spin" /> Menghapus...
                  </>
                ) : (
                  <>
                    <Trash2 className="mr-1 h-4 w-4" /> Hapus Katalog
                  </>
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </section>
    </div>
  );
}

function CatalogPackageManager({ catalog, onClose }: { catalog: any | null; onClose: () => void }) {
  const { data: packages, loading } = useCatalogPackages(catalog?.id ?? null);
  const [editor, setEditor] = useState<any | null>(null);
  const [saving, setSaving] = useState(false);
  useEffect(() => { if (catalog) setEditor({ name: "", price: "", buzzer_count: "", description: "", status: "Aktif" }); }, [catalog]);
  if (!catalog) return null;
  const save = async () => {
    if (!editor?.name?.trim() || Number(editor.price) <= 0 || Number(editor.buzzer_count) <= 0) { toast.error("Nama, harga, dan jumlah buzzer wajib diisi."); return; }
    setSaving(true);
    try {
      const payload = { catalog_id: catalog.id, name: editor.name.trim(), price: Number(editor.price), buzzer_count: Number(editor.buzzer_count), description: editor.description?.trim() ?? "", status: editor.status };
      if (editor.id) await updateCatalogPackage(editor.id, payload);
      else await createCatalogPackage(payload as any);
      toast.success(editor.id ? "Paket diperbarui." : "Paket ditambahkan.");
      setEditor({ name: "", price: "", buzzer_count: "", description: "", status: "Aktif" });
    } catch (error) { toast.error(error instanceof Error ? error.message : "Gagal menyimpan paket."); }
    finally { setSaving(false); }
  };
  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[88vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Paket Katalog: {catalog.title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid gap-3 rounded-xl border border-border p-4 sm:grid-cols-2">
            <div>
              <Label>Nama Paket</Label>
              <Input value={editor?.name ?? ""} onChange={(event) => setEditor({ ...editor, name: event.target.value })} placeholder="Basic" />
            </div>
            <div>
              <Label>Harga Paket</Label>
              <Input type="number" min="1" value={editor?.price ?? ""} onChange={(event) => setEditor({ ...editor, price: event.target.value })} />
            </div>
            <div>
              <Label>Jumlah Buzzer</Label>
              <Input type="number" min="1" value={editor?.buzzer_count ?? ""} onChange={(event) => setEditor({ ...editor, buzzer_count: event.target.value })} />
            </div>
            <div>
              <Label>Status</Label>
              <Select value={editor?.status ?? "Aktif"} onValueChange={(status) => setEditor({ ...editor, status })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Aktif">Aktif</SelectItem>
                  <SelectItem value="Nonaktif">Nonaktif</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="sm:col-span-2">
              <Label>Benefit / Deskripsi</Label>
              <Textarea rows={3} value={editor?.description ?? ""} onChange={(event) => setEditor({ ...editor, description: event.target.value })} placeholder="25 buzzer aktif\nReach 50K - 100K\nLaporan mingguan" />
            </div>
            <div className="sm:col-span-2 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setEditor({ name: "", price: "", buzzer_count: "", description: "", status: "Aktif" })}>Reset</Button>
              <Button className="gradient-brand text-brand-foreground" disabled={saving} onClick={save}>
                {saving ? "Menyimpan..." : editor?.id ? "Simpan Paket" : "Tambah Paket"}
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-semibold">Paket yang sudah dibuat</p>
            {loading && <p className="text-sm text-muted-foreground">Memuat paket...</p>}
            {!loading && packages.length === 0 && <p className="rounded-lg border border-dashed border-border p-3 text-sm text-muted-foreground">Belum ada paket.</p>}
            {packages.map((catalogPackage) => (
              <div key={catalogPackage.id} className="flex items-center justify-between gap-3 rounded-lg border border-border p-3">
                <div>
                  <p className="font-semibold">{catalogPackage.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatIDR(Number(catalogPackage.price))} · {catalogPackage.buzzer_count} buzzer · {catalogPackage.status}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="h-8 w-8 p-0" title="Edit" aria-label="Edit" onClick={() => setEditor({ ...catalogPackage, price: String(catalogPackage.price), buzzer_count: String(catalogPackage.buzzer_count) })}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={async () => { await updateCatalogPackageStatus(catalogPackage.id, catalogPackage.status === "Aktif" ? "Nonaktif" : "Aktif"); toast.success("Status paket diperbarui."); }}>
                    {catalogPackage.status === "Aktif" ? "Nonaktifkan" : "Aktifkan"}
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    className="h-8 w-8 p-0"
                    title="Hapus"
                    aria-label="Hapus"
                    onClick={async () => {
                      if (!confirm(`Hapus paket "${catalogPackage.name}"?`)) return;
                      try {
                        await deleteCatalogPackage(catalogPackage.id);
                        toast.success("Paket berhasil dihapus.");
                        if (editor?.id === catalogPackage.id) {
                          setEditor({ name: "", price: "", buzzer_count: "", description: "", status: "Aktif" });
                        }
                      } catch {
                        toast.error("Gagal menghapus paket.");
                      }
                    }}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ServicePricingManagementSection() {
  const { data: pricings, loading } = useServicePricings();
  const [editor, setEditor] = useState<any | null>(null);
  const [saving, setSaving] = useState(false);
  const [deletingPricing, setDeletingPricing] = useState<any | null>(null);
  const [deletingPricingLoading, setDeletingPricingLoading] = useState(false);
  const platforms = ["Instagram", "TikTok", "X (Twitter)", "Facebook", "YouTube", "Telegram"];

  const PAGE_SIZE = 8;
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(pricings.length / PAGE_SIZE));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const paginatedPricings = useMemo(() => {
    const start = (safePage - 1) * PAGE_SIZE;
    return pricings.slice(start, start + PAGE_SIZE);
  }, [pricings, safePage]);

  const openCreate = () => setEditor({ platform: "Instagram", service_type: CAMPAIGN_TYPES[0]?.name ?? "Like", price_per_buzzer: "", status: "Aktif" });
  const save = async () => {
    if (!editor?.platform || !editor.service_type?.trim() || Number(editor.price_per_buzzer) <= 0) {
      toast.error("Platform, jenis layanan, dan harga per buzzer wajib diisi.");
      return;
    }
    setSaving(true);
    try {
      const payload = { platform: editor.platform, service_type: editor.service_type.trim(), price_per_buzzer: Number(editor.price_per_buzzer), status: editor.status };
      if (editor.id) await updateServicePricing(editor.id, payload);
      else await createServicePricing(payload);
      toast.success(editor.id ? "Harga per buzzer diperbarui." : "Harga per buzzer ditambahkan.");
      setEditor(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Gagal menyimpan harga per buzzer.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeletePricing = async () => {
    if (!deletingPricing?.id) return;
    setDeletingPricingLoading(true);
    try {
      await deleteServicePricing(deletingPricing.id);
      toast.success("Harga per buzzer berhasil dihapus.");
      if (editor?.id === deletingPricing.id) setEditor(null);
      setDeletingPricing(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Gagal menghapus harga per buzzer.");
    } finally {
      setDeletingPricingLoading(false);
    }
  };

  return (
    <section className="rounded-2xl border border-border bg-card shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-5">
        <div>
          <h2 className="font-display text-lg font-bold">Harga Pesanan Sendiri</h2>
          <p className="text-sm text-muted-foreground">Tetapkan harga per buzzer untuk setiap platform dan jenis layanan.</p>
        </div>
        <Button size="sm" className="gradient-brand text-brand-foreground" onClick={openCreate}>
          <Plus className="mr-1 h-4 w-4" /> Tambah Harga
        </Button>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Platform</TableHead>
              <TableHead>Jenis Layanan</TableHead>
              <TableHead>Harga / Buzzer</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && (
              <TableRow>
                <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
                  Memuat harga…
                </TableCell>
              </TableRow>
            )}
            {!loading && pricings.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
                  Belum ada konfigurasi harga.
                </TableCell>
              </TableRow>
            )}
            {paginatedPricings.map((pricing) => (
              <TableRow key={pricing.id}>
                <TableCell>{pricing.platform}</TableCell>
                <TableCell>{pricing.service_type}</TableCell>
                <TableCell className="font-semibold">{formatIDR(Number(pricing.price_per_buzzer))}</TableCell>
                <TableCell>
                  <StatusBadge status={pricing.status === "Aktif" ? "Aktif" : "Dibatalkan"} />
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 w-8 p-0"
                      title="Edit"
                      aria-label="Edit"
                      onClick={() => setEditor({ ...pricing, price_per_buzzer: String(pricing.price_per_buzzer) })}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <TablePagination
        currentPage={safePage}
        totalItems={pricings.length}
        pageSize={PAGE_SIZE}
        onPageChange={setPage}
      />
      <Dialog open={!!editor} onOpenChange={(open) => !open && setEditor(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editor?.id ? "Edit Harga Per Buzzer" : "Tambah Harga Per Buzzer"}</DialogTitle>
          </DialogHeader>
          {editor && (
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <Label>Platform</Label>
                <Select value={editor.platform} onValueChange={(platform) => setEditor({ ...editor, platform })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {platforms.map((platform) => (
                      <SelectItem key={platform} value={platform}>
                        {platform}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Jenis Layanan</Label>
                <Select value={editor.service_type} onValueChange={(service_type) => setEditor({ ...editor, service_type })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CAMPAIGN_TYPES.map((item) => (
                      <SelectItem key={item.name} value={item.name}>
                        {item.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Harga Per Buzzer</Label>
                <Input
                  type="number"
                  min="1"
                  value={editor.price_per_buzzer}
                  onChange={(event) => setEditor({ ...editor, price_per_buzzer: event.target.value })}
                />
              </div>
              <div>
                <Label>Status</Label>
                <Select value={editor.status} onValueChange={(status) => setEditor({ ...editor, status })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Aktif">Aktif</SelectItem>
                    <SelectItem value="Nonaktif">Nonaktif</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-between">
            {editor?.id ? (
              <Button
                type="button"
                variant="destructive"
                onClick={() => setDeletingPricing(editor)}
                className="h-9 w-9 p-0 sm:mr-auto"
                title="Hapus"
                aria-label="Hapus"
                disabled={saving}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            ) : <div />}
            <div className="flex items-center justify-end gap-2">
              <Button variant="outline" onClick={() => setEditor(null)} disabled={saving}>
                Batal
              </Button>
              <Button className="gradient-brand text-brand-foreground" disabled={saving} onClick={save}>
                {saving ? "Menyimpan..." : "Simpan"}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={!!deletingPricing}
        onOpenChange={(open) => {
          if (!open && !deletingPricingLoading) setDeletingPricing(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Konfigurasi Harga?</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus konfigurasi harga {deletingPricing?.platform} - {deletingPricing?.service_type}? Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deletingPricingLoading}>Batal</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={deletingPricingLoading}
              onClick={(e) => {
                e.preventDefault();
                void handleDeletePricing();
              }}
            >
              {deletingPricingLoading ? (
                <>
                  <Loader2 className="mr-1 h-4 w-4 animate-spin" /> Menghapus...
                </>
              ) : (
                <>
                  <Trash2 className="mr-1 h-4 w-4" /> Hapus Harga
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
}

/* ----------------- MANAJEMEN USER (Customer + Buzzer) ----------------- */
function ManajemenUserSection() {
  const [stats, setStats] = useState({ totalCustomer: 0, activeCustomer: 0, totalBuzzer: 0, activeBuzzer: 0 });

  useEffect(() => {
    let active = true;
    Promise.all([
      supabase.from("app_accounts").select("role, active"),
      supabase.from("customer_accounts").select("active"),
      (supabase as any).from("buzzer_profiles").select("email"),
    ]).then(([appRes, custRes, buzRes]) => {
      if (!active) return;
      const apps = appRes.data || [];
      const customers = apps.filter((a: any) => a.role === "customer");
      const buzzers = apps.filter((a: any) => a.role === "buzzer");
      const totalCust = Math.max(customers.length, custRes.data?.length || 0);
      const activeCust = Math.max(
        customers.filter((a: any) => a.active !== false).length,
        custRes.data?.filter((c: any) => c.active !== false).length || 0
      );
      const totalBuz = Math.max(buzzers.length, buzRes.data?.length || 0);
      const activeBuz = Math.max(buzzers.filter((a: any) => a.active !== false).length, buzRes.data?.length || 0);
      setStats({
        totalCustomer: totalCust,
        activeCustomer: activeCust,
        totalBuzzer: totalBuz,
        activeBuzzer: activeBuz,
      });
    });
    return () => { active = false; };
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Total Customer"
          value={stats.totalCustomer.toString()}
          hint="Akun brand & klien"
          icon={<ShieldCheck className="h-5 w-5" />}
        />
        <StatCard
          label="Customer Aktif"
          value={stats.activeCustomer.toString()}
          hint="Dapat memesan kampanye"
          icon={<CheckCircle2 className="h-5 w-5" />}
        />
        <StatCard
          label="Total Buzzer"
          value={stats.totalBuzzer.toString()}
          hint="Akun buzzer terdaftar"
          icon={<Users className="h-5 w-5" />}
        />
        <StatCard
          label="Buzzer Siap Kerja"
          value={stats.activeBuzzer.toString()}
          hint="Status aktif & terverifikasi"
          icon={<Activity className="h-5 w-5" />}
        />
      </div>

      <Tabs defaultValue="customer" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 sm:w-auto">
          <TabsTrigger value="customer" className="gap-2">
            <ShieldCheck className="h-4 w-4" /> Customer
          </TabsTrigger>
          <TabsTrigger value="buzzer" className="gap-2">
            <Users className="h-4 w-4" /> Buzzer
          </TabsTrigger>
        </TabsList>
        <TabsContent value="customer" className="mt-2">
          <CustomerSection />
        </TabsContent>
        <TabsContent value="buzzer" className="mt-2">
          <BuzzerSection />
        </TabsContent>
      </Tabs>
    </div>
  );
}

/* ----------------- BUZZER ----------------- */
const platformIcon = (p: string) => {
  if (p === "Instagram") return <Instagram className="h-4 w-4" />;
  if (p === "TikTok") return <Music2 className="h-4 w-4" />;
  if (p === "X (Twitter)") return <Twitter className="h-4 w-4" />;
  if (p === "YouTube") return <Youtube className="h-4 w-4" />;
  return <Facebook className="h-4 w-4" />;
};

type AccountManagementRow = {
  email: string;
  name: string;
  role: string;
  phone?: string | null;
  city?: string | null;
  bio?: string | null;
  company?: string | null;
  industry?: string | null;
  username?: string | null;
  platform?: string | null;
  followers?: number | null;
  avatar_url?: string | null;
  created_at?: string | null;
};

type BuzzerRow = (typeof buzzersSeed)[number] & { avatar_url?: string | null };
type BuzzerExtra = {
  email: string;
  phone: string;
  city: string;
  joinDate: string;
  bio: string;
  bank: string;
  completionRate: number;
  responseTime: string;
  completedJobsCount?: number;
  recentJobs: {
    id: string;
    title: string;
    brand: string;
    date: string;
    status: string;
    payout: number;
    admin_verified_at?: string | null;
  }[];
  earnings: { id: string; date: string; source: string; amount: number; status: string }[];
  withdrawals: { id: string; date: string; amount: number; method: string; status: string }[];
  socialAccounts: {
    id: string;
    platform: string;
    username: string;
    profileUrl?: string;
    followers: number;
    verification: string;
  }[];
  level: string;
  verifiedAt: string;
  rating: number | null;
};

const normalizePlatform = (value?: string | null) => {
  if (!value) return "-";
  if (value === "X" || value === "X (Twitter)" || value === "Twitter") return "X (Twitter)";
  return value;
};

const toBuzzerRowFromAccount = (row: AccountManagementRow): BuzzerRow => ({
  id: row.email,
  name: row.name || "-",
  username: row.username || "-",
  platform: normalizePlatform(row.platform),
  followers: row.followers ?? 0,
  rating: 4.8,
  jobs: 0,
  status: "Aktif",
  earnings: 0,
  avatar_url: row.avatar_url || null,
});

const buildDefaultBuzzerExtra = (row: BuzzerRow): BuzzerExtra => ({
  email: row.id,
  phone: "-",
  city: "-",
  joinDate: "-",
  bio: "-",
  bank: "-",
  completionRate: 0,
  responseTime: "-",
  completedJobsCount: row.jobs || 0,
  recentJobs: [],
  earnings: [],
  withdrawals: [],
  socialAccounts: [],
  level: "-",
  verifiedAt: "-",
  rating: null,
});

const mergeBuzzerRows = (prev: BuzzerRow[], incoming: BuzzerRow[]) => {
  const map = new Map<string, BuzzerRow>();
  [...prev, ...incoming].forEach((row) => {
    map.set(row.id, row);
  });
  return [...map.values()];
};

const mergeCustomerRows = (_prev: CustomerDetail[], incoming: CustomerDetail[]) => {
  return incoming;
};

const buzzerExtras: Record<string, any> = {
  b1: {
    email: "buzzer@buzzhub.id",
    phone: "+62 812-3456-7890",
    city: "Jakarta Selatan",
    joinDate: "2024-03-12",
    bio: "Micro-influencer lifestyle & kuliner. Open collab brand lokal.",
    bank: "BCA •• 8821",
    completionRate: 96,
    responseTime: "< 2 jam",
    recentJobs: [
      {
        id: "j1",
        title: "Launch Skincare Glowin",
        brand: "PT Kreatif Digital",
        date: "2026-07-01",
        status: "Selesai",
        payout: 45000,
      },
      {
        id: "j2",
        title: "Tutorial Makeup Wardah",
        brand: "PT Kreatif Digital",
        date: "2026-06-28",
        status: "Review",
        payout: 60000,
      },
      {
        id: "j3",
        title: "Promo Lebaran Bunda",
        brand: "Toko Online Bunda",
        date: "2026-06-24",
        status: "Selesai",
        payout: 30000,
      },
      {
        id: "j4",
        title: "Endorse Snack Chitato",
        brand: "Indofood",
        date: "2026-06-15",
        status: "Selesai",
        payout: 120000,
      },
    ],
    earnings: [
      {
        id: "e1",
        date: "2026-07-01",
        source: "Launch Skincare Glowin",
        amount: 45000,
        status: "Berhasil",
      },
      {
        id: "e2",
        date: "2026-06-24",
        source: "Promo Lebaran Bunda",
        amount: 30000,
        status: "Berhasil",
      },
      {
        id: "e3",
        date: "2026-06-15",
        source: "Endorse Snack Chitato",
        amount: 120000,
        status: "Berhasil",
      },
      {
        id: "e4",
        date: "2026-06-28",
        source: "Tutorial Makeup Wardah",
        amount: 60000,
        status: "Pending",
      },
    ],
    withdrawals: [
      { id: "w1", date: "2026-06-25", amount: 1500000, method: "BCA •• 8821", status: "Berhasil" },
      { id: "w2", date: "2026-07-02", amount: 500000, method: "BCA •• 8821", status: "Diproses" },
    ],
  },
  b2: {
    email: "anisa.w@buzzhub.id",
    phone: "+62 813-2211-7788",
    city: "Bandung",
    joinDate: "2024-01-08",
    bio: "Creator TikTok fashion & dance. Konsisten viral 5-10 juta views.",
    bank: "Mandiri •• 4412",
    completionRate: 98,
    responseTime: "< 1 jam",
    recentJobs: [
      {
        id: "j1",
        title: "FinPay Cashback Challenge",
        brand: "Startup FinPay",
        date: "2026-07-02",
        status: "Selesai",
        payout: 75000,
      },
      {
        id: "j2",
        title: "Viral Dance Erigo",
        brand: "Erigo Store",
        date: "2026-06-30",
        status: "Selesai",
        payout: 150000,
      },
      {
        id: "j3",
        title: "Voucher Grab Weekend",
        brand: "Grab Indonesia",
        date: "2026-06-27",
        status: "Review",
        payout: 90000,
      },
    ],
    earnings: [
      {
        id: "e1",
        date: "2026-07-02",
        source: "FinPay Cashback Challenge",
        amount: 75000,
        status: "Berhasil",
      },
      {
        id: "e2",
        date: "2026-06-30",
        source: "Viral Dance Erigo",
        amount: 150000,
        status: "Berhasil",
      },
      {
        id: "e3",
        date: "2026-06-27",
        source: "Voucher Grab Weekend",
        amount: 90000,
        status: "Pending",
      },
    ],
    withdrawals: [
      {
        id: "w1",
        date: "2026-06-28",
        amount: 3000000,
        method: "Mandiri •• 4412",
        status: "Berhasil",
      },
    ],
  },
  b3: {
    email: "budi.s@buzzhub.id",
    phone: "+62 852-9911-3344",
    city: "Surabaya",
    joinDate: "2023-11-22",
    bio: "Buzzer politik & news commentary di X. Spesialis thread analitis.",
    bank: "BRI •• 7301",
    completionRate: 94,
    responseTime: "< 3 jam",
    recentJobs: [
      {
        id: "j1",
        title: "Kampanye Visi Misi",
        brand: "Caleg Bagus Wijaya",
        date: "2026-07-03",
        status: "Berjalan",
        payout: 40000,
      },
      {
        id: "j2",
        title: "Hashtag #KopiSenjaPulang",
        brand: "Brand Kopi Senja",
        date: "2026-06-20",
        status: "Selesai",
        payout: 25000,
      },
      {
        id: "j3",
        title: "Counter Narrative Round 2",
        brand: "Caleg Bagus Wijaya",
        date: "2026-06-18",
        status: "Selesai",
        payout: 55000,
      },
    ],
    earnings: [
      {
        id: "e1",
        date: "2026-06-20",
        source: "Hashtag #KopiSenjaPulang",
        amount: 25000,
        status: "Berhasil",
      },
      {
        id: "e2",
        date: "2026-06-18",
        source: "Counter Narrative Round 2",
        amount: 55000,
        status: "Berhasil",
      },
    ],
    withdrawals: [
      { id: "w1", date: "2026-06-22", amount: 2000000, method: "BRI •• 7301", status: "Berhasil" },
    ],
  },
  b4: {
    email: "dewi.l@buzzhub.id",
    phone: "+62 819-4455-6677",
    city: "Yogyakarta",
    joinDate: "2026-05-30",
    bio: "Fashion blogger IG. Sedang verifikasi KYC.",
    bank: "BNI •• 1198",
    completionRate: 88,
    responseTime: "< 4 jam",
    recentJobs: [
      {
        id: "j1",
        title: "Launch Koleksi Batik",
        brand: "PT Kreatif Digital",
        date: "2026-06-29",
        status: "Review",
        payout: 50000,
      },
    ],
    earnings: [
      {
        id: "e1",
        date: "2026-06-15",
        source: "Story Endorse Skincare",
        amount: 40000,
        status: "Berhasil",
      },
    ],
    withdrawals: [],
  },
  b5: {
    email: "fajar.n@buzzhub.id",
    phone: "+62 878-3322-1155",
    city: "Semarang",
    joinDate: "2024-07-19",
    bio: "YouTuber tech review. Fokus gadget & aksesoris.",
    bank: "BCA •• 5567",
    completionRate: 92,
    responseTime: "< 6 jam",
    recentJobs: [
      {
        id: "j1",
        title: "Review Earphone Sonik",
        brand: "Sonik Audio",
        date: "2026-07-01",
        status: "Berjalan",
        payout: 120000,
      },
      {
        id: "j2",
        title: "YouTube Comment Push Launch",
        brand: "PT Kreatif Digital",
        date: "2026-06-25",
        status: "Selesai",
        payout: 24000,
      },
    ],
    earnings: [
      {
        id: "e1",
        date: "2026-06-25",
        source: "YouTube Comment Push Launch",
        amount: 24000,
        status: "Berhasil",
      },
    ],
    withdrawals: [
      { id: "w1", date: "2026-06-26", amount: 1000000, method: "BCA •• 5567", status: "Berhasil" },
    ],
  },
  b6: {
    email: "sinta.m@buzzhub.id",
    phone: "+62 811-7788-2200",
    city: "Jakarta Pusat",
    joinDate: "2023-06-05",
    bio: "Top-tier TikTok creator 150K+ followers. Kategori beauty & lifestyle.",
    bank: "Mandiri •• 8899",
    completionRate: 99,
    responseTime: "< 30 menit",
    recentJobs: [
      {
        id: "j1",
        title: "Viral TikTok Challenge Chitato",
        brand: "Indofood",
        date: "2026-07-02",
        status: "Selesai",
        payout: 250000,
      },
      {
        id: "j2",
        title: "Launch Menu KFC",
        brand: "KFC Indonesia",
        date: "2026-06-28",
        status: "Selesai",
        payout: 180000,
      },
      {
        id: "j3",
        title: "Kolab Fashion Erigo",
        brand: "Erigo Store",
        date: "2026-06-22",
        status: "Selesai",
        payout: 300000,
      },
    ],
    earnings: [
      {
        id: "e1",
        date: "2026-07-02",
        source: "Viral TikTok Challenge Chitato",
        amount: 250000,
        status: "Berhasil",
      },
      {
        id: "e2",
        date: "2026-06-28",
        source: "Launch Menu KFC",
        amount: 180000,
        status: "Berhasil",
      },
      {
        id: "e3",
        date: "2026-06-22",
        source: "Kolab Fashion Erigo",
        amount: 300000,
        status: "Berhasil",
      },
    ],
    withdrawals: [
      {
        id: "w1",
        date: "2026-06-30",
        amount: 5000000,
        method: "Mandiri •• 8899",
        status: "Berhasil",
      },
      {
        id: "w2",
        date: "2026-06-15",
        amount: 4000000,
        method: "Mandiri •• 8899",
        status: "Berhasil",
      },
    ],
    socialAccounts: [],
    level: "-",
    verifiedAt: "-",
    rating: null,
  },
  b7: {
    email: "yoga.p@buzzhub.id",
    phone: "+62 856-1122-9988",
    city: "Medan",
    joinDate: "2024-09-14",
    bio: "Buzzer Facebook grup komunitas. Saat ini akun nonaktif.",
    bank: "BNI •• 3345",
    completionRate: 78,
    responseTime: "> 12 jam",
    recentJobs: [
      {
        id: "j1",
        title: "Facebook Group Seeding Promo",
        brand: "Toko Online Bunda",
        date: "2026-05-30",
        status: "Selesai",
        payout: 20000,
      },
    ],
    earnings: [
      {
        id: "e1",
        date: "2026-05-30",
        source: "Facebook Group Seeding Promo",
        amount: 20000,
        status: "Berhasil",
      },
    ],
    withdrawals: [
      { id: "w1", date: "2026-06-01", amount: 500000, method: "BNI •• 3345", status: "Berhasil" },
    ],
    socialAccounts: [],
    level: "-",
    verifiedAt: "-",
    rating: null,
  },
};

function BuzzerSection() {
  const [q, setQ] = useState("");
  const [plat, setPlat] = useState("Semua");
  const [rows, setRows] = useState<BuzzerRow[]>([]);
  const [details, setDetails] = useState<Record<string, BuzzerExtra>>({});
  const [openId, setOpenId] = useState<string | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [editDraft, setEditDraft] = useState<BuzzerRow | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const loadRows = useCallback(async () => {
      const [
        applicationsResult,
        accountsResult,
        socialResult,
        walletsResult,
        jobsResult,
        withdrawalsResult,
        submissionsResult,
      ] = await Promise.all([
        supabase.from("buzzer_applications").select("*").eq("status", "approved"),
        supabase.from("app_accounts").select("*").order("created_at", { ascending: false }),
        supabase.from("social_accounts").select("*"),
        supabase.from("buzzer_wallets").select("*"),
        (supabase as any).from("campaign_jobs").select("*").not("buzzer_email", "is", null),
        supabase.from("withdrawals").select("*"),
        (supabase as any).from("campaign_job_submissions").select("*"),
      ]);

      const { data: applications, error: applicationsError } = applicationsResult;
      const { data, error } = accountsResult;

      if (applicationsError || error || !data) return;

      const accountsByEmail = new Map(
        data
          .filter((account) => account.role.trim().toLowerCase() === "buzzer")
          .map((account) => [account.email.trim().toLowerCase(), account]),
      );
      const approved = new Map(
        (applications ?? []).map((application) => [
          application.email.trim().toLowerCase(),
          application,
        ]),
      );
      const allBuzzerEmails = Array.from(
        new Set([
          ...data
            .filter((account) => account.role.trim().toLowerCase() === "buzzer")
            .map((a) => a.email.trim().toLowerCase()),
          ...(applications ?? []).map((a) => a.email.trim().toLowerCase()),
        ]),
      );
      const accounts = allBuzzerEmails.map((email) => {
        const app = approved.get(email);
        const acc = accountsByEmail.get(email);
        return (
          acc ?? {
            email,
            name: app?.name || "Buzzer",
            role: "buzzer",
            phone: app?.phone || null,
            city: app?.city || null,
            bio: app?.bio || null,
            industry: app?.category || null,
            username: app?.username || `@${app?.name?.toLowerCase().replace(/[^a-z0-9]/g, "") || "buzzer"}`,
            platform: app?.platform || "Instagram",
            followers: app?.followers || 0,
            created_at: app?.submitted_at || new Date().toISOString(),
          }
        );
      });
      const socialAccounts = socialResult.data ?? [];
      const wallets = walletsResult.data ?? [];
      const jobs: any[] = (jobsResult.data ?? []) as any[];
      const withdrawals = withdrawalsResult.data ?? [];
      const submissions = ((submissionsResult as any)?.data ?? []) as any[];

      const mapped = accounts.map((row) => {
        const email = row.email.trim().toLowerCase();
        const wallet = wallets.find((item) => (item.buzzer_email ?? "").trim().toLowerCase() === email);
        const buzzerJobs = jobs.filter(
          (item: any) =>
            (item.buzzer_email ?? "").trim().toLowerCase() === email ||
            (row.name && (item.buzzer_name ?? "").trim().toLowerCase() === row.name.trim().toLowerCase()),
        );
        const buzzerSubs = submissions.filter(
          (s: any) => (s.buzzer_email ?? "").trim().toLowerCase() === email
        );
        const subCount = buzzerSubs.filter((s: any) => s.status === "Selesai" || s.status === "Review").length;

        let localJobsCount = 0;
        try {
          const raw = typeof window !== "undefined" ? localStorage.getItem(`buzzhub.buzzer.${email}`) : null;
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
          }
        } catch {}

        const finishedJobs = buzzerJobs.filter(
          (item: any) => item.status === "Selesai" || Boolean(item.admin_verified_at),
        );
        const reviewJobs = buzzerJobs.filter(
          (item: any) =>
            (item.status === "Review" || Boolean(item.proof_url)) &&
            item.status !== "Selesai" &&
            !item.admin_verified_at,
        );

        const calculatedJobsCount = Math.max(
          finishedJobs.length + reviewJobs.length > 0
            ? finishedJobs.length + reviewJobs.length
            : buzzerJobs.length,
          subCount,
          localJobsCount,
          Number(wallet?.campaigns_completed ?? 0),
        );

        return {
          ...toBuzzerRowFromAccount(row as AccountManagementRow),
          id: row.email,
          status: "Aktif",
          rating: Number(wallet?.rating ?? 0),
          jobs: calculatedJobsCount,
          earnings: buzzerJobs
            .filter((item: any) => item.status === "Selesai" || Boolean(item.admin_verified_at))
            .reduce(
              (total: number, item: any) => total + Number(item.buzzer_amount ?? item.payout ?? 0),
              0,
            ),
        };
      });
      const nextDetails: Record<string, BuzzerExtra> = {};
      for (const row of accounts) {
        const email = row.email.trim().toLowerCase();
        const application = approved.get(email);
        const wallet = wallets.find((item) => (item.buzzer_email ?? "").trim().toLowerCase() === email);
        const buzzerJobs = jobs.filter(
          (item: any) =>
            (item.buzzer_email ?? "").trim().toLowerCase() === email ||
            (row.name && (item.buzzer_name ?? "").trim().toLowerCase() === row.name.trim().toLowerCase()),
        );
        const buzzerSubs = submissions.filter(
          (s: any) => (s.buzzer_email ?? "").trim().toLowerCase() === email
        );
        const subCount = buzzerSubs.filter((s: any) => s.status === "Selesai" || s.status === "Review").length;

        let localJobsCount = 0;
        let localJobs: any[] = [];
        try {
          const raw = typeof window !== "undefined" ? localStorage.getItem(`buzzhub.buzzer.${email}`) : null;
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
              brand: "-",
              date: j.updatedAt || j.deadline || new Date().toISOString(),
              status: j.status || "Selesai",
              admin_verified_at: j.admin_verified_at,
              payout: Number(j.payout || 0),
            }));
          }
        } catch {}

        const finishedJobs = buzzerJobs.filter(
          (item: any) => item.status === "Selesai" || Boolean(item.admin_verified_at),
        );
        const reviewJobs = buzzerJobs.filter(
          (item: any) =>
            (item.status === "Review" || Boolean(item.proof_url)) &&
            item.status !== "Selesai" &&
            !item.admin_verified_at,
        );

        const calculatedJobsCount = Math.max(
          finishedJobs.length + reviewJobs.length > 0
            ? finishedJobs.length + reviewJobs.length
            : buzzerJobs.length,
          subCount,
          localJobsCount,
          Number(wallet?.campaigns_completed ?? 0),
        );

        const mergedJobsMap = new Map<string, any>();
        buzzerJobs.forEach((job: any) => {
          mergedJobsMap.set(job.id, {
            id: job.id,
            title: job.campaign_title,
            brand: "-",
            date: job.created_at,
            status: job.status,
            admin_verified_at: job.admin_verified_at,
            payout: Number(job.buzzer_amount ?? job.payout ?? 0),
          });
        });
        localJobs.forEach((lj) => {
          if (!mergedJobsMap.has(lj.id)) {
            mergedJobsMap.set(lj.id, lj);
          }
        });

        const buzzerWithdrawals = withdrawals.filter(
          (item) => (item.buzzer_email ?? "").trim().toLowerCase() === email,
        );
        const detailItem: BuzzerExtra = {
          email: row.email,
          phone: row.phone || application?.phone || "-",
          city: row.city || application?.city || "-",
          joinDate: application?.submitted_at || row.created_at || "-",
          bio: row.bio || application?.bio || "-",
          bank: "-",
          completionRate:
            buzzerJobs.length > 0 ? Math.round((finishedJobs.length / buzzerJobs.length) * 100) : 0,
          responseTime: "-",
          completedJobsCount: calculatedJobsCount,
          recentJobs: Array.from(mergedJobsMap.values()),
          earnings: finishedJobs.map((job: any) => ({
            id: job.id,
            date: job.updated_at || job.created_at,
            source: job.campaign_title,
            amount: Number(job.buzzer_amount ?? job.payout ?? 0),
            status: "Berhasil",
          })),
          withdrawals: buzzerWithdrawals.map((withdrawal) => ({
            id: withdrawal.id,
            date: withdrawal.requested_at,
            amount: Number(withdrawal.amount || 0),
            method: withdrawal.method,
            status: withdrawal.status,
          })),
          socialAccounts: socialAccounts
            .filter((account) => (account.buzzer_email ?? "").trim().toLowerCase() === email)
            .map((account) => ({
              id: account.id,
              platform: account.platform,
              username: account.username,
              profileUrl: account.profile_url,
              followers: account.followers,
              verification: account.verification,
            })),
          level: wallet?.level || "-",
          verifiedAt: wallet?.level_assigned_at || "-",
          rating: wallet?.rating == null ? null : Number(wallet.rating),
        };
        nextDetails[row.email] = detailItem;
        nextDetails[email] = detailItem;
      }
      setRows(mapped);
      setDetails(nextDetails);
  }, []);

  useEffect(() => {
    void loadRows();

    const channel = supabase
      .channel("admin-buzzer-accounts")
      .on("postgres_changes", { event: "*", schema: "public", table: "app_accounts" }, () => {
        void loadRows();
      })
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "buzzer_applications" },
        () => {
          void loadRows();
        },
      )
      .on("postgres_changes", { event: "*", schema: "public", table: "social_accounts" }, () => {
        void loadRows();
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "buzzer_wallets" }, () => {
        void loadRows();
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "campaign_jobs" }, () => {
        void loadRows();
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "withdrawals" }, () => {
        void loadRows();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [loadRows]);

  const filtered = rows.filter(
    (b) =>
      b.name.toLowerCase().includes(q.toLowerCase()) && (plat === "Semua" || b.platform === plat),
  );

  const [page, setPage] = useState(1);
  const PAGE_SIZE = 8;

  useEffect(() => {
    setPage(1);
  }, [q, plat]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const paginatedBuzzers = useMemo(() => {
    const start = (safePage - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, safePage]);

  const current = openId
    ? rows.find(
        (b) =>
          b.id === openId ||
          b.id.trim().toLowerCase() === openId.trim().toLowerCase(),
      )
    : null;
  const extra = current
    ? (details[current.id] ??
      details[current.id.trim().toLowerCase()] ??
      buildDefaultBuzzerExtra(current))
    : null;

  const openEdit = () => {
    if (!current) return;
    setEditDraft({ ...current });
    setEditOpen(true);
  };
  const saveEdit = async () => {
    if (!editDraft) return;
    const emailLc = editDraft.id.trim().toLowerCase();
    await Promise.all([
      supabase
        .from("app_accounts")
        .update({
          name: editDraft.name,
          username: editDraft.username,
          platform: editDraft.platform,
          followers: editDraft.followers,
        })
        .eq("email", emailLc),
      supabase
        .from("buzzer_applications")
        .update({
          name: editDraft.name,
          username: editDraft.username,
          platform: editDraft.platform,
          followers: editDraft.followers,
        })
        .eq("email", emailLc),
    ]);

    if (editDraft.platform) {
      const { data: existingSoc } = await supabase
        .from("social_accounts")
        .select("id")
        .eq("buzzer_email", emailLc)
        .ilike("platform", editDraft.platform)
        .maybeSingle();

      if (existingSoc) {
        await supabase
          .from("social_accounts")
          .update({
            verification: "Terverifikasi",
            is_active: true,
            followers: editDraft.followers,
            username: editDraft.username,
          })
          .eq("id", existingSoc.id);
      } else {
        await supabase.from("social_accounts").insert({
          buzzer_email: emailLc,
          buzzer_name: editDraft.name,
          platform: editDraft.platform,
          username: editDraft.username,
          account_name: editDraft.name,
          profile_url: "",
          followers: editDraft.followers,
          following_count: 0,
          posts: 0,
          category: "Umum",
          bio: "",
          verification: "Terverifikasi",
          is_active: true,
        });
      }
    }

    setRows((prev) => prev.map((b) => (b.id === editDraft.id ? editDraft : b)));
    toast.success("Data buzzer berhasil diperbarui.");
    setEditOpen(false);
    void loadRows();
  };
  const confirmDelete = async (event?: MouseEvent) => {
    event?.preventDefault();
    if (!deleteId) return;
    const name = rows.find((b) => b.id === deleteId)?.name ?? "Buzzer";
    try {
      const { error } = await (supabase as any).rpc("delete_management_account", {
        p_email: deleteId,
        p_role: "buzzer",
      });
      if (error) throw error;
    } catch (error) {
      console.error("Gagal menghapus akun buzzer:", error);
      toast.error(error instanceof Error ? error.message : "Akun buzzer gagal dihapus.");
      return;
    }
    setRows((prev) => prev.filter((b) => b.id !== deleteId));
    setDeleteId(null);
    setOpenId(null);
    toast.success(`Akun ${name} dihapus permanen.`);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm">
        <div className="relative min-w-0 flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="pl-9"
            placeholder="Cari nama buzzer..."
          />
        </div>
        <Select value={plat} onValueChange={setPlat}>
          <SelectTrigger className="w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {["Semua", "Instagram", "TikTok", "X (Twitter)", "YouTube", "Facebook"].map((p) => (
              <SelectItem key={p} value={p}>
                {p}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {paginatedBuzzers.map((b) => (
          <button
            key={b.id}
            onClick={() => setOpenId(b.id)}
            className="group rounded-2xl border border-border bg-card p-5 text-left shadow-sm transition hover:border-primary/50 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12 border border-border">
                {b.avatar_url && <AvatarImage src={b.avatar_url} alt={b.name} />}
                <AvatarFallback className="gradient-brand text-brand-foreground">
                  {b.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <BuzzerNameLink
                  name={b.name}
                  email={b.id}
                  variant="hover-primary"
                  className="truncate block text-sm font-semibold"
                />
                <p className="truncate text-xs text-muted-foreground">{b.username}</p>
              </div>
              <StatusBadge status={b.status} />
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2 text-center">
              <div className="rounded-lg bg-muted/40 p-2">
                <div className="mx-auto mb-1 grid h-7 w-7 place-items-center rounded-md gradient-brand text-brand-foreground">
                  {platformIcon(b.platform)}
                </div>
                <p className="text-[10px] text-muted-foreground">{b.platform}</p>
              </div>
              <div className="rounded-lg bg-muted/40 p-2">
                <p className="text-sm font-bold">{(b.followers / 1000).toFixed(1)}K</p>
                <p className="text-[10px] text-muted-foreground">Followers</p>
              </div>
              <div className="rounded-lg bg-muted/40 p-2">
                <p className="text-sm font-bold">⭐ {b.rating}</p>
                <p className="text-[10px] text-muted-foreground">{b.jobs} job selesai</p>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
              <span className="text-xs text-muted-foreground">Total pendapatan</span>
              <span className="font-bold text-gradient-brand">{formatIDR(b.earnings)}</span>
            </div>
            <div className="mt-3 flex items-center justify-end gap-1 text-xs text-primary opacity-0 transition group-hover:opacity-100">
              <Eye className="h-3.5 w-3.5" /> Lihat detail
            </div>
          </button>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full rounded-xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
            Tidak ada buzzer ditemukan.
          </div>
        )}
      </div>

      {filtered.length > 0 && (
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <TablePagination
            currentPage={safePage}
            totalItems={filtered.length}
            pageSize={PAGE_SIZE}
            onPageChange={setPage}
          />
        </div>
      )}

      <Dialog open={!!openId} onOpenChange={(v) => !v && setOpenId(null)}>
        <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
          {current && extra && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <Avatar className="h-11 w-11 border border-border">
                    {current.avatar_url && <AvatarImage src={current.avatar_url} alt={current.name} />}
                    <AvatarFallback className="gradient-brand text-brand-foreground">
                      {current.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <BuzzerNameLink name={current.name} email={current.id} />
                      <StatusBadge status={current.status} />
                    </div>
                    <p className="text-xs font-normal text-muted-foreground">
                      {current.username} · {extra.email}
                    </p>
                  </div>
                </DialogTitle>
              </DialogHeader>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-border bg-muted/30 p-4 text-sm">
                  <p className="mb-2 font-semibold">Informasi Kontak</p>
                  <div className="space-y-1 text-muted-foreground">
                    <p>📞 {extra.phone}</p>
                    <p>📍 {extra.city}</p>
                    <p>
                      📅 Bergabung{" "}
                      {extra.joinDate === "-"
                        ? "-"
                        : new Date(extra.joinDate).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                    </p>
                    <p>
                      ✅ Verifikasi{" "}
                      {extra.verifiedAt === "-"
                        ? "-"
                        : new Date(extra.verifiedAt).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                    </p>
                  </div>
                </div>
                <div className="rounded-xl border border-border bg-muted/30 p-4 text-sm">
                  <p className="mb-2 font-semibold">Performa</p>
                  <div className="grid grid-cols-2 gap-2 text-center">
                    <div className="rounded-lg bg-background p-2">
                      <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                        {extra.completedJobsCount ??
                          (extra.recentJobs.filter(
                            (j) =>
                              j.status === "Selesai" ||
                              Boolean((j as any).admin_verified_at) ||
                              j.status === "Review",
                          ).length || extra.recentJobs.length)}
                      </p>
                      <p className="text-[10px] text-muted-foreground">Job Selesai</p>
                    </div>
                    <div className="rounded-lg bg-background p-2">
                      <p className="text-lg font-bold">
                        {extra.rating == null ? "-" : `⭐ ${extra.rating}`}
                      </p>
                      <p className="text-[10px] text-muted-foreground">Rating</p>
                    </div>
                    <div className="rounded-lg bg-background p-2">
                      <p className="text-lg font-bold">
                        {current.followers.toLocaleString("id-ID")}
                      </p>
                      <p className="text-[10px] text-muted-foreground">Followers</p>
                    </div>
                    <div className="rounded-lg bg-background p-2">
                      <p className="text-sm font-bold">{extra.level}</p>
                      <p className="text-[10px] text-muted-foreground">Level</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-border bg-muted/20 p-4 text-sm">
                <p className="mb-1 font-semibold">Bio</p>
                <p className="text-muted-foreground">{extra.bio}</p>
              </div>

              <div className="rounded-xl border border-border bg-muted/20 p-4 text-sm">
                <p className="mb-2 font-semibold">Akun Media Sosial</p>
                {extra.socialAccounts.length === 0 ? (
                  <p className="text-muted-foreground">-</p>
                ) : (
                  <div className="space-y-2">
                    {extra.socialAccounts.map((account) => (
                      <div
                        key={account.id}
                        className="flex items-center justify-between gap-3 rounded-lg bg-background p-2.5"
                      >
                        <div>
                          <p className="font-medium text-sm">
                            {account.platform} · {account.username}
                          </p>
                          {account.profileUrl && (
                            <a
                              href={account.profileUrl.startsWith("http") ? account.profileUrl : "https://" + account.profileUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="mt-0.5 inline-flex items-center gap-1 font-mono text-xs text-primary hover:underline max-w-[200px] truncate"
                              title={account.profileUrl}
                            >
                              <Link2 className="h-3 w-3 shrink-0" />
                              <span className="truncate">{account.profileUrl}</span>
                              <ExternalLink className="h-2.5 w-2.5 shrink-0" />
                            </a>
                          )}
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span
                              className={cn(
                                "rounded px-1.5 py-0.5 text-[10px] font-semibold",
                                account.verification === "Terverifikasi"
                                  ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300"
                                  : account.verification === "Ditolak"
                                    ? "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300"
                                    : "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
                              )}
                            >
                              {account.verification}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm">
                            {account.followers.toLocaleString("id-ID")} followers
                          </span>
                          {account.verification === "Menunggu" && (
                            <Button
                              size="sm"
                              className="h-7 w-7 p-0 gradient-brand text-brand-foreground"
                              title="Setujui Akun"
                              aria-label="Setujui Akun"
                              onClick={async (e) => {
                                e.stopPropagation();
                                const ok = await adminApproveSocialAccount(account.id);
                                if (ok) {
                                  toast.success(`Akun ${account.platform} ${account.username} berhasil disetujui!`);
                                  void loadRows();
                                } else {
                                  toast.error("Gagal menyetujui akun media sosial.");
                                }
                              }}
                            >
                              <ShieldCheck className="h-3.5 w-3.5" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <Tabs defaultValue="jobs">
                <TabsList>
                  <TabsTrigger value="jobs">Riwayat Job ({extra.recentJobs.length})</TabsTrigger>
                  <TabsTrigger value="earnings">Penghasilan ({extra.earnings.length})</TabsTrigger>
                  <TabsTrigger value="withdrawals">
                    Penarikan ({extra.withdrawals.length})
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="jobs" className="mt-3">
                  {extra.recentJobs.length === 0 ? (
                    <p className="rounded-lg border border-dashed border-border p-6 text-center text-xs text-muted-foreground">
                      Belum ada job.
                    </p>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Job</TableHead>
                          <TableHead>Brand</TableHead>
                          <TableHead>Tanggal</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Payout</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {extra.recentJobs.map((j) => (
                          <TableRow key={j.id}>
                            <TableCell className="font-medium">{j.title}</TableCell>
                            <TableCell>{j.brand}</TableCell>
                            <TableCell className="text-xs text-muted-foreground">
                              {j.date}
                            </TableCell>
                            <TableCell>
                              <StatusBadge status={j.status} />
                            </TableCell>
                            <TableCell className="text-right font-semibold">
                              {formatIDR(j.payout)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </TabsContent>
                <TabsContent value="earnings" className="mt-3">
                  {extra.earnings.length === 0 ? (
                    <p className="rounded-lg border border-dashed border-border p-6 text-center text-xs text-muted-foreground">
                      Belum ada penghasilan.
                    </p>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Tanggal</TableHead>
                          <TableHead>Sumber</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Jumlah</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {extra.earnings.map((e) => (
                          <TableRow key={e.id}>
                            <TableCell className="text-xs text-muted-foreground">
                              {e.date}
                            </TableCell>
                            <TableCell>{e.source}</TableCell>
                            <TableCell>
                              <StatusBadge status={e.status} />
                            </TableCell>
                            <TableCell className="text-right font-semibold">
                              {formatIDR(e.amount)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </TabsContent>
                <TabsContent value="withdrawals" className="mt-3">
                  {extra.withdrawals.length === 0 ? (
                    <p className="rounded-lg border border-dashed border-border p-6 text-center text-xs text-muted-foreground">
                      Belum ada penarikan.
                    </p>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Tanggal</TableHead>
                          <TableHead>Metode</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Jumlah</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {extra.withdrawals.map((w) => (
                          <TableRow key={w.id}>
                            <TableCell className="text-xs text-muted-foreground">
                              {w.date}
                            </TableCell>
                            <TableCell>{w.method}</TableCell>
                            <TableCell>
                              <StatusBadge status={w.status} />
                            </TableCell>
                            <TableCell className="text-right font-semibold">
                              {formatIDR(w.amount)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </TabsContent>
              </Tabs>

              <DialogFooter className="flex-col gap-2 sm:flex-row sm:justify-between">
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" variant="outline" className="h-8 w-8 p-0" title="Edit Data" aria-label="Edit Data" onClick={openEdit}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="destructive" className="h-8 w-8 p-0" title="Hapus Akun" aria-label="Hapus Akun" onClick={() => setDeleteId(current.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <Button size="sm" variant="ghost" onClick={() => setOpenId(null)}>
                  Tutup
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Buzzer Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Data Buzzer</DialogTitle>
          </DialogHeader>
          {editDraft && (
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Label>Nama Lengkap</Label>
                <Input
                  value={editDraft.name}
                  onChange={(e) => setEditDraft({ ...editDraft, name: e.target.value })}
                />
              </div>
              <div>
                <Label>Username</Label>
                <Input
                  value={editDraft.username}
                  onChange={(e) => setEditDraft({ ...editDraft, username: e.target.value })}
                />
              </div>
              <div>
                <Label>Platform</Label>
                <Select
                  value={editDraft.platform}
                  onValueChange={(v) => setEditDraft({ ...editDraft, platform: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {["Instagram", "TikTok", "X (Twitter)", "YouTube", "Facebook"].map((p) => (
                      <SelectItem key={p} value={p}>
                        {p}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Followers</Label>
                <Input
                  type="number"
                  placeholder="0"
                  value={editDraft.followers === 0 ? "" : editDraft.followers}
                  onChange={(e) =>
                    setEditDraft({ ...editDraft, followers: e.target.value === "" ? 0 : Math.max(0, Number(e.target.value) || 0) })
                  }
                />
              </div>
              <div>
                <Label>Rating</Label>
                <Input
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  placeholder="0"
                  value={editDraft.rating === 0 ? "" : editDraft.rating}
                  onChange={(e) =>
                    setEditDraft({ ...editDraft, rating: e.target.value === "" ? 0 : Math.max(0, Number(e.target.value) || 0) })
                  }
                />
              </div>
              <div>
                <Label>Status</Label>
                <Select
                  value={editDraft.status}
                  onValueChange={(v) => setEditDraft({ ...editDraft, status: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {["Aktif", "Verifikasi", "Suspend", "Nonaktif"].map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Total Pendapatan (Rp)</Label>
                <Input
                  type="number"
                  placeholder="0"
                  value={editDraft.earnings === 0 ? "" : editDraft.earnings}
                  onChange={(e) =>
                    setEditDraft({ ...editDraft, earnings: e.target.value === "" ? 0 : Math.max(0, Number(e.target.value) || 0) })
                  }
                />
              </div>
            </div>
          )}
          <DialogFooter className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-between">
            <Button
              type="button"
              variant="destructive"
              className="h-9 w-9 p-0 sm:mr-auto"
              title="Hapus Akun"
              aria-label="Hapus Akun"
              onClick={() => {
                if (!editDraft) return;
                const targetId = editDraft.id;
                setEditOpen(false);
                setDeleteId(targetId);
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
            <div className="flex items-center justify-end gap-2">
              <Button variant="outline" onClick={() => setEditOpen(false)}>
                Batal
              </Button>
              <Button className="gradient-brand text-brand-foreground" onClick={saveEdit}>
                Simpan Perubahan
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Buzzer Confirm */}
      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus akun buzzer ini?</AlertDialogTitle>
            <AlertDialogDescription>
              Akun dan data profil buzzer akan dihapus. Riwayat job, pembayaran, rating, dan
              aktivitas keuangan tetap disimpan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Hapus Permanen
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

/* ----------------- CUSTOMER ----------------- */
type CustomerDetail = {
  id: string;
  name: string;
  contact: string;
  campaigns: number;
  spent: number;
  since: string;
  phone: string;
  industry: string;
  city: string;
  address?: string;
  website?: string;
  status: string;
  notes: string;
};

const toCustomerRowFromAccount = (row: AccountManagementRow): CustomerDetail => ({
  id: row.email,
  name: row.company || row.name,
  contact: row.email,
  campaigns: 0,
  spent: 0,
  since: (row.created_at ?? new Date().toISOString()).slice(0, 10),
  phone: row.phone || "-",
  industry: row.industry || "-",
  city: row.city || "-",
  address: "-",
  website: "-",
  status: "-",
  notes: row.bio || "-",
});

function CustomerSection() {
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState<CustomerDetail | null>(null);
  const [rows, setRows] = useState<CustomerDetail[]>([]);
  const [editDraft, setEditDraft] = useState<CustomerDetail | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { data: campaignRows } = useCampaigns();

  useEffect(() => {
    let active = true;

    const loadRows = async () => {
      const [{ data, error }, { data: customerAccounts }] = await Promise.all([
        supabase.from("app_accounts").select("*").order("created_at", { ascending: false }),
        supabase.from("customer_accounts").select("email, active"),
      ]);

      if (!active) return;

      if (!error && data) {
        const accountRows = data.filter((row) => row.role.trim().toLowerCase() === "customer");
        const accountsByEmail = new Map(
          accountRows.map((row) => [row.email.trim().toLowerCase(), row as AccountManagementRow]),
        );
        const customerProfiles = new Map(
          (customerAccounts ?? []).map((row) => [row.email.trim().toLowerCase(), row]),
        );
        const emails = new Set([...accountsByEmail.keys(), ...customerProfiles.keys()]);
        const mapped = [...emails].map((email) => {
          const account = accountsByEmail.get(email);
          const customerAccount = customerProfiles.get(email);
          const customer = account
            ? toCustomerRowFromAccount(account)
            : {
                id: email,
                name: (customerAccount as any)?.name || email,
                contact: email,
                campaigns: 0,
                spent: 0,
                since: "-",
                phone: "-",
                industry: "-",
                city: "-",
                address: "-",
                website: "-",
                status: "-",
                notes: "-",
              };
          const campaigns = campaignRows.filter(
            (campaign) => campaign.customer_email.trim().toLowerCase() === email,
          );
          return {
            ...customer,
            status: customerAccount
              ? customerAccount.active
                ? "Aktif"
                : "Ditangguhkan"
              : customer.status,
            campaigns: campaigns.length,
            spent: campaigns.reduce((total, campaign) => total + Number(campaign.budget || 0), 0),
          };
        });
        setRows((prev) => mergeCustomerRows(prev, mapped));
      }
    };

    void loadRows();

    const channel = supabase
      .channel("admin-customer-accounts")
      .on("postgres_changes", { event: "*", schema: "public", table: "app_accounts" }, () => {
        void loadRows();
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "customer_accounts" }, () => {
        void loadRows();
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "campaigns" }, () => {
        void loadRows();
      })
      .subscribe();

    return () => {
      active = false;
      supabase.removeChannel(channel);
    };
  }, [campaignRows]);

  const saveEdit = async () => {
    if (!editDraft) return;
    const phone = editDraft.phone.replace(/\D/g, "");
    await supabase
      .from("app_accounts")
      .update({
        name: editDraft.name,
        company: editDraft.name,
        phone,
        industry: editDraft.industry,
        city: editDraft.city,
        bio: editDraft.notes,
      })
      .eq("email", editDraft.id);
    const savedDraft = { ...editDraft, phone };
    setRows((prev) => prev.map((r) => (r.id === editDraft.id ? savedDraft : r)));
    setSelected(savedDraft);
    setEditDraft(null);
    toast.success("Data customer diperbarui.");
  };
  const confirmDelete = async (event?: MouseEvent) => {
    event?.preventDefault();
    if (!deleteId) return;
    const targetEmail = deleteId.trim().toLowerCase();
    const name = rows.find((r) => r.id.toLowerCase() === targetEmail || r.contact.toLowerCase() === targetEmail)?.name ?? "Customer";
    try {
      const { error } = await (supabase as any).rpc("delete_management_account", {
        p_email: targetEmail,
        p_role: "customer",
      });
      if (error) {
        console.warn("RPC delete_management_account failed, attempting direct table deletion:", error);
        const [del1, del2] = await Promise.all([
          supabase.from("customer_accounts").delete().ilike("email", targetEmail),
          supabase.from("app_accounts").delete().ilike("email", targetEmail),
        ]);
        if (del1.error && del2.error) throw error;
      }
    } catch (error) {
      console.error("Gagal menghapus akun customer:", error);
      toast.error(error instanceof Error ? error.message : "Akun customer gagal dihapus.");
      return;
    }
    setRows((prev) => prev.filter((r) => r.id.toLowerCase() !== targetEmail && r.contact.toLowerCase() !== targetEmail));
    setDeleteId(null);
    setSelected(null);
    toast.success(`Akun ${name} berhasil dihapus permanen.`);
  };

  const filtered = useMemo(
    () =>
      rows.filter(
        (r) =>
          q === "" ||
          r.name.toLowerCase().includes(q.toLowerCase()) ||
          r.contact.toLowerCase().includes(q.toLowerCase()),
      ),
    [rows, q],
  );

  const [page, setPage] = useState(1);
  const PAGE_SIZE = 8;

  useEffect(() => {
    setPage(1);
  }, [q]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const paginatedCustomers = useMemo(() => {
    const start = (safePage - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, safePage]);

  return (
    <>
      <div className="rounded-2xl border border-border bg-card shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-5">
          <div>
            <h3 className="font-display text-lg font-bold">Klien Korporat</h3>
            <p className="text-sm text-muted-foreground">
              {rows.length} brand aktif menggunakan BuzzHub
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                className="w-48 pl-9 sm:w-56"
                placeholder="Cari klien..."
              />
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Perusahaan</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Industri</TableHead>
                <TableHead>Kampanye</TableHead>
                <TableHead>Bergabung</TableHead>
                <TableHead className="text-right">Total Spend</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedCustomers.map((c) => (
                <TableRow
                  key={c.id}
                  className="hover:bg-muted/40"
                >
                  <TableCell>
                    <p className="font-medium">{c.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {c.industry} · {c.city}
                    </p>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{c.contact}</TableCell>
                  <TableCell className="text-sm">{c.industry || "-"}</TableCell>
                  <TableCell>{c.campaigns}</TableCell>
                  <TableCell className="text-sm">{c.since}</TableCell>
                  <TableCell className="text-right font-semibold">{formatIDR(c.spent)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 w-8 p-0"
                        title="Detail"
                        aria-label="Detail"
                        onClick={() => setSelected(c)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="py-10 text-center text-sm text-muted-foreground"
                  >
                    Tidak ada klien yang cocok.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <TablePagination
          currentPage={safePage}
          totalItems={filtered.length}
          pageSize={PAGE_SIZE}
          onPageChange={setPage}
        />
      </div>

      {/* Detail Dialog */}
      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <Avatar className="h-11 w-11">
                    <AvatarFallback className="gradient-brand text-brand-foreground">
                      {selected.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="truncate font-display text-lg font-bold">{selected.name}</p>
                    <p className="truncate text-xs font-normal text-muted-foreground">
                      {selected.industry}
                    </p>
                  </div>
                </DialogTitle>
              </DialogHeader>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-xl border border-border bg-muted/40 p-3">
                  <p className="text-xs text-muted-foreground">Total Spend</p>
                  <p className="font-display text-lg font-bold">{formatIDR(selected.spent)}</p>
                </div>
                <div className="rounded-xl border border-border bg-muted/40 p-3">
                  <p className="text-xs text-muted-foreground">Kampanye</p>
                  <p className="font-display text-lg font-bold">{selected.campaigns}</p>
                </div>
                <div className="rounded-xl border border-border bg-muted/40 p-3">
                  <p className="text-xs text-muted-foreground">Status</p>
                  <p className="font-display text-lg font-bold">{selected.status}</p>
                </div>
              </div>

              <div className="mt-2 grid gap-3 rounded-xl border border-border p-4 text-sm sm:grid-cols-2">
                <Info label="Email" value={selected.contact} />
                <Info label="Telepon" value={selected.phone} />
                <Info label="Kota" value={selected.city} />
                <Info label="Bergabung" value={selected.since} />
              </div>

              <div className="rounded-xl border border-border p-4">
                <p className="mb-2 text-sm font-semibold">Riwayat Kampanye</p>
                <ul className="space-y-2">
                  {campaignRows
                    .filter(
                      (k) => k.customer_email.toLowerCase() === selected.contact.toLowerCase(),
                    )
                    .map((k) => (
                      <li
                        key={k.id}
                        className="flex items-center justify-between gap-2 rounded-lg bg-muted/40 p-2 text-sm"
                      >
                        <div className="min-w-0">
                          <p className="truncate font-medium">{k.title}</p>
                          <p className="truncate text-xs text-muted-foreground">
                            {k.platform} · {k.deadline}
                          </p>
                        </div>
                        <div className="flex shrink-0 items-center gap-2">
                          <StatusBadge status={k.status} />
                          <span className="text-xs font-semibold">{formatIDR(k.budget)}</span>
                        </div>
                      </li>
                    ))}
                  {campaignRows.filter(
                    (k) => k.customer_email.toLowerCase() === selected.contact.toLowerCase(),
                  ).length === 0 && (
                    <li className="rounded-lg border border-dashed p-4 text-center text-xs text-muted-foreground">
                      Belum ada kampanye.
                    </li>
                  )}
                </ul>
              </div>

              <div className="rounded-xl border border-border p-4">
                <p className="mb-1 text-sm font-semibold">Deskripsi</p>
                <p className="text-sm text-muted-foreground">{selected.notes}</p>
              </div>

              <DialogFooter className="flex-col gap-2 sm:flex-row sm:justify-between">
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    className="h-9 w-9 p-0"
                    title="Edit"
                    aria-label="Edit"
                    onClick={() => {
                      setEditDraft({ ...selected });
                      setSelected(null);
                    }}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    className="h-9 w-9 p-0"
                    title="Hapus Akun"
                    aria-label="Hapus Akun"
                    onClick={() => setDeleteId(selected.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <Button variant="ghost" onClick={() => setSelected(null)}>
                  Tutup
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Customer Dialog */}
      <Dialog open={!!editDraft} onOpenChange={(o) => !o && setEditDraft(null)}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Customer</DialogTitle>
          </DialogHeader>
          {editDraft && (
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Label>Nama Perusahaan</Label>
                <Input
                  value={editDraft.name}
                  onChange={(e) => setEditDraft({ ...editDraft, name: e.target.value })}
                />
              </div>
              <div>
                <Label>Email</Label>
                <Input
                  value={editDraft.contact}
                  onChange={(e) => setEditDraft({ ...editDraft, contact: e.target.value })}
                />
              </div>
              <div>
                <Label>Telepon</Label>
                <Input
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={editDraft.phone}
                  onChange={(e) => setEditDraft({ ...editDraft, phone: e.target.value.replace(/\D/g, "") })}
                />
              </div>
              <div>
                <Label>Industri</Label>
                <Input
                  value={editDraft.industry}
                  onChange={(e) => setEditDraft({ ...editDraft, industry: e.target.value })}
                />
              </div>
              <div>
                <Label>Kota</Label>
                <Input
                  value={editDraft.city}
                  onChange={(e) => setEditDraft({ ...editDraft, city: e.target.value })}
                />
              </div>
              <div>
                <Label>Status</Label>
                <Select
                  value={editDraft.status}
                  onValueChange={(v) =>
                    setEditDraft({ ...editDraft, status: v as CustomerDetail["status"] })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {["Aktif", "Prospek", "Ditangguhkan"].map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="sm:col-span-2">
                <Label>Catatan</Label>
                <Textarea
                  value={editDraft.notes}
                  onChange={(e) => setEditDraft({ ...editDraft, notes: e.target.value })}
                />
              </div>
            </div>
          )}
          <DialogFooter className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-between">
            <Button
              type="button"
              variant="destructive"
              className="h-9 w-9 p-0 sm:mr-auto"
              title="Hapus Akun"
              aria-label="Hapus Akun"
              onClick={() => {
                if (!editDraft) return;
                const targetId = editDraft.id;
                setEditDraft(null);
                setDeleteId(targetId);
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
            <div className="flex items-center justify-end gap-2">
              <Button variant="outline" onClick={() => setEditDraft(null)}>
                Batal
              </Button>
              <Button className="gradient-brand text-brand-foreground" onClick={saveEdit}>
                Simpan Perubahan
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Customer Confirm */}
      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Hapus akun customer {rows.find((r) => r.id === deleteId)?.name ? `"${rows.find((r) => r.id === deleteId)?.name}"` : "ini"}?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Akun dan data profil customer ({deleteId}) akan dihapus. Riwayat campaign, pembayaran, dan
              aktivitas keuangan tetap disimpan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Hapus Permanen
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

function Info({ label, value, full }: { label: string; value: string; full?: boolean }) {
  return (
    <div className={full ? "sm:col-span-2" : undefined}>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  );
}

/* ----------------- PENGATURAN ----------------- */
type PasswordFieldName = "current" | "next" | "confirm";

function AdminPasswordField({
  field,
  label,
  value,
  visible,
  onChange,
  onToggleVisibility,
}: {
  field: PasswordFieldName;
  label: string;
  value: string;
  visible: boolean;
  onChange: (value: string) => void;
  onToggleVisibility: () => void;
}) {
  return (
    <div>
      <Label>{label}</Label>
      <div className="relative mt-1">
        <Input
          type={visible ? "text" : "password"}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          autoComplete={field === "current" ? "current-password" : "new-password"}
          className="pr-10"
        />
        <button
          type="button"
          aria-label={visible ? `Sembunyikan ${label}` : `Tampilkan ${label}`}
          onClick={onToggleVisibility}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
        >
          {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
}

function PengaturanSection() {
  const session = useSession();
  const { theme, setTheme } = useTheme();
  const [tab, setTab] = useState("profil");
  const [name, setName] = useState(session?.name ?? "");
  const [phone, setPhone] = useState(session?.phone ?? "");
  const [timezone, setTimezone] = useState(() =>
    typeof window !== "undefined"
      ? (localStorage.getItem("buzzhub.admin.timezone") ?? "Asia/Jakarta")
      : "Asia/Jakarta",
  );
  const [saving, setSaving] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwords, setPasswords] = useState({ current: "", next: "", confirm: "" });
  const [visible, setVisible] = useState({ current: false, next: false, confirm: false });

  useEffect(() => {
    if (session) {
      setName(session.name);
      setPhone(session.phone?.replace(/\D/g, "") ?? "");
    }
  }, [session]);

  const initials = (session?.name ?? "A")
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const saveProfile = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!session || !name.trim()) return toast.error("Nama lengkap wajib diisi.");
    setSaving(true);
    try {
      const result = await updateAccountFn({
        data: { email: session.email, name, phone, timezone },
      });
      if (!result.ok) return toast.error(result.message);
      setSession({ ...session, name: name.trim(), phone: phone.trim() });
      localStorage.setItem("buzzhub.admin.timezone", timezone);
      toast.success("Perubahan berhasil disimpan");
    } catch {
      toast.error("Gagal menyimpan perubahan");
    } finally {
      setSaving(false);
    }
  };

  const savePassword = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!session) return;
    if (passwords.next.length < 8) return toast.error("Password baru minimal 8 karakter.");
    if (passwords.next !== passwords.confirm)
      return toast.error("Konfirmasi password belum sesuai.");
    setPasswordSaving(true);
    try {
      const result = await updateAccountFn({
        data: {
          email: session.email,
          name: session.name,
          currentPassword: passwords.current,
          newPassword: passwords.next,
        },
      });
      if (!result.ok) return toast.error(result.message);
      setPasswords({ current: "", next: "", confirm: "" });
      toast.success("Password berhasil diperbarui");
    } catch {
      toast.error("Gagal menyimpan password");
    } finally {
      setPasswordSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Peran Akun"
          value="Super Admin"
          hint="Hak akses penuh sistem"
          icon={<ShieldCheck className="h-5 w-5" />}
        />
        <StatCard
          label="Email Terdaftar"
          value={session?.email || "admin@buzzhub.id"}
          hint="Akun terautentikasi"
          icon={<Mail className="h-5 w-5" />}
        />
        <StatCard
          label="Zona Waktu"
          value={timezone}
          hint="Operasional aplikasi"
          icon={<Globe2 className="h-5 w-5" />}
        />
        <StatCard
          label="Tema Tampilan"
          value={theme === "dark" ? "Dark Mode" : "Light Mode"}
          hint="Preferensi antarmuka"
          icon={<Palette className="h-5 w-5" />}
        />
      </div>

      <Tabs value={tab} onValueChange={setTab} className="space-y-4">
        <TabsList className="flex w-full justify-start gap-1 overflow-x-auto rounded-xl p-1 sm:grid sm:grid-cols-3">
          <TabsTrigger value="profil">Profil</TabsTrigger>
          <TabsTrigger value="keamanan">Keamanan</TabsTrigger>
          <TabsTrigger value="preferensi">Preferensi Sistem</TabsTrigger>
        </TabsList>

      <TabsContent value="profil">
        <form
          onSubmit={saveProfile}
          className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6"
        >
          <div className="flex items-center gap-4 border-b border-border pb-5">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="gradient-brand text-brand-foreground">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-display text-lg font-bold">{session?.name || "Memuat profil"}</p>
              <p className="text-sm text-muted-foreground">Super Administrator</p>
            </div>
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div>
              <Label>Nama Lengkap</Label>
              <Input value={name} onChange={(event) => setName(event.target.value)} />
            </div>
            <div>
              <Label>Email</Label>
              <Input value={session?.email ?? ""} readOnly className="bg-muted/40" />
            </div>
            <div>
              <Label>No. WhatsApp</Label>
              <Input inputMode="numeric" pattern="[0-9]*" value={phone} onChange={(event) => setPhone(event.target.value.replace(/\D/g, ""))} />
            </div>
            <div>
              <Label>Zona Waktu</Label>
              <Select value={timezone} onValueChange={setTimezone}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Asia/Jakarta">WIB (UTC+7)</SelectItem>
                  <SelectItem value="Asia/Makassar">WITA (UTC+8)</SelectItem>
                  <SelectItem value="Asia/Jayapura">WIT (UTC+9)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <Button
              type="submit"
              disabled={saving}
              className="gradient-brand text-brand-foreground"
            >
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Save className="mr-2 h-4 w-4" /> Simpan Perubahan
            </Button>
          </div>
        </form>
      </TabsContent>


      <TabsContent value="keamanan">
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
              <ShieldCheck className="h-5 w-5 text-emerald-500" />
              <p className="mt-3 text-sm text-muted-foreground">Status keamanan akun</p>
              <p className="font-semibold">Password aktif</p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
              <Mail className="h-5 w-5 text-primary" />
              <p className="mt-3 text-sm text-muted-foreground">Verifikasi email</p>
              <p className="font-semibold">Belum tersedia</p>
            </div>
          </div>
          <form
            onSubmit={savePassword}
            className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6"
          >
            <div className="flex items-center gap-2 font-semibold">
              <KeyRound className="h-4 w-4" /> Ganti Password
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              Password disimpan sebagai hash dan tidak pernah ditampilkan.
            </p>
            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              <AdminPasswordField
                field="current"
                label="Password Lama"
                value={passwords.current}
                visible={visible.current}
                onChange={(value) => setPasswords((current) => ({ ...current, current: value }))}
                onToggleVisibility={() =>
                  setVisible((current) => ({ ...current, current: !current.current }))
                }
              />
              <AdminPasswordField
                field="next"
                label="Password Baru"
                value={passwords.next}
                visible={visible.next}
                onChange={(value) => setPasswords((current) => ({ ...current, next: value }))}
                onToggleVisibility={() =>
                  setVisible((current) => ({ ...current, next: !current.next }))
                }
              />
              <AdminPasswordField
                field="confirm"
                label="Konfirmasi Password Baru"
                value={passwords.confirm}
                visible={visible.confirm}
                onChange={(value) => setPasswords((current) => ({ ...current, confirm: value }))}
                onToggleVisibility={() =>
                  setVisible((current) => ({ ...current, confirm: !current.confirm }))
                }
              />
            </div>
            <div className="mt-5 flex justify-end">
              <Button disabled={passwordSaving} className="gradient-brand text-brand-foreground">
                {passwordSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Simpan
                Password
              </Button>
            </div>
          </form>
        </div>
      </TabsContent>

      <TabsContent value="preferensi">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            localStorage.setItem("buzzhub.admin.timezone", timezone);
            toast.success("Perubahan berhasil disimpan");
          }}
          className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6"
        >
          <div className="flex items-center gap-3 border-b border-border pb-5">
            <Palette className="h-5 w-5 text-primary" />
            <div>
              <p className="font-semibold">Preferensi BuzzHub</p>
              <p className="text-sm text-muted-foreground">
                Konfigurasi tampilan dan format yang digunakan dashboard.
              </p>
            </div>
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div>
              <Label>Nama aplikasi</Label>
              <Input value="BuzzHub" readOnly />
            </div>
            <div>
              <Label>Mata uang</Label>
              <Select value="IDR" disabled>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="IDR">IDR (Rupiah)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Zona waktu</Label>
              <Select value={timezone} onValueChange={setTimezone}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Asia/Jakarta">WIB (UTC+7)</SelectItem>
                  <SelectItem value="Asia/Makassar">WITA (UTC+8)</SelectItem>
                  <SelectItem value="Asia/Jayapura">WIT (UTC+9)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Bahasa</Label>
              <Select value="id" disabled>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="id">Indonesia</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Tema tampilan</Label>
              <Select value={theme} onValueChange={(value) => setTheme(value as "light" | "dark")}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dark">Dark mode</SelectItem>
                  <SelectItem value="light">Light mode</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <Button className="gradient-brand text-brand-foreground">
              <Save className="mr-2 h-4 w-4" /> Simpan Preferensi
            </Button>
          </div>
        </form>
      </TabsContent>
    </Tabs>
    </div>
  );
}

/* ----------------- VERIFIKASI BUZZER ----------------- */


function VerifikasiSection({ mode = "accounts" }: { mode?: "accounts" | "jobs" }) {
  const apps = useBuzzerApplications();
  const { data: rawJobs, refetch: refetchJobs } = useCampaignJobs();
  const { data: rawCompletedJobs, refetch: refetchCompletedJobs } = useCompletedCampaignJobs();
  const assignedLevels = useAssignedLevels();
  const levels = useBuzzerLevels();
  const {
    data: submissions,
    loading: submissionsLoading,
    error: submissionsError,
    refetch: refetchSubmissions,
  } = useCampaignJobSubmissions();
  const session = useSession();
  const [filter, setFilter] = useState<"pending" | "approved" | "rejected" | "semua">("semua");
  const [detail, setDetail] = useState<BuzzerApplication | null>(null);
  const [rejectFor, setRejectFor] = useState<BuzzerApplication | null>(null);
  const [note, setNote] = useState("");
  const [jobDetail, setJobDetail] = useState<CampaignJob | null>(null);
  const [jobNote, setJobNote] = useState("");
  const [rejectJobFor, setRejectJobFor] = useState<CampaignJob | null>(null);
  const [jobRejectReason, setJobRejectReason] = useState("");
  const [jobFilter, setJobFilter] = useState<"pending" | "approved" | "rejected" | "semua">("semua");
  const [approveBuzzerFor, setApproveBuzzerFor] = useState<BuzzerApplication | null>(null);
  const [approveJobFor, setApproveJobFor] = useState<CampaignJob | null>(null);
  const [busyJobId, setBusyJobId] = useState<string | null>(null);
  const [busyAppId, setBusyAppId] = useState<string | null>(null);
  const [buzzerAvatars, setBuzzerAvatars] = useState<Map<string, string>>(new Map());

  // Optimistic Job updates state for immediate real-time UI without page refresh
  type OptimisticJobUpdate = {
    status?: string;
    admin_verified_at?: string | null;
    note?: string | null;
    rejection_reason?: string | null;
    deleted?: boolean;
  };
  const [optimisticJobUpdates, setOptimisticJobUpdates] = useState<Map<string, OptimisticJobUpdate>>(new Map());

  // Auto clean up optimistic updates as raw database data catches up
  useEffect(() => {
    if (optimisticJobUpdates.size === 0) return;
    setOptimisticJobUpdates((prev) => {
      let changed = false;
      const next = new Map(prev);
      for (const [id, opt] of prev.entries()) {
        const found = rawJobs.find((j) => j.id === id);
        if (opt.deleted) {
          if (!found) {
            next.delete(id);
            changed = true;
          }
        } else if (found) {
          const statusMatch = !opt.status || found.status === opt.status;
          const verifiedMatch =
            opt.admin_verified_at === undefined ||
            Boolean(found.admin_verified_at) === Boolean(opt.admin_verified_at);
          if (statusMatch && verifiedMatch) {
            next.delete(id);
            changed = true;
          }
        }
      }
      return changed ? next : prev;
    });
  }, [rawJobs, rawCompletedJobs]);

  const effectiveJobs = useMemo(() => {
    return rawJobs
      .filter((j) => {
        const opt = optimisticJobUpdates.get(j.id);
        return !opt?.deleted;
      })
      .map((j) => {
        const opt = optimisticJobUpdates.get(j.id);
        if (!opt) return j;
        return {
          ...j,
          status: (opt.status ?? j.status) as any,
          admin_verified_at: opt.admin_verified_at !== undefined ? opt.admin_verified_at : j.admin_verified_at,
          note: opt.note !== undefined ? opt.note : j.note,
          rejection_reason: opt.rejection_reason !== undefined ? opt.rejection_reason : j.rejection_reason,
        };
      });
  }, [rawJobs, optimisticJobUpdates]);

  const effectiveCompletedJobs = useMemo(() => {
    const list: CampaignJob[] = [];
    const addedIds = new Set<string>();

    for (const j of rawCompletedJobs) {
      const opt = optimisticJobUpdates.get(j.id);
      if (opt?.deleted) continue;
      if (opt && opt.status && opt.status !== "Selesai" && !opt.admin_verified_at) continue;
      const merged = opt
        ? {
            ...j,
            status: (opt.status ?? j.status) as any,
            admin_verified_at: opt.admin_verified_at !== undefined ? opt.admin_verified_at : j.admin_verified_at,
            note: opt.note !== undefined ? opt.note : j.note,
            rejection_reason: opt.rejection_reason !== undefined ? opt.rejection_reason : j.rejection_reason,
          }
        : j;
      list.push(merged);
      addedIds.add(j.id);
    }

    for (const j of effectiveJobs) {
      if ((j.status === "Selesai" || Boolean(j.admin_verified_at)) && !addedIds.has(j.id)) {
        list.unshift(j);
        addedIds.add(j.id);
      }
    }

    return list;
  }, [rawCompletedJobs, effectiveJobs, optimisticJobUpdates]);

  const jobs = effectiveJobs;
  const completedJobs = effectiveCompletedJobs;

  // Edit & Delete Buzzer state
  const [editBuzzer, setEditBuzzer] = useState<BuzzerApplication | null>(null);
  const [editBuzzerForm, setEditBuzzerForm] = useState({
    name: "",
    username: "",
    platform: "Instagram",
    category: "",
    followers: 0,
    phone: "",
    city: "",
    bio: "",
    reviewNote: "",
  });
  const [deleteBuzzer, setDeleteBuzzer] = useState<BuzzerApplication | null>(null);
  const [isSavingBuzzer, setIsSavingBuzzer] = useState(false);
  const [isDeletingBuzzer, setIsDeletingBuzzer] = useState(false);

  // Edit & Delete Job state
  const [editJob, setEditJob] = useState<CampaignJob | null>(null);
  const [editJobForm, setEditJobForm] = useState<{
    status: string;
    note: string;
    rejectionReason: string;
  }>({
    status: "Selesai",
    note: "",
    rejectionReason: "",
  });
  const [deleteJob, setDeleteJob] = useState<CampaignJob | null>(null);
  const [isSavingJob, setIsSavingJob] = useState(false);
  const [isDeletingJob, setIsDeletingJob] = useState(false);

  useEffect(() => {
    let active = true;
    void supabase
      .from("app_accounts")
      .select("email, avatar_url")
      .eq("role", "buzzer")
      .then(({ data }) => {
        if (active && data) {
          const map = new Map<string, string>();
          for (const item of data) {
            if (item.avatar_url) map.set(item.email.trim().toLowerCase(), item.avatar_url);
          }
          setBuzzerAvatars(map);
        }
      });
    return () => {
      active = false;
    };
  }, []);

  const counts = useMemo(
    () => ({
      pending: apps.filter((a) => a.status === "pending").length,
      approved: apps.filter((a) => a.status === "approved").length,
      rejected: apps.filter((a) => a.status === "rejected").length,
      semua: apps.length,
    }),
    [apps],
  );

  const list = useMemo(
    () => (filter === "semua" ? apps : apps.filter((a) => a.status === filter)),
    [apps, filter],
  );

  const [accountPage, setAccountPage] = useState(1);
  const ACCOUNT_PAGE_SIZE = 8;

  useEffect(() => {
    setAccountPage(1);
  }, [filter]);

  const totalAccountPages = Math.max(1, Math.ceil(list.length / ACCOUNT_PAGE_SIZE));
  const safeAccountPage = Math.min(Math.max(1, accountPage), totalAccountPages);
  const paginatedList = useMemo(() => {
    const start = (safeAccountPage - 1) * ACCOUNT_PAGE_SIZE;
    return list.slice(start, start + ACCOUNT_PAGE_SIZE);
  }, [list, safeAccountPage]);

  const pendingJobs = useMemo(
    () => jobs.filter((j) => j.status === "Review" && !j.admin_verified_at),
    [jobs],
  );
  const rejectedJobs = useMemo(
    () => jobs.filter((j) => j.status === "Ditolak" || j.status === "Revisi"),
    [jobs],
  );
  const jobHistory = useMemo(() => {
    if (jobFilter === "pending") return pendingJobs;
    if (jobFilter === "approved") return completedJobs;
    if (jobFilter === "rejected") return rejectedJobs;
    return [...pendingJobs, ...completedJobs, ...rejectedJobs];
  }, [jobFilter, pendingJobs, completedJobs, rejectedJobs]);

  const [jobPage, setJobPage] = useState(1);
  const JOB_PAGE_SIZE = 8;

  useEffect(() => {
    setJobPage(1);
  }, [jobFilter]);

  const totalJobPages = Math.max(1, Math.ceil(jobHistory.length / JOB_PAGE_SIZE));
  const safeJobPage = Math.min(Math.max(1, jobPage), totalJobPages);
  const paginatedJobs = useMemo(() => {
    const start = (safeJobPage - 1) * JOB_PAGE_SIZE;
    return jobHistory.slice(start, start + JOB_PAGE_SIZE);
  }, [jobHistory, safeJobPage]);

  const levelBasedSplit = (job: CampaignJob) => {
    const total = Math.max(0, Number(job.gross_price) || 0);
    const assigned = job.buzzer_email ? assignedLevels[job.buzzer_email.trim().toLowerCase()] : undefined;
    const levelName = job.buzzer_level || assigned?.level || null;
    const buzzerPct = getBuzzerPercentageForLevel(levelName);
    const buzzerShare = Math.round((total * buzzerPct) / 100);
    const adminShare = Math.max(0, total - buzzerShare);
    return {
      total,
      buzzerPercent: buzzerPct,
      adminPercent: 100 - buzzerPct,
      buzzerShare,
      adminShare,
      levelName,
    };
  };

  const approve = async (a: BuzzerApplication) => {
    setBusyAppId(a.id);
    try {
      await approveApplication(a.id, "Disetujui admin");
      toast.success(`${a.name} berhasil diverifikasi. Buzzer sudah bisa login.`);
      setDetail(null);
      setApproveBuzzerFor(null);
    } catch {
      toast.error("Gagal menyetujui pendaftaran buzzer");
    } finally {
      setBusyAppId(null);
    }
  };

  const approveJob = async (job: CampaignJob, note?: string) => {
    if (!job.buzzer_email) {
      toast.error("Pekerjaan ini belum ditugaskan ke buzzer tertentu.");
      return;
    }

    setBusyJobId(job.id);
    const prevUpdate = optimisticJobUpdates.get(job.id);
    const now = new Date().toISOString();
    const resolvedNote = note?.trim() || "Diverifikasi admin, menunggu ulasan customer";

    // Instant optimistic update: row immediately disappears from "Menunggu" and moves to "Disetujui"
    setOptimisticJobUpdates((prev) => {
      const next = new Map(prev);
      next.set(job.id, {
        status: "Review",
        admin_verified_at: now,
        note: resolvedNote,
      });
      return next;
    });

    try {
      const split = levelBasedSplit(job);
      const targetStatus = "Review";
      await reviewCampaignJob(
        job.id,
        targetStatus,
        resolvedNote,
      );
      toast.success(
        `${job.campaign_title} disetujui. Buzzer menerima ${formatIDR(split.buzzerShare)} (${split.buzzerPercent}%) dan admin mendapat ${formatIDR(split.adminShare)}`,
      );
      setApproveJobFor(null);
      setJobDetail(null);
      setJobNote("");

      // Force instant background refetch so database is fully in sync
      await Promise.all([
        refetchJobs(),
        refetchCompletedJobs(),
        refetchSubmissions(),
      ]);
    } catch {
      setOptimisticJobUpdates((prev) => {
        const next = new Map(prev);
        if (prevUpdate) {
          next.set(job.id, prevUpdate);
        } else {
          next.delete(job.id);
        }
        return next;
      });
      toast.error("Gagal memverifikasi pekerjaan buzzer");
    } finally {
      setBusyJobId(null);
    }
  };

  const rejectJob = async (job: CampaignJob, reason: string) => {
    setBusyJobId(job.id);
    const prevUpdate = optimisticJobUpdates.get(job.id);
    const cleanReason = reason.trim();

    setOptimisticJobUpdates((prev) => {
      const next = new Map(prev);
      next.set(job.id, {
        status: "Revisi",
        admin_verified_at: null,
        rejection_reason: cleanReason,
        note: cleanReason,
      });
      return next;
    });

    try {
      await rejectCampaignJob(job.id, cleanReason, session?.email ?? "admin");
      toast.success(`Pekerjaan ${job.campaign_title} ditolak.`);
      setRejectJobFor(null);
      setJobRejectReason("");
      setJobDetail(null);

      await Promise.all([
        refetchJobs(),
        refetchCompletedJobs(),
        refetchSubmissions(),
      ]);
    } catch {
      setOptimisticJobUpdates((prev) => {
        const next = new Map(prev);
        if (prevUpdate) {
          next.set(job.id, prevUpdate);
        } else {
          next.delete(job.id);
        }
        return next;
      });
      toast.error("Gagal menolak pekerjaan buzzer");
    } finally {
      setBusyJobId(null);
    }
  };

  const confirmRejectJob = async () => {
    if (!rejectJobFor) return;
    const reason = jobRejectReason.trim();
    if (!reason) {
      toast.error("Alasan penolakan wajib diisi.");
      return;
    }
    await rejectJob(rejectJobFor, reason);
  };

  const doReject = async () => {
    if (!rejectFor) return;
    setBusyAppId(rejectFor.id);
    try {
      await rejectApplication(rejectFor.id, note.trim() || "Tidak memenuhi kriteria");
      toast.success(`Pendaftaran ${rejectFor.name} ditolak.`);
      setRejectFor(null);
      setNote("");
      setDetail(null);
    } catch {
      toast.error("Gagal menolak pendaftaran buzzer");
    } finally {
      setBusyAppId(null);
    }
  };

  const handleOpenEditBuzzer = (a: BuzzerApplication) => {
    setEditBuzzerForm({
      name: a.name || "",
      username: a.username || "",
      platform: a.platform || "Instagram",
      category: a.category || "",
      followers: a.followers || 0,
      phone: a.phone || "",
      city: a.city || "",
      bio: a.bio || "",
      reviewNote: a.reviewNote || "",
    });
    setEditBuzzer(a);
  };

  const handleSaveEditBuzzer = async () => {
    if (!editBuzzer) return;
    if (!editBuzzerForm.name.trim()) {
      toast.error("Nama buzzer wajib diisi.");
      return;
    }
    setIsSavingBuzzer(true);
    try {
      await updateApplication(editBuzzer.id, {
        name: editBuzzerForm.name.trim(),
        username: editBuzzerForm.username.trim(),
        platform: editBuzzerForm.platform as any,
        category: editBuzzerForm.category.trim() || undefined,
        followers: Number(editBuzzerForm.followers) || 0,
        phone: editBuzzerForm.phone.trim() || undefined,
        city: editBuzzerForm.city.trim() || undefined,
        bio: editBuzzerForm.bio.trim() || undefined,
        reviewNote: editBuzzerForm.reviewNote.trim() || undefined,
      });
      toast.success("Data buzzer berhasil diperbarui.");
      setEditBuzzer(null);
      if (detail?.id === editBuzzer.id) {
        setDetail((prev) => prev ? {
          ...prev,
          name: editBuzzerForm.name.trim(),
          username: editBuzzerForm.username.trim(),
          platform: editBuzzerForm.platform as any,
          category: editBuzzerForm.category.trim() || undefined,
          followers: Number(editBuzzerForm.followers) || 0,
          phone: editBuzzerForm.phone.trim() || undefined,
          city: editBuzzerForm.city.trim() || undefined,
          bio: editBuzzerForm.bio.trim() || undefined,
          reviewNote: editBuzzerForm.reviewNote.trim() || undefined,
        } : null);
      }
    } catch (err: any) {
      toast.error("Gagal memperbarui data buzzer: " + (err?.message || "Terjadi kesalahan"));
    } finally {
      setIsSavingBuzzer(false);
    }
  };

  const handleConfirmDeleteBuzzer = async () => {
    if (!deleteBuzzer) return;
    setIsDeletingBuzzer(true);
    try {
      await deleteApplication(deleteBuzzer.id);
      toast.success(`Data pendaftaran buzzer ${deleteBuzzer.name} berhasil dihapus.`);
      setDeleteBuzzer(null);
      if (detail?.id === deleteBuzzer.id) setDetail(null);
    } catch (err: any) {
      toast.error("Gagal menghapus pendaftaran buzzer: " + (err?.message || "Terjadi kesalahan"));
    } finally {
      setIsDeletingBuzzer(false);
    }
  };

  const handleOpenEditJob = (job: CampaignJob) => {
    setEditJobForm({
      status: job.status || "Selesai",
      note: job.note || "",
      rejectionReason: job.rejection_reason || "",
    });
    setEditJob(job);
  };

  const handleSaveEditJob = async () => {
    if (!editJob) return;
    setIsSavingJob(true);
    const targetStatus = editJobForm.status;
    const targetNote = editJobForm.note.trim() || null;
    const targetReason = editJobForm.rejectionReason.trim() || null;
    const prevUpdate = optimisticJobUpdates.get(editJob.id);

    setOptimisticJobUpdates((prev) => {
      const next = new Map(prev);
      next.set(editJob.id, {
        status: targetStatus,
        admin_verified_at:
          targetStatus === "Selesai"
            ? editJob.admin_verified_at || new Date().toISOString()
            : targetStatus === "Review"
              ? editJob.admin_verified_at
              : null,
        note: targetNote,
        rejection_reason: targetReason,
      });
      return next;
    });

    try {
      await updateCampaignJob(editJob.id, {
        status: targetStatus as any,
        note: targetNote,
        rejection_reason: targetReason,
        ...(targetStatus === "Selesai" && !editJob.admin_verified_at
          ? { admin_verified_at: new Date().toISOString() }
          : {}),
      });
      toast.success("Verifikasi pengerjaan berhasil diperbarui.");
      const updatedJob = editJob;
      setEditJob(null);
      if (jobDetail?.id === updatedJob.id) {
        setJobDetail((prev) =>
          prev
            ? {
                ...prev,
                status: targetStatus as any,
                note: targetNote,
                rejection_reason: targetReason,
              }
            : null,
        );
      }
      await Promise.all([
        refetchJobs(),
        refetchCompletedJobs(),
        refetchSubmissions(),
      ]);
    } catch (err: any) {
      setOptimisticJobUpdates((prev) => {
        const next = new Map(prev);
        if (prevUpdate) {
          next.set(editJob.id, prevUpdate);
        } else {
          next.delete(editJob.id);
        }
        return next;
      });
      toast.error("Gagal memperbarui pengerjaan: " + (err?.message || "Terjadi kesalahan"));
    } finally {
      setIsSavingJob(false);
    }
  };

  const handleConfirmDeleteJob = async () => {
    if (!deleteJob) return;
    setIsDeletingJob(true);
    const prevUpdate = optimisticJobUpdates.get(deleteJob.id);

    setOptimisticJobUpdates((prev) => {
      const next = new Map(prev);
      next.set(deleteJob.id, {
        deleted: true,
      });
      return next;
    });

    try {
      await deleteCampaignJob(deleteJob.id);
      toast.success(`Riwayat pengerjaan ${deleteJob.campaign_title} berhasil dihapus.`);
      const deletedId = deleteJob.id;
      setDeleteJob(null);
      if (jobDetail?.id === deletedId) setJobDetail(null);
      await Promise.all([
        refetchJobs(),
        refetchCompletedJobs(),
        refetchSubmissions(),
      ]);
    } catch (err: any) {
      setOptimisticJobUpdates((prev) => {
        const next = new Map(prev);
        if (prevUpdate) {
          next.set(deleteJob.id, prevUpdate);
        } else {
          next.delete(deleteJob.id);
        }
        return next;
      });
      toast.error("Gagal menghapus riwayat pengerjaan: " + (err?.message || "Terjadi kesalahan"));
    } finally {
      setIsDeletingJob(false);
    }
  };

  const statusPill = (s: BuzzerAppStatus) => {
    const map: Record<BuzzerAppStatus, string> = {
      pending: "bg-amber-100 text-amber-700",
      approved: "bg-emerald-100 text-emerald-700",
      rejected: "bg-red-100 text-red-700",
    };
    const label: Record<BuzzerAppStatus, string> = {
      pending: "Menunggu",
      approved: "Disetujui",
      rejected: "Ditolak",
    };
    return (
      <span className={cn("rounded-full px-2 py-0.5 text-xs font-semibold", map[s])}>
        {label[s]}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {mode === "accounts" && <>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Menunggu"
          value={counts.pending.toString()}
          hint="Perlu tindakan admin"
          icon={<Shield className="h-5 w-5" />}
        />
        <StatCard
          label="Disetujui"
          value={counts.approved.toString()}
          hint="Total buzzer terverifikasi"
          icon={<CheckCircle2 className="h-5 w-5" />}
        />
        <StatCard
          label="Ditolak"
          value={counts.rejected.toString()}
          hint="Tidak lolos verifikasi"
          icon={<XCircle className="h-5 w-5" />}
        />
        <StatCard
          label="Total Pendaftar"
          value={counts.semua.toString()}
          hint="Sepanjang waktu"
          icon={<Users className="h-5 w-5" />}
        />
      </div>

      <div className="rounded-2xl border border-border bg-card shadow-sm">
        <div className="flex flex-wrap items-center gap-2 border-b border-border p-4">
          <Filter className="h-4 w-4 text-muted-foreground" />
          {(["semua", "pending", "approved", "rejected"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={cn(
                "rounded-full border px-3 py-1 text-xs font-medium capitalize",
                filter === s
                  ? "border-transparent gradient-brand text-brand-foreground"
                  : "border-border text-muted-foreground hover:bg-muted",
              )}
            >
              {s === "semua"
                ? "Semua"
                : s === "pending"
                  ? "Menunggu"
                  : s === "approved"
                    ? "Disetujui"
                    : "Ditolak"}
              <span className="ml-1 opacity-70">({counts[s]})</span>
            </button>
          ))}
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama & Email</TableHead>
                <TableHead>Platform</TableHead>
                <TableHead>Followers</TableHead>
                <TableHead>Dikirim</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedList.map((a) => (
                <TableRow
                  key={a.id}
                  className="cursor-pointer hover:bg-muted/40"
                  onClick={() => setDetail(a)}
                >
                  <TableCell>
                    <p className="font-medium">{a.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {a.email} · {a.username}
                    </p>

                  </TableCell>
                  <TableCell className="text-sm">{a.platform}</TableCell>
                  <TableCell className="text-sm">{a.followers.toLocaleString("id-ID")}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {new Date(a.submittedAt).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </TableCell>
                  <TableCell>{statusPill(a.status)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                      {a.status === "pending" ? (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 w-8 p-0 text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/20"
                            disabled={busyAppId === a.id}
                            onClick={() => setRejectFor(a)}
                            title="Tolak Pendaftaran"
                            aria-label="Tolak"
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            className="h-8 w-8 p-0 gradient-brand text-brand-foreground"
                            disabled={busyAppId === a.id}
                            onClick={() => setApproveBuzzerFor(a)}
                            title="Setujui Pendaftaran"
                            aria-label="Setujui"
                          >
                            {busyAppId === a.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <CheckCircle2 className="h-4 w-4" />
                            )}
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button size="sm" variant="outline" className="h-8 w-8 p-0" title="Detail" aria-label="Detail" onClick={() => setDetail(a)}>
                            <Eye className="h-3.5 w-3.5" />
                          </Button>
                          {a.status === "approved" && (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-8 w-8 p-0 text-primary hover:bg-primary/10"
                                onClick={() => handleOpenEditBuzzer(a)}
                                title="Edit"
                                aria-label="Edit"
                              >
                                <Pencil className="h-3.5 w-3.5" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-8 w-8 p-0 text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/20"
                                onClick={() => setDeleteBuzzer(a)}
                                title="Hapus"
                                aria-label="Hapus"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </>
                          )}
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {list.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="py-10 text-center text-sm text-muted-foreground"
                  >
                    Tidak ada pendaftaran pada kategori ini.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <TablePagination
          currentPage={safeAccountPage}
          totalItems={list.length}
          pageSize={ACCOUNT_PAGE_SIZE}
          onPageChange={setAccountPage}
        />
      </div>
      </>}

      {mode === "jobs" && <>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Menunggu Review"
          value={pendingJobs.length.toString()}
          hint="Perlu verifikasi admin"
          icon={<Shield className="h-5 w-5" />}
        />
        <StatCard
          label="Pekerjaan Disetujui"
          value={completedJobs.length.toString()}
          hint="Verifikasi selesai & payout"
          icon={<CheckCircle2 className="h-5 w-5" />}
        />
        <StatCard
          label="Pekerjaan Ditolak"
          value={rejectedJobs.length.toString()}
          hint="Tidak memenuhi syarat"
          icon={<XCircle className="h-5 w-5" />}
        />
        <StatCard
          label="Total Pengerjaan"
          value={(pendingJobs.length + completedJobs.length + rejectedJobs.length).toString()}
          hint="Semua riwayat pekerjaan"
          icon={<Briefcase className="h-5 w-5" />}
        />
      </div>

      <div className="rounded-2xl border border-border bg-card shadow-sm">
        <div className="flex flex-wrap items-center gap-2 border-b border-border p-4">
          <Filter className="h-4 w-4 text-muted-foreground" />
          {([
            ["semua", "Semua", pendingJobs.length + completedJobs.length + rejectedJobs.length],
            ["pending", "Menunggu", pendingJobs.length],
            ["approved", "Disetujui", completedJobs.length],
            ["rejected", "Ditolak", rejectedJobs.length],
          ] as const).map(([value, label, count]) => (
            <button
              key={value}
              type="button"
              onClick={() => setJobFilter(value)}
              className={cn(
                "rounded-full border px-3 py-1 text-xs font-medium",
                jobFilter === value
                  ? "border-transparent gradient-brand text-brand-foreground"
                  : "border-border text-muted-foreground hover:bg-muted",
              )}
            >
              {label} <span className="ml-1 opacity-70">({count})</span>
            </button>
          ))}
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Campaign</TableHead>
                <TableHead>Buzzer</TableHead>
                <TableHead>Payout</TableHead>
                <TableHead>Split</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {jobHistory.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="py-8 text-center text-sm text-muted-foreground">
                    {jobFilter === "pending" ? "Belum ada pekerjaan yang menunggu verifikasi." : "Belum ada riwayat pengerjaan pada kategori ini."}
                  </TableCell>
                </TableRow>
              )}
              {paginatedJobs.map((job) => {
                const split = levelBasedSplit(job);
                const isPending = job.status === "Review" && !job.admin_verified_at;
                const displayStatus = (job.status === "Review" && job.admin_verified_at) || job.status === "Selesai"
                  ? "Selesai"
                  : job.status === "Ditolak"
                    ? "Ditolak"
                    : job.status === "Revisi"
                      ? "Revisi"
                      : job.status;
                return (
                  <TableRow key={job.id}>
                    <TableCell>
                      <p className="font-medium">{job.campaign_title}</p>
                      <p className="text-xs text-muted-foreground">{job.platform}</p>
                    </TableCell>
                    <TableCell>
                      <p className="font-medium">{job.buzzer_name || "—"}</p>
                      <p className="text-xs text-muted-foreground">
                        {job.buzzer_email || "Belum ditugaskan"}
                      </p>
                    </TableCell>
                    <TableCell className="font-semibold">{formatIDR(split.total)}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      <div>Level: {split.levelName || "-"} ({split.buzzerPercent}%)</div>
                      <div>
                        Buzzer: {formatIDR(split.buzzerShare)}
                      </div>
                      <div>
                        Admin: {formatIDR(split.adminShare)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={displayStatus} />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="outline" className="h-8 w-8 p-0" title="Detail" aria-label="Detail" onClick={() => setJobDetail(job)}>
                          <Eye className="h-3.5 w-3.5" />
                        </Button>
                        {isPending && <>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 w-8 p-0 text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/20"
                            disabled={busyJobId === job.id}
                            onClick={() => {
                              setRejectJobFor(job);
                              setJobRejectReason("");
                            }}
                            title="Tolak Pekerjaan"
                            aria-label="Tolak"
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            className="h-8 w-8 p-0 gradient-brand text-brand-foreground"
                            disabled={busyJobId === job.id}
                            onClick={() => setApproveJobFor(job)}
                            title="Setujui Pekerjaan"
                            aria-label="Setujui"
                          >
                            {busyJobId === job.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                          </Button>
                        </>}
                        {!isPending && (job.status === "Selesai" || Boolean(job.admin_verified_at) || job.status === "Ditolak" || job.status === "Revisi") && <>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 w-8 p-0 text-primary hover:bg-primary/10"
                            onClick={() => handleOpenEditJob(job)}
                            title="Edit"
                            aria-label="Edit"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 w-8 p-0 text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/20"
                            onClick={() => setDeleteJob(job)}
                            title="Hapus"
                            aria-label="Hapus"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </>}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
        <TablePagination
          currentPage={safeJobPage}
          totalItems={jobHistory.length}
          pageSize={JOB_PAGE_SIZE}
          onPageChange={setJobPage}
        />
      </div>

      <Dialog open={!!jobDetail} onOpenChange={(o) => { if (!o) { setJobDetail(null); setJobNote(""); } }}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col p-0 gap-0 overflow-hidden sm:rounded-2xl shadow-2xl">
          {jobDetail && (
            <>
              <DialogHeader className="p-5 pb-4 pr-12 border-b border-border shrink-0">
                <DialogTitle className="text-lg font-bold">Hasil Pengerjaan &amp; Bukti Buzzer</DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                  Periksa ringkasan pengerjaan, bukti tugas, dan ulasan sebelum diverifikasi.
                </DialogDescription>
              </DialogHeader>

              <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4 text-sm">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl border border-border p-3.5 bg-muted/20">
                    <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Campaign</p>
                    <p className="font-semibold text-foreground text-sm mt-0.5">{jobDetail.campaign_title}</p>
                    <p className="text-xs text-muted-foreground">{jobDetail.platform}</p>
                  </div>
                  <div className="rounded-xl border border-border p-3.5 bg-muted/20">
                    <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Buzzer</p>
                    <p className="font-semibold text-foreground text-sm mt-0.5">{jobDetail.buzzer_name || "—"}</p>
                    <p className="text-xs text-muted-foreground">{jobDetail.buzzer_email || "—"}</p>
                  </div>
                </div>

                <div className="rounded-xl border border-border p-3.5 bg-muted/10 space-y-1">
                  <p className="text-xs font-semibold text-muted-foreground">Deskripsi hasil pekerjaan</p>
                  <p className="whitespace-pre-wrap leading-relaxed text-sm text-foreground">
                    {jobDetail.brief || "Tidak ada deskripsi hasil pekerjaan."}
                  </p>
                </div>

                <div className="rounded-xl border border-border p-3.5 space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Riwayat Pengerjaan
                  </p>
                  {submissionsLoading ? (
                    <p className="text-xs text-muted-foreground">Memuat riwayat pengerjaan...</p>
                  ) : submissionsError ? (
                    <div className="flex items-center justify-between gap-3 rounded-lg bg-rose-50 p-3 text-xs text-rose-700">
                      <span>Gagal memuat riwayat: {submissionsError}</span>
                      <Button size="sm" variant="outline" onClick={() => void refetchSubmissions()}>
                        Coba lagi
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {submissions
                        .filter((submission) => submission.job_id === jobDetail.id)
                        .sort((a, b) => b.submission_number - a.submission_number)
                        .map((submission) => (
                          <div key={submission.id} className="rounded-lg bg-muted/40 p-3 text-xs">
                            <div className="flex items-center justify-between gap-2">
                              <span className="font-semibold">
                                Submission #{submission.submission_number}
                              </span>
                              <StatusBadge
                                status={
                                  submission.status === "Ditolak"
                                    ? "Ditolak"
                                    : submission.status === "Selesai"
                                      ? "Selesai"
                                      : "Review"
                                }
                              />
                            </div>
                            <p className="mt-1 text-muted-foreground">
                              Tanggal: {new Date(submission.submitted_at).toLocaleString("id-ID")}
                            </p>
                            {submission.rejection_reason && (
                              <p className="mt-1 text-rose-700">
                                Alasan: {submission.rejection_reason}
                              </p>
                            )}
                          </div>
                        ))}
                      {submissions.filter((submission) => submission.job_id === jobDetail.id)
                        .length === 0 && (
                        <p className="text-xs text-muted-foreground">
                          Belum ada riwayat submission.
                        </p>
                      )}
                    </div>
                  )}
                </div>

                <div className="rounded-xl border border-border p-3.5 space-y-2">
                  <p className="text-xs font-semibold text-muted-foreground">Bukti pengerjaan</p>
                  {jobDetail.proof_url ? (
                    <ProofLink value={jobDetail.proof_url} />
                  ) : (
                    <p className="text-xs text-muted-foreground">Belum ada bukti upload dari buzzer.</p>
                  )}
                </div>

                <div className="rounded-xl border border-border p-3.5 space-y-2">
                  <p className="text-xs font-semibold text-muted-foreground">Catatan admin / review</p>
                  <Textarea
                    value={jobNote}
                    onChange={(e) => setJobNote(e.target.value)}
                    placeholder={jobDetail.note || "Tulis catatan review untuk buzzer..."}
                    className="min-h-[85px] resize-none text-sm"
                  />
                  {jobDetail.note && (
                    <p className="text-xs text-muted-foreground">
                      Catatan sebelumnya: {jobDetail.note}
                    </p>
                  )}
                </div>
              </div>

              <DialogFooter className="p-4 sm:p-5 border-t border-border bg-card/95 backdrop-blur shrink-0 flex items-center justify-end gap-2">
                {(jobDetail.status === "Selesai" || Boolean(jobDetail.admin_verified_at) || jobDetail.status === "Ditolak") ? (
                  <>
                    <Button
                      variant="outline"
                      className="h-9 w-9 p-0 text-primary hover:bg-primary/10"
                      title="Edit"
                      aria-label="Edit"
                      onClick={() => {
                        const tgt = jobDetail;
                        setJobDetail(null);
                        handleOpenEditJob(tgt);
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      className="h-9 w-9 p-0 text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/20"
                      title="Hapus"
                      aria-label="Hapus"
                      onClick={() => {
                        const tgt = jobDetail;
                        setJobDetail(null);
                        setDeleteJob(tgt);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      disabled={busyJobId === jobDetail.id}
                      onClick={() => { setJobDetail(null); setJobNote(""); }}
                    >
                      Tutup
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      disabled={busyJobId === jobDetail.id}
                      onClick={() => { setJobDetail(null); setJobNote(""); }}
                    >
                      Tutup
                    </Button>
                    <Button
                      variant="outline"
                      className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/20"
                      disabled={busyJobId === jobDetail.id}
                      onClick={() => {
                        setRejectJobFor(jobDetail);
                        setJobRejectReason("");
                      }}
                    >
                      Tolak
                    </Button>
                    <Button
                      className="gradient-brand text-brand-foreground gap-1.5"
                      disabled={busyJobId === jobDetail.id}
                      onClick={() => setApproveJobFor(jobDetail)}
                    >
                      {busyJobId === jobDetail.id ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                      Setujui
                    </Button>
                  </>
                )}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!rejectJobFor}
        onOpenChange={(open) => {
          if (!open && !busyJobId) {
            setRejectJobFor(null);
            setJobRejectReason("");
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Tolak Pengerjaan</DialogTitle>
          </DialogHeader>
          {rejectJobFor && (
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-2 rounded-xl border border-border p-3">
                <Info label="Campaign" value={rejectJobFor.campaign_title} />
                <Info label="Buzzer" value={rejectJobFor.buzzer_name || "—"} />
                <Info label="Platform" value={rejectJobFor.platform} />
                <Info label="Payout" value={formatIDR(Number(rejectJobFor.payout))} />
              </div>
              <div>
                <Label>Alasan Penolakan</Label>
                <Textarea
                  value={jobRejectReason}
                  onChange={(event) => setJobRejectReason(event.target.value)}
                  placeholder="Jelaskan kesalahan buzzer dan apa yang harus diperbaiki..."
                  className="mt-2 min-h-[110px]"
                />
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  disabled={busyJobId === rejectJobFor.id}
                  onClick={() => setRejectJobFor(null)}
                >
                  Batal
                </Button>
                <Button
                  variant="destructive"
                  disabled={busyJobId === rejectJobFor.id || !jobRejectReason.trim()}
                  onClick={() => void confirmRejectJob()}
                  className="gap-1.5"
                >
                  {busyJobId === rejectJobFor.id ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Menolak...
                    </>
                  ) : (
                    "Tolak & Minta Perbaikan"
                  )}
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!approveJobFor} onOpenChange={(open) => { if (!open && !busyJobId) setApproveJobFor(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Verifikasi pengerjaan disetujui?</AlertDialogTitle>
            <AlertDialogDescription>
              Pengerjaan {approveJobFor?.campaign_title} akan ditandai selesai dan payout akan diproses.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={busyJobId === approveJobFor?.id}>Tidak</AlertDialogCancel>
            <Button
              className="gradient-brand text-brand-foreground gap-1.5"
              disabled={busyJobId === approveJobFor?.id}
              onClick={() => approveJobFor && void approveJob(approveJobFor, jobNote)}
            >
              {busyJobId === approveJobFor?.id ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Memproses...
                </>
              ) : (
                "Ya, Setujui"
              )}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit Job Dialog */}
      <Dialog open={!!editJob} onOpenChange={(o) => { if (!o && !isSavingJob) setEditJob(null); }}>
        <DialogContent className="sm:max-w-md max-h-[90vh] flex flex-col p-0 gap-0 overflow-hidden sm:rounded-2xl">
          {editJob && (
            <>
              <DialogHeader className="p-5 pb-4 border-b border-border shrink-0">
                <DialogTitle className="text-base font-bold flex items-center gap-2">
                  <Pencil className="h-4 w-4 text-primary" /> Edit Verifikasi Pengerjaan
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                  Sesuaikan status verifikasi atau catatan review admin untuk pengerjaan buzzer ini.
                </DialogDescription>
              </DialogHeader>

              <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs sm:text-sm">
                <div className="rounded-xl border border-border p-3.5 bg-muted/20 space-y-1 text-xs">
                  <p className="font-semibold text-foreground">{editJob.campaign_title}</p>
                  <p className="text-muted-foreground">
                    Buzzer: <span className="text-foreground font-medium">{editJob.buzzer_name || editJob.buzzer_email || "—"}</span> ({editJob.platform})
                  </p>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Status Pengerjaan</Label>
                  <Select
                    value={editJobForm.status}
                    onValueChange={(val) => setEditJobForm((prev) => ({ ...prev, status: val }))}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Pilih status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Selesai">Selesai (Disetujui)</SelectItem>
                      <SelectItem value="Review">Review (Perlu Ditinjau)</SelectItem>
                      <SelectItem value="Revisi">Revisi (Minta Perbaikan)</SelectItem>
                      <SelectItem value="Ditolak">Ditolak</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Catatan Admin / Review</Label>
                  <Textarea
                    value={editJobForm.note}
                    onChange={(e) => setEditJobForm((prev) => ({ ...prev, note: e.target.value }))}
                    placeholder="Tulis catatan atau arahan review..."
                    className="min-h-[90px] resize-none text-xs"
                  />
                </div>

                {(editJobForm.status === "Revisi" || editJobForm.status === "Ditolak") && (
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-rose-600">Alasan Revisi / Penolakan</Label>
                    <Textarea
                      value={editJobForm.rejectionReason}
                      onChange={(e) => setEditJobForm((prev) => ({ ...prev, rejectionReason: e.target.value }))}
                      placeholder="Tulis alasan mengapa pengerjaan diminta revisi atau ditolak..."
                      className="min-h-[80px] resize-none text-xs border-rose-300 dark:border-rose-900"
                    />
                  </div>
                )}
              </div>

              <DialogFooter className="p-4 border-t border-border bg-card/95 backdrop-blur shrink-0 flex items-center justify-end gap-2">
                <Button
                  variant="outline"
                  disabled={isSavingJob}
                  onClick={() => setEditJob(null)}
                >
                  Batal
                </Button>
                <Button
                  className="gradient-brand text-brand-foreground gap-1.5"
                  disabled={isSavingJob}
                  onClick={handleSaveEditJob}
                >
                  {isSavingJob ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  Simpan Perubahan
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Job Confirmation */}
      <AlertDialog open={!!deleteJob} onOpenChange={(open) => { if (!open && !isDeletingJob) setDeleteJob(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-rose-600">
              <Trash2 className="h-5 w-5" /> Hapus Riwayat Pengerjaan?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus data pengerjaan <b>{deleteJob?.campaign_title}</b> oleh buzzer <b>{deleteJob?.buzzer_name || deleteJob?.buzzer_email}</b>?
              <br /><br />
              Tindakan ini akan menghapus riwayat pengerjaan dan bukti terkait secara permanen dari sistem.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeletingJob}>Batal</AlertDialogCancel>
            <Button
              variant="destructive"
              className="gap-1.5"
              disabled={isDeletingJob}
              onClick={handleConfirmDeleteJob}
            >
              {isDeletingJob ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Menghapus...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4" />
                  Ya, Hapus Pengerjaan
                </>
              )}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      </>}

      {mode === "accounts" && <>
      {/* Detail Dialog */}
      <Dialog open={!!detail} onOpenChange={(o) => !o && setDetail(null)}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          {detail && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <Avatar className="h-11 w-11 border border-border">
                    {detail && buzzerAvatars.get(detail.email.trim().toLowerCase()) && (
                      <AvatarImage src={buzzerAvatars.get(detail.email.trim().toLowerCase())!} alt={detail.name} />
                    )}
                    <AvatarFallback className="gradient-brand text-brand-foreground">
                      {detail.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span>{detail.name}</span>
                      {statusPill(detail.status)}
                    </div>
                    <p className="text-xs font-normal text-muted-foreground">{detail.email}</p>
                  </div>
                </DialogTitle>
              </DialogHeader>

              <div className="grid gap-3 rounded-xl border border-border p-4 text-sm sm:grid-cols-2">
                <Info label="Username" value={detail.username} />
                <Info label="Platform" value={detail.platform} />
                <Info label="Kategori Konten" value={detail.category || "—"} />
                <Info label="Followers" value={detail.followers.toLocaleString("id-ID")} />
                <Info label="Telepon" value={detail.phone || "—"} />
                <Info label="Kota" value={detail.city || "—"} />
                <Info
                  label="Dikirim"
                  value={new Date(detail.submittedAt).toLocaleString("id-ID")}
                />
                <Info label="Bio" value={detail.bio || "—"} full />
                {detail.reviewNote && <Info label="Catatan Admin" value={detail.reviewNote} full />}
              </div>

              <DialogFooter className="gap-2">
                {detail.status === "pending" ? (
                  <>
                    <Button
                      variant="outline"
                      disabled={busyAppId === detail.id}
                      onClick={() => setRejectFor(detail)}
                    >
                      <XCircle className="mr-1 h-4 w-4" /> Tolak
                    </Button>
                    <Button
                      className="gradient-brand text-brand-foreground gap-1.5"
                      disabled={busyAppId === detail.id}
                      onClick={() => setApproveBuzzerFor(detail)}
                    >
                      <CheckCircle2 className="mr-1 h-4 w-4" /> Setujui &amp; Aktifkan
                    </Button>
                  </>
                ) : (
                  <>
                    {detail.status === "approved" && (
                      <>
                        <Button
                          variant="outline"
                          className="h-9 w-9 p-0 text-primary hover:bg-primary/10"
                          title="Edit"
                          aria-label="Edit"
                          onClick={() => {
                            const tgt = detail;
                            setDetail(null);
                            handleOpenEditBuzzer(tgt);
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          className="h-9 w-9 p-0 text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/20"
                          title="Hapus"
                          aria-label="Hapus"
                          onClick={() => {
                            const tgt = detail;
                            setDetail(null);
                            setDeleteBuzzer(tgt);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                    <Button variant="outline" onClick={() => setDetail(null)}>
                      Tutup
                    </Button>
                  </>
                )}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!approveBuzzerFor} onOpenChange={(open) => { if (!open && !busyAppId) setApproveBuzzerFor(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Verifikasi buzzer disetujui?</AlertDialogTitle>
            <AlertDialogDescription>
              {approveBuzzerFor?.name} akan ditandai sebagai buzzer terverifikasi dan dapat login.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={busyAppId === approveBuzzerFor?.id}>Tidak</AlertDialogCancel>
            <Button
              className="gradient-brand text-brand-foreground gap-1.5"
              disabled={busyAppId === approveBuzzerFor?.id}
              onClick={() => approveBuzzerFor && void approve(approveBuzzerFor)}
            >
              {busyAppId === approveBuzzerFor?.id ? (
                <>
                  <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                  Memverifikasi...
                </>
              ) : (
                "Ya, Setujui"
              )}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reject Dialog */}
      <Dialog
        open={!!rejectFor}
        onOpenChange={(o) => {
          if (!o && !busyAppId) {
            setRejectFor(null);
            setNote("");
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Tolak Pendaftaran</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Berikan alasan penolakan agar buzzer{" "}
            <b className="text-foreground">{rejectFor?.name}</b> mengerti.
          </p>
          <Textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Contoh: Data followers tidak konsisten dengan profil publik."
            className="min-h-[100px]"
          />
          <DialogFooter>
            <Button
              variant="outline"
              disabled={busyAppId === rejectFor?.id}
              onClick={() => {
                setRejectFor(null);
                setNote("");
              }}
            >
              Batal
            </Button>
            <Button
              variant="destructive"
              disabled={busyAppId === rejectFor?.id}
              onClick={doReject}
              className="gap-1.5"
            >
              {busyAppId === rejectFor?.id ? (
                <>
                  <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                  Menolak...
                </>
              ) : (
                <>
                  <XCircle className="mr-1 h-4 w-4" />
                  Konfirmasi Tolak
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Buzzer Dialog */}
      <Dialog open={!!editBuzzer} onOpenChange={(o) => { if (!o && !isSavingBuzzer) setEditBuzzer(null); }}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] flex flex-col p-0 gap-0 overflow-hidden sm:rounded-2xl">
          {editBuzzer && (
            <>
              <DialogHeader className="p-5 pb-4 border-b border-border shrink-0">
                <DialogTitle className="text-base font-bold flex items-center gap-2">
                  <Pencil className="h-4 w-4 text-primary" /> Edit Data Akun Buzzer
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                  Perbarui identitas, platform, followers, dan profil verifikasi buzzer.
                </DialogDescription>
              </DialogHeader>

              <div className="flex-1 overflow-y-auto p-5 space-y-3.5 text-xs sm:text-sm">
                <div className="rounded-xl border border-border p-3 bg-muted/20 text-xs">
                  <span className="text-muted-foreground">Email Buzzer: </span>
                  <span className="font-semibold text-foreground">{editBuzzer.email}</span>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">Nama Lengkap</Label>
                    <Input
                      value={editBuzzerForm.name}
                      onChange={(e) => setEditBuzzerForm((prev) => ({ ...prev, name: e.target.value }))}
                      placeholder="Nama buzzer"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">Username Akun</Label>
                    <Input
                      value={editBuzzerForm.username}
                      onChange={(e) => setEditBuzzerForm((prev) => ({ ...prev, username: e.target.value }))}
                      placeholder="@username"
                    />
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">Platform Utama</Label>
                    <Select
                      value={editBuzzerForm.platform}
                      onValueChange={(val) => setEditBuzzerForm((prev) => ({ ...prev, platform: val }))}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Pilih platform" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Instagram">Instagram</SelectItem>
                        <SelectItem value="TikTok">TikTok</SelectItem>
                        <SelectItem value="Twitter">Twitter / X</SelectItem>
                        <SelectItem value="YouTube">YouTube</SelectItem>
                        <SelectItem value="Facebook">Facebook</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">Followers</Label>
                    <Input
                      type="number"
                      value={editBuzzerForm.followers}
                      onChange={(e) => setEditBuzzerForm((prev) => ({ ...prev, followers: Number(e.target.value) || 0 }))}
                      placeholder="Jumlah followers"
                    />
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">Kategori Konten</Label>
                    <Input
                      value={editBuzzerForm.category}
                      onChange={(e) => setEditBuzzerForm((prev) => ({ ...prev, category: e.target.value }))}
                      placeholder="Contoh: Lifestyle, Kuliner"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">No. WhatsApp / Telepon</Label>
                    <Input
                      value={editBuzzerForm.phone}
                      onChange={(e) => setEditBuzzerForm((prev) => ({ ...prev, phone: e.target.value }))}
                      placeholder="08xxxxxxxxxx"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Kota Asal / Domisili</Label>
                  <Input
                    value={editBuzzerForm.city}
                    onChange={(e) => setEditBuzzerForm((prev) => ({ ...prev, city: e.target.value }))}
                    placeholder="Contoh: Jakarta Selatan"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Bio / Deskripsi Profil</Label>
                  <Textarea
                    value={editBuzzerForm.bio}
                    onChange={(e) => setEditBuzzerForm((prev) => ({ ...prev, bio: e.target.value }))}
                    placeholder="Tulis ringkasan profil buzzer..."
                    className="min-h-[75px] resize-none text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Catatan Admin</Label>
                  <Textarea
                    value={editBuzzerForm.reviewNote}
                    onChange={(e) => setEditBuzzerForm((prev) => ({ ...prev, reviewNote: e.target.value }))}
                    placeholder="Catatan internal review admin..."
                    className="min-h-[60px] resize-none text-xs"
                  />
                </div>
              </div>

              <DialogFooter className="p-4 border-t border-border bg-card/95 backdrop-blur shrink-0 flex items-center justify-end gap-2">
                <Button
                  variant="outline"
                  disabled={isSavingBuzzer}
                  onClick={() => setEditBuzzer(null)}
                >
                  Batal
                </Button>
                <Button
                  className="gradient-brand text-brand-foreground gap-1.5"
                  disabled={isSavingBuzzer}
                  onClick={handleSaveEditBuzzer}
                >
                  {isSavingBuzzer ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  Simpan Perubahan
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Buzzer Confirmation */}
      <AlertDialog open={!!deleteBuzzer} onOpenChange={(open) => { if (!open && !isDeletingBuzzer) setDeleteBuzzer(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-rose-600">
              <Trash2 className="h-5 w-5" /> Hapus Pendaftaran Buzzer?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus verifikasi buzzer <b>{deleteBuzzer?.name}</b> ({deleteBuzzer?.email})?
              <br /><br />
              Data pendaftaran dan verifikasi akun buzzer ini akan dihapus dari sistem.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeletingBuzzer}>Batal</AlertDialogCancel>
            <Button
              variant="destructive"
              className="gap-1.5"
              disabled={isDeletingBuzzer}
              onClick={handleConfirmDeleteBuzzer}
            >
              {isDeletingBuzzer ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Menghapus...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4" />
                  Ya, Hapus Buzzer
                </>
              )}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      </>}
    </div>
  );
}
