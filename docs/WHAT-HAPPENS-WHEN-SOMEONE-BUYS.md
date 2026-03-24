# What Happens When Someone Buys

Defined flow from purchase to activation. Use this for support, runbooks, and onboarding.

---

## 1. Stripe success

- Customer completes Stripe Checkout (setup fee + subscription).
- Stripe redirects to: **`/c/{companyHandle}?session_id={CHECKOUT_SESSION_ID}&demo=1`**
- `success_url` is set in `app/api/stripe/create-checkout-session/route.ts`.

## 2. Account provisioned

- Stripe sends `checkout.session.completed` to **POST /api/webhooks/stripe**.
- Webhook (idempotent, replay-safe):
  - Creates/updates tenant in Airtable (source of truth).
  - Marks tenant as paid/active; stores Stripe customer/subscription IDs.
- If webhook fails, event goes to DLQ; replay from admin or fix and redeploy.

## 3. Email sent

- After tenant is saved, onboarding email is sent (Resend) to the customer with:
  - Confirmation of purchase.
  - Magic link to dashboard: `/c/{companyHandle}?token=...` (valid 7 days).
  - Link to dashboard and setup docs.

## 4. CRM integration instructions

- Customer sees dashboard at `/c/{companyHandle}` (no main site header: no Activate/Pricing/Support).
- Dashboard includes: Instant URL, Embed Code, Custom Domain, **View Leads**, Documentation, Contact Support.
- Optional: CRM webhook URL can be set (POST /api/tenant/crm-webhook); leads then push to their CRM.

## 5. Lead routing confirmed

- When a homeowner submits contact info on a **paid** report:
  1. **POST /api/lead** is called.
  2. Lead is written to Airtable first (source of truth).
  3. Homeowner sees confirmation (“You’re all set” / “Book a time” or “No thanks — have them reach out”).
  4. Installer notification email is sent (Resend) with structured data + dashboard link.
  5. Lead appears in installer dashboard at `/c/{companyHandle}/leads`.
  6. If CRM webhook is set, lead is pushed to their CRM.

## 6. Activation confirmation page

- The page at **`/c/{companyHandle}`** is the activation confirmation.
- No main site header (ConditionalSharedNav and ConditionalDemoBanner return null for `/c` and `/c/*`).
- Customer sees: company dashboard, Instant URL, Embed Code, Custom Domain, View Leads, Setup Instructions, Support.

---

## Quick reference

| Step | What happens |
|------|----------------|
| 1 | Stripe checkout completes → redirect to `/c/{handle}?session_id=...&demo=1` |
| 2 | Webhook creates/updates tenant in Airtable |
| 3 | Onboarding email sent with magic link |
| 4 | Customer uses dashboard (Instant URL, embed, CRM webhook, docs) |
| 5 | Leads: Airtable → confirmation UI → installer email → dashboard → optional CRM |
| 6 | Activation page = `/c/{handle}` (no main nav) |

See also: **POST-BUY-DASHBOARD.md**, **MAINTENANCE-GUIDE.md**, **docs/LEAD-SCHEMA-AND-DELIVERY.md**.
