import type { Metadata } from 'next';

import { JsonLd } from '@/components/seo/json-ld';
import { breadcrumbNode, graph, organizationNode } from '@/components/seo/structured-data';
import { paths } from '@/config/paths';
import { pageMetadata } from '@/config/seo';
import { SeasonalityPage } from '@/features/seasonality';

export const metadata: Metadata = pageMetadata({
  title: 'Kenyan avocado and mango season calendar | Todara',
  description: 'Month-by-month availability of fresh Kenyan avocado and mango, with IQF and puree shipped all year from stock.',
  path: paths.seasonality,
});

export default function Page() {
  return (
    <>
      <JsonLd data={graph(organizationNode(), breadcrumbNode([{ name: 'Seasonality', path: paths.seasonality }]))} />
      <SeasonalityPage />
    </>
  );
}
