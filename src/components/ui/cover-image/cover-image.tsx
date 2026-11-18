import Image from 'next/image';
import type { CSSProperties } from 'react';

import { mediaUrl } from '@/config/media';
import { cn } from '@/utils/cn';

import styles from './cover-image.module.css';

type CoverImageProps = {
  /** Path in the media store, e.g. "images/todara-03b-full-range-stack.jpg". */
  src: string;
  alt: string;
  /** Responsive sizes hint, e.g. "(max-width: 760px) 100vw, 420px". */
  sizes: string;
  /**
   * Pan saved in the design's image slot, in percent of the frame (.image-slots.state.json "x"/"y").
   * 0/0 = centred, like object-fit: cover.
   */
  panX?: number;
  panY?: number;
  /** Preload (only the main above-the-fold photo). */
  preload?: boolean;
  className?: string;
};

/**
 * The design draws its image slot's dashed ring (1.5px dashed, 35% of the text colour) over every photo,
 * because its slots are never marked as filled. Kept to match the design; set to false to drop it everywhere.
 */
export const SHOW_DESIGN_RING = true;

/**
 * Replaces the design's <image-slot>: the photo fills its frame like object-fit: cover, shifted by the
 * slot's saved pan so the crop matches the design at every frame size.
 */
export function CoverImage({ src, alt, sizes, panX = 0, panY = 0, preload, className }: CoverImageProps) {
  const style = panX || panY ? ({ objectPosition: `calc(50% + ${panX}cqw) calc(50% + ${panY}cqh)` } as CSSProperties) : undefined;
  return (
    <div className={cn(styles.frame, className)}>
      <Image
        src={mediaUrl(src)}
        alt={alt}
        fill
        sizes={sizes}
        preload={preload}
        loading={preload ? 'eager' : undefined}
        className={styles.image}
        style={style}
      />
      {SHOW_DESIGN_RING && <span className={styles.ring} aria-hidden="true" />}
    </div>
  );
}
