"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, ShoppingBag, X } from "lucide-react";
import { mainNav, site } from "@/content/site";
import { ButtonLink, cn } from "./ui";
import { BrandMark } from "./brand-logo";

export function SiteHeader({ storeUrl }: { storeUrl: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile sheet whenever the route changes.
  useEffect(() => setOpen(false), [pathname]);

  // Lock body scroll while the mobile sheet is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
"sticky top-0 z-50 transition-all duration-300",
        scrolled
          ? "border-b border-line bg-surface/85 backdrop-blur-md"
          : "border-b border-transparent",
      )}
    >
      <div className="container-page flex h-18 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-3" aria-label={`${site.name} home`}>
          <BrandMark className="size-10" />
          <span className="flex flex-col leading-none">
            <span className="font-display text-[1.3rem] font-semibold tracking-tight text-content">
              Travel With Guru
            </span>
            <span className="mt-1 text-[0.625rem] font-medium tracking-[0.2em] text-content-subtle uppercase">
              Walk the Path of Wisdom
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
          {mainNav.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
"rounded-full px-3.5 py-2 text-sm font-medium transition-colors",
                  active
                    ? "text-accent"
                    : "text-content-muted hover:bg-surface-sunken hover:text-content",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          {storeUrl ? (
            <a
              href={storeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden items-center gap-2 border-[3px] border-plum-800 bg-plum-800 px-5 py-2.5 text-[0.8125rem] font-bold text-white transition-colors hover:border-accent hover:bg-accent sm:inline-flex dark:border-accent dark:bg-accent dark:text-on-accent"
            >
              <ShoppingBag className="size-4" aria-hidden />
              Store
            </a>
          ) : (
            <ButtonLink href="/contact" size="sm" className="hidden sm:inline-flex">
              <ShoppingBag className="size-4" aria-hidden />
              Store
            </ButtonLink>
          )}
          <button
            type="button" onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav" aria-label={open ? "Close menu" : "Open menu"}
            className="inline-flex size-10 items-center justify-center rounded-full text-content lg:hidden"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {open ? (
        <div id="mobile-nav" className="border-t border-line bg-surface lg:hidden">
          <nav className="container-page flex flex-col py-4" aria-label="Mobile">
            {mainNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="border-b border-line/60 py-3.5 font-display text-lg text-content last:border-0"
              >
                {item.label}
              </Link>
            ))}
            <ButtonLink
              href={storeUrl || "/contact"}
              className="mt-5 w-full"
              {...(storeUrl ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            >
              <ShoppingBag className="size-4" aria-hidden />
              Store
            </ButtonLink>
          </nav>
        </div>
      ) : null}
    </header>
  );
}

