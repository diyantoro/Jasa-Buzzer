import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Activity,
  CalendarDays,
  Eye,
  Inbox,
  Megaphone,
  RefreshCw,
  Search,
  Trash2,
  TrendingUp,
  UserPlus,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { TablePagination } from "@/components/table-pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
  calculateCampaignJobSplit,
  useCampaigns,
  useCompletedCampaignJobs,
  type CampaignJob,
} from "@/lib/campaign-store";
import { usePayments, formatIDR, formatDate, type Payment } from "@/lib/finance-store";
import {
  ActivityComparisonChart,
  ActivityDistributionChart,
  ActivityMetricCard,
  ActivityTrendChart,
  CHART_COLORS,
  ChartCard,
  ChartEmptyState,
  ChartErrorState,
  ChartSkeleton,
  type ActivityBarPoint,
  type ActivitySlice,
  type TrendPoint,
} from "@/components/admin-activity-charts";
import { cn } from "@/lib/utils";

type ActivityCategory = "Pembayaran Masuk" | "Pekerjaan" | "Payout Buzzer" | "Komisi Admin";
type PaymentSplit = {
  level: string;
  gross: number;
  buzzerPercentage: number;
  buzzerAmount: number;
  adminPercentage: number;
  adminAmount: number;
};
type ActivityRow = {
  id: string;
  category: ActivityCategory;
  actor: string;
  title: string;
  reference: string;
  amount: number;
  status: string;
  time: string;
  detail: Payment | CampaignJob | null;
  split?: PaymentSplit;
};

type AccountRow = { email: string; role: string | null; created_at: string | null };

type PeriodKey = "7d" | "30d" | "90d" | "custom";

const categories = ["Pekerjaan", "Pembayaran Masuk", "Payout Buzzer", "Komisi Admin"] as const;

const PERIOD_OPTIONS: Array<{ key: PeriodKey; label: string }> = [
  { key: "7d", label: "7 hari" },
  { key: "30d", label: "30 hari" },
  { key: "90d", label: "90 hari" },
  { key: "custom", label: "Kustom" },
];

const DAY_MS = 86_400_000;
const MAX_RANGE_DAYS = 366;

function startOfDay(date: Date) {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next;
}

function endOfDay(date: Date) {
  const next = new Date(date);
  next.setHours(23, 59, 59, 999);
  return next;
}

function dayKey(value: string | Date) {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

function shortLabel(date: Date) {
  return date.toLocaleDateString("id-ID", { day: "2-digit", month: "short" });
}

function fullLabel(date: Date) {
  return date.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function rangeLabel(from: Date, to: Date) {
  const sameYear = from.getFullYear() === to.getFullYear();
  const start = from.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    ...(sameYear ? {} : { year: "numeric" }),
  });
  const end = to.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
  return `${start} – ${end}`;
}

function statusClass(status: string) {
  if (["Berhasil", "Lunas", "Selesai"].includes(status)) return "bg-emerald-100 text-emerald-700";
  if (["Refund", "Ditolak", "Gagal"].includes(status)) return "bg-rose-100 text-rose-700";
  return "bg-amber-100 text-amber-700";
}

function statusLabel(status: string) {
  return status === "Menunggu Verifikasi" ? "Menunggu" : status;
}

function jobSplit(job: CampaignJob): PaymentSplit {
  const split = calculateCampaignJobSplit(job);
  return {
    level: job.buzzer_level ?? "Legacy",
    gross: split.total,
    buzzerPercentage: split.buzzerPercent,
    buzzerAmount: split.buzzerShare,
    adminPercentage: split.adminPercent,
    adminAmount: split.adminShare,
  };
}

function buildDelta(current: number, previous: number) {
  if (previous <= 0) {
    if (current <= 0) return { text: undefined, direction: "flat" as const };
    return { text: "Baru periode ini", direction: "flat" as const };
  }
  const percent = ((current - previous) / previous) * 100;
  return {
    text: `${percent > 0 ? "+" : ""}${percent.toFixed(1).replace(".", ",")}%`,
    direction: percent > 0 ? ("up" as const) : percent < 0 ? ("down" as const) : ("flat" as const),
  };
}

export function PencairanSection() {
  const { data: payments, loading: paymentsLoading, refetch: refetchPayments } = usePayments();
  const {
    data: jobs,
    loading: jobsLoading,
    error: jobsError,
    refetch: refetchJobs,
  } = useCompletedCampaignJobs();
  const {
    data: campaigns,
    loading: campaignsLoading,
    error: campaignsError,
    refetch: refetchCampaigns,
  } = useCampaigns();

  const [accounts, setAccounts] = useState<AccountRow[]>([]);
  const [accountsLoading, setAccountsLoading] = useState(true);
  const [accountsError, setAccountsError] = useState<string | null>(null);

  const [period, setPeriod] = useState<PeriodKey>("30d");
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");

  const [category, setCategory] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [query, setQuery] = useState("");
  const [date, setDate] = useState("");
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 8;
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selected, setSelected] = useState<ActivityRow | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<ActivityRow | null>(null);
  const [deletedIds, setDeletedIds] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem("buzzhub.deleted_activities");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  /* ------------------------- data pendukung ------------------------- */
  const loadAccounts = useCallback(async () => {
    setAccountsLoading(true);
    setAccountsError(null);
    const { data, error } = await supabase.from("app_accounts").select("email, role, created_at");
    if (error) {
      console.error("[Supabase] Failed to load app_accounts:", error);
      setAccountsError(error.message);
      setAccounts([]);
    } else {
      setAccounts((data ?? []) as AccountRow[]);
    }
    setAccountsLoading(false);
  }, []);

  useEffect(() => {
    void loadAccounts();
    const channel = supabase
      .channel("admin-activity-accounts")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "app_accounts" },
        () => void loadAccounts(),
      )
      .subscribe();
    return () => {
      void supabase.removeChannel(channel);
    };
  }, [loadAccounts]);

  /* --------------------- baris aktivitas (real) --------------------- */
  const activities = useMemo<ActivityRow[]>(() => {
    const rows: ActivityRow[] = [];
    payments.forEach((payment) =>
      rows.push({
        id: `payment-${payment.id}`,
        category: "Pembayaran Masuk",
        actor: payment.customer_name,
        title: `${payment.customer_name} telah membayar invoice ${payment.invoice_no}`,
        reference: `${payment.invoice_no} · ${payment.campaign_name}`,
        amount: Number(payment.amount),
        status: payment.status,
        time: payment.paid_at ?? payment.created_at,
        detail: payment,
      }),
    );
    jobs
      .filter(
        (job) => (job.status === "Selesai" || Boolean(job.admin_verified_at)) && job.buzzer_email,
      )
      .forEach((job) => {
        const split = jobSplit(job);
        rows.push({
          id: `job-${job.id}`,
          category: "Pekerjaan",
          actor: job.buzzer_name || job.buzzer_email || "Buzzer",
          title: `${job.buzzer_name || "Buzzer"} menyelesaikan campaign ${job.campaign_title} · Level ${split.level}`,
          reference: job.campaign_title,
          amount: split.gross,
          status: job.status,
          time: job.updated_at,
          detail: job,
          split,
        });
        rows.push({
          id: `payout-${job.id}`,
          category: "Payout Buzzer",
          actor: job.buzzer_name || job.buzzer_email || "Buzzer",
          title: `Payout ${split.buzzerPercentage}% kepada ${job.buzzer_name || "Buzzer"} untuk ${job.campaign_title}`,
          reference: job.campaign_title,
          amount: split.buzzerAmount,
          status: "Berhasil",
          time: job.updated_at,
          detail: job,
          split,
        });
        rows.push({
          id: `commission-${job.id}`,
          category: "Komisi Admin",
          actor: "Admin",
          title: `Komisi Admin ${split.adminPercentage}% dari campaign ${job.campaign_title}`,
          reference: job.campaign_title,
          amount: split.adminAmount,
          status: "Berhasil",
          time: job.updated_at,
          detail: job,
          split,
        });
      });
    return rows.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
  }, [payments, jobs]);

  const visibleActivities = useMemo(
    () => activities.filter((item) => !deletedIds.includes(item.id)),
    [activities, deletedIds],
  );

  /* --------------------------- periode --------------------------- */
  const range = useMemo(() => {
    const today = endOfDay(new Date());

    if (period === "custom" && customFrom && customTo) {
      const from = startOfDay(new Date(customFrom));
      const to = endOfDay(new Date(customTo));
      if (!Number.isNaN(from.getTime()) && !Number.isNaN(to.getTime()) && from <= to) {
        const maxFrom = startOfDay(new Date(to.getTime() - (MAX_RANGE_DAYS - 1) * DAY_MS));
        return { from: from < maxFrom ? maxFrom : from, to, key: "custom" as const };
      }
    }

    const days = period === "90d" ? 90 : period === "7d" ? 7 : 30;
    return {
      from: startOfDay(new Date(today.getTime() - (days - 1) * DAY_MS)),
      to: today,
      key: period,
    };
  }, [period, customFrom, customTo]);

  const previousRange = useMemo(() => {
    const span = range.to.getTime() - range.from.getTime() + 1;
    const to = new Date(range.from.getTime() - 1);
    return { from: new Date(to.getTime() - span + 1), to };
  }, [range]);

  const inRange = useCallback((value: string | Date, bounds: { from: Date; to: Date }) => {
    const time = new Date(value).getTime();
    if (Number.isNaN(time)) return false;
    return time >= bounds.from.getTime() && time <= bounds.to.getTime();
  }, []);

  const periodActivities = useMemo(
    () => visibleActivities.filter((item) => inRange(item.time, range)),
    [visibleActivities, range, inRange],
  );

  const previousActivities = useMemo(
    () => visibleActivities.filter((item) => inRange(item.time, previousRange)),
    [visibleActivities, previousRange, inRange],
  );

  /* ------------------------ seri grafik ------------------------ */
  const trendSeries = useMemo<TrendPoint[]>(() => {
    const buckets = new Map<string, TrendPoint>();
    const cursor = startOfDay(range.from);
    let guard = 0;

    while (cursor.getTime() <= range.to.getTime() && guard < MAX_RANGE_DAYS) {
      buckets.set(dayKey(cursor), {
        key: dayKey(cursor),
        label: shortLabel(cursor),
        fullLabel: fullLabel(cursor),
        total: 0,
        pembayaran: 0,
        pekerjaan: 0,
        payout: 0,
        komisi: 0,
      });
      cursor.setDate(cursor.getDate() + 1);
      guard += 1;
    }

    for (const row of periodActivities) {
      const bucket = buckets.get(dayKey(row.time));
      if (!bucket) continue;
      bucket.total += 1;
      if (row.category === "Pembayaran Masuk") bucket.pembayaran += 1;
      else if (row.category === "Pekerjaan") bucket.pekerjaan += 1;
      else if (row.category === "Payout Buzzer") bucket.payout += 1;
      else bucket.komisi += 1;
    }

    return Array.from(buckets.values());
  }, [periodActivities, range]);

  const barSeries = useMemo<ActivityBarPoint[]>(() => {
    if (trendSeries.length <= 31) {
      return trendSeries.map((point) => ({
        label: point.label,
        fullLabel: point.fullLabel,
        total: point.total,
      }));
    }

    const weekly: ActivityBarPoint[] = [];
    for (let index = 0; index < trendSeries.length; index += 7) {
      const chunk = trendSeries.slice(index, index + 7);
      weekly.push({
        label: chunk[0].label,
        fullLabel: `${chunk[0].label} – ${chunk[chunk.length - 1].label}`,
        total: chunk.reduce((sum, item) => sum + item.total, 0),
      });
    }
    return weekly;
  }, [trendSeries]);

  const distribution = useMemo<ActivitySlice[]>(() => {
    const totals = { pembayaran: 0, pekerjaan: 0, payout: 0, komisi: 0 };
    periodActivities.forEach((item) => {
      if (item.category === "Pembayaran Masuk") totals.pembayaran += 1;
      else if (item.category === "Pekerjaan") totals.pekerjaan += 1;
      else if (item.category === "Payout Buzzer") totals.payout += 1;
      else totals.komisi += 1;
    });
    return [
      { name: "Pembayaran Masuk", value: totals.pembayaran, color: CHART_COLORS.blue },
      { name: "Pekerjaan", value: totals.pekerjaan, color: CHART_COLORS.violet },
      { name: "Payout Buzzer", value: totals.payout, color: CHART_COLORS.cyan },
      { name: "Komisi Admin", value: totals.komisi, color: CHART_COLORS.pink },
    ];
  }, [periodActivities]);

  const totalInRange = periodActivities.length;

  const financials = useMemo(() => {
    const result = { incoming: 0, payout: 0, commission: 0 };
    periodActivities.forEach((item) => {
      if (
        item.category === "Pembayaran Masuk" &&
        (item.status === "Lunas" || item.status === "Berhasil")
      ) {
        result.incoming += item.amount || 0;
      } else if (item.category === "Payout Buzzer") {
        result.payout += item.amount || 0;
      } else if (item.category === "Komisi Admin") {
        result.commission += item.amount || 0;
      }
    });
    return result;
  }, [periodActivities]);

  /* ------------------------- metrik kartu ------------------------- */
  const metrics = useMemo(() => {
    const paymentsInRange = payments.filter((payment) =>
      inRange(payment.paid_at ?? payment.created_at, range),
    );
    const paymentsPrev = payments.filter((payment) =>
      inRange(payment.paid_at ?? payment.created_at, previousRange),
    );

    const buzzersInRange = new Set<string>();
    const buzzersPrev = new Set<string>();
    jobs.forEach((job) => {
      if (!job.buzzer_email) return;
      const email = job.buzzer_email.trim().toLowerCase();
      if (inRange(job.updated_at, range)) buzzersInRange.add(email);
      if (inRange(job.updated_at, previousRange)) buzzersPrev.add(email);
    });

    const usersInRange = accounts.filter(
      (account) =>
        account.role !== "admin" && account.created_at && inRange(account.created_at, range),
    );
    const usersPrev = accounts.filter(
      (account) =>
        account.role !== "admin" &&
        account.created_at &&
        inRange(account.created_at, previousRange),
    );

    const transactionAmount = paymentsInRange.reduce(
      (sum, payment) => sum + Number(payment.amount ?? 0),
      0,
    );
    const activeCampaigns = campaigns.filter((campaign) => campaign.status === "Aktif").length;

    return {
      total: buildDelta(totalInRange, previousActivities.length),
      transactions: buildDelta(paymentsInRange.length, paymentsPrev.length),
      buzzers: buildDelta(buzzersInRange.size, buzzersPrev.size),
      users: buildDelta(usersInRange.length, usersPrev.length),
      transactionAmount,
      activeCampaigns,
      buzzerCount: buzzersInRange.size,
      userCount: usersInRange.length,
    };
  }, [
    payments,
    jobs,
    accounts,
    campaigns,
    range,
    previousRange,
    totalInRange,
    previousActivities,
    inRange,
  ]);

  /* ---------------------- filter tabel lama ---------------------- */
  const statusOptions = useMemo(() => {
    const set = new Set<string>();
    periodActivities.forEach((item) => {
      if (item.status && item.status !== "Semua" && item.status !== "Filter Status") {
        set.add(item.status);
      }
    });
    const standardStatuses = [
      "Berhasil",
      "Lunas",
      "Selesai",
      "Menunggu Verifikasi",
      "Ditolak",
      "Refund",
      "Gagal",
    ];
    standardStatuses.forEach((item) => set.add(item));
    return Array.from(set);
  }, [periodActivities]);

  const filtered = useMemo(
    () =>
      periodActivities.filter((item) => {
        const haystack = `${item.actor} ${item.title} ${item.reference}`.toLowerCase();
        return (
          (!category || category === "Semua" || item.category === category) &&
          (!status || status === "Semua" || item.status === status) &&
          (!query || haystack.includes(query.toLowerCase())) &&
          (!date || item.time.slice(0, 10) === date)
        );
      }),
    [periodActivities, category, status, query, date],
  );

  useEffect(() => {
    setPage(1);
  }, [category, status, query, date, period, customFrom, customTo]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const paginatedActivities = useMemo(() => {
    const start = (safePage - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, safePage]);

  const loading = paymentsLoading || jobsLoading || campaignsLoading || accountsLoading;
  const loadError = jobsError || campaignsError || accountsError;

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([refetchPayments(), refetchJobs(), refetchCampaigns(), loadAccounts()]);
      toast.success("Data aktivitas berhasil diperbarui");
    } catch {
      toast.error("Gagal memperbarui data aktivitas");
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleDeleteActivity = async (item: ActivityRow) => {
    const nextDeleted = [...deletedIds, item.id];
    setDeletedIds(nextDeleted);
    try {
      localStorage.setItem("buzzhub.deleted_activities", JSON.stringify(nextDeleted));
    } catch (error) {
      console.warn("Gagal menyimpan deleted_activities ke localStorage:", error);
    }

    try {
      const rawId = item.id.replace(/^(payment|job|payout|commission)-/, "");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabase as any).from("finance_activity").delete().eq("ref_id", rawId);
    } catch (error) {
      console.warn("Gagal menghapus dari finance_activity:", error);
    }

    toast.success(`Aktivitas "${item.title}" berhasil dihapus.`);
    setDeleteConfirm(null);
    setSelected(null);
  };

  const trendEmpty = !loading && totalInRange === 0;
  const chartError = loadError
    ? typeof loadError === "string"
      ? loadError
      : "Sebagian data gagal dimuat dari server."
    : null;

  return (
    <div className="space-y-6">
      {/* ------------------- filter periode + refresh ------------------- */}
      <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-3 shadow-sm sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:p-4">
        <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
          <div className="inline-flex w-full shrink-0 rounded-xl border border-border bg-muted/50 p-1 sm:w-auto">
            {PERIOD_OPTIONS.map((option) => (
              <button
                key={option.key}
                type="button"
                onClick={() => setPeriod(option.key)}
                className={cn(
                  "flex-1 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors sm:flex-none",
                  period === option.key
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground",
                )}
                aria-pressed={period === option.key}
              >
                {option.label}
              </button>
            ))}
          </div>

          {period === "custom" && (
            <div className="flex items-center gap-2">
              <Input
                type="date"
                aria-label="Tanggal mulai"
                value={customFrom}
                max={customTo || undefined}
                onChange={(event) => setCustomFrom(event.target.value)}
                className="h-9 w-full text-xs sm:w-[142px]"
              />
              <span className="text-xs text-muted-foreground">–</span>
              <Input
                type="date"
                aria-label="Tanggal akhir"
                value={customTo}
                min={customFrom || undefined}
                onChange={(event) => setCustomTo(event.target.value)}
                className="h-9 w-full text-xs sm:w-[142px]"
              />
            </div>
          )}

          <p className="hidden items-center gap-1.5 text-xs text-muted-foreground sm:flex">
            <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
            {rangeLabel(range.from, range.to)}
          </p>
        </div>

        <div className="flex items-center justify-between gap-2 sm:justify-end">
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground sm:hidden">
            <CalendarDays className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            {rangeLabel(range.from, range.to)}
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="h-9 shrink-0 gap-1.5"
            title="Muat ulang data aktivitas"
          >
            <RefreshCw
              className={cn("h-4 w-4", isRefreshing && "animate-spin")}
              aria-hidden="true"
            />
            Refresh
          </Button>
        </div>
      </div>

      {/* ------------------------- kartu metrik ------------------------- */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-5">
        {loading ? (
          Array.from({ length: 5 }).map((_, index) => (
            <ChartSkeleton key={index} className="h-[118px] rounded-2xl" />
          ))
        ) : (
          <>
            <ActivityMetricCard
              label="Total Aktivitas"
              value={totalInRange.toLocaleString("id-ID")}
              hint="event pada periode"
              icon={<Activity className="h-4 w-4" />}
              accent="blue"
              deltaText={metrics.total.text}
              deltaDirection={metrics.total.direction}
            />
            <ActivityMetricCard
              label="Transaksi Masuk"
              value={metrics.transactionAmount > 0 ? formatIDR(metrics.transactionAmount) : "Rp 0"}
              hint={`${payments.filter((p) => inRange(p.paid_at ?? p.created_at, range)).length.toLocaleString("id-ID")} pembayaran`}
              icon={<TrendingUp className="h-4 w-4" />}
              accent="violet"
              deltaText={metrics.transactions.text}
              deltaDirection={metrics.transactions.direction}
            />
            <ActivityMetricCard
              label="Buzzer Aktif"
              value={metrics.buzzerCount.toLocaleString("id-ID")}
              hint="buzzer dengan aktivitas"
              icon={<Users className="h-4 w-4" />}
              accent="cyan"
              deltaText={metrics.buzzers.text}
              deltaDirection={metrics.buzzers.direction}
            />
            <ActivityMetricCard
              label="Pengguna Baru"
              value={metrics.userCount.toLocaleString("id-ID")}
              hint="akun terdaftar"
              icon={<UserPlus className="h-4 w-4" />}
              accent="pink"
              deltaText={metrics.users.text}
              deltaDirection={metrics.users.direction}
            />
            <ActivityMetricCard
              label="Kampanye Aktif"
              value={metrics.activeCampaigns.toLocaleString("id-ID")}
              hint="status saat ini"
              icon={<Megaphone className="h-4 w-4" />}
              accent="indigo"
            />
          </>
        )}
      </div>

      <p className="-mt-3 text-[11px] text-muted-foreground">
        Persentase perubahan dihitung terhadap periode sebelumnya (
        {rangeLabel(previousRange.from, previousRange.to)}).
      </p>

      {chartError && (
        <div
          role="alert"
          className="flex flex-col gap-2 rounded-2xl border border-rose-200 bg-rose-50/70 p-4 text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-200 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="min-w-0">
            <p className="text-sm font-semibold">Sebagian data aktivitas gagal dimuat</p>
            <p className="mt-0.5 text-xs opacity-90">
              {chartError} — angka pada kartu di atas bisa jadi belum lengkap.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="h-9 shrink-0 gap-1.5 border-rose-300 text-rose-700 hover:bg-rose-100 dark:border-rose-500/40 dark:text-rose-200 dark:hover:bg-rose-500/20"
          >
            <RefreshCw
              className={cn("h-4 w-4", isRefreshing && "animate-spin")}
              aria-hidden="true"
            />
            Coba lagi
          </Button>
        </div>
      )}

      {/* --------------------- grafik tren aktivitas --------------------- */}
      <ChartCard
        title="Tren Aktivitas"
        description="Jumlah aktivitas harian pada periode terpilih"
        action={
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
              <span className="h-2 w-2 rounded-full bg-violet-500" aria-hidden="true" />
              Aktivitas
            </span>
            <span className="rounded-full border border-border bg-muted/40 px-2.5 py-1 text-[11px] font-semibold tabular-nums text-foreground">
              {totalInRange.toLocaleString("id-ID")} total
            </span>
          </div>
        }
      >
        {chartError ? (
          <ChartErrorState compact message={chartError} />
        ) : trendEmpty ? (
          <ChartEmptyState message="Belum ada aktivitas pada periode ini. Coba pilih rentang tanggal lain." />
        ) : (
          <ActivityTrendChart data={trendSeries} loading={loading} />
        )}
      </ChartCard>

      {/* ------------------ donut + bar (satu baris) ------------------ */}
      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard
          title="Distribusi Aktivitas"
          description="Komposisi jenis aktivitas pada periode terpilih"
        >
          {chartError ? (
            <ChartErrorState compact message={chartError} />
          ) : trendEmpty ? (
            <ChartEmptyState message="Belum ada aktivitas untuk dihitung distribusinya." />
          ) : (
            <>
              <ActivityDistributionChart
                data={distribution}
                total={totalInRange}
                loading={loading}
              />
              <div className="mt-4 grid grid-cols-2 gap-2 border-t border-border/70 pt-3 text-[11px]">
                <div>
                  <p className="text-muted-foreground">Payout buzzer</p>
                  <p className="font-semibold tabular-nums text-foreground">
                    {formatIDR(financials.payout)}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Komisi admin</p>
                  <p className="font-semibold tabular-nums text-foreground">
                    {formatIDR(financials.commission)}
                  </p>
                </div>
              </div>
            </>
          )}
        </ChartCard>

        <ChartCard
          title="Perbandingan Aktivitas"
          description={
            trendSeries.length > 31
              ? "Total aktivitas per minggu pada periode terpilih"
              : "Total aktivitas per hari pada periode terpilih"
          }
        >
          {chartError ? (
            <ChartErrorState compact message={chartError} />
          ) : trendEmpty ? (
            <ChartEmptyState message="Belum ada aktivitas untuk dibandingkan." />
          ) : (
            <ActivityComparisonChart data={barSeries} loading={loading} />
          )}
        </ChartCard>
      </div>

      {/* ------------------------- tabel aktivitas ------------------------- */}
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <div className="flex flex-col gap-3 border-b border-border/70 p-4 lg:flex-row lg:items-center">
          <div className="relative min-w-0 flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Cari customer, buzzer, invoice, campaign..."
              className="pl-9"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-center">
            <Select value={category} onValueChange={(value) => setCategory(value)}>
              <SelectTrigger className="h-10 w-full min-w-0 bg-background text-foreground data-[placeholder]:text-foreground sm:w-auto sm:min-w-[150px]">
                <SelectValue placeholder="Filter Aktivitas" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={status} onValueChange={(value) => setStatus(value)}>
              <SelectTrigger className="h-10 w-full min-w-0 bg-background text-foreground data-[placeholder]:text-foreground sm:w-auto sm:min-w-[140px]">
                <SelectValue placeholder="Filter Status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              type="date"
              className="col-span-2 h-10 w-full sm:col-span-1 sm:w-auto"
              aria-label="Filter tanggal"
              value={date}
              onChange={(event) => setDate(event.target.value)}
            />
          </div>
        </div>

        <div className="hidden overflow-x-auto md:block">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Jenis</TableHead>
                <TableHead>Aktor</TableHead>
                <TableHead>Aktivitas</TableHead>
                <TableHead>Campaign/Invoice</TableHead>
                <TableHead>Nominal</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Waktu</TableHead>
                <TableHead>Aksi/Detail</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading && (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="py-10 text-center text-sm text-muted-foreground"
                  >
                    Memuat aktivitas dari Supabase...
                  </TableCell>
                </TableRow>
              )}
              {!loading && filtered.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="py-10 text-center text-sm text-muted-foreground"
                  >
                    <span className="inline-flex flex-col items-center gap-1">
                      <Inbox className="h-5 w-5" aria-hidden="true" />
                      {chartError
                        ? "Data aktivitas gagal dimuat. Gunakan tombol Coba lagi untuk mengulang."
                        : "Belum ada data aktivitas pada periode ini."}
                    </span>
                  </TableCell>
                </TableRow>
              )}
              {!loading &&
                paginatedActivities.map((item) => (
                  <TableRow key={item.id} className="hover:bg-muted/40">
                    <TableCell>
                      <span className="inline-flex items-center rounded-full bg-muted px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                        {item.category}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{item.actor}</div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{item.title}</div>
                      <div className="text-xs text-muted-foreground">{item.reference}</div>
                    </TableCell>
                    <TableCell className="text-xs">{item.reference}</TableCell>
                    <TableCell className="font-semibold">{formatIDR(item.amount)}</TableCell>
                    <TableCell>
                      <span
                        className={cn(
                          "inline-flex min-w-[5.5rem] justify-center whitespace-nowrap rounded-full px-2 py-1 text-[10px] font-semibold",
                          statusClass(item.status),
                        )}
                      >
                        {statusLabel(item.status)}
                      </span>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {formatDate(item.time)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          title="Detail"
                          onClick={() => setSelected(item)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="text-muted-foreground hover:text-destructive"
                          title="Hapus Aktivitas"
                          onClick={() => setDeleteConfirm(item)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>

        {/* Tampilan kartu untuk layar kecil */}
        <div className="md:hidden">
          {loading && (
            <p className="py-10 text-center text-sm text-muted-foreground">
              Memuat aktivitas dari Supabase...
            </p>
          )}
          {!loading && filtered.length === 0 && (
            <div className="flex flex-col items-center gap-1 rounded-xl border border-dashed border-border/70 bg-muted/20 px-4 py-10 text-center text-sm text-muted-foreground">
              <Inbox className="h-5 w-5" aria-hidden="true" />
              {chartError
                ? "Data aktivitas gagal dimuat. Gunakan tombol Coba lagi untuk mengulang."
                : "Belum ada data aktivitas pada periode ini."}
            </div>
          )}
          {!loading && paginatedActivities.length > 0 && (
            <ul className="space-y-2">
              {paginatedActivities.map((item) => (
                <li key={item.id} className="rounded-xl border border-border bg-card p-3">
                  <div className="flex items-start justify-between gap-2">
                    <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                      {item.category}
                    </span>
                    <span
                      className={cn(
                        "inline-flex shrink-0 justify-center whitespace-nowrap rounded-full px-2 py-0.5 text-[10px] font-semibold",
                        statusClass(item.status),
                      )}
                    >
                      {statusLabel(item.status)}
                    </span>
                  </div>
                  <p className="mt-2 text-sm font-medium leading-snug">{item.title}</p>
                  <p className="mt-0.5 truncate text-[11px] text-muted-foreground">
                    {item.reference}
                  </p>
                  <div className="mt-2.5 flex items-end justify-between gap-2 border-t border-border/70 pt-2.5">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold tabular-nums">{formatIDR(item.amount)}</p>
                      <p className="mt-0.5 truncate text-[11px] text-muted-foreground">
                        {item.actor} · {formatDate(item.time)}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-0.5">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8"
                        title="Detail"
                        onClick={() => setSelected(item)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        title="Hapus Aktivitas"
                        onClick={() => setDeleteConfirm(item)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        <TablePagination
          currentPage={safePage}
          totalItems={filtered.length}
          pageSize={PAGE_SIZE}
          onPageChange={setPage}
        />
      </div>

      {/* Modal Detail Aktivitas */}
      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Detail Aktivitas</DialogTitle>
            <DialogDescription>{selected?.category}</DialogDescription>
          </DialogHeader>
          {selected && (
            <div className="space-y-2 rounded-xl border border-border p-4 text-sm">
              <div className="flex justify-between gap-3">
                <span className="text-muted-foreground">Aktor</span>
                <b>{selected.actor}</b>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-muted-foreground">Aktivitas</span>
                <span className="text-right">{selected.title}</span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-muted-foreground">Campaign/Invoice</span>
                <span>{selected.reference}</span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-muted-foreground">Nominal</span>
                <b>{formatIDR(selected.amount)}</b>
              </div>
              {selected.split && (
                <>
                  <div className="flex justify-between gap-3">
                    <span className="text-muted-foreground">Level Buzzer</span>
                    <b>{selected.split.level}</b>
                  </div>
                  <div className="flex justify-between gap-3">
                    <span className="text-muted-foreground">Bagian Buzzer</span>
                    <b>
                      {formatIDR(selected.split.buzzerAmount)} ({selected.split.buzzerPercentage}%)
                    </b>
                  </div>
                  <div className="flex justify-between gap-3">
                    <span className="text-muted-foreground">Bagian Admin</span>
                    <b>
                      {formatIDR(selected.split.adminAmount)} ({selected.split.adminPercentage}%)
                    </b>
                  </div>
                </>
              )}
              <div className="flex justify-between gap-3">
                <span className="text-muted-foreground">Status</span>
                <span>{selected.status}</span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-muted-foreground">Waktu</span>
                <span>{formatDate(selected.time)}</span>
              </div>
              {selected.category === "Pembayaran Masuk" &&
                selected.detail &&
                "invoice_no" in selected.detail && (
                  <>
                    <div className="flex justify-between gap-3">
                      <span className="text-muted-foreground">Metode</span>
                      <span>{selected.detail.method}</span>
                    </div>
                    <div className="flex justify-between gap-3">
                      <span className="text-muted-foreground">ID transaksi</span>
                      <span>{selected.detail.id}</span>
                    </div>
                  </>
                )}
            </div>
          )}
          <DialogFooter className="flex flex-row items-center justify-between gap-2 sm:justify-between">
            <Button
              type="button"
              variant="destructive"
              onClick={() => setDeleteConfirm(selected)}
              className="gap-1.5"
            >
              <Trash2 className="h-4 w-4" />
              Hapus
            </Button>
            <Button type="button" variant="outline" onClick={() => setSelected(null)}>
              Tutup
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog Hapus Aktivitas */}
      <AlertDialog open={!!deleteConfirm} onOpenChange={(open) => !open && setDeleteConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Aktivitas?</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus aktivitas <b>{deleteConfirm?.title}</b> dari riwayat
              aktivitas?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteConfirm && handleDeleteActivity(deleteConfirm)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 gap-1.5"
            >
              <Trash2 className="h-4 w-4" />
              Ya, Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
