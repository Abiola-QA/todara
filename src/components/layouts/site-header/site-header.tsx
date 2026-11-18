'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useId, useRef, useState, type CSSProperties, type PointerEvent } from 'react';

import logo from '@/assets/brand/todara-logo-forest-leaf.svg';
import { mainNav } from '@/config/navigation';
import { paths } from '@/config/paths';
import { formList, products, productsInForm, forms } from '@/lib/catalog';
import { useQuote } from '@/lib/quote';
import { cn } from '@/utils/cn';

import styles from './site-header.module.css';

/** Whether a nav entry is the current section (Products stays active on product pages). */
export function isActive(pathname: string, href: string) {
  return pathname === href || (href === paths.products && pathname.startsWith(`${paths.products}/`));
}

/** Products whose name, form or fruit contains the query (the design's search). */
export function searchProducts(query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return products.filter((p) => `${p.name} ${forms[p.form].label} ${p.fruit}`.toLowerCase().includes(q));
}

const formVars = (dot: string, ink: string) => ({ '--dot': dot, '--ink': ink }) as CSSProperties;

/** Sticky header: logo, navigation with the products menu, product search, quote button and mobile drawer. */
export function SiteHeader() {
  const pathname = usePathname();
  const { basket } = useQuote();
  const count = basket.length;

  const [menuOpen, setMenuOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const searchRef = useRef<HTMLDivElement>(null);
  const menuId = useId();
  const drawerId = useId();
  const searchId = useId();

  /** Everything the design's go() resets when a link is followed. */
  const closeAll = () => {
    setMenuOpen(false);
    setDrawerOpen(false);
    setSearchOpen(false);
    setQuery('');
  };

  // Close the search on a click or tap outside it, or on Escape.
  useEffect(() => {
    if (!searchOpen) return;
    const outside = (e: Event) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setSearchOpen(false);
    };
    const escape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSearchOpen(false);
    };
    document.addEventListener('mousedown', outside);
    document.addEventListener('touchstart', outside);
    document.addEventListener('keydown', escape);
    return () => {
      document.removeEventListener('mousedown', outside);
      document.removeEventListener('touchstart', outside);
      document.removeEventListener('keydown', escape);
    };
  }, [searchOpen]);

  // The drawer belongs to the narrow layout: widening the window closes it, as in the design.
  useEffect(() => {
    const wide = window.matchMedia('(min-width: 980px)');
    const onChange = () => {
      if (wide.matches) setDrawerOpen(false);
    };
    wide.addEventListener('change', onChange);
    return () => wide.removeEventListener('change', onChange);
  }, []);

  // Hover opens the products menu for a mouse only; on touch screens the tap follows the link instead.
  const onMenuEnter = (e: PointerEvent) => {
    if (e.pointerType === 'mouse') setMenuOpen(true);
  };
  const onMenuLeave = (e: PointerEvent) => {
    if (e.pointerType === 'mouse') setMenuOpen(false);
  };

  const results = searchProducts(query);
  const hasQuery = query.trim() !== '';

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link href={paths.home} aria-label="Todara home" className={styles.home} onClick={closeAll}>
          <Image src={logo} alt="Todara" unoptimized preload loading="eager" className={styles.logo} />
        </Link>

        <nav className={cn(styles.nav, styles.wideOnly)} aria-label="Main">
          {mainNav.map((item) => {
            const active = isActive(pathname, item.href);
            if (item.href !== paths.products) {
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(styles.navLink, active && styles.active)}
                  aria-current={active ? 'page' : undefined}
                  onClick={closeAll}
                >
                  {item.label}
                </Link>
              );
            }
            return (
              <div
                key={item.href}
                className={styles.menuWrap}
                onPointerEnter={onMenuEnter}
                onPointerLeave={onMenuLeave}
                onFocus={() => setMenuOpen(true)}
                onBlur={(e) => {
                  if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setMenuOpen(false);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') setMenuOpen(false);
                }}
              >
                <Link
                  href={item.href}
                  className={cn(styles.navLink, styles.navLinkProducts, active && styles.active)}
                  aria-current={active ? 'page' : undefined}
                  aria-expanded={menuOpen}
                  aria-controls={menuId}
                  onClick={closeAll}
                >
                  {item.label}
                  <span className={styles.caret} aria-hidden="true">
                    ▼
                  </span>
                </Link>
                {menuOpen && (
                  <div id={menuId} className={styles.menu}>
                    {formList.map((form) => (
                      <div key={form.key} className={styles.menuCol} style={formVars(form.dot, form.ink)}>
                        <Link href={paths.productsInForm(form.key)} className={styles.menuHead} onClick={closeAll}>
                          <span className={styles.menuDot} />
                          <span className={styles.menuLabel}>{form.label}</span>
                        </Link>
                        {productsInForm(form.key).map((p) => (
                          <Link key={p.id} href={paths.product(p.slug)} className={styles.menuItem} onClick={closeAll}>
                            {p.name}
                          </Link>
                        ))}
                        <span className={styles.menuBuyer}>{form.buyer}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <div className={styles.actions}>
          <div ref={searchRef} className={styles.searchWrap}>
            <button
              type="button"
              aria-label="Search products"
              aria-expanded={searchOpen}
              aria-controls={searchId}
              className={cn(styles.iconButton, styles.searchButton)}
              onClick={() => {
                setSearchOpen((open) => !open);
                setMenuOpen(false);
              }}
            >
              <svg viewBox="0 0 20 20" className={styles.searchIcon} aria-hidden="true">
                <circle cx="8.5" cy="8.5" r="6" style={{ fill: 'none', stroke: '#1E3A2F', strokeWidth: 2 }} />
                <path d="M13 13L18 18" style={{ stroke: '#1E3A2F', strokeWidth: 2, strokeLinecap: 'round' }} />
              </svg>
            </button>
            {searchOpen && (
              <div id={searchId} className={styles.searchPanel} role="search">
                <input
                  // The design focuses the field as soon as the panel opens.

                  autoFocus
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search: avocado, IQF dice, puree…"
                  aria-label="Search products"
                  className={styles.searchInput}
                />
                {results.length > 0 && (
                  <div className={styles.results}>
                    {results.map((p) => (
                      <Link key={p.id} href={paths.product(p.slug)} className={styles.result} onClick={closeAll}>
                        <span className={styles.resultName}>{p.name}</span>
                        <span className={styles.resultLine}>{forms[p.form].label}</span>
                      </Link>
                    ))}
                  </div>
                )}
                {hasQuery && results.length === 0 && <span className={styles.noResults}>No match. Try avocado, mango, IQF or puree.</span>}
              </div>
            )}
          </div>

          <Link href={paths.quote} className={styles.quote} onClick={closeAll}>
            Quote
            {count > 0 && (
              <span className={styles.count}>
                {count}
                <span className="sr-only">{count === 1 ? ' product' : ' products'} in your quote</span>
              </span>
            )}
          </Link>

          <button
            type="button"
            aria-label="Menu"
            aria-expanded={drawerOpen}
            aria-controls={drawerId}
            className={cn(styles.iconButton, styles.burger, styles.narrowOnly)}
            onClick={() => {
              setDrawerOpen((open) => !open);
              setSearchOpen(false);
            }}
          >
            <span className={styles.burgerLine} />
            <span className={styles.burgerLine} />
            <span className={styles.burgerLine} />
          </button>
        </div>
      </div>

      {drawerOpen && (
        <div id={drawerId} className={cn(styles.drawer, styles.narrowOnly)}>
          <nav className={styles.drawerNav} aria-label="Main">
            {mainNav.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(styles.drawerLink, active && styles.active)}
                  aria-current={active ? 'page' : undefined}
                  onClick={closeAll}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
          {formList.map((form) => (
            <div key={form.key} className={styles.drawerForm} style={formVars(form.dot, form.ink)}>
              <span className={styles.drawerFormHead}>
                <span className={styles.drawerDot} />
                {form.label}
              </span>
              {productsInForm(form.key).map((p) => (
                <Link key={p.id} href={paths.product(p.slug)} className={styles.drawerItem} onClick={closeAll}>
                  {p.name}
                </Link>
              ))}
            </div>
          ))}
        </div>
      )}
    </header>
  );
}
