/**
 * E2E: Full cold-email customer journey — as if we are the customer.
 *
 * Journey: Individualized demo link → nav (Pricing, Partners, Support) →
 * CTA → Stripe checkout (intercept; simulate post-pay) → Dashboard →
 * every dashboard action → Instant URL → Embed URL. Then optional lead flow.
 *
 * Run (with npm run dev on port 3000):
 *   npx playwright test tests/e2e-cold-email-customer-journey.spec.ts --project=chromium --headed
 *
 * Sources: STRIPE-CHECKOUT-FLOW.md, POST-BUY-DASHBOARD.md, TO-DO-LIST.md (legal/E2E).
 */

import { test, expect } from '@playwright/test';

const BASE = process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:3000';
const DEMO_COMPANY = 'SolarCorp';
const COMPANY_HANDLE = 'solarcorp'; // create-checkout normalizes: toLowerCase, replace non-alnum with -
const STEP_DELAY_MS = 1200;

test.describe('Cold-email customer journey (full simulation)', () => {
  test('1. Demo link → nav → CTA → dashboard → all actions → instant URL → embed', async ({ page, context }) => {
    const results: { step: string; ok: boolean; detail?: string }[] = [];

    // ——— STEP 1: Land on individualized demo link (as if from cold email) ———
    await page.goto(`${BASE}/?company=${DEMO_COMPANY}&demo=1`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(STEP_DELAY_MS);
    const headerText = await page.locator('header').first().textContent().catch(() => '');
    const hasCompanyName = /SolarCorp|solarcorp/i.test(headerText ?? '');
    results.push({ step: '1. Demo link loads with company name in header', ok: hasCompanyName, detail: headerText?.slice(0, 80) });
    expect(headerText).toMatch(/SolarCorp|Solar Intelligence/i);

    // ——— STEP 2: Nav — Pricing ———
    await page.getByRole('link', { name: /Pricing/i }).first().click();
    await page.waitForURL(/\/pricing/, { timeout: 8000 });
    await page.waitForTimeout(STEP_DELAY_MS);
    const pricingBody = await page.locator('body').textContent() ?? '';
    results.push({ step: '2. Pricing link → /pricing', ok: page.url().includes('/pricing') && /pricing|price|plan/i.test(pricingBody) });
    expect(page.url()).toContain('/pricing');

    // ——— STEP 3: Back to demo, Partners ———
    await page.goto(`${BASE}/?company=${DEMO_COMPANY}&demo=1`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);
    await page.getByRole('link', { name: /Partners/i }).first().click();
    await page.waitForURL(/\/partners/, { timeout: 8000 });
    await page.waitForTimeout(STEP_DELAY_MS);
    results.push({ step: '3. Partners link → /partners', ok: page.url().includes('/partners') });
    expect(page.url()).toContain('/partners');

    // ——— STEP 4: Back to demo, Support ———
    await page.goto(`${BASE}/?company=${DEMO_COMPANY}&demo=1`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);
    await page.getByRole('link', { name: /Support/i }).first().click();
    await page.waitForURL(/\/support/, { timeout: 8000 });
    await page.waitForTimeout(STEP_DELAY_MS);
    results.push({ step: '4. Support link → /support', ok: page.url().includes('/support') });
    expect(page.url()).toContain('/support');

    // ——— STEP 5: CTA → create-checkout-session (intercept to capture success_url; then simulate post-pay) ———
    await page.goto(`${BASE}/?company=${DEMO_COMPANY}&demo=1`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);

    let checkoutSuccessUrl = '';
    await page.route('**/api/stripe/create-checkout-session', async (route) => {
      const req = route.request();
      if (req.method() !== 'POST') return route.continue();
      const res = await route.fetch();
      const body = await res.json().catch(() => ({}));
      if (body.url) {
        try {
          const stripeUrl = new URL(body.url);
          checkoutSuccessUrl = stripeUrl.searchParams.get('success_url') || body.url;
        } catch {
          checkoutSuccessUrl = body.url;
        }
      }
      await route.fulfill({ response: res });
    });

    const cta = page.getByRole('button', { name: /Launch Your Branded Version Now/i }).first();
    const checkoutRequestPromise = page.waitForRequest(req => req.url().includes('create-checkout-session') && req.method() === 'POST', { timeout: 15000 }).then(() => true).catch(() => false);
    await cta.click();
    const requestSent = await checkoutRequestPromise;
    await page.waitForTimeout(3000);
    const wentToStripe = page.url().includes('stripe.com') || page.url().includes('checkout.stripe');
    results.push({ step: '5. CTA → Stripe checkout (request sent; redirect or success_url if keys set)', ok: wentToStripe || requestSent, detail: wentToStripe ? 'Redirected to Stripe' : (checkoutSuccessUrl ? `success_url: ${checkoutSuccessUrl.slice(0, 60)}...` : (requestSent ? 'Request sent (Stripe may fail locally)' : '')) });
    if (checkoutSuccessUrl) expect(checkoutSuccessUrl).toContain(`/c/${COMPANY_HANDLE}`);

    // ——— STEP 6: Simulate post-pay — land on dashboard ———
    await page.goto(`${BASE}/c/${COMPANY_HANDLE}?session_id=cs_test_sim&demo=1`, { waitUntil: 'networkidle' });
    await page.waitForSelector('text=Instant URL', { timeout: 15000 });
    await page.waitForTimeout(STEP_DELAY_MS);
    const dashBody = await page.locator('body').textContent() ?? '';
    const hasDashboard = /Dashboard|Instant URL|Embed Code|View Leads/i.test(dashBody);
    results.push({ step: '6. Post-pay → /c/solarcorp dashboard', ok: hasDashboard });
    expect(hasDashboard).toBeTruthy();

    // ——— STEP 7: Copy URL ———
    await page.getByRole('button', { name: /Copy URL/i }).first().click();
    await page.waitForTimeout(800);
    const copyUrlOk = await page.getByText('✅ Copied!').first().isVisible().catch(() => false);
    results.push({ step: '7. Copy URL button', ok: copyUrlOk });
    expect(copyUrlOk).toBeTruthy();

    // ——— STEP 8: Visit Site (new tab → paid page) ———
    const visitLink = page.locator('a:has-text("Visit Site")').first();
    const [paidTab] = await Promise.all([
      context.waitForEvent('page', { timeout: 5000 }),
      visitLink.click(),
    ]);
    await paidTab.waitForLoadState('domcontentloaded');
    await paidTab.waitForTimeout(STEP_DELAY_MS);
    const paidUrl = paidTab.url();
    const paidOk = paidUrl.includes('/paid') && paidUrl.includes('company=');
    results.push({ step: '8. Visit Site → paid calculator tab', ok: paidOk, detail: paidUrl });
    expect(paidUrl).toMatch(/\/paid\?company=solarcorp/);
    await paidTab.close();
    await page.waitForTimeout(500);

    // ——— STEP 9: Copy Embed Code ———
    await page.getByRole('button', { name: /Copy Embed Code/i }).click();
    await page.waitForTimeout(800);
    const copyEmbedOk = await page.getByText('✅ Code Copied!').first().isVisible().catch(() => false);
    results.push({ step: '9. Copy Embed Code', ok: copyEmbedOk });
    expect(copyEmbedOk).toBeTruthy();

    // ——— STEP 10: Setup Instructions ———
    await page.getByRole('link', { name: /Setup Instructions/i }).click();
    await page.waitForURL(/\/docs\/setup/, { timeout: 8000 });
    await page.waitForTimeout(STEP_DELAY_MS);
    const setupOk = page.url().includes('/docs/setup');
    results.push({ step: '10. Setup Instructions → /docs/setup', ok: setupOk });
    expect(setupOk).toBeTruthy();
    await page.goto(`${BASE}/c/${COMPANY_HANDLE}?session_id=cs_test_sim&demo=1`, { waitUntil: 'networkidle' });
    await page.waitForSelector('text=Instant URL', { timeout: 10000 });
    await page.waitForTimeout(500);

    // ——— STEP 11: Copy API Key ———
    await page.getByRole('button', { name: /Copy API Key/i }).click();
    await page.waitForTimeout(800);
    const copyApiOk = await page.getByText('✅ Copied!').first().isVisible().catch(() => false);
    results.push({ step: '11. Copy API Key', ok: copyApiOk });
    expect(copyApiOk).toBeTruthy();

    // ——— STEP 12: View Leads ———
    await page.getByRole('link', { name: /View Leads/i }).click();
    await page.waitForURL(new RegExp(`/c/${COMPANY_HANDLE}/leads`), { timeout: 8000 });
    await page.waitForTimeout(2000);
    const leadsBody = await page.locator('body').textContent() ?? '';
    const leadsOk = /Leads Dashboard|No leads yet|View Leads|Failed to fetch|Open your dashboard/i.test(leadsBody);
    results.push({ step: '12. View Leads → /c/solarcorp/leads', ok: leadsOk });
    expect(leadsOk).toBeTruthy();
    await page.goto(`${BASE}/c/${COMPANY_HANDLE}?session_id=cs_test_sim&demo=1`, { waitUntil: 'networkidle' });
    await page.waitForSelector('text=Instant URL', { timeout: 10000 });
    await page.waitForTimeout(500);

    // ——— STEP 13: Documentation ———
    await page.getByRole('link', { name: /Documentation/i }).click();
    await page.waitForURL(/\/docs\/setup/, { timeout: 8000 });
    results.push({ step: '13. Documentation → /docs/setup', ok: page.url().includes('/docs/setup') });
    await page.goto(`${BASE}/c/${COMPANY_HANDLE}?session_id=cs_test_sim&demo=1`, { waitUntil: 'networkidle' });
    await page.waitForSelector('text=Instant URL', { timeout: 10000 });
    await page.waitForTimeout(500);

    // ——— STEP 14: Contact Support ———
    await page.getByRole('link', { name: /Contact Support/i }).click();
    await page.waitForURL(/\/support/, { timeout: 8000 });
    results.push({ step: '14. Contact Support → /support', ok: page.url().includes('/support') });
    await page.goto(`${BASE}/c/${COMPANY_HANDLE}?session_id=cs_test_sim&demo=1`, { waitUntil: 'networkidle' });
    await page.waitForSelector('text=Instant URL', { timeout: 10000 });
    await page.waitForTimeout(500);

    // ——— STEP 15: Footer Privacy ———
    await page.getByRole('link', { name: 'Privacy' }).first().click();
    await page.waitForURL(/\/privacy/, { timeout: 8000 });
    results.push({ step: '15. Footer Privacy → /privacy', ok: page.url().includes('/privacy') });
    await page.goto(`${BASE}/c/${COMPANY_HANDLE}?session_id=cs_test_sim&demo=1`, { waitUntil: 'networkidle' });
    await page.waitForSelector('text=Instant URL', { timeout: 10000 });
    await page.waitForTimeout(500);

    // ——— STEP 16: Footer Terms ———
    await page.getByRole('link', { name: 'Terms' }).first().click();
    await page.waitForURL(/\/terms/, { timeout: 8000 });
    results.push({ step: '16. Footer Terms → /terms', ok: page.url().includes('/terms') });
    await page.waitForTimeout(STEP_DELAY_MS);

    // ——— STEP 17: Instant URL (direct) — /solarcorp → /paid?company=solarcorp ———
    await page.goto(`${BASE}/${COMPANY_HANDLE}`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(STEP_DELAY_MS);
    const instantRedirectOk = page.url().includes('/paid') && page.url().includes('company=solarcorp');
    results.push({ step: '17. Instant URL /solarcorp → /paid?company=solarcorp', ok: instantRedirectOk, detail: page.url() });
    expect(instantRedirectOk).toBeTruthy();

    // ——— STEP 18: Embed URL ———
    await page.goto(`${BASE}/embed/${COMPANY_HANDLE}?company=${COMPANY_HANDLE}`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(STEP_DELAY_MS);
    const embedBody = await page.locator('body').textContent() ?? '';
    const embedOk = /solar|address|quote|calculator|Solar/i.test(embedBody);
    results.push({ step: '18. Embed URL loads calculator', ok: embedOk });
    expect(embedOk).toBeTruthy();

    // Log results for report
    console.log('--- COLD-EMAIL CUSTOMER JOURNEY RESULTS ---');
    results.forEach((r) => console.log(r.ok ? '✅' : '❌', r.step, r.detail ? `(${r.detail})` : ''));
    const allPass = results.every((r) => r.ok);
    expect(allPass).toBeTruthy();
  });
});
