import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated, selectUser } from '../../store/app-store';
/**
 * PrivateRoute - 인증된 사용자만 접근 가능
 *
 * @example
 * <PrivateRoute redirectTo="/login">
 *   <Dashboard />
 * </PrivateRoute>
 *
 * @example
 * <PrivateRoute roles={['admin']} forbiddenRedirectTo="/forbidden">
 *   <AdminPanel />
 * </PrivateRoute>
 */
export const PrivateRoute = ({ children, redirectTo = '/login', roles, forbiddenRedirectTo = '/forbidden', fallback = null, }) => {
    const location = useLocation();
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const user = useSelector(selectUser);
    // 인증되지 않은 경우
    if (!isAuthenticated) {
        // 현재 경로를 state로 전달하여 로그인 후 복귀 가능하게
        return (_jsx(Navigate, { to: redirectTo, state: { from: location.pathname + location.search }, replace: true }));
    }
    // 역할 기반 권한 체크
    if (roles && roles.length > 0) {
        const userRole = user?.role;
        const hasRequiredRole = userRole && roles.includes(userRole);
        if (!hasRequiredRole) {
            return _jsx(Navigate, { to: forbiddenRedirectTo, replace: true });
        }
    }
    return _jsx(_Fragment, { children: children });
};
/**
 * PublicRoute - 비인증 사용자만 접근 가능 (로그인, 회원가입 등)
 *
 * @example
 * <PublicRoute redirectTo="/dashboard">
 *   <LoginPage />
 * </PublicRoute>
 *
 * @example
 * // restricted=false: 인증 여부와 관계없이 접근 가능
 * <PublicRoute restricted={false}>
 *   <AboutPage />
 * </PublicRoute>
 */
export const PublicRoute = ({ children, redirectTo = '/', restricted = true, }) => {
    const location = useLocation();
    const isAuthenticated = useSelector(selectIsAuthenticated);
    // restricted가 true이고 인증된 경우 리다이렉트
    if (restricted && isAuthenticated) {
        // 이전 페이지로 복귀하거나 기본 경로로 이동
        const from = location.state?.from || redirectTo;
        return _jsx(Navigate, { to: from, replace: true });
    }
    return _jsx(_Fragment, { children: children });
};
/**
 * RoleRoute - 특정 역할만 접근 가능
 *
 * @example
 * <RoleRoute roles={['admin', 'manager']}>
 *   <AdminDashboard />
 * </RoleRoute>
 */
export const RoleRoute = ({ children, roles, fallback = null, redirectTo, }) => {
    const user = useSelector(selectUser);
    const userRole = user?.role;
    const hasRole = userRole && roles.includes(userRole);
    if (!hasRole) {
        if (redirectTo) {
            return _jsx(Navigate, { to: redirectTo, replace: true });
        }
        return _jsx(_Fragment, { children: fallback });
    }
    return _jsx(_Fragment, { children: children });
};
export default { PrivateRoute, PublicRoute, RoleRoute };
