/**
 * 권한·사용자 타입 (KOMCA 패턴)
 */

/** 사용자 역할 */
export type UserRole = 'admin' | 'user' | 'editor' | 'viewer' | 'guest';

/** 권한 액션 타입 */
export type PermissionAction = 'read' | 'write' | 'delete' | 'admin';

/** 개별 권한 */
export interface Permission {
  /** 메뉴/리소스 코드 */
  code: string;
  /** 허용된 액션 목록 */
  actions: PermissionAction[];
}

/** 사용자 타입 */
export interface User {
  id: string;
  name: string;
  email: string;
  role?: UserRole | string;
  avatar?: string;
  /** 사용자 권한 목록 */
  permissions?: Permission[];
}

/** 메뉴 권한 요구사항 */
export interface MenuPermission {
  /** 필요한 메뉴 코드 (OR 조건) */
  requiredCodes?: string[];
  /** 필요한 역할 (OR 조건) */
  requiredRoles?: UserRole[];
  /** 필요한 액션 */
  requiredAction?: PermissionAction;
}
