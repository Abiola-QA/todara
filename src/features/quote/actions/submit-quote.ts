'use server';

import { randomInt } from 'node:crypto';

import { env } from '@/config/env';
import { site } from '@/config/site';
import { checkSpam, createRateLimiter } from '@/lib/forms';
import { clientIp } from '@/lib/forms/client-ip';
import { sendFormEmail } from '@/lib/forms/send-email';

import { quoteEmail } from '../utils/quote-email';
import { desksFor } from '../utils/quote-summary';

import { QUOTE_PAYLOAD_FIELD, quoteFieldErrors, quoteSchema } from './quote-schema';

export type QuoteResult = { ok: true; ref: string; desk: string } | { ok: false; message: string; fieldErrors?: Record<string, string> };

const allow = createRateLimiter({ limit: 5, windowMs: 10 * 60 * 1000 });

const CONTACT_INSTEAD = `Please email ${site.email} or message us on WhatsApp on ${site.whatsappDisplay}. Your quote is still saved on this device.`;

/** The enquiry reference the buyer sees, e.g. TD-Q-48213 (the design's format). */
export async function newReference() {
  return `TD-Q-${randomInt(10000, 100000)}`;
}

/**
 * Receives a quote request: spam checks, validation against the catalogue, a rate limit, then one email to
 * the export team (FORMS_DELIVERY=resend) with the buyer as reply-to. With FORMS_DELIVERY=none (local
 * development) nothing is sent and the request is only logged.
 */
export async function submitQuote(formData: FormData): Promise<QuoteResult> {
  const verdict = checkSpam(formData);
  // Never tell a bot it was caught: it sees the same confirmation, but nothing is delivered.
  if (verdict === 'bot') return { ok: true, ref: await newReference(), desk: 'export desk' };
  if (verdict === 'no-js') return { ok: false, message: `We could not send your enquiry. ${CONTACT_INSTEAD}` };

  let raw: unknown;
  try {
    raw = JSON.parse(String(formData.get(QUOTE_PAYLOAD_FIELD) ?? ''));
  } catch {
    return { ok: false, message: 'Please check the form and try again.' };
  }
  const parsed = quoteSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, message: 'Please check the highlighted fields.', fieldErrors: quoteFieldErrors(parsed.error) };
  }

  // Counted only for requests that would really be sent, so a typo never locks anyone out.
  if (!allow(await clientIp())) {
    return { ok: false, message: `You have sent several enquiries in a short time. Please wait a few minutes. ${CONTACT_INSTEAD}` };
  }

  const ref = await newReference();
  const desk = desksFor(parsed.data.basket);
  const email = quoteEmail(ref, parsed.data);

  if (env.FORMS_DELIVERY === 'none') {
    console.warn(`[quote] FORMS_DELIVERY=none, not sent: ${email.subject}`);
    return { ok: true, ref, desk };
  }

  const sent = await sendFormEmail(email);
  if (!sent.ok) return { ok: false, message: `We could not send your enquiry just now. ${CONTACT_INSTEAD}` };
  return { ok: true, ref, desk };
}
