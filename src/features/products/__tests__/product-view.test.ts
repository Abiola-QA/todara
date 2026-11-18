import { productById, products } from '@/lib/catalog';

import {
  cardFacts,
  compareTable,
  countWord,
  docId,
  formTabs,
  keyFacts,
  photoSize,
  productSeo,
  productsForFilter,
  quoteMessage,
  seasonBackground,
} from '../utils/product-view';

const hass = productById('hass')!;

describe('product view helpers', () => {
  it('lists the form tabs in the design order', () => {
    expect(formTabs.map((t) => t.label)).toEqual(['All forms', 'Fresh fruit', 'IQF frozen', 'Puree and pulp']);
  });

  it('filters products by form', () => {
    expect(productsForFilter('all')).toHaveLength(9);
    expect(productsForFilter('fresh').map((p) => p.id)).toEqual(['hass', 'greenskin', 'mango']);
    expect(productsForFilter('iqf')).toHaveLength(4);
    expect(productsForFilter('puree').map((p) => p.id)).toEqual(['mango-puree', 'avo-pulp']);
  });

  it('takes card facts and key facts in the form field order', () => {
    expect(cardFacts(hass)).toEqual([
      { k: 'Varieties', v: 'Hass' },
      { k: 'Counts', v: '12–26 per 4 kg carton' },
      { k: 'Stem', v: 'Button stem intact' },
    ]);
    expect(keyFacts(hass).map((f) => f.k)).toEqual(['Varieties', 'Counts', 'Stem', 'Shelf life', 'Growing altitude', 'Season']);
  });

  it('compares fresh fruit when all forms are shown, with a dash for missing values', () => {
    const table = compareTable('all');
    expect(table.form.key).toBe('fresh');
    expect(table.items.map((p) => p.id)).toEqual(['hass', 'greenskin', 'mango']);
    expect(table.rows).toHaveLength(12);
    expect(table.rows.find((r) => r.k === 'Growing areas')?.values).toEqual(['—', '—', '—']);
    expect(table.rows.find((r) => r.k === 'Growing altitude')?.values[2]).toBe('—');
  });

  it('compares the chosen form', () => {
    expect(compareTable('iqf').items).toHaveLength(4);
    expect(compareTable('puree').rows.map((r) => r.k)).toEqual([
      'Variety',
      'Brix',
      'Acidity',
      'pH',
      'Microbiology',
      'Pack',
      'Storage',
      'Shelf life',
      'Documents',
    ]);
  });

  it('writes the design text for counts, references and messages', () => {
    expect(countWord(1)).toBe('product');
    expect(countWord(2)).toBe('products');
    expect(docId(hass)).toBe('TD-AV-HS · Rev 01 · Indicative, confirmed in each written offer');
    expect(quoteMessage(hass)).toBe('Hello Todara, I would like a quote for Hass avocado.');
    expect(seasonBackground.p).toBe('#1E3A2F');
    expect(seasonBackground.o).toBe('transparent');
  });

  it('builds the product page title and description like the design', () => {
    expect(productSeo(hass)).toEqual({
      title: 'Hass avocado supplier from Kenya | Todara',
      description: `${hass.short} ${hass.desc}`,
    });
  });

  it('knows every product photo size', () => {
    for (const p of products) expect(photoSize(p.image).width).toBeGreaterThan(0);
    expect(photoSize('images/todara-11-mango-puree-drum.jpg')).toEqual({ width: 1000, height: 1540 });
    expect(photoSize('unknown.jpg')).toEqual({ width: 1536, height: 1024 });
  });
});
