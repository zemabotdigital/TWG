import type { ReactNode } from "react";
import { SacredRule } from "./ui";

export function PageHeader({
  eyebrow,
  title,
  lead,
  children,
}: {
  eyebrow?: string;
  title: ReactNode;
  lead?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <header className="relative overflow-hidden border-b border-line">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_70%_80%_at_50%_-20%,var(--color-clay-300)_0%,transparent_65%)] opacity-55 dark:opacity-20"
      />
      <div className="container-page py-16 text-center md:py-20">
        {eyebrow ? <p className="eyebrow justify-center">{eyebrow}</p> : null}
        <h1 className="mx-auto mt-4 max-w-3xl text-4xl leading-[1.12] text-content md:text-5xl lg:text-[3.5rem]">
          {title}
        </h1>
        {lead ? (
          <p className="mx-auto mt-6 max-w-2xl text-[1.0625rem] leading-relaxed text-content-muted">
            {lead}
          </p>
        ) : null}
        <SacredRule className="mx-auto mt-9 max-w-[10rem]" />
        {children ? <div className="mt-8">{children}</div> : null}
      </div>
    </header>
  );
}
