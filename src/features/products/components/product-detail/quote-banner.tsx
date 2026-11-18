'use client';

import Link from 'next/link';

import { paths } from '@/config/paths';
import { useQuote } from '@/lib/quote';

import { countWord } from '../../utils/product-view';

import styles from './product-overview.module.css';

/** "Your quote has 2 products — Continue your quote →", shown once anything is in the quote. */
export function QuoteBanner() {
  const count = useQuote().basket.length;
  if (count === 0) return null;
  return (
    <Link href={paths.quote} className={styles.banner}>
      <span>
        Your quote has {count} {countWord(count)}
      </span>
      <span>Continue your quote →</span>
    </Link>
  );
}
