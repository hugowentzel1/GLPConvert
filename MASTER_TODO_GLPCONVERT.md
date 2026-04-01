# MASTER_TODO_GLPCONVERT.md

Single source of truth. Unified roadmap for conversion-first GLP simulator + white-label lease growth.

Legend: `[x] DONE` | `[~] IN_PROGRESS` | `[ ] TODO`  
Owner: `AUTO` or `HUMAN`

## Operating Rule

- Keep strict chronological order.
- Execute all unlocked `AUTO` tasks immediately.
- Stop only at true `HUMAN` blockers.

---

## Operator playbook — what to click / run (full list)

Use this for **HUMAN** steps (exact UI). **AUTO** steps are **engineering work** in this repo (Cursor / PRs), not dashboard buttons.

### Phase 0–2 (U001–U010) — done

No action unless you are auditing history.

### U011 · AUTO — Sex/age + confidence bands (in progress)

- **You:** In Cursor, open `components/intake/GlpSimulationFunnel.tsx` (and related lib for sim math), implement fields + UI, run `npm run build`.

### Phase 3 — Data / leads

| ID | Owner | What to do |
|----|--------|------------|
| **U012–U015** | done | — |
| **U016** | AUTO | Code: extend lead model + API to store booking/consult outcome; wire from dashboard or webhooks later. |

### Phase 4 — White-label (U017–U020)

| ID | AUTO | What to do |
|----|------|------------|
| **U017–U020** | AUTO | Code: tenant settings for disclaimers, economics ranges, CTA URLs, demo vs paid branding. Use existing `TenantProvider` / tenant config patterns. |

### Phase 5 — Compliance (U021–U024)

| **U022–U023** | AUTO | Code: disclosure blocks + compounded copy guardrails in simulator + docs. |
| **U024** | **HUMAN** | **Email or upload** `app/terms`, `app/privacy`, simulator disclaimers, and `GLPCONVERT_*` legal-adjacent docs to your attorney. **Click:** none universal—use your firm’s portal or email. When counsel approves, mark U024 done. |

### Phase 6 — Analytics (U025–U027)

| ID | AUTO | Implement funnel metrics API + dashboard cards + cautious revenue panel. |

### Phase 7 — Scheduling (U028–U030)

| **U028** | AUTO | Code: configurable scheduling URL/webhook post-simulation. |
| **U029** | done | — |
| **U030** | **HUMAN** | **You:** For each production tenant, obtain **booking links** (Calendly, Jane, etc.) or API docs. Paste into tenant config when U019 exists. No single “button”—per-clinic. |

### Phase 8 — Polish + QA (U031–U034)

| **U031–U033** | AUTO | Code + `npx playwright test` when U033 lands. |
| **U034** | **HUMAN** | After Vercel prod URL works: open site in browser, run through simulator → lead, Stripe test, email receipt. Checklist in your head or duplicate U039 bullets. |

### Phase 9 — Infra (clicks in order)

#### **U035 · HUMAN — Git remote + push `main`**

**Option A — GitHub website (no GitHub Desktop)**

1. Open **https://github.com** and sign in.
2. Top-right **+** → **New repository**.
3. **Repository name:** e.g. `GLPConvert` → choose **Private** (recommended) → **Create repository**.
4. Leave **empty** (no README) if your laptop already has the code.
5. On the page “…or push an existing repository”, copy the **HTTPS** URL (e.g. `https://github.com/YOU/GLPConvert.git`).

**Terminal (macOS, in project folder):**

```bash
cd /Users/hugowentzel/GLPConvert
git status
git branch -M main
git remote add origin https://github.com/YOU/GLPConvert.git
git push -u origin main
```

(If `origin` exists: `git remote set-url origin https://github.com/YOU/GLPConvert.git` then `git push -u origin main`.)

**Option B — GitHub Desktop**

1. Install **GitHub Desktop** → **File** → **Add Local Repository** → choose `GLPConvert`.
2. **Repository** → **Publish repository** → name it → **Publish**.

Mark **U035** `[x]` when `main` is on GitHub.

---

#### **U036 · HUMAN — Vercel project + envs**

1. Open **https://vercel.com** → sign in → **Add New…** → **Project**.
2. **Import** your GitHub repo (`GLPConvert`) → **Import**.
3. **Framework Preset:** Next.js (auto). **Root Directory:** `./` (default).
4. Expand **Environment Variables** — add at least (see `ENV_VARS_GLPCONVERT.md` and `.env.example` for full list):

   - `NEXT_PUBLIC_APP_URL` = your future prod URL (can update after first deploy).
   - `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` (after U037).
   - `STRIPE_SECRET_KEY` or `STRIPE_LIVE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PRICE_MONTHLY_99`, `STRIPE_PRICE_SETUP_399` (after U038).
   - `RESEND_API_KEY` (after U038).
   - `ADMIN_TOKEN`, `JWT_SECRET` (generate strong random strings).

5. **Deploy** → wait for green build → **Settings** → **Domains** to attach custom domain later (optional for first pass).

Mark **U036** `[x]` when Production deploy succeeds.

---

#### **U037 · HUMAN — Supabase + migrations**

1. Open **https://supabase.com/dashboard** → **New project** → pick org, **database password**, **region** → **Create new project**.
2. Wait until healthy → **Project Settings** (gear) → **API**: copy **Project URL** and **service_role** key (server only; never expose to client).
3. Paste into Vercel **Environment Variables** (`SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`) → **Redeploy** if needed.
4. **SQL Editor** or **Supabase CLI**: run files in `supabase/migrations/` in filename order (or `supabase db push` if you use linked CLI — see Supabase docs).

Mark **U037** `[x]` when DB matches migrations and app can write leads.

---

#### **U038 · HUMAN — Stripe + Resend + DNS**

**Stripe**

1. **https://dashboard.stripe.com** → **Developers** → **API keys** → copy **Publishable** + **Secret** (test mode first).
2. **Product catalog** → **Add product** “GLPConvert monthly” → add **recurring price** ($99) → copy **Price ID** → `STRIPE_PRICE_MONTHLY_99`.
3. Add **one-time** price ($399) setup → `STRIPE_PRICE_SETUP_399`.
4. **Developers** → **Webhooks** → **Add endpoint** → URL `https://YOUR_DOMAIN/api/stripe/webhook` (or path from your repo) → select events your app needs → copy **Signing secret** → `STRIPE_WEBHOOK_SECRET`.

**Resend**

1. **https://resend.com** → **API Keys** → **Create API Key** → copy → `RESEND_API_KEY`.
2. **Domains** → **Add domain** → add DNS records Resend shows (at your DNS host).

**DNS (your registrar, e.g. Cloudflare / Namecheap)**

1. Add **A/CNAME** for app domain pointing to **Vercel** (Vercel project → **Settings** → **Domains** shows exact records).
2. Add **Resend** TXT/CNAME records for email.
3. Add **Stripe** webhook is HTTPS on your domain—no extra DNS beyond app domain.

Update Vercel env vars → **Deployments** → **Redeploy**.

Mark **U038** `[x]` when test checkout + test email work.

---

#### **U039 · AUTO — Launch closeout doc**

- **Cursor:** Add short `LAUNCH_CLOSEOUT.md` (or extend checklist) summarizing prod URL, envs set, migration applied, smoke test done.

---

## Audit Snapshot (Current State)

### Already Exists

- [x] Core rebrand + vertical scaffolding (`glp`, `trt`, `pep`)
- [x] `/api/recommend` deterministic recommendation scaffold
- [x] Basic intake and result pages
- [x] Core docs set (migration/legal/product/spec/env/infra)
- [x] Multiple GLP copy updates across legal/support/pricing/docs

### Partially Exists

- [~] Conversion-first public funnel (now includes simulator-first flow, still needs deeper polish)
- [~] Lead storage for GLP (currently serialized in lead notes; needs first-class schema fields)
- [~] Analytics/event tracking (event route exists, needs provider dashboard metrics)
- [~] White-label ownership feel (branding support exists, routing/promo/disclaimer configurability incomplete)

### Missing / High Priority

- [ ] Robust simulation model + phase visualization confidence ranges
- [ ] Treatment economics module controls by clinic
- [ ] Booking/scheduling routing config by clinic
- [ ] Tenant dashboard metrics for simulator -> lead -> consult funnel
- [ ] Full conversion copy/system polish for “value before lead capture”
- [ ] End-to-end test coverage for new simulator flow

---

## Unified Chronological Implementation Queue

### Phase 0 — Foundation already completed

- [x] **U001 · AUTO** Baseline migration, branding, docs, and vertical scaffolding.
- [x] **U002 · AUTO** API foundations (`/api/recommend`, `/api/lead`, webhook routes, feature flags).

### Phase 1 — Conversion-first product positioning (A/G/H)

- [x] **U003 · AUTO** Reposition intake page headline/copy to “value first, lead later”.
- [x] **U004 · AUTO** Create conversion-first sales message docs:
  - `GLPCONVERT_WORDING_LIBRARY.md`
  - `GLPCONVERT_PRODUCT_SPEC.md` (already aligned)
- [x] **U005 · AUTO** Add focused internal sales positioning doc for cold-email lease motion.

### Phase 2 — Public funnel rebuild (B)

- [x] **U006 · AUTO** Implement low-friction simulator-first inputs (weight/height/goal/med path) before lead capture.
- [x] **U007 · AUTO** Implement instant simulation output screen before lead gate.
- [x] **U008 · AUTO** Implement economics snapshot (monthly range + cost-per-lb educational framing).
- [x] **U009 · AUTO** Implement lead capture after value with strong CTA variants and compliance consent.
- [x] **U010 · AUTO** Add richer timeline chart + treatment phase cards (starter/active/continuation).
- [~] **U011 · AUTO** Add optional sex/age personalization and confidence bands.

### Phase 3 — Data model and lead pipeline (J/E)

- [x] **U012 · AUTO** Extend lead API to accept/store GLP simulation payload metadata.
- [x] **U013 · AUTO** Add simulation event types to event logging API.
- [x] **U014 · AUTO** Add dedicated DB columns/tables for simulation fields (not only note serialization).
- [x] **U015 · AUTO** Build migration + DAL updates for first-class simulation storage.
- [ ] **U016 · AUTO** Store booking status and downstream consult outcome signals.

### Phase 4 — White-label ownership depth (C)

- [ ] **U017 · AUTO** Add clinic-configurable simulation disclaimers/footer/legal snippets.
- [ ] **U018 · AUTO** Add clinic-specific pricing/economics ranges from tenant settings.
- [ ] **U019 · AUTO** Add clinic-specific CTA routing (direct booking vs callback vs save only).
- [ ] **U020 · AUTO** Ensure demo + paid modes both show clinic-owned presentation consistently.

### Phase 5 — Compliance/trust hardening (D)

- [x] **U021 · AUTO** Add educational-only and provider-required notes in simulator and lead capture.
- [ ] **U022 · AUTO** Add contraindication/safety disclosure block pattern.
- [ ] **U023 · AUTO** Add compounded language guardrails where used.
- [ ] **U024 · HUMAN** Counsel review of final claims/copy/terms/privacy before production.

### Phase 6 — Analytics and clinic dashboard value (E)

- [ ] **U025 · AUTO** Compute and expose simulation start/completion/lead conversion metrics.
- [ ] **U026 · AUTO** Add clinic dashboard cards for simulator funnel performance.
- [ ] **U027 · AUTO** Add projected value/revenue estimate panel with cautious framing.

### Phase 7 — Scheduling and conversion path (F)

- [ ] **U028 · AUTO** Connect post-simulation flow to configurable scheduling endpoint.
- [x] **U029 · AUTO** Add “book now / request callback / save for later” selectable path.
- [ ] **U030 · HUMAN** Provide clinic scheduling endpoints/integrations for production tenants.

### Phase 8 — Visual polish + QA (I)

- [~] **U031 · AUTO** Improve mobile-first visual hierarchy and CTA placements in simulator.
- [ ] **U032 · AUTO** Add better loading/empty/error/confirmation states across flow.
- [ ] **U033 · AUTO** Add Playwright tests for full simulator -> lead capture flow.
- [ ] **U034 · HUMAN** Run production smoke checks post-infra setup.

### Phase 9 — Infra and launch blockers

- [~] **U035 · HUMAN** Create remote Git repo and push local `main`.
- [ ] **U036 · HUMAN** Create Vercel project + envs.
- [ ] **U037 · HUMAN** Create Supabase project and run migrations.
- [ ] **U038 · HUMAN** Configure Stripe + Resend + DNS.
- [ ] **U039 · AUTO** Final launch closeout and checklist completion summary.

---

## NEEDS HUMAN INPUT (Exact blockers only)

- **H1 — Git remote creation (`U035`)**  
  Why blocked: remote repository creation/push is account-scoped.  
  Next action: create remote repo and push local `main`, then reply `done`.

- **H2 — Hosted infra credentials (`U036`, `U037`, `U038`)**  
  Why blocked: Vercel/Supabase/Stripe/Resend/DNS credentials and org access are external.  
  Next action: provision services and env vars per existing infra docs, then reply `done`.

- **H3 — Legal signoff (`U024`)**  
  Why blocked: attorney/counsel approval required for production claims and disclosures.  
  Next action: route final claims/copy/legal docs for counsel approval.

---

## Current Active Step

**U035 · HUMAN — Create remote Git repo and push local `main`.**

**Step-by-step:** see **Phase 9 → U035** in [Operator playbook — what to click / run](#operator-playbook--what-to-click--run-full-list) above (GitHub **+** → **New repository**, then `git remote add` + `git push`, or GitHub Desktop **Publish**).

When finished: set **U035** to `[x]` in Phase 9, then start **U036** using the same playbook.
