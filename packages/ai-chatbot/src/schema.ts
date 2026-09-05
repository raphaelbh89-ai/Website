import { z } from 'zod';

export const KnowledgeCategorySchema = z.enum([
  'hoc_phi',
  'chuong_trinh_cambridge',
  'tuyen_sinh',
  'co_so_vat_chat',
  'hoc_bong',
  'noi_quy',
]);
export type KnowledgeCategory = z.infer<typeof KnowledgeCategorySchema>;

export const KNOWLEDGE_CATEGORY_LABELS: Record<KnowledgeCategory, { label: string; icon: string; color: string }> = {
  hoc_phi: { label: 'Học Phí & Tài Chính', icon: '💰', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
  chuong_trinh_cambridge: { label: 'Chương Trình Cambridge', icon: '🎓', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
  tuyen_sinh: { label: 'Quy Trình Tuyển Sinh', icon: '📝', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
  co_so_vat_chat: { label: 'Cơ Sở Vật Chất', icon: '🏫', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
  hoc_bong: { label: 'Học Bổng Tài Năng', icon: '🌟', color: 'bg-rose-500/10 text-rose-400 border-rose-500/20' },
  noi_quy: { label: 'Nội Quy & Đời Sống', icon: '📋', color: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' },
};

export const KnowledgeSourceSchema = z.object({
  id: z.string(),
  title: z.string().min(3),
  category: KnowledgeCategorySchema,
  branchId: z.string().nullable().default(null),
  content: z.string().min(10),
  tokenCount: z.number().int().nonnegative(),
  tags: z.array(z.string()).default([]),
  updatedAt: z.string(),
});
export type KnowledgeSource = z.infer<typeof KnowledgeSourceSchema>;

export const ChatbotIntentSchema = z.enum([
  'admissions_fee',
  'curriculum',
  'campus_location',
  'scholarship',
  'admissions_process',
  'general_faq',
]);
export type ChatbotIntent = z.infer<typeof ChatbotIntentSchema>;

export const INTENT_LABELS: Record<ChatbotIntent, { label: string; description: string }> = {
  admissions_fee: { label: 'Tra cứu Học phí & Ưu đãi', description: 'Chi phí biểu phí từng cấp học, phí bán trú, xe đưa đón, ưu đãi' },
  curriculum: { label: 'Chương trình Cambridge', description: 'Lộ trình song ngữ, thời lượng tiếng Anh, chứng chỉ Checkpoint/IGCSE' },
  campus_location: { label: 'Cơ sở trường học & Tiện ích', description: 'Địa chỉ, diện tích, phòng thí nghiệm, hồ bơi, sân bóng' },
  scholarship: { label: 'Học bổng Alpha Spark', description: 'Chính sách học bổng tài năng, điều kiện và hồ sơ ứng tuyển' },
  admissions_process: { label: 'Quy trình & Đăng ký nộp đơn', description: 'Các bước nộp hồ sơ, giấy tờ yêu cầu, lịch phỏng vấn đánh giá' },
  general_faq: { label: 'Hỏi đáp chung & Nội quy', description: 'Thời gian biểu học tập, đồng phục, thực đơn bán trú' },
};

export const BotCitationSchema = z.object({
  sourceId: z.string(),
  title: z.string(),
  snippet: z.string(),
  category: KnowledgeCategorySchema,
});
export type BotCitation = z.infer<typeof BotCitationSchema>;

export const BotMessageSchema = z.object({
  id: z.string(),
  conversationId: z.string(),
  role: z.enum(['user', 'assistant', 'system']),
  content: z.string(),
  matchedIntent: ChatbotIntentSchema.optional(),
  confidenceScore: z.number().min(0).max(1).optional(),
  citations: z.array(BotCitationSchema).optional(),
  suggestedFollowUps: z.array(z.string()).optional(),
  createdAt: z.string(),
});
export type BotMessage = z.infer<typeof BotMessageSchema>;

export const BotConversationSchema = z.object({
  id: z.string(),
  branchId: z.string().nullable().default(null),
  visitorId: z.string(),
  title: z.string(),
  messages: z.array(BotMessageSchema),
  status: z.enum(['active', 'closed']).default('active'),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type BotConversation = z.infer<typeof BotConversationSchema>;

export const ChatbotQueryRequestSchema = z.object({
  query: z.string().min(1, 'Câu hỏi không được để trống'),
  conversationId: z.string().optional(),
  branchId: z.string().nullable().optional(),
  visitorId: z.string().optional(),
});
export type ChatbotQueryRequest = z.infer<typeof ChatbotQueryRequestSchema>;

export const ChatbotQueryResponseSchema = z.object({
  conversationId: z.string(),
  message: BotMessageSchema,
  intent: ChatbotIntentSchema,
  confidence: z.number(),
  citations: z.array(BotCitationSchema),
  suggestedFollowUps: z.array(z.string()),
});
export type ChatbotQueryResponse = z.infer<typeof ChatbotQueryResponseSchema>;
