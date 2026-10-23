import { useEffect, useMemo, useState } from "react";
import { Search, Eye, RefreshCw, Trash2, Activity, ArrowDownLeft, ArrowUpRight, Percent } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { StatCard } from "@/components/dashboard-shell";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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
import { calculateCampaignJobSplit, useCampaignJobs, useCompletedCampaignJobs, type CampaignJob } from "@/lib/campaign-store";
import { usePayments, formatIDR, formatDate, type Payment } from "@/lib/finance-store";
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

const categories = ["Pekerjaan", "Pembayaran Masuk", "Payout Buzzer", "Komisi Admin"] as const;

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

export function PencairanSection() {
  const { data: payments, loading: paymentsLoading, refetch: refetchPayments } = usePayments();
  const { data: jobs, loading: jobsLoading, refetch: refetchJobs } = useCompletedCampaignJobs();
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
      .filter((job) => (job.status === "Selesai" || Boolean(job.admin_verified_at)) && job.buzzer_email)
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

  const visibleActivities = useMemo(() => {
    return activities.filter((item) => !deletedIds.includes(item.id));
  }, [activities, deletedIds]);

  const statusOptions = useMemo(() => {
    const set = new Set<string>();
    visibleActivities.forEach((item) => {
      if (item.status && item.status !== "Semua" && item.status !== "Filter Status") {
        set.add(item.status);
      }
    });
    const standardStatuses = ["Berhasil", "Lunas", "Selesai", "Menunggu Verifikasi", "Ditolak", "Refund", "Gagal"];
    standardStatuses.forEach((s) => set.add(s));
    return Array.from(set);
  }, [visibleActivities]);

  const filtered = useMemo(
    () =>
      visibleActivities.filter((item) => {
        const haystack = `${item.actor} ${item.title} ${item.reference}`.toLowerCase();
        return (
          (!category || category === "Semua" || item.category === category) &&
          (!status || status === "Semua" || item.status === status) &&
          (!query || haystack.includes(query.toLowerCase())) &&
          (!date || item.time.slice(0, 10) === date)
        );
      }),
    [visibleActivities, category, status, query, date],
  );

  useEffect(() => {
    setPage(1);
  }, [category, status, query, date]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const paginatedActivities = useMemo(() => {
    const start = (safePage - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, safePage]);

  const loading = paymentsLoading || jobsLoading;
  const handleRefresh = async () => {
    setIsRefreshing(true);
    setCategory("");
    setStatus("");
    setQuery("");
    setDate("");
    setPage(1);
    try {
      await Promise.all([refetchPayments(), refetchJobs()]);
      toast.success("Aktivitas & filter berhasil diperbarui");
    } catch {
      toast.error("Gagal memperbarui aktivitas");
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleDeleteActivity = async (item: ActivityRow) => {
    const nextDeleted = [...deletedIds, item.id];
    setDeletedIds(nextDeleted);
    try {
      localStorage.setItem("buzzhub.deleted_activities", JSON.stringify(nextDeleted));
    } catch (e) {
      console.warn("Gagal menyimpan deleted_activities ke localStorage:", e);
    }

    try {
      const rawId = item.id.replace(/^(payment|job|payout|commission)-/, "");
      await (supabase as any).from("finance_activity").delete().eq("ref_id", rawId);
    } catch (e) {
      console.warn("Gagal menghapus dari finance_activity:", e);
    }

    toast.success(`Aktivitas "${item.title}" berhasil dihapus.`);
    setDeleteConfirm(null);
    setSelected(null);
  };

  const totalIncoming = useMemo(() => {
    return visibleActivities
      .filter((a) => a.category === "Pembayaran Masuk" && (a.status === "Lunas" || a.status === "Berhasil"))
      .reduce((s, a) => s + (a.amount || 0), 0);
  }, [visibleActivities]);

  const totalPayout = useMemo(() => {
    return visibleActivities
      .filter((a) => a.category === "Payout Buzzer")
      .reduce((s, a) => s + (a.amount || 0), 0);
  }, [visibleActivities]);

  const totalCommission = useMemo(() => {
    return visibleActivities
      .filter((a) => a.category === "Komisi Admin")
      .reduce((s, a) => s + (a.amount || 0), 0);
  }, [visibleActivities]);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Aktivitas"
          value={visibleActivities.length.toString()}
          hint="Semua riwayat transaksi & event"
          icon={<Activity className="h-5 w-5" />}
        />
        <StatCard
          label="Pembayaran Masuk"
          value={formatIDR(totalIncoming)}
          hint="Dana customer terverifikasi"
          icon={<ArrowDownLeft className="h-5 w-5" />}
        />
        <StatCard
          label="Payout Buzzer"
          value={formatIDR(totalPayout)}
          hint="Dibayarkan ke buzzer"
          icon={<ArrowUpRight className="h-5 w-5" />}
        />
        <StatCard
          label="Komisi Admin"
          value={formatIDR(totalCommission)}
          hint="Pendapatan bersih platform"
          icon={<Percent className="h-5 w-5" />}
        />
      </div>

      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm">
        <div className="relative min-w-56 flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Cari customer, buzzer, invoice, campaign..."
            className="pl-9"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
        <Select value={category} onValueChange={(val) => setCategory(val)}>
          <SelectTrigger className="h-10 w-auto min-w-[160px] bg-background text-foreground data-[placeholder]:text-foreground">
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
        <Select value={status} onValueChange={(val) => setStatus(val)}>
          <SelectTrigger className="h-10 w-auto min-w-[150px] bg-background text-foreground data-[placeholder]:text-foreground">
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
        <Input type="date" className="w-auto" value={date} onChange={(event) => setDate(event.target.value)} />
        <Button
          variant="outline"
          size="icon"
          onClick={handleRefresh}
          disabled={isRefreshing}
          title="Refresh aktivitas & reset filter"
          className="h-10 w-10 shrink-0"
        >
          <RefreshCw className={cn("h-4 w-4", isRefreshing && "animate-spin")} />
        </Button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <div className="overflow-x-auto">
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
                  <TableCell colSpan={8} className="py-10 text-center text-sm text-muted-foreground">
                    Memuat aktivitas dari Supabase...
                  </TableCell>
                </TableRow>
              )}
              {!loading && filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="py-10 text-center text-sm text-muted-foreground">
                    Belum ada data aktivitas.
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
                    <TableCell className="text-xs text-muted-foreground">{formatDate(item.time)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button size="icon" variant="ghost" title="Detail" onClick={() => setSelected(item)}>
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
              {selected.category === "Pembayaran Masuk" && selected.detail && "invoice_no" in selected.detail && (
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
              Apakah Anda yakin ingin menghapus aktivitas <b>{deleteConfirm?.title}</b> dari riwayat aktivitas?
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
