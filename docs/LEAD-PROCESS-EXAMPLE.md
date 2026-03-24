# Lead process: what actually happens (with example)

## 1. Wording on demo/paid since last night

**No wording has changed on the demo or paid page since last night.**

In this session the only edit was adding one line under the demo price (“When you go live, every lead goes to your inbox and dashboard—optional CRM sync if you use one.”) and fixing “refunded..” → “refunded.” **You asked to undo that, and it was reverted.** So the current demo/paid copy is the same as before that.

Current wording (unchanged):

- **Live bar (paid):** “Live for {Company}. Every lead goes to your inbox and dashboard instantly—optional sync to your Airtable or CRM.”
- **Feature card (demo + paid):** “Leads go straight to you” — “Every lead hits your inbox instantly and your Sunspire dashboard—so you can reach out in minutes. Optionally sync to your Airtable, HubSpot, or Salesforce.”
- **CTA bullets:** “• Instant lead email + dashboard (+ optional CRM)”

---

## 2. Full process: one lead, three places (email, dashboard, CRM)

One lead submission does **not** go to three separate systems independently. It works like this:

1. **Lead is stored once** in **Sunspire’s Airtable** (Leads table).
2. **Email** = we send **one** “New solar lead” email to the installer (if they have “Notification Email” set in Airtable).
3. **Dashboard** = the same Airtable data is what the Sunspire dashboard shows at `/c/[handle]/leads`. So “goes to their dashboard” means: it’s already in Airtable, and the dashboard reads from Airtable.
4. **CRM** = **optional**. If the installer has “CRM Webhook URL” set in Airtable, we **also** POST that same lead to their webhook (e.g. Zapier or Make). **They** connect that webhook to their own CRM (HubSpot, Salesforce, their Airtable, etc.). We don’t push directly into their CRM; we push to the URL they give us.

So: **one lead → one row in Airtable → (optional) one email to them → (optional) one webhook POST to their URL.** Dashboard = view of that same Airtable data.

---

## 3. Example: “Acme Solar” gets a lead

**Setup (in Airtable, Tenants table, row for Acme Solar):**

- **Notification Email:** `sales@acmesolar.com`
- **CRM Webhook URL:** `https://hooks.zapier.com/...` (they set this in Zapier to “Send to HubSpot” or similar)

**What happens when a homeowner submits a lead (e.g. name Jane, email jane@example.com, address 123 Main St):**

| Step | What happens |
|------|-------------------------------|
| 1 | App receives **POST /api/lead** with `tenantSlug: "Acme Solar"` (or their handle), name, email, address, etc. |
| 2 | **Airtable:** One new row is created in the **Leads** table: Jane, jane@example.com, 123 Main St, linked to Acme Solar. |
| 3 | **Email:** Because “Notification Email” is set, we send **one email** to `sales@acmesolar.com`: subject “New solar lead: Jane”, body with name, email, address, and a “View in dashboard” link. |
| 4 | **Dashboard:** When they open **Sunspire dashboard** at `/c/acmesolar/leads`, the list is loaded from Airtable. So Jane’s lead **appears there** (same row we just created). No separate “send to dashboard” step. |
| 5 | **CRM:** Because “CRM Webhook URL” is set, we **POST** a JSON payload to their Zapier URL: `{ event: "lead.created", lead: { name: "Jane", email: "jane@example.com", address: "123 Main St", ... }, createdAt: "..." }`. Zapier (or Make) then does whatever they configured—e.g. create a contact in HubSpot. So the lead “goes to their CRM” only because **they** connected the webhook to their CRM. |

**If they didn’t set CRM Webhook URL:** Steps 1–4 still happen (Airtable + email + dashboard). Step 5 is skipped; no webhook is called.

**If they didn’t set Notification Email:** Steps 1, 2, 4 (and 5 if URL is set) still happen. No email is sent.

---

## 4. Short summary

- **Wording:** No changes on demo/paid since last night (the only edit was reverted).
- **Flow:** One lead → stored in **Airtable** → (if set) **one email** to installer → **dashboard** shows that same Airtable data → (if set) we **POST to their webhook** and they connect that to their CRM. So: email, dashboard, and “CRM” all come from that **one** lead submission; we don’t send the lead to three different systems separately.
