# DEMO_STRATEGY_GLPCONVERT.md

How personalized demos support cold email, LinkedIn DMs, and no-meeting activation.

## Purpose

The demo is the **primary sales engine** for **cold email** and **LinkedIn DMs**: individualized, branded, interactive, and **~95% identical** to what patients see in production. It must feel like **the clinic’s own front-end**, already installed—not a separate slide deck or fake shell. **Success = one of the CTAs → Stripe checkout → self-serve activation** (optional “talk to us” escape hatch).

## URL parameters (baseline)

| Param | Purpose |
|--------|---------|
| `company` | Display name on chrome + slugified fallback for tenant API, e.g. `company=Brightline%20Medical` |
| `handle` | **Optional.** Real Supabase tenant slug when `company` is a display name only, e.g. `handle=glpconvert` — fixes config fetch for cold-email pretty names. |
| `demo=1` or `preview=1` | Enables **owner-demo** panels: preview banner, revenue-leak illustration, before/after, ROI copy, “Activate for {{clinic}}” CTA |
| `utm_*` | Standard UTM; merged with `sessionStorage` for persistence across steps |
| `demo_traffic` | Optional integer for illustrative monthly sessions in leak math (defaults in code) |
| `logo` | **HTTPS** URL to clinic logo image (`encodeURIComponent`). Shown on results trust header + top of flow when set. |
| `brand` or `primary` | Primary hex without or with `#`, e.g. `brand=0B3D91` or `brand=%230B3D91` — primary buttons + demo banner accent. |
| `brand2` | Optional second hex — accent borders (e.g. demo banner border). |
| `booking` / `book` / `booking_url` | **HTTPS** scheduling URL (Calendly, etc.) — overrides tenant config for that session. |
| `transition_ms` | Optional delay (600–30000) on the “Building your plan…” step — default ~1400ms; use higher values for screenshots or Playwright visual capture. |
| *(tenant DB)* | `tenants.crm_keys` JSON: `booking_url`, optional **`intake_monthly_low`**, **`intake_monthly_high`**, **`intake_consult_fee_note`**, **`intake_payment_note`**, **`intake_brand_name`**, **`intake_brand_color_secondary`** — merged in funnel when query params do not override. |

**Example (cold email / LinkedIn demo link):**  
`/intake?demo=1&handle=YOURTENANTSLUG&company=Acme%20Med%20Spa&demo_traffic=600&logo=https%3A%2F%2Fexample.com%2Flogo.png&brand=7C3AED&booking=https%3A%2F%2Fcalendly.com%2Facme%2Fconsult`

**Example branded URLs (replace host + assets):**

- `https://glp-convert.vercel.app/intake?demo=1&handle=glpconvert&company=Sunspire%20Weight%20Clinic&brand=059669&brand2=064e3b&logo=https%3A%2F%2Fexample.com%2Fsunspire-logo.png`
- `https://glp-convert.vercel.app/intake?demo=1&handle=demo-apex&company=Apex%20MedSpa&brand=4F46E5&demo_traffic=800`
- Production patient: `https://glp-convert.vercel.app/intake?company=glpconvert` (booking + branding from tenant row when configured)

### Local copy-paste URLs (`npm run dev` → `http://localhost:3000`)

- **Branded demo (patient path + owner panels):**  
  `http://localhost:3000/intake?demo=1&company=Acme%20Med%20Spa&demo_traffic=500&logo=https%3A%2F%2Flogo.clearbit.com%2Fstripe.com&brand=6366F1&brand2=0f172a&booking=https%3A%2F%2Fexample.com%2Fschedule`
- **Branded buyer entry (home → Launch / pricing):**  
  `http://localhost:3000/?company=Acme%20Med%20Spa&demo=1&logo=https%3A%2F%2Flogo.clearbit.com%2Fstripe.com&brand=6366F1`
- **Paid-style patient intake (no `demo` — use real tenant handle when DB is wired):**  
  `http://localhost:3000/intake?company=glpconvert`  
  (Optional branding until tenant row drives it: `&logo=…&brand=…`.)

Production tenants: same query params work for **personalized demos**; store **logo**, **colors**, and **`crm_keys.booking_url`** on the tenant row so `/intake?company=handle` resolves booking without query hacks.

## Buyer reaction we optimize for

- “This is a better version of the front end of my business.”  
- “This could make my current ads and site traffic more valuable.”  
- “This looks like it’s already mine.”  

## Demo-specific UI (allowed)

- Top banner: **Preview for {{ClinicName}}**  
- Lost-revenue / leak **illustration** (conservative labeling)  
- Before vs after funnel **contrast**  
- Short **ROI / impact** panel  
- CTA: **Activate this for {{ClinicName}}** → `/contact`, mailto, or sales calendar (configure per go-to-market)

## What demo must not do

- Change the patient flow structure vs production  
- Add clinical claims or eligibility language  
- Feel like a different product than paid  

## Handoff to paid

After `done` on infra (`MASTER_TODO_GLPCONVERT.md` U036–U038), production URLs use the **same funnel** with `demo` off; tenant branding from config replaces query-param hacks where implemented (see U017–U020). **Patient-facing goal:** more qualified consults and smoother path to program enrollment—not a replacement for the provider’s clinical workflow.
