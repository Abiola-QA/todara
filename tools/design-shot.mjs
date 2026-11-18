// Renders a Claude Design (.dc.html) file from design-reference/ in headless Chromium.
// Usage: node tools/design-shot.mjs <file.dc.html> <width> <out.png> [--boxes]
import { chromium } from 'playwright-core';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

const [file, width = '1440', out = 'shot.png'] = process.argv.slice(2);
const root = path.resolve('design-reference');
const types = {
  html: 'text/html',
  js: 'text/javascript',
  jsx: 'text/javascript',
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  webp: 'image/webp',
  svg: 'image/svg+xml',
  json: 'application/json',
  pdf: 'application/pdf',
  css: 'text/css',
};

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: Number(width), height: 900 } });
await page.route('http://design.local/**', async (route) => {
  const rel = decodeURIComponent(new URL(route.request().url()).pathname.slice(1));
  const abs = path.join(root, rel);
  if (!abs.startsWith(root)) return route.abort();
  try {
    const body = await readFile(abs);
    route.fulfill({ body, contentType: types[path.extname(abs).slice(1).toLowerCase()] ?? 'application/octet-stream' });
  } catch {
    route.fulfill({ status: 404, body: 'not found' });
  }
});
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
page.on('requestfailed', (r) => errors.push('failed ' + r.url()));
await page.goto(
  'http://design.local/' +
    file
      .split('#')
      .map((p, i) => (i ? p : encodeURIComponent(p)))
      .join('#'),
  { waitUntil: 'networkidle' },
);
await page.waitForTimeout(1500);
await page.evaluate(() => document.fonts.ready);
const info = await page.evaluate(() => ({ h: document.documentElement.scrollHeight, title: document.title }));
await page.screenshot({ path: out, fullPage: true, animations: 'disabled' });
console.log(JSON.stringify({ ...info, errors }));
await browser.close();
