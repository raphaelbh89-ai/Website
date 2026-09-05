import { z } from 'zod';

export const TestimonialItemSchema = z.object({
  id: z.string(),
  authorName: z.string(),
  role: z.string(), // 'Phụ huynh học sinh' | 'Cựu học sinh'
  studentInfo: z.string(), // 'Phụ huynh bé Minh Khang - Lớp 3 Cambridge'
  content: z.string(),
  avatarUrl: z.string(),
  rating: z.number().min(1).max(5).default(5),
});

export const TestimonialSliderSchema = z.object({
  title: z.string().default('Chia Sẻ Của Phụ Huynh & Học Sinh'),
  subtitle: z.string().default('Những cảm nhận chân thực về môi trường giáo dục song ngữ toàn diện tại Alpha School'),
  items: z.array(TestimonialItemSchema).default([
    {
      id: 'testi-1',
      authorName: 'Chị Hoàng Thùy Linh',
      role: 'Phụ huynh học sinh',
      studentInfo: 'Mẹ bé Gia Hân - Lớp 5 Cambridge Cơ sở Biên Hòa',
      content: 'Gia đình rất an tâm khi gửi gắm con tại Alpha School. Sau 3 năm, con không chỉ nói tiếng Anh lưu loát mà tư duy phản biện và khả năng tự lập của con tiến bộ vượt bậc.',
      avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop',
      rating: 5,
    },
    {
      id: 'testi-2',
      authorName: 'Anh Phạm Quốc Huy',
      role: 'Phụ huynh học sinh',
      studentInfo: 'Bố bé Minh Đức - Lớp 10 Tú tài Cơ sở Thủ Đức',
      content: 'Chương trình Cambridge A-Level tại trường giúp con đạt điểm số rất cao và vừa nhận học bổng 70% từ Đại học Melbourne. Cảm ơn thầy cô đã luôn tận tụy đồng hành!',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
      rating: 5,
    },
    {
      id: 'testi-3',
      authorName: 'Em Lê Mai Anh',
      role: 'Cựu học sinh niên khóa 2024',
      studentInfo: 'Thủ khoa A-Level - Sinh viên University of Toronto',
      content: 'Môi trường Alpha School đã cho em sự tự tin bước ra thế giới. Những dự án STEM và hoạt động tranh biện tại trường là hành trang quý giá nhất trong hành trình du học của em.',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
      rating: 5,
    },
  ]),
});

export type TestimonialSliderConfig = z.infer<typeof TestimonialSliderSchema>;
export const defaultTestimonialSliderConfig: TestimonialSliderConfig = TestimonialSliderSchema.parse({});
