# Canonical Vercel URL for this repository

GitHub repo: **`hugowentzel1/GLPConvert`**.

Vercel turns your **Project name** into a **lowercase, hyphenated** hostname. For a project named **`GLPCONVERT`**, the production domain is typically **`glp-convert.vercel.app`** (not `glpconvert.vercel.app`).

## Use this URL unless Vercel shows something different

| What | Value |
|------|--------|
| **Production hostname** | **`glp-convert.vercel.app`** |
| **Full site URL** | **`https://glp-convert.vercel.app`** |
| **`NEXT_PUBLIC_APP_URL` (paste exactly)** | **`https://glp-convert.vercel.app`** |
| **Stripe webhook endpoint (register in Stripe)** | **`https://glp-convert.vercel.app/api/stripe/webhook`** |
| **Resend / links in emails (canonical base)** | **`https://glp-convert.vercel.app`** |

**No trailing slash** on `NEXT_PUBLIC_APP_URL`.

## If this hostname is not yours

**Source of truth:** Vercel → your project → **Overview** (production domain) or **Settings** → **Domains** → copy the **`*.vercel.app`** value shown for **Production**. If yours differs (e.g. you renamed the project), use that host everywhere below instead.

## Preview deployments

PR previews use URLs like `https://glp-convert-git-<branch>-<team>.vercel.app`. For **Production** keys (`STRIPE_WEBHOOK_SECRET` for prod endpoint), register the **Production** URL only, or add a second Stripe webhook for preview if needed.
