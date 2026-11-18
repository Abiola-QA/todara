import type { MetadataRoute } from 'next';

import { paths } from '@/config/paths';
import { absoluteUrl, searchIndexing } from '@/config/seo';
import { products } from '@/lib/catalog';

type Entry = MetadataRoute.Sitemap[number];

const page = (path: string, priority: number, changeFrequency: Entry['changeFrequency']): Entry => ({ url: absoluteUrl(path), priority, changeFrequency });

/** Every indexable page. Empty until SITE_INDEXING=on so previews never advertise URLs. */
export default function sitemap(): MetadataRoute.Sitemap {
  if (!searchIndexing) return [];
  return [
    page(paths.home, 1.0, 'monthly'),
    page(paths.products, 0.9, 'monthly'),
    ...products.map((p) => page(paths.product(p.slug), 0.9, 'monthly')),
    page(paths.seasonality, 0.8, 'monthly'),
    page(paths.compliance, 0.8, 'monthly'),
    page(paths.about, 0.7, 'yearly'),
    page(paths.faq, 0.7, 'monthly'),
    page(paths.quote, 0.8, 'yearly'),
    page(paths.specSheets, 0.6, 'monthly'),
    page(paths.privacy, 0.2, 'yearly'),
    page(paths.terms, 0.2, 'yearly'),
    page(paths.cookies, 0.2, 'yearly'),
  ];
}
