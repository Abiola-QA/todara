import { forms, products, productsInForm, specRows, type FormKey, type Product, type ProductForm, type SeasonCode } from '@/lib/catalog';

/** The products page filter: every form, or one. */
export type FormFilter = 'all' | FormKey;

/** Tabs above the product grid, in the design's order. */
export const formTabs: readonly { key: FormFilter; label: string }[] = [
  { key: 'all', label: 'All forms' },
  { key: 'fresh', label: 'Fresh fruit' },
  { key: 'iqf', label: 'IQF frozen' },
  { key: 'puree', label: 'Puree and pulp' },
];

export function productsForFilter(filter: FormFilter): Product[] {
  return filter === 'all' ? [...products] : productsInForm(filter);
}

/** First three specification rows shown on a product card. */
export function cardFacts(product: Product) {
  return specRows(product, 3);
}

/** First six specification rows shown in the product page's key facts grid. */
export function keyFacts(product: Product) {
  return specRows(product, 6);
}

export type CompareTable = {
  form: ProductForm;
  items: Product[];
  /** Every field of the form, with "—" where a product has no value (desktop table). */
  rows: { k: string; values: string[] }[];
};

/** The compare section: products of the chosen form ("All forms" compares fresh fruit, as in the design). */
export function compareTable(filter: FormFilter): CompareTable {
  const form = forms[filter === 'all' ? 'fresh' : filter];
  const items = productsInForm(form.key);
  return { form, items, rows: form.fields.map((k) => ({ k, values: items.map((p) => p.spec[k] ?? '—') })) };
}

/** Month cell backgrounds on the product page calendar (the design's SBG). */
export const seasonBackground: Record<SeasonCode, string> = {
  p: '#1E3A2F',
  a: 'repeating-linear-gradient(135deg,rgba(30,58,47,.55) 0 2px,transparent 2px 5px)',
  o: 'transparent',
};

export function countWord(count: number) {
  return count === 1 ? 'product' : 'products';
}

/** Document reference under the full specification. */
export function docId(product: Product) {
  return `${product.code} · Rev 01 · Indicative, confirmed in each written offer`;
}

/** Prefilled WhatsApp message on a product page. */
export function quoteMessage(product: Product) {
  return `Hello Todara, I would like a quote for ${product.name}.`;
}

/** Product page title and description, exactly as the design's meta() writes them. */
export function productSeo(product: Product) {
  return { title: `${product.name} supplier from Kenya | Todara`, description: `${product.short} ${product.desc}` };
}

/** Pixel size of each product photo (for social cards). */
const photoSizes: Record<string, [number, number]> = {
  'images/todara-05b-open-carton-hass-avocados.jpg': [1536, 1024],
  'images/todara-10-open-carton-green-skin-avocados.png': [1438, 670],
  'images/todara-06b-open-carton-kent-mangoes.jpg': [1536, 1024],
  'images/todara-iqf-avocado-halves.jpeg': [2400, 1792],
  'images/todara-07-iqf-diced-avocado.jpg': [1536, 1024],
  'images/todara-09-iqf-mango-dice.png': [1532, 1020],
  'images/todara-08-iqf-mango-halves-seedless.jpg': [1536, 1024],
  'images/todara-11-mango-puree-drum.jpg': [1000, 1540],
  'images/todara-02b-puree-drum-and-avocado-pulp.jpg': [1536, 1024],
};

export function photoSize(path: string): { width: number; height: number } {
  const [width, height] = photoSizes[path] ?? [1536, 1024];
  return { width, height };
}
