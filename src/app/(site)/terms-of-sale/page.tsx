import type { Metadata } from 'next';

import { JsonLd } from '@/components/seo/json-ld';
import { breadcrumbNode, graph, organizationNode } from '@/components/seo/structured-data';
import { LegalPage, legalMetadata, policies } from '@/features/legal';

export const metadata: Metadata = legalMetadata('sale');

export default function Page() {
  return (
    <>
      <JsonLd data={graph(organizationNode(), breadcrumbNode([{ name: policies.sale.title, path: policies.sale.href }]))} />
      <LegalPage policy="sale" />
    </>
  );
}
