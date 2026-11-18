/** How an order runs (the design's STEPS). */
export const orderSteps = (
  [
    ['01', 'Enquiry', 'Add products to a quote, or message us on WhatsApp.'],
    ['02', 'Specification', 'Counts, cut size, brix or pack agreed in writing.'],
    ['03', 'Samples', 'Samples or pre-shipment inspection on request.'],
    ['04', 'Written offer', 'Price, Incoterm, volumes and shipping window.'],
    ['05', 'Inspection', 'Quality check per lot, KEPHIS inspection, documents.'],
    ['06', 'Arrival', 'Tracking until arrival, then follow-up.'],
  ] as const
).map(([n, title, detail]) => ({ n, title, detail }));
