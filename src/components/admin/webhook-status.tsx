"use client";

import { useFormStatus } from "react-dom";
import { Badge } from "../ui";

type Status = "PENDING" | "SENT" | "FAILED" | "SKIPPED";

const meta: Record<Status, { label: string; tone: "green" | "amber" | "red" | "neutral" }> = {
  SENT: { label: "Delivered", tone: "green" },
  PENDING: { label: "Pending", tone: "amber" },
  FAILED: { label: "Failed", tone: "red" },
  SKIPPED: { label: "Not configured", tone: "neutral" },
};

/**
 * Shows whether the request reached the automation platform, and offers a
 * retry when it did not. Delivery is reported separately from the booking
 * status on purpose — a request can be saved and confirmed by phone while
 * the webhook never landed.
 */
export function WebhookStatusCell({
  id,
  status,
  attempts,
  lastError,
  sentAt,
  retry,
}: {
  id: string;
  status: Status;
  attempts: number;
  lastError: string;
  sentAt: string | null;
  retry: (formData: FormData) => Promise<void>;
}) {
  const m = meta[status];

  return (
    <div className="space-y-1.5">
      <Badge tone={m.tone}>{m.label}</Badge>

      {sentAt ? <p className="text-xs text-content-subtle">{sentAt}</p> : null}
      {attempts > 0 ? (
        <p className="text-xs text-content-subtle">
          {attempts} {attempts === 1 ? "attempt" : "attempts"}
        </p>
      ) : null}
      {lastError ? (
        <p className="text-xs break-words text-red-600 dark:text-red-400">{lastError}</p>
      ) : null}

      {status !== "SENT" ? (
        <form action={retry}>
          <input type="hidden" name="id" value={id} />
          <RetryButton />
        </form>
      ) : null}
    </div>
  );
}

function RetryButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="mt-1 border-2 border-line-strong px-3 py-1 text-xs font-bold text-content transition-colors hover:border-accent hover:text-accent disabled:opacity-50"
    >
      {pending ? "Sending…" : "Retry delivery"}
    </button>
  );
}
