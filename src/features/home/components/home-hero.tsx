import Image from 'next/image';

import { Button } from '@/components/ui/button';
import { mediaUrl } from '@/config/media';
import { paths } from '@/config/paths';
import { generalWhatsapp } from '@/lib/whatsapp';

import styles from './home-hero.module.css';

export const HERO_IMAGE = { src: 'images/todara-hero-fruit.png', width: 1200, height: 551 } as const;

/** Dark opening section: headline, three ways in, and the avocado and mango cut-out. */
export function HomeHero() {
  return (
    <section className={styles.hero} aria-labelledby="home-title">
      <div className={styles.copy}>
        <span className={styles.eyebrow}>Avocado and mango from Kenya</span>
        <h1 id="home-title" className={styles.title}>
          Kenyan avocado and mango exporter. <span className={styles.accent}>Fresh, IQF and puree.</span>
        </h1>
        <p className={styles.lead}>
          Whole fruit by sea and air, IQF halves and dice, and puree for manufacturers. Licensed by AFA–HCD and registered with KEPHIS.
        </p>
        <div className={styles.actions}>
          <Button href={paths.quote} variant="honey" hover="cream" pad="16px 26px" size={16}>
            Request a quote
          </Button>
          <Button href={paths.products} variant="outlineLight" hover="lightTint" pad="14.5px 24.5px" size={16}>
            Explore products
          </Button>
          <a href={generalWhatsapp} target="_blank" rel="noopener noreferrer" className={styles.whatsapp}>
            WhatsApp the export team
          </a>
        </div>
      </div>
      <div className={styles.photoWrap}>
        <Image
          src={mediaUrl(HERO_IMAGE.src)}
          width={HERO_IMAGE.width}
          height={HERO_IMAGE.height}
          alt="Kenyan Hass avocado, whole and halved, with Kent mango, whole and cut"
          sizes="(min-width: 980px) min(38vw, 540px), min(calc(100vw - 40px), 520px)"
          preload
          loading="eager"
          className={styles.photo}
        />
      </div>
    </section>
  );
}
