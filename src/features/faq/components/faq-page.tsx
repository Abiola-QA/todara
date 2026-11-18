import { Button } from '@/components/ui/button';
import { FaqAccordion, type FaqGroup } from '@/components/ui/faq-accordion';
import { paths } from '@/config/paths';
import { faq, faqGroups } from '@/lib/content';
import { generalWhatsapp } from '@/lib/whatsapp';

import styles from './faq-page.module.css';

/** The FAQ page's two groups: products and sourcing, then shipping, timelines and terms. */
export const faqPageGroups: FaqGroup[] = faqGroups.map((g) => ({ title: g.title, items: faq.slice(g.start, g.end) }));

/** Every buyer question, grouped, with the quote and WhatsApp routes underneath. */
export function FaqPage() {
  return (
    <section className={styles.section} aria-labelledby="faq-title">
      <div className={styles.intro}>
        <span className={styles.eyebrow}>FAQ</span>
        <h1 id="faq-title" className={styles.title}>
          Questions buyers ask
        </h1>
        <p className={styles.text}>Products, shipping, timelines and terms. If your question is not here, ask the export team.</p>
      </div>
      <FaqAccordion groups={faqPageGroups} />
      <div className={styles.actions}>
        <Button href={paths.quote} variant="primary" hover="darken" pad="15px 24px" size={16}>
          Request a quote
        </Button>
        <Button href={generalWhatsapp} variant="outline" pad="13.5px 22.5px" size={16}>
          WhatsApp the export team
        </Button>
      </div>
    </section>
  );
}
