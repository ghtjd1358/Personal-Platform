/**
 * 권한 관련 유틸리티 (KOMCA 패턴)
 */

import { User, UserRole, Permission, PermissionAction, MenuItem, MenuPermission } from '../types';

// ============================================
// 권한 체크 함수
// ============================================

/**
 * 특정 코드에 대한 권한이 있는지 확인
 */
export function hasPermission(
  user: User | null,
  code: string,
  action: PermissionAction = 'read'
): boolean {
  if (!user) return false;

  // admin은 모든 권한
  if (user.role === 'admin') return true;

  // 권한 목록에서 확인
  const permission = user.permissions?.find((p) => p.code === code);
  if (!permission) return false;

  return permission.actions.includes(action);
}

/**
 * 여러 코드 중 하나라도 권한이 있는지 확인 (OR)
 */
export function hasAnyPermission(
  user: User | null,
  codes: string[],
  action: PermissionAction = 'read'
): boolean {
  if (!user) return false;
  if (user.role === 'admin') return true;

  return codes.some((code) => hasPermission(user, code, action));
}

/**
 * 모든 코드에 대한 권한이 있는지 확인 (AND)
 */
export function hasAllPermissions(
  user: User | null,
  codes: string[],
  action: PermissionAction = 'read'
): boolean {
  if (!user) return false;
  if (user.role === 'admin') return true;

  return codes.every((code) => hasPermission(user, code, action));
}

/**
 * 특정 역할인지 확인
 */
export function hasRole(user: User | null, roles: UserRole | UserRole[]): boolean {
  if (!user || !user.role) return false;

  const roleArray = Array.isArray(roles) ? roles : [roles];
  return roleArray.includes(user.role as UserRole);
}

/**
 * 메뉴 권한 요구사항 충족 여부 확인
 */
export function checkMenuPermission(
  user: User | null,
  permission?: MenuPermission
): boolean {
  // 권한 요구사항이 없으면 모두 접근 가능
  if (!permission) return true;
  if (!user) return false;

  // admin은 모든 권한
  if (user.role === 'admin') return true;

  const { requiredCodes, requiredRoles, requiredAction = 'read' } = permission;

  // 역할 체크 (OR 조건)
  if (requiredRoles && requiredRoles.length > 0) {
    if (!hasRole(user, requiredRoles)) {
      return false;
    }
  }

  // 코드 체크 (OR 조건)
  if (requiredCodes && requiredCodes.length > 0) {
    if (!hasAnyPermission(user, requiredCodes, requiredAction)) {
      return false;
    }
  }

  return true;
}

// ============================================
// 메뉴 필터링 함수
// ============================================

/**
 * 권한에 따라 메뉴 목록 필터링
 */
export function filterMenusByPermission(
  menus: MenuItem[],
  user: User | null
): MenuItem[] {
  return menus
    .filter((menu) => {
      // hidden 메뉴 제외
      if (menu.hidden) return false;

      // 권한 체크
      return checkMenuPermission(user, menu.permission);
    })
    .map((menu) => {
      // 자식 메뉴도 재귀적으로 필터링
      if (menu.children && menu.children.length > 0) {
        const filteredChildren = filterMenusByPermission(menu.children, user);

        // 자식이 모두 필터링되면 부모도 제외
        if (filteredChildren.length === 0) {
          return null;
        }

        return {
          ...menu,
          children: filteredChildren,
        };
      }

      return menu;
    })
    .filter((menu): menu is MenuItem => menu !== null);
}

/**
 * 메뉴에서 특정 경로 접근 권한 확인
 */
export function canAccessPath(
  menus: MenuItem[],
  path: string,
  user: User | null
): boolean {
  // 메뉴에서 해당 경로 찾기
  const findMenu = (items: MenuItem[]): MenuItem | undefined => {
    for (const item of items) {
      if (item.path === path) return item;
      if (item.children) {
        const found = findMenu(item.children);
        if (found) return found;
      }
    }
    return undefined;
  };

  const menu = findMenu(menus);

  // 메뉴에 없는 경로는 기본 허용 (또는 거부로 변경 가능)
  if (!menu) return true;

  return checkMenuPermission(user, menu.permission);
}