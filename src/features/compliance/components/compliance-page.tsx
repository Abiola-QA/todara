import Link from 'next/link';

import { paths } from '@/config/paths';
import { kephisCovers, licences, shipmentDocuments } from '@/lib/content';

import styles from './compliance-page.module.css';
import { LicenceCard } from './licence-card';

/** Licences and compliance: what Todara holds, what KEPHIS covers and the documents with every order. */
export function CompliancePage() {
  return (
    <>
      <section className={styles.hero} aria-labelledby="compliance-title">
        <div className={styles.heroInner}>
          <div className={styles.heroLead}>
            <span className={styles.heroEyebrow}>Licences and compliance</span>
            <h1 id="compliance-title" className={styles.heroTitle}>
              Licensed avocado and mango exporter. Inspected every shipment.
            </h1>
          </div>
          <p className={styles.heroText}>
            A buyer&apos;s first check on a new supplier is regulatory standing. Here is what Todara holds, what it covers, and the documents that travel with
            every order.
          </p>
        </div>
      </section>

      <section className={styles.licences} aria-labelledby="licences-title">
        <h2 id="licences-title" className={styles.h2}>
          Licences held
        </h2>
        <div className={styles.cards}>
          {licences.map((l) => (
            <LicenceCard key={l.abbr} licence={l} />
          ))}
        </div>
      </section>

      <section className={styles.band} aria-label="KEPHIS registration and shipment documents">
        <div className={styles.bandInner}>
          <div className={styles.col}>
            <h2 className={styles.h2}>What KEPHIS registration covers</h2>
            <ul className={styles.list} role="list">
              {kephisCovers.map((k) => (
                <li key={k} className={styles.kephisItem}>
                  <span className={styles.bullet} aria-hidden="true" />
                  {k}
                </li>
              ))}
            </ul>
          </div>
          <div className={styles.col}>
            <h2 className={styles.h2}>Documents with every order</h2>
            <ol className={styles.list} role="list">
              {shipmentDocuments.map((d) => (
                <li key={d.n} className={styles.doc}>
                  <span className={styles.docN} aria-hidden="true">
                    {d.n}
                  </span>
                  <span className={styles.docName}>{d.name}</span>
                  <span className={styles.docBy}>{d.by}</span>
                </li>
              ))}
            </ol>
            <span className={styles.small}>Copies are emailed before the vessel or aircraft arrives so customs clearance can start on time.</span>
          </div>
        </div>
      </section>

      <section className={styles.closing} aria-label="Certification and data protection">
        <div className={styles.noteDark}>
          <span className={styles.noteEyebrowHoney}>On every order</span>
          <span className={styles.noteTitle}>HACCP, GlobalG.A.P. and Phytosanitary certified processing.</span>
          <span className={styles.noteTextLight}>
            Certificates are shared before a first order. Further certifications will be added here with their scope and reference numbers.
          </span>
        </div>
        <div className={styles.noteLight}>
          <span className={styles.noteEyebrowLeaf}>Data protection</span>
          <span className={styles.noteTitleForest}>Buyer data under the Kenya Data Protection Act, 2019</span>
          <span className={styles.noteText}>Enquiry details are used only to respond and prepare offers.</span>
          <Link href={paths.privacy} className={styles.privacyLink}>
            Privacy policy →
          </Link>
        </div>
      </section>
    </>
  );
}
