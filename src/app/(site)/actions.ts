"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { buildAppointmentPayload, dispatchWebhook } from "@/lib/webhook";
import { getRoute } from "@/content/cta-routes";
import type { FormState } from "@/lib/form-state";
import {
  appointmentSchema,
  contactSchema,
  eventRegistrationSchema,
  fieldErrors,
  yatraBookingSchema,
} from "@/lib/validation";

/** Short, human-quotable reference, e.g. TWG-Y-4F2K9B. */
function makeReference(kind: "Y" | "A" | "E") {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no I/O/0/1
  let body = "";
  for (let i = 0; i < 6; i++) {
    body += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return `TWG-${kind}-${body}`;
}

function raw(formData: FormData) {
  return Object.fromEntries(formData.entries());
}

/** Shared error shape so every form fails the same way. */
function failed(errors: Record<string, string>): FormState {
  return { ok: false, errors, message: "Please check the highlighted fields and try again." };
}

function crashed(): FormState {
  return {
    ok: false,
    message:
      "Something went wrong on our side and your request was not saved. Please try again, or call the mission directly.",
  };
}

/* ── Nepal yatra booking ──────────────────────────────────────────── */

export async function requestYatraBooking(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const parsed = yatraBookingSchema.safeParse(raw(formData));
  if (!parsed.success) return failed(fieldErrors(parsed.error));

  const { yatraId, website, ...data } = parsed.data;
  if (website) return failed({ form: "Submission rejected." });

  try {
    const yatra = await prisma.yatra.findUnique({ where: { id: yatraId } });
    if (!yatra || yatra.status === "DRAFT") {
      return { ok: false, message: "That yatra is no longer available." };
    }
    if (yatra.status === "CLOSED" || yatra.status === "COMPLETED") {
      return {
        ok: false,
        message:
          "Bookings for this departure have closed. Please look at the next announced date.",
      };
    }

    // A full departure still accepts requests — they join the waitlist.
    const status = yatra.status === "FULL" ? "WAITLISTED" : "PENDING";
    const reference = makeReference("Y");

    await prisma.yatraBooking.create({ data: { ...data, yatraId, reference, status } });

    revalidatePath("/yatra");
    revalidatePath(`/yatra/${yatra.slug}`);
    revalidatePath("/admin/bookings");

    return {
      ok: true,
      reference,
      message:
        status === "WAITLISTED"
          ? "This departure is full, so you have been added to the waitlist. The mission will contact you if a seat opens."
          : "Your request has reached the mission. Someone will call you within two working days to confirm your seat and explain the next steps.",
    };
  } catch (error) {
    console.error("requestYatraBooking failed", error);
    return crashed();
  }
}

/* ── Event registration ───────────────────────────────────────────── */

export async function registerForEvent(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const parsed = eventRegistrationSchema.safeParse(raw(formData));
  if (!parsed.success) return failed(fieldErrors(parsed.error));

  const { eventId, website, ...data } = parsed.data;
  if (website) return failed({ form: "Submission rejected." });

  try {
    const event = await prisma.event.findUnique({ where: { id: eventId } });
    if (!event || event.status !== "PUBLISHED") {
      return { ok: false, message: "Registration for this event is closed." };
    }
    if (new Date(event.startsAt) < new Date()) {
      return { ok: false, message: "This event has already taken place." };
    }

    await prisma.eventRegistration.create({ data: { ...data, eventId } });

    revalidatePath(`/events/${event.slug}`);
    revalidatePath("/admin/registrations");

    return {
      ok: true,
      message:
        "You are registered. A confirmation will follow by email, and you are welcome simply to arrive on the day.",
    };
  } catch (error) {
    console.error("registerForEvent failed", error);
    return crashed();
  }
}

/* ── One-to-one appointment ───────────────────────────────────────── */

export async function requestAppointment(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const parsed = appointmentSchema.safeParse(raw(formData));
  if (!parsed.success) return failed(fieldErrors(parsed.error));

  const { website, ...data } = parsed.data;
  if (website) return failed({ form: "Submission rejected." });

  const route = getRoute("maharaj_appointment");
  const sourcePage = String(formData.get("sourcePage") ?? "/appointment");

  let reference: string;
  let appointmentId: string;

  /*
    Step 1 — persist. The visitor is told nothing until their request is
    safely stored. A webhook failure later must never lose the request.
  */
  try {
    reference = makeReference("A");
    const created = await prisma.appointment.create({
      data: { ...data, reference, routeKey: "maharaj_appointment", sourcePage },
    });
    appointmentId = created.id;
  } catch (error) {
    console.error("requestAppointment: could not store request", error);
    return crashed();
  }

  /*
    Step 2 — hand the details to the automation platform so the bot can greet
    the visitor by name instead of asking again. Delivery state is recorded
    either way; a failure here is retried from the dashboard, not by the
    visitor, and does not change what they are told.
  */
  const payload = buildAppointmentPayload({
    requestId: reference,
    fullName: data.name,
    phone: data.phone,
    email: data.email,
    city: data.city,
    meetingType:
      data.mode === "IN_PERSON"
        ? "in_person"
        : data.mode === "VIDEO_CALL"
          ? "video_call"
          : "phone_call",
    reason: data.topic,
    preferredAt: data.preferredAt,
    alternativeAt: data.altAt,
    notes: data.message,
    sourcePage,
    trigger: route.trigger,
    eventId: route.eventId,
  });

  const delivery = await dispatchWebhook({
    requestId: reference,
    requestType: "maharaj_appointment",
    payload,
  });

  try {
    await prisma.appointment.update({
      where: { id: appointmentId },
      data: {
        webhookStatus: delivery.status,
        webhookAttempts: 1,
        webhookLastError: "error" in delivery ? delivery.error : "",
        webhookSentAt: delivery.status === "SENT" ? new Date() : null,
      },
    });
  } catch (error) {
    console.error("requestAppointment: could not record delivery state", error);
  }

  revalidatePath("/admin/appointments");

  return {
    ok: true,
    reference,
    message:
      "Your request has been received and saved. The mission will confirm a time with you directly — usually within a week.",
  };
}

/* ── Contact ──────────────────────────────────────────────────────── */

export async function sendContactMessage(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const parsed = contactSchema.safeParse(raw(formData));
  if (!parsed.success) return failed(fieldErrors(parsed.error));

  const { website, name, email, phone, subject, message } = parsed.data;
  if (website) return failed({ form: "Submission rejected." });

  try {
    // Contact messages are stored as appointment records of a plain kind so
    // they land in the same dashboard the mission already checks daily.
    const reference = makeReference("E");
    await prisma.appointment.create({
      data: {
        reference,
        name,
        email,
        phone: phone || "—",
        mode: "PHONE_CALL",
        topic: `Enquiry: ${subject}`,
        message,
        preferredAt: new Date(),
        status: "PENDING",
        adminNote: "Received through the contact form.",
      },
    });

    revalidatePath("/admin/appointments");

    return {
      ok: true,
      reference,
      message: "Thank you — your message has reached the mission. We will reply soon.",
    };
  } catch (error) {
    console.error("sendContactMessage failed", error);
    return crashed();
  }
}
