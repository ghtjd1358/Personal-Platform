import { useCallback } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { LoginPage, getSupabase } from '@sonhoseong/mfa-lib';
import { RoutePath } from './paths';
import AuthCallbackPage from '../AuthCallbackPage';

// Node.js 백엔드가 Google 코드를 처리하고 access_token_once 쿠키 set 후 /auth/callback으로 redirect
const OAUTH_REDIRECT = `${process.env.REACT_APP_API_URL ?? 'http://localhost:4000'}/auth/google/callback`;

function RoutesGuestPages() {
    const handleGoogleLogin = useCallback(async () => {
        const supabase = getSupabase();
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: { redirectTo: OAUTH_REDIRECT },
        });
        if (error) {
            console.error('[Auth] Google 로그인 실패:', error);
            throw error;
        }
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
