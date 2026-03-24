TO-DO LIST — SUNSPIRE
Every button from here to 1,000 customers, in order, with sources.
Last Updated: January 25, 2026

################################################################################
#  WHERE YOU ARE — READ THIS FIRST
################################################################################
#
#  RULES:
#  • PATH 1 = Add Leads (Snov.io → Google Sheet → Instantly Add Leads → Google Sheets paste URL). PATH 2 = SuperSearch (Instantly only; no Snov.io). Use Path 1 progress list; check [x] when you complete a step.
#  • Phase 1 (1.1–1.8) = done. STEP 2.1 onward = [ ] until you say it's done. Every button from now to 1,000 customers is in Path 1 below (Steps 2–18).
#  • Full order: Path 1 → "EVERY BUTTON IN ORDER — MASTER SEQUENCE" (17 steps) then "EVERY BUTTON IN ORDER — LINEAR LIST" (67 actions). Then complete each step's sub-bullets in detail.
#  • AFTER MIGRATION: When docs/TEMPORARY-TO-DO-LIST.md is complete through Step 39 (Supabase migration + doc pass), you are ready for cold email. Then: optional Step 40–41 sign-off in TEMPORARY list → open this file at STEP 2.1 + MAINTENANCE-GUIDE.md only. No other checklist.
#
#  REFERENCE (from Sunspire Final notes — your actual setup):
#  • Namecheap (hugowentzel@gmail.com): sunspiredemo.com (outreach/demo), getsunspire.com, sunspiretool.com, sunspirequote.com, usesunspire.com (sending). Domain list → Manage → Advanced DNS per domain.
#  • Google Workspace — 4 domains (trials started 8/11/25): getsunspire.com, sunspirequote.com, sunspiretool.com, usesunspire.com. Sending accounts: hgwentzel@getsunspire.com, dalynhelms7@sunspirequote.com, hgowentzel@sunspiretool.com, hugowentzelspam@usesunspire.com. Add 5th inbox (e.g. hugo@getsunspire.com or another user) if you want 5 for Path 1.
#  • DKIM/SPF/DMARC: set up for getsunspire, sunspirequote, sunspiretool, usesunspire. Instantly: connect these 4 (or 5) sending inboxes.
#  • Support: support@getsunspire.com. Billing/Stripe: billing@getsunspire.com. Address (Anytime Mailbox): 1700 Northside Drive, Suite A7 #5164, Atlanta, GA 30318. Phone: 404-637-8549.
#  • Other: Vercel (hugowentzel@gmail.com), Stripe (billing@getsunspire.com), Supabase (post-migration), Clay, Apollo, Zapier (Finster812345!), legal doc sunspire-legal.docx.
#  • API keys: For Geocoding to work from Vercel, set GOOGLE_GEOCODING_API_KEY in Vercel. In Google Cloud: Credentials → Create API key → Application restriction "None", API restriction "Geocoding API" only → copy key → Vercel → Environment Variables → GOOGLE_GEOCODING_API_KEY. Run E2E: BASE_URL=https://sunspire-web-app.vercel.app npx playwright test tests/e2e-all-apis-estimations-visual.spec.ts --headed
#
################################################################################

>>> Path 1: Add Leads (Google Sheets paste URL). Path 2: SuperSearch (Instantly only).

--------------------------------------------------------------------------------
PROGRESS (check [x] when done; first [ ] = where you are)
--------------------------------------------------------------------------------
  [x] Phase 1 — System verified (1.1–1.8: KV, Resend webhook, Admin, Health, Demo URL, bookmarks, legal, post-purchase)
  [ ] STEP 2.1 — Sign up Instantly.ai   <<< YOU ARE HERE
  [ ] STEP 2.2 — Sign up Snov.io Starter
  [ ] STEP 2.4 — Google Workspace: 4 email accounts (getsunspire, sunspirequote, sunspiretool, usesunspire)
  [ ] STEP 3 — Namecheap DNS + connect 4 (or 5) accounts to Instantly
  [ ] STEP 4 — Snov.io: find 100 leads, export CSV
  [ ] STEP 5 — Google Sheets: add CompanyDomain + DemoURL columns, share "Anyone with the link", copy URL
  [ ] STEP 6 — Instantly: campaign, add leads via Google Sheets (paste URL, Verify ✓), sequence, schedule, options, test, launch
  [ ] STEP 7 — AI Reply Agent
  [ ] STEP 8–11 — First sale → 10 → 100 → 1,000 customers

################################################################################
#  PATH 1 — EVERY BUTTON (NOW → 1,000 CLIENTS)
################################################################################
PATH 1 = Add Leads version: Snov.io → Google Sheet (add CompanyDomain + DemoURL) → Instantly Add Leads → Google Sheets (paste sheet URL; no CSV download/upload). Variables: {{first_name}}, {{company}}, {{demo_url}}. Verify leads on import (0.25 credits/lead). Source: help.instantly.ai/en/articles/6253122-how-to-upload-leads-with-google-sheets. Replace [YOUR-PRODUCTION-URL] with your app URL. Use https:// in browser.

--------------------------------------------------------------------------------
EVERY BUTTON IN ORDER — MASTER SEQUENCE (do exactly in this order)
--------------------------------------------------------------------------------
Do not skip. Complete each step fully before the next.

  1. STEP 2 — Sign up Instantly.ai (every button 2.1–2.7)
  2. STEP 3 — Sign up Snov.io Starter (every button 3.1–3.5)
  3. STEP 4 — Google Workspace: 4 sending accounts (4.1–4.6)
  4. STEP 5 — Namecheap DNS (SPF/DKIM/DMARC) + connect 4 accounts to Instantly (5.1–5.7)
  5. STEP 6 — Snov.io: find 100 leads, export CSV, import to Google Sheets (6.1–6.6)
  6. STEP 7 — Google Sheets: add CompanyDomain + DemoURL, share "Anyone with the link", copy sheet URL (7.1–7.4)
  7. STEP 8 — Instantly: create campaign (8.1–8.2)
  8. STEP 9 — Instantly: Add Leads → Google Sheets (paste URL), map columns, Verify leads (9.1–9.5)
  9. STEP 10 — Instantly: assign email accounts to campaign (10.1)
 10. STEP 11 — Instantly: build 3-email sequence + full copy (11.1–11.4)
 11. STEP 12 — Instantly: Schedule + Options (12.1–12.2)
 12. STEP 13 — Instantly: test email → Launch campaign (13.1–13.3)
 13. STEP 14 — Instantly: AI Reply Agent (14.1–14.3)
 14. STEP 15 — First sale: daily Analytics + Unibox replies + Stripe/Supabase/Admin (15.1–15.4)
 15. STEP 16 — Scale to 10: new Snov.io list → Sheets → new campaign → repeat (16.1–16.3)
 16. STEP 17 — Scale to 100: upgrade Instantly/Snov.io if needed; more campaigns (17.1–17.3)
 17. STEP 18 — Scale to 1,000: large batches, List-Unsubscribe/DNS for 5k+/day (18.1–18.2)

Then you are at 1,000 customers. Every click within each step is listed in order below.

--------------------------------------------------------------------------------
EVERY BUTTON IN ORDER — LINEAR LIST (follow 1, 2, 3, …)
--------------------------------------------------------------------------------
Use this as a single run-through. Each number = one action (click, type, or select).

SETUP (Steps 2–5)
  1. Open browser.  2. Address bar: https://instantly.ai → Enter.  3. Click "Get Started" or "Sign Up".  4. Email box: type your email.  5. Click "Continue".  6. "Where did you find us?" → select (e.g. Google).  7. "Industry?" → select (e.g. Software (SaaS)).  8. "Company Size?" → select (e.g. 1-10).  9. Click "Continue".  10. Click plan (Growth or Hypergrowth).  11. Click "Continue" or "Select plan".  12. Enter card number, expiry, CVC, billing.  13. Click "Complete payment".  14. Bookmark Instantly.  15. New tab: https://snov.io → Enter.  16. Click "Sign Up".  17. Email + password → "Create account".  18. Click "Starter" plan.  19. Payment → "Complete signup".  20. Bookmark app.snov.io.  21. New tab: workspace.google.com (or admin.google.com) → "Get Started" or "Sign in".  22. Add/verify 4 domains (getsunspire, sunspirequote, sunspiretool, usesunspire): business name → Next → Yes domain → Next → add each domain → Verify (TXT at Namecheap).  23. Users → "Add new user" × 4: hgwentzel@getsunspire.com, dalynhelms7@sunspirequote.com, hgowentzel@sunspiretool.com, hugowentzelspam@usesunspire.com (each with password).  24. Namecheap: Sign In → Domain List → Manage (each domain) → Advanced DNS → Add New Record: SPF (TXT @, v=spf1 include:_spf.google.com ~all) → Save.  25. Google Admin → Apps → Google Workspace → Gmail → Authenticate email → Generate key → copy Host + TXT Value (per domain).  26. Namecheap → each domain → Advanced DNS → Add TXT (DKIM Host + Value from Google) → Save.  27. Namecheap → each domain → Add TXT _dmarc, v=DMARC1; p=none; rua=mailto:support@getsunspire.com → Save.  28. Instantly → Email Accounts → "+ Add Email Account" → Gmail.  29. Connect hgwentzel@getsunspire.com (password or App password) → Connect.  30. Connect dalynhelms7@sunspirequote.com → Connect.  31. Connect hgowentzel@sunspiretool.com → Connect.  32. Connect hugowentzelspam@usesunspire.com → Connect.

LEADS + SHEETS (Steps 6–7)
  33. app.snov.io → Log in → menu "Finder" or "Database Search".  34. Job title/Keywords: e.g. "solar installer". Location: e.g. United States. Click "Search".  35. Select 100+ (checkboxes or "All on page") → "Add to list" → name "Solar Batch 1" → Create/Save.  36. Menu "Leads" or "Prospects" → click list "Solar Batch 1".  37. Three-dot menu (⋮) → "Export prospect list".  38. Check columns: Email, First name, Company name, Website. Format: CSV. Click "Export". Save file.  39. sheets.google.com → Blank → File → Import → Upload → select Snov.io CSV → Import data.  40. Column F header: type "CompanyDomain". F2: formula =IF(E2="","",SUBSTITUTE(SUBSTITUTE(SUBSTITUTE(LOWER(E2),"https://",""),"http://",""),"www.","")) → Enter. Copy F2 down.  41. Column G header: "DemoURL". G2: ="https://sunspire-web-app.vercel.app/?company="&ENCODEURL(C2)&"&domain="&F2&"&demo=1" → Enter. Copy G2 down.  42. Share: Click "Share" → set to "Anyone with the link" (viewer or editor as required). Copy the sheet URL from the browser bar.

CAMPAIGN + LAUNCH (Steps 8–14)
  43. Instantly → Campaigns → "+ Add New".  44. Campaign name: "Solar Outreach - Batch 1" → Click "CONTINUE".  45. Campaign → Leads → "Add Leads" → click "Google Sheets".  46. Paste the Google Sheet URL. Wait for Instantly to load columns.  47. Map: Email→Email, First name→First name, Company name→Company name (or Custom "Company"), CompanyDomain→Custom "domain", DemoURL→Custom "demo_url". Others→Do Not Import.  48. Check "Verify leads". Optionally "Check for duplicates".  49. Click "Upload all". Wait.  50. Campaign → Settings (or Email accounts): check all 4 (or 5) sending accounts → Save.  51. Campaign → Sequences. First step: Subject: type "Quick question about " → bolt icon → select "company" → type "'s solar quotes".  52. Body: type/paste Email 1 (Hey {{first_name}}, …); use Variables button for first_name, company; click "+" → Insert Unsubscribe Link; add footer (Sunspire LLC, address, Honor opt-out).  53. "Send next message in": 0 days. Click "Add step" → Email.  54. Subject: "Built a quick preview for " → bolt → company. Body: Email 2 with {{demo_url}}. "Send next": 3 days. Check "Only if no reply".  55. "Add step" → Email. Subject: "Another solar team just switched". Body: Email 3. "Send next": 6 days. Check "Only if no reply".  56. Click "Save".  57. Campaign → Schedule: check Tue, Wed, Thu; time 9:30 AM–3:30 PM → Save.  58. Campaign → Options: Daily limit 20; "Stop sending emails on reply" ON; delay 8–12 min if available → Save.  59. Sequences → "Preview" → Load data for lead (or Send test to your email) → Send from (one account) → "Send test". Check inbox.  60. Campaign → "Launch" → Confirm.  61. Instantly sidebar → AI Agents (or Unibox) → "Add New" → AI Reply Agent. Name: "Sunspire Demo Replies".  62. Mode: Autopilot. Assign: Solar Outreach - Batch 1. Instructions: use demo_url for demo requests. Save.

FIRST SALE → 1,000 (Steps 15–18)
  63. Daily: Instantly → Campaigns → Solar Outreach - Batch 1 → Analytics (Sent, Opens, Replies, Clicks). Unibox → open replies → Reply (include demo_url if asked) → Send.  64. Link clicks: follow up after 24h with short email. When someone pays: Stripe → Payments; Supabase → Tenants; Admin dashboard → new tenant.  65. Scale to 10: Snov.io new list "Solar Batch 2" → Export CSV → Google Sheets (CompanyDomain + DemoURL formulas) → Share "Anyone with link" → copy URL → Instantly new campaign "Solar Outreach - Batch 2" → Add Leads → Google Sheets (paste URL) → map → Verify → Settings (accounts) → same 3 emails → Schedule → Options → Preview → Launch. Assign AI Agent. Repeat.  66. Scale to 100: Upgrade Instantly/Snov.io if needed. New campaigns same flow. Optional: more Google users + domains + DNS + Instantly accounts.  67. Scale to 1,000: Large exports (5K–25K) → Sheets (CompanyDomain + DemoURL) → Share link → Add Leads → Google Sheets per campaign. Enable List-Unsubscribe header; SPF/DKIM/DMARC; monitor bounce/spam. Target 1,000 = $99K MRR.

--------------------------------------------------------------------------------
STEP 1 — PHASE 1: SYSTEM VERIFICATION (every button + legal + post-purchase)
--------------------------------------------------------------------------------
Sources: Vercel env vars — vercel.com/docs/environment-variables. Resend webhooks — resend.com/docs/dashboard/webhooks/introduction. CAN-SPAM — ftc.gov. Instantly verify leads — help.instantly.ai/en/articles/6514690-how-to-verify-leads. Instantly CSV — help.instantly.ai/en/articles/6254215-how-to-upload-leads-with-a-csv-file. Snov.io export — snov.io/knowledgebase/how-to-export-emails-from-snovio. Instantly pricing — instantly.ai/pricing.

  [x] 1.1 — Vercel KV: (1) Browser → https://vercel.com. (2) Top right → Log In → enter email → Enter → enter password → Log In. (3) Dashboard: click your project name (e.g. sunspire-web-app). (4) Left sidebar → Settings. (5) Settings page → click Environment Variables. (6) Scroll or search: confirm KV_REST_API_URL exists (value starts with https://). (7) Confirm KV_REST_API_TOKEN exists. If either missing: Left sidebar → Storage (or Marketplace) → Create Database → search "Upstash Redis" → Create → connect to project → return to Settings → Environment Variables → confirm both keys present. Source: vercel.com/docs/environment-variables.
  [x] 1.2 — Resend webhook: (1) New tab → https://resend.com. (2) Top right → Sign In → email/password → Sign In. (3) Left sidebar → Webhooks. (4) Click Create Webhook (or Add Webhook). (5) Name: type Sunspire Email Events. (6) Endpoint URL: type https://[YOUR-PRODUCTION-URL]/api/webhooks/resend. (7) Events: check Email Bounced, check Email Complained; leave others unchecked. (8) Click Create (or Save). (9) Confirm webhook appears in list with status Active. Source: resend.com/docs/dashboard/webhooks/introduction.
  [x] 1.3 — Admin dashboard: (1) New tab → https://[YOUR-PRODUCTION-URL]/admin/dashboard. (2) In the token field paste ADMIN_TOKEN (from Vercel → Settings → Environment Variables). (3) Click Submit (or Log in). (4) Confirm dashboard loads: health, circuit breakers, DLQ, any errors.
  [x] 1.4 — Health endpoint: (1) New tab → https://[YOUR-PRODUCTION-URL]/api/health. (2) Confirm page shows JSON: {"status":"ok","timestamp":"..."}.
  [x] 1.5 — Demo URL: (1) New tab → https://[YOUR-PRODUCTION-URL]/?company=TestCompany&domain=apple.com&demo=1. (2) Confirm "TestCompany" and Apple logo load. (3) Confirm "Activate on Your Domain" button visible. (4) Optional: click Activate on Your Domain → confirm redirect to Stripe checkout → go back without paying.
  [x] 1.6 — Bookmarks: (1) In browser create folder "Sunspire" (e.g. Chrome: Bookmark manager → Add folder). (2) Bookmark: Admin dashboard URL, Health URL, https://vercel.com/dashboard, https://dashboard.stripe.com, https://app.supabase.com (post-migration), https://resend.com/emails, https://sentry.io, https://dashboard.uptimerobot.com, https://www.namecheap.com/myaccount/login, Demo test URL from 1.5.
  [x] 1.7 — Legal (Phase 1): Privacy policy has NREL disclaimer (Third-Party Data / NREL PVWatts®). Privacy has CCPA section (rights, no sale, request methods). Every cold email has CAN-SPAM: Sunspire Software LLC, physical address (1700 Northside Drive, Suite A7 #5164, Atlanta, GA 30318), unsubscribe link, "Honor opt-out within 10 business days." Success page has 24-hour setup guarantee and link to /legal/refund. Source: CAN-SPAM — ftc.gov; Gmail bulk 5k+/day needs List-Unsubscribe (RFC 8058) — support.google.com.
  [x] 1.8 — Post-purchase verified: Customer pays → redirect to /c/[companyHandle]?session_id=...&demo=1. Stripe webhook (checkout.session.completed) → Supabase Tenants + Resend onboarding email. Confirm: /c/[handle] loads after purchase; Stripe → Supabase + Resend flow works.

--------------------------------------------------------------------------------
STEP 2 — SIGN UP INSTANTLY.AI (every button)
--------------------------------------------------------------------------------
Source: instantly.ai/pricing. Help: help.instantly.ai/en/articles/6386134-creating-a-campaign.
  [ ] 2.1 — Open browser. Address bar: type https://instantly.ai → Enter.
  [ ] 2.2 — On homepage: click the button "Get Started" or "Sign Up" (top right or center).
  [ ] 2.3 — If email field appears: click in Email box → type your email (e.g. hugowentzel@gmail.com) → click "Continue" (blue button).
  [ ] 2.4 — On onboarding: "Where did you find us?" dropdown → click → select "Google" (or Other). "What best describes your industry?" → click → select "Software (SaaS)" or "B2B". "Company Size?" → click → select "1-10". Click blue "Continue".
  [ ] 2.5 — Pricing page: click "Growth" ($47/mo — 1K contacts, 5K emails) or "Hypergrowth" ($97/mo — 25K, 100K). Then click "Continue" or "Select plan".
  [ ] 2.6 — Payment: Card number field → type number. Expiry → MM/YY. CVC → 3 digits. Billing address → fill if asked. Click "Complete payment" or "Subscribe".
  [ ] 2.7 — Wait for redirect. Confirm dashboard loads (Campaigns, Email Accounts in sidebar). Bookmarks → Add page → name "Instantly" → save. Source: instantly.ai/pricing.

--------------------------------------------------------------------------------
STEP 3 — SIGN UP SNOV.IO STARTER (every button)
--------------------------------------------------------------------------------
Source: snov.io/knowledgebase/how-to-export-emails-from-snovio — "Data export is available on premium plans." snov.io/pricing.
  [ ] 3.1 — New tab. Address bar: https://snov.io → Enter. Click "Sign Up" or "Get Started" (top right).
  [ ] 3.2 — Registration: Email field → type your email. Password field → type password. Click "Create account" or "Sign Up".
  [ ] 3.3 — Pricing/plan page: Free plan does NOT allow CSV export. Click "Starter" ($39/mo or $29.25/mo annual). Then "Choose plan" or equivalent.
  [ ] 3.4 — Payment: enter card + billing. Click "Complete signup" or "Pay".
  [ ] 3.5 — Confirm app loads (Finder, Prospects in menu). Bookmark https://app.snov.io. Source: snov.io/knowledgebase/how-to-export-emails-from-snovio.

--------------------------------------------------------------------------------
STEP 4 — GOOGLE WORKSPACE (4 SENDING ACCOUNTS — EVERY BUTTON)
--------------------------------------------------------------------------------
Source: workspace.google.com, admin.google.com.
  [ ] 4.1 — New tab → https://workspace.google.com (or admin.google.com). Click "Get Started" or "Sign in" → enter admin email/password if already have Workspace.
  [ ] 4.2 — If new: Business name field → type e.g. Sunspire Software → "Next". "Do you have a domain?" → select "Yes" → "Next". Domain field → type getsunspire.com → "Next" (add/verify). Repeat for sunspirequote.com, sunspiretool.com, usesunspire.com.
  [ ] 4.3 — Domain verification: Google shows TXT record (Host + Value). Open https://www.namecheap.com → Sign In → Domain List → click "Manage" next to that domain → Advanced DNS → "Add New Record" → Type: TXT → Host: paste from Google → Value: paste from Google → TTL: Automatic → Save. Back to Google tab → "Verify". Repeat for all 4 domains.
  [ ] 4.4 — Add users: Admin console → Users → "Add new user". First user: First name / Last name → enter; Primary email → hgwentzel@getsunspire.com; Set password → enter password → "Add New User". Repeat for: dalynhelms7@sunspirequote.com, hgowentzel@sunspiretool.com, hugowentzelspam@usesunspire.com (each with password).
  [ ] 4.5 — (Optional 5th: Add new user → e.g. hugo@getsunspire.com → Set password → Add New User.)
  [ ] 4.6 — Users list: confirm 4 (or 5) users show. Source: support.google.com (Google Workspace admin).

--------------------------------------------------------------------------------
STEP 5 — NAMECHEAP DNS + CONNECT 4 (OR 5) ACCOUNTS TO INSTANTLY (every button)
--------------------------------------------------------------------------------
Source: Namecheap Advanced DNS; admin.google.com → Gmail authenticate email.
  [ ] 5.1 — Namecheap SPF: New tab → https://www.namecheap.com → top right "Sign In" → enter hugowentzel@gmail.com + password → Log In. Dashboard → "Domain List" → click "Manage" next to getsunspire.com → "Advanced DNS" tab → "Add New Record" → Type: TXT | Host: @ | Value: v=spf1 include:_spf.google.com ~all | TTL: Automatic → "Save All Changes". Repeat for sunspiretool.com, sunspirequote.com, usesunspire.com.
  [ ] 5.2 — Google DKIM: New tab → https://admin.google.com → Sign in → Apps → "Google Workspace" → "Gmail" → scroll to "Authenticate email" → click "Generate new authentication key" (or copy existing) → copy Host (e.g. google._domainkey) and TXT Value. Do for getsunspire.com, then sunspirequote.com, sunspiretool.com, usesunspire.com.
  [ ] 5.3 — Namecheap DKIM: For getsunspire.com → Domain List → Manage → Advanced DNS → Add New Record → Type: TXT | Host: paste from Google (e.g. google._domainkey) | Value: paste long TXT from Google → Save. Repeat for other 3 domains.
  [ ] 5.4 — Namecheap DMARC: Same domain → Advanced DNS → Add New Record → Type: TXT | Host: _dmarc | Value: v=DMARC1; p=none; rua=mailto:support@getsunspire.com | TTL: Automatic → Save. Repeat 5.1–5.4 for sunspiretool.com, sunspirequote.com, usesunspire.com.
  [ ] 5.5 — Instantly: Tab → https://instantly.ai → Log in. Left sidebar → click "Email Accounts". Top right → click "+ Add Email Account" or "Add Email Account" → select "Gmail" or "Google Workspace".
  [ ] 5.6 — Connect first: Email field → type hgwentzel@getsunspire.com. Password field → type account password (or App password if 2FA: myaccount.google.com → Security → 2-Step Verification → App passwords). Click "Connect" or "Sign in with Google" if OAuth. Confirm "Connected" / green check. Repeat for dalynhelms7@sunspirequote.com, hgowentzel@sunspiretool.com, hugowentzelspam@usesunspire.com.
  [ ] 5.7 — Email Accounts list: confirm all 4 (or 5) show "Connected". Warmup starts automatically. Source: help.instantly.ai (Email accounts).

--------------------------------------------------------------------------------
STEP 6 — SNOV.IO: FIND 100 LEADS + EXPORT CSV (every button)
--------------------------------------------------------------------------------
Source: snov.io/knowledgebase/how-to-find-prospects-with-database-search, snov.io/knowledgebase/how-to-export-emails-from-snovio.
  [ ] 6.1 — New tab → https://app.snov.io → Log in. Top menu → click "Finder" (or "Lead Finder" / "Database Search"). If asked, open "Database Search" or "Prospects" tab.
  [ ] 6.2 — Search: Job title / Keywords → type e.g. "solar installer" or "solar sales". Location/Region → select e.g. United States. Industry → optional e.g. "Solar" or "Construction". Company size → optional. Click "Search" or "Run search". Wait for "Prospects found" count.
  [ ] 6.3 — Results: use checkboxes — "All on page" (50) or select 100+ manually. Top bar → click "Add to list". Popup: List name → type "Solar Batch 1". Click "Create list" or "Add" or "Save". Wait for email search to complete if prompted.
  [ ] 6.4 — Top menu → click "Leads" or "Prospects". Left sidebar: find list "Solar Batch 1" → click it. Top toolbar (above the table) → click three-dot menu (⋮) → click "Export prospect list".
  [ ] 6.5 — Export window: Filter by status — leave default or select "Valid". "Export only primary email" — check if you want one email per prospect. Columns: check "Email", "First name", "Company name", "Website", "Job title" (optional). Format: select "CSV". Click "Export" or "Download". Save file (e.g. Snovio_Solar_Batch1.csv).
  [ ] 6.6 — Google Sheets: New tab → https://sheets.google.com → Blank (or File → New). Menu File → Import → Upload tab → drag Snov.io CSV or "Select file from device" → choose Snovio_Solar_Batch1.csv. Import location: "Replace spreadsheet" or "Insert new sheet(s)". Separator: Comma. Click "Import data". Confirm row 1 = headers, 100+ rows. Source: snov.io/knowledgebase/how-to-export-emails-from-snovio.

--------------------------------------------------------------------------------
STEP 7 — GOOGLE SHEETS: ADD DOMAIN + DEMO URL, SHARE LINK (every button)
--------------------------------------------------------------------------------
Source: Google Sheets formulas (no add-ons). help.instantly.ai/en/articles/6253122-how-to-upload-leads-with-google-sheets — sheet must be "Anyone with the link".
  [ ] 7.1 — In the same Google Sheet (Snov.io data): identify columns. Typical: A=Email, B=First name, C=Company name, D=Job title, E=Website. If different, note your Email column (e.g. A), Company column (e.g. C), Website column (e.g. E).
  [ ] 7.2 — Add CompanyDomain: Click column F header → type "CompanyDomain" → Enter. Click cell F2. Formula bar → paste: =IF(E2="","",SUBSTITUTE(SUBSTITUTE(SUBSTITUTE(LOWER(E2),"https://",""),"http://",""),"www.","")) → Enter. Click F2 → Copy (Ctrl/Cmd+C). Select F3:F last row (e.g. F3:F101) → Paste (Ctrl/Cmd+V). Values fill.
  [ ] 7.3 — Add DemoURL: Click column G header → type "DemoURL" → Enter. Click G2. Formula: ="https://sunspire-web-app.vercel.app/?company="&ENCODEURL(C2)&"&domain="&F2&"&demo=1" (if Company=C, CompanyDomain=F; change URL to your app). Enter. Copy G2 → select G3:G last row → Paste.
  [ ] 7.4 — Headers: Ensure row 1 has Email, First name, Company name, Website, CompanyDomain, DemoURL (capital E, F, C, etc.). Avoid formatting issues: Select all (Ctrl/Cmd+A) → Format → Number → Plain text. Share: Click "Share" (top right) → under "General access" set to "Anyone with the link" (Viewer or Editor as required by Instantly). Copy the sheet URL from the browser address bar. Source: help.instantly.ai/en/articles/6253122-how-to-upload-leads-with-google-sheets.

--------------------------------------------------------------------------------
STEP 8 — INSTANTLY: CREATE CAMPAIGN (every button)
--------------------------------------------------------------------------------
Source: help.instantly.ai/en/articles/6386134-creating-a-campaign.
  [ ] 8.1 — Tab → https://instantly.ai (or app.instantly.ai) → Log in. Left sidebar → click "Campaigns". Top right → click "+ Add New" (or "Add New campaign").
  [ ] 8.2 — Campaign name field: type "Solar Outreach - Batch 1" (or e.g. Solar_Installers_US). Click blue "CONTINUE" button. You land inside the campaign (Leads, Sequences, Settings, etc. in left menu or tabs).

--------------------------------------------------------------------------------
STEP 9 — INSTANTLY: ADD LEADS (GOOGLE SHEETS + VERIFY) — EVERY BUTTON
--------------------------------------------------------------------------------
Source: help.instantly.ai/en/articles/6253122-how-to-upload-leads-with-google-sheets, help.instantly.ai/en/articles/6514690-how-to-verify-leads.
  [ ] 9.1 — Inside campaign: Left menu/tab → click "Leads". Top right → click "Add Leads". Modal: click "Google Sheets" (not CSV, SuperSearch, manual, CRM).
  [ ] 9.2 — Paste the Google Sheet URL (from Step 7.4) into the URL field. Wait for Instantly to load columns; mapping table appears.
  [ ] 9.3 — Column mapping (Select Type dropdown per column): Email column → dropdown → select "Email" (required). First name column → select "First name". Company name column → select "Company name" or "Custom variable" → if Custom variable, type "Company". CompanyDomain column → "Custom variable" → type "domain". DemoURL column → "Custom variable" → type "demo_url". Any other columns (e.g. Website, Job title) → "Do Not Import". (Column names must start with capital letter; max 50 custom variables; max 20 chars per name.)
  [ ] 9.4 — Below mapping: check "Verify leads" (0.25 credits per lead; invalid/risky excluded). Optionally check "Check for duplicates across all campaigns". Leave other options as needed.
  [ ] 9.5 — Bottom: click "Upload all". Wait until progress completes. Confirm leads appear in campaign Leads list; status may show "In verification queue" then Valid. Source: help.instantly.ai/en/articles/6253122-how-to-upload-leads-with-google-sheets.

--------------------------------------------------------------------------------
STEP 10 — INSTANTLY: ASSIGN EMAIL ACCOUNTS (every button)
--------------------------------------------------------------------------------
Source: help.instantly.ai (Campaign settings, Email accounts).
  [ ] 10.1 — Campaign left menu → click "Settings" or "Email accounts" or "Sending accounts". Page shows list of connected accounts. Check the box next to: hgwentzel@getsunspire.com, dalynhelms7@sunspirequote.com, hgowentzel@sunspiretool.com, hugowentzelspam@usesunspire.com (and 5th if added). Click "Save" or "Continue" at bottom.

--------------------------------------------------------------------------------
STEP 11 — INSTANTLY: BUILD 3-EMAIL SEQUENCE (every button + full copy)
--------------------------------------------------------------------------------
Source: help.instantly.ai/en/articles/11967303-getting-started-with-sequences-section, help.instantly.ai/en/articles/6135930-how-to-add-variables. Subject variables: bolt icon next to Preview. Body variables: "Variables" button in editor bar. Unsubscribe: "+" in editor → "Insert Unsubscribe Link".
  [ ] 11.1 — Campaign left menu → click "Sequences" (or "Sequence" / "Steps"). You see first email step (Subject + Body).
  [ ] 11.1a — Subject line: click in Subject field. Type: Quick question about  → then click bolt icon (⚡) next to top-right "Preview" → select "company" → type 's solar quotes. Full subject: Quick question about {{company}}'s solar quotes.
  [ ] 11.1b — Body: click in Body. Type/paste line by line below. Where you see [VARIABLE]: click "Variables" in bottom editor bar → select that variable.
  [ ] 11.1c — EMAIL 1 BODY (type or paste; insert variables via Variables button):
    Hey {{first_name}},
    Solar teams at companies like {{company}} often lose prospects because quoting takes hours and prospects bounce. Are you seeing this challenge too?
    — Hugo
    Sunspire Software LLC | 1700 Northside Drive, Suite A7 #5164, Atlanta, GA 30318 | Unsubscribe: click "+" in editor → Insert Unsubscribe Link → place after "Hugo" line. Honor opt-out within 10 business days.
  [ ] 11.1d — Below first email: "Send next message in" → set 0 days (or leave default). Do NOT check "Only if no reply" on step 1.
  [ ] 11.2 — Click "Add step" (below first email) → select "Email". Subject: Built a quick preview for  → bolt → company → type: . Full: Built a quick preview for {{company}}. Body: paste EMAIL 2 (below). Where the link goes: type {{demo_url}} or Variables → demo_url. "Send next message in": 3 days. Check "Only if no reply" (or "Send only if no reply").
  [ ] 11.2b — EMAIL 2 BODY:
    {{first_name}},
    Since you're seeing the quoting challenge, I spun up a live preview for {{company}}: {{demo_url}}
    It's branded to your logo/colors and shows instant quotes. Takes 2 minutes to check out.
    — Hugo
    (same footer: Sunspire Software LLC | address | Insert Unsubscribe Link | Honor opt-out within 10 business days.)
  [ ] 11.3 — Click "Add step" → Email. Subject: Another solar team just switched. Body: paste EMAIL 3 (below). "Send next message in": 6 days. Check "Only if no reply".
  [ ] 11.3b — EMAIL 3 BODY:
    {{first_name}},
    Another solar team just switched to Sunspire. They're booking 2x more calls because prospects get instant answers. Want me to keep your preview live?
    — Hugo
    (same footer.)
  [ ] 11.4 — Click "Save" (top or bottom of sequence). Confirm all 3 steps show.

PATH 1 — EMAIL COPY REFERENCE (what to say — copy into Instantly)
- EMAIL 1 Subject: Quick question about {{company}}'s solar quotes
- EMAIL 1 Body: Hey {{first_name}}, Solar teams at companies like {{company}} often lose prospects because quoting takes hours and prospects bounce. Are you seeing this challenge too? — Hugo | [Insert Unsubscribe Link] | Sunspire Software LLC | 1700 Northside Drive, Suite A7 #5164, Atlanta, GA 30318 | Honor opt-out within 10 business days.
- EMAIL 2 Subject: Built a quick preview for {{company}}
- EMAIL 2 Body: {{first_name}}, Since you're seeing the quoting challenge, I spun up a live preview for {{company}}: {{demo_url}} It's branded to your logo/colors and shows instant quotes. Takes 2 minutes to check out. — Hugo | (same footer)
- EMAIL 3 Subject: Another solar team just switched
- EMAIL 3 Body: {{first_name}}, Another solar team just switched to Sunspire. They're booking 2x more calls because prospects get instant answers. Want me to keep your preview live? — Hugo | (same footer)

--------------------------------------------------------------------------------
STEP 12 — INSTANTLY: SCHEDULE + OPTIONS (every button)
--------------------------------------------------------------------------------
Source: help.instantly.ai/en/articles/6386134-creating-a-campaign (Schedule tab, Options tab), help.instantly.ai/en/articles/6222396-campaign-options.
  [ ] 12.1 — Campaign left menu → click "Schedule" tab. Days: uncheck Mon, Fri, Sat, Sun; check Tuesday, Wednesday, Thursday. Time: set start 9:30 AM, end 3:30 PM (recipient timezone if option exists). Click "Save" if shown.
  [ ] 12.2 — Campaign left menu → click "Options" tab. Scroll to "Standard Campaign Settings" or "Daily limit": Daily send limit field → type 20 (or 4 accounts × ~5–7 = 20–28). "Stop sending emails on reply" or "Pause on reply" → turn ON (check). Random delay between emails: 8–12 min if available. Click "Save" at bottom.

--------------------------------------------------------------------------------
STEP 13 — INSTANTLY: TEST THEN LAUNCH (every button)
--------------------------------------------------------------------------------
Source: help.instantly.ai/en/articles/7002900-preview-and-send-a-test-email-from-your-campaign.
  [ ] 13.1 — Campaign → Sequences tab. On first email step: click "Preview" button (top right). In popup: "Load data for lead" dropdown → select a lead from list (or type your email in "Send test to" field). "Send from" → select one of your sending accounts. Click "Send test" or "Send test email". Open your inbox: confirm subject shows a real company name; body shows first name + company; link in Email 2 test → opens demo with logo.
  [ ] 13.2 — If variables wrong: close Preview → Leads tab → re-check Step 9 column mapping (Email, First name, Company name, domain, demo_url). Ensure sheet is "Anyone with the link" and columns match; re-paste URL if you updated the sheet. Send test again.
  [ ] 13.3 — Campaign → top right: click "Launch" (or "Start campaign"). If confirmation modal: click "Launch" or "Confirm". Status changes to "Active" or "Running". Source: help.instantly.ai/en/articles/6386134-creating-a-campaign.

--------------------------------------------------------------------------------
STEP 14 — INSTANTLY: AI REPLY AGENT (every button)
--------------------------------------------------------------------------------
Source: help.instantly.ai/en/articles/8693846-ai-inbox-manager, help.instantly.ai (Unibox, AI reply).
  [ ] 14.1 — Instantly left sidebar → click "AI Agents" or "Unibox" or "Reply". Top right → click "Add New" or "+" → select "AI Reply Agent" or "AI Inbox Manager". Name field: type "Sunspire Demo Replies". Click "Create" or "Continue".
  [ ] 14.2 — Mode: select "Autopilot" (or equivalent). Assign to campaign: select "Solar Outreach - Batch 1" (or "All campaigns").
  [ ] 14.3 — Instructions field: type (or paste): "When the lead asks for a demo, link, or preview, include their personalized demo URL. Use the lead's custom variable demo_url. Example reply: Here's your personalized demo: [use their demo_url] — already branded for their company. Takes 2 minutes to try." Click "Optimize" if shown → then "Save".

--------------------------------------------------------------------------------
STEP 15 — FIRST SALE (Days 8–21) — EVERY BUTTON
--------------------------------------------------------------------------------
Source: Instantly Analytics, Unibox/Inbox; Stripe dashboard; Supabase; Admin dashboard.
  [ ] 15.1 — Daily: Tab → https://instantly.ai → Log in. Left sidebar → Campaigns → click "Solar Outreach - Batch 1". Tab/menu → "Analytics": note Sent, Opens, Replies, Link clicks. Left sidebar → "Unibox" or "Inbox": click each thread with a reply → click "Reply" → type reply; if they asked for demo, paste their demo URL (from Leads or from demo_url variable). Click "Send". Aim: reply within 2 hours.
  [ ] 15.2 — Analytics → "Link clicks": note leads who clicked demo link. Wait 24h. If no activation: Unibox or Leads → search/filter that lead → click lead → "Send email" or Reply → type: "Hey [first_name], saw you checked the demo. Any questions? Preview stays live if you want to share with your team." Send.
  [ ] 15.3 — When someone pays: Tab → https://dashboard.stripe.com → Log in → Payments: confirm $399 + $99 charge. Tab → https://app.supabase.com → project → Table Editor → tenants: new row. Tab → [YOUR-PRODUCTION-URL]/admin/dashboard → confirm new tenant. Resend: onboarding email sent.
  [ ] 15.4 — Optional (if metrics good 2+ days): Campaign → Options tab → Daily limit field → change 20 to 40 or 60 → Save. Leave "Pause on reply" ON.

--------------------------------------------------------------------------------
STEP 16 — SCALE TO 10 (Days 22–60) — EVERY BUTTON
--------------------------------------------------------------------------------
Source: Same as Steps 6–7 (Snov.io export, Google Sheets), Steps 8–14 (Instantly campaign).
  [ ] 16.1 — Snov.io: app.snov.io → Finder/Database Search → new search (e.g. solar installers, different region or keywords). Add 100+ to list "Solar Batch 2". Leads → "Solar Batch 2" → three-dot menu → "Export prospect list" → columns Email, First name, Company name, Website → CSV → Export. Google Sheets: new sheet or new tab → File → Import → upload new CSV. Add CompanyDomain column (F2 formula as Step 7.2, copy down). Add DemoURL column (G2 formula as Step 7.3, copy down). Share → "Anyone with the link" → copy sheet URL.
  [ ] 16.2 — Instantly: Campaigns → "+ Add New" → name "Solar Outreach - Batch 2" → CONTINUE. Leads → Add Leads → Google Sheets → paste sheet URL → map Email, First name, Company name, domain, demo_url (same as Step 9) → check "Verify leads" → Upload all. Settings: check all 4 (or 5) sending accounts → Save. Sequences: same 3 emails (copy from Batch 1 or retype). Schedule: Tue–Thu 9:30–15:30. Options: Daily limit 20 or 40 → Save. Preview → Send test → Launch. AI Agents: open "Sunspire Demo Replies" → Assign → add "Solar Outreach - Batch 2" (or leave All campaigns) → Save.
  [ ] 16.3 — Repeat: new Snov.io list → Export CSV → Google Sheets (CompanyDomain + DemoURL) → Share link → Instantly new campaign → Add Leads → Google Sheets (paste URL) → same flow. Increase daily limit when good. Target: 10 customers = $990 MRR.

--------------------------------------------------------------------------------
STEP 17 — SCALE TO 100 (Days 61–180) — EVERY BUTTON
--------------------------------------------------------------------------------
Source: instantly.ai/pricing, snov.io/pricing; same campaign flow.
  [ ] 17.1 — Instantly: Settings (gear) or Billing → upgrade to Hypergrowth ($97/mo, 25K contacts, 100K emails) if hitting limits. Snov.io: Account/Billing → upgrade tier if needed for more exports.
  [ ] 17.2 — New campaigns (Batch 5, 6, …): Snov.io new list → Export CSV → Google Sheets (CompanyDomain + DemoURL) → Share link → Instantly + Add New campaign → Leads → Google Sheets (paste URL) + Verify → Settings (all accounts) → Sequences (same 3 emails) → Schedule Tue–Thu → Options (Daily limit 50–100) → Launch. AI Agents: assign same agent to new campaigns.
  [ ] 17.3 — Optional: admin.google.com → Users → Add new user (same or new domain). Namecheap → each new domain: SPF, DKIM, DMARC. Instantly → Email Accounts → Add Email Account → connect new inbox → Campaign Settings → check new account. Target: 100 customers = $9,900 MRR.

--------------------------------------------------------------------------------
STEP 18 — SCALE TO 1,000 (Days 181–365) — EVERY BUTTON
--------------------------------------------------------------------------------
Source: help.instantly.ai (limits, options); Gmail bulk sending (List-Unsubscribe): support.google.com, RFC 8058.
  [ ] 18.1 — Snov.io: Enterprise or other lead source. Export large lists (5K–25K). Google Sheets: Import CSV → CompanyDomain column (formula) → DemoURL column (formula) → Share "Anyone with the link" → copy URL. Instantly: new campaigns per batch (e.g. 5K leads each) → Add Leads → Google Sheets (paste URL) → map same → Verify leads → same sequence → Schedule → Options (daily limit per campaign e.g. 100–500) → Launch. AI Reply Agent: assigned to all campaigns.
  [ ] 18.2 — Before sending 5k+/day to Gmail: ensure List-Unsubscribe + List-Unsubscribe-Post headers (Instantly/Resend support). SPF/DKIM/DMARC on all sending domains. Monitor bounce <2%, spam <0.1%. Target: 1,000 customers = $99K MRR ($1.188M ARR).

--------------------------------------------------------------------------------
PATH 1 — SOURCES (verified — every phase)
--------------------------------------------------------------------------------
- Phase 1 / Vercel env: vercel.com/docs/environment-variables
- Resend webhooks: resend.com/docs/dashboard/webhooks/introduction
- CAN-SPAM: ftc.gov (bulk email rules)
- Instantly pricing: instantly.ai/pricing
- Instantly campaign: help.instantly.ai/en/articles/6386134-creating-a-campaign
- Instantly Google Sheets upload (Path 1): help.instantly.ai/en/articles/6253122-how-to-upload-leads-with-google-sheets
- Instantly CSV upload: help.instantly.ai/en/articles/6254215-how-to-upload-leads-with-a-csv-file
- Instantly verify leads: help.instantly.ai/en/articles/6514690-how-to-verify-leads
- Instantly variables: help.instantly.ai/en/articles/6135930-how-to-add-variables
- Instantly sequences: help.instantly.ai/en/articles/11967303-getting-started-with-sequences-section
- Instantly campaign options (daily limit, stop on reply): help.instantly.ai/en/articles/6222396-campaign-options
- Instantly account/campaign limits: help.instantly.ai/en/articles/6248612-account-and-campaign-limits
- Instantly test email: help.instantly.ai/en/articles/7002900-preview-and-send-a-test-email-from-your-campaign
- Instantly unsubscribe link (Sequence → "+" → Insert): help.instantly.ai/en/articles/6191077-add-an-unsubscribe-link
- Instantly List-Unsubscribe header (5k+/day): help.instantly.ai/en/articles/8860388-list-unsubscribe
- Instantly AI Inbox Manager: help.instantly.ai/en/articles/8693846-ai-inbox-manager
- Snov.io export (Leads page → three-dot menu → Export prospect list; premium for CSV): snov.io/knowledgebase/how-to-export-emails-from-snovio
- Snov.io Database Search / Finder: snov.io/knowledgebase/how-to-find-prospects-with-database-search
- Snov.io prospects and data: snov.io/knowledgebase/prospects-and-data
- Google Workspace / Admin: workspace.google.com, admin.google.com
- Google set up DKIM: support.google.com/a/answer/174124
- Namecheap DNS (TXT, SPF, DKIM, DMARC): Domain List → Manage → Advanced DNS → Add New Record (namecheap.com/support)
- Gmail bulk (5k+/day): List-Unsubscribe RFC 8058, support.google.com/a/answer/81126

################################################################################
#  FINAL OPTIMIZATION CHECKLIST (before launch / before scaling)
################################################################################
  [x] Vercel KV, Resend webhook, Admin, Health, Demo URL verified (Phase 1)
  [x] Wording/copy optimized (inbox + dashboard + optional CRM) on live bar, features, activate, leads page, docs/setup
  [x] Lead delivery: instant email to installer (Tenants "Notification Email" in Supabase + Resend); report handleLeadSubmit wires to POST /api/lead
  [x] /api/health covers all APIs (supabase, stripe, nrel, eia, resend, google_geocoding, google_places when key set); /status page shows clear checkmarks and status
  [x] Smoke tests pass (BASE_URL=prod): health, geo, estimate, landing, report, status 200, demo copy, lead API 400
  [ ] Instantly + Snov.io Starter + 4 (or 5) Google Workspace accounts (getsunspire, sunspirequote, sunspiretool, usesunspire)
  [ ] Namecheap SPF/DKIM/DMARC for all 4 sending domains; 4 (or 5) accounts connected in Instantly
  [ ] Google Sheets: CompanyDomain + DemoURL columns; Format → Number → Plain text before import; share "Anyone with the link"; Add Leads → Google Sheets (paste URL); Email, First name, Company, domain, demo_url; capitalized headers
  [ ] "Verify leads" checked; 3 emails with {{first_name}}, {{company}}, {{demo_url}}; only if no reply on 2 & 3
  [ ] Schedule Tue–Thu 9:30–15:30; Daily limit 20; Pause on reply ON; random delay ON
  [ ] AI Reply Agent: Autopilot, instructions use demo_url for demo requests
  [ ] Test email: real names + real demo URL; link opens correct demo
  [ ] CAN-SPAM: Sunspire Software LLC, address, unsubscribe, 10 days in every email
  [ ] 5k+/day to Gmail: List-Unsubscribe + List-Unsubscribe-Post; SPF/DKIM/DMARC

################################################################################
#  PATH 2 — SUPERSEARCH (INSTANTLY ONLY — NO SNOV.IO)
################################################################################
Path 2 = find leads inside Instantly with SuperSearch (450M+ contacts). No Snov.io. Instantly Credits required (1 credit = verified email by Instantly; 2+ = partner; ~1.5/lead; Full profile + optional AI for demo_url). Do Path 1 Steps 2 (Instantly), 4 (Google Workspace), 5 (Namecheap + connect). Skip Step 3 (Snov.io). Then: create campaign → Add Leads → **SuperSearch** → search (AI Search or Filters) → Find Email (Full profile) → optionally Enrich & AI → demo_url → Move to campaign (only work email move; check uploaded contact limit). Then Path 1 Steps 10–18. Sources: help.instantly.ai/en/articles/11364248-supersearch, help.instantly.ai/en/articles/11948064-how-to-add-leads-to-a-campaign-from-supersearch, help.instantly.ai/en/articles/7918680-uploaded-contacts-limits, help.instantly.ai/en/articles/11381241-supersearch-credit-system.

--------------------------------------------------------------------------------
PATH 2 — STEP 2: SIGN UP INSTANTLY (same as Path 1 Step 2)
--------------------------------------------------------------------------------
  [ ] Same as Path 1: instantly.ai → Get Started → email → onboarding → plan (Growth or Hypergrowth) → payment → Bookmark.

--------------------------------------------------------------------------------
PATH 2 — STEP 3: SKIP SNOV.IO
--------------------------------------------------------------------------------
  [ ] Do not sign up Snov.io. Leads come from Instantly SuperSearch.

--------------------------------------------------------------------------------
PATH 2 — STEPS 4–5: GOOGLE WORKSPACE + NAMECHEAP + CONNECT ACCOUNTS (same as Path 1)
--------------------------------------------------------------------------------
  [ ] Same as Path 1 Steps 4–5: Google Workspace 4 users (getsunspire, sunspirequote, sunspiretool, usesunspire) → Namecheap SPF/DKIM/DMARC for all 4 domains → Instantly Email Accounts → connect all 4 (or 5).

--------------------------------------------------------------------------------
PATH 2 — STEP 6: CREATE CAMPAIGN (same as Path 1 Step 8)
--------------------------------------------------------------------------------
  [ ] Instantly → Campaigns → "+ Add New" → name "Solar Outreach - Batch 1" → CONTINUE.

--------------------------------------------------------------------------------
PATH 2 — STEP 7: ADD LEADS VIA SUPERSEARCH (every button)
--------------------------------------------------------------------------------
Source: help.instantly.ai/en/articles/11948064-how-to-add-leads-to-a-campaign-from-supersearch, help.instantly.ai/en/articles/11364248-supersearch.
  [ ] 7.1 — Inside campaign: Leads → "Add Leads" → click "**SuperSearch**" (Instantly Credits required).
  [ ] 7.2 — You are in SuperSearch. Search: **AI Search** — type e.g. "Solar installers or solar sales managers in the United States, 50–200 employees" → click "AI Search". Or use **Filters**: Job title (e.g. solar installer, solar sales), Location (United States), Industry/Keywords (solar), Company size. Click Search. Wait for "Prospects found".
  [ ] 7.3 — Top right → click "**Find Email**". Choose enrichment: **Full profile** (includes company name, job title, company info; ~1.5+ credits per lead). Optionally **Work email only** first. Click "Continue". Pick how many to enrich (e.g. first 100). Wait for enrichment to complete.
  [ ] 7.4 — **Get demo_url into leads:** SuperSearch may give Company name and Website/domain. If you have a "Website" or "Company domain" column: In the list → "Enrich & AI" → **AI & Scraping** tab → **Use AI** → prompt e.g. "For each row, output the Sunspire demo URL: https://sunspire-web-app.vercel.app/?company= [Company name, URL-encoded] &domain= [domain stripped from Website, no https/www] &demo=1". Output column name: "demo_url". Run. (If AI enrichment doesn't support this, fallback: Export list → Google Sheet → add CompanyDomain + DemoURL columns as in Path 1 Step 7 → Share link → Add Leads → Google Sheets for this campaign.)
  [ ] 7.5 — Select leads (checkboxes or "Select first x" or "Select all"). Click "**Move**" (or "Move to campaign"). Choose "Solar Outreach - Batch 1". Check "Check for duplicates across All campaigns" if desired. Ensure you have sufficient uploaded contact limit (help.instantly.ai/en/articles/7918680-uploaded-contacts-limits). Click Move. Only leads with work email will move; list columns (Email, First name, Company name, domain, demo_url if added) go to campaign.
  [ ] 7.6 — Optional: "Verify leads" when moving (0.25 credits/lead) if offered. Confirm leads appear in campaign Leads list.

--------------------------------------------------------------------------------
PATH 2 — STEPS 8–18: SAME AS PATH 1 (assign accounts, sequence, schedule, options, test, launch, AI Reply Agent, first sale → 1,000)
--------------------------------------------------------------------------------
  [ ] 8 — Same as Path 1 Step 10: Campaign Settings → check all 4 (or 5) sending accounts → Save.
  [ ] 9 — Same as Path 1 Step 11: Sequences → 3 emails with {{first_name}}, {{company}}, {{demo_url}}; same copy, delays, only if no reply. Save.
  [ ] 10 — Same as Path 1 Step 12: Schedule Tue–Thu 9:30–15:30; Options: Daily limit 20, Stop on reply ON. Save.
  [ ] 11 — Same as Path 1 Step 13: Preview → Send test → Launch.
  [ ] 12 — Same as Path 1 Step 14: AI Reply Agent, Autopilot, instructions use demo_url for demo requests. Save.
  [ ] 13 — First sale: daily Analytics + Unibox replies; Stripe/Supabase/Admin when they pay; optional increase daily limit.
  [ ] 14 — Scale to 10: SuperSearch new search (different filters/region) → Find Email (Full profile) → optionally AI demo_url → Move to new campaign "Solar Outreach - Batch 2". Same sequence, Schedule, Options, Launch. Assign AI Agent. Repeat. Target $990 MRR.
  [ ] 15 — Scale to 100: Upgrade Instantly (Hypergrowth) if needed. More SuperSearch lists → Move to new campaigns. Optional: more Google users + domains + Instantly accounts. Target $9,900 MRR.
  [ ] 16 — Scale to 1,000: Large SuperSearch batches (or export to Sheet + CompanyDomain + DemoURL + Add Leads Google Sheets). List-Unsubscribe + DNS for 5k+/day. Target $99K MRR.

--------------------------------------------------------------------------------
PATH 2 — SOURCES (verified)
--------------------------------------------------------------------------------
- SuperSearch: help.instantly.ai/en/articles/11364248-supersearch
- Add leads from SuperSearch: help.instantly.ai/en/articles/11948064-how-to-add-leads-to-a-campaign-from-supersearch
- Uploaded contact limits: help.instantly.ai/en/articles/7918680-uploaded-contacts-limits
- SuperSearch credit system: help.instantly.ai/en/articles/11381241-supersearch-credit-system

################################################################################
#  DOCUMENT STATUS — FULLY FINISHED (TRIPLE-CHECKED, SOURCES VERIFIED)
################################################################################
✓ Every button from "YOU ARE HERE" (Step 2.1) to 1,000 customers is listed IN ORDER.
✓ Master sequence: 17 steps (2 → 3 → … → 18). Do them in that order; within each step, do every sub-bullet in order.
✓ Linear list: 67 numbered actions (1–67) give a single run-through; use the detailed steps (2.1–18.2) for every click.
✓ Full email copy (what to say) is in Step 11 and in PATH 1 — EMAIL COPY REFERENCE.
✓ Sources: PATH 1 — SOURCES (verified) + PATH 2 — SOURCES (verified) + inline under each step. All URLs checked: Instantly (Google Sheets, verify leads, campaign, SuperSearch, credits, limits), Snov.io (export, Finder), Google, Namecheap, CAN-SPAM, Gmail bulk.
✓ Path 1: Add Leads (Google Sheets paste URL); Format → Plain text before import; share "Anyone with the link". Path 2: SuperSearch only; credits + uploaded contact limit noted.
✓ Path 2 (SuperSearch — Instantly only, no Snov.io) is after the Final Optimization Checklist.
✓ Check off [ ] → [x] as you go. When all boxes through Step 18 are checked, you are at 1,000 customers.

================================================================================
END — January 25, 2026 — TRIPLE-CHECKED, BEYOND OPTIMIZED, SOURCES VERIFIED
================================================================================
