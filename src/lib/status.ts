import type { BookingStatus, EventStatus, YatraStatus } from "@/content/catalogue";

type Tone = "neutral" | "accent" | "temple" | "green" | "amber" | "red" | "blue";

export const yatraStatusMeta: Record<
  YatraStatus,
  { label: string; tone: Tone; open: boolean; note: string }
> = {
  DRAFT: { label: "Draft", tone: "neutral", open: false, note: "Not visible on the public site." },
  ANNOUNCED: {
    label: "Bookings open",
    tone: "green",
    open: true,
    note: "Dates announced and accepting booking requests.",
  },
  FILLING: {
    label: "Filling fast",
    tone: "amber",
    open: true,
    note: "Limited seats remaining on this departure.",
  },
  FULL: {
    label: "Full — waitlist",
    tone: "red",
    open: true,
    note: "All seats taken. New requests are added to the waitlist.",
  },
  CLOSED: {
    label: "Bookings closed",
    tone: "neutral",
    open: false,
    note: "No longer accepting requests for this departure.",
  },
  COMPLETED: {
    label: "Completed",
    tone: "neutral",
    open: false,
    note: "This yatra has already travelled.",
  },
};

export const eventStatusMeta: Record<EventStatus, { label: string; tone: Tone }> = {
  DRAFT: { label: "Draft", tone: "neutral" },
  PUBLISHED: { label: "Published", tone: "green" },
  CANCELLED: { label: "Cancelled", tone: "red" },
  COMPLETED: { label: "Completed", tone: "neutral" },
};

export const bookingStatusMeta: Record<BookingStatus, { label: string; tone: Tone }> = {
  PENDING: { label: "Pending", tone: "amber" },
  CONFIRMED: { label: "Confirmed", tone: "green" },
  WAITLISTED: { label: "Waitlisted", tone: "blue" },
  CANCELLED: { label: "Cancelled", tone: "red" },
  COMPLETED: { label: "Completed", tone: "neutral" },
};

export const appointmentModeMeta = {
  IN_PERSON: { label: "In person", help: "Sit with Maharaj at the mission in Thrissur." },
  VIDEO_CALL: { label: "Video call", help: "A video call, for those outside Kerala or abroad." },
  PHONE_CALL: { label: "Phone call", help: "A voice call at the agreed time." },
} as const;

export const bookingStatusOrder: BookingStatus[] = [
  "PENDING",
  "CONFIRMED",
  "WAITLISTED",
  "COMPLETED",
  "CANCELLED",
];
