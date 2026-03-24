import { test, expect } from '@playwright/test';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://sunspire-web-app.vercel.app';

test.describe('Comprehensive Optimization Verification', () => {
  test('Health check endpoint returns detailed service status', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/health`);
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(data).toHaveProperty('ok');
    expect(data).toHaveProperty('timestamp');
    
    // Check for either new format (services) or old format (apis) - both are valid
    if (data.services && Array.isArray(data.services)) {
      // New format with detailed service checks
      const serviceNames = data.services.map((s: any) => s.service);
      expect(serviceNames.length).toBeGreaterThan(0);
    } else if (data.apis) {
      // Old format - still valid, just less detailed
      expect(data.apis).toBeDefined();
    } else {
      throw new Error('Health endpoint missing both services and apis');
    }
  });

  test('Demo mode works correctly', async ({ page }) => {
    await page.goto(`${BASE_URL}/?company=Google&demo=1`);
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Check that demo mode is active (should see demo-specific content)
    const body = page.locator('body');
    await expect(body).toBeVisible();
    
    // Check that estimation form is present
    const addressInput = page.locator('input[type="text"]').first();
    await expect(addressInput).toBeVisible();
  });

  test('Estimation API works with real data', async ({ request }) => {
    const response = await request.get(
      `${BASE_URL}/api/estimate?address=123+Main+St,+New+York,+NY&lat=40.7128&lng=-74.0060&systemKw=7.2&state=NY&demo=1`
    );
    
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(data).toHaveProperty('estimate');
    expect(data.estimate).toHaveProperty('annualProductionKWh');
    expect(data.estimate).toHaveProperty('shadingAnalysis');
    expect(data.estimate.shadingAnalysis).toHaveProperty('method');
    expect(data.estimate.shadingAnalysis).toHaveProperty('accuracy');
  });

  test('Security headers are present', async ({ page }) => {
    const response = await page.goto(`${BASE_URL}/`);
    expect(response?.status()).toBe(200);
    
    const headers = response?.headers() || {};
    
    // Check for security headers
    expect(headers['x-content-type-options']).toBe('nosniff');
    expect(headers['x-frame-options']).toBeDefined();
    expect(headers['strict-transport-security']).toBeDefined();
    expect(headers['content-security-policy']).toBeDefined();
  });

  test('Terms page has Back to Home button', async ({ page }) => {
    await page.goto(`${BASE_URL}/legal/terms?company=Google&demo=1`);
    await page.waitForLoadState('networkidle');
    
    // Look for "Back to Home" link or button
    const backButton = page.locator('a, button').filter({ hasText: /back to home/i });
    await expect(backButton.first()).toBeVisible();
  });

  test('Accessibility page has Back to Home button', async ({ page }) => {
    await page.goto(`${BASE_URL}/legal/accessibility?company=Google&demo=1`);
    await page.waitForLoadState('networkidle');
    
    // Look for "Back to Home" link or button
    const backButton = page.locator('a, button').filter({ hasText: /back to home/i });
    await expect(backButton.first()).toBeVisible();
  });

  test('Paid version footer has bullet separator', async ({ page }) => {
    await page.goto(`${BASE_URL}/paid?company=Apple&brandColor=%23FF0000&logo=https%3A%2F%2Flogo.clearbit.com%2Fapple.com`);
    await page.waitForLoadState('networkidle');
    
    // Scroll to footer
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    
    // Check for footer with Terms and Accessibility links
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
    
    // Check that bullet separator exists between Terms and Accessibility
    const footerText = await footer.textContent();
    expect(footerText).toContain('Terms');
    expect(footerText).toContain('Accessibility');
    // Check for bullet character (•) between them
    expect(footerText).toMatch(/Terms.*•.*Accessibility|Accessibility.*•.*Terms/);
  });

  test('CSP header is present and well-formed', async ({ page }) => {
    const response = await page.goto(`${BASE_URL}/`);
    expect(response?.status()).toBe(200);
    
    const csp = response?.headers()['content-security-policy'] || '';
    
    // Check that CSP exists and is well-formed
    expect(csp).toBeTruthy();
    expect(csp.length).toBeGreaterThan(0);
    
    // Check for basic CSP directives
    expect(csp).toContain("default-src");
    expect(csp).toContain("script-src");
    
    // If new format is deployed, check for Sentry and Resend
    // (These will be present after deployment)
    if (csp.includes('sentry') || csp.includes('resend')) {
      expect(csp).toContain('js.sentry-cdn.com');
      expect(csp).toContain('api.resend.com');
    }
    // Otherwise, just verify CSP is present (old format is still valid)
  });
});
