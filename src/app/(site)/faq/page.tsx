import type { Metadata } from 'next';

import { JsonLd } from '@/components/seo/json-ld';
import { breadcrumbNode, faqPageNode, graph, organizationNode } from '@/components/seo/structured-data';
import { paths } from '@/config/paths';
import { pageMetadata } from '@/config/seo';
import { FaqPage } from '@/features/faq';
import { faq } from '@/lib/content';

export const metadata: Metadata = pageMetadata({
  title: 'FAQ: shipping, order sizes and terms | Todara',
  description: 'Answers for buyers of Kenyan avocado and mango: forms, shipping, transit times, order sizes, cold chain, documents and payment terms.',
  path: paths.faq,
});

export default function Page() {
  return (
    <>
      <JsonLd data={graph(organizationNode(), breadcrumbNode([{ name: 'FAQ', path: paths.faq }]), faqPageNode(faq, paths.faq))} />
      <FaqPage />
    </>
  );
}
