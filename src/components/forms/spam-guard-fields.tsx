'use client';

import { useEffect, useRef } from 'react';

import { ELAPSED_FIELD, HONEYPOT_FIELD } from '@/lib/forms/form-state';

import styles from './spam-guard-fields.module.css';

/**
 * Invisible anti-spam fields to drop inside any <form>: a honeypot input that
 * people never see (bots fill it in) and how long the visitor spent on the
 * form, measured in their browser at the moment they submit — so the server can
 * reject instant robot submissions without trusting the device clock.
 * The honeypot sits off-screen, hidden from screen readers and out of the tab
 * order. Nothing visible changes.
 */
export function SpamGuardFields() {
  const elapsedRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const input = elapsedRef.current;
    const form = input?.form;
    if (!input || !form) return;
    const shownAt = performance.now();
    // Capture phase on the form runs before React's onSubmit, so the action receives the value.
    const stamp = () => {
      input.value = String(Math.round(performance.now() - shownAt));
    };
    form.addEventListener('submit', stamp, { capture: true });
    return () => form.removeEventListener('submit', stamp, { capture: true });
  }, []);
  return (
    <>
      <div className={styles.trap} aria-hidden="true">
        <label>
          Leave this field empty
          <input type="text" name={HONEYPOT_FIELD} tabIndex={-1} autoComplete="off" defaultValue="" />
        </label>
      </div>
      <input ref={elapsedRef} type="hidden" name={ELAPSED_FIELD} defaultValue="" />
    </>
  );
}
