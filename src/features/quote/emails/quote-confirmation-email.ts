import { paths } from '@/config/paths';
import { absoluteUrl } from '@/config/seo';
import { site } from '@/config/site';
import { formOf, productById } from '@/lib/catalog';
import { whatsappLink } from '@/lib/whatsapp';

import { deskList, termsLine } from '../utils/quote-summary';

import { C, FONT, emailButton, emailDocument, emailFacts, emailHeading, esc } from './email-layout';
import type { QuoteEmailInput } from './quote-notification-email';

/** What happens after an enquiry (steps 2–4 of the website's "How an order runs"). */
const NEXT_STEPS = [
  ['Specification', 'Counts, cut size, brix or pack agreed in writing.'],
  ['Samples', 'Samples or pre-shipment inspection on request.'],
  ['Written offer', 'Price, Incoterm, volumes and shipping window.'],
] as const;

/**
 * The "we have your enquiry" email a buyer receives after sending a quote: the same confirmation the website
 * shows (reference, desk, reply within one working day), a copy of what they asked for, what happens next,
 * and a WhatsApp shortcut. Replies go to the export team.
 */
export function quoteConfirmationEmail({ ref, quote }: QuoteEmailInput) {
  const { basket, details } = quote;
  const desk = deskList(basket);
  const first = details.name.trim().split(/\s+/)[0] ?? details.name;
  const company = details.company.trim();
  const terms = termsLine(details);
  const subject = `We have your enquiry ${ref} · Todara`;
  const whatsapp = whatsappLink(`Hello Todara, following up on enquiry ${ref} from ${company}.`);

  const products = basket
    .map((item) => {
      const p = productById(item.id);
      if (!p) return '';
      return (
        `<tr><td style="padding:8px 0;border-bottom:1px solid ${C.rule};font-family:${FONT};font-size:15px;line-height:1.45;color:${C.bark}">` +
        `<span style="color:${formOf(p).dot}">●</span>&nbsp;<strong style="font-weight:600;color:${C.forest}">${esc(p.name)}</strong>` +
        `<br><span style="font-size:14px;color:${C.muted}">${esc(p.option.label)}: ${esc(item.opt)} · Volume: ${esc(item.volume)}</span>` +
        `</td></tr>`
      );
    })
    .join('');

  const steps = NEXT_STEPS.map(
    ([title, detail], i) =>
      `<tr>` +
      `<td valign="top" style="width:32px;padding:10px 0;border-top:1px solid ${C.rule};font-family:${FONT};font-size:14px;font-weight:700;color:${C.honey}">${i + 1}</td>` +
      `<td valign="top" style="padding:10px 0;border-top:1px solid ${C.rule};font-family:${FONT};font-size:15px;line-height:1.45;color:${C.bark}">` +
      `<strong style="font-weight:600">${esc(title)}</strong><br><span style="font-size:14px;color:${C.muted}">${esc(detail)}</span></td>` +
      `</tr>`,
  ).join('');

  const body =
    `<div style="font-family:${FONT};font-size:13px;font-weight:600;color:${C.leaf}">● Enquiry received · ${esc(ref)}</div>` +
    `<h1 class="title" style="margin:8px 0 14px;font-family:${FONT};font-size:30px;line-height:1.1;letter-spacing:-0.02em;font-weight:600;color:${C.forest}">Thank you, ${esc(first)}.</h1>` +
    `<p style="margin:0 0 22px;font-family:${FONT};font-size:16px;line-height:1.6;color:${C.muted}">` +
    `Your enquiry has gone to our ${esc(desk)}. We will reply to ${esc(details.email)} within one working day with availability and a written offer.</p>` +
    `<div>${emailButton(whatsapp, 'Continue on WhatsApp')}${emailButton(absoluteUrl(paths.products), 'See all products', 'outline')}</div>` +
    emailHeading('Your enquiry') +
    emailFacts([
      { label: 'Reference', value: ref },
      { label: 'Company', value: company },
      ...(terms ? [{ label: 'Terms', value: terms }] : []),
      { label: 'Frequency', value: details.frequency },
    ]) +
    `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:14px">${products}</table>` +
    emailHeading('What happens next') +
    `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">${steps}</table>` +
    `<p style="margin:22px 0 0;font-family:${FONT};font-size:14.5px;line-height:1.6;color:${C.muted}">` +
    `Need to change something? Reply to this email or message us on WhatsApp on ${esc(site.whatsappDisplay)}.</p>`;

  const footer =
    `<p style="margin:0 0 10px;font-family:${FONT};font-size:13.5px;line-height:1.6;color:${C.footerText}">` +
    `${esc(site.legalName)} · ${esc(site.address.street)}, ${esc(site.address.locality)}, ${esc(site.address.country)}<br>` +
    `<a href="mailto:${esc(site.email)}" style="color:${C.cream}">${esc(site.email)}</a> · ${esc(site.whatsappDisplay)}</p>` +
    `<p style="margin:0;font-family:${FONT};font-size:12px;line-height:1.6;color:${C.footerText}">` +
    `You are receiving this email because you sent a quote request on ${esc(site.domain)}. ` +
    `<a href="${esc(absoluteUrl(paths.privacy))}" style="color:${C.cream}">Privacy policy</a></p>`;

  const text = [
    `Enquiry received · ${ref}`,
    '',
    `Thank you, ${first}.`,
    `Your enquiry has gone to our ${desk}. We will reply to ${details.email} within one working day with availability and a written offer.`,
    '',
    'YOUR ENQUIRY',
    `Reference: ${ref}`,
    `Company: ${company}`,
    ...(terms ? [`Terms: ${terms}`] : []),
    `Frequency: ${details.frequency}`,
    ...basket.map((item) => {
      const p = productById(item.id);
      return p ? `- ${p.name} · ${p.option.label}: ${item.opt} · Volume: ${item.volume}` : `- ${item.id}`;
    }),
    '',
    'WHAT HAPPENS NEXT',
    ...NEXT_STEPS.map(([title, detail], i) => `${i + 1}. ${title}: ${detail}`),
    '',
    `Continue on WhatsApp: ${whatsapp}`,
    `Need to change something? Reply to this email or message us on WhatsApp on ${site.whatsappDisplay}.`,
    '',
    `${site.legalName} · ${site.address.street}, ${site.address.locality}, ${site.address.country} · ${site.email}`,
    `You are receiving this email because you sent a quote request on ${site.domain}. Privacy policy: ${absoluteUrl(paths.privacy)}`,
  ].join('\n');

  return {
    subject,
    to: details.email,
    replyTo: site.email,
    html: emailDocument({ title: subject, preheader: `We will reply within one working day. Reference ${ref}.`, body, footer, darkFooter: true }),
    text,
  };
}
