# API routes and health coverage

## All API routes (app/api)

| Route | Purpose | Probed by /api/health? |
|-------|---------|------------------------|
| GET /api/health | Aggregated health check | N/A (self) |
| GET /api/tenant | Tenant info for dashboard | No (depends on Supabase) |
| POST /api/tenant/crm-webhook | Save CRM webhook URL | No |
| POST /api/lead | Store lead, email installer, optional CRM | **Yes** (via Supabase, Resend) |
| GET /api/estimate | Solar quote (NREL, EIA, USGS) | **Yes** (NREL, EIA, USGS 3DEP) |
| GET /api/leads | List leads for company | No (depends on Supabase) |
| POST /api/stripe/webhook | Stripe events | **Yes** (Stripe) |
| POST /api/stripe/create-checkout-session | Checkout session | **Yes** (Stripe) |
| GET /api/stripe/session | Session details | No |
| POST /api/stripe/create-portal-session | Billing portal | No |
| GET /api/geo/normalize | Geocoding | **Yes** (Google Geocoding) |
| GET /api/geocode | Geocode | No (same backend as normalize) |
| GET /api/autocomplete | Places autocomplete | **Yes** (Google Places config) |
| Others (gdpr, admin, cron, domains, events, track, unsubscribe, webhooks, etc.) | Various | No (not in critical quote/lead/payment path) |

## What /api/health actually probes

- **Supabase** — Tenants table read (used by lead, webhook, tenant, leads).
- **Stripe** — balance.retrieve (used by checkout, webhook).
- **NREL** — PVWatts (used by estimate).
- **EIA** — Electricity data (used by estimate/rates).
- **Resend** — Domains list (used by lead email, onboarding).
- **Google Geocoding** — One geocode request (used by estimate when server geocodes).
- **Google Places** — Config-only (client-side autocomplete; no server ping).
- **Vercel KV** — Optional; used by webhook idempotency, rate limiting.
- **USGS 3DEP** — Elevation (used by estimate shading).

Every API that is in the **quote → lead → payment** path is either probed or depends on a probed service. Excluded by design: Sentry (monitoring), Vercel (hosting), one-off routes (cron, admin, gdpr, track, etc.).

## Daily check

- **UptimeRobot:** Monitor `GET /api/health`. Alert to **support@getsunspire.com** when status ≠ 200.
- **Sentry:** Alerts to **support@getsunspire.com** for new errors/spikes.
- **Status page:** Open `/status` to see per-service status and version.

## Status page ↔ health (verification)

- `/status` loads JSON from **`GET /api/health`** and renders each `services[]` row as **Operational** (`ok`), **Degraded**, or **Down** — not a static “all green” page.
- **Automated guard:** `tests/e2e/status-page-health-mapping.spec.ts` compares health JSON to the DOM for each `[data-service=…]` row.
