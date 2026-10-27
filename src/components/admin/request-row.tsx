"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { ChevronDown } from "lucide-react";
import type { BookingStatus } from "@/generated/prisma/client";
import { bookingStatusOrder, bookingStatusMeta } from "@/lib/status";
import { Badge, cn } from "../ui";

/**
 * An expandable row for any kind of incoming request.
 *
 * Collapsed it shows who it is from and where it stands; expanded it reveals
 * the full message and the controls to update it. Keeping the editor inline
 * means the mission never loses their place in the list.
 */
export function RequestRow({
  title,
  subtitle,
  meta,
  status,
  reference,
  details,
  message,
  action,
  id,
  extraFields,
  defaultNote,
}: {
  title: string;
  subtitle: string;
  meta: string;
  status: BookingStatus;
  reference?: string;
  details: Array<{ label: string; value: React.ReactNode }>;
  message?: string;
  action: (formData: FormData) => Promise<void>;
  id: string;
  extraFields?: React.ReactNode;
  defaultNote: string;
}) {
  const [open, setOpen] = useState(false);
  const tone = bookingStatusMeta[status];

  return (
    <li className="border-b border-line last:border-0">
      <button
        type="button" onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-surface-sunken"
      >
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-medium text-content">{title}</span>
            <Badge tone={tone.tone}>{tone.label}</Badge>
          </div>
          <p className="mt-1 truncate text-sm text-content-muted">{subtitle}</p>
        </div>
        <div className="hidden shrink-0 text-right sm:block">
          <p className="text-xs text-content-subtle">{meta}</p>
          {reference ? (
            <p className="mt-0.5 font-mono text-[0.6875rem] text-content-subtle">{reference}</p>
          ) : null}
        </div>
        <ChevronDown
          className={cn(
"size-4 shrink-0 text-content-subtle transition-transform",
            open && "rotate-180",
          )}
          aria-hidden
        />
      </button>

      {open ? (
        <div className="border-t border-line bg-surface-sunken px-5 py-5">
          <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {details.map((d) => (
              <div key={d.label}>
                <dt className="text-[0.6875rem] tracking-wide text-content-subtle uppercase">
                  {d.label}
                </dt>
                <dd className="mt-0.5 text-sm break-words text-content">{d.value}</dd>
              </div>
            ))}
          </dl>

          {message ? (
            <div className="mt-5">
              <p className="text-[0.6875rem] tracking-wide text-content-subtle uppercase">
                Their message
              </p>
              <p className="mt-1.5 border border-line bg-surface-raised p-4 text-sm leading-relaxed whitespace-pre-wrap text-content-muted">
                {message}
              </p>
            </div>
          ) : null}

          <form action={action} className="mt-6 space-y-4">
            <input type="hidden" name="id" value={id} />

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-content">Status</span>
                <select
                  name="status" defaultValue={status}
                  className="w-full border border-line-strong bg-surface-raised px-3.5 py-2.5 text-sm text-content focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/25"
                >
                  {bookingStatusOrder.map((s) => (
                    <option key={s} value={s}>
                      {bookingStatusMeta[s].label}
                    </option>
                  ))}
                </select>
              </label>
              {extraFields}
            </div>

            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-content">
                Private note
              </span>
              <span className="mb-1.5 block text-xs text-content-subtle">
                Only the mission sees this. The person who made the request never does.
              </span>
              <textarea
                name="adminNote" rows={3}
                defaultValue={defaultNote}
                className="w-full border border-line-strong bg-surface-raised px-3.5 py-2.5 text-sm text-content focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/25"
              />
            </label>

            <SaveButton />
          </form>
        </div>
      ) : null}
    </li>
  );
}

function SaveButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit" disabled={pending}
      className="inline-flex h-10 items-center rounded-full bg-accent px-5 text-sm font-medium text-on-accent transition-colors hover:bg-accent-hover disabled:opacity-60"
    >
      {pending ? "Saving…" : "Update"}
    </button>
  );
}
