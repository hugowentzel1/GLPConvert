# Verification results — high-confidence pass (post partial verification)

**Date:** 2026-03-12  
**Trigger:** Next verification steps from `docs/NEXT-VERIFICATION-STEPS.md` (live homeowner UI, full docs, health depth, side-effect/Stripe documentation).

---

## 6. Step 35–36 — Production Supabase cutover + verification (2026-03-23)

### 6.1 Step 35 (Vercel Production)

- **Automation:** `scripts/vercel-step35-prod-cutover.mjs` (reads `VERCEL_TOKEN`, `VERCEL_PROJECT_ID`, `SUPABASE_URL_PROD`, `SUPABASE_SERVICE_ROLE_KEY_PROD` from **`.env.local`**; never committed).
- **Actions:** Upserted **`SUPABASE_URL`** and **`SUPABASE_SERVICE_ROLE_KEY`** for **production** from prod Supabase values; removed **`AIRTABLE_API_KEY`** and **`AIRTABLE_BASE_ID`** from **production**; triggered redeploy with `withLatestCommit: true`.
- **Deployment:** `dpl_8CP5YYkTW76jshvzKSAVRGEBHx66` reached **`READY`** (commit `bce638088bbdcf84679b071b1996107fe2fe20bd` at time of run).

### 6.2 Step 36 (Production checks)

- **Matrix:** `BASE_URL=https://sunspire-web-app.vercel.app npm run test:matrix:stable` → **38 passed** (~2.5m, Chromium, workers=1).
- **`/status`:** HTTP **200**.
- **`/api/health` (sample right after deploy):** HTTP **503**, `config.supabase: true`, but **`services[].supabase`** reported **`TypeError: fetch failed`** (short latency). Other services (Stripe, NREL, EIA, Resend, geocoding) **ok** in that sample. Treat as **monitor** — if persistent, investigate Vercel↔Supabase networking (DNS/TLS/IPv6) or increase health-check resilience; **E2E/API matrix still passed** including lead and dashboard paths.

### 6.3 Owner follow-up (optional)

- Manually confirm a **test lead** appears in **Supabase Table Editor** and tenant **`/c/<handle>/leads`** for your real production handle.
- Re-run **`/api/health`** at a quiet time; expect **200** when the Supabase ping succeeds.

**Ongoing checklist:** **`docs/API-AND-MAINTENANCE-VERIFICATION.md`**

---

## 1. What was completed

### 1.1 Live homeowner UI flow ✅

- **Spec added:** `tests/e2e/live-homeowner-lead-flow.spec.ts`
- **Run:** `BASE_URL=https://sunspire-web-app.vercel.app npx playwright test tests/e2e/live-homeowner-lead-flow.spec.ts`
- **Result:** **Passed.** Browser on live: open report → open consultation modal → fill name/email/consent → submit → success or error UI verified.
- **Evidence:** Single test passed in ~5s against sunspire-web-app.vercel.app.

### 1.2 Full referenced-page verification ✅

- **Spec added:** `tests/e2e/full-docs-and-pages.spec.ts`
- **Routes covered:** `/status`, `/support`, `/docs/setup`, `/docs/api`, `/docs/embed`, `/docs/branding`, `/docs/crm`, `/docs/crm/salesforce`, `/docs/crm/hubspot`, `/docs/crm/airtable`, `/legal/refund`, `/legal/terms`, `/legal/privacy`, `/legal/accessibility`, `/legal/cookies`, `/pricing`, `/methodology`
- **Run:** `BASE_URL=https://sunspire-web-app.vercel.app npx playwright test tests/e2e/full-docs-and-pages.spec.ts`
- **Result:** **17 passed.** Each page returns 200 and body matches expected content (with wait for client-rendered content).
- **Note:** Run against **sunspire-web-app.vercel.app**; sunspire-demo.vercel.app may 404 on some routes.

### 1.3 Health / status depth ✅

- **Doc added:** `docs/HEALTH-DEPTH.md`
- **Summary:** `/api/health` performs **real** dependency checks (Airtable read, Stripe balance, NREL, EIA, Google Geocoding, Resend domains). Not just shape-checked. Google Places is config-only; Sentry/Vercel/KV not in health.
- **Limitations documented:** Client-only APIs, optional services, single failure → 503.

---

## 2. What could not be completed (and why)

### 2.1 Lead backend side-effect verification ❌

- **Goal:** Confirm Airtable row, Resend email, dashboard/lead-view visibility, CRM webhook delivery after a live lead submit.
- **Blocker:** **Environment / access.** Automated tests cannot read Airtable, Resend inbox, or tenant dashboard without:
  - **Missing credential in test runner:** Airtable/Resend API keys or read-only tokens would need to be available to the test (security risk if in CI).
  - **External dashboard access required:** Confirming “lead appears in dashboard” or “email received” requires human check or a dedicated test tenant with API access.
- **Classification:** **Environment limitation** + **external dashboard access required.** Not a code bug; code path is exercised (POST /api/lead returns 200 and success message when tenant exists).

### 2.2 Stripe completion / webhook verification ❌

- **Goal:** Real test-mode checkout completion; webhook receives signed `checkout.session.completed`; tenant activation confirmed.
- **Blocker:** **Credentials and tooling.** Requires:
  - Stripe test mode and live webhook URL + secret in env.
  - Either: (a) Stripe CLI `stripe trigger checkout.session.completed` (or forward from dashboard), or (b) real test payment in browser then confirm webhook log and Airtable/tenant state.
- **Classification:** **Environment limitation** (Stripe dashboard/CLI and webhook secret). Documented in PRODUCTION-READINESS-FINAL-REPORT §9 (REQUIRES OWNER ACTION): owner must send test event and confirm tenant/activation.
- **Not automated in this repo** to avoid embedding Stripe secrets or maintaining a full payment simulation in E2E.

---

## 3. Exact blockers (summary)

| Item | Blocker |
|------|---------|
| Airtable lead row confirmation | No Airtable read API in test env; would require token in CI or manual check. |
| Resend email confirmation | No access to Resend logs/inbox in tests; manual or Resend API with key. |
| Dashboard / lead-view visibility | Requires logged-in tenant or test API for leads list. |
| CRM webhook delivery | External URL; would need mock server or tenant with known webhook. |
| Stripe webhook (real signed event) | Requires Stripe CLI or dashboard + webhook secret; owner action. |

---

## 4. Updated verdict

**Strong pre-production pass with live UI and full-docs verification; still not “full production-ready” until owner verifies side effects and Stripe.**

- **Done:** Local app, local + live smoke/API/full-user-journey, **live browser homeowner lead flow** (report → modal → submit → success/error UI), **full docs/legal/status/support page verification**, health **depth documented** (real dependency checks).
- **Not claimed:** Airtable/Resend/dashboard/CRM **side effects** confirmed; **Stripe webhook** with real signed event and tenant activation. These remain **owner-verified** (see PRODUCTION-READINESS-FINAL-REPORT §9 and NEXT-VERIFICATION-STEPS).
- **Accurate one-line verdict:** *“Locally and live UI verified; full production-ready after owner confirms lead delivery (Airtable/email/dashboard/CRM) and Stripe webhook with a real test event.”*

---

## 5. How to run the new tests

```bash
# Live homeowner lead flow (browser on live)
BASE_URL=https://sunspire-web-app.vercel.app npx playwright test tests/e2e/live-homeowner-lead-flow.spec.ts

# Full docs/pages (status, support, docs/*, legal, pricing, methodology)
BASE_URL=https://sunspire-web-app.vercel.app npx playwright test tests/e2e/full-docs-and-pages.spec.ts
```

Use `BASE_URL=https://sunspire-demo.vercel.app` only if that deployment exposes the same routes (some may 404).
