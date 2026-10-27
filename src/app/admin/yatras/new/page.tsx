import { requireSession } from "@/lib/auth";
import { AdminHeading } from "@/components/admin/bits";
import { YatraForm } from "@/components/admin/yatra-form";

export default async function NewYatraPage() {
  await requireSession();
  return (
    <>
      <AdminHeading
        title="Announce a yatra" lead="Fill this in and the departure appears on the website straight away — unless you set the status to Draft."
      />
      <YatraForm />
    </>
  );
}
