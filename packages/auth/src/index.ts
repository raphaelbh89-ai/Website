export { RoleCode } from '@school-cms/shared';
import { RoleCode } from '@school-cms/shared';

export interface UserContext {
  userId: string;
  name: string;
  email: string;
  roles: RoleCode[];
  branchId?: string | null; // null = Toàn hệ thống
}

export type PermissionCode =
  | 'system:manage'
  | 'branches:manage'
  | 'pages:read'
  | 'pages:write'
  | 'pages:publish'
  | 'articles:read'
  | 'articles:write'
  | 'articles:publish'
  | 'leads:read'
  | 'leads:write'
  | 'leads:export'
  | 'theme:manage'
  | 'forms:manage';

export interface PermissionDefinition {
  code: PermissionCode;
  name: string;
  category: 'system' | 'content' | 'admissions' | 'settings';
}

export const ALL_PERMISSIONS: PermissionDefinition[] = [
  { code: 'system:manage', name: 'Quản trị hệ thống & Cấu hình', category: 'system' },
  { code: 'branches:manage', name: 'Quản lý cơ sở & chi nhánh', category: 'system' },
  { code: 'pages:read', name: 'Xem danh sách & nội dung trang', category: 'content' },
  { code: 'pages:write', name: 'Soạn thảo & cập nhật block trang', category: 'content' },
  { code: 'pages:publish', name: 'Xuất bản trang ra Edge CDN', category: 'content' },
  { code: 'articles:read', name: 'Xem danh sách bài viết & tin tức', category: 'content' },
  { code: 'articles:write', name: 'Viết & chỉnh sửa bài viết', category: 'content' },
  { code: 'articles:publish', name: 'Duyệt & xuất bản bài viết', category: 'content' },
  { code: 'leads:read', name: 'Xem hồ sơ phụ huynh tuyển sinh', category: 'admissions' },
  { code: 'leads:write', name: 'Cập nhật trạng thái & ghi chú CRM', category: 'admissions' },
  { code: 'leads:export', name: 'Xuất danh sách hồ sơ ra Excel/CSV', category: 'admissions' },
  { code: 'theme:manage', name: 'Tùy biến theme & bảng màu', category: 'settings' },
  { code: 'forms:manage', name: 'Thiết kế biểu mẫu động', category: 'settings' },
];

export const RolePermissions: Record<RoleCode, PermissionCode[]> = {
  [RoleCode.SUPER_ADMIN]: [
    'system:manage',
    'branches:manage',
    'pages:read',
    'pages:write',
    'pages:publish',
    'articles:read',
    'articles:write',
    'articles:publish',
    'leads:read',
    'leads:write',
    'leads:export',
    'theme:manage',
    'forms:manage',
  ],
  [RoleCode.CAMPUS_DIRECTOR]: [
    'pages:read',
    'pages:write',
    'pages:publish',
    'articles:read',
    'articles:write',
    'articles:publish',
    'leads:read',
    'leads:write',
    'leads:export',
    'forms:manage',
  ],
  [RoleCode.CONTENT_EDITOR]: [
    'pages:read',
    'pages:write',
    'articles:read',
    'articles:write',
  ],
  [RoleCode.ADMISSIONS_OFFICER]: [
    'leads:read',
    'leads:write',
  ],
  [RoleCode.PARENT]: [],
  [RoleCode.STUDENT]: [],
};

/**
 * Kiểm tra xem người dùng có quyền cụ thể hay không
 */
export function hasPermission(user: UserContext, permission: PermissionCode): boolean {
  return user.roles.some((role) => RolePermissions[role]?.includes(permission));
}

/**
 * Kiểm tra xem người dùng có quyền truy cập hoặc chỉnh sửa tài nguyên theo cơ sở hay không (Scope Check)
 */
export function canAccessBranchResource(user: UserContext, resourceBranchId?: string | null): boolean {
  // Super Admin có quyền truy cập tất cả
  if (user.roles.includes(RoleCode.SUPER_ADMIN)) {
    return true;
  }

  // Nếu tài nguyên là toàn cục (resourceBranchId is null), chỉ Super Admin hoặc tài khoản không gán branchId mới được sửa
  if (!resourceBranchId) {
    return user.roles.includes(RoleCode.SUPER_ADMIN) || (!user.branchId && user.roles.includes(RoleCode.CONTENT_EDITOR));
  }

  // Quản trị viên cơ sở hoặc nhân viên cơ sở chỉ thao tác trên cơ sở của mình
  return user.branchId === resourceBranchId;
}

/**
 * Cấu trúc bản ghi Audit Log (Nhật ký kiểm toán hệ thống)
 */
export interface AuditLogEntry {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: string;
  branchId?: string | null;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'PUBLISH' | 'EXPORT' | 'STATUS_CHANGE';
  entityType: 'PAGE' | 'ARTICLE' | 'BRANCH' | 'LEAD' | 'FORM' | 'THEME' | 'USER' | 'ROLE' | 'MENU' | 'TRANSLATION' | 'PAYMENT';
  entityId: string;
  entityTitle?: string;
  details?: Record<string, any>;
  ipAddress?: string;
}
