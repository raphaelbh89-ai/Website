# 04. MODULE & BLOCK SYSTEM SPECIFICATION
## Data-Driven Page Builder & Decoupled Rendering Engine

---

### 4.1 PHÂN BIỆT RÕ RÀNG CÁC KHÁI NIỆM TRONG CMS FRAMEWORK

Để tránh sự nhầm lẫn phổ biến giữa các tầng khái niệm, framework thiết lập hệ thống định nghĩa chuẩn mực:

```text
┌────────────────────────────────────────────────────────────────────────┐
│ 1. CONTENT TYPE (Thực thể dữ liệu độc lập)                             │
│    Ví dụ: Article, Branch, Program, Teacher, Partner.                  │
│    Đặc điểm: Chứa dữ liệu thuần túy (Raw Data), không chứa UI layout.  │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │ Được truy vấn hoặc hiển thị qua
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│ 2. BLOCK (Khối giao diện nguyên tử có thể kéo thả)                     │
│    Ví dụ: HeroBanner, NewsList, TestimonialSlider, FormBlock.          │
│    Đặc điểm: Nhận Config (JSON) và render ra React Component.         │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │ Được xếp theo chiều ngang/cột vào
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│ 3. SECTION (Vùng bố cục ngang của trang)                               │
│    Ví dụ: Full-width Hero Section, 2-Column Split Section.             │
│    Đặc điểm: Quản lý Background, Padding, Margin, Container width.     │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │ Được sắp xếp theo chiều dọc vào
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│ 4. PAGE (Trang hoàn chỉnh)                                             │
│    Ví dụ: /gioi-thieu, /tuyen-sinh, /co-so-bien-hoa.                   │
│    Đặc điểm: Có URL Slug, SEO Metadata, chứa danh sách Sections.       │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │ Khởi tạo từ
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│ 5. TEMPLATE (Mẫu bố cục khung cấu trúc)                                │
│    Ví dụ: Standard Article Template, Campus Landing Page Template.     │
│    Đặc điểm: Bộ khung định vị sẵn các Sections/Blocks chuẩn.           │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │ Bao bọc bởi
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│ 6. THEME (Hệ thống thiết kế toàn cục - Design Tokens)                  │
│    Ví dụ: Brand Emerald, Royal Navy, Festive Gold.                     │
│    Đặc điểm: Định nghĩa màu sắc, font chữ, bo góc, bóng đổ qua CSS.   │
└────────────────────────────────────────────────────────────────────────┘
```

---

### 4.2 DANH MỤC CÁC BLOCK CHUẨN (STANDARD BLOCK CATALOG)

Framework cung cấp sẵn 16 Block chuẩn được tối ưu hóa cho hệ sinh thái trường học:

| Block Code | Tên hiển thị | Danh mục | Mục đích |
| :--- | :--- | :--- | :--- |
| `hero_banner` | Hero Banner Lớn | Layout | Banner đầu trang với Tiêu đề, Phụ đề, Nút CTA và Ảnh/Video nền |
| `rich_text` | Văn bản định dạng | Content | Trình soạn thảo văn bản tự do WYSIWYG, trích dẫn, ảnh nội dung |
| `image_text` | Ảnh kèm chữ (Split) | Layout | Bố cục 2 cột (1 bên ảnh cơ sở vật chất, 1 bên bài giới thiệu) |
| `news_list` | Danh sách bài viết | School/Content | Hiển thị bài viết động theo Category, Chi nhánh, Dạng Grid/List/Slider |
| `branch_list` | Danh sách cơ sở | School | Bản đồ và danh sách các cơ sở trường học kèm địa chỉ, hotline |
| `program_list` | Chương trình đào tạo | School | Danh sách các khối học (Mầm non, Tiểu học, Trung học, Quốc tế) |
| `partner_slider`| Logo đối tác liên kết| Media | Slider chạy tự động logo các tổ chức kiểm định, đối tác đại học |
| `gallery` | Thư viện hình ảnh | Media | Trưng bày ảnh hoạt động học sinh với Lightbox phóng to |
| `video_player` | Trình chiếu Video | Media | Nhúng video giới thiệu trường từ YouTube/Vimeo hoặc S3 |
| `statistics` | Con số ấn tượng | Content | Số liệu nổi bật (100% đỗ ĐH, 20 năm thành lập, 15 cơ sở) |
| `testimonials` | Cảm nhận phụ huynh | Interaction | Đánh giá từ phụ huynh, học sinh xuất sắc kèm hình ảnh |
| `faq_accordion` | Hỏi đáp thường gặp | Interaction | Danh sách câu hỏi thu gọn/mở rộng về học phí, tuyển sinh |
| `cta_banner` | Kêu gọi hành động | Layout | Banner kích thích đăng ký tham quan hoặc tải cẩm nang tuyển sinh |
| `contact_box` | Khối thông tin liên hệ| Layout | Địa chỉ, Email, Giờ làm việc, Bản đồ mini |
| `google_map` | Bản đồ Google Map | Layout | Bản đồ định vị cơ sở trực quan kèm chỉ đường |
| `form_embed` | Nhúng biểu mẫu động | Interaction | Gắn Form đăng ký tuyển sinh được tạo từ Form Builder |

---

### 4.3 THIẾT KẾ BLOCK REGISTRY

Mọi Block trong hệ thống đều phải đăng ký vào một Registry tập trung (`BlockRegistry`). Đây là "bộ não" kết nối giữa việc cấu hình trên Admin và việc hiển thị trên Public Website.

#### Cấu trúc đối tượng đăng ký của mỗi Block:
```typescript
interface BlockDefinition<TConfig = any> {
  id: string;                      // Unique ID của block type (VD: 'news_list')
  type: string;                    // Tên phân loại
  name: string;                    // Tên tiếng Việt hiển thị trên Admin UI
  version: number;                 // Phiên bản schema (VD: 1, 2)
  category: 'layout' | 'content' | 'media' | 'school' | 'interaction';
  icon: string;                    // Tên Lucide icon hiển thị trên menu kéo thả
  schema: ZodSchema<TConfig>;      // Schema xác thực dữ liệu và tự động sinh Form
  defaultConfig: TConfig;          // Giá trị mặc định khi Admin vừa kéo Block vào
  renderer: React.ComponentType<BlockRenderProps<TConfig>>; // React Component trên Public Web
}
```

---

### 4.4 CƠ CHẾ ĐẶC TẢ SCHEMA CHO BLOCK (ZOD & JSON SCHEMA)

Thay vì hard-code các ô nhập liệu cho từng Block trong trang Admin, hệ thống sử dụng **Schema-driven Form Generation**. Admin UI đọc trực tiếp Schema của Block và tự động render Form tương ứng.

#### Ví dụ Schema của Block `news_list` (bằng Zod Schema):
```typescript
export const NewsListBlockSchema = z.object({
  title: z.string().min(1).default("Tin tức mới nhất"),
  subtitle: z.string().optional(),
  categoryId: z.string().uuid().nullable().describe("Chọn danh mục tin tức (để trống là lấy tất cả)"),
  branchId: z.string().uuid().nullable().describe("Chọn cơ sở (để trống là tin tức toàn trường)"),
  limit: z.number().int().min(1).max(24).default(6).describe("Số lượng bài viết hiển thị"),
  layout: z.enum(["grid_3_cols", "grid_4_cols", "slider", "list_compact"]).default("grid_3_cols"),
  showExcerpt: z.boolean().default(true),
  showPublishedDate: z.boolean().default(true),
  showCategoryBadge: z.boolean().default(true),
  viewMoreUrl: z.string().optional().describe("Link xem toàn bộ tin tức")
});
```

---

### 4.5 CƠ CHẾ CẤU HÌNH ĐỘNG TRÊN ADMIN (DYNAMIC BLOCK CONFIGURATION)

Khi Admin thao tác:
1. Admin click **"Thêm Block"** -> Menu hiển thị danh mục các Block từ `BlockRegistry`.
2. Admin chọn **"Danh sách bài viết (News List)"**.
3. Admin UI gọi hàm `createDefaultBlock('news_list')`, trả về một đối tượng Block mới với `config = defaultConfig`.
4. Cửa sổ bên phải hiển thị **Dynamic Form Inspector**:
   - Trường `title` tự render thành `<Input />`.
   - Trường `limit` tự render thành `<Slider min={1} max={24} />` hoặc `<NumberInput />`.
   - Trường `layout` tự render thành `<Select />` với 4 lựa chọn trực quan kèm icon minh họa.
   - Trường `categoryId` tự động kích hoạt truy vấn danh sách Category từ API để render `<AsyncSelect />`.
   - Các trường boolean tự render thành `<Switch />`.
5. Mọi thao tác gõ chữ hoặc bật tắt đều cập nhật tức thời (Live Preview) sang khung xem trước bên trái bằng React State.
- **Kết quả**: Thêm bao nhiêu Block mới cũng KHÔNG CẦN viết thêm một dòng code nào cho trang Admin Dashboard.

---

### 4.6 PHIÊN BẢN HÓA VÀ NÂNG CẤP BLOCK (BLOCK VERSIONING & MIGRATION)

Trong vòng đời 5-10 năm, cấu trúc của một Block chắc chắn sẽ thay đổi (Ví dụ: `HeroBanner v1` chỉ có ảnh tĩnh, `HeroBanner v2` có thêm video nền và nút phụ).

#### Cơ chế quản lý Versioning:
1. Thuộc tính `version` được ghi trực tiếp vào từng bản ghi `page_blocks` trong database (Ví dụ: `block_type_code: "hero_banner", block_version: 1`).
2. Trong `packages/blocks`, hệ thống lưu trữ đồng thời bộ chuyển đổi (Migration Pipe):
```typescript
export const HeroBannerMigrations = {
  1: (configV1: any) => ({
    ...configV1,
    mediaType: "image", // Cung cấp giá trị mặc định cho trường mới của v2
    videoUrl: null,
    secondaryButton: null
  })
};
```
3. Khi Public Renderer nạp một Block có `version < currentVersion`, nó tự động chạy qua Migration Pipe trong memory trước khi đưa vào Component v2, đảm bảo **100% trang cũ không bao giờ bị lỗi trắng trang (Break)** khi Admin chưa mở lại trang đó để lưu phiên bản mới.

---

### 4.7 THIẾT KẾ HỆ THỐNG SECTION (SECTION SYSTEM)

Section là khung chứa có khả năng tùy biến cao, đóng vai trò tạo nhịp điệu thị giác (Visual Rhythm) cho website:

#### Cấu hình tiêu chuẩn của một Section (`settings` JSONB):
```json
{
  "layout": {
    "width": "container" | "full_width" | "narrow",
    "columns": 1 | 2 | 3 | 4,
    "columnGap": "16px" | "24px" | "32px",
    "alignItems": "top" | "center" | "bottom"
  },
  "spacing": {
    "paddingTop": "80px",
    "paddingBottom": "80px",
    "marginTop": "0px",
    "marginBottom": "0px"
  },
  "background": {
    "type": "none" | "color" | "gradient" | "image" | "pattern",
    "colorValue": "var(--color-bg-subtle)",
    "imageUrl": "https://cdn.school.edu.vn/media/pattern-campus.svg",
    "overlayOpacity": 0.05
  },
  "visibility": {
    "hideOnMobile": false,
    "hideOnTablet": false,
    "hideOnDesktop": false
  },
  "customId": "section-tuyen-sinh-2025"
}
```

---

### 4.8 HỆ THỐNG TRANG (PAGE COMPOSITION TREE)

Cấu trúc đối tượng JSON hoàn chỉnh của một Trang trả về từ API/Database:

```json
{
  "id": "01918a5b-0001-7000-8000-000000000001",
  "title": "Trang chủ Cơ sở Biên Hòa",
  "slug": "co-so-bien-hoa",
  "branchId": "01918a5b-branch-bien-hoa",
  "status": "PUBLISHED",
  "templateCode": "campus_landing",
  "sections": [
    {
      "id": "sec-001",
      "name": "Hero Cơ sở",
      "sortOrder": 1,
      "isVisible": true,
      "settings": { "layout": { "width": "full_width" } },
      "blocks": [
        {
          "id": "blk-101",
          "type": "hero_banner",
          "version": 1,
          "sortOrder": 1,
          "config": {
            "title": "Môi trường học tập tiêu chuẩn quốc tế tại Biên Hòa",
            "buttonText": "Đăng ký tham quan"
          }
        }
      ]
    },
    {
      "id": "sec-002",
      "name": "Tin tức & Sự kiện cơ sở",
      "sortOrder": 2,
      "isVisible": true,
      "settings": { "layout": { "width": "container" } },
      "blocks": [
        {
          "id": "blk-102",
          "type": "news_list",
          "version": 1,
          "sortOrder": 1,
          "config": {
            "title": "Tin từ Cơ sở Biên Hòa",
            "branchId": "01918a5b-branch-bien-hoa",
            "limit": 3,
            "layout": "grid_3_cols"
          }
        }
      ]
    }
  ]
}
```

---

### 4.9 HỆ THỐNG TEMPLATE (TEMPLATE SYSTEM & SEPARATION OF CONCERNS)

Template giải quyết triệt để bài toán: **Tách biệt dữ liệu nội dung khỏi cấu trúc hiển thị**.

#### Cơ chế hoạt động:
1. **Dynamic Content Templates** (Ví dụ: `Article Single Template`, `Program Single Template`):
   - Một bài viết chỉ lưu dữ liệu thô: `title`, `author`, `published_at`, `excerpt`, `body_content`.
   - Bài viết được gán với một Template (mặc định hoặc tùy biến).
   - Template chứa các Block mang tính chất "Placeholders":
     - `ArticleHeaderBlock` (Tự động bind `{{article.title}}`, `{{article.author}}`).
     - `ArticleBodyBlock` (Tự động bind `{{article.body_content}}`).
     - `RelatedArticlesBlock` (Tự động query 3 bài viết cùng category).
2. Khi Ban biên tập muốn đổi giao diện đọc báo của toàn bộ 5,000 bài viết:
   - Chỉ cần vào sửa 1 Template duy nhất trong Admin.
   - Toàn bộ 5,000 bài viết tự động cập nhật giao diện mới mà không phải sửa từng bài.

---

### 4.10 CƠ CHẾ HOẠT ĐỘNG CỦA RENDERING ENGINE

Rendering Engine là quy trình chuyển hóa từ dữ liệu JSON cấu hình sang React Virtual DOM trên Server:

```text
               Page Data (JSON từ Database/Cache)
                               │
                               ▼
                   ┌───────────────────────┐
                   │  Root Page Resolver   │  ◄── Đọc Theme ID & Set CSS Variables ở Root
                   └───────────┬───────────┘
                               │
                               ▼
                   ┌───────────────────────┐
                   │   Section Renderer    │  ◄── Duyệt mảng `sections`, áp dụng Padding/Bg
                   └───────────┬───────────┘
                               │
                               ▼
                   ┌───────────────────────┐
                   │    Block Resolver     │  ◄── Kiểm tra `block.type` & `block.version`
                   └───────────┬───────────┘
                               │
                               ▼
                   ┌───────────────────────┐
                   │    Block Registry     │  ◄── Tra cứu Component & chạy Migration nếu cần
                   └───────────┬───────────┘
                               │
            ┌──────────────────┴──────────────────┐
            ▼                                     ▼
┌───────────────────────┐             ┌───────────────────────┐
│ Server Block Component│             │ Client Block Component│
│ (NewsList, HeroBanner)│             │ (Form, Slider, Light) │
└───────────┬───────────┘             └───────────┬───────────┘
            │                                     │
            └──────────────────┬──────────────────┘
                               │
                               ▼
                   ┌───────────────────────┐
                   │  Streamed HTML Output │  ──► Trả về trình duyệt người xem
                   └───────────────────────┘
```

#### Thuật toán an toàn (Fault-Tolerant Rendering):
Nếu một Block bất kỳ gặp lỗi (Ví dụ: dữ liệu JSON bị sai định dạng hoặc Component bị throw exception):
- Hệ thống bọc mỗi Block trong một **React Error Boundary**.
- Nếu Block bị lỗi, nó chỉ render một khoảng trống hoặc thông báo dự phòng ẩn trong log hệ thống, **tuyệt đối không bao giờ làm sập (Crash) toàn bộ trang web** của người dùng.
