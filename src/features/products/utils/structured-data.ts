import { organizationId } from '@/components/seo/structured-data';
import { mediaUrl } from '@/config/media';
import { paths } from '@/config/paths';
import { absoluteUrl } from '@/config/seo';
import { products, type Product } from '@/lib/catalog';

/** schema.org Product for a product page (the design's meta() Product node, plus image and URL). */
export function productNode(product: Product) {
  const url = absoluteUrl(paths.product(product.slug));
  return {
    '@type': 'Product',
    '@id': `${url}#product`,
    name: product.name,
    sku: product.code,
    description: product.desc,
    image: absoluteUrl(mediaUrl(product.image)),
    url,
    brand: { '@type': 'Brand', name: 'Todara' },
    manufacturer: { '@id': organizationId },
    countryOfOrigin: 'KE',
  };
}

/** The products page as an ordered list of the nine product pages. */
export function productsItemListNode() {
  return {
    '@type': 'ItemList',
    '@id': `${absoluteUrl(paths.products)}#products`,
    itemListElement: products.map((p, i) => ({ '@type': 'ListItem', position: i + 1, url: absoluteUrl(paths.product(p.slug)), name: p.name })),
  };
}
