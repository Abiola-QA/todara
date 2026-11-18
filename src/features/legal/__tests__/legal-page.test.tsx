import { renderUi, screen } from '@/testing/test-utils';

import { LegalPage } from '../components/legal-page';
import { policies } from '../data/policies';
import { legalMetadata } from '../metadata';

describe('LegalPage', () => {
  it('renders the chosen policy and marks it in the policy switcher', () => {
    renderUi(<LegalPage policy="terms" />);
    expect(screen.getByRole('heading', { level: 1, name: 'Terms of use' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Terms of use' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('link', { name: 'Privacy policy' })).toHaveAttribute('href', '/privacy');
    expect(screen.getByRole('link', { name: 'Cookie policy' })).not.toHaveAttribute('aria-current');
    for (const s of policies.terms.sections) expect(screen.getByRole('heading', { level: 2, name: s.heading })).toBeInTheDocument();
    expect(screen.getByText(/Draft for legal review/)).toBeInTheDocument();
    expect(screen.getByText('Last updated November 2026 · Todara Ltd, Nairobi, Kenya')).toBeInTheDocument();
  });

  it('uses the design text for the privacy policy, including the privacy contact', () => {
    renderUi(<LegalPage policy="privacy" />);
    expect(
      screen.getByText('You can ask to see, correct or delete your data, or object to how we use it. Write to privacy@todarakenya.com.'),
    ).toBeInTheDocument();
    expect(screen.getByText('Todara Ltd, Nairobi, Kenya, is the data controller for personal data collected through todarakenya.com.')).toBeInTheDocument();
  });

  it('gives each policy its own canonical URL and its own title', () => {
    const titles = { privacy: 'Privacy policy | Todara', terms: 'Terms of use | Todara', cookies: 'Cookie policy | Todara' };
    for (const key of ['privacy', 'terms', 'cookies'] as const) {
      const meta = legalMetadata(key);
      expect(meta.alternates?.canonical).toBe(`/${key}`);
      expect(meta.title).toEqual({ absolute: titles[key] });
    }
  });
});
