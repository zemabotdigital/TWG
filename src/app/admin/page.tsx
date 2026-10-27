import Link from "next/link";
import { ArrowRight, Plus } from "lucide-react";
import { requireSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { AdminEmpty, AdminHeading, StatCard, Td, Th, TableWrap } from "@/components/admin/bits";
import { Badge, ButtonLink, Card } from "@/components/ui";
import { bookingStatusMeta, yatraStatusMeta } from "@/lib/status";
import { formatDate, formatDateShort, formatRupees } from "@/lib/format";

export default async function AdminOverviewPage() {
  const session = await requireSession();
  const now = new Date();

  const [
    pendingBookings,
    pendingAppointments,
    pendingRegistrations,
    upcomingYatras,
    upcomingEvents,
    recentBookings,
    recentAppointments,
    confirmedTravellers,
  ] = await Promise.all([
    prisma.yatraBooking.count({ where: { status: "PENDING" } }),
    prisma.appointment.count({ where: { status: "PENDING" } }),
    prisma.eventRegistration.count({ where: { status: "PENDING" } }),
    prisma.yatra.count({
      where: { departureDate: { gte: now }, status: { notIn: ["DRAFT", "COMPLETED"] } },
    }),
    prisma.event.count({ where: { startsAt: { gte: now }, status: "PUBLISHED" } }),
    prisma.yatraBooking.findMany({
      orderBy: { createdAt: "desc" },
      take: 6,
      include: { yatra: { select: { title: true, slug: true } } },
    }),
    prisma.appointment.findMany({ orderBy: { createdAt: "desc" }, take: 6 }),
    prisma.yatraBooking.aggregate({
      where: { status: "CONFIRMED" },
      _sum: { travellers: true },
    }),
  ]);

  const nextYatra = await prisma.yatra.findFirst({
    where: { departureDate: { gte: now }, status: { notIn: ["DRAFT", "COMPLETED"] } },
    orderBy: { departureDate: "asc" },
  });

  const firstName = session.name.split(" ")[0];

  return (
    <>
      <AdminHeading
        title={`Namaste, ${firstName}`}
        lead="Everything waiting for your attention, in one place."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Yatra requests" value={pendingBookings}
          hint="awaiting your confirmation" tone={pendingBookings > 0 ? "amber" : "neutral"}
        />
        <StatCard
          label="Appointment requests" value={pendingAppointments}
          hint="awaiting a time" tone={pendingAppointments > 0 ? "amber" : "neutral"}
        />
        <StatCard
          label="Event registrations" value={pendingRegistrations}
          hint="pending" tone={pendingRegistrations > 0 ? "amber" : "neutral"}
        />
        <StatCard
          label="Confirmed travellers" value={confirmedTravellers._sum.travellers ?? 0}
          hint="across all departures" tone="accent"
        />
      </div>

      {/* Next departure */}
      {nextYatra ? (
        <Card className="mt-6 flex flex-wrap items-center justify-between gap-5 p-6">
          <div>
            <p className="text-[0.6875rem] tracking-wide text-content-subtle uppercase">
              Next departure
            </p>
            <p className="mt-1.5 font-display text-2xl text-content">{nextYatra.title}</p>
            <p className="mt-1 text-sm text-content-muted">
              {formatDate(nextYatra.departureDate)} · {nextYatra.seatsTotal} seats ·{" "}
              {nextYatra.priceFrom ? formatRupees(nextYatra.priceFrom) : "price on request"}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge tone={yatraStatusMeta[nextYatra.status].tone}>
              {yatraStatusMeta[nextYatra.status].label}
            </Badge>
            <ButtonLink href={`/admin/yatras/${nextYatra.id}`} variant="outline" size="sm">
              Edit
            </ButtonLink>
          </div>
        </Card>
      ) : (
        <Card className="mt-6 flex flex-wrap items-center justify-between gap-5 p-6">
          <div>
            <p className="font-display text-xl text-content">No yatra announced yet</p>
            <p className="mt-1 text-sm text-content-muted">
              Announce next month&apos;s departure so people can start requesting seats.
            </p>
          </div>
          <ButtonLink href="/admin/yatras/new" size="sm">
            <Plus className="size-4" aria-hidden />
            Announce a yatra
          </ButtonLink>
        </Card>
      )}

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <StatCard label="Upcoming yatras" value={upcomingYatras} hint="announced and open" />
        <StatCard label="Upcoming events" value={upcomingEvents} hint="published" />
      </div>

      {/* Recent yatra bookings */}
      <section className="mt-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-xl text-content">Latest yatra requests</h2>
          <Link
            href="/admin/bookings" className="inline-flex items-center gap-1 text-sm font-medium text-accent hover:underline"
          >
            All bookings
            <ArrowRight className="size-3.5" aria-hidden />
          </Link>
        </div>

        {recentBookings.length === 0 ? (
          <AdminEmpty
            title="No booking requests yet" body="When someone requests a seat on a yatra, it will appear here straight away."
          />
        ) : (
          <TableWrap>
            <table className="w-full border-collapse">
              <thead className="border-b border-line bg-surface-sunken">
                <tr>
                  <Th>Name</Th>
                  <Th>Yatra</Th>
                  <Th>Travellers</Th>
                  <Th>Status</Th>
                  <Th>Received</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {recentBookings.map((b) => (
                  <tr key={b.id}>
                    <Td>
                      <span className="font-medium">{b.name}</span>
                      <span className="mt-0.5 block text-xs text-content-subtle">{b.phone}</span>
                    </Td>
                    <Td className="max-w-56 text-content-muted">{b.yatra.title}</Td>
                    <Td>{b.travellers}</Td>
                    <Td>
                      <Badge tone={bookingStatusMeta[b.status].tone}>
                        {bookingStatusMeta[b.status].label}
                      </Badge>
                    </Td>
                    <Td className="whitespace-nowrap text-content-subtle">
                      {formatDateShort(b.createdAt)}
                    </Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TableWrap>
        )}
      </section>

      {/* Recent appointments */}
      <section className="mt-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-xl text-content">Latest appointment requests</h2>
          <Link
            href="/admin/appointments" className="inline-flex items-center gap-1 text-sm font-medium text-accent hover:underline"
          >
            All appointments
            <ArrowRight className="size-3.5" aria-hidden />
          </Link>
        </div>

        {recentAppointments.length === 0 ? (
          <AdminEmpty
            title="No appointment requests yet" body="Requests for one-to-one time with Maharaj, and messages from the contact form, land here."
          />
        ) : (
          <TableWrap>
            <table className="w-full border-collapse">
              <thead className="border-b border-line bg-surface-sunken">
                <tr>
                  <Th>Name</Th>
                  <Th>Topic</Th>
                  <Th>Preferred</Th>
                  <Th>Status</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {recentAppointments.map((a) => (
                  <tr key={a.id}>
                    <Td>
                      <span className="font-medium">{a.name}</span>
                      <span className="mt-0.5 block text-xs text-content-subtle">{a.phone}</span>
                    </Td>
                    <Td className="max-w-64 text-content-muted">{a.topic}</Td>
                    <Td className="whitespace-nowrap text-content-subtle">
                      {formatDateShort(a.preferredAt)}
                    </Td>
                    <Td>
                      <Badge tone={bookingStatusMeta[a.status].tone}>
                        {bookingStatusMeta[a.status].label}
                      </Badge>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TableWrap>
        )}
      </section>
    </>
  );
}
