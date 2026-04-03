# UI polish checklist (intake + results)

Use before shipping visual changes.

- [ ] **Hierarchy:** Trust strip → hero → path → expectations → price → optional trajectory → CTA (readiness is next step).
- [ ] **Demo ≈ paid:** Same shell; demo-only badge, owner panels, URL `<details>`.
- [ ] **Spacing:** `glp-intake-ui` tokens; section rules consistent.
- [ ] **Focus:** Inputs + buttons + choice chips have visible `focus-visible` rings.
- [ ] **Charts:** Trajectory is **supporting** (collapsed by default); not the hero.
- [ ] **Pricing:** “Starts around” + “Typical monthly range”; always “may vary” / provider confirms.
- [ ] **Compliance:** No qualification language; individual results vary; licensed provider decides.
- [ ] **Nav:** No `SharedNavigation` on `/intake`; marketing home can keep full nav.
- [ ] **Tests:** `npm run test:glp-visual:local` green; spot mobile 390px.
