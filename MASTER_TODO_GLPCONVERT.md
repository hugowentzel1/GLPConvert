# GLPConvert · Master TODO

> **Single source of truth.** Unified roadmap for the GLPConvert revenue-conversion layer + white-label lease growth + cold outbound launch.

---

## 📑 Table of contents

1. [GTM channel split + canonical URLs](#-gtm--canonical-urls)
2. [Roadmap rounds (R / CE)](#-roadmap-rounds)
3. [Infrastructure lane (human, in order)](#-infra-lane)
4. [Operator playbook (U035–U040 click-by-click)](#-operator-playbook)
5. [Audit snapshot — current state](#-audit-snapshot)
6. [Unified chronological queue (Phase R / 0–10)](#-unified-queue)
7. [Wellspire LLC multi-brand ladder (W001+)](#-wellspire-ladder)
8. [📧 **COLD EMAIL SETUP** — every button to press, in order](#-cold-email-setup) (CE001 → CE010)
9. [💼 **LINKEDIN COLD DM SETUP** — every button to press, in order](#-linkedin-cold-dm-setup) (LI001 → LI009)
10. [🩺 **MAINTENANCE** — daily / weekly / monthly checklist + status pages](#-maintenance) (OPS-DAILY, OPS-WEEKLY, OPS-MONTHLY, OPS-PAGES)
11. Cost summary + sources cited + bottom-line opinion

---

## 📚 Reference docs

| Topic | File |
|---|---|
| Product strategy (11/10 positioning) | [`PRODUCT_STRATEGY_GLPCONVERT.md`](PRODUCT_STRATEGY_GLPCONVERT.md) |
| Demo strategy | [`DEMO_STRATEGY_GLPCONVERT.md`](DEMO_STRATEGY_GLPCONVERT.md) |
| Compliance | [`COMPLIANCE_NOTES_GLPCONVERT.md`](COMPLIANCE_NOTES_GLPCONVERT.md) |
| Spec ↔ code matrix | [`GLPCONVERT_IMPLEMENTATION_11_SPEC.md`](GLPCONVERT_IMPLEMENTATION_11_SPEC.md) |
| API inventory | [`GLPCONVERT_API_CONTRACTS.md`](GLPCONVERT_API_CONTRACTS.md) |
| Env (local + Vercel) | [`docs/ENV_VERCEL_AND_LOCAL.md`](docs/ENV_VERCEL_AND_LOCAL.md) |
| Canonical URL | [`docs/VERCEL_CANONICAL_URL.md`](docs/VERCEL_CANONICAL_URL.md) |
| API integrations | [`docs/GLPCONVERT_APIS_AND_INTEGRATIONS.md`](docs/GLPCONVERT_APIS_AND_INTEGRATIONS.md) |
| Sentry | [`docs/SENTRY_GLPCONVERT.md`](docs/SENTRY_GLPCONVERT.md) |
| Cold email positioning | [`GLPCONVERT_COLD_EMAIL_POSITIONING.md`](GLPCONVERT_COLD_EMAIL_POSITIONING.md) |
| Cold email playbook | [`GLPCONVERT_COLD_EMAIL_PLAYBOOK.md`](GLPCONVERT_COLD_EMAIL_PLAYBOOK.md) |
| Cold-email branding | [`docs/COLD-EMAIL-BRANDING-GUIDE.md`](docs/COLD-EMAIL-BRANDING-GUIDE.md) |
| Cold-email readiness | [`docs/COLD-EMAIL-READINESS-AUDIT.md`](docs/COLD-EMAIL-READINESS-AUDIT.md) |
| Outreach UX sources (Mar 2026) | [`docs/GLPCONVERT_OUTREACH_UX_SOURCES_MAR2026.md`](docs/GLPCONVERT_OUTREACH_UX_SOURCES_MAR2026.md) |
| White-label SaaS sources | [`docs/GLPCONVERT_WHITE_LABEL_SAAS_SOURCES.md`](docs/GLPCONVERT_WHITE_LABEL_SAAS_SOURCES.md) |
| Wellspire LLC multi-brand | [`docs/WELLSPIRE_LLC_MULTI_BRAND_SOURCES.md`](docs/WELLSPIRE_LLC_MULTI_BRAND_SOURCES.md) |

---

<a id="-gtm--canonical-urls"></a>

## 🎯 GTM channel split & canonical URLs

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

---

<a id="-roadmap-rounds"></a>

## 🗓️ Roadmap rounds (R / CE)

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
| **R044** | **Marketing nav + intake trust placement:** `/?demo=1` header slimmed (Intake demo + **More** dropdown + **Activate your intake**); paid marketing utility links in **Legal & help** `<details>`; nav subtitle **Branded preview** in demo; trust microline moved into **`GlpSimulationFunnel`** (removed `IntakeTrustRibbon`); hero lines shortened again | **Done** |
| **R045** | **Master CRO pass (partial):** Step 1 **Start your plan preview** + optional prefs in `<details>`; results: **chart first** + `data-results-summary` cards + trajectory **checkpoints only**; building copy; demo clinic bar **Activate for {clinic}** + **Copy demo link**; CTAs **Continue to readiness** / **Continue to save** / **Save and continue** / **Open scheduling**; success **Your next step is ready**; chart `prefers-reduced-motion`; Playwright updated | **Done** |
| **R046** | **Premium spacing + top chrome + optimistic viz:** 8px grid tokens in `glp-intake-ui`; slimmer demo/paid strip + hero without duplicate logo; funnel trust line simplified; stepper noise reduced; **upward journey momentum chart** (`GlpJourneyProgressChart`) replaces weight decline chart; owner panels shrunk; frame padding; secondary CTA when no booking **Get a scheduling link**; Playwright asserts journey label | **Done** |
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

---

<a id="-infra-lane"></a>

## 🛠️ You are here — human infra lane

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

---

## 📜 Operating rule

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

---

## 🛤️ Chronological runway — infrastructure (do in this order)

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

---

<a id="-operator-playbook"></a>

## ⚡ Operator playbook — what to click / run (full list)

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

---

<a id="-audit-snapshot"></a>

## 🔍 Audit snapshot (current state)

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

---

<a id="-unified-queue"></a>

## 📅 Unified chronological implementation queue

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

---

## 🚧 Needs human input (exact blockers only)

- **H1 — Git remote creation (`U035`)** — **done** · https://github.com/hugowentzel1/GLPConvert

- **H2 — Hosted infra (`U038`)**  
  **U035–U037 done.** **You are on U038** (Stripe). Follow **[U038 playbook](#u038--human--stripe--resend--dns)**; when Stripe env + webhook + test checkout are green, reply **`done`** for **U039**.  
- **H2b — Sentry (`U040`)** — Follow **[U040 — Sentry](#u040--human--sentry)** in the playbook; **agent** does not need your Sentry login.

- **H3 — Legal signoff (`U024`)**  
  Why blocked: attorney/counsel approval required for production claims and disclosures.  
  Next action: route final claims/copy/legal docs for counsel approval.

- **H4 — Entity formation (`W001+`)** — **[Wellspire LLC ladder](#wellspire-llc--multi-brand-ladder-before-cold-email)** before **M001** cold email; research pack **`docs/WELLSPIRE_LLC_MULTI_BRAND_SOURCES.md`**.

---

---

## 🎯 Current active step

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

---

<a id="-wellspire-ladder"></a>

## 🏛️ Wellspire LLC & multi-brand ladder (before cold email)

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

---

<a id="-marketing-m000-m008"></a>

## 📧 Legacy: M000–M008 cold-email setup (superseded — see Phase OUT below)

> ⚠️ **This section is the older/generic plan from before the Sunspire-infrastructure-reuse research.**
> **Use [Phase OUT](#-phase-out) instead** — it reuses every paid Sunspire subscription
> (Instantly, Clay, Make.com, Airtable, ZeroBounce, Google Workspace, Sales Navigator,
> Heyreach) so GLPConvert outbound launches at marginal cost (~$135-180/mo vs $700-900).
>
> M000–M008 below is kept for reference + because **M000 (Resend transactional API)** is
> still required for product email regardless of the cold-outbound plan.

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


<a id="-cold-email-setup"></a>

# 📧 **COLD EMAIL SETUP** — every button to press, in order

> **Goal:** ship 50,000+ personalized cold emails per month into GLP-1 / weight-loss clinic inboxes, each carrying a `https://glpconvert.com/intake?demo=1&handle=…&company=…&brand=…&brand2=…&logo=…&utm_*=…` per-prospect demo link. Drives Stripe self-serve activation; **no meeting CTA**, single CTA-click activation.
>
> **Round 33 (May 2026) — Wellspire-LLC-first canonical setup.** Wellspire LLC is the parent entity for GLPConvert (and any future SaaS under the same LLC). GLPConvert outreach goes out from **Wellspire-owned** sending domains under the **Wellspire Google Workspace** (CE000.C). All SaaS vendors are signed up FRESH under Wellspire LLC's billing card (CE000.D). **Sunspire decommissioning is now its own self-contained section at the very bottom of this file (🗑️ APPENDIX Z) — do that AFTER you finish CE000-CE010 + LI001-LI009 + maintenance, not before, so the new Wellspire stack is fully running before you pull the plug on the old one.**
>
> **Round-33 best-practice deltas vs earlier rounds:** (1) Smartlead Pro is now the recommended cold-email tool over Instantly for the 50k+/mo volume target (see CE005 + Executive Decision Summary); (2) per-inbox volume cap revised to 25/day max per Gmail's late-2025 + Mar-2026 classifier (16-20 inboxes only ships ~10k/mo, so Phase 1 → Phase 2 → Phase 3 scale-up to 40-50 inboxes is now explicit in CE010); (3) **SUPERSEDED by the 2026-05-18 final audit** — LinkedIn tool is now **Botdog $35/mo** (Heyreach is agency-priced $999+); see the LinkedIn section + locked-stack banner; (4) the canonical individualized demo URL spec is in **CE-DEMO-URL** below — that's your free Mutiny/Userled equivalent.
>
> Day 0 → stand up Wellspire infra (CE000 below) + buy GLPConvert sending domains. Day 1 → DNS + Workspace setup. Day 22 → first emails go out. Day 90+ → steady state at 50,000+/mo. Sources cited inline + summarized at bottom. **Sunspire decommissioning steps are isolated in 🗑️ APPENDIX Z at the very bottom of this file — run that after the Wellspire stack is healthy.**

---

## ✅ MASTER PROGRESS TRACKER — check off as you go

> Tick each box below as you complete its subsection. This is your single-page status board — at any moment you should be able to look at this list and know exactly which phase you're in. Each major task `CE0xx` / `LI0xx` / `Z0xx` has its own detailed sub-checklist further down the page; this tracker rolls them up.

**🏗️ PHASE 0 — Wellspire LLC foundation (Day 0, ~3 hrs of clicks)**
- [x] CE000.PRE — Wellspire parent-ops Gmail (`Wellspirellc@gmail.com`) ✅ done 2026-05-09
- [x] CE000.A — Pick Wellspire apex domain → **wellspirellc.com** ✅ done 2026-05-10
- [x] CE000.B — Open Wellspire Namecheap account + buy apex (`wellspirellc.com`, ~$11) ✅ done 2026-05-10
- [x] CE000.C — Open Wellspire Google Workspace + admin user + 2FA ✅ all subitems (C1-C16) done 2026-05-11
  - **YOU ARE HERE banner (REVISED 2026-05-18 — STACK LOCKED):** Phase 1A FULLY DONE — SPF+DKIM+DMARC+TLS-RPT live on all 5 sending domains, DKIM activated in Workspace Admin, `dmarc@`+`tls-rpt@` aliases created, **CE3.7b-verify CLOSED at 10/10 mail-tester**. MTA-STS deferred to Phase 3; DMARC `p=quarantine` upgrade deferred 7-14 days into warmup.
  - **🔒 TOOL STACK LOCKED 2026-05-18 (after full May-2026 audit, ~$848 for the 6-month US campaign):**
    - **Smartlead Pro** (email send/warmup/sequencing) — annual billing, ~$470 / 6 mo
    - **Botdog Starter** (LinkedIn automation, 1 account) — $35/mo, ~$210 / 6 mo
    - **MailReach** (deliverability monitoring) — $9.60/mo, ~$60 / 6 mo
    - **MillionVerifier** (email verification) — 50k-credit pack, **$97 ONE-TIME, never expires — covers the entire ~43k US+international roadmap**
    - **Apollo FREE** + free clinic directories (GLP1Clinics.org, NPI Registry, AmSpa) — $0
    - **Redirect domain** (Sunspire-style URL project) — ~$11 one-time
    - ❌ REJECTED by the audit: Heyreach (agency-priced $999+), Sales Navigator ($99/mo, unneeded), CarePrecise ($599), Findymail ($99/mo), Clay ($349/mo), Lavender ($29/mo), MillionVerifier subscription (PAYG contingency only). Chrome-extension LinkedIn tools (Waalaxy/Linked Helper) rejected — ~23% ban rate.
  - **NEXT ACTION = CE005** — sign up Smartlead Pro (ANNUAL billing), connect 15 inboxes, start the 35-day warmup. Critical-path longest pole; every hour delay = 1 hour added to first-send. **In parallel during the warmup wait (Days 7-35):** CE006 (free directories + Apollo Free list build), CE007 (MailReach setup), CE008 (compliance + GLP-1 subject-line rule), LI001-LI002 (Botdog signup + LinkedIn account warmup), and CE-DEMO-URL.IMPL (clone the Sunspire-style redirect project — short `glpconvert.com/o/{slug}` URLs).
- [ ] CE000.D — Wellspire LLC business card on every SaaS vendor (waits on LLC formation)

**🛠️ PHASE 1A — GLPConvert sending infrastructure (Days 0-7)** ✅ FULLY DONE 2026-05-18
- [x] CE001 — Buy 5 GLPConvert sending domains ✅
- [x] CE002 — Add 5 sending domains as Workspace secondaries ✅ (also wrote SPF + DKIM + DMARC `p=none` + TLS-RPT records during this step; confirmed via `dig` audit 2026-05-18)
- [x] CE003 — Create 15 cold-email inboxes (3 per domain × 5 domains) ✅ (incl. bare display names + SKIP signature + SKIP first sign-in + SKIP photos + 72h aging cleared)
- [x] CE3.7b-verify — Test send to mail-tester scored **10/10** ✅ 2026-05-18 from `daniel@getglpconvert.com`; SPF/DKIM/DMARC all PASS; sole non-green = "no List-Unsubscribe header" (CE008 will add)
- [x] CE004 — DNS auth ✅ done-as-far-as-go-live-needs 2026-05-18: SPF + DKIM (activated in Workspace Admin for all 5) + DMARC `p=none` + TLS-RPT all live. `dmarc@` + `tls-rpt@` aliases created on `admin@wellspirellc.com`. **DEFERRED:** MTA-STS (hardening, Phase 3); DMARC `p=quarantine` upgrade (7-14 days into warmup, see CE8.5.21); Postmaster v2 / SNDS / Yahoo Sender Hub enrollment (during warmup, see CE10.x)

**🛠️ PHASE 1B — Cold-email tool stack (Days 7-14)** — REVISED 2026-05-18: stack locked
- [ ] CE005 — Sign up for **Smartlead Pro (annual)** + connect 15 inboxes + start **35-day warmup** ← **YOU ARE HERE — next action** (critical path — longest pole)
- [ ] CE006 — Build the clinic list: free directories (GLP1Clinics + NPI + AmSpa) + **Apollo FREE** enrichment
- [ ] CE007 — **MailReach** deliverability monitoring setup
- [ ] CE008 — Compliance (GLP-1 subject-line rule, privacy page, CAN-SPAM footer, suppression list)
- [ ] **CE-DEMO-URL.IMPL** — Clone the Sunspire-style redirect project for short `glpconvert.com/o/{slug}` URLs. Parallel to warmup; live before CE009 email copy.

**💼 PHASE 1C — LinkedIn parallel track (Days 7-35, ~4 hrs hands-on + 21-28d warmup)** — REVISED 2026-05-17: 1 account (was 3)
- [ ] LI001 — Sign up for **Botdog Starter $35/mo** (LinkedIn automation, 1 account). NO Sales Navigator, NO Heyreach.
- [ ] LI002 — Audit + optimize profile + manually warm **1 real LinkedIn account, 14-21 days**
- [ ] LI003 — Connect the account to Botdog (auto 7-day ramp)
- [ ] LI004 — Build LinkedIn list from the CE006 clinic list (top ~2,500-3,500 prospects) — free Apollo Chrome extension finds the profiles
- [ ] LI005 — Engagement-led pre-touch (comment on top-300 prospects' posts before connecting — ~300% reply lift)
- [ ] LI006 — Build the Botdog 4-step sequence (no-note connect → warmup DM → value+link DM → soft close)

**⏳ PHASE 1D — WAIT (Days 14-42)**
- [ ] Smartlead 35-day warmup runs in background. LinkedIn account warmup runs in parallel. Use this time to QA Stripe checkout + write/A-B-test cold-email + LinkedIn copy on yourself.

**🚀 PHASE 2 — Pilot launch (Day 45, ~9k emails/mo + 320 LinkedIn/mo)** — REVISED 2026-05-17 from Day 22; +15d shift to match 35d warmup; LinkedIn 1.2k→320 due to 1-account decision
- [ ] CE009 — Build the email sequence (**4 steps over 14 days** — REVISED from 5 steps; prospect-pain-first opener; new sign-off format)
- [ ] CE9.10 — **PRE-LAUNCH GATE (Day 44)** — Smartlead SmartDelivery + GlockApps validation. Must pass 4 criteria (inbox placement ≥80%, display name renders ≥90%, auth 100%, spam score ≥8/10) before CE010.1. ~$17-34 one-time GlockApps cost. (NEW 2026-05-18)
- [ ] CE010.1-10.3 — Activate Smartlead campaign at 20/inbox/day (Days 45-60), ramp to 30/day (Days 53-60), then 38/day (Day 60+)
- [ ] LI007 — Activate Botdog campaign at **20-25 connection requests/day** (~100/week; Botdog hard-caps this)

**📈 PHASE 2-3 — Scale (Days 60-105 pilot, gated on SNDS clean for prior 14 days; Day 105+ Phase 3 expansion)** — REVISED 2026-05-17: now relies on SNDS as primary daily reputation tool since Postmaster v1 was retired Sept 30, 2025
- [ ] CE10.4-10.6 — Run 9k/mo full pilot. A/B test prospect-pain opener variants. Track to Stripe.
- [ ] CE011 — Phase 3 expansion to 22 domains / 66 inboxes / ~50k/mo (Day 105+, IF pilot passed gate). **Use 2 inboxes/domain in Phase 3** (was 3/domain in pilot; 2026 audit consensus = 2/domain better reputation isolation per Litemail + ScaledMail 2026).
- [ ] CE10.10 — Steady state hit ✅

**🩺 ALWAYS-ON — Maintenance**
- [ ] OPS-DAILY (10 min/day): reply triage + `/healthz` + `/status`
- [ ] OPS-WEEKLY (30 min/Mon): **SNDS + Postmaster v2 + Yahoo Sender Hub** spam-rate per domain + **MailReach weekly spam test** + Botdog account health + bounce/reply rates + DMARC report digest
- [ ] OPS-MONTHLY (1 hr/first Mon): inbox rotation, list refresh, MillionVerifier next batch ($59/mo recurring)

**🗑️ APPENDIX Z — Sunspire decommissioning (anytime Day 22-90+, AFTER Wellspire stack is healthy)**
- [ ] Z001 — Sunspire Namecheap auto-renew OFF
- [ ] Z002 — Sunspire Workspace canceled + final-message forwarding to Wellspire ops
- [ ] Z003 — Sunspire Stripe / Resend / Vercel / Sentry / Supabase closed/deleted
- [ ] Z004 — Local sunspire-clean/ archived to backup drive
- [ ] Z005 — Final verification (Day 90+) — no Sunspire charges anywhere

---

## 🎯 EXECUTIVE DECISION SUMMARY (May 2026 — re-verified each round)

> Read this once before clicking any button. Every choice below was re-checked against May 2026 sources (links at the bottom of this section); detailed buttons are in CE000–CE010 / LI001–LI009.

**The cold-email stack — final picks for getting 50k+/mo personalized emails into GLP-1 clinic inboxes at the lowest cost-per-pipeline-dollar:**

| Slot | Tool | Plan | Monthly | Why this one (May 2026 sources) |
|---|---|---|---|---|
| **Sending engine** | **Smartlead** | Pro | **$94/mo** | Unlimited inboxes + unlimited warmup at all plans. Wins on inbox-placement at high-volume domain rotation per the [Smartlead vs Instantly 2026 data study](https://sparkle.io/blog/smartlead-vs-instantly/). At 50k+/mo Instantly Hypergrowth ($77.60) caps you at 75k/mo and bills per 5k contact-block over that — Smartlead's flat $94 covers any volume. Keep Instantly Growth ($47/mo) as backup. |
| **Lead source + enrichment** | **Apollo FREE** + free clinic directories | **$0** | **$0** | FINAL AUDIT 2026-05-18: Apollo Free = 10k credits/mo + unlimited on verified corp domains, covers the whole list. Seed from GLP1Clinics.org + NPI Registry + AmSpa (all free). No paid data tool needed at pilot scale. |
| **Bounce verification** | **Apollo "Verified" filter** (+ MillionVerifier PAYG contingency) | **$0** | **$0** | Apollo's Verified filter is the primary screen. Add a one-time MillionVerifier PAYG pass ($37/10k) ONLY if early-send bounce rate exceeds 2% — gated on real data, not pre-bought. |
| **Deliverability monitoring** | **MailReach** Spam Test | $9.60/mo | **$9.60/mo** | Independent inbox-placement check (Smartlead's own metrics are occasionally unreliable). 6× cheaper than GlockApps for the same seed-test job. |
| **LinkedIn outreach** | **Botdog Starter** | $35/mo, 1 account | **$35/mo** | FINAL AUDIT 2026-05-18: cheapest tool in the genuinely-safe tier (cloud + dedicated IP + hard-coded limits). Heyreach is agency-priced ($999+); Chrome-extension tools (Waalaxy/Linked Helper) ~23% ban rate. |
| **LinkedIn data** | ~~Sales Navigator~~ — **SKIPPED** | — | **$0** | FINAL AUDIT 2026-05-18: Sales Nav does NOT raise connection-request limits; Apollo's free Chrome extension covers LinkedIn lead-finding. Saves $99/mo. |
| **Automation glue** | ~~Make.com~~ — **SKIPPED** | — | **$0** | Apollo has native Smartlead push; no Zapier-style glue needed for pilot. |
| **Lead CRM** | **Airtable** Free → Team | **$0–$20/mo** | Free tier handles 1k records; bump to Team ($20) at scale. |
| **Sending domains** | **5 GLPConvert-themed** at Namecheap (pilot) | $55/yr ÷ 12 = **~$5/mo** | 5 sending domains × 3 inboxes/domain = 15 inboxes for pilot. Phase 3 expansion to 22 domains × 2 inboxes (REVISED per 2026 audit: 2/domain better reputation isolation than 3/domain) = 44 inboxes for ~50k/mo target. |
| **MTA-STS hosting** | **Cloudflare Pages free** | $0 | **$0** | NEW 2026-05-17: host static `mta-sts.<domain>/.well-known/mta-sts.txt` policy file per domain (table-stakes 2026 auth signal). |
| **Workspace inboxes** | **Wellspire Google Workspace Business Starter** | $8.40/inbox/mo | **$134/mo at 15 inboxes + admin; $378/mo at 44 inboxes Phase 3** | One Workspace can host 5 sending domains as secondaries for pilot; split to 3 Workspaces at Phase 3 per Litemail 2026 (~20-25 inbox per-Workspace cluster ceiling). |
| **App-side transactional email** | **Resend** | Free → $20/mo Pro | **$0–20/mo** | For lead-notify / welcome / magic-link emails from `notify@mail.glpconvert.com`. NOT for cold outreach. |
| **Pre-launch validation gate** | **Smartlead SmartDelivery** (free, included) + **GlockApps credit pack** (one-time) | $17-34 one-time | **$0/mo + $17-34 one-time at Day 44** | NEW 2026-05-18: CE9.10 pre-launch gate. SmartDelivery tests inbox placement via your existing Smartlead Pro plan; GlockApps $16.99 (3-test) or $33.99 (5-test) credit pack confirms display-name renders correctly per ESP. One-time spend at Day 44; not recurring. |

**🔒 LOCKED TOOL COST 2026-05-18 — ~$848 for the 6-month US campaign:** Smartlead Pro $79/mo (annual, ~$470) + Botdog $35/mo (~$210) + MailReach $9.60/mo (~$60) + **MillionVerifier 50k-credit pack $97 one-time** (covers the full ~43k US+international roadmap — never re-buy) + Apollo Free $0 + free clinic directories $0 + redirect domain $11 one-time. Workspace inboxes (15 × $8.40 = $126/mo) are existing infrastructure, billed separately. **International expansion (CE-EXPAND) adds only ~$125/mo per extra campaign month — no new tools, verification already paid.** The May 2026 audit cut Heyreach, Sales Navigator, Clay, CarePrecise, Findymail, and the MillionVerifier *subscription* (PAYG pack instead).

**Individualized demo URL — DO NOT pay for Mutiny / Userled / Tofu microsites.** GLPConvert's existing intake-page renderer accepts `?demo=1&handle={slug}&company={Url-encoded}&brand={hex-no-#}&brand2={hex-no-#}&logo={Url-encoded URL}&utm_*` and produces a per-prospect branded landing for free. This replaces the $5–10k/mo ABM-LP tier ([Tofu vs Mutiny 2026](https://www.tofuhq.com/post/tofu-vs-mutiny-for-abm-campaigns), [Userled vs Mutiny 2026](https://www.userled.io/userled-vs-mutiny)). See **CE-DEMO-URL** below for the exact URL format + how to build it in Clay.

**Per-inbox sending volume — 2026 reality (REVISED 2026-05-17 per deeper audit):**
- Gmail's late-2025 + Mar-2026 sender classifier safe band: **30-50/day** for fully warmed inboxes with clean reputation per [Litemail 2026 inbox limits](https://litemail.ai/blog/cold-email-inbox-limit-per-day-google-vs-microsoft-2026). Stay at <35/day for indefinite High reputation; 35-50/day OK only IF bounce <2% and complaint <0.05%.
- **Pilot Phase 1 (Days 45–60):** 15 inboxes × 20/day × 16 send-days (Tue-Thu × 4 wks + flex) = **~4,800/mo soft launch**.
- **Pilot Phase 1B (Days 60-105):** ramp to 38/day per inbox → **~9,120/mo full pilot throughput**.
- **Phase 3 (Day 105+ ONLY IF pilot passed gate):** scale to 22 domains × 2 inboxes/domain = 44 inboxes × 38/day × 22 days = **~37,000/mo**, pushing toward 50k as reputation matures with the reserve capacity in CE011.
- **DO NOT push to 50/day per inbox** unless SNDS shows clean for 30 consecutive days straight; even then it's optional and only on the cleanest 20 inboxes.

**Channel mix at pilot steady-state (Day 105):**
- **~9,000 cold emails/mo** (Smartlead 15 inboxes) → at 2% reply × 30% interested × 30% click-to-Stripe = **~6-16 paying clinics/mo**.
- **~400 LinkedIn DMs/mo** (Botdog 1 account × ~100 connects/wk) → primes the top prospects; multi-channel lifts those prospects' email reply rate ~2.7×. LinkedIn's value is the priming effect, not standalone closes.
- **Combined pilot target: 7-17 clinic activations/mo at $99/mo + $399 setup = ~$700-1,700 MRR + $2,800-6,800 one-time setup revenue by Day 105.**

**What NOT to do (May 2026 sources, REVISED 2026-05-17):**
- ❌ Send from your apex `glpconvert.com` (burns marketing reputation; per [LeadHaste 2026 Cold Email Domain Setup Guide](https://leadhaste.com/blog/cold-email-domain-setup-guide-2026)).
- ❌ Skip the **35-day warmup** (REVISED from 21-day) per [LeadHaste 2026](https://leadhaste.com/blog/warm-up-email-domains) + [MailReach 2026](https://www.mailreach.co/blog/gmail-warmup) + [Litemail 2026](https://litemail.ai/blog/email-warmup-new-domain-complete-timeline-2026).
- ❌ Skip MillionVerifier re-verification of Apollo Verified leads (Apollo Verified is now 7-18% bounce in 2026 per [Prospeo 2026](https://prospeo.io/s/apollo-email-verification-accuracy)).
- ❌ Use Chrome-extension LinkedIn tools (Dux-Soup, LinkedHelper) — high ban rate per [SyncGTM 2026 ranking](https://syncgtm.com/blog/best-linkedin-outreach-automation-tools).
- ❌ Use Mutiny / Userled / Tofu for personalized landings — GLPConvert's URL params already do this for $0 ([Tofu vs Mutiny 2026](https://www.tofuhq.com/post/tofu-vs-mutiny-for-abm-campaigns)).
- ❌ Send role-account From addresses (`hello@`, `team@`) — Gmail Mar 2026 classifier downgrades them ~30% per [Apollo State of Outbound Q1 2026](https://apollo.io/research).
- ❌ Add tracking pixels or shortened URLs — both auto-flagged by Gmail's 2025 classifier per [Smartlead 2026 deliverability guide](https://www.smartlead.ai/blog).

**Lessons applied to the GLPConvert individualized-demo URL design (May 2026):**
- Use **Brandfetch** (primary) + **Logo.dev** (fallback) for logos. Clearbit's Logo API shut down in 2024 after HubSpot acquisition — DO NOT use any tool that points at `logo.clearbit.com`. Both Brandfetch and Logo.dev are stable in 2026.
- Use **direct `/intake?demo=1&handle=…&company=…&brand=…&logo=…&utm_*=…`** instead of a slug → redirect pattern. One less redirect (faster first-paint, no UTM-loss on the 302).
- Use **one Wellspire Workspace hosting 4 sending domains as secondaries** instead of one Workspace per sending domain — lower per-domain spam blast radius if any single domain gets flagged (Postmaster reputation is per-domain, not per-Workspace).
- The personalized-demo-URL pattern itself is preserved end-to-end: `?demo=1` flag + `?company=` + `?logo=` + `?brand=` are all rendered by `components/intake/IntakePageHeader.tsx` and `components/HeroBrand.tsx`.

---

<a id="-ce-demo-url"></a>

## 🔗 CE-DEMO-URL — canonical individualized demo URL spec (this is the link in every cold email + LinkedIn DM)

> **REVISED 2026-05-18 — switched from query-string to path-based per deeper May 2026 source audit.** Original query-string format kept as the LONG-FORM FALLBACK for prospects where Brandfetch/Clearbit returns no logo OR you need to override per-prospect color. The new short-form is the default for ~80% of sends.
>
> Every cold-email and LinkedIn DM links to a **single per-prospect URL** that GLPConvert's intake page renders into a branded landing with the recipient's company name, logo, and brand color. This is the conversion engine. Get it exactly right.

**Canonical SHORT-FORM (production, default — use for ~80% of sends):**

```
https://glpconvert.com/o/{slug}
```

**Real example:**

```
https://glpconvert.com/o/acmeclinic
```

(32 chars total. Server derives company name from slug, fetches logo via Clearbit (`{slug}.com` → fallback to first-word lookup), computes deterministic brand color from `getBrandTheme()`, then renders the same personalized demo as the query-string form.)

**Why path-based beats query-string in May 2026 (sources):**
- [Unify GTM — Cold Email in 2026 (May 3 2026)](https://www.unifygtm.com/explore/cold-email-2026-domain-setup-deliverability-sequences): "branded path-based URLs lift CTR and inbox placement vs *.vercel.app or query-string-heavy URLs"
- [Mailpool — Cold Email Attachments vs Links 2026](https://www.mailpool.ai/blog/cold-email-attachments-vs-links-whats-safe-in-2026-and-whats-not): "Visible URL length under 40 chars; long query strings match phishing-URL signature"
- [Suped 2026](https://www.suped.com/knowledge/email-deliverability/sender-reputation/are-bitly-links-bad-for-email-deliverability) + [Cyberpress 2026](https://www.cyberpress.com): Vercel platform subdomains now actively abused for phishing → recipient + filter penalty on `*.vercel.app`
- [Hyperise 2026](https://hyperise.com/blog/how-to-personalize-cold-emails-with-dynamic-images-that-actually-get-replies): personalized destination (not visible URL) drove 21% reply rate (~100% over control). Personalize behind the URL, don't expose params.
- [Apollo State of Outbound Q1 2026](https://apollo.io/research): one-link plain-text emails out-reply HTML-with-button by 2.3× for B2B clinic-owner ICP
- [Puzzle Inbox Apr 24 2026](https://puzzleinbox.com/blog/cold-email-html-vs-plain-text/): plain text 4.1% reply vs HTML 1.8%

**Long-form FALLBACK (production, override path — use when Brandfetch returns no logo OR you need to override color per-prospect):**

```
https://glpconvert.com/intake?demo=1&handle={slug}&company={UrlEncoded company}&brand={hex-no-#}&brand2={hex-no-#}&logo={UrlEncoded logo URL}&utm_source=cold-email&utm_medium=email&utm_campaign={campaign-slug}&utm_content={first-name-lower}
```

**Real example fallback URL:**

```
https://glpconvert.com/intake?demo=1&handle=acme-clinic&company=Acme+Weight+Clinic&brand=059669&brand2=064e3b&logo=https%3A%2F%2Flogo.clearbit.com%2Facme.com&utm_source=cold-email&utm_campaign=q2-2026&utm_content=jane
```

**Param-by-param spec:**

| Param | Required | Format | Notes |
|---|---|---|---|
| `demo=1` | ✅ | exact `=1` | Flips intake page into demo mode (per-prospect hero, top-bar countdown, "Launch Your Branded Version Now" CTA → Stripe). Without `demo=1`, the page renders the generic paid-flow header. |
| `handle` | ✅ | lowercase slug, hyphens only | Prospect's clinic slug (e.g. `acme-clinic`). Used as the dashboard tenant id post-checkout (`/c/{handle}`). MUST match Stripe `success_url` lowercasing rules: `(company \|\| '').toLowerCase().replace(/[^a-z0-9]/g, '-')`. |
| `company` | ✅ | URL-encoded, preserved-case | Display name shown in hero + Stripe payload. `Acme Weight Clinic` → `Acme+Weight+Clinic` or `Acme%20Weight%20Clinic`. |
| `brand` | ✅ | 6-char hex, **no leading `#`** | Primary brand color. Cascades into CTA bg, accent strokes, focus rings, chart line, dot fill. `#059669` → `059669`. |
| `brand2` | optional | 6-char hex, no `#` | Secondary brand color (used on gradient halos, optional accents). If omitted, derived from `brand`. |
| `logo` | optional | URL-encoded HTTP(S) URL | Tenant logo. If present and reachable, replaces the monogram avatar in the hero. Defaults to a 2-letter monogram on the brand color if missing. Proxied via `/api/logo-proxy` to bypass CORS/403. |
| `utm_source` | strongly rec. | `cold-email` or `linkedin` | Channel attribution. Tracked in Stripe metadata + Supabase lead row. |
| `utm_medium` | strongly rec. | `email` or `dm` | Channel sub-class. |
| `utm_campaign` | strongly rec. | slug | E.g. `q2-2026-glp-cold-email`. |
| `utm_content` | strongly rec. | first-name lower | Per-prospect attribution; lets you A/B reply rate by sender or by template. |

**Where this URL goes:**
- **Cold email body:** ONE link per email (Smartlead 2026 deliverability rule — multiple links → spam classifier).
- **LinkedIn DM body:** ONE link per DM (same rule, plus LinkedIn 2026 abuse classifier).
- **Each prospect gets a UNIQUE URL** because the params are personalized per row. Same URL = same prospect = same landing.

**How to build it in Clay (CE006/LI005 formula) — SHORT-FORM DEFAULT:**

```
"https://glpconvert.com/o/" + lower(replace({{company_name}}, /[^A-Za-z0-9]/, ""))
```

(Note: short-form slug strips ALL non-alphanumeric, including hyphens — `Acme Weight Clinic` → `acmeweightclinic` not `acme-weight-clinic`. Reason: shorter URL + path-renderer treats hyphens as word separators when deriving company name back, so removing them lets the server's name-derivation logic correctly capitalize multi-word company names.)

**For LONG-FORM FALLBACK (Brandfetch miss OR override case) — use this Clay formula instead:**

```
"https://glpconvert.com/intake?demo=1" +
"&handle=" + lower(replace({{company_name}}, /[^A-Za-z0-9]/, "-")) +
"&company=" + encodeURI({{company_name}}) +
"&brand=" + replace({{brand_hex}}, "#", "") +
"&brand2=" + replace({{brand_secondary_hex}} || {{brand_hex}}, "#", "") +
"&logo=" + encodeURI({{logo_url}}) +
"&utm_source=cold-email" +
"&utm_medium=email" +
"&utm_campaign=q2-2026-glp-cold-email" +
"&utm_content=" + lower({{first_name}})
```

**When to use which (Clay conditional column):**
- IF `{{brandfetch_logo_url}}` IS NOT NULL AND `{{brandfetch_brand_color}}` IS NOT NULL → use SHORT-FORM (server will re-fetch same logo via Clearbit, deterministic color matches)
- ELSE → use LONG-FORM with explicit override params

(For LinkedIn: change `utm_source=linkedin` and `utm_medium=dm` on the long-form. Short-form has no UTM — attribution captured server-side via first-party event keyed on slug + referrer header.)

**Test your generated URL before launching:** open it in a private window. You should see (a) prospect's logo + monogram avatar in the hero, (b) hero text dyed in the brand color, (c) "Acme Clinic — turn GLP-1 clicks into booked consults." (round-33 home H1 wording — not the long-form intake hero — when you land at `/?demo=1&...`), (d) the "Launch Your Branded Version Now" CTA wired to Stripe. If any of these don't render, the param spec above is the contract — check that Clay isn't double-encoding or stripping the `=` sign.

**Why this is a 1:1 ABM landing equivalent without paying Mutiny/Userled $5k+/mo:** the rendered page changes its hero monogram, brand color, headline, and CTA all from URL params. Mutiny/Userled charge for the ability to do exactly this (per [Tofu vs Mutiny 2026](https://www.tofuhq.com/post/tofu-vs-mutiny-for-abm-campaigns)). You already have the renderer; the only thing the cold-email tool has to do is build the URL string per row. ([Userled vs Mutiny 2026](https://www.userled.io/userled-vs-mutiny) confirms this URL-param approach as the equivalent pattern.)

---

## 🛠️ CE-DEMO-URL.IMPL — Implementation checklist (do during Smartlead warmup wait, Days 7-35; live before CE009 email copy on Day 38)

> **REVISED 2026-05-18 — use the Sunspire-style redirect project, NOT a route-handler rewrite.** You already have a working example of this exact pattern at `~/Desktop/sunspire-outreach-redirects` — a tiny Vercel project whose entire job is a 9-line `vercel.json`. Clone it. No code changes to the main GLPConvert app. ~30 min total. This is parallel-to-warmup work; it does NOT block the 35-day warmup clock.

**A) Register the redirect domain (~10 min, browser):**

- [ ] CE-DEMO-URL.IMPL.1 **Register `glpconvertdemo.com`** at Namecheap under the Wellspire LLC account (the one from CE000.B + CE001). Search → `glpconvertdemo.com` → Add to Cart → 1 yr → WhoisGuard ON → **uncheck the PremiumDNS + PositiveSSL upsells** → pay → ~$11. (Use a separate domain from the apex so the redirect's reputation never touches the marketing site.)

**B) Clone + deploy the redirect project (~15 min):**

- [ ] CE-DEMO-URL.IMPL.2 Copy the existing `~/Desktop/sunspire-outreach-redirects` folder → rename to `glpconvert-outreach-redirects`.
- [ ] CE-DEMO-URL.IMPL.3 Edit its `vercel.json` — change the `destination` URL to point at the live GLPConvert app. Final file:
   ```json
   {
     "redirects": [{
       "source": "/:slug*",
       "destination": "https://glp-convert.vercel.app/?demo=1&company=:slug&utm_source=cold&utm_medium=email&c=:slug",
       "permanent": false
     }]
   }
   ```
- [ ] CE-DEMO-URL.IMPL.4 Deploy it as a NEW Vercel project (vercel.com → Add New → Project → import the folder, or `vercel` CLI). It deploys in ~1 min — it's just a config file.
- [ ] CE-DEMO-URL.IMPL.5 In that Vercel project → **Settings → Domains → Add** → `glpconvertdemo.com`. Vercel shows the DNS records to add → add them in Namecheap → Advanced DNS for `glpconvertdemo.com`. SSL auto-provisions in ~5-10 min.
- [ ] CE-DEMO-URL.IMPL.6 **Test:** open `https://glpconvertdemo.com/acmeclinic` in a private window → it should redirect to the GLPConvert demo with `company=acmeclinic` applied (logo + brand color render from the existing `?company=` handling — already built into the app).

**C) Wire it into the campaigns (~5 min):**

- [ ] CE-DEMO-URL.IMPL.7 In Smartlead → Campaign → **Custom Variables** → set `demo_link` = `https://glpconvertdemo.com/{{company_name|slugify}}`. In Botdog, use the same URL pattern for `{{demo_link}}` with `utm_source=linkedin` if you want channel attribution.
- [ ] CE-DEMO-URL.IMPL.8 **Spot-check 5 prospects** in Smartlead's campaign preview — open each rendered `{{demo_link}}` in a private window, confirm the demo loads with the clinic's name/logo/color and the checkout CTA is wired.
- [ ] CE-DEMO-URL.IMPL.9 **Mail-tester re-validation** — send one test from `daniel@getglpconvert.com` to a fresh mail-tester address using the new short-form URL. Target ≥9.5/10.

> **Optional polish (skip for pilot, revisit Phase 3):** per-slug Open Graph preview images for Slack/iMessage/LinkedIn unfurls. Nice-to-have, not required — the redirect + existing `?company=` personalization is the whole conversion mechanism.

**D) Decommission deferred:** the existing `/?demo=1&company=...` flow stays in place permanently — it's the backward-compat path for any in-flight URLs and the long-form fallback. No code to delete.

**Why this slot in the timeline (not sooner, not later):**
- **Not sooner:** CE005 (Smartlead signup + warmup start) is the longest pole (35 days). Doing this BEFORE starting warmup would burn ~2 hours that could be the difference between launching Day 45 vs Day 47.
- **Not later:** CE009 email copy on Day 38 references the URL format. If this isn't done by Day 38, you're either writing copy that references a URL pattern that doesn't yet work, OR you delay launch.

---

### **CE000.PRE — Wellspirellc@gmail.com parent-ops Gmail** (15 min, Day 0 — do this FIRST)

> **You are using `Wellspirellc@gmail.com` as the parent-company ops Gmail for Wellspire LLC.** Wellspire LLC is the parent of GLPConvert (and any future SaaS you build under the same LLC). This Gmail is the registration email for every vendor account (Namecheap, Google Workspace, Stripe, Resend, Vercel, Sentry, Supabase, Instantly, Heyreach, Clay, Make.com, Airtable, ZeroBounce, LinkedIn Sales Nav).
>
> **Why a dedicated Gmail (not your personal address):** clean separation between personal and Wellspire-LLC vendor accounts; recovery + 2FA centralized in one inbox; transferable ownership when Wellspire Workspace goes live (admin user `hugo@wellspire.com` later receives forwards from `Wellspirellc@gmail.com`). Stripe Atlas "Operating multiple SaaS under one LLC" (Mar 2026) §3.2 + Indie Hackers Apr 2026 podcast #487 both recommend a single transitional Gmail for entity-formation vendor signups.

- [x] CE000.PRE1 If `Wellspirellc@gmail.com` does NOT exist yet: open a private/incognito window → **https://accounts.google.com/signup**. **If Google shows a "Choose the email that is best for your business" comparison page with two cards** (Workspace on the left, Gmail on the right): click **"Get a Gmail address"** (the RIGHT card, free). Do NOT click "Try Google Workspace" — that's CE000.C, you do that later. → Fill: First name `Wellspire`, Last name `LLC` → username `Wellspirellc` → `@gmail.com` → next. ✅
- [x] CE000.PRE2 Password: 18+ chars, generate via 1Password / Bitwarden. Save to vault under **"Wellspire LLC · parent-ops Gmail"**. ✅
- [ ] CE000.PRE3 Add a recovery phone (your real number) AND a recovery email (your personal address). Required for account-recovery during the high-signup-volume next 24h. ⚠️ **Verify this is set on your Gmail account: Manage your Google Account → Security → Recovery options.**
- [x] CE000.PRE4 Skip "Smart features and personalization" prompts. ✅ (assumed during signup)
- [ ] CE000.PRE5 Inside Gmail → **Account → Security → 2-Step Verification → Get started → Add phone**. Then add Google Authenticator as backup. Save 8 backup codes to vault. ⚠️ **Do this NOW if not done — protects every vendor account that uses this email.**
- [ ] CE000.PRE6 Inside Gmail → **Settings (gear) → See all settings → Forwarding and POP/IMAP → Forwarding** — leave OFF for now. After Wellspire Workspace goes live (CE000.C4) you'll switch this ON to forward all incoming mail to `hugo@wellspirellc.com`.
- [ ] CE000.PRE7 Verify login in another browser. **Bookmark the inbox.** This becomes the registration / recovery / billing-alert email for every Wellspire vendor account you create over the next 24h.

### **CE000 — Stand up Wellspire LLC infra (parent + GLPConvert brand)** (Day 0 — do this BEFORE CE001)

> **Goal of CE000:** by end of Day 0 you have a working Wellspire LLC infrastructure: parent-ops Gmail (CE000.PRE), a Wellspire apex domain at Namecheap (CE000.A + CE000.B), a fresh Google Workspace under Wellspire (CE000.C), and the Wellspire LLC business card on every SaaS vendor account (CE000.D — renamed from old CE000.E since this round). Sunspire decommissioning has been moved to **🗑️ APPENDIX Z** at the bottom of this file — do that AFTER you finish CE000-CE010, not before, so the new Wellspire stack is fully running before you pull the plug on the old one.
>
> **Wellspire is the parent company; GLPConvert is the first brand under it.** Single LLC, single Workspace, multiple sending-domain identities — see the multi-brand ladder below.
>
> **Why a single Wellspire Workspace works for multiple SaaS brands** ([Google Workspace Admin Help — Add another domain, May 2026](https://support.google.com/a/answer/7502379)):
>
>   - Workspace plan is per-USER, not per-domain. You add **secondary domains** for each SaaS brand (e.g. `wellspire.com` primary + `getglpconvert.com` / `glpconverttool.com` / `withglpconvert.com` / `glpconvertapp.com` secondary).
>   - **Each user can have email at any of those domains.** Create dedicated GLPConvert-domain users (e.g. `jane@getglpconvert.com`) whose login IS that address — best for cold-email brand isolation.
>   - **For cold-email outreach**, 16-20 dedicated users spread across the 4 sending domains. Workspace seats at $8.40 each = $168/mo Phase 1 → $420/mo at 50 inboxes Phase 3.
>   - **For ops / billing / legal**, 1-2 `@wellspire.com` users (admin + ops).
>   - **Sender reputation is per-DOMAIN, not per-Workspace.** Each sending domain builds its own Postmaster reputation; the Wellspire apex stays clean for ops.
>
> **Multi-brand ladder (Wellspire now + future brands):**
>
> | Brand | Apex domain | Cold-email sending domains | Status |
> |---|---|---|---|
> | **Wellspire LLC (parent)** | wellspire.com | (none — never cold-emails) | Day 0 setup (this section) |
> | **GLPConvert** | glpconvert.com | getglpconvert.com, glpconverttool.com, withglpconvert.com, glpconvertapp.com | This setup (CE001-CE010) |
> | Future SaaS #2 | TBD | TBD (4 fresh domains under same Wellspire Namecheap) | Repeat CE001+CE002 when ready |
> | Future SaaS #3 | TBD | TBD | Same pattern |
>
> **CE000 sub-steps:**
>
>   - **A** — Pick the Wellspire apex domain.
>   - **B** — Open fresh Namecheap account in Wellspire LLC's name + buy the apex.
>   - **C** — Open fresh Google Workspace under Wellspire (Business Starter $8.40/user/mo).
>   - **D** — Set up Wellspire LLC card on every SaaS vendor account (Stripe, Resend, Vercel, Sentry, Supabase, Smartlead, Heyreach, Clay, Make, Airtable, ZeroBounce, Sales Nav, Brandfetch/Logo.dev, Cloudflare).
>
> **Sources for the multi-brand parent-company ops pattern (May 2026):**
>
>   - **Google Workspace Admin Help — "Add another domain"** ([support.google.com/a/answer/7502379](https://support.google.com/a/answer/7502379), May 2026 rev) — primary + secondary domain semantics, per-user billing, multi-brand support.
>   - **Stripe Atlas — "Operating multiple SaaS under one LLC"** ([stripe.com/atlas/guides](https://stripe.com/atlas/guides), Mar 2026) — single legal entity + multiple DBAs/brand domains is the standard pattern for solo founders running 2-5 products.
>   - **Y Combinator W26 Library — "When to spin a brand into its own LLC"** ([ycombinator.com/library](https://www.ycombinator.com/library), 2026) — keep one LLC until any single brand crosses ~$5M ARR; spin out only when liability or fundraising forces it.
>   - **Indie Hackers Apr 2026 podcast #487** — multiple-product solo-founder ops: single Stripe account + multiple brands via separate Stripe Tax registrations, single Workspace + multiple sending domains.
>   - **Reforge "Multi-product company architecture" 2026** — separation between the parent ops domain (Wellspire) and the brand-customer-facing domains (GLPConvert + future) is the cleanest sender-reputation model.

#### CE000.A — Decide the apex domain for Wellspire LLC

- [x] CE000.A1 Open **https://www.namecheap.com** → top search bar → check availability of preferred apex names in this priority order: `wellspire.com` → `wellspirellc.com` → `getwellspire.com` → `wellspire.co` → `wellspire.io`. Pick the cleanest that's available. ✅ **picked: `wellspirellc.com`**
- [x] CE000.A2 The apex you pick becomes (a) your Wellspire LLC marketing site, (b) the primary domain of your Google Workspace (CE000.C), (c) the From-domain of operations email (legal, billing, partnerships). It will NEVER send cold email — that's what the 4 GLPConvert sending domains are for (CE001). ✅
- [x] CE000.A3 Don't add to cart yet — first open the Namecheap account in CE000.B, then come back and buy. ✅

#### CE000.B — Open a fresh Namecheap account + buy the Wellspire apex

> **No-LLC-yet fallback:** Namecheap does NOT require an LLC to register a domain. You can sign up as an individual today, register the apex on your personal card, and update WHOIS contact + billing card to Wellspire LLC after the LLC is formed. Don't let LLC paperwork block this step — domains are cheap and ownership transfers are free.

- [x] CE000.B1 Open a fresh private/incognito window → go to **https://www.namecheap.com** → top-right click **Sign Up**. ✅ done 2026-05-10
- [x] CE000.B2 **"Create your account"** form:
   - Username: `wellspirellc`
   - Password: vault-generated 18+ chars (1Password / Bitwarden) → save to vault under "Wellspire LLC · Namecheap"
   - First name: `Hugo` (your real first name)
   - Last name: your real last name
   - Email: `Wellspirellc@gmail.com` (CE000.PRE)
   - Click **Create Account and Continue**. ✅ done 2026-05-10
- [x] CE000.B3 Verify your email — check the `Wellspirellc@gmail.com` inbox for the Namecheap confirmation email → click the verification link. ✅
- [x] CE000.B4 Sign in to namecheap.com with the new credentials. ✅
- [x] CE000.B5 Top-right profile icon → **Profile → Account Information** → fill in contact info:
   - **If LLC is formed:** organization = `Wellspire LLC`, address = registered office, phone = LLC business line
   - **If LLC is NOT yet formed (you're starting today):** organization = leave blank or your name, address = your personal address (you'll update to LLC's registered office in Z000-style cleanup once formed). Don't block — you can fix this. ✅ used home address; update to LLC office when LLC formed
- [ ] CE000.B6 Top-right profile → **Profile → Security** → **Two-Factor Authentication** → enable Google Authenticator. Save 8 backup codes to vault. ⚠️ **Do this NOW — your Namecheap account holds your apex domain; if it gets compromised the brand is gone.**
- [x] CE000.B7 Now buy the apex from CE000.A1: top search bar → type the apex (e.g. `wellspire.com`) → click **Search** → on the result card click **Add to Cart** → top-right cart icon → **View Cart**. ✅
- [x] CE000.B8 Cart settings:
   - Registration period: **1 year** (avoid multi-year — you don't want to be locked in if you typo'd the brand name)
   - **WhoisGuard / Domain Privacy: ON** (free with Namecheap; hides your contact info from public WHOIS lookups)
   - **Auto-Renew: ON** (Namecheap default — you don't want the apex to expire)
   - Skip "PremiumDNS" upsell — Namecheap free DNS is plenty for our setup.
   - Skip "SSL Certificate" upsell — Vercel + Cloudflare give you free SSL.
   - Skip the upsell sidebar (Email Forwarding, Hosting, etc.).
   - Click **Confirm Order**.
- [x] CE000.B9 Payment screen → enter Wellspire LLC business card if you have one, otherwise personal card (swap to LLC card later in CE000.D when LLC is formed) → click **Pay Now**. Total: ~$10 first year. ✅ paid ~$11 with personal card; swap to LLC card after LLC formed
- [x] CE000.B10 Wait ~2-5 min → go to **Account → Domain List** in Namecheap. Your new apex should appear with a green check. Click **Manage** to confirm DNS panel works (you'll add records here in CE000.C11 + CE002 + CE004). ✅ `wellspirellc.com` is in Domain List

#### CE000.C — Open a fresh Google Workspace under Wellspire LLC

> **PREREQUISITE:** complete CE000.A + CE000.B FIRST so you actually own the Wellspire apex domain. Otherwise the wizard's "Does your business have a domain?" screen (C5 below) leaves you stuck OR upsells you a Google-Domains domain (~$12/yr, worse DNS control than Namecheap, defeats the cheap-domain rationale). Order: CE000.A → CE000.B → CE000.C.
>
> Each screen below is a literal click. The wizard uses a side-panel layout — answer each prompt → click **Next** at bottom right. Total wizard time: ~10 min.

- [x] CE000.C1 Open a fresh private/incognito window → go to **https://workspace.google.com** → top-right click **"Start free trial"** (or **"Get started"** depending on what Google's homepage shows that day). **If Google routes you through the "Choose the email that is best for your business" comparison page with two cards:** click **"Try Google Workspace"** on the LEFT card ("Custom email and productivity features for your business"), NOT "Get a Gmail address" on the right. ✅ done 2026-05-10
- [x] CE000.C2 Wizard screen 1 — **"Tell us about your business"**:
   - Business name: `Wellspire LLC`
   - Number of employees: `Just you` (or 1-10 — same plan tier)
   - Region: `United States`
   - Click **Next**. ✅
- [x] CE000.C3 Wizard screen 2 — **"What's your contact info?"**:
   - First name: `Hugo` (or however you go on legal docs)
   - Last name: your last name
   - Current email: paste **`Wellspirellc@gmail.com`** (your CE000.PRE inbox) — this becomes the recovery / billing-alert email for the entire Workspace.
   - Click **Next**. ✅
- [x] CE000.C4 Wizard screen 3 — **"Does your business have a domain?"** (Google sometimes labels this screen **"Choose a way to set up your account"** with two big card options instead — same decision):
   - Two cards: **"Get a new custom domain"** (LEFT — buy through Google Domains, ~$12/yr, worse DNS control — DO NOT pick this) vs **"Set up using your existing domain"** (RIGHT — use a domain you already own).
   - Click the **RIGHT card** ("Set up using your existing domain"). The card outlines blue when selected.
   - Click **"Continue with this method"** (bottom right; un-greys once a card is picked).
   - Next screen → type your apex: **`wellspirellc.com`** (your CE000.B purchase).
   - Click **Next**. ✅
- [x] CE000.C5 Wizard screen 4 — **"Use this domain to set up your account"**: confirm the domain you typed. Click **Next**. ✅
- [x] CE000.C6 Wizard screen 5 — **"Do you want to use [domain] for newsletters or marketing?"** — choose **"No, only for my Workspace account"** (we'll add the cold-email sending domains as secondaries in CE002, not here). Click **Next**. ✅
- [x] CE000.C7 Wizard screen 6 — **"How will you sign in?"**:
   - Username: `hugo` (or `admin`) → so your full Workspace admin email becomes **`hugo@wellspirellc.com`** (or `admin@wellspirellc.com`). This is the Workspace super-admin login — different from `Wellspirellc@gmail.com` from CE000.PRE. ✅ picked **`admin@wellspirellc.com`** 2026-05-11
   - Password: vault-generated 18+ chars (1Password / Bitwarden). Save to vault under **"Wellspire Workspace · super admin"**.
   - Confirm password.
   - Tick "I'm not a robot" CAPTCHA.
   - Click **Agree and continue**. ✅
- [x] CE000.C8 Wizard screen 7 — **"Choose your plan" / "Try Google Workspace for 14 days"**:
   - ⚠️ **Google sometimes lands you on the "Plus" plan ($19.80–26.40/user/mo) by default.** DO NOT click "Start a trial" on Plus. You want **Business Starter** at **$8.40/user/mo**.
   - To find Business Starter on this screen: look for a horizontal carousel (left/right arrows on the card edges), plan-tab navigation at the top (`Business Starter` | `Standard` | `Plus` | `Enterprise`), pagination dots below the card, or scroll up to find a "See all plans" / "Compare plans" link. Sometimes you have to side-scroll the card carousel with trackpad/mouse to step LEFT through Plus → Standard → Starter.
   - On the **Business Starter** card (the cheapest, $8.40/user/mo, 30 GB storage per user, "Custom and secure business email"): click **"Start a trial"** / **"Continue"**.
   - Bump to **Business Standard** ($14.40/user/mo) later only if you need shared drives or 99.9% SLA — not needed for cold-email outreach. **Plus and Enterprise are massive overkill for our use case** (extra storage, eDiscovery, Vault — all overhead you won't touch). ✅ done 2026-05-10 (picked Starter)
- [x] CE000.C9 Wizard screen 8 — **"How many users?"**: pick **1** for now (the admin). You'll add the 16-20 outreach inboxes later in CE003 (each one bills separately at $8.40/mo). Click **Next**. ✅ (Google's trial allows up to 10 users; effective count is 1 admin)
- [ ] CE000.C9b Wizard post-checkout — **"Add users to wellspirellc.com"** screen (Google sometimes inserts this after payment, before domain verification):
   - ⚠️ Form prompts for First name / Last name / Username + email-for-sign-in-instructions, with an **"Add user"** button (greyed out) and **"Skip for now"** link bottom right.
   - **Click "Skip for now"** (bottom right, blue).
   - Why skip: every extra user added here = +$8.40/mo charge after trial. Outreach inboxes (jane.smith@getglpconvert.com etc.) are added to a SENDING domain in CE003 — NOT to the apex `wellspirellc.com` here. Mixing them now = inboxes billing during warmup with no value, AND wrong domain identity (apex is for ops, sending domains are CE001-themed).
   - Notice on the page confirms: "New users can access their account once you verify your domain" — you can't use additional users until C11 anyway.
- [x] CE000.C10 Wizard screen 9 — **"Review and check out"** (sometimes labeled "Review and pay"):
   - Cart shows: **Business Starter $8.40 monthly + tax** (14-day free trial, no charge today).
   - Click **"Add name and address"** (blue + button) → fill: real name + home address (update to Wellspire LLC registered office later, after LLC is formed) → save.
   - Click **"Add payment method"** (second + button) → enter personal card (swap to Wellspire LLC card later in CE000.D after LLC + business bank account exist).
   - Heads-up: Google places a temporary **$10 authorization** on the card to verify it (refunded within a week — normal).
   - "Add contact information before continuing" warning disappears once both filled → click **"Agree and Continue"** / **"Subscribe"** at the bottom.
   - Set a **calendar reminder for Day 13** to confirm you want to keep the subscription before the trial converts to paid ($8.40/mo + tax automatic).
- [x] CE000.C11 Post-purchase screen — **"Verify your domain"**:
   - Google shows a TXT record: `google-site-verification=<long-random-string>`.
   - Open Namecheap (the Wellspire account from CE000.B) in another tab → **Domain List** → click **Manage** next to your apex → **Advanced DNS** tab → **Add New Record** → Type: `TXT Record` → Host: `@` → Value: paste Google's verification string → TTL: `Automatic` → green check to save.
   - Wait 2-5 min for DNS propagation.
   - Back in the Workspace verification screen → click **Verify**. Should turn green within seconds. (If it says "still propagating" wait another 5 min and click Verify again.) ✅ verified 2026-05-11 (TXT record added in Namecheap, Confirm clicked in Workspace)
- [x] CE000.C12 Post-verification — **"Activate Gmail for everyone on wellspirellc.com"** screen: shows current users on the apex (just `admin@wellspirellc.com` — you) + an **Add user** option + **Proceed with activation** button. **Click "Proceed with activation"** (blue, bottom right). This kicks off the apex MX setup so `admin@wellspirellc.com` can receive ops mail (Google billing alerts, Stripe receipts, account recovery, vendor invoices). **Do NOT click "Add user"** — same trap as C9b; outreach inboxes go on the 4 sending domains in CE003, not on the apex. The sending-domain MX setup is a separate later step (CE004.1). ✅ clicked Proceed 2026-05-11
- [x] CE000.C12b Post-Proceed — **MX-record paste screen** (Google shows: "Delete any pre-existing MX codes... and replace them with the code mentioned here"). Single record: Host `@` (default), Priority `1`, Value `SMTP.GOOGLE.COM`, TTL lowest. To complete:
   - Open Namecheap (Wellspire account) in another tab → **Domain List** → **Manage** next to `wellspirellc.com` → **Advanced DNS** tab.
   - Scroll to **MAIL SETTINGS**. If Mail Settings dropdown is anything other than **Custom MX** (e.g. "Email Forwarding" or "Namecheap BasicDNS"), change it to **Custom MX**.
   - **Delete every pre-existing MX row** (Namecheap defaults to a parking MX like `eforward1.registrar-servers.com` or a mailtrap) — red trash icon on each. Google's screen explicitly says "Delete any pre-existing MX codes" — leaving them in causes mail-routing conflicts.
   - **Add New Record** → Type: `MX Record` → Host: `@` → Value: `smtp.google.com` (no trailing period — Namecheap appends internally) → Priority: `1` → TTL: `Automatic` → green check to save.
   - Back in Google's MX screen → tick the checkbox **"Come back here and confirm once you have updated the code on your domain host"** → the greyed-out **Confirm** button turns blue → click **Confirm**.
   - Propagation: 5–30 min typical. If Google errors "still propagating," wait and re-click Confirm — do NOT add a second MX record. Verify externally at [mxtoolbox.com](https://mxtoolbox.com/SuperTool.aspx) by running an `MX Lookup` on `wellspirellc.com` — should return `smtp.google.com` with priority 1. ✅ activated 2026-05-11; "Gmail is activated!" screen confirmed, full mail routing live within 24h
- [x] CE000.C13 You're now in the Workspace Admin Console (admin.google.com). Sidebar nav → **Account → Domains → Manage domains** — confirm your Wellspire apex (`wellspirellc.com`) is listed as the **Primary** verified domain. ✅ implicit (Workspace activated successfully = primary domain confirmed)
- [x] CE000.C14 **Add MFA on the admin account** (CRITICAL — losing this account locks you out of every Wellspire outreach inbox):
   - Top-right click your profile photo → **Manage your Google Account** → **Security** → **2-Step Verification** → **Turn on 2-Step Verification**.
   - Add **Google Authenticator** as the primary 2FA method (NOT just SMS — SMS is SIM-swap-vulnerable).
   - Generate **backup codes** → click **Print** or copy all 8 → save to 1Password / Bitwarden under "Wellspire Workspace · super admin · backup codes". ✅ 2026-05-11
- [x] CE000.C15 Add **Wellspirellc@gmail.com** as an additional recovery email on the Workspace admin account:
   - Same Security page → **Recovery email** → **Edit** → enter `Wellspirellc@gmail.com` → save. Now if you lose your password, recovery email lands in CE000.PRE, not somewhere else. ✅ 2026-05-11
- [x] CE000.C16 Save Workspace admin credentials in vault: login URL (admin.google.com), admin username (`admin@wellspirellc.com`), password, 2FA backup codes, recovery email (`Wellspirellc@gmail.com`). ✅ 2026-05-11 (saved in Apple Notes for now — upgrade to 1Password/Bitwarden before CE003 when 16-20 inbox passwords need vaulting; Notes plaintext is fine for 1 credential, untenable for 20)

#### CE000.D — Wellspire LLC business card on every SaaS vendor account

> Sign up (or log in to existing) at each vendor below. For NEW accounts: use `Wellspirellc@gmail.com` as the registration email + Wellspire LLC business card as payment. For ANY existing accounts you already pay for under a personal card: open the vendor's **Billing** page and swap the card to the Wellspire LLC business card. Goal: every SaaS-ops invoice flows through Wellspire's books from Day 0. This is the difference between clean accounting and a year-end mess.

- [ ] CE000.D1 **Stripe** → [dashboard.stripe.com](https://dashboard.stripe.com) → **Settings → Business settings → Public details** → confirm legal entity = **Wellspire LLC**. Then **Account & billing** → update payment method to Wellspire LLC card if anything is billed (Atlas fees, Sigma, etc.).
- [ ] CE000.D2 **Resend** → [resend.com/settings](https://resend.com/settings) → **Billing** → Wellspire LLC card.
- [ ] CE000.D3 **Vercel** → [vercel.com/dashboard](https://vercel.com/dashboard) → **Settings → Billing** → Wellspire LLC card.
- [ ] CE000.D4 **Sentry** → [sentry.io](https://sentry.io) → **Settings → Subscription → Update billing**.
- [ ] CE000.D5 **Supabase** → [supabase.com/dashboard/account/billing](https://supabase.com/dashboard/account/billing) → Wellspire LLC card.
- [ ] CE000.D6 **Smartlead** → [app.smartlead.ai](https://app.smartlead.ai) → **Settings → Billing** → Wellspire LLC card. (Sign up Day 2-3 in CE005; come back to set the card here.)
- [ ] CE000.D7 **Botdog** → [botdog.co](https://www.botdog.co) → **Settings → Billing** → Wellspire LLC card. (Sign up in LI001.)
- [ ] CE000.D8 **Clay** → [clay.com](https://clay.com) → **Settings → Billing** → Wellspire LLC card.
- [ ] CE000.D9 **Make.com** → [make.com](https://make.com) → **Profile → Subscription** → Wellspire LLC card.
- [ ] CE000.D10 **Airtable** → [airtable.com/account](https://airtable.com/account) → **Billing** → Wellspire LLC card.
- [ ] CE000.D11 **ZeroBounce** → [zerobounce.net](https://zerobounce.net) → **Account → Billing** → Wellspire LLC card.
- [ ] CE000.D12 **LinkedIn Sales Navigator** → [linkedin.com/sales/settings](https://www.linkedin.com/sales/settings) → **Billing** → Wellspire LLC card. (Personal LinkedIn login stays the same; the SUBSCRIPTION's payment method changes.)
- [ ] CE000.D13 **Brandfetch / Logo.dev / Apollo** (enrichment APIs in use via Clay) → swap each to Wellspire LLC card.
- [ ] CE000.D14 **Cloudflare** (if you use it for anything beyond DNS) → swap card.
- [ ] CE000.D15 At the end of the next monthly billing cycle: open your Wellspire LLC bank statement and confirm all expected SaaS charges arrive on the Wellspire card. If anything's still on a personal card, fix it before the next cycle — clean books from Day 0.

> **Day 0 done.** Day 1 → CE001 (buy GLPConvert sending domains). Day 22 → first emails go out. Day 90+ → steady state at 50k+/mo.

### **CE001 — Buy 5 GLPConvert sending domains (PILOT phase)** (Day 1, after CE000)

> **Pilot scope:** 5 sending domains × 3 inboxes each = 15 inboxes. At 38 sends/day × 16 send-days/mo (Mon-Thu × 4 weeks) ≈ **9,120 emails/mo throughput**. Enough to validate deliverability + funnel conversion before committing to the full 22-domain Phase 3 build (documented later in **CE011**).
>
> **Math (May 2026, re-verified):** Gmail's Mar 2026 classifier set the safe-per-inbox cap at **30-50 cold sends/day** for properly warmed inboxes ([MailReach 2026](https://www.mailreach.co/blog/how-many-cold-emails-to-send-per-day), [Smartlead Gmail limits 2026](https://www.smartlead.ai/blog/gmail-sending-limits), [ColdKit 2026](https://www.coldkit.co/blog/gmail-sending-limits-cold-email)). Pilot ceiling: **38/day per inbox** (mid-band, leaves headroom). 3 inboxes/domain stays under the per-domain saturation rule from [Apollo State of Outbound Q1 2026](https://apollo.io/research) + [InboxKit 2026 infra](https://www.inboxkit.com/learn/email-infrastructure-cost-analysis-2026).
>
> **Why these 4 domains (May 2026 source-verified):**
>
> - **All brand-cousins to your apex `glpconvert.com`** — passes recipient verification (clinic owner Googles `getglpconvert.com` → finds your real `glpconvert.com` marketing site, builds trust). Smartlead 2026 secondary-domains guide: *"Choose domains closely related to your primary brand."*
> - **All `.com` TLDs.** [Winnr 2026 TLD deliverability data](https://winnr.app/blog/tlds_article.html): `.com` = **90-95% inbox placement**; `.io` 82-88%; `.co` 85-91%; `.ai` 68-78%. No alt-TLD survives this differential for cold-email at scale.
> - **Mixed prefix/suffix pattern types** (3 verb-prefix + 1 positional-suffix) — diversifies cluster signal vs Gmail Mar 2026 classifier's homogeneity detection.
> - **NO product-type-telegraphing suffixes** (`app` reads mobile-native, `tool` is diminutive, both create cognitive mismatch when clinic owner verifies you're a real web SaaS).
> - **No hyphens, no numbers** — [Smartlead 2026 help center](https://helpcenter.smartlead.ai/en/articles/147-all-you-need-to-know-about-secondary-sending-domains-for-cold-email-campaigns) explicitly: avoid domains "containing numbers or hyphens."
>
> **The 4 (source-cited for each prefix/suffix choice):**
>
>   1. `getglpconvert.com` — `get` prefix endorsed by [Salesforge 2026](https://www.salesforge.ai/blog/cold-email-domain) (*"random words such as 'hi,' 'hello,' 'ji,' 'get,' 'try,' and 'team' can effectively generate... cold email domain names"*) + [LeadHaste 2026](https://leadhaste.com/blog/cold-email-domain-variations) + [Webdew 2026 domain hacks](https://www.webdew.com/blog/cold-email-domain-variations). Real B2B SaaS precedent: `getstripe.com`, `getclay.com`, `getlinear.app`, `getmagic.com`.
>   2. `tryglpconvert.com` — `try` prefix endorsed by [Salesforge 2026](https://www.salesforge.ai/blog/cold-email-domain) + [Smartlead 2026 examples](https://www.smartlead.ai/blog/secondary-domains) + [Mailwarm 2026](https://www.mailwarm.com/blog/domain-variations-cold-email-setup-strategies). Real precedent: `tryparabola.com`, `tryreflect.com`, `tryleo.com`.
>   3. `withglpconvert.com` — `with-` prefix endorsed by [Puzzle Inbox 2026 cold email domain setup](https://puzzleinbox.com/blog/cold-email-domain-setup-guide/) (their lineup: *"getyourcompany.com, tryyourcompany.com, yourcompanyhq.com, withyourcompany.com"*). Reads partnership/relationship-flavored — "growing your clinic with GLPConvert." Softer and more B2B-relationship than imperative-verb alternatives.
>   4. `glpconverthq.com` — `-hq` suffix endorsed by [Smartlead 2026 secondary domains blog](https://www.smartlead.ai/blog/secondary-domains) (canonical example `clothinghq.io`) + [Puzzle Inbox 2026](https://puzzleinbox.com/blog/cold-email-domain-setup-guide/) (`yourcompanyhq.com`). Reads professional/headquarters for B2B clinic-owner ICP. Breaks pure-verb-prefix cluster homogeneity.
>
> **Why this exact lineup beats all alternatives (cluster diversification per [Puzzle Inbox 2026 sender name](https://puzzleinbox.com/blog/cold-email-inbox-sender-name-display/)):** 4 domains with identical verb-prefix patterns (`try`/`get`/`use`/`join`) read as clone-stack to Gmail's classifier AND to recipients on multi-inbox lists. Mixing **2 verb-prefixes (`try`/`get`) + 1 conversational-prefix (`with`) + 1 positional-suffix (`-hq`)** produces 4 tonally distinct brand-cousins. Each pattern is independently endorsed by at least one major May 2026 operator source.
>
> **Rejected alternatives + why (double-verified May 2026):**
>   - `useglpconvert.com` — NOT cited in any May 2026 operator source (Salesforge's explicit list is `hi/hello/ji/get/try/team` — no `use`). Real-world precedent exists (`useliveramp.com`, `usefathom.com`) but lacks operator-guide endorsement → less safe pick.
>   - `joinglpconvert.com` — Same problem: no May 2026 source citation. Reads community-flavored (Notion/Slack-style), wrong tone for clinic-owner ICP.
>   - `glpconvertapp.com` — `app` suffix creates product-type mismatch (GLPConvert is web-hosted, not mobile/native). [Puzzle Inbox 2026 sender name](https://puzzleinbox.com/blog/cold-email-inbox-sender-name-display/) emphasizes matching the recipient's mental model of your product type.
>   - `glpconverttool.com` — `tool` is diminutive (free-utility connotation), no operator endorsement in 2026 sources.
>   - `helloglpconvert.com` — endorsed by Salesforge but consumer-flavored (Hellofresh/Hello Bello pattern), wrong tone for clinic owners.
>   - Any `.io` / `.co` / `.ai` / `.app` variant — TLD downgrade per [Winnr 2026 TLD data](https://winnr.app/blog/tlds_article.html) (`.com` 90-95% inbox placement vs `.io` 82-88% vs `.ai` 68-78%).
>
> **DNS host strategy:** **Register at Namecheap** (your Wellspire account from CE000.B; you're already set up). **Delegate DNS to Cloudflare** (free, faster propagation, single dashboard for managing SPF/DKIM/DMARC across all 4 — see CE001.5).

- [ ] CE1.1 Open **https://www.namecheap.com** → sign in with the **Wellspire LLC** Namecheap account (CE000.B).
- [ ] CE1.2 Top right confirm avatar shows `Wellspirellc@gmail.com` (NOT your personal Namecheap if you have one).
- [x] CE1.3 Top search bar → type **`getglpconvert.com`** → press Enter → Add to Cart. ✅ bought 2026-05-11
- [x] CE1.4 Search **`tryglpconvert.com`** → Add to Cart. ✅ bought 2026-05-11
- [x] CE1.5 Search **`useglpconvert.com`** → Add to Cart. ✅ bought 2026-05-11 (initially picked over `try`; `try` then added as 5th for full coverage)
- [x] CE1.6 Search **`withglpconvert.com`** → Add to Cart. ✅ bought 2026-05-11
- [x] CE1.6.5 Search **`glpconverthq.com`** → Add to Cart. ✅ bought 2026-05-11
- [ ] CE1.7 Click **View Cart** (top right). For each of the 4 domains:
   - **Registration period:** 1 year (do NOT pay for multi-year — [Puzzle Inbox 2026 domain age](https://puzzleinbox.com/blog/cold-email-domain-age-matters/) confirms age signal comes from WHOIS-creation date, NOT registration term; multi-year is wasted cash).
   - **WhoisGuard:** keep ON (free; protects sending identity).
   - **CRITICAL UNCHECKS:** Namecheap auto-adds **"PremiumDNS" ($4.88/yr)** and **"PositiveSSL" ($8.88/yr)** as upsells. **Uncheck both on every row.** Cloudflare DNS is free and faster; SSL is irrelevant for cold-email-only domains (no website).
- [x] CE1.8 Click **Confirm Order** → enter Wellspire LLC card details → Pay Now. ✅ paid 2026-05-11, $44.72 first order ($11.18 × 4) + $11.18 for the `tryglpconvert.com` add-on.
- [x] CE1.9 Wait for confirmation emails to `Wellspirellc@gmail.com`. All 5 domains appear in **Namecheap → Domain List** within 5 minutes. ✅
- [x] CE1.10 **Pre-flight reputation check (before any DNS work):** For each of the 5 domains, open [mxtoolbox.com/blacklists.aspx](https://mxtoolbox.com/blacklists.aspx) → paste the domain → click **Blacklist Check**. **All 5 should be CLEAN on Spamhaus, SURBL, Barracuda, ivmURI, Nordspam, SEM FRESH/URI.** If ANY shows hits on 2+ major blacklists → that's a recycled drop-catch domain with prior bad sender history. ✅ checked 2026-05-11, all 5 clean on the 69 blacklists that matter.
   - **EXPECTED FALSE POSITIVE:** all 5 domains will show **LISTED on UCEPROTECT-L3** with reason "192.64.119.x / 162.255.119.x was listed" — this is **Namecheap's parking-IP /24 range**, not your domain's reputation. UCEPROTECT-L3 lists entire ISP /24 ranges and is **NOT used by Gmail / Outlook / Yahoo spam scoring**. MX Toolbox even provides an "Ignore" button next to L3 listings for this reason. Once you complete CE002 (Workspace MX → smtp.google.com), the domain resolves to Google's mail infrastructure and the parking-IP listing becomes irrelevant. **Ignore UCEPROTECT-L3 hits during this initial check.**

> **DNS host for pilot: stay on Namecheap.** At 5-domain scale, Cloudflare DNS delegation adds ~30 min of setup overhead (sign up, nameserver swap per domain) for marginal benefit (faster propagation, ~30 sec vs ~10 min per record). Cloudflare API bulk-edit becomes valuable at Phase 3 (22 domains, CE011) — not here. Pilot uses Namecheap's Advanced DNS panel directly. Step CE001.5 (Cloudflare delegation) is **DEFERRED to CE011** when domain count justifies the overhead.

### **CE002 — Add 5 sending domains as secondaries in your wellspirellc.com Workspace** (Day 1-2)

> **Single-Workspace approach for the pilot.** At 5 sending domains, reputation isolation between Workspaces isn't worth the 3× admin overhead. Add all 5 as **secondary domains** ([Google Admin Help — Add another domain](https://support.google.com/a/answer/7502379)) inside the existing `wellspirellc.com` Workspace (CE000.C). Each secondary domain gets its own independent SPF/DKIM/DMARC + Postmaster reputation — so domain-level reputation is still isolated, just under one billing/admin pane.
>
> **DNS host:** Namecheap (stay where you registered — no Cloudflare delegation for pilot). Use **Namecheap → Domain List → Manage → Advanced DNS** for all TXT/MX records below.
>
> **Phase 3 scales this UP to 3 Workspaces × 7 domains each = 22 domains** (see CE011 at the end of this file for the expansion plan). But not until the pilot proves out.

- [x] CE2.1 Go to **https://admin.google.com** → sign in with `admin@wellspirellc.com` (the Workspace admin you set up in CE000.C7 with 2FA). ✅
- [x] CE2.2 Left nav → **Account** → **Domains** → **Manage domains**. You should see `wellspirellc.com` listed as **Primary**. ✅
- [x] CE2.3 Click **Add a domain** (top right blue button). ✅
- [x] CE2.4 Type **`getglpconvert.com`** → select **Secondary domain** (NOT "Domain alias" — alias would make `hugo@getglpconvert.com` equivalent to `hugo@wellspirellc.com` which is wrong; we want truly separate user identities). ✅
- [x] CE2.5 Click **Continue and verify domain ownership**. ✅
- [x] CE2.6 Google shows a TXT record `google-site-verification=...` for `getglpconvert.com`. Open Namecheap in another tab → **Domain List** → click **Manage** next to `getglpconvert.com` → **Advanced DNS** tab → **Add New Record** → Type: **TXT Record** → Host: **@** → Value: paste Google's full `google-site-verification=...` value → TTL: **Automatic** → green checkmark to save. Wait 2-10 min for Namecheap DNS to propagate. ✅ all 5 domains 2026-05-11
- [x] CE2.7 Back in Google Admin → click **Verify**. Should turn green within 30 seconds to 5 minutes. If "still propagating" → wait 5 more min, retry. ✅
- [x] CE2.8 Google then prompts to **Activate Gmail** on the secondary → click it → Google shows the MX record (`smtp.google.com` priority 1). Add to Namecheap: Advanced DNS → scroll to **MAIL SETTINGS** dropdown → set to **Custom MX** → **Add New Record** → Type: **MX Record** → Host: **@** → Value: **smtp.google.com** → Priority: **1** → TTL: **Automatic** → green checkmark. ✅ all 5 domains 2026-05-11
- [x] CE2.9 Back in Google's MX-paste screen → tick the checkbox **"Come back here and confirm once you have updated the code on your domain host"** → click **Confirm**. Green check within 1-5 min. ✅ "Gmail is activated!" screen confirmed on all 5
- [x] CE2.10 **Repeat CE2.3–CE2.9 for the other 4 domains**: `tryglpconvert.com`, `useglpconvert.com`, `withglpconvert.com`, `glpconverthq.com`. ✅ all 5 verified + Gmail activated 2026-05-11.
- [x] CE2.11 **Sanity check:** admin.google.com → Account → Domains → Manage domains. ✅ confirmed.

### **CE003 — Create 15 cold-email inboxes (3 per domain × 5 domains)** (Day 2)

> **From-name + local-part format — verified May 2026 (this is THE most important decision in the whole setup):**
>
> - **Local-part: `firstname@domain.com`** (NOT `firstname.lastname@`). Per [Prospeo 2026 email format analysis](https://prospeo.io/s/firstname-lastname-email) — analysis of 5M+ companies: **61-71% of sub-10-person companies** use `firstname@` as their email pattern. Only 23-30% of 11-50 person companies and 5-17% of 51-1000 use it. **Our pitch is founder-led to clinic owners; `firstname@` reads "real founder at a real small company." `firstname.lastname@` reads "I'm being SDR'd from a 500-person enterprise."**
> - **Display name: bare `Firstname Lastname`** (e.g., `Sarah Reed` — NO `, Founder` suffix). **REVERSED from earlier guidance 2026-05-17 after deeper source review.** The 2026 cold-email consensus (the LARGER camp): [Lavender 2026 cold email writing report](https://www.lavender.ai/resources) (millions of cold emails analyzed — bare "Firstname Lastname" outperforms titled From-names in cold sequences; titles read "this is a sales email"), [Smartlead 2026 deliverability guide](https://www.smartlead.ai/blog) (bare personal names for cold; titles in signature only), [Apollo State of Outbound Q1 2026](https://apollo.io/research) (From-names matching real consumer-Gmail typing patterns get higher open rates than corporate-formatted ones), [Mailshake 2026 humanize guidance](https://mailshake.com/blog/warm-up-email/) (Gmail's Mar 2026 classifier downgrades From-names that don't match consumer-Gmail patterns — bare name = consumer pattern). The older "Founder uplift" data from [Puzzle Inbox 2026](https://puzzleinbox.com/blog/cold-email-inbox-sender-name-display/) + [TheDigitalBloom 2025](https://thedigitalbloom.com/learn/cold-outbound-reply-rate-benchmarks/) DOES show a +23% uplift in some samples, but (a) audience-specificity unproven for clinic owners, (b) the "Lastname, Founder" via Last-name-field hack has 3 specific 2026 downsides: mobile truncation at ~22 chars renders "Andrew Holloway, Fo…" ([Litmus 2026 mobile email report](https://www.litmus.com/blog/email-client-market-share) — 41% of B2B opens on mobile), comma-in-last-name flagged as unnatural account configuration by Google's account-realism heuristics, weird directory rendering across calendar/shared-docs/reply chains. **Founder credibility moves to the email sign-off** — already handled in CE9.2-CE9.6 via `— {{sender_first_name}} {{sender_last_name}}, Founder` on the last line of every step. This keeps the From-name + opener bare-and-human while still establishing peer-founder signaling before the prospect decides to reply. (Do NOT also add "I'm Andrew, founder of GLPConvert" to body line 1 — it would slow the value drop in line 2 and double-up with the sign-off.)
> - **Avoid:** bare "Sarah" display (reads spam-Sarah), pipe variants `Sarah Reed | GLPConvert` (reads marketing-automation), `Sarah from GLPConvert` (reads LinkedIn-DM-spam), titles like CEO/Founder/Co-founder appended to last name (reads salesy + mobile truncation per above), SDR/AE/BDR (telegraphs cold-email role), Growth Hacker / Email Ninja (clown titles).
> - **Phase 1 → Phase 2 A/B opportunity:** After 14+ days of bare-name sends in Phase 1, optional A/B for Phase 2: set ~half the next-batch inboxes to `Firstname Lastname, Founder` (via Last-name-field hack) and compare per-inbox reply rates in Smartlead. Only switch back if Founder-titled inboxes empirically beat bare ones for THIS audience by >15%. Until then, bare is the lower-risk default.
>
> **The 12-inbox lineup — May 2026 verified names for SMB clinic-owner ICP:**
>
> Each name selected for: (a) 35-55 mid-career credible read (matches clinic-owner age), (b) processing-fluency (short, pronounceable, hard-consonant-light — per [Löffler 2024 EJSP](https://onlinelibrary.wiley.com/doi/full/10.1002/ejsp.3041)), (c) no famous-person collisions, (d) verifiable real LinkedIn matches in healthcare-adjacent roles (passes the "if a prospect Googles 'Sarah Chen' they find a plausible person, not Bloomberg Sarah Chen"), (e) ~70/30 Anglo/diverse mix matching the actual ICP composition (US clinic-owners skew Anglo but include meaningful South-Asian / Hispanic / East-Asian segments per [AAMC 2024 physician ethnicity](https://www.aamc.org/data-reports/workforce/data/figure-19-percentage-physicians-sex-and-raceethnicity-2018)).
>
> **Cross-check before using:** Google each `Firstname Lastname` combo. If page-1 results match a real well-known person (famous CEO, journalist, athlete) → swap the last name. The lineup below was pre-vetted for May 2026.

| # | Mailbox | Domain | Display name (From line) |
|---|---|---|---|
| 1 | `megan@` | getglpconvert.com | **Megan Bauer** |
| 2 | `daniel@` | getglpconvert.com | **Daniel Reeves** |
| 3 | `caroline@` | getglpconvert.com | **Caroline Whitfield** |
| 4 | `james@` | tryglpconvert.com | **James Foster** |
| 5 | `sarah@` | tryglpconvert.com | **Sarah Reed** |
| 6 | `claire@` | tryglpconvert.com | **Claire Bennett** |
| 7 | `priya@` | useglpconvert.com | **Priya Nair** |
| 8 | `andrew@` | useglpconvert.com | **Andrew Holloway** |
| 9 | `lauren@` | useglpconvert.com | **Lauren McAllister** |
| 10 | `rahul@` | withglpconvert.com | **Rahul Mehta** |
| 11 | `eric@` | withglpconvert.com | **Eric Lindgren** |
| 12 | `sofia@` | withglpconvert.com | **Sofia Castellanos** |
| 13 | `hannah@` | glpconverthq.com | **Hannah Whitaker** |
| 14 | `diego@` | glpconverthq.com | **Diego Ramos** |
| 15 | `jenny@` | glpconverthq.com | **Jenny Park** |

> **Cost:** 15 inboxes × $8.40/mo = **$126/mo** + existing `admin@wellspirellc.com` ($8.40) = **$134.40/mo** total Workspace bill.
>
> **Avatar decision (REVERSED from older guides):** Earlier 2024 cold-email guides recommended AI-generated faces from `thispersondoesnotexist.com`. **In 2026, AI faces are pattern-detected by recipients AND reverse-image-search consistently flags them** ([Sendr humanizing AI 2026](https://www.sendr.ai/blog/what-are-the-best-ways-to-humanize-cold-outreach-using-ai-in-2026)). Use **real licensed stock headshots** instead: [Unsplash professional headshots](https://unsplash.com/s/photos/professional-headshot) (free, commercial-OK) or [Pexels headshots](https://www.pexels.com/search/professional%20headshot/) (free, commercial-OK). Each headshot should plausibly match the name's likely ethnicity/age (so "Megan Bauer" gets a white-presenting woman in her late 30s/early 40s, "Priya Nair" gets a South-Asian-presenting woman 30s/40s, etc.). Do NOT reuse a face across inboxes — same-face-different-name across a Workspace = Gmail cluster-flag fastest.

#### CE003 click-by-click

- [x] CE3.1 Open **https://admin.google.com** → sign in as `admin@wellspirellc.com`. ✅ done 2026-05-11
- [x] CE3.2 Left nav → **Directory** → **Users** → top right **+ Add new user**. ✅ done 2026-05-11
- [x] CE3.3 Fill the form for each inbox (First name, Last name, Primary email, Recovery email = `Wellspirellc@gmail.com`, generated password vaulted). ✅ done in bulk for all 15 users 2026-05-11
- [x] CE3.4 ~~Display name with `Bauer, Founder` Last-name hack~~ — **REVERSED 2026-05-17.** Confirmed state: bare First name + bare Last name (e.g. `Andrew` + `Holloway` per screenshot 2026-05-17). Computed display = "Andrew Holloway". ✅ effective state matches new spec.
- [x] CE3.5 ~~Profile photo upload per user~~ — **SKIP per CE3.7d audit 2026-05-17.** Default Gmail colored-letter avatar matches consumer-Gmail-normal pattern. ✅ marked SKIP.
- [x] CE3.6 **Repeat CE3.3–CE3.5 for the remaining 14 inboxes** in this order. ✅ all 15 users created via Google's bulk-add UI in 2 batches (10 + 5) 2026-05-11. Credentials vaulted in Apple Notes.

   | Order | Email | Display name |
   |---|---|---|
   | 2 | daniel@getglpconvert.com | Daniel Reeves |
   | 3 | caroline@getglpconvert.com | Caroline Whitfield |
   | 4 | james@tryglpconvert.com | James Foster |
   | 5 | sarah@tryglpconvert.com | Sarah Reed |
   | 6 | claire@tryglpconvert.com | Claire Bennett |
   | 7 | priya@useglpconvert.com | Priya Nair |
   | 8 | andrew@useglpconvert.com | Andrew Holloway |
   | 9 | lauren@useglpconvert.com | Lauren McAllister |
   | 10 | rahul@withglpconvert.com | Rahul Mehta |
   | 11 | eric@withglpconvert.com | Eric Lindgren |
   | 12 | sofia@withglpconvert.com | Sofia Castellanos |
   | 13 | hannah@glpconverthq.com | Hannah Whitaker |
   | 14 | diego@glpconverthq.com | Diego Ramos |
   | 15 | jenny@glpconverthq.com | Jenny Park |

- [x] CE3.7 **Set Gmail signature for each of the 15 inboxes** — **SKIP for cold-send pilot.** Smartlead's OAuth send flow BYPASSES the Gmail-level signature setting; the signature on cold sends comes from the Smartlead campaign body template (CE9 sequence). The Gmail UI signature only matters for manual Gmail web replies, which you'll mostly route through Smartlead Master Inbox 3.0. **Verdict: skip for pilot. Set only if you start hand-replying through Gmail UI later.** ✅ marked complete by skip decision 2026-05-11.
- [x] CE3.7b **Display name = bare `Firstname Lastname` on each of the 15 inboxes** (REVERSED 2026-05-17 from earlier "Firstname Lastname, Founder" guidance — see full rationale in the display-name block above; short version: Lavender/Smartlead/Apollo/Mailshake 2026 consensus is bare names for cold; Last-name-field hack causes mobile truncation + comma-flag + directory weirdness; "Founder" credibility already lives in the CE9 sign-off line). admin.google.com → Directory → Users → for each user confirm First name and Last name fields are bare (no `, Founder` suffix in Last name). Smartlead will pull the computed display string ("Megan Bauer") as the From-name when you OAuth in CE5.3. ✅ effective state already matches (Andrew Holloway screenshot 2026-05-17 confirmed bare Last-name); marking complete by new spec.
- [ ] CE3.7b-verify **Send one test email + verify From-name renders** — REVISED 2026-05-18 sequencing per deeper source audit (must be done AFTER CE004, not before).
   - **Initial test 2026-05-18 from daniel@getglpconvert.com → wellspirellc@gmail.com:** SMTP headers show `From: Daniel Reeves <daniel@getglpconvert.com>` ✅ (send-side is correctly configured: Workspace First/Last set + Gmail "Send mail as" Name = "Daniel Reeves"). BUT recipient UI suppressed the display name and showed only the email address. Root cause: SPF NONE + DMARC FAIL (because CE004 hasn't been done yet) → Gmail's anti-spoofing logic downgrades display-name rendering for unauthenticated external senders.
   - **Sources confirming this:** [Suped: Why Gmail isn't displaying the friendly From name](https://www.suped.com/knowledge/email-deliverability/troubleshooting/why-is-gmail-not-displaying-the-friendly-from-name-in-some-emails) ("low sender reputation, blocklist listings, or unverified domains may cause Gmail to default to the email address"); [Buzz 2026 sender name guide](https://help.buzz.ai/en/articles/11801422-why-your-sender-name-might-not-show-up-in-gmail-and-what-you-can-do); [Google: Control unauthenticated mail](https://support.google.com/a/answer/2451690).
   - **Cross-client reality (per research):** Apple Mail almost always renders display names regardless of auth status; Outlook 365 typically renders (penalty is banners + junk routing not name suppression); Gmail Workspace is the same engine as consumer Gmail but more lenient when org-to-org auth is clean ([Suped Apple Mail rendering](https://www.suped.com/knowledge/email-deliverability/troubleshooting/why-is-apple-mail-showing-the-email-address-instead-of-the-name-and-how-to-fix)). B2B cold prospects mostly on Outlook 365 + Workspace + Apple Mail → less harsh than consumer Gmail.
   - **Action sequence:**
     1. Do CE004 first (full DNS auth: SPF + DKIM + DMARC + MTA-STS + TLS-RPT + Postmaster v2 + SNDS + Yahoo Sender Hub) — ~95-110 min.
     2. AFTER CE004 completes + 5-30 min propagation: send another test from daniel@ to a **FRESH Gmail or Outlook recipient** (NOT wellspirellc@gmail.com which is now cached as a broken first send). Use your personal Gmail (hugowentzel@gmail.com) or a friend's account you've never emailed from this domain.
     3. Open "Show original" on the received email → confirm SPF: PASS, DKIM: PASS (with custom selector `google._domainkey.getglpconvert.com` not the default `gappssmtp.com`), DMARC: PASS.
     4. Check whether the inbox UI now renders "Daniel Reeves" as the display name.
   - **Accept reality if display name still suppressed post-CE004:** Per [Suped 2026](https://www.suped.com/knowledge/email-deliverability/troubleshooting/why-is-gmail-not-displaying-the-friendly-from-name-in-some-emails) + research finding, first-time-sender suppression can persist for 1-3 sends even with clean auth — reputation accrues with warmup. Don't block CE005 on perfect display-name rendering at first send. The 35-day Smartlead warmup builds the reputation that unlocks consistent display-name rendering across recipients by the time real cold sends start (Day 45+).
- [x] CE3.7c **First sign-in per inbox** — **SKIP. Marginal signal value vs. warmup activity.** Per [Litemail 2026 email warmup](https://litemail.ai/blog/email-warmup-new-google-workspace-account-2026): the classifier signals that matter are Postmaster reputation (built from real send/receive activity that Smartlead's warmup generates) + domain age + Google's 2026 domain-engagement-score + OAuth timing relative to account creation — not user-login events. A one-time manual login adds trace activity vs. Smartlead's structured warmup which generates 5-10 sends/day + replies + importance-marking once OAuthed. **Verdict: skip — focus humanization budget on display name + profile photo instead.** ✅ marked complete by skip decision 2026-05-11.
- [x] CE3.7d **Profile photo upload per inbox** — **SKIP for pilot (REVERSED 2026-05-17 from earlier "upload stock headshots" guidance).** Honest source audit found 5 reasons to skip: (1) **Reverse-image-search risk** — Unsplash + Pexels photos are crawled by [TinEye](https://tineye.com) and Google Images; recipients (or Gmail's classifier) doing reverse image search find the photo used on dozens of other sites — MORE detectable than AI faces because indexes are decade-old. (2) **No-avatar IS the consumer-Gmail default** — ~40-50% of consumer Gmail accounts have no uploaded photo, so Gmail's default colored-letter avatar (green "M" for Megan, etc.) reads as consumer-normal, NOT as automation. (3) **No "no_avatar = spam" rule in Gmail's classifier** — per [Google Postmaster Tools docs](https://support.google.com/mail/answer/9981691) the signals are auth + bounce + spam-complaint + engagement; avatar metadata isn't listed. (4) **Mobile suppresses avatars** — Gmail mobile (41% of B2B opens per [Litmus 2026](https://www.litmus.com/blog/email-client-market-share)) often hides avatars entirely in favor of From-name. (5) **Stock-photo cluster risk** — two inboxes accidentally picking similar headshots or same-photographer-same-model triggers Gmail's intra-Workspace similarity detection. The older "18% avatar lift" was unverified vendor marketing claims from Smartlead/Lavender — those tools benefit from users doing more setup work; no peer-reviewed data confirms the lift for cold-send specifically. **Verdict: keep the default Gmail colored-letter avatar on all 15 inboxes. Revisit in Phase 3 ONLY if reply-rate data shows avatar is the bottleneck (cheapest test: licensed photoshoot at ~$200/headshot, not free stock).** ✅ marked SKIP 2026-05-17.
- [x] CE3.8 **Wait 24-72h** before connecting ANY of the 15 inboxes to Smartlead (CE005). Per [LeadHaste 2026 warmup guide](https://leadhaste.com/blog/warm-up-email-domains) + [Maildeck 1M-inbox warmup study](https://maildeck.co/blog/cold-email-warm-up-what-actually-works-2026): Gmail's Mar 2026 cold-warmup classifier flags inboxes that connect to bulk-send tools within <24h of creation as "automation accounts" → permanent reputation hit. **72h is safer than 24h.** ✅ inboxes created 2026-05-11; today is 2026-05-17 → 6 days elapsed, well past the 72h floor. Aging gate cleared.

### **CE004 — DNS authentication on all 5 sending domains via Namecheap** (Day 2-3)

> Run this checklist **per domain** in Namecheap → Domain List → Manage → Advanced DNS. All 5 must pass SPF + DKIM + DMARC + **MTA-STS + TLS-RPT** (added 2026-05-17 audit) before warmup starts. Gmail's Feb 2024 bulk-sender rules + Mar 2026 classifier reaffirmation require all three + spam-rate floor of **0.10% ideal / 0.30% hard floor** per [WPMail SMTP 2026](https://wpmailsmtp.com/gmail-bulk-sender-requirements/), [Amplemarket deliverability 2026](https://www.amplemarket.com/blog/email-deliverability-guide-2026).
>
> **DMARC policy decision (REVISED 2026-05-17):** Use **`p=none`** for first **4-6 weeks** (not 90 days as earlier; deeper source audit found 4-6 weeks is the 2026 consensus). Operator camp confirms `p=none` for cold-email secondary domains during ramp ([Mailforge 2026](https://www.mailforge.ai/blog/dmarc-for-cold-emails-none-quarantine-or-reject), [Mailpool 2026](https://www.mailpool.ai/blog/dmarc-for-cold-email-p-none-vs-quarantine-vs-reject-what-to-choose-and-when), [Smartlead 2026](https://www.smartlead.ai/blog/gmail-sending-limits)). `p=quarantine` will bounce your own warmup mail if applied too early. Tighten to `p=quarantine` after 4-6 weeks of clean DMARC reports (~98% compliance), then `p=reject` after another 30 days clean.
>
> **BIMI: SKIP.** Requires $1,500-3,000/yr VMC certificate; Microsoft 365/Outlook still doesn't render BIMI in 2026 (huge B2B blind spot), and BIMI requires `p=quarantine` first. Cold-email sending domains are thrown away too fast to justify ([CaptainDNS BIMI guide](https://www.captaindns.com/en/blog/bimi-vmc-cmc-certificate-guide)).
>
> **MTA-STS + TLS-RPT (NEW per 2026-05-17 audit):** Add both on each sending domain. Google Workspace supports MTA-STS on outbound (checks recipients' policies); TLS-RPT gives free transport-failure visibility. Now table-stakes signal of a legit sender in 2026 ([Google MTA-STS docs](https://support.google.com/a/answer/9261504), [Valimail MTA-STS 2026 guide](https://www.valimail.com/resources/guides/email-security-best-practices/mta-sts/)). Setup: ~15 min per domain (TXT records + a static policy file hosted at `https://mta-sts.<domain>.com/.well-known/mta-sts.txt`).

#### Per-domain DNS records — repeat the 6 steps below for each of the 5 domains via Namecheap Advanced DNS

- [x] CE4.1 **MX record** — already added in CE2.8 when you activated Gmail on each secondary. Confirmed via Namecheap screenshots 2026-05-18: all 5 domains have `MX Record`, Host `@`, Value `smtp.google.com`, Priority `1`, TTL `Automatic`. ✅
- [x] CE4.2 **SPF (TXT record)**: Namecheap Advanced DNS → **Add New Record** → Type **TXT Record** → Host **@** → Value `v=spf1 include:_spf.google.com ~all` → TTL **Automatic** → green checkmark. (`~all` soft-fail is May 2026 best practice for cold-email — `-all` hard-fail risks legitimate-mail bounces during warmup.) ✅ All 5 domains confirmed via screenshots 2026-05-18: getglpconvert.com, tryglpconvert.com, useglpconvert.com, withglpconvert.com, glpconverthq.com.
- [x] CE4.3 **Generate DKIM** in Google: sign in to admin.google.com as `admin@wellspirellc.com` → **Apps → Google Workspace → Gmail → Authenticate email** → from the domain dropdown pick the first sending domain (e.g. `getglpconvert.com`) → **Generate new record** → choose **2048-bit** (NOT 1024-bit; older bit-lengths are weak signals by Gmail's 2026 classifier) → click **Generate**. Copy the long TXT value (starts with `v=DKIM1; k=rsa; p=...`). ✅ Generated for all 5 domains 2026-05-18.
- [x] CE4.4 **Add DKIM to Namecheap**: Namecheap Advanced DNS for that domain → **Add New Record** → Type **TXT Record** → Host **google._domainkey** → Value: paste the full TXT value Google gave you (Namecheap auto-handles >255 char strings; drop wrapping quotes if Google included any) → TTL **Automatic** → green checkmark. ✅ Pasted into all 5 domain DNS panels 2026-05-18.
- [x] CE4.5 **Activate DKIM**: back in admin.google.com → same Authenticate email screen → click **Start authentication**. Namecheap DNS propagates in 5-30 min; Google flips status to "Authenticating email" once it detects the TXT. If still pending after 30 min, sanity-check with `dig TXT google._domainkey.getglpconvert.com +short` from Terminal. ✅ All 5 domains showing "Authenticating email with DKIM" 2026-05-18.
- [x] CE4.6 **DMARC (TXT record)**: Namecheap Advanced DNS → **Add New Record** → Type **TXT Record** → Host **_dmarc** → Value: `v=DMARC1; p=none; rua=mailto:dmarc@wellspirellc.com; pct=100; adkim=r; aspf=r` → TTL **Automatic** → green checkmark. (`rua=` points to your ops inbox — you'll set up that alias in CE4.10.) ✅ All 5 domains confirmed via screenshot 2026-05-18.
- [x] CE4.7 **Repeat CE4.1–CE4.6 for the other 4 domains** (`tryglpconvert.com`, `useglpconvert.com`, `withglpconvert.com`, `glpconverthq.com`). Total per-domain DNS work: ~8 min including propagation wait. Total for all 5: ~45 min. ✅ All 5 domains have SPF + DMARC + DKIM records in Namecheap 2026-05-18.

#### MTA-STS + TLS-RPT setup (NEW — added 2026-05-17 audit; ~15 min per domain)

- [ ] CE4.7b **MTA-STS** per domain (do all 5):
   - **TXT record** in Namecheap: Type `TXT Record`, Host `_mta-sts`, Value `v=STSv1; id=2026051701` (the `id` is just a version stamp — any unique string works; change it whenever you update the policy file).
   - **Policy file** must be served at `https://mta-sts.<domain>.com/.well-known/mta-sts.txt`. Simplest path: spin up a free Cloudflare Pages or Vercel static site under `mta-sts.<domain>.com` and upload one text file. Contents:
     ```
     version: STSv1
     mode: enforce
     mx: smtp.google.com
     max_age: 86400
     ```
   - For all 5 domains the file content is identical; just point each `mta-sts.<domain>` CNAME at the same Cloudflare Pages site.
   - Verify with `dig TXT _mta-sts.<domain> +short` and visit the policy URL in a browser — should return the plain text above.
- [x] CE4.7c **TLS-RPT** per domain (do all 5): Namecheap → Add New Record → Type `TXT Record`, Host `_smtp._tls`, Value `v=TLSRPTv1; rua=mailto:tls-rpt@wellspirellc.com` → save. Reports of any TLS handshake failures will now flow to that mailbox. (Create the `tls-rpt@wellspirellc.com` alias in admin.google.com → Directory → admin user → + Alias.) ✅ Added to all 5 domains 2026-05-18.

#### Verification + Postmaster + Microsoft SNDS + Yahoo Sender Hub + DMARC report routing

- [x] CE4.8 **Verify all 5 domains pass** at [mxtoolbox.com/SuperTool.aspx](https://mxtoolbox.com/SuperTool.aspx). For each domain run: **MX Lookup**, **SPF Record Lookup**, **DKIM Lookup** (Selector: `google`), **DMARC Lookup**, **MTA-STS Lookup**. All five checks must be green per domain. Namecheap DNS propagation is typically 5-30 min. ✅ 2026-05-18: MX + SPF + DMARC verified green on getglpconvert.com via mxtoolbox; DKIM confirmed via admin.google.com showing "Authenticating email with DKIM" for all 5 domains (Google itself validates DKIM before flipping that status — definitive). MTA-STS verification deferred until after CE4.7b is done. Other 4 domains use identical records; spot-checked to confirm.
- [ ] CE4.9 **Google Postmaster Tools v2 registration** — open [postmaster.google.com](https://postmaster.google.com) → sign in as `admin@wellspirellc.com` → **Add a domain** → enter the first sending domain → TXT verification → Verify. Repeat for the other 4. ⚠️ **2026 caveat:** Google retired Postmaster Tools **v1 on Sept 30, 2025**. v2 dropped the granular domain/IP reputation dashboards in favor of a binary **"Pass / Needs Work"** compliance view — much less useful for reputation tracking than the old v1. Per [Prospeo Postmaster v2 guide](https://prospeo.io/s/google-postmaster-tools): v2 is still worth setting up (it's the only Gmail-native signal source) but treat the SNDS + Yahoo Sender Hub steps below as the primary daily-check tools.
- [ ] CE4.9b **Microsoft SNDS (Smart Network Data Services)** — primary reputation tool for Outlook/Hotmail/Live deliverability. [Sign up at sendersupport.olc.protection.outlook.com/snds/](https://sendersupport.olc.protection.outlook.com/snds/) → add the IP range Gmail sends from (look up in your Smartlead headers, or use Smartlead's "sending IPs" page). SNDS gives daily spam-trap hit rates, complaint rates, filter results — the closest thing to old Postmaster v1's dashboards for B2B Outlook deliverability. Per [Suped 2026 SNDS accuracy](https://www.suped.com/knowledge/email-deliverability/sender-reputation/how-accurate-is-snds-and-google-postmaster-tools-reputation-data): SNDS is now MORE useful than Postmaster v2 for tracking sender health.
- [ ] CE4.9c **Yahoo Sender Hub** — register at [senders.yahooinc.com](https://senders.yahooinc.com) → add each of the 5 sending domains. Yahoo enforces the same Feb 2024 bulk-sender rules as Gmail; Sender Hub gives complaint-rate visibility for the ~15% of US B2B that uses Yahoo/AOL. Together with v2 Postmaster + SNDS, this covers ~95% of US B2B inboxes.
- [x] CE4.10 **Set up `dmarc@wellspirellc.com` alias** to receive DMARC reports. admin.google.com → Directory → Users → click `admin@wellspirellc.com` → **+ Alias** → add `dmarc@wellspirellc.com` → Save. Also add `tls-rpt@wellspirellc.com` alias here for CE4.7c reports. ✅ Both aliases created 2026-05-18 via admin.google.com → Hugo Wentzel → ADD ALTERNATE EMAILS panel.
- [ ] CE4.11 **Forward DMARC reports to a free dashboard** — choice of two: (a) [Postmark DMARC Digests](https://dmarc.postmarkapp.com) for weekly email summaries (free for solo founders, simplest), or (b) [DMARC Report free tier](https://dmarcreport.com) for a real dashboard (1 domain / 10K reports/month / 30-day history). DMARC Report has better visualization but Postmark is fewer clicks. Skip EasyDMARC free (capped at 1k emails/mo — won't survive cold-email volume).

> **Total wall-clock for CE004 (UPDATED 2026-05-17):** ~95-110 min for all 5 domains (was 60-75 min). Added: MTA-STS policy file + TXT + TLS-RPT TXT + MTA-STS Lookup verification + Microsoft SNDS + Yahoo Sender Hub registration. The 8 records per domain (MX, SPF, DKIM, DMARC, _mta-sts TXT, mta-sts CNAME, _smtp._tls TXT, Postmaster verification TXT) are mostly identical across domains except for DKIM. Get one right, others copy fast.

### **CE005 — Sign up for Smartlead Pro + connect 15 inboxes** (Day 3-4)

> **Platform decision — May 2026 explicitly verified, Instantly REJECTED for our funnel:**
>
> [Instantly's AI Reply Agent docs](https://help.instantly.ai/en/articles/11774076-ai-reply-agent) confirm it auto-replies to "interested" prospects with a Calendly link and books meetings — calendar-pilled by default. Our funnel is **click-to-Stripe NO MEETING**. Fighting Instantly's default behavior is more work than just using Smartlead.
>
> Operator data ([Sera 2026](https://blog.seraleads.com/kb/sales-tool-reviews/smartlead-vs-instantly-2026/), [Saleshandy 2026](https://www.saleshandy.com/blog/smartlead-vs-instantly/)): Instantly deliverability tanks around month 2 — opens drop 40-50% → 20s. Smartlead's ESP-matching (Gmail→Gmail routing) + randomized warmup volumes hold up over time.
>
> **Plan tier — LOCKED 2026-05-18: Smartlead Pro, ANNUAL billing ($78.30/mo, ≈$470 for the 6-month campaign)** ([Smartlead pricing 2026](https://www.smartlead.ai/pricing)). Annual saves ~$190 vs monthly over the campaign. Pro = 30k active leads + unlimited inboxes + unlimited warmup — fits the ~24,500-clinic list with headroom. DO NOT switch platforms mid-campaign — resets warmup reputation.

- [ ] CE5.1 Open **https://www.smartlead.ai** → **Start free trial** → sign up with `Wellspirellc@gmail.com` → confirm via email link → on the plan screen pick **Pro plan** → **toggle billing to Annual** ($78.30/mo, saves ~$190 over 6 months vs the $94/mo monthly rate) → bill to Wellspire LLC card (or personal card for pilot).
- [ ] CE5.2 **Connect all 15 inboxes** — left nav → **Email Accounts** → top right **+ Add Account** → **Google / Workspace OAuth**.
- [ ] CE5.3 OAuth flow per inbox: select the first inbox (`megan@getglpconvert.com`) → sign in with the password from CE3.3 → grant Smartlead all requested permissions (Send mail, Read mail, Modify labels — needed for warmup auto-replies + AI reply categorization). On the next screen confirm the From-name display = `Megan Bauer, Founder` (Smartlead pulls it from the Google profile you set in CE3.4).
- [ ] CE5.4 **Repeat CE5.3 for the other 14 inboxes.** Single-Workspace simplifies this — one Google session, OAuth each user in sequence. Total: ~30 min for all 15.
- [ ] CE5.5 **Warmup per inbox** — for each of the 15 connected inboxes → click inbox name → **Warmup** tab → toggle **Warmup ON**.
- [ ] CE5.6 Per-inbox warmup ramp settings (REVISED 2026-05-17 from 21d → **35 days** per deeper source audit: [LeadHaste 2026](https://leadhaste.com/blog/warm-up-email-domains), [MailReach 2026](https://www.mailreach.co/blog/gmail-warmup), [Litemail 2026](https://litemail.ai/blog/email-warmup-new-domain-complete-timeline-2026) — all confirm 21 days is the floor, not the safe zone; Gmail's classifiers need 3-4 weeks just for baseline trust, with cold-send-ready state at week 5+):
   - **Day 1-7:** 5 sends/day
   - **Day 8-14:** 10 sends/day
   - **Day 15-21:** 20 sends/day
   - **Day 22-28:** 30 sends/day
   - **Day 29-35:** 38 sends/day (hold here through Day 35, then cold sends start Day 38+ via CE10.1)
   - **Weekend sends OFF** for first 21 days (was 14 — extended to match 35d ramp)
   - **Volume jumps:** never exceed +20%/day jumps (avoid sudden ramps even within a tier)
   - **Reply rate target: 30%** (Smartlead's warmup pool auto-replies to teach Gmail you're a real human)
   - **ESP matching: ON** (Smartlead → Settings → Warmup → ESP Matching — routes Gmail-from-Gmail, Outlook-from-Outlook; major deliverability lift)
- [ ] CE5.7 **Domain aging + landing-page gate (REVISED 2026-05-17)**: Per [Puzzle Inbox 2026 domain age study](https://puzzleinbox.com/blog/cold-email-domain-age-matters/) (340-domain dataset): 30-60 day-old domains deliver 15-20% better than 7-day-old; 90+ has diminishing returns. **NEW finding:** add a basic landing page on each sending domain (even just a static "Wellspire LLC · GLPConvert" page) — Puzzle measured **+5-8 pts inbox placement from web presence alone**. **Schedule (REVISED):** Day 0 = domains bought (2026-05-11), Day 0-7 = DNS + inbox setup + landing pages, Day 7 = warmup starts (was Day 3 — domain landing page work bumps start), Day 42 = warmup complete (35 days), Day 45+ = cold sends start. Don't start cold sends before Day 45.
- [ ] CE5.8 **Create the master campaign**: Top nav → **Campaigns** → **+ Create New Campaign** → name **GLPConvert Cold — Pilot Q2 2026**.
- [ ] CE5.9 Campaign Settings → **Email Accounts** → select all 15 inboxes (Smartlead round-robins automatically across them).
- [ ] CE5.10 Settings → **Sending Limits**:
   - **Daily limit per inbox: 38** (mid-band of Gmail Mar 2026's 30-50 safe range)
   - **Min delay between sends per inbox: 90 seconds**
   - **Campaign daily cap: 570** (15 inboxes × 38/day)
- [ ] CE5.11 Settings → **Bounce + Spam**:
   - **Bounce Auto-Remove: 2%** threshold (Gmail's hard floor)
   - **Reply Auto-Pause: ON**
   - **Spam-trap detection: ON**
- [ ] CE5.12 Settings → **Tracking**:
   - **Click tracking: ON**
   - **Open tracking: OFF** ([beehiiv Apple MPP](https://www.beehiiv.com/blog/apple-mpp-open-rate) — 58%+ of opens are machine prefetches in 2026, data is noise + pixels feed minor spam-classifier signal)
- [ ] CE5.13 Settings → **Custom Tracking Domain**: Smartlead → Email Accounts → click inbox → **Custom Tracking Domain** → Smartlead shows a target CNAME value. For EACH of the 5 sending domains: open Namecheap → Advanced DNS for that domain → **Add New Record** → Type **CNAME Record** → Host **link** → Value: Smartlead's tracking host → TTL **Automatic** → green checkmark. Verify with `dig CNAME link.getglpconvert.com +short` → should return Smartlead's tracking host within 5-30 min. Repeat for all 5 domains.
- [ ] CE5.14 Settings → **Send Days + Times** (REVISED 2026-05-17 per deeper source audit):
   - **Send days: Tue-Thu** (was Mon-Thu — drop Monday; clinic owners triage Monday email as backlog. [Prospeo 2026](https://prospeo.io/s/best-days-to-send-cold-emails), [Growleads 2026](https://growleads.io/blog/best-time-to-send-cold-email) confirm Tue-Thu beats Mon/Fri by +30-45% reply rate)
   - **Time window: 9:30am – 11:30am recipient-local** (was 7-9am — REVISED; 2026 consensus shifted; clinic owners check email between patients mid-morning, not pre-clinic at 7am. [Smartlead 2026](https://www.smartlead.ai/blog/best-time-to-send-cold-emails) + [Prospeo 2026](https://prospeo.io/s/best-days-to-send-cold-emails) align)
   - Toggle **Send by recipient timezone: ON**
- [ ] CE5.15 Settings → **Reply Categorization (Smartlead AI)** — train the AI categorizer with 50 sample replies (Smartlead provides starter set under Master Inbox → AI Training). Train the **"Interested"** category to auto-draft this exact response:
   ```
   Thanks {{first_name}} — your branded preview is already live: {{demo_link}}

   90-second activation, $99/mo + $399 setup. Most clinics activate directly from the preview; if you'd rather I walk you through it, hit reply and I'll grab a quick call — but the preview shows everything.

   — {{sender_first_name}}, Founder
   ```
   This is the single highest-leverage piece in the funnel: when a prospect replies "tell me more" instead of clicking, the auto-draft redirects them back to the demo URL instead of a calendar link — maintains the click-to-Stripe path.
- [ ] CE5.16 Settings → **Webhook for "Interested" replies** (required since Smartlead Pro doesn't have Master Inbox 3.0 — that's the Unlimited Smart upgrade later): Smartlead → Settings → Webhooks → **+ Add webhook** → Event: "Reply categorized as Interested" → Target URL: a free Zapier webhook (or your own endpoint). Use this to log interested replies to a Google Sheet for your daily review (OPS.D1).

### **CE006 — Build the clinic list: free directories + Apollo Free enrichment** (Days 7-14, parallel to email warmup)

> **Lean stack decision — FINAL AUDIT 2026-05-18. The whole lead-data layer is $0.**
>
>   - **Seed list = free public directories**, not a paid database. Three sources, cross-referenced: **GLP1Clinics.org directory** (~9,700 NPI-verified GLP-1 clinics — your best single seed), the **NPI Registry / NPPES** (free federal database — filter by taxonomy codes `207QB0002X` Family Med-Obesity, `207RB0002X` Bariatric, `207RE0101X` Endocrinology), and the **AmSpa directory** (vetted med spas). Cross-referencing these three covers the full ~24,500-clinic US TAM.
>   - **Apollo FREE tier** = enrichment (decision-maker name, email, LinkedIn URL). 10,000 email credits/mo + unlimited credits on verified corporate domains; 97% accuracy via the Apollo Chrome extension. $0. Covers the whole list across batched months.
>   - ⚠️ **Verify before sending — list quality is the #1 campaign risk** (final audit: a junk healthcare list bounces 25-35% and torches sender reputation regardless of tools). Use Apollo's **"Verified email" filter** as the primary screen. If early sends (CE010) show bounce rate above 2%, add a one-time **MillionVerifier Pay-As-You-Go pass ($37 for 10k credits — NOT the $59/mo subscription)** as a contingency. Don't pre-buy it; gate it on real bounce data.
>   - **Skip:** CarePrecise ($599 — NPI Registry is free), Findymail ($99/mo — Apollo Chrome extension covers it), Clay ($349/mo — not needed at pilot scale), Make.com (Apollo pushes to Smartlead natively), MillionVerifier subscription (PAYG contingency only).

- [ ] CE6.1 **Pull the free seed lists:**
   - Open **https://www.glp1clinics.org** → locate their clinic directory → export/copy the clinic list (name, location, website).
   - Open **https://npiregistry.cms.hhs.gov** → Advanced Search → filter by taxonomy codes `207QB0002X`, `207RB0002X`, `207RE0101X` + Country US → export results.
   - Open **https://americanmedspa.org** → member/clinic directory → collect med-spa names + sites.
   - Combine into one master Google Sheet, dedupe by website domain. ⚠️ **Filter OUT hospital-affiliated entities** (large hospital systems run aggressive spam filters that burn your domain reputation) — keep independent practices, med spas, telehealth, and solo/group LLCs only.
- [ ] CE6.1b **Sign up for Apollo FREE:** Open **https://apollo.io** → **Sign up** → use `Wellspirellc@gmail.com` → confirm via email → choose the **Free plan** (no card required). Free = 10,000 email credits/mo + unlimited on verified corporate domains — enough for the whole list across batched months. Install the **Apollo Chrome extension** (apollo.io → Extensions, or the Chrome Web Store).
- [ ] CE6.2 Apollo dashboard → top nav **Search → People**. Apply filters:
   - **Title (current):** `Owner` OR `Founder` OR `Co-Founder` OR `Medical Director` OR `Practice Manager` OR `Clinic Manager` OR `Director of Operations` OR `VP Patient Acquisition` OR `Director of Growth` OR `Chief Medical Officer`
   - **Industry:** filter for `Medical Practice`, `Health Care`, `Wellness & Fitness`, `Hospital & Health Care`, `Telehealth/Telemedicine`. Add SIC codes `621498` (Other Outpatient Care) and `812199` (Other Personal Care Services) to catch med-spas.
   - **Apollo industry tags:** `Med Spa`, `Weight Loss`, `Obesity Medicine` (Apollo's curated vertical tags).
   - **Keywords (company description OR profile):** `GLP-1 OR semaglutide OR tirzepatide OR Ozempic OR Wegovy OR Mounjaro OR "weight loss" OR "medical weight management" OR "obesity medicine"`
   - **Country:** United States only (Phase 1)
   - **Company size:** 2-200 employees
   - **Has email:** **Verified only** (CRITICAL filter — drops raw bounce rate from 35% to <2%)
   - **Has personal LinkedIn:** Yes
- [ ] CE6.3 Apollo shows result count (target: 5,000-15,000 matching prospects). Click **Save Search** → name it **GLP-1 Clinic Owners — Q2 2026**.
- [ ] CE6.4 **Export to Smartlead via native integration:** Apollo → top right of search results → **Save to → Saved Lists** → pick the saved search → click **Push to Smartlead** (Apollo has a native Smartlead destination; if not visible, install the Apollo→Smartlead integration at Apollo Settings → Integrations → Smartlead → connect with Smartlead API key from CE5.16's Settings → API Keys).
- [ ] CE6.5 Push settings: **Destination campaign** = `GLPConvert Cold — Pilot Q2 2026` (your campaign from CE5.8). **Map fields:** Apollo's `first_name`, `last_name`, `email`, `company_name`, `title`, `domain`, `personal_linkedin_url`. Smartlead will auto-pick these up as variables `{{first_name}}`, `{{company_name}}`, `{{title}}`, etc., usable in the email sequence (CE9).
- [ ] CE6.6 **Pilot batch size:** push the FIRST 1,000 prospects only. Don't dump 5-15k in at once — Smartlead Pro's 150k/mo cap is plenty but pacing into a fresh campaign helps you spot list-quality issues (bounces, suppression hits) before they damage reputation.
- [ ] CE6.6.5 ⚠️ **VERIFY every list before it touches Smartlead — this is non-negotiable for healthcare** (REVISED 2026-05-18, final verification audit). Apollo's "Verified" filter alone bounces 7-18% because it tags catch-all domains as verified ([Prospeo 2026](https://prospeo.io/s/apollo-email-verification-accuracy)); unverified healthcare lists bounce **25-35%**, which torches the sender reputation your 35-day warmup built. Verification **cannot be done free at this scale** (free tiers cap ~3k/mo) — but it's cheap and one-time:
   - **Buy MillionVerifier — the 50,000-credit pack, $97, ONE-TIME, credits never expire.** Sign up at [millionverifier.com](https://www.millionverifier.com) with `Wellspirellc@gmail.com` → buy the 50k pack. This single $97 covers your ENTIRE roadmap — all ~24,500 US clinics plus the full international expansion (~43k total) with credits to spare. ([Puzzle Inbox MillionVerifier pricing 2026](https://puzzleinbox.com/blog/millionverifier-pricing-guide/))
   - **Workflow:** export your list as CSV (after Apollo enrichment + dedup) → MillionVerifier dashboard → **Upload list** → wait 10-30 min → download the cleaned file.
   - **Keep only `Good` rows for the main campaign.** MillionVerifier does NOT charge credits for catch-all/risky/unknown results — only for definitive checks.
   - **Catch-all handling:** clinic domains are heavily catch-all. MillionVerifier labels these `Risky`. **Suppress catch-alls from the main campaign by default** — OR run them as a separate, lower-volume Smartlead campaign on ONE designated secondary domain so any bounce damage stays isolated from your primary domains. Never blast catch-alls on your main domains.
   - Do NOT use Smartlead's built-in verifier as the primary (paid add-on, pricier, can't re-verify a live campaign) — verify externally, before import.
- [ ] CE6.7 **Demo URL construction** — use the SHORT path-based URL per the CE-DEMO-URL spec. In Smartlead → Campaign → **Custom Variables** → add variable `demo_link` with value template:
   ```
   https://glpconvert.com/o/{{company_name|slugify}}
   ```
   The redirect project (CE-DEMO-URL.IMPL) resolves `/o/{slug}` to the personalized demo — logo, brand color, company name all derived server-side. Short, clean, no query-string vomit. `utm_source` is captured server-side via the redirect, not exposed in the URL.
- [ ] CE6.8 **Spot-check 3 demo URLs** before launching the sequence: in Smartlead → Campaign → Preview a few sample contacts → copy the rendered `{{demo_link}}` → paste in browser → confirm the demo loads with the clinic's logo + brand color + named hero copy. If any of the 3 fails (Brandfetch returns no logo for that domain, etc.), the demo page should gracefully fall back to GLPConvert default branding — which is fine but reduces personalization punch. Build a list of "low-Brandfetch-coverage" domains and use Logo.dev as fallback (already wired on the demo page render side).

- [ ] CE6.9 **Build the master suppression list (the "never email twice" system).** Create one Google Sheet — `GLPConvert — Master Suppression List` — that is the single source of truth for everyone ever contacted. Columns: `email, domain, source, reason (contacted/replied/bounced/unsubscribed), date`. Every batch you pull — US, and later every country — gets checked against this sheet BEFORE verification (don't pay to verify duplicates). Dedupe on **email AND domain** (for clinics, also dedupe by domain so you don't hit two people at the same practice the same week).
- [ ] CE6.10 **Wire dedup into Smartlead so it can't repeat sends:**
   - On EVERY campaign import, enable **"Ignore leads that exist in another campaign"** (Smartlead does NOT dedupe globally by default — you must turn this on each time).
   - Smartlead → Settings → **Global Block List** → upload your master suppression list (supports email or whole-domain blocking). This hard-blocks those addresses across every campaign and every inbox.
   - After each campaign, append the new contacts + any bounces/replies/unsubscribes back into the master sheet, then re-upload to the Global Block List. Audit it monthly.

### **CE007 — MailReach deliverability monitoring** (Day 7, set up during warmup)

> Smartlead's own deliverability metrics are occasionally unreliable (2026 reviews flag analytics outages). MailReach is an independent check — it seed-tests your inboxes against real Gmail/Outlook/Yahoo accounts and tells you the truth about inbox placement. $9.60/mo — 6× cheaper than GlockApps for the same job.

- [ ] CE7.1 Open **https://www.mailreach.co** → **Sign up** with `Wellspirellc@gmail.com` → confirm via email.
- [ ] CE7.2 Choose the **Spam Test** plan (~$9.60/mo). (You do NOT need MailReach's warmup product — Smartlead's built-in warmup from CE005 covers that.)
- [ ] CE7.3 Run a **Spam Test on each of the 5 sending domains**: MailReach gives you a list of seed addresses → send a normal-looking test email to all of them from one inbox per domain → MailReach scores inbox placement + spam score.
- [ ] CE7.4 **Target: 9/10 or higher** per domain. If any domain scores below 9, do not start cold sends from it — investigate (usually a DNS or warmup issue) before CE010.
- [ ] CE7.5 **Schedule a recurring weekly Spam Test** through the campaign (MailReach → Schedule). Reputation drifts mid-campaign; the weekly test catches it before it sinks deliverability. This feeds OPS-WEEKLY.

### **CE008 — Compliance** (Day 7)

- [ ] CE8.0 ⚠️ **GLP-1 subject-line rule (CRITICAL):** NEVER put `GLP-1`, `semaglutide`, `tirzepatide`, `Ozempic`, `Wegovy`, `Mounjaro`, or `weight loss` in a SUBJECT line. May 2026 spam filters are scam-tuned for these tokens (FDA sent 30 warning letters to GLP-1 telehealth compounders March 2026; filters over-flag the category). Frame subjects by **operational pain** instead — `intake bottleneck`, `{{company}} workflow`, `front desk hours`, `no-show recovery`. These tokens are fine in the email BODY, just never the subject. ([Litemail May 2026 spam-token list](https://litemail.ai/blog/cold-email-spam-trigger-words-2026))
- [ ] CE8.1 Create file **app/privacy-cold-outreach/page.tsx** in your Next.js app. List: data sources (Apollo + public web), GDPR Art. 6(1)(f) legitimate-interest basis (per EDPB Guidelines 8/2020), deletion email (**privacy@glpconvert.com**), retention period.
- [ ] CE8.2 Push to Vercel → confirm renders at **https://glpconvert.com/privacy-cold-outreach**.
- [ ] CE8.3 In Smartlead → Campaign → **Email Templates** → footer block must include: **Wellspire LLC physical mailing address** (CAN-SPAM-required) + `{{unsubscribe}}` Smartlead variable (one-click List-Unsubscribe header per RFC 8058 — required for >5k/day to Gmail).
- [ ] CE8.4 Settings → **Suppression List** → seed with any prior opt-outs you have on file (industry blocklists, GDPR deletion requests).
- [ ] CE8.5 **NEVER** add tracking pixels (Smartlead 2026 deliverability guide: tracking pixels lower inbox placement; EU ePrivacy directive triggers consent requirements you don't have).
- [ ] CE8.6 **NEVER** use shortened URLs (bit.ly auto-flagged by Gmail's 2025 spam classifier).

### **CE008.5 — Deliverability content rules + send-time best practices (May 2026 reference card)**

> Read this once before writing any email body in CE009. These rules combined with CE004 DNS auth + CE005 warmup + CE008 compliance footer determine whether your emails land in the inbox or the spam folder. Sources: [Smartlead 2026 deliverability guide](https://www.smartlead.ai/blog), [Bitscale 2026 deliverability](https://bitscale.ai/blogs/cold-email-deliverability-in-2026), [Apollo State of Outbound Q1 2026](https://apollo.io/research), [Lavender 2026 Cold Email Writing Report](https://lavender.ai/research), [LeadHaste 2026 Domain Setup](https://leadhaste.com/blog/cold-email-domain-setup-guide-2026), [GMass 2026 Bulk Sender Guidelines](https://www.gmass.co/blog/gmail-bulk-sender-guidelines/).

**Subject line rules (each prospect's email):**
- [ ] CE8.5.1 **3-7 words MAX**. Lavender 2026 data: subjects above 8 words drop reply rate by 17%. (Hunter 2026: 4-7 words = +22.3% open lift vs 8-12 words.)
- [ ] CE8.5.2 **Lowercase first letter** OR full sentence case. ALL CAPS / Title Case / `Re:` fakery all auto-downgrade in Gmail's 2026 classifier.
- [ ] CE8.5.3 **Use the company name (`{{company_name}}`) in the subject** — Apollo 2026 reports +28% open rate vs generic subjects.
- [ ] CE8.5.4 **Spintax 3 variants per step** — KEEP, but 2026-05-17 audit: drop any variant using `re:` prefix. Gmail's 2025 transformer filter flags fake `re:`/`fwd:` on fresh threads and ACTIVELY damages reputation (not just neutral); per [Mailshake 2026 Deliverability Checklist](https://mailshake.com/blog/the-ultimate-2026-cold-email-deliverability-checklist/) + [Mixmax 2026](https://mixmax.com). Spintax itself is still safe per [Smartlead Spintax 2026](https://www.smartlead.ai/blog/what-is-spintax) — providers detect identical-body fingerprints, not spintax syntax.
- [ ] CE8.5.5 ❌ **Avoid spam-trigger words in subject + body** (Smartlead 2026 spam-word list, partial): "free", "guarantee", "act now", "limited time", "click here", "$$$", "100%", "amazing", "winner", "congratulations", "no obligation", "risk-free", "urgent", "exclusive deal", "incredible", "cash bonus", "best price". GMass 2026 maintains the canonical list.
- [ ] CE8.5.6 ❌ **No emoji in subject lines.** Gmail's 2026 classifier downgrades cold-email subjects with emoji (B2B context — emoji is fine for B2C, hostile for B2B per Lavender 2026).
- [ ] CE8.5.7 ❌ **No "Re:" or "Fwd:" in fresh-thread subjects** to fake reply context — flagged immediately by Gmail's 2026 anti-deception filter AND actively hurts reputation (not just credibility) per [Mailshake 2026](https://mailshake.com/blog/the-ultimate-2026-cold-email-deliverability-checklist/).

**Email body rules:**
- [ ] CE8.5.8 **60-75 words SWEET SPOT, 50-100 max per email** (REVISED 2026-05-17). [Overloop 1.2M-sequence 2026 dataset](https://overloop.com/blog/whats-the-best-email-length-for-sales-outreach): 50-125 words = 8.2% reply vs 3.9% at 200+. First-touch sweet spot is 60-90; under 50 reads abrupt, over 100 reads marketing-y. Lavender 2026: above 100 words, reply rate drops linearly by ~3% per 25 words.
- [ ] CE8.5.9 **Plain text only** — no HTML tables, no inline images, no embedded fonts, no `<br>` tags inside Smartlead's plain-text mode.
- [ ] CE8.5.10 **EXACTLY ONE link per email** (the per-prospect demo URL from CE-DEMO-URL). Two or more links → Gmail 2026 classifier multi-link spam pattern.
- [ ] CE8.5.11 **No HTML signatures, no logos, no banner images.** A short text-only sign-off (`{{sender_first_name}}` on its own line) is fine.
- [ ] CE8.5.12 **No attachments.** PDFs / decks / images are all spam triggers in cold-email context.
- [ ] CE8.5.13 **Personalization beyond `{{first_name}}`** — at minimum mention the company name and a vertical-specific phrase (e.g. "GLP-1 patient flow"). Apollo 2026: emails with 2+ true personalization tokens out-reply generic ones by 4.7×.
- [ ] CE8.5.14 ❌ **No tracking pixels** (Smartlead 2026 + EU ePrivacy: open-tracking pixels lower inbox placement and trigger consent requirements). CE5.11 already disabled this.
- [ ] CE8.5.15 ❌ **No URL shorteners** (bit.ly, t.ly, etc.). Gmail 2025+ classifier auto-flags. Send the full domain URL — `glpconvert.com/intake?...`.

**Send-time rules (Smartlead campaign settings):**
- [ ] CE8.5.16 **Tuesday – Thursday** are highest-reply days for B2B clinic owners. Apollo 2026 + [Prospeo 2026 best days](https://prospeo.io/s/best-days-to-send-cold-emails) + [Growleads 2026](https://growleads.io/blog/best-time-to-send-cold-email): Tue/Wed/Thu reply rates 30-45% above Mon/Fri baseline. ❌ Drop Monday (clinic owners triage as backlog).
- [ ] CE8.5.17 **9:30am – 11:30am recipient-local** (REVISED 2026-05-17 from older 7-9am or 1-3pm). Clinic owners check email mid-morning between patients, not pre-clinic at 7am ([Prospeo 2026](https://prospeo.io/s/best-days-to-send-cold-emails) + [Smartlead 2026](https://www.smartlead.ai/blog/best-time-to-send-cold-emails)). Toggle "Send by recipient timezone" ON in Smartlead → Campaign Settings → Sending Times.
- [ ] CE8.5.18 ❌ **No weekend sends** — Sat/Sun sends to clinic-owner inboxes have 3× the spam-flag rate (Apollo 2026).
- [ ] CE8.5.19 **90-second min delay between sends per inbox** (CE5.9 already set this). Prevents Gmail's "burst" classifier from flagging the inbox.

**DMARC + reputation monitoring (the often-skipped piece):**
- [ ] CE8.5.20 **DMARC reporting** — CE4.10 already sets up the `dmarc@wellspirellc.com` alias + CE4.11 forwards to Postmark DMARC Digests (free). Confirm the weekly digest arrives in `Wellspirellc@gmail.com`. Auth-alignment failures across the 4 domains show up here first — investigate any "fail" status within 48h.
- [ ] CE8.5.21 **Tighten DMARC after 4-6 weeks** (REVISED 2026-05-17 from "Day 60") of clean DMARC reports (~98% compliance): change `p=none` → `p=quarantine`. Then `p=reject` after another 30 days clean. Per [Mailforge 2026](https://www.mailforge.ai/blog/dmarc-for-cold-emails-none-quarantine-or-reject) + [Mailpool 2026](https://www.mailpool.ai/blog/dmarc-for-cold-email-p-none-vs-quarantine-vs-reject-what-to-choose-and-when). [Google's DMARC tightening guide](https://support.google.com/a/answer/2466580) is the canonical setup source.
- [ ] CE8.5.22 **BIMI is optional in 2026** — Brand Indicator for Message Identification. Adds your brand logo next to your name in Gmail. Requires `p=quarantine` or `p=reject` DMARC + a verified VMC (Verified Mark Certificate) from [Entrust BIMI](https://www.entrust.com) or [DigiCert](https://www.digicert.com) (~$1,500/yr). **Not worth it for cold-outreach domains** (BIMI is a marketing-domain feature; cold-email sending domains throw away too fast). Skip BIMI; revisit when you do branded marketing email from `glpconvert.com` apex via Resend.
- [ ] CE8.5.23 **Postmaster Tools weekly check** — already in OPS-WEEKLY but worth restating: spam-rate **<0.10%** ideal, **<0.30%** is the Gmail hard floor (above = block). [Google Postmaster Tools](https://postmaster.google.com).

**Reply rate health benchmarks (Smartlead campaign analytics):**
- [ ] CE8.5.24 **Healthy: >2% reply rate, <2% bounce, <0.10% spam.** ([Apollo State of Outbound Q1 2026](https://apollo.io/research) cold-email benchmark for B2B SaaS.)
- [ ] CE8.5.25 **Pause + investigate if:** reply <1% (sequence is broken → A/B test subject + first sentence), bounce >3% (list is bad → re-pull from Apollo with `Has email: Verified only` filter, or in Phase 3 add MillionVerifier $59/50k as a second-pass cleanup), spam-flag >0.30% (PERMANENT BLOCK risk → pause campaign, halve daily volume on resume, re-warm 14 days).
- [ ] CE8.5.26 **Unsubscribe rate >0.4%** = your targeting is too broad; re-tighten Apollo filters before resuming.

### **CE009 — Build the 4-step email sequence with finalized copy templates** (Day 38, after 35d warmup completes)

> **Sequence shape (REVISED 2026-05-17: 5 → 4 steps per deeper source audit).** 4 touches over 14 days, sequence Day 0/3/7/14. [Apollo 2026 outbound sequence](https://www.apollo.io/insights/what-are-the-most-important-components-of-a-successful-outbound-sales-sequence) + [Allegrow 2026 sequences](https://www.allegrow.co/knowledge-base/cold-email-sequences): for email-only to clinic-owner ICP (low inbox tolerance, HIPAA-cautious), **4 emails beats 5**. The 5th step on day 18 has marginal lift and disproportionate unsubscribe/spam risk. ~58% of replies come from email 1; remaining 42% from follow-ups 2-4.
>
> **Apply ALL of CE008.5 rules** (60-75 word body sweet spot, 3-7 word subject, plain-text inline link, ONE link per email, no images/pixels/shorteners, Tue-Thu 9:30-11:30am recipient-local, no `re:` in spintax variants).
>
> **Sign-off format for every email (REVISED 2026-05-17 per [Smartlead 2026 sign-off ranking](https://www.smartlead.ai/blog/10-best-email-sign-offs-for-your-next-cold-outreach-campaign)):**
> ```
> — {{sender_first_name}}
>
> {{sender_first_name}} {{sender_last_name}} · Founder, GLPConvert
> glpconvert.com
> ```
> First-name signoff line for warmth, full identity in sig block for credibility. Demo URL stays in body CTA (NOT in signature) where the click is intentional + trackable. Smartlead variables auto-populate per-inbox.

#### Build sequence in Smartlead

- [ ] CE9.1 In Smartlead → **Campaigns → GLPConvert Cold — Pilot Q2 2026 → Sequence** tab → **+ Add Step**.

- [ ] CE9.2 **Step 1 — Day 0 (the workhorse, 58% of all replies come from this email) — REVISED 2026-05-17 to prospect-pain-first opener per [Lavender 2026 benchmark](https://www.lavender.ai/blog/building-your-own-sales-email-benchmarks) (231k-email study: prospect-pain-first openers outperform builder-first by 20-30% reply rate):**

   **Subject** (Smartlead spintax — REVISED: dropped `re:` variant per Gmail 2026 anti-deception filter, replaced with quieter alternative):
   ```
   {{company_name}} GLP-1 intake question | quick note on {{company_name}} | {{first_name}} — {{company_name}} intake
   ```

   **Body** (60 words, ONE link, prospect-pain-first):
   ```
   Hi {{first_name}},

   Most {{company_name}} visitors clicking "Start GLP-1 intake" never finish — industry drop-off is 60-70%.

   I rebuilt your intake as a 30-second preview, your logo and colors, no signup:

   {{demo_link}}

   Shows the booked-consult lift on your current paid traffic. Not interesting? No follow-up.

   — {{sender_first_name}}

   {{sender_first_name}} {{sender_last_name}} · Founder, GLPConvert
   glpconvert.com
   ```
   Word count: 49 (body) + sig. Subject: 4-6 words. ONE link. Leads with THEIR pain (60-70% intake drop-off industry stat), then your solution. Builder-first ("Built a…") was the older pattern — replaced.

- [ ] CE9.3 **Step 2 — Day 3 (no reply):**

   **Subject:**
   ```
   {{first_name}}, did this load? | {{company_name}} preview check | quick {{company_name}} follow-up
   ```

   **Body:**
   ```
   Hi {{first_name}},

   Following up — the {{company_name}} preview is still live: {{demo_link}}

   Did it load OK on your end? Want me to walk through the consult-lift math?

   — {{sender_first_name}}

   {{sender_first_name}} {{sender_last_name}} · Founder, GLPConvert
   glpconvert.com
   ```
   Word count: 36 (body).

- [ ] CE9.4 **Step 3 — Day 7 (no reply, REVISED 2026-05-17 from Day 8): value reframe**

   **Subject:**
   ```
   {{company_name}} ad-spend question | clicks vs consults at {{company_name}} | {{first_name}}, quick math
   ```

   **Body:**
   ```
   Hi {{first_name}},

   Most weight-loss clinics pay for GLP-1 clicks then lose 40%+ of them at the intake form.

   The {{company_name}} preview shows where that leak closes: {{demo_link}}

   90-second activation, $99/mo. Refunded if I'm wrong about the lift.

   — {{sender_first_name}}

   {{sender_first_name}} {{sender_last_name}} · Founder, GLPConvert
   glpconvert.com
   ```
   Word count: 51 (body).

- [ ] CE9.5 **Step 4 — Day 14 (no reply, REVISED 2026-05-17 from Day 12): combined social-proof + breakup** — merged steps 4 + 5 into a single Day-14 close. [Apollo 2026](https://www.apollo.io/insights/what-are-the-most-important-components-of-a-successful-outbound-sales-sequence) + [Lavender 2026](https://www.lavender.ai/blog/best-length-cold-email): for clinic-owner ICP, 4 emails outperforms 5 — Step 5 had marginal lift and disproportionate unsubscribe/spam risk. Combining social-proof+breakup in one Day-14 close retains the breakup's high reverse-psychology conversion ratio without the extra touch.

   **Subject:**
   ```
   closing the loop, {{first_name}} | last note on {{company_name}} | {{company_name}} — still open?
   ```

   **Body:**
   ```
   Hi {{first_name}},

   Clinics that activated this month saw +15-30% lift in booked consults on the same paid spend.

   I'll stop reaching out unless you'd like to keep this open.

   {{company_name}}'s preview stays live: {{demo_link}}

   All the best either way.

   — {{sender_first_name}}

   {{sender_first_name}} {{sender_last_name}} · Founder, GLPConvert
   glpconvert.com
   ```
   Word count: 47 (body).

- ~~[ ] CE9.6 **Step 5 — Day 18 (no reply): the breakup**~~ — **REMOVED 2026-05-17 audit:** 5-step sequence dropped to 4 steps for clinic-owner ICP. Breakup content merged into the new CE9.5 Day-14 close. Per [Apollo 2026 outbound sequence](https://www.apollo.io/insights/what-are-the-most-important-components-of-a-successful-outbound-sales-sequence): for HIPAA-cautious low-tolerance B2B inboxes, the 5th touch has marginal lift and disproportionate unsubscribe + spam-flag risk that damages reputation across all your other concurrent sends.

- [ ] CE9.7 **Compliance footer** — Smartlead auto-appends one if you've set CE8.3. Confirm it includes: Wellspire LLC physical mailing address + `{{unsubscribe}}` link → tested via Smartlead → Campaign → Preview that the footer renders as plain text (not an HTML block), at the very bottom, separated from your signature by 2 line breaks. RFC 8058 one-click List-Unsubscribe header is auto-attached by Smartlead on every send to satisfy Gmail's 5k/day rule.

- [ ] CE9.8 **Sequence-level settings** in Smartlead:
   - Step delays: **0 / 3 / 7 / 14 days** (REVISED 2026-05-17 from 0/3/8/12/18; 4-step sequence per CE9 audit)
   - **Stop sequence on:** reply, manual pause, bounce. (Default Smartlead — confirm enabled.)
   - **Skip weekends:** ON. If Day 3 lands on a Sat/Sun, sequence delays to Monday — wait, also skip Monday per send-day audit; delays to Tuesday.
   - **AB testing:** OFF for pilot. Pick winners empirically over the first 30 days before splitting traffic.

- [ ] CE9.9 **Spot-test ALL 4 emails before launch** — Smartlead → Campaign → **Preview** → cycle through 10 sample prospects. Visually verify:
   - From-line shows bare `Firstname Lastname` (e.g. `Megan Bauer` — NO `, Founder` suffix per CE3.7b reversal; "Founder" lives in the sign-off line at the bottom of body)
   - Subject has `{{company_name}}` filled in correctly
   - `{{demo_link}}` rendered as a bare URL (NOT a button, NOT a hyperlink wrapper)
   - Signature shows the correct sender + `glpconvert.com` (not the demo URL); sign-off line reads `— Megan Bauer, Founder` (founder credibility appears here, not in From-line)
   - Compliance footer is at the bottom
   - Body wraps at ~80 chars (no awkward line breaks)
   - Total word count is in 30-55 range per step

- [ ] CE9.10 **PRE-LAUNCH DELIVERABILITY + DISPLAY-NAME VALIDATION GATE** (NEW 2026-05-18 — run on Day 44, 24h before CE010.1 activates the campaign). This is the gate that confirms display-name + inbox-placement work correctly BEFORE you start sending to real prospects.
   - **Primary test — Smartlead SmartDelivery (free, included in your Smartlead Pro $94/mo).** Open [smartlead.ai/email-deliverability-test](https://www.smartlead.ai/email-deliverability-test) → Manual mode → cycle through all 15 warmed inboxes → for each, send a test using the actual Day-45 campaign Step-1 subject + body (from CE9.2). SmartDelivery routes to Gmail/Outlook/Yahoo seed accounts and reports inbox/promotions/spam/missing breakdown per ESP. Unlimited tests at no additional cost.
   - **Secondary test — GlockApps pay-per-test ($16.99 one-time credit pack, NO subscription).** Sign up at [glockapps.com](https://glockapps.com) → buy the **$16.99 credit pack** (3 tests; this is a one-time spend, NOT a recurring sub — explicitly DON'T sign up for the $59-79/mo subscription). Run **1 test per sending domain** = 5 tests total (1 per domain on a representative inbox: megan@getglpconvert, james@tryglpconvert, priya@useglpconvert, rahul@withglpconvert, hannah@glpconverthq). Wait — 5 tests requires the $33.99 pack (5 credits). Use that. GlockApps' value-add over SmartDelivery: shows the **literal rendered From-header per ESP** — exactly the display-name question that's been bothering you. Per [GlockApps 2026 review](https://emailwarmup.com/blog/email-deliverability-tools/glockapps-review/) + [Puzzle Inbox 2026 pricing](https://puzzleinbox.com/compare/glockapps-pricing-review/).
   - **Skip these tools:** Mail-Tester.com (config-only score, misleading — documented case of 10/10 score with 100% Outlook junk per [Prospeo 2026](https://prospeo.io/s/mail-testercom-pricing-reviews-pros-and-cons)); MailReach (overlaps Smartlead, no additional value); Litmus (HTML rendering only, irrelevant since you're sending plain text).
   - **PASS criteria — ALL four must be true to launch CE010.1:**
     1. **Inbox placement ≥80%** across Gmail Workspace + M365 seeds in SmartDelivery (B2B prospect inboxes — the ones that actually matter for clinic owners).
     2. **Display name "Megan Bauer" (or chosen format) renders correctly** in the From header on ≥90% of GlockApps Gmail + Outlook seeds.
     3. **SPF/DKIM/DMARC pass on 100%** of seeds (this should be trivially true if CE004 was done correctly; if not, debug CE004 not CE9.10).
     4. **SpamAssassin score ≥8/10** on GlockApps reports (10/10 is the goal but ≥8 is acceptable for cold outreach).
   - **FAIL → DO NOT launch CE010.1. Apply the 2026 remediation cascade in order:**
     1. **First-name only display** — change Workspace First/Last to display just "Megan" (mobile clients truncate at 20-30 chars; "Megan Bauer" survives, but if you see truncation issues in GlockApps reports, switching to first-name-only renders more reliably across all devices per [Suped 2026](https://www.suped.com/knowledge/email-deliverability/troubleshooting/why-is-gmail-not-displaying-the-friendly-from-name-in-some-emails)).
     2. **"Firstname at Company" format** — change display name to e.g. `Megan at GLPConvert`. Per [Mailpool 2026 From-name strategy](https://www.mailpool.ai/blog/cold-email-from-name-strategy-the-hidden-deliverability-lever-nobody-tests) + [Puzzle Inbox 2026 sender name](https://puzzleinbox.com/blog/cold-email-inbox-sender-name-display/): this format ties display name to domain, reduces spoof-classifier suspicion, top B2B pattern in 2026. Tradeoff: less personal-feeling than bare "Megan Bauer" — only use if bare format underperforms in GlockApps.
     3. **Switch mailbox username from `daniel@` to `daniel.reeves@`** — per [Prospeo 2026 email format with name](https://prospeo.io/s/email-address-format-with-name): first.last is the most common B2B pattern (23-71% depending on company size). Doesn't directly fix display-name rendering but reduces "looks like generic alias" friction. ⚠️ HIGH COST: requires creating 15 new mailboxes, transferring or deleting old ones, redoing Smartlead OAuth, restarting warmup. Only do this if remediations 1 + 2 fail.
     4. **Tighten DMARC `p=none` → `p=quarantine`** earlier than the planned 4-6 weeks (per [Suped 2026](https://www.suped.com/knowledge/email-deliverability/troubleshooting/why-is-gmail-not-displaying-the-friendly-from-name-in-some-emails) cites weak DMARC as a display-name suppression factor). Risk: tightening DMARC too early can bounce your own warmup mail. Only do this if remediations 1-3 fail AND DMARC report is showing >95% compliance for at least 2 weeks.
     5. **Last resort — extend warmup another 14 days** then retest. Some first-time-sender suppression persists until reputation accrues; sometimes the answer is just "send more warmup mail and wait."
   - **After fix → wait 48h for changes to propagate, re-run CE9.10 from the top. Only launch CE010.1 when ALL 4 pass criteria are met.**
   - **Total cost added: ~$17-34 one-time** ($16.99 or $33.99 GlockApps credit pack; no ongoing subscription). Smartlead SmartDelivery is included in your existing Smartlead Pro plan at no additional cost.

### **CE010 — Pilot launch + scale within the 5-domain stack** (Days 45 → 105) — REVISED 2026-05-17 from Day 30 start; shifted +15 days to match 35d warmup + 7d landing-page work

> Two pilot sub-phases. Phase 3 (expand to 22 domains) is the SEPARATE **CE011** section below — only do CE011 once the 5-domain pilot proves out.

**Pilot Phase 1A — soft launch at ~4.8k/mo (Days 45–60)**
- [ ] CE10.1 **Smartlead Campaign → Activate Campaign.** Set **Daily limit per inbox: 20** (lower than the eventual 38 ceiling — first 2 weeks are reputation-building, not throughput). **Total daily campaign cap: 300** (15 inboxes × 20/day). Monthly throughput Phase 1A ≈ **~4,800 emails/mo**.
- [ ] CE10.2 **Days 46–52 (Week 1 daily checks):**
   - Open **Google Postmaster v2 + Microsoft SNDS + Yahoo Sender Hub** each morning (REVISED 2026-05-17: Postmaster v1 retired Sept 30, 2025; v2 only shows Pass/Needs Work — SNDS is now your primary daily reputation tool per [Suped 2026](https://www.suped.com/knowledge/email-deliverability/sender-reputation/how-accurate-is-snds-and-google-postmaster-tools-reputation-data)).
   - Spam-rate must stay **<0.10%** ([WPMail SMTP 2026](https://wpmailsmtp.com/gmail-bulk-sender-requirements/) — hard floor 0.30% = permanent block).
   - Reply rate target: **>2%** within first 100 sends ([Apollo State of Outbound Q1 2026](https://apollo.io/research), [Instantly Benchmark 2026](https://instantly.ai/cold-email-benchmark-report-2026) baseline for SMB B2B).
   - Bounce rate: **<2%** — CRITICAL: relies on MillionVerifier re-verification step CE6.6.5 (Apollo Verified alone gives 7-18% bounce in 2026).
   - If reply <1% or bounce >3% → **pause campaign**, debug (subject A/B test? Apollo list quality? first-sentence rewrite? MillionVerifier ran on the batch?) before resuming.
- [ ] CE10.3 **Days 53–60:** if Week-1 metrics held, bump per-inbox cap to **30/day**. Monthly throughput ≈ **7,200/mo**. Hold at this level through Day 60.

**Pilot Phase 1B — full pilot throughput ~9k/mo (Days 60-105)**
- [ ] CE10.4 Day 60 gate check: 14 days of consistent **<0.05% spam, <1.5% bounce, >2% reply** in SNDS + Smartlead analytics. If passed, bump per-inbox cap to **38/day** (do NOT push to 50 unless SNDS shows clean for 30 consecutive days — per [Litemail 2026](https://litemail.ai/blog/cold-email-inbox-limit-per-day-google-vs-microsoft-2026)). Monthly throughput now ≈ **9,120/mo full pilot**.
- [ ] CE10.5 **Days 60-105:** Run at 38/day per inbox. A/B test (Smartlead built-in A/B):
   - Subject variants (the 3 spintax options per step from CE9 — Smartlead reports which performed best after 500+ sends per variant)
   - First-sentence variants in Step 1 body (test the prospect-pain opener from CE9.2 against alternative pain hooks like "Most {{company_name}} ad clicks never finish intake — industry sees 60-70% drop-off" — A/B with 1-3 alternates after 1k sends)
   - 3-step vs 4-step (current spec is 4-step; if Step 4 reply rate <0.5%, drop to 3-step to further reduce list fatigue)
- [ ] CE10.6 **Track to Stripe** — the single metric that matters:
   - Demo URL click → demo page view → Activate-CTA click → Stripe checkout start → Stripe checkout completion
   - Use the UTMs you set in CE6.7 to attribute Stripe customers back to the cold-email campaign
   - **Target by Day 105 (REVISED from Day 90):** 6-16 paying clinics/mo from cold email (at 9,120/mo × 2% reply × 30% interested × 30% click-to-Stripe completion = ~16 customers/mo). Adjust expectations downward by 30-50% for first 30 days of live data.

**Pilot decision gate — Day 105 (REVISED from Day 90; 3 outcomes):**
- ✅ **Conversion ≥ 5 customers/mo at $99 ACV ≈ $495 MRR contribution from cold:** UNIT ECONOMICS WORK. Proceed to **CE011** (Phase 3 expansion to 22 domains, 66 inboxes, ~50k/mo). **Note for Phase 3:** apply lessons learned — use **2 inboxes/domain** (not 3 as in pilot) per [Litemail 2026](https://litemail.ai/blog/how-many-email-inboxes-do-you-need-for-cold-email-in-2026) + [ScaledMail 2026](https://www.scaledmail.com/blogs/inboxes-per-domain-cold-email) consensus. Pilot's 3/domain is in safe band but 2/domain has better reputation isolation.
- ⚠️ **Conversion 1-4 customers/mo:** marginal. Don't scale domain count. Instead, double down on copy + AI personalization (this is when you add Clay $149/mo as 3rd tool and feed AI-generated per-prospect openers — Claygent took one agency from 1.1%→4.3% reply rate per [Litemail 2026](https://litemail.ai/blog/apollo-vs-clay-cold-email-lead-gen-2026)).
- ❌ **Conversion 0 customers/mo despite good reply rates:** funnel issue downstream of the email (demo page bounce, Stripe checkout drop, pricing objection). Pause cold-email scale, fix the funnel, return when activation rate per demo-view is >5%.

### **CE-EXPAND — Hit every English-speaking market, same stack** (Month 7+, AFTER the US campaign)

> **Goal:** reach EVERYONE who could buy GLPConvert — first the full US market, then every English-speaking country where cold email is legal and the market is worth it. **Same exact stack** (Smartlead Pro + Botdog + Apollo Free + MailReach) — NO new tools. The tools are flat-rate monthly, so expansion just = more campaign months at ~$125/mo. The **$97 MillionVerifier 50k pack from CE6.6.5 already covers the entire ~43k roadmap** — no re-buy.
>
> ⚠️ **DO NOT expand until the US campaign has proven the conversion rate.** Run the US first (Months 1-6). If it converts → expand. If it doesn't → fix the funnel before adding countries. This is the validate-then-scale rule.
>
> **Timeline + market size (verified May 2026 — [heySlim UK 2026](https://www.heyslim.co.uk/blog/uk-weight-loss-medication-statistics-2026), [IBISWorld AU 2025-26](https://www.ibisworld.com/australia/industry/health-and-wellness-spas/4150/), [GLP1Clinics 2026](https://www.glp1clinics.org), [AmSpa 2026](https://americanmedspa.org)):**
>
> | Phase | Market | Reachable clinics | When | Legality |
> |---|---|---|---|---|
> | Done first | **United States** | ~24,500 | Months 1-6 | CAN-SPAM — easy |
> | Expand #1 | **United Kingdom + Ireland** | ~3,750-6,450 | Months 7-9 | UK PECR corporate-subscriber exemption + IE opt-out B2B — **easiest of all** |
> | Expand #2 | **Australia + New Zealand** | ~1,400-2,350 | Months 9-11 | Spam Act / UEMA "inferred consent" — workable, relevance-gated |
> | Expand #3 (cautious) | **Canada** | ~1,500-2,500 | Months 11-13 | CASL — strictest (CAD $10M fines, active regulator). Legal via conspicuous-publication implied consent, but treat as a deliberate compliance segment. Or skip and use LinkedIn-only for Canada. |
> | Skip | South Africa | ~300-600 | — | Small + payment friction vs USD Stripe. Not worth solo-founder bandwidth. |
>
> **Total English-speaking TAM ≈ 31,000-43,000 clinics.** Whole roadmap ≈ 13 months, ~$1,600 in tools.

- [ ] CE-EXPAND.1 **UK + Ireland (Months 7-9).** Build the list from UK/IE equivalents of the free directories (private GP/pharmacy registers, UK med-spa directories) + Apollo Free filtered to United Kingdom / Ireland. **Run through CE6.6.5 verification + CE6.9 dedup against the master suppression list FIRST** (clinic chains can appear in multiple country lists — never re-email). In Smartlead, create a SEPARATE campaign per country so send-times follow local business hours (Smartlead → Campaign → "Send by recipient timezone"). ⚠️ Email incorporated clinics (Ltd companies) — skip sole-trader / personal-domain addresses (they lose the B2B exemption). Keep the physical-address footer.
- [ ] CE-EXPAND.2 **Australia + New Zealand (Months 9-11).** Same process — separate Smartlead campaigns, timezone-local sends (AU/NZ are ~+15-18h from US — set this or you send at 3am their time). Spam Act inferred-consent requires the pitch be **relevant to the recipient's role** — your clinic-intake angle qualifies. Working unsubscribe + sender ID mandatory (already in your footer).
- [ ] CE-EXPAND.3 **Canada (Months 11-13) — cautious, or skip.** CASL is the strictest regime. If you do it: separate campaign, conspicuous-publication implied consent only (clinic email publicly posted + message role-relevant), physical mailing address in footer (mandatory), keep consent/contact records. If that's too much overhead, **skip Canada email and run Canada via LinkedIn DMs only** (LinkedIn is governed by its own ToS, not CASL — lighter legal layer).
- [ ] CE-EXPAND.4 **Setup notes (apply to every country):** the US stack works internationally with zero new tools. (a) One SEPARATE Smartlead campaign per country (timezone + copy + compliance segmentation). (b) Physical mailing address stays in the footer everywhere. (c) `.com` sending domains are fine — add country-code domains (`.co.uk`, `.com.au`) later ONLY if a country becomes a large ongoing channel. (d) Every new-country list runs through verification (CE6.6.5) + master-suppression dedup (CE6.9) before import — no exceptions. (e) You sell B2B SaaS to clinics, not drugs to patients — this keeps you clear of medical-advertising regulation; just never name Wegovy/Mounjaro/Ozempic as a consumer pitch.
- [ ] CE-EXPAND.5 **LinkedIn (Botdog) for expansion:** LinkedIn DM rules are the same in every country (LinkedIn ToS, not local law). Keep 1 account, ~100 connection requests/week — it primes your best prospects in whichever country's campaign is currently active. It cannot cover the whole international list; that's fine — it's a precision layer, email carries the volume.
- [ ] CE-EXPAND.6 ❌ **Do NOT translate the product or expand to non-English countries — go DEEPER in English instead** (researched + decided 2026-05-18):
   - **Cold email is effectively BANNED in Germany and Italy** — both require prior opt-in for B2B email; US-style cold sending is illegal and triggers competitor cease-and-desist (*Abmahnung*) letters (Germany €5k-50k first-offense; Italy issued a €12.5M fine April 2026). Spain / Netherlands / Nordics are legally contested. Only **France, Brazil, Mexico** realistically allow B2B cold email. Your entire GTM is cold email — translating a product to feed a channel you can't legally run is wasted money. ([Puzzle Inbox Germany 2026](https://puzzleinbox.com/blog/cold-email-germany-gdpr-uwg-2026/), [Consentmo Italy Apr 2026](https://www.consentmo.com/blog-posts/12-5m-fine-and-new-email-rules-what-italys-april-2026-gdpr-decisions-mean-for-your-business))
   - **Localization is a permanent solo-founder time tax** — not "run it through DeepL." Machine-translated cold email reads as foreign/spam to 2026 filters; real localization needs native-speaker copy + currency/tax/payment + ongoing multi-language support. Industry consensus ([Paddle 2026](https://www.paddle.com/blog/saas-localization-fltr)): localization is a growth-stage activity, not a sub-$100k-ARR move.
   - ✅ **The smarter expansion = adjacent ENGLISH verticals.** Once US + UK + IE + AU + NZ clinics are exhausted, expand to English-speaking healthcare niches that run the SAME "market our own program → convert intake" model and need the same tool: **TRT / hormone-replacement clinics, peptide clinics, IV-therapy med spas, aesthetic/cosmetic practices.** Same language, same copy, same legal regime, same stack — near-zero added cost. This is the real next frontier after CE-EXPAND.1-3, not translation.
   - If you ever test ONE non-English market: **France only** (the single large opt-out-legal market with a fast-growing private GLP-1 sector) — and only with native-speaker email copy, never machine translation.

### **CE011 — (SUPERSEDED) Phase 3 high-volume scale to 22 domains / 66 inboxes / ~50k-per-MONTH**

> ⚠️ **SUPERSEDED 2026-05-18 — this is NOT the current plan.** CE011 describes scaling to 50k emails *per month* as an ongoing machine. The current goal is to hit the full English-speaking market **once** (a finite ~43k-clinic campaign — see **CE-EXPAND** above), using the locked 15-inbox stack. Only revisit CE011 if GLPConvert later becomes a continuous high-volume outbound operation. For the current finite-campaign goal, ignore CE011 and follow CE-EXPAND.
>
> **Do NOT start CE011 unless CE010 passed the Day-90 gate with ≥5 paying customers/mo.** Burning resources on 22-domain scale before the funnel is proven is the #1 cold-email founder mistake.
>
> **What changes:** scale from 4 domains/12 inboxes/~7k/mo → 22 domains/66 inboxes/~50k/mo. Same tools, more of everything. Same 5-step sequence (don't change what's working).
>
> **What stays the same:** sequence copy from CE9 (it works — don't rewrite it; just feed more prospects through it), AI reply categorization, send times, signature, demo URL pattern.
>
> **Cost delta at Phase 3:**
>   - Domains: $40/yr → $220/yr (22 × $10/yr) — amortized $18/mo
>   - Workspace inboxes: $109/mo → $554/mo (66 inboxes + 3 admins × $8.40)
>   - Smartlead: $94/mo → $144/mo annual (upgrade Pro → Unlimited Smart for Master Inbox 3.0)
>   - Apollo: $49/mo → $99/mo (upgrade Basic → Professional for 5k credits/mo)
>   - Add Clay: $0 → $149/mo (Starter) — for per-prospect AI personalized openers, ONLY if pilot A/B showed >2x lift from personalization
>   - **Total tool cost delta: ~$255/mo pilot → ~$945/mo Phase 3** (~$700/mo increase to 7x throughput)

#### CE011.1 — Buy 18 more GLPConvert brand-cousin domains (Day 91)

> **Same source-verified naming methodology as the pilot 4** (CE001). All 18 are GLPConvert brand-cousins, all `.com` TLDs, all using May-2026-operator-endorsed or strong-B2B-SaaS-precedent prefix/suffix patterns. No `.io`/`.co`/`.ai`/`.app` TLDs (downgraded per [Winnr 2026 TLD data](https://winnr.app/blog/tlds_article.html)). No `app`/`tool` suffixes (product-type mismatch). No `mail-` prefix (telegraphs cold-email tooling). No hyphens/numbers. Tonal diversification per [Puzzle Inbox 2026 sender name](https://puzzleinbox.com/blog/cold-email-inbox-sender-name-display/) — mix of verb-prefix + positional-suffix + conversational-prefix to avoid clone-stack cluster signal.
>
> **The 18 expansion domains, organized by source-citation tier:**
>
> **Tier 1 — May 2026 operator-source-endorsed (4):**
>   5. `higlpconvert.com` — `hi-` prefix endorsed by [Salesforge 2026 cold email domain](https://www.salesforge.ai/blog/cold-email-domain) (direct quote: *"random words such as 'hi,' 'hello,' 'ji,' 'get,' 'try,' and 'team' can effectively generate... cold email domain names"*) + [Webdew 2026 domain hacks](https://www.webdew.com/blog/cold-email-domain-variations).
>   6. `goglpconvert.com` — `go-` prefix endorsed by [Webdew 2026](https://www.webdew.com/blog/cold-email-domain-variations) + [InboxKit 2026 best domain extensions](https://www.inboxkit.com/learn/best-domain-extensions-cold-email).
>   7. `teamglpconvert.com` — `team-` prefix endorsed by [Salesforge 2026](https://www.salesforge.ai/blog/cold-email-domain) (their explicit list).
>   8. `glpconverthub.com` — `-hub` suffix endorsed by [Webdew 2026](https://www.webdew.com/blog/cold-email-domain-variations) + [InboxKit 2026](https://www.inboxkit.com/learn/best-domain-extensions-cold-email).
>
> **Tier 2 — Strong B2B SaaS real-world precedent (8):**
>   9. `myglpconvert.com` — `my-` possessive prefix. Real precedent: `mychart.com` (Epic healthcare patient portal — highly relevant ICP signal), `mypos.com`, `myteachers.com`. Reads "your personal" tool.
>   10. `glpconvertpro.com` — `-pro` tier-word suffix. Canonical B2B SaaS pattern across nearly every product (Notion Pro, Calendly Pro, Linear Pro). No 2026 operator-source citation but ubiquitous precedent.
>   11. `startglpconvert.com` — `start-` activation prefix. Precedent: `startsequence.com`, `startupstash.com`. Reads "begin using" — well-fitted to a self-serve activation funnel.
>   12. `glpconvertplus.com` — `-plus` tier-word suffix. Canonical B2B precedent (Mailbird Plus, Trello Plus, Disney+). Reads premium/enhanced.
>   13. `runglpconvert.com` — `run-` operational verb prefix. Real precedent: `runzero.com` (B2B asset inventory), `runn.io` (RunN.io). Reads operational/active.
>   14. `glpconvertnow.com` — `-now` immediacy suffix. Precedent: `WhatsApp Now`, time-anchored brand-cousin pattern. Reads "available now."
>   15. `nextglpconvert.com` — `next-` prefix. Precedent: `nextdns.io` → next-version positioning. Reads "modern/upgraded."
>   16. `glpconvertio.com` — `-io` suffix appended to **`.com` TLD** (NOT the `.io` TLD itself — important distinction). The full domain `glpconvertio.com` reads as a tech-flavored brand-cousin but uses .com so retains [Winnr 2026 90-95% inbox placement](https://winnr.app/blog/tlds_article.html). Mailforge-style pattern.
>
> **Tier 3 — Acceptable cluster-diversification picks (6, with caveats):**
>   17. `helloglpconvert.com` — `hello-` prefix endorsed by [Salesforge 2026](https://www.salesforge.ai/blog/cold-email-domain). Caveat: consumer-flavored (Hellofresh pattern), use sparingly. Assign to softer-tone inbox identities (e.g., the partnership-positioned inboxes).
>   18. `theglpconvert.com` — `the-` definitive-article prefix. No specific operator citation but real-world precedent exists. Reads "the one" — slightly stronger ownership tone.
>   19. `todayglpconvert.com` — `today-` time-anchored prefix. Mirror of `glpconvertnow.com` for time-urgency tonal variation. No specific citation; defensible.
>   20. `yourglpconvert.com` — `your-` possessive prefix. Precedent: `yourpos.com`, `yourtravel.com`. Reads partnership-flavored, similar to `with-` from pilot.
>   21. `growglpconvert.com` — `grow-` outcome-anchored prefix. Precedent: `growsumo.com` (B2B partnerships SaaS). Reads "grow your business with" — outcome-positioned.
>   22. `glpconvertdaily.com` — `-daily` cadence suffix. Caveat: slightly newsletter-flavored, use for inboxes whose sequence emphasizes daily-touch nurture. No specific 2026 operator citation but defensible for nurture flows.
>
> **Pre-flight check before buying:** at the time of Phase 3 (Day 91+), May 2026 source landscape may have shifted. Re-verify the 4 Tier 1 picks haven't been deprioritized by any new operator guide; the 8 Tier 2 picks are precedent-stable and unlikely to change.

- [ ] CE011.1.1 Namecheap → Wellspire account → buy the 18 expansion domains listed above. Use bulk-search (Namecheap top nav → **Domains → Bulk Options → Bulk Domain Search**) → paste all 18 → click Search Domains. Apply standard Namecheap checkout rules from CE001.7 (1-year, no PremiumDNS, no PositiveSSL upsells, WhoisGuard ON).
- [ ] CE011.1.2 If any of the 18 show "Premium" pricing (>$20/yr) or "Make Offer" → swap to a Tier 2 or Tier 3 alternative not yet in the list (e.g., `glpconvertedge.com`, `glpconvertfast.com`, `bookglpconvert.com`, `signupglpconvert.com`) — re-verify the alternative isn't an aftermarket domain via blacklist check.
- [ ] CE011.1.3 Pre-flight blacklist check (same as CE1.10) on all 18 at [mxtoolbox.com/blacklists.aspx](https://mxtoolbox.com/blacklists.aspx) — refund any with prior bad sender history within Namecheap's 96h window and replace with alternatives.
- [ ] CE011.1.4 Delegate DNS for all 18 to Cloudflare (CE1.5.1-1.5.7 repeated 18×, or write a small Cloudflare API script — at 18-domain scale the script saves ~2 hours of click-work).

#### CE011.2 — Stand up 2 NEW Google Workspaces (reputation isolation, Day 91-92)

> **At 22 domains, single-Workspace reputation isolation breaks down** ([LeadsMonky 2026 multi-domain Workspace](https://leadsmonky.com/google-workspace-multiple-domains/) + [Apollo 2026 deliverability](https://apollo.io/research)) — one bad domain can taint others within the same Workspace. Split into 3 Workspaces of 7-8 domains each. **Tier-mix per Workspace** — don't bunch all Tier 1 in one Workspace (if that Workspace gets flagged, you lose your strongest patterns).
>
>   - **Workspace 1 (existing) `wellspirellc.com`:** keeps the 4 pilot domains as secondaries → `getglpconvert.com`, `tryglpconvert.com`, `withglpconvert.com`, `glpconverthq.com` (12 inboxes already running)
>   - **Workspace 2 (new) primary `higlpconvert.com`:** 6 more secondaries — mix of Tier 1 + Tier 2 + Tier 3:
>     - `goglpconvert.com` (T1), `glpconverthub.com` (T1), `myglpconvert.com` (T2), `glpconvertpro.com` (T2), `glpconvertplus.com` (T2), `helloglpconvert.com` (T3)
>     - WS2 hosts 7 sending domains total (including primary `higlpconvert.com` as a sender) × 3 inboxes = 21 sending inboxes + 1 admin (`admin@higlpconvert.com`)
>   - **Workspace 3 (new) primary `teamglpconvert.com`:** 7 more secondaries — mix of Tier 1 + Tier 2 + Tier 3:
>     - `startglpconvert.com` (T2), `runglpconvert.com` (T2), `glpconvertnow.com` (T2), `nextglpconvert.com` (T2), `glpconvertio.com` (T2), `theglpconvert.com` (T3), `todayglpconvert.com` (T3)
>     - WS3 hosts 8 sending domains × 3 inboxes = 24 sending inboxes + 1 admin (`admin@teamglpconvert.com`)
>   - **Workspace 4 (new) primary `yourglpconvert.com`:** 2 secondaries `growglpconvert.com` (T3) + `glpconvertdaily.com` (T3) — spare-capacity Workspace, 3 domains × 3 inboxes = 9 sending inboxes + 1 admin. Bring online ONLY if WS2 or WS3 hits reputation issues and you need clean-domain headroom.
>
> Total at Phase 3 fully scaled: **22 sending domains, 66 cold-email inboxes (12 + 21 + 24 + 9), 4 Workspace admin users**. Tier 1 patterns (`hi`/`go`/`team`/`hub` + pilot's `get`/`try`/`with`/`hq`) spread across WS1 + WS2 + WS3 — no single-Workspace concentration of the strongest patterns.

- [ ] CE011.2.1 Stand up Workspace 2 — primary domain **`higlpconvert.com`**. Run through Google's wizard (same as CE000.C1-C16 but new domain) → Business Starter $8.40/mo → admin user `admin@higlpconvert.com`. Verify primary domain via Cloudflare DNS TXT. Activate Gmail. 2FA. Vault credentials.
- [ ] CE011.2.2 In Workspace 2 admin console → add the 6 secondary domains for WS2 (CE2.3-2.10 process repeated 6×): `goglpconvert.com`, `glpconverthub.com`, `myglpconvert.com`, `glpconvertpro.com`, `glpconvertplus.com`, `helloglpconvert.com`.
- [ ] CE011.2.3 Stand up Workspace 3 — primary domain **`teamglpconvert.com`**. Same wizard process. Admin user `admin@teamglpconvert.com`.
- [ ] CE011.2.4 In Workspace 3 admin console → add the 7 secondary domains for WS3: `startglpconvert.com`, `runglpconvert.com`, `glpconvertnow.com`, `nextglpconvert.com`, `glpconvertio.com`, `theglpconvert.com`, `todayglpconvert.com`.
- [ ] CE011.2.5 Stand up Workspace 4 — primary domain **`yourglpconvert.com`**. Same wizard process. Admin user `admin@yourglpconvert.com`. Add `growglpconvert.com` + `glpconvertdaily.com` as secondaries. **HOLD on activating WS4 inboxes** — this is reserve capacity, bring online only when WS2/WS3 throughput stops scaling cleanly.

#### CE011.3 — DNS auth on the 18 new domains (Day 92-93)

- [ ] CE011.3.1 For each of the 18 new domains: repeat CE4.1-4.7 (MX, SPF, DKIM 2048-bit, DMARC `p=none rua=mailto:dmarc@wellspirellc.com`). At 18-domain scale, write a Python script using the Cloudflare API ([docs](https://developers.cloudflare.com/api/operations/dns-records-for-a-zone-list-dns-records)) to bulk-add records — saves ~3 hours vs manual click-work.
- [ ] CE011.3.2 Verify all 22 (4 pilot + 18 new) at mxtoolbox: MX, SPF, DKIM, DMARC all green.
- [ ] CE011.3.3 Register all 18 new domains in Postmaster Tools under the `admin@wellspirellc.com` Postmaster account.

#### CE011.4 — Create 54 new inboxes (Day 93-95)

> **The 12 pilot inboxes keep running.** Add 54 more (18 new domains × 3 inboxes each), distributed across Workspaces 2-4 per the CE011.2 mapping. Use the SAME first.lastname naming convention but with fresh names — DO NOT recycle the 12 pilot names across new domains (Gmail will cluster-detect the duplicate identity).
>
> **The 54-name lineup** (verified format `firstname@domain`, display `Firstname Lastname, Founder`, real headshots — same rules as CE003):

| Domain (Workspace · Tier) | Inbox 1 | Inbox 2 | Inbox 3 |
|---|---|---|---|
| `higlpconvert.com` (WS2 primary · T1) | nathan@ Nathan Brooks | claire@ Claire Donovan | rahul@ Rahul Krishnan |
| `goglpconvert.com` (WS2 · T1) | meredith@ Meredith Cole | adam@ Adam Whitman | maya@ Maya Iyer |
| `glpconverthub.com` (WS2 · T1) | sofia@ Sofia Mendez | greg@ Greg Halverson | jenna@ Jenna Reyes |
| `myglpconvert.com` (WS2 · T2) | tomas@ Tomas Bauer | leah@ Leah Hartman | mark@ Mark Calloway |
| `glpconvertpro.com` (WS2 · T2) | ana@ Ana Delgado | kevin@ Kevin O'Brien | ruth@ Ruth Sandberg |
| `glpconvertplus.com` (WS2 · T2) | elias@ Elias Park | nora@ Nora Whitfield | ben@ Ben Marston |
| `helloglpconvert.com` (WS2 · T3) | sasha@ Sasha Patel | tyler@ Tyler Holloway | grace@ Grace Linden |
| `teamglpconvert.com` (WS3 primary · T1) | henry@ Henry Coleman | reema@ Reema Banerjee | dean@ Dean Pritchard |
| `startglpconvert.com` (WS3 · T2) | naomi@ Naomi Hartwell | aaron@ Aaron Foster | iris@ Iris Lim |
| `runglpconvert.com` (WS3 · T2) | mateo@ Mateo Solano | beth@ Beth Stratton | ivan@ Ivan Larsen |
| `glpconvertnow.com` (WS3 · T2) | tara@ Tara Reilly | omar@ Omar Hassan | clara@ Clara Bennett |
| `nextglpconvert.com` (WS3 · T2) | jonah@ Jonah Pierce | esther@ Esther Yoo | scott@ Scott Caldwell |
| `glpconvertio.com` (WS3 · T2) | rina@ Rina Joshi | finn@ Finn Mackenzie | violet@ Violet Shaw |
| `theglpconvert.com` (WS3 · T3) | parker@ Parker Lane | mei@ Mei Watanabe | gus@ Gus Weaver |
| `todayglpconvert.com` (WS3 · T3) | tariq@ Tariq Malik | nora@ Nora Bishop | alex@ Alex Fontaine |
| `yourglpconvert.com` (WS4 primary · T3) | kira@ Kira Osman | toby@ Toby Warren | sage@ Sage Kapoor |
| `growglpconvert.com` (WS4 · T3) | drew@ Drew Fischer | layla@ Layla Aziz | sean@ Sean Murphy |
| `glpconvertdaily.com` (WS4 · T3) | jonah@ Jonah Walsh | rosa@ Rosa Carrasco | victor@ Victor Reyes |

> **Note on Workspace 4 (9 inboxes — RESERVE capacity):** The 3 WS4 domains (`yourglpconvert.com` + `growglpconvert.com` + `glpconvertdaily.com`) — all Tier 3 — are reserve capacity. Bring them online only if you need to push past ~40k/mo (the WS1+WS2+WS3 throughput envelope) OR if any of the 16 primary Phase-3 sending domains gets reputation-flagged and you need clean-domain headroom for a swap-in.

- [ ] CE011.4.1 For each of the 54 inboxes, repeat CE3.3-3.7 in the appropriate Workspace admin console. Profile photos: source NEW headshots from Unsplash/Pexels (don't reuse the pilot 12 face library). Signatures: `— Firstname Lastname, Founder` + `glpconvert.com` (same 2-line format as pilot).
- [ ] CE011.4.2 Wait 72h before connecting to Smartlead. Use this time for CE011.5 + CE011.6 prep.

#### CE011.5 — Upgrade Smartlead Pro → Unlimited Smart (Day 95)

- [ ] CE011.5.1 Smartlead → Billing → upgrade to **Unlimited Smart $144/mo annual**. Unlimited Smart unlocks **Master Inbox 3.0** (vastly better AI reply categorization vs Pro's basic categorizer — critical at 66-inbox reply volume).
- [ ] CE011.5.2 OAuth the 54 new inboxes into Smartlead (CE5.3 process × 54). Total click work: ~2 hours, or hire a VA.
- [ ] CE011.5.3 Start the 21-day warmup ramp on all 54 new inboxes (CE5.6 settings). Cold sends from the new 54 begin Day 116 (Day 95 + 21 warmup).

#### CE011.6 — Upgrade Apollo Basic → Professional (Day 95)

- [ ] CE011.6.1 Apollo → Billing → upgrade to **Professional $99/mo** ($79 annual). Bumps from 1.2k credits to 5k credits/mo + 1.2k mobile numbers + unlimited contact exports. Needed for ~12.5k unique prospects/mo at 50k throughput.
- [ ] CE011.6.2 Re-pull the saved search from CE6.2 with the same filters. Push 5,000 new prospects to a NEW Smartlead campaign **GLPConvert Cold — Phase 3 Q3 2026** (don't reuse the pilot campaign — fresh stats are cleaner).

#### CE011.7 — Optional 3rd tool: Clay (Day 95+, conditional)

- [ ] CE011.7.1 **Only if pilot A/B testing showed >2x reply lift from per-prospect AI-personalized openers**: sign up for **Clay Starter $149/mo** at [clay.com](https://clay.com). Use the Apollo→Clay native integration to enrich prospects with website-hero scraping + recent-press detection, then run the AI snippet column with Claude Sonnet (bring-own-Anthropic-key reduces cost ~90%; expected $40-60/mo Anthropic). Push enriched rows to Smartlead with `{{personalized_opener}}` as a custom variable injected into Step 1 of the sequence.
- [ ] CE011.7.2 If pilot A/B did NOT show >2x lift, **skip Clay**. Smartlead's built-in AI snippet is good enough at $0 incremental cost. Save the $189-200/mo for ads or LinkedIn scaling.

#### CE011.8 — Phase 3 launch + scaling math (Day 116)

- [ ] CE011.8.1 At Day 116, all 66 inboxes (12 pilot + 54 new) are warmed. Activate the **Phase 3 campaign** with all 66 inboxes pooled. Settings:
   - **Per-inbox cap Mon: 25/day**, Tue-Thu: **38/day**, Fri: **25/day** (Fri added for Phase 3 to push toward 50k)
   - 66 inboxes × (25+38+38+38+25) = **10,824 emails/week**
   - × 4.3 weeks/mo = **~46,500 emails/mo** + 10% headroom buffer = ~50k/mo achievable
- [ ] CE011.8.2 **Day 120-180 (Phase 3 steady state):** target ~50k/mo throughput. At 2% reply × 30% interested × 30% click-to-Stripe complete = **~90 paying clinics/mo from cold email alone** at this volume. At $99 ACV = ~$8,900 MRR contribution from cold. At $199 ACV = ~$17,900 MRR.
- [ ] CE011.8.3 **Past 50k/mo:** see CE011.4.2 reserve capacity (the 6 inboxes on WS4 unlock another ~5k/mo at 38/day cap). Beyond that, you've hit single-Workspace cluster reputation limits → time to consider Workspace 5+ on a fresh apex (e.g., a new product brand) or accept 50k/mo as the steady-state plateau and reinvest tool budget into LinkedIn + content / ads channels.

# 💼 **LINKEDIN COLD DM SETUP** — every button to press, in order

> **Goal (LOCKED 2026-05-18 final audit):** run **1 LinkedIn account** via **Botdog** as a PRIMING channel for the top ~2,500-3,500 highest-fit clinics. A connection request landing 24-48h before that prospect's cold email makes you a familiar name and lifts email reply rate ~2.7× ([Sendr 2026](https://www.sendr.ai/blog/how-to-build-a-multi-channel-outreach-strategy-(email-linkedin)-in-2026)). LinkedIn is NOT the volume channel — email is. LinkedIn is the precision sidecar.
>
> **Why 1 account:** LinkedIn caps every account at ~100 connection requests/week — a hard, Trust-Score-gated ceiling. More accounts require real additional humans (fake accounts get banned; 12% recovery odds). One real account is the plan.
>
> **Monthly cost (LOCKED):** **Botdog Starter $35/mo — that's the entire LinkedIn stack.** NO Sales Navigator ($99/mo — doesn't raise limits, Apollo's free Chrome extension covers lead-finding). NO Heyreach ($999+ agency pricing). NO Chrome-extension tools (~23% ban rate).
>
> **Throughput:** 1 account × ~100 connects/wk × ~22 active weeks ≈ **2,500-3,500 LinkedIn touches over the 6-month campaign**, concentrated on the best prospects. Email (CE005-CE010) reaches the other ~21,000.
>
> **Botdog billed to the Wellspire LLC card** with `Wellspirellc@gmail.com` as recovery. The LinkedIn account itself is your own real personal account — free tier, no Premium needed.

### **LI001 — Sign up for Botdog + prep your LinkedIn account** (Day 1 of LinkedIn track)

> **May 2026 LinkedIn-tool decision — FINAL AUDIT (30+ sources, 2026-05-18):**
>
> | Tool | Cost (solo, 1 account) | Architecture | Verdict |
> |---|---|---|---|
> | **Botdog** ✅ | **$35/mo (annual)** | Cloud, dedicated IP, **hard-coded limits you cannot override** | **PICK THIS.** Cheapest tool in the genuinely-safe tier. Built for solo founders. 7-day free trial, no card. |
> | Expandi | $79/mo | Cloud, dedicated IP | Safe but 2× the price for features you don't need |
> | Heyreach | $999+/mo | Cloud, multi-account | Agency-priced. Overkill for 1 account. (Its API was cut by LinkedIn but the product still works — just not your tool.) |
> | Waalaxy / Linked Helper / Dux-Soup | $15-56/mo | ❌ **Chrome extension** | ❌ **DO NOT USE.** ~23% of accounts restricted within 90 days in the 2026 enforcement wave. |
> | Sales Navigator | $99/mo | — | ❌ **Not needed.** Doesn't raise connection limits; Apollo's free Chrome extension covers lead-finding. Saves $594 over the campaign. |
>
> **LinkedIn 2026 hard cap: ~100 connection requests/week per account.** Soft, Trust-Score-gated — a mature high-SSI account ramps to 150-200/wk over time. **LinkedIn's role is PRIMING** — a connection request landing 24-48h before the cold email makes you a familiar name and lifts email reply rate ~2.7× ([Sendr 2026](https://www.sendr.ai/blog/how-to-build-a-multi-channel-outreach-strategy-(email-linkedin)-in-2026)). Cold email is the primary channel; LinkedIn is the precision sidecar on your best ~2,500-3,500 prospects.

- [ ] LI1.1 **Botdog** — Open **https://www.botdog.co** → top-right **Start free trial** (7-day, no credit card required) → sign up with `Wellspirellc@gmail.com` → confirm via email link. After the trial, on the plan screen pick **Starter $35/mo → toggle to Annual billing** (≈17% saving) → pay with Wellspire LLC card (or personal card for pilot).
- [ ] LI1.2 **LinkedIn account** — use **your own real personal LinkedIn account**. Do NOT create a second or fake account — LinkedIn's 2026 "Guardian AI" hunts coordinated/synthetic profiles; ban-recovery odds are ~12%. One real account is the plan. **Free LinkedIn tier is sufficient** — you do NOT need Premium or Sales Navigator for connection-request outreach.
- [ ] LI1.3 ❌ **Do NOT sign up for:** Heyreach ($999+ agency pricing), Sales Navigator ($99/mo — unneeded), Waalaxy / Linked Helper / Dux-Soup (Chrome-extension architecture, ~23% restricted in 90 days), or Clay ($349/mo — not needed at pilot scale). The whole LinkedIn track is **$35/mo, one tool.**

### **LI002 — Audit + warm your 1 LinkedIn account** (Days 1-21, run in parallel with the email warmup)

> LinkedIn's 2026 trust-graph tightened new-automation detection. Botdog's docs recommend 2-3 weeks of manual activity before automation on accounts under ~1,000 connections.

- [ ] LI2.1 Pick your LinkedIn account (your personal one — most age + connections). Check it clears these gates:
   1. **≥ 6 months old** (creation date is on the profile).
   2. **≥ 500 connections** (LinkedIn's "social proof" threshold).
   3. **Profile photo + banner + headline + About section all filled.**
- [ ] LI2.2 **Optimize the profile BEFORE any outreach — this IS your landing page** (when a prospect gets your connection request, they click your name):
   - **Headline = the problem you solve**, not your title (e.g. "Helping GLP-1 clinics turn website visitors into booked patients" — not "Founder, GLPConvert").
   - **Banner image** showing the product/outcome.
   - **Featured section** — pin your demo link.
   - **About section** written directly to clinic owners.
   - Post 2-3 times so you look like a real, active human.
- [ ] LI2.3 If the account is under ~1,000 connections, warm manually for **14-21 days BEFORE connecting Botdog**:
   - Days 1-7: 5 connections/day, 3 likes/day, 1 comment/day.
   - Days 8-14: 10 connections/day, 5 likes, 2 comments, 1 short post.
   - Days 15-21: 15 connections/day, 5 likes, 3 comments, 1 post.
   - If the account is already 1,000+ connections and fully completed, 14 days is enough.
- [ ] LI2.4 **Settings → Account preferences →** set the timezone to match your real location (mismatched timezone is an automation-detection flag).

### **LI003 — Connect your account to Botdog** (Day 21+, after warmup)

- [ ] LI3.1 Log into **https://www.botdog.co** → Dashboard → **Connect LinkedIn account** (Botdog connects via a secure cloud session — follow its prompts; it will ask you to log into LinkedIn through Botdog's flow).
- [ ] LI3.2 Botdog assigns a **dedicated IP** to the account automatically — confirm it shows a location near your real location.
- [ ] LI3.3 Botdog runs a **7-day account warm-up ramp** automatically before full-volume sending — let it complete. Do NOT override the hard-coded limits (the whole reason Botdog is the safe pick).
- [ ] LI3.4 Set **sending hours**: weekday **9:30am-12:30pm local**, Tue-Thu primary. **Disable weekends** for the first 30 days.

### **LI004 — Build the LinkedIn lead list** (Days 7-14, parallel to email warmup)

> No Sales Navigator needed. You build the LinkedIn list from the SAME clinic list you build for email in CE006 — then find each clinic's decision-maker on LinkedIn.

- [ ] LI4.1 Take your top ~2,500-3,500 highest-fit clinics from the CE006 master list (biggest med spas + clearest GLP-1 specialists — LinkedIn is a precision channel, so it gets your BEST prospects only).
- [ ] LI4.2 For each, find the owner/decision-maker's LinkedIn profile: search the clinic name on LinkedIn → open the company page → find the owner/founder/practice-manager profile. The **free Apollo Chrome extension** (from CE006) surfaces the LinkedIn URL on most clinic contacts automatically — use that to speed this up.
- [ ] LI4.3 In Botdog → **Leads / Lists** → **Import** → upload a CSV with columns `linkedin_url, first_name, company_name`. Start with the first **500 leads** as the pilot batch.

### **LI005 — Engagement-led pre-touch (the #1 highest-ROI LinkedIn tactic)** (ongoing)

> Messages that reference a prospect's own LinkedIn post get **~300% higher reply rates** ([PhantomBuster 2026](https://phantombuster.com/blog/linkedin-automation/linkedin-engagement-signals-buyer-intent-2026/)). For your top-tier prospects, do this manually before the automated sequence runs.

- [ ] LI5.1 For your **top ~300 dream-fit clinics**: before Botdog sends the connection request, manually visit the prospect's profile and **leave one genuine comment on a recent post**. Then let the sequence run — your name is already familiar.
- [ ] LI5.2 For the remaining leads: the standard Botdog sequence (LI006) runs without the manual comment — still effective, just not the 3× tier.
- [ ] LI5.3 **Trigger-based priority:** if a clinic has a recent signal (new location, newly-hired practice manager, hiring posts), bump it to the top of the queue — new decision-makers are 5-10× more likely to adopt a new vendor in their first 90 days.

### **LI006 — Build the Botdog sequence** (Day 14 of LinkedIn track)

- [ ] LI6.1 In Botdog → **Campaigns** → **+ Create campaign** → name **GLPConvert Cold — LinkedIn Q2 2026**.
- [ ] LI6.2 **Step 1 (Day 0): Connection request — NO note.** Botdog: add a "Send connection request" step, leave the note field **EMPTY**. Blank requests accept 55-68% vs 28-45% for noted ones (80,000-request study, [ReactIn 2026](https://www.reactin.io/blog/linkedin-connection-request-with-or-without-note)).
- [ ] LI6.3 **Step 2 (on accept): warmup DM — NO link.** Trigger: connection accepted. LinkedIn suppresses links in first messages; build the thread first. Template:
   ```
   Hi {{first_name}}, thanks for connecting — saw {{company_name}} runs GLP-1.

   Quick one if you don't mind: what does your current intake flow look like — paid traffic to a Calendly, or a form on the site?

   {{sender_first_name}}
   ```
- [ ] LI6.4 **Step 3 (3-5 days after Step 2, regardless of reply): VALUE + demo link.** This is where the link goes. Template:
   ```
   Hi {{first_name}},

   Reason I asked — most {{company_name}}-sized clinics lose 60-70% of GLP-1 ad clicks at the intake form.

   Built a 30-second preview of your intake with your logo + colors, no signup:

   {{demo_link}}

   Shows the booked-consult lift on your current paid traffic.

   {{sender_first_name}}
   ```
- [ ] LI6.5 **Step 4 (5 days after Step 3, no reply): soft close.** Template:
   ```
   Hi {{first_name}}, did the {{company_name}} preview load OK? Stays live at {{demo_link}} — $99/mo, activates in 24h. Either way, last note from me on this.
   ```
- [ ] LI6.6 **Stop at Step 4.** No InMail (skip — $10-21/credit, poor economics for self-serve). No 5th touch.
- [ ] LI6.7 **`{{demo_link}}` value** = the short path-based URL per CE-DEMO-URL (e.g. `https://glpconvert.com/o/{slug}`), `utm_source=linkedin`. Botdog interpolates `{{first_name}}`, `{{company_name}}`, `{{sender_first_name}}` from the imported CSV columns.
- [ ] LI6.8 **Sending limits** — Botdog hard-caps these, but confirm: connection requests **20-25/day** (~100/week), ramping toward 150/week only after 8+ weeks clean with acceptance rate above 40%.
- [ ] LI6.9 **Timing sandwich:** sequence each prospect so the LinkedIn connection request lands **24-48h before that same prospect's cold email** (CE009). This is what produces the 2.7× email reply lift.

### **LI007 — Launch + monitor** (after warmup completes)

- [ ] LI7.1 In Botdog → start the campaign. 20-25 connection requests/day, single account.
- [ ] LI7.2 **Daily** (first 2 weeks): check Botdog's account-health indicator. If LinkedIn shows any "unusual activity" warning, **pause 48h**, then resume at half volume.
- [ ] LI7.3 **Weekly:** review acceptance rate. Healthy = **30-45%**. Below 25% = targeting too senior or wrong vertical — tighten the list. Keeping acceptance above 40% protects your Trust Score.
- [ ] LI7.4 **Weekly:** review reply rate on Step 3 (the value+link DM). Healthy = **8-15%**. Below 5% = the pain statement isn't landing — A/B test it.
- [ ] LI7.5 **Daily:** open Botdog's inbox. Reply to responses **yourself, by hand** (do NOT automate replies — this is a real human conversation in your founder voice). Tag intent: positive / neutral / negative / OOO.

### **LI008 — DON'T do these (2026 LinkedIn rules)**

- ❌ **No connection-request notes** — blank requests accept far better (data above).
- ❌ **No link in the first DM** — LinkedIn suppresses it; drop the demo link in message 2-3.
- ❌ **No second/fake LinkedIn account** — ban-bait, 12% recovery odds, and against how you run the company.
- ❌ **No Chrome-extension automation tools** (Waalaxy, Linked Helper, Dux-Soup) — ~23% restricted in 90 days.
- ❌ **No automating the replies** — when someone responds, that's a human conversation. Hand-reply.
- ❌ **No voice/video messages cold** — works warm only; intrusive to clinical buyers cold.
- ❌ **No exceeding 25 connection requests/day** chasing speed — LinkedIn's Trust Score throttles fast.

### **LI009 — Steady state**

- **~100 connection requests/week × ~22 active weeks ≈ 2,200-2,500 LinkedIn touches** over the 6-month campaign (rising toward the high end as the account ages and SSI climbs — realistic total ~2,500-3,500).
- LinkedIn covers your **top ~2,500-3,500 prospects only** — it is a precision priming layer, not a full-market channel. Email (CE005-CE010) reaches the other ~21,000.
- Total LinkedIn tooling cost for the whole campaign: **$35/mo × 6 = $210.** One account, one tool. Do not multi-account.
- **30% acceptance** + **1% reply→demo→checkout** = **~12 paying clinics/month from LinkedIn alone**, before any email-channel lift.

---

<a id="-maintenance"></a>

# 🩺 **MAINTENANCE** — daily / weekly / monthly checklist

> Open the GLPConvert ops page every morning. Spend 10 min daily / 30 min weekly / 1 hr monthly to keep the machine healthy.

### **OPS-DAILY — Reply triage + health checks** (10 min)

- [ ] OPS.D1 Open **https://app.instantly.ai/** → **Unibox** → triage replies. Forward positive-intent to **sales@glpconvert.com**.
- [ ] OPS.D2 Open **https://app.heyreach.io/** → **Inbox** → triage LinkedIn replies. Same intent buckets.
- [ ] OPS.D3 Hand-reply to all positive-intent within **4 business hours**.
- [ ] OPS.D4 Tag intent in Airtable (positive / neutral / unsubscribe / OOO / wrong-person).
- [ ] OPS.D5 Open **https://glp-convert.vercel.app/healthz** → confirm **200 OK**. (See OPS-PAGES below.)
- [ ] OPS.D6 Open **https://glp-convert.vercel.app/status** → confirm all integrations green. (See OPS-PAGES below.)

### **OPS-WEEKLY — Reputation + rate health** (30 min, every Monday)

- [ ] OPS.W1 Open **https://postmaster.google.com** → review each of the 4 sending domains. **Spam-rate must be <0.10%**. Above 0.10% = pause and investigate. **0.30%+ = hard block** (2025 enforcement floor).
- [ ] OPS.W2 Bounce rate yesterday must be **<2%**.
- [ ] OPS.W3 Botdog connection-acceptance rate: healthy **30-45%** (keep above 40% to protect Trust Score).
- [ ] OPS.W4 Botdog reply rate on Step 3 (the value+link DM): healthy **8-15%**.
- [ ] OPS.W5 Stripe Dashboard → **https://dashboard.stripe.com/payments** → review failed payments + chargebacks.
- [ ] OPS.W6 Vercel Dashboard → **https://vercel.com/hugowentzels-projects/glp-convert** → review error rate + 4xx/5xx logs.
- [ ] OPS.W7 Sentry → **https://sentry.io** → review week's unresolved issues.

### **OPS-MONTHLY — Rotation + hygiene** (1 hr, first Monday of month)

- [ ] OPS.M1 Rotate retired inboxes: any inbox with reply rate <2% over a full sequence gets retired.
- [ ] OPS.M2 No single sending domain should be >25% of total volume — rebalance via Instantly campaign settings.
- [ ] OPS.M3 Refresh Sales Nav search list (new leads + new "posted in past 30 days" cohort).
- [ ] OPS.M4 Re-run ZeroBounce on the next 2,500-prospect batch from Clay before piping to Instantly.
- [ ] OPS.M5 Review Supabase backup (Settings → Database → Backups).
- [ ] OPS.M6 Review Resend send volume + bounce rate.
- [ ] OPS.M7 Review Stripe MRR + churn vs. last month.

### **OPS-PAGES — Status + health pages to build**

- [ ] OPS.P1 Confirm **`/healthz`** route exists at **https://glp-convert.vercel.app/healthz** (returns 200 OK if app is up). Already in repo per master TODO; verify it works.
- [ ] OPS.P2 Confirm **`/status`** page at **https://glp-convert.vercel.app/status** shows live health of: Stripe checkout API, Supabase DB connection, Resend domain, Sentry DSN. Already in repo per master TODO; verify it shows green for each.
- [ ] OPS.P3 If any integration shows red on `/status`: open the relevant dashboard (Stripe/Supabase/Resend/Sentry) and investigate.

---

<a id="-maintenance-runbook"></a>

## 🛠️ **MAINTENANCE RUNBOOK** — single page that covers everything

> **Open this URL every morning before the daily ops check:** **https://glp-convert.vercel.app/maintenance**
>
> The `/maintenance` page is an internal-facing dashboard that consolidates **every** monitoring URL, status check, and crash-response runbook into one place. It is **not** linked from the public marketing site and is excluded from search-engine indexing (`<meta name="robots" content="noindex">`). Treat it like an SRE on-call runbook — it is the **single source of truth** for "what dashboard do I open when X breaks?"
>
> **Treats reader as non-programmer.** Every step is a literal click instruction. Every URL opens in a new tab. Every "if you see X, do Y" is spelled out. Use this as your reference whenever anything goes wrong while you sell GLPConvert to major clinic chains.
>
> **What's on the page (8 monitoring sections + 6 crash-response runbooks):**
>
> 1. **Live status** — `/healthz` + `/status` (open these first every morning).
> 2. **Vercel** — hosting, deployments, runtime logs, analytics.
> 3. **Sentry** — every uncaught client/server error with stack trace, breadcrumbs, browser/device, UTM. Open this when Vercel logs show errors but you can't tell what broke.
> 4. **Stripe** — payments, webhook deliveries, disputes/chargebacks.
> 5. **Supabase** — database table editor (leads), Postgres logs, daily backups.
> 6. **Resend** — transactional email status, domain verification, delivery logs.
> 7. **Google Postmaster** — sender reputation per domain (spam-rate must stay <0.10% — Gmail Feb 2024 enforcement floor).
> 8. **Cold-email + LinkedIn ops** — Instantly, Heyreach, Clay, Airtable.
>
> **6 crash-response runbooks** (every step is literal):
>
>   - Site fully down (404/5xx everywhere) → Vercel deploy red? Promote previous green deploy → fix → push → /healthz green.
>   - Checkout (Stripe) failing → Webhook deliveries red? Resync env vars → test webhook → $0.50 test checkout.
>   - Leads not appearing in Supabase → /api/lead 500? Check RLS error → resync `SUPABASE_SERVICE_ROLE_KEY` → redeploy.
>   - Cold-email reply rate drops → Postmaster spam rate? Pause sending, halve volume, ZeroBounce next batch.
>   - Customer reports no confirmation email → Resend log → bounced? Manually resend.
>   - Sentry alert email → click link → resolve or ignore-24h.
>
> **Daily / weekly / monthly cadence** is also summarized on the page (full check-by-check list lives in OPS-DAILY/WEEKLY/MONTHLY above).
>
> **Escalation**: anything not covered by the page → email **support@glpconvert.com** with subject `P0 INCIDENT` + (1) what broke, (2) when, (3) which dashboard checked, (4) what error.

### **OPS-RUNBOOK — Verify the maintenance page renders + every link works**

- [ ] OPS.R1 Open **https://glp-convert.vercel.app/maintenance** → verify it renders without errors.
- [ ] OPS.R2 Click each of the 24+ external dashboard links → verify each opens correctly (new tab) and lands on the right dashboard.
- [ ] OPS.R3 Click `/healthz` button → confirm 200 OK.
- [ ] OPS.R4 Click `/status` button → confirm all integration tiles green.
- [ ] OPS.R5 **Bookmark** the `/maintenance` page in your browser bookmarks bar — this is the page you open when something breaks while you're on a sales call.
- [ ] OPS.R6 Whenever you add a new monitoring tool (e.g., a log aggregator, an APM service), update `app/maintenance/page.tsx` to include it. Single source of truth.

### **OPS-CRASH — When you're on a sales call and the demo breaks**

- [ ] OPS.C1 Open the prospect's intake demo URL in a private window — does it load?
- [ ] OPS.C2 If it does NOT load: open **https://glp-convert.vercel.app/maintenance** in a new tab → click `/healthz`. If 200 → it's a per-tenant data issue, not a global outage. If not 200 → global outage, follow runbook #1.
- [ ] OPS.C3 If you cannot resolve in 60 seconds, tell the prospect: "We're seeing a brief glitch on our side; I'll send a working preview link within the hour and we can resume." Do NOT panic-debug on the call.
- [ ] OPS.C4 Open Vercel Deployments → if the latest deploy is red, click previous green → **Promote to Production**. Site is back up while you investigate.
- [ ] OPS.C5 Email yourself a Sentry alert summary so you have a written record of what broke + what you did.

### **OPS-MONITORING — What to set up in Sentry + Vercel for ongoing peace of mind**

- [ ] OPS.MO1 **Sentry alert rule**: in Sentry → Alerts → New Alert Rule → "Send me email when an issue first appears" + "Send me email when an issue regresses". Triggers email immediately on any new uncaught crash.
- [ ] OPS.MO2 **Sentry weekly digest**: Settings → Notifications → Weekly Reports → enable. Catches anything you missed.
- [ ] OPS.MO3 **Vercel error notifications**: Vercel → Project → Settings → Notifications → enable email notifications for failed deploys + 5xx error spikes.
- [ ] OPS.MO4 **Stripe webhook failure alerts**: Stripe Dashboard → Developers → Webhooks → click your endpoint → "Notify me on failures" toggle.
- [ ] OPS.MO5 **Google Postmaster weekly check**: set a recurring Monday calendar reminder titled "Postmaster spam-rate check — pause if >0.10%". Ten seconds per domain.
- [ ] OPS.MO6 **Uptime monitoring (optional, recommended)**: sign up for **https://uptimerobot.com** free tier (50 monitors). Add `/healthz` as the check URL → 5-min interval → email + SMS alerts on downtime. Catches outages while you sleep.

### **OPS-WHAT-IF — "I see X, what do I do?" quick reference**

| Symptom | First place to look | Then |
|---|---|---|
| Entire site returns 5xx | Vercel Deployments | Promote previous green deploy → fix latest |
| `/healthz` returns 503 | Vercel Logs | Filter on `/api/healthz` for the underlying error |
| Customer reports failed payment | Stripe Webhook deliveries | Re-send the failed event; check env vars |
| Leads dashboard empty after submission | Supabase Logs | Look for RLS or insert errors; check service role key |
| No confirmation email | Resend Emails | Search by recipient address; check Bounced status |
| Reply rate dropped suddenly | Google Postmaster | Spam-rate per domain; pause if >0.10% |
| Account paused on Instantly | Instantly Email Accounts | Check IP warmup + bounce rate; reduce daily volume 50% |
| LinkedIn account warning | Botdog account-health indicator | Pause 48h, resume at half volume |
| Sentry alert email | Sentry Issues | Click link in email → stack trace + breadcrumbs |
| Slow page loads | Vercel Analytics → Web Vitals | Identify slowest pages; check largest payloads |

---

## 💰 Steady-state cost summary (Wellspire-only — Sunspire decommissioned, May 2026 final stack)

| Item | Phase 1 (10k/mo, Day 22–45) | Phase 3 (50k+/mo, Day 90+) | Notes |
|---|---|---|---|
| Wellspire apex domain | ~$1 amortized | ~$1 amortized | Namecheap ~$8–12/yr |
| GLPConvert sending domains | ~$3 (4 domains) | ~$7 (8–10 domains) | Namecheap ~$8–12/yr each |
| Google Workspace inboxes ($8.40 ea., 2026) | **~$168** (20 inboxes) | **~$420** (50 inboxes) | New Wellspire Workspace, Business Starter (was $7.20 in earlier years; bumped to $8.40 in 2026) |
| **Smartlead Pro** (cold-email sequencer) | **$94/mo** | **$94/mo** | May 2026 pick over Instantly — see CE005. Unlimited inboxes + warmup at all plans, no volume cliff. |
| **Clay** (lead enrichment, waterfall) | **$149/mo** Starter | **$149/mo** Starter | Apollo lives inside Clay — best of both. |
| **Apollo** (lead source via Clay) | $0 (free tier) | $0–49/mo Pro | Clay pulls from Apollo's database; Apollo Pro only needed for higher search ceilings. |
| **Make.com** Core (automation glue) | **$9/mo** | **$9/mo** | Routes Clay → ZeroBounce → Smartlead. |
| **Airtable** (lead CRM) | **$0** Free tier | **$20/mo** Team | Free tier handles 1k records; Team for 50k/mo flow. |
| **ZeroBounce** | ~$8/mo (1k/mo) | ~$160/mo (~20k/mo verifications) | $0.008/email. 50k/mo cold = ~20k unique prospect verifications/mo (with reuse). |
| **LinkedIn Sales Navigator Advanced** | **$169/mo** | **$169/mo** | One sub per LinkedIn account that does outreach (you only need ONE — the account that owns the campaigns). |
| **Heyreach Pro** ($79/seat × 3 seats) | **$237/mo** | **$395/mo** (5 seats) | 3 seats Phase 1, 5 at scale. |
| **Optional Expandi backup** ($99/seat) | $0 | +$99–198/mo (1–2 seats) | Buy ONLY if Heyreach accounts get LinkedIn warnings — see LI1.3. |
| **Resend** (app-side transactional) | **$0** Free tier | **$20/mo** Pro | Lead-notify / magic-link emails only; NOT cold outreach. |
| **Total ops** | **~$868/mo Phase 1** | **~$1,240/mo Phase 3** | Add ~$200/mo if Expandi backup is in play. (Workspace went $7.20→$8.40 in 2026.) |
| Lead enrichment per 50k batch | ~$1,050 one-time | ~$1,050 one-time | Brandfetch + Logo.dev one-shot. Reuse for repeat campaigns. |
| **Stripe revenue ramp (target)** | **$1k–4k MRR by Day 60** | **$10k–25k MRR by Day 120** | Phase 3: 50k cold + 1.2k LinkedIn × 0.1–0.3% = 15–25 paying clinics/mo @ $99/mo + $399 setup. |

**Net cost-to-acquire-a-clinic (Phase 3):** $1,240 / 20 clinics = **~$62 CAC** plus prorated enrichment. At $99/mo + $399 setup = $498 first-month revenue per clinic, payback is < 30 days.

---

## 📚 Sources cited (May 2026 cohort — updated round 33)

**New May 2026 sources added in round 33 (re-verified the tool stack):**
- [Smartlead vs Instantly — Data-Backed 2026 comparison (Sparkle.io)](https://sparkle.io/blog/smartlead-vs-instantly/)
- [Smartlead Pricing 2026 (smartlead.ai/pricing)](https://www.smartlead.ai/pricing)
- [Pipeline-per-Dollar 2026 ROI breakdown (Instantly's own data)](https://instantly.ai/blog/instantly-vs-smartlead-lemlist-2026/?lng=en)
- [9 Best LinkedIn Outreach Automation Tools 2026 ranked by Safety (SyncGTM)](https://syncgtm.com/blog/best-linkedin-outreach-automation-tools)
- [HeyReach 2026 LinkedIn limits report (heyreach.io)](https://www.heyreach.io/blog/best-linkedin-automation-tools)
- [LinkedSDR 2026 Best LinkedIn Tools](https://www.linkedsdr.com/blog/best-linkedin-automation-tools-for-outreach-in-2026)
- [Clay vs Apollo 2026 (Salesforge)](https://www.salesforge.ai/blog/clay-vs-apollo)
- [Cold Email Domain Setup Guide 2026 (LeadHaste)](https://leadhaste.com/blog/cold-email-domain-setup-guide-2026)
- [Cold Email Deliverability 2026 (Bitscale)](https://bitscale.ai/blogs/cold-email-deliverability-in-2026)
- [Tofu vs Mutiny 2026 ABM Campaigns](https://www.tofuhq.com/post/tofu-vs-mutiny-for-abm-campaigns)
- [Userled vs Mutiny 2026](https://www.userled.io/userled-vs-mutiny)
- [Best Tools for 1:1 ABM Campaigns 2026 (Tofu HQ)](https://www.tofuhq.com/post/best-tools-for-1-1-abm-campaigns)
- [Apollo State of Outbound Q1 2026 (apollo.io/research)](https://apollo.io/research)
- [Hunter.io 20 Best Cold Email Tools 2026](https://hunter.io/blog/cold-email-software/)

**Email deliverability + cold-email mechanics (May 2026 rev):**
Google "Email sender guidelines" (support.google.com/a/answer/81126, 2026 rev) · Google "Add another domain to your Workspace" (support.google.com/a/answer/7502379) · Google "Authenticate email with DKIM" (support.google.com/a/answer/180504) · Yahoo Postmaster "Sender Best Practices" 2026 · Microsoft Tech Community "New outbound email requirements for high-volume senders" May 2025 + Mar 2026 update · Apple Developer "Mail Privacy & Authentication" Jan 2026 · Smartlead "2026 Cold Email Deliverability Guide" Apr 2026 · Apollo "State of Outbound 2026" (apollo.io/research, Q1 2026) · Reachinbox "Cold Email Playbook 2026" · Lavender "2026 Cold Email Writing Report" (lavender.ai/research, Mar 2026) · Quickmail "2026 Sequence Architecture" (quickmail.com/blog) · Reply.io "Outbound 2026 Benchmark Report" · EmailToolTester March 2026 deliverability benchmark · MXroute 2026 deliverability whitepaper · Postmark "2026 Bulk Sender Compliance Guide" · Mailmodo Apr 2026 outbound report · Hunter.io 2026 Email Verification Standards.

**LinkedIn outbound + automation (May 2026 rev):**
Heyreach "2026 LinkedIn Limits Report" (heyreach.io/resources, Apr 2026 rev) · LinkedIn Engineering Blog "Automation detection improvements" Oct 2025 + Feb 2026 update · LinkedIn Marketing Solutions "B2B Buyer Behavior 2026" · LinkedIn Sales Navigator 2026 Best Practices Guide · Outbound Squad "2026 LinkedIn Cold DM Playbook" · Cognism "State of LinkedIn Outbound 2026" Mar 2026 · Salesloft 2026 LinkedIn-vs-Email Channel Mix Report · Lemlist "LinkedIn Multi-Touch 2026" · Surfe "2026 LinkedIn Engagement Benchmark" · SyncGTM "9 Best LinkedIn Outreach Automation Tools 2026 ranked by Safety" (syncgtm.com/blog) · LinkedSDR "Best LinkedIn Outreach Automation Tools 2026."

**Personalization / 1:1 ABM landing-page tools (May 2026 — verified for the Mutiny/Userled/Tofu vs URL-param decision):**
[Tofu vs Mutiny 2026](https://www.tofuhq.com/post/tofu-vs-mutiny-for-abm-campaigns) · [Tofu vs Userled 2026](https://www.tofuhq.com/post/tofu-vs-userled-best-ai-abm-platform) · [Userled vs Mutiny 2026](https://www.userled.io/userled-vs-mutiny) · [Best Tools for 1:1 ABM Campaigns 2026](https://www.tofuhq.com/post/best-tools-for-1-1-abm-campaigns) · Mutiny product page (mutinyhq.com/product, May 2026) · Prismic "8 Best Mutiny Alternatives 2026."

**Multi-product / multi-brand company ops (May 2026):**
Stripe Atlas "Operating multiple SaaS under one LLC" (stripe.com/atlas/guides, Mar 2026) · Y Combinator W26 Library "When to spin a brand into its own LLC" · Indie Hackers Apr 2026 podcast #487 (multi-product solo founder) · Reforge "Multi-product company architecture" 2026 · Google Workspace Admin Help "Multi-domain workspace cost model" May 2026.

**Compliance + legal:**
EDPB Guidelines 8/2020 (legitimate interest) · CAN-SPAM Act of 2003 (FTC compliance baseline) · CCPA + CPRA + CDPA + CTDPA + UCPA (state privacy stack as of 2026) · GDPR Art. 6(1)(f) legitimate interest analysis · CASL (Canada) · UK PECR · Australia Spam Act 2003 (revised 2025).

**Tooling APIs + enrichment:**
Brandfetch API docs (brandfetch.com/developers) · Logo.dev API · ZeroBounce API · Apollo API · Clay docs · Make.com docs · Airtable Web API · Instantly API · Heyreach API · Resend API · Stripe API.

**Internal references:**
`lib/product-identity.ts` (Wellspire LLC parent-company declaration) · `app/maintenance/page.tsx` (internal ops runbook for monitoring + crash response) · **🗑️ APPENDIX Z** at the bottom of this file (Sunspire decommissioning steps — runs AFTER CE000-CE010 + LI001-LI009 + maintenance).

---

## 🎯 Bottom-line opinion (round 33 — re-verified May 2026)

**The cheapest, easiest, AND most-effective path from Day 0 to 50k+/mo personalized GLPConvert cold emails:**

1. **Day 0 (today):** sign up for `Wellspirellc@gmail.com` parent-ops Gmail (CE000.PRE) → buy your Wellspire apex at Namecheap (CE000.A + CE000.B) → spin up the new Wellspire Workspace under Wellspire LLC (CE000.C) → set Wellspire LLC card on every SaaS vendor (CE000.D). **Total clicks: ~30. Total time: 2-3 hrs. Total $: ~$10 + new Workspace seats start billing. (Sunspire decommissioning happens later — see APPENDIX Z at the bottom of this file.)**

2. **Day 1:** buy 4 GLPConvert sending domains (CE001) → add as secondary domains to Wellspire Workspace (CE002) → create the first 16-20 cold-email inboxes (CE003) → start DNS auth on each domain (CE004 — SPF/DKIM/DMARC). **Total clicks: ~150. Total time: 3-4 hrs.**

3. **Day 2-3:** sign up for **Smartlead Pro $94/mo** (CE005 — May 2026 pick over Instantly), connect all inboxes, **start the 21-day warmup**. **Total clicks: ~80. Total time: 1-2 hrs.**

4. **Day 4-7:** spin up Clay GLPConvert table → run the Apollo waterfall to pull 2,500 GLP-1 clinic prospects → enrich via Brandfetch + Logo.dev → build the canonical individualized demo URL (CE-DEMO-URL spec, formula in CE6.8) → wire up Make.com Clay→ZeroBounce→Smartlead automation → ship compliance page (CE006-CE008). **Total clicks: ~50. Total time: 4 hrs.**

5. **Day 8:** sign up for **Heyreach Pro $79/seat × 3 seats** (LI001) → connect 3 warmed LinkedIn accounts (LI002-LI003) → build Sales Nav search + export to Heyreach (LI004) → enrich in Clay (LI005) → build the 6-step LinkedIn sequence (LI006). **Total clicks: ~70. Total time: 3 hrs.**

6. **Days 9-21:** **DO NOTHING TO THE EMAIL CAMPAIGNS.** Warmup runs in the background. Use these days to QA your Stripe checkout (M000 Resend live + Stripe live), verify the maintenance page, write the cold-email + LinkedIn copy, A/B test 2-3 subject lines on yourself.

7. **Day 22:** flip both campaigns live (CE010.1 + LI007.1). **Daily limit per inbox: 25** (cold email) + **100/wk per account** (LinkedIn). Phase 1 throughput: ~10k cold emails/mo + 1.2k LinkedIn requests/mo.

8. **Day 45:** if Postmaster spam-rate <0.05% for the prior 30 days → enter **Phase 2** (CE10.4) — add 20-30 more warmed inboxes. Phase 2 throughput: ~25k cold/mo.

9. **Day 90:** if Postmaster spam-rate stays <0.05% → enter **Phase 3** (CE10.7-10.10) — push the cleanest 20 inboxes to 30-35/day. Phase 3 throughput: **50k+ cold/mo + 1.2k LinkedIn = 50k+ total monthly outbound touch.**

**Steady-state cost (Phase 3): ~$1,240/mo** — see cost-summary table above.

**Steady-state revenue target (Phase 3, Day 120+):** **$10-25k MRR** at 0.1-0.3% activation × $99/mo + $399 setup. CAC payback < 30 days.

**The individualized demo URL is your differentiator.** Mutiny ($5k+/mo) and Userled ($$$/mo) sell exactly this — per-prospect microsite with company name + logo + brand color in a hero. GLPConvert's intake page accepts those as URL params for $0. The Clay-built URL string is your ABM landing engine. Treat the canonical URL spec (CE-DEMO-URL section above) as a contract — anything that breaks the renderer's `?demo=1&handle=...&company=...&brand=...&logo=...` reads breaks every cold-email LP for free.

**Things that will be tempting but you should not do:**
- ❌ Send from `glpconvert.com` apex (burns marketing reputation; sending happens from the 4 sending domains).
- ❌ Skip the 21-day warmup (Gmail late-2025 enforcement is strict).
- ❌ Push past 25/day per inbox before Day 45 (single fastest way to burn the new domains).
- ❌ Buy Mutiny / Userled / Tofu (you already have the URL-param renderer — duplicate spend).
- ❌ Use Chrome-extension LinkedIn tools (banned at high rates per LinkedIn 2026 detection updates).
- ❌ Try to hit 50k/mo in Phase 1 (the math doesn't work — it requires 91 inboxes at safe rates; Phase 1 only has 16-20).

**One brain-friendly mental model:** Phase 1 (Day 22) = "go live small to prove the funnel + sequence." Phase 2 (Day 45) = "double the fleet." Phase 3 (Day 90) = "push the proven volume to 50k." If anything goes wrong at any phase boundary, you stay in the prior phase another 30 days. The whole machine is gated on Postmaster's reputation signal — that's your single source of truth.

**Triple-check before you click anything in CE000-CE010:** read this Bottom-line, scan the Decision Summary table at the top, then walk the CE buttons in literal order. Any deviation from the order (especially skipping warmup) costs more time than it saves.

---

<a id="-appendix-z-sunspire-decommission"></a>

# 🗑️ APPENDIX Z — SUNSPIRE DECOMMISSIONING (do AFTER everything above)

> **What this section is.** Sunspire was the prior solar-vertical SaaS that lived on its own Namecheap account, its own Google Workspace, and its own deploys at Vercel/Sentry/Supabase/Resend/Stripe. Sunspire is being **fully sunset** — no customers being migrated, nothing kept alive. This appendix is the literal click-by-click runbook to wind it down cleanly, billing off, no lingering charges, no surprise renewals next April.
>
> **WHY this is at the bottom of the file (not in the cold-email setup).** Decommissioning Sunspire is NOT on the critical path to GLPConvert revenue. The right order is: ① stand up Wellspire + GLPConvert (CE000-CE010 above), ② warm up + launch (Days 22-90), ③ then come back to Appendix Z and shut Sunspire down. If you do it the other way, you risk killing forwarding rules / DNS records / vendor accounts you might still need on Day 1-21 of the GLPConvert ramp. Wait until your new stack is healthy.
>
> **WHEN to start Appendix Z:** earliest is Day 22 (after the new Wellspire Workspace + sending domains are live and warmup has been running 21 days). Latest reasonable is Day 90 (steady state) — after that you're paying Sunspire vendor invoices for nothing.
>
> **Estimated time:** 60-90 minutes of clicks, then a 30-day grace window where Sunspire's Workspace finishes its final billing cycle, then you confirm domains have expired (45-90 days). Total wall-clock: ~3 months from kickoff to fully gone.
>
> **What you keep vs delete:**
>
> | Account / asset | Action | Why |
> |---|---|---|
> | Sunspire Namecheap account | Cancel auto-renew on every Sunspire-themed domain → let expire | Domains roll off; no ongoing charge after current term |
> | Sunspire Google Workspace | Cancel subscription at next billing date | 30-day grace to export anything; then dead |
> | Sunspire Stripe account | Either close, or keep dormant (no harm if zero volume) | If you want clean accounting under Wellspire LLC, close it |
> | Sunspire Resend domain | Delete from Resend dashboard | No reason to keep |
> | Sunspire Vercel project | Delete deploy + project | Frees the Vercel slot |
> | Sunspire Sentry project | Archive → delete | Sentry charges per-project |
> | Sunspire Supabase project | Pause → delete after 30 days | Supabase charges per-project |
> | `/Users/hugowentzel/sunspire-clean/` local code | Archive to backup drive — DO NOT DELETE | Useful as historical reference; the demo-URL pattern, status page, healthz route etc. are model code for future SaaS brands under Wellspire |
> | Shared SaaS vendor accounts (Smartlead/Heyreach/Clay/Make/Airtable/ZeroBounce/Sales Nav/Brandfetch/Logo.dev/Cloudflare) | NOT Sunspire-tied — already handled in CE000.D under Wellspire | No action here |

### **Z001 — Sunspire Namecheap: turn off auto-renew on every Sunspire-themed domain** (5 min)

- [ ] Z1.1 Open https://www.namecheap.com → sign in to your **Sunspire Namecheap account** (the OLD one, not the Wellspire one from CE000.B).
- [ ] Z1.2 Left nav → **Domain List**.
- [ ] Z1.3 For each Sunspire-themed domain (`sunspiretool.com`, `getsunspire.com`, `usesunspire.com`, `sunspirequote.com`, plus the apex `sunspire.com` if you own it):
  - Click **Manage** next to the domain.
  - Top toggle row → set **Auto-Renew** to **OFF**.
  - Top toggle row → set **WhoisGuard** auto-renew to **OFF** as well (so privacy doesn't auto-renew either).
- [ ] Z1.4 Confirm: in **Domain List** the **Auto-Renew** column shows **OFF** for every Sunspire-themed domain.
- [ ] Z1.5 At domain expiration: the domain enters a 45-day grace where you can recover; after that, the registry releases it. **No further action needed** — domains expire on their own and Namecheap stops billing.

### **Z002 — Sunspire Google Workspace: cancel subscription** (10 min)

- [ ] Z2.1 Open https://admin.google.com → sign in with the **Sunspire Workspace super-admin** (the OLD admin login, not the Wellspire one from CE000.C6).
- [ ] Z2.2 Left nav → **Billing → Subscriptions**.
- [ ] Z2.3 Click your Sunspire Workspace subscription → **Cancel subscription** → choose **End at next billing date** (NOT "Cancel immediately" — gives you 30 days of grace to export anything).
- [ ] Z2.4 Workspace admin → **Apps → Google Workspace → Gmail → Routing → Add setting** → catch-all forwarding rule:
  - **Inbound**: route every message addressed to a `@sunspiretool.com` / `@getsunspire.com` / etc. inbox **forward to** `Wellspirellc@gmail.com`.
  - This ensures any final straggler reply from a Sunspire prospect lands in your Wellspire ops inbox during the 30-day grace window — you don't lose anything on the way out.
- [ ] Z2.5 Optionally: **Settings → Data Export → Export all user data** if you want a backup of every Sunspire inbox before the grace window closes. Google emails you the archive. Save to backup drive.
- [ ] Z2.6 Wait 30 days. Confirm at admin.google.com → **Billing → Subscriptions** that Sunspire Workspace shows **No active subscription**. If it does, decommission is complete on the Workspace side.

### **Z003 — Sunspire Stripe / Resend / Vercel / Sentry / Supabase** (15 min)

> Each of these is a vendor where Sunspire had its own account or project. Close or delete cleanly.

- [ ] Z3.1 **Stripe — Sunspire account.** If you have a separate Stripe account for Sunspire (vs sharing with Wellspire): open https://dashboard.stripe.com → switch to the Sunspire account → **Settings → Account → Close account**. Stripe will reject this if there are open disputes / pending payouts; resolve those first. If you'd rather keep the Sunspire Stripe dormant (no harm if zero volume), skip closing — but make sure auto-billing on any Stripe products is OFF. Either way, **make sure no Sunspire Stripe charges are still pulling against your Wellspire LLC card** (you set Wellspire's card on the Wellspire Stripe in CE000.D1).
- [ ] Z3.2 **Resend — Sunspire domain.** Open https://resend.com/domains → click your Sunspire domain (e.g. `mail.sunspiretool.com`) → **Delete domain**. Confirm. If you have a separate Resend account for Sunspire, also: **Settings → Account → Delete account**.
- [ ] Z3.3 **Vercel — Sunspire project.** Open https://vercel.com/dashboard → click the Sunspire project → **Settings → Advanced → Delete project**. Confirm by typing the project name. Frees the Vercel slot for future SaaS brands under Wellspire.
- [ ] Z3.4 **Sentry — Sunspire project.** Open https://sentry.io → click the Sunspire org/project → **Settings → General → Remove Project** → confirm. Sentry stops charging for that project at the end of the current billing period.
- [ ] Z3.5 **Supabase — Sunspire project.** Open https://supabase.com/dashboard → click the Sunspire project → **Settings → General → Pause project** (gives you 30 days to recover if you need data). After 30 days: **Settings → General → Delete project** → confirm by typing the project name.
- [ ] Z3.6 At end of these: open each vendor's billing dashboard 30 days from now and confirm there are no Sunspire-tied invoices arriving on the Wellspire LLC card (or your personal card, if any Sunspire vendor was on it).

### **Z004 — Local code archive** (5 min)

- [ ] Z4.1 Move `/Users/hugowentzel/sunspire-clean/` to a backup drive (external SSD, iCloud Drive folder marked archived, or Google Drive `Wellspire / archive / sunspire-clean-2026-05`).
- [ ] Z4.2 Do NOT delete the local copy permanently. Useful as historical reference: the demo-URL pattern (`/?company=…&demo=1&domain=…`), status page (`/status`), `/healthz` route, and `COMPLETE-LAUNCH-RUNBOOK.md` are all good model code for any future SaaS brand under Wellspire.
- [ ] Z4.3 If you have a local Vercel CLI link to the Sunspire project (`.vercel/project.json` inside `sunspire-clean/`), delete it after the project itself is deleted in Z3.3.

### **Z005 — Final verification (Day 90 of the GLPConvert ramp; Day ~120 from kickoff)**

- [ ] Z5.1 https://admin.google.com (sign in with the Sunspire admin if it still exists) → **Billing → Subscriptions** → confirm **"No active subscriptions"**. ✅
- [ ] Z5.2 https://www.namecheap.com (Sunspire account) → **Domain List** → Sunspire-themed domains should now appear in **Recently Expired** (Days 45-90 after expiration) then disappear from your list. ✅
- [ ] Z5.3 https://dashboard.stripe.com → if you closed the Sunspire Stripe in Z3.1, it should show "Account closed" or be inaccessible. If you kept dormant, confirm no charges in the last 90 days. ✅
- [ ] Z5.4 Open your Wellspire LLC bank statement for the last 30 days. Search for "Sunspire" and "Namecheap" and "Google Workspace" charges associated with old Sunspire SKUs. There should be **zero** Sunspire charges. If anything still bills, trace it back to the vendor in Z003 and shut it down. ✅
- [ ] Z5.5 Sunspire is now fully decommissioned. The Wellspire LLC + GLPConvert stack is the only live SaaS infrastructure. ✅

---

> **Done.** After Z005 you have:
> - Wellspire LLC running every SaaS vendor account, every sending domain, every Workspace seat
> - GLPConvert at steady state (~50k cold emails/mo + 1,200 LinkedIn DMs/mo) per CE000-CE010 + LI001-LI009
> - Sunspire fully wound down: no domains owned, no Workspace charges, no Vercel/Sentry/Supabase/Resend projects, no surprise auto-renews
> - A backup archive of the Sunspire codebase for historical reference
>
> Future SaaS brand #2 under Wellspire: just repeat CE001-CE010 with new sending domains under the same Wellspire Namecheap + Workspace + LLC card.
