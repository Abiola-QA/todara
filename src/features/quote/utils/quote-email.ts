import { formOf, productById } from '@/lib/catalog';
import { renderSubmission } from '@/lib/forms';

import type { QuoteSubmission } from '../actions/quote-schema';

import { desksFor } from './quote-summary';

/** The email the export team receives for one quote request (reply goes straight to the buyer). */
export function quoteEmail(ref: string, { basket, details }: QuoteSubmission) {
  const desk = desksFor(basket);
  const products = basket
    .map((b) => {
      const p = productById(b.id);
      return p ? `${p.name} (${p.code}, ${formOf(p).label}) · ${p.option.label}: ${b.opt} · Volume: ${b.volume}` : b.id;
    })
    .join('\n');
  return {
    subject: `Quote request ${ref} · ${details.company} · ${desk}`,
    replyTo: details.email,
    ...renderSubmission(`Quote request ${ref} for the ${desk}`, [
      { label: 'Reference', value: ref },
      { label: 'Desk', value: desk },
      { label: 'Products', value: products },
      { label: 'Frequency', value: details.frequency },
      { label: 'Incoterm', value: details.incoterm },
      { label: 'Destination port', value: details.port },
      { label: 'Target start', value: details.delivery },
      { label: 'Company', value: details.company },
      { label: 'Name', value: details.name },
      { label: 'Work email', value: details.email },
      { label: 'Country', value: details.country },
      { label: 'Phone or WhatsApp', value: details.phone },
      { label: 'Business type', value: details.buyer },
      { label: 'Notes', value: details.message },
      { label: 'Consent', value: 'Agreed to the privacy policy (Kenya Data Protection Act, 2019)' },
    ]),
  };
}
