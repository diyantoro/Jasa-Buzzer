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
import type { BuzzerNotification } from "@/lib/buzzer-notification-store";

export type BuzzerNotifPreferences = {
  newTask: boolean;
  taskApproved: boolean;
  taskRejected: boolean;
  verification: boolean;
  payout: boolean;
  rating: boolean;
  levelUp: boolean;
  inApp: boolean;
  emailWhatsapp: boolean;
};

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

function getStorageKey(email?: string | null) {
  const clean = (email || "").trim().toLowerCase();
  return clean ? `buzzhub.buzzer.notifications.${clean}` : "buzzhub.buzzer.notifications.default";
}

export function getBuzzerNotifPreferences(email?: string | null): BuzzerNotifPreferences {
  if (typeof window === "undefined") return { ...DEFAULT_PREFERENCES };
  try {
    const raw = localStorage.getItem(getStorageKey(email));
    if (!raw) return { ...DEFAULT_PREFERENCES };
    return { ...DEFAULT_PREFERENCES, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT_PREFERENCES };
  }
}

export function isBuzzerNotifEnabled(
  n: BuzzerNotification,
  prefs: BuzzerNotifPreferences,
): boolean {
  if (!prefs.inApp) return false;

  const type = n.type;
  const title = (n.title || "").toLowerCase();
  const msg = (n.message || "").toLowerCase();
  const text = `${title} ${msg}`;

  // 1. Payout / Pencairan Saldo (Contoh spesifik dari user)
  if (
    type === "payout" ||
    text.includes("pencairan saldo") ||
    text.includes("pencairan") ||
    text.includes("penarikan saldo") ||
    text.includes("payout")
  ) {
    if (type !== "task_approved") {
      return Boolean(prefs.payout);
    }
  }

  // 2. Tugas Baru Tersedia
  if (
    type === "new_task" ||
    text.includes("tugas baru") ||
    text.includes("job baru")
  ) {
    return Boolean(prefs.newTask);
  }

  // 3. Tugas Disetujui
  if (
    type === "task_approved" ||
    text.includes("tugas selesai") ||
    text.includes("tugas disetujui")
  ) {
    return Boolean(prefs.taskApproved);
  }

  // 4. Tugas Ditolak / Revisi
  if (
    type === "task_rejected" ||
    text.includes("perlu revisi") ||
    text.includes("tugas ditolak") ||
    text.includes("bukti ditolak")
  ) {
    return Boolean(prefs.taskRejected);
  }

  // 5. Verifikasi Akun / Media Sosial
  if (
    type === "verification_pending" ||
    type === "verification_approved" ||
    type === "verification_rejected" ||
    text.includes("verifikasi media sosial") ||
    text.includes("verifikasi admin") ||
    text.includes("pendaftaran akun") ||
    text.includes("akun buzzer terverifikasi")
  ) {
    return Boolean(prefs.verification);
  }

  // 6. Rating Customer
  if (
    type === "rating" ||
    text.includes("ulasan & rating") ||
    text.includes("rating customer") ||
    text.includes("rating baru")
  ) {
    return Boolean(prefs.rating);
  }

  // 7. Level Up
  if (
    type === "level_up" ||
    text.includes("level kamu naik") ||
    text.includes("level up") ||
    text.includes("naik ke level")
  ) {
    return Boolean(prefs.levelUp);
  }

  // 8. General / Informasi
  return Boolean(prefs.inApp);
}

export function useBuzzerNotifPreferences(email?: string | null): BuzzerNotifPreferences {
  const [prefs, setPrefs] = useState<BuzzerNotifPreferences>(() =>
    getBuzzerNotifPreferences(email),
  );

  useEffect(() => {
    setPrefs(getBuzzerNotifPreferences(email));

    const onStorage = () => {
      setPrefs(getBuzzerNotifPreferences(email));
    };

    window.addEventListener("storage", onStorage);
    window.addEventListener("buzzhub_buzzer_notif_prefs_changed", onStorage);

    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("buzzhub_buzzer_notif_prefs_changed", onStorage);
    };
  }, [email]);

  return prefs;
}

export function BuzzerNotifSettingsDialog({
  open,
  onOpenChange,
  buzzerEmail,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  buzzerEmail?: string | null;
}) {
  const [prefs, setPrefs] = useState<BuzzerNotifPreferences>(() =>
    getBuzzerNotifPreferences(buzzerEmail),
  );

  useEffect(() => {
    if (open) {
      setPrefs(getBuzzerNotifPreferences(buzzerEmail));
    }
  }, [open, buzzerEmail]);

  const updatePref = (key: keyof BuzzerNotifPreferences, value: boolean) => {
    const next = { ...prefs, [key]: value };
    setPrefs(next);
    try {
      localStorage.setItem(getStorageKey(buzzerEmail), JSON.stringify(next));
      toast.success("Preferensi notifikasi disimpan");
    } catch {
      // safe-fail
    }
  };

  const handleReset = () => {
    setPrefs({ ...DEFAULT_PREFERENCES });
    try {
      localStorage.setItem(getStorageKey(buzzerEmail), JSON.stringify(DEFAULT_PREFERENCES));
      toast.success("Preferensi notifikasi dikembalikan ke bawaan");
    } catch {
      // safe-fail
    }
  };

  const taskItems: {
    key: keyof BuzzerNotifPreferences;
    title: string;
    desc: string;
    icon: React.ReactNode;
  }[] = [
    {
      key: "newTask",
      title: "Tugas & Job Baru Tersedia",
      desc: "Pemberitahuan saat ada campaign dan tugas baru yang sesuai dengan akun Anda.",
      icon: <Inbox className="h-4 w-4 text-sky-500" />,
    },
    {
      key: "taskApproved",
      title: "Persetujuan Tugas (Saldo Masuk)",
      desc: "Pemberitahuan saat bukti tugas disetujui admin dan komisi masuk ke saldo dompet.",
      icon: <CheckCircle2 className="h-4 w-4 text-emerald-500" />,
    },
    {
      key: "taskRejected",
      title: "Revisi / Tugas Ditolak",
      desc: "Pemberitahuan jika bukti pengerjaan perlu diperbaiki atau ditolak oleh admin.",
      icon: <XCircle className="h-4 w-4 text-rose-500" />,
    },
  ];

  const accountItems: {
    key: keyof BuzzerNotifPreferences;
    title: string;
    desc: string;
    icon: React.ReactNode;
  }[] = [
    {
      key: "verification",
      title: "Status Verifikasi Profil & Sosmed",
      desc: "Pemberitahuan hasil peninjauan admin untuk akun buzzer dan media sosial yang diajukan.",
      icon: <ShieldCheck className="h-4 w-4 text-primary" />,
    },
    {
      key: "payout",
      title: "Pencairan Saldo & Payout",
      desc: "Pemberitahuan saat proses penarikan saldo berhasil ditransfer oleh admin.",
      icon: <Wallet className="h-4 w-4 text-amber-500" />,
    },
    {
      key: "rating",
      title: "Rating & Ulasan Customer",
      desc: "Pemberitahuan saat customer memberikan ulasan dan bintang untuk hasil kerja Anda.",
      icon: <Star className="h-4 w-4 text-amber-400" />,
    },
    {
      key: "levelUp",
      title: "Kenaikan Level Buzzer",
      desc: "Pemberitahuan saat Anda mencapai level baru dan kenaikan tarif pengerjaan tugas.",
      icon: <Sparkles className="h-4 w-4 text-fuchsia-500" />,
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
              <DialogTitle className="text-base sm:text-lg">Pengaturan Notifikasi Buzzer</DialogTitle>
              <DialogDescription className="text-xs sm:text-sm">
                Atur jenis pemberitahuan lonceng dan kanal aktivitas akun Buzzer Anda.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Bagian Tugas & Job */}
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Aktivitas Tugas & Kampanye
            </p>
            <div className="divide-y divide-border rounded-xl border border-border bg-card/60">
              {taskItems.map((item) => (
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

          {/* Bagian Akun & Keuangan */}
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Akun, Level & Keuangan
            </p>
            <div className="divide-y divide-border rounded-xl border border-border bg-card/60">
              {accountItems.map((item) => (
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
                      Ikon lonceng dan popup pemberitahuan pada dashboard buzzer.
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
                      Pemberitahuan pencairan dana dan instruksi revisi admin ke nomor HP/Email.
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
