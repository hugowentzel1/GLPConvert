# Vercel migration — new GLPConvert project

## Recommended approach

- **New Vercel project** linked to the GLPConvert Git repo (do not reuse Sunspire production project for clean env + domain).
- **Preview:** every PR; mirror env vars from Production where safe (use **test** Stripe keys on Preview).

## Env groups

1. **Public:** `NEXT_PUBLIC_APP_URL`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`, `NEXT_PUBLIC_VERTICAL=glp`, `NEXT_PUBLIC_ENABLE_SOLAR_ESTIMATE=0` (or omit).
2. **Server secret:** `STRIPE_LIVE_SECRET_KEY` or `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `SUPABASE_SERVICE_ROLE_KEY`, `ADMIN_TOKEN`, `JWT_SECRET`, `RESEND_API_KEY`.
3. **Optional:** `KV_*`, `SENTRY_DSN`, `VERCEL_TOKEN` for domain automation.

## Domains

- Apex `glpconvert.com` + `www` → Production.
- Preview URLs for QA (`*.vercel.app`).

## Risks

- **Redirect URLs** in Stripe must match `NEXT_PUBLIC_APP_URL` after domain cutover.
- **CSP** in `next.config.js` — add any new analytics/connect hosts.
- **Solar API off** by default — `/report` uses client fallback if `/api/estimate` returns 503.
