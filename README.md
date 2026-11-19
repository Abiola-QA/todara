# Todara website

Website for **Todara Ltd**, a Kenyan exporter of avocado and mango (fresh, IQF and puree), at todarakenya.com.
It is built from the Claude Design file **"Todara Website v4"** (project "Todara produce export website"), page
for page and state for state.

## Stack

- Next.js 16 (App Router, Cache Components, static pages), React 19, TypeScript (strict)
- CSS Modules copied from the design's styles (no CSS framework), Albert Sans via `next/font`
- Vitest + Testing Library (unit tests), Playwright (whole-site crawl)
- Bulletproof React layout: `src/app` (routes) → `src/features/*` (one folder per page area) → shared
  `src/components`, `src/lib`, `src/config`. ESLint stops features importing each other.
- Hosting: **Vercel**. Photos: **Vercel Blob**. Quote emails: **Resend**.

## Pages

| Route                                              | Page                                                         |
| -------------------------------------------------- | ------------------------------------------------------------ |
| `/`                                                | Home                                                         |
| `/products`                                        | All products, form tabs (`?form=fresh\|iqf\|puree`), compare |
| `/products/[slug]`                                 | Nine product pages with full specification                   |
| `/seasonality`                                     | Month-by-month availability                                  |
| `/compliance`                                      | Licences, KEPHIS, shipment documents                         |
| `/about`, `/faq`                                   | About Todara, buyer questions                                |
| `/quote`                                           | Multi-product quote, saved on the buyer's device             |
| `/spec-sheets`                                     | Printable A4 specification sheets (one per product)          |
| `/privacy`, `/terms`, `/terms-of-sale`, `/cookies` | Privacy policy, terms of use, terms of sale, cookie policy   |

## Getting started

```bash
pnpm install
pnpm dev            # http://localhost:3000
```

Photos are not in the repository. For local development copy them into `public/media/images/` (the
`images/` folder of the design project); with `NEXT_PUBLIC_MEDIA_BASE_URL` set they come from Vercel Blob instead.

```bash
pnpm lint
pnpm check-types
pnpm test           # unit tests
pnpm build && pnpm start
BASE_URL=http://localhost:3000 pnpm test:e2e   # crawl every page against a running site
```

Never run `pnpm build` while `pnpm dev` is running in the same folder: both write to `.next`.

## Environment variables

See `.env.example`. All are optional locally.

| Variable                     | Where               | Purpose                                                                                         |
| ---------------------------- | ------------------- | ----------------------------------------------------------------------------------------------- |
| `SITE_URL`                   | all                 | Public origin for canonical links and the sitemap                                               |
| `SITE_INDEXING`              | Production only     | `on` lets search engines index the site (robots, sitemap, no noindex)                           |
| `NEXT_PUBLIC_MEDIA_BASE_URL` | Production, Preview | Vercel Blob store origin; photos load from there                                                |
| `FORMS_DELIVERY`             | optional            | `resend` (default in production) or `none` (only logs)                                          |
| `RESEND_API_KEY`             | Production          | Sending key for quote emails                                                                    |
| `QUOTE_TO_EMAIL`             | optional            | Inbox for quote requests (default export@todarakenya.com)                                       |
| `FORMS_FROM_EMAIL`           | optional            | Sender on a domain verified in Resend                                                           |
| `EMAIL_SITE_URL`             | optional            | Website address used inside the quote emails only (links and site name); defaults to `SITE_URL` |
| `BLOB_READ_WRITE_TOKEN`      | your machine only   | Lets `pnpm media:upload` publish photos to Blob                                                 |

## Photos on Vercel Blob

1. In the Vercel project: Storage → Create → Blob. Copy the read-write token into `.env.local` as
   `BLOB_READ_WRITE_TOKEN` (never commit it).
2. `pnpm media:upload` uploads everything in `public/media/` with the same paths and prints the store origin.
3. Set `NEXT_PUBLIC_MEDIA_BASE_URL` to that origin in Vercel (Production and Preview) and redeploy.

The Next.js image optimiser fetches the originals from Blob and serves resized AVIF/WebP from this site,
so the browser only ever talks to todarakenya.com (strict Content Security Policy).

## Deploying to Vercel

Import the GitHub repository in Vercel (framework preset: Next.js, no build settings needed), add the
environment variables above, then point the domain at Vercel. Set `SITE_INDEXING=on` for Production only
when the site is ready to be found by search engines.

## Quote requests

The quote basket lives in the buyer's browser (`localStorage`, key `todara-quote-v1`). Sending runs a server
action that checks for bots (hidden field + fill time), validates every value against the catalogue and
rate-limits each connection, then sends two branded emails through Resend:

1. **To the export team** (`QUOTE_TO_EMAIL`): who is asking, the products with spec codes, terms and notes,
   with "Reply" and "WhatsApp" buttons. Replying goes straight to the buyer; the desks (fresh fruit, frozen,
   puree) are named in the subject.
2. **To the buyer**: a confirmation with the reference, a copy of the enquiry and what happens next. Replies go
   to the export inbox.

The enquiry counts as sent only once the team's email is accepted; if that fails the buyer is told to email or
WhatsApp instead, so nothing is lost silently. Templates: `src/features/quote/emails/`. Preview them with a
sample enquiry (written to `.compare/emails/`):

```bash
node --experimental-strip-types --import ./tools/ts-loader/register.mjs tools/email-preview.mts
```

Email logos live in the Blob store (`brand/`), so they show in any inbox.

## Matching the design

The design lives in `design-reference/` (git-ignored, downloaded from Claude Design). Tools:

- `node tools/compare.mjs "Todara Website v4.dc.html#/products" http://localhost:3000/products --widths 1440,768,390`
  compares page blocks (position, height, pixels). `--init file.js` seeds the page (e.g. a saved quote) and
  `--eval "js"` runs an action (e.g. submit) in both pages first.
- `node tools/hover-probe.mjs "<design file>#/<view>" <url> 1440` compares every hover style.

See `docs/building-pages.md` for the conventions and the design quirks that are reproduced on purpose.
