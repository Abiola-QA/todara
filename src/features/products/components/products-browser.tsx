'use client';

import { useSearchParams } from 'next/navigation';
import { useState } from 'react';

import { paths } from '@/config/paths';
import { isFormKey } from '@/lib/catalog';

import { formTabs, productsForFilter, type FormFilter } from '../utils/product-view';

import { CompareSection } from './compare-section';
import { ProductCard } from './product-card';
import styles from './products-browser.module.css';

/** The products page: intro, form tabs, product grid and the compare section, all driven by the chosen form. */
export function ProductsBrowser({ initialForm = 'all' }: { initialForm?: FormFilter }) {
  const [filter, setFilter] = useState<FormFilter>(initialForm);
  const listed = productsForFilter(filter);

  return (
    <>
      <section className={styles.intro} aria-labelledby="products-title">
        <span className={styles.eyebrow}>Products and specifications</span>
        <h1 id="products-title" className={styles.title}>
          Avocado and mango products
        </h1>
        <div className={styles.row}>
          <p className={styles.lead}>Nine products across four forms, each with a downloadable spec sheet. Add any of them to one quote.</p>
          <a href={paths.specSheets} target="_blank" rel="noopener noreferrer" className={styles.allSheets}>
            <span className={styles.pdf}>PDF</span>All spec sheets
          </a>
        </div>
        <div className={styles.tabs} role="group" aria-label="Filter by form">
          {formTabs.map((tab) => (
            <button key={tab.key} type="button" className={styles.tab} aria-pressed={filter === tab.key} onClick={() => setFilter(tab.key)}>
              {tab.label}
            </button>
          ))}
        </div>
      </section>
      <section className={styles.grid} aria-label="Products">
        {listed.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </section>
      <CompareSection filter={filter} />
    </>
  );
}

/** ProductsBrowser with the tab chosen by ?form= (the home page and menu link to /products?form=iqf). */
export function ProductsBrowserFromUrl() {
  const param = useSearchParams().get('form');
  const initial: FormFilter = isFormKey(param) ? param : 'all';
  // A new ?form= (e.g. picked from the header menu while on this page) starts the browser on that tab.
  return <ProductsBrowser key={initial} initialForm={initial} />;
}
