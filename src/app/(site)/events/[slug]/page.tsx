import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CalendarDays, Clock, MapPin, Users, Video } from "lucide-react";
import { eventSeatsLeft, getEventBySlug } from "@/lib/queries";
import { Badge, Card, Section } from "@/components/ui";
import { BookButton } from "@/components/book-button";
import { formatDate, formatTime, toParagraphs } from "@/lib/format";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  if (!event) return { title: "Event not found" };
  return { title: event.title, description: event.summary };
}

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  if (!event) notFound();

  const seatsLeft = await eventSeatsLeft(event.id, event.capacity);
  const isPast = new Date(event.startsAt) < new Date();
  const cancelled = event.status === "CANCELLED";

  return (
    <>
      <header className="border-b border-line bg-surface-sunken">
        <div className="container-page py-12 md:py-16">
          <Link
            href="/events" className="inline-flex items-center gap-1.5 text-sm text-content-muted transition-colors hover:text-accent"
          >
            <ArrowLeft className="size-4" aria-hidden />
            All events
          </Link>

          <div className="mt-6 flex flex-wrap items-center gap-2">
            <Badge tone="temple">{event.category}</Badge>
            {event.isOnline ? (
              <Badge tone="blue">
                <Video className="size-3" aria-hidden />
                Online
              </Badge>
            ) : null}
            {cancelled ? <Badge tone="red">Cancelled</Badge> : null}
          </div>

          <h1 className="mt-5 max-w-3xl text-4xl leading-[1.12] text-content md:text-5xl">
            {event.title}
          </h1>
          <p className="mt-5 max-w-2xl text-[1.0625rem] leading-relaxed text-content-muted">
            {event.summary}
          </p>
        </div>
      </header>

      <Section className="py-14 md:py-20">
        <div className="container-page grid gap-12 lg:grid-cols-[1fr_21rem] lg:items-start lg:gap-16">
          <div className="prose-mission min-w-0">
            {toParagraphs(event.description).map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>

          <aside className="space-y-6 lg:sticky lg:top-24">
            <Card className="p-6">
              <dl className="space-y-5">
                <Row icon={CalendarDays} label="Date">
                  {formatDate(event.startsAt)}
                </Row>
                <Row icon={Clock} label="Time">
                  {formatTime(event.startsAt)}
                  {event.endsAt ? ` – ${formatTime(event.endsAt)}` : ""}
                </Row>
                <Row icon={MapPin} label={event.isOnline ? "Where" : "Venue"}>
                  {event.isOnline ? (
                    "Online — joining link sent after registration"
                  ) : (
                    <>
                      {event.venueName}
                      {event.venueAddress ? (
                        <span className="mt-0.5 block text-xs text-content-subtle">
                          {event.venueAddress}
                        </span>
                      ) : null}
                      {event.city ? (
                        <span className="block text-xs text-content-subtle">{event.city}</span>
                      ) : null}
                    </>
                  )}
                </Row>
                {seatsLeft !== null ? (
                  <Row icon={Users} label="Seats">
                    {seatsLeft > 0
                      ? `${seatsLeft} of ${event.capacity} remaining`
                      : "Fully booked"}
                  </Row>
                ) : null}
              </dl>

              <p className="mt-6 bg-surface-sunken px-4 py-3 text-xs leading-relaxed text-content-muted">
                {event.contributionNote}
              </p>
            </Card>

            <Card className="p-6">
              {cancelled ? (
                <div className="text-center">
                  <p className="font-display text-lg text-content">This event was cancelled</p>
                  <Link
                    href="/events" className="mt-3 inline-block text-sm font-medium text-accent hover:underline"
                  >
                    See the current calendar
                  </Link>
                </div>
              ) : isPast ? (
                <div className="text-center">
                  <p className="font-display text-lg text-content">This gathering has passed</p>
                  <Link
                    href="/events" className="mt-3 inline-block text-sm font-medium text-accent hover:underline"
                  >
                    See upcoming events
                  </Link>
                </div>
              ) : (
                <div className="text-center">
                  <h3 className="font-display text-xl text-content">Book your space</h3>
                  <p className="mt-2 text-sm leading-relaxed text-content-muted">
                    {seatsLeft !== null && seatsLeft <= 0
                      ? "Every seat is spoken for, but message us and we will add you to the list in case of a cancellation."
                      : "Message the mission on WhatsApp and we will confirm your place."}
                  </p>
                  <BookButton
                    route="general"
                    label="Book My Space"
                    context={`${event.title} · ${formatDate(event.startsAt)} · ${event.isOnline ? "Online" : event.venueName}`}
                    sourcePage={`/events/${event.slug}`}
                    size="lg"
                    className="mt-5 w-full"
                  />
                </div>
              )}
            </Card>
          </aside>
        </div>
      </Section>
    </>
  );
}

function Row({
  icon: Icon,
  label,
  children,
}: {
  icon: typeof CalendarDays;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-3">
      <Icon className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden />
      <div className="min-w-0">
        <dt className="text-[0.6875rem] tracking-wide text-content-subtle uppercase">{label}</dt>
        <dd className="mt-0.5 text-sm text-content">{children}</dd>
      </div>
    </div>
  );
}
