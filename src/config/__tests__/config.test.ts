import { readEnv } from '../env';
import { mediaUrl } from '../media';
import { clampDescription, pageMetadata } from '../seo';

describe('readEnv', () => {
  it('works with no variables at all (fresh clone, tests)', () => {
    const env = readEnv({});
    expect(env.SITE_URL).toBe('https://todarakenya.com');
    expect(env.SITE_INDEXING).toBe('off');
    expect(env.FORMS_DELIVERY).toBe('none');
    expect(env.QUOTE_TO_EMAIL).toBe('export@todarakenya.com');
  });

  it('emails quote requests by default in production and trims a trailing slash from SITE_URL', () => {
    const env = readEnv({ NODE_ENV: 'production', SITE_URL: 'https://todarakenya.com/' });
    expect(env.FORMS_DELIVERY).toBe('resend');
    expect(env.SITE_URL).toBe('https://todarakenya.com');
  });

  it('rejects invalid values instead of running misconfigured', () => {
    expect(() => readEnv({ SITE_INDEXING: 'yes' })).toThrow();
    expect(() => readEnv({ QUOTE_TO_EMAIL: 'not-an-email' })).toThrow();
    expect(() => readEnv({ EMAIL_SITE_URL: 'todara.vercel' })).toThrow();
  });

  it('keeps the email site address optional and trims its trailing slash', () => {
    expect(readEnv({}).EMAIL_SITE_URL).toBeUndefined();
    expect(readEnv({ EMAIL_SITE_URL: 'https://todara-the-bug-detective.vercel.app/' }).EMAIL_SITE_URL).toBe('https://todara-the-bug-detective.vercel.app');
  });
});

describe('mediaUrl', () => {
  it('serves photos from public/media when no Blob store is configured', () => {
    expect(mediaUrl('images/todara-hero-fruit.png')).toBe('/media/images/todara-hero-fruit.png');
    expect(mediaUrl('/images/x.jpg')).toBe('/media/images/x.jpg');
  });
});

describe('pageMetadata', () => {
  it('sets the exact title, a canonical URL and social cards', () => {
    const meta = pageMetadata({ title: 'About Todara | Kenyan avocado and mango exporter', description: 'About.', path: '/about' });
    expect(meta.title).toEqual({ absolute: 'About Todara | Kenyan avocado and mango exporter' });
    expect(meta.alternates?.canonical).toBe('/about');
    expect(meta.openGraph).toMatchObject({ url: '/about', title: 'About Todara | Kenyan avocado and mango exporter' });
  });

  it('cuts descriptions at 158 characters like the design', () => {
    expect(clampDescription('x'.repeat(200))).toHaveLength(158);
  });
});
