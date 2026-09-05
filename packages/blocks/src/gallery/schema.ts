import { z } from 'zod';

export const GalleryImageItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  category: z.string(), // e.g., 'Cơ sở vật chất', 'Hoạt động ngoại khóa', 'Lễ tốt nghiệp', 'STEM & Sáng tạo'
  imageUrl: z.string().url(),
  caption: z.string().optional(),
});

export const GallerySchema = z.object({
  badge: z.string().default('KHOẢNH KHẮC ALPHA'),
  title: z.string().default('Thư Viện Hình Ảnh & Đời Sống Học Đường'),
  subtitle: z.string().default('Ghi lại những hành trình học tập, trải nghiệm và trưởng thành đầy tự hào của các thế hệ học sinh.'),
  columns: z.enum(['3', '4']).default('4'),
  categories: z.array(z.string()).default(['Tất cả', 'Hoạt động ngoại khóa', 'Cơ sở vật chất', 'Học thuật & STEM', 'Lễ hội & Tốt nghiệp']),
  images: z.array(GalleryImageItemSchema).default([]),
});

export type GalleryImageItem = z.infer<typeof GalleryImageItemSchema>;
export type GalleryConfig = z.infer<typeof GallerySchema>;

export const defaultGalleryConfig: GalleryConfig = {
  badge: 'KHOẢNH KHẮC ALPHA',
  title: 'Thư Viện Hình Ảnh & Đời Sống Học Đường',
  subtitle: 'Ghi lại những hành trình học tập, trải nghiệm và trưởng thành đầy tự hào của các thế hệ học sinh.',
  columns: '4',
  categories: ['Tất cả', 'Hoạt động ngoại khóa', 'Cơ sở vật chất', 'Học thuật & STEM', 'Lễ hội & Tốt nghiệp'],
  images: [
    {
      id: 'gal-1',
      title: 'Giờ Học STEM & Lập Trình Robot VEX',
      category: 'Học thuật & STEM',
      imageUrl: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?q=80&w=800&auto=format&fit=crop',
      caption: 'Học sinh cấp 2 hào hứng nghiên cứu mô hình robot phục vụ dự án khoa học quốc tế.',
    },
    {
      id: 'gal-2',
      title: 'Hồ Bơi Bốn Mùa Chuẩn Olympic',
      category: 'Cơ sở vật chất',
      imageUrl: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?q=80&w=800&auto=format&fit=crop',
      caption: 'Khu liên hợp thể thao dưới nước với hệ thống lọc nước ozone hiện đại.',
    },
    {
      id: 'gal-3',
      title: 'Giải Bóng Đá Giao Hữu Alpha Cup',
      category: 'Hoạt động ngoại khóa',
      imageUrl: 'https://images.unsplash.com/photo-1526232761682-d26e03ac148e?q=80&w=800&auto=format&fit=crop',
      caption: 'Rèn luyện thể lực và tinh thần đồng đội qua các giải thi đấu thể thao thường niên.',
    },
    {
      id: 'gal-4',
      title: 'Lễ Tốt Nghiệp Tú Tài Quốc Tế A-Level',
      category: 'Lễ hội & Tốt nghiệp',
      imageUrl: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=800&auto=format&fit=crop',
      caption: 'Khoảnh khắc rạng rỡ của tân cử nhân Alpha School trước thềm du học thế giới.',
    },
    {
      id: 'gal-5',
      title: 'Thư Viện Số Tương Tác Hiện Đại',
      category: 'Cơ sở vật chất',
      imageUrl: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=800&auto=format&fit=crop',
      caption: 'Không gian đọc mở với hơn 20,000 đầu sách ngoại văn và phòng đọc yên tĩnh.',
    },
    {
      id: 'gal-6',
      title: 'Dự Án Mỹ Thuật & Điêu Khắc Sáng Tạo',
      category: 'Học thuật & STEM',
      imageUrl: 'https://images.unsplash.com/photo-1460518451285-97b6aa326961?q=80&w=800&auto=format&fit=crop',
      caption: 'Phát huy năng khiếu hội họa và tư duy thẩm mỹ qua các triển lãm nghệ thuật học sinh.',
    },
    {
      id: 'gal-7',
      title: 'Chuyến Dã Ngoại Sinh Thái Rừng Nam Cát Tiên',
      category: 'Hoạt động ngoại khóa',
      imageUrl: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?q=80&w=800&auto=format&fit=crop',
      caption: 'Học sinh trải nghiệm thế giới tự nhiên và tham gia các hoạt động bảo tồn sinh quyển.',
    },
    {
      id: 'gal-8',
      title: 'Đêm Nhạc Hội Giáng Sinh Alpha Gala',
      category: 'Lễ hội & Tốt nghiệp',
      imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=800&auto=format&fit=crop',
      caption: 'Màn trình diễn hòa nhạc giao hưởng và kịch tiếng Anh sôi động do học sinh tự dàn dựng.',
    },
  ],
};
