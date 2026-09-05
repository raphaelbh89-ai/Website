# 09. SEO & STRUCTURED DATA ARCHITECTURE
## Search Engine Dominance & Semantic Web Engineering

---

### 9.1 KIẾN TRÚC METADATA ĐỘNG TRONG NEXT.JS (DYNAMIC METADATA ENGINE)

Hệ thống tận dụng hàm `generateMetadata` của Next.js App Router để tự động sinh toàn bộ thẻ Meta Server-side trước khi phản hồi HTML về cho Googlebot/Bingbot.

#### Luồng phân giải Metadata phân cấp (Hierarchical Fallback Strategy):
```text
           [ Cấu hình SEO của Thực thể (Bài viết / Trang / Cơ sở) ]
                                    │ (Nếu để trống)
                                    ▼
           [ Cấu hình SEO của Cơ sở phụ trách (Branch Level) ]
                                    │ (Nếu để trống)
                                    ▼
           [ Cấu hình SEO Mặc định Toàn hệ thống (Global Settings) ]
```

#### Quy chuẩn các thẻ Meta tự động sinh:
- `<title>`: `[Tiêu đề Trang/Bài viết] | [Tên Trường - Cơ sở tương ứng]`
- `<meta name="description">`: Tối ưu trong khoảng 150-160 ký tự.
- `<meta name="robots">`: Trích xuất từ cột `robots_directive` (Mặc định: `index, follow, max-image-preview:large`).
- `<link rel="canonical">`: Tự động chỉ định URL gốc chuẩn tắc, loại bỏ hoàn toàn các rủi ro duplicate content do query string tiếp thị (UTM tags, Facebook click IDs).

---

### 9.2 KIẾN TRÚC OPEN GRAPH & TỰ ĐỘNG TẠO ẢNH CHIA SẺ MẠNG XÃ HỘI (OG DYNAMIC ENGINE)

Khi phụ huynh chia sẻ link bài viết hoặc cơ sở lên Facebook, Zalo, hoặc X/Twitter:
1. **Thẻ OpenGraph chuẩn**:
   - `og:title`, `og:description`, `og:url`, `og:site_name`, `og:locale: "vi_VN"`.
2. **Tự động sinh ảnh OpenGraph động (`@vercel/og` / Satori)**:
   - Nếu biên tập viên quên tải ảnh đại diện mạng xã hội:
   - Hệ thống tự động kích hoạt API sinh ảnh động `/api/og?title=...&branch=...`.
   - Sinh ra ảnh tỷ lệ vàng `1200 x 630 px` hiển thị Logo nhà trường, Tiêu đề bài viết với typography đẹp mắt, phù hiệu cơ sở và hình nền nhận diện thương hiệu.

---

### 9.3 HỆ THỐNG DỮ LIỆU CẤU TRÚC SCHEMA.ORG (JSON-LD STRUCTURED DATA)

Hệ thống nhúng các khối JSON-LD chuẩn xác vào thẻ `<head>` giúp Google hiểu sâu sắc ngữ nghĩa của trường học và xuất hiện trên các kết quả Rich Snippets nổi bật:

#### 1. Schema trường học (`School` / `EducationalOrganization`)
Áp dụng cho Trang chủ và Trang giới thiệu Cơ sở:
```json
{
  "@context": "https://schema.org",
  "@type": "School",
  "@id": "https://school.edu.vn/#organization",
  "name": "Hệ thống Trường Quốc tế Song ngữ Alpha School",
  "url": "https://school.edu.vn",
  "logo": "https://cdn.school.edu.vn/logo.png",
  "sameAs": [
    "https://facebook.com/alphaschool",
    "https://youtube.com/@alphaschool"
  ],
  "department": [
    {
      "@type": "School",
      "name": "Alpha School - Cơ sở Biên Hòa",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Số 123 Đường Nguyễn Ái Quốc",
        "addressLocality": "Biên Hòa",
        "addressRegion": "Đồng Nai",
        "addressCountry": "VN"
      },
      "telephone": "+84-251-1234567"
    }
  ]
}
```

#### 2. Schema bài viết tin tức (`NewsArticle` / `BlogPosting`)
Áp dụng cho mọi bài viết chi tiết:
```json
{
  "@context": "https://schema.org",
  "@type": "NewsArticle",
  "headline": "Lễ Khai Giảng Năm Học 2025: Khát Vọng Vươn Tầm Quốc Tế",
  "image": ["https://cdn.school.edu.vn/media/khai-giang.webp"],
  "datePublished": "2026-09-05T08:00:00+07:00",
  "dateModified": "2026-09-05T10:30:00+07:00",
  "author": {
    "@type": "Person",
    "name": "Ban Truyền Thông Alpha"
  },
  "publisher": {
    "@id": "https://school.edu.vn/#organization"
  }
}
```

#### 3. Schema thanh điều hướng phân cấp (`BreadcrumbList`)
Giúp Google hiển thị thanh điều hướng trực quan ngay dưới tiêu đề tìm kiếm:
`Trang chủ > Cơ sở Biên Hòa > Chương trình Tiểu học Cambridge`.

#### 4. Schema câu hỏi thường gặp (`FAQPage`)
Tự động kích hoạt khi trang có chứa Block `faq_accordion`. Google sẽ hiển thị trực tiếp danh sách câu hỏi - trả lời có thể bấm mở rộng ngay trên trang tìm kiếm (Rich Results FAQ).

---

### 9.4 KIẾN TRÚC TỰ ĐỘNG CHIA TÁCH SITEMAP XML (DYNAMIC SITEMAP INDEX)

Đối với hệ thống trường học nhiều cơ sở và hàng nghìn bài viết theo thời gian, một file sitemap đơn lẻ sẽ nhanh chóng chạm ngưỡng giới hạn 50,000 URLs hoặc 50MB của Google.

#### Kiến trúc chia nhỏ Sitemap Index:
```text
https://school.edu.vn/sitemap.xml (Sitemap Index)
│
├── /sitemap-pages.xml        (Chứa toàn bộ các Trang tĩnh, Landing page cơ sở)
├── /sitemap-programs.xml     (Chứa toàn bộ các Chương trình đào tạo)
├── /sitemap-articles-2026.xml(Chứa bài viết xuất bản năm 2026)
├── /sitemap-articles-2025.xml(Chứa bài viết xuất bản năm 2025)
└── /sitemap-branches.xml     (Chứa danh bạ các cơ sở)
```
- Các file sitemap được sinh động (Dynamically Generated) từ database và lưu cache 24 giờ.
- Khi một bài viết mới được xuất bản, nó xuất hiện tức thì trong sitemap tương ứng mà không cần chạy job generate tốn tài nguyên.

---

### 9.5 ĐIỀU HƯỚNG URL VÀ ROBOTS.TXT (REDIRECTS & ROBOTS ENGINE)

1. **Quản lý Điều hướng 301/302 (Redirects Engine)**:
   - Khi Admin đổi Slug của một bài viết hoặc một trang:
     - Hệ thống tự động ghi một bản ghi vào bảng `redirects`:
       `source_path: '/tin-tuc/slug-cu' -> target_path: '/tin-tuc/slug-moi', status_code: 301`.
     - Danh sách Redirects được nạp vào Next.js Middleware hoặc tải lên Cloudflare KV/Edge Cache.
     - Khách truy cập hoặc Googlebot vào link cũ sẽ nhận ngay HTTP 301 Moved Permanently trong 5ms, bảo toàn 100% điểm chất lượng SEO (PageRank).
2. **Robots.txt Động**:
   - Chặn Googlebot thu thập dữ liệu các trang nhạy cảm:
     `Disallow: /admin/`, `Disallow: /api/`, `Disallow: /preview/`.
   - Chỉ định chính xác đường dẫn tới `Sitemap: https://school.edu.vn/sitemap.xml`.
