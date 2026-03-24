#!/usr/bin/env node
/**
 * Local-first verification: ensure dev server is up, APIs work, then run full test matrix.
 * Usage:
 *   1. In terminal 1: npm run dev
 *   2. In terminal 2: node scripts/verify-local-full.mjs
 * Or: npm run verify:local  (still requires dev server running in another terminal)
 *
 * Uses Chromium only. Set HEADED=1 to run with visible browser.
 */
import { spawn } from 'child_process';

function getBaseUrlFromEnv() {
  // Allow overriding if you already know the port.
  return process.env.BASE_URL || process.env.PLAYWRIGHT_BASE_URL || '';
}

async function detectWorkingLocalBaseUrl(range = [3000, 3001, 3002, 3003, 3004, 3005]) {
  const explicit = getBaseUrlFromEnv();
  if (explicit) return explicit;

  // Prefer an actual healthy 200 first.
  for (const port of range) {
    const base = `http://localhost:${port}`;
    try {
      const res = await fetch(`${base}/api/health`, { signal: AbortSignal.timeout(8000) });
      if (res.status === 200) return base;
    } catch (_) {
      // ignore
    }
  }

  // Fallback: allow 503 if it’s only optional integrations down (some setups intentionally return 503).
  for (const port of range) {
    const base = `http://localhost:${port}`;
    try {
      const res = await fetch(`${base}/api/health`, { signal: AbortSignal.timeout(8000) });
      if (res.status === 503) return base;
    } catch (_) {
      // ignore
    }
  }

  return '';
}

const env = {
  ...process.env,
  E2E_DEMO_COMPANY: process.env.E2E_DEMO_COMPANY || 'Metaca',
  E2E_DASHBOARD_HANDLE: process.env.E2E_DASHBOARD_HANDLE || 'metaca',
  E2E_PAID_COMPANY: process.env.E2E_PAID_COMPANY || 'paid',
};

async function waitForServer(baseUrl, maxAttempts = 30) {
  for (let i = 0; i < maxAttempts; i++) {
    try {
      const res = await fetch(`${baseUrl}/api/health`, { signal: AbortSignal.timeout(8000) });
      if (res.ok || res.status === 503) {
        console.log('Dev server is up at', baseUrl);
        return;
      }
    } catch (_) {}
    process.stderr.write(`Waiting for dev server at ${baseUrl} (${i + 1}/${maxAttempts})...\n`);
    await new Promise((r) => setTimeout(r, 2000));
  }
  throw new Error(`Dev server at ${baseUrl} did not respond. Start it with: npm run dev`);
}

async function runCheckApis() {
  return new Promise((resolve, reject) => {
    const child = spawn('node', ['scripts/check-apis-local.mjs'], {
      stdio: 'inherit',
      env: { ...process.env, BASE_URL: env.BASE_URL },
      cwd: process.cwd(),
    });
    child.on('close', (code) => (code === 0 ? resolve() : reject(new Error(`check-apis exited ${code}`))));
    child.on('error', reject);
  });
}

async function runTestMatrix() {
  const headed = process.env.HEADED === '1' || process.env.HEADED === 'true';
  const args = [
    'playwright', 'test',
    'tests/api/route-integration.spec.ts',
    'tests/e2e/smoke.spec.ts',
    'tests/e2e/full-user-journey.spec.ts',
    'tests/e2e/paid-report-cta-modal.spec.ts',
    'tests/e2e/report-lead-modal-notes.spec.ts',
    '--reporter=list',
    '--timeout=60000',
    '--workers=1',
    '--project=chromium',
  ];
  if (headed) {
    args.push('--headed');
    console.log('Running tests in headed mode (Chromium visible).');
  }
  return new Promise((resolve, reject) => {
    const child = spawn('npx', args, {
      stdio: 'inherit',
      env,
      cwd: process.cwd(),
    });
    child.on('close', (code) => (code === 0 ? resolve() : reject(new Error(`Playwright exited ${code}`))));
    child.on('error', reject);
  });
}

async function main() {
  console.log('=== Local-first verification ===\n');
  const baseUrl = await detectWorkingLocalBaseUrl();
  if (!baseUrl) throw new Error('Could not detect a running local Next server on ports 3000–3005.');

  env.BASE_URL = baseUrl;
  env.PLAYWRIGHT_BASE_URL = baseUrl;

  await waitForServer(baseUrl);
  console.log('\n=== API check ===\n');
  await runCheckApis();
  console.log('\n=== Full test matrix (Chromium) ===\n');
  await runTestMatrix();
  console.log('\n=== All local checks passed. ===');
  process.exit(0);
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
