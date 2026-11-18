import { site } from '@/config/site';

/** A wa.me link to the export team with a prefilled message (the design's wa()). */
export function whatsappLink(text: string) {
  return `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(text)}`;
}

/** The general "I have an enquiry" chat used by most buttons. */
export const generalWhatsapp = whatsappLink('Hello Todara, I have an enquiry.');
