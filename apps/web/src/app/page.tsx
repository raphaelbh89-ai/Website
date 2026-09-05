import React from 'react';
import { Page, ContentStatus } from '@school-cms/shared';
import { DynamicPageRenderer } from '../components/DynamicPageRenderer';

// Trang chủ được nạp dữ liệu từ CMS / Page JSON
const mockHomePageData: Page = {
  id: 'page-home',
  title: 'Trang Chủ Alpha School',
  slug: '',
  templateCode: 'campus_landing',
  branchId: null,
  status: ContentStatus.PUBLISHED,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  sections: [
    {
      id: 'sec-hero',
      pageId: 'page-home',
      name: 'Hero Section',
      sortOrder: 1,
      isVisible: true,
      settings: {
        layout: { width: 'full_width' as any },
      },
      blocks: [
        {
          id: 'blk-hero',
          type: 'hero_banner',
          version: 1,
          sortOrder: 1,
          isActive: true,
          config: {
            title: 'Khát Vọng Vươn Tầm Cùng Alpha School',
            subtitle: 'Môi trường giáo dục song ngữ toàn diện - Nuôi dưỡng tài năng lãnh đạo tương lai',
            primaryButtonText: 'Đăng ký nhận học bổng 2025',
            primaryButtonUrl: '/tuyen-sinh',
            secondaryButtonText: 'Tìm hiểu hệ thống cơ sở',
            secondaryButtonUrl: '/co-so/bien-hoa',
            backgroundImageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1920&auto=format&fit=crop',
            overlayOpacity: 0.45,
            textAlignment: 'center',
          },
        },
      ],
    },
    {
      id: 'sec-programs',
      pageId: 'page-home',
      name: 'Chương trình đào tạo',
      sortOrder: 2,
      isVisible: true,
      settings: {
        layout: { width: 'container' as any },
        spacing: { paddingTop: '20px', paddingBottom: '20px' },
      },
      blocks: [
        {
          id: 'blk-programs',
          type: 'program_list',
          version: 1,
          sortOrder: 1,
          isActive: true,
          config: {
            title: 'Lộ Trình Đào Tạo Chuẩn Quốc Tế',
            subtitle: 'Chương trình giảng dạy được kiểm định bởi các tổ chức giáo dục hàng đầu',
            columns: '3',
            programs: [
              {
                id: 'p1',
                title: 'Mầm non Song ngữ Quốc tế',
                gradeLevel: '18 tháng - 5 tuổi',
                description: 'Phương pháp giáo dục sớm giúp trẻ phát triển giác quan và tiếp thu song ngữ tự nhiên.',
                imageUrl: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?q=80&w=800&auto=format&fit=crop',
                detailUrl: '/chuong-trinh-hoc/mam-non',
              },
              {
                id: 'p2',
                title: 'Tiểu học Quốc tế Cambridge',
                gradeLevel: 'Lớp 1 - Lớp 5',
                description: 'Học sinh thành thạo tiếng Anh học thuật và rèn luyện kỹ năng tư duy phản biện.',
                imageUrl: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=800&auto=format&fit=crop',
                detailUrl: '/chuong-trinh-hoc/tieu-hoc',
              },
              {
                id: 'p3',
                title: 'Trung học Cơ sở & Phổ thông',
                gradeLevel: 'Lớp 6 - Lớp 12',
                description: 'Chương trình IGCSE và A-Level mở cánh cửa vào các đại học hàng đầu thế giới.',
                imageUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=800&auto=format&fit=crop',
                detailUrl: '/chuong-trinh-hoc/trung-hoc',
              },
            ],
          },
        },
      ],
    },
    {
      id: 'sec-branches',
      pageId: 'page-home',
      name: 'Hệ thống cơ sở',
      sortOrder: 3,
      isVisible: true,
      settings: {
        layout: { width: 'container' as any },
      },
      blocks: [
        {
          id: 'blk-branches',
          type: 'branch_list',
          version: 1,
          sortOrder: 1,
          isActive: true,
          config: {
            title: 'Hệ Thống Cơ Sở Alpha School',
            subtitle: 'Các cơ sở tọa lạc tại các vị trí trọng điểm với hạ tầng giáo dục đẳng cấp',
            branches: [
              {
                id: 'b1',
                name: 'Alpha School - Cơ sở Biên Hòa',
                slug: 'bien-hoa',
                address: 'Số 123 Đường Nguyễn Ái Quốc, TP. Biên Hòa, Tỉnh Đồng Nai',
                phone: '0251 123 4567',
                imageUrl: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=800&auto=format&fit=crop',
              },
              {
                id: 'b2',
                name: 'Alpha School - Cơ sở TP. Thủ Đức',
                slug: 'thu-duc',
                address: 'Khu đô thị Sala, TP. Thủ Đức, TP. Hồ Chí Minh',
                phone: '028 987 6543',
                imageUrl: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?q=80&w=800&auto=format&fit=crop',
              },
              {
                id: 'b3',
                name: 'Alpha School - Cơ sở Bình Dương',
                slug: 'binh-duong',
                address: 'Đại lộ Bình Dương, TP. Thủ Dầu Một, Tỉnh Bình Dương',
                phone: '0274 333 8888',
                imageUrl: 'https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=800&auto=format&fit=crop',
              },
            ],
          },
        },
      ],
    },
    {
      id: 'sec-partners',
      pageId: 'page-home',
      name: 'Đối tác',
      sortOrder: 4,
      isVisible: true,
      settings: {
        layout: { width: 'full_width' as any },
      },
      blocks: [
        {
          id: 'blk-partners',
          type: 'partner_slider',
          version: 1,
          sortOrder: 1,
          isActive: true,
          config: {
            title: 'Đối Tác Khảo Thí & Kiểm Định Quốc Tế',
            subtitle: 'Đồng hành xây dựng chuẩn mực đào tạo toàn cầu',
            partners: [
              {
                id: 'pt1',
                name: 'Cambridge Assessment',
                logoUrl: 'https://placehold.co/180x60/f8fafc/047857?text=Cambridge',
                websiteUrl: 'https://cambridge.org',
              },
              {
                id: 'pt2',
                name: 'International Baccalaureate',
                logoUrl: 'https://placehold.co/180x60/f8fafc/047857?text=IB+World',
                websiteUrl: 'https://ibo.org',
              },
              {
                id: 'pt3',
                name: 'Cognia Accreditation',
                logoUrl: 'https://placehold.co/180x60/f8fafc/047857?text=Cognia',
                websiteUrl: 'https://cognia.org',
              },
            ],
          },
        },
      ],
    },
    {
      id: 'sec-news',
      pageId: 'page-home',
      name: 'Tin tức & Hoạt động',
      sortOrder: 5,
      isVisible: true,
      settings: {
        layout: { width: 'container' as any },
      },
      blocks: [
        {
          id: 'blk-news',
          type: 'news_list',
          version: 1,
          sortOrder: 1,
          isActive: true,
          config: {
            title: 'Tin Tức & Hoạt Động Nhà Trường',
            subtitle: 'Cập nhật những chuyển động mới nhất trong đời sống học đường',
            limit: 3,
            layout: 'grid_3_cols',
            news: [
              {
                id: 'n1',
                title: 'Lễ Khai Giảng Năm Học 2025: Khát Vọng Vươn Tầm Quốc Tế',
                slug: 'le-khai-giang-nam-hoc-2025',
                excerpt: 'Thầy và trò Alpha School tưng bừng chào đón năm học mới với nhiều mục tiêu giáo dục đột phá.',
                imageUrl: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=800&auto=format&fit=crop',
                category: 'Sự kiện',
                publishedAt: '05/09/2026',
              },
              {
                id: 'n2',
                title: 'Học Sinh Alpha School Đạt Giải Nhất Cuộc Thi Sáng Tạo Robot Quốc Tế',
                slug: 'dat-giai-nhat-robot-quoc-te',
                excerpt: 'Đội tuyển Robotics trường xuất sắc vượt qua 50 đối thủ để bước lên bục vinh quang cao nhất.',
                imageUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=800&auto=format&fit=crop',
                category: 'Thành tích',
                publishedAt: '02/09/2026',
              },
              {
                id: 'n3',
                title: 'Hội Thảo Hướng Nghiệp & Học Bổng Du Học Các Đại Học Top 100 Thế Giới',
                slug: 'hoi-thao-huong-nghiep-2025',
                excerpt: 'Cơ hội giao lưu trực tiếp với đại diện tuyển sinh từ Anh, Mỹ, Úc và Canada.',
                imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=800&auto=format&fit=crop',
                category: 'Tuyển sinh',
                publishedAt: '28/08/2026',
              },
            ],
          },
        },
      ],
    },
    {
      id: 'sec-testimonials',
      pageId: 'page-home',
      name: 'Ý kiến phụ huynh & Cựu học sinh',
      sortOrder: 6,
      isVisible: true,
      settings: {
        layout: { width: 'container' as any },
      },
      blocks: [
        {
          id: 'blk-testimonials',
          type: 'testimonial_slider',
          version: 1,
          sortOrder: 1,
          isActive: true,
          config: {
            title: 'Chia Sẻ Của Phụ Huynh & Cựu Học Sinh',
            subtitle: 'Những cảm nhận chân thực về môi trường giáo dục song ngữ toàn diện tại Alpha School',
            items: [
              {
                id: 't-1',
                authorName: 'Chị Hoàng Thùy Linh',
                role: 'Phụ huynh học sinh',
                studentInfo: 'Mẹ bé Gia Hân - Lớp 5 Cambridge Cơ sở Biên Hòa',
                content: 'Gia đình rất an tâm khi gửi gắm con tại Alpha School. Sau 3 năm, con không chỉ nói tiếng Anh lưu loát mà tư duy phản biện và khả năng tự lập của con tiến bộ vượt bậc.',
                avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop',
                rating: 5,
              },
              {
                id: 't-2',
                authorName: 'Anh Phạm Quốc Huy',
                role: 'Phụ huynh học sinh',
                studentInfo: 'Bố bé Minh Đức - Lớp 10 Tú tài Cơ sở Thủ Đức',
                content: 'Chương trình Cambridge A-Level tại trường giúp con đạt điểm số rất cao và vừa nhận học bổng 70% từ Đại học Melbourne. Cảm ơn thầy cô đã luôn tận tụy đồng hành!',
                avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
                rating: 5,
              },
              {
                id: 't-3',
                authorName: 'Em Lê Mai Anh',
                role: 'Cựu học sinh niên khóa 2024',
                studentInfo: 'Thủ khoa A-Level - Sinh viên University of Toronto',
                content: 'Môi trường Alpha School đã cho em sự tự tin bước ra thế giới. Những dự án STEM và hoạt động tranh biện tại trường là hành trang quý giá nhất trong hành trình du học của em.',
                avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
                rating: 5,
              },
            ],
          },
        },
      ],
    },
    {
      id: 'sec-faq',
      pageId: 'page-home',
      name: 'Giải đáp thắc mắc thường gặp',
      sortOrder: 7,
      isVisible: true,
      settings: {
        layout: { width: 'container' as any },
      },
      blocks: [
        {
          id: 'blk-faq',
          type: 'faq_accordion',
          version: 1,
          sortOrder: 1,
          isActive: true,
          config: {
            title: 'Giải Đáp Thắc Mắc Thường Gặp',
            subtitle: 'Những thông tin quan trọng giúp Quý Phụ huynh hiểu rõ hơn về hệ thống và chương trình đào tạo',
            items: [
              {
                question: 'Nhà trường có dịch vụ xe bus đưa đón học sinh tận nhà không?',
                answer: 'Có, Alpha School cung cấp mạng lưới xe bus đưa đón tận nhà hoặc theo điểm đón tập trung tại tất cả các quận huyện thuộc địa bàn cơ sở với giám sát viên chuyên trách và định vị GPS báo về điện thoại phụ huynh.',
              },
              {
                question: 'Chế độ dinh dưỡng và bán trú tại trường được tổ chức thế nào?',
                answer: 'Bếp ăn chuẩn quốc tế HACCP chế biến tươi tại chỗ, cung cấp 3 bữa/ngày (sáng, trưa, xế) với thực đơn được các chuyên gia dinh dưỡng thiết kế cân bằng vi chất, thay đổi linh hoạt theo tuần.',
              },
              {
                question: 'Học sinh chuyển từ trường công lập sang có theo kịp chương trình tiếng Anh không?',
                answer: 'Nhà trường có các lớp bồi dưỡng tiếng Anh tăng cường (ESL Intensive) đầu năm học và đội ngũ giáo viên trợ giảng hỗ trợ kèm riêng để các em nhanh chóng bắt nhịp tự tin với bạn bè.',
              },
              {
                question: 'Chính sách học bổng dành cho học sinh mới như thế nào?',
                answer: 'Hằng năm Alpha School cấp quỹ học bổng Alpha Excellence trị giá 10 tỷ VNĐ với các mức 30%, 50% và 100% học phí dành cho các em học sinh có thành tích học tập và tài năng xuất sắc.',
              },
            ],
          },
        },
      ],
    },
    {
      id: 'sec-form-contact',
      pageId: 'page-home',
      name: 'Biểu mẫu tư vấn tuyển sinh',
      sortOrder: 8,
      isVisible: true,
      settings: {
        layout: { width: 'container' as any },
      },
      blocks: [
        {
          id: 'blk-home-form',
          type: 'form_embed',
          version: 1,
          sortOrder: 1,
          isActive: true,
          config: {
            title: 'Đăng Ký Nhận Cẩm Nang Tuyển Sinh & Tư Vấn 2025 - 2026',
            subtitle: 'Để lại thông tin để chuyên viên tuyển sinh cơ sở gần nhất liên hệ giải đáp chi tiết trong vòng 24 giờ',
            formCode: 'tuyen-sinh-2025',
            submitButtonText: 'Gửi thông tin đăng ký',
            showBranchSelect: true,
          },
        },
      ],
    },
  ],
};

export default function HomePage() {
  return <DynamicPageRenderer page={mockHomePageData} />;
}
