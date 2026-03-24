# Stripe Webhook Testing

Stripe recommends testing webhooks locally via **Stripe CLI** and verifying signatures with the official library. ([Stripe Docs: Webhooks](https://docs.stripe.com/webhooks))

## Local testing with Stripe CLI

1. **Install Stripe CLI** (if not already):  
   https://stripe.com/docs/stripe-cli

2. **Login and forward events to your local server:**
   ```bash
   stripe login
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   ```
   The CLI will print a **webhook signing secret** (e.g. `whsec_...`). Use this as `STRIPE_WEBHOOK_SECRET` in `.env.local` while testing.

3. **Trigger test events** (in another terminal):
   ```bash
   stripe trigger checkout.session.completed
   ```
   Or use the Stripe Dashboard → Developers → Webhooks → Send test webhook.

4. **Verify in your app:** The webhook handler uses `stripe.webhooks.constructEvent(body, signature, secret)` for signature verification and `withIdempotency(eventId, ...)` for idempotency. Check logs and Airtable/tenant state after the event.

## Integration test (automated)

The API integration suite verifies that **missing `stripe-signature` returns 400**:

- `tests/api/route-integration.spec.ts`: `POST /api/stripe/webhook` without signature → 400 and error message containing "signature" or "Missing".

Run: `BASE_URL=http://localhost:3000 npx playwright test tests/api/route-integration.spec.ts -g "stripe webhook"`
