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
│   ├── blocks/        # Thư viện 8 block chuẩn (HeroBanner, ProgramList, PartnerSlider, BranchList, NewsList, FormEmbed, TestimonialSlider, FaqAccordion)
│   ├── cms/           # BlockRegistry singleton, Schema Resolver, Versioning & Migrations
│   ├── auth/          # Ma trận phân quyền RBAC (13 permissions) & Kiểm tra phạm vi cơ sở (canAccessBranchResource)
│   ├── database/      # Drizzle ORM Schema PostgreSQL 16 (35 bảng, UUIDv7, Soft Delete) & Seed Data
│   ├── forms/         # Dynamic Form schema validation & builder core
│   ├── media/         # Quản lý tệp tin, tối ưu hóa WebP & CDN URLs
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

### 2. Thư Viện 8 Khối Giao Diện Cốt Lõi (Open/Closed Architecture)
1. `hero_banner`: Banner lớn, ảnh nền, overlay opacity, slogan và nút kêu gọi hành động (CTA).
2. `program_list`: Danh sách chương trình đào tạo chuẩn quốc tế (Mầm non, Tiểu học, Trung học & Tú tài).
3. `partner_slider`: Băng chuyền đối tác học thuật quốc tế (Cambridge, IB, CIS, Edexcel).
4. `branch_list`: Danh mục hệ thống cơ sở toàn quốc với địa chỉ và hotline.
5. `news_list`: Lưới tin tức, sự kiện học đường phân loại theo cơ sở.
6. `form_embed`: Biểu mẫu đăng ký tuyển sinh trực tuyến tương tác kết nối REST API.
7. `testimonial_slider`: Lời chia sẻ và cảm nhận thực tế từ phụ huynh & cựu học sinh đạt học bổng quốc tế.
8. `faq_accordion`: Bảng câu hỏi thường gặp tích hợp đóng/mở tương tác giải đáp thắc mắc tuyển sinh.

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
*Kết quả: 12/12 tests passing (BlockRegistry 8 blocks, Migrations, Multi-tenant RBAC Scoping, Seed Data integrity, i18n dictionary, UTF-8 BOM CSV Export, Dynamic Permission Matrix, Page Revision Rollback, Site Backup Package).*

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
