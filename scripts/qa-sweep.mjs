/**
 * Crawls every route against the running server and reports, per page:
 * HTTP status, console errors, failed same-origin requests, horizontal
 * overflow, heading-order problems, images missing alt text, and links that
 * resolve to nothing. Run the production server first.
 */
import { chromium } from 'playwright';
import fs from 'node:fs';

const BASE = process.env.QA_BASE || 'http://localhost:3000';
const WIDTHS = process.env.QA_WIDTHS ? process.env.QA_WIDTHS.split(',').map(Number) : [1440];

const news = JSON.parse(fs.readFileSync('src/content/news.json', 'utf8'));
const team = JSON.parse(fs.readFileSync('src/content/team.json', 'utf8'));

const ROUTES = [
  '/',
  '/corporate/about-silver-one/',
  '/corporate/management/',
  '/corporate/directors/',
  '/corporate/financials-statements/',
  ...team.management.map((p) => `/corporate/management/${p.slug}/`),
  ...team.directors.map((p) => `/corporate/directors/${p.slug}/`),
  '/projects/overview/',
  '/projects/usa-projects/',
  '/projects/usa-projects/candelaria/',
  '/projects/usa-projects/cherokee/',
  '/projects/usa-projects/silver_phoenix/',
  '/investors/',
  '/investors/why-silver/',
  '/investors/overview/',
  '/investors/share-structure/',
  '/investors/interviews/',
  '/investors/presentations/',
  '/investors/factsheets/',
  '/investors/agm-material/',
  '/investors/estma_reports-2/',
  '/investors/life/',
  '/documents/',
  '/news/',
  ...[...new Set(news.map((n) => n.year))].map((y) => `/news/${y}/`),
  `/news/${news[0].year}/${news[0].slug}/`,
  `/news/${news[70].year}/${news[70].slug}/`,
  `/news/${news[news.length - 1].year}/${news[news.length - 1].slug}/`,
  '/contact/',
  '/contact/subscribe-for-email-updates/',
  '/disclaimer/',
  '/this-page-does-not-exist/',
];

const browser = await chromium.launch();
const problems = [];
let checked = 0;

for (const width of WIDTHS) {
  const ctx = await browser.newContext({ viewport: { width, height: 900 } });
  for (const route of ROUTES) {
    const page = await ctx.newPage();
    const errors = [];
    const failed = [];
    page.on('console', (m) => m.type() === 'error' && errors.push(m.text().slice(0, 200)));
    page.on('pageerror', (e) => errors.push('PAGEERROR ' + String(e).slice(0, 200)));
    page.on('response', (r) => {
      if (r.status() >= 400 && r.url().startsWith(BASE) && !r.url().includes('does-not-exist')) {
        failed.push(`${r.status()} ${r.url().replace(BASE, '')}`);
      }
    });

    let status = 0;
    try {
      const res = await page.goto(BASE + route, { waitUntil: 'domcontentloaded', timeout: 60_000 });
      status = res?.status() ?? 0;
      await page.waitForLoadState('networkidle', { timeout: 25_000 }).catch(() => {});
      await page.waitForTimeout(250);
    } catch (e) {
      problems.push({ route, width, kind: 'navigation', detail: String(e).slice(0, 160) });
      await page.close();
      continue;
    }

    const audit = await page.evaluate(() => {
      const overflow =
        document.documentElement.scrollWidth - document.documentElement.clientWidth;

      const h1s = document.querySelectorAll('main h1').length;

      const noAlt = [...document.querySelectorAll('main img')].filter(
        (i) => i.getAttribute('alt') === null
      ).length;

      const levels = [...document.querySelectorAll('main h1,main h2,main h3,main h4')].map((h) =>
        Number(h.tagName[1])
      );
      let skips = 0;
      for (let i = 1; i < levels.length; i++) if (levels[i] - levels[i - 1] > 1) skips++;

      const emptyLinks = [...document.querySelectorAll('a')].filter((a) => {
        const href = a.getAttribute('href');
        return !href || href === '#' || href === '';
      }).length;

      const badInternal = [...document.querySelectorAll('a[href^="/site/"]')].length;

      return { overflow, h1s, noAlt, skips, emptyLinks, badInternal, title: document.title };
    });

    if (status !== (route.includes('does-not-exist') ? 404 : 200)) {
      problems.push({ route, width, kind: 'status', detail: String(status) });
    }
    if (errors.length) problems.push({ route, width, kind: 'console', detail: [...new Set(errors)].join(' | ').slice(0, 300) });
    if (failed.length) problems.push({ route, width, kind: 'request', detail: [...new Set(failed)].slice(0, 6).join(' | ') });
    if (audit.overflow > 1) problems.push({ route, width, kind: 'overflow-x', detail: `${audit.overflow}px` });
    if (audit.h1s !== 1) problems.push({ route, width, kind: 'h1-count', detail: String(audit.h1s) });
    if (audit.noAlt) problems.push({ route, width, kind: 'img-no-alt', detail: String(audit.noAlt) });
    if (audit.skips) problems.push({ route, width, kind: 'heading-skip', detail: String(audit.skips) });
    if (audit.emptyLinks) problems.push({ route, width, kind: 'empty-href', detail: String(audit.emptyLinks) });
    if (audit.badInternal) problems.push({ route, width, kind: 'legacy-href', detail: String(audit.badInternal) });
    if (!audit.title || audit.title.length < 8) problems.push({ route, width, kind: 'title', detail: audit.title });

    checked++;
    await page.close();
  }
  await ctx.close();
}

await browser.close();

console.log(`checked ${checked} page loads across widths ${WIDTHS.join(', ')}`);
if (!problems.length) {
  console.log('NO PROBLEMS FOUND');
} else {
  const byKind = problems.reduce((a, p) => ((a[p.kind] = (a[p.kind] || 0) + 1), a), {});
  console.log('problems by kind:', JSON.stringify(byKind));
  for (const p of problems) console.log(`  [${p.kind}] ${p.width}px ${p.route} -> ${p.detail}`);
}
fs.writeFileSync('.qa/sweep.json', JSON.stringify(problems, null, 1));
