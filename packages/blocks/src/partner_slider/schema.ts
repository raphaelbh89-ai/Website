import { z } from 'zod';

export const PartnerItemSchema = z.object({
  id: z.string().default('p1'),
  name: z.string().default('Cambridge Assessment International Education'),
  logoUrl: z.string().default('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=200&auto=format&fit=crop'),
  websiteUrl: z.string().optional().default('https://cambridgeinternational.org'),
});

export const PartnerSliderSchema = z.object({
  title: z.string().default('Đối Tác Học Thuật & Kiểm Định Quốc Tế'),
  subtitle: z.string().default('Đồng hành cùng các tổ chức giáo dục danh tiếng toàn cầu'),
  partners: z.array(PartnerItemSchema).default([
    {
      id: 'pt1',
      name: 'Cambridge Assessment',
      logoUrl: 'https://placehold.co/180x60/f8fafc/047857?text=Cambridge',
      websiteUrl: 'https://cambridge.org',
    },
    {
      id: 'pt2',
      name: 'International Baccalaureate',
      logoUrl: 'https://placehold.co/180x60/f8fafc/047857?text=IB+World',
      websiteUrl: 'https://ibo.org',
    },
    {
      id: 'pt3',
      name: 'Cognia Accreditation',
      logoUrl: 'https://placehold.co/180x60/f8fafc/047857?text=Cognia',
      websiteUrl: 'https://cognia.org',
    },
    {
      id: 'pt4',
      name: 'Microsoft Showcase School',
      logoUrl: 'https://placehold.co/180x60/f8fafc/047857?text=Microsoft',
      websiteUrl: 'https://microsoft.com',
    },
  ]),
});

export type PartnerSliderConfig = z.infer<typeof PartnerSliderSchema>;
export const defaultPartnerSliderConfig: PartnerSliderConfig = PartnerSliderSchema.parse({});
