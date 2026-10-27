"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireSession } from "@/lib/auth";
import { buildAppointmentPayload, dispatchWebhook } from "@/lib/webhook";
import { getRoute } from "@/content/cta-routes";

/**
 * Re-sends an appointment to the automation platform.
 *
 * Safe to press more than once: the payload is rebuilt from the stored
 * record, so a retry always sends the same request_id. A platform that
 * de-duplicates on that id will ignore the repeat; one that does not will
 * simply receive the same data again rather than a corrupted variant.
 */
export async function retryAppointmentWebhook(formData: FormData) {
  await requireSession();

  const id = String(formData.get("id") ?? "");
  if (!id) return;

  const appointment = await prisma.appointment.findUnique({ where: { id } });
  if (!appointment) return;

  const route = getRoute("maharaj_appointment");

  const payload = buildAppointmentPayload({
    requestId: appointment.reference,
    fullName: appointment.name,
    phone: appointment.phone,
    email: appointment.email,
    city: appointment.city,
    meetingType:
      appointment.mode === "IN_PERSON"
        ? "in_person"
        : appointment.mode === "VIDEO_CALL"
          ? "video_call"
          : "phone_call",
    reason: appointment.topic,
    preferredAt: appointment.preferredAt,
    alternativeAt: appointment.altAt,
    notes: appointment.message,
    sourcePage: appointment.sourcePage,
    trigger: route.trigger,
    eventId: route.eventId,
  });

  const attempt = appointment.webhookAttempts + 1;
  const delivery = await dispatchWebhook({
    requestId: appointment.reference,
    requestType: "maharaj_appointment",
    payload,
    attempt,
  });

  await prisma.appointment.update({
    where: { id },
    data: {
      webhookStatus: delivery.status,
      webhookAttempts: attempt,
      webhookLastError: "error" in delivery ? delivery.error : "",
      webhookSentAt: delivery.status === "SENT" ? new Date() : appointment.webhookSentAt,
    },
  });

  revalidatePath("/admin/appointments");
}
