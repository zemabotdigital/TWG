import { requireSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { AdminEmpty, AdminHeading, StatCard } from "@/components/admin/bits";
import { Card } from "@/components/ui";
import { RequestRow } from "@/components/admin/request-row";
import { updateRegistration } from "../actions";
import { formatDate, formatDateTime, telHref } from "@/lib/format";

export default async function RegistrationsPage() {
  await requireSession();

  const registrations = await prisma.eventRegistration.findMany({
    orderBy: [{ status: "asc" }, { createdAt: "desc" }],
    include: { event: { select: { title: true, startsAt: true } } },
  });

  const pending = registrations.filter((r) => r.status === "PENDING").length;
  const seats = registrations
    .filter((r) => r.status !== "CANCELLED")
    .reduce((sum, r) => sum + r.seats, 0);

  return (
    <>
      <AdminHeading
        title="Event registrations" lead="Everyone who has registered for a satsang, discourse or observance."
      />

      <div className="mb-7 grid gap-4 sm:grid-cols-3">
        <StatCard label="Pending" value={pending} tone={pending > 0 ? "amber" : "neutral"} />
        <StatCard label="Registrations" value={registrations.length} />
        <StatCard label="Seats taken" value={seats} tone="accent" />
      </div>

      {registrations.length === 0 ? (
        <AdminEmpty
          title="No registrations yet" body="When someone registers for an event, their details appear here."
        />
      ) : (
        <Card className="overflow-hidden">
          <ul>
            {registrations.map((r) => (
              <RequestRow
                key={r.id}
                id={r.id}
                action={updateRegistration}
                title={r.name}
                subtitle={`${r.event.title} · ${r.seats} ${r.seats === 1 ? "seat" : "seats"}`}
                meta={formatDate(r.createdAt)}
                status={r.status}
                message={r.message || undefined}
                defaultNote={r.adminNote}
                details={[
                  { label: "Phone", value: <a href={telHref(r.phone)}>{r.phone}</a> },
                  { label: "Email", value: <a href={`mailto:${r.email}`}>{r.email}</a> },
                  { label: "From", value: r.city || "—" },
                  { label: "Seats", value: r.seats },
                  { label: "Event date", value: formatDateTime(r.event.startsAt) },
                  { label: "Registered", value: formatDateTime(r.createdAt) },
                ]}
              />
            ))}
          </ul>
        </Card>
      )}
    </>
  );
}
