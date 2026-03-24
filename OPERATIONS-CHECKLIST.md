# Operations checklist — one place to verify everything

Use this after deploy or weekly to confirm health, refund, lead flow, and post-purchase are correct.

## Health & alerts (UptimeRobot, Sentry, /status)

- **/api/health** — Probes every API in quote/lead/payment path (Airtable, Stripe, NREL, EIA, Resend, Google Geocoding/Places, Vercel KV, USGS 3DEP). Returns 503 if any dependency fails. See `docs/API-HEALTH-COVERAGE.md`.
- **/status** — Human-readable status page; shows support@getsunspire.com, UptimeRobot, Sentry. Auto-refreshes every 60s.
- **UptimeRobot** — Monitor `GET [domain]/api/health`. Alert to **support@getsunspire.com** when status ≠ 200.
- **Sentry** — Set project alerts to **support@getsunspire.com** (Settings → Alerts). Requires `SENTRY_DSN` and `NEXT_PUBLIC_SENTRY_DSN` in Vercel.

Full setup: `docs/HEALTH-ALERTS-SETUP.md`.

## Refund preparedness

- Statement descriptor set in Stripe (recognizable on card statements).
- Refund policy at `/legal/refund` (Sunspire Software LLC, support@getsunspire.com, 24h setup guarantee, 7-day refund request window).
- Cancellation: Stripe Customer Portal and/or support@getsunspire.com.
- Webhook verified; DLQ for failures; chargeback template in `docs/CHARGEBACK-EVIDENCE-TEMPLATE.md`.

Full checklist: `docs/REFUND-PREPAREDNESS.md`.

## Lead flow (homeowner → installer)

1. Homeowner enters address → Sunspire generates estimate → report shown.
2. CTA: “Request a free consult” → modal “Where should we send this report + next steps?” → name, email, phone, consent.
3. Submit → Lead saved to Airtable → installer email (Resend) → optional CRM webhook → confirmation: “Book a time (recommended)” / “No thanks — have them reach out.”

Lead object: tenant_id, homeowner name, email, phone, address, system_size, annual_production, savings, timestamp, utm_source, demo_or_paid. See `docs/LEAD-SCHEMA-AND-DELIVERY.md`, `docs/WHAT-HAPPENS-WHEN-SOMEONE-BUYS.md`.

## Post-purchase (installer)

Stripe success → webhook → tenant marked paid → activation page `/c/[company]?session_id=...` → onboarding/dashboard. Email sent; CRM instructions in dashboard. See `docs/POST-PURCHASE-FLOW.md`, `docs/WHAT-HAPPENS-WHEN-SOMEONE-BUYS.md`.

## Financial sanity

Stripe bank verified, payout schedule known, taxes/entity/domain aligned. See `docs/FINANCIAL-SANITY-CHECKLIST.md`.

## E2E tests (run after changes)

```bash
# Local (with mocks)
npx playwright test tests/e2e/full-customer-journey-visual.spec.ts tests/e2e/new-changes-visual.spec.ts --workers=1

# Visual (watch in browser)
npx playwright test tests/e2e/full-customer-journey-visual.spec.ts --headed --workers=1

# Live
BASE_URL=https://sunspire-web-app.vercel.app npx playwright test tests/e2e/full-customer-journey-visual.spec.ts tests/e2e/new-changes-visual.spec.ts --workers=1
```
