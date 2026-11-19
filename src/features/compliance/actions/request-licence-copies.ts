'use server';

import { randomInt } from 'node:crypto';

import { env } from '@/config/env';
import { site } from '@/config/site';
import { checkSpam, createRateLimiter } from '@/lib/forms';
import { clientIp } from '@/lib/forms/client-ip';
import { sendFormEmail } from '@/lib/forms/send-email';

import { licenceRequestEmail } from '../emails/licence-request-email';

import { LICENCE_REQUEST_FIELD, licenceRequestSchema } from './licence-request-schema';

export type LicenceRequestResult = { ok: true; emails: string[]; documents: string[] } | { ok: false; message: string; fieldErrors?: Record<string, string> };

const allow = createRateLimiter({ limit: 5, windowMs: 10 * 60 * 1000 });

const CONTACT_INSTEAD = `Please email ${site.email} or message us on WhatsApp on ${site.whatsappDisplay}.`;

/**
 * Receives a "Request licence copies" request: spam checks, validation, a rate limit, then one email to the
 * export team listing the documents and every address to send them to (FORMS_DELIVERY=resend). With
 * FORMS_DELIVERY=none (local development) nothing is sent and the request is only logged.
 */
export async function requestLicenceCopies(formData: FormData): Promise<LicenceRequestResult> {
  const verdict = checkSpam(formData);
  let raw: unknown;
  try {
    raw = JSON.parse(String(formData.get(LICENCE_REQUEST_FIELD) ?? ''));
  } catch {
    return { ok: false, message: 'Please check the form and try again.' };
  }
  const parsed = licenceRequestSchema.safeParse(raw);

  // Never tell a bot it was caught: it sees the same confirmation, but nothing is delivered.
  if (verdict === 'bot') return { ok: true, emails: parsed.success ? parsed.data.emails : [], documents: parsed.success ? parsed.data.documents : [] };
  if (verdict === 'no-js') return { ok: false, message: `We could not send your request. ${CONTACT_INSTEAD}` };

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const [top, index] = issue.path;
      const key = top === 'emails' ? `e${typeof index === 'number' ? index : 0}` : top === 'documents' ? 'picks' : String(top);
      fieldErrors[key] ??= issue.message;
    }
    return { ok: false, message: 'Please check the highlighted fields.', fieldErrors };
  }

  // Counted only for requests that would really be sent, so a typo never locks anyone out.
  if (!allow(await clientIp())) {
    return { ok: false, message: `You have sent several requests in a short time. Please wait a few minutes. ${CONTACT_INSTEAD}` };
  }

  const ref = `TD-L-${randomInt(10000, 100000)}`;
  const email = licenceRequestEmail(ref, parsed.data);
  if (env.FORMS_DELIVERY === 'none') {
    console.warn(`[licence request] FORMS_DELIVERY=none, not sent: ${email.subject}`);
    return { ok: true, emails: parsed.data.emails, documents: parsed.data.documents };
  }
  const sent = await sendFormEmail(email);
  if (!sent.ok) return { ok: false, message: `We could not send your request just now. ${CONTACT_INSTEAD}` };
  return { ok: true, emails: parsed.data.emails, documents: parsed.data.documents };
}
