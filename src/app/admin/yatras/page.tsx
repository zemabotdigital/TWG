import Link from "next/link";
import { Plus } from "lucide-react";
import { requireSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { AdminEmpty, AdminHeading, SavedBanner, TableWrap, Td, Th } from "@/components/admin/bits";
import { Badge, ButtonLink } from "@/components/ui";
import { yatraStatusMeta } from "@/lib/status";
import { formatDateRange, formatRupees } from "@/lib/format";
import { DeleteButton } from "@/components/admin/delete-button";
import { deleteYatra } from "../actions";

export default async function AdminYatrasPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  await requireSession();
  const { saved } = await searchParams;

  const yatras = await prisma.yatra.findMany({
    orderBy: { departureDate: "desc" },
    include: { _count: { select: { bookings: true } } },
  });

  return (
    <>
      <AdminHeading
        title="Nepal Yatras" lead="Announce a departure date and it appears on the website immediately. Itineraries and contributions are never published — visitors are told to enquire. Set the status to Draft to work on one privately." action={
          <ButtonLink href="/admin/yatras/new">
            <Plus className="size-4" aria-hidden />
            Announce a yatra
          </ButtonLink>
        }
      />

      <SavedBanner show={saved === "1"} text="Yatra saved and published to the website." />

      {yatras.length === 0 ? (
        <AdminEmpty
          title="No yatras yet" body="Announce your first departure to Pashupatinath and it will appear on the home page and the yatra page."
        />
      ) : (
        <TableWrap>
          <table className="w-full border-collapse">
            <thead className="border-b border-line bg-surface-sunken">
              <tr>
                <Th>Yatra</Th>
                <Th>Dates</Th>
                <Th>Seats</Th>
                <Th>Contribution (private)</Th>
                <Th>Requests</Th>
                <Th>Status</Th>
                <Th className="text-right">Actions</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {yatras.map((y) => (
                <tr key={y.id}>
                  <Td className="max-w-72">
                    <Link
                      href={`/admin/yatras/${y.id}`}
                      className="font-medium hover:text-accent"
                    >
                      {y.title}
                    </Link>
                    <span className="mt-0.5 block text-xs text-content-subtle">
                      from {y.departureCity}
                    </span>
                  </Td>
                  <Td className="whitespace-nowrap text-content-muted">
                    {formatDateRange(y.departureDate, y.returnDate)}
                  </Td>
                  <Td>{y.seatsTotal}</Td>
                  <Td className="whitespace-nowrap">
                    {y.priceFrom ? formatRupees(y.priceFrom) : "—"}
                  </Td>
                  <Td>
                    <Link href="/admin/bookings" className="hover:text-accent">
                      {y._count.bookings}
                    </Link>
                  </Td>
                  <Td>
                    <Badge tone={yatraStatusMeta[y.status].tone}>
                      {yatraStatusMeta[y.status].label}
                    </Badge>
                  </Td>
                  <Td className="text-right whitespace-nowrap">
                    <div className="inline-flex items-center gap-3">
                      <Link
                        href={`/admin/yatras/${y.id}`}
                        className="text-sm font-medium text-accent hover:underline"
                      >
                        Edit
                      </Link>
                      <DeleteButton
                        action={deleteYatra}
                        id={y.id}
                        confirmText={`Delete "${y.title}"? Every booking request attached to it will be deleted too. This cannot be undone.`}
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
