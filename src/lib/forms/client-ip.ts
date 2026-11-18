import 'server-only';

import { headers } from 'next/headers';

/**
 * Visitor key for rate limiting, read from the header Vercel itself sets
 * (`x-vercel-forwarded-for`; visitors cannot forge it there). It is only
 * trusted when running on Vercel, since anywhere else a visitor could send it
 * themselves and pick their key; elsewhere `x-forwarded-for` is used, which a
 * reverse proxy in front of the app should overwrite.
 * IPv6 addresses are reduced to their /64 network, since one visitor usually
 * controls a whole /64 and could otherwise rotate addresses to dodge the limit.
 */
export async function clientIp(): Promise<string> {
  const h = await headers();
  const platform = process.env.VERCEL ? h.get('x-vercel-forwarded-for') : null;
  const raw = (platform ?? h.get('x-forwarded-for') ?? h.get('x-real-ip') ?? '').split(',')[0]?.trim() ?? '';
  return rateLimitKey(raw);
}

/** Exported for tests: IPv4 as is, IPv6 as its first four groups (/64), empty as "unknown". */
export function rateLimitKey(ip: string): string {
  if (!ip) return 'unknown';
  if (!ip.includes(':')) return ip;
  const groups = expandIpv6(ip.replace(/^\[|\]$/g, '').split('%')[0] ?? '');
  return groups ? `${groups.slice(0, 4).join(':')}::/64` : ip;
}

function expandIpv6(ip: string): string[] | null {
  const [head = '', tail] = ip.split('::');
  const a = head ? head.split(':') : [];
  const b = tail !== undefined && tail !== '' ? tail.split(':') : [];
  if (tail === undefined && a.length !== 8) return null;
  const missing = 8 - a.length - b.length;
  if (missing < 0) return null;
  return [...a, ...Array<string>(tail === undefined ? 0 : missing).fill('0'), ...b].map((g) => g.toLowerCase().replace(/^0+(?=.)/, ''));
}
