import { quoteStore } from '@/lib/quote';
import { renderUi, screen, within } from '@/testing/test-utils';

import { CompareSection } from '../components/compare-section';

beforeEach(() => {
  localStorage.clear();
  quoteStore._reset();
});

describe('CompareSection', () => {
  it('shows every field of the form in the table, with dashes for missing values', () => {
    renderUi(<CompareSection filter="fresh" />);
    const table = screen.getByRole('table', { name: 'Compare Fresh fruit' });
    expect(within(table).getAllByRole('rowheader')).toHaveLength(12);
    expect(
      within(table)
        .getAllByRole('columnheader')
        .map((c) => c.textContent),
    ).toEqual(['Specification', 'Hass avocado', 'Fuerte & green-skin avocado', 'Mango']);
    expect(within(table).getAllByText('—').length).toBeGreaterThanOrEqual(3);
  });

  it('gives phones one swipeable card per product with only the filled fields and an add button', async () => {
    const { user } = renderUi(<CompareSection filter="puree" />);
    expect(screen.getByText('Swipe to compare →')).toBeInTheDocument();
    const cardLink = screen.getByRole('link', { name: 'Mango puree →' });
    expect(cardLink).toHaveAttribute('href', '/products/mango-puree');
    const addButtons = screen.getAllByRole('button', { name: '+ Add to quote' });
    expect(addButtons).toHaveLength(2);
    await user.click(addButtons[1]!);
    expect(quoteStore.getSnapshot().basket.map((b) => b.id)).toEqual(['avo-pulp']);
  });
});
