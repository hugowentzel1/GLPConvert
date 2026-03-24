#!/usr/bin/env node
/**
 * Verify all key APIs work locally. Run with dev server up: npm run dev (in another terminal), then:
 *   node scripts/check-apis-local.mjs
 * Or: npm run dev & sleep 15 && node scripts/check-apis-local.mjs
 */
const BASE = process.env.BASE_URL || 'http://localhost:3000';

async function waitForServer(maxAttempts = 10) {
  for (let i = 0; i < maxAttempts; i++) {
    try {
      const res = await fetch(`${BASE}/api/health`, { signal: AbortSignal.timeout(3000) });
      if (res.ok || res.status === 503) return;
    } catch (_) {}
    await new Promise((r) => setTimeout(r, 2000));
  }
  throw new Error(`Server at ${BASE} did not respond. Start with: npm run dev`);
}

async function check(name, fn) {
  try {
    await fn();
    console.log(`✓ ${name}`);
    return true;
  } catch (e) {
    console.error(`✗ ${name}:`, e.message || e);
    return false;
  }
}

async function main() {
  console.log(`Checking APIs at ${BASE}...\n`);
  await waitForServer();

  const results = [];

  results.push(await check('GET /api/health', async () => {
    const res = await fetch(`${BASE}/api/health`);
    const data = await res.json().catch(() => ({}));
    if (res.status !== 200 && res.status !== 503) throw new Error(`status ${res.status}`);
    if (!data.services || !Array.isArray(data.services)) throw new Error('missing services array');
    const down = (data.services || []).filter((s) => s.status !== 'ok');
    if (down.length) console.log('  (some services down:', down.map((s) => s.service + ': ' + (s.error || s.status)).join('; ') + ')');
  }));

  results.push(await check('GET /api/estimate (valid params)', async () => {
    const params = new URLSearchParams({
      address: '1600 Amphitheatre Parkway, Mountain View, CA',
      lat: '37.422',
      lng: '-122.084',
      state: 'CA',
      systemKw: '10',
      tilt: '22',
      azimuth: '180',
      lossesPct: '14',
    });
    const res = await fetch(`${BASE}/api/estimate?${params}`);
    if (res.status !== 200) throw new Error(`status ${res.status}`);
    const data = await res.json();
    if (!data.estimate) throw new Error('missing estimate');
  }));

  results.push(await check('GET /api/geo/normalize', async () => {
    const res = await fetch(
      `${BASE}/api/geo/normalize?address=${encodeURIComponent('1600 Amphitheatre Parkway, Mountain View, CA')}`
    );
    const data = await res.json().catch(() => ({}));
    if (res.status === 503 && data.error) return; // key missing is ok for this check
    if (res.status !== 200) throw new Error(`status ${res.status}`);
    if (typeof data.lat !== 'number' || typeof data.lng !== 'number') throw new Error('missing lat/lng');
  }));

  results.push(await check('POST /api/lead (validation: 400 without body)', async () => {
    const res = await fetch(`${BASE}/api/lead`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });
    if (res.status !== 400 && res.status !== 429) throw new Error(`expected 400/429, got ${res.status}`);
  }));

  results.push(await check('GET /status page', async () => {
    const res = await fetch(`${BASE}/status`);
    if (res.status !== 200) throw new Error(`status ${res.status}`);
    const text = await res.text();
    // /status is client-rendered; HTML often contains a loading placeholder.
    // We only assert we got the page shell /status.
    if (
      !text.includes('Checking system status') &&
      !text.includes('System Status') &&
      !text.includes('status-page-content')
    ) {
      throw new Error('status page content missing expected markers');
    }
  }));

  const ok = results.every(Boolean);
  console.log('\nDone. If all ✓, APIs work locally.');
  process.exit(ok ? 0 : 1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
