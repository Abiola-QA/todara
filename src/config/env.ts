import { z } from 'zod';

/**
 * Server environment variables, validated once. Everything has a safe default so local development and
 * tests work with no .env file.
 *
 * SITE_URL        Public origin for canonical links, sitemap and social cards.
 * SITE_INDEXING   "on" only on the production deployment; anything else keeps the site out of search
 *                 engines (robots.txt + noindex).
 * FORMS_DELIVERY  Where a quote request goes once it passes the server's checks: "resend" (emailed through
 *                 Resend; the default in production) or "none" (nothing is sent and the server logs it; the
 *                 default in development and tests).
 * RESEND_API_KEY  Sending-only Resend key. Without it in production, the form asks the buyer to email or
 *                 WhatsApp instead of pretending to succeed.
 * QUOTE_TO_EMAIL  Inbox that receives quote requests (the subject names the desk: fresh, frozen, puree).
 * FORMS_FROM_EMAIL Sender, on a domain verified in Resend.
 * EMAIL_SITE_URL  Website address used inside the quote emails only (links and the site name in their
 *                 footers), e.g. the Vercel address before the real domain is connected. Defaults to SITE_URL.
 *
 * Photos: NEXT_PUBLIC_MEDIA_BASE_URL (see src/config/media.ts) is read at build time, not here.
 */
export const formsDeliveryModes = ['resend', 'none'] as const;
export type FormsDelivery = (typeof formsDeliveryModes)[number];

const schema = z.object({
  SITE_URL: z
    .url()
    .default('https://todarakenya.com')
    .transform((u) => u.replace(/\/+$/, '')),
  SITE_INDEXING: z.enum(['on', 'off']).default('off'),
  FORMS_DELIVERY: z.enum(formsDeliveryModes).optional(),
  RESEND_API_KEY: z.string().min(1).optional(),
  QUOTE_TO_EMAIL: z.email().default('export@todarakenya.com'),
  FORMS_FROM_EMAIL: z.string().min(3).default('Todara website <website@todarakenya.com>'),
  EMAIL_SITE_URL: z
    .url()
    .transform((u) => u.replace(/\/+$/, ''))
    .optional(),
});

export type Env = Omit<z.infer<typeof schema>, 'FORMS_DELIVERY'> & { FORMS_DELIVERY: FormsDelivery };

export function readEnv(source: Record<string, string | undefined> = process.env): Env {
  const cleaned = Object.fromEntries(Object.entries(source).filter(([, v]) => v !== undefined && v !== ''));
  const parsed = schema.parse(cleaned);
  return { ...parsed, FORMS_DELIVERY: parsed.FORMS_DELIVERY ?? (source.NODE_ENV === 'production' ? 'resend' : 'none') };
}

export const env = readEnv();
