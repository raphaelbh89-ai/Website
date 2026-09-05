import { Branch, Article } from '@school-cms/shared';

/**
 * Sinh Schema.org cho trường học (School / EducationalOrganization)
 */
export function buildSchoolJsonLd(branch?: Branch | null, siteUrl = 'https://school.edu.vn') {
  return {
    '@context': 'https://schema.org',
    '@type': 'School',
    name: branch ? branch.name : 'Hệ thống Trường Quốc tế Song ngữ Alpha School',
    url: branch ? `${siteUrl}/co-so/${branch.slug}` : siteUrl,
    telephone: branch?.phone || '+84-251-1234567',
    address: {
      '@type': 'PostalAddress',
      streetAddress: branch?.address || 'Việt Nam',
      addressCountry: 'VN',
    },
  };
}

/**
 * Sinh Schema.org cho bài viết tin tức (NewsArticle)
 */
export function buildArticleJsonLd(article: Article, siteUrl = 'https://school.edu.vn') {
  return {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.title,
    description: article.excerpt,
    image: article.featuredImageUrl ? [article.featuredImageUrl] : [],
    datePublished: article.publishedAt || article.createdAt,
    dateModified: article.updatedAt,
    author: {
      '@type': 'Person',
      name: article.authorName || 'Ban Truyền Thông Alpha School',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Alpha School',
      url: siteUrl,
    },
  };
}

/**
 * Sinh Schema.org cho Chương trình học (Course)
 */
export function buildCourseJsonLd(
  course: { title: string; overview: string; slug: string },
  siteUrl = 'https://school.edu.vn'
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: course.title,
    description: course.overview,
    url: `${siteUrl}/chuong-trinh-hoc/${course.slug}`,
    provider: {
      '@type': 'School',
      name: 'Hệ thống Trường Quốc tế Song ngữ Alpha School',
      url: siteUrl,
    },
  };
}

