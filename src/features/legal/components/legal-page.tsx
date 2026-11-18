import Link from 'next/link';

import { site } from '@/config/site';
import { cn } from '@/utils/cn';

import { policies, policyOrder, type PolicyKey } from '../data/policies';

import styles from './legal-page.module.css';

/** One policy page with the switcher between privacy, terms and cookies on the left. */
export function LegalPage({ policy: key }: { policy: PolicyKey }) {
  const policy = policies[key];
  return (
    <section className={styles.section} aria-labelledby="legal-title">
      <nav className={styles.nav} aria-label="Policies">
        {policyOrder.map((k) => {
          const p = policies[k];
          const active = k === key;
          return (
            <Link key={k} href={p.href} className={cn(styles.navLink, active && styles.navActive)} aria-current={active ? 'page' : undefined}>
              {p.title}
            </Link>
          );
        })}
      </nav>
      <article className={styles.article}>
        <div className={styles.notice}>Draft for legal review against the Kenya Data Protection Act, 2019. Not yet in force.</div>
        <h1 id="legal-title" className={styles.title}>
          {policy.title}
        </h1>
        <p className={styles.intro}>{policy.intro}</p>
        <div className={styles.sections}>
          {policy.sections.map((s) => (
            <div key={s.heading} className={styles.part}>
              <h2 className={styles.heading}>{s.heading}</h2>
              <p className={styles.body}>{s.body}</p>
            </div>
          ))}
        </div>
        <span className={styles.updated}>
          Last updated November 2026 · {site.legalName}, {site.address.locality}, {site.address.country}
        </span>
      </article>
    </section>
  );
}
