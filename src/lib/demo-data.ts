// Dataset dummy terpusat untuk landing page & dashboard (admin, customer, buzzer).
// Angka ringkasan mengikuti data marketing: 1.284 kampanye, 8.420 buzzer aktif,
// 312 klien puas, dan 96 kampanye berhasil masuk trending #1.
//
// Semua data dibangkitkan secara deterministik (seeded PRNG) supaya angka dan
// urutannya konsisten setiap kali halaman dimuat / di-refresh.
import type { Campaign, CampaignJob } from "@/lib/campaign-store";
import type { Payment } from "@/lib/finance-store";

export const DEMO_STATS = {
  totalCampaigns: 1284,
  activeBuzzers: 8420,
  satisfiedClients: 312,
  trendingHits: 96,
} as const;

/* -------------------------------------------------------------------------- */
/* Deterministic random                                                       */
/* -------------------------------------------------------------------------- */

function mulberry32(seed: number) {
  let a = seed;
  return function random() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const random = mulberry32(20261026);
const randInt = (min: number, max: number) => min + Math.floor(random() * (max - min + 1));
const pick = <T>(list: readonly T[]) => list[Math.floor(random() * list.length)];
const round = (n: number, step = 1000) => Math.round(n / step) * step;

const DAY = 86_400_000;
const NOW = Date.now();
const daysAgoISO = (days: number) => new Date(NOW - days * DAY).toISOString();
const daysAgoDate = (days: number) => daysAgoISO(days).slice(0, 10);
const daysAheadDate = (days: number) => daysAgoDate(-days);

/* -------------------------------------------------------------------------- */
/* Pools                                                                      */
/* -------------------------------------------------------------------------- */

const PLATFORMS = ["Instagram", "TikTok", "X (Twitter)", "YouTube", "Facebook"] as const;

const CAMPAIGN_PLATFORMS = [
  "Instagram",
  "TikTok",
  "X (Twitter)",
  "YouTube",
  "Facebook",
  "Telegram",
] as const;

const SERVICE_TYPES = [
  "Trending Topic Booster",
  "Viral Marketing Campaign",
  "Brand Awareness Push",
  "Social Engagement Booster",
  "Product Review Campaign",
  "Influencer Support Program",
  "Counter Narrative Response",
  "Livestream Amplifier",
  "Video Reels Distribution",
  "Community Seeding",
] as const;

const CAMPAIGN_TITLES = [
  "Launch Produk Skincare Glowin",
  "Hashtag #KopiSenjaPulang",
  "FinPay Cashback Challenge",
  "Grand Opening Cabang Bandung",
  "Promo Ramadhan Bunda",
  "Launch Menu KFC Zinger",
  "Kampanye #PilihHijau",
  "Voucher Grab Weekend",
  "Roadshow Erigo 5 Kota",
  "Trending Topic #WeekendVibes",
  "Review Earphone Sonik",
  "Tutorial Makeup Wardah",
  "Concert Cheer Isyana",
  "Seminar Bisnis 2026",
  "Product Launch Vivo V40",
  "Community Meetup Devs",
  "Flash Mob Mall Kuningan",
  "Endorse Snack Chitato",
  "Rally Damai Kandidat",
  "Livestream Shopee 12.12",
  "Boost Reels Skincare",
  "Awareness Aplikasi Bank X",
  "Viral TikTok Dance Brand",
  "Counter Narrative Krisis",
  "Seeding Grup Ibu Muda",
  "Peluncuran Buku Best Seller",
  "Konser Amal Yayasan",
  "Aktivasi Kampus 10 Univ",
  "Live IG Beauty Class",
  "Distribusi Video Iklan CPG",
  "Festival Kuliner Nusantara",
  "Peluncuran Motor Listrik",
  "Kampanye Hemat Energi",
  "Promo Akhir Tahun Marketplace",
  "Webinar UMKM Naik Kelas",
  "Peluncuran Aplikasi Kasir",
  "Brand Ambassador Skincare",
  "Turnamen E-Sports Nasional",
  "Donasi Bencana Bersama",
  "Peluncuran Kafe Rooftop",
] as const;

const BRAND_PREFIX = [
  "PT",
  "CV",
  "Toko",
  "Brand",
  "Startup",
  "Komunitas",
  "Yayasan",
  "Koperasi",
] as const;

const BRAND_NAME = [
  "Kreatif Digital",
  "Kopi Senja",
  "FinPay",
  "Bunda Sejahtera",
  "Glowin Beauty",
  "Sonik Audio",
  "Erigo Apparel",
  "Wardah Nusantara",
  "Chitato Snack",
  "Bank Cakra",
  "Vivo Mobile",
  "Shopee Partner",
  "Grab Merchant",
  "Isyana Live",
  "Hijau Lestari",
  "Rasa Nusantara",
  "Motor Listrik ID",
  "Kampus Merdeka",
  "Rooftop Kota",
  "E-Sports Arena",
] as const;

const FIRST_NAMES = [
  "Rizky",
  "Anisa",
  "Budi",
  "Dewi",
  "Fajar",
  "Sinta",
  "Yoga",
  "Maya",
  "Rian",
  "Nadia",
  "Agus",
  "Putri",
  "Hendra",
  "Lestari",
  "Bayu",
  "Intan",
  "Reza",
  "Ayu",
  "Dimas",
  "Sari",
  "Taufik",
  "Mega",
  "Ardi",
  "Nisa",
  "Galih",
  "Wulan",
  "Fikri",
  "Ratna",
  "Yusuf",
  "Citra",
] as const;

const LAST_NAMES = [
  "Pratama",
  "Wulandari",
  "Santoso",
  "Larasati",
  "Nugroho",
  "Maharani",
  "Pradana",
  "Kartika",
  "Anggraini",
  "Firmansyah",
  "Saputra",
  "Hidayat",
  "Permata",
  "Ramadhan",
  "Kusuma",
  "Setiawan",
  "Halim",
  "Purnama",
  "Syahputra",
  "Maulida",
] as const;

const CITIES = [
  "Jakarta Selatan",
  "Jakarta Pusat",
  "Bandung",
  "Surabaya",
  "Yogyakarta",
  "Semarang",
  "Medan",
  "Makassar",
  "Denpasar",
  "Balikpapan",
  "Malang",
  "Palembang",
  "Bogor",
  "Depok",
  "Tangerang",
  "Bekasi",
] as const;

const BUZZER_LEVELS = ["Bronze", "Silver", "Gold", "Platinum", "Diamond"] as const;
const BUZZER_LEVEL_PERCENTAGE: Record<string, number> = {
  Bronze: 40,
  Silver: 45,
  Gold: 50,
  Platinum: 55,
  Diamond: 60,
};

const CUSTOMER_EMAIL_DOMAIN = ["marketing", "growth", "owner", "cs", "brand", "tim"] as const;

/* -------------------------------------------------------------------------- */
/* Buzzer                                                                     */
/* -------------------------------------------------------------------------- */

export type DemoBuzzer = {
  id: string;
  name: string;
  username: string;
  platform: string;
  followers: number;
  rating: number;
  jobs: number;
  status: string;
  earnings: number;
};

/** 7 buzzer unggulan (dipakai leaderboard) — sisanya dibangkitkan. */
const FEATURED_BUZZERS: DemoBuzzer[] = [
  {
    id: "b1",
    name: "Rizky Pratama",
    username: "@rizkybuzz",
    platform: "Instagram",
    followers: 24500,
    rating: 4.9,
    jobs: 142,
    status: "Aktif",
    earnings: 8750000,
  },
  {
    id: "b2",
    name: "Anisa Wulandari",
    username: "@anisaw",
    platform: "TikTok",
    followers: 89200,
    rating: 4.8,
    jobs: 98,
    status: "Aktif",
    earnings: 12400000,
  },
  {
    id: "b3",
    name: "Budi Santoso",
    username: "@budis_id",
    platform: "X (Twitter)",
    followers: 15600,
    rating: 4.7,
    jobs: 211,
    status: "Aktif",
    earnings: 9650000,
  },
  {
    id: "b4",
    name: "Dewi Larasati",
    username: "@dewilara",
    platform: "Instagram",
    followers: 41200,
    rating: 4.9,
    jobs: 76,
    status: "Verifikasi",
    earnings: 4300000,
  },
  {
    id: "b5",
    name: "Fajar Nugroho",
    username: "@fajarng",
    platform: "YouTube",
    followers: 12800,
    rating: 4.6,
    jobs: 54,
    status: "Aktif",
    earnings: 6100000,
  },
  {
    id: "b6",
    name: "Sinta Maharani",
    username: "@sintam",
    platform: "TikTok",
    followers: 156000,
    rating: 5.0,
    jobs: 187,
    status: "Aktif",
    earnings: 21500000,
  },
  {
    id: "b7",
    name: "Yoga Pradana",
    username: "@yogapd",
    platform: "Facebook",
    followers: 9800,
    rating: 4.5,
    jobs: 33,
    status: "Nonaktif",
    earnings: 1850000,
  },
];

export const demoBuzzers: DemoBuzzer[] = [
  ...FEATURED_BUZZERS,
  ...Array.from({ length: DEMO_STATS.activeBuzzers - FEATURED_BUZZERS.length }, (_, index) => {
    const i = index + FEATURED_BUZZERS.length;
    const first = FIRST_NAMES[i % FIRST_NAMES.length];
    const last = LAST_NAMES[(i * 7 + 3) % LAST_NAMES.length];
    const jobs = randInt(8, 320);
    const followers = randInt(2500, 240000);
    const statusRoll = random();
    const status = statusRoll > 0.94 ? "Nonaktif" : statusRoll > 0.86 ? "Verifikasi" : "Aktif";
    return {
      id: `b${i + 1}`,
      name: `${first} ${last}`,
      username: `@${first.toLowerCase()}${i + 1}`,
      platform: PLATFORMS[i % PLATFORMS.length],
      followers,
      rating: +(4.3 + random() * 0.7).toFixed(1),
      jobs,
      status,
      earnings: round(jobs * randInt(35000, 90000), 50000),
    };
  }),
];

export const demoBuzzerEmails = demoBuzzers.map((buzzer, index) =>
  index === 0 ? "buzzer@buzzhub.id" : `buzzer${index + 1}@buzzhub.id`,
);

export type DemoBuzzerProfile = {
  email: string;
  name: string;
  platform: string | null;
  followers: number;
  avatar_url: string | null;
};

export const demoBuzzerProfiles: DemoBuzzerProfile[] = demoBuzzers.map((buzzer, index) => ({
  email: demoBuzzerEmails[index],
  name: buzzer.name,
  platform: buzzer.platform,
  followers: buzzer.followers,
  avatar_url: null,
}));

/* -------------------------------------------------------------------------- */
/* Customer                                                                   */
/* -------------------------------------------------------------------------- */

export type DemoCustomer = {
  id: string;
  name: string;
  contact: string;
  campaigns: number;
  spent: number;
  since: string;
};

const FEATURED_CUSTOMERS: DemoCustomer[] = [
  {
    id: "c1",
    name: "PT Kreatif Digital",
    contact: "marketing@kreatif.id",
    campaigns: 12,
    spent: 32500000,
    since: "2024-02-14",
  },
  {
    id: "c2",
    name: "Brand Kopi Senja",
    contact: "owner@kopisenja.co",
    campaigns: 5,
    spent: 8700000,
    since: "2024-08-03",
  },
  {
    id: "c3",
    name: "Startup FinPay",
    contact: "growth@finpay.app",
    campaigns: 8,
    spent: 18250000,
    since: "2024-05-21",
  },
  {
    id: "c4",
    name: "Caleg Bagus Wijaya",
    contact: "tim@baguswijaya.id",
    campaigns: 3,
    spent: 14500000,
    since: "2025-09-10",
  },
  {
    id: "c5",
    name: "Toko Online Bunda",
    contact: "cs@tokobunda.com",
    campaigns: 21,
    spent: 27600000,
    since: "2023-11-30",
  },
];

export const demoCustomers: DemoCustomer[] = [
  ...FEATURED_CUSTOMERS,
  ...Array.from({ length: DEMO_STATS.satisfiedClients - FEATURED_CUSTOMERS.length }, (_, index) => {
    const i = index + FEATURED_CUSTOMERS.length;
    const prefix = BRAND_PREFIX[i % BRAND_PREFIX.length];
    const brand = BRAND_NAME[(i * 3 + 1) % BRAND_NAME.length];
    const slug = `${brand.toLowerCase().replace(/[^a-z0-9]+/g, "")}${i + 1}`;
    const campaigns = randInt(1, 28);
    return {
      id: `c${i + 1}`,
      name: `${prefix} ${brand}${i >= BRAND_NAME.length ? ` ${Math.floor(i / BRAND_NAME.length) + 1}` : ""}`,
      contact: `${CUSTOMER_EMAIL_DOMAIN[i % CUSTOMER_EMAIL_DOMAIN.length]}@${slug}.id`,
      campaigns,
      spent: round(campaigns * randInt(750000, 3200000), 50000),
      since: daysAgoDate(randInt(60, 900)),
    };
  }),
];

/* -------------------------------------------------------------------------- */
/* Campaign & job                                                             */
/* -------------------------------------------------------------------------- */

const CAMPAIGN_STATUSES: Campaign["status"][] = [
  "Aktif",
  "Aktif",
  "Aktif",
  "Aktif",
  "Selesai",
  "Selesai",
  "Selesai",
  "Review",
  "Draft",
  "Dibatalkan",
];

function campaignTitle(index: number) {
  const base = CAMPAIGN_TITLES[index % CAMPAIGN_TITLES.length];
  const batch = Math.floor(index / CAMPAIGN_TITLES.length);
  return batch === 0 ? base : `${base} — Batch ${batch + 1}`;
}

export const demoCampaigns: Campaign[] = Array.from(
  { length: DEMO_STATS.totalCampaigns },
  (_, index) => {
    const customer = demoCustomers[index % demoCustomers.length];
    const slots = pick([10, 20, 25, 30, 40, 50, 60, 80, 100, 120, 150]);
    const payoutPerBuzzer = round(randInt(15, 150) * 1000, 1000);
    const budget = payoutPerBuzzer * slots;
    const status = CAMPAIGN_STATUSES[index % CAMPAIGN_STATUSES.length];
    const createdDaysAgo = randInt(1, 420);
    const deadlineDays = status === "Selesai" ? createdDaysAgo - randInt(3, 20) : randInt(-45, 40);
    const platform = CAMPAIGN_PLATFORMS[index % CAMPAIGN_PLATFORMS.length];
    return {
      id: `demo-campaign-${index + 1}`,
      title: campaignTitle(index),
      customer_email: customer.contact,
      customer_name: customer.name,
      platform,
      service_type: SERVICE_TYPES[index % SERVICE_TYPES.length],
      thumbnail_url: null,
      catalog_visible: true,
      brief: `Brief kampanye ${SERVICE_TYPES[index % SERVICE_TYPES.length]} untuk ${customer.name} di ${platform}. Konten wajib natural, sesuai brand guideline, dan menyertakan hashtag kampanye.`,
      budget,
      payout_per_buzzer: payoutPerBuzzer,
      slots,
      start_date: daysAgoDate(Math.max(0, createdDaysAgo - 1)),
      deadline:
        deadlineDays >= 0 ? daysAheadDate(deadlineDays) : daysAgoDate(Math.abs(deadlineDays)),
      status,
      payment_id: `demo-payment-${index + 1}`,
      catalog_id: null,
      package_id: null,
      package_name: null,
      package_price: null,
      package_buzzer_count: slots,
      price_per_buzzer: payoutPerBuzzer,
      buzzer_count: slots,
      total_amount: budget,
      payment_status: "Pembayaran Disetujui",
      payment_rejection_reason: null,
      target_reached_at: status === "Selesai" ? daysAgoISO(randInt(1, 30)) : null,
      created_at: daysAgoISO(createdDaysAgo),
      updated_at: daysAgoISO(Math.max(0, createdDaysAgo - randInt(0, 10))),
    };
  },
);

const JOB_STATUSES: CampaignJob["status"][] = [
  "Selesai",
  "Selesai",
  "Selesai",
  "Selesai",
  "Selesai",
  "Review",
  "Review",
  "Diambil",
  "Diambil",
  "Tersedia",
  "Tersedia",
  "Revisi",
  "Ditolak",
];

export const demoCampaignJobs: CampaignJob[] = Array.from({ length: 1600 }, (_, index) => {
  const campaign = demoCampaigns[(index * 13 + 5) % demoCampaigns.length];
  const status = JOB_STATUSES[index % JOB_STATUSES.length];
  const level = BUZZER_LEVELS[index % BUZZER_LEVELS.length];
  const percentage = BUZZER_LEVEL_PERCENTAGE[level];
  const grossPrice = campaign.payout_per_buzzer;
  const buzzerAmount = Math.round((grossPrice * percentage) / 100);
  const assigned = status !== "Tersedia";
  const buzzerIndex = (index * 31 + 7) % demoBuzzers.length;
  const buzzer = demoBuzzers[buzzerIndex];
  const updatedDaysAgo = status === "Selesai" ? randInt(0, 360) : randInt(0, 30);
  const createdDaysAgo = updatedDaysAgo + randInt(1, 20);
  const verified = status === "Selesai";
  return {
    id: `demo-job-${index + 1}`,
    campaign_id: campaign.id,
    campaign_title: campaign.title,
    platform: campaign.platform,
    buzzer_email: assigned ? demoBuzzerEmails[buzzerIndex] : null,
    buzzer_name: assigned ? buzzer.name : null,
    gross_price: grossPrice,
    buzzer_level: assigned ? level : null,
    buzzer_percentage: assigned ? percentage : null,
    buzzer_amount: assigned ? buzzerAmount : null,
    admin_percentage: assigned ? 100 - percentage : null,
    admin_amount: assigned ? grossPrice - buzzerAmount : null,
    payout: buzzerAmount,
    deadline: campaign.deadline,
    brief: campaign.brief,
    status,
    proof_url: verified ? "https://buzzhub.id/demo/proof.jpg" : null,
    note: verified ? "Pekerjaan selesai dan sudah diverifikasi admin." : null,
    rejection_reason: status === "Ditolak" ? "Bukti pengerjaan tidak sesuai brief." : null,
    rejected_at: status === "Ditolak" ? daysAgoISO(updatedDaysAgo) : null,
    rejected_by: null,
    resubmission_count: status === "Revisi" ? 1 : 0,
    submitted_at: assigned ? daysAgoISO(updatedDaysAgo) : null,
    admin_verified_at: verified ? daysAgoISO(updatedDaysAgo) : null,
    customer_rated_at:
      verified && index % 3 === 0 ? daysAgoISO(Math.max(0, updatedDaysAgo - 1)) : null,
    attendance_status: null,
    attendance_confirmed_at: null,
    checkin_at: null,
    checkout_at: null,
    activity_note: null,
    location_name: null,
    event_date: null,
    event_time: null,
    created_at: daysAgoISO(createdDaysAgo),
    updated_at: daysAgoISO(updatedDaysAgo),
  } satisfies CampaignJob;
});

export const demoCompletedJobs: CampaignJob[] = demoCampaignJobs.filter(
  (job) => job.status === "Selesai",
);

/* -------------------------------------------------------------------------- */
/* Proyeksi bentuk data lama (dipakai landing page / leaderboard)             */
/* -------------------------------------------------------------------------- */

export type DemoLegacyCampaign = {
  id: string;
  title: string;
  customer: string;
  service: string;
  buzzersJoined: number;
  target: number;
  status: string;
  progress: number;
  deadline: string;
  budget: number;
};

export const demoCampaignsLegacy: DemoLegacyCampaign[] = demoCampaigns.map((campaign, index) => {
  const progress =
    campaign.status === "Selesai"
      ? 100
      : campaign.status === "Draft" || campaign.status === "Dibatalkan"
        ? 0
        : randInt(15, 95);
  return {
    id: `k${index + 1}`,
    title: campaign.title,
    customer: campaign.customer_name,
    service: campaign.service_type ?? SERVICE_TYPES[index % SERVICE_TYPES.length],
    buzzersJoined: Math.round((campaign.slots * progress) / 100),
    target: campaign.slots,
    status: campaign.status === "Aktif" ? "Berjalan" : campaign.status,
    progress,
    deadline: campaign.deadline,
    budget: campaign.budget,
  };
});

/* -------------------------------------------------------------------------- */
/* Ringkasan turunan                                                          */
/* -------------------------------------------------------------------------- */

export const demoAdminTotals = demoCompletedJobs.reduce(
  (acc, job) => {
    const total = Number(job.gross_price ?? 0);
    const buzzerShare = Number(job.buzzer_amount ?? job.payout ?? 0);
    acc.revenue += total;
    acc.profit += Math.max(0, total - buzzerShare);
    return acc;
  },
  { revenue: 0, profit: 0 },
);

export const demoTrendingCampaigns = demoCampaignsLegacy
  .filter((campaign) => campaign.progress === 100)
  .slice(0, DEMO_STATS.trendingHits);

/* -------------------------------------------------------------------------- */
/* Aktivitas admin (pembayaran & akun)                                        */
/* -------------------------------------------------------------------------- */

const PAYMENT_METHODS = ["Transfer Bank", "QRIS", "Virtual Account"] as const;
const PAYMENT_CAMPAIGN_TYPES: Record<string, Payment["campaign_type"]> = {
  Instagram: "Instagram",
  TikTok: "TikTok",
  "X (Twitter)": "X (Twitter)",
  YouTube: "YouTube",
  Facebook: "Facebook",
  Telegram: "Instagram",
};

/** Riwayat pembayaran dummy untuk grafik & tabel Aktivitas admin. */
export const demoPayments: Payment[] = Array.from({ length: 420 }, (_, index) => {
  const campaign = demoCampaigns[(index * 7 + 3) % demoCampaigns.length];
  const createdDaysAgo = randInt(0, 89);
  const createdAt = daysAgoISO(createdDaysAgo);
  const statusRoll = random();
  const status: Payment["status"] =
    statusRoll > 0.86 ? "Menunggu Verifikasi" : statusRoll > 0.04 ? "Lunas" : "Gagal";
  const amount = campaign.budget;
  const buzzerCost = campaign.payout_per_buzzer * campaign.slots;
  const paid = status === "Lunas";
  return {
    id: `demo-payment-${index + 1}`,
    campaign_id: campaign.id,
    invoice_no: `INV-2026-${String(2001 + index)}`,
    customer_name: campaign.customer_name,
    customer_email: campaign.customer_email,
    campaign_name: campaign.title,
    campaign_type: PAYMENT_CAMPAIGN_TYPES[campaign.platform] ?? "Instagram",
    method: PAYMENT_METHODS[index % PAYMENT_METHODS.length],
    amount,
    price_per_buzzer: campaign.payout_per_buzzer,
    buzzer_count: campaign.slots,
    total_amount: amount,
    buzzer_cost: buzzerCost,
    fee: Math.max(0, amount - buzzerCost),
    status,
    note: null,
    proof_url: paid ? "https://buzzhub.id/demo/payment-proof.jpg" : null,
    rejection_reason: status === "Gagal" ? "Bukti transfer tidak valid." : null,
    verified_at: paid ? createdAt : null,
    verified_by: paid ? "admin@buzzhub.id" : null,
    paid_at: paid ? createdAt : null,
    created_at: createdAt,
    updated_at: createdAt,
  };
});

/** Akun dummy (buzzer & customer) untuk metrik "Pengguna Baru". */
export const demoActivityAccounts: Array<{
  email: string;
  role: string;
  created_at: string;
}> = [
  ...demoBuzzerProfiles.slice(0, 900).map((profile) => ({
    email: profile.email,
    role: "buzzer",
    created_at: daysAgoISO(randInt(0, 89)),
  })),
  ...demoCustomers.slice(0, 120).map((customer) => ({
    email: customer.contact,
    role: "customer",
    created_at: daysAgoISO(randInt(0, 89)),
  })),
];
