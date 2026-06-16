import { UserRole, PermissionAction, MenuItem, MenuPermission } from '../types';
export declare const OWNER_EMAIL: string;
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