import { useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { selectIsAuthenticated } from '@sonhoseong/mfa-lib';
import { RoutePath } from './paths';

export function RequireAuth() {
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const location = useLocation();

    if (!isAuthenticated) {
        return <Navigate to={RoutePath.Login} state={{ from: location.pathname }} replace />;
    }
    return <Outlet />;
}
