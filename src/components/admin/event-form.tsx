"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import type { Event } from "@/generated/prisma/client";
import { saveEvent } from "@/app/admin/actions";
import { emptyAdminState } from "@/lib/form-state";
import { Checkbox, Field, FormBanner, Input, Select, SubmitButton, Textarea } from "../form";
import { Card } from "../ui";
import { toDateTimeLocalValue } from "@/lib/format";

const STATUSES = [
  { value: "DRAFT", label: "Draft — hidden from the website" },
  { value: "PUBLISHED", label: "Published — visible and open for registration" },
  { value: "CANCELLED", label: "Cancelled — shown as cancelled" },
  { value: "COMPLETED", label: "Completed — moved to past events" },
];

const CATEGORIES = ["Satsang", "Discourse", "Study", "Observance", "Retreat", "Seva"];

export function EventForm({ event }: { event?: Event }) {
  const [state, action] = useActionState(saveEvent, emptyAdminState);
  const [isOnline, setIsOnline] = useState(event?.isOnline ?? false);

  return (
    <form action={action} className="space-y-6" noValidate>
      {event ? <input type="hidden" name="id" value={event.id} /> : null}

      {state.message ? <FormBanner tone="error">{state.message}</FormBanner> : null}

      <Card className="space-y-5 p-6">
        <h2 className="font-display text-xl text-content">The basics</h2>

        <Field label="Title" name="title" required error={state.errors?.title}>
          <Input id="title" name="title" defaultValue={event?.title} required />
        </Field>

        <Field
          label="Category" name="category" hint="Shown as a small label on the event card." required
          error={state.errors?.category}
        >
          <Select id="category" name="category" defaultValue={event?.category ?? "Satsang"}>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Select>
        </Field>

        <Field
          label="One-line summary" name="summary" hint="Appears on cards and in search results." required
          error={state.errors?.summary}
        >
          <Textarea id="summary" name="summary" rows={2} defaultValue={event?.summary} required />
        </Field>

        <Field
          label="Full description" name="description" hint="Leave a blank line between paragraphs." required
          error={state.errors?.description}
        >
          <Textarea
            id="description" name="description" rows={9}
            defaultValue={event?.description}
            required
          />
        </Field>
      </Card>

      <Card className="space-y-5 p-6">
        <h2 className="font-display text-xl text-content">When and where</h2>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            label="Starts" name="startsAt" hint="India Standard Time." required
            error={state.errors?.startsAt}
          >
            <Input
              id="startsAt" name="startsAt" type="datetime-local" defaultValue={event ? toDateTimeLocalValue(event.startsAt) : ""}
              required
            />
          </Field>
          <Field
            label="Ends" name="endsAt" hint="Optional." error={state.errors?.endsAt}
          >
            <Input
              id="endsAt" name="endsAt" type="datetime-local" defaultValue={event?.endsAt ? toDateTimeLocalValue(event.endsAt) : ""}
            />
          </Field>
        </div>

        <Checkbox
          name="isOnline" value="true" checked={isOnline}
          onChange={(e) => setIsOnline(e.currentTarget.checked)}
          label="This is an online event"
        />

        {isOnline ? (
          <Field
            label="Joining link" name="onlineUrl" hint="Kept private — it is sent to people after they register, not shown on the page." error={state.errors?.onlineUrl}
          >
            <Input id="onlineUrl" name="onlineUrl" defaultValue={event?.onlineUrl ?? ""} />
          </Field>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2">
            <Field
              label="Venue name" name="venueName" required
              error={state.errors?.venueName}
            >
              <Input
                id="venueName" name="venueName" defaultValue={event?.venueName ?? "Mission Hall"}
              />
            </Field>
            <Field label="Town or city" name="city" error={state.errors?.city}>
              <Input id="city" name="city" defaultValue={event?.city ?? "Thrissur"} />
            </Field>
            <Field
              label="Street address" name="venueAddress" className="sm:col-span-2" error={state.errors?.venueAddress}
            >
              <Input
                id="venueAddress" name="venueAddress" defaultValue={event?.venueAddress ?? ""}
              />
            </Field>
          </div>
        )}
      </Card>

      <Card className="space-y-5 p-6">
        <h2 className="font-display text-xl text-content">Attendance</h2>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            label="Capacity" name="capacity" hint="Leave blank for unlimited." error={state.errors?.capacity}
          >
            <Input
              id="capacity" name="capacity" type="number" min={1}
              defaultValue={event?.capacity ?? ""}
            />
          </Field>
          <Field
            label="Note about contributions" name="contributionNote" error={state.errors?.contributionNote}
          >
            <Input
              id="contributionNote" name="contributionNote" defaultValue={
                event?.contributionNote ?? "Participation is free. Offerings are voluntary."
              }
            />
          </Field>
        </div>
      </Card>

      <Card className="space-y-5 p-6">
        <h2 className="font-display text-xl text-content">Publishing</h2>

        <Field label="Status" name="status" required error={state.errors?.status}>
          <Select id="status" name="status" defaultValue={event?.status ?? "PUBLISHED"}>
            {STATUSES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </Select>
        </Field>

        <Field
          label="Cover photo" name="coverImage" hint="Put the file in /public/images/ and enter the path, e.g. /images/satsang.jpg." error={state.errors?.coverImage}
        >
          <Input id="coverImage" name="coverImage" defaultValue={event?.coverImage ?? ""} />
        </Field>

        <Checkbox
          name="featured" value="true" defaultChecked={event?.featured ?? false}
          label="Feature this event on the home page"
        />
      </Card>

      <div className="flex items-center gap-3">
        <SubmitButton size="lg" pendingLabel="Saving…">
          {event ? "Save changes" : "Create event"}
        </SubmitButton>
        <Link
          href="/admin/events" className="text-sm text-content-muted transition-colors hover:text-accent"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
