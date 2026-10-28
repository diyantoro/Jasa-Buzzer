import { LifeBuoy, MessageCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { SupportChat } from "@/components/support-chat";

type SupportMessageSectionProps = {
  role: "customer" | "buzzer";
  user: { name: string; email: string };
  active?: boolean;
  onNavigate?: (section: string) => void;
};

export function SupportMessageSection({
  role,
  user,
  active = true,
  onNavigate,
}: SupportMessageSectionProps) {
  const isCustomer = role === "customer";

  return (
    <div className="space-y-4">
      <section className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 via-background to-accent/40 p-5 shadow-sm sm:p-6">
        <div className="pointer-events-none absolute -right-10 -top-12 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl gradient-brand text-brand-foreground shadow-glow">
              <MessageCircle className="h-5 w-5" />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                Pesan Support
              </p>
              <h2 className="mt-0.5 font-display text-xl font-bold">
                Chat langsung dengan tim BuzzHub
              </h2>
              <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
                {isCustomer
                  ? "Kirim pertanyaan seputar pesanan, pembayaran, atau akun. Balasan admin muncul otomatis di sini."
                  : "Kirim pertanyaan seputar job, bukti pengerjaan, atau pencairan. Balasan admin muncul otomatis di sini."}
              </p>
            </div>
          </div>
          {onNavigate && (
            <Button
              type="button"
              variant="outline"
              className="shrink-0 bg-background/70"
              onClick={() => onNavigate("bantuan")}
            >
              <LifeBuoy className="h-4 w-4" /> Buka Bantuan & FAQ
            </Button>
          )}
        </div>
      </section>

      <SupportChat role={role} user={user} active={active} className="h-[560px] lg:h-[640px]" />
    </div>
  );
}
