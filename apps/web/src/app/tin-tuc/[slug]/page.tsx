import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { buildArticleJsonLd } from '@school-cms/seo';
import { Article, ContentStatus } from '@school-cms/shared';

interface ArticleDetailProps {
  params: {
    slug: string;
  };
}

const mockArticlesDatabase: Record<string, Article> = {
  'le-khai-giang-nam-hoc-2025': {
    id: 'art-001',
    title: 'Lễ Khai Giảng Năm Học 2025: Khát Vọng Vươn Tầm Quốc Tế',
    slug: 'le-khai-giang-nam-hoc-2025',
    excerpt: 'Thầy và trò Alpha School tưng bừng chào đón năm học mới với nhiều mục tiêu giáo dục đột phá, sẵn sàng hội nhập toàn cầu.',
    content: `
      <p class="lead text-lg text-slate-700 font-medium mb-6 leading-relaxed">
        Sáng ngày 05/09/2026, trong không khí rộn ràng của mùa thu lịch sử, Hệ thống Trường Song ngữ Quốc tế Alpha School đã long trọng tổ chức Lễ Khai giảng Năm học 2025 - 2026 trên tất cả các cơ sở trực thuộc.
      </p>
      <p class="mb-4 text-slate-700 leading-relaxed">
        Buổi lễ vinh dự đón tiếp sự hiện diện của đại diện Sở Giáo dục & Đào tạo, các tổ chức kiểm định quốc tế hàng đầu như Cambridge Assessment International Education, Cognia, đại diện Ban Giám hiệu, cùng toàn thể quý phụ huynh và hơn 3,000 học sinh tiêu biểu.
      </p>
      <h2 class="text-2xl font-bold text-slate-900 mt-8 mb-4">Đột Phá Với Chương Trình Đổi Mới Sáng Tạo STEM & AI</h2>
      <p class="mb-4 text-slate-700 leading-relaxed">
        Phát biểu tại buổi lễ, Tổng Hiệu trưởng nhà trường nhấn mạnh: <em>"Năm học 2025 - 2026 đánh dấu bước chuyển mình quan trọng của Alpha School khi chính thức đưa chương trình Robotics và Trí tuệ Nhân tạo (AI) vào giảng dạy từ bậc Tiểu học. Chúng tôi không chỉ dạy học sinh sử dụng công nghệ, mà trang bị cho các em tư duy kiến tạo tương lai."</em>
      </p>
      <div class="my-8 rounded-xl overflow-hidden shadow-lg border border-slate-200">
        <img src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=1200&auto=format&fit=crop" alt="Lễ khai giảng Alpha School" class="w-full h-auto" />
        <p class="p-3 text-xs text-center text-slate-500 bg-slate-50 italic">Học sinh Alpha School rạng rỡ trong ngày khai giảng năm học mới</p>
      </div>
      <h2 class="text-2xl font-bold text-slate-900 mt-8 mb-4">Cam Kết Đồng Hành Cùng Phụ Huynh</h2>
      <p class="mb-4 text-slate-700 leading-relaxed">
        Bên cạnh chương trình học thuật chất lượng cao, nhà trường tiếp tục nâng cấp hệ thống sân chơi thể thao, bể bơi 4 mùa và các câu lạc bộ nghệ thuật, mang đến môi trường giáo dục hạnh phúc và phát triển toàn diện cho mỗi học sinh.
      </p>
    `,
    featuredImageUrl: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=1200&auto=format&fit=crop',
    categoryId: 'cat-1',
    category: { id: 'cat-1', name: 'Tin tức & Sự kiện', slug: 'tin-tuc-su-kien', sortOrder: 1 },
    authorName: 'Ban Truyền Thông Alpha School',
    status: ContentStatus.PUBLISHED,
    isFeatured: true,
    publishedAt: '2026-09-05T08:00:00.000Z',
    createdAt: '2026-09-05T08:00:00.000Z',
    updatedAt: '2026-09-05T08:00:00.000Z',
  },
  'dat-giai-nhat-robot-quoc-te': {
    id: 'art-002',
    title: 'Học Sinh Alpha School Cơ Sở Biên Hòa Đạt Giải Nhất Robotics Quốc Tế',
    slug: 'dat-giai-nhat-robot-quoc-te',
    excerpt: 'Đội tuyển Robotics cơ sở Biên Hòa xuất sắc vượt qua 50 đối thủ quốc tế để bước lên bục vinh quang cao nhất.',
    content: '<p>Đội tuyển Alpha School Cơ sở Biên Hòa vừa giành chiến thắng thuyết phục tại giải đấu VEX Robotics Châu Á...</p>',
    featuredImageUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=1200&auto=format&fit=crop',
    categoryId: 'cat-2',
    category: { id: 'cat-2', name: 'Thành tích học thuật', slug: 'thanh-tich', sortOrder: 2 },
    authorName: 'CLB Sáng Tạo Trẻ Biên Hòa',
    branchId: 'bien-hoa',
    status: ContentStatus.PUBLISHED,
    isFeatured: true,
    publishedAt: '2026-09-02T10:30:00.000Z',
    createdAt: '2026-09-02T10:30:00.000Z',
    updatedAt: '2026-09-02T10:30:00.000Z',
  },
};

export async function generateMetadata({ params }: ArticleDetailProps): Promise<Metadata> {
  const article = mockArticlesDatabase[params.slug];
  if (!article) {
    return { title: 'Không tìm thấy bài viết' };
  }

  return {
    title: `${article.title} | Alpha School`,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      images: article.featuredImageUrl ? [article.featuredImageUrl] : [],
    },
  };
}

export default function ArticleDetailPage({ params }: ArticleDetailProps) {
  const article = mockArticlesDatabase[params.slug];

  if (!article) {
    notFound();
  }

  const jsonLd = buildArticleJsonLd(article);

  return (
    <article className="w-full bg-white min-h-screen py-12">
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-4xl mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="text-xs text-slate-500 mb-6 flex items-center gap-2">
          <a href="/" className="hover:underline">Trang chủ</a>
          <span>&gt;</span>
          <a href="/tin-tuc" className="hover:underline">Tin tức</a>
          <span>&gt;</span>
          <span className="text-slate-800 font-semibold">{article.category?.name}</span>
        </nav>

        {/* Title */}
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-slate-900 mb-6 leading-tight">
          {article.title}
        </h1>

        {/* Meta info */}
        <div className="flex items-center gap-4 text-xs text-slate-500 pb-6 mb-8 border-b border-slate-200">
          <span className="font-semibold text-emerald-700">{article.authorName}</span>
          <span>•</span>
          <time dateTime={article.publishedAt}>Xuất bản: {new Date(article.publishedAt!).toLocaleDateString('vi-VN')}</time>
          {article.branchId && (
            <>
              <span>•</span>
              <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-medium">
                Cơ sở {article.branchId === 'bien-hoa' ? 'Biên Hòa' : article.branchId}
              </span>
            </>
          )}
        </div>

        {/* Featured Image */}
        {article.featuredImageUrl && (
          <div className="mb-10 rounded-2xl overflow-hidden shadow-md">
            <img
              src={article.featuredImageUrl}
              alt={article.title}
              className="w-full h-auto max-h-[500px] object-cover"
            />
          </div>
        )}

        {/* Content Body */}
        <div
          className="prose prose-lg max-w-none text-slate-800 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        {/* Back Link & CTA */}
        <div className="mt-16 pt-8 border-t border-slate-200 flex items-center justify-between">
          <a
            href="/tin-tuc"
            className="text-sm font-semibold text-slate-600 hover:text-emerald-700 transition-colors"
          >
            &larr; Quay lại danh sách tin tức
          </a>
          <a
            href="/tuyen-sinh"
            className="px-6 py-3 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-sm transition-all shadow-sm"
          >
            Đăng ký tư vấn tuyển sinh ngay
          </a>
        </div>
      </div>
    </article>
  );
}
