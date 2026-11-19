import { site } from '@/config/site';

/** Licences and certifications (the design's LICENCES). */
export type Licence = { abbr: string; name: string; status: string; issuer: string; covers: string; ref: string };

export const licences: readonly Licence[] = [
  {
    abbr: 'AFA',
    name: 'Horticultural export licence',
    status: 'Active',
    issuer: 'Agriculture and Food Authority, Horticultural Crops Directorate (AFA–HCD)',
    covers: 'Export of avocado and mango in all forms: fresh, frozen and processed.',
    ref: site.afaLicence,
  },
  {
    abbr: 'KEPHIS',
    name: 'KEPHIS exporter registration',
    status: 'Active',
    issuer: 'Kenya Plant Health Inspectorate Service',
    covers: 'Registered plant-produce exporter, with inspection and a phytosanitary certificate issued for every consignment.',
    ref: 'Copy on request',
  },
  {
    abbr: 'HACCP',
    name: 'HACCP food safety',
    status: 'Held by Todara',
    issuer: 'Hazard Analysis and Critical Control Points',
    covers: 'Food-safety controls applied to processing and packing, for fresh, IQF and puree lines.',
    ref: 'Copy on request',
  },
  {
    abbr: 'G.A.P.',
    name: 'GlobalG.A.P.',
    status: 'Held by Todara',
    issuer: 'Good agricultural practice certification',
    covers: 'Farm-level standard for food safety, traceability and worker welfare on the farms that grow our fruit.',
    ref: 'Copy on request',
  },
  {
    abbr: 'PHYTO',
    name: 'Phytosanitary certificate',
    status: 'Every order',
    issuer: 'Issued by KEPHIS for each consignment',
    covers: 'Confirms the consignment has been inspected and meets the plant-health requirements of the destination market.',
    ref: 'Per consignment',
  },
];

/** What KEPHIS registration covers. */
export const kephisCovers = [
  'Exporter registration with KEPHIS',
  'Pre-export inspection of each consignment',
  'Phytosanitary certificate per consignment',
  'Destination-market plant health requirements checked before shipping',
];

/** Documents that travel with every order, numbered 01–08. */
export const shipmentDocuments = (
  [
    ['Phytosanitary certificate', 'KEPHIS'],
    ['Certificate of origin', 'Issuing authority'],
    ['Commercial invoice', 'Todara'],
    ['Packing list', 'Todara'],
    ['Bill of lading or air waybill', 'Carrier'],
    ['Pre-shipment quality report', 'Todara'],
    ['Temperature log', 'Reefer record'],
    ['Certificate of analysis', 'IQF and puree'],
  ] as const
).map(([name, by], i) => ({ n: String(i + 1).padStart(2, '0'), name, by }));
