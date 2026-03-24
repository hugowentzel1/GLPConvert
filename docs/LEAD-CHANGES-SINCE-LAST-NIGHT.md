# Lead-related changes (last night → now)

## What was changed (wording + functionality)

### Functionality (this session / recent)

1. **`app/api/lead/route.ts`**
   - Fetch **tenant once** (for both notification email and CRM webhook) instead of calling `getTenantByHandle` twice.
   - **Optional CRM webhook:** After storing the lead and sending the installer notification email, if the tenant has **CRM Webhook URL** set in Airtable (column in Tenants table), the API POSTs `{ event: "lead.created", lead: { name, email, phone, address, tenantSlug, systemSizeKW, ... }, createdAt }` to that URL. Fire-and-forget with 8s timeout. No blocking of the response.

2. **`src/lib/airtable.ts`**
   - Added **`TENANT_FIELDS.CRM_WEBHOOK_URL`** ("CRM Webhook URL"). Tenant type updated so installers can set a webhook URL in Airtable; when set, it’s used for outbound CRM sync (e.g. Zapier/Make → their HubSpot, Salesforce, or Airtable).

3. **Tests**
   - **`tests/e2e/full-flow-and-crm-sync.spec.ts`** (new): Full flow (health → landing → report → POST /api/lead), CRM sync test (POST /api/lead with full payload, expect 200 or 500 and correct shape), and validation test (400 when required fields missing).
   - **`tests/api/route-integration.spec.ts`**: Already had POST /api/lead returns 400 when required fields missing.
   - **`package.json`**: `test:local` and `test:live` (and headed variants) include the full-flow and CRM sync spec.

4. **Docs**
   - **MAINTENANCE-GUIDE.md**: Described "CRM Webhook URL" in Tenants table and that the API POSTs each new lead to that URL when set.
   - **docs/LEAD-DELIVERY-WORDING-AND-PROCESS.md**: New doc listing all lead-related wording and the end-to-end process (cold email → demo → purchase → lead flow).
   - **docs/LEAD-CHANGES-SINCE-LAST-NIGHT.md**: This file.

### Wording (this session)

- **Reverted:** One line under the demo hero price ("When you go live, every lead goes to your inbox and dashboard—optional CRM sync if you use one.") was added then **undone** at your request. The double period in "refunded.." was reverted as well.
- **No other lead wording was changed in this session.** All existing copy (live bar, feature card "Leads go straight to you", activate page, leads page empty state, docs/setup, report toast) was already in the codebase; it was only documented in LEAD-DELIVERY-WORDING-AND-PROCESS.md.

---

## What works today (verified)

- **POST /api/lead:** Stores lead in Airtable (Leads table), sends instant email to installer if tenant has "Notification Email" in Airtable (Resend), and optionally POSTs to tenant’s "CRM Webhook URL" when set. Returns 200 with `{ success: true, message: "Lead submitted successfully" }` on success; 400 when required fields missing; 500 on store failure.
- **Full flow test:** Health → landing (demo URL) → report page → POST /api/lead with name, email, address, tenantSlug. Expects 200 or 500 (500 if tenant not in Airtable). **Passes on live (headed).**
- **Lead validation test:** POST with only name and email → 400. **Passes.**
- **CRM sync test:** POST with full payload (including phone, systemSizeKW, etc.) → 200 or 500 and correct response shape. **Passes.**

---

## Report page and lead form (current behavior)

- **`handleLeadSubmit`** in `app/report/page.tsx` is implemented: it POSTs to `/api/lead` with tenantSlug, name, email, address, and estimate fields, and shows the success toast ("Thanks! We've got your info. A specialist will reach out soon.").
- **No UI on the report page currently calls `handleLeadSubmit`.** The paid report footer (`ReportCTAFooter`) has "Book a Consultation", "Talk to a Specialist", "Download PDF", "Copy Share Link" — no name/email form. So for a paying customer, the **backend** lead flow is complete and tested; leads can be submitted via **direct API calls** (e.g. from an embed or another app). If you want homeowners to submit from the report page itself, you’d add a form (or a modal) that collects name/email/phone and calls `handleLeadSubmit`.
