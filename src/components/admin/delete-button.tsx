"use client";

import { useFormStatus } from "react-dom";

/**
 * Delete control with a native confirm() gate.
 * The confirmation happens before the form submits, so a mis-click can
 * never destroy a yatra and its booking history.
 */
export function DeleteButton({
  action,
  id,
  confirmText,
  label = "Delete",
}: {
  action: (formData: FormData) => Promise<void>;
  id: string;
  confirmText: string;
  label?: string;
}) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!window.confirm(confirmText)) e.preventDefault();
      }}
      className="inline"
    >
      <input type="hidden" name="id" value={id} />
      <Submit label={label} />
    </form>
  );
}

function Submit({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit" disabled={pending}
      className="text-sm font-medium text-red-600 hover:underline disabled:opacity-50 dark:text-red-400"
    >
      {pending ? "Deleting…" : label}
    </button>
  );
}
