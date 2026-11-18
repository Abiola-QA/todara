import Link from 'next/link';
import type { ComponentProps, CSSProperties, ReactNode } from 'react';

import { cn } from '@/utils/cn';

import styles from './button.module.css';

export type ButtonVariant = 'primary' | 'honey' | 'outline' | 'outlineSoft' | 'outlineFaint' | 'outlineLight';
export type ButtonHover = 'darken' | 'honey' | 'tint' | 'cream' | 'lightTint' | 'border' | 'none';

type BaseProps = {
  variant: ButtonVariant;
  /** The design's style-hover for this button. */
  hover?: ButtonHover;
  /** CSS padding, exactly as the design writes it (outlined buttons already subtract their 1.5px border). */
  pad: string;
  /** Font size in px. */
  size: number;
  /** Centred text in a fixed-width cell (box-sizing: border-box; text-align: center). */
  block?: boolean;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
};

type AsLink = BaseProps & { href: string; external?: boolean; onClick?: () => void } & Pick<ComponentProps<'a'>, 'aria-label'>;
type AsButton = BaseProps & { href?: undefined } & Omit<ComponentProps<'button'>, 'className' | 'style' | 'children'>;

const hoverClass: Record<ButtonHover, string | undefined> = {
  darken: styles.hoverDarken,
  honey: styles.hoverHoney,
  tint: styles.hoverTint,
  cream: styles.hoverCream,
  lightTint: styles.hoverLightTint,
  border: styles.hoverBorder,
  none: undefined,
};

/**
 * The design's button, as a link (internal routes use next/link, wa.me and other sites open in a new tab)
 * or as a <button> for actions.
 */
export function Button(props: AsLink | AsButton) {
  const { variant, hover = 'none', pad, size, block, className, style, children } = props;
  const classes = cn(styles.button, styles[variant], hoverClass[hover], block && styles.block, className);
  const vars = { '--pad': pad, '--fs': `${size}px`, ...style } as CSSProperties;

  if (props.href !== undefined) {
    const { href, external, onClick } = props;
    if (external || /^https?:|^mailto:|^tel:/.test(href)) {
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" className={classes} style={vars} aria-label={props['aria-label']} onClick={onClick}>
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={classes} style={vars} aria-label={props['aria-label']} onClick={onClick}>
        {children}
      </Link>
    );
  }

  const { variant: _v, hover: _h, pad: _p, size: _s, block: _b, className: _c, style: _st, children: _ch, type = 'button', ...rest } = props;
  return (
    <button type={type} className={classes} style={vars} {...rest}>
      {children}
    </button>
  );
}
