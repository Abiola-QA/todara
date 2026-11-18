import type { Product } from '@/lib/catalog';

import { AlsoAvailable } from './also-available';
import { ProductOverview } from './product-overview';
import { ProductSpecification } from './product-specification';
import { ProductUses } from './product-uses';

/** A product page's sections, in the design's order (the CTA band and footer come from the site shell). */
export function ProductDetail({ product }: { product: Product }) {
  return (
    <>
      <ProductOverview product={product} />
      <ProductSpecification product={product} />
      <ProductUses product={product} />
      <AlsoAvailable product={product} />
    </>
  );
}
