# GLPCONVERT_REWRITE_PASS_APR2026.md

Concise log of the **Apr 2026** product/copy/visual pass aligned with `MASTER_TODO_GLPCONVERT.md` **R-Apr-2026** and the revenue-conversion-layer spec.

## Implemented in this pass

| Area | Change |
|------|--------|
| **Trust / about** | `data/trust.json` — GLPConvert mission, illustrative metrics, optional hero testimonial (composite disclaimer in compliance doc). |
| **Social proof** | `components/Testimonials.tsx` — med spa / telehealth / white-label SaaS buyer quotes; “Illustrative” pill; section disclaimer. |
| **Home** | `app/page.tsx` — KPI band driven by `MetricsBar` + `trust.json`; fixed double-period microcopy; `data-testid="kpi-band"` preserved for spacing tests. |
| **Default colors** | `components/BrandCSSInjector.tsx` — slate neutral scale when tenant branding is off (replaces consumer orange default). |
| **Intake UX** | `lib/glp-intake-ui.ts`, `components/intake/GlpSimulationFunnel.tsx` — `grid2Form`, `formActions`, fieldset spacing, results trust header polish, trajectory timeline, branded confirmation step. |
| **SSR mode flag** | `app/intake/page.tsx` sets **`data-intake-mode`** on `<main>` from `searchParams` so Playwright / SEO see demo vs paid without waiting on client-only `Suspense`. |
| **Branding params** | `parseDemoBranding` honors `brandColor` before `primary` / `brand` hex. |
| **Nav + about** | `app/about/page.tsx`; `SharedNavigation` — About (demo); paid mode Help / Privacy / About. |
| **Install sheet** | `src/demo/InstallSheet.tsx` — GLP subdomain slug (single label), embed host `.c.glpconvert.com`, copy updates. |

## Intake routing decision

**Single-page stepped wizard** (`/intake` with internal steps 1–6) is **locked** for demo≈paid parity, mobile speed, and cold-email “instant demo” links. Splitting into separate routes is **not** implemented; revisit only if analytics prove abandonment at a specific step.

## Tests

- Run locally: `npm run test:glp-visual:local` (Playwright starts `next dev` on **port 3330** per `playwright.glp-visual.config.ts`; dev script may use **3000** — do not confuse ports).
- Optional reuse: `PW_REUSE_DEV=1` if you already have a server on 3330.

## Blocked on human input

- **U024** — Final legal sign-off on composite testimonials, disclaimers, and any “HIPAA-compliant” vs “HIPAA-ready” wording in sales.
- **Real clinic assets** — Logos, booking URLs, and live pricing for production tenants (Supabase / admin), not this repo.

## Recommended next execution order

1. Green **`test:glp-visual:local`** + fix any selector drift.  
2. **`npm run build`** on CI.  
3. Deploy preview → **`npm run test:glp-visual:live`** against `BASE_URL`.  
4. Human: **U038** Stripe + **M000** Resend + **U024** counsel on trust copy.
