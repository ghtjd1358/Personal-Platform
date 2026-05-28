/**
 * RoutesGuestPages - 비로그인 사용자용 라우트 (단순화)
 */
import { useCallback } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { LoginPage, getSupabase } from '@sonhoseong/mfa-lib';
import { RoutePath } from './paths';

function RoutesGuestPages() {
    const handleGoogleLogin = useCallback(async () => {
        const supabase = getSupabase();
        await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: { redirectTo: `${window.location.origin}/dashboard` },
        });
        // 브라우저가 Google로 redirect — 이 아래는 실행되지 않음
        await new Promise<never>(() => {});
        return {} as any;
    }, []);

    return (
        <Routes>
            <Route
                path={RoutePath.Login}
                element={
                    <LoginPage
                        appName="Portfolio"
                        redirectPath="/dashboard"
                        showTestAccount={true}
                        onGoogleLogin={handleGoogleLogin}
                    />
                }
            />
            <Route path="*" element={<Navigate to={RoutePath.Login} replace />} />
        </Routes>
    );
}

export { RoutesGuestPages };
