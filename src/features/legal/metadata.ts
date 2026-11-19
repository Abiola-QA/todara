import type { Metadata } from 'next';

import { pageMetadata } from '@/config/seo';

import { policies, type PolicyKey } from './data/policies';

/** The design's description for its legal view, shared by the four policy pages. */
export const LEGAL_DESCRIPTION =
  'Todara Ltd privacy policy, terms of use, terms of sale and cookie policy, under the laws of Kenya and the Kenya Data Protection Act, 2019.';

/**
 * The design's single legal view has one title ("Privacy, terms and cookies | Todara"). As four separate pages,
 * each policy gets its own title so search engines do not see duplicates.
 */
export function legalMetadata(key: PolicyKey): Metadata {
  const policy = policies[key];
  return pageMetadata({ title: `${policy.title} | Todara`, description: LEGAL_DESCRIPTION, path: policy.href });
}
