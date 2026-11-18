/**
 * Photos live in Vercel Blob, not in the repository. NEXT_PUBLIC_MEDIA_BASE_URL is the Blob store's public
 * origin (https://<store-id>.public.blob.vercel-storage.com); each photo keeps the same path it has under
 * public/media locally (images/…), so `pnpm media:upload` publishes public/media as it is.
 * Without the variable (local development, tests) photos are served from public/media.
 */
const base = (process.env.NEXT_PUBLIC_MEDIA_BASE_URL ?? '').trim().replace(/\/+$/, '');

export function mediaUrl(path: string): string {
  const clean = path.replace(/^\/+/, '');
  return base ? `${base}/${clean}` : `/media/${clean}`;
}

/** Host of the Blob store, for next/image remotePatterns (undefined when photos are served locally). */
export function mediaHost(): string | undefined {
  return base ? new URL(base).hostname : undefined;
}
