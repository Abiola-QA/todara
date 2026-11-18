import Image from 'next/image';
import Link from 'next/link';

import logo from '@/assets/brand/todara-logo-cream-honey.svg';
import { companyNav, legalNav } from '@/config/navigation';
import { paths } from '@/config/paths';
import { site } from '@/config/site';
import { products } from '@/lib/catalog';
import { generalWhatsapp } from '@/lib/whatsapp';

import styles from './site-footer.module.css';

/** The id the floating WhatsApp button watches to step aside when the footer comes into view. */
export const SITE_FOOTER_ID = 'site-footer';

export function SiteFooter() {
  return (
    <footer id={SITE_FOOTER_ID} className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.columns}>
          <div className={styles.brand}>
            <Image src={logo} alt="Todara" unoptimized className={styles.logo} />
            <span className={styles.text}>{site.description}</span>
          </div>
          <nav className={styles.col} aria-label="Products">
            <span className={styles.head}>Products</span>
            {products.map((p) => (
              <Link key={p.id} href={paths.product(p.slug)} className={styles.link}>
                {p.name}
              </Link>
            ))}
          </nav>
          <nav className={styles.col} aria-label="Company">
            <span className={styles.head}>Company</span>
            {companyNav.map((item) => (
              <Link key={item.href} href={item.href} className={styles.link}>
                {item.label}
              </Link>
            ))}
          </nav>
          <div className={styles.col}>
            <span className={styles.head}>Contact</span>
            <span className={styles.text}>
              {site.address.street}
              <br />
              {site.address.locality}, {site.address.country}
            </span>
            <a href={`mailto:${site.email}`} className={styles.contactLink}>
              {site.email}
            </a>
            <a href={generalWhatsapp} target="_blank" rel="noopener noreferrer" className={styles.contactLink}>
              Chat on WhatsApp
            </a>
          </div>
        </div>
        <div className={styles.bottom}>
          <span>© 2026 {site.legalName}</span>
          <nav className={styles.legal} aria-label="Legal">
            {legalNav.map((item) => (
              <Link key={item.href} href={item.href} className={styles.legalLink}>
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
