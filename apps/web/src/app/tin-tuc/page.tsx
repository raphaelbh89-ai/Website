import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tin Tức & Hoạt Động | Alpha School',
  description: 'Cập nhật những tin tức giáo dục, sự kiện học đường và thành tích nổi bật của thầy trò Alpha School.',
};

const mockArticles = [
  {
    id: 'art-001',
    title: 'Lễ Khai Giảng Năm Học 2025: Khát Vọng Vươn Tầm Quốc Tế',
    slug: 'le-khai-giang-nam-hoc-2025',
    excerpt: 'Thầy và trò Alpha School tưng bừng chào đón năm học mới với nhiều mục tiêu giáo dục đột phá, sẵn sàng hội nhập toàn cầu.',
    featuredImageUrl: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=800&auto=format&fit=crop',
    category: 'Tin tức & Sự kiện',
    publishedAt: '05/09/2026',
    branchName: 'Toàn hệ thống',
  },
  {
    id: 'art-002',
    title: 'Học Sinh Alpha School Cơ Sở Biên Hòa Đạt Giải Nhất Robotics Quốc Tế',
    slug: 'dat-giai-nhat-robot-quoc-te',
    excerpt: 'Đội tuyển Robotics cơ sở Biên Hòa xuất sắc vượt qua 50 đối thủ quốc tế để bước lên bục vinh quang cao nhất.',
    featuredImageUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=800&auto=format&fit=crop',
    category: 'Thành tích học thuật',
    publishedAt: '02/09/2026',
    branchName: 'Cơ sở Biên Hòa',
  },
  {
    id: 'art-003',
    title: 'Hội Thảo Hướng Nghiệp & Săn Học Bổng Đại Học Top 100 Thế Giới',
    slug: 'hoi-thao-huong-nghiep-2025',
    excerpt: 'Cơ hội giao lưu trực tiếp với đại diện tuyển sinh từ hơn 20 đại học danh tiếng tại Anh, Mỹ, Úc và Canada.',
    featuredImageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=800&auto=format&fit=crop',
    category: 'Thông báo Tuyển sinh',
    publishedAt: '28/08/2026',
    branchName: 'Toàn hệ thống',
  },
];

export default function NewsListingPage() {
  return (
    <div className="w-full bg-slate-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header Breadcrumb & Title */}
        <div className="mb-8">
          <div className="text-xs text-slate-500 mb-2 flex items-center gap-2">
            <a href="/" className="hover:underline">Trang chủ</a>
            <span>&gt;</span>
            <span className="text-slate-800 font-semibold">Tin tức & Sự kiện</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
            Tin Tức & Hoạt Động Học Đường
          </h1>
          <p className="text-slate-600 mt-2">
            Theo dõi những bước tiến, thành tựu và câu chuyện học tập truyền cảm hứng tại Alpha School.
          </p>
        </div>

        {/* Categories Bar */}
        <div className="flex flex-wrap gap-2 mb-10 pb-4 border-b border-slate-200">
          <button className="px-4 py-2 rounded-full text-xs font-semibold bg-emerald-700 text-white shadow-sm">
            Tất cả bài viết
          </button>
          <button className="px-4 py-2 rounded-full text-xs font-semibold bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 transition-colors">
            Sự kiện nhà trường
          </button>
          <button className="px-4 py-2 rounded-full text-xs font-semibold bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 transition-colors">
            Thành tích học sinh
          </button>
          <button className="px-4 py-2 rounded-full text-xs font-semibold bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 transition-colors">
            Thông báo Tuyển sinh
          </button>
          <button className="px-4 py-2 rounded-full text-xs font-semibold bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 transition-colors">
            Góc Phụ huynh
          </button>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {mockArticles.map((art) => (
            <article
              key={art.id}
              className="bg-white rounded-xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
            >
              <div className="relative h-52 overflow-hidden">
                <img
                  src={art.featuredImageUrl}
                  alt={art.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 bg-emerald-700 text-white px-3 py-1 rounded-full text-xs font-semibold shadow">
                  {art.category}
                </span>
                <span className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md text-white px-2.5 py-0.5 rounded text-xs font-medium">
                  {art.branchName}
                </span>
              </div>
              <div className="p-6 flex flex-col flex-1">
                <time className="text-xs text-slate-400 mb-2 block">{art.publishedAt}</time>
                <h2 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-emerald-700 transition-colors line-clamp-2">
                  <a href={`/tin-tuc/${art.slug}`}>{art.title}</a>
                </h2>
                <p className="text-slate-600 text-sm mb-6 line-clamp-3 flex-1">
                  {art.excerpt}
                </p>
                <a
                  href={`/tin-tuc/${art.slug}`}
                  className="text-sm font-semibold text-emerald-700 hover:text-emerald-800 transition-colors mt-auto inline-flex items-center gap-1"
                >
                  Đọc toàn bộ bài viết &rarr;
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
