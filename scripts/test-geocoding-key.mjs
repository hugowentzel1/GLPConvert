#!/usr/bin/env node
/**
 * Test Google Geocoding API key directly (no Next.js).
 * Usage: GOOGLE_GEOCODING_API_KEY=AIza... node scripts/test-geocoding-key.mjs
 *    or: node scripts/test-geocoding-key.mjs AIza...
 */
const key = process.env.GOOGLE_GEOCODING_API_KEY || process.argv[2];
if (!key) {
  console.error('Usage: GOOGLE_GEOCODING_API_KEY=AIza... node scripts/test-geocoding-key.mjs');
  process.exit(1);
}
const trimmed = key.trim();
if (!trimmed.startsWith('AIza')) {
  console.error('Key must start with "AIza" (capital I). Got:', trimmed.slice(0, 4));
  process.exit(1);
}
const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent('1600 Amphitheatre Parkway, Mountain View, CA')}&key=${trimmed}`;
const res = await fetch(url);
const data = await res.json();
console.log(JSON.stringify(data, null, 2));
if (data.status === 'OK' && data.results?.length) {
  console.log('\n✓ Geocoding works. Use this key as GOOGLE_GEOCODING_API_KEY.');
  process.exit(0);
}
console.error('\n✗ Geocoding failed:', data.status, data.error_message || '');
process.exit(1);
