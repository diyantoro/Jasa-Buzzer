// Pemetaan baris `service_catalogs` (produk yang dibuat admin) menjadi
// `Service` yang dipakai dashboard & wizard customer.
//
// Dipakai di dua tempat agar konsisten:
// - `src/routes/customer.tsx` (halaman Katalog / daftar layanan)
// - `src/components/customer-homepage-section.tsx` (kartu rekomendasi homepage)
import { CAMPAIGN_TYPES, type CampaignTypeKey, type Platform, type Service } from "@/lib/customer-store";
import type { ServicePricing } from "@/lib/campaign-store";
import { normalizeBuzzerTier, type BuzzerTier } from "@/lib/buzzer-level";

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

/** Kunci harga: `platform::jenis layanan` (huruf kecil, dirapikan). */
function pricingKey(platform: string, serviceType: string) {
  return `${platform}::${serviceType.trim().toLowerCase()}`;
}

/** Kunci harga per kelas: `platform::jenis layanan::kelas`. */
function pricingTierKey(platform: string, serviceType: string, tier: BuzzerTier) {
  return `${pricingKey(platform, serviceType)}::${tier.toLowerCase()}`;
}

export type TierPriceMap = Map<string, Partial<Record<BuzzerTier, number>>>;

/**
 * Indeks harga per kelas dari konfigurasi admin (`service_pricing`).
 * Satu kombinasi platform + jenis layanan bisa punya harga berbeda untuk
 * Biasa / Pro / Premium.
 */
export function buildServicePricingTierIndex(pricings: ServicePricing[]): TierPriceMap {
  const index: TierPriceMap = new Map();
  for (const pricing of pricings) {
    if (pricing.status !== "Aktif") continue;
    const price = Number(pricing.price_per_buzzer);
    if (!Number.isFinite(price) || price <= 0) continue;
    const tier = normalizeBuzzerTier(pricing.buzzer_tier) ?? "Biasa";
    const key = pricingKey(pricing.platform, pricing.service_type);
    const entry = index.get(key) ?? {};
    const current = entry[tier];
    if (current === undefined || price < current) entry[tier] = price;
    index.set(key, entry);
  }
  return index;
}

/** Harga per kelas untuk satu platform + jenis layanan. */
export function tierPricesFor(
  index: TierPriceMap,
  platform: string,
  serviceType: string,
): Partial<Record<BuzzerTier, number>> {
  return index.get(pricingKey(platform, serviceType)) ?? {};
}

/** Harga satu kelas; `undefined` bila admin belum mengisi. */
export function priceForTier(
  index: TierPriceMap,
  platform: string,
  serviceType: string,
  tier: BuzzerTier,
): number | undefined {
  const prices = tierPricesFor(index, platform, serviceType);
  const value = prices[tier];
  return typeof value === "number" ? value : undefined;
}

/**
 * Indeks harga per buzzer dari konfigurasi admin (`service_pricing`).
 * Kalau ada beberapa baris untuk kombinasi yang sama, dipakai harga terendah.
 */
export function buildServicePricingIndex(pricings: ServicePricing[]): Map<string, number> {
  const index = new Map<string, number>();
  for (const pricing of pricings) {
    if (pricing.status !== "Aktif") continue;
    const price = Number(pricing.price_per_buzzer);
    if (!Number.isFinite(price) || price <= 0) continue;
    const key = pricingKey(pricing.platform, pricing.service_type);
    const current = index.get(key);
    if (current === undefined || price < current) index.set(key, price);
  }
  return index;
}

export type ServicePriceInfo = {
  amount: number;
  /** "/ buzzer" bila harga dihitung per buzzer (layanan online non-katalog). */
  unit?: string;
  /** "Mulai dari" bila total bergantung jumlah buzzer / platform. */
  prefix?: string;
  /** Label kecil di atas nominal pada kartu. */
  label: string;
  /**
   * - `catalog`: harga paket dari katalog admin (sudah final).
   * - `pricing`: harga per buzzer dari konfigurasi admin (sama dengan checkout).
   * - `estimate`: perkiraan dari paket bawaan (admin belum mengisi harga).
   */
  source: "catalog" | "pricing" | "estimate";
};

/**
 * Harga yang ditampilkan di kartu layanan. Untuk layanan online non-katalog,
 * nilainya diambil dari `service_pricing` supaya sama dengan yang ditagih saat
 * checkout. Offline & katalog memakai harga paket.
 */
export function servicePriceInfo(
  service: Service,
  pricingIndex?: Map<string, number>,
): ServicePriceInfo {
  const isCatalog = !!service.catalogId;
  const isOffline = service.category === "Offline Buzzer";
  const packagePrice = service.packages.length
    ? Math.min(...service.packages.map((item) => Number(item.price) || 0))
    : 0;

  if (isCatalog || isOffline) {
    return {
      amount: isCatalog ? Number(service.catalogPricePerBuzzer ?? packagePrice) : packagePrice,
      label: "Harga Pesanan",
      source: isCatalog ? "catalog" : "estimate",
    };
  }

  const typeName = service.campaignType
    ? CAMPAIGN_TYPES.find((item) => item.key === service.campaignType)?.name
    : undefined;
  if (typeName && pricingIndex) {
    const prices = service.platforms
      .map((platform) => pricingIndex.get(pricingKey(platform, typeName)))
      .filter((value): value is number => typeof value === "number");
    if (prices.length > 0) {
      return {
        amount: Math.min(...prices),
        unit: "/ buzzer",
        prefix: "Mulai dari",
        label: "Harga per buzzer",
        source: "pricing",
      };
    }
  }

  return { amount: packagePrice, label: "Estimasi harga", source: "estimate" };
}

