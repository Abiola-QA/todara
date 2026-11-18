import Link from 'next/link';
import type { CSSProperties } from 'react';

import { SectionIntro } from '@/components/ui/section-intro';
import { paths } from '@/config/paths';
import { forms, products, type Product } from '@/lib/catalog';

import styles from './supply-year.module.css';

type SupplyListProps = { title: string; items: Product[]; aside: (p: Product) => { text: string; className: string | undefined } };

function SupplyList({ title, items, aside }: SupplyListProps) {
  return (
    <div className={styles.list}>
      <h3 className={styles.listTitle}>{title}</h3>
      {items.map((p) => {
        const right = aside(p);
        return (
          <div key={p.id} className={styles.row} style={{ '--dot': forms[p.form].dot } as CSSProperties}>
            <span className={styles.dot} />
            <Link href={paths.product(p.slug)} className={styles.name}>
              {p.name}
            </Link>
            <span className={right.className}>{right.text}</span>
          </div>
        );
      })}
    </div>
  );
}

/** "Frozen and puree all year. Fresh in season.": seasonal fresh fruit beside the year-round lines. */
export function SupplyYear() {
  const seasonal = products.filter((p) => p.form === 'fresh');
  const yearRound = products.filter((p) => p.form !== 'fresh');
  return (
    <section className={styles.band} aria-labelledby="supply-title">
      <div className={styles.inner}>
        <SectionIntro
          id="supply-title"
          eyebrow="Supply through the year"
          title="Frozen and puree all year. Fresh in season."
          balance={false}
          intro="A buyer can run a year-round programme by combining forms: fresh fruit in its peak windows, IQF and puree from stock in between."
        />
        <div className={styles.lists}>
          <SupplyList title="Seasonal · fresh fruit" items={seasonal} aside={(p) => ({ text: p.spec.Season ?? '', className: styles.peak })} />
          <SupplyList title="Year-round · from stock" items={yearRound} aside={(p) => ({ text: forms[p.form].label, className: styles.form })} />
        </div>
        <Link href={paths.seasonality} className={styles.more}>
          Month-by-month calendar
        </Link>
      </div>
    </section>
  );
}
