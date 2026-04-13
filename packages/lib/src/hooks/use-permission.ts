/**
 * usePermission Hook
 * 권한 기반 접근 제어를 위한 훅
 */

import { useMemo, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from '../store/app-store';
import {
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  hasRole,
  checkMenuPermission,
  filterMenusByPermission,
  canAccessPath,
} from '../utils/permission';
import { UserRole, PermissionAction, MenuItem, MenuPermission } from '../types';

/**
 * usePermission Hook
 * 현재 사용자의 권한을 확인하는 훅
 */
export function usePermission() {
  const user = useSelector(selectUser);

  /**
   * 특정 코드에 대한 권한 확인
   */
  const can = useCallback(
    (code: string, action: PermissionAction = 'read'): boolean => {
      return hasPermission(user, code, action);
    },
    [user]
  );

  /**
   * 여러 코드 중 하나라도 권한이 있는지 확인
   */
  const canAny = useCallback(
    (codes: string[], action: PermissionAction = 'read'): boolean => {
      return hasAnyPermission(user, codes, action);
    },
    [user]
  );

  /**
   * 모든 코드에 대한 권한이 있는지 확인
   */
  const canAll = useCallback(
    (codes: string[], action: PermissionAction = 'read'): boolean => {
      return hasAllPermissions(user, codes, action);
    },
    [user]
  );

  /**
   * 특정 역할인지 확인
   */
  const isRole = useCallback(
    (roles: UserRole | UserRole[]): boolean => {
      return hasRole(user, roles);
    },
    [user]
  );

  /**
   * 관리자 여부
   */
  const isAdmin = useMemo(() => user?.role === 'admin', [user]);

  /**
   * 메뉴 권한 체크
   */
  const checkMenu = useCallback(
    (permission?: MenuPermission): boolean => {
      return checkMenuPermission(user, permission);
    },
    [user]
  );

  /**
   * 메뉴 필터링
   */
  const filterMenus = useCallback(
    (menus: MenuItem[]): MenuItem[] => {
      return filterMenusByPermission(menus, user);
    },
    [user]
  );

  /**
   * 특정 경로 접근 가능 여부
   */
  const canAccess = useCallback(
    (menus: MenuItem[], path: string): boolean => {
      return canAccessPath(menus, path, user);
    },
    [user]
  );

  return {
    user,
    can,
    canAny,
    canAll,
    isRole,
    isAdmin,
    checkMenu,
    filterMenus,
    canAccess,
  };
}

export default usePermission;