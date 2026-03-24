/**
 * Final Optimization Test Suite
 * Tests all newly implemented features
 */

import { test, expect } from '@playwright/test';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://sunspire-web-app.vercel.app';

test.describe('Final Optimization Features', () => {
  test('Health check endpoint returns correlation ID', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/health`);
    expect(response.ok()).toBeTruthy();
    
    const headers = response.headers();
    expect(headers['x-correlation-id']).toBeTruthy();
    expect(headers['x-request-id']).toBeTruthy();
    
    const data = await response.json();
    expect(data.status).toBe('ok');
  });

  test('GDPR export endpoint requires admin token', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/api/gdpr/export`, {
      data: { email: 'test@example.com' },
    });
    
    expect(response.status()).toBe(401);
    const data = await response.json();
    expect(data.error).toContain('Unauthorized');
  });

  test('GDPR delete endpoint requires admin token', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/api/gdpr/delete`, {
      data: { email: 'test@example.com', confirm: 'DELETE' },
    });
    
    expect(response.status()).toBe(401);
    const data = await response.json();
    expect(data.error).toContain('Unauthorized');
  });

  test('Resend webhook endpoint exists', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/api/webhooks/resend`, {
      data: { type: 'email.bounced', data: { email: 'test@example.com' } },
    });
    
    // Should not return 404
    expect(response.status()).not.toBe(404);
  });

  test('All responses include correlation ID headers', async ({ request }) => {
    const endpoints = [
      '/api/health',
      '/api/estimate?lat=40.7128&lng=-74.0060&address=New%20York',
    ];

    for (const endpoint of endpoints) {
      const response = await request.get(`${BASE_URL}${endpoint}`);
      const headers = response.headers();
      
      // Correlation ID should be present
      expect(headers['x-correlation-id'] || headers['x-request-id']).toBeTruthy();
    }
  });

  test('Security headers are present', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/`);
    const headers = response.headers();
    
    expect(headers['x-content-type-options']).toBe('nosniff');
    expect(headers['x-frame-options']).toBeTruthy();
    expect(headers['referrer-policy']).toBeTruthy();
    expect(headers['content-security-policy']).toBeTruthy();
  });

  test('CSP includes required domains', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/`);
    const csp = response.headers()['content-security-policy'] || '';
    
    expect(csp).toContain('sentry.io');
    expect(csp).toContain('api.resend.com');
  });
});
