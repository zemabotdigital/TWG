"use client";

import { useActionState, useState } from "react";
import { CheckCircle2, Lock } from "lucide-react";
import { requestAppointment } from "@/app/(site)/actions";
import { emptyFormState } from "@/lib/form-state";
import { Field, FormBanner, Input, SubmitButton, Textarea } from "../form";
import { appointmentModeMeta } from "@/lib/status";
import { BookButton } from "../book-button";
import { cn } from "../ui";

const MODES = ["IN_PERSON", "VIDEO_CALL", "PHONE_CALL"] as const;

/** A datetime-local value N days from now at 09:00. */
function defaultSlot(offsetDays: number) {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  d.setHours(9, 0, 0, 0);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours(),
  )}:${pad(d.getMinutes())}`;
}

export function AppointmentForm() {
  const [state, action] = useActionState(requestAppointment, emptyFormState);
  const [mode, setMode] = useState<(typeof MODES)[number]>("IN_PERSON");

  if (state.ok) {
    return (
      <div className="border border-emerald-600/30 bg-emerald-500/10 p-8 text-center">
        <CheckCircle2
          className="mx-auto size-9 text-emerald-600 dark:text-emerald-400"
          aria-hidden
        />
        <h3 className="mt-4 font-display text-2xl text-content">Request received</h3>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-content-muted">
          {state.message}
        </p>

        {state.reference ? (
          <>
            <p className="mt-5 inline-block border border-line bg-surface-raised px-4 py-2.5 font-mono text-sm tracking-wider text-content">
              {state.reference}
            </p>
            <p className="mt-3 text-xs text-content-subtle">
              Keep this reference — quote it when you message the mission.
            </p>

            {/*
              Handoff carries the trigger and the reference only. Everything
              the visitor typed is already stored and has been sent to the
              platform server-side; none of it belongs in a public URL.
            */}
            <div className="mt-7 border-t border-line pt-6">
              <p className="text-sm leading-relaxed text-content-muted">
                Continue on WhatsApp and the mission will confirm your time.
              </p>
              <BookButton
                route="maharaj_appointment"
                reference={state.reference}
                label="Continue on WhatsApp"
                size="lg"
                className="mt-4"
              />
            </div>
          </>
        ) : null}
      </div>
    );
  }

  return (
    <form action={action} className="space-y-6" noValidate>
      <input type="hidden" name="sourcePage" value="/appointment" />
      <input
        type="text" name="website" tabIndex={-1}
        autoComplete="off" aria-hidden
        className="absolute h-0 w-0 overflow-hidden opacity-0"
      />

      {state.message && !state.ok ? <FormBanner tone="error">{state.message}</FormBanner> : null}

      <fieldset>
        <legend className="text-sm font-medium text-content">
          How would you like to meet?<span className="ml-1 text-accent">*</span>
        </legend>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          {MODES.map((value) => {
            const meta = appointmentModeMeta[value];
            const selected = mode === value;
            return (
              <label
                key={value}
                className={cn(
"cursor-pointer  border p-4 transition-all",
                  selected
                    ? "border-accent bg-accent-soft ring-2 ring-accent/20"
                    : "border-line-strong bg-surface-raised hover:border-accent/50",
                )}
              >
                <input
                  type="radio" name="mode" value={value}
                  checked={selected}
                  onChange={() => setMode(value)}
                  className="sr-only"
                />
                <span
                  className={cn(
"block text-sm font-medium",
                    selected ? "text-accent" : "text-content",
                  )}
                >
                  {meta.label}
                </span>
                <span className="mt-1 block text-xs leading-relaxed text-content-subtle">
                  {meta.help}
                </span>
              </label>
            );
          })}
        </div>
        {state.errors?.mode ? (
          <p className="mt-2 text-xs font-medium text-red-600">{state.errors.mode}</p>
        ) : null}
      </fieldset>

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
        <Field label="Town or city" name="city" error={state.errors?.city}>
          <Input id="city" name="city" autoComplete="address-level2" />
        </Field>
      </div>

      <Field
        label="What is this about?" name="topic" hint="A few words is enough — it helps Maharaj prepare." required
        error={state.errors?.topic}
      >
        <Input
          id="topic" name="topic" maxLength={140}
          placeholder="Guidance on daily practice" required
        />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          label="Preferred date and time" name="preferredAt" hint="India Standard Time." required
          error={state.errors?.preferredAt}
        >
          <Input
            id="preferredAt" name="preferredAt" type="datetime-local" defaultValue={defaultSlot(2)}
            min={defaultSlot(1)}
            required
          />
        </Field>
        <Field
          label="An alternative time" name="altAt" hint="Optional, but it usually gets you confirmed faster." error={state.errors?.altAt}
        >
          <Input id="altAt" name="altAt" type="datetime-local" min={defaultSlot(1)} />
        </Field>
      </div>

      <Field
        label="Anything you would like to say beforehand" name="message" error={state.errors?.message}
      >
        <Textarea id="message" name="message" rows={5} />
      </Field>

      <div className="flex flex-wrap items-center gap-4">
        <SubmitButton size="lg" pendingLabel="Sending request…">
          Submit Appointment Request
        </SubmitButton>
        <p className="flex items-center gap-1.5 text-xs text-content-subtle">
          <Lock className="size-3.5" aria-hidden />
          Held in confidence. No fee is charged for sitting with Maharaj.
        </p>
      </div>
    </form>
  );
}
