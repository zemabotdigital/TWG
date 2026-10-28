import { MessageCircle } from "lucide-react";
import { BookButton } from "../book-button";
import { getRoute, type CtaRouteKey } from "@/content/cta-routes";

/**
 * Replaces the former server-backed forms.
 *
 * This site is frontend-only — there is no server to receive, validate or
 * store a submission. Rather than show a form that looks like it works and
 * silently loses what someone writes, the request is handed to WhatsApp,
 * where a real person receives it.
 *
 * The prefilled message carries the route's trigger, exactly as every other
 * CTA on the site does, so the automation platform routes it correctly.
 */
export function WhatsAppHandoff({
  route,
  title,
  body,
  note,
  sourcePage,
}: {
  route: CtaRouteKey;
  title: string;
  body: string;
  note?: string;
  sourcePage: string;
}) {
  const meta = getRoute(route);

  return (
    <div className="text-center">
      <span className="mx-auto inline-flex size-12 items-center justify-center rounded-full bg-accent-soft text-accent">
        <MessageCircle className="size-5" aria-hidden />
      </span>

      <h2 className="mt-5 font-display text-2xl text-content">{title}</h2>

      <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-content-muted">
        {body}
      </p>

      <BookButton
        route={route}
        label={meta.cta}
        sourcePage={sourcePage}
        size="lg"
        className="mt-7 w-full sm:w-auto"
      />

      {note ? (
        <p className="mx-auto mt-5 max-w-sm text-xs leading-relaxed text-content-subtle">
          {note}
        </p>
      ) : null}
    </div>
  );
}
