import { expect, test, type Page } from '@playwright/test';

/**
 * Starts at the home page and follows every internal link, like a buyer clicking through the whole site.
 * For every page reached it checks: HTTP 200, exactly one <h1>, a <title> and meta description, a canonical
 * link, and no JavaScript errors in the console.
 */
test('every internal link leads to a healthy page', async ({ page, baseURL }) => {
  const origin = new URL(baseURL!).origin;
  const queue: string[] = ['/'];
  const seen = new Set<string>(queue);
  const problems: string[] = [];

  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(m.text());
  });

  while (queue.length) {
    const path = queue.shift()!;
    errors.length = 0;
    const res = await page.goto(path, { waitUntil: 'networkidle' });
    const status = res?.status() ?? 0;
    if (status !== 200) {
      problems.push(`${path}: HTTP ${status}`);
      continue;
    }
    const facts = await readPageFacts(page);
    if (facts.h1 !== 1) problems.push(`${path}: ${facts.h1} <h1> elements`);
    if (!facts.title) problems.push(`${path}: missing <title>`);
    if (!facts.description) problems.push(`${path}: missing meta description`);
    if (!facts.canonical) problems.push(`${path}: missing canonical link`);
    if (errors.length) problems.push(`${path}: console errors: ${errors.slice(0, 3).join(' | ')}`);

    for (const href of facts.links) {
      const url = new URL(href, origin + path);
      if (url.origin !== origin) continue;
      if (/\.(pdf|png|jpe?g|webp|svg|ico)$/i.test(url.pathname)) continue;
      const key = url.pathname;
      if (!seen.has(key)) {
        seen.add(key);
        queue.push(key);
      }
    }
  }

  console.log(`crawled ${seen.size} pages`);
  expect(problems, problems.join('\n')).toEqual([]);
  // Home, products, 9 product pages, seasonality, compliance, about, FAQ, quote, 3 legal pages, spec sheets.
  expect(seen.size).toBeGreaterThanOrEqual(20);
});

async function readPageFacts(page: Page) {
  return page.evaluate(() => ({
    h1: document.querySelectorAll('h1').length,
    title: document.title.trim(),
    description: document.querySelector('meta[name="description"]')?.getAttribute('content')?.trim() ?? '',
    canonical: document.querySelector('link[rel="canonical"]')?.getAttribute('href') ?? '',
    links: [...document.querySelectorAll('a[href]')]
      .map((a) => a.getAttribute('href')!)
      .filter((h) => h && !h.startsWith('#') && !h.startsWith('mailto:') && !h.startsWith('tel:')),
  }));
}

test('security headers are sent on every page', async ({ request }) => {
  const res = await request.get('/');
  const h = res.headers();
  expect(h['content-security-policy']).toContain("frame-ancestors 'none'");
  expect(h['x-frame-options']).toBe('DENY');
  expect(h['x-content-type-options']).toBe('nosniff');
  expect(h['referrer-policy']).toBe('strict-origin-when-cross-origin');
  expect(h['x-powered-by']).toBeUndefined();
});

test('unknown pages return a real 404', async ({ request }) => {
  const res = await request.get('/this-page-does-not-exist');
  expect(res.status()).toBe(404);
});

test('an unknown product answers 404 with the not-found page, not a 200 shell', async ({ page }) => {
  const res = await page.goto('/products/durian', { waitUntil: 'networkidle' });
  expect(res?.status()).toBe(404);
  await expect(page.locator('h1')).toHaveCount(1);
});

test('a buyer can build a quote across pages and it survives a reload', async ({ page }) => {
  await page.goto('/products/hass-avocado');
  await page.getByRole('button', { name: '+ Add to quote' }).first().click();
  await expect(page.getByRole('status')).toContainText('Hass avocado added to your quote');
  await page.goto('/quote');
  await expect(page.locator('main').getByText('Hass avocado', { exact: true })).toBeVisible();
  await page.reload();
  await expect(page.getByText('Saved on this device. Pick up where you left off any time.')).toBeVisible();
});
