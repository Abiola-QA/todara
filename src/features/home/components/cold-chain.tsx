import type { CSSProperties } from 'react';

import { SectionIntro } from '@/components/ui/section-intro';
import { formList } from '@/lib/catalog';

import styles from './cold-chain.module.css';

/** "A temperature chain for each form": the four cold-chain steps of fresh, IQF and puree. */
export function ColdChain() {
  return (
    <section className={styles.section} aria-labelledby="cold-chain-title">
      <SectionIntro
        id="cold-chain-title"
        eyebrow="How we keep it cold"
        title="A temperature chain for each form"
        intro="Each form needs a different chain. Temperatures are logged from packing to arrival and shared with the shipment documents."
      />
      <div className={styles.grid}>
        {formList.map((form) => (
          <div key={form.key} className={styles.card} style={{ '--tint': form.tint, '--ink': form.ink } as CSSProperties}>
            <div className={styles.head}>
              <h3 className={styles.label}>{form.label}</h3>
              <span className={styles.temp}>{form.temp}</span>
            </div>
            <ol className={styles.steps}>
              {form.chain.map((step) => (
                <li key={step.n} className={styles.step}>
                  <span className={styles.n}>{step.n}</span>
                  <span className={styles.text}>
                    <span className={styles.title}>{step.title}</span>
                    <span className={styles.detail}>{step.detail}</span>
                  </span>
                </li>
              ))}
            </ol>
          </div>
        ))}
      </div>
    </section>
  );
}
