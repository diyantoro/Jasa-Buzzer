import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState, useCallback, type ReactNode } from "react";
import {
  Bell, CheckCircle2, Clock, Copy, CreditCard, Download, Edit3, Eye,
  Filter, Heart, LayoutDashboard, LogOut, MapPin, Megaphone, MessageCircle,
  Package, Plus, Printer, Search, ShoppingBag, Sparkles, Star, Trash2, TrendingUp,
  Users, Wallet, XCircle, Instagram, Music2, Twitter, Facebook, Youtube, Send,
  ChevronLeft, ChevronRight, Inbox, Target, Share2, FileText, Check,
  FileSpreadsheet, FileDown,
  Image as ImageIcon,
  BarChart3, SlidersHorizontal, Calendar as CalendarIcon, RotateCcw, ExternalLink, Settings, LifeBuoy,
} from "lucide-react";
import { format } from "date-fns";
import { jsPDF } from "jspdf";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Sheet, SheetContent } from "@/components/ui/sheet";
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
import { CustomerHomepageSection } from "@/components/customer-homepage-section";
import { CustomerSettingsSection } from "@/components/customer-settings-section";
import { HelpSection } from "@/components/help-section";
import {
  useCustomerNotifPreferences,
  isCustomerNotifEnabled,
} from "@/components/customer-notif-settings-dialog";
import { BuzzerNameLink } from "@/components/buzzer-name-link";
import { SectionErrorBoundary } from "@/components/section-error-boundary";
import { ThemeToggle } from "@/components/theme-toggle";
import { clearSession, useRequireRole } from "@/lib/auth";
import {
  useCustomerStore, formatIDR, CAMPAIGN_TYPES,
  type Order, type OrderProof, type OrderStatus, type Payment, type PaymentStatus, type Platform,
  type Service, type ServicePackage, type CampaignTypeKey,
} from "@/lib/customer-store";
import { exportToExcel, exportToPDF } from "@/lib/export-utils";
import { cn } from "@/lib/utils";
import { useCampaigns, useCampaignJobs, useServiceCatalogs, useServicePricings, type Campaign, type CampaignJob } from "@/lib/campaign-store";
import { rateCampaignForAllBuzzers, updateCustomerBuzzerRating, useBuzzerRatings, type BuzzerRating } from "@/lib/rating-store";
import { supabase } from "@/integrations/supabase/client";

const CAMPAIGN_TYPE_ICON: Record<CampaignTypeKey, ReactNode> = {
  like: <Heart className="h-4 w-4 text-rose-500" />,
  komentar: <MessageCircle className="h-4 w-4 text-indigo-500" />,
  "like-komentar": <Sparkles className="h-4 w-4 text-fuchsia-500" />,
  share: <Share2 className="h-4 w-4 text-emerald-500" />,
  follow: <Users className="h-4 w-4 text-sky-500" />,
  review: <Star className="h-4 w-4 text-amber-500" />,
};


export const Route = createFileRoute("/customer")({
  head: () => ({ meta: [{ title: "Customer Dashboard — BuzzHub" }] }),
  component: CustomerPage,
});

type SectionKey = "homepage" | "pesanan" | "katalog" | "pembayaran" | "ulasan" | "bantuan" | "pengaturan";

const CUSTOMER_SECTIONS: SectionKey[] = [
  "homepage",
  "pesanan",
  "katalog",
  "pembayaran",
  "ulasan",
  "bantuan",
  "pengaturan",
];

function normalizeCustomerSection(value: string | null): SectionKey | null {
  // URL lama ?section=pesan diarahkan ke Bantuan karena menu Pesan sudah dihapus.
  if (value === "pesan") return "bantuan";
  return value && CUSTOMER_SECTIONS.includes(value as SectionKey) ? (value as SectionKey) : null;
}

function getInitialCustomerSection(): SectionKey {
  if (typeof window !== "undefined") {
    const sp = normalizeCustomerSection(new URLSearchParams(window.location.search).get("section"));
    if (sp) return sp;
    try {
      const stored = normalizeCustomerSection(
        localStorage.getItem("buzzhub.active_section.customer"),
      );
      if (stored) return stored;
    } catch {}
  }
  return "homepage";
}

const navItems: { key: SectionKey; label: string; icon: ReactNode }[] = [
  { key: "homepage", label: "Homepage", icon: <LayoutDashboard className="h-4 w-4" /> },
  { key: "pesanan", label: "Pesanan", icon: <ShoppingBag className="h-4 w-4" /> },
  { key: "katalog", label: "Katalog", icon: <Package className="h-4 w-4" /> },
  { key: "pembayaran", label: "Pembayaran", icon: <CreditCard className="h-4 w-4" /> },
  { key: "ulasan", label: "Ulasan", icon: <Star className="h-4 w-4" /> },
  { key: "bantuan", label: "Bantuan", icon: <LifeBuoy className="h-4 w-4" /> },
  { key: "pengaturan", label: "Pengaturan", icon: <Settings className="h-4 w-4" /> },
];

const sectionMeta: Record<SectionKey, { title: string; subtitle: string }> = {
  homepage: { title: "Homepage", subtitle: "Pantau pesanan Anda yang sedang dikerjakan buzzer secara realtime" },
  pesanan: { title: "Pesanan", subtitle: "Kelola semua campaign yang telah dipesan" },
  katalog: { title: "Katalog", subtitle: "Pilih layanan buzzer yang tersedia" },
  pembayaran: { title: "Pembayaran", subtitle: "Kelola tagihan dan riwayat transaksi pembayaran" },
  ulasan: { title: "Ulasan", subtitle: "Kelola rating dan komentar Anda untuk buzzer" },
  bantuan: { title: "Bantuan", subtitle: "Panduan, FAQ, dan kontak support BuzzHub" },
  pengaturan: { title: "Pengaturan", subtitle: "Kelola preferensi notifikasi dan akun customer Anda" },
};

const PLATFORM_ICON: Record<Platform, ReactNode> = {
  "Instagram": <Instagram className="h-3.5 w-3.5" />,
  "TikTok": <Music2 className="h-3.5 w-3.5" />,
  "X (Twitter)": <Twitter className="h-3.5 w-3.5" />,
  "Facebook": <Facebook className="h-3.5 w-3.5" />,
  "YouTube": <Youtube className="h-3.5 w-3.5" />,
  "Telegram": <Send className="h-3.5 w-3.5" />,
};

function getTodayInputValue() {
  const today = new Date();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${today.getFullYear()}-${month}-${day}`;
}

function normalizeServiceType(value?: string | null) {
  return String(value ?? "").trim().toLowerCase();
}

function normalizeCatalogPlatform(platform?: string | null): Platform {
  const supported = ["Instagram", "TikTok", "X (Twitter)", "Facebook", "YouTube", "Telegram"] as const;
  if (platform && supported.includes(platform as typeof supported[number])) return platform as Platform;
  return "Instagram";
}

function normalizeCatalogService(catalog: { id: string; title: string; platform?: string | null; service_type?: string | null; description?: string | null; price?: number | string | null; slots?: number | string | null; thumbnail_url?: string | null }): Service {
  const platform = normalizeCatalogPlatform(catalog.platform);
  const title = String(catalog.title ?? "Layanan Katalog").trim() || "Layanan Katalog";
  const serviceType = String(catalog.service_type ?? "Layanan buzzer").trim() || "Layanan buzzer";
  const description = String(catalog.description ?? serviceType).trim() || serviceType;
  const type = inferCatalogCampaignType(catalog.service_type) ?? inferCatalogCampaignType(catalog.title) ?? "like";
  const basePrice = Number(catalog.price ?? 0);
  const baseSlots = Number(catalog.slots ?? 25);
  return {
    id: `catalog-${catalog.id}`,
    catalogId: catalog.id,
    category: "Online Buzzer",
    name: title,
    platforms: [platform],
    desc: serviceType,
    longDesc: description,
    rating: 4.9,
    reviews: 45,
    campaignType: type,
    catalogPricePerBuzzer: basePrice,
    catalogSlotsAvailable: baseSlots,
    thumbnailUrl: catalog.thumbnail_url ?? null,
    image: "from-fuchsia-500 to-pink-500",
    benefits: [
      "Buzzer terverifikasi & real people",
      "Laporan realtime & transparan",
      "Konten sesuai brand guideline",
      "Garansi target reach tercapai",
    ],
    faqs: [
      { q: "Berapa lama campaign berjalan?", a: "Rata-rata 5–14 hari tergantung kebutuhan campaign." },
      { q: "Apakah bisa custom brief?", a: "Bisa, brief bisa didiskusikan sebelum eksekusi." },
      { q: "Bagaimana laporan disampaikan?", a: "Dashboard realtime + PDF final report." },
    ],
    packages: [
      { tier: "Basic", price: basePrice, buzzers: baseSlots, reach: `${baseSlots} target buzzer`, benefits: ["Buzzer aktif", "Laporan progres"] },
      { tier: "Professional", price: Math.round(basePrice * 2.2), buzzers: Math.round(baseSlots * 2.4), reach: `${Math.round(baseSlots * 2.4)} target buzzer`, benefits: ["Buzzer premium", "Briefing khusus"] },
      { tier: "Enterprise", price: Math.round(basePrice * 4.5), buzzers: Math.round(baseSlots * 6), reach: `${Math.round(baseSlots * 6)} target buzzer`, benefits: ["Target besar", "Priority support"] },
    ],
  };
}

function inferCatalogCampaignType(value?: string | null): CampaignTypeKey | undefined {
  const source = (value ?? "").toLowerCase();
  if (!source) return undefined;
  if (source.includes("like") && source.includes("komentar")) return "like-komentar";
  if (source.includes("like") && source.includes("comment")) return "like-komentar";
  if (source.includes("like") && !source.includes("komentar")) return "like";
  if (source.includes("komentar") || source.includes("comment")) return "komentar";
  if (source.includes("share")) return "share";
  if (source.includes("follow")) return "follow";
  if (source.includes("review") || source.includes("ulasan")) return "review";
  return undefined;
}

type Store = ReturnType<typeof useCustomerStore>;

function CustomerPage() {
  const session = useRequireRole("customer");
  const navigate = useNavigate();
  const store = useCustomerStore(session?.email, session?.name, session ? {
    name: session.name,
    email: session.email,
    phone: session.phone ?? "",
    city: session.city ?? "",
    company: session.company ?? "",
  } : {});
  // Render awal harus sama antara server dan client. Section dari URL/localStorage
  // baru diterapkan setelah mount agar tidak memicu hydration mismatch.
  const [section, setSection] = useState<SectionKey>("homepage");
  const [initialSectionReady, setInitialSectionReady] = useState(false);
  // Section yang pernah dibuka tetap ter-mount (disembunyikan) supaya
  // perpindahan menu berikutnya tidak memuat ulang data dari awal.
  const [visitedSections, setVisitedSections] = useState<SectionKey[]>(() => [section]);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const { collapsed, toggle } = useSidebarCollapsed("customer");

  const markVisited = useCallback((key: SectionKey) => {
    setVisitedSections((prev) => (prev.includes(key) ? prev : [...prev, key]));
  }, []);

  // Cross-section dialogs
  const [proofOrder, setProofOrder] = useState<Order | null>(null);
  const [detailOrder, setDetailOrder] = useState<Order | null>(null);
  const [editOrder, setEditOrder] = useState<Order | null>(null);
  const [cancelOrder, setCancelOrder] = useState<Order | null>(null);
  const [wizardOpen, setWizardOpen] = useState(false);
  const [wizardService, setWizardService] = useState<Service | null>(null);
  const [detailService, setDetailService] = useState<Service | null>(null);
  const [payDialog, setPayDialog] = useState<Payment | null>(null);
  const [invoiceDialog, setInvoiceDialog] = useState<Payment | null>(null);

  const { data: remoteCampaigns } = useCampaigns();
  const { data: remoteJobs } = useCampaignJobs();
  
  useEffect(() => {
    if (!session?.email) return;
    const userEmail = session.email.toLowerCase();
    
    const jobsByCampaign = new Map<string, CampaignJob[]>();
    for (const job of remoteJobs) {
      const list = jobsByCampaign.get(job.campaign_id) ?? [];
      list.push(job);
      jobsByCampaign.set(job.campaign_id, list);
    }
    
    const myCampaigns = remoteCampaigns.filter(c => (c.customer_email || "").toLowerCase() === userEmail);
    
    // Notifikasi pesanan selesai
    myCampaigns.forEach(campaign => {
      const jobs = jobsByCampaign.get(campaign.id) ?? [];
      let isCompleted = false;
      if (campaign.status === "Selesai") {
        isCompleted = true;
      } else if (jobs.length > 0) {
        const completedCount = jobs.filter(j => j.status === "Selesai" || j.admin_verified_at).length;
        if (completedCount === jobs.length) isCompleted = true;
      }
      
      if (isCompleted) {
        const title = `Pesanan Selesai`;
        const bodyText = `Pesanan ${campaign.title} sudah selesai, tinggal memberikan rating.`;
        if (!store.state.notifications.some(n => n.body === bodyText)) {
          store.pushNotif({
            id: `ntf-done-${campaign.id}`,
            type: "campaign",
            title,
            body: bodyText
          });
        }
      }
    });
  }, [remoteCampaigns, remoteJobs, session?.email]);

  const notifPrefs = useCustomerNotifPreferences(session?.email);
  const visibleNotifications = useMemo(
    () => store.state.notifications.filter((n) => isCustomerNotifEnabled(n, notifPrefs)),
    [store.state.notifications, notifPrefs],
  );
  const unread = notifPrefs.inApp ? visibleNotifications.filter((n) => !n.read).length : 0;

  useEffect(() => {
    const initial = getInitialCustomerSection();
    if (initial !== "homepage") {
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
        localStorage.setItem("buzzhub.active_section.customer", section);
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
      const sp = normalizeCustomerSection(
        new URLSearchParams(window.location.search).get("section"),
      );
      if (sp) {
        markVisited(sp);
        setSection(sp);
      }
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [markVisited]);

  if (!session) {
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
      localStorage.removeItem("buzzhub.active_section.customer");
    } catch {}
    toast.success("Berhasil keluar");
    navigate({ to: "/" });
  };

  const go = (k: SectionKey) => {
    markVisited(k);
    setSection(k);
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  };

  const sidebarUser = {
    name: store.state.profile.name || session.name,
    email: store.state.profile.email || session.email,
    roleLabel: "customer",
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

  const meta = sectionMeta[section];
  const openNewOrder = (svc?: Service) => {
    const normalized: Service | null = svc && svc.catalogId
      ? ({
          ...svc,
          platforms: (svc.platforms?.length ? svc.platforms.map((p) => normalizeCatalogPlatform(p)) : ["Instagram"]) as Platform[],
          campaignType: svc.campaignType ?? deriveCatalogCampaignType(svc),
        } as Service)
      : svc ?? null;
    setWizardService(normalized);
    setWizardOpen(true);
  };

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
            <div className="flex min-w-0 items-center gap-2 sm:gap-3">
              <div className="min-w-0 flex flex-col justify-center">
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
              <Button variant="outline" size="icon" className="relative h-9 w-9 sm:h-10 sm:w-10" onClick={() => setNotifOpen(true)} aria-label="Buka Notifikasi">
                <Bell className="h-4 w-4" />
                {notifPrefs.inApp && unread > 0 && <span className="absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white">{unread > 9 ? "9+" : unread}</span>}
              </Button>
              <Button variant="outline" size="icon" className="h-9 w-9 sm:h-10 sm:w-10 md:hidden" aria-label="Keluar" onClick={() => setLogoutOpen(true)}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </header>


          {visitedSections.map((key) => (
            <div key={key} hidden={section !== key}>
              {key === "homepage" && (
                <SectionErrorBoundary title="Homepage gagal dimuat">
                  <CustomerHomepageSection
                    email={session.email}
                    name={store.state.profile.name || session.name}
                    onOrder={(svc) => openNewOrder(svc)}
                    onGoPesanan={() => go("pesanan")}
                  />
                </SectionErrorBoundary>
              )}
              {key === "pesanan" && (
                <SectionErrorBoundary title="Pesanan gagal dimuat">
                  <PesananSection
                    store={store}
                    customerEmail={session.email}
                    onNew={() => openNewOrder()}
                    onDetail={setDetailOrder}
                    onProof={(o) => setProofOrder(o)}
                  />
                </SectionErrorBoundary>
              )}
              {key === "katalog" && (
                <SectionErrorBoundary title="Katalog layanan gagal dimuat">
                  <KatalogSection
                    store={store}
                    onDetail={setDetailService}
                    onOrder={(svc) => openNewOrder(svc)}
                  />
                </SectionErrorBoundary>
              )}
              {key === "pembayaran" && (
                <SectionErrorBoundary title="Pembayaran gagal dimuat">
                  <PembayaranSection
                    store={store}
                    customerEmail={session.email}
                    onPay={setPayDialog}
                    onInvoice={setInvoiceDialog}
                  />
                </SectionErrorBoundary>
              )}
              {key === "ulasan" && (
                <SectionErrorBoundary title="Ulasan gagal dimuat">
                  <UlasanSection
                    customerEmail={session.email}
                    customerName={session.name}
                  />
                </SectionErrorBoundary>
              )}
              {key === "bantuan" && (
                <SectionErrorBoundary title="Bantuan gagal dimuat">
                  <HelpSection
                    role="customer"
                    user={{ name: store.state.profile.name || session.name, email: session.email }}
                    onNavigate={(target) => go(target as SectionKey)}
                  />
                </SectionErrorBoundary>
              )}
              {key === "pengaturan" && (
                <SectionErrorBoundary title="Pengaturan gagal dimuat">
                  <CustomerSettingsSection
                    customerEmail={session.email}
                  />
                </SectionErrorBoundary>
              )}
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
        primaryKeys={["homepage", "pesanan", "katalog", "pembayaran"]}
      />


      {/* Logout */}
      <AlertDialog open={logoutOpen} onOpenChange={setLogoutOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Keluar akun customer?</AlertDialogTitle>
            <AlertDialogDescription>Anda akan keluar dari sesi saat ini. Data lokal tetap aman.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={doLogout} className="gradient-brand text-brand-foreground">Keluar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Notifications */}
      <NotifSheet open={notifOpen} onOpenChange={setNotifOpen} store={store} customerEmail={session.email} onSelectSection={go} />

      {/* Bukti upload */}
      <ProofGalleryDialog order={proofOrder} onOpenChange={(v: boolean) => !v && setProofOrder(null)} />

      {/* Order detail */}
      <OrderDetailDialog order={detailOrder} onOpenChange={(v) => !v && setDetailOrder(null)} onProof={(o) => { setDetailOrder(null); setProofOrder(o); }} />

      {/* Edit order */}
      <EditOrderDialog order={editOrder} onOpenChange={(v) => !v && setEditOrder(null)} store={store} />

      {/* Cancel order */}
      <AlertDialog open={!!cancelOrder} onOpenChange={(v) => !v && setCancelOrder(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Batalkan pesanan?</AlertDialogTitle>
            <AlertDialogDescription>
              Pesanan <b>{cancelOrder?.invoice}</b> — {cancelOrder?.campaignName} akan dibatalkan. Aksi ini tidak dapat diurungkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => { if (cancelOrder) { store.cancelOrder(cancelOrder.id); toast.success("Pesanan dibatalkan"); setCancelOrder(null); } }}
              className="bg-rose-600 hover:bg-rose-700">
              Ya, Batalkan
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* New Order Wizard */}
      <WizardDialog
        open={wizardOpen}
        onOpenChange={setWizardOpen}
        initialService={wizardService}
        store={store}
        onCheckout={(payment) => { go("pembayaran"); setPayDialog(payment); }}
      />


      {/* Service detail */}
      <ServiceDetailDialog
        service={detailService}
        onOpenChange={(v) => !v && setDetailService(null)}
        onOrder={(svc) => { setDetailService(null); openNewOrder(svc); }}
      />

      {/* Pay */}
      <PayDialog payment={payDialog} onOpenChange={(v) => !v && setPayDialog(null)} store={store} />

      {/* Invoice */}
      <InvoiceDialog payment={invoiceDialog} onOpenChange={(v) => !v && setInvoiceDialog(null)} store={store} />
    </div>
  );
}

/* ============ RINGKASAN ============ */
function RingkasanSection({
  store, onGo, onLihatBukti, onOrderNow,
}: {
  store: Store;
  onGo: (k: SectionKey) => void;
  onLihatBukti: (o: Order) => void;
  onOrderNow: (svc: Service) => void;
}) {
  const { state, services } = store;

  const [pending, setPending] = useState<FilterState>(defaultFilters);
  const [applied, setApplied] = useState<FilterState>(defaultFilters);
  const [loading, setLoading] = useState(false);

  const campaignOptions = useMemo(
    () => Array.from(new Set(state.orders.map((o) => o.campaignName))).sort(),
    [state.orders],
  );

  const activeCount = countActiveFilters(applied);

  const filteredOrders = useMemo(() => {
    const { from, to } = resolveRange(applied);
    return state.orders.filter((o) => {
      const d = new Date(o.createdAt);
      if (from && d < from) return false;
      if (to && d > to) return false;
      if (applied.campaign !== "all" && o.campaignName !== applied.campaign) return false;
      if (applied.platform !== "all" && o.platform !== applied.platform) return false;
      if (applied.status !== "all") {
        const map: Record<Exclude<FilterState["status"], "all">, OrderStatus[]> = {
          active: ["Berjalan"],
          pending: ["Menunggu", "Diproses"],
          completed: ["Selesai"],
          cancelled: ["Dibatalkan"],
        };
        if (!map[applied.status].includes(o.status)) return false;
      }
      if (applied.q) {
        const q = applied.q.toLowerCase();
        if (!o.campaignName.toLowerCase().includes(q) && !o.invoice.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [state.orders, applied]);

  const running = filteredOrders.filter((o) => o.status === "Berjalan");
  const totalOrders = filteredOrders.length;
  const totalSpent = filteredOrders
    .flatMap((o) => state.payments.filter((p) => p.orderId === o.id && p.status === "Lunas"))
    .reduce((a, p) => a + p.amount, 0);
  const totalReach = filteredOrders.reduce((a, o) => a + o.report.reach, 0);
  const avgProgress = filteredOrders.length
    ? Math.round(filteredOrders.reduce((a, o) => a + o.progress, 0) / filteredOrders.length)
    : 0;
  const featured = running[0];

  const recommended = useMemo(() => {
    if (applied.platform === "all") return services.slice(0, 4);
    const match = services.filter((s) => s.platforms.includes(applied.platform as Platform));
    return (match.length ? match : services).slice(0, 4);
  }, [services, applied.platform]);

  const apply = () => {
    setLoading(true);
    setTimeout(() => {
      setApplied(pending);
      setLoading(false);
    }, 280);
  };
  const reset = () => {
    setPending(defaultFilters);
    setApplied(defaultFilters);
  };

  return (
    <>
      <DashboardFilters
        pending={pending}
        setPending={setPending}
        onApply={apply}
        onReset={reset}
        loading={loading}
        activeCount={activeCount}
        campaignOptions={campaignOptions}
      />

      {loading ? (
        <div className="mt-4 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28 rounded-2xl" />)}
        </div>
      ) : (
        <div className="mt-4 grid gap-4 duration-300 animate-in fade-in sm:grid-cols-2 lg:grid-cols-4">
          <ClickableStat label="Kampanye Berjalan" value={running.length.toString()} hint="Realtime tracking" icon={<TrendingUp className="h-5 w-5" />} onClick={() => onGo("pesanan")} />
          <ClickableStat label="Total Pesanan" value={totalOrders.toString()} hint="Sesuai filter" icon={<ShoppingBag className="h-5 w-5" />} onClick={() => onGo("pesanan")} />
          <ClickableStat label="Total Investasi" value={formatIDR(totalSpent)} hint="Lunas dalam rentang" icon={<CreditCard className="h-5 w-5" />} onClick={() => onGo("pembayaran")} />
          <ClickableStat label="Total Reach" value={totalReach >= 1e6 ? (totalReach / 1e6).toFixed(1) + "M" : (totalReach / 1e3).toFixed(0) + "K"} hint={`Progress rata-rata ${avgProgress}%`} icon={<BarChart3 className="h-5 w-5" />} onClick={() => featured && onLihatBukti(featured)} />
        </div>
      )}

      {!loading && featured && (
        <button
          type="button"
          onClick={() => onLihatBukti(featured)}
          className="mt-6 block w-full overflow-hidden rounded-2xl border border-border gradient-brand p-6 text-left text-brand-foreground shadow-glow transition-transform hover:scale-[1.005]">
          <div className="grid items-center gap-4 md:grid-cols-[1fr_auto]">
            <div>
              <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-semibold backdrop-blur">
                <Sparkles className="h-3 w-3" /> Live Campaign
              </span>
              <h3 className="mt-2 font-display text-2xl font-bold">{featured.campaignName}</h3>
              <p className="mt-1 text-sm opacity-90">
                {featured.buzzersJoined} dari {featured.buzzers} buzzer aktif · Sentiment +{featured.report.sentiment.positive}%
              </p>
              <div className="mt-4 h-2 w-full max-w-md overflow-hidden rounded-full bg-white/20">
                <div className="h-full bg-white transition-all" style={{ width: `${featured.progress}%` }} />
              </div>
            </div>
            <span className="inline-flex items-center gap-2 rounded-lg bg-white/20 px-4 py-2 text-sm font-semibold backdrop-blur">
              <ImageIcon className="h-4 w-4" /> Bukti Upload
            </span>
          </div>
        </button>
      )}

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="rounded-2xl border border-border bg-card shadow-sm">
          <div className="flex items-center justify-between border-b border-border p-5">
            <div>
              <h3 className="font-display text-lg font-bold">Riwayat Pesanan Terbaru</h3>
              <p className="text-sm text-muted-foreground">{filteredOrders.length} pesanan sesuai filter</p>
            </div>
            <Button size="sm" variant="outline" onClick={() => onGo("pesanan")}>Semua</Button>
          </div>
          <div className="overflow-x-auto">
            {loading ? (
              <div className="space-y-2 p-5">
                {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
              </div>
            ) : filteredOrders.length === 0 ? (
              <EmptyState icon={<Inbox className="h-8 w-8" />} title="No Data Found" desc="Tidak ada pesanan yang cocok dengan filter." />
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Campaign</TableHead>
                    <TableHead>Tanggal</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.slice(0, 5).map((o) => (
                    <TableRow key={o.id} className="cursor-pointer" onClick={() => onLihatBukti(o)}>
                      <TableCell>
                        <p className="font-medium">{o.campaignName}</p>
                        <p className="text-xs text-muted-foreground">{o.serviceName}</p>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{o.createdAt}</TableCell>
                      <TableCell><StatusBadge status={o.status} /></TableCell>
                      <TableCell className="text-right font-semibold">{formatIDR(o.total)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <h3 className="font-display text-lg font-bold">Rekomendasi Layanan</h3>
          <p className="text-sm text-muted-foreground">
            {applied.platform === "all" ? "Paling populer minggu ini" : `Untuk platform ${applied.platform}`}
          </p>
          <ul className="mt-4 space-y-3">
            {recommended.map((s) => (
              <li key={s.id} className="rounded-xl border border-border p-3 transition-colors hover:bg-muted/50">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{s.name}</p>
                    <p className="text-xs text-muted-foreground">{s.category}</p>
                  </div>
                  <p className="shrink-0 text-xs text-muted-foreground">Atur jumlah buzzer saat memesan</p>
                </div>
                <Button size="sm" variant="outline" className="mt-3 w-full" onClick={() => onOrderNow(s)}>Pesan sekarang</Button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}

function ClickableStat({ label, value, hint, icon, onClick }: { label: string; value: string; hint?: string; icon: ReactNode; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="text-left focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-2xl">
      <StatCard label={label} value={value} hint={hint} icon={icon} />
    </button>
  );
}



/* ============ FILTER BAR ============ */
type DateRangePreset = "today" | "yesterday" | "last7" | "last30" | "thisMonth" | "lastMonth" | "custom" | "all";
type StatusFilter = "all" | "active" | "pending" | "completed" | "cancelled";
type PlatformFilter = "all" | Platform | "LinkedIn";

type FilterState = {
  preset: DateRangePreset;
  from?: string; // yyyy-MM-dd
  to?: string;
  campaign: string; // "all" or name
  platform: PlatformFilter;
  status: StatusFilter;
  q: string;
};

const defaultFilters: FilterState = {
  preset: "all", campaign: "all", platform: "all", status: "all", q: "",
};

const PRESET_LABEL: Record<DateRangePreset, string> = {
  all: "Semua Waktu",
  today: "Hari Ini",
  yesterday: "Kemarin",
  last7: "7 Hari Terakhir",
  last30: "30 Hari Terakhir",
  thisMonth: "Bulan Ini",
  lastMonth: "Bulan Lalu",
  custom: "Kustom",
};

function startOfDay(d: Date) { const x = new Date(d); x.setHours(0, 0, 0, 0); return x; }
function endOfDay(d: Date) { const x = new Date(d); x.setHours(23, 59, 59, 999); return x; }

function resolveRange(f: FilterState): { from?: Date; to?: Date } {
  const now = new Date();
  switch (f.preset) {
    case "today": return { from: startOfDay(now), to: endOfDay(now) };
    case "yesterday": {
      const y = new Date(now); y.setDate(y.getDate() - 1);
      return { from: startOfDay(y), to: endOfDay(y) };
    }
    case "last7": {
      const s = new Date(now); s.setDate(s.getDate() - 6);
      return { from: startOfDay(s), to: endOfDay(now) };
    }
    case "last30": {
      const s = new Date(now); s.setDate(s.getDate() - 29);
      return { from: startOfDay(s), to: endOfDay(now) };
    }
    case "thisMonth": {
      const s = new Date(now.getFullYear(), now.getMonth(), 1);
      return { from: startOfDay(s), to: endOfDay(now) };
    }
    case "lastMonth": {
      const s = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const e = new Date(now.getFullYear(), now.getMonth(), 0);
      return { from: startOfDay(s), to: endOfDay(e) };
    }
    case "custom":
      return {
        from: f.from ? startOfDay(new Date(f.from)) : undefined,
        to: f.to ? endOfDay(new Date(f.to)) : undefined,
      };
    default: return {};
  }
}

function countActiveFilters(f: FilterState) {
  let n = 0;
  if (f.preset !== "all") n++;
  if (f.campaign !== "all") n++;
  if (f.platform !== "all") n++;
  if (f.status !== "all") n++;
  if (f.q.trim()) n++;
  return n;
}

const PLATFORM_FILTERS: { value: PlatformFilter; label: string }[] = [
  { value: "all", label: "All Platforms" },
  { value: "Instagram", label: "Instagram" },
  { value: "TikTok", label: "TikTok" },
  { value: "X (Twitter)", label: "X (Twitter)" },
  { value: "Facebook", label: "Facebook" },
  { value: "YouTube", label: "YouTube" },
  { value: "LinkedIn", label: "LinkedIn" },
];

const STATUS_FILTERS: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "All Status" },
  { value: "active", label: "Active" },
  { value: "pending", label: "Pending" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

function DashboardFilters({
  pending, setPending, onApply, onReset, loading, activeCount, campaignOptions,
}: {
  pending: FilterState;
  setPending: (f: FilterState) => void;
  onApply: () => void;
  onReset: () => void;
  loading: boolean;
  activeCount: number;
  campaignOptions: string[];
}) {
  const [dateOpen, setDateOpen] = useState(false);
  const rangeLabel = (() => {
    if (pending.preset === "custom") {
      const f = pending.from ? format(new Date(pending.from), "d MMM") : "?";
      const t = pending.to ? format(new Date(pending.to), "d MMM yyyy") : "?";
      return `${f} – ${t}`;
    }
    return PRESET_LABEL[pending.preset];
  })();

  const setPreset = (preset: DateRangePreset) => {
    setPending({ ...pending, preset, from: undefined, to: undefined });
    if (preset !== "custom") setDateOpen(false);
  };

  return (
    <section className="rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-5">
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-semibold">Filter Dashboard</h2>
          {activeCount > 0 && (
            <Badge className="gradient-brand text-brand-foreground">{activeCount} aktif</Badge>
          )}
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-[1.2fr_1fr_1fr_1fr_1.2fr_auto]">
        {/* Date range */}
        <Popover open={dateOpen} onOpenChange={setDateOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="justify-start font-normal">
              <CalendarIcon className="mr-2 h-4 w-4" />
              <span className="truncate">{rangeLabel}</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <div className="grid gap-1 border-b border-border p-2 sm:grid-cols-2">
              {(["today", "yesterday", "last7", "last30", "thisMonth", "lastMonth", "all", "custom"] as DateRangePreset[]).map((p) => (
                <Button key={p} size="sm" variant={pending.preset === p ? "default" : "ghost"}
                  className={cn("justify-start", pending.preset === p && "gradient-brand text-brand-foreground")}
                  onClick={() => setPreset(p)}>
                  {PRESET_LABEL[p]}
                </Button>
              ))}
            </div>
            {pending.preset === "custom" && (
              <div className="pointer-events-auto p-3">
                <Calendar
                  mode="range"
                  selected={{
                    from: pending.from ? new Date(pending.from) : undefined,
                    to: pending.to ? new Date(pending.to) : undefined,
                  }}
                  onSelect={(r) => setPending({
                    ...pending,
                    from: r?.from ? format(r.from, "yyyy-MM-dd") : undefined,
                    to: r?.to ? format(r.to, "yyyy-MM-dd") : undefined,
                  })}
                  numberOfMonths={1}
                  className="pointer-events-auto"
                />
              </div>
            )}
          </PopoverContent>
        </Popover>

        {/* Campaign */}
        <Select value={pending.campaign} onValueChange={(v) => setPending({ ...pending, campaign: v })}>
          <SelectTrigger><SelectValue placeholder="All Campaigns" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Campaigns</SelectItem>
            {campaignOptions.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>

        {/* Platform */}
        <Select value={pending.platform} onValueChange={(v) => setPending({ ...pending, platform: v as PlatformFilter })}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            {PLATFORM_FILTERS.map((p) => <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>)}
          </SelectContent>
        </Select>

        {/* Status */}
        <Select value={pending.status} onValueChange={(v) => setPending({ ...pending, status: v as StatusFilter })}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            {STATUS_FILTERS.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
          </SelectContent>
        </Select>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Search campaign..."
            value={pending.q}
            onChange={(e) => setPending({ ...pending, q: e.target.value })}
            onKeyDown={(e) => { if (e.key === "Enter") onApply(); }}
          />
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button className="gradient-brand text-brand-foreground" onClick={onApply} disabled={loading}>
            {loading ? "Memuat..." : "Apply Filter"}
          </Button>
          <Button variant="outline" onClick={onReset} disabled={loading} title="Reset">
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}


/* ============ PESANAN ============ */
const ORDER_STATUSES: ("Semua" | OrderStatus)[] = ["Semua", "Menunggu Verifikasi Admin", "Menunggu", "Diproses", "Berjalan", "Selesai", "Dibatalkan"];
const PAGE = 8;

function PesananSection({ store, customerEmail, onNew, onDetail, onProof }: {
  store: Store; customerEmail: string; onNew: () => void; onDetail: (o: Order) => void; onProof: (o: Order) => void;
}) {
  const { data: remoteCampaigns } = useCampaigns();
  const { data: remoteJobs } = useCampaignJobs();
  const [status, setStatus] = useState<"Semua" | OrderStatus>("Semua");
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);

  const jobsByCampaign = useMemo(() => {
    const result = new Map<string, CampaignJob[]>();
    for (const job of remoteJobs) {
      const list = result.get(job.campaign_id) ?? [];
      list.push(job);
      result.set(job.campaign_id, list);
    }
    return result;
  }, [remoteJobs]);

  const remoteOrders = useMemo(() => store.state.orders.map((order) => {
    const campaign = remoteCampaigns.find((item) =>
      (item.customer_email || "").toLowerCase() === (customerEmail || "").toLowerCase() &&
      item.title.trim().toLowerCase() === order.campaignName.trim().toLowerCase(),
    );
    const campaignId = order.campaignId ?? campaign?.id;
    const jobs = campaignId ? jobsByCampaign.get(campaignId) ?? [] : [];
    const isApproved = campaign?.payment_status === "Pembayaran Disetujui" || campaign?.status === "Aktif";
    if (!jobs.length) {
      return campaign?.status === "Selesai"
        ? { ...order, campaignId, status: "Selesai" as OrderStatus }
        : isApproved
        ? { ...order, campaignId, status: "Berjalan" as OrderStatus }
        : campaign?.payment_status === "Menunggu Verifikasi" || campaign?.payment_status === "Menunggu Verifikasi Admin"
        ? { ...order, campaignId, status: "Menunggu Verifikasi Admin" as any }
        : order;
    }
    const completed = jobs.filter((job) => job.status === "Selesai" || job.admin_verified_at).length;
    const taken = jobs.filter((job) => job.buzzer_email).length;
    const hasReview = jobs.some((job) => job.status === "Review");
    const hasActive = jobs.some((job) => job.status === "Diambil" || job.status === "Revisi");
    return {
      ...order,
      campaignId,
      buzzers: jobs.length,
      buzzersJoined: taken,
      buzzerAccounts: jobs.filter((job) => job.buzzer_email).map((job) => job.buzzer_name || job.buzzer_email!),
      progress: Math.round((completed / jobs.length) * 100),
      status: (campaign?.status === "Selesai" || completed === jobs.length ? "Selesai" : hasReview || hasActive || isApproved ? "Berjalan" : campaign?.payment_status === "Menunggu Verifikasi" || campaign?.payment_status === "Menunggu Verifikasi Admin" ? "Menunggu Verifikasi Admin" : "Menunggu") as OrderStatus,
      proofs: jobs.filter((job) => job.proof_url).map((job) => ({
        id: job.id,
        buzzerName: job.buzzer_name ?? job.buzzer_email ?? "Buzzer",
        buzzerEmail: job.buzzer_email,
        platform: job.platform as Platform,
        imageUrl: job.proof_url!.split(" | ")[0],
        caption: job.note ?? "Bukti pengerjaan",
        uploadedAt: job.updated_at,
        verified: job.status === "Selesai" || !!job.admin_verified_at,
      })),
    } as Order;
  }), [store.state.orders, jobsByCampaign, remoteCampaigns, customerEmail]);

  const adminOrders = useMemo<Order[]>(() => remoteCampaigns
    .filter((campaign) => (campaign.customer_email || "").toLowerCase() === (customerEmail || "").toLowerCase())
    .filter((campaign) => campaign.payment_status === "Pembayaran Disetujui")
    .filter((campaign) => !store.state.orders.some((order) => order.campaignId === campaign.id || order.campaignName.trim().toLowerCase() === campaign.title.trim().toLowerCase()))
    .map((campaign) => {
      const jobs = jobsByCampaign.get(campaign.id) ?? [];
      const completed = jobs.filter((job) => job.status === "Selesai").length;
      const taken = jobs.filter((job) => job.buzzer_email).length;
      return {
        id: `remote-${campaign.id}`,
        campaignId: campaign.id,
        buzzerAccounts: jobs.filter((job) => job.buzzer_email).map((job) => job.buzzer_name || job.buzzer_email!),
        invoice: `CAM-${campaign.id.slice(0, 8).toUpperCase()}`,
        serviceId: "admin-campaign",
        serviceName: "Kampanye BuzzPro",
        packageTier: "Professional" as const,
        platform: campaign.platform as Platform,
        campaignName: campaign.title,
        description: campaign.brief,
        startDate: campaign.created_at.slice(0, 10),
        endDate: campaign.deadline,
        buzzers: campaign.slots,
        buzzersJoined: taken,
        progress: jobs.length ? Math.round((completed / jobs.length) * 100) : 0,
        status: (campaign.status === "Selesai" ? "Selesai" : campaign.status === "Dibatalkan" ? "Dibatalkan" : "Berjalan") as OrderStatus,
        total: Number(campaign.budget),
        createdAt: campaign.created_at.slice(0, 10),
        report: { reach: 0, impression: 0, like: 0, comment: 0, share: 0, engagementRate: 0, sentiment: { positive: 0, neutral: 0, negative: 0 }, daily: [], buzzers: [] },
        proofs: [],
      } satisfies Order;
    }), [remoteCampaigns, customerEmail, store.state.orders, jobsByCampaign]);

  const allOrders = useMemo(() => [...remoteOrders, ...adminOrders], [remoteOrders, adminOrders]);

  const filtered = useMemo(() => allOrders.filter((o) => {
    if (status !== "Semua" && o.status !== status) return false;
    if (q && !o.campaignName.toLowerCase().includes(q.toLowerCase()) && !o.invoice.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  }), [allOrders, status, q]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE));
  const cp = Math.min(page, totalPages);
  const paged = filtered.slice((cp - 1) * PAGE, cp * PAGE);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 sm:flex-row sm:items-center">
        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input className="pl-9 w-full" placeholder="Cari campaign / invoice..." value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Select value={status} onValueChange={(v) => { setStatus(v as typeof status); setPage(1); }}>
            <SelectTrigger className="w-full sm:w-[180px]"><Filter className="mr-2 h-4 w-4" /><SelectValue /></SelectTrigger>
            <SelectContent>{ORDER_STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
          </Select>
          <Button className="w-full sm:w-auto gradient-brand text-brand-foreground" onClick={onNew}><Plus className="mr-1 h-4 w-4" /> Pesan Baru</Button>
        </div>
      </div>

      {paged.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
          <EmptyState icon={<Inbox className="h-8 w-8" />} title="Belum ada pesanan" desc="Coba ubah filter atau buat pesanan baru." />
        </div>
      ) : (
        <>
          {/* Mobile Card List (< sm) */}
          <div className="space-y-3 sm:hidden">
            {paged.map((o) => (
              <div
                key={o.id}
                className="cursor-pointer rounded-2xl border border-border bg-card p-4 shadow-sm space-y-3 transition-colors hover:bg-muted/40"
                onClick={() => onDetail(o)}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs font-semibold text-muted-foreground">{o.invoice}</span>
                  <StatusBadge status={o.status} />
                </div>
                <div>
                  <h4 className="font-display font-bold text-sm text-foreground line-clamp-2">{o.campaignName}</h4>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1">{PLATFORM_ICON[o.platform]} {o.platform}</span>
                    <span>•</span>
                    <span>{o.buzzersJoined} / {o.buzzers} buzzer</span>
                  </div>
                </div>
                <div>
                  <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
                    <span>Progress</span>
                    <span className="font-semibold text-foreground">{o.progress}%</span>
                  </div>
                  <Progress value={o.progress} className="h-1.5" />
                </div>
                <div className="flex items-center justify-between border-t border-border/60 pt-2.5">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Total Biaya</span>
                    <p className="text-sm font-bold text-foreground">{formatIDR(o.total)}</p>
                  </div>
                  <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 w-8 p-0"
                      title="Detail"
                      aria-label="Detail"
                      onClick={() => onDetail(o)}
                    >
                      <Eye className="h-3.5 w-3.5" />
                    </Button>
                    <Button size="sm" variant="outline" className="h-8 px-2.5 text-xs text-primary" onClick={() => onProof(o)}>
                      <ImageIcon className="mr-1 h-3.5 w-3.5" /> Bukti
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table (>= sm) */}
          <div className="hidden sm:block overflow-x-auto rounded-2xl border border-border bg-card shadow-sm">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice</TableHead>
                  <TableHead>Campaign</TableHead>
                  <TableHead className="hidden sm:table-cell">Platform</TableHead>
                  <TableHead>Buzzer</TableHead>
                  <TableHead className="hidden sm:table-cell">Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden sm:table-cell">Progress</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paged.map((o) => (
                  <TableRow key={o.id} className="cursor-pointer" onClick={() => onDetail(o)}>
                    <TableCell className="font-mono text-xs">{o.invoice}</TableCell>
                    <TableCell className="max-w-[200px] truncate font-medium">{o.campaignName}</TableCell>
                    <TableCell className="hidden sm:table-cell"><span className="inline-flex items-center gap-1">{PLATFORM_ICON[o.platform]} {o.platform}</span></TableCell>
                    <TableCell>
                      <div>{o.buzzersJoined} / {o.buzzers}</div>
                      {o.buzzerAccounts?.length ? (
                        <div className="max-w-[180px] truncate text-xs text-muted-foreground" title={o.buzzerAccounts.join(", ")}>
                          {o.buzzerAccounts.join(", ")}
                        </div>
                      ) : (
                        <div className="text-xs text-muted-foreground">Menunggu buzzer</div>
                      )}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">{formatIDR(o.total)}</TableCell>
                    <TableCell><StatusBadge status={o.status} /></TableCell>
                    <TableCell className="hidden w-[140px] sm:table-cell">
                      <div className="flex items-center gap-2">
                        <Progress value={o.progress} className="h-1.5 flex-1" />
                        <span className="text-[11px] text-muted-foreground">{o.progress}%</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="flex items-center justify-end gap-0.5">
                        <Button size="icon" variant="ghost" className="h-8 w-8" onClick={(e) => { e.stopPropagation(); onDetail(o); }} title="Detail"><Eye className="h-4 w-4" /></Button>
                        <Button size="icon" variant="ghost" className="hidden h-8 w-8 text-primary sm:inline-flex" onClick={(e) => { e.stopPropagation(); onProof(o); }} title="Bukti Upload"><ImageIcon className="h-4 w-4" /></Button>
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </>
      )}

      {filtered.length > PAGE && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">Menampilkan {(cp - 1) * PAGE + 1}–{Math.min(cp * PAGE, filtered.length)} dari {filtered.length}</p>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" disabled={cp <= 1} onClick={() => setPage(cp - 1)}><ChevronLeft className="h-4 w-4" /></Button>
            <span className="grid place-items-center px-3 text-sm">{cp} / {totalPages}</span>
            <Button size="sm" variant="outline" disabled={cp >= totalPages} onClick={() => setPage(cp + 1)}><ChevronRight className="h-4 w-4" /></Button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ============ KATALOG ============ */
const UNSPLASH = (id: string) => `https://images.unsplash.com/photo-${id}?w=800&h=450&fit=crop&auto=format&q=80`;
const SERVICE_IMAGE_MAP: Record<string, string> = {
  "Trending Topic Booster": UNSPLASH("1611926653458-09294b3142bf"), // twitter phone
  "Viral Marketing Campaign": UNSPLASH("1611162617213-7d7a39e9b1d7"), // tiktok
  "Brand Awareness Push": UNSPLASH("1552664730-d307ca884978"), // brand billboard
  "Social Engagement Booster": UNSPLASH("1611605698335-8b1569810432"), // instagram likes
  "Product Review Campaign": UNSPLASH("1556742044-3c52d6e88c62"), // review laptop
  "Influencer Support Program": UNSPLASH("1524504388940-b1c1722653e1"), // influencer camera
  "Counter Narrative Response": UNSPLASH("1495020689067-958852a7765e"), // news paper
  "Livestream Amplifier": UNSPLASH("1598550476439-6847785fcea6"), // livestream
  "Video Reels Distribution": UNSPLASH("1596558450268-9c27524ba856"), // tiktok reels
  "Community Seeding": UNSPLASH("1529156069898-49953e39b3ac"), // community
  "Event Crowd Booster": UNSPLASH("1492684223066-81342ee5ff30"), // concert crowd
  "Seminar Audience": UNSPLASH("1540575467063-178a50c2df87"), // seminar
  "Grand Opening Crowd": UNSPLASH("1519671482749-fd09be7ccebf"), // ribbon opening
  "Product Launch Crowd": UNSPLASH("1505373877841-8d25f7d46678"), // stage launch
  "Gathering Participants": UNSPLASH("1511578314322-379afb476865"), // gathering
  "Flash Mob Activation": UNSPLASH("1533174072545-7a4b6ad7a6c3"), // dance
  "Community Activation": UNSPLASH("1517457373958-b7bdd4587205"), // community activation
  "Roadshow Support": UNSPLASH("1517649763962-0c623066013b"), // roadshow
  "Concert Cheerleader": UNSPLASH("1470229722913-7c0e2dbbafd3"), // concert
  "Political Rally Crowd": UNSPLASH("1591189863430-ab87e120f312"), // rally
};
const DEFAULT_ONLINE_IMG = UNSPLASH("1611605698335-8b1569810432");
function serviceImageUrl(s: Service) {
  return s.thumbnailUrl ?? SERVICE_IMAGE_MAP[s.name] ?? DEFAULT_ONLINE_IMG;
}

function KatalogSection({ onDetail, onOrder }: { store: Store; onDetail: (s: Service) => void; onOrder: (s: Service) => void }) {
  const [q, setQ] = useState("");
  const { data: catalogs, loading: catalogsLoading } = useServiceCatalogs();

  const adminCatalogs = catalogs.filter((catalog) => {
    const searchable = `${catalog.title ?? ""} ${catalog.service_type ?? ""} ${catalog.description ?? ""}`.toLowerCase();
    return catalog.status === "Aktif" && (!q || searchable.includes(q.toLowerCase()));
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-border bg-card p-4">
        <div className="relative flex-1 min-w-[180px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input className="pl-9" placeholder="Cari layanan..." value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
      </div>

      {catalogsLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <Skeleton className="h-72 rounded-2xl" />
          <Skeleton className="h-72 rounded-2xl" />
          <Skeleton className="h-72 rounded-2xl" />
        </div>
      ) : adminCatalogs.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
          <EmptyState
            icon={<Package className="h-8 w-8 text-muted-foreground" />}
            title="Belum ada katalog layanan"
            desc={q ? "Tidak ada katalog layanan yang cocok dengan pencarian." : "Belum ada katalog layanan aktif yang dibuat oleh admin."}
          />
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {adminCatalogs.map((catalog) => {
            const catalogService = normalizeCatalogService(catalog);
            return (
              <article key={catalog.id} className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                <div className="relative h-48 overflow-hidden bg-muted">
                  {catalog.thumbnail_url ? (
                    <img src={catalog.thumbnail_url} alt={catalog.title ?? "Layanan katalog"} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  ) : (
                    <div className="flex h-full items-center justify-center gradient-brand text-brand-foreground"><Megaphone className="h-10 w-10" /></div>
                  )}
                  <span className="absolute left-3 top-3 rounded-full bg-background/85 px-2.5 py-0.5 text-xs font-semibold text-foreground backdrop-blur">{catalog.platform}</span>
                </div>
                <div className="flex flex-1 flex-col space-y-3 p-4">
                  <div>
                    <h3 className="font-display font-bold">{catalog.title ?? "Layanan katalog"}</h3>
                    <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{catalog.service_type ?? "Layanan buzzer"}</p>
                  </div>
                  <div className="flex flex-wrap gap-1.5 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5">{PLATFORM_ICON[catalogService.platforms[0]]} {catalogService.platforms[0]}</span>
                  </div>
                  <div className="rounded-xl border border-border/70 bg-muted/20 p-3">
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <span className="text-[11px] font-medium text-muted-foreground">Harga Layanan</span>
                        <p className="mt-0.5 text-base font-bold text-gradient-brand">
                          {formatIDR(Number(catalog.price ?? 0))}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-[11px] font-medium text-muted-foreground">Target Buzzer</span>
                        <p className="mt-0.5 text-sm font-semibold text-foreground">
                          {Number(catalog.slots ?? 0)} buzzer
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-auto flex items-center gap-2 pt-1">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-9 w-9 p-0 shrink-0"
                      title="Detail"
                      aria-label="Detail"
                      onClick={() => onDetail(catalogService)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button size="sm" className="flex-1 gradient-brand text-brand-foreground" onClick={() => onOrder(catalogService)}>Pesan</Button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}

function PembayaranSection({
  store,
  customerEmail,
  onPay,
  onInvoice,
}: {
  store: Store;
  customerEmail?: string;
  onPay: (p: Payment) => void;
  onInvoice: (p: Payment) => void;
}) {
  const [status, setStatus] = useState<"Semua" | PaymentStatus>("Semua");
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [remotePayments, setRemotePayments] = useState<Payment[]>([]);

  // Sinkronisasi realtime pembayaran dari database Supabase untuk akun customer baru / multi-perangkat
  useEffect(() => {
    if (!customerEmail) return;
    const normalized = customerEmail.trim().toLowerCase();
    let isMounted = true;

    const fetchRemote = async () => {
      try {
        const { data, error } = await supabase
          .from("payments")
          .select("id, invoice_no, campaign_name, status, rejection_reason, amount, method, created_at, customer_email")
          .ilike("customer_email", normalized)
          .order("created_at", { ascending: false });

        if (!isMounted || error || !data) return;

        const mapped: Payment[] = data.map((p) => {
          let pStatus: PaymentStatus = "Menunggu Verifikasi";
          const rawStatus = (p.status || "").toLowerCase();
          if (rawStatus === "lunas" || rawStatus === "berhasil" || rawStatus === "disetujui") {
            pStatus = "Lunas";
          } else if (rawStatus === "gagal" || rawStatus === "ditolak") {
            pStatus = "Gagal";
          } else if (rawStatus === "refund") {
            pStatus = "Refund";
          } else if (rawStatus === "pending" || rawStatus === "menunggu pembayaran") {
            pStatus = "Belum Dibayar";
          } else {
            pStatus = "Menunggu Verifikasi";
          }

          return {
            id: p.id,
            invoice: p.invoice_no || `INV-${p.id.slice(0, 8).toUpperCase()}`,
            orderId: p.id,
            campaignName: p.campaign_name || "Campaign",
            amount: Number(p.amount || 0),
            date: p.created_at ? p.created_at.slice(0, 10) : new Date().toISOString().slice(0, 10),
            method: p.method || "Transfer Bank",
            channel: "Manual Verification",
            status: pStatus,
          };
        });

        setRemotePayments(mapped);
      } catch (err) {
        console.warn("Gagal memuat remote payments customer:", err);
      }
    };

    void fetchRemote();
    const interval = setInterval(fetchRemote, 3000);

    const channelId = Math.random().toString(36).slice(2, 7);
    const channel = supabase
      .channel(`cust-pay-sync-${channelId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "payments" },
        () => { void fetchRemote(); }
      )
      .subscribe();

    return () => {
      isMounted = false;
      clearInterval(interval);
      void supabase.removeChannel(channel);
    };
  }, [customerEmail]);

  // Gabungkan store.state.payments dengan remotePayments
  const combinedPayments = useMemo(() => {
    const list = [...store.state.payments];
    for (const rp of remotePayments) {
      const idx = list.findIndex(
        (p) =>
          p.id === rp.id ||
          p.invoice === rp.invoice ||
          p.campaignName.trim().toLowerCase() === rp.campaignName.trim().toLowerCase()
      );
      if (idx >= 0) {
        list[idx] = {
          ...list[idx],
          status: rp.status,
          amount: rp.amount > 0 ? rp.amount : list[idx].amount,
          date: rp.date || list[idx].date,
          method: rp.method || list[idx].method,
        };
      } else {
        list.unshift(rp);
      }
    }
    return list;
  }, [store.state.payments, remotePayments]);

  const totalPaid = combinedPayments.filter((p) => p.status === "Lunas").reduce((a, p) => a + p.amount, 0);
  const unpaidBills = combinedPayments.filter((p) => p.status === "Belum Dibayar");
  const unpaidTotal = unpaidBills.reduce((a, p) => a + p.amount, 0);
  const waitingAdminBills = combinedPayments.filter((p) => p.status === "Menunggu Verifikasi");
  const waitingAdminTotal = waitingAdminBills.reduce((a, p) => a + p.amount, 0);

  const filtered = combinedPayments.filter((p) => {
    if (status !== "Semua" && p.status !== status) return false;
    if (q && !p.invoice.toLowerCase().includes(q.toLowerCase()) && !p.campaignName.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE));
  const cp = Math.min(page, totalPages);
  const paged = filtered.slice((cp - 1) * PAGE, cp * PAGE);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        <StatCard label="Total Pembayaran" value={formatIDR(totalPaid)} hint="Sepanjang masa" icon={<CheckCircle2 className="h-5 w-5" />} />
        {unpaidBills.length > 0 ? (
          <StatCard label="Tagihan Belum Dibayar" value={unpaidBills.length.toString()} hint={formatIDR(unpaidTotal)} icon={<CreditCard className="h-5 w-5" />} />
        ) : waitingAdminBills.length > 0 ? (
          <StatCard label="Menunggu Verifikasi Admin" value={waitingAdminBills.length.toString()} hint={formatIDR(waitingAdminTotal)} icon={<Clock className="h-5 w-5 text-amber-500" />} />
        ) : (
          <StatCard label="Tagihan Aktif" value="0" hint="Semua lunas" icon={<CreditCard className="h-5 w-5" />} />
        )}
        <StatCard label="Total Transaksi" value={combinedPayments.length.toString()} hint="All time" icon={<FileText className="h-5 w-5" />} />
      </div>

      {unpaidBills.length > 0 && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900/40 dark:bg-amber-950/30">
          <h3 className="font-display font-bold text-amber-900 dark:text-amber-200">Tagihan Menunggu Pembayaran</h3>
          <div className="mt-3 space-y-2">
            {unpaidBills.slice(0, 3).map((p) => (
              <div key={p.id} className="flex items-center justify-between rounded-lg bg-white p-3 shadow-sm dark:bg-background">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">{p.campaignName}</p>
                  <p className="text-xs text-muted-foreground">{p.invoice} · {formatIDR(p.amount)}</p>
                </div>
                <Button size="sm" className="gradient-brand text-brand-foreground" onClick={() => onPay(p)}>Bayar</Button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 sm:flex-row sm:items-center">
        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input className="pl-9 w-full" placeholder="Cari invoice / campaign..." value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Select value={status} onValueChange={(v) => { setStatus(v as typeof status); setPage(1); }}>
            <SelectTrigger className="w-full sm:w-[220px]"><Filter className="mr-2 h-4 w-4" /><SelectValue /></SelectTrigger>
            <SelectContent>
              {(["Semua", "Belum Dibayar", "Menunggu Verifikasi", "Lunas", "Refund", "Gagal"] as const).map((s) => <SelectItem key={s} value={s}>{s === "Menunggu Verifikasi" ? "Menunggu Verifikasi Admin" : s}</SelectItem>)}
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" className="flex-1 sm:flex-initial" onClick={() => {
            exportToExcel("pembayaran-customer", "Pembayaran", filtered, [
              { header: "Invoice", accessor: (p) => p.invoice },
              { header: "Campaign", accessor: (p) => p.campaignName },
              { header: "Tanggal", accessor: (p) => p.date },
              { header: "Metode", accessor: (p) => `${p.method} - ${p.channel}` },
              { header: "Status", accessor: (p) => p.status === "Menunggu Verifikasi" ? "Menunggu Verifikasi Admin" : p.status },
              { header: "Nominal (Rp)", accessor: (p) => p.amount },
            ]);
            toast.success("Data pembayaran diekspor ke Excel");
          }}><FileSpreadsheet className="mr-1 h-4 w-4" /> Excel</Button>
          <Button variant="outline" size="sm" className="flex-1 sm:flex-initial" onClick={() => {
            const total = filtered.reduce((a, p) => a + p.amount, 0);
            const paid = filtered.filter(p => p.status === "Lunas").reduce((a, p) => a + p.amount, 0);
            exportToPDF("pembayaran-customer", "Laporan Pembayaran Customer", filtered, [
              { header: "Invoice", accessor: (p) => p.invoice },
              { header: "Campaign", accessor: (p) => p.campaignName },
              { header: "Tanggal", accessor: (p) => p.date },
              { header: "Metode", accessor: (p) => `${p.method} - ${p.channel}` },
              { header: "Status", accessor: (p) => p.status === "Menunggu Verifikasi" ? "Menunggu Verifikasi Admin" : p.status },
              { header: "Nominal (Rp)", accessor: (p) => p.amount },
            ], [
              { label: "Total Nominal", value: formatIDR(total) },
              { label: "Total Lunas", value: formatIDR(paid) },
            ]);
            toast.success("Laporan pembayaran diekspor ke PDF");
          }}><FileDown className="mr-1 h-4 w-4" /> PDF</Button>
        </div>
      </div>

      {paged.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card p-6 text-center text-sm text-muted-foreground shadow-sm">
          Belum ada riwayat pembayaran yang cocok.
        </div>
      ) : (
        <>
          {/* Mobile Card List (< sm) */}
          <div className="space-y-3 sm:hidden">
            {paged.map((p) => (
              <div key={p.id} className="rounded-2xl border border-border bg-card p-4 shadow-sm space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs font-semibold text-muted-foreground truncate">{p.invoice}</span>
                  <PaymentBadge status={p.status} />
                </div>
                <div>
                  <h4 className="font-display font-bold text-sm text-foreground line-clamp-2">{p.campaignName}</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">{p.date} · {p.method}{p.channel ? ` (${p.channel})` : ""}</p>
                </div>
                <div className="flex items-center justify-between border-t border-border/60 pt-2.5">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Nominal</span>
                    <p className="text-base font-bold text-foreground">{formatIDR(p.amount)}</p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 w-8 p-0"
                      title="Detail"
                      aria-label="Detail"
                      onClick={() => onInvoice(p)}
                    >
                      <Eye className="h-3.5 w-3.5" />
                    </Button>
                    {(p.status === "Belum Dibayar" || p.status === "Gagal") && (
                      <Button size="sm" className="h-8 px-3 text-xs gradient-brand text-brand-foreground" onClick={() => onPay(p)}>
                        Bayar
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table (>= sm) */}
          <div className="hidden sm:block rounded-2xl border border-border bg-card shadow-sm overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice</TableHead>
                  <TableHead>Campaign</TableHead>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Metode</TableHead>
                  <TableHead className="text-right">Nominal</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paged.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-mono text-xs">{p.invoice}</TableCell>
                    <TableCell className="font-medium">{p.campaignName}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{p.date}</TableCell>
                    <TableCell className="text-sm">{p.method}<span className="block text-xs text-muted-foreground">{p.channel}</span></TableCell>
                    <TableCell className="text-right font-semibold whitespace-nowrap">{formatIDR(p.amount)}</TableCell>
                    <TableCell><PaymentBadge status={p.status} /></TableCell>
                    <TableCell className="text-right whitespace-nowrap">
                      <Button size="icon" variant="ghost" title="Detail invoice" onClick={() => onInvoice(p)}><Eye className="h-4 w-4" /></Button>
                      <Button size="icon" variant="ghost" title="Download PDF" onClick={() => downloadInvoice(p, store)}><Download className="h-4 w-4" /></Button>
                      <Button size="icon" variant="ghost" title="Cetak" onClick={() => printInvoice(p, store)}><Printer className="h-4 w-4" /></Button>
                      {(p.status === "Belum Dibayar" || p.status === "Gagal") && (
                        <Button size="sm" className="ml-1 gradient-brand text-brand-foreground" onClick={() => onPay(p)}>Bayar</Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </>
      )}

      {filtered.length > PAGE && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">Menampilkan {(cp - 1) * PAGE + 1}–{Math.min(cp * PAGE, filtered.length)} dari {filtered.length}</p>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" disabled={cp <= 1} onClick={() => setPage(cp - 1)}><ChevronLeft className="h-4 w-4" /></Button>
            <span className="grid place-items-center px-3 text-sm">{cp} / {totalPages}</span>
            <Button size="sm" variant="outline" disabled={cp >= totalPages} onClick={() => setPage(cp + 1)}><ChevronRight className="h-4 w-4" /></Button>
          </div>
        </div>
      )}
    </div>
  );
}

function PaymentBadge({ status }: { status: PaymentStatus }) {
  const map: Record<PaymentStatus, string> = {
    "Lunas": "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
    "Belum Dibayar": "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300",
    "Menunggu Verifikasi": "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
    "Refund": "bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300",
    "Gagal": "bg-zinc-200 text-zinc-700 dark:bg-zinc-500/20 dark:text-zinc-200",
  };
  const label = status === "Menunggu Verifikasi" ? "Menunggu Verifikasi Admin" : status;
  return <span className={cn("inline-flex items-center justify-center whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-semibold", map[status])}>{label}</span>;
}

/* ============ Dialogs ============ */

/** Galeri bukti upload: screenshot dari buzzer bahwa pesanan sudah dikerjakan. */
function ProofGalleryDialog({ order, onOpenChange }: { order: Order | null; onOpenChange: (v: boolean) => void }) {
  const [preview, setPreview] = useState<OrderProof | null>(null);
  if (!order) return null;
  const proofs = order.proofs ?? [];
  return (
    <Dialog open={!!order} onOpenChange={(v) => { if (!v) setPreview(null); onOpenChange(v); }}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2"><ImageIcon className="h-5 w-5 text-primary" /> Bukti Upload — {order.campaignName}</DialogTitle>
          <DialogDescription>
            Screenshot yang diunggah buzzer sebagai bukti pesanan sudah selesai · Invoice {order.invoice}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-3 sm:grid-cols-4">
          <MiniStat label="Bukti Masuk" value={`${proofs.length}`} />
          <MiniStat label="Terverifikasi" value={`${proofs.filter((p) => p.verified).length}`} />
          <MiniStat label="Buzzer" value={`${order.buzzersJoined}/${order.buzzers}`} />
          <MiniStat label="Progress" value={`${order.progress}%`} />
        </div>

        {proofs.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border p-10 text-center">
            <ImageIcon className="mx-auto h-8 w-8 text-muted-foreground" />
            <p className="mt-3 text-sm font-medium">Belum ada bukti upload</p>
            <p className="text-xs text-muted-foreground">Bukti akan muncul otomatis setelah buzzer mengunggah screenshot pengerjaan.</p>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {proofs.map((p) => (
              <figure key={p.id} className="overflow-hidden rounded-xl border border-border bg-card">
                <button type="button" onClick={() => setPreview(p)} className="block w-full">
                  {p.imageUrl.toLowerCase().includes(".pdf") ? (
                    <div className="h-52 w-full flex flex-col items-center justify-center gap-2 bg-rose-500/10 text-rose-600 dark:text-rose-400 p-4 transition-transform hover:scale-[1.03]">
                      <FileText className="h-12 w-12 text-rose-500" />
                      <span className="text-xs font-bold uppercase tracking-wider">Dokumen Bukti (PDF)</span>
                      <span className="text-[11px] text-muted-foreground">Klik untuk membuka</span>
                    </div>
                  ) : (
                    <img
                      src={p.imageUrl}
                      alt={`Bukti upload ${p.platform} oleh ${p.buzzerName}`}
                      loading="lazy"
                      width={720}
                      height={1280}
                      className="h-52 w-full object-cover object-top transition-transform hover:scale-[1.03]"
                    />
                  )}
                </button>
                <figcaption className="space-y-1 p-3">
                  <div className="flex items-center justify-between gap-2">
                    {p.buzzerEmail ? (
                      <BuzzerNameLink name={p.buzzerName} email={p.buzzerEmail} className="truncate text-sm" />
                    ) : (
                      <p className="truncate text-sm font-medium">{p.buzzerName}</p>
                    )}
                    {p.verified ? (
                      <span className="flex shrink-0 items-center gap-1 text-[10px] font-semibold text-emerald-600"><CheckCircle2 className="h-3 w-3" /> Terverifikasi</span>
                    ) : (
                      <span className="shrink-0 text-[10px] font-semibold text-amber-600">Menunggu review</span>
                    )}
                  </div>
                  <p className="flex items-center gap-1 text-xs text-muted-foreground">{PLATFORM_ICON[p.platform]} {p.platform} · {p.uploadedAt}</p>
                  <p className="line-clamp-2 text-xs text-muted-foreground">{p.caption}</p>
                  <div className="flex gap-2 pt-1">
                    <Button size="sm" variant="outline" className="h-7 flex-1 text-xs" onClick={() => setPreview(p)}>
                      <Eye className="mr-1 h-3 w-3" /> Lihat
                    </Button>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        )}

        <Dialog open={!!preview} onOpenChange={(v) => !v && setPreview(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Bukti dari {preview?.buzzerName}</DialogTitle>
              <DialogDescription>{preview?.platform} · diunggah {preview?.uploadedAt}</DialogDescription>
            </DialogHeader>
            {preview && (
              preview.imageUrl.toLowerCase().includes(".pdf") ? (
                <div className="flex flex-col items-center justify-center gap-3 p-6 rounded-xl border border-rose-500/20 bg-rose-500/10 text-center">
                  <FileText className="h-14 w-14 text-rose-500" />
                  <div>
                    <p className="text-sm font-semibold">Dokumen Bukti Pengerjaan (PDF)</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Format dokumen PDF</p>
                  </div>
                  <a
                    href={preview.imageUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg gradient-brand text-brand-foreground px-4 py-2 text-xs font-semibold shadow-sm"
                  >
                    <ExternalLink className="h-4 w-4" /> Buka / Unduh Dokumen PDF
                  </a>
                </div>
              ) : (
                <img
                  src={preview.imageUrl}
                  alt={`Bukti upload ${preview.platform} oleh ${preview.buzzerName}`}
                  loading="lazy"
                  width={720}
                  height={1280}
                  className="max-h-[65vh] w-full rounded-lg object-contain"
                />
              )
            )}
            {preview?.postLink && (
              <a href={preview.postLink} target="_blank" rel="noreferrer" className="text-xs text-primary underline break-all">
                {preview.postLink}
              </a>
            )}
          </DialogContent>
        </Dialog>
      </DialogContent>
    </Dialog>
  );
}

function MetricCard({ label, value, icon }: { label: string; value: string; icon: ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-card p-3">
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">{label}</span>
        <span className="text-muted-foreground">{icon}</span>
      </div>
      <p className="mt-1 font-display text-lg font-bold">{value}</p>
    </div>
  );
}
function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-muted/50 p-2 text-center">
      <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="text-sm font-semibold">{value}</p>
    </div>
  );
}

function OrderDetailDialog({ order, onOpenChange, onProof }: { order: Order | null; onOpenChange: (v: boolean) => void; onProof: (o: Order) => void }) {
  if (!order) return null;
  const steps = [0, 25, 50, 75, 100];
  return (
    <Dialog open={!!order} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{order.campaignName}</DialogTitle>
          <DialogDescription>Invoice {order.invoice} · <StatusBadge status={order.status} /></DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <section>
            <h4 className="mb-2 text-sm font-semibold">Informasi Campaign</h4>
            {order.thumbnailUrl && (
              <div className="mb-3 overflow-hidden rounded-lg border border-border">
                <img src={order.thumbnailUrl} alt="Poster / Gambar Acara" className="max-h-48 w-full object-cover" />
              </div>
            )}
            <dl className="grid gap-2 text-sm sm:grid-cols-2">
              <div><dt className="text-xs text-muted-foreground">Deskripsi</dt><dd>{order.description}</dd></div>
              <div><dt className="text-xs text-muted-foreground">Platform</dt><dd className="flex items-center gap-1">{PLATFORM_ICON[order.platform]} {order.platform}</dd></div>
              <div><dt className="text-xs text-muted-foreground">Jumlah Buzzer</dt><dd>{order.buzzers} buzzer</dd></div>
              {order.link && <div><dt className="text-xs text-muted-foreground">Link</dt><dd className="break-all"><a href={order.link} target="_blank" rel="noreferrer" className="text-primary underline">{order.link}</a></dd></div>}
              {order.location && <div><dt className="text-xs text-muted-foreground">Lokasi</dt><dd className="flex items-center gap-1"><MapPin className="h-3 w-3 text-muted-foreground" /> {order.location}</dd></div>}
              <div><dt className="text-xs text-muted-foreground">Periode</dt><dd>{order.startDate} → {order.endDate}</dd></div>
            </dl>
          </section>

          <section>
            <h4 className="mb-2 text-sm font-semibold">Status Progress</h4>
            <div className="flex items-center gap-1">
              {steps.map((s, i) => (
                <div key={s} className="flex flex-1 flex-col items-center">
                  <div className={cn("grid h-8 w-8 place-items-center rounded-full text-xs font-bold", order.progress >= s ? "gradient-brand text-brand-foreground" : "bg-muted text-muted-foreground")}>
                    {order.progress >= s ? <Check className="h-4 w-4" /> : i + 1}
                  </div>
                  <span className="mt-1 text-[10px] text-muted-foreground">{s}%</span>
                </div>
              ))}
            </div>
            <Progress value={order.progress} className="mt-3" />
          </section>

          <section>
            <h4 className="mb-2 text-sm font-semibold">Daftar Buzzer Bertugas</h4>
            {order.buzzerAccounts?.length ? (
              <div className="grid gap-2 sm:grid-cols-2">
                {order.buzzerAccounts.map((name) => (
                  <div key={name} className="flex items-center rounded-lg border border-border p-2">
                  <div className="flex items-center gap-2">
                    <div className="grid h-8 w-8 place-items-center rounded-full gradient-brand text-xs font-bold text-brand-foreground">
                      {name.split(" ").map((x) => x[0]).join("").slice(0, 2)}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{name}</p>
                      <p className="text-xs text-muted-foreground">Sudah mengambil job</p>
                    </div>
                  </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="rounded-lg border border-dashed border-border p-4 text-center text-sm text-muted-foreground">
                Menunggu buzzer mengambil job campaign ini.
              </p>
            )}
          </section>

        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Tutup</Button>
          <Button className="gradient-brand text-brand-foreground" onClick={() => onProof(order)}><ImageIcon className="mr-1 h-4 w-4" /> Bukti Upload</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function isValidWorkLink(url: string): boolean {
  const trimmed = (url ?? "").trim();
  if (!trimmed) return false;
  const candidate = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  try {
    const parsed = new URL(candidate);
    return Boolean(parsed.hostname && parsed.hostname.includes(".") && parsed.hostname.split(".")[0].length > 0);
  } catch {
    return false;
  }
}

function normalizeWorkLink(url: string): string {
  const trimmed = (url ?? "").trim();
  if (!trimmed) return "";
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

function EditOrderDialog({ order, onOpenChange, store }: { order: Order | null; onOpenChange: (v: boolean) => void; store: Store }) {
  const [form, setForm] = useState({ campaignName: "", description: "", linkOrLocation: "", startDate: "", endDate: "" });
  const [loaded, setLoaded] = useState<string | null>(null);
  const today = getTodayInputValue();
  const service = order ? store.services.find((s) => s.id === order.serviceId) : undefined;
  if (order && loaded !== order.id) {
    setForm({
      campaignName: order.campaignName, description: order.description,
      linkOrLocation: order.link ?? "",
      startDate: order.startDate, endDate: order.endDate,
    });
    setLoaded(order.id);
  }
  if (!order) return null;
  const save = () => {
    if (!form.campaignName.trim() || !form.description.trim() || !form.linkOrLocation.trim()) {
      toast.error("Lengkapi semua data campaign, termasuk link pengerjaan target");
      return;
    }
    if (!isValidWorkLink(form.linkOrLocation)) {
      toast.error("Link pengerjaan harus berupa tautan/URL yang valid (contoh: https://www.instagram.com/p/... atau https://vt.tiktok.com/...)");
      return;
    }
    if (form.startDate < today || form.endDate < today || form.endDate < form.startDate) {
      toast.error("Tanggal mulai dan selesai harus hari ini atau setelahnya, dan tanggal selesai tidak boleh sebelum tanggal mulai.");
      return;
    }
    const normalizedLink = normalizeWorkLink(form.linkOrLocation);
    store.editOrder(order.id, {
      campaignName: form.campaignName.trim(),
      description: form.description.trim(),
      startDate: form.startDate,
      endDate: form.endDate,
      link: normalizedLink || undefined,
    });
    toast.success("Pesanan diperbarui");
    onOpenChange(false);
  };
  return (
    <Dialog open={!!order} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Pesanan</DialogTitle>
          <DialogDescription>{order.invoice}</DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <Field label="Nama Campaign"><Input value={form.campaignName} onChange={(e) => setForm({ ...form, campaignName: e.target.value })} /></Field>
          <Field label="Deskripsi / Catatan"><Textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></Field>
          <Field label="Link Video / Postingan Target (Wajib)">
            <Input
              value={form.linkOrLocation}
              onChange={(e) => setForm({ ...form, linkOrLocation: e.target.value })}
              placeholder="https://instagram.com/p/..."
            />
            {form.linkOrLocation.trim() && !isValidWorkLink(form.linkOrLocation) && (
              <p className="mt-1 text-xs text-rose-500 font-medium">⚠️ Harap masukkan URL link target yang valid (misal: https://instagram.com/p/...)</p>
            )}
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Mulai"><Input type="date" min={today} value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} /></Field>
            <Field label="Selesai"><Input type="date" min={form.startDate > today ? form.startDate : today} value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} /></Field>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Batal</Button>
          <Button onClick={save} className="gradient-brand text-brand-foreground">Simpan</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return <div className="space-y-1"><Label className="text-xs">{label}</Label>{children}</div>;
}

function ServiceDetailDialog({ service, onOpenChange, onOrder }: { service: Service | null; onOpenChange: (v: boolean) => void; onOrder: (s: Service) => void }) {
  if (!service) return null;
  const isCatalog = !!service.catalogId;
  const { data: servicePricings } = useServicePricings();
  const serviceType = service.campaignType ? CAMPAIGN_TYPES.find((item) => item.key === service.campaignType)?.name : "";
  const servicePrice = servicePricings.find((item) => item.status === "Aktif" && item.platform === service.platforms[0] && normalizeServiceType(item.service_type) === normalizeServiceType(serviceType));
  return (
    <Dialog open={!!service} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className={cn("-m-6 mb-4 h-40 rounded-t-lg bg-gradient-to-br relative overflow-hidden", service.image)}>
          <img
            src={serviceImageUrl(service)}
            alt={service.name}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover opacity-90"
            onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          <div className="absolute inset-0 flex items-end p-6">
            <div>
              <span className="rounded-full bg-background/80 px-2.5 py-0.5 text-xs font-semibold text-foreground backdrop-blur">{service.category}</span>
              <h2 className="mt-2 font-display text-2xl font-bold text-white drop-shadow">{service.name}</h2>

            </div>
          </div>
        </div>

        <DialogHeader>
          <DialogTitle className="sr-only">{service.name}</DialogTitle>
          <DialogDescription>{service.longDesc}</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4">
          <section>
            <h4 className="mb-2 text-sm font-semibold">Benefit</h4>
            <ul className="grid gap-1 text-sm sm:grid-cols-2">
              {service.benefits.map((b) => (
                <li key={b} className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" /> {b}</li>
              ))}
            </ul>
          </section>

          <section>
            <h4 className="mb-2 text-sm font-semibold">Platform Support</h4>
            <div className="flex flex-wrap gap-1.5 text-xs">
              {service.platforms.map((p) => (
                <span key={p} className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-1">{PLATFORM_ICON[p]} {p}</span>
              ))}
            </div>
          </section>

          <section>
            {isCatalog ? (
              <>
                <h4 className="mb-2 text-sm font-semibold">Harga & Slot Layanan</h4>
                <div className="rounded-xl border border-primary p-4 shadow-glow">
                  <p className="text-xs font-semibold uppercase text-muted-foreground">Tarif Layanan</p>
                  <p className="mt-2 font-display text-xl font-bold text-gradient-brand">{formatIDR(Number(service.catalogPricePerBuzzer ?? 0))}</p>
                  <p className="text-xs text-muted-foreground">Total tarif · {service.catalogSlotsAvailable ?? 0} target buzzer</p>
                </div>
              </>
            ) : (
              <>
                <h4 className="mb-2 text-sm font-semibold">Harga Pesanan Sendiri</h4>
                <div className="rounded-xl border border-primary p-4 shadow-glow">
                  <p className="text-xs font-semibold uppercase text-muted-foreground">Harga per buzzer</p>
                  <p className="mt-2 font-display text-xl font-bold text-gradient-brand">{servicePrice ? formatIDR(Number(servicePrice.price_per_buzzer)) : "Belum dikonfigurasi"}</p>
                  <p className="text-xs text-muted-foreground">Jumlah buzzer ditentukan customer saat memesan.</p>
                </div>
              </>
            )}
          </section>

          <section>
            <h4 className="mb-2 text-sm font-semibold">Testimoni</h4>
            <div className="rounded-xl bg-muted/50 p-4 text-sm italic">"{service.name} membantu brand kami mencapai target 3x lebih cepat. Highly recommended!" — <b>Rina, Marketing Lead</b> ({service.reviews} ulasan · {service.rating}★)</div>
          </section>

          <section>
            <h4 className="mb-2 text-sm font-semibold">FAQ</h4>
            <div className="space-y-2">
              {service.faqs.map((f, i) => (
                <details key={i} className="rounded-lg border border-border p-3 text-sm">
                  <summary className="cursor-pointer font-medium">{f.q}</summary>
                  <p className="mt-2 text-muted-foreground">{f.a}</p>
                </details>
              ))}
            </div>
          </section>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Kembali</Button>
          <Button className="gradient-brand text-brand-foreground" onClick={() => onOrder(service)}><ShoppingBag className="mr-1 h-4 w-4" /> Pesan Sekarang</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ====== Wizard ====== */
const WIZ_PLATFORMS: Platform[] = ["Instagram", "TikTok", "X (Twitter)", "Facebook", "YouTube", "Telegram"];

function deriveCatalogCampaignType(service: Service | null | undefined): CampaignTypeKey | undefined {
  const raw = String(service?.campaignType ?? service?.desc ?? service?.name ?? "").toLowerCase();
  if (!raw) return undefined;

  if (raw.includes("like") && !raw.includes("komentar")) return "like";
  if (raw.includes("komentar") || raw.includes("comment")) return "komentar";
  if (raw.includes("like") && raw.includes("komentar")) return "like-komentar";
  if (raw.includes("share")) return "share";
  if (raw.includes("follow")) return "follow";
  if (raw.includes("review") || raw.includes("ulasan")) return "review";
  return undefined;
}

function WizardDialog({ open, onOpenChange, initialService, store, onCheckout }: { open: boolean; onOpenChange: (v: boolean) => void; initialService: Service | null; store: Store; onCheckout: (payment: Payment) => void }) {
  const normalizedInitialService = initialService && initialService.catalogId && !initialService.campaignType
    ? { ...initialService, campaignType: deriveCatalogCampaignType(initialService) }
    : initialService;

  const [step, setStep] = useState(1);
  const [platform, setPlatform] = useState<Platform>(normalizedInitialService?.platforms[0] ?? "Instagram");
  const [service, setService] = useState<Service | null>(normalizedInitialService);
  const [buzzerCount, setBuzzerCount] = useState(1);
  const [form, setForm] = useState({ campaignName: "", description: "", linkOrLocation: "", startDate: "", endDate: "" });
  const { data: servicePricings, loading: pricingLoading } = useServicePricings();

  const [openedFor, setOpenedFor] = useState<string | null>(null);
  const key = (open ? "1" : "0") + (normalizedInitialService?.id ?? "");
  useEffect(() => {
    if (!open || openedFor === key) return;
    setStep(normalizedInitialService?.catalogId ? 5 : 1);
    setService(normalizedInitialService);
    setBuzzerCount(1);
    setPlatform(normalizedInitialService?.platforms[0] ?? "Instagram");
    setForm({ campaignName: "", description: "", linkOrLocation: "", startDate: "", endDate: "" });
    setOpenedFor(key);
  }, [key, normalizedInitialService, open, openedFor]);

  const isCatalog = !!service?.catalogId;
  const selectedServiceType = service?.campaignType
    ? CAMPAIGN_TYPES.find((item) => item.key === service.campaignType)?.name ?? ""
    : "";
  const customPricing = !isCatalog
    ? servicePricings.find((item) => item.status === "Aktif" && item.platform === platform && normalizeServiceType(item.service_type) === normalizeServiceType(selectedServiceType))
    : null;

  const selectedPkg = isCatalog && service
    ? {
        tier: service.desc || "Layanan Langsung",
        price: Number(service.catalogPricePerBuzzer ?? 0),
        buzzers: Number(service.catalogSlotsAvailable ?? 1),
        reach: `${Number(service.catalogSlotsAvailable ?? 1)} buzzer`,
        benefits: ["Buzzer terverifikasi & real people", "Laporan realtime & transparan", "Garansi target reach tercapai"],
      }
    : customPricing ? {
        tier: selectedServiceType,
        price: Number(customPricing.price_per_buzzer) * buzzerCount,
        buzzers: buzzerCount,
        reach: `${buzzerCount} buzzer`,
        benefits: ["Harga per buzzer dari konfigurasi admin", "Jumlah buzzer dapat ditentukan customer", "Pembayaran menunggu verifikasi admin"],
      } : null;

  const submit = () => {
    if (!service) return;
    if (!form.campaignName.trim() || !form.description.trim() || !form.linkOrLocation.trim() || !form.startDate || !form.endDate) {
      toast.error("Lengkapi semua data campaign, termasuk link pengerjaan target");
      return;
    }
    if (!isValidWorkLink(form.linkOrLocation)) {
      toast.error("Link pengerjaan harus berupa tautan/URL valid (contoh: https://www.instagram.com/p/... atau https://vt.tiktok.com/...)");
      return;
    }
    const today = getTodayInputValue();
    if (form.startDate < today || form.endDate < today || form.endDate < form.startDate) {
      toast.error("Tanggal mulai dan selesai harus hari ini atau setelahnya, dan tanggal selesai tidak boleh sebelum tanggal mulai.");
      return;
    }
    if (!isCatalog && (!customPricing || buzzerCount < 1)) {
      toast.error(pricingLoading ? "Harga layanan sedang dimuat." : "Harga per buzzer untuk layanan ini belum dikonfigurasi admin.");
      return;
    }
    if (isCatalog && (!selectedPkg || selectedPkg.price <= 0)) {
      toast.error("Tarif katalog belum valid.");
      return;
    }
    const selectedBuzzerCount = isCatalog ? (selectedPkg?.buzzers ?? 0) : buzzerCount;
    const selectedPackagePrice = isCatalog ? (selectedPkg?.price ?? 0) : Number(customPricing?.price_per_buzzer ?? 0) * buzzerCount;
    const normalizedLink = normalizeWorkLink(form.linkOrLocation);
    const taskType = service?.campaignType || deriveCatalogCampaignType(service) || "like";
    const taskName = CAMPAIGN_TYPES.find((item) => item.key === taskType)?.name || (isCatalog ? service.desc : selectedServiceType) || "Pengerjaan";

    const { payment } = store.createOrder({
      serviceId: service.id,
      packageTier: isCatalog ? (service.desc || "Layanan Langsung") : (selectedServiceType || taskName),
      platform,
      campaignName: form.campaignName.trim(),
      description: form.description.trim(),
      link: normalizedLink,
      startDate: form.startDate,
      endDate: form.endDate,
      service: {
        ...service,
        campaignType: taskType,
      },
      buzzers: selectedBuzzerCount,
      pricePerBuzzer: isCatalog ? Math.round(selectedPackagePrice / Math.max(1, selectedBuzzerCount)) : customPricing?.price_per_buzzer,
      serviceType: isCatalog ? (service.desc || taskName) : (selectedServiceType || taskName),
      catalogPackagePrice: isCatalog ? selectedPackagePrice : undefined,
      catalogPackageBuzzerCount: isCatalog ? selectedBuzzerCount : undefined,
    });
    toast.success("Detail pesanan siap dibayar.");
    onOpenChange(false);
    onCheckout(payment);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100vw-1.5rem)] max-w-2xl max-h-[88vh] overflow-y-auto overflow-x-hidden p-4 sm:p-6">
        <DialogHeader className="min-w-0 pr-6">
          <DialogTitle className="text-base leading-snug break-words sm:text-lg">
            {isCatalog ? "Konfirmasi Pesanan" : `Buat Pesanan Baru — Langkah ${step} / 5`}
          </DialogTitle>
          <DialogDescription className="break-words">
            {isCatalog ? "Periksa detail paket sebelum melanjutkan pembayaran." : "Ikuti wizard untuk menyelesaikan pemesanan campaign Anda."}
          </DialogDescription>
        </DialogHeader>

        {!isCatalog && (
          <div className="flex w-full min-w-0 gap-1">
            {[1, 2, 3, 4, 5].map((s) => (
              <div key={s} className={cn("h-1.5 flex-1 rounded-full", step >= s ? "gradient-brand" : "bg-muted")} />
            ))}
          </div>
        )}

        {step === 1 && (
           <div className="min-w-0">
            <h4 className="mb-3 font-semibold">Pilih Platform</h4>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {WIZ_PLATFORMS.map((p) => (
                <button key={p} type="button" onClick={() => setPlatform(p)}
                  className={cn("flex min-w-0 items-center gap-2 rounded-xl border p-3 text-sm font-medium transition-colors", platform === p ? "border-primary bg-primary/5" : "border-border hover:bg-muted/50")}>
                  <span className="shrink-0">{PLATFORM_ICON[p]}</span> <span className="truncate">{p}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="min-w-0">
            <h4 className="font-semibold">Pilih Jenis Campaign</h4>
            <p className="mb-3 text-sm text-muted-foreground">Pilih jenis aktivitas yang ingin dilakukan buzzer.</p>
            <div className="grid w-full min-w-0 gap-2 max-h-80 overflow-y-auto overflow-x-hidden pr-1">
              {CAMPAIGN_TYPES.map((c) => {
                const svc = store.services.find((s) => s.campaignType === c.key);
                if (!svc) return null;
                const active = service?.id === svc.id;
                const pricing = servicePricings.find((item) => item.status === "Aktif" && item.platform === platform && normalizeServiceType(item.service_type) === normalizeServiceType(c.name));
                return (
                  <button
                    key={c.key}
                    type="button"
                    onClick={() => {
                      if (service?.catalogId) {
                        setService({ ...service, campaignType: c.key });
                        return;
                      }
                      setService(svc);
                    }}
                    className={cn(
                      "flex w-full min-w-0 items-center gap-3 rounded-xl border p-3 text-left transition-colors",
                      active ? "border-primary bg-primary/5" : "border-border hover:bg-muted/50",
                    )}
                  >
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-muted">
                      {CAMPAIGN_TYPE_ICON[c.key]}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-semibold break-words">{c.name}</p>
                        {active && <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-semibold text-primary">Dipilih</span>}
                      </div>
                      <p className="text-xs text-muted-foreground break-words">{c.desc}</p>
                    </div>
                    <span className="shrink-0 rounded-md bg-muted px-2 py-1 text-[11px] font-medium text-muted-foreground">
                      {pricing ? `${formatIDR(Number(pricing.price_per_buzzer))} / buzzer` : pricingLoading ? "Memuat harga..." : "Harga belum tersedia"}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}


        {step === 3 && (
          <div className="min-w-0 space-y-3">
            <h4 className="font-semibold">Isi Detail Campaign</h4>
            <Field label="Nama Campaign"><Input value={form.campaignName} onChange={(e) => setForm({ ...form, campaignName: e.target.value })} placeholder="Contoh: Launch Skincare Glowin" /></Field>
            <Field label="Deskripsi / Brief Khusus"><Textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Jelaskan instruksi atau tujuan khusus campaign untuk buzzer..." /></Field>
            <Field label="Link Video / Postingan / Akun Target (Wajib)">
              <Input
                value={form.linkOrLocation}
                onChange={(e) => setForm({ ...form, linkOrLocation: e.target.value })}
                placeholder={`https://${platform.toLowerCase().replace(/[^a-z]/g, "") || "instagram"}.com/...`}
              />
              {form.linkOrLocation.trim() && !isValidWorkLink(form.linkOrLocation) ? (
                <p className="mt-1 text-xs text-rose-500 font-medium">⚠️ Harap masukkan URL link target yang valid (misal: https://instagram.com/p/...)</p>
              ) : form.linkOrLocation.trim() ? (
                <p className="mt-1 text-[11px] text-emerald-600 font-medium">✓ Link valid. Buzzer akan membuka tautan ini langsung untuk tugas {selectedServiceType || "pengerjaan"}.</p>
              ) : (
                <p className="mt-1 text-[11px] text-muted-foreground">🔗 Link ini wajib diisi link video/postingan yang akan dikerjakan buzzer ({selectedServiceType || "like/komen/share/follow"}).</p>
              )}
            </Field>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Field label="Tanggal Mulai"><Input type="date" min={getTodayInputValue()} value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} /></Field>
              <Field label="Tanggal Selesai"><Input type="date" min={form.startDate > getTodayInputValue() ? form.startDate : getTodayInputValue()} value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} /></Field>
            </div>
          </div>
        )}

        {step === 4 && service && (
          <div className="min-w-0 space-y-3">
            <h4 className="font-semibold">{isCatalog ? "Ringkasan Layanan" : "Harga dan Jumlah Buzzer"}</h4>
            <div className="rounded-xl border border-border p-4 text-sm space-y-3">
              {isCatalog ? (
                <>
                  <p className="text-sm text-muted-foreground">Layanan ini memiliki harga dan jumlah buzzer yang sudah ditetapkan.</p>
                  <div className="rounded-xl border border-primary/40 bg-primary/5 p-4 space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <span className="text-[11px] font-medium text-muted-foreground">Harga Layanan</span>
                        <p className="mt-0.5 text-xl font-bold text-gradient-brand">
                          {formatIDR(Number(service.catalogPricePerBuzzer ?? 0))}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-[11px] font-medium text-muted-foreground">Target Buzzer</span>
                        <p className="mt-0.5 text-sm font-semibold text-foreground">
                          {Number(service.catalogSlotsAvailable ?? 0)} buzzer
                        </p>
                      </div>
                    </div>
                    <div className="space-y-1 pt-1">
                      <p className="flex items-center gap-2 text-xs text-muted-foreground"><Check className="h-3.5 w-3.5 text-emerald-500" /> Buzzer terverifikasi & real people</p>
                      <p className="flex items-center gap-2 text-xs text-muted-foreground"><Check className="h-3.5 w-3.5 text-emerald-500" /> Laporan realtime & transparan</p>
                      <p className="flex items-center gap-2 text-xs text-muted-foreground"><Check className="h-3.5 w-3.5 text-emerald-500" /> Garansi target reach tercapai</p>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <Row label="Jenis layanan" value={selectedServiceType || "-"} />
                  <Row label="Harga per buzzer" value={customPricing ? formatIDR(Number(customPricing.price_per_buzzer)) : pricingLoading ? "Memuat..." : "Belum tersedia"} />
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-muted-foreground">Jumlah buzzer</span>
                    <div className="flex items-center gap-2">
                      <Button type="button" size="icon" variant="outline" disabled={buzzerCount <= 1} onClick={() => setBuzzerCount((value) => Math.max(1, value - 1))}>-</Button>
                      <span className="min-w-12 text-center font-semibold">{buzzerCount}</span>
                      <Button type="button" size="icon" variant="outline" onClick={() => setBuzzerCount((value) => value + 1)}>+</Button>
                    </div>
                  </div>
                  <Row label={<b>Total harga</b>} value={<b className="text-lg text-gradient-brand">{formatIDR(Number(customPricing?.price_per_buzzer ?? 0) * buzzerCount)}</b>} />
                </>
              )}
            </div>
          </div>
        )}

        {step === 5 && service && selectedPkg && (
          <div className="min-w-0 space-y-3">
            {!isCatalog && <h4 className="font-semibold">Checkout</h4>}
            {isCatalog && (
              <div className="space-y-3 rounded-xl border border-border p-4">
                <p className="text-sm text-muted-foreground">Periksa paket dari katalog admin dan lengkapi detail campaign sebelum pembayaran.</p>
                <Field label="Nama Campaign"><Input value={form.campaignName} onChange={(e) => setForm({ ...form, campaignName: e.target.value })} placeholder="Nama campaign" /></Field>
                <Field label="Instruksi / Catatan Pengerjaan"><Textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Contoh: Beri komentar positif tentang produk..." /></Field>
                <Field label="Link Video / Postingan Target (Wajib)">
                  <Input
                    value={form.linkOrLocation}
                    onChange={(e) => setForm({ ...form, linkOrLocation: e.target.value })}
                    placeholder={`https://${platform.toLowerCase().replace(/[^a-z]/g, "") || "instagram"}.com/...`}
                  />
                  {form.linkOrLocation.trim() && !isValidWorkLink(form.linkOrLocation) ? (
                    <p className="mt-1 text-xs text-rose-500 font-medium">⚠️ Harap masukkan URL link target yang valid (contoh: https://...)</p>
                  ) : form.linkOrLocation.trim() ? (
                    <p className="mt-1 text-[11px] text-emerald-600 font-medium">✓ Link valid. Buzzer akan langsung membuka tautan ini.</p>
                  ) : (
                    <p className="mt-1 text-[11px] text-muted-foreground">🔗 Link ini wajib diisi tautan video/postingan yang akan dikerjakan oleh buzzer.</p>
                  )}
                </Field>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <Field label="Tanggal Mulai"><Input type="date" min={getTodayInputValue()} value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} /></Field>
                  <Field label="Tanggal Selesai"><Input type="date" min={form.startDate > getTodayInputValue() ? form.startDate : getTodayInputValue()} value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} /></Field>
                </div>
              </div>
            )}
            <div className="rounded-xl border border-border p-4 text-sm space-y-2">
              <Row label="Layanan" value={service.name} />
              <Row label="Kategori" value={service.category} />
              <Row label="Platform" value={platform} />
              <Row label="Detail layanan" value={service.desc || service.longDesc} />
              {isCatalog ? (
                <>
                  <Row label="Harga layanan" value={formatIDR(selectedPkg.price)} />
                  <Row label="Jumlah buzzer" value={`${selectedPkg.buzzers} buzzer`} />
                </>
              ) : (
                <>
                  <Row label="Harga per buzzer" value={formatIDR(Number(customPricing?.price_per_buzzer ?? 0))} />
                  <Row label="Jumlah buzzer" value={`${selectedPkg.buzzers} buzzer`} />
                </>
              )}
              <Row label="Campaign" value={form.campaignName || "-"} />
              <Row label="Periode" value={`${form.startDate || "-"} → ${form.endDate || "-"}`} />
              <div className="my-2 h-px bg-border" />
              <Row label={<b>Total</b>} value={<b className="text-lg text-gradient-brand">{formatIDR(selectedPkg?.price ?? 0)}</b>} />
            </div>
            <p className="text-xs text-muted-foreground">Pesanan dibuat setelah Anda menekan Bayar. Pembayaran menunggu verifikasi Admin sebelum job dibuka untuk buzzer.</p>
          </div>
        )}

        <DialogFooter className="flex-col-reverse gap-2 sm:flex-row sm:!justify-between">
          <Button className="w-full sm:w-auto" variant="outline" disabled={!isCatalog && step <= 1} onClick={() => isCatalog ? onOpenChange(false) : setStep(step - 1)}>{isCatalog ? "Kembali" : "Sebelumnya"}</Button>
          {step < 5 ? (
            <Button className="w-full gradient-brand text-brand-foreground sm:w-auto"
              disabled={
                (step === 2 && !service) ||
                (step === 3 && (
                  !form.campaignName.trim() ||
                  !form.description.trim() ||
                  !form.linkOrLocation.trim() ||
                  !isValidWorkLink(form.linkOrLocation) ||
                  !form.startDate ||
                  !form.endDate
                ))
              }
              onClick={() => setStep(step + 1)}>Lanjut</Button>
          ) : (
            <Button
              className="w-full gradient-brand text-brand-foreground sm:w-auto"
              disabled={
                isCatalog && (
                  !selectedPkg ||
                  !form.campaignName.trim() ||
                  !form.description.trim() ||
                  !form.linkOrLocation.trim() ||
                  !isValidWorkLink(form.linkOrLocation) ||
                  !form.startDate ||
                  !form.endDate
                )
              }
              onClick={submit}>Lanjutkan Pembayaran</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Row({ label, value, className }: { label: ReactNode; value: ReactNode; className?: string }) {
  return (
    <div className={cn("flex items-center justify-between gap-3 min-w-0 w-full", className)}>
      <span className="shrink-0 text-muted-foreground">{label}</span>
      <span className="min-w-0 text-right">{value}</span>
    </div>
  );
}

/* ====== Payment ====== */
import { useAdminBankAccounts } from "@/lib/admin-bank-store";
import { useQrisSettings } from "@/lib/qris-store";

function PayDialog({ payment, onOpenChange, store }: { payment: Payment | null; onOpenChange: (v: boolean) => void; store: Store }) {
  const { activeAccounts: adminBanks } = useAdminBankAccounts();
  const qris = useQrisSettings();
  const [method, setMethod] = useState("Transfer Bank");
  const [channel, setChannel] = useState("BCA");
  const [processing, setProcessing] = useState(false);

  const availableMethods = useMemo(() => {
    const bankChannelList = adminBanks.length > 0
      ? adminBanks.map((b) => b.bankName)
      : ["BCA", "Mandiri", "BRI", "BNI"];

    const list: { method: string; channels: string[] }[] = [
      { method: "Transfer Bank", channels: bankChannelList },
    ];

    if (qris.isEnabled && qris.imageUrl) {
      list.push({ method: "QRIS", channels: ["QRIS"] });
    }

    return list;
  }, [adminBanks, qris.isEnabled, qris.imageUrl]);

  const opt = availableMethods.find((m) => m.method === method) || availableMethods[0];

  useEffect(() => {
    if (!availableMethods.some((m) => m.method === method)) {
      setMethod(availableMethods[0]?.method || "Transfer Bank");
    }
  }, [availableMethods, method]);

  useEffect(() => {
    if (!opt.channels.includes(channel)) {
      setChannel(opt.channels[0] || "");
    }
  }, [method, opt, channel]);

  if (!payment) return null;

  const submit = async () => {
    setProcessing(true);
    try {
      let bankDetailsNote = `${method} (${channel})`;
      if (method === "Transfer Bank") {
        const selectedAdminBank = adminBanks.find(
          (b) => b.bankName.toLowerCase() === channel.toLowerCase()
        );
        bankDetailsNote = selectedAdminBank
          ? `Rekening Admin: Bank ${selectedAdminBank.bankName} - ${selectedAdminBank.accountNumber} a.n ${selectedAdminBank.accountHolder}`
          : `Transfer Bank ${channel}`;
      } else if (method === "QRIS") {
        bankDetailsNote = `Pembayaran QRIS (${qris.merchantName || "QRIS Merchant"})`;
      }

      await store.payInvoice(payment.id, method, channel, bankDetailsNote);
      toast.success("Pembayaran berhasil dikirim dan menunggu verifikasi Admin.");
      onOpenChange(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Pembayaran gagal dikirim.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Dialog open={!!payment} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Bayar Invoice {payment.invoice}</DialogTitle>
          <DialogDescription>{payment.campaignName} — {formatIDR(payment.amount)}</DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <Field label="Metode Pembayaran">
            <Select
              value={method}
              onValueChange={(v) => {
                setMethod(v);
                const found = availableMethods.find((m) => m.method === v);
                if (found) setChannel(found.channels[0]);
              }}
            >
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {availableMethods.map((m) => (
                  <SelectItem key={m.method} value={m.method}>{m.method}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          {method === "Transfer Bank" && (
            <Field label="Pilih Channel Bank">
              <div className="grid grid-cols-2 gap-2">
                {opt.channels.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setChannel(c)}
                    className={cn(
                      "rounded-lg border p-2 text-sm font-medium transition-colors",
                      channel === c
                        ? "border-primary bg-primary/5 text-primary font-semibold"
                        : "border-border hover:bg-muted/50"
                    )}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </Field>
          )}

          {method === "QRIS" && qris.imageUrl && (
            <div className="rounded-xl border border-border bg-card p-4 text-center space-y-2">
              <img
                src={qris.imageUrl}
                alt={qris.merchantName || "QRIS Merchant"}
                className="mx-auto block h-auto max-h-[220px] w-full max-w-[220px] rounded-lg object-contain border border-border/60 bg-white p-2 shadow-xs"
              />
              <p className="text-xs font-semibold text-foreground">{qris.merchantName}</p>
              <p className="text-[11px] text-muted-foreground">Scan QRIS di atas untuk melakukan pembayaran</p>
            </div>
          )}

          <div className="rounded-lg bg-muted/50 p-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Tagihan</span>
              <b>{formatIDR(payment.amount)}</b>
            </div>
            <div className="flex justify-between text-xs mt-1">
              <span className="text-muted-foreground">Metode</span>
              <span>{method} · {channel}</span>
            </div>
          </div>
        </div>

        <DialogFooter className="mt-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Batal</Button>
          <Button
            className="gradient-brand text-brand-foreground"
            disabled={processing}
            onClick={submit}
          >
            {processing ? "Memproses..." : "Bayar Sekarang"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function InvoiceDialog({ payment, onOpenChange, store }: { payment: Payment | null; onOpenChange: (v: boolean) => void; store: Store }) {
  if (!payment) return null;
  const order = store.state.orders.find((o) => o.id === payment.orderId);
  const proofs = order?.proofs ?? [];
  const done = order ? Math.round((order.progress / 100) * order.buzzers) : 0;
  return (
    <Dialog open={!!payment} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-md max-h-[85vh] overflow-y-auto overflow-x-hidden">
        <DialogHeader>
          <DialogTitle>Detail Pembayaran</DialogTitle>
          <DialogDescription>Rincian invoice {payment.invoice}</DialogDescription>
        </DialogHeader>
        <div className="w-full min-w-0 rounded-xl border border-border p-4 space-y-2 text-sm">
          <Row label="Nomor Invoice" value={<span className="font-mono">{payment.invoice}</span>} />
          <Row label="Campaign" value={<span className="inline-block max-w-[200px] truncate align-bottom">{payment.campaignName}</span>} />
          <Row label="Metode" value={`${payment.method} · ${payment.channel}`} />
          <Row label="Tanggal" value={payment.date} />
          <Row label="Status" value={<PaymentBadge status={payment.status} />} />
          <div className="my-2 h-px bg-border" />
          <Row
            label={<span className="font-bold text-foreground">Total Tagihan</span>}
            value={<span className="text-lg font-bold text-sky-400">{formatIDR(payment.amount)}</span>}
          />
        </div>

        {order && (
          <>
            <div className="w-full min-w-0 rounded-xl border border-border p-4 space-y-2 text-sm">
              <p className="font-display text-sm font-bold text-foreground">Detail Pesanan</p>
              <Row label="Layanan" value={<span className="inline-block max-w-[200px] truncate align-bottom">{order.serviceName}</span>} />
              <Row label="Jenis Layanan" value={<span className="inline-block max-w-[200px] truncate align-bottom">{order.serviceType ?? order.packageTier}</span>} />
              <Row label="Platform" value={order.platform} />
              <Row label="Periode" value={`${order.startDate} — ${order.endDate}`} />
              {order.location && <Row label="Lokasi" value={<span className="inline-block max-w-[200px] truncate align-bottom">{order.location}</span>} />}
              {order.link && (
                <Row
                  label="Link Target"
                  value={
                    <a
                      href={order.link}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-block max-w-[190px] sm:max-w-[230px] truncate text-sky-400 underline align-bottom hover:text-sky-300"
                      title={order.link}
                    >
                      {order.link}
                    </a>
                  }
                />
              )}
              <Row label="Status Pesanan" value={<StatusBadge status={order.status} />} />
              {order.description && <p className="pt-1 text-xs text-muted-foreground break-words">{order.description}</p>}
            </div>

            <div className="w-full min-w-0 rounded-xl border border-border p-4 space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <p className="font-display text-sm font-bold text-foreground">Progres Pengerjaan Buzzer</p>
                <span className="text-xs font-semibold text-sky-400">{order.progress}%</span>
              </div>
              <Progress value={order.progress} className="h-2" />
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="rounded-lg bg-muted/50 p-2"><b className="block text-base text-foreground">{order.buzzers}</b><span className="text-muted-foreground">Total buzzer</span></div>
                <div className="rounded-lg bg-muted/50 p-2"><b className="block text-base text-foreground">{order.buzzersJoined}</b><span className="text-muted-foreground">Bergabung</span></div>
                <div className="rounded-lg bg-muted/50 p-2"><b className="block text-base text-foreground">{done}</b><span className="text-muted-foreground">Selesai</span></div>
              </div>
              {proofs.length > 0 ? (
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-muted-foreground">Bukti pengerjaan terbaru</p>
                  {proofs.slice(0, 4).map((p) => (
                    <div key={p.id} className="flex items-center gap-3 rounded-lg border border-border p-2">
                      <img src={p.imageUrl} alt={`Bukti pengerjaan ${p.buzzerName}`} loading="lazy" className="h-10 w-10 rounded object-cover" />
                      <div className="min-w-0 flex-1">
                        {p.buzzerEmail ? (
                          <div className="flex items-center gap-1">
                            <BuzzerNameLink name={p.buzzerName} email={p.buzzerEmail} className="truncate text-xs" />
                            <span className="text-xs text-muted-foreground">· {p.platform}</span>
                          </div>
                        ) : (
                          <p className="truncate text-xs font-semibold">{p.buzzerName} · {p.platform}</p>
                        )}
                        <p className="truncate text-[11px] text-muted-foreground">{p.caption}</p>
                      </div>
                      <span className="shrink-0 text-[10px] text-muted-foreground">{p.uploadedAt}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground">Belum ada bukti pengerjaan yang diunggah buzzer.</p>
              )}
            </div>
          </>
        )}

        <DialogFooter className="flex items-center justify-end gap-2 pt-2">
          <Button variant="outline" onClick={() => printInvoice(payment, store)}><Printer className="mr-1 h-4 w-4" /> Cetak</Button>
          <Button className="gradient-brand text-brand-foreground" onClick={() => downloadInvoice(payment, store)}><Download className="mr-1 h-4 w-4" /> Download PDF</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function NotifSheet({
  open,
  onOpenChange,
  store,
  customerEmail,
  onSelectSection,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  store: Store;
  customerEmail?: string | null;
  onSelectSection?: (s: SectionKey) => void;
}) {
  const prefs = useCustomerNotifPreferences(customerEmail);
  const visibleNotifications = useMemo(
    () => store.state.notifications.filter((n) => isCustomerNotifEnabled(n, prefs)),
    [store.state.notifications, prefs],
  );
  const unreadCount = prefs.inApp ? visibleNotifications.filter((n) => !n.read).length : 0;

  const handleNotificationClick = (n: (typeof store.state.notifications)[number]) => {
    store.markNotificationRead(n.id);
    if (onSelectSection) {
      if (n.type === "support" || n.title.toLowerCase().includes("balasan support")) {
        onSelectSection("bantuan");
        onOpenChange(false);
      } else if (
        n.type === "order" ||
        n.type === "campaign" ||
        n.title.toLowerCase().includes("pesanan") ||
        n.title.toLowerCase().includes("menunggu")
      ) {
        onSelectSection("pesanan");
        onOpenChange(false);
      } else if (n.type === "payment" || n.title.toLowerCase().includes("pembayaran")) {
        onSelectSection("pembayaran");
        onOpenChange(false);
      }
    }
  };

  const handleMarkAll = () => {
    for (const n of visibleNotifications) {
      if (!n.read) store.markNotificationRead(n.id);
    }
    toast.success("Semua notifikasi aktif ditandai dibaca");
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md p-0 flex flex-col">
        <div className="flex items-center justify-between border-b border-border pl-5 pr-14 py-3.5">
          <div>
            <h3 className="font-display font-bold text-base">Notifikasi</h3>
            <p className="text-xs text-muted-foreground">
              {!prefs.inApp
                ? "Fitur lonceng dinonaktifkan di pengaturan"
                : unreadCount > 0
                ? `${unreadCount} belum dibaca`
                : "Semua sudah dibaca"}
            </p>
          </div>
          <div className="flex items-center gap-1.5 mr-2">
            {prefs.inApp && unreadCount > 0 && (
              <Button
                size="sm"
                variant="outline"
                className="h-8 gap-1.5 px-3 text-xs font-medium"
                onClick={handleMarkAll}
              >
                <Check className="h-3.5 w-3.5 text-muted-foreground" />
                Tandai semua
              </Button>
            )}
          </div>
        </div>
        <div className="max-h-[calc(100vh-80px)] overflow-y-auto">
          {!prefs.inApp ? (
            <div className="p-8 text-center text-sm text-muted-foreground">
              <Bell className="mx-auto mb-2 h-8 w-8 text-muted-foreground/40 opacity-40 line-through" />
              <p className="font-semibold text-foreground">Notifikasi In-App Dinonaktifkan</p>
              <p className="mt-1 text-xs">
                Anda menonaktifkan fitur notifikasi dalam aplikasi di menu Pengaturan. Aktifkan kembali di halaman Pengaturan untuk melihat notifikasi di sini.
              </p>
            </div>
          ) : visibleNotifications.length === 0 ? (
            <div className="p-8 text-center text-sm text-muted-foreground">
              <Bell className="mx-auto mb-2 h-8 w-8 text-muted-foreground/40" />
              <p className="font-semibold text-foreground">
                {store.state.notifications.length > 0 ? "Notifikasi Disembunyikan" : "Belum ada notifikasi"}
              </p>
              <p className="mt-1 text-xs">
                {store.state.notifications.length > 0
                  ? "Beberapa notifikasi disembunyikan berdasarkan preferensi kategori yang Anda nonaktifkan di Pengaturan."
                  : "Belum ada notifikasi baru untuk akun Anda."}
              </p>
            </div>
          ) : (
            visibleNotifications.slice(0, 30).map((n) => (
              <button
                key={n.id}
                onClick={() => handleNotificationClick(n)}
                className={cn(
                  "flex w-full items-start gap-3 border-b border-border p-4 text-left transition-colors hover:bg-muted/50",
                  !n.read && "bg-primary/5"
                )}
              >
                <span
                  className={cn(
                    "mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-full",
                    n.type === "support" || n.title.toLowerCase().includes("balasan support")
                      ? "bg-sky-500/15 text-sky-400"
                      : n.type === "system" || n.id === "ntf-welcome" || n.title.toLowerCase().includes("selamat datang")
                      ? "bg-slate-500/15 text-slate-300"
                      : n.title.toLowerCase().includes("disetujui")
                      ? "bg-emerald-500/15 text-emerald-400"
                      : n.title.toLowerCase().includes("ditolak")
                      ? "bg-rose-500/15 text-rose-400"
                      : n.title.toLowerCase().includes("menunggu") || n.title.toLowerCase().includes("diverifikasi")
                      ? "bg-amber-500/15 text-amber-400"
                      : n.type === "campaign" || n.title.toLowerCase().includes("selesai")
                      ? "bg-fuchsia-500/15 text-fuchsia-400"
                      : "bg-blue-500/15 text-blue-400"
                  )}
                >
                  {n.type === "support" || n.title.toLowerCase().includes("balasan support") ? (
                    <MessageCircle className="h-4 w-4" />
                  ) : n.type === "system" || n.id === "ntf-welcome" || n.title.toLowerCase().includes("selamat datang") ? (
                    <Bell className="h-4 w-4" />
                  ) : n.title.toLowerCase().includes("disetujui") ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : n.title.toLowerCase().includes("ditolak") ? (
                    <XCircle className="h-4 w-4" />
                  ) : n.title.toLowerCase().includes("menunggu") || n.title.toLowerCase().includes("diverifikasi") ? (
                    <Clock className="h-4 w-4" />
                  ) : n.type === "campaign" || n.title.toLowerCase().includes("selesai") ? (
                    <Megaphone className="h-4 w-4" />
                  ) : (
                    <ShoppingBag className="h-4 w-4" />
                  )}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{n.title}</p>
                  <p className="text-xs text-muted-foreground">{n.body}</p>
                  <p className="mt-1 text-[10px] text-muted-foreground">{n.date}</p>
                </div>
                {!n.read && <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-primary" />}
              </button>
            ))
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

function EmptyState({ icon, title, desc }: { icon: ReactNode; title: string; desc: string }) {
  return (
    <div className="grid place-items-center rounded-xl border border-dashed border-border py-10 text-center">
      <span className="grid h-14 w-14 place-items-center rounded-full bg-muted text-muted-foreground">{icon}</span>
      <p className="mt-3 font-semibold">{title}</p>
      <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
    </div>
  );
}

/* ============ Utils ============ */
function statusColor(status: PaymentStatus): [number, number, number] {
  switch (status) {
    case "Lunas": return [34, 197, 94];
    case "Menunggu Verifikasi": return [234, 179, 8];
    case "Belum Dibayar": return [148, 163, 184];
    case "Refund": return [168, 85, 247];
    case "Gagal": return [239, 68, 68];
    default: return [100, 116, 139];
  }
}

function buildInvoicePdf(p: Payment, store: Store): jsPDF {
  const order = store.state.orders.find((o) => o.id === p.orderId);
  const profile = store.state.profile;
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const W = 210;
  const M = 15;
  let y = 18;

  // Brand header bar
  doc.setFillColor(37, 99, 235);
  doc.rect(0, 0, W, 32, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text("BuzzHub", M, 18);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text("Platform Jasa Buzzer #1 di Indonesia", M, 24);
  doc.text("hello@buzzhub.id  ·  www.buzzhub.id", M, 28.5);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("INVOICE PEMBAYARAN", W - M, 18, { align: "right" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(p.invoice, W - M, 24, { align: "right" });

  // Status badge
  const [r, g, b] = statusColor(p.status);
  const badgeText = p.status;
  doc.setFontSize(9);
  const bw = doc.getTextWidth(badgeText) + 8;
  doc.setFillColor(r, g, b);
  doc.roundedRect(W - M - bw, 27, bw, 6, 1.5, 1.5, "F");
  doc.setTextColor(255, 255, 255);
  doc.text(badgeText, W - M - bw / 2, 31, { align: "center" });

  y = 44;
  doc.setTextColor(30, 41, 59);

  const section = (title: string) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(37, 99, 235);
    doc.text(title, M, y);
    y += 2;
    doc.setDrawColor(37, 99, 235);
    doc.setLineWidth(0.4);
    doc.line(M, y, W - M, y);
    y += 5;
    doc.setTextColor(30, 41, 59);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
  };

  const kv = (label: string, value: string) => {
    doc.setTextColor(100, 116, 139);
    doc.text(label, M, y);
    doc.setTextColor(30, 41, 59);
    doc.setFont("helvetica", "bold");
    const lines = doc.splitTextToSize(value || "-", 110);
    doc.text(lines, M + 55, y);
    doc.setFont("helvetica", "normal");
    y += 5 * Math.max(1, lines.length);
  };

  section("Informasi Customer");
  kv("Nama", profile.name);
  kv("Email", profile.email);
  kv("No. Telepon", profile.phone);
  kv("Kota", profile.city);
  if (profile.company) kv("Perusahaan", profile.company);
  y += 3;

  section("Informasi Campaign");
  kv("Nama Campaign", order?.campaignName ?? p.campaignName);
  kv("Platform", order?.platform ?? "-");
  kv("Kategori Layanan", order?.serviceName ?? "-");
  kv("Deadline", order?.endDate ?? "-");
  y += 3;

  section("Detail Pembayaran");
  kv("Nomor Invoice", p.invoice);
  kv("Tanggal Invoice", p.date);
  kv("Metode Pembayaran", `${p.method} · ${p.channel}`);
  kv("Status", p.status === "Menunggu Verifikasi" ? "Menunggu Verifikasi Admin" : p.status);
  y += 3;

  // Ringkasan Tagihan (table)
  section("Ringkasan Tagihan");
  const admin = Math.round(p.amount * 0.005);
  const taxable = p.amount + admin;
  const tax = Math.round(taxable * 0.11);
  const total = taxable + tax;

  const rowH = 8;
  const col1 = M;
  const col2 = W - M;
  doc.setFillColor(241, 245, 249);
  doc.rect(M, y, W - M * 2, rowH, "F");
  doc.setFont("helvetica", "bold");
  doc.text("Deskripsi", col1 + 3, y + 5.5);
  doc.text("Jumlah", col2 - 3, y + 5.5, { align: "right" });
  y += rowH;
  doc.setFont("helvetica", "normal");

  const row = (label: string, val: string, bold = false) => {
    doc.setDrawColor(226, 232, 240);
    doc.line(M, y, W - M, y);
    if (bold) doc.setFont("helvetica", "bold");
    doc.text(label, col1 + 3, y + 5.5);
    doc.text(val, col2 - 3, y + 5.5, { align: "right" });
    if (bold) doc.setFont("helvetica", "normal");
    y += rowH;
  };
  row("Subtotal Campaign", formatIDR(p.amount));
  row("Biaya Admin (0.5%)", formatIDR(admin));
  row("PPN 11%", formatIDR(tax));

  // Total row
  doc.setFillColor(37, 99, 235);
  doc.rect(M, y, W - M * 2, rowH + 2, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("TOTAL PEMBAYARAN", col1 + 3, y + 6.5);
  doc.text(formatIDR(total), col2 - 3, y + 6.5, { align: "right" });
  y += rowH + 8;

  // Footer
  doc.setTextColor(100, 116, 139);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  const footerY = 275;
  doc.setDrawColor(226, 232, 240);
  doc.line(M, footerY - 6, W - M, footerY - 6);
  doc.text("Terima kasih telah menggunakan BuzzHub.", W / 2, footerY, { align: "center" });
  doc.text(
    "Invoice ini dibuat secara otomatis oleh sistem sehingga tidak memerlukan tanda tangan.",
    W / 2,
    footerY + 4.5,
    { align: "center" },
  );

  return doc;
}

function downloadInvoice(p: Payment, store: Store) {
  const doc = buildInvoicePdf(p, store);
  doc.save(`Invoice_${p.invoice}.pdf`);
  toast.success("Invoice PDF diunduh");
}

function printInvoice(p: Payment, store: Store) {
  const doc = buildInvoicePdf(p, store);
  const url = doc.output("bloburl");
  const w = window.open(url, "_blank");
  if (!w) return toast.error("Popup diblokir browser");
  w.addEventListener("load", () => { w.focus(); w.print(); });
}

/* ==================== ULASAN ==================== */
function UlasanSection({
  customerEmail,
  customerName,
}: {
  customerEmail: string;
  customerName: string;
}) {
  const { data: campaigns } = useCampaigns();
  const { data: jobs } = useCampaignJobs();
  const { data: allRatings, loading, refetch } = useBuzzerRatings();
  const myRatings = allRatings.filter(
    (r) => (r.customer_id ?? r.customer_email)?.toLowerCase() === customerEmail.toLowerCase(),
  );
  const customerCampaigns = campaigns.filter((campaign) => campaign.customer_email?.toLowerCase() === customerEmail.toLowerCase());
  const jobsByCampaign = new Map<string, CampaignJob[]>();
  for (const job of jobs) {
    if (!job.campaign_id) continue;
    const current = jobsByCampaign.get(job.campaign_id) ?? [];
    current.push(job);
    jobsByCampaign.set(job.campaign_id, current);
  }
  const completedCampaigns = customerCampaigns.filter((campaign) => {
    const campaignJobs = jobsByCampaign.get(campaign.id) ?? [];
    return campaign.status === "Selesai" && campaignJobs.length >= Math.max(1, campaign.slots) && campaignJobs.every((job) => job.buzzer_email && (job.status === "Selesai" || (job.status === "Review" && job.admin_verified_at)));
  });
  const ratingsByCampaignId = new Map<string, typeof myRatings[number]>();
  const ratingCountByCampaign = new Map<string, number>();
  for (const rating of myRatings) {
    if (!rating.campaign_id) continue;
    ratingsByCampaignId.set(rating.campaign_id, rating);
    ratingCountByCampaign.set(rating.campaign_id, (ratingCountByCampaign.get(rating.campaign_id) ?? 0) + 1);
  }
  const pendingReviews = completedCampaigns.filter((campaign) => (ratingCountByCampaign.get(campaign.id) ?? 0) < (jobsByCampaign.get(campaign.id)?.length ?? 0));
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [stars, setStars] = useState(0);
  const [comment, setComment] = useState("");
  const [saving, setSaving] = useState(false);
  const [editingRating, setEditingRating] = useState<BuzzerRating | null>(null);
  const [editStars, setEditStars] = useState(0);
  const [editComment, setEditComment] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);

  const openReview = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setStars(0);
    setComment("");
  };

  const campaignsMap = useMemo(() => {
    const map = new Map<string, (typeof campaigns)[number]>();
    for (const c of campaigns) {
      map.set(c.id, c);
    }
    return map;
  }, [campaigns]);

  const jobsMap = useMemo(() => {
    const map = new Map<string, (typeof jobs)[number]>();
    for (const j of jobs) {
      map.set(j.id, j);
    }
    return map;
  }, [jobs]);

  const getOrderCompletedTime = useCallback((rating: BuzzerRating): number => {
    if (rating.order_completed_at) {
      const t = new Date(rating.order_completed_at).getTime();
      if (!isNaN(t) && t > 0) return t;
    }
    if (rating.campaign_id) {
      const camp = campaignsMap.get(rating.campaign_id);
      if (camp?.target_reached_at) {
        const t = new Date(camp.target_reached_at).getTime();
        if (!isNaN(t) && t > 0) return t;
      }
      if (camp?.updated_at && camp.status === "Selesai") {
        const t = new Date(camp.updated_at).getTime();
        if (!isNaN(t) && t > 0) return t;
      }
    }
    if (rating.job_id) {
      const j = jobsMap.get(rating.job_id);
      if (j?.admin_verified_at) {
        const t = new Date(j.admin_verified_at).getTime();
        if (!isNaN(t) && t > 0) return t;
      }
      if (j?.updated_at && j.status === "Selesai") {
        const t = new Date(j.updated_at).getTime();
        if (!isNaN(t) && t > 0) return t;
      }
    }
    return new Date(rating.created_at).getTime();
  }, [campaignsMap, jobsMap]);

  const getRatingEditInfo = useCallback((rating: BuzzerRating) => {
    const editCount = rating.customer_edit_count ?? 0;
    const ratedMs = new Date(rating.created_at).getTime();
    const deadlineMs = ratedMs + 24 * 60 * 60 * 1000;
    const now = Date.now();
    const remainingMs = deadlineMs - now;
    const isExpired = remainingMs <= 0;
    const hasEdited = editCount >= 1;
    const canEdit = !hasEdited && !isExpired;

    let remainingLabel = "";
    if (!isExpired) {
      const hours = Math.floor(remainingMs / (1000 * 60 * 60));
      const minutes = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));
      if (hours > 0) {
        remainingLabel = `Sisa waktu ${hours} jam ${minutes} menit`;
      } else {
        remainingLabel = `Sisa waktu ${Math.max(1, minutes)} menit`;
      }
    }

    return {
      canEdit,
      hasEdited,
      isExpired,
      ratedMs,
      deadlineMs,
      remainingLabel,
    };
  }, []);

  const canEditRating = (rating: BuzzerRating) => getRatingEditInfo(rating).canEdit;

  const openRatingEdit = (rating: BuzzerRating) => {
    const info = getRatingEditInfo(rating);
    if (info.hasEdited) {
      toast.error("Kesempatan edit ulasan sudah digunakan (maksimal 1x).");
      return;
    }
    if (info.isExpired) {
      toast.error("Batas waktu edit ulasan sudah berakhir (melebihi 1x24 jam setelah ulasan diberikan).");
      return;
    }
    setEditingRating(rating);
    setEditStars(rating.stars);
    setEditComment(rating.comment ?? "");
  };

  const saveRatingEdit = async () => {
    if (!editingRating || !editStars) return;
    setSavingEdit(true);
    try {
      await updateCustomerBuzzerRating({
        id: editingRating.id,
        customer_email: customerEmail,
        stars: editStars,
        comment: editComment,
      });
      await refetch();
      setEditingRating(null);
      toast.success("Ulasan berhasil diperbarui. Kesempatan edit 1x telah digunakan.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Ulasan gagal diperbarui.");
    } finally {
      setSavingEdit(false);
    }
  };

  const submitReview = async () => {
    if (!selectedCampaign || !stars) {
      toast.error("Pilih rating 1–5 terlebih dahulu");
      return;
    }
    setSaving(true);
    try {
      await rateCampaignForAllBuzzers({
        customer_id: customerEmail,
        campaign_id: selectedCampaign.id,
        stars,
        comment,
      });
      await refetch();
      setSelectedCampaign(null);
      toast.success("Ulasan berhasil dikirim");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Ulasan gagal disimpan");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      {pendingReviews.length > 0 && (
        <div className="rounded-2xl border border-primary/30 bg-primary/5 p-6 shadow-sm">
          <div className="mb-4">
            <h2 className="font-display text-xl font-bold">Beri Ulasan</h2>
            <p className="mt-1 text-sm text-muted-foreground">Pekerjaan selesai dan siap Anda nilai.</p>
          </div>
          <div className="space-y-3">
            {pendingReviews.map((campaign) => (
              <div key={campaign.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-card p-4">
                <div className="min-w-0">
                  <p className="truncate font-semibold">{campaign.title}</p>
                  <p className="text-sm text-muted-foreground">{campaign.slots} buzzer · Semua pekerjaan selesai</p>
                </div>
                <Button className="gradient-brand text-brand-foreground" onClick={() => openReview(campaign)}>
                  <Star className="mr-1 h-4 w-4" /> Beri Ulasan Campaign
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {completedCampaigns.filter((campaign) => ratingsByCampaignId.has(campaign.id)).length > 0 && (
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h2 className="mb-4 font-display text-xl font-bold">Status Ulasan</h2>
          <div className="space-y-3">
            {completedCampaigns.filter((campaign) => ratingsByCampaignId.has(campaign.id)).map((campaign) => {
              const rating = ratingsByCampaignId.get(campaign.id);
              const editInfo = rating ? getRatingEditInfo(rating) : null;
              return (
              <div key={campaign.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-muted/30 p-4">
                <div className="min-w-0">
                  <p className="truncate font-semibold">{campaign.title}</p>
                  <p className="text-sm text-muted-foreground">{campaign.slots} buzzer · Semua pekerjaan selesai</p>
                </div>
                <div className="flex items-center gap-3 text-right">
                  <div>
                    <span className="block text-sm font-semibold text-emerald-600">Sudah Diulas</span>
                    <span className="text-sm text-amber-500">{"★".repeat(rating?.stars ?? 0)}</span>
                  </div>
                  {rating && editInfo?.canEdit && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-8 w-8 p-0 text-primary border-primary/30 hover:bg-primary/5"
                      title="Edit Ulasan (1x)"
                      aria-label="Edit Ulasan"
                      onClick={() => openRatingEdit(rating)}
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                    </Button>
                  )}
                  {rating && editInfo?.hasEdited && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 className="h-3 w-3" /> Diedit (1/1)
                    </span>
                  )}
                </div>
              </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="font-display text-xl font-bold">Rating & Komentar Saya</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {myRatings.length} rating telah Anda berikan untuk buzzer
            </p>
          </div>
          {myRatings.length > 0 && (
            <div className="text-right">
              <p className="text-xs uppercase text-muted-foreground">Total Rating</p>
              <p className="text-2xl font-bold text-amber-500">{myRatings.length}</p>
            </div>
          )}
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-24 w-full rounded-lg" />
            ))}
          </div>
        ) : myRatings.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border bg-muted/30 p-8 text-center">
            <Star className="mx-auto mb-3 h-8 w-8 text-muted-foreground/50" />
            <p className="font-medium text-foreground">Belum ada rating</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Klik nama buzzer untuk memberikan rating dan komentar
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {myRatings.map((rating) => (
              <div
                key={rating.id}
                className="flex gap-4 rounded-lg border border-border bg-muted/30 p-4"
              >
                <Avatar className="h-10 w-10 shrink-0">
                  <AvatarFallback className="text-xs">
                    {rating.buzzer_name
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
                      <Link
                        to="/buzzer-profile/$buzzerEmail"
                        params={{ buzzerEmail: encodeURIComponent(rating.buzzer_email) }}
                        className="font-semibold text-sm text-primary hover:underline"
                      >
                        {rating.buzzer_name}
                      </Link>
                      <p className="text-xs text-muted-foreground">
                        {rating.campaign_title}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      {Array(5)
                        .fill(null)
                        .map((_, i) => (
                          <Star
                            key={i}
                            className={cn(
                              "h-3.5 w-3.5",
                              i < rating.stars
                                ? "fill-amber-400 text-amber-400"
                                : "text-muted-foreground/30"
                            )}
                          />
                        ))}
                    </div>
                  </div>

                  {rating.comment && (
                    <p className="mt-2 text-sm text-foreground">"{rating.comment}"</p>
                  )}

                  <div className="mt-2 flex flex-wrap items-center justify-between gap-2 border-t border-border/50 pt-2">
                    <p className="text-xs text-muted-foreground">
                      Diulas: {new Date(rating.created_at).toLocaleDateString("id-ID", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>

                    {(() => {
                      const editInfo = getRatingEditInfo(rating);
                      if (editInfo.canEdit) {
                        return (
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] font-medium text-amber-600 dark:text-amber-400">
                              1x edit • {editInfo.remainingLabel} (24 jam setelah ulasan diberikan)
                            </span>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="h-7 w-7 p-0 font-semibold text-primary border-primary/30 hover:bg-primary/10"
                              title="Edit (1x)"
                              aria-label="Edit"
                              onClick={() => openRatingEdit(rating)}
                            >
                              <Edit3 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        );
                      }
                      if (editInfo.hasEdited) {
                        return (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                            <CheckCircle2 className="h-3 w-3" /> Ulasan telah diedit (1/1)
                          </span>
                        );
                      }
                      return (
                        <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">
                          <Clock className="h-3 w-3" /> Batas waktu edit berakhir (&gt;24 jam setelah ulasan diberikan)
                        </span>
                      );
                    })()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Dialog open={!!selectedCampaign} onOpenChange={(open) => !open && setSelectedCampaign(null)}>
        <DialogContent className="w-[calc(100vw-1.5rem)] max-w-md">
          <DialogHeader>
            <DialogTitle>Beri Ulasan</DialogTitle>
            <DialogDescription>Nilai seluruh buzzer pada campaign {selectedCampaign?.title}.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Rating</Label>
              <div className="mt-2 flex gap-2" role="radiogroup" aria-label="Rating 1 sampai 5">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button key={value} type="button" role="radio" aria-checked={stars === value} aria-label={`${value} bintang`} onClick={() => setStars(value)} className="rounded-md p-1 transition-colors hover:bg-muted">
                    <Star className={cn("h-7 w-7", value <= stars ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30")} />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <Label htmlFor="review-comment">Komentar (opsional)</Label>
              <Textarea id="review-comment" rows={4} value={comment} onChange={(event) => setComment(event.target.value)} placeholder="Bagikan pengalaman Anda..." />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedCampaign(null)} disabled={saving}>Batal</Button>
            <Button className="gradient-brand text-brand-foreground" onClick={submitReview} disabled={saving || !stars}>
              {saving ? "Mengirim..." : "Kirim Ulasan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!editingRating} onOpenChange={(open) => !open && !savingEdit && setEditingRating(null)}>
        <DialogContent className="w-[calc(100vw-1.5rem)] max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Ulasan & Rating (1x Kesempatan)</DialogTitle>
            <DialogDescription>
              Beri ulasan pembaruan untuk buzzer. Anda memiliki 1x kesempatan edit dalam batas waktu 1x24 jam setelah ulasan diberikan. Setelah disimpan, ulasan tidak dapat diedit lagi.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {editingRating && (
              <div className="rounded-lg border border-amber-500/20 bg-amber-500/10 p-3 text-xs text-amber-700 dark:text-amber-300 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Buzzer: {editingRating.buzzer_name}</span>
                  <span className="font-medium">{getRatingEditInfo(editingRating).remainingLabel}</span>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Diulas pada: {new Date(editingRating.created_at).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" })}
                </p>
              </div>
            )}
            <div>
              <Label>Rating</Label>
              <div className="mt-2 flex gap-2" role="radiogroup" aria-label="Rating 1 sampai 5">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button key={value} type="button" role="radio" aria-checked={editStars === value} aria-label={`${value} bintang`} onClick={() => setEditStars(value)} className="rounded-md p-1 transition-colors hover:bg-muted">
                    <Star className={cn("h-7 w-7", value <= editStars ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30")} />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <Label htmlFor="customer-edit-review-comment">Komentar (opsional)</Label>
              <Textarea id="customer-edit-review-comment" rows={4} value={editComment} onChange={(event) => setEditComment(event.target.value)} placeholder="Tuliskan ulasan yang diperbarui..." />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingRating(null)} disabled={savingEdit}>Batal</Button>
            <Button className="gradient-brand text-brand-foreground" onClick={saveRatingEdit} disabled={savingEdit || !editStars}>
              {savingEdit ? "Menyimpan..." : "Simpan Perubahan (1x)"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
