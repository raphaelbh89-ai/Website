---
name: admin-crud-generator
description: Pattern chuẩn để tạo một màn hình CRUD admin mới (branch, category, post, user, form_submission...) sao cho nhất quán về UX và code giữa các entity. Dùng khi cần thêm entity quản lý mới vào trang Admin.
---

# Admin CRUD Pattern

Mỗi màn hình quản lý entity mới gồm đúng 4 phần, tái sử dụng component chung:

1. **List view**: bảng dữ liệu + filter/search + phân trang. Dùng chung
   `<AdminDataTable columns={...} fetcher={...} />`, không viết bảng riêng.
2. **Form view**: dùng `react-hook-form` + validate bằng schema (zod hoặc JSON
   Schema tùy stack) tương ứng với entity đó. Field type mapping dùng lại
   đúng bộ đã có ở skill `module-registry` (text/richtext/image/list...) nếu
   entity có field tương tự.
3. **Delete**: luôn có confirm dialog (`<ConfirmDialog />` dùng chung), không
   xóa ngay khi click.
4. **Phân quyền**: trước khi render nút Sửa/Xóa, kiểm tra role hiện tại
   (Admin tổng thấy tất cả; Admin cơ sở chỉ thấy record có `branch_id` khớp
   với cơ sở mình quản lý; Biên tập viên không thấy nút Xóa).

## Khi entity có quan hệ cây (category, menu)
Dùng chung `<TreeManager />` (kéo-thả sắp xếp cấp cha-con), không viết UI cây
riêng cho category và menu.

## Checklist "coi là xong"
- [ ] Dùng `<AdminDataTable>`, không viết bảng HTML tay.
- [ ] Có confirm dialog khi xóa.
- [ ] Áp dụng đúng luật phân quyền theo role.
- [ ] Nếu entity có `branch_id`, filter mặc định theo cơ sở của người dùng
      hiện tại (trừ Admin tổng).
