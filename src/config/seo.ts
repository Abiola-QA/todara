import type { Metadata } from 'next';

import { env } from './env';
import { site } from './site';

const siteUrl = env.SITE_URL;
export const searchIndexing = env.SITE_INDEXING === 'on';

/** Absolute URL for a path, for structured data and the sitemap. */
export function absoluteUrl(path = '/') {
  return new URL(path, siteUrl + '/').toString();
}

/** A page's Open Graph / Twitter card image. */
export type SocialImage = { url: string; width: number; height: number; alt: string };

/** Social card used where a page has no photo of its own: the logo on cream (public/brand). */
export const logoSocialImage: SocialImage = {
  url: '/brand/todara-social-card.png',
  width: 1200,
  height: 630,
  alt: 'Todara, Kenyan avocado and mango exporter',
};

/** The design's longest meta description is cut at 158 characters (its meta() helper). */
export const DESCRIPTION_LIMIT = 158;

export function clampDescription(text: string) {
  return text.slice(0, DESCRIPTION_LIMIT);
}

/** Defaults every page inherits (root layout). */
export const siteMetadata: Metadata = {
  metadataBase: new URL(siteUrl + '/'),
  title: 'Todara | Kenyan avocado and mango exporter: fresh, IQF and puree',
  description: clampDescription(
    'Kenyan Hass and Fuerte avocado and Apple and Kent mango: fresh, IQF and puree. AFA–HCD licensed, KEPHIS registered, HACCP and GlobalG.A.P. certified.',
  ),
  applicationName: site.name,
  authors: [{ name: site.legalName, url: siteUrl }],
  creator: site.legalName,
  publisher: site.legalName,
  formatDetection: { email: false, address: false, telephone: false },
  // Until launch every page is noindex; SITE_INDEXING=on lifts it in production.
  robots: searchIndexing
    ? { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 } }
    : { index: false, follow: false },
  openGraph: { type: 'website', siteName: site.name, locale: 'en_KE', images: [logoSocialImage] },
  twitter: { card: 'summary_large_image', images: [logoSocialImage] },
};

type PageSeo = {
  /** Full <title>, exactly as the design writes it. */
  title: string;
  /** Meta description as the design writes it (cut to 158 characters like the design). */
  description: string;
  /** Route path, e.g. "/products". Becomes the canonical URL. */
  path: string;
  /** Social card image; defaults to the logo card. */
  image?: SocialImage;
  noindex?: boolean;
};

/** Metadata for one page: title, description, canonical, Open Graph and Twitter card. */
export function pageMetadata({ title, description, path, image = logoSocialImage, noindex }: PageSeo): Metadata {
  const text = clampDescription(description);
  return {
    title: { absolute: title },
    description: text,
    alternates: { canonical: path },
    openGraph: { type: 'website', siteName: site.name, locale: 'en_KE', title, description: text, url: path, images: [image] },
    twitter: { card: 'summary_large_image', title, description: text, images: [image] },
    ...(noindex ? { robots: { index: false, follow: true } } : {}),
  };
}
