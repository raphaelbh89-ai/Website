# 03. FOLDER STRUCTURE & MONOREPO ARCHITECTURE
## Enterprise Production-Ready Monorepo Specification

---

### 3.1 CẤU TRÚC TỔNG THỂ (MONOREPO OVERVIEW)

Hệ thống được tổ chức theo mô hình **Monorepo (sử dụng pnpm Workspaces + Turborepo)** nhằm tối ưu hóa việc chia sẻ mã nguồn, đảm bảo Type Safety xuyên suốt (End-to-End Type Safety), và tối ưu tốc độ build với cơ chế Remote Caching.

```text
school-cms-framework/
├── .github/                      # CI/CD Workflows (Lint, Test, Build, Deploy)
├── apps/                         # Deployable Applications
│   ├── web/                      # Public Website (Next.js App Router)
│   ├── admin/                    # Admin Dashboard & Page Builder (Next.js / Vite SPA)
│   └── api/                      # Backend Core API Server (Node.js / Express / Fastify)
├── packages/                     # Shared Internal Libraries & Domain Modules
│   ├── ui/                       # Design System & Primitives (Tailwind + Radix/shadcn)
│   ├── database/                 # Prisma/Drizzle Schema, Repositories, Migrations
│   ├── auth/                     # Authentication & Authorization RBAC logic
│   ├── cms/                      # Core CMS abstractions, Dynamic Rendering Engine
│   ├── blocks/                   # Production Block Library (Components & Schemas)
│   ├── forms/                    # Generic Form Engine (Builder & Validation)
│   ├── media/                    # Media management, S3 storage client, Transformers
│   ├── seo/                      # Metadata generator, Schema.org JSON-LD builders
│   ├── theme/                    # Design Token Engine, CSS Variable generator
│   ├── shared/                   # Shared TypeScript DTOs, Enums, Utils, Constants
│   └── config/                   # Shared ESLint, Prettier, TypeScript & Tailwind configs
├── docker/                       # Dockerfiles & docker-compose configurations
├── docs/                         # Architecture Specifications & Runbooks
├── package.json                  # Root Monorepo configuration
├── pnpm-workspace.yaml           # pnpm Workspace definition
├── turbo.json                    # Turborepo task pipeline configuration
└── tsconfig.base.json            # Base TypeScript configuration
```

---

### 3.2 CHI TIẾT CÁC ỨNG DỤNG (/APPS)

#### 1. `apps/web` (Public Website)
- **Công nghệ**: Next.js (App Router), React Server Components (RSC), Tailwind CSS.
- **Trách nhiệm**:
  - Render giao diện người dùng công cộng (Trang chủ, Cơ sở, Khóa học, Tin tức, Tuyển sinh).
  - Tích hợp Dynamic Layout Renderer: nạp Page JSON từ API/DB và ánh xạ ra các React Components.
  - Xử lý SEO server-side: Meta tags, Open Graph, Sitemap XML, Canonical tags.
  - Tối ưu Core Web Vitals: Next/Image, Next/Font, Streaming HTML với Suspense.
  - Thực thi ISR (Incremental Static Regeneration) với Tag-based revalidation.
- **Quy tắc**: Không chứa logic truy cập Database trực tiếp nếu deploy dạng Headless; nếu deploy chung hạ tầng thì chỉ gọi qua package `database` theo dạng Read-Only.

#### 2. `apps/admin` (Admin Dashboard & CMS Builder)
- **Công nghệ**: Next.js hoặc React SPA, Tailwind CSS, shadcn/ui, DnD Kit (Drag & Drop).
- **Trách nhiệm**:
  - Giao diện trực quan cho Admin quản lý nội dung: Quản lý bài viết, danh mục, media, cơ sở.
  - **Visual Page Builder**: Kéo thả Sections, Blocks, cấu hình thông số Block trực quan theo thời gian thực (Live Preview).
  - **Form Builder UI**: Tạo form, cấu hình trường, xem thống kê và xuất dữ liệu đăng ký tuyển sinh.
  - Quản trị người dùng, vai trò (RBAC), cài đặt hệ thống và xem Audit Logs.
- **Quy tắc**: Cô lập hoàn toàn với trang Public, không chia sẻ bundle CSS/JS ra ngoài để bảo đảm an toàn và nhẹ tải cho website công cộng.

#### 3. `apps/api` (Backend API Service)
- **Công nghệ**: Node.js + TypeScript (Fastify / Express / NestJS Core).
- **Trách nhiệm**:
  - Cung cấp toàn bộ RESTful API / tRPC endpoints cho cả `web` và `admin`.
  - Thực thi nghiệp vụ xác thực (Auth), phân quyền theo chi nhánh (RBAC Scope).
  - Thực hiện xác thực dữ liệu đầu vào (Zod Schema Validation).
  - Quản lý giao dịch cơ sở dữ liệu (Database Transactions).
  - Tích hợp dịch vụ bên thứ ba: AWS S3/Cloudflare R2, SMTP Mailer, SMS Gateway.

---

### 3.3 CHI TIẾT CÁC PACKAGES DÙNG CHUNG (/PACKAGES)

| Package | Trách nhiệm chính | Phụ thuộc (Dependencies) |
| :--- | :--- | :--- |
| `@school-cms/shared` | Chứa toàn bộ Types, DTOs, Interfaces, Enums, Utils, Constants dùng chung cho toàn bộ Frontend và Backend. | Không phụ thuộc |
| `@school-cms/database` | Quản lý ORM Schema (Prisma/Drizzle), Migrations, Database Client, Base Repositories và Database Seeder. | `@school-cms/shared` |
| `@school-cms/ui` | Các UI Primitives (Button, Dialog, Dropdown, Input, Toast) xây dựng trên Radix UI + Tailwind. | Tailwind CSS, Radix UI |
| `@school-cms/auth` | JWT Helper, Password Hasher (Argon2id), RBAC Guard, Permission Evaluator, Session Manager. | `@school-cms/database`, `@school-cms/shared` |
| `@school-cms/cms` | Kiến trúc trừu tượng cho Page/Section/Block, Block Registry, Layout Resolver, Tree Parser. | `@school-cms/shared` |
| `@school-cms/blocks` | Kho lưu trữ các Block Components (HeroBanner, NewsList, BranchSlider, v.v.) kèm Zod Schema cấu hình của từng Block. | `@school-cms/ui`, `@school-cms/cms`, `@school-cms/shared` |
| `@school-cms/forms` | Logic parse Dynamic Form, Form Field Validator, Submission Sanitizer, Notification Dispatcher. | `@school-cms/database`, `@school-cms/shared` |
| `@school-cms/media` | S3 Upload Handler, Image Metadata Extractor, Sharp Image Variant Resizer, MIME-type Validator. | AWS SDK, Sharp, `@school-cms/shared` |
| `@school-cms/seo` | Helpers tạo thẻ Meta, JSON-LD Schema.org (School, Article, Breadcrumbs), XML Sitemap Generator. | `@school-cms/shared` |
| `@school-cms/theme` | Quản lý Design Tokens, biến đổi Tokens thành CSS Variables, xử lý Dark/Light mode và Theming theo từng cơ sở. | `@school-cms/shared` |

---

### 3.4 QUY TRÌNH THÊM MODULE MỚI (MODULE EXTENSION LIFECYCLE)

Để đảm bảo hệ thống có thể mở rộng bền vững trong 5-10 năm mà không gây phá vỡ kiến trúc cũ, mọi module/block mới phải tuân theo chuẩn hóa 4 bước sau:

#### Ví dụ 1: Thêm một Block giao diện mới (`StatisticsBlock`)
1. **Bước 1 (Schema & Type Definition)**:
   - Trong `packages/blocks/src/statistics/schema.ts`, định nghĩa Zod Schema:
     - Các trường: `title`, `counters: Array<{ label: string, value: number, suffix: string }>`, `layout: '3-cols' | '4-cols'`.
2. **Bước 2 (UI Component Implementation)**:
   - Trong `packages/blocks/src/statistics/StatisticsBlock.tsx`, viết React Component hiển thị nhận `props: z.infer<typeof StatisticsSchema>`.
3. **Bước 3 (Register vào Block Registry)**:
   - Trong `packages/blocks/src/registry.ts`, đăng ký metadata: `code: 'statistics'`, `name: 'Khối thống kê con số'`, `icon: 'BarChart'`, `schema: StatisticsSchema`, `component: StatisticsBlock`.
4. **Kết quả**:
   - Admin UI tự động nhận diện Block mới trong thư viện kéo thả, tự động render Form nhập liệu tương ứng từ Schema mà không cần can thiệp code Admin.
   - Public Website tự động render được Block này khi nó xuất hiện trong Page JSON.

---

#### Ví dụ 2: Thêm một Tính năng lớn trong tương lai (`AI Chatbot`)
Khi thêm một tính năng phức tạp hoàn toàn mới như **AI Chatbot**:

```text
packages/
  └── ai-chatbot/               # [NEW PACKAGE]
      ├── src/
      │   ├── domain/           # Vector embeddings, RAG pipeline, Prompt templates
      │   ├── api/              # Chat stream endpoint handlers, Session rate limiter
      │   ├── components/       # Chatbot Floating Widget (cho web public)
      │   └── admin/            # Giao diện huấn luyện tài liệu, xem lịch sử chat
```

1. **Cơ sở dữ liệu**:
   - Thêm bảng `bot_conversations`, `bot_messages`, `bot_knowledge_sources` (thông qua migration trong `@school-cms/database` hoặc PostgreSQL pgvector).
2. **Backend API**:
   - Mount router mới `/api/v1/chatbot` trong `apps/api` import logic từ `@school-cms/ai-chatbot`.
3. **Admin Dashboard**:
   - Thêm tab "Trợ lý AI" trong Menu điều hướng của Admin để cấu hình Prompt và nạp tài liệu nhà trường.
4. **Public Website**:
   - Import widget `<ChatbotWidget />` từ `@school-cms/ai-chatbot` nhúng vào Global Layout hoặc đăng ký nó như một Block loại tương tác (Interactive Block).
- **Kết luận**: Tính năng mới hoàn toàn độc lập, không làm thay đổi hay gây rủi ro cho các module CMS lõi hiện có.
