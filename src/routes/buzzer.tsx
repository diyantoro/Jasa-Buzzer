import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  BarChart3,
  Bell,
  Briefcase,
  CheckCircle2,
  Clock,
  DollarSign,
  Edit3,
  Eye,
  LayoutDashboard,
  LogOut,
  Megaphone,
  Menu,
  Search,
  Star,
  Trophy,
  Upload,
  User,
  Wallet,
  Instagram,
  Music2,
  Twitter,
  Facebook,
  Youtube,
  RefreshCw,
  AlertCircle,
  Camera,
  Filter,
  Inbox,
  ChevronLeft,
  ChevronRight,
  Link2,
  FileSpreadsheet,
  FileDown,
  Send,
  Copy,
  ExternalLink,
  Heart,
  MessageCircle,
  Sparkles,
  Share2,
  Users,
  FileText,
  Loader2,
  CalendarDays,
  Settings,
  Plus,
  LifeBuoy,
  BriefcaseBusiness,
  UserRound,
  Receipt,
  TrendingUp,
  ArrowUpRight,
  Banknote,
  PiggyBank,
  ShieldCheck,
  ShieldAlert,
  BellRing,
  Mail,
  MapPin,
  Phone,
  KeyRound,
  CircleCheck,
  CircleX,
  Hourglass,
  CalendarClock,
  MoreHorizontal,
  EyeOff,
  Lock,
  SlidersHorizontal,
  ArrowDownRight,
  ArrowRight,
  Award,
  PackageCheck,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from "recharts";

import { SosmedSection, LevelCard } from "@/components/social-accounts-section";
import { useSocialAccounts } from "@/lib/social-store";
import {
  useBuzzerLevel,
  getBuzzerPercentageForLevel,
  useBuzzerLevels,
  levelFromFollowers,
  levelProgress,
  nextLevel,
  isOnlineBuzzerCategory,
  type BuzzerLevel,
} from "@/lib/buzzer-level";
import { BuzzerAnalyticsCards } from "@/components/buzzer-dashboard-analytics";
import { BuzzerNotifBell, BuzzerNotifSheet } from "@/components/buzzer-notif-sheet";
import { BuzzerSettingsSection } from "@/components/buzzer-settings-section";
import { HelpSection } from "@/components/help-section";
import { useBuzzerNotifications } from "@/lib/buzzer-notification-store";
import { toast } from "sonner";
import {
  getApplicationByEmail,
  getBuzzerVerificationStatus,
  type BuzzerAppStatus,
  type BuzzerApplication,
} from "@/lib/buzzer-verification";
import { uploadProofScreenshot } from "@/lib/proof-upload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { StatCard, StatusBadge } from "@/components/dashboard-shell";
import { MobileBottomNav, SidebarNav, useSidebarCollapsed } from "@/components/dashboard-sidebar";
import { ProofLink } from "@/components/proof-link";
import { TablePagination } from "@/components/table-pagination";
import { ThemeToggle } from "@/components/theme-toggle";

import { clearSession, useRequireRole, useSession, changePassword } from "@/lib/auth";
import {
  useBuzzerStore,
  formatIDR,
  terbilangRupiah,
  type BuzzerJob,
  type Earning,
  type JobStatus,
  type Platform,
  type Withdrawal,
} from "@/lib/buzzer-store";
import { supabase } from "@/integrations/supabase/client";
import {
  useBuzzerCampaignJobs,
  takeCampaignJob,
  submitCampaignJobProof,
  ensureCampaignJobInSupabase,
} from "@/lib/campaign-store";
import { notifyTaskSubmitted } from "@/lib/buzzer-notification-store";
import { useBuzzerRatings, averageStars } from "@/lib/rating-store";
import { exportToExcel, exportToPDF } from "@/lib/export-utils";
import { cn } from "@/lib/utils";

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
  const { data: rows, refetch } = useBuzzerCampaignJobs(
    canAccessJobs ? store.state.profile.email : "",
  );
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
        buzzerPercentage:
          r.buzzer_percentage === null || r.buzzer_percentage === undefined
            ? undefined
            : Number(r.buzzer_percentage),
        adminPercentage:
          r.admin_percentage === null || r.admin_percentage === undefined
            ? undefined
            : Number(r.admin_percentage),
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
      const alreadyInMine = mine.some(
        (m) =>
          m.id === lj.id ||
          m.id === DB_PREFIX + lj.id ||
          (m.title === lj.title && m.platform === lj.platform),
      );
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

    const open = [...openByCampaign.values()].map(({ job, count }) => ({
      ...job,
      slotsLeft: count,
    }));
    const byNewest = (a: MergedJob, b: MergedJob) => (a.updatedAt < b.updatedAt ? 1 : -1);
    return [...mine.sort(byNewest), ...open.sort(byNewest)];
  }, [rows, email, store.state.jobs]);
  return { jobs, refetch };
}

export const Route = createFileRoute("/buzzer")({
  head: () => ({ meta: [{ title: "Buzzer Dashboard — BuzzHub" }] }),
  component: BuzzerPage,
});

type SectionKey =
  | "dashboard"
  | "cari"
  | "pekerjaan"
  | "bukti"
  | "dompet"
  | "transaksi"
  | "peringkat"
  | "notifikasi"
  | "sosmed"
  | "ulasan"
  | "bantuan"
  | "profil"
  | "pengaturan";

const BUZZER_SECTIONS: SectionKey[] = [
  "dashboard",
  "cari",
  "pekerjaan",
  "bukti",
  "dompet",
  "transaksi",
  "peringkat",
  "notifikasi",
  "sosmed",
  "ulasan",
  "bantuan",
  "profil",
  "pengaturan",
];

const SECTION_ALIASES: Record<string, SectionKey> = {
  jobs: "cari",
  job: "cari",
  tersedia: "cari",
  penghasilan: "dompet",
  grafik: "dashboard",
  home: "dashboard",
  pesan: "bantuan",
  riwayat: "pekerjaan",
  sosial: "sosmed",
};

function normalizeBuzzerSection(value: string | null): SectionKey | null {
  if (!value) return null;
  if (SECTION_ALIASES[value]) return SECTION_ALIASES[value];
  return BUZZER_SECTIONS.includes(value as SectionKey) ? (value as SectionKey) : null;
}

function getInitialBuzzerSection(): SectionKey {
  if (typeof window !== "undefined") {
    const sp = normalizeBuzzerSection(new URLSearchParams(window.location.search).get("section"));
    if (sp) return sp;
    try {
      const stored = normalizeBuzzerSection(localStorage.getItem("buzzhub.active_section.buzzer"));
      if (stored) return stored;
    } catch {}
  }
  return "dashboard";
}

const navItems: { key: SectionKey; label: string; shortLabel?: string; icon: ReactNode }[] = [
  { key: "dashboard", label: "Dashboard", icon: <LayoutDashboard className="h-4 w-4" /> },
  {
    key: "cari",
    label: "Cari Pekerjaan",
    shortLabel: "Cari",
    icon: <Search className="h-4 w-4" />,
  },
  {
    key: "pekerjaan",
    label: "Pekerjaan Saya",
    shortLabel: "Pekerjaan",
    icon: <BriefcaseBusiness className="h-4 w-4" />,
  },
  {
    key: "bukti",
    label: "Bukti Pekerjaan",
    shortLabel: "Bukti",
    icon: <PackageCheck className="h-4 w-4" />,
  },
  {
    key: "dompet",
    label: "Dompet Saya",
    shortLabel: "Dompet",
    icon: <Wallet className="h-4 w-4" />,
  },
  {
    key: "transaksi",
    label: "Riwayat Transaksi",
    shortLabel: "Transaksi",
    icon: <Receipt className="h-4 w-4" />,
  },
  {
    key: "peringkat",
    label: "Peringkat Buzzer",
    shortLabel: "Peringkat",
    icon: <Trophy className="h-4 w-4" />,
  },
  { key: "notifikasi", label: "Notifikasi", icon: <Bell className="h-4 w-4" /> },
  {
    key: "bantuan",
    label: "Pusat Bantuan",
    shortLabel: "Bantuan",
    icon: <LifeBuoy className="h-4 w-4" />,
  },
  {
    key: "profil",
    label: "Profil Saya",
    shortLabel: "Profil",
    icon: <UserRound className="h-4 w-4" />,
  },
  { key: "pengaturan", label: "Pengaturan", icon: <Settings className="h-4 w-4" /> },
  {
    key: "sosmed",
    label: "Akun Sosial Media",
    shortLabel: "Sosmed",
    icon: <Link2 className="h-4 w-4" />,
  },
  {
    key: "ulasan",
    label: "Rating & Ulasan",
    shortLabel: "Ulasan",
    icon: <Star className="h-4 w-4" />,
  },
];

const sectionMeta: Record<SectionKey, { title: string; subtitle: string }> = {
  dashboard: { title: "Dashboard", subtitle: "Ringkasan performa & aktivitas terbaru kamu" },
  cari: { title: "Cari Pekerjaan", subtitle: "Temukan campaign yang cocok untuk akun kamu" },
  pekerjaan: { title: "Pekerjaan Saya", subtitle: "Pantau progress dan status setiap pekerjaan" },
  bukti: { title: "Bukti Pekerjaan", subtitle: "Kelola bukti pengerjaan & status verifikasi" },
  dompet: { title: "Dompet Saya", subtitle: "Saldo, penghasilan, dan pencairan dana" },
  transaksi: { title: "Riwayat Transaksi", subtitle: "Semua mutasi reward, bonus, dan penarikan" },
  peringkat: { title: "Peringkat Buzzer", subtitle: "Posisi kamu di komunitas buzzer BuzzHub" },
  notifikasi: { title: "Notifikasi", subtitle: "Update terbaru seputar campaign dan pembayaran" },
  sosmed: {
    title: "Akun Sosial Media",
    subtitle: "Kelola akun sosmed yang dipakai untuk campaign",
  },
  ulasan: { title: "Rating & Ulasan", subtitle: "Penilaian performa & feedback dari customer" },
  bantuan: { title: "Pusat Bantuan", subtitle: "Panduan, FAQ, dan kontak support BuzzHub" },
  profil: { title: "Profil Saya", subtitle: "Kelola data, rekening, dan keamanan akun" },
  pengaturan: { title: "Pengaturan", subtitle: "Preferensi notifikasi dan tampilan" },
};

const PLATFORM_ICON: Record<string, ReactNode> = {
  TikTok: <Music2 className="h-3.5 w-3.5" />,
  Instagram: <Instagram className="h-3.5 w-3.5" />,
  "X (Twitter)": <Twitter className="h-3.5 w-3.5" />,
  Facebook: <Facebook className="h-3.5 w-3.5" />,
  YouTube: <Youtube className="h-3.5 w-3.5" />,
  Telegram: <Send className="h-3.5 w-3.5" />,
  LinkedIn: <Link2 className="h-3.5 w-3.5" />,
  Offline: <MapPin className="h-3.5 w-3.5" />,
};

const PLATFORM_TONE: Record<string, string> = {
  TikTok: "from-slate-900 to-slate-600",
  Instagram: "from-fuchsia-500 to-orange-400",
  "X (Twitter)": "from-slate-800 to-slate-500",
  Facebook: "from-blue-600 to-sky-500",
  YouTube: "from-red-600 to-rose-500",
  Telegram: "from-sky-500 to-cyan-500",
  LinkedIn: "from-blue-700 to-blue-500",
  Offline: "from-emerald-500 to-teal-500",
};

function platformIcon(platform: string) {
  return PLATFORM_ICON[platform] ?? <MapPin className="h-3.5 w-3.5" />;
}

function platformTone(platform: string) {
  return PLATFORM_TONE[platform] ?? "from-brand to-brand-glow";
}

function BuzzerPage() {
  const session = useRequireRole("buzzer");
  const navigate = useNavigate();
  const store = useBuzzerStore(
    session?.email,
    session?.name,
    session
      ? {
          name: session.name,
          email: session.email,
          phone: session.phone ?? "",
          platform: (session.platform as Platform) ?? "Instagram",
          followers: session.followers ?? 0,
          bio: session.bio ?? "",
          username: session.username ?? "",
          avatarUrl: session.avatarUrl,
          buzzerCategory: session.company || "Buzzer Online",
        }
      : {},
  );
  const [applicationData, setApplicationData] = useState<BuzzerApplication | null>(null);
  // Render awal harus sama antara server dan client. Section dari URL/localStorage
  // baru diterapkan setelah mount agar tidak memicu hydration mismatch.
  const [section, setSection] = useState<SectionKey>("dashboard");
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
    return () => {
      active = false;
    };
  }, [session?.email]);

  const { jobs: allMergedJobs, refetch: refetchJobs } = useMergedJobs(store, true);

  useEffect(() => {
    const initial = getInitialBuzzerSection();
    if (initial !== "dashboard") {
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
      const sp = normalizeBuzzerSection(new URLSearchParams(window.location.search).get("section"));
      if (sp) {
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
  const navWithBadge = navItems.map((item) =>
    item.key === "notifikasi" && notifState.unreadCount > 0
      ? { ...item, badge: notifState.unreadCount }
      : item,
  );
  // "Akun Sosial Media" ditampilkan di sidebar agar mudah ditemukan (tempat
  // pengajuan naik level). "Ulasan" tetap diakses dari tombol cepat di profil.
  const sidebarNav = navWithBadge.filter((item) => item.key !== "ulasan");
  const renderSidebar = (isCollapsed = false, withToggle = false) => (
    <SidebarNav
      nav={sidebarNav}
      activeKey={section}
      onNavigate={go}
      onPrefetch={markVisited}
      user={sidebarUser}
      onLogout={() => setLogoutOpen(true)}
      collapsed={isCollapsed}
      onToggleCollapse={withToggle ? toggle : undefined}
    />
  );

  const meta = sectionMeta[section] || {
    title: "Buzzer Dashboard",
    subtitle: "Kelola akun dan aktivitas Anda",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/30">
      <div className="flex w-full items-start">
        <aside
          className={cn(
            "sticky top-0 hidden h-screen shrink-0 transition-[width] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] motion-reduce:transition-none md:block",
            collapsed ? "w-[100px]" : "w-64",
          )}
        >
          <div
            className={cn(
              "sidebar-surface h-full overflow-x-hidden overflow-y-auto overscroll-contain scrollbar-slim border-r border-white/15 shadow-md transition-[padding] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] motion-reduce:transition-none",
              collapsed ? "p-2" : "p-4",
            )}
          >
            {renderSidebar(collapsed, true)}
          </div>
        </aside>

        <main className="min-w-0 flex-1 pb-24 md:pb-0">
          <div className="mx-auto w-full max-w-[1200px] px-3 py-4 sm:px-6 lg:px-8">
            <header className="sticky top-0 z-30 -mx-3 mb-5 border-b border-border/60 bg-background/85 px-3 py-2.5 backdrop-blur-md sm:-mx-6 sm:px-6 md:static md:mx-0 md:mb-6 md:border-none md:bg-transparent md:px-0 md:py-0 md:backdrop-blur-none">
              <div className="flex min-h-[48px] items-center justify-between gap-3 md:min-h-[60px]">
                <div className="flex min-w-0 items-center gap-2.5">
                  {/* Menu lengkap khusus mobile dibuka dari logo */}
                  <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                    <SheetTrigger asChild>
                      <button
                        type="button"
                        className="flex items-center gap-2 md:hidden"
                        aria-label="Buka menu buzzer"
                      >
                        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl gradient-brand text-brand-foreground shadow-glow">
                          <Megaphone className="h-4 w-4" />
                        </span>
                        <span className="min-w-0 text-left">
                          <span className="block text-sm font-bold leading-tight">BuzzHub</span>
                          <span className="block max-w-[160px] truncate text-[11px] leading-tight text-muted-foreground">
                            {meta.title}
                          </span>
                        </span>
                      </button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-72 border-r-white/10 p-0 text-white">
                      <div className="sidebar-surface h-full overflow-x-hidden overflow-y-auto overscroll-contain scrollbar-slim p-4">
                        {renderSidebar()}
                      </div>
                    </SheetContent>
                  </Sheet>

                  <div className="hidden min-w-0 flex-col justify-center md:flex">
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
                  <BuzzerNotifBell
                    notifState={notifState}
                    email={session.email}
                    onClick={() => setNotifOpen(true)}
                  />
                  <button
                    type="button"
                    onClick={() => go("profil")}
                    className="md:hidden rounded-full ring-2 ring-background transition-transform active:scale-95"
                    aria-label="Buka profil saya"
                  >
                    <Avatar className="h-8 w-8 border border-border">
                      {sidebarUser.avatarUrl && (
                        <AvatarImage src={sidebarUser.avatarUrl} alt={sidebarUser.name} />
                      )}
                      <AvatarFallback className="gradient-brand text-[10px] font-bold text-brand-foreground">
                        {initialsOf(sidebarUser.name)}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="hidden h-9 w-9 md:inline-flex"
                    aria-label="Keluar"
                    onClick={() => setLogoutOpen(true)}
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </header>

            {visitedSections.map((key) => (
              <div key={key} hidden={section !== key}>
                {key === "dashboard" && (
                  <DashboardSection
                    store={store}
                    jobs={allMergedJobs}
                    verificationStatus={verificationStatus}
                    notifState={notifState}
                    onNavigate={go}
                  />
                )}
                {key === "cari" && (
                  <MarketplaceSection
                    store={store}
                    verificationStatus={verificationStatus}
                    onGoProfil={() => go("profil")}
                    onGoSosmed={() => go("sosmed")}
                    onGoPekerjaan={() => go("pekerjaan")}
                    sessionAvatar={session.avatarUrl}
                  />
                )}
                {key === "pekerjaan" && (
                  <MyJobsSection
                    store={store}
                    onGoSosmed={() => go("sosmed")}
                    onGoCari={() => go("cari")}
                    sessionAvatar={session.avatarUrl}
                  />
                )}
                {key === "bukti" && (
                  <ProofsSection
                    store={store}
                    onGoSosmed={() => go("sosmed")}
                    onGoCari={() => go("cari")}
                  />
                )}
                {key === "dompet" && <PenghasilanSection store={store} />}
                {key === "transaksi" && <TransactionsSection store={store} />}
                {key === "peringkat" && <LeaderboardSection store={store} />}
                {key === "notifikasi" && (
                  <NotificationsSection notifState={notifState} onNavigate={go} />
                )}
                {key === "sosmed" && <SosmedSection email={session.email} name={session.name} category={store.state.profile.buzzerCategory || session.company} />}
                {key === "ulasan" && <RatingUlasanSection store={store} />}
                {key === "profil" && (
                  <ProfilSection
                    store={store}
                    verificationStatus={verificationStatus}
                    applicationData={applicationData}
                    onGoRatings={() => go("ulasan")}
                    onGoSosmed={() => go("sosmed")}
                  />
                )}
                {key === "bantuan" && (
                  <HelpSection
                    role="buzzer"
                    user={{ name: store.state.profile.name || session.name, email: session.email }}
                    onNavigate={(target) => go(normalizeBuzzerSection(target) ?? "dashboard")}
                  />
                )}
                {key === "pengaturan" && <BuzzerSettingsSection buzzerEmail={session.email} />}
              </div>
            ))}
          </div>
        </main>
      </div>

      {/* Mobile bottom nav — 5 menu utama */}
      <MobileBottomNav
        nav={navWithBadge}
        activeKey={section}
        onNavigate={go}
        onPrefetch={markVisited}
        primaryKeys={["dashboard", "pekerjaan", "cari", "dompet", "profil"]}
        maxPrimary={5}
        featuredKey="cari"
        showMore={false}
      />

      <BuzzerNotifSheet
        notifState={notifState}
        open={notifOpen}
        onOpenChange={setNotifOpen}
        buzzerEmail={session.email}
        onNavigate={(sec) => {
          setSection(normalizeBuzzerSection(sec) ?? "dashboard");
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
            <AlertDialogAction onClick={doLogout} className="gradient-brand text-brand-foreground">
              Keluar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

/* ==================== RINGKASAN ==================== */
/* ==================== DASHBOARD ==================== */

function initialsOf(name: string) {
  return (name || "BZ")
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

type LeaderboardRow = {
  email: string;
  name: string;
  avatarUrl?: string | null;
  jobs: number;
  earnings: number;
  level: string;
  isMe: boolean;
};

function useLeaderboard(store: Store) {
  const levels = useBuzzerLevels();
  const meEmail = (store.state.profile.email || "").trim().toLowerCase();
  const [rows, setRows] = useState<LeaderboardRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);

    const fallbackMe = (): LeaderboardRow => {
      const doneJobs = (store.state.jobs || []).filter((j) => j.status === "Selesai");
      const earned = store.state.earnings
        .filter((e) => e.status === "Berhasil")
        .reduce((sum, e) => sum + Number(e.amount || 0), 0);
      return {
        email: meEmail,
        name: store.state.profile.name || "Buzzer",
        avatarUrl: store.state.profile.avatarUrl,
        jobs: Math.max(doneJobs.length, store.state.profile.jobsCompleted || 0),
        earnings: earned,
        level: levelFromFollowers(store.state.profile.followers || 0, levels).name,
        isMe: true,
      };
    };

    (async () => {
      try {
        const [jobsRes, walletsRes, accountsRes] = await Promise.all([
          (supabase as any)
            .from("campaign_jobs")
            .select("buzzer_email, buzzer_amount, payout, status, admin_verified_at")
            .or("status.eq.Selesai,admin_verified_at.not.is.null")
            .limit(5000),
          (supabase as any)
            .from("buzzer_wallets")
            .select("buzzer_email, balance, level, verified_followers")
            .limit(5000),
          (supabase as any)
            .from("app_accounts")
            .select("email, name, avatar_url, role")
            .eq("role", "buzzer")
            .limit(5000),
        ]);

        const map = new Map<string, LeaderboardRow>();

        const ensure = (email: string, name?: string, avatarUrl?: string | null) => {
          const key = (email || "").trim().toLowerCase();
          if (!key) return null;
          let row = map.get(key);
          if (!row) {
            row = {
              email: key,
              name: name || key.split("@")[0] || "Buzzer",
              avatarUrl: avatarUrl ?? null,
              jobs: 0,
              earnings: 0,
              level: levelFromFollowers(0, levels).name,
              isMe: key === meEmail,
            };
            map.set(key, row);
          } else {
            if (name && (!row.name || row.name === row.email.split("@")[0])) row.name = name;
            if (avatarUrl) row.avatarUrl = avatarUrl;
          }
          return row;
        };

        for (const acc of accountsRes?.data ?? []) ensure(acc.email, acc.name, acc.avatar_url);
        for (const wallet of walletsRes?.data ?? []) {
          const row = ensure(wallet.buzzer_email);
          if (!row) continue;
          if (wallet.level) row.level = wallet.level;
          else row.level = levelFromFollowers(Number(wallet.verified_followers || 0), levels).name;
        }
        for (const job of jobsRes?.data ?? []) {
          const row = ensure(job.buzzer_email);
          if (!row) continue;
          row.jobs += 1;
          row.earnings += Number(job.buzzer_amount ?? job.payout ?? 0);
        }

        if (meEmail && !map.has(meEmail)) map.set(meEmail, fallbackMe());
        const me = map.get(meEmail);
        const localFallback = fallbackMe();
        if (me) {
          me.isMe = true;
          if (me.jobs === 0) me.jobs = localFallback.jobs;
          if (me.earnings === 0) me.earnings = localFallback.earnings;
          if (!me.name || me.name === me.email.split("@")[0]) me.name = localFallback.name;
          if (!me.avatarUrl) me.avatarUrl = localFallback.avatarUrl;
        }

        const sorted = [...map.values()]
          .filter((row) => row.jobs > 0 || row.earnings > 0 || row.isMe)
          .sort((a, b) => b.earnings - a.earnings || b.jobs - a.jobs);
        if (active) setRows(sorted);
      } catch (error) {
        console.error("[Leaderboard] Gagal memuat peringkat:", error);
        if (active) setRows([fallbackMe()]);
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [
    meEmail,
    levels,
    store.state.profile.name,
    store.state.profile.avatarUrl,
    store.state.profile.followers,
    store.state.profile.jobsCompleted,
  ]);

  return { rows, loading };
}

const DASHBOARD_PERIODS = [
  { key: "harian", label: "Harian" },
  { key: "mingguan", label: "Mingguan" },
  { key: "bulanan", label: "Bulanan" },
  { key: "tahunan", label: "Tahunan" },
] as const;
type DashboardPeriod = (typeof DASHBOARD_PERIODS)[number]["key"];

function buildIncomeSeries(earnings: Store["state"]["earnings"], period: DashboardPeriod) {
  const now = new Date();
  const points: { label: string; value: number }[] = [];
  const sumRange = (start: Date, end: Date) =>
    earnings
      .filter((e) => e.status !== "Ditolak")
      .filter((e) => {
        const d = new Date(e.date);
        return !Number.isNaN(d.getTime()) && d >= start && d < end;
      })
      .reduce((sum, e) => sum + Number(e.amount || 0), 0);

  if (period === "harian") {
    for (let i = 6; i >= 0; i--) {
      const start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
      const end = new Date(start.getTime() + 86400000);
      points.push({
        label: start.toLocaleDateString("id-ID", { weekday: "short" }),
        value: sumRange(start, end),
      });
    }
    return points;
  }

  if (period === "mingguan") {
    for (let i = 7; i >= 0; i--) {
      const end = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() - now.getDay() + (7 - i) + 1,
      );
      const start = new Date(end.getTime() - 7 * 86400000);
      points.push({ label: `${i === 0 ? "Kini" : `-${i}w`}`, value: sumRange(start, end) });
    }
    return points;
  }

  if (period === "bulanan") {
    for (let i = 5; i >= 0; i--) {
      const start = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
      points.push({
        label: start.toLocaleDateString("id-ID", { month: "short" }),
        value: sumRange(start, end),
      });
    }
    return points;
  }

  for (let i = 4; i >= 0; i--) {
    const start = new Date(now.getFullYear() - i, 0, 1);
    const end = new Date(now.getFullYear() - i + 1, 0, 1);
    points.push({ label: String(start.getFullYear()), value: sumRange(start, end) });
  }
  return points;
}

function verificationLabel(status: BuzzerAppStatus | null) {
  if (status === "approved")
    return {
      label: "Akun Terverifikasi",
      className: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
      icon: <ShieldCheck className="h-3.5 w-3.5" />,
    };
  if (status === "rejected")
    return {
      label: "Verifikasi Ditolak",
      className: "bg-rose-500/15 text-rose-600 dark:text-rose-400",
      icon: <ShieldAlert className="h-3.5 w-3.5" />,
    };
  return {
    label: "Menunggu Verifikasi",
    className: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
    icon: <Hourglass className="h-3.5 w-3.5" />,
  };
}

function DashboardSection({
  store,
  jobs,
  verificationStatus,
  notifState,
  onNavigate,
}: {
  store: Store;
  jobs: MergedJob[];
  verificationStatus: BuzzerAppStatus | null;
  notifState: ReturnType<typeof useBuzzerNotifications>;
  onNavigate: (key: SectionKey) => void;
}) {
  const { state } = store;
  const [period, setPeriod] = useState<DashboardPeriod>("harian");
  const { rows: leaderboard, loading: leaderboardLoading } = useLeaderboard(store);

  const now = new Date();
  const hour = now.getHours();
  const greeting =
    hour < 11
      ? "Selamat pagi"
      : hour < 15
        ? "Selamat siang"
        : hour < 18
          ? "Selamat sore"
          : "Selamat malam";
  const firstName = (state.profile.name || "Buzzer").split(" ")[0];
  const verify = verificationLabel(verificationStatus);

  const levelInfo = useBuzzerLevel(state.profile.email);
  const levels = useBuzzerLevels();
  const fallbackFollowers = state.profile.followers || 0;
  const isOnlineBuzzer = isOnlineBuzzerCategory(state.profile.buzzerCategory);
  const activeLevel = isOnlineBuzzer ? (levelInfo.level ?? levelFromFollowers(fallbackFollowers, levels)) : null;
  const activeFollowers = isOnlineBuzzer ? (levelInfo.assigned ? levelInfo.followers : fallbackFollowers) : fallbackFollowers;
  const nextLv = isOnlineBuzzer ? (levelInfo.assigned ? levelInfo.next : nextLevel(activeFollowers, levels)) : null;
  const levelPct = isOnlineBuzzer ? (levelInfo.assigned ? levelInfo.progress : levelProgress(activeFollowers, levels)) : 0;

  const { data: allRatings } = useBuzzerRatings();
  const myRatings = useMemo(() => {
    const key = (state.profile.email || "").trim().toLowerCase();
    return allRatings.filter((rating) => (rating.buzzer_email || "").toLowerCase() === key);
  }, [allRatings, state.profile.email]);
  const ratingAvg =
    myRatings.length > 0 ? averageStars(myRatings) : Number(state.profile.rating || 0);

  const activeStatuses: JobStatus[] = ["Diambil", "Upload", "Review", "Revisi"];
  const activeJobs = jobs.filter((j) => activeStatuses.includes(j.status));
  const completedJobs = jobs.filter((j) => j.status === "Selesai");
  const totalIncome = state.earnings
    .filter((e) => e.status !== "Ditolak")
    .reduce((sum, e) => sum + Number(e.amount || 0), 0);
  const pendingIncome = state.earnings
    .filter((e) => e.status === "Pending" || e.status === "Diproses")
    .reduce((sum, e) => sum + Number(e.amount || 0), 0);

  const chartData = useMemo(
    () => buildIncomeSeries(state.earnings, period),
    [state.earnings, period],
  );
  const chartTotal = chartData.reduce((sum, point) => sum + point.value, 0);
  const last = chartData[chartData.length - 1]?.value ?? 0;
  const prev = chartData[chartData.length - 2]?.value ?? 0;
  const trend = prev > 0 ? Math.round(((last - prev) / prev) * 100) : last > 0 ? 100 : 0;

  const latestJobs = [...jobs]
    .filter((j) => j.status === "Tersedia")
    .sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1))
    .slice(0, 4);
  const fallbackJobs = jobs.slice(0, 4);
  const showcaseJobs = latestJobs.length > 0 ? latestJobs : fallbackJobs;

  const activities = useMemo(() => {
    const fromNotif = (notifState.notifications || []).slice(0, 5).map((n) => ({
      id: n.id,
      title: n.title,
      desc: n.message,
      time: n.created_at,
      type: n.type,
    }));
    if (fromNotif.length > 0) return fromNotif;
    return jobs.slice(0, 5).map((j) => ({
      id: j.id,
      title:
        j.status === "Selesai"
          ? "Pekerjaan disetujui"
          : j.status === "Review"
            ? "Bukti dikirim"
            : `Status ${j.status}`,
      desc: j.title,
      time: j.updatedAt || new Date().toISOString(),
      type:
        j.status === "Selesai"
          ? "task_approved"
          : j.status === "Review"
            ? "verification_pending"
            : "general",
    }));
  }, [notifState.notifications, jobs]);

  const myRank = leaderboard.findIndex((row) => row.isMe) + 1;
  const topFive = leaderboard.slice(0, 5);
  const myRow = leaderboard.find((row) => row.isMe);

  const statCards: {
    label: string;
    value: string;
    hint: string;
    icon: ReactNode;
    tone: string;
    target: SectionKey;
    cta: string;
  }[] = [
    {
      label: "Total Penghasilan",
      value: formatIDR(totalIncome),
      hint: "Akumulasi reward disetujui",
      icon: <TrendingUp className="h-5 w-5" />,
      tone: "from-sky-500 to-blue-600",
      target: "dompet",
      cta: "Lihat riwayat pembayaran",
    },
    {
      label: "Saldo Tersedia",
      value: formatIDR(state.balance),
      hint: "Siap dicairkan kapan saja",
      icon: <Wallet className="h-5 w-5" />,
      tone: "from-emerald-500 to-teal-500",
      target: "dompet",
      cta: "Buka dompet & riwayat",
    },
    {
      label: "Pekerjaan Selesai",
      value: String(Math.max(completedJobs.length, state.profile.jobsCompleted || 0)),
      hint: "Total pekerjaan tuntas",
      icon: <CircleCheck className="h-5 w-5" />,
      tone: "from-indigo-500 to-blue-600",
      target: "pekerjaan",
      cta: "Lihat pekerjaan saya",
    },
    {
      label: "Pekerjaan Aktif",
      value: String(activeJobs.length),
      hint:
        pendingIncome > 0 ? `${formatIDR(pendingIncome)} menunggu verifikasi` : "Sedang berjalan",
      icon: <BriefcaseBusiness className="h-5 w-5" />,
      tone: "from-amber-500 to-orange-500",
      target: "pekerjaan",
      cta: "Lihat pekerjaan aktif",
    },
  ];

  return (
    <div className="space-y-5">
      {/* Welcome */}
      <section className="dashboard-hero relative overflow-hidden rounded-3xl p-5 text-white shadow-glow sm:p-6">
        <div className="pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-10 h-56 w-56 rounded-full bg-accent-warm/25 blur-3xl" />
        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex min-w-0 items-start gap-3.5 sm:items-center">
            <Avatar className="h-16 w-16 shrink-0 border-2 border-white/40 shadow-lg ring-4 ring-white/10 sm:h-[72px] sm:w-[72px]">
              {state.profile.avatarUrl && (
                <AvatarImage src={state.profile.avatarUrl} alt={state.profile.name} />
              )}
              <AvatarFallback className="bg-white/20 text-base font-bold text-white">
                {initialsOf(state.profile.name)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="text-xs font-medium text-white/75">{greeting},</p>
              <h2 className="truncate font-display text-xl font-bold tracking-tight text-white sm:text-2xl">
                {firstName}
              </h2>
              <div className="mt-2 flex flex-wrap items-center gap-1.5">
                <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-0.5 text-[11px] font-semibold ring-1 ring-inset ring-white/25">
                  {verify.icon} {verify.label}
                </span>
                {isOnlineBuzzer && activeLevel && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-0.5 text-[11px] font-semibold ring-1 ring-inset ring-white/25">
                    {activeLevel.emoji} {activeLevel.name}
                  </span>
                )}
                {myRank > 0 && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-0.5 text-[11px] font-semibold ring-1 ring-inset ring-white/25">
                    <Trophy className="h-3 w-3" /> #{myRank} peringkat
                  </span>
                )}
                <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-0.5 text-[11px] font-semibold ring-1 ring-inset ring-white/25">
                  <Users className="h-3 w-3" />
                  {activeFollowers.toLocaleString("id-ID")} followers
                </span>
              </div>
            </div>
          </div>

          <div className="w-full rounded-2xl border border-white/20 bg-white/10 p-3.5 backdrop-blur-md sm:p-4 lg:w-[340px]">
            {isOnlineBuzzer ? (
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-white/70">
                    Level Buzzer
                  </p>
                  <p className="truncate font-display text-lg font-bold text-white">
                    {activeLevel?.name}
                  </p>
                </div>
                <span className="shrink-0 rounded-full bg-white/15 px-2 py-0.5 font-numeric text-[11px] font-semibold tabular-nums">
                  {activeLevel && activeLevel.payout > 0
                    ? `${formatIDR(activeLevel.payout)} / job`
                    : "Payout campaign"}
                </span>
              </div>
            ) : (
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-white/70">
                    Level Buzzer
                  </p>
                  <p className="truncate font-display text-lg font-bold text-white">Tidak tersedia</p>
                </div>
              </div>
            )}
            {isOnlineBuzzer && (
              <>
                <div className="mt-3">
                  <div className="flex items-center justify-between text-[10px] text-white/75">
                    <span>{nextLv ? `Menuju ${nextLv.name}` : "Level tertinggi tercapai"}</span>
                    <span className="font-numeric tabular-nums">{levelPct}%</span>
                  </div>
                  <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-white/20">
                    <div
                      className="h-full rounded-full bg-white transition-[width] duration-500"
                      style={{ width: `${levelPct}%` }}
                    />
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between text-[11px] text-white/80">
                  <span className="inline-flex items-center gap-1">
                    <Star className="h-3 w-3 fill-amber-300 text-amber-300" />
                    <span className="font-numeric font-semibold tabular-nums">
                      {ratingAvg.toFixed(1)}
                    </span>
                    rating
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <BriefcaseBusiness className="h-3 w-3" />
                    <span className="font-numeric font-semibold tabular-nums">{activeJobs.length}</span>
                    pekerjaan aktif
                  </span>
                </div>
              </>
            )}
        </div>

        <div className="relative mt-4 flex flex-wrap items-center gap-2">
          <Button
            size="sm"
            onClick={() => onNavigate("cari")}
            className="gap-1.5 bg-white text-brand shadow-sm hover:bg-white/90"
          >
            <Search className="h-4 w-4" /> Cari Pekerjaan
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onNavigate("dompet")}
            className="gap-1.5 border border-white/25 bg-white/10 text-white hover:bg-white/20 hover:text-white"
          >
            <Wallet className="h-4 w-4" /> Dompet
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onNavigate("notifikasi")}
            className="gap-1.5 border border-white/25 bg-white/10 text-white hover:bg-white/20 hover:text-white"
          >
            <Bell className="h-4 w-4" />
            Notifikasi
            {notifState.unreadCount > 0 && (
              <span className="ml-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-rose-500 px-1 font-numeric text-[10px] font-bold text-white">
                {notifState.unreadCount > 99 ? "99+" : notifState.unreadCount}
              </span>
            )}
          </Button>
        </div>
      </div>
      </section>

      {/* Statistik */}
      <section className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {statCards.map((card) => (
          <button
            key={card.label}
            type="button"
            onClick={() => onNavigate(card.target)}
            title={card.cta}
            aria-label={`${card.label}: ${card.cta}`}
            className="group relative overflow-hidden rounded-2xl border border-border bg-card p-4 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <span
              aria-hidden="true"
              className={cn("absolute inset-x-0 top-0 h-1 bg-gradient-to-r opacity-80", card.tone)}
            />
            <span
              aria-hidden="true"
              className={cn(
                "pointer-events-none absolute -right-8 -top-10 h-24 w-24 rounded-full bg-gradient-to-br opacity-10 blur-2xl transition-opacity group-hover:opacity-20",
                card.tone,
              )}
            />
            <div className="relative flex items-start justify-between gap-2">
              <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground sm:text-xs">
                {card.label}
              </p>
              <span
                className={cn(
                  "grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br text-white shadow-sm",
                  card.tone,
                )}
              >
                {card.icon}
              </span>
            </div>
            <p className="relative mt-2 font-numeric text-lg font-bold tracking-tight tabular-nums sm:text-2xl">
              {card.value}
            </p>
            <p className="relative mt-1 line-clamp-2 min-h-[2.4em] text-[11px] text-muted-foreground">
              {card.hint}
            </p>
            <span className="relative mt-2 inline-flex items-center gap-1 text-[10px] font-semibold text-brand opacity-100 transition-opacity md:opacity-0 md:group-hover:opacity-100">
              {card.cta} <ChevronRight className="h-3 w-3" />
            </span>
          </button>
        ))}
      </section>

      {/* Grafik + peringkat */}
      <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h3 className="font-display text-base font-bold sm:text-lg">Grafik Penghasilan</h3>
              <div className="mt-1 flex items-center gap-2">
                <span className="font-numeric text-xl font-bold tabular-nums">
                  {formatIDR(chartTotal)}
                </span>
                {chartTotal > 0 && (
                  <span
                    className={cn(
                      "inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 font-numeric text-[10px] font-semibold tabular-nums",
                      trend >= 0
                        ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                        : "bg-rose-500/15 text-rose-600 dark:text-rose-400",
                    )}
                  >
                    {trend >= 0 ? (
                      <ArrowUpRight className="h-3 w-3" />
                    ) : (
                      <ArrowDownRight className="h-3 w-3" />
                    )}
                    {Math.abs(trend)}%
                  </span>
                )}
              </div>
              <p className="text-[11px] text-muted-foreground">
                {chartTotal > 0
                  ? `Periode ${period} · dibanding periode sebelumnya`
                  : "Belum ada pembayaran berhasil pada periode ini"}
              </p>
            </div>
            <div className="flex flex-wrap gap-1 rounded-xl bg-muted/60 p-1">
              {DASHBOARD_PERIODS.map((p) => (
                <button
                  key={p.key}
                  type="button"
                  onClick={() => setPeriod(p.key)}
                  className={cn(
                    "rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-colors sm:text-xs",
                    period === p.key
                      ? "bg-brand text-brand-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {chartTotal <= 0 ? (
            <div className="mt-4 flex h-[210px] w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-muted/20 p-6 text-center sm:h-[240px]">
              <BarChart3 className="h-8 w-8 text-muted-foreground" aria-hidden="true" />
              <p className="text-sm font-medium">Belum ada penghasilan pada periode ini</p>
              <p className="max-w-[280px] text-[11px] leading-relaxed text-muted-foreground">
                Selesaikan campaign pertamamu atau pilih periode lain untuk melihat grafik.
              </p>
              <Button
                size="sm"
                variant="outline"
                className="mt-1"
                onClick={() => onNavigate("cari")}
              >
                Cari Pekerjaan
              </Button>
            </div>
          ) : (
            <div className="mt-4 h-[210px] w-full sm:h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 8, right: 6, left: -18, bottom: 0 }}>
                  <defs>
                    <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--brand)" stopOpacity={0.38} />
                      <stop offset="55%" stopColor="var(--brand-glow)" stopOpacity={0.16} />
                      <stop offset="100%" stopColor="var(--brand-glow)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="currentColor"
                    className="text-border"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="label"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 11, fill: "currentColor" }}
                    className="text-muted-foreground"
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    width={58}
                    tick={{ fontSize: 10, fill: "currentColor" }}
                    className="text-muted-foreground"
                    tickFormatter={(value: number) =>
                      value >= 1000000
                        ? `${Math.round(value / 1000000)}jt`
                        : value >= 1000
                          ? `${Math.round(value / 1000)}rb`
                          : String(value)
                    }
                  />
                  <RechartsTooltip
                    cursor={{ stroke: "var(--brand)", strokeDasharray: "4 4" }}
                    contentStyle={{
                      borderRadius: 12,
                      border: "1px solid var(--border)",
                      background: "var(--card)",
                      color: "var(--foreground)",
                      fontSize: 12,
                      boxShadow: "0 10px 30px rgba(15, 23, 42, 0.12)",
                    }}
                    formatter={(value: number) => [formatIDR(Number(value)), "Penghasilan"]}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="var(--brand)"
                    strokeWidth={2.5}
                    fill="url(#incomeGradient)"
                    activeDot={{ r: 4, strokeWidth: 2, stroke: "#fff" }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-5">
          <div className="flex items-center justify-between">
            <h3 className="flex items-center gap-2 font-display text-base font-bold sm:text-lg">
              <Trophy className="h-4 w-4 text-amber-500" /> Peringkat Buzzer
            </h3>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-xs"
              onClick={() => onNavigate("peringkat")}
            >
              Lihat
            </Button>
          </div>

          {myRow && (
            <div className="mt-3 rounded-xl border border-brand/25 bg-gradient-to-r from-brand/10 via-brand/5 to-transparent p-3">
              <div className="flex items-center justify-between gap-2">
                <div className="flex min-w-0 items-center gap-2">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full gradient-brand font-numeric text-xs font-bold text-brand-foreground shadow-sm">
                    {myRank > 0 ? `#${myRank}` : "-"}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-xs font-bold">Posisi kamu</p>
                    <p className="truncate text-[11px] text-muted-foreground">
                      {myRow.level} · {myRow.jobs} job selesai
                    </p>
                  </div>
                </div>
                <p className="shrink-0 font-numeric text-xs font-bold tabular-nums">
                  {formatIDR(myRow.earnings)}
                </p>
              </div>
            </div>
          )}

          <div className="mt-3 space-y-1">
            {leaderboardLoading ? (
              <div className="space-y-2 py-2">
                {[0, 1, 2].map((i) => (
                  <Skeleton key={i} className="h-10 w-full rounded-lg" />
                ))}
              </div>
            ) : topFive.length === 0 ? (
              <p className="py-6 text-center text-xs text-muted-foreground">
                Belum ada data peringkat.
              </p>
            ) : (
              topFive.map((row, index) => (
                <div
                  key={row.email}
                  className={cn(
                    "flex items-center justify-between gap-2 rounded-xl px-1.5 py-2 transition-colors hover:bg-muted/50",
                    row.isMe && "bg-brand/5 ring-1 ring-inset ring-brand/20",
                  )}
                >
                  <div className="flex min-w-0 items-center gap-2">
                    <span
                      className={cn(
                        "grid h-6 w-6 shrink-0 place-items-center rounded-full font-numeric text-[10px] font-bold ring-1 ring-inset",
                        index === 0
                          ? "bg-amber-400 text-amber-950 ring-amber-300"
                          : index === 1
                            ? "bg-slate-300 text-slate-800 ring-slate-200 dark:bg-slate-400/30 dark:text-slate-100 dark:ring-slate-400/40"
                            : index === 2
                              ? "bg-orange-300 text-orange-950 ring-orange-200 dark:bg-orange-400/30 dark:text-orange-100 dark:ring-orange-400/40"
                              : "bg-muted text-muted-foreground ring-border",
                      )}
                    >
                      {index + 1}
                    </span>
                    <Avatar className="h-7 w-7 shrink-0 ring-1 ring-border">
                      {row.avatarUrl && <AvatarImage src={row.avatarUrl} alt={row.name} />}
                      <AvatarFallback className="bg-muted text-[9px] font-bold">
                        {initialsOf(row.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="flex min-w-0 items-center gap-1.5 text-xs font-semibold">
                        <span className="truncate">{row.name}</span>
                        {row.isMe && (
                          <span className="shrink-0 rounded-full bg-brand/15 px-1.5 py-0.5 text-[9px] font-bold text-brand">
                            Kamu
                          </span>
                        )}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        {row.level} · {row.jobs} job
                      </p>
                    </div>
                  </div>
                  <span className="shrink-0 font-numeric text-[11px] font-bold tabular-nums">
                    {formatIDR(row.earnings)}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      <BuzzerAnalyticsCards
        jobs={jobs}
        earnings={state.earnings}
        email={state.profile.email}
        fallbackRating={Number(state.profile.rating || 0)}
        onNavigateJobs={() => onNavigate("cari")}
        onNavigateRatings={() => onNavigate("ulasan")}
      />

      {/* Pekerjaan terbaru + aktivitas */}
      <section className="grid min-w-0 gap-4 lg:grid-cols-2">
        <div className="min-w-0 rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-display text-base font-bold sm:text-lg">Pekerjaan Terbaru</h3>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-xs"
              onClick={() => onNavigate("cari")}
            >
              Lihat semua
            </Button>
          </div>
          {showcaseJobs.length === 0 ? (
            <EmptyState
              icon={<Inbox className="h-7 w-7" />}
              title="Belum ada pekerjaan"
              desc="Campaign baru akan muncul di sini. Cek marketplace secara berkala."
              action={
                <Button
                  size="sm"
                  onClick={() => onNavigate("cari")}
                  className="gradient-brand text-brand-foreground"
                >
                  Cari Pekerjaan
                </Button>
              }
            />
          ) : (
            <div className="min-w-0 space-y-2.5">
              {showcaseJobs.map((job) => {
                const action = parseBuzzerJobBrief(job.brief, job.title, job.platform).taskAction;
                return (
                  <button
                    key={job.id}
                    type="button"
                    onClick={() => onNavigate("cari")}
                    className="group flex w-full items-center gap-3 rounded-xl border border-border bg-background/60 p-3 text-left transition-all hover:-translate-y-0.5 hover:border-brand/30 hover:bg-brand/5 hover:shadow-sm"
                  >
                    <span
                      className={cn(
                        "grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br text-white shadow-sm [&>svg]:h-4 [&>svg]:w-4",
                        platformTone(job.platform),
                      )}
                    >
                      {platformIcon(job.platform)}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-2">
                        <span className="truncate text-sm font-semibold">{job.title}</span>
                        <span
                          className={cn(
                            "shrink-0 rounded-full px-1.5 py-0.5 text-[9px] font-semibold",
                            statusVisual(job.status),
                          )}
                        >
                          {jobStatusLabel(job)}
                        </span>
                      </span>
                      <span className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] text-muted-foreground">
                        <span className="inline-flex items-center gap-1">
                          {platformIcon(job.platform)} {job.platform}
                        </span>
                        <span>· {action || "Tugas campaign"}</span>
                        <span>· {job.slotsLeft ?? 1} slot</span>
                        {job.deadline && (
                          <span className="inline-flex items-center gap-1">
                            <CalendarDays className="h-3 w-3" /> {job.deadline}
                          </span>
                        )}
                      </span>
                    </span>
                    <span className="flex shrink-0 items-center gap-2">
                      <span className="text-right">
                        <span className="block font-numeric text-sm font-bold tabular-nums">
                          {formatIDR(job.payout)}
                        </span>
                        <span className="block text-[10px] text-muted-foreground">reward</span>
                      </span>
                      <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="min-w-0 rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-display text-base font-bold sm:text-lg">Aktivitas Terakhir</h3>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-xs"
              onClick={() => onNavigate("notifikasi")}
            >
              Notifikasi
            </Button>
          </div>
          {activities.length === 0 ? (
            <EmptyState
              icon={<Bell className="h-7 w-7" />}
              title="Belum ada aktivitas"
              desc="Aktivitas pekerjaan dan pembayaran akan tampil di sini."
            />
          ) : (
            <ol className="relative min-w-0 space-y-3 before:absolute before:left-[15px] before:top-2 before:h-[calc(100%-16px)] before:w-px before:bg-border">
              {activities.map((item) => {
                const icon =
                  item.type === "task_approved" || item.type === "payout" ? (
                    <CircleCheck className="h-3.5 w-3.5" />
                  ) : item.type === "task_rejected" ? (
                    <CircleX className="h-3.5 w-3.5" />
                  ) : item.type === "new_task" ? (
                    <Megaphone className="h-3.5 w-3.5" />
                  ) : (
                    <Clock className="h-3.5 w-3.5" />
                  );
                const tone =
                  item.type === "task_approved" || item.type === "payout"
                    ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                    : item.type === "task_rejected"
                      ? "bg-rose-500/15 text-rose-600 dark:text-rose-400"
                      : item.type === "new_task"
                        ? "bg-brand/15 text-brand"
                        : "bg-amber-500/15 text-amber-600 dark:text-amber-400";
                return (
                  <li key={item.id} className="relative flex items-start gap-3">
                    <span
                      className={cn(
                        "z-10 grid h-8 w-8 shrink-0 place-items-center rounded-full ring-4 ring-card",
                        tone,
                      )}
                    >
                      {icon}
                    </span>
                    <div className="min-w-0 pt-0.5">
                      <p className="truncate text-xs font-semibold">{item.title}</p>
                      <p className="line-clamp-2 text-[11px] text-muted-foreground">{item.desc}</p>
                      <p className="mt-0.5 text-[10px] text-muted-foreground/80">
                        {formatRelativeTime(item.time)}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ol>
          )}
        </div>
      </section>

      <div className="rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-5">
        {isOnlineBuzzer ? (
          <LevelCard
            email={state.profile.email}
            name={state.profile.name}
            simple
            category={state.profile.buzzerCategory}
            onAjukan={() => onNavigate("sosmed")}
          />
        ) : (
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-emerald-500/15 text-emerald-600">
                <Users className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Pembaruan Followers</p>
                <p className="text-sm text-muted-foreground">
                  Level Buzzer hanya untuk <b>Buzzer Online</b>. Kamu tetap bisa mengajukan pembaruan followers untuk diverifikasi admin.
                </p>
              </div>
            </div>
            <Button
              size="sm"
              className="shrink-0 bg-emerald-600 text-emerald-50 hover:bg-emerald-500"
              onClick={() => onNavigate("sosmed")}
            >
              <ArrowRight className="mr-1.5 h-4 w-4" /> Ajukan Sekarang
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

function formatRelativeTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const diff = Date.now() - date.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Baru saja";
  if (mins < 60) return `${mins} menit lalu`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} jam lalu`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} hari lalu`;
  return date.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}

/* ==================== JOBS ==================== */
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

const TASK_CATEGORIES = [
  "Semua",
  "Like",
  "Comment",
  "Follow",
  "Subscribe",
  "Share",
  "Review",
  "View",
  "Lainnya",
] as const;
const REWARD_RANGES = ["Semua", "<25rb", "25rb–100rb", ">100rb"] as const;
const DIFFICULTIES = ["Semua", "Mudah", "Sedang", "Sulit"] as const;

function taskCategoryOf(job: MergedJob) {
  const parsed = parseBuzzerJobBrief(job.brief, job.title, job.platform);
  const raw = `${parsed.taskAction ?? ""} ${job.title} ${job.brief}`.toLowerCase();
  if (raw.includes("subscribe") || raw.includes("subcribe")) return "Subscribe";
  if (raw.includes("follow") || raw.includes("follower")) return "Follow";
  if (raw.includes("comment") || raw.includes("komentar")) return "Comment";
  if (raw.includes("share") || raw.includes("bagikan")) return "Share";
  if (raw.includes("review") || raw.includes("ulasan")) return "Review";
  if (raw.includes("view") || raw.includes("tonton")) return "View";
  if (raw.includes("like") || raw.includes("suka")) return "Like";
  return "Lainnya";
}

function effectiveReward(job: MergedJob) {
  return Number(job.buzzerAmount || job.payout || job.grossPrice || 0);
}

function difficultyOf(job: MergedJob) {
  const level = (job.buzzerLevel ?? "").toLowerCase();
  if (level.includes("platinum") || level.includes("diamond")) return "Sulit";
  if (level.includes("gold")) return "Sedang";
  if (level.includes("silver") || level.includes("bronze")) return "Mudah";
  const reward = effectiveReward(job);
  if (reward >= 100000) return "Sulit";
  if (reward >= 25000) return "Sedang";
  return "Mudah";
}

function useVerifiedPlatforms(store: Store) {
  const { accounts: socialAccounts } = useSocialAccounts(
    store.state.profile.email,
    store.state.profile.name,
  );
  return useMemo(() => {
    const set = new Set<string>();
    for (const a of socialAccounts) {
      if (a.verification?.toLowerCase() === "terverifikasi" && a.isActive !== false) {
        set.add(a.platform.trim().toLowerCase());
      }
    }
    // Akun utama tetap boleh dipakai jika belum ada akun sosial yang terverifikasi.
    if (set.size === 0 && store.state.profile.platform) {
      set.add(store.state.profile.platform.trim().toLowerCase());
    }
    return set;
  }, [socialAccounts, store.state.profile.platform]);
}

function SectionHeaderCard({
  store,
  sessionAvatar,
  onGoProfil,
}: {
  store: Store;
  sessionAvatar?: string;
  onGoProfil?: () => void;
}) {
  const avatarUrl = store.state.profile.avatarUrl || sessionAvatar;
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm">
      <div className="flex min-w-0 items-center gap-3">
        <Avatar className="h-11 w-11 shrink-0 border-2 border-background shadow-sm">
          {avatarUrl && <AvatarImage src={avatarUrl} alt={store.state.profile.name} />}
          <AvatarFallback className="gradient-brand text-sm font-bold text-brand-foreground">
            {initialsOf(store.state.profile.name)}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <h2 className="truncate font-display font-bold">{store.state.profile.name}</h2>
          <p className="truncate text-xs text-muted-foreground">
            {store.state.profile.username || "Buzzer"} ·{" "}
            {store.state.profile.platform || "Semua platform"} ·{" "}
            {store.state.profile.followers.toLocaleString("id-ID")} followers
          </p>
        </div>
      </div>
      {onGoProfil && (
        <Button size="sm" variant="outline" onClick={onGoProfil}>
          <UserRound className="mr-1.5 h-3.5 w-3.5" /> Kelola Profil
        </Button>
      )}
    </div>
  );
}

function VerificationBanner({ status }: { status: BuzzerAppStatus | null }) {
  if (status === "rejected") {
    return (
      <div className="flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-3.5 text-xs text-rose-900 dark:border-rose-900/40 dark:bg-rose-950/30 dark:text-rose-200">
        <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-rose-600" />
        <p>
          Pendaftaran Anda ditolak admin. Anda belum dapat mengambil pekerjaan baru. Hubungi pusat
          bantuan untuk informasi lebih lanjut.
        </p>
      </div>
    );
  }
  if (status === "pending") {
    return (
      <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-3.5 text-xs text-amber-900 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-200">
        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
        <p>
          Akun buzzer Anda sedang menunggu verifikasi admin. Anda tetap dapat melihat seluruh
          pekerjaan yang tersedia.
        </p>
      </div>
    );
  }
  return null;
}

function MarketplaceSection({
  store,
  verificationStatus,
  onGoProfil,
  onGoSosmed,
  onGoPekerjaan,
  sessionAvatar,
}: {
  store: Store;
  verificationStatus: BuzzerAppStatus | null;
  onGoProfil?: () => void;
  onGoSosmed?: () => void;
  onGoPekerjaan?: () => void;
  sessionAvatar?: string;
}) {
  const { jobs, refetch } = useMergedJobs(store, true);
  const verifiedPlatforms = useVerifiedPlatforms(store);
  const [platform, setPlatform] = useState<string>("Semua");
  const [category, setCategory] = useState<string>("Semua");
  const [reward, setReward] = useState<string>("Semua");
  const [difficulty, setDifficulty] = useState<string>("Semua");
  const [sort, setSort] = useState<"terbaru" | "reward">("terbaru");
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);

  const availableJobs = useMemo(
    () => jobs.filter((j) => j.status === "Tersedia" && hasUnreachedDeadline(j.deadline)),
    [jobs],
  );

  const filtered = useMemo(() => {
    const keyword = q.trim().toLowerCase();
    const list = availableJobs.filter((job) => {
      if (platform !== "Semua" && job.platform !== platform) return false;
      if (category !== "Semua" && taskCategoryOf(job) !== category) return false;
      if (difficulty !== "Semua" && difficultyOf(job) !== difficulty) return false;
      if (reward !== "Semua") {
        const value = effectiveReward(job);
        if (reward === "<25rb" && value >= 25000) return false;
        if (reward === "25rb–100rb" && (value < 25000 || value > 100000)) return false;
        if (reward === ">100rb" && value <= 100000) return false;
      }
      if (keyword && !`${job.title} ${job.brief} ${job.platform}`.toLowerCase().includes(keyword))
        return false;
      return true;
    });
    return list.sort((a, b) => {
      if (sort === "reward") return effectiveReward(b) - effectiveReward(a);
      return a.updatedAt < b.updatedAt ? 1 : -1;
    });
  }, [availableJobs, platform, category, reward, difficulty, q, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paged = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const filtersActive =
    platform !== "Semua" ||
    category !== "Semua" ||
    reward !== "Semua" ||
    difficulty !== "Semua" ||
    !!q.trim();

  const resetFilters = () => {
    setPlatform("Semua");
    setCategory("Semua");
    setReward("Semua");
    setDifficulty("Semua");
    setQ("");
    setPage(1);
  };

  const handleTaken = async () => {
    await refetch();
    onGoPekerjaan?.();
  };

  return (
    <div className="space-y-4">
      <SectionHeaderCard store={store} sessionAvatar={sessionAvatar} onGoProfil={onGoProfil} />
      <VerificationBanner status={verificationStatus} />

      <div className="rounded-2xl border border-border bg-card p-3.5 shadow-sm sm:p-4">
        <div className="flex flex-col gap-2.5 lg:flex-row lg:items-center">
          <div className="relative min-w-0 flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="pl-9"
              placeholder="Cari campaign, platform, atau kata kunci..."
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setPage(1);
              }}
            />
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:flex lg:flex-wrap">
            <Select
              value={platform}
              onValueChange={(v) => {
                setPlatform(v);
                setPage(1);
              }}
            >
              <SelectTrigger className="lg:w-[145px]">
                <SelectValue placeholder="Platform" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Semua">Semua platform</SelectItem>
                {["Instagram", "TikTok", "YouTube", "Facebook", "X (Twitter)"].map((p) => (
                  <SelectItem key={p} value={p}>
                    {p}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={category}
              onValueChange={(v) => {
                setCategory(v);
                setPage(1);
              }}
            >
              <SelectTrigger className="lg:w-[135px]">
                <SelectValue placeholder="Kategori" />
              </SelectTrigger>
              <SelectContent>
                {TASK_CATEGORIES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c === "Semua" ? "Semua kategori" : c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={reward}
              onValueChange={(v) => {
                setReward(v);
                setPage(1);
              }}
            >
              <SelectTrigger className="lg:w-[135px]">
                <SelectValue placeholder="Reward" />
              </SelectTrigger>
              <SelectContent>
                {REWARD_RANGES.map((r) => (
                  <SelectItem key={r} value={r}>
                    {r === "Semua" ? "Semua reward" : r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={difficulty}
              onValueChange={(v) => {
                setDifficulty(v);
                setPage(1);
              }}
            >
              <SelectTrigger className="lg:w-[125px]">
                <SelectValue placeholder="Kesulitan" />
              </SelectTrigger>
              <SelectContent>
                {DIFFICULTIES.map((d) => (
                  <SelectItem key={d} value={d}>
                    {d === "Semua" ? "Semua level" : d}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={sort}
              onValueChange={(v) => {
                setSort(v as typeof sort);
                setPage(1);
              }}
            >
              <SelectTrigger className="lg:w-[145px]">
                <SelectValue placeholder="Urutkan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="terbaru">Terbaru</SelectItem>
                <SelectItem value="reward">Reward tertinggi</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 text-[11px] text-muted-foreground">
          <span>
            {filtered.length} pekerjaan ditemukan
            {availableJobs.length !== filtered.length ? ` dari ${availableJobs.length}` : ""}
          </span>
          {filtersActive && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 gap-1 px-2 text-xs"
              onClick={resetFilters}
            >
              <RefreshCw className="h-3 w-3" /> Reset filter
            </Button>
          )}
        </div>
      </div>

      {paged.length === 0 ? (
        <EmptyState
          icon={<Search className="h-8 w-8" />}
          title={filtersActive ? "Tidak ada pekerjaan yang cocok" : "Belum ada pekerjaan tersedia"}
          desc={
            filtersActive
              ? "Coba ubah kata kunci atau reset filter untuk melihat campaign lain."
              : "Campaign baru akan muncul di sini. Cek kembali beberapa saat lagi."
          }
          action={
            filtersActive ? (
              <Button size="sm" variant="outline" onClick={resetFilters}>
                Reset filter
              </Button>
            ) : undefined
          }
        />
      ) : (
        <div className="grid gap-3 xl:grid-cols-2">
          {paged.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              store={store}
              hasPlatformAccount={verifiedPlatforms.has(job.platform.trim().toLowerCase())}
              onGoSosmed={onGoSosmed}
              onTaken={handleTaken}
              onUpdated={refetch}
            />
          ))}
        </div>
      )}

      {filtered.length > PAGE_SIZE && (
        <div className="flex items-center justify-between pt-1">
          <p className="text-xs text-muted-foreground">
            {(currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, filtered.length)}{" "}
            dari {filtered.length}
          </p>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              disabled={currentPage <= 1}
              onClick={() => setPage(currentPage - 1)}
              aria-label="Halaman sebelumnya"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="px-2 text-xs font-medium">
              {currentPage} / {totalPages}
            </span>
            <Button
              size="sm"
              variant="outline"
              disabled={currentPage >= totalPages}
              onClick={() => setPage(currentPage + 1)}
              aria-label="Halaman berikutnya"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

const MY_JOB_TABS = [
  { key: "semua", label: "Semua" },
  { key: "belum", label: "Belum Dikerjakan" },
  { key: "sedang", label: "Sedang Dikerjakan" },
  { key: "verifikasi", label: "Menunggu Verifikasi" },
  { key: "disetujui", label: "Disetujui" },
  { key: "ditolak", label: "Ditolak" },
] as const;
type MyJobTab = (typeof MY_JOB_TABS)[number]["key"];

function myJobTabOf(job: MergedJob): MyJobTab {
  if (job.status === "Diambil") return "belum";
  if (job.status === "Upload" || job.status === "Revisi") return "sedang";
  if (job.status === "Review") return "verifikasi";
  if (job.status === "Selesai") return "disetujui";
  if (job.status === "Ditolak") return "ditolak";
  return "semua";
}

function MyJobsSection({
  store,
  onGoSosmed,
  onGoCari,
  sessionAvatar,
}: {
  store: Store;
  onGoSosmed?: () => void;
  onGoCari?: () => void;
  sessionAvatar?: string;
}) {
  const { jobs, refetch } = useMergedJobs(store, true);
  const [tab, setTab] = useState<MyJobTab>("semua");
  const [q, setQ] = useState("");
  const [platform, setPlatform] = useState("Semua");
  const [page, setPage] = useState(1);

  const myJobs = useMemo(
    () =>
      jobs.filter((j) =>
        ["Diambil", "Upload", "Review", "Revisi", "Selesai", "Ditolak"].includes(j.status),
      ),
    [jobs],
  );

  const counts = useMemo(() => {
    const map: Record<MyJobTab, number> = {
      semua: myJobs.length,
      belum: 0,
      sedang: 0,
      verifikasi: 0,
      disetujui: 0,
      ditolak: 0,
    };
    for (const job of myJobs) map[myJobTabOf(job)] += 1;
    return map;
  }, [myJobs]);

  const filtered = useMemo(() => {
    const keyword = q.trim().toLowerCase();
    return myJobs
      .filter((job) => (tab === "semua" ? true : myJobTabOf(job) === tab))
      .filter((job) => (platform === "Semua" ? true : job.platform === platform))
      .filter((job) =>
        keyword ? `${job.title} ${job.brief}`.toLowerCase().includes(keyword) : true,
      )
      .sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));
  }, [myJobs, tab, q, platform]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paged = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <div className="space-y-4">
      <SectionHeaderCard store={store} sessionAvatar={sessionAvatar} />

      <div className="rounded-2xl border border-border bg-card p-3.5 shadow-sm sm:p-4">
        <div className="flex flex-col gap-2.5 sm:flex-row">
          <div className="relative min-w-0 flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="pl-9"
              placeholder="Cari pekerjaan saya..."
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setPage(1);
              }}
            />
          </div>
          <Select
            value={platform}
            onValueChange={(v) => {
              setPlatform(v);
              setPage(1);
            }}
          >
            <SelectTrigger className="sm:w-[180px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {["Semua", "Instagram", "TikTok", "YouTube", "Facebook", "X (Twitter)"].map((p) => (
                <SelectItem key={p} value={p}>
                  {p === "Semua" ? "Semua platform" : p}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="mt-3 flex gap-1.5 overflow-x-auto pb-1 scrollbar-slim">
          {MY_JOB_TABS.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => {
                setTab(item.key);
                setPage(1);
              }}
              className={cn(
                "shrink-0 rounded-full border px-3 py-1.5 text-[11px] font-semibold transition-colors sm:text-xs",
                tab === item.key
                  ? "border-brand bg-brand text-brand-foreground shadow-sm"
                  : "border-border bg-background text-muted-foreground hover:bg-muted/60 hover:text-foreground",
              )}
            >
              {item.label}
              <span
                className={cn(
                  "ml-1.5 rounded-full px-1.5 py-0.5 text-[9px]",
                  tab === item.key ? "bg-white/20" : "bg-muted",
                )}
              >
                {counts[item.key]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {paged.length === 0 ? (
        <EmptyState
          icon={<BriefcaseBusiness className="h-8 w-8" />}
          title={tab === "semua" ? "Belum ada pekerjaan" : "Tidak ada pekerjaan di kategori ini"}
          desc={
            tab === "semua"
              ? "Ambil pekerjaan dari marketplace untuk mulai mengumpulkan reward."
              : "Pilih tab lain atau ambil pekerjaan baru dari marketplace."
          }
          action={
            <Button size="sm" onClick={onGoCari} className="gradient-brand text-brand-foreground">
              <Search className="mr-1.5 h-4 w-4" /> Cari Pekerjaan
            </Button>
          }
        />
      ) : (
        <div className="space-y-3">
          {paged.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              store={store}
              hasPlatformAccount
              onGoSosmed={onGoSosmed}
              onUpdated={refetch}
            />
          ))}
        </div>
      )}

      {filtered.length > PAGE_SIZE && (
        <div className="flex items-center justify-between pt-1">
          <p className="text-xs text-muted-foreground">
            {(currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, filtered.length)}{" "}
            dari {filtered.length}
          </p>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              disabled={currentPage <= 1}
              onClick={() => setPage(currentPage - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="px-2 text-xs font-medium">
              {currentPage} / {totalPages}
            </span>
            <Button
              size="sm"
              variant="outline"
              disabled={currentPage >= totalPages}
              onClick={() => setPage(currentPage + 1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function ProofsSection({
  store,
  onGoSosmed,
  onGoCari,
}: {
  store: Store;
  onGoSosmed?: () => void;
  onGoCari?: () => void;
}) {
  const { jobs, refetch } = useMergedJobs(store, true);
  const [tab, setTab] = useState<"semua" | "review" | "selesai" | "ditolak">("semua");

  const proofJobs = useMemo(
    () =>
      jobs.filter(
        (j) => !!j.proofUrl || ["Review", "Revisi", "Selesai", "Ditolak"].includes(j.status),
      ),
    [jobs],
  );

  const filtered = useMemo(() => {
    if (tab === "review")
      return proofJobs.filter(
        (j) => j.status === "Review" || j.status === "Revisi" || j.status === "Upload",
      );
    if (tab === "selesai") return proofJobs.filter((j) => j.status === "Selesai");
    if (tab === "ditolak") return proofJobs.filter((j) => j.status === "Ditolak");
    return proofJobs;
  }, [proofJobs, tab]);

  const stats = [
    {
      label: "Menunggu Verifikasi",
      value: proofJobs.filter((j) => j.status === "Review" || j.status === "Revisi").length,
      tone: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
      icon: <Hourglass className="h-4 w-4" />,
    },
    {
      label: "Disetujui",
      value: proofJobs.filter((j) => j.status === "Selesai").length,
      tone: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
      icon: <CircleCheck className="h-4 w-4" />,
    },
    {
      label: "Ditolak",
      value: proofJobs.filter((j) => j.status === "Ditolak").length,
      tone: "bg-rose-500/15 text-rose-600 dark:text-rose-400",
      icon: <CircleX className="h-4 w-4" />,
    },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-2xl border border-border bg-card p-3 shadow-sm sm:p-4"
          >
            <span className={cn("grid h-8 w-8 place-items-center rounded-lg", s.tone)}>
              {s.icon}
            </span>
            <p className="mt-2 font-display text-xl font-bold">{s.value}</p>
            <p className="text-[10px] text-muted-foreground sm:text-[11px]">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-1.5 overflow-x-auto rounded-2xl border border-border bg-card p-2 shadow-sm">
        {[
          { key: "semua", label: "Semua Bukti", count: proofJobs.length },
          {
            key: "review",
            label: "Menunggu Review",
            count: proofJobs.filter((j) => j.status === "Review" || j.status === "Revisi").length,
          },
          {
            key: "selesai",
            label: "Disetujui",
            count: proofJobs.filter((j) => j.status === "Selesai").length,
          },
          {
            key: "ditolak",
            label: "Ditolak",
            count: proofJobs.filter((j) => j.status === "Ditolak").length,
          },
        ].map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => setTab(item.key as typeof tab)}
            className={cn(
              "shrink-0 rounded-full px-3 py-1.5 text-[11px] font-semibold transition-colors sm:text-xs",
              tab === item.key
                ? "bg-brand text-brand-foreground"
                : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
            )}
          >
            {item.label} <span className="opacity-70">({item.count})</span>
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<PackageCheck className="h-8 w-8" />}
          title="Belum ada bukti pekerjaan"
          desc="Bukti yang kamu unggah akan tersimpan di sini beserta status verifikasinya."
          action={
            <Button size="sm" onClick={onGoCari} className="gradient-brand text-brand-foreground">
              Cari Pekerjaan
            </Button>
          }
        />
      ) : (
        <div className="space-y-3">
          {filtered.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              store={store}
              hasPlatformAccount
              onGoSosmed={onGoSosmed}
              onUpdated={refetch}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* ==================== JOBS ==================== */

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
  const urlMatch =
    briefText.match(/https?:\/\/[^\s"'<>\)]+/i) ||
    briefText.match(
      /(?:(?:www\.)?(?:instagram\.com|tiktok\.com|youtube\.com|youtu\.be|twitter\.com|x\.com|facebook\.com|fb\.watch|t\.me)[^\s"'<>\)]*)/i,
    );
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
    if (
      lowerTitle.includes("like") &&
      (lowerTitle.includes("komentar") || lowerTitle.includes("comment"))
    ) {
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
  const instructMatch = briefText.match(
    /(?:Catatan Customer|Instruksi Customer|Detail Instruksi|Instruksi):\s*([\s\S]+)/i,
  );
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
  if (
    trimmed === "." ||
    trimmed === "-" ||
    trimmed.toLowerCase() === "snckjeh" ||
    trimmed.toLowerCase() === "null"
  ) {
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
  const [open, setOpen] = useState<null | "detail" | "upload" | "revisi" | "status" | "hasil">(
    null,
  );
  const [noAccountWarningOpen, setNoAccountWarningOpen] = useState(false);
  const [confirmTakeOpen, setConfirmTakeOpen] = useState(false);
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
    [job, currentStatus, currentProofUrl],
  );

  const handleTakeJob = async () => {
    if (!hasPlatformAccount && currentStatus === "Tersedia") {
      setNoAccountWarningOpen(true);
      return;
    }
    setConfirmTakeOpen(true);
  };

  const pickFiles = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) {
      setShot(null);
      setShotPreview(null);
      setConvertedCount(null);
      return;
    }

    const files = Array.from(fileList);
    const allowedExt = /\.(png|jpe?g|webp|pdf)$/i;
    const invalid = files.find(
      (file) =>
        !["image/png", "image/jpeg", "image/webp", "application/pdf"].includes(file.type) &&
        !allowedExt.test(file.name),
    );
    if (invalid) {
      toast.error(
        `Format file "${invalid.name}" tidak didukung. Gunakan JPG, PNG, WEBP, atau PDF.`,
      );
      return;
    }
    const oversize = files.find((file) => file.size > 5 * 1024 * 1024);
    if (oversize) {
      toast.error(`Ukuran file "${oversize.name}" melebihi 5MB. Kompres file lalu coba lagi.`);
      return;
    }
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

    const hasPdf = files.some(
      (f) => f.type === "application/pdf" || f.name.toLowerCase().endsWith(".pdf"),
    );
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
  const isOnlineBuzzer = isOnlineBuzzerCategory(store.state.profile.buzzerCategory);
  const jobLevel = isOnlineBuzzer ? (job.buzzerLevel ?? lv.level?.name ?? "Belum ditetapkan") : null;
  const buzzerPct = getBuzzerPercentageForLevel(jobLevel);
  const grossPrice = Math.max(0, job.grossPrice ?? 0);
  const levelPayout = isOnlineBuzzer ? Number(lv.level?.payout ?? 0) : 0;
  const payout = (() => {
    // Job yang sudah diambil memakai snapshot payout dari database. Ini
    // mencegah nominal berubah ketika level buzzer naik setelah job diambil.
    if (currentStatus !== "Tersedia") {
      const snapshot = Number(job.buzzerAmount ?? job.payout ?? 0);
      if (snapshot > 0) return Math.round(snapshot);
    }
    if (grossPrice <= 0) return 0;
    if (!isOnlineBuzzer) {
      const snapshot = Number(job.buzzerAmount ?? job.payout ?? 0);
      return Math.round(snapshot > 0 ? snapshot : 0);
    }
    // Opsi A: nominal tetap per job mengikuti payout level buzzer (payout_per_job).
    if (levelPayout > 0) return Math.round(levelPayout);
    const fallbackPct = getBuzzerPercentageForLevel(jobLevel);
    return Math.round((grossPrice * fallbackPct) / 100);
  })();
  const buzzerPercentage = isOnlineBuzzer ? buzzerPct : 0;

  const parsed = useMemo(
    () => parseBuzzerJobBrief(job.brief, job.title, job.platform),
    [job.brief, job.title, job.platform],
  );

  const displayBrief = useMemo(() => {
    if (!job.brief) return "";
    if (
      job.brief.includes("📌") ||
      job.brief.includes("Jenis Tugas:") ||
      job.brief.includes("Link Target:")
    ) {
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
    if (!proof.trim())
      return toast.error("Link postingan wajib diisi agar admin dapat memverifikasi pengerjaan.");
    setLoading(true);
    try {
      // Job demo yang masih tersimpan di localStorage disambungkan dulu ke
      // Supabase supaya bukti dan statusnya tidak hanya tersimpan di browser.
      const targetJobId =
        remoteId ??
        (await ensureCampaignJobInSupabase(
          job,
          store.state.profile.email,
          store.state.profile.name,
        ));
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
    if (!proof.trim())
      return toast.error("Link postingan wajib diisi agar admin dapat memverifikasi pengerjaan.");
    setLoading(true);
    try {
      const targetJobId =
        remoteId ??
        (await ensureCampaignJobInSupabase(
          job,
          store.state.profile.email,
          store.state.profile.name,
        ));
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
        return (
          <Button
            size="sm"
            disabled={loading}
            onClick={handleTakeJob}
            className="gradient-brand text-brand-foreground shadow-glow"
          >
            {loading ? "Memproses..." : "Ambil Job"}
          </Button>
        );
      case "Diambil":
        return (
          <Button
            size="sm"
            onClick={() => setOpen("upload")}
            className="gradient-brand text-brand-foreground"
          >
            <Upload className="mr-1 h-3.5 w-3.5" /> Upload Bukti
          </Button>
        );
      case "Review":
        return (
          <Button size="sm" variant="outline" onClick={() => setOpen("status")}>
            Cek Status
          </Button>
        );
      case "Revisi":
        return (
          <Button
            size="sm"
            onClick={() => setOpen("revisi")}
            className="bg-amber-500 text-white hover:bg-amber-600"
          >
            Perbaiki Tugas
          </Button>
        );
      case "Selesai":
        return (
          <Button size="sm" variant="outline" onClick={() => setOpen("hasil")}>
            Lihat Hasil
          </Button>
        );
      case "Ditolak":
        return (
          <Button size="sm" variant="outline" onClick={() => setOpen("status")}>
            Lihat Alasan
          </Button>
        );
      case "Upload":
        return (
          <Button size="sm" variant="outline" onClick={() => setOpen("status")}>
            Cek Status
          </Button>
        );
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
              <span
                className={cn(
                  "inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold",
                  statusVisual(currentStatus),
                )}
              >
                {jobStatusLabel(currentJob)}
              </span>
              {currentStatus === "Tersedia" && (job.slotsLeft ?? 1) > 1 && (
                <span className="inline-flex rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                  {job.slotsLeft} slot tersisa
                </span>
              )}
            </div>

            <h4 className="mt-2 truncate font-display text-base font-bold">{job.title}</h4>
            <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{displayBrief}</p>

            <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" /> Deadline {job.deadline}
              </span>
              <span className="inline-flex items-center gap-1">
                <DollarSign className="h-3.5 w-3.5" /> Payout {formatIDR(payout)}
              </span>
              <span className="inline-flex items-center gap-1">
                <Hourglass className="h-3.5 w-3.5" /> Estimasi ±5 menit
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-accent px-2 py-0.5 font-semibold text-accent-foreground">
                {lv.level ? `${lv.level.emoji} ${lv.level.name}` : "Level belum ditetapkan"}
              </span>
            </div>
            {currentStatus === "Revisi" && job.note && (
              <p className="mt-3 flex items-start gap-2 rounded-lg bg-amber-50 p-2 text-xs text-amber-800">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" /> {job.note}
              </p>
            )}
          </div>
          <div className="flex shrink-0 flex-col gap-2">
            {primaryAction}
            {currentStatus === "Ditolak" && (
              <Button
                size="sm"
                className="gradient-brand text-brand-foreground"
                onClick={() => setOpen("revisi")}
              >
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
              <span
                className={cn(
                  "inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold",
                  statusVisual(currentStatus),
                )}
              >
                {jobStatusLabel(currentJob)}
              </span>
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 text-sm">
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-border bg-muted/40 p-3">
                <p className="text-xs text-muted-foreground">Fee yang kamu terima</p>
                <p className="font-display text-lg font-bold">{formatIDR(payout)}</p>
                <p className="text-xs text-muted-foreground">
                  Sudah termasuk potongan admin · Level {lv.level?.name ?? jobLevel}
                </p>
              </div>
              <div className="rounded-xl border border-border bg-muted/40 p-3">
                <p className="text-xs text-muted-foreground">Deadline</p>
                <p className="font-display text-lg font-bold">{job.deadline}</p>
                <p className="text-xs text-muted-foreground">Kirim bukti sebelum tanggal ini</p>
              </div>
            </div>

            <section className="rounded-xl border border-border bg-muted/30 p-3">
              <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Rincian Pendapatan
              </h4>
              <div className="grid gap-2 text-sm sm:grid-cols-2">
                <p>
                  <span className="text-muted-foreground">Level:</span> <b>{jobLevel}</b>
                </p>
                <p>
                  <span className="text-muted-foreground">Yang kamu dapatkan:</span>{" "}
                  <b>{formatIDR(payout)}</b>
                </p>
              </div>
            </section>

            {/* Tugas */}
            <section>
              <h4 className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Tugas
              </h4>
              <div className="rounded-xl border border-border p-3.5 space-y-2.5 bg-muted/20">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                      Perintah:
                    </span>
                    <span className="font-bold text-foreground text-sm">{parsed.taskAction}</span>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-md bg-accent px-2 py-0.5 text-xs font-semibold text-accent-foreground">
                    {PLATFORM_ICON[job.platform]} {job.platform}
                  </span>
                </div>

                {parsed.targetUrl ? (
                  <div className="border-t border-border pt-2.5">
                    <p className="text-xs text-muted-foreground mb-1.5">
                      Link Target (klik untuk langsung membuka):
                    </p>
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
                      <AlertCircle className="h-3.5 w-3.5 shrink-0" /> Link belum dicantumkan oleh
                      customer
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
              <h4 className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Syarat
              </h4>
              <ul className="list-inside list-disc space-y-1 rounded-xl border border-border p-3 text-muted-foreground">
                <li>Akun {job.platform} kamu aktif & sudah terverifikasi admin.</li>
                <li>Konten orisinal, tidak mengandung SARA atau unsur negatif.</li>
                <li>Postingan tidak dihapus minimal 7 hari setelah tayang.</li>
              </ul>
            </section>

            <section>
              <h4 className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Instruksi Pengerjaan
              </h4>
              <ol className="list-inside list-decimal space-y-1.5 rounded-xl border border-border p-3 text-muted-foreground text-xs leading-relaxed">
                <li>
                  Ambil job ini dengan menekan tombol <b>Ambil Job</b> agar slot terkunci untukmu.
                </li>
                {parsed.targetUrl ? (
                  <li>
                    Buka <b>Link Video/Postingan Target</b> di atas pada aplikasi {job.platform}.
                  </li>
                ) : (
                  <li>Buka aplikasi {job.platform} sesuai instruksi customer.</li>
                )}
                {parsed.taskAction.toLowerCase().includes("like") &&
                parsed.taskAction.toLowerCase().includes("komentar") ? (
                  <>
                    <li>
                      Berikan <b>Like (Suka)</b> pada postingan/video target tersebut menggunakan
                      akun {job.platform} terverifikasi.
                    </li>
                    <li>
                      Tulis <b>komentar positif</b> yang relevan dan sesuai catatan instruksi
                      customer.
                    </li>
                    <li>
                      Ambil <b>Screenshot (tangkapan layar)</b> bukti bahwa kamu sudah Like dan
                      komentar kamu sudah muncul.
                    </li>
                  </>
                ) : parsed.taskAction.toLowerCase().includes("like") ? (
                  <>
                    <li>
                      Berikan <b>Like (Suka)</b> pada postingan/video target tersebut.
                    </li>
                    <li>
                      Ambil <b>Screenshot (tangkapan layar)</b> bukti bahwa kamu sudah menekan
                      tombol Like.
                    </li>
                  </>
                ) : parsed.taskAction.toLowerCase().includes("komentar") ||
                  parsed.taskAction.toLowerCase().includes("comment") ? (
                  <>
                    <li>
                      Tulis <b>komentar positif dan relevan</b> pada postingan/video target.
                    </li>
                    <li>
                      Ambil <b>Screenshot (tangkapan layar)</b> bukti komentar kamu yang sudah
                      terpublikasi.
                    </li>
                  </>
                ) : parsed.taskAction.toLowerCase().includes("follow") ||
                  parsed.taskAction.toLowerCase().includes("ikuti") ? (
                  <>
                    <li>
                      Klik tombol <b>Ikuti (Follow)</b> pada akun target menggunakan akun{" "}
                      {job.platform} kamu.
                    </li>
                    <li>
                      Ambil <b>Screenshot (tangkapan layar)</b> bukti bahwa status akun tersebut
                      sudah Mengikuti (Following).
                    </li>
                  </>
                ) : parsed.taskAction.toLowerCase().includes("share") ||
                  parsed.taskAction.toLowerCase().includes("bagikan") ? (
                  <>
                    <li>
                      <b>Bagikan (Share)</b> konten target ke timeline / story akun {job.platform}{" "}
                      kamu.
                    </li>
                    <li>
                      Ambil <b>Screenshot (tangkapan layar)</b> bukti bahwa konten telah berhasil
                      kamu bagikan.
                    </li>
                  </>
                ) : (
                  <>
                    <li>
                      Lakukan aksi <b>{parsed.taskAction}</b> sesuai instruksi customer di atas.
                    </li>
                    <li>
                      Ambil <b>Screenshot (tangkapan layar)</b> bukti pengerjaan kamu.
                    </li>
                  </>
                )}
                <li>
                  Kembali ke BuzzHub, klik <b>Upload Bukti</b>, lalu unggah file screenshot
                  tersebut.
                </li>
              </ol>
            </section>

            <section>
              <h4 className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Bukti yang Dikirim
              </h4>
              <p className="rounded-xl border border-border p-3 text-muted-foreground">
                Link publik postingan/video di {job.platform} (contoh: https://...). Pastikan bisa
                dibuka tanpa login.
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
            <Button variant="outline" onClick={() => setOpen(null)}>
              Tutup
            </Button>
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
              <Button
                size="lg"
                onClick={() => setOpen("upload")}
                className="w-full gradient-brand text-brand-foreground sm:w-auto"
              >
                <Upload className="mr-1 h-4 w-4" /> Upload Bukti
              </Button>
            ) : null}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Konfirmasi Ambil Job */}
      <Dialog open={confirmTakeOpen} onOpenChange={setConfirmTakeOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <BriefcaseBusiness className="h-5 w-5 text-brand" /> Ambil pekerjaan ini?
            </DialogTitle>
            <DialogDescription>
              Pastikan akun kamu memenuhi persyaratan. Setelah diambil, pekerjaan akan masuk ke menu
              Pekerjaan Saya.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2.5 text-sm">
            <div className="rounded-xl border border-border bg-muted/30 p-3">
              <p className="font-semibold">{job.title}</p>
              <p className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                {platformIcon(job.platform)} {job.platform} ·{" "}
                {parsed.taskAction || "Tugas campaign"}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="rounded-lg border border-border p-2.5">
                <p className="text-muted-foreground">Reward</p>
                <p className="mt-0.5 font-bold">{formatIDR(payout)}</p>
              </div>
              <div className="rounded-lg border border-border p-2.5">
                <p className="text-muted-foreground">Deadline</p>
                <p className="mt-0.5 font-semibold">{job.deadline || "-"}</p>
              </div>
            </div>
            <p className="rounded-lg bg-amber-50 p-2.5 text-[11px] text-amber-800 dark:bg-amber-950/30 dark:text-amber-200">
              Satu pekerjaan hanya dapat diambil satu kali. Selesaikan sebelum deadline agar reward
              tetap cair.
            </p>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setConfirmTakeOpen(false)}>
              Batal
            </Button>
            <Button
              disabled={loading}
              className="gradient-brand text-brand-foreground"
              onClick={async () => {
                setConfirmTakeOpen(false);
                await doTake();
              }}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Memproses...
                </>
              ) : (
                <>
                  <CheckCircle2 className="mr-1.5 h-4 w-4" /> Ya, Ambil Job
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Upload Bukti */}
      <Dialog open={open === "upload"} onOpenChange={(v) => !v && setOpen(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Bukti — {job.title}</DialogTitle>
            <DialogDescription>
              Unggah screenshot sebagai bukti pesanan sudah dikerjakan.
            </DialogDescription>
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
              * Format: PNG, JPG, JPEG, atau PDF. Jika bukti pengerjaan lebih dari 1 gambar, silakan
              jadikan 1 file PDF (atau pilih beberapa gambar sekaligus untuk digabung otomatis
              menjadi PDF).
            </p>

            {converting && (
              <div className="flex items-center gap-2 rounded-xl border border-primary/20 bg-primary/5 p-3 text-xs text-primary animate-pulse">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Sedang menggabungkan gambar menjadi 1 file PDF...</span>
              </div>
            )}

            {!converting &&
              shot &&
              (shot.type === "application/pdf" || shot.name.toLowerCase().endsWith(".pdf")) && (
                <div className="flex items-center justify-between rounded-xl border border-rose-500/20 bg-rose-500/10 p-3 text-xs">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <FileText className="h-6 w-6 text-rose-600 dark:text-rose-400 shrink-0" />
                    <div className="min-w-0">
                      <p className="font-semibold text-foreground truncate">{shot.name}</p>
                      <p className="text-[11px] text-muted-foreground">
                        {(shot.size / 1024).toFixed(1)} KB · Dokumen PDF{" "}
                        {convertedCount ? `(${convertedCount} gambar digabung)` : ""}
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
                <img
                  src={shotPreview}
                  alt="Pratinjau screenshot bukti"
                  className="max-h-56 w-full object-contain bg-black/5"
                />
              </div>
            )}

            <Label htmlFor="proof">Link postingan (wajib)</Label>
            <Input
              id="proof"
              placeholder="https://instagram.com/p/... atau https://tiktok.com/@..."
              value={proof}
              onChange={(e) => setProof(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(null)}>
              Batal
            </Button>
            <Button
              onClick={doUpload}
              disabled={loading || converting}
              className="gradient-brand text-brand-foreground"
            >
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
            <DialogDescription>
              Silakan perbaiki pengerjaan sesuai alasan Admin, kemudian upload bukti terbaru.
            </DialogDescription>
          </DialogHeader>
          {(job.rejection_reason || job.note) && (
            <p className="rounded-lg bg-amber-50 p-3 text-sm text-amber-800">
              Alasan Admin: {job.rejection_reason || job.note}
            </p>
          )}

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
              * Format: PNG, JPG, JPEG, atau PDF. Jika bukti pengerjaan lebih dari 1 gambar, silakan
              jadikan 1 file PDF (atau pilih beberapa gambar sekaligus untuk digabung otomatis
              menjadi PDF).
            </p>

            {converting && (
              <div className="flex items-center gap-2 rounded-xl border border-primary/20 bg-primary/5 p-3 text-xs text-primary animate-pulse">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Sedang menggabungkan gambar menjadi 1 file PDF...</span>
              </div>
            )}

            {!converting &&
              shot &&
              (shot.type === "application/pdf" || shot.name.toLowerCase().endsWith(".pdf")) && (
                <div className="flex items-center justify-between rounded-xl border border-rose-500/20 bg-rose-500/10 p-3 text-xs">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <FileText className="h-6 w-6 text-rose-600 dark:text-rose-400 shrink-0" />
                    <div className="min-w-0">
                      <p className="font-semibold text-foreground truncate">{shot.name}</p>
                      <p className="text-[11px] text-muted-foreground">
                        {(shot.size / 1024).toFixed(1)} KB · Dokumen PDF{" "}
                        {convertedCount ? `(${convertedCount} gambar digabung)` : ""}
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
                <img
                  src={shotPreview}
                  alt="Pratinjau screenshot bukti baru"
                  className="max-h-56 w-full object-contain bg-black/5"
                />
              </div>
            )}

            <Label htmlFor="proof2">Link postingan (wajib)</Label>
            <Input
              id="proof2"
              placeholder="https://instagram.com/p/... atau https://tiktok.com/@..."
              value={proof}
              onChange={(e) => setProof(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(null)}>
              Batal
            </Button>
            <Button
              onClick={doResubmit}
              disabled={loading || converting}
              className="gradient-brand text-brand-foreground"
            >
              {loading ? "Mengirim..." : converting ? "Memproses PDF..." : "Kirim Ulang"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Status */}
      <Dialog open={open === "status"} onOpenChange={(v) => !v && setOpen(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {currentStatus === "Revisi" || currentStatus === "Ditolak"
                ? "Pengerjaan Perlu Revisi"
                : `Status: ${jobStatusLabel(currentJob)}`}
            </DialogTitle>
            <DialogDescription>
              {currentStatus === "Review" &&
                (currentJob.admin_verified_at
                  ? "Pengerjaan sudah diverifikasi admin dan sedang menunggu ulasan customer."
                  : "Bukti kamu sedang menunggu verifikasi admin. Rata-rata 1×24 jam.")}
              {(currentStatus === "Revisi" || currentStatus === "Ditolak") && "Alasan Admin:"}
              {currentStatus === "Upload" && "Menunggu unggahan bukti."}
            </DialogDescription>
          </DialogHeader>
          {currentStatus === "Revisi" || currentStatus === "Ditolak" ? (
            <div className="space-y-3 text-sm">
              <p className="rounded-lg bg-rose-50 p-3 text-rose-800">
                {currentJob.rejection_reason ||
                  currentJob.note ||
                  "Pekerjaan ditolak. Silakan perbaiki dan upload ulang."}
              </p>
              {currentJob.rejected_at && (
                <p className="text-muted-foreground">
                  Tanggal penolakan: {new Date(currentJob.rejected_at).toLocaleString("id-ID")}
                </p>
              )}
              <p className="font-semibold text-amber-700">Status: Perlu Diperbaiki</p>
              {currentProofUrl && (
                <div className="flex flex-col gap-1.5 text-xs">
                  <span className="text-muted-foreground font-medium">Bukti sebelumnya:</span>
                  <ProofLink proofUrl={currentProofUrl} />
                </div>
              )}
              <Button
                className="gradient-brand text-brand-foreground"
                onClick={() => setOpen("revisi")}
              >
                Upload Ulang
              </Button>
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
            <p>
              <span className="text-muted-foreground">Level:</span>{" "}
              <span className="font-bold">{jobLevel}</span>
            </p>
            <p>
              <span className="text-muted-foreground">Payout yang kamu terima:</span>{" "}
              <span className="font-bold text-emerald-700">{formatIDR(payout)}</span>
            </p>
            <p>
              <span className="text-muted-foreground">Status pendapatan:</span>{" "}
              <span className="font-bold text-emerald-700">Sudah dikreditkan</span>
            </p>
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
              Kamu belum memiliki akun{" "}
              <span className="font-semibold text-foreground">{job.platform}</span> yang
              terverifikasi untuk mengambil job ini.
            </DialogDescription>
          </DialogHeader>

          <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-2 text-xs leading-relaxed text-foreground">
            <div className="flex items-center gap-2 font-semibold text-primary">
              <Sparkles className="h-4 w-4" />
              <span>Rekomendasi untuk Buzzer:</span>
            </div>
            <p className="text-muted-foreground">
              Ayo daftarkan akun media sosialmu sebanyak-banyaknya! Semakin banyak akun media sosial
              yang kamu miliki (Instagram, TikTok, Twitter/X, dll), semakin banyak pilihan job yang
              bisa kamu kerjakan dan semakin besar penghasilanmu.
            </p>
            <p className="text-muted-foreground">
              💡 <b>Bisa tambah akun lagi:</b> Jika kamu sudah punya akun {job.platform}, kamu juga
              tetap bisa menambahkan akun {job.platform} lainnya. Bayaran job tetap disesuaikan
              dengan followers media sosialmu!
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
  const [detailEarning, setDetailEarning] = useState<Earning | null>(null);
  const [detailWithdrawal, setDetailWithdrawal] = useState<Withdrawal | null>(null);
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
  const monthTotal = state.earnings
    .filter((e) => e.status === "Berhasil" && new Date(e.date).getMonth() === now.getMonth())
    .reduce((a, e) => a + e.amount, 0);
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const weekTotal = state.earnings
    .filter((e) => e.status === "Berhasil" && new Date(e.date) >= weekAgo)
    .reduce((a, e) => a + e.amount, 0);
  const pendingTotal = state.earnings
    .filter((e) => e.status === "Pending" || e.status === "Diproses")
    .reduce((a, e) => a + e.amount, 0);
  const totalIncome = state.earnings
    .filter((e) => e.status !== "Ditolak")
    .reduce((a, e) => a + Number(e.amount || 0), 0);
  const totalWithdrawn = (Array.isArray(state.withdrawals) ? state.withdrawals : [])
    .filter((w) => w.status !== "Ditolak")
    .reduce((sum, w) => sum + Number(w.amount || 0), 0);
  const pendingWithdrawalSum = (Array.isArray(state.withdrawals) ? state.withdrawals : [])
    .filter((w) => w.status === "Menunggu")
    .reduce((sum, w) => sum + Number(w.amount || 0), 0);
  const pendingBalance = pendingTotal + pendingWithdrawalSum;

  const inRange = (d: string) => (!from || d >= from) && (!to || d <= to);
  const earningsF = (Array.isArray(state.earnings) ? state.earnings : []).filter((e) =>
    inRange(e.date),
  );
  const withdrawsF = (Array.isArray(state.withdrawals) ? state.withdrawals : []).filter((w) =>
    inRange(w.date),
  );

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
        return toast.error(
          `Saldo yang siap ditarik adalah ${formatIDR(availableToWithdraw)} (${formatIDR(pendingWithdrawalTotal)} sedang menunggu verifikasi admin).`,
        );
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
    const ok = await store.requestWithdrawal(
      numAmount,
      methodLabel,
      digitsOnlyAccountNo,
      accountName.trim(),
    );
    setLoading(false);
    if (ok) {
      setWOpen(false);
      resetWithdrawForm();
      toast.success(
        `Pengajuan pencairan sebesar ${formatIDR(numAmount)} berhasil dikirim! Saldo akan dipotong setelah diverifikasi & disetujui admin.`,
      );
    } else {
      toast.error("Gagal memproses pengajuan pencairan saldo. Silakan coba lagi.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-border gradient-brand p-5 text-brand-foreground shadow-glow">
          <p className="text-xs uppercase tracking-wide opacity-90">Saldo Tersedia</p>
          <p className="mt-1 font-display text-2xl font-bold">{formatIDR(availableToWithdraw)}</p>
          <p className="mt-1 text-xs opacity-90">Bisa dicairkan sekarang</p>
          <Button
            size="sm"
            variant="secondary"
            className="mt-3"
            onClick={handleOpenWithdraw}
            disabled={availableToWithdraw <= 0}
          >
            <Wallet className="mr-1 h-4 w-4" /> Tarik Saldo
          </Button>
        </div>
        <StatCard
          label="Total Penghasilan"
          value={formatIDR(totalIncome)}
          hint="Akumulasi reward yang disetujui"
          icon={<TrendingUp className="h-5 w-5" />}
        />
        <StatCard
          label="Saldo Pending"
          value={formatIDR(pendingBalance)}
          hint="Menunggu verifikasi admin"
          icon={<Hourglass className="h-5 w-5" />}
        />
        <StatCard
          label="Total Penarikan"
          value={formatIDR(totalWithdrawn)}
          hint="Seluruh pengajuan pencairan"
          icon={<Banknote className="h-5 w-5" />}
        />
      </div>

      <div className="flex flex-wrap items-end gap-3 rounded-2xl border border-border bg-card p-4">
        <div>
          <Label className="text-xs">Dari</Label>
          <Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
        </div>
        <div>
          <Label className="text-xs">Sampai</Label>
          <Input type="date" value={to} onChange={(e) => setTo(e.target.value)} />
        </div>
        <Button
          variant="outline"
          onClick={() => {
            setFrom("");
            setTo("");
          }}
        >
          <RefreshCw className="mr-1 h-4 w-4" /> Reset
        </Button>
        <div className="ml-auto flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            onClick={() => {
              exportToExcel("penghasilan-buzzer", "Penghasilan", earningsF, [
                { header: "Tanggal", accessor: (e) => e.date },
                { header: "Job", accessor: (e) => e.jobTitle },
                { header: "Status", accessor: (e) => e.status },
                { header: "Nominal (Rp)", accessor: (e) => e.amount },
              ]);
              toast.success("Riwayat pembayaran diekspor ke Excel");
            }}
          >
            <FileSpreadsheet className="mr-1 h-4 w-4" /> Excel
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              const totalE = earningsF.reduce((a, e) => a + e.amount, 0);
              const totalW = withdrawsF.reduce((a, w) => a + w.amount, 0);
              exportToPDF(
                "penghasilan-buzzer",
                "Laporan Keuangan Buzzer",
                earningsF,
                [
                  { header: "Tanggal", accessor: (e) => e.date },
                  { header: "Job", accessor: (e) => e.jobTitle },
                  { header: "Status", accessor: (e) => e.status },
                  { header: "Nominal (Rp)", accessor: (e) => e.amount },
                ],
                [
                  { label: "Total Pembayaran", value: formatIDR(totalE) },
                  { label: "Total Pencairan", value: formatIDR(totalW) },
                ],
              );
              toast.success("Laporan keuangan diekspor ke PDF");
            }}
          >
            <FileDown className="mr-1 h-4 w-4" /> PDF
          </Button>
          <Button onClick={handleOpenWithdraw} className="gradient-brand text-brand-foreground">
            <Wallet className="mr-1 h-4 w-4" /> Cairkan Saldo
          </Button>
        </div>
      </div>

      <Tabs defaultValue="earnings">
        <TabsList className="grid h-auto w-full grid-cols-2 gap-1">
          <TabsTrigger
            value="earnings"
            className="whitespace-normal px-2 py-2 text-[11px] leading-tight sm:text-sm"
          >
            Riwayat Pembayaran ({earningsF.length})
          </TabsTrigger>
          <TabsTrigger
            value="withdrawals"
            className="whitespace-normal px-2 py-2 text-[11px] leading-tight sm:text-sm"
          >
            Riwayat Pencairan ({withdrawsF.length})
          </TabsTrigger>
        </TabsList>
        <TabsContent value="earnings" className="mt-4">
          <div className="overflow-hidden rounded-2xl border border-border bg-card">
            {/* Desktop table */}
            <div className="hidden md:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tanggal</TableHead>
                    <TableHead>Job</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Nominal</TableHead>
                    <TableHead className="w-[72px] text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {earningsF.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                        Tidak ada data.
                      </TableCell>
                    </TableRow>
                  )}
                  {paginatedEarnings.map((e) => (
                    <TableRow
                      key={e.id}
                      className="cursor-pointer"
                      title="Klik untuk melihat detail pembayaran"
                      onClick={() => setDetailEarning(e)}
                    >
                      <TableCell className="text-xs">{e.date}</TableCell>
                      <TableCell>{e.jobTitle}</TableCell>
                      <TableCell>
                        <StatusBadge status={e.status} />
                      </TableCell>
                      <TableCell className="text-right font-semibold">
                        {formatIDR(e.amount)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-primary"
                          aria-label={`Lihat detail ${e.jobTitle}`}
                          onClick={(ev) => {
                            ev.stopPropagation();
                            setDetailEarning(e);
                          }}
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            {/* Mobile cards */}
            <div className="divide-y divide-border md:hidden">
              {earningsF.length === 0 && (
                <p className="py-8 text-center text-sm text-muted-foreground">Tidak ada data.</p>
              )}
              {paginatedEarnings.map((e) => (
                <button
                  key={e.id}
                  type="button"
                  onClick={() => setDetailEarning(e)}
                  className="flex w-full items-center gap-3 p-3.5 text-left transition-colors active:bg-muted/50"
                >
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-brand/10 text-brand">
                    <Receipt className="h-4 w-4" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold">{e.jobTitle}</span>
                    <span className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-muted-foreground">
                      <span>{e.date}</span>
                      <StatusBadge status={e.status} />
                    </span>
                  </span>
                  <span className="shrink-0 text-right">
                    <span className="block text-sm font-bold">{formatIDR(e.amount)}</span>
                    <span className="mt-0.5 block text-[10px] text-primary">Lihat detail</span>
                  </span>
                </button>
              ))}
            </div>
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
            {/* Desktop table */}
            <div className="hidden md:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tanggal</TableHead>
                    <TableHead>Metode & Rekening</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Keterangan / Bukti</TableHead>
                    <TableHead className="text-right">Nominal</TableHead>
                    <TableHead className="w-[72px] text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {withdrawsF.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                        Tidak ada pencairan.
                      </TableCell>
                    </TableRow>
                  )}
                  {paginatedWithdrawals.map((w) => (
                    <TableRow
                      key={w.id}
                      className="cursor-pointer"
                      title="Klik untuk melihat detail pencairan"
                      onClick={() => setDetailWithdrawal(w)}
                    >
                      <TableCell className="text-xs">{w.date}</TableCell>
                      <TableCell>
                        <div className="font-medium text-xs">{w.method}</div>
                        {w.accountNo && (
                          <div className="text-[11px] text-muted-foreground">{w.accountNo}</div>
                        )}
                      </TableCell>
                      <TableCell>
                        <StatusBadge
                          status={w.status === "Menunggu" ? "Menunggu Verifikasi" : w.status}
                        />
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
                                onClick={(ev) => {
                                  ev.stopPropagation();
                                  setViewingProofUrl(w.proofUrl || null);
                                }}
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
                            <div className="font-medium">
                              Ditolak admin {w.adminNote ? `: "${w.adminNote}"` : ""}
                            </div>
                            <div className="text-[10px] text-muted-foreground">
                              (Saldo tetap aman)
                            </div>
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-right font-semibold">
                        {formatIDR(w.amount)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-primary"
                          aria-label={`Lihat detail pencairan ${formatIDR(w.amount)}`}
                          onClick={(ev) => {
                            ev.stopPropagation();
                            setDetailWithdrawal(w);
                          }}
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            {/* Mobile cards */}
            <div className="divide-y divide-border md:hidden">
              {withdrawsF.length === 0 && (
                <p className="py-8 text-center text-sm text-muted-foreground">
                  Tidak ada pencairan.
                </p>
              )}
              {paginatedWithdrawals.map((w) => (
                <button
                  key={w.id}
                  type="button"
                  onClick={() => setDetailWithdrawal(w)}
                  className="flex w-full items-start gap-3 p-3.5 text-left transition-colors active:bg-muted/50"
                >
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                    <Banknote className="h-4 w-4" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold">{w.method}</span>
                    <span className="mt-0.5 block text-[11px] text-muted-foreground">
                      {w.date}
                      {w.accountNo ? ` · ${w.accountNo}` : ""}
                    </span>
                    <span className="mt-1 block">
                      <StatusBadge
                        status={w.status === "Menunggu" ? "Menunggu Verifikasi" : w.status}
                      />
                    </span>
                  </span>
                  <span className="shrink-0 text-right">
                    <span className="block text-sm font-bold">{formatIDR(w.amount)}</span>
                    <span className="mt-0.5 block text-[10px] text-primary">Lihat detail</span>
                  </span>
                </button>
              ))}
            </div>
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
                  Sedang dalam verifikasi admin:{" "}
                  <b className="text-amber-600 dark:text-amber-400">
                    {formatIDR(pendingWithdrawalTotal)}
                  </b>{" "}
                  (Sisa yang siap dicairkan:{" "}
                  <b className="text-emerald-600 dark:text-emerald-400">
                    {formatIDR(availableToWithdraw)}
                  </b>
                  )
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
                        amount === String(val) &&
                          "border-primary bg-primary/10 text-primary font-bold shadow-xs",
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
                      amount === String(availableToWithdraw) &&
                        "border-primary bg-primary/10 text-primary font-bold shadow-xs",
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
                    : "border-border bg-muted/40 text-foreground",
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
                        : "text-emerald-600 dark:text-emerald-400 font-bold",
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
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Bank">Transfer Bank</SelectItem>
                    <SelectItem value="E-Wallet">E-Wallet</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>{methodType === "Bank" ? "Nama Bank" : "Jenis E-Wallet"}</Label>
                <Select value={provider} onValueChange={setProvider}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(methodType === "Bank" ? BANKS : EWALLETS).map((p) => (
                      <SelectItem key={p} value={p}>
                        {p}
                      </SelectItem>
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
              <Label>
                {methodType === "Bank"
                  ? "Nama Pemilik Rekening (a.n.)"
                  : "Nama Akun E-Wallet (a.n.)"}
              </Label>
              <Input
                type="text"
                placeholder="Contoh: Budi Santoso"
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
                className="mt-1"
              />
              <p className="mt-1 text-[11px] text-muted-foreground">
                Pastikan nama sesuai dengan yang terdaftar di bank/e-wallet untuk mempercepat proses
                verifikasi admin.
              </p>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setWOpen(false)}>
              Batal
            </Button>
            <Button
              onClick={submitWithdraw}
              disabled={
                loading ||
                !amount ||
                Number(amount) <= 0 ||
                Number(amount) > availableToWithdraw ||
                !accountNo ||
                !accountName.trim()
              }
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

      {/* Detail Riwayat Pembayaran */}
      <Dialog
        open={!!detailEarning}
        onOpenChange={(open) => {
          if (!open) setDetailEarning(null);
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Receipt className="h-5 w-5 text-brand" />
              Detail Pembayaran
            </DialogTitle>
            <DialogDescription>
              Rincian reward pekerjaan yang tercatat di dompet kamu.
            </DialogDescription>
          </DialogHeader>
          {detailEarning && (
            <div className="space-y-4">
              <div className="rounded-xl border border-brand/20 bg-brand/5 p-4">
                <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                  Nominal diterima
                </p>
                <p className="mt-0.5 font-display text-2xl font-bold text-brand">
                  {formatIDR(detailEarning.amount)}
                </p>
                <div className="mt-2">
                  <StatusBadge status={detailEarning.status} />
                </div>
              </div>
              <dl className="space-y-2.5 text-sm">
                <div className="flex items-start justify-between gap-4 border-b border-border pb-2.5">
                  <dt className="shrink-0 text-muted-foreground">Tanggal</dt>
                  <dd className="text-right font-medium">{detailEarning.date}</dd>
                </div>
                <div className="flex items-start justify-between gap-4 border-b border-border pb-2.5">
                  <dt className="shrink-0 text-muted-foreground">Pekerjaan</dt>
                  <dd className="text-right font-medium">{detailEarning.jobTitle || "-"}</dd>
                </div>
                <div className="flex items-start justify-between gap-4 border-b border-border pb-2.5">
                  <dt className="shrink-0 text-muted-foreground">Platform</dt>
                  <dd className="text-right font-medium">{detailEarning.platform || "-"}</dd>
                </div>
                <div className="flex items-start justify-between gap-4">
                  <dt className="shrink-0 text-muted-foreground">ID Transaksi</dt>
                  <dd className="max-w-[60%] break-all text-right font-mono text-[11px]">
                    {detailEarning.id}
                  </dd>
                </div>
              </dl>
              <p className="rounded-lg bg-muted/60 p-3 text-[11px] leading-relaxed text-muted-foreground">
                {detailEarning.status === "Berhasil"
                  ? "Reward sudah disetujui admin dan masuk ke saldo dompet kamu."
                  : detailEarning.status === "Ditolak"
                    ? "Reward ditolak, dana tidak masuk ke saldo. Hubungi admin bila kamu merasa ini keliru."
                    : "Reward masih menunggu verifikasi admin. Saldo akan bertambah setelah disetujui."}
              </p>
            </div>
          )}
          <DialogFooter className="gap-2 sm:justify-between">
            {detailEarning && availableToWithdraw > 0 ? (
              <Button
                variant="outline"
                onClick={() => {
                  setDetailEarning(null);
                  handleOpenWithdraw();
                }}
              >
                <Wallet className="mr-1 h-4 w-4" /> Tarik Saldo
              </Button>
            ) : (
              <span />
            )}
            <Button variant="outline" onClick={() => setDetailEarning(null)}>
              Tutup
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Detail Riwayat Pencairan */}
      <Dialog
        open={!!detailWithdrawal}
        onOpenChange={(open) => {
          if (!open) setDetailWithdrawal(null);
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Banknote className="h-5 w-5 text-brand" />
              Detail Pencairan
            </DialogTitle>
            <DialogDescription>
              Rincian pengajuan pencairan saldo ke rekening / e-wallet kamu.
            </DialogDescription>
          </DialogHeader>
          {detailWithdrawal && (
            <div className="space-y-4">
              <div className="rounded-xl border border-border bg-muted/40 p-4">
                <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                  Nominal pencairan
                </p>
                <p className="mt-0.5 font-display text-2xl font-bold">
                  {formatIDR(detailWithdrawal.amount)}
                </p>
                <div className="mt-2">
                  <StatusBadge
                    status={
                      detailWithdrawal.status === "Menunggu"
                        ? "Menunggu Verifikasi"
                        : detailWithdrawal.status
                    }
                  />
                </div>
              </div>
              <dl className="space-y-2.5 text-sm">
                <div className="flex items-start justify-between gap-4 border-b border-border pb-2.5">
                  <dt className="shrink-0 text-muted-foreground">Tanggal</dt>
                  <dd className="text-right font-medium">{detailWithdrawal.date}</dd>
                </div>
                <div className="flex items-start justify-between gap-4 border-b border-border pb-2.5">
                  <dt className="shrink-0 text-muted-foreground">Metode</dt>
                  <dd className="text-right font-medium">{detailWithdrawal.method}</dd>
                </div>
                <div className="flex items-start justify-between gap-4 border-b border-border pb-2.5">
                  <dt className="shrink-0 text-muted-foreground">No. Rekening</dt>
                  <dd className="text-right font-mono text-xs">
                    {detailWithdrawal.accountNo || "-"}
                  </dd>
                </div>
                <div className="flex items-start justify-between gap-4">
                  <dt className="shrink-0 text-muted-foreground">ID Pencairan</dt>
                  <dd className="max-w-[60%] break-all text-right font-mono text-[11px]">
                    {detailWithdrawal.id}
                  </dd>
                </div>
                {detailWithdrawal.adminNote && (
                  <div className="flex items-start justify-between gap-4 border-t border-border pt-2.5">
                    <dt className="shrink-0 text-muted-foreground">Catatan Admin</dt>
                    <dd className="text-right font-medium">{detailWithdrawal.adminNote}</dd>
                  </div>
                )}
              </dl>
              <p
                className={cn(
                  "rounded-lg p-3 text-[11px] leading-relaxed",
                  detailWithdrawal.status === "Ditolak"
                    ? "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                    : detailWithdrawal.status === "Berhasil"
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                      : "bg-amber-500/10 text-amber-600 dark:text-amber-400",
                )}
              >
                {detailWithdrawal.status === "Menunggu"
                  ? "Pengajuan sedang diverifikasi admin. Saldo belum dipotong sampai pengajuan disetujui."
                  : detailWithdrawal.status === "Berhasil"
                    ? "Pencairan sudah ditransfer admin ke rekening / e-wallet kamu."
                    : detailWithdrawal.status === "Ditolak"
                      ? "Pengajuan ditolak. Saldo tetap aman dan tidak dipotong."
                      : "Status pencairan sedang diperbarui oleh admin."}
              </p>
              {detailWithdrawal.proofUrl && (
                <Button
                  variant="outline"
                  className="w-full gap-1.5 text-primary"
                  onClick={() => {
                    const url = detailWithdrawal.proofUrl;
                    setDetailWithdrawal(null);
                    setViewingProofUrl(url || null);
                  }}
                >
                  <Eye className="h-4 w-4" /> Lihat Bukti Transfer
                </Button>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDetailWithdrawal(null)}>
              Tutup
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* ==================== RIWAYAT TRANSAKSI ==================== */

type TransactionRow = {
  id: string;
  date: string;
  description: string;
  type: string;
  amount: number;
  status: string;
  direction: "in" | "out";
};

function TransactionsSection({ store }: { store: Store }) {
  const { state } = store;
  const [q, setQ] = useState("");
  const [type, setType] = useState("Semua");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<TransactionRow | null>(null);
  const pageSize = 10;

  const rows = useMemo<TransactionRow[]>(() => {
    const earningRows: TransactionRow[] = (state.earnings || []).map((e) => {
      const rawType = (e.transactionType || "Reward Pekerjaan").toLowerCase();
      const typeLabel = rawType.includes("bonus")
        ? "Bonus"
        : rawType.includes("koreksi")
          ? "Koreksi Saldo"
          : "Reward Pekerjaan";
      return {
        id: e.id,
        date: e.date,
        description: e.jobTitle || "Reward pekerjaan",
        type: typeLabel,
        amount: Number(e.amount || 0),
        status: e.status,
        direction: "in",
      };
    });
    const withdrawalRows: TransactionRow[] = (state.withdrawals || []).map((w) => ({
      id: w.id,
      date: w.date,
      description: `Penarikan ke ${w.method}`,
      type: "Penarikan Saldo",
      amount: Number(w.amount || 0),
      status: w.status,
      direction: "out",
    }));
    return [...earningRows, ...withdrawalRows].sort((a, b) => (a.date < b.date ? 1 : -1));
  }, [state.earnings, state.withdrawals]);

  const filtered = useMemo(() => {
    const keyword = q.trim().toLowerCase();
    return rows.filter((row) => {
      if (type !== "Semua" && row.type !== type) return false;
      if (from && row.date < from) return false;
      if (to && row.date > to) return false;
      if (keyword && !`${row.description} ${row.type} ${row.id}`.toLowerCase().includes(keyword))
        return false;
      return true;
    });
  }, [rows, type, from, to, q]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const paged = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const totalIn = filtered
    .filter((r) => r.direction === "in" && r.status !== "Ditolak")
    .reduce((s, r) => s + r.amount, 0);
  const totalOut = filtered
    .filter((r) => r.direction === "out" && r.status !== "Ditolak")
    .reduce((s, r) => s + r.amount, 0);
  const filtersActive = !!q.trim() || type !== "Semua" || !!from || !!to;

  const reset = () => {
    setQ("");
    setType("Semua");
    setFrom("");
    setTo("");
    setPage(1);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2.5 sm:gap-3 lg:grid-cols-4">
        <div className="rounded-2xl border border-border bg-card p-3.5 shadow-sm sm:p-4">
          <p className="text-[11px] text-muted-foreground">Total Transaksi</p>
          <p className="mt-1 font-display text-lg font-bold sm:text-xl">{rows.length}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-3.5 shadow-sm sm:p-4">
          <p className="text-[11px] text-muted-foreground">Total Masuk</p>
          <p className="mt-1 font-display text-lg font-bold text-emerald-600 dark:text-emerald-400 sm:text-xl">
            {formatIDR(totalIn)}
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-3.5 shadow-sm sm:p-4">
          <p className="text-[11px] text-muted-foreground">Total Keluar</p>
          <p className="mt-1 font-display text-lg font-bold text-rose-600 dark:text-rose-400 sm:text-xl">
            {formatIDR(totalOut)}
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-3.5 shadow-sm sm:p-4">
          <p className="text-[11px] text-muted-foreground">Saldo Saat Ini</p>
          <p className="mt-1 font-display text-lg font-bold sm:text-xl">
            {formatIDR(state.balance)}
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-3.5 shadow-sm sm:p-4">
        <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_160px_140px_140px_auto]">
          <div className="relative min-w-0">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="pl-9"
              placeholder="Cari ID, deskripsi..."
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setPage(1);
              }}
            />
          </div>
          <Select
            value={type}
            onValueChange={(v) => {
              setType(v);
              setPage(1);
            }}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {["Semua", "Reward Pekerjaan", "Penarikan Saldo", "Bonus", "Koreksi Saldo"].map(
                (t) => (
                  <SelectItem key={t} value={t}>
                    {t === "Semua" ? "Semua jenis" : t}
                  </SelectItem>
                ),
              )}
            </SelectContent>
          </Select>
          <div>
            <Input
              type="date"
              value={from}
              onChange={(e) => {
                setFrom(e.target.value);
                setPage(1);
              }}
              aria-label="Dari tanggal"
            />
          </div>
          <div>
            <Input
              type="date"
              value={to}
              onChange={(e) => {
                setTo(e.target.value);
                setPage(1);
              }}
              aria-label="Sampai tanggal"
            />
          </div>
          <div className="flex gap-2">
            {filtersActive && (
              <Button variant="outline" size="icon" onClick={reset} aria-label="Reset filter">
                <RefreshCw className="h-4 w-4" />
              </Button>
            )}
            <Button
              variant="outline"
              className="gap-1.5"
              onClick={() => {
                exportToExcel("riwayat-transaksi-buzzer", "Riwayat Transaksi", filtered, [
                  { header: "ID", accessor: (r) => r.id },
                  { header: "Tanggal", accessor: (r) => r.date },
                  { header: "Deskripsi", accessor: (r) => r.description },
                  { header: "Jenis", accessor: (r) => r.type },
                  { header: "Nominal (Rp)", accessor: (r) => r.amount },
                  { header: "Status", accessor: (r) => r.status },
                ]);
                toast.success("Riwayat transaksi diekspor ke Excel");
              }}
            >
              <FileSpreadsheet className="h-4 w-4" /> Excel
            </Button>
          </div>
        </div>
        <p className="mt-2 text-[11px] text-muted-foreground">
          {filtered.length} transaksi ditemukan
        </p>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<Receipt className="h-8 w-8" />}
          title="Belum ada transaksi"
          desc="Reward pekerjaan dan penarikan saldo akan muncul di sini."
        />
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden overflow-hidden rounded-2xl border border-border bg-card shadow-sm md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID Transaksi</TableHead>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Deskripsi</TableHead>
                  <TableHead>Jenis</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Nominal</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paged.map((row) => (
                  <TableRow
                    key={`${row.type}-${row.id}`}
                    className="cursor-pointer"
                    title="Klik untuk melihat detail transaksi"
                    onClick={() => setSelected(row)}
                  >
                    <TableCell className="font-mono text-[11px] text-muted-foreground">
                      {row.id.slice(0, 14)}
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-xs">{row.date}</TableCell>
                    <TableCell className="max-w-[260px] truncate">{row.description}</TableCell>
                    <TableCell>
                      <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium">
                        {row.type}
                      </span>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={row.status} />
                    </TableCell>
                    <TableCell
                      className={cn(
                        "text-right font-semibold",
                        row.direction === "in"
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-rose-600 dark:text-rose-400",
                      )}
                    >
                      {row.direction === "in" ? "+" : "−"}
                      {formatIDR(row.amount)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <TablePagination
              currentPage={currentPage}
              totalItems={filtered.length}
              pageSize={pageSize}
              onPageChange={setPage}
            />
          </div>

          {/* Mobile cards */}
          <div className="space-y-2.5 md:hidden">
            {paged.map((row) => (
              <button
                key={`${row.type}-${row.id}`}
                type="button"
                onClick={() => setSelected(row)}
                className="w-full rounded-2xl border border-border bg-card p-3.5 text-left shadow-sm transition-colors active:bg-muted/40"
              >
                <span className="flex items-start justify-between gap-2">
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold">{row.description}</span>
                    <span className="mt-0.5 block text-[10px] text-muted-foreground">
                      {row.date} · {row.type}
                    </span>
                  </span>
                  <span
                    className={cn(
                      "shrink-0 text-sm font-bold",
                      row.direction === "in"
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-rose-600 dark:text-rose-400",
                    )}
                  >
                    {row.direction === "in" ? "+" : "−"}
                    {formatIDR(row.amount)}
                  </span>
                </span>
                <span className="mt-2 flex items-center justify-between">
                  <StatusBadge status={row.status} />
                  <span className="font-mono text-[10px] text-muted-foreground">
                    #{row.id.slice(0, 8)}
                  </span>
                </span>
              </button>
            ))}
            {filtered.length > pageSize && (
              <div className="flex items-center justify-between pt-1">
                <Button
                  size="sm"
                  variant="outline"
                  disabled={currentPage <= 1}
                  onClick={() => setPage(currentPage - 1)}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-xs">
                  {currentPage} / {totalPages}
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={currentPage >= totalPages}
                  onClick={() => setPage(currentPage + 1)}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </>
      )}

      {/* Detail Transaksi */}
      <Dialog
        open={!!selected}
        onOpenChange={(open) => {
          if (!open) setSelected(null);
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Receipt className="h-5 w-5 text-brand" />
              Detail Transaksi
            </DialogTitle>
            <DialogDescription>Rincian mutasi saldo dompet kamu.</DialogDescription>
          </DialogHeader>
          {selected && (
            <div className="space-y-4">
              <div className="rounded-xl border border-border bg-muted/40 p-4">
                <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                  {selected.direction === "in" ? "Dana masuk" : "Dana keluar"}
                </p>
                <p
                  className={cn(
                    "mt-0.5 font-display text-2xl font-bold",
                    selected.direction === "in"
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-rose-600 dark:text-rose-400",
                  )}
                >
                  {selected.direction === "in" ? "+" : "−"}
                  {formatIDR(selected.amount)}
                </p>
                <div className="mt-2">
                  <StatusBadge status={selected.status} />
                </div>
              </div>
              <dl className="space-y-2.5 text-sm">
                <div className="flex items-start justify-between gap-4 border-b border-border pb-2.5">
                  <dt className="shrink-0 text-muted-foreground">Tanggal</dt>
                  <dd className="text-right font-medium">{selected.date}</dd>
                </div>
                <div className="flex items-start justify-between gap-4 border-b border-border pb-2.5">
                  <dt className="shrink-0 text-muted-foreground">Deskripsi</dt>
                  <dd className="text-right font-medium">{selected.description}</dd>
                </div>
                <div className="flex items-start justify-between gap-4 border-b border-border pb-2.5">
                  <dt className="shrink-0 text-muted-foreground">Jenis</dt>
                  <dd className="text-right font-medium">{selected.type}</dd>
                </div>
                <div className="flex items-start justify-between gap-4">
                  <dt className="shrink-0 text-muted-foreground">ID Transaksi</dt>
                  <dd className="max-w-[60%] break-all text-right font-mono text-[11px]">
                    {selected.id}
                  </dd>
                </div>
              </dl>
              {selected.type === "Penarikan Saldo" &&
                (() => {
                  const proof = (store.state.withdrawals || []).find(
                    (w) => w.id === selected.id && w.proofUrl,
                  )?.proofUrl;
                  if (!proof) return null;
                  return (
                    <Button
                      variant="outline"
                      className="w-full gap-1.5 text-primary"
                      onClick={() => {
                        setSelected(null);
                        window.open(proof, "_blank", "noopener,noreferrer");
                      }}
                    >
                      <Eye className="h-4 w-4" /> Lihat Bukti Transfer
                    </Button>
                  );
                })()}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelected(null)}>
              Tutup
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* ==================== PERINGKAT ==================== */

function levelTone(level: string) {
  const value = level.toLowerCase();
  if (value.includes("platinum") || value.includes("diamond"))
    return "bg-violet-500/15 text-violet-600 dark:text-violet-300";
  if (value.includes("gold")) return "bg-amber-500/15 text-amber-600 dark:text-amber-300";
  if (value.includes("silver")) return "bg-slate-400/20 text-slate-600 dark:text-slate-300";
  return "bg-orange-500/15 text-orange-600 dark:text-orange-300";
}

function LeaderboardSection({ store }: { store: Store }) {
  const { rows, loading } = useLeaderboard(store);
  const myIndex = rows.findIndex((row) => row.isMe);
  const me = myIndex >= 0 ? rows[myIndex] : null;
  const topThree = rows.slice(0, 3);
  const rest = rows.slice(3);

  return (
    <div className="space-y-4">
      <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
        <div className="pointer-events-none absolute -right-10 -top-16 h-48 w-48 rounded-full bg-amber-400/15 blur-3xl" />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              <Trophy className="h-4 w-4 text-amber-500" /> Peringkat Buzzer
            </p>
            <h2 className="mt-1 font-display text-xl font-bold sm:text-2xl">
              {me ? `Kamu di posisi #${myIndex + 1}` : "Mulai kumpulkan peringkat"}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {me
                ? `${me.jobs} pekerjaan selesai · ${formatIDR(me.earnings)} total penghasilan`
                : "Selesaikan pekerjaan untuk masuk leaderboard komunitas."}
            </p>
          </div>
          {me && (
            <div className={cn("rounded-2xl border px-4 py-3 text-center", levelTone(me.level))}>
              <p className="text-[10px] font-semibold uppercase tracking-wide opacity-80">
                Level kamu
              </p>
              <p className="mt-0.5 font-display text-lg font-bold">{me.level}</p>
            </div>
          )}
        </div>
      </div>

      {loading ? (
        <div className="grid gap-3 sm:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-36 rounded-2xl" />
          ))}
        </div>
      ) : rows.length === 0 ? (
        <EmptyState
          icon={<Trophy className="h-8 w-8" />}
          title="Leaderboard belum tersedia"
          desc="Data peringkat akan muncul setelah buzzer menyelesaikan pekerjaan."
        />
      ) : (
        <>
          <div className="grid grid-cols-3 items-end gap-2 sm:gap-3">
            {[topThree[1], topThree[0], topThree[2]].map((row, slot) => {
              if (!row) return <div key={`empty-${slot}`} />;
              const place = slot === 1 ? 1 : slot === 0 ? 2 : 3;
              const heights = place === 1 ? "pt-0" : place === 2 ? "pt-5" : "pt-8";
              const medal =
                place === 1
                  ? "bg-amber-400 text-amber-950"
                  : place === 2
                    ? "bg-slate-300 text-slate-800"
                    : "bg-orange-300 text-orange-950";
              return (
                <div
                  key={row.email}
                  className={cn(
                    "rounded-2xl border bg-card p-3 text-center shadow-sm",
                    heights,
                    row.isMe ? "border-brand/40 ring-1 ring-brand/20" : "border-border",
                  )}
                >
                  <div className="relative mx-auto w-fit">
                    <Avatar
                      className={cn(
                        "mx-auto border-2 border-background shadow-sm",
                        place === 1 ? "h-14 w-14" : "h-11 w-11",
                      )}
                    >
                      {row.avatarUrl && <AvatarImage src={row.avatarUrl} alt={row.name} />}
                      <AvatarFallback className="gradient-brand text-xs font-bold text-brand-foreground">
                        {initialsOf(row.name)}
                      </AvatarFallback>
                    </Avatar>
                    <span
                      className={cn(
                        "absolute -bottom-1 -right-1 grid h-5 w-5 place-items-center rounded-full text-[10px] font-bold ring-2 ring-card",
                        medal,
                      )}
                    >
                      {place}
                    </span>
                  </div>
                  <p className="mt-2 truncate text-xs font-bold">{row.isMe ? "Kamu" : row.name}</p>
                  <p className="text-[10px] text-muted-foreground">
                    {row.jobs} job · {row.level}
                  </p>
                  <p className="mt-1 text-[11px] font-bold">{formatIDR(row.earnings)}</p>
                </div>
              );
            })}
          </div>

          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <h3 className="font-display text-sm font-bold sm:text-base">Semua Peringkat</h3>
              <span className="text-[11px] text-muted-foreground">{rows.length} buzzer</span>
            </div>
            <ul className="divide-y divide-border">
              {rows.map((row, index) => (
                <li
                  key={row.email}
                  className={cn(
                    "flex items-center justify-between gap-3 px-3 py-2.5 sm:px-4",
                    row.isMe && "bg-brand/5",
                  )}
                >
                  <div className="flex min-w-0 items-center gap-2.5">
                    <span
                      className={cn(
                        "w-6 shrink-0 text-center text-xs font-bold",
                        index < 3 ? "text-amber-600" : "text-muted-foreground",
                      )}
                    >
                      #{index + 1}
                    </span>
                    <Avatar className="h-8 w-8 shrink-0">
                      {row.avatarUrl && <AvatarImage src={row.avatarUrl} alt={row.name} />}
                      <AvatarFallback className="bg-muted text-[10px] font-bold">
                        {initialsOf(row.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="truncate text-xs font-semibold sm:text-sm">
                        {row.name}
                        {row.isMe ? " (Kamu)" : ""}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        {row.jobs} pekerjaan selesai
                      </p>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-2 sm:gap-3">
                    <span
                      className={cn(
                        "hidden rounded-full px-2 py-0.5 text-[10px] font-semibold sm:inline",
                        levelTone(row.level),
                      )}
                    >
                      {row.level}
                    </span>
                    <span className="text-[11px] font-bold sm:text-xs">
                      {formatIDR(row.earnings)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}

/* ==================== NOTIFIKASI ==================== */

const NOTIF_FILTERS = [
  { key: "semua", label: "Semua" },
  { key: "belum", label: "Belum Dibaca" },
  { key: "pekerjaan", label: "Pekerjaan" },
  { key: "pembayaran", label: "Pembayaran" },
  { key: "sistem", label: "Sistem" },
] as const;

function notifVisual(type: string) {
  if (type === "task_approved" || type === "payout" || type === "level_up")
    return {
      icon: <CircleCheck className="h-4 w-4" />,
      tone: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
    };
  if (type === "task_rejected")
    return {
      icon: <CircleX className="h-4 w-4" />,
      tone: "bg-rose-500/15 text-rose-600 dark:text-rose-400",
    };
  if (type === "new_task")
    return { icon: <Megaphone className="h-4 w-4" />, tone: "bg-brand/15 text-brand" };
  if (
    type === "verification_approved" ||
    type === "verification_rejected" ||
    type === "verification_pending"
  )
    return {
      icon: <ShieldCheck className="h-4 w-4" />,
      tone: "bg-indigo-500/15 text-indigo-600 dark:text-indigo-300",
    };
  if (type === "support")
    return {
      icon: <LifeBuoy className="h-4 w-4" />,
      tone: "bg-amber-500/15 text-amber-600 dark:text-amber-300",
    };
  return { icon: <BellRing className="h-4 w-4" />, tone: "bg-muted text-muted-foreground" };
}

function NotificationsSection({
  notifState,
  onNavigate,
}: {
  notifState: ReturnType<typeof useBuzzerNotifications>;
  onNavigate: (key: SectionKey) => void;
}) {
  const [filter, setFilter] = useState<(typeof NOTIF_FILTERS)[number]["key"]>("semua");
  const all = useMemo(() => notifState.notifications || [], [notifState.notifications]);

  const filtered = useMemo(() => {
    if (filter === "belum") return all.filter((n) => !n.is_read);
    if (filter === "pekerjaan")
      return all.filter((n) =>
        ["task_approved", "task_rejected", "new_task", "verification_pending"].includes(n.type),
      );
    if (filter === "pembayaran") return all.filter((n) => ["payout", "level_up"].includes(n.type));
    if (filter === "sistem")
      return all.filter((n) =>
        ["general", "support", "verification_approved", "verification_rejected"].includes(n.type),
      );
    return all;
  }, [all, filter]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-base font-bold sm:text-lg">Notifikasi</h2>
          <p className="text-xs text-muted-foreground">
            {notifState.unreadCount > 0
              ? `${notifState.unreadCount} notifikasi belum dibaca`
              : "Semua notifikasi sudah dibaca"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => notifState.refetch()}
            className="gap-1.5"
          >
            <RefreshCw className="h-3.5 w-3.5" /> Muat ulang
          </Button>
          <Button
            size="sm"
            disabled={notifState.unreadCount === 0}
            onClick={() => notifState.markAllAsRead()}
            className="gradient-brand gap-1.5 text-brand-foreground"
          >
            <CheckCircle2 className="h-3.5 w-3.5" /> Tandai semua
          </Button>
        </div>
      </div>

      <div className="flex gap-1.5 overflow-x-auto rounded-2xl border border-border bg-card p-2 shadow-sm">
        {NOTIF_FILTERS.map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => setFilter(item.key)}
            className={cn(
              "shrink-0 rounded-full px-3 py-1.5 text-[11px] font-semibold transition-colors sm:text-xs",
              filter === item.key
                ? "bg-brand text-brand-foreground"
                : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
            )}
          >
            {item.label}
          </button>
        ))}
      </div>

      {notifState.loading ? (
        <div className="space-y-2">
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-20 w-full rounded-2xl" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<Bell className="h-8 w-8" />}
          title="Tidak ada notifikasi"
          desc={
            filter === "belum"
              ? "Semua notifikasi sudah kamu baca."
              : "Notifikasi baru akan muncul di sini."
          }
        />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <ul className="divide-y divide-border">
            {filtered.map((n) => {
              const visual = notifVisual(n.type);
              return (
                <li key={n.id}>
                  <button
                    type="button"
                    onClick={() => {
                      if (!n.is_read) notifState.markAsRead(n.id);
                      if (n.type === "new_task") onNavigate("cari");
                      else if (n.type === "payout") onNavigate("dompet");
                      else if (n.type === "task_approved" || n.type === "task_rejected")
                        onNavigate("pekerjaan");
                    }}
                    className={cn(
                      "flex w-full items-start gap-3 px-3.5 py-3 text-left transition-colors hover:bg-muted/40 sm:px-4",
                      !n.is_read && "bg-brand/5",
                    )}
                  >
                    <span
                      className={cn(
                        "mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full",
                        visual.tone,
                      )}
                    >
                      {visual.icon}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-2">
                        <span
                          className={cn(
                            "truncate text-xs font-semibold sm:text-sm",
                            !n.is_read && "text-foreground",
                          )}
                        >
                          {n.title}
                        </span>
                        {!n.is_read && (
                          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
                        )}
                      </span>
                      <span className="mt-0.5 line-clamp-2 block text-[11px] text-muted-foreground sm:text-xs">
                        {n.message}
                      </span>
                      <span className="mt-1 block text-[10px] text-muted-foreground/80">
                        {formatRelativeTime(n.created_at)}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

/* ==================== RATING & ULASAN (FITUR MANDIRI DENGAN FILTER) ==================== */
function RatingUlasanSection({ store }: { store: Store }) {
  const { state } = store;
  const { data: allRatings, loading } = useBuzzerRatings();
  const myRatings = useMemo(() => {
    return allRatings.filter(
      (r) => r.buzzer_email.toLowerCase() === state.profile.email.toLowerCase(),
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

  const isFiltered =
    starFilter !== "all" || hasCommentOnly || searchQuery.trim() !== "" || sortBy !== "newest";

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
          const matchCustomer = (r.customer_name || r.customer_email || "")
            .toLowerCase()
            .includes(q);
          const matchComment = (r.comment || "").toLowerCase().includes(q);
          if (!matchTitle && !matchCustomer && !matchComment) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === "newest")
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        if (sortBy === "oldest")
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
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
            <p className="text-xs uppercase tracking-wide opacity-90 font-medium">
              Rata-rata Rating
            </p>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="font-display text-3xl font-bold">
                {myRatings.length > 0 ? avg.toFixed(1) : "0.0"}
              </span>
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
                      : "fill-white/20 text-white/20",
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
            <h3 className="font-display text-base font-bold sm:text-lg">
              Distribusi Penilaian Bintang
            </h3>
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
                    : "hover:bg-muted/60 border border-transparent",
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
              className={cn(
                "h-9 text-xs gap-1.5",
                hasCommentOnly && "gradient-brand text-brand-foreground",
              )}
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
              starFilter === "all" &&
                "border-primary bg-primary/10 text-primary font-bold shadow-xs",
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
                starFilter === s && "border-primary bg-primary/10 text-primary font-bold shadow-xs",
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
function ProfilSection({
  store,
  verificationStatus,
  applicationData,
  onGoRatings,
  onGoSosmed,
}: {
  store: Store;
  verificationStatus?: BuzzerAppStatus | null;
  applicationData?: BuzzerApplication | null;
  onGoRatings?: () => void;
  onGoSosmed?: () => void;
}) {
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
  const displayFollowers = verifiedFollowers > 0 ? verifiedFollowers : state.profile.followers || 0;
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(state.profile);
  const [loading, setLoading] = useState(false);
  const [pwOpen, setPwOpen] = useState(false);
  const [pwSaving, setPwSaving] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const lastWithdrawal =
    (state.withdrawals || []).find((w) => !!w.accountNo) || (state.withdrawals || [])[0];
  const address = state.profile.address || applicationData?.address || "";
  const city = state.profile.city || applicationData?.city || "";
  const verify = verificationLabel(verificationStatus ?? null);
  const socialMap = new Map(socialAccounts.map((acc) => [acc.platform.toLowerCase(), acc]));

  const resetPasswordForm = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setShowPassword(false);
  };

  const submitPassword = async () => {
    if (!currentPassword) return toast.error("Password lama wajib diisi");
    if (newPassword.length < 8) return toast.error("Password baru minimal 8 karakter");
    if (newPassword !== confirmPassword) return toast.error("Konfirmasi password tidak cocok");
    if (newPassword === currentPassword)
      return toast.error("Password baru harus berbeda dari password lama");
    setPwSaving(true);
    const result = await changePassword(state.profile.email, currentPassword, newPassword);
    setPwSaving(false);
    if (!result.ok) return toast.error(result.message || "Gagal mengubah password");
    setPwOpen(false);
    resetPasswordForm();
    toast.success("Password berhasil diubah");
  };

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
    <div className="grid gap-4 lg:grid-cols-[320px_minmax(0,1fr)] lg:gap-6">
      <div className="rounded-2xl border border-border bg-card p-5 text-center shadow-sm sm:p-6">
        <Avatar className="mx-auto h-24 w-24 border-2 border-background shadow-md">
          {currentAvatar && <AvatarImage src={currentAvatar} alt={state.profile.name} />}
          <AvatarFallback className="gradient-brand text-2xl font-bold text-brand-foreground">
            {initialsOf(state.profile.name)}
          </AvatarFallback>
        </Avatar>
        <h3 className="mt-3 font-display text-xl font-bold">{state.profile.name}</h3>
        <p className="text-sm text-muted-foreground">
          {state.profile.username || "Buzzer BuzzHub"}
        </p>
        <span
          className={cn(
            "mt-2 inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold",
            verify.className,
          )}
        >
          {verify.icon} {verify.label}
        </span>
        <div className="mt-4 flex items-center justify-center gap-1 text-sm">
          {myRatings.length > 0 ? (
            <>
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" /> <b>{avg.toFixed(1)}</b>
              <span className="text-muted-foreground">
                · {myRatings.length} ulasan · {state.profile.jobsCompleted} job
              </span>
            </>
          ) : (
            <span className="text-muted-foreground">
              ⭐ 0.0 (Belum ada ulasan) · {state.profile.jobsCompleted} job
            </span>
          )}
        </div>
        <div className="mt-5 space-y-2">
          <Button className="w-full gradient-brand text-brand-foreground" onClick={startEdit}>
            <Edit3 className="mr-2 h-4 w-4" /> Edit Profil
          </Button>
          <Button variant="outline" className="w-full" onClick={() => setPwOpen(true)}>
            <KeyRound className="mr-2 h-4 w-4" /> Ubah Password
          </Button>
          <div className="grid grid-cols-2 gap-2">
            {onGoSosmed && (
              <Button variant="outline" size="sm" className="text-xs" onClick={onGoSosmed}>
                <Link2 className="mr-1.5 h-3.5 w-3.5" /> Sosmed
              </Button>
            )}
            {onGoRatings && (
              <Button variant="outline" size="sm" className="text-xs" onClick={onGoRatings}>
                <Star className="mr-1.5 h-3.5 w-3.5" /> Ulasan
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-4 rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
        <div>
          <h3 className="font-display text-base font-bold">Informasi Akun</h3>
          <p className="text-xs text-muted-foreground">
            Data utama yang digunakan untuk campaign dan pencairan.
          </p>
        </div>
        <ProfileRow label="Nama Lengkap" value={state.profile.name || "-"} />
        <ProfileRow label="Email" value={state.profile.email} />
        <ProfileRow label="Nomor WhatsApp" value={state.profile.phone || "-"} />
        <ProfileRow label="Alamat" value={address || "-"} />
        <ProfileRow label="Kota" value={city || "-"} />
        <ProfileRow label="Jenis Buzzer" value={state.profile.buzzerCategory || "Buzzer Online"} />
        <ProfileRow label="Platform Utama" value={state.profile.platform} />
        <ProfileRow label="Followers" value={displayFollowers.toLocaleString("id-ID")} />
        <ProfileRow label="Bio" value={state.profile.bio || "-"} />

        <div>
          <h3 className="mb-3 font-display text-base font-bold">Akun Sosial Media</h3>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {["Instagram", "TikTok", "YouTube", "Facebook", "X (Twitter)"].map((platformName) => {
              const account = socialMap.get(platformName.toLowerCase());
              return (
                <div key={platformName} className="rounded-xl border border-border p-3">
                  <p className="flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground">
                    {platformIcon(platformName)} {platformName}
                  </p>
                  <p className="mt-1 truncate text-xs font-medium">
                    {account?.username
                      ? `@${account.username.replace(/^@/, "")}`
                      : "Belum terhubung"}
                  </p>
                  <span
                    className={cn(
                      "mt-1 inline-flex rounded-full px-1.5 py-0.5 text-[9px] font-semibold",
                      account?.verification === "Terverifikasi"
                        ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                        : account
                          ? "bg-amber-500/15 text-amber-600 dark:text-amber-400"
                          : "bg-muted text-muted-foreground",
                    )}
                  >
                    {account?.verification === "Terverifikasi"
                      ? "Terverifikasi"
                      : account
                        ? "Menunggu"
                        : "Kosong"}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div>
          <h3 className="mb-2 font-display text-base font-bold">Rekening Pencairan</h3>
          {lastWithdrawal?.accountNo ? (
            <div className="flex items-center gap-3 rounded-xl border border-border bg-muted/30 p-3">
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-brand/10 text-brand">
                <Banknote className="h-4 w-4" />
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{lastWithdrawal.method}</p>
                <p className="text-[11px] text-muted-foreground">
                  {lastWithdrawal.accountNo} · {lastWithdrawal.accountName || state.profile.name}
                </p>
              </div>
            </div>
          ) : (
            <p className="rounded-xl border border-dashed border-border p-3 text-xs text-muted-foreground">
              Belum ada rekening tersimpan. Rekening akan tersimpan otomatis saat kamu mengajukan
              penarikan saldo pertama.
            </p>
          )}
        </div>

        {/* Ringkasan Rating & Ulasan yang mengarahkan ke menu mandiri Rating & Ulasan */}
        <div className="rounded-xl border border-border/80 bg-muted/30 p-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Rating & Ulasan Customer
              </p>
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
              <Button
                size="sm"
                variant="outline"
                className="gap-1.5 text-xs self-start sm:self-auto"
                onClick={onGoRatings}
              >
                <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" /> Buka Rating & Ulasan
              </Button>
            )}
          </div>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Profil</DialogTitle>
            <DialogDescription>Perubahan disimpan ke akun kamu.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Avatar className="h-16 w-16 border border-border">
                {(form.avatarUrl || currentAvatar) && (
                  <AvatarImage src={form.avatarUrl || currentAvatar} />
                )}
                <AvatarFallback className="gradient-brand text-brand-foreground">
                  {form.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-input px-3 py-2 text-sm hover:bg-accent">
                <Camera className="h-4 w-4" /> Ganti foto
                <input type="file" accept="image/*" className="hidden" onChange={onAvatar} />
              </label>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <Label>Nama</Label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div>
                <Label>Username</Label>
                <Input
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                />
              </div>
              <div>
                <Label>Email</Label>
                <Input type="email" value={form.email} readOnly />
              </div>
              <div>
                <Label>Nomor HP</Label>
                <Input
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value.replace(/\D/g, "") })}
                />
              </div>

              <div>
                <Label>Platform Utama</Label>
                <Select
                  value={form.platform}
                  onValueChange={(v) => setForm({ ...form, platform: v as Platform })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {["Instagram", "TikTok", "X (Twitter)", "YouTube", "Facebook", "Offline"].map(
                      (p) => (
                        <SelectItem key={p} value={p}>
                          {p}
                        </SelectItem>
                      ),
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Jenis Buzzer</Label>
                <Select
                  value={form.buzzerCategory || "Buzzer Online"}
                  onValueChange={(v) => setForm({ ...form, buzzerCategory: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Buzzer Online">Buzzer Online</SelectItem>
                    <SelectItem value="Buzzer Offline">Buzzer Offline</SelectItem>
                    <SelectItem value="Buzzer Offline-Online">Buzzer Offline-Online</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="sm:col-span-2">
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
              <div className="sm:col-span-2">
                <Label>Alamat</Label>
                <Input
                  value={form.address || ""}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  placeholder="Alamat lengkap"
                />
              </div>
              <div className="sm:col-span-2">
                <Label>Kota</Label>
                <Input
                  value={form.city || ""}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  placeholder="Kota domisili"
                />
              </div>
            </div>
            <div>
              <Label>Bio</Label>
              <Textarea
                rows={3}
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Batal
            </Button>
            <Button
              onClick={save}
              disabled={loading}
              className="gradient-brand text-brand-foreground"
            >
              {loading ? "Menyimpan..." : "Simpan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Ubah Password */}
      <Dialog
        open={pwOpen}
        onOpenChange={(v) => {
          setPwOpen(v);
          if (!v) resetPasswordForm();
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-brand" /> Ubah Password
            </DialogTitle>
            <DialogDescription>
              Gunakan password yang kuat dan belum pernah dipakai di aplikasi lain.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label>Password Lama</Label>
              <Input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Masukkan password saat ini"
              />
            </div>
            <div>
              <Label>Password Baru</Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Minimal 8 karakter"
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <p className="mt-1 text-[11px] text-muted-foreground">
                {newPassword.length}/8 karakter minimum
              </p>
            </div>
            <div>
              <Label>Konfirmasi Password Baru</Label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Ulangi password baru"
              />
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setPwOpen(false)}>
              Batal
            </Button>
            <Button
              onClick={submitPassword}
              disabled={pwSaving}
              className="gradient-brand text-brand-foreground"
            >
              {pwSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Menyimpan...
                </>
              ) : (
                <>
                  <KeyRound className="mr-1.5 h-4 w-4" /> Simpan Password
                </>
              )}
            </Button>
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

function EmptyState({
  icon,
  title,
  desc,
  action,
}: {
  icon: ReactNode;
  title: string;
  desc: string;
  action?: ReactNode;
}) {
  return (
    <div className="grid place-items-center rounded-2xl border border-dashed border-border bg-card/50 p-10 text-center">
      <div className="mb-3 grid h-14 w-14 place-items-center rounded-full bg-muted text-muted-foreground">
        {icon}
      </div>
      <p className="font-semibold">{title}</p>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">{desc}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
