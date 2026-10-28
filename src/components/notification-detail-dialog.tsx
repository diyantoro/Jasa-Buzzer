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
  isSupport?: boolean;
  onOpenHelp?: () => void;
};

export function NotificationDetailDialog({
  open,
  onOpenChange,
  title,
  message,
  timeLabel,
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

        <div className="max-h-[55vh] overflow-y-auto whitespace-pre-wrap rounded-xl border border-border bg-muted/30 p-4 text-sm leading-relaxed text-foreground">
          {message}
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
