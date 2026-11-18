import Link from 'next/link';
import type { CSSProperties } from 'react';

import { SectionIntro } from '@/components/ui/section-intro';
import { paths } from '@/config/paths';

import { rangeCells, rangeMatrix, type MatrixCell } from '../utils/range-matrix';

import styles from './range-matrix.module.css';

const cellVars = (c: MatrixCell) => ({ '--tint': c.tint, '--dot': c.dot }) as CSSProperties;

/** "Avocado and mango in four forms": fruit by form, each product linking to its page. */
export function RangeMatrix() {
  const rows = rangeMatrix();
  return (
    <section className={styles.section} aria-labelledby="range-title">
      <SectionIntro
        id="range-title"
        eyebrow="The range"
        title="Avocado and mango in four forms"
        intro="Choose the fruit and the form you buy in. Every product has its own specification sheet."
      />
      <div className={styles.scroll}>
        <div className={styles.grid}>
          <div />
          {rangeCells.map((c) => (
            <div key={c.cell} className={styles.head}>
              {c.label}
            </div>
          ))}
          {rows.map((row) => [
            <div key={row.fruit} className={styles.fruit}>
              {row.fruit}
            </div>,
            ...row.cells.map((cell) => (
              <div key={`${row.fruit}-${cell.label}`} className={styles.cell} style={cellVars(cell)}>
                {cell.items.map((item) => (
                  <Link key={item.slug} href={paths.product(item.slug)} className={styles.item}>
                    {item.name} →
                  </Link>
                ))}
              </div>
            )),
          ])}
        </div>
      </div>
      <div className={styles.cards}>
        {rows.map((row) => (
          <div key={row.fruit} className={styles.cardRow}>
            <span className={styles.cardFruit}>{row.fruit}</span>
            <div className={styles.cardGrid}>
              {row.cells.map((cell) => (
                <div key={cell.label} className={styles.card} style={cellVars(cell)}>
                  <span className={styles.cardLabel}>{cell.label}</span>
                  {cell.items.map((item) => (
                    <Link key={item.slug} href={paths.product(item.slug)} className={styles.cardItem}>
                      {item.name} →
                    </Link>
                  ))}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
