'use client';

import Link from 'next/link';
import { useState } from 'react';

import { paths } from '@/config/paths';
import { forms, months, products, seasonCells, seasonLabel, type FormKey, type SeasonCode } from '@/lib/catalog';
import { cn } from '@/utils/cn';

import styles from './season-calendar.module.css';

type Filter = 'all' | FormKey;

const filters: { key: Filter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'fresh', label: 'Fresh fruit' },
  { key: 'iqf', label: 'IQF frozen' },
  { key: 'puree', label: 'Puree and pulp' },
];

/** Screen-reader summary of a product's season, e.g. "Peak: Apr, May. Available: Mar. Limited or none: Jan, Feb." */
export function seasonSummary(season: string) {
  const cells = seasonCells(season);
  return (['p', 'a', 'o'] as SeasonCode[])
    .map((code) => {
      const ms = months.filter((_, i) => cells[i]?.code === code);
      return ms.length ? `${seasonLabel[code]}: ${ms.join(', ')}.` : '';
    })
    .filter(Boolean)
    .join(' ');
}

/** Month-by-month availability of every product, filterable by form (the design's sf chips). */
export function SeasonCalendar() {
  const [filter, setFilter] = useState<Filter>('all');
  const rows = products.filter((p) => filter === 'all' || p.form === filter);

  return (
    <>
      <div className={styles.chips} role="group" aria-label="Filter by form">
        {filters.map((f) => (
          <button
            key={f.key}
            type="button"
            aria-pressed={filter === f.key}
            className={cn(styles.chip, filter === f.key && styles.chipOn)}
            onClick={() => setFilter(f.key)}
          >
            {f.label}
          </button>
        ))}
      </div>
      <div className={styles.frame}>
        <div className={styles.table}>
          <div className={styles.head} aria-hidden="true">
            <div className={styles.corner} />
            {months.map((m) => (
              <div key={m} className={styles.month}>
                <span className={styles.full}>{m}</span>
                <span className={styles.initial}>{m[0]}</span>
              </div>
            ))}
          </div>
          {rows.map((p) => (
            <div key={p.id} className={styles.row}>
              <Link href={paths.product(p.slug)} className={styles.name}>
                <span className={styles.productName}>{p.name}</span>
                <span className={styles.line}>{forms[p.form].label} · spec →</span>
              </Link>
              <span className="sr-only">{seasonSummary(p.season)}</span>
              {seasonCells(p.season).map((c) => (
                <div key={c.title} title={c.title} className={cn(styles.cell, styles[c.code])} aria-hidden="true" />
              ))}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
