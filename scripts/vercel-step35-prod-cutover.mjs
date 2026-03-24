#!/usr/bin/env node
/**
 * Step 35: Set Production Supabase (generic keys) from *_PROD values,
 * remove AIRTABLE_* from Production, optionally trigger redeploy.
 * Reads VERCEL_TOKEN, VERCEL_PROJECT_ID, SUPABASE_URL_PROD, SUPABASE_SERVICE_ROLE_KEY_PROD from .env.local
 *
 * Usage: node scripts/vercel-step35-prod-cutover.mjs [--no-redeploy]
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const envPath = path.join(root, ".env.local");

function loadDotEnv(file) {
  if (!fs.existsSync(file)) {
    console.error("Missing .env.local — create it from .env.example");
    process.exit(1);
  }
  const env = {};
  for (const line of fs.readFileSync(file, "utf8").split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const eq = t.indexOf("=");
    if (eq === -1) continue;
    const k = t.slice(0, eq).trim();
    let v = t.slice(eq + 1).trim();
    if (
      (v.startsWith('"') && v.endsWith('"')) ||
      (v.startsWith("'") && v.endsWith("'"))
    ) {
      v = v.slice(1, -1);
    }
    env[k] = v;
  }
  return env;
}

async function vercelFetch(url, token, opts = {}) {
  const res = await fetch(url, {
    ...opts,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...(opts.headers || {}),
    },
  });
  const text = await res.text();
  let json;
  try {
    json = text ? JSON.parse(text) : {};
  } catch {
    json = { raw: text };
  }
  if (!res.ok) {
    const err = new Error(`Vercel API ${res.status}: ${text.slice(0, 500)}`);
    err.status = res.status;
    err.body = json;
    throw err;
  }
  return json;
}

async function main() {
  const noRedeploy = process.argv.includes("--no-redeploy");
  const env = loadDotEnv(envPath);
  const token = env.VERCEL_TOKEN;
  const projectId = env.VERCEL_PROJECT_ID;
  const urlProd = env.SUPABASE_URL_PROD;
  const keyProd = env.SUPABASE_SERVICE_ROLE_KEY_PROD;

  if (!token || !projectId) {
    console.error("Need VERCEL_TOKEN and VERCEL_PROJECT_ID in .env.local");
    process.exit(1);
  }
  if (!urlProd || !keyProd) {
    console.error(
      "Need SUPABASE_URL_PROD and SUPABASE_SERVICE_ROLE_KEY_PROD in .env.local",
    );
    process.exit(1);
  }

  let teamId = env.VERCEL_TEAM_ID || env.TEAM_ID;
  const base = `https://api.vercel.com`;
  const qTeam = teamId ? `?teamId=${encodeURIComponent(teamId)}` : "";

  async function tryListEnv() {
    return vercelFetch(
      `${base}/v9/projects/${encodeURIComponent(projectId)}/env${qTeam}`,
      token,
    );
  }

  let listed;
  try {
    listed = await tryListEnv();
  } catch (e) {
    if (e.status === 404 || e.status === 403) {
      console.log(
        "Listing env failed; if this is a team project, set VERCEL_TEAM_ID in .env.local (team slug or id from Vercel → Team Settings).",
      );
    }
    throw e;
  }

  const envs = listed.envs || [];
  const productionAirtable = envs.filter(
    (e) =>
      (e.key === "AIRTABLE_API_KEY" || e.key === "AIRTABLE_BASE_ID") &&
      (e.target || []).includes("production"),
  );

  console.log("Upserting SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY (production)…");
  for (const [key, value] of [
    ["SUPABASE_URL", urlProd],
    ["SUPABASE_SERVICE_ROLE_KEY", keyProd],
  ]) {
    const upsertUrl = `${base}/v10/projects/${encodeURIComponent(projectId)}/env?upsert=true${teamId ? `&teamId=${encodeURIComponent(teamId)}` : ""}`;
    await vercelFetch(upsertUrl, token, {
      method: "POST",
      body: JSON.stringify({
        key,
        value,
        type: "sensitive",
        target: ["production"],
        comment: "Step 35: prod Supabase (from script)",
      }),
    });
    console.log(`  OK ${key}`);
  }

  for (const row of productionAirtable) {
    const delUrl = `${base}/v9/projects/${encodeURIComponent(projectId)}/env/${row.id}${qTeam}`;
    await vercelFetch(delUrl, token, { method: "DELETE" });
    console.log(`  Removed ${row.key} (production)`);
  }
  if (productionAirtable.length === 0) {
    console.log(
      "  No AIRTABLE_* vars found for production (already removed or never set).",
    );
  }

  if (noRedeploy) {
    console.log("Skip redeploy (--no-redeploy). Trigger redeploy in Vercel UI.");
    return;
  }

  console.log("Fetching latest production deployment to redeploy…");
  const depList = await vercelFetch(
    `${base}/v6/deployments?projectId=${encodeURIComponent(projectId)}&target=production&limit=1${teamId ? `&teamId=${encodeURIComponent(teamId)}` : ""}`,
    token,
  );
  const dep = depList.deployments?.[0];
  if (!dep?.uid) {
    console.error("Could not find a production deployment to redeploy.");
    process.exit(1);
  }
  const redeployUrl = `${base}/v13/deployments?forceNew=1${teamId ? `&teamId=${encodeURIComponent(teamId)}` : ""}`;
  const body = {
    deploymentId: dep.uid,
    name: dep.name || projectId,
    target: "production",
    // Pick up latest commit + refreshed Production env after upsert/delete
    withLatestCommit: true,
  };
  const redeployed = await vercelFetch(redeployUrl, token, {
    method: "POST",
    body: JSON.stringify(body),
  });
  console.log("Redeploy triggered:", redeployed.id || redeployed.uid || "ok");
}

main().catch((e) => {
  console.error(e.message || e);
  process.exit(1);
});
