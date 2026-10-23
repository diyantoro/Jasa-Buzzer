// Client-side reactive "database" untuk dashboard customer.
// Persistent per-akun via localStorage + event bus utk realtime UI.
import { useEffect, useSyncExternalStore } from "react";
import { supabase } from "@/integrations/supabase/client";
import { createCustomerPaymentCampaign } from "@/lib/campaign-store";
import proofInstagram from "@/assets/proof-instagram.jpg";
import proofTiktok from "@/assets/proof-tiktok.jpg";
import proofX from "@/assets/proof-x.jpg";

export type Platform =
  | "Instagram" | "TikTok" | "X (Twitter)" | "Facebook" | "YouTube" | "Telegram";

export type OrderStatus =
  | "Menunggu" | "Menunggu Verifikasi Admin" | "Diproses" | "Berjalan" | "Selesai" | "Dibatalkan";

export type PaymentStatus =
  | "Belum Dibayar" | "Menunggu Verifikasi" | "Lunas" | "Refund" | "Gagal";

export type ServiceCategory = "Online Buzzer";

export type ServicePackage = {
  tier: string;
  price: number;
  buzzers: number;
  reach: string;
  benefits: string[];
};

export type Service = {
  id: string;
  /** Present only for a listing created by an admin in the service catalog. */
  catalogId?: string;
  catalogPricePerBuzzer?: number;
  catalogSlotsAvailable?: number;
  thumbnailUrl?: string | null;
  category: ServiceCategory;
  name: string;
  platforms: Platform[];
  desc: string;
  longDesc: string;
  rating: number;
  reviews: number;
  image: string; // gradient color hint
  benefits: string[];
  faqs: { q: string; a: string }[];
  packages: ServicePackage[];
  /** Jenis campaign cepat (Like, Komentar, Share, ...) yang dipilih di wizard langkah 2. */
  campaignType?: CampaignTypeKey;
};

export type CampaignTypeKey =
  | "like" | "komentar" | "like-komentar" | "share" | "follow" | "review";


export type CampaignReport = {
  reach: number;
  impression: number;
  like: number;
  comment: number;
  share: number;
  engagementRate: number;
  sentiment: { positive: number; neutral: number; negative: number };
  daily: { date: string; reach: number; impression: number; engagement: number }[];
  buzzers: { name: string; platform: Platform; rating: number; status: "Aktif" | "Selesai" }[];
};

export type Order = {
  id: string;
  campaignId?: string;
  buzzerAccounts?: string[];
  invoice: string;
  serviceId: string;
  serviceName: string;
  serviceType?: string;
  packageTier: string;
  catalogPackageId?: string;
  packageSnapshotName?: string;
  packageSnapshotPrice?: number;
  packageSnapshotBuzzerCount?: number;
  platform: Platform;
  campaignName: string;
  description: string;
  link?: string;
  location?: string;
  startDate: string;
  endDate: string;
  buzzers: number;
  buzzersJoined: number;
  progress: number; // 0-100
  status: OrderStatus;
  total: number;
  createdAt: string;
  catalogId?: string;
  thumbnailUrl?: string;
  report: CampaignReport;
  proofs: OrderProof[];
};

/** Bukti upload (screenshot) dari buzzer bahwa pesanan sudah selesai dikerjakan. */
export type OrderProof = {
  id: string;
  buzzerName: string;
  buzzerEmail?: string | null;
  platform: Platform;
  imageUrl: string;
  caption: string;
  postLink?: string;
  uploadedAt: string;
  verified: boolean;
};

export type Payment = {
  id: string;
  invoice: string;
  orderId: string;
  campaignName: string;
  method: string;
  channel: string; // BCA, GoPay, QRIS...
  amount: number;
  status: PaymentStatus;
  date: string;
  pendingOrder?: Order;
};

export type Notification = {
  id: string;
  title: string;
  body: string;
  type: "order" | "campaign" | "payment" | "system";
  date: string;
  createdAt?: string;
  read: boolean;
};

export type CustomerProfile = {
  name: string;
  email: string;
  phone: string;
  city: string;
  company: string;
  balance: number;
};

export type CustomerState = {
  profile: CustomerProfile;
  orders: Order[];
  payments: Payment[];
  notifications: Notification[];
};

const EVT = "buzzhub:customer-store";
const keyFor = (email: string) => `buzzhub.customer.${email.toLowerCase()}`;
const pendingPayments = new Map<string, Payment>();

function daysAgo(n: number) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}
function daysAhead(n: number) { return daysAgo(-n); }

const PLATFORMS: Platform[] = ["Instagram", "TikTok", "X (Twitter)", "Facebook", "YouTube", "Telegram"];

const IMG_GRADIENTS = [
  "from-fuchsia-500 to-pink-500",
  "from-purple-500 to-indigo-500",
  "from-cyan-500 to-blue-500",
  "from-amber-500 to-orange-500",
  "from-emerald-500 to-teal-500",
  "from-rose-500 to-red-500",
  "from-violet-500 to-purple-600",
  "from-sky-500 to-indigo-500",
];

const ONLINE_SERVICES = [
  { name: "Trending Topic Booster", desc: "Naikkan hashtag ke trending nasional dalam hitungan jam." },
  { name: "Viral Marketing Campaign", desc: "Distribusi konten viral lintas platform." },
  { name: "Brand Awareness Push", desc: "Perkenalkan brand ke jutaan audiens tertarget." },
  { name: "Social Engagement Booster", desc: "Like, comment, share organik dari akun real." },
  { name: "Product Review Campaign", desc: "Review jujur dari micro-influencer sesuai niche." },
  { name: "Influencer Support Program", desc: "Dukungan penuh dari 100+ influencer terverifikasi." },
  { name: "Counter Narrative Response", desc: "Manajemen krisis & narasi tandingan real-time." },
  { name: "Livestream Amplifier", desc: "Boost penonton & interaksi saat live." },
  { name: "Video Reels Distribution", desc: "Sebar video pendek ke jaringan buzzer TikTok/Reels." },
  { name: "Community Seeding", desc: "Konten disemai ke grup & komunitas relevan." },
];

function makeServices(): Service[] {
  const build = (category: ServiceCategory, list: { name: string; desc: string }[], baseIdx: number): Service[] =>
    list.map((s, i) => {
      const idx = baseIdx + i;
      const basePrice = 500000 + i * 250000;
      return {
        id: `svc-${idx + 1}`,
        category,
        name: s.name,
        platforms: [PLATFORMS[i % 6], PLATFORMS[(i + 2) % 6]],
        desc: s.desc,
        longDesc: `${s.desc} Kami menggabungkan jaringan buzzer terverifikasi dengan strategi konten yang teruji. Cocok untuk brand yang ingin dampak nyata & terukur.`,
        rating: +(4.5 + Math.random() * 0.5).toFixed(1),
        reviews: 40 + Math.floor(Math.random() * 260),
        image: IMG_GRADIENTS[idx % IMG_GRADIENTS.length],
        benefits: [
          "Buzzer terverifikasi & real people",
          "Laporan realtime & transparan",
          "Konten sesuai brand guideline",
          "Garansi target reach tercapai",
        ],
        faqs: [
          { q: "Berapa lama campaign berjalan?", a: "Rata-rata 5–14 hari tergantung paket." },
          { q: "Apakah bisa custom brief?", a: "Bisa, brief bisa didiskusikan sebelum eksekusi." },
          { q: "Bagaimana laporan disampaikan?", a: "Dashboard realtime + PDF final report." },
        ],
        packages: [
          { tier: "Basic", price: basePrice, buzzers: 25, reach: "50K – 100K", benefits: ["25 buzzer aktif", "Reach 50–100K", "Laporan mingguan"] },
          { tier: "Professional", price: Math.round(basePrice * 2.2), buzzers: 60, reach: "150K – 300K", benefits: ["60 buzzer premium", "Reach 150–300K", "Laporan harian", "Content assist"] },
          { tier: "Enterprise", price: Math.round(basePrice * 4.5), buzzers: 150, reach: "500K – 1M+", benefits: ["150 buzzer + KOL", "Reach 500K–1M+", "Dedicated manager", "Priority support"] },
        ],
      };
    });
  return build("Online Buzzer", ONLINE_SERVICES, 0);
}

/* ====== Jenis Campaign (wizard langkah 2) ====== */
export const CAMPAIGN_TYPES: {
  key: CampaignTypeKey;
  name: string;
  desc: string;
  from: number;
}[] = [
  { key: "like", name: "Like", desc: "Meningkatkan jumlah like pada konten.", from: 4000 },
  { key: "komentar", name: "Komentar", desc: "Komentar natural pada konten Anda.", from: 6000 },
  { key: "like-komentar", name: "Like + Komentar", desc: "Kombinasi like dan komentar.", from: 8000 },
  { key: "share", name: "Share", desc: "Membantu meningkatkan share konten.", from: 6000 },
  { key: "follow", name: "Follow", desc: "Meningkatkan jumlah followers akun.", from: 6000 },
  { key: "review", name: "Review", desc: "Meningkatkan jumlah review/ulasan.", from: 8000 },
];

function makeCampaignTypeServices(): Service[] {
  return CAMPAIGN_TYPES.map((c, i) => ({
    id: `svc-ct-${c.key}`,
    category: "Online Buzzer" as ServiceCategory,
    name: `Campaign ${c.name}`,
    platforms: PLATFORMS,
    desc: c.desc,
    longDesc: `${c.desc} Dikerjakan oleh buzzer terverifikasi dengan akun aktif dan aktivitas natural.`,
    rating: 4.8,
    reviews: 120 + i * 17,
    image: IMG_GRADIENTS[i % IMG_GRADIENTS.length],
    benefits: [
      "Buzzer terverifikasi & real people",
      "Aktivitas natural, bukan bot",
      "Bukti pengerjaan berupa screenshot",
      "Laporan realtime & transparan",
    ],
    faqs: [
      { q: "Berapa lama pengerjaan?", a: "Umumnya 1–3 hari tergantung volume." },
      { q: "Apakah akun buzzer real?", a: "Ya, seluruh buzzer terverifikasi oleh admin." },
      { q: "Bagaimana buktinya?", a: "Setiap buzzer mengunggah screenshot pengerjaan." },
    ],
    campaignType: c.key,
    packages: [
      { tier: "Basic", price: c.from, buzzers: 25, reach: "5K – 15K", benefits: ["25 buzzer aktif", "Pengerjaan 1–2 hari", "Bukti screenshot"] },
      { tier: "Professional", price: Math.round(c.from * 2.2), buzzers: 60, reach: "20K – 50K", benefits: ["60 buzzer premium", "Pengerjaan prioritas", "Laporan harian"] },
      { tier: "Enterprise", price: Math.round(c.from * 4.5), buzzers: 150, reach: "80K – 200K", benefits: ["150 buzzer + KOL", "Dedicated manager", "Priority support"] },
    ],
  }));
}

export const SERVICES: Service[] = [...makeServices(), ...makeCampaignTypeServices()];


const CAMPAIGN_NAMES = [
  "Launch Produk Skincare Glowin", "Hashtag #KopiSenjaPulang", "FinPay Cashback Challenge",
  "Grand Opening Cabang Bandung", "Promo Ramadhan Bunda", "Launch Menu KFC Zinger",
  "Kampanye #PilihHijau", "Voucher Grab Weekend", "Roadshow Erigo 5 Kota",
  "Trending Topic #WeekendVibes", "Review Earphone Sonik", "Tutorial Makeup Wardah",
  "Concert Cheer Isyana", "Seminar Bisnis 2026", "Product Launch Vivo V40",
  "Community Meetup Devs", "Flash Mob Mall Kuningan", "Endorse Snack Chitato",
  "Rally Damai Kandidat", "Livestream Shopee 12.12", "Boost Reels Skincare",
  "Awareness Aplikasi Bank X", "Viral TikTok Dance Brand", "Counter Narrative Krisis",
  "Seeding Grup Ibu Muda", "Peluncuran Buku Best Seller", "Konser Amal Yayasan",
  "Aktivasi Kampus 10 Univ", "Live IG Beauty Class", "Distribusi Video Iklan CPG",
];

const METHODS = [
  { method: "QRIS", channel: "QRIS Nasional" },
  { method: "Transfer Bank", channel: "BCA" },
  { method: "Transfer Bank", channel: "BRI" },
  { method: "Transfer Bank", channel: "BNI" },
  { method: "Transfer Bank", channel: "Mandiri" },
];

function makeReport(buzzers: number, progress: number, days: number): CampaignReport {
  const reach = 45000 + Math.floor(Math.random() * 400000);
  const impression = Math.round(reach * (2 + Math.random()));
  const like = Math.round(reach * (0.06 + Math.random() * 0.05));
  const comment = Math.round(like * 0.15);
  const share = Math.round(like * 0.08);
  const engagement = +(((like + comment + share) / Math.max(1, reach)) * 100).toFixed(2);
  const pos = 60 + Math.floor(Math.random() * 30);
  const neu = Math.floor((100 - pos) * 0.7);
  const neg = 100 - pos - neu;
  const daily = Array.from({ length: Math.max(3, Math.min(14, days)) }).map((_, i) => ({
    date: daysAgo(days - i),
    reach: Math.round((reach / days) * (0.6 + Math.random() * 0.8)),
    impression: Math.round((impression / days) * (0.6 + Math.random() * 0.8)),
    engagement: +((0.5 + Math.random() * 4)).toFixed(2),
  }));
  const buzzerNames = ["Rizky P.", "Anisa W.", "Budi S.", "Dewi L.", "Fajar N.", "Sinta M.", "Yoga P.", "Maya K.", "Rian A.", "Nadia F."];
  const buzzerList = Array.from({ length: Math.min(8, buzzers) }).map((_, i) => ({
    name: buzzerNames[i % buzzerNames.length],
    platform: PLATFORMS[i % PLATFORMS.length],
    rating: +(4.4 + Math.random() * 0.6).toFixed(1),
    status: (progress >= 100 ? "Selesai" : i < 6 ? "Aktif" : "Selesai") as "Aktif" | "Selesai",
  }));
  return { reach, impression, like, comment, share, engagementRate: engagement, sentiment: { positive: pos, neutral: neu, negative: neg }, daily, buzzers: buzzerList };
}

const PROOF_IMAGES: Partial<Record<Platform, string>> = {
  "Instagram": proofInstagram,
  "TikTok": proofTiktok,
  "X (Twitter)": proofX,
};
const PROOF_FALLBACK = [proofInstagram, proofTiktok, proofX];

export function proofImageFor(platform: Platform, i = 0) {
  return PROOF_IMAGES[platform] ?? PROOF_FALLBACK[i % PROOF_FALLBACK.length];
}

/** Bukti screenshot demo dari buzzer yang sudah menyelesaikan pekerjaan. */
function makeProofs(report: CampaignReport, progress: number, days: number): OrderProof[] {
  const done = report.buzzers.filter((b) => b.status === "Selesai" || progress >= 50);
  return done.slice(0, 6).map((b, i) => ({
    id: `prf-${Math.random().toString(36).slice(2, 9)}`,
    buzzerName: b.name,
    platform: b.platform,
    imageUrl: proofImageFor(b.platform, i),
    caption: `Postingan sudah tayang di ${b.platform} sesuai brief.`,
    postLink: `https://buzzhub.id/post/${1000 + i}`,
    uploadedAt: daysAgo(Math.max(0, days - i - 1)),
    verified: progress >= 100,
  }));
}

export function getNotifRank(n: Notification): number {
  const title = (n.title || "").toLowerCase();
  const body = (n.body || "").toLowerCase();

  // Genesis: Notifikasi selamat datang adalah kejadian paling awal dalam akun
  if (n.id === "ntf-welcome" || n.type === "system" || title.includes("selamat datang")) {
    return 0;
  }
  // Pesanan selesai / rating
  if (title.includes("selesai") || body.includes("selesai")) {
    return 4;
  }
  // Admin menyetujui / menolak pesanan
  if (
    title.includes("disetujui") ||
    title.includes("ditolak") ||
    body.includes("disetujui") ||
    body.includes("ditolak")
  ) {
    return 3;
  }
  // Menunggu persetujuan admin
  if (
    title.includes("menunggu") ||
    title.includes("diverifikasi") ||
    body.includes("menunggu persetujuan") ||
    body.includes("akan memeriksa") ||
    body.includes("sedang diverifikasi")
  ) {
    return 2;
  }
  // Pesanan dibuat
  if (
    title.includes("dibuat") ||
    title.includes("pesanan") ||
    n.type === "order"
  ) {
    return 1;
  }
  return 1;
}

function getNotificationTime(n: Notification): number {
  if (n.createdAt) {
    const t = new Date(n.createdAt).getTime();
    if (!isNaN(t) && t > 0) return t;
  }
  if (n.id) {
    const match = n.id.match(/\d{10,}/);
    if (match) {
      const t = Number(match[0]);
      if (!isNaN(t) && t > 0) return t;
    }
  }
  if (n.date) {
    const t = new Date(n.date).getTime();
    if (!isNaN(t) && t > 0) return t;
  }
  return 0;
}

export function extractCampaignNameFromBody(body: string): string {
  if (!body) return "";
  const quoted = body.match(/campaign\s+"([^"]+)"/i);
  if (quoted && quoted[1]) return quoted[1].trim();
  const unquoted = body.match(/campaign\s+([^\s,;]+)/i);
  if (unquoted && unquoted[1]) return unquoted[1].trim();
  return "";
}

function extractCampaignKey(n: Notification): string {
  const text = `${n.title || ""} ${n.body || ""}`;
  return extractCampaignNameFromBody(text).toLowerCase();
}

export function sortNotifications(notifications: Notification[]): Notification[] {
  return [...notifications].sort((a, b) => {
    // 1. Genesis: Notif Selamat Datang SELALU di urutan paling bawah
    const isWelcomeA =
      a.id === "ntf-welcome" ||
      a.type === "system" ||
      (a.title || "").toLowerCase().includes("selamat datang");
    const isWelcomeB =
      b.id === "ntf-welcome" ||
      b.type === "system" ||
      (b.title || "").toLowerCase().includes("selamat datang");

    if (isWelcomeA && !isWelcomeB) return 1;
    if (!isWelcomeA && isWelcomeB) return -1;
    if (isWelcomeA && isWelcomeB) return 0;

    // 2. Jika untuk CAMPAIGN YANG SAMA:
    // Urutkan berdasarkan tahapan lifecycle pesanan (Disetujui > Menunggu Admin > Pesanan Dibuat)
    const cmpA = extractCampaignKey(a);
    const cmpB = extractCampaignKey(b);

    if (cmpA && cmpB && cmpA === cmpB) {
      const rankA = getNotifRank(a);
      const rankB = getNotifRank(b);
      if (rankB !== rankA) {
        return rankB - rankA; // Tahap lebih lanjut di atas untuk campaign yang sama
      }
    }

    // 3. Urutan kronologis waktu sebenarnya (terbaru di atas)
    const timeA = getNotificationTime(a);
    const timeB = getNotificationTime(b);

    if (timeA && timeB && timeB !== timeA) {
      return timeB - timeA; // Timestamp lebih baru di atas
    }

    // 4. Jika tanggal berbeda:
    const dayA = (a.createdAt || a.date || "").slice(0, 10);
    const dayB = (b.createdAt || b.date || "").slice(0, 10);
    if (dayA && dayB && dayA !== dayB) {
      return dayB.localeCompare(dayA); // Tanggal lebih baru di atas
    }

    // 5. Jika satu belum dibaca dan satu sudah dibaca: yang belum dibaca (terbaru/perlu perhatian) di atas
    if (a.read !== b.read) {
      return a.read ? 1 : -1;
    }

    // 6. Tie-breaker terakhir dengan rank
    const rankA = getNotifRank(a);
    const rankB = getNotifRank(b);
    if (rankB !== rankA) {
      return rankB - rankA;
    }

    return 0;
  });
}

function seed(email: string, name: string, profile: Partial<CustomerProfile> = {}): CustomerState {
  // Akun baru dimulai dengan daftar pesanan & pembayaran kosong.
  const orders: Order[] = [];
  const payments: Payment[] = [];

  const notifications: Notification[] = [
    {
      id: "ntf-welcome",
      title: "Selamat datang di BuzzHub",
      body: "Akun Anda berhasil dibuat. Mulai buat campaign pertama Anda sekarang.",
      type: "system",
      date: new Date().toISOString().slice(0, 10),
      createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
      read: false,
    },
  ];

  return {
    profile: {
      name,
      email,
      phone: profile.phone ?? "",
      city: profile.city ?? "",
      company: profile.company ?? "",
      balance: 0,
    },
    orders,
    payments,
    notifications,
  };
}

function read(email: string, name: string, profile: Partial<CustomerProfile> = {}): CustomerState {
  if (typeof window === "undefined") return seed(email, name, profile);
  try {
    const raw = localStorage.getItem(keyFor(email));
    if (raw) {
      const parsed = JSON.parse(raw) as CustomerState;
      const hydrated = {
        ...parsed,
        profile: {
          ...seed(email, name, profile).profile,
          ...parsed.profile,
          ...profile,
          name: parsed.profile?.name || name,
          email: parsed.profile?.email || email,
        },
      };
      hydrated.orders = (hydrated.orders ?? []).map((o) =>
        o.proofs
          ? o
          : { ...o, proofs: o.status === "Dibatalkan" || o.status === "Menunggu" ? [] : makeProofs(o.report, o.progress, 7) },
      );

      // Normalisasi & rapikan notifikasi customer sesuai alur:
      // 1. Selamat Datang (genesis akun)
      // 2. Pesanan dibuat
      // 3. Menunggu admin menyetujui pesanan
      // 4. Admin menyetujui pesanan
      const normalizedNotifs = (hydrated.notifications ?? []).map((n) => {
        let title = n.title;
        let body = n.body;
        let type = n.type;

        // Normalisasi "Pembayaran sedang diverifikasi" -> "Menunggu Persetujuan Admin"
        if (
          title.toLowerCase().includes("diverifikasi") ||
          body.toLowerCase().includes("akan memeriksa pembayaran") ||
          body.toLowerCase().includes("sedang diverifikasi")
        ) {
          title = "Menunggu Persetujuan Admin";
          const campaignName = extractCampaignNameFromBody(body) || "Anda";
          body = `Pesanan campaign "${campaignName}" sedang menunggu persetujuan dari admin.`;
          type = "order";
        }
        // Normalisasi "Pembayaran Disetujui" -> "Pesanan Disetujui"
        else if (
          title.toLowerCase().includes("pembayaran disetujui") ||
          (title.toLowerCase().includes("disetujui") && body.toLowerCase().includes("pembayaran"))
        ) {
          title = "Pesanan Disetujui";
          const campaignName = extractCampaignNameFromBody(body) || "Anda";
          body = `Pesanan campaign "${campaignName}" telah disetujui oleh admin. Campaign Anda sekarang aktif.`;
          type = "order";
        }
        // Normalisasi "Pembayaran Ditolak" -> "Pesanan Ditolak"
        else if (title.toLowerCase().includes("pembayaran ditolak")) {
          title = "Pesanan Ditolak";
          type = "order";
        }

        return {
          ...n,
          title,
          body,
          type,
        };
      });

      // Kumpulkan campaign yang sudah disetujui
      const approvedCampaignNames = new Set<string>();
      for (const ord of hydrated.orders ?? []) {
        if (ord.status === "Berjalan" || ord.status === "Selesai") {
          const cleanCamp = (ord.campaignName || "").trim().toLowerCase();
          if (cleanCamp) approvedCampaignNames.add(cleanCamp);
        }
      }
      for (const p of hydrated.payments ?? []) {
        if (p.status === "Lunas" || (p.status as string) === "Berhasil") {
          const cleanCamp = (p.campaignName || "").trim().toLowerCase();
          if (cleanCamp) approvedCampaignNames.add(cleanCamp);
        }
      }

      // Hapus notifikasi menunggu/diverifikasi untuk campaign yang sudah disetujui admin
      let filteredNotifs = normalizedNotifs.filter((n) => {
        const titleLower = (n.title || "").toLowerCase();
        const bodyLower = (n.body || "").toLowerCase();
        const isPending =
          titleLower.includes("menunggu") ||
          titleLower.includes("diverifikasi") ||
          bodyLower.includes("menunggu persetujuan") ||
          bodyLower.includes("sedang diverifikasi");
        if (isPending) {
          const camp = (extractCampaignNameFromBody(bodyLower) || extractCampaignNameFromBody(titleLower)).toLowerCase();
          if (camp && approvedCampaignNames.has(camp)) {
            return false; // Hapus notif pending karena pesanan sudah disetujui admin
          }
        }
        return true;
      });

      // Rekonsiliasi notif persetujuan dari orders & payments lokal jika belum ada notifikasinya
      for (const ord of hydrated.orders ?? []) {
        if (ord.status === "Berjalan" || ord.status === "Selesai") {
          const cleanCamp = (ord.campaignName || "").trim();
          if (cleanCamp) {
            const approvedBody = `Pesanan campaign "${cleanCamp}" telah disetujui oleh admin. Campaign Anda sekarang aktif.`;
            const hasApproveNotif = filteredNotifs.some(
              (n) =>
                n.title.toLowerCase().includes("disetujui") &&
                (n.body === approvedBody || n.body.includes(`"${cleanCamp}"`))
            );
            if (!hasApproveNotif) {
              filteredNotifs.unshift({
                id: `ntf-ord-approved-${ord.id || Date.now()}`,
                title: "Pesanan Disetujui",
                body: approvedBody,
                type: "order",
                date: ord.createdAt ? ord.createdAt.slice(0, 10) : new Date().toISOString().slice(0, 10),
                createdAt: new Date().toISOString(),
                read: false,
              });
            }
          }
        }
      }

      for (const p of hydrated.payments ?? []) {
        if (p.status === "Lunas" || (p.status as string) === "Berhasil") {
          const cleanCamp = (p.campaignName || "").trim();
          if (cleanCamp) {
            const approvedBody = `Pesanan campaign "${cleanCamp}" telah disetujui oleh admin. Campaign Anda sekarang aktif.`;
            const hasApproveNotif = filteredNotifs.some(
              (n) =>
                n.title.toLowerCase().includes("disetujui") &&
                (n.body === approvedBody || n.body.includes(`"${cleanCamp}"`))
            );
            if (!hasApproveNotif) {
              filteredNotifs.unshift({
                id: `ntf-pay-approved-${p.id || Date.now()}`,
                title: "Pesanan Disetujui",
                body: approvedBody,
                type: "order",
                date: p.date || new Date().toISOString().slice(0, 10),
                createdAt: new Date().toISOString(),
                read: false,
              });
            }
          }
        }
      }

      const workingNotifs = filteredNotifs;

      // Pastikan notifikasi selamat datang selalu ada di akun customer
      const hasWelcome = workingNotifs.some(
        (n) => n.id === "ntf-welcome" || n.title.toLowerCase().includes("selamat datang")
      );
      if (!hasWelcome) {
        workingNotifs.push({
          id: "ntf-welcome",
          title: "Selamat datang di BuzzHub",
          body: "Akun Anda berhasil dibuat. Mulai buat campaign pertama Anda sekarang.",
          type: "system",
          date: new Date().toISOString().slice(0, 10),
          createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
          read: false,
        });
      }

      // Deduplikasi notifikasi ganda
      const deduped: Notification[] = [];
      const seen = new Map<string, Notification>();
      for (const n of workingNotifs) {
        const key = `${n.title.trim().toLowerCase()}|${n.body.trim().toLowerCase()}`;
        if (!seen.has(key)) {
          seen.set(key, n);
          deduped.push(n);
        } else {
          const existing = seen.get(key)!;
          if (!n.read && existing.read) {
            existing.read = false;
          }
        }
      }

      hydrated.notifications = sortNotifications(deduped);
      return hydrated;
    }
  } catch { /* noop */ }
  const s = seed(email, name, profile);
  localStorage.setItem(keyFor(email), JSON.stringify(s));
  return s;
}

function write(email: string, state: CustomerState) {
  localStorage.setItem(keyFor(email), JSON.stringify(state));
  window.dispatchEvent(new Event(EVT));
}

export function useCustomerStore(
  email: string | undefined,
  name: string | undefined,
  profile: Partial<CustomerProfile> = {},
) {
  const nm = name ?? "Customer";
  useEffect(() => {
    if (email) {
      const hydrated = read(email, nm, profile);
      localStorage.setItem(keyFor(email), JSON.stringify(hydrated));
    }
  }, [email, nm, profile.company, profile.phone, profile.city]);

  useEffect(() => {
    if (!email) return;
    let active = true;
    const loadProfile = async () => {
      const { data, error } = await supabase
        .from("app_accounts")
        .select("name, email, phone, city, company")
        .eq("email", email.trim().toLowerCase())
        .eq("role", "customer")
        .maybeSingle();
      if (!active || error || !data) return;
      const current = read(email, nm, profile);
      write(email, {
        ...current,
        profile: {
          ...current.profile,
          name: data.name,
          email: data.email,
          phone: data.phone ?? "",
          city: data.city ?? "",
          company: data.company ?? current.profile.company,
        },
      });
    };
    void loadProfile();
    return () => { active = false; };
  }, [email, nm, profile.company, profile.phone, profile.city]);

  // Sinkronisasi realtime & polling data notifikasi, pembayaran, dan campaign customer dari Supabase
  useEffect(() => {
    if (!email) return;
    const normalizedEmail = email.trim().toLowerCase();
    let isMounted = true;

    const syncServerData = async () => {
      try {
        // 1. Ambil notifikasi dari tabel notifications di Supabase
        const { data: dbNotifs } = await supabase
          .from("notifications")
          .select("*")
          .eq("user_id", normalizedEmail)
          .order("created_at", { ascending: false })
          .limit(50);

        if (!isMounted) return;

        // 2. Ambil status pembayaran & campaign dari Supabase untuk rekonsiliasi otomatis
        const [payRes, cmpRes] = await Promise.all([
          supabase
            .from("payments")
            .select("id, invoice_no, campaign_name, status, rejection_reason, amount, method, created_at, customer_email")
            .ilike("customer_email", normalizedEmail),
          supabase
            .from("campaigns")
            .select("id, title, status, payment_status, payment_rejection_reason, budget, platform, slots, deadline, created_at, brief")
            .ilike("customer_email", normalizedEmail),
        ]);

        if (!isMounted) return;

        const dbPayments = payRes.data ?? [];
        const dbCampaigns = cmpRes.data ?? [];

        const currentState = read(normalizedEmail, nm);
        let stateChanged = false;

        // 3. Rekonsiliasi pembayaran Supabase ke local state customer
        const currentPayments = [...(currentState.payments ?? [])];
        for (const p of dbPayments) {
          let pStatus: PaymentStatus = "Menunggu Verifikasi";
          const rawStatus = (p.status || "").toLowerCase();
          if (rawStatus === "lunas" || rawStatus === "berhasil" || rawStatus === "disetujui") {
            pStatus = "Lunas";
          } else if (rawStatus === "gagal" || rawStatus === "ditolak") {
            pStatus = "Gagal";
          } else if (rawStatus === "refund") {
            pStatus = "Refund";
          } else if (rawStatus === "pending" || rawStatus === "menunggu pembayaran") {
            pStatus = "Belum Dibayar";
          } else {
            pStatus = "Menunggu Verifikasi";
          }

          const existingIdx = currentPayments.findIndex(
            (cp) =>
              cp.id === p.id ||
              (p.invoice_no && cp.invoice === p.invoice_no) ||
              (p.campaign_name && cp.campaignName.trim().toLowerCase() === p.campaign_name.trim().toLowerCase())
          );

          const dbAmount = Number(p.amount || 0);

          if (existingIdx >= 0) {
            if (currentPayments[existingIdx].status !== pStatus) {
              currentPayments[existingIdx] = { ...currentPayments[existingIdx], status: pStatus };
              stateChanged = true;
            }
            if ((!currentPayments[existingIdx].amount || currentPayments[existingIdx].amount === 0) && dbAmount > 0) {
              currentPayments[existingIdx] = {
                ...currentPayments[existingIdx],
                amount: dbAmount,
              };
              stateChanged = true;
            }
          } else {
            // Pelanggan baru: masukkan data pembayaran langsung agar muncul di dashboard customer
            currentPayments.unshift({
              id: p.id,
              invoice: p.invoice_no || `INV-${p.id.slice(0, 8).toUpperCase()}`,
              orderId: p.id,
              campaignName: p.campaign_name || "Campaign",
              amount: dbAmount,
              date: p.created_at ? p.created_at.slice(0, 10) : new Date().toISOString().slice(0, 10),
              method: p.method || "Transfer Bank",
              channel: "Manual Verification",
              status: pStatus,
            });
            stateChanged = true;
          }
        }

        // 4. Rekonsiliasi campaign Supabase ke orders customer
        const currentOrders = [...(currentState.orders ?? [])];
        for (const c of dbCampaigns) {
          const isApproved =
            c.payment_status === "Pembayaran Disetujui" ||
            c.payment_status === "Disetujui" ||
            (c.status === "Aktif" && c.payment_status !== "Pembayaran Ditolak");
          const existingOrdIdx = currentOrders.findIndex(
            (co) =>
              co.id === c.id ||
              co.campaignId === c.id ||
              co.campaignName.trim().toLowerCase() === (c.title || "").trim().toLowerCase()
          );

          if (existingOrdIdx >= 0) {
            if (isApproved && currentOrders[existingOrdIdx].status === "Menunggu") {
              currentOrders[existingOrdIdx] = { ...currentOrders[existingOrdIdx], status: "Berjalan" };
              stateChanged = true;
            } else if (c.status === "Selesai" && currentOrders[existingOrdIdx].status !== "Selesai") {
              currentOrders[existingOrdIdx] = { ...currentOrders[existingOrdIdx], status: "Selesai" };
              stateChanged = true;
            }
          } else {
            currentOrders.unshift({
              id: c.id,
              serviceId: (c as any).catalog_id || "srv-pro",
              campaignId: c.id,
              invoice: `INV-${c.id.slice(0, 8).toUpperCase()}`,
              serviceName: "Kampanye BuzzPro",
              packageTier: "Professional",
              platform: (c.platform || "Instagram") as Platform,
              campaignName: c.title || "Campaign",
              description: c.brief || "",
              startDate: c.created_at ? c.created_at.slice(0, 10) : new Date().toISOString().slice(0, 10),
              endDate: c.deadline || "",
              buzzers: Number(c.slots || 10),
              buzzersJoined: 0,
              progress: 0,
              status: (c.status === "Selesai" ? "Selesai" : c.status === "Dibatalkan" ? "Dibatalkan" : isApproved ? "Berjalan" : "Menunggu") as OrderStatus,
              total: Number(c.budget || 0),
              createdAt: c.created_at ? c.created_at.slice(0, 10) : new Date().toISOString().slice(0, 10),
              report: { reach: 0, impression: 0, like: 0, comment: 0, share: 0, engagementRate: 0, sentiment: { positive: 0, neutral: 0, negative: 0 }, daily: [], buzzers: [] },
              proofs: [],
            });
            stateChanged = true;
          }
        }

        // 5. Kumpulkan judul campaign yang sudah disetujui
        const approvedTitles = new Set<string>();
        for (const c of dbCampaigns) {
          const isApproved =
            c.payment_status === "Pembayaran Disetujui" ||
            c.payment_status === "Disetujui" ||
            (c.status === "Aktif" && c.payment_status !== "Pembayaran Ditolak");
          if (isApproved && c.title?.trim()) {
            approvedTitles.add(c.title.trim().toLowerCase());
          }
        }
        for (const p of dbPayments) {
          const rawStatus = (p.status || "").toLowerCase();
          const isLunas = rawStatus === "lunas" || rawStatus === "berhasil" || rawStatus === "disetujui";
          if (isLunas && p.campaign_name?.trim()) {
            approvedTitles.add(p.campaign_name.trim().toLowerCase());
          }
        }

        const currentList = currentState.notifications ?? [];
        let mergedNotifs = [...currentList];

        if (dbNotifs && dbNotifs.length > 0) {
          for (const dn of dbNotifs) {
            let title = dn.title;
            let body = dn.message;
            let type = (dn.type as Notification["type"]) || "order";

            // Normalisasi pesan notifikasi dari DB
            if (
              title.toLowerCase().includes("diverifikasi") ||
              body.toLowerCase().includes("akan memeriksa pembayaran")
            ) {
              title = "Menunggu Persetujuan Admin";
              const campaignName = extractCampaignNameFromBody(body) || "Anda";
              body = `Pesanan campaign "${campaignName}" sedang menunggu persetujuan dari admin.`;
              type = "order";
            } else if (
              title.toLowerCase().includes("pembayaran disetujui") ||
              (title.toLowerCase().includes("disetujui") && body.toLowerCase().includes("pembayaran"))
            ) {
              title = "Pesanan Disetujui";
              const campaignName = extractCampaignNameFromBody(body) || "Anda";
              body = `Pesanan campaign "${campaignName}" telah disetujui oleh admin. Campaign Anda sekarang aktif.`;
              type = "order";
            } else if (title.toLowerCase().includes("pembayaran ditolak")) {
              title = "Pesanan Ditolak";
              type = "order";
            }

            // Jika notifikasi ini adalah pending/menunggu untuk campaign yang SUDAH disetujui,
            // buang dan hapus dari database agar tidak pernah muncul lagi
            const isPending =
              title.toLowerCase().includes("menunggu") ||
              title.toLowerCase().includes("diverifikasi") ||
              body.toLowerCase().includes("menunggu persetujuan");
            const campKey = (extractCampaignNameFromBody(body) || extractCampaignNameFromBody(title)).toLowerCase();
            if (isPending && campKey && approvedTitles.has(campKey)) {
              stateChanged = true;
              void supabase.from("notifications").delete().eq("id", dn.id);
              continue;
            }

            const alreadyHas = mergedNotifs.some(
              (m) =>
                m.id === dn.id ||
                (m.title.toLowerCase() === title.toLowerCase() &&
                  m.body.toLowerCase() === body.toLowerCase())
            );
            if (!alreadyHas) {
              mergedNotifs.push({
                id: dn.id,
                title,
                body,
                type,
                date: dn.created_at ? dn.created_at.slice(0, 10) : new Date().toISOString().slice(0, 10),
                createdAt: dn.created_at ?? new Date().toISOString(),
                read: dn.is_read ?? false,
              });
              stateChanged = true;
            }
          }
        }

        // Hapus notifikasi menunggu untuk campaign yang sudah disetujui dari mergedNotifs
        const cleanedMerged = mergedNotifs.filter((n) => {
          const t = (n.title || "").toLowerCase();
          const b = (n.body || "").toLowerCase();
          const isPending =
            t.includes("menunggu") ||
            t.includes("diverifikasi") ||
            b.includes("menunggu persetujuan") ||
            b.includes("sedang diverifikasi");
          if (isPending) {
            const camp = (extractCampaignNameFromBody(b) || extractCampaignNameFromBody(t)).toLowerCase();
            if (camp && approvedTitles.has(camp)) {
              stateChanged = true;
              return false;
            }
          }
          return true;
        });
        mergedNotifs = cleanedMerged;

        // 5b. Rekonsiliasi notifikasi persetujuan berdasarkan database campaigns & payments
        for (const c of dbCampaigns) {
          const isApproved =
            c.payment_status === "Pembayaran Disetujui" ||
            c.payment_status === "Disetujui" ||
            (c.status === "Aktif" && c.payment_status !== "Pembayaran Ditolak");
          const cleanTitle = (c.title || "").trim();
          if (isApproved && cleanTitle) {
            const approvedBody = `Pesanan campaign "${cleanTitle}" telah disetujui oleh admin. Campaign Anda sekarang aktif.`;
            const hasApproveNotif = mergedNotifs.some(
              (n) =>
                n.title.toLowerCase().includes("disetujui") &&
                (n.body === approvedBody || n.body.includes(`"${cleanTitle}"`))
            );
            if (!hasApproveNotif) {
              mergedNotifs.unshift({
                id: `ntf-approved-cmp-${c.id}`,
                title: "Pesanan Disetujui",
                body: approvedBody,
                type: "order",
                date: c.created_at ? c.created_at.slice(0, 10) : new Date().toISOString().slice(0, 10),
                createdAt: c.created_at || new Date().toISOString(),
                read: false,
              });
              stateChanged = true;
              void supabase.from("notifications").insert({
                user_id: normalizedEmail,
                title: "Pesanan Disetujui",
                message: approvedBody,
                type: "order",
                is_read: false,
              });
            }
          }
        }

        for (const p of dbPayments) {
          const rawStatus = (p.status || "").toLowerCase();
          const isLunas = rawStatus === "lunas" || rawStatus === "berhasil" || rawStatus === "disetujui";
          const cleanCamp = (p.campaign_name || "").trim();
          if (isLunas && cleanCamp) {
            const approvedBody = `Pesanan campaign "${cleanCamp}" telah disetujui oleh admin. Campaign Anda sekarang aktif.`;
            const hasApproveNotif = mergedNotifs.some(
              (n) =>
                n.title.toLowerCase().includes("disetujui") &&
                (n.body === approvedBody || n.body.includes(`"${cleanCamp}"`))
            );
            if (!hasApproveNotif) {
              mergedNotifs.unshift({
                id: `ntf-approved-pay-${p.id}`,
                title: "Pesanan Disetujui",
                body: approvedBody,
                type: "order",
                date: p.created_at ? p.created_at.slice(0, 10) : new Date().toISOString().slice(0, 10),
                createdAt: p.created_at || new Date().toISOString(),
                read: false,
              });
              stateChanged = true;
              void supabase.from("notifications").insert({
                user_id: normalizedEmail,
                title: "Pesanan Disetujui",
                message: approvedBody,
                type: "order",
                is_read: false,
              });
            }
          }
        }

        if (stateChanged) {
          const deduped: Notification[] = [];
          const seen = new Map<string, Notification>();
          for (const n of mergedNotifs) {
            const key = `${n.title.trim().toLowerCase()}|${n.body.trim().toLowerCase()}`;
            if (!seen.has(key)) {
              seen.set(key, n);
              deduped.push(n);
            } else {
              const existing = seen.get(key)!;
              if (!n.read && existing.read) {
                existing.read = false;
              }
            }
          }
          const sorted = sortNotifications(deduped);
          write(normalizedEmail, {
            ...currentState,
            payments: currentPayments,
            orders: currentOrders,
            notifications: sorted,
          });
        }
      } catch (err) {
        console.warn("Gagal sinkronisasi notifikasi customer:", err);
      }
    };

    void syncServerData();

    // Polling setiap 3 detik untuk update realtime dari admin
    const interval = setInterval(() => {
      void syncServerData();
    }, 3000);

    // Supabase Realtime channel
    const channelId = Math.random().toString(36).slice(2, 7);
    const channelName = `rt-cust-notif-${normalizedEmail}-${channelId}`;
    const channel = supabase
      .channel(channelName)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "notifications" },
        (payload) => {
          const rec = (payload.new || payload.old) as any;
          if (!rec || !rec.user_id || rec.user_id.toLowerCase() === normalizedEmail) {
            void syncServerData();
          }
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "payments" },
        (payload) => {
          const rec = (payload.new || payload.old) as any;
          if (!rec || !rec.customer_email || rec.customer_email.toLowerCase() === normalizedEmail) {
            void syncServerData();
          }
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "campaigns" },
        (payload) => {
          const rec = (payload.new || payload.old) as any;
          if (!rec || !rec.customer_email || rec.customer_email.toLowerCase() === normalizedEmail) {
            void syncServerData();
          }
        }
      )
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          void syncServerData();
        }
      });

    return () => {
      isMounted = false;
      clearInterval(interval);
      void supabase.removeChannel(channel);
    };
  }, [email, nm]);

  const subscribe = (cb: () => void) => {
    const h = () => cb();
    window.addEventListener(EVT, h);
    window.addEventListener("storage", h);
    return () => {
      window.removeEventListener(EVT, h);
      window.removeEventListener("storage", h);
    };
  };
  const getSnapshot = () => {
    if (!email) return null;
    try { return localStorage.getItem(keyFor(email)) ?? ""; } catch { return ""; }
  };
  useSyncExternalStore(subscribe, getSnapshot, () => null);

  const state = email ? read(email, nm, profile) : seed("guest@buzzhub.id", nm);

  const mutate = (fn: (s: CustomerState) => CustomerState) => {
    if (!email) return;
    write(email, fn(read(email, nm)));
  };

  const pushNotif = (n: Omit<Notification, "id" | "date" | "read"> & { id?: string; date?: string; createdAt?: string }) => {
    const tNow = Date.now();
    const newId = n.id || "ntf-" + tNow + Math.random().toString(36).slice(2, 6);
    const newDate = n.date || new Date().toISOString().slice(0, 10);
    const newCreatedAt = n.createdAt || new Date().toISOString();
    const notifItem: Notification = {
      id: newId,
      date: newDate,
      createdAt: newCreatedAt,
      read: false,
      ...n,
    };
    mutate((s) => {
      const filtered = (s.notifications ?? []).filter((existing) => existing.id !== notifItem.id);
      return {
        ...s,
        notifications: sortNotifications([notifItem, ...filtered]),
      };
    });

    if (email) {
      void supabase.from("notifications").insert({
        user_id: email.trim().toLowerCase(),
        title: n.title,
        message: n.body,
        type: n.type,
        is_read: false,
      });
    }
  };

  return {
    state,
    ready: !!email,
    services: SERVICES,
    pushNotif,

    createOrder: (input: {
      serviceId: string; packageTier: string; platform: Platform;
      campaignName: string; description: string; link?: string; location?: string;
      startDate: string; endDate: string;
      service?: Service;
      buzzers?: number;
      pricePerBuzzer?: number;
      serviceType?: string;
      catalogPackageId?: string;
      catalogPackageName?: string;
      catalogPackagePrice?: number;
      catalogPackageBuzzerCount?: number;
      catalogId?: string;
      thumbnailUrl?: string;
    }) => {
      const svc = input.service ?? SERVICES.find((s) => s.id === input.serviceId);
      if (!svc) throw new Error("Layanan tidak ditemukan.");
      const fallbackPackage = svc.packages.find((p) => p.tier === input.packageTier) ?? svc.packages[0];
      const selectedPackage = input.catalogPackageName && svc.catalogId
        ? { ...fallbackPackage, tier: input.catalogPackageName, price: input.catalogPackagePrice ?? fallbackPackage.price, buzzers: input.catalogPackageBuzzerCount ?? input.buzzers ?? fallbackPackage.buzzers }
        : { ...fallbackPackage, tier: input.serviceType ?? fallbackPackage.tier, price: input.pricePerBuzzer ?? fallbackPackage.price };
      const buzzers = input.buzzers ?? selectedPackage.buzzers;
      const isCatalog = !!svc.catalogId;
      const unitPrice = isCatalog && input.catalogPackagePrice !== undefined
        ? Number(input.catalogPackagePrice)
        : Number(selectedPackage.price ?? 0);
      const totalPrice = isCatalog && input.catalogPackagePrice !== undefined
        ? unitPrice
        : unitPrice * buzzers;
      const pkg = { ...selectedPackage, buzzers, price: unitPrice };
      const id = "ord-" + Date.now();
      const invoice = "INV-2026-" + Math.floor(1000 + Math.random() * 9000);
      const order: Order = {
        id, invoice,
        serviceId: svc.id, serviceName: svc.name, serviceType: input.serviceType, packageTier: pkg.tier,
        catalogPackageId: input.catalogPackageId,
        packageSnapshotName: input.catalogPackageName ?? pkg.tier,
        packageSnapshotPrice: Number(input.catalogPackagePrice ?? pkg.price ?? 0),
        packageSnapshotBuzzerCount: Number(input.catalogPackageBuzzerCount ?? pkg.buzzers ?? 0),
        platform: input.platform,
        campaignName: input.campaignName,
        description: input.description,
        link: input.link,
        location: input.location,
        startDate: input.startDate,
        endDate: input.endDate,
        buzzers: pkg.buzzers,
        buzzersJoined: 0,
        progress: 0,
        status: "Menunggu",
        total: totalPrice,
        createdAt: new Date().toISOString().slice(0, 10),
        catalogId: input.catalogId ?? svc.catalogId,
        thumbnailUrl: input.thumbnailUrl ?? svc.thumbnailUrl ?? undefined,
        report: makeReport(pkg.buzzers, 0, 7),
        proofs: [],
      };
      const payment: Payment = {
        id: "pay-" + Date.now(),
        invoice: "INV-2026-" + Math.floor(2000 + Math.random() * 9000),
        orderId: id,
        campaignName: input.campaignName,
        method: "Transfer Bank",
        channel: "BCA",
        amount: totalPrice,
        status: "Belum Dibayar",
        date: new Date().toISOString().slice(0, 10),
        pendingOrder: order,
      };
      pendingPayments.set(payment.id, payment);
      return { order, payment };
    },

    cancelOrder: (id: string) => {
      mutate((s) => ({
        ...s,
        orders: s.orders.map((o) => o.id === id ? { ...o, status: "Dibatalkan" as OrderStatus, progress: 0 } : o),
      }));
      pushNotif({ type: "order", title: `Pesanan dibatalkan`, body: `Pesanan telah dibatalkan sesuai permintaan.` });
    },

    duplicateOrder: (id: string) => {
      mutate((s) => {
        const src = s.orders.find((o) => o.id === id);
        if (!src) return s;
        const clone: Order = {
          ...src,
          id: "ord-" + Date.now(),
          invoice: "INV-2026-" + Math.floor(1000 + Math.random() * 9000),
          status: "Menunggu",
          progress: 0,
          buzzersJoined: 0,
          proofs: [],
          createdAt: new Date().toISOString().slice(0, 10),
          campaignName: src.campaignName + " (Salinan)",
        };
        return { ...s, orders: [clone, ...s.orders] };
      });
      pushNotif({ type: "order", title: `Pesanan diduplikasi`, body: `Salinan pesanan berhasil dibuat.` });
    },

    /** Tambah bukti upload (screenshot) buzzer ke sebuah pesanan. */
    addOrderProof: (orderId: string, proof: Omit<OrderProof, "id" | "uploadedAt" | "verified"> & { verified?: boolean }) => {
      mutate((s) => ({
        ...s,
        orders: s.orders.map((o) =>
          o.id === orderId
            ? {
                ...o,
                proofs: [
                  {
                    id: "prf-" + Date.now(),
                    uploadedAt: new Date().toISOString().slice(0, 10),
                    verified: proof.verified ?? false,
                    ...proof,
                  },
                  ...(o.proofs ?? []),
                ],
              }
            : o,
        ),
      }));
      pushNotif({ type: "campaign", title: "Bukti pengerjaan masuk", body: "Buzzer mengunggah screenshot bukti pesanan selesai." });
    },

    editOrder: (id: string, patch: Partial<Pick<Order, "campaignName" | "description" | "link" | "location" | "startDate" | "endDate">>) => {
      mutate((s) => ({
        ...s,
        orders: s.orders.map((o) => o.id === id ? { ...o, ...patch } : o),
      }));
    },

    payInvoice: async (paymentId: string, method: string, channel: string, bankAccountNumber = "") => {
      const currentState = read(email || "", nm);
      if (currentState.payments.some((payment) => payment.id === paymentId)) return;
      const pending = pendingPayments.get(paymentId);
      if (!pending?.pendingOrder) return;
      const order = pending.pendingOrder;
      const payment = { ...pending, pendingOrder: undefined, method, channel, status: "Menunggu Verifikasi" as PaymentStatus, date: new Date().toISOString().slice(0, 10) };

      const tNow = Date.now();
      let campaignId: string;
      pushNotif({
        id: "ntf-ord-" + tNow,
        type: "order",
        title: `Pesanan ${order.invoice} dibuat`,
        body: `Campaign "${order.campaignName}" berhasil dibuat.`,
        date: new Date(tNow - 2000).toISOString().slice(0, 10),
        createdAt: new Date(tNow - 2000).toISOString(),
      });
      const rawLink = order.link ? order.link.trim() : "";
      const normalizedLink = rawLink
        ? (rawLink.startsWith("http://") || rawLink.startsWith("https://") ? rawLink : `https://${rawLink}`)
        : "";
      const taskActionName = order.serviceType || order.packageTier || order.serviceName || "Pengerjaan";

      const briefLines: string[] = [];
      briefLines.push(`📌 Jenis Tugas: ${taskActionName}`);
      if (normalizedLink) {
        briefLines.push(`🔗 Link Target: ${normalizedLink}`);
      } else if (order.location) {
        briefLines.push(`📍 Lokasi: ${order.location}`);
      }
      if (order.description && order.description.trim()) {
        briefLines.push(`📝 Instruksi Customer:\n${order.description.trim()}`);
      }
      const fullStructuredBrief = briefLines.join("\n\n");

      try {
        const result = await createCustomerPaymentCampaign({
          invoice_no: payment.invoice,
          customer_name: nm,
          customer_email: (email ?? "guest@buzzhub.id").toLowerCase(),
          campaign_name: order.campaignName,
          campaign_type: order.platform,
          service_type: order.serviceType,
          method: `${method} (${channel})`,
          note: method === "Bank"
            ? (bankAccountNumber.includes(":") ? bankAccountNumber : `Nomor bank / referensi transfer: ${bankAccountNumber}`)
            : null,
          amount: order.total,
          // The final buzzer amount is selected from the verified level when
          // the job is claimed, not at customer checkout.
          buzzer_cost: 0,
          fee: order.total,
          brief: fullStructuredBrief,
          budget: order.total,
          payout_per_buzzer: 0,
          slots: order.buzzers,
          start_date: order.startDate,
          deadline: order.endDate,
          catalog_id: order.catalogId || (order.serviceId.startsWith("catalog-") ? order.serviceId.slice("catalog-".length) : undefined),
          package_id: order.catalogPackageId,
          package_name: order.packageSnapshotName ?? order.packageTier,
          package_price: order.packageSnapshotPrice ?? order.total,
          package_buzzer_count: order.packageSnapshotBuzzerCount ?? order.buzzers,
          thumbnail_url: order.thumbnailUrl,
        });
        campaignId = result.campaignId;
        payment.id = result.paymentId;
      } catch (error) {
        console.error("[payment] gagal menyimpan payment dan campaign ke Supabase", error);
        const detail = error instanceof Error ? error.message : String(error);
        throw new Error(`Pesanan gagal disimpan ke dashboard admin: ${detail}`);
      }
      pendingPayments.delete(paymentId);

      mutate((s) => ({
        ...s,
        orders: [{ ...order, campaignId }, ...s.orders],
        payments: [payment, ...s.payments],
      }));
      if (email) {
        const { error: customerError } = await supabase.from("customer_accounts").upsert({
          email: email.trim().toLowerCase(),
          name: nm,
          active: true,
        }, { onConflict: "email" });
        if (customerError) console.error("[customer] gagal memperbarui ringkasan akun", customerError);
      }
      pushNotif({
        id: "ntf-wait-" + (tNow + 500),
        type: "order",
        title: "Menunggu Persetujuan Admin",
        body: `Pesanan campaign "${order.campaignName}" sedang menunggu persetujuan dari admin.`,
        date: new Date(tNow).toISOString().slice(0, 10),
        createdAt: new Date(tNow).toISOString(),
      });
    },

    markNotificationRead: (id: string) => {
      mutate((s) => ({ ...s, notifications: s.notifications.map((n) => n.id === id ? { ...n, read: true } : n) }));
      if (email) {
        void supabase.from("notifications").update({ is_read: true, updated_at: new Date().toISOString() }).eq("id", id);
      }
    },
    markAllRead: () => {
      mutate((s) => ({ ...s, notifications: s.notifications.map((n) => ({ ...n, read: true })) }));
      if (email) {
        void supabase.from("notifications").update({ is_read: true, updated_at: new Date().toISOString() }).eq("user_id", email.trim().toLowerCase());
      }
    },

    markPaymentApproved: (campaignName: string, invoice?: string) => {
      const cleanCampaign = campaignName.trim();
      const bodyText = `Pesanan campaign "${cleanCampaign}" telah disetujui oleh admin. Campaign Anda sekarang aktif.`;
      const tNow = Date.now();
      mutate((s) => {
        // Hapus notifikasi menunggu/diverifikasi untuk campaign ini
        const remainingNotifs = (s.notifications ?? []).filter((n) => {
          const t = (n.title || "").toLowerCase();
          const b = (n.body || "").toLowerCase();
          const isPending =
            t.includes("menunggu") ||
            t.includes("diverifikasi") ||
            b.includes("menunggu persetujuan") ||
            b.includes("sedang diverifikasi");
          const matches = b.includes(`"${cleanCampaign.toLowerCase()}"`) || b.includes(cleanCampaign.toLowerCase());
          return !(isPending && matches);
        });

        const nextNotifs = sortNotifications([
          {
            id: "ntf-approved-" + tNow,
            title: "Pesanan Disetujui",
            body: bodyText,
            type: "order",
            date: new Date(tNow).toISOString().slice(0, 10),
            createdAt: new Date(tNow).toISOString(),
            read: false,
          },
          ...remainingNotifs.filter((n) => !(n.title.toLowerCase().includes("disetujui") && n.body === bodyText)),
        ]);

        return {
          ...s,
          notifications: nextNotifs,
          payments: s.payments.map((p) =>
            (p.campaignName.trim().toLowerCase() === campaignName.trim().toLowerCase() ||
              (invoice && p.invoice === invoice)) &&
            p.status !== "Lunas"
              ? { ...p, status: "Lunas" as PaymentStatus }
              : p
          ),
          orders: s.orders.map((o) =>
            (o.campaignName.trim().toLowerCase() === campaignName.trim().toLowerCase() ||
              (invoice && o.invoice === invoice)) &&
            o.status === "Menunggu"
              ? { ...o, status: "Berjalan" as OrderStatus }
              : o
          ),
        };
      });
      if (email) {
        // Hapus notif pending di Supabase
        void supabase
          .from("notifications")
          .delete()
          .eq("user_id", email.trim().toLowerCase())
          .or("title.ilike.%menunggu%,title.ilike.%diverifikasi%")
          .ilike("message", `%${cleanCampaign}%`);

        void supabase.from("notifications").insert({
          user_id: email.trim().toLowerCase(),
          title: "Pesanan Disetujui",
          message: bodyText,
          type: "order",
          is_read: false,
        });
      }
    },

    markPaymentRejected: (campaignName: string, invoice?: string) =>
      mutate((s) => ({
        ...s,
        notifications: (s.notifications ?? []).filter((n) => {
          const t = (n.title || "").toLowerCase();
          const b = (n.body || "").toLowerCase();
          const isPending = t.includes("menunggu") || t.includes("diverifikasi") || b.includes("menunggu persetujuan");
          const matches = b.includes(`"${campaignName.trim().toLowerCase()}"`) || b.includes(campaignName.trim().toLowerCase());
          return !(isPending && matches);
        }),
        payments: s.payments.map((p) =>
          (p.campaignName.trim().toLowerCase() === campaignName.trim().toLowerCase() ||
            (invoice && p.invoice === invoice)) &&
          p.status !== "Gagal"
            ? { ...p, status: "Gagal" as PaymentStatus }
            : p
        ),
        orders: s.orders.map((o) =>
          (o.campaignName.trim().toLowerCase() === campaignName.trim().toLowerCase() ||
            (invoice && o.invoice === invoice)) &&
          o.status === "Menunggu"
            ? { ...o, status: "Dibatalkan" as OrderStatus }
            : o
        ),
      })),
  };
}

export async function notifyCustomerPaymentApproved(
  customerEmail?: string | null,
  campaignName?: string | null,
  invoice?: string | null
) {
  let email = customerEmail?.trim().toLowerCase();
  let cleanCampaign = campaignName?.trim();

  if (!email && invoice) {
    try {
      const { data: p } = await supabase.from("payments").select("customer_email, campaign_name").eq("invoice_no", invoice).maybeSingle();
      if (p?.customer_email) email = p.customer_email.trim().toLowerCase();
      if (!cleanCampaign && p?.campaign_name) cleanCampaign = p.campaign_name.trim();
    } catch { /* noop */ }
  }

  if (!email && cleanCampaign) {
    try {
      const { data: c } = await supabase.from("campaigns").select("customer_email").eq("title", cleanCampaign).maybeSingle();
      if (c?.customer_email) email = c.customer_email.trim().toLowerCase();
    } catch { /* noop */ }
  }

  if (!cleanCampaign && invoice) {
    try {
      const { data: p } = await supabase.from("payments").select("campaign_name").eq("invoice_no", invoice).maybeSingle();
      if (p?.campaign_name) cleanCampaign = p.campaign_name.trim();
    } catch { /* noop */ }
  }

  if (!email || !cleanCampaign) return;
  const bodyText = `Pesanan campaign "${cleanCampaign}" telah disetujui oleh admin. Campaign Anda sekarang aktif.`;

  // 1. Bersihkan notifikasi pending dari tabel notifications Supabase & simpan notifikasi baru
  try {
    await supabase
      .from("notifications")
      .delete()
      .eq("user_id", email)
      .or("title.ilike.%menunggu%,title.ilike.%diverifikasi%")
      .ilike("message", `%${cleanCampaign}%`);

    await supabase.from("notifications").insert({
      user_id: email,
      title: "Pesanan Disetujui",
      message: bodyText,
      type: "order",
      is_read: false,
    });
  } catch (error) {
    console.error("Gagal sinkronisasi notifikasi pesanan disetujui ke database:", error);
  }

  // 2. Simpan juga ke localStorage secara instan
  if (typeof window !== "undefined") {
    const key = `buzzhub.customer.${email}`;
    try {
      const raw = localStorage.getItem(key);
      const state = raw ? (JSON.parse(raw) as CustomerState) : seed(email, "Customer");

      const updatedPayments = [...(state.payments ?? [])];
      const matchPayIdx = updatedPayments.findIndex(
        (p) =>
          p.campaignName.trim().toLowerCase() === cleanCampaign.toLowerCase() ||
          (invoice && p.invoice === invoice)
      );
      if (matchPayIdx >= 0) {
        updatedPayments[matchPayIdx] = { ...updatedPayments[matchPayIdx], status: "Lunas" as PaymentStatus };
      } else {
        updatedPayments.unshift({
          id: `pay-${Date.now()}`,
          invoice: invoice || `INV-${Date.now().toString().slice(-6)}`,
          orderId: `ord-${Date.now()}`,
          campaignName: cleanCampaign,
          amount: 0,
          date: new Date().toISOString().slice(0, 10),
          method: "Transfer Bank",
          channel: "Manual Verification",
          status: "Lunas" as PaymentStatus,
        });
      }

      const updatedOrders = (state.orders ?? []).map((o) => {
        if (
          o.campaignName.trim().toLowerCase() === cleanCampaign.toLowerCase() ||
          (invoice && o.invoice === invoice)
        ) {
          return { ...o, status: (o.status === "Menunggu" ? "Berjalan" : o.status) as OrderStatus };
        }
        return o;
      });

      // Filter out notifikasi menunggu/diverifikasi untuk campaign ini
      const remainingNotifs = (state.notifications ?? []).filter((n) => {
        const t = (n.title || "").toLowerCase();
        const b = (n.body || "").toLowerCase();
        const isPending =
          t.includes("menunggu") ||
          t.includes("diverifikasi") ||
          b.includes("menunggu persetujuan") ||
          b.includes("sedang diverifikasi");
        const matches = b.includes(`"${cleanCampaign.toLowerCase()}"`) || b.includes(cleanCampaign.toLowerCase());
        return !(isPending && matches);
      });

      // Tambahkan notifikasi persetujuan di urutan teratas
      let notifications = [
        {
          id: "ntf-ord-approved-" + Date.now(),
          title: "Pesanan Disetujui",
          body: bodyText,
          type: "order" as const,
          date: new Date().toISOString().slice(0, 10),
          createdAt: new Date().toISOString(),
          read: false,
        },
        ...remainingNotifs.filter((n) => !(n.title.toLowerCase().includes("disetujui") && n.body === bodyText)),
      ];

      const dedupedNotifs: Notification[] = [];
      const seenNotifs = new Map<string, Notification>();
      for (const n of notifications) {
        const k = `${n.title.trim().toLowerCase()}|${n.body.trim().toLowerCase()}`;
        if (!seenNotifs.has(k)) {
          seenNotifs.set(k, n);
          dedupedNotifs.push(n);
        }
      }
      notifications = sortNotifications(dedupedNotifs);

      const nextState: CustomerState = {
        ...state,
        payments: updatedPayments,
        orders: updatedOrders,
        notifications,
      };
      localStorage.setItem(key, JSON.stringify(nextState));
      window.dispatchEvent(new Event("buzzhub:customer-store"));
      window.dispatchEvent(new Event("storage"));
    } catch (error) {
      console.error("Gagal memperbarui notifikasi pesanan disetujui customer di localStorage:", error);
    }
  }
}

export async function notifyCustomerPaymentRejected(
  customerEmail?: string | null,
  campaignName?: string | null,
  reason?: string | null,
  invoice?: string | null
) {
  let email = customerEmail?.trim().toLowerCase();
  let cleanCampaign = campaignName?.trim();

  if (!email && invoice) {
    try {
      const { data: p } = await supabase.from("payments").select("customer_email, campaign_name").eq("invoice_no", invoice).maybeSingle();
      if (p?.customer_email) email = p.customer_email.trim().toLowerCase();
      if (!cleanCampaign && p?.campaign_name) cleanCampaign = p.campaign_name.trim();
    } catch { /* noop */ }
  }

  if (!email && cleanCampaign) {
    try {
      const { data: c } = await supabase.from("campaigns").select("customer_email").eq("title", cleanCampaign).maybeSingle();
      if (c?.customer_email) email = c.customer_email.trim().toLowerCase();
    } catch { /* noop */ }
  }

  if (!cleanCampaign && invoice) {
    try {
      const { data: p } = await supabase.from("payments").select("campaign_name").eq("invoice_no", invoice).maybeSingle();
      if (p?.campaign_name) cleanCampaign = p.campaign_name.trim();
    } catch { /* noop */ }
  }

  if (!email || !cleanCampaign) return;
  const bodyText = `Pesanan campaign "${cleanCampaign}" ditolak oleh admin.${
    reason ? ` Alasan: ${reason}` : ""
  }`;

  // 1. Simpan ke database Supabase notifications
  try {
    await supabase
      .from("notifications")
      .delete()
      .eq("user_id", email)
      .or("title.ilike.%menunggu%,title.ilike.%diverifikasi%")
      .ilike("message", `%${cleanCampaign}%`);

    await supabase.from("notifications").insert({
      user_id: email,
      title: "Pesanan Ditolak",
      message: bodyText,
      type: "order",
      is_read: false,
    });
  } catch (error) {
    console.error("Gagal menyimpan notifikasi penolakan pesanan ke database:", error);
  }

  // 2. Simpan juga ke localStorage
  if (typeof window !== "undefined") {
    const key = `buzzhub.customer.${email}`;
    try {
      const raw = localStorage.getItem(key);
      const state = raw ? (JSON.parse(raw) as CustomerState) : seed(email, "Customer");

      const updatedPayments = [...(state.payments ?? [])];
      const matchPayIdx = updatedPayments.findIndex(
        (p) =>
          p.campaignName.trim().toLowerCase() === cleanCampaign.toLowerCase() ||
          (invoice && p.invoice === invoice)
      );
      if (matchPayIdx >= 0) {
        updatedPayments[matchPayIdx] = { ...updatedPayments[matchPayIdx], status: "Gagal" as PaymentStatus };
      } else {
        updatedPayments.unshift({
          id: `pay-${Date.now()}`,
          invoice: invoice || `INV-${Date.now().toString().slice(-6)}`,
          orderId: `ord-${Date.now()}`,
          campaignName: cleanCampaign,
          amount: 0,
          date: new Date().toISOString().slice(0, 10),
          method: "Transfer Bank",
          channel: "Manual Verification",
          status: "Gagal" as PaymentStatus,
        });
      }

      const updatedOrders = (state.orders ?? []).map((o) => {
        if (
          o.campaignName.trim().toLowerCase() === cleanCampaign.toLowerCase() ||
          (invoice && o.invoice === invoice)
        ) {
          return { ...o, status: (o.status === "Menunggu" ? "Dibatalkan" : o.status) as OrderStatus };
        }
        return o;
      });

      // Filter out notifikasi menunggu
      const remainingNotifs = (state.notifications ?? []).filter((n) => {
        const t = (n.title || "").toLowerCase();
        const b = (n.body || "").toLowerCase();
        const isPending =
          t.includes("menunggu") ||
          t.includes("diverifikasi") ||
          b.includes("menunggu persetujuan") ||
          b.includes("sedang diverifikasi");
        const matches = b.includes(`"${cleanCampaign.toLowerCase()}"`) || b.includes(cleanCampaign.toLowerCase());
        return !(isPending && matches);
      });

      let notifications = [
        {
          id: "ntf-ord-rejected-" + Date.now(),
          title: "Pesanan Ditolak",
          body: bodyText,
          type: "order" as const,
          date: new Date().toISOString().slice(0, 10),
          createdAt: new Date().toISOString(),
          read: false,
        },
        ...remainingNotifs.filter((n) => !(n.title.toLowerCase().includes("ditolak") && n.body === bodyText)),
      ];

      const dedupedNotifs: Notification[] = [];
      const seenNotifs = new Map<string, Notification>();
      for (const n of notifications) {
        const k = `${n.title.trim().toLowerCase()}|${n.body.trim().toLowerCase()}`;
        if (!seenNotifs.has(k)) {
          seenNotifs.set(k, n);
          dedupedNotifs.push(n);
        }
      }
      notifications = sortNotifications(dedupedNotifs);

      const nextState: CustomerState = {
        ...state,
        payments: updatedPayments,
        orders: updatedOrders,
        notifications,
      };
      localStorage.setItem(key, JSON.stringify(nextState));
      window.dispatchEvent(new Event("buzzhub:customer-store"));
      window.dispatchEvent(new Event("storage"));
    } catch (error) {
      console.error("Gagal memperbarui notifikasi penolakan pesanan customer di localStorage:", error);
    }
  }
}

export const formatIDR = (n: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);
