"use client";

import { useActionState } from "react";
import { CheckCircle2 } from "lucide-react";
import { sendContactMessage } from "@/app/(site)/actions";
import { emptyFormState } from "@/lib/form-state";
import { Field, FormBanner, Input, SubmitButton, Textarea } from "../form";

export function ContactForm() {
  const [state, action] = useActionState(sendContactMessage, emptyFormState);

  if (state.ok) {
    return (
      <div className=" border border-emerald-600/30 bg-emerald-500/10 p-8 text-center">
        <CheckCircle2
          className="mx-auto size-8 text-emerald-600 dark:text-emerald-400" aria-hidden
        />
        <h3 className="mt-3 font-display text-xl text-content">Message sent</h3>
        <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-content-muted">
          {state.message}
        </p>
      </div>
    );
  }

  return (
    <form action={action} className="space-y-5" noValidate>
      <input
        type="text" name="website" tabIndex={-1}
        autoComplete="off" aria-hidden
        className="absolute h-0 w-0 overflow-hidden opacity-0"
      />

      {state.message && !state.ok ? <FormBanner tone="error">{state.message}</FormBanner> : null}

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Your name" name="name" required error={state.errors?.name}>
          <Input id="name" name="name" autoComplete="name" required />
        </Field>
        <Field label="Email" name="email" required error={state.errors?.email}>
          <Input id="email" name="email" type="email" autoComplete="email" required />
        </Field>
      </div>

      <Field label="Phone" name="phone" hint="Optional." error={state.errors?.phone}>
        <Input id="phone" name="phone" type="tel" autoComplete="tel" />
      </Field>

      <Field label="Subject" name="subject" required error={state.errors?.subject}>
        <Input id="subject" name="subject" maxLength={140} required />
      </Field>

      <Field label="Your message" name="message" required error={state.errors?.message}>
        <Textarea id="message" name="message" rows={6} required />
      </Field>

      <SubmitButton size="lg">Send message</SubmitButton>
    </form>
  );
}
