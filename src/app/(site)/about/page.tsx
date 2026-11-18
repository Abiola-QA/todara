import type { Metadata } from 'next';

import { JsonLd } from '@/components/seo/json-ld';
import { breadcrumbNode, graph, organizationNode } from '@/components/seo/structured-data';
import { paths } from '@/config/paths';
import { pageMetadata } from '@/config/seo';
import { AboutPage } from '@/features/about';

export const metadata: Metadata = pageMetadata({
  title: 'About Todara | Kenyan avocado and mango exporter',
  description: 'Todara Ltd supplies Kenyan avocado and mango from its own farms and contracted growers to buyers in Europe, the Middle East and Asia.',
  path: paths.about,
});

export default function Page() {
  return (
    <>
      <JsonLd data={graph(organizationNode(), breadcrumbNode([{ name: 'About Todara', path: paths.about }]))} />
      <AboutPage />
    </>
  );
}
