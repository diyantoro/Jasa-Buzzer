import { useEffect, useState } from "react";
import {
  Bell,
  Check,
  CheckCircle2,
  CreditCard,
  Inbox,
  Megaphone,
  RotateCcw,
  ShoppingBag,
  Smartphone,
  Star,
  Moon,
  Sun,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { useTheme } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";
import {
  getCustomerNotifPreferences,
  type CustomerNotifPreferences,
} from "@/components/customer-notif-settings-dialog";

function getStorageKey(email?: string | null) {
  const clean = (email || "").trim().toLowerCase();
  return clean ? `buzzhub.customer.notifications.${clean}` : "buzzhub.customer.notifications.default";
}

const DEFAULT_PREFERENCES: CustomerNotifPreferences = {
  orderStatus: true,
  payment: true,
  buzzerProof: true,
  reviewReminder: true,
  systemPromo: true,
  inApp: true,
  emailWhatsapp: true,
};

export function CustomerSettingsSection({ customerEmail }: { customerEmail?: string | null }) {
  const { theme, setTheme } = useTheme();
  const [prefs, setPrefs] = useState<CustomerNotifPreferences>(() =>
    getCustomerNotifPreferences(customerEmail),
  );
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setPrefs(getCustomerNotifPreferences(customerEmail));
  }, [customerEmail]);

  const toggle = (key: keyof CustomerNotifPreferences) => {
    setPrefs((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      try {
        localStorage.setItem(getStorageKey(customerEmail), JSON.stringify(next));
        if (typeof window !== "undefined") {
          window.dispatchEvent(new Event("storage"));
          window.dispatchEvent(new CustomEvent("buzzhub_customer_notif_prefs_changed", { detail: next }));
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
      localStorage.setItem(getStorageKey(customerEmail), JSON.stringify(prefs));
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("storage"));
        window.dispatchEvent(new CustomEvent("buzzhub_customer_notif_prefs_changed", { detail: prefs }));
      }
      toast.success("Pengaturan notifikasi customer berhasil disimpan ✓");
    } catch {
      toast.error("Gagal menyimpan pengaturan.");
    } finally {
      setTimeout(() => setSaving(false), 300);
    }
  };

  const handleReset = () => {
    setPrefs({ ...DEFAULT_PREFERENCES });
    try {
      localStorage.setItem(getStorageKey(customerEmail), JSON.stringify(DEFAULT_PREFERENCES));
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("storage"));
        window.dispatchEvent(new CustomEvent("buzzhub_customer_notif_prefs_changed", { detail: DEFAULT_PREFERENCES }));
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
              <h2 className="font-display text-lg font-bold">Pengaturan Notifikasi Customer</h2>
              <p className="text-xs text-muted-foreground sm:text-sm">
                Atur notifikasi pembaruan pesanan kampanye, tagihan, dan bukti pengerjaan buzzer.
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
            <h3 className="font-semibold text-sm">Saluran Notifikasi</h3>
          </div>

          <div className="space-y-3">
            <div className="flex items-start justify-between gap-3 rounded-xl border border-border/60 bg-muted/30 p-3.5 transition-colors hover:bg-muted/50">
              <div className="flex items-start gap-3">
                <Bell className="mt-0.5 h-4 w-4 text-primary shrink-0" />
                <div>
                  <p className="text-sm font-semibold">Notifikasi Dalam Aplikasi (In-App)</p>
                  <p className="text-xs text-muted-foreground">
                    Tampilkan badge dan daftar notifikasi di dashboard aplikasi.
                  </p>
                </div>
              </div>
              <Switch checked={prefs.inApp} onCheckedChange={() => toggle("inApp")} />
            </div>

            <div className="flex items-start justify-between gap-3 rounded-xl border border-border/60 bg-muted/30 p-3.5 transition-colors hover:bg-muted/50">
              <div className="flex items-start gap-3">
                <Inbox className="mt-0.5 h-4 w-4 text-primary shrink-0" />
                <div>
                  <p className="text-sm font-semibold">Email & Pesan Tagihan</p>
                  <p className="text-xs text-muted-foreground">
                    Kirim bukti tagihan, invoice pembayaran, dan ringkasan ke email customer.
                  </p>
                </div>
              </div>
              <Switch checked={prefs.emailWhatsapp} onCheckedChange={() => toggle("emailWhatsapp")} />
            </div>
          </div>
        </div>

        {/* Notifikasi Pesanan & Pembayaran */}
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-border pb-3">
            <ShoppingBag className="h-4 w-4 text-emerald-500" />
            <h3 className="font-semibold text-sm">Pesanan & Pembayaran</h3>
          </div>

          <div className="space-y-3">
            <div className="flex items-start justify-between gap-3 rounded-xl border border-border/60 bg-muted/30 p-3.5 transition-colors hover:bg-muted/50">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-500 shrink-0" />
                <div>
                  <p className="text-sm font-semibold">Update Status Pesanan</p>
                  <p className="text-xs text-muted-foreground">
                    Info saat pesanan kampanye mulai dikerjakan buzzer atau telah selesai.
                  </p>
                </div>
              </div>
              <Switch checked={prefs.orderStatus} onCheckedChange={() => toggle("orderStatus")} />
            </div>

            <div className="flex items-start justify-between gap-3 rounded-xl border border-border/60 bg-muted/30 p-3.5 transition-colors hover:bg-muted/50">
              <div className="flex items-start gap-3">
                <CreditCard className="mt-0.5 h-4 w-4 text-sky-500 shrink-0" />
                <div>
                  <p className="text-sm font-semibold">Status Pembayaran & Tagihan</p>
                  <p className="text-xs text-muted-foreground">
                    Pemberitahuan saat transfer berhasil diverifikasi lunas oleh admin.
                  </p>
                </div>
              </div>
              <Switch checked={prefs.payment} onCheckedChange={() => toggle("payment")} />
            </div>

            <div className="flex items-start justify-between gap-3 rounded-xl border border-border/60 bg-muted/30 p-3.5 transition-colors hover:bg-muted/50">
              <div className="flex items-start gap-3">
                <Megaphone className="mt-0.5 h-4 w-4 text-primary shrink-0" />
                <div>
                  <p className="text-sm font-semibold">Bukti Pekerjaan Buzzer</p>
                  <p className="text-xs text-muted-foreground">
                    Info ketika buzzer selesai mengunggah link atau tangkapan layar pengerjaan.
                  </p>
                </div>
              </div>
              <Switch checked={prefs.buzzerProof} onCheckedChange={() => toggle("buzzerProof")} />
            </div>
          </div>
        </div>

        {/* Ulasan & Promosi */}
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-4 md:col-span-2">
          <div className="flex items-center gap-2 border-b border-border pb-3">
            <Star className="h-4 w-4 text-amber-500" />
            <h3 className="font-semibold text-sm">Ulasan & Informasi Sistem</h3>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="flex items-start justify-between gap-3 rounded-xl border border-border/60 bg-muted/30 p-3.5 transition-colors hover:bg-muted/50">
              <div className="flex items-start gap-3">
                <Star className="mt-0.5 h-4 w-4 text-amber-500 shrink-0" />
                <div>
                  <p className="text-sm font-semibold">Pengingat Beri Rating & Ulasan</p>
                  <p className="text-xs text-muted-foreground">
                    Pengingat untuk menilai performa buzzer setelah kampanye berhasil selesai.
                  </p>
                </div>
              </div>
              <Switch checked={prefs.reviewReminder} onCheckedChange={() => toggle("reviewReminder")} />
            </div>

            <div className="flex items-start justify-between gap-3 rounded-xl border border-border/60 bg-muted/30 p-3.5 transition-colors hover:bg-muted/50">
              <div className="flex items-start gap-3">
                <Megaphone className="mt-0.5 h-4 w-4 text-purple-500 shrink-0" />
                <div>
                  <p className="text-sm font-semibold">Promo & Fitur Baru BuzzHub</p>
                  <p className="text-xs text-muted-foreground">
                    Informasi paket promosi buzzer, diskon layanan, dan rilis fitur terbaru.
                  </p>
                </div>
              </div>
              <Switch checked={prefs.systemPromo} onCheckedChange={() => toggle("systemPromo")} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
