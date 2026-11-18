import { forms, products, type Fruit, type RangeCell } from '@/lib/catalog';

/** Column heads of the range matrix, in the design's order (the design's CELLS). */
export const rangeCells: readonly { cell: RangeCell; label: string }[] = [
  { cell: 'fresh', label: 'Fresh' },
  { cell: 'halves', label: 'IQF halves' },
  { cell: 'dice', label: 'IQF dice' },
  { cell: 'puree', label: 'Puree' },
];

export type MatrixItem = { name: string; slug: string };
export type MatrixCell = { label: string; dot: string; tint: string; items: MatrixItem[] };
export type MatrixRow = { fruit: string; cells: MatrixCell[] };

/** "IQF avocado halves" → "Avocado halves"; other names keep their first letter upper-cased. */
export function matrixName(name: string) {
  const n = name.replace(/^IQF /, '');
  return n.charAt(0).toUpperCase() + n.slice(1);
}

/** Avocado and mango rows, each with one cell per form column (the design's `matrix`). */
export function rangeMatrix(): MatrixRow[] {
  const fruits: Fruit[] = ['avocado', 'mango'];
  return fruits.map((fruit) => ({
    fruit: fruit === 'avocado' ? 'Avocado' : 'Mango',
    cells: rangeCells.map(({ cell, label }) => {
      const inCell = products.filter((p) => p.fruit === fruit && p.cell === cell);
      const form = forms[inCell[0]?.form ?? 'fresh'];
      return { label, dot: form.dot, tint: form.tint, items: inCell.map((p) => ({ name: matrixName(p.name), slug: p.slug })) };
    }),
  }));
}
