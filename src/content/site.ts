/**
 * Site-wide constants: name, navigation, and the default values for
 * settings that can later be overridden from the admin dashboard.
 */

export const site = {
  name: "Travel With Guru",
  tagline: "Shiva Mayam — one consciousness pervading everything, and world peace built on that ground.",
  description:
    "The mission of Dr Sujin JaiGuru Maharaja — carrying the recognition that one consciousness pervades everything, and building world peace on that ground through international journeys, assemblies and the philosophy of Sree Narayana Guru.",
  locale: "en_IN",
} as const;

export const mainNav = [
  { href: "/maharaj", label: "Maharaja" },
  { href: "/philosophy", label: "Philosophy" },
  { href: "/yatra", label: "Journeys" },
  { href: "/events", label: "Events" },
  { href: "/appointment", label: "Meet Maharaja" },
  { href: "/contact", label: "Contact" },
] as const;

/**
 * Defaults for anything editable at /admin/settings.
 * The dashboard writes overrides into the SiteSetting table; these are
 * what the site falls back to before an override exists.
 */
export const settingDefaults = {
  storeUrl: "https://storetravelwithguru.aistore.bz",
  storeLabel: "Visit the Store",
  storeNote:
    "Books, prayer beads and mission publications — handled on our store.",
  contactPhone: "+91 94460 84555",
  contactWhatsapp: "+91 94460 84555",
  contactEmail: "travelwithguruind@gmail.com",
  contactAddress: "",
  youtubeUrl: "",
  instagramUrl: "",
  facebookUrl: "",
  donationNote: "",
} as const;

export type SettingKey = keyof typeof settingDefaults;

/** Rendered on the settings screen so the admin knows what each field does. */
export const settingMeta: Record<
  SettingKey,
  { label: string; help: string; type?: "url" | "text" | "textarea" | "tel" | "email" }
> = {
  storeUrl: {
    label: "Store link",
    help: "Full address of your online store, starting with https://. Leave blank to hide the store button everywhere on the site.",
    type: "url",
  },
  storeLabel: {
    label: "Store button text",
    help: "What the store button says. Keep it short.",
    type: "text",
  },
  storeNote: {
    label: "Store description",
    help: "One line shown beside the store button on the home page.",
    type: "textarea",
  },
  contactPhone: { label: "Phone", help: "Shown in the footer and on the contact page.", type: "tel" },
  contactWhatsapp: {
    label: "WhatsApp number",
    help: "Include country code, e.g. +919876543210. Used for the WhatsApp button.",
    type: "tel",
  },
  contactEmail: { label: "Email", help: "Where general enquiries should go.", type: "email" },
  contactAddress: {
    label: "Address",
    help: "Ashram or office address, one line per row.",
    type: "textarea",
  },
  youtubeUrl: { label: "YouTube", help: "Channel link. Leave blank to hide.", type: "url" },
  instagramUrl: { label: "Instagram", help: "Profile link. Leave blank to hide.", type: "url" },
  facebookUrl: { label: "Facebook", help: "Page link. Leave blank to hide.", type: "url" },
  donationNote: {
    label: "Offerings note",
    help: "Optional line about voluntary offerings, shown on the contact page.",
    type: "textarea",
  },
};
