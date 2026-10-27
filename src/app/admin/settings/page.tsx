import { requireSession } from "@/lib/auth";
import { getSettings } from "@/lib/settings";
import { AdminHeading } from "@/components/admin/bits";
import { SettingsForm } from "@/components/admin/settings-form";

export default async function SettingsPage() {
  await requireSession();
  const settings = await getSettings();

  return (
    <>
      <AdminHeading
        title="Settings" lead="Your store link, contact details and social accounts. Anything left blank is simply hidden from the website rather than shown empty."
      />
      <SettingsForm settings={settings} />
    </>
  );
}
