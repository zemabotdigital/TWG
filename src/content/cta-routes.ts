/**
 * CTA routing — store checkout where a ticket page exists, WhatsApp otherwise.
 *
 * Every booking call-to-action on the site resolves to one of these routes.
 * The event IDs and trigger tokens are the contract between this website and
 * the WhatsApp automation platform: the platform matches the trigger in the
 * incoming message and hands the conversation to the matching flow.
 *
 * Keep IDs and triggers here and nowhere else. If a trigger is renamed on the
 * platform it must be renamed here in the same change, or messages arrive
 * carrying a token that no flow recognises.
 *
 * IMPORTANT: a wa.me link only PRE-FILLS a message. The visitor must press
 * send. Nothing is delivered, and no bot starts, until they do.
 */

export type CtaRouteKey =
  | "sri_lanka"
  | "guru_event"
  | "nepal"
  | "maharaj_appointment"
  | "general";

export type CtaRoute = {
  /** Stable identifier shared with the CRM and the automation platform. */
  eventId: string;
  /** Token the platform matches to pick the flow. Must be unique. */
  trigger: string;
  /** Button text shown to the visitor. */
  cta: string;
  /** Human label used in tracking and admin views. */
  label: string;
  /** First line of the prefilled message, after the greeting. */
  intent: string;
  /** Optional factual line — dates, venue. Never invented. */
  context?: string;
  /**
   * Ticket checkout page on the store.
   *
   * When set, the CTA sends the visitor to this page instead of opening
   * WhatsApp. Only the three bookable journeys carry one; every other route
   * (general enquiry, appointments) is unaffected and still uses WhatsApp.
   */
  checkoutUrl?: string;
};

export const CTA_ROUTES: Record<CtaRouteKey, CtaRoute> = {
  sri_lanka: {
    eventId: "TWG-SRI-LANKA-2026",
    trigger: "TWG_SRI_LANKA",
    cta: "Book My Ticket",
    label: "Sri Lanka Heritage Yatra",
    intent: "I am interested in the Sri Lanka Heritage Yatra.",
    context: "30 October – 3 November 2026 · 4 nights · departing Thrissur",
    checkoutUrl:
      "https://storetravelwithguru.aistore.bz/product/6ae086e326ad90ea7b1faa67",
  },
  guru_event: {
    eventId: "TWG-GURU-ATHIRAPPILLY-2026",
    trigger: "TWG_GURU_EVENT",
    cta: "Book My Ticket",
    label: "Guruvine Ariyan Guruvinoppam",
    intent: "I am interested in Guruvine Ariyan Guruvinoppam.",
    context: "7 – 8 November 2026 · Plantation Valley Resort, Athirappilly",
    checkoutUrl:
      "https://storetravelwithguru.aistore.bz/product/6ae0874a26ad90ea7b1faa97",
  },
  nepal: {
    eventId: "TWG-NEPAL-2026",
    trigger: "TWG_NEPAL",
    cta: "Book My Ticket",
    label: "Nepal Yatra",
    intent: "I am interested in the Nepal Yatra.",
    // Exact dates deliberately omitted — the business must supply them.
    context: "November 2026",
    checkoutUrl:
      "https://storetravelwithguru.aistore.bz/product/6ae0ee41ea4a86fbc1d282be",
  },
  maharaj_appointment: {
    eventId: "TWG-MAHARAJ-APPOINTMENT",
    trigger: "TWG_MAHARAJ_APPT",
    cta: "Submit Appointment Request",
    label: "Appointment with Maharaj",
    intent: "I have submitted an appointment request with Maharaj.",
  },
  general: {
    eventId: "TWG-GENERAL",
    trigger: "TWG_GENERAL",
    cta: "Message us",
    label: "General enquiry",
    intent: "I would like to know more about Travel With Guru.",
  },
};

/**
 * Maps a programme slug to its route.
 *
 * Returns null when nothing matches — deliberately. A programme with no
 * dedicated flow must never land silently in another programme's bot.
 * Callers choose the fallback explicitly.
 */
export function routeForSlug(slug: string): CtaRouteKey | null {
  if (slug.startsWith("sri-lanka")) return "sri_lanka";
  if (slug.startsWith("guruvinae-ariyan") || slug.startsWith("guruvine-ariyan")) {
    return "guru_event";
  }
  if (slug.startsWith("nepal")) return "nepal";
  return null;
}

export function getRoute(key: CtaRouteKey): CtaRoute {
  return CTA_ROUTES[key];
}
