vi.mock('server-only', () => ({}));
vi.mock('next/headers', () => ({ headers: vi.fn() }));

import { rateLimitKey } from '../client-ip';

describe('rateLimitKey', () => {
  it('keeps IPv4 addresses as they are', () => {
    expect(rateLimitKey('102.89.1.20')).toBe('102.89.1.20');
  });

  it('groups IPv6 addresses by their /64 network, so rotating within it does not dodge the limit', () => {
    expect(rateLimitKey('2c0f:f5c0:440:1a2b:aaaa:bbbb:cccc:dddd')).toBe('2c0f:f5c0:440:1a2b::/64');
    expect(rateLimitKey('2c0f:f5c0:440:1a2b::1')).toBe('2c0f:f5c0:440:1a2b::/64');
    expect(rateLimitKey('2c0f:f5c0:0440:1a2b:0:0:0:9')).toBe('2c0f:f5c0:440:1a2b::/64');
  });

  it('falls back to "unknown" when there is no address', () => {
    expect(rateLimitKey('')).toBe('unknown');
  });
});

describe('clientIp', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('on Vercel, uses the address Vercel sets and ignores a forged X-Forwarded-For', async () => {
    vi.stubEnv('VERCEL', '1');
    const { headers } = await import('next/headers');
    vi.mocked(headers).mockResolvedValue(new Headers({ 'x-vercel-forwarded-for': '102.89.1.20', 'x-forwarded-for': '1.2.3.4' }) as never);
    const { clientIp } = await import('../client-ip');
    await expect(clientIp()).resolves.toBe('102.89.1.20');
  });

  it('off Vercel, never trusts a Vercel header a visitor could send themselves', async () => {
    vi.stubEnv('VERCEL', '');
    const { headers } = await import('next/headers');
    vi.mocked(headers).mockResolvedValue(new Headers({ 'x-vercel-forwarded-for': '6.6.6.6', 'x-forwarded-for': '102.89.1.20, 10.0.0.1' }) as never);
    const { clientIp } = await import('../client-ip');
    await expect(clientIp()).resolves.toBe('102.89.1.20');
  });
});
