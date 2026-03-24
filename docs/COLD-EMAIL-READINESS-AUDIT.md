# Cold Email Readiness – Exhaustive Audit

Use this checklist before starting cold email campaigns. Every item should be verified on **live** (sunspire-web-app.vercel.app or your production domain).

---

## 1. Google APIs (each must work)

| API | Where used | Env / Key | How to verify |
|-----|------------|-----------|----------------|
| **Geocoding API** | Server: `/api/geo/normalize`, `/api/health` | `GOOGLE_GEOCODING_API_KEY` (unrestricted key) | `curl "https://YOUR_DOMAIN/api/geo/normalize?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA"` → 200, `lat`/`lng` in JSON. Health check shows `google_geocoding: ok`. |
| **Places API (Autocomplete)** | Client: address input on demo/landing | `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` (can be HTTP referrer restricted) | Open `/?company=Test&demo=1`, type "1600 Amphitheatre" → suggestions appear; "Powered by Google" visible. |
| **Places API (Place Details)** | Client: when user selects a suggestion | Same as above | Select an address from autocomplete → form fills; report/estimate loads. |

**Common failure:** Server-side Geocoding returns `REQUEST_DENIED` if:
- `GOOGLE_GEOCODING_API_KEY` is missing or wrong, or
- Key has HTTP referrer restriction (use unrestricted "API key 1" for server).

Run: `node scripts/test-geocoding-key.mjs YOUR_KEY` to verify key with Google directly.

---

## 2. Estimation & Shading (industry-standard)

| Check | Where | How to verify |
|-------|--------|----------------|
| **NREL PVWatts** | `/api/estimate`, report page | Estimate returns `dataSource` containing "NREL" or "PVWatts"; report shows NREL/PVWatts® attribution. |
| **EIA / utility rates** | `/api/estimate` (getRate), report | Different states return different `utilityRate`; report shows utility/tariff. |
| **Shading analysis** | `lib/estimate.ts`, report UI | Estimate response includes `shadingAnalysis: { method, accuracy, annualShadingLoss, shadingFactor }`. Report page shows "Shading Analysis" and "Annual Shading Loss %". |
| **Location-specific production** | `/api/estimate` | Same system size, different lat/lng → different `annualProductionKWh` (e.g. LA vs Phoenix). |

E2E: `tests/e2e-all-apis-estimations-visual.spec.ts` covers estimate + shading + report NREL/shading.

---

## 3. Stripe (checkout & post-purchase)

| Check | Where | How to verify |
|-------|--------|----------------|
| **Create Checkout Session** | POST `/api/stripe/create-checkout-session` | From demo page, click CTA that starts checkout → request returns 200 and redirect to Stripe. |
| **Webhook** | `/api/stripe/webhook` | Stripe dashboard → send test `checkout.session.completed` → tenant/activation updated (no 500). |
| **Activation / success** | `/activate`, `/success` | After test checkout, redirect to success/activate; customer sees "Instant URL" or dashboard link. |
| **Customer dashboard** | `/c/[companyHandle]` | Paid customer can open `/c/their-handle` and see Instant URL, Visit Site, embed. |

E2E: same spec tests checkout-session 200 and post-buy dashboard visibility.

---

## 4. Cold email–specific (links, tracking, legal)

| Check | Detail |
|-------|--------|
| **Demo link** | Links must use `?company=ProspectName&demo=1` (and optional `domain=company.com` for logo). No broken query params. |
| **UTM (optional)** | If you use UTM (e.g. `utm_source=email&utm_campaign=...`), ensure app does not strip them and analytics (if any) receive them. |
| **Unsubscribe** | If email includes marketing content, include unsubscribe link; Resend/webhook unsubscribe must be wired if you use it. |
| **Privacy policy** | Link in footer (e.g. `/privacy` or `/legal/privacy`) must work and state data use, retention, contact. |
| **Terms** | Link (e.g. `/terms` or `/legal/terms`) must work. |
| **Reply handling** | If you encourage replies, ensure inbox is monitored and/or auto-responder is set if desired. |
| **Deliverability** | Domain SPF/DKIM/DMARC configured (Resend or your SMTP); avoid spammy copy; warm up if new domain. |
| **No broken assets** | All images (logos, favicon) load; no mixed content (HTTP on HTTPS page). |
| **Mobile** | Demo and report pages usable on mobile (forms, CTAs, no horizontal scroll). |

---

## 5. E2E and manual checklist before first send

1. **Run E2E against live**  
   `BASE_URL=https://sunspire-web-app.vercel.app npx playwright test tests/e2e-all-apis-estimations-visual.spec.ts --project=chromium --workers=1`  
   All 10 tests should pass (Health, Geocoding, Estimate, Estimations differ, Autocomplete, Report x2, Stripe checkout, Dashboard, Lead API).

2. **Manual spot checks on live**  
   - Open `/?company=TestCo&demo=1` → type address → get suggestions → get report.  
   - Open report → see NREL, shading, numbers.  
   - Click CTA → Stripe checkout (test mode) → complete → land on success/activate/dashboard.

3. **Env on Vercel**  
   - `GOOGLE_GEOCODING_API_KEY` set (unrestricted key).  
   - Redeploy after adding/changing env vars so the new build uses them.

4. **Cold email copy**  
   - One clear CTA (e.g. "Get your free solar estimate").  
   - Link to demo URL with `company` and `demo=1`.  
   - Privacy/terms linked if required in your jurisdiction.

---

## 6. “Am I good to start cold emailing?”

**Yes, when:**

- All Google APIs work (Geocoding 200 on server, Places autocomplete and details on client).
- Estimation works and is location-specific; shading is present in API and report (industry-standard).
- Stripe checkout returns 200 and post-purchase flow (activate/dashboard) works.
- E2E suite passes against live.
- Privacy/terms and unsubscribe (if needed) are in place and links work.
- You’ve done at least one full manual pass: demo link → address → report → checkout (test) → dashboard.

**Defer until fixed:**

- Geocoding or Health failing (fix key/redeploy).
- Stripe 500 on checkout (fix keys/webhook).
- Report or estimate missing NREL/shading (fix data/UI).
- Broken links or missing legal pages for your use case.

This doc is the single source for the exhaustive audit; update as you add new APIs or flows.
