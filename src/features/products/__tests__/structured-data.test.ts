import { productById } from '@/lib/catalog';

import { productNode, productsItemListNode } from '../utils/structured-data';

describe('product structured data', () => {
  it('describes a product page as a schema.org Product', () => {
    const node = productNode(productById('mango-puree')!);
    expect(node).toMatchObject({
      '@type': 'Product',
      name: 'Mango puree',
      sku: 'TD-MG-PU',
      brand: { '@type': 'Brand', name: 'Todara' },
      countryOfOrigin: 'KE',
      url: 'https://todarakenya.com/products/mango-puree',
    });
    expect(node.image).toMatch(/^https:\/\/.+todara-11-mango-puree-drum\.jpg$/);
  });

  it('lists all nine product pages in order', () => {
    const list = productsItemListNode();
    expect(list.itemListElement).toHaveLength(9);
    expect(list.itemListElement[0]).toEqual({ '@type': 'ListItem', position: 1, url: 'https://todarakenya.com/products/hass-avocado', name: 'Hass avocado' });
  });
});
