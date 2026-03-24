# Local environment setup — GLPConvert

## Prerequisites

- Node **20.x** (see `package.json` `engines`; newer may work but CI should match 20)
- `npm install`

## Quick start (minimal — GLP scaffold only)

1. Copy env template: `cp .env.example .env.local`
2. Set at minimum:
   - `NEXT_PUBLIC_APP_URL=http://localhost:3000`
3. Run: `npm run dev`
4. Visit:
   - `http://localhost:3000/result?demo=1` — loads sample recommendation via `/api/recommend`

## Local test mode strategy

- **No maps / NREL / EIA:** OK for `/result` demo and static pages. `src/config/env.ts` allows optional solar/maps keys.
- **JWT / magic links:** In non-production, `src/server/auth/jwt.ts` uses a **fixed dev secret** if `JWT_SECRET` and `ADMIN_TOKEN` are unset — **never ship that behavior**; it exists only so `next build` and local API compile.
- **Stripe:** Use test keys + Stripe CLI for webhooks (`stripe listen --forward-to localhost:3000/api/webhooks/stripe`) when testing checkout.
- **Supabase:** Point to a **staging** project; avoid production service role on dev laptops.

## Stubbing externals

| Service | Stub approach |
|---------|----------------|
| Resend | Omit `RESEND_API_KEY` — email paths no-op or log (observe `lib/email-service.ts` behavior in your scenario) |
| Stripe | Use test mode + fake card numbers |
| Google Maps | Omit key — address autocomplete will fail; use `/result` flow instead |
| NREL/PVWatts | Omit `NREL_API_KEY` — `/api/estimate` and `/report` may error; avoid those routes locally |

## Verification

- `npm run build` — production compile
- `npm run lint` — ESLint
- Playwright: set `BASE_URL=http://localhost:3000` (many legacy tests still assume solar — see `MASTER_TODO_GLPCONVERT.md`)

## Legacy solar report locally

Default vertical is **glp**, so `/api/estimate` returns **503** unless you opt in:

```bash
NEXT_PUBLIC_ENABLE_SOLAR_ESTIMATE=1
NREL_API_KEY=your_nrel_key
```

Then `/report` can load live PVWatts data again.

## Troubleshooting

- **Zod/env errors:** Ensure `.env.local` exists; compare with `.env.example`.
- **Sentry warnings on build:** Informational; see Sentry Next.js instrumentation migration in a later task.
