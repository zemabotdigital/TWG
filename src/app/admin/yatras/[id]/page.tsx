import { notFound } from "next/navigation";
import { requireSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { AdminHeading } from "@/components/admin/bits";
import { YatraForm } from "@/components/admin/yatra-form";

export default async function EditYatraPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireSession();
  const { id } = await params;

  const yatra = await prisma.yatra.findUnique({ where: { id } });
  if (!yatra) notFound();

  return (
    <>
      <AdminHeading title="Edit yatra" lead={yatra.title} />
      <YatraForm yatra={yatra} />
    </>
  );
}
