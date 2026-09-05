# School CMS Framework — Claude Code Scaffold Kit

Bộ file này dùng cho **Claude Code**. Giải nén rồi copy toàn bộ thư mục `.claude/`
vào gốc repo dự án của bạn (nếu đã có `.claude/` sẵn, gộp thủ công từng file).

```
project-root/
├── .claude/
│   ├── agents/        ← 5 subagent (vai trò chuyên trách)
│   ├── skills/         ← 5 skill (quy trình bắt buộc, tái sử dụng)
│   └── commands/       ← 3 slash-command (workflow điều phối)
├── ROLES.md            ← bảng vai trò, tham khảo cho cả người lẫn agent
└── WORKFLOW.md          ← quy trình tổng thể theo giai đoạn
```

## Cách dùng nhanh
1. Mở Claude Code trong thư mục project (đã copy `.claude/` vào).
2. Chạy `/scaffold-project` để khởi tạo Giai đoạn 1 (core: module registry, page builder, admin cơ bản).
3. Mỗi khi cần thêm module mới (vd "Testimonial", "FAQ"), chạy `/add-module <tên module>`.
4. Mỗi khi cần thêm màn hình quản trị cho 1 entity mới, chạy `/build-admin-page <tên entity>`.
5. Claude sẽ tự động điều phối đúng subagent (`architect`, `backend-developer`,
   `frontend-developer`, `admin-ui-developer`, `qa-reviewer`) và tự nạp đúng skill
   liên quan — bạn không cần gọi tay từng subagent.

## Vì sao tách ra 4 loại file?
- **Agent** = ai làm (persona + quyền hạn + tool được dùng).
- **Skill** = làm như thế nào (quy trình/nguyên tắc bắt buộc, nạp vào agent khi cần).
- **Command/Workflow** = làm theo thứ tự nào (điều phối nhiều agent + skill cho 1 mục tiêu cụ thể).
- **Role** = ai chịu trách nhiệm gì ở tầng quản lý dự án (map 1-1 với agent, dùng cả cho người thật nếu team có dev).

Tách như vậy giúp: thêm 1 vai trò mới không phải sửa skill; thêm 1 quy tắc mới không
phải sửa từng agent; đổi thứ tự quy trình không phải sửa logic bên trong agent/skill.
