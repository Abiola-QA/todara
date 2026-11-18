import { QuoteForm } from './quote-form';
import { QuoteIntro } from './quote-intro';
import styles from './quote.module.css';

/** The quote page: contact details on the left, the quote form (or its confirmation) on the right. */
export function QuotePage() {
  return (
    <section className={styles.section} aria-label="Request a quote">
      <QuoteIntro />
      <div className={styles.panel}>
        <QuoteForm />
      </div>
    </section>
  );
}
