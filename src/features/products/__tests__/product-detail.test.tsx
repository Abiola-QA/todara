import { productById } from '@/lib/catalog';
import { quoteStore } from '@/lib/quote';
import { act, renderUi, screen, within } from '@/testing/test-utils';

import { ProductDetail } from '../components/product-detail';

const push = vi.fn();
vi.mock('next/navigation', async () => {
  const actual = await vi.importActual<typeof import('next/navigation')>('next/navigation');
  return { ...actual, useRouter: () => ({ push, replace: vi.fn(), prefetch: vi.fn(), back: vi.fn() }), usePathname: () => '/products/hass-avocado' };
});

const hass = productById('hass')!;

beforeEach(() => {
  localStorage.clear();
  quoteStore._reset();
  push.mockReset();
});

describe('ProductDetail', () => {
  it('shows the breadcrumb, name, description, key facts with the option cell and buying terms', () => {
    renderUi(<ProductDetail product={hass} />);
    const crumbs = screen.getByRole('navigation', { name: 'Breadcrumb' });
    expect(within(crumbs).getByRole('link', { name: '← Products' })).toHaveAttribute('href', '/products');
    expect(screen.getByRole('heading', { level: 1, name: 'Hass avocado' })).toBeInTheDocument();
    expect(screen.getByText('Spec TD-AV-HS')).toBeInTheDocument();
    expect(screen.getByText(hass.desc)).toBeInTheDocument();
    expect(screen.getByText('12–14 · 16–18 · 20–22 · 24–26 · Mixed')).toBeInTheDocument();
    expect(screen.getByText('USD, FOB Mombasa or FCA Nairobi')).toBeInTheDocument();
    // The form temperature under the photo, and the third cold-chain step.
    expect(screen.getAllByText('5–13 °C')).toHaveLength(2);
  });

  it('links the spec sheet and a prefilled WhatsApp message', () => {
    renderUi(<ProductDetail product={hass} />);
    expect(screen.getByRole('link', { name: /Spec sheet/ })).toHaveAttribute('href', '/spec-sheets#TD-AV-HS');
    expect(screen.getByRole('link', { name: /Spec sheet/ })).toHaveAttribute('target', '_blank');
    const wa = screen.getByRole('link', { name: 'WhatsApp' });
    expect(wa).toHaveAttribute('href', `https://wa.me/254183062440?text=${encodeURIComponent('Hello Todara, I would like a quote for Hass avocado.')}`);
  });

  it('"Request a quote" adds the product and opens the quote page', async () => {
    const { user } = renderUi(<ProductDetail product={hass} />);
    await user.click(screen.getByRole('button', { name: 'Request a quote' }));
    expect(quoteStore.getSnapshot().basket.map((b) => b.id)).toEqual(['hass']);
    expect(push).toHaveBeenCalledWith('/quote');
  });

  it('shows the quote banner once the quote has products', () => {
    renderUi(<ProductDetail product={hass} />);
    expect(screen.queryByText(/Your quote has/)).not.toBeInTheDocument();
    act(() => {
      quoteStore.add('mango');
    });
    expect(screen.getByRole('link', { name: /Your quote has 1 product/ })).toHaveAttribute('href', '/quote');
    act(() => {
      quoteStore.add('hass');
    });
    expect(screen.getByText('Your quote has 2 products')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'In your quote ✓' })).toBeInTheDocument();
  });

  it('lists the full specification, cold chain, availability, uses and form questions', () => {
    renderUi(<ProductDetail product={hass} />);
    expect(screen.getByRole('heading', { name: 'Full specification' })).toBeInTheDocument();
    expect(screen.getByText('Dry matter ≥ 21% at harvest')).toBeInTheDocument();
    expect(screen.getByText('TD-AV-HS · Rev 01 · Indicative, confirmed in each written offer')).toBeInTheDocument();
    expect(screen.getByText('Pre-cool')).toBeInTheDocument();
    expect(screen.getByTitle('Apr: Peak')).toBeInTheDocument();
    expect(screen.getByTitle('Jan: Limited or none')).toBeInTheDocument();
    expect(screen.getByTitle('Mar: Available')).toBeInTheDocument();
    expect(screen.getByText('Retail and ripening programmes')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Questions about Fresh fruit' })).toBeInTheDocument();
    expect(screen.getByText('How is maturity checked?')).toBeInTheDocument();
  });

  it('links the same fruit in its other forms', () => {
    renderUi(<ProductDetail product={hass} />);
    const also = screen.getByRole('heading', { name: 'Also available as' }).closest('section')!;
    const links = within(also).getAllByRole('link');
    expect(links.map((l) => l.getAttribute('href'))).toEqual([
      '/products/fuerte-green-skin-avocado',
      '/products/iqf-avocado-halves',
      '/products/iqf-avocado-dice',
      '/products/avocado-puree-and-pulp',
    ]);
  });
});
