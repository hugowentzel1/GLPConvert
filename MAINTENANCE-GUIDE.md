# GLPConvert — maintenance guide

**Product:** GLPConvert · **Operator:** Wellspire LLC (see legal pages for registered address).  
**Production URL (default):** `https://glp-convert.vercel.app` — when you add a custom domain, use that URL in monitors and curls below.  
**Ops inbox:** Point **UptimeRobot**, **Sentry**, and your own reminders at an address you actually read (**`support@glpconvert.com`** is the default in app copy; forward or replace as needed).

This file is the **checklist for ongoing ops**: what to verify, how often, and where to click. Synthetic monitoring details: **`docs/SYNTHETIC-MONITORING.md`**. Full health → route mapping: **`docs/API-HEALTH-COVERAGE.md`**. Failure playbooks: **`docs/RUNBOOK-FAILURES.md`**.

---

## What to check (at a glance)

| When | What | How |
|------|------|-----|
| **Always on (automated)** | Site + integrations reachable | **UptimeRobot** (or Better Stack, Pingdom, etc.): HTTP monitor on **`GET /api/health`** → alert when status ≠ **200**. |
| **Always on (automated)** | Production errors | **Sentry** → **Alerts** → email (or Slack) on new issues / spikes. Requires **`SENTRY_DSN`** + **`NEXT_PUBLIC_SENTRY_DSN`** in Vercel. |
| **Every 30 minutes (automated)** | Primary funnel + buyer checkout (Playwright) | **GitHub Actions** → workflow **Synthetic monitoring** on **this repo** (not the old Sunspire repo). Results appear on **`/status`** under *Synthetic monitoring*. Optional: notify on failure via GitHub **Settings → Notifications → Actions** (ignore the Sunspire repo if you do not want those emails). |
| **Daily (~5 min)** | Human sanity pass *if nothing pinged you* | Open **`/status`**: service rows from **`/api/health`**, synthetic PASS/FAIL, config flags. Glance **Sentry** unresolved issues. |
| **Weekly (~15 min)** | Admin, DLQ, Stripe | **`/admin/dashboard`**, DLQ replay if needed, Stripe Dashboard → **Webhooks** success rate. Confirm last synthetic run is not stuck failing. |
| **Monthly (~30 min)** | Backups, deps, trends | Export or verify **Supabase** backups; **`npm audit`** / **`npm outdated`**; review **Sentry** trends; rotate secrets if policy requires. |

**Principle:** Do **not** rely on manually opening **`/status`** every day as your *only* signal — **UptimeRobot + Sentry (+ optional GitHub email for synthetics)** should tell you when to look.

---

## What you have set up (and how it covers APIs)

• **Health endpoint:** GET /api/health — Single source of truth. Probes every configured external API: **Supabase** (tenants/leads), **Stripe** (balance), **NREL PVWatts** (quote), **EIA** (rates), **Google Geocoding** (server geo), **Resend** (email), **Google Places** (config only; client autocomplete), **Vercel KV** (when KV_REST_API_URL + KV_REST_API_TOKEN set; DLQ, idempotency, rate limiting), **USGS 3DEP** (elevation/shading for estimates). Each check has 5s timeout (8s for USGS). Returns 200 if all ok, 503 if any down. Response includes `services` and **`config`** (which integrations have env set, no values) to catch production env drift. Only services with env vars set are checked; Stripe is omitted if the key is invalid so health can still pass.
• **Rate limiting:** Quote/estimate (1000/hr per IP), lead submit, Stripe checkout — all protected. Webhook is idempotent (replay-safe).
• **Error monitoring:** Sentry on frontend + API; uncaught errors and rejections captured.
• **Canary-style checks:** Smoke + API tests (health, estimate, geo, lead, Stripe webhook) run in CI and via prod-smoke workflow against production.

**Does it cover all APIs?** Yes. Health explicitly checks: Supabase, Stripe, NREL, EIA, Google Geocoding, Resend, Google Places (config), Vercel KV (when configured), USGS 3DEP. Quote engine = NREL + EIA + USGS 3DEP; Google Places is client-only — if it fails, users can still type address and server geocode works. Revenue path (quote, lead, Stripe webhook) is guarded with try/catch and clear errors. /status shows every checked service and reminds you to use **UptimeRobot + Sentry** (and the **synthetic** block for journey checks). **Most likely production bug:** env/config drift (missing or wrong var in Vercel). Use health **`config`** and **`/status`** when investigating; see **docs/INTEGRATION-FAILURE-PREVENTION.md**.

**How to use it to be sure dependencies are up:**
1. **Single place:** Open **`https://glp-convert.vercel.app/status`** (or your custom domain). Shows **Supabase**, **Stripe**, **NREL**, **EIA**, **Google Geocoding**, **Resend**, **Google Places** (config), **Vercel KV** (if set), **USGS 3DEP**, plus **Synthetic monitoring** (last GitHub Actions run). Auto-refreshes every 60s; use **Refresh now** as needed.
2. **UptimeRobot:** Monitor **`GET https://glp-convert.vercel.app/api/health`**. When status ≠ **200**, alert your ops inbox (**`support@glpconvert.com`** or your choice).
3. **Sentry:** **`SENTRY_DSN`** + **`NEXT_PUBLIC_SENTRY_DSN`** in Vercel. **Settings → Alerts** → same ops inbox. Covers API routes, server, and client.
4. **CLI:** `curl https://glp-convert.vercel.app/api/health` — expect `"ok": true` and each probed service `"status": "ok"` (or **degraded** where designed). If **503** or **down**, see **WHEN SOMETHING BREAKS** below.
5. **Optional:** `BASE_URL=https://glp-convert.vercel.app npx playwright test tests/e2e/smoke.spec.ts tests/api/route-integration.spec.ts` — see **QA_SPEC.md** Section D.

**Every API in the quote/lead/payment path is covered by /api/health.** See docs/API-HEALTH-COVERAGE.md for the full route list and which services are probed.

---
📋 DAILY CHECKS (5 minutes)

**Goal:** Prefer **automated** alerts (UptimeRobot, Sentry, optional GitHub Actions for synthetics). Use this list when you are doing a deliberate daily pass or following up on an alert. See **docs/HEALTH-ALERTS-SETUP.md** for a short setup page.

1. **UptimeRobot (or equivalent)**
- **Dashboard:** https://dashboard.uptimerobot.com  
- **Monitor:** `GET https://glp-convert.vercel.app/api/health` (or your production domain). Alert when HTTP status ≠ **200**.  
- **Alert contact:** Your ops inbox (e.g. **`support@glpconvert.com`**).  
- **If red:** Vercel deployment + **`/status`** (which service) + vendor status pages (Supabase, Stripe, Google, etc.).

2. **Sentry**
- **Dashboard:** https://sentry.io  
- **Alerts:** Project **Settings → Alerts** → ops inbox.  
- **If spike:** Open the issue group, check release/environment, fix or mute false positives.

3. **Quick pass — `/status`**
- **Browser:** `https://glp-convert.vercel.app/status` — health-driven service rows, **Config (env set)**, **Synthetic monitoring** (Primary funnel + Buyer checkout).  
- **CLI:** `curl https://glp-convert.vercel.app/api/health`  
- **Synthetic failures:** GitHub → **Actions** → **Synthetic monitoring** → open the failed run → download **synthetic-test-results** artifact if needed (`docs/SYNTHETIC-MONITORING.md`).

📅 WEEKLY CHECKS (15 minutes)

1. **Synthetic monitoring (GitHub)**  
- **Repo:** GLPConvert (not Sunspire). **Actions** → **Synthetic monitoring** — confirm recent runs are green; if red, use logs + artifact, then **`/status`** to see posted FAIL state.  
- Ensure workflow targets production (default **`https://glp-convert.vercel.app`** unless you overrode **Variables**).

2. Admin Dashboard Review
- URL: https://glp-convert.vercel.app/admin/dashboard
- Steps:
  1. Enter admin token when prompted
  2. Check System Health - all should be green
  3. Check Circuit Breakers - should all be "CLOSED"
  4. Check DLQ Count - should be 0 or very low

3. Review Failed Webhooks (DLQ)
- If DLQ has events:
  1. Click "Show DLQ Events" button
  2. Review each failed webhook:
     - Check error message
     - Check event type (usually checkout.session.completed)
     - Check timestamp
  3. Common causes:
     - Supabase/DB error: Check connection and tenant exists; replay
     - Stripe API error: Usually transient, replay works
     - Missing tenant: Create tenant first, then replay
  4. Replay a webhook:
     `bash
     curl -X GET "https://glp-convert.vercel.app/api/admin/replay-webhook?event_id=evt_xxx" \
       -H "x-admin-token: YOUR_ADMIN_TOKEN"
     `
  5. Remove from DLQ after successful replay:
     - Click "Remove" button in admin dashboard

📆 MONTHLY CHECKS (30 minutes)

1. Backup: Export Supabase data (Table Editor → export or pg_dump). Optional: note tenant configs if you need recovery.
2. Dependency Security Audit
`bash
npm audit
npm outdated
`
- Action: Fix high/critical vulnerabilities immediately
- Action: Update dependencies as needed (test first)

3. Review Stripe Webhooks
- Stripe Dashboard: https://dashboard.stripe.com/webhooks
- Check:
  - Success rate should be >99%
  - Review failed events
  - Compare with DLQ events in admin dashboard

4. Supabase (optional sanity check)
- Dashboard: https://app.supabase.com → your project → **Reports** / **Database**: monitor size, slow queries, and auth/API usage trends.

5. Review Sentry Trends
- Sentry Dashboard: Review error trends
- Look for:
  - Error rate increases
  - New error patterns
  - Performance degradation

🚨 WHEN SOMETHING BREAKS

Issue: Health Check Shows Services Down

Step 1: Check Vercel Deployment
- Go to: https://vercel.com/dashboard
- Check latest deployment status
- Review function logs for errors

Step 2: Check External Services
- Supabase: https://status.supabase.com
- Stripe: https://status.stripe.com
- NREL: Usually reliable, check their status page

Step 3: Check Circuit Breakers
- Admin dashboard → Circuit Breakers
- If "OPEN" = service is failing
- Circuit breaker auto-recovers after timeout
- If stuck, check service status pages

Issue: Webhook Events Failing

Step 1: Check DLQ
- Admin dashboard → DLQ section
- Review failed events
- Check error messages

Step 2: Common Causes & Fixes

Error   Cause   Fix
"Supabase rate limit" / DB errors   Too many requests or pool   Back off, check Supabase dashboard, replay webhook if needed
"Stripe API error"   Transient API issue   Replay webhook (usually works)
"Tenant not found"   Tenant doesn't exist   Create tenant first, then replay
"Invalid data"   Data format issue   Fix data in Supabase (Table Editor) or tenant config, then replay

Step 3: Replay a Webhook
`bash
curl -X GET "https://glp-convert.vercel.app/api/admin/replay-webhook?event_id=evt_xxx" \
  -H "x-admin-token: YOUR_ADMIN_TOKEN"
`

Step 4: Remove from DLQ
- After successful replay, click "Remove" in admin dashboard
- Or use DELETE endpoint:
`bash
curl -X DELETE "https://glp-convert.vercel.app/api/admin/dlq?eventId=evt_xxx" \
  -H "x-admin-token: YOUR_ADMIN_TOKEN"
`

Issue: Customer Can't Access Dashboard

Step 1: Check Tenant Exists
- Supabase → Tenants table
- Search by company handle or email
- Verify tenant record exists

Step 2: Check Subscription Status
- Stripe Dashboard → Customers
- Find customer by email
- Verify subscription is active

Step 3: Resend Onboarding Email
- Use admin endpoint or manually trigger
- Check Resend dashboard for delivery status

Step 4: Check Magic Link
- Verify magic link hasn't expired (24 hour TTL)
- Generate new magic link if needed

Issue: Solar Estimation Inaccurate

Step 1: Check NREL API Status
- Health endpoint shows NREL status
- If down, estimation falls back to cached data

Step 2: Check Shading Data
- USGS 3DEP may be slow for some locations
- System falls back to precomputed data

Step 3: Verify Input Data
- Check address is correct
- Verify system size parameters
- Review estimation logs in Sentry

🔐 SECURITY INCIDENTS

If You Suspect a Security Breach

Immediate Actions:
1. Rotate all API keys:
   - Stripe API keys (Stripe Dashboard)
   - Supabase API key (Supabase Dashboard)
   - Resend API key (Resend Dashboard)
   - Admin token (update in Vercel env vars)

2. Check Access Logs:
   - Vercel → Function Logs
   - Sentry → Events
   - Review for suspicious activity

3. Review Recent Changes:
   - Git commit history
   - Vercel deployment history
   - Check for unauthorized deployments

4. Notify Affected Users:
   - If customer data compromised
   - Follow GDPR requirements
   - Document incident

📊 UNDERSTANDING THE SYSTEM

How It Works (For Client Communication)

1. Customer Journey:
`
Customer sees demo → Clicks "Launch" → Pays on Stripe → 
Webhook processes payment → Tenant created → Email sent → 
Customer accesses dashboard
`

2. If Webhook Fails:
- Event stored in DLQ (Dead Letter Queue)
- Admin can view and replay from dashboard
- System retries automatically (Stripe retries 3 times)
- After retries exhausted, manual replay needed

3. System Components:
- Frontend: Next.js app on Vercel
- Database: Supabase (Tenants, Leads, Users)
- Payments: Stripe (checkout, subscriptions, webhooks)
- Email: Resend (primary), SMTP (fallback)
- Solar Data: NREL APIs (PVWatts, NSRDB, EIA)
- Monitoring: Sentry (errors), UptimeRobot (uptime)

4. What Each Service Does:
- Supabase: Stores all customer data (tenants, leads, users)
- Stripe: Handles payments and subscriptions
- Resend: Sends transactional emails
- NREL: Provides solar estimation data (free government APIs)
- Vercel: Hosts the application (serverless functions)
- Sentry: Tracks errors and performance
- UptimeRobot: Monitors uptime of critical endpoints

🛠️ COMMON TASKS

Add a New Tenant Manually
`bash
curl -X POST "https://glp-convert.vercel.app/api/admin/create-tenant" \
  -H "x-admin-token: YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "companyHandle": "acme",
    "plan": "Pro",
    "brandColors": "#FF0000",
    "logoURL": "https://example.com/logo.png"
  }'
`

Export Customer Data (GDPR)
`bash
curl -X POST "https://glp-convert.vercel.app/api/gdpr/export" \
  -H "x-admin-token: YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"email": "customer@example.com"}'
`

Delete Customer Data (GDPR)
`bash
curl -X POST "https://glp-convert.vercel.app/api/gdpr/delete" \
  -H "x-admin-token: YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"email": "customer@example.com", "confirm": "DELETE"}'
`

Check System Health
`bash
curl https://glp-convert.vercel.app/api/health
``

📞 SUPPORT CONTACTS

**GLPConvert / Wellspire (product ops)**  
- **Support (in-app default):** support@glpconvert.com — use for UptimeRobot, Sentry, and customer-facing support as configured.  
- **Legal entity:** Wellspire LLC — full address and policies on live **`/legal/*`** pages (update this line if the legal footer changes).  
- **Billing / Stripe:** Use the business profile shown in **Stripe Dashboard** and on your **Terms / Refund** pages; keep them aligned with Wellspire LLC filings.

**Legacy Sunspire Software LLC** (prior product) may still appear in old docs or inbox history; new GLPConvert deployments should standardize on **Wellspire LLC** + **`support@glpconvert.com`** for ops alerts.

Service Support:
- Vercel Support: https://vercel.com/support
- Stripe Support: https://support.stripe.com (automated tax collection enabled)
- Supabase: https://supabase.com/docs/guides/platform (dashboard + docs)
- Resend Support: https://resend.com/support
- Sentry Support: https://sentry.io/support
- Namecheap Support: https://www.namecheap.com/support
- Google Workspace Support: admin.google.com

---
PRE-OUTBOUND RELIABILITY CHECKLIST (authoritative before cold outreach)

Use this to confirm you are safe to scale. All of the below are covered in this guide or in code.

**Section 1 — Dependency control**  
✔ Done. MAINTENANCE-GUIDE “What you have set up” + QA_SPEC.md A.4 list every dependency (Stripe, Supabase, quote/NREL+EIA, Google Places + Geocoding, Resend, Sentry, webhooks). Purpose, env vars, and fallback are in this guide; no separate dependencies.md (you asked to keep to main docs).

**Section 2 — /api/health**  
✔ Done. One endpoint checks Supabase, Stripe, NREL, EIA, Google Geocoding, Resend, Google Places (config), Vercel KV (when configured), USGS 3DEP. 5s timeouts (8s for USGS), structured JSON, no secrets. Returns 200 when all ok, 503 when any down. /status page shows user-facing "System Status" from the same health response. Full route-to-health mapping: docs/API-HEALTH-COVERAGE.md.

**Section 3 — Sentry + Vercel**  
✔ Done. Sentry in frontend + API (sentry.client/server/edge.config, next.config). Vercel: prod env vars, main deploys, rollback via redeploy — see “When something breaks” and “Production settings” in this guide. Rate limiting: quote (1000/hr per IP), lead, Stripe checkout; webhook idempotent.

**Section 4 — Canary / synthetic tests**  
✔ Done. **CI:** Playwright smoke + API tests; **prod-smoke** workflow. **Scheduled:** **Synthetic monitoring** workflow (every **30 min**) runs primary GLP funnel + buyer checkout against production and POSTs results to **`/api/synthetic-results`** (see **`docs/SYNTHETIC-MONITORING.md`**). **UptimeRobot** on **`/api/health`** remains the fastest “is prod up?” signal.

**Section 5 — Safe failure design**  
✔ Done. Quote fail → JSON error / “Estimates temporarily unavailable” style. Stripe: no unlock without webhook verification. Lead: retry + DLQ; no silent drop. Wrong tenant logo / default config: guarded by tenant resolution and demo params.

**Section 6 — User-facing health**  
✔ Done. /status page calls /api/health and shows “System Status” with ✔ Operational / Degraded / Down per service (Quotes, Payments, Data storage, etc.). No secrets exposed.

**Section 7 — Lead delivery (optimal setup)**  
See “Lead delivery — optimal setup” below. Current: instant store in Supabase; optional CRM/webhook later. Recommended: add instant email notification to installer on new lead (sources + how-to below).

**Section 8 — Stripe + financial**  
✔ Your checklist. Confirm bank connected, identity verified, webhook signature on, test payment + refund, webhook logs. See “Stripe verification before outbound” in this guide / launch runbook.

**Section 9 — Legal & compliance**  
✔ Done. Privacy, Terms, estimate disclaimer, cold-email compliance (CAN-SPAM, unsubscribe, address in TO-DO-LIST and emails). SPF/DKIM/DMARC in TO-DO-LIST Steps 4–5.

**Section 10 — Logging**  
✔ Partially done. Sentry captures API errors and uncaught exceptions. Event types: demo_open, address_selected, activation_clicked, signup_complete, report_generated, lead_submitted (api/events/log). Client track(): view, run_complete, limit_hit, checkout_start, cta_click, etc. (src/demo/track, lib/track). Not every event in the checklist is named exactly (e.g. “lock_trigger”) but lock/quota is tracked; “webhook_received” and “lead_saved” are in logs/Sentry. Sufficient for debugging.

**Section 11 — Backup & recovery**  
△ Gap. No weekly Supabase export or tenant backup is automated. Do manually: Supabase → export base; or add a weekly reminder to export. Document here: “Weekly: export Supabase data; backup tenant configs if needed.”

**Section 12 — Controlled pilot**  
✔ Your process. TO-DO-LIST: start with 100 leads, then scale. Checklist says 200–500 installers first; your list says 100 then scale. Either is fine — don’t start with 100K.

**FINAL REALITY CHECK — You are ready when:**  
✔ /api/health exists ✔ Sentry installed ✔ Canary/smoke tests run (CI + prod-smoke) ✔ Stripe verified (your step) ✔ Legal pages live ✔ Rate limiting active ✔ Rollback known (Vercel redeploy) ✔ Monitoring (Sentry + UptimeRobot) ✔ Lead delivery confirmed ✔ Backup: add weekly Supabase export reminder.

**Optional (checklist says):** Load testing (50–200 concurrent users); SLA positioning for enterprise. Everything else is covered.

---
LEAD DELIVERY — OPTIMAL SETUP (customer-facing + how it works)

**What research and experts say (sources):**

• **Speed-to-lead:** Responding within 5 minutes can yield much higher conversion than waiting 30+ minutes (e.g. “8x higher conversion” at 5 min vs 30 min; “21x more likely to qualify” at 5 min vs 30 min). Many B2B companies still respond in 24+ hours — so instant notification is a real advantage.  
  Sources: Lead Gen Economy (“5-Minute Rule”), Rework/lead-management, GetNextPhone (“Speed to Lead”), InsideSales lead response study.

• **Instant notification + CRM together:** Best practice is not “email only” or “CRM only” — it’s both: (1) **Instant notification** (email/SMS) to the sales team when a lead is captured, so they can act in under 5 minutes, and (2) **CRM as system of record** for sales pipeline (**GLPConvert** stores every lead in **Supabase**).  
  Sources: Twilio (instant lead alerts), n8n (instant CRM lead notifications + email), Instantly (CRM integration + two-way sync with HubSpot/Salesforce).

• **Solar/installer context:** Solar CRMs are used for lead organization, scoring, and follow-up; the “10-Minute Rule” or similar fast contact is emphasized. Email alone tends to lose leads without a central place to track them; CRM + instant alert is the recommended pattern.  
  Sources: Sunbase Data (solar CRM blueprint), Fuzen (solar lead scoring), Solenery (CRM tools for solar), Simple Tree (“Call the Damn Leads”).

**Recommended setup for GLPConvert:**

1. **System of record (you already have):** Store every lead in Supabase immediately (POST /api/lead → storeLead). No change needed.
2. **Customer-facing (demo + paid):** Show a short, clear message after submit: e.g. “Lead delivered. Your team will get an instant email so you can reach out in minutes.” That sets the expectation and differentiates you.
3. **Instant email to installer:** When a lead is successfully stored, send one optional “New lead” email to the installer (tenant). Options: (a) Set **notification_email** on the tenant in **Supabase** (`tenants` table); after `storeLead` success, send Resend to that address with lead details and a link to the **dashboard** (`/c/[handle]/leads`). (b) Or use a single env var (e.g. LEAD_ALERT_EMAIL) for a global inbox if you have one. Prefer (a) for multi-tenant.
4. **Optional CRM sync (post-sale):** Keep “Optional CRM sync (Zapier, HubSpot, Salesforce) available” as an upsell. Don’t force CRM during onboarding. Industry standard for your positioning = “Instant lead delivery. Optional CRM sync available.”
5. **No blocking on CRM:** Do not require the installer to connect a CRM before they can receive leads. Email (and Supabase) first; CRM is optional.

**Implemented:** The API now sends a “New lead” email via Resend when a lead is stored, if the tenant has a “Notification Email” column set in Supabase (Tenants table). Add that column (email or single-line text) and fill it per installer.

**How it works (for sales/support):** Leads are stored in **Supabase** (`leads`), scoped to the tenant. The buyer sees them at **`/c/[handle]/leads`** and can get email when notification email is set. **Optional CRM webhook:** tenant **CRM Webhook URL** → API POSTs each new lead there (HubSpot, Salesforce, Zapier/Make, etc.).

**Summary:** Optimal = Supabase as single source of truth + instant email notification to the installer on new lead + customer-facing copy that says so. Add optional CRM sync later. This matches SaaS and solar best practice and the cited sources.

**What to say on the demo and in cold email (after they buy):**  
Use both, and say so clearly. Recommended phrasing:

- **Short:** “Leads hit your inbox quickly—and they’re in your **GLPConvert** dashboard. If you use HubSpot, Salesforce, or Zapier, we can sync there too.”
- **Even shorter:** “Instant email when a lead comes in, plus your dashboard—and optional CRM sync if you use one.”
- **Don’t say:** “We only email you” (they’ll ask about CRM). **Don’t say:** “We only sync to your CRM” (many installers don’t have one yet; and CRM-only = slower first response). **Do say:** Email + dashboard for everyone; CRM sync optional.

**Source for “both” in solar:** Solargen’s FAQ states: “You’ll receive an email notification as soon as a prospect completes a simulation. All leads are available in your dashboard. On Pro and Enterprise, we also sync leads to your CRM automatically.” (solargen.app) So the category norm is: email + dashboard for all; CRM sync as optional/higher tier.

**Demo & setup copy — exact changes (long-term):** app/page.tsx ~321 live bar → "New leads hit your inbox instantly and your dashboard—optional CRM sync if you use one." ~519–520 CRM card → "Leads to inbox + dashboard" / "Instant email when a lead comes in, plus your GLPConvert dashboard. Optional sync to HubSpot, Salesforce, or other CRM." ~539 CTA → "Instant lead email + dashboard (+ optional CRM)". app/report/page.tsx ~743 toast (homeowner) → "Thanks! We've got your info. A specialist will reach out soon." app/activate/page.tsx ~130, ~183 → "Your tool is live. New leads go to your inbox and dashboard—optional CRM sync if you use one." / "Share this link to start receiving leads; you'll get an instant email and see them in your dashboard." app/c/[companyHandle]/leads/page.tsx ~98–99 empty state → "Leads show up here as soon as someone submits—you'll also get an instant email so you can reach out in minutes." app/docs/setup/page.tsx ~104–108 step 4 → "Lead delivery" / "Leads hit your inbox instantly and your dashboard; optional CRM connection when you're ready." Function: wire report lead form to POST /api/lead; add Tenants "Notification email" + send Resend on new lead (see "Instant email to installer" above).

---
📎 WHERE TO FIND MORE (every part covered here)

**Report/lead UX (consent, format, demo CTA):** Lead modal consent uses the **installer/demo company name** from the URL (e.g. TestCo), not the platform name; if the name matches a reserved token it shows "the company". Report header address uses estimate address or URL param or "your property". Demo report bottom CTA ("Launch Your Branded Version Now") uses a button that triggers checkout (not a link to the API URL). See `app/report/page.tsx`, `components/report/ReportLeadModal.tsx`, `components/cta/BottomCtaBand.tsx`.

This guide covers **all maintenance parts** in one place:
- **Daily / weekly / monthly:** Above (UptimeRobot, Sentry, health, admin, DLQ, npm audit, Stripe, Supabase).
- **When something breaks:** Health down, webhooks, customer access, estimation issues, security.
- **Common tasks:** Create tenant, GDPR export/delete, health check.
- **Pre-sell checklist (3 min before sales):** See `QA_SPEC.md` Section D (Vercel deploy, smoke run, errors, runbook).
- **Geocoding fix (REQUEST_DENIED):** See `docs/GEOCODING-FIX-DEFINITIVE.md`.
- **How estimations are industry standard (by component):** See `docs/ESTIMATION_SOURCES.md` (Section “Industry standard by component” and full references).

✅ SYSTEM STATUS

Last updated: March 30, 2026 (GLPConvert / Wellspire ops baseline)

All Systems Operational:
- ✅ Health endpoint: Working
- ✅ Demo home: https://glp-convert.vercel.app/?company=SynthTest&demo=1
- ✅ Intake (GLP funnel): https://glp-convert.vercel.app/intake?company=SynthTest&demo=1
- ✅ Paid / branded: https://glp-convert.vercel.app/paid?company=TestCo&demo=1 (adjust query params per tenant)
- ✅ Security headers: All configured
- ✅ DLQ system: Operational
- ✅ Admin dashboard: Operational
- ✅ Correlation IDs: All routes configured
- ✅ Circuit breakers: All services protected

Treat the checklist above as authoritative; snapshot bullets below are examples only.

---
## 🌐 Understanding GLPConvert (for anyone coming back cold)

**Today’s product:** B2B white-label **GLPConvert** — clinics get a branded **intake / simulation funnel** (`/intake`, `/result`) plus lead capture; **Stripe** provisions tenants and subscriptions. **Supabase** holds tenants and leads; **Resend** sends transactional mail. The codebase still includes a **legacy solar** address → **`/report`** path for migration demos; **`/api/health`** may probe NREL/EIA/USGS when keys exist.

### What GLPConvert is (operator view)

- **Product:** Medical weight-loss program **pre-consult conversion** — structured intake, program suggestion, handoff to calendar/contact (not medical advice).  
- **Revenue:** Setup + recurring fees via **Stripe** (see live **Pricing** / checkout).  
- **Entity:** **Wellspire LLC**; public-facing support default **`support@glpconvert.com`** (`lib/product-identity.ts`).

### How sales work (high level)

1. **Acquisition:** Prospect opens **demo** (`?company=…&demo=1`) — branded home + **`/intake`** simulator path.  
2. **Conversion:** **Launch** / checkout CTA → **Stripe Checkout** → webhook provisions **tenant** and sends onboarding email (**Resend**).  
3. **Activation:** Buyer dashboard **`/c/[handle]`** — live URL, embed, optional CRM webhook + notification email on **`tenants`**.

### How it works for clients (clinics / buyers)

- **Tenant = one customer org.** Supabase **`tenants`**: handle, plan, Stripe IDs, **notification email**, optional **CRM Webhook URL**, branding.
- **When a prospect submits a lead:**  
  1. Row is **saved to Supabase** (`leads`) — source of truth.  
  2. UI shows confirmation (copy varies by funnel).  
  3. **Clinic gets email** via **Resend** when tenant notification email + **`RESEND_API_KEY`** are set (subject/body include key fields + link to **`/c/[handle]/leads`**).  
  4. Lead appears in **dashboard** at **`/c/[handle]/leads`**.  
  5. If **CRM Webhook URL** is set, the API **POSTs** the payload there too.  
  Order: DB first, then UI, then email, then optional CRM.
- **No submit, no lead:** Browsing intake/report without submitting does not create a lead.

### How it works for end users (patients / prospects)

1. Open clinic link or demo → **GLP:** complete **`/intake`** steps → **`/result`** (or demo sample). **Legacy solar:** address → **`/report`** if enabled.  
2. Submit contact where the product captures leads → **POST `/api/lead`** → Supabase + optional email + optional CRM webhook.

### Lead object (what gets stored and sent)

Canonical shape includes: `tenant_id` (tenant handle), `homeowner_name`, `email`, `phone`, `address`, `system_size`, `annual_production`, `savings_25yr`, `monthly_payment_est`, `incentives_assumed`, `timestamp`, `utm_source`, `demo_or_paid`. This is saved to Supabase, emailed to the installer (structured + dashboard link), and optionally sent to CRM webhook. Installer does **not** get a screenshot; they get data + link to the lead view in the dashboard (which reconstructs the report view).

### APIs and what they do

| API / service      | Role |
|--------------------|------|
| **Supabase**       | Tenants (clinic config), Leads (every submission). Source of truth. |
| **Stripe**         | Checkout, webhooks (payment → provision tenant, send onboarding email). |
| **NREL PVWatts**   | Solar production for estimate. |
| **EIA**            | Utility rates for estimate. |
| **USGS 3DEP**      | Elevation/shading for estimate. |
| **Google Geocoding** | Address → lat/lng (server). |
| **Google Places**  | Address autocomplete (client). |
| **Resend**         | Lead alerts, onboarding / transactional mail (needs **`RESEND_API_KEY`**). |
| **Vercel KV**      | Webhook idempotency, rate limiting (optional). |

**Health:** GET `/api/health` probes every configured dependency (Supabase, Stripe, NREL, EIA, Geocoding, Resend, Places, KV, USGS — only if env vars are set). **`/status`** shows the same rows plus **Synthetic monitoring**. Point **UptimeRobot** + **Sentry** at **`support@glpconvert.com`** (or your ops inbox). See **`docs/API-HEALTH-COVERAGE.md`** and **`docs/COST-CAPACITY-MATRIX.md`**.

### What happens when someone buys (post-purchase flow)

1. **Stripe success** → redirect to success URL.  
2. **Stripe webhook** → tenant created/updated in Supabase, onboarding email sent (Resend).  
3. **Activation page** → `/c/[handle]?session_id=...` with checklist: URL, embed, API key, Connect CRM, refund/docs.  
4. **Lead routing:** Tenant **notification email** + optional **CRM Webhook**. New leads → Supabase → email → dashboard → optional CRM.  
Details: `docs/POST-PURCHASE-FLOW.md`.

### Where to find what

- **Daily ops:** This guide (daily/weekly/monthly checks, when something breaks).  
- **Health and alerts:** `/status`, `/api/health`, `docs/HEALTH-ALERTS-SETUP.md`, `docs/API-HEALTH-COVERAGE.md`.  
- **Costs and limits:** `docs/COST-CAPACITY-MATRIX.md`.  
- **Lead schema and delivery order:** `docs/LEAD-SCHEMA-AND-DELIVERY.md`.  
- **Refund and chargebacks:** Refund policy at `/legal/refund`, `docs/FINANCIAL-SANITY-CHECKLIST.md`, `docs/CHARGEBACK-EVIDENCE-TEMPLATE.md`.  
- **Estimation sources:** `docs/ESTIMATION_SOURCES.md`.  
- **Runbooks:** `docs/RUNBOOK-FAILURES.md`, **`MAINTENANCE-GUIDE.md`** (this file, repo root).

---

**Hands-off after go-live:** Treat **`MAINTENANCE-GUIDE.md`** as the single maintenance source: **UptimeRobot** on **`/api/health`**, **Sentry** alerts, **weekly** glance at **GitHub Actions → Synthetic monitoring**, plus **`/status`** when investigating. Use **daily / weekly / monthly** sections above. Growth/outreach: **`TO-DO-LIST.md`** / **`MASTER_TODO_GLPCONVERT.md`** as you prefer. Optional deep checklists: **`docs/TEMPORARY-TO-DO-LIST.md`**, **`docs/OWNER-IN-DEPTH-PROD-CHECKLIST.md`**.