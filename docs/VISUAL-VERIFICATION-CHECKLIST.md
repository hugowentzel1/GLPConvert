# Visual verification checklist — localhost and live

> **Primary product (2026):** **GLPConvert** — intake + demo URLs below. Sections **2–4** of this file still describe the **legacy solar / report** stack; treat them as optional when `NEXT_PUBLIC_VERTICAL=glp`.

**GLP live URLs (`https://glp-convert.vercel.app`):**
- **Demo home:** `https://glp-convert.vercel.app/?company=TestCo&demo=1`
- **Demo + domain (Clearbit logo):** `https://glp-convert.vercel.app/?company=TestCompany&domain=apple.com&demo=1`
- **Branded intake (demo):** `https://glp-convert.vercel.app/intake?demo=1&handle=glpconvert&company=Acme%20Med%20Spa&domain=stripe.com&brand=6366F1`
- **Paid intake:** `https://glp-convert.vercel.app/intake?company=glpconvert`
- **Status:** `https://glp-convert.vercel.app/status`
- **Health API:** `https://glp-convert.vercel.app/api/health`

**Local:** `http://localhost:3000` or `http://localhost:3330` (see `playwright.glp-visual.config.ts` for visual E2E). Run `npm run dev` / `npx next dev -p 3330`.

**Legacy solar narrative (optional):** **[`FULL-E2E-VERIFICATION-PLAYBOOK.md`](./FULL-E2E-VERIFICATION-PLAYBOOK.md)** · **[`TEMPORARY-TO-DO-LIST.md`](./TEMPORARY-TO-DO-LIST.md)**

Run through this on **localhost** and on **live** to confirm every part works.

---

## 1. Health & status (daily check → support@glpconvert.com)

- [ ] **GET /api/health** — Open `http://[host]/api/health`. Expect 200 and JSON with `ok: true` and `services` array (or 503 if a dependency is down). **GLP profile** skips NREL/EIA unless `solar_legacy` / `HEALTH_PROBE_SOLAR=1`.
- [ ] **/status** — Open `http://[host]/status`. Alerts should route to **support@glpconvert.com** (or your ops inbox). Each service row shows Operational/Degraded/Down.
- [ ] **UptimeRobot** — Configure monitor for `GET [host]/api/health`; set alert contact **support@glpconvert.com**.
- [ ] **Sentry** — In project Settings → Alerts, set notifications to **support@glpconvert.com**. Env: `SENTRY_DSN` and `NEXT_PUBLIC_SENTRY_DSN` set in Vercel.

---

## 2. Lead flow (company gets right stuff)

- [ ] **No lead on estimate only** — Open report with address (no form submit). Installer is NOT contacted.
- [ ] **Lead created only on submit** — Submit contact form (name, email, phone, consent). Then:
  1. Lead written to Airtable (source of truth)
  2. Homeowner sees confirmation (“You’re all set” / “You’ll hear back within 1 business day”)
  3. Installer gets email (Resend): structured lead summary + link to dashboard (solar legacy) — GLPConvert uses intake lead templates from `/api/lead`
  4. Lead visible in installer dashboard `/c/[handle]/leads`
  5. If CRM webhook configured, lead pushed to CRM (payload has tenant_id, homeowner_name, email, phone, address, system_size, annual_production, savings_25yr, timestamp, utm_source, demo_or_paid)

- [ ] **Installer email** — Structured data + link only; no screenshot. Dashboard link goes to `/c/[tenantSlug]/leads`.

---

## 3. Homeowner flow (report CTA + modal + consent)

- [ ] **Report page (paid, no demo)** — Heading: “Next step: get your install-ready plan”. Subtext: “A quick consult confirms roof layout, panel location, and incentives—then your installer can schedule the next step.”
- [ ] **Primary CTA** — Button: “Request a free consult”. Click opens modal.
- [ ] **Modal** — Title: “Next step: schedule your free consultation”. Body: “A quick consult confirms roof layout, panel location, and incentives—then your installer can guide the next step.” Fields: First name, Email, Phone (optional). Consent: “By submitting, you agree to be contacted by [Company] via phone, email, or text” + Privacy/Terms links. Submit: “Send my report & next steps”. Microcopy: “Takes ~30 seconds. No obligation.”
- [ ] **After submit** — “You’re all set” / “You’ll hear back within 1 business day.” Buttons: “Book a time (recommended)” and “No thanks — have them reach out”.

---

## 4. Refund preparedness & “What happens when someone buys”

- [ ] **Refund policy** — `/legal/refund` loads. Contains setup-fee refund guarantee, **support@glpconvert.com**, 7 days. Footer/links point here.
- [ ] **Legal name on refund** — Page shows **Wellspire LLC** (or current legal entity on file).
- [ ] **Stripe** — Statement descriptor set for **GLPConvert**. Bank verified. Webhook verified (RUNBOOK-FAILURES).
- [ ] **Cancellation** — Stripe Customer Portal linked from dashboard or support; documented in runbook.
- [ ] **Chargeback** — `docs/CHARGEBACK-EVIDENCE-TEMPLATE.md` ready for disputes.

**Post-purchase flow (they buy → what happens):**

1. Stripe success → redirect to success_url  
2. Account provisioned (webhook → Airtable tenant)  
3. Email sent (onboarding to customer)  
4. CRM integration instructions (dashboard “Connect your CRM”)  
5. Lead routing confirmed (Notification Email + optional CRM webhook)  
6. Activation confirmation page (`/c/[handle]?session_id=...`)

---

## 5. Automated tests (Playwright)

**Live (GLPConvert) — smoke + API:**

```bash
BASE_URL=https://glp-convert.vercel.app npx playwright test tests/e2e/smoke.spec.ts tests/api/route-integration.spec.ts --reporter=list --timeout=120000
```

**GLP branded visual E2E:**

```bash
npm run test:glp-visual:live
```

- Covers: health, estimate, geo/normalize, lead (400/200/500), webhook 400, full flow (landing → report → lead API), CRM payload, idempotency, utm_source/demo_or_paid, homeowner report CTA/modal, smoke (status, demo URL, paid URL, dashboard, lead/dashboard/CRM copy). **All 23 passed** on live.

**Localhost (dev server auto-starts):**

```bash
npx playwright test tests/e2e/smoke.spec.ts tests/e2e/full-flow-and-crm-sync.spec.ts tests/api/route-integration.spec.ts --reporter=list --timeout=120000
```

- Same 23 tests; baseURL `http://localhost:3000`. Playwright starts `npm run dev` if BASE_URL/PLAYWRIGHT_BASE_URL are not set.
- Or use: `npm run test:local` (same specs).

---

## 6. API prices & capacity

- [ ] **docs/COST-CAPACITY-MATRIX.md** — Read and understand limits (NREL, EIA, Airtable, Stripe, Resend, Google, Vercel KV). Plan for scale.

---

## References

- Health/alerts: `docs/HEALTH-ALERTS-SETUP.md`
- API coverage: `docs/API-HEALTH-COVERAGE.md`
- Lead schema: `docs/LEAD-SCHEMA-AND-DELIVERY.md`
- Post-purchase: `docs/POST-PURCHASE-FLOW.md`
- Financial/refund: `docs/FINANCIAL-SANITY-CHECKLIST.md`
- Chargeback: `docs/CHARGEBACK-EVIDENCE-TEMPLATE.md`
