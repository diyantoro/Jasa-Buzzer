import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { Headphones, Inbox, Loader2, MessageCircle, Send } from "lucide-react";
import { toast } from "sonner";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { formatSupportTime, supportInitials } from "@/lib/support-format";
import {
  SUPPORT_ADMIN_EMAIL,
  markSupportMessagesRead,
  sendSupportMessage,
  useSupportMessages,
  type SupportMessage,
  type SupportRole,
} from "@/lib/support-store";
import { cn } from "@/lib/utils";

type SupportChatProps = {
  role: SupportRole;
  user: { name: string; email: string };
  /** Email lawan bicara; wajib untuk admin yang membalas percakapan user. */
  threadEmail?: string | null;
  title?: string;
  subtitle?: string;
  emptyTitle?: string;
  emptyDescription?: string;
  className?: string;
  /** Hanya tandai pesan sebagai dibaca saat section ini benar-benar terlihat. */
  active?: boolean;
};

const QUICK_TOPICS = ["Pembayaran", "Pesanan", "Akun", "Lainnya"];

export function SupportChat({
  role,
  user,
  threadEmail,
  title,
  subtitle,
  emptyTitle,
  emptyDescription,
  className,
  active = true,
}: SupportChatProps) {
  const isAdmin = role === "admin";
  const {
    data: messages,
    loading,
    error,
    refetch,
  } = useSupportMessages({
    role,
    email: user.email,
    threadEmail,
  });
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const markingReadRef = useRef(false);

  const disabled = isAdmin && !threadEmail;
  const firstName = user.name.trim().split(/\s+/)[0] || "kak";
  const headerTitle = title ?? (isAdmin ? "Percakapan" : "Tim Support BuzzHub");
  const headerSubtitle =
    subtitle ?? (isAdmin ? (threadEmail ?? "Pilih percakapan") : "Balasan langsung di dashboard");
  const emptyTitleText = emptyTitle ?? (isAdmin ? "Belum ada pesan" : `Halo, ${firstName}!`);
  const emptyDescriptionText =
    emptyDescription ??
    (isAdmin
      ? "Pesan dari user ini akan muncul di sini."
      : "Ada yang bisa kami bantu? Kirim pesan dan tim support akan membalas di sini.");

  const isMine = (message: SupportMessage) =>
    message.from_email.toLowerCase() === user.email.toLowerCase();

  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages.length, loading]);

  useEffect(() => {
    // Saat admin berpindah percakapan, izinkan penandaan pesan dibaca
    // untuk thread yang baru meskipun request thread sebelumnya masih jalan.
    markingReadRef.current = false;
  }, [threadEmail, user.email]);

  useEffect(() => {
    if (!active || disabled || markingReadRef.current) return;
    const unread = messages.filter((message) =>
      isAdmin
        ? message.from_role !== "admin" && !message.read_at
        : message.from_role === "admin" && !message.read_at,
    );
    if (!unread.length) return;
    markingReadRef.current = true;
    void markSupportMessagesRead({
      role,
      email: user.email,
      threadEmail,
    })
      .catch((markError) => {
        console.warn("[Support] Gagal menandai pesan dibaca:", markError);
      })
      .finally(() => {
        markingReadRef.current = false;
      });
  }, [active, disabled, isAdmin, messages, role, threadEmail, user.email]);

  const handleSend = async () => {
    const text = draft.trim();
    if (!text || sending) return;
    if (disabled) {
      toast.error("Pilih percakapan terlebih dahulu.");
      return;
    }

    setSending(true);
    setSendError(null);
    try {
      await sendSupportMessage({
        fromRole: role,
        fromName: user.name,
        fromEmail: user.email,
        body: text,
        toEmail: isAdmin ? (threadEmail ?? undefined) : SUPPORT_ADMIN_EMAIL,
      });
      setDraft("");
      await refetch({ silent: true });
      toast.success(isAdmin ? "Balasan terkirim" : "Pesan terkirim", {
        description: isAdmin
          ? `Pesan dikirim ke ${threadEmail ?? "user"}.`
          : "Tim support akan membalas di notifikasi.",
      });
    } catch (sendFailure) {
      const message = sendFailure instanceof Error ? sendFailure.message : "Pesan gagal dikirim.";
      setSendError(message);
      toast.error("Pesan gagal dikirim", { description: message });
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void handleSend();
    }
  };

  return (
    <section
      className={cn(
        "flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm",
        className ?? "h-[430px]",
      )}
    >
      <header className="flex items-center gap-3 border-b border-border px-4 py-3">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl gradient-brand text-brand-foreground shadow-sm">
          {isAdmin ? <MessageCircle className="h-4 w-4" /> : <Headphones className="h-4 w-4" />}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate font-display text-sm font-bold">{headerTitle}</p>
          <p className="truncate text-[11px] text-muted-foreground">{headerSubtitle}</p>
        </div>
        {!isAdmin && (
          <span className="shrink-0 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-300">
            In-app
          </span>
        )}
      </header>

      <div
        ref={listRef}
        className="scrollbar-slim flex-1 space-y-3 overflow-y-auto overscroll-contain px-4 py-4"
      >
        {error && (
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-700 dark:text-amber-300">
            Gagal memuat pesan terbaru.{" "}
            <button
              type="button"
              className="font-semibold underline underline-offset-2"
              onClick={() => void refetch()}
            >
              Coba lagi
            </button>
          </div>
        )}

        {loading && messages.length === 0 ? (
          <div className="grid h-full place-items-center text-center">
            <div>
              <Loader2 className="mx-auto h-5 w-5 animate-spin text-primary" />
              <p className="mt-2 text-xs text-muted-foreground">Memuat pesan...</p>
            </div>
          </div>
        ) : disabled ? (
          <div className="grid h-full place-items-center text-center">
            <div>
              <Inbox className="mx-auto h-6 w-6 text-muted-foreground" />
              <p className="mt-2 text-sm font-semibold">Pilih percakapan</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Pilih salah satu user di daftar untuk membalas pesannya.
              </p>
            </div>
          </div>
        ) : messages.length === 0 ? (
          <div className="grid h-full place-items-center text-center">
            <div className="max-w-[250px]">
              <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary">
                <MessageCircle className="h-5 w-5" />
              </span>
              <p className="mt-3 text-sm font-semibold">{emptyTitleText}</p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">{emptyDescriptionText}</p>
              {!isAdmin && (
                <div className="mt-3 flex flex-wrap justify-center gap-1.5">
                  {QUICK_TOPICS.map((topic) => (
                    <button
                      key={topic}
                      type="button"
                      className="rounded-full border border-border bg-background px-2.5 py-1 text-[10px] font-medium text-muted-foreground transition-colors hover:border-primary/30 hover:text-primary"
                      onClick={() =>
                        setDraft(`Halo, saya butuh bantuan tentang ${topic.toLowerCase()}.`)
                      }
                    >
                      {topic}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          messages.map((message) => {
            const mine = isMine(message);
            const senderName = mine ? user.name : message.from_name;
            return (
              <div
                key={message.id}
                className={cn("flex items-end gap-2", mine ? "flex-row-reverse" : "flex-row")}
              >
                <Avatar className="h-7 w-7 shrink-0 border border-border">
                  <AvatarFallback
                    className={cn(
                      "text-[10px] font-semibold",
                      mine ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground",
                    )}
                  >
                    {supportInitials(senderName)}
                  </AvatarFallback>
                </Avatar>
                <div
                  className={cn(
                    "flex max-w-[82%] flex-col gap-1",
                    mine ? "items-end text-right" : "items-start text-left",
                  )}
                >
                  {!mine && (
                    <p className="px-1 text-[10px] font-semibold text-muted-foreground">
                      {message.from_name}
                    </p>
                  )}
                  <div
                    className={cn(
                      "whitespace-pre-wrap break-words rounded-2xl px-3 py-2 text-sm leading-5 shadow-sm",
                      mine
                        ? "rounded-br-md bg-primary text-primary-foreground"
                        : "rounded-bl-md bg-muted text-foreground",
                    )}
                  >
                    {message.body}
                  </div>
                  <p className="px-1 text-[10px] text-muted-foreground">
                    {formatSupportTime(message.created_at)}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="border-t border-border bg-background/60 p-3">
        <div className="flex items-end gap-2">
          <Textarea
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isAdmin ? "Tulis balasan..." : "Tulis pesan..."}
            disabled={disabled || sending}
            rows={2}
            className="min-h-[44px] flex-1 resize-none rounded-xl bg-background text-sm"
            aria-label={isAdmin ? "Tulis balasan support" : "Tulis pesan support"}
            autoFocus={isAdmin}
            onFocus={(event) => {
              if (
                typeof window !== "undefined" &&
                window.matchMedia("(max-width: 1023px)").matches
              ) {
                event.currentTarget.scrollIntoView({ block: "nearest", behavior: "smooth" });
              }
            }}
          />
          <Button
            type="button"
            size="default"
            className="h-10 shrink-0 rounded-xl gradient-brand px-3 text-brand-foreground"
            onClick={() => void handleSend()}
            disabled={disabled || sending || !draft.trim()}
            aria-label="Kirim pesan"
          >
            {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            <span className="hidden sm:inline">Kirim</span>
          </Button>
        </div>
        {sendError ? (
          <p className="mt-1.5 text-[10px] text-rose-600 dark:text-rose-300">{sendError}</p>
        ) : (
          <p className="mt-1.5 text-[10px] text-muted-foreground">
            {isAdmin
              ? `Balas sebagai ${user.name}.`
              : "Dibalas saat jam operasional, Senin–Jumat 09.00–18.00 WIB."}
          </p>
        )}
      </div>
    </section>
  );
}
