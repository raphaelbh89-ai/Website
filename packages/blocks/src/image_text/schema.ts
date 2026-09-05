import { z } from 'zod';

export const ImageTextFeatureItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
});

export const ImageTextStatsBadgeSchema = z.object({
  number: z.string(),
  label: z.string(),
});

export const ImageTextSchema = z.object({
  badge: z.string().default('VỀ ALPHA SCHOOL'),
  title: z.string().default('Môi Trường Giáo Dục Truyền Cảm Hứng & Nuôi Dưỡng Khát Vọng'),
  description: z.string().default('Được thành lập với sứ mệnh tiên phong đổi mới giáo dục, Alpha School xây dựng hệ sinh thái học tập toàn diện từ Mầm non đến Trung học phổ thông, chuẩn bị hành trang vững vàng cho thế hệ trẻ tự tin hội nhập quốc tế.'),
  imageUrl: z.string().url().default('https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=1200&auto=format&fit=crop'),
  imagePosition: z.enum(['left', 'right']).default('left'),
  statsBadge: ImageTextStatsBadgeSchema.optional(),
  features: z.array(ImageTextFeatureItemSchema).default([]),
  primaryButtonText: z.string().default('Khám Phá Chương Trình'),
  primaryButtonUrl: z.string().default('/chuong-trinh-dao-tao'),
  secondaryButtonText: z.string().optional(),
  secondaryButtonUrl: z.string().optional(),
});

export type ImageTextFeatureItem = z.infer<typeof ImageTextFeatureItemSchema>;
export type ImageTextStatsBadge = z.infer<typeof ImageTextStatsBadgeSchema>;
export type ImageTextConfig = z.infer<typeof ImageTextSchema>;

export const defaultImageTextConfig: ImageTextConfig = {
  badge: 'VỀ ALPHA SCHOOL',
  title: 'Môi Trường Giáo Dục Truyền Cảm Hứng & Nuôi Dưỡng Khát Vọng',
  description: 'Được thành lập với sứ mệnh tiên phong đổi mới giáo dục, Alpha School xây dựng hệ sinh thái học tập toàn diện từ Mầm non đến Trung học phổ thông, chuẩn bị hành trang vững vàng cho thế hệ trẻ tự tin hội nhập quốc tế.',
  imageUrl: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=1200&auto=format&fit=crop',
  imagePosition: 'left',
  statsBadge: {
    number: '15+',
    label: 'Năm đồng hành cùng 50.000+ học sinh',
  },
  features: [
    {
      id: 'feat-1',
      title: 'Đội ngũ giáo viên chuyên gia',
      description: '100% giáo viên đạt chuẩn quốc tế, giàu lòng yêu nghề và thấu hiểu tâm lý lứa tuổi.',
    },
    {
      id: 'feat-2',
      title: 'Cơ sở vật chất chuẩn sinh thái',
      description: 'Khuôn viên xanh rợp bóng cây, phòng học thông minh tích hợp công nghệ tương tác hiện đại.',
    },
    {
      id: 'feat-3',
      title: 'Học tập trải nghiệm thực tế',
      description: 'Các dự án STEM, dã ngoại sinh thái và hoạt động thiện nguyện tổ chức hàng tháng.',
    },
  ],
  primaryButtonText: 'Khám Phá Chương Trình',
  primaryButtonUrl: '/chuong-trinh-dao-tao',
  secondaryButtonText: 'Đăng Ký Tham Quan Trường',
  secondaryButtonUrl: '/tuyen-sinh',
};
