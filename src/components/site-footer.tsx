import { telHref } from "@/lib/format";
import Link from "next/link";
import { Mail, MapPin, Phone, ShoppingBag } from "lucide-react";
import { mainNav, site } from "@/content/site";
import { philosophy } from "@/content/guru";
import { FacebookIcon, InstagramIcon, YoutubeIcon } from "./social-icons";
import type { SiteSettings } from "@/lib/settings";
import { storeIsConfigured } from "@/lib/settings";

export function SiteFooter({ settings }: { settings: SiteSettings }) {
  const socials = [
    { href: settings.youtubeUrl, Icon: YoutubeIcon, label: "YouTube" },
    { href: settings.instagramUrl, Icon: InstagramIcon, label: "Instagram" },
    { href: settings.facebookUrl, Icon: FacebookIcon, label: "Facebook" },
  ].filter((s) => s.href.trim().length > 0);

  const addressLines = settings.contactAddress
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  return (
    <footer className="border-t border-line bg-surface-sunken">
      <div className="container-page py-16">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <p className="font-display text-2xl text-content">{site.name}</p>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-content-muted">
              {site.tagline}
            </p>
            <p className="mt-6 font-display text-xl text-accent">
              {philosophy.coreIdea.title}
            </p>
            <p className="mt-1 text-xs leading-relaxed tracking-wide text-content-subtle">
              {philosophy.coreIdea.subtitle}
            </p>

            {socials.length > 0 ? (
              <div className="mt-7 flex gap-2">
                {socials.map(({ href, Icon, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank" rel="noopener noreferrer" aria-label={label}
                    className="inline-flex size-10 items-center justify-center rounded-full border border-line-strong text-content-muted transition-colors hover:border-accent hover:text-accent"
                  >
                    <Icon className="size-4" />
                  </a>
                ))}
              </div>
            ) : null}
          </div>

          <nav aria-label="Footer">
            <p className="text-xs font-semibold tracking-[0.18em] text-content-subtle uppercase">
              Explore
            </p>
            <ul className="mt-5 space-y-3">
              {mainNav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="-my-1 inline-block py-2 text-sm text-content-muted transition-colors hover:text-accent"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              {storeIsConfigured(settings) ? (
                <li>
                  <a
                    href={settings.storeUrl}
                    target="_blank" rel="noopener noreferrer" className="-my-1 inline-flex items-center gap-1.5 py-2 text-sm text-content-muted transition-colors hover:text-accent"
                  >
                    <ShoppingBag className="size-3.5" aria-hidden />
                    {settings.storeLabel || "Store"}
                  </a>
                </li>
              ) : null}
            </ul>
          </nav>

          <div>
            <p className="text-xs font-semibold tracking-[0.18em] text-content-subtle uppercase">
              Reach the mission
            </p>
            <ul className="mt-5 space-y-3.5 text-sm text-content-muted">
              {settings.contactPhone ? (
                <li className="flex items-start gap-2.5">
                  <Phone className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden />
                  <a href={telHref(settings.contactPhone)} className="hover:text-accent">
                    {settings.contactPhone}
                  </a>
                </li>
              ) : null}
              {settings.contactEmail ? (
                <li className="flex items-start gap-2.5">
                  <Mail className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden />
                  <a
                    href={`mailto:${settings.contactEmail}`}
                    className="break-all hover:text-accent"
                  >
                    {settings.contactEmail}
                  </a>
                </li>
              ) : null}
              {addressLines.length > 0 ? (
                <li className="flex items-start gap-2.5">
                  <MapPin className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden />
                  <span className="leading-relaxed">
                    {addressLines.map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
                  </span>
                </li>
              ) : null}
              {!settings.contactPhone && !settings.contactEmail && addressLines.length === 0 ? (
                <li className="text-content-subtle">
                  Add your contact details in the dashboard under Settings.
                </li>
              ) : null}
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-line pt-7 text-xs text-content-subtle sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {site.name}. Founded by Dr Sujin JaiGuru Maharaja, Thrissur.
          </p>
          <Link href="/admin" className="transition-colors hover:text-accent">
            Mission dashboard
          </Link>
        </div>
      </div>
    </footer>
  );
}
