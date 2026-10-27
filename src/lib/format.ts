const TZ = "Asia/Kolkata";

export function formatDate(value: Date | string) {
  return new Date(value).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: TZ,
  });
}

export function formatDateShort(value: Date | string) {
  return new Date(value).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: TZ,
  });
}

export function formatTime(value: Date | string) {
  return new Date(value).toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: TZ,
  });
}

export function formatDateTime(value: Date | string) {
  return `${formatDate(value)} · ${formatTime(value)}`;
}

/** "12 – 16 November 2026", collapsing the month when both dates share it. */
export function formatDateRange(start: Date | string, end: Date | string) {
  const a = new Date(start);
  const b = new Date(end);
  const sameMonth = a.getMonth() === b.getMonth() && a.getFullYear() === b.getFullYear();
  if (sameMonth) {
    const day = a.toLocaleDateString("en-IN", { day: "numeric", timeZone: TZ });
    return `${day} – ${formatDate(b)}`;
  }
  return `${formatDateShort(a)} – ${formatDate(b)}`;
}

export function formatMonthYear(value: Date | string) {
  return new Date(value).toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
    timeZone: TZ,
  });
}

export function formatRupees(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

/** Value for a datetime-local input, in IST. */
export function toDateTimeLocalValue(value: Date | string) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(new Date(value));
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "00";
  return `${get("year")}-${get("month")}-${get("day")}T${get("hour")}:${get("minute")}`;
}

export function daysUntil(value: Date | string) {
  const target = new Date(value).setHours(0, 0, 0, 0);
  const today = new Date().setHours(0, 0, 0, 0);
  return Math.round((target - today) / 86_400_000);
}

/** Parses the JSON columns on Yatra, never throwing on bad data. */
export function parseJsonArray<T>(raw: string, fallback: T[] = []): T[] {
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as T[]) : fallback;
  } catch {
    return fallback;
  }
}

/** Splits a stored multi-paragraph string into paragraphs for rendering. */
export function toParagraphs(text: string) {
  return text
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);
}

/**
 * Builds a dialable `tel:` href.
 *
 * Numbers are stored the way people write them — "+91 94460 84555" — but a
 * tel: URI containing spaces is malformed, and some mobile dialers drop the
 * call or strip digits. Keep a leading +, keep the digits, discard the rest.
 */
export function telHref(raw: string) {
  const trimmed = raw.trim();
  const digits = trimmed.replace(/\D/g, "");
  return `tel:${trimmed.startsWith("+") ? "+" : ""}${digits}`;
}
