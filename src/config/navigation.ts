import { paths } from './paths';

/** Header navigation, in the design's order. */
export const mainNav = [
  { label: 'Products', href: paths.products },
  { label: 'Seasonality', href: paths.seasonality },
  { label: 'Compliance', href: paths.compliance },
  { label: 'About', href: paths.about },
  { label: 'FAQ', href: paths.faq },
] as const;

/** Footer "Company" column. */
export const companyNav = [
  { label: 'Seasonality', href: paths.seasonality },
  { label: 'Licences and compliance', href: paths.compliance },
  { label: 'About Todara', href: paths.about },
  { label: 'FAQ', href: paths.faq },
  { label: 'Request a quote', href: paths.quote },
] as const;

/** Footer legal links. */
export const legalNav = [
  { label: 'Privacy', href: paths.privacy },
  { label: 'Terms of use', href: paths.terms },
  { label: 'Terms of sale', href: paths.termsOfSale },
  { label: 'Cookies', href: paths.cookies },
] as const;
