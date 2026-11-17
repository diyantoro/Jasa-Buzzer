/**
 * Audit log server-side untuk operasi istimewa (Fase 3 - kesiapan).
 *
 * Tabel `audit_logs` hanya bisa ditulis/dibaca `service_role`; client tidak
 * memiliki grant apa pun. Penulisan bersifat best-effort: kegagalan audit
 * tidak boleh membatalkan operasi bisnis yang sudah berhasil.
 */
export type AuditInput = {
  actor: { email: string; role: string };
  action: string;
  targetType?: string;
  targetId?: string | null;
  details?: Record<string, unknown>;
};

export async function writeAuditLog(input: AuditInput): Promise<void> {
  try {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await (supabaseAdmin as any).from("audit_logs").insert({
      actor_email: input.actor.email.trim().toLowerCase(),
      actor_role: input.actor.role,
      action: input.action,
      target_type: input.targetType ?? null,
      target_id: input.targetId ? String(input.targetId) : null,
      details: input.details ?? {},
    });
    if (error) console.warn("[Audit] Gagal menulis audit log:", error.message ?? error);
  } catch (error) {
    console.warn("[Audit] Gagal menulis audit log:", error);
  }
}
