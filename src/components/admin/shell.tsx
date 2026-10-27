"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  CalendarDays,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  Menu,
  Mountain,
  Settings,
  UserRound,
  X,
} from "lucide-react";
import { cn } from "../ui";

const nav = [
  { href: "/admin", label: "Overview", Icon: LayoutDashboard, exact: true },
  { href: "/admin/yatras", label: "Nepal Yatras", Icon: Mountain },
  { href: "/admin/bookings", label: "Yatra Bookings", Icon: ClipboardList },
  { href: "/admin/events", label: "Events", Icon: CalendarDays },
  { href: "/admin/registrations", label: "Registrations", Icon: ClipboardList },
  { href: "/admin/appointments", label: "Appointments", Icon: UserRound },
  { href: "/admin/settings", label: "Settings", Icon: Settings },
];

export function AdminShell({
  name,
  signOutAction,
  children,
}: {
  name: string;
  signOutAction: () => Promise<void>;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const links = (
    <nav className="space-y-1" aria-label="Dashboard">
      {nav.map(({ href, label, Icon, exact }) => {
        const active = exact ? pathname === href : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            onClick={() => setOpen(false)}
            aria-current={active ? "page" : undefined}
            className={cn(
"flex items-center gap-3  px-3 py-2.5 text-sm font-medium transition-colors",
              active
                ? "bg-accent-soft text-accent"
                : "text-content-muted hover:bg-surface-sunken hover:text-content",
            )}
          >
            <Icon className="size-4 shrink-0" aria-hidden />
            {label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-dvh bg-surface-sunken">
      <header className="sticky top-0 z-40 border-b border-line bg-surface-raised">
        <div className="flex h-16 items-center justify-between gap-4 px-4 md:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button" onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-label={open ? "Close menu" : "Open menu"}
              className="inline-flex size-9 items-center justify-center text-content lg:hidden"
            >
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
            <Link href="/admin" className="flex flex-col leading-none">
              <span className="font-display text-lg text-content">Mission Dashboard</span>
              <span className="mt-0.5 text-[0.625rem] tracking-[0.16em] text-content-subtle uppercase">
                Travel With Guru
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/" target="_blank" className="hidden text-sm text-content-muted hover:text-accent sm:block"
            >
              View site ↗
            </Link>
            <span className="hidden text-sm text-content-muted md:block">{name}</span>
            <form action={signOutAction}>
              <button
                type="submit" className="inline-flex items-center gap-1.5 rounded-full border border-line-strong px-3.5 py-1.5 text-sm text-content-muted transition-colors hover:border-accent hover:text-accent"
              >
                <LogOut className="size-3.5" aria-hidden />
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-[90rem] gap-8 px-4 py-8 md:px-6">
        <aside className="hidden w-56 shrink-0 lg:block">
          <div className="sticky top-24">{links}</div>
        </aside>

        {open ? (
          <div className="fixed inset-0 top-16 z-30 bg-surface-raised p-4 lg:hidden">{links}</div>
        ) : null}

        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
