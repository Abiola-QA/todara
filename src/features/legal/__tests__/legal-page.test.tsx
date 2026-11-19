import { cookieConsent } from '@/components/layouts/cookie-banner';
import { renderUi, screen, within } from '@/testing/test-utils';

import { LegalPage } from '../components/legal-page';
import { parseListItem, policies, policyOrder } from '../data/policies';
import content from '../data/policies-content.json';
import { LEGAL_DESCRIPTION, legalMetadata } from '../metadata';

describe('policy data', () => {
  it('keeps the design’s four policies in its order, with numbered section headings', () => {
    expect(policyOrder).toEqual(['privacy', 'terms', 'sale', 'cookies']);
    expect(policies.privacy.sections[0]?.heading).toBe('1. Who we are');
    expect(policies.sale.sections).toHaveLength(content.sale.sections.length);
  });

  it('turns "Label:: text" list items into a bold label and text', () => {
    expect(parseListItem('Privacy contact:: privacy@todarakenya.com')).toEqual({ label: 'Privacy contact: ', text: 'privacy@todarakenya.com' });
    expect(parseListItem('No label here')).toEqual({ label: '', text: 'No label here' });
  });
});

describe('LegalPage', () => {
  beforeEach(() => {
    localStorage.clear();
    cookieConsent._reset();
  });

  it('renders the chosen policy and marks it in the policy switcher', () => {
    renderUi(<LegalPage policy="terms" />);
    expect(screen.getByRole('heading', { level: 1, name: 'Terms of use' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Terms of use' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('link', { name: 'Terms of sale' })).toHaveAttribute('href', '/terms-of-sale');
    expect(screen.getByRole('link', { name: 'Privacy policy' })).toHaveAttribute('href', '/privacy');
    expect(screen.getByRole('link', { name: 'Cookie policy' })).not.toHaveAttribute('aria-current');
    for (const s of policies.terms.sections) expect(screen.getByRole('heading', { level: 2, name: s.heading })).toBeInTheDocument();
    expect(screen.getByText('Legal')).toBeInTheDocument();
    expect(screen.queryByText(/Draft for legal review/)).not.toBeInTheDocument();
    expect(screen.getByText('Last updated 18 November 2026 · Todara Ltd, Swiss Cottages, Westlands, Nairobi, Kenya')).toBeInTheDocument();
  });

  it('shows lists with bold labels and tables with a header row', () => {
    renderUi(<LegalPage policy="privacy" />);
    const label = screen.getByText('Privacy contact:');
    expect(label).toHaveClass('label');
    expect(label.closest('li')).toHaveTextContent('Privacy contact: privacy@todarakenya.com');
    const tables = screen.getAllByRole('table');
    expect(tables).toHaveLength(2);
    expect(within(tables[0]!).getByRole('columnheader', { name: 'Legal basis' })).toBeInTheDocument();
    expect(within(tables[0]!).getByRole('cell', { name: 'Performance of a contract' })).toBeInTheDocument();
  });

  it('lets the visitor see and change their cookie choice on the cookie policy only', async () => {
    const { user, unmount } = renderUi(<LegalPage policy="cookies" />);
    expect(screen.getByText('Not chosen yet')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Accept all' }));
    expect(screen.getByText('All cookies accepted')).toBeInTheDocument();
    expect(localStorage.getItem('todara-cookie-v1')).toBe('all');
    await user.click(screen.getByRole('button', { name: 'Essential only' }));
    expect(screen.getByText('Essential cookies only')).toBeInTheDocument();
    unmount();
    renderUi(<LegalPage policy="privacy" />);
    expect(screen.queryByText(/Your choice on this device/)).not.toBeInTheDocument();
  });

  it('gives each policy its own canonical URL and its own title, with the design’s legal description', () => {
    const titles = { privacy: 'Privacy policy | Todara', terms: 'Terms of use | Todara', sale: 'Terms of sale | Todara', cookies: 'Cookie policy | Todara' };
    for (const key of policyOrder) {
      const meta = legalMetadata(key);
      expect(meta.alternates?.canonical).toBe(policies[key].href);
      expect(meta.title).toEqual({ absolute: titles[key] });
      expect(meta.description).toBe(LEGAL_DESCRIPTION);
    }
  });
});
