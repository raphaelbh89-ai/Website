# 08. PERFORMANCE & CACHING ARCHITECTURE
## Sub-Second Page Loads & Core Web Vitals Optimization

---

### 8.1 PHÂN TÍCH CHIẾN LƯỢC RENDERING CỦA NEXT.JS CHO TỪNG LOẠI TRANG

Để đạt điểm Google Lighthouse 95+ và đáp ứng tốt 10,000 khách truy cập đồng thời, hệ thống phân loại cụ thể từng loại trang theo chiến lược render tối ưu:

| Loại trang | Chiến lược Render | Cơ chế Caching & TTL | Thời gian phản hồi kỳ vọng (TTFB) |
| :--- | :--- | :--- | :--- |
| **Trang chủ & Trang cơ sở** | **SSG + On-demand ISR** | Cache vĩnh viễn trên Edge CDN, chỉ rebuild khi Admin bấm Publish | `< 50ms` (tại Cloudflare Edge) |
| **Bài viết chi tiết (News)** | **SSG + ISR (stale-while-revalidate)** | Static generation lúc build/truy cập đầu, Revalidate ngầm mỗi 3600s | `< 50ms` |
| **Trang danh mục & Tìm kiếm** | **SSR (Server-side Rendering)** | Cache kết quả truy vấn trong Redis 60s theo Query Params | `150ms - 250ms` |
| **Xem trước bản nháp (Preview)**| **SSR Dynamic** | Không cache (`Cache-Control: no-store`), xác thực bằng Token bí mật | `200ms - 400ms` |
| **Bảng quản trị (Admin Dashboard)**| **SPA (Client-Side Rendering)** | Static HTML Shell cache trên browser, nạp data động qua API | N/A (App Shell nạp 1 lần) |

#### Cơ chế On-Demand Tag-Based Revalidation:
- Next.js 14/15 App Router hỗ trợ gắn thẻ định danh cho các khối dữ liệu:
  ```typescript
  // Khi nạp dữ liệu trang web trên Public Web:
  const pageData = await fetch(`https://api.internal/pages/${slug}`, {
    next: { tags: [`page:${slug}`, `branch:${branchId}`, 'global-layout'] }
  });
  ```
- Khi Admin chỉnh sửa cơ sở Biên Hòa trong Dashboard:
  - Hệ thống gửi lệnh: `revalidateTag('branch:bien-hoa')`.
  - Next.js ngay lập tức đánh dấu trang liên quan là stale và âm thầm render lại trang mới trong nền. Người dùng hiện tại không phải chờ đợi máy chủ compile lại.

---

### 8.2 KIẾN TRÚC CACHING ĐA TẦNG (MULTI-TIER CACHING TOPOLOGY)

```text
       [ 10,000 Visitors ]
                │
                ▼
┌───────────────────────────────────────────────┐
│ TẦNG 1: CLOUDFLARE EDGE CDN                   │ ◄── Cache 85% Traffic (Static HTML, WebP images, JS/CSS)
│ Hit Ratio mục tiêu: > 85%                     │     TTL: 1 năm cho assets băm tên; TTL 1 giờ cho HTML
└───────────────────────┬───────────────────────┘
                        │ Edge Cache MISS (15% Traffic)
                        ▼
┌───────────────────────────────────────────────┐
│ TẦNG 2: NEXT.JS DATA CACHE / MEMORY           │ ◄── Lưu kết quả render Server Component & Layouts
└───────────────────────┬───────────────────────┘
                        │ Data Cache MISS
                        ▼
┌───────────────────────────────────────────────┐
│ TẦNG 3: DISTRIBUTED REDIS CACHE               │ ◄── Lưu các cấu hình hệ thống, Menu Tree, Theme Tokens,
│ Hit Ratio mục tiêu: > 90%                     │     kết quả truy vấn phổ biến
└───────────────────────┬───────────────────────┘
                        │ Redis Cache MISS
                        ▼
┌───────────────────────────────────────────────┐
│ TẦNG 4: DATABASE CONNECTION POOL (PgBouncer)  │ ◄── Tái sử dụng kết nối PostgreSQL, chống quá tải connection
└───────────────────────┬───────────────────────┘
                        │
                        ▼
┌───────────────────────────────────────────────┐
│ TẦNG 5: POSTGRESQL READ REPLICA               │ ◄── Phục vụ truy vấn đọc; Master DB chỉ nhận ghi
└───────────────────────────────────────────────┘
```

---

### 8.3 TỐI ƯU HÓA HÌNH ẢNH VÀ ĐA PHƯƠNG TIỆN (MEDIA OPTIMIZATION)

Media (đặc biệt là ảnh hoạt động học sinh, cơ sở vật chất) là nguyên nhân hàng đầu khiến website trường học bị chậm và hao tốn băng thông.

#### Chiến lược tối ưu Media toàn diện:
1. **Chuyển đổi định dạng thế hệ mới tự động**:
   - Mọi ảnh JPEG/PNG gốc tải lên đều được tự động convert sang **WebP** và **AVIF** (tiết kiệm 60-80% dung lượng với chất lượng thị giác tương đương).
2. **Kích thước thích ứng (Responsive Srcset)**:
   - Một ảnh được tạo sẵn 4 kích thước:
     - `thumbnail`: 150px (dành cho danh sách admin hoặc avatar).
     - `card_small`: 480px (dành cho màn hình điện thoại).
     - `card_large`: 800px (dành cho lưới hiển thị tablet/desktop).
     - `hero_full`: 1920px (dành cho banner kích thước lớn).
   - Component `Next/Image` tự động tính toán kích thước màn hình người xem qua thuộc tính `sizes` để tải đúng kích thước nhỏ nhất cần thiết.
3. **Lazy Loading & Placeholder mờ (Blur-up Placeholder)**:
   - Các hình ảnh nằm ngoài màn hình đầu tiên (Below-the-fold) đều được đặt `loading="lazy"`.
   - Lưu trữ chuỗi Base64 siêu nhỏ (10x10px) hoặc ThumbHash trong trường `media.variants` để hiển thị hiệu ứng làm mờ mượt mà trước khi ảnh chính tải xong, triệt tiêu hiện tượng giật cục bố cục (Cumulative Layout Shift - CLS = 0).

---

### 8.4 TỐI ƯU CƠ SỞ DỮ LIỆU VÀ TRUY VẤN (DATABASE QUERY OPTIMIZATION)

1. **Đánh chỉ mục thông minh (Smart Indexing)**:
   - Mọi khóa ngoại (`branch_id`, `category_id`, `template_id`) đều có B-Tree Index để tăng tốc các phép JOIN.
   - Sử dụng **Partial Indexes** cho các bản ghi đang hoạt động:
     `CREATE INDEX idx_articles_published ON articles(published_at DESC) WHERE status = 'PUBLISHED' AND deleted_at IS NULL;`
   - Dùng **GIN Index với pg_trgm** cho tìm kiếm văn bản nhanh không phân biệt hoa thường và không dấu tiếng Việt:
     `CREATE INDEX idx_articles_title_trgm ON articles USING gin (title gin_trgm_ops);`
2. **Giải quyết triệt để lỗi N+1 Query**:
   - Sử dụng cơ chế `DataLoader` hoặc truy vấn gom cụm (Eager loading) của ORM (Prisma `include` / Drizzle relational query) để nạp Sections và Blocks trong cùng 1 lần truy vấn dữ liệu duy nhất khi mở trang.
3. **Connection Pooling với PgBouncer**:
   - PostgreSQL sinh 1 process mới cho mỗi connection. Để chịu tải 10,000 người dùng đồng thời, hệ thống đặt **PgBouncer** ở chế độ `Transaction Pooling`. Cho phép hàng nghìn web worker chia sẻ một nhóm 50-100 kết nối thực sự tới database mà không gây cạn kiệt RAM server.

---

### 8.5 TỐI ƯU GIAO DIỆN PHÍA TRÌNH DUYỆT (FRONTEND BUNDLE OPTIMIZATION)

1. **Zero Runtime CSS**:
   - Sử dụng **Tailwind CSS v3/v4**. Toàn bộ CSS không sử dụng được loại bỏ khi build (PurgeCSS). Dung lượng file CSS nén Gzip chỉ dưới 25KB cho toàn bộ website.
2. **Next/Font Tự lưu trữ (Self-hosted Fonts)**:
   - Font chữ Google Fonts (Inter / Outfit) được Next.js tự động tải về build-time và nhúng thẳng vào HTML. Trình duyệt không cần gửi thêm request sang máy chủ `fonts.googleapis.com`, triệt tiêu hoàn toàn độ trễ DNS và hiện tượng nháy font (FOUT/FOIT).
3. **Dynamic Code Splitting**:
   - Các Block nặng chỉ xuất hiện ở một số trang nhất định (Ví dụ: `VideoPlayer`, `GoogleMap`, `TestimonialSlider`) được import động thông qua `dynamic(() => import(...), { ssr: false })`, giúp bundle ban đầu tải trang chủ cực nhẹ.
