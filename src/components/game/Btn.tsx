import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Variant = "hero" | "regal" | "ghost" | "danger" | "quiet";

export function Btn({
  variant = "regal",
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  const base =
    "relative inline-flex items-center justify-center gap-2 rounded-md px-5 py-2.5 font-display text-xs sm:text-sm tracking-[0.18em] uppercase transition-all duration-300 disabled:pointer-events-none disabled:opacity-45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/70";
  const variants: Record<Variant, string> = {
    hero: "border border-accent/50 bg-gradient-to-b from-primary to-primary/70 text-primary-foreground shadow-[0_16px_40px_-16px_oklch(0.5_0.2_30/0.9)] hover:from-primary/90 hover:to-primary/60 hover:shadow-[0_20px_54px_-14px_oklch(0.6_0.22_35/0.95)] hover:-translate-y-0.5",
    regal:
      "border border-accent/35 bg-secondary/70 text-foreground hover:border-accent/70 hover:bg-secondary hover:text-accent",
    ghost: "border border-border/70 bg-transparent text-muted-foreground hover:border-accent/50 hover:text-accent",
    danger:
      "border border-destructive/60 bg-destructive/25 text-destructive-foreground hover:bg-destructive/40",
    quiet: "px-3 py-1.5 text-[11px] border border-border/60 bg-card/60 text-muted-foreground hover:text-accent hover:border-accent/50",
  };
  return <button className={cn(base, variants[variant], className)} {...props} />;
}
