# MASTER_TODO_GLPCONVERT.md

Single source of truth. Unified roadmap for **revenue conversion layer** (GLPConvert) + white-label lease growth.

**Strategy docs (11/10 positioning):** `PRODUCT_STRATEGY_GLPCONVERT.md`, `DEMO_STRATEGY_GLPCONVERT.md`, `COMPLIANCE_NOTES_GLPCONVERT.md`, **`GLPCONVERT_IMPLEMENTATION_11_SPEC.md`** (spec ↔ code matrix + execution priority).  
**API inventory (legacy platform fork, GLP-scoped):** `GLPCONVERT_API_CONTRACTS.md` → section *Platform inventory*.  
**Env (local + Vercel paste guide):** **`docs/ENV_VERCEL_AND_LOCAL.md`** · URL **`docs/VERCEL_CANONICAL_URL.md`** · **`env.local.template`** / **`.env`**. **APIs:** **`docs/GLPCONVERT_APIS_AND_INTEGRATIONS.md`**. **Sentry:** **`docs/SENTRY_GLPCONVERT.md`**. **Marketing:** end of this file (**Marketing** section) + **`GLPCONVERT_COLD_EMAIL_POSITIONING.md`** + **`GLPCONVERT_COLD_EMAIL_PLAYBOOK.md`** (sequences + scale) + **`docs/COLD-EMAIL-BRANDING-GUIDE.md`** + **`docs/COLD-EMAIL-READINESS-AUDIT.md`**. **Cold-email / embed UX (sources Mar 2026):** **`docs/GLPCONVERT_OUTREACH_UX_SOURCES_MAR2026.md`**. **White-label / multi-tenant SaaS patterns (sources):** **`docs/GLPCONVERT_WHITE_LABEL_SAAS_SOURCES.md`** — neutral product canvas + tenant theme (CSS variables), bounded customization, tenant isolation; pairs with **R017–U020** and **`TenantProvider`**. **Entity / multi-brand (Wellspire LLC):** **`docs/WELLSPIRE_LLC_MULTI_BRAND_SOURCES.md`** — one LLC + GLPConvert / TRTConvert / PEPConvert; **W001+** checklist before **Marketing**.

### Channel split (primary GTM — lock this in)

| Surface | Who | Goal |
|--------|-----|------|
| **Individualized demo** | Clinic buyer (cold email, LinkedIn DM) | Same ~95% patient UX as production, plus preview banner + owner panels. **CTA → Stripe checkout → self-serve activation** (no meeting). Links: **`/intake?demo=1&company=…`** (+ optional `logo`, `brand`, `booking`, `demo_traffic`); buyer home **`/?demo=1&company=…`** → Launch / pricing. |
| **Paid / production intake** | End patient on clinic ads, landers, site, embed | **White-label conversion layer**: consult readiness, expectations, price band, lead + booking handoff. Optimize for **booked consults and program enrollment**, not clinical decisioning. URL pattern: **`/intake?company=<tenant-handle>`** (tenant branding from DB where wired; query overrides still work for demos). |

Engineering must not diverge demo and paid flows structurally—only demo overlays and activation CTAs differ.

### Canonical URLs (local + production)

| Surface | URL pattern | Example |
|--------|-------------|---------|
| **Demo (cold email / buyer)** — same patient flow + preview banner + owner panels | `{ORIGIN}/intake?demo=1&company=…` + optional **`domain=`** (Clearbit logo), `logo`, `brand`, `brand2`, `booking`, `demo_traffic`, **`handle=`** when `company` is display name only | Local: `http://localhost:3330/intake?demo=1&handle=glpconvert&company=Acme%20Med%20Spa&domain=acme.com&brand=0B3D91` |
| **Paid (patient-facing)** — production intake, no demo chrome | `{ORIGIN}/intake?company=<tenant_handle>` | Local: `http://localhost:3000/intake?company=glpconvert` |
| **Buyer home (demo pricing / Stripe)** | `{ORIGIN}/?demo=1&company=…` | Local: `http://localhost:3000/?demo=1&company=Acme%20Med%20Spa` |
| **Production host (current Vercel default)** | `https://glp-convert.vercel.app` | Demo: `https://glp-convert.vercel.app/intake?demo=1&handle=glpconvert&company=Your%20Clinic` · Paid: `https://glp-convert.vercel.app/intake?company=glpconvert` |

**`handle` query param:** resolves `GET /api/public/tenant-intake-config?handle=` when `company` is a **pretty name** (spaces, branding) that does not match the Supabase tenant slug. Without `handle`, `company` is slugified for the API (e.g. `Acme Med` → `acme-med`).

**Tenant economics (U018 scaffold):** optional keys inside `tenants.crm_keys` JSON — `intake_monthly_low`, `intake_monthly_high`, `intake_consult_fee_note`, `intake_payment_note`, `intake_brand_name`, `intake_brand_color_secondary` — merged in **`GlpSimulationFunnel`** when present.

### R-Mar-2026 — demo≈paid polish + legal + E2E (AUTO pass)

| ID | Item | Status |
|----|------|--------|
| **R028** | Intake: clinic bar + preview/paid parity; results CTA **Next step** → readiness; optional **starts at** from tenant monthly low | **Done** (superseded by **R040**) |
| **R029** | Owner-only panels: conservative revenue-leak copy, before/after layout, activation CTAs | **Done** |
| **R030** | **`app/legal/privacy`** + **`app/legal/terms`** — GLPConvert / white-label / HIPAA-ready posture (not legal advice) | **Done** — **HUMAN:** final counsel review **U024** |
| **R031** | **`docs/ATTRIBUTION_PIXELS_GLPCONVERT.md`** + COMPLIANCE cross-link (UTM done; pixels behind consent) | **Done** |
| **R032** | Playwright **`glp-branded-e2e-visual.spec.ts`** — paid patient **full** funnel (C) + buyer (B) + demo patient (A) | **Done** |

### R-Apr-2026b — Demo-led conversion + white-label intake (no global nav on `/intake`)

| ID | Item | Status |
|----|------|--------|
| **R040** | **`/intake`**: hide **`SharedNavigation`** (dedicated lander); slim trust line; footer holds vendor line + minimal legal; demo/paid shared **clinic bar** (`data-intake-clinic-bar`); hero copy sharpened; funnel copy + section order; owner panels tightened; Playwright **F** (mobile + no nav) | **Done** — see **`DEMO_REDESIGN_PASS.md`** |
| **R043** | **Results / simulation:** trust strip + hero split; path → expectations cards → **price** (Starts around + range) → trajectory in **`<details>`** (compact chart); softer `pathLabel` / phases; focus-visible on intake controls; marketing nav demo disclaimer removed; dashboard `/c/[handle]` simplified to metrics + intake link + leads; docs **`UI_COPY_REWRITE.md`**, **`UI_POLISH_CHECKLIST.md`**; Playwright `data-results-*` | **Done** |
| **R041** | **HUMAN:** Counsel pass on shortened footer disclaimer; confirm FDA-safe wording on funnel | Open |
| **R042** | Dashboard `/c/*` simplification (metrics clutter) if still noisy | Backlog |

### R-Apr-2026 — Site-wide GLP copy, trust data, intake visual rhythm (AUTO)

| ID | Item | Status |
|----|------|--------|
| **R033** | **`data/trust.json`** + home **`MetricsBar`**: remove Sunspire/solar buyer copy; GLPConvert about + illustrative metrics | **Done** |
| **R034** | **`components/Testimonials.tsx`**: med-spa / telehealth positioning; composite disclaimer; pill → “Illustrative” | **Done** |
| **R035** | **`glp-intake-ui.ts` + `GlpSimulationFunnel`**: form grid rhythm (`grid2Form`, `formActions`), readiness fieldset spacing, results hero + trajectory timeline, confirmation uses tenant brand | **Done** |
| **R036** | **`BrandCSSInjector`**: default shell = slate neutrals (not orange) until tenant brand loads | **Done** |
| **R037** | **`app/about/page.tsx`** + **`SharedNavigation`**: About + paid-mode Help/Privacy; **`InstallSheet`** GLP subdomain/embed examples | **Done** |
| **R038** | Playwright **`test:glp-visual:local`** after each visual pass | **Run in CI / locally** |
| **R039** | **Intake architecture:** keep **single-route stepped wizard** (not separate URLs per step) — better for mobile, demo speed, and demo≈paid parity unless product later mandates split routes | **Locked in** |

**Output log:** **`GLPCONVERT_REWRITE_PASS_APR2026.md`**.

### CE-2026 — Cold email → hundreds of customers (process import + GLP fit)

**Playbook:** **`GLPCONVERT_COLD_EMAIL_PLAYBOOK.md`**. **Branding URL rules:** **`docs/COLD-EMAIL-BRANDING-GUIDE.md`**. **Pre-flight audit:** **`docs/COLD-EMAIL-READINESS-AUDIT.md`**.

| ID | Item | Owner |
|----|------|--------|
| **CE-001** | **AUTO** · `domain=` + Clearbit logo + `company=` as bare domain → logo; shared **`lib/logo-brand-helpers.ts`**; **`useBrandTakeover`** + **`GlpSimulationFunnel`** | **Done** |
| **CE-002** | **HUMAN** · ICP list + verified **domain** per row (Apollo/Clay/VA) | |
| **CE-003** | **HUMAN** · Link-builder sheet/script: `company`, `domain`, `firstName`, UTM, optional `brand` | |
| **CE-004** | **HUMAN** · Cold domain(s) + warm-up + sequencer (Instantly/Smartlead or equivalent) | |
| **CE-005** | **HUMAN** · LinkedIn DM parallel track with `utm_medium=linkedin` | |
| **CE-006** | **AUTO** · Optional: server-side enrichment API (never store secrets in repo) — scaffold only until vendor chosen | |
| **CE-007** | **HUMAN** · Reply handling playbook (book call vs self-serve checkout) | |
| **CE-008** | **AUTO** · Dashboard tags: demo_sent / clicked / checkout / won (wire to CRM when **U030** extended) | |
| **CE-009** | **HUMAN** · Weekly metrics review + domain rotation + copy tests | |
| **CE-010** | **HUMAN** · Counsel: cold email compliance + unsubscribe policy (**U024** overlap) | |

Legend: `[x] DONE` | `[~] IN_PROGRESS` | `[ ] TODO`  
Owner: `AUTO` or `HUMAN`

## You are here (human infra lane)

### Infra lane — big picture

| Step | ID | Status |
|------|-----|--------|
| 1 | **U035** · GitHub + `main` | **Done** |
| 2 | **U036** · Vercel first deploy + base env | **Done** |
| 3 | **U037** · Supabase keys + SQL + tenant + smoke | **Done** |
| 4 | **U038** · Stripe (+ optional Resend/DNS) | **← YOU ARE HERE** |
| 5 | **U039** · Launch closeout doc (agent) | After U038 |
| 6 | **U040** · Sentry (optional) | After U038/U039 |
| — | **W001+ · Wellspire LLC** | After **U038** test stable; **before** live money at scale (entity + bank) |
| — | **M000 · Resend** | **Verified sending domain** + **`RESEND_API_KEY`** — **first** block under **Marketing** (app transactional; optional marketing sends) |
| — | **Stripe live** | **New live keys / prices / `whsec_`** — **after M000**, **before** **M001** cold-email domain buying at scale |
| — | **Marketing M001+** | After **W001+** min + **M000** + **Stripe live** + demo stable |

**Your live app:** **`https://glp-convert.vercel.app`** · **Your Supabase project:** **GLPConvert** · **Project ref (ID):** **`gyuzrmshxzxqajiojqlu`** → paste this as **`SUPABASE_URL`:** **`https://gyuzrmshxzxqajiojqlu.supabase.co`** *(use **`.co`**, not `.com`—**`supabase.com`** is the marketing site; **`<ref>.supabase.co`** is your project API host.)*

**Right this minute:** **U037** is complete in your environment (SQL + tenant + test lead). **Next:** **[U038 — Stripe](#u038--human--stripe--resend--dns)** (test keys, prices, webhook, env, redeploy, smoke checkout). Optional: open **`https://glp-convert.vercel.app/api/health`** once to log the JSON check if you haven’t already.

Engineering **AUTO** tasks run in parallel in Cursor — you don’t wait on them for infra.

### How we advance (say `done`)

1. Follow the **Current Active Step** section at the bottom of this file (and the matching playbook heading, e.g. **U036**).
2. When every bullet in that step is **actually finished** in the real dashboards (not “I’ll do it later”), message: **`done`**.
3. The agent marks that **HUMAN** item **`[x]`** in this file and runs **every `AUTO` task possible** until the next **HUMAN** blocker (accounts, credentials, legal, per-clinic data you alone have).
4. Then the active step moves to the **next** human item (**U037** → **U038**; **U039** is AUTO in-repo).

If something is blocked (no Stripe account yet, etc.), say what’s blocked instead of `done`—we adjust order or split the step.

## Operating Rule

- Keep strict chronological order.
- **`AUTO`:** implement in-repo immediately (code, docs, migrations, tests). Do not wait for permission when unblocked.
- **`HUMAN`:** only you can operate Vercel/Supabase/Stripe dashboards, sign BAAs, approve legal copy, or paste production secrets from vendors.
- After you message **`done`** on a human step, the agent checks it off here and continues all remaining `AUTO` work until the next required human action.

### When does the “big product build” from the master spec actually happen?

- **Already largely built (in-repo, AUTO):** Phases **U001–U010** and **R001–R005**, **R010–R011** — funnel, simulator-first flow, lead API shape, demo mode, attribution, API audit, GLP health profile. That *is* the core “building the site” work; it runs **in parallel** with your **U035–U038** infra—you don’t wait for Supabase to finish coding the funnel.
- **Still open (AUTO backlog):** **R007–R008**, **R012–R016**, **R017+**, **U011**, **U016–U020**, **U022–U033** — dashboard rollup, embed/docs hardening, deprecations, inbound booking webhook, Playwright expansion, etc. The agent picks these up in Cursor as **`[ ]` / `[~]`** items clear. (**R006** post-lead CRM webhook: **done** — tenant **Capture URL** on `POST /api/lead`.)
- **You (HUMAN) unblock:** accounts, DNS, Stripe, counsel (**U024**), paste real **booking URLs** into Supabase `crm_keys` (or `bookingUrl` on create-tenant) per clinic (**U030** — pattern shipped), smoke tests (**U034**), marketing ops (**M001+**).
- **Cold-email + “fits their website” + white-label polish:** see **`docs/GLPCONVERT_OUTREACH_UX_SOURCES_MAR2026.md`**, **`docs/GLPCONVERT_WHITE_LABEL_SAAS_SOURCES.md`**, and **R017–R018** below (embed/setup pages, tenant branding QA, segment-aware copy, performance)—scheduled as **AUTO** where marked.

---

## Chronological runway — infrastructure (do in this order)

**Supabase:** Yes — **you** must create a Supabase account and project to get **`SUPABASE_URL`** and **`SUPABASE_SERVICE_ROLE_KEY`**. GLPConvert cannot sign up for you. The **SQL migration files** already live in **`supabase/migrations/`** (repo); **you** run them in the Supabase **SQL Editor** (copy → Run), unless you use the Supabase CLI yourself.

**Stripe:** Yes — **you** must create/login to Stripe to get **`sk_test_` / `pk_test_`**, create **Products/Prices** (`price_...`), and register the **webhook** to obtain **`whsec_...`**. GLPConvert cannot access your Stripe account.

| # | Step | Owner | What you do vs what the agent does |
|---|------|-------|--------------------------------------|
| 1 | **U035 · Git** | HUMAN ✅ | Push `main` to GitHub — **done** for you. |
| 2 | **U036 · Vercel (first)** | HUMAN ✅ | Import repo, app-only env, **Deploy** → green build. |
| — | *Parallel product/engineering* | **AUTO** | Agent works in-repo anytime (Phase **R**, **U011+**, etc.) — **you do not wait** on these for infra. |
| 3 | **U037 · Supabase** | HUMAN ✅ | Project **GLPConvert** / ref **`gyuzrmshxzxqajiojqlu`** — keys, SQL, tenant **`glpconvert`**, test lead in **`leads`**. |
| 4 | **U038 · Stripe (test mode)** | **HUMAN** **← YOU ARE HERE** | Stripe **test** keys, prices, webhook → **`STRIPE_*`** + **`whsec_`** → Vercel + **`.env.local`** → **Redeploy**. Resend/domain setup is **[M000](#m000--resend-api-key--verified-sending-domain--from-address)** (Marketing). |
| 5 | **U039 · Launch closeout** | **AUTO** | Agent adds **`LAUNCH_CLOSEOUT.md`** after **`done`** on **U038**. |
| 6 | **U040 · Sentry** | **HUMAN** | **[U040 playbook](#u040--human--sentry)** + **`docs/SENTRY_GLPCONVERT.md`**. |
| — | **W001+ · Wellspire LLC** | **HUMAN** | **[Wellspire LLC ladder](#wellspire-llc--multi-brand-ladder-before-cold-email)** + **`docs/WELLSPIRE_LLC_MULTI_BRAND_SOURCES.md`**. |
| — | **M000 · Resend** | **HUMAN** | **[M000](#m000--resend-api-key--verified-sending-domain--from-address)** — verified domain + **`RESEND_API_KEY`** before cold email at scale. |
| — | **Stripe live** | **HUMAN** | **[Stripe live checklist](#stripe-live-mode-do-before-m001-cold-email-scale)** — after **M000**, before **M001**. |
| — | **Marketing M001+** | **HUMAN** | Cold outbound (**M001+**) — after **W001+** min + **M000** + **Stripe live**; section **Marketing**. |

**After each HUMAN row you finish:** message **`done`** → agent marks **`[x]`** and runs **every possible `AUTO`** task until the next step that **requires your dashboard login**.

### Services cheat sheet (what GLPConvert uses vs Phase 9)

| Service | Used? | In this todo list? | Notes |
|---------|-------|--------------------|--------|
| **GitHub** | Yes — source code | **U035** ✅ | Repo + Vercel connects to it. |
| **Vercel** | Yes — hosting / deploy | **U036** | Required. |
| **Supabase** | Yes — Postgres / leads / tenants | **U037** | Required for real persistence. |
| **Stripe** | Yes — SaaS checkout + webhooks | **U038** | Required for billing flow; test mode first. |
| **Resend** | Yes — transactional email | **U038** (optional) | Lead notify + forms; app works without it but emails won’t send. |
| **Namecheap** | Only if *you* use it | **U038** (optional) | One possible **DNS registrar**; same for Cloudflare, Google Domains, etc. Not a separate product dependency. |
| **Sentry** | Optional — error monitoring | **U040**–**U041** (after U038–U039) | **You:** **[U040 playbook](#u040--human--sentry)** + **`docs/SENTRY_GLPCONVERT.md`**. **Agent:** **U041** config alignment. |

**Not required for GLP core:** NREL/EIA/OpenEI (solar), unless you enable legacy solar flows.

---

## Operator playbook — what to click / run (full list)

**Human steps** below tell you exactly what to do in the browser (or Terminal) in order: which site to open, what to click, what to type. **Auto steps** are coding work in Cursor—you don’t need a button list for those.

**Rules that apply everywhere:** Don’t put secret keys in any variable that starts with `NEXT_PUBLIC_`. Don’t commit `.env` or `.env.local` to git. If your screen says **Add** instead of **Save** or **Create**, use the button that actually stores the setting.

**Checkboxes in this file:** Under each **HUMAN** playbook (**U035+**, **M001+**), every actionable line starts with `- [ ]` or `- [x]`. Flip **`[ ]` → `[x]`** when that micro-step is **really** done in the real dashboard/browser. Summary checklists (e.g. under **U037**) compress the same idea; detailed lines are the source of truth.

**“Usable by anyone” (white-label SaaS bar):** Tenants should get **their** logo, colors, and demo deep links without a separate deploy; embed should work in an **iframe** with documented height / optional `postMessage` (**R017**). Read **`docs/GLPCONVERT_WHITE_LABEL_SAAS_SOURCES.md`** for cited patterns (tenant isolation, branding checklist, bounded customization). Compliance stays on the **tenant** for medical claims—GLPConvert copy stays educational / non-diagnostic (**`COMPLIANCE_NOTES_GLPCONVERT.md`**).

### Phase 0–2 (U001–U010) — done

No action unless you are auditing history.

### U011 · AUTO — Sex/age + confidence bands (in progress)

- [ ] **Agent / you in Cursor:** Open `components/intake/GlpSimulationFunnel.tsx` (and related lib for sim math), implement fields + UI.
- [ ] Run **`npm run build`** and fix until green.
- [ ] Mark **U011** `[x]` in the queue below when shipped.

### Phase 3 — Data / leads

| ID | Owner | What to do |
|----|--------|------------|
| **U012–U015** | done | — |
| **U016** | AUTO | Code: extend lead model + API to store booking/consult outcome; wire from dashboard or webhooks later. |

### Phase 4 — White-label (U017–U020)

| ID | AUTO | What to do |
|----|------|------------|
| **U017–U020** | AUTO | Code: tenant settings for disclaimers, economics ranges, CTA URLs, demo vs paid branding; embed + branding QA per **`docs/GLPCONVERT_WHITE_LABEL_SAAS_SOURCES.md`**. Use existing `TenantProvider` / tenant config patterns. |

### Phase 5 — Compliance (U021–U024)

| **U022–U023** | AUTO | Code: disclosure blocks + compounded copy guardrails in simulator + docs. |
| **U024** | **HUMAN** | Step-by-step: [U024 — Send legal pack to counsel](#u024--human--counsel-review-pack). |

### Phase 6 — Analytics (U025–U027)

| ID | AUTO | Implement funnel metrics API + dashboard cards + cautious revenue panel. |

### Phase 7 — Scheduling (U028–U030)

| **U028** | AUTO | Code: configurable scheduling URL/webhook post-simulation. |
| **U029** | done | — |
| **U030** | **HUMAN** | Step-by-step: [U030 — Booking links per clinic](#u030--human--booking-links-per-clinic). |

### Phase 8 — Polish + QA (U031–U034)

| **U031–U033** | AUTO | Code + `npx playwright test` when U033 lands. |
| **U034** | **HUMAN** | Step-by-step: [U034 — Production smoke test](#u034--human--production-smoke-test). |

### Phase 9 — Infra (clicks in order)

#### **U035 · HUMAN — Git remote + push `main`**

**Option A — GitHub in the browser, then Terminal**

- [x] A1. Open **https://github.com**.
- [x] A2. If you have no account: click **Sign up**, finish signup, then sign in.
- [x] A3. Click your profile photo (top right) → **Your repositories** (or go to **https://github.com/new**).
- [x] A4. Click the green **New** button (or **New repository**).
- [x] A5. Under **Repository name**, type **`GLPConvert`** (or your chosen name).
- [x] A6. Select **Private**.
- [x] A7. **Do not** check “Add a README” if your project already exists on your Mac (leave the repo empty on GitHub).
- [x] A8. Click **Create repository**.
- [x] A9. On the next page, find **“…or push an existing repository from the command line”**.
- [x] A10. Copy the **HTTPS** line that looks like `https://github.com/YOURUSER/GLPConvert.git` (you can click the copy icon next to the URL).

**On your Mac — Terminal**

- [x] T1. Open **Terminal** (Spotlight: type **Terminal**, press Enter).
- [x] T2. Run:

```bash
cd /Users/hugowentzel/GLPConvert
git status
git branch -M main
```

- [x] T3. If you have **no** `origin` yet, run (replace with your copied URL):

```bash
git remote add origin https://github.com/YOURUSER/GLPConvert.git
```

- [x] T4. If **`origin` already exists** and points wrong, run:

```bash
git remote set-url origin https://github.com/YOURUSER/GLPConvert.git
```

- [x] T5. Push:

```bash
git push -u origin main
```

- [x] T6. Enter your GitHub username/password or use the browser login if GitHub asks.
- [x] T7. Refresh **github.com/YOURUSER/GLPConvert** — you should see your files. **U035 is done.**

**Option B — GitHub Desktop**

- [x] B1. Download and install **GitHub Desktop** from **https://desktop.github.com**.
- [x] B2. Open GitHub Desktop → **File** → **Add Local Repository** → **Choose** → pick your **`GLPConvert`** folder → **Add**.
- [x] B3. **Repository** menu → **Publish repository** → name it → choose **Private** → **Publish repository**.
- [x] B4. Confirm the repo appears on github.com. **U035 is done.**

---

#### U036 · HUMAN — Vercel project + envs — **Chronological step 2** ✅

**What you’re doing:** Connect this GitHub repo to Vercel, add environment variables, click Deploy, and get a green build. You don’t need Supabase or Stripe yet (U037 / U038). Full env reference: **`docs/ENV_VERCEL_AND_LOCAL.md`**, **`.env.example`**, **`env.local.template`**.

**A — Open Vercel and sign in**

- [x] A1. Go to **https://vercel.com**.
- [x] A2. Click **Log In** or **Sign Up** (top right) → **Continue with GitHub** → approve GitHub if it asks.

**B — Import this repo**

- [x] B1. Click **Add New…** (top right) → **Project**.
- [x] B2. If **`hugowentzel1/GLPConvert`** is missing: click **Adjust GitHub App Permissions** → in GitHub allow this repo (or all repos) → **Save** → back on Vercel click **Refresh**.
- [x] B3. Find **`hugowentzel1/GLPConvert`** → click **Import**.

**C — Project name and framework**

- [x] C1. **Project Name:** Vercel builds the URL from this name (lowercase + hyphens). A project named **`GLPCONVERT`** becomes **`https://glp-convert.vercel.app`**. Pick any name you like—then copy the exact **Production** domain from the overview or **Settings → Domains** for **`NEXT_PUBLIC_APP_URL`**.
- [x] C2. **Framework Preset:** **Next.js** (select it if needed).
- [x] C3. **Root Directory:** **`./`**.
- [x] C4. Leave **Build Command**, **Output Directory**, and **Install Command** as defaults.

**D — Create two secrets in Terminal**

- [x] D1. Open **Terminal**.
- [x] D2. Run `openssl rand -hex 32` and copy the whole output (64 characters). This will be **`JWT_SECRET`**.
- [x] D3. Run `openssl rand -hex 32` again and copy the new output. This will be **`ADMIN_TOKEN`**.
- [x] D4. The two outputs must be different. Don’t use your website URL as either secret.

**E — Add the first four environment variables**

- [x] E1. On the Vercel import page, open **Environment Variables**.
- [x] E2. For each row in the table below: click **Add** (or **Add Another**), type the **Key**, paste the **Value**, then enable **Production**, **Preview**, and **Development**.

| Key | Value |
|-----|--------|
| `NEXT_PUBLIC_APP_URL` | **`https://glp-convert.vercel.app`** for the current Hugo/Vercel setup. Otherwise paste whatever **Production** shows (e.g. **`https://YOUR-PROJECT.vercel.app`**). No `/` at the end. |
| `NEXT_PUBLIC_VERTICAL` | `glp` |
| `NEXT_PUBLIC_BRAND_NAME` | `GLPConvert` |
| `JWT_SECRET` | First `openssl` output. |
| `ADMIN_TOKEN` | Second `openssl` output. |

**Don’t** put **`JWT_SECRET`** or **`ADMIN_TOKEN`** in any variable whose name starts with **`NEXT_PUBLIC_`**.

**Later you will add** (see U037 / U038): **`SUPABASE_URL`**, **`SUPABASE_SERVICE_ROLE_KEY`**, Stripe keys, webhook secret. For Resend (**`RESEND_API_KEY`**, verified domain, from-address), see **[M000](#m000--resend-api-key--verified-sending-domain--from-address)**. Full list: **`docs/ENV_VERCEL_AND_LOCAL.md`**.

**F — Copy the same four lines to your computer**

- [x] F1. Open **`.env.local`** or **`.env`** in the repo (use **`env.local.template`** if needed).
- [x] F2. Paste the same four keys and values you used in Vercel.
- [x] F3. Save. Do not commit this file.

**G — Deploy**

- [x] G1. Click **Deploy**.
- [x] G2. Wait until the build shows **Ready** (green).
- [x] G3. Click **Visit**.

**H — Fix `NEXT_PUBLIC_APP_URL` if it’s wrong**

- [x] H1. On **Overview**, use the **Production** hostname (e.g. **`https://glp-convert.vercel.app`**). Do **not** use the long deployment-only URL (e.g. `…-hugo-wentzels-projects.vercel.app`) for **`NEXT_PUBLIC_APP_URL`**.
- [x] H2. **Settings** → **Environment Variables** → edit **`NEXT_PUBLIC_APP_URL`** → paste that production URL (no trailing `/`) → **Save**.
- [x] H3. **Deployments** → **⋯** on the latest Production row → **Redeploy**.

**After “Congratulations”:** **View Deployment** is fine for a quick look. The screen may suggest **`npx plugins add vercel/vercel-plugin`** for Cursor/Claude—that is optional. You still want **`NEXT_PUBLIC_APP_URL`** = your stable production domain (e.g. **`glp-convert.vercel.app`**).

**I — Optional: custom domain**

- [ ] I1. **Settings** → **Domains** → type your domain → **Add** → add the DNS records Vercel shows at your registrar. *(Optional — check only if you use a custom domain.)*

**When U036 is done:** Green deploy, site opens, the four variables are in Vercel and in **`.env.local`**. Say **`done`**, then open **U037**.

---

#### **U037 · HUMAN — Supabase + migrations** — **Chronological step 3** ✅ (after U036 `done`)

**Checklist — U037 complete for your stack:**

- [x] **U035** GitHub + `main` (previous step)
- [x] **U036** Vercel green deploy + base env + **`https://glp-convert.vercel.app`**
- [x] Supabase project exists (**GLPConvert**, ref **`gyuzrmshxzxqajiojqlu`**)
- [x] **`SUPABASE_URL`** + **`SUPABASE_SERVICE_ROLE_KEY`** in Vercel (Production + Preview + Development)
- [x] **`.env.local`** in the repo folder (gitignored — see **`.gitignore`**) created from **`env.local.template`** with **`SUPABASE_URL`** set to **`https://gyuzrmshxzxqajiojqlu.supabase.co`**
- [x] **`SUPABASE_SERVICE_ROLE_KEY`** in **`.env.local`** (and **`.env`** if you use it) matches Vercel exactly — **gitignored**; do not commit
- [x] Vercel **Redeploy** after env changes (or latest Production **Ready** — inferred from live **`/intake`** saving to Supabase)
- [x] SQL run in order: **`supabase/schema.sql`** → **`0002`** → **`0003`** → **`0004`** *(confirmed via SQL Editor: multi-tenant schema, missing columns, programs/intake, leads simulation extension)*
- [x] Tenant row **`handle = glpconvert`** in **`tenants`** *(INSERT success / already present)*
- [x] Smoke: test lead from **`/intake`** + row in **`leads`** *(Hug / hug@gmail.com visible in **Table Editor**)* — optional: tick **`/api/health`** in §11 when you’ve opened it once

**What you’re doing:** Finish wiring Supabase to Vercel, run the SQL, seed the default tenant, and prove a lead saves. If a button name on your screen is slightly different, pick the one that matches the idea (for example **Save** vs **Add**).

> **Already have the project?** If **GLPConvert** (ref **`gyuzrmshxzxqajiojqlu`**) is live, mark **§1–§5** checkboxes `[x]` and start at **§6** (Vercel keys).

**1 — Open Supabase and log in**

- [x] 1.1 In the browser, go to **https://supabase.com**.
- [x] 1.2 Click **Start your project** or **Sign in** (top right).
- [x] 1.3 Sign in with **GitHub** or email and finish any prompts until you see the dashboard or a list of projects.

**2 — Organization (if Supabase asks)**

- [x] 2.1 If you see **Create an organization**, type a name (for example your company name) and click **Create organization** or **Continue**.
- [x] 2.2 If you already have organizations, click the one you want so you see a **New project** button or your project list.

**3 — Create the database project**

- [x] 3.1 Click **New project** (often green, top right).
- [x] 3.2 Under **Organization**, choose your org from the dropdown.
- [x] 3.3 Under **Name**, type **`glpconvert-prod`** (or any name you’ll recognize).
- [x] 3.4 Under **Database password**, click **Generate a password** or type a strong password. **Copy it** to a password manager—you might need it later for direct database access.
- [x] 3.5 Under **Region**, pick the region closest to you (for example **East US**).
- [x] 3.6 Leave the plan on **Free** unless you want paid.
- [x] 3.7 Click **Create new project** or **Create project**.
- [x] 3.8 Wait on the loading screen until the left menu shows **Table Editor**, **SQL Editor**, **Database**, etc. (often 1–3 minutes). Don’t close the tab.

**4 — Copy the project URL**

- [x] 4.1 Look at the top of the Supabase page and make sure you’re in the project you just created (project name in the header or a dropdown).
- [x] 4.2 In the **left menu**, scroll down and click **Project Settings** (gear icon).
- [x] 4.3 In the inner left menu, click **API**.
- [x] 4.4 Find **Project URL** (a line like `https://xxxx.supabase.co`).
- [x] 4.5 Click the **copy** icon next to it. Keep that value—you’ll paste it as **`SUPABASE_URL`**.

**5 — Copy the service role key (secret)**

- [x] 5.1 Stay on the same **API** page.
- [x] 5.2 Scroll to **Project API keys** (or **API Keys**).
- [x] 5.3 Find the row named **`service_role`** (it may say it is secret or bypasses Row Level Security).
- [x] 5.4 Click **Reveal** or the eye icon if the key is hidden.
- [x] 5.5 Click **Copy** and copy the **entire** secret (new projects often use **`sb_secret_…`**; older ones use a long **`eyJ…`** JWT). This whole string is **`SUPABASE_SERVICE_ROLE_KEY`**.
- [x] 5.6 **Do not** put this key in any variable that starts with **`NEXT_PUBLIC_`**. Do not paste it in public chat or commit it to git. You **do not** need the **Publishable** key (`sb_publishable_…`) for GLPConvert’s server-side Supabase client—skip it on Vercel unless you add browser Supabase later.

**6 — Put both keys in Vercel**

- [x] 6.1 Open **https://vercel.com** and sign in.
- [x] 6.2 Open your **GLPConvert** project.
- [x] 6.3 Click **Settings** (top), then **Environment Variables** (left).
- [x] 6.4 Click **Add New** (or **Add**).
- [x] 6.5 **Key:** type **`SUPABASE_URL`** (exact spelling).
- [x] 6.6 **Value:** paste the `https://….supabase.co` URL.
- [x] 6.7 Turn on **Production**, **Preview**, and **Development**.
- [x] 6.8 Click **Save**.
- [x] 6.9 Click **Add New** again.
- [x] 6.10 **Key:** **`SUPABASE_SERVICE_ROLE_KEY`**.
- [x] 6.11 **Value:** paste the long **service_role** key.
- [x] 6.12 Turn on **Production**, **Preview**, and **Development**.
- [x] 6.13 Click **Save**.
- [x] 6.14 Optional: add **`SUPABASE_FETCH_TIMEOUT_MS`** = **`12000`** the same way (helps serverless timeouts—see **`docs/ENV_VERCEL_AND_LOCAL.md`**).

**7 — Put the same keys in `.env.local` on your Mac (gitignored)**

- [x] 7.1 **`.gitignore`** already ignores **`.env.local`** and **`.env`** — never remove those lines; never `git add` secrets.
- [x] 7.2 If you don’t have **`.env.local`** yet: in Terminal from the repo root run **`cp env.local.template .env.local`** (already done once in your copy if the file exists).
- [x] 7.3 Open **`.env.local`** in Cursor. Set **`SUPABASE_URL`** = **`https://gyuzrmshxzxqajiojqlu.supabase.co`**.
- [x] 7.4 Set **`SUPABASE_SERVICE_ROLE_KEY`** to the **exact same string** as in Vercel (copy from Vercel → **Settings** → **Environment Variables** → reveal/copy **`SUPABASE_SERVICE_ROLE_KEY`**).
- [x] 7.5 For local **`npm run dev`**, also copy **`JWT_SECRET`** and **`ADMIN_TOKEN`** from Vercel into **`.env.local`** so they match (replace the `REPLACE_WITH_OPENSSL_…` placeholders in the template).
- [x] 7.6 Optional: **`SUPABASE_FETCH_TIMEOUT_MS=12000`**
- [x] 7.7 **Save** **`.env.local`**. Confirm it does **not** appear in **`git status`** (if it does, your ignore rules are wrong — fix before committing).

**8 — Redeploy on Vercel**

- [x] 8.1 In Vercel, click **Deployments** (top).
- [x] 8.2 On the latest **Production** row, click **⋯** → **Redeploy** → confirm.
- [x] 8.3 Wait until it says **Ready**. If it fails, open **Build Logs** and fix errors before continuing.

**9 — Run the SQL files (must be in this order)**

In your repo, these files live at:

- [x] 9.0a **`supabase/schema.sql`**
- [x] 9.0b **`supabase/migrations/0002_add_missing_columns.sql`**
- [x] 9.0c **`supabase/migrations/0003_glpconvert_intake_and_programs.sql`**
- [x] 9.0d **`supabase/migrations/0004_glpconvert_simulation_fields.sql`**

For **each** file, one at a time:

- [x] 9.1 In Supabase, click **SQL Editor** in the left menu.
- [x] 9.2 Click **New query**.
- [x] 9.3 On your computer, open that file in Cursor, select all (**Cmd+A**), copy (**Cmd+C**).
- [x] 9.4 Click in the Supabase SQL box and paste (**Cmd+V**).
- [x] 9.5 Click **Run** (bottom right, or **Cmd+Enter** / **Ctrl+Enter**).
- [x] 9.6 If you see an error in red, stop and fix it before running the next file. If you skipped **`schema.sql`** first, you’ll often see “relation does not exist.”
- [x] 9.7 If it says success (or “no rows returned”), move to the next file in the list. *(Repeat 9.1–9.7 for **9.0a**, then **9.0b**, then **9.0c**, then **9.0d** — tick each file row when that file has run successfully.)*

**10 — Add the default tenant (required for `/intake`)**

Without a tenant with handle **`glpconvert`**, the app returns **Tenant not found** when someone submits a lead.

**Easiest way (SQL):**

- [x] 10.1 Supabase → **SQL Editor** → **New query**.
- [x] 10.2 Paste this and click **Run**:

```sql
INSERT INTO public.tenants (handle, name)
VALUES ('glpconvert', 'GLPConvert default tenant')
ON CONFLICT (handle) DO NOTHING;
```

**Or use Table Editor:** **Table Editor** → table **`tenants`** → **Insert row** → **`handle`** = **`glpconvert`**, **`name`** = anything → save.

- [x] 10.3 *(Table Editor path)* Insert row **`glpconvert`** if you did not use SQL above.

**11 — Quick checks**

- [x] 11.1 In Supabase **Table Editor** → **`tenants`**, confirm a row with **`glpconvert`**.
- [ ] 11.2 In the browser, open **`https://glp-convert.vercel.app/api/health`** (or your real URL). The response should not say Supabase is missing or broken (if it glitches once, try again).
- [x] 11.3 Open **`https://glp-convert.vercel.app/intake?demo=1`** (or your URL), run through the flow, submit a test lead.
- [x] 11.4 In Supabase **Table Editor** → **`leads`**, confirm a new row appeared.

**Optional:** You can use the Supabase CLI instead of the SQL Editor; the SQL Editor is enough for this project.

**Production hardening (not a U037 blocker):** If **Table Editor** shows **RLS disabled** on **`public.leads`**, that is expected while the app uses only the **service role** on the server. Before any **browser / anon** Supabase access, add **RLS + policies** scoped by **`tenant_id`** (track as engineering hardening—**U024** / counsel may overlap for PHI).

**U037 is done for you:** Keys, SQL, tenant, and a real lead row are in place. Open **`/api/health`** once and tick **§11.2** above. **Next:** **[U038 — Stripe](#u038--human--stripe--resend--dns)**.

---

#### **U038 · HUMAN — Stripe + Resend + DNS** — **Chronological step 4** (after U037 `done`)

**What you’re doing:** Turn on Stripe **test mode**, copy API keys, create two prices, register a webhook to your live Vercel URL, paste everything into Vercel and `.env.local`, redeploy, then run a test checkout. Optionally set up Resend for email and DNS for a custom domain. Stay in **test mode** until you deliberately go live.

**Stripe may show — “Tell us more about your business”** (during signup or first dashboard visit)

- [ ] **Business website:** **`https://glp-convert.vercel.app`** (or your custom domain once it’s live).
- [ ] **What you offer (example you can paste and edit):** *We sell B2B software subscriptions (GLPConvert): white-label patient intake and educational simulation flows for clinics and telehealth providers offering weight-management programs. We do not dispense medication; our customers are licensed providers. Revenue is software licensing and optional setup fees.*

If you’re only wiring **test mode** right now and Stripe lets you, **Skip for now** is OK—come back and complete the profile before **live** payouts.

**1 — Log in to Stripe and use test mode**

- [ ] 1.1 Go to **https://dashboard.stripe.com** and sign in (create an account if needed).
- [ ] 1.2 Find the **Test mode** switch in the top bar (or header) and turn it **ON**. The dashboard should say you’re viewing test data.

**2 — Copy API keys**

- [ ] 2.1 In the **left sidebar**, click **Developers**. If you don’t see it, open the **≡** menu or **More** and find **Developers**.
- [ ] 2.2 Click **API keys**.
- [ ] 2.3 Find **Publishable key**. It should start with **`pk_test_`**. Click **Reveal** if needed, then copy it. This goes in Vercel as **`NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`**.
- [ ] 2.4 Find **Secret key** on the same page (starts with **`sk_test_`** in test mode). Click **Reveal** and copy the full value. This goes in Vercel as **`STRIPE_SECRET_KEY`**. (Do not use **`sk_live_`** until you intentionally go live.)

**3 — Create the monthly product and price**

- [ ] 3.1 In the left sidebar, click **Product catalog** (or **Products**).
- [ ] 3.2 Click **Add product** (or **+ Create product**).
- [ ] 3.3 **Name:** type something like **`GLPConvert Monthly`**.
- [ ] 3.4 Under pricing, choose **Recurring** (subscription).
- [ ] 3.5 Set **Price** to **99** USD (or your amount) and pick **Monthly** if Stripe asks for interval.
- [ ] 3.6 Click **Save product** or **Add product**.
- [ ] 3.7 On the product page, find the **Price ID** (starts with **`price_`**). Click to copy it. You will use this as **`STRIPE_PRICE_MONTHLY_99`** in Vercel.

**4 — Create the one-time setup product and price**

- [ ] 4.1 Click **Add product** again (or **Product catalog** → **Add product**).
- [ ] 4.2 **Name:** e.g. **`GLPConvert Setup`**.
- [ ] 4.3 Choose **One time** pricing, amount **399** USD (or your amount).
- [ ] 4.4 Save.
- [ ] 4.5 Copy the **Price ID** (`price_…`). You will use this as **`STRIPE_PRICE_SETUP_399`** in Vercel.

**5 — Add the webhook endpoint**

Your app listens at **`/api/stripe/webhook`** (not `/api/webhooks/stripe` for the main handler). Use your real Vercel hostname, for example **`https://glp-convert.vercel.app/api/stripe/webhook`**.

- [ ] 5.1 In Stripe, go to **Developers** → **Webhooks**.
- [ ] 5.2 Click **Add endpoint** (or **Add an endpoint**).
- [ ] 5.3 **Endpoint URL:** paste `https://YOUR-VERCEL-HOST/api/stripe/webhook` (replace **`YOUR-VERCEL-HOST`** with your domain, no trailing slash before **`/api`**).
- [ ] 5.4 Click **Select events** (or **+ Select events**).
- [ ] 5.5 Add these events one by one (this matches the app’s webhook code):
   - [ ] `checkout.session.completed`
   - [ ] `payment_intent.succeeded`
   - [ ] `invoice.payment_succeeded`
   - [ ] `invoice.payment_failed`
   - [ ] `customer.subscription.updated`
   - [ ] `customer.subscription.deleted`
- [ ] 5.6 Click **Add endpoint** or **Save** to finish creating the endpoint.
- [ ] 5.7 Click your new endpoint in the list.
- [ ] 5.8 Find **Signing secret**. Click **Reveal** and copy the value (starts with **`whsec_`**). This is **`STRIPE_WEBHOOK_SECRET`** in Vercel.

**6 — Put Stripe variables in Vercel**

- [ ] 6.1 Open Vercel → your project → **Settings** → **Environment Variables**.
- [ ] 6.2 For **each** row in the table below: **Add New** → key → value → enable **Production**, **Preview**, **Development** → **Save**:

| Key | What to paste |
|-----|----------------|
| `STRIPE_SECRET_KEY` | Your **`sk_test_…`** secret key |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Your **`pk_test_…`** publishable key |
| `STRIPE_PUBLISHABLE_KEY` | Same string as the publishable key (optional but helps older code paths) |
| `STRIPE_PRICE_MONTHLY_99` | The recurring price ID **`price_…`** |
| `STRIPE_PRICE_SETUP_399` | The one-time price ID **`price_…`** |
| `STRIPE_WEBHOOK_SECRET` | The **`whsec_…`** signing secret |

If your app also reads **`STRIPE_PRICE_STARTER`** / **`STRIPE_PRICE_MONTHLY`**, set them to the same IDs your checkout uses (see **`.env.example`**).

**7 — Copy the same Stripe lines to `.env.local`**

- [ ] 7.1 Open **`.env.local`** (or **`.env`**) in the repo and add the same keys and values as Vercel.
- [ ] 7.2 Save. Don’t commit.

**8 — Redeploy**

- [ ] 8.1 Vercel → **Deployments** (top).
- [ ] 8.2 On the latest **Production** row, **⋯** → **Redeploy** → confirm.
- [ ] 8.3 Wait until **Ready**.

**9 — Resend (optional — for transactional email)**

- [ ] 9.1 Go to **https://resend.com** and sign up or log in.
- [ ] 9.2 Open **API Keys** in the sidebar.
- [ ] 9.3 Click **Create API Key**, give it a name, click **Create**.
- [ ] 9.4 Copy the key (starts with **`re_`**). In Vercel **Environment Variables**, add **`RESEND_API_KEY`** with that value (all three environments), **Save**, then **Redeploy**.
- [ ] 9.5 To send from your own domain: **Domains** → **Add domain** → type your domain → Resend shows DNS records. At your registrar (Namecheap, etc.), add each **TXT** / **MX** record exactly as shown → back in Resend click **Verify** until it says verified.

**10 — Custom domain for the site (optional)**

- [ ] 10.1 Vercel → **Settings** → **Domains** → type `www.yourdomain.com` or apex → **Add**.
- [ ] 10.2 Add the **A** or **CNAME** records Vercel shows, at your DNS host.
- [ ] 10.3 Wait until Vercel shows **Valid**.
- [ ] 10.4 If you use this domain in Stripe’s webhook URL, **edit** the Stripe webhook endpoint URL to match, then copy the **new** signing secret if Stripe gives you one, update **`STRIPE_WEBHOOK_SECRET`** in Vercel, and **Redeploy**.

**11 — Smoke test**

- [ ] 11.1 Open your live site and go through **checkout** while Stripe is still in **test mode**.
- [ ] 11.2 Use test card **`4242 4242 4242 4242`**, any future expiry, any 3-digit CVC, any ZIP.
- [ ] 11.3 In Stripe: **Developers** → **Webhooks** → click your endpoint → **Attempts** (or **Event deliveries**). You should see **200** responses, not only errors.
- [ ] 11.4 If you set up Resend, trigger an email (e.g. from a flow that sends mail) and check your inbox or Resend **Logs**.

**When U038 is done:** Env vars are set, redeploy is green, test payment works, webhook deliveries look successful. Say **`done`**.

---

#### **U039 · AUTO — Launch closeout doc** — **Chronological step 5** (after U038 `done`)

- **Agent (Cursor):** Add **`LAUNCH_CLOSEOUT.md`** summarizing prod URL, envs set, migrations applied, smoke test.
- [ ] **You:** Open repo root and confirm **`LAUNCH_CLOSEOUT.md`** exists and matches reality (URL, which env keys you set, migrations/tenant done). Tick when verified.

---

#### **U040 · HUMAN — Sentry**

**When:** Usually after **U038** (and often after **U039**). **What you’re doing:** Create a Sentry project, copy the DSN, add two environment variables on Vercel and locally, redeploy, then confirm errors show up in Sentry. More detail: **`docs/SENTRY_GLPCONVERT.md`**.

- [ ] S1. Go to **https://sentry.io** and sign up or log in.
- [ ] S2. If asked, create an **organization** (any name you like).
- [ ] S3. Click **Create Project** (or **Projects** → **Create Project**).
- [ ] S4. Choose **Next.js** (or **React** if Next.js isn’t listed—either works for this repo).
- [ ] S5. Name the project e.g. **`glpconvert`** → click **Create Project**.
- [ ] S6. Sentry shows a **DSN** (a URL-like string). Click **Copy**.
- [ ] S7. Vercel → your project → **Settings** → **Environment Variables** → **Add New** → Key **`SENTRY_DSN`**, value = paste DSN, enable Production + Preview + Development → **Save**.
- [ ] S8. **Add New** again → Key **`NEXT_PUBLIC_SENTRY_DSN`**, value = **same DSN** (needed for browser errors) → all environments → **Save**.
- [ ] S9. Add the same two lines to **`.env.local`** on your Mac.
- [ ] S10. **Deployments** → **Redeploy** Production.
- [ ] S11. Trigger a test error (or visit **`/sentry-example-page`** if your build includes it) and open Sentry → **Issues** to see the event.

---

#### **U024 · HUMAN — Counsel review pack**

**What you’re doing:** Send your lawyer the same materials they need to sign off before you call the site “production legal.” There is no universal website for this—use email or your firm’s portal.

- [ ] L1. In Cursor or Finder, locate: **`app/terms`** (or your terms route), **`app/privacy`** (or privacy route), simulator / intake disclaimer text, and the **`GLPCONVERT_*`** docs that describe claims and compliance (**`COMPLIANCE_NOTES_GLPCONVERT.md`**, etc.).
- [ ] L2. Zip the files or list links in one email.
- [ ] L3. Write a short note: you want review of **marketing claims**, **medical / telehealth disclaimers**, **privacy policy**, and **terms** for a patient-facing GLP funnel.
- [ ] L4. Send to counsel. When they approve (or you’ve applied their edits), tick this and treat **U024** as done in the queue below.

---

#### **U030 · HUMAN — Booking links per clinic**

**Implemented in app:** `tenants.crm_keys` JSON **`{"booking_url":"https://..."}`** (HTTPS only) is read by **`GET /api/public/tenant-intake-config?handle=`** and the **`/intake`** funnel. **`POST /api/admin/create-tenant`** accepts **`bookingUrl`** and writes that JSON. Demos can override with **`/intake?...&booking=https%3A%2F%2F...`**.

- [ ] B1. For each clinic, copy the **public scheduling URL** (Calendly, Jane, Acuity, etc.).
- [ ] B2. In **Supabase → tenants**, set **`crm_keys`** to `{"booking_url":"<paste>"}` **or** create the tenant with **`bookingUrl`** in the admin API body.
- [ ] B3. Smoke: open **`/intake?company=<handle>`** (no demo) and confirm **Open scheduling** / confirmation step uses the clinic link.

---

#### **U034 · HUMAN — Production smoke test**

**What you’re doing:** After infra is live, click through the real site like a user and confirm nothing obvious is broken.

- [ ] P1. Open your production URL (e.g. **`https://glp-convert.vercel.app`**).
- [ ] P2. Open **`/api/health`** in the browser—page should load JSON, not a 500 error.
- [ ] P3. Open **`/intake`** (or **`/intake?demo=1`**). Complete the simulator through to **submit a test lead** with a fake email.
- [ ] P4. In Supabase **Table Editor**, confirm the lead row exists.
- [ ] P5. If Stripe is on, run a **test checkout** (test card **`4242…`**) and confirm the webhook gets a **200** in Stripe **Developers → Webhooks → Attempts**.
- [ ] P6. If Resend is on, confirm a test email arrives or appears in Resend logs.

---

## Audit Snapshot (Current State)

### Already Exists

- [x] Core rebrand + vertical scaffolding (`glp`, `trt`, `pep`)
- [x] `/api/recommend` deterministic recommendation scaffold
- [x] Basic intake and result pages
- [x] Core docs set (migration/legal/product/spec/env/infra)
- [x] Multiple GLP copy updates across legal/support/pricing/docs
- [x] **Phase R (partial):** Multi-step funnel — input → transition → results (“Your GLP Path”) → consult readiness → lead → confirmation; demo mode (`demo=1` / `preview=1`); owner panels (leak illustration, before/after, ROI bullets, activate CTA); UTM session merge (`lib/glp-attribution.ts`); optional Meta/GA pixels on intake (`AttributionPixels`); readiness + extended UTM stored in lead `GLP_SIMULATION` JSON
- [x] **Legacy codebase → GLP API map:** full internal route list + external providers (Supabase, Stripe, Resend, NREL, EIA, OpenEI, Google, Vercel, Meta/GA client) in `GLPCONVERT_API_CONTRACTS.md` (*Platform inventory*); follow-up tasks **R011–R016**

### Partially Exists

- [~] Conversion-first public funnel (structure matches revenue-layer spec; per-clinic pricing/disclaimers from tenant still open)
- [~] Lead storage for GLP (DB columns + notes JSON; readiness now in JSON)
- [~] Analytics/event tracking (event route + pixels; dashboard metrics still open)
- [~] White-label ownership feel (`TenantProvider` / JSON tenants; **demo** branding via `/intake?logo=&brand=&brand2=` shipped — tenant DB **U017–U020** still open)

### Missing / High Priority

- [ ] U011 — optional sex/age + confidence bands in UI/math
- [ ] Treatment economics from **tenant settings** (not hardcoded ranges)
- [x] Booking/scheduling **outbound webhook** on lead (**R006**): `POST /api/lead` → HTTPS **Capture URL** on tenant (`lib/crm-lead-webhook.ts`, fire-and-forget)
- [ ] Tenant dashboard: traffic, completions, leads, readiness summary
- [ ] Playwright coverage for new steps (U033)
- [ ] Performance pricing / network benchmark index (long-term; not started)
- [ ] **R017–R019** — Outreach/embed UX + public setup docs (see Phase **R**)

---

## Unified Chronological Implementation Queue

### Phase R — Revenue conversion layer (spec Mar 2026)

Aligned with `PRODUCT_STRATEGY_GLPCONVERT.md`. Execute in parallel with human infra (U036+) where possible.

- [x] **R001 · AUTO** Author `PRODUCT_STRATEGY_GLPCONVERT.md`, `DEMO_STRATEGY_GLPCONVERT.md`, `COMPLIANCE_NOTES_GLPCONVERT.md`.
- [x] **R002 · AUTO** Funnel steps: fast input → “Building your plan…” → results (trust chips, Your GLP Path, process, expectations, price range + disclaimers, mini-FAQ, compliance footer) → consult readiness → lead capture → confirmation.
- [x] **R003 · AUTO** Demo mode: `Preview for {{clinic}}`, `GlpDemoOwnerPanels` (illustrative leak, before/after, ROI copy, activate CTA), `demo_traffic` query override.
- [x] **R004 · AUTO** Attribution: UTM persistence (`lib/glp-attribution.ts`); optional `NEXT_PUBLIC_META_PIXEL_ID` / `NEXT_PUBLIC_GA_MEASUREMENT_ID` on `/intake`.
- [x] **R005 · AUTO** Lead API: `readiness` + `utmMedium` / `utmTerm` / `utmContent` in packed `GLP_SIMULATION` metadata.
- [x] **R010 · AUTO** **Deep API audit:** document every **internal** App Router route + **external** provider call the forked stack uses; classify **GLP required / optional / solar-only / deprecate**; list **beneficial GLP additions** — see `GLPCONVERT_API_CONTRACTS.md` (*Platform inventory*).
- [x] **R006 · AUTO** Post-lead **server webhook** to tenant **Capture URL** (`https://` only): `POST /api/lead` after successful store → JSON payload `event: lead.created` + lead fields (non-blocking; optional **`CRM_WEBHOOK_TIMEOUT_MS`**). *Admin still uses `POST /api/tenant/crm-webhook` to set URL.*
- [ ] **R007 · AUTO** Dashboard cards: starts, completions, leads, readiness rollup (uses events + leads).
- [ ] **R008 · AUTO** Embed / deployment docs + optional iframe snippet page (no bloated builder).
- [ ] **R009 · HUMAN** BAA + encryption review with counsel and vendors (`U024` overlap).
- [x] **R011 · AUTO** **`GET /api/health` GLP profile:** when `NEXT_PUBLIC_VERTICAL` is **not** `solar_legacy`, **NREL/EIA probes are skipped** (solar-only). Response includes `healthProfile: "glp"` | `"full"` and `vertical`. Set `HEALTH_PROBE_SOLAR=1` to force solar probes. Update `docs/API-HEALTH-COVERAGE.md` when convenient.
- [ ] **R012 · AUTO** Deprecate **`POST /api/submit-lead`** mock: return 410/redirect doc or forward body to **`POST /api/lead`**; grep repo for callers.
- [ ] **R013 · AUTO** Extend **`POST /v1/ingest/lead`** for GLP: optional `vertical`, `simulationInput` / `simulationOutput` / `readiness` / `bookingStatus`; **address optional**; skip `getRate`/utility when no coords/postal.
- [ ] **R014 · AUTO** Refresh **`app/docs/api/page.tsx`** to mirror the **GLP-relevant** route table from `GLPCONVERT_API_CONTRACTS.md` (not only 5 bullets).
- [ ] **R015 · AUTO** (Optional) **Meta Conversions API** server route + env — complements `AttributionPixels` for attribution under ATT.
- [ ] **R016 · AUTO** **Inbound booking webhook** (e.g. `POST /api/webhooks/booking`) — verify HMAC or shared secret; map to lead email/tenant → update `booking_status` (feeds U016 + dashboard).
- [~] **R017 · AUTO** **Cold-email + embed + white-label fit:** **`/docs/embed`** updated (prod vs demo iframe, `handle=`); tenant **logo + colors + pricing** merge from **`GET /api/public/tenant-intake-config`** when query overrides absent; optional **`postMessage`** resize + deeper mobile polish still open.
- [ ] **R018 · HUMAN** **ICP collateral:** 2–3 short PDFs or Notion pages (**med spa** / **telehealth** / **clinic**) for cold-email attachments—positioning only; links to live **`/intake?...&demo=1`** demos.
- [ ] **R019 · AUTO** **`/docs/setup`:** GLPConvert (not solar), **Mar 2026** date, **Environment variables** subsection — **names only** (link repo **`docs/ENV_VERCEL_AND_LOCAL.md`**); **never** ship secret values on a public page.
- [x] **R020 · AUTO** **Demo URL branding (white-label):** `GlpSimulationFunnel` + **`useBrandTakeover`** read **`logo`** (HTTPS URL), **`domain=`** (Clearbit logo), **`brand`** / **`primary`**, **`brand2`** (6-digit hex) — primary CTAs + readiness chips + preview banner. Documented in **`DEMO_STRATEGY_GLPCONVERT.md`**. Production parity → **U017–U020**.
- [x] **R021 · AUTO** **Tenant booking handoff (patient-facing):** **`lib/tenant-intake-public.ts`** + **`GET /api/public/tenant-intake-config`**, funnel merges **`booking` / `book` / `booking_url`** query params; **`POST /api/admin/create-tenant`** **`bookingUrl`**; leads table shows **booking_status**, **recommended_path**, **budget_band**; marketing home **hides solar legacy** unless `NEXT_PUBLIC_VERTICAL=solar_legacy` or `NEXT_PUBLIC_ENABLE_SOLAR_ESTIMATE=1`.

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
- [~] **U018 · AUTO** Clinic-specific pricing from tenant: **`crm_keys`** `intake_monthly_low` / `intake_monthly_high` + optional fee/payment notes (**shipped** in public config + funnel); full admin UI / validation still open.
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

### Phase 9 — Infra and launch blockers (strict order: **U035 → U036 → U037 → U038 → U039**)

**End state:** Vercel + **Supabase** (you create project + keys; you run migrations from repo) + **Stripe** (you create keys/products/webhook) + optional Resend/DNS. Env parity **Vercel ↔ `.env.local`** (`env.local.template`, **`docs/ENV_VERCEL_AND_LOCAL.md`**).

- [x] **U035 · HUMAN** Git remote + push `main` → `https://github.com/hugowentzel1/GLPConvert`
- [x] **U036 · HUMAN** **Step 2:** Vercel import + **app/auth env** + first **green deploy** + local env mirror (`.env` / `.env.local`).
- [x] **U037 · HUMAN** **Step 3:** Supabase wired, migrations run, tenant **`glpconvert`**, test lead in **`leads`** — complete.
- [ ] **U038 · HUMAN** **Step 4** **← YOU ARE HERE:** **You** configure **Stripe** test mode → paste **`STRIPE_*`** + webhook **`whsec_`** → optional **Resend** / DNS → **Redeploy** → test checkout + webhook.
- [ ] **U039 · AUTO** **Step 5:** Agent writes **`LAUNCH_CLOSEOUT.md`** — no dashboard work from you.

### Phase 10 — Observability (after U039 or in parallel with U038)

- [ ] **U040 · HUMAN** **Sentry:** Follow **[U040 — Sentry](#u040--human--sentry)** in the playbook above (also **`docs/SENTRY_GLPCONVERT.md`**).  
- [ ] **U041 · AUTO** Agent aligns Sentry / Next instrumentation when SDK or env names change (no Sentry login).

---

## NEEDS HUMAN INPUT (Exact blockers only)

- **H1 — Git remote creation (`U035`)** — **done** · https://github.com/hugowentzel1/GLPConvert

- **H2 — Hosted infra (`U038`)**  
  **U035–U037 done.** **You are on U038** (Stripe). Follow **[U038 playbook](#u038--human--stripe--resend--dns)**; when Stripe env + webhook + test checkout are green, reply **`done`** for **U039**.  
- **H2b — Sentry (`U040`)** — Follow **[U040 — Sentry](#u040--human--sentry)** in the playbook; **agent** does not need your Sentry login.

- **H3 — Legal signoff (`U024`)**  
  Why blocked: attorney/counsel approval required for production claims and disclosures.  
  Next action: route final claims/copy/legal docs for counsel approval.

- **H4 — Entity formation (`W001+`)** — **[Wellspire LLC ladder](#wellspire-llc--multi-brand-ladder-before-cold-email)** before **M001** cold email; research pack **`docs/WELLSPIRE_LLC_MULTI_BRAND_SOURCES.md`**.

---

## Current Active Step

**Position:** Infra **step 4 of 6** — **U038 · Stripe** (in progress). **Already finished:** **U035** ✅ **U036** ✅ **U037** ✅

**Do next (Stripe — see full checklist in playbook):**

- [ ] S1. Stripe **test mode** on → copy **`pk_test_`** / **`sk_test_`** → Vercel + **`.env.local`**
- [ ] S2. Create **monthly** + **one-time** products → copy both **`price_…`** IDs → **`STRIPE_PRICE_*`** in Vercel + local
- [ ] S3. **Webhooks** → endpoint **`https://glp-convert.vercel.app/api/stripe/webhook`** → select the six events in **U038 §5** → copy **`whsec_`**
- [ ] S4. **Redeploy** Vercel Production → test checkout **`4242…`** → confirm webhook **200** in Stripe **Attempts**

**Playbook (full detail):** [U038 — Stripe + Resend + DNS](#u038--human--stripe--resend--dns).

**After U038:** message **`done`** → agent **U039** (`LAUNCH_CLOSEOUT.md`) → optional **U040** Sentry → complete **Wellspire LLC ladder (W001+)** → **Marketing** when ready.

**Loose end from U037:** tick **§11.2** in the U037 playbook when you’ve opened **`https://glp-convert.vercel.app/api/health`** once.

---

## Wellspire LLC & multi-brand ladder (before cold email)

**Goal:** **Wellspire LLC** is the **legal entity** behind **GLPConvert**, **TRTConvert**, **PEPConvert**, and future similar B2B lead/SaaS tools. Cold email and CAN-SPAM footers need a **real legal name + mailing address**; **Stripe** Know Your Business should match your **entity**.

**Is it legal to run all products under one LLC?** **Yes** — a single LLC may operate **multiple** software products and **customer-facing brands**. Brands are usually **trade names** / **state DBAs** (where required) or disclosed in **Terms** as “**Wellspire LLC** d/b/a **GLPConvert**,” etc. **Trade-off:** **one LLC = one shared liability pool** (creditors/suits against one line generally reach **all** LLC assets). **Separate LLCs per product** add cost and admin but **isolate** risk between stacks—many founders start **one LLC** and **split later** if revenue or risk justifies it. **Not legal advice** — confirm with counsel. **Sources + deep links:** **`docs/WELLSPIRE_LLC_MULTI_BRAND_SOURCES.md`** (IRS EIN, SBA formation, DBA primers, USPTO trademark hub, FinCEN BOI “check current rule,” CorpNet/LegalZoom/GovDocFiling multi-business articles, Stripe alignment).

**Billing reminder (GLPConvert checkout):** Customers pay **two Stripe line items** aligned with your product: a **one-time setup** (e.g. **`STRIPE_PRICE_SETUP_399`**) **and** a **recurring subscription** (e.g. **`STRIPE_PRICE_MONTHLY_99`**). Both are **software access** fees for **Wellspire LLC** (customer-facing brand **GLPConvert** on site copy). Same pattern can apply to **TRTConvert** / **PEPConvert** when those checkouts go live.

### Checklist — **W001+** (tick in this file)

- [ ] **W001** Pick **formation state** (often home state first; **Delaware/Wyoming** are common for specific investor/tax situations—compare **franchise tax** and **foreign qualification** if you operate elsewhere). Discuss with counsel if unsure.
- [ ] **W002** **Name availability:** **`Wellspire LLC`** (or compliant variant per state) — search state business registry; reserve if offered.
- [ ] **W003** File **Articles of Organization** (or state equivalent) + appoint **registered agent** (you or a service).
- [ ] **W004** Adopt **Operating Agreement** (single-member or multi-member): include **broad purpose** (B2B software, SaaS, lead tools) and authority to add **product lines** / **DBAs**.
- [ ] **W005** Obtain **EIN** from IRS (free online) — [official IRS EIN application](https://www.irs.gov/businesses/small-businesses-self-employed/apply-for-an-employer-identification-number-ein-online).
- [ ] **W006** **BOI / Corporate Transparency Act:** check **current** [FinCEN BOI](https://www.fincen.gov/boi) + counsel — rules and injunctions have **changed**; do not rely on stale blog deadlines.
- [ ] **W007** Register **DBAs / fictitious business names** per **state/county** for **GLPConvert**, **TRTConvert**, **PEPConvert** (if you will sign contracts or bank under those names in a way your state requires).
- [ ] **W008** Open **business bank account**: **Wellspire LLC** (and **DBA** accounts only if your bank’s KYC requires separate ledgers).
- [ ] **W009** **Stripe** (and other processors): **legal entity** = **Wellspire LLC**; align **business URL**, **descriptor**, and **support contact**; keep **test → live** promotion checklist.
- [ ] **W010** **Terms / Privacy / contact footers** on each product site: identify **Wellspire LLC**, physical **mailing address**, and **brand** (d/b/a) as needed — pairs with **U024** counsel review.
- [ ] **W011** **Trademark clearance:** [USPTO TESS](https://www.uspto.gov/trademarks/search) + common-law scan before heavy spend; file via [USPTO Trademark Center](https://trademarkcenter.uspto.gov/) when ready (often **Wellspire LLC** as applicant).
- [ ] **W012** **Insurance quotes:** tech **E&O**, **general liability**, **cyber** (limits per counsel/broker for health-adjacent B2B SaaS).
- [ ] **W013** **One-hour consult** with a **business attorney** in formation state: confirm **one LLC vs. split**, **foreign qualification**, **consumer health marketing** boundaries (complement **`COMPLIANCE_NOTES_GLPCONVERT.md`**).

**When this block is “good enough” for cold email:** **W003–W005** done, **W008** in progress or done, **W009** Stripe legal profile matches entity, **W010** footer address is real (CAN-SPAM), **W013** scheduled or complete.

---

## Marketing (cold outbound)

**Order before buying cold-email domains (M001):** (1) **Wellspire / W001+** far enough for real business identity. (2) **`M000 — Resend`** so the **app** can send mail from a **verified domain** (lead notify, transactional, optional broadcasts—Resend is **not** a replacement for **Google Workspace + Instantly** for high-volume cold outbound; it powers **product** email and can complement ops). (3) **Stripe live** so production checkout matches real money **before** you drive serious traffic from cold email. (4) Then **M001+** (domains for Workspace cold send, DNS, Instantly, etc.).

**When to start M001+:** After **M000** + **Stripe live** checklists below are done, demo URL works, **W001+** footer/CAN-SPAM path is real. **Cold-email copy:** **`GLPCONVERT_COLD_EMAIL_POSITIONING.md`**. **Full outbound OS:** **`GLPCONVERT_COLD_EMAIL_PLAYBOOK.md`** + **CE-2026** table above + **`docs/COLD-EMAIL-BRANDING-GUIDE.md`**. **More ops detail:** **`TO-DO-LIST.md`**, **`BLINDSPOT-GUIDE.md`** (legacy checklists — prefer GLPConvert-specific docs first).

---

### **M000 — Resend: API key + verified sending domain + “from” address**

Use this for **GLPConvert product email** (API routes that call Resend). **Cold email at scale** still uses **M002–M004** (Workspace + Instantly); Resend can send **from** the same or a different subdomain (e.g. `notify@mail.yourdomain.com`) once DNS verifies.

- [ ] M0.1 Create or log in at **https://resend.com**.
- [ ] M0.2 **API Keys** → **Create API Key** → copy (`re_…`) → **Vercel** → **Environment Variables** → **`RESEND_API_KEY`** → all environments → **Save** → **Redeploy**.
- [ ] M0.3 Same key in **`.env.local`** / **`.env`** (gitignored)—never commit.
- [ ] M0.4 **Domains** → **Add domain** → enter the domain (or subdomain) you will send **from** (e.g. `mail.wellspire.com` or root domain per Resend docs).
- [ ] M0.5 At your **DNS host** (Namecheap, Cloudflare, etc.), add every **TXT** / **MX** record Resend shows → back in Resend click **Verify** until **Verified**.
- [ ] M0.6 In code or Resend templates, use a **From** address on that verified domain (e.g. `GLPConvert <notify@mail.yourdomain.com>`)—align with **`docs/ENV_VERCEL_AND_LOCAL.md`** / app mail helper if documented.
- [ ] M0.7 Trigger a **test** send from staging or production (e.g. lead form / admin path that emails) → confirm inbox + **Resend → Logs**.
- [ ] M0.8 *(Optional)* Add **DMARC** for that sender domain if not already covered by **M003** records (don’t double-conflict SPF; one coherent policy per domain).

---

### **Stripe live mode (do before M001 cold-email scale)**

Stay on **test** (`sk_test_`, `pk_test_`, test `price_…`, test `whsec_`) until you are ready for **real charges**. Then promote **once**; you will **replace** env values (live IDs do not match test).

- [ ] SL.1 Stripe Dashboard → turn **Live mode** **ON** (toggle off test).
- [ ] SL.2 **Developers → API keys** → copy **`pk_live_…`** and **`sk_live_…`** → Vercel: **`NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`**, **`STRIPE_SECRET_KEY`** (+ **`STRIPE_PUBLISHABLE_KEY`** if used) → all environments → Save.
- [ ] SL.3 **Product catalog** → recreate (or duplicate) **monthly** + **setup** products in **live** → copy **new** **`price_…`** IDs → **`STRIPE_PRICE_MONTHLY_99`**, **`STRIPE_PRICE_SETUP_399`**.
- [ ] SL.4 **Developers → Webhooks** → **Add endpoint** with **live** URL **`https://glp-convert.vercel.app/api/stripe/webhook`** (or your prod domain) → same **six events** as test → copy **new** **`whsec_…`** → **`STRIPE_WEBHOOK_SECRET`** (live secret is different from test).
- [ ] SL.5 Mirror **SL.2–SL.4** into **`.env.local`** / **`.env`** (gitignored).
- [ ] SL.6 **Redeploy** Vercel Production.
- [ ] SL.7 Run a **small real** card checkout (you can refund after) → Stripe **Webhooks → Attempts** show **200**.
- [ ] SL.8 **Wellspire / W009:** Stripe **Business settings** and **KYC** match your **legal entity** before heavy volume.

---

### **M001 — Buy domains (Namecheap or any registrar)**

- [ ] M1.1 Go to **https://www.namecheap.com** (or your preferred registrar) and sign in.
- [ ] M1.2 Use **Domains** → **Domain Name Search** (or the search box on the home page).
- [ ] M1.3 Buy **at least two** domains: one for **landing / demo** pages, and **one or more** domains used **only** for **sending** cold email (don’t send bulk cold email from your main company domain).
- [ ] M1.4 Complete checkout (card, auto-renew choices, etc.).
- [ ] M1.5 After purchase: **Domain List** → click **Manage** on a domain → open **Advanced DNS**. You’ll use this screen again in **M003** for SPF/DKIM/DMARC.

---

### **M002 — Google Workspace (email inboxes)**

- [ ] M2.1 Go to **https://workspace.google.com** and start signup for **Google Workspace**.
- [ ] M2.2 Create an admin account and choose a plan.
- [ ] M2.3 Add your **sending** domain(s) to Workspace (Google will ask to **verify** the domain).
- [ ] M2.4 Google gives you a **TXT** record to add at your registrar. In Namecheap: **Domain List** → **Manage** → **Advanced DNS** → **Add New Record** → type **TXT Record** → paste Google’s **Host** and **Value** → **Save**.
- [ ] M2.5 Back in Google Admin, click **Verify**.
- [ ] M2.6 Create **at least 4 user mailboxes** on that domain (for example `alex@`, `sam@`, `jordan@`, `taylor@` on your sending domain) so you can rotate senders later. **Directory** → **Users** → **Add new user** for each.

---

### **M003 — SPF, DKIM, DMARC (so mail doesn’t land in spam)**

Do this **for each sending domain** at your registrar’s DNS (Namecheap **Advanced DNS**).

**SPF**

1. **Add New Record** → **TXT Record**.
2. **Host** `@` (or Namecheap may use `@` for root).
3. **Value:** `v=spf1 include:_spf.google.com ~all`
4. Save.

**DKIM (keys come from Google)**

1. In a browser, open **https://admin.google.com** (Google Admin).
2. Go to **Apps** → **Google Workspace** → **Gmail** → **Authenticate email** (wording can vary slightly; look for **DKIM**).
3. Select your domain → **Generate new record** if needed. Google shows a **DNS host name** (often a selector like `google._domainkey`) and a **TXT value**.
4. In Namecheap **Advanced DNS**, add a **TXT** record with that **host** and **value** exactly as Google shows.
5. Back in Admin, click **Start authentication** / **Verify**.

**DMARC (start soft)**

1. Add a **TXT** record: **Host** `_dmarc` (some UIs want `_dmarc.yourdomain.com`—follow your registrar’s hint).
2. **Value:** `v=DMARC1; p=none; rua=mailto:you@yourdomain.com` (use a real inbox you read).
3. Save. Later you can tighten **`p=`** when mail is healthy.

Screenshots-style detail: **`BLINDSPOT-GUIDE.md`** (“Verify Cold Email Domain Setup”) and **`TO-DO-LIST.md`** items around **24–27**.

---

### **M004 — Instantly (connect inboxes)**

- [ ] M4.1 Go to **https://instantly.ai** and create an account.
- [ ] M4.2 In the left menu, open **Email Accounts** (or **Accounts**).
- [ ] M4.3 Click **Add account** / **Connect** → choose **Google**.
- [ ] M4.4 Sign in with each Workspace user you created and approve access. Repeat until all sending inboxes appear in Instantly.

---

### **M005 — Leads (Snov or similar)**

- [ ] M5.1 Go to **https://snov.io** (or Apollo, Hunter, etc.) and sign in.
- [ ] M5.2 Use their search to build a list (for example clinic owners, med spa GMs).
- [ ] M5.3 Export to **CSV** or save a list you can connect to Instantly. (If you use Sheets with Instantly, you can skip CSV and build the sheet in **M006** instead.)

---

### **M006 — Google Sheet with demo links**

- [ ] M6.1 Open **https://sheets.google.com** → **Blank** spreadsheet.
- [ ] M6.2 Row 1 headers: **`Email`**, **`First name`**, **`Company`** (or **`CompanyDomain`**), **`DemoURL`** (exact spelling helps Instantly mapping).
- [ ] M6.3 In **`DemoURL`** (assuming company/domain is in column **C** and row 2 is first data row), cell **D2** formula:

`="https://glp-convert.vercel.app/intake?company="&ENCODEURL(C2)&"&demo=1"`

- [ ] M6.4 Change **`glp-convert.vercel.app`** to your custom domain in the formula if you add one.
- [ ] M6.5 Drag the formula down for all rows.
- [ ] M6.6 Click **Share** (top right) → **Anyone with the link** → **Viewer** (or what Instantly requires) → copy the **sheet URL**.

---

### **M007 — Instantly campaign + sequence**

- [ ] M7.1 In Instantly, click **Campaigns** → **New Campaign**.
- [ ] M7.2 Name the campaign.
- [ ] M7.3 **Add Leads** → **Google Sheets** → paste your sheet URL → import.
- [ ] M7.4 Map columns: **Email**, **First name**, **Company**, and a custom field for **`demo_url`** (or map **`DemoURL`** to Instantly’s demo URL field).
- [ ] M7.5 **Sequences** → add **3 emails**. Use copy from **`GLPCONVERT_COLD_EMAIL_POSITIONING.md`**.
- [ ] M7.6 Use variables like **`{{first_name}}`**, **`{{company}}`**, **`{{demo_url}}`** in the body (match Instantly’s variable names from the sidebar).
- [ ] M7.7 **Footer (CAN-SPAM):** include your **physical mailing address**, a clear **unsubscribe** line or link, and your real **business name** (e.g. **Wellspire LLC**). Honor opt-outs promptly.
- [ ] M7.8 Save the campaign.

---

### **M008 — Launch and daily habits**

- [ ] M8.1 In the campaign, set **Schedule** (many people send Tue–Thu mornings in the lead’s timezone).
- [ ] M8.2 Set **daily limits** low at first (so you don’t burn domains).
- [ ] M8.3 Click **Test** / send a **test** to your own email. Open the email, click the demo link, confirm the GLP page loads.
- [ ] M8.4 When it looks good, click **Launch** / **Activate**.
- [ ] M8.5 Each day: open **Unibox** (or Instantly’s inbox view) and **reply** to people who respond. Optional: add **LinkedIn** touches using the same prospects (**`BLINDSPOT-GUIDE.md`** multi-channel section).

---

**Checklist (tick in this file when done):**

- [ ] **W001+** — **[Wellspire LLC ladder](#wellspire-llc--multi-brand-ladder-before-cold-email)** at “good enough for cold email” (entity, EIN, bank path, Stripe KYC, real footer address)  
- [ ] **M000** — Resend **API** + **verified domain** + test send (**[M000 playbook](#m000--resend-api-key--verified-sending-domain--from-address)**)  
- [ ] **Stripe live** — **SL.1–SL.8** (**[Stripe live before M001](#stripe-live-mode-do-before-m001-cold-email-scale)**)  
- [ ] **M001** — Domains purchased; Namecheap (or registrar) Advanced DNS ready  
- [ ] **M002** — Google Workspace + inboxes live  
- [ ] **M003** — SPF + DKIM + DMARC on sending domains  
- [ ] **M004** — Instantly connected to inboxes  
- [ ] **M005** — Lead source (Snov etc.) + export / list workflow  
- [ ] **M006** — Google Sheet with **DemoURL** → GLP **`/intake?...&demo=1`**, shared  
- [ ] **M007** — Instantly campaign + sequence + compliance footer  
- [ ] **M008** — Launched + daily ops (Unibox / optional LinkedIn)  

**AUTO (agent, no Instantly login):** refine **`GLPCONVERT_COLD_EMAIL_POSITIONING.md`**, demo URL patterns, landing copy, tracking — on request or as **R*** tasks; **does not** replace **M001–M008** clicks.
