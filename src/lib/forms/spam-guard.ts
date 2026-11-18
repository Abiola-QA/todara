import { ELAPSED_FIELD, HONEYPOT_FIELD } from './form-state';

/** Humans need at least this long to fill in a form. */
export const MIN_FILL_MS = 2500;

/**
 * - `ok`: looks like a person.
 * - `bot`: filled the hidden honeypot, or submitted faster than a person can type.
 *   Callers pretend success so the bot learns nothing.
 * - `no-js`: no fill time was sent, which happens when the browser runs no
 *   JavaScript. Callers show an "email us" message instead of silently dropping it.
 */
export type SpamVerdict = 'ok' | 'bot' | 'no-js';

/**
 * Cheap bot checks that never bother a real visitor. The fill time is measured
 * in the visitor's browser (performance.now), so a wrong device clock cannot
 * get a real enquiry thrown away. There is deliberately no upper limit: the
 * value comes from the browser, so a bot can send any number it likes, and a
 * limit would only turn away people who left the tab open for a long time.
 */
export function checkSpam(formData: FormData): SpamVerdict {
  const trap = formData.get(HONEYPOT_FIELD);
  if (typeof trap === 'string' && trap.trim() !== '') return 'bot';
  const raw = formData.get(ELAPSED_FIELD);
  if (typeof raw !== 'string' || raw.trim() === '') return 'no-js';
  const elapsed = Number(raw);
  if (!Number.isFinite(elapsed) || elapsed < MIN_FILL_MS) return 'bot';
  return 'ok';
}
