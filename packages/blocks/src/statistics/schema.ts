import { z } from 'zod';

export const StatisticItemSchema = z.object({
  id: z.string().default('stat-1'),
  label: z.string().default('Tỷ Lệ Đỗ Đại Học'),
  value: z.string().default('100'),
  suffix: z.string().default('%'),
  icon: z.string().default('🎓'),
  description: z.string().default('Trúng tuyển nguyện vọng 1 các đại học hàng đầu trong & ngoài nước'),
});

export const StatisticsSchema = z.object({
  badge: z.string().default('THÀNH TỰU NỔI BẬT'),
  title: z.string().default('Những Con Số Ấn Tượng Của Alpha School'),
  subtitle: z.string().default('Hành trình hơn 15 năm kiến tạo nền tảng giáo dục chuẩn quốc tế và đồng hành cùng thế hệ công dân toàn cầu'),
  layout: z.enum(['grid_4_cols', 'grid_3_cols', 'horizontal_cards']).default('grid_4_cols'),
  theme: z.enum(['emerald', 'navy', 'dark']).default('emerald'),
  items: z.array(StatisticItemSchema).default([
    {
      id: 'stat-1',
      label: 'Tỷ Lệ Đỗ Đại Học',
      value: '100',
      suffix: '%',
      icon: '🎓',
      description: 'Học sinh trúng tuyển vào các trường đại học danh tiếng tại Việt Nam và Thế giới',
    },
    {
      id: 'stat-2',
      label: 'Năm Phát Triển Bền Vững',
      value: '15',
      suffix: '+',
      icon: '🏛️',
      description: 'Tiên phong trong phương pháp đào tạo song ngữ và phát triển kỹ năng toàn diện',
    },
    {
      id: 'stat-3',
      label: 'Giải Thưởng Quốc Tế',
      value: '50',
      suffix: '+',
      icon: '🏆',
      description: 'Huy chương Vàng & Bạc tại các kỳ thi Olympic Toán, Khoa học & Tranh biện',
    },
    {
      id: 'stat-4',
      label: 'Học Sinh Đang Theo Học',
      value: '5000',
      suffix: '+',
      icon: '🌟',
      description: 'Cộng đồng học sinh tài năng, tự tin và giàu lòng nhân ái trên toàn hệ thống',
    },
  ]),
});

export type StatisticsConfig = z.infer<typeof StatisticsSchema>;
export const defaultStatisticsConfig: StatisticsConfig = StatisticsSchema.parse({});
