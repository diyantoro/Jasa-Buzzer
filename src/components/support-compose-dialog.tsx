import { useEffect, useState } from "react";
import { Loader2, Send } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { SUPPORT_ADMIN_EMAIL, sendSupportMessage } from "@/lib/support-store";

type SupportComposeDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role: "customer" | "buzzer";
  user: { name: string; email: string };
};

export function SupportComposeDialog({
  open,
  onOpenChange,
  role,
  user,
}: SupportComposeDialogProps) {
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      setDraft("");
      setError(null);
      setSending(false);
    }
  }, [open]);

  const handleSend = async () => {
    const body = draft.trim();
    if (!body || sending) return;

    setSending(true);
    setError(null);
    try {
      await sendSupportMessage({
        fromRole: role,
        fromName: user.name,
        fromEmail: user.email,
        body,
        toEmail: SUPPORT_ADMIN_EMAIL,
      });
      toast.success("Pesan terkirim", {
        description: "Balasan admin akan muncul di notifikasi.",
      });
      onOpenChange(false);
    } catch (sendError) {
      const message = sendError instanceof Error ? sendError.message : "Pesan gagal dikirim.";
      setError(message);
      toast.error("Pesan gagal dikirim", { description: message });
    } finally {
      setSending(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (sending && !nextOpen) return;
        onOpenChange(nextOpen);
      }}
    >
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Kirim Pesan ke Support</DialogTitle>
          <DialogDescription>
            Tulis pertanyaan Anda. Balasan admin akan muncul di notifikasi.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <Textarea
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Contoh: Saya butuh bantuan terkait pembayaran invoice INV-..."
            className="min-h-[130px] resize-none"
            maxLength={2000}
            aria-label="Tulis pesan ke support"
            autoFocus
          />
          <div className="flex items-center justify-between gap-3 text-[11px] text-muted-foreground">
            <span>Dibalas saat jam operasional, Senin–Jumat 09.00–18.00 WIB.</span>
            <span className="shrink-0">{draft.length}/2000</span>
          </div>
          {error && <p className="text-xs text-destructive">{error}</p>}
        </div>

        <DialogFooter className="gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={sending}
          >
            Batal
          </Button>
          <Button type="button" onClick={() => void handleSend()} disabled={!draft.trim() || sending}>
            {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            Kirim Pesan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
