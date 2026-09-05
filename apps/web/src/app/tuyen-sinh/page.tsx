import React from 'react';
import { Page, ContentStatus } from '@school-cms/shared';
import { DynamicPageRenderer } from '../../components/DynamicPageRenderer';

export const metadata = {
  title: 'Thông Tin Tuyển Sinh 2025 - 2026 | Hệ Thống Alpha School',
  description: 'Chính sách tuyển sinh liên cấp Mầm non, Tiểu học, THCS & THPT. Đăng ký nhận học bổng tài năng lên tới 50% học phí.',
};

const mockAdmissionPageData: Page = {
  id: 'page-tuyen-sinh',
  title: 'Thông Tin Tuyển Sinh 2025 - 2026',
  slug: 'tuyen-sinh',
  templateCode: 'admissions_landing',
  branchId: null,
  status: ContentStatus.PUBLISHED,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  sections: [
    {
      id: 'sec-adm-hero',
      pageId: 'page-tuyen-sinh',
      name: 'Banner Tuyển Sinh',
      sortOrder: 1,
      isVisible: true,
      settings: {
        layout: { width: 'full_width' as any },
      },
      blocks: [
        {
          id: 'blk-adm-hero',
          type: 'hero_banner',
          version: 1,
          sortOrder: 1,
          isActive: true,
          config: {
            title: 'MÙA TUYỂN SINH NIÊN KHÓA 2025 - 2026',
            subtitle: 'Ươm mầm tài năng tương lai với chương trình Song ngữ Quốc tế Cambridge & IB',
            primaryButtonText: 'Đăng ký tư vấn ngay',
            primaryButtonUrl: '#form-dang-ky',
            secondaryButtonText: 'Xem chính sách học bổng',
            secondaryButtonUrl: '#chinh-sach-hoc-bong',
            backgroundImageUrl: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=1920&auto=format&fit=crop',
            overlayOpacity: 0.55,
            textAlignment: 'center',
          },
        },
      ],
    },
    {
      id: 'sec-adm-form',
      pageId: 'page-tuyen-sinh',
      name: 'Form Đăng Ký Trực Tuyến',
      sortOrder: 2,
      isVisible: true,
      settings: {
        layout: { width: 'container' as any },
        spacing: { paddingTop: '24px', paddingBottom: '32px' },
      },
      blocks: [
        {
          id: 'blk-adm-form',
          type: 'form_embed',
          version: 1,
          sortOrder: 1,
          isActive: true,
          config: {
            title: 'Đăng Ký Nhận Thông Tin Tuyển Sinh & Lịch Khảo Sát',
            subtitle: 'Ban Tuyển sinh sẽ liên hệ xác nhận và gửi Cẩm nang Tuyển sinh 2025 - 2026 trong vòng 24 giờ làm việc.',
            formCode: 'tuyen-sinh-2025',
            submitButtonText: 'Hoàn tất đăng ký tư vấn',
            successMessage: 'Chúc mừng Quý Phụ Huynh đã đăng ký thành công! Chuyên viên tư vấn Alpha School sẽ liên hệ sớm nhất.',
            showBranchSelect: true,
          },
        },
      ],
    },
  ],
};

export default function AdmissionsPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Dynamic Page Renderer from CMS Blocks */}
      <DynamicPageRenderer page={mockAdmissionPageData} />

      {/* Quy trình tuyển sinh 4 bước */}
      <section className="py-16 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-emerald-700 font-semibold text-xs uppercase tracking-widest bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-200">
              LỘ TRÌNH RÕ RÀNG & MINH BẠCH
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-4 tracking-tight">
              4 Bước Nhập Học Dành Cho Học Sinh Mới
            </h2>
            <p className="text-slate-600 mt-2 text-sm leading-relaxed">
              Quy trình tuyển sinh được tinh gọn giúp Quý Phụ huynh và các em học sinh có trải nghiệm thuận tiện và nhanh chóng nhất.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            {[
              {
                step: '01',
                title: 'Đăng ký thông tin',
                desc: 'Điền form đăng ký trực tuyến hoặc gọi hotline 1900 6868 để nhận tư vấn từ chuyên viên.',
              },
              {
                step: '02',
                title: 'Khảo sát năng lực',
                desc: 'Học sinh tham gia bài kiểm tra tiếng Anh & tư duy logic phù hợp với lứa tuổi.',
              },
              {
                step: '03',
                title: 'Phỏng vấn & Trải nghiệm',
                desc: 'Phỏng vấn 1-1 với Ban giám hiệu và tham gia 01 ngày trải nghiệm thực tế tại cơ sở.',
              },
              {
                step: '04',
                title: 'Hoàn tất nhập học',
                desc: 'Nhận thư mời nhập học chính thức, đóng học phí ưu đãi và nhận đồng phục.',
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-slate-50 border border-slate-200 rounded-xl p-6 relative group hover:shadow-lg hover:border-emerald-500 transition-all"
              >
                <div className="text-4xl font-black text-emerald-600/30 mb-3 group-hover:text-emerald-600 transition-colors">
                  {item.step}
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Học bổng & Ưu đãi */}
      <section id="chinh-sach-hoc-bong" className="py-16 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-emerald-400 font-semibold text-xs uppercase tracking-widest bg-emerald-950/60 px-3.5 py-1.5 rounded-full border border-emerald-800">
              QUỸ TÀI NĂNG TƯƠNG LAI
            </span>
            <h2 className="text-3xl font-bold mt-4 tracking-tight">
              Chương Trình Học Bổng Alpha Excellence 2025
            </h2>
            <p className="text-slate-400 mt-2 text-sm">
              Tổng giá trị học bổng lên tới 10 tỷ VNĐ dành cho học sinh có thành tích học tập và nghệ thuật xuất sắc.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Học bổng Kim Cương',
                discount: '100% Học phí',
                target: 'Học sinh đạt giải Quốc tế hoặc Quốc gia các môn Khoa học / Nghệ thuật / Thể thao.',
                badge: 'Xuất sắc',
              },
              {
                name: 'Học bổng Tài Năng',
                discount: '50% Học phí',
                target: 'Học sinh đạt giải Nhất/Nhì cấp Tỉnh/Thành phố hoặc chứng chỉ IELTS 7.5+.',
                badge: 'Nổi bật',
              },
              {
                name: 'Học bổng Khởi Đầu',
                discount: '30% Học phí',
                target: 'Học sinh có điểm trung bình học tập từ 9.0 trở lên và vượt qua bài khảo sát năng lực.',
                badge: 'Khuyến khích',
              },
            ].map((sch, i) => (
              <div
                key={i}
                className="bg-slate-800 border border-slate-700 rounded-2xl p-8 flex flex-col justify-between hover:border-emerald-500 transition-all"
              >
                <div>
                  <span className="text-xs font-semibold px-3 py-1 rounded bg-emerald-900/50 text-emerald-400 border border-emerald-700 inline-block mb-4">
                    {sch.badge}
                  </span>
                  <h3 className="text-xl font-bold text-white mb-2">{sch.name}</h3>
                  <div className="text-3xl font-extrabold text-emerald-400 mb-4">{sch.discount}</div>
                  <p className="text-slate-300 text-sm leading-relaxed">{sch.target}</p>
                </div>
                <div className="mt-8 pt-6 border-t border-slate-700">
                  <a
                    href="#form-dang-ky"
                    className="block text-center py-2.5 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm transition-all"
                  >
                    Ứng tuyển học bổng
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="py-16 bg-slate-50 border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900">Câu Hỏi Thường Gặp</h2>
            <p className="text-slate-600 text-sm mt-2">
              Những thắc mắc phổ biến của Phụ huynh trong mùa tuyển sinh
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                q: 'Nhà trường có dịch vụ xe bus đưa đón học sinh không?',
                a: 'Có, Alpha School cung cấp mạng lưới xe bus đưa đón tận nhà hoặc theo điểm đón tập trung tại tất cả các quận huyện thuộc địa bàn cơ sở với giám sát viên chuyên trách và định vị GPS.',
              },
              {
                q: 'Chế độ dinh dưỡng và bán trú tại trường được tổ chức thế nào?',
                a: 'Bếp ăn chuẩn quốc tế HACCP chế biến tại chỗ, cung cấp 3 bữa/ngày (sáng, trưa, xế) với thực đơn được các chuyên gia dinh dưỡng thiết kế cân bằng vi chất, thay đổi linh hoạt theo tuần.',
              },
              {
                q: 'Học sinh chuyển từ trường công lập sang có theo kịp chương trình tiếng Anh không?',
                a: 'Nhà trường có các lớp bồi dưỡng tiếng Anh tăng cường (ESL Intensive) đầu năm học và đội ngũ giáo viên trợ giảng hỗ trợ kèm riêng để các em nhanh chóng bắt nhịp tự tin với bạn bè.',
              },
            ].map((faq, i) => (
              <div key={i} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                <h3 className="font-semibold text-slate-900 text-base mb-2 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 text-xs flex items-center justify-center font-bold shrink-0">
                    Q
                  </span>
                  {faq.q}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed pl-8">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
