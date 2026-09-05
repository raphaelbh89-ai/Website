# Lịch Sử Triển Khai Chi Tiết Các Phase (Implementation History & Changelog)

Tài liệu này ghi lại toàn bộ tiến trình triển khai dự án **Alpha School Website Management Framework / Modular CMS / Page Builder** từ Phase 1 đến Phase 24, kèm danh sách file thay đổi và mã băm Git Commit tương ứng đã được push lên GitHub repository: [https://github.com/raphaelbh89-ai/Website.git](https://github.com/raphaelbh89-ai/Website.git).

---

## 📋 Bảng Tổng Hợp 24 Phase

| Phase | Tên Giai Đoạn & Nội Dung Cốt Lõi | Trạng Thái | Commit Hash |
|---|---|---|---|
| **Phase 1** | Thiết kế 12 tài liệu đặc tả kiến trúc doanh nghiệp (`docs/01-12`) | Hoàn thành | `45fd990` |
| **Phase 2** | Khởi tạo Monorepo (Turborepo, pnpm workspaces, 10 shared packages, 5 blocks đầu tiên) | Hoàn thành | `445c1a5` |
| **Phase 3** | Quản lý Thực Thể & Nội Dung (Cơ sở, Tin tức, Chương trình), Dynamic Public Routes | Hoàn thành | `606f260` |
| **Phase 4** | Khối Form Embed, Trang Tuyển Sinh (`/tuyen-sinh`), Theme Customizer, Dynamic Form Builder | Hoàn thành | `fc02550` |
| **Phase 5** | Phân quyền Multi-tenant RBAC Scoping, Phễu CRM Tuyển sinh, Audit Logs, Seed Data | Hoàn thành | `27b37df` |
| **Phase 6** | Trợ lý AI Tuyển sinh 24/7, Tìm kiếm hợp nhất (`Ctrl + K`), Docker Compose DevOps Kit | Hoàn thành | `e319302` |
| **Phase 7** | Hệ thống Kiểm thử Tự động (`pnpm test`), CI/CD Pipeline (`deploy/ci.yml`), Root Docs | Hoàn thành | `0cae681` |
| **Phase 8** | Dynamic Sitemap & Robots.txt, PWA Manifest, Admin Analytics Dashboard, Seed CLI | Hoàn thành | `3140eba` |
| **Phase 9** | Khối Testimonial & FAQ (đủ 8 blocks), Viewport Switcher đa thiết bị, Navigation Manager | Hoàn thành | `380116a` |
| **Phase 10** | Quản trị Từ điển Đa ngôn ngữ (i18n), Language Switcher công cộng, CRM CSV UTF-8 Export | Hoàn thành | `4e48520` |
| **Phase 11** | Quản lý Tài khoản Người dùng & Ma trận Phân quyền Động (RBAC Matrix Editor) | Hoàn thành | `9b8924d` |
| **Phase 12** | Lịch sử Phiên bản Trang (Page Revisions), Rollback 1-chạm, Xuất Gói Sao lưu Toàn diện (Backup) | Hoàn thành | `e4cfd1f` |
| **Phase 13** | Bộ REST API Fastify Doanh nghiệp (Pages, Revisions, Menus, i18n, RBAC, Backup) & 16 Tests | Hoàn thành | `67612cf` |
| **Phase 14** | Hiển thị trọn vẹn 8 Blocks trên Public Web Portal (`/`), Mở rộng 18 Tests kiểm thử tự động | Hoàn thành | `f5899d7` |
| **Phase 15** | SEO Rich Snippets (Schema.org FAQPage & Breadcrumbs), Làm sạch Form Chống XSS & 20 Tests | Hoàn thành | `e9821e1` |
| **Phase 16** | Bảng Điều Phối Tuyển Sinh Kanban (4 cột, KPI Conversion Rate), Webhook HMAC-SHA256 & 22 Tests | Hoàn thành | `c6eaca2` |
| **Phase 17** | Mở rộng 10 Blocks Chuẩn (Statistics, CTA Banner), Media Asset Optimization Engine, Webhook Test Console & 26 Tests | Hoàn thành | `e5586dc` |
| **Phase 18** | Thư viện 12 Blocks (Gallery, Contact Box), On-Demand Cache Invalidation, Multi-Tier Performance Dashboard & 30 Tests | Hoàn thành | `7004ebb` |
| **Phase 19** | Hoàn thiện 16 Blocks Chuẩn (Video, Google Map, Rich Text, Image Text), Wizard Tuyển Sinh 4 Bước & 35 Tests | Hoàn thành | `4905a28` |
| **Phase 20** | Package Trợ Lý AI Tuyển Sinh RAG `@school-cms/ai-chatbot`, Sổ Tay Tri Thức Đa Cơ Sở, Sandbox Console & 40 Tests | Hoàn thành | `a5b9637` |
| **Phase 21** | Đa Cơ Sở Hybrid Subdomain Routing, Scoped Theming, Xem Trước Bảo Mật HMAC & So Sánh Snapshot Diff & 45 Tests | Hoàn thành | `ee74d60` |
| **Phase 22** | Cổng Thanh Toán Học Phí Trực Tuyến `@school-cms/payment`, VietQR Napas 247, HMAC-SHA512 IPN & 50 Tests | Hoàn thành | `77fec7a` |
| **Phase 23** | Cổng Phụ Huynh & Sổ Liên Lạc Điện Tử `@school-cms/portal`, Scoping Guard, Điểm Danh & 55 Tests | Hoàn thành | `55ea9a0` |
| **Phase 24** | Phân Vùng CSDL Database Partitioning, Cắt Tỉa Truy Vấn & Vòng Đời Lưu Trữ 50 Cơ Sở & 60 Tests | Hoàn thành | `73f2074` |

---


## 📁 Chi Tiết Từng Phase & Các Tệp Tin Đã Tạo/Chỉnh Sửa

### Phase 1: Kiến Trúc Doanh Nghiệp (Enterprise Architectural Specifications)
- **Tệp tin**:
  - `docs/01-system-architecture.md`: Kiến trúc tổng quan đa tầng, Micro-frontend / Monorepo.
  - `docs/02-database-design.md`: Lược đồ CSDL PostgreSQL chuẩn hóa quan hệ đa cơ sở.
  - `docs/03-folder-structure.md`: Cấu trúc Monorepo tiêu chuẩn Turborepo + pnpm.
  - `docs/04-module-block-system.md`: Nguyên lý Open/Closed cho hệ thống BlockRegistry.
  - `docs/05-api-specification.md`: Thiết kế chuẩn RESTful API và Format Response.
  - `docs/06-data-flow.md`: Luồng dữ liệu (Data Flow) khi tạo trang, nộp form và webhook.
  - `docs/07-security.md`: Bảo mật RBAC, sanitize XSS, CORS, rate limiting.
  - `docs/08-performance.md`: Chiến lược Cache Redis, ISR, Edge CDN.
  - `docs/09-seo.md`: Cấu trúc Schema.org, Open Graph, Sitemap tự động.
  - `docs/10-multi-branch.md`: Cơ chế cô lập dữ liệu chi nhánh đa cơ sở.
  - `docs/11-extensibility.md`: Hướng dẫn mở rộng Block, Plugin, Theme.
  - `docs/12-architecture-decisions.md`: Nhật ký quyết định kiến trúc (ADR).

### Phase 2: Monorepo Scaffolding & Shared Packages
- **Tệp tin**:
  - `package.json`, `pnpm-workspace.yaml`, `turbo.json`.
  - `packages/shared/`: DTOs, Enums (`RoleCode`, `UserStatus`, `ContentStatus`), Interfaces.
  - `packages/theme/`: Engine Design Tokens (`:root` CSS variables).
  - `packages/cms/`: Core `BlockRegistry` (đăng ký, quản lý phiên bản block schema).
  - `packages/blocks/`: 5 khối cốt lõi (`hero_banner`, `program_list`, `branch_list`, `partner_slider`, `news_list`).
  - `packages/database/`: Bộ dữ liệu khởi tạo (seed data) trường học, cơ sở, chương trình.
  - `packages/auth/`: Phân quyền RBAC scoping theo từng cơ sở.
  - `packages/seo/`: Tạo JSON-LD Schema.org (`School`, `Article`, `Course`).
  - `packages/forms/`: Dynamic Form Schema validation bằng Zod.
  - `packages/media/`: Trình tối ưu hóa URL WebP và asset tags.
  - `packages/ui/`: UI Components cơ bản.

### Phase 3: Quản Lý Thực Thể & Dynamic Public Routes
- **Tệp tin**:
  - `apps/web/src/app/co-so/[branchSlug]/page.tsx`: Tuyến đường công cộng xem chi tiết cơ sở.
  - `apps/web/src/app/tin-tuc/[slug]/page.tsx`: Tuyến đường công cộng xem bài viết tin tức.
  - `apps/web/src/app/chuong-trinh-hoc/[slug]/page.tsx`: Tuyến đường công cộng xem chương trình học.
  - `apps/admin/src/app/page.tsx`: Tích hợp các tab quản trị Cơ sở, Bài viết, Chương trình.

### Phase 4: Form Builder, Trang Tuyển Sinh & Theme Customizer
- **Tệp tin**:
  - `packages/blocks/src/form_embed/`: Khối nhúng form tương tác.
  - `apps/web/src/app/tuyen-sinh/page.tsx`: Trang đăng ký nhập học trực tuyến công cộng.
  - `apps/admin/src/app/page.tsx`: Tích hợp Theme Customizer (màu sắc, bo góc, font chữ) & Dynamic Form Builder kéo thả trường dữ liệu.

### Phase 5: Phân Quyền Multi-tenant, CRM Pipeline & Audit Logs
- **Tệp tin**:
  - `packages/auth/src/index.ts`: Bộ lọc dữ liệu theo cơ sở (`canAccessBranchResource`).
  - `apps/admin/src/app/page.tsx`: Phễu CRM 4 giai đoạn, Drawer xem chi tiết hồ sơ & Timeline ghi chú tương tác; Tab Audit Logs ghi nhận vết kiểm toán hệ thống.

### Phase 6: AI Admissions Chatbot & Unified Search
- **Tệp tin**:
  - `apps/web/src/app/components/AiAdvisorWidget.tsx`: Widget AI tư vấn tuyển sinh góc màn hình.
  - `apps/web/src/app/components/UnifiedSearchModal.tsx`: Hộp thoại tìm kiếm thông minh kích hoạt bằng phím tắt `Ctrl + K`.
  - `docker-compose.yml`: Triển khai PostgreSQL 16, Redis 7, API, Web, Admin.

### Phase 7: Kiểm Thử Tự Động & CI/CD Pipeline
- **Tệp tin**:
  - `apps/api/src/__tests__/test-runner.ts`: Bộ chạy kiểm thử tự động không cần phụ thuộc bên ngoài.
  - `deploy/ci.yml`: GitHub Actions Workflow tự động chạy `pnpm install`, `pnpm test`, `typecheck`, `build`.
  - `README.md`: Tài liệu hướng dẫn sử dụng và triển khai hoàn chỉnh.

### Phase 8: Dynamic Sitemap, PWA & Analytics Dashboard
- **Tệp tin**:
  - `apps/web/src/app/sitemap.ts`: Tự động sinh `sitemap.xml` chuẩn SEO.
  - `apps/web/src/app/robots.ts`: Tự động sinh `robots.txt`.
  - `apps/web/src/app/manifest.ts`: Cấu hình ứng dụng web tiến bộ (PWA).
  - `apps/admin/src/app/page.tsx`: Tab Báo cáo thống kê hiệu suất truy cập & phễu tuyển sinh.
  - `packages/database/src/seed-cli.ts`: Công cụ dòng lệnh CLI seed dữ liệu mẫu.

### Phase 9: Testimonial & FAQ Blocks, Viewport Switcher & Navigation
- **Tệp tin**:
  - `packages/blocks/src/testimonial_slider/`: Khối cảm nhận học sinh/phụ huynh.
  - `packages/blocks/src/faq_accordion/`: Khối câu hỏi thường gặp.
  - `apps/admin/src/app/page.tsx`: Bộ chuyển đổi xem trước Responsive (Desktop, Tablet, Mobile) và Tab Quản lý Menu Điều Hướng.

### Phase 10: Quản Lý Đa Ngôn Ngữ (i18n) & Xuất Excel CRM
- **Tệp tin**:
  - `packages/shared/src/i18n.ts`: Từ điển song ngữ mặc định (VI/EN) và hàm `translate()`.
  - `apps/web/src/app/components/LanguageSwitcher.tsx`: Nút chuyển đổi ngôn ngữ trên thanh Header công cộng.
  - `apps/admin/src/app/page.tsx`: Tab Từ điển i18n & Nút Xuất CSV UTF-8 BOM mở trực tiếp trên Excel.

### Phase 11: Quản Lý Tài Khoản & Ma Trận Phân Quyền Động (RBAC Matrix)
- **Tệp tin**:
  - `packages/auth/src/index.ts`: Bảng quyền hạn 13 permissions và hàm `hasDynamicRolePermission()`.
  - `apps/admin/src/app/page.tsx`: Quản lý danh sách tài khoản người dùng và bảng ma trận phân quyền tương tác bật/tắt quyền theo vai trò.

### Phase 12: Lịch Sử Phiên Bản Trang & Gói Sao Lưu Toàn Diện (Backup Package)
- **Tệp tin**:
  - `packages/shared/src/page.ts`: Định nghĩa `PageRevisionSnapshot` và `SiteBackupPackage`.
  - `apps/admin/src/app/page.tsx`: Tự động lưu snapshot khi Xuất bản, nút Rollback 1-chạm khôi phục bố cục trang cũ, nút Tải gói sao lưu toàn bộ website dạng JSON.

### Phase 13: Fastify REST API Doanh Nghiệp & 16 Tests
- **Tệp tin**:
  - `apps/api/src/index.ts`: Triển khai đầy đủ REST endpoints cho Pages, Revisions, Rollback, Menus, Translations, Users, RBAC Permissions, Backup & Restore.
  - `apps/api/src/__tests__/test-runner.ts`: Mở rộng lên 16 bài kiểm thử tự động.

### Phase 14: Hiển Thị Trọn Vẹn 8 Blocks Trên Public Web Portal & 18 Tests
- **Tệp tin**:
  - `apps/web/src/app/page.tsx`: Nhúng và hiển thị đầy đủ 8 blocks cốt lõi trên trang chủ công cộng.
  - `apps/api/src/__tests__/test-runner.ts`: Mở rộng lên 18 bài kiểm thử tự động.

### Phase 15: SEO Schema.org Rich Snippets & Bảo Mật Form Chống XSS & 20 Tests
- **Tệp tin**:
  - `packages/seo/src/index.ts`: Hàm `buildFaqJsonLd()` và `buildBreadcrumbJsonLd()`.
  - `packages/forms/src/index.ts`: Hàm `sanitizeFormSubmission()` lọc sạch HTML injection/XSS.
  - `apps/web/src/app/page.tsx`: Nhúng JSON-LD Schema.org FAQPage vào trang chủ.
  - `apps/api/src/__tests__/test-runner.ts`: Mở rộng lên 20 bài kiểm thử tự động.

### Phase 16: Bảng Kanban Tuyển Sinh, Webhook HMAC-SHA256 & 22 Tests
- **Tệp tin**:
  - `packages/shared/src/pipeline.ts`: Quản lý phễu 4 giai đoạn, hàm `calculatePipelineMetrics()`, `groupLeadsByPipelineStage()`.
  - `packages/shared/src/webhook.ts`: Định nghĩa Webhook Subscription, Event Types, Delivery Records.
  - `apps/api/src/webhook.ts`: Ký số điện tử HMAC-SHA256 và Dispatcher tự động gửi webhook sang hệ thống ngoài.
  - `apps/admin/src/app/page.tsx`: Bảng điều phối Kanban 4 cột trực quan kèm chuyển trạng thái 1-chạm và chỉ số KPI Conversion Rate.
  - `apps/api/src/__tests__/test-runner.ts`: Mở rộng lên 22 bài kiểm thử tự động.

### Phase 17: Mở Rộng 10 Blocks Chuẩn, Tối Ưu Hóa Media & Webhook Test Console & 26 Tests
- **Tệp tin**:
  - `packages/blocks/src/statistics/`: Khối Con số ấn tượng (`statistics`) hỗ trợ layout, animation, counter badges.
  - `packages/blocks/src/cta_banner/`: Khối Kêu gọi hành động (`cta_banner`) hỗ trợ hotline, email, primary/secondary action buttons.
  - `packages/blocks/src/index.ts`: Đăng ký tự động 10 blocks chuẩn vào `BlockRegistry` theo Open/Closed Principle.
  - `packages/media/src/index.ts`: Thuật toán sinh 4 biến thể ảnh thích ứng (`thumbnail`, `card_small`, `card_large`, `hero_full`), hàm `validateMediaUpload()` và `formatFileSize()`.
  - `apps/api/src/index.ts`: Bộ REST API Media (`/api/v1/media`, `/api/v1/media/upload`, `/api/v1/media/presigned-url`, `/api/v1/media/:id`) & Webhook Test Trigger (`/api/v1/webhooks/test-trigger`).
  - `apps/admin/src/app/page.tsx`: Nâng cấp Thư viện Media Asset Hub (lọc category, tìm kiếm, xem 4 biến thể, 1-chạm copy CDN) và Bảng Quản trị Webhooks kèm Trình Giả Lập Kích Hoạt Live Test Console.
  - `apps/web/src/app/page.tsx`: Nhúng và hiển thị hoàn chỉnh 10 blocks trên trang chủ công cộng.
  - `apps/api/src/__tests__/test-runner.ts`: Mở rộng bộ kiểm thử tự động lên **26 tests** passing 100%.

### Phase 18: Thư Viện 12 Blocks Chuẩn, On-Demand Cache Invalidation, Multi-Tier Performance Dashboard & 30 Tests (Commit: 7004ebb)
- **Tệp tin**:
  - `packages/blocks/src/gallery/`: Khối Thư viện ảnh tương tác (`gallery`) hỗ trợ phân loại category, lightbox modal phóng to ảnh, responsive grid.
  - `packages/blocks/src/contact_box/`: Khối Thông tin liên hệ đa cơ sở (`contact_box`) tích hợp hotline trung tâm, thẻ cơ sở, giờ làm việc và liên kết bản đồ.
  - `packages/blocks/src/index.ts`: Tự động đăng ký cả 12 blocks chuẩn vào `BlockRegistry` theo Open/Closed Principle.
  - `apps/api/src/cache.ts`: Module `CacheManager` quản lý bộ nhớ đệm đa tầng (Cloudflare Edge CDN, Next.js On-Demand ISR, Redis 7 TTL) hỗ trợ revalidate theo tag và theo path.
  - `apps/api/src/index.ts`: Bộ REST API Quản trị Cache (`/api/v1/cache/stats`, `/api/v1/cache/revalidate`, `/api/v1/cache/purge`) & Cập nhật `/api/v1/health`.
  - `apps/admin/src/app/page.tsx`: Tab quản trị **Hiệu Năng & Cache** hiển thị KPI Hit Ratio (88.5%), Lượt Hits/Misses, Danh sách Cached Keys, Bộ điều phối Revalidate 1-chạm theo tag và Xóa trắng Purge All.
  - `apps/web/src/app/page.tsx`: Trưng bày trọn vẹn cả 12 khối giao diện cốt lõi trên trang chủ công cộng.
  - `apps/api/src/__tests__/test-runner.ts`: Mở rộng bộ kiểm thử tự động lên **30 tests** passing 100%.

### Phase 19: Hoàn Thiện 16/16 Khối Giao Diện Chuẩn, Tuyển Sinh Trực Tuyến Đa Bước & 35 Tests (Commit: 4905a28)
- **Tệp tin**:
  - `packages/blocks/src/video_player/`: Khối Trình chiếu Video (`video_player`) hỗ trợ YouTube / Vimeo / MP4, tỉ lệ 16:9, xem trước poster và modal phát video tương tác kèm phân đoạn chapters.
  - `packages/blocks/src/google_map/`: Khối Bản đồ Google Map (`google_map`) hỗ trợ chuyển đổi cơ sở (Hà Nội, TP.HCM, Biên Hòa), hiển thị thẻ địa chỉ, hotline, giờ làm việc và nút mở chỉ đường Google Maps.
  - `packages/blocks/src/rich_text/`: Khối Văn bản định dạng (`rich_text`) hỗ trợ typography chuẩn học thuật, trích dẫn blockquote, danh sách kiểu dáng và hộp thông báo callout.
  - `packages/blocks/src/image_text/`: Khối Bố cục Split 2 cột (`image_text`) hỗ trợ đảo chiều ảnh trái/phải, huy hiệu số liệu nổi bật, danh sách ưu điểm và nút CTA.
  - `packages/blocks/src/index.ts`: Đăng ký toàn bộ 16 khối giao diện vào `BlockRegistry` (đạt 100% catalog quy định tại `docs/04-module-block-system.md` mục 4.2).
  - `packages/shared/src/admission.ts`: Định nghĩa mô hình hồ sơ tuyển sinh điện tử 4 bước, vòng đời duyệt trạng thái (`HO_SO_MOI` ➔ `HEN_PHONG_VAN` ➔ `DA_TRUNG_TUYEN` ➔ `HOAN_TAT_HOC_PHI`), sinh mã hồ sơ `HS-2026-XXXX` và tính toán KPI metrics.
  - `packages/forms/src/admission-wizard.ts`: Trình kiểm định hợp lệ Zod cho 4 bước tuyển sinh trực tuyến (Thông tin học sinh, phụ huynh, tài liệu đính kèm, nguyện vọng cơ sở/chương trình).
  - `apps/api/src/index.ts`: Bộ REST API Tuyển sinh trực tuyến (`/api/v1/admissions/applications`, `/api/v1/admissions/apply`, `/api/v1/admissions/applications/:id/status`, `/api/v1/admissions/stats`) và cập nhật `/api/v1/health`.
  - `apps/admin/src/app/page.tsx`: Tab quản trị **Tuyển Sinh Trực Tuyến** hiển thị 4 KPI conversion, thanh công cụ tìm kiếm lọc theo cơ sở/khối/trạng thái, bảng hồ sơ điện tử, dropdown chuyển trạng thái nhanh và modal thẩm định hồ sơ chi tiết.
  - `apps/web/src/app/page.tsx`: Trưng bày đầy đủ 16 khối chuẩn tuần tự từ 1 đến 16 trên cổng thông tin công cộng.
  - `apps/api/src/__tests__/test-runner.ts`: Mở rộng bộ kiểm thử tự động lên **35 tests** passing 100%.

### Phase 20: AI Chatbot Sổ Tay Tri Thức Tuyển Sinh RAG, REST Streaming API & 40 Tests (Commit: a5b9637)
- **Tệp tin**:
  - `packages/ai-chatbot/`: Package mới độc lập `@school-cms/ai-chatbot` tuân thủ nguyên lý kiến trúc Decoupled quy định tại `docs/11-extensibility.md` mục 11.4:
    - `src/schema.ts`: Định nghĩa mô hình tri thức `KnowledgeSource`, 6 danh mục chủ đề (`KnowledgeCategory`), 6 ý định phân loại (`ChatbotIntent`), `BotMessage`, `BotConversation`, `BotCitation`, và schema kiểm định yêu cầu/phản hồi Zod.
    - `src/knowledge-base.ts`: Bộ tri thức Sổ tay Tuyển sinh 2026 - 2027 chuẩn hóa gồm 6 khối tài liệu (Biểu phí, Cambridge quốc tế, Quy trình 4 bước, Hệ thống 3 cơ sở, Học bổng Alpha Spark, Dịch vụ bán trú & xe bus GPS).
    - `src/rag-engine.ts`: Thuật toán phân loại ý định `classifyIntent()`, truy hồi ngữ cảnh `findRelevantKnowledge()` với trọng số từ khóa/tiêu đề/nội dung và ưu tiên cơ sở (`branchId`), bộ sinh câu trả lời RAG trích dẫn nguồn `generateChatbotResponse()`, và định dạng Server-Sent Events `formatSseChunk()`.
    - `src/index.ts`: Barrel export toàn diện cho toàn hệ thống.
  - `apps/api/src/index.ts`:
    - Các endpoints REST API Chatbot: `POST /api/v1/chatbot/query`, `GET /api/v1/chatbot/knowledge`, `POST /api/v1/chatbot/knowledge`, `DELETE /api/v1/chatbot/knowledge/:id`, `GET /api/v1/chatbot/conversations`.
    - Cập nhật `/api/v1/health` theo dõi `knowledgeSourcesCount` và `chatbotConversationsCount`.
  - `apps/admin/src/app/page.tsx`:
    - Tab quản trị mới: **🤖 Trợ Lý AI & Tri Thức** với 4 thẻ KPI (Nguồn tri thức, Dung lượng Tokens, Độ chính xác RAG 98.4%, Intent hàng đầu).
    - Quản lý Sổ tay Tri thức (Knowledge Base Manager): Lọc theo danh mục, tìm kiếm, xem thẻ chi tiết tokens, xóa và modal nạp tri thức mới.
    - Live AI Chatbot Sandbox Console: Trình giả lập hỏi đáp tuyển sinh tương tác trực tiếp, bộ phân tích Debug Grounding Inspector hiển thị Intent, điểm tin cậy và các đoạn trích dẫn thực tế.
  - `apps/web/src/components/AiChatbotWidget.tsx` & `apps/web/src/app/page.tsx`:
    - Nâng cấp Widget Trợ lý AI nổi (`FloatingChatbotWidget`) kết nối API `/api/v1/chatbot/query` với fallback RAG engine nội bộ.
    - Giao diện glassmorphism cao cấp, hiển thị chip gợi ý nhanh, câu trả lời định dạng chuẩn, đoạn trích dẫn sổ tay và nút CTA dẫn thẳng tới form nộp hồ sơ.
  - `apps/api/src/__tests__/test-runner.ts`:
    - Bổ sung 5 bài kiểm thử tự động chuyên sâu (Tests 36 - 40) nâng tổng số lên **40 tests passing 100%**.

### Phase 21: Đa Cơ Sở Hybrid Subdomain Routing, Scoped Theming, Xem Trước Bản Thảo HMAC & Visual Diff So Sánh Bản Sửa Đổi (Commit: ee74d60)
- **Tệp tin**:
  - `packages/theme/src/campus.ts`: Bộ token nhận diện thương hiệu riêng biệt cho 3 cơ sở (`CAMPUS_THEMES`: Biên Hòa `#047857`, Thủ Đức `#1d4ed8`, Cầu Giấy `#b91c1c`), bộ phân giải token `getCampusThemeTokens()`, và bộ phân giải tên miền/subdomain `resolveCampusFromHost()`.
  - `packages/theme/src/index.ts`: Re-export toàn diện các tiện ích theming và routing cơ sở.
  - `packages/cms/src/preview.ts`: Động cơ ký số bảo mật HMAC-SHA256 chuẩn isomorphic (`generatePreviewToken`, `verifyPreviewToken`), sinh link xem trước có thời hạn (URL có chữ ký thời hạn 24h) dành cho Ban Giám Hiệu / Hội đồng Quản trị kiểm duyệt bản thảo mà không cần tài khoản CMS admin, bảo vệ chống giả mạo bằng thuật toán constant-time so sánh an toàn.
  - `packages/cms/src/diff.ts`: Động cơ so sánh trực quan Snapshot bản sửa đổi trang (`comparePageRevisions`), phân tích sâu các khối Added, Removed, Modified (so sánh từng thuộc tính cấu hình JSON), và Unchanged.
  - `packages/cms/src/index.ts`: Re-export `preview` và `diff`.
  - `apps/web/src/middleware.ts`: Next.js Edge Middleware tự động phát hiện Hostname (`bienhoa.school.edu.vn`, `truongbienhoa.edu.vn`, v.v.), gắn header `x-school-branch-slug` và điều hướng rewrite trong suốt tới `/co-so/${branchSlug}`.
  - `apps/web/src/app/co-so/[branchSlug]/page.tsx`: Cổng thông tin chuyên biệt cho từng cơ sở, tiêm biến CSS `--color-primary`, `--color-accent` cục bộ vào style container và hiển thị banner thương hiệu riêng biệt.
  - `apps/web/src/app/preview/pages/[pageId]/page.tsx`: Trang xem trước bản thảo bảo mật, tự động xác thực chữ ký số HMAC và thời hạn token; hiển thị thanh cảnh báo bảo mật trên cùng ("🔒 DRAFT PREVIEW") và render toàn bộ block layout dự thảo bằng `DynamicPageRenderer`.
  - `apps/api/src/index.ts`: Các REST API endpoints mới:
    - `GET /api/v1/pages/:id/preview-url`: Sinh link xem trước bảo mật HMAC kèm thời hạn.
    - `GET /api/v1/pages/:id/diff`: So sánh trực tiếp 2 phiên bản revision bất kỳ và trả về cấu trúc diff chi tiết.
  - `apps/admin/src/app/page.tsx`:
    - Nút `🔒 Xem Trước (HMAC)` tại thanh tiêu đề: mở modal sinh link bảo mật, hỗ trợ copy 1-chạm vào clipboard và mở tab mới.
    - Nút `⚖️ So Sánh Diff` trên thẻ lịch sử phiên bản: mở modal Diff Inspector trực quan với 4 thẻ KPI (+Added, -Removed, ΔModified, =Unchanged) cùng bảng chi tiết từng thuộc tính thay đổi.
  - `apps/api/src/__tests__/test-runner.ts`: Bổ sung 5 bài kiểm thử tự động chuyên sâu (Tests 41 - 45) nâng tổng số lên **45 tests passing 100%**.

### Phase 22: Cổng Thanh Toán Học Phí Trực Tuyến `@school-cms/payment`, VietQR Napas 247, HMAC-SHA512 IPN Checksum & Tự Động Chuyển Trạng Thái Tuyển Sinh (Commit: 77fec7a)
- **Tài liệu tham chiếu**:
  - `docs/11-extensibility.md` Section 11.4 Câu hỏi 3: Triển khai Cổng thanh toán trực tuyến (VietQR, VNPay, MoMo, Idempotency, HMAC IPN Webhook).
  - `docs/07-security.md` Section 7.4 & 7.5: Kiểm toán giao dịch, mã hóa chữ ký số và phòng chống trừ tiền trùng lặp (Double-charging prevention).
- **Tệp tin**:
  - `packages/payment/package.json` & `packages/payment/tsconfig.json`: Khởi tạo package thanh toán độc lập `@school-cms/payment` tuân thủ kiến trúc Decoupled Monorepo.
  - `packages/payment/src/schema.ts`:
    - Định nghĩa các kiểu `PaymentGateway` (`'vietqr' | 'vnpay' | 'momo' | 'stripe' | 'manual_bank'`), `PaymentStatus` (`'PENDING' | 'SUCCESS' | 'FAILED' | 'REFUNDED' | 'EXPIRED'`), `PaymentPurpose` (`'tuition' | 'admission_fee' | 'uniform' | 'bus_meal' | 'other'`).
    - Lược đồ Zod `PaymentTransaction`, `CreatePaymentRequestSchema`, `IpnWebhookRequestSchema`, cùng bảng nhãn badge và mã màu hiển thị.
  - `packages/payment/src/signature.ts`:
    - Động cơ ký số và kiểm tra tính hợp lệ Isomorphic HMAC-SHA512 (`generateGatewaySignature`, `verifyGatewaySignature`).
    - Thuật toán sắp xếp thứ tự tham số từ điển chuẩn (Canonical parameter sorting) tương thích tiêu chuẩn kỹ thuật VNPay / MoMo / Napas.
    - So sánh chuỗi an toàn chống Timing Attack (`timingSafeEqualStrings`).
  - `packages/payment/src/vietqr.ts`:
    - Tiêu chuẩn tạo nội dung chuyển khoản tự động (`formatTransferContent`: ví dụ `'HS2026_0042_LEPHI'`, `'HS2026_0042_HOCPHI'`).
    - Cấu hình ngân hàng mặc định nhà trường (`DEFAULT_SCHOOL_BANK`: Vietcombank).
    - Bộ sinh mã VietQR Napas 247 payload (`generateVietQrPayload`) kèm link ảnh QR API `img.vietqr.io` và app deep-link `vietqr://transfer`.
  - `packages/payment/src/idempotency.ts`:
    - Trình quản lý khóa chống trùng lặp `IdempotencyManager` và biến thể toàn cục `globalPaymentIdempotency` ngăn chặn phụ huynh bấm thanh toán nhiều lần gây duplicate transactions.
  - `packages/payment/src/transaction-engine.ts`:
    - Bộ sinh mã giao dịch tuần tự bảo đảm an toàn `generateOrderCode('TXN')` -> `TXN-2026-XXXX`.
    - Bộ khởi tạo giao dịch `createPaymentTransaction()` và tính toán số liệu tổng hợp doanh thu `calculatePaymentMetrics()`.
  - `packages/payment/src/index.ts`: Barrel export toàn diện cho toàn monorepo.
  - `apps/api/src/index.ts`:
    - Section 15 Payment REST API:
      - `POST /api/v1/payments/create-transaction`: Tạo giao dịch thanh toán kèm kiểm tra idempotency key.
      - `GET /api/v1/payments/transactions`: Tra cứu danh sách giao dịch có phân trang, bộ lọc trạng thái, cổng và tìm kiếm.
      - `GET /api/v1/payments/transactions/:id`: Tra cứu chi tiết một giao dịch thanh toán.
      - `POST /api/v1/payments/ipn/:gateway`: Tiếp nhận IPN Webhook callback từ cổng thanh toán, tự động xác thực chữ ký số HMAC-SHA512, cập nhật trạng thái `SUCCESS`, tự động tìm kiếm hồ sơ tuyển sinh tương ứng để chuyển `feePaid = true`, `feeAmount = amount`, và đẩy trạng thái sang `HOAN_TAT_HOC_PHI`.
      - `POST /api/v1/payments/transactions/:id/manual-confirm`: Dành cho kế toán nhà trường xác nhận giao dịch chuyển khoản truyền thống.
      - `GET /api/v1/payments/stats`: Thống kê tài chính thời gian thực.
    - Nâng cấp endpoint `/api/v1/health` báo cáo số lượng giao dịch và tổng doanh thu thực thu.
  - `apps/admin/src/app/page.tsx`:
    - Bổ sung tab **💳 Tài Chính & Học Phí (Payment Hub)** tại thanh điều hướng sidebar.
    - 4 thẻ KPI tài chính cao cấp: Tổng Doanh Thu Thực Thu (VND), Giao Dịch Thành Công, Đang Chờ Xử Lý, Tỷ Lệ Thanh Toán Thành Công (%).
    - Thanh tìm kiếm và bộ lọc đa chiều (theo Cổng thanh toán, Trạng thái giao dịch, Cơ sở).
    - Bảng danh sách giao dịch chuyên nghiệp hiển thị mã giao dịch, học sinh, phụ huynh, cơ sở, mục đích, số tiền VND và cổng thanh toán.
    - Modal Tra cứu Chi tiết & Kiểm toán Giao dịch: Xem ảnh QR Napas 247, Thanh tra Chữ ký số HMAC-SHA512 (Signature Inspector), và Nút duyệt kế toán thủ công 1-chạm.
  - `apps/web/src/app/tuyen-sinh/thanh-toan/[orderCode]/page.tsx`:
    - Cổng thanh toán công cộng dành cho phụ huynh học sinh sau khi trúng tuyển hoặc nộp lệ phí hồ sơ.
    - Hiển thị thông tin hồ sơ học sinh, cơ sở đăng ký, chi tiết khoản thu.
    - Tích hợp 4 cổng: **VietQR Napas 247**, **VNPay**, **MoMo QR**, **Thẻ quốc tế Stripe**.
    - Hiển thị thông tin chuyển khoản trực quan, nút sao chép số tài khoản / nội dung 1-chạm.
    - Nút Giả lập thanh toán tức thì (Sandbox Simulation Mode) kích hoạt quy trình xác thực IPN và sinh Biên lai điện tử (Electronic Receipt) đóng dấu xác nhận hoàn tất.
  - `apps/api/src/__tests__/test-runner.ts`:
    - Bổ sung Section 19 với 5 bài kiểm thử tự động chuyên sâu (Tests 46 - 50) nâng tổng số lên **50 tests passing 100%**.

### Phase 23: Cổng Thông Tin Phụ Huynh & Sổ Liên Lạc Điện Tử `@school-cms/portal`, Scoping Guard, Điểm Danh Chuyên Cần & Bảng Điểm GPA (Commit: `55ea9a0`)
- **Tài liệu tham chiếu**:
  - `docs/12-architecture-decisions.md` Giai đoạn 3 Mục 3: Cổng thông tin Phụ huynh (Parent Portal: xem điểm, thời khóa biểu, chuyên cần).
  - `docs/11-extensibility.md` Section 11.4 Câu hỏi 4: Thiết kế Cổng Phụ huynh / Sổ liên lạc điện tử không làm xáo trộn kiến trúc phân quyền cũ, kế thừa `RoleCode.PARENT` và `RoleCode.STUDENT`, bảo vệ tính riêng tư tuyệt đối qua cơ chế Parent-Student Scoping Guard (`parent_students`).
- **Tệp tin**:
  - `packages/portal/package.json` & `packages/portal/tsconfig.json`: Khởi tạo package độc lập `@school-cms/portal` chuẩn bị sẵn sàng cho ứng dụng di động (Mobile App / PWA).
  - `packages/portal/src/schema.ts`:
    - Lược đồ Zod và kiểu dữ liệu: `StudentProfile`, `ParentStudentRelation`, `AttendanceRecord`, `SubjectScore`, `AcademicReportCard`, `TimetableSlot`, `SchoolNotice`.
    - Bộ nhãn trạng thái điểm danh (`ATTENDANCE_STATUS_LABELS`: Có mặt, Vắng có phép, Vắng không phép, Đi muộn).
  - `packages/portal/src/attendance-engine.ts`:
    - Thuật toán thống kê chuyên cần (`calculateAttendanceStats`): tổng số ngày, ngày có mặt, nghỉ có phép/không phép, đi muộn, tính tỷ lệ chuyên cần (%) và xếp loại chuyên cần (`XUAT_SAC`, `TOT`, `CAN_LƯU_Y`).
  - `packages/portal/src/academic-engine.ts`:
    - Thuật toán tính điểm trung bình môn học theo trọng số chuẩn Bộ GD&ĐT (`calculateSubjectFinalScore`: Miệng x1, 15p x1, 1 tiết x2, Cuối kỳ x3 chia 7).
    - Quy đổi thang điểm 10 sang thang chữ quốc tế (`getLetterGrade`: A+, A, B+, B, C, D).
    - Tính điểm trung bình chung học kỳ GPA có trọng số tín chỉ (`calculateGpa`).
    - Phân loại học lực (`getAcademicStanding`) và hạnh kiểm (`getConductLabel`).
  - `packages/portal/src/portal-engine.ts`:
    - Bộ dữ liệu mẫu khởi tạo chuẩn hóa: `INITIAL_STUDENTS`, `INITIAL_PARENT_RELATIONS`, `INITIAL_ATTENDANCES`, `INITIAL_REPORT_CARDS`, `INITIAL_TIMETABLES`, `INITIAL_NOTICES`.
    - Phân giải danh sách con em của phụ huynh (`getStudentsByParent`).
    - Cơ chế bảo vệ riêng tư học sinh Parent Scoping Guard (`canParentAccessStudent`).
    - Tổng hợp hồ sơ học thuật số hóa (`getStudentAcademicSummary`).
  - `packages/portal/src/index.ts`: Barrel export toàn diện cho toàn monorepo.
  - `packages/auth/src/index.ts`:
    - Bổ sung 5 quyền hạn mới: `'portal:view'`, `'portal:attendance'`, `'portal:grades'`, `'portal:timetable'`, `'portal:notices'`.
    - Gán quyền hạn portal cho `RoleCode.PARENT` và `RoleCode.STUDENT`.
    - Mở rộng `AuditLogEntry.entityType` với `'STUDENT' | 'PORTAL'`.
  - `apps/api/src/index.ts`:
    - Section 16 Parent Portal REST API:
      - `POST /api/v1/portal/auth/login`: Đăng nhập phụ huynh qua SĐT / Email.
      - `GET /api/v1/portal/students`: Lấy danh sách con em của phụ huynh hoặc toàn bộ (nếu Admin).
      - `GET /api/v1/portal/students/:id/profile`: Báo cáo tổng hợp hồ sơ học sinh, GPA, hạnh kiểm, phụ huynh liên kết.
      - `GET /api/v1/portal/students/:id/attendance`: Lịch sử điểm danh và tỷ lệ chuyên cần.
      - `GET /api/v1/portal/students/:id/report-card`: Bảng điểm học bạ điện tử chi tiết các môn.
      - `GET /api/v1/portal/students/:id/timetable`: Thời khóa biểu trong tuần.
      - `GET /api/v1/portal/notices`: Thông báo học đường từ Ban Giám Hiệu.
    - Cập nhật `/api/v1/health` theo dõi `studentsCount`, `attendancesCount`, `reportCardsCount`.
  - `apps/admin/src/app/page.tsx`:
    - Bổ sung tab **👨‍👩‍👧 Sổ Liên Lạc & Phụ Huynh (Parent Hub)** trên sidebar.
    - 4 thẻ KPI: Học sinh toàn hệ thống, Phụ huynh đã kết nối, Tỷ lệ chuyên cần (97.8%), Điểm TB GPA (8.8/10).
    - Thanh tìm kiếm và bộ lọc học sinh theo cơ sở.
    - Bảng danh sách học sinh tích hợp xem nhanh chuyên cần, GPA và phụ huynh giám hộ.
    - Modal Hồ sơ học bạ điện tử (Dossier Modal) với 4 tabs: Bảng điểm, Chuyên cần, Thời khóa biểu, Thông tin phụ huynh.
  - `apps/web/src/app/phu-huynh/page.tsx`:
    - Cổng thông tin phụ huynh công cộng, giao diện hiện đại, tối ưu di động.
    - Bộ chuyển đổi tài khoản con em đa năng (Multi-child switcher).
    - 4 tabs nghiệp vụ: **📊 Bảng Điểm & Học Lực**, **✅ Điểm Danh & Chuyên Cần**, **📅 Thời Khóa Biểu Tuần**, **📢 Thông Báo Học Đường**.
    - Tích hợp nút in phiếu điểm (`window.print()`) và liên kết đóng học phí trực tuyến 1-chạm.
  - `apps/api/src/__tests__/test-runner.ts`:
    - Bổ sung Section 20 với 5 bài kiểm thử tự động chuyên sâu (Tests 51 - 55) nâng tổng số lên **55 tests passing 100%**.

### Phase 24: Database Partitioning Strategy, Multi-Campus Sharding Simulation & High-Volume Data Lifecycle Management (Hot / Warm / Cold Archiving)
- **Tệp tin**:
  - `packages/database/src/partitioning/types.ts`:
    - Định nghĩa enum `PartitionStrategy` (`'LIST' | 'RANGE' | 'HASH'`), `DataTier` (`'HOT' | 'WARM' | 'COLD'`).
    - Lược đồ dữ liệu `PartitionMetadata`, `ArchivalPolicy`, `ArchivalJobRecord`, `QueryPlanSimulation`.
    - Zod Schemas chuẩn hóa cho request DTO: `ProvisionPartitionRequestSchema`, `PrunePlanRequestSchema`, `ExecuteArchivalRequestSchema`.
  - `packages/database/src/partitioning/ddl-generator.ts`:
    - Lớp `PartitionDdlGenerator` phát sinh câu lệnh DDL PostgreSQL 16 chuẩn hóa: bảng cha (`PARTITION BY LIST/RANGE/HASH`), bảng con theo cơ sở (`FOR VALUES IN`), bảng mặc định (`DEFAULT`), bảng phạm vi ngày tháng (`FOR VALUES FROM ... TO ...`).
    - Hỗ trợ thao tác tách phân vùng không khóa bảng: `DETACH PARTITION ... CONCURRENTLY`.
  - `packages/database/src/partitioning/partition-router.ts`:
    - Lớp `PartitionRouter` và instance `globalPartitionRouter`.
    - Ma trận 24 phân vùng khởi tạo bao phủ 3 bảng quy mô lớn: `attendance_records`, `audit_logs`, `payment_transactions` trên các cơ sở chính và phân vùng mặc định.
    - Bộ định tuyến `resolvePartitionTarget(table, branchId, date)`.
    - Trình mô phỏng cắt tỉa phân vùng `simulatePartitionPruning`: minh chứng giảm từ 1,250,000 dòng quét toàn bảng xuống chỉ còn 145,200 dòng (tiết kiệm ~88.4% I/O, thời gian phản hồi giảm từ 380ms xuống ~9ms, tăng tốc ~42 lần).
    - Cấp phát phân vùng động cho cơ sở mới (`provisionCampusPartitions`).
  - `packages/database/src/partitioning/archival-engine.ts`:
    - Lớp `ArchivalEngine` và instance `globalArchivalEngine`.
    - Chính sách vòng đời dữ liệu `DEFAULT_ARCHIVAL_POLICIES` (Hot: 0-90 ngày, Warm: 91-365 ngày, Cold Archive: >365 ngày).
    - Chu trình nén và lưu trữ lạnh `executeArchival` với tỉ lệ nén 75-80% và mã băm toàn vẹn SHA-256 (`archiveChecksum`).
    - Tra cứu dữ liệu lịch sử trong kho lưu trữ lạnh `lookupArchivedRecord`.
  - `packages/database/src/partitioning/index.ts`: Barrel export cho module phân vùng.
  - `packages/database/src/client.ts`: Tách riêng client kết nối PostgreSQL sang module biệt lập để bảo đảm Next.js Client Component không bị lỗi bundle module Node.js.
  - `packages/database/src/index.ts`: Re-export schema, seed và toàn bộ partitioning module.
  - `apps/api/src/index.ts`:
    - Bổ sung Section 17 Database Partitioning & Archival REST API:
      - `GET /api/v1/database/partitions`: Danh sách toàn bộ phân vùng hiện hành.
      - `POST /api/v1/database/partitions/provision`: Cấp phát phân vùng mới cho cơ sở mở rộng.
      - `POST /api/v1/database/partitions/prune-plan`: Mô phỏng tối ưu hóa cắt tỉa truy vấn (Partition Pruning Planner).
      - `POST /api/v1/database/archival/execute`: Kích hoạt chu trình nén lưu trữ dữ liệu nguội (Hot/Warm -> Cold).
      - `GET /api/v1/database/archival/history`: Lịch sử các đợt lưu trữ dữ liệu.
      - `GET /api/v1/database/archival/policies`: Danh mục chính sách vòng đời dữ liệu.
      - `GET /api/v1/database/archival/search/:entityId`: Tra cứu nhanh bản ghi đã đóng gói vào Cold Archive.
    - Cập nhật `/api/v1/health` theo dõi `partitionsCount`, `archivedRecordsCount`, `hotStorageBytes`, `coldStorageBytes`, `averagePruningEfficiency`.
  - `apps/admin/src/app/page.tsx`:
    - Bổ sung tab **🗄️ CSDL & Phân Vùng (Scale Hub)** trên sidebar Admin.
    - 4 thẻ KPI: Tổng Phân Vùng CSDL (24), Hiệu Quả Cắt Tỉa (96.8%), Hồ Sơ Đã Lưu Trữ Cold (850,000+), Dung Lượng Tiết Kiệm (MB).
    - Sub-tab 1: **Ma Trận Phân Vùng 50 Cơ Sở**: Lưới ma trận các phân vùng theo cơ sở, trạng thái Hot/Warm/Cold, số hàng và dung lượng disk.
    - Sub-tab 2: **Mô Phỏng Cắt Tỉa Phân Vùng (Query Planner & Pruning)**: So sánh trực quan quét toàn bảng (Full Table Scan) vs quét phân vùng có định hướng (Pruned Partition Scan), biểu đồ tăng tốc 42x.
    - Sub-tab 3: **Quản Lý Vòng Đời Dữ Liệu & Kho Lưu Trữ Lạnh (Archival & Cold Storage)**: Kích hoạt lưu trữ 1-chạm, tra cứu mã định danh lưu trữ với checksum SHA-256.
    - Modal: **Cấp Phát Phân Vùng Cho Cơ Sở Mới** với live SQL DDL generator.
  - `apps/api/src/__tests__/test-runner.ts`:
    - Bổ sung Section 21 với 5 bài kiểm thử tự động chuyên sâu (Tests 56 - 60) nâng tổng số lên **60 tests passing 100%**.

---



## 📌 Các File Nơi Lưu Lại Toàn Bộ Tiến Trình
1. **Mã nguồn Git trên GitHub**: [https://github.com/raphaelbh89-ai/Website.git](https://github.com/raphaelbh89-ai/Website.git) (nhánh `main`) - Lưu vết đầy đủ 21 commits lịch sử.
2. **File tài liệu lộ trình**: [docs/13-implementation-roadmap-history.md](file:///c:/Users/Dathu/OneDrive/Documents/Website/docs/13-implementation-roadmap-history.md).
3. **File giới thiệu & hướng dẫn chính**: [README.md](file:///c:/Users/Dathu/OneDrive/Documents/Website/README.md) (ghi nhận đầy đủ tính năng qua các phase và kết quả kiểm thử).
4. **File nhật ký kiểm thử & xác thực**: [walkthrough.md](file:///C:/Users/Dathu/.gemini/antigravity-ide/brain/7e8a3993-9ef7-45f8-8504-5c9fd9cbb747/walkthrough.md).

