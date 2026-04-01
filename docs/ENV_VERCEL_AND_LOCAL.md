# Environment variables — exact paste guide (Vercel + `.env.local`)

**Chronological order (matches `MASTER_TODO_GLPCONVERT.md`):** **U036** = section **“Always (app + auth)”** only for first green deploy → **U037** = **Supabase** → **U038** = **Stripe** (+ optional Resend).

**Canonical production URL for this repo:** see **`docs/VERCEL_CANONICAL_URL.md`**.  
Default assumption: **`https://glp-convert.vercel.app`** (matches Vercel production for project **GLPCONVERT** / slug **`glp-convert`**). Confirm in **Settings → Domains**.

**Local file:** `cp env.local.template .env.local` → fill values → **never commit** `.env.local`.

**Same keys** in Vercel (**Settings → Environment Variables**) and in **`.env.local`**, except:

| Variable | Vercel (Production) | `.env.local` (your Mac) |
|----------|---------------------|-------------------------|
| `NEXT_PUBLIC_APP_URL` | `https://glp-convert.vercel.app` | `http://localhost:3000` |

After any Vercel env change: **Deployments → ⋯ → Redeploy**.

---

## A) Required for GLP product + DB + billing (paste all of these)

### App + auth

| Key | Paste exactly (Production / Vercel) | Paste exactly (`.env.local`) | Where it comes from |
|-----|-------------------------------------|------------------------------|---------------------|
| `NEXT_PUBLIC_APP_URL` | `https://glp-convert.vercel.app` | `http://localhost:3000` | Vercel: use canonical URL above; local: dev server |
| `NEXT_PUBLIC_VERTICAL` | `glp` | `glp` | Typed |
| `NEXT_PUBLIC_BRAND_NAME` | `GLPConvert` | `GLPConvert` | Typed |
| `JWT_SECRET` | Run: `openssl rand -hex 32` → paste **64 hex chars** | Same as Vercel (or different for local-only) | You generate |
| `ADMIN_TOKEN` | Run `openssl rand -hex 32` **again** → **different** 64 hex chars | Same or different for local | You generate |

### Supabase (database)

| Key | What to paste | Where to copy |
|-----|----------------|---------------|
| `SUPABASE_URL` | `https://xxxxxxxx.supabase.co` (your project ref) | Supabase → **Project Settings** → **API** → **Project URL** |
| `SUPABASE_SERVICE_ROLE_KEY` | **Secret** key: either legacy JWT (`eyJ…`) or newer **`sb_secret_…`** (full string from **Secret keys** → reveal → copy) | Same **API** page → **Secret keys** (or **service_role**) → **Reveal** → **Copy** — never use **Publishable** here |

**Never** put `SUPABASE_SERVICE_ROLE_KEY` in any `NEXT_PUBLIC_*` variable.

### Stripe (use **Test mode** first)

| Key | What to paste | Where to copy |
|-----|----------------|---------------|
| `STRIPE_SECRET_KEY` | `sk_test_51...` (full secret key) | Stripe → **Developers** → **API keys** → **Secret key** (Standard keys) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | `pk_test_51...` | Same page → **Publishable key** |
| `STRIPE_PUBLISHABLE_KEY` | **Same value** as `pk_test_...` above | Duplicate for code paths that read this name |
| `STRIPE_PRICE_MONTHLY_99` | `price_...` | **Product catalog** → recurring product (e.g. monthly) → **API ID** on the **Price** |
| `STRIPE_PRICE_SETUP_399` | `price_...` | One-time setup product → **Price** → **API ID** |
| `STRIPE_WEBHOOK_SECRET` | `whsec_...` | **Developers** → **Webhooks** → **Add endpoint** → URL below → after save, **Signing secret** → **Reveal** |

**Stripe webhook URL to register (Production):**

```text
https://glp-convert.vercel.app/api/stripe/webhook
```

If your Vercel domain is **not** `glp-convert.vercel.app`, replace the host with your **Settings → Domains** value (see `docs/VERCEL_CANONICAL_URL.md`).

**Live mode later:** replace `sk_test_` / `pk_test_` with `sk_live_` / `pk_live_`, create a **live** webhook endpoint (same path on your prod domain), new `whsec_...`, and optionally set **`STRIPE_LIVE_SECRET_KEY`** instead of (or in addition to) test — code prefers **`STRIPE_LIVE_SECRET_KEY`** over **`STRIPE_SECRET_KEY`** when both matter for mode.

---

## B) Strongly recommended (email)

| Key | What to paste | Where to copy |
|-----|----------------|---------------|
| `RESEND_API_KEY` | `re_...` | Resend → **API Keys** → Create → copy |

Without this, lead notification emails from `/api/lead` may be skipped (non-fatal).

---

## C) Optional (GLP works without these)

| Key | Purpose |
|-----|---------|
| `NEXT_PUBLIC_META_PIXEL_ID` | Meta Pixel on `/intake` |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | GA4 on `/intake` |
| `SUPABASE_FETCH_TIMEOUT_MS` | e.g. `12000` — shorter Supabase waits on serverless |
| `RESEND_FETCH_TIMEOUT_MS` | e.g. `12000` |
| `GOOGLE_GEOCODING_API_KEY` | Server geocode — `AIza...` — only if you use `/api/geo/normalize` |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Client Places — legacy address UX |
| `VERCEL_TOKEN` + `VERCEL_PROJECT_ID` | `/api/domains/*` automation |
| `KV_*` / `REDIS_URL` | Rate limits / DLQ when wired |
| `NEXT_PUBLIC_SENTRY_DSN` / `SENTRY_DSN` | Error reporting |
| `SMTP_*` | Email instead of/in addition to Resend |

**Solar-only (not needed for GLP):** `NREL_API_KEY`, `EIA_API_KEY`, `OPENEI_API_KEY`.

---

## D) Checklist — copy-paste order

1. Generate **`JWT_SECRET`** and **`ADMIN_TOKEN`** (`openssl rand -hex 32` ×2).  
2. Create **Supabase** project → paste **`SUPABASE_URL`** + **`SUPABASE_SERVICE_ROLE_KEY`**.  
3. Set **`NEXT_PUBLIC_APP_URL`** = `https://glp-convert.vercel.app` (or your real `.vercel.app` host).  
4. Create **Stripe** test products/prices → paste **`STRIPE_SECRET_KEY`**, **`pk_test_`** (both public env names), **`STRIPE_PRICE_*`**.  
5. Add Stripe **webhook** with URL **`https://<your-vercel-host>/api/stripe/webhook`** → paste **`STRIPE_WEBHOOK_SECRET`**.  
6. (Optional) **Resend** → **`RESEND_API_KEY`**.  
7. Mirror every key into **`.env.local`** using **`env.local.template`**.  
8. **Redeploy** on Vercel.

---

## APIs this stack uses end-to-end

See **`docs/GLPCONVERT_APIS_AND_INTEGRATIONS.md`** (Supabase, Stripe, Resend, optional Meta/GA/Vercel/Google, solar exclusions for GLP).
