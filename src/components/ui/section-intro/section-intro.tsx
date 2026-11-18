import type { ReactNode } from 'react';

import { cn } from '@/utils/cn';

import styles from './section-intro.module.css';

type SectionIntroProps = {
  eyebrow: string;
  title: ReactNode;
  intro: ReactNode;
  /** text-wrap: balance on the heading (most headings have it; a few do not). */
  balance?: boolean;
  /** Heading id, for aria-labelledby on the section. */
  id?: string;
};

/** The design's section opener: green eyebrow and heading on the left, paragraph on the right. */
export function SectionIntro({ eyebrow, title, intro, balance = true, id }: SectionIntroProps) {
  return (
    <div className={styles.intro}>
      <div className={styles.lead}>
        <span className={styles.eyebrow}>{eyebrow}</span>
        <h2 id={id} className={cn(styles.title, balance && styles.balance)}>
          {title}
        </h2>
      </div>
      <p className={styles.text}>{intro}</p>
    </div>
  );
}
