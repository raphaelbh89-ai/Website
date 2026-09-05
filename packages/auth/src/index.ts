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
  entityType: 'PAGE' | 'ARTICLE' | 'BRANCH' | 'LEAD' | 'FORM' | 'THEME';
  entityId: string;
  entityTitle?: string;
  details?: Record<string, any>;
  ipAddress?: string;
}
