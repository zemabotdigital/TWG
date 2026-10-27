import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CalendarDays, Check, Clock, MapPin, Minus, Plane, Users } from "lucide-react";
import { getYatraBySlug } from "@/lib/queries";
import { Badge, Card, SacredRule, Section } from "@/components/ui";
import { ImageSlot } from "@/components/image-slot";
import { BookButton } from "@/components/book-button";
import { routeForSlug } from "@/content/cta-routes";
import { yatraStatusMeta } from "@/lib/status";
import {
  daysUntil,
  formatDate,
  formatDateRange,
  parseJsonArray,
  toParagraphs,
} from "@/lib/format";

type ItineraryDay = { day: number; title: string; detail: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const result = await getYatraBySlug(slug);
  if (!result) return { title: "Programme not found" };
  return { title: result.yatra.title, description: result.yatra.summary };
}

export default async function YatraDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const result = await getYatraBySlug(slug);
  if (!result) notFound();

  const { yatra, seatsLeft } = result;
  const meta = yatraStatusMeta[yatra.status];
  const countdown = daysUntil(yatra.departureDate);
  const itinerary = parseJsonArray<ItineraryDay>(yatra.itinerary);
  const inclusions = parseJsonArray<string>(yatra.inclusions);
  const exclusions = parseJsonArray<string>(yatra.exclusions);

  /*
    Each programme routes to its own bot. A slug with no dedicated flow falls
    back to the general enquiry route — a distinct flow, never another
    programme's bot.
  */
  const route = routeForSlug(yatra.slug) ?? "general";
  const bookingContext = `${yatra.title} · ${formatDateRange(yatra.departureDate, yatra.returnDate)}`;

  return (
    <>
      <header className="border-b border-line">
        <div className="container-page grid gap-10 py-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:py-16">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone={meta.tone}>{meta.label}</Badge>
              {countdown > 0 ? (
                <span className="text-xs text-content-subtle">begins in {countdown} days</span>
              ) : null}
            </div>
            <h1 className="mt-5 text-[2rem] leading-[1.12] text-content sm:text-4xl md:text-5xl">
              {yatra.title}
            </h1>
            <p className="mt-5 max-w-xl text-[1.0625rem] leading-relaxed text-content-muted">
              {yatra.summary}
            </p>

            <dl className="mt-9 grid grid-cols-2 gap-6 border-t border-line pt-7 sm:grid-cols-4">
              <Fact icon={CalendarDays} label="Starts">
                {formatDate(yatra.departureDate)}
              </Fact>
              <Fact icon={Clock} label="Duration">
                {yatra.durationNights} {yatra.durationNights === 1 ? "night" : "nights"}
              </Fact>
              <Fact icon={Plane} label="From">
                {yatra.departureCity}
              </Fact>
              <Fact icon={Users} label="Seats">
                {meta.open ? (seatsLeft > 0 ? `${seatsLeft} left` : "Waitlist") : "Limited"}
              </Fact>
            </dl>

            <div className="mt-8">
              <BookButton route={route} context={bookingContext} sourcePage={`/yatra/${yatra.slug}`} size="lg" />
            </div>
          </div>

          <ImageSlot
            alt={yatra.title}
            src={yatra.coverImage}
            sizes="(min-width: 1024px) 38rem, 100vw"
            className="aspect-4/3 border border-line shadow-soft"
            priority
          />
        </div>
      </header>

      <Section className="py-14 md:py-20">
        <div className="container-page grid gap-12 lg:grid-cols-[1fr_22rem] lg:items-start lg:gap-16">
          <div className="min-w-0">
            <div className="prose-mission">
              {toParagraphs(yatra.description).map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>

            {itinerary.length > 0 ? (
              <section className="mt-14">
                <h2 className="text-2xl text-content md:text-3xl">Day by day</h2>
                <SacredRule className="mt-6 max-w-sm" />
                <ol className="mt-8 space-y-7">
                  {itinerary.map((day) => (
                    <li key={day.day} className="grid gap-3 sm:grid-cols-[4.5rem_1fr] sm:gap-6">
                      <p className="text-[0.6875rem] font-bold tracking-[0.16em] text-accent uppercase sm:pt-1.5">
                        Day {day.day}
                      </p>
                      <div>
                        <h3 className="text-lg leading-snug text-content">{day.title}</h3>
                        <p className="mt-1.5 text-sm leading-relaxed text-content-muted">
                          {day.detail}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              </section>
            ) : null}

            {inclusions.length > 0 || exclusions.length > 0 ? (
              <section className="mt-14 grid gap-6 sm:grid-cols-2">
                {inclusions.length > 0 ? (
                  <Card className="p-6">
                    <h3 className="text-lg text-content">What is included</h3>
                    <ul className="mt-4 space-y-2.5">
                      {inclusions.map((item) => (
                        <li key={item} className="flex gap-2.5 text-sm text-content-muted">
                          <Check
                            className="mt-1 size-4 shrink-0 text-emerald-600 dark:text-emerald-400"
                            aria-hidden
                          />
                          <span className="leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </Card>
                ) : null}
                {exclusions.length > 0 ? (
                  <Card className="p-6">
                    <h3 className="text-lg text-content">Not included</h3>
                    <ul className="mt-4 space-y-2.5">
                      {exclusions.map((item) => (
                        <li key={item} className="flex gap-2.5 text-sm text-content-muted">
                          <Minus
                            className="mt-1 size-4 shrink-0 text-content-subtle"
                            aria-hidden
                          />
                          <span className="leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </Card>
                ) : null}
              </section>
            ) : null}
          </div>

          {/* Booking rail */}
          <aside className="lg:sticky lg:top-24">
            <Card className="overflow-hidden">
              <div className="border-b border-line bg-surface-sunken px-6 py-5">
                <p className="font-display text-xl text-content">Book your space</p>
                <p className="mt-4 flex items-start gap-2 text-xs leading-relaxed text-content-muted">
                  <MapPin className="mt-0.5 size-3.5 shrink-0 text-accent" aria-hidden />
                  {yatra.destination}
                </p>
                <p className="mt-2 text-xs text-content-muted">
                  {formatDateRange(yatra.departureDate, yatra.returnDate)}
                </p>
              </div>

              <div className="p-6">
                {meta.open ? (
                  <>
                    <p className="text-sm leading-relaxed text-content-muted">
                      {yatra.status === "FULL"
                        ? "Every place is taken. Message us and we will add you to the waitlist."
                        : "Places are limited and arranged individually. Message the mission on WhatsApp and we will confirm your place and send the contribution details."}
                    </p>
                    <BookButton
                      route={route}
                      context={bookingContext}
                      sourcePage={`/yatra/${yatra.slug}`}
                      size="lg"
                      className="mt-5 w-full"
                    />
                    <p className="mt-3 text-center text-xs text-content-subtle">
                      No payment is taken online.
                    </p>
                  </>
                ) : (
                  <div className="text-center">
                    <p className="font-display text-xl text-content">{meta.label}</p>
                    <p className="mt-2 text-sm leading-relaxed text-content-muted">{meta.note}</p>
                    <Link
                      href="/yatra"
                      className="mt-5 inline-block text-sm font-medium text-accent hover:underline"
                    >
                      See other programmes
                    </Link>
                  </div>
                )}
              </div>
            </Card>
          </aside>
        </div>
      </Section>
    </>
  );
}

function Fact({
  icon: Icon,
  label,
  children,
}: {
  icon: typeof CalendarDays;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <dt className="flex items-center gap-1.5 text-[0.6875rem] tracking-wide text-content-subtle uppercase">
        <Icon className="size-3.5" aria-hidden />
        {label}
      </dt>
      <dd className="mt-1 text-sm font-medium text-content">{children}</dd>
    </div>
  );
}
