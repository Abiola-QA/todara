import { kephisCovers, licences, shipmentDocuments } from '@/lib/content';
import { renderUi, screen } from '@/testing/test-utils';

import { CompliancePage } from '../components/compliance-page';
import { licenceRequestStore } from '../utils/licence-request-store';

describe('CompliancePage', () => {
  afterEach(() => {
    licenceRequestStore.close();
  });

  it('shows every licence with its issuer, scope and reference', () => {
    renderUi(<CompliancePage />);
    expect(screen.getByRole('heading', { level: 1, name: /Licensed avocado and mango exporter/ })).toBeInTheDocument();
    for (const l of licences) {
      expect(screen.getByRole('heading', { level: 3, name: l.name })).toBeInTheDocument();
      expect(screen.getByText(l.covers)).toBeInTheDocument();
    }
    // The AFA licence number is no longer printed; copies go out on request.
    expect(screen.queryByText('LA11/1010424')).not.toBeInTheDocument();
    expect(screen.getAllByText('Copy on request')).toHaveLength(4);
    expect(screen.queryByRole('button', { name: /Request a copy/ })).not.toBeInTheDocument();
  });

  it('lists what KEPHIS covers and the eight shipment documents', () => {
    renderUi(<CompliancePage />);
    kephisCovers.forEach((k) => expect(screen.getByText(k)).toBeInTheDocument());
    expect(shipmentDocuments).toHaveLength(8);
    shipmentDocuments.forEach((d) => expect(screen.getByText(d.name, { selector: 'span' })).toBeInTheDocument());
    expect(screen.getByRole('link', { name: 'Privacy policy →' })).toHaveAttribute('href', '/privacy');
  });

  it('opens the licence request pop-up from the hero button and from "Request copies"', async () => {
    const { user } = renderUi(<CompliancePage />);
    expect(screen.getByText('Sent as PDFs to the email addresses you give.')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /Request licence copies/ }));
    expect(screen.getByRole('dialog', { name: 'Request licence copies' })).toBeInTheDocument();
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Request copies →' }));
    expect(screen.getByRole('dialog', { name: 'Request licence copies' })).toBeInTheDocument();
  });
});
