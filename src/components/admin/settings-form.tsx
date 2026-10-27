"use client";

import { useActionState } from "react";
import { ShoppingBag } from "lucide-react";
import { updateSettings } from "@/app/admin/actions";
import { emptyAdminState } from "@/lib/form-state";
import { settingMeta, type SettingKey } from "@/content/site";
import type { SiteSettings } from "@/lib/settings";
import { Field, FormBanner, Input, SubmitButton, Textarea } from "../form";
import { Card } from "../ui";

const GROUPS: Array<{ title: string; blurb: string; keys: SettingKey[] }> = [
  {
    title: "The store",
    blurb:
      "Add your store address and a Store button appears in the header, the footer, the home page and the contact page. Clear the link and every one of those buttons disappears.",
    keys: ["storeUrl", "storeLabel", "storeNote"],
  },
  {
    title: "Contact details",
    blurb: "Shown in the footer and on the contact page.",
    keys: ["contactPhone", "contactWhatsapp", "contactEmail", "contactAddress"],
  },
  {
    title: "Social accounts",
    blurb: "Icons appear in the footer for whichever of these you fill in.",
    keys: ["youtubeUrl", "instagramUrl", "facebookUrl"],
  },
  {
    title: "Offerings",
    blurb: "An optional note about voluntary offerings, shown on the contact page.",
    keys: ["donationNote"],
  },
];

export function SettingsForm({ settings }: { settings: SiteSettings }) {
  const [state, action] = useActionState(updateSettings, emptyAdminState);

  return (
    <form action={action} className="space-y-6">
      {state.ok && state.message ? (
        <FormBanner tone="success">{state.message}</FormBanner>
      ) : null}
      {!state.ok && state.message ? <FormBanner tone="error">{state.message}</FormBanner> : null}

      {GROUPS.map((group) => (
        <Card key={group.title} className="space-y-5 p-6">
          <div>
            <h2 className="flex items-center gap-2 font-display text-xl text-content">
              {group.title === "The store" ? (
                <ShoppingBag className="size-4 text-accent" aria-hidden />
              ) : null}
              {group.title}
            </h2>
            <p className="mt-1.5 text-sm leading-relaxed text-content-muted">{group.blurb}</p>
          </div>

          {group.keys.map((key) => {
            const meta = settingMeta[key];
            const common = {
              id: key,
              name: key,
              defaultValue: settings[key],
            };
            return (
              <Field
                key={key}
                label={meta.label}
                name={key}
                hint={meta.help}
                error={state.errors?.[key]}
              >
                {meta.type === "textarea" ? (
                  <Textarea {...common} rows={3} />
                ) : (
                  <Input
                    {...common}
                    type={meta.type === "url" ? "url" : meta.type === "tel" ? "tel" : meta.type === "email" ? "email" : "text"}
                    placeholder={meta.type === "url" ? "https://" : undefined}
                  />
                )}
              </Field>
            );
          })}
        </Card>
      ))}

      <SubmitButton size="lg" pendingLabel="Saving…">
        Save settings
      </SubmitButton>
    </form>
  );
}
