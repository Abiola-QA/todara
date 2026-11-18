import { JsonLd } from '@/components/seo/json-ld';
import { breadcrumbNode, graph, organizationNode } from '@/components/seo/structured-data';
import { paths } from '@/config/paths';
import { pageMetadata } from '@/config/seo';
import { QuotePage } from '@/features/quote';

export const metadata = pageMetadata({
  title: 'Request a quote | Todara',
  description: 'Request a quote for Kenyan avocado and mango: fresh, IQF or puree. Reply within one working day, or message us on WhatsApp.',
  path: paths.quote,
});

export default function Page() {
  return (
    <>
      <JsonLd data={graph(organizationNode(), breadcrumbNode([{ name: 'Request a quote', path: paths.quote }]))} />
      <QuotePage />
    </>
  );
}
