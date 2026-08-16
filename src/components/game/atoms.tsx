import { type ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { Dragon, House } from "@/game/data";

export function Embers({ count = 26 }: { count?: number }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {Array.from({ length: count }).map((_, i) => {
        const left = (i * 37) % 100;
        const size = 2 + ((i * 7) % 4);
        const dur = 9 + ((i * 13) % 12);
        const delay = (i * 1.7) % 14;
        return (
          <span
            key={i}
            className="absolute bottom-0 rounded-full"
            style={{
              left: `${left}%`,
              width: size,
              height: size,
              background: i % 3 === 0 ? "var(--gold)" : "var(--ember)",
              opacity: 0,
              filter: "blur(0.5px)",
              boxShadow: "0 0 8px currentColor",
              animation: `ember-rise ${dur}s linear ${delay}s infinite`,
            }}
          />
        );
      })}
    </div>
  );
}

export function Smoke() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden opacity-60"
      style={{
        background:
          "radial-gradient(60% 40% at 50% 100%, oklch(0.4 0.05 40 / 0.4), transparent 70%), radial-gradient(40% 30% at 15% 90%, oklch(0.35 0.08 30 / 0.35), transparent 70%)",
      }}
    />
  );
}

export function HouseSigil({
  house,
  className,
}: {
  house: House;
  className?: string;
}) {
  const c = house.hue;
  const a = house.accent;
  return (
    <svg viewBox="0 0 100 110" className={cn("h-16 w-16", className)} role="img" aria-label={`${house.name} sigil`}>
      <defs>
        <linearGradient id={`sg-${house.id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={a} />
          <stop offset="100%" stopColor={c} />
        </linearGradient>
      </defs>
      <path
        d="M50 4 L92 18 V58 C92 84 72 98 50 106 C28 98 8 84 8 58 V18 Z"
        fill="oklch(0.18 0.02 40)"
        stroke={a}
        strokeOpacity="0.5"
        strokeWidth="2"
      />
      <g fill={`url(#sg-${house.id})`} stroke={a} strokeWidth="1.2" strokeLinejoin="round">
        {house.id === "valeron" && (
          <>
            <path d="M28 62 L34 40 L42 52 L50 30 L58 52 L66 40 L72 62 Z" />
            <path d="M50 22 C56 34 44 34 50 46 C58 36 62 26 50 22 Z" fill={a} />
            <rect x="28" y="64" width="44" height="6" rx="2" />
          </>
        )}
        {house.id === "draven" && (
          <>
            <path d="M24 34 L36 46 L50 40 L64 46 L76 34 L72 62 C72 76 62 84 50 88 C38 84 28 76 28 62 Z" />
            <path d="M40 54 L46 58 L40 62 Z" fill="oklch(0.12 0 0)" stroke="none" />
            <path d="M60 54 L54 58 L60 62 Z" fill="oklch(0.12 0 0)" stroke="none" />
            <path d="M44 70 L50 78 L56 70 Z" fill="oklch(0.12 0 0)" stroke="none" />
          </>
        )}
        {house.id === "aeloria" && (
          <>
            <path d="M62 24 A28 28 0 1 0 62 84 A22 22 0 1 1 62 24 Z" />
            <path d="M66 46 L69 55 L78 58 L69 61 L66 70 L63 61 L54 58 L63 55 Z" fill={a} />
          </>
        )}
        {house.id === "kaelthorn" && (
          <>
            <path d="M54 20 L34 58 H48 L42 88 L70 48 H54 L60 20 Z" />
            <path d="M22 76 C32 68 40 84 50 76 C60 68 68 84 78 76" fill="none" stroke={a} strokeWidth="3" />
          </>
        )}
        {house.id === "veyr" && (
          <>
            <path d="M18 58 C30 38 70 38 82 58 C70 78 30 78 18 58 Z" />
            <circle cx="50" cy="58" r="11" fill="oklch(0.12 0 0)" stroke="none" />
            <circle cx="50" cy="58" r="5" fill={a} stroke="none" />
            <path d="M34 30 h8 v-8 h6 v8 h8 v6 h-22 z" fill={a} />
          </>
        )}
      </g>
    </svg>
  );
}

export function DragonPortrait({
  dragon,
  className,
  large,
}: {
  dragon: Dragon;
  className?: string;
  large?: boolean;
}) {
  const i = dragon.name.length % 4;
  return (
    <svg
      viewBox="0 0 200 140"
      className={cn("w-full", large ? "animate-glow" : "", className)}
      role="img"
      aria-label={`${dragon.name}, ${dragon.element} dragon`}
    >
      <defs>
        <linearGradient id={`db-${dragon.id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={dragon.wing} />
          <stop offset="100%" stopColor={dragon.body} />
        </linearGradient>
        <radialGradient id={`dg-${dragon.id}`} cx="0.5" cy="0.5">
          <stop offset="0%" stopColor={dragon.wing} stopOpacity="0.5" />
          <stop offset="100%" stopColor={dragon.body} stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="100" cy="72" rx="92" ry="58" fill={`url(#dg-${dragon.id})`} />
      {/* wings */}
      <path
        d={
          i === 0
            ? "M96 62 C70 20 30 14 12 34 C34 40 44 58 52 78 C68 74 84 70 96 62 Z"
            : i === 1
              ? "M96 62 C74 26 34 8 8 28 C30 44 30 66 44 86 C64 78 82 72 96 62 Z"
              : i === 2
                ? "M96 62 C78 18 40 10 16 26 C36 46 32 62 50 82 C66 76 84 70 96 62 Z"
                : "M96 62 C68 30 26 20 6 42 C32 46 40 62 48 84 C66 76 84 70 96 62 Z"
        }
        fill={`url(#db-${dragon.id})`}
        opacity="0.92"
      />
      <path
        d="M104 62 C130 24 172 18 190 40 C166 46 156 62 148 82 C132 76 116 70 104 62 Z"
        fill={`url(#db-${dragon.id})`}
        opacity="0.75"
      />
      {/* body */}
      <path
        d="M78 66 C88 56 116 54 128 66 C140 78 132 100 112 108 C122 116 132 118 142 116 C126 130 100 128 86 114 C74 102 68 82 78 66 Z"
        fill={dragon.body}
      />
      {/* tail */}
      <path
        d="M86 112 C64 122 44 116 26 126 C48 132 66 134 88 124 Z"
        fill={dragon.body}
        opacity="0.9"
      />
      {/* neck + head */}
      <path
        d="M120 62 C122 44 112 30 96 22 C104 16 120 16 132 26 C144 36 146 52 140 68 Z"
        fill={dragon.body}
      />
      <path
        d={
          i % 2 === 0
            ? "M96 22 C84 20 74 12 66 14 C72 22 78 30 92 32 Z"
            : "M96 22 C86 16 72 14 62 8 C68 20 76 30 92 32 Z"
        }
        fill={dragon.wing}
      />
      {/* horns */}
      <path d="M116 20 L110 4 L124 16 Z" fill={dragon.wing} />
      <path d="M130 22 L132 6 L140 20 Z" fill={dragon.wing} />
      {/* spine ridge */}
      {Array.from({ length: 5 }).map((_, k) => (
        <path
          key={k}
          d={`M${92 + k * 9} ${74 + k * 6} l5 -9 l4 9 z`}
          fill={dragon.wing}
          opacity="0.8"
        />
      ))}
      <circle cx="108" cy="26" r="3.4" fill={dragon.eye} />
      <circle cx="108" cy="26" r="1.3" fill="oklch(0.12 0 0)" />
    </svg>
  );
}

export function Meter({
  label,
  value,
  max = 100,
  color = "var(--gold)",
}: {
  label?: string;
  value: number;
  max?: number;
  color?: string;
}) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div className="w-full">
      {label && (
        <div className="mb-1 flex items-baseline justify-between text-[11px] tracking-wide text-muted-foreground uppercase">
          <span>{label}</span>
          <span className="text-foreground/80">{Math.round(value)}</span>
        </div>
      )}
      <div className="h-2 w-full overflow-hidden rounded-full bg-secondary/70 ring-1 ring-border/70">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${color}, oklch(0.85 0.1 85))` }}
        />
      </div>
    </div>
  );
}

export function Stat({
  label,
  value,
  icon,
}: {
  label: string;
  value: ReactNode;
  icon?: ReactNode;
}) {
  return (
    <div className="panel flex items-center gap-2 px-3 py-2">
      {icon && <span className="text-accent">{icon}</span>}
      <div className="leading-tight">
        <div className="text-[10px] tracking-widest text-muted-foreground uppercase">{label}</div>
        <div className="font-display text-sm text-foreground">{value}</div>
      </div>
    </div>
  );
}

export function Ornament({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center justify-center gap-3", className)} aria-hidden>
      <span className="rule-gold w-16 sm:w-28" />
      <svg viewBox="0 0 24 24" className="h-3 w-3 text-accent">
        <path d="M12 2 L15 9 L22 12 L15 15 L12 22 L9 15 L2 12 L9 9 Z" fill="currentColor" />
      </svg>
      <span className="rule-gold w-16 sm:w-28" />
    </div>
  );
}

export function Chip({ children, tone = "default" }: { children: ReactNode; tone?: "default" | "gold" | "danger" | "good" }) {
  const tones = {
    default: "border-border bg-secondary/60 text-muted-foreground",
    gold: "border-accent/40 bg-accent/10 text-accent",
    danger: "border-destructive/50 bg-destructive/15 text-destructive-foreground",
    good: "border-emerald-500/40 bg-emerald-500/10 text-emerald-300",
  } as const;
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-medium tracking-widest uppercase",
        tones[tone],
      )}
    >
      {children}
    </span>
  );
}
