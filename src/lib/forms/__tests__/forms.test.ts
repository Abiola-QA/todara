import { ELAPSED_FIELD, HONEYPOT_FIELD } from '../form-state';
import { createRateLimiter } from '../rate-limit';
import { escapeHtml, sanitizeHeader } from '../render-submission';
import { checkSpam, MIN_FILL_MS } from '../spam-guard';

const form = (fields: Record<string, string>) => {
  const fd = new FormData();
  for (const [k, v] of Object.entries(fields)) fd.set(k, v);
  return fd;
};

describe('checkSpam (fill time measured in the browser)', () => {
  it('accepts a person who spent a few seconds, whatever their device clock says', () => {
    expect(checkSpam(form({ [HONEYPOT_FIELD]: '', [ELAPSED_FIELD]: '8000' }))).toBe('ok');
  });

  it('flags instant submissions and garbage as bots', () => {
    expect(checkSpam(form({ [ELAPSED_FIELD]: String(MIN_FILL_MS - 1) }))).toBe('bot');
    expect(checkSpam(form({ [ELAPSED_FIELD]: 'abc' }))).toBe('bot');
    expect(checkSpam(form({ [ELAPSED_FIELD]: '-5' }))).toBe('bot');
  });

  it('has no upper limit: a visitor who left the tab open for days is still a person', () => {
    const threeDays = 1000 * 60 * 60 * 24 * 3;
    expect(checkSpam(form({ [HONEYPOT_FIELD]: '', [ELAPSED_FIELD]: String(threeDays) }))).toBe('ok');
  });

  it('flags a filled honeypot as a bot even with a plausible time', () => {
    expect(checkSpam(form({ [HONEYPOT_FIELD]: 'x', [ELAPSED_FIELD]: '8000' }))).toBe('bot');
  });

  it('reports "no-js" when no fill time was sent (browser without JavaScript), so callers can ask them to email', () => {
    expect(checkSpam(form({ [HONEYPOT_FIELD]: '' }))).toBe('no-js');
  });
});

describe('honeypot field name', () => {
  it('is neutral, so browser autofill never fills it in for a real visitor', () => {
    expect(HONEYPOT_FIELD).toBe('bot-field');
    expect(HONEYPOT_FIELD).not.toMatch(/name|mail|phone|tel|company|organi[sz]ation|website|url|address|country|city|zip|postal/i);
  });
});

describe('createRateLimiter', () => {
  it('allows up to the limit per window, then blocks until the window resets', () => {
    const allow = createRateLimiter({ limit: 2, windowMs: 1000 });
    expect(allow('ip', 0)).toBe(true);
    expect(allow('ip', 10)).toBe(true);
    expect(allow('ip', 20)).toBe(false);
    expect(allow('other-ip', 20)).toBe(true);
    expect(allow('ip', 1001)).toBe(true);
  });

  it('never tracks more visitors than its cap (a flood of new addresses cannot exhaust memory)', () => {
    const allow = createRateLimiter({ limit: 1, windowMs: 60_000, maxKeys: 3 });
    for (const ip of ['a', 'b', 'c', 'd']) expect(allow(ip, 0)).toBe(true);
    // 'a' was the oldest window and was dropped to make room, so it starts afresh.
    expect(allow('a', 1)).toBe(true);
    expect(allow('d', 1)).toBe(false);
  });
});

describe('email rendering', () => {
  it('escapes HTML so a visitor cannot inject markup into an email', () => {
    expect(escapeHtml('<script>alert("x")</script>')).toBe('&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;');
    expect(escapeHtml("<img src=x onerror='alert(1)'>")).not.toContain('<img');
  });

  it('strips line breaks from header values (no header injection)', () => {
    expect(sanitizeHeader('Hello\r\nBcc: victim@example.com')).toBe('Hello Bcc: victim@example.com');
  });
});
