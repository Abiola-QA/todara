import { formOf, productById } from '@/lib/catalog';
import type { BasketItem, QuoteDetails } from '@/lib/quote';
import { whatsappLink } from '@/lib/whatsapp';

/** The desks an enquiry goes to, one per form in the quote ("fresh fruit desk and frozen desk"). */
export function desksFor(basket: readonly BasketItem[]): string {
  const desks: string[] = [];
  for (const item of basket) {
    const product = productById(item.id);
    if (!product) continue;
    const desk = formOf(product).desk;
    if (!desks.includes(desk)) desks.push(desk);
  }
  return desks.join(' and ');
}

/**
 * The desks in plain English for emails: "fresh fruit desk", "fresh fruit and frozen desks",
 * "fresh fruit, frozen and puree desks". (The website's on-screen confirmation keeps the design's wording.)
 */
export function deskList(basket: readonly BasketItem[]): string {
  const names = desksFor(basket)
    .split(' and ')
    .filter(Boolean)
    .map((d) => d.replace(/ desk$/, ''));
  if (names.length <= 1) return names[0] ? `${names[0]} desk` : 'export desk';
  return `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]} desks`;
}

/** "Hass avocado · 16–18 · 1 × 40 ft per week  /  …" (the confirmation's Products line). */
export function itemsLine(basket: readonly BasketItem[]): string {
  return basket.map((b) => `${productById(b.id)?.name ?? b.id} · ${b.opt} · ${b.volume}`).join('  /  ');
}

/** "FOB Mombasa · Rotterdam" (the confirmation's Terms line). */
export function termsLine(details: Pick<QuoteDetails, 'incoterm' | 'port'>): string {
  return [details.incoterm, details.port.trim()].filter(Boolean).join(' · ');
}

/** What the confirmation panel shows once the enquiry is received. */
export type SentSummary = { ref: string; first: string; email: string; company: string; desk: string; items: string; terms: string; whatsapp: string };

export function sentSummary(ref: string, basket: readonly BasketItem[], details: QuoteDetails): SentSummary {
  const company = details.company.trim();
  return {
    ref,
    first: details.name.trim().split(/\s+/)[0] ?? '',
    email: details.email.trim(),
    company,
    desk: desksFor(basket),
    items: itemsLine(basket),
    terms: termsLine(details),
    whatsapp: whatsappLink(`Hello Todara, following up on enquiry ${ref} from ${company}.`),
  };
}
