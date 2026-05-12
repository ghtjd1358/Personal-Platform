/**
 * usePermission Hook
 * 권한 기반 접근 제어를 위한 훅
 */
import { UserRole, PermissionAction, MenuItem, MenuPermission } from '../types';
/**
 * 프로젝트 최대주주 email. 추후 env var / DB config 로 이동 권장.
 * 현재는 단일 Owner 프로젝트이므로 하드코딩.
 */
export declare const OWNER_EMAIL = "hoseong1358@gmail.com";
/**
 * usePermission Hook
 * 현재 사용자의 권한을 확인하는 훅
 */
export declare function usePermission(): {
    user: import("..").User | null;
    can: (code: string, action?: PermissionAction) => boolean;
    canAny: (codes: string[], action?: PermissionAction) => boolean;
    canAll: (codes: string[], action?: PermissionAction) => boolean;
    isRole: (roles: UserRole | UserRole[]) => boolean;
    isOwner: boolean;
    isAdmin: boolean;
    canEditResource: (resourceUserId?: string | null) => boolean;
    checkMenu: (permission?: MenuPermission) => boolean;
    filterMenus: (menus: MenuItem[]) => MenuItem[];
    canAccess: (menus: MenuItem[], path: string) => boolean;
};
export default usePermission;
//# sourceMappingURL=use-permission.d.ts.map