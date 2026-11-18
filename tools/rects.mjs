// Prints bounding boxes + key computed styles for elements matching a CSS selector in the design and the build.
// Usage: node tools/rects.mjs <file.dc.html> <url> "<selector>" [width]
import { chromium } from 'playwright-core';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
const [file, url, selector, width = '1440'] = process.argv.slice(2);
const root = path.resolve('design-reference');
const types = {
  html: 'text/html',
  js: 'text/javascript',
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  webp: 'image/webp',
  svg: 'image/svg+xml',
  json: 'application/json',
};
const browser = await chromium.launch();
async function run(target, isDesign) {
  const page = await browser.newPage({ viewport: { width: Number(width), height: 900 } });
  if (isDesign)
    await page.route('http://design.local/**', async (route) => {
      const abs = path.join(root, decodeURIComponent(new URL(route.request().url()).pathname.slice(1)));
      try {
        route.fulfill({ body: await readFile(abs), contentType: types[path.extname(abs).slice(1)] ?? 'application/octet-stream' });
      } catch {
        route.fulfill({ status: 404 });
      }
    });
  await page.goto(
    isDesign
      ? 'http://design.local/' +
          target
            .split('#')
            .map((p, i) => (i ? p : encodeURIComponent(p)))
            .join('#')
      : target,
    { waitUntil: 'networkidle' },
  );
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(500);
  const out = await page.evaluate(
    (sel) =>
      [...document.querySelectorAll(sel)].slice(0, 30).map((el) => {
        const r = el.getBoundingClientRect();
        const cs = getComputedStyle(el);
        return `${el.tagName.toLowerCase()} x${r.x.toFixed(1)} y${(r.y + scrollY).toFixed(1)} w${r.width.toFixed(1)} h${r.height.toFixed(1)} font:${cs.fontFamily.split(',')[0]} ${cs.fontSize}/${cs.lineHeight} ${cs.fontWeight} "${(el.textContent || el.getAttribute('alt') || '').trim().replace(/\s+/g, ' ').slice(0, 30)}"`;
      }),
    selector,
  );
  await page.close();
  return out;
}
const [d, b] = await Promise.all([run(file, true), run(url, false)]);
const n = Math.max(d.length, b.length);
for (let i = 0; i < n; i++) console.log(`D ${d[i] ?? '-'}\nB ${b[i] ?? '-'}\n`);
await browser.close();
