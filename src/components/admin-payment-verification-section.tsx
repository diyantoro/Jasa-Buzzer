import { useEffect, useMemo, useState } from "react";
import {
  Check, CreditCard, Eye, Filter, Loader2, Megaphone, Pencil, RefreshCw,
  Save, Search, Trash2, Wallet, X, FileSpreadsheet, FileDown, DollarSign,
  ArrowDownLeft, Building2, Smartphone, Calendar, Clock, CheckCircle2
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { TablePagination } from "@/components/table-pagination";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { StatCard, StatusBadge } from "@/components/dashboard-shell";
import {
  usePayments, approvePayment, rejectPayment, updatePayment, deletePayment,
  formatDate, formatIDR, type Payment, type PaymentStatus,
} from "@/lib/finance-store";
import { calculateCampaignJobSplit, useCampaignJobs, useCampaigns } from "@/lib/campaign-store";
import { useAdminWallet } from "@/lib/admin-wallet-store";
import { exportToExcel, exportToPDF } from "@/lib/export-utils";
import { notifyCustomerPaymentApproved, notifyCustomerPaymentRejected } from "@/lib/customer-store";

type PaymentFilter = "pending" | "approved" | "rejected" | "semua";

const isPendingPayment = (status: string) =>
  ["menunggu verifikasi", "verifikasi", "pending", "menunggu pembayaran", "belum dibayar"].includes(
    (status || "").toLowerCase().trim()
  );

const isApprovedPayment = (status: string) =>
  ["berhasil", "lunas", "sukses"].includes((status || "").toLowerCase().trim());

const isRejectedPayment = (status: string) =>
  ["gagal", "refund", "ditolak", "batal", "dibatalkan"].includes((status || "").toLowerCase().trim());

function statusClass(status: string) {
  if (status === "Menunggu Verifikasi" || status === "Verifikasi") {
    return "bg-amber-500/10 text-amber-600 border border-amber-500/30 font-semibold";
  }
  if (["Berhasil", "Lunas"].includes(status)) {
    return "bg-emerald-500/10 text-emerald-600 border border-emerald-500/30 font-semibold";
  }
  if (["Gagal", "Refund"].includes(status)) {
    return "bg-rose-500/10 text-rose-600 border border-rose-500/30 font-semibold";
  }
  return "bg-muted text-muted-foreground";
}

function statusLabel(status: string) {
  return status === "Menunggu Verifikasi" ? "Verifikasi" : status;
}

export function AdminPaymentVerificationSection() {
  const { data: payments, loading, refetch } = usePayments();
  const { data: jobs, loading: jobsLoading } = useCampaignJobs();
  const { data: campaigns } = useCampaigns();
  const adminWallet = useAdminWallet();

  const loadingData = loading || jobsLoading;
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Payment | null>(null);
  const [rejecting, setRejecting] = useState<Payment | null>(null);
  const [reason, setReason] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [approving, setApproving] = useState<Payment | null>(null);

  const selectedJobSplits = useMemo(() => {
    if (!selected?.campaign_id) return [];
    return jobs
      .filter((job) => job.campaign_id === selected.campaign_id && job.buzzer_email)
      .map((job) => ({ job, split: calculateCampaignJobSplit(job) }));
  }, [jobs, selected]);

  const [paymentFilter, setPaymentFilter] = useState<PaymentFilter>("semua");

  const pendingPayments = useMemo(
    () => payments.filter((payment) => isPendingPayment(payment.status)),
    [payments]
  );
  const approvedPayments = useMemo(
    () => payments.filter((payment) => isApprovedPayment(payment.status)),
    [payments]
  );
  const rejectedPayments = useMemo(
    () => payments.filter((payment) => isRejectedPayment(payment.status)),
    [payments]
  );

  const pendingTotalAmount = useMemo(
    () => pendingPayments.reduce((sum, p) => sum + Number(p.amount || 0), 0),
    [pendingPayments]
  );
  const approvedTotalAmount = useMemo(
    () => approvedPayments.reduce((sum, p) => sum + Number(p.amount || 0), 0),
    [approvedPayments]
  );

  const filteredPayments = useMemo(() => {
    return payments.filter((payment) => {
      if (paymentFilter === "pending" && !isPendingPayment(payment.status)) return false;
      if (paymentFilter === "approved" && !isApprovedPayment(payment.status)) return false;
      if (paymentFilter === "rejected" && !isRejectedPayment(payment.status)) return false;

      if (query.trim()) {
        const target = `${payment.invoice_no} ${payment.customer_name} ${payment.customer_email || ""} ${payment.campaign_name} ${payment.method}`.toLowerCase();
        if (!target.includes(query.toLowerCase())) return false;
      }
      return true;
    });
  }, [payments, paymentFilter, query]);

  const [paymentPage, setPaymentPage] = useState(1);
  const PAYMENT_PAGE_SIZE = 8;

  useEffect(() => {
    setPaymentPage(1);
  }, [paymentFilter, query]);

  const totalPaymentPages = Math.max(1, Math.ceil(filteredPayments.length / PAYMENT_PAGE_SIZE));
  const safePaymentPage = Math.min(Math.max(1, paymentPage), totalPaymentPages);
  const paginatedPayments = useMemo(() => {
    const start = (safePaymentPage - 1) * PAYMENT_PAGE_SIZE;
    return filteredPayments.slice(start, start + PAYMENT_PAGE_SIZE);
  }, [filteredPayments, safePaymentPage]);

  const approve = async (payment: Payment) => {
    setBusyId(payment.id);
    try {
      await approvePayment(payment.id);
      await notifyCustomerPaymentApproved(payment.customer_email, payment.campaign_name, payment.invoice_no);
      await refetch();
      toast.success(`Pembayaran ${payment.invoice_no} berhasil diverifikasi.`);
      setApproving(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Pembayaran gagal disetujui.");
    } finally {
      setBusyId(null);
    }
  };

  const reject = async () => {
    if (!rejecting || !reason.trim()) return;
    setBusyId(rejecting.id);
    try {
      await rejectPayment(rejecting.id, reason);
      await notifyCustomerPaymentRejected(rejecting.customer_email, rejecting.campaign_name, reason, rejecting.invoice_no);
      await refetch();
      toast.success(`Pembayaran ${rejecting.invoice_no} ditolak.`);
      setRejecting(null);
      setReason("");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Pembayaran gagal ditolak.");
    } finally {
      setBusyId(null);
    }
  };

  // Edit & Delete Payment state
  const [editPayment, setEditPayment] = useState<Payment | null>(null);
  const [editPaymentForm, setEditPaymentForm] = useState<{
    amount: number;
    method: string;
    note: string;
    status: PaymentStatus;
  }>({
    amount: 0,
    method: "BCA Transfer",
    note: "",
    status: "Lunas",
  });
  const [isSavingPayment, setIsSavingPayment] = useState(false);

  const [deletingPayment, setDeletingPayment] = useState<Payment | null>(null);
  const [isDeletingPayment, setIsDeletingPayment] = useState(false);

  const handleOpenEditPayment = (p: Payment) => {
    setEditPaymentForm({
      amount: Number(p.amount || 0),
      method: p.method || "BCA Transfer",
      note: p.note || "",
      status: (p.status as PaymentStatus) || "Lunas",
    });
    setEditPayment(p);
  };

  const handleSaveEditPayment = async () => {
    if (!editPayment) return;
    if (!editPaymentForm.amount || editPaymentForm.amount <= 0) {
      toast.error("Nominal pembayaran harus lebih besar dari 0.");
      return;
    }
    setIsSavingPayment(true);
    try {
      await updatePayment(editPayment.id, {
        amount: Number(editPaymentForm.amount),
        method: editPaymentForm.method,
        note: editPaymentForm.note.trim() || null,
        status: editPaymentForm.status,
      });
      await refetch();
      toast.success("Data pembayaran berhasil diperbarui.");
      setEditPayment(null);
      if (selected?.id === editPayment.id) {
        setSelected((prev) => prev ? {
          ...prev,
          amount: Number(editPaymentForm.amount),
          method: editPaymentForm.method,
          note: editPaymentForm.note.trim() || null,
          status: editPaymentForm.status,
        } : null);
      }
    } catch (err: any) {
      toast.error("Gagal memperbarui pembayaran: " + (err?.message || "Terjadi kesalahan"));
    } finally {
      setIsSavingPayment(false);
    }
  };

  const handleConfirmDeletePayment = async () => {
    if (!deletingPayment) return;
    setIsDeletingPayment(true);
    try {
      await deletePayment(deletingPayment.id);
      await refetch();
      toast.success(`Data pembayaran ${deletingPayment.invoice_no} berhasil dihapus.`);
      setDeletingPayment(null);
      if (selected?.id === deletingPayment.id) setSelected(null);
    } catch (err: any) {
      toast.error("Gagal menghapus pembayaran: " + (err?.message || "Terjadi kesalahan"));
    } finally {
      setIsDeletingPayment(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Financial Overview Cards - Khusus Verifikasi Pembayaran Customer */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Total Pembayaran Masuk"
          value={formatIDR(adminWallet.totalIncoming)}
          hint={`${approvedPayments.length} transaksi disetujui`}
          icon={<CreditCard className="h-5 w-5" />}
        />
        <div className="rounded-2xl border border-amber-500/30 bg-card p-5 shadow-sm transition-shadow hover:shadow-md">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium uppercase tracking-wide text-amber-600 dark:text-amber-400">
              Menunggu Verifikasi
            </p>
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-amber-500/15 text-amber-600 dark:text-amber-400">
              <Clock className="h-5 w-5" />
            </span>
          </div>
          <p className="mt-3 font-display text-2xl font-bold text-foreground">
            {pendingPayments.length} Transaksi
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Total {formatIDR(pendingTotalAmount)}
          </p>
        </div>
        <StatCard
          label="Total Komisi Platform"
          value={formatIDR(adminWallet.totalProfit)}
          hint="Omset bersih platform dari campaign"
          icon={<DollarSign className="h-5 w-5" />}
        />
        <StatCard
          label="Pembayaran Ditolak / Gagal"
          value={`${rejectedPayments.length} Transaksi`}
          hint="Transaksi dibatalkan atau bukti tidak valid"
          icon={<X className="h-5 w-5" />}
        />
      </div>

      {/* Main Payment Verification Table Card */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display text-xl font-bold">Daftar Verifikasi Pembayaran</h2>
              {pendingPayments.length > 0 && (
                <span className="rounded-full bg-amber-500/15 text-amber-600 border border-amber-500/30 px-2.5 py-0.5 text-xs font-bold">
                  {pendingPayments.length} Verifikasi
                </span>
              )}
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              Verifikasi transfer pembayaran dari customer sebelum campaign dibuka untuk buzzer.
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={() => void refetch()} disabled={loadingData} className="gap-2 shrink-0">
            <RefreshCw className={`h-4 w-4 ${loadingData ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border pb-4">
              <div className="flex flex-wrap items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                {([
                  ["semua", "Semua", payments.length],
                  ["pending", "Menunggu", pendingPayments.length],
                  ["approved", "Disetujui", approvedPayments.length],
                  ["rejected", "Ditolak", rejectedPayments.length],
                ] as const).map(([value, label, count]) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setPaymentFilter(value)}
                    className={cn(
                      "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                      paymentFilter === value
                        ? "border-transparent gradient-brand text-brand-foreground shadow-sm"
                        : "border-border text-muted-foreground hover:bg-muted hover:text-foreground",
                    )}
                  >
                    {label} <span className="ml-1 opacity-70">({count})</span>
                  </button>
                ))}
              </div>

              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Cari invoice, customer, atau campaign..."
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  className="pl-9 h-9 text-xs"
                />
              </div>
            </div>

            <div className="rounded-xl border border-border overflow-x-auto">
              <Table className="w-full text-xs">
                <TableHeader>
                  <TableRow className="bg-muted/40">
                    <TableHead className="w-[125px] py-2.5 px-3 whitespace-nowrap">Invoice</TableHead>
                    <TableHead className="py-2.5 px-3 min-w-[120px] max-w-[150px]">Customer</TableHead>
                    <TableHead className="py-2.5 px-3 min-w-[100px] max-w-[130px]">Campaign</TableHead>
                    <TableHead className="py-2.5 px-3 min-w-[110px] max-w-[140px]">Metode</TableHead>
                    <TableHead className="py-2.5 px-3 whitespace-nowrap">Nominal</TableHead>
                    <TableHead className="py-2.5 px-3 text-center w-[90px]">Status</TableHead>
                    <TableHead className="py-2.5 px-3 text-right w-[160px] whitespace-nowrap">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedPayments.map((payment) => {
                    return (
                      <TableRow key={payment.id} className="hover:bg-muted/30">
                        <TableCell className="font-mono text-xs font-semibold py-2.5 px-3 whitespace-nowrap">
                          {payment.invoice_no}
                        </TableCell>
                        <TableCell className="py-2.5 px-3">
                          <div className="min-w-0 max-w-[150px]">
                            <p className="font-medium text-foreground truncate">{payment.customer_name}</p>
                            <p className="text-[11px] text-muted-foreground truncate">{payment.customer_email || "-"}</p>
                          </div>
                        </TableCell>
                        <TableCell className="py-2.5 px-3 max-w-[130px]">
                          <p className="truncate font-medium text-foreground" title={payment.campaign_name}>
                            {payment.campaign_name}
                          </p>
                        </TableCell>
                        <TableCell className="py-2.5 px-3 max-w-[140px]">
                          <span className="font-medium truncate block text-foreground" title={payment.method}>
                            {payment.method}
                          </span>
                        </TableCell>
                        <TableCell className="font-semibold text-foreground py-2.5 px-3 whitespace-nowrap">
                          {formatIDR(Number(payment.amount))}
                        </TableCell>
                        <TableCell className="py-2.5 px-3 text-center whitespace-nowrap">
                          <span className={`inline-block rounded-full px-2 py-0.5 text-[11px] ${statusClass(payment.status)}`}>
                            {statusLabel(payment.status)}
                          </span>
                        </TableCell>
                        <TableCell className="text-right py-2.5 px-3 whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-7 w-7 p-0"
                              title="Detail"
                              aria-label="Detail"
                              onClick={() => setSelected(payment)}
                            >
                              <Eye className="h-3.5 w-3.5" />
                            </Button>
                            {isPendingPayment(payment.status) && (
                              <>
                                <Button
                                  size="sm"
                                  className="h-7 w-7 p-0 bg-emerald-600 hover:bg-emerald-700 text-white transition-all"
                                  disabled={busyId === payment.id}
                                  onClick={() => setApproving(payment)}
                                  title="Setujui Pembayaran"
                                  aria-label="Setujui Pembayaran"
                                >
                                  {busyId === payment.id ? (
                                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                  ) : (
                                    <Check className="h-3.5 w-3.5" />
                                  )}
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-7 w-7 p-0 text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition-all"
                                  disabled={busyId === payment.id}
                                  onClick={() => setRejecting(payment)}
                                  title="Tolak Pembayaran"
                                  aria-label="Tolak Pembayaran"
                                >
                                  {busyId === payment.id ? (
                                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                  ) : (
                                    <X className="h-3.5 w-3.5" />
                                  )}
                                </Button>
                              </>
                            )}
                            {isApprovedPayment(payment.status) && (
                              <>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-7 w-7 p-0 text-primary hover:bg-primary/10"
                                  onClick={() => handleOpenEditPayment(payment)}
                                  title="Edit"
                                  aria-label="Edit"
                                >
                                  <Pencil className="h-3 w-3" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-7 w-7 p-0 text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/20"
                                  onClick={() => setDeletingPayment(payment)}
                                  title="Hapus"
                                  aria-label="Hapus"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </>
                            )}
                            {isRejectedPayment(payment.status) && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-7 w-7 p-0 text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/20"
                                onClick={() => setDeletingPayment(payment)}
                                title="Hapus"
                                aria-label="Hapus"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {filteredPayments.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="py-10 text-center text-sm text-muted-foreground"
                      >
                        {query.trim()
                          ? `Tidak ditemukan pembayaran yang sesuai dengan pencarian "${query}".`
                          : paymentFilter === "pending"
                          ? "Belum ada pembayaran yang menunggu verifikasi."
                          : paymentFilter === "approved"
                          ? "Belum ada riwayat pembayaran yang disetujui."
                          : paymentFilter === "rejected"
                          ? "Belum ada pembayaran yang ditolak."
                          : "Tidak ada data pembayaran."}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            <TablePagination
              currentPage={safePaymentPage}
              totalItems={filteredPayments.length}
              pageSize={PAYMENT_PAGE_SIZE}
              onPageChange={setPaymentPage}
            />
          </div>

      {/* ================= MODAL: DETAIL PEMBAYARAN ================= */}
      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Detail Pembayaran</DialogTitle>
            <DialogDescription>
              Detail transaksi pembayaran customer untuk campaign.
            </DialogDescription>
          </DialogHeader>

          {selected && (
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-2 rounded-lg bg-muted/40 p-3 border border-border">
                <div>
                  <span className="text-muted-foreground block text-[11px]">Invoice</span>
                  <span className="font-mono font-semibold">{selected.invoice_no}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[11px]">Status</span>
                  <span className={`inline-block rounded-full px-2 py-0.5 text-[11px] mt-0.5 ${statusClass(selected.status)}`}>
                    {selected.status}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[11px]">Customer</span>
                  <span className="font-medium text-foreground">{selected.customer_name}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[11px]">Email Customer</span>
                  <span className="font-medium text-foreground truncate block">{selected.customer_email || "-"}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[11px]">Metode Pembayaran</span>
                  <span className="font-medium text-foreground">{selected.method}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[11px]">Nominal Transaksi</span>
                  <span className="font-bold text-foreground text-sm">{formatIDR(Number(selected.amount))}</span>
                </div>
              </div>

              <div>
                <span className="text-muted-foreground block text-[11px]">Campaign</span>
                <span className="font-semibold text-foreground text-sm block mt-0.5">{selected.campaign_name}</span>
              </div>

              {selected.note && (
                <div className="rounded-lg bg-muted/30 p-2.5 border border-border">
                  <span className="text-muted-foreground block text-[11px]">Catatan / Instruksi</span>
                  <p className="mt-0.5 text-foreground">{selected.note}</p>
                </div>
              )}

              {selected.rejection_reason && (
                <div className="rounded-lg bg-rose-500/10 p-2.5 border border-rose-500/30 text-rose-700 dark:text-rose-300">
                  <span className="font-semibold block text-[11px]">Alasan Penolakan</span>
                  <p className="mt-0.5">{selected.rejection_reason}</p>
                </div>
              )}

              {selectedJobSplits.length > 0 && (
                <div className="space-y-1.5 pt-2 border-t border-border">
                  <h4 className="font-semibold text-foreground">Buzzer Terkait ({selectedJobSplits.length})</h4>
                  <div className="max-h-36 overflow-y-auto space-y-1 pr-1">
                    {selectedJobSplits.map(({ job, split }) => (
                      <div key={job.id} className="flex items-center justify-between p-2 rounded border border-border bg-card">
                        <div>
                          <p className="font-medium text-foreground">{job.buzzer_name || job.buzzer_email}</p>
                          <p className="text-[10px] text-muted-foreground">Level {job.buzzer_level || split.levelName || "Bronze"} · Status: {job.status}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-emerald-600">{formatIDR(split.buzzerShare)}</p>
                          <p className="text-[10px] text-muted-foreground">Admin: {formatIDR(split.adminShare)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setSelected(null)}>Tutup</Button>
            {selected && isPendingPayment(selected.status) && (
              <Button
                className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1"
                disabled={busyId === selected.id}
                onClick={() => {
                  const p = selected;
                  setSelected(null);
                  void approve(p);
                }}
              >
                <Check className="h-4 w-4" /> Setujui Pembayaran
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ================= MODAL: KONFIRMASI SETUJUI PEMBAYARAN ================= */}
      <AlertDialog open={!!approving} onOpenChange={(open) => !open && setApproving(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-emerald-600">
              <Check className="h-5 w-5" /> Setujui Pembayaran?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menyetujui pembayaran invoice <b>{approving?.invoice_no}</b> sebesar <b>{formatIDR(Number(approving?.amount || 0))}</b> dari <b>{approving?.customer_name}</b>?
              <br /><br />
              Setelah disetujui, campaign <b>{approving?.campaign_name}</b> akan otomatis aktif dan terbuka untuk diambil oleh buzzer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
              onClick={() => approving && void approve(approving)}
            >
              Ya, Setujui Pembayaran
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* ================= MODAL: TOLAK PEMBAYARAN ================= */}
      <Dialog open={!!rejecting} onOpenChange={(open) => { if (!open) { setRejecting(null); setReason(""); } }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-rose-600">
              <X className="h-5 w-5" /> Tolak Pembayaran
            </DialogTitle>
            <DialogDescription>
              Berikan alasan penolakan pembayaran untuk invoice <b>{rejecting?.invoice_no}</b>. Customer akan menerima notifikasi alasan ini.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 pt-1">
            <div>
              <Label htmlFor="reject-reason">Alasan Penolakan</Label>
              <Textarea
                id="reject-reason"
                rows={3}
                placeholder="Contoh: Bukti transfer tidak terbaca / nominal tidak sesuai / mutasi belum masuk..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setRejecting(null); setReason(""); }}>Batal</Button>
            <Button
              variant="destructive"
              disabled={!reason.trim() || busyId === rejecting?.id}
              onClick={() => void reject()}
            >
              {busyId === rejecting?.id ? "Memproses..." : "Tolak Pembayaran"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ================= MODAL: EDIT DATA PEMBAYARAN ================= */}
      <Dialog open={!!editPayment} onOpenChange={(open) => !open && setEditPayment(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Pencil className="h-4 w-4 text-primary" /> Edit Data Pembayaran
            </DialogTitle>
            <DialogDescription>
              Perbarui rincian transaksi invoice <b>{editPayment?.invoice_no}</b>.
            </DialogDescription>
          </DialogHeader>

          {editPayment && (
            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <Label htmlFor="edit-nominal">Nominal Pembayaran (Rp)</Label>
                <Input
                  id="edit-nominal"
                  type="number"
                  min={1}
                  value={editPaymentForm.amount || ""}
                  onChange={(e) => setEditPaymentForm({ ...editPaymentForm, amount: Number(e.target.value) })}
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="edit-method">Metode Pembayaran</Label>
                <Input
                  id="edit-method"
                  value={editPaymentForm.method}
                  onChange={(e) => setEditPaymentForm({ ...editPaymentForm, method: e.target.value })}
                  placeholder="Contoh: Transfer Bank BCA / QRIS"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="edit-status">Status Pembayaran</Label>
                <Select
                  value={editPaymentForm.status}
                  onValueChange={(val) => setEditPaymentForm({ ...editPaymentForm, status: val as PaymentStatus })}
                >
                  <SelectTrigger id="edit-status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Lunas">Lunas / Berhasil</SelectItem>
                    <SelectItem value="Menunggu Verifikasi">Menunggu Verifikasi</SelectItem>
                    <SelectItem value="Gagal">Gagal / Ditolak</SelectItem>
                    <SelectItem value="Refund">Refund</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label htmlFor="edit-note">Catatan Transaksi</Label>
                <Textarea
                  id="edit-note"
                  rows={2}
                  value={editPaymentForm.note}
                  onChange={(e) => setEditPaymentForm({ ...editPaymentForm, note: e.target.value })}
                  placeholder="Catatan admin opsional..."
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditPayment(null)} disabled={isSavingPayment}>
              Batal
            </Button>
            <Button onClick={handleSaveEditPayment} disabled={isSavingPayment} className="gap-1.5 gradient-brand text-brand-foreground">
              {isSavingPayment ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
              {isSavingPayment ? "Menyimpan..." : "Simpan Perubahan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ================= MODAL: HAPUS PEMBAYARAN ================= */}
      <AlertDialog open={!!deletingPayment} onOpenChange={(open) => { if (!open && !isDeletingPayment) setDeletingPayment(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-rose-600">
              <Trash2 className="h-5 w-5" /> Hapus Data Pembayaran?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus data pembayaran invoice <b>{deletingPayment?.invoice_no}</b> ({formatIDR(Number(deletingPayment?.amount || 0))}) untuk campaign <b>{deletingPayment?.campaign_name}</b>?
              <br /><br />
              Data yang sudah dihapus tidak dapat dipulihkan kembali dari sistem transaksi.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeletingPayment}>Batal</AlertDialogCancel>
            <Button
              variant="destructive"
              className="gap-1.5"
              disabled={isDeletingPayment}
              onClick={handleConfirmDeletePayment}
            >
              {isDeletingPayment ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Menghapus...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4" />
                  Ya, Hapus Pembayaran
                </>
              )}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
