# Evidence verification pass — final claims

This document surfaces the evidence for the production-readiness pass. No new code changes.

---

## 1. Exact files changed in commits 200bc66 and cad3c5a

**Commit 200bc66** (`chore: production readiness — health version, build fixes, e2e test alignment`):

```
 app/api/health/route.ts             |   4 +-
 lib/cache.ts                        |  14 +++
 src/lib/airtable.ts                |  27 +++++
 tests/e2e/full-user-journey.spec.ts | 196 ++++++++++++++++++++++++++++++++++++
 tests/e2e/verify-everything.spec.ts |   7 +-
 5 files changed, 243 insertions(+), 5 deletions(-)
```

**Commit cad3c5a** (`test: health API test accept optional version/commit; add final production readiness report`):

```
 docs/PRODUCTION-READINESS-FINAL-REPORT.md | 195 ++++++++++++++++++++++++++++++
 tests/e2e/full-user-journey.spec.ts       |   5 +-
 2 files changed, 198 insertions(+), 2 deletions(-)
```

To reproduce: `git show 200bc66 --stat` and `git show cad3c5a --stat`.

---

## 2. Exact Playwright test files that were run

**Local (BASE_URL=http://localhost:3001):**

- `tests/api/route-integration.spec.ts` — 6 tests  
- `tests/e2e/smoke.spec.ts` — 8 tests  
- `tests/e2e/full-user-journey.spec.ts` — 14 tests  
- `tests/e2e/verify-everything.spec.ts` — run (multiple steps)  
- `tests/e2e/full-flow-and-crm-sync.spec.ts` — run (48-test batch; some failures then fixed via full-user-journey/verify-everything alignment)

**Live (BASE_URL=https://sunspire-web-app.vercel.app):**

- `tests/api/route-integration.spec.ts` — 6 tests  
- `tests/e2e/smoke.spec.ts` — 8 tests  
- `tests/e2e/full-user-journey.spec.ts` — 14 tests  

**Not run on live:** `verify-everything.spec.ts`, `full-flow-and-crm-sync.spec.ts`, or any other e2e spec.

---

## 3. What each test actually covers

### Demo buyer flow

- **full-user-journey (1, 2, 4, 12):** Homepage demo (company=AcmeSolar&demo=1), body copy and CTA visible; report with demo params and NREL content; paid landing `/paid?company=AcmeSolar`; checkout: click primary CTA, intercept `create-checkout-session`, assert redirect to Stripe or session URL; demo URL with company=Netflix and branding.
- **smoke:** Landing with `?demo=1`, CTA visible; demo URL with company=TestCo, body has solar/quote/branded/Launch/demo.
- **verify-everything:** Demo home load, demo copy, demo report with NREL, demo CTA band, primary CTA triggers checkout (intercept).
- **full-flow-and-crm-sync:** Health, then landing `?company=TestCo&demo=1`, then report URL, then **POST /api/lead** (no UI).

**Summary:** Demo URL, homepage copy, report with estimate, CTA visibility, and **checkout session creation (request intercepted, no real payment)**. No real Stripe payment or webhook.

### Homeowner lead flow

- **full-user-journey (2, 10, 11, 13):** Report page with address in URL; **POST /api/lead** with full payload (request only, no UI); **GET /api/estimate** only; report CTA text (Book/Download/Copy vs Unlock/Launch).
- **smoke:** Report URL loads, body has NREL/estimate/savings; **POST /api/lead** with name+email only → expect 400.
- **full-flow-and-crm-sync:** **Homeowner lead flow (UI):** go to report (no demo), click “Request a free consult”, wait for dialog, fill name/email, check consent, submit, then assert body has “You're all set” or error text. **No assertion on Airtable/Resend.** Also: POST /api/lead (full and minimal payloads), idempotency (double POST), utm_source/demo_or_paid.

**Summary:**  
- **API:** POST /api/lead (validation 400, full payload 200/500) and GET /api/estimate.  
- **UI (local only):** full-flow-and-crm-sync “Report page: Request a free consult opens modal; submit shows success or CTA visible” — modal open, form fill, submit, success/error text.  
- **UI on live:** Not run. No test on live fills the consultation modal or submits from the UI.

### Checkout initiation

- **full-user-journey (4):** Click primary CTA, intercept `**/api/stripe/create-checkout-session`, forward request, then assert either redirect to stripe.com/checkout or response with `url` matching `/c/acme-solar?session_id=` or `checkout.stripe.com`.
- **verify-everything (Step 5):** Same idea — CTA click triggers checkout (intercept).

**Summary:** Checkout **initiation** only: session creation request and redirect/URL. No real payment, no webhook, no Airtable update.

### Health/status pages

- **route-integration:** GET /api/health → status 200 or 503, body has `timestamp` and `services` array.
- **smoke:** GET /api/health (200 or 503, only Stripe may be down); GET /api/health + page.goto(/status), status 200.
- **full-user-journey (6, 7):** GET /api/health (timestamp, services, optional version/commit); page.goto(/status), wait for status content, body has System Status, service names, Sentry/support.

**Summary:** Health endpoint response shape and status; status page loads and shows expected text. No assertion that health “calls” real backends (only that the app’s health route returns the expected structure).

### Docs/maintenance/status links

- **full-user-journey (9):** Homepage footer/links for Refund|Privacy|Terms; goto `/legal/refund` and body has refund/setup/24 hours; goto `/terms` and body has Terms/refund/subscription.
- **full-user-journey (14):** goto `/docs/crm`, body has CRM/Zapier/Make/HubSpot/webhook.

**Summary:** Legal (refund, terms, privacy) and docs/crm **pages load and contain expected copy**. No systematic crawl of MAINTENANCE-GUIDE or other doc links; no “maintenance” route.

---

## 4. Exact sections in docs/PRODUCTION-READINESS-FINAL-REPORT.md

- **Local results:** **Section 4. LOCAL VERIFICATION RESULTS** — starts at line **79** (bullets: local app started, Playwright 28/28, API/backend, docs/status/navigation).  
- **Live results:** **Section 5. LIVE VERIFICATION RESULTS** — starts at line **88** (deployment URL, live Playwright 14+14, live API, live vs local).  
- **Remaining risks:** **Section 8. REMAINING RISKS** — starts at line **136** (Stripe webhook live, lead→Airtable/email/CRM, UptimeRobot/Sentry).  
- **REQUIRES OWNER ACTION:** **Section 9. REQUIRES OWNER ACTION** — starts at line **144** through ~165 (UptimeRobot, Sentry, Stripe webhook live).

---

## 5. Live lead submission: UI level only or backend side effects too?

**Backend side effects were not verified.**

- **On live we only ran:** `full-user-journey` test 10: `request.post(BASE/api/lead, { data: { name, email, address, tenantSlug, ... } })` and assert status in [200, 500] and body shape (success or error).
- So **live lead submission** = **API only**: HTTP POST to `/api/lead` and response code/body. No browser opening the report page, opening the modal, filling the form, or clicking submit on live.
- **Backend side effects (Airtable write, Resend email, CRM webhook)** were not asserted anywhere: no check that a row exists in Airtable, no check that an email was sent, no check that a webhook was called.

**Conclusion:** Live lead submission was tested only at the **API level** (request/response). Not at UI level on live. Backend side effects were **not** verified.

---

## 6. Airtable / Resend / Stripe webhook: exercised live or only code-path?

**Only code-path verified. Not exercised live with real side effects.**

- **Airtable:** Not exercised. Lead route is implemented to call `storeLead`/fallback; no test reads from Airtable or asserts a new row. Health check can hit Airtable (Tenants table, one record); that is a **different** path from lead write.
- **Resend:** Not exercised. No test asserts an email was sent. Health can ping Resend (domains); that does not send a lead notification.
- **Stripe webhook:** Not exercised with a real event. Only test: POST /api/stripe/webhook **without** `stripe-signature` → expect 400 and error mentioning signature. No real Stripe event, no signature, no `checkout.session.completed` handling run.

**Conclusion:** Airtable lead write, Resend lead notification, and Stripe webhook handling were **only verified as code paths** (and webhook as “rejects bad request”). They were **not** exercised live with real Airtable/Resend/Stripe.

---

## 7. Areas only partially verified (clearly labeled)

- **Lead submission**
  - **Partial.** API: validated (400 for missing required fields; 200/500 for full payload) on both local and live. UI: modal open + form submit + success/error text run **locally** in `full-flow-and-crm-sync` “Homeowner lead flow (UI)” only; **not run on live**. Backend side effects (Airtable/Resend/CRM): **not verified** anywhere.
- **Checkout flow**
  - **Partial.** Session creation and redirect/URL asserted via intercept; no real payment, no webhook, no tenant activation.
- **Health/status**
  - **Partial.** Health returns 200/503 and shape; status page loads and content. Health implementation does call external APIs (Airtable, Stripe, NREL, etc.); we did not independently verify each dependency (e.g. by checking Airtable/Stripe outside the app).
- **Docs/maintenance/status links**
  - **Partial.** Legal (refund, terms, privacy) and `/docs/crm` were opened and body text asserted. MAINTENANCE-GUIDE and other maintenance/status **links** were not systematically followed; no dedicated “maintenance” route test.

---

---

**Verdict (revised):** This evidence supports **strong pre-production pass**, not "production-ready." See `docs/PRODUCTION-READINESS-FINAL-REPORT.md` §10 and `docs/NEXT-VERIFICATION-STEPS.md` for required work before full production-ready claim.

**End of evidence verification pass.**
