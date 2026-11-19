import '@testing-library/jest-dom/vitest';

import { cleanup } from '@testing-library/react';
import { createElement } from 'react';

afterEach(() => {
  cleanup();
});

// `server-only` throws outside React Server Components; unit tests run server modules directly.
vi.mock('server-only', () => ({}));

// next/image needs the Next.js runtime; in unit tests render a plain <img>.
vi.mock('next/image', () => ({
  default: (props: Record<string, unknown>) => {
    const { src, alt, fill, priority, preload, placeholder, blurDataURL, quality, loader, unoptimized, ...rest } = props;
    void fill;
    void priority;
    void preload;
    void placeholder;
    void blurDataURL;
    void quality;
    void loader;
    void unoptimized;
    const resolved = typeof src === 'object' && src !== null ? (src as { src: string }).src : src;
    return createElement('img', { src: resolved, alt, ...rest });
  },
}));

vi.mock('next/navigation', async () => {
  const actual = await vi.importActual<typeof import('next/navigation')>('next/navigation');
  return {
    ...actual,
    useRouter: () => ({ push: vi.fn(), replace: vi.fn(), prefetch: vi.fn(), back: vi.fn() }),
    usePathname: () => '/',
    useSearchParams: () => new URLSearchParams(),
  };
});

class IntersectionObserverMock {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
  takeRecords = vi.fn(() => []);
}
vi.stubGlobal('IntersectionObserver', IntersectionObserverMock);
vi.stubGlobal(
  'ResizeObserver',
  class {
    observe = vi.fn();
    unobserve = vi.fn();
    disconnect = vi.fn();
  },
);

// jsdom has no matchMedia; components only listen for breakpoint changes, so a static "no match" is enough.
vi.stubGlobal(
  'matchMedia',
  (query: string) =>
    ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }) as unknown as MediaQueryList,
);

// jsdom does not implement scrolling; the quote form scrolls to the top after sending.
vi.stubGlobal('scrollTo', vi.fn());
