#!/usr/bin/env node
/**
 * Check env vars required for full local E2E. Run before: npm run dev && BASE_URL=http://localhost:3000 npx playwright test tests/e2e-all-apis-estimations-visual.spec.ts
 * Usage: node scripts/check-env-for-e2e.mjs [--minimal]
 *   --minimal: only check vars needed for core tests (geo, estimate, report); Health/Stripe may be relaxed on local.
 */
import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

const minimal = process.argv.includes('--minimal');

const required = minimal
  ? [
      { key: 'GOOGLE_GEOCODING_API_KEY', hint: 'Server Geocoding (unrestricted). Must start with AIza.' },
      { key: 'NEXT_PUBLIC_GOOGLE_MAPS_API_KEY', hint: 'Client Places Autocomplete.' },
      { key: 'NREL_API_KEY', hint: 'Estimate API.' },
      { key: 'EIA_API_KEY', hint: 'Utility rates.' },
    ]
  : [
      { key: 'GOOGLE_GEOCODING_API_KEY', hint: 'Server Geocoding (unrestricted).' },
      { key: 'NEXT_PUBLIC_GOOGLE_MAPS_API_KEY', hint: 'Places Autocomplete.' },
      { key: 'NREL_API_KEY', hint: 'Estimate API.' },
      { key: 'EIA_API_KEY', hint: 'Utility rates.' },
      { key: 'STRIPE_LIVE_SECRET_KEY', hint: 'Checkout (or STRIPE_SECRET_KEY).' },
      { key: 'STRIPE_PRICE_MONTHLY_99', hint: 'Checkout (or STRIPE_PRICE_STARTER).' },
      { key: 'STRIPE_PRICE_SETUP_399', hint: 'Checkout setup price.' },
    ];

function loadEnv() {
  const dir = resolve(process.cwd());
  for (const name of ['.env.local', '.env']) {
    const p = resolve(dir, name);
    if (existsSync(p)) {
      const content = readFileSync(p, 'utf8');
      for (const line of content.split('\n')) {
        const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
        if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '').trim();
      }
    }
  }
}

loadEnv();

const missing = [];
const ok = [];
for (const { key, hint } of required) {
  const val = process.env[key];
  const set = typeof val === 'string' && val.length > 0;
  if (set) ok.push(key); else missing.push({ key, hint });
}

if (!minimal && !hasSupabasePair()) {
  missing.push({
    key: 'SUPABASE_URL (+ SERVICE_ROLE_KEY)',
    hint: 'Set SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY, or *_STAGING / *_PROD pairs (see .env.example).',
  });
}

if (missing.length) {
  console.error('Missing env (add to .env or .env.local):');
  missing.forEach(({ key, hint }) => console.error(`  ${key}  (${hint})`));
  console.error('\nRun: node scripts/check-env-for-e2e.mjs  (no --minimal for full E2E including Health + Stripe)');
  process.exit(1);
}

console.log('Env OK for', minimal ? 'minimal' : 'full', 'local E2E:', ok.join(', '));
process.exit(0);
