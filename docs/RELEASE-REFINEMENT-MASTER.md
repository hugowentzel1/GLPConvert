# Sunspire Release Refinement — Master Document (Mandatory Format)

**Use the whole repo context; search before writing.**

This document is the single source of truth: repo reality, TODO, implementation phases, verification (Playwright + Vercel), flow contracts, runbook, cost/capacity. Every item references real file paths and code. Every item has (a) exact code changes, (b) exact verification steps, (c) pass/fail acceptance.

---

## Section A: Repo Reality Check (what exists today)

### All API routes (exact paths)

| Route | File path | Purpose |
|-------|-----------|---------|
| GET /api/health | `app/api/health/route.ts` | Probes Airtable, Stripe, NREL, EIA, Resend, Google Geocoding, Google Places (config), Vercel KV, USGS 3DEP. Returns 200 if all ok, **503 if any down**. Response: `{ ok, timestamp, version, commit?, services[] }`. |
| GET /api/tenant | `app/api/tenant/route.ts` | Tenant info for dashboard; auth via token or session_id. |
| POST /api/tenant/crm-webhook | `app/api/tenant/crm-webhook/route.ts` | Save CRM webhook URL. |
| POST /api/lead | `app/api/lead/route.ts` | Store lead (Airtable upsert by email+tenant), then installer email (Resend), then optional CRM webhook. **Lead created only on submit, not on estimate.** |
| GET /api/estimate | `app/api/estimate/route.ts` | Solar quote (NREL, EIA, USGS 3DEP). **No lead created.** |
| GET /api/leads | `app/api/leads/route.ts` | List leads for company; requires x-api-key. |
| POST /api/stripe/webhook | `app/api/stripe/webhook/route.ts` | Signature verified; idempotency; checkout.session.completed → upsert tenant, send onboarding email. |
| POST /api/stripe/create-checkout-session | `app/api/stripe/create-checkout-session/route.ts` | Creates Stripe checkout; success_url `/c/[handle]?session_id=...&demo=1`. |
| GET /api/geo/normalize | `app/api/geo/normalize/route.ts` | Geocoding. |
| Others | `app/api/geocode/route.ts`, `app/api/autocomplete/route.ts`, `app/api/stripe/session/route.ts`, `app/api/stripe/create-portal-session/route.ts`, `app/api/gdpr/*`, `app/api/admin/*`, `app/api/cron/*`, `app/api/domains/*`, `app/api/events/log/route.ts`, `app/api/webhooks/*`, etc. | See `docs/API-HEALTH-COVERAGE.md` for full list. |

**Health coverage:** Every API in the quote/lead/payment path is probed or depends on a probed service. Full enumeration: `docs/API-HEALTH-COVERAGE.md`. Excluded by design: Sentry (monitoring), Vercel (hosting).

### Pages (exact paths)

- **Home/demo:** `app/page.tsx` — CTA, “How it works”, “Lead captured”, “Optional sync to your CRM”, address input.
- **Paid landing:** `app/paid/page.tsx` — Launch/lead/dashboard copy.
- **Report:** `app/report/page.tsx` — Estimate display; **paid mode:** “Request a free consult” opens `ReportLeadModal`; demo mode: “Launch Your Branded Version Now”.
- **Status:** `app/status/page.tsx` — Fetches `/api/health`, shows per-service status, version, commit; **Daily check** + **Alerts must go to support@getsunspire.com** (UptimeRobot, Sentry). Layout: `app/status/layout.tsx` (no nav).
- **Dashboard:** `app/c/[companyHandle]/page.tsx` — Post-checkout; Connect CRM; “Create test lead”; View Leads; Documentation; support@getsunspire.com.
- **Leads list:** `app/c/[companyHandle]/leads/page.tsx` — GET /api/leads; table of leads (name, email, address, phone, submitted).
- **Legal:** `app/legal/refund/page.tsx`, `app/terms/page.tsx`, `app/privacy/page.tsx`. Refund linked from footer.

### Health / status / Sentry (exact)

- **Health:** `app/api/health/route.ts` — Per-service checks with 5–8s timeouts. **Policy: any dependency down → 503.** Version from `src/config/app-info.ts`; commit from `VERCEL_GIT_COMMIT_SHA` or `VERCEL_GIT_COMMIT_REF`.
- **Status UI:** `app/status/page.tsx` — “Daily check” (UptimeRobot, status page, Sentry); “Alerts must go to support@getsunspire.com”; link to `docs/API-HEALTH-COVERAGE.md`.
- **Sentry:** `next.config.js` (withSentryConfig); `sentry.client.config.ts`, `sentry.server.config.ts`, `sentry.edge.config.ts`; `app/api/sentry-test/route.ts` (test error); `app/sentry-example-page/page.tsx`. **Configure alerts in Sentry dashboard → support@getsunspire.com.**

### Lead model (exact)

- **Airtable:** `src/lib/airtable.ts` — `LEAD_FIELDS`, `Lead` interface, `upsertLeadByEmailAndTenant` (dedupe by email+tenant), `storeLead` → `upsertLead`.
- **POST /api/lead order:** 1) Validate, 2) **Store lead (Airtable)**, 3) Fetch tenant, 4) **Send installer email (Resend)**, 5) **Dashboard** (same record via GET /api/leads), 6) **Optional CRM webhook** (POST to tenant URL). Code: `app/api/lead/route.ts` lines 77–191.
- **Installer email:** Subject `New Sunspire Lead – {systemKw} System – {cityRegion}`; body: Name, Address, System, Est. Savings (25yr), Phone, Email; “View full report → Dashboard” link to `/c/[tenantSlug]/leads`. No screenshot. Code: `app/api/lead/route.ts` lines 113–164.

### Stripe flow (exact)

- **Checkout:** `app/api/stripe/create-checkout-session/route.ts` — success_url `/c/[handle]?session_id={CHECKOUT_SESSION_ID}&demo=1`.
- **Webhook:** `app/api/stripe/webhook/route.ts` — `STRIPE_WEBHOOK_SECRET` verification; idempotency; `handleCheckoutCompleted` → upsertTenantByHandle, sendOnboardingEmail (Resend). Tenant “active” only after webhook succeeds (server-side).

---

## Section B: Master TODO List (grouped + ordered)

1. **Health/status + alerting** — Done. Version/commit in health; status page with daily check + support@getsunspire.com; 503 policy; `docs/API-HEALTH-COVERAGE.md`.
2. **Cost/capacity** — Done. `docs/COST-CAPACITY-MATRIX.md`; timeouts/rate limits in estimate, lead, Stripe.
3. **Lead wording + functionality** — Done. Lead only at submit; schema in `docs/LEAD-SCHEMA-AND-DELIVERY.md`; idempotency (email+tenant); consent in `ReportLeadModal` and `LeadModal`; installer email structured + dashboard link.
4. **Post-purchase flow** — Done. `docs/POST-PURCHASE-FLOW.md`; webhook → tenant → onboarding email; dashboard with test lead, CRM, docs.
5. **Formatting/spacing** — Done. `docs/SPACING-SCALE.md`; consistent tokens.
6. **Legal + refund preparedness** — Done. Refund at `/legal/refund`; cancellation (Stripe portal); `docs/RUNBOOK-FAILURES.md`; `docs/CHARGEBACK-EVIDENCE-TEMPLATE.md`; `docs/FINANCIAL-SANITY-CHECKLIST.md`; Stripe descriptor location documented.
7. **E2E tests** — Done. Smoke, full-flow, full-user-journey, verify-everything, exhaustive user journey; single command; local + Vercel preview instructions.

---

## Section C: Implementation Plan (phases — completed)

- **Phase 1:** Health version/commit; status daily check + support@getsunspire.com; API coverage doc.
- **Phase 2:** Cost-capacity doc; timeouts verified.
- **Phase 3:** Lead schema doc; installer email template (subject/body); ReportLeadModal + consent.
- **Phase 4:** Post-purchase doc; chargeback template; runbook.
- **Phase 5:** Playwright suites; verification doc.

---

## Section D: Verification Plan (Playwright + manual)

### Single command (run all E2E)

```bash
npx playwright test tests/e2e/smoke.spec.ts tests/e2e/full-flow-and-crm-sync.spec.ts tests/e2e/full-user-journey.spec.ts tests/e2e/verify-everything.spec.ts tests/e2e/exhaustive-user-journey.spec.ts --reporter=list --workers=1
```

**Without exhaustive (faster):** omit `tests/e2e/exhaustive-user-journey.spec.ts`. The exhaustive spec runs one long flow (demo → report → paid → checkout mock → dashboard → leads → status → health → legal → footer) and can take 2–4 minutes.

### Local

1. Start app: `npm run dev` (or Playwright webServer starts it if BASE_URL unset).
2. Run command above. **Pass:** All tests green.
3. Health: `curl http://localhost:3000/api/health` → JSON with `version`, `timestamp`, `services`, `ok`; if any probed service down → **503**.
4. Status: Open `http://localhost:3000/status` → “Daily check”, “Alerts must go to support@getsunspire.com”, service list, no header.

### Vercel preview

1. Push branch; get preview URL.
2. `BASE_URL=https://<preview-url> npx playwright test tests/e2e/smoke.spec.ts tests/e2e/full-flow-and-crm-sync.spec.ts tests/e2e/full-user-journey.spec.ts tests/e2e/verify-everything.spec.ts tests/e2e/exhaustive-user-journey.spec.ts --reporter=list --workers=1`
3. **Pass:** All tests green against preview.

### Manual (operator)

- **UptimeRobot:** Add monitor GET `https://<domain>/api/health`; add alert contact **support@getsunspire.com**.
- **Sentry:** Project Settings → Alerts → set notifications to **support@getsunspire.com**. Trigger test error via `/api/sentry-test` or sentry-example-page (if enabled) and confirm email.
- **Stripe:** Webhook signature verification tested; descriptor in Dashboard → Settings → Branding.

### Acceptance (pass/fail)

| Check | Pass criteria |
|-------|----------------|
| /api/health | Returns JSON; version, timestamp, services[]; 503 if any dependency down. |
| UptimeRobot | Can be configured with one URL (/api/health); non-200 = failure. |
| Sentry | Captures test error; alerts configurable to support@getsunspire.com. |
| Lead idempotency | Playwright: double POST same email+tenant → both 200, both success true (or both 500 if tenant missing). |
| Lead only at submit | No lead created on GET /api/estimate; lead created only on POST /api/lead. |
| Refund/cancel/chargeback | Refund page, runbook, chargeback template exist and linked. |

---

## Section E: Final Flow Contracts

### What happens when someone buys? (Buyer flow)

1. User clicks “Launch Your Branded Version” (or equivalent) → POST `/api/stripe/create-checkout-session` → redirect to Stripe Checkout.
2. User pays → Stripe sends `checkout.session.completed` to POST `/api/stripe/webhook`.
3. Webhook verifies signature (`STRIPE_WEBHOOK_SECRET`), idempotency (event id), then: **upsert tenant in Airtable** (Company Handle, Plan, Payment Status Paid, Stripe Customer ID, etc.), **send onboarding email (Resend)** to customer_email with dashboard link and next steps.
4. User redirected to **success_url:** `/c/[handle]?session_id=...&demo=1`.
5. **Activation confirmation:** Dashboard shows “you’re live” checklist (instant URL, embed code, Connect CRM, “Create test lead”, View Leads, link to docs). Onboarding state: tenant record in Airtable; lead delivery = Notification Email + optional CRM Webhook URL (set in dashboard or Airtable).
6. Tenant is **active only after webhook succeeds** (server-side). No client-only flip.

### Homeowner → Lead (exact ordering)

1. Homeowner enters address → GET `/api/estimate` → estimate shown. **No lead created.**
2. Homeowner clicks “Request a free consult” (paid report) → modal opens → submits name, email, phone (optional), consent → POST `/api/lead`.
3. Backend order: **(1) Write lead to Airtable** (upsert by email+tenant); **(2) Show homeowner confirmation** (“You’ll hear back within 1 business day”); **(3) Send installer notification email (Resend)**; **(4) Lead visible in installer dashboard** (GET /api/leads); **(5) Optional: POST to CRM webhook** if tenant has URL.

### Installer notification email (exact template from code)

- **Subject:** `New Sunspire Lead – {systemKw} System – {cityRegion}`  
  Example: `New Sunspire Lead – 8.4kW System – Atlanta`
- **From:** `no-reply@{domain}` (from ENV.NEXT_PUBLIC_APP_URL or fallback)
- **To:** Tenant’s “Notification Email” (Airtable)
- **Body (structured data, no screenshot):**
  - Name  
  - Address  
  - System (e.g. 8.4kW)  
  - Est. Savings (25yr) (e.g. $38,000)  
  - Phone  
  - Email (mailto link)  
  - **View full report → Dashboard** → link to `{APP_URL}/c/{tenantSlug}/leads`
- **Code:** `app/api/lead/route.ts` lines 118–139 (subject, html, text).

### Dashboard lead view

- **Leads list:** `/c/[handle]/leads` — table of leads (name, email, address, phone, submitted). Data from GET `/api/leads`. **Reconstructing full report per lead:** Current implementation shows list; full “report view” per lead (same as homeowner saw) can be added as `/c/[handle]/leads/[leadId]` later. Installer gets structured data in email + link to leads list.

---

## Section F: Runbook (what to do when things fail)

- **Email fails (Resend):** Lead still in Airtable. Installer can see lead in dashboard. Check Resend dashboard; tenant Notification Email; RESEND_API_KEY. No automatic retry; manual resend if needed. **Doc:** `docs/RUNBOOK-FAILURES.md`.
- **Airtable fails:** POST /api/lead returns 500. Check Airtable status, keys, base/table. Webhook: Stripe retries; fix then replay if needed.
- **Webhook delayed/failing:** Stripe retries. Verify STRIPE_WEBHOOK_SECRET; endpoint returns 200 on success. Idempotency prevents duplicate tenant.
- **API down (NREL, EIA, etc.):** /api/health returns 503. Check /status page for which service. **Doc:** `docs/RUNBOOK-FAILURES.md`.
- **UptimeRobot / Sentry:** Monitor /api/health; alerts to **support@getsunspire.com**. **Doc:** `docs/API-HEALTH-COVERAGE.md`, `app/status/page.tsx`.
- **Refund/cancellation/chargebacks:** Refund policy at `/legal/refund`; cancellation via Stripe Customer Portal; chargeback evidence template: `docs/CHARGEBACK-EVIDENCE-TEMPLATE.md`.

---

## Section G: Cost/Capacity Matrix

- **Location:** `docs/COST-CAPACITY-MATRIX.md`
- **Contents:** Per service (Airtable, Stripe, NREL, EIA, Google Geocoding/Places, Resend, USGS 3DEP, Vercel KV): pricing model, rate limits, usage per quote/lead/tenant, risk scenarios, mitigation (timeouts, caching, rate limiting, demo caps).
- **Code:** Timeouts in health (5–8s), estimate (NREL/EIA), lead (Resend, CRM 8s); rate limiting in `app/api/lead/route.ts` and create-checkout-session via `src/lib/ratelimit.ts`.

---

## Acceptance summary (pass/fail)

| # | Item | Acceptance | Status |
|---|------|------------|--------|
| 1 | Health/status | /api/health returns version, commit, per-check status; 503 if any dependency down; status page with daily check + support@getsunspire.com; UptimeRobot can monitor /api/health; Sentry alerts to support@getsunspire.com. | Done |
| 2 | Cost/capacity | Doc in /docs; timeouts + rate limits in code; demo limits server-side. | Done |
| 3 | Lead | Lead only at contact submit; schema doc; idempotency; consent copy; installer email structured + dashboard link; order Airtable → email → dashboard → CRM. | Done |
| 4 | Post-purchase | Webhook verified; tenant active after webhook; onboarding email; activation page (dashboard) with test lead, CRM, docs. | Done |
| 5 | Spacing | Spacing scale documented; no layout regressions in Playwright. | Done |
| 6 | Legal | Refund policy visible; cancellation doc; chargeback template; Stripe descriptor location doc. | Done |
| 7 | Tests | Single Playwright command; local → Vercel preview; stable (deterministic locators). | Done |
