import { paths } from '@/config/paths';

import content from './policies-content.json';

export type PolicyKey = 'privacy' | 'terms' | 'sale' | 'cookies';

/** A paragraph, a bullet list ("Label:: text" items get a bold label) or a table whose first row is the header. */
type RawBlock = string | string[] | { cols: string; rows: string[][] };
type RawPolicy = { title: string; intro: string; sections: { h: string; b: RawBlock[] }[] };

export type ListItem = { label: string; text: string };
export type PolicyBlock =
  { kind: 'paragraph'; text: string } | { kind: 'list'; items: ListItem[] } | { kind: 'table'; columns: string; header: string[]; rows: string[][] };

export type PolicySection = { heading: string; blocks: PolicyBlock[] };

export type Policy = {
  key: PolicyKey;
  href: string;
  title: string;
  intro: string;
  sections: PolicySection[];
};

/** "Address:: Swiss Cottages…" → bold "Address: " + text, as the design renders list items. */
export function parseListItem(value: string): ListItem {
  const k = value.indexOf(':: ');
  return k > 0 ? { label: `${value.slice(0, k)}: `, text: value.slice(k + 3) } : { label: '', text: value };
}

function toBlock(raw: RawBlock): PolicyBlock {
  if (typeof raw === 'string') return { kind: 'paragraph', text: raw };
  if (Array.isArray(raw)) return { kind: 'list', items: raw.map(parseListItem) };
  const [header = [], ...rows] = raw.rows;
  return { kind: 'table', columns: raw.cols, header, rows };
}

const hrefs: Record<PolicyKey, string> = { privacy: paths.privacy, terms: paths.terms, sale: paths.termsOfSale, cookies: paths.cookies };

/** The order of the policy switcher, as in the design. */
export const policyOrder: readonly PolicyKey[] = ['privacy', 'terms', 'sale', 'cookies'];

/**
 * The four policies, word for word from the design (policies-content.json is the design's LEGAL object).
 * Section headings are numbered "1. Who we are", as the design shows them.
 */
export const policies = Object.fromEntries(
  policyOrder.map((key) => {
    const raw = (content as Record<PolicyKey, RawPolicy>)[key];
    const policy: Policy = {
      key,
      href: hrefs[key],
      title: raw.title,
      intro: raw.intro,
      sections: raw.sections.map((s, i) => ({ heading: `${i + 1}. ${s.h}`, blocks: s.b.map(toBlock) })),
    };
    return [key, policy];
  }),
) as Record<PolicyKey, Policy>;

/** "Last updated" line under every policy. */
export const POLICIES_UPDATED = '18 November 2026';
