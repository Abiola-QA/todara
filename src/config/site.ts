/** Company facts used across the site, metadata, structured data and the spec sheets. */
export const site = {
  name: 'Todara',
  legalName: 'Todara Ltd',
  domain: 'todarakenya.com',
  description: 'Kenyan avocado and mango, fresh and processed, for importers, processors and wholesale buyers.',
  email: 'export@todarakenya.com',
  privacyEmail: 'privacy@todarakenya.com',
  /** WhatsApp number in international format without "+" or spaces (wa.me links). */
  whatsappNumber: '254183062440',
  /** The same number as the design prints it. */
  whatsappDisplay: '+254 183 062440',
  hours: 'Mon–Fri, 08:00–17:00 EAT',
  address: { street: 'Swiss Cottages, Westlands', locality: 'Nairobi', country: 'Kenya', countryCode: 'KE' },
  /** AFA–HCD horticultural export licence number (printed on the compliance page and spec sheets). */
  afaLicence: 'LA11/1010424',
  markets: ['Europe', 'Middle East', 'Asia'],
} as const;
