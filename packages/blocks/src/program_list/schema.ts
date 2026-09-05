import { z } from 'zod';

export const ProgramItemSchema = z.object({
  id: z.string().default('p1'),
  title: z.string().default('Khối Tiểu học Cambridge'),
  gradeLevel: z.string().default('Lớp 1 - Lớp 5'),
  description: z.string().default('Chương trình song ngữ phát triển tư duy toàn diện và năng lực tiếng Anh bản ngữ.'),
  imageUrl: z.string().default('https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=800&auto=format&fit=crop'),
  detailUrl: z.string().default('/chuong-trinh-hoc/tieu-hoc'),
});

export const ProgramListSchema = z.object({
  title: z.string().default('Chương Trình Giáo Dục Toàn Diện'),
  subtitle: z.string().default('Lộ trình học tập chuẩn mực từ Mầm non đến Trung học phổ thông'),
  columns: z.enum(['2', '3', '4']).default('3'),
  programs: z.array(ProgramItemSchema).default([
    {
      id: 'p1',
      title: 'Mầm non Song ngữ Quốc tế',
      gradeLevel: '18 tháng - 5 tuổi',
      description: 'Phương pháp giáo dục sớm lấy trẻ làm trung tâm, khơi dậy niềm đam mê học hỏi tự nhiên.',
      imageUrl: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?q=80&w=800&auto=format&fit=crop',
      detailUrl: '/chuong-trinh-hoc/mam-non',
    },
    {
      id: 'p2',
      title: 'Tiểu học Quốc tế Cambridge',
      gradeLevel: 'Lớp 1 - Lớp 5',
      description: 'Nền tảng học thuật vững chắc kết hợp rèn luyện kỹ năng thế kỷ 21 và thể chất chuẩn mực.',
      imageUrl: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=800&auto=format&fit=crop',
      detailUrl: '/chuong-trinh-hoc/tieu-hoc',
    },
    {
      id: 'p3',
      title: 'Trung học Cơ sở & Phổ thông',
      gradeLevel: 'Lớp 6 - Lớp 12',
      description: 'Định hướng nghề nghiệp và chuẩn bị hành trang săn học bổng du học các đại học danh tiếng.',
      imageUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=800&auto=format&fit=crop',
      detailUrl: '/chuong-trinh-hoc/trung-hoc',
    },
  ]),
});

export type ProgramListConfig = z.infer<typeof ProgramListSchema>;
export const defaultProgramListConfig: ProgramListConfig = ProgramListSchema.parse({});
