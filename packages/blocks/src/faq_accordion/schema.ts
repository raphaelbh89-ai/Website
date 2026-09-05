import { z } from 'zod';

export const FaqItemSchema = z.object({
  question: z.string(),
  answer: z.string(),
});

export const FaqAccordionSchema = z.object({
  title: z.string().default('Giải Đáp Thắc Mắc Thường Gặp'),
  subtitle: z.string().default('Những thông tin quan trọng giúp Quý Phụ huynh hiểu rõ hơn về hệ thống và chương trình đào tạo'),
  items: z.array(FaqItemSchema).default([
    {
      question: 'Nhà trường có dịch vụ xe bus đưa đón học sinh tận nhà không?',
      answer: 'Có, Alpha School cung cấp mạng lưới xe bus đưa đón tận nhà hoặc theo điểm đón tập trung tại tất cả các quận huyện thuộc địa bàn cơ sở với giám sát viên chuyên trách và định vị GPS báo về điện thoại phụ huynh.',
    },
    {
      question: 'Chế độ dinh dưỡng và bán trú tại trường được tổ chức thế nào?',
      answer: 'Bếp ăn chuẩn quốc tế HACCP chế biến tươi tại chỗ, cung cấp 3 bữa/ngày (sáng, trưa, xế) với thực đơn được các chuyên gia dinh dưỡng thiết kế cân bằng vi chất, thay đổi linh hoạt theo tuần.',
    },
    {
      question: 'Học sinh chuyển từ trường công lập sang có theo kịp chương trình tiếng Anh không?',
      answer: 'Nhà trường có các lớp bồi dưỡng tiếng Anh tăng cường (ESL Intensive) đầu năm học và đội ngũ giáo viên trợ giảng hỗ trợ kèm riêng để các em nhanh chóng bắt nhịp tự tin với bạn bè.',
    },
    {
      question: 'Chính sách học bổng dành cho học sinh mới như thế nào?',
      answer: 'Hằng năm Alpha School cấp quỹ học bổng Alpha Excellence trị giá 10 tỷ VNĐ với các mức 30%, 50% và 100% học phí dành cho các em học sinh có thành tích học tập và tài năng xuất sắc.',
    },
  ]),
});

export type FaqAccordionConfig = z.infer<typeof FaqAccordionSchema>;
export const defaultFaqAccordionConfig: FaqAccordionConfig = FaqAccordionSchema.parse({});
