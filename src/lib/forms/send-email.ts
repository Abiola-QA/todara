import 'server-only';

import { env } from '@/config/env';

import { sanitizeHeader } from './render-submission';

export type OutgoingEmail = {
  subject: string;
  text: string;
  html: string;
  /** Recipient; defaults to the export team's inbox (QUOTE_TO_EMAIL). */
  to?: string;
  /** Where a reply goes: the buyer for team emails, the export inbox for the buyer's confirmation. */
  replyTo?: string;
};

export type SendResult = { ok: true } | { ok: false; reason: 'not-configured' | 'failed' };

/**
 * Sends one email through Resend's HTTP API: by default to the export team, or to `to` (the buyer's
 * confirmation). Without RESEND_API_KEY nothing is sent and the caller tells the buyer to email or WhatsApp
 * us instead, so a missing key can never silently swallow an enquiry.
 */
export async function sendFormEmail(email: OutgoingEmail, fetchImpl: typeof fetch = fetch): Promise<SendResult> {
  if (!env.RESEND_API_KEY) return { ok: false, reason: 'not-configured' };
  try {
    const res = await fetchImpl('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: env.FORMS_FROM_EMAIL,
        to: [email.to ? sanitizeHeader(email.to, 320) : env.QUOTE_TO_EMAIL],
        subject: sanitizeHeader(email.subject),
        text: email.text,
        html: email.html,
        ...(email.replyTo ? { reply_to: sanitizeHeader(email.replyTo, 320) } : {}),
      }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) {
      console.error('Form email rejected by Resend', res.status);
      return { ok: false, reason: 'failed' };
    }
    return { ok: true };
  } catch (error) {
    console.error('Form email failed', error instanceof Error ? error.message : error);
    return { ok: false, reason: 'failed' };
  }
}
