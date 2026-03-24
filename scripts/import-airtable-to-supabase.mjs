#!/usr/bin/env node
/**
 * Import Airtable CSV export into Supabase (tenants + leads).
 * Usage: node scripts/import-airtable-to-supabase.mjs [--tenants path] [--leads path] [--prod]
 * Use --prod to target production (SUPABASE_URL_PROD + SUPABASE_SERVICE_ROLE_KEY_PROD). Otherwise uses SUPABASE_URL / _STAGING / _PROD.
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

// Load .env.local from root then docs
const envPaths = [resolve(root, ".env.local"), resolve(root, "docs", ".env.local")];
for (const envPath of envPaths) {
  if (existsSync(envPath)) {
    const lines = readFileSync(envPath, "utf8").split("\n");
    for (const line of lines) {
      const trimmed = line.replace(/^\s*export\s+/i, "").trim();
      const m = trimmed.match(/^([A-Za-z_][A-Za-z0-9_]*)\s*[=\-]\s*(.*)$/);
      if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "").trim();
    }
  }
}
const hasProdUrl = !!(process.env.SUPABASE_URL_PROD || process.env.SUPABASE_URL);
const hasProdKey = !!(process.env.SUPABASE_SERVICE_ROLE_KEY_PROD || process.env.SUPABASE_SERVICE_ROLE_KEY);

const useProd = process.argv.includes("--prod");
const url = useProd
  ? (process.env.SUPABASE_URL_PROD || process.env.SUPABASE_URL)
  : (process.env.SUPABASE_URL || process.env.SUPABASE_URL_STAGING || process.env.SUPABASE_URL_PROD);
const key = useProd
  ? (process.env.SUPABASE_SERVICE_ROLE_KEY_PROD || process.env.SUPABASE_SERVICE_ROLE_KEY)
  : (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY_STAGING || process.env.SUPABASE_SERVICE_ROLE_KEY_PROD);
if (!url || !key) {
  if (useProd) console.error("Prod URL set:", hasProdUrl, "Prod key set:", hasProdKey);
  console.error(useProd
    ? "Set SUPABASE_URL_PROD and SUPABASE_SERVICE_ROLE_KEY_PROD (or SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY) in .env.local or docs/.env.local for --prod"
    : "Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (or _STAGING/_PROD) in .env.local");
  process.exit(1);
}
if (useProd) console.error("Target: PRODUCTION Supabase");

const supabase = createClient(url, key, { auth: { persistSession: false } });

function parseArgs() {
  const args = process.argv.slice(2);
  let tenantsPath = resolve(root, "data", "airtable", "tenants.csv");
  let leadsPath = resolve(root, "data", "airtable", "leads.csv");
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--tenants" && args[i + 1]) tenantsPath = resolve(args[++i]);
    else if (args[i] === "--leads" && args[i + 1]) leadsPath = resolve(args[++i]);
  }
  return { tenantsPath, leadsPath };
}

/** Split CSV content into logical rows (newlines inside quoted fields do not break rows). */
function splitCSVRows(content) {
  const rows = [];
  let start = 0;
  let inQuote = false;
  for (let i = 0; i < content.length; i++) {
    const c = content[i];
    if (c === '"') {
      if (inQuote && content[i + 1] === '"') { i++; continue; }
      inQuote = !inQuote;
      continue;
    }
    if (!inQuote && (c === "\n" || (c === "\r" && content[i + 1] === "\n"))) {
      rows.push(content.slice(start, i).trim());
      start = i + (c === "\r" ? 2 : 1);
      i = start - 1;
    }
  }
  if (start < content.length) rows.push(content.slice(start).trim());
  return rows.filter(Boolean);
}

/** Parse a single CSV line respecting double-quoted fields (may contain commas). */
function parseCSVLine(line) {
  const out = [];
  let i = 0;
  while (i < line.length) {
    if (line[i] === '"') {
      let pos = i + 1;
      let value = "";
      let endPos = line.length;
      while (pos < line.length) {
        const next = line.indexOf('"', pos);
        if (next === -1) {
          value += line.slice(pos);
          endPos = line.length;
          break;
        }
        if (line[next + 1] === '"') {
          value += line.slice(pos, next + 1);
          pos = next + 2;
          continue;
        }
        value += line.slice(pos, next);
        endPos = next + 1;
        break;
      }
      out.push(value.replace(/""/g, '"').trim());
      i = line[endPos] === "," ? endPos + 1 : endPos;
      continue;
    }
    const comma = line.indexOf(",", i);
    const slice = comma === -1 ? line.slice(i) : line.slice(i, comma);
    out.push(slice.trim());
    i = comma === -1 ? line.length : comma + 1;
  }
  return out;
}

function parseCSV(content) {
  const lines = splitCSVRows(content.trim());
  if (lines.length === 0) return [];
  const headers = parseCSVLine(lines[0]);
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    let values = parseCSVLine(lines[i]);
    if (values.length < headers.length) {
      values = values.concat(Array(headers.length - values.length).fill(""));
    }
    const row = {};
    headers.forEach((h, j) => { row[h] = values[j] ?? ""; });
    rows.push(row);
  }
  return rows;
}

// Map Airtable-style or generic CSV headers to Supabase tenants columns
const TENANT_HEADER_MAP = {
  "Company Handle": "handle", Handle: "handle", handle: "handle",
  "Company Name": "name", Name: "name", name: "name",
  Plan: "plan", plan: "plan",
  "Domain / Login URL": "domain_login_url", domain_login_url: "domain_login_url",
  "Brand Colors": "brand_colors", brand_colors: "brand_colors",
  "Logo URL": "logo_url", logo_url: "logo_url",
  "Stripe Customer ID": "stripe_customer_id", stripe_customer_id: "stripe_customer_id",
  "Subscription ID": "subscription_id", subscription_id: "subscription_id",
  "Notification Email": "notification_email", notification_email: "notification_email",
  "API Key": "api_key", api_key: "api_key",
};

// Map Airtable-style or generic CSV headers to Supabase leads columns (tenant_id set separately)
const LEAD_HEADER_MAP = {
  Name: "name", name: "name",
  Email: "email", email: "email",
  Phone: "phone", phone: "phone",
  Address: "address", address: "address",
  Street: "street", street: "street",
  City: "city", city: "city",
  State: "state", state: "state",
  "Postal Code": "postal_code", postal_code: "postal_code",
  Country: "country", country: "country",
  Status: "status", status: "status",
  Notes: "notes", notes: "notes",
  Company: "company", company: "company",
  "Demo URL": "demo_url", demo_url: "demo_url",
  "Campaign ID": "campaign_id", campaign_id: "campaign_id",
  "Last Activity": "last_activity", last_activity: "last_activity",
  "Created": "created_at", "Created Time": "created_at", created_at: "created_at",
  "Tenant": "tenant_handle", "Company Handle": "tenant_handle", "Tenant Handle": "tenant_handle",
};

function mapTenantRow(row) {
  const out = { updated_at: new Date().toISOString() };
  for (const [header, value] of Object.entries(row)) {
    if (value === "" || value == null) continue;
    const col = TENANT_HEADER_MAP[header];
    if (col && col !== "handle") out[col] = value;
    else if (header === "Company Handle" || header === "Handle" || header === "handle") out.handle = value;
    else if (header === "Name" || header === "Company Name" || header === "name") out.name = value;
    else if (header === "Plan" || header === "plan") out.plan = value;
  }
  return out;
}

function mapLeadRow(row, tenantIdByHandle, rowIndexForPlaceholder = 0) {
  let tenantHandle = (row["Company Handle"] ?? row["Tenant"] ?? row["Tenant Handle"] ?? row["Company"] ?? row.tenant_handle ?? row.handle ?? "").trim();
  let tenantId = tenantIdByHandle[tenantHandle];
  if (!tenantId && tenantHandle) return null;
  // If CSV has no tenant column or it's empty, use the single tenant when there's only one (e.g. staging)
  if (!tenantId) {
    const ids = Object.values(tenantIdByHandle);
    const unique = [...new Set(ids)];
    if (unique.length === 1) tenantId = unique[0];
  }
  if (!tenantId) return null;
  const out = { tenant_id: tenantId, status: "New", updated_at: new Date().toISOString() };
  for (const [header, value] of Object.entries(row)) {
    if (value === "" || value == null) continue;
    const col = LEAD_HEADER_MAP[header];
    if (col && col !== "tenant_handle") out[col] = value;
    else if (header === "Email" || header === "email") out.email = value;
    else if (header === "Name" || header === "name") out.name = value;
    else if (header === "Address" || header === "address") out.address = value;
    else if (header === "Status" || header === "status") out.status = value;
  }
  // DB requires email NOT NULL; use stable placeholder when CSV has no email so row still imports (stable = idempotent re-runs)
  if (!out.email || !String(out.email).trim()) {
    out.email = `import-${rowIndexForPlaceholder}@import.placeholder`;
  }
  return out;
}

async function main() {
  const { tenantsPath, leadsPath } = parseArgs();
  if (!existsSync(tenantsPath)) {
    console.error("Tenants CSV not found:", tenantsPath);
    console.error("Export from Airtable and save as data/airtable/tenants.csv");
    process.exit(1);
  }

  const tenantRows = parseCSV(readFileSync(tenantsPath, "utf8"));
  const handleToId = {};
  let inserted = 0;
  let skipped = 0;
  for (const row of tenantRows) {
    const handle = (row["Company Handle"] ?? row.Handle ?? row.handle ?? "").trim();
    if (!handle) { skipped++; continue; }
    const name = (row["Company Name"] ?? row.Name ?? row.name ?? "").trim();
    const existing = await supabase.from("tenants").select("id").eq("handle", handle).maybeSingle();
    if (existing.data?.id) {
      handleToId[handle] = existing.data.id;
      if (name) handleToId[name] = existing.data.id;
      skipped++;
      continue;
    }
    const payload = mapTenantRow(row);
    payload.handle = handle;
    if (!payload.name) payload.name = handle;
    const { data, error } = await supabase.from("tenants").insert(payload).select("id").single();
    if (error) {
      console.error("Tenant insert error:", handle, error.message);
      continue;
    }
    handleToId[handle] = data.id;
    if (name) handleToId[name] = data.id;
    inserted++;
  }
  console.log("Tenants: inserted", inserted, "skipped", skipped);

  if (!existsSync(leadsPath)) {
    console.log("Leads CSV not found:", leadsPath, "- skipping leads.");
    return;
  }
  const leadRows = parseCSV(readFileSync(leadsPath, "utf8"));
  const toInsert = [];
  let leadSkipped = 0;
  leadRows.forEach((row, idx) => {
    const mapped = mapLeadRow(row, handleToId, idx);
    if (!mapped) { leadSkipped++; return; }
    toInsert.push(mapped);
  });
  // Idempotent: skip leads that already exist (same tenant_id + email)
  let toInsertFiltered = toInsert;
  if (toInsert.length > 0) {
    const tenantIds = [...new Set(toInsert.map((r) => r.tenant_id))];
    const { data: existing } = await supabase.from("leads").select("tenant_id, email").in("tenant_id", tenantIds);
    const existingKey = (t, e) => `${t}|${e}`;
    const existingSet = new Set((existing || []).map((r) => existingKey(r.tenant_id, r.email)));
    toInsertFiltered = toInsert.filter((r) => !existingSet.has(existingKey(r.tenant_id, r.email)));
    leadSkipped += toInsert.length - toInsertFiltered.length;
  }
  const BATCH = 50;
  let leadInserted = 0;
  for (let i = 0; i < toInsertFiltered.length; i += BATCH) {
    const batch = toInsertFiltered.slice(i, i + BATCH);
    const { error } = await supabase.from("leads").insert(batch);
    if (error) {
      console.error("Lead insert error (batch):", error.message);
      for (const row of batch) {
        const { error: e } = await supabase.from("leads").insert(row);
        if (e) console.error("  ", row.email, e.message);
        else leadInserted++;
      }
    } else {
      leadInserted += batch.length;
    }
  }
  console.log("Leads: inserted", leadInserted, "skipped", leadSkipped);
  console.log("Done.");
}

main();
