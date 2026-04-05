# Demo-led intake redesign (Apr 2026)

Goals: cold-email / DM demos should feel **clinic-owned**, minimize vendor chrome, keep **demo ≈ paid** (~95%), and preserve **educational-only** positioning (no eligibility or prescribing language).

## Shipped in this pass

- **No site header on `/intake`:** `ConditionalSharedNav` excludes `/intake` so marketing nav never appears above the funnel.
- **Marketing home `/?demo=1`:** header keeps **Intake demo** + **More** (Pricing / Partners / Support / About) + **Activate your intake**; vendor subtitle shows **Branded preview** instead of the product name. Non-demo pages use a **Legal & help** menu instead of three top-level links.
- **Clinic bar (demo + paid):** logo/monogram, clinic name, `Preview for {clinic}` (demo) vs `Your next step — before the consult` (paid). `data-intake-clinic-bar="demo"|"paid"` for tests.
- **Hero:** short value headline; demo production URL hints in `<details>`.
- **Trust:** one muted microline inside the funnel column (`data-intake-trust` in `GlpSimulationFunnel`), directly under the stepper — not a separate ribbon above the form.
- **Footer:** shorter disclosure; `data-intake-attribution` on vendor line; fewer links.
- **Funnel:** tighter step-1 and results copy; path → expectations → price → trajectory in `<details>`; results primary CTA **Next step**; readiness title **Almost there**; demo skip in collapsed `<details>`; building overlay refined.
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
