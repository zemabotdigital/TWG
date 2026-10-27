import { prisma } from "./db";

/**
 * Outbound delivery to the WhatsApp automation platform.
 *
 * This module is server-only. The endpoint and secret are read from the
 * environment without a NEXT_PUBLIC_ prefix, so they are never bundled into
 * client JavaScript.
 *
 * Every attempt is written to WebhookDelivery before the result is known, so
 * a crash mid-flight still leaves a trace. Retries append rows rather than
 * overwriting, which keeps the history auditable.
 */

export type WebhookResult =
  | { status: "SENT"; httpStatus: number }
  | { status: "FAILED"; httpStatus?: number; error: string }
  | { status: "SKIPPED"; error: string };

function config() {
  return {
    endpoint: process.env.AUTOMATION_WEBHOOK_URL?.trim() ?? "",
    secret: process.env.AUTOMATION_WEBHOOK_SECRET?.trim() ?? "",
  };
}

export function webhookIsConfigured() {
  return config().endpoint.length > 0;
}

/**
 * Posts a payload and records the attempt.
 *
 * Never throws: a failed delivery must not lose the visitor's request, which
 * is already saved. The caller stores the returned status so the request can
 * be retried later from the dashboard.
 */
export async function dispatchWebhook({
  requestId,
  requestType,
  payload,
  attempt = 1,
}: {
  requestId: string;
  requestType: string;
  payload: Record<string, unknown>;
  attempt?: number;
}): Promise<WebhookResult> {
  const { endpoint, secret } = config();

  if (!endpoint) {
    const result: WebhookResult = {
      status: "SKIPPED",
      error: "AUTOMATION_WEBHOOK_URL is not set",
    };
    await record({ requestId, requestType, endpoint: "", payload, attempt, result });
    return result;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10_000);

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        // Lets the platform reject anything that did not come from this site.
        ...(secret ? { "x-twg-signature": secret } : {}),
        // Platforms that de-duplicate can key on this.
        "x-twg-request-id": requestId,
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
      cache: "no-store",
    });

    const result: WebhookResult = response.ok
      ? { status: "SENT", httpStatus: response.status }
      : {
          status: "FAILED",
          httpStatus: response.status,
          error: `Platform returned ${response.status}`,
        };

    await record({ requestId, requestType, endpoint, payload, attempt, result });
    return result;
  } catch (error) {
    const message =
      error instanceof Error
        ? error.name === "AbortError"
          ? "Timed out after 10s"
          : error.message
        : "Unknown error";

    const result: WebhookResult = { status: "FAILED", error: message };
    await record({ requestId, requestType, endpoint, payload, attempt, result });
    return result;
  } finally {
    clearTimeout(timeout);
  }
}

async function record({
  requestId,
  requestType,
  endpoint,
  payload,
  attempt,
  result,
}: {
  requestId: string;
  requestType: string;
  endpoint: string;
  payload: Record<string, unknown>;
  attempt: number;
  result: WebhookResult;
}) {
  try {
    await prisma.webhookDelivery.create({
      data: {
        requestId,
        requestType,
        endpoint,
        payload: JSON.stringify(payload),
        status: result.status,
        attempt,
        httpStatus: "httpStatus" in result ? (result.httpStatus ?? null) : null,
        error: "error" in result ? result.error : "",
      },
    });
  } catch (error) {
    // Logging the attempt must never break the request itself.
    console.error("Could not record webhook delivery", error);
  }
}

/**
 * The payload shape the automation platform receives for an appointment.
 *
 * Phone is normalised to E.164-without-plus so the platform can look the
 * contact up by the same number WhatsApp will report when the visitor writes in.
 */
export function buildAppointmentPayload(input: {
  requestId: string;
  fullName: string;
  phone: string;
  email: string;
  city: string;
  meetingType: "in_person" | "video_call" | "phone_call";
  reason: string;
  preferredAt: Date;
  alternativeAt: Date | null;
  notes: string;
  sourcePage: string;
  trigger: string;
  eventId: string;
}) {
  return {
    source: "travel_with_guru_website",
    request_type: "maharaj_appointment",
    request_id: input.requestId,
    event_id: input.eventId,
    trigger: input.trigger,
    full_name: input.fullName,
    phone: normalisePhone(input.phone),
    email: input.email,
    city: input.city,
    meeting_type: input.meetingType,
    reason: input.reason,
    preferred_datetime: input.preferredAt.toISOString(),
    alternative_datetime: input.alternativeAt ? input.alternativeAt.toISOString() : null,
    notes: input.notes,
    timezone: "Asia/Kolkata",
    source_page: input.sourcePage,
  };
}

/**
 * Indian numbers are entered in many shapes. The platform needs one.
 * Assumes +91 only when the number is a bare 10-digit Indian mobile.
 */
export function normalisePhone(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (digits.length === 10 && /^[6-9]/.test(digits)) return `91${digits}`;
  if (digits.startsWith("0") && digits.length === 11) return `91${digits.slice(1)}`;
  return digits;
}
