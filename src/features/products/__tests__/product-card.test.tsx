import { productById } from '@/lib/catalog';
import { quoteStore } from '@/lib/quote';
import { toastStore } from '@/lib/toast';
import { renderUi, screen, within } from '@/testing/test-utils';

import { ProductCard } from '../components/product-card';

const hass = productById('hass')!;

beforeEach(() => {
  localStorage.clear();
  quoteStore._reset();
});

describe('ProductCard', () => {
  it('shows the photo, form badge, name link, summary and three facts', () => {
    renderUi(<ProductCard product={hass} />);
    const card = screen.getByRole('article');
    expect(within(card).getByRole('img', { name: hass.imageAlt })).toBeInTheDocument();
    expect(within(card).getByText('Fresh fruit')).toBeInTheDocument();
    expect(within(card).getByRole('link', { name: 'Hass avocado' })).toHaveAttribute('href', '/products/hass-avocado');
    expect(within(card).getByText(hass.short)).toBeInTheDocument();
    expect(
      within(card)
        .getAllByRole('term')
        .map((t) => t.textContent),
    ).toEqual(['Varieties', 'Counts', 'Stem']);
    expect(within(card).getByRole('link', { name: 'Specification' })).toHaveAttribute('href', '/products/hass-avocado');
  });

  it('adds the product to the quote and confirms with a toast', async () => {
    const { user } = renderUi(<ProductCard product={hass} />);
    await user.click(screen.getByRole('button', { name: '+ Add to quote' }));
    expect(quoteStore.getSnapshot().basket).toEqual([{ id: 'hass', volume: '', opt: '12–14' }]);
    expect(screen.getByRole('button', { name: 'In your quote ✓' })).toBeInTheDocument();
    expect(toastStore.getSnapshot()?.text).toBe('Hass avocado added to your quote');
  });
});
