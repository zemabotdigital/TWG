"use client";

import { useFormStatus } from "react-dom";
import type { ComponentProps, ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { Button, cn } from "./ui";

const controlClass =
  "w-full border-2 border-line bg-surface-raised px-4 py-3 text-[0.9375rem] text-content placeholder:text-content-subtle transition-colors focus:border-accent focus:outline-none disabled:opacity-60";

export function Field({
  label,
  name,
  hint,
  error,
  required,
  children,
  className,
}: {
  label: string;
  name: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <label htmlFor={name} className="block text-sm font-medium text-content">
        {label}
        {required ? <span className="ml-1 text-accent">*</span> : null}
      </label>
      {hint ? (
        <p id={`${name}-hint`} className="text-xs leading-relaxed text-content-subtle">
          {hint}
        </p>
      ) : null}
      {children}
      {error ? (
        <p id={`${name}-error`} className="text-xs font-medium text-red-600 dark:text-red-400">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function Input({ className, ...props }: ComponentProps<"input">) {
  return <input className={cn(controlClass, className)} {...props} />;
}

export function Textarea({ className, ...props }: ComponentProps<"textarea">) {
  return <textarea className={cn(controlClass, "min-h-28 resize-y", className)} {...props} />;
}

export function Select({ className, ...props }: ComponentProps<"select">) {
  return <select className={cn(controlClass, "pr-9", className)} {...props} />;
}

export function Checkbox({
  label,
  className,
  ...props
}: ComponentProps<"input"> & { label: string }) {
  return (
    <label
      className={cn("flex cursor-pointer items-start gap-2.5 text-sm text-content-muted", className)}
    >
      <input
        type="checkbox" className="mt-0.5 size-4 shrink-0 border-2 border-line-strong accent-[var(--color-accent)]"
        {...props}
      />
      <span className="leading-relaxed">{label}</span>
    </label>
  );
}

/** Submit button that disables and shows a spinner while the action runs. */
export function SubmitButton({
  children,
  pendingLabel = "Sending…",
  variant,
  size,
  className,
}: {
  children: ReactNode;
  pendingLabel?: string;
  variant?: ComponentProps<typeof Button>["variant"];
  size?: ComponentProps<typeof Button>["size"];
  className?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" variant={variant} size={size} disabled={pending} className={className}>
      {pending ? (
        <>
          <Loader2 className="size-4 animate-spin" aria-hidden />
          {pendingLabel}
        </>
      ) : (
        children
      )}
    </Button>
  );
}

export function FormBanner({
  tone,
  children,
}: {
  tone: "success" | "error";
  children: ReactNode;
}) {
  return (
    <div
      role="status" className={cn(
"border-2 px-4 py-3 text-sm leading-relaxed",
        tone === "success"
          ? "border-emerald-600/30 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300"
          : "border-red-600/30 bg-red-500/10 text-red-800 dark:text-red-300",
      )}
    >
      {children}
    </div>
  );
}
