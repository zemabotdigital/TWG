import type { Metadata } from "next";
import { EventCard } from "@/components/cards";
import { EmptyState, Section, SectionHeading } from "@/components/ui";
import { PageHeader } from "@/components/page-header";
import { getPastEvents, getUpcomingEvents } from "@/lib/queries";
import { formatDate, formatMonthYear } from "@/lib/format";
import type { Event } from "@/content/catalogue";

export const metadata: Metadata = {
  title: "Events — satsangs, discourses and observances",
  description:
    "The monthly calendar of the Travel With Guru mission: satsangs, discourses, study circles and observances in Thrissur and online. All are welcome, free of charge.",
};

/** Groups events under their month heading, preserving order. */
function byMonth(events: Event[]) {
  const groups = new Map<string, Event[]>();
  for (const event of events) {
    const key = formatMonthYear(event.startsAt);
    const list = groups.get(key);
    if (list) list.push(event);
    else groups.set(key, [event]);
  }
  return [...groups.entries()];
}

export default async function EventsPage() {
  const [upcoming, past] = await Promise.all([getUpcomingEvents(), getPastEvents(10)]);
  const grouped = byMonth(upcoming);

  return (
    <>
      <PageHeader
        eyebrow="The calendar" title="Satsangs, discourses and observances" lead="Gatherings run through every month, in Thrissur and online. Everyone is welcome whatever their faith or background, and nothing carries a fee. Registration simply helps the mission prepare."
      />

      <Section className="pt-4">
        <div className="container-page">
          {grouped.length === 0 ? (
            <EmptyState
              title="Nothing on the calendar yet" description="The coming month's satsangs and discourses will appear here as soon as they are scheduled."
            />
          ) : (
            <div className="space-y-14">
              {grouped.map(([month, events]) => (
                <section key={month}>
                  <div className="flex items-center gap-5">
                    <h2 className="font-display text-2xl text-content">{month}</h2>
                    <span className="h-px flex-1 bg-line" aria-hidden />
                    <span className="text-xs tracking-wide text-content-subtle uppercase">
                      {events.length} {events.length === 1 ? "gathering" : "gatherings"}
                    </span>
                  </div>
                  <div className="mt-7 grid gap-5 lg:grid-cols-2">
                    {events.map((event) => (
                      <EventCard key={event.id} event={event} />
                    ))}
                  </div>
                </section>
              ))}
            </div>
          )}
        </div>
      </Section>

      {past.length > 0 ? (
        <Section tone="sunken">
          <div className="container-page">
            <SectionHeading eyebrow="Behind us" title="Recently held" />
            <ul className="mt-9 divide-y divide-line overflow-hidden border border-line bg-surface-raised">
              {past.map((event) => (
                <li
                  key={event.id}
                  className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 px-6 py-4"
                >
                  <span className="text-content">{event.title}</span>
                  <span className="text-sm text-content-subtle">{formatDate(event.startsAt)}</span>
                </li>
              ))}
            </ul>
          </div>
        </Section>
      ) : null}
    </>
  );
}
