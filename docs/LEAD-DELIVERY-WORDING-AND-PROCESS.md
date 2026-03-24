# Lead delivery: wording and how it works

## Wording (what prospects and customers see)

### Demo (cold-email prospect)

When someone clicks your cold-email link (`?company=AcmeSolar&domain=acmesolar.com&demo=1`), they see:

| Location | Wording |
|----------|--------|
| **Demo hero (top)** | "Demo for {Company} — Powered by Sunspire" / "Your Logo. Your URL. Instant Solar Quotes — Live in 24 Hours" |
| **Under price (demo only)** | "When you go live, every lead goes to your inbox and dashboard—optional CRM sync if you use one." |
| **Feature card (mid-page)** | **"Leads go straight to you"** — "Every lead hits your inbox instantly and your Sunspire dashboard—so you can reach out in minutes. Optionally sync to your Airtable, HubSpot, or Salesforce." |
| **CTA bullets** | "• Instant lead email + dashboard (+ optional CRM)" |

So the prospect immediately sees: (1) inbox + dashboard for every lead, (2) no CRM required, (3) optional sync to Airtable/HubSpot/Salesforce.

### Paid / live (after they’ve bought)

| Location | Wording |
|----------|--------|
| **Live bar (green, top)** | "Live for {Company}. Every lead goes to your inbox and dashboard instantly—optional sync to your Airtable or CRM." |
| **Activate page** | "Your tool is live. New leads go to your inbox and dashboard—optional CRM sync if you use one." / "Share this link to start receiving leads; you'll get an instant email and see them in your dashboard." |
| **Leads page (empty state)** | "Leads show up here as soon as someone submits—you'll also get an instant email so you can reach out in minutes." |
| **Docs / setup step 4** | "Lead delivery" — "Leads hit your inbox instantly and your dashboard; optional CRM connection when you're ready." |

### Homeowner (person who submitted the form)

| Location | Wording |
|----------|--------|
| **Report success toast** | "Thanks! We've got your info. A specialist will reach out soon." |

---

## What was changed (lead-handling / CRM)

- **Before:** Copy could imply CRM-only or email-only; “optional” wasn’t clear everywhere.
- **After (current):**
  - **Everywhere:** Inbox + dashboard first; CRM is always “optional” or “if you use one.”
  - **Demo:** Feature card “Leads go straight to you” + “inbox instantly and your Sunspire dashboard” + “Optionally sync to your Airtable, HubSpot, or Salesforce.”
  - **Live bar:** “Every lead goes to your inbox and dashboard instantly—optional sync to your Airtable or CRM.”
  - **Activate / leads / docs:** Same idea: instant email + dashboard; optional CRM when ready.
  - **Report toast:** Homeowner message: “Thanks! We've got your info. A specialist will reach out soon.”
  - **Demo hero:** Added one line under price: “When you go live, every lead goes to your inbox and dashboard—optional CRM sync if you use one.”

This keeps the site consistent and makes it clear for cold-email prospects: no CRM required; they get inbox + dashboard; CRM is an optional add-on.

---

## How the process actually works

### 1. Cold email → demo

- You send a cold email with a link like:  
  `https://sunspire-web-app.vercel.app/?company=AcmeSolar&domain=acmesolar.com&demo=1`
- Prospect clicks and lands on the **demo** (same app, `demo=1`).
- They see their company name, the value prop (branded quotes, live in 24h), and the lead-delivery promise: **inbox + dashboard, optional CRM**.

### 2. They buy (Stripe)

- They click “Launch Your Branded Version Now” → Stripe checkout.
- After payment, Stripe webhook runs: creates/updates the **tenant** in Airtable and sends the installer an onboarding email.
- They’re redirected to the **customer dashboard** at `/c/[companyHandle]` (activation page).

### 3. When a homeowner submits a lead

- Homeowner is on a **report** page (your branded quote tool), fills name/email/phone/address, and submits.
- Frontend calls **POST /api/lead** with `tenantSlug`, name, email, address, and optional quote fields.
- **Backend (POST /api/lead):**
  1. **Stores the lead** in Airtable (Leads table, linked to the tenant).
  2. **Sends an instant email** to the installer if the tenant has “Notification Email” set in Airtable (via Resend).
  3. **Optional CRM sync:** If the tenant has “CRM Webhook URL” set in Airtable, the API POSTs the lead payload to that URL (e.g. Zapier/Make → their HubSpot, Salesforce, or Airtable). Fire-and-forget, 8s timeout.
- Homeowner sees the toast: **“Thanks! We've got your info. A specialist will reach out soon.”**

### 4. What the installer sees

- **Inbox:** Instant “New solar lead” email (if Notification Email is set).
- **Dashboard:** `/c/[handle]/leads` — list of all leads; empty state says: “Leads show up here as soon as someone submits—you'll also get an instant email so you can reach out in minutes.”
- **Their own CRM:** If they configured a CRM webhook (Zapier/Make, etc.), leads also flow there.

So in one sentence: **Leads are stored in Sunspire’s Airtable, the installer gets an instant email and sees them in the Sunspire dashboard, and optionally the same lead is sent to their CRM via the webhook.**

---

## Functionality (not just wording)

- **Lead storage:** POST /api/lead → Airtable Leads table (required).
- **Instant email:** Resend to the tenant’s “Notification Email” from Airtable (optional per tenant).
- **Optional CRM:** Tenant’s “CRM Webhook URL” in Airtable → POST `lead.created` payload to that URL (optional per tenant).
- **Report page:** Lead form submits to POST /api/lead; success shows the homeowner toast above.

No other wording or behavior was changed for lead handling beyond what’s listed here. The demo and paid copy are aligned so cold-email prospects see the same promise (inbox + dashboard, optional CRM) that you deliver after they go live.
