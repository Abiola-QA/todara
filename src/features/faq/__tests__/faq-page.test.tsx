import { faq } from '@/lib/content';
import { renderUi, screen } from '@/testing/test-utils';

import { FaqPage, faqPageGroups } from '../components/faq-page';

describe('FaqPage', () => {
  it('splits the questions into the two groups from the design', () => {
    expect(faqPageGroups.map((g) => g.title)).toEqual(['Products and sourcing', 'Shipping, timelines and terms']);
    expect(faqPageGroups[0]?.items).toHaveLength(5);
    expect(faqPageGroups.flatMap((g) => g.items)).toEqual(faq);
  });

  it('shows every question, one answer at a time', async () => {
    const { user } = renderUi(<FaqPage />);
    expect(screen.getAllByRole('button', { expanded: false })).toHaveLength(faq.length);
    const incoterms = screen.getByRole('button', { name: /Which Incoterms do you offer\?/ });
    await user.click(incoterms);
    expect(incoterms).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText(/FOB Mombasa and FCA Nairobi as standard/)).toBeVisible();

    await user.click(screen.getByRole('button', { name: /Do you grow your own fruit\?/ }));
    expect(incoterms).toHaveAttribute('aria-expanded', 'false');
    expect(screen.getByText(/FOB Mombasa and FCA Nairobi as standard/)).not.toBeVisible();
  });

  it('offers the quote and WhatsApp routes', () => {
    renderUi(<FaqPage />);
    expect(screen.getByRole('link', { name: 'Request a quote' })).toHaveAttribute('href', '/quote');
    const wa = screen.getByRole('link', { name: 'WhatsApp the export team' });
    expect(wa).toHaveAttribute('href', expect.stringMatching(/^https:\/\/wa\.me\/254183062440\?text=/));
    expect(wa).toHaveAttribute('rel', 'noopener noreferrer');
  });
});
