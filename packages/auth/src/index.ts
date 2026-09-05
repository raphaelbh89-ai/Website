import { RoleCode } from '@school-cms/shared';

export interface UserContext {
  userId: string;
  email: string;
  roles: RoleCode[];
  branchId?: string | null;
}

/**
 * Kiểm tra xem người dùng có quyền truy cập hoặc chỉnh sửa tài nguyên theo cơ sở hay không
 */
export function canAccessBranchResource(user: UserContext, resourceBranchId?: string | null): boolean {
  // Super Admin có quyền truy cập tất cả
  if (user.roles.includes(RoleCode.SUPER_ADMIN)) {
    return true;
  }

  // Nếu tài nguyên là toàn cục (resourceBranchId is null), chỉ Super Admin hoặc Global Editor mới được sửa
  if (!resourceBranchId) {
    return user.roles.includes(RoleCode.SUPER_ADMIN) || (!user.branchId && user.roles.includes(RoleCode.CONTENT_EDITOR));
  }

  // Quản trị viên cơ sở hoặc nhân viên cơ sở chỉ thao tác trên cơ sở của mình
  return user.branchId === resourceBranchId;
}
