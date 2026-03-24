#!/usr/bin/env node

// Comprehensive cross-browser testing script
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const browsers = ['chromium', 'safari', 'firefox'];
const testSuites = [
  'cross-browser-consistency.spec.ts',
  'live-site-verification.spec.ts'
];

async function runCrossBrowserTests() {
  console.log('🌐 Starting comprehensive cross-browser testing...');
  console.log('📊 Testing browsers:', browsers.join(', '));
  console.log('🧪 Test suites:', testSuites.join(', '));
  
  const results = {};
  
  for (const browser of browsers) {
    console.log(`\n🔍 Testing ${browser.toUpperCase()}...`);
    results[browser] = {};
    
    for (const testSuite of testSuites) {
      try {
        console.log(`  📋 Running ${testSuite} on ${browser}...`);
        
        const command = `npx playwright test ${testSuite} --project=${browser} --reporter=json`;
        const output = execSync(command, { 
          encoding: 'utf8',
          cwd: process.cwd(),
          stdio: 'pipe'
        });
        
        const result = JSON.parse(output);
        results[browser][testSuite] = {
          status: 'passed',
          tests: result.stats?.total || 0,
          passed: result.stats?.passed || 0,
          failed: result.stats?.failed || 0
        };
        
        console.log(`    ✅ ${testSuite} on ${browser}: ${result.stats?.passed || 0}/${result.stats?.total || 0} passed`);
        
      } catch (error) {
        console.log(`    ❌ ${testSuite} on ${browser}: FAILED`);
        results[browser][testSuite] = {
          status: 'failed',
          error: error.message
        };
      }
    }
  }
  
  // Generate comprehensive report
  generateReport(results);
  
  // Check if all tests passed
  const allPassed = Object.values(results).every(browserResults => 
    Object.values(browserResults).every(suite => suite.status === 'passed')
  );
  
  if (allPassed) {
    console.log('\n🎉 ALL CROSS-BROWSER TESTS PASSED!');
    console.log('✅ All changes work consistently across all browsers');
  } else {
    console.log('\n❌ SOME CROSS-BROWSER TESTS FAILED!');
    console.log('🔧 Check the report above for details');
    process.exit(1);
  }
}

function generateReport(results) {
  console.log('\n📊 CROSS-BROWSER TEST REPORT');
  console.log('=' .repeat(50));
  
  for (const [browser, browserResults] of Object.entries(results)) {
    console.log(`\n🌐 ${browser.toUpperCase()}:`);
    
    for (const [testSuite, result] of Object.entries(browserResults)) {
      if (result.status === 'passed') {
        console.log(`  ✅ ${testSuite}: ${result.passed}/${result.tests} tests passed`);
      } else {
        console.log(`  ❌ ${testSuite}: FAILED - ${result.error}`);
      }
    }
  }
  
  // Save detailed report to file
  const reportPath = path.join(process.cwd(), 'test-results', 'cross-browser-report.json');
  fs.mkdirSync(path.dirname(reportPath), { recursive: true });
  fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
  console.log(`\n📄 Detailed report saved to: ${reportPath}`);
}

// Run the tests
runCrossBrowserTests().catch(error => {
  console.error('❌ Cross-browser testing failed:', error);
  process.exit(1);
});
