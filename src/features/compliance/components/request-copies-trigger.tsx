'use client';

import { licenceRequestStore } from '../utils/licence-request-store';

import styles from './compliance-page.module.css';

type RequestCopiesTriggerProps = {
  /** "button": the honey button in the dark hero. "link": the underlined link in the "On every order" card. */
  variant: 'button' | 'link';
};

/** Opens the "Request licence copies" pop-up. */
export function RequestCopiesTrigger({ variant }: RequestCopiesTriggerProps) {
  const open = () => licenceRequestStore.open();
  if (variant === 'link') {
    return (
      <button type="button" className={styles.copiesLink} aria-haspopup="dialog" onClick={open}>
        Request copies →
      </button>
    );
  }
  return (
    <button type="button" className={styles.copiesButton} aria-haspopup="dialog" onClick={open}>
      Request licence copies<span aria-hidden="true">→</span>
    </button>
  );
}
