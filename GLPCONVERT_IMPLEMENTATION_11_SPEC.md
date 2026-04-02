# GLPConvert — 11/10 revenue-layer implementation tracker

**Single spec anchor** for the “category-dominating” product definition (white-label pre-consult conversion + consult readiness + demo-led sales). **Not legal advice.**  
**Strategy:** `PRODUCT_STRATEGY_GLPCONVERT.md` · **Demos:** `DEMO_STRATEGY_GLPCONVERT.md` · **Compliance:** `COMPLIANCE_NOTES_GLPCONVERT.md` · **Queue:** `MASTER_TODO_GLPCONVERT.md` Phase **R** / **U017+**.

## Locked product shape (5 layers)

1. **Traffic monetization** — ads, landers, embed, demo URLs.  
2. **Expectation engine** — process, timeline, “what to expect.”  
3. **Consult readiness** — price comfort, timing, intent (non-clinical).  
4. **ROI + attribution** — UTM, optional pixels, lead handoff.  
5. **Compliance shield** — minimal copy, consent, HIPAA-**ready** posture (BAA/counsel).

## Implementation status vs codebase (this pass)

| Area | Status | Where |
|------|--------|--------|
| Flow: input → transition → results → readiness → lead → confirm | **Shipped** | `components/intake/GlpSimulationFunnel.tsx` |
| Trust chips + “Your GLP Path” + process + expectations + price range + FAQ + footer | **Shipped** | Step 3 |
| Demo banner + owner leak + before/after + ROI bullets + activate CTA | **Shipped** | `GlpDemoOwnerPanels.tsx`, `demo=1` |
| Readiness → lead JSON | **Shipped** | `POST /api/lead` |
| UTM persistence | **Shipped** | `lib/glp-attribution.ts` |
| Pixels (optional) | **Shipped** | `AttributionPixels` on intake layout |
| **Demo URL logo + primary (and optional secondary) color** | **Shipped** | `/intake?logo=&brand=&brand2=` — see `DEMO_STRATEGY_GLPCONVERT.md` |
| Tenant DB pricing / disclaimers / CTA URLs | **Partial** | Booking + **optional** `crm_keys` intake economics + display name + secondary color via **`GET /api/public/tenant-intake-config`** + funnel merge (**U018** admin UI still open) |
| Post-lead CRM webhook | **Shipped** | **`POST /api/lead`** → tenant **Capture URL** (`lib/crm-lead-webhook.ts`) — **R006** |
| Clinic dashboard metrics | **Partial** | Leads table shows **booking_status**, path, budget (**`/c/{handle}/leads`**) |
| Embed + `postMessage` polish | **Partial** | **`/docs/embed`** prod vs demo + `handle=`; **R017** postMessage / height automation |
| Performance / per-lead pricing | **Open** | product/pricing model — **not** in core checkout yet |
| Network benchmark index | **Open** | long-term moat — not started |
| HIPAA: BAA execution, audit policy | **Human + counsel** | **R009**, **U024** |

## Priority order (execution)

1. ~~Audit + align docs~~ (this file + `MASTER_TODO` + strategy docs).  
2. ~~**R006** webhook handoff after lead~~.  
3. **U017–U019** tenant-configured economics + CTAs (replace hardcoded sim ranges where configured).  
4. **R007** minimal dashboard.  
5. **R017** embed hardening.  
6. **R012–R014** API cleanup + docs.  
7. **U022–U023** disclosure patterns + compounded copy guardrails.  
8. **U033** Playwright full funnel (includes `test:glp-visual:*` for branded demo + buyer).

## Blocked — human / third party only

- Stripe live mode, domain DNS, real clinic assets for production tenants.  
- **Counsel:** final disclaimers, BAA templates, any “HIPAA compliant” **marketing** claim (use **HIPAA-ready** until signed).  
- **Clinic-specific** booking URLs: set in Supabase `tenants.crm_keys` as `{"booking_url":"https://..."}` or pass `bookingUrl` to **`POST /api/admin/create-tenant`**. Demo override: **`/intake?...&booking=https%3A%2F%2F...`**  
- Meta / Google **business** accounts for ads (pixels env only is code-side).

## Risks / assumptions

- **Lost revenue** math is **illustrative** only; labels say so — required for honest outbound.  
- Sim economics remain **educational** until **U018** feeds tenant ranges.  
- Logo URL must be **HTTPS** in browser to avoid mixed-content blocks.
