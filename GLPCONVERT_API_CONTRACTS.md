# GLPConvert API contracts (v1)

This file defines the intended request/response contracts for the highest-impact API surfaces.

## `POST /api/recommend`

Purpose: deterministic recommendation from structured intake.

Request:

```json
{
  "vertical": "glp",
  "answers": [
    { "questionId": "goal", "value": "lose_weight" },
    { "questionId": "timeline", "value": "asap" }
  ]
}
```

Response:

```json
{
  "ok": true,
  "vertical": "glp",
  "recommendation": {
    "programId": "priority-consult",
    "programName": "Priority consult pathway",
    "rationale": "Based on your answers, many patients explore...",
    "priceSignal": { "kind": "range", "minUsd": 149, "maxUsd": 399 },
    "urgencyScore": 85,
    "complianceNotes": [
      "Not medical advice.",
      "A licensed provider will determine final eligibility."
    ]
  }
}
```

## `POST /api/lead`

Purpose: persist lead + notify tenant.

Required fields:

- `name`
- `email`
- `address`
- `tenantSlug`

Behavior:

- applies rate limiting
- stores lead in configured storage
- optionally sends notification email if tenant notification email + Resend key exist

## `POST /api/tenant/crm-webhook`

Purpose: set/clear tenant webhook endpoint for CRM delivery.

Request:

```json
{
  "companyHandle": "clinic-slug",
  "crmWebhookUrl": "https://example.com/hook",
  "token": "<magic-link-token>"
}
```

Response:

```json
{ "success": true, "message": "CRM webhook saved. New leads will be sent to your URL." }
```

## `POST /api/stripe/create-checkout-session`

Purpose: create onboarding checkout session.

Inputs include:

- `plan`
- attribution params (`utm_source`, `utm_campaign`)
- optional `cancel_url`

Output:

- `{ "url": "https://checkout.stripe.com/..." }`

## Webhook contracts

- `POST /api/webhooks/stripe`: subscription state and provisioning events
- `POST /api/webhooks/resend`: email event ingestion

## Error model

Standardized shape (target):

```json
{
  "ok": false,
  "error": "short_machine_code",
  "message": "human readable message"
}
```

---

## Platform inventory — Sunspire codebase (internal + external)

**Source of truth for routes:** `app/api/**/route.ts` (App Router) + `pages/api/version.ts` + `app/v1/**`.  
**Health probes today:** `GET /api/health` (see comments in `app/api/health/route.ts`).

### A) Third-party APIs the app actually calls (outbound)

| Provider | Env / trigger | Used for | GLPConvert need |
|----------|----------------|----------|-----------------|
| **Supabase** | `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` (or `_STAGING` / `_PROD`) | Tenants, leads, events storage | **Required** |
| **Stripe** | `STRIPE_LIVE_SECRET_KEY` / `STRIPE_SECRET_KEY` | Checkout, portal, webhooks, `balance.retrieve` in health | **Required** for SaaS billing |
| **Resend** | `RESEND_API_KEY` | Transactional email (`/api/lead` notify, support, partner), `GET /domains` in health | **Recommended** |
| **NREL PVWatts** | `NREL_API_KEY` | `GET /api/estimate`, `lib/pvwatts`, cron precompute | **Solar only** — skip for pure GLP |
| **EIA** | `EIA_API_KEY` | Utility / retail rates in estimate stack | **Solar only** |
| **OpenEI** | `OPENEI_API_KEY` | `lib/urdb.ts` — utility rates by lat/lon in estimate pipeline | **Solar only** |
| **Google Geocoding** | `GOOGLE_GEOCODING_API_KEY` | `GET /api/geo/normalize`, health probe | **Optional** — only if address geocode in product |
| **Google Maps / Places (client)** | `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Browser Places autocomplete; health reports “configured” only | **Optional** — GLP intake has no address today |
| **Vercel API** | `VERCEL_TOKEN` + `VERCEL_PROJECT_ID` | `app/api/domains/*` attach/status | **Optional** — white-label domain automation |
| **Meta (browser)** | `NEXT_PUBLIC_META_PIXEL_ID` | `AttributionPixels` | **Optional** — ads attribution |
| **Google Analytics 4 (browser)** | `NEXT_PUBLIC_GA_MEASUREMENT_ID` | `AttributionPixels` | **Optional** |
| **USGS 3DEP / shading** | No remote key; precomputed + `lib/usgs-shading` | Solar shading in `buildEstimate` | **Solar only** |

**Not HTTP-probed in `/api/health` but used:** Sentry SDK, Vercel KV / `REDIS_URL` (rate limit / DLQ when configured).

### B) First-party HTTP APIs (this app) — by GLP relevance

**GLP core (keep, product-critical)**

| Method | Path | Role |
|--------|------|------|
| POST | `/api/recommend` | Deterministic vertical recommendation (GLP answers) |
| POST | `/api/lead` | GLP + solar lead persistence, Resend notify, simulation metadata |
| POST | `/api/events/log` | Funnel analytics (`simulation_*`, `lead_submitted`, …) |
| GET | `/api/tenant` | Tenant resolution for dashboard / hosted experiences |
| POST | `/api/tenant/crm-webhook` | Persist clinic outbound webhook URL (CRM handoff) |
| POST | `/api/stripe/create-checkout-session` | SaaS signup / plan |
| POST | `/api/stripe/create-portal-session` | Billing portal |
| GET | `/api/stripe/session` | Checkout session lookup |
| POST | `/api/stripe/webhook` | Subscription + provisioning (canonical) |
| POST | `/api/webhooks/stripe` | Alternate Stripe webhook entry (legacy) |
| POST | `/api/webhooks/resend` | Email events |
| POST | `/v1/ingest/lead` | **API-key** server-to-server lead ingest (CORS); today solar-shaped (address + utility rate) — **extend for GLP** |
| GET | `/api/health` | Ops — should treat GLP deploys as healthy without NREL/EIA (see `MASTER_TODO` R011) |
| GET | `/api/version` (pages) | Deploy SHA |

**SaaS / ops (GLP business, non-patient)**

| Method | Path | Role |
|--------|------|------|
| POST | `/api/activate-intent` | Activation funnel |
| POST | `/api/provision` | Tenant provisioning |
| POST | `/api/admin/create-tenant` | Admin tenant create |
| GET/POST | `/api/admin/metrics`, `/api/admin/dlq`, `/api/admin/replay-webhook` | Admin / reliability |
| POST | `/api/domains/attach` `verify` `status` `prefill` | Custom domains via Vercel |
| POST | `/api/partner-apply` | Partner form → Resend |
| POST | `/api/support-ticket` | Support → Resend |

**Compliance / trust**

| Method | Path | Role |
|--------|------|------|
| GET/POST | `/api/gdpr/export`, `/api/gdpr/delete` | Data subject requests |

**Solar / legacy quote stack (exclude from GLP MVP unless `NEXT_PUBLIC_ENABLE_SOLAR_ESTIMATE` or vertical solar)**

| Method | Path | Role |
|--------|------|------|
| GET | `/api/estimate` | NREL + EIA + shading pipeline |
| GET | `/api/cron/precompute-pvwatts` | Warm PVWatts cache |
| GET | `/api/cron/refresh-rates` | Rate refresh |
| POST | `/api/calc/quote` | Quote calc |
| POST | `/api/email-report` | Report email |
| POST | `/api/generate-pdf` | PDF gen |

**Tracking / growth (optional for GLP)**

| Method | Path | Role |
|--------|------|------|
| POST | `/api/track/view`, `/api/track/cta-click` | Legacy tracking |
| POST | `/api/links/open` | Short-link redirect logging |
| POST | `/api/demo-lead`, `/api/demo-event` | Demo / sales instrumentation |

**Weak / replace**

| Method | Path | Role |
|--------|------|------|
| POST | `/api/submit-lead` | **Mock** — console only; **do not use**; prefer `POST /api/lead` |
| GET | `/api/geocode` | **Mock** city lookup — legacy |
| GET | `/api/autocomplete` | Stub (client-side Places expected) |

**Misc**

| Method | Path | Role |
|--------|------|------|
| POST | `/api/checkout` | Edge mock checkout URL — prefer real Stripe session route |
| GET | `/api/leads`, POST `/api/leads/upsert` | Lead listing / upsert |
| GET | `/api/test/last-lead` | Test helper |
| GET | `/api/public/tenant-intake-config?handle=` | Public: **bookingUrl**, logo, brand color (no secrets) |
| POST | `/api/synthetic-results` | Synthetic data |
| POST | `/api/logo-proxy` | Logo fetch proxy |
| GET | `/api/diag` | Diagnostics |
| POST | `/api/webhooks/sample-request`, `/api/webhooks/unsubscribe` | Marketing webhooks |
| GET/POST | `/api/unsubscribe` | Unsubscribe |

### C) Beneficial additions (not built yet) for GLP revenue layer

| API / integration | Why |
|--------------------|-----|
| **Outbound POST** from `storeLead` to tenant `crmWebhookUrl` | Zapier / Make / EMR — removes integration objection (R006) |
| **Inbound webhook** e.g. `POST /api/webhooks/booking` | Calendly / Jane / Acuity → set `booking_status` on lead (U016) |
| **Meta Conversions API (server)** | Deduped events + iOS/privacy resilience vs pixel-only |
| **Twilio / similar** | SMS consent + consult reminders (later; regulatory care) |
| **Signed embed tokens** | Secure iframe embed without exposing admin keys |

### D) Doc drift

- `docs/API-HEALTH-COVERAGE.md` still describes a **solar quote path**; for GLP prod, treat NREL/EIA/USGS as **optional** and adjust health semantics (R011).

