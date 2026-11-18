import Link from 'next/link';
import type { CSSProperties } from 'react';

import { Button } from '@/components/ui/button';
import { paths } from '@/config/paths';
import { forms, type Product } from '@/lib/catalog';

import { cardFacts } from '../utils/product-view';

import { AddToQuoteButton } from './add-to-quote-button';
import styles from './product-card.module.css';
import { SlotPhoto } from './slot-photo';

/** A product in the products grid: photo with form badge, name, summary, three facts and actions. */
export function ProductCard({ product }: { product: Product }) {
  const form = forms[product.form];
  const href = paths.product(product.slug);
  return (
    <article className={styles.card} style={{ '--badge-bg': form.badgeBg, '--badge-ink': form.badgeInk } as CSSProperties}>
      <div className={styles.photo}>
        <SlotPhoto src={product.image} alt={product.imageAlt} sizes="(max-width: 640px) calc(100vw - 40px), (max-width: 1100px) 45vw, 300px" />
        <span className={styles.badge}>{form.label}</span>
      </div>
      <div className={styles.body}>
        <h2 className={styles.heading}>
          <Link href={href} className={styles.name}>
            {product.name}
          </Link>
        </h2>
        <span className={styles.short}>{product.short}</span>
        <dl className={styles.facts}>
          {cardFacts(product).map((f) => (
            <div key={f.k} className={styles.fact}>
              <dt className={styles.factKey}>{f.k}</dt>
              <dd className={styles.factValue}>{f.v}</dd>
            </div>
          ))}
        </dl>
        <div className={styles.actions}>
          <Button href={href} variant="primary" hover="darken" pad="10px 14px" size={14}>
            Specification
          </Button>
          <AddToQuoteButton id={product.id} name={product.name} variant="outlineSoft" hover="border" pad="8.5px 12.5px" size={14} />
        </div>
      </div>
    </article>
  );
}
