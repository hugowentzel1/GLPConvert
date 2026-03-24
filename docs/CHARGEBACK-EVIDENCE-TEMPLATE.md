# Chargeback evidence template

When Stripe notifies you of a dispute, respond before the deadline (typically 7–21 days) with evidence. Use this checklist so nothing is missed.

## What to provide Stripe

1. **Proof of service / delivery**
   - Webhook log: Stripe Dashboard → Developers → Webhooks → [your endpoint] → event `checkout.session.completed` with timestamp and success (200).
   - Airtable: Tenant record created for this customer (Company Handle, Payment Status, Stripe Customer ID, date).
   - Onboarding email: Proof that the customer received the “you’re live” email (e.g. Resend log or screenshot with timestamp).

2. **Terms of Service acceptance**
   - Checkout session or sign-up flow: If you capture ToS acceptance (e.g. checkbox or “By paying you agree to…”), note the timestamp and how it was recorded.
   - Stripe Checkout: If you use Stripe’s hosted checkout, document that the customer completed payment on a page that included your terms link.

3. **Usage / access**
   - Tenant activity: Did the customer use the dashboard, set CRM webhook, or receive leads? Note any logins or API usage (e.g. from your logs or Airtable Last Activity).

4. **Customer communication**
   - Any support emails with the customer (e.g. from support@getsunspire.com) showing they were helped or acknowledged the product.

5. **Refund policy**
   - Link to your refund policy that was in effect at the time of purchase (e.g. `/legal/refund` or `/terms#refunds`) and a one-line summary (e.g. “Setup fee refund if not live in 24h; contact within 7 days”).

## Where to find things

- **Stripe:** Dashboard → Developers → Webhooks → [event]; Payments → [payment] → Timeline.
- **Airtable:** Tenants table filtered by Stripe Customer ID or Company Handle.
- **Resend:** Logs/deliveries for onboarding email to customer email.
- **Legal:** `app/legal/refund/page.tsx`, `app/terms/page.tsx`.

## One-paragraph template (paste and fill in)

```
We delivered the service as follows. (1) Payment completed on [date]. (2) Our webhook processed checkout.session.completed successfully (Stripe event [id], 200 response). (3) We created the customer’s tenant in our system (Airtable) and sent an onboarding email to [email] with dashboard access. (4) Our terms and refund policy were linked at checkout / on our site at [url]. (5) [Optional: The customer logged in / configured their account on [date].] We have not received a refund request at support@getsunspire.com. We request the dispute be closed in our favor.
```

Replace [date], [id], [email], [url] with actual values.
