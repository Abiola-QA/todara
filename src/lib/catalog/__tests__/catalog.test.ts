import { alsoAvailable, buyingTerms, forms, productById, productBySlug, products, seasonCells, specRows } from '..';

describe('catalogue', () => {
  it('has the nine products of the design, with unique ids, slugs and spec codes', () => {
    expect(products).toHaveLength(9);
    for (const key of ['id', 'slug', 'code'] as const) expect(new Set(products.map((p) => p[key])).size).toBe(9);
    for (const p of products) {
      expect(p.season).toMatch(/^[pao]{12}$/);
      expect(p.slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
      expect(p.option.choices.length).toBeGreaterThan(0);
    }
  });

  it('finds products by id and slug', () => {
    expect(productById('hass')?.name).toBe('Hass avocado');
    expect(productBySlug('iqf-mango-dice')?.code).toBe('TD-MG-ID');
    expect(productBySlug('durian')).toBeUndefined();
  });

  it('orders specification rows by the form’s field list and skips fields a product lacks', () => {
    const hass = productById('hass')!;
    expect(specRows(hass).map((r) => r.k)).toEqual(forms.fresh.fields.filter((k) => hass.spec[k]));
    expect(specRows(hass, 3).map((r) => r.k)).toEqual(['Varieties', 'Counts', 'Stem']);
  });

  it('lists the other forms of the same fruit', () => {
    const names = alsoAvailable(productById('mango')!).map((p) => p.name);
    expect(names).toEqual(['IQF mango dice', 'IQF mango halves and cheeks', 'Mango puree']);
  });

  it('builds month cells with the design’s titles', () => {
    const cells = seasonCells('ooapppppaaoo');
    expect(cells).toHaveLength(12);
    expect(cells[3]).toEqual({ code: 'p', title: 'Apr: Peak' });
    expect(cells[0]).toEqual({ code: 'o', title: 'Jan: Limited or none' });
  });

  it('quotes fresh fruit FOB Mombasa or FCA Nairobi and processed products FOB Mombasa', () => {
    expect(buyingTerms('fresh')[0]?.v).toBe('USD, FOB Mombasa or FCA Nairobi');
    expect(buyingTerms('iqf')[0]?.v).toBe('USD, FOB Mombasa');
  });
});
