# 10. MULTI-BRANCH ARCHITECTURE SPECIFICATION
## Scalable Multi-Campus Hierarchy & Tenant Governance

---

### 10.1 PHÂN TẦNG DỮ LIỆU TOÀN CỤC VÀ DỮ LIỆU CƠ SỞ (DATA HIERARCHY)

Hệ sinh thái trường học yêu cầu mô hình dữ liệu linh hoạt, vừa đảm bảo tính thống nhất thương hiệu của toàn hệ thống, vừa cho phép từng cơ sở thể hiện nét đặc thù địa phương.

```text
┌────────────────────────────────────────────────────────────────────────┐
│ MỨC TOÀN CỤC (GLOBAL / ALL-BRANCHES LEVEL)                             │
│ - Triết lý giáo dục, Tầm nhìn, Sứ mệnh cốt lõi                        │
│ - Khung chương trình đào tạo chung (Tiểu học, THCS, Cambridge)        │
│ - Tin tức chung toàn hệ thống, Thông cáo báo chí                      │
│ - Đối tác học thuật quốc tế, Chứng chỉ kiểm định                      │
│ - Mẫu Form tuyển sinh chung                                           │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │ Kế thừa & Bổ sung (Inherits & Overrides)
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│ MỨC CƠ SỞ CỤ THỂ (BRANCH-SPECIFIC LEVEL: BIÊN HÒA, ĐÀ NẴNG, HÀ NỘI)    │
│ - Trang chủ riêng của cơ sở (/co-so/bien-hoa)                         │
│ - Tin tức, Sự kiện nội bộ của học sinh cơ sở                          │
│ - Cơ sở vật chất thực tế (Phòng Lab, Sân bóng, Bể bơi tại địa phương) │
│ - Đội ngũ giáo viên, Ban giám hiệu trực tiếp tại cơ sở                │
│ - Thông tin liên hệ, Bản đồ vị trí, Hotline tuyển sinh riêng          │
│ - Tùy biến Theme (Màu sắc điểm nhấn riêng nếu có)                     │
└────────────────────────────────────────────────────────────────────────┘
```

#### Quy tắc hiển thị nội dung phân cấp (Inheritance Rules):
1. **Truy vấn Tin tức tại Cơ sở Biên Hòa**:
   - Query: `WHERE status = 'PUBLISHED' AND (branch_id = :bien_hoa_id OR branch_id IS NULL)`.
   - Kết quả: Học sinh cơ sở Biên Hòa xem được cả tin tức nội bộ cơ sở và các thông báo lớn của toàn trường.
2. **Truy vấn Tin tức tại Trang chủ Toàn trường**:
   - Query: `WHERE status = 'PUBLISHED' AND branch_id IS NULL` (hoặc lấy tin tức nổi bật được gắn cờ `is_featured = true` từ các cơ sở).

---

### 10.2 SO SÁNH CÁC CHIẾN LƯỢC ĐIỀU HƯỚNG URL CHO NHIỀU CƠ SỞ

| Phương án | Cấu trúc URL | Ưu điểm | Nhược điểm | Đánh giá kiến trúc |
| :--- | :--- | :--- | :--- | :--- |
| **1. Subpath (Đề xuất)** | `school.edu.vn/co-so/bien-hoa`<br>`school.edu.vn/co-so/quan-2` | **Tối ưu SEO tuyệt đối** (toàn bộ sức mạnh Domain Authority tập trung vào 1 domain gốc); Quản lý SSL/Cookie cực kỳ đơn giản; Chi phí CDN thấp. | Cần cấu hình routing cẩn thận trong Next.js để tránh xung đột slug tĩnh. | **LỰA CHỌN TỐI ƯU NHẤT CHO TRƯỜNG HỌC** |
| **2. Subdomain** | `bienhoa.school.edu.vn`<br>`quan2.school.edu.vn` | Tách biệt trực quan về mặt tên miền; Phù hợp nếu các cơ sở hoạt động độc lập cao độ. | Domain Authority bị Google xem như các trang web riêng lẻ; Quản lý Wildcard SSL phức tạp hơn; Cookie chia sẻ cần domain scope. | Có thể hỗ trợ song song (Alias) nếu khách hàng yêu cầu. |
| **3. Multi-domain (Tên miền riêng)** | `truongbienhoa.edu.vn`<br>`truongdanang.edu.vn` | Định vị thương hiệu địa phương mạnh mẽ. | Phân mảnh SEO nặng nề; Cần quản lý cấu hình nhiều domain trên Cloudflare và chứng chỉ SSL riêng lẻ. | Chỉ nên dùng khi cơ sở là một pháp nhân trường độc lập. |

#### Kiến trúc linh hoạt (Hybrid Hostname Routing):
Next.js Middleware được thiết kế để hỗ trợ cả 2 phương án cùng lúc:
- Khách vào `school.edu.vn/co-so/bien-hoa` -> Route tới thư mục `/branches/bien-hoa`.
- Nếu trường có tên miền riêng `bienhoa.school.edu.vn` trỏ về -> Middleware tự động rewrite nội bộ sang `/branches/bien-hoa` mà không làm thay đổi URL trên thanh địa chỉ của khách truy cập.

---

### 10.3 KIỂM SOÁT PHẠM VI DỮ LIỆU CHO QUẢN TRỊ VIÊN (TENANT DATA ISOLATION)

Hệ thống bảo đảm tính bảo mật và sự riêng tư giữa các cơ sở bằng cách lọc dữ liệu tự động tại tầng dịch vụ (Service Layer):

#### Bảng ma trận quyền hạn theo cơ sở (Branch Permission Matrix):

| Vai trò | Phạm vi (`branch_id`) | Quyền hạn đối với Trang & Bài viết | Quyền hạn đối với Hồ sơ Tuyển sinh |
| :--- | :--- | :--- | :--- |
| **Super Admin** | `NULL` (Toàn cầu) | Toàn quyền tạo, sửa, xóa, duyệt bài của mọi cơ sở và bài viết toàn trường. | Xem và xuất toàn bộ hồ sơ nộp của tất cả các cơ sở. |
| **Branch Director (Hiệu trưởng CS)** | `bien-hoa` | Duyệt bài viết và chỉnh sửa các trang thuộc cơ sở Biên Hòa. Không thể sửa bài cơ sở khác. | Xem toàn bộ hồ sơ học sinh đăng ký vào cơ sở Biên Hòa. |
| **Branch Content Editor** | `bien-hoa` | Soạn bài viết thuộc cơ sở Biên Hòa, gửi duyệt. | Không có quyền xem hồ sơ tuyển sinh. |
| **Branch Admissions Officer** | `bien-hoa` | Không có quyền sửa nội dung website. | Xem danh sách nộp form cơ sở Biên Hòa, cập nhật trạng thái tư vấn. |

---

### 10.4 TÙY BIẾN GIAO DIỆN THEO CƠ SỞ (BRANCH-LEVEL THEMING)

Mỗi cơ sở có thể có những đặc thù riêng (Ví dụ: Cơ sở Mầm non quốc tế có tông màu tươi sáng, Cơ sở Trung học Cambridge có tông màu học thuật trang trọng).

#### Cơ chế ghi đè Theme bằng CSS Variable Scoping:
1. Bản ghi `branches` lưu liên kết `theme_id` riêng.
2. Tại component Root Layout của Cơ sở, Server render tiêm các biến CSS tương ứng:
```html
<!-- Khi render trang cơ sở Biên Hòa -->
<div id="branch-root" style="--color-primary: #047857; --color-accent: #f59e0b; --font-heading: 'Outfit', sans-serif;">
  <!-- Toàn bộ các Block bên trong tự động thừa hưởng màu sắc này mà không cần code lại -->
  <HeroBanner />
  <ProgramList />
</div>
```
- Các Block giao diện không bao giờ dùng mã màu hex cứng (như `bg-[#0052cc]`) mà luôn sử dụng biến token `bg-[var(--color-primary)]`, cho phép đổi màu toàn bộ cơ sở trong 1 giây qua Admin Dashboard.
