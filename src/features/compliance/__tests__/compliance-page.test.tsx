import { kephisCovers, licences, shipmentDocuments } from '@/lib/content';
import { toastStore } from '@/lib/toast';
import { renderUi, screen } from '@/testing/test-utils';

import { CompliancePage } from '../components/compliance-page';
import { REQUEST_COPY_MESSAGE } from '../components/licence-card';

describe('CompliancePage', () => {
  it('shows every licence with its issuer, scope and reference', () => {
    renderUi(<CompliancePage />);
    expect(screen.getByRole('heading', { level: 1, name: /Licensed avocado and mango exporter/ })).toBeInTheDocument();
    for (const l of licences) {
      expect(screen.getByRole('heading', { level: 3, name: l.name })).toBeInTheDocument();
      expect(screen.getByText(l.covers)).toBeInTheDocument();
    }
    expect(screen.getByText('LA11/1010424')).toBeInTheDocument();
  });

  it('lists what KEPHIS covers and the eight shipment documents', () => {
    renderUi(<CompliancePage />);
    kephisCovers.forEach((k) => expect(screen.getByText(k)).toBeInTheDocument());
    expect(shipmentDocuments).toHaveLength(8);
    shipmentDocuments.forEach((d) => expect(screen.getByText(d.name, { selector: 'span' })).toBeInTheDocument());
    expect(screen.getByRole('link', { name: 'Privacy policy →' })).toHaveAttribute('href', '/privacy');
  });

  it('confirms by toast that licence copies are sent by email', async () => {
    const { user } = renderUi(<CompliancePage />);
    const buttons = screen.getAllByRole('button', { name: /Request a copy/ });
    expect(buttons).toHaveLength(licences.length);
    await user.click(buttons[0] as HTMLElement);
    expect(toastStore.getSnapshot()?.text).toBe(REQUEST_COPY_MESSAGE);
  });
});
