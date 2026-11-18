import type { Metadata } from 'next';

import { JsonLd } from '@/components/seo/json-ld';
import { breadcrumbNode, graph, organizationNode } from '@/components/seo/structured-data';
import { paths } from '@/config/paths';
import { pageMetadata } from '@/config/seo';
import { CompliancePage } from '@/features/compliance';

export const metadata: Metadata = pageMetadata({
  title: 'Export licences and compliance | Todara',
  description: 'Todara holds an AFA–HCD horticultural export licence for avocado and mango in all forms and is registered with KEPHIS.',
  path: paths.compliance,
});

export default function Page() {
  return (
    <>
      <JsonLd data={graph(organizationNode(), breadcrumbNode([{ name: 'Licences and compliance', path: paths.compliance }]))} />
      <CompliancePage />
    </>
  );
}
