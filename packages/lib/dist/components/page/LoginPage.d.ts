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
    /** Google 로그인 핸들러 (Firebase 등) */
    onGoogleLogin?: () => Promise<{
        token: string;
        user: User;
    }>;
    /** 테스트 계정 표시 여부 */
    showTestAccount?: boolean;
    /** Supabase Auth 사용 여부 (기본: true) */
    useSupabase?: boolean;
}
export declare function LoginPage({ redirectPath, onLoginSuccess, appName, logo, onGoogleLogin, showTestAccount, useSupabase, }: LoginPageProps): import("react/jsx-runtime").JSX.Element;
export default LoginPage;
//# sourceMappingURL=LoginPage.d.ts.map