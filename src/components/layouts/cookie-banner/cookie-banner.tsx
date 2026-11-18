'use client';

import Link from 'next/link';
import { useSyncExternalStore } from 'react';

import { Button } from '@/components/ui/button';
import { paths } from '@/config/paths';

import styles from './cookie-banner.module.css';
import { cookieConsent } from './cookie-consent';

/**
 * Cookie choice, as in the design. The site sets no analytics cookies today; the choice is saved so a
 * future analytics tool can respect it, and so the banner is not shown again.
 */
export function CookieBanner() {
  const choice = useSyncExternalStore(cookieConsent.subscribe, cookieConsent.getSnapshot, cookieConsent.getServerSnapshot);
  if (choice !== null) return null;

  return (
    <div role="dialog" aria-label="Cookie choice" className={styles.banner}>
      <span className={styles.text}>
        Essential cookies run this site. Analytics cookies only if you accept.{' '}
        <Link href={paths.cookies} className={styles.policy}>
          Cookie policy
        </Link>
      </span>
      <div className={styles.buttons}>
        <Button variant="outline" pad="8px 13px" size={14} onClick={() => cookieConsent.choose('essential')}>
          Essential only
        </Button>
        <Button variant="primary" pad="9.5px 14.5px" size={14} onClick={() => cookieConsent.choose('all')}>
          Accept all
        </Button>
      </div>
    </div>
  );
}
