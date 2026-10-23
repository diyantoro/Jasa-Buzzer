import { useEffect, useState } from "react";
import {
  Bell,
  CheckCircle2,
  Inbox,
  RotateCcw,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Star,
  Wallet,
  XCircle,
  Check,
  Moon,
  Sun,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { useTheme } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";
import {
  getBuzzerNotifPreferences,
  type BuzzerNotifPreferences,
} from "@/components/buzzer-notif-settings-dialog";

function getStorageKey(email?: string | null) {
  const clean = (email || "").trim().toLowerCase();
  return clean ? `buzzhub.buzzer.notifications.${clean}` : "buzzhub.buzzer.notifications.default";
}

const DEFAULT_PREFERENCES: BuzzerNotifPreferences = {
  newTask: true,
  taskApproved: true,
  taskRejected: true,
  verification: true,
  payout: true,
  rating: true,
  levelUp: true,
  inApp: true,
  emailWhatsapp: true,
};

export function BuzzerSettingsSection({ buzzerEmail }: { buzzerEmail?: string | null }) {
  const { theme, setTheme } = useTheme();
  const [prefs, setPrefs] = useState<BuzzerNotifPreferences>(() =>
    getBuzzerNotifPreferences(buzzerEmail),
  );
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setPrefs(getBuzzerNotifPreferences(buzzerEmail));
  }, [buzzerEmail]);

  const toggle = (key: keyof BuzzerNotifPreferences) => {
    setPrefs((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      try {
        localStorage.setItem(getStorageKey(buzzerEmail), JSON.stringify(next));
        if (typeof window !== "undefined") {
          window.dispatchEvent(new Event("storage"));
          window.dispatchEvent(new CustomEvent("buzzhub_buzzer_notif_prefs_changed", { detail: next }));
        }
      } catch {
        // safe-fail
      }
      return next;
    });
  };

  const handleSave = () => {
    setSaving(true);
    try {
      localStorage.setItem(getStorageKey(buzzerEmail), JSON.stringify(prefs));
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("storage"));
        window.dispatchEvent(new CustomEvent("buzzhub_buzzer_notif_prefs_changed", { detail: prefs }));
      }
      toast.success("Pengaturan notifikasi buzzer berhasil disimpan ✓");
    } catch {
      toast.error("Gagal menyimpan pengaturan.");
    } finally {
      setTimeout(() => setSaving(false), 300);
    }
  };

  const handleReset = () => {
    setPrefs({ ...DEFAULT_PREFERENCES });
    try {
      localStorage.setItem(getStorageKey(buzzerEmail), JSON.stringify(DEFAULT_PREFERENCES));
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("storage"));
        window.dispatchEvent(new CustomEvent("buzzhub_buzzer_notif_prefs_changed", { detail: DEFAULT_PREFERENCES }));
      }
      toast.info("Pengaturan notifikasi dikembalikan ke default");
    } catch {
      // safe-fail
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl gradient-brand text-brand-foreground shadow-sm">
              <Bell className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-display text-lg font-bold">Pengaturan Notifikasi Buzzer</h2>
              <p className="text-xs text-muted-foreground sm:text-sm">
                Atur pemberitahuan apa saja yang ingin kamu terima agar tetap update tanpa terganggu.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 pt-2 sm:pt-0">
            <Button size="sm" variant="outline" onClick={handleReset} className="h-9 text-xs">
              <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
              Reset Default
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              disabled={saving}
              className="h-9 gradient-brand text-brand-foreground text-xs"
            >
              <Check className="mr-1.5 h-3.5 w-3.5" />
              {saving ? "Menyimpan..." : "Simpan Perubahan"}
            </Button>
          </div>
        </div>
      </div>

      {/* Pengaturan Tema & Tampilan */}
      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-4">
        <div className="flex items-center gap-2 border-b border-border pb-3">
          <Sun className="h-4 w-4 text-amber-500" />
          <h3 className="font-semibold text-sm">Tema & Tampilan Antarmuka</h3>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-border/60 bg-muted/30 p-4">
          <div>
            <p className="text-sm font-semibold">Mode Gelap / Terang</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Ubah gaya tampilan aplikasi sesuai kenyamanan Anda (Tema Terang atau Tema Gelap).
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button
              type="button"
              size="sm"
              variant={theme === "light" ? "default" : "outline"}
              className={cn("h-8 text-xs gap-1.5", theme === "light" && "gradient-brand text-brand-foreground font-semibold")}
              onClick={() => setTheme("light")}
            >
              <Sun className="h-3.5 w-3.5" /> Mode Terang
            </Button>
            <Button
              type="button"
              size="sm"
              variant={theme === "dark" ? "default" : "outline"}
              className={cn("h-8 text-xs gap-1.5", theme === "dark" && "gradient-brand text-brand-foreground font-semibold")}
              onClick={() => setTheme("dark")}
            >
              <Moon className="h-3.5 w-3.5" /> Mode Gelap
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Saluran Notifikasi */}
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-border pb-3">
            <Smartphone className="h-4 w-4 text-primary" />
            <h3 className="font-semibold text-sm">Saluran Pemberitahuan</h3>
          </div>

          <div className="space-y-3">
            <div className="flex items-start justify-between gap-3 rounded-xl border border-border/60 bg-muted/30 p-3.5 transition-colors hover:bg-muted/50">
              <div className="flex items-start gap-3">
                <Bell className="mt-0.5 h-4 w-4 text-primary shrink-0" />
                <div>
                  <p className="text-sm font-semibold">Notifikasi Dalam Aplikasi (In-App)</p>
                  <p className="text-xs text-muted-foreground">
                    Tampilkan badge dan pesan pada ikon lonceng saat aplikasi dibuka.
                  </p>
                </div>
              </div>
              <Switch checked={prefs.inApp} onCheckedChange={() => toggle("inApp")} />
            </div>

            <div className="flex items-start justify-between gap-3 rounded-xl border border-border/60 bg-muted/30 p-3.5 transition-colors hover:bg-muted/50">
              <div className="flex items-start gap-3">
                <Inbox className="mt-0.5 h-4 w-4 text-primary shrink-0" />
                <div>
                  <p className="text-sm font-semibold">Email & Pesan Langsung</p>
                  <p className="text-xs text-muted-foreground">
                    Kirim ringkasan informasi penting ke alamat email terdaftar buzzer.
                  </p>
                </div>
              </div>
              <Switch checked={prefs.emailWhatsapp} onCheckedChange={() => toggle("emailWhatsapp")} />
            </div>
          </div>
        </div>

        {/* Notifikasi Job & Pengerjaan */}
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-border pb-3">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            <h3 className="font-semibold text-sm">Aktivitas Pekerjaan & Job</h3>
          </div>

          <div className="space-y-3">
            <div className="flex items-start justify-between gap-3 rounded-xl border border-border/60 bg-muted/30 p-3.5 transition-colors hover:bg-muted/50">
              <div className="flex items-start gap-3">
                <Sparkles className="mt-0.5 h-4 w-4 text-amber-500 shrink-0" />
                <div>
                  <p className="text-sm font-semibold">Job Baru Tersedia</p>
                  <p className="text-xs text-muted-foreground">
                    Dapatkan info saat kampanye baru tersedia untuk platform & level Anda.
                  </p>
                </div>
              </div>
              <Switch checked={prefs.newTask} onCheckedChange={() => toggle("newTask")} />
            </div>

            <div className="flex items-start justify-between gap-3 rounded-xl border border-border/60 bg-muted/30 p-3.5 transition-colors hover:bg-muted/50">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-500 shrink-0" />
                <div>
                  <p className="text-sm font-semibold">Bukti Pengerjaan Disetujui</p>
                  <p className="text-xs text-muted-foreground">
                    Pemberitahuan saat bukti submit job berhasil diverifikasi admin.
                  </p>
                </div>
              </div>
              <Switch checked={prefs.taskApproved} onCheckedChange={() => toggle("taskApproved")} />
            </div>

            <div className="flex items-start justify-between gap-3 rounded-xl border border-border/60 bg-muted/30 p-3.5 transition-colors hover:bg-muted/50">
              <div className="flex items-start gap-3">
                <XCircle className="mt-0.5 h-4 w-4 text-rose-500 shrink-0" />
                <div>
                  <p className="text-sm font-semibold">Job Ditolak / Perlu Revisi</p>
                  <p className="text-xs text-muted-foreground">
                    Pemberitahuan saat bukti pengerjaan ditolak lengkap dengan alasannya.
                  </p>
                </div>
              </div>
              <Switch checked={prefs.taskRejected} onCheckedChange={() => toggle("taskRejected")} />
            </div>
          </div>
        </div>

        {/* Akun, Keuangan & Level */}
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-4 md:col-span-2">
          <div className="flex items-center gap-2 border-b border-border pb-3">
            <Wallet className="h-4 w-4 text-primary" />
            <h3 className="font-semibold text-sm">Akun, Keuangan & Peringkat Level</h3>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="flex items-start justify-between gap-3 rounded-xl border border-border/60 bg-muted/30 p-3.5 transition-colors hover:bg-muted/50">
              <div className="flex items-start gap-3">
                <ShieldCheck className="mt-0.5 h-4 w-4 text-sky-500 shrink-0" />
                <div>
                  <p className="text-sm font-semibold">Verifikasi Akun Media Sosial</p>
                  <p className="text-xs text-muted-foreground">
                    Pemberitahuan ketika akun Instagram/TikTok/X disetujui atau ditolak admin.
                  </p>
                </div>
              </div>
              <Switch checked={prefs.verification} onCheckedChange={() => toggle("verification")} />
            </div>

            <div className="flex items-start justify-between gap-3 rounded-xl border border-border/60 bg-muted/30 p-3.5 transition-colors hover:bg-muted/50">
              <div className="flex items-start gap-3">
                <Wallet className="mt-0.5 h-4 w-4 text-emerald-500 shrink-0" />
                <div>
                  <p className="text-sm font-semibold">Pencairan Saldo (Payout)</p>
                  <p className="text-xs text-muted-foreground">
                    Konfirmasi transfer dan pencairan saldo masuk ke rekening atau e-wallet.
                  </p>
                </div>
              </div>
              <Switch checked={prefs.payout} onCheckedChange={() => toggle("payout")} />
            </div>

            <div className="flex items-start justify-between gap-3 rounded-xl border border-border/60 bg-muted/30 p-3.5 transition-colors hover:bg-muted/50">
              <div className="flex items-start gap-3">
                <Star className="mt-0.5 h-4 w-4 text-amber-500 shrink-0" />
                <div>
                  <p className="text-sm font-semibold">Ulasan & Rating Customer</p>
                  <p className="text-xs text-muted-foreground">
                    Dapatkan info saat customer memberikan bintang ulasan atas job yang kamu selesaikan.
                  </p>
                </div>
              </div>
              <Switch checked={prefs.rating} onCheckedChange={() => toggle("rating")} />
            </div>

            <div className="flex items-start justify-between gap-3 rounded-xl border border-border/60 bg-muted/30 p-3.5 transition-colors hover:bg-muted/50">
              <div className="flex items-start gap-3">
                <Sparkles className="mt-0.5 h-4 w-4 text-purple-500 shrink-0" />
                <div>
                  <p className="text-sm font-semibold">Kenaikan Level Buzzer</p>
                  <p className="text-xs text-muted-foreground">
                    Pemberitahuan ketika level akun buzzer kamu naik ke tingkat berikutnya.
                  </p>
                </div>
              </div>
              <Switch checked={prefs.levelUp} onCheckedChange={() => toggle("levelUp")} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
