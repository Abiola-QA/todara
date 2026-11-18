import { products } from '@/lib/catalog';
import { renderUi, screen, within } from '@/testing/test-utils';

import { SeasonCalendar, seasonSummary } from '../components/season-calendar';
import { SeasonalityPage } from '../components/seasonality-page';

const rowLinks = () => screen.getAllByRole('link', { name: /spec →/ });

describe('SeasonCalendar', () => {
  it('lists every product with a link to its page and twelve month cells', () => {
    renderUi(<SeasonCalendar />);
    expect(rowLinks()).toHaveLength(products.length);
    const hass = screen.getByRole('link', { name: /Hass avocado/ });
    expect(hass).toHaveAttribute('href', '/products/hass-avocado');
    expect(screen.getAllByTitle(/^[A-Z][a-z]{2}: /)).toHaveLength(products.length * 12);
    expect(screen.getAllByTitle('Apr: Peak')[0]).toHaveClass('p');
  });

  it('filters the rows by form and marks the chosen chip', async () => {
    const { user } = renderUi(<SeasonCalendar />);
    const iqf = screen.getByRole('button', { name: 'IQF frozen' });
    await user.click(iqf);
    expect(iqf).toHaveAttribute('aria-pressed', 'true');
    expect(rowLinks()).toHaveLength(4);
    rowLinks().forEach((link) => expect(link).toHaveTextContent('IQF frozen · spec →'));

    await user.click(screen.getByRole('button', { name: 'All' }));
    expect(rowLinks()).toHaveLength(products.length);
  });

  it('summarises a season for screen readers', () => {
    expect(seasonSummary('ooapppppaaoo')).toBe('Peak: Apr, May, Jun, Jul, Aug. Available: Mar, Sep, Oct. Limited or none: Jan, Feb, Nov, Dec.');
    expect(seasonSummary('aaaaaaaaaaaa')).toBe('Available: Jan, Feb, Mar, Apr, May, Jun, Jul, Aug, Sep, Oct, Nov, Dec.');
  });
});

describe('SeasonalityPage', () => {
  it('has the heading, legend and a link to plan a programme', () => {
    renderUi(<SeasonalityPage />);
    expect(screen.getByRole('heading', { level: 1, name: 'Kenyan avocado and mango season calendar' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Plan a season programme' })).toHaveAttribute('href', '/quote');
    const legend = screen.getByText('Limited or none', { selector: 'span' }).parentElement as HTMLElement;
    expect(within(legend).getByText('Peak')).toBeInTheDocument();
  });
});
