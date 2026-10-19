/**
 * Checks the homepage Featured Video + Investor Resources band: card
 * destinations, the video modal, and the responsive grid.
 */
import { chromium } from 'playwright';
const BASE = process.env.QA_BASE || 'http://localhost:3000';
const results = [];
const check = (n, p, d='') => { results.push({n,p,d}); console.log(`${p?'PASS':'FAIL'}  ${n}${d?' — '+d:''}`); };

const b = await chromium.launch();
const page = await b.newPage({ viewport: { width: 1536, height: 1024 } });
const errs = [];
page.on('pageerror', e => errs.push(String(e).slice(0,150)));
page.on('console', m => m.type()==='error' && errs.push(m.text().slice(0,150)));
await page.goto(BASE + '/', { waitUntil: 'networkidle' });

const section = page.locator('section[aria-labelledby="investor-resources-heading"]');
check('section renders', await section.isVisible());

// no third-party frame before interaction
check('no iframe before click', (await page.locator('iframe').count()) === 0);

// 8 resource cards, all with real hrefs
const hrefs = await section.locator('ul a').evaluateAll(as => as.map(a => a.getAttribute('href')));
check('eight resource cards', hrefs.length === 8, `${hrefs.length} cards`);
check('no placeholder hrefs', hrefs.every(h => h && h !== '#'), hrefs.filter(h=>!h||h==='#').join(',') || 'all real');

// every destination resolves
let bad = [];
for (const h of hrefs) {
  const r = await page.request.get(BASE + h, { maxRedirects: 5 });
  if (r.status() !== 200) bad.push(`${r.status()} ${h}`);
}
check('all card destinations resolve', bad.length === 0, bad.join(' | ') || `${hrefs.length}/8 → 200`);

// View All Resources button
const cta = section.locator('a:has-text("View All Resources")');
check('View All Resources present', await cta.isVisible(), await cta.getAttribute('href') ?? '');

// --- video modal ---
await page.locator('button:has-text("Watch Video")').click();
await page.waitForTimeout(700);
const dialog = page.locator('div[role="dialog"]');
check('modal opens on play', await dialog.isVisible());
check('iframe mounts only after click', (await page.locator('iframe').count()) === 1);
const src = await page.locator('iframe').getAttribute('src');
check('embeds the official Candelaria video', !!src && src.includes('4cGOY0BJsKo'), src?.slice(0,60));
const focused = await page.evaluate(() => document.activeElement?.getAttribute('aria-label'));
check('focus moves to close button', focused === 'Close video', focused ?? 'none');

await page.keyboard.press('Escape');
await page.waitForTimeout(600);
check('Escape closes modal', !(await dialog.isVisible().catch(()=>false)));
check('iframe unmounts on close', (await page.locator('iframe').count()) === 0);

// close button
await page.locator('button:has-text("Watch Video")').click();
await page.waitForTimeout(600);
await page.locator('button[aria-label="Close video"]').click();
await page.waitForTimeout(600);
check('close button works', !(await dialog.isVisible().catch(()=>false)));

// keyboard: play button reachable and activatable
await page.locator('button:has-text("Watch Video")').focus();
await page.keyboard.press('Enter');
await page.waitForTimeout(600);
check('play button works via keyboard', await dialog.isVisible());
await page.keyboard.press('Escape');
await page.waitForTimeout(400);

check('no console/page errors', errs.length === 0, [...new Set(errs)].slice(0,2).join(' | '));

// --- responsive ---
for (const [w, expectCols] of [[1536,4],[1440,4],[1280,4],[1024,2],[820,2],[390,2]]) {
  await page.setViewportSize({ width: w, height: 900 });
  await page.waitForTimeout(450);
  const cols = await section.locator('ul').evaluate(el =>
    getComputedStyle(el).gridTemplateColumns.split(' ').length);
  const overflow = await page.evaluate(() =>
    document.documentElement.scrollWidth - document.documentElement.clientWidth);
  check(`${w}px: ${expectCols}-col grid, no overflow`, cols === expectCols && overflow <= 1,
    `cols=${cols} overflowX=${overflow}px`);
}

await b.close();
const failed = results.filter(r => !r.p);
console.log(`\n${results.length - failed.length}/${results.length} checks passed`);
if (failed.length) process.exitCode = 1;
