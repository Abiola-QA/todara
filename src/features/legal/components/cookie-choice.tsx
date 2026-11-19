'use client';

import { useSyncExternalStore } from 'react';

import { cookieConsent } from '@/components/layouts/cookie-banner';
import { Button } from '@/components/ui/button';

import styles from './legal-page.module.css';

const labels = { all: 'All cookies accepted', essential: 'Essential cookies only' } as const;

/** The cookie policy's "Your choice on this device" box; changing it here also closes the cookie banner. */
export function CookieChoice() {
  const choice = useSyncExternalStore(cookieConsent.subscribe, cookieConsent.getSnapshot, cookieConsent.getServerSnapshot);
  const label = choice === 'all' || choice === 'essential' ? labels[choice] : 'Not chosen yet';
  return (
    <div className={styles.choice}>
      <span className={styles.choiceText}>
        Your choice on this device: <span className={styles.choiceValue}>{label}</span>
      </span>
      <div className={styles.choiceButtons}>
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
