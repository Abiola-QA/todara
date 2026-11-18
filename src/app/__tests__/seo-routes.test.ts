const seo = vi.hoisted(() => ({ searchIndexing: false }));
vi.mock('@/config/seo', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/config/seo')>();
  return {
    ...actual,
    get searchIndexing() {
      return seo.searchIndexing;
    },
  };
});

import manifest from '../manifest';
import robots from '../robots';
import sitemap from '../sitemap';

describe('robots and sitemap', () => {
  afterEach(() => {
    seo.searchIndexing = false;
  });

  it('keep previews out of search engines', () => {
    expect(robots().rules).toEqual({ userAgent: '*', disallow: '/' });
    expect(sitemap()).toEqual([]);
  });

  it('in production list every page, including all nine products', () => {
    seo.searchIndexing = true;
    expect(robots()).toMatchObject({ rules: { userAgent: '*', allow: '/' }, sitemap: 'https://todarakenya.com/sitemap.xml' });
    const urls = sitemap().map((e) => e.url);
    expect(urls).toContain('https://todarakenya.com/');
    expect(urls).toContain('https://todarakenya.com/products/hass-avocado');
    expect(urls.filter((u) => u.includes('/products/'))).toHaveLength(9);
    expect(new Set(urls).size).toBe(urls.length);
  });
});

describe('manifest', () => {
  it('uses the brand colours and app icons', () => {
    expect(manifest()).toMatchObject({ short_name: 'Todara', theme_color: '#1E3A2F' });
  });
});
