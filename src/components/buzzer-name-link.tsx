import { useState } from "react";
import { cn } from "@/lib/utils";
import { BuzzerProfileDialog } from "./buzzer-profile-dialog";

export function BuzzerNameLink({
  name,
  email,
  className,
  variant = "default",
}: {
  name: string;
  email: string;
  className?: string;
  variant?: "default" | "hover-primary" | "muted";
}) {
  const [open, setOpen] = useState(false);
  
  const variants = {
    default: "text-foreground hover:text-primary transition-colors",
    "hover-primary": "group-hover:text-primary transition-colors",
    muted: "text-muted-foreground hover:text-foreground transition-colors",
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(variants[variant], "block max-w-full font-medium underline-offset-2 hover:underline text-left", className)}
        title={`Lihat profil ${name}`}
      >
        {name}
      </button>
      {open && (
        <BuzzerProfileDialog email={email} open={open} onOpenChange={setOpen} />
      )}
    </>
  );
}
