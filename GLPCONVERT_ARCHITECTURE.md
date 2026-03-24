# GLPConvert architecture (high level)

## Stack

- **Next.js 14** App Router, React 18, TypeScript, Tailwind
- **Stripe** — SaaS checkout, webhooks, customer portal
- **Supabase** — tenants, leads, links (existing); **draft** intake/program tables in `supabase/migrations/0003_*`
- **Resend / SMTP** — transactional email
- **Vercel** — hosting, env per environment
- **Optional:** KV for rate limits, Sentry, PostHog

## Module boundaries

| Layer | Responsibility |
|-------|----------------|
| `lib/verticals/{glp,trt,pep}/` | Intake definitions, `recommend.ts`, `compliance.ts` (GLP) |
| `lib/feature-flags.ts` | `NEXT_PUBLIC_VERTICAL`, solar estimate toggle |
| `lib/product-identity.ts` | Wellspire / GLPConvert naming, storage keys |
| `app/intake` | Patient-facing questionnaire |
| `app/result` | Outcome + disclaimers + booking CTA |
| `app/api/recommend` | Server-side deterministic engine entry |
| Legacy `lib/pvwatts`, `app/api/estimate`, `app/report` | Solar — disable when vertical=`glp` |

## Data flow (target)

1. Visitor hits hosted URL or embed → `/intake?company=…`
2. Answers persisted → `intake_sessions` / `intake_answers` (when wired)
3. `POST /api/recommend` → program + price signal
4. Lead POST to existing `/api/submit-lead` or CRM webhook with **non-PHI** payload default
5. CTA → external calendar / deposit (clinic-owned)

## Multi-vertical

Only these differ per vertical: intake, recommend, pricing rules, compliance strings, CRM mapping — same Stripe, same dashboard shell, same email transport.
