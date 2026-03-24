# 🚀 Sunspire Complete Launch Runbook

## A) Product Spec - Demo vs Paid (SHIP THIS)

### Demo (Trial)

- **Upgrade/Activate CTA visible** (e.g., "Activate on Your Domain — 24 Hours")
- **Marketing blocks visible**: Pricing, "How It Works," salesy FAQs
- **Demo limits/locks**: preview quota + "Demo limit reached" message
- **Footer (demo)**: Show Demo / Pricing / Partners links + "Powered by Sunspire"
- **Label**: "Demo Mode" / "Demo for {Company} — Powered by Sunspire"
- **URLs**:
  - `/?company=Acme&demo=1`
  - Outreach slug: `/o/acme-xyz123` → redirects to `/?company=acme&demo=1`

### Paid (Live Client)

- **Remove ALL demo CTAs**: no "Activate/Upgrade," no demo banners/locks
- **Hide all marketing blocks**: no Pricing, no "How It Works," no sales FAQs
- **Paid-only UI**:
  - **Green bar**: "✅ Live for {CompanyName}. Leads now save to your CRM."
  - **Lead submit**: success toast/snackbar
- **Footer (paid)**:
  - Keep **NREL/Google** attribution
  - Keep **Terms / Privacy / Refund / Security**
  - Show **support@** and **billing@**
  - Hide Demo / Pricing / Partners links
  - Optional tiny "Powered by Sunspire" (plan-based toggle)
- **Leads**: write to Airtable (and CRM if keys set) under correct Tenant
- **URLs**:
  - Instant slug: `/?company=theirslug` (no `demo` param)
  - Custom domain (after CNAME): `https://quote.theirwebsite.com`

### Shared

- **Branding source**: Airtable Tenant (logo, colors, handle, domain)
- **Demo detection**: ONLY `demo=1|true`; `?company` alone is **not** demo
- **Security headers**: keep strict; allow embed only if a flag is on (CSP `frame-ancestors`)
- **Health**: `/healthz` → `{ ok: true, ts }`
- **(Optional)** Outreach click log: `/api/links/open` → Airtable `Links`

---

## B) Cold Email Engine - Ready Checklist (DO IN ORDER)

### Domains & Inboxes

1. **SPF/DKIM/DMARC** on _every_ sender domain (sunspiretool.com, getsunspire.com, usesunspire.com, sunspirequote.com)
   - SPF: `v=spf1 include:_spf.google.com ~all`
   - DMARC: start `p=none` → later `quarantine` (pct=50) → then `reject` (pct=100)
2. **Google Postmaster Tools**: add all sending domains; target spam <0.1%
3. **Warm-up**: each Workspace inbox ramps 10→20→40→70→120+/day

### Instantly (Sending)

4. **Tracking domain**: `link.sunspiredemo.com` CNAME → verified
5. **Compliance**: one-click List-Unsubscribe headers ON + visible body unsub + postal address
6. **Campaign**: custom fields `opening_line`, `benefit_line`, `outreach_link`
7. **Sequence** (plain text):
   - Email 1 (no link), Email 2 (no link, optional), **Email 3 (one clean link = `{{outreach_link}}`)**, Email 4 social proof, Email 5 breakup
   - Rotation ON; pause on reply ON

### Clay (Prospecting/Enrichment)

8. **Table: "Sunspire – Installers Feed"** (Apollo source: US installers/EPC, 2–200, Owner/VP/Head)
9. **Enrich columns**: `homepage_text` → `quote_page_url` → `quote_page_text` → `tech_stack` → **AI** `personal_opening_line` (18–28 words) → **AI** `benefit_line` → `company_slug` → `outreach_link` (`https://demo.sunspiredemo.com/o/{company_slug}` or direct `/?company=…&demo=1`)
10. **Auto-pull ON** (e.g., 1,000/day)

### Make/Zapier (Glue)

11. **Scenario**: Clay "Watch Rows" → ZeroBounce "Verify" → Instantly API "Add contacts to campaign" (map custom fields)
12. **(Optional)** Instantly events → Airtable `Leads` status updates

### App (Targets the Emails Will Hit)

13. **Outreach slug route** `/o/[slug]` → redirects to `/?company=…&demo=1`
14. **Demo vs Paid gating** as in Section A
15. **Playwright live suite** passes

### Legal & Polish

16. Footer pages live: Terms, Privacy, Refund, Security
17. Support@ / Billing@ verified and monitored

### Launch Plan

18. Pilot 200–300/day for 5–7 days
19. Scale to 1,000+/day by adding warmed inboxes/domains; A/B subject & first line; keep **one** link per email

---

## C) One-Hour Launch Runbook (DO THIS ONCE)

### 1. Finish DKIM on All Sender Domains (15 min)

```bash
# For each domain: sunspiretool.com, getsunspire.com, usesunspire.com, sunspirequote.com
# Add to Google Postmaster Tools
# Target spam <0.1%
```

### 2. Instantly Setup (10 min)

- Verify tracking domain: `link.sunspiredemo.com` CNAME → verified
- Confirm headers + visible unsubscribe
- Campaign fields + sequence loaded

### 3. Clay Test (10 min)

- Test a few rows
- Confirm AI lines + `outreach_link` generate correctly

### 4. Make Test (5 min)

- Run scenario once → test contact appears in Instantly with custom fields

### 5. App Deploy & Test (15 min)

```bash
# Deploy Cursor changes
git add . && git commit -m "Complete demo vs paid implementation + outreach system" && git push origin main

# Test endpoints
curl https://sunspire-web-app.vercel.app/healthz
# Should return: {"ok":true,"ts":"2024-01-01T00:00:00.000Z"}

# Test demo
open "https://sunspire-web-app.vercel.app/?company=testco&demo=1"
# Should show: "Activate on Your Domain", "How It Works", "Pricing"

# Test outreach slug
open "https://sunspire-web-app.vercel.app/o/testco-abc123"
# Should redirect to demo URL above

# Test paid
open "https://sunspire-web-app.vercel.app/?company=qa-acme"
# Should show: "Live for qa-acme", NO demo CTAs
```

### 6. Playwright Live Test (5 min)

```bash
export LIVE_BASE="https://sunspire-web-app.vercel.app"
export QA_TENANT_SLUG="qa-acme"
npx playwright test tests/e2e.live.sunspire.spec.ts --reporter=list
# All tests should pass
```

---

## D) Daily Ops Checklist (10–15 min)

### Morning Check

- [ ] **Google Postmaster**: spam <0.1%, reputation green/medium
- [ ] **Bounces** yesterday <2%
- [ ] **Instantly**: replies triaged; unsubscribes suppressed; volumes balanced across inboxes
- [ ] **Clay/Make**: rows flowing; no failed runs; custom fields filled
- [ ] **App**: `/healthz` OK; leads landing in Airtable

### Weekly Check

- [ ] **Domain reputation**: all sender domains green
- [ ] **Email deliverability**: inbox placement >90%
- [ ] **Lead quality**: conversion rate >2%
- [ ] **App performance**: response times <2s

---

## E) Emergency Procedures

### If Webhook Fails

1. Check Stripe webhook logs
2. Verify `STRIPE_WEBHOOK_SECRET` matches
3. Check Airtable API key and base ID
4. Test with: `node test-webhook.js`

### If Domain Doesn't Work

1. Check CNAME record: `quote.domain.com CNAME sunspire-web-app.vercel.app`
2. Wait 5-10 minutes for DNS propagation
3. Check Vercel domain settings
4. Test with: `node test-domain.js quote.domain.com`

### If Demo/Paid Mode Wrong

1. Check URL parameters (`demo=1` vs no demo param)
2. Verify `isDemoFromSearch` helper is working
3. Check browser console for errors
4. Run E2E tests to verify

### If Email Deliverability Drops

1. Check Google Postmaster Tools
2. Reduce sending volume by 50%
3. Review email content for spam triggers
4. Warm up new domains slowly

---

## F) Success Metrics

### Technical

- [ ] All 8 E2E tests passing
- [ ] `/healthz` returns 200
- [ ] Demo vs paid differentiation working
- [ ] Outreach slugs redirecting correctly
- [ ] Lead capture working end-to-end

### Business

- [ ] Email deliverability >90%
- [ ] Lead conversion rate >2%
- [ ] Customer activation time <10 minutes
- [ ] Support tickets <5% of activations

---

## G) Quick Reference

### URLs

- **Demo**: `/?company=testco&demo=1`
- **Outreach**: `/o/testco-abc123` → redirects to demo
- **Paid**: `/?company=qa-acme`
- **Health**: `/healthz`

### Environment Variables

```bash
AIRTABLE_API_KEY=key_xxx
AIRTABLE_BASE_ID=app_xxx
STRIPE_LIVE_SECRET_KEY=sk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
VERCEL_TOKEN=xxx
VERCEL_PROJECT_ID=xxx
LIVE_BASE=https://sunspire-web-app.vercel.app
QA_TENANT_SLUG=qa-acme
```

### Test Commands

```bash
# Run all E2E tests
npx playwright test tests/e2e.live.sunspire.spec.ts --reporter=list

# Test webhook
node test-webhook.js

# Test domain flow
node test-domain.js yourdomain.com
```

---

## 🎉 READY TO LAUNCH!

Once all checklist items are complete, you can start selling with confidence. The system handles:

1. **Demo Link** → Customer sees demo experience
2. **Checkout** → Stripe processes payment
3. **Webhook** → Tenant created in Airtable
4. **Paid Link** → Customer gets clean, professional tool
5. **Lead Capture** → Leads saved to Airtable
6. **Custom Domain** → Customer gets branded subdomain
7. **Outreach System** → Automated email sequences with tracking

**Total setup time: ~10 minutes per customer** 🚀
