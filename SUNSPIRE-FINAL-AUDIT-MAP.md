# 🔍 SUNSPIRE FINAL AUDIT MAP

**Generated:** 2025-01-XX  
**Framework:** Next.js 14.0.0 (App Router)  
**Deployment:** Vercel  
**Node Version:** 20.x

---

## 1) SYSTEM OVERVIEW

### Framework & Routing
- **Framework:** Next.js 14.0.0 with App Router
- **Deployment:** Vercel (auto-deploys on `main` branch push)
- **Package Manager:** npm (package.json shows npm scripts)
- **TypeScript:** Yes (`.ts` and `.tsx` files throughout)

### Core External Systems Detected
- ✅ **Stripe** - Payment processing, subscriptions, webhooks
- ✅ **Airtable** - Primary database (Tenants, Leads, Users, Links tables)
- ✅ **NREL PVWatts v8** - Solar production modeling API
- ✅ **EIA (Energy Information Administration)** - Utility rate data API
- ✅ **OpenEI URDB** - Alternative utility rate database
- ✅ **Google Maps** - Address autocomplete, geocoding
- ✅ **Nodemailer (SMTP)** - Transactional email (Gmail SMTP fallback)
- ⚠️ **Zapier** - Mentioned in docs but NOT FOUND in code (TODO comments only)
- ✅ **Vercel KV** - Webhook idempotency (Redis-compatible)
- ❌ **Resend/SendGrid/Postmark** - NOT FOUND (using SMTP directly)

---

## 2) ENVIRONMENT VARIABLES MAP (NAMES ONLY)

### Stripe
- `STRIPE_SECRET_KEY` / `STRIPE_LIVE_SECRET_KEY` - Referenced in: `src/lib/stripe.ts:5`
- `STRIPE_PUBLISHABLE_KEY` - Referenced in: `src/config/env.ts:26`
- `STRIPE_WEBHOOK_SECRET` - Referenced in: `app/api/stripe/webhook/route.ts:45`, `src/config/env.ts:27`
- `STRIPE_PRICE_STARTER` / `STRIPE_PRICE_MONTHLY` / `STRIPE_PRICE_MONTHLY_99` - Referenced in: `app/api/stripe/create-checkout-session/route.ts:28-30`
- `STRIPE_PRICE_SETUP_399` - Referenced in: `app/api/stripe/create-checkout-session/route.ts:32`

### Airtable
- `AIRTABLE_API_KEY` - Referenced in: `src/config/env.ts:4`, `src/lib/airtable.ts:10`, `app/api/lead/route.ts:77`
- `AIRTABLE_BASE_ID` - Referenced in: `src/config/env.ts:5`, `src/lib/airtable.ts:10`, `app/api/lead/route.ts:74`

### Email (SMTP)
- `SMTP_HOST` - Referenced in: `lib/email-service.ts:10` (defaults to `smtp.gmail.com`)
- `SMTP_PORT` - Referenced in: `lib/email-service.ts:11` (defaults to `587`)
- `SMTP_USER` - Referenced in: `lib/email-service.ts:14`
- `SMTP_PASS` - Referenced in: `lib/email-service.ts:15`
- `SMTP_FROM` - Referenced in: `lib/email-service.ts:249` (defaults to `"Sunspire" <noreply@sunspire.app>`)

### Google Maps
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` - Referenced in: `src/config/env.ts:7`

### Solar APIs
- `NREL_API_KEY` - Referenced in: `src/config/env.ts:8`, `lib/pvwatts.ts:106`, `src/services/pvwatts.ts:39`
- `EIA_API_KEY` - Referenced in: `src/config/env.ts:9`, `lib/rates.ts:84`
- `OPENEI_API_KEY` - Referenced in: `app/api/health/route.ts:9`, `lib/urdb.ts:2`

### Admin/Auth
- `ADMIN_TOKEN` - Referenced in: `src/config/env.ts:12`, `app/api/admin/create-tenant/route.ts:19`, `src/server/auth/jwt.ts:15`

### Vercel
- `VERCEL_TOKEN` - Referenced in: `src/config/env.ts:32` (optional)
- `VERCEL_PROJECT_ID` - Referenced in: `src/config/env.ts:33` (optional)
- `KV_REST_API_URL` - Referenced in: `lib/webhook-idempotency.ts:18` (for Vercel KV)
- `KV_REST_API_TOKEN` - Referenced in: `lib/webhook-idempotency.ts:18` (for Vercel KV)

### App URLs
- `NEXT_PUBLIC_APP_URL` - Referenced in: `src/config/env.ts:13`, `app/api/stripe/create-checkout-session/route.ts:71`, `app/api/stripe/webhook/route.ts:139`

### Solar Calculation Defaults (Optional)
- `DEFAULT_RATE_ESCALATION` - Referenced in: `src/config/env.ts:16` (default: 0.025)
- `DEFAULT_OANDM_ESCALATION` - Referenced in: `src/config/env.ts:17` (default: 0.03)
- `DISCOUNT_RATE` - Referenced in: `src/config/env.ts:18` (default: 0.08)
- `OANDM_PER_KW_YEAR` - Referenced in: `src/config/env.ts:19` (default: 15)
- `DEFAULT_DEGRADATION_PCT` - Referenced in: `src/config/env.ts:20` (default: 0.5)
- `DEFAULT_LOSSES_PCT` - Referenced in: `src/config/env.ts:21` (default: 14)
- `DEFAULT_COST_PER_WATT` - Referenced in: `src/config/env.ts:22` (default: 3.5)

### ⚠️ ENV VAR ISSUES
- **UNUSED:** `OPENEI_API_KEY` appears in health check but `lib/urdb.ts` uses it directly from `process.env` (not validated in env.ts)
- **MISSING VALIDATION:** `SMTP_*` vars not validated in `src/config/env.ts` (optional, defaults provided)
- **KV VARS:** `KV_REST_API_URL` and `KV_REST_API_TOKEN` not in env schema but used in `lib/webhook-idempotency.ts`

---

## 3) STRIPE BILLING MAP (CRITICAL)

### A) Checkout Session Creation

**Route:** `POST /api/stripe/create-checkout-session`  
**File:** `app/api/stripe/create-checkout-session/route.ts`  
**Function:** `POST(req: NextRequest)` (lines 14-119)

**Products/Prices:**
- Monthly subscription: `STRIPE_PRICE_STARTER` || `STRIPE_PRICE_MONTHLY` || `STRIPE_PRICE_MONTHLY_99` (line 28-30)
- Setup fee: `STRIPE_PRICE_SETUP_399` (line 32)
- **CRITICAL:** Falls back through multiple env vars for monthly price (could silently use wrong price)

**Metadata Attached:**
- `token` - Tracking token (line 96)
- `company` - Company name (line 97)
- `tenant_handle` - Company handle (line 98)
- `plan` - Plan type (line 99)
- `utm_source` - UTM source (line 100)
- `utm_campaign` - UTM campaign (line 101)
- Subscription metadata (lines 88-93): same fields

**Redirects:**
- Success: `${base}/c/${company}?session_id={CHECKOUT_SESSION_ID}&demo=1` (line 103)
- Cancel: `${base}/?canceled=1&company=${company}` or `cancel_url` param (line 104)
- **ISSUE:** Success URL includes `demo=1` which may confuse users

**Rate Limiting:**
- Uses `checkRateLimit(clientIP, "stripe-checkout")` from `src/lib/ratelimit.ts` (line 17)
- Returns 429 if rate limited

### B) Webhook Handler

**Route:** `POST /api/stripe/webhook`  
**File:** `app/api/stripe/webhook/route.ts`  
**Function:** `POST(req: NextRequest)` (lines 21-110)

**Signature Verification:**
- Location: Lines 42-46
- Uses: `stripe.webhooks.constructEvent(body, signature, ENV.STRIPE_WEBHOOK_SECRET!)`
- **CRITICAL:** Returns 400 if signature missing or invalid (lines 29-34, 48-49)

**Events Handled:**
1. `checkout.session.completed` → `handleCheckoutCompleted()` (lines 56-60)
2. `payment_intent.succeeded` → `handlePaymentSucceeded()` (lines 62-66)
3. `invoice.payment_succeeded` → `handleInvoicePaymentSucceeded()` (lines 68-72)
4. `invoice.payment_failed` → `handleInvoicePaymentFailed()` (lines 74-76)
5. `customer.subscription.updated` → `handleSubscriptionUpdated()` (lines 78-82)
6. `customer.subscription.deleted` → `handleSubscriptionDeleted()` (lines 84-88)

**Side Effects per Event:**

**`checkout.session.completed` (handleCheckoutCompleted, lines 112-238):**
- Generates API key (line 138)
- Creates/updates tenant in Airtable via `upsertTenantByHandle()` (lines 155-167)
- Sets up custom domain if company website available (lines 172-184)
- Links payer as owner via `createOrLinkUserOwner()` (lines 187-193)
- Sends onboarding email via `sendOnboardingEmail()` (lines 198-220)
- **CRITICAL:** If Airtable write fails, tenant not provisioned but payment succeeded
- **CRITICAL:** If email send fails, user gets no onboarding info

**`customer.subscription.updated` (handleSubscriptionUpdated, lines 257-268):**
- Calls `updateTenantSubscriptionStatus()` (line 267)
- **CRITICAL:** Function has TODO comment - not fully implemented (line 286)

**`customer.subscription.deleted` (handleSubscriptionDeleted, lines 270-273):**
- Calls `updateTenantSubscriptionStatus()` with "Canceled" status
- **CRITICAL:** Same TODO issue as above

**Idempotency Strategy:**
- Uses `withIdempotency(eventId, handler)` wrapper (line 54)
- Implementation: `lib/webhook-idempotency.ts`
- Storage: Vercel KV (Redis) in production, in-memory fallback for local dev
- Key format: `webhook:processed:${eventId}`
- TTL: 24 hours (86400 seconds)
- **CRITICAL:** If KV unavailable in production, falls back to in-memory (NOT distributed-safe)
- **CRITICAL:** Fails open (returns false if check fails) - could process duplicates

### C) Subscription Lifecycle

**Paid Access Determination:**
- **NOT FOUND:** No middleware or server-side check for "paid access" found
- Demo mode detection: `src/lib/isDemo.ts` - checks URL param `demo=1` or `demo=true`
- **CRITICAL:** No server-side enforcement that tenant exists in Airtable with "Paid" status
- **CRITICAL:** Access appears to be URL-parameter based only (client-side)

**Cancellation Handling:**
- `customer.subscription.deleted` event updates Airtable status to "Canceled"
- **CRITICAL:** `updateTenantSubscriptionStatus()` not fully implemented (line 286 in webhook route)

**Payment Failure Handling:**
- `invoice.payment_failed` event logged but no action taken (lines 251-255)
- **CRITICAL:** No Airtable status update on payment failure
- **CRITICAL:** User may retain access even if payment fails

**Webhook Failure Scenario:**
- If webhook returns 500, Stripe retries automatically
- If webhook fails after 3 days, Stripe stops retrying
- **CRITICAL:** User paid but tenant never provisioned - no manual recovery process found

---

## 4) AIRTABLE MAP (CRITICAL)

### Base Usage

**Base ID:** `AIRTABLE_BASE_ID` (env var)  
**Initialization:** `src/lib/airtable.ts:8-26`  
**Tables Used:**
1. `"Leads"` - Lead records (line 30)
2. `"Tenants"` - Tenant/company records (line 31)
3. `"Users"` - User accounts (line 32)
4. `"Links"` - Tracking links (line 33)

### Fields Written/Read

**Tenants Table (`TENANT_FIELDS`, lines 60-78):**
- `"Company Handle"` - Primary identifier (used in `upsertTenantByHandle`)
- `"Plan"` - Subscription plan
- `"Domain / Login URL"` - Tenant dashboard URL
- `"Brand Colors"` - Custom branding
- `"Logo URL"` - Company logo
- `"CRM Keys"` - CRM integration keys
- `"API Key"` - Generated API key for tenant
- `"Capture URL"` - Lead ingestion endpoint
- `"Users"` - Linked user records
- `"Payment Status"` - "Paid", "Canceled", etc.
- `"Stripe Customer ID"` - Stripe customer identifier
- `"Last Payment"` - ISO timestamp
- `"Subscription ID"` - Stripe subscription ID
- `"Current Period End"` - Subscription period end
- `"Requested Domain"` - Custom domain request
- `"Domain Status"` - Domain verification status
- `"Domain"` - Actual domain

**Leads Table (`LEAD_FIELDS`, lines 37-58):**
- `"Name"`, `"Email"`, `"Company"`, `"Tenant"` (link to Tenants)
- `"Demo URL"`, `"Campaign ID"`, `"Status"`, `"Notes"`
- `"Last Activity"`, `"Street"`, `"City"`, `"State"`, `"Postal Code"`, `"Country"`
- `"Formatted Address"`, `"Place ID"`, `"Latitude"`, `"Longitude"`
- `"Utility Rate ($/kWh)"`, `"Token"`

**Users Table (`USER_FIELDS`, lines 80-84):**
- `"Email"`, `"Role"`, `"Tenant"` (link to Tenants)

**Links Table (`LINK_FIELDS`, lines 86-94):**
- `"Token"`, `"TargetParams"`, `"Tenant"`, `"Clicks"`, `"Status"`, `"LastClickedAt"`, `"ProspectEmail"`

### De-duplication Strategy

**Tenants:**
- `upsertTenantByHandle()` (lines 212-232): Finds by "Company Handle", updates if exists, creates if not
- **CRITICAL:** No unique constraint enforcement - relies on application logic

**Leads:**
- `upsertLeadByEmailAndTenant()` (lines 299-335): Finds by email + tenant combo, updates if exists
- Uses Airtable formula: `AND({Email} = '${email}', {Tenant} = '${tenantId}')` (line 309)
- **CRITICAL:** Race condition possible if two leads with same email arrive simultaneously

**Users:**
- `createOrLinkUserOwner()` (lines 234-266): Checks if user exists by email + tenant, creates if not
- **CRITICAL:** Same race condition risk as leads

### Rate Limiting / Retry / Error Handling

- **NOT FOUND:** No explicit rate limiting for Airtable API calls
- **NOT FOUND:** No retry logic in Airtable client initialization
- Errors logged via `logger.error()` (lines 229, 263, 294, 346)
- **CRITICAL:** Airtable API has rate limits (5 requests/second) - no throttling implemented

### Source of Truth

- **Airtable IS the source of truth** for tenant data
- Canonical IDs: Airtable record IDs (returned as `tenant.id`, `lead.id`, etc.)
- **CRITICAL:** No database backup strategy found in code
- **CRITICAL:** No migration/versioning system for schema changes

---

## 5) ZAPIER MAP (CRITICAL if used)

### Status: ⚠️ NOT IMPLEMENTED

**References Found:**
- `app/support/page.tsx:88` - Mentions Zapier in FAQ
- `app/docs/crm/page.tsx:58-60` - Documentation mentions Zapier
- `app/api/demo-event/route.ts:7` - TODO comment: "Forward to Airtable/Zapier for follow-up"
- `NOTION-CHECKLIST.md:57` - Checklist item: "Make/Zapier scenario configured"
- `COMPLETE-LAUNCH-RUNBOOK.md:69` - Mentions "Make/Zapier (Glue)"

**Conclusion:** Zapier integration is **planned but not implemented**. No webhook URLs, payload schemas, or trigger conditions found in code.

**Recommendation:** Remove Zapier mentions from public-facing docs OR implement basic webhook forwarding.

---

## 6) EMAIL / RESEND / TRANSACTIONAL EMAIL MAP

### Provider: Nodemailer (SMTP)

**Implementation:** `lib/email-service.ts`  
**Transporter:** Gmail SMTP (lines 9-17)  
**From Address:** `SMTP_FROM` env var or defaults to `"Sunspire" <noreply@sunspire.app>`

### Email Types

**1. Onboarding Email (Purchase Confirmation)**
- Function: `sendOnboardingEmail()` (lines 30-262)
- Triggered: `app/api/stripe/webhook/route.ts:211` (after checkout.session.completed)
- Contains: Instant URL, embed code, custom domain, API key, dashboard link, magic link
- **CRITICAL:** If email fails, user has no way to access their account (no fallback)

**2. Magic Link Generation**
- Function: `generateMagicLink()` (lines 265-272)
- Purpose: Passwordless dashboard access
- Token: Base64-encoded JSON with email, company, timestamp
- Expiration: 7 days (line 281)
- **CRITICAL:** Token is not cryptographically signed - could be forged

### Suppression / Bounce Handling

- **NOT FOUND:** No bounce handling
- **NOT FOUND:** No unsubscribe mechanism for transactional emails
- **NOT FOUND:** No email queue/retry system

### Failure Handling

- Errors logged to console (line 259)
- Returns `{ success: false, error }` but webhook continues
- **CRITICAL:** Silent failure - user pays but gets no email

---

## 7) AUTH / ADMIN / SECURITY MAP

### Admin Protection

**Route:** `POST /api/admin/create-tenant`  
**File:** `app/api/admin/create-tenant/route.ts`  
**Protection:** Header check `x-admin-token` must match `ADMIN_TOKEN` env var (lines 18-24)
- **CRITICAL:** Token compared directly (no timing-safe comparison)
- **CRITICAL:** No rate limiting on admin endpoint

### Public Endpoints That Should Be Protected

**Potentially Exposed:**
- `GET /api/health` - Returns env var presence (not values) - OK for public
- `GET /api/test/last-lead` - Returns last lead for tenant - **SHOULD BE PROTECTED** (no auth found)
- `POST /api/admin/create-tenant` - Protected by admin token ✅

### CORS Policy

- **NOT FOUND:** No explicit CORS configuration in codebase
- Next.js default CORS applies (same-origin only for API routes)

### Input Validation / Sanitization

- **Zod schemas used:**
  - `app/api/admin/create-tenant/route.ts:7-13` - `createTenantSchema`
  - `src/config/env.ts:3-34` - `envSchema` for environment variables
- **NOT FOUND:** No input sanitization for XSS prevention in API routes
- **NOT FOUND:** No SQL injection protection (N/A - using Airtable, not SQL)

### Rate Limiting

**Implemented:**
- `src/lib/ratelimit.ts` - In-memory rate limiter
- Used in: `/api/lead`, `/api/stripe/create-checkout-session`, `/api/leads/upsert`
- Limits: 10 requests per 5 minutes for demo, 100 for paid (lines 36, 41)
- **CRITICAL:** In-memory only - resets on serverless function restart
- **CRITICAL:** No distributed rate limiting (Vercel KV not used for rate limits)

**Also Found:**
- `lib/rate-limit.ts` - Separate implementation (1000 requests/hour per IP)
- Used in: `/api/estimate` (line 96)
- **ISSUE:** Two different rate limiting systems

### Logging

- Uses `src/lib/logger.ts` (referenced but not read)
- Console.log/error throughout codebase
- **CRITICAL:** PII may be logged (emails, addresses in console.log statements)
- **CRITICAL:** No structured logging (JSON format)
- **CRITICAL:** No log aggregation service configured

---

## 8) DEMO VS PAID GATING MAP

### Demo Mode Detection

**Implementation:** `src/lib/isDemo.ts`  
**Logic:** `demo=1` or `demo=true` in URL search params (lines 9-10)  
**Used In:**
- `app/page.tsx:105` - Redirects to `/paid` if not demo and company present
- `app/report/page.tsx:514` - Sets demo mode state
- `components/CookieConsent.tsx:19` - Cookie banner logic

**CRITICAL:** Demo detection is **client-side only** - no server-side enforcement

### Features Gated

**UI-Only Gating (Client-Side):**
- Demo banner/ribbon display
- Quote attempt limits (uses `usePreviewQuota` hook)
- Blur effects on pricing
- **CRITICAL:** All gating is client-side - can be bypassed

**Server-Side Gating:**
- **NOT FOUND:** No server-side check for paid status before estimate generation
- **NOT FOUND:** No API key validation for lead ingestion in demo mode

### Quote Attempt Limits

**Implementation:** `src/demo/usePreviewQuota.ts`  
**Storage:** localStorage key `sunspire_demo_quota_v1`  
**Default:** 2 attempts (line 28 in `src/demo/useDemo.ts`)  
**Expiration:** 7 days (configurable via `expireDays` param)  
**CRITICAL:** Client-side only - can be cleared/reset by user

---

## 9) MONITORING / HEALTHCHECK MAP

### Health Endpoint

**Route:** `GET /api/health`  
**File:** `app/api/health/route.ts`  
**Returns:**
- `ok: true`
- `timestamp: ISO string`
- `apis: { nrel, openei, airtable, stripe }` - Boolean presence checks (not values)
- `environment: NODE_ENV`
- `version: "1.0.0"`

**Recommendation:** Add response time checks, actual API connectivity tests

### Best Endpoints to Monitor

1. **`GET /api/health`** - Overall system health
2. **`POST /api/stripe/webhook`** - Payment processing (critical)
3. **`GET /api/estimate`** - Core functionality
4. **`POST /api/lead`** - Lead capture
5. **`GET /`** - Homepage availability

### Cron Jobs / Scheduled Tasks

**Found:**
- `GET /api/cron/refresh-rates` - Refreshes utility rates (line 17 in `app/api/cron/refresh-rates/route.ts`)
- `GET /api/cron/precompute-pvwatts` - Precomputes PVWatts data (line 19 in `app/api/cron/precompute-pvwatts/route.ts`)

**Configuration:**
- **NOT FOUND:** No `vercel.json` cron configuration found
- **CRITICAL:** Cron jobs may not be scheduled in Vercel

### Vercel Region Settings

- **NOT FOUND:** No `vercel.json` file found
- **NOT FOUND:** No region configuration in codebase

---

## 10) "SILENT FAILURE" CHECKLIST

| Failure Point | Symptom User Sees | How to Detect | Current Mitigation | Recommended Fix |
|--------------|-------------------|---------------|-------------------|-----------------|
| **Stripe Webhook Fails** | Payment succeeds but no tenant created, no email sent | Check Stripe dashboard for failed webhook deliveries | Stripe retries 3 days, then stops | Add dead letter queue, manual recovery endpoint |
| **Airtable Write Fails** | Payment succeeds, tenant not provisioned | Check Airtable for missing records, webhook logs | Error logged, webhook returns 500 | Add retry logic with exponential backoff, alert on failure |
| **Email Send Fails** | User pays but gets no onboarding email | Check SMTP logs, email service logs | Error logged, webhook continues | Add email queue (Resend/SendGrid), retry mechanism |
| **Zapier (Not Implemented)** | N/A - not implemented | N/A | N/A | Remove from docs OR implement webhook forwarding |
| **PVWatts API Quota Exceeded** | Estimate fails or returns degraded data | Check NREL API response codes, logs | Fallback to location-based calculation (degraded mode) | Add quota monitoring, alert at 80% usage |
| **EIA API Fails** | Uses fallback state average rates | Check EIA API response, logs | Falls back to `STATE_FALLBACK` rates | Add retry logic, better fallback handling |
| **Vercel KV Unavailable** | Webhook idempotency fails, duplicates possible | Check KV connection, webhook logs | Falls back to in-memory (not distributed-safe) | Add alert when KV unavailable, use database as fallback |
| **Rate Limiting Resets** | In-memory rate limits reset on function restart | Check rate limit map size, function restarts | In-memory only - resets on cold start | Use Vercel KV or Redis for distributed rate limiting |
| **Demo Quota Bypassed** | User exceeds demo limits via localStorage manipulation | Check localStorage, quota consumption logs | Client-side only - easily bypassed | Add server-side quota tracking |
| **Admin Token Leaked** | Unauthorized tenant creation | Check admin endpoint access logs | Direct string comparison (timing attack possible) | Use timing-safe comparison, add IP allowlist |

---

## 11) ACTION ITEMS (PRIORITIZED)

### 🔴 CRITICAL (Launch Blockers)

1. **Implement Server-Side Paid Access Check**
   - **What:** Add middleware or API route check that validates tenant exists in Airtable with "Paid" status
   - **Files:** Create `middleware.ts` or add to existing middleware
   - **Suggestion:** Check `/c/:handle` routes, validate tenant from Airtable, redirect to demo if not paid

2. **Fix Webhook Idempotency in Production**
   - **What:** Ensure Vercel KV is configured and fail gracefully if unavailable
   - **Files:** `lib/webhook-idempotency.ts:17-19`
   - **Suggestion:** Add database fallback (Airtable "ProcessedEvents" table) if KV unavailable

3. **Complete Subscription Status Updates**
   - **What:** Implement `updateTenantSubscriptionStatus()` function
   - **Files:** `app/api/stripe/webhook/route.ts:275-290`
   - **Suggestion:** Add "Subscription ID" field lookup in Airtable, update "Payment Status" and "Current Period End"

4. **Add Email Queue/Retry System**
   - **What:** Replace direct SMTP with Resend/SendGrid API, add retry logic
   - **Files:** `lib/email-service.ts`
   - **Suggestion:** Use Resend API (better deliverability), add retry with exponential backoff, queue failed emails

5. **Add Payment Failure Handling**
   - **What:** Update Airtable "Payment Status" when `invoice.payment_failed` event received
   - **Files:** `app/api/stripe/webhook/route.ts:251-255`
   - **Suggestion:** Set status to "PastDue", send notification email, disable access after grace period

### 🟡 HIGH

6. **Add Airtable Rate Limiting**
   - **What:** Throttle Airtable API calls to stay under 5 req/sec limit
   - **Files:** `src/lib/airtable.ts`
   - **Suggestion:** Use p-queue or similar library, add request queuing

7. **Fix Rate Limiting (Use Distributed Storage)**
   - **What:** Replace in-memory rate limiting with Vercel KV
   - **Files:** `src/lib/ratelimit.ts`, `lib/rate-limit.ts`
   - **Suggestion:** Consolidate to single implementation using Vercel KV

8. **Add Webhook Dead Letter Queue**
   - **What:** Store failed webhook events for manual recovery
   - **Files:** Create `app/api/admin/replay-webhook/route.ts`
   - **Suggestion:** Store failed events in Airtable "FailedWebhooks" table, add admin UI to replay

9. **Secure Magic Link Tokens**
   - **What:** Use JWT with proper signing instead of base64 JSON
   - **Files:** `lib/email-service.ts:265-272`
   - **Suggestion:** Use `src/server/auth/jwt.ts` signToken function with expiration

10. **Add Server-Side Demo Quota Tracking**
    - **What:** Track demo quota in Airtable or Vercel KV, not just localStorage
    - **Files:** `src/demo/usePreviewQuota.ts`
    - **Suggestion:** Create API endpoint to check/consume quota, validate server-side

### 🟢 MEDIUM

11. **Add Structured Logging**
    - **What:** Replace console.log with structured JSON logging
    - **Files:** All files using console.log
    - **Suggestion:** Use pino or winston, send to Datadog/Logtail

12. **Add CORS Configuration**
    - **What:** Explicitly configure CORS for API routes
    - **Files:** Create `next.config.js` CORS config or middleware
    - **Suggestion:** Allow specific origins, add preflight handling

13. **Add Input Sanitization**
    - **What:** Sanitize user inputs to prevent XSS
    - **Files:** All API routes accepting user input
    - **Suggestion:** Use DOMPurify or similar for HTML, validate with Zod

14. **Fix Admin Token Comparison**
    - **What:** Use timing-safe string comparison
    - **Files:** `app/api/admin/create-tenant/route.ts:19`
    - **Suggestion:** Use `crypto.timingSafeEqual()` or constant-time comparison

15. **Add Vercel Cron Configuration**
    - **What:** Configure cron jobs in `vercel.json`
    - **Files:** Create `vercel.json`
    - **Suggestion:** Schedule `/api/cron/refresh-rates` daily, `/api/cron/precompute-pvwatts` weekly

### 🔵 NICE-TO-HAVE

16. **Remove Zapier References**
    - **What:** Remove Zapier mentions from docs or implement basic webhook
    - **Files:** `app/support/page.tsx:88`, `app/docs/crm/page.tsx:58-60`
    - **Suggestion:** Either implement or remove from public docs

17. **Add Database Backup Strategy**
    - **What:** Document Airtable backup process
    - **Files:** Create `docs/backup-strategy.md`
    - **Suggestion:** Use Airtable's built-in backup or export scripts

18. **Add API Documentation**
    - **What:** Generate OpenAPI/Swagger docs for API routes
    - **Files:** Create `docs/api/openapi.yaml`
    - **Suggestion:** Use next-swagger-doc or similar

19. **Add Monitoring Dashboard**
    - **What:** Set up Datadog/New Relic for observability
    - **Files:** Add monitoring SDK
    - **Suggestion:** Track webhook success rate, API response times, error rates

20. **Add E2E Test for Complete Purchase Flow**
    - **What:** Test Stripe checkout → webhook → Airtable → email end-to-end
    - **Files:** `tests/complete-purchase-flow.spec.ts` (exists but may need updates)
    - **Suggestion:** Use Stripe test mode, mock Airtable in tests

---

## SECRETS AUDIT

### ✅ NO HARD-CODED SECRETS FOUND
- All secrets properly use environment variables
- No API keys, tokens, or passwords found in code files
- Env vars referenced but not printed in logs (values redacted)

### ⚠️ POTENTIAL SECRET LEAKAGE
- Console.log statements may print metadata (emails, company names) - review for PII
- Error messages may expose internal structure - ensure production errors are sanitized

---

**END OF AUDIT MAP**
