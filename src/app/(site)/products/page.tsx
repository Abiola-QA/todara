import type { Metadata } from 'next';
import { Suspense } from 'react';

import { JsonLd } from '@/components/seo/json-ld';
import { breadcrumbNode, graph, organizationNode } from '@/components/seo/structured-data';
import { paths } from '@/config/paths';
import { pageMetadata } from '@/config/seo';
import { ProductsBrowser, ProductsBrowserFromUrl } from '@/features/products/components/products-browser';
import { productsItemListNode } from '@/features/products/utils/structured-data';

export const metadata: Metadata = pageMetadata({
  title: 'Avocado and mango products: fresh, IQF and puree | Todara',
  description:
    'Fresh Hass and green-skin avocado, fresh mango, IQF avocado and mango halves and dice, mango puree and avocado pulp from Kenya, with full specifications.',
  path: paths.products,
});

export default function ProductsPage() {
  return (
    <>
      <JsonLd data={graph(organizationNode(), breadcrumbNode([{ name: 'Products', path: paths.products }]), productsItemListNode())} />
      {/* The static page lists every product; ?form= picks a tab once the page runs in the browser. */}
      <Suspense fallback={<ProductsBrowser initialForm="all" />}>
        <ProductsBrowserFromUrl />
      </Suspense>
    </>
  );
}
