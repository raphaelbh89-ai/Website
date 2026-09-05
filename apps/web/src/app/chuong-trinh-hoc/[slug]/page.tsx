import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

interface ProgramDetailProps {
  params: {
    slug: string;
  };
}

const programsDatabase: Record<string, any> = {
  'tieu-hoc': {
    title: 'Chương Trình Tiểu Học Quốc Tế Cambridge Primary',
    gradeLevels: 'Lớp 1 - Lớp 5 (Từ 6 đến 10 tuổi)',
    overview: 'Chương trình Cambridge Primary được thiết kế bài bản nhằm mang đến cho học sinh nền tảng vững chắc trong các môn Toán học, Khoa học, Tiếng Anh và Năng lực Toàn cầu.',
    imageUrl: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=1200&auto=format&fit=crop',
    curriculum: [
      {
        subject: 'Cambridge English (Tiếng Anh Bản Ngữ)',
        desc: 'Phát triển toàn diện 4 kỹ năng nghe, nói, đọc, viết thông qua văn học thiếu nhi thế giới và thuyết trình tự tin.',
      },
      {
        subject: 'Cambridge Mathematics (Toán Học Cambridge)',
        desc: 'Học toán bằng tiếng Anh, tập trung vào tư duy giải quyết vấn đề thực tiễn và tính toán logic.',
      },
      {
        subject: 'Cambridge Science (Khoa Học Thực Nghiệm)',
        desc: 'Thực hành các thí nghiệm sinh học, vật lý, hóa học trong phòng Lab chuyên dụng theo chuẩn Anh Quốc.',
      },
      {
        subject: 'STEM & Robotics Coding',
        desc: 'Lập trình Scratch/Python và chế tạo robot thi đấu nhằm rèn luyện tư duy máy tính từ sớm.',
      },
    ],
  },
  'mam-non': {
    title: 'Chương Trình Mầm Non Song Ngữ Quốc Tế',
    gradeLevels: '18 tháng - 5 tuổi',
    overview: 'Phương pháp giáo dục sớm lấy trẻ làm trung tâm, khơi dậy niềm đam mê khám phá thế giới.',
    imageUrl: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?q=80&w=1200&auto=format&fit=crop',
    curriculum: [
      { subject: 'Song ngữ tự nhiên', desc: 'Giao tiếp hàng ngày với giáo viên bản ngữ' },
      { subject: 'Cảm thụ nghệ thuật & Âm nhạc', desc: 'Phát triển năng khiếu hội họa và âm nhạc' },
    ],
  },
  'trung-hoc': {
    title: 'Chương Trình Trung Học & Tú Tài Quốc Tế IGCSE/A-Level',
    gradeLevels: 'Lớp 6 - Lớp 12',
    overview: 'Lộ trình định hướng học thuật chuyên sâu chuẩn bị hành trang săn học bổng du học đại học top 100 thế giới.',
    imageUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1200&auto=format&fit=crop',
    curriculum: [
      { subject: 'Cambridge IGCSE', desc: 'Chứng chỉ giáo dục phổ thông trung học quốc tế' },
      { subject: 'Cambridge International AS & A Level', desc: 'Bằng tú tài Anh quốc được công nhận toàn cầu' },
    ],
  },
};

export async function generateMetadata({ params }: ProgramDetailProps): Promise<Metadata> {
  const prog = programsDatabase[params.slug];
  if (!prog) return { title: 'Không tìm thấy chương trình' };
  return {
    title: `${prog.title} | Alpha School`,
    description: prog.overview,
  };
}

export default function ProgramDetailPage({ params }: ProgramDetailProps) {
  const prog = programsDatabase[params.slug];
  if (!prog) notFound();

  return (
    <div className="w-full bg-white min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Breadcrumbs */}
        <nav className="text-xs text-slate-500 mb-6 flex items-center gap-2">
          <a href="/" className="hover:underline">Trang chủ</a>
          <span>&gt;</span>
          <a href="/chuong-trinh-hoc" className="hover:underline">Chương trình học</a>
          <span>&gt;</span>
          <span className="text-slate-800 font-semibold">{prog.title}</span>
        </nav>

        {/* Title */}
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full inline-block mb-3">
          {prog.gradeLevels}
        </span>
        <h1 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">
          {prog.title}
        </h1>

        <p className="text-lg text-slate-600 mb-8 leading-relaxed">
          {prog.overview}
        </p>

        {/* Hero image */}
        <div className="rounded-2xl overflow-hidden shadow-lg mb-12 border border-slate-200">
          <img src={prog.imageUrl} alt={prog.title} className="w-full h-auto max-h-[500px] object-cover" />
        </div>

        {/* Curriculum breakdown */}
        <h2 className="text-2xl font-bold text-slate-900 mb-6 pb-2 border-b border-slate-200">
          Khung Môn Học & Chuẩn Đầu Ra
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {prog.curriculum.map((curr: any, idx: number) => (
            <div key={idx} className="p-6 rounded-xl bg-slate-50 border border-slate-200">
              <h3 className="text-lg font-bold text-slate-900 mb-2">{curr.subject}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{curr.desc}</p>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="bg-emerald-800 text-white rounded-2xl p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div>
            <h3 className="text-2xl font-bold mb-2">Đăng Ký Nhận Cẩm Nang & Biểu Phí 2025</h3>
            <p className="text-emerald-100 text-sm">Hồ sơ chi tiết về khung đào tạo, học phí và chính sách học bổng.</p>
          </div>
          <a
            href="/tuyen-sinh"
            className="px-8 py-3.5 rounded-lg bg-white text-emerald-800 font-bold hover:bg-emerald-50 transition-colors shadow-sm flex-shrink-0"
          >
            Tải cẩm nang ngay
          </a>
        </div>
      </div>
    </div>
  );
}
