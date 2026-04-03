# Demo-led intake redesign (Apr 2026)

Goals: cold-email / DM demos should feel **clinic-owned**, minimize vendor chrome, keep **demo ≈ paid** (~95%), and preserve **educational-only** positioning (no eligibility or prescribing language).

## Shipped in this pass

- **No site header on `/intake`:** `ConditionalSharedNav` + `app/layout.tsx` use `ConditionalSharedNav`; `/intake` excluded so Pricing / Partners / Launch strip does not appear above the funnel.
- **Clinic bar (demo + paid):** logo/monogram, clinic name, `Preview for {clinic}` (demo) vs `Your next step — before the consult` (paid). `data-intake-clinic-bar="demo"|"paid"` for tests.
- **Hero:** short value headline; demo production URL hints in `<details>`.
- **Trust:** replaced large “Trust & operations” grid with one muted line (`IntakeTrustRibbon`).
- **Footer:** shorter disclosure; `data-intake-attribution` on vendor line; fewer links.
- **Funnel:** tighter step-1 and results copy; trajectory before price; results primary CTA **Next step**; readiness title **Almost there**; demo skip in collapsed `<details>`; building overlay refined.
- **Owner panels (demo only):** shorter impact + before/after + **Activate this intake** CTA.
- **Tests:** `glp-branded-e2e-visual.spec.ts` — assert no `main-site-nav` on intake; **F** mobile screenshots; selectors updated for new CTA/headings.

## Simulation / results (Apr 2026 follow-on)

- **Trust strip** (`data-results-trust-strip`) above the hero: logo + chips only.
- **Hero** focuses on pre-visit topics; timeline/path softened; no duplicate chips in hero.
- **Order:** Path → Expectations (3 cards) → **Price clarity** (Starts around + typical range) → **Trajectory** in `<details>` with compact chart (supporting only).
- **`runSimulation`:** Less clinical `pathLabel` + phase copy oriented to “what happens next.”
- **Playwright:** Asserts `data-results-*` regions on results step.

## Follow-ups (human / product)

- **R041** Legal review of footer + funnel disclaimers after copy reduction.
- **`UI_COPY_REWRITE.md`** and **`UI_POLISH_CHECKLIST.md`** added as living checklists.

## Compliance note

Visible UI stays **general information, not medical advice**; **individual results vary**; **pricing varies by provider**; **licensed provider decides treatment**. Heavier policy text remains on `/legal/*`.
