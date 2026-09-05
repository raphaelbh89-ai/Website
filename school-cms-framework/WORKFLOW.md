# Workflow tổng thể

## Giai đoạn 1 — Core (chạy bằng `/scaffold-project`)
1. `architect` đọc yêu cầu → xuất `docs/schema.md` (module_types, module_instances, pages, page_blocks, menus, categories, posts, branches, form_submissions, settings, design_tokens) + `docs/api-contract.md`.
2. `backend-developer` (đã nạp sẵn skill `module-registry`, `page-builder`) triển khai migration + API generic cho module instance và page block theo đúng 2 file trên.
3. `frontend-developer` (đã nạp sẵn skill `module-registry`, `design-tokens`) dựng Dynamic Block Renderer + 5 component module đầu tiên (banner, giới thiệu chương trình, slide đối tác, danh sách cơ sở, tin tức).
4. `admin-ui-developer` (đã nạp sẵn skill `module-registry`, `admin-crud-generator`, `design-tokens`) dựng Page Builder UI (kéo-thả block) + form tự sinh từ schema cho 5 module trên.
5. `qa-reviewer` kiểm tra toàn bộ trước khi coi Giai đoạn 1 hoàn tất.

## Giai đoạn 2 — Nội dung
Dùng `/build-admin-page category`, `/build-admin-page post`, `/build-admin-page branch` để sinh CRUD; dùng skill `branch-province-page` khi `frontend-developer`/`backend-developer` triển khai trang tỉnh.

## Giai đoạn 3 — Lead
Thêm 2 module type `contact_form`, `consultation_form` bằng `/add-module contact_form` và `/add-module consultation_form`; `backend-developer` thêm bảng `form_submissions` + API xem/đổi trạng thái lead cho `admin-ui-developer`.

## Giai đoạn 4 — Tinh chỉnh
`admin-ui-developer` dựng màn hình chỉnh `design_tokens`; `backend-developer` thêm `start_date/end_date` scheduling nếu chưa có ở Giai đoạn 1; `qa-reviewer` review toàn bộ trước khi go-live.

## Quy tắc chung cho mọi workflow
- Bất kỳ khi nào cần **thêm 1 module type mới** → luôn dùng `/add-module`, không tự code tay rải rác.
- Bất kỳ khi nào cần **thêm 1 màn hình quản trị mới** → luôn dùng `/build-admin-page`.
- `qa-reviewer` luôn chạy **sau cùng**, trước khi coi 1 task là "done".
