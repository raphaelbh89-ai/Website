---
name: design-tokens
description: Quy tắc dùng Design Tokens (màu, font, spacing, bo góc, style nút) thay vì hard-code giá trị trong component. Dùng khi viết bất kỳ component Frontend hoặc Admin nào có style, hoặc khi cần đổi giao diện tổng thể của toàn site trong tương lai.
---

# Design Tokens

## Nguyên tắc
Không bao giờ viết trực tiếp giá trị màu (`#1a73e8`), khoảng cách (`24px`),
hay bo góc (`8px`) trong component. Luôn tham chiếu tới token qua CSS
variable.

## Bộ token tối thiểu cần có
```css
:root {
  --color-primary: #1a73e8;
  --color-secondary: #f5a623;
  --color-text: #1f2937;
  --color-bg: #ffffff;
  --font-heading: 'Be Vietnam Pro', sans-serif;
  --font-body: 'Inter', sans-serif;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 32px;
  --radius-sm: 4px;
  --radius-lg: 12px;
}
```

## Khi cần giá trị mới
Thêm 1 token mới vào bảng `design_tokens` (và biến CSS tương ứng), không
thêm giá trị hard-code chỉ dùng cho 1 component. Nếu 1 module thật sự cần
màu/kích thước đặc thù không nên áp dụng toàn site, thêm token có scope rõ
ràng (vd `--banner-overlay-opacity`) thay vì hard-code, để sau này vẫn chỉnh
được từ màn hình "Giao diện" trong Admin.

## Khi nâng cấp giao diện toàn site trong tương lai
Chỉ cần đổi giá trị token (qua màn hình Admin hoặc file cấu hình) — không sửa
từng component. Đây là lý do bắt buộc phải tuân thủ quy tắc này ngay từ đầu.
