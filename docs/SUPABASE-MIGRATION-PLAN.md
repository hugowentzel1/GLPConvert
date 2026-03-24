# Supabase migration plan

**Goal:** Supabase as the sole system-of-record for tenants and leads (and users/links where used). Airtable removed from the app and from Zapier. Customized demos and all backend saving for every customer continue to work; only the database changes.

---

## Environment variables

| Variable | Purpose |
|----------|---------|
| `SUPABASE_URL` | Project URL (e.g. `https://<project-ref>.supabase.co`). Set per environment: prod URL for Production, staging URL for Preview/Development. |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-side secret key for Supabase. Never expose to the client. |
| `STORAGE_BACKEND` | `airtable` \| `supabase`. During migration we switch to `supabase`; after cutover we remove the flag and use Supabase only. |
| (Optional) `SUPABASE_DB_URL` | Direct Postgres connection string if needed for migrations or tools. |

After cutover, remove: `AIRTABLE_API_KEY`, `AIRTABLE_BASE_ID`.

---

## Tables (Postgres)

### 1. `tenants`

Stores installer/customer config: branding, Stripe, CRM webhook, notification email. Powers white-labeled demos and dashboard.

| Column (snake_case) | Type | Airtable source | Notes |
|---------------------|------|-----------------|--------|
| id | UUID PK | record id | gen_random_uuid() |
| handle | TEXT UNIQUE | Company Handle | e.g. acme-solar |
| plan | TEXT | Plan | |
| domain_login_url | TEXT | Domain / Login URL | |
| brand_colors | TEXT | Brand Colors | |
| logo_url | TEXT | Logo URL | |
| crm_keys | TEXT | CRM Keys | |
| api_key | TEXT | API Key | |
| capture_url | TEXT | Capture URL | CRM webhook URL |
| users | TEXT[] | Users (linked) | optional |
| payment_status | TEXT | Payment Status | |
| stripe_customer_id | TEXT | Stripe Customer ID | |
| last_payment | TIMESTAMPTZ | Last Payment | |
| subscription_id | TEXT | Subscription ID | |
| current_period_end | TIMESTAMPTZ | Current Period End | |
| requested_domain | TEXT | Requested Domain | |
| domain_status | TEXT | Domain Status | |
| domain | TEXT | Domain | |
| notification_email | TEXT | Notification Email | |
| created_at | TIMESTAMPTZ | — | default now() |
| updated_at | TIMESTAMPTZ | — | default now() |

Indexes: `UNIQUE(handle)`, `INDEX(subscription_id)`.

### 2. `leads`

Stored per tenant; dashboard and notifications read from here.

| Column (snake_case) | Type | Airtable source | Notes |
|---------------------|------|-----------------|--------|
| id | UUID PK | record id | gen_random_uuid() |
| tenant_id | UUID FK → tenants(id) | Tenant (link) | required |
| name | TEXT | Name | |
| email | TEXT | Email | |
| phone | TEXT | Phone | |
| address | TEXT | Formatted Address | |
| notes | TEXT | Notes | |
| status | TEXT | Status | default 'New' |
| street, city, state, postal_code, country | TEXT | Street, City, State, etc. | optional |
| place_id | TEXT | Place ID | |
| latitude, longitude | NUMERIC | Latitude, Longitude | |
| utility_rate | NUMERIC | Utility Rate ($/kWh) | |
| token | TEXT | Token | attribution |
| system_size_kw | NUMERIC | — | from API |
| estimated_cost | NUMERIC | — | netCostAfterITC |
| estimated_savings | NUMERIC | — | year1Savings |
| payback_period_years | NUMERIC | — | paybackYear |
| npv_25_year | NUMERIC | — | npv25Year |
| co2_offset_per_year | NUMERIC | — | co2OffsetPerYear |
| last_activity | TIMESTAMPTZ | Last Activity | default now() |
| created_at | TIMESTAMPTZ | — | default now() |
| updated_at | TIMESTAMPTZ | — | default now() |

Indexes: `INDEX(tenant_id, created_at DESC)`, `INDEX(email)` (for GDPR).

### 3. `users` (optional)

If the app uses Airtable Users for dashboard access or roles.

| Column | Type | Airtable source |
|--------|------|-----------------|
| id | UUID PK | record id |
| email | TEXT | Email |
| role | TEXT | Role |
| tenant_ids | UUID[] | Tenant (link) |
| created_at, updated_at | TIMESTAMPTZ | |

### 4. `links` (optional)

If the app uses Airtable Links for tracking.

| Column | Type | Airtable source |
|--------|------|-----------------|
| id | UUID PK | record id |
| token | TEXT UNIQUE | Token |
| target_params | TEXT | TargetParams |
| tenant_id | UUID FK | Tenant |
| clicks | INT | Clicks |
| status | TEXT | Status |
| last_clicked_at | TIMESTAMPTZ | LastClickedAt |
| prospect_email | TEXT | ProspectEmail |
| created_at, updated_at | TIMESTAMPTZ | |

---

## Airtable → Supabase mapping summary

- **Tenants** table → `tenants` (all TENANT_FIELDS mapped).
- **Leads** table → `leads` (LEAD_FIELDS + API fields like system_size_kw, estimated_cost, etc.); `tenant_id` = FK to `tenants.id` (lookup by handle when writing).
- **Users** → `users` if used (dashboard auth / roles).
- **Links** → `links` if used (click tracking).

Lead “Company” in Airtable: stored as link to Tenant record. In Postgres we use `tenant_id` FK. When listing leads for a tenant we query `WHERE tenant_id = (SELECT id FROM tenants WHERE handle = $1)`.

---

## Routes and code that must use storage layer

All of these must read/write via the storage facade (Supabase DAL when `STORAGE_BACKEND=supabase`):

| Route / code | Current behavior | Migration |
|--------------|------------------|-----------|
| POST /api/lead | storeLead(leadData) from airtable.ts | storage.storeLead() → Supabase insert |
| GET /api/leads?company=&lt;handle&gt; | **Direct Airtable fetch** (filterByFormula, Company Handle) | Replace with storage.listLeadsForTenant(handle) → query Supabase leads JOIN tenants |
| /api/tenant | findTenantByHandle, etc. | storage.getTenantByHandle() |
| /api/tenant/crm-webhook | updateTenantCrmWebhook (Airtable) | storage.upsertTenantByHandle() / update capture_url in Supabase |
| /api/admin/create-tenant | Airtable create tenant | storage (Supabase insert tenant) |
| /api/stripe/webhook | findTenantBySubscriptionId, upsertTenantByHandle | storage (Supabase select/update tenants) |
| /api/gdpr/export, /api/gdpr/delete | Airtable leads/users | storage (Supabase leads/users) |
| /api/health | Airtable base select | Supabase: simple SELECT 1 or SELECT count(*) FROM tenants |
| Dashboard /c/[companyHandle] | Fetches via GET /api/leads | No change to UI; /api/leads must return same shape from Supabase |
| Any findTenantByHandle, findTenantByApiKey, findTenantBySubscriptionId | airtable.ts | storage.* equivalents |

**Important:** `app/api/leads/route.ts` currently uses a **direct** `fetch()` to Airtable API. It must be refactored to use the storage layer (e.g. `listLeadsForTenant(companyHandle)`) so it returns leads from Supabase with the same response shape.

---

## Customized demos and “saving for all customers”

- **Customized demos:** Driven by tenant row (handle, logo_url, brand_colors, etc.). All tenant reads go through the storage facade → Supabase. No behavior change; same data, new DB.
- **Saving for all customers:** Tenant create/update (admin, Stripe webhook, crm-webhook) and lead create (POST /api/lead) all go through storage → Supabase. Lead list (GET /api/leads) and GDPR export/delete use storage → Supabase. Users and Links, if used, get Supabase tables and DAL and are wired through the same facade.

---

## Zapier / automations

- Today: Airtable triggers (e.g. new record in Leads).
- After: Supabase/Postgres trigger or Supabase Edge Function that POSTs to a Zapier webhook URL when a row is inserted into `leads` (and optionally `tenants`). Document exact payload shape in this doc or in MAINTENANCE-GUIDE so you can recreate Zaps.

### Zap spec (full step-by-step)

**Complete 9-step spec with exact fields and values:** see **docs/TEMPORARY-TO-DO-LIST.md** Step 30. Use it when building the Supabase Zap.

One Zap currently uses Airtable in three places:

| Step | App | Action | Replacement with Supabase |
|------|-----|--------|---------------------------|
| 1 (trigger) | Airtable | New Record (15 min poll) | Supabase “New row” trigger on `leads`, or Webhooks “Catch Hook” + our app POSTs to that URL on lead insert |
| 6 | Airtable | Find Record | Supabase “Find row” (or filter) on `leads` / `tenants` by ID or email |
| 9 | Airtable | Update Record | Supabase “Update row” on `leads` (or relevant table) |

In between: ChatGPT (Send Prompt), Formatter (Extract Email, Extract Intent, Extract Summary, Text, Date/Time). Those steps stay as-is; only Airtable steps are replaced with Supabase (or Zapier Postgres / Webhooks) when we do Step 30.

**Full 9-step inventory (from screenshots):**

| Step | App | Action | Replacement |
|------|-----|--------|-------------|
| 1 | Airtable | New Record (Sunspire Leads, Leads, Grid view, 15 min) | Supabase New row on `leads` or Webhooks Catch Hook |
| 2 | ChatGPT 2.56.0 | Send Prompt — JSON with lead_email, intent_label, summary; Message body = Notes, Email hint = Email | Same; map trigger `notes`/`email` |
| 3 | Formatter | Extract Email — Pattern `"lead_email"\s*:\s*"([^"]+)"` on Step 2 Response | Same |
| 4 | Formatter | Extract Intent — Pattern `"intent_label"\s*:\s*"([^"]+)"` on Step 2 Response | Same |
| 5 | Formatter | Extract Summary — Pattern `"summary"\s*:\s*"([^"]+)"` on Step 2 Response | Same |
| 6 | Airtable 3.9.0 | Find Record — Base "Sunspire Leads", Table "Leads"; search by **Email** = Step 3 Output 0; **Create record if it doesn't exist**. Zap Search Success On Miss: False, Multiple Results: first | Supabase Find row on `leads` by `email`; replicate find-or-create with Insert fallback or upsert |
| 7 | Formatter | Text | Same (keep as-is) |
| 8 | Formatter | Date / Time — Transform: Format; Input: `now`; To Format: `MMMM DD YYYY HH:mm:ss`; To Timezone: America/New_York; From Timezone: UTC | Same |
| 9 | Airtable 3.9.0 | Update Record — Base "Sunspire Leads", Table "Leads"; **Record** = 6. ID (from Find Record); **Notes** = 1. Notes + 8. Output (formatted time) + 4. Output 0 (intent) + 5. Output 0 (summary) | Supabase Update row on `leads` by id (from Step 6 equivalent); set `notes` (or equivalent column) to same concatenation |

All three Airtable steps (1 trigger, 6 Find Record, 9 Update Record) are replaced with Supabase when you build the new Zap in Step 30.

---

## Verification

- Run full E2E: Sunspire customer (dashboard, leads list, tenant config) and homeowner (white-labeled report → lead submit → success; lead in Supabase and visible in dashboard).
- Every API above exercised by tests or runbook.
- Maintenance: GET /api/health and /status tested and documented; daily-check methods (UptimeRobot, Sentry) accurate in MAINTENANCE-GUIDE.
