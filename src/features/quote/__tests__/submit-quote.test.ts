vi.mock('server-only', () => ({}));

const mocks = vi.hoisted(() => ({
  env: { FORMS_DELIVERY: 'resend' as 'resend' | 'none' },
  send: vi.fn(),
  ip: vi.fn(async () => '102.89.1.20'),
}));
vi.mock('@/config/env', () => ({ env: mocks.env }));
vi.mock('@/lib/forms/send-email', () => ({ sendFormEmail: mocks.send }));
vi.mock('@/lib/forms/client-ip', () => ({ clientIp: mocks.ip }));

import { ELAPSED_FIELD, HONEYPOT_FIELD } from '@/lib/forms';
import { emptyDetails } from '@/lib/quote';

import { QUOTE_PAYLOAD_FIELD } from '../actions/quote-schema';
import { submitQuote } from '../actions/submit-quote';

const valid = {
  basket: [{ id: 'mango-puree', volume: '2 drums', opt: '215 kg aseptic drum' }],
  details: { ...emptyDetails, company: 'Acme', name: 'Jane', email: 'jane@acme.example', country: 'UAE' },
  consent: true,
};

const form = (payload: unknown, extra: Record<string, string> = { [ELAPSED_FIELD]: '9000' }) => {
  const fd = new FormData();
  fd.set(QUOTE_PAYLOAD_FIELD, typeof payload === 'string' ? payload : JSON.stringify(payload));
  for (const [k, v] of Object.entries(extra)) fd.set(k, v);
  return fd;
};

describe('submitQuote', () => {
  beforeEach(() => {
    mocks.send.mockReset().mockResolvedValue({ ok: true });
    mocks.env.FORMS_DELIVERY = 'resend';
    mocks.ip.mockImplementation(async () => `198.51.100.${Math.floor(Math.random() * 250)}`);
  });

  it('emails a valid quote to the export team and returns a reference and the desk', async () => {
    const result = await submitQuote(form(valid));
    expect(result).toMatchObject({ ok: true, desk: 'puree desk', ref: expect.stringMatching(/^TD-Q-\d{5}$/) });
    expect(mocks.send).toHaveBeenCalledTimes(1);
    expect(mocks.send.mock.calls[0]![0].subject).toContain('Acme · puree desk');
  });

  it('pretends success to bots but sends nothing', async () => {
    const result = await submitQuote(form(valid, { [HONEYPOT_FIELD]: 'spam', [ELAPSED_FIELD]: '9000' }));
    expect(result.ok).toBe(true);
    expect(mocks.send).not.toHaveBeenCalled();
    await submitQuote(form(valid, { [ELAPSED_FIELD]: '300' }));
    expect(mocks.send).not.toHaveBeenCalled();
  });

  it('returns field errors for an invalid quote and never sends it', async () => {
    const result = await submitQuote(form({ ...valid, details: { ...valid.details, email: 'x' } }));
    expect(result).toMatchObject({ ok: false, fieldErrors: { email: 'Enter a valid work email' } });
    expect(mocks.send).not.toHaveBeenCalled();
    expect((await submitQuote(form('{broken'))).ok).toBe(false);
  });

  it('tells the buyer to email or WhatsApp when delivery fails, instead of claiming success', async () => {
    mocks.send.mockResolvedValue({ ok: false, reason: 'not-configured' });
    const result = await submitQuote(form(valid));
    expect(result).toMatchObject({ ok: false, message: expect.stringContaining('export@todarakenya.com') });
  });

  it('only logs the request when delivery is switched off (local development)', async () => {
    mocks.env.FORMS_DELIVERY = 'none';
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    expect((await submitQuote(form(valid))).ok).toBe(true);
    expect(mocks.send).not.toHaveBeenCalled();
  });

  it('rate-limits one connection after five sent enquiries', async () => {
    mocks.ip.mockImplementation(async () => '203.0.113.9');
    for (let i = 0; i < 5; i++) expect((await submitQuote(form(valid))).ok).toBe(true);
    const sixth = await submitQuote(form(valid));
    expect(sixth.ok).toBe(false);
  });
});
