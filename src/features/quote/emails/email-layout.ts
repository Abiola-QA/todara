import { mediaUrl } from '@/config/media';
import { absoluteUrl } from '@/config/seo';
import { escapeHtml } from '@/lib/forms';

/**
 * Building blocks for Todara's transactional emails. Email clients ignore most modern CSS, so everything is
 * table-based with inline styles, 600px wide on desktop and fluid on phones. Brand colours and Albert Sans
 * (with Helvetica/Arial fallbacks where web fonts are blocked, e.g. Gmail and Outlook) match the website.
 */
export const C = {
  forest: '#1E3A2F',
  bark: '#3A2A1F',
  cream: '#F4EFE4',
  paper: '#FBFAF6',
  white: '#FFFFFF',
  honey: '#C9973F',
  leaf: '#6F9A4C',
  muted: '#5C4A3C',
  rule: '#E3DBCB',
  footerText: '#E3D8C6',
} as const;

export const FONT = "'Albert Sans', Helvetica, Arial, sans-serif";

export const esc = escapeHtml;

/** Absolute URL of an email image. Photos and logos live in the Blob store, which is reachable from any inbox. */
export function emailAsset(path: string) {
  const url = mediaUrl(path);
  return url.startsWith('http') ? url : absoluteUrl(url);
}

/** A bulletproof button (a padded table cell), readable even where the client strips styles from links. */
export function emailButton(href: string, label: string, variant: 'primary' | 'outline' = 'primary') {
  const primary = variant === 'primary';
  const cell = primary ? `background:${C.forest};` : `border:1.5px solid ${C.forest};`;
  const color = primary ? C.cream : C.forest;
  const pad = primary ? '13px 22px' : '11.5px 20.5px';
  return (
    `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="display:inline-table;margin:0 8px 8px 0"><tr>` +
    `<td style="${cell}">` +
    `<a href="${esc(href)}" style="display:inline-block;padding:${pad};font-family:${FONT};font-size:15px;font-weight:600;line-height:1.2;color:${color};text-decoration:none">${esc(label)}</a>` +
    `</td></tr></table>`
  );
}

/** Label / value rows (a two-column table that stays readable on a phone). */
export function emailFacts(rows: { label: string; value: string; html?: boolean }[]) {
  const body = rows
    .filter((r) => r.value.trim() !== '')
    .map(
      (r) =>
        `<tr>` +
        `<td valign="top" style="width:36%;padding:10px 12px 10px 0;border-bottom:1px solid ${C.rule};font-family:${FONT};font-size:14px;line-height:1.45;color:${C.muted}">${esc(r.label)}</td>` +
        `<td valign="top" style="padding:10px 0;border-bottom:1px solid ${C.rule};font-family:${FONT};font-size:15px;line-height:1.45;font-weight:500;color:${C.bark}">${r.html ? r.value : esc(r.value)}</td>` +
        `</tr>`,
    )
    .join('');
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top:1.5px solid ${C.bark}">${body}</table>`;
}

/** Section heading inside the card. */
export function emailHeading(text: string) {
  return `<h2 style="margin:28px 0 12px;font-family:${FONT};font-size:18px;line-height:1.25;font-weight:600;color:${C.forest}">${esc(text)}</h2>`;
}

type DocumentInput = {
  /** <title>, also what some clients show as the subject in previews. */
  title: string;
  /** Hidden first line shown next to the subject in the inbox list. */
  preheader: string;
  /** Inner HTML of the white card. */
  body: string;
  /** Inner HTML below the card (small print), or a full dark footer row. */
  footer: string;
  /** Dark brand footer (the website's bark footer) instead of plain small print. */
  darkFooter?: boolean;
};

/** The shared email frame: cream background, logo, a white card with the honey top rule, and a footer. */
export function emailDocument({ title, preheader, body, footer, darkFooter }: DocumentInput) {
  const footerRow = darkFooter
    ? `<tr><td style="background:${C.bark};padding:28px 32px;border-top:4px solid ${C.honey}">` +
      `<img src="${esc(emailAsset('brand/todara-logo-email-on-dark.png'))}" width="110" height="34" alt="Todara" style="display:block;border:0;width:110px;height:auto;margin:0 0 14px">` +
      `${footer}</td></tr>`
    : `<tr><td style="padding:20px 32px 0;font-family:${FONT};font-size:12.5px;line-height:1.6;color:${C.muted}">${footer}</td></tr>`;

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light">
<meta name="supported-color-schemes" content="light">
<title>${esc(title)}</title>
<link href="https://fonts.googleapis.com/css2?family=Albert+Sans:wght@400;500;600&display=swap" rel="stylesheet">
<style>
  body { margin:0; padding:0; background:${C.cream}; }
  a { color:${C.forest}; }
  @media (max-width: 620px) {
    .card { padding:24px 20px !important; }
    .outer { padding:20px 12px !important; }
    .title { font-size:24px !important; }
  }
</style>
</head>
<body style="margin:0;padding:0;background:${C.cream}">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent">${esc(preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${C.cream}">
<tr><td align="center" class="outer" style="padding:32px 16px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px">
<tr><td style="padding:0 4px 18px">
<img src="${esc(emailAsset('brand/todara-logo-email.png'))}" width="120" height="37" alt="Todara" style="display:block;border:0;width:120px;height:auto">
</td></tr>
<tr><td class="card" style="background:${C.white};border-top:4px solid ${C.honey};padding:32px">
${body}
</td></tr>
${footerRow}
</table>
</td></tr>
</table>
</body>
</html>`;
}
