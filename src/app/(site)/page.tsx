import type { Metadata } from 'next';

import { JsonLd } from '@/components/seo/json-ld';
import { faqPageNode, graph, organizationNode, websiteNode } from '@/components/seo/structured-data';
import { pageMetadata } from '@/config/seo';
import { ColdChain, CredentialsStrip, FaqTeaser, FormRangeCards, HomeHero, LicencesTeaser, OrderSteps, RangeMatrix, SupplyYear } from '@/features/home';
import { faq } from '@/lib/content';

export const metadata: Metadata = pageMetadata({
  title: 'Todara | Kenyan avocado and mango exporter: fresh, IQF and puree',
  description:
    'Kenyan Hass and Fuerte avocado and Apple and Kent mango: fresh, IQF and puree. AFA–HCD licensed, KEPHIS registered, HACCP and GlobalG.A.P. certified.',
  path: '/',
});

export default function HomePage() {
  return (
    <>
      <JsonLd data={graph(organizationNode(), websiteNode(), faqPageNode(faq, '/'))} />
      <HomeHero />
      <CredentialsStrip />
      <RangeMatrix />
      <FormRangeCards />
      <SupplyYear />
      <ColdChain />
      <OrderSteps />
      <LicencesTeaser />
      <FaqTeaser />
    </>
  );
}
