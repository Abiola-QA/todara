import Link from 'next/link';

import { site } from '@/config/site';
import { cn } from '@/utils/cn';

import { policies, policyOrder, POLICIES_UPDATED, type PolicyBlock, type PolicyKey } from '../data/policies';

import { CookieChoice } from './cookie-choice';
import styles from './legal-page.module.css';

function Block({ block }: { block: PolicyBlock }) {
  if (block.kind === 'paragraph') return <p className={styles.body}>{block.text}</p>;
  if (block.kind === 'list') {
    return (
      <ul className={styles.list}>
        {block.items.map((item) => (
          <li key={item.label + item.text} className={styles.listItem}>
            <span className={styles.label}>{item.label}</span>
            {item.text}
          </li>
        ))}
      </ul>
    );
  }
  return (
    <div className={styles.tableWrap}>
      <div role="table" className={styles.table} style={{ gridTemplateColumns: block.columns }}>
        <div role="row" className={styles.row}>
          {block.header.map((cell) => (
            <span key={cell} role="columnheader" className={cn(styles.cell, styles.headCell)}>
              {cell}
            </span>
          ))}
        </div>
        {block.rows.map((row) => (
          <div key={row.join('|')} role="row" className={styles.row}>
            {row.map((cell, i) => (
              <span key={i} role="cell" className={styles.cell}>
                {cell}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/** One policy page with the switcher between the four policies on the left. */
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
        <span className={styles.eyebrow}>Legal</span>
        <h1 id="legal-title" className={styles.title}>
          {policy.title}
        </h1>
        <p className={styles.intro}>{policy.intro}</p>
        {key === 'cookies' && <CookieChoice />}
        <div className={styles.sections}>
          {policy.sections.map((s) => (
            <div key={s.heading} className={styles.part}>
              <h2 className={styles.heading}>{s.heading}</h2>
              {s.blocks.map((block, i) => (
                <Block key={i} block={block} />
              ))}
            </div>
          ))}
        </div>
        <span className={styles.updated}>
          Last updated {POLICIES_UPDATED} · {site.legalName}, {site.address.street}, {site.address.locality}, {site.address.country}
        </span>
      </article>
    </section>
  );
}
