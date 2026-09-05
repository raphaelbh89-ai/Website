import { z } from 'zod';

export const BranchItemSchema = z.object({
  id: z.string().default('b1'),
  name: z.string().default('Cơ sở Biên Hòa - Đồng Nai'),
  slug: z.string().default('bien-hoa'),
  address: z.string().default('Số 123 Đường Nguyễn Ái Quốc, TP. Biên Hòa, Tỉnh Đồng Nai'),
  phone: z.string().default('0251 123 4567'),
  imageUrl: z.string().default('https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=800&auto=format&fit=crop'),
});

export const BranchListSchema = z.object({
  title: z.string().default('Hệ Thống Các Cơ Sở Alpha School'),
  subtitle: z.string().default('Không gian học tập xanh mát, hiện đại chuẩn quốc tế trên toàn quốc'),
  branches: z.array(BranchItemSchema).default([
    {
      id: 'b1',
      name: 'Alpha School - Cơ sở Biên Hòa',
      slug: 'bien-hoa',
      address: 'Số 123 Đường Nguyễn Ái Quốc, TP. Biên Hòa, Đồng Nai',
      phone: '0251 123 4567',
      imageUrl: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=800&auto=format&fit=crop',
    },
    {
      id: 'b2',
      name: 'Alpha School - Cơ sở Quận 2 (TP. Thủ Đức)',
      slug: 'thu-duc',
      address: 'Khu đô thị Sala, Mai Chí Thọ, TP. Thủ Đức, TP. HCM',
      phone: '028 987 6543',
      imageUrl: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?q=80&w=800&auto=format&fit=crop',
    },
    {
      id: 'b3',
      name: 'Alpha School - Cơ sở Bình Dương',
      slug: 'binh-duong',
      address: 'Đại lộ Bình Dương, TP. Thủ Dầu Một, Bình Dương',
      phone: '0274 333 8888',
      imageUrl: 'https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=800&auto=format&fit=crop',
    },
  ]),
});

export type BranchListConfig = z.infer<typeof BranchListSchema>;
export const defaultBranchListConfig: BranchListConfig = BranchListSchema.parse({});
