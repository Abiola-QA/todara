import Link from 'next/link';
import type { CSSProperties } from 'react';

import { paths } from '@/config/paths';
import { alsoAvailable, forms, type Product } from '@/lib/catalog';

import styles from './also-available.module.css';

/** The same fruit in its other forms. */
export function AlsoAvailable({ product }: { product: Product }) {
  return (
    <section className={styles.section} aria-labelledby="also-title">
      <h2 id="also-title" className={styles.title}>
        Also available as
      </h2>
      <div className={styles.grid}>
        {alsoAvailable(product).map((p) => {
          const form = forms[p.form];
          return (
            <Link key={p.id} href={paths.product(p.slug)} className={styles.card} style={{ '--dot': form.dot, '--ink': form.ink } as CSSProperties}>
              <span className={styles.form}>{form.label}</span>
              <span className={styles.name}>{p.name}</span>
              <span className={styles.short}>{p.short}</span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
