---
description: Khởi tạo project CMS trường học Giai đoạn 1 (core) — điều phối architect → backend-developer → frontend-developer → admin-ui-developer → qa-reviewer theo đúng thứ tự.
---

Thực hiện Giai đoạn 1 của WORKFLOW.md theo đúng thứ tự sau, không chạy song
song, mỗi bước phải hoàn thành và được xác nhận trước khi qua bước kế:

1. Dùng subagent `architect` để tạo `docs/schema.md` và `docs/api-contract.md`
   cho toàn bộ mô hình dữ liệu cốt lõi (module_types, module_instances, pages,
   page_blocks, menus, categories, posts, branches, form_submissions, settings,
   design_tokens).
2. Dùng subagent `backend-developer` để triển khai migration + API generic
   cho module instance và page block, đúng theo 2 file ở bước 1.
3. Dùng subagent `frontend-developer` để dựng Dynamic Block Renderer và 5
   component module đầu tiên: banner lớn, giới thiệu chương trình học, slide
   danh sách đối tác, danh sách cơ sở/chi nhánh, danh sách tin tức.
4. Dùng subagent `admin-ui-developer` để dựng Page Builder UI (kéo-thả block)
   và form tự sinh từ schema cho 5 module ở bước 3.
5. Dùng subagent `qa-reviewer` để kiểm tra toàn bộ theo checklist Module
   Registry / Design Tokens / Draft-Publish trước khi báo cáo hoàn tất
   Giai đoạn 1.

Sau khi xong, tóm tắt ngắn gọn những gì đã tạo và các bước tiếp theo nên làm
(Giai đoạn 2 trong WORKFLOW.md).
