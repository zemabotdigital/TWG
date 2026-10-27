import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

export function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

/* ── Button ───────────────────────────────────────────────────────── */

const buttonBase =
  "inline-flex items-center justify-center gap-2 border-[3px] font-sans font-bold " +
  "transition-colors duration-200 disabled:pointer-events-none disabled:opacity-55";

const buttonVariants = {
  primary:
    "border-plum-800 bg-plum-800 text-white hover:border-accent hover:bg-accent " +
    "dark:border-accent dark:bg-accent dark:text-on-accent dark:hover:bg-accent-hover dark:hover:border-accent-hover",
  secondary:
    "border-line-strong bg-transparent text-content hover:border-accent hover:bg-accent hover:text-on-accent",
  outline:
    "border-line-strong bg-transparent text-content hover:border-accent hover:text-accent",
  /** For use on dark sections. */
  inverse:
    "border-white bg-transparent text-white hover:border-accent hover:bg-accent hover:text-on-accent",
  ghost: "border-transparent text-content-muted hover:text-accent",
  danger:
    "border-red-700 bg-transparent text-red-700 hover:bg-red-700 hover:text-white " +
    "dark:border-red-400 dark:text-red-400 dark:hover:bg-red-500 dark:hover:text-white",
} as const;

const buttonSizes = {
  sm: "px-5 py-2.5 text-[0.8125rem]",
  md: "px-8 py-3.5 text-[0.9375rem]",
  lg: "px-12 py-5 text-base",
} as const;

type ButtonStyleProps = {
  variant?: keyof typeof buttonVariants;
  size?: keyof typeof buttonSizes;
};

export function buttonClass({ variant = "primary", size = "md" }: ButtonStyleProps = {}) {
  return cn(buttonBase, buttonVariants[variant], buttonSizes[size]);
}

export function Button({
  variant,
  size,
  className,
  ...props
}: ComponentProps<"button"> & ButtonStyleProps) {
  return <button className={cn(buttonClass({ variant, size }), className)} {...props} />;
}

export function ButtonLink({
variant,
  size,
  className,
  ...props
}: ComponentProps<typeof Link> & ButtonStyleProps) {
  return <Link className={cn(buttonClass({ variant, size }), className)} {...props} />;
}

/* ── Layout ───────────────────────────────────────────────────────── */

export function Section({
children,
  className,
  tone = "default",
  id,
}: {
  children: ReactNode;
  className?: string;
  tone?: "default" | "sunken" | "inverse";
  id?: string;
}) {
  const tones = {
    default: "bg-surface text-content",
    sunken: "bg-surface-sunken text-content",
    inverse: "bg-surface-inverse text-content-inverse",
  };
  return (
    <section id={id} className={cn("py-20 md:py-28", tones[tone], className)}>
      {children}
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  lead,
  align = "left",
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  lead?: ReactNode;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center", className)}>
      {eyebrow ? <p className="eyebrow mb-4">{eyebrow}</p> : null}
      <h2 className="text-[1.6rem] leading-[1.15] sm:text-[2rem] md:text-[2.5rem]">{title}</h2>
      {lead ? (
        <p className="mt-5 text-[1.0625rem] leading-relaxed text-content-muted">{lead}</p>
      ) : null}
    </div>
  );
}

export function Card({
  children,
  className,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "article" | "li";
}) {
  return (
    <Tag className={cn("border border-line bg-surface-raised shadow-soft", className)}>
      {children}
    </Tag>
  );
}

/* ── Badge ────────────────────────────────────────────────────────── */

const badgeTones = {
  neutral: "border-line-strong bg-surface-sunken text-content-muted",
  accent: "border-accent/30 bg-accent-soft text-accent",
  temple: "border-ink-800/25 bg-ink-800/10 text-ink-800 dark:text-ink-200",
  green: "border-emerald-600/25 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  amber: "border-amber-600/25 bg-amber-500/10 text-amber-700 dark:text-amber-400",
  red: "border-red-600/25 bg-red-500/10 text-red-700 dark:text-red-400",
  blue: "border-sky-600/25 bg-sky-500/10 text-sky-700 dark:text-sky-400",
} as const;

export function Badge({
  children,
  tone = "neutral",
  className,
}: {
  children: ReactNode;
  tone?: keyof typeof badgeTones;
  className?: string;
}) {
  return (
    <span
      className={cn(
"inline-flex items-center gap-1.5 border px-2.5 py-1 text-[0.6875rem] font-bold tracking-[0.1em] uppercase",
        badgeTones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

/* ── Decorative rule ──────────────────────────────────────────────── */

export function SacredRule({ className }: { className?: string }) {
  return (
    <div className={cn("rule-sacred", className)} aria-hidden>
      <span className="size-1.5 rotate-45 bg-clay-400" />
    </div>
  );
}

/* ── Empty state ──────────────────────────────────────────────────── */

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="border-2 border-dashed border-line-strong px-6 py-14 text-center">
      <p className="font-display text-xl text-content">{title}</p>
      <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-content-muted">
        {description}
      </p>
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}
