import { CoverImage } from '@/components/ui/cover-image';

type SlotPhotoProps = {
  src: string;
  alt: string;
  sizes: string;
  preload?: boolean;
};

/** A product photo filling its (position: relative) frame, like the design's image slot. */
export function SlotPhoto({ src, alt, sizes, preload }: SlotPhotoProps) {
  return <CoverImage src={src} alt={alt} sizes={sizes} preload={preload} />;
}
