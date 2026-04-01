# GLPConvert — APIs and integrations (full list)

Scope: **GLP vertical** (`NEXT_PUBLIC_VERTICAL=glp`) — medical-weight-loss conversion layer, not the legacy solar quote stack.

---

## 1) External services (third-party APIs your app calls)

| Service | Purpose in GLPConvert | When it runs |
|---------|------------------------|--------------|
| **Supabase** (HTTPS PostgREST) | Tenants, leads, simulation columns, event logging storage | Most `POST /api/lead`, `POST /api/events/log`, dashboard `/api/leads`, tenant resolution |
| **Stripe API** | Checkout sessions, billing portal, balance check in health | `/api/stripe/*`, webhooks processing |
| **Resend API** | Outbound email (new lead to clinic, support, partner forms) | `/api/lead` (notify), `/api/support-ticket`, `/api/partner-apply`; health probe lists domains |
| **Meta** (`connect.facebook.net`) | Browser pixel (optional) | `/intake` when `NEXT_PUBLIC_META_PIXEL_ID` set |
| **Google** (`googletagmanager.com`) | GA4 loader (optional) | `/intake` when `NEXT_PUBLIC_GA_MEASUREMENT_ID` set |
| **Vercel API** (`api.vercel.com`) | Attach/verify custom domains | `/api/domains/*` when `VERCEL_TOKEN` + `VERCEL_PROJECT_ID` set |
| **Google Geocoding** (`maps.googleapis.com`) | Server-side address normalize | `/api/geo/normalize` when `GOOGLE_GEOCODING_API_KEY` set — **not** used by default GLP intake |
| **Google Places (browser)** | Address autocomplete | Legacy flows when `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` set — **not** default GLP funnel |
| **NREL / EIA / OpenEI / USGS shading** | Solar PVWatts + rates + shading | **`/api/estimate`**, `/report`, crons — **off** for default GLP (`health` skips NREL/EIA unless `solar_legacy` or `HEALTH_PROBE_SOLAR=1`) |
| **Sentry** | Error reporting | SDK init when DSN envs set |
| **SMTP** | Email fallback | If configured instead of Resend (`SMTP_*` in `src/config/env`) |

**Inbound webhooks (others call you):**

| Caller | Your endpoint | Purpose |
|--------|----------------|---------|
| **Stripe** | `POST /api/stripe/webhook` (and legacy `/api/webhooks/stripe`) | Subscriptions, checkout completed, invoices |
| **Resend** | `POST /api/webhooks/resend` | Email events |

---

## 2) First-party HTTP routes the GLP product commonly hits

**Patient / clinic funnel**

- `POST /api/events/log` — simulation_started, simulation_completed, simulation_lead_captured  
- `POST /api/lead` — persist GLP lead + optional Resend to tenant  
- `POST /api/recommend` — `/result`, `GlpIntakeFlow` (deterministic recommendation JSON)

**SaaS / growth (same deployment)**

- `POST /api/stripe/create-checkout-session` — pricing, nav, home CTAs  
- `GET /api/stripe/session`, `POST /api/stripe/create-portal-session` — success / billing  
- `POST /api/support-ticket`, `POST /api/partner-apply` — forms → Resend  

**Ops**

- `GET /api/health` — Supabase, optional Stripe/Resend/geocoding; GLP profile skips solar APIs  

**Dashboard (clinic)**

- `GET /api/leads` — list leads (auth-dependent)  

**Not on default GLP path** (still in repo): `/api/estimate`, `/api/cron/*`, `/api/generate-pdf`, solar report stack.

---

## 3) Environment variables ↔ external API (GLP “full stack”)

| Variable | Drives connection to |
|----------|----------------------|
| `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` | Supabase |
| `STRIPE_SECRET_KEY` or `STRIPE_LIVE_SECRET_KEY` | Stripe API |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` / `STRIPE_PUBLISHABLE_KEY` | Stripe.js / client |
| `STRIPE_WEBHOOK_SECRET` | Verifying Stripe webhook signatures |
| `STRIPE_PRICE_*` | Stripe Price IDs in checkout |
| `RESEND_API_KEY` | Resend |
| `NEXT_PUBLIC_META_PIXEL_ID` | Meta script |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Google tag |
| `VERCEL_TOKEN` + `VERCEL_PROJECT_ID` | Vercel domains API |

See **`docs/ENV_VERCEL_AND_LOCAL.md`** for exact paste instructions and **`env.local.template`** for a local copy.
