import type { CSSProperties } from 'react';

import { forms, months, seasonCells, specRows, type Product } from '@/lib/catalog';

import { docId, seasonBackground } from '../../utils/product-view';

import styles from './product-specification.module.css';

/** Full specification table, the form's cold chain and the month-by-month availability strip. */
export function ProductSpecification({ product }: { product: Product }) {
  const form = forms[product.form];
  return (
    <section className={styles.band} style={{ '--tint': form.tint, '--ink': form.ink } as CSSProperties}>
      <div className={styles.inner}>
        <div className={styles.col}>
          <h2 className={styles.title}>Full specification</h2>
          <dl className={styles.list}>
            {specRows(product).map((r) => (
              <div key={r.k} className={styles.row}>
                <dt className={styles.key}>{r.k}</dt>
                <dd className={styles.value}>{r.v}</dd>
              </div>
            ))}
          </dl>
          <span className={styles.docId}>{docId(product)}</span>
        </div>
        <div className={styles.side}>
          <div className={styles.block}>
            <h2 className={styles.title}>Cold chain</h2>
            <ol className={styles.chain}>
              {form.chain.map((c) => (
                <li key={c.n} className={styles.step}>
                  <span className={styles.stepN}>{c.n}</span>
                  <span className={styles.stepTitle}>{c.title}</span>
                  <span className={styles.stepDetail}>{c.detail}</span>
                </li>
              ))}
            </ol>
          </div>
          <div className={styles.blockTight}>
            <h2 className={styles.title}>Availability</h2>
            <div className={styles.months}>
              {months.map((m) => (
                <span key={m} className={styles.month}>
                  <span className={styles.full}>{m}</span>
                  <span className={styles.initial} aria-hidden="true">
                    {m[0]}
                  </span>
                </span>
              ))}
              {seasonCells(product.season).map((c) => (
                <div key={c.title} title={c.title} className={styles.cell} style={{ background: seasonBackground[c.code] }}>
                  <span className="sr-only">{c.title}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
