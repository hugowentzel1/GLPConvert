# 🚀 Production Readiness Checklist

## ✅ Core Functionality (COMPLETE)

### Demo vs Paid Differentiation

- [x] Demo mode only with `demo=1` or `demo=true`
- [x] Company parameter does NOT imply demo
- [x] Paid mode shows "Live for {Tenant}" bar
- [x] Paid mode hides all demo CTAs and marketing
- [x] Paid mode shows success toast on lead submit
- [x] Navigation properly differentiates demo vs paid
- [x] Footer properly differentiates demo vs paid

### Stripe Integration

- [x] Checkout session creation
- [x] Webhook handling for `checkout.session.completed`
- [x] Tenant creation in Airtable
- [x] API key generation for tenants

### Custom Domain Onboarding

- [x] Domain attach API
- [x] Domain verify API
- [x] Domain status API
- [x] CNAME instructions for customers

### Lead Capture

- [x] Public lead API (`/api/lead`)
- [x] Server-to-server lead API (`/v1/ingest/lead`)
- [x] Airtable integration
- [x] Success toast in paid mode

### Security

- [x] CSP headers configured
- [x] X-Frame-Options set
- [x] Referrer-Policy configured
- [x] Optional embed control via `ALLOW_EMBED`

## 🔧 Pre-Launch Setup Required

### 1. Environment Variables

```bash
# Copy from ENV-CHECKLIST.md and verify all are set
AIRTABLE_API_KEY=key_xxx
AIRTABLE_BASE_ID=app_xxx
STRIPE_LIVE_SECRET_KEY=sk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
STRIPE_PRICE_SETUP_399=price_xxx
STRIPE_PRICE_MONTHLY_99=price_xxx
VERCEL_TOKEN=xxx
VERCEL_PROJECT_ID=xxx
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=xxx
NREL_API_KEY=xxx
EIA_API_KEY=xxx
NEXT_PUBLIC_APP_URL=https://sunspire-web-app.vercel.app
```

### 2. Airtable Schema

- [ ] Create `Tenants` table with required fields
- [ ] Create `Leads` table with required fields
- [ ] Create `Users` table with required fields
- [ ] Create `Links` table with required fields
- [ ] Create test tenant: `qa-acme` with `demo=false`

### 3. Stripe Setup

- [ ] Create live price IDs for $99 setup and $99 monthly
- [ ] Configure webhook endpoint: `https://sunspire-web-app.vercel.app/api/stripe/webhook`
- [ ] Test webhook with: `node test-webhook.js`

### 4. Domain Testing

- [ ] Test domain flow with: `node test-domain.js yourdomain.com`
- [ ] Verify CNAME instructions work
- [ ] Confirm domain status changes to "live"

## 🧪 Testing Commands

### Run All E2E Tests

```bash
export LIVE_BASE="https://sunspire-web-app.vercel.app"
npx playwright test tests/e2e.sunspire.spec.ts --reporter=list
```

### Test Webhook

```bash
node test-webhook.js
```

### Test Domain Flow

```bash
node test-domain.js yourdomain.com
```

### Test Local Development

```bash
npm run dev
# Visit: http://localhost:3000/?company=testco&demo=1 (demo)
# Visit: http://localhost:3000/?company=testco (paid)
```

## 🎯 Success Criteria

### Demo Mode (`?company=testco&demo=1`)

- [x] Shows "Demo for testco — Powered by Sunspire"
- [x] Shows "Activate on Your Domain" button
- [x] Shows demo quota counter
- [x] Shows marketing sections (How It Works, Pricing, Partners)
- [x] Shows "Private demo" text
- [x] Shows unlock buttons and blur layers

### Paid Mode (`?company=testco`)

- [x] Shows "Live for testco. Leads now save to your CRM."
- [x] Hides all demo CTAs and marketing
- [x] Hides "Private demo" text
- [x] Hides unlock buttons and blur layers
- [x] Shows success toast on lead submit
- [x] Clean, professional interface

### Custom Domain (`quote.customer.com`)

- [x] Same behavior as paid mode
- [x] Customer branding applied
- [x] SSL certificate working
- [x] No demo elements visible

## 🚨 Emergency Procedures

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
2. Verify `useIsDemo` hook is working
3. Check browser console for errors
4. Run E2E tests to verify

## 📞 Support Contacts

- **Stripe Issues**: Stripe Dashboard > Webhooks
- **Domain Issues**: Vercel Dashboard > Domains
- **Airtable Issues**: Airtable API Documentation
- **App Issues**: Vercel Function Logs

---

## 🎉 Ready to Launch!

Once all checklist items are complete, you can start selling with confidence. The system handles:

1. **Demo Link** → Customer sees demo experience
2. **Checkout** → Stripe processes payment
3. **Webhook** → Tenant created in Airtable
4. **Paid Link** → Customer gets clean, professional tool
5. **Lead Capture** → Leads saved to Airtable
6. **Custom Domain** → Customer gets branded subdomain

**Total setup time: ~10 minutes per customer** 🚀
