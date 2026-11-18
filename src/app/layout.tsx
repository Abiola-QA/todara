import type { Metadata, Viewport } from 'next';
import { Albert_Sans } from 'next/font/google';

import { siteMetadata } from '@/config/seo';

import '@/styles/globals.css';

const albertSans = Albert_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal'],
  display: 'swap',
  variable: '--font-sans',
  fallback: ['system-ui', 'sans-serif'],
});

export const metadata: Metadata = siteMetadata;

export const viewport: Viewport = {
  themeColor: '#1E3A2F',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className={albertSans.variable}>
      <body>{children}</body>
    </html>
  );
}
