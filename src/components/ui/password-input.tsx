import { Eye, EyeOff } from "lucide-react";
import { useId, useState, type ComponentProps, type ReactNode } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export interface PasswordStrength {
  score: 0 | 1 | 2 | 3 | 4;
  label: string;
  barClass: string;
  textClass: string;
  unmet: string[];
}

const STRENGTH_LEVELS: Record<number, { label: string; bar: string; text: string }> = {
  1: { label: "Lemah", bar: "bg-rose-500", text: "text-rose-600 dark:text-rose-400" },
  2: { label: "Sedang", bar: "bg-amber-500", text: "text-amber-600 dark:text-amber-400" },
  3: { label: "Kuat", bar: "bg-emerald-500", text: "text-emerald-600 dark:text-emerald-400" },
  4: {
    label: "Sangat kuat",
    bar: "bg-emerald-500",
    text: "text-emerald-600 dark:text-emerald-400",
  },
};

export function getPasswordStrength(value: string, minLength = 8): PasswordStrength {
  const checks = {
    length: value.length >= minLength,
    mixedCase: /[a-z]/.test(value) && /[A-Z]/.test(value),
    number: /\d/.test(value),
    symbol: /[^A-Za-z0-9]/.test(value),
  };
  const score = Object.values(checks).filter(Boolean).length as 0 | 1 | 2 | 3 | 4;
  const level = STRENGTH_LEVELS[score] ?? STRENGTH_LEVELS[1];
  const unmet = [
    !checks.length && `minimal ${minLength} karakter`,
    !checks.mixedCase && "huruf besar & kecil",
    !checks.number && "angka",
    !checks.symbol && "simbol",
  ].filter(Boolean) as string[];

  return { score, label: level.label, barClass: level.bar, textClass: level.text, unmet };
}

export interface PasswordInputProps extends Omit<ComponentProps<typeof Input>, "type"> {
  label?: ReactNode;
  leftIcon?: ReactNode;
  /** Tampilkan indikator kekuatan kata sandi (biasanya untuk form pendaftaran). */
  showStrength?: boolean;
  minLength?: number;
  /** Keterangan tambahan di bawah input (mis. status kecocokan ulangi sandi). */
  hint?: ReactNode;
  hintTone?: "muted" | "success" | "error";
}

const HINT_TONE: Record<"muted" | "success" | "error", string> = {
  muted: "text-muted-foreground",
  success: "text-emerald-600 dark:text-emerald-400",
  error: "text-destructive",
};

export function PasswordInput({
  label,
  leftIcon,
  showStrength = false,
  minLength = 8,
  hint,
  hintTone = "muted",
  id,
  className,
  disabled,
  ...props
}: PasswordInputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const [show, setShow] = useState(false);

  const rawValue = props.value ?? props.defaultValue;
  const value = typeof rawValue === "string" ? rawValue : "";
  const strength = getPasswordStrength(value, minLength);
  const showStrengthBar = showStrength && value.length > 0;

  return (
    <div>
      {label ? <Label htmlFor={inputId}>{label}</Label> : null}
      <div className="relative mt-1.5">
        {leftIcon ? (
          <span
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          >
            {leftIcon}
          </span>
        ) : null}
        <Input
          id={inputId}
          type={show ? "text" : "password"}
          disabled={disabled}
          className={cn(leftIcon && "pl-9", "pr-10", className)}
          {...props}
        />
        <button
          type="button"
          disabled={disabled}
          onClick={() => setShow((s) => !s)}
          onMouseDown={(e) => e.preventDefault()}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
          aria-label={show ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
          aria-pressed={show}
        >
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>

      {showStrengthBar ? (
        <div className="mt-2 space-y-1">
          <div className="flex gap-1">
            {[1, 2, 3, 4].map((step) => (
              <span
                key={step}
                className={cn(
                  "h-1 flex-1 rounded-full transition-colors",
                  step <= strength.score ? strength.barClass : "bg-muted",
                )}
              />
            ))}
          </div>
          <p className={cn("text-xs font-medium", strength.textClass)}>
            Kekuatan: {strength.label}
            {strength.unmet.length > 0 ? (
              <span className="font-normal text-muted-foreground">
                {" "}
                · Perlu {strength.unmet.join(", ")}
              </span>
            ) : null}
          </p>
        </div>
      ) : null}

      {hint ? <p className={cn("mt-1.5 text-xs", HINT_TONE[hintTone])}>{hint}</p> : null}
    </div>
  );
}
