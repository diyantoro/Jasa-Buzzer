// Store dan layanan notifikasi untuk akun buzzer
import { useCallback, useEffect, useId, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type BuzzerNotificationType =
  | "task_approved"
  | "task_rejected"
  | "verification_pending"
  | "verification_approved"
  | "verification_rejected"
  | "new_task"
  | "payout"
  | "rating"
  | "level_up"
  | "support"
  | "general";

export type BuzzerNotification = {
  id: string;
  user_id: string;
  buzzer_id?: string | null;
  title: string;
  message: string;
  type: BuzzerNotificationType;
  is_read: boolean;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at?: string;
};

// Helper format rupiah lokal agar terbebas dari siklus dependensi module
const formatCurrency = (n: number) =>
  "Rp " + Math.round(Number(n || 0)).toLocaleString("id-ID");

const LOCAL_STORAGE_KEY_PREFIX = "buzzhub_buzzer_notifs_";

/**
 * Deduplikasi notifikasi agar tidak menampilkan duplikat ID atau spam level up berulang
 */
export function deduplicateNotifications(list: BuzzerNotification[]): BuzzerNotification[] {
  const seenIds = new Set<string>();
  const seenLevelUps = new Set<string>();
  const result: BuzzerNotification[] = [];

  for (const n of list) {
    if (seenIds.has(n.id)) continue;
    seenIds.add(n.id);

    // Hilangkan spam level_up berulang dengan level/pesan sama
    if (n.type === "level_up") {
      const key = `${n.user_id}_${n.metadata?.newLevel || n.message}`;
      if (seenLevelUps.has(key)) continue;
      seenLevelUps.add(key);
    }

    result.push(n);
  }
  return result;
}

function getLocalNotifs(email: string): BuzzerNotification[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(`${LOCAL_STORAGE_KEY_PREFIX}${email}`);
    const parsed = raw ? JSON.parse(raw) : [];
    return deduplicateNotifications(parsed);
  } catch {
    return [];
  }
}

function saveLocalNotifs(email: string, list: BuzzerNotification[]) {
  if (typeof window === "undefined") return;
  try {
    const deduped = deduplicateNotifications(list);
    localStorage.setItem(`${LOCAL_STORAGE_KEY_PREFIX}${email}`, JSON.stringify(deduped));
  } catch {
    // ignore quota errors
  }
}

/**
 * Format timestamp menjadi "time ago" dalam Bahasa Indonesia
 */
export function formatTimeAgo(isoString: string): string {
  try {
    const date = new Date(isoString);
    const now = new Date();
    const diffSec = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffSec < 60) return "Baru saja";
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `${diffMin} menit lalu`;
    const diffHours = Math.floor(diffMin / 60);
    if (diffHours < 24) return `${diffHours} jam lalu`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays} hari lalu`;

    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
  } catch {
    return isoString;
  }
}

/**
 * Hook untuk memuat dan berlangganan notifikasi akun buzzer secara realtime
 */
export function useBuzzerNotifications(buzzerEmail?: string | null) {
  const hookId = useId();
  const normalizedEmail = (buzzerEmail ?? "").trim().toLowerCase();
  const [notifications, setNotifications] = useState<BuzzerNotification[]>(() =>
    normalizedEmail ? getLocalNotifs(normalizedEmail) : [],
  );
  const [loading, setLoading] = useState(true);

  const fetchNotifications = useCallback(async () => {
    if (!normalizedEmail) {
      setNotifications([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .or(`user_id.eq.${normalizedEmail},buzzer_id.eq.${normalizedEmail}`)
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) {
        // Fallback ke localStorage jika tabel belum ada atau jaringan bermasalah
        const local = getLocalNotifs(normalizedEmail);
        setNotifications(local);
      } else if (data) {
        const rows = data as BuzzerNotification[];
        // Gabungkan dengan notifikasi lokal jika ada yang belum tersinkron
        const local = getLocalNotifs(normalizedEmail);
        const serverIds = new Set(rows.map((r) => r.id));
        const merged = [
          ...rows,
          ...local.filter((l) => !serverIds.has(l.id)),
        ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

        const cleaned = deduplicateNotifications(merged);
        setNotifications(cleaned);
        saveLocalNotifs(normalizedEmail, cleaned);
      }
    } catch {
      const local = getLocalNotifs(normalizedEmail);
      setNotifications(local);
    } finally {
      setLoading(false);
    }
  }, [normalizedEmail]);

  useEffect(() => {
    if (!normalizedEmail) return;

    void (async () => {
      await syncBuzzerActivities(normalizedEmail);
      await fetchNotifications();
    })();

    // Polling heartbeat setiap 4 detik untuk update realtime dari admin
    const interval = setInterval(() => {
      void (async () => {
        await syncBuzzerActivities(normalizedEmail);
        await fetchNotifications();
      })();
    }, 4000);

    const cleanId = (hookId || "").replace(/[^a-zA-Z0-9]/g, "_");
    const channelName = `rt-buzzer-notifs-${normalizedEmail}-${cleanId}`;

    // Listener instan untuk event notifikasi yang dipicu di tab yang sama (0ms)
    const onLocalNotif = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail?.email === normalizedEmail) {
        const notif = customEvent.detail?.notif as BuzzerNotification | undefined;
        if (notif) {
          setNotifications((prev) => {
            const next = deduplicateNotifications([notif, ...prev.filter((n) => n.id !== notif.id)]);
            return next;
          });
        } else {
          void fetchNotifications();
        }
      }
    };

    if (typeof window !== "undefined") {
      window.addEventListener("buzzhub_buzzer_notif_created", onLocalNotif);
    }

    try {
      const existing = supabase.getChannels().find((c) => c.topic === `realtime:${channelName}`);
      if (existing) void supabase.removeChannel(existing);
    } catch {
      // safe-fail
    }

    let channel: ReturnType<typeof supabase.channel> | null = null;
    try {
      channel = supabase
        .channel(channelName)
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "notifications",
          },
          (payload) => {
            const rec = (payload.new || payload.old) as any;
            if (!rec || !rec.user_id || rec.user_id.toLowerCase() === normalizedEmail || rec.buzzer_id?.toLowerCase() === normalizedEmail) {
              void fetchNotifications();
            }
          },
        )
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "campaign_jobs",
          },
          (payload) => {
            const rec = (payload.new || payload.old) as any;
            if (!rec || !rec.buzzer_email || rec.buzzer_email.toLowerCase() === normalizedEmail) {
              void (async () => {
                await syncBuzzerActivities(normalizedEmail);
                await fetchNotifications();
              })();
            }
          },
        )
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "social_accounts",
          },
          (payload) => {
            const rec = (payload.new || payload.old) as any;
            if (!rec || !rec.buzzer_email || rec.buzzer_email.toLowerCase() === normalizedEmail) {
              void (async () => {
                await syncBuzzerActivities(normalizedEmail);
                await fetchNotifications();
              })();
            }
          },
        )
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "withdrawals",
          },
          (payload) => {
            const rec = (payload.new || payload.old) as any;
            if (!rec || !rec.buzzer_email || rec.buzzer_email.toLowerCase() === normalizedEmail) {
              void (async () => {
                await syncBuzzerActivities(normalizedEmail);
                await fetchNotifications();
              })();
            }
          },
        )
        .subscribe((status) => {
          if (status === "SUBSCRIBED") {
            void (async () => {
              await syncBuzzerActivities(normalizedEmail);
              await fetchNotifications();
            })();
          }
        });
    } catch (err) {
      console.warn("Realtime subscription warning:", err);
    }

    return () => {
      clearInterval(interval);
      if (typeof window !== "undefined") {
        window.removeEventListener("buzzhub_buzzer_notif_created", onLocalNotif);
      }
      if (channel) {
        try {
          void supabase.removeChannel(channel);
        } catch {
          // safe-fail
        }
      }
    };
  }, [normalizedEmail, fetchNotifications, hookId]);

  const markAsRead = async (id: string) => {
    setNotifications((prev) => {
      const next = prev.map((n) => (n.id === id ? { ...n, is_read: true } : n));
      if (normalizedEmail) saveLocalNotifs(normalizedEmail, next);
      return next;
    });

    try {
      await supabase
        .from("notifications")
        .update({ is_read: true, updated_at: new Date().toISOString() })
        .eq("id", id);
    } catch {
      // safe-fail
    }
  };

  const markAllAsRead = async () => {
    if (!normalizedEmail) return;

    setNotifications((prev) => {
      const next = prev.map((n) => ({ ...n, is_read: true }));
      saveLocalNotifs(normalizedEmail, next);
      return next;
    });

    try {
      await supabase
        .from("notifications")
        .update({ is_read: true, updated_at: new Date().toISOString() })
        .or(`user_id.eq.${normalizedEmail},buzzer_id.eq.${normalizedEmail}`)
        .eq("is_read", false);
    } catch {
      // safe-fail
    }
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    refetch: fetchNotifications,
  };
}

/**
 * Buat notifikasi baru ke database Supabase dan localStorage
 */
export async function createBuzzerNotification(input: {
  user_id: string;
  buzzer_id?: string;
  title: string;
  message: string;
  type: BuzzerNotificationType;
  metadata?: Record<string, any>;
}) {
  const email = input.user_id.trim().toLowerCase();
  const newNotif: BuzzerNotification = {
    id: typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `notif_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    user_id: email,
    buzzer_id: input.buzzer_id?.trim().toLowerCase() || email,
    title: input.title,
    message: input.message,
    type: input.type,
    is_read: false,
    metadata: input.metadata ?? {},
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  // Simpan ke local storage selalu agar instan dan offline-ready
  const existing = getLocalNotifs(email);
  const updated = deduplicateNotifications([newNotif, ...existing.filter((item) => item.id !== newNotif.id)]).slice(0, 50);
  saveLocalNotifs(email, updated);

  // Dispatch custom event untuk update UI lokal seketika (0ms)
  if (typeof window !== "undefined") {
    try {
      window.dispatchEvent(
        new CustomEvent("buzzhub_buzzer_notif_created", {
          detail: { email, notif: newNotif },
        }),
      );
    } catch {
      // safe-fail
    }
  }

  try {
    await supabase.from("notifications").insert({
      id: newNotif.id,
      user_id: email,
      buzzer_id: newNotif.buzzer_id,
      title: newNotif.title,
      message: newNotif.message,
      type: newNotif.type,
      is_read: false,
      metadata: newNotif.metadata ?? {},
      created_at: newNotif.created_at,
      updated_at: newNotif.updated_at,
    });
  } catch {
    // safe-fail
  }
}

/**
 * 1. Notifikasi Bukti Tugas Berhasil Diupload & Menunggu Verifikasi Admin
 */
export async function notifyTaskSubmitted(input: {
  buzzerEmail: string;
  campaignTitle: string;
  jobId?: string;
  isResubmit?: boolean;
}) {
  const isResubmit = Boolean(input.isResubmit);
  const message = isResubmit
    ? `Perbaikan bukti tugas "${input.campaignTitle}" berhasil dikirim. Menunggu verifikasi oleh admin.`
    : `Bukti pengerjaan tugas "${input.campaignTitle}" berhasil diunggah. Menunggu verifikasi oleh admin.`;

  await createBuzzerNotification({
    user_id: input.buzzerEmail,
    title: "Menunggu Verifikasi Admin",
    message,
    type: "verification_pending",
    metadata: {
      jobId: input.jobId,
      campaignTitle: input.campaignTitle,
      action: "task_submitted",
      isResubmit,
    },
  });
}

/**
 * 2. Notifikasi Tugas Selesai & Disetujui oleh Admin
 */
export async function notifyTaskApproved(input: {
  buzzerEmail: string;
  campaignTitle: string;
  fee: number;
  jobId?: string;
}) {
  const feeText = formatCurrency(input.fee);
  await createBuzzerNotification({
    user_id: input.buzzerEmail,
    title: "Tugas Selesai & Terverifikasi",
    message: `Tugas "${input.campaignTitle}" sudah selesai dan sudah diverifikasi oleh admin. Fee ${feeText} telah masuk ke saldo.`,
    type: "task_approved",
    metadata: { jobId: input.jobId, fee: input.fee, campaignTitle: input.campaignTitle },
  });
}

/**
 * 3. Notifikasi Tugas Ditolak/Revisi (Rejected)
 */
export async function notifyTaskRejected(input: {
  buzzerEmail: string;
  campaignTitle: string;
  reason: string;
  jobId?: string;
}) {
  const reasonText = input.reason?.trim() || "Bukti belum sesuai dengan instruksi.";
  await createBuzzerNotification({
    user_id: input.buzzerEmail,
    title: "Tugas Perlu Revisi / Ditolak",
    message: `Tugas "${input.campaignTitle}" ditolak: ${reasonText}`,
    type: "task_rejected",
    metadata: { jobId: input.jobId, reason: reasonText, campaignTitle: input.campaignTitle },
  });
}

/**
 * 4. Notifikasi Pengajuan / Pembaruan / Nonaktif Akun Media Sosial
 */
export async function notifySocialAccountSubmitted(input: {
  buzzerEmail: string;
  platform: string;
  username: string;
  action: "tambah" | "pembaruan" | "nonaktif";
}) {
  const isTambah = input.action === "tambah";
  const isPembaruan = input.action === "pembaruan";
  const title = isTambah
    ? "Menunggu Verifikasi Media Sosial"
    : isPembaruan
    ? "Menunggu Verifikasi Pembaruan Media Sosial"
    : "Menunggu Persetujuan Admin";

  const message = isTambah
    ? `Pengajuan akun media sosial ${input.platform} (@${input.username}) berhasil dikirim. Menunggu verifikasi oleh admin.`
    : isPembaruan
    ? `Permintaan pembaruan data media sosial ${input.platform} (@${input.username}) berhasil diajukan. Menunggu verifikasi oleh admin.`
    : `Permintaan penonaktifan akun media sosial ${input.platform} (@${input.username}) berhasil diajukan ke admin.`;

  await createBuzzerNotification({
    user_id: input.buzzerEmail,
    title,
    message,
    type: "verification_pending",
    metadata: {
      platform: input.platform,
      username: input.username,
      action: input.action,
    },
  });
}

/**
 * 5. Notifikasi Hasil Verifikasi Media Sosial oleh Admin
 */
export async function notifySocialAccountVerified(input: {
  buzzerEmail: string;
  platform: string;
  username: string;
  status: "approved" | "rejected";
  reason?: string;
}) {
  const isApproved = input.status === "approved";
  const title = isApproved
    ? "Media Sosial Terverifikasi"
    : "Verifikasi Media Sosial Ditolak";

  const message = isApproved
    ? `Akun media sosial ${input.platform} (@${input.username}) telah disetujui dan diverifikasi oleh admin.`
    : `Pengajuan media sosial ${input.platform} (@${input.username}) ditolak admin: ${input.reason?.trim() || "Tidak memenuhi ketentuan."}`;

  await createBuzzerNotification({
    user_id: input.buzzerEmail,
    title,
    message,
    type: isApproved ? "verification_approved" : "verification_rejected",
    metadata: {
      platform: input.platform,
      username: input.username,
      status: input.status,
    },
  });
}

/**
 * 6. Notifikasi Status Pendaftaran Akun Buzzer
 */
export async function notifyBuzzerApplicationStatus(input: {
  buzzerEmail: string;
  buzzerName: string;
  status: "submitted" | "approved" | "rejected";
  note?: string;
}) {
  const title = input.status === "submitted"
    ? "Pendaftaran Akun Buzzer Terkirim"
    : input.status === "approved"
    ? "Akun Buzzer Terverifikasi"
    : "Verifikasi Akun Ditolak";

  const message = input.status === "submitted"
    ? `Pendaftaran akun buzzer Anda berhasil diajukan dan sedang menunggu verifikasi oleh admin.`
    : input.status === "approved"
    ? `Selamat ${input.buzzerName}! Akun buzzer Anda telah disetujui dan diverifikasi oleh admin. Anda kini dapat mengambil pekerjaan.`
    : `Pengajuan akun buzzer Anda ditolak oleh admin${input.note ? `: ${input.note}` : "."}`;

  await createBuzzerNotification({
    user_id: input.buzzerEmail,
    title,
    message,
    type: input.status === "submitted"
      ? "verification_pending"
      : input.status === "approved"
      ? "verification_approved"
      : "verification_rejected",
    metadata: {
      status: input.status,
      note: input.note,
    },
  });
}

/**
 * 7. Notifikasi Tugas Baru Tersedia (New Task)
 */
export async function notifyNewTaskAvailable(input: {
  buzzerEmail: string;
  campaignTitle: string;
  level?: string;
  campaignId?: string;
}) {
  const levelText = input.level ? `tier level ${input.level}` : "level Anda";
  await createBuzzerNotification({
    user_id: input.buzzerEmail,
    title: "Tugas Baru Tersedia",
    message: `Ada tugas baru "${input.campaignTitle}" yang cocok untuk ${levelText}. Ambil segera sebelum kuota penuh!`,
    type: "new_task",
    metadata: { campaignId: input.campaignId, campaignTitle: input.campaignTitle },
  });
}

/**
 * 8. Notifikasi Saldo & Pencairan (Payout)
 */
export async function notifyPayoutUpdate(input: {
  buzzerEmail: string;
  amount: number;
  status: "Diproses" | "Berhasil" | "Disetujui" | "Ditolak" | string;
  withdrawalId?: string;
  adminNote?: string;
}) {
  const amountText = formatCurrency(input.amount);
  let title = `Pencairan Saldo ${input.status}`;
  let message = `Update status pencairan saldo ${amountText}: ${input.status}.`;
  if (input.status === "Berhasil" || input.status === "Disetujui") {
    title = "Pencairan Saldo Disetujui";
    message = `Selamat! Permohonan pencairan saldo sebesar ${amountText} telah disetujui & berhasil ditransfer oleh Admin. Silakan periksa mutasi rekening / e-wallet Anda.`;
  } else if (input.status === "Diproses") {
    title = "Pencairan Saldo Diproses";
    message = `Permohonan pencairan saldo sebesar ${amountText} sedang diproses oleh admin.`;
  } else if (input.status === "Ditolak") {
    title = "Pencairan Saldo Ditolak";
    const note = input.adminNote ? ` (Alasan: ${input.adminNote})` : "";
    message = `Permohonan pencairan saldo sebesar ${amountText} ditolak oleh admin${note}. Saldo Anda tetap berada di akun.`;
  }

  await createBuzzerNotification({
    user_id: input.buzzerEmail,
    buzzer_id: input.buzzerEmail,
    title,
    message,
    type: "payout",
    metadata: {
      withdrawalId: input.withdrawalId,
      amount: input.amount,
      status: input.status,
      adminNote: input.adminNote,
    },
  });
}

/**
 * 9. Notifikasi Performa & Rating
 */
export async function notifyRatingReceived(input: {
  buzzerEmail: string;
  campaignTitle: string;
  stars: number;
  comment?: string;
}) {
  const commentText = input.comment?.trim() ? ` — "${input.comment.trim()}"` : "";
  await createBuzzerNotification({
    user_id: input.buzzerEmail,
    title: "Ulasan & Rating Baru",
    message: `Customer memberikan rating ⭐ ${input.stars} untuk tugas "${input.campaignTitle}"${commentText}`,
    type: "rating",
    metadata: { campaignTitle: input.campaignTitle, stars: input.stars },
  });
}

/**
 * 10. Notifikasi Kenaikan Level Tier (Level Up)
 * Dilindungi deduplikasi agar tidak spam berkali-kali untuk tier yang sama.
 */
export async function notifyLevelUp(input: {
  buzzerEmail: string;
  newLevel: string;
}) {
  const email = input.buzzerEmail.trim().toLowerCase();
  const local = getLocalNotifs(email);
  const alreadyNotified = local.some(
    (n) => n.type === "level_up" && (n.metadata?.newLevel === input.newLevel || n.message.includes(`tier ${input.newLevel}`)),
  );
  if (alreadyNotified) return;

  await createBuzzerNotification({
    user_id: email,
    title: "Selamat! Level Kamu Naik 🎉",
    message: `Akun buzzer kamu berhasil naik ke level tier ${input.newLevel}! Fee per pekerjaan kamu kini lebih tinggi.`,
    type: "level_up",
    metadata: { newLevel: input.newLevel },
  });
}

/**
 * Helper untuk menyinkronkan event yang sudah ada ke daftar notifikasi buzzer
 */
async function syncBuzzerActivities(buzzerEmail: string) {
  try {
    const email = buzzerEmail.trim().toLowerCase();
    const localNotifs = getLocalNotifs(email);

    const existingJobKeys = new Set(
      localNotifs.map((n) => {
        const jId = n.metadata?.jobId;
        if (!jId) return "";
        const actionType = n.type || (n.title.toLowerCase().includes("disetujui") ? "task_approved" : "task_rejected");
        return `${jId}_${actionType}`;
      }).filter(Boolean),
    );

    const existingWithdrawalKeys = new Set(
      localNotifs.map((n) => {
        const wId = n.metadata?.withdrawalId;
        const st = n.metadata?.status;
        return wId && st ? `${wId}_${st}` : wId ? `${wId}` : "";
      }).filter(Boolean),
    );

    // Ambil data jobs yang sudah ada
    const { data: jobs } = await (supabase as any)
      .from("campaign_jobs")
      .select("id, campaign_title, status, admin_verified_at, payout, buzzer_amount, note, rejection_reason")
      .eq("buzzer_email", email)
      .limit(30);

    for (const job of jobs ?? []) {
      if (job.status === "Review" && !job.admin_verified_at) {
        const key = `${job.id}_verification_pending`;
        if (existingJobKeys.has(key)) continue;
        await notifyTaskSubmitted({
          buzzerEmail: email,
          campaignTitle: job.campaign_title || "Kampanye",
          jobId: job.id,
        });
        existingJobKeys.add(key);
      } else if (job.status === "Selesai" || (job.status === "Review" && job.admin_verified_at)) {
        const key = `${job.id}_task_approved`;
        if (existingJobKeys.has(key)) continue;
        const fee = Number(job.buzzer_amount || job.payout || 0);
        await notifyTaskApproved({
          buzzerEmail: email,
          campaignTitle: job.campaign_title || "Kampanye",
          fee,
          jobId: job.id,
        });
        existingJobKeys.add(key);
      } else if (job.status === "Revisi" || job.status === "Ditolak") {
        const key = `${job.id}_task_rejected`;
        if (existingJobKeys.has(key)) continue;
        await notifyTaskRejected({
          buzzerEmail: email,
          campaignTitle: job.campaign_title || "Kampanye",
          reason: job.rejection_reason || job.note || "Perlu perbaikan bukti.",
          jobId: job.id,
        });
        existingJobKeys.add(key);
      }
    }

    // Ambil data penarikan saldo
    const { data: withdrawals } = await supabase
      .from("withdrawals")
      .select("id, amount, status")
      .eq("buzzer_email", email)
      .limit(10);

    for (const w of withdrawals ?? []) {
      const wKey = `${w.id}_${w.status}`;
      if (existingWithdrawalKeys.has(wKey)) continue;
      if (w.status === "Berhasil" || w.status === "Disetujui" || w.status === "Diproses" || w.status === "Ditolak") {
        await notifyPayoutUpdate({
          buzzerEmail: email,
          amount: Number(w.amount || 0),
          status: w.status,
          withdrawalId: w.id,
        });
        existingWithdrawalKeys.add(wKey);
      }
    }
  } catch {
    // Sinkronisasi background bersifat safe-fail
  }
}
