import { renderUi, screen } from '@/testing/test-utils';

import { AboutPage } from '../components/about-page';
import { aboutFacts, sources } from '../data/about';

describe('AboutPage', () => {
  it('introduces the company with its key facts', () => {
    renderUi(<AboutPage />);
    expect(screen.getByRole('heading', { level: 1, name: /built for professional buyers/ })).toBeInTheDocument();
    for (const f of aboutFacts) {
      expect(screen.getByText(f.label)).toBeInTheDocument();
      expect(screen.getByText(f.value)).toBeInTheDocument();
    }
  });

  it('shows where the fruit comes from, with a photo per source', () => {
    renderUi(<AboutPage />);
    for (const s of sources) {
      expect(screen.getByRole('heading', { level: 3, name: s.title })).toBeInTheDocument();
      expect(screen.getByAltText(s.alt)).toHaveAttribute('src', `/media/${s.image}`);
    }
  });

  it('keeps the crop saved in the design for the main photo', () => {
    renderUi(<AboutPage />);
    const main = screen.getByAltText(/Todara range/);
    expect(main).toHaveStyle({ objectPosition: 'calc(50% + 18.26144629010984cqw) calc(50% + 0cqh)' });
  });
});
