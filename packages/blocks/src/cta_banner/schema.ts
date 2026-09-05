import { z } from 'zod';

export const CtaBannerSchema = z.object({
  badge: z.string().default('TUYỂN SINH NĂM HỌC 2025 - 2026'),
  title: z.string().default('Đăng Ký Tham Quan Trường & Nhận Học Bổng Lên Đến 50%'),
  subtitle: z.string().default('Trải nghiệm không gian học tập xanh mát, trao đổi trực tiếp cùng Ban Giám hiệu và nhận ngay gói học bổng tài năng.'),
  primaryButtonText: z.string().default('Đăng ký tham quan ngay'),
  primaryButtonUrl: z.string().default('/tuyen-sinh'),
  secondaryButtonText: z.string().default('Tải cẩm nang tuyển sinh'),
  secondaryButtonUrl: z.string().default('/tuyen-sinh'),
  hotline: z.string().default('1900 8888'),
  email: z.string().default('tuyensinh@school.edu.vn'),
  bgGradient: z.enum(['emerald', 'navy', 'sunset', 'dark']).default('emerald'),
  showFloatingBadges: z.boolean().default(true),
});

export type CtaBannerConfig = z.infer<typeof CtaBannerSchema>;
export const defaultCtaBannerConfig: CtaBannerConfig = CtaBannerSchema.parse({});
