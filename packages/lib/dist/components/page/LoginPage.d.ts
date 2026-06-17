/**
 * LoginPage - KOMCA 패턴
 *
 * 공통 로그인 페이지 컴포넌트
 * Host/Remote 모두에서 사용 가능
 * Supabase Auth 지원
 */
import React from 'react';
import { User } from '../../types';
import './LoginPage.css';
export interface LoginPageProps {
    /** 로그인 성공 후 이동할 경로 (기본: /) */
    redirectPath?: string;
    /** 로그인 성공 콜백 */
    onLoginSuccess?: (user: User) => void;
    /** 앱 이름 (로고 옆에 표시) */
    appName?: string;
    /** 커스텀 로고 컴포넌트 */
    logo?: React.ReactNode;
    /** Google 로그인 핸들러 (Firebase 등)
     * - Firebase 팝업 flow: { token, user } 반환 → LoginPage 가 store 동기화
     * - Supabase OAuth redirect flow: void 반환 (브라우저가 외부로 redirect, 이후 코드 미실행)
     */
    onGoogleLogin?: () => (Promise<{
        token: string;
        user: User;
    } | void> | void);
    /** 테스트 계정 로그인 핸들러 — 제공 시 버튼 표시 */
    onTestLogin?: () => Promise<void>;
}
export declare function LoginPage({ redirectPath, onLoginSuccess, appName, logo, onGoogleLogin, onTestLogin, }: LoginPageProps): import("react/jsx-runtime").JSX.Element;
export default LoginPage;
//# sourceMappingURL=LoginPage.d.ts.map