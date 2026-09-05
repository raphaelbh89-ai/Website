import { z } from 'zod';

export const VideoChapterSchema = z.object({
  id: z.string(),
  time: z.string(),
  title: z.string(),
});

export const VideoPlayerSchema = z.object({
  badge: z.string().default('VIDEO GIỚI THIỆU'),
  title: z.string().default('Khám Phá Không Gian Giáo Dục Hiện Đại Alpha School'),
  subtitle: z.string().default('Thước phim chân thực ghi lại hành trình học tập đầy cảm hứng, cơ sở vật chất chuẩn quốc tế và tinh thần sáng tạo của thầy trò.'),
  videoSource: z.enum(['youtube', 'vimeo', 'direct']).default('youtube'),
  videoUrl: z.string().url().default('https://www.youtube.com/watch?v=ScMzIvxBSi4'),
  posterUrl: z.string().url().default('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1920&auto=format&fit=crop'),
  duration: z.string().default('03:45'),
  aspectRatio: z.enum(['16:9', '4:3', '21:9']).default('16:9'),
  showChapters: z.boolean().default(true),
  chapters: z.array(VideoChapterSchema).default([]),
});

export type VideoChapter = z.infer<typeof VideoChapterSchema>;
export type VideoPlayerConfig = z.infer<typeof VideoPlayerSchema>;

export const defaultVideoPlayerConfig: VideoPlayerConfig = {
  badge: 'VIDEO GIỚI THIỆU',
  title: 'Khám Phá Không Gian Giáo Dục Hiện Đại Alpha School',
  subtitle: 'Thước phim chân thực ghi lại hành trình học tập đầy cảm hứng, cơ sở vật chất chuẩn quốc tế và tinh thần sáng tạo của thầy trò.',
  videoSource: 'youtube',
  videoUrl: 'https://www.youtube.com/watch?v=ScMzIvxBSi4',
  posterUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1920&auto=format&fit=crop',
  duration: '04:15',
  aspectRatio: '16:9',
  showChapters: true,
  chapters: [
    { id: 'ch-1', time: '00:00', title: 'Giới thiệu khuôn viên & Triết lý Alpha' },
    { id: 'ch-2', time: '01:10', title: 'Phòng thí nghiệm STEM & Không gian sáng tạo' },
    { id: 'ch-3', time: '02:30', title: 'Chương trình song ngữ Cambridge Quốc tế' },
    { id: 'ch-4', time: '03:45', title: 'Khu phức hợp thể thao & Nhà thi đấu đa năng' },
  ],
};
