# Visual verification checklist — localhost and live

**Simpler live list (click in order):** **[`TEMPORARY-TO-DO-LIST.md`](./TEMPORARY-TO-DO-LIST.md)** → **Step 46** (**1–53**) + **Step 47** (**54–57**) at file start (includes **white-label buyer** `/c/testco` preview + live URLs).

**Full E2E narrative** (homeowner + lessee + **testco** closed loop): **[`FULL-E2E-VERIFICATION-PLAYBOOK.md`](./FULL-E2E-VERIFICATION-PLAYBOOK.md)**

**URLs:**
- **Local:** http://localhost:3000 (run `npm run dev` first, or let Playwright start it).
- **Live:** https://sunspire-web-app.vercel.app
- **Demo home (live):** https://sunspire-web-app.vercel.app/?company=TestCo&demo=1
- **Demo + Apple logo (live):** https://sunspire-web-app.vercel.app/?company=TestCompany&domain=apple.com&demo=1
- **Demo report (live):** https://sunspire-web-app.vercel.app/report?company=TestCo&demo=1&address=1600+Amphitheatre+Parkway&lat=37.422&lng=-122.084&state=CA&placeId=test
- **Paid landing (live, `paid` tenant):** https://sunspire-web-app.vercel.app/paid?company=paid
- **Paid landing (live, `TestCo`):** https://sunspire-web-app.vercel.app/paid?company=TestCo
- **Paid report (live):** https://sunspire-web-app.vercel.app/report?company=paid&address=1600+Amphitheatre+Parkway&lat=37.422&lng=-122.084&state=CA&placeId=test
- **Status (live):** https://sunspire-web-app.vercel.app/status
- **Health API (live):** https://sunspire-web-app.vercel.app/api/health

Run through this on **localhost** and on **live** to confirm every part works.

---

## 1. Health & status (daily check → support@getsunspire.com)

- [ ] **GET /api/health** — Open `http://[host]/api/health`. Expect 200 and JSON with `ok: true` and `services` array (or 503 if a dependency is down). All APIs (Airtable, Stripe, NREL, EIA, Google Geocoding/Places, Resend, Vercel KV, USGS 3DEP) are probed.
- [ ] **/status** — Open `http://[host]/status`. Single streamlined block: “Daily check: UptimeRobot, this page, Sentry — alerts to **support@getsunspire.com**”. Each service row shows Operational/Degraded/Down.
- [ ] **UptimeRobot** — Configure monitor for `GET [host]/api/health`; set alert contact **support@getsunspire.com**.
- [ ] **Sentry** — In project Settings → Alerts, set notifications to **support@getsunspire.com**. Env: `SENTRY_DSN` and `NEXT_PUBLIC_SENTRY_DSN` set in Vercel.

---

## 2. Lead flow (company gets right stuff)

- [ ] **No lead on estimate only** — Open report with address (no form submit). Installer is NOT contacted.
- [ ] **Lead created only on submit** — Submit contact form (name, email, phone, consent). Then:
  1. Lead written to Airtable (source of truth)
  2. Homeowner sees confirmation (“You’re all set” / “You’ll hear back within 1 business day”)
  3. Installer gets email (Resend): subject “New Sunspire Lead – X.XkW System – [City]”, body: Name, Address, System, Est. Savings (25yr), Phone, Email, “View full report → Dashboard” link (no screenshot)
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

- [ ] **Refund policy** — `/legal/refund` loads. Contains setup-fee refund guarantee, support@getsunspire.com, 7 days. Footer/links point here.
- [ ] **Legal name on refund** — Page shows “Sunspire Software LLC · 1700 Northside Drive, Suite A7 #5164, Atlanta, GA 30318”.
- [ ] **Stripe** — Statement descriptor set (e.g. SUNSPIRE/GETSUNSPIRE). Bank verified. Webhook verified (RUNBOOK-FAILURES).
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

**Live (sunspire-web-app.vercel.app) — 23 tests:**

```bash
BASE_URL=https://sunspire-web-app.vercel.app npx playwright test tests/e2e/smoke.spec.ts tests/e2e/full-flow-and-crm-sync.spec.ts tests/api/route-integration.spec.ts --reporter=list --timeout=120000
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
