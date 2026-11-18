import type { MetadataRoute } from 'next';

import { site } from '@/config/site';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${site.legalName}: Kenyan avocado and mango exporter`,
    short_name: site.name,
    description: site.description,
    start_url: '/',
    display: 'browser',
    background_color: '#F4EFE4',
    theme_color: '#1E3A2F',
    icons: [
      { src: '/brand/todara-app-icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/brand/todara-app-icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
  };
}
