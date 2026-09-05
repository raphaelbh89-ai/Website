# 11. EXTENSIBILITY, REVISIONS, THEME & I18N
## Future-Proof Evolution & Long-Term Roadmap

---

### 11.1 KIẾN TRÚC SẴN SÀNG ĐA NGÔN NGỮ (MULTI-LANGUAGE I18N READINESS)

Mặc dù giai đoạn 1 tập trung tiếng Việt (`vi`), kiến trúc được thiết kế để khi kích hoạt tiếng Anh (`en`) hoặc song ngữ: **TUYỆT ĐỐI KHÔNG CẦN REWRITE DATABASE HAY ROUTING ENGINE**.

#### 1. Chiến lược Cơ sở dữ liệu:
- Phương án thiết kế: Áp dụng mô hình **Polymorphic Translation Table** hoặc **Bilingual JSONB Fields**:
  - Đối với thuộc tính ngắn (Tiêu đề, Mô tả, Button text): Lưu trực tiếp dưới dạng JSON đa ngữ trong schema:
    `title: { "vi": "Chương trình Cambridge", "en": "Cambridge Curriculum" }`
  - Đối với nội dung bài viết dài: Thiết kế bảng `translations (entity_type, entity_id, locale, field, content)` hoặc liên kết bài viết song ngữ: `articles.parent_translation_id`.
  - Không sinh thêm các cột cứng như `title_vi`, `title_en` (chống phá vỡ cấu trúc bảng khi trường thêm tiếng Pháp/Nhật).
2. **Chiến lược Routing**:
   - Next.js App Router sử dụng cấu trúc `[locale]/...`:
     - `school.edu.vn/vi/co-so-bien-hoa` (Mặc định có thể ẩn tiền tố `/vi/` để URL đẹp).
     - `school.edu.vn/en/campus-bien-hoa`.

---

### 11.2 HỆ THỐNG QUẢN LÝ THEME & DESIGN TOKENS

Hệ thống theme được tổ chức theo cấp độ chuẩn Design System:

```text
┌────────────────────────────────────────────────────────────────────────┐
│ 1. GLOBAL DESIGN TOKENS (Định nghĩa trong DB: theme_tokens)            │
│    - Colors: Primary, Secondary, Accent, Neutral, Background, Muted     │
│    - Fonts: Heading Font ('Outfit'), Body Font ('Inter')               │
│    - Radius: sm (4px), md (8px), lg (16px), full (9999px)              │
│    - Shadows: sm, md, lg, xl                                           │
│    - Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)     │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │ Chuyển đổi qua `@school-cms/theme`
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│ 2. CSS CUSTOM PROPERTIES (:root CSS Variables)                         │
│    :root {                                                             │
│      --color-primary: #0052cc;                                         │
│      --color-primary-hover: #0040a0;                                   │
│      --font-body: 'Inter', sans-serif;                                 │
│      --radius-base: 8px;                                               │
│    }                                                                   │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │ Ánh xạ vào
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│ 3. UI COMPONENTS & BLOCKS                                              │
│    - Sử dụng các Utility Classes: `bg-primary`, `rounded-base`         │
│    - Không bao giờ hard-code màu hex cứng                              │
└────────────────────────────────────────────────────────────────────────┘
```

---

### 11.3 CƠ CHẾ KIỂM SOÁT PHIÊN BẢN (REVISION, DRAFT, PREVIEW & ROLLBACK)

Mọi thay đổi trên Page, Article, Menu đều được kiểm soát phiên bản qua 4 trạng thái:

1. **Trạng thái Draft (Bản nháp)**:
   - Khi chỉnh sửa, hệ thống tự động lưu nháp mỗi 30 giây (Auto-save) vào bảng `revisions`.
   - Trang ngoài công chúng vẫn tiếp tục hiển thị bản đã Publish trước đó, không bị ảnh hưởng.
2. **Trạng thái Preview (Xem trước)**:
   - Admin có thể bấm nút "Xem trước". Hệ thống sinh ra một liên kết Preview an toàn có chữ ký điện tử HMAC (ví dụ: `/preview/pages/123?signature=xyz&expires=1725500000`).
   - Liên kết này có thể gửi cho Ban Giám Hiệu xem thử trên điện thoại mà không cần cấp tài khoản Admin.
3. **Trạng thái Publish (Phát hành)**:
   - Snapshot toàn bộ JSON của trang được đóng băng thành bản ghi `revisions` (v1, v2, v3...).
   - Bản ghi chính trong bảng `pages` được cập nhật sang `status: PUBLISHED`.
4. **Trạng thái Rollback (Khôi phục bản cũ)**:
   - Nếu Admin lỡ tay xóa nhầm một khối thông tin quan trọng:
   - Chỉ cần vào tab "Lịch sử phiên bản", bấm nút "Khôi phục về v2 lúc 14:00 hôm qua".
   - Hệ thống nạp lại Snapshot của v2 và ghi đè trạng thái hiện tại trong 1 cú click.

---

### 11.4 ĐÁNH GIÁ CÁC KỊCH BẢN MỞ RỘNG TRONG TƯƠNG LAI (EXTENSIBILITY Q&A)

#### Câu hỏi 1: Nếu sau này muốn thêm "AI Chatbot" thì cần tạo những gì?
- **Module/Package**: Tạo package mới `packages/ai-chatbot` chứa:
  - Bộ tích hợp LLM (OpenAI / Gemini / Anthropic API).
  - Pipeline Vector Search (PostgreSQL pgvector / Pinecone) để tìm kiếm dữ liệu trong sổ tay học sinh, biểu phí, nội quy.
- **Database**: Tạo 3 bảng mới: `bot_conversations`, `bot_messages`, `bot_knowledge_sources`.
- **API**: Thêm các endpoints: `POST /api/v1/chatbot/query` (Hỗ trợ Server-Sent Events - SSE để stream chữ từng từ), `POST /api/v1/chatbot/train`.
- **Admin**: Thêm giao diện tải tài liệu PDF nội quy nhà trường để tự động chia đoạn (Chunking) và nạp Vector embeddings.
- **Public UI**: Thêm một Block giao diện loại tương tác `FloatingChatbotWidget` nhúng vào Global Layout.
- **Kết luận**: Tích hợp hoàn toàn mượt mà như một plugin, không phải sửa code CMS gốc.

---

#### Câu hỏi 2: Nếu muốn thêm "Online Admission (Hệ thống tuyển sinh trực tuyến)" thì kiến trúc có hỗ trợ không?
- **Kiến trúc hoàn toàn hỗ trợ 100%**:
  - Tận dụng ngay **Generic Form Engine** hiện có để cấu hình các bước nộp hồ sơ.
  - Mở rộng thêm tính năng **Multi-step Form Wizard** (Bước 1: Thông tin học sinh -> Bước 2: Thông tin phụ huynh -> Bước 3: Tải lên giấy khai sinh, học bạ -> Bước 4: Xác nhận nộp).
  - Tận dụng **Media Direct-to-S3** để phụ huynh upload ảnh chụp hồ sơ an toàn mà không làm nghẽn server.
  - Bảng `form_submissions` đã có sẵn trường `status` và `notes`, chỉ cần mở rộng thêm các trạng thái quy trình: `HO_SO_MOI` -> `HEN_PHONG_VAN` -> `DA_TRUNG_TUYEN` -> `HOAN_TAT_HOC_PHI`.

---

#### Câu hỏi 3: Nếu muốn thêm "Online Payment (Thanh toán học phí / Lệ phí xét tuyển)" thì cần thay đổi gì?
- **Những gì cần thêm**:
  - Tạo package `packages/payment`.
  - Tích hợp cổng thanh toán trực tuyến phổ biến tại Việt Nam: **VNPay, MoMo, ZaloPay, OnePay** hoặc quốc tế (Stripe).
  - Cơ sở dữ liệu: Thêm bảng `transactions (id, submission_id, gateway, amount, order_code, transaction_status, webhook_payload)`.
- **Nguyên tắc an toàn giao dịch**:
  - Thiết kế luồng thanh toán theo chuẩn **Idempotency (Tính bất biến của giao dịch)** để chống thanh toán 2 lần khi mạng chập chờn.
  - Triển khai **Secure Webhook Handler** kèm đối soát chữ ký điện tử bí mật (HMAC SHA-512) để cập nhật trạng thái hồ sơ tuyển sinh ngay khi phụ huynh chuyển khoản thành công.

---

#### Câu hỏi 4: Nếu muốn thêm "Parent Portal / Student Portal" thì có phải rewrite Authentication không?
- **TUYỆT ĐỐI KHÔNG CẦN REWRITE AUTHENTICATION**:
  - Kiến trúc bảng `users`, `roles`, `user_roles` được thiết kế theo chuẩn doanh nghiệp.
  - Hiện tại: User Types là Quản trị viên (`ADMIN`, `EDITOR`).
  - Khi mở rộng Cổng Phụ huynh: Chỉ cần tạo Role mới `PARENT` và `STUDENT`.
  - Phụ huynh đăng nhập bằng chính hệ thống Auth hiện tại (qua SĐT hoặc Email).
  - Bổ sung bảng quan hệ phụ huynh - học sinh: `parent_students (parent_user_id, student_profile_id)`.
  - Sử dụng chung hạ tầng JWT/Cookie an toàn, chỉ khác nhau ở phân quyền truy cập: Phụ huynh chỉ được xem điểm danh, thời khóa biểu, sổ liên lạc của con mình thông qua Scope Guard.

---

#### Câu hỏi 5: Nếu mở rộng lên 50 cơ sở thì Database có chịu nổi không?
- **HOÀN TOÀN CHỊU ĐƯỢC DỄ DÀNG VÀ VƯỢT TRỘI**:
  - 50 cơ sở trong mô hình dữ liệu quan hệ chỉ tương đương 50 bản ghi trong bảng `branches`. Đây là con số cực kỳ nhỏ đối với một hệ quản trị như PostgreSQL (PostgreSQL được thiết kế để xử lý hàng triệu bản ghi dễ dàng).
  - Mọi câu truy vấn dữ liệu theo cơ sở đều đã có sẵn Index: `CREATE INDEX idx_branch_id ON articles(branch_id);` nên tốc độ truy vấn bài viết của 50 cơ sở hay 5 cơ sở là tương đương nhau (khoảng 1 - 3 miligiây).
  - Dữ liệu tĩnh của các cơ sở được Cloudflare CDN và Next.js Cache lưu giữ 90%, do đó số lượng request chạm tới Database thực tế rất thấp.
  - Trong tương lai dài hạn (nếu quy mô lên tới hàng nghìn trường), hệ thống có thể áp dụng **PostgreSQL Table Partitioning** theo `branch_id` mà không cần viết lại ứng dụng.
