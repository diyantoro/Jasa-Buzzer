import { createServerFn } from "@tanstack/react-start";
import { describeDbError } from "./db-error";

export type CheckoutInput = {
  invoice_no: string;
  customer_name: string;
  customer_email: string;
  campaign_name: string;
  campaign_type: string;
  service_type?: string;
  method: string;
  note?: string | null;
  brief: string;
  slots: number;
  start_date: string;
  deadline: string;
  catalog_id?: string;
  package_id?: string;
  package_name?: string;
  package_price?: number;
  package_buzzer_count?: number;
  buzzer_tier?: "Biasa" | "Pro" | "Premium";
  allow_tier_downgrade?: boolean;
};

function clean(value: unknown): string {
  return String(value ?? "").trim();
}

function validate(input: CheckoutInput) {
  const email = clean(input.customer_email).toLowerCase();
  const invoice = clean(input.invoice_no);
  const start = clean(input.start_date);
  const deadline = clean(input.deadline);
  if (!email || !email.includes("@")) throw new Error("Email customer tidak valid.");
  if (!invoice) throw new Error("Nomor invoice wajib diisi.");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(start) || !/^\d{4}-\d{2}-\d{2}$/.test(deadline)) {
    throw new Error("Tanggal campaign harus berformat YYYY-MM-DD.");
  }
  if (deadline < start) throw new Error("Deadline tidak boleh sebelum tanggal mulai.");
  if (!clean(input.campaign_name) || !clean(input.customer_name)) {
    throw new Error("Nama campaign dan customer wajib diisi.");
  }
  return { ...input, customer_email: email, invoice_no: invoice, start_date: start, deadline };
}

async function db() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return supabaseAdmin as any;
}

export const createCheckoutCampaignFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => data as CheckoutInput)
  .handler(async ({ data }) => {
    const input = validate(data);
    const { rateLimitMessage, resetRateLimit, RATE_LIMITS } = await import("./rate-limit.server");
    const key = `checkout:${input.customer_email}:${input.invoice_no}`;
    const limited = rateLimitMessage(key, 5, RATE_LIMITS.login.windowMs);
    if (limited) throw new Error(limited);

    const client = await db();
    let result: any;
    let error: any;
    if (input.catalog_id && input.package_id) {
      ({ data: result, error } = await client.rpc("create_customer_catalog_package_scheduled_payment_campaign", {
        p_catalog_id: input.catalog_id,
        p_package_id: input.package_id,
        p_invoice_no: input.invoice_no,
        p_customer_name: input.customer_name,
        p_customer_email: input.customer_email,
        p_campaign_name: input.campaign_name,
        p_method: input.method,
        p_note: input.note ?? null,
        p_brief: input.brief,
        p_start_date: input.start_date,
        p_deadline: input.deadline,
        p_package_name: input.package_name ?? null,
        p_package_price: input.package_price ?? 0,
        p_package_buzzer_count: input.package_buzzer_count ?? input.slots,
      }));
    } else if (input.catalog_id) {
      ({ data: result, error } = await client.rpc("create_customer_catalog_scheduled_payment_campaign", {
        p_catalog_id: input.catalog_id,
        p_invoice_no: input.invoice_no,
        p_customer_name: input.customer_name,
        p_customer_email: input.customer_email,
        p_campaign_name: input.campaign_name,
        p_method: input.method,
        p_note: input.note ?? null,
        p_brief: input.brief,
        p_start_date: input.start_date,
        p_deadline: input.deadline,
        p_slots: input.slots,
      }));
    } else {
      ({ data: result, error } = await client.rpc("create_customer_custom_scheduled_payment_campaign", {
        p_invoice_no: input.invoice_no,
        p_customer_name: input.customer_name,
        p_customer_email: input.customer_email,
        p_campaign_name: input.campaign_name,
        p_platform: input.campaign_type,
        p_service_type: input.service_type ?? "",
        p_method: input.method,
        p_note: input.note ?? null,
        p_brief: input.brief,
        p_slots: input.slots,
        p_start_date: input.start_date,
        p_deadline: input.deadline,
        p_buzzer_tier: input.buzzer_tier ?? "Biasa",
        p_allow_tier_downgrade: input.allow_tier_downgrade ?? false,
      }));
    }
    if (error) throw new Error(describeDbError(error));
    const row = Array.isArray(result) ? result[0] : result;
    if (!row?.payment_id || !row?.campaign_id) throw new Error("Database tidak mengembalikan ID pembayaran dan campaign.");
    resetRateLimit(key);
    return { paymentId: row.payment_id as string, campaignId: row.campaign_id as string };
  });
