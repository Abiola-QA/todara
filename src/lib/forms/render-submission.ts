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
