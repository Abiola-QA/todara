import { renderUi, screen } from '@/testing/test-utils';

import { CookieBanner } from '../cookie-banner';
import { COOKIE_CHOICE_KEY, cookieConsent } from '../cookie-consent';

describe('CookieBanner', () => {
  beforeEach(() => {
    localStorage.clear();
    cookieConsent._reset();
  });

  it('asks once, saves the choice and hides', async () => {
    const { user, unmount } = renderUi(<CookieBanner />);
    expect(screen.getByRole('dialog', { name: 'Cookie choice' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Cookie policy' })).toHaveAttribute('href', '/cookies');
    await user.click(screen.getByRole('button', { name: 'Essential only' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(localStorage.getItem(COOKIE_CHOICE_KEY)).toBe('essential');
    unmount();
    renderUi(<CookieBanner />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
