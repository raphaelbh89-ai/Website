import React from 'react';
import { Page, ContentStatus } from '@school-cms/shared';
import { buildSchoolJsonLd, buildFaqJsonLd } from '@school-cms/seo';
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
      id: 'sec-statistics',
      pageId: 'page-home',
      name: 'Con số ấn tượng',
      sortOrder: 3,
      isVisible: true,
      settings: {
        layout: { width: 'full_width' as any },
      },
      blocks: [
        {
          id: 'blk-statistics',
          type: 'statistics',
          version: 1,
          sortOrder: 1,
          isActive: true,
          config: {
            badge: 'THÀNH TỰU ĐÀO TẠO NỔI BẬT',
            title: 'Những Con Số Ấn Tượng Của Alpha School',
            subtitle: 'Hành trình hơn 15 năm kiến tạo nền tảng giáo dục chuẩn quốc tế và đồng hành cùng 5000+ học sinh xuất sắc',
            layout: 'grid_4_cols',
            theme: 'emerald',
            items: [
              {
                id: 'stat-1',
                label: 'Tỷ Lệ Đỗ Đại Học Hàng Đầu',
                value: '100',
                suffix: '%',
                icon: '🎓',
                description: 'Học sinh trúng tuyển nguyện vọng 1 vào các đại học danh tiếng trong nước & du học',
              },
              {
                id: 'stat-2',
                label: 'Năm Phát Triển Bền Vững',
                value: '15',
                suffix: '+',
                icon: '🏛️',
                description: 'Tiên phong trong đào tạo song ngữ và nuôi dưỡng năng lực tư duy khai phóng',
              },
              {
                id: 'stat-3',
                label: 'Giải Thưởng Quốc Tế',
                value: '50',
                suffix: '+',
                icon: '🏆',
                description: 'Huy chương Vàng & Bạc tại các kỳ thi Olympic Toán học, Khoa học & Tranh biện thế giới',
              },
              {
                id: 'stat-4',
                label: 'Học Sinh Đang Theo Học',
                value: '5000',
                suffix: '+',
                icon: '🌟',
                description: 'Cộng đồng học sinh tự tin, sáng tạo và sẵn sàng hội nhập toàn cầu',
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
      sortOrder: 4,
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
      sortOrder: 5,
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
      sortOrder: 6,
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
      id: 'sec-gallery',
      pageId: 'page-home',
      name: 'Thư viện hình ảnh hoạt động',
      sortOrder: 7,
      isVisible: true,
      settings: {
        layout: { width: 'full_width' as any },
      },
      blocks: [
        {
          id: 'blk-gallery',
          type: 'gallery',
          version: 1,
          sortOrder: 1,
          isActive: true,
          config: {
            badge: 'KHOẢNH KHẮC ALPHA',
            title: 'Thư Viện Hình Ảnh & Đời Sống Học Đường',
            subtitle: 'Ghi lại những hành trình học tập, trải nghiệm và trưởng thành đầy tự hào của các thế hệ học sinh.',
            columns: '4',
            categories: ['Tất cả', 'Hoạt động ngoại khóa', 'Cơ sở vật chất', 'Học thuật & STEM', 'Lễ hội & Tốt nghiệp'],
            images: [
              {
                id: 'gal-1',
                title: 'Giờ Học STEM & Lập Trình Robot VEX',
                category: 'Học thuật & STEM',
                imageUrl: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?q=80&w=800&auto=format&fit=crop',
                caption: 'Học sinh cấp 2 hào hứng nghiên cứu mô hình robot phục vụ dự án khoa học quốc tế.',
              },
              {
                id: 'gal-2',
                title: 'Hồ Bơi Bốn Mùa Chuẩn Olympic',
                category: 'Cơ sở vật chất',
                imageUrl: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?q=80&w=800&auto=format&fit=crop',
                caption: 'Khu liên hợp thể thao dưới nước với hệ thống lọc nước ozone hiện đại.',
              },
              {
                id: 'gal-3',
                title: 'Giải Bóng Đá Giao Hữu Alpha Cup',
                category: 'Hoạt động ngoại khóa',
                imageUrl: 'https://images.unsplash.com/photo-1526232761682-d26e03ac148e?q=80&w=800&auto=format&fit=crop',
                caption: 'Rèn luyện thể lực và tinh thần đồng đội qua các giải thi đấu thể thao thường niên.',
              },
              {
                id: 'gal-4',
                title: 'Lễ Tốt Nghiệp Tú Tài Quốc Tế A-Level',
                category: 'Lễ hội & Tốt nghiệp',
                imageUrl: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=800&auto=format&fit=crop',
                caption: 'Khoảnh khắc rạng rỡ của tân cử nhân Alpha School trước thềm du học thế giới.',
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
      sortOrder: 8,
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
      sortOrder: 9,
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
      id: 'sec-cta',
      pageId: 'page-home',
      name: 'Banner kêu gọi tuyển sinh',
      sortOrder: 10,
      isVisible: true,
      settings: {
        layout: { width: 'full_width' as any },
      },
      blocks: [
        {
          id: 'blk-cta-banner',
          type: 'cta_banner',
          version: 1,
          sortOrder: 1,
          isActive: true,
          config: {
            badge: 'TUYỂN SINH NIÊN KHÓA 2025 - 2026',
            title: 'Đăng Ký Tham Quan Trường & Nhận Học Bổng Lên Đến 50%',
            subtitle: 'Trải nghiệm không gian học tập hiện đại chuẩn quốc tế, giao lưu cùng đội ngũ giáo viên nước ngoài và nhận ngay cẩm nang tuyển sinh chi tiết.',
            primaryButtonText: 'Đăng ký tham quan ngay',
            primaryButtonUrl: '/tuyen-sinh',
            secondaryButtonText: 'Tải cẩm nang tuyển sinh',
            secondaryButtonUrl: '/tin-tuc',
            hotline: '1900 8888',
            email: 'tuyensinh@school.edu.vn',
            bgGradient: 'emerald',
            showFloatingBadges: true,
          },
        },
      ],
    },
    {
      id: 'sec-contact-box',
      pageId: 'page-home',
      name: 'Khối liên hệ trực tiếp các cơ sở',
      sortOrder: 11,
      isVisible: true,
      settings: {
        layout: { width: 'container' as any },
      },
      blocks: [
        {
          id: 'blk-contact-box',
          type: 'contact_box',
          version: 1,
          sortOrder: 1,
          isActive: true,
          config: {
            badge: 'LIÊN HỆ TRỰC TIẾP',
            title: 'Hệ Thống Cơ Sở & Kênh Tư Vấn Tuyển Sinh',
            subtitle: 'Quý Phụ huynh có thể ghé thăm trực tiếp các cơ sở hoặc liên hệ ban tuyển sinh để được hỗ trợ chu đáo nhất.',
            centralHotline: '1900 8888',
            centralEmail: 'tuyensinh@school.edu.vn',
            layout: 'grid_3_cols',
            branches: [
              {
                id: 'cb-1',
                branchName: 'Alpha School - Cơ sở Biên Hòa',
                address: 'Số 123 Đường Nguyễn Ái Quốc, TP. Biên Hòa, Tỉnh Đồng Nai',
                phone: '0251 123 4567',
                email: 'bienhoa@school.edu.vn',
                workingHours: 'Thứ 2 - Thứ 7: 07:30 - 17:30',
                mapEmbedUrl: 'https://maps.google.com/?q=Bien+Hoa',
                isPrimary: true,
              },
              {
                id: 'cb-2',
                branchName: 'Alpha School - Cơ sở TP. Thủ Đức',
                address: 'Khu đô thị Sala, TP. Thủ Đức, TP. Hồ Chí Minh',
                phone: '028 987 6543',
                email: 'thuduc@school.edu.vn',
                workingHours: 'Thứ 2 - Thứ 7: 07:30 - 17:30',
                mapEmbedUrl: 'https://maps.google.com/?q=Sala+Thu+Duc',
                isPrimary: false,
              },
              {
                id: 'cb-3',
                branchName: 'Alpha School - Cơ sở Bình Dương',
                address: 'Đại lộ Bình Dương, TP. Thủ Dầu Một, Tỉnh Bình Dương',
                phone: '0274 333 8888',
                email: 'binhduong@school.edu.vn',
                workingHours: 'Thứ 2 - Thứ 7: 07:30 - 17:30',
                mapEmbedUrl: 'https://maps.google.com/?q=Binh+Duong',
                isPrimary: false,
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
      sortOrder: 12,
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
  const schoolJsonLd = buildSchoolJsonLd(null);
  const faqBlock = mockHomePageData.sections
    .flatMap((s) => s.blocks)
    .find((b) => b.type === 'faq_accordion');
  const faqItems = (faqBlock?.config as any)?.items || [];
  const faqJsonLd = buildFaqJsonLd(faqItems);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schoolJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <DynamicPageRenderer page={mockHomePageData} />
    </>
  );
}
