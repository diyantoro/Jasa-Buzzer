// Pemetaan baris `service_catalogs` (produk yang dibuat admin) menjadi
// `Service` yang dipakai dashboard & wizard customer.
//
// Dipakai di dua tempat agar konsisten:
// - `src/routes/customer.tsx` (halaman Katalog / daftar layanan)
// - `src/components/customer-homepage-section.tsx` (kartu rekomendasi homepage)
import type { CampaignTypeKey, Platform, Service } from "@/lib/customer-store";

const SUPPORTED_PLATFORMS = [
  "Instagram",
  "TikTok",
  "X (Twitter)",
  "Facebook",
  "YouTube",
  "Telegram",
] as const;

/** Samakan nilai platform katalog menjadi Platform yang dikenal aplikasi. */
export function normalizeCatalogPlatform(platform?: string | null): Platform {
  if (platform && SUPPORTED_PLATFORMS.includes(platform as (typeof SUPPORTED_PLATFORMS)[number])) {
    return platform as Platform;
  }
  return "Instagram";
}

/** Tebak jenis campaign (Like, Komentar, ...) dari service_type atau judul. */
export function inferCatalogCampaignType(value?: string | null): CampaignTypeKey | undefined {
  const source = (value ?? "").toLowerCase();
  if (!source) return undefined;
  if (source.includes("like") && source.includes("komentar")) return "like-komentar";
  if (source.includes("like") && source.includes("comment")) return "like-komentar";
  if (source.includes("like") && !source.includes("komentar")) return "like";
  if (source.includes("komentar") || source.includes("comment")) return "komentar";
  if (source.includes("share")) return "share";
  if (source.includes("follow")) return "follow";
  if (source.includes("review") || source.includes("ulasan")) return "review";
  return undefined;
}

export type CatalogServiceInput = {
  id: string;
  title: string;
  platform?: string | null;
  service_type?: string | null;
  description?: string | null;
  price?: number | string | null;
  slots?: number | string | null;
  thumbnail_url?: string | null;
};

/**
 * Ubah satu baris katalog admin menjadi `Service`.
 * Service hasil pemetaan selalu punya `catalogId`, sehingga wizard customer
 * langsung menuju ringkasan/checkout tanpa menanyakan platform & jenis lagi.
 */
export function normalizeCatalogService(catalog: CatalogServiceInput): Service {
  const platform = normalizeCatalogPlatform(catalog.platform);
  const title = String(catalog.title ?? "Layanan Katalog").trim() || "Layanan Katalog";
  const serviceType = String(catalog.service_type ?? "Layanan buzzer").trim() || "Layanan buzzer";
  const description = String(catalog.description ?? serviceType).trim() || serviceType;
  const type =
    inferCatalogCampaignType(catalog.service_type) ??
    inferCatalogCampaignType(catalog.title) ??
    "like";
  const category = serviceType.includes("Offline") ? "Offline Buzzer" : "Online Buzzer";
  const basePrice = Number(catalog.price ?? 0);
  const baseSlots = Number(catalog.slots ?? 25);
  return {
    id: `catalog-${catalog.id}`,
    catalogId: catalog.id,
    category,
    name: title,
    platforms: [platform],
    desc: serviceType,
    longDesc: description,
    rating: 4.9,
    reviews: 45,
    campaignType: type,
    catalogPricePerBuzzer: basePrice,
    catalogSlotsAvailable: baseSlots,
    thumbnailUrl: catalog.thumbnail_url ?? null,
    image: "from-fuchsia-500 to-pink-500",
    benefits: [
      "Buzzer terverifikasi & real people",
      "Laporan realtime & transparan",
      "Konten sesuai brand guideline",
      "Garansi target reach tercapai",
    ],
    faqs: [
      {
        q: "Berapa lama campaign berjalan?",
        a: "Rata-rata 5–14 hari tergantung kebutuhan campaign.",
      },
      { q: "Apakah bisa custom brief?", a: "Bisa, brief bisa didiskusikan sebelum eksekusi." },
      { q: "Bagaimana laporan disampaikan?", a: "Dashboard realtime + PDF final report." },
    ],
    packages: [
      {
        tier: "Basic",
        price: basePrice,
        buzzers: baseSlots,
        reach: `${baseSlots} target buzzer`,
        benefits: ["Buzzer aktif", "Laporan progres"],
      },
      {
        tier: "Professional",
        price: Math.round(basePrice * 2.2),
        buzzers: Math.round(baseSlots * 2.4),
        reach: `${Math.round(baseSlots * 2.4)} target buzzer`,
        benefits: ["Buzzer premium", "Briefing khusus"],
      },
      {
        tier: "Enterprise",
        price: Math.round(basePrice * 4.5),
        buzzers: Math.round(baseSlots * 6),
        reach: `${Math.round(baseSlots * 6)} target buzzer`,
        benefits: ["Target besar", "Priority support"],
      },
    ],
  };
}
