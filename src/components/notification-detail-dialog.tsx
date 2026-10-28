import { LifeBuoy, MessageCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type NotificationDetailDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  message: string;
  timeLabel: string;
  question?: string;
  isSupport?: boolean;
  onOpenHelp?: () => void;
};

export function NotificationDetailDialog({
  open,
  onOpenChange,
  title,
  message,
  timeLabel,
  question,
  isSupport = false,
  onOpenHelp,
}: NotificationDetailDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 pr-6">
            {isSupport ? (
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-sky-500/15 text-sky-500">
                <MessageCircle className="h-4 w-4" />
              </span>
            ) : null}
            <span className="min-w-0 break-words">{title}</span>
          </DialogTitle>
          <DialogDescription>{timeLabel}</DialogDescription>
        </DialogHeader>

        <div className="max-h-[55vh] space-y-3 overflow-y-auto pr-1">
          {isSupport && question ? (
            <div className="space-y-1.5">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                Pertanyaan kamu
              </p>
              <div className="whitespace-pre-wrap rounded-xl border border-border bg-muted/20 p-3 text-sm leading-relaxed text-muted-foreground">
                {question}
              </div>
            </div>
          ) : null}

          <div className="space-y-1.5">
            {isSupport ? (
              <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                Balasan admin
              </p>
            ) : null}
            <div
              className={
                isSupport
                  ? "whitespace-pre-wrap rounded-xl border border-sky-500/20 bg-sky-500/5 p-4 text-sm leading-relaxed text-foreground"
                  : "whitespace-pre-wrap rounded-xl border border-border bg-muted/30 p-4 text-sm leading-relaxed text-foreground"
              }
            >
              {message}
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:justify-between">
          {isSupport && onOpenHelp ? (
            <Button type="button" variant="outline" onClick={onOpenHelp}>
              <LifeBuoy className="h-4 w-4" />
              Buka Bantuan
            </Button>
          ) : (
            <span />
          )}
          <Button type="button" onClick={() => onOpenChange(false)}>
            Tutup
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
