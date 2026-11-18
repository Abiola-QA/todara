'use client';

import type { Licence } from '@/lib/content';
import { showToast } from '@/lib/toast';

import styles from './licence-card.module.css';

/** The message shown when a buyer asks for a licence copy (copies go out by email, as in the design). */
export const REQUEST_COPY_MESSAGE = 'Copies of licences are sent by email on request.';

/** One licence or certificate: what it is, who issued it, what it covers and its reference. */
export function LicenceCard({ licence }: { licence: Licence }) {
  return (
    <article className={styles.card}>
      <div className={styles.top}>
        <div className={styles.badge} aria-hidden="true">
          {licence.abbr}
        </div>
        <div className={styles.heading}>
          <div className={styles.nameRow}>
            <h3 className={styles.name}>{licence.name}</h3>
            <span className={styles.status}>{licence.status}</span>
          </div>
          <span className={styles.issuer}>{licence.issuer}</span>
        </div>
      </div>
      <dl className={styles.facts}>
        <dt className={styles.label}>Covers</dt>
        <dd className={styles.value}>{licence.covers}</dd>
        <dt className={styles.label}>Reference</dt>
        <dd className={styles.ref}>{licence.ref}</dd>
      </dl>
      <div className={styles.foot}>
        <button type="button" className={styles.request} onClick={() => showToast(REQUEST_COPY_MESSAGE)}>
          <span className={styles.pdf}>PDF</span>
          Request a copy
        </button>
      </div>
    </article>
  );
}
