# GLPConvert product spec (v1 draft)

**Owner:** Wellspire LLC  
**Product:** GLPConvert (first vertical on shared engine)

## Definition

GLPConvert is a **white-label conversion layer** that sits in front of a clinic’s existing booking stack. It converts paid/organic traffic into **structured leads**, a **recommended program/package**, a **price signal**, and **booked consults or deposits**, with **CRM-friendly** handoff.

## ICP

- Cash-pay or hybrid **medical weight-loss / GLP-1** clinics and small groups
- Marketing teams needing **fast white-label** funnels without building compliance-aware copy from scratch

## Promise (exact)

- “**Branded intake and booking** that respects medical-advertising boundaries — **you** prescribe; we **don’t** diagnose or decide medication eligibility in software.”

## Core flows

1. **Hosted clinic funnel** — tenant subdomain or path; full-page intake.
2. **Embed** — script/iframe; same engine, clinic branding.
3. **Personalized demo** — `?company=&demo=1` style preview for sales (existing pattern).
4. **Recommendation result** — program name, short rationale, price signal, disclaimers, primary CTA (book / deposit).
5. **Clinic onboarding** — Stripe → provisioning email → dashboard (`/c/[handle]`).
6. **Admin** — internal metrics/ops (existing routes; narrow for v1).

## Package recommendation rules (v1)

- **Deterministic** from intake answers (no ML diagnosis).
- Outputs: `programId`, display name, rationale (safe wording), `priceSignal` (`fixed` | `starts_at` | `range`), `urgencyScore` for internal routing only.
- **Catalog source:** start config JSON; migrate to Supabase `programs` per tenant.

## Price display rules

- Show **fixed** only when contractually fixed; else **starts at** or **typical range** with clarifying line that clinic confirms in consult.
- Never imply insurance guarantee or specific medication approval.

## Hosted vs embed

- **Same** vertical config; embed passes `tenant` slug + optional theme overrides.
- Cookie/consent banners must work in iframe (existing `CookieConsent` — verify third-party cookie constraints).

## Future vertical template architecture

Per vertical module (`lib/verticals/{glp|trt|pep}/`):

- `intake.ts` — question definitions
- `recommend.ts` — pure functions, testable
- `compliance.ts` — disclaimer strings + banned phrases lint list (future)
- `crm.ts` — field mapping hooks (future)

Shared: Stripe, auth patterns, dashboard shell, email transport, legal page layout.

## Non-goals (v1)

- EMR integration, e-prescribing, lab ordering, diagnosis, dosing/titration engines.
