# Integration Failure Prevention — Sunspire

**Goal:** Avoid the single most likely class of bug: **production-only integration/config failure** in the quote → lead → checkout chain. The app can look fine until a user hits a flow that depends on a missing or wrong env var, a down API, or bad tenant data.

---

## 1. Most likely failure: env variable drift

**Risk:** Local has correct keys; production is missing one, has an old one, or wrong variable name. Deploy succeeds; quote, checkout, or lead capture fails live.

**Prevention:**

- **GET /api/health** returns a **`config`** object (no secret values) showing which integrations are configured:
  - `supabase`, `stripe`, `nrel`, `eia`, `geocoding`, `resend`, `google_places`
- Check **/status** or `curl .../api/health` and confirm `config` matches what you expect for prod (e.g. `supabase: true`, `stripe: true`, `nrel: true`).
- **UptimeRobot** should monitor `GET /api/health`. When status ≠ 200, you get alerted; 503 means at least one probed service is down or misconfigured.
- Before go-live and after any env change, verify in Vercel that **every** variable below is set for the right environment (Production / Preview).

**Required for app boot (missing = build/runtime error):**

- `NREL_API_KEY`, `EIA_API_KEY`, `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`, `ADMIN_TOKEN`

**Required for quote flow:**

- `NREL_API_KEY`, `EIA_API_KEY`  
- `GOOGLE_GEOCODING_API_KEY` (server geocode; optional if you only use client Places)

**Required for lead capture and dashboard:**

- Supabase: `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` (or `_STAGING` / `_PROD` per env)

**Required for checkout and paid provisioning:**

- Stripe: `STRIPE_LIVE_SECRET_KEY` (or `STRIPE_SECRET_KEY`), `STRIPE_WEBHOOK_SECRET`, price IDs if used
- Supabase (tenant/lead storage and webhook provisioning)

**Optional but recommended:**

- `RESEND_API_KEY` (installer notification on new lead)
- `GOOGLE_GEOCODING_API_KEY` (server-side normalize)
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` (address autocomplete)

---

## 2. One API fails with no graceful fallback

**Risk:** PVWatts timeout, Stripe error, Supabase down, etc. User sees blank state or “something broke” with no retry path.

**Prevention:**

- **Quote:** Estimate API returns 500 with `{ error: "ESTIMATE_FAILED", message: "..." }`. Report page shows “Error Loading Report” + message and “Back to Home”; on catch it can show a fallback estimate so the page still renders.
- **Lead:** POST /api/lead returns 400/429/500 with clear `error`; UI should show message and retry or support path.
- **Checkout:** Session creation errors are returned to client; show support path if checkout fails.
- **Tenant/branding:** If tenant lookup fails, use default branding and still render; avoid blank branded page.

---

## 3. Demo/paid routing or tenant slug bug

**Risk:** Bad `company` slug, missing tenant in Supabase, or malformed query params → branded page loads wrong or not at all.

**Prevention:**

- Tenant is resolved by **handle** (e.g. `company=AcmeSolar` → handle `acmesolar` or `AcmeSolar` depending on storage). Ensure demo and paid flows use the same slug as in Supabase **tenants.handle**.
- Health check includes **Supabase**; if DB is down or tenant table missing, health returns 503 so you’re alerted.
- When adding a new tenant (e.g. after checkout), ensure handle and config are written to Supabase so `/c/[companyHandle]` and report `company=` resolve.

---

## 4. Backend response shape change

**Risk:** API returns a new shape (e.g. `annualProduction` instead of `annual_production`); frontend still compiles but one number or action breaks.

**Prevention:**

- Estimate API keeps a **stable response shape**: top-level `{ estimate }` with documented fields (e.g. `annualProductionKWh`, `year1Savings`, `netCostAfterITC`). Report page and lead payload use these names.
- When changing any API contract, run **smoke + API tests** (e.g. `tests/e2e/smoke.spec.ts`, `tests/api/route-integration.spec.ts`) and full report/lead flow before deploy.

---

## 5. Lead/checkout works visually but not operationally

**Risk:** User pays; Stripe session is created; webhook fails; tenant not provisioned; no email; paid account never activated.

**Prevention:**

- **Stripe webhook** is idempotent and writes to Supabase (tenant/lead, provisioning). Monitor **DLQ** (failed webhooks) in admin dashboard; replay after fixing cause (e.g. missing tenant, Supabase down).
- **Health** probes both **Stripe** and **Supabase**; if either is down, 503 so UptimeRobot alerts.
- After deploy, run a **test checkout** (test mode) and confirm: webhook runs, tenant/record in Supabase, and (if configured) confirmation email.

---

## 6. Monitoring failure points (not just uptime)

- **UptimeRobot:** Monitor `GET /api/health`. Status ≠ 200 → alert.
- **Sentry:** Alerts to **support@getsunspire.com** on error spikes; ensure API routes (estimate, lead, Stripe webhook, health) are in same app so backend errors are captured.
- **Admin dashboard:** Check DLQ count and circuit breakers; replay failed webhooks.
- **/status page:** Single place to see every service (Supabase, Stripe, NREL, EIA, Geocoding, Resend, etc.) and the **config** flags so you can spot missing config in prod.

---

## Quick checklist before go-live

1. Vercel env: All required vars set for Production (see §1).
2. `curl https://your-domain/api/health`: Status 200, `ok: true`, `config` shows expected integrations.
3. /status: All services green.
4. UptimeRobot + Sentry: Alerts to support@getsunspire.com.
5. One full flow: Demo → quote → lead submit → (optional) checkout → webhook → Supabase; no silent failures.

See **MAINTENANCE-GUIDE.md** for daily/weekly checks and **docs/API-HEALTH-COVERAGE.md** for the full route list.
