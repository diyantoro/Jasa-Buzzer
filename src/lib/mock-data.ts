export type Role = "admin" | "buzzer" | "customer";

export const platforms = ["Instagram", "TikTok", "X (Twitter)", "YouTube", "Facebook"] as const;

export type ServiceType = "Online" | "Offline";

export interface Service {
  id: string;
  name: string;
  platform: string;
  price: number;
  buzzers: number;
  desc: string;
  type?: ServiceType;
}

export const services: Service[] = [
  { id: "s1", name: "Paket Trending Topic X", platform: "X (Twitter)", price: 1500000, buzzers: 50, desc: "Naikkan hashtag ke trending topic Indonesia dalam 6 jam.", type: "Online" },
  { id: "s2", name: "Boost Engagement Instagram", platform: "Instagram", price: 850000, buzzers: 30, desc: "Like, comment & share organik dari akun real.", type: "Online" },
  { id: "s3", name: "Viral TikTok Challenge", platform: "TikTok", price: 2200000, buzzers: 80, desc: "Buzzer membuat video respon untuk challenge brand Anda.", type: "Online" },
  { id: "s4", name: "YouTube Comment Push", platform: "YouTube", price: 600000, buzzers: 25, desc: "Komentar positif terstruktur pada video launch.", type: "Online" },
  { id: "s5", name: "Facebook Group Seeding", platform: "Facebook", price: 750000, buzzers: 40, desc: "Distribusi konten ke grup target audiens.", type: "Online" },
  { id: "s6", name: "Counter Narrative Campaign", platform: "X (Twitter)", price: 3500000, buzzers: 120, desc: "Manajemen krisis dan narasi tandingan.", type: "Online" },
  { id: "s7", name: "Event Crowd Booster", platform: "Offline", price: 5000000, buzzers: 200, desc: "Buzzer hadiri event Anda dengan jumlah besar untuk kesan ramai.", type: "Offline" },
  { id: "s8", name: "Booth Activation", platform: "Offline", price: 3500000, buzzers: 100, desc: "Buzzer menarik perhatian pengunjung di booth event.", type: "Offline" },
  { id: "s9", name: "Live Event Support", platform: "Offline", price: 4000000, buzzers: 150, desc: "Buzzer live di lokasi event untuk promosi langsung.", type: "Offline" },
  { id: "s10", name: "Meeting & Workshop", platform: "Offline", price: 2500000, buzzers: 80, desc: "Buzzer sebagai narasumber atau moderator di meeting/workshop.", type: "Offline" },
  { id: "s11", name: "Grand Opening Support", platform: "Offline", price: 4500000, buzzers: 180, desc: "Buzzer meramaikan grand opening toko/kantor Anda.", type: "Offline" },
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
