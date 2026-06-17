import { useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { selectIsAuthenticated } from '@sonhoseong/mfa-lib';
import { RoutePath } from './paths';

const FROM_KEY = 'auth_redirect_from';

export function RequireAuth() {
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const location = useLocation();

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
