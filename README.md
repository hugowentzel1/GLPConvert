# GLPConvert

**GLPConvert** is a white-label **intake, recommendation, and booking conversion layer** for GLP-1 / medical weight-loss programs. It is a product of **Wellspire LLC**.

Built on Next.js 14 (App Router); migrated from the **sunspire-clean** codebase (solar). Legacy solar report/estimate paths remain for transition but are **disabled by default** when `NEXT_PUBLIC_VERTICAL=glp`.

## Quick start

```bash
npm install
cp .env.example .env.local
# Set at least NEXT_PUBLIC_APP_URL=http://localhost:3000
npm run dev
```

- **Intake:** [http://localhost:3000/intake](http://localhost:3000/intake)
- **Sample result:** [http://localhost:3000/result?demo=1](http://localhost:3000/result?demo=1)

**If the UI looks unstyled (Times font, no Tailwind):** open the app with an explicit port (`http://localhost:3000`, not bare `localhost`). Local dev uses HTTP; `upgrade-insecure-requests` and HSTS are applied only on Vercel so stylesheets are not forced to broken `https://localhost` URLs.

## Documentation (source of truth)

| Doc | Purpose |
|-----|---------|
| [MASTER_TODO_GLPCONVERT.md](./MASTER_TODO_GLPCONVERT.md) | **Master checklist** — ship status |
| [GLPCONVERT_HUMAN_ACTIONS_ONLY.md](./GLPCONVERT_HUMAN_ACTIONS_ONLY.md) | Chronological **human-only** steps |
| [GLPCONVERT_MIGRATION_AUDIT.md](./GLPCONVERT_MIGRATION_AUDIT.md) | Audit & risks |
| [GLPCONVERT_IMPLEMENTATION_PLAN.md](./GLPCONVERT_IMPLEMENTATION_PLAN.md) | Phased plan |
| [GLPCONVERT_PRODUCT_SPEC.md](./GLPCONVERT_PRODUCT_SPEC.md) | Product definition |
| [GLPCONVERT_LEGAL_COMPLIANCE_NOTES.md](./GLPCONVERT_LEGAL_COMPLIANCE_NOTES.md) | Compliance drafts (not legal advice) |
| [ENV_VARS_GLPCONVERT.md](./ENV_VARS_GLPCONVERT.md) | Environment variables |
| [LOCAL_ENV_SETUP.md](./LOCAL_ENV_SETUP.md) | Local dev & test mode |
| [GITHUB_VERCEL_SUPABASE_RESEND_STRIPE_CHECKLIST.md](./GITHUB_VERCEL_SUPABASE_RESEND_STRIPE_CHECKLIST.md) | Infra checklist |

## Product stance

Marketing / intake / booking software — **not** an EMR, not telehealth infra, **not medical advice**. A licensed provider determines final eligibility.

## Legacy solar stack

To re-enable **NREL `/api/estimate`** for demos: set `NEXT_PUBLIC_ENABLE_SOLAR_ESTIMATE=1` (see [LOCAL_ENV_SETUP.md](./LOCAL_ENV_SETUP.md)).

## License

Private / proprietary — Wellspire LLC.
