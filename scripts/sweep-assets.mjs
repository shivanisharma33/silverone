/**
 * Belt-and-braces asset sweep: scans every archived page for *any* reference to
 * /site/assets or /site/templates (src, href, srcset, inline CSS url(...)),
 * then downloads anything not already present in public/.
 */
import fs from 'node:fs';
import path from 'node:path';

const RAW = process.env.SVE_RAW
  || 'C:/Users/pc/AppData/Local/Temp/claude/c--Users-pc-Desktop-silver-one/81f576a4-0b7d-4d0f-bc1e-80aa93a4b3f5/scratchpad/raw';
const PUB = path.join(process.cwd(), 'public');

const refs = new Set();
for (const f of fs.readdirSync(RAW).filter((n) => n.endsWith('.html'))) {
  const html = fs.readFileSync(path.join(RAW, f), 'utf8');
  for (const m of html.matchAll(/\/site\/(?:assets|templates)\/[A-Za-z0-9._\-/%]+/g)) {
    refs.add(m[0].replace(/[.,)'"]+$/, ''));
  }
}

const toLocal = (p) =>
  p.startsWith('/site/assets/')
    ? p.replace('/site/assets/', '/assets/')
    : p.replace('/site/templates/img/', '/brand/');

const wanted = [...refs].filter((p) => /\.(jpe?g|png|gif|webp|svg|pdf)$/i.test(p));
const missing = wanted.filter((p) => !fs.existsSync(path.join(PUB, toLocal(p).replace(/^\//, ''))));

console.log(`referenced: ${wanted.length}  already local: ${wanted.length - missing.length}  missing: ${missing.length}`);

let ok = 0;
const failed = [];
let i = 0;
async function worker() {
  while (i < missing.length) {
    const p = missing[i++];
    const dest = path.join(PUB, toLocal(p).replace(/^\//, ''));
    let done = false;
    for (const base of ['https://silverone.com', 'https://www.silverone.com']) {
      if (done) break;
      try {
        const r = await fetch(base + p, { headers: { 'User-Agent': 'Mozilla/5.0' } });
        if (!r.ok) continue;
        const b = Buffer.from(await r.arrayBuffer());
        if (b.length < 100) continue;
        fs.mkdirSync(path.dirname(dest), { recursive: true });
        fs.writeFileSync(dest, b);
        ok++;
        done = true;
      } catch {
        /* try next base */
      }
    }
    if (!done) failed.push(p);
  }
}
await Promise.all(Array.from({ length: 8 }, worker));

console.log(`downloaded ${ok}, failed ${failed.length}`);
failed.forEach((f) => console.log('  FAIL', f));
