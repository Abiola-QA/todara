import { Button } from '@/components/ui/button';
import { paths } from '@/config/paths';
import { cn } from '@/utils/cn';

import { SeasonCalendar } from './season-calendar';
import styles from './seasonality-page.module.css';

/** The season calendar page: intro, form filter, calendar, legend and the planning call to action. */
export function SeasonalityPage() {
  return (
    <section className={styles.section} aria-labelledby="season-title">
      <span className={styles.eyebrow}>Seasonality</span>
      <div className={styles.intro}>
        <h1 id="season-title" className={styles.title}>
          Kenyan avocado and mango season calendar
        </h1>
        <p className={styles.text}>
          Fresh fruit follows Kenya&apos;s harvest seasons. IQF and puree are made in season and shipped from stock all year, so a buyer can plan a year-round
          programme across forms.
        </p>
      </div>
      <SeasonCalendar />
      <div className={styles.footer}>
        <div className={styles.legend}>
          <span className={styles.key}>
            <span className={cn(styles.swatch, styles.peak)} />
            Peak
          </span>
          <span className={styles.key}>
            <span className={cn(styles.swatch, styles.available)} />
            Available
          </span>
          <span className={styles.key}>
            <span className={cn(styles.swatch, styles.none)} />
            Limited or none
          </span>
        </div>
        <Button href={paths.quote} variant="primary" hover="honey" pad="13px 20px" size={15}>
          Plan a season programme
        </Button>
      </div>
      <p className={styles.note}>
        Indicative for Kenyan origin. Harvest timing shifts with rainfall and region; volumes and dates are confirmed in each written offer.
      </p>
    </section>
  );
}
