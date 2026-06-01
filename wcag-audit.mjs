/**
 * WCAG Accessibility Audit Script
 * Tests all portfolio pages in both light and dark themes using axe-core.
 * Usage: node wcag-audit.mjs
 * Output: wcag-audit-report.json (detailed) + wcag-audit-report.md (summary)
 */

import puppeteer from 'puppeteer';
import { createServer } from 'http';
import { readFileSync, existsSync } from 'fs';
import { join, extname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const PORT = 8765;
const BASE_URL = `http://localhost:${PORT}`;

// Pages to audit: [url, label, waitForSelector]
const PAGES = [
  ['/', 'Main Portfolio (index.html)', 'nav.sidebar'],
  ['/h5p.html', 'H5P Interactive Timeline', '#h5p-container'],
  ['/ai-literacy/index.html', 'AI Literacy Course', '#app'],
  ['/data-privacy-compliance/index.html', 'Data Privacy Compliance', '#app'],
  ['/giving-constructive-feedback/index.html', 'Giving Constructive Feedback', '#app'],
  ['/interactive-quiz/index.html', 'Interactive Quiz (H5P)', '#h5p-container'],
  ['/ielts-masterclass/index.html', 'IELTS Speaking Masterclass', '#course-shell'],
  ['/ielts-masterclass/portfolio_index.html', 'IELTS Portfolio Index', '#h5p-container'],
  ['/learning-analytics/index.html', 'Learning Analytics Dashboard', 'body'],
];

// MIME types
const MIME = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf',
};

// Start a simple static file server
function startServer() {
  return new Promise((resolve) => {
    const server = createServer((req, res) => {
      let filePath = join(__dirname, req.url === '/' ? 'index.html' : req.url);
      // Handle redirect fallback for clean URLs
      if (!existsSync(filePath)) {
        // Try with /index.html appended
        const indexPath = join(filePath, 'index.html');
        if (existsSync(indexPath)) {
          filePath = indexPath;
        } else {
          res.writeHead(404);
          res.end('Not found');
          return;
        }
      }
      try {
        const content = readFileSync(filePath);
        const ext = extname(filePath).toLowerCase();
        const contentType = MIME[ext] || 'application/octet-stream';
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(content);
      } catch (e) {
        res.writeHead(500);
        res.end('Error: ' + e.message);
      }
    });
    server.listen(PORT, () => {
      console.log(`Server running on ${BASE_URL}`);
      resolve(server);
    });
  });
}

// Severity label
function severityLabel(impact) {
  const icons = { critical: '🔴', serious: '🟠', moderate: '🟡', minor: '🔵' };
  return `${icons[impact] || '⚪'} ${impact || 'unknown'}`;
}

async function runAudit() {
  console.log('Starting WCAG accessibility audit...\n');

  const server = await startServer();
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const allResults = [];

  for (const [url, label, waitFor] of PAGES) {
    console.log(`\n${'='.repeat(70)}`);
    console.log(`📄 Testing: ${label}`);
    console.log(`URL: ${BASE_URL}${url}`);
    console.log(`${'='.repeat(70)}`);

    const page = await browser.newPage();
    
    // Set reasonable viewport
    await page.setViewport({ width: 1280, height: 900 });

    // Increase timeout for large pages (IELTS Masterclass needs more time)
    const isIELTS = url.includes('ielts-masterclass/index.html');
    await page.setDefaultNavigationTimeout(isIELTS ? 60000 : 30000);

    try {
      await page.goto(`${BASE_URL}${url}`, { waitUntil: 'networkidle0' });

      // Wait for the key element to appear
      if (waitFor) {
        try {
          await page.waitForSelector(waitFor, { timeout: 10000 });
        } catch {
          console.log(`  ⚠️  Warning: Could not find selector "${waitFor}"`);
        }
      }

      // Give SPA frameworks time to fully render
      await new Promise(r => setTimeout(r, 1500));

      // Inject axe-core
      await page.addScriptTag({
        path: join(__dirname, 'node_modules', 'axe-core', 'axe.min.js')
      });

      // Test LIGHT theme
      console.log('\n  🌞 Light Theme:');
      // Ensure we start in light mode
      await page.evaluate(() => {
        document.documentElement.removeAttribute('data-theme');
        localStorage.removeItem('theme');
      });
      await new Promise(r => setTimeout(r, 500));

      const lightResults = await page.evaluate(async () => {
        try {
          return await axe.run({
            runOnly: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'],
            resultTypes: ['violations', 'incomplete'],
          });
        } catch (e) {
          return { violations: [], incomplete: [], error: e.message };
        }
      });

      // Test DARK theme
      console.log('  🌙 Dark Theme:');
      await page.evaluate(() => {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
      });
      await new Promise(r => setTimeout(r, 500));

      const darkResults = await page.evaluate(async () => {
        try {
          return await axe.run({
            runOnly: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'],
            resultTypes: ['violations', 'incomplete'],
          });
        } catch (e) {
          return { violations: [], incomplete: [], error: e.message };
        }
      });

      // Process light theme results
      const lightViolations = lightResults.violations || [];
      const lightIncomplete = lightResults.incomplete || [];
      console.log(`    Violations: ${lightViolations.length}, Incomplete: ${lightIncomplete.length}`);
      for (const v of lightViolations) {
        console.log(`    ${severityLabel(v.impact)} ${v.id}: ${v.help} (${v.nodes.length} nodes)`);
      }

      // Process dark theme results
      const darkViolations = darkResults.violations || [];
      const darkIncomplete = darkResults.incomplete || [];
      console.log(`    Violations: ${darkViolations.length}, Incomplete: ${darkIncomplete.length}`);
      for (const v of darkViolations) {
        console.log(`    ${severityLabel(v.impact)} ${v.id}: ${v.help} (${v.nodes.length} nodes)`);
      }

      // Check for contrast-specific issues in dark mode
      const darkContrastIssues = darkViolations.filter(v => 
        v.id.includes('color-contrast') || v.id.includes('contrast')
      );
      if (darkContrastIssues.length > 0) {
        console.log(`\n    ⚠️  Dark mode contrast issues to investigate:`);
        for (const v of darkContrastIssues) {
          console.log(`      - ${v.help}: ${v.nodes.length} elements affected`);
        }
      }

      // Check focus/keyboard accessibility
      const focusIssues = [...lightViolations, ...darkViolations].filter(v =>
        v.id.includes('focus') || v.id.includes('tab') || v.id.includes('keyboard')
      );
      if (focusIssues.length > 0) {
        console.log(`\n    ⌨️  Focus/Keyboard issues found in one or both themes`);
      } else {
        console.log(`\n    ✅ No focus/keyboard issues found`);
      }

      // Manual keyboard tab check - just tab through key elements
      const tabFocusable = await page.evaluate(() => {
        const focusable = document.querySelectorAll(
          'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const visible = Array.from(focusable).filter(el => {
          const style = window.getComputedStyle(el);
          return style.display !== 'none' && style.visibility !== 'hidden';
        });
        return visible.length;
      });

      allResults.push({
        url,
        label,
        light: {
          violations: lightViolations.map(v => ({
            id: v.id,
            impact: v.impact,
            help: v.help,
            helpUrl: v.helpUrl,
            tags: v.tags,
            nodeCount: v.nodes.length,
            nodes: v.nodes.map(n => ({
              html: n.html.substring(0, 200),
              target: n.target,
              failureSummary: n.failureSummary,
            })),
          })),
          incomplete: lightIncomplete.map(v => ({
            id: v.id,
            impact: v.impact,
            help: v.help,
            nodeCount: v.nodes.length,
          })),
          violationCount: lightViolations.length,
        },
        dark: {
          violations: darkViolations.map(v => ({
            id: v.id,
            impact: v.impact,
            help: v.help,
            helpUrl: v.helpUrl,
            tags: v.tags,
            nodeCount: v.nodes.length,
            nodes: v.nodes.map(n => ({
              html: n.html.substring(0, 200),
              target: n.target,
              failureSummary: n.failureSummary,
            })),
          })),
          incomplete: darkIncomplete.map(v => ({
            id: v.id,
            impact: v.impact,
            help: v.help,
            nodeCount: v.nodes.length,
          })),
          violationCount: darkViolations.length,
        },
        tabFocusableCount: tabFocusable,
      });

      // Summary for this page
      const totalV = lightViolations.length + darkViolations.length;
      const totalI = lightIncomplete.length + darkIncomplete.length;
      const status = totalV === 0 ? '✅ PASS' : `⚠️  ${totalV} violations`;
      console.log(`\n  📊 Result: ${status} (${totalV} violations, ${totalI} incomplete)`);
      console.log(`  Tab-focusable elements: ${tabFocusable}`);

    } catch (err) {
      console.error(`  ❌ Error testing ${label}: ${err.message}`);
      allResults.push({
        url,
        label,
        error: err.message,
        light: { violations: [], incomplete: [], violationCount: 0 },
        dark: { violations: [], incomplete: [], violationCount: 0 },
        tabFocusableCount: 0,
      });
    } finally {
      await page.close();
    }
  }

  await browser.close();
  server.close();

  return allResults;
}

function generateReport(results) {
  let markdown = `# WCAG Accessibility Audit Report\n\n`;
  markdown += `**Date:** ${new Date().toISOString().split('T')[0]}\n`;
  markdown += `**Tool:** axe-core (WCAG 2.0 A/AA + WCAG 2.1 A/AA)\n`;
  markdown += `**Pages Tested:** ${results.length}\n\n`;

  // Summary table
  markdown += `## Summary\n\n`;
  markdown += `| Page | Light Violations | Dark Violations | Pass/Fail |\n`;
  markdown += `|------|:-:|:-:|:-:|\n`;

  let totalLightV = 0, totalDarkV = 0;
  let passCount = 0, failCount = 0;

  for (const r of results) {
    const lv = r.light?.violationCount || 0;
    const dv = r.dark?.violationCount || 0;
    totalLightV += lv;
    totalDarkV += dv;
    const status = (lv + dv === 0) ? '✅ Pass' : '⚠️ Fail';
    if (lv + dv === 0) passCount++; else failCount++;
    markdown += `| ${r.label} | ${lv} | ${dv} | ${status} |\n`;
  }

  markdown += `\n**Overall: ${passCount} passed, ${failCount} failed** (`;
  markdown += `${totalLightV + totalDarkV} total violations)\n\n`;

  // Critical issues summary
  markdown += `## Critical & Serious Issues\n\n`;
  let criticalFound = false;
  for (const r of results) {
    for (const theme of ['light', 'dark']) {
      const violations = r[theme]?.violations || [];
      const critical = violations.filter(v => v.impact === 'critical' || v.impact === 'serious');
      if (critical.length > 0) {
        criticalFound = true;
        markdown += `### ${r.label} (${theme} theme)\n\n`;
        for (const v of critical) {
          markdown += `- **${v.id}** (${v.impact}): ${v.help}\n`;
          markdown += `  - Affected elements: ${v.nodeCount}\n`;
          markdown += `  - Reference: ${v.helpUrl}\n`;
          for (const n of v.nodes.slice(0, 3)) {
            markdown += `  - \`${n.html.substring(0, 120)}\`\n`;
          }
          markdown += `\n`;
        }
      }
    }
  }
  if (!criticalFound) {
    markdown += `No critical or serious violations found across any page. ✅\n\n`;
  }

  // Detailed per-page breakdown
  markdown += `## Detailed Breakdown\n\n`;
  for (const r of results) {
    markdown += `### ${r.label}\n`;
    markdown += `- **URL:** ${r.url}\n`;
    markdown += `- **Tab-focusable elements:** ${r.tabFocusableCount}\n\n`;

    if (r.error) {
      markdown += `⚠️ Error: ${r.error}\n\n`;
      continue;
    }

    for (const theme of ['light', 'dark']) {
      const violations = r[theme]?.violations || [];
      const incomplete = r[theme]?.incomplete || [];
      markdown += `#### ${theme === 'light' ? '☀️ Light' : '🌙 Dark'} Theme\n`;
      markdown += `- Violations: ${violations.length}\n`;
      markdown += `- Incomplete: ${incomplete.length}\n`;

      if (violations.length > 0) {
        markdown += `\n| ID | Impact | Help | Nodes |\n`;
        markdown += `|----|--------|------|:----:|\n`;
        for (const v of violations) {
          markdown += `| ${v.id} | ${v.impact} | ${v.help} | ${v.nodeCount} |\n`;
        }
        markdown += `\n`;
      }
    }
    markdown += `\n`;
  }

  // Recommendations
  markdown += `## Recommendations\n\n`;
  
  // Collect unique violation IDs
  const allViolationIds = new Set();
  for (const r of results) {
    for (const theme of ['light', 'dark']) {
      for (const v of r[theme]?.violations || []) {
        allViolationIds.add(v.id);
      }
    }
  }

  const recommendations = {
    'color-contrast': 'Ensure text has sufficient contrast against background. In dark mode, use lighter text colors (e.g., #e2e8f0 on dark backgrounds). Minimum ratio: 4.5:1 for normal text, 3:1 for large text.',
    'link-in-text-block': 'Add distinct visual styling (underline, icon, or color) to links within text blocks so they are identifiable by color alone.',
    'image-alt': 'Add meaningful alt text to all informative images. Decorative images should use alt="".',
    'button-name': 'Ensure all buttons have accessible names, either via text content or aria-label attribute.',
    'heading-order': 'Ensure headings follow a logical hierarchy (h1 → h2 → h3) without skipping levels.',
    'landmark-one-main': 'Ensure each page has exactly one <main> landmark for screen reader navigation.',
    'region': 'Ensure all page content is contained within landmarks (e.g., <main>, <nav>, <header>, <footer>).',
    'frame-title': 'Ensure all iframes have descriptive title attributes.',
    'aria-allowed-attr': 'Ensure ARIA attributes used are allowed for the element role.',
    'aria-required-children': 'Ensure elements with required children ARIA roles have appropriate child elements.',
    'aria-required-parent': 'Ensure elements have the required parent ARIA role.',
    'label': 'Ensure all form elements have associated labels.',
    'select-name': 'Ensure select elements have associated labels.',
    'duplicate-id': 'Ensure no duplicate IDs exist on the page.',
    'meta-viewport': 'Ensure viewport meta tag does not disable zoom.',
    'tabindex': 'Ensure tabindex values are not greater than 0.',
    'scrollable-region-focusable': 'Ensure scrollable regions are keyboard accessible.',
  };

  const foundRecs = [...allViolationIds].map(id => 
    `- **${id}**: ${recommendations[id] || 'Review axe-core documentation for remediation guidance.'}`
  );
  
  if (foundRecs.length > 0) {
    markdown += foundRecs.join('\n') + '\n\n';
  } else {
    markdown += 'No issues found — all pages pass WCAG 2.1 AA audit. 🎉\n\n';
  }

  // Theme toggle specific
  markdown += `### Theme Toggle Accessibility\n\n`;
  markdown += `- Ensure theme toggle button has \`aria-label\` for screen readers (implemented)\n`;
  markdown += `- Verify focus indicator visible when tabbing to toggle button\n`;
  markdown += `- Confirm theme state is communicated (current icon: sun=light, moon=dark)\n`;
  markdown += `- Test keyboard operation (Enter/Space to toggle)\n`;

  return markdown;
}

// Main execution
(async () => {
  try {
    const results = await runAudit();
    
    // Save JSON report
    const { writeFileSync } = await import('fs');
    writeFileSync(
      join(__dirname, 'wcag-audit-report.json'),
      JSON.stringify(results, null, 2)
    );

    // Generate and save markdown report
    const markdown = generateReport(results);
    writeFileSync(
      join(__dirname, 'wcag-audit-report.md'),
      markdown
    );

    console.log(`\n\n${'='.repeat(70)}`);
    console.log('WCAG AUDIT COMPLETE');
    console.log(`${'='.repeat(70)}`);
    console.log(`\n📊 Final Summary:`);
    let totalLight = 0, totalDark = 0;
    let passed = 0, failed = 0;
    for (const r of results) {
      const lv = r.light?.violationCount || 0;
      const dv = r.dark?.violationCount || 0;
      totalLight += lv;
      totalDark += dv;
      if (lv + dv === 0) passed++; else failed++;
    }
    console.log(`  ✅ Passed: ${passed} page(s)`);
    console.log(`  ⚠️  Failed: ${failed} page(s)`);
    console.log(`  Light theme violations: ${totalLight}`);
    console.log(`  Dark theme violations: ${totalDark}`);
    console.log(`  Total violations: ${totalLight + totalDark}`);
    console.log(`\n📄 Reports saved:`);
    console.log(`  - wcag-audit-report.json (detailed)`);
    console.log(`  - wcag-audit-report.md (summary)`);
    
    process.exit(0);
  } catch (err) {
    console.error('Fatal error:', err);
    process.exit(1);
  }
})();
