# GLPConvert — cold email & individualized demo playbook (2026)

Operational guide to replicate the **demo-first outbound** motion (adapted from the prior solar white-label codebase patterns, scoped to **GLPConvert**). Pair with **`GLPCONVERT_COLD_EMAIL_POSITIONING.md`**, **`docs/COLD-EMAIL-BRANDING-GUIDE.md`**, and **`MASTER_TODO_GLPCONVERT.md`** (section **CE-2026**).

## What you are selling in one link

Each prospect gets a **live, branded instance**: their name, **accent color** (URL or known-name map in `lib/brandTheme.ts`), and **logo** (explicit `logo=` HTTPS URL, or **Clearbit** via `domain=clinic.com` or `company=clinic.com` when the value is a bare domain).

**Buyer landing (activation):**  
`https://glp-convert.vercel.app/?demo=1&company=Acme%20Med%20Spa&domain=acmemedspa.com&firstName=Jordan`

**Patient-style demo (full intake + owner panels):**  
`https://glp-convert.vercel.app/intake?demo=1&handle=glpconvert&company=Acme%20Med%20Spa&domain=acmemedspa.com&booking=https%3A%2F%2Fexample.com%2Fbook`

Optional: `brand=0B3D91` (hex), `brand2=` secondary, `logo=https%3A%2F%2F…` when Clearbit fails.

## Individualized demo checklist (per lead)

1. **Company display name** in `company=` (as you want it to read in the UI).  
2. **Domain** in `domain=` for logo auto-fill (Clearbit → `logo.clearbit.com`, allowlisted + proxied).  
3. **Color** — omit to use `getBrandTheme(company)` for known tokens; else set `brand=` / `primary=`.  
4. **Rep personalization** — `firstName=`, `role=` if you add copy that reads them (URL params already stored in brand state).  
5. **UTM** — `utm_source=email&utm_campaign=…` for attribution (persisted in intake).  
6. **QA** — open link in incognito, confirm logo loads, primary CTA visible, intake completes, checkout mock/live works.

## Cold email sequence (suggested skeleton)

| Step | Channel | Goal |
|------|---------|------|
| 1 | Email | Pattern interrupt + one line of relevance (city, ad channel, or “I built your intake already”). Single CTA → demo link. |
| 2 | Email + bump | Screenshot or 10s Loom of *their* header + first step of intake — “This is live with your name; tap to finish the path.” |
| 3 | LinkedIn DM | Short parallel message; same link with `utm_medium=linkedin`. |
| 4 | Breakup | “Closing the loop — should I delete the preview?” |

**Copy constraints:** educational positioning only; no outcome guarantees; no “you qualify” language (see **`COMPLIANCE_NOTES_GLPCONVERT.md`**).

## Scale to hundreds of customers (ops)

1. **List building** — ICP: GLP-1 clinics, med spas, telehealth weight programs; enrich with domain (Apollo, Clay, or VA).  
2. **Link builder** — spreadsheet formula or script: encode `company`, `domain`, `firstName`, UTM.  
3. **Inbox + deliverability** — dedicated domain(s), SPF/DKIM/DMARC, warm-up (Instantly, Smartlead, etc.); **product** mail remains **`RESEND`** + verified domain (**`M000`** in master todo).  
4. **CRM** — tag `demo_sent`, `demo_clicked`, `checkout_started`, `won`; webhook from Stripe + internal events.  
5. **Daily metrics** — sends, replies, clicks, demo completes, checkouts, activated tenants.  
6. **Legal** — counsel on cold email in your jurisdictions; unsubscribe where required.

## Human blockers (do not skip)

- **U024** — final legal copy on disclaimers and HIPAA/BAA claims.  
- **Stripe live** + **M000 Resend** before high-volume money path.  
- **W001+** entity/banking before scaling spend.

## References (design / GTM discipline)

- **White-label SaaS:** neutral product canvas + tenant theme via CSS variables (see **`docs/GLPCONVERT_WHITE_LABEL_SAAS_SOURCES.md`**).  
- **CRO / trust:** reduce cognitive load, single primary CTA, progressive disclosure (NN/g, Baymard, CXL — summarized in **`docs/GLPCONVERT_OUTREACH_UX_SOURCES_MAR2026.md`**).
