# Lead schema and delivery

## Source of truth

- **Storage:** Airtable base, table **Leads** (see `src/lib/airtable.ts`: `LEAD_FIELDS`, `Lead` interface, `upsertLeadByEmailAndTenant`).
- **Creation:** Lead is created **only** when the homeowner submits the contact form (POST `/api/lead`). **No lead is created at estimate generation** (GET `/api/estimate`).

## Lead object (API → Airtable)

Contract shape (logical) vs implementation:

| Logical field | API / store | Notes |
|---------------|-------------|--------|
| tenant_id | tenantSlug → Airtable Tenant id | From body.tenantSlug |
| homeowner_name | name | Name |
| email | email | Email |
| phone | phone | Optional |
| address | address | Formatted Address |
| system_size | systemSizeKW | kW |
| annual_production | (from estimate) | Optional; can be added to payload if report sends it |
| savings_25yr | npv25Year | 25-year NPV |
| monthly_payment_est | (derived) | Optional; can be added if calculated |
| incentives_assumed | (optional) | Optional field |
| timestamp | createdAt (server) | ISO string |
| utm_source / utm_* | token (or body.utm_source) | Attribution |
| demo_or_paid | (optional) | Can be set from request context |
| preferred_contact_method | "call" \| "email" | How the homeowner wants to be contacted; stored in Notes and sent to installer email + CRM webhook |

| Airtable / API | Source | Notes |
|----------------|--------|--------|
| Name | body.name | Name |
| Email | body.email | Email |
| Phone | body.phone | Notes or column |
| Formatted Address | body.address | Address |
| Tenant | body.tenantSlug → tenant id | Link to Tenants |
| System size (kW) | body.systemSizeKW | Optional |
| netCostAfterITC, year1Savings, paybackYear, npv25Year, co2OffsetPerYear | body | Optional if in base |
| Token | body.token | Attribution |
| Notes | body.notes + "Preferred contact: Call/Email" | Includes preferred_contact_method when set |
| Status | — | "New" |
| Last Activity | server timestamp | Last Activity |

Schema in code: `app/api/lead/route.ts` (leadData), `src/lib/airtable.ts` (LEAD_FIELDS, upsertLead).

## Delivery order (guaranteed)

1. **DB first:** Airtable upsert (by email + tenant); one row per email per tenant (idempotent).
2. **Installer email:** If tenant has Notification Email set, Resend sends one email to that address (non-blocking; failure does not roll back lead).
3. **Dashboard:** Lead appears in GET `/api/leads` and installer dashboard `/c/[handle]/leads`.
4. **CRM:** If tenant has CRM Webhook URL, POST `lead.created` to that URL (fire-and-forget, 8s timeout).

## Idempotency and reliability

- **Dedupe:** Key = email + tenant. `upsertLeadByEmailAndTenant` finds by email+tenant; updates if exists, creates otherwise. Double submit → one lead row. No duplicate leads on refresh or double-click.
- **Stripe webhook:** Separate idempotency by Stripe event id (`lib/webhook-idempotency.ts`).
- **Rate limiting:** `checkRateLimit` applied to submit-lead (and checkout) to reduce abuse.
- **Retries:** Resend/CRM push are fire-and-forget with timeouts; delivery status fields and retry queue can be added later (see MAINTENANCE-GUIDE).

## Consent / compliance

- Lead form (report page / modal) must include: clear statement that the homeowner may be contacted by [Installer] via phone/email; link to privacy and terms. If SMS is used in future: explicit opt-in and STOP language.
- Current implementation: ensure report/lead modal includes privacy/terms link and contact consent wording (audit in Phase 3 implementation).
