import { productById } from '@/lib/catalog';

/** One product in the buyer's quote: its volume and the count, cut or pack they picked. */
export type BasketItem = { id: string; volume: string; opt: string };

/** The quote form's terms and contact fields (the design's EMPTY). */
export type QuoteDetails = {
  company: string;
  name: string;
  email: string;
  country: string;
  phone: string;
  buyer: string;
  frequency: string;
  incoterm: string;
  port: string;
  delivery: string;
  message: string;
};

export type QuoteState = { basket: BasketItem[]; details: QuoteDetails };

export const emptyDetails: QuoteDetails = {
  company: '',
  name: '',
  email: '',
  country: '',
  phone: '',
  buyer: 'Importer / distributor',
  frequency: 'Weekly programme',
  incoterm: 'FOB Mombasa',
  port: '',
  delivery: '',
  message: '',
};

/** Same key and shape as the design ({ basket, f }), so a quote started on the prototype carries over. */
export const STORAGE_KEY = 'todara-quote-v1';

const emptyState: QuoteState = { basket: [], details: emptyDetails };

const str = (v: unknown, max = 2000) => (typeof v === 'string' ? v.slice(0, max) : '');

/** Reads a saved quote, dropping anything malformed or any product that no longer exists. */
export function parseSaved(raw: string | null): QuoteState {
  if (!raw) return emptyState;
  try {
    const saved = JSON.parse(raw) as { basket?: unknown; f?: unknown };
    const basket = Array.isArray(saved.basket)
      ? saved.basket
          .filter((b): b is Record<string, unknown> => typeof b === 'object' && b !== null)
          .map((b) => ({ id: str(b.id, 64), volume: str(b.volume, 200), opt: str(b.opt, 100) }))
          .filter((b, i, all) => productById(b.id) && all.findIndex((x) => x.id === b.id) === i)
      : [];
    const f = typeof saved.f === 'object' && saved.f !== null ? (saved.f as Record<string, unknown>) : {};
    const details = Object.fromEntries(
      (Object.keys(emptyDetails) as (keyof QuoteDetails)[]).map((k) => [k, typeof f[k] === 'string' ? str(f[k]) : emptyDetails[k]]),
    ) as QuoteDetails;
    return { basket, details };
  } catch {
    return emptyState;
  }
}

function serialise(state: QuoteState) {
  return JSON.stringify({ basket: state.basket, f: state.details });
}

let state: QuoteState = emptyState;
let loaded = false;
const listeners = new Set<() => void>();

function storage(): Storage | null {
  try {
    return typeof window === 'undefined' ? null : window.localStorage;
  } catch {
    return null;
  }
}

function ensureLoaded() {
  if (loaded || typeof window === 'undefined') return;
  loaded = true;
  state = parseSaved(storage()?.getItem(STORAGE_KEY) ?? null);
}

function commit(next: QuoteState) {
  state = next;
  try {
    storage()?.setItem(STORAGE_KEY, serialise(next));
  } catch {
    // Private mode or a full disk: the quote still works for this visit.
  }
  listeners.forEach((l) => l());
}

export const quoteStore = {
  subscribe(listener: () => void) {
    ensureLoaded();
    listeners.add(listener);
    const onStorage = (e: StorageEvent) => {
      if (e.key !== STORAGE_KEY) return;
      state = parseSaved(e.newValue);
      listener();
    };
    window.addEventListener('storage', onStorage);
    return () => {
      listeners.delete(listener);
      window.removeEventListener('storage', onStorage);
    };
  },
  getSnapshot(): QuoteState {
    ensureLoaded();
    return state;
  },
  getServerSnapshot(): QuoteState {
    return emptyState;
  },
  /** Adds a product once, with its first option preselected. Returns false when it was already in the quote. */
  add(id: string): boolean {
    ensureLoaded();
    const product = productById(id);
    if (!product || state.basket.some((b) => b.id === id)) return false;
    commit({ ...state, basket: [...state.basket, { id, volume: '', opt: product.option.choices[0] ?? '' }] });
    return true;
  },
  setItem(id: string, key: 'volume' | 'opt', value: string) {
    commit({ ...state, basket: state.basket.map((b) => (b.id === id ? { ...b, [key]: value } : b)) });
  },
  remove(id: string) {
    commit({ ...state, basket: state.basket.filter((b) => b.id !== id) });
  },
  setDetail<K extends keyof QuoteDetails>(key: K, value: QuoteDetails[K]) {
    commit({ ...state, details: { ...state.details, [key]: value } });
  },
  /** After a successful enquiry the products are cleared; the details stay until "New enquiry". */
  clearBasket() {
    commit({ ...state, basket: [] });
  },
  resetDetails() {
    commit({ ...state, details: emptyDetails });
  },
  /** Tests only. */
  _reset() {
    state = emptyState;
    loaded = false;
    listeners.clear();
  },
};
