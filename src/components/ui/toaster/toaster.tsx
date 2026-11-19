'use client';

import { useSyncExternalStore } from 'react';

import { toastStore } from '@/lib/toast';

import styles from './toaster.module.css';

/**
 * Shows the current toast. Both live regions are always present so screen readers announce changes:
 * confirmations politely (status), errors straight away (alert).
 */
export function Toaster() {
  const toast = useSyncExternalStore(toastStore.subscribe, toastStore.getSnapshot, toastStore.getServerSnapshot);
  return (
    <>
      <div role="status">{toast?.tone === 'info' && <div className={styles.toast}>{toast.text}</div>}</div>
      <div role="alert">
        {toast?.tone === 'error' && (
          <div className={`${styles.toast} ${styles.error}`}>
            <span className={styles.icon} aria-hidden="true">
              !
            </span>
            <div>
              <div className={toast.items ? styles.title : undefined}>{toast.text}</div>
              {toast.items && (
                <ul className={styles.items}>
                  {toast.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              )}
            </div>
            <button type="button" className={styles.close} aria-label="Dismiss" onClick={() => toastStore.dismiss()}>
              ×
            </button>
          </div>
        )}
      </div>
    </>
  );
}
