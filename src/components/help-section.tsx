import { useMemo, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  Briefcase,
  Clock,
  CreditCard,
  LifeBuoy,
  Mail,
  MessageCircle,
  Package,
  Search,
  ShoppingBag,
  Upload,
  Wallet,
} from "lucide-react";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type HelpRole = "customer" | "buzzer";

type HelpSectionProps = {
  role: HelpRole;
  onNavigate?: (section: string) => void;
};

type QuickLink = {
  title: string;
  description: string;
  target: string;
  icon: typeof Package;
};

type Faq = {
  question: string;
  answer: string;
};

const SUPPORT_WHATSAPP = "6281234567890";
const SUPPORT_EMAIL = "support@buzzhub.id";

const CUSTOMER_QUICK_LINKS: QuickLink[] = [
  {
    title: "Jelajahi Katalog",
    description: "Pilih layanan buzzer yang cocok untuk campaign Anda.",
    target: "katalog",
    icon: Package,
  },
  {
    title: "Pantau Pesanan",
    description: "Cek progres campaign dan bukti pengerjaan dari buzzer.",
    target: "pesanan",
    icon: ShoppingBag,
  },
  {
    title: "Pembayaran & Invoice",
    description: "Lihat tagihan, status pembayaran, dan riwayat transaksi.",
    target: "pembayaran",
    icon: CreditCard,
  },
];

const BUZZER_QUICK_LINKS: QuickLink[] = [
  {
    title: "Cari Job Baru",
    description: "Temukan job sesuai platform dan level akun sosialmu.",
    target: "jobs",
    icon: Briefcase,
  },
  {
    title: "Upload Bukti",
    description: "Kirim bukti pengerjaan dan pantau verifikasi admin.",
    target: "jobs",
    icon: Upload,
  },
  {
    title: "Penghasilan & Pencairan",
    description: "Cek saldo, status payout, dan ajukan pencairan dana.",
    target: "penghasilan",
    icon: Wallet,
  },
];

const CUSTOMER_FAQS: Faq[] = [
  {
    question: "Bagaimana cara memesan campaign?",
    answer:
      "Buka menu Katalog, pilih layanan yang diinginkan, lalu klik Pesan. Lengkapi nama campaign, brief, link target, dan tanggal pengerjaan. Setelah itu lanjutkan ke pembayaran.",
  },
  {
    question: "Metode pembayaran apa saja yang tersedia?",
    answer:
      "Pembayaran dapat dilakukan melalui transfer bank, QRIS, atau virtual account. Invoice dan status pembayaran bisa dilihat di menu Pembayaran.",
  },
  {
    question: "Kapan campaign mulai dikerjakan?",
    answer:
      "Campaign masuk ke antrean buzzer setelah pembayaran diverifikasi admin. Progres dan bukti pengerjaan dapat dipantau di Homepage dan menu Pesanan.",
  },
  {
    question: "Bagaimana jika hasil campaign belum sesuai?",
    answer:
      "Buka detail pesanan dan gunakan fitur ajukan revisi atau komplain. Sertakan nomor invoice dan penjelasan singkat agar admin bisa menindaklanjuti.",
  },
  {
    question: "Apakah bisa menggunakan brief custom?",
    answer:
      "Bisa. Tulis brief selengkap mungkin saat checkout, termasuk do's and don'ts, hashtag, mention, dan referensi konten. Untuk kebutuhan khusus, hubungi support sebelum membayar.",
  },
  {
    question: "Bagaimana cara memberi rating buzzer?",
    answer:
      "Setelah campaign selesai, buka menu Ulasan. Beri rating dan komentar untuk buzzer yang mengerjakan campaign Anda.",
  },
];

const BUZZER_FAQS: Faq[] = [
  {
    question: "Bagaimana cara mengambil job?",
    answer:
      "Buka menu Job Tersedia, pilih job yang sesuai dengan platform akun sosialmu, lalu klik Ambil Job. Pastikan akun sosial untuk platform tersebut sudah terverifikasi admin.",
  },
  {
    question: "Bagaimana cara upload bukti pengerjaan?",
    answer:
      "Buka Job Saya, pilih job berstatus Diambil, klik Upload Bukti, unggah screenshot atau PDF, isi link postingan, lalu klik Kirim. Status job akan berubah menjadi Verifikasi Admin.",
  },
  {
    question: "Kenapa bukti pengerjaan saya ditolak?",
    answer:
      "Alasan penolakan tertera di detail job. Perbaiki bukti sesuai catatan admin, lalu klik Perbaiki Tugas dan unggah bukti baru. Pastikan link postingan dapat dibuka tanpa login.",
  },
  {
    question: "Kapan saldo penghasilan masuk?",
    answer:
      "Saldo masuk setelah admin memverifikasi bukti dan job berstatus Selesai. Status Pending dan Diproses dapat dilihat di menu Penghasilan.",
  },
  {
    question: "Bagaimana cara mencairkan saldo?",
    answer:
      "Buka menu Penghasilan, pilih Pencairan, masukkan nominal serta rekening atau e-wallet tujuan, lalu ajukan. Admin akan memproses pengajuan tersebut.",
  },
  {
    question: "Kenapa akun sosial saya belum terverifikasi?",
    answer:
      "Lengkapi data akun di menu Akun Sosial Media. Admin akan melakukan verifikasi. Job hanya bisa diambil jika akun untuk platform terkait sudah terverifikasi.",
  },
];

export function HelpSection({ role, onNavigate }: HelpSectionProps) {
  const [query, setQuery] = useState("");
  const isCustomer = role === "customer";
  const quickLinks = isCustomer ? CUSTOMER_QUICK_LINKS : BUZZER_QUICK_LINKS;
  const faqs = isCustomer ? CUSTOMER_FAQS : BUZZER_FAQS;

  const filteredFaqs = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return faqs;
    return faqs.filter((faq) => `${faq.question} ${faq.answer}`.toLowerCase().includes(q));
  }, [faqs, query]);

  const whatsappMessage = encodeURIComponent(
    `Halo tim BuzzHub, saya ${isCustomer ? "customer" : "buzzer"} dan butuh bantuan terkait akun saya.`,
  );
  const emailSubject = encodeURIComponent(`Bantuan ${isCustomer ? "Customer" : "Buzzer"} BuzzHub`);
  const emailBody = encodeURIComponent(
    `Halo tim BuzzHub,\n\nSaya butuh bantuan terkait akun ${isCustomer ? "customer" : "buzzer"} saya.\n\nEmail akun: \nNomor invoice/job: \nKendala: \n\nTerima kasih.`,
  );

  return (
    <div className="space-y-4">
      <section className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 via-background to-accent/40 p-5 shadow-sm sm:p-7">
        <div className="pointer-events-none absolute -right-10 -top-12 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl gradient-brand text-brand-foreground shadow-glow">
            <LifeBuoy className="h-6 w-6" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wide text-primary">Pusat Bantuan</p>
            <h2 className="mt-0.5 font-display text-xl font-bold sm:text-2xl">
              {isCustomer ? "Butuh bantuan dengan pesanan Anda?" : "Butuh bantuan dengan job atau pembayaran?"}
            </h2>
            <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
              {isCustomer
                ? "Temukan panduan cepat seputar pemesanan, pembayaran, dan evaluasi campaign. Jika masih bingung, tim support siap membantu."
                : "Temukan panduan cepat seputar pengambilan job, upload bukti, dan pencairan penghasilan. Jika masih bingung, tim support siap membantu."}
            </p>
          </div>
        </div>

        <div className="relative mt-4 max-w-xl">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="h-11 rounded-xl bg-background/80 pl-9 shadow-sm backdrop-blur"
            placeholder="Cari pertanyaan, misalnya: pembayaran, upload bukti..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            aria-label="Cari pertanyaan bantuan"
          />
        </div>
      </section>

      <div className="grid gap-3 sm:grid-cols-3">
        {quickLinks.map((item) => {
          const Icon = item.icon;
          const content = (
            <>
              <div className="flex items-start justify-between gap-2">
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="h-4 w-4" />
                </span>
                <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
              </div>
              <p className="mt-3 text-sm font-semibold">{item.title}</p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">{item.description}</p>
            </>
          );
          return (
            <button
              key={item.title}
              type="button"
              onClick={() => onNavigate?.(item.target)}
              className="group rounded-2xl border border-border bg-card p-4 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md"
            >
              {content}
            </button>
          );
        })}
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
        <section className="rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-6">
          <div className="flex items-start gap-3">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
              <BookOpen className="h-4 w-4" />
            </span>
            <div>
              <h3 className="font-display text-base font-bold">Pertanyaan yang sering diajukan</h3>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {filteredFaqs.length} pertanyaan{query.trim() ? ` cocok dengan “${query.trim()}”` : ""}
              </p>
            </div>
          </div>

          {filteredFaqs.length === 0 ? (
            <div className="mt-6 rounded-xl border border-dashed border-border bg-muted/20 p-6 text-center">
              <p className="text-sm font-semibold">Pertanyaan tidak ditemukan</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Coba kata kunci lain atau hubungi support melalui WhatsApp/email di samping.
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-3"
                onClick={() => setQuery("")}
              >
                Reset pencarian
              </Button>
            </div>
          ) : (
            <Accordion type="single" collapsible className="mt-4 w-full">
              {filteredFaqs.map((faq, index) => (
                <AccordionItem key={faq.question} value={`faq-${index}`} className="last:border-b-0">
                  <AccordionTrigger className="py-3.5 text-left text-sm font-semibold hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="pb-3.5 text-sm leading-6 text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </section>

        <aside className="space-y-4">
          <section className="rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-5">
            <div className="flex items-center gap-2">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-500/10 text-emerald-600">
                <MessageCircle className="h-4 w-4" />
              </span>
              <div>
                <h3 className="font-display text-sm font-bold">Hubungi Support</h3>
                <p className="text-xs text-muted-foreground">Tim BuzzHub siap membantu.</p>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <Button
                type="button"
                className="w-full justify-start gradient-brand text-brand-foreground"
                onClick={() => onNavigate?.("pesan")}
              >
                <MessageCircle className="h-4 w-4" /> Kirim Pesan
              </Button>
              <Button asChild variant="outline" className="w-full justify-start">
                <a
                  href={`https://wa.me/${SUPPORT_WHATSAPP}?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <MessageCircle className="h-4 w-4" /> Chat WhatsApp
                </a>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start">
                <a href={`mailto:${SUPPORT_EMAIL}?subject=${emailSubject}&body=${emailBody}`}>
                  <Mail className="h-4 w-4" /> Email Support
                </a>
              </Button>
            </div>

            <div className="mt-4 flex items-start gap-2 rounded-xl bg-muted/40 p-3 text-xs text-muted-foreground">
              <Clock className="mt-0.5 h-4 w-4 shrink-0" />
              <div>
                <p className="font-medium text-foreground">Jam operasional</p>
                <p>Senin–Jumat, 09.00–18.00 WIB</p>
              </div>
            </div>

            <p className="mt-3 text-[11px] leading-5 text-muted-foreground">
              Sertakan email akun dan nomor invoice/job agar tim kami bisa membantu lebih cepat.
            </p>
          </section>

          <section className="rounded-2xl border border-primary/20 bg-primary/5 p-4 text-sm shadow-sm sm:p-5">
            <div className="flex items-center gap-2">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary/10 text-primary">
                <LifeBuoy className="h-4 w-4" />
              </span>
              <h3 className="font-display text-sm font-bold">Tips cepat</h3>
            </div>
            <ul className="mt-3 space-y-2 text-xs leading-5 text-muted-foreground">
              {(isCustomer
                ? [
                    "Isi brief campaign dengan jelas agar hasil buzzer lebih sesuai.",
                    "Cek status pembayaran di menu Pembayaran sebelum menghubungi support.",
                    "Beri rating setelah campaign selesai untuk membantu kualitas buzzer.",
                  ]
                : [
                    "Pastikan akun sosial untuk platform job sudah terverifikasi.",
                    "Upload screenshot yang jelas dan link postingan yang bisa dibuka publik.",
                    "Cek alasan revisi di detail job sebelum mengirim bukti baru.",
                  ]
              ).map((tip) => (
                <li key={tip} className="flex gap-2">
                  <span className={cn("mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary")} />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </section>
        </aside>
      </div>
    </div>
  );
}
