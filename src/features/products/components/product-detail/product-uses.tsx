import type { CSSProperties } from 'react';

import { formQuestions, forms, type Product } from '@/lib/catalog';

import styles from './product-uses.module.css';

/** What the product is used for, and two questions buyers ask about its form. */
export function ProductUses({ product }: { product: Product }) {
  const form = forms[product.form];
  return (
    <section className={styles.section} style={{ '--dot': form.dot } as CSSProperties}>
      <div className={styles.col}>
        <h2 className={styles.title}>Uses</h2>
        <ul className={styles.list}>
          {product.uses.map((u) => (
            <li key={u} className={styles.use}>
              <span className={styles.square} />
              <span>{u}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className={styles.col}>
        <h2 className={styles.title}>Questions about {form.label}</h2>
        <div className={styles.list}>
          {formQuestions[product.form].map((x) => (
            <div key={x.q} className={styles.question}>
              <h3 className={styles.q}>{x.q}</h3>
              <p className={styles.a}>{x.a}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
