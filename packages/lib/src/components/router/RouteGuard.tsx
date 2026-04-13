/**
 * 라우트 가드 컴포넌트
 * 인증/권한 기반 라우팅 보호
 */
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated, selectUser } from '../../store/app-store';

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
export const PrivateRoute: React.FC<PrivateRouteProps> = ({
  children,
  redirectTo = '/login',
  roles,
  forbiddenRedirectTo = '/forbidden',
  fallback = null,
}) => {
  const location = useLocation();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);

  // 인증되지 않은 경우
  if (!isAuthenticated) {
    // 현재 경로를 state로 전달하여 로그인 후 복귀 가능하게
    return (
      <Navigate
        to={redirectTo}
        state={{ from: location.pathname + location.search }}
        replace
      />
    );
  }

  // 역할 기반 권한 체크
  if (roles && roles.length > 0) {
    const userRole = user?.role;
    const hasRequiredRole = userRole && roles.includes(userRole);

    if (!hasRequiredRole) {
      return <Navigate to={forbiddenRedirectTo} replace />;
    }
  }

  return <>{children}</>;
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
export const PublicRoute: React.FC<PublicRouteProps> = ({
  children,
  redirectTo = '/',
  restricted = true,
}) => {
  const location = useLocation();
  const isAuthenticated = useSelector(selectIsAuthenticated);

  // restricted가 true이고 인증된 경우 리다이렉트
  if (restricted && isAuthenticated) {
    // 이전 페이지로 복귀하거나 기본 경로로 이동
    const from = (location.state as any)?.from || redirectTo;
    return <Navigate to={from} replace />;
  }

  return <>{children}</>;
};

/**
 * RoleRoute - 특정 역할만 접근 가능
 *
 * @example
 * <RoleRoute roles={['admin', 'manager']}>
 *   <AdminDashboard />
 * </RoleRoute>
 */
export const RoleRoute: React.FC<{
  children: React.ReactNode;
  roles: string[];
  fallback?: React.ReactNode;
  redirectTo?: string;
}> = ({
  children,
  roles,
  fallback = null,
  redirectTo,
}) => {
  const user = useSelector(selectUser);
  const userRole = user?.role;

  const hasRole = userRole && roles.includes(userRole);

  if (!hasRole) {
    if (redirectTo) {
      return <Navigate to={redirectTo} replace />;
    }
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

export default { PrivateRoute, PublicRoute, RoleRoute };
