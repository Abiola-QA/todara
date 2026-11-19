import { emptyDetails, type QuoteDetails } from '@/lib/quote';

import { quoteFieldErrors, quoteSchema } from '../actions/quote-schema';
import { deskList, desksFor, itemsLine, sentSummary, termsLine } from '../utils/quote-summary';
import { validateQuote } from '../utils/validate-quote';

const details: QuoteDetails = {
  ...emptyDetails,
  company: 'Acme Foods',
  name: 'Jane van Dijk',
  email: 'jane@acme.example',
  country: 'Netherlands',
  port: 'Rotterdam',
};
const basket = [
  { id: 'hass', volume: '1 × 40 ft per week', opt: '16–18' },
  { id: 'iqf-mango-dice', volume: '20 t', opt: '10 × 15 × 20 mm' },
  { id: 'iqf-avo-dice', volume: '10 t', opt: '10 × 10 mm' },
];

describe('validateQuote (the design’s checks)', () => {
  it('returns the design’s messages for everything missing', () => {
    expect(validateQuote([], emptyDetails, false)).toEqual({
      basket: 'Add at least one product',
      company: 'Enter your company name',
      name: 'Enter your name',
      email: 'Enter a valid work email',
      country: 'Enter your country',
      consent: 'Please agree so we can use your details to reply',
    });
  });

  it('asks for a volume on every product', () => {
    expect(validateQuote([{ id: 'hass', volume: '  ', opt: 'Mixed' }], details, true)).toEqual({ vol: 'Give an approximate volume for each product' });
  });

  it('passes a complete quote', () => {
    expect(validateQuote(basket, details, true)).toEqual({});
  });
});

describe('quote summary', () => {
  it('routes to one desk per form, in order', () => {
    expect(desksFor(basket)).toBe('fresh fruit desk and frozen desk');
  });

  it('names the desks in plain English for emails', () => {
    expect(deskList(basket.slice(0, 1))).toBe('fresh fruit desk');
    expect(deskList(basket)).toBe('fresh fruit and frozen desks');
    expect(deskList([...basket, { id: 'mango-puree', volume: '1 drum', opt: '215 kg aseptic drum' }])).toBe('fresh fruit, frozen and puree desks');
  });

  it('builds the confirmation lines like the design', () => {
    expect(itemsLine(basket.slice(0, 1))).toBe('Hass avocado · 16–18 · 1 × 40 ft per week');
    expect(termsLine({ incoterm: 'FOB Mombasa', port: '  ' })).toBe('FOB Mombasa');
    const sent = sentSummary('TD-Q-12345', basket, details);
    expect(sent.first).toBe('Jane');
    expect(sent.terms).toBe('FOB Mombasa · Rotterdam');
    expect(sent.whatsapp).toBe(`https://wa.me/254183062440?text=${encodeURIComponent('Hello Todara, following up on enquiry TD-Q-12345 from Acme Foods.')}`);
  });
});

describe('quoteSchema (server)', () => {
  it('accepts a valid quote', () => {
    expect(quoteSchema.safeParse({ basket, details, consent: true }).success).toBe(true);
  });

  it('rejects unknown products, options that do not belong to the product and invented dropdown values', () => {
    expect(quoteSchema.safeParse({ basket: [{ id: 'durian', volume: '1 t', opt: 'x' }], details, consent: true }).success).toBe(false);
    expect(quoteSchema.safeParse({ basket: [{ id: 'hass', volume: '1 t', opt: '215 kg aseptic drum' }], details, consent: true }).success).toBe(false);
    expect(quoteSchema.safeParse({ basket, details: { ...details, incoterm: 'DDP' }, consent: true }).success).toBe(false);
  });

  it('rejects duplicate products, missing consent and oversized text', () => {
    expect(quoteSchema.safeParse({ basket: [basket[0], basket[0]], details, consent: true }).success).toBe(false);
    expect(quoteSchema.safeParse({ basket, details, consent: false }).success).toBe(false);
    expect(quoteSchema.safeParse({ basket, details: { ...details, message: 'x'.repeat(3001) }, consent: true }).success).toBe(false);
  });

  it('maps errors to the form’s own fields', () => {
    const result = quoteSchema.safeParse({ basket: [{ id: 'hass', volume: '', opt: '16–18' }], details: { ...details, email: 'nope' }, consent: false });
    expect(result.success).toBe(false);
    expect(result.success ? {} : quoteFieldErrors(result.error)).toMatchObject({
      vol: 'Give an approximate volume for each product',
      email: 'Enter a valid work email',
      consent: 'Please agree so we can use your details to reply',
    });
  });
});
