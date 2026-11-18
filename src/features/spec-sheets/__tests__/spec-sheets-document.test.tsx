import { products } from '@/lib/catalog';
import { render, screen, within } from '@/testing/test-utils';

import { SpecSheetsDocument } from '../components/spec-sheets-document';

describe('SpecSheetsDocument', () => {
  it('renders one sheet per product, each addressable by its spec code', () => {
    render(<SpecSheetsDocument />);
    expect(screen.getAllByRole('region').map((s) => s.id)).toEqual(products.map((p) => p.code));
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Todara product specification sheets');
    expect(screen.getAllByRole('heading', { level: 2 }).map((h) => h.textContent)).toEqual(products.map((p) => p.name));
  });

  it('shows a sheet’s facts, availability, options and compliance', () => {
    render(<SpecSheetsDocument />);
    const sheet = within(screen.getByRole('region', { name: 'Mango puree' }));
    expect(sheet.getByText('TD-MG-PU · Rev 01 · November 2026')).toBeInTheDocument();
    expect(sheet.getByText('Puree and pulp')).toBeInTheDocument();
    expect(sheet.getByText('0.3–0.8% as citric acid')).toBeInTheDocument();
    expect(sheet.getByTitle('Jul: Available')).toBeInTheDocument();
    expect(sheet.getByRole('heading', { name: 'Pack available' })).toBeInTheDocument();
    expect(sheet.getAllByRole('listitem').map((li) => li.textContent)).toContain('215 kg aseptic drum');
    expect(sheet.getByText('AFA–HCD export licence LA11/1010424')).toBeInTheDocument();
  });

  it('sets A4 print pages with no margins', () => {
    render(<SpecSheetsDocument />);
    expect(document.querySelector('style')?.textContent).toContain('@page{size:210mm 297mm;margin:0}');
  });
});
