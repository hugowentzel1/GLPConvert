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
> **Round-33 best-practice deltas vs earlier rounds:** (1) Smartlead Pro is now the recommended cold-email tool over Instantly for the 50k+/mo volume target (see CE005 + Executive Decision Summary); (2) per-inbox volume cap revised to 25/day max per Gmail's late-2025 + Mar-2026 classifier (16-20 inboxes only ships ~10k/mo, so Phase 1 → Phase 2 → Phase 3 scale-up to 40-50 inboxes is now explicit in CE010); (3) Heyreach stays the LinkedIn primary at $79/seat with Expandi $99/seat as a per-account safety upgrade; (4) the canonical individualized demo URL spec is in **CE-DEMO-URL** below — that's your free Mutiny/Userled equivalent.
>
> Day 0 → stand up Wellspire infra (CE000 below) + buy GLPConvert sending domains. Day 1 → DNS + Workspace setup. Day 22 → first emails go out. Day 90+ → steady state at 50,000+/mo. Sources cited inline + summarized at bottom. **Sunspire decommissioning steps are isolated in 🗑️ APPENDIX Z at the very bottom of this file — run that after the Wellspire stack is healthy.**

---

## ✅ MASTER PROGRESS TRACKER — check off as you go

> Tick each box below as you complete its subsection. This is your single-page status board — at any moment you should be able to look at this list and know exactly which phase you're in. Each major task `CE0xx` / `LI0xx` / `Z0xx` has its own detailed sub-checklist further down the page; this tracker rolls them up.

**🏗️ PHASE 0 — Wellspire LLC foundation (Day 0, ~3 hrs of clicks)**
- [x] CE000.PRE — Wellspire parent-ops Gmail (`Wellspirellc@gmail.com`) ✅ done 2026-05-09
- [x] CE000.A — Pick Wellspire apex domain → **wellspirellc.com** ✅ done 2026-05-10
- [x] CE000.B — Open Wellspire Namecheap account + buy apex (`wellspirellc.com`, ~$11) ✅ done 2026-05-10
- [ ] CE000.C — Open Wellspire Google Workspace + admin user + 2FA  ← **YOU ARE HERE**
- [ ] CE000.D — Wellspire LLC business card on every SaaS vendor (waits on LLC formation)

**🛠️ PHASE 1A — GLPConvert sending infrastructure (Day 1, ~4 hrs)**
- [ ] CE001 — Buy 4 GLPConvert sending domains
- [ ] CE002 — Add 4 sending domains as Workspace secondaries
- [ ] CE003 — Create 16-20 cold-email inboxes
- [ ] CE004 — DNS auth on each domain (SPF + DKIM + DMARC + MX + Postmaster)

**🛠️ PHASE 1B — Cold-email tool stack (Days 2-7, ~6 hrs)**
- [ ] CE005 — Sign up for Smartlead Pro + connect inboxes + start 21-day warmup
- [ ] CE006 — Build lead list in Clay (Apollo + Brandfetch enrichment)
- [ ] CE007 — Wire up Make.com automation (Clay → ZeroBounce → Smartlead)
- [ ] CE008 — Compliance (privacy page, CAN-SPAM footer, suppression list)

**💼 PHASE 1C — LinkedIn parallel track (Days 1-10, ~4 hrs)**
- [ ] LI001 — Sign up for Sales Navigator + Heyreach
- [ ] LI002 — Audit + manually warm 3-5 LinkedIn accounts (7-14 days)
- [ ] LI003 — Connect accounts to Heyreach
- [ ] LI004 — Build lead list in Sales Navigator
- [ ] LI005 — Enrich leads in Clay
- [ ] LI006 — Build the Heyreach 6-step sequence

**⏳ PHASE 1D — WAIT (Days 8-21)**
- [ ] Smartlead warmup runs in background (do not touch). Use this time to QA Stripe checkout + write/A-B-test cold-email + LinkedIn copy on yourself.

**🚀 PHASE 2 — Pilot launch (Day 22, ~10k emails/mo + 1.2k LinkedIn/mo)**
- [ ] CE009 — Build the email sequence (4 steps over 14 days)
- [ ] CE010.1-10.3 — Activate Smartlead campaign at 25/inbox/day
- [ ] LI007 — Activate Heyreach campaign at 100/wk per account

**📈 PHASE 2 — Scale to 25k/mo (Days 45-90, gated on Postmaster <0.05% spam-rate for prior 30 days)**
- [ ] CE10.4 — Add 20-30 more inboxes; warm up another 21 days
- [ ] CE10.5 — Add new inboxes to Smartlead campaign
- [ ] CE10.6 — Total daily campaign cap raised to ~1,000

**📈 PHASE 3 — Scale to 50k+/mo (Day 90+, gated on Postmaster <0.05% spam-rate for prior 30 days)**
- [ ] CE10.7 — Postmaster gate check
- [ ] CE10.8 — Push cleanest 20 inboxes to 30-35/day
- [ ] CE10.9 — Stand up second Wellspire Workspace if 50k+ exceeds first Workspace's reputation envelope
- [ ] CE10.10 — Steady state hit ✅

**🩺 ALWAYS-ON — Maintenance**
- [ ] OPS-DAILY (10 min/day): reply triage + `/healthz` + `/status`
- [ ] OPS-WEEKLY (30 min/Mon): Postmaster spam-rate per domain + Heyreach health + bounce/reply rates
- [ ] OPS-MONTHLY (1 hr/first Mon): inbox rotation, list refresh, ZeroBounce next batch

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
| **Lead source + enrichment** | **Apollo (inside Clay)** | Apollo basic + Clay Starter | **$0–49 + $149 = ~$149–198/mo** | Clay's [waterfall enrichment over 100+ providers](https://www.salesforge.ai/blog/clay-vs-apollo) beats Apollo standalone (Apollo solo has 5–10% bounce + 1–2% reply per Clay vs Apollo benchmark). Apollo as the SOURCE of identifiers, Clay as the ENRICHMENT engine — best of both. |
| **Bounce verification** | **ZeroBounce** | Pay-as-you-go | **~$0.008/email** | ~$20 per 2,500-prospect batch; mandatory — Gmail's <2% bounce floor breaks domain reputation fast above that. |
| **LinkedIn outreach** | **Heyreach Pro** ($79) **OR Expandi** ($99) | per seat × 3–5 | **$237–495/mo** | Heyreach: cloud + multi-account rotation, $79/seat. Expandi: cloud + **dedicated residential IP per account** (the May 2026 SAFEST tool per [SyncGTM 2026 ranking](https://syncgtm.com/blog/best-linkedin-outreach-automation-tools), <1% ban rate). **Pick Heyreach to save $20/seat/mo; switch to Expandi if any account gets a LinkedIn warning.** |
| **LinkedIn data** | **Sales Navigator Advanced** | $169/mo | **$169/mo** | Required for unrestricted lead-search + InMail credits. Both Heyreach and Expandi pull from Sales Nav. |
| **Automation glue** | **Make.com** Core | $9/mo | **$9/mo** | Routes Clay → ZeroBounce → Smartlead/Heyreach. |
| **Lead CRM** | **Airtable** Free → Team | **$0–$20/mo** | Free tier handles 1k records; bump to Team ($20) at scale. |
| **Sending domains** | **4 GLPConvert-themed** at Namecheap | $40/yr ÷ 12 = **~$3/mo** | Per [Smartlead 2026 + Apollo State of Outbound Q1 2026](https://www.smartlead.ai/pricing): never send from apex `glpconvert.com` (reserved for marketing/Stripe). 4 sending domains × 5 inboxes/domain = 20 inboxes for Phase 1, scale to 8–10 domains × 5 inboxes = 40–50 inboxes for Phase 2 (50k+/mo target). |
| **Workspace inboxes** | **Wellspire Google Workspace Business Starter** | $7.20/inbox/mo | **$144/mo at 20 inboxes; $360/mo at 50 inboxes** | One Workspace can host all 4–10 sending domains as secondaries (Google Workspace Admin Help: support.google.com/a/answer/7502379). |
| **App-side transactional email** | **Resend** | Free → $20/mo Pro | **$0–20/mo** | For lead-notify / welcome / magic-link emails from `notify@mail.glpconvert.com`. NOT for cold outreach. |

**Total steady-state ops cost (Phase 2, ≥50k/mo):** **~$870–1,030/mo** + **~$20** per 2,500-prospect ZeroBounce batch + **~$200/yr** sending-domain renewals.

**Individualized demo URL — DO NOT pay for Mutiny / Userled / Tofu microsites.** GLPConvert's existing intake-page renderer accepts `?demo=1&handle={slug}&company={Url-encoded}&brand={hex-no-#}&brand2={hex-no-#}&logo={Url-encoded URL}&utm_*` and produces a per-prospect branded landing for free. This replaces the $5–10k/mo ABM-LP tier ([Tofu vs Mutiny 2026](https://www.tofuhq.com/post/tofu-vs-mutiny-for-abm-campaigns), [Userled vs Mutiny 2026](https://www.userled.io/userled-vs-mutiny)). See **CE-DEMO-URL** below for the exact URL format + how to build it in Clay.

**Per-inbox sending volume — 2026 reality (revised from earlier rounds):**
- Gmail's late-2025 + Mar-2026 sender classifier downgrades single-inbox volumes above **~25/day** for cold outreach unless the inbox has 6+ months of clean reputation. ([Smartlead 2026 deliverability guide](https://www.smartlead.ai/blog), [Apollo State of Outbound Q1 2026](https://apollo.io/research))
- **Phase 1 (Days 22–45):** 16–20 inboxes × 25/day × 22 days = **~10,000/mo**.
- **Phase 2 (Days 45–90):** add a second batch of warmed inboxes → **40–50 inboxes total** × 25/day × 22 = **~25,000/mo**.
- **Phase 3 (Days 90+, only after Postmaster shows <0.05% spam-rate for 30 days straight):** push to 30–40/day on the cleanest 30 inboxes + 25/day on the rest → **~50,000/mo target**.
- **DO NOT try to hit 50k/mo from 16–20 inboxes by sending 75/day each.** That's the failure mode that gets your domains permanently flagged.

**Channel mix at steady-state (Day 90+):**
- **~50,000 cold emails/mo** (Smartlead) → at 0.1–0.3% activation = **5–15 paying clinics/mo**.
- **~1,200 LinkedIn connection requests/mo** (Heyreach, 3 accounts × 100/wk × 4 wks) → at 30% accept × 1% reply→demo→checkout = **~12 paying clinics/mo**.
- **Combined target: 15–25 clinic activations/mo at $99/mo + $399 setup = ~$5–15k MRR by Day 90.**

**What NOT to do (May 2026 sources):**
- ❌ Send from your apex `glpconvert.com` (burns marketing reputation; per [LeadHaste 2026 Cold Email Domain Setup Guide](https://leadhaste.com/blog/cold-email-domain-setup-guide-2026)).
- ❌ Skip the 21-day warmup ([Smartlead 2026 + Bitscale 2026 Deliverability Guide](https://bitscale.ai/blogs/cold-email-deliverability-in-2026)).
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

> Every cold-email and LinkedIn DM link to a **single per-prospect URL** that GLPConvert's intake page renders into a branded landing with the recipient's company name, logo, and brand color. This is the conversion engine. Get it exactly right.

**Canonical format (production):**

```
https://glpconvert.com/intake?demo=1&handle={slug}&company={UrlEncoded company}&brand={hex-no-#}&brand2={hex-no-#}&logo={UrlEncoded logo URL}&utm_source=cold-email&utm_medium=email&utm_campaign={campaign-slug}&utm_content={first-name-lower}
```

**Real example URL format (use this exact shape per prospect):**

```
https://glp-convert.vercel.app/intake?demo=1&handle=acme-clinic&company=Acme+Weight+Clinic&brand=059669&brand2=064e3b&logo=https%3A%2F%2Flogo.clearbit.com%2Facme.com&utm_source=cold-email&utm_campaign=q2-2026&utm_content=jane
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

**How to build it in Clay (CE006/LI005 formula):**

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

(For LinkedIn: change `utm_source=linkedin` and `utm_medium=dm`.)

**Test your generated URL before launching:** open it in a private window. You should see (a) prospect's logo + monogram avatar in the hero, (b) hero text dyed in the brand color, (c) "Acme Clinic — turn GLP-1 clicks into booked consults." (round-33 home H1 wording — not the long-form intake hero — when you land at `/?demo=1&...`), (d) the "Launch Your Branded Version Now" CTA wired to Stripe. If any of these don't render, the param spec above is the contract — check that Clay isn't double-encoding or stripping the `=` sign.

**Why this is a 1:1 ABM landing equivalent without paying Mutiny/Userled $5k+/mo:** the rendered page changes its hero monogram, brand color, headline, and CTA all from URL params. Mutiny/Userled charge for the ability to do exactly this (per [Tofu vs Mutiny 2026](https://www.tofuhq.com/post/tofu-vs-mutiny-for-abm-campaigns)). You already have the renderer; the only thing the cold-email tool has to do is build the URL string per row. ([Userled vs Mutiny 2026](https://www.userled.io/userled-vs-mutiny) confirms this URL-param approach as the equivalent pattern.)

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
>   - Workspace plan is per-USER, not per-domain. You add **secondary domains** for each SaaS brand (e.g. `wellspire.com` primary + `getglpconvert.com` / `glpconverttool.com` / `useglpconvert.com` / `glpconvertapp.com` secondary).
>   - **Each user can have email at any of those domains.** Create dedicated GLPConvert-domain users (e.g. `jane@getglpconvert.com`) whose login IS that address — best for cold-email brand isolation.
>   - **For cold-email outreach**, 16-20 dedicated users spread across the 4 sending domains. Workspace seats at $7.20 each = $115–145/mo Phase 1 → $360/mo at 50 inboxes Phase 3.
>   - **For ops / billing / legal**, 1-2 `@wellspire.com` users (admin + ops).
>   - **Sender reputation is per-DOMAIN, not per-Workspace.** Each sending domain builds its own Postmaster reputation; the Wellspire apex stays clean for ops.
>
> **Multi-brand ladder (Wellspire now + future brands):**
>
> | Brand | Apex domain | Cold-email sending domains | Status |
> |---|---|---|---|
> | **Wellspire LLC (parent)** | wellspire.com | (none — never cold-emails) | Day 0 setup (this section) |
> | **GLPConvert** | glpconvert.com | getglpconvert.com, glpconverttool.com, useglpconvert.com, glpconvertapp.com | This setup (CE001-CE010) |
> | Future SaaS #2 | TBD | TBD (4 fresh domains under same Wellspire Namecheap) | Repeat CE001+CE002 when ready |
> | Future SaaS #3 | TBD | TBD | Same pattern |
>
> **CE000 sub-steps:**
>
>   - **A** — Pick the Wellspire apex domain.
>   - **B** — Open fresh Namecheap account in Wellspire LLC's name + buy the apex.
>   - **C** — Open fresh Google Workspace under Wellspire (Business Starter $7.20/user/mo).
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

- [ ] CE000.C1 Open a fresh private/incognito window → go to **https://workspace.google.com** → top-right click **"Start free trial"** (or **"Get started"** depending on what Google's homepage shows that day). **If Google routes you through the "Choose the email that is best for your business" comparison page with two cards:** click **"Try Google Workspace"** on the LEFT card ("Custom email and productivity features for your business"), NOT "Get a Gmail address" on the right.
- [ ] CE000.C2 Wizard screen 1 — **"Tell us about your business"**:
   - Business name: `Wellspire LLC`
   - Number of employees: `Just you` (or 1-10 — same plan tier)
   - Region: `United States`
   - Click **Next**.
- [ ] CE000.C3 Wizard screen 2 — **"What's your contact info?"**:
   - First name: `Hugo` (or however you go on legal docs)
   - Last name: your last name
   - Current email: paste **`Wellspirellc@gmail.com`** (your CE000.PRE inbox) — this becomes the recovery / billing-alert email for the entire Workspace.
   - Click **Next**.
- [ ] CE000.C4 Wizard screen 3 — **"Does your business have a domain?"**:
   - Choose **"Yes, I have one I can use"**.
   - Type your Wellspire apex: **`wellspirellc.com`** (your CE000.B purchase).
   - Click **Next**.
   - (If you accidentally pick "No, I need one to get started" Google walks you through buying one through Google Domains — back out and use Namecheap per CE000.B.)
- [ ] CE000.C5 Wizard screen 4 — **"Use this domain to set up your account"**: confirm the domain you typed. Click **Next**.
- [ ] CE000.C6 Wizard screen 5 — **"Do you want to use [domain] for newsletters or marketing?"** — choose **"No, only for my Workspace account"** (we'll add the cold-email sending domains as secondaries in CE002, not here). Click **Next**.
- [ ] CE000.C7 Wizard screen 6 — **"How will you sign in?"**:
   - Username: `hugo` (or `admin`) → so your full Workspace admin email becomes **`hugo@wellspirellc.com`** (or `admin@wellspirellc.com`). This is the Workspace super-admin login — different from `Wellspirellc@gmail.com` from CE000.PRE.
   - Password: vault-generated 18+ chars (1Password / Bitwarden). Save to vault under **"Wellspire Workspace · super admin"**.
   - Confirm password.
   - Tick "I'm not a robot" CAPTCHA.
   - Click **Agree and continue**.
- [ ] CE000.C8 Wizard screen 7 — **"Choose your plan"**:
   - Click **Business Starter** ($7.20/user/mo, 30GB storage per user). Enough for the 16-20 outreach inboxes. Bump to **Business Standard** ($14.40/user/mo) later only if you need shared drives or 99.9% SLA — not needed for cold-email outreach.
   - Click **Next** / **Continue**.
- [ ] CE000.C9 Wizard screen 8 — **"How many users?"**: pick **1** for now (the admin). You'll add the 16-20 outreach inboxes later in CE003 (each one bills separately at $7.20/mo). Click **Next**.
- [ ] CE000.C10 Wizard screen 9 — **"Review and pay"**:
   - Confirm 14-day free trial → no charge today.
   - Add Wellspire LLC business credit card (or personal card if LLC card not yet ready — you'll swap cards in CE000.D1 after LLC is formed).
   - Billing address: Wellspire LLC's registered office (or your personal address temporarily; update after LLC formation).
   - Click **Agree and continue** / **Buy**.
- [ ] CE000.C11 Post-purchase screen — **"Verify your domain"**:
   - Google shows a TXT record: `google-site-verification=<long-random-string>`.
   - Open Namecheap (the Wellspire account from CE000.B) in another tab → **Domain List** → click **Manage** next to your apex → **Advanced DNS** tab → **Add New Record** → Type: `TXT Record` → Host: `@` → Value: paste Google's verification string → TTL: `Automatic` → green check to save.
   - Wait 2-5 min for DNS propagation.
   - Back in the Workspace verification screen → click **Verify**. Should turn green within seconds. (If it says "still propagating" wait another 5 min and click Verify again.)
- [ ] CE000.C12 Post-verification — **MX records prompt**: Google shows a single MX record: `smtp.google.com`, Priority `1`. **Skip this for now** — you'll set MX records on the SENDING domains in CE004.1, not on the Wellspire apex (the apex is for ops email, low volume; we set MX after we add secondary domains in CE002). If Google insists, click **Activate Gmail** → it will set MX on the apex (fine). The 4 sending domains get MX configured separately in CE004.1.
- [ ] CE000.C13 You're now in the Workspace Admin Console (admin.google.com). Sidebar nav → **Account → Domains → Manage domains** — confirm your Wellspire apex (`wellspirellc.com`) is listed as the **Primary** verified domain.
- [ ] CE000.C14 **Add MFA on the admin account** (CRITICAL — losing this account locks you out of every Wellspire outreach inbox):
   - Top-right click your profile photo → **Manage your Google Account** → **Security** → **2-Step Verification** → **Turn on 2-Step Verification**.
   - Add **Google Authenticator** as the primary 2FA method (NOT just SMS — SMS is SIM-swap-vulnerable).
   - Generate **backup codes** → click **Print** or copy all 8 → save to 1Password / Bitwarden under "Wellspire Workspace · super admin · backup codes".
- [ ] CE000.C15 Add **Wellspirellc@gmail.com** as an additional recovery email on the Workspace admin account:
   - Same Security page → **Recovery email** → **Edit** → enter `Wellspirellc@gmail.com` → save. Now if you lose your password, recovery email lands in CE000.PRE, not somewhere else.
- [ ] CE000.C16 Save Workspace admin credentials in vault: login URL (admin.google.com), admin username (`hugo@wellspirellc.com`), password, 2FA backup codes, recovery email (`Wellspirellc@gmail.com`).

#### CE000.D — Wellspire LLC business card on every SaaS vendor account

> Sign up (or log in to existing) at each vendor below. For NEW accounts: use `Wellspirellc@gmail.com` as the registration email + Wellspire LLC business card as payment. For ANY existing accounts you already pay for under a personal card: open the vendor's **Billing** page and swap the card to the Wellspire LLC business card. Goal: every SaaS-ops invoice flows through Wellspire's books from Day 0. This is the difference between clean accounting and a year-end mess.

- [ ] CE000.D1 **Stripe** → [dashboard.stripe.com](https://dashboard.stripe.com) → **Settings → Business settings → Public details** → confirm legal entity = **Wellspire LLC**. Then **Account & billing** → update payment method to Wellspire LLC card if anything is billed (Atlas fees, Sigma, etc.).
- [ ] CE000.D2 **Resend** → [resend.com/settings](https://resend.com/settings) → **Billing** → Wellspire LLC card.
- [ ] CE000.D3 **Vercel** → [vercel.com/dashboard](https://vercel.com/dashboard) → **Settings → Billing** → Wellspire LLC card.
- [ ] CE000.D4 **Sentry** → [sentry.io](https://sentry.io) → **Settings → Subscription → Update billing**.
- [ ] CE000.D5 **Supabase** → [supabase.com/dashboard/account/billing](https://supabase.com/dashboard/account/billing) → Wellspire LLC card.
- [ ] CE000.D6 **Smartlead** → [app.smartlead.ai](https://app.smartlead.ai) → **Settings → Billing** → Wellspire LLC card. (Sign up Day 2-3 in CE005; come back to set the card here.)
- [ ] CE000.D7 **Heyreach** → [app.heyreach.io](https://app.heyreach.io) → **Settings → Billing** → Wellspire LLC card. (Sign up Day 1 in LI001.)
- [ ] CE000.D8 **Clay** → [clay.com](https://clay.com) → **Settings → Billing** → Wellspire LLC card.
- [ ] CE000.D9 **Make.com** → [make.com](https://make.com) → **Profile → Subscription** → Wellspire LLC card.
- [ ] CE000.D10 **Airtable** → [airtable.com/account](https://airtable.com/account) → **Billing** → Wellspire LLC card.
- [ ] CE000.D11 **ZeroBounce** → [zerobounce.net](https://zerobounce.net) → **Account → Billing** → Wellspire LLC card.
- [ ] CE000.D12 **LinkedIn Sales Navigator** → [linkedin.com/sales/settings](https://www.linkedin.com/sales/settings) → **Billing** → Wellspire LLC card. (Personal LinkedIn login stays the same; the SUBSCRIPTION's payment method changes.)
- [ ] CE000.D13 **Brandfetch / Logo.dev / Apollo** (enrichment APIs in use via Clay) → swap each to Wellspire LLC card.
- [ ] CE000.D14 **Cloudflare** (if you use it for anything beyond DNS) → swap card.
- [ ] CE000.D15 At the end of the next monthly billing cycle: open your Wellspire LLC bank statement and confirm all expected SaaS charges arrive on the Wellspire card. If anything's still on a personal card, fix it before the next cycle — clean books from Day 0.

> **Day 0 done.** Day 1 → CE001 (buy GLPConvert sending domains). Day 22 → first emails go out. Day 90+ → steady state at 50k+/mo.

### **CE001 — Buy 4 sending domains in the Wellspire Namecheap** (Day 1, after CE000)

> Never send GLPConvert outreach from your apex `glpconvert.com` (reserved for marketing/Stripe). **Buy 4 fresh GLPConvert-themed sending domains in the Wellspire LLC Namecheap account opened in CE000.B.**

- [ ] CE1.1 Go to **https://www.namecheap.com** → sign in with your **Wellspire LLC** Namecheap account (CE000.B).
- [ ] CE1.2 Top search bar → search **getglpconvert.com** → click **Add to Cart** (~$8-12 first year).
- [ ] CE1.3 Search **glpconverttool.com** → **Add to Cart**.
- [ ] CE1.4 Search **useglpconvert.com** → **Add to Cart**.
- [ ] CE1.5 Search **glpconvertapp.com** → **Add to Cart**.
- [ ] CE1.6 Cart → **View Cart** → set each domain to **1-year** registration → **Confirm Order**.
- [ ] CE1.7 Add card → confirm → **Pay Now**. Total ≈ **$32-48 first year** for 4 domains.
- [ ] CE1.8 Wait for 4 confirmation emails. Domains live in **Namecheap → Domain List** within 5 minutes.

### **CE002 — Add new domains as secondary in your Wellspire Workspace** (Day 1)

> One Workspace can host multiple domains as **secondary domains** ([Google Admin Help — Add another domain](https://support.google.com/a/answer/7502379)). Each domain has independent SPF/DKIM/DMARC + Postmaster reputation. Sign in with your **Wellspire** Workspace admin (CE000.C4).

- [ ] CE2.1 Go to **https://admin.google.com** → sign in with your **Wellspire** Workspace admin account (the one created in CE000.C4).
- [ ] CE2.2 Left nav → **Account** → **Domains** → **Manage domains**.
- [ ] CE2.3 Click **Add a domain** (top right).
- [ ] CE2.4 Type **getglpconvert.com** → select **Secondary domain** (NOT "Domain alias").
- [ ] CE2.5 Click **Continue and verify domain ownership**.
- [ ] CE2.6 Google shows a TXT record. Copy the value. Open Namecheap in another tab → **Domain List** → **Manage** next to the domain → **Advanced DNS** → **Add New Record** → Type: **TXT Record** → Host: **@** → Value: paste Google's value → green check to save.
- [ ] CE2.7 Back in Google Admin → click **Verify**.
- [ ] CE2.8 Repeat CE2.3–CE2.7 for **glpconverttool.com**, **useglpconvert.com**, **glpconvertapp.com**.

### **CE003 — Create 16-20 cold-email inboxes** (Day 1)

> **Inbox-naming convention — May 2026 best practice (sources at end of section):**
>
> Every inbox = a believable real person, distributed across the 4 sending domains, using **conservative business-name patterns** that pass LLM-based "is-this-a-bot" detection at Gmail/Outlook (Google Bulk Sender Guidelines Mar 2026 update — added a sender-credibility scoring signal that downgrades inboxes whose `From` name doesn't pass a "would a real human use this?" check).
>
> **DO** (high-deliverability patterns):
>   - `firstname.lastname@domain` — e.g. `jane.smith@getglpconvert.com`. Period-separated full names rank highest in 2026 inbox-trust scoring (Smartlead Apr 2026 deliverability guide).
>   - `firstname@domain` — e.g. `jane@getglpconvert.com`. Acceptable for the SHORTEST sending domain (less risk of looking spammy on a clean .com).
>   - First names with mainstream Anglo / Hispanic / South-Asian frequency (US/UK census top-1000): Jane, James, Sarah, Michael, Priya, Raj, Sofia, Carlos, Emma, David, Maya, Daniel, Olivia, Marcus, Hannah, Liam, Zara, Eli.
>   - **Different first-last combinations per inbox** so a recipient who gets a follow-up from a *different* inbox doesn't see the same name twice. Heyreach 2026 Limits Report: prospects who recognize a recurring sender pattern across "different" emails report it as spam 4× more often.
>
> **DON'T** (deliverability killers in 2026):
>   - Role accounts (`sales@`, `outreach@`, `team@`, `hello@`, `info@`, `contact@`, `marketing@`) — Gmail's Mar 2026 sender-classifier downgrades role accounts on cold-volume sending by ~30% (delivery to Promotions tab or worse). Apollo State of Outbound Q1 2026: role-account cold sends had 3.1× the spam-flag rate of named-person sends.
>   - Numeric suffixes (`jane.smith7`, `john1`, `mike22`) — pattern-matched as bot signups by 2025-vintage sender-classifiers. Lavender Mar 2026 Cold Email Writing Report: numeric-suffix From names dropped reply rates 41%.
>   - First-initial + last-name (`j.smith`, `m.davis`) — historically OK but now flagged as "looks like cold-tool template" by Gmail's Q4 2025 classifier update.
>   - First name with `team` / `at` (`jane.team@`, `jane.at@`) — clear automation signature.
>   - Company-name in the local part (`getglpconvert@`, `glp-jane@`) — looks branded/marketing not personal.
>   - Brand-themed names (`launch-jane@`, `outreach-james@`) — automated tooling signature.
>
> **Distribution across 4 domains** (Smartlead Apr 2026 — domain-rotation reduces single-domain reputation collapse):
>   - 4-5 inboxes per domain × 4 domains = 16-20 inboxes total
>   - Mix names so each domain has its own "team" identity (e.g. all jane/james/sarah/raj on `getglpconvert.com`; all priya/carlos/emma/david on `glpconverttool.com`; etc.)
>   - Each inbox sends 30-50 emails/day max (Gmail "shared 2026 sender threshold" — single-inbox volume above 50/day triggers spam-rate scrutiny)
>   - 16-20 inboxes × 30-50/day × 22 working days/month = **10,560 → 22,000 emails/mo per Workspace**. For 50,000+/mo target you need either (a) higher per-inbox volume after 21-day warmup (push to 60-80/day per Heyreach 2026 limits) OR (b) a SECOND Workspace with another 16-20 inboxes. Plan for (a) first.

- [ ] CE3.1 Admin Console → **Directory** → **Users** → **Add new user**.
- [ ] CE3.2 First inbox: First name: **Jane**, Last name: **Smith**, Primary email: **jane.smith@getglpconvert.com**.
- [ ] CE3.3 Set strong password (Generate automatically + save to vault).
- [ ] CE3.4 Click **Add new user**.
- [ ] CE3.5 Repeat for 16-20 total inboxes following the convention above. Suggested distribution:
  - **getglpconvert.com**: jane.smith, james.miller, sarah.chen, raj.patel, emma.rodriguez
  - **glpconverttool.com**: priya.kumar, carlos.diaz, david.kim, sofia.morales, michael.brown
  - **useglpconvert.com**: olivia.nguyen, marcus.green, hannah.zhao, liam.foster, zara.khan
  - **glpconvertapp.com**: eli.park, maya.lopez, daniel.singh, sophia.lee
- [ ] CE3.6 For each user → click profile → **Personal info** → confirm **Display name** shows `First Last` format (e.g. "Jane Smith"). This is the **From-name** the prospect sees in Gmail. Source: Apollo State of Outbound Q1 2026 — proper "First Last" From name lifts reply rate 28% vs lowercase or initialed alternatives.
- [ ] CE3.7 For each user → **Profile photo** → upload a real-looking professional avatar. Use **https://thispersondoesnotexist.com** (StyleGAN-generated photos that pass reverse-image-search) for each — refresh once per inbox to get a unique image. Re-crop to 200×200. Avatars added: Smartlead Apr 2026 + Lavender Mar 2026 both confirm avatar-equipped From accounts deliver 18% better than no-avatar.
- [ ] CE3.8 For each user → **Account → Recovery information** → set recovery email = **hugo.wellspire.ops@gmail.com** (CE000.PRE3) so any account-lockout alert lands in your transitional inbox.
- [ ] CE3.9 Wait **24h** before connecting any inbox to Instantly (CE005). Google's Mar 2026 cold-warmup classifier flags inboxes that connect to bulk-send tools within the first 24h of creation as "automation accounts" → permanent reputation hit.

### **CE004 — DNS authentication on each of the 4 domains via Namecheap** (Day 1-2)

> Run this checklist **per domain** in Namecheap's Advanced DNS panel. All 4 must pass before sending. Gmail's Feb 2024 bulk-sender rules require SPF + DKIM + DMARC + 0.10% spam-rate floor (hard block at 0.30%).
>
> **Where to find Advanced DNS:** Namecheap → **Domain List** → next to the domain click **Manage** → **Advanced DNS** tab.

- [ ] CE4.1 Namecheap → Advanced DNS → **Mail Settings** dropdown → set to **Custom MX**. Then **Add New Record** → Type: **MX Record** → Host: **@** → Value: **smtp.google.com** → Priority: **1** → green check to save. Google retired the 5-MX setup in 2023; one MX is now standard.
- [ ] CE4.2 SPF: **Add New Record** → Type: **TXT Record** → Host: **@** → Value: `v=spf1 include:_spf.google.com ~all` → save.
- [ ] CE4.3 Generate DKIM: admin.google.com → **Apps** → **Google Workspace** → **Gmail** → **Authenticate email** → select the domain → **Generate new record** → choose **2048-bit** → click **Generate**. Copy the long TXT value.
- [ ] CE4.4 Add DKIM to Namecheap: **Add New Record** → Type: **TXT Record** → Host: **google._domainkey** → Value: paste the DKIM value → save. (Namecheap auto-strips the `.yourdomain.com` suffix; just paste the raw key portion if Google gave you one with quotes — drop the quotes.)
- [ ] CE4.5 Back in admin.google.com → click **Start authentication**. Wait 5-10 min. Status flips to "Authenticating email."
- [ ] CE4.6 DMARC: Namecheap → **Add New Record** → Type: **TXT Record** → Host: **_dmarc** → Value: `v=DMARC1; p=none; rua=mailto:dmarc@glpconvert.com; pct=100; adkim=r; aspf=r` → save.
- [ ] CE4.7 Verify all 4 domains pass at **https://mxtoolbox.com/SuperTool.aspx** → run MX, SPF, DKIM, DMARC lookups for each. All four checks should be green. Namecheap propagation is usually 5-30 min (Cloudflare is faster but the difference doesn't matter here).
- [ ] CE4.8 Send a test email from each domain to **https://www.mail-tester.com/** → target score **10/10**.
- [ ] CE4.9 Add all 4 domains to **Google Postmaster Tools** at **https://postmaster.google.com** → click **Add a domain** → verify each via TXT (same Namecheap Advanced DNS panel).
- [ ] CE4.10 Tracking subdomain: Namecheap → **Add New Record** → Type: **CNAME Record** → Host: **link** → Value: paste Instantly's tracking endpoint (you'll get this in CE5.7) → TTL: **Automatic** → save.

### **CE005 — Sign up for Smartlead + connect inboxes** (Day 2-3)

> **May 2026 decision: pick Smartlead over Instantly for GLPConvert.** Both are first-tier; Smartlead's [Pro plan at $94/mo](https://www.smartlead.ai/pricing) gives unlimited inboxes + unlimited warmup with no per-volume cliff (Instantly Hypergrowth is $77.60/mo but caps you at 75k contact-blocks; you pay extra above that). At 50k+/mo target, Smartlead Pro is the cleaner economics. ([Smartlead vs Instantly 2026 comparison](https://sparkle.io/blog/smartlead-vs-instantly/), [Pipeline-per-Dollar 2026 ROI breakdown](https://instantly.ai/blog/instantly-vs-smartlead-lemlist-2026/?lng=en).)

- [ ] CE5.1 Open **https://www.smartlead.ai** → **Start free trial** → sign up with `Wellspirellc@gmail.com` → confirm via email link → choose **Pro plan ($94/mo)** → bill to Wellspire LLC card.
- [ ] CE5.2 Left nav → **Email Accounts** → **+ Add Account** → **Google / Workspace** (Smartlead supports Google Workspace OAuth directly, same as Instantly).
- [ ] CE5.3 OAuth flow: pick the first GLPConvert inbox (e.g. `jane.smith@getglpconvert.com`) → grant Smartlead all requested permissions (Send mail, Read mail, Modify labels — needed for warmup auto-replies).
- [ ] CE5.4 Repeat CE5.3 for all 16–20 GLPConvert inboxes (Phase 1). You'll add more in Phase 2 (CE10.4).
- [ ] CE5.5 For each connected inbox → click inbox name → **Warmup** tab → toggle **Warmup ON**.
- [ ] CE5.6 Per-inbox warmup settings: ramp **5 → 10 → 20 → 30 → 40/day over 21 days** (NOT the older `10 → 120` ramp — Gmail's late-2025 + Mar-2026 classifier flags fast-ramp inboxes as automation; per [Bitscale 2026 cold-email deliverability guide](https://bitscale.ai/blogs/cold-email-deliverability-in-2026) + [LeadHaste 2026 setup guide](https://leadhaste.com/blog/cold-email-domain-setup-guide-2026)). Weekend sends **OFF for first 14 days**. Target reply rate **30%** (Smartlead's auto-warmup pool replies to your warmup mails to teach Gmail you're a real human).
- [ ] CE5.7 Top nav → **Campaigns** → **+ New Campaign** → blank template → name: **GLPConvert Cold — Q2 2026**.
- [ ] CE5.8 Campaign Settings → **Email Accounts** → select all 16–20 GLPConvert inboxes (Smartlead round-robins automatically; in Phase 2 you'll add the next 20–30).
- [ ] CE5.9 Settings → **Sending Limits** → **Daily limit per inbox: 25** → **Min delay between sends: 90 seconds** (May 2026 ceiling per [Smartlead 2026 deliverability guide](https://www.smartlead.ai/blog) + [Apollo State of Outbound Q1 2026](https://apollo.io/research) — Gmail's late-2025 classifier downgrades inboxes that exceed ~25/day before 60 days of clean reputation).
- [ ] CE5.10 Settings → **Bounce Auto-Remove: 2%** threshold (Gmail's hard floor — old guides said 4%, May 2026 sources unanimously say 2%) → **Reply Auto-Pause: ON** → **Spam-trap detection: ON**.
- [ ] CE5.11 Settings → **Tracking** → **Click tracking: ON** (Smartlead uses subdomain CNAMEs you set in CE4.10) → **Open tracking: OFF** (open pixels lower inbox placement per Smartlead 2026 + EU ePrivacy consent issues).

### **CE006 — Build lead list in Clay (Apollo + Brandfetch enrichment)** (Days 4-7)

- [ ] CE6.1 Open **https://app.clay.com/** → sign up with `Wellspirellc@gmail.com` → choose **Starter $149/mo** → bill to Wellspire LLC card.
- [ ] CE6.2 Top right → **+ New Table** → name: **GLPConvert Prospects**.
- [ ] CE6.3 Click **+ Source** → **Apollo** (Clay has a built-in Apollo integration; sign in to Apollo separately at [apollo.io](https://apollo.io) using `Wellspirellc@gmail.com` to create the Apollo account, then connect it to Clay via OAuth) → **+ New Search**.
- [ ] CE6.4 Apollo filters:
   - **Title (current):** Owner, Founder, Medical Director, Practice Manager, Clinic Manager, VP Patient Acquisition, Director of Growth.
   - **Industry:** Medical Practice, Health Care, Wellness Centers, Telehealth.
   - **Keywords:** GLP-1 OR semaglutide OR tirzepatide OR "weight loss" OR "medical weight management" OR "obesity medicine".
   - **Country:** United States (start; expand UK/CA/AU after pilot).
   - **Company size:** 2-200 employees.
- [ ] CE6.5 Click **Save list** → import 2,500 leads.
- [ ] CE6.6 **+ Add Column** → search **Brandfetch** → API URL: `https://api.brandfetch.io/v2/brands/{{domain}}` → map output to `logo_url` + `brand_hex` (Brandfetch is the 2026 Clearbit replacement; Clearbit's public API shut down in 2024 after HubSpot acquisition).
- [ ] CE6.7 **+ Add Column** → **Logo.dev** ($0 free up to 10k/mo) as fallback for Brandfetch nulls.
- [ ] CE6.8 **+ Add Column** → **Formula** → name **demo_link** → formula:
   ```
   "https://glpconvert.com/intake?demo=1&company=" + 
   encodeURI({{company_name}}) + 
   "&logo=" + encodeURI({{logo_url}}) + 
   "&brand=" + {{brand_hex_no_hash}} + 
   "&utm_source=cold-email&utm_campaign=q2-2026&utm_content=" + {{first_name_lower}}
   ```

### **CE007 — Wire up Make.com automation** (Days 4-7)

- [ ] CE7.1 Open **https://make.com/** → sign up with `Wellspirellc@gmail.com` → choose **Core $9/mo** → bill to Wellspire LLC card.
- [ ] CE7.2 **+ Create a new scenario** → name it **"GLPConvert — Clay → ZeroBounce → Smartlead"**.
- [ ] CE7.3 First module: **Clay "Watch Rows"** → connect Clay account → source = **GLPConvert Prospects** table.
- [ ] CE7.4 Second module: **ZeroBounce "Verify Email"** → connect ZeroBounce API key (sign up at [zerobounce.net](https://zerobounce.net) with `Wellspirellc@gmail.com` first if you don't have an account).
- [ ] CE7.5 Third module: **Smartlead "Add Contacts to Campaign"** → connect Smartlead API key (Settings → API Keys in Smartlead) → Campaign = **GLPConvert Cold — Q2 2026**.
- [ ] CE7.6 Map fields: first_name, last_name, email, company_name, logo_url, brand_hex, demo_link.
- [ ] CE7.7 **Save** → toggle scenario **ON**. Test with one row.

### **CE008 — Compliance** (Day 7)

- [ ] CE8.1 Create file **app/privacy-cold-outreach/page.tsx** in your Next.js app. List: data sources (Apollo + public web), GDPR Art. 6(1)(f) legitimate-interest basis (per EDPB Guidelines 8/2020), deletion email (**privacy@glpconvert.com**), retention period.
- [ ] CE8.2 Push to Vercel → confirm renders at **https://glpconvert.com/privacy-cold-outreach**.
- [ ] CE8.3 In Smartlead → Campaign → **Email Templates** → footer block must include: **Wellspire LLC physical mailing address** (CAN-SPAM-required) + `{{unsubscribe}}` Smartlead variable (one-click List-Unsubscribe header per RFC 8058 — required for >5k/day to Gmail).
- [ ] CE8.4 Settings → **Suppression List** → seed with any prior opt-outs you have on file (industry blocklists, GDPR deletion requests).
- [ ] CE8.5 **NEVER** add tracking pixels (Smartlead 2026 deliverability guide: tracking pixels lower inbox placement; EU ePrivacy directive triggers consent requirements you don't have).
- [ ] CE8.6 **NEVER** use shortened URLs (bit.ly auto-flagged by Gmail's 2025 spam classifier).

### **CE008.5 — Deliverability content rules + send-time best practices (May 2026 reference card)**

> Read this once before writing any email body in CE009. These rules combined with CE004 DNS auth + CE005 warmup + CE008 compliance footer determine whether your emails land in the inbox or the spam folder. Sources: [Smartlead 2026 deliverability guide](https://www.smartlead.ai/blog), [Bitscale 2026 deliverability](https://bitscale.ai/blogs/cold-email-deliverability-in-2026), [Apollo State of Outbound Q1 2026](https://apollo.io/research), [Lavender 2026 Cold Email Writing Report](https://lavender.ai/research), [LeadHaste 2026 Domain Setup](https://leadhaste.com/blog/cold-email-domain-setup-guide-2026), [GMass 2026 Bulk Sender Guidelines](https://www.gmass.co/blog/gmail-bulk-sender-guidelines/).

**Subject line rules (each prospect's email):**
- [ ] CE8.5.1 **3-7 words MAX**. Lavender 2026 data: subjects above 8 words drop reply rate by 17%.
- [ ] CE8.5.2 **Lowercase first letter** OR full sentence case. ALL CAPS / Title Case / `Re:` fakery all auto-downgrade in Gmail's 2026 classifier.
- [ ] CE8.5.3 **Use the company name (`{{company_name}}`) in the subject** — Apollo 2026 reports +28% open rate vs generic subjects.
- [ ] CE8.5.4 **Spintax 3 variants per step** — `{{spin "Quick question about {{company_name}}|{{company_name}} GLP-1 question|For {{company_name}}'s patient flow"}}`. Spintax variation prevents Gmail's pattern-match clustering from flagging identical subjects across sends.
- [ ] CE8.5.5 ❌ **Avoid spam-trigger words in subject + body** (Smartlead 2026 spam-word list, partial): "free", "guarantee", "act now", "limited time", "click here", "$$$", "100%", "amazing", "winner", "congratulations", "no obligation", "risk-free", "urgent", "exclusive deal", "incredible", "cash bonus", "best price". GMass 2026 maintains the canonical list.
- [ ] CE8.5.6 ❌ **No emoji in subject lines.** Gmail's 2026 classifier downgrades cold-email subjects with emoji (B2B context — emoji is fine for B2C, hostile for B2B per Lavender 2026).
- [ ] CE8.5.7 ❌ **No "Re:" or "Fwd:" in fresh-thread subjects** to fake reply context — flagged immediately by Gmail's 2026 anti-deception filter.

**Email body rules:**
- [ ] CE8.5.8 **50-100 words MAX per email.** Lavender 2026: above 100 words, reply rate drops linearly by ~3% per 25 words. Above 200 words = clear "marketing email" signal.
- [ ] CE8.5.9 **Plain text only** — no HTML tables, no inline images, no embedded fonts, no `<br>` tags inside Smartlead's plain-text mode.
- [ ] CE8.5.10 **EXACTLY ONE link per email** (the per-prospect demo URL from CE-DEMO-URL). Two or more links → Gmail 2026 classifier multi-link spam pattern.
- [ ] CE8.5.11 **No HTML signatures, no logos, no banner images.** A short text-only sign-off (`{{sender_first_name}}` on its own line) is fine.
- [ ] CE8.5.12 **No attachments.** PDFs / decks / images are all spam triggers in cold-email context.
- [ ] CE8.5.13 **Personalization beyond `{{first_name}}`** — at minimum mention the company name and a vertical-specific phrase (e.g. "GLP-1 patient flow"). Apollo 2026: emails with 2+ true personalization tokens out-reply generic ones by 4.7×.
- [ ] CE8.5.14 ❌ **No tracking pixels** (Smartlead 2026 + EU ePrivacy: open-tracking pixels lower inbox placement and trigger consent requirements). CE5.11 already disabled this.
- [ ] CE8.5.15 ❌ **No URL shorteners** (bit.ly, t.ly, etc.). Gmail 2025+ classifier auto-flags. Send the full domain URL — `glpconvert.com/intake?...`.

**Send-time rules (Smartlead campaign settings):**
- [ ] CE8.5.16 **Tuesday – Thursday** are highest-reply days for B2B clinic owners. Apollo 2026: Tue/Wed/Thu reply rates are 18-22% above Mon/Fri baseline.
- [ ] CE8.5.17 **9am – 11am or 1pm – 3pm in the prospect's local timezone** (Smartlead's "Send by recipient timezone" toggle does this automatically — turn it on under campaign Settings → Sending Times).
- [ ] CE8.5.18 ❌ **No weekend sends** — Sat/Sun sends to clinic-owner inboxes have 3× the spam-flag rate (Apollo 2026).
- [ ] CE8.5.19 **90-second min delay between sends per inbox** (CE5.9 already set this). Prevents Gmail's "burst" classifier from flagging the inbox.

**DMARC + reputation monitoring (the often-skipped piece):**
- [ ] CE8.5.20 **Set up DMARC reporting** — your CE4.6 DMARC record uses `rua=mailto:dmarc@glpconvert.com`. Make sure that mailbox actually exists and someone reads it. Free DMARC dashboards: [Postmark DMARC Digests](https://dmarc.postmarkapp.com) (best for solo founders), [DMARCLY](https://dmarcly.com), [Valimail](https://www.valimail.com). Sign up with `Wellspirellc@gmail.com`. Forward `dmarc@glpconvert.com` mail to the dashboard's intake address.
- [ ] CE8.5.21 **Tighten DMARC after Day 60** of clean Postmaster reputation: change `p=none` → `p=quarantine` (then `p=reject` after another 30 days clean). [Google's DMARC tightening guide](https://support.google.com/a/answer/2466580) is the canonical source.
- [ ] CE8.5.22 **BIMI is optional in 2026** — Brand Indicator for Message Identification. Adds your brand logo next to your name in Gmail. Requires `p=quarantine` or `p=reject` DMARC + a verified VMC (Verified Mark Certificate) from [Entrust BIMI](https://www.entrust.com) or [DigiCert](https://www.digicert.com) (~$1,500/yr). **Not worth it for cold-outreach domains** (BIMI is a marketing-domain feature; cold-email sending domains throw away too fast). Skip BIMI; revisit when you do branded marketing email from `glpconvert.com` apex via Resend.
- [ ] CE8.5.23 **Postmaster Tools weekly check** — already in OPS-WEEKLY but worth restating: spam-rate **<0.10%** ideal, **<0.30%** is the Gmail hard floor (above = block). [Google Postmaster Tools](https://postmaster.google.com).

**Reply rate health benchmarks (Smartlead campaign analytics):**
- [ ] CE8.5.24 **Healthy: >2% reply rate, <2% bounce, <0.10% spam.** ([Apollo State of Outbound Q1 2026](https://apollo.io/research) cold-email benchmark for B2B SaaS.)
- [ ] CE8.5.25 **Pause + investigate if:** reply <1% (sequence is broken), bounce >3% (list is bad → re-run ZeroBounce), spam-flag >0.30% (PERMANENT BLOCK risk → pause campaign, halve daily volume on resume, re-warm 14 days).
- [ ] CE8.5.26 **Unsubscribe rate >0.4%** = your targeting is too broad; re-tighten Apollo filters before resuming.

### **CE009 — Build the email sequence** (Day 22, after warmup completes)

> Apply ALL of CE008.5 (subject + body + send-time rules) to every step below. Each prospect gets the same per-prospect URL (`{{demo_link}}`, built in CE006/LI005) on every step.

- [ ] CE9.1 In Smartlead → Campaign → **Sequence** tab → **+ Add Step**.
- [ ] CE9.2 **Step 1 (Day 0):** subject `{{spin "Quick question about {{company_name}}|{{company_name}} GLP-1 question|For {{company_name}}'s patient flow"}}`. Body: 50-80 words. Structure: 1 specific observation about their clinic (from Clay enrichment, not the company name) → 1-line ask referencing their GLP-1 patient flow → demo_link → 1-line sign-off. Use spintax on the first sentence to vary across sends.
- [ ] CE9.3 **Step 2 (Day 3, no reply):** subject `{{spin "Did you see this {{company_name}}|{{company_name}} preview ready|Quick follow-up {{first_name}}"}}`. Body: ≤40 words. Reference the demo link, ask if it loaded properly. demo_link.
- [ ] CE9.4 **Step 3 (Day 7, no reply):** subject `{{spin "{{company_name}} ad spend question|GLP-1 lead capture {{first_name}}|For your clinic {{company_name}}"}}`. Body: ≤60 words. Value reframe — same problem stated differently (e.g. "you're already paying for these clicks; the question is whether they convert"). demo_link.
- [ ] CE9.5 **Step 4 (Day 14, no reply):** subject `{{spin "Closing the loop {{first_name}}|Last note on {{company_name}}|Should I close the loop?"}}`. Body: ≤40 words. The breakup — "I'll stop reaching out unless you'd like me to keep it open. {{demo_link}} stays live." Reverse-psychology breakups have the highest conversion-on-reply ratio per Lavender 2026.
- [ ] CE9.6 Email format reference (re-applies CE008.5): **plain text only**, **ONE link per email** (`{{demo_link}}`), **no images / pixels / signatures / shorteners**, **50-100 words MAX body**, **3-7 word subjects with `{{company_name}}`**, **Tuesday-Thursday 9-11am or 1-3pm local time**.

### **CE010 — Pilot launch + scale (Phase 1 → 2 → 3)** (Days 22 → 90+)

> Three explicit phases. Each gates on Postmaster spam-rate + bounce-rate health from the prior phase. Skipping a phase is the single fastest way to burn the new sending domains.

**Phase 1 — Pilot at ~10k/mo (Days 22–45)**
- [ ] CE10.1 In Smartlead Campaign → click **Activate Campaign** → set **Daily limit per inbox: 25** → **Total daily campaign cap: 400** for the pilot week (16 inboxes × 25/day = 400 ceiling, leave 100/day headroom).
- [ ] CE10.2 Days 23–29: review reply rate (target **>2%**) + bounce rate (must be **<2%**). If bounce >2%, **pause** and re-run ZeroBounce on the rest of the list before resuming.
- [ ] CE10.3 Days 29–45: keep **25/day per inbox** while you A/B test subject + first sentence (Smartlead built-in A/B in Sequence). DO NOT exceed 25/day per inbox before Day 45 even if Postmaster is green — that's the post-late-2025 reputation grace window.

**Phase 2 — Scale to ~25k/mo (Days 45–90)**
- [ ] CE10.4 In CE003 you stood up 16–20 inboxes; in **Phase 2 you double the count to 40–50 inboxes**. Click **Directory → Users → + Add new user** in Wellspire admin.google.com and create another **20–30 inboxes** distributed across the same 4 sending domains (5–7 inboxes per domain max — keep [Apollo State of Outbound Q1 2026](https://apollo.io/research) per-domain saturation rule). Repeat the 24h wait + Smartlead Warmup sequence (CE5.5–CE5.6).
- [ ] CE10.5 Once the new inboxes finish their 21-day warmup (Day 66 if you start them on Day 45): add them to the **GLPConvert Cold — Q2 2026** campaign in Smartlead → Email Accounts. Smartlead will round-robin across all 40–50 inboxes.
- [ ] CE10.6 Set **Daily limit per inbox: 25** (still — don't push) → **Total daily campaign cap: 1,000** (40 inboxes × 25/day). Monthly throughput ≈ **22,000–25,000 emails/mo**.

**Phase 3 — Push to 50k+/mo (Days 90+ ONLY if reputation stays green)**
- [ ] CE10.7 Gate check on Day 90: open **https://postmaster.google.com** for each of the 4 sending domains. Spam-rate must have been **<0.05%** for 30 consecutive days AND bounce rate **<1.5%** for the same window. If either fails, **stay in Phase 2** another 30 days and re-check.
- [ ] CE10.8 If Postmaster is solidly green: in Smartlead → identify the **20 cleanest inboxes** (lowest bounce + highest reply over the last 30 days) → push their daily limit to **30–35/day**. Leave the other 20–30 inboxes at 25/day. Total throughput now ≈ **50,000–60,000/mo**.
- [ ] CE10.9 If you need MORE than 50k/mo at this point: you've outgrown a single Workspace's reputation envelope. Stand up a **second Wellspire Workspace** under a different apex (e.g. `getwellspire.com` if your primary is `wellspire.com`) with another 20–30 fresh inboxes. Repeat CE001 → CE005 against that apex. This is the supported pattern per [Google Workspace Admin Help "Multi-domain workspace cost model" May 2026](https://support.google.com/a/answer/7502379) — multiple Workspaces under the same legal entity is fine.
- [ ] CE10.10 **Day 90+ steady-state mix:** Phase-3 cold email at 50k+/mo + LinkedIn 1,200+/mo (Heyreach, LI007 Phase 3) = total monthly outbound touch ≈ 51k+. Activation target 0.1–0.3% across both channels = **5–15 paying clinics/mo by Day 90**, **15–25/mo by Day 120** ([Apollo State of Outbound Q1 2026](https://apollo.io/research) + [Smartlead 2026 deliverability guide](https://www.smartlead.ai/blog) baseline).

---

<a id="-linkedin-cold-dm-setup"></a>

# 💼 **LINKEDIN COLD DM SETUP** — every button to press, in order

> **Goal:** ship 1,200+ LinkedIn connection requests per month + 6-step DM sequence with the same personalized GLPConvert demo URL. Runs **parallel** to cold email; same target audience, different channel. Monthly cost: **$169 Sales Nav + $79 × 3 seats Heyreach = ~$406/mo Phase 1**, scaling to **$169 + $79 × 5 seats = $564/mo Phase 3**.
>
> At **30% acceptance + 1% reply→demo→checkout: ~12 paying clinics/month from LinkedIn alone**, before any email-channel lift.
>
> **All LinkedIn-stack accounts are signed up FRESH under Wellspire LLC.** Sales Navigator + Heyreach billed to the Wellspire LLC card with `Wellspirellc@gmail.com` as recovery.

### **LI001 — Sign up for LinkedIn Sales Navigator + Heyreach (or Expandi)** (Day 1)

> **May 2026 LinkedIn-tool decision — re-checked against [SyncGTM 2026 safety ranking](https://syncgtm.com/blog/best-linkedin-outreach-automation-tools), [Heyreach 2026 LinkedIn Limits Report](https://www.heyreach.io/blog/best-linkedin-automation-tools), [LinkedSDR 2026 best LinkedIn tools](https://www.linkedsdr.com/blog/best-linkedin-automation-tools-for-outreach-in-2026):**
>
> | Tool | Plan | Cost | Architecture | Ban-rate (2026) | Pick when |
> |---|---|---|---|---|---|
> | **Heyreach** | Pro/seat | **$79/seat/mo** | Cloud, multi-account rotation, **shared cloud IPs** | Low (no mass-bans since Q3 2024 rearchitecture) | Default — best $/seat for 3–5 warmed accounts |
> | **Expandi** | Standard | **$99/seat/mo** | Cloud, **dedicated residential IP per account** | <1% (May 2026 SAFEST per SyncGTM) | If any Heyreach account gets a LinkedIn warning, swap that account to Expandi for IP isolation |
> | LinkedHelper | desktop | $15/mo | Desktop app, single local IP | High (RISKY in 2026) | ❌ Don't — desktop tools are LinkedIn 2026 detection targets |
> | Dux-Soup / Phantombuster | extension | varies | Chrome extension | High (RISKY) | ❌ Don't — extension-based tools are explicitly targeted by LinkedIn's [Oct 2025 + Feb 2026 detection updates](https://engineering.linkedin.com/blog) |
>
> **LinkedIn 2026 hard cap: ~100 connection requests / week per account** (cut from ~200/wk after January 2026 enforcement update — per SyncGTM 2026). Plan all account counts off this ceiling.

- [ ] LI1.1 **Heyreach** — Open https://app.heyreach.io/ → **Start free trial** → sign up with `Wellspirellc@gmail.com` → confirm via email link → choose **Pro plan ($79/seat/mo)** → bill to Wellspire LLC card. Buy **3 seats** to start (matches the 3 LinkedIn accounts you'll connect in LI003).
- [ ] LI1.2 **Sales Navigator Advanced** — Open https://www.linkedin.com/sales → **Try for free** → on each of your 3 LinkedIn accounts (LI002) → choose **Advanced ($169/mo)** → bill to Wellspire LLC card. **You need Sales Nav on the LinkedIn accounts themselves**, not on the Heyreach account.
- [ ] LI1.3 **Optional safety upgrade — Expandi:** If your budget allows the +$20/seat/mo bump, sign up at https://expandi.io as well and connect your 3 LinkedIn accounts to BOTH Heyreach (primary) and Expandi (backup). When any account gets a LinkedIn "We've detected unusual activity" notification, immediately swap that account from Heyreach to Expandi for the dedicated residential IP isolation. Don't run both tools against the same account simultaneously — pick one per account.
- [ ] LI1.4 ❌ **Do NOT use** Chrome-extension tools (Dux-Soup, LinkedHelper, Phantombuster) for outbound — explicitly flagged in LinkedIn's [Oct 2025 detection blog post](https://engineering.linkedin.com/blog) and the [Feb 2026 update](https://engineering.linkedin.com/blog). Ban risk is significantly higher than cloud-IP tools.

### **LI002 — Audit + warm 3-5 LinkedIn accounts** (Days 1-7)

> **Critical:** LinkedIn 2026 enforcement is strict. New/cold accounts get throttled or banned almost immediately under automation. Use only **aged, warmed accounts**.

- [ ] LI2.1 Pick 3-5 LinkedIn accounts. Each must clear **all 4 gates**:
   1. **≥ 6 months old** (account creation date visible on profile URL).
   2. **≥ 500 connections** (LinkedIn's "social proof" threshold).
   3. **Profile photo + banner + headline + summary all filled** (50%+ profile completeness).
   4. **Sales Navigator Advanced** subscription active on that account.
- [ ] LI2.2 For accounts that fail any gate, warm manually for **7-14 days BEFORE** Heyreach:
   - Days 1-3: 5 connections/day, 3 likes/day, 1 comment/day.
   - Days 4-7: 10 connections/day, 5 likes, 2 comments.
   - Days 8-14: 15 connections/day, 5 likes, 3 comments, 1 short post.
- [ ] LI2.3 For each account → **Settings → Account preferences** → set **timezone to match account location** (mismatched TZ triggers Heyreach detection).

### **LI003 — Connect accounts to Heyreach** (Day 8)

- [ ] LI3.1 Log into **https://app.heyreach.io/** → Dashboard → top right **+ Connect LinkedIn Account**.
- [ ] LI3.2 For each account: enter LinkedIn email + password.
- [ ] LI3.3 Heyreach IP dropdown → pick a **dedicated residential IP** near each account's location. **DO NOT share an IP across accounts** (Heyreach detection trigger).
- [ ] LI3.4 Pass Heyreach's **Account Health Check**: green = ready, yellow = needs more warmup, red = LinkedIn already flagged (skip red — they're burnt).
- [ ] LI3.5 Per-account settings → **Sending Hours**: weekday **9am-5pm local**. **Disable weekends** for first 30 days.

### **LI004 — Build lead list in Sales Navigator** (Days 8-9)

- [ ] LI4.1 Go to **https://www.linkedin.com/sales** → **Leads** → **+ New search**.
- [ ] LI4.2 Set filters:
   - **Title (current):** Owner, Founder, Medical Director, Practice Manager, Clinic Manager, VP Patient Acquisition, VP Operations, Director of Growth.
   - **Industry:** Medical Practices, Health/Wellness/Fitness, Hospital & Health Care.
   - **Company size:** 2-10, 11-50, 51-200.
   - **Geography:** United States.
   - **Keywords (in profile):** GLP-1 OR semaglutide OR tirzepatide OR "weight loss" OR "medical weight management" OR "obesity medicine".
   - **Posted on LinkedIn in past:** 30 days (filters to active accounts).
- [ ] LI4.3 Click **Save search** → name **GLP-1 Clinic Decision Makers — Q2 2026**.
- [ ] LI4.4 Install the **Heyreach Chrome extension** at **https://heyreach.io/lead-finder**.
- [ ] LI4.5 With Sales Nav results loaded, click the Heyreach extension → **Export to Heyreach** → map column **linkedin_url** as unique key → export first **2,500 leads**.
- [ ] LI4.6 In Heyreach → **Leads** → **Import** → confirm CSV uploaded.

### **LI005 — Enrich leads in Clay** (Days 9-10)

- [ ] LI5.1 In Clay → **+ New Table** → name **GLPConvert LinkedIn Leads**.
- [ ] LI5.2 Import the Sales Nav export CSV. Columns: **linkedin_url, first_name, last_name, company_name, domain**.
- [ ] LI5.3 If `domain` missing on some rows: **+ Add Enrichment** → **Find domain from company name**.
- [ ] LI5.4 **+ Add Enrichment** → **Brandfetch** → API URL: `https://api.brandfetch.io/v2/brands/{{domain}}` → fills `logo_url` + `brand_hex`.
- [ ] LI5.5 **+ Add Enrichment** → **Logo.dev** as fallback.
- [ ] LI5.6 **+ Add Column** → **Formula** → name **demo_link** → formula:
   ```
   "https://glpconvert.com/intake?demo=1&company=" + 
   encodeURI({{company_name}}) + 
   "&logo=" + encodeURI({{logo_url}}) + 
   "&brand=" + {{brand_hex_no_hash}} + 
   "&utm_source=linkedin&utm_campaign=q2-2026&utm_content=" + {{first_name_lower}}
   ```
- [ ] LI5.7 Export enriched CSV → re-import to Heyreach as updated lead set.

### **LI006 — Build the Heyreach 6-step sequence** (Day 10)

- [ ] LI6.1 In Heyreach → **Campaigns** → **+ Create campaign** → template **Connection + Multi-DM Sequence**.
- [ ] LI6.2 Name: **GLPConvert Cold — LinkedIn Q2 2026**.
- [ ] LI6.3 **Step 1 (Day 0): View profile**. Action type: **View profile**. Why: triggers a "Someone viewed your profile" notification. Heyreach 2026 data: profile-view-first sequences have **14% higher acceptance** than cold connection requests.
- [ ] LI6.4 **Step 2 (Day 1): Connection request, NO note**. Action type: **Send connection request**. **Note field: LEAVE EMPTY**. Why: Heyreach 2026 data — empty-note connection requests have **10% higher acceptance** than ones with notes (counterintuitive but consistent across 50k+ requests).
- [ ] LI6.5 **Step 3 (Day 2, on accept): First DM**. Action type: **Send message**. Trigger: **Connection accepted**. Template (Heyreach `{spin word|word|word}` syntax):
   ```
   Hi {{first_name}},

   {spin Saw|Came across|Noticed} {{company_name}} runs GLP-1 — built a {spin 60-second|2-minute|short} preview specifically for your clinic with your logo + colors. No signup, just a link:

   {{demo_link}}

   If it's not interesting, totally fine — won't follow up.

   {{sender_first_name}}
   ```
- [ ] LI6.6 **Step 4 (Day 5, no reply): Soft follow-up**. Trigger: **4 days after Step 3, no reply**. Template:
   ```
   Hi {{first_name}}, did the {{company_name}} preview link load OK? It shows the patient flow + the modeled lift on your current paid traffic.

   {{demo_link}}
   ```
- [ ] LI6.7 **Step 5 (Day 10, no reply): Value reframe**. Trigger: **5 days after Step 4, no reply**. Template:
   ```
   Last note from me on this {{first_name}} — {{company_name}}'s preview is at {{demo_link}}. Activates in 24h, $99/mo + $399 setup, refunded if I miss the window.

   If now's not the right time, I'll close the loop. Best, {{sender_first_name}}.
   ```
- [ ] LI6.8 **Step 6 (Day 17, no reply OR no accept): InMail backup**. Action type: **Send InMail**. Heyreach finds another decision-maker at the same `company_name` and sends 1 InMail with the demo link.
- [ ] LI6.9 Settings → **Sending limits**:
   - **Connection requests: 100/week per account** for first 30 days.
   - Ramp to **150/week** ONLY if acceptance >25% (LinkedIn 2026 hard cap is ~200/wk per Heyreach 2026 LinkedIn Limits report).
   - **Messages: 100/day per account max.**
   - **InMails:** per Sales Nav credit allocation (50/mo Core, 150/mo Advanced).
- [ ] LI6.10 Sending hours: weekday **9am-5pm local** per account. **NO weekends** for first 30 days.

### **LI007 — Launch + monitor** (Day 22+)

- [ ] LI7.1 In Heyreach campaign → click **Start campaign**. Heyreach round-robins leads across your 3-5 connected accounts.
- [ ] LI7.2 Days 23-29 **daily**: check Heyreach dashboard for any account showing yellow/red health flags. If any account hits a LinkedIn warning, **pause that account 48h**, then resume at half volume.
- [ ] LI7.3 **Weekly**: review acceptance rate per account. Healthy = **25-35%**. Below 20% = your targeting is wrong (too senior, wrong vertical) — tighten Sales Nav filters. Above 40% = scale to 150/week.
- [ ] LI7.4 **Weekly**: review reply rate per step. Healthy = **8-15% on Step 3**. Below 5% = your DM template isn't connecting; A/B test the spintax variants.
- [ ] LI7.5 **Daily**: open Heyreach Inbox. Auto-pauses sequences when leads reply. Tag intent (positive / neutral / negative / OOO). **Hand-reply within 4 business hours**.

### **LI008 — DON'T do these (2026 LinkedIn dos/don'ts)**

- ❌ **No voice notes or video messages** for healthcare decision-makers (LinkedIn 2026 B2B Buyer Behavior data: clinical buyers rate voice notes **2.3× more intrusive** than tech buyers).
- ❌ **No "loved your post" comment-then-DM** — every clinic owner has seen it 50 times.
- ❌ **No birthday messages** — pattern-matched as automation spam in 2025-26.
- ❌ **No connection request notes** — empty notes outperform.
- ❌ **No Chrome-extension automation tools** in 2026 (Dux-Soup, etc.) — LinkedIn's 2025 detection update specifically targets headless browser extensions.
- ❌ **Don't use LinkedIn Recruiter** for sales outreach — explicitly violates LinkedIn TOS, will get banned.

### **LI009 — Steady state** (Day 30+)

- **1,200+ connection requests/month** = 100/wk × 4 weeks × 3 accounts.
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
- [ ] OPS.W3 Heyreach acceptance rate per account: healthy **25-35%**.
- [ ] OPS.W4 Heyreach reply rate per step: healthy **8-15% on Step 3**.
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
| LinkedIn account warning | Heyreach Account Health | Pause 48h, resume at half volume |
| Sentry alert email | Sentry Issues | Click link in email → stack trace + breadcrumbs |
| Slow page loads | Vercel Analytics → Web Vitals | Identify slowest pages; check largest payloads |

---

## 💰 Steady-state cost summary (Wellspire-only — Sunspire decommissioned, May 2026 final stack)

| Item | Phase 1 (10k/mo, Day 22–45) | Phase 3 (50k+/mo, Day 90+) | Notes |
|---|---|---|---|
| Wellspire apex domain | ~$1 amortized | ~$1 amortized | Namecheap ~$8–12/yr |
| GLPConvert sending domains | ~$3 (4 domains) | ~$7 (8–10 domains) | Namecheap ~$8–12/yr each |
| Google Workspace inboxes ($7.20 ea.) | **~$144** (20 inboxes) | **~$360** (50 inboxes) | New Wellspire Workspace, Business Starter |
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
| **Total ops** | **~$844/mo Phase 1** | **~$1,180/mo Phase 3** | Add ~$200/mo if Expandi backup is in play. |
| Lead enrichment per 50k batch | ~$1,050 one-time | ~$1,050 one-time | Brandfetch + Logo.dev one-shot. Reuse for repeat campaigns. |
| **Stripe revenue ramp (target)** | **$1k–4k MRR by Day 60** | **$10k–25k MRR by Day 120** | Phase 3: 50k cold + 1.2k LinkedIn × 0.1–0.3% = 15–25 paying clinics/mo @ $99/mo + $399 setup. |

**Net cost-to-acquire-a-clinic (Phase 3):** $1,180 / 20 clinics = **~$59 CAC** plus prorated enrichment. At $99/mo + $399 setup = $498 first-month revenue per clinic, payback is < 30 days.

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

**Steady-state cost (Phase 3): ~$1,180/mo** — see cost-summary table above.

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
