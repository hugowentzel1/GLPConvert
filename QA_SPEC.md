# Sunspire QA Spec – Single Source of Truth

This is the **don’t-forget-anything** QA specification for Sunspire. Use it to generate the test matrix, E2E flows, and integration tests.

---

## A. System inventory

### A.1 Pages / routes

**Demo & paid (public):**

| Route | Type | Description |
|-------|------|-------------|
| `/` | Demo/paid | Landing; address input, CTA to report |
| `/report` | Demo/paid | Quote report (address, production, savings, shading, NREL/EIA attribution) |
| `/paid` | Paid | Paid flow entry |
| `/pricing` | Marketing | Pricing page |
| `/success` | Post-checkout | Post-purchase success |
| `/cancel` | Post-checkout | Checkout cancelled |
| `/activate` | Post-checkout | Activation / dashboard entry |
| `/[companyHandle]` | Tenant | Tenant landing (e.g. `/acme`) |
| `/c/[companyHandle]` | Tenant | Tenant flow (e.g. `/c/acme`) |
| `/c/[companyHandle]/leads` | Tenant | Leads view |
| `/c/[companyHandle]/success` | Tenant | Tenant success |
| `/c/[companyHandle]/cancel` | Tenant | Tenant cancel |
| `/o/[slug]` | Embed | Open/embed by slug |
| `/embed/[slug]` | Embed | Embed page |
| `/signup` | Marketing | Signup |
| `/partners` | Marketing | Partners |
| `/support` | Support | Support |
| `/contact` | Contact | Contact |
| `/methodology` | Legal/marketing | Methodology |
| `/security` | Security | Security |
| `/status` | Status | Status page |
| `/legal/terms`, `/terms` | Legal | Terms of service |
| `/legal/privacy`, `/privacy` | Legal | Privacy policy |
| `/legal/accessibility`, `/accessibility` | Legal | Accessibility |
| `/legal/cookies` | Legal | Cookies |
| `/legal/refund` | Legal | Refund policy |
| `/do-not-sell` | Legal | Do not sell |
| `/dpa` | Legal | DPA |
| `/docs/api`, `/docs/setup`, `/docs/embed`, `/docs/branding`, `/docs/crm`, `/docs/crm/salesforce`, `/docs/crm/hubspot`, `/docs/crm/airtable` | Docs | Documentation |
| `/onboard/domain` | Onboarding | Domain onboarding |

**Admin / internal:**

| Route | Description |
|-------|-------------|
| `/admin/dashboard` | Admin dashboard |

### A.2 Buttons / CTAs (critical)

- **Landing:** Primary CTA (e.g. “Get quote”, “Launch”, “Get started”) → address → report
- **Report:** Upgrade CTA, share, locked-feature prompts (demo)
- **Paid flow:** Checkout CTA → Stripe Checkout
- **Activate:** “Instant URL”, “Visit site”, “Custom domain”, “Embed code”, “API key”
- **Multi-tenant:** Company-specific CTAs and branding

### A.3 API routes

| Method | Route | Purpose |
|--------|-------|---------|
| GET | `/api/health` | Health check (Airtable, Stripe, NREL, EIA, Google Geocoding, Resend) |
| GET | `/api/estimate` | Solar estimate (PVWatts + rates + shading) |
| POST | `/api/estimate` | Same via JSON body |
| GET | `/api/geo/normalize` | Geocode address → lat/lng |
| GET | `/api/geo/status` | Geocoding key status / debug |
| GET | `/api/autocomplete` | Address autocomplete (Google) |
| POST | `/api/lead` | Store lead (Airtable); requires name, email, address, tenantSlug, etc. |
| POST | `/api/submit-lead` | Submit lead (alternate) |
| POST | `/api/demo-lead` | Demo lead |
| POST | `/api/stripe/create-checkout-session` | Create Stripe Checkout session |
| POST | `/api/stripe/webhook` | Stripe webhook (signature verification, idempotency) |
| GET | `/api/stripe/session` | Get Stripe session |
| POST | `/api/stripe/create-portal-session` | Customer portal |
| POST | `/api/leads` | Leads API |
| POST | `/api/leads/upsert` | Upsert lead |
| GET | `/api/calc/quote` | Quote calc |
| POST | `/api/checkout` | Checkout |
| POST | `/api/provision` | Provisioning |
| GET | `/api/domains/status`, `/api/domains/verify`, `/api/domains/attach`, `/api/domains/prefill` | Custom domains |
| POST | `/api/activate-intent` | Activation intent |
| GET | `/api/links/open` | Link open |
| POST | `/api/email-report` | Email report |
| GET | `/api/generate-pdf` | Generate PDF |
| POST | `/api/support-ticket` | Support ticket |
| POST | `/api/partner-apply` | Partner application |
| POST | `/api/track/view`, `/api/track/cta-click` | Analytics |
| POST | `/api/events/log` | Event logging |
| GET | `/api/test/last-lead` | Test: last lead |
| GET/POST | `/api/diag` | Diagnostics |
| POST | `/api/webhooks/resend`, `/api/webhooks/stripe`, `/api/webhooks/unsubscribe`, `/api/webhooks/sample-request` | Webhooks |
| GET | `/api/unsubscribe`, `/api/unsubscribe/[hash]` | Unsubscribe |
| GET | `/api/cron/refresh-rates` | Cron: refresh rates |
| GET | `/api/cron/precompute-pvwatts` | Cron: precompute PVWatts |
| GET | `/api/logo-proxy` | Logo proxy |
| POST | `/api/gdpr/export`, `/api/gdpr/delete` | GDPR |
| POST | `/api/admin/create-tenant` | Admin: create tenant |
| POST | `/api/admin/replay-webhook` | Admin: replay webhook |
| GET | `/api/admin/metrics` | Admin: metrics |
| GET | `/api/admin/dlq` | Admin: DLQ |
| GET | `/api/geocode` | Geocode (alternate) |
| GET | `/api/sentry-test` | Sentry test |

### A.4 External dependencies

| Dependency | Use | Env / config |
|------------|-----|--------------|
| **Stripe** | Checkout, portal, webhooks | STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY, STRIPE_PRICE_* |
| **Airtable** | Tenants, leads | AIRTABLE_API_KEY, AIRTABLE_BASE_ID |
| **Google Maps / Places** | Autocomplete (client) | NEXT_PUBLIC_GOOGLE_MAPS_API_KEY |
| **Google Geocoding** | Server-side geocode | GOOGLE_GEOCODING_API_KEY |
| **NREL PVWatts** | Solar production | NREL_API_KEY |
| **EIA** | Utility rates by state | EIA_API_KEY |
| **Resend** | Email | RESEND_API_KEY (optional) |
| **PostHog** | Analytics | NEXT_PUBLIC_POSTHOG_KEY |
| **Sentry** | Error tracking | (Sentry env vars) |
| **Vercel KV** | Webhook idempotency etc. | (Vercel) |

### A.5 Environment variables (by env)

**Local / preview / prod (shared where applicable):**

- `NEXT_PUBLIC_APP_URL` – App URL
- `NEXT_PUBLIC_BRAND_NAME` – Brand name
- `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_PRICE_STARTER`, `STRIPE_PRICE_PRO`
- `AIRTABLE_API_KEY`, `AIRTABLE_BASE_ID`
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` (client Maps/Places)
- `GOOGLE_GEOCODING_API_KEY` (server Geocoding; must allow server calls)
- `NREL_API_KEY`, `EIA_API_KEY`
- `ADMIN_TOKEN` (admin routes)
- `NEXT_PUBLIC_POSTHOG_KEY`
- Optional: `RESEND_API_KEY`, `DEFAULT_COST_PER_WATT`, `DEFAULT_DEGRADATION_PCT`, `OANDM_PER_KW_YEAR`, `DEFAULT_RATE_ESCALATION`, `DISCOUNT_RATE`, etc.

**Preview:** Same as prod; `NEXT_PUBLIC_APP_URL` may point to Vercel preview URL.  
**Prod:** Production keys and production Stripe webhook secret.

---

## B. User journeys (must always work)

1. **Demo: landing → address → quote → locked features → upgrade CTA**  
   User opens `/` or `/?company=X&demo=1`, enters address, gets report; sees locked features and upgrade CTA.

2. **Paid: landing → address → quote → lead capture → dashboard/status**  
   User on paid flow gets quote, submits lead, completes checkout (if applicable), reaches activate/dashboard.

3. **Billing: checkout → webhook → unlock paid features → receipt (if any)**  
   User completes Stripe Checkout; webhook receives `checkout.session.completed`; tenant marked paid; user can access paid features.

4. **Multi-tenant: different company slugs → correct branding/logo/colors → correct pricing/CTA**  
   `/[companyHandle]` and `/c/[companyHandle]` show correct branding, logo, theme; pricing/CTA match tenant.

5. **Estimate API: address/coords → valid estimate with NREL + shading + (when available) EIA rates**  
   `GET /api/estimate` returns valid schema, location-differentiated production, shadingAnalysis, dataSource.

6. **Geocoding: address → lat/lng**  
   `GET /api/geo/normalize?address=...` returns 200 and correct coordinates for valid US address.

7. **Health: all configured services ok**  
   `GET /api/health` returns 200 when all configured services (Airtable, Stripe, NREL, EIA, Google Geocoding, Resend) are ok; 503 only when a required service is down (Stripe may be omitted if key invalid/expired).

---

## C. Pass/fail acceptance criteria

- **Quote returns within 15 s** (target &lt; 3 s under normal load).
- **Estimate response** has valid schema: `estimate.annualProductionKWh.estimate`, `.low`, `.high`, `estimate.shadingAnalysis`, `estimate.dataSource` (NREL; + EIA when EIA used).
- **Estimate varies by location:** different lat/lng/state → different annual production and/or utility rate.
- **Lead is stored:** POST to `/api/lead` with valid payload (when Airtable configured) results in lead stored; or 400/429 when validation/rate-limit fails.
- **Stripe webhook** verifies signature and idempotency; `checkout.session.completed` marks tenant paid.
- **Geocoding:** Valid US address → 200, correct lat/lng; missing/invalid key → 503 or 400 with clear message.
- **Health:** 200 when all checked services ok; 503 when any required service down; Stripe “invalid/expired key” may be omitted from checks so health can pass.
- **Multi-tenant:** Same app, different `companyHandle` → different branding/logo/theme and correct CTA/pricing.
- **Report page:** Shows NREL/PVWatts attribution, address, numeric estimates, shading copy.
- **Demo:** Locked features and upgrade CTA visible; no crash.

---

## D. Pre-sell check (3 minutes)

Before you practice/sell each day:

1. **Last deploy:** Check Vercel dashboard – last deployment green.
2. **Smoke run:** Check GitHub Actions – last “Prod smoke” or “End-to-End Tests” run green.
3. **Errors:** Check Vercel logs + any uptime monitor for 5xx or spikes.
4. **If something failed:** Run the matching runbook (e.g. geocoding REQUEST_DENIED → `docs/GEOCODING-FIX-DEFINITIVE.md`; health 503 → check which service and env vars).

---

## References

- [Playwright best practices](https://playwright.dev/docs/best-practices)
- [Next.js testing](https://nextjs.org/docs/app/guides/testing)
- [Stripe webhooks](https://docs.stripe.com/webhooks)
- [Vercel deployments](https://vercel.com/docs/deployments/environments)
- [Vercel: run E2E after preview](https://vercel.com/kb/guide/how-can-i-run-end-to-end-tests-after-my-vercel-preview-deployment)
