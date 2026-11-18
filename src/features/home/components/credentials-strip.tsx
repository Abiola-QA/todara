import { Fragment } from 'react';

import styles from './credentials-strip.module.css';

export const credentials = ['AFA–HCD licensed', 'KEPHIS registered', 'HACCP · GlobalG.A.P. · Phyto certified', 'Europe · Middle East · Asia'];

/** Licences and markets in one line under the hero. */
export function CredentialsStrip() {
  return (
    <section className={styles.strip} aria-label="Licences and markets">
      <div className={styles.inner}>
        {credentials.map((c, i) => (
          <Fragment key={c}>
            {i > 0 && (
              <span className={styles.sep} aria-hidden="true">
                ·
              </span>
            )}
            <span>{c}</span>
          </Fragment>
        ))}
      </div>
    </section>
  );
}
