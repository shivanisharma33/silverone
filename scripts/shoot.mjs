/**
 * Visual + console QA harness.
 *   node scripts/shoot.mjs <path> [width] [--full] [--out name]
 * Writes a PNG to .qa/ and prints any console errors or failed requests.
 */
import { chromium } from 'playwright';
import fs from 'node:fs';

const args = process.argv.slice(2);
const route = args[0] || '/';
const width = Number(args.find((a) => /^\d+$/.test(a))) || 1440;
const full = args.includes('--full');
const outIdx = args.indexOf('--out');
const name =
  outIdx > -1 ? args[outIdx + 1] : (route.replace(/[^a-z0-9]+/gi, '_') || 'home') + '_' + width;

const BASE = process.env.QA_BASE || 'http://localhost:3000';
fs.mkdirSync('.qa', { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width, height: Math.round(width * 0.62) },
  deviceScaleFactor: 1,
});

const errors = [];
const failed = [];
page.on('console', (m) => {
  if (m.type() === 'error') errors.push(m.text().slice(0, 300));
});
page.on('pageerror', (e) => errors.push('PAGEERROR: ' + String(e).slice(0, 300)));
page.on('requestfailed', (r) => {
  const u = r.url();
  // third-party widgets may be blocked in CI; only report same-origin failures
  if (u.startsWith(BASE)) failed.push(`${r.failure()?.errorText} ${u.replace(BASE, '')}`);
});
page.on('response', (r) => {
  if (r.status() >= 400 && r.url().startsWith(BASE)) failed.push(`HTTP ${r.status()} ${r.url().replace(BASE, '')}`);
});

const res = await page.goto(BASE + route, { waitUntil: 'networkidle', timeout: 90_000 });
await page.waitForTimeout(900);

if (full) {
  // Grow the viewport to the whole document *first*, so scroll-reveal
  // observers fire once at their final size. Capturing with Playwright's own
  // fullPage resize re-triggers them and catches the page mid-animation.
  const h = await page.evaluate(() => document.body.scrollHeight);
  await page.setViewportSize({ width, height: Math.min(h + 200, 30000) });
  await page.waitForTimeout(1400);
}

await page.screenshot({ path: `.qa/${name}.png` });

const overflow = await page.evaluate(
  () => document.documentElement.scrollWidth - document.documentElement.clientWidth
);
const title = await page.title();

console.log(`status ${res?.status()}  title "${title}"  overflowX ${overflow}px  -> .qa/${name}.png`);
if (errors.length) console.log('CONSOLE ERRORS:\n  ' + [...new Set(errors)].join('\n  '));
if (failed.length) console.log('FAILED REQUESTS:\n  ' + [...new Set(failed)].slice(0, 15).join('\n  '));
if (!errors.length && !failed.length) console.log('clean: no console errors, no failed same-origin requests');

await browser.close();
