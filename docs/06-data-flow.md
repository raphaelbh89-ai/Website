# 06. DATA FLOW SPECIFICATIONS
## End-to-End Operational Lifecycle Flows

---

### 6.1 DATA FLOW 1: TẠO VÀ XUẤT BẢN TRANG (PAGE CREATION & PUBLISHING)

Quy trình bảo đảm an toàn dữ liệu, hỗ trợ bản nháp (Draft), chế độ xem trước (Live Preview), và tự động xóa cache CDN khi phát hành.

```text
[ Admin Editor ]
       │
       ▼
 1. Tạo bản nháp (Draft Page)
    - Nhập Tiêu đề, chọn Branch, chọn Template
    - Kéo thả Sections & Blocks trong Canvas
       │
       ▼
 2. Live Preview (Xem trước không ảnh hưởng trang thật)
    - Admin UI gửi `POST /api/v1/pages/:id/preview-token`
    - Nhận Token bí mật có thời hạn 30 phút
    - Mở Iframe xem trước: `https://school.edu.vn/preview?token=...`
    - Next.js Server đọc trực tiếp trạng thái DRAFT từ Database qua Token bí mật
       │
       ▼
 3. Bấm nút "Xuất bản" (Publish)
    - Gửi request `POST /api/v1/pages/:id/publish`
    - API Transaction thực hiện:
      a. Đổi trạng thái trang: `status = 'PUBLISHED'`, gán `published_at = NOW()`
      b. Tạo bản ghi lịch sử trong bảng `revisions` (Snapshot toàn bộ Sections + Blocks)
      c. Ghi nhận nhật ký trong bảng `audit_logs` (User X đã publish trang Y)
       │
       ▼
 4. Kích hoạt dọn dẹp Cache (Cache Invalidation Pipeline)
    - Backend gọi Webhook nội bộ tới Next.js App:
      `res.revalidateTag('page-slug-bien-hoa')`
    - Backend gọi Cloudflare API Purge Cache:
      `POST https://api.cloudflare.com/client/v4/zones/:zone/purge_cache` (Xóa URL tương ứng)
       │
       ▼
 5. Khách truy cập (Public Visitor)
    - Truy cập `https://school.edu.vn/co-so-bien-hoa`
    - Next.js sinh trang HTML mới nhất và cache lại trên Edge CDN
```

---

### 6.2 DATA FLOW 2: TẠO VÀ TỐI ƯU BÀI VIẾT (ARTICLE CREATION & SEO)

Quy trình quản lý vòng đời bài viết biên tập từ lúc soạn thảo đến khi bot Google thu thập dữ liệu.

```text
[ Content Writer ]
       │
       ▼
 1. Soạn thảo bài viết
    - Nhập Tiêu đề, Chọn Chuyên mục, Chọn Tác giả
    - Chọn Phạm vi cơ sở: `ALL_BRANCHES` hoặc Cơ sở cụ thể (Ví dụ: `BIEN_HOA`)
    - Soạn nội dung qua WYSIWYG Editor / Content Blocks
       │
       ▼
 2. Cấu hình SEO chuyên sâu
    - Nhập Meta Title, Meta Description (Có hiển thị thanh đo độ dài chuẩn Google)
    - Chọn Ảnh đại diện chia sẻ mạng xã hội (OpenGraph Image)
    - Chọn thẻ định hướng tìm kiếm: `index, follow`
       │
       ▼
 3. Lưu và Phê duyệt
    - Gửi request `POST /api/v1/articles`
    - Hệ thống tự động:
      a. Chuẩn hóa Slug URL không dấu: `/tin-tuc/le-khai-giang-nam-hoc-2025`
      b. Tự động trích xuất 160 ký tự đầu làm Excerpt nếu người dùng để trống
      c. Tạo bản ghi `seo_metadata` tương ứng và liên kết khóa ngoại
       │
       ▼
 4. Xuất bản & Phân phối (Distribution)
    - Tự động bổ sung URL bài viết mới vào tệp `sitemap-articles.xml`
    - Tự động sinh thẻ Schema.org `Article` chuẩn:
      `{ "@type": "NewsArticle", "headline": "...", "datePublished": "..." }`
    - Ping Google Search Console API (nếu cấu hình Indexing API)
```

---

### 6.3 DATA FLOW 3: KHÁCH NỘP BIỂU MẪU TUYỂN SINH (FORM SUBMISSION & ALERT)

Quy trình bảo đảm an toàn dữ liệu nộp, phòng chống spam bot triệt để và gửi thông báo tức thời tới bộ phận Tuyển sinh.

```text
[ Phụ huynh / Khách ghé thăm ]
       │
       ▼
 1. Điền Form "Đăng ký tư vấn tuyển sinh 2025"
    - Nhập Họ tên phụ huynh, SĐT, Email, Tên bé, Năm sinh, Cơ sở mong muốn
    - Form có trường Honeypot ẩn (nếu bot tự động điền vào trường này -> Hủy ngay)
    - Tích hợp Cloudflare Turnstile / Google reCAPTCHA v3 (Chạy ngầm không bắt chọn hình ảnh)
       │
       ▼
 2. Gửi dữ liệu (Submit)
    - Gửi request `POST /api/v1/public/forms/tuyen-sinh-2025/submit`
       │
       ▼
 3. Tầng API Gateway & Validation Layer
    - Kiểm tra IP Rate Limiter (tối đa 5 lần gửi / 10 phút từ 1 IP)
    - Xác thực Captcha Token với máy chủ Cloudflare
    - Nạp `form_fields` từ Cache, đối soát từng trường theo `validation_rules` (Regex SĐT, Email hợp lệ)
       │
       ▼
 4. Lưu trữ an toàn vào Database
    - Khởi tạo transaction:
      a. Insert bản ghi vào bảng `form_submissions` (Lưu IP, User-Agent, Branch ID, Trạng thái: `NEW`)
      b. Batch Insert các giá trị vào `form_submission_values`
       │
       ▼
 5. Phân luồng thông báo tự động (Asynchronous Notification Dispatcher)
    - Đẩy sự kiện `FormSubmittedEvent` vào Message Queue (Redis / BullMQ):
      a. Gửi Email thông báo xác nhận tự động tới Phụ huynh kèm brochure trường học
      b. Gửi Email / Telegram thông báo có khách đăng ký mới tới Trưởng phòng Tuyển sinh của Cơ sở tương ứng
      c. Webhook đẩy trực tiếp dữ liệu sang hệ thống CRM (nếu có tích hợp)
       │
       ▼
 6. Phản hồi cho Phụ huynh
    - Trả về JSON thành công kèm thông điệp chúc mừng cấu hình từ CMS:
      `"Cảm ơn Quý phụ huynh! Bộ phận tuyển sinh Cơ sở Biên Hòa sẽ liên hệ lại trong vòng 24 giờ."`
```

---

### 6.4 DATA FLOW 4: TẢI LÊN TÀI NGUYÊN MEDIA TRỰC TIẾP LÊN CLOUD STORAGE (DIRECT-TO-S3 UPLOAD)

Loại bỏ nghẽn cổ chai cho máy chủ bằng cách không cho tải file dung lượng lớn qua API Backend.

```text
[ Trình duyệt Admin ]             [ Backend API ]               [ Cloud Storage (S3 / R2) ]
        │                                │                                   │
        │ 1. Gửi metadata file           │                                   │
        │ (name, size, mimeType)         │                                   │
        │───────────────────────────────►│                                   │
        │                                │ 2. Kiểm tra MIME type, kích thước │
        │                                │    Tạo khóa lưu trữ ngẫu nhiên:   │
        │                                │    `media/2026/09/uuid.jpg`       │
        │                                │ 3. Ký URL tải lên bảo mật         │
        │                                │    (Pre-signed PUT URL, TTL 5p)   │
        │ 4. Trả về Pre-signed URL       │                                   │
        │◄───────────────────────────────│                                   │
        │                                                                    │
        │ 5. Tải file nhị phân trực tiếp lên Cloud Storage                   │
        │───────────────────────────────────────────────────────────────────►│
        │                                                                    │
        │ 6. Nhận mã phản hồi HTTP 200 OK                                    │
        │◄───────────────────────────────────────────────────────────────────│
        │                                │                                   │
        │ 7. Gửi xác nhận đã tải xong    │                                   │
        │───────────────────────────────►│                                   │
        │                                │ 8. Backend kích hoạt Worker:      │
        │                                │    - Đọc metadata ảnh (WxH)       │
        │                                │    - Sinh các biến thể WebP/AVIF  │
        │                                │    - Lưu thông tin vào bảng`media`│
        │ 9. Trả về Media Object mới     │                                   │
        │◄───────────────────────────────│                                   │
```
