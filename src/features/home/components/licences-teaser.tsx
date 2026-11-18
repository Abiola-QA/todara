import Link from 'next/link';

import { paths } from '@/config/paths';
import { licences } from '@/lib/content';

import styles from './licences-teaser.module.css';

/** "Licensed and certified on every order": the licences with their status, linking to compliance. */
export function LicencesTeaser() {
  return (
    <section className={styles.band} aria-labelledby="licences-title">
      <div className={styles.inner}>
        <div className={styles.copy}>
          <span className={styles.eyebrow}>Licences</span>
          <h2 id="licences-title" className={styles.title}>
            Licensed and certified on every order
          </h2>
          <p className={styles.text}>
            HACCP, GlobalG.A.P. and Phytosanitary certified processing. Our AFA–HCD licence covers avocado and mango fresh, frozen and processed. Copies are
            shared before a first order.
          </p>
          <Link href={paths.compliance} className={styles.more}>
            Compliance and documents
          </Link>
        </div>
        <div className={styles.list}>
          {licences.map((l) => (
            <div key={l.abbr} className={styles.licence}>
              <div className={styles.licenceHead}>
                <h3 className={styles.name}>{l.name}</h3>
                <span className={styles.status}>{l.status}</span>
              </div>
              <span className={styles.issuer}>{l.issuer}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
