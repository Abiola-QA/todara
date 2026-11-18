import type { NextConfig } from 'next';

const isDev = process.env.NODE_ENV === 'development';

/**
 * Security headers for every response.
 * Pages are statically generated, so the Content Security Policy is static too: Next.js inlines small
 * bootstrapping scripts, which is why script-src keeps 'unsafe-inline' (a per-request nonce would force every
 * page to render dynamically). Fonts are self-hosted by next/font and photos go through the Next.js image
 * optimiser, so the browser loads everything from this origin.
 */
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ''}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  `connect-src 'self'${isDev ? ' ws:' : ''}`,
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  ...(isDev ? [] : ['upgrade-insecure-requests']),
].join('; ');

const securityHeaders = [
  { key: 'Content-Security-Policy', value: csp },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=()' },
  { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
];

const nextConfig: NextConfig = {
  cacheComponents: true,
  // Off on purpose: with it on, the first request for an unknown slug (e.g. /products/nope) is answered
  // with the route's shared shell and HTTP 200 before notFound() runs — a soft 404 for search engines.
  partialPrefetching: false,
  poweredByHeader: false,
  devIndicators: false,
  reactStrictMode: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    // Photos live in Vercel Blob (NEXT_PUBLIC_MEDIA_BASE_URL). The optimiser fetches them server-side and serves
    // them from /_next/image, so the browser still loads every image from this origin (CSP img-src 'self').
    remotePatterns: [{ protocol: 'https', hostname: '*.public.blob.vercel-storage.com', pathname: '/images/**' }],
  },
  async headers() {
    const searchIndexing = process.env.SITE_INDEXING === 'on';
    return [
      {
        source: '/:path*',
        headers: [
          ...securityHeaders,
          // Previews and staging stay out of search results until launch.
          ...(searchIndexing ? [] : [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }]),
        ],
      },
    ];
  },
};

export default nextConfig;
