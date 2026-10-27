import { telHref } from "@/lib/format";
import type { Metadata } from "next";
import { Mail, MapPin, MessageCircle, Phone, ShoppingBag } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Card, Section } from "@/components/ui";
import { ContactForm } from "@/components/forms/contact-form";
import { BookButton } from "@/components/book-button";
import { getSettings, storeIsConfigured } from "@/lib/settings";

export const metadata: Metadata = {
  title: "Contact the mission",
  description:
    "Reach the Travel With Guru mission in Thrissur — by phone, WhatsApp, email, or by sending a message here.",
};

export default async function ContactPage() {
  const settings = await getSettings();
  const addressLines = settings.contactAddress
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  const waDigits = settings.contactWhatsapp.replace(/\D/g, "");

  return (
    <>
      <PageHeader
        eyebrow="Reach us" title="Talk to the mission" lead="Questions about a yatra, an event, or anything else — write here and someone will come back to you. For anything urgent, please call."
      />

      <Section className="pt-6">
        <div className="container-page grid gap-12 lg:grid-cols-[1fr_20rem] lg:items-start lg:gap-16">
          <Card className="p-7 md:p-9">
            <ContactForm />
          </Card>

          <aside className="space-y-4">
            <Card className="bg-surface-sunken p-5 text-center">
              <p className="font-display text-lg text-content">Booking a programme?</p>
              <p className="mt-1.5 text-sm leading-relaxed text-content-muted">
                WhatsApp is the fastest way to reach us.
              </p>
              <BookButton route="general" label="Message us on WhatsApp" sourcePage="/contact" className="mt-4 w-full" />
            </Card>

            {settings.contactPhone ? (
              <ContactCard
                Icon={Phone}
                label="Call" value={settings.contactPhone}
                href={telHref(settings.contactPhone)}
              />
            ) : null}

            {waDigits ? (
              <ContactCard
                Icon={MessageCircle}
                label="WhatsApp" value={settings.contactWhatsapp}
                href={`https://wa.me/${waDigits}`}
                external
              />
            ) : null}

            {settings.contactEmail ? (
              <ContactCard
                Icon={Mail}
                label="Email" value={settings.contactEmail}
                href={`mailto:${settings.contactEmail}`}
              />
            ) : null}

            {addressLines.length > 0 ? (
              <Card className="flex gap-4 p-5">
                <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent">
                  <MapPin className="size-4" aria-hidden />
                </span>
                <div>
                  <p className="text-[0.6875rem] tracking-wide text-content-subtle uppercase">
                    Visit
                  </p>
                  <address className="mt-1 text-sm leading-relaxed text-content not-italic">
                    {addressLines.map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
                  </address>
                </div>
              </Card>
            ) : null}

            {!settings.contactPhone && !settings.contactEmail && addressLines.length === 0 ? (
              <Card className="p-5">
                <p className="text-sm leading-relaxed text-content-muted">
                  Contact details have not been added yet. Add them in the dashboard under
                  Settings and they will appear here and in the footer.
                </p>
              </Card>
            ) : null}

            {storeIsConfigured(settings) ? (
              <Card className="p-5">
                <span className="inline-flex size-9 items-center justify-center rounded-full bg-accent-soft text-accent">
                  <ShoppingBag className="size-4" aria-hidden />
                </span>
                <p className="mt-3 font-medium text-content">{settings.storeLabel || "Store"}</p>
                <p className="mt-1 text-sm leading-relaxed text-content-muted">
                  {settings.storeNote}
                </p>
                <a
                  href={settings.storeUrl}
                  target="_blank" rel="noopener noreferrer" className="mt-3 inline-block text-sm font-medium text-accent hover:underline"
                >
                  Open the store →
                </a>
              </Card>
            ) : null}

            {settings.donationNote ? (
              <Card className="bg-surface-sunken p-5">
                <p className="text-sm leading-relaxed text-content-muted">
                  {settings.donationNote}
                </p>
              </Card>
            ) : null}
          </aside>
        </div>
      </Section>
    </>
  );
}

function ContactCard({
  Icon,
  label,
  value,
  href,
  external,
}: {
  Icon: typeof Phone;
  label: string;
  value: string;
  href: string;
  external?: boolean;
}) {
  return (
    <Card className="p-5 transition-colors hover:border-accent/50">
      <a
        href={href}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        className="flex gap-4"
      >
        <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent">
          <Icon className="size-4" aria-hidden />
        </span>
        <span>
          <span className="block text-[0.6875rem] tracking-wide text-content-subtle uppercase">
            {label}
          </span>
          <span className="mt-0.5 block text-sm break-all text-content">{value}</span>
        </span>
      </a>
    </Card>
  );
}
