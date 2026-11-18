import type { FormKey } from '@/lib/catalog';

/** Every internal route, so links never hard-code a path. */
export const paths = {
  home: '/',
  products: '/products',
  /** The products page with one form's tab selected. */
  productsInForm: (form: FormKey) => `/products?form=${form}`,
  product: (slug: string) => `/products/${slug}`,
  seasonality: '/seasonality',
  compliance: '/compliance',
  about: '/about',
  faq: '/faq',
  quote: '/quote',
  privacy: '/privacy',
  terms: '/terms',
  cookies: '/cookies',
  specSheets: '/spec-sheets',
  /** One product's sheet inside the spec sheets document. */
  specSheet: (code: string) => `/spec-sheets#${code}`,
} as const;
