"use client";

import { useActionState } from "react";
import { signIn } from "@/app/admin/actions";
import { emptyAdminState } from "@/lib/form-state";
import { Field, FormBanner, Input, SubmitButton } from "../form";

export function LoginForm() {
  const [state, action] = useActionState(signIn, emptyAdminState);

  return (
    <form action={action} className="space-y-5" noValidate>
      {state.message ? <FormBanner tone="error">{state.message}</FormBanner> : null}

      <Field label="Email" name="email" required error={state.errors?.email}>
        <Input
          id="email" name="email" type="email" autoComplete="username" autoFocus
          required
        />
      </Field>

      <Field label="Password" name="password" required error={state.errors?.password}>
        <Input
          id="password" name="password" type="password" autoComplete="current-password" required
        />
      </Field>

      <SubmitButton className="w-full" pendingLabel="Signing in…">
        Sign in
      </SubmitButton>
    </form>
  );
}
