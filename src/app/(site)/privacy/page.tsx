import type { Metadata } from 'next';

import { JsonLd } from '@/components/seo/json-ld';
import { breadcrumbNode, graph, organizationNode } from '@/components/seo/structured-data';
import { LegalPage, legalMetadata, policies } from '@/features/legal';

export const metadata: Metadata = legalMetadata('privacy');

export default function Page() {
  return (
    <>
      <JsonLd data={graph(organizationNode(), breadcrumbNode([{ name: policies.privacy.title, path: policies.privacy.href }]))} />
      <LegalPage policy="privacy" />
    </>
  );
}
