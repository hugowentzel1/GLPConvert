# 🚀 Sunspire First-Customer Launch Checklist

## Pre-Launch Setup (5 minutes)

### 1. Environment Variables Check

```bash
# Required for production
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

### 2. Airtable Schema Verification

- [ ] `Tenants` table exists with fields: `Company Handle`, `Status`, `API Key`, `Owner Email`, `Domain`
- [ ] `Leads` table exists with fields: `Name`, `Email`, `Address`, `Company Handle`, `Created`
- [ ] `Users` table exists with fields: `Email`, `Name`, `Company Handle`
- [ ] `Links` table exists with fields: `Company Handle`, `Domain`, `Status`

### 3. Stripe Webhook Setup

- [ ] Webhook URL: `https://sunspire-web-app.vercel.app/api/stripe/webhook`
- [ ] Events: `checkout.session.completed`
- [ ] Test webhook with: `stripe events resend evt_xxx`

## Live Customer Activation (10 minutes)

### Step 1: Demo Link (2 minutes)

1. Send customer: `https://sunspire-web-app.vercel.app/?company=theircompany&demo=1`
2. Confirm they see:
   - ✅ "Demo for theircompany — Powered by Sunspire"
   - ✅ "Activate on Your Domain" button
   - ✅ Demo quota counter
   - ✅ Marketing sections (How It Works, Pricing, Partners)

### Step 2: Checkout Process (3 minutes)

1. Customer clicks "Activate on Your Domain"
2. Stripe checkout opens with $99/mo + $399 setup
3. Customer completes payment
4. **Verify webhook fires**: Check Airtable `Tenants` table for new row
5. **Verify tenant created**: Status = "paid", API key generated

### Step 3: Paid Link Delivery (2 minutes)

1. Send customer: `https://sunspire-web-app.vercel.app/?company=theircompany`
2. Confirm they see:
   - ✅ "Live for theircompany. Leads now save to your CRM."
   - ❌ NO "Activate" buttons
   - ❌ NO "Demo" watermarks
   - ❌ NO marketing sections
   - ✅ Clean, professional interface

### Step 4: Lead Capture Test (2 minutes)

1. Customer enters address on paid link
2. Generates solar report
3. Submits lead form
4. **Verify**: Success toast appears
5. **Verify**: Lead appears in Airtable `Leads` table

### Step 5: Custom Domain (Optional - 3 minutes)

1. Send customer: `https://sunspire-web-app.vercel.app/onboard/domain?company=theircompany`
2. Customer enters their domain (e.g., `solarcompany.com`)
3. System suggests: `quote.solarcompany.com`
4. Customer adds CNAME: `quote CNAME sunspire-web-app.vercel.app`
5. **Verify**: Domain status changes to "live" in Airtable
6. **Verify**: `https://quote.solarcompany.com` works with their branding

## Post-Launch Verification (2 minutes)

### Final Checks

- [ ] Customer can access their branded tool
- [ ] Leads are being captured and stored
- [ ] No demo elements visible on paid experience
- [ ] Custom domain (if used) is live and branded
- [ ] Stripe billing is active

## Emergency Contacts

- **Stripe Issues**: Check webhook logs in Stripe Dashboard
- **Domain Issues**: Check Vercel Domain settings
- **Airtable Issues**: Check API logs in Airtable
- **App Issues**: Check Vercel function logs

---

## 🎯 Success Metrics

- ✅ Customer sees clear demo vs paid difference
- ✅ Checkout → webhook → tenant creation works
- ✅ Paid experience is clean and professional
- ✅ Lead capture works end-to-end
- ✅ Custom domain (if used) is live and branded

**Total Time: ~10 minutes per customer activation**
