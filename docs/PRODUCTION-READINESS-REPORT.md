# Sunspire — Production readiness report

**Generated:** After production-readiness pass (inventory, build fix, API tests, smoke tests).  
**Scope:** Report CTA/modal unchanged (sentence case confirmed). Build blockers fixed. Critical APIs and smoke tests run.

---

## 1. Files changed

| File | Change |
|------|--------|
| `lib/cache.ts` | Added `CACHE_KEYS`, `invalidateCache()`, and `delete(key)` so GDPR delete route compiles. |
| `src/lib/airtable.ts` | Added `updateTenantCrmWebhook(handle, crmWebhookUrl)` (writes to Tenants `CAPTURE_URL`) so `/api/tenant/crm-webhook` compiles. |
| `components/report/ReportLeadModal.tsx` | **No copy/layout changes.** Modal already uses sentence case (e.g. "Book your free consultation", "First name *", "How would you like to be contacted? *", "Phone (optional)"). |

---

## 2. Features / fixes implemented

- **Build:** Resolved two compile errors so `npm run build` succeeds:
  - `app/api/gdpr/delete/route.ts` required `invalidateCache` and `CACHE_KEYS` from `@/lib/cache`; both added.
  - `app/api/tenant/crm-webhook/route.ts` required `updateTenantCrmWebhook` from `@/src/lib/airtable`; function added and wired to Tenants `CAPTURE_URL`.
- **Capitalization:** Confirmed paid consultation modal uses **sentence case** everywhere (title, labels, questions, button). No wording or casing changes made; rule documented for future UI.

---

## 3. Flows referenced (inventory)

- **Flow A — Sunspire customer:** Demo URL → branding → quote → upgrade/activation → Stripe checkout → success → webhook → tenant paid/active. Key routes: `/api/stripe/create-checkout-session`, `/api/stripe/webhook`, `/api/stripe/session`, `/success`, `/activate`, Airtable tenant updates.
- **Flow B — Homeowner:** Address → estimate → report → CTA → lead submit → `/api/lead` → Airtable Leads + optional Resend notification + optional CRM webhook. Key routes: `/api/estimate`, `/api/lead`, `/api/geo/normalize`, report page and `ReportLeadModal` / `ReportCTAFooter`.
- **Health / status:** `GET /api/health` (Airtable, Stripe, NREL, EIA, Google Geocoding, Resend, etc.), `/status` page.
- **APIs in use:** Airtable, Stripe, NREL PVWatts, EIA, Google Geocoding/Places, Resend, Vercel KV (if configured), USGS 3DEP (shading). See `docs/API-HEALTH-COVERAGE.md` and `/api/health` implementation.

---

## 4. Pages / routes verified

- **API routes (via Playwright request tests):** `/api/health`, `/api/estimate`, `/api/geo/normalize`, `/api/lead` (validation), `/api/stripe/webhook` (signature validation). All exercised in `tests/api/route-integration.spec.ts` and `tests/e2e/smoke.spec.ts` (API parts).

---

## 5. APIs tested

| API / route | How tested | Result |
|-------------|------------|--------|
| `GET /api/health` | Playwright request; checks `services` array and 200/503 | Pass |
| `GET /api/estimate` | Playwright with valid params; schema + NREL source | Pass |
| `GET /api/estimate` (missing params) | Playwright; expects 400/500 | Pass |
| `GET /api/geo/normalize` | Playwright with known address; 200 + lat/lng or 503 | Pass |
| `POST /api/lead` | Playwright with missing required fields; expects 400 | Pass |
| `POST /api/stripe/webhook` | Playwright without `stripe-signature`; expects 400 | Pass |

---

## 6. Local test results

- **Build:** `npm run build` — **pass** (after cache + airtable fixes).
- **Playwright**
  - **tests/api/route-integration.spec.ts:** 6/6 passed.
  - **tests/e2e/smoke.spec.ts:** 3 API-only tests passed (Health, Geocoding, Estimate).  
  - **Smoke UI tests** (Landing CTA visible, Report shows NREL): **failed** when run with default `BASE_URL=http://localhost:3000` and no dev server; they need either a running dev server or `BASE_URL=<live URL>` for full pass.
- **Conclusion:** All API/backend checks that don’t require a browser UI passed. UI smoke tests need a running app (local or live) and may need selector updates if homepage/report markup changed.

---

## 7. Live test results

- **Not run in this pass.** Live verification should be run after deploy with:
  - `BASE_URL=https://<production-url> npx playwright test tests/e2e/smoke.spec.ts`
  - Same for `tests/api/route-integration.spec.ts` if pointing at live.
- **Recommendation:** Run the same Playwright suites against production after each deploy and document results.

---

## 8. Remaining risks

- **Stripe webhook (live):** Not exercised with real Stripe events; idempotency and checkout completion logic are in code but untested in this pass. Use Stripe CLI or dashboard test events for live verification.
- **Lead → Airtable + email + CRM:** Flow is implemented (lead route, Resend, tenant `CAPTURE_URL`); end-to-end depends on env vars and Airtable/Resend/tenant config. No automated E2E against real Airtable/Resend in this run.
- **UptimeRobot / Sentry / alerts:** Configuration lives in external dashboards; not changed in code. Ensure UptimeRobot monitors `GET /api/health` and alerts (e.g. support@getsunspire.com) and Sentry is wired per docs.
- **Smoke UI tests:** Currently fail without a running server or against wrong BASE_URL; ensure CI or manual runs use correct BASE_URL and that selectors (e.g. `data-cta`, CTA links) match current homepage/report.

---

## 9. REQUIRES OWNER ACTION

These depend on accounts, keys, or dashboards outside the repo:

1. **UptimeRobot**
   - **Action:** Ensure a monitor is set for `GET https://<production-domain>/api/health`.
   - **Where:** UptimeRobot dashboard.
   - **Verify:** Alert fires when health returns non-200 or 503 (or per your policy) and that alerts go to support@getsunspire.com if desired.

2. **Sentry**
   - **Action:** Confirm Sentry project is linked, DSN and env are set in Vercel (or deployment env), and errors are visible in Sentry.
   - **Where:** Sentry project settings + Vercel env.
   - **Verify:** Trigger a test error (e.g. `/api/sentry-test`) and see event in Sentry.

3. **Stripe**
   - **Action:** Confirm Stripe webhook URL is set to `https://<production-domain>/api/stripe/webhook`, webhook secret is in env, and bank/payout settings are verified for live.
   - **Where:** Stripe Dashboard → Developers → Webhooks; Stripe account settings.
   - **Verify:** Send test `checkout.session.completed` (or use Stripe CLI) and confirm tenant/order state in Airtable (or your source of truth).

4. **Live smoke / E2E**
   - **Action:** Run Playwright against production after deploy:  
     `BASE_URL=https://<production-domain> npx playwright test tests/e2e/smoke.spec.ts tests/api/route-integration.spec.ts`
   - **Where:** Local or CI; fix any selector or URL assumptions for live.
   - **Verify:** All tests pass or failures are documented and accepted.

---

## 10. Final production-readiness verdict

- **Codebase:** Build is green. Critical API routes (health, estimate, geo, lead validation, Stripe webhook guard) are covered by tests and pass. Two build blockers (cache + tenant CRM webhook) are fixed.
- **Modal / CTA:** Report CTA and consultation modal wording and capitalization were **not** changed; modal is already sentence case and matches the stated product-writing rule.
- **Gaps:** Full end-to-end flows (real Stripe checkout → webhook → tenant; real lead → Airtable → email → CRM) and live UI smoke tests were not run in this pass. Monitoring (UptimeRobot, Sentry) and Stripe live config require owner/dashboard actions.
- **Next steps:** Run Playwright against live with correct `BASE_URL`; verify Stripe webhook and lead pipeline once with real or test data; confirm monitoring and alerts per section 9.
