---
description: Tạo 1 màn hình CRUD admin mới cho 1 entity theo skill admin-crud-generator. Dùng "/build-admin-page <tên entity>", vd "/build-admin-page branch".
argument-hint: <tên-entity>
---

Tạo màn hình quản trị cho entity: **$ARGUMENTS**

1. Nếu entity chưa có trong `docs/schema.md`, dùng subagent `architect` để bổ
   sung schema và endpoint tương ứng vào `docs/api-contract.md` trước.
2. Dùng subagent `backend-developer` để đảm bảo API CRUD cho entity này đã
   sẵn sàng (list có filter/phân trang, create, update, delete).
3. Dùng subagent `admin-ui-developer` để dựng màn hình theo đúng skill
   `admin-crud-generator`: dùng `<AdminDataTable>`, form validate theo schema,
   confirm dialog khi xóa, áp dụng đúng luật phân quyền theo role (đặc biệt
   nếu entity có `branch_id`).
4. Dùng subagent `qa-reviewer` để xác nhận màn hình mới không phá vỡ màn hình
   admin khác đã có.

Báo cáo cuối: các file đã tạo/sửa và đường dẫn để truy cập màn hình mới trong
Admin.
