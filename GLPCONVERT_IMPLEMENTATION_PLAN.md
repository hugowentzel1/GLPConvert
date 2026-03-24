# GLPConvert implementation plan

## Phase 0 — Foundation (**in progress**)

| Task | Status |
|------|--------|
| Copy `sunspire-clean` → `GLPConvert` repo | **DONE** |
| Rename package, metadata, core footers, email branding | **DONE** |
| Add `lib/product-identity.ts`, vertical types, GLP intake + recommend stubs | **DONE** |
| Add `/api/recommend`, `/result` demo | **DONE** |
| Relax `src/config/env.ts` for optional solar/maps; JWT local fallback | **DONE** |
| Docs: audit, spec, legal notes, reuse map, human-actions | **DONE** |
| `npm run build` green | **DONE** |

## Phase 1 — Intake & result spine

1. **Intake UI** — Stepper using `glpIntakeQuestions`; progress persistence; mobile-first.
2. **Session model** — URL state + optional server session id for resume.
3. **Result page** — Consume real answers; show program card, price signal, CTA deep-link to clinic calendar or `/contact`.
4. **Feature flag** — `NEXT_PUBLIC_VERTICAL` or tenant `vertical` column default `glp`.

## Phase 2 — Data model

1. Supabase tables (draft migrations in later task): `tenants`, `tenant_programs`, `intake_sessions`, `intake_answers`, `recommendations`, `bookings` (optional).
2. API routes: persist intake, attach to lead payload.
3. Redact/export/delete flows aligned with GDPR routes already present.

## Phase 3 — White-label

1. Tenant theme: logo, colors, copy blocks, disclaimer overrides.
2. Hosted URL generation already in dashboard — update embed snippet text for GLP.
3. `public/embed.js` — rename meta tags; configurable `apiUrl`.

## Phase 4 — Stripe / billing

1. New Products: setup + recurring for GLPConvert; metadata `product=glpconvert`, `tenant_id`.
2. Webhook: map to provisioning same as today; update email copy (**DONE** in template).
3. Test mode E2E before live keys.

## Phase 5 — CRM routing

1. Per-tenant webhook URL + secret; map structured fields (no PHI default).
2. Optional native HubSpot/Salesforce later.

## Phase 6 — Retire solar surface

1. Remove or gate `/report`, `/api/estimate`, NREL health checks when `vertical=glp`.
2. Prune solar E2E or rewrite for `/result`.

## Phase 7 — Launch

1. Production env on Vercel; smoke test checklist.
2. Status page copy; incident contacts.
3. Counsel sign-off on legal pages.

## Testing plan

- Unit: `recommendGlpProgram` with fixture answers.
- API: POST `/api/recommend` contract.
- E2E: demo URL → intake → result → CTA (new spec file).

## Files to touch next (priority)

- `app/page.tsx` — replace address block with intake import.
- `app/report/page.tsx` — deprecation banner + link to `/result`.
- `public/embed.js` — rebrand.
- `README.md` — GLPConvert overview.
