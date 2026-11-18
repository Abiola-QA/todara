import type { ReactNode } from 'react';

import { Toaster } from '@/components/ui/toaster';

import { CookieBanner } from '../cookie-banner';
import { CtaBand } from '../cta-band';
import { FloatingActions } from '../floating-actions';
import { SiteFooter } from '../site-footer';
import { SiteHeader } from '../site-header';
import { TopBar } from '../top-bar';

import styles from './site-shell.module.css';

type SiteShellProps = {
  children: ReactNode;
  /** The "Talk to our export team" band at the end of the page (every page except the quote page). */
  showCta?: boolean;
};

/** Frame shared by every page: credentials strip, header, content, CTA band, footer and contact shortcuts. */
export function SiteShell({ children, showCta = true }: SiteShellProps) {
  return (
    <>
      <a href="#main" className={styles.skip}>
        Skip to content
      </a>
      <TopBar />
      <SiteHeader />
      <main id="main">
        {children}
        {showCta && <CtaBand />}
      </main>
      <SiteFooter />
      <FloatingActions />
      <CookieBanner />
      <Toaster />
    </>
  );
}
