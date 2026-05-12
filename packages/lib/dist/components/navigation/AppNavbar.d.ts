import React from 'react';
export interface AppNavbarProps {
    /** 앱 이름/타이틀 */
    appName?: string;
    /** 로고 클릭 시 이동할 경로 */
    homePath?: string;
    /** 관리 페이지 경로 */
    adminPath?: string;
    /** 로그인 페이지 경로 */
    loginPath?: string;
    /** 인증 상태 */
    isAuthenticated: boolean;
    /** 사용자 이름 */
    userName?: string;
    /** 로그아웃 핸들러 */
    onLogout: () => void;
    /** 네비게이션 함수 */
    onNavigate: (path: string) => void;
    /** 추가 네비게이션 링크 */
    extraLinks?: Array<{
        label: string;
        path: string;
        isActive?: boolean;
    }>;
}
/**
 * 공통 네비게이션 바 - KOMCA 패턴
 * Remote 앱 단독 실행 시 사용
 */
export declare const AppNavbar: React.FC<AppNavbarProps>;
export default AppNavbar;
//# sourceMappingURL=AppNavbar.d.ts.map