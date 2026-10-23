export type Role = "admin" | "buzzer" | "customer";

export const platforms = ["Instagram", "TikTok", "X (Twitter)", "YouTube", "Facebook"] as const;

export const services = [
  { id: "s1", name: "Paket Trending Topic X", platform: "X (Twitter)", price: 1500000, buzzers: 50, desc: "Naikkan hashtag ke trending topic Indonesia dalam 6 jam." },
  { id: "s2", name: "Boost Engagement Instagram", platform: "Instagram", price: 850000, buzzers: 30, desc: "Like, comment & share organik dari akun real." },
  { id: "s3", name: "Viral TikTok Challenge", platform: "TikTok", price: 2200000, buzzers: 80, desc: "Buzzer membuat video respon untuk challenge brand Anda." },
  { id: "s4", name: "YouTube Comment Push", platform: "YouTube", price: 600000, buzzers: 25, desc: "Komentar positif terstruktur pada video launch." },
  { id: "s5", name: "Facebook Group Seeding", platform: "Facebook", price: 750000, buzzers: 40, desc: "Distribusi konten ke grup target audiens." },
  { id: "s6", name: "Counter Narrative Campaign", platform: "X (Twitter)", price: 3500000, buzzers: 120, desc: "Manajemen krisis dan narasi tandingan." },
];

export const buzzers = [
  { id: "b1", name: "Rizky Pratama", username: "@rizkybuzz", platform: "Instagram", followers: 24500, rating: 4.9, jobs: 142, status: "Aktif", earnings: 8750000 },
  { id: "b2", name: "Anisa Wulandari", username: "@anisaw", platform: "TikTok", followers: 89200, rating: 4.8, jobs: 98, status: "Aktif", earnings: 12400000 },
  { id: "b3", name: "Budi Santoso", username: "@budis_id", platform: "X (Twitter)", followers: 15600, rating: 4.7, jobs: 211, status: "Aktif", earnings: 9650000 },
  { id: "b4", name: "Dewi Larasati", username: "@dewilara", platform: "Instagram", followers: 41200, rating: 4.9, jobs: 76, status: "Verifikasi", earnings: 4300000 },
  { id: "b5", name: "Fajar Nugroho", username: "@fajarng", platform: "YouTube", followers: 12800, rating: 4.6, jobs: 54, status: "Aktif", earnings: 6100000 },
  { id: "b6", name: "Sinta Maharani", username: "@sintam", platform: "TikTok", followers: 156000, rating: 5.0, jobs: 187, status: "Aktif", earnings: 21500000 },
  { id: "b7", name: "Yoga Pradana", username: "@yogapd", platform: "Facebook", followers: 9800, rating: 4.5, jobs: 33, status: "Nonaktif", earnings: 1850000 },
];

export const customers = [
  { id: "c1", name: "PT Kreatif Digital", contact: "marketing@kreatif.id", campaigns: 12, spent: 32500000, since: "2024-02-14" },
  { id: "c2", name: "Brand Kopi Senja", contact: "owner@kopisenja.co", campaigns: 5, spent: 8700000, since: "2024-08-03" },
  { id: "c3", name: "Startup FinPay", contact: "growth@finpay.app", campaigns: 8, spent: 18250000, since: "2024-05-21" },
  { id: "c4", name: "Caleg Bagus Wijaya", contact: "tim@baguswijaya.id", campaigns: 3, spent: 14500000, since: "2025-09-10" },
  { id: "c5", name: "Toko Online Bunda", contact: "cs@tokobunda.com", campaigns: 21, spent: 27600000, since: "2023-11-30" },
];

export const campaigns = [
  { id: "k1", title: "Launch Produk Skincare Glowin", customer: "PT Kreatif Digital", service: "Boost Engagement Instagram", buzzersJoined: 28, target: 30, status: "Berjalan", progress: 72, deadline: "2026-07-05", budget: 850000 },
  { id: "k2", title: "Hashtag #KopiSenjaPulang", customer: "Brand Kopi Senja", service: "Paket Trending Topic X", buzzersJoined: 50, target: 50, status: "Selesai", progress: 100, deadline: "2026-06-20", budget: 1500000 },
  { id: "k3", title: "FinPay Cashback Challenge", customer: "Startup FinPay", service: "Viral TikTok Challenge", buzzersJoined: 64, target: 80, status: "Berjalan", progress: 80, deadline: "2026-07-12", budget: 2200000 },
  { id: "k4", title: "Kampanye Visi Misi", customer: "Caleg Bagus Wijaya", service: "Counter Narrative Campaign", buzzersJoined: 95, target: 120, status: "Review", progress: 65, deadline: "2026-07-18", budget: 3500000 },
  { id: "k5", title: "Promo Lebaran Bunda", customer: "Toko Online Bunda", service: "Facebook Group Seeding", buzzersJoined: 40, target: 40, status: "Selesai", progress: 100, deadline: "2026-04-12", budget: 750000 },
  { id: "k6", title: "Launch Video Brand", customer: "PT Kreatif Digital", service: "YouTube Comment Push", buzzersJoined: 18, target: 25, status: "Berjalan", progress: 55, deadline: "2026-07-09", budget: 600000 },
];

export const jobsForBuzzer = [
  { id: "j1", title: "FinPay Cashback Challenge", platform: "TikTok", payout: 75000, deadline: "2026-07-12", brief: "Buat video 15 detik review fitur cashback FinPay dengan hashtag #FinPayCuan.", status: "Aktif" },
  { id: "j2", title: "Hashtag #KopiSenjaPulang", platform: "X (Twitter)", payout: 25000, deadline: "2026-07-02", brief: "Tweet pengalaman ngopi sore dengan hashtag, minimum 3 tweet.", status: "Aktif" },
  { id: "j3", title: "Launch Produk Skincare Glowin", platform: "Instagram", payout: 45000, deadline: "2026-07-05", brief: "Posting story + feed unboxing produk Glowin tag @glowin.id.", status: "Review" },
  { id: "j4", title: "Promo Lebaran Bunda", platform: "Facebook", payout: 30000, deadline: "2026-04-12", brief: "Share post promo ke 5 grup ibu rumah tangga.", status: "Selesai" },
];

export const ordersForCustomer = [
  { id: "o1", service: "Boost Engagement Instagram", date: "2026-06-22", buzzers: 28, status: "Berjalan", total: 850000 },
  { id: "o2", service: "YouTube Comment Push", date: "2026-06-25", buzzers: 18, status: "Berjalan", total: 600000 },
  { id: "o3", service: "Paket Trending Topic X", date: "2026-05-30", buzzers: 50, status: "Selesai", total: 1500000 },
  { id: "o4", service: "Viral TikTok Challenge", date: "2026-04-10", buzzers: 80, status: "Selesai", total: 2200000 },
];

export const testimonials = [
  { name: "Rina, Marketing Lead", company: "Kopi Senja", quote: "Hashtag kami trending #1 Indonesia dalam 4 jam. Worth every rupiah." },
  { name: "Ardi, Founder", company: "FinPay", quote: "Buzzer-nya real people, engagement-nya juga organik. Recommended." },
  { name: "Mega, Growth", company: "Toko Bunda", quote: "Penjualan naik 3x lipat selama campaign berjalan. Tim responsif." },
];

export const stats = {
  totalCampaigns: 1284,
  activeBuzzers: 8420,
  satisfiedClients: 312,
  trendingHits: 96,
};

export const formatIDR = (n: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);
