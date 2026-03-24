# MASTER_TODO_GLPCONVERT.md — single source of truth

**Statuses:** `DONE` | `IN_PROGRESS` | `TODO` | `BLOCKED`  
**Tags:** `[AUTO]` agent/dev in repo | `[HUMAN]` requires your account/dashboard/legal

**Checklist file path:** `MASTER_TODO_GLPCONVERT.md` (this file)  
**Human-only queue:** `GLPCONVERT_HUMAN_ACTIONS_ONLY.md`

---

## A. Repo & migration baseline

| Status | Tag | Task |
|--------|-----|------|
| DONE | AUTO | Copy `sunspire-clean` tree into `GLPConvert` (exclude node_modules, .git, .next, .env.local, .vercel) |
| DONE | AUTO | Rename npm package to `glpconvert` |
| DONE | AUTO | `git init` + initial commit on `main` (migration baseline) |
| TODO | HUMAN | Create GitHub repo + `git remote add` + push — **BLOCKS** CI/Vercel Git integration |
| DONE | AUTO | Replace root `README.md` with GLPConvert + Wellspire overview |
| TODO | HUMAN | Decide `sunspire-clean` archive strategy |

## B. Product identity & copy

| Status | Tag | Task |
|--------|-----|------|
| DONE | AUTO | Add `lib/product-identity.ts` (Wellspire LLC, GLPConvert, support email placeholder) |
| DONE | AUTO | Update `app/layout.tsx` metadata |
| DONE | AUTO | Rebrand `LegalFooter`, `SmartFooter`, `TenantProvider`, `TrustBar`, `PVWattsBadge` (partial) |
| DONE | AUTO | Rebrand homepage hero/FAQ/KPI/feature cards (partial — address flow still legacy) |
| DONE | AUTO | Rebrand `lib/email-service.ts` onboarding template |
| DONE | AUTO | Dashboard `app/c/[companyHandle]/page.tsx` subtitle + support email |
| TODO | AUTO | Global find/replace remaining “Sunspire” / solar strings in `app/pricing`, `app/partners`, `app/methodology`, docs |
| TODO | AUTO | `README.md` in `components/SharedNavigation` / favicon alt text audit |

## C. Vertical engine & intake

| Status | Tag | Task |
|--------|-----|------|
| DONE | AUTO | `lib/verticals/types.ts`, `glp/intake.ts`, `glp/recommend.ts`, `glp/compliance.ts` |
| DONE | AUTO | `lib/verticals/trt/*`, `pep/*` stub recommenders + `POST /api/recommend` (`stub: true`) |
| DONE | AUTO | `POST /api/recommend` |
| DONE | AUTO | `/intake` page + `GlpIntakeFlow` stepper + draft localStorage |
| DONE | AUTO | `/result` — `?demo=1`, `?from=intake` + `sessionStorage` handoff; price signal formatting |
| DONE | AUTO | Homepage CTA + nav “Intake demo” → `/intake` (preserves query params) |
| TODO | AUTO | Persist intake server-side (`intake_sessions`) + tie to tenant |
| TODO | AUTO | Replace remaining address-first block on homepage with intake-only when ready |

## D. Legacy solar / report

| Status | Tag | Task |
|--------|-----|------|
| DONE | AUTO | `lib/feature-flags.ts` — `NEXT_PUBLIC_VERTICAL`, `NEXT_PUBLIC_ENABLE_SOLAR_ESTIMATE` |
| DONE | AUTO | `/api/estimate` returns **503** when solar disabled (default for `glp`) |
| DONE | AUTO | Amber banner on `/report` + header subtitle when GLP primary |
| TODO | AUTO | Remove NREL from marketing copy sitewide (`/pricing`, `/partners`, `/methodology`, `/docs/*`) |
| TODO | AUTO | Prune or rewrite solar Playwright specs |

## E. White-label & embed

| Status | Tag | Task |
|--------|-----|------|
| DONE | AUTO | `public/embed.js` — `glpconvert-*` meta tags + legacy `sunspire-*` read + opens `/intake` |
| TODO | AUTO | `InstallSheet.tsx` / dashboard embed snippet wording |
| TODO | AUTO | `window.__GLPCONVERT_ORIGIN__` documented for self-hosted script origin |
| TODO | AUTO | Personalized demo URLs documented for sales |

## F. Data & Supabase

| Status | Tag | Task |
|--------|-----|------|
| DONE | AUTO | Draft SQL: `supabase/migrations/0003_glpconvert_intake_and_programs.sql` |
| TODO | HUMAN | Create Supabase projects (staging/prod) — **BLOCKS** real multi-tenant data |
| TODO | HUMAN | Run migration on staging — **BLOCKS** server persist |
| TODO | AUTO | Wire `db-leads` / tenant APIs to new columns for `vertical`, `recommended_program_id` |
| TODO | AUTO | GDPR export/delete includes intake payloads |
| TODO | AUTO | RLS policies for `programs`, `intake_sessions`, `intake_answers` |

## G. Stripe & billing

| Status | Tag | Task |
|--------|-----|------|
| DONE | AUTO | Email copy reflects GLPConvert funnel (not solar) |
| DONE | AUTO | Fallback app URLs in checkout/portal/create-tenant → `NEXT_PUBLIC_APP_URL` / localhost (not sunspire domains) |
| DONE | AUTO | `GLPCONVERT_STRIPE_MIGRATION.md` |
| TODO | HUMAN | Create Stripe **test** products/prices for GLPConvert SaaS — **BLOCKS** realistic checkout naming |
| TODO | HUMAN | Webhook URLs in Stripe dashboard for preview + production |
| TODO | AUTO | Audit `app/api/stripe/*` metadata and line item descriptions for Wellspire |
| TODO | AUTO | Invoice/statement descriptor in Dashboard → Wellspire / GLPConvert |

## H. Resend & email

| Status | Tag | Task |
|--------|-----|------|
| TODO | HUMAN | Verify sending domain in Resend — **BLOCKS** deliverability |
| TODO | AUTO | Align `no-reply@` domain with production hostname |
| TODO | AUTO | Template QA in dark mode clients (optional) |

## I. Vercel & domains

| Status | Tag | Task |
|--------|-----|------|
| TODO | HUMAN | New Vercel project + env vars — **BLOCKS** production deploy |
| TODO | HUMAN | Attach custom domain + DNS — **BLOCKS** public launch URL |
| TODO | AUTO | Remove or update `.vercel` from old project if accidentally copied (excluded in rsync) |

## J. GitHub & CI

| Status | Tag | Task |
|--------|-----|------|
| TODO | HUMAN | Push repo — see **A** |
| DONE | AUTO | `.github/workflows/build.yml` — Node 20, `npm ci`, `npm run build` |
| TODO | AUTO | Align legacy workflows (`e2e.yml`, etc.) with GLP routes or disable |
| TODO | AUTO | Scheduled smoke Playwright against staging |
| DONE | AUTO | `GLPCONVERT_GIT_STRATEGY.md` |

## K. Env & local dev

| Status | Tag | Task |
|--------|-----|------|
| DONE | AUTO | `src/config/env.ts` — optional NREL/EIA/maps/admin for flexibility |
| DONE | AUTO | `lib/env.ts` — optional NREL |
| DONE | AUTO | JWT dev fallback (non-prod only) in `src/server/auth/jwt.ts` |
| DONE | AUTO | `.env.example` + `.gitignore` hardening |
| DONE | AUTO | `LOCAL_ENV_SETUP.md`, `ENV_VARS_GLPCONVERT.md` |
| DONE | AUTO | `npm run build` passes |
| DONE | AUTO | `.env.example` — vertical flags, Stripe aliases, synthetic/E2E, Sentry toggle |

## L. Legal & compliance

| Status | Tag | Task |
|--------|-----|------|
| DONE | AUTO | `GLPCONVERT_LEGAL_COMPLIANCE_NOTES.md` draft |
| TODO | HUMAN | Counsel review Terms/Privacy/DPA — **BLOCKS** confident launch |
| TODO | AUTO | Insert intake + result disclaimers from notes into UI components |

## M. Analytics & monitoring

| Status | Tag | Task |
|--------|-----|------|
| TODO | AUTO | Rename PostHog project / properties to GLPConvert |
| TODO | AUTO | Sentry project rename + DSN env in Vercel |

## N. Documentation

| Status | Tag | Task |
|--------|-----|------|
| DONE | AUTO | `GLPCONVERT_MIGRATION_AUDIT.md` |
| DONE | AUTO | `GLPCONVERT_IMPLEMENTATION_PLAN.md` |
| DONE | AUTO | `GLPCONVERT_PRODUCT_SPEC.md` |
| DONE | AUTO | `GLPCONVERT_SUNSPIRE_REUSE_MAP.md` |
| DONE | AUTO | `GLPCONVERT_HUMAN_ACTIONS_ONLY.md` |
| DONE | AUTO | `GITHUB_VERCEL_SUPABASE_RESEND_STRIPE_CHECKLIST.md` |
| DONE | AUTO | `GLPCONVERT_ROUTE_INVENTORY.md` |
| DONE | AUTO | `GLPCONVERT_ARCHITECTURE.md` |
| DONE | AUTO | `GLPCONVERT_STRIPE_MIGRATION.md` |
| DONE | AUTO | `GLPCONVERT_VERCEL_MIGRATION.md` |
| DONE | AUTO | `docs/ONBOARDING_WIZARD_STRUCTURE.md` |
| DONE | AUTO | Root `README.md` (GLPConvert) |

## O. External infrastructure (detailed)

| Status | Tag | Task | Blocks |
|--------|-----|------|--------|
| TODO | HUMAN | GitHub remote + branch protection | CI/CD |
| TODO | HUMAN | Vercel project + Preview/Production env | deploy |
| TODO | HUMAN | Production + sending domain DNS (app + Resend) | email deliverability |
| TODO | HUMAN | Supabase project + run `0003_*` migration | DB-backed intake |
| TODO | HUMAN | Stripe test/live products + webhooks | paid onboarding |
| TODO | AUTO | Rotate/remove any Sunspire API keys from old dashboards |

## P. Env & secrets (operational)

| Status | Tag | Task |
|--------|-----|------|
| DONE | AUTO | Document all major vars in `ENV_VARS_GLPCONVERT.md` + `.env.example` |
| TODO | HUMAN | Populate Vercel **Preview** with test Stripe + staging Supabase |
| TODO | HUMAN | Populate Vercel **Production** with live keys after QA |
| TODO | AUTO | Secret scanning / `git-secrets` recommendation in runbook |

## Q. Local testing & mocks

| Status | Tag | Task |
|--------|-----|------|
| DONE | AUTO | Intake + result flow without maps/NREL/Stripe |
| DONE | AUTO | `/api/estimate` 503 documented; opt-in solar via `NEXT_PUBLIC_ENABLE_SOLAR_ESTIMATE=1` |
| TODO | AUTO | MSW or fixture mode for Stripe webhook unit tests |
| TODO | AUTO | New Playwright: `/intake` → `/result?from=intake` |

## R. Deployment / pipeline

| Status | Tag | Task |
|--------|-----|------|
| DONE | AUTO | `GLPCONVERT_VERCEL_MIGRATION.md` |
| TODO | HUMAN | Post-deploy smoke: `/api/health`, `/intake`, `/result?demo=1` |
| TODO | AUTO | Rollback runbook (revert deploy + Stripe webhook disable) |

## S. Page-by-page marketing copy (Sunspire → GLP)

| Status | Tag | Task |
|--------|-----|------|
| DONE | AUTO | `/`, footers, `Footer.tsx`, `SharedNavigation`, report banner |
| TODO | AUTO | `/pricing`, `/partners`, `/support`, `/methodology` |
| TODO | AUTO | `/privacy`, `/terms` — legal counsel + replace `getsunspire` emails |
| TODO | AUTO | `/docs/*`, `/security` contact emails |

## T. CRM routing

| Status | Tag | Task |
|--------|-----|------|
| TODO | AUTO | Map intake fields → webhook payload schema (non-PHI default) |
| TODO | AUTO | Per-tenant `crm_webhook_url` + signing secret in DB |

## Chronological “next” sequence (for “next step” workflow)

1. **HUMAN** — GitHub remote + push (`GLPCONVERT_HUMAN_ACTIONS_ONLY.md` §1); local `git init` + first commit already done.
2. **HUMAN** — Vercel project + env + deploy preview.
3. **HUMAN** — Supabase + keys in Vercel.
4. **HUMAN** — Resend domain verify + API key.
5. **HUMAN** — Stripe test products + webhook.
6. **HUMAN** — Production domain DNS.
7. **HUMAN** — Legal counsel review.

---

### Last updated (agent cycle)

- **Completed:** `/intake` flow, TRT/Pep stubs, feature flags + solar API 503, report banner, `public/embed.js` rebrand, Supabase draft migration, architecture/route/stripe/vercel/git docs, onboarding wizard structure, CI build workflow, README, expanded `.env.example`, Footer/LeadModal/stripe URL fixes, `npm run build` green.
- **Not done (honest):** Full legal page rewrites, all marketing pages, E2E rewrite, Supabase wire-up, Stripe dashboard, Vercel/dashboard tasks, counsel review.
- **Next human action:** See `GLPCONVERT_HUMAN_ACTIONS_ONLY.md` (single next step).
