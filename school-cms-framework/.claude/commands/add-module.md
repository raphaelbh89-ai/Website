---
description: Thêm 1 module type mới end-to-end (schema, backend, admin form, frontend component) theo đúng skill module-registry. Dùng "/add-module <tên module>", vd "/add-module testimonial".
argument-hint: <tên-module>
---

Thêm module type mới: **$ARGUMENTS**

Thực hiện theo đúng skill `module-registry`, theo thứ tự:

1. Dùng subagent `architect` để định nghĩa `config_schema` (JSON Schema) cho
   module này và thêm vào `docs/schema.md` dưới dạng 1 record `module_types`
   mới. KHÔNG tạo bảng DB riêng cho module này.
2. Dùng subagent `backend-developer` để xác nhận module mới hoạt động được
   qua endpoint generic `/module-types`, `/module-instances` sẵn có — chỉ cần
   seed record `module_types` mới, không viết endpoint riêng.
3. Dùng subagent `frontend-developer` để tạo 1 component mới trong
   `components/modules/` cho module này và đăng ký vào
   `moduleComponentRegistry`.
4. Dùng subagent `admin-ui-developer` để xác nhận form tự sinh từ
   `config_schema` hiển thị và lưu đúng dữ liệu — nếu schema cần loại field
   chưa có trong field-type mapping chung, thêm loại field đó vào mapping
   chung (không tạo form riêng).
5. Dùng subagent `qa-reviewer` để chạy checklist ở skill `module-registry`
   trước khi báo hoàn tất.

Báo cáo cuối: tên module, các file đã tạo/sửa, và xác nhận rằng module cũ
không bị ảnh hưởng.
