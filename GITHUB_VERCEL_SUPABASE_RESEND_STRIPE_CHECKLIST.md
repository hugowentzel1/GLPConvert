# GitHub + Vercel + Supabase + Resend + Stripe — checklist

Use with `ENV_VARS_GLPCONVERT.md`. Mark items in `MASTER_TODO_GLPCONVERT.md`.

## Git / GitHub

- [ ] **HUMAN** Create new GitHub repo `GLPConvert` (or monorepo path).
- [ ] **HUMAN** `git init`, commit migration baseline, push `main`.
- [ ] **AUTO** Add `README.md` GLPConvert summary (pending).
- [ ] Branch strategy: `main` production, `develop` optional, PRs for features; protect `main`.
- [ ] Decide fate of `sunspire-clean`: **archive**, **read-only**, or **parallel** — do not delete until GLP parity reached.

## Vercel

- [ ] **HUMAN** New Project → import GitHub repo; Framework Preset: Next.js.
- [ ] **HUMAN** Production branch: `main`; Preview for PRs.
- [ ] **HUMAN** Environment variables: copy from `.env.example` → Production + Preview.
- [ ] **HUMAN** Domains: attach apex + `www` or subdomain; SSL auto.
- [ ] **AUTO** Update `NEXT_PUBLIC_APP_URL` to production URL in Vercel env.
- [ ] Redeploy after env changes.

## Supabase

- [ ] **HUMAN** Create project (staging + production recommended).
- [ ] **HUMAN** Run SQL migrations when schema drafted (intake sessions, programs, tenants).
- [ ] **HUMAN** Service role key → Vercel **server** env only (never `NEXT_PUBLIC_*`).
- [ ] Auth: confirm if clinic users need Supabase Auth or magic links only (current code uses JWT patterns).
- [ ] Storage: avoid PHI uploads in v1.

## Resend

- [ ] **HUMAN** Add domain DNS records (SPF/DKIM).
- [ ] **HUMAN** Verify domain in Resend dashboard.
- [ ] **HUMAN** API key → Vercel; set `from` domain aligned with `NEXT_PUBLIC_APP_URL` host.
- [ ] **AUTO** Audit transactional templates for GLPConvert wording (partially done in code).

## Stripe

- [ ] **HUMAN** Create **Test** products/prices for setup + monthly SaaS.
- [ ] **HUMAN** Webhook endpoint: `https://<prod>/api/webhooks/stripe` (+ preview URL for staging).
- [ ] **HUMAN** Copy signing secret → `STRIPE_WEBHOOK_SECRET`.
- [ ] **HUMAN** Go live: create live products, swap keys, update webhook to live endpoint.
- [ ] Metadata convention: `tenant_slug`, `vertical=glp`, `wellspire_product=glpconvert`.

## CI (optional / future)

- [ ] GitHub Actions: `npm ci`, `npm run build`, targeted Playwright on schedule.
- [ ] Block merge if build fails.

## Post-deploy smoke

- [ ] `/api/health` returns expected flags.
- [ ] `/result?demo=1` renders recommendation.
- [ ] Stripe test checkout → webhook → provisioning path (if enabled).
