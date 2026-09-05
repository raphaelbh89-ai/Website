# Alpha School CMS Framework — Enterprise Multi-Campus Modular Platform

[![Next.js 14](https://img.shields.io/badge/Next.js-14.2-black?logo=next.js)](https://nextjs.org/)
[![Turborepo](https://img.shields.io/badge/Turborepo-Monorepo-ef4444?logo=turborepo)](https://turbo.build/)
[![Fastify](https://img.shields.io/badge/Fastify-v4-000000?logo=fastify)](https://fastify.dev/)
[![PostgreSQL 16](https://img.shields.io/badge/PostgreSQL-16-336791?logo=postgresql)](https://www.postgresql.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

> **School Website Management Framework / Modular CMS / Page Builder** dành cho hệ thống trường học đa cơ sở quy mô lớn (50+ chi nhánh, hàng nghìn bài viết, hàng trăm khối giao diện động, tích hợp CRM tuyển sinh và Trợ lý AI 24/7).
> 
> **Triết lý thiết kế cốt lõi**: Admin có thể quản lý, tùy biến giao diện, dựng trang và điều phối biểu mẫu tuyển sinh từ Admin Dashboard mà **hoàn toàn không cần can thiệp mã nguồn (Zero Code modification)**.

---

## 🏛️ Kiến Trúc Hệ Thống (Modular Monolith)

Hệ thống được tổ chức theo mô hình **Modular Monolith** sử dụng **pnpm Workspaces** và **Turborepo**:

```text
├── apps/
│   ├── web/           # Next.js 14 App Router: Cổng thông tin trường học & Landing pages đa cơ sở
│   ├── admin/         # Next.js 14 App Router: Admin Dashboard, Visual Page Builder, CRM & Theme Customizer
│   └── api/           # Fastify 4 Backend: REST API, AI Chatbot RAG, Unified Search, CRM & Audit Logs
├── packages/
│   ├── blocks/        # Thư viện 12 block chuẩn (HeroBanner, ProgramList, PartnerSlider, BranchList, NewsList, FormEmbed, TestimonialSlider, FaqAccordion, Statistics, CtaBanner, Gallery, ContactBox)
│   ├── cms/           # BlockRegistry singleton, Schema Resolver, Versioning & Migrations
│   ├── auth/          # Ma trận phân quyền RBAC (13 permissions) & Kiểm tra phạm vi cơ sở (canAccessBranchResource)
│   ├── database/      # Drizzle ORM Schema PostgreSQL 16 (35 bảng, UUIDv7, Soft Delete) & Seed Data
│   ├── forms/         # Dynamic Form schema validation & builder core
│   ├── media/         # Quản lý tệp tin, tối ưu hóa WebP & 4 biến thể ảnh thích ứng (Responsive Image Variants)
│   ├── seo/           # Tự động sinh JSON-LD Schema.org (School, NewsArticle, Course)
│   ├── theme/         # Design Tokens generator (:root CSS variables)
│   ├── ui/            # UI components dùng chung (Buttons, Containers)
│   └── shared/        # DTOs, Enums, i18n Dictionary (VI/EN), Interfaces dùng chung toàn monorepo
├── docs/              # 12 tài liệu đặc tả kiến trúc chi tiết (01-12)
├── deploy/ci.yml      # CI/CD Pipeline tự động kiểm thử và build monorepo
└── docker-compose.yml # Hạ tầng production (PostgreSQL 16, Redis 7, API, Web, Admin)
```

---

## ⚡ Các Tính Năng Đã Triển Khai Hoàn Chỉnh

### 1. Dynamic Page Builder (Dựng trang trực quan & Quản trị phiên bản)
- Kéo thả, thêm mới, sắp xếp, xóa và cấu hình các khối giao diện từ **BlockRegistry**.
- Chuyển đổi linh hoạt chế độ xem trước đa thiết bị: **Desktop (100%) ➔ Tablet (768px) ➔ Mobile (375px)**.
- **Lịch sử phiên bản (Page Revision History)**: Tự động ghi nhận snapshot cấu trúc blocks mỗi lần Xuất bản.
- **Rollback 1-chạm (One-Click Rollback)**: Cho phép xem lại chi tiết và khôi phục layout về bất kỳ phiên bản nào trong quá khứ.
- **Sao lưu cấu hình toàn diện (Site Backup Export)**: Xuất gói cấu hình chuẩn JSON (Blocks layout, theme tokens, menu điều hướng, từ điển i18n).

### 2. Thư Viện 16 Khối Giao Diện Chuẩn (100% Catalog Completion)
1. `hero_banner`: Banner lớn, ảnh nền, overlay opacity, slogan và nút kêu gọi hành động (CTA).
2. `program_list`: Danh sách chương trình đào tạo chuẩn quốc tế (Mầm non, Tiểu học, Trung học & Tú tài).
3. `partner_slider`: Băng chuyền đối tác học thuật quốc tế (Cambridge, IB, CIS, Edexcel).
4. `branch_list`: Danh mục hệ thống cơ sở toàn quốc với địa chỉ và hotline.
5. `news_list`: Lưới tin tức, sự kiện học đường phân loại theo cơ sở.
6. `form_embed`: Biểu mẫu đăng ký tuyển sinh trực tuyến tương tác kết nối REST API.
7. `testimonial_slider`: Lời chia sẻ và cảm nhận thực tế từ phụ huynh & cựu học sinh đạt học bổng quốc tế.
8. `faq_accordion`: Bảng câu hỏi thường gặp tích hợp đóng/mở tương tác giải đáp thắc mắc tuyển sinh.
9. `statistics`: Con số ấn tượng (100% đỗ ĐH, 15+ năm kinh nghiệm, 50+ giải thưởng quốc tế, 5000+ học sinh xuất sắc, counter & theme đa dạng).
10. `cta_banner`: Banner kêu gọi hành động tuyển sinh cao cấp (Hotline nóng, đăng ký tham quan, tải cẩm nang, nền gradient & overlay).
11. `gallery`: Thư viện ảnh tương tác học sinh (Phân loại categories, responsive grid, lightbox phóng to toàn màn hình kèm caption).
12. `contact_box`: Khối thông tin liên hệ đa cơ sở (Địa chỉ thực tế, giờ làm việc, hotline tư vấn, email tiếp nhận, Google Maps embed).
13. `video_player`: Trình chiếu Video điện ảnh (YouTube / Vimeo / MP4), xem trước poster, nhãn thời lượng, lightbox phát video và chapters.
14. `google_map`: Bản đồ định vị cơ sở trực quan (Chuyển đổi phân hiệu Hà Nội/TP.HCM/Biên Hòa, thẻ thông tin địa chỉ, sao chép 1-chạm và chỉ đường).
15. `rich_text`: Trình soạn thảo văn bản học thuật (Headings, lead paragraphs, trích dẫn danh nhân, danh sách và alert callouts).
16. `image_text`: Khối bố cục Split 2 cột (Ảnh cơ sở vật chất & bài giới thiệu, đảo chiều trái/phải, huy hiệu số liệu và nút CTA).

### 2.1 Hệ Thống Tuyển Sinh Trực Tuyến Đa Bước (Online Admission Wizard)
- **Quy trình nộp hồ sơ 4 bước**: (1) Thông tin thí sinh -> (2) Thông tin phụ huynh -> (3) Tài liệu đính kèm (Khai sinh, học bạ) -> (4) Nguyện vọng cơ sở & Khối lớp.
- **Vòng đời 4 trạng thái duyệt**: `Hồ Sơ Mới Nộp` ➔ `Hẹn Phỏng Vấn / ĐGNL` ➔ `Đã Trúng Tuyển` ➔ `Đã Nhập Học (Hoàn Tất)`.
- **Tự động sinh mã hồ sơ**: Định dạng chuẩn `HS-2026-XXXX`.
- **Thẩm định hồ sơ số**: Kiểm tra tính hợp lệ của tài liệu đính kèm, đặt lịch phỏng vấn và ghi nhận học phí đã thu.

### 3. Phân Quyền Đa Cơ Sở & Ma Trận Quyền Lực (RBAC Security Matrix)
- **4 Vai trò cốt lõi**: `SUPER_ADMIN`, `CAMPUS_DIRECTOR`, `ADMISSIONS_OFFICER`, `CONTENT_EDITOR`.
- **Ma trận quyền lực động (Permission Matrix Editor)**: Quản trị 13 quyền hạn phân thành 4 nhóm nghiệp vụ (`system`, `content`, `admissions`, `settings`).
- **Quản lý danh sách tài khoản**: Thêm người dùng, kích hoạt/tạm dừng trạng thái, gán cơ sở phụ trách.
- **Audit Logs**: Tự động lưu vết kiểm toán cho mọi thao tác (CREATE, UPDATE, DELETE, PUBLISH, STATUS_CHANGE, EXPORT).

### 4. Quản Lý Đa Ngôn Ngữ (i18n Localization) & Menu Điều Hướng
- **Từ điển song ngữ (VI / EN)**: Quản lý tập trung các khóa dịch (Key-Value) phân loại theo nhóm.
- **Language Switcher công cộng**: Cho phép phụ huynh chuyển đổi mượt mà giữa Tiếng Việt và English.
- **Navigation Menu Builder**: Quản lý cấu trúc liên kết thanh điều hướng Header và Footer với thứ tự tùy chỉnh.

### 5. CRM Tuyển Sinh Trực Tuyến & Xuất Dữ Liệu Excel
- Tiếp nhận hồ sơ phụ huynh đăng ký từ Landing page công cộng.
- Phễu Pipeline 4 giai đoạn: **Hồ Sơ Mới ➔ Đang Tư Vấn ➔ Đã Hẹn Tham Quan ➔ Đã Nhập Học**.
- Slide-over CRM Drawer cho phép cập nhật trạng thái 1 chạm và ghi chú nhật ký liên hệ (Notes Timeline).
- **Engine xuất CSV chuẩn UTF-8 BOM**: Mở trực tiếp trên Microsoft Excel hiển thị trọn vẹn tiếng Việt có dấu.

### 6. Trợ Lý AI Tuyển Sinh 24/7 & Tìm Kiếm Hợp Nhất (Unified Search)
- **AI Chatbot Advisor**: Widget nổi tương tác góc màn hình, tư vấn chi tiết học phí, chính sách học bổng 10 tỷ VNĐ, lộ trình Cambridge và địa chỉ cơ sở.
- **Unified Search (`Ctrl + K`)**: Tìm kiếm tức thì đồng thời qua cơ sở, chương trình đào tạo và tin tức bài viết.

### 7. Theme Customizer & Design Tokens
- Bộ điều khiển màu thương hiệu (Primary, Secondary / Accent), bo góc (4px - 20px), font chữ (`Outfit`, `Inter`, `Roboto`, `Plus Jakarta Sans`).
- Khung Live Preview xem trước thời gian thực và xuất khẩu biến số `:root` CSS Variables.

### 8. Hệ Thống Fastify REST API Doanh Nghiệp Toàn Diện
- **Pages & Revision API**: `/api/v1/pages`, `/api/v1/pages/:id/publish`, `/api/v1/pages/:id/rollback` (lưu snapshot và khôi phục layout trang).
- **Navigation Menus API**: `/api/v1/menus`, `/api/v1/menus/reorder`, `/api/v1/menus/:id` (quản trị liên kết Header/Footer).
- **Multi-Language (i18n) API**: `/api/v1/translations`, `/api/v1/translations/:key` (quản trị từ điển song ngữ tập trung).
- **User Accounts & RBAC Matrix API**: `/api/v1/users`, `/api/v1/users/:id/status`, `/api/v1/roles/permissions` (quản lý phân quyền động).
- **Media Asset Hub API**: `/api/v1/media`, `/api/v1/media/upload`, `/api/v1/media/presigned-url`, `/api/v1/media/:id` (quản lý tệp tin & ảnh biến thể).
- **Cache & Performance API**: `/api/v1/cache/stats`, `/api/v1/cache/revalidate`, `/api/v1/cache/purge` (quản trị On-Demand ISR & Edge cache).
- **System Health API**: `/api/v1/health` (báo cáo trạng thái hoạt động toàn bộ hệ thống).
- **System Backup & Restore API**: `/api/v1/system/backup`, `/api/v1/system/restore` (sao lưu & phục hồi toàn bộ trang web).
### 9. Công Cụ SEO Rich Snippets & Bảo Mật Biểu Mẫu (Form Sanitization)
- **Schema.org Structured Data**: Tự động sinh mã JSON-LD chuẩn hóa Google Rich Results:
  - `FAQPage`: Khối câu hỏi thường gặp FAQ tự động gắn thẻ cấu trúc hỗ trợ hiển thị câu hỏi/trả lời ngay trên kết quả tìm kiếm Google.
  - `BreadcrumbList`: Định dạng cây điều hướng đa cấp tự động tương thích với siteUrl.
  - `School / EducationalOrganization`: Tích hợp đầy đủ thông tin pháp lý, địa chỉ, hotline, học bổng và mô tả trường học.
- **Dynamic Form Sanitization**: Bộ lọc làm sạch đầu vào form chống XSS và HTML Injection (`sanitizeFormSubmission`), hỗ trợ đầy đủ các kiểu input (`select`, `tel`, `checkbox`, `date`, `radio`).

### 10. Bảng Điều Phối Tuyển Sinh Kanban & Hệ Thống Webhook Tự Động
- **Bảng Kanban 4 Cột Trực Quan (Admissions Kanban Board)**:
  - Chuyển đổi linh hoạt giữa chế độ **📋 Danh Sách Bảng** và **📊 Kanban Board 4 Cột** (`Hồ Sơ Mới ➔ Đang Tư Vấn ➔ Đã Hẹn Tham Quan ➔ Đã Nhập Học`).
  - Thanh chỉ số KPI thời gian thực: Tổng hồ sơ, Hồ sơ mới, Đang xử lý, Đã nhập học và Tỷ lệ chốt thành công (`Conversion Rate %`).
  - Nút chuyển trạng thái 1 chạm (Quick Status Progression) trực tiếp trên từng thẻ hồ sơ kèm ghi chú lịch sử.
- **Hệ Thống Webhook Phân Phối Tự Động & Live Test Console**:
  - Tự động kích hoạt khi phát sinh hồ sơ mới (`lead.created`) hoặc cập nhật trạng thái (`lead.status_updated`).
  - Ký số bảo mật điện tử **HMAC SHA-256** qua tiêu đề `X-Webhook-Signature` chống giả mạo dữ liệu.
  - Trình Giả Lập Kích Hoạt (Live Test Console) trên Admin Dashboard cho phép kiểm tra chữ ký HMAC-SHA256 tức thì.
  - Hệ thống API REST: `/api/v1/webhooks`, `/api/v1/webhooks/test-trigger` và `/api/v1/webhooks/logs`.

### 11. Thư Viện Media Đa Phương Tiện & Tối Ưu Biến Thể Ảnh (Responsive Image Engine)
- Tự động sinh 4 biến thể kích thước ảnh chuẩn hóa: **Thumbnail (150px) ➔ Mobile Card (480px) ➔ Desktop Grid (800px) ➔ Hero Banner (1920px)** định dạng WebP hiện đại theo mục 8.3 `docs/08-performance.md`.
- Bộ lọc phân loại tệp tin theo nhóm (`Hình ảnh`, `Tài liệu`, `Video`) và tìm kiếm nhanh.
- Sao chép 1-chạm URL tối ưu CDN và chèn trực tiếp vào các khối giao diện.

### 12. Quản Trị Hiệu Năng Đa Tầng & On-Demand Tag Cache (Performance & Edge Cache)
- **Kiến trúc Caching 3 tầng**: Cloudflare Edge CDN (Tầng 1) ➔ Next.js On-Demand ISR (Tầng 2) ➔ Redis 7 TTL Cache (Tầng 3) theo mục 8.1 & 8.2 `docs/08-performance.md`.
- **On-Demand Tag-based Invalidation**: Thu hồi bộ nhớ đệm 1-chạm từ Admin Dashboard theo các thẻ nghiệp vụ (`page:home`, `branch:bien-hoa`, `theme:tokens`, `global-layout`).
- **Dashboard Giám Sát Hiệu Năng**: Theo dõi tỷ lệ trúng bộ nhớ đệm (Hit Ratio 88.5%), Lượt Hits/Misses và nút xóa trắng khẩn cấp Purge All.

### 13. Hệ Thống Tuyển Sinh Trực Tuyến Đa Bước & Thẩm Định Hồ Sơ (Online Admission Engine)
- **Quy trình nộp hồ sơ 4 bước chuẩn hóa**:
  - Bước 1: Thông tin học sinh (Họ tên, ngày sinh, giới tính, trường hiện tại).
  - Bước 2: Thông tin phụ huynh (Họ tên, quan hệ, số điện thoại, email, địa chỉ).
  - Bước 3: Tải hồ sơ điện tử (Giấy khai sinh, học bạ, giấy khám sức khỏe).
  - Bước 4: Đăng ký cơ sở (Biên Hòa, TP. Thủ Đức, Cầu Giấy), khối học và hệ đào tạo (Cambridge Song Ngữ, Chất Lượng Cao).
- **Mã hồ sơ tự động chuẩn hóa**: Tự động sinh mã `HS-2026-XXXX` tuần tự phục vụ tra cứu.
- **Vòng đời trạng thái tuyển sinh**: `HO_SO_MOI` ➔ `HEN_PHONG_VAN` ➔ `DA_TRUNG_TUYEN` ➔ `HOAN_TAT_HOC_PHI`.
- **Hệ thống API REST**: `/api/v1/admissions/applications`, `/api/v1/admissions/apply`, `/api/v1/admissions/applications/:id/status`, `/api/v1/admissions/stats`.
- **Giao diện Admin thẩm định hồ sơ**: Modal duyệt hồ sơ 4 bước, kiểm tra tính hợp lệ của tài liệu đính kèm, lên lịch phỏng vấn và ghi nhận học phí.

### 14. Trợ Lý AI Tuyển Sinh 24/7 & Sổ Tay Tri Thức RAG (AI Admissions Advisor & Knowledge Base)
- **Package độc lập `@school-cms/ai-chatbot`**: Tuân thủ nguyên lý kiến trúc Decoupled & Open/Closed quy định tại mục 11.4 `docs/11-extensibility.md`.
- **Mô hình RAG (Retrieval-Augmented Generation) chống ảo giác**:
  - 6 danh mục tri thức sổ tay: *Học phí & Tài chính, Chương trình Cambridge, Quy trình tuyển sinh, Cơ sở vật chất, Học bổng Alpha Spark, và Nội quy bán trú*.
  - Bộ phân loại ý định (Intent Classifier) tự động: `admissions_fee`, `curriculum`, `campus_location`, `scholarship`, `admissions_process`, `general_faq` với điểm tin cậy (Confidence Score %).
  - Phân tầng tri thức đa cơ sở: Ưu tiên dữ liệu đặc thù của cơ sở (Biên Hòa, Thủ Đức, Cầu Giấy) và tự động kế thừa tri thức khung toàn hệ thống theo `docs/10-multi-branch.md`.
  - Trích dẫn nguồn xác thực (Citation Attribution) đính kèm từng câu trả lời.
- **Console Quản Trị Tri Thức & Kiểm Thử RAG (Admin Sandbox)**:
  - Quản lý nạp/xóa/phân đoạn (Chunking) các văn bản quy định nhà trường.
  - Live AI Sandbox Console cho phép Ban Tuyển sinh thử nghiệm câu hỏi và kiểm tra độ chính xác, intent và đoạn trích dẫn tức thì.
- **Widget Trợ Lý AI Nổi (FloatingChatbotWidget)**:
  - Nút bấm nổi tương tác trên Cổng thông tin công cộng (`apps/web`).
  - Cửa sổ chat hiện đại, hỗ trợ chip gợi ý câu hỏi nhanh ("Học phí 2026?", "Chương trình Cambridge?", "Cơ sở Biên Hòa ở đâu?").
  - Tích hợp nút CTA 1-chạm kết nối trực tiếp vào Form nộp hồ sơ trực tuyến.
- **Hệ thống API REST & Streaming SSE**: `/api/v1/chatbot/query`, `/api/v1/chatbot/knowledge`, `/api/v1/chatbot/conversations`.

### 15. Đa Cơ Sở Hybrid Subdomain Routing, Scoped Theming, Xem Trước Bảo Mật HMAC & So Sánh Bản Sửa Đổi (Multi-Campus & Executive Preview)
- **Định tuyến Subdomain & Tên Miền Riêng (Edge Middleware)**:
  - Tự động nhận diện hostname (`bienhoa.school.edu.vn`, `truongbienhoa.edu.vn`, v.v.) qua Next.js Edge Middleware và điều hướng rewrite tới trang cơ sở `/co-so/[branchSlug]`.
  - Bộ token nhận diện màu sắc đặc thù: Biên Hòa (`#047857` Emerald), Thủ Đức (`#1d4ed8` Royal Blue), Cầu Giấy (`#b91c1c` Academic Crimson) tiêm động vào biến CSS.
- **Xem Trước Bản Thảo Bảo Mật Bằng Ký Số HMAC-SHA256 (Executive Draft Preview)**:
  - Sinh đường dẫn xem trước có chữ ký điện tử thời hạn 24h, bảo vệ chống giả mạo bằng thuật toán so sánh an toàn `timingSafeEqualStrings()`.
  - Ban Giám Hiệu / Hội đồng Quản trị có thể xem trước nội dung bản thảo trực tiếp trên giao diện Cổng thông tin công cộng mà không cần tài khoản CMS admin.
  - Tích hợp thanh cảnh báo bảo mật trên đầu trang và modal 1-chạm copy link trên Admin Dashboard.
- **So Sánh Trực Quan Lịch Sử Phiên Bản (Revision Visual Diff Engine)**:
  - So sánh đối chiếu trực tiếp giữa 2 phiên bản revision: tự động phát hiện các khối Thêm mới (+Added), Bị xóa (-Removed), Biến đổi cấu hình (ΔModified), và Giữ nguyên (=Unchanged).
  - Modal Diff Inspector hiển thị trực quan các trường cấu hình JSON được thay đổi kèm 4 thẻ KPI tổng hợp.

---

## 🚀 Hướng Dẫn Cài Đặt & Chạy Môi Trường Cục Bộ

### Yêu cầu tiên quyết:
- **Node.js**: >= 20.0.0
- **pnpm**: >= 9.0.0 (khuyến nghị 11.25.0)

### Bước 1: Cài đặt thư viện dependencies
```bash
pnpm install
```

### Bước 2: Chạy kiểm thử tự động
```bash
pnpm test
```
*Kết quả: 45/45 tests passing (BlockRegistry 16 blocks, Migrations, Multi-tenant RBAC Scoping, Seed Data integrity, i18n dictionary, UTF-8 BOM CSV Export, Dynamic Permission Matrix, Page Revision Rollback, Site Backup Package, Pages API lifecycle, Navigation Reorder, Bilingual Dictionary API, Super Admin deletion guard, 16 Registered Block Schemas Validation, End-to-End System Health Contract, Schema.org FAQPage & Breadcrumbs Rich Snippets, Dynamic Form Input Sanitization, Cryptographic Webhook HMAC-SHA256 Dispatcher, Admissions Lead Kanban Pipeline & Conversion Metrics, Media Responsive Image Optimization Variants, Media Asset Lifecycle & Constraints, Webhook Live Test Simulation, Complete 16 Standard Blocks Library Coverage & Config Integrity, On-demand Tag Cache Invalidation, Cache TTL & Hit Ratio Precision, Cache REST Lifecycle, Admissions Step-by-Step Form Wizard Validation, Application Code Generation HS-2026-XXXX & Conversion KPIs, Online Admissions REST API & Status Progression Workflow, AI Knowledge Base Indexing & Multi-category Chunk Validation, Chatbot Intent Classification & Confidence Scoring Precision, RAG Context Grounding & Strict Citation Attribution, AI Chatbot Query REST API & SSE Streaming Contract, Multi-Campus Knowledge Scoping & Global Inheritance, Multi-Campus Hostname Resolution, Scoped Campus Theming & Fallback, HMAC-SHA256 Signed Preview Links, Preview Security & Tamper Proofing, Page Revision Snapshot Deep Diff Comparator).*


### Bước 3: Kiểm tra tính toàn vẹn kiểu dữ liệu
```bash
pnpm -r typecheck
```

### Bước 4: Khởi động hệ thống đồng thời
```bash
pnpm dev
```

Hệ thống sẽ chạy trên các cổng:
- **Public Web Portal**: [http://localhost:3000](http://localhost:3000)
- **Admin Dashboard**: [http://localhost:3001](http://localhost:3001)
- **Fastify REST API**: [http://localhost:4000](http://localhost:4000)

---

## 🐳 Triển Khai Bằng Docker Compose

Hạ tầng sẵn sàng cho môi trường Production chỉ với một lệnh:

```bash
docker compose up -d --build
```

Container bao gồm:
- `postgres`: PostgreSQL 16 Alpine (Port 5432)
- `redis`: Redis 7 Alpine (Port 6379)
- `api`: Fastify Backend (Port 4000)
- `web`: Next.js Public Web (Port 3000)
- `admin`: Next.js Admin (Port 3001)

Kiểm tra trạng thái hệ thống:
```bash
curl http://localhost:4000/api/v1/health
```

---

## 🧩 Thêm Một Block Mới (Tuân thủ Open/Closed Principle)

Để thêm một Block mới vào hệ thống mà **không sửa đổi mã nguồn lõi của Renderer hay Page Builder**:

1. Tạo thư mục `packages/blocks/src/my_block/` với `schema.ts`, `Component.tsx`, và `index.ts`.
2. Khai báo `BlockDefinition` với type duy nhất.
3. Đăng ký vào `BlockRegistry` trong `packages/blocks/src/index.ts`:
   ```ts
   BlockRegistry.register(MyBlockDefinition);
   ```
*Block mới sẽ ngay lập tức xuất hiện trong Admin Page Builder và được DynamicPageRenderer hiển thị tự động.*

---

## 📄 Bản Quyền & Giấy Phép

Dự án được xây dựng và phát hành theo giấy phép [MIT License](LICENSE).
Mã nguồn đồng bộ liên tục tại: [https://github.com/raphaelbh89-ai/Website.git](https://github.com/raphaelbh89-ai/Website.git)
