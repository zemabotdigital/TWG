import { requireSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { AdminEmpty, AdminHeading, StatCard } from "@/components/admin/bits";
import { Card } from "@/components/ui";
import { RequestRow } from "@/components/admin/request-row";
import { updateAppointment } from "../actions";
import { retryAppointmentWebhook } from "../webhook-actions";
import { WebhookStatusCell } from "@/components/admin/webhook-status";
import { appointmentModeMeta } from "@/lib/status";
import { formatDate, formatDateTime, toDateTimeLocalValue, telHref } from "@/lib/format";

export default async function AppointmentsPage() {
  await requireSession();

  const appointments = await prisma.appointment.findMany({
    orderBy: [{ status: "asc" }, { createdAt: "desc" }],
  });

  const pending = appointments.filter((a) => a.status === "PENDING").length;
  const confirmed = appointments.filter((a) => a.status === "CONFIRMED").length;

  return (
    <>
      <AdminHeading
        title="Appointments" lead="Requests for one-to-one time with Maharaj, and messages sent through the contact form. Set a confirmed time and add the meeting link for video calls."
      />

      <div className="mb-7 grid gap-4 sm:grid-cols-3">
        <StatCard label="Awaiting a time" value={pending} tone={pending > 0 ? "amber" : "neutral"} />
        <StatCard label="Confirmed" value={confirmed} tone="accent" />
        <StatCard label="Total requests" value={appointments.length} />
      </div>

      {appointments.length === 0 ? (
        <AdminEmpty
          title="No requests yet" body="One-to-one requests and contact-form messages both arrive here."
        />
      ) : (
        <Card className="overflow-hidden">
          <ul>
            {appointments.map((a) => (
              <RequestRow
                key={a.id}
                id={a.id}
                action={updateAppointment}
                title={a.name}
                subtitle={a.topic}
                meta={formatDate(a.createdAt)}
                reference={a.reference}
                status={a.status}
                message={a.message || undefined}
                defaultNote={a.adminNote}
                details={[
                  { label: "Phone", value: <a href={telHref(a.phone)}>{a.phone}</a> },
                  { label: "Email", value: <a href={`mailto:${a.email}`}>{a.email}</a> },
                  { label: "From", value: a.city || "—" },
                  { label: "Preferred mode", value: appointmentModeMeta[a.mode].label },
                  { label: "Preferred time", value: formatDateTime(a.preferredAt) },
                  {
                    label: "Alternative time",
                    value: a.altAt ? formatDateTime(a.altAt) : "—",
                  },
                  {
                    label: "Confirmed for",
                    value: a.confirmedAt ? formatDateTime(a.confirmedAt) : "Not yet set",
                  },
                  { label: "Received", value: formatDateTime(a.createdAt) },
                  {
                    label: "Sent to WhatsApp bot",
                    value: (
                      <WebhookStatusCell
                        id={a.id}
                        status={a.webhookStatus}
                        attempts={a.webhookAttempts}
                        lastError={a.webhookLastError}
                        sentAt={a.webhookSentAt ? formatDateTime(a.webhookSentAt) : null}
                        retry={retryAppointmentWebhook}
                      />
                    ),
                  },
                ]}
                extraFields={
                  <label className="block">
                    <span className="mb-1.5 block text-sm font-medium text-content">
                      Confirmed date and time
                    </span>
                    <input
                      type="datetime-local" name="confirmedAt" defaultValue={a.confirmedAt ? toDateTimeLocalValue(a.confirmedAt) : ""}
                      className="w-full border border-line-strong bg-surface-raised px-3.5 py-2.5 text-sm text-content focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/25"
                    />
                    <span className="mt-2 mb-1.5 block text-sm font-medium text-content">
                      Meeting link
                    </span>
                    <input
                      type="url" name="meetingLink" defaultValue={a.meetingLink}
                      placeholder="For video calls" className="w-full border border-line-strong bg-surface-raised px-3.5 py-2.5 text-sm text-content focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/25"
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
