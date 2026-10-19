/**
 * Derives display crops from original Silver One banners that were authored
 * with a large empty gradient beneath the photograph. The pixels are the
 * originals, unaltered — only the empty area is removed so the image can be
 * used in a landscape card without showing grey.
 */
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const CROPS = [
  {
    src: 'public/assets/files/2473/silver_one_phoenix.jpg',
    out: 'public/assets/derived/phoenix-silver-specimens.jpg',
    // Photograph occupies the top ~49% of the 1310x1445 banner.
    region: { left: 0, top: 10, width: 1310, height: 690 },
  },
  {
    src: 'public/assets/files/1053/corp-bg.jpg',
    out: 'public/assets/derived/corporate-banner.jpg',
    region: { left: 0, top: 0, width: 1298, height: 700 },
  },
];

for (const c of CROPS) {
  if (!fs.existsSync(c.src)) {
    console.log('skip (missing source):', c.src);
    continue;
  }
  const meta = await sharp(c.src).metadata();
  const region = {
    left: c.region.left,
    top: c.region.top,
    width: Math.min(c.region.width, (meta.width ?? 0) - c.region.left),
    height: Math.min(c.region.height, (meta.height ?? 0) - c.region.top),
  };
  fs.mkdirSync(path.dirname(c.out), { recursive: true });
  await sharp(c.src).extract(region).jpeg({ quality: 88, mozjpeg: true }).toFile(c.out);
  const m2 = await sharp(c.out).metadata();
  console.log(`${c.out}  ${m2.width}x${m2.height}`);
}
