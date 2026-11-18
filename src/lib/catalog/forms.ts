/**
 * The three forms Todara sells in (the design's FORMS): colours, temperatures, the desk an enquiry goes to,
 * which specification fields apply and the cold chain for that form.
 */
export type FormKey = 'fresh' | 'iqf' | 'puree';

export type ChainStep = { n: number; title: string; detail: string };

export type ProductForm = {
  key: FormKey;
  label: string;
  /** Dot, border and accent colour. */
  dot: string;
  /** Light background tint. */
  tint: string;
  /** Text colour on the tint. */
  ink: string;
  /** Badge background and text on product photos. */
  badgeBg: string;
  badgeInk: string;
  buyer: string;
  temp: string;
  /** The sales desk an enquiry for this form is routed to. */
  desk: string;
  /** Specification fields shown for this form, in order. */
  fields: readonly string[];
  chain: readonly ChainStep[];
  /** Range card photo (path in the media store). */
  image: string;
  imageAlt: string;
};

const chain = (steps: [string, string][]): ChainStep[] => steps.map(([title, detail], i) => ({ n: i + 1, title, detail }));

export const forms: Record<FormKey, ProductForm> = {
  fresh: {
    key: 'fresh',
    label: 'Fresh fruit',
    dot: '#6F9A4C',
    tint: '#E3ECDD',
    ink: '#1E3A2F',
    badgeBg: '#1E3A2F',
    badgeInk: '#F4EFE4',
    buyer: 'For importers, ripeners and distributors',
    temp: '5–13 °C',
    desk: 'fresh fruit desk',
    fields: [
      'Varieties',
      'Counts',
      'Stem',
      'Shelf life',
      'Growing altitude',
      'Season',
      'Growing areas',
      'Maturity',
      'Carton',
      'Pallet',
      'Temperature',
      'Freight',
    ],
    chain: chain([
      ['Harvest', 'At dry-matter or brix maturity'],
      ['Pre-cool', 'Field heat removed within hours'],
      ['5–13 °C', 'Reefer, CA by sea for avocado'],
      ['Arrival', 'Pulp temperature logged throughout'],
    ]),
    image: 'images/todara-01b-cartons-stacked-and-open.jpg',
    imageAlt: 'Todara cartons of Hass avocado and Kenyan mango, stacked and open',
  },
  iqf: {
    key: 'iqf',
    label: 'IQF frozen',
    dot: '#3F6B7A',
    tint: '#DCE8EC',
    ink: '#2E5361',
    badgeBg: '#3F6B7A',
    badgeInk: '#FFFFFF',
    buyer: 'For food manufacturers and food service',
    temp: '−18 °C',
    desk: 'frozen desk',
    fields: ['Variety', 'Cut', 'Size', 'Treatment', 'Brix', 'Core temperature', 'Pack', 'Load', 'Shelf life'],
    chain: chain([
      ['Prepare', 'Peeled, cut and graded'],
      ['Freeze', 'Individually quick frozen'],
      ['−18 °C', 'Core temperature in cold store'],
      ['−20 °C', 'Reefer set point at sea'],
    ]),
    image: 'images/todara-iqf-avocado-halves.jpeg',
    imageAlt: 'IQF avocado halves, frosted and free-flowing',
  },
  puree: {
    key: 'puree',
    label: 'Puree and pulp',
    dot: '#C9973F',
    tint: '#F3E6CB',
    ink: '#7A5A1F',
    badgeBg: '#C9973F',
    badgeInk: '#3A2A1F',
    buyer: 'For beverage, dairy and bakery manufacturers',
    temp: 'Ambient or −18 °C',
    desk: 'puree desk',
    fields: ['Variety', 'Brix', 'Acidity', 'pH', 'Microbiology', 'Pack', 'Storage', 'Shelf life', 'Documents'],
    chain: chain([
      ['Pulp', 'Ripe fruit pulped and refined'],
      ['Pack', 'Aseptic for mango, frozen for avocado'],
      ['Ambient', 'Mango puree below 25 °C'],
      ['−18 °C', 'Avocado pulp, frozen chain'],
    ]),
    image: 'images/todara-02b-puree-drum-and-avocado-pulp.jpg',
    imageAlt: 'Todara mango puree drum, avocado pulp carton and aseptic bag',
  },
};

/** Forms in the order the design lists them. */
export const formList: readonly ProductForm[] = [forms.fresh, forms.iqf, forms.puree];

export function isFormKey(value: string | null | undefined): value is FormKey {
  return value === 'fresh' || value === 'iqf' || value === 'puree';
}
