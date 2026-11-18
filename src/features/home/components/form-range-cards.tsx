import Link from 'next/link';
import type { CSSProperties } from 'react';

import { Button } from '@/components/ui/button';
import { CoverImage } from '@/components/ui/cover-image';
import { paths } from '@/config/paths';
import { formList, productsInForm } from '@/lib/catalog';

import styles from './form-range-cards.module.css';

/** One card per form: photo, temperature, who it is for, its products, and the two next steps. */
export function FormRangeCards() {
  return (
    <section className={styles.section} aria-label="Product forms">
      {formList.map((form) => (
        <div key={form.key} className={styles.card} style={{ '--dot': form.dot, '--ink': form.ink } as CSSProperties}>
          <div className={styles.photo}>
            <CoverImage src={form.image} alt={form.imageAlt} sizes="(max-width: 860px) 100vw, 420px" />
          </div>
          <div className={styles.body}>
            <div className={styles.titleRow}>
              <h3 className={styles.title}>{form.label}</h3>
              <span className={styles.temp}>{form.temp}</span>
            </div>
            <span className={styles.buyer}>{form.buyer}</span>
            <div className={styles.items}>
              {productsInForm(form.key).map((p) => (
                <Link key={p.id} href={paths.product(p.slug)} className={styles.item}>
                  <span>{p.name}</span>
                  <span className={styles.arrow} aria-hidden="true">
                    →
                  </span>
                </Link>
              ))}
            </div>
            <div className={styles.actions}>
              <Button href={paths.productsInForm(form.key)} variant="primary" hover="darken" pad="12px 10px" size={15} block>
                View range
              </Button>
              <Button href={paths.quote} variant="outline" hover="tint" pad="10.5px 10px" size={15} block>
                Get a quote
              </Button>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}
