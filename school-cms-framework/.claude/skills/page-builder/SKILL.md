---
name: page-builder
description: Quy tắc triển khai Page + Block (Page Builder) — thứ tự block, draft/publish, lên lịch hiện/ẩn theo thời gian, hiển thị theo thiết bị. Dùng khi code API hoặc UI liên quan tới việc thêm/sắp xếp/ẩn-hiện block trong 1 trang, hoặc khi tạo loại trang mới (home/province/news_detail/contact/custom).
---

# Page Builder Rules

## Cấu trúc
- 1 `page` có nhiều `page_blocks`, mỗi block trỏ 1 `module_instance`.
- Field bắt buộc trên mỗi block: `order` (int), `visible` (bool),
  `device_visibility` (`all|desktop|mobile`), `start_date`, `end_date`
  (nullable).

## Quy tắc render (áp dụng cả backend query lẫn frontend)
Một block được hiển thị ở public site khi và chỉ khi TẤT CẢ đúng:
1. `page.status = 'published'`
2. `block.visible = true`
3. `module_instance.status = 'published'`
4. Hiện tại nằm trong `[start_date, end_date]` HOẶC cả hai đều null
5. Thiết bị hiện tại khớp `device_visibility` (hoặc field = `all`)

## Loại trang (page.type)
- `home`: không cần branch_id
- `province`: BẮT BUỘC có branch_id — xem thêm skill `branch-province-page`
- `news_detail`: cấu hình được nghĩa là admin chọn được các block phụ hiển thị
  quanh nội dung bài viết (vd block "bài viết liên quan", block CTA đăng ký
  tư vấn), không phải chỉ hiển thị nội dung bài viết thô.
- `contact`, `custom`: dùng chung engine block như trên, không cần logic riêng.

## Khi thêm loại page mới
Không tạo bảng hay logic render riêng — chỉ thêm 1 giá trị `type` mới và (nếu
cần) field riêng cho loại đó (vd `branch_id` cho `province`). Engine block ở
trên áp dụng chung cho mọi loại trang.
