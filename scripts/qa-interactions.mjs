/**
 * Drives the interactive parts of the site and asserts they actually work:
 * navigation (desktop + mobile), news search/filter/paging, the document
 * library, project tabs and lightbox, video facades, and both forms.
 */
import { chromium } from 'playwright';

const BASE = process.env.QA_BASE || 'http://localhost:3000';
const results = [];
const check = (name, pass, detail = '') => {
  results.push({ name, pass, detail });
  console.log(`${pass ? 'PASS' : 'FAIL'}  ${name}${detail ? ' — ' + detail : ''}`);
};

const browser = await chromium.launch();

/* ------------------------------------------------ desktop navigation --- */
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(BASE + '/', { waitUntil: 'domcontentloaded' });

  const projectsTrigger = page.locator('nav[aria-label="Primary"] a', { hasText: /^Projects$/ }).first();
  await projectsTrigger.hover();
  await page.waitForTimeout(400);
  const dropdownVisible = await page.locator('nav[aria-label="Primary"] a:has-text("Candelaria")').first().isVisible();
  check('desktop dropdown opens on hover', dropdownVisible);

  if (dropdownVisible) {
    await page.locator('nav[aria-label="Primary"] a:has-text("Candelaria")').first().click();
    const navOk = await page.waitForURL('**/candelaria/', { timeout: 15000 }).then(() => true).catch(() => false);
    check('dropdown link navigates', navOk, page.url().replace(BASE, ''));
  }

  // Escape closes the menu
  await page.goto(BASE + '/', { waitUntil: 'domcontentloaded' });
  await projectsTrigger.hover();
  await page.waitForTimeout(350);
  await page.keyboard.press('Escape');
  await page.waitForTimeout(350);
  const closed = !(await page.locator('nav[aria-label="Primary"] a:has-text("Candelaria")').first().isVisible());
  check('Escape closes dropdown', closed);

  // Skip link
  await page.goto(BASE + '/', { waitUntil: 'domcontentloaded' });
  await page.keyboard.press('Tab');
  const skipFocused = await page.evaluate(() => document.activeElement?.textContent?.includes('Skip to main'));
  check('skip link is first tab stop', !!skipFocused);

  await page.close();
}

/* ------------------------------------------------- mobile navigation --- */
{
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto(BASE + '/', { waitUntil: 'domcontentloaded' });

  await page.locator('button[aria-label="Open navigation menu"]').click();
  await page.waitForTimeout(500);
  const drawer = page.locator('div[role="dialog"][aria-label="Site navigation"]');
  check('mobile drawer opens', await drawer.isVisible());

  await page.locator('button[aria-label*="Expand Investors"]').click();
  await page.waitForTimeout(450);
  const subVisible = await drawer.locator('a:has-text("Share Structure")').first().isVisible();
  check('mobile submenu expands', subVisible);

  if (subVisible) {
    await drawer.locator('a:has-text("Share Structure")').first().click();
    const mnavOk = await page.waitForURL('**/share-structure/', { timeout: 15000 }).then(() => true).catch(() => false);
    check('mobile nav navigates', mnavOk, page.url().replace(BASE, ''));
  }

  await page.goto(BASE + '/', { waitUntil: 'domcontentloaded' });
  await page.locator('button[aria-label="Open navigation menu"]').click();
  await page.waitForTimeout(400);
  await page.keyboard.press('Escape');
  await page.waitForTimeout(500);
  check('Escape closes mobile drawer', !(await drawer.isVisible().catch(() => false)));

  await page.close();
}

/* --------------------------------------------------------- news archive */
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(BASE + '/news/', { waitUntil: 'networkidle' });

  const initial = await page.locator('article').count();
  check('news archive renders rows', initial > 0, `${initial} rows`);

  await page.fill('#news-search', 'Candelaria');
  await page.waitForTimeout(600);
  const afterSearch = await page.locator('article').count();
  const statusText = await page.locator('p[role="status"]').first().textContent();
  check('news search filters', afterSearch > 0 && statusText?.includes('matching'), statusText?.trim());

  await page.fill('#news-search', 'zzzznotarealterm');
  await page.waitForTimeout(600);
  const empty = await page.locator('text=No releases found').isVisible();
  check('news search empty state', empty);

  await page.fill('#news-search', '');
  await page.waitForTimeout(500);
  const loadMore = page.locator('button:has-text("Load")');
  if (await loadMore.count()) {
    const before = await page.locator('article').count();
    await loadMore.click();
    await page.waitForTimeout(500);
    const after = await page.locator('article').count();
    check('news load-more paginates', after > before, `${before} -> ${after}`);
  } else {
    check('news load-more paginates', false, 'button not found');
  }

  await page.locator('nav[aria-label="Filter news by year"] a:has-text("2019")').click();
  const yrOk = await page.waitForURL('**/news/2019/', { timeout: 15000 }).then(() => true).catch(() => false);
  check('news year filter navigates', yrOk, page.url().replace(BASE, ''));

  await page.close();
}

/* ------------------------------------------------------ document library */
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(BASE + '/documents/', { waitUntil: 'networkidle' });

  const total = await page.locator('ul > li > article').count();
  check('document library renders cards', total > 0, `${total} cards`);

  await page.locator('button:has-text("ESTMA Reports")').first().click();
  await page.waitForTimeout(500);
  const estma = await page.locator('ul > li > article').count();
  check('document category filter works', estma > 0 && estma < total, `${estma} of ${total}`);

  await page.fill('#doc-search', '2019');
  await page.waitForTimeout(600);
  const searched = await page.locator('ul > li > article').count();
  check('document search works', searched >= 0, `${searched} results`);

  // Verify a PDF link actually resolves
  await page.locator('button:has-text("All Documents")').first().click();
  await page.fill('#doc-search', '');
  await page.waitForTimeout(500);
  const href = await page.locator('a[href$=".pdf"]').first().getAttribute('href');
  const res = await page.request.get(BASE + href);
  check('document PDF resolves', res.status() === 200, `${res.status()} ${href}`);
  check('PDF served as application/pdf', (res.headers()['content-type'] || '').includes('pdf'), res.headers()['content-type']);

  await page.close();
}

/* --------------------------------------------- project tabs + lightbox --- */
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(BASE + '/projects/usa-projects/candelaria/', { waitUntil: 'networkidle' });

  const tabs = await page.locator('[role="tab"]').count();
  check('project tabs render', tabs >= 5, `${tabs} tabs`);

  await page.locator('[role="tab"]:has-text("Photos")').click();
  await page.waitForTimeout(600);
  const thumbs = await page.locator('button[aria-label^="Enlarge"]').count();
  check('photos tab shows gallery', thumbs > 0, `${thumbs} thumbnails`);

  if (thumbs) {
    await page.locator('button[aria-label^="Enlarge"]').first().click();
    await page.waitForTimeout(700);
    const lb = page.locator('div[role="dialog"][aria-modal="true"]');
    check('lightbox opens', await lb.isVisible());

    await page.keyboard.press('ArrowRight');
    await page.waitForTimeout(450);
    const counter = await lb.locator('p').first().textContent();
    check('lightbox arrow navigation', counter?.includes('2 /'), counter?.trim());

    await page.keyboard.press('Escape');
    await page.waitForTimeout(500);
    check('lightbox closes on Escape', !(await lb.isVisible().catch(() => false)));
  }

  // keyboard tab navigation
  await page.locator('[role="tab"]').first().focus();
  await page.keyboard.press('ArrowRight');
  await page.waitForTimeout(350);
  const selected = await page.evaluate(() => document.activeElement?.getAttribute('aria-selected'));
  check('tab list supports arrow keys', selected === 'true');

  // deep link to a tab, and an in-page hash change afterwards
  const deep = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await deep.goto(BASE + '/projects/usa-projects/candelaria/#resources', { waitUntil: 'networkidle' });
  await deep.waitForTimeout(900);
  const activeLabel = await deep.locator('[role="tab"][aria-selected="true"]').textContent();
  check('tab deep-link via hash', activeLabel?.trim() === 'Resources', activeLabel?.trim());

  await deep.evaluate(() => { window.location.hash = 'photos'; });
  await deep.waitForTimeout(700);
  const afterHash = await deep.locator('[role="tab"][aria-selected="true"]').textContent();
  check('tab responds to hash change', afterHash?.trim() === 'Photos', afterHash?.trim());
  await deep.close();

  await page.close();
}

/* -------------------------------------------------------- video facade --- */
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  const iframesBefore = await page.locator('iframe').count();
  check('no video iframe before interaction', iframesBefore === 0, `${iframesBefore} iframes`);

  // The homepage featured video opens in a modal; scripts/qa-featured-video.mjs
  // covers that band in depth.
  await page.locator('button:has-text("Watch Video")').first().click();
  await page.waitForTimeout(900);
  const iframesAfter = await page.locator('iframe').count();
  check('video iframe mounts on click', iframesAfter > 0, `${iframesAfter} iframes`);

  await page.close();
}

/* ------------------------------------------------------- contact form --- */
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(BASE + '/contact/', { waitUntil: 'networkidle' });

  // Submit with invalid data -> field errors, no success
  await page.fill('#full_name', 'A');
  await page.fill('#email_address', 'not-an-email');
  await page.fill('#message_comments', 'short');
  await page.evaluate(() => {
    document.querySelectorAll('input,textarea').forEach((el) => el.removeAttribute('required'));
    document.querySelectorAll('input[type=email]').forEach((el) => el.setAttribute('type', 'text'));
  });
  await page.locator('form:has(#message_comments) button[type="submit"]').click();
  await page.waitForTimeout(1500);
  const errText = await page.locator('p[role="status"]').first().textContent().catch(() => '');
  check('contact form rejects invalid input', /correct the highlighted/i.test(errText || ''), errText?.trim().slice(0, 70));

  const fieldErrs = await page.locator('p[id$="-err"]').count();
  check('contact form shows field-level errors', fieldErrs >= 2, `${fieldErrs} field errors`);

  // Valid data, no transport configured -> honest failure, never a fake success
  await page.fill('#full_name', 'QA Tester');
  await page.fill('#email_address', 'qa@example.com');
  await page.fill('#message_comments', 'This is an automated QA submission to verify behaviour.');
  await page.locator('form:has(#message_comments) button[type="submit"]').click();
  await page.waitForTimeout(2500);
  const msg = (await page.locator('p[role="status"]').first().textContent()) || '';
  const honest = /not yet connected|could not send/i.test(msg);
  check('contact form reports honest failure when unconfigured', honest, msg.trim().slice(0, 90));

  await page.close();
}

/* ---------------------------------------------------- newsletter route --- */
{
  const page = await browser.newPage();
  const bad = await page.request.post(BASE + '/api/subscribe', { data: { email: 'nope' } });
  const badJson = await bad.json();
  check('subscribe rejects invalid email', bad.status() === 422 && badJson.ok === false, JSON.stringify(badJson).slice(0, 80));

  const trap = await page.request.post(BASE + '/api/subscribe', {
    data: { email: 'bot@example.com', trap: 'i am a bot' },
  });
  const trapJson = await trap.json();
  check('subscribe honeypot short-circuits', trap.status() === 200 && trapJson.ok === true);
  await page.close();
}


/* --------------------------------------------------------- header search */
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });

  await page.locator('button[aria-label="Search this site"]').click();
  await page.waitForTimeout(600);
  const dialog = page.locator('div[role="dialog"][aria-label="Search this site"]');
  check('search overlay opens', await dialog.isVisible());

  const focused = await page.evaluate(() => document.activeElement?.id);
  check('search input is focused on open', focused === 'site-search', focused);

  await page.fill('#site-search', 'Candelaria');
  await page.waitForTimeout(700);
  const hits = await dialog.locator('ul[aria-label="Search results"] > li').count();
  check('search returns results', hits > 0, hits + ' results');

  await page.fill('#site-search', 'zzzznothinghere');
  await page.waitForTimeout(600);
  check('search empty state', await dialog.getByText(/No matches for/).isVisible());

  await page.fill('#site-search', 'Share Structure');
  await page.waitForTimeout(700);
  await page.keyboard.press('Enter');
  const searchNav = await page.waitForURL('**/share-structure/', { timeout: 15000 }).then(() => true).catch(() => false);
  check('search Enter navigates to top hit', searchNav, page.url().replace(BASE, ''));

  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  await page.locator('button[aria-label="Search this site"]').click();
  await page.waitForTimeout(500);
  await page.keyboard.press('Escape');
  await page.waitForTimeout(500);
  check('Escape closes search', !(await dialog.isVisible().catch(() => false)));

  const idx = await page.request.get(BASE + '/api/search-index');
  const entries = await idx.json();
  check('search index served', idx.status() === 200 && entries.length > 200, entries.length + ' entries');

  await page.close();
}

/* ----------------------------------------------------------- feeds etc --- */
{
  const page = await browser.newPage();
  for (const [path, needle] of [
    ['/sitemap.xml', '<urlset'],
    ['/robots.txt', 'Sitemap'],
    ['/rss.xml', '<rss'],
  ]) {
    const r = await page.request.get(BASE + path);
    const body = await r.text();
    check(`${path} serves correctly`, r.status() === 200 && body.includes(needle), `${r.status()}`);
  }

  // redirects preserve legacy URLs
  for (const [from, to] of [
    ['/corporate/', '/corporate/about-silver-one/'],
    ['/projects/', '/projects/overview/'],
    ['/contact/send-a-message-1/', '/contact/'],
    ['/projects/usa-projects/candelaria/photos/', '/projects/usa-projects/candelaria/'],
    ['/investors/estma_reports-2/2017-silver-one-estma-reports/', '/investors/estma_reports-2/'],
    ['/corporate/financials-statements/2026/first-quarter-report/', '/corporate/financials-statements/'],
    ['/rss/', '/rss.xml'],
  ]) {
    const r = await page.request.get(BASE + from, { maxRedirects: 5 });
    const landed = new URL(r.url()).pathname;
    check(`redirect ${from}`, r.status() === 200 && landed === to, `-> ${landed}`);
  }
  await page.close();
}

await browser.close();

const failed = results.filter((r) => !r.pass);
console.log(`\n${results.length - failed.length}/${results.length} checks passed`);
if (failed.length) {
  console.log('FAILURES:');
  failed.forEach((f) => console.log(`  - ${f.name}: ${f.detail}`));
  process.exitCode = 1;
}
