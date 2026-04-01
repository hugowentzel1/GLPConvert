# Sentry — GLPConvert

The repo already includes Sentry SDK wiring (`sentry.client.config.ts`, `sentry.server.config.ts`, `sentry.edge.config.ts`, `next.config.js` `withSentryConfig`, and **`/sentry-example-page`**).

## Wizard vs this repo

Sentry’s onboarding may suggest:

`npx @sentry/wizard@latest -i nextjs --saas --org glpconvert --project javascript-nextjs`

**You usually do not need to run that** here: it can add duplicate or conflicting files. Prefer **manual**: copy the **DSN** from Sentry → set env vars below → redeploy.

If you already ran the wizard, diff against `main` and keep a single consistent setup (this doc + existing `sentry.*.config.ts`).

## What you do (dashboard)

1. **https://sentry.io** → org **`glpconvert`**, project **`javascript-nextjs`** (or your chosen slug).
2. **Project Settings → Client Keys (DSN)** → copy the **DSN** URL.

## Environment variables (Vercel + `.env.local`)

Use the **same DSN** in both rows unless you intentionally split projects.

| Key | Purpose |
|-----|--------|
| `SENTRY_DSN` | Server + Edge (`sentry.server.config.ts`, `sentry.edge.config.ts`) |
| `NEXT_PUBLIC_SENTRY_DSN` | Browser (`sentry.client.config.ts`) |

Optional:

| Key | Purpose |
|-----|--------|
| `NEXT_PUBLIC_SENTRY_ENABLE` | Set to **`1`** to allow the **test page** and **`/api/sentry-test`** in **production** (otherwise they are gated). Dev/local works without it. |
| `SENTRY_AUTH_TOKEN` | Source maps upload in CI (advanced). |

3. **Redeploy** Vercel after saving env vars.

## Verify

1. Local: `npm run dev` → open **`http://localhost:3000/sentry-example-page`** → trigger client/server test → check **Issues** in Sentry.
2. Production: set **`NEXT_PUBLIC_SENTRY_ENABLE=1`** (temporarily if you prefer), redeploy, same page on your Vercel URL, then unset or leave off for normal operation.
