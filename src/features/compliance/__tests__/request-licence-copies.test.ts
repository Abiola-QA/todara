vi.mock('server-only', () => ({}));

const mocks = vi.hoisted(() => ({
  env: { FORMS_DELIVERY: 'resend' as 'resend' | 'none', SITE_URL: 'https://todarakenya.com', SITE_INDEXING: 'off', QUOTE_TO_EMAIL: 'export@todarakenya.com' },
  send: vi.fn(),
  ip: vi.fn(async () => '198.51.100.1'),
}));
vi.mock('@/config/env', () => ({ env: mocks.env }));
vi.mock('@/lib/forms/send-email', () => ({ sendFormEmail: mocks.send }));
vi.mock('@/lib/forms/client-ip', () => ({ clientIp: mocks.ip }));

import { ELAPSED_FIELD, HONEYPOT_FIELD } from '@/lib/forms';

import { LICENCE_REQUEST_FIELD } from '../actions/licence-request-schema';
import { requestLicenceCopies } from '../actions/request-licence-copies';
import { licenceRequestEmail } from '../emails/licence-request-email';

const valid = { name: 'Jane Buyer', company: 'Acme <Foods>', emails: ['jane@acme.example', 'qa@acme.example'], documents: ['afa', 'haccp'], consent: true };

const form = (payload: unknown, extra: Record<string, string> = { [ELAPSED_FIELD]: '9000' }) => {
  const fd = new FormData();
  fd.set(LICENCE_REQUEST_FIELD, JSON.stringify(payload));
  for (const [k, v] of Object.entries(extra)) fd.set(k, v);
  return fd;
};

describe('requestLicenceCopies', () => {
  beforeEach(() => {
    mocks.send.mockReset().mockResolvedValue({ ok: true });
    mocks.env.FORMS_DELIVERY = 'resend';
    mocks.ip.mockImplementation(async () => `198.51.100.${Math.floor(Math.random() * 250)}`);
  });

  it('emails the export team with the documents and every address', async () => {
    const result = await submitAndExpectOk(valid);
    expect(result.emails).toEqual(['jane@acme.example', 'qa@acme.example']);
    const email = mocks.send.mock.calls[0]![0];
    expect(email.subject).toMatch(/^Licence copy request TD-L-\d{5} · Acme <Foods> · 2 documents$/);
    expect(email.replyTo).toBe('jane@acme.example');
    expect(email.to).toBeUndefined();
  });

  it('rejects unknown documents, bad addresses and missing consent', async () => {
    const result = await requestLicenceCopies(form({ ...valid, documents: ['passport'], emails: ['nope'], consent: false }));
    expect(result).toMatchObject({ ok: false, fieldErrors: { picks: expect.any(String), e0: 'Enter a valid email address', consent: expect.any(String) } });
    expect(mocks.send).not.toHaveBeenCalled();
  });

  it('pretends success to bots but sends nothing', async () => {
    expect((await requestLicenceCopies(form(valid, { [HONEYPOT_FIELD]: 'x', [ELAPSED_FIELD]: '9000' }))).ok).toBe(true);
    expect(mocks.send).not.toHaveBeenCalled();
  });

  it('says how to reach the team when sending fails', async () => {
    mocks.send.mockResolvedValue({ ok: false, reason: 'failed' });
    expect(await requestLicenceCopies(form(valid))).toMatchObject({ ok: false, message: expect.stringContaining('export@todarakenya.com') });
  });

  it('only logs when delivery is switched off', async () => {
    mocks.env.FORMS_DELIVERY = 'none';
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    expect((await requestLicenceCopies(form(valid))).ok).toBe(true);
    expect(mocks.send).not.toHaveBeenCalled();
  });
});

async function submitAndExpectOk(payload: unknown) {
  const result = await requestLicenceCopies(form(payload));
  if (!result.ok) throw new Error(result.message);
  return result;
}

describe('licenceRequestEmail', () => {
  it('lists the documents and addresses, escapes what was typed and has a reply button to everyone', () => {
    const email = licenceRequestEmail('TD-L-12345', { ...valid, documents: ['afa', 'haccp'] } as never);
    expect(email.html).toContain('Acme &lt;Foods&gt; would like 2 documents');
    expect(email.html).toContain('AFA–HCD export licence');
    expect(email.html).toContain('HACCP certificate');
    expect(email.html).not.toContain('KEPHIS exporter registration');
    expect(email.html).toContain('mailto:jane@acme.example,qa@acme.example?subject=');
    expect(email.text).toContain('- qa@acme.example');
  });
});
