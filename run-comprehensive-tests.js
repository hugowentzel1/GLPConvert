#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting Comprehensive Sunspire E2E Test Suite');
console.log('================================================');

// Test configuration
const testSuites = [
  {
    name: 'Header & Theming Tests',
    files: ['tests/header-theming.spec.ts'],
    description: 'Tests header spacing, brand theming, and visual hierarchy for both demo and paid versions'
  },
  {
    name: 'Demo Gating Tests', 
    files: ['tests/demo-gating.spec.ts'],
    description: 'Tests demo-specific features like run limits, blur effects, and unlock CTAs'
  },
  {
    name: 'Paid Visibility Tests',
    files: ['tests/paid-visibility-cta.spec.ts'],
    description: 'Tests paid version features, CTA panels, and brand theming'
  },
  {
    name: 'Address Flow Tests',
    files: ['tests/address-flow-model.spec.ts'],
    description: 'Tests Google Places autocomplete, address formatting, and model calculations'
  },
  {
    name: 'Stripe Integration Tests',
    files: ['tests/stripe-checkout.spec.ts'],
    description: 'Tests Stripe checkout flow, payment validation, and address context preservation'
  },
  {
    name: 'PDF & Share Tests',
    files: ['tests/pdf-share.spec.ts'],
    description: 'Tests PDF generation, share links, and brand theming preservation'
  },
  {
    name: 'Legal Pages Tests',
    files: ['tests/legal-pages.spec.ts'],
    description: 'Tests all legal pages load correctly with proper content and navigation'
  },
  {
    name: 'Accessibility Tests',
    files: ['tests/accessibility-responsive.spec.ts'],
    description: 'Tests accessibility compliance, responsive design, and keyboard navigation'
  },
  {
    name: 'Security Tests',
    files: ['tests/security-headers.spec.ts'],
    description: 'Tests security headers, XSS protection, CSRF protection, and secure cookies'
  }
];

// Results tracking
const results = {
  total: 0,
  passed: 0,
  failed: 0,
  suites: []
};

async function runTestSuite(suite) {
  console.log(`\n📋 Running ${suite.name}...`);
  console.log(`   ${suite.description}`);
  console.log('   ' + '='.repeat(50));
  
  try {
    const startTime = Date.now();
    
    // Run the test suite
    const command = `npx playwright test ${suite.files.join(' ')} --reporter=line`;
    console.log(`   Command: ${command}`);
    
    const output = execSync(command, { 
      encoding: 'utf8',
      stdio: 'pipe',
      timeout: 120000 // 2 minutes timeout per suite
    });
    
    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(1);
    
    // Parse results
    const lines = output.split('\n');
    let passed = 0;
    let failed = 0;
    
    for (const line of lines) {
      if (line.includes('passed')) {
        const match = line.match(/(\d+) passed/);
        if (match) passed += parseInt(match[1]);
      }
      if (line.includes('failed')) {
        const match = line.match(/(\d+) failed/);
        if (match) failed += parseInt(match[1]);
      }
    }
    
    const suiteResult = {
      name: suite.name,
      passed,
      failed,
      duration: `${duration}s`,
      status: failed === 0 ? 'PASSED' : 'FAILED'
    };
    
    results.suites.push(suiteResult);
    results.total += passed + failed;
    results.passed += passed;
    results.failed += failed;
    
    console.log(`   ✅ ${suite.name}: ${passed} passed, ${failed} failed (${duration}s)`);
    
    if (failed > 0) {
      console.log(`   ❌ Some tests failed in ${suite.name}`);
    }
    
  } catch (error) {
    const suiteResult = {
      name: suite.name,
      passed: 0,
      failed: 1,
      duration: 'TIMEOUT',
      status: 'ERROR',
      error: error.message
    };
    
    results.suites.push(suiteResult);
    results.total += 1;
    results.failed += 1;
    
    console.log(`   ❌ ${suite.name}: ERROR - ${error.message}`);
  }
}

async function runAllTests() {
  console.log(`\n🎯 Running ${testSuites.length} test suites...\n`);
  
  for (const suite of testSuites) {
    await runTestSuite(suite);
    
    // Small delay between suites
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  // Generate final report
  generateFinalReport();
}

function generateFinalReport() {
  console.log('\n' + '='.repeat(60));
  console.log('📊 COMPREHENSIVE TEST RESULTS SUMMARY');
  console.log('='.repeat(60));
  
  console.log(`\n🎯 Overall Results:`);
  console.log(`   Total Tests: ${results.total}`);
  console.log(`   Passed: ${results.passed}`);
  console.log(`   Failed: ${results.failed}`);
  console.log(`   Success Rate: ${((results.passed / results.total) * 100).toFixed(1)}%`);
  
  console.log(`\n📋 Test Suite Breakdown:`);
  for (const suite of results.suites) {
    const status = suite.status === 'PASSED' ? '✅' : '❌';
    console.log(`   ${status} ${suite.name}: ${suite.passed} passed, ${suite.failed} failed (${suite.duration})`);
    if (suite.error) {
      console.log(`      Error: ${suite.error}`);
    }
  }
  
  // Overall assessment
  console.log(`\n🏆 Overall Assessment:`);
  if (results.failed === 0) {
    console.log('   🎉 EXCELLENT - All tests passed! Sunspire is fully validated.');
  } else if (results.passed / results.total >= 0.8) {
    console.log('   ✅ GOOD - Most tests passed. Minor issues to address.');
  } else if (results.passed / results.total >= 0.6) {
    console.log('   ⚠️  FAIR - Significant issues found. Major improvements needed.');
  } else {
    console.log('   ❌ POOR - Critical issues found. Extensive fixes required.');
  }
  
  console.log(`\n📁 Test Reports:`);
  console.log('   HTML Report: npx playwright show-report');
  console.log('   Screenshots: test-results/');
  console.log('   Traces: test-results/');
  
  // Save results to file
  const reportData = {
    timestamp: new Date().toISOString(),
    summary: {
      total: results.total,
      passed: results.passed,
      failed: results.failed,
      successRate: ((results.passed / results.total) * 100).toFixed(1)
    },
    suites: results.suites
  };
  
  fs.writeFileSync('test-results-summary.json', JSON.stringify(reportData, null, 2));
  console.log(`\n💾 Detailed results saved to: test-results-summary.json`);
  
  console.log('\n' + '='.repeat(60));
  console.log('Test execution completed!');
  console.log('='.repeat(60));
}

// Check if we're in the right directory
if (!fs.existsSync('playwright.config.ts')) {
  console.error('❌ Error: playwright.config.ts not found. Please run this script from the project root.');
  process.exit(1);
}

// Check if dev server is running
try {
  execSync('curl -s http://localhost:3000 > /dev/null', { stdio: 'pipe' });
  console.log('✅ Development server is running on http://localhost:3000');
} catch (error) {
  console.error('❌ Error: Development server not running on http://localhost:3000');
  console.error('   Please start the server with: npm run dev');
  process.exit(1);
}

// Run the tests
runAllTests().catch(console.error);
