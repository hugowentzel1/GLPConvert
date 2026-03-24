# Refund preparedness

Checklist so statements, policy, cancellation, and disputes are clear and defensible.

---

## 1. Clear descriptor on statements

- Stripe allows setting a **statement descriptor** (e.g. “SUNSPIRE SETUP” or “SUNSPIRE SOFTWARE”) so customers recognize the charge.
- Configure in Stripe Dashboard: **Settings → Branding → Statement descriptor** (and descriptor suffix if used).
- Keeps chargebacks lower when the descriptor matches your brand and product.

## 2. Refund policy visible

- **Refund policy page:** `/legal/refund` (and linked from footer/terms).
- Content: Setup-fee refund if branded site isn’t live within 24 hours; contact support@getsunspire.com within 7 days; subscription cancel-anytime, non-refundable except as required by law.
- Legal entity: Sunspire Software LLC, 1700 Northside Drive, Suite A7 #5164, Atlanta, GA 30318.
- Ensure the refund page is linked from checkout flow or main site footer so it’s visible before and after purchase.

## 3. Easy cancellation method

- Subscription: Customer can cancel via Stripe Customer Portal (link from dashboard or email).
- **POST /api/stripe/create-portal-session** returns a URL to Stripe’s portal where they can cancel subscription.
- Document in support: “To cancel, use the link in your receipt or contact support@getsunspire.com.”

## 4. Webhook verification tested

- Stripe webhooks use **signature verification** (Stripe-Signature header).
- Webhook is **idempotent** (same event replayed = same result; no duplicate tenants).
- Failed webhooks go to DLQ; replay via admin or script.
- For refund/dispute evidence: confirm in Stripe Dashboard → Developers → Webhooks that `checkout.session.completed` was received and returned 200.

## 5. Chargeback evidence template ready

- Use **docs/CHARGEBACK-EVIDENCE-TEMPLATE.md** when Stripe notifies you of a dispute.
- It covers: proof of delivery (webhook 200, Airtable tenant, onboarding email), ToS acceptance, usage, customer communication, refund policy link.
- One-paragraph template is at the bottom of that doc; fill in dates, event ID, email, URL.

---

## Quick checklist

- [ ] Statement descriptor set in Stripe and recognizable
- [ ] Refund policy at `/legal/refund` and linked from site/terms
- [ ] Cancellation: Stripe Customer Portal and/or support@getsunspire.com
- [ ] Webhook verified and idempotent; DLQ for failures
- [ ] Chargeback template (docs/CHARGEBACK-EVIDENCE-TEMPLATE.md) ready to use
