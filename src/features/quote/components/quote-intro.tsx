import { site } from '@/config/site';
import { generalWhatsapp } from '@/lib/whatsapp';

import styles from './quote.module.css';

/** Left column of the quote page: heading, WhatsApp shortcut and contact details. */
export function QuoteIntro() {
  return (
    <div className={styles.intro}>
      <span className={styles.eyebrow}>Request a quote</span>
      <h1 className={styles.title}>Your quote</h1>
      <p className={styles.lead}>
        Add each product, set its volume and the count, cut or pack you need, then send one enquiry. It goes to the right desk and we reply within one working
        day.
      </p>
      <a href={generalWhatsapp} target="_blank" rel="noopener noreferrer" className={styles.waCard}>
        <span className={styles.waText}>
          <span className={styles.waLabel}>Prefer WhatsApp?</span>
          <span className={styles.waNumber}>{site.whatsappDisplay}</span>
        </span>
        <span className={styles.waOpen}>Open chat →</span>
      </a>
      <div className={styles.contact}>
        <span className={styles.contactLabel}>Email</span>
        <span className={styles.contactValue}>
          <a href={`mailto:${site.email}`}>{site.email}</a>
        </span>
        <span className={styles.contactLabel}>Hours</span>
        <span className={styles.contactValue}>{site.hours}</span>
        <span className={styles.contactLabel}>Office</span>
        <span className={styles.contactValue}>
          {site.address.street}, {site.address.locality}, {site.address.country}
        </span>
      </div>
    </div>
  );
}
