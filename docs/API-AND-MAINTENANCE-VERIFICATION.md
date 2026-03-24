# API & maintenance verification

**Purpose:** Single checklist for “is production still healthy?” before go-live and after big changes. Aligned with Playwright matrix, `/api/health`, and **MAINTENANCE-GUIDE.md**.

**Owner click-through (simple):** **`docs/TEMPORARY-TO-DO-LIST.md`** → **Step 46** (**1–53**) + **Step 47** (**54–57**) (start of file) · **Full E2E:** **`docs/FULL-E2E-VERIFICATION-PLAYBOOK.md`** · Optional automation: **`docs/OWNER-IN-DEPTH-PROD-CHECKLIST.md`**  
**One-shot prod automation (screenshots + matrix + docs):** `BASE_URL=https://… npm run verify:temp-list:prod`

**Primary production URL (example):** `https://sunspire-web-app.vercel.app`  
Replace with your canonical domain when testing.

---

## 1. Automated (tested in repo)

| Check | How to run | Expected |
|-------|------------|----------|
| API + core E2E matrix | `BASE_URL=https://sunspire-web-app.vercel.app npm run test:matrix:stable` | **38 passed** (Chromium) |
| Local full verify | `npm run dev` then `npm run verify:local` | API checks + matrix green |
| Health shape | Included in matrix (`tests/api/route-integration.spec.ts`) | 200 or 503, `services[]`, `timestamp` |
| Smoke (fast) | Included in matrix (`tests/e2e/smoke.spec.ts`) | Health, geo, estimate, landing, report, status, lead 400 |

---

## 2. HTTP checks (curl or browser)

| Endpoint | Method | Notes |
|----------|--------|--------|
| `/api/health` | GET | Prefer **`"ok": true`**; 503 acceptable if only optional/transient deps down (see smoke rules). |
| `/status` | GET | **200**; shows System Status from health. |
| `/api/estimate` | GET | Valid params → **200** + estimate object (see route-integration test). |
| `/api/geo/normalize` | GET | Known address → **200** or **503** if geocoding unset. |
| `/api/lead` | POST | Missing body → **400**; valid body → **200** or **500** if tenant missing in DB. |
| `/api/stripe/webhook` | POST | No signature → **400** (validated in tests). |

---

## 3. Maintenance surfaces (human)

| Method | URL / location | Frequency |
|--------|----------------|-----------|
| Status page | `GET /status` | Daily (auto-refresh 60s) |
| UptimeRobot | Monitor `GET /api/health` | Alerts → **support@getsunspire.com** |
| Sentry | sentry.io project alerts | Daily / on alert |
| Supabase dashboard | app.supabase.com | Weekly sanity (usage, logs) |
| Stripe dashboard | Webhooks + payments | Weekly |
| Vercel | Deployments + function logs | When health fails |

---

## 4. Owner-only (not fully automated)

- **Stripe:** Real `checkout.session.completed` → tenant row updated in **Supabase**, onboarding email.
- **Resend:** Inbound “new lead” email received for a tenant with `notification_email` set.
- **CRM webhook:** Your HTTPS endpoint receives `lead.created` payload when configured on tenant.

Document results in **docs/VERIFICATION-RESULTS.md** when you complete a pass.

---

## 5. Storage / legacy

- **Source of truth:** **Supabase** (`tenants`, `leads`, etc.). No runtime **Airtable** dependency.
- **Optional:** `scripts/import-airtable-to-supabase.mjs` for one-off historical CSV import only.
