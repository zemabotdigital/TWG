import { z } from "zod";

/** Indian mobile numbers, with or without +91, plus generous international forms. */
const phone = z
  .string()
  .trim()
  .min(7, "Enter a phone number we can reach you on")
  .max(24, "That phone number looks too long")
  .regex(/^[+\d][\d\s\-()]{6,23}$/, "Use digits, spaces and + only");

const name = z
  .string()
  .trim()
  .min(2, "Please enter your full name")
  .max(90, "That name is too long");

const email = z.email("Enter a valid email address").max(160);

const optionalText = (max: number) => z.string().trim().max(max).optional().default("");

export const yatraBookingSchema = z.object({
  yatraId: z.string().min(1),
  name,
  email,
  phone,
  whatsapp: optionalText(24),
  city: optionalText(80),
  travellers: z.coerce
    .number()
    .int("Enter a whole number")
    .min(1, "At least one traveller")
    .max(20, "For groups above 20, please call the mission directly"),
  passportReady: z.coerce.boolean().optional().default(false),
  message: optionalText(1200),
  // Honeypot: real people never fill this; bots usually do.
  website: z.string().max(0, "Submission rejected").optional().default(""),
});

export const eventRegistrationSchema = z.object({
  eventId: z.string().min(1),
  name,
  email,
  phone,
  city: optionalText(80),
  seats: z.coerce
    .number()
    .int("Enter a whole number")
    .min(1, "At least one seat")
    .max(10, "For larger groups, please contact the mission"),
  message: optionalText(1000),
  website: z.string().max(0, "Submission rejected").optional().default(""),
});

export const appointmentSchema = z.object({
  name,
  email,
  phone,
  city: optionalText(80),
  mode: z.enum(["IN_PERSON", "VIDEO_CALL", "PHONE_CALL"]),
  topic: z
    .string()
    .trim()
    .min(4, "Tell us in a few words what this is about")
    .max(140, "Please keep this under 140 characters"),
  message: optionalText(1500),
  preferredAt: z.coerce.date().refine((d) => d.getTime() > Date.now(), {
    message: "Choose a time in the future",
  }),
  altAt: z
    .union([z.coerce.date(), z.literal("")])
    .optional()
    .transform((v) => (v === "" || v === undefined ? null : v)),
  website: z.string().max(0, "Submission rejected").optional().default(""),
});

export const contactSchema = z.object({
  name,
  email,
  phone: optionalText(24),
  subject: z.string().trim().min(3, "Add a short subject").max(140),
  message: z.string().trim().min(10, "Please write a little more").max(2500),
  website: z.string().max(0, "Submission rejected").optional().default(""),
});

export const loginSchema = z.object({
  email: z.email("Enter a valid email address"),
  password: z.string().min(1, "Enter your password"),
});

/** Flattens a ZodError into { fieldName: firstMessage } for form rendering. */
export function fieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".") || "form";
    if (!(key in out)) out[key] = issue.message;
  }
  return out;
}
