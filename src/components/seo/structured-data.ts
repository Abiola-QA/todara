import { absoluteUrl } from '@/config/seo';
import { site } from '@/config/site';

/** schema.org building blocks shared by every page (the design's meta() graph, extended). */
export const organizationId = absoluteUrl('/#org');
export const websiteId = absoluteUrl('/#website');

export function organizationNode() {
  return {
    '@type': 'Organization',
    '@id': organizationId,
    name: site.legalName,
    alternateName: site.name,
    url: absoluteUrl('/'),
    logo: absoluteUrl('/brand/todara-logo.png'),
    email: site.email,
    description: site.description,
    address: {
      '@type': 'PostalAddress',
      streetAddress: site.address.street,
      addressLocality: site.address.locality,
      addressCountry: site.address.countryCode,
    },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'sales',
      email: site.email,
      telephone: `+${site.whatsappNumber}`,
      areaServed: site.markets,
      availableLanguage: 'en',
    },
  };
}

export function websiteNode() {
  return { '@type': 'WebSite', '@id': websiteId, url: absoluteUrl('/'), name: site.name, publisher: { '@id': organizationId }, inLanguage: 'en' };
}

export type Crumb = { name: string; path: string };

/** Breadcrumb trail, always starting at Home. */
export function breadcrumbNode(crumbs: Crumb[]) {
  const all = [{ name: 'Home', path: '/' }, ...crumbs];
  return {
    '@type': 'BreadcrumbList',
    itemListElement: all.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.name, item: absoluteUrl(c.path) })),
  };
}

export function faqPageNode(items: readonly { q: string; a: string }[], path: string) {
  return {
    '@type': 'FAQPage',
    '@id': `${absoluteUrl(path)}#faq`,
    mainEntity: items.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  };
}

/** Wraps nodes in one @graph document. */
export function graph(...nodes: Record<string, unknown>[]) {
  return { '@context': 'https://schema.org', '@graph': nodes };
}
