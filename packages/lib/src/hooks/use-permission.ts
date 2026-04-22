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
 * 프로젝트 최대주주 email. 추후 env var / DB config 로 이동 권장.
 * 현재는 단일 Owner 프로젝트이므로 하드코딩.
 */
export const OWNER_EMAIL = 'hoseong1358@gmail.com';

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
   * 최대주주(Owner) 여부 — 프로젝트 전체의 절대 권한 보유자.
   * email 기준 판별 (user_id 로 고정해도 무방하지만 env 이전 시 유연성 위해 email).
   */
  const isOwner = useMemo(
    () => !!user?.email && user.email === OWNER_EMAIL,
    [user]
  );

  /**
   * 관리자 여부 — Owner 는 Admin 의 상위 집합이므로 포함.
   * 면접관 admin 체험 계정은 role='admin' 이지만 isOwner=false → 차등 권한 구현.
   */
  const isAdmin = useMemo(
    () => isOwner || user?.role === 'admin',
    [user, isOwner]
  );

  /**
   * 특정 리소스를 편집할 수 있는지 (Owner 는 모두 가능, Admin 은 본인 user_id 행만).
   * UI 의 ✎/× 버튼 노출 여부 · editor 페이지 폼 disabled 여부 판단용.
   */
  const canEditResource = useCallback(
    (resourceUserId?: string | null): boolean => {
      if (!user) return false;
      if (isOwner) return true;
      if (!isAdmin) return false;
      return !!resourceUserId && resourceUserId === user.id;
    },
    [user, isOwner, isAdmin]
  );

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
    isOwner,
    isAdmin,
    canEditResource,
    checkMenu,
    filterMenus,
    canAccess,
  };
}

export default usePermission;