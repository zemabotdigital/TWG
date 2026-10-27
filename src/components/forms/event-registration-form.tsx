"use client";

import { useActionState } from "react";
import { CheckCircle2 } from "lucide-react";
import { registerForEvent } from "@/app/(site)/actions";
import { emptyFormState } from "@/lib/form-state";
import { Field, FormBanner, Input, SubmitButton, Textarea } from "../form";

export function EventRegistrationForm({
  eventId,
  seatsLeft,
}: {
  eventId: string;
  seatsLeft: number | null;
}) {
  const [state, action] = useActionState(registerForEvent, emptyFormState);

  if (state.ok) {
    return (
      <div className=" border border-emerald-600/30 bg-emerald-500/10 p-7 text-center">
        <CheckCircle2
          className="mx-auto size-8 text-emerald-600 dark:text-emerald-400" aria-hidden
        />
        <h3 className="mt-3 font-display text-xl text-content">You are registered</h3>
        <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-content-muted">
          {state.message}
        </p>
      </div>
    );
  }

  const full = seatsLeft !== null && seatsLeft <= 0;

  return (
    <form action={action} className="space-y-5" noValidate>
      <input type="hidden" name="eventId" value={eventId} />
      <input
        type="text" name="website" tabIndex={-1}
        autoComplete="off" aria-hidden
        className="absolute h-0 w-0 overflow-hidden opacity-0"
      />

      <div>
        <h3 className="font-display text-xl text-content">Register to attend</h3>
        <p className="mt-2 text-sm leading-relaxed text-content-muted">
          {full
            ? "Every seat is spoken for, but registrations are still taken in case of cancellations."
            : "Registration helps us prepare seating and prasadam. There is no fee."}
        </p>
      </div>

      {state.message && !state.ok ? <FormBanner tone="error">{state.message}</FormBanner> : null}

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Full name" name="name" required error={state.errors?.name}>
          <Input id="name" name="name" autoComplete="name" required />
        </Field>
        <Field label="Phone" name="phone" required error={state.errors?.phone}>
          <Input id="phone" name="phone" type="tel" autoComplete="tel" required />
        </Field>
        <Field label="Email" name="email" required error={state.errors?.email}>
          <Input id="email" name="email" type="email" autoComplete="email" required />
        </Field>
        <Field
          label="How many attending" name="seats" hint="Including yourself." required
          error={state.errors?.seats}
        >
          <Input id="seats" name="seats" type="number" min={1} max={10} defaultValue={1} required />
        </Field>
      </div>

      <Field label="Town or city" name="city" error={state.errors?.city}>
        <Input id="city" name="city" autoComplete="address-level2" />
      </Field>

      <Field
        label="A note for the mission" name="message" hint="Optional — accessibility needs, or if you would like to volunteer." error={state.errors?.message}
      >
        <Textarea id="message" name="message" rows={3} />
      </Field>

      <SubmitButton pendingLabel="Registering…">Register — free</SubmitButton>
    </form>
  );
}
