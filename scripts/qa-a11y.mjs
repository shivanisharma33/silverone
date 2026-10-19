/**
 * Accessibility audit: runs axe-core (WCAG 2.1 A/AA) against a representative
 * page from every template, plus the open states of the modal UIs.
 */
import { chromium } from 'playwright';
import { AxeBuilder } from '@axe-core/playwright';
import fs from 'node:fs';

const BASE = process.env.QA_BASE || 'http://localhost:3000';
const ROUTES = [
  '/',
  '/corporate/about-silver-one/',
  '/corporate/management/',
  '/corporate/management/gregory-crowe/',
  '/corporate/financials-statements/',
  '/projects/overview/',
  '/projects/usa-projects/',
  '/projects/usa-projects/candelaria/',
  '/investors/',
  '/investors/why-silver/',
  '/investors/overview/',
  '/investors/share-structure/',
  '/investors/interviews/',
  '/investors/presentations/',
  '/documents/',
  '/news/',
  '/news/2026/',
  '/contact/',
  '/contact/subscribe-for-email-updates/',
  '/disclaimer/',
  '/this-page-does-not-exist/',
];

const TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'];
const browser = await chromium.launch();
const ctxDesktop = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const ctxMobile = await browser.newContext({ viewport: { width: 390, height: 844 } });
const all = [];

for (const route of ROUTES) {
  const page = await ctxDesktop.newPage();
  await page.goto(BASE + route, { waitUntil: 'networkidle', timeout: 60_000 }).catch(() => {});
  await page.waitForTimeout(600);
  const r = await new AxeBuilder({ page }).withTags(TAGS).analyze();
  for (const v of r.violations) {
    all.push({ route, id: v.id, impact: v.impact, help: v.help, nodes: v.nodes.length,
      sample: v.nodes[0]?.html?.slice(0, 130) });
  }
  console.log(`${r.violations.length ? 'X' : 'ok'}  ${route}${r.violations.length ? ' — ' + r.violations.map((v) => v.id).join(', ') : ''}`);
  await page.close();
}

// Open states
const page = await ctxMobile.newPage();
await page.goto(BASE + '/', { waitUntil: 'networkidle' });
await page.locator('button[aria-label="Open navigation menu"]').click();
await page.waitForTimeout(700);
{
  const r = await new AxeBuilder({ page }).withTags(TAGS).analyze();
  r.violations.forEach((v) => all.push({ route: 'mobile drawer open', id: v.id, impact: v.impact, help: v.help, nodes: v.nodes.length, sample: v.nodes[0]?.html?.slice(0,130) }));
  console.log(`${r.violations.length ? 'X' : 'ok'}  mobile drawer open${r.violations.length ? ' — ' + r.violations.map(v=>v.id).join(', ') : ''}`);
}
await page.close();

const lb = await ctxDesktop.newPage();
await lb.goto(BASE + '/projects/usa-projects/candelaria/#photos', { waitUntil: 'networkidle' });
await lb.waitForTimeout(900);
await lb.locator('button[aria-label^="Enlarge"]').first().click();
await lb.waitForTimeout(800);
{
  const r = await new AxeBuilder({ page: lb }).withTags(TAGS).analyze();
  r.violations.forEach((v) => all.push({ route: 'gallery lightbox open', id: v.id, impact: v.impact, help: v.help, nodes: v.nodes.length, sample: v.nodes[0]?.html?.slice(0,130) }));
  console.log(`${r.violations.length ? 'X' : 'ok'}  gallery lightbox open${r.violations.length ? ' — ' + r.violations.map(v=>v.id).join(', ') : ''}`);
}
await lb.close();


const so = await ctxDesktop.newPage();
await so.goto(BASE + '/', { waitUntil: 'networkidle' });
await so.locator('button[aria-label="Search this site"]').click();
await so.waitForTimeout(600);
await so.fill('#site-search', 'Candelaria');
await so.waitForTimeout(700);
{
  const r = await new AxeBuilder({ page: so }).withTags(TAGS).analyze();
  r.violations.forEach((v) => all.push({ route: 'search overlay open', id: v.id, impact: v.impact, help: v.help, nodes: v.nodes.length, sample: v.nodes[0]?.html?.slice(0,130) }));
  console.log(
    `${r.violations.length ? 'X' : 'ok'}  search overlay open` +
      (r.violations.length ? ' — ' + r.violations.map((v) => v.id).join(', ') : '')
  );
}
await so.close();


const vm = await ctxDesktop.newPage();
await vm.goto(BASE + '/', { waitUntil: 'networkidle' });
await vm.locator('button:has-text("Watch Video")').click();
await vm.waitForTimeout(800);
{
  // Exclude the embedded player: the violations inside it are YouTube's
  // own chrome, not markup this project controls.
  const r = await new AxeBuilder({ page: vm }).withTags(TAGS).exclude('iframe').analyze();
  r.violations.forEach((v) => all.push({ route: 'featured video modal', id: v.id, impact: v.impact, help: v.help, nodes: v.nodes.length, sample: v.nodes[0]?.html?.slice(0,130) }));
  console.log((r.violations.length ? 'X' : 'ok') + '  featured video modal' + (r.violations.length ? ' — ' + r.violations.map(v=>v.id).join(', ') : ''));
}
await vm.close();

await ctxDesktop.close();
await ctxMobile.close();
await browser.close();

fs.writeFileSync('.qa/a11y.json', JSON.stringify(all, null, 1));
console.log(`\n${all.length} violation instances`);
if (all.length) {
  const byId = {};
  all.forEach((v) => { (byId[v.id] ||= []).push(v); });
  for (const [id, list] of Object.entries(byId)) {
    console.log(`\n[${list[0].impact}] ${id} — ${list[0].help}`);
    console.log(`  pages: ${list.map((l) => l.route).join(', ')}`);
    console.log(`  e.g.  ${list[0].sample}`);
  }
}
