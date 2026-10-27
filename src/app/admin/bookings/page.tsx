import { requireSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { AdminEmpty, AdminHeading, StatCard } from "@/components/admin/bits";
import { Card } from "@/components/ui";
import { RequestRow } from "@/components/admin/request-row";
import { updateYatraBooking } from "../actions";
import { formatDate, formatDateTime, formatRupees, telHref } from "@/lib/format";

export default async function BookingsPage() {
  await requireSession();

  const bookings = await prisma.yatraBooking.findMany({
    orderBy: [{ status: "asc" }, { createdAt: "desc" }],
    include: { yatra: { select: { title: true, departureDate: true } } },
  });

  const pending = bookings.filter((b) => b.status === "PENDING").length;
  const confirmed = bookings.filter((b) => b.status === "CONFIRMED").length;
  const travellers = bookings
    .filter((b) => b.status === "CONFIRMED")
    .reduce((sum, b) => sum + b.travellers, 0);

  return (
    <>
      <AdminHeading
        title="Yatra bookings" lead="Every request for a seat on a Nepal yatra. Confirming a booking is what reserves the seat — pending requests do not reduce the seat count."
      />

      <div className="mb-7 grid gap-4 sm:grid-cols-3">
        <StatCard label="Awaiting reply" value={pending} tone={pending > 0 ? "amber" : "neutral"} />
        <StatCard label="Confirmed bookings" value={confirmed} tone="accent" />
        <StatCard label="Confirmed travellers" value={travellers} />
      </div>

      {bookings.length === 0 ? (
        <AdminEmpty
          title="No booking requests yet" body="When someone requests a seat on a yatra, it appears here immediately with their contact details."
        />
      ) : (
        <Card className="overflow-hidden">
          <ul>
            {bookings.map((b) => (
              <RequestRow
                key={b.id}
                id={b.id}
                action={updateYatraBooking}
                title={b.name}
                subtitle={`${b.yatra.title} · ${b.travellers} ${
                  b.travellers === 1 ? "traveller" : "travellers"
                }`}
                meta={formatDate(b.createdAt)}
                reference={b.reference}
                status={b.status}
                message={b.message || undefined}
                defaultNote={b.adminNote}
                details={[
                  { label: "Phone", value: <a href={telHref(b.phone)}>{b.phone}</a> },
                  {
                    label: "WhatsApp",
                    value: b.whatsapp ? (
                      <a
                        href={`https://wa.me/${b.whatsapp.replace(/\D/g, "")}`}
                        target="_blank" rel="noopener noreferrer" className="text-accent hover:underline"
                      >
                        {b.whatsapp}
                      </a>
                    ) : (
                      "—"
                    ),
                  },
                  { label: "Email", value: <a href={`mailto:${b.email}`}>{b.email}</a> },
                  { label: "From", value: b.city || "—" },
                  { label: "Travellers", value: b.travellers },
                  { label: "Passport ready", value: b.passportReady ? "Yes" : "Not confirmed" },
                  { label: "Departure", value: formatDate(b.yatra.departureDate) },
                  {
                    label: "Quoted",
                    value: b.amountQuoted ? formatRupees(b.amountQuoted) : "—",
                  },
                  { label: "Received", value: formatDateTime(b.createdAt) },
                ]}
                extraFields={
                  <label className="block">
                    <span className="mb-1.5 block text-sm font-medium text-content">
                      Amount received (₹)
                    </span>
                    <input
                      type="number" name="amountPaid" min={0}
                      defaultValue={b.amountPaid || ""}
                      className="w-full border border-line-strong bg-surface-raised px-3.5 py-2.5 text-sm text-content focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/25"
                    />
                  </label>
                }
              />
            ))}
          </ul>
        </Card>
      )}
    </>
  );
}
