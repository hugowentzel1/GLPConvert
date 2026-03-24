#!/usr/bin/env node
/**
 * POST synthetic test results to the app's /api/synthetic-results.
 * Call from CI after running synthetic tests. No token required; app rate-limits POSTs.
 * Usage: SYNTHETIC_HOMEOWNER_STATUS=success SYNTHETIC_BUYER_STATUS=success SYNTHETIC_APP_URL=https://... node scripts/post-synthetic-results.mjs
 */
const appUrl = process.env.SYNTHETIC_APP_URL || process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}` || process.env.BASE_URL || 'https://sunspire-web-app.vercel.app';
const token = process.env.SYNTHETIC_REPORT_TOKEN;
const homeownerOutcome = (process.env.SYNTHETIC_HOMEOWNER_STATUS || 'unknown').toLowerCase();
const buyerOutcome = (process.env.SYNTHETIC_BUYER_STATUS || 'unknown').toLowerCase();
const runId = process.env.GITHUB_RUN_ID || '';
const runUrl = process.env.GITHUB_SERVER_URL && process.env.GITHUB_REPOSITORY && process.env.GITHUB_RUN_ID
  ? `${process.env.GITHUB_SERVER_URL}/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}`
  : undefined;

const now = new Date().toISOString();
const mapStatus = (o) => (o === 'success' ? 'pass' : o === 'failure' ? 'fail' : 'degraded');

const payload = {
  homeowner: {
    testName: 'Homeowner production flow',
    status: mapStatus(homeownerOutcome),
    lastRun: now,
    summary: homeownerOutcome === 'success' ? 'Quote flow passed' : homeownerOutcome === 'failure' ? 'Quote flow failed' : 'Not run or unknown',
    failureReason: homeownerOutcome === 'failure' ? 'See workflow artifacts' : undefined,
    artifactsUrl: runUrl,
    environment: 'production',
  },
  buyer: {
    testName: 'Buyer checkout flow',
    status: mapStatus(buyerOutcome),
    lastRun: now,
    summary: buyerOutcome === 'success' ? 'Checkout session created' : buyerOutcome === 'failure' ? 'Checkout flow failed' : 'Not run or unknown',
    failureReason: buyerOutcome === 'failure' ? 'See workflow artifacts' : undefined,
    artifactsUrl: runUrl,
    environment: 'production',
  },
  lastUpdated: now,
};

const url = appUrl.replace(/\/$/, '') + '/api/synthetic-results';
(async () => {
  try {
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const res = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      console.error('POST failed:', res.status, await res.text());
      process.exit(1);
    }
    console.log('Synthetic results posted to', url);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
