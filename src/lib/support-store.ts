import { useCallback, useEffect, useId, useState } from "react";

import { supabase } from "@/integrations/supabase/client";
import type { CampaignMessage } from "@/lib/campaign-store";

/**
 * Pesan support memakai tabel `campaign_messages` dengan `campaign_id = null`.
 * Dengan begitu tidak perlu tabel baru, dan realtime/RLS yang sudah ada tetap
 * bisa dipakai. Pesan campaign tetap terpisah karena memiliki `campaign_id`.
 */
export const SUPPORT_ADMIN_EMAIL = "admin@buzzhub.id";

export type SupportRole = "customer" | "buzzer" | "admin";
export type SupportMessage = CampaignMessage;

type UseSupportMessagesOptions = {
  role: SupportRole;
  email?: string | null;
  threadEmail?: string | null;
};

function toErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === "object" && error !== null && "message" in error) {
    const message = (error as { message?: unknown }).message;
    if (typeof message === "string") return message;
  }
  return String(error);
}

export function useSupportMessages({ role, email, threadEmail }: UseSupportMessagesOptions) {
  const channelId = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const [data, setData] = useState<SupportMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMessages = useCallback(
    async (options?: { silent?: boolean }) => {
      if (role !== "admin" && !email) {
        setData([]);
        setLoading(false);
        return;
      }

      if (!options?.silent) setLoading(true);
      setError(null);

      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const client = supabase as any;
        let query = client
          .from("campaign_messages")
          .select("*")
          .is("campaign_id", null)
          .order("created_at", { ascending: true })
          .limit(500);

        if (role === "admin") {
          if (threadEmail) {
            query = query.or(`from_email.eq.${threadEmail},to_email.eq.${threadEmail}`);
          }
        } else if (email) {
          query = query.or(`from_email.eq.${email},to_email.eq.${email}`);
        }

        const { data: rows, error: queryError } = await query;
        if (queryError) throw queryError;
        setData((rows as SupportMessage[]) ?? []);
      } catch (queryError) {
        console.error("[Supabase] Failed to load support messages:", queryError);
        setError(toErrorMessage(queryError));
      } finally {
        setLoading(false);
      }
    },
    [email, role, threadEmail],
  );

  useEffect(() => {
    void fetchMessages();

    // Satu channel per instance agar beberapa komponen (chat user + inbox
    // admin) bisa berlangganan bersamaan tanpa bentrok nama channel.
    const channel = supabase
      .channel(`rt-support-${role}-${channelId}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "campaign_messages" }, () => {
        void fetchMessages({ silent: true });
      })
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [fetchMessages, role, channelId]);

  return { data, loading, error, refetch: fetchMessages };
}

function notifySupportChanged() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("buzzhub:support"));
  }
}

/**
 * Jumlah pesan belum dibaca untuk badge menu Pesan.
 * - Admin: semua pesan masuk dari customer/buzzer.
 * - Customer/buzzer: balasan admin yang belum dibaca.
 */
export function useSupportUnreadCount({
  role,
  email,
}: {
  role: SupportRole;
  email?: string | null;
}) {
  const channelId = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const [count, setCount] = useState(0);

  const fetchCount = useCallback(async () => {
    if (!email) {
      setCount(0);
      return;
    }

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const client = supabase as any;
      let query = client
        .from("campaign_messages")
        .select("id", { count: "exact", head: true })
        .is("campaign_id", null)
        .is("read_at", null);

      if (role === "admin") {
        query = query.neq("from_role", "admin");
      } else {
        query = query.eq("from_role", "admin").eq("to_email", email);
      }

      const { count: unread, error } = await query;
      if (error) throw error;
      setCount(unread ?? 0);
    } catch (queryError) {
      console.warn("[Support] Gagal memuat jumlah pesan belum dibaca:", queryError);
    }
  }, [email, role]);

  useEffect(() => {
    void fetchCount();

    const channel = supabase
      .channel(`rt-support-unread-${role}-${channelId}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "campaign_messages" }, () => {
        void fetchCount();
      })
      .subscribe();

    const handleSupportChanged = () => {
      void fetchCount();
    };
    window.addEventListener("buzzhub:support", handleSupportChanged);

    return () => {
      window.removeEventListener("buzzhub:support", handleSupportChanged);
      void supabase.removeChannel(channel);
    };
  }, [fetchCount, role, channelId]);

  return count;
}

export async function sendSupportMessage(input: {
  fromRole: SupportRole;
  fromName: string;
  fromEmail: string;
  body: string;
  toEmail?: string;
}) {
  const body = input.body.trim();
  if (!body) throw new Error("Pesan tidak boleh kosong.");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from("campaign_messages")
    .insert({
      campaign_id: null,
      from_role: input.fromRole,
      from_name: input.fromName,
      from_email: input.fromEmail,
      to_email: input.toEmail ?? SUPPORT_ADMIN_EMAIL,
      body,
      read_at: null,
    })
    .select("*")
    .single();

  if (error) throw error;
  notifySupportChanged();
  return data as SupportMessage;
}

export async function markSupportMessagesRead(input: {
  role: SupportRole;
  email: string;
  threadEmail?: string | null;
}) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let query = (supabase as any)
    .from("campaign_messages")
    .update({ read_at: new Date().toISOString() })
    .is("campaign_id", null)
    .is("read_at", null);

  if (input.role === "admin") {
    query = query.neq("from_role", "admin");
    if (input.threadEmail) query = query.eq("from_email", input.threadEmail);
  } else {
    query = query.eq("from_role", "admin").eq("to_email", input.email);
  }

  const { error } = await query;
  if (error) throw error;
  notifySupportChanged();
}
