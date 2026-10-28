import { useEffect, useState } from "react";
import {
  Bell,
  CheckCircle2,
  CreditCard,
  Megaphone,
  RotateCcw,
  ShoppingBag,
  Smartphone,
  Star,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import type { Notification } from "@/lib/customer-store";

export type CustomerNotifPreferences = {
  orderStatus: boolean;
  payment: boolean;
  buzzerProof: boolean;
  reviewReminder: boolean;
  systemPromo: boolean;
  inApp: boolean;
  emailWhatsapp: boolean;
};

const DEFAULT_PREFERENCES: CustomerNotifPreferences = {
  orderStatus: true,
  payment: true,
  buzzerProof: true,
  reviewReminder: true,
  systemPromo: true,
  inApp: true,
  emailWhatsapp: true,
};

function getStorageKey(email?: string | null) {
  const clean = (email || "").trim().toLowerCase();
  return clean ? `buzzhub.customer.notifications.${clean}` : "buzzhub.customer.notifications.default";
}

export function getCustomerNotifPreferences(email?: string | null): CustomerNotifPreferences {
  if (typeof window === "undefined") return { ...DEFAULT_PREFERENCES };
  try {
    const raw = localStorage.getItem(getStorageKey(email));
    if (!raw) return { ...DEFAULT_PREFERENCES };
    return { ...DEFAULT_PREFERENCES, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT_PREFERENCES };
  }
}

export function isCustomerNotifEnabled(
  n: Notification,
  prefs: CustomerNotifPreferences,
): boolean {
  if (!prefs.inApp) return false;

  const title = (n.title || "").toLowerCase();
  const body = (n.body || "").toLowerCase();
  const text = `${title} ${body}`;

  // Balasan support selalu tampil selama notifikasi in-app aktif.
  if (n.type === "support" || title.includes("balasan support")) {
    return true;
  }

  // 1. Pengingat Rating & Ulasan
  if (
    text.includes("rating") ||
    text.includes("ulasan") ||
    text.includes("review") ||
    text.includes("menilai")
  ) {
    return Boolean(prefs.reviewReminder);
  }

  // 2. Bukti Pekerjaan Buzzer
  if (
    text.includes("bukti pengerjaan") ||
    text.includes("bukti") ||
    text.includes("screenshot") ||
    text.includes("tangkapan layar") ||
    text.includes("unggah")
  ) {
    return Boolean(prefs.buzzerProof);
  }

  // 3. Status Pembayaran & Tagihan
  if (
    n.type === "payment" ||
    text.includes("pembayaran") ||
    text.includes("tagihan") ||
    text.includes("invoice") ||
    text.includes("transfer") ||
    text.includes("lunas")
  ) {
    return Boolean(prefs.payment);
  }

  // 4. Promo & Fitur Baru
  if (
    text.includes("promo") ||
    text.includes("diskon") ||
    text.includes("fitur baru") ||
    text.includes("voucher")
  ) {
    return Boolean(prefs.systemPromo);
  }

  // 5. Update Status Pesanan & Campaign
  if (
    n.type === "order" ||
    n.type === "campaign" ||
    text.includes("pesanan") ||
    text.includes("campaign") ||
    text.includes("selesai") ||
    text.includes("dibatalkan") ||
    text.includes("diduplikasi") ||
    text.includes("disetujui") ||
    text.includes("menunggu")
  ) {
    return Boolean(prefs.orderStatus);
  }

  // 6. Notifikasi dasar (selamat datang, dll)
  return Boolean(prefs.inApp);
}

export function useCustomerNotifPreferences(email?: string | null): CustomerNotifPreferences {
  const [prefs, setPrefs] = useState<CustomerNotifPreferences>(() =>
    getCustomerNotifPreferences(email),
  );

  useEffect(() => {
    setPrefs(getCustomerNotifPreferences(email));

    const onStorage = () => {
      setPrefs(getCustomerNotifPreferences(email));
    };

    window.addEventListener("storage", onStorage);
    window.addEventListener("buzzhub_customer_notif_prefs_changed", onStorage);

    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("buzzhub_customer_notif_prefs_changed", onStorage);
    };
  }, [email]);

  return prefs;
}

export function CustomerNotifSettingsDialog({
  open,
  onOpenChange,
  customerEmail,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customerEmail?: string | null;
}) {
  const [prefs, setPrefs] = useState<CustomerNotifPreferences>(() =>
    getCustomerNotifPreferences(customerEmail),
  );

  useEffect(() => {
    if (open) {
      setPrefs(getCustomerNotifPreferences(customerEmail));
    }
  }, [open, customerEmail]);

  const updatePref = (key: keyof CustomerNotifPreferences, value: boolean) => {
    const next = { ...prefs, [key]: value };
    setPrefs(next);
    try {
      localStorage.setItem(getStorageKey(customerEmail), JSON.stringify(next));
      toast.success("Preferensi notifikasi disimpan");
    } catch {
      // safe-fail
    }
  };

  const handleReset = () => {
    setPrefs({ ...DEFAULT_PREFERENCES });
    try {
      localStorage.setItem(getStorageKey(customerEmail), JSON.stringify(DEFAULT_PREFERENCES));
      toast.success("Preferensi notifikasi dikembalikan ke bawaan");
    } catch {
      // safe-fail
    }
  };

  const notificationItems: {
    key: keyof CustomerNotifPreferences;
    title: string;
    desc: string;
    icon: React.ReactNode;
  }[] = [
    {
      key: "orderStatus",
      title: "Status Pesanan & Campaign",
      desc: "Pemberitahuan saat pesanan disetujui, sedang diproses, atau selesai dikerjakan buzzer.",
      icon: <ShoppingBag className="h-4 w-4 text-primary" />,
    },
    {
      key: "payment",
      title: "Pembayaran & Tagihan",
      desc: "Pemberitahuan invoice baru dan konfirmasi verifikasi status pembayaran oleh admin.",
      icon: <CreditCard className="h-4 w-4 text-emerald-500" />,
    },
    {
      key: "buzzerProof",
      title: "Bukti Pengerjaan Buzzer",
      desc: "Pemberitahuan saat buzzer telah mengunggah laporan dan screenshot bukti pengerjaan.",
      icon: <CheckCircle2 className="h-4 w-4 text-sky-500" />,
    },
    {
      key: "reviewReminder",
      title: "Pengingat Ulasan & Rating",
      desc: "Pengingat untuk memberikan rating dan kepuasan layanan setelah campaign tuntas.",
      icon: <Star className="h-4 w-4 text-amber-500" />,
    },
    {
      key: "systemPromo",
      title: "Pembaruan Sistem & Informasi",
      desc: "Informasi pembaruan platform, tips promosi buzzer, dan pengumuman penting.",
      icon: <Megaphone className="h-4 w-4 text-fuchsia-500" />,
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-2 text-primary">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary/10">
              <Bell className="h-5 w-5 text-primary" />
            </span>
            <div>
              <DialogTitle className="text-base sm:text-lg">Pengaturan Notifikasi</DialogTitle>
              <DialogDescription className="text-xs sm:text-sm">
                Atur jenis pemberitahuan lonceng dan kanal aktivitas akun Customer Anda.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Bagian Aktivitas Pesanan */}
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Aktivitas Pesanan & Transaksi
            </p>
            <div className="divide-y divide-border rounded-xl border border-border bg-card/60">
              {notificationItems.map((item) => (
                <div key={item.key} className="flex items-center justify-between gap-3 p-3 sm:p-3.5">
                  <div className="flex items-start gap-3 min-w-0">
                    <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-muted">
                      {item.icon}
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm font-medium leading-snug">{item.title}</p>
                      <p className="text-[11px] text-muted-foreground leading-normal line-clamp-2 mt-0.5">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={prefs[item.key]}
                    onCheckedChange={(val) => updatePref(item.key, val)}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Bagian Kanal Notifikasi */}
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Kanal Pemberitahuan
            </p>
            <div className="space-y-2 rounded-xl border border-border bg-card/60 p-3 sm:p-3.5">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0">
                  <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-muted">
                    <Bell className="h-4 w-4 text-primary" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-medium">Notifikasi Dalam Aplikasi</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      Ikon lonceng dan popup pemberitahuan pada dashboard customer.
                    </p>
                  </div>
                </div>
                <Switch
                  checked={prefs.inApp}
                  onCheckedChange={(val) => updatePref("inApp", val)}
                />
              </div>

              <div className="flex items-center justify-between gap-3 border-t border-border pt-2.5">
                <div className="flex items-start gap-3 min-w-0">
                  <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-muted">
                    <Smartphone className="h-4 w-4 text-emerald-500" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-medium">Notifikasi WhatsApp / Email</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      Pemberitahuan status verifikasi pembayaran dan ringkasan pesanan ke kontak Anda.
                    </p>
                  </div>
                </div>
                <Switch
                  checked={prefs.emailWhatsapp}
                  onCheckedChange={(val) => updatePref("emailWhatsapp", val)}
                />
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="flex flex-row items-center justify-between gap-2 border-t border-border pt-3">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="h-8 gap-1 text-xs text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="h-3.5 w-3.5" /> Reset Default
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="gradient-brand text-brand-foreground h-8 px-4 text-xs"
          >
            Selesai
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
