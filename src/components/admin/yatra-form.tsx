"use client";

import Link from "next/link";
import { useActionState } from "react";
import type { Yatra } from "@/generated/prisma/client";
import { saveYatra } from "@/app/admin/actions";
import { emptyAdminState } from "@/lib/form-state";
import { Checkbox, Field, FormBanner, Input, Select, SubmitButton, Textarea } from "../form";
import { Card } from "../ui";
import { parseJsonArray, toDateTimeLocalValue } from "@/lib/format";

type ItineraryDay = { day: number; title: string; detail: string };

const STATUSES = [
  { value: "DRAFT", label: "Draft — hidden from the website" },
  { value: "ANNOUNCED", label: "Announced — bookings open" },
  { value: "FILLING", label: "Filling fast — bookings open" },
  { value: "FULL", label: "Full — new requests go to the waitlist" },
  { value: "CLOSED", label: "Closed — no longer taking requests" },
  { value: "COMPLETED", label: "Completed — already travelled" },
];

/** Date only (yyyy-mm-dd) for a date input. */
function dateValue(value: Date | string | null | undefined) {
  if (!value) return "";
  return toDateTimeLocalValue(value).slice(0, 10);
}

export function YatraForm({ yatra }: { yatra?: Yatra }) {
  const [state, action] = useActionState(saveYatra, emptyAdminState);

  const inclusions = yatra ? parseJsonArray<string>(yatra.inclusions).join("\n") : "";
  const exclusions = yatra ? parseJsonArray<string>(yatra.exclusions).join("\n") : "";
  const itinerary = yatra
    ? parseJsonArray<ItineraryDay>(yatra.itinerary)
        .map((d) => `${d.title} | ${d.detail}`)
        .join("\n")
    : "";

  return (
    <form action={action} className="space-y-6" noValidate>
      {yatra ? <input type="hidden" name="id" value={yatra.id} /> : null}

      {state.message ? <FormBanner tone="error">{state.message}</FormBanner> : null}

      <Card className="space-y-5 p-6">
        <h2 className="font-display text-xl text-content">The basics</h2>

        <Field
          label="Title" name="title" hint="Shown as the heading. For example: Pashupatinath Yatra — March 2027" required
          error={state.errors?.title}
        >
          <Input id="title" name="title" defaultValue={yatra?.title} required />
        </Field>

        <Field
          label="One-line summary" name="summary" hint="Appears on the cards across the site. Two sentences at most." required
          error={state.errors?.summary}
        >
          <Textarea
            id="summary" name="summary" rows={2}
            defaultValue={yatra?.summary}
            required
          />
        </Field>

        <Field
          label="Full description" name="description" hint="Leave a blank line between paragraphs." required
          error={state.errors?.description}
        >
          <Textarea
            id="description" name="description" rows={9}
            defaultValue={yatra?.description}
            required
          />
        </Field>
      </Card>

      <Card className="space-y-5 p-6">
        <h2 className="font-display text-xl text-content">Dates and seats</h2>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            label="Departure date" name="departureDate" required
            error={state.errors?.departureDate}
          >
            <Input
              id="departureDate" name="departureDate" type="date" defaultValue={dateValue(yatra?.departureDate)}
              required
            />
          </Field>
          <Field
            label="Return date" name="returnDate" required
            error={state.errors?.returnDate}
          >
            <Input
              id="returnDate" name="returnDate" type="date" defaultValue={dateValue(yatra?.returnDate)}
              required
            />
          </Field>
          <Field
            label="Departing from" name="departureCity" required
            error={state.errors?.departureCity}
          >
            <Input
              id="departureCity" name="departureCity" defaultValue={yatra?.departureCity ?? "Kochi"}
              required
            />
          </Field>
          <Field label="Destination" name="destination" required error={state.errors?.destination}>
            <Input
              id="destination" name="destination" defaultValue={yatra?.destination ?? "Pashupatinath, Kathmandu, Nepal"}
              required
            />
          </Field>
          <Field
            label="Nights" name="durationNights" required
            error={state.errors?.durationNights}
          >
            <Input
              id="durationNights" name="durationNights" type="number" min={0}
              max={60}
              defaultValue={yatra?.durationNights ?? 4}
              required
            />
          </Field>
          <Field
            label="Total seats" name="seatsTotal" hint="Seats remaining are worked out from confirmed bookings." required
            error={state.errors?.seatsTotal}
          >
            <Input
              id="seatsTotal" name="seatsTotal" type="number" min={1}
              max={1000}
              defaultValue={yatra?.seatsTotal ?? 30}
              required
            />
          </Field>
        </div>
      </Card>

      <Card className="space-y-5 p-6">
        <h2 className="font-display text-xl text-content">Contribution — internal only</h2>

        <p className="-mt-2 text-sm leading-relaxed text-content-muted">
          Nothing here is published. The website never shows a price; it tells visitors the
          contribution is shared on enquiry. These fields are so you have the figure to hand
          when you speak to someone.
        </p>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            label="Amount per person (₹) — not published" name="priceFrom" hint="For your reference when quoting. Never appears on the public site." error={state.errors?.priceFrom}
          >
            <Input
              id="priceFrom" name="priceFrom" type="number" min={0}
              defaultValue={yatra?.priceFrom ?? ""}
            />
          </Field>
          <Field label="Internal note on the contribution" name="priceNote" hint="Also private." error={state.errors?.priceNote}>
            <Input
              id="priceNote" name="priceNote" defaultValue={
                yatra?.priceNote ??
                "Per person, twin sharing. Excludes airfare unless stated."
              }
            />
          </Field>
        </div>
      </Card>

      <Card className="space-y-5 p-6">
        <h2 className="font-display text-xl text-content">What the yatra includes</h2>

        <Field
          label="Included" name="inclusions" hint="One item per line." error={state.errors?.inclusions}
        >
          <Textarea id="inclusions" name="inclusions" rows={7} defaultValue={inclusions} />
        </Field>

        <Field
          label="Not included" name="exclusions" hint="One item per line." error={state.errors?.exclusions}
        >
          <Textarea id="exclusions" name="exclusions" rows={5} defaultValue={exclusions} />
        </Field>

        <Field
          label="Day-by-day itinerary" name="itinerary" hint="One day per line, in the form:  Title | what happens that day.  Days are numbered automatically." error={state.errors?.itinerary}
        >
          <Textarea
            id="itinerary" name="itinerary" rows={7}
            defaultValue={itinerary}
            placeholder={"Kochi to Kathmandu | Group assembles before dawn…\nPashupatinath darshan | Early morning darshan with Maharaj…"}
          />
        </Field>
      </Card>

      <Card className="space-y-5 p-6">
        <h2 className="font-display text-xl text-content">Publishing</h2>

        <Field
          label="Status" name="status" hint="Only Announced, Filling and Full appear on the public website." required
          error={state.errors?.status}
        >
          <Select id="status" name="status" defaultValue={yatra?.status ?? "ANNOUNCED"}>
            {STATUSES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </Select>
        </Field>

        <Field
          label="Cover photo" name="coverImage" hint="Put the file in /public/images/ and enter the path, e.g. /images/pashupatinath.jpg. Leave blank to use the default artwork." error={state.errors?.coverImage}
        >
          <Input id="coverImage" name="coverImage" defaultValue={yatra?.coverImage ?? ""} />
        </Field>

        <Checkbox
          name="featured" value="true" defaultChecked={yatra?.featured ?? false}
          label="Feature this yatra at the top of the home page"
        />
      </Card>

      <div className="flex items-center gap-3">
        <SubmitButton size="lg" pendingLabel="Saving…">
          {yatra ? "Save changes" : "Announce this yatra"}
        </SubmitButton>
        <Link
          href="/admin/yatras" className="text-sm text-content-muted transition-colors hover:text-accent"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
