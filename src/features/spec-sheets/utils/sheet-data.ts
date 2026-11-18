import { site } from '@/config/site';
import { buyingTerms, forms, seasonCells, specRows, type Product, type SeasonCode } from '@/lib/catalog';

/** Month cell colours on the printed sheet (filled for peak and available, outlined for limited). */
export const sheetCellColours: Record<SeasonCode, { background: string; border: string }> = {
  p: { background: '#1E3A2F', border: '#1E3A2F' },
  a: { background: '#9DB39A', border: '#9DB39A' },
  o: { background: '#FFFFFF', border: '#C9BFAE' },
};

export const SHEET_REVISION = 'Rev 01 · November 2026';

/** Everything one A4 specification sheet shows, derived from the catalogue exactly as the design writes it. */
export function sheetData(product: Product) {
  const form = forms[product.form];
  const rows = specRows(product);
  const priceBasis = buyingTerms(product.form)[0]?.v ?? '';
  return {
    id: product.code,
    meta: `${product.code} · ${SHEET_REVISION}`,
    badge: { label: form.label, background: form.tint, color: form.ink },
    keyFacts: rows.slice(0, 6),
    fullSpec: rows.slice(6),
    cells: seasonCells(product.season),
    optionHeading: `${product.option.label} available`,
    options: product.option.choices,
    terms: `Price basis ${priceBasis}. CFR or CIF on request. Samples on request.`,
    compliance: [
      `AFA–HCD export licence ${site.afaLicence}`,
      'KEPHIS registered exporter',
      'HACCP certified processing',
      'GlobalG.A.P. certified',
      'Phytosanitary certificate per consignment',
    ],
    footer: `${site.legalName} · ${site.email} · ${site.whatsappDisplay} · ${site.domain} · Indicative; the written offer applies.`,
  };
}
