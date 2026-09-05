import React from 'react';
import { Page, ContentStatus } from '@school-cms/shared';
import { buildSchoolJsonLd, buildFaqJsonLd } from '@school-cms/seo';
import { DynamicPageRenderer } from '../components/DynamicPageRenderer';
import { defaultRichTextConfig } from '@school-cms/blocks';
import { defaultImageTextConfig } from '@school-cms/blocks';
import { defaultVideoPlayerConfig } from '@school-cms/blocks';
import { defaultGoogleMapConfig } from '@school-cms/blocks';

// Trang chủ được nạp dữ liệu từ CMS / Page JSON với đầy đủ 16 khối chuẩn
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
            primaryButtonText: 'Đăng ký nhận học bổng 2026',
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
      id: 'sec-rich-text',
      pageId: 'page-home',
      name: 'Triết lý giáo dục & Cam kết',
      sortOrder: 4,
      isVisible: true,
      settings: {
        layout: { width: 'container' as any },
      },
      blocks: [
        {
          id: 'blk-rich-text',
          type: 'rich_text',
          version: 1,
          sortOrder: 1,
          isActive: true,
          config: defaultRichTextConfig,
        },
      ],
    },
    {
      id: 'sec-image-text',
      pageId: 'page-home',
      name: 'Không gian học tập truyền cảm hứng',
      sortOrder: 5,
      isVisible: true,
      settings: {
        layout: { width: 'container' as any },
      },
      blocks: [
        {
          id: 'blk-image-text',
          type: 'image_text',
          version: 1,
          sortOrder: 1,
          isActive: true,
          config: defaultImageTextConfig,
        },
      ],
    },
    {
      id: 'sec-branches',
      pageId: 'page-home',
      name: 'Hệ thống cơ sở',
      sortOrder: 6,
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
      id: 'sec-news',
      pageId: 'page-home',
      name: 'Tin tức & Sự kiện',
      sortOrder: 7,
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
            title: 'Tin Tức & Hoạt Động Nổi Bật',
            subtitle: 'Cập nhật những chuyển động mới nhất từ đời sống học đường và thành tích của học sinh',
            limit: 3,
            layout: 'grid_3_cols',
            news: [
              {
                id: 'art-1',
                title: 'Lễ Khai Giảng Năm Học 2025: Khát Vọng Vươn Tầm Quốc Tế',
                excerpt: 'Hơn 5000 học sinh trên toàn hệ thống Alpha School hân hoan bước vào năm học mới.',
                slug: 'le-khai-giang-2025',
                imageUrl: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=800&auto=format&fit=crop',
                category: 'Sự kiện trường học',
                publishedAt: '05/09/2026',
              },
              {
                id: 'art-2',
                title: 'Học Sinh Alpha School Đạt Huy Chương Vàng Olympic Khoa Học Trẻ Châu Á',
                excerpt: 'Đội tuyển Alpha School xuất sắc mang về 3 Huy chương Vàng và 1 giải Sáng tạo đặc biệt.',
                slug: 'hcv-olympic-khoa-hoc-chau-a',
                imageUrl: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?q=80&w=800&auto=format&fit=crop',
                category: 'Thành tích học sinh',
                publishedAt: '02/09/2026',
              },
              {
                id: 'art-3',
                title: 'Hội Thảo Du Học & Định Hướng Nghề Nghiệp Tương Lai 2026',
                excerpt: 'Cơ hội kết nối trực tiếp cùng đại diện hơn 30 trường Đại học danh tiếng thế giới.',
                slug: 'hoi-thao-du-hoc-2026',
                imageUrl: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=800&auto=format&fit=crop',
                category: 'Tuyển sinh & Hướng nghiệp',
                publishedAt: '28/08/2026',
              },
            ],
          },
        },
      ],
    },
    {
      id: 'sec-video-player',
      pageId: 'page-home',
      name: 'Thước phim giới thiệu Alpha School',
      sortOrder: 8,
      isVisible: true,
      settings: {
        layout: { width: 'full_width' as any },
      },
      blocks: [
        {
          id: 'blk-video-player',
          type: 'video_player',
          version: 1,
          sortOrder: 1,
          isActive: true,
          config: defaultVideoPlayerConfig,
        },
      ],
    },
    {
      id: 'sec-partners',
      pageId: 'page-home',
      name: 'Đối tác chiến lược',
      sortOrder: 9,
      isVisible: true,
      settings: {
        layout: { width: 'container' as any },
      },
      blocks: [
        {
          id: 'blk-partners',
          type: 'partner_slider',
          version: 1,
          sortOrder: 1,
          isActive: true,
          config: {
            title: 'Đối Tác Giáo Dục Chiến Lược Toàn Cầu',
            subtitle: 'Đồng hành cùng các tổ chức khảo thí và tập đoàn công nghệ hàng đầu thế giới',
            autoplay: true,
            partners: [
              { id: 'part-1', name: 'Cambridge Assessment International Education', logoUrl: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?q=80&w=300&auto=format&fit=crop' },
              { id: 'part-2', name: 'Microsoft Education Showcase School', logoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=300&auto=format&fit=crop' },
              { id: 'part-3', name: 'British Council Official IELTS Test Centre', logoUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=300&auto=format&fit=crop' },
              { id: 'part-4', name: 'Apple Distinguished School Partner', logoUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=300&auto=format&fit=crop' },
            ],
          },
        },
      ],
    },
    {
      id: 'sec-gallery',
      pageId: 'page-home',
      name: 'Thư viện hình ảnh học đường',
      sortOrder: 10,
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
            title: 'Thư Viện Hình Ảnh & Hoạt Động Học Đường',
            subtitle: 'Ghi lại những hành trình học tập, trải nghiệm và trưởng thành đầy tự hào của các thế hệ học sinh.',
            columns: '4',
            categories: ['Tất cả', 'Học thuật & STEM', 'Cơ sở vật chất', 'Hoạt động ngoại khóa', 'Lễ hội & Tốt nghiệp'],
            images: [
              {
                id: 'gal-1',
                title: 'Giờ Học STEM & Lập Trình Robot VEX',
                category: 'Học thuật & STEM',
                imageUrl: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?q=80&w=800&auto=format&fit=crop',
                caption: 'Học sinh cấp 2 nghiên cứu mô hình robot phục vụ dự án khoa học quốc tế.',
              },
              {
                id: 'gal-2',
                title: 'Hồ Bơi Bốn Mùa Chuẩn Olympic',
                category: 'Cơ sở vật chất',
                imageUrl: 'https://images.unsplash.com/photo-1576610616656-d3aa5d1f4534?q=80&w=800&auto=format&fit=crop',
                caption: 'Khu phức hợp thể thao dưới nước với hệ thống lọc muối khoáng thông minh.',
              },
              {
                id: 'gal-3',
                title: 'Hội Diễn Nghệ Thuật Mùa Xuân',
                category: 'Hoạt động ngoại khóa',
                imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=800&auto=format&fit=crop',
                caption: 'Các tiết mục hòa tấu nhạc kịch do chính các em học sinh dàn dựng và biểu diễn.',
              },
              {
                id: 'gal-4',
                title: 'Lễ Tốt Nghiệp Niên Khóa 2025',
                category: 'Lễ hội & Tốt nghiệp',
                imageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=800&auto=format&fit=crop',
                caption: 'Khoảnh khắc tung mũ cử nhân rạng rỡ của tân tú tài Alpha School.',
              },
            ],
          },
        },
      ],
    },
    {
      id: 'sec-testimonials',
      pageId: 'page-home',
      name: 'Cảm nhận phụ huynh',
      sortOrder: 11,
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
            title: 'Phụ Huynh & Học Sinh Nói Gì Về Alpha School',
            subtitle: 'Những chia sẻ chân thực từ cộng đồng phụ huynh đã tin tưởng đồng hành cùng nhà trường',
            testimonials: [
              {
                id: 't-1',
                authorName: 'Chị Nguyễn Thanh Hương',
                authorRole: 'Phụ huynh bé Gia Bảo (Lớp 3 Cơ sở Biên Hòa)',
                content: 'Tôi rất ấn tượng với phương pháp giáo dục khơi gợi tính tự chủ tại trường. Con hào hứng đi học mỗi ngày và khả năng giao tiếp tiếng Anh tự tin vượt bậc.',
                avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop',
                rating: 5,
              },
              {
                id: 't-2',
                authorName: 'Anh Trần Minh Trí',
                authorRole: 'Phụ huynh em Bảo Anh (Lớp 11 Song ngữ Sala)',
                content: 'Chương trình A-Level tại Alpha School rất chất lượng. Thầy cô giáo tận tâm và đội ngũ cố vấn du học đã hỗ trợ con tôi săn thành công học bổng 70% tại Đại học Melbourne.',
                avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&auto=format&fit=crop',
                rating: 5,
              },
            ],
          },
        },
      ],
    },
    {
      id: 'sec-cta-banner',
      pageId: 'page-home',
      name: 'Banner tuyển sinh',
      sortOrder: 12,
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
            badge: 'TUYỂN SINH NĂM HỌC 2026 - 2027',
            title: 'Sẵn Sàng Cho Con Bước Vào Hành Trình Khai Phóng Tri Thức?',
            subtitle: 'Đăng ký tham quan trực tiếp các cơ sở trường học và nhận ngay học bổng tài năng Early Bird trị giá lên đến 20% học phí trọn năm.',
            primaryButtonText: 'Đăng Ký Tham Quan Cơ Sở',
            primaryButtonUrl: '#dang-ky',
            secondaryButtonText: 'Tải Cẩm Nang Biểu Phí',
            secondaryButtonUrl: '/bieu-phi-2026.pdf',
            hotline: '1900 8888',
            email: 'tuyensinh@school.edu.vn',
            theme: 'primary',
          },
        },
      ],
    },
    {
      id: 'sec-faq',
      pageId: 'page-home',
      name: 'Hỏi đáp thường gặp',
      sortOrder: 13,
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
            title: 'Câu Hỏi Thường Gặp Về Tuyển Sinh & Học Tập',
            subtitle: 'Giải đáp những thắc mắc phổ biến của Phụ huynh khi tìm hiểu về môi trường học tập tại Alpha School',
            items: [
              {
                id: 'faq-1',
                question: 'Trường có tổ chức thi đầu vào hay xét tuyển học bạ?',
                answer: 'Nhà trường kết hợp đánh giá năng lực tư duy, khảo sát phản xạ ngôn ngữ tiếng Anh phù hợp từng lứa tuổi và phỏng vấn trực tiếp với Ban giám hiệu.',
              },
              {
                id: 'faq-2',
                question: 'Thời gian biểu và chương trình bán trú của học sinh như thế nào?',
                answer: 'Học sinh học từ 07:45 đến 16:30 từ Thứ Hai đến Thứ Sáu. Nhà trường phục vụ bữa sáng nhẹ, bữa trưa dinh dưỡng chuẩn hữu cơ và bữa xế chiều.',
              },
              {
                id: 'faq-3',
                question: 'Trường có xe bus đưa đón học sinh tận nhà không?',
                answer: 'Hệ thống xe bus hiện đại có giám thị đi kèm phục vụ hơn 20 tuyến đưa đón khắp các quận huyện tại TP.HCM, Biên Hòa và Bình Dương.',
              },
            ],
          },
        },
      ],
    },
    {
      id: 'sec-google-map',
      pageId: 'page-home',
      name: 'Bản đồ định vị cơ sở toàn quốc',
      sortOrder: 14,
      isVisible: true,
      settings: {
        layout: { width: 'full_width' as any },
      },
      blocks: [
        {
          id: 'blk-google-map',
          type: 'google_map',
          version: 1,
          sortOrder: 1,
          isActive: true,
          config: defaultGoogleMapConfig,
        },
      ],
    },
    {
      id: 'sec-contact-box',
      pageId: 'page-home',
      name: 'Khối liên hệ đa cơ sở',
      sortOrder: 15,
      isVisible: true,
      settings: {
        layout: { width: 'full_width' as any },
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
      sortOrder: 16,
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
            title: 'Đăng Ký Nhận Cẩm Nang Tuyển Sinh & Tư Vấn 2026 - 2027',
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
