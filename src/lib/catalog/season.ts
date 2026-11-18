import type { SeasonCode } from './products';

export const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] as const;
/** Single-letter month heads used on phones and on the spec sheets. */
export const monthInitials = months.map((m) => m[0] as string);

export const seasonLabel: Record<SeasonCode, string> = { p: 'Peak', a: 'Available', o: 'Limited or none' };

export type SeasonCell = { code: SeasonCode; title: string };

/** A product's twelve month cells with their hover titles ("Apr: Peak"). Unknown letters read as "limited or none". */
export function seasonCells(season: string): SeasonCell[] {
  return months.map((month, i) => {
    const c = season[i];
    const code: SeasonCode = c === 'p' || c === 'a' ? c : 'o';
    return { code, title: `${month}: ${seasonLabel[code]}` };
  });
}
