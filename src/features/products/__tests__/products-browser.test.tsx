import { quoteStore } from '@/lib/quote';
import { renderUi, screen } from '@/testing/test-utils';

import { ProductsBrowser } from '../components/products-browser';

beforeEach(() => {
  localStorage.clear();
  quoteStore._reset();
});

describe('ProductsBrowser', () => {
  it('lists all nine products and compares fresh fruit by default', () => {
    renderUi(<ProductsBrowser />);
    expect(screen.getByRole('heading', { level: 1, name: 'Avocado and mango products' })).toBeInTheDocument();
    expect(screen.getAllByRole('article')).toHaveLength(9);
    expect(screen.getByRole('button', { name: 'All forms' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('heading', { name: 'Compare: Fresh fruit' })).toBeInTheDocument();
    expect(screen.getByText('Choose a form above to compare its products.')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /All spec sheets/ })).toHaveAttribute('href', '/spec-sheets');
  });

  it('filters the grid and the comparison when a form tab is picked', async () => {
    const { user } = renderUi(<ProductsBrowser />);
    await user.click(screen.getByRole('button', { name: 'IQF frozen' }));
    expect(screen.getAllByRole('article')).toHaveLength(4);
    expect(screen.getByRole('button', { name: 'IQF frozen' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('heading', { name: 'Compare: IQF frozen' })).toBeInTheDocument();
    expect(screen.queryByText('Choose a form above to compare its products.')).not.toBeInTheDocument();
  });

  it('can start on a form (the ?form= link)', () => {
    renderUi(<ProductsBrowser initialForm="puree" />);
    expect(screen.getAllByRole('article')).toHaveLength(2);
    expect(screen.getByRole('button', { name: 'Puree and pulp' })).toHaveAttribute('aria-pressed', 'true');
  });
});
