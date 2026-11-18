import type { Metadata } from 'next';

import { pageMetadata } from '@/config/seo';

import { policies, type PolicyKey } from './data/policies';

/**
 * The design's single legal view has one title ("Privacy, terms and cookies | Todara"). As three separate pages
 * each policy gets its own title and description, so search engines do not see duplicates.
 */
export function legalMetadata(key: PolicyKey): Metadata {
  const policy = policies[key];
  return pageMetadata({
    title: `${policy.title} | Todara`,
    description: `${policy.intro} Part of the Todara Ltd privacy policy, terms of use and cookie policy.`,
    path: policy.href,
  });
}
