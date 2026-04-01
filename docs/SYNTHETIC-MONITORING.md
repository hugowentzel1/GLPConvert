# Synthetic monitoring (GLPConvert)

Production-safe Playwright tests that run on a schedule and POST results to **`/api/synthetic-results`**, which **`/status`** displays (same pattern as the legacy Sunspire app, URLs and primary funnel updated for GLPConvert).

## What the two tests cover

1. **Primary funnel** (`tests/synthetics/homeowner-production-flow.spec.ts` — npm script still named `test:synthetic:homeowner`)
   - Opens production **`/?company=SynthTest&demo=1`** (branded GLP demo home).
   - Asserts GLP/simulator/branded copy loads.
   - Opens **`/intake?company=SynthTest&demo=1`** and asserts simulator/intake copy (no legacy solar `/report` requirement).

2. **Buyer production flow** (`tests/synthetics/buyer-production-flow.spec.ts`)
   - Opens **`/?company=SynthBuyer&demo=1`**.
   - Confirms demo/buyer UI and branding.
   - Clicks the main upgrade/checkout CTA.
   - Intercepts **`/api/stripe/create-checkout-session`** and verifies it returns a Stripe checkout URL.
   - **Does not** follow the redirect or complete a real payment.

## Where they live

- Tests: `tests/synthetics/homeowner-production-flow.spec.ts`, `tests/synthetics/buyer-production-flow.spec.ts`
- Config: `playwright.synthetics.config.ts`
- Workflow: `.github/workflows/synthetic-monitoring.yml`
- API: `app/api/synthetic-results/route.ts` (GET = read, POST = write with token)
- Status UI: `app/status/page.tsx` (Synthetic monitoring section)
- Post script: `scripts/post-synthetic-results.mjs`

## Post-deploy verification (production)

- **Status section present:** `SYNTHETIC_APP_URL=https://glp-convert.vercel.app npm run test:synthetic:status` — baseline test passes; row-level tests run when synthetic JSON has been POSTed to `/api/synthetic-results` (e.g. after GitHub Actions posts results).
- **Full flows:** `SYNTHETIC_BASE_URL=https://glp-convert.vercel.app npm run test:synthetic` (optional; longer).

## How to run locally

- **Both production flows:** `npm run test:synthetic` (primary funnel + buyer).
- **Primary funnel only:** `npm run test:synthetic:homeowner`
- **Buyer only:** `npm run test:synthetic:buyer`
- **Status page display (after posting to same app):** `SYNTHETIC_APP_URL=http://localhost:3000 npm run test:synthetic:status` — verifies `/status` shows the synthetic section and, when data exists, **Primary funnel** + buyer rows with PASS/FAIL and format. Includes a visual snapshot of the section (baseline: `tests/synthetics/status-page-synthetic-display.spec.ts-snapshots/`).

Default production base URL in repo config is **`https://glp-convert.vercel.app`**. Override anytime:

```bash
SYNTHETIC_BASE_URL=https://glp-convert.vercel.app npm run test:synthetic:homeowner
```

## How they run in GitHub Actions

- **Schedule:** Every 30 minutes (`*/30 * * * *`).
- **Manual:** Workflow dispatch from the Actions tab (“Synthetic monitoring”).
- **Defaults:** Tests hit and POST results to **`https://glp-convert.vercel.app`** unless you set repo variables **`SYNTHETIC_BASE_URL`** and optionally **`SYNTHETIC_APP_URL`** (when POST target should differ from the URL under test, e.g. preview).
- Jobs: One job runs primary funnel synthetic, then buyer synthetic, then posts results to `/api/synthetic-results`.
- On failure, artifacts (test-results/, playwright-report/) are uploaded.
- The post step runs even when a test fails, so the status page shows FAIL and last run time.

## Environment variables

| Variable | Required | Where | Purpose |
|----------|----------|--------|---------|
| `SYNTHETIC_BASE_URL` | No (default prod URL) | Workflow vars / local | Base URL for both tests |
| `SYNTHETIC_TEST_ADDRESS` | No | Local / workflow env | Homeowner test address |
| `SYNTHETIC_TEST_LAT` / `SYNTHETIC_TEST_LNG` / `SYNTHETIC_TEST_STATE` | No | Local / workflow env | Homeowner test coordinates |
| `SYNTHETIC_REPORT_TOKEN` | No | — | Optional; if set in Vercel, POST can require it. By default POST is rate-limited only (no GitHub secret). |
| `KV_REST_API_URL` / `KV_REST_API_TOKEN` | Optional | Vercel env | Persist results in Vercel KV; if missing, in-memory only (not shared across instances) |

## Going live

- Deploy **`/api/synthetic-results`** and **`/status`** on Vercel (GLPConvert production: **`https://glp-convert.vercel.app`**).
- Enable the **Synthetic monitoring** workflow on the **GLPConvert** GitHub repo (not the old Sunspire repo) so scheduled runs POST into this app.

## Checking visually on live while on this branch (no merge yet)

You **can** check the status page and synthetic results on live without merging to main:

1. **Push your branch** so Vercel builds a **preview deployment** (URL shape like `https://glp-convert-git-<branch>-<team>.vercel.app`; confirm in the Vercel dashboard or the PR “Deployment” link).
2. **Open the preview URL** in the browser and go to `/status` — you should see the full status page including the “Synthetic monitoring” section (it may show “No recent synthetic data” until the workflow has posted).
3. **Run the synthetic workflow** (or run synthetics locally and post to the preview):
   - In GitHub Actions: trigger “Synthetic monitoring” and set the workflow variable `SYNTHETIC_BASE_URL` / `SYNTHETIC_APP_URL` to your **preview URL** (so tests hit the preview and results are posted to the preview). Then open `https://<preview-url>/status` to see PASS/FAIL and last run.
   - Or locally:  
     `SYNTHETIC_BASE_URL=https://<preview-url> SYNTHETIC_APP_URL=https://<preview-url> npm run test:synthetic:homeowner npm run test:synthetic:buyer`  
     then  
     `SYNTHETIC_APP_URL=https://<preview-url> SYNTHETIC_HOMEOWNER_STATUS=success SYNTHETIC_BUYER_STATUS=success node scripts/post-synthetic-results.mjs`  
     then open `https://<preview-url>/status` to confirm the section shows results accurately.

So you do **not** have to wait until merge: use the branch’s preview URL as the “live” app for both running synthetics and viewing `/status`.

## GitHub secrets

- **None required.** The workflow POSTs to `/api/synthetic-results` without auth. The API rate-limits (12 POSTs/hour per IP) so the 30‑min schedule works and abuse is limited.

## How the status page gets synthetic data

- The status page fetches `GET /api/synthetic-results` (no auth).
- The API reads from Vercel KV (key `synthetic:results`) if configured; otherwise returns in-memory data or `{}`.
- After each synthetic run, the workflow calls `scripts/post-synthetic-results.mjs`, which POSTs to `/api/synthetic-results` (rate-limited; no token required).
- The payload includes `homeowner` and `buyer` results (status, lastRun, summary, failureReason, artifactsUrl, environment).

## How to inspect failures

1. Open GitHub Actions → “Synthetic monitoring” → failed run.
2. Download the “synthetic-test-results” artifact (traces, screenshots, video if enabled).
3. Open `playwright-report/index.html` locally or use `npx playwright show-report`.
4. Check the “Post synthetic results” step logs to confirm the status page payload was sent.

## data-testid and selectors

- **Report page:** `data-testid="report-page"`, `data-testid="report-cta-footer"`, `data-testid="report-bottom-cta"`, `data-testid="unlock-report-cta"` (existing).
- **Status page:** `data-testid="synthetic-monitoring-section"` (new).
- **Homepage CTA:** `button[data-cta="primary"]`, `button[data-cta-button]` (existing).

## Limitations / safe stopping points

- **Buyer flow:** Stops after confirming the checkout session API returns a Stripe URL. It does not follow the redirect to Stripe and does not complete a real payment.
- **Homeowner flow:** Uses a fixed test address (or env) and does not submit a real lead or trigger email.
- **Results storage:** Without Vercel KV, results are in-memory only and may not persist across serverless invocations; the status page may show “No recent synthetic data” until KV is configured and the workflow has run at least once.

## Optional: Sentry Cron Monitoring

Sentry supports Cron Monitoring (check-ins). To add it cleanly you would:

1. Create a Sentry cron monitor (e.g. “Synthetic monitoring”) and get the slug.
2. In the workflow, add a step that calls Sentry’s check-in API at the start (in_progress) and end (ok/failed) of the run.

If you prefer to keep the implementation minimal, the current setup (workflow + status page + artifacts) is sufficient; failures are visible in GitHub Actions and on the status page.
