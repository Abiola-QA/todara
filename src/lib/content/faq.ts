/** Buyer questions (the design's FAQ), in order. The FAQ page splits them into two groups at index 5. */
export type FaqItem = { q: string; a: string };

export const faq: readonly FaqItem[] = [
  {
    q: 'Do you grow your own fruit?',
    a: 'Both. Fruit comes from our own farms and from contracted growers we work with each season, all packed and checked to the same agreed specification.',
  },
  {
    q: 'Which forms do you supply?',
    a: 'Avocado and mango as fresh fruit, IQF halves, IQF dice and puree or pulp. Fresh fruit follows the Kenyan seasons; IQF and puree ship all year from stock.',
  },
  {
    q: 'Can I quote several products at once?',
    a: 'Yes. Add each product to your quote, set the volume and the cut size, count or pack for each, and send one enquiry.',
  },
  {
    q: 'Which licences and certifications do you hold?',
    a: 'An AFA–HCD horticultural export licence covering avocado and mango in all forms, and registration with KEPHIS. Every order comes with HACCP, GlobalG.A.P. and Phytosanitary certified processing. Copies are shared before a first order.',
  },
  { q: 'Can we talk on WhatsApp?', a: 'Yes. Message the export team on WhatsApp at any point. A written offer always follows by email.' },
  {
    q: 'How do you ship?',
    a: 'Fresh fruit and IQF travel in 40 ft refrigerated containers by sea from Mombasa. Fresh fruit can also fly from Jomo Kenyatta International Airport, Nairobi, for trial orders and short programmes. Mango puree ships in dry containers; avocado pulp ships frozen.',
  },
  { q: 'Which Incoterms do you offer?', a: 'FOB Mombasa and FCA Nairobi as standard. CFR and CIF to your port on request, quoted per shipment.' },
  {
    q: 'How long does shipping take?',
    a: 'Indicative sea transit from Mombasa: Middle East 10–16 days, Europe 24–30 days, Asia 14–30 days. By air from Nairobi: 1–2 days. Exact times depend on the carrier and routing and are confirmed in each offer.',
  },
  {
    q: 'How long from order to dispatch?',
    a: 'It depends on the product and the season, and is confirmed in each written offer. IQF and puree ship from stock; fresh fruit is harvested and packed to your order.',
  },
  {
    q: 'What order sizes do you accept?',
    a: 'Order size is agreed per product and destination. Sea freight is quoted per 40 ft reefer; air freight suits trial orders and short programmes. Fresh and frozen products ship in separate containers because they need different temperatures.',
  },
  {
    q: 'How is the cold chain monitored?',
    a: 'Containers are pre-cooled and set for the product: 5–7 °C for avocado, 10–12 °C for mango and −20 °C for IQF and avocado pulp. Temperature is logged throughout the voyage and the log is shared with the shipment documents.',
  },
  {
    q: 'Which documents come with each shipment?',
    a: 'Phytosanitary certificate, certificate of origin, commercial invoice, packing list, bill of lading or air waybill, pre-shipment quality report and temperature log, plus a certificate of analysis for IQF and puree.',
  },
  { q: 'What are your payment terms?', a: 'Payment terms are agreed with each buyer and confirmed in the written offer.' },
];

/** The four questions the home page shows. */
export const homeQuestions = ['Which forms do you supply?', 'How do you ship?', 'How long does shipping take?', 'What order sizes do you accept?'];

/** FAQ page groups (indexes into `faq`). */
export const faqGroups = [
  { title: 'Products and sourcing', start: 0, end: 5 },
  { title: 'Shipping, timelines and terms', start: 5, end: faq.length },
] as const;
