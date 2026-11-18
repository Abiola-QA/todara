import { paths } from '@/config/paths';
import { site } from '@/config/site';

export type PolicyKey = 'privacy' | 'terms' | 'cookies';

export type Policy = {
  key: PolicyKey;
  href: string;
  title: string;
  intro: string;
  sections: readonly { heading: string; body: string }[];
};

const s = (pairs: [string, string][]) => pairs.map(([heading, body]) => ({ heading, body }));

/** The three policies (the design's LEGAL), drafted against the Kenya Data Protection Act, 2019. */
export const policies: Record<PolicyKey, Policy> = {
  privacy: {
    key: 'privacy',
    href: paths.privacy,
    title: 'Privacy policy',
    intro: `How ${site.legalName} collects and uses personal data, in line with the Kenya Data Protection Act, 2019.`,
    sections: s([
      ['Who we are', `${site.legalName}, Nairobi, Kenya, is the data controller for personal data collected through ${site.domain}.`],
      ['What we collect', 'The details you give in an enquiry: your name, company, work email, phone or WhatsApp number, country and your order requirements.'],
      [
        'Why we use it',
        'To reply to your enquiry, prepare offers and manage orders: steps taken at your request before a contract, and our legitimate interest in running our export business.',
      ],
      [
        'How long we keep it',
        'Enquiries that do not lead to an order are deleted after 24 months. Order records are kept as long as Kenyan tax and trade law requires.',
      ],
      ['Who we share it with', 'Only Todara staff who handle your enquiry and the providers that host our website and email. We do not sell personal data.'],
      ['Transfers outside Kenya', 'Some providers process data outside Kenya. Where they do, we rely on the safeguards the Act requires.'],
      ['Your rights', `You can ask to see, correct or delete your data, or object to how we use it. Write to ${site.privacyEmail}.`],
      [
        'Complaints',
        'You can complain to the Office of the Data Protection Commissioner (ODPC). Todara is confirming whether it must register with the ODPC as a data controller.',
      ],
    ]),
  },
  terms: {
    key: 'terms',
    href: paths.terms,
    title: 'Terms of use',
    intro: `The terms that apply when you use ${site.domain}.`,
    sections: s([
      ['Using this site', `The site gives information about ${site.legalName} and its products for professional buyers.`],
      [
        'Product information',
        'Specifications, seasonality and transit times are indicative. The specification that applies is the one confirmed in our written offer.',
      ],
      ['No contract until confirmed', 'An enquiry or quotation is not a contract. A contract exists only once both parties confirm an order in writing.'],
      ['Intellectual property', `The Todara name, logos, text and images belong to ${site.legalName} and may not be reused without permission.`],
      ['Liability', 'We take care to keep the site accurate but do not accept liability for decisions made on indicative information.'],
      ['Governing law', 'These terms are governed by the laws of Kenya.'],
    ]),
  },
  cookies: {
    key: 'cookies',
    href: paths.cookies,
    title: 'Cookie policy',
    intro: `Which cookies ${site.domain} uses and how to control them.`,
    sections: s([
      ['What cookies are', 'Small files a website stores in your browser so it works and can remember choices.'],
      ['Essential cookies', 'Needed for the site and the quote form to work, and to remember your cookie choice. Always on.'],
      ['Analytics cookies', 'Help us understand which pages buyers use. Only set if you accept them.'],
      ['Changing your choice', 'Use the cookie banner or clear cookies in your browser at any time.'],
    ]),
  },
};

export const policyOrder: readonly PolicyKey[] = ['privacy', 'terms', 'cookies'];
