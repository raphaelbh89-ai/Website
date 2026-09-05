import { z } from 'zod';

export const RichTextQuoteSchema = z.object({
  text: z.string(),
  author: z.string(),
  role: z.string().optional(),
});

export const RichTextCalloutSchema = z.object({
  type: z.enum(['info', 'warning', 'success', 'tip']).default('info'),
  title: z.string(),
  text: z.string(),
});

export const RichTextSchema = z.object({
  badge: z.string().default('TỔNG QUAN GIÁO DỤC'),
  title: z.string().default('Triết Lý Giáo Dục Đổi Mới & Phát Triển Toàn Diện'),
  lead: z.string().default('Tại Alpha School, chúng tôi tin rằng mỗi học sinh là một cá nhân độc bản sở hữu tiềm năng vô hạn cần được khơi mở và nuôi dưỡng.'),
  contentHtml: z.string().default(`
    <p>Chương trình đào tạo tại trường được tích hợp hài hòa giữa khung chuẩn của <strong>Bộ Giáo dục & Đào tạo</strong> và chương trình <em>Cambridge International</em> chuẩn toàn cầu. Chúng tôi không chỉ trang bị kiến thức học thuật xuất sắc mà còn chú trọng 5 giá trị cốt lõi: <strong>Tự chủ, Sáng tạo, Trách nhiệm, Thấu cảm và Tinh thần dấn thân</strong>.</p>
    <p>Mỗi ngày đến trường là một cuộc phiêu lưu tri thức mới. Với mô hình lớp học mở, phương pháp học tập qua dự án (Project-Based Learning) và các hoạt động trải nghiệm thực địa, học sinh phát triển tư duy phản biện, kỹ năng giải quyết vấn đề và năng lực giao tiếp song ngữ vượt trội.</p>
  `),
  quote: RichTextQuoteSchema.optional(),
  callout: RichTextCalloutSchema.optional(),
  alignment: z.enum(['left', 'center']).default('left'),
  maxWidth: z.enum(['standard', 'wide', 'narrow']).default('standard'),
});

export type RichTextQuote = z.infer<typeof RichTextQuoteSchema>;
export type RichTextCallout = z.infer<typeof RichTextCalloutSchema>;
export type RichTextConfig = z.infer<typeof RichTextSchema>;

export const defaultRichTextConfig: RichTextConfig = {
  badge: 'TỔNG QUAN GIÁO DỤC',
  title: 'Triết Lý Giáo Dục Đổi Mới & Phát Triển Toàn Diện',
  lead: 'Tại Alpha School, chúng tôi tin rằng mỗi học sinh là một cá nhân độc bản sở hữu tiềm năng vô hạn cần được khơi mở và nuôi dưỡng.',
  contentHtml: `
    <p>Chương trình đào tạo tại trường được tích hợp hài hòa giữa khung chuẩn của <strong>Bộ Giáo dục & Đào tạo</strong> và chương trình <em>Cambridge International</em> chuẩn toàn cầu. Chúng tôi không chỉ trang bị kiến thức học thuật xuất sắc mà còn chú trọng 5 giá trị cốt lõi: <strong>Tự chủ, Sáng tạo, Trách nhiệm, Thấu cảm và Tinh thần dấn thân</strong>.</p>
    <p>Mỗi ngày đến trường là một cuộc phiêu lưu tri thức mới. Với mô hình lớp học mở, phương pháp học tập qua dự án (Project-Based Learning) và các hoạt động trải nghiệm thực địa, học sinh phát triển tư duy phản biện, kỹ năng giải quyết vấn đề và năng lực giao tiếp song ngữ vượt trội.</p>
  `,
  quote: {
    text: 'Giáo dục không phải là việc đổ đầy một chiếc bình, mà là thắp lên một ngọn lửa khai phóng đam mê.',
    author: 'TS. Nguyễn Minh Phương',
    role: 'Chủ tịch Hội đồng Khoa học & Đào tạo Alpha School',
  },
  callout: {
    type: 'tip',
    title: 'Cam kết chuẩn đầu ra Quốc tế',
    text: '100% học sinh tốt nghiệp đạt chứng chỉ IELTS 6.5+ hoặc chứng chỉ Cambridge A-Level, sẵn sàng xét tuyển thẳng vào các trường Đại học danh tiếng trong nước và quốc tế.',
  },
  alignment: 'left',
  maxWidth: 'standard',
};
