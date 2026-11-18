import Link from 'next/link';
import type { CSSProperties } from 'react';

import { paths } from '@/config/paths';
import { buyingTerms, forms, type Product } from '@/lib/catalog';
import { whatsappLink } from '@/lib/whatsapp';

import { keyFacts, quoteMessage } from '../../utils/product-view';
import { AddToQuoteButton } from '../add-to-quote-button';
import { SlotPhoto } from '../slot-photo';

import styles from './product-overview.module.css';
import { QuoteBanner } from './quote-banner';
import { QuoteNowButton } from './quote-now-button';

/** Top of a product page: quote banner, breadcrumb, photo, key facts, terms and the four actions. */
export function ProductOverview({ product }: { product: Product }) {
  const form = forms[product.form];
  const vars = { '--tint': form.tint, '--ink': form.ink, '--badge-bg': form.badgeBg, '--badge-ink': form.badgeInk } as CSSProperties;

  return (
    <section className={styles.overview} style={vars} aria-labelledby="product-title">
      <QuoteBanner />
      <nav className={styles.crumbs} aria-label="Breadcrumb">
        <Link href={paths.products} className={styles.back}>
          ← Products
        </Link>
        <span aria-hidden="true">/</span>
        <span>{form.label}</span>
        <span aria-hidden="true">/</span>
        <span className={styles.current} aria-current="page">
          {product.name}
        </span>
      </nav>
      <div className={styles.grid}>
        <div className={styles.media}>
          <div className={styles.photo}>
            <SlotPhoto src={product.image} alt={product.imageAlt} sizes="(max-width: 1000px) calc(100vw - 40px), 600px" preload />
          </div>
          <div className={styles.strip}>
            <span className={styles.temp}>{form.temp}</span>
            <span className={styles.buyer}>{form.buyer}</span>
          </div>
        </div>
        <div className={styles.info}>
          <div className={styles.tags}>
            <span className={styles.badge}>{form.label}</span>
            <span className={styles.code}>Spec {product.code}</span>
          </div>
          <h1 id="product-title" className={styles.title}>
            {product.name}
          </h1>
          <p className={styles.desc}>{product.desc}</p>
          <dl className={styles.facts}>
            {keyFacts(product).map((f) => (
              <div key={f.k} className={styles.fact}>
                <dt className={styles.key}>{f.k}</dt>
                <dd className={styles.value}>{f.v}</dd>
              </div>
            ))}
            <div className={styles.fact}>
              <dt className={styles.key}>{product.option.label}</dt>
              <dd className={styles.value}>{product.option.choices.join(' · ')}</dd>
            </div>
          </dl>
          <dl className={styles.terms}>
            {buyingTerms(product.form).map((t) => (
              <div key={t.k} className={styles.term}>
                <dt className={styles.key}>{t.k}</dt>
                <dd className={styles.value}>{t.v}</dd>
              </div>
            ))}
          </dl>
          <div className={styles.actions}>
            <QuoteNowButton id={product.id} />
            <AddToQuoteButton id={product.id} name={product.name} variant="outline" hover="tint" pad="12.5px 12px" size={15} block />
            <a href={paths.specSheet(product.code)} target="_blank" rel="noopener noreferrer" className={styles.sheet}>
              <span className={styles.pdf}>PDF</span>Spec sheet
            </a>
            <a href={whatsappLink(quoteMessage(product))} target="_blank" rel="noopener noreferrer" className={styles.whatsapp}>
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
