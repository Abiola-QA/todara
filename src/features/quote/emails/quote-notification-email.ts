import { site } from '@/config/site';
import { formOf, productById } from '@/lib/catalog';

import type { QuoteSubmission } from '../actions/quote-schema';
import { deskList } from '../utils/quote-summary';

import { C, FONT, emailButton, emailDocument, emailFacts, emailHeading, esc } from './email-layout';

export type QuoteEmailInput = {
  ref: string;
  quote: QuoteSubmission;
  /** When the request arrived (shown in Nairobi time). */
  receivedAt: Date;
};

/** "19 November 2026, 14:32 EAT" */
export function nairobiTime(date: Date) {
  const day = new Intl.DateTimeFormat('en-GB', { timeZone: 'Africa/Nairobi', day: 'numeric', month: 'long', year: 'numeric' }).format(date);
  const time = new Intl.DateTimeFormat('en-GB', { timeZone: 'Africa/Nairobi', hour: '2-digit', minute: '2-digit', hour12: false }).format(date);
  return `${day}, ${time} EAT`;
}

/** A WhatsApp chat link for a buyer's number, only when it is written in international form (+… or 00…). */
export function buyerWhatsapp(phone: string, text: string) {
  const trimmed = phone.trim();
  if (!/^(\+|00)/.test(trimmed)) return null;
  const digits = trimmed.replace(/^00/, '').replace(/\D/g, '');
  return digits.length >= 8 ? `https://wa.me/${digits}?text=${encodeURIComponent(text)}` : null;
}

const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? '' : 's'}`;

/** The product rows: a coloured edge per form, name and spec code, the buyer's option and volume. */
function productRows(quote: QuoteSubmission) {
  return quote.basket
    .map((item) => {
      const product = productById(item.id);
      if (!product) return '';
      const form = formOf(product);
      return (
        `<tr><td style="padding:0 0 10px">` +
        `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${C.paper};border-left:4px solid ${form.dot}"><tr>` +
        `<td style="padding:14px 16px">` +
        `<div style="font-family:${FONT};font-size:16px;line-height:1.3;font-weight:600;color:${C.forest}">${esc(product.name)}</div>` +
        `<div style="padding-top:2px;font-family:${FONT};font-size:13px;line-height:1.4;color:${C.muted}">${esc(form.label)} · Spec ${esc(product.code)}</div>` +
        `<div style="padding-top:10px;font-family:${FONT};font-size:14.5px;line-height:1.5;color:${C.bark}">` +
        `<span style="color:${C.muted}">${esc(product.option.label)}:</span> <strong style="font-weight:600">${esc(item.opt)}</strong>` +
        `&nbsp;&nbsp;·&nbsp;&nbsp;<span style="color:${C.muted}">Volume:</span> <strong style="font-weight:600">${esc(item.volume)}</strong>` +
        `</div></td></tr></table>` +
        `</td></tr>`
      );
    })
    .join('');
}

/** Desk tags in the form colours ("Fresh fruit desk", "Frozen desk"). */
function deskTags(quote: QuoteSubmission) {
  const seen = new Set<string>();
  return quote.basket
    .map((item) => productById(item.id))
    .filter((p) => p && !seen.has(p.form) && seen.add(p.form))
    .map((p) => {
      const form = formOf(p!);
      const label = form.desk.charAt(0).toUpperCase() + form.desk.slice(1);
      return (
        `<span style="display:inline-block;margin:0 6px 6px 0;padding:5px 10px;background:${form.tint};font-family:${FONT};font-size:13px;font-weight:600;color:${form.ink}">` +
        `<span style="color:${form.dot}">●</span>&nbsp;${esc(label)}</span>`
      );
    })
    .join('');
}

/**
 * The email Todara's export team receives for each quote request. It opens with what matters for triage
 * (who, how many products, which desks), puts one-click reply and WhatsApp buttons up top, and replying
 * goes straight to the buyer.
 */
export function quoteNotificationEmail({ ref, quote, receivedAt }: QuoteEmailInput) {
  const { basket, details } = quote;
  const desk = deskList(basket);
  const first = details.name.trim().split(/\s+/)[0] ?? details.name;
  const count = plural(basket.length, 'product');
  const subject = `Quote request ${ref} · ${details.company} · ${desk}`;
  const replyHref = `mailto:${details.email}?subject=${encodeURIComponent(`Your Todara quote ${ref}`)}`;
  const wa = details.phone ? buyerWhatsapp(details.phone, `Hello ${first}, this is Todara about your quote request ${ref}.`) : null;
  const phoneHtml = wa ? `<a href="${esc(wa)}" style="color:${C.forest}">${esc(details.phone)}</a>` : esc(details.phone);

  const body =
    `<div style="font-family:${FONT};font-size:13px;font-weight:600;color:${C.leaf}">New quote request · ${esc(ref)}</div>` +
    `<h1 class="title" style="margin:8px 0 14px;font-family:${FONT};font-size:28px;line-height:1.15;letter-spacing:-0.02em;font-weight:600;color:${C.forest}">` +
    `${esc(details.company)} wants a quote for ${esc(count)}</h1>` +
    `<div>${deskTags(quote)}</div>` +
    `<p style="margin:6px 0 20px;font-family:${FONT};font-size:14px;line-height:1.5;color:${C.muted}">` +
    `From ${esc(details.name)}, ${esc(details.country)} · Received ${esc(nairobiTime(receivedAt))}</p>` +
    `<div>${emailButton(replyHref, `Reply to ${first}`)}${wa ? emailButton(wa, `WhatsApp ${first}`, 'outline') : ''}</div>` +
    emailHeading('Products') +
    `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">${productRows(quote)}</table>` +
    emailHeading('Terms') +
    emailFacts([
      { label: 'Frequency', value: details.frequency },
      { label: 'Incoterm', value: details.incoterm },
      { label: 'Destination port', value: details.port },
      { label: 'Target start', value: details.delivery },
    ]) +
    emailHeading('Buyer') +
    emailFacts([
      { label: 'Company', value: details.company },
      { label: 'Name', value: details.name },
      { label: 'Work email', value: `<a href="mailto:${esc(details.email)}" style="color:${C.forest}">${esc(details.email)}</a>`, html: true },
      { label: 'Phone or WhatsApp', value: details.phone ? phoneHtml : '', html: true },
      { label: 'Country', value: details.country },
      { label: 'Business type', value: details.buyer },
    ]) +
    (details.message.trim()
      ? emailHeading('Notes') +
        `<div style="background:${C.cream};border-left:3px solid ${C.honey};padding:14px 16px;font-family:${FONT};font-size:15px;line-height:1.6;color:${C.bark};white-space:pre-wrap">${esc(details.message.trim())}</div>`
      : '');

  const footer =
    `Sent from the quote form on ${esc(site.domain)}. Reply to this email to answer ${esc(first)} directly.<br>` +
    `${esc(details.name)} agreed that Todara may use these details to respond (privacy policy, Kenya Data Protection Act, 2019).`;

  const text = [
    `New quote request ${ref}`,
    `${details.company} wants a quote for ${count} (${desk})`,
    `From ${details.name}, ${details.country} · Received ${nairobiTime(receivedAt)}`,
    '',
    'PRODUCTS',
    ...basket.map((item) => {
      const p = productById(item.id);
      return p ? `- ${p.name} (${formOf(p).label}, spec ${p.code}) · ${p.option.label}: ${item.opt} · Volume: ${item.volume}` : `- ${item.id}`;
    }),
    '',
    'TERMS',
    `Frequency: ${details.frequency}`,
    `Incoterm: ${details.incoterm}`,
    ...(details.port ? [`Destination port: ${details.port}`] : []),
    ...(details.delivery ? [`Target start: ${details.delivery}`] : []),
    '',
    'BUYER',
    `Company: ${details.company}`,
    `Name: ${details.name}`,
    `Work email: ${details.email}`,
    ...(details.phone ? [`Phone or WhatsApp: ${details.phone}`] : []),
    `Country: ${details.country}`,
    `Business type: ${details.buyer}`,
    ...(details.message.trim() ? ['', 'NOTES', details.message.trim()] : []),
    '',
    `Reply to this email to answer ${first} directly.`,
  ].join('\n');

  return {
    subject,
    replyTo: details.email,
    html: emailDocument({ title: subject, preheader: `${details.company}, ${details.country}: ${count} for the ${desk}`, body, footer }),
    text,
  };
}
