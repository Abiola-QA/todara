import { Button } from '@/components/ui/button';
import { paths } from '@/config/paths';
import { generalWhatsapp } from '@/lib/whatsapp';

import styles from './cta-band.module.css';

/** "Talk to our export team" band above the footer (every page except the quote page). */
export function CtaBand() {
  return (
    <section className={styles.band} aria-labelledby="cta-band-title">
      <div className={styles.inner}>
        <div className={styles.copy}>
          <h2 id="cta-band-title" className={styles.title}>
            Talk to our export team
          </h2>
          <p className={styles.text}>Product, volume, Incoterm and destination port. We reply within one working day with availability and a written offer.</p>
        </div>
        <div className={styles.actions}>
          <Button href={paths.quote} variant="primary" hover="honey" pad="17px 26px" size={14}>
            Request a quote
          </Button>
          <Button href={generalWhatsapp} variant="outline" pad="15.5px 24.5px" size={14}>
            WhatsApp us
          </Button>
        </div>
      </div>
    </section>
  );
}
