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
| TODO | HUMAN | `git init`, remote GitHub, first push — **BLOCKS** CI/Vercel Git integration |
| TODO | AUTO | Replace root `README.md` with GLPConvert + Wellspire overview |
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
| DONE | AUTO | `lib/verticals/types.ts`, `glp/intake.ts`, `glp/recommend.ts` |
| DONE | AUTO | `POST /api/recommend` |
| DONE | AUTO | `/result` page + `?demo=1` client fetch |
| TODO | AUTO | Build intake stepper UI component; bind to questions |
| TODO | AUTO | Persist intake answers (localStorage + optional API) |
| TODO | AUTO | Route homepage CTA to intake instead of address-first |
| TODO | AUTO | TRT/Pep stubs: `lib/verticals/trt/`, `pep/` returning 501 from API |

## D. Legacy solar / report

| Status | Tag | Task |
|--------|-----|------|
| TODO | AUTO | Feature-flag `/report` + `/api/estimate` when vertical=glp |
| TODO | AUTO | Banner on `/report`: “Legacy sample — GLPConvert uses /result” |
| TODO | AUTO | Remove NREL from marketing copy sitewide (remaining pages) |
| TODO | AUTO | Prune or rewrite solar Playwright specs |

## E. White-label & embed

| Status | Tag | Task |
|--------|-----|------|
| TODO | AUTO | Update `public/embed.js` — `glpconvert` host default, meta tag names |
| TODO | AUTO | `InstallSheet.tsx` / dashboard embed snippet wording |
| TODO | AUTO | Personalized demo URLs documented for sales |

## F. Data & Supabase

| Status | Tag | Task |
|--------|-----|------|
| TODO | AUTO | Draft SQL migrations: tenants, programs, intake_sessions, answers |
| TODO | HUMAN | Create Supabase projects (staging/prod) — **BLOCKS** real multi-tenant data |
| TODO | AUTO | Wire `db-leads` / tenant APIs to new columns for `vertical`, `recommended_program_id` |
| TODO | AUTO | GDPR export/delete includes intake payloads |

## G. Stripe & billing

| Status | Tag | Task |
|--------|-----|------|
| DONE | AUTO | Email copy reflects GLPConvert funnel (not solar) |
| TODO | HUMAN | Create Stripe **test** products/prices for GLPConvert SaaS — **BLOCKS** realistic checkout naming |
| TODO | HUMAN | Webhook URLs in Stripe dashboard for preview + production |
| TODO | AUTO | Audit `app/api/stripe/*` metadata and line item descriptions for Wellspire |
| TODO | AUTO | Document test→live cutover in `GITHUB_VERCEL_SUPABASE_RESEND_STRIPE_CHECKLIST.md` |

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
| TODO | AUTO | Add GitHub Action: `npm ci` + `npm run build` |
| TODO | AUTO | Scheduled smoke Playwright against staging |

## K. Env & local dev

| Status | Tag | Task |
|--------|-----|------|
| DONE | AUTO | `src/config/env.ts` — optional NREL/EIA/maps/admin for flexibility |
| DONE | AUTO | `lib/env.ts` — optional NREL |
| DONE | AUTO | JWT dev fallback (non-prod only) in `src/server/auth/jwt.ts` |
| DONE | AUTO | `.env.example` + `.gitignore` hardening |
| DONE | AUTO | `LOCAL_ENV_SETUP.md`, `ENV_VARS_GLPCONVERT.md` |
| DONE | AUTO | `npm run build` passes |

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

## Chronological “next” sequence (for “next step” workflow)

1. **HUMAN** — Git init + GitHub remote + first push (`GLPCONVERT_HUMAN_ACTIONS_ONLY.md` §1).
2. **HUMAN** — Vercel project + env + deploy preview.
3. **HUMAN** — Supabase + keys in Vercel.
4. **HUMAN** — Resend domain verify + API key.
5. **HUMAN** — Stripe test products + webhook.
6. **HUMAN** — Production domain DNS.
7. **HUMAN** — Legal counsel review.

---

### Last updated (agent cycle)

- **Completed:** Baseline migration copy, vertical scaffold, `/api/recommend`, `/result`, env/JWT/build fixes, core doc set, `.env.example` / `.gitignore`.
- **Newly blocked:** None beyond existing **HUMAN** Git remote (first chronological step).
- **Next human action:** See `GLPCONVERT_HUMAN_ACTIONS_ONLY.md` (single next step).
