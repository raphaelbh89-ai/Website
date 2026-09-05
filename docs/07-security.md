# 07. SECURITY ARCHITECTURE SPECIFICATION
## Enterprise-Grade Threat Modeling & Defense-in-Depth

---

### 7.1 MÔ HÌNH BẢO VỆ ĐA LỚP (DEFENSE-IN-DEPTH MATRIX)

```text
       [ Khách truy cập / Tin tặc ]
                    │
                    ▼
┌───────────────────────────────────────────────┐
│ LỚP 1: EDGE SECURITY (Cloudflare)             │ ◄── DDoS Mitigation, WAF, Bot Management, SSL/TLS 1.3
└───────────────────┬───────────────────────────┘
                    │
                    ▼
┌───────────────────────────────────────────────┐
│ LỚP 2: NETWORK & GATEWAY (Reverse Proxy)      │ ◄── Nginx Rate Limiting, HTTP Security Headers, IP Filtering
└───────────────────┬───────────────────────────┘
                    │
                    ▼
┌───────────────────────────────────────────────┐
│ LỚP 3: APPLICATION RUNTIME                    │ ◄── CORS, CSRF Guards, JWT/Cookie Validation, Zod Sanitization
└───────────────────┬───────────────────────────┘
                    │
                    ▼
┌───────────────────────────────────────────────┐
│ LỚP 4: DOMAIN & AUTHORIZATION (RBAC)          │ ◄── Branch Scope Guards, Resource Ownership Verification
└───────────────────┬───────────────────────────┘
                    │
                    ▼
┌───────────────────────────────────────────────┐
│ LỚP 5: DATA ACCESS & STORAGE                  │ ◄── Parameterized Queries, DB Encryption at Rest, Read-only Pools
└───────────────────────────────────────────────┘
```

---

### 7.2 XÁC THỰC VÀ QUẢN LÝ PHIÊN (AUTHENTICATION & SESSION SECURITY)

1. **Cơ chế Token Kép (Dual-token Architecture)**:
   - **Access Token**: JWT có thời hạn ngắn (Short-lived: 15 phút), chứa `userId`, `roles`, `branchId`, ký bằng thuật toán bí mật bất đối xứng (RS256 hoặc EdDSA).
   - **Refresh Token**: Chuỗi ngẫu nhiên 64-byte có độ entropy cao (Long-lived: 7 ngày), được băm SHA-256 lưu trong Database, truyền qua trình duyệt bằng **HttpOnly, Secure, SameSite=Strict Cookie**.
2. **Cơ chế Thu hồi Token Tức thì (Instant Token Revocation)**:
   - Khi người dùng đăng xuất, đổi mật khẩu, hoặc Admin khóa tài khoản:
   - Token JTI (JWT ID) được đưa vào **Redis Blacklist** với thời gian TTL đúng bằng hạn sử dụng còn lại của token. Mọi request tiếp theo mang token này đều bị từ chối ngay tại API Middleware trong vòng 1 miligiây.
3. **Bảo vệ Mật khẩu (Password Security)**:
   - Sử dụng giải thuật băm hiện đại nhất hiện nay: **Argon2id** (với cấu hình tối thiểu: `memoryCost: 65536 KB`, `timeCost: 3 iterations`, `parallelism: 4 threads`). Chống hoàn toàn các cuộc tấn công brute-force bằng dàn GPU.
   - Chính sách mật khẩu: Tối thiểu 10 ký tự, bắt buộc bao gồm chữ hoa, chữ thường, chữ số và ký tự đặc biệt. Chống các mật khẩu phổ biến theo danh sách top 100,000 mật khẩu rò rỉ.

---

### 7.3 PHÂN QUYỀN PHẠM VI CHI NHÁNH (SCOPE-BASED RBAC)

Không dùng mô hình phân quyền Role tĩnh đơn giản (`isAdmin`, `isEditor`). Hệ thống sử dụng mô hình **Atomic Permissions kết hợp Contextual Scope Guard**:

#### Logic kiểm tra quyền truy cập tài nguyên:
```text
IF user.hasRole('SUPER_ADMIN') -> CHO PHÉP TOÀN BỘ (GLOBAL ACCESS)

IF user.hasPermission('articles.update'):
    IF article.branchId IS NULL AND user.isGlobalEditor() -> CHO PHÉP
    IF article.branchId == user.assignedBranchId -> CHO PHÉP
    ELSE -> TỪ CHỐI (403 FORBIDDEN - Không được sửa bài của cơ sở khác)
```
- Mọi câu lệnh cập nhật hoặc xóa trong Repository Layer đều tự động tiêm điều kiện WHERE:
  `WHERE id = :id AND (branch_id = :userBranchId OR :isSuperAdmin = TRUE)`.

---

### 7.4 PHÒNG CHỐNG CÁC LỖ HỔNG WEB TIÊU CHUẨN (OWASP TOP 10)

#### 1. Phòng chống XSS (Cross-Site Scripting)
- **Content Rendering**: Toàn bộ dữ liệu hiển thị trên Next.js mặc định được escape tự động qua React JSX.
- **RichText Sanitization**: Dữ liệu HTML nhập từ WYSIWYG Editor (nội dung bài viết) bắt buộc phải đi qua thư viện **DOMPurify / sanitize-html** trên máy chủ trước khi lưu vào Database. Bộ lọc chỉ chấp nhận danh sách thẻ an toàn (`<p>, <h2>, <h3>, <strong>, <em>, <ul>, <li>, <a>, <img>`), tước bỏ hoàn toàn `<script>, <iframe>, <object>, onload=, onerror=`.
- **Content Security Policy (CSP)**: Thiết lập HTTP Response Headers nghiêm ngặt:
  `Content-Security-Policy: default-src 'self'; script-src 'self' 'nonce-...'; object-src 'none'; base-uri 'self';`

#### 2. Phòng chống CSRF (Cross-Site Request Forgery)
- Cookie xác thực sử dụng cờ `SameSite=Strict`.
- Các request thay đổi trạng thái (POST, PUT, DELETE) từ Admin UI đều đính kèm một custom header `X-Requested-With: XMLHttpRequest` hoặc CSRF Token đồng bộ (Double Submit Cookie Pattern). Các trình duyệt từ chối gửi header tùy chỉnh này trong các cuộc tấn công cross-site.

#### 3. Phòng chống SQL Injection
- Tuyệt đối không sử dụng string concatenation để ghép câu truy vấn SQL.
- 100% truy vấn dữ liệu được thực thi thông qua **ORM (Prisma / Drizzle)** sử dụng Prepared Statements và Parameterized Queries.

#### 4. Phòng chống Tấn công dò quét & Brute-force (Rate Limiting)
- Triển khai Rate Limiting trên Redis theo từng IP và từng Account:
  - Endpoint đăng nhập (`/api/v1/auth/login`): Tối đa 5 lần thử sai liên tiếp. Sau 5 lần, khóa IP đó 15 phút.
  - Endpoint nộp form công cộng: Tối đa 5 lượt nộp / 10 phút / IP.
  - Endpoint API chung: Giới hạn 100 request/phút.

---

### 7.5 AN TOÀN TẢI LÊN TẬP TIN (FILE UPLOAD SANDBOXING)

Tải lên tập tin là một trong những vector tấn công nguy hiểm nhất (tải mã độc webshell, file virus, tệp thực thi).

#### Kiến trúc bảo vệ 5 bước:
1. **Cô lập hạ tầng**: Không bao giờ lưu file trực tiếp trên ổ cứng máy chủ chạy code. File được đẩy thẳng lên S3/R2 Bucket.
2. **Kiểm tra File Signature (Magic Bytes)**: Không tin tưởng phần mở rộng của file (`.jpg`, `.pdf`) do trình duyệt gửi lên. Server kiểm tra 4-8 byte đầu tiên của file nhị phân để nhận diện chính xác MIME type thực sự.
3. **Khử độc file ảnh (Image Re-encoding)**: Toàn bộ ảnh tải lên đều được xử lý giải mã và mã hóa lại qua thư viện `Sharp`. Quá trình này sẽ loại bỏ hoàn toàn các payload mã độc giấu trong EXIF metadata của ảnh.
4. **Kiểm soát file SVG**: File vector `.svg` là mã XML và có thể chứa mã `<script>`. Nếu cho phép upload SVG, hệ thống bắt buộc phải khử độc bằng `svg-purifier` hoặc chuyển đổi hoàn toàn sang PNG.
5. **Randomize Storage Key**: Tên file gốc bị đổi hoàn toàn thành chuỗi UUIDv7 ngẫu nhiên, ngăn chặn path traversal hoặc trùng lặp ghi đè.

---

### 7.6 BẢO VỆ CHUYÊN BIỆT CHO TRANG QUẢN TRỊ (ADMIN LOCKDOWN)

1. **Phân tách Subdomain**:
   - Website công chúng: `https://school.edu.vn`
   - Dashboard quản trị: `https://portal-admin.school.edu.vn`
2. **Tùy chọn IP Whitelisting**:
   - Khả năng bật chế độ chỉ cho phép dải IP nội bộ của trường học truy cập trang Admin thông qua Cloudflare WAF Rules.
3. **Sẵn sàng cho Xác thực 2 bước (MFA / TOTP)**:
   - Thiết kế schema cho phép bật Authenticator App (Google Authenticator, Microsoft Authenticator) bằng chuẩn RFC 6238 TOTP trước khi thao tác các tác vụ nhạy cảm (Xóa bài, xuất danh sách học sinh, phân quyền).
4. **Bất biến hóa Nhật ký kiểm toán (Tamper-evident Audit Logging)**:
   - Toàn bộ bản ghi trong bảng `audit_logs` chỉ hỗ trợ thao tác `INSERT`. Hệ thống KHÔNG CUNG CẤP bất kỳ hàm `UPDATE` hay `DELETE` nào đối với bảng này, đảm bảo vết tích điều tra luôn nguyên vẹn khi có sự cố an ninh nội bộ.
