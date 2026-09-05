import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Hệ thống Trường Quốc tế Song ngữ Alpha School',
    short_name: 'Alpha School',
    description: 'Cổng thông tin & Tuyển sinh liên cấp trực tuyến Alpha School',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#047857',
    icons: [
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
