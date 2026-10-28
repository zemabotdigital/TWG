import Link from "next/link";
import { ArrowUpRight, CalendarDays, Clock, MapPin, Users, Video } from "lucide-react";
import type { Event, Yatra } from "@/content/catalogue";
import { Badge, Card } from "./ui";
import { BookButton } from "./book-button";
import { routeForSlug } from "@/content/cta-routes";
import { ImageSlot } from "./image-slot";
import { daysUntil, formatDate, formatDateRange, formatTime } from "@/lib/format";
import { yatraStatusMeta } from "@/lib/status";

export function YatraCard({
  yatra,
  seatsLeft,
  featured = false,
}: {
  yatra: Yatra;
  seatsLeft: number;
  featured?: boolean;
}) {
  const meta = yatraStatusMeta[yatra.status];
  const countdown = daysUntil(yatra.departureDate);

  return (
    <Card
      as="article" className={`group relative flex flex-col overflow-hidden transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lift ${
featured ? "lg:flex-row" : ""
      }`}
    >
      <ImageSlot
        alt={yatra.title}
        src={yatra.coverImage}
        label={featured ? "Pashupatinath — /public/images/pashupatinath.jpg" : undefined}
        sizes={featured ? "(min-width: 1024px) 44rem, 100vw" : "(min-width: 768px) 24rem, 100vw"}
        className={featured ? "aspect-16/10 lg:aspect-auto lg:w-[46%]" : "aspect-16/10"}
      />

      <div className="flex flex-1 flex-col p-6 md:p-7">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone={meta.tone}>{meta.label}</Badge>
          {countdown > 0 ? (
            <span className="text-xs text-content-subtle">in {countdown} days</span>
          ) : null}
        </div>

        <h3
          className={`mt-4 leading-snug text-content ${featured ? "text-2xl md:text-3xl" : "text-xl"}`}
        >
          <Link href={`/yatra/${yatra.slug}`} className="after:absolute after:inset-0">
            {yatra.title}
          </Link>
        </h3>

        <p className="mt-3 text-sm leading-relaxed text-content-muted">{yatra.summary}</p>

        <dl className="mt-6 grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
          <Detail icon={CalendarDays} label="Dates">
            {formatDateRange(yatra.departureDate, yatra.returnDate)}
          </Detail>
          <Detail icon={MapPin} label="From">
            {yatra.departureCity}
          </Detail>
          <Detail icon={Clock} label="Duration">
            {yatra.durationNights} nights
          </Detail>
          <Detail icon={Users} label="Seats">
            {meta.open ? (
              seatsLeft > 0 ? (
                <span className={seatsLeft <= 5 ? "font-medium text-accent" : undefined}>
                  {seatsLeft} of {yatra.seatsTotal} left
                </span>
              ) : (
                "Waitlist only"
              )
            ) : (
              `${yatra.seatsTotal} total`
            )}
          </Detail>
        </dl>

        {meta.open ? (
          <div className="relative z-10 mt-5">
            <BookButton
              route={routeForSlug(yatra.slug) ?? "general"}
              context={`${yatra.title} · ${formatDateRange(yatra.departureDate, yatra.returnDate)}`}
              sourcePage={`/yatra/${yatra.slug}`}
              size="sm"
              className="w-full"
            />
          </div>
        ) : null}

        <div className="mt-5 flex items-end justify-between gap-4 border-t border-line pt-5">
          <div>
            <p className="text-sm leading-relaxed text-content-muted">
              Places arranged individually
            </p>
          </div>
          <span className="relative z-10 inline-flex items-center gap-1.5 text-sm font-medium text-accent">
            {meta.open ? "See full details" : "View details"}
            <ArrowUpRight
              className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden
            />
          </span>
        </div>
      </div>
    </Card>
  );
}

export function EventCard({ event }: { event: Event }) {
  const date = new Date(event.startsAt);

  return (
    <Card
      as="article" className="group relative flex gap-5 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lift md:p-6"
    >
      <div className="flex size-16 shrink-0 flex-col items-center justify-center border border-line bg-surface-sunken">
        <span className="font-display text-2xl leading-none text-accent">
          {date.toLocaleDateString("en-IN", { day: "numeric", timeZone: "Asia/Kolkata" })}
        </span>
        <span className="mt-1 text-[0.625rem] font-semibold tracking-wider text-content-subtle uppercase">
          {date.toLocaleDateString("en-IN", { month: "short", timeZone: "Asia/Kolkata" })}
        </span>
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="temple">{event.category}</Badge>
          {event.isOnline ? (
            <span className="inline-flex items-center gap-1 text-xs text-content-subtle">
              <Video className="size-3.5" aria-hidden />
              Online
            </span>
          ) : null}
        </div>

        <h3 className="mt-2.5 text-lg leading-snug text-content">
          <Link href={`/events/${event.slug}`} className="after:absolute after:inset-0">
            {event.title}
          </Link>
        </h3>

        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-content-muted">
          {event.summary}
        </p>

        <div className="relative z-10 mt-4">
          <BookButton
            route="general"
            label="Book My Space"
            context={`${event.title} · ${formatDate(event.startsAt)}`}
            sourcePage={`/events/${event.slug}`}
            size="sm"
          />
        </div>

        <p className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-content-subtle">
          <span className="inline-flex items-center gap-1.5">
            <Clock className="size-3.5" aria-hidden />
            {formatTime(event.startsAt)}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="size-3.5" aria-hidden />
            {event.isOnline ? "Online" : event.venueName}
          </span>
          <span>{formatDate(event.startsAt)}</span>
        </p>
      </div>
    </Card>
  );
}

function Detail({
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
      <dd className="mt-0.5 text-content">{children}</dd>
    </div>
  );
}
