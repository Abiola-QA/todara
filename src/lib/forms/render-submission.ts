export type SubmissionField = { label: string; value: string | undefined | null };

const ESCAPES: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

/** Escapes text for safe use inside HTML email markup. */
export function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (c) => ESCAPES[c] ?? c);
}

/** Removes characters that could break an email header (CR/LF injection). */
export function sanitizeHeader(value: string, maxLength = 200) {
  return value
    .replace(/[\r\n]+/g, ' ')
    .trim()
    .slice(0, maxLength);
}

/** Builds the plain-text and HTML bodies of a form notification email. */
export function renderSubmission(title: string, fields: SubmissionField[]) {
  const filled = fields.filter((f) => f.value && f.value.trim() !== '');
  const text = [title, '', ...filled.map((f) => `${f.label}:\n${f.value}\n`)].join('\n');
  const rows = filled
    .map(
      (f) =>
        `<tr><td style="padding:8px 12px;vertical-align:top;color:#5C4A3C;font-weight:600;white-space:nowrap">${escapeHtml(f.label)}</td>` +
        `<td style="padding:8px 12px;color:#3A2A1F;white-space:pre-wrap">${escapeHtml(f.value ?? '')}</td></tr>`,
    )
    .join('');
  const html =
    `<div style="font-family:system-ui,-apple-system,sans-serif;font-size:14px;line-height:1.5">` +
    `<h2 style="font-size:16px;color:#1E3A2F;margin:0 0 12px">${escapeHtml(title)}</h2>` +
    `<table style="border-collapse:collapse">${rows}</table></div>`;
  return { text, html };
}
