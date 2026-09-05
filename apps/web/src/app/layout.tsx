import React from 'react';
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Hệ thống Trường Quốc tế Song ngữ Alpha School',
  description: 'Trường học liên cấp song ngữ chuẩn quốc tế hàng đầu tại Việt Nam.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Outfit:wght@500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen antialiased flex flex-col">
        {/* Header Navigation */}
        <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
            <a href="/" className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-bold text-xl">
                A
              </span>
              <div>
                <span className="text-xl font-bold tracking-tight text-slate-900 block leading-tight">
                  ALPHA SCHOOL
                </span>
                <span className="text-xs text-slate-500 block">International Bilingual Campus</span>
              </div>
            </a>

            <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-700">
              <a href="/" className="hover:text-emerald-700 transition-colors">Trang chủ</a>
              <a href="/co-so/bien-hoa" className="hover:text-emerald-700 transition-colors">Cơ sở Biên Hòa</a>
              <a href="/chuong-trinh-hoc" className="hover:text-emerald-700 transition-colors">Chương trình học</a>
              <a href="/tin-tuc" className="hover:text-emerald-700 transition-colors">Tin tức</a>
              <a href="/tuyen-sinh" className="px-5 py-2.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-semibold transition-all shadow-sm">
                Tuyển sinh 2025
              </a>
            </nav>
          </div>
        </header>

        {children}

        {/* Footer */}
        <footer className="bg-slate-900 text-white py-12 border-t border-slate-800 mt-auto">
          <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <span className="text-xl font-bold tracking-tight block mb-3">ALPHA SCHOOL</span>
              <p className="text-slate-400 text-sm leading-relaxed">
                Hệ thống giáo dục liên cấp song ngữ chuẩn quốc tế. Nơi nuôi dưỡng đam mê, khai phóng tiềm năng thế hệ tương lai.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-slate-200 mb-3">Hệ thống cơ sở</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="/co-so/bien-hoa" className="hover:text-white">Cơ sở Biên Hòa - Đồng Nai</a></li>
                <li><a href="/co-so/thu-duc" className="hover:text-white">Cơ sở TP. Thủ Đức - TP. HCM</a></li>
                <li><a href="/co-so/binh-duong" className="hover:text-white">Cơ sở Thủ Dầu Một - Bình Dương</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-slate-200 mb-3">Liên hệ tuyển sinh</h4>
              <p className="text-slate-400 text-sm mb-1">Hotline: 1900 6868</p>
              <p className="text-slate-400 text-sm">Email: tuyensinh@school.edu.vn</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
