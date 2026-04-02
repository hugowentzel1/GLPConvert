# Attribution & pixels (GLPConvert)

Practical scaffolding for **measuring demo → activation → patient intake** without turning the product into an analytics product.

## Implemented in-app

- **UTM persistence:** `lib/glp-attribution.ts` merges `utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content` from the URL into `sessionStorage` and merges with later navigation. Leads submitted via `POST /api/lead` include UTM fields when present.
- **Events (lightweight):** `POST /api/events/log` records simulation milestones (non-blocking in UI).

## Roadmap / integration pattern (no vendor lock-in)

| Goal | Approach |
|------|----------|
| **Meta (Facebook) Pixel** | Tenant or global **env**-gated script injection in `app/layout.tsx` or a small `components/AttributionScripts.tsx` — only after clinic consents to marketing measurement. |
| **Google Ads / GA4** | Same: gtag snippet behind env + consent; pass `company` / `tenant` as custom parameters where policy allows. |
| **Booking attribution** | Prefer **booking URL with UTM** appended server-side or in tenant config; optional webhook from booking vendor. |

## Compliance note

Pixels that identify users or health-related activity may implicate **HIPAA** and marketing laws. **HUMAN:** counsel + clinic BAA/marketing policy before enabling cross-site tracking on **patient** surfaces. Demo/buyer marketing pages may be treated differently—still disclose in privacy policy.

## Sources (patterns, not legal advice)

Industry guidance on **consent**, **minimization**, and **clear disclosure** for healthcare-adjacent sites appears in **HHS OCR** materials on HIPAA, **FTC** health privacy enforcement patterns, and **IAB TCF** / regional ePrivacy norms—use them with counsel to choose a consent banner and pixel strategy.
