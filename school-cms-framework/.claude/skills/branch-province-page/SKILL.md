---
name: branch-province-page
description: Pattern triển khai "trang tỉnh/cơ sở" — tái sử dụng cấu trúc Page + Module giống trang chủ nhưng gắn với 1 branch cụ thể. Dùng khi tạo hoặc sửa logic liên quan tới trang riêng của từng cơ sở/chi nhánh, hoặc khi form liên hệ/tư vấn cần gắn với 1 cơ sở.
---

# Branch / Province Page Pattern

## Nguyên tắc cốt lõi
Trang tỉnh KHÔNG phải là 1 loại trang code riêng — nó là `page.type = 'province'`
với `branch_id` bắt buộc, dùng lại đúng Page Builder engine (xem skill
`page-builder`) và đúng các module_type đã có (banner, tin tức, giới thiệu
chương trình...). Khác biệt duy nhất là `config_data` của từng module instance
chứa nội dung riêng cho cơ sở đó.

## Khi tạo trang tỉnh mới cho 1 cơ sở
1. Tạo `branch` record (tên, tỉnh, địa chỉ, tọa độ, hotline, ảnh).
2. Tạo `page` mới: `type = 'province'`, `branch_id = <id cơ sở>`.
3. Thêm block như bình thường (banner riêng của cơ sở, tin tức lọc theo
   `branch_id`, module danh sách cơ sở có thể highlight cơ sở hiện tại).
4. KHÔNG viết route hay component riêng cho từng tỉnh — route dùng slug động
   (vd `/co-so/[slug]`) trỏ chung 1 template Page.

## Module tin tức khi ở trang tỉnh
Module `news_list` khi đặt trong page có `branch_id` PHẢI tự động filter
`posts.branch_id = page.branch_id` (trừ khi config_data của module chỉ định
khác) — không cần thêm module_type riêng "tin tức theo cơ sở".

## Form liên hệ / đăng ký tư vấn ở trang tỉnh
Khi submit từ trang có `branch_id`, `form_submissions.branch_id` phải được
gán tự động theo trang đó, để Admin cơ sở chỉ thấy lead của mình (xem skill
`admin-crud-generator`, mục phân quyền).
