# Post-purchase flow — What happens when someone buys

## Defined flow (they buy → what happens)

1. **Stripe success** — Customer completes payment on Stripe Hosted Checkout; redirect to success_url.
2. **Account provisioned** — Stripe webhook `checkout.session.completed` → POST `/api/stripe/webhook` → tenant upserted in Airtable (Company Handle, Plan, Payment Status Paid, Stripe Customer ID, API Key, Capture URL, etc.).
3. **Email sent** — Onboarding email (Resend) to customer with dashboard link and next steps.
4. **CRM integration instructions** — Dashboard at `/c/[handle]` shows “Connect your CRM”; tenant can set CRM Webhook URL via POST `/api/tenant/crm-webhook`. Instructions and field mapping in `/docs/crm`.
5. **Lead routing confirmed** — Installer sets Notification Email (and optional CRM Webhook URL) in Airtable or dashboard; new leads trigger instant email + optional CRM push.
6. **Activation confirmation page** — Customer lands on `/c/[handle]?session_id=...&demo=1`; dashboard shows “you’re live” checklist: instant URL, embed code, API key, Connect CRM, link to refund policy and docs.

## Steps (contract)

1. **Checkout:** User clicks “Launch Your Branded Version” → frontend calls POST `/api/stripe/create-checkout-session` with company, plan, optional email → backend creates Stripe Checkout Session with metadata `company`, `tenant_handle`, `plan`; success_url = `{base}/c/{handle}?session_id={CHECKOUT_SESSION_ID}&demo=1`; cancel_url = provided or `/?canceled=1&company=...`.
2. **Payment:** User completes payment on Stripe Hosted Checkout.
3. **Webhook:** Stripe sends `checkout.session.completed` to POST `/api/stripe/webhook`. Backend:
   - Verifies `stripe-signature` with `STRIPE_WEBHOOK_SECRET`.
   - Uses idempotency (event id) to avoid duplicate processing.
   - Calls `handleCheckoutCompleted`: upserts tenant in Airtable (Company Handle, Plan, Payment Status Paid, Stripe Customer ID, API Key, Domain/Login URL, Capture URL, etc.), optionally sets requested domain, links owner by email, then sends onboarding email (Resend) to `customer_email` with dashboard link and magic link.
4. **Redirect:** User is redirected to success_url: `/c/[handle]?session_id=...&demo=1`.
5. **Dashboard:** Dashboard loads; if `session_id` (or token) is present, it may call GET `/api/tenant?companyHandle=...&session_id=...` to load tenant info (e.g. crmWebhookUrl). “Connect your CRM” section allows saving CRM webhook URL via POST `/api/tenant/crm-webhook`.
6. **Tenant active:** Tenant is considered active only after webhook has successfully run (server-side). No client-only “active” flip.

## Onboarding capture

- **Branding:** Already in Stripe metadata (company name); logo/colors can be set later in dashboard or Airtable.
- **Lead delivery:** Installer sets Notification Email and CRM Webhook URL in Airtable or dashboard; post-purchase dashboard offers “Connect your CRM” (Zapier/Make) and saves webhook via API.
- **Activation confirmation:** After redirect to `/c/[handle]?session_id=...`, dashboard shows “you’re live” checklist: instant URL, embed code, custom domain status, API key, Connect CRM, link to docs. “Create test lead” button sends a test lead to the installer only (for verification). CRM integration instructions and field mapping help are in `/docs/crm`.
- **Email sent:** Onboarding email (Resend) is sent by the webhook with dashboard link and next steps; if Resend fails, tenant is still created and installer can use the dashboard link from the success URL.

## Files

- Checkout session: `app/api/stripe/create-checkout-session/route.ts`
- Webhook: `app/api/stripe/webhook/route.ts` (`handleCheckoutCompleted`)
- Onboarding email: `lib/email-service.ts` (`sendOnboardingEmail`, `generateMagicLink`)
- Dashboard: `app/c/[companyHandle]/page.tsx`
- Tenant CRM webhook: `app/api/tenant/crm-webhook/route.ts`, GET `app/api/tenant/route.ts`
