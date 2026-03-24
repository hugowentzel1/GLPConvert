# Sunspire Test Matrix

Generated from `QA_SPEC.md`. Ensures coverage of every critical route, CTA, API, and 3rd-party integration.

**Legend:**  
- **Unit:** Isolated logic (e.g. calculator, validation).  
- **Integration:** API route or service with mocks/real deps.  
- **E2E:** Full browser/user flow.  
- **Env:** local | preview | prod.  
- **Owner:** automated | manual.

---

## 1. Core estimate & quote

| Feature / endpoint | Test type | Environment | Owner | Expected result |
|--------------------|-----------|-------------|-------|------------------|
| `lib/estimate.ts` buildEstimate (cost, savings, payback, NPV) | Unit | local | automated | Correct math for given pv/rate/inputs |
| `src/estimation/calculator.ts` annualSavingsUSD, simplePaybackYears | Unit | local | automated | Matches known values (see fixtures) |
| `GET /api/estimate` schema & sanity | Integration | local, preview, prod | automated | 200, valid JSON, annualProductionKWh in 8k–25k for 10 kW, dataSource NREL (+ EIA when EIA used) |
| `GET /api/estimate` location differentiation | Integration | local, preview, prod | automated | Different locations → different annual kWh and/or utility rate |
| `GET /api/estimate` shading present | Integration | local, preview, prod | automated | shadingAnalysis with method, annualShadingLoss |
| Quote returns within 15 s | Integration | preview, prod | automated | Response time &lt; 15 s |
| E2E: landing → address → report (quote visible) | E2E | local, preview, prod | automated | Report shows NREL, numbers, address, shading |

---

## 2. Geocoding & address

| Feature / endpoint | Test type | Environment | Owner | Expected result |
|--------------------|-----------|-------------|-------|------------------|
| `GET /api/geo/normalize?address=...` | Integration | local, preview, prod | automated | 200, lat/lng for valid US address; 503/4xx when key missing/invalid |
| `GET /api/geo/status` | Integration | local, preview | automated | Reports key set and Google status |
| Google autocomplete (address input) | E2E | local, preview, prod | automated | Typing address shows suggestions / Google attribution |

---

## 3. Health

| Feature / endpoint | Test type | Environment | Owner | Expected result |
|--------------------|-----------|-------------|-------|------------------|
| `GET /api/health` | Integration | local, preview, prod | automated | 200 when all configured services ok; 503 when required service down; Stripe “invalid key” may be omitted |

---

## 4. Leads & Airtable

| Feature / endpoint | Test type | Environment | Owner | Expected result |
|--------------------|-----------|-------------|-------|------------------|
| `POST /api/lead` validation | Integration | local | automated | 400 when name/email/address/tenantSlug missing |
| `POST /api/lead` writes to Airtable | Integration | local, preview (with key) | automated | Lead stored when Airtable configured |
| E2E: lead capture in flow | E2E | preview | automated | Submit lead form → no crash; 400/429 acceptable when rate-limited |

---

## 5. Stripe (checkout & webhook)

| Feature / endpoint | Test type | Environment | Owner | Expected result |
|--------------------|-----------|-------------|-------|------------------|
| `POST /api/stripe/create-checkout-session` | Integration | local, preview | automated | 200 with session URL when keys/price IDs set; 503 with clear message when not configured |
| Stripe webhook signature verification | Integration | local | automated | 400 when signature missing/invalid; 200 when valid event processed |
| Stripe webhook idempotency | Integration | local | automated | Duplicate event id → processed once |
| E2E: CTA → checkout request | E2E | local, preview | automated | Click CTA → POST to create-checkout-session; 200 or 503 (not 500) |
| Stripe CLI event forwarding | Manual | local | manual | Docs: use Stripe CLI to forward events; webhook verifies and processes |

---

## 6. Multi-tenant & branding

| Feature / endpoint | Test type | Environment | Owner | Expected result |
|--------------------|-----------|-------------|-------|------------------|
| `/[companyHandle]` page | E2E | local, preview | automated | Page loads; tenant branding/logo/theme when configured |
| `/c/[companyHandle]` flow | E2E | local, preview | automated | Correct CTA and pricing for tenant |
| Report with `company` param | E2E | local, preview | automated | Report shows correct branding for company |

---

## 7. Report & demo

| Feature / endpoint | Test type | Environment | Owner | Expected result |
|--------------------|-----------|-------------|-------|------------------|
| Report page (Mountain View) | E2E | local, preview, prod | automated | NREL/PVWatts, address, numbers, shading copy visible |
| Report page (Phoenix) | E2E | local, preview, prod | automated | Different location, same structure |
| Demo: locked features + upgrade CTA | E2E | local, preview | automated | Locked areas and upgrade CTA visible |

---

## 8. Post-purchase & activate

| Feature / endpoint | Test type | Environment | Owner | Expected result |
|--------------------|-----------|-------------|-------|------------------|
| Activate/dashboard page | E2E | local, preview | automated | “Instant URL”, “Visit site”, “Embed”, “API key” or equivalent visible |
| `/c/activate-test?session_id=...&demo=1` | E2E | local, preview | automated | Dashboard-style content loads |

---

## 9. Smoke (fast subset for CI / prod)

| Feature | Test type | Environment | Owner | Expected result |
|---------|-----------|-------------|-------|------------------|
| Health 200 or 503 (only Stripe down) | Integration | local, preview, prod | automated | As in §3 |
| Geocoding 200 for known address | Integration | preview, prod | automated | 200, correct lat/lng for Mountain View address |
| Estimate 200 + valid schema (one location) | Integration | preview, prod | automated | 200, estimate object, annual kWh in range |
| Landing loads | E2E | preview, prod | automated | 200, CTA visible |
| Report loads with query params | E2E | preview, prod | automated | Report content and NREL attribution |

---

## 10. Regression (full suite)

| Suite | Tests | When run |
|-------|-------|----------|
| Smoke | §9 | Every PR; post-deploy prod check |
| Full E2E | All E2E in §1–8 | Nightly or on main; PR optional (slower) |
| Integration | All API integration rows above | Every PR |
| Unit | Calculator, estimate build | Every PR |

---

## Test file mapping

- **Smoke E2E:** `tests/e2e/smoke.spec.ts` (or `tests/e2e-smoke.spec.ts`)  
- **Full regression E2E:** `tests/e2e-all-apis-estimations-visual.spec.ts`  
- **Estimate integration:** `tests/estimation.integration.test.ts`, `tests/estimation.unit.test.ts`  
- **API integration:** `tests/api/` (estimate, health, geo, lead, stripe webhook)  
- **CI:** Smoke on every PR and against preview URL when available; full E2E on main or nightly; prod smoke after deploy.
