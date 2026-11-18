import Link from 'next/link';

import { FaqAccordion } from '@/components/ui/faq-accordion';
import { paths } from '@/config/paths';
import { faq, homeQuestions } from '@/lib/content';

import styles from './faq-teaser.module.css';

/** The four questions buyers ask first, with a link to the full FAQ. */
export function FaqTeaser() {
  const items = faq.filter((f) => homeQuestions.includes(f.q));
  return (
    <section className={styles.section} aria-labelledby="home-faq-title">
      <h2 id="home-faq-title" className={styles.title}>
        Questions buyers ask
      </h2>
      <FaqAccordion groups={[{ items }]} />
      <Link href={paths.faq} className={styles.more}>
        See all questions
      </Link>
    </section>
  );
}
