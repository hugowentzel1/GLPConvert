/**
 * DEMO-FOCUSED END-TO-END TESTS
 * Testing ONLY what should exist in demo mode vs what shouldn't
 * Based on: https://sunspire-web-app.vercel.app/?address=1232+Virginia+Ct%2C+Atlanta%2C+GA+30306%2C+USA&lat=33.7785624&lng=-84.3445644&placeId=ChIJD4zdpqIG9YgRqe-qzW9mLQM&company=goole&demo=1
 */

const { chromium } = require('playwright');

const LIVE_URL = 'https://sunspire-web-app.vercel.app';
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

class DemoFocusedE2ETester {
  constructor() {
    this.results = {
      demoHomepageTests: {},
      demoReportTests: {},
      demoSpecificFeatures: {},
      demoRestrictions: {},
      legalTests: {}
    };
    this.testCount = 0;
    this.passedTests = 0;
    this.failedTests = 0;
  }

  async runDemoFocusedE2ETests() {
    console.log('🎯 Starting DEMO-FOCUSED End-to-End Tests...\n');
    console.log('Testing demo URL: https://sunspire-web-app.vercel.app/?address=1232+Virginia+Ct%2C+Atlanta%2C+GA+30306%2C+USA&lat=33.7785624&lng=-84.3445644&placeId=ChIJD4zdpqIG9YgRqe-qzW9mLQM&company=goole&demo=1\n');
    
    const browser = await chromium.launch();
    const page = await browser.newPage();
    
    try {
      // Test Demo Homepage
      await this.testDemoHomepage(page);
      
      // Test Demo Report Page
      await this.testDemoReportPage(page);
      
      // Test Demo-Specific Features
      await this.testDemoSpecificFeatures(page);
      
      // Test Demo Restrictions (what should NOT be there)
      await this.testDemoRestrictions(page);
      
      // Test Legal Pages (should work for both demo and paid)
      await this.testLegalPages(page);
      
      // Generate Final Report
      this.generateDemoReport();
      
    } catch (error) {
      console.error('❌ Demo-focused E2E testing failed:', error.message);
    } finally {
      await browser.close();
    }
  }

  async testDemoHomepage(page) {
    console.log('🏠 TESTING DEMO HOMEPAGE');
    console.log('========================');
    
    try {
      // Test the exact demo URL you provided
      await page.goto(`${BASE_URL}/?address=1232%20Virginia%20Ct%2C%20Atlanta%2C%20GA%2030306%2C%20USA&lat=33.7785624&lng=-84.3445644&placeId=ChIJD4zdpqIG9YgRqe-qzW9mLQM&company=goole&demo=1`);
      await page.waitForLoadState('networkidle');
      
      const homepageTests = {
        demoParameters: await this.testDemoParameters(page),
        brandTakeover: await this.testBrandTakeover(page),
        addressAutocomplete: await this.testAddressAutocomplete(page),
        demoCTA: await this.testDemoCTA(page),
        runLimits: await this.testRunLimits(page)
      };
      
      this.results.demoHomepageTests = homepageTests;
      this.logTestResults('Demo Homepage Tests', homepageTests);
      
    } catch (error) {
      console.error('❌ Demo homepage testing failed:', error.message);
      this.results.demoHomepageTests = { error: error.message };
    }
  }

  async testDemoReportPage(page) {
    console.log('\n📊 TESTING DEMO REPORT PAGE');
    console.log('============================');
    
    try {
      // Test demo report page with the exact address
      await page.goto(`${BASE_URL}/report?address=1232%20Virginia%20Ct%2C%20Atlanta%2C%20GA%2030306%2C%20USA&lat=33.7785624&lng=-84.3445644&placeId=ChIJD4zdpqIG9YgRqe-qzW9mLQM&company=goole&demo=1`);
      await page.waitForLoadState('networkidle');
      
      const reportTests = {
        solarCalculations: await this.testSolarCalculations(page),
        demoRestrictions: await this.testDemoReportRestrictions(page),
        brandCustomization: await this.testReportBrandCustomization(page),
        demoCTAs: await this.testDemoReportCTAs(page),
        headerSpacing: await this.testHeaderSpacing(page)
      };
      
      this.results.demoReportTests = reportTests;
      this.logTestResults('Demo Report Tests', reportTests);
      
    } catch (error) {
      console.error('❌ Demo report testing failed:', error.message);
      this.results.demoReportTests = { error: error.message };
    }
  }

  async testDemoSpecificFeatures(page) {
    console.log('\n🎯 TESTING DEMO-SPECIFIC FEATURES');
    console.log('==================================');
    
    try {
      const demoSpecificTests = {
        countdownTimer: await this.testCountdownTimer(page),
        runLimits: await this.testRunLimits(page),
        previewMode: await this.testPreviewMode(page),
        demoWatermark: await this.testDemoWatermark(page),
        launchCTA: await this.testLaunchCTA(page)
      };
      
      this.results.demoSpecificFeatures = demoSpecificTests;
      this.logTestResults('Demo-Specific Features', demoSpecificTests);
      
    } catch (error) {
      console.error('❌ Demo-specific features testing failed:', error.message);
      this.results.demoSpecificFeatures = { error: error.message };
    }
  }

  async testDemoRestrictions(page) {
    console.log('\n🚫 TESTING DEMO RESTRICTIONS');
    console.log('=============================');
    
    try {
      const restrictionTests = {
        noStripeIntegration: await this.testNoStripeIntegration(page),
        noFullEstimates: await this.testNoFullEstimates(page),
        noPaidFeatures: await this.testNoPaidFeatures(page),
        noAPIKeys: await this.testNoAPIKeys(page),
        noWhiteLabelSetup: await this.testNoWhiteLabelSetup(page)
      };
      
      this.results.demoRestrictions = restrictionTests;
      this.logTestResults('Demo Restrictions', restrictionTests);
      
    } catch (error) {
      console.error('❌ Demo restrictions testing failed:', error.message);
      this.results.demoRestrictions = { error: error.message };
    }
  }

  async testLegalPages(page) {
    console.log('\n📋 TESTING LEGAL PAGES');
    console.log('=======================');
    
    try {
      const legalTests = {
        privacyPolicy: await this.testPrivacyPolicy(page),
        termsOfService: await this.testTermsOfService(page),
        securityPage: await this.testSecurityPage(page),
        dpa: await this.testDPA(page)
      };
      
      this.results.legalTests = legalTests;
      this.logTestResults('Legal Pages Tests', legalTests);
      
    } catch (error) {
      console.error('❌ Legal pages testing failed:', error.message);
      this.results.legalTests = { error: error.message };
    }
  }

  // Demo Homepage Test Methods
  async testDemoParameters(page) {
    try {
      const url = page.url();
      console.log('Demo URL:', url);
      
      const hasDemo = url.includes('demo=1');
      const hasCompany = url.includes('company=goole');
      const hasAddress = url.includes('address=');
      const hasCoordinates = url.includes('lat=') && url.includes('lng=');
      const hasPlaceId = url.includes('placeId=');
      
      console.log('Demo params check:', { hasDemo, hasCompany, hasAddress, hasCoordinates, hasPlaceId });
      
      if (hasDemo && hasCompany && hasAddress && hasCoordinates && hasPlaceId) {
        return { passed: true, details: 'All demo parameters present and correct' };
      } else {
        return { passed: false, details: `Demo params: demo=${hasDemo}, company=${hasCompany}, address=${hasAddress}, coordinates=${hasCoordinates}, placeId=${hasPlaceId}` };
      }
    } catch (error) {
      return { passed: false, details: `Demo parameters test failed: ${error.message}` };
    }
  }

  async testBrandTakeover(page) {
    try {
      const brandColor = await page.evaluate(() => {
        const element = document.querySelector('[style*="--brand-primary"]');
        return element ? getComputedStyle(element).getPropertyValue('--brand-primary') : null;
      });
      
      const logoPresent = await page.locator('img[src*="logo.clearbit.com"]').count();
      const companyName = await page.locator('text=/goole/').count();
      
      console.log('Brand takeover check:', { brandColor, logoPresent, companyName });
      
      if (brandColor && logoPresent > 0 && companyName > 0) {
        return { passed: true, details: 'Brand takeover working perfectly for demo' };
      } else {
        return { passed: false, details: `Brand takeover: color=${!!brandColor}, logo=${logoPresent}, company=${companyName}` };
      }
    } catch (error) {
      return { passed: false, details: `Brand takeover test failed: ${error.message}` };
    }
  }

  async testAddressAutocomplete(page) {
    try {
      // Look for address input
      const addressInput = await page.locator('input[placeholder*="address"], input[placeholder*="Address"]').count();
      const addressValue = await page.evaluate(() => {
        const input = document.querySelector('input[placeholder*="address"], input[placeholder*="Address"]');
        return input ? input.value : '';
      });
      
      console.log('Address autocomplete check:', { addressInput, addressValue: addressValue.substring(0, 50) + '...' });
      
      if (addressInput > 0) {
        return { passed: true, details: 'Address autocomplete input present' };
      } else {
        return { passed: false, details: `Address input: ${addressInput}` };
      }
    } catch (error) {
      return { passed: false, details: `Address autocomplete test failed: ${error.message}` };
    }
  }

  async testDemoCTA(page) {
    try {
      const demoCTA = await page.locator('text=/Demo for/').count();
      const launchCTA = await page.locator('text=/Launch Your Branded Version/').count();
      
      console.log('Demo CTA check:', { demoCTA, launchCTA });
      
      if (demoCTA > 0 && launchCTA > 0) {
        return { passed: true, details: 'Demo CTAs working correctly' };
      } else {
        return { passed: false, details: `Demo CTAs: demo=${demoCTA}, launch=${launchCTA}` };
      }
    } catch (error) {
      return { passed: false, details: `Demo CTA test failed: ${error.message}` };
    }
  }

  async testRunLimits(page) {
    try {
      const runsLeft = await page.locator('text=/runs left/').count();
      const previewText = await page.locator('text=/Preview:/').count();
      
      console.log('Run limits check:', { runsLeft, previewText });
      
      if (runsLeft > 0 && previewText > 0) {
        return { passed: true, details: 'Run limits and preview text working correctly' };
      } else {
        return { passed: false, details: `Run limits: runsLeft=${runsLeft}, preview=${previewText}` };
      }
    } catch (error) {
      return { passed: false, details: `Run limits test failed: ${error.message}` };
    }
  }

  // Demo Report Test Methods
  async testSolarCalculations(page) {
    try {
      const systemSize = await page.locator('[data-testid="tile-systemSize"]').count();
      const annualProduction = await page.locator('[data-testid="tile-annualProduction"]').count();
      const paybackPeriod = await page.locator('[data-testid="tile-paybackPeriod"]').count();
      const costSavings = await page.locator('[data-testid="tile-costSavings"]').count();
      
      console.log('Solar calculations check:', { systemSize, annualProduction, paybackPeriod, costSavings });
      
      if (systemSize > 0 && annualProduction > 0) {
        return { passed: true, details: 'Solar calculations displaying correctly in demo' };
      } else {
        return { passed: false, details: `Solar calculations: systemSize=${systemSize}, annualProduction=${annualProduction}, payback=${paybackPeriod}, costSavings=${costSavings}` };
      }
    } catch (error) {
      return { passed: false, details: `Solar calculations test failed: ${error.message}` };
    }
  }

  async testDemoReportRestrictions(page) {
    try {
      // In demo mode, some tiles should be blurred/locked
      const blurredTiles = await page.locator('.blur-sm, .opacity-50').count();
      const lockedTiles = await page.locator('text=/locked/').count();
      
      console.log('Demo report restrictions check:', { blurredTiles, lockedTiles });
      
      // Demo should have some restrictions (blurred tiles or locked content)
      if (blurredTiles > 0 || lockedTiles > 0) {
        return { passed: true, details: 'Demo restrictions properly applied' };
      } else {
        return { passed: false, details: `Demo restrictions: blurred=${blurredTiles}, locked=${lockedTiles}` };
      }
    } catch (error) {
      return { passed: false, details: `Demo report restrictions test failed: ${error.message}` };
    }
  }

  async testReportBrandCustomization(page) {
    try {
      const brandColor = await page.evaluate(() => {
        const element = document.querySelector('[style*="--brand-primary"]');
        return element ? getComputedStyle(element).getPropertyValue('--brand-primary') : null;
      });
      
      const logoPresent = await page.locator('img[src*="logo.clearbit.com"]').count();
      const companyName = await page.locator('text=/goole/').count();
      
      console.log('Report brand customization check:', { brandColor, logoPresent, companyName });
      
      if (brandColor && logoPresent > 0 && companyName > 0) {
        return { passed: true, details: 'Report brand customization working perfectly' };
      } else {
        return { passed: false, details: `Report brand: color=${!!brandColor}, logo=${logoPresent}, company=${companyName}` };
      }
    } catch (error) {
      return { passed: false, details: `Report brand customization test failed: ${error.message}` };
    }
  }

  async testDemoReportCTAs(page) {
    try {
      const bookButton = await page.locator('text=/Book a Consultation/').count();
      const talkButton = await page.locator('text=/Talk to a Specialist/').count();
      const downloadButton = await page.locator('text=/Download PDF/').count();
      const copyButton = await page.locator('text=/Copy Share Link/').count();
      
      console.log('Demo report CTAs check:', { bookButton, talkButton, downloadButton, copyButton });
      
      if (bookButton > 0 && talkButton > 0 && downloadButton > 0 && copyButton > 0) {
        return { passed: true, details: 'Demo report CTAs working correctly' };
      } else {
        return { passed: false, details: `Demo report CTAs: book=${bookButton}, talk=${talkButton}, download=${downloadButton}, copy=${copyButton}` };
      }
    } catch (error) {
      return { passed: false, details: `Demo report CTAs test failed: ${error.message}` };
    }
  }

  async testHeaderSpacing(page) {
    try {
      // Test our optimized header spacing
      const spacingMeasurements = await page.evaluate(() => {
        const measurements = {};
        
        // H1 → Logo spacing (should be 24px)
        const h1 = document.querySelector('[data-testid="hdr-h1"]');
        const logo = document.querySelector('[data-testid="hdr-logo"]');
        if (h1 && logo) {
          const h1Rect = h1.getBoundingClientRect();
          const logoRect = logo.getBoundingClientRect();
          measurements.h1ToLogo = Math.round(logoRect.top - (h1Rect.bottom));
        }
        
        // Logo → Subheadline spacing (should be 16px)
        const sub = document.querySelector('[data-testid="hdr-sub"]');
        if (logo && sub) {
          const logoRect = logo.getBoundingClientRect();
          const subRect = sub.getBoundingClientRect();
          measurements.logoToSub = Math.round(subRect.top - (logoRect.bottom));
        }
        
        // Subheadline → Address spacing (should be 8px)
        const address = document.querySelector('[data-testid="hdr-address"]');
        if (sub && address) {
          const subRect = sub.getBoundingClientRect();
          const addrRect = address.getBoundingClientRect();
          measurements.subToAddress = Math.round(addrRect.top - (subRect.bottom));
        }
        
        // Address → Meta spacing (should be 16px)
        const meta = document.querySelector('[data-testid="hdr-meta"]');
        if (address && meta) {
          const addrRect = address.getBoundingClientRect();
          const metaRect = meta.getBoundingClientRect();
          measurements.addressToMeta = Math.round(metaRect.top - (addrRect.bottom));
        }
        
        // Meta → Cards spacing (should be 32px)
        const cards = document.querySelector('[data-testid="tile-systemSize"]');
        if (meta && cards) {
          const metaRect = meta.getBoundingClientRect();
          const cardsRect = cards.getBoundingClientRect();
          measurements.metaToCards = Math.round(cardsRect.top - (metaRect.bottom));
        }
        
        return measurements;
      });
      
      console.log('Header spacing check:', spacingMeasurements);
      
      // Check if spacing matches our optimized values (24/16/8/16/32)
      const spacingCorrect = (
        spacingMeasurements.h1ToLogo >= 22 && spacingMeasurements.h1ToLogo <= 26 &&
        spacingMeasurements.logoToSub >= 14 && spacingMeasurements.logoToSub <= 18 &&
        spacingMeasurements.subToAddress >= 6 && spacingMeasurements.subToAddress <= 10 &&
        spacingMeasurements.addressToMeta >= 14 && spacingMeasurements.addressToMeta <= 18 &&
        spacingMeasurements.metaToCards >= 30 && spacingMeasurements.metaToCards <= 34
      );
      
      if (spacingCorrect) {
        return { passed: true, details: `Header spacing optimized correctly (24/16/8/16/32px)` };
      } else {
        return { passed: false, details: `Header spacing: H1→Logo=${spacingMeasurements.h1ToLogo}px, Logo→Sub=${spacingMeasurements.logoToSub}px, Sub→Address=${spacingMeasurements.subToAddress}px, Address→Meta=${spacingMeasurements.addressToMeta}px, Meta→Cards=${spacingMeasurements.metaToCards}px` };
      }
    } catch (error) {
      return { passed: false, details: `Header spacing test failed: ${error.message}` };
    }
  }

  // Demo-Specific Feature Test Methods
  async testCountdownTimer(page) {
    try {
      const countdownElements = await page.locator('text=/Expires in/').count();
      const timeElements = await page.locator('text=/d \\d+h \\d+m \\d+s/').count();
      
      console.log('Countdown timer check:', { countdownElements, timeElements });
      
      if (countdownElements > 0 && timeElements > 0) {
        return { passed: true, details: 'Countdown timer working correctly in demo' };
      } else {
        return { passed: false, details: `Countdown timer: expires=${countdownElements}, time=${timeElements}` };
      }
    } catch (error) {
      return { passed: false, details: `Countdown timer test failed: ${error.message}` };
    }
  }

  async testPreviewMode(page) {
    try {
      const previewText = await page.locator('text=/Preview:/').count();
      const livePreviewText = await page.locator('text=/Live Preview/').count();
      
      console.log('Preview mode check:', { previewText, livePreviewText });
      
      if (previewText > 0 || livePreviewText > 0) {
        return { passed: true, details: 'Preview mode indicators working correctly' };
      } else {
        return { passed: false, details: `Preview mode: preview=${previewText}, livePreview=${livePreviewText}` };
      }
    } catch (error) {
      return { passed: false, details: `Preview mode test failed: ${error.message}` };
    }
  }

  async testDemoWatermark(page) {
    try {
      const poweredBy = await page.locator('text=/Powered by/').count();
      const sunspireBranding = await page.locator('text=/Sunspire/').count();
      
      console.log('Demo watermark check:', { poweredBy, sunspireBranding });
      
      if (poweredBy > 0 || sunspireBranding > 0) {
        return { passed: true, details: 'Demo watermark/branding present' };
      } else {
        return { passed: false, details: `Demo watermark: poweredBy=${poweredBy}, sunspireBranding=${sunspireBranding}` };
      }
    } catch (error) {
      return { passed: false, details: `Demo watermark test failed: ${error.message}` };
    }
  }

  async testLaunchCTA(page) {
    try {
      const launchCTA = await page.locator('text=/Launch Your Branded Version/').count();
      const upgradeCTA = await page.locator('text=/upgrade/').count();
      
      console.log('Launch CTA check:', { launchCTA, upgradeCTA });
      
      if (launchCTA > 0 || upgradeCTA > 0) {
        return { passed: true, details: 'Launch/upgrade CTA present in demo' };
      } else {
        return { passed: false, details: `Launch CTA: launch=${launchCTA}, upgrade=${upgradeCTA}` };
      }
    } catch (error) {
      return { passed: false, details: `Launch CTA test failed: ${error.message}` };
    }
  }

  // Demo Restriction Test Methods (what should NOT be there)
  async testNoStripeIntegration(page) {
    try {
      // In demo mode, there should be NO Stripe integration
      const stripeElements = await page.locator('text=/stripe/').count();
      const checkoutElements = await page.locator('text=/checkout/').count();
      
      console.log('No Stripe integration check:', { stripeElements, checkoutElements });
      
      // These should be 0 in demo mode
      if (stripeElements === 0 && checkoutElements === 0) {
        return { passed: true, details: 'No Stripe integration in demo (correct)' };
      } else {
        return { passed: false, details: `Stripe elements found: stripe=${stripeElements}, checkout=${checkoutElements}` };
      }
    } catch (error) {
      return { passed: false, details: `No Stripe integration test failed: ${error.message}` };
    }
  }

  async testNoFullEstimates(page) {
    try {
      // In demo mode, some estimates should be limited
      const fullEstimates = await page.locator('[data-testid="tile-paybackPeriod"]').count();
      const fullCostSavings = await page.locator('[data-testid="tile-costSavings"]').count();
      
      console.log('No full estimates check:', { fullEstimates, fullCostSavings });
      
      // In demo, these might be limited or blurred
      if (fullEstimates === 0 || fullCostSavings === 0) {
        return { passed: true, details: 'Full estimates limited in demo (correct)' };
      } else {
        return { passed: false, details: `Full estimates found: payback=${fullEstimates}, costSavings=${fullCostSavings}` };
      }
    } catch (error) {
      return { passed: false, details: `No full estimates test failed: ${error.message}` };
    }
  }

  async testNoPaidFeatures(page) {
    try {
      // In demo mode, there should be NO paid features
      const apiKeys = await page.locator('text=/API Key/').count();
      const whiteLabelSetup = await page.locator('text=/white.label/').count();
      
      console.log('No paid features check:', { apiKeys, whiteLabelSetup });
      
      // These should be 0 in demo mode
      if (apiKeys === 0 && whiteLabelSetup === 0) {
        return { passed: true, details: 'No paid features in demo (correct)' };
      } else {
        return { passed: false, details: `Paid features found: apiKeys=${apiKeys}, whiteLabelSetup=${whiteLabelSetup}` };
      }
    } catch (error) {
      return { passed: false, details: `No paid features test failed: ${error.message}` };
    }
  }

  async testNoAPIKeys(page) {
    try {
      // In demo mode, there should be NO API key documentation
      const apiKeyDocs = await page.locator('text=/API Key/').count();
      const integrationDocs = await page.locator('text=/Integration/').count();
      
      console.log('No API keys check:', { apiKeyDocs, integrationDocs });
      
      // These should be 0 in demo mode
      if (apiKeyDocs === 0 && integrationDocs === 0) {
        return { passed: true, details: 'No API key documentation in demo (correct)' };
      } else {
        return { passed: false, details: `API key docs found: apiKeyDocs=${apiKeyDocs}, integrationDocs=${integrationDocs}` };
      }
    } catch (error) {
      return { passed: false, details: `No API keys test failed: ${error.message}` };
    }
  }

  async testNoWhiteLabelSetup(page) {
    try {
      // In demo mode, there should be NO white-label setup
      const whiteLabelSetup = await page.locator('text=/Setup Guide/').count();
      const whiteLabelDocs = await page.locator('text=/White-Label/').count();
      
      console.log('No white-label setup check:', { whiteLabelSetup, whiteLabelDocs });
      
      // These should be 0 in demo mode
      if (whiteLabelSetup === 0 && whiteLabelDocs === 0) {
        return { passed: true, details: 'No white-label setup in demo (correct)' };
      } else {
        return { passed: false, details: `White-label setup found: setup=${whiteLabelSetup}, docs=${whiteLabelDocs}` };
      }
    } catch (error) {
      return { passed: false, details: `No white-label setup test failed: ${error.message}` };
    }
  }

  // Legal Page Test Methods
  async testPrivacyPolicy(page) {
    try {
      await page.goto(`${BASE_URL}/privacy`);
      await page.waitForLoadState('networkidle');
      
      const privacyTitle = await page.locator('text=/Privacy Policy/').count();
      const privacyContent = await page.locator('text=/Information We Collect/').count();
      
      console.log('Privacy Policy check:', { privacyTitle, privacyContent });
      
      if (privacyTitle > 0 && privacyContent > 0) {
        return { passed: true, details: 'Privacy Policy documentation available' };
      } else {
        return { passed: false, details: `Privacy Policy: title=${privacyTitle}, content=${privacyContent}` };
      }
    } catch (error) {
      return { passed: false, details: `Privacy Policy test failed: ${error.message}` };
    }
  }

  async testTermsOfService(page) {
    try {
      await page.goto(`${BASE_URL}/terms`);
      await page.waitForLoadState('networkidle');
      
      const termsTitle = await page.locator('text=/Terms of Service/').count();
      const termsContent = await page.locator('text=/Acceptance of Terms/').count();
      
      console.log('Terms of Service check:', { termsTitle, termsContent });
      
      if (termsTitle > 0 && termsContent > 0) {
        return { passed: true, details: 'Terms of Service documentation available' };
      } else {
        return { passed: false, details: `Terms of Service: title=${termsTitle}, content=${termsContent}` };
      }
    } catch (error) {
      return { passed: false, details: `Terms of Service test failed: ${error.message}` };
    }
  }

  async testSecurityPage(page) {
    try {
      await page.goto(`${BASE_URL}/security`);
      await page.waitForLoadState('networkidle');
      
      const securityTitle = await page.locator('text=/Security/').count();
      const securityContent = await page.locator('text=/encryption/').count();
      
      console.log('Security page check:', { securityTitle, securityContent });
      
      if (securityTitle > 0 && securityContent > 0) {
        return { passed: true, details: 'Security page documentation available' };
      } else {
        return { passed: false, details: `Security: title=${securityTitle}, content=${securityContent}` };
      }
    } catch (error) {
      return { passed: false, details: `Security page test failed: ${error.message}` };
    }
  }

  async testDPA(page) {
    try {
      await page.goto(`${BASE_URL}/dpa`);
      await page.waitForLoadState('networkidle');
      
      const dpaTitle = await page.locator('text=/Data Processing Addendum/').count();
      const dpaContent = await page.locator('text=/Personal Data/').count();
      
      console.log('DPA check:', { dpaTitle, dpaContent });
      
      if (dpaTitle > 0 && dpaContent > 0) {
        return { passed: true, details: 'Data Processing Addendum documentation available' };
      } else {
        return { passed: false, details: `DPA: title=${dpaTitle}, content=${dpaContent}` };
      }
    } catch (error) {
      return { passed: false, details: `DPA test failed: ${error.message}` };
    }
  }

  // Helper Methods
  logTestResults(category, tests) {
    console.log(`\n📊 ${category} Results:`);
    Object.entries(tests).forEach(([testName, result]) => {
      if (result.passed) {
        console.log(`✅ ${testName}: ${result.details}`);
        this.passedTests++;
      } else {
        console.log(`❌ ${testName}: ${result.details}`);
        this.failedTests++;
      }
      this.testCount++;
    });
  }

  generateDemoReport() {
    console.log('\n📋 DEMO-FOCUSED END-TO-END TEST REPORT');
    console.log('======================================');
    
    const totalTests = this.testCount;
    const passedTests = this.passedTests;
    const failedTests = this.failedTests;
    const successRate = totalTests > 0 ? ((passedTests / totalTests) * 100).toFixed(1) : 0;

    console.log(`\n🎯 OVERALL DEMO TEST RESULTS:`);
    console.log(`• Total Tests: ${totalTests}`);
    console.log(`• Passed: ${passedTests}`);
    console.log(`• Failed: ${failedTests}`);
    console.log(`• Success Rate: ${successRate}%`);

    if (successRate >= 90) {
      console.log('🏆 EXCELLENT - Demo mode is ready for user acquisition');
    } else if (successRate >= 80) {
      console.log('✅ GOOD - Demo mode is mostly ready with minor issues');
    } else if (successRate >= 70) {
      console.log('⚠️ FAIR - Demo mode needs improvements before launch');
    } else {
      console.log('❌ POOR - Demo mode requires significant improvements');
    }

    console.log('\n📊 DETAILED RESULTS:');
    
    // Demo Homepage Tests Summary
    const homepagePassed = Object.values(this.results.demoHomepageTests).filter(r => r.passed).length;
    const homepageTotal = Object.keys(this.results.demoHomepageTests).length;
    console.log(`• Demo Homepage Tests: ${homepagePassed}/${homepageTotal} passed`);

    // Demo Report Tests Summary
    const reportPassed = Object.values(this.results.demoReportTests).filter(r => r.passed).length;
    const reportTotal = Object.keys(this.results.demoReportTests).length;
    console.log(`• Demo Report Tests: ${reportPassed}/${reportTotal} passed`);

    // Demo-Specific Features Summary
    const featuresPassed = Object.values(this.results.demoSpecificFeatures).filter(r => r.passed).length;
    const featuresTotal = Object.keys(this.results.demoSpecificFeatures).length;
    console.log(`• Demo-Specific Features: ${featuresPassed}/${featuresTotal} passed`);

    // Demo Restrictions Summary
    const restrictionsPassed = Object.values(this.results.demoRestrictions).filter(r => r.passed).length;
    const restrictionsTotal = Object.keys(this.results.demoRestrictions).length;
    console.log(`• Demo Restrictions: ${restrictionsPassed}/${restrictionsTotal} passed`);

    // Legal Tests Summary
    const legalPassed = Object.values(this.results.legalTests).filter(r => r.passed).length;
    const legalTotal = Object.keys(this.results.legalTests).length;
    console.log(`• Legal Pages Tests: ${legalPassed}/${legalTotal} passed`);

    console.log('\n🚀 RECOMMENDATIONS:');
    
    if (successRate >= 90) {
      console.log('• Demo mode is ready for user acquisition');
      console.log('• Start marketing and lead generation');
      console.log('• Monitor demo conversion metrics');
    } else if (successRate >= 80) {
      console.log('• Address failed demo tests before launch');
      console.log('• Focus on critical demo functionality');
      console.log('• Test demo-to-paid conversion flow');
    } else {
      console.log('• Fix critical demo failures');
      console.log('• Ensure demo restrictions are working');
      console.log('• Test brand takeover functionality');
    }

    console.log('\n📈 NEXT STEPS:');
    console.log('1. Review failed demo tests and fix issues');
    console.log('2. Ensure demo restrictions are properly applied');
    console.log('3. Test demo-to-paid conversion flow');
    console.log('4. Launch demo for user acquisition');
    console.log('5. Monitor demo performance metrics');

    return {
      totalTests,
      passedTests,
      failedTests,
      successRate: parseFloat(successRate),
      results: this.results,
      recommendation: successRate >= 80 ? 'DEMO_READY' : 'NEEDS_IMPROVEMENT'
    };
  }
}

// Run the demo-focused E2E tests
async function runDemoFocusedE2ETests() {
  const tester = new DemoFocusedE2ETester();
  const results = await tester.runDemoFocusedE2ETests();
  return results;
}

module.exports = { DemoFocusedE2ETester, runDemoFocusedE2ETests };

// Run if called directly
if (require.main === module) {
  runDemoFocusedE2ETests().then(results => {
    console.log('\n🎉 Demo-Focused E2E Testing Complete!');
    process.exit(results.successRate >= 80 ? 0 : 1);
  }).catch(error => {
    console.error('❌ Demo-focused E2E testing failed:', error);
    process.exit(1);
  });
}
