import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, BadgeCheck, Coins, Plus, Rocket, ShieldCheck, Trash2, TrendingUp, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { registerAccount } from "@/lib/auth";
import { submitApplication } from "@/lib/buzzer-verification";
import { submitSocialAccounts, SOCIAL_PLATFORMS, type SocialPlatform } from "@/lib/social-store";
import type { Platform } from "@/lib/buzzer-store";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/register/buzzer")({
  head: () => ({
    meta: [
      { title: "Daftar Buzzer — BuzzHub" },
      { name: "description", content: "Daftarkan diri dan akun media sosial Anda sebagai buzzer BuzzHub. Verifikasi dilakukan oleh admin." },
      { property: "og:title", content: "Daftar Buzzer — BuzzHub" },
      { property: "og:description", content: "Daftarkan diri dan akun media sosial Anda sebagai buzzer BuzzHub. Verifikasi dilakukan oleh admin." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: RegisterBuzzerPage,
});

const KATEGORI = [
  "Lifestyle", "Kuliner", "Beauty & Skincare", "Fashion", "Gaming",
  "Teknologi", "Finansial", "Edukasi", "Parenting", "Otomotif",
  "Travel", "Olahraga", "Musik & Hiburan", "Politik & Sosial",
] as const;

type SocialRow = { platform: SocialPlatform; username: string; profileUrl: string; followers: number };

const emptyRow = (): SocialRow => ({ platform: "Instagram", username: "", profileUrl: "", followers: 0 });

const PROGRAM_STEPS = [
  { icon: Rocket, title: "Daftar akun sosial", text: "Lengkapi profil dan akun media sosial Anda." },
  { icon: ShieldCheck, title: "Verifikasi admin", text: "Admin memeriksa keaslian akun dan data Anda." },
  { icon: Users, title: "Ambil job sesuai akun", text: "Job yang cocok dengan platform Anda akan tersedia." },
  { icon: Coins, title: "Kirim bukti & cairkan", text: "Selesaikan job, lalu cairkan pendapatan Anda." },
];

const LEVELS = [
  ["🥉", "Bronze", "0–10 rb"], ["🥈", "Silver", "10–50 rb"], ["🥇", "Gold", "50–100 rb"],
  ["💎", "Platinum", "100–500 rb"], ["👑", "Diamond", "500 rb+"],
] as const;

function RegisterBuzzerPage() {
  const navigate = useNavigate();
  const [kategori, setKategori] = useState("");
  const [rows, setRows] = useState<SocialRow[]>([emptyRow()]);
  const [loading, setLoading] = useState(false);
  const [doneOpen, setDoneOpen] = useState(false);
  const [doneName, setDoneName] = useState("");
  const [pass, setPass] = useState("");
  const [passConfirm, setPassConfirm] = useState("");

  const passMismatch = passConfirm.length > 0 && passConfirm !== pass;

  const patchRow = (i: number, patch: Partial<SocialRow>) =>
    setRows((cur) => cur.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = String(fd.get("name") || "").trim();
    const email = String(fd.get("email") || "").trim();
    const phone = String(fd.get("phone") || "").replace(/\D/g, "");
    const city = String(fd.get("city") || "").trim();
    const bio = String(fd.get("bio") || "").trim();
    const password = String(fd.get("password") || "");

    const address = String(fd.get("address") || "").trim();

    if (!name || !email) return toast.error("Nama dan email wajib diisi.");
    if (!kategori) return toast.error("Pilih kategori konten / bidang keahlian Anda.");
    if (password.length < 8) return toast.error("Kata sandi minimal 8 karakter.");
    if (password !== passConfirm) return toast.error("Ulangi kata sandi belum cocok.");

    const valid = rows.filter((r) => r.username.trim().length > 0);

    if (valid.length === 0) {
      return toast.error("Tambahkan minimal satu akun media sosial.");
    }
    if (valid.some((r) => r.followers < 0)) return toast.error("Jumlah followers tidak valid.");

    for (const r of valid) {
      const u = r.profileUrl.trim();
      if (!u) {
        return toast.error(`Link profil untuk akun ${r.platform} (@${r.username}) wajib diisi.`);
      }
      try {
        const testUrl = new URL(u.startsWith("http") ? u : "https://" + u);
        if (!testUrl.hostname || !testUrl.hostname.includes(".")) {
          throw new Error();
        }
      } catch {
        return toast.error(`Link profil untuk akun ${r.platform} (@${r.username}) tidak valid.`);
      }
    }

    for (const r of valid) {
      const u = r.profileUrl.trim();
      if (!u) {
        return toast.error(`Link profil untuk akun ${r.platform} (@${r.username}) wajib diisi.`);
      }
      try {
        const testUrl = new URL(u.startsWith("http") ? u : "https://" + u);
        if (!testUrl.hostname || !testUrl.hostname.includes(".")) {
          throw new Error();
        }
      } catch {
        return toast.error(`Link profil untuk akun ${r.platform} (@${r.username}) tidak valid.`);
      }
    }

    const primaryUsername = valid[0].username.trim();
    const primaryPlatform = valid[0].platform;
    const totalFollowers = valid.reduce((s, r) => s + (r.followers || 0), 0);

    setLoading(true);
    const acc = await registerAccount({
      role: "buzzer",
      name,
      email,
      password,
      phone,
      city,
      bio,
      company: "Buzzer",
      username: primaryUsername,
      platform: primaryPlatform,
      followers: totalFollowers,
      industry: kategori,
    });
    if (!acc.ok) {
      setLoading(false);
      return toast.error(acc.message || "Akun belum bisa daftar. Coba lagi.");
    }

    const res = await submitApplication({
      name, email,
      username: primaryUsername,
      platform: primaryPlatform as unknown as Platform,
      platforms: Array.from(new Set(valid.map((r) => r.platform))) as unknown as Platform[],
      followers: totalFollowers,
      phone, city, address, category: kategori, bio,
    });
    if (!res.ok) {
      setLoading(false);
      if (res.message.toLowerCase().includes("menunggu verifikasi") || res.message.toLowerCase().includes("terkirim") || res.message.toLowerCase().includes("sedang menunggu")) {
        return toast.warning(res.message);
      }
      return toast.error(res.message);
    }

    if (valid.length > 0) {
      await submitSocialAccounts(email, name, valid.map((r) => ({
        platform: r.platform,
        username: r.username,
        profileUrl: r.profileUrl.trim().startsWith("http") ? r.profileUrl.trim() : "https://" + r.profileUrl.trim(),
        followers: r.followers || 0,
        category: kategori,
      })));
    }

    setLoading(false);
    setDoneName(name);
    setDoneOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/30">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Kembali
        </Link>

        <div className="mt-6 grid items-start gap-6 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
          <aside className="rounded-3xl border border-border bg-card p-6 shadow-sm lg:sticky lg:top-6">
            <span className="inline-flex items-center gap-2 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
              <Rocket className="h-3.5 w-3.5" /> Program Buzzer BuzzHub
            </span>
            <h1 className="mt-4 font-display text-3xl font-bold leading-tight">Ubah pengaruh Anda jadi <span className="text-gradient-brand">penghasilan</span></h1>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">Gabung sebagai buzzer terverifikasi, ambil job sesuai akun sosial, dan dapatkan bayaran setelah pekerjaan disetujui.</p>

            <div className="mt-6 space-y-3">
              {PROGRAM_STEPS.map(({ icon: Icon, title, text }, index) => (
                <div key={title} className="flex gap-3 rounded-xl bg-muted/50 p-3">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg gradient-brand text-sm font-bold text-brand-foreground">{index + 1}</span>
                  <div><p className="text-sm font-semibold">{title}</p><p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{text}</p></div>
                  <Icon className="ml-auto h-4 w-4 shrink-0 text-brand" />
                </div>
              ))}
            </div>

            <div className="mt-6 border-t border-border pt-5">
              <div className="flex items-center gap-2"><TrendingUp className="h-4 w-4 text-brand" /><h2 className="font-display text-lg font-bold">Level buzzer</h2></div>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">Ditentukan dari total followers akun yang berhasil diverifikasi admin.</p>
              <div className="mt-3 grid grid-cols-5 gap-1.5">
                {LEVELS.map(([emoji, name, range]) => <div key={name} className="rounded-lg border border-border p-1.5 text-center"><span className="text-base">{emoji}</span><p className="truncate text-[10px] font-semibold">{name}</p><p className="text-[9px] text-muted-foreground">{range}</p></div>)}
              </div>
              <p className="mt-4 flex gap-2 text-xs text-muted-foreground"><BadgeCheck className="h-4 w-4 shrink-0 text-brand" /> Level dan akun sosial diverifikasi oleh admin.</p>
            </div>
          </aside>

          <div className="rounded-3xl border border-border bg-card p-6 shadow-glow sm:p-8">
          <h1 className="font-display text-2xl font-bold sm:text-3xl">Pendaftaran Buzzer</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Lengkapi data diri dan akun media sosial Anda. Tim admin akan memverifikasi sebelum akun aktif.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-8">
            <section className="space-y-4">
              <h2 className="font-display text-lg font-bold">1. Data diri</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="b-name">Nama lengkap</Label>
                  <Input id="b-name" name="name" placeholder="Nama sesuai identitas" required />
                </div>
                <div>
                  <Label htmlFor="b-phone">No. WhatsApp</Label>
                  <Input id="b-phone" name="phone" inputMode="numeric" pattern="[0-9]*" placeholder="081234567890" onChange={(e) => { e.currentTarget.value = e.currentTarget.value.replace(/\D/g, ""); }} />
                </div>
                <div>
                  <Label htmlFor="b-city">Kota domisili</Label>
                  <Input id="b-city" name="city" placeholder="Contoh: Bandung" />
                </div>
                <div>
                  <Label htmlFor="b-address">Alamat lengkap</Label>
                  <Input id="b-address" name="address" placeholder="Contoh: Jl. Sudirman No. 45, RT 02/04, Kelurahan..." />
                </div>
                <div className="sm:col-span-2">
                  <Label>Kategori konten</Label>
                  <Select value={kategori} onValueChange={setKategori}>
                    <SelectTrigger><SelectValue placeholder="Pilih kategori" /></SelectTrigger>
                    <SelectContent>
                      {KATEGORI.map((k) => <SelectItem key={k} value={k}>{k}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="sm:col-span-2">
                  <Label htmlFor="b-bio">Deskripsi singkat</Label>
                  <Textarea id="b-bio" name="bio" rows={3} placeholder="Ceritakan gaya konten dan audiens Anda." />
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-lg font-bold">2. Akun media sosial</h2>
                <Button type="button" variant="outline" size="sm" onClick={() => setRows((c) => [...c, emptyRow()])}>
                  <Plus className="mr-1 h-4 w-4" /> Tambah akun
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Data followers akan dicek admin. Akun yang tidak dapat diverifikasi tidak akan dihitung.
              </p>

              <div className="space-y-4">
                {rows.map((r, i) => (
                  <div key={i} className="rounded-2xl border border-border p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Akun {i + 1}</span>
                      {rows.length > 1 && (
                        <Button type="button" variant="ghost" size="sm" onClick={() => setRows((c) => c.filter((_, idx) => idx !== i))}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div>
                        <Label>Platform</Label>
                        <Select value={r.platform} onValueChange={(v) => patchRow(i, { platform: v as SocialPlatform })}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {SOCIAL_PLATFORMS.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Username</Label>
                        <Input value={r.username} onChange={(e) => patchRow(i, { username: e.target.value })} placeholder="@username" />
                      </div>
                      <div>
                        <Label>Link profil *</Label>
                        <Input value={r.profileUrl} onChange={(e) => patchRow(i, { profileUrl: e.target.value })} placeholder="https://..." />
                      </div>
                      <div>
                        <Label>Jumlah followers</Label>
                        <Input
                          type="number" min={0} value={r.followers || ""}
                          onChange={(e) => patchRow(i, { followers: Number(e.target.value) || 0 })}
                          placeholder="0"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="font-display text-lg font-bold">3. Akun login website</h2>
              <p className="text-sm text-muted-foreground">
                Email utama dan kata sandi ini digunakan untuk masuk ke website jasa buzzer.
              </p>
              <div>
                <Label htmlFor="b-email">Email utama</Label>
                <Input id="b-email" name="email" type="email" autoComplete="email" placeholder="buzzer@buzzhub.id" required />
              </div>
              <PasswordInput
                id="b-pass"
                name="password"
                label="Password"
                autoComplete="new-password"
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                placeholder="Minimal 8 karakter"
                showStrength
                required
              />
              <PasswordInput
                id="b-pass-confirm"
                name="password-confirm"
                label="Ulangi password"
                autoComplete="new-password"
                value={passConfirm}
                onChange={(e) => setPassConfirm(e.target.value)}
                placeholder="Ketik ulang password"
                hint={
                  passConfirm.length === 0
                    ? undefined
                    : passMismatch
                      ? "Password belum cocok."
                      : "Password cocok."
                }
                hintTone={passMismatch ? "error" : "success"}
                required
              />
            </section>

            <Button type="submit" disabled={loading || passMismatch} size="lg" className="w-full gradient-brand text-brand-foreground hover:opacity-90">
              {loading ? "Mengirim..." : "Kirim untuk Verifikasi Admin"}
            </Button>
          </form>
          </div>
        </div>
      </div>

      <Dialog open={doneOpen} onOpenChange={setDoneOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-brand" /> Pendaftaran Berhasil
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Data Anda telah dikirim dan sedang menunggu verifikasi Admin. Anda sudah dapat masuk ke halaman Login,
            tetapi job baru tersedia setelah akun berhasil diverifikasi.
          </p>
          <DialogFooter>
            <Button onClick={() => navigate({ to: "/login" })} className="gradient-brand text-brand-foreground">
              Ke Halaman Masuk
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
