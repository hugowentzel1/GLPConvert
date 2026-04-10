# GLPConvert: purpose, go-to-market, and white-label data delivery

## Product purpose

**GLPConvert** is a **white-label, hosted conversion layer** for medical weight-loss and telehealth clinics that already buy traffic for GLP-1 programs. It sits **between paid acquisition (ads, SEO, referrals) and the clinic’s own scheduler or CRM**: a branded **education + structured intake** experience that sets expectations, captures consent-aligned lead data, and **hands off** to the clinic’s booking URL or stack.

It is **not** an EMR, **not** prescribing software, and **not** a substitute for licensed clinical judgment. Positioning is **pre-consult clarity and operational leads**, aligned with buyer expectations for **self-serve evaluation** and **transparent pricing** (see industry framing: Gartner on rep-free buying and value clarity; HubSpot on independent research; Stripe on checkout transparency).

## Go-to-market (stated)

- **Outbound**: Cold email to clinics and decision-makers with **individualized demo links** that apply the prospect’s **logo and brand colors** to the intake and marketing surfaces so evaluation feels like *their* patient path, not a generic vendor deck.
- **Parallel channel**: **Cold LinkedIn DMs** with the same principle—short, specific, link to a **private preview** rather than a calendar-first pitch.
- **Funnel**: Email/DM → **branded demo URL** → self-serve **intake preview** and optional **checkout** (Stripe) → **onboarding** (email + tenant dashboard) → **embed or hosted link** live for real patients.

This matches **product-led** motion: buyers **realize benefit in-product** before heavy sales touch (OpenView / PLG framing).

## What white-label tenants should receive (operations)

Successful white-label SaaS operators typically deliver:

1. **Identity & routing**
   - Stable **tenant handle** (slug), **display name**, **primary/secondary brand colors**, **logo URL** (proxied where needed).
   - **Hosted patient URL(s)** and optional **embed snippet** for the clinic’s site.

2. **Commercial & billing truth**
   - **Stripe Customer / Subscription** (or equivalent) with **metadata** joining `company`, `tenant_handle`, **UTM parameters**, and **`client_reference_id`** for support and analytics.

3. **Lead and patient-completion data**
   - **Webhook** and/or **email** notifications for new leads with a structured payload (PII handled per policy and BAA/DPAs as applicable).
   - **Dashboard or export** for volume, last activity, and configuration status.

4. **Onboarding artifact**
   - One **checklist email** after purchase: next steps, support contact, refund/support policy links, security/methodology links.

Routing **does not** need to hit the tenant’s *own* backend for GLPConvert to work: the **platform backend** (this app + Stripe + email) is the default. **Optional** integrations forward to **their** CRM, Zapier, or custom HTTPS endpoint—this is the common white-label pattern (hub-and-spoke: **your** API as system of record for the product, **their** systems as destinations).

## How delivery works in this codebase (summary)

- **Checkout**: Browser builds a full payload via `buildStripeCheckoutClientPayload()` (`lib/stripe-checkout-client.ts`)—merged UTMs, `cancel_url`, `client_reference_id`—and posts to `POST /api/stripe/create-checkout-session`.
- **Attribution**: `persistUtmFromSearchParams` + `getMergedUtm` (`lib/glp-attribution.ts`) keep campaign continuity from first touch through checkout.
- **Events**: `track()` (`src/demo/track.ts`) posts to `/api/demo-event` for funnel analytics (`demo_home_view`, `intake_preview_click`, `checkout_start`, etc.).
- **Leads**: Intake completion flows through lead APIs (see `app/api/lead` and related docs); **paid** mode associates submissions with the **tenant handle** so the **leasing clinic** sees **their** prospects in **their** configured destinations.

## Paid patient (“customer”) journey — data placement

1. **Patient** opens **paid** intake (e.g. `/intake?handle=…` without demo flags, or clinic-branded hosted path).
2. **Tenant config** is loaded server/public API (`tenant-intake-config`) so UI reflects **that clinic’s** booking URL, pricing notes, and branding.
3. **Completion** creates or updates a **lead record** scoped to **`handle` / tenant** so:
   - Operations email and webhooks fire **for that tenant**.
   - The **white-label customer** (the clinic) sees activity in **their** pipeline—not mixed with other clinics.

The **platform** stores authoritative **tenant configuration** and **lead events**; the clinic may **mirror** data into their CRM via integrations. **Stripe** holds billing identity; **metadata** links checkout to tenant for reconciliation.

## Design principle for “premium”

**Their** brand color is the hero; the shell stays **neutral, spacious, and legible** (credibility and disclosure per NN/g and Stripe checkout guidance). Motion stays **subtle** and respects **`prefers-reduced-motion`**.
