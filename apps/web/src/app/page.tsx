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
  ],
};

export default function HomePage() {
  return <DynamicPageRenderer page={mockHomePageData} />;
}
