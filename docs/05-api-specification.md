# 05. API SPECIFICATION & PROTOCOL DESIGN
## RESTful Enterprise API Contracts & Standards

---

### 5.1 CHUẨN ĐỊNH DẠNG RESPONSE & ERROR FORMAT TOÀN HỆ THỐNG

Tất cả các API Endpoints trong hệ thống đều tuân thủ định dạng JSON đồng nhất, có tính đoán trước cao (Predictable Envelope Format).

#### 1. Định dạng phản hồi thành công (Standard Success Envelope)
```json
{
  "success": true,
  "data": {},
  "meta": {
    "timestamp": "2026-09-05T18:00:00.000Z",
    "requestId": "req_01918a5b-9b42-7000-8000-000000000001",
    "pagination": {
      "page": 1,
      "limit": 20,
      "totalItems": 150,
      "totalPages": 8,
      "hasNextPage": true,
      "hasPrevPage": false
    }
  },
  "error": null
}
```

#### 2. Định dạng phản hồi lỗi (Standard Error Envelope)
```json
{
  "success": false,
  "data": null,
  "meta": {
    "timestamp": "2026-09-05T18:00:00.000Z",
    "requestId": "req_01918a5b-9b42-7000-8000-000000000001"
  },
  "error": {
    "code": "VALIDATION_FAILED",
    "message": "Dữ liệu gửi lên không hợp lệ.",
    "details": [
      {
        "field": "email",
        "issue": "INVALID_EMAIL",
        "message": "Địa chỉ email không đúng định dạng."
      }
    ]
  }
}
```

#### Bảng mã lỗi chuẩn (Standard Error Codes):
- `UNAUTHORIZED` (401): Chưa đăng nhập hoặc Token hết hạn.
- `FORBIDDEN` (403): Không có quyền truy cập tài nguyên hoặc không thuộc chi nhánh cho phép.
- `NOT_FOUND` (404): Không tìm thấy tài nguyên (Page, Article, Branch).
- `VALIDATION_FAILED` (422): Lỗi dữ liệu đầu vào theo Zod Schema.
- `CONFLICT` (409): Trùng lặp Slug, Email, hoặc xung đột phiên bản sửa đổi (Revision Conflict).
- `RATE_LIMIT_EXCEEDED` (429): Vượt quá tần suất gửi request cho phép.
- `INTERNAL_SERVER_ERROR` (500): Lỗi hệ thống ngoài dự kiến.

---

### 5.2 CHIẾN LƯỢC PHÂN TRANG, LỌC VÀ SẮP XẾP (PAGINATION, FILTER & SORT)

1. **Phân trang dạng Offset (`page`, `limit`)**:
   - Sử dụng cho: Trang Admin quản lý bài viết, trang danh bạ cơ sở, danh sách form nộp.
   - Query: `?page=2&limit=20`.
2. **Phân trang dạng Cursor (`cursor`, `limit`)**:
   - Sử dụng cho: Luồng tải vô tận (Infinite Scroll) của Thư viện ảnh (Media Library), Lịch sử Audit Logs lớn, hoặc News Feed trên mobile.
   - Query: `?cursor=01918a5b-0001&limit=20`.
3. **Cơ chế lọc và tìm kiếm (Filtering & Search)**:
   - Quy chuẩn query params: `?filter[status]=PUBLISHED&filter[branchId]=bien-hoa&search=tuyen-sinh&sort=-publishedAt`.
   - Tiền tố `-` trong `sort` biểu thị sắp xếp giảm dần (DESC).

---

### 5.3 DANH TẮC CHI TIẾT CÁC ENDPOINTS

#### NHÓM 1: AUTHENTICATION API
- `POST /api/v1/auth/login`: Đăng nhập với `email` và `password`. Trả về JWT Access Token và Set-Cookie `refreshToken` (HttpOnly, Secure, SameSite=Strict).
- `POST /api/v1/auth/refresh`: Cấp mới Access Token bằng Refresh Token.
- `POST /api/v1/auth/logout`: Hủy phiên đăng nhập, xóa cookie, đưa token vào Redis Revocation Blacklist.
- `GET  /api/v1/auth/me`: Lấy thông tin cá nhân, vai trò và danh sách quyền hạn (Permissions) của user hiện tại.
- `POST /api/v1/auth/forgot-password`: Gửi email chứa link đặt lại mật khẩu với One-Time Token (TTL 15 phút).
- `POST /api/v1/auth/reset-password`: Đặt lại mật khẩu mới thông qua Token.

---

#### NHÓM 2: PAGES & PAGE BUILDER API
- `GET    /api/v1/pages`: Danh sách trang (Hỗ trợ lọc theo `branchId`, `status`, `search`).
- `GET    /api/v1/pages/:id`: Chi tiết 1 trang theo ID (bao gồm toàn bộ tree Sections và Blocks).
- `GET    /api/v1/public/pages/:slug`: Endpoint dành cho Public Web render trang theo URL slug và branch header.
- `POST   /api/v1/pages`: Tạo mới một trang (gắn Template, Slug, SEO).
- `PUT    /api/v1/pages/:id`: Cập nhật thông tin tổng quan của trang.
- `DELETE /api/v1/pages/:id`: Xóa mềm trang.
- `POST   /api/v1/pages/:id/publish`: Chuyển trạng thái sang `PUBLISHED`, kích hoạt Cache Invalidation trên Next.js và Cloudflare CDN.
- `POST   /api/v1/pages/:id/sections`: Thêm Section mới vào trang.
- `PUT    /api/v1/pages/:id/sections/reorder`: Thay đổi thứ tự sắp xếp các Section (`[{ id, sortOrder }]`).
- `DELETE /api/v1/pages/sections/:sectionId`: Xóa 1 Section và toàn bộ Blocks bên trong.
- `POST   /api/v1/pages/sections/:sectionId/blocks`: Thêm Block mới vào Section.
- `PUT    /api/v1/pages/blocks/:blockId`: Cập nhật cấu hình `config` của một Block.
- `PUT    /api/v1/pages/blocks/reorder`: Kéo thả thay đổi thứ tự Block trong cùng Section hoặc sang Section khác.
- `POST   /api/v1/pages/blocks/:blockId/duplicate`: Nhân bản một Block.
- `DELETE /api/v1/pages/blocks/:blockId`: Xóa một Block.

---

#### NHÓM 3: EDITORIAL ARTICLES API
- `GET    /api/v1/articles`: Danh sách bài viết (Phân trang, lọc `categoryId`, `branchId`, `status`, `tag`).
- `GET    /api/v1/articles/:id`: Chi tiết bài viết cho Admin.
- `GET    /api/v1/public/articles/:slug`: Chi tiết bài viết cho Public Web (Tự tăng View Count có chống spam IP).
- `POST   /api/v1/articles`: Tạo bài viết mới.
- `PUT    /api/v1/articles/:id`: Cập nhật bài viết.
- `DELETE /api/v1/articles/:id`: Xóa mềm bài viết.
- `POST   /api/v1/articles/:id/publish`: Xuất bản bài viết.

---

#### NHÓM 4: TAXONOMY (CATEGORIES & TAGS) API
- `GET    /api/v1/categories`: Lấy cây phân cấp danh mục (Nested Tree).
- `POST   /api/v1/categories`: Tạo danh mục mới.
- `PUT    /api/v1/categories/:id`: Cập nhật danh mục.
- `DELETE /api/v1/categories/:id`: Xóa danh mục (Yêu cầu di chuyển bài viết thuộc danh mục này sang mục khác).
- `GET    /api/v1/tags`: Tìm kiếm tag hoặc danh sách phổ biến.
- `POST   /api/v1/tags`: Tạo tag mới.

---

#### NHÓM 5: SCHOOL & MULTI-BRANCH API
- `GET    /api/v1/branches`: Danh sách toàn bộ các cơ sở trường học.
- `GET    /api/v1/public/branches/:slug`: Lấy thông tin chi tiết một cơ sở kèm danh sách cơ sở vật chất và chương trình học.
- `POST   /api/v1/branches`: Tạo cơ sở mới.
- `PUT    /api/v1/branches/:id`: Cập nhật thông tin cơ sở (Địa chỉ, bản đồ, hotline, theme riêng).
- `GET    /api/v1/programs`: Danh sách chương trình đào tạo.
- `POST   /api/v1/programs`: Tạo chương trình đào tạo mới.
- `PUT    /api/v1/programs/:id`: Cập nhật chương trình đào tạo.
- `GET    /api/v1/partners`: Danh sách đối tác học thuật.
- `POST   /api/v1/partners`: Thêm đối tác.

---

#### NHÓM 6: NAVIGATION & MENUS API
- `GET    /api/v1/public/menus/:code`: Lấy cấu trúc Menu hiển thị cho Website (đã resolve URL đầy đủ theo Target Type).
- `GET    /api/v1/menus`: Danh sách các Menu trong Admin.
- `POST   /api/v1/menus`: Tạo vùng Menu mới.
- `POST   /api/v1/menus/:id/items`: Thêm Menu Item.
- `PUT    /api/v1/menus/:id/items/reorder`: Cập nhật toàn bộ cây phân cấp của Menu (Drag & Drop Nested Tree).
- `DELETE /api/v1/menus/items/:itemId`: Xóa một Menu Item và các mục con của nó.

---

#### NHÓM 7: MEDIA LIBRARY API
- `POST   /api/v1/media/presigned-url`: Xin cấp Pre-signed URL từ AWS S3/Cloudflare R2 để trình duyệt upload trực tiếp file lớn (kèm xác thực MIME type và giới hạn kích thước).
- `POST   /api/v1/media/confirm`: Báo cho server biết file đã upload xong lên S3 để server kích hoạt background worker tạo thumbnail và lưu vào DB.
- `GET    /api/v1/media`: Danh sách file media (Lọc theo folder, MIME type, tìm kiếm tên).
- `PUT    /api/v1/media/:id`: Cập nhật Alt Text, Caption, Tên file.
- `DELETE /api/v1/media/:id`: Xóa file (Xóa bản ghi DB và đẩy task xóa file trên S3).
- `POST   /api/v1/media/folders`: Tạo thư mục quản lý file.

---

#### NHÓM 8: DYNAMIC FORM ENGINE API
- `GET    /api/v1/forms`: Danh sách các biểu mẫu trong hệ thống.
- `GET    /api/v1/public/forms/:code`: Lấy schema các trường của Form để render trên trang Public.
- `POST   /api/v1/public/forms/:code/submit`: Khách gửi biểu mẫu (Bảo vệ bởi Rate Limiter, CAPTCHA token và Honeypot field).
- `GET    /api/v1/forms/:id/submissions`: Admin xem danh sách nộp form (Lọc theo trạng thái, cơ sở, thời gian).
- `PUT    /api/v1/forms/submissions/:submissionId/status`: Cập nhật trạng thái xử lý hồ sơ tuyển sinh (Mới -> Đang tư vấn -> Đã nhập học).
- `GET    /api/v1/forms/:id/export`: Xuất dữ liệu nộp ra file Excel/CSV.

---

#### NHÓM 9: SYSTEM, THEME, SEO & AUDIT API
- `GET    /api/v1/settings`: Lấy danh sách cấu hình hệ thống (theo chi nhánh hoặc toàn cục).
- `PUT    /api/v1/settings`: Cập nhật cấu hình.
- `GET    /api/v1/themes`: Danh sách các Theme khả dụng.
- `GET    /api/v1/themes/:id/tokens`: Lấy toàn bộ Design Tokens của Theme.
- `PUT    /api/v1/themes/:id/tokens`: Chỉnh sửa Design Tokens trực quan.
- `GET    /api/v1/audit-logs`: Xem lịch sử thao tác của các quản trị viên.
- `GET    /api/v1/revisions/:entityType/:entityId`: Danh sách các bản nháp lịch sử.
- `POST   /api/v1/revisions/:id/rollback`: Khôi phục dữ liệu về bản ghi lịch sử tương ứng.
