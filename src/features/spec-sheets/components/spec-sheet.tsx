import Image from 'next/image';
import type { CSSProperties } from 'react';

import logo from '@/assets/brand/todara-logo-forest-leaf.svg';
import { mediaUrl } from '@/config/media';
import { forms, monthInitials, type Product } from '@/lib/catalog';
import { cn } from '@/utils/cn';

import { sheetCellColours, sheetData } from '../utils/sheet-data';

import styles from './spec-sheets-document.module.css';

type SpecSheetProps = { product: Product; preload?: boolean };

/**
 * One A4 product specification sheet (id = the spec code, so /spec-sheets#TD-AV-HS opens it). The product name
 * is the design's sheet title (an h1 there); it is an h2 here so the document has one h1.
 */
export function SpecSheet({ product, preload }: SpecSheetProps) {
  const d = sheetData(product);
  const form = forms[product.form];
  return (
    <section id={d.id} className={styles.page} style={{ '--tint': form.tint, '--ink': form.ink } as CSSProperties} aria-labelledby={`${d.id}-title`}>
      <div className={styles.top}>
        <Image src={logo} alt="Todara Fresh from Kenya" unoptimized className={styles.logo} />
        <div className={styles.docLabel}>
          <span className={styles.docTitle}>Product specification sheet</span>
          <span className={styles.docMeta}>{d.meta}</span>
        </div>
      </div>

      <div className={styles.intro}>
        <span className={styles.badge}>{d.badge.label}</span>
        <h2 id={`${d.id}-title`} className={styles.title}>
          {product.name}
        </h2>
        <p className={styles.desc}>{product.desc}</p>
      </div>

      <div className={styles.media}>
        <div className={styles.photo}>
          {/* Eager, so every photo is there when the document is printed or saved as PDF. */}
          <Image src={mediaUrl(product.image)} alt={product.name} fill sizes="300px" loading="eager" preload={preload} className={styles.photoImg} />
        </div>
        <div className={styles.block}>
          <h3 className={styles.heading}>Key facts</h3>
          <dl className={styles.grid2}>
            {d.keyFacts.map((f) => (
              <div key={f.k} className={styles.cell}>
                <dt className={styles.key}>{f.k}</dt>
                <dd className={styles.value}>{f.v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <div className={styles.block}>
        <h3 className={styles.heading}>Full specification</h3>
        <dl className={styles.grid3}>
          {d.fullSpec.map((f) => (
            <div key={f.k} className={styles.cell}>
              <dt className={styles.key}>{f.k}</dt>
              <dd className={styles.value}>{f.v}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className={styles.block}>
        <div className={styles.availHead}>
          <h3 className={styles.heading}>Availability from Kenya</h3>
          <span className={styles.legend}>
            <span className={styles.legendItem}>
              <span className={cn(styles.swatch, styles.swatchPeak)} />
              Peak
            </span>
            <span className={styles.legendItem}>
              <span className={cn(styles.swatch, styles.swatchAvailable)} />
              Available
            </span>
            <span className={styles.legendItem}>
              <span className={cn(styles.swatch, styles.swatchNone)} />
              Limited or none
            </span>
          </span>
        </div>
        <div className={styles.months}>
          {monthInitials.map((m, i) => (
            <span key={i} className={styles.month} aria-hidden="true">
              {m}
            </span>
          ))}
          {d.cells.map((c) => (
            <span
              key={c.title}
              title={c.title}
              className={styles.monthCell}
              style={{ background: sheetCellColours[c.code].background, borderColor: sheetCellColours[c.code].border }}
            >
              <span className="sr-only">{c.title}</span>
            </span>
          ))}
        </div>
      </div>

      <div className={styles.bottom}>
        <div className={styles.options}>
          <h3 className={styles.heading}>{d.optionHeading}</h3>
          <ul className={styles.chips}>
            {d.options.map((o) => (
              <li key={o} className={styles.chip}>
                {o}
              </li>
            ))}
          </ul>
          <span className={styles.terms}>{d.terms}</span>
        </div>
        <div className={styles.block}>
          <h3 className={styles.heading}>Compliance</h3>
          <ul className={styles.checks} role="list">
            {d.compliance.map((c) => (
              <li key={c} className={styles.check}>
                <span className={styles.checkMark} />
                {c}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className={styles.footer}>{d.footer}</div>
    </section>
  );
}
