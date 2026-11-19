vi.mock('server-only', () => ({}));

const envMock = vi.hoisted(() => ({
  env: {
    RESEND_API_KEY: undefined as string | undefined,
    QUOTE_TO_EMAIL: 'export@todarakenya.com',
    FORMS_FROM_EMAIL: 'Todara website <website@todarakenya.com>',
  },
}));
vi.mock('@/config/env', () => envMock);

import { sendFormEmail } from '../send-email';

const email = { subject: 'Quote request', text: 'hi', html: '<p>hi</p>', replyTo: 'ada@example.com' };

describe('sendFormEmail', () => {
  afterEach(() => {
    envMock.env.RESEND_API_KEY = undefined;
  });

  it('sends nothing and says so when no API key is configured', async () => {
    const fetchImpl = vi.fn();
    await expect(sendFormEmail(email, fetchImpl)).resolves.toEqual({ ok: false, reason: 'not-configured' });
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it('posts to Resend with the export inbox and the visitor as reply-to', async () => {
    envMock.env.RESEND_API_KEY = 're_test';
    const fetchImpl = vi.fn().mockResolvedValue(new Response('{}', { status: 200 }));
    await expect(sendFormEmail(email, fetchImpl)).resolves.toEqual({ ok: true });
    const [url, init] = fetchImpl.mock.calls[0]!;
    expect(url).toBe('https://api.resend.com/emails');
    const body = JSON.parse(init.body);
    expect(body.to).toEqual(['export@todarakenya.com']);
    expect(body.reply_to).toBe('ada@example.com');
    expect(init.headers.Authorization).toBe('Bearer re_test');
  });

  it('sends to another recipient when asked (the buyer’s confirmation), stripping header injection', async () => {
    envMock.env.RESEND_API_KEY = 're_test';
    const fetchImpl = vi.fn().mockResolvedValue(new Response('{}', { status: 200 }));
    await sendFormEmail({ ...email, to: 'buyer@example.com\r\nBcc: victim@example.com' }, fetchImpl);
    const body = JSON.parse(fetchImpl.mock.calls[0]![1].body);
    expect(body.to).toEqual(['buyer@example.com Bcc: victim@example.com']);
    expect(body.to[0]).not.toMatch(/[\r\n]/);
  });

  it('reports a failure instead of pretending the email went out', async () => {
    envMock.env.RESEND_API_KEY = 're_test';
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const fetchImpl = vi.fn().mockResolvedValue(new Response('nope', { status: 422 }));
    await expect(sendFormEmail(email, fetchImpl)).resolves.toEqual({ ok: false, reason: 'failed' });
  });

  it('survives a network error', async () => {
    envMock.env.RESEND_API_KEY = 're_test';
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const fetchImpl = vi.fn().mockRejectedValue(new Error('offline'));
    await expect(sendFormEmail(email, fetchImpl)).resolves.toEqual({ ok: false, reason: 'failed' });
  });
});
