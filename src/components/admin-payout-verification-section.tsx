import { useEffect, useMemo, useState } from "react";
import {
  Check, CreditCard, Eye, Filter, Loader2, RefreshCw,
  Search, Wallet, X, FileSpreadsheet, FileDown, DollarSign,
  Building2, Smartphone, Calendar, Clock, CheckCircle2,
  AlertCircle, Copy, ExternalLink, ArrowDownToLine,
  User, ShieldCheck, ArrowRight, CornerDownRight,
  Pencil, Trash2
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { TablePagination } from "@/components/table-pagination";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { StatCard, StatusBadge } from "@/components/dashboard-shell";
import {
  useWithdrawals, updateWithdrawalStatus, deleteWithdrawalRecord, editWithdrawalRecord,
  formatDate, formatIDR, type Withdrawal, type WithdrawalStatus
} from "@/lib/finance-store";
import { listAllWithdrawals } from "@/lib/buzzer-store";
import { exportToExcel, exportToPDF } from "@/lib/export-utils";

type PayoutFilter = "all" | "pending" | "approved" | "rejected";

export function AdminPayoutVerificationSection() {
  const { data: dbWithdrawals, loading: dbLoading, refetch } = useWithdrawals();
  const [localWithdrawals, setLocalWithdrawals] = useState(() => {
    try {
      return listAllWithdrawals();
    } catch {
      return [];
    }
  });

  // Sync local withdrawals when external storage changes
  useEffect(() => {
    const handleStorage = () => {
      try {
        setLocalWithdrawals(listAllWithdrawals());
      } catch {
        setLocalWithdrawals([]);
      }
    };
    window.addEventListener("buzzhub:buzzer_updated", handleStorage);
    window.addEventListener("storage", handleStorage);
    return () => {
      window.removeEventListener("buzzhub:buzzer_updated", handleStorage);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  // Merge Supabase withdrawals with local storage withdrawals to ensure all data is visible
  const allWithdrawals = useMemo(() => {
    const map = new Map<string, Withdrawal>();

    // 1. Insert DB withdrawals
    if (Array.isArray(dbWithdrawals)) {
      for (const w of dbWithdrawals) {
        if (w && w.id) map.set(w.id, w);
      }
    }

    // 2. Insert or merge local storage buzzer withdrawals if not yet in DB
    if (Array.isArray(localWithdrawals)) {
      for (const lw of localWithdrawals) {
        if (lw && lw.id && !map.has(lw.id)) {
          map.set(lw.id, {
            id: lw.id,
            buzzer_name: lw.buzzerName || "Buzzer",
            buzzer_email: lw.buzzerEmail || "",
            amount: lw.amount,
            method: lw.method,
            account_no: lw.accountNo || lw.method,
            status: (lw.status === "Pending" ? "Menunggu" : lw.status) as WithdrawalStatus,
            proof_url: lw.proofUrl || null,
            admin_note: lw.adminNote || null,
            requested_at: lw.requestedAt || lw.date,
            approved_at: lw.status === "Berhasil" ? lw.completedAt || lw.date : null,
            completed_at: lw.status === "Berhasil" ? lw.completedAt || lw.date : null,
            created_at: lw.requestedAt || lw.date,
            updated_at: lw.completedAt || lw.date,
          });
        }
      }
    }

    return Array.from(map.values()).sort((a, b) => {
      const timeA = new Date(a.requested_at || a.created_at).getTime();
      const timeB = new Date(b.requested_at || b.created_at).getTime();
      return timeB - timeA;
    });
  }, [dbWithdrawals, localWithdrawals]);

  // Filters & Search
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<PayoutFilter>("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 8;

  // Selected for modals
  const [verifyingItem, setVerifyingItem] = useState<Withdrawal | null>(null);
  const [rejectingItem, setRejectingItem] = useState<Withdrawal | null>(null);
  const [editingItem, setEditingItem] = useState<Withdrawal | null>(null);
  const [deletingItem, setDeletingItem] = useState<Withdrawal | null>(null);

  // Form states for Verification modal (tanpa upload bukti)
  const [adminNote, setAdminNote] = useState<string>("");
  const [isTransferChecked, setIsTransferChecked] = useState<boolean>(false);
  const [actionLoading, setActionLoading] = useState<boolean>(false);

  // Form states for Rejection modal
  const [rejectionReason, setRejectionReason] = useState<string>("");

  // Form states for Edit modal
  const [editStatus, setEditStatus] = useState<WithdrawalStatus>("Menunggu");
  const [editAmount, setEditAmount] = useState<string>("");
  const [editMethod, setEditMethod] = useState<string>("");
  const [editAccountNo, setEditAccountNo] = useState<string>("");
  const [editAdminNote, setEditAdminNote] = useState<string>("");

  const pendingList = useMemo(() => {
    return allWithdrawals.filter((w) => ["menunggu", "pending", "diproses"].includes((w.status || "").toLowerCase()));
  }, [allWithdrawals]);

  const approvedList = useMemo(() => {
    return allWithdrawals.filter((w) => ["berhasil", "disetujui"].includes((w.status || "").toLowerCase()));
  }, [allWithdrawals]);

  const rejectedList = useMemo(() => {
    return allWithdrawals.filter((w) => (w.status || "").toLowerCase() === "ditolak");
  }, [allWithdrawals]);

  const totalPendingAmount = useMemo(
    () => pendingList.reduce((sum, w) => sum + Number(w.amount || 0), 0),
    [pendingList]
  );

  const totalApprovedAmount = useMemo(
    () => approvedList.reduce((sum, w) => sum + Number(w.amount || 0), 0),
    [approvedList]
  );

  const totalRejectedAmount = useMemo(
    () => rejectedList.reduce((sum, w) => sum + Number(w.amount || 0), 0),
    [rejectedList]
  );

  const filteredList = useMemo(() => {
    return allWithdrawals.filter((w) => {
      const st = (w.status || "").toLowerCase();
      if (statusFilter === "pending" && !["menunggu", "pending", "diproses"].includes(st)) return false;
      if (statusFilter === "approved" && !["berhasil", "disetujui"].includes(st)) return false;
      if (statusFilter === "rejected" && st !== "ditolak") return false;

      if (dateFrom) {
        const itemDate = (w.requested_at || w.created_at || "").slice(0, 10);
        if (itemDate < dateFrom) return false;
      }
      if (dateTo) {
        const itemDate = (w.requested_at || w.created_at || "").slice(0, 10);
        if (itemDate > dateTo) return false;
      }

      if (query.trim()) {
        const q = query.toLowerCase();
        const match =
          (w.buzzer_name || "").toLowerCase().includes(q) ||
          (w.buzzer_email || "").toLowerCase().includes(q) ||
          (w.method || "").toLowerCase().includes(q) ||
          (w.account_no || "").toLowerCase().includes(q) ||
          (w.admin_note || "").toLowerCase().includes(q);
        if (!match) return false;
      }

      return true;
    });
  }, [allWithdrawals, statusFilter, dateFrom, dateTo, query]);

  useEffect(() => {
    setPage(1);
  }, [statusFilter, dateFrom, dateTo, query]);

  const totalPages = Math.max(1, Math.ceil(filteredList.length / PAGE_SIZE));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const paginatedList = useMemo(() => {
    const start = (safePage - 1) * PAGE_SIZE;
    return filteredList.slice(start, start + PAGE_SIZE);
  }, [filteredList, safePage]);

  // Handle Copy to clipboard
  const copyToClipboard = (text: string, label: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    toast.success(`${label} berhasil disalin ke clipboard`);
  };

  // Open Verification Modal (tanpa upload bukti)
  const openApproveModal = (w: Withdrawal) => {
    setVerifyingItem(w);
    setAdminNote(w.admin_note || "");
    setIsTransferChecked(false);
  };

  // Submit Approval
  const handleApprove = async () => {
    if (!verifyingItem) return;
    if (!isTransferChecked) {
      return toast.error("Silakan centang konfirmasi bahwa transfer telah selesai dilakukan.");
    }

    setActionLoading(true);
    try {
      await updateWithdrawalStatus(
        verifyingItem.id,
        "Berhasil",
        adminNote.trim() || undefined
      );

      toast.success(
        `Pencairan dana sebesar ${formatIDR(Number(verifyingItem.amount))} berhasil diverifikasi & disetujui!`
      );
      setVerifyingItem(null);
      void refetch();
      setLocalWithdrawals(listAllWithdrawals());
    } catch (err: any) {
      console.error(err);
      toast.error("Gagal menyetujui pencairan: " + (err?.message || "Terjadi kesalahan"));
    } finally {
      setActionLoading(false);
    }
  };

  // Open Reject Modal
  const openRejectModal = (w: Withdrawal) => {
    setRejectingItem(w);
    setRejectionReason("");
  };

  // Submit Rejection
  const handleReject = async () => {
    if (!rejectingItem) return;
    if (!rejectionReason.trim()) {
      return toast.error("Alasan penolakan pencairan wajib diisi agar buzzer dapat memperbaiki informasinya.");
    }

    setActionLoading(true);
    try {
      await updateWithdrawalStatus(
        rejectingItem.id,
        "Ditolak",
        rejectionReason.trim()
      );

      toast.success(
        `Pengajuan pencairan sebesar ${formatIDR(Number(rejectingItem.amount))} telah ditolak. Saldo tetap aman di akun buzzer.`
      );
      setRejectingItem(null);
      void refetch();
      setLocalWithdrawals(listAllWithdrawals());
    } catch (err: any) {
      console.error(err);
      toast.error("Gagal menolak pencairan: " + (err?.message || "Terjadi kesalahan"));
    } finally {
      setActionLoading(false);
    }
  };

  // Open Edit Modal
  const openEditModal = (w: Withdrawal) => {
    setEditingItem(w);
    setEditStatus((((w.status as string) === "Pending" ? "Menunggu" : w.status) || "Menunggu") as WithdrawalStatus);
    setEditAmount(String(w.amount || 0));
    setEditMethod(w.method || "");
    setEditAccountNo(w.account_no || "");
    setEditAdminNote(w.admin_note || "");
  };

  // Submit Edit
  const handleSaveEdit = async () => {
    if (!editingItem) return;
    const num = Number(editAmount);
    if (isNaN(num) || num < 0) {
      return toast.error("Nominal pencairan tidak valid");
    }

    setActionLoading(true);
    try {
      await editWithdrawalRecord(
        editingItem.id,
        {
          status: editStatus,
          amount: num,
          method: editMethod.trim() || editingItem.method,
          account_no: editAccountNo.trim() || editingItem.account_no,
          admin_note: editAdminNote.trim() || undefined,
        },
        editingItem.buzzer_email
      );

      toast.success("Data pencairan berhasil diperbarui.");
      setEditingItem(null);
      void refetch();
      setLocalWithdrawals(listAllWithdrawals());
    } catch (err: any) {
      console.error(err);
      toast.error("Gagal memperbarui data: " + (err?.message || "Terjadi kesalahan"));
    } finally {
      setActionLoading(false);
    }
  };

  // Open Delete Modal
  const openDeleteModal = (w: Withdrawal) => {
    setDeletingItem(w);
  };

  // Submit Delete
  const handleConfirmDelete = async () => {
    if (!deletingItem) return;
    setActionLoading(true);
    try {
      await deleteWithdrawalRecord(deletingItem.id, deletingItem.buzzer_email);
      toast.success("Riwayat pencairan berhasil dihapus.");
      setDeletingItem(null);
      void refetch();
      setLocalWithdrawals(listAllWithdrawals());
    } catch (err: any) {
      console.error(err);
      toast.error("Gagal menghapus riwayat: " + (err?.message || "Terjadi kesalahan"));
    } finally {
      setActionLoading(false);
    }
  };

  // Parse method & account details nicely
  const parseAccountDetails = (method: string, accountNo: string) => {
    const isEwallet = ["dana", "gopay", "shopeepay", "ovo"].some((ew) =>
      method.toLowerCase().includes(ew)
    );
    return {
      isEwallet,
      provider: method.split("•")[0]?.trim() || method,
      accountDetails: accountNo || method,
    };
  };

  return (
    <div className="space-y-6">
      {/* Financial Overview Cards Khusus Pencairan Dana Buzzer */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {/* Card 1: Menunggu Verifikasi */}
        <div className="relative overflow-hidden rounded-2xl border border-amber-500/30 bg-card p-4 shadow-sm transition-shadow hover:shadow-md sm:p-5">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-2.5 w-2.5 shrink-0">
                {pendingList.length > 0 && (
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                )}
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500" />
              </span>
              <p className="text-[10px] font-semibold uppercase leading-tight tracking-wide text-amber-600 dark:text-amber-400 sm:text-xs">
                Menunggu Verifikasi
              </p>
            </div>
            <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-amber-500/15 text-amber-600 dark:text-amber-400 sm:h-9 sm:w-9">
              <Clock className="h-4 w-4 sm:h-5 sm:w-5" />
            </span>
          </div>
          <p className="mt-2.5 font-display text-lg font-bold leading-tight text-foreground sm:mt-3 sm:text-2xl">
            {pendingList.length} Permintaan
          </p>
          <p className="mt-1 text-[11px] font-medium leading-snug text-muted-foreground sm:text-xs">
            Total {formatIDR(totalPendingAmount)}
          </p>
        </div>

        {/* Card 2: Pencairan Berhasil */}
        <div className="rounded-2xl border border-emerald-500/30 bg-card p-4 shadow-sm transition-shadow hover:shadow-md sm:p-5">
          <div className="flex items-start justify-between gap-2">
            <p className="text-[10px] font-semibold uppercase leading-tight tracking-wide text-emerald-600 dark:text-emerald-400 sm:text-xs">
              Pencairan Selesai
            </p>
            <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 sm:h-9 sm:w-9">
              <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5" />
            </span>
          </div>
          <p className="mt-2.5 font-display text-lg font-bold leading-tight text-foreground sm:mt-3 sm:text-2xl">
            {approvedList.length} Selesai
          </p>
          <p className="mt-1 text-[11px] font-medium leading-snug text-muted-foreground sm:text-xs">
            Total {formatIDR(totalApprovedAmount)}
          </p>
        </div>

        {/* Card 3: Pencairan Ditolak */}
        <div className="rounded-2xl border border-rose-500/30 bg-card p-4 shadow-sm transition-shadow hover:shadow-md sm:p-5">
          <div className="flex items-start justify-between gap-2">
            <p className="text-[10px] font-semibold uppercase leading-tight tracking-wide text-rose-600 dark:text-rose-400 sm:text-xs">
              Pengajuan Ditolak
            </p>
            <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-rose-500/15 text-rose-600 dark:text-rose-400 sm:h-9 sm:w-9">
              <X className="h-4 w-4 sm:h-5 sm:w-5" />
            </span>
          </div>
          <p className="mt-2.5 font-display text-lg font-bold leading-tight text-foreground sm:mt-3 sm:text-2xl">
            {rejectedList.length} Ditolak
          </p>
          <p className="mt-1 text-[11px] font-medium leading-snug text-muted-foreground sm:text-xs">
            Saldo {formatIDR(totalRejectedAmount)} dikembalikan
          </p>
        </div>

        {/* Card 4: Total Seluruh Pencairan */}
        <StatCard
          label="Total Dana Dicairkan"
          value={formatIDR(totalApprovedAmount)}
          hint={`${allWithdrawals.length} total pengajuan riwayat`}
          icon={<Wallet className="h-5 w-5" />}
        />
      </div>

      {/* Main Table Card */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
        {/* Header & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display text-xl font-bold">Verifikasi Pencairan Dana Buzzer</h2>
              {pendingList.length > 0 && (
                <span className="rounded-full bg-amber-500/15 text-amber-600 border border-amber-500/30 px-2.5 py-0.5 text-xs font-bold">
                  {pendingList.length} Menunggu Verifikasi
                </span>
              )}
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              Verifikasi rekening buzzer dan lakukan transfer dana pencairan.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                void refetch();
                setLocalWithdrawals(listAllWithdrawals());
                toast.success("Data pencairan diperbarui");
              }}
              disabled={dbLoading}
              className="gap-2 shrink-0"
            >
              <RefreshCw className={`h-4 w-4 ${dbLoading ? "animate-spin" : ""}`} />
              Refresh
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => {
                exportToExcel("verifikasi-pencairan-buzzer", "Pencairan Buzzer", filteredList, [
                  { header: "Tanggal", accessor: (w) => (w.requested_at || w.created_at || "").slice(0, 16) },
                  { header: "Nama Buzzer", accessor: (w) => w.buzzer_name },
                  { header: "Email Buzzer", accessor: (w) => w.buzzer_email },
                  { header: "Metode / Bank", accessor: (w) => w.method },
                  { header: "No. Rekening / E-Wallet", accessor: (w) => w.account_no },
                  { header: "Nominal (Rp)", accessor: (w) => w.amount },
                  { header: "Status", accessor: (w) => w.status },
                  { header: "Catatan Admin", accessor: (w) => w.admin_note || "-" },
                ]);
                toast.success("Data pencairan berhasil diekspor ke Excel");
              }}
            >
              <FileSpreadsheet className="h-4 w-4" /> Excel
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => {
                const totalW = filteredList.reduce((a, w) => a + Number(w.amount || 0), 0);
                exportToPDF(
                  "verifikasi-pencairan-buzzer",
                  "Laporan Verifikasi Pencairan Dana Buzzer",
                  filteredList,
                  [
                    { header: "Tanggal", accessor: (w) => (w.requested_at || w.created_at || "").slice(0, 10) },
                    { header: "Buzzer", accessor: (w) => `${w.buzzer_name} (${w.buzzer_email})` },
                    { header: "Rekening Tujuan", accessor: (w) => `${w.method} - ${w.account_no}` },
                    { header: "Nominal (Rp)", accessor: (w) => formatIDR(Number(w.amount)) },
                    { header: "Status", accessor: (w) => w.status },
                  ],
                  [
                    { label: "Total Transaksi Ditampilkan", value: `${filteredList.length} transaksi` },
                    { label: "Total Nominal", value: formatIDR(totalW) },
                  ]
                );
                toast.success("Laporan pencairan berhasil diekspor ke PDF");
              }}
            >
              <FileDown className="h-4 w-4" /> PDF
            </Button>
          </div>
        </div>

        {/* Filter Bar: Status Pills & Search */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border pb-4 pt-1">
          {/* Status filter buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground mr-1" />
            <button
              type="button"
              onClick={() => setStatusFilter("all")}
              className={cn(
                "rounded-lg px-3 py-1.5 text-xs font-semibold transition-all",
                statusFilter === "all"
                  ? "gradient-brand text-brand-foreground shadow-sm"
                  : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
              )}
            >
              Semua ({allWithdrawals.length})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("pending")}
              className={cn(
                "rounded-lg px-3 py-1.5 text-xs font-semibold transition-all flex items-center gap-1.5",
                statusFilter === "pending"
                  ? "bg-amber-500 text-white shadow-sm"
                  : "bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20"
              )}
            >
              Menunggu Verifikasi
              {pendingList.length > 0 && (
                <span className="rounded-full bg-white/20 px-1.5 py-0.2 text-[10px] font-bold">
                  {pendingList.length}
                </span>
              )}
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("approved")}
              className={cn(
                "rounded-lg px-3 py-1.5 text-xs font-semibold transition-all",
                statusFilter === "approved"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20"
              )}
            >
              Selesai / Berhasil ({approvedList.length})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("rejected")}
              className={cn(
                "rounded-lg px-3 py-1.5 text-xs font-semibold transition-all",
                statusFilter === "rejected"
                  ? "bg-rose-600 text-white shadow-sm"
                  : "bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-500/20"
              )}
            >
              Ditolak ({rejectedList.length})
            </button>
          </div>

          {/* Search box */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari buzzer, rekening, bank..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-9 h-9 text-xs"
            />
          </div>
        </div>

        {/* Date Filters */}
        <div className="flex flex-wrap items-end gap-3 rounded-xl border border-border/70 bg-muted/20 p-3">
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Dari Tanggal</Label>
            <Input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="h-8 text-xs w-36"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Sampai Tanggal</Label>
            <Input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="h-8 text-xs w-36"
            />
          </div>
          {(dateFrom || dateTo || query) && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 text-xs text-muted-foreground hover:text-foreground"
              onClick={() => {
                setDateFrom("");
                setDateTo("");
                setQuery("");
              }}
            >
              <RefreshCw className="mr-1 h-3 w-3" /> Reset Filter
            </Button>
          )}
          <div className="ml-auto text-xs text-muted-foreground self-center">
            Menampilkan <b>{paginatedList.length}</b> dari <b>{filteredList.length}</b> pengajuan
          </div>
        </div>

        {/* Payouts Table */}
        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40">
                <TableHead>Tanggal Pengajuan</TableHead>
                <TableHead>Buzzer</TableHead>
                <TableHead>Tujuan Transfer (Rekening/E-Wallet)</TableHead>
                <TableHead className="text-right">Nominal</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead>Catatan Admin</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedList.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="py-12 text-center text-muted-foreground">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Wallet className="h-8 w-8 text-muted-foreground/40" />
                      <p className="font-semibold text-sm">Tidak ada permintaan pencairan dana</p>
                      <p className="text-xs text-muted-foreground">
                        {statusFilter !== "all"
                          ? `Tidak ditemukan pencairan dengan filter status "${statusFilter}".`
                          : "Belum ada riwayat permohonan pencairan dari buzzer."}
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              )}

              {paginatedList.map((w) => {
                const { isEwallet, provider, accountDetails } = parseAccountDetails(w.method, w.account_no);
                const isPending = ["menunggu", "pending", "diproses"].includes((w.status || "").toLowerCase());
                const isApproved = ["berhasil", "disetujui"].includes((w.status || "").toLowerCase());
                const isRejected = (w.status || "").toLowerCase() === "ditolak";

                return (
                  <TableRow key={w.id} className="hover:bg-muted/30 transition-colors">
                    {/* Tanggal */}
                    <TableCell className="align-top py-3 text-xs whitespace-nowrap">
                      <div className="font-semibold text-foreground">
                        {(w.requested_at || w.created_at || "").slice(0, 10)}
                      </div>
                      <div className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
                        <Clock className="h-3 w-3" />
                        {(w.requested_at || w.created_at || "").slice(11, 16) || "12:00"} WIB
                      </div>
                    </TableCell>

                    {/* Buzzer */}
                    <TableCell className="align-top py-3">
                      <div className="flex items-center gap-2.5">
                        <Avatar className="h-8 w-8 rounded-lg border border-border">
                          <AvatarFallback className="text-[11px] font-bold gradient-brand text-brand-foreground">
                            {(w.buzzer_name || "BZ").slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-foreground truncate">{w.buzzer_name || "Buzzer"}</p>
                          <p className="text-[11px] text-muted-foreground truncate">{w.buzzer_email}</p>
                        </div>
                      </div>
                    </TableCell>

                    {/* Tujuan Transfer */}
                    <TableCell className="align-top py-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={cn(
                              "inline-flex items-center gap-1 rounded px-2 py-0.5 text-[10px] font-bold uppercase",
                              isEwallet
                                ? "bg-cyan-500/10 text-cyan-600 border border-cyan-500/20"
                                : "bg-indigo-500/10 text-indigo-600 border border-indigo-500/20"
                            )}
                          >
                            {isEwallet ? <Smartphone className="h-3 w-3" /> : <Building2 className="h-3 w-3" />}
                            {provider}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 font-mono text-xs font-semibold text-foreground">
                          <span>{accountDetails}</span>
                          <button
                            type="button"
                            onClick={() => copyToClipboard(accountDetails.split(" ")[0], "Nomor rekening")}
                            title="Salin nomor"
                            className="text-muted-foreground hover:text-foreground transition-colors p-0.5 rounded hover:bg-muted"
                          >
                            <Copy className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    </TableCell>

                    {/* Nominal */}
                    <TableCell className="align-top py-3 text-right">
                      <span className="font-display text-sm font-bold text-emerald-600 dark:text-emerald-400">
                        {formatIDR(Number(w.amount))}
                      </span>
                    </TableCell>

                    {/* Status */}
                    <TableCell className="align-top py-3 text-center">
                      <StatusBadge
                        status={
                          w.status === "Menunggu"
                            ? "Menunggu Verifikasi"
                            : w.status
                        }
                      />
                    </TableCell>

                    {/* Catatan Admin */}
                    <TableCell className="align-top py-3 text-xs max-w-[200px]">
                      {w.admin_note ? (
                        <div
                          className={cn(
                            "rounded p-1.5 text-[11px] line-clamp-2",
                            isRejected
                              ? "bg-rose-500/10 text-rose-700 dark:text-rose-300 border border-rose-500/20"
                              : "bg-muted/60 text-muted-foreground"
                          )}
                          title={w.admin_note}
                        >
                          {isRejected ? `Alasan: ${w.admin_note}` : w.admin_note}
                        </div>
                      ) : (
                        <span className="text-[11px] text-muted-foreground italic">-</span>
                      )}
                    </TableCell>

                    {/* Aksi (HANYA ICON) */}
                    <TableCell className="align-top py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {isPending && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 w-8 p-0 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800"
                              onClick={() => openApproveModal(w)}
                              title="Verifikasi & Setujui"
                              aria-label="Verifikasi & Setujui"
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 w-8 p-0 text-amber-600 hover:text-amber-700 hover:bg-amber-50 dark:hover:bg-amber-950/20 border-amber-300 dark:border-amber-800"
                              onClick={() => openRejectModal(w)}
                              title="Tolak Pengajuan"
                              aria-label="Tolak Pengajuan"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 w-8 p-0 text-primary hover:bg-primary/10"
                          onClick={() => openEditModal(w)}
                          title="Edit Data Pencairan"
                          aria-label="Edit Data Pencairan"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 w-8 p-0 text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/20"
                          onClick={() => openDeleteModal(w)}
                          title="Hapus Riwayat Pencairan"
                          aria-label="Hapus Riwayat Pencairan"
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

        {/* Pagination */}
        <TablePagination
          currentPage={safePage}
          totalItems={filteredList.length}
          pageSize={PAGE_SIZE}
          onPageChange={setPage}
        />
      </div>

      {/* ================= MODAL 1: VERIFIKASI & SETUJUI PENCAIRAN ================= */}
      <Dialog open={!!verifyingItem} onOpenChange={(open) => !open && setVerifyingItem(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-emerald-600" />
              Verifikasi & Selesaikan Pencairan
            </DialogTitle>
            <DialogDescription>
              Pastikan dana telah ditransfer ke rekening buzzer sebelum menyelesaikan verifikasi.
            </DialogDescription>
          </DialogHeader>

          {verifyingItem && (
            <div className="space-y-4 text-xs">
              {/* Target Transfer Box */}
              <div className="rounded-xl border border-border bg-muted/40 p-3.5 space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wide">
                      Penerima
                    </span>
                    <p className="text-sm font-bold text-foreground">{verifyingItem.buzzer_name}</p>
                    <p className="text-[11px] text-muted-foreground">{verifyingItem.buzzer_email}</p>
                  </div>
                  <span className="rounded-md bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold px-2 py-0.5 text-xs">
                    {verifyingItem.method}
                  </span>
                </div>

                <div className="pt-2 border-t border-border flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-muted-foreground block">Nomor Rekening / Akun Tujuan</span>
                    <span className="font-mono text-sm font-bold text-foreground">
                      {verifyingItem.account_no || verifyingItem.method}
                    </span>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-7 text-xs gap-1"
                    onClick={() => copyToClipboard(verifyingItem.account_no || verifyingItem.method, "Nomor rekening")}
                  >
                    <Copy className="h-3 w-3" /> Salin
                  </Button>
                </div>

                <div className="pt-2 border-t border-border flex items-center justify-between bg-card p-2 rounded-lg">
                  <span className="text-xs font-semibold text-muted-foreground">Nominal Transfer:</span>
                  <span className="font-display text-base font-bold text-emerald-600 dark:text-emerald-400">
                    {formatIDR(Number(verifyingItem.amount))}
                  </span>
                </div>
              </div>

              {/* Checklist Konfirmasi */}
              <label className="flex items-start gap-2.5 rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isTransferChecked}
                  onChange={(e) => setIsTransferChecked(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-emerald-500 text-emerald-600 focus:ring-emerald-500"
                />
                <span className="text-xs text-foreground font-medium leading-tight">
                  Saya telah mentransfer dana sebesar <b>{formatIDR(Number(verifyingItem.amount))}</b> ke rekening buzzer
                  di atas.
                </span>
              </label>

              {/* Catatan / No Referensi */}
              <div className="space-y-1.5">
                <Label className="text-xs">Nomor Referensi / Catatan Transfer (Opsional)</Label>
                <Input
                  placeholder="Contoh: TRX-BCA-9827361 atau Transfer Berhasil"
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                  className="text-xs h-9"
                />
              </div>
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setVerifyingItem(null)} disabled={actionLoading}>
              Batal
            </Button>
            <Button
              className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5"
              disabled={actionLoading || !isTransferChecked}
              onClick={handleApprove}
            >
              {actionLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4" />
                  Setujui & Selesaikan Pencairan
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ================= MODAL 2: TOLAK PENCAIRAN & REFUND ================= */}
      <Dialog open={!!rejectingItem} onOpenChange={(open) => !open && setRejectingItem(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-rose-600">
              <AlertCircle className="h-5 w-5" />
              Tolak Pengajuan Pencairan
            </DialogTitle>
            <DialogDescription>
              Permintaan pencairan akan dibatalkan dan status diubah menjadi Ditolak.
            </DialogDescription>
          </DialogHeader>

          {rejectingItem && (
            <div className="space-y-3 text-xs">
              <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-3 space-y-1 text-foreground">
                <p className="font-semibold text-xs">
                  Buzzer: <span className="font-bold">{rejectingItem.buzzer_name}</span> ({rejectingItem.buzzer_email})
                </p>
                <p className="text-xs text-muted-foreground">
                  Nominal: <b className="text-rose-600">{formatIDR(Number(rejectingItem.amount))}</b> ke{" "}
                  {rejectingItem.method}
                </p>
                <p className="text-[11px] text-muted-foreground font-medium pt-1 border-t border-rose-500/20">
                  ℹ️ Saldo buzzer belum terpotong pada saat pengajuan, sehingga saldo tetap aman di akun buzzer.
                </p>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Pilih Alasan Penolakan Cepat</Label>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    "Nomor rekening tidak valid / salah digit",
                    "Nama pemilik rekening tidak sesuai akun",
                    "Rekening / e-wallet tujuan tidak aktif",
                    "Nomor e-wallet belum terdaftar / belum upgrade",
                  ].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setRejectionReason(preset)}
                      className={cn(
                        "rounded-md border px-2 py-1 text-[11px] transition-all text-left",
                        rejectionReason === preset
                          ? "border-rose-500 bg-rose-500/10 text-rose-600 font-semibold"
                          : "border-border bg-muted/40 text-muted-foreground hover:bg-muted"
                      )}
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Detail Alasan Penolakan (Wajib)</Label>
                <Textarea
                  placeholder="Jelaskan alasan penolakan secara jelas agar buzzer dapat memahami kendala..."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  rows={3}
                  className="text-xs resize-none"
                />
              </div>
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setRejectingItem(null)} disabled={actionLoading}>
              Batal
            </Button>
            <Button
              variant="destructive"
              disabled={actionLoading || !rejectionReason.trim()}
              onClick={handleReject}
              className="gap-1.5"
            >
              {actionLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Memproses...
                </>
              ) : (
                <>
                  <X className="h-4 w-4" />
                  Tolak Pengajuan
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ================= MODAL 3: EDIT PENCAIRAN ================= */}
      <Dialog open={!!editingItem} onOpenChange={(open) => !open && setEditingItem(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Pencil className="h-5 w-5 text-primary" />
              Edit Data Pencairan Buzzer
            </DialogTitle>
            <DialogDescription>
              Perbarui status, nominal, atau informasi rekening permohonan pencairan buzzer.
            </DialogDescription>
          </DialogHeader>

          {editingItem && (
            <div className="space-y-3 text-xs">
              <div className="rounded-xl border border-border bg-muted/40 p-3 space-y-1">
                <p className="font-semibold text-foreground text-xs">
                  Buzzer: <span className="font-bold">{editingItem.buzzer_name}</span> ({editingItem.buzzer_email})
                </p>
                <p className="text-[11px] text-muted-foreground">
                  ID Transaksi: <span className="font-mono">{editingItem.id}</span>
                </p>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Status Pencairan</Label>
                <Select value={editStatus} onValueChange={(v) => setEditStatus(v as WithdrawalStatus)}>
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Menunggu">Menunggu Verifikasi</SelectItem>
                    <SelectItem value="Berhasil">Berhasil / Selesai</SelectItem>
                    <SelectItem value="Ditolak">Ditolak</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Nominal Pencairan (Rp)</Label>
                <Input
                  type="number"
                  value={editAmount}
                  onChange={(e) => setEditAmount(e.target.value)}
                  className="text-xs h-9 font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1.5">
                  <Label className="text-xs">Metode / Bank</Label>
                  <Input
                    value={editMethod}
                    onChange={(e) => setEditMethod(e.target.value)}
                    placeholder="Contoh: BCA / GoPay"
                    className="text-xs h-9"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Nomor Rekening / Akun</Label>
                  <Input
                    value={editAccountNo}
                    onChange={(e) => setEditAccountNo(e.target.value)}
                    placeholder="No Rekening / HP"
                    className="text-xs h-9"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs">Catatan Admin</Label>
                <Textarea
                  value={editAdminNote}
                  onChange={(e) => setEditAdminNote(e.target.value)}
                  placeholder="Catatan verifikasi atau alasan penolakan..."
                  rows={2}
                  className="text-xs resize-none"
                />
              </div>
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setEditingItem(null)} disabled={actionLoading}>
              Batal
            </Button>
            <Button onClick={handleSaveEdit} disabled={actionLoading} className="gradient-brand text-brand-foreground gap-1.5">
              {actionLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Menyimpan...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4" /> Simpan Perubahan
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ================= MODAL 4: HAPUS PENCAIRAN ================= */}
      <Dialog open={!!deletingItem} onOpenChange={(open) => !open && setDeletingItem(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-rose-600">
              <Trash2 className="h-5 w-5" />
              Hapus Riwayat Pencairan
            </DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus data permohonan pencairan ini?
            </DialogDescription>
          </DialogHeader>

          {deletingItem && (
            <div className="space-y-3 text-xs">
              <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-3.5 space-y-1.5">
                <p className="font-semibold text-xs text-foreground">
                  Buzzer: <span className="font-bold">{deletingItem.buzzer_name}</span> ({deletingItem.buzzer_email})
                </p>
                <p className="text-xs text-muted-foreground">
                  Nominal: <b className="text-foreground">{formatIDR(Number(deletingItem.amount))}</b> ke {deletingItem.method}
                </p>
                <p className="text-xs text-muted-foreground">
                  Status saat ini: <StatusBadge status={deletingItem.status === "Menunggu" ? "Menunggu Verifikasi" : deletingItem.status} />
                </p>
                {(deletingItem.status === "Berhasil" || deletingItem.status === "Disetujui") && (
                  <p className="text-[11px] text-amber-700 dark:text-amber-400 font-medium pt-1.5 border-t border-rose-500/20">
                    ⚠️ Karena status sebelumnya <b>Berhasil</b>, saldo sebesar {formatIDR(Number(deletingItem.amount))} akan otomatis dikembalikan ke akun buzzer.
                  </p>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Tindakan ini akan menghapus riwayat dari tabel dan tidak dapat dibatalkan.
              </p>
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setDeletingItem(null)} disabled={actionLoading}>
              Batal
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={actionLoading}
              className="gap-1.5"
            >
              {actionLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Menghapus...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4" /> Ya, Hapus Riwayat
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
