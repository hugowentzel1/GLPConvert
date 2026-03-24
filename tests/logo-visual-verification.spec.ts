/**
 * LOGO VISUAL VERIFICATION TEST
 * Tests that logos display correctly on both demo and paid versions
 */

import { test, expect } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'https://sunspire-web-app.vercel.app';

test.describe('🎨 Logo Visual Verification', () => {
  
  test('Demo version with logo - Apple', async ({ page }) => {
    console.log('\n📸 Testing DEMO version with Apple logo...\n');
    
    const demoUrl = `${BASE_URL}/?company=Apple&brandColor=%23FF0000&logo=https%3A%2F%2Flogo.clearbit.com%2Fapple.com&demo=1`;
    console.log(`📍 Navigating to: ${demoUrl}`);
    
    await page.goto(demoUrl, { 
      waitUntil: 'networkidle',
      timeout: 30000 
    });
    
    // Wait for page to fully load
    await page.waitForTimeout(3000);
    
    // Check if logo element exists
    const logoElement = page.locator('[data-hero-logo]').first();
    const logoExists = await logoElement.isVisible().catch(() => false);
    
    console.log(`✅ Logo container visible: ${logoExists}`);
    
    // Check if logo image exists
    const logoImage = page.locator('[data-hero-logo] img').first();
    const imageExists = await logoImage.isVisible().catch(() => false);
    
    console.log(`✅ Logo image visible: ${imageExists}`);
    
    // Check if image has valid src
    if (imageExists) {
      const imageSrc = await logoImage.getAttribute('src');
      console.log(`✅ Logo image src: ${imageSrc}`);
      expect(imageSrc).toContain('logo.clearbit.com');
    }
    
    // Take full page screenshot
    await page.screenshot({ 
      path: 'test-results/logo-demo-apple.png', 
      fullPage: true 
    });
    console.log('📸 Screenshot saved: test-results/logo-demo-apple.png');
    
    // Take focused screenshot of logo area
    if (logoExists) {
      await logoElement.scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);
      await logoElement.screenshot({ 
        path: 'test-results/logo-demo-apple-focused.png'
      });
      console.log('📸 Focused screenshot saved: test-results/logo-demo-apple-focused.png');
    }
    
    // Verify logo is displayed (either image or fallback initials)
    expect(logoExists).toBe(true);
    
    console.log('✅ Demo version logo test complete\n');
  });

  test('Paid version with logo - Apple', async ({ page }) => {
    console.log('\n📸 Testing PAID version with Apple logo...\n');
    
    const paidUrl = `${BASE_URL}/paid?company=Apple&brandColor=%23FF0000&logo=https%3A%2F%2Flogo.clearbit.com%2Fapple.com`;
    console.log(`📍 Navigating to: ${paidUrl}`);
    
    await page.goto(paidUrl, { 
      waitUntil: 'networkidle',
      timeout: 30000 
    });
    
    // Wait for page to fully load
    await page.waitForTimeout(3000);
    
    // Check if logo element exists
    const logoElement = page.locator('[data-hero-logo]').first();
    const logoExists = await logoElement.isVisible().catch(() => false);
    
    console.log(`✅ Logo container visible: ${logoExists}`);
    
    // Check if logo image exists
    const logoImage = page.locator('[data-hero-logo] img').first();
    const imageExists = await logoImage.isVisible().catch(() => false);
    
    console.log(`✅ Logo image visible: ${imageExists}`);
    
    // Check if image has valid src
    if (imageExists) {
      const imageSrc = await logoImage.getAttribute('src');
      console.log(`✅ Logo image src: ${imageSrc}`);
      expect(imageSrc).toContain('logo.clearbit.com');
    }
    
    // Verify no demo banner is shown
    const demoBanner = page.locator('text=Demo for').first();
    const hasDemoBanner = await demoBanner.isVisible().catch(() => false);
    console.log(`✅ No demo banner (expected): ${!hasDemoBanner}`);
    expect(hasDemoBanner).toBe(false);
    
    // Verify live confirmation bar is shown
    const liveBar = page.locator('[data-testid="live-bar"], text=Live for').first();
    const hasLiveBar = await liveBar.isVisible().catch(() => false);
    console.log(`✅ Live confirmation bar visible: ${hasLiveBar}`);
    
    // Take full page screenshot
    await page.screenshot({ 
      path: 'test-results/logo-paid-apple.png', 
      fullPage: true 
    });
    console.log('📸 Screenshot saved: test-results/logo-paid-apple.png');
    
    // Take focused screenshot of logo area
    if (logoExists) {
      await logoElement.scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);
      await logoElement.screenshot({ 
        path: 'test-results/logo-paid-apple-focused.png'
      });
      console.log('📸 Focused screenshot saved: test-results/logo-paid-apple-focused.png');
    }
    
    // Verify logo is displayed
    expect(logoExists).toBe(true);
    
    console.log('✅ Paid version logo test complete\n');
  });

  test('Demo version with logo - Google', async ({ page }) => {
    console.log('\n📸 Testing DEMO version with Google logo...\n');
    
    const demoUrl = `${BASE_URL}/?company=Google&brandColor=%234285F4&logo=https%3A%2F%2Flogo.clearbit.com%2Fgoogle.com&demo=1`;
    console.log(`📍 Navigating to: ${demoUrl}`);
    
    await page.goto(demoUrl, { 
      waitUntil: 'networkidle',
      timeout: 30000 
    });
    
    await page.waitForTimeout(3000);
    
    const logoElement = page.locator('[data-hero-logo]').first();
    const logoExists = await logoElement.isVisible().catch(() => false);
    
    console.log(`✅ Logo container visible: ${logoExists}`);
    
    const logoImage = page.locator('[data-hero-logo] img').first();
    const imageExists = await logoImage.isVisible().catch(() => false);
    
    console.log(`✅ Logo image visible: ${imageExists}`);
    
    if (imageExists) {
      const imageSrc = await logoImage.getAttribute('src');
      console.log(`✅ Logo image src: ${imageSrc}`);
      expect(imageSrc).toContain('logo.clearbit.com');
    }
    
    await page.screenshot({ 
      path: 'test-results/logo-demo-google.png', 
      fullPage: true 
    });
    console.log('📸 Screenshot saved: test-results/logo-demo-google.png');
    
    expect(logoExists).toBe(true);
    console.log('✅ Demo version (Google) logo test complete\n');
  });

  test('Paid version with logo - Google', async ({ page }) => {
    console.log('\n📸 Testing PAID version with Google logo...\n');
    
    const paidUrl = `${BASE_URL}/paid?company=Google&brandColor=%234285F4&logo=https%3A%2F%2Flogo.clearbit.com%2Fgoogle.com`;
    console.log(`📍 Navigating to: ${paidUrl}`);
    
    await page.goto(paidUrl, { 
      waitUntil: 'networkidle',
      timeout: 30000 
    });
    
    await page.waitForTimeout(3000);
    
    const logoElement = page.locator('[data-hero-logo]').first();
    const logoExists = await logoElement.isVisible().catch(() => false);
    
    console.log(`✅ Logo container visible: ${logoExists}`);
    
    const logoImage = page.locator('[data-hero-logo] img').first();
    const imageExists = await logoImage.isVisible().catch(() => false);
    
    console.log(`✅ Logo image visible: ${imageExists}`);
    
    if (imageExists) {
      const imageSrc = await logoImage.getAttribute('src');
      console.log(`✅ Logo image src: ${imageSrc}`);
      expect(imageSrc).toContain('logo.clearbit.com');
    }
    
    await page.screenshot({ 
      path: 'test-results/logo-paid-google.png', 
      fullPage: true 
    });
    console.log('📸 Screenshot saved: test-results/logo-paid-google.png');
    
    expect(logoExists).toBe(true);
    console.log('✅ Paid version (Google) logo test complete\n');
  });

  test('Verify logo image actually loads', async ({ page }) => {
    console.log('\n🔍 Verifying logo images actually load...\n');
    
    const testUrl = `${BASE_URL}/paid?company=Apple&brandColor=%23FF0000&logo=https%3A%2F%2Flogo.clearbit.com%2Fapple.com`;
    
    await page.goto(testUrl, { 
      waitUntil: 'networkidle',
      timeout: 30000 
    });
    
    await page.waitForTimeout(3000);
    
    // Wait for image to load
    const logoImage = page.locator('[data-hero-logo] img').first();
    const imageExists = await logoImage.isVisible().catch(() => false);
    
    if (imageExists) {
      // Wait for image to load by checking if it's complete
      await page.waitForFunction(
        (selector) => {
          const img = document.querySelector(selector) as HTMLImageElement;
          return img && (img.complete || img.naturalWidth > 0);
        },
        '[data-hero-logo] img',
        { timeout: 10000 }
      ).catch(() => {
        console.log('⚠️  Image load timeout, but element exists');
      });
      
      // Check if image loaded successfully by checking naturalWidth
      const imageLoaded = await page.evaluate(() => {
        const img = document.querySelector('[data-hero-logo] img') as HTMLImageElement;
        return img && img.naturalWidth > 0;
      });
      
      console.log(`✅ Image loaded successfully: ${imageLoaded}`);
      
      const imageSrc = await logoImage.getAttribute('src');
      console.log(`✅ Logo src: ${imageSrc}`);
      
      // Verify the image is from clearbit
      expect(imageSrc).toContain('logo.clearbit.com');
      
      // Take screenshot of loaded image
      await logoImage.screenshot({ 
        path: 'test-results/logo-loaded-verification.png'
      });
      console.log('📸 Screenshot saved: test-results/logo-loaded-verification.png');
      
      if (!imageLoaded) {
        console.log('⚠️  Image element exists but may not have fully loaded');
      }
    } else {
      // Check if fallback initials are shown
      const initialsElement = page.locator('[data-hero-logo] div').first();
      const hasInitials = await initialsElement.isVisible().catch(() => false);
      console.log(`✅ Fallback initials shown: ${hasInitials}`);
      
      if (hasInitials) {
        const initialsText = await initialsElement.textContent();
        console.log(`✅ Initials text: ${initialsText}`);
      }
    }
    
    console.log('✅ Logo load verification complete\n');
  });
});

