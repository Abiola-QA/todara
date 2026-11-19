'use client';

import Link from 'next/link';
import { useEffect, useId, useRef, useState, useSyncExternalStore, useTransition, type FormEvent, type KeyboardEvent } from 'react';

import { SpamGuardFields } from '@/components/forms';
import { paths } from '@/config/paths';
import { site } from '@/config/site';
import { useFormErrorFeedback } from '@/hooks/use-form-error-feedback';
import { showErrorToast } from '@/lib/toast';
import { cn } from '@/utils/cn';

import { LICENCE_REQUEST_FIELD } from '../actions/licence-request-schema';
import { requestLicenceCopies } from '../actions/request-licence-copies';
import { licenceDocuments, MAX_RECIPIENTS } from '../data/licence-documents';
import { licenceRequestStore } from '../utils/licence-request-store';
import {
  emptyDraft,
  errorsInFormOrder,
  listInWords,
  recipients,
  validateLicenceRequest,
  type LicenceRequestDraft,
  type LicenceRequestErrors,
} from '../utils/validate-licence-request';

import styles from './licence-request-dialog.module.css';

type Sent = { to: string[]; docs: string[] };

type LicenceRequestDialogProps = {
  /** Server action; injectable for tests. */
  submit?: typeof requestLicenceCopies;
};

/** The "Request licence copies" pop-up: pick documents, name, company and up to four addresses. */
export function LicenceRequestDialog({ submit = requestLicenceCopies }: LicenceRequestDialogProps) {
  const open = useSyncExternalStore(licenceRequestStore.subscribe, licenceRequestStore.getSnapshot, licenceRequestStore.getServerSnapshot);
  return open ? <DialogBody submit={submit} /> : null;
}

function DialogBody({ submit }: { submit: typeof requestLicenceCopies }) {
  const [draft, setDraft] = useState<LicenceRequestDraft>(emptyDraft);
  const [errs, setErrs] = useState<LicenceRequestErrors>({});
  const [sent, setSent] = useState<Sent | null>(null);
  const [sendError, setSendError] = useState('');
  const [pending, startTransition] = useTransition();
  const dialogRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const reportErrors = useFormErrorFeedback(formRef);
  const titleId = useId();

  // While open, the page behind does not scroll and Escape closes the pop-up.
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') licenceRequestStore.close();
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  // Keep keyboard focus inside the pop-up.
  const trapFocus = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== 'Tab' || !dialogRef.current) return;
    const focusable = [...dialogRef.current.querySelectorAll<HTMLElement>('button, input, a[href], [tabindex]:not([tabindex="-1"])')].filter(
      (el) => !el.hasAttribute('disabled') && el.tabIndex !== -1,
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (!first || !last) return;
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  const update = (patch: Partial<LicenceRequestDraft>, clear: string[] = []) => {
    setDraft((d) => ({ ...d, ...patch }));
    if (clear.length)
      setErrs((e) => {
        const next = { ...e };
        clear.forEach((k) => delete next[k]);
        return next;
      });
  };

  const setEmail = (i: number, value: string) => update({ emails: draft.emails.map((v, j) => (j === i ? value : v)) }, [`e${i}`]);
  const removeEmail = (i: number) =>
    update(
      { emails: draft.emails.filter((_, j) => j !== i) },
      draft.emails.map((_, j) => `e${j}`),
    );

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSendError('');
    const found = validateLicenceRequest(draft);
    if (Object.keys(found).length) {
      setErrs(found);
      reportErrors(errorsInFormOrder(found, draft.emails.length));
      return;
    }
    const to = recipients(draft.emails);
    const docs = licenceDocuments.filter((d) => draft.picks[d.id]);
    const data = new FormData(e.currentTarget);
    data.set(
      LICENCE_REQUEST_FIELD,
      JSON.stringify({ name: draft.name, company: draft.company, emails: to, documents: docs.map((d) => d.id), consent: draft.consent }),
    );
    startTransition(async () => {
      try {
        const result = await submit(data);
        if (!result.ok) {
          const fieldErrors = result.fieldErrors ?? {};
          setErrs(fieldErrors);
          setSendError(result.message);
          if (Object.keys(fieldErrors).length) reportErrors(errorsInFormOrder(fieldErrors, draft.emails.length));
          else showErrorToast(result.message);
          return;
        }
        setSent({ to, docs: docs.map((d) => d.name) });
      } catch {
        const message = 'We could not send your request just now. Please check your connection and try again.';
        setSendError(message);
        showErrorToast(message);
      }
    });
  };

  return (
    <div
      className={styles.overlay}
      onClick={(e) => {
        if (e.target === e.currentTarget) licenceRequestStore.close();
      }}
    >
      <div ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby={titleId} className={styles.dialog} onKeyDown={trapFocus}>
        <div className={styles.head}>
          <div className={styles.headText}>
            <span className={styles.eyebrow}>Licences and compliance</span>
            <h2 id={titleId} className={styles.title}>
              Request licence copies
            </h2>
          </div>
          <button type="button" aria-label="Close" className={styles.close} onClick={() => licenceRequestStore.close()}>
            ×
          </button>
        </div>

        {sent ? (
          <div className={styles.sent} role="status">
            <div className={styles.sentHead}>
              <span className={styles.tick} aria-hidden="true">
                ✓
              </span>
              <h3 className={styles.sentTitle}>Request received</h3>
            </div>
            <p className={styles.sentText}>The export team will email the {listInWords(sent.docs)} to:</p>
            <div className={styles.sentList}>
              {sent.to.map((x) => (
                <span key={x} className={styles.sentAddress}>
                  {x}
                </span>
              ))}
            </div>
            <p className={styles.sentHelp}>Need them sooner? Message the export team on WhatsApp or email {site.email}.</p>
            <button type="button" className={styles.done} onClick={() => licenceRequestStore.close()}>
              Done
            </button>
          </div>
        ) : (
          <form ref={formRef} className={styles.form} onSubmit={onSubmit} noValidate aria-busy={pending || undefined}>
            <SpamGuardFields />
            <p className={styles.intro}>Choose the documents you need for supplier approval. The export team sends them as PDFs to each address you add.</p>

            <div className={styles.group} role="group" aria-label="Documents">
              <span className={styles.groupLabel}>Documents *</span>
              <div className={styles.picks}>
                {licenceDocuments.map((d) => {
                  const on = draft.picks[d.id];
                  return (
                    <button
                      key={d.id}
                      type="button"
                      role="checkbox"
                      aria-checked={on}
                      className={styles.pick}
                      onClick={() => update({ picks: { ...draft.picks, [d.id]: !on } }, ['picks'])}
                    >
                      <span className={cn(styles.box, on && styles.boxOn)} aria-hidden="true">
                        {on ? '✓' : ''}
                      </span>
                      <span className={styles.pickName}>{d.name}</span>
                      <span className={styles.pickBy}>{d.by}</span>
                    </button>
                  );
                })}
              </div>
              {errs.picks && (
                <span className={styles.error} data-form-error tabIndex={-1}>
                  {errs.picks}
                </span>
              )}
              <span className={styles.note}>Phytosanitary certificates are issued by KEPHIS for each consignment and sent with the shipping documents.</span>
            </div>

            <div className={styles.grid}>
              <label className={styles.field}>
                Your name *
                <input
                  // The design focuses the name as soon as the pop-up opens.

                  autoFocus
                  className={styles.input}
                  value={draft.name}
                  onChange={(e) => update({ name: e.target.value }, ['name'])}
                  autoComplete="name"
                  aria-invalid={errs.name ? true : undefined}
                />
                {errs.name && <span className={styles.error}>{errs.name}</span>}
              </label>
              <label className={styles.field}>
                Company *
                <input
                  className={styles.input}
                  value={draft.company}
                  onChange={(e) => update({ company: e.target.value }, ['company'])}
                  autoComplete="organization"
                  aria-invalid={errs.company ? true : undefined}
                />
                {errs.company && <span className={styles.error}>{errs.company}</span>}
              </label>
            </div>

            <div className={styles.emails}>
              {draft.emails.map((value, i) => {
                const error = errs[`e${i}`];
                return (
                  <label key={i} className={styles.field}>
                    {i ? 'Also send to' : 'Send to *'}
                    <span className={styles.emailRow}>
                      <input
                        className={styles.emailInput}
                        value={value}
                        onChange={(e) => setEmail(i, e.target.value)}
                        type="email"
                        autoComplete="email"
                        placeholder="name@company.com"
                        aria-invalid={error ? true : undefined}
                      />
                      {draft.emails.length > 1 && (
                        <button type="button" aria-label="Remove this email" className={styles.remove} onClick={() => removeEmail(i)}>
                          ×
                        </button>
                      )}
                    </span>
                    {error && <span className={styles.error}>{error}</span>}
                  </label>
                );
              })}
              {draft.emails.length < MAX_RECIPIENTS && (
                <button type="button" className={styles.addEmail} onClick={() => update({ emails: [...draft.emails, ''] })}>
                  + Add another email
                </button>
              )}
            </div>

            <div className={styles.consentWrap}>
              <button
                type="button"
                role="checkbox"
                aria-checked={draft.consent}
                aria-invalid={errs.consent ? true : undefined}
                className={styles.consent}
                onClick={() => update({ consent: !draft.consent }, ['consent'])}
              >
                <span className={cn(styles.box, draft.consent && styles.boxOn)} aria-hidden="true">
                  {draft.consent ? '✓' : ''}
                </span>
                <span>I agree that Todara may use these details to send the documents and follow up, as set out in the privacy policy. *</span>
              </button>
              {errs.consent && <span className={styles.consentError}>{errs.consent}</span>}
            </div>

            <div className={styles.submitRow}>
              <button type="submit" className={styles.submit} disabled={pending}>
                Send request
              </button>
              <Link href={paths.privacy} className={styles.privacy} onClick={() => licenceRequestStore.close()}>
                Privacy policy
              </Link>
            </div>
            {sendError && (
              <p className={styles.sendError} role="alert">
                {sendError}
              </p>
            )}
          </form>
        )}
      </div>
    </div>
  );
}
