import { productById } from '@/lib/catalog';

import { sheetCellColours, sheetData } from '../utils/sheet-data';

describe('sheetData', () => {
  it('derives the Hass sheet exactly as the design writes it', () => {
    const d = sheetData(productById('hass')!);
    expect(d.id).toBe('TD-AV-HS');
    expect(d.meta).toBe('TD-AV-HS · Rev 01 · November 2026');
    expect(d.badge).toEqual({ label: 'Fresh fruit', background: '#E3ECDD', color: '#1E3A2F' });
    expect(d.keyFacts.map((f) => f.k)).toEqual(['Varieties', 'Counts', 'Stem', 'Shelf life', 'Growing altitude', 'Season']);
    expect(d.fullSpec.map((f) => f.k)).toEqual(['Maturity', 'Carton', 'Pallet', 'Temperature', 'Freight']);
    expect(d.cells.map((c) => c.code).join('')).toBe('ooapppppaaoo');
    expect(d.optionHeading).toBe('Counts available');
    expect(d.options).toEqual(['12–14', '16–18', '20–22', '24–26', 'Mixed']);
    expect(d.terms).toBe('Price basis USD, FOB Mombasa or FCA Nairobi. CFR or CIF on request. Samples on request.');
    expect(d.compliance).toEqual([
      'AFA–HCD export licence LA11/1010424',
      'KEPHIS registered exporter',
      'HACCP certified processing',
      'GlobalG.A.P. certified',
      'Phytosanitary certificate per consignment',
    ]);
    expect(d.footer).toBe('Todara Ltd · export@todarakenya.com · +254 183 062440 · todarakenya.com · Indicative; the written offer applies.');
  });

  it('uses the FOB-only price basis and the option label for processed products', () => {
    const d = sheetData(productById('iqf-avo-dice')!);
    expect(d.terms).toBe('Price basis USD, FOB Mombasa. CFR or CIF on request. Samples on request.');
    expect(d.optionHeading).toBe('Cut size available');
    expect(d.badge).toEqual({ label: 'IQF frozen', background: '#DCE8EC', color: '#2E5361' });
    expect(d.fullSpec.map((f) => f.k)).toEqual(['Load', 'Shelf life']);
  });

  it('colours month cells like the design (filled peak and available, outlined limited)', () => {
    expect(sheetCellColours).toEqual({
      p: { background: '#1E3A2F', border: '#1E3A2F' },
      a: { background: '#9DB39A', border: '#9DB39A' },
      o: { background: '#FFFFFF', border: '#C9BFAE' },
    });
  });
});
