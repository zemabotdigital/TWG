import { requireSession } from "@/lib/auth";
import { AdminHeading } from "@/components/admin/bits";
import { EventForm } from "@/components/admin/event-form";

export default async function NewEventPage() {
  await requireSession();
  return (
    <>
      <AdminHeading
        title="Create an event" lead="Satsangs, discourses, study circles and observances. Published events appear on the calendar immediately."
      />
      <EventForm />
    </>
  );
}
