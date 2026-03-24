# GLPConvert migration audit (sunspire-clean → GLPConvert)

## Important repo note

- **Source:** `sunspire-clean` at `/Users/hugowentzel/sunspire-clean`
- **Destination:** this project at `/Users/hugowentzel/GLPConvert` (initially empty; codebase copied via rsync excluding secrets/build artifacts)

## What sunspire-clean currently is

- **Stack:** Next.js 14 (App Router), React 18, TypeScript, Tailwind, Stripe, Supabase client, Resend/SMTP email, Sentry, PostHog hooks, Playwright + Vitest.
- **Product shape:** B2B white-label **solar** lead-gen: address → PVWatts/NREL-backed **estimate** → **report** page → lead capture; **demo mode** via query params; **paid** onboarding with Stripe; **tenant dashboard** (`/c/[handle]`); **embed** and **magic link** patterns.
- **Data:** Supabase-oriented helpers (`src/lib/db-*`); health route aggregates external dependencies.
- **Deploy:** Vercel-oriented (`vercel.json`, standalone output); many env vars for maps, NREL, EIA, Stripe, etc.

## What GLPConvert must become

- White-label **pre-consult conversion** for **GLP-1 / medical weight-loss** clinics: intake → **deterministic program suggestion** + **price signal** + **booking CTA**; **not** EMR, not telehealth infra, not diagnosis or dosing.
- **Parent brand:** Wellspire LLC; first vertical **GLPConvert**; future **TRTConvert**, **PepConvert** as template variants (intake, rules, pricing, compliance, CRM differ only).

## Reuse estimate

| Layer | Approx. reuse |
|-------|----------------|
| Stripe, provisioning, email, admin shells, legal routes, embed/hosting | **High** |
| Brand takeover / demo / dashboard | **High** with copy changes |
| Report + estimate + solar APIs | **Low** (retire or isolate) |
| E2E tests | **Low** until flows rewritten |

**Overall:** ~55–70% of *engineering surface* reusable; ~30–45% of *user-visible product* must change.

## Delete / refactor / rebuild (summary)

- **Refactor:** Homepage flow, footers, emails, package name, storage keys, env strictness for local GLP dev.
- **Rebuild:** Intake UI, recommendation catalog from DB, result page as primary outcome, CRM field mapping.
- **Delete (later, carefully):** Solar-specific tests and scripts after replacement coverage exists.

## Biggest risks

1. **Compliance copy** slipping into “you qualify” / dosing / outcome claims.
2. **HIPAA/PHI:** minimize health data in v1; legal review for intake fields.
3. **Legacy `/report` + `/api/estimate`** still reachable — may confuse users or imply clinical modeling.
4. **Stripe** products still named or metadata-tied to Sunspire in Dashboard (human update).
5. **Embeds** (`public/embed.js`) still reference old host + `sunspire-*` meta names.

## File / folder audit (high level)

- `app/` — routes for marketing, API, legal, dashboard, embed: **keep structure**, swap product logic in `page.tsx`, `report/`, new `result/`.
- `app/api/` — **keep** lead/stripe/provision; **isolate** estimate/solar cron jobs when vertical=glp.
- `components/legal/*` — **updated** for Wellspire / GLP disclaimers (partial).
- `lib/verticals/` — **new** template scaffold.
- `src/config/env.ts` — **relaxed** optional solar/maps for local dev.

## Route audit

| Route | GLPConvert intent |
|-------|-------------------|
| `/` | Marketing + entry to intake (address flow temporary) |
| `/result` | **NEW** — recommendation + CTA scaffold |
| `/report` | **Legacy** solar report — deprecate or feature-flag |
| `/api/recommend` | **NEW** — POST intake → JSON recommendation |
| `/c/[companyHandle]` | Clinic dashboard — copy updated |
| `/embed/[slug]` | Keep; reword for intake |
| `/pricing`, `/signup`, `/paid`, `/activate` | Keep SaaS funnel |
| Legal | Keep; update body copy with counsel |

## Billing / deployment / env

- **Stripe:** Same integration pattern; new Product/Price IDs and invoice descriptors for Wellspire/GLPConvert.
- **Vercel:** New project recommended (clean env + domain); see `GITHUB_VERCEL_SUPABASE_RESEND_STRIPE_CHECKLIST.md`.
- **Env:** See `ENV_VARS_GLPCONVERT.md` and `.env.example`. Solar keys optional locally; production admin/JWT/Stripe still required for full admin.

## Legal / compliance boundary

- Product is **marketing + intake + booking**; disclaimers on result pages, footers, intake intro. See `GLPCONVERT_LEGAL_COMPLIANCE_NOTES.md`.

## Positioning boundary (copy)

- Avoid equivalence claims for compounded vs FDA-approved products unless attorney-approved.
- Prefer “many patients explore programs like X” and “licensed provider determines eligibility.”

## Competitor / positioning notes (non-exhaustive)

- **Generic form builders (Typeform, Jotform):** GLPConvert wins on **vertical-specific intake**, **deterministic recommendation + price signal**, and **clinic dashboard/embed** — not “another form.”
- **Full practice-management / EMR:** GLPConvert is **not** competing on charts or prescribing; it is **pre-consult conversion** only. Keep messaging narrow to avoid buyer confusion and regulatory over-claiming.
- **Agency-built landing pages:** GLPConvert wins on **repeatable white-label** deployment, **Stripe self-serve onboarding**, and **compliance-aware copy scaffolding** (still needs counsel per tenant).
- **Other “GLP funnels”:** Differentiate on **Wellspire multi-vertical engine** (TRT/Pep templates), **CRM handoff quality**, and **no diagnosis/dosing** positioning.
