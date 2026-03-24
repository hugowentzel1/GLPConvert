# Environment variables — GLPConvert

Grouped reference. **Authoritative placeholders:** `.env.example`.

## App

| Variable | Required prod? | Purpose |
|----------|----------------|---------|
| `NEXT_PUBLIC_APP_URL` | Yes | Canonical URL for links, emails, Stripe return URLs |
| `NEXT_PUBLIC_BRAND_NAME` | No | Display default |
| `NEXT_PUBLIC_VERTICAL` | No | `glp` (future: `trt`, `pep`) |

## Supabase

| Variable | Required prod? | Purpose |
|----------|----------------|---------|
| `SUPABASE_URL` | Yes* | API URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes* | Server-only writes |
| `SUPABASE_URL_STAGING` / `_PROD` | Alt | Split env pattern |
| `SUPABASE_SERVICE_ROLE_KEY_STAGING` / `_PROD` | Alt | Matching keys |
| `SUPABASE_FETCH_TIMEOUT_MS` | No | Outbound timeout |

\*If using Supabase for tenants/leads.

## Stripe

| Variable | Required prod? | Purpose |
|----------|----------------|---------|
| `STRIPE_LIVE_SECRET_KEY` or `STRIPE_SECRET_KEY` | Yes | Server charges |
| `STRIPE_PUBLISHABLE_KEY` / `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Yes | Client |
| `STRIPE_WEBHOOK_SECRET` | Yes | Verify webhooks |
| `STRIPE_PRICE_MONTHLY_99` | For SaaS | Recurring price id |
| `STRIPE_PRICE_SETUP_399` | For SaaS | Setup price id |

## Email (Resend / SMTP)

| Variable | Required prod? | Purpose |
|----------|----------------|---------|
| `RESEND_API_KEY` | Recommended | Transactional |
| `RESEND_WEBHOOK_SECRET` | Optional | Resend events |
| `SMTP_*` | Alt | Fallback transport |
| `RESEND_FETCH_TIMEOUT_MS` | No | Timeout |

## Maps / geocode (legacy solar + address UX)

| Variable | Required prod? | Purpose |
|----------|----------------|---------|
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | If address UI on | Places autocomplete |
| `GOOGLE_GEOCODING_API_KEY` | If geocode APIs used | Server geocode |

## Solar / legacy estimate (optional for GLP-first)

| Variable | Required prod? | Purpose |
|----------|----------------|---------|
| `NREL_API_KEY` | If `/api/estimate` live | PVWatts |
| `EIA_API_KEY` | If utility rates used | Rates |
| `OPENEI_API_KEY` | Optional | OpenEI |

## Auth / admin

| Variable | Required prod? | Purpose |
|----------|----------------|---------|
| `ADMIN_TOKEN` | Yes (prod) | Admin API auth |
| `JWT_SECRET` | Recommended | Magic links / JWT |
| Local dev | — | Falls back to dev-only secret in `src/server/auth/jwt.ts` when not production |

## Vercel / ops

| Variable | Required prod? | Purpose |
|----------|----------------|---------|
| `VERCEL_TOKEN` | Optional | Domain automation |
| `VERCEL_PROJECT_ID` | Optional | Domain automation |
| `KV_*` / `REDIS_URL` | Optional | Rate limits, DLQ |
| `NEXT_PUBLIC_SENTRY_DSN` / `SENTRY_DSN` | Optional | Errors |
| `NEXT_PUBLIC_POSTHOG_KEY` | Optional | Product analytics |

## CI / E2E

| Variable | Purpose |
|----------|---------|
| `BASE_URL`, `PLAYWRIGHT_BASE_URL` | Test target |
| `E2E_*` | Demo tenant names for tests |
| `TEST_API_TOKEN` | Gated test routes |

## Secrets handling rules

- Never commit `.env` or `.env.local`.
- Vercel: set **Preview** vs **Production** scopes; rotate on team changes.
- Stripe: separate test/live keys; webhook secrets per endpoint.
