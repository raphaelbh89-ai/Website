import { z } from 'zod';

export const FormEmbedSchema = z.object({
  title: z.string().default('Đăng Ký Tư Vấn Tuyển Sinh 2025 - 2026'),
  subtitle: z.string().default('Để lại thông tin để nhận cẩm nang tuyển sinh và học bổng lên tới 30%'),
  formCode: z.string().default('tuyen-sinh-2025'),
  submitButtonText: z.string().default('Gửi thông tin đăng ký'),
  successMessage: z.string().default('Cảm ơn Quý phụ huynh! Ban tuyển sinh sẽ liên hệ tư vấn trong vòng 24h.'),
  showBranchSelect: z.boolean().default(true),
});

export type FormEmbedConfig = z.infer<typeof FormEmbedSchema>;
export const defaultFormEmbedConfig: FormEmbedConfig = FormEmbedSchema.parse({});
