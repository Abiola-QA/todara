import { licenceDocuments, type LicenceDocumentId } from '../data/licence-documents';

export type LicenceRequestDraft = {
  name: string;
  company: string;
  /** First is required; the others are optional extra recipients. */
  emails: string[];
  picks: Record<LicenceDocumentId, boolean>;
  consent: boolean;
};

/** Error keys: name, company, picks, consent, and e0…e3 for the email rows. */
export type LicenceRequestErrors = Partial<Record<string, string>>;

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function emptyDraft(): LicenceRequestDraft {
  return { name: '', company: '', emails: [''], picks: { afa: true, kephis: true, haccp: true, gap: true }, consent: false };
}

/** The design's sendDocs() checks and messages. */
export function validateLicenceRequest(d: LicenceRequestDraft): LicenceRequestErrors {
  const errs: LicenceRequestErrors = {};
  if (!d.name.trim()) errs.name = 'Enter your name';
  if (!d.company.trim()) errs.company = 'Enter your company name';
  d.emails.forEach((v, i) => {
    if ((i === 0 || v.trim()) && !EMAIL_PATTERN.test(v.trim())) errs[`e${i}`] = 'Enter a valid email address';
  });
  if (!licenceDocuments.some((p) => d.picks[p.id])) errs.picks = 'Choose at least one document';
  if (!d.consent) errs.consent = 'Please agree so we can send the documents';
  return errs;
}

/** The same messages in the order they appear in the form (documents first), for the error toast. */
export function errorsInFormOrder(errs: LicenceRequestErrors, emailCount: number): string[] {
  const keys = ['picks', 'name', 'company', ...Array.from({ length: emailCount }, (_, i) => `e${i}`), 'consent'];
  return keys.map((k) => errs[k]).filter((m): m is string => Boolean(m));
}

/** Addresses to send to: trimmed, lower-cased and each once (the design's behaviour). */
export function recipients(emails: readonly string[]): string[] {
  return [...new Set(emails.map((v) => v.trim().toLowerCase()).filter(Boolean))];
}

/** "A, B and C" */
export function listInWords(items: readonly string[]): string {
  return items.length < 2 ? items.join('') : `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`;
}
