import { prisma } from "./db";
import type { Yatra } from "@/generated/prisma/client";

/** Start of today in server time — events earlier today still count as upcoming. */
function startOfToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * Seats taken counts CONFIRMED bookings only. A pending request has not been
 * accepted yet, so it must not consume a seat — otherwise unanswered enquiries
 * would silently close a departure.
 */
export async function seatsTakenByYatra(yatraIds: string[]) {
  if (yatraIds.length === 0) return new Map<string, number>();

  const rows = await prisma.yatraBooking.groupBy({
    by: ["yatraId"],
    where: { yatraId: { in: yatraIds }, status: "CONFIRMED" },
    _sum: { travellers: true },
  });

  return new Map(rows.map((r) => [r.yatraId, r._sum.travellers ?? 0]));
}

export function seatsLeft(yatra: Yatra, taken: number) {
  return Math.max(0, yatra.seatsTotal - taken);
}

export async function getUpcomingYatras(limit?: number) {
  const yatras = await prisma.yatra.findMany({
    where: {
      status: { in: ["ANNOUNCED", "FILLING", "FULL"] },
      departureDate: { gte: startOfToday() },
    },
    orderBy: { departureDate: "asc" },
    take: limit,
  });

  const taken = await seatsTakenByYatra(yatras.map((y) => y.id));
  return yatras.map((y) => ({ yatra: y, seatsLeft: seatsLeft(y, taken.get(y.id) ?? 0) }));
}

export async function getPastYatras(limit = 6) {
  return prisma.yatra.findMany({
    where: {
      OR: [{ status: "COMPLETED" }, { departureDate: { lt: startOfToday() } }],
      NOT: { status: "DRAFT" },
    },
    orderBy: { departureDate: "desc" },
    take: limit,
  });
}

export async function getYatraBySlug(slug: string) {
  const yatra = await prisma.yatra.findUnique({ where: { slug } });
  if (!yatra || yatra.status === "DRAFT") return null;

  const taken = await seatsTakenByYatra([yatra.id]);
  return { yatra, seatsLeft: seatsLeft(yatra, taken.get(yatra.id) ?? 0) };
}

export async function getUpcomingEvents(limit?: number) {
  return prisma.event.findMany({
    where: { status: "PUBLISHED", startsAt: { gte: startOfToday() } },
    orderBy: { startsAt: "asc" },
    take: limit,
  });
}

export async function getPastEvents(limit = 8) {
  return prisma.event.findMany({
    where: {
      status: { in: ["PUBLISHED", "COMPLETED"] },
      startsAt: { lt: startOfToday() },
    },
    orderBy: { startsAt: "desc" },
    take: limit,
  });
}

export async function getEventBySlug(slug: string) {
  const event = await prisma.event.findUnique({
    where: { slug },
    include: { _count: { select: { registrations: true } } },
  });
  if (!event || event.status === "DRAFT") return null;
  return event;
}

/** Seats remaining at an event, or null when the event has no capacity limit. */
export async function eventSeatsLeft(eventId: string, capacity: number | null) {
  if (capacity === null) return null;
  const agg = await prisma.eventRegistration.aggregate({
    where: { eventId, status: { in: ["CONFIRMED", "PENDING"] } },
    _sum: { seats: true },
  });
  return Math.max(0, capacity - (agg._sum.seats ?? 0));
}
