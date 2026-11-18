import { emptyDetails, parseSaved, quoteStore, STORAGE_KEY } from '../quote-store';

describe('parseSaved', () => {
  it('reads the design prototype format ({ basket, f })', () => {
    const state = parseSaved(JSON.stringify({ basket: [{ id: 'hass', volume: '20 t', opt: '16–18' }], f: { company: 'Acme', incoterm: 'CIF' } }));
    expect(state.basket).toEqual([{ id: 'hass', volume: '20 t', opt: '16–18' }]);
    expect(state.details.company).toBe('Acme');
    expect(state.details.incoterm).toBe('CIF');
    expect(state.details.frequency).toBe(emptyDetails.frequency);
  });

  it('drops unknown or duplicate products and malformed values', () => {
    const state = parseSaved(
      JSON.stringify({ basket: [{ id: 'hass' }, { id: 'hass' }, { id: 'durian' }, 'junk', null], f: { company: 42, name: 'Jane', evil: '<script>' } }),
    );
    expect(state.basket).toEqual([{ id: 'hass', volume: '', opt: '' }]);
    expect(state.details.company).toBe('');
    expect(state.details.name).toBe('Jane');
    expect(state.details).not.toHaveProperty('evil');
  });

  it('falls back to an empty quote for missing or broken storage', () => {
    expect(parseSaved(null).basket).toEqual([]);
    expect(parseSaved('{not json').basket).toEqual([]);
  });
});

describe('quoteStore', () => {
  beforeEach(() => {
    localStorage.clear();
    quoteStore._reset();
  });

  it('adds a product once with its first option preselected, and saves it on this device', () => {
    expect(quoteStore.add('iqf-avo-dice')).toBe(true);
    expect(quoteStore.add('iqf-avo-dice')).toBe(false);
    expect(quoteStore.getSnapshot().basket).toEqual([{ id: 'iqf-avo-dice', volume: '', opt: '10 × 10 mm' }]);
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}').basket).toHaveLength(1);
  });

  it('ignores products that do not exist', () => {
    expect(quoteStore.add('durian')).toBe(false);
    expect(quoteStore.getSnapshot().basket).toEqual([]);
  });

  it('updates volume and option, removes items and keeps details until reset', () => {
    quoteStore.add('hass');
    quoteStore.setItem('hass', 'volume', '1 × 40 ft');
    quoteStore.setItem('hass', 'opt', 'Mixed');
    quoteStore.setDetail('company', 'Acme');
    expect(quoteStore.getSnapshot().basket[0]).toEqual({ id: 'hass', volume: '1 × 40 ft', opt: 'Mixed' });
    quoteStore.clearBasket();
    expect(quoteStore.getSnapshot().basket).toEqual([]);
    expect(quoteStore.getSnapshot().details.company).toBe('Acme');
    quoteStore.resetDetails();
    expect(quoteStore.getSnapshot().details).toEqual(emptyDetails);
  });

  it('notifies subscribers on every change', () => {
    const listener = vi.fn();
    const unsubscribe = quoteStore.subscribe(listener);
    quoteStore.add('mango');
    quoteStore.remove('mango');
    expect(listener).toHaveBeenCalledTimes(2);
    unsubscribe();
  });
});
