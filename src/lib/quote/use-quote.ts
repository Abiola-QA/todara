'use client';

import { useSyncExternalStore } from 'react';

import { quoteStore, type QuoteState } from './quote-store';

/** The buyer's quote (products and details), saved on this device and shared by every page. */
export function useQuote(): QuoteState {
  return useSyncExternalStore(quoteStore.subscribe, quoteStore.getSnapshot, quoteStore.getServerSnapshot);
}

/** Whether a product is already in the quote. */
export function useInQuote(id: string): boolean {
  return useQuote().basket.some((b) => b.id === id);
}
