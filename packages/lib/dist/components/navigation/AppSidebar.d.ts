/**
 * AppSidebar - KOMCA 패턴
 *
 * 사이드바 네비게이션 컴포넌트
 * Remote 앱 단독 실행 시 사용
 */
import React from 'react';
export interface SidebarMenuItem {
    id: string;
    title: string;
    path?: string;
    icon?: React.ReactNode;
    children?: SidebarMenuItem[];
}
export interface AppSidebarProps {
    /** 앱 이름 */
    appName?: string;
    /** 로그인 여부 */
    isAuthenticated?: boolean;
    /** 사용자 이름 */
    userName?: string;
    /** 사용자 이메일 */
    userEmail?: string;
    /** 메뉴 아이템 */
    menuItems?: SidebarMenuItem[];
    /** 로그아웃 핸들러 */
    onLogout?: () => void;
    /** 네비게이션 핸들러 */
    onNavigate?: (path: string) => void;
    /** 현재 경로 */
    currentPath?: string;
    /** 커스텀 로고 */
    logo?: React.ReactNode;
    /** 접힌 상태 (외부 제어) */
    collapsed?: boolean;
    /** 접힘 상태 변경 콜백 */
    onCollapsedChange?: (collapsed: boolean) => void;
}
export declare function AppSidebar({ appName, isAuthenticated, userName, userEmail, menuItems, onLogout, onNavigate, currentPath, logo, collapsed: controlledCollapsed, onCollapsedChange, }: AppSidebarProps): import("react/jsx-runtime").JSX.Element;
export default AppSidebar;
//# sourceMappingURL=AppSidebar.d.ts.map