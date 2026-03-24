HOW SUNSPIRE WORKS - COMPLETE TECHNICAL GUIDE
Everything You Need To Know To Understand, Explain, and Fix The System

Last Updated: January 25, 2026

TABLE OF CONTENTS

1. System Overview
2. Customer Journey (End to End)
3. Core Components
4. Payment Flow (Stripe)
5. Solar Estimation System
6. Authentication & Access
7. Data Storage (Airtable)
8. Email System
9. Error Handling & Reliability
10. Security Features
11. Monitoring & Observability
12. What Happens When Things Break
13. How To Explain The System To Customers
14. How To Explain The System To Technical People

1. SYSTEM OVERVIEW

What Sunspire Is

Sunspire is a white-label solar calculator SaaS platform. It allows solar companies to:
- Embed a branded calculator on their website
- Share a branded link with prospects
- Capture leads automatically (name, email, address)
- Get accurate solar estimates (production, savings, payback)

Architecture Overview

Sunspire runs on:
- Frontend: Next.js 14 (React) deployed on Vercel
- Backend: Next.js API routes (serverless functions on Vercel)
- Database: Airtable (Tenants, Leads, Users tables)
- Payments: Stripe (checkout, subscriptions, webhooks)
- Email: Resend (primary), Gmail SMTP (fallback)
- Solar Data: NREL PVWatts v8, EIA API, USGS 3DEP (all free government APIs)
- Caching: Vercel KV (Redis) for webhook idempotency and rate limiting
- Monitoring: Sentry (errors), UptimeRobot (uptime)

Key URLs

- Main App: https://sunspire-web-app.vercel.app
- Demo: https://sunspire-web-app.vercel.app/?company=Metaa&demo=1
- Demo with Auto Logo: https://sunspire-web-app.vercel.app/?company=Metaa&demo=1&domain=meta.com (logo auto-fetched from Clearbit)
- Paid: https://sunspire-web-app.vercel.app/paid?company=Meta&brandColor=%23FF0000&logo=https%3A%2F%2Flogo.clearbit.com%2Fapple.com
- Admin Dashboard: https://sunspire-web-app.vercel.app/admin/dashboard
- Health Check: https://sunspire-web-app.vercel.app/api/health

Automatic Logo Fetching:
- System uses Clearbit Logo API: https://logo.clearbit.com/{domain}
- When domain parameter provided, logo is automatically fetched
- No manual logo URLs needed for most companies
- Falls back to built-in logo mappings if Clearbit doesn't have logo
- Logo proxy endpoint: /api/logo-proxy (handles CORS/403 issues)

URL Routing Options:
- Option 1: Direct URL with parameters: ?company={name}&demo=1&domain={domain}
- Option 2: Redirect subdomain: demo.sunspiredemo.com/{slug} → redirects to main site
- Option 3: Subdomain routing: {company_slug}.out.sunspire.app/demo (requires DNS setup)

2. CUSTOMER JOURNEY (END TO END)

Step 1: Customer Sees Demo

Customer visits: https://sunspire-web-app.vercel.app/?company=TheirCompany&demo=1

What Happens:
- System detects demo=1 parameter
- Extracts company name from URL parameter
- Automatically fetches company logo from Clearbit API: https://logo.clearbit.com/{domain} (if domain provided)
- Looks up company brand color from built-in database (or uses custom color from URL)
- Applies company branding (logo from Clearbit, colors, company name) automatically
- Shows calculator with "Demo Mode" label
- Shows upgrade CTA buttons
- Limits functionality (demo quota, preview mode)

Technical Details:
- Route: app/page.tsx (homepage)
- Reads company, demo, domain, and brandColor query parameters
- Automatically fetches logo from Clearbit API: https://logo.clearbit.com/{domain} (if domain provided)
- Looks up brand color from built-in database (lib/brandTheme.ts) or uses custom color from URL
- Fetches tenant data from Airtable if company exists (for paid customers)
- Falls back to default branding if company not found
- Logo fetching: Uses Clearbit logo API automatically - no manual logo URLs needed for most companies
- All solar calculations work normally (no demo limitations on calculations)

Step 2: Customer Clicks "Launch" or "Get Started"

Customer clicks CTA button on demo page.

What Happens:
- Frontend calls: POST /api/stripe/create-checkout-session
- Request includes: company name, plan, email (if available), UTM parameters
- API creates Stripe Checkout Session
- Session includes: $399 setup fee + $99/month subscription
- Customer redirected to Stripe checkout page

Technical Details:
- Route: app/api/stripe/create-checkout-session/route.ts
- Creates Stripe session with metadata (company, plan, UTM params)
- Returns checkout URL
- Frontend redirects customer to Stripe

Step 3: Customer Pays on Stripe

Customer enters credit card on Stripe checkout page.

What Happens:
- Stripe processes payment
- Stripe creates subscription
- Stripe redirects customer to success URL
- Stripe sends webhook event to our system

Technical Details:
- Stripe handles all payment processing
- Success URL: /activate?session_id={CHECKOUT_SESSION_ID}&company={company}
- Webhook URL: https://sunspire-web-app.vercel.app/api/stripe/webhook
- Event type: checkout.session.completed

Step 4: Webhook Processes Payment

Stripe sends webhook to our system.

What Happens:
1. Webhook handler receives event
2. Verifies Stripe signature (security)
3. Checks idempotency (prevents duplicate processing)
4. Extracts company name from metadata
5. Creates/updates tenant in Airtable
6. Generates unique API key
7. Sets up custom domain (if company website available)
8. Links customer email as owner
9. Sends onboarding email with magic link

Technical Details:
- Route: app/api/stripe/webhook/route.ts
- Idempotency: Uses Vercel KV (Redis) to track processed events
- Tenant creation: lib/airtable.ts → upsertTenantByHandle()
- API key generation: lib/api-keys.ts → generateApiKey()
- Email sending: lib/email-service.ts → sendOnboardingEmail()
- Magic link: JWT token with 7-day expiration

Step 5: Customer Receives Onboarding Email

Customer gets email with all access information.

What Happens:
- Email sent via Resend (or Gmail SMTP fallback)
- Contains: Instant URL, embed code, API key, dashboard link, magic link
- Customer clicks magic link to access dashboard

Technical Details:
- Email service: lib/email-service.ts
- Primary: Resend API
- Fallback: Gmail SMTP (if Resend fails)
- Magic link: generateMagicLink(email, company) → JWT token

Step 6: Customer Accesses Dashboard

Customer clicks magic link from email.

What Happens:
1. Link format: https://sunspire-web-app.vercel.app/c/{company}?token={jwt}
2. System verifies JWT token
3. Checks token expiration (7 days)
4. Verifies company matches token
5. Stores authentication in sessionStorage
6. Shows dashboard with all deployment options

Technical Details:
- Route: app/c/[companyHandle]/page.tsx
- Token verification: src/server/auth/jwt.ts → verifyMagicLinkToken()
- Session storage: sessionStorage.setItem('auth:{company}', 'true')
- Dashboard fetches tenant data from Airtable

Step 7: Customer Uses Calculator

Customer embeds calculator or shares link.

What Happens:
- Calculator loads with customer's branding
- User enters address, system size, roof details
- System calculates solar estimate
- If paid customer: Leads are captured to Airtable
- If demo: Leads are not saved (or saved with demo flag)

Technical Details:
- Calculator: app/report/page.tsx
- Solar calculation: app/api/estimate/route.ts
- Lead capture: app/api/leads/route.ts (for paid customers)
- Branding: Fetched from Airtable Tenants table

3. CORE COMPONENTS

Frontend (Next.js)

Main Pages:
- app/page.tsx - Homepage (demo/paid detection)
- app/report/page.tsx - Calculator interface
- app/c/[companyHandle]/page.tsx - Customer dashboard
- app/admin/dashboard/page.tsx - Admin dashboard
- app/embed/[slug]/page.tsx - Embeddable calculator

Components:
- components/ - Reusable UI components
- components/quotes/ - Calculator UI components
- components/legal/ - Legal pages (terms, privacy)

Backend (API Routes)

Key Endpoints:
- POST /api/stripe/create-checkout-session - Create Stripe checkout
- POST /api/stripe/webhook - Handle Stripe webhooks
- GET /api/estimate - Calculate solar estimate
- POST /api/leads - Capture leads (paid customers)
- GET /api/health - System health check
- GET /api/admin/dlq - View failed webhooks
- POST /api/gdpr/export - Export customer data
- POST /api/gdpr/delete - Delete customer data

Database (Airtable)

Tables:
- Tenants - Customer accounts (company name, API key, branding, payment status)
- Leads - Captured leads (name, email, address, solar estimate data)
- Users - User accounts (email, tenant association, role)
- Links - Outreach tracking (optional, for cold email campaigns)

Schema:
- Each table has specific fields (see lib/airtable.ts for field names)
- Rate limiting: 5 requests per second per base
- Free tier: 1,200 records per base

Payments (Stripe)

Products:
- Setup Fee: $399 (one-time)
- Monthly Subscription: $99/month
- Business Name: "Sunspire Software" (not "Sunspire Software LLC")
- Automated Tax Collection: Enabled in Stripe

Webhook Events Handled:
- checkout.session.completed - Customer paid (provisions tenant)
- invoice.payment_succeeded - Monthly payment succeeded
- invoice.payment_failed - Payment failed (update status)
- customer.subscription.updated - Subscription changed
- customer.subscription.deleted - Subscription cancelled

Solar Estimation System

Data Sources:
1. NREL PVWatts v8 - Solar production calculations
   - API: https://developer.nrel.gov/api/pvwatts/v8.json
   - Inputs: Location (lat/lng), system size, roof tilt/azimuth, losses
   - Outputs: Annual/monthly kWh production
   - Cache: 30 days (same location/system = cached result)

2. EIA API - Utility rate data
   - API: https://api.eia.gov/v2/electricity/retail-sales/data/
   - Inputs: State code
   - Outputs: Average utility rates by state
   - Cache: 24 hours (daily refresh)

3. USGS 3DEP - Elevation data (for shading)
   - API: https://elevation.nationalmap.gov/arcgis/rest/services/3DEPElevation/ImageServer
   - Inputs: Latitude, longitude
   - Outputs: Elevation data
   - Used for: Shading analysis (optional, not always used)

4. Shading Analysis - Proxy method
   - Method: Geographic and roof orientation-based calculation
   - Accuracy: Medium (70% confidence)
   - Output: Annual shading loss percentage (typically 8-15%)

Calculation Flow:
1. User enters address → Geocoded to lat/lng
2. User enters system size, roof details
3. System calls PVWatts API → Gets production data
4. System calls EIA API → Gets utility rates
5. System calculates: Savings, payback, ROI, cashflow
6. System applies shading analysis (proxy method)
7. Returns complete estimate to user

Authentication & Access

Magic Links:
- Format: JWT token with email + company
- Expiration: 7 days
- Verification: src/server/auth/jwt.ts
- Storage: Token in URL, auth status in sessionStorage

Admin Access:
- Admin token: Stored in Vercel env var ADMIN_TOKEN
- Required for: Admin dashboard, GDPR endpoints, webhook replay
- Security: Timing-safe comparison (prevents timing attacks)

Email System

Primary: Resend
- API: Resend API
- Free tier: 100 emails/day
- Fallback: Gmail SMTP if Resend fails

Emails Sent:
1. Onboarding email (after payment)
2. Magic link emails (for dashboard access)
3. Password reset emails (if implemented)

Bounce Handling:
- Resend webhook: POST /api/webhooks/resend
- Tracks bounces and complaints
- Updates Airtable tenant email status

4. PAYMENT FLOW (STRIPE)

Checkout Creation

When: Customer clicks "Launch" button

Process:
1. Frontend calls POST /api/stripe/create-checkout-session
2. Request body: { company, plan, email, utm_source, utm_campaign }
3. API creates Stripe Checkout Session:
   - Line items: $99/month subscription + $399 setup fee
   - Metadata: company, plan, UTM params
   - Success URL: /activate?session_id={CHECKOUT_SESSION_ID}
   - Cancel URL: /?canceled=1
4. Returns checkout URL
5. Frontend redirects customer to Stripe

Payment Processing

When: Customer pays on Stripe

Process:
1. Stripe processes credit card
2. Stripe creates subscription
3. Stripe redirects to success URL
4. Stripe sends webhook event

Webhook Processing

When: Stripe sends checkout.session.completed event

Process:
1. Webhook handler receives POST request
2. Verifies Stripe signature (prevents fake webhooks)
3. Extracts event ID
4. Checks idempotency in Vercel KV:
   - If event already processed → Return null (skip)
   - If new event → Continue processing
5. Extracts company name from metadata
6. Creates/updates tenant in Airtable:
   - Company handle
   - Plan (Starter/Pro)
   - Payment status: "Paid"
   - Stripe customer ID
   - Stripe subscription ID
   - API key (generated)
   - Login URL: /c/{company}
   - Capture URL: /v1/ingest/lead
7. Sets up custom domain (if company website available)
8. Links customer email as owner in Users table
9. Sends onboarding email with magic link
10. Marks event as processed in Vercel KV (24-hour TTL)

Idempotency (Critical):
- Prevents duplicate processing if webhook fires multiple times
- Uses Vercel KV (Redis) to store processed event IDs
- 24-hour TTL (events older than 24 hours can be replayed)
- Key format: webhook:processed:{eventId}

What Happens If Webhook Fails

Automatic Retries:
- Stripe retries webhooks 3 times automatically
- Retry schedule: 1 hour, 6 hours, 12 hours after failure
- If all retries fail → Event goes to Dead Letter Queue (DLQ)

Dead Letter Queue:
- Failed events stored in Vercel KV
- Admin can view in dashboard: /admin/dashboard
- Admin can replay failed events manually
- Events stored for 30 days

Common Failure Causes:
1. Airtable rate limit (5 req/sec) → Wait 5 min, replay
2. Resend API failure → Falls back to Gmail SMTP
3. Missing company metadata → Cannot process, manual fix needed
4. Network timeout → Usually succeeds on retry

5. SOLAR ESTIMATION SYSTEM

How It Works

User Flow:
1. User enters address → System geocodes to lat/lng
2. User enters system size (kW)
3. User enters roof details (tilt, azimuth, losses %)
4. System calculates estimate
5. Returns: Production, savings, payback, ROI, cashflow

API Endpoint: GET /api/estimate

Parameters:
- address - Street address
- lat - Latitude
- lng - Longitude
- state - State code
- systemKw - System size in kW
- tilt - Roof tilt in degrees
- azimuth - Roof azimuth in degrees (180 = south)
- lossesPct - System losses percentage (default: 14%)

Response:
``json
{
  "estimate": {
    "annualProduction": 12000,
    "monthlyProduction": [800, 900, ...],
    "annualSavings": 2400,
    "paybackYears": 8.5,
    "roi": 12.5,
    "cashflow": [...],
    "shadingAnalysis": {
      "method": "proxy",
      "accuracy": "medium",
      "shadingFactor": 0.9,
      "annualShadingLoss": 10
    }
  }
}
`

Data Sources

NREL PVWatts v8:
- Purpose: Calculate solar production
- API: https://developer.nrel.gov/api/pvwatts/v8.json
- Inputs: Location, system size, roof orientation, losses
- Outputs: Annual/monthly kWh production
- Cache: 30 days (same inputs = cached)
- Cost: Free (government API)
- Rate limit: 1,000 requests/hour

EIA API:
- Purpose: Get utility rates
- API: https://api.eia.gov/v2/electricity/retail-sales/data/
- Inputs: State code
- Outputs: Average utility rates ($/kWh)
- Cache: 24 hours (daily refresh)
- Cost: Free (government API)

Shading Analysis:
- Method: Proxy calculation (geographic + roof orientation)
- Accuracy: Medium (70% confidence)
- Output: Annual shading loss percentage (8-15% typical)
- Cost: Free (no external API)

Calculation Details

Production Calculation:
1. Call PVWatts API with user inputs
2. Get annual/monthly production (kWh)
3. Apply shading loss (if calculated)
4. Return production data

Savings Calculation:
1. Get utility rate from EIA API (or state average)
2. Calculate: Annual savings = Annual production × Utility rate
3. Account for net metering (if applicable)
4. Apply rate escalation (2.5% per year default)

Payback Calculation:
1. System cost = System size (kW) × $3.00/watt (default)
2. Apply incentives (ITC 30%, state rebates if any)
3. Net cost = System cost - Rebates - ITC
4. Payback = Net cost ÷ Annual savings

ROI Calculation:
1. Calculate 25-year cashflow
2. Apply discount rate (7% default)
3. Calculate NPV (Net Present Value)
4. ROI = (NPV - Net cost) ÷ Net cost × 100

6. AUTHENTICATION & ACCESS

Magic Links

How They Work:
1. System generates JWT token with email + company
2. Token expires in 7 days
3. Token included in dashboard URL: /c/{company}?token={jwt}
4. User clicks link → System verifies token
5. If valid → User authenticated, session stored
6. If invalid/expired → Show error, request new link

Token Format:
- JWT (JSON Web Token)
- Payload: { email, company, exp }
- Signed with: JWT_SECRET (from Vercel env vars)
- Expiration: 7 days from generation

Verification:
- Function: verifyMagicLinkToken(token) in src/server/auth/jwt.ts
- Checks: Signature valid, not expired, company matches
- Returns: { email, company } or null if invalid

Session Storage:
- After verification: sessionStorage.setItem('auth:{company}', 'true')
- Persists for browser session (cleared on close)
- Dashboard checks this to allow access

Admin Access

Admin Token:
- Stored in: Vercel env var ADMIN_TOKEN
- Required for: Admin dashboard, GDPR endpoints, webhook replay
- Security: Timing-safe comparison (prevents timing attacks)

Admin Endpoints:
- GET /api/admin/metrics - System metrics
- GET /api/admin/dlq - View failed webhooks
- GET /api/admin/replay-webhook - Replay failed webhook
- POST /api/admin/create-tenant - Manually create tenant
- GET /admin/dashboard - Admin dashboard UI

7. DATA STORAGE (AIRTABLE)

Tables

Tenants Table:
- Stores customer accounts
- Fields: Company Handle, Plan, Payment Status, API Key, Branding (logo, colors), Stripe IDs, Domain, Login URL, Capture URL
- Key: Company Handle (unique identifier)

Leads Table:
- Stores captured leads from calculator
- Fields: Name, Email, Address, System Size, Estimate Data, Tenant (link to Tenants table), Created Date
- Links to: Tenants table (which customer this lead belongs to)

Users Table:
- Stores user accounts (customer owners/admins)
- Fields: Email, Tenant (link to Tenants table), Role, Created Date
- Links to: Tenants table (which tenant this user belongs to)

Rate Limiting

Airtable API Limits:
- 5 requests per second per base
- Free tier: 1,200 records per base
- If exceeded: API returns 429 (Too Many Requests)

How We Handle:
- Circuit breaker: If Airtable fails repeatedly, circuit opens
- Retry logic: Exponential backoff on failures
- Rate limiting: Client-side rate limiting (1000 req/hour per IP)

Schema Versioning

Why It Matters:
- Airtable schema can change
- Code expects specific field names
- Mismatch = errors

How We Handle:
- Field names stored as constants in lib/airtable.ts
- Easy to update if Airtable schema changes
- Validation: Check fields exist before using

8. EMAIL SYSTEM

Primary: Resend

Service: Resend API
- Free tier: 100 emails/day
- Paid tier: $20/month (unlimited)
- API key: Stored in Vercel env var RESEND_API_KEY

How It Works:
1. System calls Resend API
2. Resend sends email
3. If fails → Falls back to Gmail SMTP

Fallback: Gmail SMTP

Service: Gmail SMTP
- Used if Resend fails
- SMTP settings: Stored in Vercel env vars
- Less reliable but works as backup

Emails Sent

Onboarding Email:
- When: After customer pays (webhook processes)
- Contains: Instant URL, embed code, API key, dashboard link, magic link
- Template: lib/email-service.ts → sendOnboardingEmail()

Magic Link Email:
- When: Customer requests dashboard access
- Contains: Magic link to dashboard
- Template: lib/email-service.ts → generateMagicLink()

Bounce Handling

Webhook: POST /api/webhooks/resend
- Events: "Email Bounced", "Email Complained"
- Updates: Airtable tenant email status
- Action: Mark email as bounced/complained

9. ERROR HANDLING & RELIABILITY

Circuit Breakers

What They Are:
- Pattern to prevent cascading failures
- If service fails repeatedly → Circuit opens
- Stops calling broken service for a period
- Auto-recovers after timeout

Services Protected:
- Airtable API
- Stripe API
- Resend API
- NREL PVWatts API

How It Works:
1. Service called → Success → Circuit closed (normal)
2. Service fails → Failure count increases
3. Failures exceed threshold → Circuit opens
4. Circuit open → Requests fail fast (don't call service)
5. After timeout → Circuit half-open (test call)
6. If test succeeds → Circuit closed (recovered)
7. If test fails → Circuit opens again

Dead Letter Queue (DLQ)

What It Is:
- Storage for failed webhook events
- Events that failed after all retries
- Admin can review and replay manually

How It Works:
1. Webhook fails → Stripe retries 3 times
2. All retries fail → Event stored in DLQ
3. Stored in: Vercel KV (Redis)
4. Admin views: /admin/dashboard → DLQ section
5. Admin replays: Click "Replay" button
6. Event removed: After successful replay

Storage:
- Vercel KV (Redis)
- Key format: dlq:event:{eventId}
- TTL: 30 days (auto-deleted after)

Retry Logic

Automatic Retries:
- Stripe webhooks: 3 retries (1 hour, 6 hours, 12 hours)
- API calls: Exponential backoff (500ms, 1s, 2s, 4s)
- Max retries: 3 attempts

Manual Retries:
- Admin can replay failed webhooks from dashboard
- Useful for: Airtable rate limits, transient errors

Correlation IDs

What They Are:
- Unique ID for each request
- Tracks request through entire system
- Makes debugging 10x easier

How It Works:
1. Request comes in → Generate correlation ID
2. Add to response headers: x-correlation-id
3. Log all operations with correlation ID
4. If error → Search logs by correlation ID → See entire flow

10. SECURITY FEATURES

Security Headers

Configured in: next.config.js and middleware.ts

Headers:
- Content-Security-Policy - Prevents XSS attacks
- X-Frame-Options - Prevents clickjacking
- Strict-Transport-Security - Forces HTTPS
- X-Content-Type-Options - Prevents MIME sniffing
- Permissions-Policy - Restricts browser features

XSS Protection

Input Sanitization:
- All user inputs sanitized with DOMPurify
- Function: lib/sanitize.ts → sanitizeText(), sanitizeObject()
- Prevents: Script injection, HTML injection

CSRF Protection

How It Works:
- Stripe webhooks: Signature verification (prevents fake webhooks)
- Admin endpoints: Admin token required
- API endpoints: Rate limiting (prevents abuse)

Secret Management

All Secrets in Vercel:
- Stripe keys
- Airtable API key
- Resend API key
- JWT secret
- Admin token
- Never in Git (checked by .gitignore)

Timing-Safe Comparisons

Why It Matters:
- Prevents timing attacks
- Admin token comparison: Timing-safe
- Function: lib/security.ts → timingSafeEqual()

11. MONITORING & OBSERVABILITY

Sentry (Error Tracking)

What It Does:
- Tracks errors and exceptions
- Performance monitoring
- User session tracking

Free Tier:
- 5,000 errors/month
- 5GB logs/month
- 1 user

When You'll Hit:
- 5,000 errors/month = ~167 errors/day
- If bug causes repeated errors → Hit quickly

Upgrade: $26/month (Team plan)

UptimeRobot (Uptime Monitoring)

What It Does:
- Monitors critical endpoints
- Alerts if service down
- Tracks uptime percentage

Monitors:
- /api/health - System health
- /api/generate-pdf - PDF generation
- /api/webhooks/stripe - Webhook endpoint

Admin Dashboard

URL: /admin/dashboard

Shows:
- System health (all services)
- Circuit breaker states
- DLQ count and events
- Failed webhooks (with error messages)

Health Endpoint

URL: /api/health

Response:
`json
{
  "ok": true,
  "timestamp": "2026-01-25T12:00:00Z",
  "services": {
    "airtable": { "status": "ok" },
    "stripe": { "status": "ok" },
    "resend": { "status": "ok" },
    "pvwatts": { "status": "ok" }
  },
  "circuitBreakers": {
    "airtable": "CLOSED",
    "stripe": "CLOSED"
  }
}
``

12. WHAT HAPPENS WHEN THINGS BREAK

Webhook Fails

Symptoms:
- Customer paid but no account created
- No onboarding email sent
- Customer can't access dashboard

Diagnosis:
1. Check Stripe dashboard → Webhook events → See failures
2. Check admin dashboard → DLQ → See failed events
3. Check error message → Identify cause

Common Causes:
1. Airtable rate limit → Wait 5 min, replay
2. Missing company metadata → Manual fix needed
3. Resend API failure → Usually succeeds on retry
4. Network timeout → Usually succeeds on retry

Fix:
1. Go to admin dashboard
2. View DLQ events
3. Click "Replay" on failed event
4. If still fails → Check error message, fix root cause

Airtable Rate Limit

Symptoms:
- API calls failing with 429 (Too Many Requests)
- Circuit breaker opens
- Tenant creation fails

Diagnosis:
- Check Airtable API usage
- Check circuit breaker state in admin dashboard

Fix:
1. Wait 5 minutes (rate limit resets)
2. Replay failed webhook from admin dashboard
3. If persistent → Reduce API call frequency

Email Not Sending

Symptoms:
- Customer paid but no email received
- Magic link emails not arriving

Diagnosis:
1. Check Resend dashboard → See email status
2. Check bounce rate → High bounces = deliverability issue
3. Check fallback → Gmail SMTP might be used

Fix:
1. Check Resend API key (valid?)
2. Check bounce rate (too high?)
3. Verify email address (valid?)
4. Check spam folder
5. Resend manually from admin dashboard

Solar Calculation Fails

Symptoms:
- Calculator shows error
- No estimate returned
- "Unable to calculate" message

Diagnosis:
1. Check PVWatts API status
2. Check EIA API status
3. Check input validation (invalid address?)

Fix:
1. Check API status (NREL, EIA)
2. Verify user inputs (valid address, system size?)
3. Check fallback calculations (if API fails)
4. Contact support if persistent

Customer Can't Access Dashboard

Symptoms:
- Magic link doesn't work
- "Invalid or expired link" error
- Dashboard shows "Not authenticated"

Diagnosis:
1. Check token expiration (7 days)
2. Check company name matches
3. Check JWT secret (valid?)

Fix:
1. Generate new magic link (from admin or email)
2. Verify company name matches
3. Check JWT secret in Vercel env vars
4. Clear browser cache/sessionStorage

13. HOW TO EXPLAIN THE SYSTEM TO CUSTOMERS

Simple Explanation (Non-Technical)

"Sunspire is a white-label solar calculator that you can embed on your website or share as a link. When someone uses it, they enter their address and roof details, and the calculator shows them how much solar would cost, how much they'd save, and when they'd break even. All the leads (name, email, address) are automatically captured and saved to your dashboard, so you can follow up with them."

What They Get

"After you sign up, you'll get:
1. A branded calculator with your logo and colors
2. An embed code to put on your website
3. A shareable link you can send to prospects
4. A dashboard where all your leads are saved
5. An API key if you want to integrate with your CRM"

How It Works

"Here's the process:
1. You embed the calculator on your website or share the link
2. A prospect enters their address and roof details
3. The calculator shows them a detailed solar estimate
4. If they're interested, they enter their contact info
5. That lead is automatically saved to your dashboard
6. You can export the leads or integrate with your CRM"

Technical Details (If They Ask)

"The calculator uses government data sources (NREL, EIA) to calculate accurate solar estimates. It accounts for your location, roof orientation, system size, and local utility rates. The calculations are done in real-time, and all the data is securely stored. You can access your dashboard anytime with a secure link we send you."

14. HOW TO EXPLAIN THE SYSTEM TO TECHNICAL PEOPLE

Architecture

"Sunspire is a Next.js 14 application deployed on Vercel. The frontend is React with TypeScript, and the backend uses Next.js API routes (serverless functions). Data is stored in Airtable (NoSQL database), payments are processed through Stripe, and emails are sent via Resend (with Gmail SMTP fallback). Solar calculations use NREL PVWatts v8 and EIA APIs (both free government APIs)."

Data Flow

"Here's the technical flow:
1. Customer visits demo → Next.js page renders with company branding from Airtable
2. Customer clicks checkout → API creates Stripe Checkout Session
3. Customer pays → Stripe webhook fires → Our webhook handler processes it
4. Webhook handler: Verifies idempotency (Vercel KV), creates tenant in Airtable, generates API key, sends onboarding email
5. Customer accesses dashboard → Magic link (JWT) verifies → Shows dashboard with deployment options
6. Calculator usage → API calculates estimate (PVWatts + EIA), captures lead to Airtable (if paid customer)"

Key Technical Details

"Idempotency: Webhook handler uses Vercel KV (Redis) to prevent duplicate processing. Circuit breakers protect against cascading failures. Correlation IDs track requests through the system. Failed webhooks go to DLQ (Dead Letter Queue) for manual replay. Security: XSS sanitization (DOMPurify), CSRF protection, security headers, timing-safe comparisons."

APIs Used

"NREL PVWatts v8: Solar production calculations (cached 30 days). EIA API: Utility rate data (cached 24 hours). USGS 3DEP: Elevation data (for shading, optional). All free government APIs, no authentication needed except NREL (free API key)."

SUMMARY

Sunspire is a production-ready SaaS platform for white-label solar calculators. It handles payments, provisioning, lead capture, and solar calculations automatically. The system is built with reliability in mind (circuit breakers, retries, DLQ) and security best practices (XSS protection, CSRF protection, security headers).

Key components:
- Frontend: Next.js 14 (React)
- Backend: Next.js API routes (serverless)
- Database: Airtable
- Payments: Stripe
- Email: Resend (primary), Gmail SMTP (fallback)
- Solar Data: NREL PVWatts v8, EIA API
- Caching: Vercel KV (Redis)
- Monitoring: Sentry, UptimeRobot

If something breaks:
1. Check admin dashboard for system health
2. Check DLQ for failed webhooks
3. Check Sentry for errors
4. Check UptimeRobot for downtime
5. Replay failed webhooks from admin dashboard
6. Fix root cause based on error messages

This system is designed to run reliably with minimal intervention. Most issues are transient and resolve on retry. The DLQ system ensures nothing is lost even if webhooks fail.