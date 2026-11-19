import { emptyDetails } from '@/lib/quote';

import type { QuoteSubmission } from '../actions/quote-schema';
import { quoteConfirmationEmail } from '../emails/quote-confirmation-email';
import { buyerWhatsapp, nairobiTime, quoteNotificationEmail } from '../emails/quote-notification-email';

const quote: QuoteSubmission = {
  basket: [
    { id: 'hass', volume: '1 × 40 ft per week', opt: '16–18' },
    { id: 'mango-puree', volume: '40 drums', opt: '215 kg aseptic drum' },
  ],
  details: {
    ...emptyDetails,
    company: 'Van Dijk Fresh <Imports>',
    name: 'Sanne van Dijk',
    email: 'sanne@vandijk.example',
    country: 'Netherlands',
    phone: '+31 6 1234 5678',
    port: 'Rotterdam',
    message: 'Samples first <script>alert(1)</script>',
  },
  consent: true,
} as QuoteSubmission;
const input = { ref: 'TD-Q-48213', quote, receivedAt: new Date('2026-11-19T11:32:00Z') };

describe('quote notification email (export team)', () => {
  const email = quoteNotificationEmail(input);

  it('has a subject the team can sort by, and replies go to the buyer', () => {
    expect(email.subject).toBe('Quote request TD-Q-48213 · Van Dijk Fresh <Imports> · fresh fruit and puree desks');
    expect(email.replyTo).toBe('sanne@vandijk.example');
  });

  it('leads with the company, the product count, reply buttons and the time in Nairobi', () => {
    expect(email.html).toContain('Van Dijk Fresh &lt;Imports&gt; wants a quote for 2 products');
    expect(email.html).toContain('Reply to Sanne');
    expect(email.html).toContain('mailto:sanne@vandijk.example?subject=Your%20Todara%20quote%20TD-Q-48213');
    expect(email.html).toContain('WhatsApp Sanne');
    expect(email.html).toContain('19 November 2026, 14:32 EAT');
    expect(email.html).toContain('Spec TD-AV-HS');
  });

  it('escapes everything the buyer typed', () => {
    expect(email.html).not.toContain('<script>');
    expect(email.html).toContain('&lt;script&gt;');
    expect(email.html).not.toContain('<Imports>');
  });

  it('has a plain-text version with every section', () => {
    for (const part of ['PRODUCTS', 'TERMS', 'BUYER', 'NOTES', 'Hass avocado (Fresh fruit, spec TD-AV-HS) · Counts: 16–18 · Volume: 1 × 40 ft per week']) {
      expect(email.text).toContain(part);
    }
  });

  it('leaves out the WhatsApp button when the number is not in international form', () => {
    const local = quoteNotificationEmail({ ...input, quote: { ...quote, details: { ...quote.details, phone: '06 1234 5678' } } });
    expect(local.html).not.toContain('WhatsApp Sanne');
    expect(local.html).toContain('06 1234 5678');
  });
});

describe('quote confirmation email (buyer)', () => {
  const email = quoteConfirmationEmail(input);

  it('goes to the buyer, and replies go to the export inbox', () => {
    expect(email.to).toBe('sanne@vandijk.example');
    expect(email.replyTo).toBe('export@todarakenya.com');
    expect(email.subject).toBe('We have your enquiry TD-Q-48213 · Todara');
  });

  it('confirms the desk and reply time, lists the products and says what happens next', () => {
    expect(email.html).toContain('Thank you, Sanne.');
    expect(email.html).toContain('Your enquiry has gone to our fresh fruit and puree desks.');
    expect(email.html).toContain('Hass avocado');
    expect(email.html).toContain('Written offer');
    expect(email.html).toContain('Continue on WhatsApp');
    expect(email.html).toContain('https://todarakenya.com/privacy');
    expect(email.text).toContain('WHAT HAPPENS NEXT');
  });

  it('escapes the company name', () => {
    expect(email.html).toContain('Van Dijk Fresh &lt;Imports&gt;');
    expect(email.html).not.toContain('<Imports>');
  });
});

describe('helpers', () => {
  it('formats times in Nairobi time', () => {
    expect(nairobiTime(new Date('2026-01-05T21:05:00Z'))).toBe('6 January 2026, 00:05 EAT');
  });

  it('builds WhatsApp links only from international numbers', () => {
    expect(buyerWhatsapp('+971 50 123 4567', 'Hi')).toBe('https://wa.me/971501234567?text=Hi');
    expect(buyerWhatsapp('0044 20 7946 0958', 'Hi')).toBe('https://wa.me/442079460958?text=Hi');
    expect(buyerWhatsapp('050 123 4567', 'Hi')).toBeNull();
  });
});
