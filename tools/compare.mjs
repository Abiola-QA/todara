#!/usr/bin/env node
/**
 * compare — renders a design page and the built page side by side and reports,
 * block by block (outermost <header>/<section>/<footer>), where they differ.
 *
 *   node tools/compare.mjs <file.dc.html> <url> [--widths 1440,768,390] [--out dir] [--block N]
 *
 * Prints, per width: page heights, then each block's top/height in both and the
 * share of differing pixels. Writes full-page screenshots and, for blocks that
 * differ, a side-by-side PNG (design | build | diff) into --out.
 * Animations are paused and the marquee/scan keyframes frozen so runs are stable.
 */
import { chromium } from 'playwright-core';
import { readFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';

const args = process.argv.slice(2);
const [designFile, url] = args;
const opt = (k, d) => (args.includes(k) ? args[args.indexOf(k) + 1] : d);
const widths = opt('--widths', '1440,768,390').split(',').map(Number);
const outDir = path.resolve(opt('--out', '.compare'));
const onlyBlock = opt('--block');
const tail = Number(opt('--tail', 0)); // compare only the last N blocks, aligned from the end
const keepFixed = args.includes('--keep-fixed'); // keep floating overlays in the screenshots
// --init <file.js>: script run in both pages before any page script (e.g. seed localStorage).
// --eval "<js>": run in both pages after load (e.g. click a button), then wait for the UI to settle.
const initFile = opt('--init');
const evalJs = opt('--eval');
if (!designFile || !url) {
  console.error('usage: compare <file.dc.html> <url> [--widths 1440,768,390] [--out dir] [--block N]');
  process.exit(1);
}
await mkdir(outDir, { recursive: true });

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

const FREEZE = `*,*::before,*::after{animation-play-state:paused!important;animation-delay:-0.0001s!important;transition:none!important;caret-color:transparent!important;scroll-behavior:auto!important}`;

const blocksScript = () => {
  const sel = 'header, section, footer, [data-compare-block]';
  const all = [...document.querySelectorAll(sel)].filter((el) => {
    const r = el.getBoundingClientRect();
    if (r.height < 4 || r.width < 50) return false;
    let p = el.parentElement;
    while (p) {
      if (p.matches?.(sel)) return false;
      p = p.parentElement;
    }
    return true;
  });
  return all.map((el) => {
    const r = el.getBoundingClientRect();
    const label = (el.querySelector('h1,h2,h3,p')?.textContent || el.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 48);
    return { tag: el.tagName.toLowerCase(), top: Math.round(r.top + scrollY), height: Math.round(r.height), label };
  });
};

async function render(browser, target, width, isDesign) {
  const page = await browser.newPage({ viewport: { width, height: 900 }, deviceScaleFactor: 1 });
  if (isDesign) {
    await page.route('http://design.local/**', async (route) => {
      const rel = decodeURIComponent(new URL(route.request().url()).pathname.slice(1));
      const abs = path.join(root, rel);
      if (!abs.startsWith(root)) return route.abort();
      try {
        route.fulfill({ body: await readFile(abs), contentType: types[path.extname(abs).slice(1).toLowerCase()] ?? 'application/octet-stream' });
      } catch {
        route.fulfill({ status: 404, body: 'not found' });
      }
    });
  }
  if (initFile) await page.addInitScript({ path: path.resolve(initFile) });
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
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
  if (evalJs) {
    await page.waitForTimeout(600);
    await page.evaluate(evalJs);
    await page.waitForTimeout(600);
  }
  await page.addStyleTag({ content: FREEZE });
  // Rewind every running animation to its first frame so both pages are captured at the same moment.
  await page.evaluate(() =>
    document.getAnimations().forEach((a) => {
      a.pause();
      a.currentTime = 0;
    }),
  );
  await page.evaluate(() => document.fonts.ready);
  // load lazy images by scrolling through the page
  await page.evaluate(async () => {
    for (let y = 0; y < document.documentElement.scrollHeight; y += 600) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 40));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(800);
  // Floating overlays (cookie banner, WhatsApp button, mobile action bar, toast) sit at viewport positions,
  // so on pages of different lengths they land on different content. Hide them unless --keep-fixed.
  if (!keepFixed) {
    await page.evaluate(() => {
      for (const el of document.querySelectorAll('body *')) {
        if (getComputedStyle(el).position === 'fixed') el.style.setProperty('visibility', 'hidden', 'important');
      }
    });
  }
  const blocks = await page.evaluate(blocksScript);
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  const shot = await page.screenshot({ fullPage: true });
  await page.close();
  return { blocks, height, shot, errors };
}

async function cropPng(buf, top, height, width) {
  const meta = await sharp(buf).metadata();
  const h = Math.max(1, Math.min(height, meta.height - top));
  return sharp(buf)
    .extract({ left: 0, top: Math.min(top, meta.height - 1), width: Math.min(width, meta.width), height: h })
    .png()
    .toBuffer();
}

const browser = await chromium.launch();
const slugName = designFile.replace(/\.dc\.html$|\.html$/, '').replace(/[^\w-]+/g, '_');
let worst = 0;
for (const width of widths) {
  const [d, b] = await Promise.all([render(browser, designFile, width, true), render(browser, url, width, false)]);
  await sharp(d.shot).toFile(path.join(outDir, `${slugName}-${width}-design.png`));
  await sharp(b.shot).toFile(path.join(outDir, `${slugName}-${width}-build.png`));
  console.log(`\n=== ${width}px  design ${d.height}px | build ${b.height}px  (Δ ${b.height - d.height})`);
  if (b.errors.length) console.log('  build console errors:', b.errors.slice(0, 5));
  if (tail) {
    d.blocks = d.blocks.slice(-tail);
    b.blocks = b.blocks.slice(-tail);
  }
  const n = Math.max(d.blocks.length, b.blocks.length);
  for (let i = 0; i < n; i++) {
    if (onlyBlock !== undefined && Number(onlyBlock) !== i) continue;
    const db = d.blocks[i],
      bb = b.blocks[i];
    if (!db || !bb) {
      console.log(`  [${i}] ${db ? 'design-only' : 'build-only'}: ${(db || bb).tag} "${(db || bb).label}"`);
      continue;
    }
    const h = Math.min(db.height, bb.height);
    const [dc, bc] = await Promise.all([cropPng(d.shot, db.top, h, width), cropPng(b.shot, bb.top, h, width)]);
    const di = PNG.sync.read(dc),
      bi = PNG.sync.read(bc);
    const w = Math.min(di.width, bi.width),
      hh = Math.min(di.height, bi.height);
    const crop = (img) => {
      const out = new PNG({ width: w, height: hh });
      for (let y = 0; y < hh; y++) img.data.copy(out.data, y * w * 4, y * img.width * 4, y * img.width * 4 + w * 4);
      return out;
    };
    const A = crop(di),
      B = crop(bi),
      diff = new PNG({ width: w, height: hh });
    const bad = pixelmatch(A.data, B.data, diff.data, w, hh, { threshold: 0.1 });
    const pct = (bad / (w * hh)) * 100;
    worst = Math.max(worst, pct);
    const flag = db.top !== bb.top || db.height !== bb.height || pct > 0.5 ? '  <-- check' : '';
    console.log(
      `  [${i}] ${db.tag.padEnd(7)} top ${String(db.top).padStart(5)} / ${String(bb.top).padStart(5)}  h ${String(db.height).padStart(4)} / ${String(bb.height).padStart(4)}  diff ${pct.toFixed(2)}%  "${db.label}"${flag}`,
    );
    if (pct > 0.5 || onlyBlock !== undefined) {
      const sideBySide = await sharp({ create: { width: w * 3 + 20, height: hh, channels: 4, background: '#ff00ff' } })
        .composite([
          { input: PNG.sync.write(A), left: 0, top: 0 },
          { input: PNG.sync.write(B), left: w + 10, top: 0 },
          { input: PNG.sync.write(diff), left: w * 2 + 20, top: 0 },
        ])
        .png()
        .toFile(path.join(outDir, `${slugName}-${width}-block${i}.png`));
      void sideBySide;
    }
  }
}
await browser.close();
console.log(`\nworst block diff: ${worst.toFixed(2)}%  (screenshots in ${path.relative(process.cwd(), outDir)})`);
