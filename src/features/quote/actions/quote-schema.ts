import { z } from 'zod';

import { productById } from '@/lib/catalog';

import { buyerOptions, frequencyOptions, incotermOptions } from '../data/quote-options';
import { EMAIL_PATTERN } from '../utils/validate-quote';

const text = (max: number) => z.string().trim().max(max);
const required = (message: string, max: number) => z.string(message).trim().min(1, message).max(max, message);

const item = z.object({ id: z.string().max(64), volume: required('Give an approximate volume for each product', 200), opt: text(100) }).refine((b) => {
  const product = productById(b.id);
  return Boolean(product && product.option.choices.includes(b.opt));
}, 'Unknown product or option');

/** Server-side rules for a quote request: the design's checks plus length limits and known values only. */
export const quoteSchema = z.object({
  basket: z
    .array(item)
    .min(1, 'Add at least one product')
    .max(20)
    .refine((items) => new Set(items.map((b) => b.id)).size === items.length, 'Each product once'),
  details: z.object({
    company: required('Enter your company name', 160),
    name: required('Enter your name', 120),
    email: z.string().trim().max(254, 'Enter a valid work email').regex(EMAIL_PATTERN, 'Enter a valid work email'),
    country: required('Enter your country', 80),
    phone: text(40),
    buyer: z.enum(buyerOptions),
    frequency: z.enum(frequencyOptions),
    incoterm: z.enum(incotermOptions),
    port: text(120),
    delivery: text(120),
    message: text(3000),
  }),
  consent: z.literal(true, 'Please agree so we can use your details to reply'),
});

export type QuoteSubmission = z.infer<typeof quoteSchema>;

/** Name of the form field carrying the quote as JSON. */
export const QUOTE_PAYLOAD_FIELD = 'quote';

/**
 * Server errors keyed like the form's own (company, email, …; "basket" for the product list and "vol" for a
 * missing volume), so a rejected request highlights the same places as the browser check.
 */
export function quoteFieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const [top, second, third] = issue.path;
    const key = top === 'details' ? String(second) : top === 'basket' ? (third === 'volume' ? 'vol' : 'basket') : String(top);
    out[key] ??= issue.message;
  }
  return out;
}
