# PRODUCT_STRATEGY_GLPCONVERT.md

Authoritative product framing for engineering and sales. Complements `GLPCONVERT_PRODUCT_SPEC.md` and `MASTER_TODO_GLPCONVERT.md`.

## What GLPConvert is

A **HIPAA-ready, white-label, pre-consult conversion layer** for GLP-1 / medical weight-loss clinics: it turns existing traffic into **more booked, higher-intent consults** with clearer expectations and measurable attribution—without acting as EMR, telehealth, prescribing, diagnosis, or clinical decision support.

## Two surfaces (same core product)

1. **Demo / outbound (buyer)** — Cold email and LinkedIn with a **personalized, branded link** (`demo=1`). Goal: the owner sees “this is already my front end,” then **clicks through to Stripe and activates without a sales call**. Patient UX matches production (~95%); only preview banner, owner ROI/leak panels, and activation CTAs differ.  
2. **Paid / production (patient)** — The **same funnel** on the clinic’s ads, landing pages, site, or embed. Goal: **maximize consult bookings and downstream GLP program conversion** through clarity, trust, readiness, and clean handoff to their booking/CRM—still not clinical decisioning.

## What it is not

- Quiz-for-leads gimmick, generic funnel builder, or “AI prognosis” product  
- Replacement for the provider relationship or clinical judgment  
- Heavy analytics / BI platform  

## Five layers (architecture mental model)

1. **Traffic monetization** — deployable in ads, landers, site embeds, funnel steps.  
2. **Expectation engine** — process, timeline, and “what to expect” in plain language.  
3. **Consult readiness** — lightweight price/urgency/intent signals before booking.  
4. **ROI + attribution** — UTM persistence, optional pixels, lead handoff for CRM proof.  
5. **Compliance shield** — minimal disclosures, consent, encryption/BAA posture (see `COMPLIANCE_NOTES_GLPCONVERT.md`).

## Strategic rules

- **Demo ≈ paid** (~95% same UX); demo adds preview banner, owner-facing ROI/leak framing, activation CTA only.  
- **Every feature** must map to conversion, consult quality, trust, attribution, or activation.  
- **Copy** is commercially strong, not hype; no “you qualify / approved / guaranteed outcomes.”  

## Design & UX discipline (white-label, any clinic)

UX patterns follow **reduced cognitive load**, **clear hierarchy**, **progressive disclosure**, and **trust-first** forms—aligned with widely cited guidance (e.g. **Nielsen Norman Group**, **Baymard Institute** checkout/form research, **CXL** conversion heuristics). Implementation notes and outbound context: **`docs/GLPCONVERT_OUTREACH_UX_SOURCES_MAR2026.md`**, **`docs/GLPCONVERT_WHITE_LABEL_SAAS_SOURCES.md`**. **Mar 2026 white-label SaaS norm:** a **neutral product canvas** (slate/off-white surfaces, restrained borders) with **tenant accent only on CTAs and key highlights**—so loud prospect brand colors never turn the whole page into “their brochure.” Avoid full-bleed brand gradients, scale-on-hover gimmicks, and rainbow progress chrome; those read as consumer growth-hack, not enterprise clinical-adjacent tooling.  

## Core visitor flow (locked)

1. Fast input (weight, goal, height, timeframe, optional path/struggle/budget—no contact first).  
2. Short transition (“Building your plan…”).  
3. **Results** — trust header, headline **Your GLP Path**, process, expectations, price range + disclaimer, optional mini-FAQ, compliance footer.  
4. **Consult readiness** — non-clinical questions (price comfort, timing, next-step intent).  
5. **Lead capture** — name, email, optional phone, consent, next-step preference.  
6. **Confirmation** — branded reassurance + what happens next.

## Demo-only surfaces (clinic-owner psychology)

- **Revenue leak / lost opportunity** — conservative, illustrative framing (not a guaranteed financial audit).  
- **Before vs after funnel** — contrast vague path vs clarity path.  
- **ROI / impact summary** — directional business language, no fabricated benchmarks unless sourced.

## Dashboard (minimal)

Traffic/starts, completions, leads, booking handoff where trackable, readiness summary, branding/pricing/routing settings, attribution summary when wired.

## Deployment modes (target)

Dedicated landing page, embed/module, pre-consult funnel step, personalized demo URL (`company`, `demo=1`, optional `logo`, `brand` query params where supported).

## Master outbound pitch (internal + email backbone)

Most GLP clinics already pay for traffic — the gap is how much of it never becomes **booked, high-intent consults** because the path, expectations, and price band stay vague until too late. GLPConvert upgrades **what happens before the consult** so more sessions turn into consults that are easier to close — **your** branded layer on ads, landers, or site. Demo mode surfaces **illustrative** “where value leaks” framing for owners, without guaranteeing financial outcomes.  
**CTA:** *I built a live version for {{ClinicName}} — want to see it?* (`/intake?demo=1&company=…&logo=…&brand=…`) → owner can **Subscribe & activate** on **`/pricing`** (Stripe) with no meeting.

## Related files

- `DEMO_STRATEGY_GLPCONVERT.md` — how demos are sold and parameterized.  
- `COMPLIANCE_NOTES_GLPCONVERT.md` — HIPAA-ready checklist + minimal copy patterns.  
- `MASTER_TODO_GLPCONVERT.md` — implementation queue (Phase **R** + existing **U** phases).  
- `GLPCONVERT_IMPLEMENTATION_11_SPEC.md` — **spec ↔ code** matrix and execution priority.
