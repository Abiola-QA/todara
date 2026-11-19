# Building and changing pages

The site reproduces "Todara Website v4.dc.html" exactly. That file is one page that switches views
(`#/products`, `#/product/hass`, …); here every view is a real route so it can be indexed.

## Architecture rules

- Routes in `src/app` stay thin: metadata, JSON-LD and one feature component.
- A feature (`src/features/<name>`) owns its components, CSS Modules, data and tests. Features never import
  each other; anything two features need goes to `src/lib` (data, stores), `src/components` (UI) or `src/config`.
- Shared data: `src/lib/catalog` (products, forms, seasons, buying terms), `src/lib/content` (FAQ, licences,
  order steps), `src/config/site.ts` (company facts), `src/config/paths.ts` (every route).
- Client state: the quote basket (`src/lib/quote`, saved as `todara-quote-v1`), toasts (`src/lib/toast`) and the
  cookie choice (`todara-cookie-choice`), all through `useSyncExternalStore`, so server HTML never depends on them.

## Copying the design

- Copy each element's inline style into a CSS Module class, value for value. Shared pieces are in
  `src/styles/layout.module.css` (use `composes`), `Button` (variants + per-instance `pad`/`size`),
  `CoverImage` (replaces `<image-slot>`, with the slot's saved pan), `SectionIntro`, `FaqAccordion`.
- The design's buttons that navigate become `next/link` with the same styles (`all: unset` included), so
  pages are crawlable. Global link colours use zero-specificity selectors so a component's own colour wins,
  exactly like the design's inline styles.
- Breakpoints that the design computes in JavaScript are media queries here: `wide`/`narrow` at 980px,
  `mob` at 700px, hero order and tile columns at 640px, hero photo height at 1000px.
- `style-hover` becomes a `:hover` rule on the same class.

## Quirks reproduced on purpose

- Every `{{ value }}` in the design renders as its own `<span>`. Where the parent is a flex or grid container
  with a gap, the gap shows between the literal text and the value ("+ Hass avocado", "Enquiry received ·
  TD-Q-…"). Wrap the value in its own `<span>` in those places.
- The site header and footer use the logo from **logo pack v2** (lowercase "todara"), because that is what
  v4 renders, although a newer pack v3 exists in the design project.
- Keyboard focus rings are kept on every control (the design's `all: unset` hides them); this is the one
  deliberate difference, for accessibility.

## Deliberate changes from the design

- Product search matches each word of the query on its own, in any order (the design matched the whole phrase,
  so its own placeholder example "IQF dice" found nothing). Changed on the client's request, 19 November 2026.

## Verifying a change

```bash
node tools/compare.mjs "Todara Website v4.dc.html#/season" http://localhost:5192/seasonality --widths 1440,768,390 --out .compare/season
node tools/hover-probe.mjs "Todara Website v4.dc.html#/season" http://localhost:5192/seasonality 1440
```

Block tops and heights must match; the only pixel differences allowed are photo resampling. The compare tool
hides floating overlays (cookie banner, WhatsApp button, mobile bar) on both sides unless `--keep-fixed`.

## SEO

- Titles and descriptions come from the design's `meta()` table (descriptions cut at 158 characters).
- `pageMetadata()` adds canonical, Open Graph and Twitter cards; `JsonLd` + helpers in
  `src/components/seo/structured-data.ts` add Organization, WebSite, BreadcrumbList, FAQPage and Product.
- `robots.txt`, the sitemap and the `noindex` header all follow `SITE_INDEXING` (on only in production).

## Tests

Unit tests sit next to the code in `__tests__` folders (`pnpm test`). `e2e/crawl.spec.ts` crawls every page
from the home page and checks status, one `<h1>`, title, description, canonical, console errors, security
headers, 404s and the quote basket.
