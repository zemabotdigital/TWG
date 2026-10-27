import { CTA_ROUTES, type CtaRouteKey, type CtaRoute } from "@/content/cta-routes";

/**
 * WhatsApp click-to-chat link building.
 *
 * The business number comes from configuration, never from a literal in a
 * component. If it is missing the UI shows a disabled state rather than
 * rendering a link that goes nowhere.
 *
 * Nothing secret belongs in these URLs. A wa.me link is fully visible to the
 * visitor and to anyone they forward it to, so the prefilled message carries
 * only the trigger token and a non-sensitive request reference — never a
 * phone number, email, or anything else the visitor typed into a form.
 */

/**
 * Business number in international format, digits only.
 *
 * NEXT_PUBLIC_ is required: these links are rendered in the markup, so the
 * value is public by nature. It is a published business number, not a secret.
 */
export function getBusinessNumber(): string | null {
  const raw = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.trim();
  if (!raw) return null;

  const digits = raw.replace(/\D/g, "");
  // E.164 without the plus: country code + subscriber number.
  if (digits.length < 8 || digits.length > 15) return null;
  return digits;
}

export type CtaContext = {
  /** Non-sensitive reference, e.g. an appointment request ID. */
  reference?: string;
  /** Overrides the route's default context line. Facts only. */
  context?: string;
  /** Page the click came from, for the mission's own orientation. */
  sourcePage?: string;
};

/**
 * Builds the click-to-chat URL for a route.
 * Returns null when the number is not configured — callers must handle it.
 */
export function getWhatsAppCtaUrl(
  routeKey: CtaRouteKey,
  context: CtaContext = {},
): string | null {
  const number = getBusinessNumber();
  if (!number) return null;

  const route = CTA_ROUTES[routeKey];
  const message = buildMessage(route, context);

  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

/**
 * The prefilled message.
 *
 * Shape matters: the trigger must survive the visitor editing the greeting,
 * so it sits on its own labelled line rather than buried mid-sentence.
 */
function buildMessage(route: CtaRoute, ctx: CtaContext): string {
  const lines = [
    "Namaste.",
    route.intent,
    `Event reference: ${route.trigger}`,
  ];

  if (ctx.reference) lines.push(`Request reference: ${ctx.reference}`);

  const detail = ctx.context ?? route.context;
  if (detail) lines.push(detail);

  lines.push("Please help me understand the next steps.");

  return lines.join("\n");
}

/** True when WhatsApp CTAs can be rendered at all. */
export function whatsappIsConfigured(): boolean {
  return getBusinessNumber() !== null;
}
