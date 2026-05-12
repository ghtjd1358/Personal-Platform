/**
 * 라우트 가드 컴포넌트
 * 인증/권한 기반 라우팅 보호
 */
import React from 'react';
export interface RouteGuardProps {
    children: React.ReactNode;
}
export interface PrivateRouteProps extends RouteGuardProps {
    /** 미인증 시 리다이렉트 경로 */
    redirectTo?: string;
    /** 필요한 역할 (roles 중 하나라도 있으면 통과) */
    roles?: string[];
    /** 권한 없음 시 리다이렉트 경로 */
    forbiddenRedirectTo?: string;
    /** 로딩 컴포넌트 */
    fallback?: React.ReactNode;
}
export interface PublicRouteProps extends RouteGuardProps {
    /** 인증된 경우 리다이렉트 경로 */
    redirectTo?: string;
    /** 인증 여부와 관계없이 접근 허용 */
    restricted?: boolean;
}
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
export declare const PrivateRoute: React.FC<PrivateRouteProps>;
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
export declare const PublicRoute: React.FC<PublicRouteProps>;
/**
 * RoleRoute - 특정 역할만 접근 가능
 *
 * @example
 * <RoleRoute roles={['admin', 'manager']}>
 *   <AdminDashboard />
 * </RoleRoute>
 */
export declare const RoleRoute: React.FC<{
    children: React.ReactNode;
    roles: string[];
    fallback?: React.ReactNode;
    redirectTo?: string;
}>;
declare const _default: {
    PrivateRoute: React.FC<PrivateRouteProps>;
    PublicRoute: React.FC<PublicRouteProps>;
    RoleRoute: React.FC<{
        children: React.ReactNode;
        roles: string[];
        fallback?: React.ReactNode;
        redirectTo?: string;
    }>;
};
export default _default;
//# sourceMappingURL=RouteGuard.d.ts.map