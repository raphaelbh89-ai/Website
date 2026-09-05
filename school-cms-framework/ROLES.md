# Vai trò (Roles)

Mỗi role ánh xạ 1-1 với 1 subagent trong `.claude/agents/`. Nếu đội có dev thật,
bảng này cũng dùng được để phân công người.

| Role | Subagent | Trách nhiệm chính | Không được làm |
|---|---|---|---|
| **System Architect** | `architect` | Thiết kế/điều chỉnh schema DB, API contract; giữ tính nhất quán của Module Registry pattern; viết ADR khi có thay đổi lớn | Không tự triển khai code cụ thể |
| **Backend Developer** | `backend-developer` | Migration DB, API cho module/page/menu/branch/post/form-submission | Không tự ý đổi schema mà architect chưa duyệt |
| **Frontend Developer** | `frontend-developer` | Component render module (Next.js), Dynamic Block Renderer, trang tỉnh/tin chi tiết, dùng design tokens | Không hard-code style ngoài token, không code phần admin |
| **Admin UI Developer** | `admin-ui-developer` | Page Builder UI (kéo-thả block), form tự sinh từ JSON Schema, màn hình quản lý menu/danh mục/cơ sở/lead | Không tạo form riêng tay cho từng module (phải schema-driven) |
| **QA Reviewer** | `qa-reviewer` | Review mọi thay đổi có tuân thủ Module Registry / Design Tokens / Draft-Publish không; viết & chạy test | Không tự sửa code, chỉ báo lỗi + đề xuất |

## Nguyên tắc phân quyền
- **Architect quyết định cấu trúc** (schema, contract) → các role khác triển khai đúng theo đó, không tự sáng tác cấu trúc riêng.
- **QA là cổng chặn cuối** trước khi merge — đặc biệt quan trọng để đảm bảo "thêm module mới không phá vỡ module cũ" (Open/Closed principle), vốn là mục tiêu cốt lõi của cả framework.
- Khi 1 role không chắc quyết định của mình có đúng kiến trúc không → quay lại hỏi `architect`, không tự đoán.
