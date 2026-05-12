/**
 * 권한 관련 유틸리티 (KOMCA 패턴)
 */
import { User, UserRole, PermissionAction, MenuItem, MenuPermission } from '../types';
/**
 * 특정 코드에 대한 권한이 있는지 확인
 */
export declare function hasPermission(user: User | null, code: string, action?: PermissionAction): boolean;
/**
 * 여러 코드 중 하나라도 권한이 있는지 확인 (OR)
 */
export declare function hasAnyPermission(user: User | null, codes: string[], action?: PermissionAction): boolean;
/**
 * 모든 코드에 대한 권한이 있는지 확인 (AND)
 */
export declare function hasAllPermissions(user: User | null, codes: string[], action?: PermissionAction): boolean;
/**
 * 특정 역할인지 확인
 */
export declare function hasRole(user: User | null, roles: UserRole | UserRole[]): boolean;
/**
 * 메뉴 권한 요구사항 충족 여부 확인
 */
export declare function checkMenuPermission(user: User | null, permission?: MenuPermission): boolean;
/**
 * 권한에 따라 메뉴 목록 필터링
 */
export declare function filterMenusByPermission(menus: MenuItem[], user: User | null): MenuItem[];
/**
 * 메뉴에서 특정 경로 접근 권한 확인
 */
export declare function canAccessPath(menus: MenuItem[], path: string, user: User | null): boolean;
//# sourceMappingURL=permission.d.ts.map