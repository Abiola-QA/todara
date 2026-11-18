import { renderUi, screen, within } from '@/testing/test-utils';

import { ColdChain } from '../components/cold-chain';
import { CredentialsStrip } from '../components/credentials-strip';
import { FaqTeaser } from '../components/faq-teaser';
import { FormRangeCards } from '../components/form-range-cards';
import { HomeHero } from '../components/home-hero';
import { LicencesTeaser } from '../components/licences-teaser';
import { OrderSteps } from '../components/order-steps';
import { RangeMatrix } from '../components/range-matrix';
import { SupplyYear } from '../components/supply-year';

describe('HomeHero', () => {
  it('has the page heading and the three ways in', () => {
    renderUi(<HomeHero />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Kenyan avocado and mango exporter. Fresh, IQF and puree.');
    expect(screen.getByRole('link', { name: 'Request a quote' })).toHaveAttribute('href', '/quote');
    expect(screen.getByRole('link', { name: 'Explore products' })).toHaveAttribute('href', '/products');
    const wa = screen.getByRole('link', { name: 'WhatsApp the export team' });
    expect(wa).toHaveAttribute('href', expect.stringMatching(/^https:\/\/wa\.me\/254183062440\?text=/));
    expect(wa).toHaveAttribute('target', '_blank');
    expect(wa).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('shows the fruit photo with a description', () => {
    renderUi(<HomeHero />);
    expect(screen.getByAltText('Kenyan Hass avocado, whole and halved, with Kent mango, whole and cut')).toHaveAttribute(
      'src',
      '/media/images/todara-hero-fruit.png',
    );
  });
});

describe('CredentialsStrip', () => {
  it('lists the licences and markets with decorative separators', () => {
    renderUi(<CredentialsStrip />);
    expect(screen.getByText('KEPHIS registered')).toBeInTheDocument();
    expect(screen.getByText('Europe · Middle East · Asia')).toBeInTheDocument();
    const separators = screen.getAllByText('·');
    expect(separators).toHaveLength(3);
    for (const s of separators) expect(s).toHaveAttribute('aria-hidden', 'true');
  });
});

describe('RangeMatrix', () => {
  it('links every product from both the table and the phone cards', () => {
    renderUi(<RangeMatrix />);
    const links = screen.getAllByRole('link', { name: 'Avocado dice →' });
    expect(links).toHaveLength(2);
    for (const link of links) expect(link).toHaveAttribute('href', '/products/iqf-avocado-dice');
    expect(screen.getAllByRole('link')).toHaveLength(18);
  });
});

describe('FormRangeCards', () => {
  it('has a card per form with its products and the two next steps', () => {
    renderUi(<FormRangeCards />);
    const viewRange = screen.getAllByRole('link', { name: 'View range' });
    expect(viewRange.map((l) => l.getAttribute('href'))).toEqual(['/products?form=fresh', '/products?form=iqf', '/products?form=puree']);
    expect(screen.getAllByRole('link', { name: 'Get a quote' })).toHaveLength(3);
    expect(screen.getByRole('link', { name: /IQF mango halves and cheeks/ })).toHaveAttribute('href', '/products/iqf-mango-halves-and-cheeks');
    expect(screen.getByText('Ambient or −18 °C')).toBeInTheDocument();
  });
});

describe('SupplyYear', () => {
  it('splits fresh fruit (with its season) from the year-round lines', () => {
    renderUi(<SupplyYear />);
    const seasonal = screen.getByRole('heading', { name: 'Seasonal · fresh fruit' }).parentElement as HTMLElement;
    const yearRound = screen.getByRole('heading', { name: 'Year-round · from stock' }).parentElement as HTMLElement;
    expect(within(seasonal).getAllByRole('link')).toHaveLength(3);
    expect(within(seasonal).getByText('March to October (peak April to August)')).toBeInTheDocument();
    expect(within(yearRound).getAllByRole('link')).toHaveLength(6);
    expect(screen.getByRole('link', { name: 'Month-by-month calendar' })).toHaveAttribute('href', '/seasonality');
  });
});

describe('ColdChain', () => {
  it('shows the four steps of each form', () => {
    renderUi(<ColdChain />);
    expect(screen.getAllByRole('list')).toHaveLength(3);
    expect(screen.getAllByRole('listitem')).toHaveLength(12);
    expect(screen.getByText('Individually quick frozen')).toBeInTheDocument();
  });
});

describe('OrderSteps', () => {
  it('lists the six steps in order', () => {
    renderUi(<OrderSteps />);
    const steps = screen.getAllByRole('listitem');
    expect(steps).toHaveLength(6);
    expect(steps[0]).toHaveTextContent('01Enquiry');
    expect(steps[5]).toHaveTextContent('06Arrival');
  });
});

describe('LicencesTeaser', () => {
  it('lists every licence with its status and links to compliance', () => {
    renderUi(<LicencesTeaser />);
    expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(5);
    expect(screen.getAllByText('Active')).toHaveLength(2);
    expect(screen.getByRole('link', { name: 'Compliance and documents' })).toHaveAttribute('href', '/compliance');
  });
});

describe('FaqTeaser', () => {
  it('shows the four home questions, one answer open at a time', async () => {
    const { user } = renderUi(<FaqTeaser />);
    const toggles = screen.getAllByRole('button');
    expect(toggles.map((b) => b.textContent?.replace(/[+–]$/, ''))).toEqual([
      'Which forms do you supply?',
      'How do you ship?',
      'How long does shipping take?',
      'What order sizes do you accept?',
    ]);
    expect(screen.queryByText(/Fresh fruit and IQF travel/)).not.toBeVisible();
    await user.click(toggles[1] as HTMLElement);
    expect(screen.getByText(/Fresh fruit and IQF travel/)).toBeVisible();
    expect(toggles[1]).toHaveAttribute('aria-expanded', 'true');
    await user.click(toggles[2] as HTMLElement);
    expect(screen.getByText(/Fresh fruit and IQF travel/)).not.toBeVisible();
    expect(screen.getByRole('link', { name: 'See all questions' })).toHaveAttribute('href', '/faq');
  });
});
