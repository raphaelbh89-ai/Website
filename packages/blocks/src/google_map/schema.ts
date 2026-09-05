import { z } from 'zod';

export const MapCampusLocationSchema = z.object({
  id: z.string(),
  name: z.string(),
  tag: z.string().optional(),
  address: z.string(),
  phone: z.string(),
  email: z.string().email().optional(),
  embedUrl: z.string().url(),
  directionsUrl: z.string().url(),
  workingHours: z.string().default('07:30 - 17:30 (Thứ 2 - Thứ 7)'),
});

export const GoogleMapSchema = z.object({
  badge: z.string().default('BẢN ĐỒ ĐỊNH VỊ'),
  title: z.string().default('Hệ Thống Cơ Sở Trường Học Alpha Toàn Quốc'),
  subtitle: z.string().default('Các phân hiệu được quy hoạch tại các vị trí đắc địa, kết nối giao thông thông thoáng và an toàn cho tuyến xe bus đưa đón.'),
  defaultCampusId: z.string().default('loc-hn'),
  campuses: z.array(MapCampusLocationSchema).default([]),
});

export type MapCampusLocation = z.infer<typeof MapCampusLocationSchema>;
export type GoogleMapConfig = z.infer<typeof GoogleMapSchema>;

export const defaultGoogleMapConfig: GoogleMapConfig = {
  badge: 'BẢN ĐỒ ĐỊNH VỊ',
  title: 'Hệ Thống Cơ Sở Trường Học Alpha Toàn Quốc',
  subtitle: 'Các phân hiệu được quy hoạch tại các vị trí đắc địa, kết nối giao thông thông thoáng và an toàn cho tuyến xe bus đưa đón.',
  defaultCampusId: 'loc-hn',
  campuses: [
    {
      id: 'loc-hn',
      name: 'Alpha Cầu Giấy (Hà Nội)',
      tag: 'Trụ sở chính',
      address: 'Lô C1, KĐT Nam Trung Yên, Cầu Giấy, Hà Nội',
      phone: '024 7300 8555',
      email: 'admissions.hn@alphaschool.edu.vn',
      embedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.3879282361664!2d105.7891823758364!3d21.017158788177573!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab58ff7e6001%3A0x6b4f738914c62b58!2sNam%20Trung%20Yen!5e0!3m2!1svi!2s!4v1700000000000',
      directionsUrl: 'https://maps.google.com/?q=Nam+Trung+Yen+Cau+Giay+Ha+Noi',
      workingHours: '07:30 - 17:30 (Thứ 2 - Thứ 7)',
    },
    {
      id: 'loc-hcm',
      name: 'Alpha Nam Sài Gòn (TP.HCM)',
      tag: 'Phân hiệu Phía Nam',
      address: 'Đường Nguyễn Văn Linh, Phường Tân Phú, Quận 7, TP.HCM',
      phone: '028 7300 8666',
      email: 'admissions.hcm@alphaschool.edu.vn',
      embedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.953531393666!2d106.72023537567702!3d10.738060059897142!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3175258679f64a59%3A0xc0fb1ca2843bb5c5!2zTmd1eeG7hW4gVsSDbiBMaW5oLCBRdeG6rW4gNywgSOG7kyBDaMOtIE1pbmg!5e0!3m2!1svi!2s!4v1700000000001',
      directionsUrl: 'https://maps.google.com/?q=Nguyen+Van+Linh+Quan+7+TP+Ho+Chi+Minh',
      workingHours: '07:30 - 17:30 (Thứ 2 - Thứ 7)',
    },
    {
      id: 'loc-bien-hoa',
      name: 'Alpha Biên Hòa (Đồng Nai)',
      tag: 'Cơ sở Sinh Thái',
      address: 'Đường Nguyễn Ái Quốc, Phường Tân Tiến, TP. Biên Hòa, Đồng Nai',
      phone: '0251 730 8777',
      email: 'admissions.bh@alphaschool.edu.vn',
      embedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3917.472719277022!2d106.84364417567993!3d10.927608856384776!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3174dfb14167e6b5%3A0x867bc5c9932785db!2zTmd1eeG7hW4gw4FpIFF14buRYywgVMOibiBUaeG6v24sIEJpw6puIEjDsmEsIMSQ4buTbmcgTmFp!5e0!3m2!1svi!2s!4v1700000000002',
      directionsUrl: 'https://maps.google.com/?q=Nguyen+Ai+Quoc+Bien+Hoa+Dong+Nai',
      workingHours: '07:30 - 17:00 (Thứ 2 - Thứ 7)',
    },
  ],
};
