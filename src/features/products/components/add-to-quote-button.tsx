'use client';

import type { ComponentProps } from 'react';

import { Button } from '@/components/ui/button';
import { useInQuote, quoteStore } from '@/lib/quote';
import { showToast } from '@/lib/toast';

type AddToQuoteButtonProps = {
  id: string;
  name: string;
} & Pick<ComponentProps<typeof Button>, 'variant' | 'hover' | 'pad' | 'size' | 'block' | 'className'>;

/** "+ Add to quote", or "In your quote ✓" once added. Confirms with a toast, as the design does on every click. */
export function AddToQuoteButton({ id, name, ...button }: AddToQuoteButtonProps) {
  const inQuote = useInQuote(id);
  return (
    <Button
      {...button}
      onClick={() => {
        quoteStore.add(id);
        showToast(`${name} added to your quote`);
      }}
    >
      {inQuote ? 'In your quote ✓' : '+ Add to quote'}
    </Button>
  );
}
