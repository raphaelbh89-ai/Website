import { z } from 'zod';

export const NewsItemSchema = z.object({
  id: z.string().default('n1'),
  title: z.string().default('Lễ Khai Giảng Năm Học 2025: Khát Vọng Vươn Tầm Quốc Tế'),
  slug: z.string().default('le-khai-giang-nam-hoc-2025'),
  excerpt: z.string().default('Thầy và trò Alpha School tưng bừng chào đón năm học mới với nhiều mục tiêu đột phá.'),
  imageUrl: z.string().default('https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=800&auto=format&fit=crop'),
  category: z.string().default('Tin tức & Sự kiện'),
  publishedAt: z.string().default('05/09/2026'),
});

export const NewsListSchema = z.object({
  title: z.string().default('Tin Tức & Hoạt Động Nổi Bật'),
  subtitle: z.string().default('Cập nhật những chuyển động mới nhất trong đời sống học đường'),
  limit: z.number().min(1).max(12).default(3),
  layout: z.enum(['grid_3_cols', 'grid_4_cols', 'list']).default('grid_3_cols'),
  news: z.array(NewsItemSchema).default([
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
  ]),
});

export type NewsListConfig = z.infer<typeof NewsListSchema>;
export const defaultNewsListConfig: NewsListConfig = NewsListSchema.parse({});
