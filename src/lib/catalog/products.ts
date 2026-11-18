import { forms, type FormKey, type ProductForm } from './forms';

export type Fruit = 'avocado' | 'mango';
/** Column of the home page range matrix. */
export type RangeCell = 'fresh' | 'halves' | 'dice' | 'puree';
/** One character per month, January first: p = peak, a = available, o = limited or none. */
export type SeasonCode = 'p' | 'a' | 'o';

export type Product = {
  /** Stable id (the design's product id); also the quote basket key. */
  id: string;
  /** URL slug: /products/<slug>. */
  slug: string;
  fruit: Fruit;
  form: FormKey;
  cell: RangeCell;
  name: string;
  /** Specification document code, e.g. TD-AV-HS. */
  code: string;
  short: string;
  desc: string;
  /** Twelve season codes, January to December. */
  season: string;
  /** The option a buyer picks per product in a quote: label and choices (the first is the default). */
  option: { label: string; choices: readonly string[] };
  spec: Readonly<Record<string, string>>;
  uses: readonly string[];
  image: string;
  imageAlt: string;
};

const P = (p: Product) => p;

export const products: readonly Product[] = [
  P({
    id: 'hass',
    slug: 'hass-avocado',
    fruit: 'avocado',
    form: 'fresh',
    cell: 'fresh',
    name: 'Hass avocado',
    code: 'TD-AV-HS',
    short: 'Dark-skinned when ripe, creamy, high oil content.',
    desc: 'Grown on our own farms and by contracted growers at 1,500–1,950 m, harvested at dry-matter maturity and packed single-layer.',
    season: 'ooapppppaaoo',
    option: { label: 'Counts', choices: ['12–14', '16–18', '20–22', '24–26', 'Mixed'] },
    spec: {
      Varieties: 'Hass',
      Counts: '12–26 per 4 kg carton',
      Stem: 'Button stem intact',
      'Shelf life': '21–30 days in cold storage',
      'Growing altitude': '1,500–1,950 m above sea level',
      Carton: '4 kg single-layer, count-marked',
      Pallet: '20 pallets per 40 ft reefer',
      Freight: 'Sea from Mombasa · Air from Nairobi',
      Season: 'March to October (peak April to August)',
      Maturity: 'Dry matter ≥ 21% at harvest',
      Temperature: '5–7 °C, controlled atmosphere by sea',
    },
    uses: ['Retail and ripening programmes', 'Food service and restaurants', 'Wholesale markets'],
    image: 'images/todara-05b-open-carton-hass-avocados.jpg',
    imageAlt: 'Open Todara carton of Kenyan Hass avocados',
  }),
  P({
    id: 'greenskin',
    slug: 'fuerte-green-skin-avocado',
    fruit: 'avocado',
    form: 'fresh',
    cell: 'fresh',
    name: 'Fuerte & green-skin avocado',
    code: 'TD-AV-GS',
    short: 'Smooth green skin, mild buttery flesh, stays green when ripe.',
    desc: 'Fuerte and other green-skin varieties from the same highland farms, for markets that prefer them, including much of the Middle East.',
    season: 'oappppaaaooo',
    option: { label: 'Counts', choices: ['12–14', '16–18', '20–24', 'Mixed'] },
    spec: {
      Varieties: 'Fuerte; other green-skin varieties on request',
      Counts: '12–24 per 4 kg carton',
      Stem: 'Button stem intact',
      'Shelf life': '21–28 days in cold storage',
      'Growing altitude': '1,500–1,950 m above sea level',
      Carton: '4 kg single-layer, count-marked',
      Pallet: '20 pallets per 40 ft reefer',
      Freight: 'Sea from Mombasa · Air from Nairobi',
      Season: 'February to September (peak March to June)',
      Maturity: 'Dry matter ≥ 20% at harvest',
      Temperature: '5–8 °C',
    },
    uses: ['Markets that prefer green-skin fruit, including much of the Middle East', 'Wholesale and food service', 'Fresh-cut and salad preparation'],
    image: 'images/todara-10-open-carton-green-skin-avocados.png',
    imageAlt: 'Open carton of Fuerte green-skin avocados',
  }),
  P({
    id: 'mango',
    slug: 'mango',
    fruit: 'mango',
    form: 'fresh',
    cell: 'fresh',
    name: 'Mango',
    code: 'TD-MG-FR',
    short: 'Apple and Kent. Sweet, low-fibre, with a red-orange blush.',
    desc: 'Apple, the Gulf favourite, and Kent, preferred by European programmes. Harvested mature-green for sea freight or tree-ripe for air, and hot-water treated where the destination requires it.',
    season: 'ppaooooooaap',
    option: { label: 'Counts', choices: ['6–8', '9–10', '11–12', 'Mixed'] },
    spec: {
      Varieties: 'Apple, Kent',
      Counts: '6–12 per 4 kg carton',
      Stem: 'Stalk trimmed to about 5 mm, desapped',
      'Shelf life': '14–21 days in cold storage',
      Season: 'October to March (peak December to February)',
      Maturity: 'Brix ≥ 14° at eating ripeness',
      Carton: '4 kg single-layer, count-marked',
      Pallet: '20 pallets per 40 ft reefer; built pallets by air',
      Temperature: '10–12 °C',
      Freight: 'Air from Nairobi (24–48 h) · Sea from Mombasa',
    },
    uses: ['Retail, ripe or ready-to-ripen', 'Wholesale and food service', 'Fresh-cut processing'],
    image: 'images/todara-06b-open-carton-kent-mangoes.jpg',
    imageAlt: 'Open Todara carton of Kent mangoes',
  }),
  P({
    id: 'iqf-avo-halves',
    slug: 'iqf-avocado-halves',
    fruit: 'avocado',
    form: 'iqf',
    cell: 'halves',
    name: 'IQF avocado halves',
    code: 'TD-AV-IH',
    short: 'Peeled, destoned Hass halves, frozen individually.',
    desc: 'Hass halves treated against browning and individually quick frozen, for guacamole, ready meals and food service.',
    season: 'aaaaaaaaaaaa',
    option: { label: 'Pack', choices: ['10 kg master carton', 'Retail packs'] },
    spec: {
      Variety: 'Hass',
      Cut: 'Halves, peeled and destoned',
      Size: 'Graded by weight',
      Treatment: 'Anti-browning treatment before freezing',
      'Core temperature': '≤ −18 °C',
      Pack: '10 kg master carton, food-grade PE liner',
      Load: 'Approx. 20 t net per 40 ft reefer',
      'Shelf life': '24 months at ≤ −18 °C',
    },
    uses: ['Guacamole and dips', 'Ready meals and sushi', 'Food-service kitchens'],
    image: 'images/todara-iqf-avocado-halves.jpeg',
    imageAlt: 'IQF Hass avocado halves, peeled and destoned',
  }),
  P({
    id: 'iqf-avo-dice',
    slug: 'iqf-avocado-dice',
    fruit: 'avocado',
    form: 'iqf',
    cell: 'dice',
    name: 'IQF avocado dice',
    code: 'TD-AV-ID',
    short: 'Hass dice in 10, 15 or 20 mm, free-flowing.',
    desc: 'Hass avocado diced to size and individually quick frozen so pieces stay separate, for salads, bowls and food service.',
    season: 'aaaaaaaaaaaa',
    option: { label: 'Cut size', choices: ['10 × 10 mm', '15 × 15 mm', '20 × 20 mm'] },
    spec: {
      Variety: 'Hass',
      Cut: 'Dice, peeled',
      Size: '10, 15 or 20 mm',
      Treatment: 'Anti-browning treatment before freezing',
      'Core temperature': '≤ −18 °C',
      Pack: '10 kg master carton, food-grade PE liner',
      Load: 'Approx. 20 t net per 40 ft reefer',
      'Shelf life': '24 months at ≤ −18 °C',
    },
    uses: ['Salads and poke bowls', 'Ready meals and sandwiches', 'Food service'],
    image: 'images/todara-07-iqf-diced-avocado.jpg',
    imageAlt: 'IQF diced Hass avocado, free-flowing pieces',
  }),
  P({
    id: 'iqf-mango-dice',
    slug: 'iqf-mango-dice',
    fruit: 'mango',
    form: 'iqf',
    cell: 'dice',
    name: 'IQF mango dice',
    code: 'TD-MG-ID',
    short: 'Kent mango dice for smoothies, desserts and bakery.',
    desc: 'Ripe Kent mango, peeled, diced and individually quick frozen so pieces stay free-flowing. Frozen in season, shipped from cold store all year.',
    season: 'aaaaaaaaaaaa',
    option: { label: 'Cut size', choices: ['10 × 15 × 20 mm', 'Custom to spec'] },
    spec: {
      Variety: 'Kent',
      Cut: 'Dice, peeled',
      Size: '10 × 15 × 20 mm; tolerance up to 20 × 20 × 30 mm',
      Brix: '≥ 14°',
      'Core temperature': '≤ −18 °C',
      Pack: '10 kg master carton, food-grade PE liner',
      Load: 'Approx. 20–22 t net per 40 ft reefer',
      'Shelf life': '24 months at ≤ −18 °C',
    },
    uses: ['Smoothies and juice bars', 'Yoghurt, dessert and bakery fillings', 'Food service'],
    image: 'images/todara-09-iqf-mango-dice.png',
    imageAlt: 'IQF Kent mango dice',
  }),
  P({
    id: 'iqf-mango-halves',
    slug: 'iqf-mango-halves-and-cheeks',
    fruit: 'mango',
    form: 'iqf',
    cell: 'halves',
    name: 'IQF mango halves and cheeks',
    code: 'TD-MG-IH',
    short: 'Peeled halves or cheeks, frozen at full ripeness.',
    desc: 'Mango halves or cheeks cut from ripe fruit and individually quick frozen, for dessert, bakery and food-service menus.',
    season: 'aaaaaaaaaaaa',
    option: { label: 'Cut', choices: ['Halves', 'Cheeks'] },
    spec: {
      Variety: 'Kent, Apple',
      Cut: 'Halves or cheeks, peeled',
      Size: 'Graded by weight',
      Brix: '≥ 14°',
      'Core temperature': '≤ −18 °C',
      Pack: '10 kg master carton, food-grade PE liner',
      Load: 'Approx. 20 t net per 40 ft reefer',
      'Shelf life': '24 months at ≤ −18 °C',
    },
    uses: ['Desserts and plated dishes', 'Bakery and toppings', 'Food service'],
    image: 'images/todara-08-iqf-mango-halves-seedless.jpg',
    imageAlt: 'IQF mango halves, peeled and seedless',
  }),
  P({
    id: 'mango-puree',
    slug: 'mango-puree',
    fruit: 'mango',
    form: 'puree',
    cell: 'puree',
    name: 'Mango puree',
    code: 'TD-MG-PU',
    short: 'Single-strength puree for juice, dairy, bakery and baby food.',
    desc: 'Ripe Kenyan mango, pulped, refined and aseptically packed. Produced in season and shipped from stock all year.',
    season: 'aaaaaaaaaaaa',
    option: { label: 'Pack', choices: ['215 kg aseptic drum', '20 kg aseptic bag-in-box'] },
    spec: {
      Variety: 'Apple, Kent; blends on request',
      Brix: '≥ 14° single strength (typically 14–18°)',
      Acidity: '0.3–0.8% as citric acid',
      pH: '3.5–4.2',
      Microbiology: 'Commercially sterile',
      Pack: '215 kg aseptic bag in steel drum; 20 kg bag-in-box',
      Storage: 'Ambient, below 25 °C',
      'Shelf life': '18 months unopened',
      Documents: 'Certificate of analysis per lot',
    },
    uses: ['Juices, nectars and drinks', 'Dairy, ice cream and yoghurt', 'Bakery, confectionery and baby food'],
    image: 'images/todara-11-mango-puree-drum.jpg',
    imageAlt: 'Todara mango puree in a 220 litre aseptic drum',
  }),
  P({
    id: 'avo-pulp',
    slug: 'avocado-puree-and-pulp',
    fruit: 'avocado',
    form: 'puree',
    cell: 'puree',
    name: 'Avocado puree and pulp',
    code: 'TD-AV-PU',
    short: 'Hass pulp for guacamole, dips and spreads.',
    desc: 'Ripe Hass avocado, pulped and protected against browning, then frozen for guacamole, dip and spread manufacturers.',
    season: 'aaaaaaaaaaaa',
    option: { label: 'Pack', choices: ['1 kg frozen bags', '10 kg frozen bags'] },
    spec: {
      Variety: 'Hass',
      Acidity: 'Acidulated to prevent browning',
      pH: 'To customer specification',
      Microbiology: 'Tested per lot',
      Pack: '1 kg or 10 kg frozen bags',
      Storage: '≤ −18 °C',
      'Shelf life': '18 months frozen',
      Documents: 'Certificate of analysis per lot',
    },
    uses: ['Guacamole and dips', 'Spreads and dressings', 'Food-service sauces'],
    image: 'images/todara-02b-puree-drum-and-avocado-pulp.jpg',
    imageAlt: 'Avocado pulp packed for freezing beside a puree drum',
  }),
];

export function productById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function productBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function formOf(product: Product): ProductForm {
  return forms[product.form];
}

export function productsInForm(form: FormKey): Product[] {
  return products.filter((p) => p.form === form);
}

/** The product's specification rows, in the order its form lists the fields (fields it lacks are skipped). */
export function specRows(product: Product, limit?: number): { k: string; v: string }[] {
  const rows = forms[product.form].fields.filter((k) => product.spec[k]).map((k) => ({ k, v: product.spec[k] as string }));
  return limit === undefined ? rows : rows.slice(0, limit);
}

/** Other forms of the same fruit (the product page's "Also available as"). */
export function alsoAvailable(product: Product): Product[] {
  return products.filter((p) => p.fruit === product.fruit && p.id !== product.id);
}
