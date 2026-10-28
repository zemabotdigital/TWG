import { events, yatras, type Yatra } from "@/content/catalogue";

/**
 * Read access to the published catalogue.
 *
 * These were database queries. The site is now frontend-only, so they filter
 * the static catalogue instead. Signatures and return shapes are unchanged,
 * which is why no page or component needed editing.
 *
 * Seat counts: bookings used to be stored and tallied here. Tickets are now
 * sold on the external store, which this site cannot read, so remaining seats
 * are reported as the published capacity rather than a live figure. Nothing
 * is invented — the number shown is the stated capacity.
 */

/** Start of today in server time — events earlier today still count as upcoming. */
function startOfToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

export function seatsLeft(yatra: Yatra) {
  return yatra.seatsTotal;
}

export async function getUpcomingYatras(limit?: number) {
  const open = yatras
    .filter(
      (y) =>
        ["ANNOUNCED", "FILLING", "FULL"].includes(y.status) &&
        y.departureDate >= startOfToday(),
    )
    .sort((a, b) => a.departureDate.getTime() - b.departureDate.getTime());

  const take = limit ? open.slice(0, limit) : open;
  return take.map((yatra) => ({ yatra, seatsLeft: seatsLeft(yatra) }));
}

export async function getPastYatras(limit = 6) {
  return yatras
    .filter(
      (y) =>
        y.status !== "DRAFT" &&
        (y.status === "COMPLETED" || y.departureDate < startOfToday()),
    )
    .sort((a, b) => b.departureDate.getTime() - a.departureDate.getTime())
    .slice(0, limit);
}

export async function getYatraBySlug(slug: string) {
  const yatra = yatras.find((y) => y.slug === slug);
  if (!yatra || yatra.status === "DRAFT") return null;
  return { yatra, seatsLeft: seatsLeft(yatra) };
}

export async function getUpcomingEvents(limit?: number) {
  const open = events
    .filter((e) => e.status === "PUBLISHED" && e.startsAt >= startOfToday())
    .sort((a, b) => a.startsAt.getTime() - b.startsAt.getTime());

  return limit ? open.slice(0, limit) : open;
}

export async function getPastEvents(limit = 8) {
  return events
    .filter(
      (e) =>
        ["PUBLISHED", "COMPLETED"].includes(e.status) && e.startsAt < startOfToday(),
    )
    .sort((a, b) => b.startsAt.getTime() - a.startsAt.getTime())
    .slice(0, limit);
}

export async function getEventBySlug(slug: string) {
  const event = events.find((e) => e.slug === slug);
  if (!event || event.status === "DRAFT") return null;
  return event;
}

/** Seats remaining at an event, or null when the event has no capacity limit. */
export async function eventSeatsLeft(_eventId: string, capacity: number | null) {
  return capacity;
}
