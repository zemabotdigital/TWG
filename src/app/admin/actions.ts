"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/db";
import type { AdminState } from "@/lib/form-state";
import { createSession, destroySession, requireSession, verifyCredentials } from "@/lib/auth";
import { saveSettings, type SiteSettings } from "@/lib/settings";
import { settingDefaults } from "@/content/site";
import { fieldErrors, loginSchema } from "@/lib/validation";

function raw(formData: FormData) {
  return Object.fromEntries(formData.entries());
}

/** Turns "Title Of Thing" into "title-of-thing". */
function slugify(input: string) {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
}

/** Ensures the slug is unique within a table by appending -2, -3, … */
async function uniqueSlug(
  table: "event" | "yatra",
  base: string,
  ignoreId?: string,
): Promise<string> {
  const root = base || "item";
  let candidate = root;
  let n = 1;

  for (;;) {
    const existing =
      table === "event"
        ? await prisma.event.findUnique({ where: { slug: candidate }, select: { id: true } })
        : await prisma.yatra.findUnique({ where: { slug: candidate }, select: { id: true } });

    if (!existing || existing.id === ignoreId) return candidate;
    n += 1;
    candidate = `${root}-${n}`;
  }
}

/* ── Auth ─────────────────────────────────────────────────────────── */

export async function signIn(_prev: AdminState, formData: FormData): Promise<AdminState> {
  const parsed = loginSchema.safeParse(raw(formData));
  if (!parsed.success) return { ok: false, errors: fieldErrors(parsed.error) };

  const session = await verifyCredentials(parsed.data.email, parsed.data.password);
  if (!session) {
    return { ok: false, message: "Those details do not match an account." };
  }

  await createSession(session);
  redirect("/admin");
}

export async function signOut() {
  await destroySession();
  redirect("/admin/login");
}

/* ── Events ───────────────────────────────────────────────────────── */

const eventSchema = z.object({
  id: z.string().optional(),
  title: z.string().trim().min(3, "Give the event a title").max(160),
  category: z.string().trim().min(2).max(40),
  summary: z.string().trim().min(10, "Write a one-line summary").max(400),
  description: z.string().trim().min(20, "Describe the event").max(8000),
  startsAt: z.coerce.date(),
  endsAt: z
    .union([z.coerce.date(), z.literal("")])
    .optional()
    .transform((v) => (v === "" || v === undefined ? null : v)),
  venueName: z.string().trim().max(120).optional().default(""),
  venueAddress: z.string().trim().max(300).optional().default(""),
  city: z.string().trim().max(80).optional().default(""),
  isOnline: z.coerce.boolean().optional().default(false),
  onlineUrl: z.string().trim().max(400).optional().default(""),
  capacity: z
    .union([z.coerce.number().int().min(1).max(100000), z.literal("")])
    .optional()
    .transform((v) => (v === "" || v === undefined ? null : v)),
  contributionNote: z.string().trim().max(400).optional().default(""),
  coverImage: z.string().trim().max(400).optional().default(""),
  status: z.enum(["DRAFT", "PUBLISHED", "CANCELLED", "COMPLETED"]),
  featured: z.coerce.boolean().optional().default(false),
});

export async function saveEvent(_prev: AdminState, formData: FormData): Promise<AdminState> {
  await requireSession();

  const parsed = eventSchema.safeParse(raw(formData));
  if (!parsed.success) {
    return {
      ok: false,
      errors: fieldErrors(parsed.error),
      message: "Please check the highlighted fields.",
    };
  }

  const { id, onlineUrl, coverImage, ...data } = parsed.data;
  if (!data.isOnline && !data.venueName) {
    return { ok: false, errors: { venueName: "Give a venue, or mark the event as online." } };
  }

  try {
    const slug = await uniqueSlug("event", slugify(data.title), id);
    const payload = {
      ...data,
      slug,
      onlineUrl: onlineUrl || null,
      coverImage: coverImage || null,
      contributionNote:
        data.contributionNote || "Participation is free. Offerings are voluntary.",
    };

    if (id) {
      await prisma.event.update({ where: { id }, data: payload });
    } else {
      await prisma.event.create({ data: payload });
    }
  } catch (error) {
    console.error("saveEvent failed", error);
    return { ok: false, message: "Could not save the event. Please try again." };
  }

  revalidatePath("/admin/events");
  revalidatePath("/events");
  revalidatePath("/");
  redirect("/admin/events?saved=1");
}

export async function deleteEvent(formData: FormData) {
  await requireSession();
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  await prisma.event.delete({ where: { id } });
  revalidatePath("/admin/events");
  revalidatePath("/events");
  revalidatePath("/");
}

/* ── Yatras ───────────────────────────────────────────────────────── */

/** Textarea with one item per line → JSON array string. */
function linesToJson(value: FormDataEntryValue | null) {
  const lines = String(value ?? "")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  return JSON.stringify(lines);
}

/** Itinerary textarea: "Day title | detail", one per line. */
function itineraryToJson(value: FormDataEntryValue | null) {
  const days = String(value ?? "")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .map((line, i) => {
      const [title, ...rest] = line.split("|");
      return {
        day: i + 1,
        title: (title ?? "").trim(),
        detail: rest.join("|").trim(),
      };
    });
  return JSON.stringify(days);
}

const yatraSchema = z
  .object({
    id: z.string().optional(),
    title: z.string().trim().min(3, "Give the yatra a title").max(160),
    summary: z.string().trim().min(10, "Write a one-line summary").max(400),
    description: z.string().trim().min(20, "Describe the yatra").max(8000),
    destination: z.string().trim().min(2).max(160),
    departureDate: z.coerce.date(),
    returnDate: z.coerce.date(),
    departureCity: z.string().trim().min(2).max(80),
    durationNights: z.coerce.number().int().min(0).max(60),
    seatsTotal: z.coerce.number().int().min(1, "At least one seat").max(1000),
    priceFrom: z
      .union([z.coerce.number().int().min(0).max(10_000_000), z.literal("")])
      .optional()
      .transform((v) => (v === "" || v === undefined ? null : v)),
    priceNote: z.string().trim().max(300).optional().default(""),
    coverImage: z.string().trim().max(400).optional().default(""),
    status: z.enum(["DRAFT", "ANNOUNCED", "FILLING", "FULL", "CLOSED", "COMPLETED"]),
    featured: z.coerce.boolean().optional().default(false),
  })
  .refine((v) => v.returnDate >= v.departureDate, {
    message: "The return date cannot be before the departure date",
    path: ["returnDate"],
  });

export async function saveYatra(_prev: AdminState, formData: FormData): Promise<AdminState> {
  await requireSession();

  const parsed = yatraSchema.safeParse(raw(formData));
  if (!parsed.success) {
    return {
      ok: false,
      errors: fieldErrors(parsed.error),
      message: "Please check the highlighted fields.",
    };
  }

  const { id, coverImage, ...data } = parsed.data;

  try {
    const slug = await uniqueSlug("yatra", slugify(data.title), id);
    const payload = {
      ...data,
      slug,
      coverImage: coverImage || null,
      inclusions: linesToJson(formData.get("inclusions")),
      exclusions: linesToJson(formData.get("exclusions")),
      itinerary: itineraryToJson(formData.get("itinerary")),
    };

    if (id) {
      await prisma.yatra.update({ where: { id }, data: payload });
    } else {
      await prisma.yatra.create({ data: payload });
    }
  } catch (error) {
    console.error("saveYatra failed", error);
    return { ok: false, message: "Could not save the yatra. Please try again." };
  }

  revalidatePath("/admin/yatras");
  revalidatePath("/yatra");
  revalidatePath("/");
  redirect("/admin/yatras?saved=1");
}

export async function deleteYatra(formData: FormData) {
  await requireSession();
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  await prisma.yatra.delete({ where: { id } });
  revalidatePath("/admin/yatras");
  revalidatePath("/yatra");
  revalidatePath("/");
}

/* ── Request status updates ───────────────────────────────────────── */

const statusValues = ["PENDING", "CONFIRMED", "WAITLISTED", "CANCELLED", "COMPLETED"] as const;
const statusSchema = z.enum(statusValues);

export async function updateYatraBooking(formData: FormData) {
  await requireSession();

  const id = String(formData.get("id") ?? "");
  const status = statusSchema.safeParse(formData.get("status"));
  if (!id || !status.success) return;

  const amountPaidRaw = String(formData.get("amountPaid") ?? "").trim();

  await prisma.yatraBooking.update({
    where: { id },
    data: {
      status: status.data,
      adminNote: String(formData.get("adminNote") ?? "").slice(0, 2000),
      amountPaid: amountPaidRaw === "" ? 0 : Math.max(0, Number(amountPaidRaw) || 0),
    },
  });

  revalidatePath("/admin/bookings");
  revalidatePath("/yatra");
}

export async function updateAppointment(formData: FormData) {
  await requireSession();

  const id = String(formData.get("id") ?? "");
  const status = statusSchema.safeParse(formData.get("status"));
  if (!id || !status.success) return;

  const confirmedRaw = String(formData.get("confirmedAt") ?? "").trim();

  await prisma.appointment.update({
    where: { id },
    data: {
      status: status.data,
      adminNote: String(formData.get("adminNote") ?? "").slice(0, 2000),
      meetingLink: String(formData.get("meetingLink") ?? "").slice(0, 400),
      confirmedAt: confirmedRaw ? new Date(confirmedRaw) : null,
    },
  });

  revalidatePath("/admin/appointments");
}

export async function updateRegistration(formData: FormData) {
  await requireSession();

  const id = String(formData.get("id") ?? "");
  const status = statusSchema.safeParse(formData.get("status"));
  if (!id || !status.success) return;

  await prisma.eventRegistration.update({
    where: { id },
    data: {
      status: status.data,
      adminNote: String(formData.get("adminNote") ?? "").slice(0, 2000),
    },
  });

  revalidatePath("/admin/registrations");
}

/* ── Settings ─────────────────────────────────────────────────────── */

export async function updateSettings(
  _prev: AdminState,
  formData: FormData,
): Promise<AdminState> {
  await requireSession();

  const values: Partial<SiteSettings> = {};
  for (const key of Object.keys(settingDefaults) as Array<keyof SiteSettings>) {
    values[key] = String(formData.get(key) ?? "").trim();
  }

  const storeUrl = values.storeUrl ?? "";
  if (storeUrl && !/^https?:\/\/.+/i.test(storeUrl)) {
    return {
      ok: false,
      errors: { storeUrl: "Start the link with https:// — for example https://store.example.com" },
    };
  }

  try {
    await saveSettings(values);
  } catch (error) {
    console.error("updateSettings failed", error);
    return { ok: false, message: "Could not save your settings. Please try again." };
  }

  revalidatePath("/", "layout");
  return { ok: true, message: "Settings saved. The site has been updated." };
}
