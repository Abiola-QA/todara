/** Documents a buyer can request for supplier approval (the design's DOC_PICKS), all ticked by default. */
export const licenceDocuments = [
  { id: 'afa', name: 'AFA–HCD export licence', by: 'AFA–HCD' },
  { id: 'kephis', name: 'KEPHIS exporter registration', by: 'KEPHIS' },
  { id: 'haccp', name: 'HACCP certificate', by: 'Food safety' },
  { id: 'gap', name: 'GlobalG.A.P. certificate', by: 'Farm standard' },
] as const;

export type LicenceDocumentId = (typeof licenceDocuments)[number]['id'];

export const licenceDocumentIds = licenceDocuments.map((d) => d.id) as [LicenceDocumentId, ...LicenceDocumentId[]];

/** Up to four addresses can receive the documents. */
export const MAX_RECIPIENTS = 4;
