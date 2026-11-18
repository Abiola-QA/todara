import Link from 'next/link';
import type { CSSProperties } from 'react';

import { paths } from '@/config/paths';
import { specRows } from '@/lib/catalog';

import { compareTable, type FormFilter } from '../utils/product-view';

import { AddToQuoteButton } from './add-to-quote-button';
import styles from './compare-section.module.css';

/** Side-by-side specifications of one form's products: a table from 700px, swipeable cards below. */
export function CompareSection({ filter }: { filter: FormFilter }) {
  const { form, items, rows } = compareTable(filter);
  const columns = `170px repeat(${items.length},minmax(180px,1fr))`;

  return (
    <section className={styles.band} aria-labelledby="compare-title">
      <div className={styles.inner}>
        <div className={styles.head}>
          <h2 id="compare-title" className={styles.title}>
            Compare: {form.label}
          </h2>
          {filter === 'all' && <span className={styles.hint}>Choose a form above to compare its products.</span>}
        </div>

        <div className={`${styles.scroller} ${styles.wideOnly}`}>
          <div className={styles.table} style={{ '--cols': columns } as CSSProperties} role="table" aria-label={`Compare ${form.label}`}>
            <div role="row" style={{ display: 'contents' }}>
              <div className={styles.corner} role="columnheader">
                <span className="sr-only">Specification</span>
              </div>
              {items.map((p) => (
                <Link key={p.id} href={paths.product(p.slug)} className={styles.colHead} role="columnheader">
                  {p.name}
                </Link>
              ))}
            </div>
            {rows.map((row) => (
              <div key={row.k} role="row" style={{ display: 'contents' }}>
                <div className={styles.rowKey} role="rowheader">
                  {row.k}
                </div>
                {row.values.map((v, i) => (
                  <div key={items[i]?.id ?? i} className={styles.cell} role="cell">
                    {v}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        <span className={`${styles.swipeHint} ${styles.mobOnly}`}>Swipe to compare →</span>
        <div className={`${styles.cards} ${styles.mobOnly}`}>
          {items.map((p) => (
            <div key={p.id} className={styles.card}>
              <Link href={paths.product(p.slug)} className={styles.cardName}>
                {p.name} →
              </Link>
              {specRows(p).map((r) => (
                <div key={r.k} className={styles.cardRow}>
                  <span className={styles.cardKey}>{r.k}</span>
                  <span className={styles.cardValue}>{r.v}</span>
                </div>
              ))}
              <AddToQuoteButton id={p.id} name={p.name} variant="primary" pad="12px" size={15} block className={styles.cardAdd} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
