/**
 * RoutesGuestPages - 비로그인 사용자용 라우트 (단순화)
 */
import { useCallback } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { LoginPage, getSupabase } from '@sonhoseong/mfa-lib';
import { RoutePath } from './paths';
import AuthCallbackPage from '../AuthCallbackPage';

function RoutesGuestPages() {
    const handleGoogleLogin = useCallback(async () => {
        const supabase = getSupabase();
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: { redirectTo: `${window.location.origin}/auth/callback` },
        });
        if (error) {
            // 팝업 차단 또는 Supabase 오류 시 LoginPage 의 catch 블록으로 전달
            console.error('[Auth] Google 로그인 실패:', error);
            throw error;
        }
        // 성공 시 브라우저가 Google 로 redirect — 이 아래는 실행되지 않음
        // (void 반환은 LoginPage 가 redirect 케이스로 인식하여 추가 동작 안 함)
    }, []);

    return (
        <Routes>
            <Route
                path={RoutePath.Login}
                element={
                    <LoginPage
                        appName="Portfolio"
                        redirectPath="/dashboard"
                        onGoogleLogin={handleGoogleLogin}
                    />
                }
            />
            <Route path={RoutePath.AuthCallback} element={<AuthCallbackPage />} />
            <Route path="*" element={<Navigate to={RoutePath.Login} replace />} />
        </Routes>
    );
}

export { RoutesGuestPages };
