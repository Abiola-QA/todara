import { C, FONT, emailButton, emailDocument, emailFacts, emailHeading, emailSiteName, esc } from '@/lib/email';

import type { LicenceRequest } from '../actions/licence-request-schema';
import { licenceDocuments } from '../data/licence-documents';

/**
 * The email the export team receives when a buyer asks for licence copies: who is asking, which documents,
 * and every address to send them to. Replying goes to the first address.
 */
export function licenceRequestEmail(ref: string, request: LicenceRequest) {
  const first = request.name.trim().split(/\s+/)[0] ?? request.name;
  const docs = licenceDocuments.filter((d) => request.documents.includes(d.id));
  const count = `${docs.length} document${docs.length === 1 ? '' : 's'}`;
  const subject = `Licence copy request ${ref} · ${request.company} · ${count}`;
  const replyTo = request.emails[0] ?? '';
  const replyHref = `mailto:${request.emails.join(',')}?subject=${encodeURIComponent(`Todara licence copies (${ref})`)}`;

  const docRows = docs
    .map(
      (d) =>
        `<tr><td style="padding:10px 0;border-bottom:1px solid ${C.rule};font-family:${FONT};font-size:15px;line-height:1.45;color:${C.bark}">` +
        `<span style="color:${C.leaf}">✓</span>&nbsp;&nbsp;<strong style="font-weight:600;color:${C.forest}">${esc(d.name)}</strong>` +
        `<span style="color:${C.muted}">&nbsp;·&nbsp;${esc(d.by)}</span></td></tr>`,
    )
    .join('');

  const body =
    `<div style="font-family:${FONT};font-size:13px;font-weight:600;color:${C.leaf}">Licence copy request · ${esc(ref)}</div>` +
    `<h1 class="title" style="margin:8px 0 14px;font-family:${FONT};font-size:28px;line-height:1.15;letter-spacing:-0.02em;font-weight:600;color:${C.forest}">` +
    `${esc(request.company)} would like ${esc(count)}</h1>` +
    `<p style="margin:0 0 20px;font-family:${FONT};font-size:15px;line-height:1.6;color:${C.muted}">` +
    `Send the PDFs to the address${request.emails.length === 1 ? '' : 'es'} below. The reply button opens an email to all of them.</p>` +
    `<div>${emailButton(replyHref, `Reply to ${first}`)}</div>` +
    emailHeading('Documents') +
    `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top:1.5px solid ${C.bark}">${docRows}</table>` +
    emailHeading('Send to') +
    emailFacts(
      request.emails.map((e, i) => ({
        label: i === 0 ? 'Send to' : 'Also send to',
        value: `<a href="mailto:${esc(e)}" style="color:${C.forest}">${esc(e)}</a>`,
        html: true,
      })),
    ) +
    emailHeading('Requested by') +
    emailFacts([
      { label: 'Name', value: request.name },
      { label: 'Company', value: request.company },
    ]);

  const footer =
    `Sent from the compliance page on ${esc(emailSiteName())}. Phytosanitary certificates are issued per consignment and travel with the shipping documents.<br>` +
    `${esc(request.name)} agreed that Todara may use these details to send the documents and follow up (privacy policy).`;

  const text = [
    `Licence copy request ${ref}`,
    `${request.company} would like ${count}`,
    '',
    'DOCUMENTS',
    ...docs.map((d) => `- ${d.name} (${d.by})`),
    '',
    'SEND TO',
    ...request.emails.map((e) => `- ${e}`),
    '',
    'REQUESTED BY',
    `Name: ${request.name}`,
    `Company: ${request.company}`,
  ].join('\n');

  return {
    subject,
    replyTo,
    html: emailDocument({ title: subject, preheader: `${request.company}: ${docs.map((d) => d.name).join(', ')}`, body, footer }),
    text,
  };
}
