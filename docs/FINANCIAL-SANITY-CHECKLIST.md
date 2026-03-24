# Financial sanity checklist (before scale)

Operator checklist for payments, refunds, and chargebacks. Complete before high volume.

## Refund preparedness (summary)

- **Clear descriptor on statements** — Set in Stripe Dashboard → Settings → Branding; customers should recognize the charge (e.g. SUNSPIRE or GETSUNSPIRE).
- **Refund policy visible** — Live at `/legal/refund`, linked from footer and success/dashboard.
- **Easy cancellation method** — Stripe Customer Portal (link from dashboard or support); document in RUNBOOK-FAILURES.
- **Webhook verification tested** — Stripe webhook signature verified; idempotency in place (see RUNBOOK-FAILURES).
- **Chargeback evidence template ready** — Use `docs/CHARGEBACK-EVIDENCE-TEMPLATE.md` when responding to disputes.

## Stripe

- [ ] **Bank account** — Connected and verified in Stripe Dashboard → Settings → Business settings.
- [ ] **Identity verification** — Completed if required by Stripe for your region.
- [ ] **Webhook** — Endpoint `https://[your-domain]/api/stripe/webhook` added; signing secret in env as `STRIPE_WEBHOOK_SECRET`. Webhook signature verification tested (see RUNBOOK-FAILURES.md).
- [ ] **Statement descriptor** — Set in Stripe Dashboard → Settings → Branding (or Payment methods). Typically ≤22 characters. Document the chosen value here: _________________.
- [ ] **Test payment** — One successful test checkout; webhook received and tenant created in Airtable.
- [ ] **Refund test** — One test refund via Stripe Dashboard to confirm flow.

## Refund & cancellation

- [ ] **Refund policy page** — Live at `/legal/refund` (or redirect from `/refund` to `/terms#refunds`). Linked from footer.
- [ ] **Cancellation** — Customer can cancel subscription via Stripe Customer Portal (link from dashboard or support). Instructions in RUNBOOK-FAILURES.md.
- [ ] **24-hour setup guarantee** — Copy matches policy: setup fee refund if not live in 24h; contact support@getsunspire.com within 7 days.

## Chargebacks

- [ ] **Evidence template** — Use `docs/CHARGEBACK-EVIDENCE-TEMPLATE.md` when responding to a dispute: webhook logs, onboarding email, ToS acceptance, usage.
- [ ] **Response timeline** — Stripe dispute deadline (typically 7–21 days); respond with evidence before deadline.

## Legal name & descriptor

- [ ] **Legal name** — Displayed where required (e.g. footer, terms, refund page). Current: Sunspire Software LLC (or as set in app).
- [ ] **Descriptor** — Statement descriptor clearly reflects product/service so customers recognize the charge.

## References

- Refund page: `app/legal/refund/page.tsx`
- Terms #refunds: `app/terms/page.tsx`
- Runbook: `docs/RUNBOOK-FAILURES.md`
- Stripe descriptor: Stripe Dashboard → Settings → Branding (or Payment methods)
