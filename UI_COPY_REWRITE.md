# UI copy map (GLP intake + results)

Living index of **patient-facing** and **demo-owner** strings. Prefer short, calm, non-clinical language; avoid eligibility, guarantees, and “AI” fluff.

| Surface | Location | Notes |
|--------|----------|--------|
| Intake trust microline | `GlpSimulationFunnel.tsx` (`data-intake-trust`) | TLS + routing + general information (under stepper) |
| Intake header / hero | `IntakePageHeader.tsx` | Clinic bar; demo vs paid sublines |
| Stepper | `GlpSimulationFunnel.tsx` → `IntakeStepper` | Progress labels; building = not a step |
| Step 1 form | `GlpSimulationFunnel.tsx` | Field labels; Continue |
| Building overlay | same | Premium framing, not “building plan” |
| **Results trust strip** | same, `data-results-trust-strip` | Logo + chips |
| **Results hero** | same | Your GLP path + pre-visit framing |
| Path / phases | `runSimulation` → `phasePlan` | Process clarity, not dosing |
| Expectations | 3 cards | Early / Middle / Ongoing |
| Pricing | `data-results-pricing` | Starts around + typical range + vary copy |
| Trajectory | `details` + `GlpWeightTrajectoryChart` | Optional, compact, not a forecast |
| Readiness | Step 3 fieldsets | Comfort / timing / forward intent |
| Contact / Done | Step 4–5 | Save, book, confirmation |
| Demo owner panels | `GlpDemoOwnerPanels.tsx` | Impact + before/after + setup + activate |
| Footer | `IntakePageFooter.tsx` | Vendor line + short legal |

When changing copy, re-run **`npm run test:glp-visual:local`** and spot-check **`/intake?demo=1`** vs paid.
