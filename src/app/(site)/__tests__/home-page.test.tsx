import { renderUi, screen } from '@/testing/test-utils';

import HomePage, { metadata } from '../page';

describe('home page', () => {
  it('uses the design title, description and canonical', () => {
    expect(metadata.title).toEqual({ absolute: 'Todara | Kenyan avocado and mango exporter: fresh, IQF and puree' });
    expect(metadata.description).toBe(
      'Kenyan Hass and Fuerte avocado and Apple and Kent mango: fresh, IQF and puree. AFA–HCD licensed, KEPHIS registered, HACCP and GlobalG.A.P. certified.',
    );
    expect(metadata.alternates?.canonical).toBe('/');
  });

  it('renders one h1 and every section in the design order', () => {
    renderUi(<HomePage />);
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(screen.getAllByRole('heading', { level: 2 }).map((h) => h.textContent)).toEqual([
      'Avocado and mango in four forms',
      'Frozen and puree all year. Fresh in season.',
      'A temperature chain for each form',
      'Six steps from enquiry to arrival',
      'Licensed and certified on every order',
      'Questions buyers ask',
    ]);
  });

  it('describes the organisation, the site and all 13 questions as structured data', () => {
    renderUi(<HomePage />);
    const script = document.querySelector('script[type="application/ld+json"]');
    const data = JSON.parse(script?.innerHTML ?? '{}') as { '@graph': { '@type': string; mainEntity?: unknown[] }[] };
    expect(data['@graph'].map((n) => n['@type'])).toEqual(['Organization', 'WebSite', 'FAQPage']);
    expect(data['@graph'][2]?.mainEntity).toHaveLength(13);
  });
});
