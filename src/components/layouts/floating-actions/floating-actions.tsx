'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

import { WhatsAppIcon } from '@/components/icons';
import { paths } from '@/config/paths';
import { useQuote } from '@/lib/quote';
import { generalWhatsapp } from '@/lib/whatsapp';
import { cn } from '@/utils/cn';

import { SITE_FOOTER_ID } from '../site-footer';

import styles from './floating-actions.module.css';

/** Whether the site footer is on screen. */
function useFooterInView() {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const footer = document.getElementById(SITE_FOOTER_ID);
    if (!footer || !('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver(([entry]) => setInView(Boolean(entry?.isIntersecting)));
    io.observe(footer);
    return () => io.disconnect();
  }, []);
  return inView;
}

/**
 * The design's always-available contact routes: a floating WhatsApp button on desktop, and a Quote +
 * WhatsApp bar fixed to the bottom of the screen on tablets and phones.
 */
export function FloatingActions() {
  const footerInView = useFooterInView();
  const { basket } = useQuote();
  const count = basket.length;

  return (
    <>
      <a
        href={generalWhatsapp}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with Todara on WhatsApp"
        title="WhatsApp"
        className={cn(styles.fab, footerInView && styles.hidden)}
        tabIndex={footerInView ? -1 : undefined}
        aria-hidden={footerInView ? true : undefined}
      >
        <WhatsAppIcon size={30} fill="#FFFFFF" />
      </a>
      <div className={styles.spacer} />
      <div className={styles.bar}>
        <Link href={paths.quote} className={styles.barQuote}>
          Quote
          {count > 0 && (
            <span className={styles.count}>
              {count}
              <span className="sr-only">{count === 1 ? ' product' : ' products'} in your quote</span>
            </span>
          )}
        </Link>
        <a href={generalWhatsapp} target="_blank" rel="noopener noreferrer" className={styles.barWhatsapp}>
          <WhatsAppIcon size={20} fill="#25D366" />
          WhatsApp
        </a>
      </div>
    </>
  );
}
