# WhatsApp automation — integration handover

## 1. Existing architecture

| | |
|---|---|
| Frontend | Next.js 15.5 App Router, React 19, TypeScript, Tailwind v4 |
| Backend | Next.js **Server Actions** — there are no REST API routes |
| Database | Prisma 7 → SQLite via the `better-sqlite3` driver adapter (`dev.db`) |
| Auth | Signed JWT cookie (`jose`) + bcrypt, server-side only |
| Hosting | Not yet configured. Any Node host. `next build && next start` |
| CRM | **None existed.** The dashboard at `/admin` is the system of record |

Submissions were already stored in SQLite and surfaced in `/admin`. There was
no outbound integration of any kind before this change.

## 2. Files changed and why

| File | Why |
|---|---|
| `prisma/schema.prisma` | Added `WebhookDelivery` model, `WebhookStatus` enum, and delivery/routing fields on `Appointment` |
| `src/content/cta-routes.ts` | **New.** The single source of truth for event IDs, triggers and CTA labels |
| `src/lib/whatsapp.ts` | Rewritten as `getWhatsAppCtaUrl(route, context)`; number now from config |
| `src/lib/webhook.ts` | **New.** Server-only dispatcher with timeout, audit trail, phone normalisation |
| `src/components/book-button.tsx` | Takes a `route` instead of a free-text subject; renders disabled when unconfigured |
| `src/app/(site)/actions.ts` | `requestAppointment` now: validate → store → dispatch → record status |
| `src/app/admin/webhook-actions.ts` | **New.** Idempotent retry from the dashboard |
| `src/components/admin/webhook-status.tsx` | **New.** Delivery state + retry button |
| `src/app/(site)/appointment/page.tsx` | Restored the 9-field form (it had been replaced by a bare button) |
| `src/components/forms/appointment-form.tsx` | Success state shows the saved reference, then hands off to WhatsApp |
| `src/content/site.ts` | Store URL and real contact details |

## 3. Environment variables

```bash
# Published business number — digits only, country code, no plus.
# NEXT_PUBLIC_ is correct: wa.me links are visible in page source by nature.
NEXT_PUBLIC_WHATSAPP_NUMBER="919446084555"

# Server-side only. Never prefix these with NEXT_PUBLIC_.
AUTOMATION_WEBHOOK_URL=""        # blank → deliveries recorded as SKIPPED
AUTOMATION_WEBHOOK_SECRET=""     # sent as x-twg-signature
```

Existing: `DATABASE_URL`, `AUTH_SECRET`, and `ADMIN_EMAIL` / `ADMIN_PASSWORD`
(seed only).

## 4. CTA → bot mapping

| Route | Event ID | Trigger | CTA | Where |
|---|---|---|---|---|
| `sri_lanka` | `TWG-SRI-LANKA-2026` | `TWG_SRI_LANKA` | Book My Space | Journey card + detail |
| `guru_event` | `TWG-GURU-ATHIRAPPILLY-2026` | `TWG_GURU_EVENT` | Book My Space | Journey card + detail |
| `nepal` | `TWG-NEPAL-2026` | `TWG_NEPAL` | Book My Space | Journey card + detail |
| `maharaj_appointment` | `TWG-MAHARAJ-APPOINTMENT` | `TWG_MAHARAJ_APPT` | Submit Appointment Request | Appointment page, home |
| `general` | `TWG-GENERAL` | `TWG_GENERAL` | Message us | Contact, events, unmapped programmes |

Routing is by slug (`routeForSlug`). An unmapped slug returns `null` and the
caller falls back to `general` — a **distinct** flow, not another programme's bot.

Prefilled message (verified):

```
Namaste.
I am interested in the Sri Lanka Heritage Yatra.
Event reference: TWG_SRI_LANKA
30 October – 3 November 2026 · 4 nights · departing Thrissur
Please help me understand the next steps.
```

## 5. Webhook payload schema

```json
{
  "source": "travel_with_guru_website",
  "request_type": "maharaj_appointment",
  "request_id": "TWG-A-4F2K9B",
  "event_id": "TWG-MAHARAJ-APPOINTMENT",
  "trigger": "TWG_MAHARAJ_APPT",
  "full_name": "…",
  "phone": "919446084555",
  "email": "…",
  "city": "…",
  "meeting_type": "in_person | video_call | phone_call",
  "reason": "…",
  "preferred_datetime": "2026-11-20T04:30:00.000Z",
  "alternative_datetime": null,
  "notes": "…",
  "timezone": "Asia/Kolkata",
  "source_page": "/appointment"
}
```

Headers: `x-twg-signature` (your secret), `x-twg-request-id` (for de-duplication).
Phone is normalised to E.164-without-plus so the platform can match it to the
number WhatsApp reports when the visitor writes in.

## 6. What you must configure on the platform

1. Four flows, one per trigger. No competing global keywords.
2. A **routing flow** that reads the trigger from the first inbound message and
   transfers to the matching flow — most platforms only allow one default bot.
3. An inbound endpoint for `AUTOMATION_WEBHOOK_URL`, returning 2xx on success.
4. **A lookup by `request_id` or `phone`** so the appointment bot can greet the
   visitor with their own details instead of asking again.
5. De-duplication on `x-twg-request-id` so a retry does not double-handle.

**If the platform cannot do #4**, that is the gap. The website would then need
to expose a read-only, authenticated endpoint (`GET /api/appointments/:ref`
behind a bearer token) for the platform to call. Not built — it depends on
capabilities I cannot verify without the platform name.

## 7. Test checklist

Verified by automated end-to-end run:

- [x] All five routes produce unique event IDs and triggers
- [x] Slug routing: Sri Lanka → `TWG_SRI_LANKA`, Guru → `TWG_GURU_EVENT`, Nepal → `TWG_NEPAL`; **no cross-contamination**
- [x] Unmapped slug falls back to `general`, never another programme
- [x] Generated URL correct, message URL-encoded, trigger present
- [x] Phone normalisation across 4 input shapes → `919446084555`
- [x] Live delivery to a real listener: `SENT`, HTTP 200, signature header received, payload intact
- [x] Failure path returns `FAILED` with the reason; request still saved
- [x] Audit row written per attempt
- [x] Production build passes, all 21 routes compile
- [x] No secrets in client code — only `NEXT_PUBLIC_WHATSAPP_NUMBER` is public

Needs a human:

- [ ] Click each CTA on a real phone and confirm WhatsApp opens with the right text
- [ ] Confirm the platform's bot actually fires on each trigger
- [ ] Confirm the appointment bot retrieves the request by `request_id`
- [ ] Same person enquiring about two events does not overwrite the first
- [ ] Retry from `/admin/appointments` after a deliberate failure

## 8. Deploy and rollback

**Deploy**

```bash
npm ci
npx prisma migrate deploy
npx prisma generate
npm run build
npm start
```

Set the four environment variables first. With `AUTOMATION_WEBHOOK_URL` blank
the site still works — requests save, deliveries record as `SKIPPED`, and the
dashboard shows a Retry button for when the URL is configured.

**Rollback**

```bash
git revert <commit>
npx prisma migrate resolve --rolled-back 20261026131422_whatsapp_routing_and_webhooks
```

The migration is additive — no column was dropped — so rolling back the code
without the migration is safe. Old rows keep their defaults.

## 9. Not done, and why

- **CRM sync (Phase 5).** No CRM exists and none was named. The dashboard is
  currently the system of record. Name the platform and I will map the fields.
- **Click/conversion analytics (Phase 7).** CTAs carry `data-cta-route` and
  `data-cta-event-id` so any analytics tool can bind to them, but no provider
  is installed. A click is not a sent message — only the platform can confirm
  a conversation actually started.
- **Nepal exact dates.** The route says "November 2026" because the business
  has not supplied them.

**Nothing here is live.** The integration is tested against a local listener,
not against your real platform. Do not treat the bot as connected until a real
message has gone through it.
