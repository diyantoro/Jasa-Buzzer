import { useMemo, useState } from "react";
import {
  Instagram, Music2, Facebook, Twitter, Youtube, Linkedin, Send, AtSign,
  ExternalLink, Search, Link2, Lock as LockIcon,
  Users, CheckCircle2, Clock, XCircle, Power, Camera, ChevronRight,
  Plus, Upload, AlertCircle, Eye, Trash2,
} from "lucide-react";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";

import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { StatCard } from "@/components/dashboard-shell";
import {
  useSocialAccounts, refreshSocialAccounts, submitFollowerUpdateDirect,
  buzzerDeactivateAccount, buzzerUpdateAccount, SOCIAL_PLATFORMS, getSocialProfileUrl,
  type SocialAccount, type SocialPlatform, type VerificationStatus,
} from "@/lib/social-store";
import {
  useBuzzerLevel, useBuzzerLevels, levelFromFollowers, countedFollowers,
  nextLevel as nextLevelOf, levelProgress as progressOf,
} from "@/lib/buzzer-level";
import { formatIDR } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { uploadProofScreenshot } from "@/lib/proof-upload";
import { notifySocialAccountSubmitted } from "@/lib/buzzer-notification-store";



const PLATFORM_ICON: Record<SocialPlatform, React.ReactNode> = {
  "Instagram": <Instagram className="h-4 w-4" />,
  "TikTok": <Music2 className="h-4 w-4" />,
  "Facebook": <Facebook className="h-4 w-4" />,
  "X (Twitter)": <Twitter className="h-4 w-4" />,
  "YouTube": <Youtube className="h-4 w-4" />,
  "LinkedIn": <Linkedin className="h-4 w-4" />,
  "Threads": <AtSign className="h-4 w-4" />,
  "Telegram": <Send className="h-4 w-4" />,
};

const PLATFORM_COLOR: Record<SocialPlatform, string> = {
  "Instagram": "from-pink-500 to-orange-500",
  "TikTok": "from-zinc-800 to-zinc-600",
  "Facebook": "from-blue-600 to-blue-400",
  "X (Twitter)": "from-zinc-900 to-zinc-700",
  "YouTube": "from-red-600 to-red-400",
  "LinkedIn": "from-blue-700 to-blue-500",
  "Threads": "from-neutral-800 to-neutral-600",
  "Telegram": "from-sky-500 to-cyan-400",
};

const CATEGORIES = ["Lifestyle", "Kuliner", "Fashion", "Hiburan", "Edukasi", "Teknologi", "Review", "Opini", "Gaming", "Bisnis", "Kesehatan"];

export function SosmedSection({ email, name }: { email: string; name: string }) {
  const store = useSocialAccounts(email, name);
  const lv = useBuzzerLevel(email);
  const [q, setQ] = useState("");
  const [sortDesc, setSortDesc] = useState(true);
  const [viewing, setViewing] = useState<SocialAccount | null>(null);
  const [adding, setAdding] = useState(false);
  const [pembaruanAccount, setPembaruanAccount] = useState<SocialAccount | null>(null);
  const [deactivateAccount, setDeactivateAccount] = useState<SocialAccount | null>(null);

  const filtered = useMemo(() => {
    let arr = store.accounts.slice();
    if (q.trim()) {
      const s = q.trim().toLowerCase();
      arr = arr.filter((a) =>
        a.username.toLowerCase().includes(s) ||
        a.accountName.toLowerCase().includes(s) ||
        a.platform.toLowerCase().includes(s) ||
        a.category.toLowerCase().includes(s));
    }
    arr.sort((a, b) => sortDesc ? b.followers - a.followers : a.followers - b.followers);
    return arr;
  }, [store.accounts, q, sortDesc]);

  const total = store.accounts.length;
  const totalFollowers = store.accounts.reduce((s, a) => s + a.followers, 0);
  const activeCount = store.accounts.filter((a) => a.isActive && a.verification === "Terverifikasi").length;
  const pendingCount = store.accounts.filter((a) => a.verification === "Menunggu" || a.pendingVerification === "Menunggu").length;

  return (
    <div className="space-y-4">
      {/* Level buzzer */}
      <LevelCard email={email} name={name} />

      {/* Stats — ringkas: hanya milik buzzer sendiri */}
      <div className="grid gap-3 sm:grid-cols-3">
        <StatCard label="Akun Saya" value={total.toString()} hint="Total akun terhubung" icon={<Link2 className="h-5 w-5" />} />
        <StatCard label="Total Followers" value={totalFollowers.toLocaleString("id-ID")} hint={`${lv.followers.toLocaleString("id-ID")} dihitung untuk level`} icon={<Users className="h-5 w-5" />} />
        <StatCard label="Akun Aktif" value={activeCount.toString()} hint={pendingCount > 0 ? `${pendingCount} menunggu verifikasi` : `${total - activeCount} nonaktif`} icon={<Power className="h-5 w-5" />} />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-muted/40 p-3 text-sm text-muted-foreground">
        <p><LockIcon className="mr-2 inline h-4 w-4" />Akun yang ditambahkan perlu diverifikasi admin sebelum aktif untuk campaign.</p>
        <Button size="sm" className="gradient-brand text-brand-foreground" onClick={() => setAdding(true)}><Plus className="mr-1 h-4 w-4" /> Tambah Akun</Button>
      </div>

      {/* Toolbar — pencarian + urutkan */}
      <div className="rounded-2xl border border-border bg-card p-3 sm:p-4">
        <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto_auto] sm:items-center">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Cari akun saya..." className="pl-9" />
          </div>
          <Button variant="outline" onClick={() => setSortDesc((v) => !v)} className="whitespace-nowrap">
            Followers {sortDesc ? "↓" : "↑"}
          </Button>
        </div>

      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="grid place-items-center rounded-2xl border border-dashed border-border bg-card/50 p-10 text-center">
          <div className="mb-3 grid h-14 w-14 place-items-center rounded-full bg-muted text-muted-foreground">
            <Link2 className="h-6 w-6" />
          </div>
          <p className="font-semibold">Belum ada akun sosial media</p>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            Tambahkan akun media sosialmu. Akun yang ditambahkan akan diverifikasi admin sebelum bisa digunakan untuk mengambil job.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((a) => (
            <AccountCard
              key={a.id}
              acc={a}
              onView={() => setViewing(a)}
              onPembaruan={() => setPembaruanAccount(a)}
              onDeactivate={() => setDeactivateAccount(a)}
            />
          ))}
        </div>
      )}

      {/* Detail Dialog */}
      <Dialog open={!!viewing} onOpenChange={(o) => !o && setViewing(null)}>
        <DialogContent className="sm:max-w-md">
          {viewing && (
            <>
              <div className={cn("-mx-6 -mt-6 mb-2 h-24 rounded-t-lg bg-gradient-to-br", PLATFORM_COLOR[viewing.platform])} />
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    {viewing.photoUrl && <AvatarImage src={viewing.photoUrl} />}
                    <AvatarFallback className="gradient-brand text-brand-foreground">
                      {viewing.accountName.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="truncate">{viewing.accountName}</p>
                    <p className="truncate text-xs font-normal text-muted-foreground">{viewing.username} · {viewing.platform}</p>
                  </div>
                </DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-3 gap-2 rounded-xl border border-border p-3 text-center">
                <Metric label="Followers" value={viewing.followers.toLocaleString("id-ID")} />
                <Metric label="Following" value={viewing.following.toLocaleString("id-ID")} />
                <Metric label="Postingan" value={viewing.posts.toLocaleString("id-ID")} />
              </div>
              <div className="space-y-2 text-sm">
                <Row label="Kategori" value={viewing.category} />
                <Row
                  label="Link Profil"
                  value={
                    getSocialProfileUrl(viewing) ? (
                      <a
                        href={getSocialProfileUrl(viewing)!}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex max-w-[240px] items-center gap-1 truncate font-mono text-xs text-primary hover:underline"
                        title={getSocialProfileUrl(viewing)!}
                      >
                        <span className="truncate">{viewing.profileUrl}</span>
                        <ExternalLink className="h-3 w-3 shrink-0" />
                      </a>
                    ) : (
                      "-"
                    )
                  }
                />
                <Row label="Status" value={<VerifBadge s={viewing.pendingVerification ?? viewing.verification} />} />
                <Row
                  label="Aktif"
                  value={
                    viewing.rejectionNote?.includes("[Permintaan Nonaktif/Hapus]")
                      ? <span className="font-semibold text-amber-600 dark:text-amber-400">Menunggu Persetujuan Admin (Tetap Aktif)</span>
                      : viewing.isActive ? "Ya" : "Tidak"
                  }
                />
                {viewing.bio && <Row label="Bio" value={viewing.bio} />}
                {viewing.rejectionNote && (
                  <Row
                    label={viewing.rejectionNote.includes("[Permintaan Nonaktif/Hapus]") ? "Permintaan" : "Catatan"}
                    value={
                      <span className={viewing.rejectionNote.includes("[Permintaan Nonaktif/Hapus]") ? "text-amber-600 dark:text-amber-400 font-medium" : "text-rose-500"}>
                        {viewing.rejectionNote}
                      </span>
                    }
                  />
                )}
                {viewing.pendingRejectionNote && (
                  <Row
                    label="Catatan Penolakan Pembaruan"
                    value={<span className="text-rose-500 font-medium">{viewing.pendingRejectionNote}</span>}
                  />
                )}
                {viewing.pendingVerification && <Row label="Pengajuan" value={<VerifBadge s={viewing.pendingVerification} />} />}
                {viewing.pendingFollowers != null && <Row label="Followers diajukan" value={viewing.pendingFollowers.toLocaleString("id-ID")} />}
              </div>
              <DialogFooter className="flex-wrap gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    const target = viewing;
                    setViewing(null);
                    setPembaruanAccount(target);
                  }}
                >
                  <Upload className="mr-1 h-4 w-4" /> Pembaruan
                </Button>
                <Button variant="outline" onClick={() => {
                  const profileUrl = getSocialProfileUrl(viewing);
                  if (!profileUrl) {
                    toast.error(viewing.profileUrl.trim() ? "URL profil media sosial tidak valid." : "Link profil media sosial belum tersedia.");
                    return;
                  }
                  window.open(profileUrl, "_blank", "noopener,noreferrer");
                }}>
                  <ExternalLink className="mr-1 h-4 w-4" /> Buka Profil
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Tambah Akun Dialog (Khusus Buzzer) */}
      {adding && (
        <BuzzerAddAccountDialog
          existing={store.accounts}
          onClose={() => setAdding(false)}
          onSubmit={async (data) => {
            const ok = await store.add({ ...data, isActive: false });
            if (!ok) { toast.error("Akun gagal diajukan. Periksa data atau akun yang sama."); return false; }
            toast.success("Akun diajukan dan menunggu verifikasi admin.");
            void notifySocialAccountSubmitted({
              buzzerEmail: email,
              platform: data.platform,
              username: data.username,
              action: "tambah",
            });
            setAdding(false);
            return true;
          }}
        />
      )}

      {/* Form Pembaruan (Khusus Buzzer) */}
      {pembaruanAccount && (
        <BuzzerPembaruanDialog
          account={pembaruanAccount}
          existing={store.accounts}
          email={email}
          onClose={() => setPembaruanAccount(null)}
        />
      )}

      {/* Form Permintaan Nonaktif (Khusus Buzzer) */}
      {deactivateAccount && (
        <BuzzerDeactivateDialog
          account={deactivateAccount}
          email={email}
          onClose={() => setDeactivateAccount(null)}
        />
      )}
    </div>
  );
}


/* ---------------- Level card ---------------- */

export function LevelCard({ email, name, simple = false }: { email: string; name: string; simple?: boolean }) {
  const lv = useBuzzerLevel(email);
  const levels = useBuzzerLevels();
  // Konsisten dengan kartu akun sosial media: jika level belum ditetapkan admin,
  // hitung sementara dari total followers akun yang sudah terverifikasi.
  const { accounts } = useSocialAccounts(email, name);
  const verifiedFollowers = countedFollowers(accounts);
  const derived = levelFromFollowers(verifiedFollowers, levels);
  const level = lv.level ?? (verifiedFollowers > 0 ? derived : null);
  const followers = lv.level ? lv.followers : verifiedFollowers;
  const next = nextLevelOf(followers, levels);
  const progress = progressOf(followers, levels);
  const [openLevels, setOpenLevels] = useState(false);
  const grid = (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
      {levels.map((l) => (
        <div
          key={l.name}
          className={cn(
            "rounded-lg border p-2 text-center text-xs",
            l.name === level?.name ? "border-transparent gradient-brand text-brand-foreground" : "border-border text-muted-foreground",
          )}
        >
          <p className="font-semibold">{l.emoji} {l.name}</p>
          <p className="text-[10px]">{compact(l.minFollowers)}+ · {l.payout > 0 ? formatIDR(l.payout) : "—"}</p>
        </div>
      ))}
    </div>
  );

  const openDetail = () => setOpenLevels(true);

  return (
    <>
      <div
        className="group cursor-pointer rounded-2xl border border-border bg-card p-3 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md sm:p-4"
        role="button"
        tabIndex={0}
        onClick={openDetail}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            openDetail();
          }
        }}
        aria-label="Lihat detail Level Buzzer"
      >
        <div className="flex min-w-0 items-center gap-3">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-muted text-xl">{level?.emoji ?? "⏳"}</span>
          <div className="min-w-0 flex-1">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Level Buzzer</p>
            <p className="truncate font-display text-lg font-bold">{level?.name ?? "Belum ditetapkan"}</p>
          </div>
          <div className="hidden shrink-0 text-right sm:block">
            <p className="text-xs text-muted-foreground">Bayaran per Job</p>
            <p className="font-display font-bold text-gradient-brand">{level && level.payout > 0 ? formatIDR(level.payout) : "—"}</p>
          </div>
          <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
        </div>
        <div className="mt-2 flex min-w-0 items-center justify-between gap-3 text-xs">
          <span className="truncate text-muted-foreground">{followers.toLocaleString("id-ID")} Followers terverifikasi</span>
          <span className="shrink-0 text-muted-foreground sm:hidden">{level && level.payout > 0 ? formatIDR(level.payout) : "—"} / Job</span>
          <Button
            variant="link"
            size="sm"
            className="h-auto shrink-0 p-0 text-xs"
            onClick={(event) => {
              event.stopPropagation();
              openDetail();
            }}
          >
            Lihat Detail
          </Button>
        </div>
      </div>

      <Dialog open={openLevels} onOpenChange={setOpenLevels}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Detail Level Buzzer</DialogTitle>
            <DialogDescription>Level ditentukan dari followers akun media sosial yang sudah diverifikasi admin.</DialogDescription>
          </DialogHeader>

          <div className="flex items-center gap-3 rounded-xl border border-border bg-muted/40 p-3">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-background text-2xl">{level?.emoji ?? "⏳"}</span>
            <div className="min-w-0 flex-1">
              <p className="text-xs text-muted-foreground">Level saat ini</p>
              <p className="font-display text-xl font-bold">{level?.name ?? "Belum ditetapkan"}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Bayaran per Job</p>
              <p className="font-semibold text-gradient-brand">{level && level.payout > 0 ? formatIDR(level.payout) : "—"}</p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between gap-3 text-sm">
              <span className="text-muted-foreground">Followers terverifikasi</span>
              <span className="font-semibold">{followers.toLocaleString("id-ID")}</span>
            </div>
            <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
              <span>Progress menuju level berikutnya</span>
              <span>{next ? `${(next.minFollowers - followers).toLocaleString("id-ID")} lagi ke ${next.name}` : "Level tertinggi tercapai"}</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
              <div className="h-full gradient-brand transition-all" style={{ width: `${progress}%` }} />
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-semibold">Daftar Level Buzzer</p>
            <div className="grid gap-2">{grid}</div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenLevels(false)}>Tutup</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}


export function LevelBadge({ followers, className }: { followers: number; className?: string }) {
  const levels = useBuzzerLevels();
  const l = levelFromFollowers(followers, levels);
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold", l.badgeClass, className)}>
      {l.emoji} {l.name}
    </span>
  );
}


/* ---------------- Card ---------------- */

function AccountCard({
  acc,
  onView,
  onPembaruan,
  onDeactivate,
}: {
  acc: SocialAccount;
  onView: () => void;
  onPembaruan: () => void;
  onDeactivate: () => void;
}) {

  return (
    <div className="group overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
      <div className={cn("relative h-20 bg-gradient-to-br", PLATFORM_COLOR[acc.platform])}>
        <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-background/90 px-2 py-1 text-xs font-semibold text-foreground backdrop-blur">
          {PLATFORM_ICON[acc.platform]} {acc.platform}
        </span>
        <span className="absolute right-3 top-3">
          <VerifBadge s={acc.verification} />
        </span>
      </div>
      <div className="px-4 pb-4">
        {/* Baris Avatar & Status Aktif */}
        <div className="flex items-start justify-between gap-3">
          <Avatar className="-mt-8 h-16 w-16 shrink-0 border-4 border-card shadow-sm">
            {acc.photoUrl && <AvatarImage src={acc.photoUrl} />}
            <AvatarFallback className="gradient-brand text-brand-foreground font-bold">
              {acc.accountName.split(" ").map((n) => n[0]).join("").slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          <span className={cn(
            "mt-2 shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold",
            acc.rejectionNote?.includes("[Permintaan Nonaktif/Hapus]")
              ? "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300"
              : acc.pendingVerification === "Menunggu"
                ? "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300"
                : acc.verification === "Menunggu"
                  ? "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300"
                  : acc.isActive
                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300"
                    : "bg-muted text-muted-foreground",
          )}>
            {acc.rejectionNote?.includes("[Permintaan Nonaktif/Hapus]")
              ? "Menunggu Persetujuan Nonaktif"
              : acc.pendingVerification === "Menunggu"
                ? "Menunggu Pembaruan"
                : acc.verification === "Menunggu"
                  ? "Belum Diverifikasi"
                  : acc.isActive ? "Aktif" : "Nonaktif"}
          </span>
        </div>

        {/* Info Nama Akun, Username & Link Profil (tidak terpotong oleh banner) */}
        <div className="mt-2 min-w-0">
          <p className="truncate font-semibold text-base leading-tight text-foreground">{acc.accountName}</p>
          <p className="truncate text-xs text-muted-foreground mt-0.5">{acc.username}</p>
          {getSocialProfileUrl(acc) && (
            <a
              href={getSocialProfileUrl(acc)!}
              target="_blank"
              rel="noreferrer"
              className="mt-1.5 inline-flex max-w-full items-center gap-1.5 truncate text-[11px] text-primary hover:underline font-mono"
              title={getSocialProfileUrl(acc)!}
              onClick={(e) => e.stopPropagation()}
            >
              <Link2 className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{acc.profileUrl}</span>
              <ExternalLink className="h-2.5 w-2.5 shrink-0" />
            </a>
          )}
        </div>

        <div className="mt-3 grid grid-cols-3 gap-2 rounded-xl bg-muted/40 p-2 text-center">
          <Metric label="Followers" value={compact(acc.followers)} />
          <Metric label="Following" value={compact(acc.following)} />
          <Metric label="Post" value={compact(acc.posts)} />
        </div>

        <dl className="mt-3 space-y-1.5 text-xs">
          <div className="flex items-center justify-between gap-2">
            <dt className="text-muted-foreground">Followers</dt>
            <dd className="font-semibold">{acc.followers.toLocaleString("id-ID")}</dd>
          </div>
          <div className="flex items-center justify-between gap-2">
            <dt className="text-muted-foreground">Status verifikasi</dt>
            <dd><VerifBadge s={acc.pendingVerification ?? acc.verification} /></dd>
          </div>
          <div className="flex items-center justify-between gap-2">
            <dt className="text-muted-foreground">Kategori</dt>
            <dd className="font-medium">{acc.category}</dd>
          </div>
        </dl>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <LevelBadge followers={acc.followers} />
        </div>

        <div className="mt-3 flex items-center gap-2">
          <Button size="sm" variant="outline" className="h-8 w-8 p-0" title="Detail" aria-label="Detail" onClick={onView}>
            <Eye className="h-3.5 w-3.5" />
          </Button>
          <Button size="sm" variant="outline" className="flex-1" onClick={onPembaruan}>
            <Upload className="mr-1 h-3.5 w-3.5" /> Pembaruan
          </Button>
        </div>
        <div className="mt-2">
          <Button 
            size="sm" 
            variant="outline" 
            className={cn(
              "w-full",
              acc.rejectionNote?.includes("[Permintaan Nonaktif/Hapus]")
                ? "text-amber-600 border-amber-200 dark:border-amber-900 opacity-80 cursor-not-allowed"
                : acc.verification === "Menunggu"
                  ? "text-amber-600 border-amber-200 dark:border-amber-900 opacity-80 cursor-not-allowed"
                  : !acc.isActive
                    ? "text-muted-foreground border-border opacity-70 cursor-not-allowed"
                    : "text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/30 border-rose-200 dark:border-rose-900",
            )}
            onClick={acc.isActive && acc.verification === "Terverifikasi" ? onDeactivate : undefined}
            disabled={(!acc.isActive) || (acc.verification === "Menunggu") || (acc.rejectionNote?.includes("[Permintaan Nonaktif/Hapus]") ?? false)}
          >
            <Power className="mr-1 h-3.5 w-3.5" />
            {acc.rejectionNote?.includes("[Permintaan Nonaktif/Hapus]") 
              ? "Menunggu Persetujuan Nonaktif" 
              : acc.verification === "Menunggu"
                ? "Menunggu Verifikasi Admin"
                : !acc.isActive
                  ? "Akun Dinonaktifkan"
                  : "Nonaktifkan Akun"}
          </Button>
        </div>

      </div>
    </div>
  );
}

/* ---------------- Form Penonaktifan Khusus Akun Buzzer ---------------- */

function BuzzerDeactivateDialog({
  account,
  email,
  onClose,
}: {
  account: SocialAccount;
  email: string;
  onClose: () => void;
}) {
  const [saving, setSaving] = useState(false);
  const [deactivateReason, setDeactivateReason] = useState(() => {
    if (account.rejectionNote?.includes("[Permintaan Nonaktif/Hapus]")) {
      return account.rejectionNote.replace("[Permintaan Nonaktif/Hapus]: ", "").trim();
    }
    return "";
  });

  const handleConfirmDeactivate = async () => {
    if (!deactivateReason.trim()) {
      toast.error("Alasan penonaktifan/penghapusan akun wajib diisi.");
      return;
    }
    setSaving(true);
    try {
      const res = await buzzerDeactivateAccount(email, account.id, deactivateReason.trim());
      if (!res) throw new Error("Gagal mengirim permintaan ke admin.");
      toast.success("Permintaan penonaktifan akun berhasil dikirim ke Admin dan sedang menunggu persetujuan.");
      void notifySocialAccountSubmitted({
        buzzerEmail: email,
        platform: account.platform,
        username: account.username,
        action: "nonaktif",
      });
      onClose();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal mengirim permintaan.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open onOpenChange={(o) => !o && !saving && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Power className="h-5 w-5 text-rose-500" />
            Minta Penonaktifan / Hapus Akun ke Admin
          </DialogTitle>
          <DialogDescription>
            Ajukan permintaan penonaktifan atau penghapusan akun media sosial ini kepada Admin.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="flex items-center gap-3 rounded-xl border border-border bg-muted/40 p-3">
            <Avatar className="h-11 w-11">
              {account.photoUrl && <AvatarImage src={account.photoUrl} />}
              <AvatarFallback className="gradient-brand text-brand-foreground">
                {(account.accountName || "AK").split(" ").map((n) => n[0]).join("").slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-sm truncate">{account.accountName}</p>
              <p className="text-xs text-muted-foreground truncate">{account.username} · {account.platform}</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Alasan Penonaktifan / Penghapusan Akun *</Label>
            <Textarea
              rows={3}
              value={deactivateReason}
              onChange={(e) => setDeactivateReason(e.target.value)}
              placeholder="Tuliskan alasan pengajuan (misal: ingin mengganti akun baru, akun sudah tidak aktif, dll)..."
            />
          </div>

          <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <p>
              Permintaan ini akan dikirim ke Admin untuk ditinjau. Akun ini akan tetap berstatus aktif sampai Admin menyetujui permintaan penonaktifan ini.
            </p>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={saving}
          >
            Batal
          </Button>
          <Button
            type="button"
            variant="destructive"
            disabled={saving || !deactivateReason.trim()}
            onClick={handleConfirmDeactivate}
          >
            <Send className="mr-1.5 h-4 w-4" /> {saving ? "Mengirim..." : "Kirim Permintaan ke Admin"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


/* ---------------- Form Pembaruan Khusus Akun Buzzer ---------------- */

function BuzzerPembaruanDialog({
  account,
  existing,
  email,
  onClose,
}: {
  account: SocialAccount;
  existing: SocialAccount[];
  email: string;
  onClose: () => void;
}) {
  const [form, setForm] = useState({
    platform: account.platform,
    username: account.username,
    accountName: account.accountName,
    profileUrl: account.profileUrl,
    followers: account.followers,
    following: account.following,
    posts: account.posts,
    category: account.category,
    bio: account.bio,
    photoUrl: account.photoUrl,
  });
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const onPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => setForm((s) => ({ ...s, photoUrl: reader.result as string }));
    reader.readAsDataURL(f);
  };

  const followersChanged = Number(form.followers) !== Number(account.followers);

  const handlePreSubmit = () => {
    if (!form.username.trim()) {
      toast.error("Username wajib diisi");
      return;
    }
    if (!form.accountName.trim()) {
      toast.error("Nama akun wajib diisi");
      return;
    }
    try {
      const url = form.profileUrl.trim();
      if (!url) {
        toast.error("Link profil wajib diisi");
        return;
      }
      const test = new URL(url.startsWith("http") ? url : "https://" + url);
      if (!test.hostname || !test.hostname.includes(".")) {
        throw new Error();
      }
    } catch {
      toast.error("Link profil tidak valid (masukkan tautan URL profil lengkap)");
      return;
    }
    if (form.followers < 0 || form.following < 0 || form.posts < 0) {
      toast.error("Nilai angka tidak boleh negatif");
      return;
    }

    const dup = existing.some(
      (x) => x.id !== account.id && x.platform === form.platform && x.username.trim().toLowerCase() === form.username.trim().toLowerCase(),
    );
    if (dup) {
      toast.error("Akun dengan username ini sudah terdaftar pada platform yang sama.");
      return;
    }

    if (followersChanged && !proofFile) {
      toast.error("Wajib mengunggah bukti screenshot followers jika jumlah followers diubah.");
      return;
    }

    setConfirmOpen(true);
  };

  const handleExecuteUpdate = async () => {
    setSaving(true);
    try {
      let pendingProofUrl: string | undefined = undefined;
      if (proofFile) {
        pendingProofUrl = await uploadProofScreenshot(proofFile);
      }

      const res = await buzzerUpdateAccount(email, account.id, {
        platform: form.platform,
        username: form.username,
        accountName: form.accountName,
        profileUrl: form.profileUrl.startsWith("http") ? form.profileUrl : "https://" + form.profileUrl,
        following: form.following,
        posts: form.posts,
        category: form.category,
        bio: form.bio,
        photoUrl: form.photoUrl,
        ...(followersChanged && pendingProofUrl
          ? {
              pendingFollowers: form.followers,
              pendingProofUrl,
            }
          : {}),
      });

      if (!res.ok) throw new Error(res.message || "Gagal memperbarui akun");

      toast.success("Pembaruan data akun berhasil dikirim dan menunggu verifikasi Admin.");
      void notifySocialAccountSubmitted({
        buzzerEmail: email,
        platform: form.platform,
        username: form.username,
        action: "pembaruan",
      });
      setConfirmOpen(false);
      onClose();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal memperbarui akun");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Dialog open onOpenChange={(o) => !o && !saving && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5 text-primary" />
            Pembaruan Akun Sosial Media
          </DialogTitle>
          <DialogDescription>
            Perbarui data akun media sosial Anda atau ajukan pembaruan followers.
          </DialogDescription>
        </DialogHeader>

        {account.rejectionNote?.includes("[Permintaan Nonaktif/Hapus]") && (
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Menunggu Persetujuan Admin (Permintaan Nonaktif / Hapus)</p>
              <p className="mt-0.5 text-muted-foreground">
                Alasan: {account.rejectionNote.replace("[Permintaan Nonaktif/Hapus]: ", "")}
              </p>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {/* Foto */}
          <div className="flex items-center gap-3">
            <Avatar className="h-16 w-16">
              {form.photoUrl && <AvatarImage src={form.photoUrl} />}
              <AvatarFallback className="gradient-brand text-brand-foreground">
                {(form.accountName || "AK").split(" ").map((n) => n[0]).join("").slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-input px-3 py-2 text-sm hover:bg-accent">
              <Camera className="h-4 w-4" /> Upload Foto
              <input type="file" accept="image/*" className="hidden" onChange={onPhoto} />
            </label>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {/* Platform */}
            <div>
              <Label>Platform</Label>
              <Select
                value={form.platform}
                onValueChange={(v) => setForm({ ...form, platform: v as SocialPlatform })}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {SOCIAL_PLATFORMS.map((p) => (
                    <SelectItem key={p} value={p}>
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Kategori */}
            <div>
              <Label>Kategori</Label>
              <Select
                value={form.category}
                onValueChange={(v) => setForm({ ...form, category: v })}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            {/* Username */}
            <div>
              <Label>Username *</Label>
              <Input
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                placeholder="@username"
              />
            </div>

            {/* Nama Akun */}
            <div>
              <Label>Nama Akun *</Label>
              <Input
                value={form.accountName}
                onChange={(e) => setForm({ ...form, accountName: e.target.value })}
                placeholder="Nama tampilan"
              />
            </div>

            {/* Link Profil */}
            <div className="sm:col-span-2">
              <Label>Link Profil *</Label>
              <Input
                value={form.profileUrl}
                onChange={(e) => setForm({ ...form, profileUrl: e.target.value })}
                placeholder="https://instagram.com/username"
              />
            </div>

            {/* Followers */}
            <div>
              <Label>Followers</Label>
              <Input
                type="number"
                min={0}
                placeholder="0"
                value={form.followers === 0 ? "" : form.followers}
                onFocus={(e) => {
                  if (form.followers === 0) e.target.select();
                }}
                onChange={(e) => {
                  const val = e.target.value;
                  setForm({ ...form, followers: val === "" ? 0 : Math.max(0, Number(val) || 0) });
                }}
              />
            </div>

            {/* Following */}
            <div>
              <Label>Following</Label>
              <Input
                type="number"
                min={0}
                placeholder="0"
                value={form.following === 0 ? "" : form.following}
                onFocus={(e) => {
                  if (form.following === 0) e.target.select();
                }}
                onChange={(e) => {
                  const val = e.target.value;
                  setForm({ ...form, following: val === "" ? 0 : Math.max(0, Number(val) || 0) });
                }}
              />
            </div>

            {/* Postingan */}
            <div className="sm:col-span-2 sm:w-1/2 sm:pr-1.5">
              <Label>Postingan</Label>
              <Input
                type="number"
                min={0}
                placeholder="0"
                value={form.posts === 0 ? "" : form.posts}
                onFocus={(e) => {
                  if (form.posts === 0) e.target.select();
                }}
                onChange={(e) => {
                  const val = e.target.value;
                  setForm({ ...form, posts: val === "" ? 0 : Math.max(0, Number(val) || 0) });
                }}
              />
            </div>

            {/* Verifikasi followers jika berubah */}
            {followersChanged && (
              <div className="sm:col-span-2 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 space-y-2">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
                  <div className="text-xs text-amber-800 dark:text-amber-300">
                    <p className="font-semibold">
                      Jumlah followers diubah ({account.followers.toLocaleString("id-ID")} → {form.followers.toLocaleString("id-ID")})
                    </p>
                    <p className="mt-0.5 text-muted-foreground">
                      Followers aktif di sistem tetap menggunakan nilai lama sampai admin menyetujui pengajuan pembaruan followers ini.
                    </p>
                  </div>
                </div>
                <div>
                  <Label className="text-xs">Bukti Screenshot Followers *</Label>
                  <label className="mt-1 flex cursor-pointer items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm hover:bg-accent">
                    <Camera className="h-4 w-4 text-muted-foreground" />
                    <span className="truncate">{proofFile ? proofFile.name : "Pilih screenshot bukti followers"}</span>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      className="hidden"
                      onChange={(e) => setProofFile(e.target.files?.[0] ?? null)}
                    />
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* Bio */}
          <div>
            <Label>Bio</Label>
            <Textarea
              rows={3}
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              placeholder="Ceritakan singkat tentang akun ini..."
            />
          </div>
        </div>

        {/* Tombol: [Batal] [Kirim Pembaruan] */}
        <DialogFooter className="flex items-center justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={onClose} disabled={saving}>
            Batal
          </Button>
          <Button
            type="button"
            className="gradient-brand text-brand-foreground"
            disabled={saving}
            onClick={handlePreSubmit}
          >
            {saving ? "Memproses..." : "Kirim Pembaruan"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    {/* Dialog Konfirmasi Pembaruan Akun (Penjelasan Verifikasi Admin) */}
    <Dialog open={confirmOpen} onOpenChange={(o) => !o && !saving && setConfirmOpen(false)}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-amber-500" />
            Pembaruan Memerlukan Verifikasi Admin
          </DialogTitle>
          <DialogDescription>
            Konfirmasi pengajuan pembaruan data akun media sosial Anda.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-2">
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5 text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2.5">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
            <div className="space-y-1">
              <p className="font-semibold text-sm">Pembaruan Memerlukan Verifikasi Admin</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Sama seperti permintaan nonaktifkan akun, setiap perubahan data akun media sosial yang Anda kirim akan berstatus <b>Menunggu Verifikasi</b> sampai disetujui oleh Admin.
              </p>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-muted/40 p-3 text-xs space-y-1.5">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Platform:</span>
              <span className="font-semibold">{form.platform}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Username:</span>
              <span className="font-semibold">{form.username}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Nama Akun:</span>
              <span className="font-semibold">{form.accountName}</span>
            </div>
            <div className="flex justify-between items-center gap-2">
              <span className="text-muted-foreground shrink-0">Link Profil:</span>
              <span className="font-mono truncate max-w-[200px] text-right text-primary">{form.profileUrl}</span>
            </div>
            {followersChanged && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Followers Diajukan:</span>
                <span className="font-semibold text-amber-600">{form.followers.toLocaleString("id-ID")}</span>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setConfirmOpen(false)}
            disabled={saving}
          >
            Batal
          </Button>
          <Button
            type="button"
            className="gradient-brand text-brand-foreground"
            disabled={saving}
            onClick={handleExecuteUpdate}
          >
            <Send className="mr-1.5 h-4 w-4" />
            {saving ? "Mengirim..." : "Ya, Kirim Pembaruan"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </>
  );
}

/* ---------------- Form Tambah Akun Khusus Buzzer (1 Akun Aktif per Platform) ---------------- */

function BuzzerAddAccountDialog({
  existing,
  onClose,
  onSubmit,
}: {
  existing: SocialAccount[];
  onClose: () => void;
  onSubmit: (data: FormData) => boolean | Promise<boolean>;
}) {
  const [form, setForm] = useState<FormData>(() => ({
    platform: "Instagram",
    username: "",
    accountName: "",
    profileUrl: "",
    followers: 0,
    following: 0,
    posts: 0,
    category: "Lifestyle",
    bio: "",
    photoUrl: undefined,
    isActive: false,
  }));

  const onPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => setForm((s) => ({ ...s, photoUrl: reader.result as string }));
    reader.readAsDataURL(f);
  };

  const submit = async () => {
    if (!form.username.trim()) {
      toast.error("Username wajib diisi");
      return;
    }
    if (!form.accountName.trim()) {
      toast.error("Nama akun wajib diisi");
      return;
    }
    try {
      const url = form.profileUrl.trim();
      if (!url) {
        toast.error("Link profil wajib diisi");
        return;
      }
      new URL(url.startsWith("http") ? url : "https://" + url);
    } catch {
      toast.error("Link profil tidak valid");
      return;
    }
    if (form.followers < 0 || form.following < 0 || form.posts < 0) {
      toast.error("Nilai angka tidak boleh negatif");
      return;
    }

    const dup = existing.some(
      (x) => x.platform === form.platform && x.username.trim().toLowerCase() === form.username.trim().toLowerCase(),
    );
    if (dup) {
      toast.error("Akun dengan username ini sudah terdaftar pada platform yang sama");
      return;
    }

    await onSubmit({
      ...form,
      profileUrl: form.profileUrl.startsWith("http") ? form.profileUrl : "https://" + form.profileUrl,
    });
  };

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Tambah Akun Sosial Media</DialogTitle>
          <DialogDescription>
            Akun baru akan menunggu verifikasi admin sebelum aktif untuk campaign. Anda dapat menambahkan lebih dari satu akun pada platform yang sama.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Avatar className="h-16 w-16">
              {form.photoUrl && <AvatarImage src={form.photoUrl} />}
              <AvatarFallback className="gradient-brand text-brand-foreground">
                {(form.accountName || "AK").split(" ").map((n) => n[0]).join("").slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-input px-3 py-2 text-sm hover:bg-accent">
              <Camera className="h-4 w-4" /> Upload Foto
              <input type="file" accept="image/*" className="hidden" onChange={onPhoto} />
            </label>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label>Platform</Label>
              <Select
                value={form.platform}
                onValueChange={(v) => setForm({ ...form, platform: v as SocialPlatform })}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {SOCIAL_PLATFORMS.map((p) => (
                    <SelectItem key={p} value={p}>
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Kategori</Label>
              <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label>Username *</Label>
              <Input
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                placeholder="@username"
              />
            </div>
            <div>
              <Label>Nama Akun *</Label>
              <Input
                value={form.accountName}
                onChange={(e) => setForm({ ...form, accountName: e.target.value })}
                placeholder="Nama tampilan"
              />
            </div>
            <div className="sm:col-span-2">
              <Label>Link Profil *</Label>
              <Input
                value={form.profileUrl}
                onChange={(e) => setForm({ ...form, profileUrl: e.target.value })}
                placeholder="https://instagram.com/username"
              />
            </div>
            <div>
              <Label>Followers</Label>
              <Input
                type="number"
                min={0}
                placeholder="0"
                value={form.followers === 0 ? "" : form.followers}
                onFocus={(e) => {
                  if (form.followers === 0) e.target.select();
                }}
                onChange={(e) => {
                  const val = e.target.value;
                  setForm({ ...form, followers: val === "" ? 0 : Math.max(0, Number(val) || 0) });
                }}
              />
            </div>
            <div>
              <Label>Following</Label>
              <Input
                type="number"
                min={0}
                placeholder="0"
                value={form.following === 0 ? "" : form.following}
                onFocus={(e) => {
                  if (form.following === 0) e.target.select();
                }}
                onChange={(e) => {
                  const val = e.target.value;
                  setForm({ ...form, following: val === "" ? 0 : Math.max(0, Number(val) || 0) });
                }}
              />
            </div>
            <div className="sm:col-span-2 sm:w-1/2 sm:pr-1.5">
              <Label>Postingan</Label>
              <Input
                type="number"
                min={0}
                placeholder="0"
                value={form.posts === 0 ? "" : form.posts}
                onFocus={(e) => {
                  if (form.posts === 0) e.target.select();
                }}
                onChange={(e) => {
                  const val = e.target.value;
                  setForm({ ...form, posts: val === "" ? 0 : Math.max(0, Number(val) || 0) });
                }}
              />
            </div>
          </div>
          <div>
            <Label>Bio</Label>
            <Textarea
              rows={3}
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              placeholder="Ceritakan singkat tentang akun ini..."
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Batal</Button>
          <Button
            className="gradient-brand text-brand-foreground"
            onClick={submit}
          >
            Tambah Akun
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}



/* ---------------- Form Dialog ---------------- */

type FormData = Omit<SocialAccount, "id" | "createdAt" | "updatedAt" | "verification">;

function emptyForm(): FormData {
  return {
    platform: "Instagram", username: "", accountName: "", profileUrl: "",
    followers: 0, following: 0, posts: 0, category: "Lifestyle",
    bio: "", photoUrl: undefined, isActive: true,
  };
}

export function AccountFormDialog({
  initial, existing, onClose, onSubmit, onDelete,
}: {
  initial?: SocialAccount;
  existing: SocialAccount[];
  onClose: () => void;
  onSubmit: (data: FormData) => boolean | Promise<boolean>;
  onDelete?: () => void;
}) {
  const [form, setForm] = useState<FormData>(() => initial ? {
    platform: initial.platform, username: initial.username, accountName: initial.accountName,
    profileUrl: initial.profileUrl, followers: initial.followers, following: initial.following,
    posts: initial.posts, category: initial.category, bio: initial.bio,
    photoUrl: initial.photoUrl, isActive: initial.isActive,
  } : emptyForm());

  const onPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => setForm((s) => ({ ...s, photoUrl: reader.result as string }));
    reader.readAsDataURL(f);
  };

  const submit = async () => {
    if (!form.username.trim()) { toast.error("Username wajib diisi"); return; }
    if (!form.accountName.trim()) { toast.error("Nama akun wajib diisi"); return; }
    try {
      const url = form.profileUrl.trim();
      if (!url) { toast.error("Link profil wajib diisi"); return; }
      new URL(url.startsWith("http") ? url : "https://" + url);
    } catch { toast.error("Link profil tidak valid"); return; }
    if (form.followers < 0 || form.following < 0 || form.posts < 0) {
      toast.error("Nilai tidak boleh negatif"); return;
    }
    if (!initial) {
      const dup = existing.some((x) => x.platform === form.platform && x.username.trim().toLowerCase() === form.username.trim().toLowerCase());
      if (dup) { toast.error("Akun ini sudah terdaftar pada platform yang sama"); return; }
    }
    await onSubmit({ ...form, profileUrl: form.profileUrl.startsWith("http") ? form.profileUrl : "https://" + form.profileUrl });
  };

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{initial ? "Edit Akun" : "Tambah Akun Sosial Media"}</DialogTitle>
          <DialogDescription>Akun baru akan menunggu verifikasi admin sebelum aktif untuk campaign.</DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Avatar className="h-16 w-16">
              {form.photoUrl && <AvatarImage src={form.photoUrl} />}
              <AvatarFallback className="gradient-brand text-brand-foreground">
                {(form.accountName || "AK").split(" ").map((n) => n[0]).join("").slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-input px-3 py-2 text-sm hover:bg-accent">
              <Camera className="h-4 w-4" /> Upload Foto
              <input type="file" accept="image/*" className="hidden" onChange={onPhoto} />
            </label>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label>Platform</Label>
              <Select value={form.platform} onValueChange={(v) => setForm({ ...form, platform: v as SocialPlatform })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{SOCIAL_PLATFORMS.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label>Kategori</Label>
              <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div><Label>Username *</Label><Input value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} placeholder="@username" /></div>
            <div><Label>Nama Akun *</Label><Input value={form.accountName} onChange={(e) => setForm({ ...form, accountName: e.target.value })} placeholder="Nama tampilan" /></div>
            <div className="sm:col-span-2"><Label>Link Profil *</Label><Input value={form.profileUrl} onChange={(e) => setForm({ ...form, profileUrl: e.target.value })} placeholder="https://instagram.com/username" /></div>
            <div>
              <Label>Followers</Label>
              <Input
                type="number"
                min={0}
                placeholder="0"
                value={form.followers === 0 ? "" : form.followers}
                onFocus={(e) => {
                  if (form.followers === 0) e.target.select();
                }}
                onChange={(e) => {
                  const val = e.target.value;
                  setForm({ ...form, followers: val === "" ? 0 : Math.max(0, Number(val) || 0) });
                }}
              />
            </div>
            <div>
              <Label>Following</Label>
              <Input
                type="number"
                min={0}
                placeholder="0"
                value={form.following === 0 ? "" : form.following}
                onFocus={(e) => {
                  if (form.following === 0) e.target.select();
                }}
                onChange={(e) => {
                  const val = e.target.value;
                  setForm({ ...form, following: val === "" ? 0 : Math.max(0, Number(val) || 0) });
                }}
              />
            </div>
            <div>
              <Label>Postingan</Label>
              <Input
                type="number"
                min={0}
                placeholder="0"
                value={form.posts === 0 ? "" : form.posts}
                onFocus={(e) => {
                  if (form.posts === 0) e.target.select();
                }}
                onChange={(e) => {
                  const val = e.target.value;
                  setForm({ ...form, posts: val === "" ? 0 : Math.max(0, Number(val) || 0) });
                }}
              />
            </div>
            <div className="flex items-end gap-3 rounded-md border border-input px-3 py-2">
              <div className="flex-1"><Label className="text-xs">Status Aktif</Label><p className="text-xs text-muted-foreground">Ikut serta di campaign?</p></div>
              <Switch checked={form.isActive} onCheckedChange={(v) => setForm({ ...form, isActive: v })} />
            </div>
          </div>
          <div><Label>Bio</Label><Textarea rows={3} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} placeholder="Ceritakan singkat tentang akun ini..." /></div>
        </div>
        <DialogFooter className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-between">
          {initial && onDelete ? (
            <Button
              type="button"
              variant="destructive"
              className="h-9 w-9 p-0 sm:mr-auto"
              title="Hapus Akun"
              aria-label="Hapus Akun"
              onClick={onDelete}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          ) : <div />}
          <div className="flex items-center justify-end gap-2">
            <Button variant="outline" onClick={onClose}>Batal</Button>
            <Button className="gradient-brand text-brand-foreground" onClick={submit}>
              {initial ? "Simpan Perubahan" : "Tambah Akun"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ---------------- helpers ---------------- */

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-sm font-bold leading-tight">{value}</p>
      <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</p>
    </div>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[110px_minmax(0,1fr)] items-start gap-2 border-b border-border pb-2 last:border-none">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <div className="text-sm">{value}</div>
    </div>
  );
}

export function VerifBadge({ s }: { s: VerificationStatus }) {
  const cfg = {
    "Terverifikasi": { c: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300", i: <CheckCircle2 className="h-3 w-3" /> },
    "Menunggu": { c: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300", i: <Clock className="h-3 w-3" /> },
    "Ditolak": { c: "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300", i: <XCircle className="h-3 w-3" /> },
  }[s];
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold", cfg.c)}>
      {cfg.i} {s}
    </span>
  );
}

function compact(n: number) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
  return n.toString();
}
