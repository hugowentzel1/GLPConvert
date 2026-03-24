# API Keys & Env Vars — Audit

**I don’t have access to your Vercel (or local) env.** This doc lists what the app expects and how to confirm everything works.

---

## Required by `src/config/env.ts` (app won’t start without these)

| Variable | Used for | How to get / verify |
|----------|----------|----------------------|
| `AIRTABLE_API_KEY` | Tenants, Leads, Users, post-purchase, webhooks | Airtable → Account → Developer hub → Personal access token |
| `AIRTABLE_BASE_ID` | Same base as above | Airtable base URL: `https://airtable.com/appXXXXXX/...` → `appXXXXXX` |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Address autocomplete (client), `/api/geo/normalize` (server) | Google Cloud Console → APIs: Maps JavaScript API, Places API (and Geocoding if using geo/normalize). Restrict by HTTP referrer. |
| `NREL_API_KEY` | Solar production (PVWatts v8) in `/api/estimate` | [NREL Developer](https://developer.nrel.gov/signup/) → API key. Used for `lat`/`lon` → kWh. |
| `EIA_API_KEY` | Electricity rates by state in `/api/estimate` | [EIA Open Data](https://www.eia.gov/opendata/register.php) → API key. If missing, `lib/rates.ts` uses built-in state fallback rates. |
| `ADMIN_TOKEN` | Admin dashboard, GDPR, webhook replay, create-tenant | Any long random string (e.g. `openssl rand -hex 32`). Sent as `x-admin-token` or in admin dashboard login. |

If any of these are missing when code that imports `@/src/config/env` runs, the app will throw at runtime (e.g. first request to health, estimate, or Stripe webhook).

---

## Optional (feature-specific)

| Variable | Used for | Fallback if missing |
|----------|----------|---------------------|
| `STRIPE_LIVE_SECRET_KEY` or `STRIPE_SECRET_KEY` | Checkout, webhooks | Stripe features disabled |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signature verification | Webhook will reject or fail |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Client-side Stripe | Checkout button won’t work |
| `STRIPE_PRICE_MONTHLY_99`, `STRIPE_PRICE_SETUP_399` | Price IDs for checkout | Uses env or hardcoded fallbacks in code |
| `RESEND_API_KEY` | Transactional email (onboarding, support) | Email sending disabled or uses SMTP |
| `SMTP_*` | Alternative email sending | Used if Resend not set |
| `OPENEI_API_KEY` | Optional rate source (e.g. URDB) | Not used in main estimate path; `lib/rates` uses EIA or state fallback |
| `VERCEL_TOKEN`, `VERCEL_PROJECT_ID` | Domain attach/status APIs | Domain features disabled |
| `KV_REST_API_URL`, `KV_REST_API_TOKEN` | Upstash KV (e.g. webhook idempotency, DLQ) | Features that need KV will fail or skip |
| `JWT_SECRET` | Magic links / JWT | Falls back to `ADMIN_TOKEN` in auth code |

---

## Two ENV modules (for reference)

- **`src/config/env.ts`** — Used by: health, Airtable, Stripe webhook, admin routes, email service, JWT, NSRDB, etc. **Requires** the six variables listed above (or the app throws when any of that code runs).
- **`lib/env.ts`** — Used only by `lib/pvwatts.ts` and `lib/rates.ts`. Requires `NREL_API_KEY`; `EIA_API_KEY` and `OPENEI_API_KEY` are optional (rates fall back to state table).

So: **NREL + Google + Airtable + EIA + ADMIN_TOKEN** must all be set for the main app (including health and estimate) to run without env parse errors.

---

## How to verify “everything works”

1. **Set all required vars** in Vercel (Project → Settings → Environment Variables) and optionally in local `.env` for the same names.
2. **Call the health endpoint** (after deploy or locally):
   - `GET https://<your-domain>/api/health`
   - Expect `200` and `services` array with `airtable`, `nrel`, `eia`, etc. Each service should show `status: "ok"` or `"degraded"` if the key is set and the API responded.
3. **Smoke test the main flow:**
   - Open `/` → type an address → choose a suggestion (Google autocomplete).
   - You should land on the report with an estimate (NREL + EIA or state fallback). If state was passed (e.g. CA), the report should show that state’s rate.

If `/api/health` returns 503 or a service is `down`, check that the corresponding API key is set and valid (and, for Google, that referrer restrictions allow your domain).

---

## Quick checklist (copy into Vercel)

- [ ] `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` — Google Cloud, Places + Maps JavaScript API, referrers set
- [ ] `NREL_API_KEY` — developer.nrel.gov
- [ ] `EIA_API_KEY` — eia.gov opendata
- [ ] `AIRTABLE_API_KEY` + `AIRTABLE_BASE_ID` — Airtable base for Tenants/Leads/Users
- [ ] `ADMIN_TOKEN` — random secret for admin/GDPR
- [ ] Stripe keys (if you use checkout/webhooks)
- [ ] `NEXT_PUBLIC_APP_URL` — your deployed URL (e.g. `https://sunspire-web-app.vercel.app`)
