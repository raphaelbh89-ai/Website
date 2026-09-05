import { z } from 'zod';

export const ContactBranchItemSchema = z.object({
  id: z.string(),
  branchName: z.string(),
  address: z.string(),
  phone: z.string(),
  email: z.string(),
  workingHours: z.string().default('Thứ 2 - Thứ 7: 07:30 - 17:30'),
  mapEmbedUrl: z.string().optional(),
  isPrimary: z.boolean().default(false),
});

export const ContactBoxSchema = z.object({
  badge: z.string().default('LIÊN HỆ TRỰC TIẾP'),
  title: z.string().default('Hệ Thống Cơ Sở & Kênh Tư Vấn Tuyển Sinh'),
  subtitle: z.string().default('Quý Phụ huynh có thể ghé thăm trực tiếp các cơ sở hoặc liên hệ ban tuyển sinh để được hỗ trợ chu đáo nhất.'),
  centralHotline: z.string().default('1900 8888'),
  centralEmail: z.string().default('tuyensinh@school.edu.vn'),
  layout: z.enum(['grid_3_cols', 'split_cards']).default('grid_3_cols'),
  branches: z.array(ContactBranchItemSchema).default([]),
});

export type ContactBranchItem = z.infer<typeof ContactBranchItemSchema>;
export type ContactBoxConfig = z.infer<typeof ContactBoxSchema>;

export const defaultContactBoxConfig: ContactBoxConfig = {
  badge: 'LIÊN HỆ TRỰC TIẾP',
  title: 'Hệ Thống Cơ Sở & Kênh Tư Vấn Tuyển Sinh',
  subtitle: 'Quý Phụ huynh có thể ghé thăm trực tiếp các cơ sở hoặc liên hệ ban tuyển sinh để được hỗ trợ chu đáo nhất.',
  centralHotline: '1900 8888',
  centralEmail: 'tuyensinh@school.edu.vn',
  layout: 'grid_3_cols',
  branches: [
    {
      id: 'cb-1',
      branchName: 'Alpha School - Cơ sở Biên Hòa',
      address: 'Số 123 Đường Nguyễn Ái Quốc, TP. Biên Hòa, Tỉnh Đồng Nai',
      phone: '0251 123 4567',
      email: 'bienhoa@school.edu.vn',
      workingHours: 'Thứ 2 - Thứ 7: 07:30 - 17:30',
      mapEmbedUrl: 'https://maps.google.com/?q=Bien+Hoa',
      isPrimary: true,
    },
    {
      id: 'cb-2',
      branchName: 'Alpha School - Cơ sở TP. Thủ Đức',
      address: 'Khu đô thị Sala, TP. Thủ Đức, TP. Hồ Chí Minh',
      phone: '028 987 6543',
      email: 'thuduc@school.edu.vn',
      workingHours: 'Thứ 2 - Thứ 7: 07:30 - 17:30',
      mapEmbedUrl: 'https://maps.google.com/?q=Sala+Thu+Duc',
      isPrimary: false,
    },
    {
      id: 'cb-3',
      branchName: 'Alpha School - Cơ sở Bình Dương',
      address: 'Đại lộ Bình Dương, TP. Thủ Dầu Một, Tỉnh Bình Dương',
      phone: '0274 333 8888',
      email: 'binhduong@school.edu.vn',
      workingHours: 'Thứ 2 - Thứ 7: 07:30 - 17:30',
      mapEmbedUrl: 'https://maps.google.com/?q=Binh+Duong',
      isPrimary: false,
    },
  ],
};
