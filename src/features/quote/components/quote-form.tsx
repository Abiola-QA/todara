'use client';

import Link from 'next/link';
import { useRef, useState, useTransition, type CSSProperties, type FormEvent } from 'react';

import { SpamGuardFields } from '@/components/forms';
import { Button } from '@/components/ui/button';
import { paths } from '@/config/paths';
import { useFormErrorFeedback } from '@/hooks/use-form-error-feedback';
import { formOf, productById, products } from '@/lib/catalog';
import { quoteStore, useQuote, type QuoteDetails } from '@/lib/quote';
import { showErrorToast } from '@/lib/toast';
import { cn } from '@/utils/cn';

import { QUOTE_PAYLOAD_FIELD } from '../actions/quote-schema';
import { submitQuote } from '../actions/submit-quote';
import { buyerOptions, frequencyOptions, incotermOptions } from '../data/quote-options';
import { sentSummary, type SentSummary } from '../utils/quote-summary';
import { validateQuote, type QuoteErrors } from '../utils/validate-quote';

import styles from './quote.module.css';

type QuoteFormProps = {
  /** Server action; injectable for tests. */
  submit?: typeof submitQuote;
};

const dotVar = (dot: string) => ({ '--dot': dot }) as CSSProperties;

/**
 * The quote: products (each with its count, cut or pack and a volume), terms and contact details, saved on
 * this device as the buyer goes. One enquiry is sent for everything and routed to the right desks.
 */
export function QuoteForm({ submit = submitQuote }: QuoteFormProps) {
  const { basket, details } = useQuote();
  const [consent, setConsent] = useState(false);
  const [errs, setErrs] = useState<QuoteErrors>({});
  const [sendError, setSendError] = useState('');
  const [sent, setSent] = useState<SentSummary | null>(null);
  const [pending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);
  // Errors can sit above or below the part of the page in view: list them in a toast and jump to the first.
  const reportErrors = useFormErrorFeedback(formRef);

  const setField = <K extends keyof QuoteDetails>(key: K, value: QuoteDetails[K]) => {
    quoteStore.setDetail(key, value);
    setErrs((e) => {
      if (!(key in e)) return e;
      const next = { ...e };
      delete next[key as keyof QuoteErrors];
      return next;
    });
  };

  const addProduct = (id: string) => {
    quoteStore.add(id);
    setErrs((e) => ({ ...e, basket: undefined }));
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSendError('');
    const found = validateQuote(basket, details, consent);
    if (Object.keys(found).length) {
      setErrs(found);
      reportErrors(Object.values(found));
      return;
    }
    const data = new FormData(e.currentTarget);
    data.set(QUOTE_PAYLOAD_FIELD, JSON.stringify({ basket, details, consent }));
    const snapshot = { basket, details };
    startTransition(async () => {
      try {
        const result = await submit(data);
        if (!result.ok) {
          const fieldErrors = (result.fieldErrors ?? {}) as QuoteErrors;
          setErrs(fieldErrors);
          setSendError(result.message);
          if (Object.keys(fieldErrors).length) reportErrors(Object.values(fieldErrors));
          else showErrorToast(result.message);
          return;
        }
        setSent(sentSummary(result.ref, snapshot.basket, snapshot.details));
        quoteStore.clearBasket();
        window.scrollTo({ top: 0 });
      } catch {
        const message = 'We could not send your enquiry just now. Please check your connection and try again.';
        setSendError(message);
        showErrorToast(message);
      }
    });
  };

  const reset = () => {
    setSent(null);
    quoteStore.resetDetails();
    setConsent(false);
    setErrs({});
    setSendError('');
  };

  if (sent) {
    return (
      <div className={styles.sent} role="status">
        <span className={styles.received}>
          <span className={styles.receivedDot} />
          Enquiry received · <span>{sent.ref}</span>
        </span>
        <h2 className={styles.thanks}>Thank you, {sent.first}.</h2>
        <p className={styles.sentText}>
          Your enquiry has gone to our {sent.desk}. We will reply to {sent.email} within one working day.
        </p>
        <div className={styles.summary}>
          <span className={styles.summaryLabel}>Company</span>
          <span>{sent.company}</span>
          <span className={styles.summaryLabel}>Products</span>
          <span className={styles.summaryItems}>{sent.items}</span>
          <span className={styles.summaryLabel}>Terms</span>
          <span>{sent.terms}</span>
        </div>
        <div className={styles.sentActions}>
          <Button href={sent.whatsapp} variant="primary" pad="14px 20px" size={15}>
            Continue on WhatsApp
          </Button>
          <Button variant="outline" pad="12.5px 18.5px" size={15} onClick={reset}>
            New enquiry
          </Button>
        </div>
      </div>
    );
  }

  const inBasket = new Set(basket.map((b) => b.id));
  const addMore = products.filter((p) => !inBasket.has(p.id));

  const text = (key: keyof QuoteDetails, label: string, extra: { type?: string; autoComplete?: string; placeholder?: string } = {}) => {
    const error = errs[key as keyof QuoteErrors];
    return (
      <label className={styles.field}>
        {label}
        <input
          className={styles.input}
          value={details[key]}
          onChange={(e) => setField(key, e.target.value)}
          type={extra.type ?? 'text'}
          autoComplete={extra.autoComplete}
          placeholder={extra.placeholder}
          aria-invalid={error ? true : undefined}
        />
        {error && <span className={styles.error}>{error}</span>}
      </label>
    );
  };

  const select = (key: 'frequency' | 'incoterm' | 'buyer', label: string, options: readonly string[]) => (
    <label className={styles.field}>
      {label}
      <select className={styles.input} value={details[key]} onChange={(e) => setField(key, e.target.value)}>
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    </label>
  );

  return (
    <form ref={formRef} className={styles.form} onSubmit={onSubmit} noValidate aria-busy={pending || undefined}>
      <SpamGuardFields />
      <div className={styles.formHead}>
        <h2 className={styles.groupTitle}>Products</h2>
        {basket.length > 0 && <span className={styles.saved}>Saved on this device. Pick up where you left off any time.</span>}
      </div>
      {basket.length === 0 && <div className={styles.empty}>Your quote is empty. Add products below or from any product page.</div>}
      {basket.map((item) => {
        const product = productById(item.id);
        if (!product) return null;
        const form = formOf(product);
        return (
          <div key={item.id} className={styles.item} style={dotVar(form.dot)}>
            <div className={styles.itemTop}>
              <span className={styles.itemName}>
                <span className={styles.name}>{product.name}</span>
                <span className={styles.formLabel}>{form.label}</span>
              </span>
              <span className={styles.itemActions}>
                <Link href={paths.product(product.slug)} className={styles.view}>
                  View details
                </Link>
                <button type="button" aria-label={`Remove ${product.name}`} className={styles.remove} onClick={() => quoteStore.remove(item.id)}>
                  Remove
                </button>
              </span>
            </div>
            <div className={styles.options} role="group" aria-label={`${product.option.label} for ${product.name}`}>
              <span className={styles.optionLabel}>{product.option.label}</span>
              <div className={styles.chips}>
                {product.option.choices.map((choice) => (
                  <button
                    key={choice}
                    type="button"
                    aria-pressed={item.opt === choice}
                    className={cn(styles.chip, item.opt === choice && styles.chipOn)}
                    onClick={() => quoteStore.setItem(item.id, 'opt', choice)}
                  >
                    {choice}
                  </button>
                ))}
              </div>
            </div>
            <label className={styles.field}>
              Volume
              <input
                className={styles.input}
                value={item.volume}
                onChange={(e) => quoteStore.setItem(item.id, 'volume', e.target.value)}
                placeholder="e.g. 1 × 40 ft per week, or 20 t"
                aria-invalid={errs.vol && !item.volume.trim() ? true : undefined}
              />
            </label>
          </div>
        );
      })}
      {errs.basket && (
        <span className={styles.error} data-form-error tabIndex={-1}>
          {errs.basket}
        </span>
      )}
      {errs.vol && <span className={styles.error}>{errs.vol}</span>}
      <div className={styles.options}>
        <span className={styles.addLabel}>Add products</span>
        <div className={styles.chips}>
          {addMore.map((p) => (
            <button key={p.id} type="button" className={styles.add} style={dotVar(formOf(p).dot)} onClick={() => addProduct(p.id)}>
              <span className={styles.addDot} />+ <span>{p.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className={styles.divider} />
      <h2 className={styles.groupTitle}>Terms</h2>
      <div className={styles.grid}>
        {select('frequency', 'Frequency', frequencyOptions)}
        {select('incoterm', 'Incoterm', incotermOptions)}
        {text('port', 'Destination port', { placeholder: 'e.g. Rotterdam, Jebel Ali' })}
        {text('delivery', 'Target start', { placeholder: 'e.g. From April 2027' })}
      </div>

      <div className={styles.divider} />
      <h2 className={styles.groupTitle}>Your details</h2>
      <div className={styles.grid}>
        {text('company', 'Company *', { autoComplete: 'organization' })}
        {text('name', 'Your name *', { autoComplete: 'name' })}
        {text('email', 'Work email *', { type: 'email', autoComplete: 'email' })}
        {text('country', 'Country *', { autoComplete: 'country-name' })}
        {text('phone', 'Phone or WhatsApp', { autoComplete: 'tel' })}
        {select('buyer', 'Business type', buyerOptions)}
      </div>
      <label className={styles.field}>
        Notes
        <textarea
          className={cn(styles.input, styles.textarea)}
          value={details.message}
          onChange={(e) => setField('message', e.target.value)}
          rows={3}
          placeholder="Certification needs, labelling, sample request"
        />
      </label>

      <div className={styles.consentWrap}>
        <button
          type="button"
          role="checkbox"
          aria-checked={consent}
          aria-invalid={errs.consent ? true : undefined}
          className={styles.consent}
          onClick={() => {
            setConsent((c) => !c);
            setErrs((e) => ({ ...e, consent: undefined }));
          }}
        >
          <span className={cn(styles.box, consent && styles.boxOn)} aria-hidden="true">
            {consent ? '✓' : ''}
          </span>
          <span>I agree that Todara may use these details to respond to my enquiry, as set out in the privacy policy (Kenya Data Protection Act, 2019). *</span>
        </button>
        {errs.consent && <span className={styles.consentError}>{errs.consent}</span>}
      </div>

      <div className={styles.submitRow}>
        <button type="submit" className={styles.submit} disabled={pending}>
          Send enquiry
        </button>
        <Link href={paths.privacy} className={styles.privacy}>
          Privacy policy
        </Link>
      </div>
      {sendError && (
        <p className={styles.sendError} role="alert">
          {sendError}
        </p>
      )}
    </form>
  );
}
