import { useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { selectIsAuthenticated, selectSessionRestoring } from '@sonhoseong/mfa-lib';
import { RoutePath } from './paths';

const FROM_KEY = 'auth_redirect_from';

export function RequireAuth() {
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const sessionRestoring = useSelector(selectSessionRestoring);
    const location = useLocation();

    // 세션 복구 중에는 redirect 금지 — 복구 완료 후 인증 상태 확정
    if (sessionRestoring) return null;

    if (!isAuthenticated) {
        // OAuth flow는 외부 리다이렉트가 React Router state를 초기화하므로 sessionStorage에 보존
        if (location.pathname !== RoutePath.Login && location.pathname !== RoutePath.AuthCallback) {
            sessionStorage.setItem(FROM_KEY, location.pathname);
        }
        return <Navigate to={RoutePath.Login} replace />;
    }
    return <Outlet />;
}

export function consumeRedirectFrom(): string {
    const from = sessionStorage.getItem(FROM_KEY) || RoutePath.Dashboard;
    sessionStorage.removeItem(FROM_KEY);
    return from;
}
