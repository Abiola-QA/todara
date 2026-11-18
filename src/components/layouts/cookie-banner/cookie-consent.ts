/** The visitor's cookie choice, kept on their device so the banner asks once. */
export type CookieChoice = 'all' | 'essential';

export const COOKIE_CHOICE_KEY = 'todara-cookie-choice';

const listeners = new Set<() => void>();
/** Used when the browser blocks storage: the choice then holds until the page is reloaded. */
let memory: CookieChoice | null = null;

function read(): CookieChoice | null {
  try {
    const v = window.localStorage.getItem(COOKIE_CHOICE_KEY);
    if (v === 'all' || v === 'essential') return v;
  } catch {
    // Storage blocked.
  }
  return memory;
}

export const cookieConsent = {
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  /** null = not chosen yet (show the banner). */
  getSnapshot: (): CookieChoice | null => read(),
  /** Nothing is known on the server; the banner appears once the page has loaded and no choice is saved. */
  getServerSnapshot: (): CookieChoice | 'unknown' => 'unknown',
  choose(choice: CookieChoice) {
    memory = choice;
    try {
      window.localStorage.setItem(COOKIE_CHOICE_KEY, choice);
    } catch {
      // Storage blocked: the in-memory choice covers this visit.
    }
    listeners.forEach((l) => l());
  },
  /** Tests only. */
  _reset() {
    memory = null;
    listeners.clear();
  },
};
