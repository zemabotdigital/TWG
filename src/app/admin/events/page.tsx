import Link from "next/link";
import { Plus } from "lucide-react";
import { requireSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { AdminEmpty, AdminHeading, SavedBanner, TableWrap, Td, Th } from "@/components/admin/bits";
import { Badge, ButtonLink } from "@/components/ui";
import { eventStatusMeta } from "@/lib/status";
import { formatDateTime } from "@/lib/format";
import { DeleteButton } from "@/components/admin/delete-button";
import { deleteEvent } from "../actions";

export default async function AdminEventsPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  await requireSession();
  const { saved } = await searchParams;

  const events = await prisma.event.findMany({
    orderBy: { startsAt: "desc" },
    include: { _count: { select: { registrations: true } } },
  });

  return (
    <>
      <AdminHeading
        title="Events" lead="Every satsang, discourse and observance on the mission calendar." action={
          <ButtonLink href="/admin/events/new">
            <Plus className="size-4" aria-hidden />
            Create an event
          </ButtonLink>
        }
      />

      <SavedBanner show={saved === "1"} text="Event saved and published to the calendar." />

      {events.length === 0 ? (
        <AdminEmpty
          title="No events yet" body="Create your first satsang or discourse and it will appear on the home page and the events calendar."
        />
      ) : (
        <TableWrap>
          <table className="w-full border-collapse">
            <thead className="border-b border-line bg-surface-sunken">
              <tr>
                <Th>Event</Th>
                <Th>When</Th>
                <Th>Where</Th>
                <Th>Registered</Th>
                <Th>Status</Th>
                <Th className="text-right">Actions</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {events.map((e) => (
                <tr key={e.id}>
                  <Td className="max-w-72">
                    <Link href={`/admin/events/${e.id}`} className="font-medium hover:text-accent">
                      {e.title}
                    </Link>
                    <span className="mt-0.5 block text-xs text-content-subtle">{e.category}</span>
                  </Td>
                  <Td className="whitespace-nowrap text-content-muted">
                    {formatDateTime(e.startsAt)}
                  </Td>
                  <Td className="text-content-muted">{e.isOnline ? "Online" : e.venueName}</Td>
                  <Td>
                    <Link href="/admin/registrations" className="hover:text-accent">
                      {e._count.registrations}
                    </Link>
                  </Td>
                  <Td>
                    <Badge tone={eventStatusMeta[e.status].tone}>
                      {eventStatusMeta[e.status].label}
                    </Badge>
                  </Td>
                  <Td className="text-right whitespace-nowrap">
                    <div className="inline-flex items-center gap-3">
                      <Link
                        href={`/admin/events/${e.id}`}
                        className="text-sm font-medium text-accent hover:underline"
                      >
                        Edit
                      </Link>
                      <DeleteButton
                        action={deleteEvent}
                        id={e.id}
                        confirmText={`Delete "${e.title}"? Every registration for it will be deleted too. This cannot be undone.`}
                      />
                    </div>
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableWrap>
      )}
    </>
  );
}
