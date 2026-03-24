# Stripe migration — Sunspire → GLPConvert

## Goals

- Products and prices named for **Wellspire LLC / GLPConvert** (not solar).
- Metadata for provisioning: `tenant_handle`, `vertical=glp`, `product_line=glpconvert`.

## Dashboard steps (human)

1. **Test mode:** Create Product “GLPConvert SaaS”, recurring price ($99/mo or your amount), one-time setup price ($399 or your amount).
2. Copy Price IDs → Vercel env: `STRIPE_PRICE_MONTHLY_99`, `STRIPE_PRICE_SETUP_399` (or `STRIPE_PRICE_STARTER` / `STRIPE_PRICE_MONTHLY` — see `create-checkout-session/route.ts`).
3. Webhook endpoint: `https://<your-domain>/api/webhooks/stripe` — events: `checkout.session.completed`, `customer.subscription.*`, `invoice.*` as needed.
4. **Live mode:** Repeat with live keys; rotate `STRIPE_WEBHOOK_SECRET` per endpoint.

## Code touchpoints (repo)

- `app/api/stripe/create-checkout-session/route.ts` — success/cancel URLs use `NEXT_PUBLIC_APP_URL`
- `app/api/webhooks/stripe/route.ts` — provisioning, tenant creation
- `lib/email-service.ts` — post-purchase onboarding email (GLPConvert copy)

## Invoice / statement descriptor

- Set customer-facing descriptor in Stripe Dashboard → Branding / Statement descriptor → e.g. `WELLSPIRE GLPCONVERT`
