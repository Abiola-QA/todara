import { renderUi, screen } from '@/testing/test-utils';

import NotFound, { metadata } from '../not-found';

describe('NotFound', () => {
  it('explains the page is missing and links to products and home, inside the site frame', () => {
    renderUi(<NotFound />);
    expect(screen.getByRole('heading', { level: 1, name: 'This page is not on our site.' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Browse products' })).toHaveAttribute('href', '/products');
    expect(screen.getByRole('link', { name: 'Go to the home page' })).toHaveAttribute('href', '/');
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });

  it('is kept out of search results', () => {
    expect(metadata.robots).toEqual({ index: false, follow: true });
  });
});
