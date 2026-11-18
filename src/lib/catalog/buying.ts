import type { FormKey } from './forms';

/** Commercial terms shown on each product page (the design's TERMS). */
export function buyingTerms(form: FormKey): { k: string; v: string }[] {
  return [
    { k: 'Price basis', v: form === 'fresh' ? 'USD, FOB Mombasa or FCA Nairobi' : 'USD, FOB Mombasa' },
    { k: 'Delivered terms', v: 'CFR or CIF on request' },
    { k: 'Samples', v: 'Available on request' },
    { k: 'Documents', v: form === 'fresh' ? 'Phytosanitary and origin certificates' : 'Phytosanitary, origin and analysis certificates' },
  ];
}

/** Two questions per form, answered on each product page (the design's FORM_FAQ). */
export const formQuestions: Record<FormKey, { q: string; a: string }[]> = {
  fresh: [
    {
      q: 'How is maturity checked?',
      a: 'Avocado is harvested at a minimum dry matter and mango at a minimum brix, checked before packing and recorded for each lot.',
    },
    {
      q: 'Can you ship by air?',
      a: 'Yes. Air freight from Nairobi suits trial orders and short programmes; sea freight from Mombasa suits regular programmes.',
    },
  ],
  iqf: [
    { q: 'Will the pieces stay separate?', a: 'Yes. Individual quick freezing keeps pieces free-flowing, so you take out only what you need.' },
    { q: 'Can you cut to our size?', a: 'Cut size and tolerance are agreed in writing before production, for example 10 × 15 × 20 mm.' },
  ],
  puree: [
    {
      q: 'How is it packed and stored?',
      a: 'Mango puree is aseptically packed in 215 kg drums and stored ambient. Avocado pulp is shipped frozen.',
    },
    {
      q: 'Do you send a certificate of analysis?',
      a: 'Yes. Every lot ships with a certificate of analysis covering brix, acidity, pH and microbiology.',
    },
  ],
};
