/**
 * Reports the on-page geometry of each homepage band so the layout can be
 * compared numerically against the approved reference screenshot.
 */
import { chromium } from 'playwright';


const W = Number(process.env.QA_W || 1536);
const H = Number(process.env.QA_H || 1024);
const BASE = process.env.QA_BASE || 'http://localhost:3000';

const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: W, height: H } });
const p = await ctx.newPage();
await p.goto(BASE + '/', { waitUntil: 'networkidle' });
// settle reveals without resizing the viewport
await p.evaluate(async () => {
  await new Promise((r) => {
    let y = 0;
    const step = () => {
      y += window.innerHeight * 0.75;
      window.scrollTo(0, y);
      if (y < document.body.scrollHeight) setTimeout(step, 90);
      else { window.scrollTo(0, 0); setTimeout(r, 400); }
    };
    step();
  });
});
await p.waitForTimeout(600);

const data = await p.evaluate(() => {
  const out = [];
  const add = (label, el) => {
    if (!el) { out.push({ label, missing: true }); return; }
    const r = el.getBoundingClientRect();
    out.push({
      label,
      top: Math.round(r.top + window.scrollY),
      height: Math.round(r.height),
      left: Math.round(r.left),
      width: Math.round(r.width),
    });
  };
  add('header', document.querySelector('header'));
  const main = document.querySelector('main');
  [...(main?.children || [])].forEach((el, i) => {
    const h2 = el.querySelector('h1,h2');
    add(`main>${i} ${el.tagName.toLowerCase()} "${(h2?.textContent || '').trim().slice(0, 26)}"`, el);
  });
  add('footer', document.querySelector('footer'));

  const h1 = document.querySelector('main h1');
  const cs = h1 ? getComputedStyle(h1) : null;
  return {
    bands: out,
    docHeight: document.body.scrollHeight,
    h1: cs ? { size: cs.fontSize, lh: cs.lineHeight, family: cs.fontFamily.split(',')[0] } : null,
    shellWidth: (() => { const s = document.querySelector('.shell'); return s ? Math.round(s.getBoundingClientRect().width) : null; })(),
  };
});

console.log(`viewport ${W}x${H}   document height ${data.docHeight}px   .shell width ${data.shellWidth}px`);
console.log(`h1: ${JSON.stringify(data.h1)}`);
console.log('');
for (const b of data.bands) {
  if (b.missing) { console.log(`  ${b.label.padEnd(46)} MISSING`); continue; }
  console.log(`  ${b.label.padEnd(46)} y ${String(b.top).padStart(5)} → ${String(b.top + b.height).padStart(5)}   h ${String(b.height).padStart(4)}   x ${b.left}..${b.left + b.width} (w ${b.width})`);
}
await p.screenshot({ path: '.qa/current_1536.png' });
console.log('\nviewport screenshot -> .qa/current_1536.png');
await b.close();
