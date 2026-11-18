import { matrixName, rangeCells, rangeMatrix } from '../utils/range-matrix';

describe('matrixName', () => {
  it('drops the IQF prefix and capitalises the first letter', () => {
    expect(matrixName('IQF avocado halves')).toBe('Avocado halves');
    expect(matrixName('IQF mango halves and cheeks')).toBe('Mango halves and cheeks');
  });

  it('keeps other names as they are, capitalised', () => {
    expect(matrixName('Hass avocado')).toBe('Hass avocado');
    expect(matrixName('mango puree')).toBe('Mango puree');
  });
});

describe('rangeMatrix', () => {
  const rows = rangeMatrix();

  it('has an avocado row and a mango row with one cell per column', () => {
    expect(rows.map((r) => r.fruit)).toEqual(['Avocado', 'Mango']);
    for (const row of rows) expect(row.cells.map((c) => c.label)).toEqual(rangeCells.map((c) => c.label));
  });

  it('puts every product in exactly one cell', () => {
    const names = rows.flatMap((r) => r.cells.flatMap((c) => c.items.map((i) => i.name)));
    expect(names).toEqual([
      'Hass avocado',
      'Fuerte & green-skin avocado',
      'Avocado halves',
      'Avocado dice',
      'Avocado puree and pulp',
      'Mango',
      'Mango halves and cheeks',
      'Mango dice',
      'Mango puree',
    ]);
  });

  it('colours each cell by its form', () => {
    const [avocado] = rows;
    expect(avocado?.cells.map((c) => c.dot)).toEqual(['#6F9A4C', '#3F6B7A', '#3F6B7A', '#C9973F']);
    expect(avocado?.cells[0]?.tint).toBe('#E3ECDD');
  });
});
