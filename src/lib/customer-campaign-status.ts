import type { Campaign, CampaignJob } from "@/lib/campaign-store";

export type CustomerCampaignStatus =
  | "Menunggu Pembayaran"
  | "Menunggu Verifikasi Admin"
  | "Pembayaran Ditolak"
  | "Menunggu Konfirmasi"
  | "Dibatalkan"
  | "Menunggu Buzzer"
  | "Sedang Dikerjakan"
  | "Menunggu Verifikasi"
  | "Selesai";

export function deriveCustomerCampaignStatus(
  campaign: Campaign,
  jobs: CampaignJob[],
): CustomerCampaignStatus {
  if (campaign.payment_status === "Menunggu Pembayaran") return "Menunggu Pembayaran";
  if (
    campaign.payment_status === "Menunggu Verifikasi" ||
    campaign.payment_status === "Menunggu Verifikasi Admin"
  ) {
    return "Menunggu Verifikasi Admin";
  }
  if (campaign.payment_status === "Pembayaran Ditolak") return "Pembayaran Ditolak";
  if (campaign.status === "Draft") return "Menunggu Konfirmasi";
  if (campaign.status === "Dibatalkan") return "Dibatalkan";
  if (campaign.status === "Selesai") return "Selesai";
  if (jobs.length && jobs.every((job) => job.status === "Selesai")) return "Selesai";
  if (jobs.some((job) => job.status === "Review")) return "Menunggu Verifikasi";
  if (jobs.some((job) => job.status === "Diambil" || job.status === "Revisi")) {
    return "Sedang Dikerjakan";
  }
  return "Menunggu Buzzer";
}

export const CUSTOMER_CAMPAIGN_STATUS_STYLES: Record<CustomerCampaignStatus, string> = {
  "Menunggu Pembayaran": "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
  "Menunggu Verifikasi Admin":
    "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
  "Pembayaran Ditolak": "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300",
  "Menunggu Konfirmasi": "bg-purple-100 text-purple-700 dark:bg-purple-500/15 dark:text-purple-300",
  Dibatalkan: "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300",
  "Menunggu Buzzer": "bg-slate-100 text-slate-700 dark:bg-slate-500/15 dark:text-slate-200",
  "Sedang Dikerjakan": "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300",
  "Menunggu Verifikasi": "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
  Selesai: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
};
