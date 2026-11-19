'use server';

import { randomInt } from 'node:crypto';

import { env } from '@/config/env';
import { site } from '@/config/site';
import { checkSpam, createRateLimiter } from '@/lib/forms';
import { clientIp } from '@/lib/forms/client-ip';
import { sendFormEmail } from '@/lib/forms/send-email';

import { quoteConfirmationEmail } from '../emails/quote-confirmation-email';
import { quoteNotificationEmail } from '../emails/quote-notification-email';
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
 * Receives a quote request: spam checks, validation against the catalogue and a rate limit, then two emails
 * (FORMS_DELIVERY=resend): the request to the export team, with the buyer as reply-to, and a confirmation to
 * the buyer, with the export inbox as reply-to. With FORMS_DELIVERY=none (local development) nothing is sent
 * and the request is only logged.
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
  const input = { ref, quote: parsed.data, receivedAt: new Date() };
  const teamEmail = quoteNotificationEmail(input);
  const buyerEmail = quoteConfirmationEmail(input);

  if (env.FORMS_DELIVERY === 'none') {
    console.warn(`[quote] FORMS_DELIVERY=none, not sent: "${teamEmail.subject}" and the buyer confirmation "${buyerEmail.subject}"`);
    return { ok: true, ref, desk };
  }

  // The enquiry counts as received only once the export team has it.
  const sent = await sendFormEmail(teamEmail);
  if (!sent.ok) return { ok: false, message: `We could not send your enquiry just now. ${CONTACT_INSTEAD}` };

  // The buyer's copy is a courtesy: if it fails, the enquiry is still with the team and the page confirms it.
  const confirmed = await sendFormEmail(buyerEmail);
  if (!confirmed.ok) console.warn(`[quote] ${ref} reached the team, but the buyer confirmation was not sent (${confirmed.reason})`);
  return { ok: true, ref, desk };
}
