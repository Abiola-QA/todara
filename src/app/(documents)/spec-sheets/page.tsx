import type { Metadata } from 'next';

import { JsonLd } from '@/components/seo/json-ld';
import { breadcrumbNode, graph, organizationNode } from '@/components/seo/structured-data';
import { paths } from '@/config/paths';
import { pageMetadata } from '@/config/seo';
import { SpecSheetsDocument } from '@/features/spec-sheets/components/spec-sheets-document';

export const metadata: Metadata = pageMetadata({
  title: 'Product specification sheets | Todara',
  description:
    'Printable specification sheets for Kenyan avocado and mango from Todara: fresh, IQF and puree, with counts, packs, cold chain, availability and licences.',
  path: paths.specSheets,
});

export default function SpecSheetsPage() {
  return (
    <>
      <JsonLd
        data={graph(
          organizationNode(),
          breadcrumbNode([
            { name: 'Products', path: paths.products },
            { name: 'Specification sheets', path: paths.specSheets },
          ]),
        )}
      />
      <SpecSheetsDocument />
    </>
  );
}
