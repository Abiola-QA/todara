import type { MetadataRoute } from 'next';

import { absoluteUrl, searchIndexing } from '@/config/seo';

/**
 * Production (SITE_INDEXING=on): crawl everything and read the sitemap.
 * Everywhere else (Vercel previews, local): stay out of search engines.
 */
export default function robots(): MetadataRoute.Robots {
  if (!searchIndexing) return { rules: { userAgent: '*', disallow: '/' } };
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: absoluteUrl('/sitemap.xml'),
    host: absoluteUrl('/'),
  };
}
