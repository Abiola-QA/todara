'use client';

import { Fragment, useId, useState } from 'react';

import type { FaqItem } from '@/lib/content';

import styles from './faq-accordion.module.css';

export type FaqGroup = { title?: string; items: readonly FaqItem[] };

type FaqAccordionProps = {
  /** One or more lists; a group with a title gets its own heading. One answer is open at a time across all groups. */
  groups: readonly FaqGroup[];
};

/**
 * The design's question list: "+" opens an answer, "–" closes it, and opening one closes the others.
 * Closed answers stay in the page (hidden) so search engines and find-in-page still see them.
 */
export function FaqAccordion({ groups }: FaqAccordionProps) {
  const [open, setOpen] = useState(-1);
  const baseId = useId();
  let index = 0;

  return (
    <>
      {groups.map((group, g) => {
        const list = (
          <div className={styles.list}>
            {group.items.map((item) => {
              const i = index++;
              const isOpen = open === i;
              const answerId = `${baseId}-a${i}`;
              return (
                <div key={item.q} className={styles.item}>
                  <h3 className={styles.question}>
                    <button type="button" className={styles.toggle} aria-expanded={isOpen} aria-controls={answerId} onClick={() => setOpen(isOpen ? -1 : i)}>
                      <span className={styles.q}>{item.q}</span>
                      <span className={styles.sign} aria-hidden="true">
                        {isOpen ? '–' : '+'}
                      </span>
                    </button>
                  </h3>
                  <p id={answerId} className={styles.answer} hidden={!isOpen}>
                    {item.a}
                  </p>
                </div>
              );
            })}
          </div>
        );
        return group.title ? (
          <div key={group.title} className={styles.group}>
            <h2 className={styles.groupTitle}>{group.title}</h2>
            {list}
          </div>
        ) : (
          <Fragment key={g}>{list}</Fragment>
        );
      })}
    </>
  );
}
