# Cold email readiness — GLPConvert audit

Run this before scaling outbound. Verify on **your production host** (e.g. `https://glp-convert.vercel.app`).

## 1. Core product path

| Check | How to verify |
|-------|----------------|
| **Demo home** | `/?company=TestCo&demo=1` loads; company name in header; primary CTA works. |
| **Branded intake** | `/intake?demo=1&company=TestCo&domain=example.com` — logo/color plausible; completes flow to lead/confirmation. |
| **Paid intake** | `/intake?company=<tenant_handle>` — no demo chrome; tenant config from API if configured. |
| **Logo auto-fill** | Omit `logo=` but set `domain=` → Clearbit logo loads (or Google favicon fallback in proxy). |

## 2. Stripe (checkout)

| Check | How to verify |
|-------|----------------|
| **Create session** | From demo home, CTA → `POST /api/stripe/create-checkout-session` returns 200 and redirect URL. |
| **Webhook** | Test `checkout.session.completed` → tenant/activation path updates (no 500). |
| **Success / dashboard** | After test payment, customer can open dashboard / activation instructions. |

## 3. Email & deliverability

| Check | Detail |
|-------|--------|
| **Transactional** | Lead notifications and system mail use **verified** domain (**Resend** `M000` in master todo). |
| **Cold outbound** | Separate domain + Instantly/Smartlead (or similar); SPF/DKIM/DMARC; unsubscribe where required. |
| **Reply path** | Inbox monitored for “interested” / “remove me”. |

## 4. Legal & trust

| Check | Detail |
|-------|--------|
| **Privacy / terms** | `/legal/privacy`, `/legal/terms` load; links in footer work. |
| **Copy** | No medical guarantees; educational framing (**`COMPLIANCE_NOTES_GLPCONVERT.md`**). |
| **Counsel** | **U024** — sign-off before claiming audits or HIPAA “compliance” in marketing. |

## 5. Tracking

| Check | Detail |
|-------|--------|
| **UTM** | Params preserved on intake (`glp-attribution`). |
| **Pixels** | Meta/GA only per **`docs/ATTRIBUTION_PIXELS_GLPCONVERT.md`** (consent + counsel). |

## 6. E2E (local)

```bash
npm run test:glp-visual:local
```

Optional full buyer journey (legacy solar-oriented nav may still exist on some routes):

```bash
npx playwright test tests/e2e-cold-email-customer-journey.spec.ts --project=chromium
```

## “Good to send?”

**Yes** when: demo links are correct per lead, Stripe test (or live) works, legal pages load, transactional email domain is verified, and you have a reply workflow.

**No** if: broken logos, checkout 500, missing privacy/terms, or unverified cold domain with no warm-up.
