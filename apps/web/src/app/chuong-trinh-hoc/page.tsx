import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Chương Trình Đào Tạo | Alpha School',
  description: 'Hệ thống chương trình đào tạo liên cấp từ Mầm non đến Trung học phổ thông chuẩn Cambridge quốc tế.',
};

const programs = [
  {
    id: 'mam-non',
    title: 'Mầm non Song ngữ Quốc tế',
    slug: 'mam-non',
    gradeLevels: '18 tháng - 5 tuổi',
    description: 'Chương trình chú trọng phương pháp giáo dục giác quan và phản xạ ngôn ngữ tự nhiên thông qua các hoạt động vui chơi sáng tạo.',
    imageUrl: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?q=80&w=800&auto=format&fit=crop',
    highlights: ['Giáo viên bản ngữ 100%', 'Phương pháp Reggio Emilia & Montessori', 'Phát triển cảm xúc xã hội (SEL)'],
  },
  {
    id: 'tieu-hoc',
    title: 'Tiểu học Quốc tế Cambridge Primary',
    slug: 'tieu-hoc',
    gradeLevels: 'Lớp 1 - Lớp 5',
    description: 'Học sinh được trang bị kiến thức vững chắc về Toán, Khoa học, Tiếng Anh chuẩn mực kết hợp kỹ năng sống và tư duy độc lập.',
    imageUrl: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=800&auto=format&fit=crop',
    highlights: ['Chuẩn đầu ra Cambridge Checkpoint', 'Tăng cường Robotics & Khoa học STEM', 'Phát triển thể chất với Bơi lội & Golf'],
  },
  {
    id: 'trung-hoc',
    title: 'Trung học Cơ sở & Phổ thông (IGCSE / A-Level)',
    slug: 'trung-hoc',
    gradeLevels: 'Lớp 6 - Lớp 12',
    description: 'Lộ trình định hướng học thuật chuyên sâu và dự bị đại học quốc tế, mở rộng cơ hội giành học bổng tại các đại học top 100 thế giới.',
    imageUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=800&auto=format&fit=crop',
    highlights: ['Chứng chỉ IGCSE và Tú tài A-Level', 'Cố vấn du học 1:1', 'Chương trình phát triển kỹ năng Lãnh đạo Trẻ'],
  },
];

export default function ProgramsPage() {
  return (
    <div className="w-full bg-slate-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full inline-block mb-3">
            Lộ trình học tập chuẩn mực
          </span>
          <h1 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4">
            Chương Trình Đào Tạo Quốc Tế
          </h1>
          <p className="text-slate-600 text-lg">
            Hệ sinh thái học tập khai phóng, kết hợp hài hòa bản sắc văn hóa Việt Nam và tri thức toàn cầu.
          </p>
        </div>

        {/* Programs List */}
        <div className="space-y-12">
          {programs.map((prog, idx) => (
            <div
              key={prog.id}
              className={`bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col md:flex-row ${
                idx % 2 === 1 ? 'md:flex-row-reverse' : ''
              }`}
            >
              <div className="md:w-1/2 h-72 md:h-auto relative overflow-hidden">
                <img
                  src={prog.imageUrl}
                  alt={prog.title}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-4 left-4 bg-emerald-700 text-white px-3 py-1 rounded-full text-xs font-semibold shadow">
                  {prog.gradeLevels}
                </span>
              </div>

              <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
                  {prog.title}
                </h2>
                <p className="text-slate-600 mb-6 leading-relaxed">
                  {prog.description}
                </p>

                <div className="mb-8">
                  <h4 className="text-xs font-bold uppercase text-slate-500 tracking-wider mb-3">
                    Điểm nổi bật của chương trình:
                  </h4>
                  <ul className="space-y-2">
                    {prog.highlights.map((h, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-slate-700">
                        <span className="text-emerald-600 font-bold">✓</span>
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <a
                    href={`/chuong-trinh-hoc/${prog.slug}`}
                    className="inline-flex items-center px-6 py-3 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-sm transition-all shadow"
                  >
                    Xem chi tiết chương trình &rarr;
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
