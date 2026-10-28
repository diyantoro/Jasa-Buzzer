import { type ReactNode, useMemo, useState } from "react";
import {
  Bell, Check, CheckCircle2, XCircle, Megaphone, Wallet, Star,
  Sparkles, Clock, CheckCheck, Inbox, SlidersHorizontal, MessageCircle,
} from "lucide-react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { NotificationDetailDialog } from "@/components/notification-detail-dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  useBuzzerNotifications, formatTimeAgo,
  type BuzzerNotification, type BuzzerNotificationType,
} from "@/lib/buzzer-notification-store";
import {
  useBuzzerNotifPreferences,
  isBuzzerNotifEnabled,
} from "@/components/buzzer-notif-settings-dialog";

const NOTIF_CONFIG: Record<
  BuzzerNotificationType,
  { label: string; badgeClass: string; iconClass: string; icon: ReactNode }
> = {
  task_approved: {
    label: "Tugas Selesai",
    badgeClass: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
    iconClass: "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-300",
    icon: <CheckCircle2 className="h-4 w-4" />,
  },
  task_rejected: {
    label: "Revisi / Ditolak",
    badgeClass: "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-400 border-rose-200 dark:border-rose-800",
    iconClass: "bg-rose-100 text-rose-600 dark:bg-rose-500/20 dark:text-rose-300",
    icon: <XCircle className="h-4 w-4" />,
  },
  verification_pending: {
    label: "Verifikasi Admin",
    badgeClass: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400 border-amber-200 dark:border-amber-800",
    iconClass: "bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-300",
    icon: <Clock className="h-4 w-4" />,
  },
  verification_approved: {
    label: "Terverifikasi",
    badgeClass: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
    iconClass: "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-300",
    icon: <Check className="h-4 w-4" />,
  },
  verification_rejected: {
    label: "Ditolak",
    badgeClass: "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-400 border-rose-200 dark:border-rose-800",
    iconClass: "bg-rose-100 text-rose-600 dark:bg-rose-500/20 dark:text-rose-300",
    icon: <XCircle className="h-4 w-4" />,
  },
  new_task: {
    label: "Tugas Baru",
    badgeClass: "bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-400 border-sky-200 dark:border-sky-800",
    iconClass: "bg-sky-100 text-sky-600 dark:bg-sky-500/20 dark:text-sky-300",
    icon: <Inbox className="h-4 w-4" />,
  },
  payout: {
    label: "Saldo & Payout",
    badgeClass: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400 border-amber-200 dark:border-amber-800",
    iconClass: "bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-300",
    icon: <Wallet className="h-4 w-4" />,
  },
  rating: {
    label: "Rating Customer",
    badgeClass: "bg-yellow-100 text-yellow-800 dark:bg-yellow-500/15 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800",
    iconClass: "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-300",
    icon: <Star className="h-4 w-4 fill-current" />,
  },
  level_up: {
    label: "Level Up",
    badgeClass: "bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-500/15 dark:text-fuchsia-400 border-fuchsia-200 dark:border-fuchsia-800",
    iconClass: "bg-fuchsia-100 text-fuchsia-600 dark:bg-fuchsia-500/20 dark:text-fuchsia-300",
    icon: <Sparkles className="h-4 w-4" />,
  },
  support: {
    label: "Balasan Support",
    badgeClass: "bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300 border-sky-200 dark:border-sky-800",
    iconClass: "bg-sky-100 text-sky-600 dark:bg-sky-500/20 dark:text-sky-300",
    icon: <MessageCircle className="h-4 w-4" />,
  },
  general: {
    label: "Informasi",
    badgeClass: "bg-muted text-muted-foreground border-border",
    iconClass: "bg-muted text-muted-foreground",
    icon: <Bell className="h-4 w-4" />,
  },
};

export function BuzzerNotifBell({
  email,
  onClick,
  notifState,
}: {
  email?: string | null;
  onClick: () => void;
  notifState?: ReturnType<typeof useBuzzerNotifications>;
}) {
  const prefs = useBuzzerNotifPreferences(email);
  const internal = useBuzzerNotifications(notifState ? null : email);
  const { notifications } = notifState ?? internal;

  const visibleNotifications = useMemo(
    () => notifications.filter((n) => isBuzzerNotifEnabled(n, prefs)),
    [notifications, prefs],
  );
  const unreadCount = prefs.inApp ? visibleNotifications.filter((n) => !n.is_read).length : 0;

  return (
    <Button
      variant="outline"
      size="icon"
      className="relative shrink-0"
      aria-label="Buka Notifikasi Buzzer"
      onClick={onClick}
    >
      <Bell className="h-4 w-4" />
      {prefs.inApp && unreadCount > 0 && (
        <span className="absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white shadow-sm animate-in fade-in zoom-in-75">
          {unreadCount > 9 ? "9+" : unreadCount}
        </span>
      )}
    </Button>
  );
}

export function BuzzerNotifSheet({
  open,
  onOpenChange,
  buzzerEmail,
  notifState,
  onNavigate,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  buzzerEmail?: string | null;
  notifState?: ReturnType<typeof useBuzzerNotifications>;
  onNavigate?: (section: string) => void;
}) {
  const prefs = useBuzzerNotifPreferences(buzzerEmail);
  const internal = useBuzzerNotifications(notifState ? null : buzzerEmail);
  const {
    notifications,
    loading,
    markAsRead,
  } = notifState ?? internal;

  const visibleNotifications = useMemo(
    () => notifications.filter((n) => isBuzzerNotifEnabled(n, prefs)),
    [notifications, prefs],
  );
  const unreadCount = prefs.inApp ? visibleNotifications.filter((n) => !n.is_read).length : 0;
  const [selected, setSelected] = useState<BuzzerNotification | null>(null);
  const selectedIsSupport = selected?.type === "support";

  const handleMarkAll = async () => {
    for (const n of visibleNotifications) {
      if (!n.is_read) {
        await markAsRead(n.id);
      }
    }
    toast.success("Semua notifikasi aktif ditandai dibaca");
  };

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="right" className="w-full sm:max-w-md p-0 flex flex-col">
          {/* Header dengan jarak aman dari tombol 'X' */}
          <div className="flex items-center justify-between border-b border-border pl-5 pr-14 py-3.5">
            <div>
              <h3 className="font-display font-bold text-base">Notifikasi Buzzer</h3>
              <p className="text-xs text-muted-foreground">
                {!prefs.inApp
                  ? "Fitur lonceng dinonaktifkan di pengaturan"
                  : unreadCount > 0
                  ? `${unreadCount} belum dibaca`
                  : "Semua sudah dibaca"}
              </p>
            </div>
            {prefs.inApp && unreadCount > 0 && (
              <div className="flex items-center mr-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 gap-1.5 px-3 text-xs font-medium"
                  onClick={handleMarkAll}
                >
                  <CheckCheck className="h-3.5 w-3.5 text-muted-foreground" />
                  Tandai semua
                </Button>
              </div>
            )}
          </div>

        {/* Daftar Notifikasi */}
        <div className="flex-1 overflow-y-auto max-h-[calc(100vh-70px)]">
          {loading ? (
            <div className="p-6 text-center text-sm text-muted-foreground">
              Memuat notifikasi...
            </div>
          ) : !prefs.inApp ? (
            <div className="grid place-items-center py-16 px-6 text-center">
              <span className="grid h-12 w-12 place-items-center rounded-full bg-muted text-muted-foreground">
                <Bell className="h-6 w-6 opacity-40 line-through" />
              </span>
              <p className="mt-4 font-semibold text-foreground">Notifikasi In-App Dinonaktifkan</p>
              <p className="mt-1 text-xs text-muted-foreground max-w-xs leading-relaxed">
                Anda menonaktifkan fitur notifikasi dalam aplikasi di menu Pengaturan. Aktifkan kembali di halaman Pengaturan untuk melihat notifikasi di sini.
              </p>
            </div>
          ) : visibleNotifications.length === 0 ? (
            <div className="grid place-items-center py-16 px-6 text-center">
              <span className="grid h-12 w-12 place-items-center rounded-full bg-muted text-muted-foreground">
                <Bell className="h-6 w-6 opacity-60" />
              </span>
              <p className="mt-4 font-semibold text-foreground">
                {notifications.length > 0 ? "Notifikasi Disembunyikan" : "Belum ada notifikasi"}
              </p>
              <p className="mt-1 text-xs text-muted-foreground max-w-xs leading-relaxed">
                {notifications.length > 0
                  ? "Beberapa notifikasi disembunyikan berdasarkan preferensi kategori yang Anda nonaktifkan di Pengaturan."
                  : "Pembaruan mengenai tugas disetujui, revisi, pencairan saldo, dan ulasan rating akan tampil di sini."}
              </p>
            </div>
          ) : (
            visibleNotifications.map((n) => {
              const cfg = NOTIF_CONFIG[n.type] ?? NOTIF_CONFIG.general;

              return (
                <button
                  key={n.id}
                  type="button"
                  onClick={() => {
                    if (!n.is_read) void markAsRead(n.id);

                    if (n.type === "support") {
                      setSelected(n);
                      onOpenChange(false);
                      return;
                    }

                    if (onNavigate) {
                      if (n.type === "payout") onNavigate("penghasilan");
                      else if (n.type === "new_task") onNavigate("tersedia");
                      else if (n.type === "task_approved" || n.type === "task_rejected") onNavigate("riwayat");
                      else if (n.type === "verification_approved" || n.type === "verification_rejected") onNavigate("sosial");
                      onOpenChange(false);
                    }
                  }}
                  className={cn(
                    "flex w-full items-start gap-3 border-b border-border p-4 text-left transition-colors hover:bg-muted/50 focus:outline-none focus:bg-muted/60",
                    !n.is_read ? "bg-primary/5" : "bg-card",
                  )}
                >
                  {/* Ikon Kategori */}
                  <span
                    className={cn(
                      "mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full",
                      cfg.iconClass,
                    )}
                  >
                    {cfg.icon}
                  </span>

                  {/* Isi Notifikasi */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="truncate text-xs font-semibold text-foreground">
                        {n.title}
                      </span>
                      <Badge
                        variant="outline"
                        className={cn("text-[10px] px-1.5 py-0 font-medium shrink-0", cfg.badgeClass)}
                      >
                        {cfg.label}
                      </Badge>
                    </div>

                    <p className="text-xs text-muted-foreground leading-snug line-clamp-3">
                      {n.message}
                    </p>

                    <div className="mt-1.5 flex items-center gap-1 text-[10px] text-muted-foreground">
                      <Clock className="h-3 w-3 opacity-70" />
                      <span>{formatTimeAgo(n.created_at)}</span>
                    </div>
                  </div>

                  {/* Unread indicator dot */}
                  {!n.is_read && (
                    <span
                      className="mt-2 h-2 w-2 shrink-0 rounded-full bg-primary"
                      title="Belum dibaca"
                    />
                  )}
                </button>
              );
            })
          )}
        </div>
      </SheetContent>
      </Sheet>

      <NotificationDetailDialog
        open={Boolean(selected)}
        onOpenChange={(nextOpen) => {
          if (!nextOpen) setSelected(null);
        }}
        title={selected?.title ?? "Notifikasi"}
        message={selected?.message ?? ""}
        timeLabel={selected ? formatTimeAgo(selected.created_at) : ""}
        isSupport={selectedIsSupport}
        onOpenHelp={
          onNavigate
            ? () => {
                setSelected(null);
                onNavigate("bantuan");
              }
            : undefined
        }
      />
    </>
  );
}
