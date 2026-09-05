# 12. ARCHITECTURE DECISION RECORDS, SCALABILITY & GOVERNANCE
## ADR Matrix, Capacity Planning & Approval Checklist

---

### 12.1 MÔ PHỎNG TẢI TRỌNG HỆ THỐNG VÀ ĐÁNH GIÁ ĐIỂM NGHẼN (SCALABILITY REVIEW)

#### Thông số mô phỏng giả lập:
- **50 cơ sở trường học** trải dài toàn quốc.
- **5,000 bài viết** tin tức, thông báo, câu chuyện thành tích.
- **500 trang nội dung** và Landing Pages tuyển sinh.
- **200 Block / Module giao diện** khác nhau.
- **100,000 tệp tin Media** (hình ảnh học tập, video, tài liệu PDF).
- **500,000 lượt nộp hồ sơ** biểu mẫu tuyển sinh qua các năm.
- **100 quản trị viên / biên tập viên đồng thời** (Concurrent Admin Users).
- **10,000 khách truy cập đồng thời** trong ngày cao điểm công bố kết quả / khai giảng (Concurrent Visitors).

---

#### Bảng phân tích điểm nghẽn tiềm ẩn và giải pháp kiến trúc:

| Thành phần | Tải trọng dự kiến | Điểm nghẽn tiềm ẩn (Bottleneck) | Giải pháp kiến trúc triệt tiêu điểm nghẽn |
| :--- | :--- | :--- | :--- |
| **Database** | 500K submissions, 5K articles | Hết connection pool; Query bảng `form_submissions` bị chậm khi đếm hoặc tìm kiếm; GIN index bị nặng. | Dùng **PgBouncer** giới hạn connection pool; B-Tree Index trên `(form_id, created_at)`; Đưa dữ liệu nộp cũ > 2 năm vào Archive Table; Tách biệt Master DB (ghi) và Read Replica (đọc). |
| **API Server** | 1,000 req/giây (cao điểm) | CPU quá tải do parse JSON động hoặc mã hóa mật khẩu; tắc nghẽn I/O. | Cluster Node.js đa luồng hoặc deploy container tự động co giãn (Horizontal Pod Autoscaling); Giao toàn bộ việc phục vụ trang tĩnh cho CDN và Next.js. |
| **Cache (Redis)**| Hàng triệu key cache | Tràn bộ nhớ RAM Redis khi lưu toàn bộ HTML trang. | Chỉ lưu JSON payload và metadata trong Redis; HTML đầy đủ do Cloudflare CDN và Next.js Data Cache trên ổ cứng đảm nhiệm; Thiết lập chính sách `maxmemory-policy: allkeys-lru`. |
| **CDN (Edge)** | 10,000 CCU | Chi phí băng thông tăng cao; Cache Hit Ratio thấp nếu URL có query string thừa. | Cloudflare Edge Cache cấu hình chuẩn quy tắc bỏ qua query UTM tiếp thị; Cache-Control headers chuẩn hóa; Hit Ratio đạt > 85%. |
| **Object Storage**| 100,000 files (~500GB) | Nghẽn băng thông server web khi tải file. | Sử dụng **S3 Direct Upload** (Pre-signed URL); Mọi file ảnh phân phối qua Cloudflare R2 / AWS CloudFront với chi phí băng thông = 0 hoặc cực thấp. |
| **Rendering** | 10,000 CCU đồng thời | CPU máy chủ Next.js chạm 100% nếu trang nào cũng chạy SSR từ đầu. | **90% trang chạy SSG + On-demand ISR**. Người dùng chỉ đọc file HTML đã được biên dịch sẵn từ CDN/Disk; thời gian render = 0ms. |
| **Search Engine**| 5,000 articles | Tìm kiếm bằng `LIKE '%...%'` gây Full Table Scan làm treo cơ sở dữ liệu. | Dùng **PostgreSQL GIN pg_trgm**; Khi vượt ngưỡng 50,000 bài viết, bổ sung dịch vụ tìm kiếm chuyên dụng như Meilisearch hoặc Elasticsearch. |
| **Admin UI** | 100 Admins thao tác | 2 Admin cùng sửa 1 bài viết gây mất dữ liệu đè lên nhau (Race Condition). | Cơ chế **Optimistic Concurrency Control** (kiểm tra `version_number` trước khi lưu); Nếu phát hiện bản ghi đã bị người khác sửa -> Cảnh báo xung đột và hiển thị Diff so sánh. |

---

### 12.2 BẢNG QUYẾT ĐỊNH KIẾN TRÚC QUAN TRỌNG (ARCHITECTURE DECISION RECORDS - ADR)

| Quyết định (Decision) | Lựa chọn (Choice) | Lý do kiến trúc (Reason) | Phương án thay thế (Alternative) |
| :--- | :--- | :--- | :--- |
| **Kiến trúc hệ thống** | **Modular Monolith (Monorepo)** | Đảm bảo tính toàn vẹn dữ liệu ACID giữa các domain trường học, giảm chi phí hạ tầng, dễ chia sẻ TypeScript types từ DB lên UI, dễ phát triển nhanh với team vừa. | *Microservices*: Quá phức tạp và tốn kém.<br>*Traditional Monolith*: Dễ biến thành "Spaghetti code". |
| **Cơ sở dữ liệu** | **PostgreSQL 16+** | Hỗ trợ mô hình lai hoàn hảo: Relational ACID chuẩn 3NF kết hợp JSONB tốc độ cao cho Page Builder; hỗ trợ Full-text Search và UUIDv7 native. | *MySQL*: Xử lý JSONB và Index biểu thức kém hơn.<br>*MongoDB*: Kém trong quan hệ dữ liệu trường học phức tạp. |
| **Framework Web** | **Next.js (App Router)** | Kiến trúc Server Components (RSC) giảm 60% bundle JS client; hỗ trợ On-demand ISR tag-based tối ưu tuyệt đối cho SEO và tốc độ tải trang trường học. | *Remix*: Hệ sinh thái CMS nhỏ hơn.<br>*Vite/SPA thuần*: SEO kém, Googlebot index chậm. |
| **Giao tiếp API** | **RESTful API + OpenAPI** | Chuẩn hóa quốc tế, dễ tích hợp với các hệ thống giáo dục bên thứ ba (LMS, CRM, Mobile Apps); dễ cache trên Cloudflare. | *GraphQL*: Phức tạp hóa việc cache tại CDN Edge.<br>*tRPC*: Rất tốt cho nội bộ nhưng khó mở rộng cho 3rd-party. |
| **Công nghệ ORM** | **Drizzle ORM (hoặc Prisma)** | Drizzle có tốc độ thực thi gần với SQL thuần (Zero overhead), Serverless-ready, Type-safe tuyệt đối và kiểm soát câu lệnh SQL minh bạch. | *TypeORM*: Dự án cũ, nhiều lỗi memory leak.<br>*Mongoose*: Chỉ dành cho NoSQL. |
| **CSS Framework** | **Tailwind CSS + shadcn/ui** | Tốc độ phát triển UI cực nhanh, không sinh CSS thừa (Zero runtime overhead), dễ dàng trừu tượng hóa thành hệ thống Design Tokens bằng CSS Variables. | *Styled-components*: Gây nặng bundle runtime.<br>*Bootstrap*: Khó tùy biến giao diện hiện đại độc bản. |
| **Lưu trữ tệp tin** | **S3-compatible (Cloudflare R2 / AWS S3)** | Chi phí lưu trữ rẻ, độ bền dữ liệu 99.999999999%, tách biệt hoàn toàn rủi ro quá tải ổ cứng khỏi máy chủ ứng dụng. | *Local Disk Storage*: Rủi ro mất dữ liệu khi scale-out nhiều máy chủ. |

---

### 12.3 MA TRẬN RỦI RO KIẾN TRÚC VÀ BIỆN PHÁP PHÒNG NGỪA (RISK MATRIX)

| Rủi ro kiến trúc (Architectural Risk) | Mức độ tác động | Xác suất | Hậu quả nếu không thiết kế từ đầu | Biện pháp ngăn chặn (Mitigation) |
| :--- | :--- | :--- | :--- | :--- |
| **1. Cấu trúc Block bị gắn chặt vào mã nguồn (Hard-coded Blocks)** | Cực lớn (High) | Rất cao | Mỗi lần trường muốn đổi một banner hay layout lại phải gọi lập trình viên sửa code và deploy lại toàn bộ web. | Triển khai **Data-driven Block Registry**: Block chỉ nhận Config JSON; Admin kéo thả và chỉnh sửa thuộc tính hoàn toàn qua giao diện động. |
| **2. Bị trói buộc vào 1 cơ sở duy nhất** | Phá hủy (Fatal) | Trung bình | Khi mở rộng lên cơ sở thứ 2, hệ thống phải nhân bản thành 2 source code hoặc 2 database riêng, chi phí bảo trì tăng gấp 10 lần. | Thiết kế cột `branch_id (NULLABLE)` trên toàn bộ các bảng nghiệp vụ ngay từ Day 1. |
| **3. Lỗi Schema Migration khi nâng cấp Block** | Lớn (High) | Cao | Nâng cấp Block từ v1 lên v2 làm trắng trang hàng trăm trang web cũ do thiếu dữ liệu trường mới. | Bắt buộc triển khai **Block Versioning & Migration Pipeline** tự động bù đắp dữ liệu mặc định trong memory. |
| **4. Lưu file upload trực tiếp trên Local Server** | Phá hủy (Fatal) | Rất cao | Máy chủ đầy ổ cứng sập toàn hệ thống; Không thể chạy Load Balancer nhiều server vì file nằm rải rác. | Bắt buộc dùng **Direct-to-S3 Upload với Pre-signed URL**. |
| **5. Cạn kiệt Database Connections khi công bố điểm / tuyển sinh** | Lớn (High) | Trung bình | Hàng nghìn phụ huynh cùng vào xem web làm database báo lỗi `too many connections` và sập API. | Đặt **PgBouncer** ở tầng trước database; Bật CDN Edge Caching cho 90% trang công cộng. |
| **6. Thiết kế đa ngôn ngữ theo kiểu thêm cột `title_en`** | Cực lớn (High) | Cao | Phải chạy migration sửa lại toàn bộ database khi trường muốn thêm tiếng Pháp hoặc tiếng Nhật. | Thiết kế **Bilingual JSONB hoặc Bảng Translation tách biệt**. |

---

### 12.4 ĐỀ XUẤT CUỐI CÙNG (FINAL ARCHITECTURAL RECOMMENDATIONS)

1. **Recommended Architecture**: **Modular Monolith trên Monorepo (pnpm + Turborepo)**. Đảm bảo sự cân bằng hoàn hảo giữa tốc độ phát triển giai đoạn đầu và khả năng tách thành Microservices trong tương lai dài hạn.
2. **Recommended Database Model**: **PostgreSQL 16** với kiến trúc lai Relational (3NF) cho quan hệ thực thể cốt lõi + JSONB cho cấu hình Block/Section linh hoạt. Toàn bộ Primary Key dùng `UUIDv7`.
3. **Recommended Folder Structure**: Tách biệt rõ ràng 3 Apps (`web`, `admin`, `api`) và các Packages dùng chung độc lập (`ui`, `cms-core`, `blocks`, `database`, `auth`, `forms`, `media`, `theme`, `seo`).
4. **Recommended Module System**: Phân định chặt chẽ: `Content Type -> Block -> Section -> Page -> Template -> Theme`. Mọi Block có Zod Schema để tự động sinh Form Admin.
5. **Recommended Technology Stack**:
   - **Frontend Public**: Next.js App Router (React Server Components, On-demand ISR, Tailwind CSS).
   - **Admin Dashboard**: Next.js / Vite SPA (React, Tailwind CSS, shadcn/ui, DnD Kit).
   - **Backend API**: Node.js + TypeScript (Fastify hoặc NestJS Core kiến trúc Clean Architecture).
   - **Database & Cache**: PostgreSQL 16 + Redis + PgBouncer.
   - **Storage & Infrastructure**: Cloudflare R2 / AWS S3 + Cloudflare CDN + Docker.

---

### 12.5 LỘ TRÌNH TRIỂN KHAI THEO GIAI ĐOẠN (ROADMAP & TIMELINE)

```text
┌────────────────────────────────────────────────────────────────────────┐
│ GIAI ĐOẠN 1: NỀN TẢNG CỐT LÕI (LÀM NGAY)                               │
├────────────────────────────────────────────────────────────────────────┤
│ 1. Khởi tạo Monorepo Workspace (pnpm + Turborepo + TypeScript config)  │
│ 2. Thiết lập Database Schema PostgreSQL (Users, Roles, Branches, CMS)  │
│ 3. Xây dựng Authentication & RBAC phân quyền theo chi nhánh            │
│ 4. Xây dựng Block Registry & Bộ 16 Block giao diện chuẩn               │
│ 5. Xây dựng Visual Page Builder trên Admin Dashboard                   │
│ 6. Xây dựng Rendering Engine trên Next.js Public Web kèm On-demand ISR │
│ 7. Xây dựng Generic Form Builder & Luồng tiếp nhận hồ sơ tuyển sinh    │
│ 8. Thiết lập S3 Direct Upload & Xử lý ảnh tự động                      │
│ 9. Tối ưu SEO tự động (Dynamic Metadata, OpenGraph, JSON-LD, Sitemap)  │
└────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────┐
│ GIAI ĐOẠN 2: HOÀN THIỆN TRẢI NGHIỆM VẬN HÀNH (KẾ TIẾP)                 │
├────────────────────────────────────────────────────────────────────────┤
│ 1. Kích hoạt tính năng Đa ngôn ngữ (Bật Tiếng Anh: vi / en)            │
│ 2. Bộ công cụ kiểm toán nâng cao (Audit Logs & Revisions Rollback)     │
│ 3. Đánh giá kiểm thử bảo mật nâng cao (Penetration Testing & CSP)      │
│ 4. Tích hợp Thông báo Telegram / Zalo ZNS khi có đơn tuyển sinh mới    │
└────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────┐
│ GIAI ĐOẠN 3: MỞ RỘNG NÂNG CAO (CHUẨN BỊ CHO TƯƠNG LAI)                 │
├────────────────────────────────────────────────────────────────────────┤
│ 1. Tích hợp AI Chatbot tư vấn tuyển sinh 24/7 (RAG trên sổ tay trường) │
│ 2. Tích hợp Cổng thanh toán trực tuyến (VNPay / MoMo đóng phí giữ chỗ) │
│ 3. Cổng thông tin Phụ huynh (Parent Portal: xem điểm, thời khóa biểu)  │
│ 4. Phân vùng Database Partitioning khi số lượng cơ sở vượt 50          │
└────────────────────────────────────────────────────────────────────────┘
```

---

# ARCHITECTURE APPROVAL CHECKLIST
### Danh sách các hạng mục quan trọng cần Bạn (Chủ dự án) xem xét và phê duyệt trước khi viết code:

Vui lòng kiểm tra các quyết định kỹ thuật dưới đây:

- [ ] **1. Phê duyệt Mô hình Kiến trúc**: Chấp thuận mô hình **Modular Monolith trên Monorepo (pnpm + Turborepo)** với 3 Apps độc lập (`web`, `admin`, `api`) và các packages dùng chung.
- [ ] **2. Phê duyệt Mô hình Cơ sở dữ liệu**: Chấp thuận thiết kế lai Relational 3NF kết hợp JSONB trên **PostgreSQL 16**, sử dụng khóa chính **UUIDv7** và chiến lược Soft Delete có Partial Index.
- [ ] **3. Phê duyệt Chiến lược Phân cấp CMS**: Chấp thuận mô hình 6 lớp: `Content Type -> Block -> Section -> Page -> Template -> Theme` và cơ chế **Schema-driven Dynamic Block Configuration** (không hard-code code form).
- [ ] **4. Phê duyệt Chiến lược Điều hướng Đa cơ sở**: Chấp thuận sử dụng cấu trúc **Subpath (`school.edu.vn/co-so/bien-hoa`)** làm mặc định cho SEO và hỗ trợ Subdomain/Custom Domain qua Middleware Rewrite.
- [ ] **5. Phê duyệt Công nghệ Rendering**: Chấp thuận sử dụng **Next.js App Router với SSG + On-demand Tag-based ISR** kết hợp Cloudflare CDN để đảm bảo tốc độ tải trang `< 100ms` cho 10,000 khách truy cập đồng thời.
- [ ] **6. Phê duyệt Phương án Media**: Chấp thuận mô hình **Direct-to-S3 Upload với Pre-signed URL** và tự động convert ảnh sang WebP/AVIF bằng Sharp worker.
- [ ] **7. Phê duyệt Chiến lược Mở rộng**: Đồng ý với phương án chuẩn bị sẵn sàng cho Đa ngôn ngữ (i18n), AI Chatbot, Cổng phụ huynh và Tuyển sinh trực tuyến mà không cần rewrite kiến trúc cũ.

---

> **TRẠNG THÁI HIỆN TẠI**: ĐÃ HOÀN TẤT TOÀN BỘ 12 BỘ TÀI LIỆU ĐẶC TẢ KIẾN TRÚC.
> **TUYỆT ĐỐI CHƯA VIẾT CODE CHO ĐẾN KHI BẠN PHÊ DUYỆT CHECKLIST TRÊN.**
