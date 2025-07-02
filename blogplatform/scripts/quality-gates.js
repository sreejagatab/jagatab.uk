const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Import audit modules
const runLighthouseAudit = require('./lighthouse-audit');
const runAccessibilityAudit = require('./accessibility-audit');
const runSecurityAudit = require('./security-audit');
const runSEOAudit = require('./seo-audit');
const runBrowserCompatibilityTest = require('./browser-compatibility-test');

async function runQualityGates() {
  console.log('🎯 RUNNING ALL QUALITY GATES\n');
  console.log('=' .repeat(50));
  
  const results = {
    timestamp: new Date().toISOString(),
    gates: {},
    summary: {
      total: 8,
      passed: 0,
      failed: 0,
      skipped: 0
    }
  };

  // Gate 1: Unit Tests with Coverage
  console.log('\n1️⃣  UNIT TESTS WITH COVERAGE (95%+)');
  console.log('-'.repeat(40));
  try {
    execSync('npm test -- --coverage --watchAll=false --passWithNoTests', { 
      stdio: 'inherit',
      timeout: 120000 
    });
    results.gates.unitTests = { status: 'PASSED', score: 100 };
    results.summary.passed++;
    console.log('✅ Unit Tests: PASSED');
  } catch (error) {
    results.gates.unitTests = { status: 'FAILED', error: error.message };
    results.summary.failed++;
    console.log('❌ Unit Tests: FAILED');
  }

  // Gate 2: Integration Tests
  console.log('\n2️⃣  INTEGRATION TESTS');
  console.log('-'.repeat(40));
  try {
    execSync('npm test -- __tests__/integration --watchAll=false', { 
      stdio: 'inherit',
      timeout: 120000 
    });
    results.gates.integrationTests = { status: 'PASSED', score: 100 };
    results.summary.passed++;
    console.log('✅ Integration Tests: PASSED');
  } catch (error) {
    results.gates.integrationTests = { status: 'FAILED', error: error.message };
    results.summary.failed++;
    console.log('❌ Integration Tests: FAILED');
  }

  // Gate 3: E2E Tests with Cypress
  console.log('\n3️⃣  E2E TESTS WITH CYPRESS');
  console.log('-'.repeat(40));
  try {
    execSync('npm run cypress:run', { 
      stdio: 'inherit',
      timeout: 300000 
    });
    results.gates.e2eTests = { status: 'PASSED', score: 100 };
    results.summary.passed++;
    console.log('✅ E2E Tests: PASSED');
  } catch (error) {
    results.gates.e2eTests = { status: 'FAILED', error: error.message };
    results.summary.failed++;
    console.log('❌ E2E Tests: FAILED');
  }

  // Gate 4: Performance Audit (Core Web Vitals > 90)
  console.log('\n4️⃣  PERFORMANCE AUDIT (CORE WEB VITALS > 90)');
  console.log('-'.repeat(40));
  try {
    const perfPassed = await runLighthouseAudit();
    results.gates.performance = { 
      status: perfPassed ? 'PASSED' : 'FAILED', 
      score: perfPassed ? 100 : 0 
    };
    if (perfPassed) {
      results.summary.passed++;
      console.log('✅ Performance: PASSED');
    } else {
      results.summary.failed++;
      console.log('❌ Performance: FAILED');
    }
  } catch (error) {
    results.gates.performance = { status: 'FAILED', error: error.message };
    results.summary.failed++;
    console.log('❌ Performance: FAILED');
  }

  // Gate 5: Accessibility (WCAG 2.1 AA)
  console.log('\n5️⃣  ACCESSIBILITY (WCAG 2.1 AA COMPLIANCE)');
  console.log('-'.repeat(40));
  try {
    const a11yPassed = await runAccessibilityAudit();
    results.gates.accessibility = { 
      status: a11yPassed ? 'PASSED' : 'FAILED', 
      score: a11yPassed ? 100 : 0 
    };
    if (a11yPassed) {
      results.summary.passed++;
      console.log('✅ Accessibility: PASSED');
    } else {
      results.summary.failed++;
      console.log('❌ Accessibility: FAILED');
    }
  } catch (error) {
    results.gates.accessibility = { status: 'FAILED', error: error.message };
    results.summary.failed++;
    console.log('❌ Accessibility: FAILED');
  }

  // Gate 6: Security Headers
  console.log('\n6️⃣  SECURITY HEADERS & BEST PRACTICES');
  console.log('-'.repeat(40));
  try {
    const securityPassed = await runSecurityAudit();
    results.gates.security = { 
      status: securityPassed ? 'PASSED' : 'FAILED', 
      score: securityPassed ? 100 : 0 
    };
    if (securityPassed) {
      results.summary.passed++;
      console.log('✅ Security: PASSED');
    } else {
      results.summary.failed++;
      console.log('❌ Security: FAILED');
    }
  } catch (error) {
    results.gates.security = { status: 'FAILED', error: error.message };
    results.summary.failed++;
    console.log('❌ Security: FAILED');
  }

  // Gate 7: SEO Optimization
  console.log('\n7️⃣  SEO OPTIMIZATION (PERFECT SCORE)');
  console.log('-'.repeat(40));
  try {
    const seoPassed = await runSEOAudit();
    results.gates.seo = { 
      status: seoPassed ? 'PASSED' : 'FAILED', 
      score: seoPassed ? 100 : 0 
    };
    if (seoPassed) {
      results.summary.passed++;
      console.log('✅ SEO: PASSED');
    } else {
      results.summary.failed++;
      console.log('❌ SEO: FAILED');
    }
  } catch (error) {
    results.gates.seo = { status: 'FAILED', error: error.message };
    results.summary.failed++;
    console.log('❌ SEO: FAILED');
  }

  // Gate 8: Cross-browser Compatibility
  console.log('\n8️⃣  CROSS-BROWSER COMPATIBILITY');
  console.log('-'.repeat(40));
  try {
    const browserPassed = await runBrowserCompatibilityTest();
    results.gates.browserCompatibility = { 
      status: browserPassed ? 'PASSED' : 'FAILED', 
      score: browserPassed ? 100 : 0 
    };
    if (browserPassed) {
      results.summary.passed++;
      console.log('✅ Browser Compatibility: PASSED');
    } else {
      results.summary.failed++;
      console.log('❌ Browser Compatibility: FAILED');
    }
  } catch (error) {
    results.gates.browserCompatibility = { status: 'FAILED', error: error.message };
    results.summary.failed++;
    console.log('❌ Browser Compatibility: FAILED');
  }

  // Final Summary
  console.log('\n' + '='.repeat(50));
  console.log('🎯 QUALITY GATES SUMMARY');
  console.log('='.repeat(50));
  
  const successRate = (results.summary.passed / results.summary.total * 100).toFixed(1);
  const allPassed = results.summary.failed === 0;
  
  console.log(`Total Gates: ${results.summary.total}`);
  console.log(`Passed: ${results.summary.passed}`);
  console.log(`Failed: ${results.summary.failed}`);
  console.log(`Success Rate: ${successRate}%`);
  console.log('');
  
  if (allPassed) {
    console.log('🎉 ALL QUALITY GATES PASSED! 🎉');
    console.log('✅ Your application is production-ready!');
  } else {
    console.log('❌ QUALITY GATES FAILED');
    console.log('🔧 Please fix the failing gates before deploying to production.');
    console.log('');
    console.log('Failed Gates:');
    Object.entries(results.gates).forEach(([gate, result]) => {
      if (result.status === 'FAILED') {
        console.log(`  - ${gate.toUpperCase()}`);
      }
    });
  }

  // Save comprehensive report
  const reportPath = path.join(__dirname, '..', 'quality-gates-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
  console.log(`\n📊 Comprehensive report saved to: ${reportPath}`);

  return allPassed;
}

if (require.main === module) {
  runQualityGates()
    .then(passed => {
      process.exit(passed ? 0 : 1);
    })
    .catch(error => {
      console.error('Quality gates execution failed:', error);
      process.exit(1);
    });
}

module.exports = runQualityGates;
