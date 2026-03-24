# Next verification steps — toward full production-ready

**Update (2026-03-12):** Items 1, 4, and 5 below were completed. See **`docs/VERIFICATION-RESULTS.md`** for what was done, what remains (lead side-effects, Stripe webhook), blockers, and updated verdict.

The evidence showed the initial pass was **partial verification only**. The following must-haves and rules still apply for anything not yet completed.

---

## Must-haves before "production-ready"

### 1. Live browser-based homeowner lead flow ✅ DONE

- **Completed:** `tests/e2e/live-homeowner-lead-flow.spec.ts` — run against sunspire-web-app.vercel.app; report → modal → fill → submit → success/error UI verified. See VERIFICATION-RESULTS.md.

### 2. Lead side-effect verification

- Confirm **Supabase** write for a submitted lead (`leads` table, correct `tenant_id`).
- Confirm installer email send path (Resend or equivalent).
- Confirm dashboard visibility (`/c/<handle>/leads`).
- Confirm CRM/webhook push if configured for the tenant.

### 3. Real Stripe completion / webhook verification

- Complete a **test-mode** purchase (checkout → payment).
- Webhook receives a **real signed** `checkout.session.completed` (or equivalent) event.
- Tenant activation/unlock confirmed after webhook handling (e.g. row in **Supabase** `tenants`).

### 4. Full referenced-page verification ✅ DONE

- **Completed:** `tests/e2e/full-docs-and-pages.spec.ts` — 17 routes (status, support, docs/*, legal/*, pricing, methodology) return 200 and expected content on sunspire-web-app.vercel.app. See VERIFICATION-RESULTS.md.

### 5. Health / status depth check ✅ DONE

- **Completed:** `docs/HEALTH-DEPTH.md` — health performs real dependency checks (**Supabase**, Stripe, NREL, EIA, Geocoding, Resend); limitations documented (Places config-only; Sentry/Vercel/KV not in health).

---

## Rules for the next verification pass

- Do **not** stop after API-only checks.
- Do **not** stop after route-existence checks.
- Do **not** claim side effects are verified unless confirmed (e.g. row in **Supabase**, email sent, webhook delivered).
- Do **not** claim live flow is verified unless the **browser** flow actually ran on live.

---

## Required output after completing the next pass

1. **Exactly what missing items were completed** (with evidence: which test or step, local vs live).
2. **Exactly what still could not be completed** (list each item).
3. **Exact blockers** (e.g. missing credential, external dashboard access required, environment limitation, code issue).
4. **Updated final verdict** using accurate language (no "production-ready" unless the must-haves above are satisfied or explicitly scoped out with owner sign-off).

---

## Cursor prompt for next session

Paste the following into Cursor to run the next verification pass:

```
The evidence shows this is still only a partial verification pass.

Do not change the verdict to "production-ready" yet.

You must now complete the missing high-confidence verification work.

Missing items that must be addressed:

1. LIVE HOMEOWNER UI FLOW
- Run Playwright on live through the real browser flow:
  - open a live tenant/report flow
  - generate estimate
  - open report modal
  - fill and submit the homeowner lead form
  - verify success UI

2. LIVE BACKEND SIDE-EFFECT VERIFICATION
For the live homeowner lead flow, verify actual side effects as far as environment allows:
- Airtable/source-of-truth write confirmed
- installer email path confirmed
- dashboard/lead-view visibility confirmed
- CRM/webhook push confirmed if configured

If any of these cannot be verified, classify the exact blocker:
- missing credential
- external dashboard access required
- environment limitation
- code issue

3. STRIPE COMPLETION / WEBHOOK VERIFICATION
- Verify more than checkout initiation
- Complete a real test-mode checkout flow if possible
- Confirm webhook handling for a real/simulated signed event
- Confirm tenant activation/unlock state after webhook handling

4. FULL PAGE / DOC / OPS LINK VERIFICATION
- Expand docs/maintenance/status verification beyond legal + /docs/crm
- Verify all referenced pages/routes/links that matter for operations, support, status, onboarding, and legal flows

5. HEALTH / STATUS DEPTH CHECK
- Confirm whether /api/health is only shape-checked or meaningfully dependency-checked
- If shallow, improve it or document exact limitations precisely

Rules:
- Do not stop after API-only checks
- Do not stop after route existence checks
- Do not claim side effects are verified unless confirmed
- Do not claim live flow is verified unless browser flow actually ran on live

Output:
1. exactly what missing items were completed
2. exactly what still could not be completed
3. exact blockers
4. updated final verdict using accurate language
```

---

## References

- **Evidence:** `docs/EVIDENCE-VERIFICATION-PASS.md`
- **Current report:** `docs/PRODUCTION-READINESS-FINAL-REPORT.md` (verdict: strong pre-production pass; not full E2E verification)
