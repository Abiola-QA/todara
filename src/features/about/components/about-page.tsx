import { CoverImage } from '@/components/ui/cover-image';

import { aboutFacts, aboutPhoto, sources } from '../data/about';

import styles from './about-page.module.css';

/** About Todara: who the company is, the facts buyers check, and where the fruit comes from. */
export function AboutPage() {
  return (
    <>
      <section className={styles.opener} aria-labelledby="about-title">
        <span className={styles.eyebrow}>About Todara</span>
        <h1 id="about-title" className={styles.title}>
          A Kenyan avocado and mango exporter built for professional buyers.
        </h1>
      </section>

      <section className={styles.story} aria-label="Our story">
        <div className={styles.photo}>
          <CoverImage
            src={aboutPhoto.image}
            alt={aboutPhoto.alt}
            sizes="(max-width: 1000px) 100vw, 600px"
            panX={aboutPhoto.panX}
            panY={aboutPhoto.panY}
            preload
          />
        </div>
        <div className={styles.copy}>
          <p className={styles.lead}>
            Todara Ltd supplies Kenyan avocado and mango, fresh and processed, to importers, processors and wholesale buyers in Europe, the Middle East and
            Asia.
          </p>
          <p className={styles.body}>
            We are a young company with the licences in place to trade. Our AFA–HCD export licence covers avocado and mango in all forms, and our KEPHIS
            registration means every consignment is inspected before it leaves Kenya.
          </p>
          <p className={styles.body}>
            Our offer is built around the questions a buyer asks before committing a container: what exactly is the specification, when is it available, which
            licences cover it, and who answers when something needs to change.
          </p>
          <dl className={styles.facts}>
            {aboutFacts.map((f) => (
              <div key={f.label} className={styles.fact}>
                <dt className={styles.factLabel}>{f.label}</dt>
                <dd className={styles.factValue}>{f.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className={styles.band} aria-labelledby="sources-title">
        <div className={styles.bandInner}>
          <h2 id="sources-title" className={styles.h2}>
            Where the fruit comes from
          </h2>
          <div className={styles.cards}>
            {sources.map((s) => (
              <article key={s.title} className={styles.card}>
                <div className={styles.cardPhoto}>
                  <CoverImage src={s.image} alt={s.alt} sizes="(max-width: 700px) 100vw, 420px" />
                </div>
                <div className={styles.cardText}>
                  <h3 className={styles.cardTitle}>{s.title}</h3>
                  <p className={styles.cardBody}>{s.text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
