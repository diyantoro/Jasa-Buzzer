import { useEffect, useMemo, useRef, useState } from "react";
import { Inbox, Loader2, MessageCircle } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { SupportChat } from "@/components/support-chat";
import { formatSupportTime, supportInitials } from "@/lib/support-format";
import { SUPPORT_ADMIN_EMAIL, useSupportMessages, type SupportMessage } from "@/lib/support-store";
import { cn } from "@/lib/utils";

type AdminSupportSectionProps = {
  adminEmail: string;
  adminName: string;
  active?: boolean;
};

type Conversation = {
  email: string;
  name: string;
  lastMessage: SupportMessage;
  unread: number;
};

export function AdminSupportSection({
  adminEmail,
  adminName,
  active = true,
}: AdminSupportSectionProps) {
  const { data, loading, error, refetch } = useSupportMessages({
    role: "admin",
    email: adminEmail,
  });
  const [selectedEmail, setSelectedEmail] = useState<string | null>(null);
  const chatRef = useRef<HTMLDivElement>(null);

  const conversations = useMemo(() => {
    const map = new Map<string, Conversation>();

    for (const message of data) {
      const counterpart = (
        message.from_role === "admin" ? message.to_email : message.from_email
      ).trim();
      if (!counterpart || counterpart.toLowerCase() === SUPPORT_ADMIN_EMAIL) continue;

      const existing = map.get(counterpart);
      if (!existing) {
        map.set(counterpart, {
          email: counterpart,
          name:
            message.from_role === "admin"
              ? counterpart.split("@")[0]
              : message.from_name || counterpart.split("@")[0],
          lastMessage: message,
          unread: message.from_role !== "admin" && !message.read_at ? 1 : 0,
        });
        continue;
      }

      if (message.created_at > existing.lastMessage.created_at) existing.lastMessage = message;
      if (message.from_role !== "admin" && !message.read_at) existing.unread += 1;
      if (message.from_role !== "admin" && message.from_name) existing.name = message.from_name;
    }

    return [...map.values()].sort((a, b) =>
      b.lastMessage.created_at.localeCompare(a.lastMessage.created_at),
    );
  }, [data]);

  useEffect(() => {
    if (
      selectedEmail &&
      conversations.some((conversation) => conversation.email === selectedEmail)
    ) {
      return;
    }
    setSelectedEmail(conversations[0]?.email ?? null);
  }, [conversations, selectedEmail]);

  const selected =
    conversations.find((conversation) => conversation.email === selectedEmail) ?? null;
  const totalUnread = conversations.reduce((total, conversation) => total + conversation.unread, 0);

  const selectConversation = (email: string) => {
    setSelectedEmail(email);
    if (typeof window !== "undefined" && window.matchMedia("(max-width: 1023px)").matches) {
      window.setTimeout(() => {
        chatRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 80);
    }
  };

  return (
    <div className="space-y-4">
      <section className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 via-background to-accent/40 p-5 shadow-sm sm:p-6">
        <div className="pointer-events-none absolute -right-10 -top-12 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl gradient-brand text-brand-foreground shadow-glow">
              <MessageCircle className="h-5 w-5" />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                Pesan Support
              </p>
              <h2 className="mt-0.5 font-display text-xl font-bold">
                Percakapan customer & buzzer
              </h2>
              <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
                Balas pesan langsung dari dashboard. Pesan baru muncul otomatis tanpa perlu refresh.
              </p>
            </div>
          </div>
          <div className="flex shrink-0 flex-wrap items-center gap-2">
            <span className="rounded-full border border-border bg-background/70 px-3 py-1 text-xs font-medium text-muted-foreground">
              {conversations.length} percakapan
            </span>
            {totalUnread > 0 && (
              <span className="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                {totalUnread > 99 ? "99+" : totalUnread} belum dibaca
              </span>
            )}
          </div>
        </div>
      </section>

      {error && (
        <div className="flex flex-col gap-2 rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-700 dark:text-amber-300 sm:flex-row sm:items-center sm:justify-between">
          <span>Gagal memuat pesan: {error}</span>
          <Button type="button" variant="outline" size="sm" onClick={() => void refetch()}>
            Coba lagi
          </Button>
        </div>
      )}

      {loading && conversations.length === 0 ? (
        <div className="grid min-h-[320px] place-items-center rounded-2xl border border-border bg-card">
          <div className="text-center">
            <Loader2 className="mx-auto h-5 w-5 animate-spin text-primary" />
            <p className="mt-2 text-xs text-muted-foreground">Memuat pesan...</p>
          </div>
        </div>
      ) : conversations.length === 0 ? (
        <div className="grid min-h-[320px] place-items-center rounded-2xl border border-dashed border-border bg-card p-6 text-center">
          <div className="max-w-sm">
            <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary">
              <Inbox className="h-5 w-5" />
            </span>
            <p className="mt-3 text-sm font-semibold">Belum ada pesan</p>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              Pesan dari customer atau buzzer akan muncul di sini secara realtime.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-[320px_minmax(0,1fr)]">
          <aside className="rounded-2xl border border-border bg-card p-2 shadow-sm">
            <div className="flex items-center justify-between px-2 py-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Daftar Percakapan
              </p>
              <span className="text-[10px] text-muted-foreground">{conversations.length}</span>
            </div>
            <p className="px-2 pb-2 text-[10px] leading-4 text-muted-foreground">
              Pilih percakapan, lalu tulis balasan di kolom chat.
            </p>
            <div className="scrollbar-slim max-h-[520px] space-y-1 overflow-y-auto overscroll-contain">
              {conversations.map((conversation) => {
                const active = conversation.email === selectedEmail;
                const last = conversation.lastMessage;
                return (
                  <button
                    key={conversation.email}
                    type="button"
                    onClick={() => selectConversation(conversation.email)}
                    className={cn(
                      "flex w-full items-start gap-3 rounded-xl p-3 text-left transition-colors hover:bg-muted/60",
                      active && "bg-primary/5 ring-1 ring-primary/20",
                    )}
                  >
                    <Avatar className="h-9 w-9 shrink-0 border border-border">
                      <AvatarFallback className="bg-primary/10 text-[11px] font-semibold text-primary">
                        {supportInitials(conversation.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className="truncate text-sm font-semibold">{conversation.name}</p>
                        <span className="shrink-0 text-[10px] text-muted-foreground">
                          {formatSupportTime(last.created_at)}
                        </span>
                      </div>
                      <p className="truncate text-[11px] text-muted-foreground">
                        {conversation.email}
                      </p>
                      <div className="mt-1 flex items-center justify-between gap-2">
                        <p className="line-clamp-1 text-xs text-muted-foreground">
                          {last.from_role === "admin" ? "Anda: " : ""}
                          {last.body.replace(/\s+/g, " ")}
                        </p>
                        {conversation.unread > 0 && (
                          <span className="grid h-4 min-w-4 shrink-0 place-items-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
                            {conversation.unread > 9 ? "9+" : conversation.unread}
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </aside>

          <div className="min-w-0 scroll-mt-20" ref={chatRef}>
            {selected ? (
              <SupportChat
                key={selected.email}
                role="admin"
                user={{ name: adminName, email: adminEmail }}
                threadEmail={selected.email}
                title={selected.name}
                subtitle={selected.email}
                emptyTitle="Belum ada pesan"
                emptyDescription="Pesan dari user ini akan muncul di sini."
                className="h-[560px]"
                active={active}
              />
            ) : (
              <div className="grid h-[560px] place-items-center rounded-2xl border border-dashed border-border bg-card p-6 text-center">
                <div className="max-w-sm">
                  <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary">
                    <MessageCircle className="h-5 w-5" />
                  </span>
                  <p className="mt-3 text-sm font-semibold">Pilih percakapan</p>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">
                    Klik salah satu user di daftar untuk mulai membalas.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
