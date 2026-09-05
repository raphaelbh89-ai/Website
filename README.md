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
│   ├── blocks/        # Thư viện 6 block chuẩn (HeroBanner, ProgramList, PartnerSlider, BranchList, NewsList, FormEmbed)
│   ├── cms/           # BlockRegistry singleton, Schema Resolver, Versioning & Migrations
│   ├── auth/          # Ma trận phân quyền RBAC & Kiểm tra phạm vi cơ sở (canAccessBranchResource)
│   ├── database/      # Drizzle ORM Schema PostgreSQL 16 (35 bảng, UUIDv7, Soft Delete) & Seed Data
│   ├── forms/         # Dynamic Form schema validation & builder core
│   ├── media/         # Quản lý tệp tin, tối ưu hóa WebP & CDN URLs
│   ├── seo/           # Tự động sinh JSON-LD Schema.org (School, NewsArticle, Course)
│   ├── theme/         # Design Tokens generator (:root CSS variables)
│   ├── ui/            # UI components dùng chung (Buttons, Containers)
│   └── shared/        # DTOs, Enums, Interfaces dùng chung toàn monorepo
├── docs/              # 12 tài liệu đặc tả kiến trúc chi tiết (01-12)
├── docker-compose.yml # Hạ tầng production (PostgreSQL 16, Redis 7, API, Web, Admin)
└── .github/workflows/ # CI/CD Pipeline tự động kiểm thử và build
```

---

## ⚡ Các Tính Năng Đã Triển Khai Hoàn Chỉnh

### 1. Dynamic Page Builder (Dựng trang trực quan)
- Kéo thả, thêm mới, sắp xếp, xóa và cấu hình các khối giao diện từ **BlockRegistry**.
- Thuộc tính cấu hình tự sinh tự động từ Zod Schema qua **Dynamic Inspector**.
- Hỗ trợ xuất bản tức thì (1-click Publish) và xóa cache Edge.

### 2. Thư Viện 6 Khối Giao Diện Mẫu (Open/Closed Architecture)
1. `hero_banner`: Banner lớn, ảnh nền, overlay opacity, slogan và nút kêu gọi hành động (CTA).
2. `program_list`: Danh sách chương trình đào tạo chuẩn quốc tế (Mầm non, Tiểu học, Trung học & Tú tài).
3. `partner_slider`: Băng chuyền đối tác học thuật quốc tế (Cambridge, IB, CIS, Edexcel).
4. `branch_list`: Danh mục hệ thống cơ sở toàn quốc với địa chỉ và hotline.
5. `news_list`: Lưới tin tức, sự kiện học đường phân loại theo cơ sở.
6. `form_embed`: Biểu mẫu đăng ký tuyển sinh trực tuyến tương tác kết nối REST API.

### 3. Phân Quyền Đa Cơ Sở & Bảo Mật (Multi-tenant RBAC)
- **Super Administrator**: Toàn quyền hệ sinh thái, cấu hình theme toàn cục và tạo cơ sở mới.
- **Campus Director**: Giới hạn thao tác trong phạm vi chi nhánh được phân quyền (`branchId`), duyệt bài viết và xem hồ sơ học sinh thuộc cơ sở mình.
- **Admissions Officer**: Chuyên trách tiếp nhận hồ sơ, chăm sóc phụ huynh và chuyển trạng thái phễu tuyển sinh.
- **Content Editor**: Soạn thảo tin tức và trang con.
- **Audit Logs**: Tự động lưu vết kiểm toán cho mọi thao tác (CREATE, UPDATE, DELETE, PUBLISH, STATUS_CHANGE).

### 4. CRM Tuyển Sinh Trực Tuyến & Phễu Chăm Sóc Phụ Huynh
- Tiếp nhận hồ sơ phụ huynh đăng ký từ Landing page công cộng.
- Phễu Pipeline 4 giai đoạn: **Hồ Sơ Mới ➔ Đang Tư Vấn ➔ Đã Hẹn Tham Quan ➔ Đã Nhập Học**.
- Slide-over CRM Drawer cho phép cập nhật trạng thái 1 chạm và ghi chú nhật ký liên hệ (Notes Timeline).
- Hỗ trợ xuất dữ liệu ra Excel.

### 5. Trợ Lý AI Tuyển Sinh 24/7 & Tìm Kiếm Hợp Nhất (Unified Search)
- **AI Chatbot Advisor**: Widget nổi tương tác góc màn hình, tư vấn chi tiết học phí, chính sách học bổng 10 tỷ VNĐ, lộ trình Cambridge và địa chỉ cơ sở.
- **Unified Search (`Ctrl + K`)**: Tìm kiếm tức thì đồng thời qua cơ sở, chương trình đào tạo và tin tức bài viết.

### 6. Theme Customizer & Design Tokens
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
*Kết quả: 6/6 tests passing (BlockRegistry, Migrations, RBAC Super Admin/Campus Director/Officer, Seed Data integrity).*

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
