#!/usr/bin/env node
/**
 * hover-probe — hovers every visible link and button in the design and in the
 * build and compares the hover styles (text colour, background, border,
 * transform, shadow). Elements are paired by their visible text, in order.
 *
 *   node tools/hover-probe.mjs <file.dc.html> <url> [width=1440] [--all]
 *
 * Prints only mismatches unless --all is given.
 */
import { chromium } from 'playwright-core';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

const args = process.argv.slice(2);
const [file, url, widthArg] = args;
const width = Number(widthArg && !widthArg.startsWith('--') ? widthArg : 1440);
const showAll = args.includes('--all');
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

const PROPS = ['color', 'backgroundColor', 'borderTopColor', 'transform', 'boxShadow'];

async function open(browser, target, isDesign) {
  const page = await browser.newPage({ viewport: { width, height: 900 } });
  if (isDesign) {
    await page.route('http://design.local/**', async (route) => {
      const abs = path.join(root, decodeURIComponent(new URL(route.request().url()).pathname.slice(1)));
      try {
        route.fulfill({ body: await readFile(abs), contentType: types[path.extname(abs).slice(1)] ?? 'application/octet-stream' });
      } catch {
        route.fulfill({ status: 404 });
      }
    });
  }
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
  // The design's hover booster re-runs for ~4s after load; wait it out.
  await page.waitForTimeout(isDesign ? 4500 : 800);
  await page.addStyleTag({ content: '*,*::before,*::after{transition:none!important;animation-play-state:paused!important}' });
  await page.evaluate(() => {
    document.querySelectorAll('a,button').forEach((el, i) => el.setAttribute('data-probe', String(i)));
  });
  const items = await page.evaluate(() =>
    [...document.querySelectorAll('a,button')]
      .filter((el) => {
        const r = el.getBoundingClientRect();
        const cs = getComputedStyle(el);
        return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden';
      })
      .map((el) => ({
        id: el.getAttribute('data-probe'),
        text: (el.textContent || el.getAttribute('aria-label') || '').replace(/\s+/g, ' ').trim().slice(0, 50),
      })),
  );
  return { page, items };
}

async function hoverStyles(page, id) {
  const loc = page.locator(`[data-probe="${id}"]`);
  await loc.scrollIntoViewIfNeeded();
  await page.mouse.move(1, 1);
  const read = () => loc.evaluate((el, props) => Object.fromEntries(props.map((p) => [p, getComputedStyle(el)[p]])), PROPS);
  const before = await read();
  await loc.hover({ force: true });
  await page.waitForTimeout(60);
  const after = await read();
  await page.mouse.move(1, 1);
  return { before, after };
}

const browser = await chromium.launch();
const [d, b] = await Promise.all([open(browser, file, true), open(browser, url, false)]);
const used = new Set();
let mismatches = 0;
for (const di of d.items) {
  const bi = b.items.find((x) => !used.has(x.id) && x.text === di.text);
  if (!bi) {
    if (showAll) console.log(`  ? no build match for "${di.text}"`);
    continue;
  }
  used.add(bi.id);
  const [ds, bs] = [await hoverStyles(d.page, di.id), await hoverStyles(b.page, bi.id)];
  const diffs = PROPS.filter((p) => ds.after[p] !== bs.after[p]);
  if (diffs.length) {
    mismatches++;
    console.log(`✗ "${di.text}"`);
    for (const p of diffs) console.log(`    ${p}: design ${ds.after[p]}  |  build ${bs.after[p]}`);
  } else if (showAll) console.log(`✓ "${di.text}"`);
}
console.log(`\n${mismatches} hover mismatch(es) across ${used.size} matched elements at ${width}px`);
await browser.close();
