/**
 * Content-completeness audit: compares the migrated content layer against the
 * archived original pages, so nothing is silently dropped.
 */
import fs from 'node:fs';
import path from 'node:path';
import * as cheerio from 'cheerio';

const RAW = process.env.SVE_RAW
  || 'C:/Users/pc/AppData/Local/Temp/claude/c--Users-pc-Desktop-silver-one/81f576a4-0b7d-4d0f-bc1e-80aa93a4b3f5/scratchpad/raw';

const read = (f) => JSON.parse(fs.readFileSync(`src/content/${f}`, 'utf8'));
const news = read('news.json');
const projects = read('projects.json');
const team = read('team.json');
const documents = read('documents.json');
const interviews = read('interviews.json');

const files = fs.readdirSync(RAW).filter((f) => f.endsWith('.html'));
const load = (f) => cheerio.load(fs.readFileSync(path.join(RAW, f), 'utf8'));

let fails = 0;
const check = (label, got, want, note = '') => {
  const ok = got === want;
  if (!ok) fails++;
  console.log(`${ok ? 'ok  ' : 'FAIL'} ${label.padEnd(44)} ${got} / ${want} ${note}`);
};

/* news count */
const originalArticles = files.filter((f) => {
  if (!/^news__\d{4}__/.test(f)) return false;
  return load(f)('#page-body article.uk-article').length > 0;
});
check('news releases migrated', news.length, originalArticles.length);

/* every original article has a slug in the migrated set */
const slugs = new Set(news.map((n) => `${n.year}/${n.slug}`));
const missing = originalArticles
  .map((f) => { const [, y, s] = f.replace(/\.html$/, '').split('__'); return `${y}/${s}`; })
  .filter((k) => !slugs.has(k));
check('no article missing by slug', missing.length, 0, missing.slice(0, 3).join(', '));

/* body text preserved: compare word counts within 2% */
let drifted = [];
for (const f of originalArticles) {
  const [, y, s] = f.replace(/\.html$/, '').split('__');
  const item = news.find((n) => n.year === y && n.slug === s);
  if (!item) continue;
  const $ = load(f);
  const origWords = $('#page-body article.uk-article .uk-text-justify').text().split(/\s+/).filter(Boolean).length;
  const newWords = cheerio.load(item.html, null, false).text().split(/\s+/).filter(Boolean).length;
  if (origWords > 20 && Math.abs(origWords - newWords) / origWords > 0.02) {
    drifted.push(`${y}/${s} ${origWords}->${newWords}`);
  }
}
check('article body word counts preserved', drifted.length, 0, drifted.slice(0, 3).join(' | '));

/* attached PDFs preserved */
let origDocs = 0;
for (const f of originalArticles) origDocs += load(f)('#page-body article.uk-article .uk-card a[href$=".pdf"]').length;
const newDocs = news.reduce((n, a) => n + a.docs.filter((d) => /\.pdf$/i.test(d.href)).length, 0);
check('news PDF attachments preserved', newDocs, origDocs);

/* people */
check('management profiles', team.management.length, load('corporate__management.html')('#page-body .bio').length);
check('director profiles', team.directors.length, load('corporate__directors.html')('#page-body .bio').length);

/* bios: word counts */
let bioDrift = [];
for (const [group, file] of [['management', 'corporate__management.html'], ['directors', 'corporate__directors.html']]) {
  const $ = load(file);
  $('#page-body .bio').each((i, el) => {
    const $el = $(el);
    const name = $el.find('h2').first().text().trim();
    $el.find('h2, h3').remove();
    const orig = $el.text().split(/\s+/).filter(Boolean).length;
    const person = team[group].find((p) => p.name === name);
    if (!person) { bioDrift.push(`${name} MISSING`); return; }
    const got = cheerio.load(person.html, null, false).text().split(/\s+/).filter(Boolean).length;
    if (orig > 20 && Math.abs(orig - got) / orig > 0.02) bioDrift.push(`${name} ${orig}->${got}`);
  });
}
check('biography text preserved', bioDrift.length, 0, bioDrift.slice(0, 3).join(' | '));

/* documents: every PDF linked on an original listing page is in the library */
const listingPages = [
  'corporate__financials-statements.html',
  'investors__estma_reports-2.html',
  'investors__presentations.html',
  'investors__factsheets.html',
  'investors__agm-material.html',
  'investors__life.html',
];
const origPdfs = new Set();
for (const f of listingPages) {
  const $ = load(f);
  $('#page-body a[href$=".pdf"]').each((_, a) =>
    // Some listings link the same file both relatively and absolutely.
    origPdfs.add(
      $(a).attr('href')
        .replace(/^https?:\/\/(www\.)?silverone\.com/, '')
        .replace('/site/assets/', '/assets/')
    )
  );
}
const libPdfs = new Set();
for (const rows of Object.values(documents)) for (const r of rows) for (const l of r.links) libPdfs.add(l.href);
const lost = [...origPdfs].filter((p) => !libPdfs.has(p));
check('listed PDFs present in library', lost.length, 0, lost.slice(0, 3).join(', '));

/* projects */
check('projects migrated', projects.length, 3);
const origTabs = {
  candelaria: load('projects__usa-projects__candelaria.html')('#page-body ul.uk-switcher > li').length,
  cherokee: load('projects__usa-projects__cherokee.html')('#page-body ul.uk-switcher > li').length,
  silver_phoenix: load('projects__usa-projects__silver_phoenix.html')('#page-body ul.uk-switcher > li').length,
};
for (const p of projects) check(`  ${p.name} sections`, p.tabs.length, origTabs[p.slug]);

/* interviews */
const origVids = new Set();
{
  const $ = load('investors__interviews.html');
  $('#page-body a[href*="youtu"]').each((_, a) => {
    const t = $(a).text().replace(/\s+/g, ' ').trim();
    if (t && !/^[A-Za-z]+ \d{1,2},? \d{4}$/.test(t)) origVids.add(t);
  });
}
check('interviews migrated', interviews.length, origVids.size);

/* every migrated asset reference exists on disk */
const allRefs = new Set();
const walk = (v) => {
  if (typeof v === 'string') { for (const m of v.matchAll(/(?:href|src)="(\/assets\/[^"]+)"/g)) allRefs.add(m[1]); }
  else if (Array.isArray(v)) v.forEach(walk);
  else if (v && typeof v === 'object') Object.values(v).forEach(walk);
};
['news.json','pages.json','projects.json','team.json','home.json','documents.json'].forEach((f) => walk(read(f)));
const absent = [...allRefs].filter((r) => !fs.existsSync(path.join('public', decodeURIComponent(r).replace(/^\//, ''))));
check('referenced assets exist on disk', absent.length, 0, absent.slice(0, 3).join(', '));

console.log(`\n${fails === 0 ? 'CONTENT AUDIT PASSED' : fails + ' CHECK(S) FAILED'}`);
process.exitCode = fails ? 1 : 0;
