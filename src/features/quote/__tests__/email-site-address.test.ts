import { emptyDetails } from '@/lib/quote';

import type { QuoteSubmission } from '../actions/quote-schema';

const quote = {
  basket: [{ id: 'mango', volume: '5 t', opt: 'Mixed' }],
  details: { ...emptyDetails, company: 'Acme', name: 'Jane Buyer', email: 'jane@acme.example', country: 'Oman' },
  consent: true,
} as QuoteSubmission;
const input = { ref: 'TD-Q-11111', quote, receivedAt: new Date('2026-11-19T08:00:00Z') };

async function loadEmails() {
  vi.resetModules();
  const confirmation = await import('../emails/quote-confirmation-email');
  const notification = await import('../emails/quote-notification-email');
  return { buyer: confirmation.quoteConfirmationEmail(input), team: notification.quoteNotificationEmail(input) };
}

describe('site address in the quote emails', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('uses the main site address by default', async () => {
    const { buyer, team } = await loadEmails();
    expect(buyer.html).toContain('href="https://todarakenya.com/products"');
    expect(buyer.html).toContain('href="https://todarakenya.com/privacy"');
    expect(buyer.html).toContain('sent a quote request on todarakenya.com');
    expect(team.html).toContain('Sent from the quote form on todarakenya.com');
  });

  it('follows EMAIL_SITE_URL, for links and the site name, without changing the main site address', async () => {
    vi.stubEnv('EMAIL_SITE_URL', 'https://todara-the-bug-detective.vercel.app/');
    const { buyer, team } = await loadEmails();
    expect(buyer.html).toContain('href="https://todara-the-bug-detective.vercel.app/products"');
    expect(buyer.html).toContain('href="https://todara-the-bug-detective.vercel.app/privacy"');
    expect(buyer.html).toContain('sent a quote request on todara-the-bug-detective.vercel.app');
    expect(buyer.text).toContain('Privacy policy: https://todara-the-bug-detective.vercel.app/privacy');
    expect(team.html).toContain('Sent from the quote form on todara-the-bug-detective.vercel.app');
    const { absoluteUrl } = await import('@/config/seo');
    expect(absoluteUrl('/privacy')).toBe('https://todarakenya.com/privacy');
  });

  it('drops "www." from the site name shown in the text', async () => {
    vi.stubEnv('EMAIL_SITE_URL', 'https://www.todarakenya.com');
    const { buyer } = await loadEmails();
    expect(buyer.html).toContain('sent a quote request on todarakenya.com');
    expect(buyer.html).toContain('href="https://www.todarakenya.com/privacy"');
  });
});
