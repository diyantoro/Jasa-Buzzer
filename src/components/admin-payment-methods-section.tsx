import { useMemo, useRef, useState } from "react";
import {
  Building2, Check, Copy, CreditCard, Edit3, Plus, Power,
  QrCode, Search, Trash2, Upload, AlertCircle, ShieldCheck,
  ImageIcon, RefreshCw, Wallet
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { StatCard } from "@/components/dashboard-shell";
import {
  useAdminBankAccounts, POPULAR_BANKS, type AdminBankAccount,
} from "@/lib/admin-bank-store";
import { useQrisSettings } from "@/lib/qris-store";
import { cn } from "@/lib/utils";

export function AdminPaymentMethodsSection() {
  const {
    accounts: bankAccounts,
    activeAccounts,
    loading: bankLoading,
    addAccount,
    updateAccount,
    deleteAccount,
    toggleActive,
  } = useAdminBankAccounts();

  const qris = useQrisSettings();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [query, setQuery] = useState("");
  const [bankDialogOpen, setBankDialogOpen] = useState(false);
  const [editingBank, setEditingBank] = useState<AdminBankAccount | null>(null);
  const [deletingBank, setDeletingBank] = useState<AdminBankAccount | null>(null);
  const [savingBank, setSavingBank] = useState(false);

  // QRIS State
  const [qrisMerchantInput, setQrisMerchantInput] = useState(qris.merchantName);
  const [isDeletingQris, setIsDeletingQris] = useState(false);
  const [uploadingQris, setUploadingQris] = useState(false);

  // Bank Form State
  const [bankForm, setBankForm] = useState({
    bankName: "BCA",
    customBankName: "",
    accountNumber: "",
    accountHolder: "",
    isActive: true,
  });

  const filteredBanks = useMemo(() => {
    if (!query.trim()) return bankAccounts;
    const q = query.toLowerCase();
    return bankAccounts.filter(
      (b) =>
        b.bankName.toLowerCase().includes(q) ||
        b.accountNumber.toLowerCase().includes(q) ||
        b.accountHolder.toLowerCase().includes(q)
    );
  }, [bankAccounts, query]);

  const handleOpenAddDialog = () => {
    setEditingBank(null);
    setBankForm({
      bankName: "BCA",
      customBankName: "",
      accountNumber: "",
      accountHolder: "",
      isActive: true,
    });
    setBankDialogOpen(true);
  };

  const handleOpenEditDialog = (bank: AdminBankAccount) => {
    setEditingBank(bank);
    const isPopular = POPULAR_BANKS.includes(bank.bankName);
    setBankForm({
      bankName: isPopular ? bank.bankName : "Lainnya",
      customBankName: isPopular ? "" : bank.bankName,
      accountNumber: bank.accountNumber,
      accountHolder: bank.accountHolder,
      isActive: bank.isActive,
    });
    setBankDialogOpen(true);
  };

  const handleSaveBank = async () => {
    const finalBankName =
      bankForm.bankName === "Lainnya"
        ? bankForm.customBankName.trim()
        : bankForm.bankName;

    if (!finalBankName) {
      toast.error("Nama bank wajib diisi");
      return;
    }
    if (!bankForm.accountNumber.trim()) {
      toast.error("Nomor rekening wajib diisi");
      return;
    }
    if (!bankForm.accountHolder.trim()) {
      toast.error("Nama pemilik rekening (atas nama) wajib diisi");
      return;
    }

    setSavingBank(true);
    try {
      if (editingBank) {
        await updateAccount(editingBank.id, {
          bankName: finalBankName,
          accountNumber: bankForm.accountNumber.trim(),
          accountHolder: bankForm.accountHolder.trim(),
          isActive: bankForm.isActive,
        });
        toast.success(`Rekening ${finalBankName} berhasil diperbarui`);
      } else {
        await addAccount({
          bankName: finalBankName,
          accountNumber: bankForm.accountNumber.trim(),
          accountHolder: bankForm.accountHolder.trim(),
          isActive: bankForm.isActive,
        });
        toast.success(`Rekening ${finalBankName} berhasil ditambahkan`);
      }
      setBankDialogOpen(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal menyimpan rekening");
    } finally {
      setSavingBank(false);
    }
  };

  const handleDeleteBank = async () => {
    if (!deletingBank) return;
    try {
      await deleteAccount(deletingBank.id);
      toast.success(`Rekening ${deletingBank.bankName} berhasil dihapus`);
      setDeletingBank(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal menghapus rekening");
    }
  };

  const handleToggle = async (bank: AdminBankAccount) => {
    try {
      await toggleActive(bank.id, !bank.isActive);
      toast.success(
        `Rekening ${bank.bankName} ${!bank.isActive ? "diaktifkan" : "dinonaktifkan"}`
      );
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal mengubah status");
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    try {
      void navigator.clipboard.writeText(text);
      toast.success(`${label} berhasil disalin!`);
    } catch {
      toast.error("Gagal menyalin");
    }
  };

  // QRIS Handlers
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingQris(true);
    try {
      await qris.uploadQrisImage(file);
      toast.success("Barcode QRIS baru berhasil diunggah!");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal mengunggah QRIS");
    } finally {
      setUploadingQris(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleSaveMerchantName = async () => {
    if (!qrisMerchantInput.trim()) {
      toast.error("Nama merchant QRIS tidak boleh kosong");
      return;
    }
    try {
      await qris.updateSettings({ merchantName: qrisMerchantInput.trim() });
      toast.success("Nama merchant QRIS diperbarui");
    } catch (err) {
      toast.error("Gagal memperbarui nama merchant");
    }
  };

  const handleDeleteQris = async () => {
    try {
      await qris.removeQrisImage();
      toast.success("Barcode QRIS berhasil dihapus");
      setIsDeletingQris(false);
    } catch (err) {
      toast.error("Gagal menghapus barcode QRIS");
    }
  };

  return (
    <div className="space-y-6">
      {/* Metric Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          icon={<Building2 className="h-5 w-5 text-primary" />}
          label="Rekening Bank Aktif"
          value={bankLoading ? "..." : `${activeAccounts.length} dari ${bankAccounts.length}`}
          hint="Metode Transfer Bank"
        />
        <StatCard
          icon={<QrCode className="h-5 w-5 text-emerald-500" />}
          label="Status QRIS Merchant"
          value={qris.isEnabled ? "Aktif" : "Nonaktif / Belum Ada"}
          hint={qris.imageUrl ? "Barcode Siap Digunakan" : "Barcode Belum Diunggah"}
        />
        <StatCard
          icon={<Wallet className="h-5 w-5 text-amber-500" />}
          label="Saluran Pembayaran"
          value={`${activeAccounts.length + (qris.isEnabled ? 1 : 0)} Saluran Aktif`}
          hint="Bank & QRIS Merchant"
        />
        <StatCard
          icon={<ShieldCheck className="h-5 w-5 text-indigo-500" />}
          label="Sistem Verifikasi"
          value="Manual Admin"
          hint="Semua transaksi diverifikasi Admin"
        />
      </div>

      {/* ================= SECTION 1: QRIS MERCHANT ================= */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-4">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-500/10 text-emerald-600">
              <QrCode className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-display text-lg font-bold">Metode Pembayaran QRIS</h2>
              <p className="text-xs text-muted-foreground">
                Kelola barcode QRIS merchant yang dapat di-scan langsung oleh customer.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-auto">
            <span className="text-xs font-semibold text-muted-foreground">
              {qris.settings.isEnabled ? "Status: Aktif" : "Status: Nonaktif"}
            </span>
            <Switch
              checked={qris.settings.isEnabled}
              onCheckedChange={(checked) => {
                void qris.toggleQris(checked);
                toast.success(`QRIS ${checked ? "diaktifkan" : "dinonaktifkan"}`);
              }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-6 items-start">
          {/* QRIS Image Preview */}
          <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-muted/20 p-4 text-center">
            {qris.imageUrl ? (
              <div className="space-y-2">
                <div className="rounded-xl border border-border bg-white p-3 shadow-xs">
                  <img
                    src={qris.imageUrl}
                    alt="QRIS Merchant Barcode"
                    className="mx-auto block h-48 w-48 object-contain"
                  />
                </div>
                <p className="text-xs font-semibold text-foreground truncate max-w-[200px]">
                  {qris.merchantName}
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-muted-foreground space-y-2">
                <ImageIcon className="h-10 w-10 stroke-1" />
                <p className="text-xs font-medium">Belum ada barcode QRIS</p>
                <p className="text-[11px] text-muted-foreground text-center">
                  Unggah barcode QRIS merchant Anda di sini.
                </p>
              </div>
            )}
          </div>

          {/* QRIS Controls & Settings */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Nama Merchant QRIS</Label>
              <div className="flex gap-2 max-w-md">
                <Input
                  value={qrisMerchantInput}
                  onChange={(e) => setQrisMerchantInput(e.target.value)}
                  placeholder="Contoh: BUZZPRO / BuzzHub"
                />
                <Button variant="secondary" onClick={handleSaveMerchantName}>
                  Simpan
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Nama ini akan ditampilkan di bawah gambar QRIS pada modal checkout customer.
              </p>
            </div>

            <div className="space-y-2 pt-2 border-t border-border/80">
              <Label className="text-sm font-semibold">Kelola Gambar Barcode</Label>
              <div className="flex flex-wrap items-center gap-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png, image/jpeg, image/jpg, image/webp"
                  className="hidden"
                  onChange={handleFileUpload}
                />
                <Button
                  className="gradient-brand text-brand-foreground gap-2"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingQris}
                >
                  <Upload className="h-4 w-4" />
                  {uploadingQris ? "Mengunggah..." : qris.imageUrl ? "Ganti Barcode QRIS" : "Unggah Barcode QRIS"}
                </Button>

                {qris.imageUrl && (
                  <Button
                    variant="outline"
                    className="text-rose-600 hover:bg-rose-50 hover:text-rose-700 dark:hover:bg-rose-950/40 gap-2"
                    onClick={() => setIsDeletingQris(true)}
                  >
                    <Trash2 className="h-4 w-4" /> Hapus Barcode
                  </Button>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Format yang didukung: PNG, JPG, WEBP. Maksimal 5 MB.
              </p>
            </div>

            <div className="rounded-xl border border-primary/20 bg-primary/5 p-3 text-xs text-muted-foreground">
              💡 <b>Catatan</b>: Metode pembayaran QRIS hanya akan muncul di akun customer jika QRIS berstatus <b>Aktif</b> dan gambar barcode sudah diunggah.
            </div>
          </div>
        </div>
      </div>

      {/* ================= SECTION 2: TRANSFER BANK ================= */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-display text-lg font-bold">Metode Pembayaran Transfer Bank</h2>
              <p className="text-xs text-muted-foreground">
                Kelola daftar rekening bank tujuan transfer customer.
              </p>
            </div>
          </div>
          <Button
            onClick={handleOpenAddDialog}
            className="gradient-brand text-brand-foreground gap-2 shrink-0 self-start sm:self-auto"
          >
            <Plus className="h-4 w-4" /> Tambah Rekening
          </Button>
        </div>

        {/* Filter bar */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Cari bank, nomor rekening, atau atas nama..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {/* Table of bank accounts */}
        <div className="rounded-xl border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[180px]">Nama Bank</TableHead>
                <TableHead>Nomor Rekening</TableHead>
                <TableHead>Atas Nama (A/N)</TableHead>
                <TableHead className="w-[120px] text-center">Status</TableHead>
                <TableHead className="w-[140px] text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBanks.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
                    {query ? "Tidak ada rekening yang sesuai dengan pencarian." : "Belum ada rekening bank yang ditambahkan."}
                  </TableCell>
                </TableRow>
              ) : (
                filteredBanks.map((bank) => (
                  <TableRow key={bank.id}>
                    <TableCell className="font-semibold">
                      <div className="flex items-center gap-2">
                        <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary font-bold text-xs uppercase">
                          {bank.bankName.slice(0, 3)}
                        </span>
                        <span>Bank {bank.bankName}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-semibold tracking-wider">
                          {bank.accountNumber}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-muted-foreground hover:text-foreground"
                          title="Salin nomor rekening"
                          onClick={() => copyToClipboard(bank.accountNumber, "Nomor rekening")}
                        >
                          <Copy className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium text-foreground">
                      {bank.accountHolder}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Switch
                          checked={bank.isActive}
                          onCheckedChange={() => handleToggle(bank)}
                        />
                        <span
                          className={cn(
                            "text-xs font-semibold",
                            bank.isActive ? "text-emerald-600" : "text-muted-foreground"
                          )}
                        >
                          {bank.isActive ? "Aktif" : "Nonaktif"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-foreground"
                          title="Edit rekening"
                          onClick={() => handleOpenEditDialog(bank)}
                        >
                          <Edit3 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-rose-500 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40"
                          title="Hapus rekening"
                          onClick={() => setDeletingBank(bank)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* MODAL: Tambah / Edit Rekening Bank */}
      <Dialog open={bankDialogOpen} onOpenChange={setBankDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingBank ? "Edit Rekening Bank Admin" : "Tambah Rekening Bank Admin"}
            </DialogTitle>
            <DialogDescription>
              Rekening ini digunakan sebagai tujuan pembayaran transfer oleh customer.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Pilih Bank</Label>
              <Select
                value={bankForm.bankName}
                onValueChange={(val) => setBankForm({ ...bankForm, bankName: val })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih bank" />
                </SelectTrigger>
                <SelectContent>
                  {POPULAR_BANKS.map((b) => (
                    <SelectItem key={b} value={b}>
                      Bank {b}
                    </SelectItem>
                  ))}
                  <SelectItem value="Lainnya">Bank Lainnya</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {bankForm.bankName === "Lainnya" && (
              <div className="space-y-2">
                <Label>Nama Bank</Label>
                <Input
                  placeholder="Contoh: CIMB Niaga, Permata, Danamon"
                  value={bankForm.customBankName}
                  onChange={(e) =>
                    setBankForm({ ...bankForm, customBankName: e.target.value })
                  }
                />
              </div>
            )}

            <div className="space-y-2">
              <Label>Nomor Rekening</Label>
              <Input
                placeholder="Contoh: 1234567890"
                value={bankForm.accountNumber}
                onChange={(e) =>
                  setBankForm({
                    ...bankForm,
                    accountNumber: e.target.value.replace(/[^0-9]/g, ""),
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Atas Nama (Pemilik Rekening)</Label>
              <Input
                placeholder="Contoh: Admin BuzzHub"
                value={bankForm.accountHolder}
                onChange={(e) =>
                  setBankForm({ ...bankForm, accountHolder: e.target.value })
                }
              />
            </div>

            <div className="flex items-center justify-between rounded-xl border border-border p-3">
              <div>
                <Label className="cursor-pointer">Status Aktif</Label>
                <p className="text-xs text-muted-foreground">
                  Hanya rekening aktif yang muncul sebagai opsi bagi customer.
                </p>
              </div>
              <Switch
                checked={bankForm.isActive}
                onCheckedChange={(checked) =>
                  setBankForm({ ...bankForm, isActive: checked })
                }
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setBankDialogOpen(false)}
              disabled={savingBank}
            >
              Batal
            </Button>
            <Button
              className="gradient-brand text-brand-foreground"
              onClick={handleSaveBank}
              disabled={savingBank}
            >
              {savingBank ? "Menyimpan..." : editingBank ? "Simpan Perubahan" : "Tambah Rekening"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ALERT DIALOG: Hapus Barcode QRIS */}
      <AlertDialog open={isDeletingQris} onOpenChange={setIsDeletingQris}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Barcode QRIS?</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus barcode QRIS ini? Setelah dihapus, metode pembayaran QRIS tidak akan muncul di halaman checkout customer sampai Anda mengunggah barcode baru.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              className="bg-rose-600 hover:bg-rose-700 text-white"
              onClick={handleDeleteQris}
            >
              Ya, Hapus Barcode QRIS
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* ALERT DIALOG: Hapus Rekening Bank */}
      <AlertDialog open={!!deletingBank} onOpenChange={(open) => !open && setDeletingBank(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Rekening Bank?</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus rekening <b>Bank {deletingBank?.bankName} ({deletingBank?.accountNumber})</b>? Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              className="bg-rose-600 hover:bg-rose-700 text-white"
              onClick={handleDeleteBank}
            >
              Ya, Hapus Rekening
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
