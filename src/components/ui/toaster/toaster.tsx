'use client';

import { useSyncExternalStore } from 'react';

import { toastStore } from '@/lib/toast';

import styles from './toaster.module.css';

/** Shows the current toast message. The live region is always present so screen readers announce changes. */
export function Toaster() {
  const message = useSyncExternalStore(toastStore.subscribe, toastStore.getSnapshot, toastStore.getServerSnapshot);
  return <div role="status">{message && <div className={styles.toast}>{message}</div>}</div>;
}
