import { orderSteps } from '@/lib/content';

import styles from './order-steps.module.css';

/** "Six steps from enquiry to arrival" on the forest band. */
export function OrderSteps() {
  return (
    <section className={styles.band} aria-labelledby="order-steps-title">
      <div className={styles.inner}>
        <div className={styles.intro}>
          <span className={styles.eyebrow}>How an order runs</span>
          <h2 id="order-steps-title" className={styles.title}>
            Six steps from enquiry to arrival
          </h2>
        </div>
        <ol className={styles.steps}>
          {orderSteps.map((s) => (
            <li key={s.n} className={styles.step}>
              <span className={styles.n}>{s.n}</span>
              <span className={styles.stepTitle}>{s.title}</span>
              <span className={styles.detail}>{s.detail}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
