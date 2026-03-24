#!/usr/bin/env node
/**
 * Seed Supabase (staging) with one test tenant and one test lead.
 * Loads .env.local from repo root so you only need to run: node scripts/seed-supabase-staging.mjs
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const envPaths = [
  resolve(root, ".env.local"),
  resolve(root, "docs", ".env.local"),
];
for (const envPath of envPaths) {
  if (existsSync(envPath)) {
    const lines = readFileSync(envPath, "utf8").split("\n");
    for (const line of lines) {
      const m = line.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
      if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "").trim();
    }
  }
}

const url = process.env.SUPABASE_URL || process.env.SUPABASE_URL_STAGING;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY_STAGING;
if (!url || !key) {
  console.error("Add SUPABASE_URL_STAGING and SUPABASE_SERVICE_ROLE_KEY_STAGING to .env.local (same names as in Vercel).");
  process.exit(1);
}

const supabase = createClient(url, key, { auth: { persistSession: false } });

async function main() {
  const { data: existing } = await supabase
    .from("tenants")
    .select("id")
    .eq("handle", "test-tenant")
    .maybeSingle();
  let tenantId = existing?.id;
  if (!tenantId) {
    const { data: tenant, error: e1 } = await supabase
      .from("tenants")
      .insert({
        handle: "test-tenant",
        plan: "demo",
        name: "Test Tenant",
      })
      .select("id")
      .single();
    if (e1) {
      console.error("Insert tenant failed:", e1.message);
      process.exit(1);
    }
    tenantId = tenant.id;
    console.log("Created tenant test-tenant:", tenantId);
  } else {
    console.log("Tenant test-tenant already exists:", tenantId);
  }

  const { data: leadExists } = await supabase
    .from("leads")
    .select("id")
    .eq("tenant_id", tenantId)
    .eq("email", "test@example.com")
    .maybeSingle();
  if (!leadExists) {
    const { error: e2 } = await supabase.from("leads").insert({
      tenant_id: tenantId,
      name: "Test",
      email: "test@example.com",
      address: "123 Main St",
      status: "New",
    });
    if (e2) {
      console.error("Insert lead failed:", e2.message);
      process.exit(1);
    }
    console.log("Created lead test@example.com");
  } else {
    console.log("Lead test@example.com already exists");
  }
  console.log("Done. Run the app with SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY set, then hit /c/test-tenant/leads");
}

main();
