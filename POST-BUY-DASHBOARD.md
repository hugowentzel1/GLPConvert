# Post-Buy Customer Dashboard — How It Works

**Canonical post-purchase page:** `/c/[companyHandle]` only. We never redirect customers to `/activate` after Stripe checkout.

---

## 1. After payment

- Customer completes Stripe checkout ($399 setup + $99/mo).
- Stripe redirects to: **`/c/{companyHandle}?session_id={CHECKOUT_SESSION_ID}&demo=1`**
  - Example: company "SolarCorp" → handle `solarcorp` → `/c/solarcorp?session_id=cs_xxx&demo=1`
- `success_url` is set in `app/api/stripe/create-checkout-session/route.ts`. Do not change it to `/activate`.

---

## 2. What the dashboard is

- **Route:** `app/c/[companyHandle]/page.tsx` — one page for all companies; `companyHandle` is the URL segment (e.g. `activate-test`, `solarcorp`).
- **Auth:** Customer can land here in two ways:
  1. **Right after Stripe:** URL has `session_id` and `demo=1`. In demo mode the page allows access without a magic-link token (so they see the dashboard immediately).
  2. **From onboarding email:** They click the magic link, which has `?token=...`. The page verifies the token (base64 payload with email, company, timestamp; valid 7 days), then marks them authenticated and stores it in `sessionStorage` for that company so they can return without the token.
- If there’s no valid token and it’s not demo mode, they see “Access Required” and a link back home.

---

## 3. What the customer sees

- **Header:** “{companyHandle} Dashboard” and “Your branded solar calculator is live and ready!” with a status badge (e.g. “active”).
- **Instant URL:** Shareable link to their calculator (e.g. `https://yoursite.com/{companyHandle}`). Copy button + “Visit Site”.
- **Embed Code:** Pre-built iframe snippet to paste on their site. Copy button.
- **Custom Domain:** Placeholder for attaching a domain like `quote.yourcompany.com` (actual attach/verify is via your APIs).
- **API Key:** Display (and copy) for API access.
- **View Leads:** Link to `/c/{companyHandle}/leads`.
- **Documentation / Contact Support:** Links to setup docs and support.

All copy/links are derived from `companyHandle` and, in production, from tenant data (e.g. Airtable) instead of client-only defaults.

---

## 3b. Do those links work? What they see when they click (visual check)

| Link | What happens | What they see |
|------|-------------------------------|----------------|
| **Visit Site** (Instant URL) | Opens their instant URL in a new tab. The URL is `/{companyHandle}` (e.g. `/activate-test`). That route redirects to **`/paid?company={companyHandle}`**. | The **paid calculator page** with their **company name** in the header/branding and the **brand theme color** (from `getBrandTheme(companyHandle)`). Logo shows only if passed in URL (e.g. `?logo=...`) or from tenant API in production. |
| **Copy URL** | Copies the instant URL to clipboard. | Same URL as Visit Site; when pasted and opened, same paid page with their branding. |
| **Copy Embed Code** | Copies an iframe snippet. The iframe **src** is **`/embed/{companyHandle}?company={companyHandle}`**. | When they paste the code on their site, the iframe loads the **embed calculator** with **company name** and **theme color** in the header ("Powered by Sunspire"). Logo shows if in URL or from API. |
| **Setup Instructions** (Custom Domain) | Goes to `/docs/setup?company={companyHandle}`. | Setup docs with company in query for context. |
| **Copy API Key** | Copies the API key to clipboard. | For use in API requests. |
| **View Leads** | Goes to `/c/{companyHandle}/leads`. | Leads list for that company (from Airtable in production). |
| **Documentation / Contact Support** | Goes to `/docs/setup` and `/support`. | Standard docs and support pages. |

**Summary:** The **Instant URL** and **Embed Code** both resolve to pages that show the customer's **company name** and **theme color**. Logo appears when you pass it in the URL (e.g. `?logo=https://...`) or when the page fetches tenant data from your API (e.g. Airtable) and includes the logo. The route `/{companyHandle}` exists and redirects to `/paid?company=...` so their shared link works with their paid version branding.

---

## 4. Data flow (today)

- **Tenant data:** The page’s `fetchTenantData` currently builds a minimal tenant object in the browser (instant URL, embed code, custom domain placeholder, API key, status). In production this should be replaced with a call to your backend (e.g. `GET /api/tenant?company={companyHandle}` or session-based) that returns the same shape from your database/Airtable.
- **Webhook:** When Stripe sends `checkout.session.completed`, your webhook creates/updates the tenant (e.g. in Airtable), then sends the onboarding email with the magic link. The dashboard page does not create the tenant; it only displays it and allows access when `session_id`+`demo=1` or a valid `token` is present.

---

## 5. Summary

| Step | What happens |
|------|-------------------------------|
| 1 | Customer pays on Stripe. |
| 2 | Stripe redirects to `/c/{companyHandle}?session_id=...&demo=1`. |
| 3 | Dashboard loads; in demo mode, no token required. |
| 4 | Customer sees Instant URL, Embed Code, Custom Domain, API Key, Leads. |
| 5 | Later they can use the email magic link (`/c/{companyHandle}?token=...`); token is verified and stored so they can return without the link. |

Keep post-buy as `/c/[companyHandle]` only; do not use `/activate` for the post-purchase experience.
