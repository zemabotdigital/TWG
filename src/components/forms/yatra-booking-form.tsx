"use client";

import { useActionState } from "react";
import { CheckCircle2, ShieldCheck } from "lucide-react";
import { requestYatraBooking } from "@/app/(site)/actions";
import { emptyFormState } from "@/lib/form-state";
import { Checkbox, Field, FormBanner, Input, SubmitButton, Textarea } from "../form";

export function YatraBookingForm({
  yatraId,
  yatraTitle,
  waitlistOnly,
}: {
  yatraId: string;
  yatraTitle: string;
  waitlistOnly: boolean;
}) {
  const [state, action] = useActionState(requestYatraBooking, emptyFormState);

  if (state.ok) {
    return (
      <div className=" border border-emerald-600/30 bg-emerald-500/10 p-7 text-center">
        <CheckCircle2
          className="mx-auto size-9 text-emerald-600 dark:text-emerald-400" aria-hidden
        />
        <h3 className="mt-4 font-display text-2xl text-content">Request received</h3>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-content-muted">
          {state.message}
        </p>
        {state.reference ? (
          <p className="mt-5 inline-block border border-line bg-surface-raised px-4 py-2.5 font-mono text-sm tracking-wider text-content">
            {state.reference}
          </p>
        ) : null}
        <p className="mt-3 text-xs text-content-subtle">
          Keep this reference — quote it when you call the mission.
        </p>
      </div>
    );
  }

  return (
    <form action={action} className="space-y-5" noValidate>
      <input type="hidden" name="yatraId" value={yatraId} />
      <input
        type="text" name="website" tabIndex={-1}
        autoComplete="off" aria-hidden
        className="absolute h-0 w-0 overflow-hidden opacity-0"
      />

      <div>
        <h3 className="font-display text-2xl text-content">
          {waitlistOnly ? "Join the waitlist" : "Request a seat"}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-content-muted">
          {waitlistOnly
            ? `This departure is full. Leave your details and the mission will contact you the moment a seat opens on ${yatraTitle}.`
            : "Send your details and the mission will call you within two working days to confirm the seat, the contribution, and what to prepare."}
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
          label="WhatsApp" name="whatsapp" hint="If different from your phone number." error={state.errors?.whatsapp}
        >
          <Input id="whatsapp" name="whatsapp" type="tel" />
        </Field>
        <Field label="Town or city" name="city" error={state.errors?.city}>
          <Input id="city" name="city" autoComplete="address-level2" />
        </Field>
        <Field
          label="Number of travellers" name="travellers" hint="Including yourself." required
          error={state.errors?.travellers}
        >
          <Input
            id="travellers" name="travellers" type="number" min={1}
            max={20}
            defaultValue={1}
            required
          />
        </Field>
      </div>

      <Checkbox
        name="passportReady" value="true" label="I hold a valid passport with at least six months left before expiry."
      />

      <Field
        label="Anything the mission should know" name="message" hint="Health needs, travelling with elders or children, first time abroad — anything that helps us look after you." error={state.errors?.message}
      >
        <Textarea id="message" name="message" rows={4} />
      </Field>

      <div className="flex flex-wrap items-center gap-4 pt-1">
        <SubmitButton size="lg" pendingLabel="Sending your request…">
          {waitlistOnly ? "Join the waitlist" : "Send booking request"}
        </SubmitButton>
        <p className="flex items-center gap-1.5 text-xs text-content-subtle">
          <ShieldCheck className="size-3.5" aria-hidden />
          No payment is taken here. Nothing is charged until you confirm by phone.
        </p>
      </div>
    </form>
  );
}
