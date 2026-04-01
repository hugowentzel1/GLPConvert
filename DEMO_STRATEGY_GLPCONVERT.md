# DEMO_STRATEGY_GLPCONVERT.md

How personalized demos support cold email, LinkedIn DMs, and no-meeting activation.

## Purpose

The demo is the **primary sales engine**. It must feel like **the clinic’s own front-end**, already installed—not a separate slide deck or fake shell.

## URL parameters (baseline)

| Param | Purpose |
|--------|---------|
| `company` | Display name, e.g. `company=Brightline%20Medical` |
| `demo=1` or `preview=1` | Enables **owner-demo** panels: preview banner, revenue-leak illustration, before/after, ROI copy, “Activate for {{clinic}}” CTA |
| `utm_*` | Standard UTM; merged with `sessionStorage` for persistence across steps |
| `demo_traffic` | Optional integer for illustrative monthly sessions in leak math (defaults in code) |
| `logo` | **HTTPS** URL to clinic logo image (`encodeURIComponent`). Shown on results trust header + top of flow when set. |
| `brand` or `primary` | Primary hex without or with `#`, e.g. `brand=0B3D91` or `brand=%230B3D91` — primary buttons + demo banner accent. |
| `brand2` | Optional second hex — accent borders (e.g. demo banner border). |
| `booking` / `book` / `booking_url` | **HTTPS** scheduling URL (Calendly, etc.) — overrides tenant config for that session. |
| *(tenant DB)* | `tenants.crm_keys` JSON: `{ "booking_url": "https://..." }` — used by **`GET /api/public/tenant-intake-config?handle=`** for paid white-label intake. |

**Example (cold email / LinkedIn demo link):**  
`/intake?demo=1&company=Acme%20Med%20Spa&demo_traffic=600&logo=https%3A%2F%2Fexample.com%2Flogo.png&brand=7C3AED&booking=https%3A%2F%2Fcalendly.com%2Facme%2Fconsult`

Production tenants: same params work for **personalized demos**; store **logo**, **colors**, and **booking_url** on the tenant row so `/intake?company=handle` resolves booking without query hacks.

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

After `done` on infra (`MASTER_TODO_GLPCONVERT.md` U036–U038), production URLs use the same funnel with `demo` off; tenant branding from config replaces query-param hacks where implemented (see U017–U020).
