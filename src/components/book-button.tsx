import { MessageCircle, Ticket } from "lucide-react";
import { cn } from "./ui";
import { getRoute, type CtaRouteKey } from "@/content/cta-routes";
import { getWhatsAppCtaUrl, type CtaContext } from "@/lib/whatsapp";

/**
 * The single booking call-to-action used across the site.
 *
 * A route resolves one of two ways:
 *
 *   1. It has a checkoutUrl — the visitor goes to that journey's ticket page
 *      on the store. Only the three bookable journeys do.
 *   2. Otherwise the visitor opens WhatsApp with a message prefilled with that
 *      route's trigger, so the automation platform hands the conversation to
 *      the right flow. There is no shared fallback bot: a route with no
 *      trigger gets no link.
 *
 * Both kinds carry the same data attributes, so one analytics binding covers
 * checkout clicks and enquiry clicks alike.
 *
 * When a WhatsApp route has no business number configured the button renders
 * disabled with an explanation, rather than producing a dead link.
 */
export function BookButton({
  route,
  reference,
  context,
  sourcePage,
  size = "md",
  variant = "primary",
  label,
  className,
}: {
  route: CtaRouteKey;
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "inverse" | "outline";
  /** Overrides the route's default CTA text. */
  label?: string;
  className?: string;
} & CtaContext) {
  const meta = getRoute(route);
  const checkout = meta.checkoutUrl;
  const href = checkout ?? getWhatsAppCtaUrl(route, { reference, context, sourcePage });
  const text = label ?? meta.cta;
  const Icon = checkout ? Ticket : MessageCircle;

  const sizes = {
    sm: "px-5 py-2.5 text-[0.8125rem]",
    md: "px-8 py-3.5 text-[0.9375rem]",
    lg: "px-10 py-4 text-base",
  };

  const variants = {
    primary:
      "border-plum-800 bg-plum-800 text-white hover:border-accent hover:bg-accent " +
      "dark:border-accent dark:bg-accent dark:text-on-accent dark:hover:bg-accent-hover",
    inverse: "border-white bg-transparent text-white hover:border-accent hover:bg-accent",
    outline:
      "border-line-strong bg-transparent text-content hover:border-accent hover:bg-accent hover:text-on-accent",
  };

  const base =
    "inline-flex items-center justify-center gap-2 border-[3px] font-sans font-bold transition-colors duration-200";

  // Misconfiguration is visible and explained, never a silently broken link.
  if (!href) {
    return (
      <span
        role="button"
        aria-disabled="true"
        title="WhatsApp booking is not configured. Set NEXT_PUBLIC_WHATSAPP_NUMBER."
        className={cn(
          base,
          sizes[size],
          "cursor-not-allowed border-line-strong text-content-subtle opacity-60",
          className,
        )}
      >
        <MessageCircle className="size-4 shrink-0" aria-hidden />
        Booking unavailable
      </span>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      data-cta-route={route}
      data-cta-event-id={meta.eventId}
      data-cta-kind={checkout ? "checkout" : "whatsapp"}
      aria-label={
        checkout
          ? `${text} — opens the ticket page for ${meta.label}`
          : `${text} — opens WhatsApp to enquire about ${meta.label}`
      }
      className={cn(base, sizes[size], variants[variant], className)}
    >
      <Icon className="size-4 shrink-0" aria-hidden />
      {text}
    </a>
  );
}
