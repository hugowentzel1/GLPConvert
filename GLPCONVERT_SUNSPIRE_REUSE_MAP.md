# GLPConvert ← sunspire-clean reuse map

**Source inspected:** `/Users/hugowentzel/sunspire-clean`  
**Destination:** `/Users/hugowentzel/GLPConvert` (full tree copied excluding `node_modules`, `.git`, `.next`, `.env.local`, `.vercel`)

## KEEP (white-label engine)

| Area | Paths / notes |
|------|----------------|
| Next.js App Router shell | `app/layout.tsx`, `app/globals.css`, middleware patterns |
| Multi-tenant / brand takeover | `src/brand/*`, `useBrandTakeover`, `BrandProvider`, `CompanyContext` |
| Stripe checkout + webhooks | `app/api/stripe/*`, `app/api/webhooks/stripe/*`, `app/api/checkout/*`, `app/api/provision/*` |
| Lead APIs | `app/api/lead/*`, `app/api/submit-lead/*`, `app/api/leads/*` |
| Admin scaffolding | `app/admin/*`, `app/api/admin/*` |
| Legal page routes | `app/privacy`, `app/terms`, `app/dpa`, `app/security`, `app/legal/*` |
| Embed / hosted clinic | `app/embed/*`, `app/[companyHandle]`, `app/o/*`, `public/embed.js` (needs rebrand IDs) |
| Dashboard UX | `app/c/[companyHandle]/page.tsx` |
| Supabase client | `src/lib/supabase.ts`, `src/lib/db-*.ts` |
| Email | `lib/email-service.ts` (rebranded to GLPConvert) |
| Health | `app/api/health/route.ts` |
| Rate limits / KV | `lib/dead-letter-queue.ts`, KV usage where present |

## KEEP BUT RENAME / REBRAND

| Item | Action |
|------|--------|
| `package.json` name | **DONE** → `glpconvert` |
| `sunspire-*` localStorage / session keys | **PARTIAL** → `glpconvert-*` + legacy migration in `useBrandTakeover` / homepage |
| `public/embed.js` meta names (`sunspire-*`) | **TODO** → `glpconvert-*` or neutral `wellspire-*` |
| Playwright / scripts default URLs | **TODO** → new production URL when known |
| README | **TODO** → GLPConvert / Wellspire |

## KEEP BUT REFACTOR

| Item | Target direction |
|------|------------------|
| Homepage `app/page.tsx` | Replace address-first flow with GLP intake; keep demo/checkout wiring |
| `app/report/page.tsx` | Deprecate or gate behind vertical; primary result = `app/result` + `/api/recommend` |
| `app/api/estimate/*` + NREL/EIA | Optional module behind `vertical === glp` feature flag or remove when solar retired |
| `src/config/env.ts` | **DONE** — solar keys optional; document local vs prod requirements |
| `components/legal/PVWattsBadge.tsx` | Replace usages with generic compliance badge |
| Trust copy / KPIs on homepage | Replace solar metrics with GLP/clinic placeholders |

## REBUILD

| Item | Notes |
|------|-------|
| GLP intake UI | Wire `lib/verticals/glp/intake.ts` to stepper pages |
| Recommendation engine | Expand `lib/verticals/glp/recommend.ts` + tenant program catalog |
| CRM routing per vertical | Config table + webhook field mapping |
| Compliance text per tenant | DB or config JSON keyed by `vertical` + `tenant_id` |

## DELETE (when safe)

| Item | Notes |
|------|-------|
| Solar-only scripts/tests (optional) | Large `tests/*` and root `*.js` debug helpers tied to sunspire URLs — prune in a dedicated pass to avoid breaking CI unexpectedly |
| Duplicate `Downloads/sunspire-clean` | Not in repo — ignore |

## Estimated reuse

- **Infrastructure (auth patterns, Stripe, email, deploy, legal shells):** ~70–85% reusable with renames.
- **Product UX / copy / estimation core:** ~20–40% reusable; GLP intake + compliance replace solar report spine.
