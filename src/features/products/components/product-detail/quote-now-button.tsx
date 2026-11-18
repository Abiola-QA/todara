'use client';

import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { paths } from '@/config/paths';
import { quoteStore } from '@/lib/quote';

/** "Request a quote": adds the product to the quote and opens the quote page. */
export function QuoteNowButton({ id }: { id: string }) {
  const router = useRouter();
  return (
    <Button
      variant="primary"
      hover="honey"
      pad="14px 12px"
      size={15}
      block
      onClick={() => {
        quoteStore.add(id);
        router.push(paths.quote);
      }}
    >
      Request a quote
    </Button>
  );
}
