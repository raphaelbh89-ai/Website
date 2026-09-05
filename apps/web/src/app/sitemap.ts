import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://school.edu.vn';

  // Static routes
  const staticRoutes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/tuyen-sinh`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.95,
    },
    {
      url: `${baseUrl}/chuong-trinh-hoc`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/tin-tuc`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.85,
    },
  ];

  // Campuses routes
  const campusSlugs = ['bien-hoa', 'thu-duc', 'binh-duong'];
  const campusRoutes = campusSlugs.map((slug) => ({
    url: `${baseUrl}/co-so/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // Academic programs routes
  const programSlugs = ['mam-non', 'tieu-hoc', 'trung-hoc'];
  const programRoutes = programSlugs.map((slug) => ({
    url: `${baseUrl}/chuong-trinh-hoc/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // Articles routes
  const articleSlugs = [
    'le-khai-giang-nam-hoc-2025',
    'hoc-sinh-bien-hoa-dat-giai-nhat-robotics-2025',
    'hoi-thao-huong-nghiep-2025',
  ];
  const articleRoutes = articleSlugs.map((slug) => ({
    url: `${baseUrl}/tin-tuc/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.75,
  }));

  return [...staticRoutes, ...campusRoutes, ...programRoutes, ...articleRoutes];
}
