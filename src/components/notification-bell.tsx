import { Bell, CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  useFinanceNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  formatDate,
} from "@/lib/finance-store";
import { cn } from "@/lib/utils";

type Props = {
  /** Optional category filter (e.g. "withdrawal" for buzzer). If omitted, shows all. */
  categories?: string[];
  /** Limit items shown */
  limit?: number;
  recipientEmail?: string;
};

export function NotificationBell({ categories, limit = 20 }: Props) {
  const { data } = useFinanceNotifications();
  const filtered = categories && categories.length
    ? data.filter((n) => categories.includes(n.category))
    : data;
  const items = filtered.slice(0, limit);
  const unread = filtered.filter((n) => !n.read_at).length;

  const handleClick = async (id: string, readAt: string | null) => {
    if (!readAt) await markNotificationRead(id);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" className="relative h-9 w-9" aria-label="Notifikasi">
          <Bell className="h-4 w-4" />
          {unread > 0 && (
            <span className="absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white">
              {unread > 9 ? "9+" : unread}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-[calc(100vw-2rem)] max-w-sm p-0 sm:w-96">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <div>
            <p className="font-display text-sm font-bold">Notifikasi</p>
            <p className="text-xs text-muted-foreground">{unread} belum dibaca</p>
          </div>
          {unread > 0 && (
            <Button size="sm" variant="ghost" className="h-8 gap-1 text-xs" onClick={() => markAllNotificationsRead()}>
              <CheckCheck className="h-3.5 w-3.5" /> Tandai semua
            </Button>
          )}
        </div>
        <ScrollArea className="max-h-96">
          {items.length === 0 ? (
            <div className="px-4 py-10 text-center text-sm text-muted-foreground">
              Belum ada notifikasi
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {items.map((n) => (
                <li key={n.id}>
                  <button
                    type="button"
                    onClick={() => handleClick(n.id, n.read_at)}
                    className={cn(
                      "flex w-full flex-col gap-1 px-4 py-3 text-left transition-colors hover:bg-muted/60",
                      !n.read_at && "bg-primary/5",
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-semibold leading-snug">{n.title}</p>
                      {!n.read_at && <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />}
                    </div>
                    {n.body && <p className="text-xs text-muted-foreground">{n.body}</p>}
                    <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
                      {formatDate(n.created_at)}
                    </p>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}