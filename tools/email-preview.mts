/**
 * Renders the quote emails with a sample enquiry into .compare/emails/ for design review:
 *   node --experimental-strip-types --import ./tools/ts-loader/register.mjs tools/email-preview.mts
 * Reads .env.local so images point at the Blob store, as they will in production.
 */
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';

if (existsSync('.env.local')) process.loadEnvFile('.env.local');

const { quoteNotificationEmail } = await import('../src/features/quote/emails/quote-notification-email');
const { quoteConfirmationEmail } = await import('../src/features/quote/emails/quote-confirmation-email');

const quote = {
  basket: [
    { id: 'hass', volume: '1 × 40 ft per week', opt: '16–18' },
    { id: 'iqf-mango-dice', volume: '20 t', opt: '10 × 15 × 20 mm' },
    { id: 'mango-puree', volume: '40 drums', opt: '215 kg aseptic drum' },
  ],
  details: {
    company: 'Van Dijk Fresh Imports B.V.',
    name: 'Sanne van Dijk',
    email: 'sanne@vandijkfresh.example',
    country: 'Netherlands',
    phone: '+31 6 1234 5678',
    buyer: 'Importer / distributor',
    frequency: 'Weekly programme',
    incoterm: 'CIF',
    port: 'Rotterdam',
    delivery: 'From March 2027',
    message: 'Please include the GlobalG.A.P. certificate.\nWe would like samples of the IQF dice first.',
  },
  consent: true as const,
};
const input = { ref: 'TD-Q-48213', quote, receivedAt: new Date('2026-11-19T11:32:00Z') };

mkdirSync('.compare/emails', { recursive: true });
const team = quoteNotificationEmail(input as never);
const buyer = quoteConfirmationEmail(input as never);
writeFileSync('.compare/emails/notification.html', team.html);
writeFileSync('.compare/emails/confirmation.html', buyer.html);
writeFileSync('.compare/emails/notification.txt', team.text);
writeFileSync('.compare/emails/confirmation.txt', buyer.text);
console.log(`team:  ${team.subject}\nbuyer: ${buyer.subject}`);
