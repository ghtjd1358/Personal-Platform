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

export const OWNER_EMAIL = process.env.REACT_APP_OWNER_EMAIL ?? '';

export function usePermission() {
  const user = useSelector(selectUser);

  const can = useCallback(
    (code: string, action: PermissionAction = 'read'): boolean => hasPermission(user, code, action),
    [user]
  );

  const canAny = useCallback(
    (codes: string[], action: PermissionAction = 'read'): boolean => hasAnyPermission(user, codes, action),
    [user]
  );

  const canAll = useCallback(
    (codes: string[], action: PermissionAction = 'read'): boolean => hasAllPermissions(user, codes, action),
    [user]
  );

  const isRole = useCallback(
    (roles: UserRole | UserRole[]): boolean => hasRole(user, roles),
    [user]
  );

  // OWNER_EMAIL 미설정(빈 문자열) 시 isOwner는 항상 false — 빈 email과의 우발적 매치 방지
  const isOwner = useMemo(
    () => !!OWNER_EMAIL && !!user?.email && user.email === OWNER_EMAIL,
    [user]
  );
  const isAdmin = useMemo(() => isOwner || user?.role === 'admin', [user, isOwner]);

  const canEditResource = useCallback(
    (resourceUserId?: string | null): boolean => {
      if (!user) return false;
      if (isOwner) return true;
      if (!isAdmin) return false;
      return !!resourceUserId && resourceUserId === user.id;
    },
    [user, isOwner, isAdmin]
  );

  const checkMenu = useCallback(
    (permission?: MenuPermission): boolean => checkMenuPermission(user, permission),
    [user]
  );

  const filterMenus = useCallback(
    (menus: MenuItem[]): MenuItem[] => filterMenusByPermission(menus, user),
    [user]
  );

  const canAccess = useCallback(
    (menus: MenuItem[], path: string): boolean => canAccessPath(menus, path, user),
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