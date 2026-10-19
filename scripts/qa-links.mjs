/**
 * Crawls every internal page, collects every href and <img src>, and checks
 * that each one resolves. External links are reported separately and only
 * spot-checked, since third parties rate-limit automated requests.
 */
import { chromium } from 'playwright';
import fs from 'node:fs';

const BASE = process.env.QA_BASE || 'http://localhost:3000';
const news = JSON.parse(fs.readFileSync('src/content/news.json', 'utf8'));
const team = JSON.parse(fs.readFileSync('src/content/team.json', 'utf8'));

const pages = [
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
  ...news.map((n) => `/news/${n.year}/${n.slug}/`),
  '/contact/',
  '/contact/subscribe-for-email-updates/',
  '/disclaimer/',
];

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();

const internal = new Map(); // url -> Set(source pages)
const external = new Map();
const images = new Map();

console.log(`collecting links from ${pages.length} pages…`);
let n = 0;
for (const route of pages) {
  await page.goto(BASE + route, { waitUntil: 'domcontentloaded', timeout: 45_000 });
  const found = await page.evaluate(() => ({
    hrefs: [...document.querySelectorAll('a[href]')].map((a) => a.getAttribute('href')),
    imgs: [...document.querySelectorAll('img')].map((i) => i.getAttribute('src')),
  }));

  for (const h of found.hrefs) {
    if (!h || h.startsWith('#') || h.startsWith('mailto:') || h.startsWith('tel:')) continue;
    const map = /^https?:\/\//i.test(h) ? external : internal;
    if (!map.has(h)) map.set(h, new Set());
    map.get(h).add(route);
  }
  for (const s of found.imgs) {
    if (!s) continue;
    // next/image rewrites to /_next/image?url=…
    const m = s.match(/[?&]url=([^&]+)/);
    const real = m ? decodeURIComponent(m[1]) : s;
    if (real.startsWith('/')) {
      if (!images.has(real)) images.set(real, new Set());
      images.get(real).add(route);
    }
  }
  if (++n % 25 === 0) process.stderr.write(`  ${n}/${pages.length}\n`);
}
await page.close();

console.log(`\nunique internal links: ${internal.size}`);
console.log(`unique images: ${images.size}`);
console.log(`unique external links: ${external.size}`);

const checker = await ctx.newPage();
const broken = [];

async function verify(url, sources, kind) {
  const target = url.startsWith('/') ? BASE + url.split('#')[0] : url;
  try {
    const res = await checker.request.get(target, { maxRedirects: 5, timeout: 30_000 });
    if (res.status() >= 400) {
      broken.push({ kind, url, status: res.status(), from: [...sources].slice(0, 3) });
    }
  } catch (e) {
    broken.push({ kind, url, status: String(e.message).slice(0, 60), from: [...sources].slice(0, 3) });
  }
}

console.log('\nverifying internal links…');
for (const [url, src] of internal) await verify(url, src, 'link');
console.log('verifying images…');
for (const [url, src] of images) await verify(url, src, 'image');

await checker.close();
await browser.close();

if (!broken.length) {
  console.log(`\nALL ${internal.size + images.size} INTERNAL LINKS AND IMAGES RESOLVE`);
} else {
  console.log(`\n${broken.length} BROKEN:`);
  broken.forEach((b) => console.log(`  [${b.kind}] ${b.status} ${b.url}\n       from: ${b.from.join(', ')}`));
}

fs.writeFileSync(
  '.qa/links.json',
  JSON.stringify({ broken, externalLinks: [...external.keys()].sort() }, null, 1)
);
console.log(`\nexternal links written to .qa/links.json (${external.size})`);
