---
name: module-registry
description: Quy trình BẮT BUỘC khi thêm một module type mới (banner, testimonial, FAQ, đội ngũ giáo viên...) vào framework CMS trường học mà không sửa code của module đã có. Dùng skill này khi task là "thêm module mới", "tạo loại block mới", hoặc khi review xem một module có tuân thủ pattern Open/Closed không.
---

# Module Registry Pattern

Mục tiêu: thêm 1 module mới chỉ cần thêm file/record mới, KHÔNG sửa file của
module đã tồn tại.

## Các bước bắt buộc

1. **Định nghĩa module_type**
   - `key`: định danh duy nhất, snake_case (vd `partner_slider`)
   - `config_schema`: JSON Schema mô tả field cần nhập (title, type, format
     cho từng field — text/richtext/image/link/list/repeater)
   - `component_key`: trùng với tên file component frontend

2. **Backend — không viết endpoint riêng**
   - Module instance CRUD dùng chung endpoint generic
     `/module-types`, `/module-instances`.
   - `config_data` được validate động bằng chính `config_schema` của
     module_type đó (dùng thư viện validate JSON Schema, không viết validation
     tay theo từng field).

3. **Admin UI — form tự sinh, không code tay**
   - Form nhập liệu dựa vào field-type mapping có sẵn:
     `text → <input>`, `richtext → <RichTextEditor>`, `image → <ImagePicker>`,
     `link → <LinkPicker>`, `list/repeater → <RepeaterField>`.
   - Nếu 1 module cần loại field chưa có trong mapping, thêm loại field đó
     vào mapping chung (dùng lại được cho mọi module sau này), không tạo
     input riêng chỉ cho 1 module.

4. **Frontend — 1 component, đăng ký vào registry**
   - Tạo `components/modules/<module-key>.tsx`, nhận `config_data` làm props.
   - Đăng ký vào `moduleComponentRegistry`:
     ```ts
     export const moduleComponentRegistry: Record<string, React.ComponentType<any>> = {
       banner: BannerModule,
       partner_slider: PartnerSliderModule,
       // thêm dòng mới ở đây khi có module mới — KHÔNG sửa gì khác
     };
     ```
   - Dynamic Block Renderer chỉ cần: `const Component = moduleComponentRegistry[block.module.type_key]; return <Component {...block.module.config_data} />`.

## Checklist "coi là xong"
- [ ] Không có `if (moduleType === '...')` hoặc `switch` theo tên module nằm
      rải rác trong code Page/Block/Layout.
- [ ] Admin tạo được instance mới của module này mà không cần deploy lại.
- [ ] Xóa module type này không làm lỗi các trang dùng module khác.
- [ ] Form admin cho module này tự sinh từ schema, không có component form
      riêng viết tay.
