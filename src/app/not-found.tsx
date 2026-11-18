import type { Metadata } from 'next';

import { SiteShell } from '@/components/layouts/site-shell';
import { Button } from '@/components/ui/button';
import { paths } from '@/config/paths';

import styles from './not-found.module.css';

export const metadata: Metadata = {
  title: { absolute: 'Page not found | Todara' },
  robots: { index: false, follow: true },
};

/** 404 for any unknown address, inside the normal site frame. */
export default function NotFound() {
  return (
    <SiteShell>
      <section className={styles.section} aria-labelledby="not-found-title">
        <span className={styles.eyebrow}>Page not found</span>
        <h1 id="not-found-title" className={styles.title}>
          This page is not on our site.
        </h1>
        <p className={styles.text}>The link may be old or mistyped. Browse our avocado and mango products, or go back to the home page.</p>
        <div className={styles.actions}>
          <Button href={paths.products} variant="primary" hover="darken" pad="15px 24px" size={16}>
            Browse products
          </Button>
          <Button href={paths.home} variant="outline" hover="tint" pad="13.5px 22.5px" size={16}>
            Go to the home page
          </Button>
        </div>
      </section>
    </SiteShell>
  );
}
