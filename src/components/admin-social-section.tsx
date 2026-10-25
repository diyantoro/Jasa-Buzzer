import { useEffect, useMemo, useState } from "react";
import {
  Search, Filter, XCircle, Eye, ExternalLink, Users,
  Link2, Clock, ShieldCheck, Edit3, Power, AlertCircle,
  MoreVertical, Trash2, Loader2,
} from "lucide-react";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { TablePagination } from "@/components/table-pagination";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { StatCard } from "@/components/dashboard-shell";
import {
  useAllSocialAccounts, adminUpdateAccount, adminApproveSocialAccount, adminRejectSocialAccount,
  adminToggleActive, adminRemoveAccount, adminApproveDeactivationRequest, adminRejectDeactivationRequest, SOCIAL_PLATFORMS,
  getSocialProfileUrl,
  type AdminSocialAccount, type SocialPlatform, type VerificationStatus,
} from "@/lib/social-store";
import { VerifBadge, AccountFormDialog, LevelBadge } from "@/components/social-accounts-section";
import { SOCIAL_PLATFORM_ICON } from "@/lib/social-platform-ui";
import { cn } from "@/lib/utils";


export function AdminSocialSection() {
  const all = useAllSocialAccounts();
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<"Semua" | VerificationStatus | "Nonaktif">("Semua");
  const [platform, setPlatform] = useState<"Semua" | SocialPlatform>("Semua");
  const [detail, setDetail] = useState<AdminSocialAccount | null>(null);
  const [editing, setEditing] = useState<AdminSocialAccount | null>(null);
  const [rejecting, setRejecting] = useState<AdminSocialAccount | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [approvingAccount, setApprovingAccount] = useState<AdminSocialAccount | null>(null);
  
  const [rejectingDeactivation, setRejectingDeactivation] = useState<AdminSocialAccount | null>(null);
  const [deactivateRejectReason, setDeactivateRejectReason] = useState("");
  const [approvingDeactivation, setApprovingDeactivation] = useState<AdminSocialAccount | null>(null);

  // Konfirmasi aksi dari menu titik tiga (nonaktifkan/aktifkan atau hapus akun)
  const [confirmAction, setConfirmAction] = useState<{ type: "toggle" | "delete"; account: AdminSocialAccount } | null>(null);
  const [confirmBusy, setConfirmBusy] = useState(false);

  const runConfirmAction = async () => {
    if (!confirmAction) return;
    const { type, account } = confirmAction;
    setConfirmBusy(true);
    try {
      if (type === "toggle") {
        await adminToggleActive(account.buzzerEmail, account.id);
        toast.success(account.isActive !== false ? `Akun ${account.username} dinonaktifkan` : `Akun ${account.username} diaktifkan`);
      } else {
        await adminRemoveAccount(account.buzzerEmail, account.id);
        toast.success(`Akun ${account.username} dihapus`);
      }
      setConfirmAction(null);
    } catch (err) {
      console.error(err);
      toast.error(type === "toggle" ? "Gagal mengubah status akun" : "Gagal menghapus akun");
    } finally {
      setConfirmBusy(false);
    }
  };

  // Level buzzer tetap memakai total followers akun yang terverifikasi.
  const verifiedFollowersByBuzzer = useMemo(() => {
    const followersByEmail = new Map<string, number>();
    for (const account of all) {
      if (account.verification !== "Terverifikasi") continue;
      const email = account.buzzerEmail.trim().toLowerCase();
      followersByEmail.set(email, (followersByEmail.get(email) ?? 0) + account.followers);
    }
    return followersByEmail;
  }, [all]);
  const levelFollowers = (email: string) => verifiedFollowersByBuzzer.get(email.trim().toLowerCase()) ?? 0;

  // Kategori akun:
  // 1. Akun Dinonaktifkan atau Permintaan Penonaktifan: Masuk ke tab "Dinonaktifkan" (Nonaktif)
  const isInactiveAccount = (a: AdminSocialAccount) => {
    // Permintaan penonaktifan dari buzzer
    if (a.rejectionNote?.startsWith("[Permintaan Nonaktif/Hapus]:")) return true;
    // Sudah dinonaktifkan secara resmi (bukan akun baru yang menunggu verifikasi dan bukan akun yang sedang pembaruan)
    if (a.isActive === false && a.verification !== "Menunggu" && a.pendingVerification !== "Menunggu") return true;
    return false;
  };

  // 2. Belum Diverifikasi: Masuk ke tab "Belum Diverifikasi" (Menunggu)
  // Termasuk: Akun baru yang menunggu verifikasi ATAU akun lama yang mengajukan pembaruan data/followers
  const isWaitingAction = (a: AdminSocialAccount) => {
    // Permintaan penonaktifan masuk ke tab Dinonaktifkan, bukan Belum Diverifikasi
    if (a.rejectionNote?.startsWith("[Permintaan Nonaktif/Hapus]:")) return false;
    return a.verification === "Menunggu" || a.pendingVerification === "Menunggu";
  };

  // 3. Bersih sudah terverifikasi (tidak sedang dalam proses pengajuan atau penonaktifan)
  const isCleanVerified = (a: AdminSocialAccount) =>
    a.verification === "Terverifikasi" &&
    a.pendingVerification !== "Menunggu" &&
    !isInactiveAccount(a);

  // 4. Ditolak
  const isRejectedAccount = (a: AdminSocialAccount) =>
    (a.verification === "Ditolak" || a.pendingVerification === "Ditolak") &&
    !isInactiveAccount(a);

  const waiting = all.filter(isWaitingAction).length;
  const verified = all.filter(isCleanVerified).length;
  const rejected = all.filter(isRejectedAccount).length;
  const inactive = all.filter(isInactiveAccount).length;
  const total = all.filter((a) => !isInactiveAccount(a)).length;

  const filtered = useMemo(() => {
    return all
      .filter((a) => {
        // Sembunyikan akun dinonaktifkan dari tab mana pun kecuali tab "Nonaktif"
        if (status !== "Nonaktif" && isInactiveAccount(a)) return false;

        if (status === "Menunggu") {
          if (!isWaitingAction(a)) return false;
        } else if (status === "Terverifikasi") {
          if (!isCleanVerified(a)) return false;
        } else if (status === "Ditolak") {
          if (!isRejectedAccount(a)) return false;
        } else if (status === "Nonaktif") {
          if (!isInactiveAccount(a)) return false;
        }

        if (platform !== "Semua" && a.platform !== platform) return false;
        if (q.trim()) {
          const s = q.trim().toLowerCase();
          if (
            !a.username.toLowerCase().includes(s) &&
            !a.accountName.toLowerCase().includes(s) &&
            !a.buzzerName.toLowerCase().includes(s) &&
            !a.buzzerEmail.toLowerCase().includes(s)
          ) return false;
        }
        return true;
      })
      .sort((a, b) => {
        // Prioritaskan akun yang butuh tindakan admin di posisi teratas
        const aPending = isWaitingAction(a) || (a.rejectionNote?.startsWith("[Permintaan Nonaktif/Hapus]:") ?? false);
        const bPending = isWaitingAction(b) || (b.rejectionNote?.startsWith("[Permintaan Nonaktif/Hapus]:") ?? false);
        if (aPending && !bPending) return -1;
        if (!aPending && bPending) return 1;

        return (b.createdAt || "").localeCompare(a.createdAt || "");
      });
  }, [all, q, status, platform]);

  const [page, setPage] = useState(1);
  const PAGE_SIZE = 8;

  useEffect(() => {
    setPage(1);
  }, [q, status, platform]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const paginatedFiltered = useMemo(() => {
    const start = (safePage - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, safePage]);


  return (
    <div className="space-y-6">
      {/* Ringkasan Statistik (Klik untuk filter langsung) */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <button
          type="button"
          onClick={() => setStatus("Semua")}
          className="text-left transition-transform hover:-translate-y-0.5 focus:outline-none"
        >
          <StatCard
            label="Total Akun"
            value={total.toString()}
            hint="Semua akun buzzer aktif"
            icon={<Link2 className="h-5 w-5" />}
          />
        </button>
        <button
          type="button"
          onClick={() => setStatus("Menunggu")}
          className="text-left transition-transform hover:-translate-y-0.5 focus:outline-none"
        >
          <StatCard
            label="Belum Diverifikasi"
            value={waiting.toString()}
            hint={waiting > 0 ? "Perlu ditinjau admin" : "Tidak ada antrean"}
            icon={<Clock className="h-5 w-5 text-amber-500" />}
          />
        </button>
        <button
          type="button"
          onClick={() => setStatus("Terverifikasi")}
          className="text-left transition-transform hover:-translate-y-0.5 focus:outline-none"
        >
          <StatCard
            label="Sudah Terverifikasi"
            value={verified.toString()}
            hint="Aktif & siap campaign"
            icon={<ShieldCheck className="h-5 w-5 text-emerald-500" />}
          />
        </button>
        <button
          type="button"
          onClick={() => setStatus("Ditolak")}
          className="text-left transition-transform hover:-translate-y-0.5 focus:outline-none"
        >
          <StatCard
            label="Ditolak"
            value={rejected.toString()}
            hint="Total penolakan"
            icon={<XCircle className="h-5 w-5 text-rose-500" />}
          />
        </button>
      </div>

      <div className="rounded-2xl border border-border bg-card p-4 space-y-4 shadow-sm">
        {/* Tab Pills Status */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3">
          <div className="flex flex-wrap items-center gap-2">
            <Filter className="mr-1 h-4 w-4 text-muted-foreground" />
            {[
              { id: "Semua", label: "Semua Akun", count: total },
              { id: "Menunggu", label: "Belum Diverifikasi", count: waiting, highlight: waiting > 0 },
              { id: "Terverifikasi", label: "Sudah Terverifikasi", count: verified },
              { id: "Ditolak", label: "Ditolak", count: rejected },
              { id: "Nonaktif", label: "Dinonaktifkan", count: inactive },
            ].map((tab) => {
              const isActive = status === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setStatus(tab.id as typeof status)}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all",
                    isActive
                      ? "border-transparent gradient-brand text-brand-foreground shadow-sm font-semibold"
                      : tab.highlight
                      ? "border-amber-500/50 bg-amber-500/10 text-amber-700 hover:bg-amber-500/20 dark:text-amber-300 font-semibold"
                      : "border-border text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <span>{tab.label}</span>
                  <span
                    className={cn(
                      "rounded-full px-1.5 py-0.5 text-[10px] font-bold leading-none",
                      isActive
                        ? "bg-black/25 text-white"
                        : tab.highlight
                        ? "bg-amber-500 text-white"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          {status !== "Semua" && (
            <Button
              size="sm"
              variant="ghost"
              className="h-7 text-xs text-muted-foreground hover:text-foreground"
              onClick={() => setStatus("Semua")}
            >
              Reset Filter
            </Button>
          )}
        </div>

        {/* Search & Platform Filter */}
        <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Cari username, nama akun, nama buzzer, atau email..."
              className="pl-9"
            />
          </div>
          <Select value={platform} onValueChange={(v) => setPlatform(v as typeof platform)}>
            <SelectTrigger className="w-full sm:w-[190px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Semua">Semua Platform</SelectItem>
              {SOCIAL_PLATFORMS.map((p) => (
                <SelectItem key={p} value={p}>{p}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Akun</TableHead>
                <TableHead>Buzzer</TableHead>
                <TableHead>Platform</TableHead>
                <TableHead className="text-right">Followers</TableHead>
                <TableHead>Level</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="py-12 text-center text-sm text-muted-foreground">
                    <p className="font-medium text-foreground">
                      {status === "Menunggu"
                        ? "Tidak ada akun yang belum diverifikasi."
                        : status === "Terverifikasi"
                        ? "Belum ada akun yang sudah terverifikasi."
                        : "Tidak ada akun yang sesuai dengan filter."}
                    </p>
                    {status !== "Semua" && (
                      <Button
                        size="sm"
                        variant="link"
                        className="mt-2 text-xs"
                        onClick={() => {
                          setStatus("Semua");
                          setPlatform("Semua");
                          setQ("");
                        }}
                      >
                        Tampilkan semua akun
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ) : paginatedFiltered.map((a) => (
                <TableRow
                  key={a.buzzerEmail + a.id}
                  className={cn(
                    "transition-colors",
                    a.rejectionNote?.startsWith("[Permintaan Nonaktif/Hapus]:")
                      ? "bg-rose-500/[0.06] hover:bg-rose-500/[0.12]"
                      : a.verification === "Menunggu" || a.pendingVerification === "Menunggu"
                      ? "bg-amber-500/[0.08] hover:bg-amber-500/[0.14]"
                      : "hover:bg-muted/40"
                  )}
                >
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        {a.photoUrl && <AvatarImage src={a.photoUrl} />}
                        <AvatarFallback className="gradient-brand text-[10px] text-brand-foreground">
                          {a.accountName.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className="truncate text-sm font-medium">{a.accountName}</p>
                          {a.verification === "Menunggu" && (
                            <span className="shrink-0 rounded bg-amber-500/20 px-1.5 py-0.5 text-[10px] font-semibold text-amber-700 dark:text-amber-300">
                              Baru
                            </span>
                          )}
                          {a.pendingVerification === "Menunggu" && (
                            <span className="shrink-0 rounded bg-amber-500/20 px-1.5 py-0.5 text-[10px] font-semibold text-amber-700 dark:text-amber-300">
                              Pembaruan
                            </span>
                          )}
                        </div>
                        <p className="truncate text-xs text-muted-foreground">{a.username}</p>
                        {getSocialProfileUrl(a) && (
                          <a
                            href={getSocialProfileUrl(a)!}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-0.5 inline-flex max-w-[200px] items-center gap-1 truncate text-[11px] text-primary hover:underline"
                            title={getSocialProfileUrl(a)!}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Link2 className="h-3 w-3 shrink-0" />
                            <span className="truncate">{a.profileUrl}</span>
                            <ExternalLink className="h-2.5 w-2.5 shrink-0" />
                          </a>
                        )}
                        {a.pendingProofUrl && (
                          <a
                            href={a.pendingProofUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-0.5 inline-flex items-center gap-1 text-[11px] text-amber-600 dark:text-amber-400 underline font-medium"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <span>Bukti Followers</span>
                            <ExternalLink className="h-2.5 w-2.5" />
                          </a>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm font-medium">{a.buzzerName}</p>
                    <p className="text-xs text-muted-foreground">{a.buzzerEmail}</p>
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center gap-1 text-sm">
                      {SOCIAL_PLATFORM_ICON[a.platform]} {a.platform}
                    </span>
                  </TableCell>
                  <TableCell className="text-right font-semibold">
                    {a.pendingFollowers != null ? (
                      <div>
                        <span className="text-xs text-muted-foreground line-through mr-1.5">
                          {a.followers.toLocaleString("id-ID")}
                        </span>
                        <span className="font-bold text-amber-600 dark:text-amber-400">
                          {a.pendingFollowers.toLocaleString("id-ID")}
                        </span>
                        <span className="block text-[10px] text-amber-600 dark:text-amber-400 font-semibold">
                          Diajukan
                        </span>
                      </div>
                    ) : (
                      <span>
                        <Users className="mr-1 inline h-3 w-3 text-muted-foreground" />
                        {a.followers.toLocaleString("id-ID")}
                      </span>
                    )}
                  </TableCell>
                  <TableCell><LevelBadge followers={levelFollowers(a.buzzerEmail)} /></TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1 items-start">
                      {a.rejectionNote?.startsWith("[Permintaan Nonaktif/Hapus]:") ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 dark:bg-rose-500/15 px-2.5 py-0.5 text-[10px] font-semibold text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                          <Power className="h-3 w-3" />
                          Menunggu Persetujuan Nonaktif
                        </span>
                      ) : a.pendingVerification === "Menunggu" ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 dark:bg-amber-500/15 text-amber-700 dark:text-amber-300 px-2.5 py-0.5 text-[10px] font-semibold border border-amber-200 dark:border-amber-800">
                          <Clock className="h-3 w-3" />
                          Menunggu Pembaruan
                        </span>
                      ) : a.verification === "Menunggu" ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 dark:bg-amber-500/15 text-amber-700 dark:text-amber-300 px-2.5 py-0.5 text-[10px] font-semibold border border-amber-200 dark:border-amber-800">
                          <Clock className="h-3 w-3" />
                          Belum Diverifikasi
                        </span>
                      ) : a.isActive === false ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-zinc-100 dark:bg-zinc-800 px-2.5 py-0.5 text-[10px] font-semibold text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700">
                          <Power className="h-3 w-3" />
                          Dinonaktifkan
                        </span>
                      ) : (
                        <VerifBadge s={a.verification} />
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    <div className="flex items-center justify-end gap-2">
                      <Button size="sm" variant="outline" className="h-9 w-9 p-0" title="Detail" aria-label="Detail" onClick={() => setDetail(a)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <DropdownMenu modal={false}>
                        <DropdownMenuTrigger asChild>
                          <Button size="sm" variant="outline" className="h-9 w-9 p-0" aria-label="Aksi lainnya" id={`social-actions-${a.id}`}>
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          {a.verification === "Terverifikasi" && (
                            <>
                              <DropdownMenuItem onSelect={() => setConfirmAction({ type: "toggle", account: a })}>
                                <Power className="mr-2 h-4 w-4" />
                                {a.isActive !== false ? "Nonaktifkan Akun" : "Aktifkan Akun"}
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                            </>
                          )}
                          <DropdownMenuItem
                            className="text-rose-600 focus:bg-rose-500/10 focus:text-rose-600 dark:text-rose-400"
                            onSelect={() => setConfirmAction({ type: "delete", account: a })}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Hapus Akun
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      {a.verification === "Menunggu" || a.pendingVerification === "Menunggu" ? (
                        <>
                          <Button
                            size="sm"
                            className="h-9 w-9 p-0 gradient-brand text-brand-foreground"
                            title="Terima / Setujui"
                            aria-label="Terima"
                            onClick={() => setApprovingAccount(a)}
                          >
                            <ShieldCheck className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            className="h-9 w-9 p-0"
                            title="Tolak"
                            aria-label="Tolak"
                            onClick={() => { setRejecting(a); setRejectReason(""); }}
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </>
                      ) : a.rejectionNote?.startsWith("[Permintaan Nonaktif/Hapus]:") ? (
                        <>
                          <Button
                            size="sm"
                            className="h-9 w-9 p-0 gradient-brand text-brand-foreground"
                            title="Setujui Nonaktif"
                            aria-label="Setujui"
                            onClick={() => setApprovingDeactivation(a)}
                          >
                            <ShieldCheck className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            className="h-9 w-9 p-0"
                            title="Tolak Nonaktif"
                            aria-label="Tolak"
                            onClick={() => { setRejectingDeactivation(a); setDeactivateRejectReason(""); }}
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </>
                      ) : null}
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

      <Dialog open={!!detail} onOpenChange={(o) => !o && setDetail(null)}>
        <DialogContent className="sm:max-w-md">
          {detail && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    {detail.photoUrl && <AvatarImage src={detail.photoUrl} />}
                    <AvatarFallback className="gradient-brand text-brand-foreground">
                      {detail.accountName.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="truncate">{detail.accountName}</p>
                    <p className="truncate text-xs font-normal text-muted-foreground">{detail.username} · {detail.platform}</p>
                  </div>
                </DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-3 gap-2 rounded-xl border border-border p-3 text-center text-sm">
                <div><p className="font-bold">{detail.followers.toLocaleString("id-ID")}</p><p className="text-[10px] uppercase text-muted-foreground">Followers</p></div>
                <div><p className="font-bold">{detail.following.toLocaleString("id-ID")}</p><p className="text-[10px] uppercase text-muted-foreground">Following</p></div>
                <div><p className="font-bold">{detail.posts.toLocaleString("id-ID")}</p><p className="text-[10px] uppercase text-muted-foreground">Post</p></div>
              </div>
              <div className="space-y-2 text-sm">
                <p><span className="text-muted-foreground">Buzzer: </span><b>{detail.buzzerName}</b> ({detail.buzzerEmail})</p>
                <p><span className="text-muted-foreground">Kategori: </span>{detail.category}</p>
                <p className="flex items-start gap-1">
                  <span className="text-muted-foreground shrink-0">Link Profil: </span>
                  {getSocialProfileUrl(detail) ? (
                    <a
                      href={getSocialProfileUrl(detail)!}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 font-mono text-xs text-primary hover:underline break-all"
                      title={getSocialProfileUrl(detail)!}
                    >
                      <span>{detail.profileUrl}</span>
                      <ExternalLink className="h-3 w-3 shrink-0" />
                    </a>
                  ) : (
                    <span className="text-xs text-muted-foreground italic">Belum diisi</span>
                  )}
                </p>
                <p className="flex items-center gap-2"><span className="text-muted-foreground">Level: </span><LevelBadge followers={levelFollowers(detail.buzzerEmail)} />
                  <span className="text-xs text-muted-foreground">dari {levelFollowers(detail.buzzerEmail).toLocaleString("id-ID")} followers terverifikasi</span>
                </p>
                <p className="flex items-center gap-2">
                  <span className="text-muted-foreground">Status: </span>
                  {detail.rejectionNote?.startsWith("[Permintaan Nonaktif/Hapus]:") ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 dark:bg-rose-500/15 px-2.5 py-0.5 text-[10px] font-semibold text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                      <Power className="h-3 w-3" />
                      Menunggu Persetujuan Nonaktif
                    </span>
                  ) : detail.pendingVerification === "Menunggu" ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 dark:bg-amber-500/15 text-amber-700 dark:text-amber-300 px-2.5 py-0.5 text-[10px] font-semibold border border-amber-200 dark:border-amber-800">
                      <Clock className="h-3 w-3" />
                      Menunggu Pembaruan
                    </span>
                  ) : detail.verification === "Menunggu" ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 dark:bg-amber-500/15 text-amber-700 dark:text-amber-300 px-2.5 py-0.5 text-[10px] font-semibold border border-amber-200 dark:border-amber-800">
                      <Clock className="h-3 w-3" />
                      Belum Diverifikasi
                    </span>
                  ) : detail.isActive === false ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-zinc-100 dark:bg-zinc-800 px-2.5 py-0.5 text-[10px] font-semibold text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700">
                      <Power className="h-3 w-3" />
                      Dinonaktifkan
                    </span>
                  ) : (
                    <VerifBadge s={detail.verification} />
                  )}
                </p>
                {detail.pendingFollowers != null && <>
                  <p><span className="text-muted-foreground">Followers lama: </span>{detail.followers.toLocaleString("id-ID")}</p>
                  <p><span className="text-muted-foreground">Followers baru: </span><b>{detail.pendingFollowers.toLocaleString("id-ID")}</b></p>
                  <p><span className="text-muted-foreground">Status pengajuan: </span><VerifBadge s={detail.pendingVerification ?? "Menunggu"} /></p>
                  {detail.pendingSubmittedAt && <p><span className="text-muted-foreground">Tanggal pengajuan: </span>{new Date(detail.pendingSubmittedAt).toLocaleString("id-ID")}</p>}
                  {detail.pendingProofUrl && <a className="text-primary underline" href={detail.pendingProofUrl} target="_blank" rel="noreferrer">Lihat bukti followers terbaru</a>}
                  {detail.pendingRejectionNote && <p className="rounded-md bg-rose-500/10 p-2 text-rose-600">Alasan: {detail.pendingRejectionNote}</p>}
                </>}

                {detail.bio && <p className="text-muted-foreground italic">"{detail.bio}"</p>}
                {detail.rejectionNote && !detail.rejectionNote.startsWith("[Permintaan Nonaktif/Hapus]:") && (
                  <p className="rounded-md bg-rose-500/10 p-2 text-rose-600 dark:text-rose-300">
                    Catatan: {detail.rejectionNote.replace(/^\[Nonaktif\]:\s*/, "")}
                  </p>
                )}
                {detail.rejectionNote?.startsWith("[Permintaan Nonaktif/Hapus]:") && (
                  <p className="rounded-md bg-amber-500/10 p-2 text-amber-700 dark:text-amber-300">
                    Alasan Penonaktifan: {detail.rejectionNote.replace("[Permintaan Nonaktif/Hapus]: ", "")}
                  </p>
                )}
              </div>
              <DialogFooter className="gap-2">
                <Button variant="outline" onClick={() => {
                  const profileUrl = getSocialProfileUrl(detail);
                  if (!profileUrl) {
                    toast.error(detail.profileUrl.trim() ? "URL profil media sosial tidak valid." : "Link profil media sosial belum tersedia.");
                    return;
                  }
                  window.open(profileUrl, "_blank", "noopener,noreferrer");
                }}>
                  <ExternalLink className="mr-1 h-4 w-4" /> Buka Profil
                </Button>
                {detail.verification === "Terverifikasi" && !detail.pendingVerification && (
                  <Button variant="outline" className="h-9 w-9 p-0" title="Edit" aria-label="Edit" onClick={() => { setEditing(detail); setDetail(null); }}>
                    <Edit3 className="h-4 w-4" />
                  </Button>
                )}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {editing && (
        <AccountFormDialog
          initial={editing}
          existing={all.filter((x) => x.buzzerEmail === editing.buzzerEmail)}
          onClose={() => setEditing(null)}
          onDelete={() => {
            const target = editing;
            setEditing(null);
            setConfirmAction({ type: "delete", account: target });
          }}
          onSubmit={(data) => {
            adminUpdateAccount(editing.buzzerEmail, editing.id, data);
            toast.success(`Akun ${data.username} diperbarui`);
            setEditing(null);
            return true;
          }}
        />
      )}

      <Dialog open={!!rejecting} onOpenChange={(open) => !open && setRejecting(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {rejecting?.pendingVerification === "Menunggu"
                ? "Tolak Pembaruan Akun"
                : "Tolak Verifikasi Akun"}
            </DialogTitle>
            <DialogDescription>Alasan ini akan ditampilkan kepada buzzer.</DialogDescription>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            {rejecting?.pendingVerification === "Menunggu"
              ? "Berikan alasan penolakan pembaruan data/followers agar buzzer mengetahuinya."
              : "Berikan alasan agar buzzer dapat memperbaiki pengajuannya."}
          </p>
          <Textarea
            value={rejectReason}
            onChange={(event) => setRejectReason(event.target.value)}
            placeholder="Alasan penolakan..."
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejecting(null)}>Batal</Button>
            <Button
              variant="destructive"
              onClick={async () => {
                if (!rejecting) return;
                const ok = await adminRejectSocialAccount(rejecting.id, rejectReason);
                toast[ok ? "success" : "error"](ok ? "Penolakan berhasil disimpan" : "Gagal menolak verifikasi");
                if (ok) setRejecting(null);
              }}
            >
              Tolak
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog konfirmasi persetujuan akun / pembaruan media sosial */}
      <Dialog open={!!approvingAccount} onOpenChange={(open) => !open && setApprovingAccount(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-emerald-500" />
              {approvingAccount?.pendingVerification === "Menunggu"
                ? "Setujui Pembaruan Akun?"
                : "Setujui Akun Media Sosial?"}
            </DialogTitle>
            <DialogDescription>
              {approvingAccount?.pendingVerification === "Menunggu"
                ? "Konfirmasi persetujuan perubahan data atau followers akun buzzer."
                : "Konfirmasi persetujuan verifikasi akun media sosial ini."}
            </DialogDescription>
          </DialogHeader>
          {approvingAccount && (
            <div className="space-y-3 rounded-xl border border-border bg-muted/40 p-3 text-sm">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  {approvingAccount.photoUrl && <AvatarImage src={approvingAccount.photoUrl} />}
                  <AvatarFallback className="gradient-brand text-brand-foreground">
                    {approvingAccount.accountName.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold">{approvingAccount.accountName}</p>
                  <p className="truncate text-xs text-muted-foreground">{approvingAccount.username} · {approvingAccount.platform}</p>
                  <p className="truncate text-xs text-muted-foreground">{approvingAccount.buzzerEmail}</p>
                </div>
              </div>

              {approvingAccount.pendingFollowers != null && (
                <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-2.5 text-xs space-y-1">
                  <p className="font-semibold text-amber-700 dark:text-amber-300">Pembaruan Followers Diajukan:</p>
                  <div className="flex items-center justify-between text-foreground">
                    <span className="text-muted-foreground">Followers Sekarang:</span>
                    <span className="line-through">{approvingAccount.followers.toLocaleString("id-ID")}</span>
                  </div>
                  <div className="flex items-center justify-between font-bold text-amber-600 dark:text-amber-400">
                    <span>Followers Baru:</span>
                    <span>{approvingAccount.pendingFollowers.toLocaleString("id-ID")}</span>
                  </div>
                  {approvingAccount.pendingProofUrl && (
                    <div className="pt-1 border-t border-amber-500/20">
                      <a
                        href={approvingAccount.pendingProofUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-primary hover:underline font-medium"
                      >
                        Lihat Bukti Followers <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  )}
                </div>
              )}

              {getSocialProfileUrl(approvingAccount) && (
                <div className="text-xs">
                  <span className="text-muted-foreground">Link Profil: </span>
                  <a
                    href={getSocialProfileUrl(approvingAccount)!}
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary underline font-mono inline-flex items-center gap-1 max-w-full truncate"
                  >
                    <span className="truncate">{approvingAccount.profileUrl}</span>
                    <ExternalLink className="h-3 w-3 shrink-0" />
                  </a>
                </div>
              )}
              <div className="flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-2 text-xs text-emerald-700 dark:text-emerald-300">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {approvingAccount.pendingVerification === "Menunggu"
                  ? "Followers dan status akun akan disinkronkan sesuai pengajuan."
                  : "Akun ini akan langsung berstatus Terverifikasi dan aktif untuk campaign."}
              </div>
            </div>
          )}
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setApprovingAccount(null)}>Batal</Button>
            <Button
              className="gradient-brand text-brand-foreground"
              onClick={async () => {
                if (!approvingAccount) return;
                const ok = await adminApproveSocialAccount(approvingAccount.id);
                toast[ok ? "success" : "error"](ok ? "Persetujuan akun berhasil ✓" : "Gagal menyetujui verifikasi");
                if (ok) setApprovingAccount(null);
              }}
            >
              <ShieldCheck className="mr-1 h-4 w-4" />
              {approvingAccount?.pendingVerification === "Menunggu" ? "Ya, Setujui Pembaruan" : "Ya, Setujui Akun"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Konfirmasi Penonaktifan (Setuju) */}
      <Dialog open={!!approvingDeactivation} onOpenChange={(open) => !open && setApprovingDeactivation(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Power className="h-5 w-5 text-rose-500" />
              Setujui Penonaktifan?
            </DialogTitle>
            <DialogDescription>
              Konfirmasi persetujuan penonaktifan akun media sosial ini.
            </DialogDescription>
          </DialogHeader>
          {approvingDeactivation && (
            <div className="space-y-3 rounded-xl border border-border bg-muted/40 p-3 text-sm">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  {approvingDeactivation.photoUrl && <AvatarImage src={approvingDeactivation.photoUrl} />}
                  <AvatarFallback className="gradient-brand text-brand-foreground">
                    {approvingDeactivation.accountName.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold">{approvingDeactivation.accountName}</p>
                  <p className="truncate text-xs text-muted-foreground">{approvingDeactivation.username} · {approvingDeactivation.platform}</p>
                </div>
              </div>
              <div className="flex items-start gap-2 rounded-lg border border-rose-500/30 bg-rose-500/10 p-2 text-xs text-rose-700 dark:text-rose-300">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <p>Akun ini akan langsung <b>Dinonaktifkan</b> dan tidak bisa digunakan untuk mengambil job. Data tetap tersimpan sebagai riwayat.</p>
              </div>
            </div>
          )}
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setApprovingDeactivation(null)}>Batal</Button>
            <Button
              variant="destructive"
              onClick={async () => {
                if (!approvingDeactivation) return;
                const ok = await adminApproveDeactivationRequest(approvingDeactivation.id);
                toast[ok ? "success" : "error"](ok ? "Permintaan disetujui, akun dinonaktifkan." : "Gagal menyetujui permintaan");
                if (ok) setApprovingDeactivation(null);
              }}
            >
              <Power className="mr-1 h-4 w-4" /> Setujui
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Penolakan Penonaktifan */}
      <Dialog open={!!rejectingDeactivation} onOpenChange={(open) => !open && setRejectingDeactivation(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tolak Penonaktifan Akun</DialogTitle>
            <DialogDescription>Alasan ini akan ditampilkan kepada buzzer.</DialogDescription>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">Berikan alasan kenapa akun tidak boleh dinonaktifkan.</p>
          <Textarea 
            value={deactivateRejectReason} 
            onChange={(event) => setDeactivateRejectReason(event.target.value)} 
            placeholder="Alasan penolakan..." 
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectingDeactivation(null)}>Batal</Button>
            <Button 
              variant="destructive" 
              onClick={async () => { 
                if (!rejectingDeactivation) return;
                if (!deactivateRejectReason.trim()) {
                  toast.error("Alasan penolakan wajib diisi.");
                  return;
                }
                const ok = await adminRejectDeactivationRequest(rejectingDeactivation.id, deactivateRejectReason); 
                toast[ok ? "success" : "error"](ok ? "Permintaan penonaktifan ditolak" : "Gagal menolak permintaan"); 
                if (ok) setRejectingDeactivation(null); 
              }}
            >
              Tolak Permintaan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Konfirmasi Nonaktifkan / Hapus Akun (dari menu titik tiga) */}
      <Dialog open={!!confirmAction} onOpenChange={(open) => !open && !confirmBusy && setConfirmAction(null)}>
        <DialogContent className="sm:max-w-md">
          {confirmAction && (() => {
            const { type, account } = confirmAction;
            const isDelete = type === "delete";
            const willDeactivate = account.isActive !== false;
            const title = isDelete ? "Hapus Akun?" : willDeactivate ? "Nonaktifkan Akun?" : "Aktifkan Akun?";
            const desc = isDelete
              ? "Akun media sosial ini akan dihapus permanen dan tidak bisa dikembalikan."
              : willDeactivate
                ? "Akun ini tidak akan bisa digunakan untuk mengambil job sampai diaktifkan kembali."
                : "Akun ini akan kembali aktif dan bisa digunakan untuk mengambil job.";
            const danger = isDelete || willDeactivate;
            return (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    {isDelete
                      ? <Trash2 className="h-5 w-5 text-rose-500" />
                      : <Power className={cn("h-5 w-5", willDeactivate ? "text-rose-500" : "text-emerald-500")} />}
                    {title}
                  </DialogTitle>
                  <DialogDescription>{desc}</DialogDescription>
                </DialogHeader>
                <div className="space-y-3 rounded-xl border border-border bg-muted/40 p-3 text-sm">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      {account.photoUrl && <AvatarImage src={account.photoUrl} />}
                      <AvatarFallback className="gradient-brand text-brand-foreground">
                        {account.accountName.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold">{account.accountName}</p>
                      <p className="truncate text-xs text-muted-foreground">{account.username} · {account.platform} · {account.buzzerEmail}</p>
                    </div>
                  </div>
                  {danger && (
                    <div className="flex items-start gap-2 rounded-lg border border-rose-500/30 bg-rose-500/10 p-2 text-xs text-rose-700 dark:text-rose-300">
                      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                      <p>{isDelete ? <>Tindakan ini <b>tidak dapat dibatalkan</b>.</> : <>Akun akan langsung <b>dinonaktifkan</b>. Data tetap tersimpan sebagai riwayat.</>}</p>
                    </div>
                  )}
                </div>
                <DialogFooter className="gap-2">
                  <Button variant="outline" disabled={confirmBusy} onClick={() => setConfirmAction(null)}>Batal</Button>
                  <Button
                    id="confirm-social-action"
                    variant={danger ? "destructive" : "default"}
                    className={danger ? undefined : "gradient-brand text-brand-foreground"}
                    disabled={confirmBusy}
                    onClick={runConfirmAction}
                  >
                    {confirmBusy
                      ? <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                      : isDelete ? <Trash2 className="mr-1 h-4 w-4" /> : <Power className="mr-1 h-4 w-4" />}
                    {isDelete ? "Ya, Hapus Akun" : willDeactivate ? "Ya, Nonaktifkan" : "Ya, Aktifkan"}
                  </Button>
                </DialogFooter>
              </>
            );
          })()}
        </DialogContent>
      </Dialog>

    </div>
  );
}
