# Complete Stripe Checkout Flow

## Overview
When a customer purchases Sunspire, here's the complete end-to-end flow:

## Step-by-Step Flow

### 1. User Clicks CTA
- Location: Homepage, Report page, Pricing page
- Button: "Launch Your Branded Version Now"
- Triggers: `POST /api/stripe/create-checkout-session`

### 2. Checkout Session Created
**API:** `/api/stripe/create-checkout-session/route.ts`

**Request:**
```json
{
  "company": "SolarCorp",
  "plan": "starter",
  "email": "contact@solarcorp.com",
  "utm_source": "google",
  "utm_campaign": "solar2025",
  "token": "unique-tracking-token"
}
```

**Stripe Session:**
- Mode: `subscription`
- Line Items:
  - $99/month (STRIPE_PRICE_STARTER)
  - $399 setup fee (STRIPE_PRICE_SETUP_399)
- Metadata: company, plan, UTM params
- Success URL: `/activate?session_id={CHECKOUT_SESSION_ID}&company=SolarCorp`
- Cancel URL: `/?canceled=1&company=SolarCorp`

**Response:**
```json
{
  "url": "https://checkout.stripe.com/c/pay/cs_test_..."
}
```

### 3. User Pays on Stripe
- Redirected to Stripe checkout page
- Enters credit card details  
- Stripe processes payment
- Creates subscription

### 4. Stripe Webhook Fires
**API:** `/api/stripe/webhook/route.ts`

**Event:** `checkout.session.completed`

**Webhook Handler:**
```typescript
handleCheckoutCompleted(session) {
  // 1. Extract metadata
  const { company, plan, utm_source, utm_campaign } = session.metadata;
  
  // 2. Generate API key (48 characters)
  const apiKey = generateApiKey();
  
  // 3. Create tenant in Airtable
  await upsertTenantByHandle(company, {
    "Company Handle": company,
    "Plan": plan,
    "API Key": apiKey,
    "Domain / Login URL": `https://${company}.out.sunspire.app`,
    "Capture URL": `${baseUrl}/v1/ingest/lead`,
    "Payment Status": "Paid",
    "Stripe Customer ID": session.customer,
    "Last Payment": new Date().toISOString(),
    "UTM Source": utm_source,
    "UTM Campaign": utm_campaign
  });
  
  // 4. Set up custom domain (quote.yourcompany.com)
  const companyWebsite = extractCompanyWebsite(company);
  if (companyWebsite) {
    const root = getRootDomain(companyWebsite); // "solarcorp.com"
    const quoteDomain = `quote.${root}`; // "quote.solarcorp.com"
    await setRequestedDomain(company, quoteDomain);
    await setTenantDomainStatus(company, "proposed");
  }
  
  // 5. Link customer as owner
  if (session.customer_email) {
    await createOrLinkUserOwner(tenantId, session.customer_email);
  }
}
```

### 5. User Redirected to Activation
**URL:** `/activate?session_id=cs_xxx&company=SolarCorp`

**Activation Page Shows:**

**Tab 1: Instant URL**
```
Your calculator is live at:
https://solarcorp.out.sunspire.app

Share this URL immediately with customers!
```

**Tab 2: Custom Domain**
```
Set up your professional domain:
quote.solarcorp.com

Instructions:
1. Add CNAME record in your DNS
2. Point to: vercel-dns.com
3. Verify domain
```

**Tab 3: Embed Code**
```html
<iframe 
  src="https://solarcorp.out.sunspire.app/embed" 
  width="100%" 
  height="600">
</iframe>
```

### 6. Tenant is Now Live!

**What the Customer Gets:**
✅ Branded solar calculator
✅ Unique URL: `https://company.out.sunspire.app`
✅ API key for lead capture
✅ Airtable workspace for lead management
✅ Custom domain option: `quote.yourcompany.com`
✅ Embed code for their website
✅ Active subscription ($99/month + $399 setup)

**Backend Setup Complete:**
✅ Tenant record in Airtable
✅ User linked as owner
✅ Domain provisioning started
✅ Lead capture endpoint ready
✅ Subscription active in Stripe

## Airtable Data Structure

**Tenants Table:**
```
Company Handle: "solarcorp"
Plan: "Starter"
API Key: "abc123...xyz" (48 chars)
Domain / Login URL: "https://solarcorp.out.sunspire.app"
Capture URL: "https://sunspire.app/v1/ingest/lead"
Payment Status: "Paid"
Stripe Customer ID: "cus_..."
Last Payment: "2025-10-21T..."
Subscription ID: "sub_..."
Requested Domain: "quote.solarcorp.com"
Domain Status: "proposed"
UTM Source: "google"
UTM Campaign: "solar2025"
```

**Users Table:**
```
Email: "contact@solarcorp.com"
Role: "Owner"
Tenant: [link to Tenant record]
```

## Ongoing Subscription Management

**Monthly Billing:**
- Stripe charges $99/month automatically
- Webhook: `invoice.payment_succeeded` → updates "Last Payment"
- Webhook: `invoice.payment_failed` → marks tenant at risk

**Subscription Changes:**
- Webhook: `customer.subscription.updated` → updates status
- Webhook: `customer.subscription.deleted` → marks "Canceled"

**Customer Portal:**
- User can manage billing at `/api/stripe/create-portal-session`
- Can update payment method, cancel subscription, etc.

## Enterprise-Ready Features

✅ **Automatic Tax:** Stripe calculates sales tax automatically
✅ **Promotion Codes:** Customers can apply discount codes
✅ **Idempotency:** Webhooks processed only once (event deduplication)
✅ **Rate Limiting:** Checkout endpoint protected from abuse
✅ **Metadata Tracking:** Full UTM attribution preserved
✅ **Email Verification:** Customer email captured and verified
✅ **Subscription Management:** Full lifecycle handled
✅ **Domain Provisioning:** Automatic custom domain setup
✅ **Lead Capture:** API endpoint ready immediately
✅ **Multi-tenant Isolation:** Each customer gets isolated workspace

---

**This is a production-ready, enterprise-grade payment and provisioning system!**
