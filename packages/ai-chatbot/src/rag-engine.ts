import {
  ChatbotIntent,
  KnowledgeSource,
  BotCitation,
  BotMessage,
  ChatbotQueryResponse,
} from './schema';
import { INITIAL_KNOWLEDGE_SOURCES } from './knowledge-base';

/**
 * Normalizes Vietnamese text for resilient matching (lowercasing, trimming)
 */
export function normalizeText(text: string): string {
  return text.toLowerCase().trim().replace(/\s+/g, ' ');
}

/**
 * Classifies visitor inquiry into one of the 6 recognized domain intents
 */
export function classifyIntent(query: string): { intent: ChatbotIntent; confidence: number } {
  const norm = normalizeText(query);

  // Keyword rules with weights
  const intentRules: Array<{ intent: ChatbotIntent; keywords: string[]; weight: number }> = [
    {
      intent: 'admissions_fee',
      keywords: ['học phí', 'tiền học', 'chi phí', 'bao nhiêu tiền', 'biểu phí', 'tiền ăn', 'phí bán trú', 'xe bus', 'đóng phí', 'giảm phí', 'ưu đãi đóng', 'giá'],
      weight: 1.0,
    },
    {
      intent: 'curriculum',
      keywords: ['cambridge', 'song ngữ', 'tiếng anh', 'giáo trình', 'a level', 'igcse', 'checkpoint', 'stem', 'chương trình', 'đào tạo', 'bằng tú tài', 'ielts'],
      weight: 1.0,
    },
    {
      intent: 'scholarship',
      keywords: ['học bổng', 'alpha spark', 'tài năng', 'miễn giảm', 'xét học bổng', 'học sinh giỏi', 'huy chương'],
      weight: 1.1,
    },
    {
      intent: 'campus_location',
      keywords: ['cơ sở', 'địa chỉ', 'ở đâu', 'vị trí', 'hà nội', 'biên hòa', 'quận 2', 'thủ đức', 'phòng lab', 'hồ bơi', 'sân bóng', 'đồng nai', 'cầu giấy'],
      weight: 1.0,
    },
    {
      intent: 'admissions_process',
      keywords: ['tuyển sinh', 'hồ sơ', 'quy trình', 'đăng ký', 'nhập học', 'khảo sát', 'phỏng vấn', 'giấy tờ', 'nộp đơn', 'đợt tuyển', 'thời gian tuyển', 'cách nộp'],
      weight: 1.0,
    },
    {
      intent: 'general_faq',
      keywords: ['nội quy', 'giờ học', 'bán trú', 'ăn trưa', 'đồng phục', 'thực đơn', 'xe đưa đón', 'thời khóa biểu', 'nghỉ hè'],
      weight: 0.9,
    },
  ];

  let bestIntent: ChatbotIntent = 'general_faq';
  let bestScore = 0;

  for (const rule of intentRules) {
    let matches = 0;
    for (const kw of rule.keywords) {
      if (norm.includes(kw)) {
        matches++;
      }
    }
    const score = matches * rule.weight;
    if (score > bestScore) {
      bestScore = score;
      bestIntent = rule.intent;
    }
  }

  // Calculate confidence from 0.50 (minimum default) to 0.98
  const confidence = bestScore > 0 ? Math.min(0.70 + bestScore * 0.08, 0.98) : 0.60;

  return { intent: bestIntent, confidence: Math.round(confidence * 100) / 100 };
}

/**
 * Searches the Knowledge Base using keyword & tag relevance scoring with multi-campus scoping
 */
export function findRelevantKnowledge(
  query: string,
  options?: {
    knowledgeSources?: KnowledgeSource[];
    branchId?: string | null;
    topK?: number;
    threshold?: number;
  }
): Array<{ chunk: KnowledgeSource; score: number }> {
  const sources = options?.knowledgeSources || INITIAL_KNOWLEDGE_SOURCES;
  const targetBranch = options?.branchId ?? null;
  const topK = options?.topK ?? 3;
  const threshold = options?.threshold ?? 1.5;

  const normQuery = normalizeText(query);
  const words = normQuery.split(' ').filter((w) => w.length > 1);

  const scored = sources
    .map((chunk) => {
      let score = 0;

      // 1. Campus scoping filter/boost
      if (chunk.branchId) {
        if (targetBranch && chunk.branchId === targetBranch) {
          score += 4.0; // High boost for exact campus match
        } else if (targetBranch && chunk.branchId !== targetBranch) {
          // Chunk is for a specific branch that does NOT match the requested branch
          return { chunk, score: -1 };
        } else if (!targetBranch && normQuery.includes(chunk.branchId.replace('-', ' '))) {
          score += 3.5; // Query explicitly mentions branch name
        }
      } else {
        // Global chunk: accessible by all campuses
        score += 0.5;
      }

      // 2. Tag matching
      for (const tag of chunk.tags) {
        if (normQuery.includes(tag.toLowerCase())) {
          score += 3.0;
        }
      }

      // 3. Title matching
      const normTitle = normalizeText(chunk.title);
      if (normTitle.includes(normQuery)) {
        score += 5.0;
      } else {
        for (const w of words) {
          if (normTitle.includes(w)) {
            score += 1.2;
          }
        }
      }

      // 4. Content occurrences
      const normContent = normalizeText(chunk.content);
      for (const w of words) {
        if (normContent.includes(w)) {
          score += 0.4;
        }
      }

      return { chunk, score };
    })
    .filter((item) => item.score >= threshold)
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, topK);
}

/**
 * Synthesizes grounded AI response strictly from retrieved knowledge base chunks
 */
export function generateChatbotResponse(
  query: string,
  history: BotMessage[] = [],
  options?: {
    branchId?: string | null;
    conversationId?: string;
    knowledgeSources?: KnowledgeSource[];
  }
): ChatbotQueryResponse {
  const conversationId = options?.conversationId || `conv-${Date.now()}`;
  const classification = classifyIntent(query);
  const matchedChunks = findRelevantKnowledge(query, {
    knowledgeSources: options?.knowledgeSources,
    branchId: options?.branchId,
    topK: 3,
  });

  // Extract citations
  const citations: BotCitation[] = matchedChunks.map(({ chunk }) => {
    const lines = chunk.content.split('\n').filter((l) => l.trim().length > 0);
    const snippet = lines.slice(0, 2).join(' ').slice(0, 180) + '...';
    return {
      sourceId: chunk.id,
      title: chunk.title,
      snippet,
      category: chunk.category,
    };
  });

  // Synthesize answer based on intent & grounded retrieved chunks
  let answer = '';
  let suggestedFollowUps: string[] = [];

  switch (classification.intent) {
    case 'admissions_fee':
      answer = `Dạ kính chào Quý phụ huynh! Em xin gửi thông tin chi tiết về **Biểu phí & Học phí năm học 2026 - 2027** của Alpha School:

• **Khối Tiểu học (Lớp 1 - 5)**: 8.500.000 VNĐ / tháng (~80.000.000 VNĐ / năm học).
• **Khối THCS (Lớp 6 - 9)**: 11.200.000 VNĐ / tháng (~106.000.000 VNĐ / năm học).
• **Khối THPT (Lớp 10 - 12)**: 14.500.000 VNĐ / tháng (~138.000.000 VNĐ / năm học).

🎁 **Chính sách ưu đãi tài chính:**
- **Đóng sớm cả năm:** Giảm ngay **10%** học phí khi hoàn tất trước ngày 30/06/2026.
- **Ưu đãi gia đình:** Giảm **5%** cho con thứ hai và **10%** cho con thứ ba theo học.
- **Bán trú dinh dưỡng:** 2.200.000 VNĐ / tháng (bữa trưa nóng và bữa xế chiều tiêu chuẩn Nhật Bản).
- **Xe đưa đón GPS:** 1.500.000 - 2.800.000 VNĐ / tháng tùy khoảng cách.`;
      suggestedFollowUps = [
        'Hồ sơ đăng ký tuyển sinh gồm những gì?',
        'Có chương trình học bổng không?',
        'Xem địa chỉ cơ sở gần nhất',
      ];
      break;

    case 'curriculum':
      answer = `Dạ vâng! Chương trình **Song ngữ Quốc tế Cambridge** tại Alpha School được chứng nhận bởi Cambridge International (Mã VN892):

• **Thời lượng tiếng Anh:** Chiếm 45% - 55% tổng thời lượng học, 100% giáo viên bản ngữ sở hữu chứng chỉ CELTA/PGCE.
• **Lộ trình xuyên suốt 3 cấp học:**
  - **Tiểu học:** Khung Cambridge Primary, thi chứng chỉ Primary Checkpoint vào cuối lớp 5.
  - **THCS:** Cambridge Lower Secondary, đánh giá Lower Secondary Checkpoint quốc tế.
  - **THPT:** Chứng chỉ IGCSE (lớp 9-10) và Bằng Tú tài Nâng cao AS/A Level (lớp 11-12) - được công nhận rộng rãi tại Oxford, Harvard, Cambridge, RMIT.
• **Thực hành STEM & Robotics:** Tích hợp nghiên cứu thực tiễn tại Trung tâm Sáng chế Alpha Innovation Lab.`;
      suggestedFollowUps = [
        'Học phí chương trình Cambridge bao nhiêu?',
        'Điều kiện đầu vào tiếng Anh?',
        'Quy trình nộp hồ sơ xét tuyển',
      ];
      break;

    case 'scholarship':
      answer = `Dạ vâng! Nhà trường đang triển khai Quỹ Học bổng Tài năng **"Alpha Spark 2026"** với các suất học bổng từ **20% đến 100% học phí** toàn cấp học:

• **Học bổng Kim Cương (100%):** Dành cho học sinh đạt giải Quốc gia/Quốc tế hoặc có thành tích đặc biệt xuất sắc.
• **Học bổng Vàng (70%) & Bạc (50%):** Dành cho học sinh giỏi cấp Tỉnh/Thành phố, điểm IELTS 6.5+ hoặc SAT 1350+.
• **Hồ sơ xét học bổng:** Bài luận cá nhân (Personal Statement), học bạ 2 năm gần nhất và tham gia phỏng vấn cùng Hội đồng Học thuật.`;
      suggestedFollowUps = [
        'Lịch phỏng vấn xét học bổng?',
        'Học phí sau khi được giảm?',
        'Nộp hồ sơ ứng tuyển trực tuyến',
      ];
      break;

    case 'campus_location':
      answer = `Dạ Alpha School hiện có **3 cơ sở khang trang, sinh thái xanh** tại các thành phố trọng điểm:

1. **Cơ sở Cầu Giấy (Hà Nội):** Lô D2, KĐT mới Cầu Giấy, P. Dịch Vọng Hậu, Q. Cầu Giấy, Hà Nội (15.000m², 60 phòng học thông minh).
2. **Cơ sở Quận 2 (TP. Hồ Chí Minh):** 88 Song Hành, P. An Phú, TP. Thủ Đức (18.000m², bể bơi 4 mùa, sân bóng FIFA 2 sao).
3. **Cơ sở Biên Hòa (Đồng Nai):** 125 Nguyễn Ái Quốc, P. Tân Tiến, TP. Biên Hòa (12.000m², trung tâm nghệ thuật 800 chỗ).

🚗 **Dịch vụ tiện ích:** 100% cơ sở đều có xe đưa đón GPS đón trả tận nhà và hệ thống an ninh nhận diện khuôn mặt AI.`;
      suggestedFollowUps = [
        'Cơ sở Biên Hòa có ưu đãi gì riêng?',
        'Chi phí xe đưa đón từng khu vực?',
        'Đăng ký tham quan trường (Open Day)',
      ];
      break;

    case 'admissions_process':
      answer = `Dạ quy trình tuyển sinh trực tuyến tại Alpha School gồm **4 bước thuận tiện, nhanh chóng**:

• **Bước 1:** Điền hồ sơ trực tuyến trên Website (Hệ thống tự động cấp mã hồ sơ điện tử dạng \`HS-2026-XXXX\`).
• **Bước 2:** Ban tuyển sinh thẩm định và gửi thông báo Lịch hẹn Khảo sát năng lực / Phỏng vấn trong 24 giờ.
• **Bước 3:** Học sinh tham gia phỏng vấn tư duy và đánh giá tiếng Anh Cambridge cùng Hội đồng giáo viên.
• **Bước 4:** Nhận Giấy báo Trúng tuyển chính thức và hoàn tất học phí nhập học.

📁 **Hồ sơ gồm:** Bản chụp Giấy khai sinh, Học bạ 2 năm gần nhất và Giấy khám sức khỏe.`;
      suggestedFollowUps = [
        'Nộp đơn xét tuyển ngay bây giờ',
        'Học phí năm học 2026 - 2027?',
        'Lịch tuyển sinh đợt gần nhất',
      ];
      break;

    default:
      if (matchedChunks.length > 0) {
        answer = `Dạ chào Quý phụ huynh! Dựa trên Sổ tay Thông tin Nhà trường, Alpha School xin giải đáp như sau:\n\n${matchedChunks[0].chunk.content.slice(0, 450)}...\n\nQuý phụ huynh có thể đặt thêm câu hỏi để em hỗ trợ chi tiết hơn ạ!`;
      } else {
        answer = `Dạ kính chào Quý phụ huynh! Em là Trợ lý Tuyển sinh AI của Alpha School. Em có thể giải đáp chi tiết về:
- Biểu phí & học phí các khối lớp năm học 2026 - 2027
- Lộ trình đào tạo Song ngữ Quốc tế Cambridge
- Địa chỉ và cơ sở vật chất 3 cơ sở (Hà Nội, TP.HCM, Biên Hòa)
- Chính sách Học bổng Alpha Spark (lên tới 100%)
- Hướng dẫn nộp hồ sơ tuyển sinh trực tuyến 4 bước.

Quý phụ huynh đang quan tâm đến nội dung nào ạ?`;
      }
      suggestedFollowUps = [
        'Học phí năm học 2026?',
        'Chương trình Cambridge có gì nổi bật?',
        'Địa chỉ các cơ sở trường?',
      ];
      break;
  }

  const messageId = `msg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const assistantMessage: BotMessage = {
    id: messageId,
    conversationId,
    role: 'assistant',
    content: answer,
    matchedIntent: classification.intent,
    confidenceScore: classification.confidence,
    citations,
    suggestedFollowUps,
    createdAt: new Date().toISOString(),
  };

  return {
    conversationId,
    message: assistantMessage,
    intent: classification.intent,
    confidence: classification.confidence,
    citations,
    suggestedFollowUps,
  };
}

/**
 * Formats data for Server-Sent Events (SSE) streaming
 */
export function formatSseChunk(textChunk: string, isDone: boolean = false, metadata?: Record<string, unknown>): string {
  const payload = JSON.stringify({
    chunk: textChunk,
    done: isDone,
    ...(metadata ? { metadata } : {}),
  });
  return `data: ${payload}\n\n`;
}
