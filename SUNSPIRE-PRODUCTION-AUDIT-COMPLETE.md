# 🔍 SUNSPIRE PRODUCTION AUDIT - COMPLETE EVIDENCE-BASED REPORT

**Generated:** 2025-01-XX  
**Method:** Full codebase scan with exact file path citations  
**No assumptions - only code evidence**

---

## 1️⃣ INTEGRATION INVENTORY (SOURCE-OF-TRUTH)

### Stripe

**STATUS: ✅ USED**

**Checkout Session Creation:**
- **File:** `app/api/stripe/create-checkout-session/route.ts`
- **Routes:** `POST /api/stripe/create-checkout-session` (lines 14-119), `GET /api/stripe/create-checkout-session` (lines 121-224)
- **Function:** Creates Stripe checkout session with monthly subscription + setup fee
- **Price IDs:** Uses env vars `STRIPE_PRICE_STARTER` || `STRIPE_PRICE_MONTHLY` || `STRIPE_PRICE_MONTHLY_99` (line 28-30) and `STRIPE_PRICE_SETUP_399` (line 32)
- **When it runs:** On user clicking checkout button, called from `src/lib/checkout.ts`

**Webhook Handler:**
- **File:** `app/api/stripe/webhook/route.ts`
- **Route:** `POST /api/stripe/webhook` (line 21)
- **Signature Verification:** Lines 42-46 using `stripe.webhooks.constructEvent()` with `ENV.STRIPE_WEBHOOK_SECRET`
- **Idempotency:** Uses `withIdempotency()` wrapper (line 54) from `lib/webhook-idempotency.ts`
- **Events Handled:**
  - `checkout.session.completed` → `handleCheckoutCompleted()` (line 56-60, handler at lines 112-238)
  - `payment_intent.succeeded` → `handlePaymentSucceeded()` (line 62-66, handler at lines 240-243) - **NO ACTION TAKEN**
  - `invoice.payment_succeeded` → `handleInvoicePaymentSucceeded()` (line 68-72, handler at lines 245-249) - **NO ACTION TAKEN**
  - `invoice.payment_failed` → `handleInvoicePaymentFailed()` (line 74-76, handler at lines 251-255) - **NO ACTION TAKEN**
  - `customer.subscription.updated` → `handleSubscriptionUpdated()` (line 78-82, handler at lines 257-268)
  - `customer.subscription.deleted` → `handleSubscriptionDeleted()` (line 84-88, handler at lines 270-273)

**DUPLICATE WEBHOOK HANDLER FOUND:**
- **File:** `app/api/webhooks/stripe/route.ts` (lines 16-140)
- **Route:** `POST /api/webhooks/stripe`
- **Status:** ⚠️ **DUPLICATE** - Different implementation, handles same events differently
- **Issue:** Two webhook endpoints exist - which one is configured in Stripe dashboard?

**Stripe Client:**
- **File:** `src/lib/stripe.ts` (lines 3-12)
- **Function:** `getStripe()` - Returns Stripe instance
- **Secret Key:** Uses `STRIPE_SECRET_KEY` || `STRIPE_LIVE_SECRET_KEY` (line 5)

**Products/Prices:**
- Monthly: `STRIPE_PRICE_STARTER` || `STRIPE_PRICE_MONTHLY` || `STRIPE_PRICE_MONTHLY_99`
- Setup: `STRIPE_PRICE_SETUP_399`
- **CRITICAL:** Falls back through 3 different env vars for monthly price - could use wrong price

---

### Airtable

**STATUS: ✅ USED - PRIMARY DATABASE**

**Base ID:**
- **Env Var:** `AIRTABLE_BASE_ID` (referenced in `src/config/env.ts:5`, `src/lib/airtable.ts:10`)
- **Usage:** Single base ID used throughout codebase

**Initialization:**
- **File:** `src/lib/airtable.ts` (lines 8-26)
- **Function:** `getBase()` - Lazy initializes Airtable client
- **Validation:** Throws error if `AIRTABLE_API_KEY` or `AIRTABLE_BASE_ID` missing (line 10-11)

**Tables Used:**
1. **"Leads"** - Defined at line 30, used throughout for lead storage
2. **"Tenants"** - Defined at line 31, used for company/tenant records
3. **"Users"** - Defined at line 32, used for user accounts
4. **"Links"** - Defined at line 33, used for tracking links

**Fields Written (Tenants Table):**
- **File:** `src/lib/airtable.ts` (lines 60-78) - `TENANT_FIELDS` constant
- **Fields:** "Company Handle", "Plan", "Domain / Login URL", "Brand Colors", "Logo URL", "CRM Keys", "API Key", "Capture URL", "Users", "Payment Status", "Stripe Customer ID", "Last Payment", "Subscription ID", "Current Period End", "Requested Domain", "Domain Status", "Domain"

**Fields Written (Leads Table):**
- **File:** `src/lib/airtable.ts` (lines 37-58) - `LEAD_FIELDS` constant
- **Fields:** "Name", "Email", "Company", "Tenant", "Demo URL", "Campaign ID", "Status", "Notes", "Last Activity", "Street", "City", "State", "Postal Code", "Country", "Formatted Address", "Place ID", "Latitude", "Longitude", "Utility Rate ($/kWh)", "Token"

**Where Airtable Writes Occur:**
- **Tenant Creation:** `app/api/stripe/webhook/route.ts:155` - `upsertTenantByHandle()` called
- **User Creation:** `app/api/stripe/webhook/route.ts:188` - `createOrLinkUserOwner()` called
- **Lead Storage:** `app/api/lead/route.ts:79` - `storeLead()` called
- **Admin Tenant Creation:** `app/api/admin/create-tenant/route.ts:65` - `upsertTenantByHandle()` called

**Rate Limiting:**
- **NOT FOUND:** No Airtable API rate limiting/throttling in code
- **CRITICAL:** Airtable has 5 req/sec limit - no protection against exceeding

---

### Email

**STATUS: ✅ USED - NODEMAILER (SMTP)**

**Provider:** Nodemailer (NOT Resend, NOT SendGrid, NOT Postmark)
- **File:** `lib/email-service.ts` (lines 6-17)
- **Transporter:** Gmail SMTP (defaults to `smtp.gmail.com:587`)
- **Env Vars:** `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`
- **Comment on line 8:** "should use Resend/SendGrid in production" - **NOT IMPLEMENTED**

**Email Types:**
1. **Onboarding Email (Purchase Confirmation)**
   - **Function:** `sendOnboardingEmail()` (lines 30-262)
   - **Triggered:** `app/api/stripe/webhook/route.ts:211` (after checkout.session.completed)
   - **Contains:** Instant URL, embed code, custom domain, API key, dashboard link, magic link
   - **Failure Handling:** Returns `{ success: false, error }` but webhook continues (line 260)

**Magic Link Generation:**
- **Function:** `generateMagicLink()` (lines 265-272)
- **Security:** ⚠️ **INSECURE** - Uses base64-encoded JSON, not cryptographically signed (line 269)
- **Expiration:** 7 days (line 281)

**Bounce/Suppression Handling:**
- **NOT FOUND:** No bounce handling
- **NOT FOUND:** No unsubscribe mechanism
- **NOT FOUND:** No email queue/retry system

---

### Monitoring / Uptime

**STATUS: ⚠️ PARTIAL**

**Health Endpoint:**
- **File:** `app/api/health/route.ts` (lines 3-18)
- **Route:** `GET /api/health`
- **Returns:** Boolean checks for API key presence (not actual connectivity)
- **APIs Checked:** NREL, OpenEI, Airtable, Stripe (lines 8-11)

**UptimeRobot:**
- **NOT FOUND:** No UptimeRobot integration in codebase
- **NOT FOUND:** No monitoring service configuration
- **Status:** Only mentioned in docs, not implemented

**Cron Jobs:**
- **File:** `app/api/cron/refresh-rates/route.ts` (line 17) - `GET /api/cron/refresh-rates`
- **File:** `app/api/cron/precompute-pvwatts/route.ts` (line 19) - `GET /api/cron/precompute-pvwatts`
- **Configuration:** ⚠️ **NOT FOUND** - No `vercel.json` file found
- **CRITICAL:** Cron jobs exist but may not be scheduled in Vercel

---

### Background / Async Systems

**STATUS: ✅ PARTIAL**

**Vercel KV (Redis):**
- **File:** `lib/webhook-idempotency.ts` (lines 9, 17-19)
- **Usage:** Webhook idempotency storage
- **Env Vars:** `KV_REST_API_URL`, `KV_REST_API_TOKEN` (line 18)
- **Fallback:** In-memory cache if KV unavailable (line 14, 36-46)
- **CRITICAL:** Falls back to in-memory in production if KV not configured (not distributed-safe)

**Queues:**
- **NOT FOUND:** No queue system (no Bull, no SQS, no Vercel Queue)
- **NOT FOUND:** No retry mechanism for failed operations

**Retries:**
- **Found:** `src/services/pvwatts.ts` has `retryWithBackoff()` (lines 92-130)
- **Found:** `lib/rates.ts` has `retryEIA()` function
- **NOT FOUND:** No retry logic for Airtable writes
- **NOT FOUND:** No retry logic for email sends

---

### Zapier / External Webhooks

**STATUS: ❌ NOT IMPLEMENTED**

**References Found:**
- `app/support/page.tsx:88` - FAQ mentions Zapier
- `app/docs/crm/page.tsx:58-60` - Documentation mentions Zapier
- `app/api/demo-event/route.ts:7` - TODO comment: "Forward to Airtable/Zapier for follow-up"
- `NOTION-CHECKLIST.md:57` - Checklist item
- `COMPLETE-LAUNCH-RUNBOOK.md:69` - Mentions "Make/Zapier"

**Conclusion:** Zapier is **documented but NOT implemented**. No webhook URLs, payload schemas, or trigger conditions in code.

---

## 2️⃣ STRIPE → APP → AIRTABLE DATA FLOW

### Event: `checkout.session.completed`

**Execution Path:**

1. **Webhook Received:**
   - **Route:** `POST /api/stripe/webhook` (`app/api/stripe/webhook/route.ts:21`)
   - **Signature Verification:** Lines 42-46 - Returns 400 if invalid (line 49)

2. **Idempotency Check:**
   - **Function:** `withIdempotency(eventId, handler)` (line 54)
   - **Implementation:** `lib/webhook-idempotency.ts:84-110`
   - **Storage:** Vercel KV (if available) or in-memory fallback
   - **Key:** `webhook:processed:${eventId}` (line 27)
   - **TTL:** 24 hours (line 11)

3. **Handler Execution:**
   - **Function:** `handleCheckoutCompleted()` (lines 112-238)

4. **Validations:**
   - **Line 122-125:** Checks if `company` exists in metadata - **EARLY RETURN if missing** (no error thrown, just returns)
   - **Line 129-135:** Logs environment variable presence (debug only)

5. **Database Writes (Airtable):**

   **a) Tenant Creation/Update:**
   - **Line 155:** `upsertTenantByHandle(company, {...})`
   - **Function:** `src/lib/airtable.ts:212-232`
   - **Logic:** Finds existing tenant by "Company Handle", updates if exists, creates if not
   - **Fields Written:**
     - "Company Handle": company
     - "Plan": plan || "Starter"
     - "Token": token || ""
     - "UTM Source": utm_source || ""
     - "UTM Campaign": utm_campaign || ""
     - "API Key": generated API key
     - "Domain / Login URL": loginUrl
     - "Capture URL": captureUrl
     - "Payment Status": "Paid"
     - "Stripe Customer ID": session.customer
     - "Last Payment": ISO timestamp
   - **CRITICAL:** If this fails, error is caught at line 226, logged, but webhook returns 500

   **b) Custom Domain Setup (Optional):**
   - **Lines 172-184:** If company website detected, sets "Requested Domain" and "Domain Status"
   - **Functions:** `setRequestedDomain()` (line 179), `setTenantDomainStatus()` (line 180)
   - **Non-blocking:** Errors here don't stop tenant creation

   **c) User Creation:**
   - **Lines 187-193:** If `session.customer_email` exists, creates/links user as owner
   - **Function:** `createOrLinkUserOwner()` (`src/lib/airtable.ts:234-266`)
   - **Logic:** Finds user by email + tenant, creates if not exists
   - **Fields Written:** "Email", "Role": "Owner", "Tenant": [tenantId]

6. **Email Send:**
   - **Lines 198-220:** Sends onboarding email if `session.customer_email` exists
   - **Function:** `sendOnboardingEmail()` (`lib/email-service.ts:30-262`)
   - **Failure:** Returns `{ success: false }` but webhook continues (line 260)

7. **Error Handling:**
   - **Lines 226-237:** Catches all errors, logs them, returns 500 response
   - **CRITICAL:** If Airtable write fails, webhook returns 500, Stripe will retry

**What Does NOT Happen:**
- ❌ No lead record created on checkout
- ❌ No Zapier webhook call
- ❌ No external notification
- ❌ No backup/fallback if Airtable fails

---

### Event: `checkout.session.expired`

**STATUS: ❌ NOT HANDLED**

**Evidence:**
- **Search Result:** No matches found for "checkout.session.expired" or "session.expired" in codebase
- **Webhook Handler:** `app/api/stripe/webhook/route.ts` switch statement (lines 55-92) does not include `checkout.session.expired`
- **Conclusion:** Expired sessions trigger **NO writes** to Airtable

---

## 3️⃣ AIRTABLE SCHEMA REALITY CHECK

### Base ID

**Single Base Used:**
- **Env Var:** `AIRTABLE_BASE_ID`
- **Referenced In:**
  - `src/config/env.ts:5` (validation)
  - `src/lib/airtable.ts:10, 18, 22` (initialization)
  - `app/api/stripe/webhook/route.ts:133` (debug log)
  - `app/api/lead/route.ts:74` (check)

**Conclusion:** One base ID used throughout - no multi-base configuration

---

### Table Names (From Code)

**1. "Leads"**
- **Defined:** `src/lib/airtable.ts:30`
- **Required:** ✅ YES - Used for lead storage (`app/api/lead/route.ts:79`)

**2. "Tenants"**
- **Defined:** `src/lib/airtable.ts:31`
- **Required:** ✅ YES - Core table, used in webhook (`app/api/stripe/webhook/route.ts:155`)

**3. "Users"**
- **Defined:** `src/lib/airtable.ts:32`
- **Required:** ✅ YES - Used for user accounts (`app/api/stripe/webhook/route.ts:188`)

**4. "Links"**
- **Defined:** `src/lib/airtable.ts:33`
- **Required:** ⚠️ CONDITIONAL - Used for tracking links (`app/api/links/open/route.ts`), may not exist if outreach not used

---

### Field Names Written (From Code)

**Tenants Table Fields (Exact Strings from Code):**
- "Company Handle" (line 156 in webhook, line 61 in airtable.ts)
- "Plan" (line 157, line 62)
- "Domain / Login URL" (line 162, line 63)
- "Brand Colors" (line 64)
- "Logo URL" (line 65)
- "CRM Keys" (line 66)
- "API Key" (line 161, line 67)
- "Capture URL" (line 163, line 68)
- "Users" (line 69)
- "Payment Status" (line 164, line 70)
- "Stripe Customer ID" (line 165, line 71)
- "Last Payment" (line 166, line 72)
- "Subscription ID" (line 73)
- "Current Period End" (line 74)
- "Requested Domain" (line 75)
- "Domain Status" (line 180, line 76)
- "Domain" (line 77)

**Leads Table Fields (Exact Strings from Code):**
- "Name" (line 38)
- "Email" (line 39)
- "Company" (line 40)
- "Tenant" (line 41) - Link field
- "Demo URL" (line 42)
- "Campaign ID" (line 43)
- "Status" (line 44)
- "Notes" (line 45)
- "Last Activity" (line 46)
- "Street" (line 47)
- "City" (line 48)
- "State" (line 49)
- "Postal Code" (line 50)
- "Country" (line 51)
- "Formatted Address" (line 52)
- "Place ID" (line 53)
- "Latitude" (line 54)
- "Longitude" (line 55)
- "Utility Rate ($/kWh)" (line 56)
- "Token" (line 57)

**Users Table Fields:**
- "Email" (line 81)
- "Role" (line 82)
- "Tenant" (line 83) - Link field

**Links Table Fields:**
- "Token" (line 87)
- "TargetParams" (line 88)
- "Tenant" (line 89) - Link field
- "Clicks" (line 90)
- "Status" (line 91)
- "LastClickedAt" (line 92)
- "ProspectEmail" (line 93)

---

### Records After Successful Stripe Checkout

**What Should Appear:**

1. **Tenants Table:**
   - **1 record** with "Company Handle" = company from metadata
   - **Fields:** All fields listed above populated (lines 155-167 in webhook)

2. **Users Table:**
   - **1 record** (if `session.customer_email` exists)
   - **Fields:** Email, Role: "Owner", Tenant: [link to tenant record]

3. **Leads Table:**
   - **0 records** - No lead created on checkout

**What May Not Appear (If Errors):**
- Tenant record if Airtable write fails (webhook returns 500, Stripe retries)
- User record if user creation fails (non-blocking, logged but continues)
- Email sent if SMTP fails (non-blocking, logged but continues)

---

## 4️⃣ ENVIRONMENT VARIABLE GROUND TRUTH

### Complete List (From Code Scan)

**Hard-Required (Validated in `src/config/env.ts`):**
1. `AIRTABLE_API_KEY` (line 4) - Airtable API access
2. `AIRTABLE_BASE_ID` (line 5) - Airtable base identifier
3. `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` (line 7) - Google Maps
4. `NREL_API_KEY` (line 8) - NREL PVWatts API
5. `EIA_API_KEY` (line 9) - EIA utility rates API
6. `ADMIN_TOKEN` (line 12) - Admin authentication

**Optional (Validated but Optional):**
7. `NEXT_PUBLIC_APP_URL` (line 13) - App base URL
8. `STRIPE_LIVE_SECRET_KEY` (line 25) - Stripe secret key
9. `STRIPE_PUBLISHABLE_KEY` (line 26) - Stripe publishable key
10. `STRIPE_WEBHOOK_SECRET` (line 27) - Stripe webhook signature verification
11. `STRIPE_PRICE_MONTHLY_99` (line 28) - Stripe monthly price ID
12. `STRIPE_PRICE_SETUP_399` (line 29) - Stripe setup price ID
13. `VERCEL_TOKEN` (line 32) - Vercel API access
14. `VERCEL_PROJECT_ID` (line 33) - Vercel project identifier

**Used But Not Validated:**
15. `SMTP_HOST` - Referenced in `lib/email-service.ts:10` (defaults to 'smtp.gmail.com')
16. `SMTP_PORT` - Referenced in `lib/email-service.ts:11` (defaults to '587')
17. `SMTP_USER` - Referenced in `lib/email-service.ts:14` (no default)
18. `SMTP_PASS` - Referenced in `lib/email-service.ts:15` (no default)
19. `SMTP_FROM` - Referenced in `lib/email-service.ts:249` (defaults to '"Sunspire" <noreply@sunspire.app>')
20. `KV_REST_API_URL` - Referenced in `lib/webhook-idempotency.ts:18` (no default)
21. `KV_REST_API_TOKEN` - Referenced in `lib/webhook-idempotency.ts:18` (no default)
22. `OPENEI_API_KEY` - Referenced in `lib/urdb.ts:2`, `app/api/health/route.ts:9` (not in env schema)
23. `STRIPE_SECRET_KEY` - Referenced in `src/lib/stripe.ts:5` (fallback for STRIPE_LIVE_SECRET_KEY)
24. `STRIPE_PRICE_STARTER` - Referenced in `app/api/stripe/create-checkout-session/route.ts:28` (fallback)
25. `STRIPE_PRICE_MONTHLY` - Referenced in `app/api/stripe/create-checkout-session/route.ts:29` (fallback)

**Optional Numeric Defaults:**
26. `DEFAULT_RATE_ESCALATION` (default: 0.025)
27. `DEFAULT_OANDM_ESCALATION` (default: 0.03)
28. `DISCOUNT_RATE` (default: 0.08)
29. `OANDM_PER_KW_YEAR` (default: 15)
30. `DEFAULT_DEGRADATION_PCT` (default: 0.5)
31. `DEFAULT_LOSSES_PCT` (default: 14)
32. `DEFAULT_COST_PER_WATT` (default: 3.5)

---

### Env Vars That Imply Non-Existent Features

**Resend:**
- **NOT FOUND:** No Resend API calls in codebase
- **Status:** Comment in `lib/email-service.ts:8` says "should use Resend" but not implemented

**SendGrid:**
- **NOT FOUND:** No SendGrid API calls
- **Status:** Mentioned in comment only

**Postmark:**
- **NOT FOUND:** No Postmark API calls
- **Status:** Not mentioned anywhere

**UptimeRobot:**
- **NOT FOUND:** No UptimeRobot integration
- **Status:** Only mentioned in docs, not in code

---

## 5️⃣ WHY "NOTHING IS SHOWING UP"

### Top 3 Reasons Airtable Has No Records

**1. Webhook Not Configured in Stripe Dashboard**
- **Evidence:** Two webhook endpoints exist (`/api/stripe/webhook` and `/api/webhooks/stripe`)
- **Issue:** Stripe may be pointing to wrong endpoint or endpoint not configured
- **Check:** Stripe Dashboard → Webhooks → Verify endpoint URL matches code

**2. Webhook Signature Verification Failing**
- **Evidence:** `app/api/stripe/webhook/route.ts:42-49` - Returns 400 if signature invalid
- **Issue:** `STRIPE_WEBHOOK_SECRET` env var may be wrong or missing
- **Symptom:** Webhook returns 400, Stripe shows "Invalid signature" in dashboard
- **Check:** Verify `STRIPE_WEBHOOK_SECRET` matches Stripe webhook secret

**3. Airtable API Key or Base ID Missing/Invalid**
- **Evidence:** `src/lib/airtable.ts:10-11` - Throws error if missing
- **Issue:** `AIRTABLE_API_KEY` or `AIRTABLE_BASE_ID` not set or invalid
- **Symptom:** Webhook returns 500, error logged: "Airtable API key and base ID are required"
- **Check:** Verify env vars are set in Vercel dashboard

**Additional Reasons:**
- **Early Return:** If `company` metadata missing, handler returns early (line 122-125) - no error, just silent return
- **Idempotency:** If webhook already processed, skips execution (line 89-94) - but should still have record from first attempt

---

### Top 3 Reasons Webhook Deliveries Are Empty

**1. Webhook Endpoint Not Receiving Requests**
- **Evidence:** No webhook handler called if endpoint not hit
- **Issue:** Stripe webhook URL may be wrong, or Vercel deployment issue
- **Check:** Stripe Dashboard → Webhooks → Test webhook, check Vercel logs

**2. Webhook Returns 500 (Stripe Retries Then Gives Up)**
- **Evidence:** `app/api/stripe/webhook/route.ts:98-103` - Returns 500 on handler error
- **Issue:** Airtable write fails, email send fails, or other error in handler
- **Symptom:** Stripe shows "Failed" deliveries, eventually stops retrying after 3 days
- **Check:** Vercel function logs for error details

**3. Signature Verification Failing (Returns 400)**
- **Evidence:** `app/api/stripe/webhook/route.ts:47-49` - Returns 400 if signature invalid
- **Issue:** `STRIPE_WEBHOOK_SECRET` mismatch
- **Symptom:** All deliveries show "Invalid signature" in Stripe
- **Check:** Verify webhook secret in Stripe matches env var

---

### Silent Failure Conditions

**1. Missing Company Metadata - Early Return**
- **File:** `app/api/stripe/webhook/route.ts:122-125`
- **Code:** `if (!company) { console.error(...); return; }`
- **Issue:** Returns undefined (not an error), webhook handler thinks it succeeded
- **Result:** Webhook returns 200, but no Airtable write occurs

**2. Email Send Failure - Swallowed**
- **File:** `lib/email-service.ts:258-260`
- **Code:** `catch (error) { console.error(...); return { success: false, error }; }`
- **Issue:** Error returned but webhook continues (line 211-220 doesn't check return value)
- **Result:** User pays but gets no email, no error logged in webhook

**3. User Creation Failure - Swallowed**
- **File:** `app/api/stripe/webhook/route.ts:187-193`
- **Code:** No try-catch around `createOrLinkUserOwner()`
- **Issue:** If this throws, it's caught by outer catch (line 226), but tenant may already be created
- **Result:** Tenant created but no user record, partial success

**4. Domain Setup Failure - Swallowed**
- **File:** `app/api/stripe/webhook/route.ts:172-184`
- **Code:** No try-catch around domain functions
- **Issue:** Errors here don't stop tenant creation, but domain not set up
- **Result:** Tenant created but domain fields empty

**5. Idempotency Check Fails Open**
- **File:** `lib/webhook-idempotency.ts:48-52`
- **Code:** `catch (error) { console.error(...); return false; }` - "Fail open"
- **Issue:** If KV check fails, assumes not processed, could process duplicate
- **Result:** Duplicate webhook processing possible

---

## 6️⃣ FINAL VERDICT (BLUNT)

### What Sunspire Actually Does Today

**✅ REAL:**
1. **Stripe Checkout** - Creates checkout sessions with monthly + setup fee
2. **Stripe Webhook** - Handles `checkout.session.completed`, creates tenant in Airtable
3. **Airtable Integration** - Primary database for Tenants, Leads, Users, Links
4. **Email (SMTP)** - Sends onboarding emails via Nodemailer/Gmail SMTP
5. **Solar Estimation** - Uses NREL PVWatts v8 and EIA for utility rates
6. **Google Maps** - Address autocomplete and geocoding
7. **Webhook Idempotency** - Uses Vercel KV (with in-memory fallback)
8. **Health Endpoint** - Basic API key presence checks

**❌ NOT REAL (Documented But Not Implemented):**
1. **Resend/SendGrid/Postmark** - Comment says "should use" but uses SMTP
2. **Zapier Integration** - Mentioned in docs, TODO comments, but no code
3. **UptimeRobot** - Mentioned in docs, not in code
4. **Vercel Cron** - Cron endpoints exist but no `vercel.json` configuration
5. **Subscription Status Updates** - Handler exists but has TODO (line 286 in webhook)
6. **Payment Failure Handling** - Handler exists but does nothing (lines 251-255)

**⚠️ PARTIAL:**
1. **Email Queue/Retry** - No queue, no retry on failure
2. **Airtable Rate Limiting** - No throttling, could exceed 5 req/sec
3. **Error Recovery** - Errors logged but no retry/backoff
4. **Monitoring** - Health endpoint exists but no actual monitoring service

---

### What It Appears to Do But Does Not

1. **"Uses Resend for Email"** - Actually uses Gmail SMTP (nodemailer)
2. **"Integrates with Zapier"** - No integration code exists
3. **"Monitors with UptimeRobot"** - No monitoring service configured
4. **"Handles Expired Checkout Sessions"** - No handler for `checkout.session.expired`
5. **"Updates Subscription Status"** - Handler has TODO, not implemented
6. **"Handles Payment Failures"** - Handler logs but takes no action

---

### What Integrations Are Real vs Imagined

**REAL:**
- Stripe (checkout + webhooks)
- Airtable (database)
- Nodemailer/SMTP (email)
- Google Maps (geocoding)
- NREL PVWatts (solar data)
- EIA (utility rates)
- Vercel KV (idempotency, if configured)

**IMAGINED (In Docs, Not Code):**
- Resend
- SendGrid
- Postmark
- Zapier
- UptimeRobot
- Vercel Cron (endpoints exist, not scheduled)

---

### Whether Resend and UptimeRobot Exist

**Resend:**
- **Status:** ❌ DOES NOT EXIST
- **Evidence:** Comment in `lib/email-service.ts:8` says "should use Resend/SendGrid in production"
- **Reality:** Uses Nodemailer with Gmail SMTP
- **Conclusion:** Planned but not implemented

**UptimeRobot:**
- **Status:** ❌ DOES NOT EXIST
- **Evidence:** No code references found
- **Reality:** Only health endpoint exists (`/api/health`), no external monitoring
- **Conclusion:** Mentioned in docs but not implemented

---

## CRITICAL FINDINGS SUMMARY

1. **Two Webhook Endpoints** - `/api/stripe/webhook` and `/api/webhooks/stripe` - which one is configured?
2. **Missing Company Metadata** - Early return, no error, webhook succeeds but no write
3. **Subscription Status Updates** - TODO comment, not implemented
4. **Payment Failures** - Handler does nothing
5. **Expired Sessions** - Not handled at all
6. **Email Failures** - Swallowed, user pays but gets no email
7. **No Airtable Rate Limiting** - Could exceed API limits
8. **No Retry Logic** - Failures are final
9. **Cron Jobs Not Scheduled** - Endpoints exist but no `vercel.json`
10. **Idempotency Fallback** - In-memory fallback not production-safe

---

**END OF AUDIT**
