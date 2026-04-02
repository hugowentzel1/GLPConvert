# Cold email branding — GLPConvert

How **individualized demos** get clinic **name**, **color**, and **logo** from the URL (same pattern as classic white-label solar demos, adapted for GLP intake).

## What happens when someone clicks

1. **`company=`** — display name across hero, intake, and footer.  
2. **`brand=` / `primary=` / `brandColor=`** — 6-digit hex accent → `--brand-primary` (CTAs, chips). If omitted, **`lib/brandTheme.ts`** maps many known names to a color; else default blue.  
3. **`logo=`** — HTTPS logo URL on an allowlisted host (see **`lib/logo-brand-helpers.ts`**), or proxied via **`/api/logo-proxy`**.  
4. **`domain=`** — e.g. `domain=stripe.com` → auto logo **`https://logo.clearbit.com/stripe.com`** (allowlisted).  
5. **`company=` as domain** — if `company=acmeclinic.com` (bare domain), logo resolves via Clearbit the same way.  
6. **`demo=1`** — buyer/demo mode: preview quota, owner ROI panels on intake results, activation CTAs on marketing home.

## Minimal link (recommended)

```
https://glp-convert.vercel.app/?demo=1&company=ClinicName&domain=clinicdomain.com
```

## Full link (maximum control)

```
https://glp-convert.vercel.app/intake?demo=1&handle=glpconvert&company=Acme%20Med%20Spa&domain=acme.com&brand=2563EB&booking=https%3A%2F%2Fcal.com%2Fthem
```

- **`handle=`** — tenant slug for `GET /api/public/tenant-intake-config` when `company` is a pretty name.

## Adding brand colors for new names

Edit **`lib/brandTheme.ts`**:

```ts
const map: Record<string, string> = {
  // "normalized" lowercase key: "#RRGGBB"
  myclinicbrand: "#1e293b",
};
```

## Logo proxy

Server **`app/api/logo-proxy/route.ts`** fetches allowlisted images (Clearbit, etc.) for consistent CSP and caching.

## Related docs

- **`GLPCONVERT_COLD_EMAIL_PLAYBOOK.md`** — sequences + scale.  
- **`DEMO_STRATEGY_GLPCONVERT.md`** — product rules demo ≈ paid.  
- **`MASTER_TODO_GLPCONVERT.md`** — **CE-2026** tasks.
