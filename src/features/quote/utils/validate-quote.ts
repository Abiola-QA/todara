import type { BasketItem, QuoteDetails } from '@/lib/quote';

/** Error keys the form shows, as in the design (basket and vol sit under the product list). */
export type QuoteErrorKey = 'basket' | 'vol' | 'company' | 'name' | 'email' | 'country' | 'consent';
export type QuoteErrors = Partial<Record<QuoteErrorKey, string>>;

/** The design's email check. */
export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** The design's submit() checks and messages, run in the browser before anything is sent. */
export function validateQuote(basket: readonly BasketItem[], details: QuoteDetails, consent: boolean): QuoteErrors {
  const errs: QuoteErrors = {};
  if (!basket.length) errs.basket = 'Add at least one product';
  if (basket.some((b) => !b.volume.trim())) errs.vol = 'Give an approximate volume for each product';
  if (!details.company.trim()) errs.company = 'Enter your company name';
  if (!details.name.trim()) errs.name = 'Enter your name';
  if (!EMAIL_PATTERN.test(details.email.trim())) errs.email = 'Enter a valid work email';
  if (!details.country.trim()) errs.country = 'Enter your country';
  if (!consent) errs.consent = 'Please agree so we can use your details to reply';
  return errs;
}
