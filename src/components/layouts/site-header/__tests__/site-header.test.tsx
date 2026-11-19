import { quoteStore } from '@/lib/quote';
import { renderUi, screen } from '@/testing/test-utils';

import { isActive, searchProducts, SiteHeader } from '../site-header';

describe('searchProducts', () => {
  it('matches product name, form and fruit, case-insensitively', () => {
    expect(searchProducts('PUREE').map((p) => p.id)).toEqual(['mango-puree', 'avo-pulp']);
    expect(searchProducts('avocado dice').map((p) => p.id)).toEqual(['iqf-avo-dice']);
  });

  it('matches every word on its own, in any order (the placeholder example "IQF dice" finds both dice products)', () => {
    expect(searchProducts('IQF dice').map((p) => p.id)).toEqual(['iqf-avo-dice', 'iqf-mango-dice']);
    expect(searchProducts('dice   IQF').map((p) => p.id)).toEqual(['iqf-avo-dice', 'iqf-mango-dice']);
    expect(searchProducts('mango puree').map((p) => p.id)).toEqual(['mango-puree']);
    expect(searchProducts('iqf frozen avocado').map((p) => p.id)).toEqual(['iqf-avo-halves', 'iqf-avo-dice']);
    expect(searchProducts('mango durian')).toEqual([]);
    expect(searchProducts('mango').length).toBe(4);
    expect(searchProducts('   ')).toEqual([]);
  });
});

describe('isActive', () => {
  it('keeps Products active on product pages', () => {
    expect(isActive('/products/hass-avocado', '/products')).toBe(true);
    expect(isActive('/products', '/products')).toBe(true);
    expect(isActive('/faq', '/products')).toBe(false);
  });
});

describe('SiteHeader', () => {
  beforeEach(() => {
    localStorage.clear();
    quoteStore._reset();
  });

  it('opens the search, lists matching products and says when nothing matches', async () => {
    const { user } = renderUi(<SiteHeader />);
    await user.click(screen.getByRole('button', { name: 'Search products' }));
    const input = screen.getByRole('textbox', { name: 'Search products' });
    expect(input).toHaveFocus();
    await user.type(input, 'avocado dice');
    expect(screen.getByRole('link', { name: /IQF avocado dice/ })).toHaveAttribute('href', '/products/iqf-avocado-dice');
    await user.clear(input);
    await user.type(input, 'durian');
    expect(screen.getByText('No match. Try avocado, mango, IQF or puree.')).toBeInTheDocument();
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('textbox', { name: 'Search products' })).not.toBeInTheDocument();
  });

  it('shows how many products are in the quote', () => {
    quoteStore.add('hass');
    quoteStore.add('mango');
    renderUi(<SiteHeader />);
    expect(screen.getByRole('link', { name: /Quote\s*2 products in your quote/ })).toHaveAttribute('href', '/quote');
  });

  it('opens the mobile drawer with every product grouped by form', async () => {
    const { user } = renderUi(<SiteHeader />);
    await user.click(screen.getByRole('button', { name: 'Menu' }));
    expect(screen.getByRole('button', { name: 'Menu' })).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getAllByRole('link', { name: 'Avocado puree and pulp' })[0]).toHaveAttribute('href', '/products/avocado-puree-and-pulp');
  });
});
