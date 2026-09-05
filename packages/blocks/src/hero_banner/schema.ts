import { z } from 'zod';

export const HeroBannerSchema = z.object({
  title: z.string().min(1).default('Kiến tạo tương lai cùng Alpha School'),
  subtitle: z.string().default('Hệ thống giáo dục liên cấp song ngữ chuẩn quốc tế hàng đầu'),
  primaryButtonText: z.string().default('Đăng ký tư vấn tuyển sinh'),
  primaryButtonUrl: z.string().default('/tuyen-sinh'),
  secondaryButtonText: z.string().optional().default('Tìm hiểu các cơ sở'),
  secondaryButtonUrl: z.string().optional().default('/co-so'),
  backgroundImageUrl: z.string().optional().default('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1920&auto=format&fit=crop'),
  overlayOpacity: z.number().min(0).max(1).default(0.4),
  textAlignment: z.enum(['left', 'center', 'right']).default('center'),
});

export type HeroBannerConfig = z.infer<typeof HeroBannerSchema>;

export const defaultHeroBannerConfig: HeroBannerConfig = HeroBannerSchema.parse({});
