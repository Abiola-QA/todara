/**
 * Name of the hidden "leave this empty" field bots tend to fill in. Deliberately neutral: a name like
 * `company_website` invites browser autofill to fill it for real visitors, who would then be dropped as bots.
 */
export const HONEYPOT_FIELD = 'bot-field';
/** Name of the hidden field holding how long the visitor spent on the form (ms, measured in the browser). */
export const ELAPSED_FIELD = 'form_elapsed_ms';
