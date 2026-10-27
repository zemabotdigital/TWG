import type { ReactNode } from "react";
import { Badge, Card, cn } from "../ui";

export function AdminHeading({
  title,
  lead,
  action,
}: {
  title: string;
  lead?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="font-display text-3xl text-content">{title}</h1>
        {lead ? (
          <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-content-muted">{lead}</p>
        ) : null}
      </div>
      {action}
    </div>
  );
}

export function StatCard({
  label,
  value,
  hint,
  tone = "neutral",
}: {
  label: string;
  value: string | number;
  hint?: string;
  tone?: "neutral" | "accent" | "amber";
}) {
  return (
    <Card className="p-5">
      <p className="text-[0.6875rem] tracking-wide text-content-subtle uppercase">{label}</p>
      <p
        className={cn(
"mt-2 font-display text-3xl",
          tone === "accent" ? "text-accent" : tone === "amber" ? "text-amber-600" : "text-content",
        )}
      >
        {value}
      </p>
      {hint ? <p className="mt-1 text-xs text-content-subtle">{hint}</p> : null}
    </Card>
  );
}

/** Horizontal-scrolling wrapper so wide tables never break the layout. */
export function TableWrap({ children }: { children: ReactNode }) {
  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">{children}</div>
    </Card>
  );
}

export function Th({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <th
      scope="col" className={cn(
"px-4 py-3 text-left text-[0.6875rem] font-semibold tracking-wide whitespace-nowrap text-content-subtle uppercase",
        className,
      )}
    >
      {children}
    </th>
  );
}

export function Td({ children, className }: { children: ReactNode; className?: string }) {
  return <td className={cn("px-4 py-3 align-top text-sm text-content", className)}>{children}</td>;
}

export function StatusBadge({
  label,
  tone,
}: {
  label: string;
  tone: "neutral" | "accent" | "temple" | "green" | "amber" | "red" | "blue";
}) {
  return <Badge tone={tone}>{label}</Badge>;
}

export function SavedBanner({ show, text }: { show: boolean; text: string }) {
  if (!show) return null;
  return (
    <div
      role="status" className="mb-6 border border-emerald-600/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-800 dark:text-emerald-300"
    >
      {text}
    </div>
  );
}

export function AdminEmpty({ title, body }: { title: string; body: string }) {
  return (
    <Card className="px-6 py-14 text-center">
      <p className="font-display text-xl text-content">{title}</p>
      <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-content-muted">{body}</p>
    </Card>
  );
}
